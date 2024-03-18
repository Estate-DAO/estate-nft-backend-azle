import { generateRandomIdentity } from "@hadronous/pic";
import { estateDaoActor, initEstateDaoNft } from "../utils/pocket-ic";
import { OkResult } from "../utils/common";

const initMetadata = {
  name: "EstateDaoNFT",
  symbol: "EST",
  logo: ["http://estatedao.org/test-image.png"],
  description: [],
};

describe("User mints, transfer and burns a token successfully", () => {
  let actor: estateDaoActor;
  const { setup, teardown } = initEstateDaoNft([initMetadata]);
  const alice = generateRandomIdentity();
  const bob = generateRandomIdentity();
  let mintedTokenId: bigint;

  beforeAll(async () => (actor = await setup()));
  afterAll(teardown);

  it("mints token.", async () => {
    actor.setIdentity(alice);

    const mintRes = await actor.mint([{ subaccount: [] }]);

    expect(mintRes).toHaveLength(1);
    expect(mintRes[0]).toHaveLength(1);

    mintedTokenId = (mintRes[0][0] as OkResult).Ok;
    expect(mintedTokenId).toBe(1n);

    const totalSupplyRes = await actor.icrc7_total_supply();
    expect(totalSupplyRes).toBe(1n);

    const balanceOfRes = await actor.icrc7_balance_of([{
      owner: alice.getPrincipal(),
      subaccount: []
    }])

    expect(balanceOfRes).toHaveLength(1);
    expect(balanceOfRes[0]).toBe(1n);

    const ownerOfRes = await actor.icrc7_owner_of([ mintedTokenId ]);
    
    expect(ownerOfRes).toHaveLength(1);
    expect(ownerOfRes[0]).toHaveLength(1);
    expect(ownerOfRes[0][0]!.owner.toString()).toBe(alice.getPrincipal().toString());
    expect(ownerOfRes[0][0]!.subaccount).toHaveLength(0);

    const tokensRes = await actor.icrc7_tokens([], []);
    
    expect(tokensRes).toHaveLength(1);
    expect(tokensRes[0]).toBe(mintedTokenId);

    const tokensOfRes = await actor.icrc7_tokens_of({
      owner: alice.getPrincipal(),
      subaccount: []
    }, [], []);

    expect(tokensOfRes).toHaveLength(1);
    expect(tokensOfRes[0]).toBe(mintedTokenId);
  });

  it("transfers token.", async () => {
    const transferRes = await actor.icrc7_transfer([{
      to: {
        owner: bob.getPrincipal(),
        subaccount: []
      },
      from_subaccount: [],
      token_id: mintedTokenId,
      memo: [],
      created_at_time: [],
    }]);

    expect(transferRes).toHaveLength(1);
    expect(transferRes[0]).toHaveLength(1);

    const transferTxnIndex = (transferRes[0][0] as OkResult).Ok;
    expect(transferTxnIndex).toBe(2n);

    const totalSupplyRes = await actor.icrc7_total_supply();
    expect(totalSupplyRes).toBe(1n);

    const aliceBalanceOfRes = await actor.icrc7_balance_of([{
      owner: alice.getPrincipal(),
      subaccount: []
    }])

    expect(aliceBalanceOfRes).toHaveLength(1);
    expect(aliceBalanceOfRes[0]).toBe(0n);

    const bobBalanceOfRes = await actor.icrc7_balance_of([{
      owner: bob.getPrincipal(),
      subaccount: []
    }])

    expect(bobBalanceOfRes).toHaveLength(1);
    expect(bobBalanceOfRes[0]).toBe(1n);

    const ownerOfRes = await actor.icrc7_owner_of([ mintedTokenId ]);
    
    expect(ownerOfRes).toHaveLength(1);
    expect(ownerOfRes[0]).toHaveLength(1);
    expect(ownerOfRes[0][0]!.owner.toString()).toBe(bob.getPrincipal().toString());
    expect(ownerOfRes[0][0]!.subaccount).toHaveLength(0);

    const tokensRes = await actor.icrc7_tokens([], []);
    
    expect(tokensRes).toHaveLength(1);
    expect(tokensRes[0]).toBe(mintedTokenId);

    const aliceTokensOfRes = await actor.icrc7_tokens_of({
      owner: alice.getPrincipal(),
      subaccount: []
    }, [], []);

    expect(aliceTokensOfRes).toHaveLength(0);

    const bobTokensOfRes = await actor.icrc7_tokens_of({
      owner: bob.getPrincipal(),
      subaccount: []
    }, [], []);

    expect(bobTokensOfRes).toHaveLength(1);
    expect(bobTokensOfRes[0]).toBe(mintedTokenId);
  });

  it("burns token.", async () => {
    actor.setIdentity(bob);

    const burnRes = await actor.burn([{ token_id: mintedTokenId }]);

    expect(burnRes).toHaveLength(1);
    expect(burnRes[0]).toHaveLength(1);
    
    const burnTxnIndex = (burnRes[0][0] as OkResult).Ok;
    expect(burnTxnIndex).toBe(3n);

    const totalSupplyRes = await actor.icrc7_total_supply();
    expect(totalSupplyRes).toBe(0n);

    const balanceOfRes = await actor.icrc7_balance_of([{
      owner: bob.getPrincipal(),
      subaccount: []
    }])

    expect(balanceOfRes).toHaveLength(1);
    expect(balanceOfRes[0]).toBe(0n);

    const ownerOfRes = await actor.icrc7_owner_of([ mintedTokenId ]);
    
    expect(ownerOfRes).toHaveLength(1);
    expect(ownerOfRes[0]).toHaveLength(0);

    const tokensRes = await actor.icrc7_tokens([], []);
    
    expect(tokensRes).toHaveLength(0);

    const tokensOfRes = await actor.icrc7_tokens_of({
      owner: bob.getPrincipal(),
      subaccount: []
    }, [], []);

    expect(tokensOfRes).toHaveLength(0);
  });
});