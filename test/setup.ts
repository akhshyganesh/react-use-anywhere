import '@testing-library/jest-dom';

// Suppress console errors and warnings during tests
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
};
