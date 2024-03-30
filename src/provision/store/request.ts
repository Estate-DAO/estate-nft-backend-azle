import { nat64 } from "azle";
import { InitArg } from "../../estate_dao_nft/types";

export class RequestStore {
  private _counter: nat64;
  private _requestMetadata: Map<nat64, InitArg>;

  constructor() {
    this._counter = 0n;
    this._requestMetadata = new Map();
  }

  get metadata(): ReadonlyMap<nat64, InitArg> {
    return this._requestMetadata;
  }

  private _nextRequestIndex() {
    this._counter += 1n;
    return this._counter;
  }

  addRequest(metadata: InitArg): nat64 {
    const id = this._nextRequestIndex();
    this._requestMetadata.set(id, metadata);
    return id;
  }
}
