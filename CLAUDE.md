# Claude Code Guidelines

This file contains the coding standards and conventions for this project. Follow these rules when making any code changes.

## TypeScript/JavaScript Style Rules

### Quotes and Semicolons
- **Use single quotes**: `'string'` not `"string"`
- **No semicolons**: End statements without semicolons
- **Trailing commas**: Use trailing commas in multiline objects/arrays

### Functions
- **Prefer arrow functions**: Use `const myFunc = () => {}` instead of `function myFunc() {}`
- **Arrow callbacks**: Use arrow functions for callbacks: `array.map(item => item.id)`

### Spacing and Formatting
- **Object curly spacing**: Use spaces inside object braces: `{ key: value }`
- **Max line length**: Handled by Prettier, no strict limit enforced

### Variables
- **Unused variables**: Prefix with underscore if intentionally unused: `const _unusedVar = value`
- **TypeScript any**: Explicit `any` types are allowed when necessary

### Console Usage
- **Avoid console.log**: Use `console.warn`, `console.error`, `console.info`, or `console.debug` instead
- **console.log**: Will trigger ESLint warning

### Examples of Correct Style

```typescript
// ✅ Correct
const handleClick = (event: MouseEvent) => {
  console.warn('Button clicked')
  return { type: 'click', data: event }
}

const config = {
  api: 'https://api.example.com',
  timeout: 5000,
}

// ✅ Correct with unused variable
const processData = (data: any, _metadata: object) => {
  return data.map(item => ({
    id: item.id,
    name: item.name,
  }))
}
```

```typescript
// ❌ Incorrect
function handleClick(event: MouseEvent) {
  console.log("Button clicked");
  return { type: "click", data: event };
}

const config = {
  api: "https://api.example.com",
  timeout: 5000
};
```

## Project Structure

This is a monorepo with the following structure:
- `apps/web/` - Next.js web application
- `apps/mobile/` - React Native/Expo mobile app
- `packages/` - Shared packages and utilities

## Linting Commands

- **Lint all packages**: `pnpm lint`
- **Lint with auto-fix**: `pnpm lint:fix`
- **Lint specific package**: `cd apps/web && pnpm lint`

## Special File Exceptions

- `packages/ui/src/theme/index.tsx`: `func-style` rule disabled
- `apps/mobile/metro.config.js`: `@typescript-eslint/no-require-imports` disabled

## Dependencies and Framework Notes

- Uses TypeScript with strict ESLint configuration
- Next.js for web app (includes `eslint-config-next`)
- React Native/Expo for mobile app
- Turbo for monorepo task coordination

## When Editing Files

1. Always check existing code style in the file/directory
2. Follow the arrow function preference
3. Use single quotes consistently
4. Avoid semicolons
5. Use appropriate console methods (not console.log)
6. Run linting after making changes: `pnpm lint`