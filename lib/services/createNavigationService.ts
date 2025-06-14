import { NavigationService } from './NavigationService';
import type { NavigationServiceOptions, NavigationServiceInterface } from '../types';

/**
 * Create a new NavigationService instance with optional configuration
 */
export function createNavigationService(
  options: NavigationServiceOptions = {}
): NavigationServiceInterface {
  return new NavigationService(options);
}

/**
 * Create a singleton NavigationService instance
 * Useful when you want to share the same service across your entire application
 */
let singletonInstance: NavigationService | null = null;

export function createSingletonNavigationService(
  options: NavigationServiceOptions = {}
): NavigationServiceInterface {
  if (!singletonInstance) {
    singletonInstance = new NavigationService(options);
  }
  return singletonInstance;
}

/**
 * Get the singleton instance (if it exists)
 */
export function getSingletonNavigationService(): NavigationServiceInterface | null {
  return singletonInstance;
}

/**
 * Reset the singleton instance
 */
export function resetSingletonNavigationService(): void {
  if (singletonInstance) {
    singletonInstance.reset();
  }
  singletonInstance = null;
}
