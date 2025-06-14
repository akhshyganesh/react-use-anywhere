/**
 * React version compatibility utilities
 * These utilities help verify React version compatibility at runtime
 */

/**
 * Check if the current React version supports the hook injection pattern
 * @returns {boolean} True if React version is compatible
 */
export function isReactVersionSupported(): boolean {
  try {
    // Check if React is available
    if (typeof require !== 'undefined') {
      const React = require('react');
      return checkReactVersion(React.version);
    }
    
    // In browser environment, check if React is globally available
    if (typeof window !== 'undefined' && (window as any).React) {
      return checkReactVersion((window as any).React.version);
    }
    
    // If we can't detect React, assume it's compatible
    return true;
  } catch {
    // If there's any error, assume compatibility
    return true;
  }
}

/**
 * Check if a specific React version supports hooks
 * @param version - React version string (e.g., "18.2.0")
 * @returns {boolean} True if version supports hooks
 */
export function checkReactVersion(version: string): boolean {
  if (!version) return true; // Assume compatible if version unknown
  
  try {
    const [major, minor] = version.split('.').map(Number);
    
    // React 16.8+ supports hooks
    if (major > 16) return true;
    if (major === 16 && minor >= 8) return true;
    
    return false;
  } catch {
    return true; // Assume compatible if parsing fails
  }
}

/**
 * Get React version information
 * @returns {string} React version or 'unknown'
 */
export function getReactVersion(): string {
  try {
    if (typeof require !== 'undefined') {
      const React = require('react');
      return React.version || 'unknown';
    }
    
    if (typeof window !== 'undefined' && (window as any).React) {
      return (window as any).React.version || 'unknown';
    }
    
    return 'unknown';
  } catch {
    return 'unknown';
  }
}

/**
 * Get compatibility information for the current React version
 * @returns {object} Compatibility information
 */
export function getCompatibilityInfo() {
  const version = getReactVersion();
  const isSupported = checkReactVersion(version);
  
  return {
    version,
    isSupported,
    hasHooks: isSupported,
    minimumVersion: '16.8.0',
    recommendations: isSupported 
      ? ['✅ Your React version is fully supported']
      : ['❌ Please upgrade to React 16.8.0 or higher to use hooks']
  };
}

/**
 * Log compatibility information to console
 */
export function logCompatibilityInfo(): void {
  const info = getCompatibilityInfo();
  
  console.group('🎯 React Hook Injection Pattern - Compatibility Check');
  console.log(`React Version: ${info.version}`);
  console.log(`Hooks Supported: ${info.hasHooks ? '✅' : '❌'}`);
  console.log(`Minimum Required: ${info.minimumVersion}`);
  
  info.recommendations.forEach(rec => console.log(rec));
  
  if (!info.isSupported) {
    console.warn('⚠️  React version is too old. Please upgrade to use this library.');
  }
  
  console.groupEnd();
}

/**
 * Assert that React version is compatible (throws if not)
 */
export function assertReactCompatibility(): void {
  const info = getCompatibilityInfo();
  
  if (!info.isSupported) {
    throw new Error(
      `React Hook Injection Pattern requires React ${info.minimumVersion} or higher. ` +
      `Current version: ${info.version}. Please upgrade React to use this library.`
    );
  }
}
