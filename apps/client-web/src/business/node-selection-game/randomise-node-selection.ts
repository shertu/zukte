import {NodeValueMap} from '@zukte/node-selection-game';
import {Chance} from 'chance';

export function randomiseNodeSelection(
  m: NodeValueMap,
  chance: Chance.Chance = new Chance()
): string | undefined {
  const a: [string, number][] = [];
  for (const iterator of m) {
    a.push(iterator);
  }

  const b = chance.shuffle(a);

  const nA: string[] = [];
  const nV: number[] = [];
  m.forEach((v, k) => {
    const index: number = chance.natural({max: nA.length});
    nA.splice(index, 0, k);
    nV.splice(index, 0, v);
  });
  const sum = nV.reduce<number>((a, b) => a + b, 0);
  const xThreshold: number = chance.floating({min: 0, max: sum});
  let x = 0;
  for (let i = 0; i < nA.length; i++) {
    const node = nA[i];
    const value = nV[i];
    x += value;
    if (x >= xThreshold) {
      return node;
    }
  }
  if (nA.length > 0) {
    return chance.pickone(nA);
  } else {
    return;
  }
}
