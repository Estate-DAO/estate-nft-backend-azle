import { None, Opt, Result, Some, blob, bool, ic, nat, nat32, nat64, text } from "azle";
import { deriveSubaccount } from "../../common/token";
import { validateInvestor } from "../validate";
import { getTokenLedger, TRANSFER_FEE } from "../../common/ledger";
import { MetadataStore, TokenStore } from "../store";
import { MintArg, RefundArg, Subaccount } from "../types";

export async function refund({subaccount: to_subaccount}: RefundArg): Promise<Result<bool, text>> {
  const principal = ic.caller();
  const icpLedger = getTokenLedger(MetadataStore.metadata.token);

  const validationResult = validateInvestor(principal);
  if ( validationResult.Err ) return validationResult;

  const subaccount = deriveSubaccount(principal);
  const escrowBalance = await ic.call(
    icpLedger.icrc1_balance_of, 
    {
      args: [{
        owner: ic.id(),
        subaccount: Some(subaccount)
      }]
    }
  );
  
  await ic.call(icpLedger.icrc1_transfer, {
    args: [{
      from_subaccount: Some(subaccount),
      to: {
        owner: principal,
        subaccount: to_subaccount
      },
      amount: escrowBalance - TRANSFER_FEE,
      fee: Some(TRANSFER_FEE),
      memo: None,
      created_at_time: None,
    }]
  });

  return Result.Ok(true);
}

// TODO: Implement memo and created_at_time checks
export async function mint({ subaccount: to_subaccount }: MintArg): Promise<Result<nat, text>> {
  const principal = ic.caller();
  const icpLedger = getTokenLedger(MetadataStore.metadata.token);

  const validationResult = validateInvestor(principal);
  if ( validationResult.Err ) return validationResult;
  
  const subaccount = deriveSubaccount(principal);
  const escrowBalance = await ic.call(
    icpLedger.icrc1_balance_of, 
    {
      args: [{
        owner: ic.id(),
        subaccount: Some(subaccount)
      }]
    }
  );

  if ( escrowBalance < MetadataStore.metadata.price + TRANSFER_FEE )
    return Result.Err("Invalid balance in escrow.");

  if ( MetadataStore.config.total_supply >= MetadataStore.metadata.supply_cap )
    return Result.Err("Supply cap reached.");

  const tokenId = TokenStore.mint(principal.toString(), to_subaccount.Some);

  try {
    await ic.call(icpLedger.icrc1_transfer, {
      args: [{
        from_subaccount: Some(subaccount),
        to: {
          owner: MetadataStore.metadata.treasury,
          subaccount: None
        },
        amount: MetadataStore.metadata.price,
        fee: Some(TRANSFER_FEE),
        memo: None,
        created_at_time: None,
      }]
    });
  } catch ( err )  {
    TokenStore.burn(tokenId);
    return Result.Err("An error occured while transferring ICP to treasury.");
  }

  return Result.Ok(BigInt(tokenId));
}