import { MetadataStore } from "./store";
import { InitArg } from "./types";

export function initImpl(args: InitArg) {
  MetadataStore.init(args);
}
