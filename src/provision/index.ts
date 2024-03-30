import { blob, bool, Canister, nat, Opt, query, Result, text, update, Vec } from "azle";
import { deploy_collection, get_token_canister_wasm, set_token_canister_wasm } from "./token";
import { PropertyMetadata } from "./types";
import { add_property_request, get_pending_requests, get_request_metadata } from "./request";

export default Canister({
  deploy_collection: update([text, text], Result(text, text), deploy_collection),
  set_token_canister_wasm: update([blob], Result(bool, text), set_token_canister_wasm),
  get_token_canister_wasm: query([], blob, get_token_canister_wasm),

  add_property_request: update([PropertyMetadata], Result(nat, text), add_property_request),
  get_pending_requests: query([], Vec(nat), get_pending_requests),
  get_request_metadata: query([nat], Opt(PropertyMetadata), get_request_metadata),
});
