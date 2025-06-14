import { NavigationServiceOptions, NavigationServiceInterface } from '../types';

/**
 * Create a new NavigationService instance with optional configuration
 */
export declare function createNavigationService(options?: NavigationServiceOptions): NavigationServiceInterface;
export declare function createSingletonNavigationService(options?: NavigationServiceOptions): NavigationServiceInterface;
/**
 * Get the singleton instance (if it exists)
 */
export declare function getSingletonNavigationService(): NavigationServiceInterface | null;
/**
 * Reset the singleton instance
 */
export declare function resetSingletonNavigationService(): void;
