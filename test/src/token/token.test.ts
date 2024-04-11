import { generateRandomIdentity } from "@hadronous/pic";
import { estateDaoActor, initTestSuite } from "../utils/pocket-ic";
import { Ok } from "../utils/common";

describe("Token", () => {
  let actor: estateDaoActor;
  const suite = initTestSuite();
  const alice = generateRandomIdentity();
  const bob = generateRandomIdentity();
  const cleo = generateRandomIdentity();
  let mintedTokenId: bigint;

  beforeAll(async () => {
    await suite.setup();
    actor = (await suite.deployEstateDaoNftCanister({})).actor;
    actor.setIdentity(bob);

    const mintRes = await actor.mint([{ subaccount: [] }]);
    mintedTokenId = (mintRes[0][0] as Ok<bigint>).Ok;

    actor.setIdentity(alice);
  });

  afterAll(suite.teardown);

  describe("icrc7_transfer", () => {
    it("Unauthorized user fails", async () => {
      actor.setIdentity(alice);
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

    it("Non-existent token id fails", async () => {
      actor.setIdentity(alice);
      const transferRes = await actor.icrc7_transfer([
        {
          to: {
            owner: cleo.getPrincipal(),
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
      actor.setIdentity(bob);
      const transferRes = await actor.icrc7_transfer([
        {
          to: {
            owner: bob.getPrincipal(),
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
  });

  describe("burn", () => {
    it("Unauthorized user fails", async () => {
      actor.setIdentity(alice);
      const burnRes = await actor.burn([
        {
          token_id: mintedTokenId,
        },
      ]);

      expect(burnRes).toHaveLength(1);
      expect(burnRes[0]).toHaveLength(1);
      expect((burnRes[0][0] as any).Err.Unauthorized).toBe(null);
    });

    it("Non-existent token id fails", async () => {
      actor.setIdentity(alice);
      const burnRes = await actor.burn([
        {
          token_id: 1021n,
        },
      ]);

      expect(burnRes).toHaveLength(1);
      expect(burnRes[0]).toHaveLength(1);
      expect((burnRes[0][0] as any).Err.NonExistingTokenId).toBe(null);
    });
  });
});
