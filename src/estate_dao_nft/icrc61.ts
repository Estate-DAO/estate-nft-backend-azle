import { Vec } from "azle";
import { ICRC61Standard } from "./types";

export function icrc61_supported_standards(): Vec<ICRC61Standard> {
  return [
    { name: "ICRC-7", url: "https://github.com/dfinity/ICRC/ICRCs/ICRC-7" },
    { name: "ICRC-61", url: "https://github.com/dfinity/ICRC/ICRCs/ICRC-61" }
  ]
}