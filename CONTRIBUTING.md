# Contributing to refineCTI

Thank you for your interest in contributing to refineCTI! This document provides guidelines for contributing to the project.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally
3. **Install dependencies**: `npm install`
4. **Create a branch** for your feature: `git checkout -b feature/my-feature`

## Development Setup

### Prerequisites

- Node.js >= 14.0.0
- OpenRefine 3.x (for testing)

### Install Dependencies

```bash
cd data/extensions/refineCTI
npm install
```

## Code Quality

### Linting

This project uses ESLint to maintain code quality and consistency.

**Before committing, always run:**

```bash
# Check for issues
npm run lint

# Auto-fix issues
npm run lint:fix
```

### Code Style

- **JavaScript**: ES5 compatible (for OpenRefine compatibility)
- **Quotes**: Single quotes (`'text'` not `"text"`)
- **Indentation**: 4 spaces
- **Line endings**: Unix (LF)
- **Semicolons**: Always required

### ESLint Configuration

The `.eslintrc.json` file contains rules adapted for OpenRefine extensions:
- Browser environment with jQuery
- OpenRefine-specific globals (`Refine`, `theProject`, etc.)
- ES5 compatibility
- Follows `eslint:recommended`

## Code Structure

```
refineCTI/
├── MOD-INF/
│   └── controller.js          # Extension initialization
├── scripts/
│   ├── refineCTI-core.js      # IOC extraction functions
│   └── refineCTI-menu.js      # GUI menu integration
├── styles/
│   └── refineCTI.css          # Styling
└── *.md                       # Documentation
```

## Testing

### Manual Testing

1. Start OpenRefine with the extension
2. Create a test project with IOC data
3. Test each menu operation:
   - Extract URLs
   - Extract Domains
   - Extract IPs
   - Extract Emails
   - Defang/Fang operations

### Test Data

See [EXAMPLES.md](EXAMPLES.md) for comprehensive test cases.

## Pull Request Process

1. **Ensure your code passes linting**: `npm run lint`
2. **Test thoroughly** with OpenRefine
3. **Update documentation** if needed
4. **Write clear commit messages**:
   ```
   feat: add IPv6 extraction support
   fix: correct regex for defanged URLs
   docs: update examples with new formats
   ```
5. **Submit the pull request** with:
   - Clear title and description
   - What problem it solves
   - How to test it
   - Screenshots (if UI changes)

## Commit Message Format

Follow conventional commits:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation only
- `style:` - Code style (formatting, no logic change)
- `refactor:` - Code restructuring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

## Adding New Features

### Adding New IOC Types

1. Add extraction function in `refineCTI-core.js`:
   ```javascript
   function extractNewType(text, defangResult) {
       // Implementation
       return results.join(', ');
   }
   ```

2. Export in public API:
   ```javascript
   return {
       // ...existing functions
       extractNewType: extractNewType
   };
   ```

3. Add menu item in `refineCTI-menu.js`

4. Add tests in `EXAMPLES.md`

5. Update `README.md` documentation

## Bug Reports

When reporting bugs, please include:

- OpenRefine version
- refineCTI version
- Browser (if relevant)
- Steps to reproduce
- Expected vs actual behavior
- Sample data (if possible)

## Feature Requests

Feature requests are welcome! Please:

1. Check if it already exists in issues
2. Describe the use case
3. Explain the expected behavior
4. Provide examples if possible

## Code Review

All submissions require review. We'll check for:

- Code quality and style (ESLint passing)
- Functionality and correctness
- Documentation completeness
- Test coverage
- Performance impact

## Questions?

- Open an issue for questions
- Check existing documentation
- Review [README.md](README.md) for usage

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing to refineCTI!** 🎉
