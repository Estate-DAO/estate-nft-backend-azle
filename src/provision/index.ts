import { blob, bool, Canister, nat64, query, Result, text, update } from "azle";
import { deploy_collection, get_token_canister_wasm, set_token_canister_wasm } from "./token";
import { FormMetadata } from "./types";
import { add_property_request } from "./request";

export default Canister({
  deploy_collection: update([text, text], Result(text, text), deploy_collection),
  set_token_canister_wasm: update([blob], Result(bool, text), set_token_canister_wasm),
  get_token_canister_wasm: query([], blob, get_token_canister_wasm),

  add_property_request: update([FormMetadata], Result(nat64, text), add_property_request),
});
