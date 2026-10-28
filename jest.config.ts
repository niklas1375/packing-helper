import type {Config} from 'jest';

const config: Config = {
  testEnvironment: 'node',
  moduleFileExtensions: ['js', 'mjs', 'cjs', 'jsx', 'ts', 'd.ts', 'tsx', 'json', 'node'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  transform: {
    '^.+\\.([cm]?[jt]sx?)$': ['@swc/jest', {}],
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(kysely|@doist\\/todoist-sdk|@doist\\/sdk-kmp|@paralleldrive\\/cuid2|@noble\\/hashes)/)',
  ],
};

export default config;