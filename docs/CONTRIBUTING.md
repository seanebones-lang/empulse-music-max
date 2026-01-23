# 🤝 Contributing Guide
## EmPulse Music Max - How to Contribute

**Last Updated:** $(date)  
**Version:** 1.0.0

---

## Welcome! 👋

Thank you for your interest in contributing to EmPulse Music Max! This guide will help you get started.

---

## Code of Conduct

### Our Standards

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Celebrate diversity

### Our Responsibilities

- Maintain a welcoming environment
- Address conflicts fairly
- Set clear expectations
- Lead by example

---

## Getting Started

### 1. Fork and Clone

```bash
# Fork the repository on GitHub
# Then clone your fork
git clone https://github.com/your-username/empulse-music-max.git
cd empulse-music-max
```

### 2. Install Dependencies

```bash
cd web
npm install
```

### 3. Set Up Environment

Create `.env.local` file (optional for Supabase):

```bash
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

### 4. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see the app.

---

## Development Workflow

### 1. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

**Branch Naming:**
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation
- `refactor/` - Code refactoring
- `test/` - Test additions
- `perf/` - Performance improvements

### 2. Make Changes

- Write clean, readable code
- Follow TypeScript best practices
- Add comments for complex logic
- Update documentation if needed

### 3. Test Your Changes

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Check coverage
npm run test:coverage
```

### 4. Lint Your Code

```bash
npm run lint
```

### 5. Commit Your Changes

```bash
git add .
git commit -m "feat: add new feature"
```

**Commit Message Format:**

```
<type>: <subject>

<body>

<footer>
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Code style changes
- `refactor` - Code refactoring
- `test` - Test additions
- `chore` - Build/tooling changes

**Examples:**
```
feat: add playlist sharing feature

fix: resolve audio playback error on Safari

docs: update API documentation
```

### 6. Push and Create Pull Request

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub.

---

## Coding Standards

### TypeScript

- Use strict mode
- Avoid `any` type
- Use interfaces for object types
- Use type aliases for unions
- Export types when needed

**Example:**

```typescript
// Good
interface User {
  id: string;
  name: string;
}

// Bad
const user: any = { id: '1', name: 'John' };
```

### React

- Use functional components
- Use hooks for state and effects
- Memoize expensive computations
- Extract reusable logic to hooks
- Use TypeScript for props

**Example:**

```typescript
// Good
interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
}

export function Button({ onClick, children }: ButtonProps) {
  return <button onClick={onClick}>{children}</button>;
}

// Bad
export function Button(props: any) {
  return <button onClick={props.onClick}>{props.children}</button>;
}
```

### Styling

- Use Tailwind CSS utility classes
- Follow mobile-first approach
- Use CSS variables for theming
- Maintain consistent spacing
- Use responsive breakpoints

**Example:**

```tsx
// Good
<div className="flex items-center gap-4 p-4 md:p-6">
  <span className="text-sm md:text-base">Text</span>
</div>

// Bad
<div style={{ display: 'flex', padding: '16px' }}>
  <span style={{ fontSize: '14px' }}>Text</span>
</div>
```

### File Organization

- One component per file
- Co-locate related files
- Use index files for exports
- Follow Next.js conventions

**Example:**

```
components/
  content-card/
    index.tsx
    content-card.test.tsx
    content-card.stories.tsx
```

---

## Testing Guidelines

### Write Tests For

- ✅ Utility functions
- ✅ Store actions
- ✅ Component rendering
- ✅ User interactions
- ✅ API routes
- ✅ Error handling

### Test Structure

```typescript
describe('ComponentName', () => {
  it('should render correctly', () => {
    // Test code
  });

  it('should handle user interaction', () => {
    // Test code
  });

  it('should handle edge cases', () => {
    // Test code
  });
});
```

### Coverage Goals

- **Minimum:** 70% coverage
- **Target:** 80%+ coverage
- **Critical paths:** 100% coverage

---

## Pull Request Process

### Before Submitting

- [ ] Code follows style guidelines
- [ ] Tests pass locally
- [ ] Linter passes
- [ ] Documentation updated
- [ ] No console.log statements
- [ ] No TypeScript errors

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How was this tested?

## Checklist
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No breaking changes
```

### Review Process

1. **Automated Checks**
   - Tests must pass
   - Linter must pass
   - Build must succeed

2. **Code Review**
   - At least one approval required
   - Address review comments
   - Update PR if needed

3. **Merge**
   - Squash and merge (preferred)
   - Delete branch after merge

---

## Documentation

### When to Update Docs

- Adding new features
- Changing APIs
- Fixing bugs (if behavior changes)
- Adding new components
- Changing architecture

### Documentation Files

- `README.md` - Project overview
- `docs/API.md` - API documentation
- `docs/COMPONENTS.md` - Component docs
- `docs/ARCHITECTURE.md` - Architecture docs
- `docs/CONTRIBUTING.md` - This file

---

## Feature Requests

### How to Request

1. Check if feature already exists
2. Open an issue with `[Feature Request]` label
3. Describe the feature clearly
4. Explain use case
5. Suggest implementation (optional)

### Feature Request Template

```markdown
## Feature Description
Clear description of the feature

## Use Case
Why is this feature needed?

## Proposed Solution
How should this work?

## Alternatives
Other solutions considered

## Additional Context
Any other relevant information
```

---

## Bug Reports

### How to Report

1. Check if bug already reported
2. Open an issue with `[Bug]` label
3. Use bug report template
4. Provide reproduction steps

### Bug Report Template

```markdown
## Description
Clear description of the bug

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- Browser: [e.g., Chrome 120]
- OS: [e.g., macOS 14]
- Version: [e.g., 1.0.0]

## Screenshots
If applicable

## Additional Context
Any other relevant information
```

---

## Questions?

- Open an issue with `[Question]` label
- Check existing documentation
- Review closed issues

---

## Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Credited in release notes
- Appreciated by the community! 🎉

---

## License

By contributing, you agree that your contributions will be licensed under the same license as the project (MIT License).

---

**Thank you for contributing to EmPulse Music Max! 🎵⚡**
