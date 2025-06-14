import { HookInjectionError } from '../errors/HookInjectionError';
import type { NavigationFunction, NavigationServiceInterface, ServiceConfig } from '../types';

/**
 * Production-ready navigation service with enhanced error handling and features
 */
export class NavigationService implements NavigationServiceInterface {
  private navigateFn: NavigationFunction | null = null;
  private config: Required<ServiceConfig>;
  private isNavigationReady = false;

  constructor(config: ServiceConfig = {}) {
    this.config = {
      enableWarnings: true,
      fallbackBehavior: 'warn',
      timeout: 5000,
      ...config,
    };
  }

  /**
   * Set the navigation function (typically from useNavigate hook)
   */
  setNavigate(fn: NavigationFunction): void {
    if (typeof fn !== 'function') {
      const error = HookInjectionError.invalidHook('navigation function', 'function');
      if (this.config.fallbackBehavior === 'error') {
        throw error;
      }
      if (this.config.fallbackBehavior === 'warn' && this.config.enableWarnings) {
        console.warn(error.message);
      }
      return;
    }

    this.navigateFn = fn;
    this.isNavigationReady = true;
  }

  /**
   * Navigate to a specific path
   */
  navigate(path: string, options?: any): void {
    if (!this.isNavigationReady || !this.navigateFn) {
      this.handleNavigationError('navigate');
      return;
    }

    try {
      this.navigateFn(path, options);
    } catch (error) {
      if (this.config.enableWarnings) {
        console.error('Navigation error:', error);
      }
    }
  }

  /**
   * Navigate to login page (convenience method)
   */
  navigateToLogin(loginPath = '/login'): void {
    this.navigate(loginPath);
  }

  /**
   * Navigate to home page (convenience method)
   */
  navigateToHome(homePath = '/'): void {
    this.navigate(homePath);
  }

  /**
   * Navigate to error page (convenience method)
   */
  navigateToError(errorPath = '/error', state?: any): void {
    this.navigate(errorPath, { state });
  }

  /**
   * Replace current route (if supported by the router)
   */
  replace(path: string, options?: any): void {
    this.navigate(path, { ...options, replace: true });
  }

  /**
   * Go back in history (browser navigation)
   */
  goBack(): void {
    if (typeof window !== 'undefined' && window.history) {
      window.history.back();
    } else if (this.config.enableWarnings) {
      console.warn('Browser navigation not available');
    }
  }

  /**
   * Go forward in history (browser navigation)
   */
  goForward(): void {
    if (typeof window !== 'undefined' && window.history) {
      window.history.forward();
    } else if (this.config.enableWarnings) {
      console.warn('Browser navigation not available');
    }
  }

  /**
   * Check if navigation is ready
   */
  isReady(): boolean {
    return this.isNavigationReady;
  }

  /**
   * Wait for navigation to be ready
   */
  async waitForReady(): Promise<void> {
    if (this.isReady()) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const checkInterval = 50;
      let elapsed = 0;

      const timer = setInterval(() => {
        if (this.isReady()) {
          clearInterval(timer);
          resolve();
          return;
        }

        elapsed += checkInterval;
        if (elapsed >= this.config.timeout) {
          clearInterval(timer);
          reject(HookInjectionError.timeout('waitForReady', this.config.timeout));
        }
      }, checkInterval);
    });
  }

  /**
   * Execute a callback with the navigation function
   */
  executeWithNavigation<T>(callback: (navigate: NavigationFunction) => T): T | null {
    if (!this.isNavigationReady || !this.navigateFn) {
      this.handleNavigationError('executeWithNavigation');
      return null;
    }

    try {
      return callback(this.navigateFn);
    } catch (error) {
      if (this.config.enableWarnings) {
        console.error('Error executing navigation callback:', error);
      }
      return null;
    }
  }

  /**
   * Reset the navigation service
   */
  reset(): void {
    this.navigateFn = null;
    this.isNavigationReady = false;
  }

  /**
   * Handle navigation errors based on configuration
   */
  private handleNavigationError(operation: string): void {
    const error = HookInjectionError.hookNotSet('navigation function');
    
    if (this.config.fallbackBehavior === 'error') {
      throw error;
    }
    
    if (this.config.fallbackBehavior === 'warn' && this.config.enableWarnings) {
      console.warn(`${operation}: ${error.message}`);
    }
  }
}
