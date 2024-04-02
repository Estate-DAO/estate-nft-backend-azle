import { Result } from "azle";

export function iterableToArray<T>(a: Iterable<T>): T[] {
  const arr: T[] = [];

  for (const item of a) {
    arr.push(item);
  }

  return arr;
}

export function isOk<O, E>(a: Result<O, E>): a is ReturnType<typeof Result.Ok<O>> {
  return !!a.Ok;
}

export function isErr<O, E>(a: Result<O, E>): a is ReturnType<typeof Result.Err<E>> {
  return !!a.Err;
}