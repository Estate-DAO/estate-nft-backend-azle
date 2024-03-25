import { Principal } from "@dfinity/principal";
import { Ok, loadTokenCanisterWasm } from "../utils/common";
import { provisionActor, initProvisionCanister } from "../utils/pocket-ic";

describe("Provision Canister", () => {
  let actor: provisionActor;
  const { setup, teardown } = initProvisionCanister();

  beforeAll(async () => (actor = await setup()));
  afterAll(teardown);

  it("set_token_canister_wasm", async () => {
    const wasm = await loadTokenCanisterWasm();
    const result = (await actor.set_token_canister_wasm(wasm));

    if ( 'Ok' in result ) expect(result.Ok).toBe(true);
    else expect(false).toBe(true);
  })

  it("deploy_collection", async () => {
    const result = (await actor.deploy_collection('EstateDAO', 'EST') as Ok<string>);
    expect(result.Ok).toBeDefined();
  });
});