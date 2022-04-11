import {G} from '../graph';
import {ScoredNodeSelection} from '../scored-node-selection';
import {PFn, uniform_distribution} from './pFn';
import * as tf from '@tensorflow/tfjs';

const HISTORY_LENGTH_THRESHOLD: number = 5;

/**
 * Calculates the probability distribution for the player's next node selection.
 */
export function predictNext(graph: G, history: ScoredNodeSelection[]): PFn {
  if (history.length > HISTORY_LENGTH_THRESHOLD) {
    const s = history.slice(-HISTORY_LENGTH_THRESHOLD);

    // const counts = new NodeValueMap();
    // graph.forEachNode(node => {
    //   const count: number = history.filter(s => s.value === node).length;
    //   counts.set(node, count);
    // });
    // return counts;

    //choose from model
    var intMove = convertToOneHot(myMove);
    var xs = tf.tensor2d(intMove, [1, 3]);
    var logits = model.predict(xs).arraySync()[0];
    //get max
    opMove = moves[getMaxIndex(logits)];

    return uniform_distribution;
  } else {
    return uniform_distribution;
  }
}

function train(reward) {
  var intMove = convertToOneHot(myMove);
  var xs = tf.tensor2d(intMove, [1, 3]);
  var logits = model.predict(xs).arraySync()[0];

  //update model
  logits[opMoveIdx] = logits[opMoveIdx] + reward;
  const ys = tf.tensor2d(logits, [1, 3]);
  model.fit(xs, ys).then(() => {
    plotProbs();
  });
}

// async function example() {
//   // A sequential model is a container which you can add layers to.
//   const model = tf.sequential();

//   // Add a dense layer with 1 output unit.
//   model.add(tf.layers.dense({units: 1, inputShape: [1]}));

//   // Specify the loss type and optimizer for training.
//   model.compile({loss: 'meanSquaredError', optimizer: 'SGD'});

//   // Generate some synthetic data for training.
//   const xs = tf.tensor2d([[1], [2], [3], [4]], [4, 1]);
//   const ys = tf.tensor2d([[1], [3], [5], [7]], [4, 1]);

//   // Train the model.
//   await model.fit(xs, ys, {epochs: 500});

//   // Ater the training, perform inference.
//   const output: Tensor = model.predict(tf.tensor2d([[5]], [1, 1])) as Tensor;
//   output.print();
// }

const [data, setData] = React.useState<Car[]>();

function createModel() {
  // Create a sequential model
  const model = tf.sequential();

  // Add a single input layer
  model.add(tf.layers.dense({inputShape: [1], units: 1, useBias: true}));

  // Add an output layer
  model.add(tf.layers.dense({units: 1, useBias: true}));

  return model;
}

/**
 * Convert the input data to tensors that we can use for machine
 * learning. We will also do the important best practices of _shuffling_
 * the data and _normalizing_ the data
 * MPG on the y-axis.
 */
function convertToTensor(data: ScoredNodeSelection[]) {
  // Wrapping these calculations in a tidy will dispose any
  // intermediate tensors.

  return tf.tidy(() => {
    // Step 1. Shuffle the data
    tf.util.shuffle(data);

    // Step 2. Convert data to Tensor
    const inputs = data.map(d => d.Horsepower);
    const labels = data.map(d => d.normalized);

    const inputTensor = tf.tensor2d(inputs, [inputs.length, 1]);
    const labelTensor = tf.tensor2d(labels, [labels.length, 1]);

    return {
      inputs: normalizedInputs,
      labels: labelTensor,
    };
  });
}

async function trainModel(model, inputs, labels) {
  // Prepare the model for training.
  model.compile({
    optimizer: tf.train.adam(),
    loss: tf.losses.meanSquaredError,
    metrics: ['mse'],
  });

  const batchSize = 32;
  const epochs = 50;

  return await model.fit(inputs, labels, {
    batchSize,
    epochs,
    shuffle: true,
    callbacks: tfvis.show.fitCallbacks(
      {name: 'Training Performance'},
      ['loss', 'mse'],
      {height: 200, callbacks: ['onEpochEnd']}
    ),
  });
}
