import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  moduleNameMapper: {
    '^@pages(.*)$': '<rootDir>/src/pages$1',
    '^@components(.*)$': '<rootDir>/src/components$1',
    '^@ui(.*)$': '<rootDir>/src/components/ui$1',
    '^@ui-pages(.*)$': '<rootDir>/src/components/ui/pages$1',
    '^@utils-types$': '<rootDir>/src/utils/types',
    '^@api$': '<rootDir>/src/utils/burger-api.ts',
    '^@slices(.*)$': '<rootDir>/src/services/slices$1',
    '^@selectors(.*)$': '<rootDir>/src/services/selectors$1'
  },
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
    '^.+\\.(css|less|scss|sass)$': 'jest-css-modules-transform'
  },
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.stories.*'],
  coverageReporters: ['text', 'lcov']
};

export default config;


