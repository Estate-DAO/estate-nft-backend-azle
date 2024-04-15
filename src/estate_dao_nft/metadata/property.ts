import { Principal, ic } from "azle";
import { MetadataStore, TxnIndexStore } from "../store";
import { PropertyMetadataResult, TxnResult, MetadataUpdateArg } from "../types";
import AssetCanister from "../../asset";

export function isCallerPropertyOwner(): boolean {
  return ic.caller().toString() === MetadataStore.metadata.property_owner.toString();
}

export async function change_ownership(property_owner: Principal): Promise<TxnResult> {
  if (!isCallerPropertyOwner()) return { Err: "Unauthorized" };

  const assetCanister = AssetCanister(MetadataStore.metadata.asset_canister);

  await ic.call(assetCanister.grant_permission, {
    args: [
      {
        to_principal: property_owner,
        permission: { Commit: null },
      },
    ],
  });

  await ic.call(assetCanister.revoke_permission, {
    args: [
      {
        of_principal: MetadataStore.metadata.property_owner,
        permission: { Commit: null },
      },
    ],
  });

  MetadataStore.changeOwnership(property_owner);
  return { Ok: TxnIndexStore.index };
}

export function update_metadata(args: MetadataUpdateArg): TxnResult {
  if (!isCallerPropertyOwner()) return { Err: "Unauthorized" };

  MetadataStore.update(args);
  return { Ok: TxnIndexStore.index };
}

export function get_property_metadata(): PropertyMetadataResult {
  return {
    ...MetadataStore.metadata,
    total_supply: MetadataStore.config.total_supply,
  };
}
