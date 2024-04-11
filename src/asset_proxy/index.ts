import { Canister, Principal, Result, Vec, bool, query, text, update } from "azle";
import { ApproveFilesArg, AssetStoreArg } from "./types";
import { get_provision_canister, get_temp_asset_canister, set_provision_canister, set_temp_asset_canister } from "./canister";
import { approve_files, reject_files, store } from "./asset";

export default Canister({
  get_temp_asset_canister: query([], Principal, get_temp_asset_canister),
  set_temp_asset_canister: update([Principal], Result(bool, text), set_temp_asset_canister),

  get_provision_canister: query([], Principal, get_provision_canister),
  set_provision_canister: update([Principal], Result(bool, text), set_provision_canister),

  store: update([AssetStoreArg], Result(bool, text), store),
  reject_files: update([Vec(text)], Result(bool, text), reject_files),
  approve_files: update([ApproveFilesArg], Result(bool, text), approve_files),
});