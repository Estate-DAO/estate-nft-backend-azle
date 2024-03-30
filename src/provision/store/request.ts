import { Principal, nat } from "azle";
import { PropertyMetadata, RequestConfig } from "../types";

export class RequestStore {
  private _counter: nat;
  private _requestMetadata: Map<nat, PropertyMetadata>;
  private _requestConfig: Map<nat, RequestConfig>;

  constructor() {
    this._counter = 0n;
    this._requestMetadata = new Map();
    this._requestConfig = new Map();
  }

  get metadata(): ReadonlyMap<nat, PropertyMetadata> {
    return this._requestMetadata;
  }

  get config(): ReadonlyMap<nat, RequestConfig> {
    return this._requestConfig;
  }

  private _nextRequestIndex() {
    this._counter += 1n;
    return this._counter;
  }

  addRequest(metadata: PropertyMetadata, owner: Principal): nat {
    const id = this._nextRequestIndex();
    this._requestMetadata.set(id, metadata);
    this._requestConfig.set(id, {
      property_owner: owner.toString()
    });
    return id;
  }
}
