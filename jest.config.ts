import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  notify: true,
  extensionsToTreatAsEsm: [
    '.ts'
  ],
  moduleDirectories: [
    'node_modules'
  ],
  coverageDirectory: '<rootDir>/coverage',
  collectCoverageFrom: [
    '<rootDir>/lib/**/*.ts',
    '!**/tests/**',
    '!**/enums/**',
    '!**/types/**',
    '!**/node_modules/**',
    '!**/vendor/**',
  ],
  coverageReporters: [
    'json', "lcov", "text"
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
