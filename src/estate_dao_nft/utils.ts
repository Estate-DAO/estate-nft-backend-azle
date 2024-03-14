import { Opt } from "azle";

export function toOpt<T>(a?: T): Opt<T> {
  return a ? { Some: a } : { None: null };
}
