import { blob } from "azle";

export class WasmStore {
  private _wasm: blob;

  constructor() {
    this._wasm = new Uint8Array();
  }

  getWasm(): blob {
    return this._wasm;
  }

  updateWasm(wasm: blob) {
    this._wasm = wasm;
  }
}
