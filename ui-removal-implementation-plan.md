# UI Removal Implementation Plan

This document provides a detailed, step-by-step implementation plan for removing the shared UI library and simplifying both apps to basic welcome screens.

## Step 1: Remove UI Package Dependencies

First, we'll update the package.json files to remove dependencies on the shared UI package and GlueStack.

### 1.1 Update Mobile App Package.json

```bash
# Navigate to mobile app directory
cd apps/mobile

# Remove UI and GlueStack dependencies
pnpm remove @theragpt/ui @gluestack-style/react @gluestack-ui/themed
```

### 1.2 Update Web App Package.json

```bash
# Navigate to web app directory
cd apps/web

# Remove UI dependency
pnpm remove @theragpt/ui
```

### 1.3 Update Workspace Configuration

Edit `pnpm-workspace.yaml` to remove the UI package from the workspace:

```yaml
packages:
  - 'apps/*'
  - 'packages/config'
  - 'packages/logic'
  # Remove the line below
  # - 'packages/ui'
```

## Step 2: Simplify Mobile App

### 2.1 Update ThemeProvider

Replace the content of `apps/mobile/app/providers/ThemeProvider.tsx` with:

```tsx
import React from 'react'

export interface ThemeProviderProps {
    children: React.ReactNode
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    return <>{children}</>
}

export default ThemeProvider
```

### 2.2 Update Home Screen

Replace the content of `apps/mobile/app/index.tsx` with:

```tsx
import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function HomeScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Welcome to TheraGPT</Text>
                <Text style={styles.description}>
                    A Cognitive Behavioral Therapy (CBT) application designed to help you
                    identify cognitive distortions in your thoughts and reframe them in a
                    more balanced way.
                </Text>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24,
    },
})
```

### 2.3 Update Layout

Replace the content of `apps/mobile/app/_layout.tsx` with:

```tsx
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import ThemeProvider from './providers/ThemeProvider'

export default function RootLayout() {
    return (
        <ThemeProvider>
            <StatusBar style="auto" />
            <Stack
                screenOptions={{
                    headerStyle: {
                        backgroundColor: '#f4f4f4',
                    },
                    headerTintColor: '#333',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                }}
            >
                <Stack.Screen
                    name="index"
                    options={{
                        title: 'TheraGPT',
                    }}
                />
            </Stack>
        </ThemeProvider>
    )
}
```

### 2.4 Remove Unused Screen Files

Delete the following files:
- `apps/mobile/app/analysis.tsx`
- `apps/mobile/app/reframe-detail.tsx`
- `apps/mobile/app/reframes.tsx`
- `apps/mobile/app/thought.tsx`
- `apps/mobile/app/(tabs)` (directory)

```bash
# Navigate to mobile app directory
cd apps/mobile/app

# Remove unused screen files
rm analysis.tsx reframe-detail.tsx reframes.tsx thought.tsx
rm -rf "(tabs)"
```

## Step 3: Simplify Web App

### 3.1 Update Home Page

Replace the content of `apps/web/app/page.tsx` with:

```tsx
export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
                <h1 className="text-4xl font-bold mb-8">Welcome to TheraGPT</h1>
                <p className="mb-4">
                    A Cognitive Behavioral Therapy (CBT) application designed to help you
                    identify cognitive distortions in your thoughts and reframe them in a
                    more balanced way.
                </p>
            </div>
        </main>
    )
}
```

### 3.2 Remove API Routes

Delete the API routes that depend on UI components:

```bash
# Navigate to web app directory
cd apps/web/app

# Remove API routes
rm -rf api/analyze
```

## Step 4: Remove UI Package

Delete the entire UI package:

```bash
# Navigate to project root
cd /Users/seanoliver/code/theragpt-app

# Remove UI package
rm -rf packages/ui
```

## Step 5: Update Dependencies

Reinstall dependencies to ensure everything is properly linked:

```bash
# Navigate to project root
cd /Users/seanoliver/code/theragpt-app

# Install dependencies
pnpm install
```

## Step 6: Test Mobile App

Build and run the mobile app to ensure it works correctly:

```bash
# Navigate to mobile app directory
cd apps/mobile

# Build the app
pnpm run build

# Run the app
pnpm run start
```

Verify that:
- The app builds without errors
- The welcome screen displays correctly
- No references to the UI package remain

## Step 7: Test Web App

Build and run the web app to ensure it works correctly:

```bash
# Navigate to web app directory
cd apps/web

# Build the app
pnpm run build

# Run the app
pnpm run dev
```

Verify that:
- The app builds without errors
- The welcome screen displays correctly
- No references to the UI package remain

## Step 8: Test Monorepo

Build the entire monorepo to ensure everything works together:

```bash
# Navigate to project root
cd /Users/seanoliver/code/theragpt-app

# Build all packages and apps
pnpm run build
```

Verify that:
- All packages and apps build without errors
- No references to the UI package remain in the codebase

## Step 9: Commit Changes

Commit the changes to version control:

```bash
# Navigate to project root
cd /Users/seanoliver/code/theragpt-app

# Add all changes
git add .

# Commit changes
git commit -m "Remove shared UI package and simplify apps to basic welcome screens"
```

## Troubleshooting

If you encounter any issues during the implementation, here are some common problems and solutions:

### Missing Dependencies

If you encounter errors about missing dependencies, check if there are any remaining references to the UI package or GlueStack components and remove them.

### Build Errors

If you encounter build errors:
1. Check for any remaining imports of `@theragpt/ui` or GlueStack components
2. Ensure all dependencies are properly installed with `pnpm install`
3. Clear build caches with `pnpm run clean` and try again

### Runtime Errors

If you encounter runtime errors:
1. Check the console for specific error messages
2. Ensure all UI components have been properly replaced
3. Verify that the ThemeProvider is correctly implemented