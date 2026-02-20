# AGENTS.md - Developer Guidelines for Vibes

This document provides guidelines for agentic coding agents working on this codebase.

## Project Overview

- **Type**: Expo/React Native mobile application (iOS/Android/Web)
- **Language**: TypeScript (strict mode enabled)
- **Framework**: Expo SDK 54 with expo-router for file-based routing
- **State Management**: React hooks (useState, useContext, etc.)
- **Testing**: Not yet configured

## Build & Development Commands

### Running the App

```bash
# Start Expo development server
npm start          # or: npx expo start

# Run on specific platforms
npm run android    # Android emulator
npm run ios        # iOS simulator
npm run web        # Web browser
```

### Linting & Type Checking

```bash
# Run ESLint (includes TypeScript checking via expo lint)
npm run lint

# TypeScript strict mode is enforced (see tsconfig.json)
```

### Testing

**No tests currently exist in this project.** When adding tests, use:

```bash
# Recommended: Jest (standard with Expo)
# Run all tests
npx jest

# Run a single test file
npx jest path/to/test-file.test.ts

# Run tests matching a pattern
npx jest --testNamePattern="component name"

# Watch mode
npx jest --watch

# With coverage
npx jest --coverage
```

For React Native/Expo projects, also consider:
- `jest-expo` - Jest preset for Expo projects
- `@testing-library/react-native` - Component testing

## Code Style Guidelines

### General Principles

- Use functional components with hooks
- Prefer composition over inheritance
- Keep components small and focused
- Use TypeScript strict mode - no `any` types

### File Organization

```
app/                    # Expo Router pages (file-based routing)
  (tabs)/               # Tab-based screens
  _layout.tsx           # Root layout
  index.tsx             # Home screen

components/             # Reusable UI components
  ui/                   # UI primitives
  *.tsx                 # Feature components

hooks/                  # Custom React hooks
constants/              # App constants (colors, config)
```

### Imports

- Use path aliases (`@/*` maps to root):
  ```typescript
  import { useThemeColor } from '@/hooks/use-theme-color';
  import { Colors } from '@/constants/theme';
  ```
- Order imports: external libraries → internal modules → relative paths
- Group imports with blank lines between groups

### Naming Conventions

- **Components**: PascalCase (e.g., `HelloWave`, `ThemedText`)
- **Hooks**: camelCase with `use` prefix (e.g., `useThemeColor`)
- **Constants**: PascalCase for exported constants (e.g., `Colors`, `Fonts`)
- **Files**: kebab-case for general files, PascalCase for components
- **Types/Interfaces**: PascalCase (e.g., `ThemedTextProps`)

### TypeScript Guidelines

- Always define prop types for components:
  ```typescript
  export type ThemedTextProps = TextProps & {
    lightColor?: string;
    darkColor?: string;
    type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
  };
  ```
- Use explicit return types for complex functions
- Avoid `any` - use `unknown` if type is truly unknown

### Component Patterns

- Use `StyleSheet.create` for styles (not inline styles except for dynamic values)
- Destructure props with defaults
- Extract reusable logic into custom hooks
- Use `platformSelect`/`Platform.OS` for platform-specific code

### Error Handling

- Use try/catch for async operations
- Display user-friendly error messages in UI
- Log errors for debugging (avoid console.log in production)

### React Native Specific

- Use `react-native-safe-area-context` for safe area handling
- Use `expo-haptics` for haptic feedback
- Use `expo-image` for optimized images
- Use `react-native-reanimated` for animations (worklets required)

### Dark Mode Support

Follow the pattern in `constants/theme.ts`:
- Define colors in `Colors.light` and `Colors.dark`
- Use `useThemeColor` hook to get themed colors
- Props like `lightColor`/`darkColor` allow component-level overrides

### ESLint

The project uses `eslint-config-expo` with flat config. Run `npm run lint` before committing.

## Common Tasks

### Adding a New Screen

1. Create `app/screen-name.tsx` (or `app/folder/screen.tsx` for nested routes)
2. Add `_layout.tsx` if needed for nested navigation
3. Use existing layout components or create new ones

### Adding a New Component

1. Create in appropriate folder under `components/`
2. Define TypeScript interfaces for props
3. Use theming hooks for colors
4. Add styles with `StyleSheet.create`

### Adding a New Hook

1. Create in `hooks/` folder
2. Export function with `use` prefix
3. Document parameters and return values

## Additional Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [Expo Router](https://docs.expo.dev/router/introduction)
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
