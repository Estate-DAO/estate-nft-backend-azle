import type { Config } from "jest";

const config: Config = {
  watch: false,
  preset: "ts-jest/presets/js-with-ts",
  testEnvironment: "node",
  testTimeout: 20*1000
};

export default config;
