# Security Policy

## Supported Versions

We release patches for security vulnerabilities. Currently supported versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

We take the security of react-use-anywhere seriously. If you believe you have found a security vulnerability, please report it to us as described below.

### Please DO NOT:
- Open a public GitHub issue for security vulnerabilities
- Share the vulnerability publicly before it has been addressed

### Please DO:
1. **Email us directly** at: akhshy.balakannan@gmail.com
2. **Include in your report**:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)
3. **Wait for our response** before public disclosure

### What to Expect:
- **Response Time**: We will acknowledge your email within 48 hours
- **Updates**: We will keep you informed about our progress
- **Credit**: We will credit you in the security advisory (unless you prefer to remain anonymous)
- **Timeline**: We aim to release a fix within 7-14 days for critical issues

## Security Considerations

### This Library
react-use-anywhere is a lightweight library with:
- ✅ Zero external dependencies (React is a peer dependency)
- ✅ No network operations
- ✅ No file system access
- ✅ No eval() or dangerous code execution
- ✅ No storage of sensitive data
- ✅ TypeScript for type safety

### Safe Usage Patterns

**Do:**
```typescript
// ✅ Safe: Using services for business logic
const logout = () => {
  authService.use((auth) => auth.logout());
  navService.use((nav) => nav('/login'));
};
```

**Don't:**
```typescript
// ❌ Unsafe: Storing sensitive data in services
const passwordService = createSingletonService('password');
passwordService._setValue(userPassword); // Don't do this!
```

### Best Practices

1. **Never store sensitive data** in services
   - Passwords
   - API keys
   - Tokens (use secure storage instead)

2. **Validate user input** before using in services
   ```typescript
   const navigate = (path: string) => {
     if (!isValidPath(path)) return;
     navService.use((nav) => nav(path));
   };
   ```

3. **Use TypeScript** for type safety
   ```typescript
   const authService = createSingletonService<AuthState>('auth');
   ```

4. **Reset services** in tests to prevent data leaks
   ```typescript
   beforeEach(() => {
     resetAllServices();
   });
   ```

## Known Issues

Currently, there are no known security issues. This section will be updated if any are discovered.

## Security Updates

Security updates will be:
- Released as patch versions (e.g., 1.0.1)
- Announced in the CHANGELOG
- Published with a security advisory on GitHub
- Communicated via npm security advisories

## Dependencies

This library has:
- **Zero runtime dependencies** (only React as peer dependency)
- **Dev dependencies** (for building and testing)
  - Regularly updated to latest secure versions
  - Scanned with `npm audit`
  - Not included in the published package

## Vulnerability Scanning

We use:
- GitHub Dependabot for dependency monitoring
- npm audit for vulnerability scanning
- Regular manual security reviews

## Contact

- **Email**: akhshy.balakannan@gmail.com
- **GitHub**: [@akhshyganesh](https://github.com/akhshyganesh)

---

Thank you for helping keep react-use-anywhere and its users safe! 🔒
