/**
 * Custom error class for hook injection related errors
 */
export declare class HookInjectionError extends Error {
    readonly code: string;
    readonly details?: any;
    constructor(message: string, code?: string, details?: any);
    /**
     * Create error for when hook is not set
     */
    static hookNotSet(hookName?: string): HookInjectionError;
    /**
     * Create error for invalid hook
     */
    static invalidHook(hookName?: string, expectedType?: string): HookInjectionError;
    /**
     * Create error for provider not found
     */
    static providerNotFound(): HookInjectionError;
    /**
     * Create error for timeout
     */
    static timeout(operation: string, timeoutMs: number): HookInjectionError;
}
