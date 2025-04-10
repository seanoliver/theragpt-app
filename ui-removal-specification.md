# UI Removal and Simplification Specification

## Table of Contents
1. [Introduction](#introduction)
2. [Current Architecture](#current-architecture)
3. [Removal Plan](#removal-plan)
4. [Implementation Steps](#implementation-steps)
5. [Testing](#testing)

## 1. Introduction

This document outlines the plan for removing the shared UI library (`packages/ui`) and simplifying both the mobile and web apps to basic welcome screens with minimal functionality. This approach will allow us to start fresh with UI implementation in a future task.

## 2. Current Architecture

The current architecture uses a shared UI package (`packages/ui`) that contains GlueStack-based components used by both the mobile and web apps:

```
┌─────────────────────────────────────────────────────────────┐
│                      Monorepo Structure                      │
└───────────────────────────────┬─────────────────────────────┘
                                │
        ┌─────────────────────┬─┴───────────────┬─────────────────────┐
        │                     │                 │                     │
┌───────▼───────┐    ┌────────▼────────┐ ┌─────▼──────┐     ┌────────▼────────┐
│  packages/ui  │    │   packages/logic │ │packages/config│   │    Other Packages│
└───────┬───────┘    └─────────────────┘ └──────────────┘    └─────────────────┘
        │
        │ Shared UI Components (GlueStack-based)
        │
        ├─────────────────────┐
        │                     │
┌───────▼───────┐    ┌────────▼────────┐
│   apps/mobile │    │    apps/web     │
│   (Expo)      │    │    (Next.js)    │
└───────────────┘    └─────────────────┘
```

## 3. Removal Plan

### 3.1 Objectives

1. Remove the shared UI package (`packages/ui`)
2. Simplify the mobile app to a basic welcome screen
3. Simplify the web app to a basic welcome screen
4. Ensure both apps can build and run independently

### 3.2 Target Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Monorepo Structure                      │
└───────────────────────────────┬─────────────────────────────┘
                                │
        ┌─────────────────────┬─┴───────────────┬─────────────────────┐
        │                     │                 │                     │
┌───────▼───────┐    ┌────────▼────────┐ ┌─────▼──────┐     ┌────────▼────────┐
│   apps/mobile │    │    apps/web     │ │packages/logic│    │packages/config  │
│   (Expo)      │    │    (Next.js)    │ └──────────────┘    └─────────────────┘
│   Basic UI    │    │    Basic UI     │
└───────────────┘    └─────────────────┘
```

## 4. Implementation Steps

### 4.1 Remove UI Package Dependencies

```pseudocode
FUNCTION RemoveUIPackageDependencies()
    // Remove UI package dependency from mobile app
    UPDATE apps/mobile/package.json
        REMOVE "@theragpt/ui": "workspace:*"

    // Remove UI package dependency from web app
    UPDATE apps/web/package.json
        REMOVE "@theragpt/ui": "workspace:*"

    // Remove GlueStack dependencies from mobile app
    UPDATE apps/mobile/package.json
        REMOVE "@gluestack-style/react": "^1.0.57"
        REMOVE "@gluestack-ui/themed": "^1.1.73"

    // Update workspace configuration
    UPDATE pnpm-workspace.yaml
        REMOVE "packages/ui"
END FUNCTION
```

### 4.2 Simplify Mobile App

```pseudocode
FUNCTION SimplifyMobileApp()
    // Update ThemeProvider to use React Native only
    UPDATE apps/mobile/app/providers/ThemeProvider.tsx WITH {
        import React from 'react'

        export interface ThemeProviderProps {
            children: React.ReactNode
        }

        const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
            return <>{children}</>
        }

        export default ThemeProvider
    }

    // Simplify index.tsx to basic welcome screen
    UPDATE apps/mobile/app/index.tsx WITH {
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
    }

    // Update _layout.tsx to remove UI dependencies
    UPDATE apps/mobile/app/_layout.tsx WITH {
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
    }

    // Remove other screen files that depend on UI components
    DELETE apps/mobile/app/analysis.tsx
    DELETE apps/mobile/app/reframe-detail.tsx
    DELETE apps/mobile/app/reframes.tsx
    DELETE apps/mobile/app/thought.tsx
    DELETE apps/mobile/app/(tabs)
END FUNCTION
```

### 4.3 Simplify Web App

```pseudocode
FUNCTION SimplifyWebApp()
    // Simplify page.tsx to basic welcome screen
    UPDATE apps/web/app/page.tsx WITH {
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
    }

    // Remove API routes that depend on UI components
    DELETE apps/web/app/api/analyze
END FUNCTION
```

### 4.4 Remove UI Package

```pseudocode
FUNCTION RemoveUIPackage()
    // Remove the entire UI package
    DELETE packages/ui
END FUNCTION
```

### 4.5 Update Package Dependencies

```pseudocode
FUNCTION UpdatePackageDependencies()
    // Install dependencies
    RUN pnpm install
END FUNCTION
```

## 5. Testing

### 5.1 Mobile App Testing

```pseudocode
FUNCTION TestMobileApp()
    // Test that the mobile app builds successfully
    RUN cd apps/mobile && pnpm run build

    // Test that the mobile app runs successfully
    RUN cd apps/mobile && pnpm run start

    // Verify the welcome screen displays correctly
    VERIFY_VISUALLY welcome screen title and description
END FUNCTION
```

### 5.2 Web App Testing

```pseudocode
FUNCTION TestWebApp()
    // Test that the web app builds successfully
    RUN cd apps/web && pnpm run build

    // Test that the web app runs successfully
    RUN cd apps/web && pnpm run dev

    // Verify the welcome screen displays correctly
    VERIFY_VISUALLY welcome screen title and description
END FUNCTION
```

### 5.3 Monorepo Testing

```pseudocode
FUNCTION TestMonorepo()
    // Test that the monorepo builds successfully
    RUN pnpm run build

    // Verify no references to packages/ui remain
    VERIFY no imports of @theragpt/ui in codebase
END FUNCTION