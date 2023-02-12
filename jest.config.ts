import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  notify: true,
  extensionsToTreatAsEsm: [
    '.ts'
  ],
  maxWorkers: '50%',
  moduleDirectories: [
    'node_modules'
  ],
  collectCoverageFrom: [
    '**/*.{ts}',
    '!**/tests/**',
    '!**/enums/**',
    '!**/types/**',
    '!**/node_modules/**',
    '!**/vendor/**',
  ],
  coverageReporters: [
    'json'
  ],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  setupFilesAfterEnv: ['<rootDir>/tests/config/jest-setup.ts']
};

export default config;
