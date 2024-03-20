import { generateRandomIdentity } from "@hadronous/pic";
import { estateDaoActor, initEstateDaoNft } from "../utils/pocket-ic";
import { OkResult } from "../utils/common";

describe("User attempts unauthorized transfer & burn", () => {
  let actor: estateDaoActor;
  const { setup, teardown } = initEstateDaoNft();
  const alice = generateRandomIdentity();
  const bob = generateRandomIdentity();
  const cleo = generateRandomIdentity();
  let mintedTokenId: bigint;

  beforeAll(async () => {
    actor = await setup();
    actor.setIdentity(bob);

    const mintRes = await actor.mint([{ subaccount: [] }]);
    mintedTokenId = (mintRes[0][0] as OkResult).Ok;

    actor.setIdentity(alice);
  });

  afterAll(teardown);

  it("unauthorized transfer", async () => {
    const transferRes = await actor.icrc7_transfer([
      {
        to: {
          owner: cleo.getPrincipal(),
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

  it("unauthorized burn", async () => {
    const transferRes = await actor.burn([
      {
        token_id: mintedTokenId,
      },
    ]);

    expect(transferRes).toHaveLength(1);
    expect(transferRes[0]).toHaveLength(1);
    expect((transferRes[0][0] as any).Err.Unauthorized).toBe(null);
  });
});
