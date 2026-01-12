# Contributing to React Use Anywhere

Thank you for your interest in contributing! 🎉

## 🚀 Quick Start

### Prerequisites

- Node.js >= 16.0.0
- npm >= 8.0.0
- Git

### Setup

1. **Fork & Clone**

   ```bash
   git clone https://github.com/YOUR_USERNAME/react-use-anywhere
   cd react-use-anywhere
   npm install
   ```

2. **Create a Branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make Changes**

   - Write your code
   - Add tests for new features
   - Update documentation as needed

4. **Test Your Changes**

   ```bash
   npm test                 # Run all tests
   npm run type-check       # Check TypeScript types
   npm run lint             # Check code style
   npm run build            # Build the library
   ```

5. **Commit & Push**

   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   git push origin feature/your-feature-name
   ```

6. **Open Pull Request**

   - Go to GitHub
   - Open a Pull Request from your branch
   - Fill in the PR template
   - Wait for review

---

## 📝 Development Guidelines

### Code Style

- Use TypeScript for all new code
- Follow existing code patterns and conventions
- Use meaningful variable and function names
- Add JSDoc comments for public APIs
- Keep functions small and focused

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `test:` - Test additions or changes
- `refactor:` - Code refactoring
- `chore:` - Maintenance tasks
- `perf:` - Performance improvements

Examples:
```
feat: add type-safe service creation
fix: resolve memory leak in HookProvider
docs: update README with new examples
test: add integration tests for auth flow
```

### Testing

- Write tests for all new features
- Maintain or improve test coverage
- Test edge cases and error conditions
- Use descriptive test names

```typescript
// ✅ Good
it('should throw error when used outside HookProvider', () => {
  // test code
});

// ❌ Bad
it('test1', () => {
  // test code
});
```

### TypeScript

- Use strict TypeScript settings
- Avoid `any` type - use `unknown` if needed
- Export types that users might need
- Use generics for reusable code
- Document complex type definitions

### Documentation

- Update README for user-facing changes
- Add JSDoc comments for public APIs
- Include code examples in documentation
- Update CHANGELOG.md for releases

---

## 🏗️ Project Structure

```
react-use-anywhere/
├── lib/                    # Source code
│   ├── index.ts           # Main exports
│   ├── types.ts           # Type definitions
│   ├── hooks/             # React hooks
│   ├── providers/         # Context providers
│   └── services/          # Service creators
├── test/                   # Tests
│   ├── setup.ts           # Test configuration
│   └── *.test.tsx         # Test files
├── .github/               # GitHub configuration
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript config
├── vite.lib.config.ts     # Build config
└── README.md              # Documentation
```

---

## 🐛 Reporting Bugs

Found a bug? Please create an issue with:

1. **Clear Title**: Describe the bug briefly
2. **Description**: What happened vs what should happen
3. **Reproduction**: Minimal code to reproduce
4. **Environment**: React version, Node version, OS
5. **Screenshots**: If applicable

Example:
```markdown
## Bug: useHookService not updating on hook change

**Description:**
When hook value changes, service doesn't update immediately

**Reproduction:**
[Code example]

**Environment:**
- React: 18.2.0
- react-use-anywhere: 1.0.0
- Node: 18.0.0
```

---

## 💡 Feature Requests

Have an idea? Create an issue with:

1. **Use Case**: Why is this feature needed?
2. **Proposal**: How should it work?
3. **Examples**: Code showing the API
4. **Alternatives**: What alternatives did you consider?

---

## 🧪 Testing Guidelines

### Running Tests

```bash
npm test                    # Run all tests
npm run test:watch          # Watch mode
npm run test:coverage       # With coverage report
```

### Writing Tests

```typescript
import { render, screen } from '@testing-library/react';
import { HookProvider, createSingletonService } from '../lib';

describe('FeatureName', () => {
  // Setup and teardown
  beforeEach(() => {
    resetAllServices();
  });

  // Group related tests
  describe('specific behavior', () => {
    it('should do something specific', () => {
      // Arrange
      const service = createSingletonService('test');
      
      // Act
      service._setValue('value');
      
      // Assert
      expect(service.get()).toBe('value');
    });
  });
});
```

---

## 🔄 Pull Request Process

1. **Ensure all tests pass**
   ```bash
   npm run type-check
   npm run lint
   npm test
   npm run build
   ```

2. **Update documentation**
   - README for user-facing changes
   - JSDoc for API changes
   - CHANGELOG for notable changes

3. **Keep PRs focused**
   - One feature/fix per PR
   - Small, reviewable changes
   - Clear commit history

4. **Respond to feedback**
   - Address review comments
   - Update based on suggestions
   - Be open to discussion

---

## 📋 Code Review Checklist

Before submitting, verify:

- [ ] Code follows project style
- [ ] Tests added for new features
- [ ] All tests pass
- [ ] TypeScript compiles without errors
- [ ] No linting errors
- [ ] Documentation updated
- [ ] Commit messages follow convention
- [ ] No breaking changes (or documented)
- [ ] PR description is clear

---

## 🎯 Areas for Contribution

Looking for where to start? Consider:

### 🟢 Good First Issues
- Documentation improvements
- Adding code examples
- Fixing typos
- Adding tests

### 🟡 Intermediate
- Bug fixes
- Performance improvements
- Refactoring
- Additional type safety features

### 🔴 Advanced
- New core features
- Architecture improvements
- Complex optimizations
- Breaking changes (major versions)

---

## 💬 Getting Help

- 💭 [GitHub Discussions](https://github.com/akhshyganesh/react-use-anywhere/discussions) - Ask questions
- 🐛 [Issue Tracker](https://github.com/akhshyganesh/react-use-anywhere/issues) - Report bugs
- 📧 Email: akhshy.balakannan@gmail.com

---

## 📜 Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](./CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

---

## 🙏 Recognition

Contributors will be:
- Added to the contributors list
- Mentioned in release notes
- Credited in documentation

Thank you for making react-use-anywhere better! 🎉
