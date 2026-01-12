import '@testing-library/jest-dom';
import { configureLogging } from '../lib/utils/logger';

// Enable logging for tests so console spies work
configureLogging({ enabled: true });

// Suppress console errors and warnings during tests
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
};
