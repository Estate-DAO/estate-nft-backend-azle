import { None, Principal, Some, nat } from "azle";
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
      property_owner: owner,
      approval_status: { Pending: null },
      token_canister: None,
    });
    return id;
  }

  approveRequest(id: nat, tokenCanister: Principal) {
    const config = this._requestConfig.get(id)!;
    config.approval_status = { Approved: null };
    config.token_canister = Some(tokenCanister);

    this._requestMetadata.delete(id);
    this._requestConfig.set(id, config);
  }

  rejectRequest(id: nat) {
    const config = this._requestConfig.get(id)!;
    config.approval_status = { Rejected: null };

    this._requestMetadata.delete(id);
    this._requestConfig.set(id, config);
  }
}
