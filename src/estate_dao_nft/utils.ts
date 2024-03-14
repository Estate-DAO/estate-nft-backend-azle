import { Opt } from "azle";

export function convertToOpt<T>(a?: T): Opt<T> {
  return a ? { Some: a } : { None: null };
}
