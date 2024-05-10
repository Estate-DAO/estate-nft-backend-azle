import { generateRandomIdentity } from "@hadronous/pic";
import { estateDaoActor, icpLedgerActor, initTestSuite } from "../utils/pocket-ic";
import { Principal } from "@dfinity/principal";
import { deriveSubaccount } from "../../../src/common/token";
import { expectResultIsOk } from "../utils/common";
import { Result } from "azle";

const TOKEN_PRICE = 100000n;
const TRANSFER_FEE = 10_000n;

describe("Token", () => {
  let tokenActor: estateDaoActor, icpLedgerActor: icpLedgerActor, tokenId: Principal;
  const suite = initTestSuite();
  const accountA = generateRandomIdentity();
  const accountB = generateRandomIdentity();
  const accountC = generateRandomIdentity();
  const minterAccount = generateRandomIdentity();
  let mintedTokenId: bigint;

  beforeAll(async () => {
    await suite.setup();    
    const icpLedgerFixture = await suite.deployIcpLedgerCanister(minterAccount.getPrincipal());
    icpLedgerActor = icpLedgerFixture.actor;
    icpLedgerActor.setIdentity(minterAccount);
    await icpLedgerActor.icrc1_transfer({
      to: {
        owner: accountA.getPrincipal(),
        subaccount: []
      },
      from_subaccount: [],
      memo: [],
      fee: [],
      created_at_time: [],
      amount: TOKEN_PRICE + TRANSFER_FEE * 2n,
    });

    await icpLedgerActor.icrc1_transfer({
      to: {
        owner: accountC.getPrincipal(),
        subaccount: []
      },
      from_subaccount: [],
      memo: [],
      fee: [],
      created_at_time: [],
      amount: TOKEN_PRICE + TRANSFER_FEE * 2n,
    });

    const tokenFixture = await suite.deployEstateDaoNftCanister({
      price: TOKEN_PRICE,
      token: icpLedgerFixture.canisterId
    });
    tokenActor = tokenFixture.actor;
    tokenId = tokenFixture.canisterId;
  });

  afterAll(suite.teardown);

  describe("refund", () => {
    it("success", async () => {
      icpLedgerActor.setIdentity(accountC);
      tokenActor.setIdentity(accountC);

      const derivedSubaccount = deriveSubaccount(accountC.getPrincipal());

      await icpLedgerActor.icrc1_transfer({
        from_subaccount: [],
        to: {
          owner: tokenId,
          subaccount: [derivedSubaccount]
        },
        memo: [],
        fee: [TRANSFER_FEE],
        created_at_time: [],
        amount: TOKEN_PRICE + TRANSFER_FEE,
      });

      const escrowBalanceBeforeRefund = await icpLedgerActor.icrc1_balance_of({
        owner: tokenId,
        subaccount: [derivedSubaccount]
      })
      expect(escrowBalanceBeforeRefund).toBe(TOKEN_PRICE + TRANSFER_FEE);

      const res = await tokenActor.refund({
        subaccount: []
      });
      expectResultIsOk(res);

      const escrowBalanceAfterRefund = await icpLedgerActor.icrc1_balance_of({
        owner: tokenId,
        subaccount: [derivedSubaccount]
      });
      expect(escrowBalanceAfterRefund).toBe(0n);

      const accountBalanceAfterRefund = await icpLedgerActor.icrc1_balance_of({
        owner: accountC.getPrincipal(),
        subaccount: []
      });
      expect(accountBalanceAfterRefund).toBe(TOKEN_PRICE);
    })
  })

  describe("mint", () => {
    it("success", async () => {
      icpLedgerActor.setIdentity(accountA);
      tokenActor.setIdentity(accountA);
      
      await icpLedgerActor.icrc1_transfer({
        from_subaccount: [],
        to: {
          owner: tokenId,
          subaccount: [deriveSubaccount(accountA.getPrincipal())]
        },
        memo: [],
        fee: [TRANSFER_FEE],
        created_at_time: [],
        amount: TOKEN_PRICE + TRANSFER_FEE,
      });

      const res = await tokenActor.mint({
        subaccount: []
      });
      expectResultIsOk(res);

      mintedTokenId = res.Ok;

      const [balance] = await tokenActor.icrc7_balance_of([{
        owner: accountA.getPrincipal(),
        subaccount: []
      }]);
      expect(balance).toBe(1n);
    })
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
