import { blob } from "azle";

export class WasmStore {
  private _tokenCanisterWasm: blob;

  constructor() {
    this._tokenCanisterWasm = new Uint8Array();
  }

  get tokenCanisterWasm(): blob {
    return this._tokenCanisterWasm;
  }

  updateTokenCanisterWasm(wasm: blob) {
    this._tokenCanisterWasm = wasm;
  }
}
