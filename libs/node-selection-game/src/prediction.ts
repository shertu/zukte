import {
  Sequential,
  Tensor1D,
  Tensor2D,
  layers,
  losses,
  oneHot,
  sequential,
  tensor1d,
  tidy,
  train,
} from '@tensorflow/tfjs';

import {ScoredNodeSelection} from './scored-node-selection';

const ADDITIONAL_FEATURE_COUNT = 2;

/**
 * Create NodeSelectionGame node selection model.
 */
function createNodeSelectionGameModel(nodes: string[], k: number) {
  const model = sequential();

  // Define the input layer.
  // The features are stored in a two-dimensional [one_hot(node), score, diff]... array.
  model.add(
    layers.flatten({
      inputShape: [nodes.length + ADDITIONAL_FEATURE_COUNT, k],
    })
  );

  // Define the first hidden layer.
  model.add(layers.dense({activation: 'relu', units: 32}));

  // Define a dropout regularization layer.
  model.add(layers.dropout({rate: 0.2}));

  // Define the output layer. The no. of units represents no. of classes.
  model.add(
    layers.dense({
      activation: 'softmax',
      units: nodes.length,
    })
  );

  // # Construct the layers into a model that TensorFlow can execute.
  // # Notice that the loss function for multi-class classification
  // # is different than the loss function for binary classification.

  model.compile({
    loss: losses.softmaxCrossEntropy, //'sparse_categorical_crossentropy'
    optimizer: train.adam(),
  });

  return model;
}

/**
 * A TensorFlow model for predicting the next move.
 */
export class NodeSelectionGameAi {
  public model: Sequential;
  private nodes: string[];
  private k: number;

  /**
   * Creates an instance of {@link NodeSelectionGameAi}.
   * @param nodes
   * @param k
   */
  constructor(nodes: string[], k = 32) {
    this.nodes = nodes;
    this.k = k;
    this.model = createNodeSelectionGameModel(nodes, k);
  }

  /**
   * Convert the input data to tensors that we can use for machine
   * learning.
   */
  private convertToInputTensor(data: ScoredNodeSelection[]) {
    const map = new Map(
      this.nodes.map<[string, number]>((node, i) => [node, i])
    );

    const encodeX = data.map(v => ({
      diff: v.diff ? 1 : 0,
      normalized: v.normalized,
      value: map.get(v.value) ?? -1,
    }));

    return tidy(() => {
      const xValues = encodeX.map(v => v.value);
      const inputs = oneHot(xValues, this.nodes.length).concat(
        encodeX.map(v => [v.normalized, v.diff]),
        1
      );

      return inputs as Tensor2D;
    });
  }

  /**
   * Convert the label data to tensors that we can use for machine
   * learning.
   */
  private convertToLabelTensor(data: ScoredNodeSelection) {
    return tidy(() => {
      const labels = this.nodes.map<boolean>(node => node === data.value);
      return tensor1d(labels, 'bool');
    });
  }

  /**
   * Runs a single gradient update on a single batch of data.
   */
  public async train(x: ScoredNodeSelection[], y: ScoredNodeSelection) {
    if (x.length === this.k) {
      const xTensor = this.convertToInputTensor(x);
      const yTensor = this.convertToLabelTensor(y);
      this.model.trainOnBatch(xTensor, yTensor);
    } else {
      throw new Error(
        `The model requires ${this.k} inputs to train and predict on.`
      );
    }
  }

  /**
   * Generates output predictions for the input samples.
   */
  public async predict(x: ScoredNodeSelection[]): Promise<number[]> {
    if (x.length === this.k) {
      const xTensor = this.convertToInputTensor(x);
      const yTensor = this.model.predict(xTensor) as Tensor1D;
      return await yTensor.array();
    } else {
      throw new Error(
        `The model requires ${this.k} inputs to train and predict on.`
      );
    }
  }
}
