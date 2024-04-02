import { Principal, nat } from "azle";
import { PropertyMetadata, RequestApprovalStatus, RequestConfig } from "../types";

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
      property_owner: owner.toString(),
      approval_status: RequestApprovalStatus.PENDING
    });
    return id;
  }

  approveRequest(id: nat, tokenCanister: string) {
    const config = this._requestConfig.get(id)!;
    config.approval_status = RequestApprovalStatus.APPROVED;
    config.token_canister = tokenCanister;

    this._requestMetadata.delete(id);
    this._requestConfig.set(id, config);
  }

  rejectRequest(id: nat) {
    const config = this._requestConfig.get(id)!;
    config.approval_status = RequestApprovalStatus.REJECTED;

    this._requestMetadata.delete(id);
    this._requestConfig.set(id, config);
  }
}
