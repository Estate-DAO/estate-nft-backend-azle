import { Opt, Principal, Record, Vec, blob, nat, text } from "azle";

export const AssetStoreArg = Record({
  file_name: text,
  content_type: text,
  content_encoding: text,
  chunk: blob,
});
export type AssetStoreArg = typeof AssetStoreArg.tsType;

export const ApproveFilesArg = Record({
  files: Vec(text),
  asset_canister: Principal,
});
export type ApproveFilesArg = typeof ApproveFilesArg.tsType;
