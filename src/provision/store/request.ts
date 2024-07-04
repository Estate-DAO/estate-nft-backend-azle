import { None, Principal, Some, jsonReplacer, jsonReviver, nat } from "azle";
import { PropertyMetadata, RequestConfig } from "../types";
import { Store } from "../../common/types";

export class RequestStore implements Store {
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
      property_owner: owner,
      approval_status: { Pending: null },
      token_canister: None,
      asset_canister: None,
    });
    return id;
  }

  deleteRequest(id: nat) {
    this._requestMetadata.delete(id);
    this._requestConfig.delete(id);
  }

  approveRequest(id: nat) {
    const config = this._requestConfig.get(id)!;
    config.approval_status = { Approved: null };

    this._requestMetadata.delete(id);
    this._requestConfig.set(id, config);
  }

  setTokenCanister(id: nat, tokenCanister: Principal) {
    const config = this._requestConfig.get(id)!;
    config.token_canister = Some(tokenCanister);
    this._requestConfig.set(id, config);
  }

  setAssetCanister(id: nat, assetCanister: Principal) {
    const config = this._requestConfig.get(id)!;
    config.asset_canister = Some(assetCanister);
    this._requestConfig.set(id, config);
  }

  rejectRequest(id: nat) {
    const config = this._requestConfig.get(id)!;
    config.approval_status = { Rejected: null };

    this._requestMetadata.delete(id);
    this._requestConfig.set(id, config);
  }

  serialize(): string | undefined {
    const toSerialize = {
      counter: this._counter,
      metadata: [] as [nat, PropertyMetadata][],
      config: [] as [nat, RequestConfig][],
    };

    this._requestMetadata.forEach((val, key) => {
      toSerialize.metadata.push([key, val]);
    });

    this._requestConfig.forEach((val, key) => {
      toSerialize.config.push([key, val]);
    });

    return JSON.stringify(toSerialize, jsonReplacer);
  }

  deserialize(serialized: string): void {
    const {
      metadata,
      config,
      counter,
    }: {
      metadata: [nat, PropertyMetadata][];
      config: [nat, RequestConfig][];
      counter: nat;
    } = JSON.parse(serialized, jsonReviver);

    metadata.forEach(([key, val]) => {
      this._requestMetadata.set(key, val);
    });

    config.forEach(([key, val]) => {
      this._requestConfig.set(key, val);
    });

    this._counter = counter;
  }
}
