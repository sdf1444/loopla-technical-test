const nextJest = require('next/jest');

// Providing the path to your Next.js project to load next.config.js and .env files in your test environment
const createJestConfig = nextJest({
  dir: './',
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  // Add more setup options before each test is run
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],

  testEnvironment: 'jest-environment-jsdom',

  // This is the key part: it uses SWC to transform your files.
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['@swc/jest'],
  },
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js configuration, which is essential for certain features
module.exports = createJestConfig(customJestConfig);