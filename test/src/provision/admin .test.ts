import { generateRandomIdentity } from "@hadronous/pic";
import { provisionActor, initProvisionCanister } from "../utils/pocket-ic";
import { isErrResult, isOkResult } from "../utils/common";

describe("Provision Canister Admins", () => {
  let actor: provisionActor;
  const { setup, teardown } = initProvisionCanister();
  const alice = generateRandomIdentity();
  const bob = generateRandomIdentity();

  beforeAll(async () => (actor = await setup()));
  afterAll(teardown);

  describe("is_admin", () => {
    it("true for deployer", async () => {
      const result = await actor.is_admin([]);
      expect(result).toBe(true);
    })

    it("false for non-admins", async () => {
      const result = await actor.is_admin([alice.getPrincipal()]);
      expect(result).toBe(false);
    })
  });

  describe("add_admin", () => {
    it("success - controllers can add admins", async () => {
      const addAdminResult = await actor.add_admin(alice.getPrincipal());
      expect(isOkResult(addAdminResult)).toBe(true);

      const isAdminResult = await actor.is_admin([alice.getPrincipal()]);
      expect(isAdminResult).toBe(true);
    });

    it("fails for non-controllers", async () => {
      actor.setIdentity(alice);
      
      const addAdminResult = await actor.add_admin(bob.getPrincipal());
      expect(isErrResult(addAdminResult)).toBe(true);
      if ( !isErrResult(addAdminResult) ) return;

      expect(addAdminResult.Err).toBe("Only controllers are allowed");

      const isAdminResult = await actor.is_admin([bob.getPrincipal()]);
      expect(isAdminResult).toBe(false);
    })
  });
});