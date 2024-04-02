import { Record, text } from "azle";
import { InitArgRaw } from "../../estate_dao_nft/types";

const { property_owner: _, ...PropertyMetadataRaw } = InitArgRaw;
export const PropertyMetadata = Record({
  ...PropertyMetadataRaw,
});
export type PropertyMetadata = typeof PropertyMetadata.tsType;

export enum RequestApprovalStatus {
  PENDING,
  APPROVED,
  REJECTED
};

export type RequestConfig = {
  property_owner: text;
  approval_status: RequestApprovalStatus;
  token_canister?: text;
}