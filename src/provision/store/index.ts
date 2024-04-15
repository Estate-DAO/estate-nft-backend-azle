import { WasmStore as WasmStoreClass } from "./wasm";
import { RequestStore as RequestStoreClass } from "./request";
import { AdminStore as AdminStoreClass } from "./admin";
import { CanisterStore as CanisterStoreClass } from "./canister";

export const TokenCanisterWasmStore = new WasmStoreClass();
export const AssetCanisterWasmStore = new WasmStoreClass();
export const RequestStore = new RequestStoreClass();
export const AdminStore = new AdminStoreClass();
export const AssetProxyCanisterStore = new CanisterStoreClass();
