/**
 * React version compatibility utilities
 * These utilities help verify React version compatibility at runtime
 */
/**
 * Check if the current React version supports the hook injection pattern
 * @returns {boolean} True if React version is compatible
 */
export declare function isReactVersionSupported(): boolean;
/**
 * Check if a specific React version supports hooks
 * @param version - React version string (e.g., "18.2.0")
 * @returns {boolean} True if version supports hooks
 */
export declare function checkReactVersion(version: string): boolean;
/**
 * Get React version information
 * @returns {string} React version or 'unknown'
 */
export declare function getReactVersion(): string;
/**
 * Get compatibility information for the current React version
 * @returns {object} Compatibility information
 */
export declare function getCompatibilityInfo(): {
    version: string;
    isSupported: boolean;
    hasHooks: boolean;
    minimumVersion: string;
    recommendations: string[];
};
/**
 * Log compatibility information to console
 */
export declare function logCompatibilityInfo(): void;
/**
 * Assert that React version is compatible (throws if not)
 */
export declare function assertReactCompatibility(): void;
