import { None, Opt, Result, Some, blob, bool, ic, nat, nat32, text } from "azle";
import { deriveSubaccount } from "../utils";
import { validateInvestor } from "../validate";
import { icpLedger, TRANSFER_FEE } from "../../common/ledger";
import { MetadataStore, TokenStore } from "../store";
import { Subaccount } from "../types";

export async function refund(to_subaccount: Opt<Subaccount>): Promise<Result<bool, text>> {
  const principal = ic.caller();

  const validationResult = validateInvestor(principal);
  if ( validationResult.Err ) return validationResult;

  const subaccount = deriveSubaccount(principal);
  const escrowBalance = await icpLedger.icrc1_balance_of({
    owner: ic.id(),
    subaccount: Some(subaccount)
  });
  
  await icpLedger.icrc1_transfer({
    from_subaccount: Some(subaccount),
    to: {
      owner: principal,
      subaccount: to_subaccount
    },
    amount: escrowBalance - TRANSFER_FEE,
    fee: Some(TRANSFER_FEE),
    memo: None,
    created_at_time: None,
  });

  return Result.Ok(true);
}

export async function mint(to_subaccount: Opt<Subaccount>): Promise<Result<nat32, text>> {
  const principal = ic.caller();

  const validationResult = validateInvestor(principal);
  if ( validationResult.Err ) return validationResult;
  
  const subaccount = deriveSubaccount(principal);
  const escrowBalance = await icpLedger.icrc1_balance_of({
    owner: ic.id(),
    subaccount: Some(subaccount)
  });

  if ( escrowBalance < MetadataStore.metadata.price + TRANSFER_FEE )
    return Result.Err("Invalid balance in escrow.");

  if ( MetadataStore.config.total_supply >= MetadataStore.metadata.supply_cap )
    return Result.Err("Supply cap reached.");

  const tokenId = TokenStore.mint(principal.toString(), to_subaccount.Some);

  try {
    await icpLedger.icrc1_transfer({
      from_subaccount: Some(subaccount),
      to: {
        owner: MetadataStore.metadata.treasury,
        subaccount: None
      },
      amount: MetadataStore.metadata.price - TRANSFER_FEE,
      fee: Some(TRANSFER_FEE),
      memo: None,
      created_at_time: None,
    });
  } catch ( err )  {
    TokenStore.burn(tokenId);
    return Result.Err("An error occured while transferring ICP to treasury.");
  }

  return Result.Ok(tokenId);
}