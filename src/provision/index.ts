import {
  blob,
  bool,
  Canister,
  init,
  nat,
  Opt,
  Principal,
  query,
  Result,
  text,
  update,
  Vec,
} from "azle";
import { PropertyMetadata, PropertyStatus, RequestInfo, WasmChunked } from "./types";
import {
  add_property_request,
  approve_request,
  get_pending_requests,
  get_request_info,
  reject_request,
} from "./request";
import { add_admin, is_admin, remove_admin } from "./admin";
import { initImpl } from "./base";
import {
  get_asset_canister_wasm,
  get_token_canister_wasm,
  set_asset_canister_wasm,
  set_token_canister_wasm,
} from "./canister";
import { get_asset_proxy_canister, set_asset_proxy_canister } from "./canister/asset_proxy";
import { list_properties } from "./property";

export default Canister({
  init: init([], initImpl),

  set_token_canister_wasm: update([WasmChunked], Result(bool, text), set_token_canister_wasm),
  get_token_canister_wasm: query([], WasmChunked, get_token_canister_wasm),

  set_asset_canister_wasm: update([WasmChunked], Result(bool, text), set_asset_canister_wasm),
  get_asset_canister_wasm: query([], WasmChunked, get_asset_canister_wasm),

  set_asset_proxy_canister: update([Principal], Result(bool, text), set_asset_proxy_canister),
  get_asset_proxy_canister: query([], Principal, get_asset_proxy_canister),

  is_admin: query([Opt(Principal)], bool, is_admin),
  add_admin: update([Principal], Result(bool, text), add_admin),
  remove_admin: update([Principal], Result(bool, text), remove_admin),

  add_property_request: update([PropertyMetadata], Result(nat, text), add_property_request),
  get_pending_requests: query([], Vec(nat), get_pending_requests),
  get_request_info: query([nat], Opt(RequestInfo), get_request_info),

  approve_request: update([nat], Result(bool, text), approve_request),
  reject_request: update([nat], Result(bool, text), reject_request),

  list_properties: update([Opt(PropertyStatus)], Vec(nat), list_properties),
});
