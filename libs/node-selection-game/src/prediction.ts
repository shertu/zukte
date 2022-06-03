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
  tensor2d,
  Tensor3D,
} from '@tensorflow/tfjs';
import {convertToFeature} from './prediction-io';

import {ScoredNodeSelection} from './scored-node-selection';

/**
 * Create NodeSelectionGame node selection model.
 */
function createNodeSelectionGameModel<T>(nodes: T[], k: number) {
  const model = sequential();

  /** [one_hot(value), score, diff] */
  const featureCount = nodes.length + 2;

  model.add(layers.inputLayer({inputShape: [k, featureCount]}));
  model.add(layers.reshape({targetShape: [1, featureCount * k]}));
  model.add(layers.dense({activation: 'relu', units: 32}));
  model.add(layers.dropout({rate: 0.2}));
  model.add(
    layers.dense({
      activation: 'softmax',
      kernelInitializer: 'ones',
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
export class NodeSelectionGameAi<T> {
  public model: Sequential;
  private nodes: T[];
  private k: number;

  /**
   * Creates an instance of {@link NodeSelectionGameAi}.
   * @param nodes The nodes in the associated graph.
   * @param k The number of
   */
  constructor(nodes: T[], k = 32) {
    this.nodes = nodes;
    this.k = k;
    this.model = createNodeSelectionGameModel(nodes, k);
  }

  /**
   * Convert the input data to tensors that we can use for machine
   * learning.
   */
  private convertToInputTensor(data: ScoredNodeSelection<T>[]) {
    return tidy(() => {
      const features = convertToFeature<T>(this.nodes, data);
      const indicies = features.map<number>(feature => feature.vindex);

      const vIndexTensor: Tensor2D = oneHot(
        indicies,
        this.nodes.length
      ) as Tensor2D;

      const scoreTensor: Tensor1D = tensor1d(
        features.map(feature => feature.normalized),
        'float32'
      );

      const diffTensor: Tensor1D = tensor1d(
        features.map(feature => feature.diff),
        'bool'
      );

      const otherTensor: Tensor2D = scoreTensor.stack(
        diffTensor.cast('float32'),
        1
      );

      const inputs: Tensor2D = vIndexTensor.concat(otherTensor, 1);
      return inputs;
    });
  }

  /**
   * Convert the label data to tensors that we can use for machine
   * learning.
   */
  private convertToLabelTensor(data: ScoredNodeSelection<T>) {
    return tidy(() => {
      const labels = this.nodes.map<boolean>(node => node === data.value);
      return tensor2d(labels, [1, labels.length], 'bool');
    });
  }

  /**
   * Runs a single gradient update on a single batch of data.
   */
  public async train(x: ScoredNodeSelection<T>[], y: ScoredNodeSelection<T>) {
    if (x.length === this.k) {
      const xTensor = this.convertToInputTensor(x);
      const yTensor = this.convertToLabelTensor(y);
      this.model.trainOnBatch(xTensor.expandDims(0), yTensor.expandDims(0));
    } else {
      throw new Error(`The model requires ${this.k} inputs to train on.`);
    }
  }

  /**
   * Generates output predictions for the input samples.
   */
  public async predict(x: ScoredNodeSelection<T>[]): Promise<number[]> {
    if (x.length === this.k) {
      const xTensor = this.convertToInputTensor(x);
      const prediction = this.model.predict(xTensor.expandDims(0));
      return (prediction as Tensor3D).flatten().array();
    } else {
      throw new Error(`The model requires ${this.k} inputs to train on.`);
    }
  }
}

/**
 * Gets the index of the largest no. in an array.
 */
export function indexOfMax(arr: number[]): number {
  if (arr.length === 0) {
    return -1;
  }

  let max = arr[0];
  let maxIndex = 0;

  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > max) {
      maxIndex = i;
      max = arr[i];
    }
  }

  return maxIndex;
}
