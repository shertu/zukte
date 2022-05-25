import {Chance} from 'chance';

/**
 *
 * @param interval
 * @param pFn
 * @param chance
 * @returns
 */
export function sampleDiscreteDistribution<T>(
  interval: T[],
  pFn: (x: T) => number,
  chance: Chance.Chance = new Chance()
): T {
  /**
   * The sum of the probabilities; ideally equal to one.
   */
  const pSum = interval.reduce<number>((a, b) => a + pFn(b), 0);

  /**
   * The probability threshold the accumulator needs to equal or exceed.
   */
  const pThreshold: number = chance.floating({min: 0, max: pSum});

  /**
   * The probability accumulator.
   */
  let pAccumulator = 0;

  /**
   * The currently sampled element.
   */
  let element: T | undefined;

  const shuffled = chance.shuffle(interval);
  for (let i = 0; i < shuffled.length; i++) {
    element = shuffled[i];
    pAccumulator += pFn(element);
    if (pAccumulator >= pThreshold) {
      break;
    }
  }

  if (element) {
    return element;
  } else {
    throw new Error('Failed to successfully sample a value from ');
  }
}
