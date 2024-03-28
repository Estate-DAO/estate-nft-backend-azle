import { blob } from "azle";
import { readFile } from "fs/promises";
import path from "path";

export type OkResult = {
  Ok: bigint;
};

export async function loadTokenCanisterWasm(): Promise<blob> {
  const wasm = path.resolve(".azle", "estate_dao_nft", "estate_dao_nft.wasm.gz");
  const wasmBlob = await readFile(wasm);
  return wasmBlob;
}
