import { Canister, Void, query, update } from "azle";
import { DeleteArgs, GetArgs, GetRes, StoreArgs } from "./types";

export default Canister({
  store: update([StoreArgs], Void),
  delete_asset: update([DeleteArgs], Void),
  get: query([GetArgs], GetRes),
});