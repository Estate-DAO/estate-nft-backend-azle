import { Principal } from "azle";
import AssetCanister from '../asset/index';

export function getAssetCanister(principal: Principal) {
  return AssetCanister(principal);
}
