import { Record } from "azle";
import { InitArgRaw } from "../../estate_dao_nft/types";

const { property_owner: _, ...PropertyMetadataRaw } = InitArgRaw;
export const FormMetadata = Record({
  ...PropertyMetadataRaw,
});
export type FormMetadata = typeof FormMetadata.tsType;
