import { NavigationFunction, NavigationServiceInterface, ServiceConfig } from '../types';

/**
 * Production-ready navigation service with enhanced error handling and features
 */
export declare class NavigationService implements NavigationServiceInterface {
    private navigateFn;
    private config;
    private isNavigationReady;
    constructor(config?: ServiceConfig);
    /**
     * Set the navigation function (typically from useNavigate hook)
     */
    setNavigate(fn: NavigationFunction): void;
    /**
     * Navigate to a specific path
     */
    navigate(path: string, options?: any): void;
    /**
     * Navigate to login page (convenience method)
     */
    navigateToLogin(loginPath?: string): void;
    /**
     * Navigate to home page (convenience method)
     */
    navigateToHome(homePath?: string): void;
    /**
     * Navigate to error page (convenience method)
     */
    navigateToError(errorPath?: string, state?: any): void;
    /**
     * Replace current route (if supported by the router)
     */
    replace(path: string, options?: any): void;
    /**
     * Go back in history (browser navigation)
     */
    goBack(): void;
    /**
     * Go forward in history (browser navigation)
     */
    goForward(): void;
    /**
     * Check if navigation is ready
     */
    isReady(): boolean;
    /**
     * Wait for navigation to be ready
     */
    waitForReady(): Promise<void>;
    /**
     * Execute a callback with the navigation function
     */
    executeWithNavigation<T>(callback: (navigate: NavigationFunction) => T): T | null;
    /**
     * Reset the navigation service
     */
    reset(): void;
    /**
     * Handle navigation errors based on configuration
     */
    private handleNavigationError;
}
