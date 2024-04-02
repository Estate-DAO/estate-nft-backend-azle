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
import { deploy_collection, get_token_canister_wasm, set_token_canister_wasm } from "./token";
import { PropertyMetadata, RequestInfo } from "./types";
import {
  add_property_request,
  approve_request,
  get_pending_requests,
  get_request_info,
  reject_request,
} from "./request";
import { add_admin, is_admin, remove_admin } from "./admin";
import { initImpl } from "./base";
import { InitArg } from "../estate_dao_nft/types";

export default Canister({
  init: init([], initImpl),

  set_token_canister_wasm: update([blob], Result(bool, text), set_token_canister_wasm),
  get_token_canister_wasm: query([], blob, get_token_canister_wasm),

  is_admin: query([Opt(Principal)], bool, is_admin),
  add_admin: update([Principal], Result(bool, text), add_admin),
  remove_admin: update([Principal], Result(bool, text), remove_admin),

  add_property_request: update([PropertyMetadata], Result(nat, text), add_property_request),
  get_pending_requests: query([], Vec(nat), get_pending_requests),
  get_request_info: query([nat], Opt(RequestInfo), get_request_info),

  approve_request: update([nat], Result(bool, text), approve_request),
  reject_request: update([nat], Result(bool, text), reject_request),
});
