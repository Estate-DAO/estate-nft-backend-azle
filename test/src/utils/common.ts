import { Principal } from "azle";

export type OkResult = {
  Ok: bigint;
};

export type Account = {
  owner: Principal;
  subaccount: [] | [Uint8Array[]]
}