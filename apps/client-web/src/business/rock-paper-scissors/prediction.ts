/**
 * A prediction which states that the probability any
 * node being selected is constant.
 */
export function predictConstant<T>(nodes: T[]): number[] {
  const x = 1 / nodes.length;
  return nodes.map<number>(() => x);
}
