import { generateRandomIdentity } from "@hadronous/pic";
import { estateDaoActor, icpLedgerActor, initTestSuite } from "../utils/pocket-ic";
import { Principal } from "@dfinity/principal";
import { deriveSubaccount } from "../../../src/common/token";
import { expectResultIsErr, expectResultIsOk } from "../utils/common";
import { Result, nat } from "azle";
import { SubAccount } from "../../dfx_generated/icp_ledger/icp_ledger.did";

const TOKEN_PRICE = 100000n;
const TRANSFER_FEE = 10_000n;

describe("Token", () => {
  let tokenActor: estateDaoActor, icpLedgerActor: icpLedgerActor, tokenId: Principal;
  const suite = initTestSuite();
  const accountA = generateRandomIdentity();
  const accountB = generateRandomIdentity();
  const accountC = generateRandomIdentity();
  const minterAccount = generateRandomIdentity();
  const treasuryAccount = generateRandomIdentity();
  let mintedTokenId: bigint;

  async function mintICPToAccount(amount: nat, principal: Principal, subaccount?: SubAccount) {
    icpLedgerActor.setIdentity(minterAccount);

    await icpLedgerActor.icrc1_transfer({
      to: {
        owner: principal,
        subaccount: subaccount ? [subaccount] : [],
      },
      from_subaccount: [],
      memo: [],
      fee: [],
      created_at_time: [],
      amount: amount,
    });
  }

  async function icpAccountBalance(principal: Principal, subaccount?: SubAccount): Promise<nat> {
    return await icpLedgerActor.icrc1_balance_of({
      owner: principal,
      subaccount: subaccount ? [subaccount] : [],
    });
  }

  beforeAll(async () => {
    await suite.setup();
    const icpLedgerFixture = await suite.deployIcpLedgerCanister(minterAccount.getPrincipal());
    icpLedgerActor = icpLedgerFixture.actor;
    icpLedgerActor.setIdentity(minterAccount);

    const tokenFixture = await suite.deployEstateDaoNftCanister({
      price: TOKEN_PRICE,
      token: icpLedgerFixture.canisterId,
      treasury: treasuryAccount.getPrincipal(),
      supply_cap: 1n,
    });
    tokenActor = tokenFixture.actor;
    tokenId = tokenFixture.canisterId;
  });

  afterAll(suite.teardown);

  describe("refund", () => {
    it("fails for anonymous accounts", async () => {
      tokenActor.setPrincipal(Principal.anonymous());

      const res = await tokenActor.refund({ subaccount: [] });
      expectResultIsErr(res);
      expect(res.Err).toBe("Anonymous users not allowed");
    });

    it("success - returns escrow amount back to account", async () => {
      const account = generateRandomIdentity();
      tokenActor.setIdentity(account);
      const derivedSubaccount = deriveSubaccount(account.getPrincipal());
      const REFUND_AMOUNT = 90_000n;

      await mintICPToAccount(REFUND_AMOUNT + TRANSFER_FEE, tokenId, derivedSubaccount);

      const escrowBalanceBeforeRefund = await icpAccountBalance(tokenId, derivedSubaccount);
      expect(escrowBalanceBeforeRefund).toBe(REFUND_AMOUNT + TRANSFER_FEE);

      const res = await tokenActor.refund({ subaccount: [] });
      expectResultIsOk(res);

      const escrowBalanceAfterRefund = await icpAccountBalance(tokenId, derivedSubaccount);
      expect(escrowBalanceAfterRefund).toBe(0n);

      const accountBalanceAfterRefund = await icpAccountBalance(account.getPrincipal());
      expect(accountBalanceAfterRefund).toBe(REFUND_AMOUNT);
    });
  });

  describe("mint", () => {
    it("fails for anonymous accounts", async () => {
      tokenActor.setPrincipal(Principal.anonymous());

      const res = await tokenActor.mint({ subaccount: [] });
      expectResultIsErr(res);
      expect(res.Err).toBe("Anonymous users not allowed");
    });

    it("fails for invalid escrow balance", async () => {
      const account = generateRandomIdentity();
      tokenActor.setIdentity(account);

      // should be at least TOKEN_PRICE + TRANSFER_FEE
      await mintICPToAccount(TOKEN_PRICE, tokenId, deriveSubaccount(account.getPrincipal()));

      const res = await tokenActor.mint({ subaccount: [] });
      expectResultIsErr(res);
      expect(res.Err).toBe("Invalid balance in escrow.");
    });

    it("success", async () => {
      const subaccount = deriveSubaccount(accountA.getPrincipal());
      tokenActor.setIdentity(accountA);

      await mintICPToAccount(TOKEN_PRICE + TRANSFER_FEE, tokenId, subaccount);

      const res = await tokenActor.mint({ subaccount: [] });
      expectResultIsOk(res);

      mintedTokenId = res.Ok;

      const [balance] = await tokenActor.icrc7_balance_of([
        {
          owner: accountA.getPrincipal(),
          subaccount: [],
        },
      ]);
      expect(balance).toBe(1n);

      const escrowBalance = await icpAccountBalance(tokenId, subaccount);
      expect(escrowBalance).toBe(0n);

      const treasuryBalance = await icpAccountBalance(treasuryAccount.getPrincipal());
      expect(treasuryBalance).toBe(TOKEN_PRICE);
    });

    it("fails on exceeding max supply", async () => {
      const account = generateRandomIdentity();
      tokenActor.setIdentity(account);

      await mintICPToAccount(
        TOKEN_PRICE + TRANSFER_FEE,
        tokenId,
        deriveSubaccount(account.getPrincipal()),
      );

      const res = await tokenActor.mint({ subaccount: [] });
      expectResultIsErr(res);
      expect(res.Err).toBe("Supply cap reached.");
    });
  });

  describe("icrc7_transfer", () => {
    it("Unauthorized user fails", async () => {
      tokenActor.setIdentity(accountB);
      const transferRes = await tokenActor.icrc7_transfer([
        {
          to: {
            owner: accountC.getPrincipal(),
            subaccount: [],
          },
          from_subaccount: [],
          token_id: mintedTokenId,
          memo: [],
          created_at_time: [],
        },
      ]);

      expect(transferRes).toHaveLength(1);
      expect(transferRes[0]).toHaveLength(1);
      expect((transferRes[0][0] as any).Err.Unauthorized).toBe(null);
    });

    it("Non-existent token id fails", async () => {
      tokenActor.setIdentity(accountB);
      const transferRes = await tokenActor.icrc7_transfer([
        {
          to: {
            owner: accountC.getPrincipal(),
            subaccount: [],
          },
          from_subaccount: [],
          token_id: 1021n,
          memo: [],
          created_at_time: [],
        },
      ]);

      expect(transferRes).toHaveLength(1);
      expect(transferRes[0]).toHaveLength(1);
      expect((transferRes[0][0] as any).Err.NonExistingTokenId).toBe(null);
    });

    it("Invalid recipient fails", async () => {
      tokenActor.setIdentity(accountA);
      const transferRes = await tokenActor.icrc7_transfer([
        {
          to: {
            owner: accountA.getPrincipal(),
            subaccount: [],
          },
          from_subaccount: [],
          token_id: mintedTokenId,
          memo: [],
          created_at_time: [],
        },
      ]);

      expect(transferRes).toHaveLength(1);
      expect(transferRes[0]).toHaveLength(1);
      expect((transferRes[0][0] as any).Err.InvalidRecipient).toBe(null);
    });

    it("success", async () => {
      tokenActor.setIdentity(accountA);
      const transferRes = await tokenActor.icrc7_transfer([
        {
          to: {
            owner: accountB.getPrincipal(),
            subaccount: [],
          },
          from_subaccount: [],
          token_id: mintedTokenId,
          memo: [],
          created_at_time: [],
        },
      ]);

      expectResultIsOk(transferRes[0][0]!);
    });
  });
});
