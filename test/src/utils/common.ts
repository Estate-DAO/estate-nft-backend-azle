import { None, Result, Some, blob } from "azle";
import { readFile } from "fs/promises";
import path from "path";

export type Ok<T> = ReturnType<typeof Result.Ok<T>>;
type Err<T> = ReturnType<typeof Result.Err<T>>;
type Some<T> = [T];
type None = [];

export function isOkResult<T, U>(res: Result<T, U>): res is Ok<T> {
  return (res as Ok<T>).Ok !== undefined;
}

export function isErrResult<T, U>(res: Result<T, U>): res is Err<U> {
  return (res as Err<U>).Err !== undefined;
}

export function isSome<T>(opt: Some<T> | None): opt is Some<T> {
  return (opt as Some<T>).length > 0;
}

export function isNone<T>(opt: Some<T> | None): opt is None {
  return (opt as None).length == 0;
}


export async function loadTokenCanisterWasm(): Promise<blob> {
  const wasm = path.resolve(".azle", "estate_dao_nft", "estate_dao_nft.wasm.gz");
  const wasmBlob = await readFile(wasm);
  return wasmBlob;
}
