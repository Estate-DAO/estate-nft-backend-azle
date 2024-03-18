import { estateDaoActor, initEstateDaoNft } from "./utils/pocket-ic";

const initMetadata = {
  name: "EstateDaoNFT",
  symbol: "EST",
  logo: ["http://estatedao.org/test-image.png"],
  description: [],
};

describe("ICRC61 Standard", () => {
  let actor: estateDaoActor;
  const { setup, teardown } = initEstateDaoNft([initMetadata]);

  beforeAll(async () => (actor = await setup()));
  afterAll(teardown);

  it("icrc61_supported_standards", async () => {
    const standards = await actor.icrc61_supported_standards();

    expect(standards).toHaveLength(2);
    expect(standards).toContainEqual({
      url: "https://github.com/dfinity/ICRC/ICRCs/ICRC-7",
      name: "ICRC-7",
    });
    expect(standards).toContainEqual({
      url: "https://github.com/dfinity/ICRC/ICRCs/ICRC-61",
      name: "ICRC-61",
    });
  });
});
