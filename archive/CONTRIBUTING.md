# Contributing to React Use Anywhere

Thank you for your interest in contributing! 🎉

## Quick Start

1. **Fork & Clone**

   ```bash
   git clone https://github.com/YOUR_USERNAME/react-use-anywhere
   cd react-use-anywhere
   npm install
   ```

2. **Run Development**

   ```bash
   npm run dev          # Run demo app
   npm test             # Run tests
   npm run test:watch   # Watch mode
   ```

3. **Make Changes**

   - Create a feature branch: `git checkout -b feature/your-feature`
   - Write code and tests
   - Ensure all tests pass: `npm test`
   - Check types: `npm run type-check`

4. **Submit PR**
   - Push your branch
   - Open a Pull Request with clear description
   - Wait for review

## Development Guidelines

### Code Style

- Write clean, readable code
- Add comments for complex logic
- Follow existing patterns in the codebase
- Use TypeScript for type safety

### Testing

- Add tests for new features
- Maintain or improve code coverage
- Run `npm test` before submitting

### Commit Messages

- Use clear, descriptive messages
- Example: "Add support for custom error handlers"

## Project Structure

```
lib/              # Source code
├── index.ts      # Main exports
├── types.ts      # TypeScript definitions
├── hooks/        # React hooks
├── providers/    # Context providers
└── services/     # Service creators

test/             # Test files
demo/             # Demo application
docs/             # Documentation
examples/         # Usage examples
```

## Reporting Issues

Found a bug? Have a feature request?

1. Check [existing issues](https://github.com/akhshyganesh/react-use-anywhere/issues)
2. Create a new issue with:
   - Clear title
   - Steps to reproduce (for bugs)
   - Expected vs actual behavior
   - Your environment (React version, etc.)

## Questions?

- Open a [GitHub Discussion](https://github.com/akhshyganesh/react-use-anywhere/discussions)
- Check the [documentation](./docs)
- Review [examples](./examples)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
