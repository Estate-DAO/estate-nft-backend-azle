import { Opt } from "azle";
import { Account } from "./types";

export function toOpt<T>(a?: T): Opt<T> {
  return a ? { Some: a } : { None: null };
}

export function toAccountId(account: Account): string {
  return `${account.owner}#${account.subaccount}`;
}