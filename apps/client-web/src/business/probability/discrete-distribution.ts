import {Chance} from 'chance';

export type ProbabilityFunction<T> = (x: T) => number;

/**
 * https://www.comsol.com/blogs/sampling-random-numbers-from-probability-distribution-functions/
 */
export function sampleDiscreteDistribution<T>(
  interval: T[],
  pFn: ProbabilityFunction<T>
): T {
  if (interval.length === 0) {
    throw new Error('The discrete interval contains no elements.');
  }

  const chance = new Chance();
  const pThreshold: number = Math.random();
  const shuffled = chance.shuffle(interval);

  let i = 0;
  let element: T = shuffled[i];
  let pAccumulator = 0;
  do {
    element = shuffled[i++];
    pAccumulator += pFn(element);
  } while (pAccumulator < pThreshold && i < shuffled.length);

  return element;
}

/**
 * https://www.comsol.com/blogs/sampling-random-numbers-from-probability-distribution-functions/
 */
export function normalizeDiscreteDistribution<T>(
  interval: T[],
  pFn: ProbabilityFunction<T>
): ProbabilityFunction<T> {
  const sum = interval.reduce<number>((a, b) => a + pFn(b), 0);

  /**
   * The normalized probably distribution function.
   */
  function normalized(x: T): number {
    const probability = pFn(x);
    if (sum === 0) {
      return probability;
    } else {
      return probability / sum;
    }
  }

  return normalized;
}
