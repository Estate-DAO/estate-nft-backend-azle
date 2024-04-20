import { Null, Opt, Principal, Record, Some, Variant, Vec, blob, bool, text } from "azle";
import { MetadataRaw } from "../../estate_dao_nft/types";

const { property_owner: _1, asset_canister: _3, ...PropertyMetadataRaw } = MetadataRaw;

export const PropertyMetadata = Record(PropertyMetadataRaw);
export type PropertyMetadata = typeof PropertyMetadata.tsType;

const RequestApprovalStatus = Variant({
  Pending: Null,
  Approved: Null,
  Rejected: Null,
});

const RequestConfigRaw = {
  property_owner: Principal,
  approval_status: RequestApprovalStatus,
  token_canister: Opt(Principal),
  asset_canister: Opt(Principal),
};

export const RequestConfig = Record(RequestConfigRaw);
export type RequestConfig = typeof RequestConfig.tsType;

export const RequestInfo = Record({
  metadata: Opt(PropertyMetadata),
  ...RequestConfigRaw,
});
export type RequestInfo = typeof RequestInfo.tsType;

export const AssetCanisterArgs = Variant({
  Init: Record({}),
  Upgrade: Null,
});

export const WasmChunked = Record({
  chunkHashes: Vec(blob),
  moduleHash: blob
});
export type WasmChunked = typeof WasmChunked.tsType;