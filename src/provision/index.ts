import { blob, bool, Canister, query, Result, text, update, Void } from "azle";
import { deploy_collection, get_token_canister_wasm, set_token_canister_wasm } from "./canister";

export default Canister({
  deploy_collection: update([], Void, deploy_collection),
  set_token_canister_wasm: update([blob], Result(bool, text), set_token_canister_wasm),
  get_token_canister_wasm: query([], blob, get_token_canister_wasm),
});
