import { WasmChunked } from "../types";

export class WasmChunkedStore {
  private _wasm: WasmChunked;

  constructor() {
    this._wasm = {
      chunkHashes: [],
      moduleHash: new Uint8Array(),
    };
  }

  get wasm(): WasmChunked {
    return this._wasm;
  }

  async store(wasm: WasmChunked) {
    this._wasm = wasm;
  }

  async clear() {
    this._wasm = {
      chunkHashes: [],
      moduleHash: new Uint8Array()
    }
  }
}
