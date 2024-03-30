export function iterableToArray<T>(a: Iterable<T>): T[] {
  const arr: T[] = [];

  for (const item of a) {
    arr.push(item);
  }

  return arr;
}