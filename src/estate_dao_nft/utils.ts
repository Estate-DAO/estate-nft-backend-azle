import { Opt } from "azle";
import { Subaccount } from "./types";

export function toOpt<T>(a?: T): Opt<T> {
  return a ? { Some: a } : { None: null };
}

export function toAccountId(principal: string, subaccount?: Subaccount): string {
  let subaccountId = subaccount?.toString() ?? Array(32).fill('0').join();
  return `${principal}#${subaccountId}`;
}

export function bigIntToNumber(a: BigInt): number {
  return parseInt(a.toString());
}

export function iterableToArray<T>(a: Iterable<T>): T[] {
  const arr: T[] = [];

  for ( const item of a ) {
    arr.push(item);
  }

  return arr;
}

export function isSubaccountsEq(a?: Subaccount, b?: Subaccount): boolean {
  const defaultSubaccount = Array(32).fill(0).toString();
  return (a?.toString() ?? defaultSubaccount) === (b?.toString() ?? defaultSubaccount);
}