/**
 * Counter Service - Plain TypeScript file (NOT a React component!)
 *
 * This demonstrates the core value of react-use-anywhere:
 * Using React hooks from ANYWHERE in your codebase, including:
 * - Service files
 * - Utility functions
 * - API clients
 * - Business logic modules
 *
 * This file can be called from components, other services, or even
 * non-React code like event handlers, setTimeout callbacks, etc.
 */

import { createSingletonService } from 'react-use-anywhere';

// Define the counter type
export interface CounterHook {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
}

// Create the singleton service
export const counterService = createSingletonService<CounterHook>('counter');

/**
 * Increment the counter - callable from ANYWHERE!
 * Not just from React components!
 */
export const incrementCounter = () => {
  counterService.use((counter) => {
    counter.increment();
  });
};

/**
 * Decrement the counter - callable from ANYWHERE!
 */
export const decrementCounter = () => {
  counterService.use((counter) => {
    counter.decrement();
  });
};

/**
 * Reset the counter - callable from ANYWHERE!
 */
export const resetCounter = () => {
  counterService.use((counter) => {
    counter.reset();
  });
};

/**
 * Get the current count value - callable from ANYWHERE!
 */
export const getCurrentCount = (): number | null => {
  const counter = counterService.get();
  return counter ? counter.count : null;
};

/**
 * Complex business logic example - doubles the counter
 * This could be called from an API response, WebSocket handler,
 * setTimeout, setInterval, or any other non-React context!
 */
export const doubleCounter = () => {
  counterService.use((counter) => {
    const currentCount = counter.count;
    counter.reset();
    for (let i = 0; i < currentCount * 2; i++) {
      counter.increment();
    }
  });
};

/**
 * Example: Log counter value (could be called from analytics, logging, etc.)
 */
export const logCounterValue = () => {
  const count = getCurrentCount();
  console.log(`[Counter Service] Current count: ${count}`);
  return count;
};
