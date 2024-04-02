import { WasmStore as WasmStoreClass } from "./wasm";
import { RequestStore as RequestStoreClass } from "./request";
import { AdminStore as AdminStoreClass } from "./admin";

export const WasmStore = new WasmStoreClass();
export const RequestStore = new RequestStoreClass();
export const AdminStore = new AdminStoreClass();
