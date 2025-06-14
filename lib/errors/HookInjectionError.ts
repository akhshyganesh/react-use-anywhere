/**
 * Custom error class for hook injection related errors
 */
export class HookInjectionError extends Error {
  public readonly code: string;
  public readonly details?: any;

  constructor(message: string, code = 'HOOK_INJECTION_ERROR', details?: any) {
    super(message);
    this.name = 'HookInjectionError';
    this.code = code;
    this.details = details;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if ((Error as any).captureStackTrace) {
      (Error as any).captureStackTrace(this, HookInjectionError);
    }
  }

  /**
   * Create error for when hook is not set
   */
  static hookNotSet(hookName = 'hook'): HookInjectionError {
    return new HookInjectionError(
      `${hookName} has not been injected yet. Make sure to wrap your component tree with the appropriate provider.`,
      'HOOK_NOT_SET'
    );
  }

  /**
   * Create error for invalid hook
   */
  static invalidHook(hookName = 'hook', expectedType?: string): HookInjectionError {
    const message = expectedType
      ? `Invalid ${hookName}. Expected ${expectedType}.`
      : `Invalid ${hookName} provided.`;
    
    return new HookInjectionError(message, 'INVALID_HOOK');
  }

  /**
   * Create error for provider not found
   */
  static providerNotFound(): HookInjectionError {
    return new HookInjectionError(
      'HookInjectionProvider not found in component tree. Make sure to wrap your app with HookInjectionProvider.',
      'PROVIDER_NOT_FOUND'
    );
  }

  /**
   * Create error for timeout
   */
  static timeout(operation: string, timeoutMs: number): HookInjectionError {
    return new HookInjectionError(
      `Operation '${operation}' timed out after ${timeoutMs}ms.`,
      'TIMEOUT'
    );
  }
}
