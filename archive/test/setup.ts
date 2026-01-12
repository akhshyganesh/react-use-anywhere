import '@testing-library/jest-dom';

// Mock console methods in tests
const originalConsole = { ...console };

global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
  log: jest.fn(),
};

// Restore console for specific tests if needed
(global as any).restoreConsole = () => {
  global.console = originalConsole;
};

// Mock React's useEffect for deterministic testing
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useEffect: jest.fn((fn, deps) => {
    // Call effect immediately in tests
    if (typeof fn === 'function') {
      fn();
    }
  }),
}));

// Setup any global test utilities here
beforeEach(() => {
  jest.clearAllMocks();
});

// Add custom matchers
expect.extend({
  toBeFunction(received) {
    const pass = typeof received === 'function';
    return {
      message: () => `expected ${received} to be a function`,
      pass,
    };
  },
});

// Add global test helpers
(global as any).flushPromises = () => new Promise(resolve => setImmediate(resolve));
