# UI Removal Strategy Summary

## Overview

This document summarizes our strategy for removing the shared UI library (`packages/ui`) and simplifying both the mobile and web apps to basic welcome screens. This approach will allow us to start fresh with UI implementation in a future task.

## Key Documents

1. **[UI Removal Specification](ui-removal-specification.md)**: Detailed specification of what needs to be removed and how the apps should be simplified.
2. **[UI Removal Implementation Plan](ui-removal-implementation-plan.md)**: Step-by-step instructions for implementing the removal.

## Strategy Highlights

### 1. Current State

- Monorepo with shared UI package (`packages/ui`)
- GlueStack-based UI components used by both mobile and web apps
- Complex UI components for various features (thoughts, analysis, reframes)

### 2. Target State

- No shared UI package
- Simplified mobile app with basic welcome screen
- Simplified web app with basic welcome screen
- Both apps able to build and run independently

### 3. Key Changes

1. **Remove Dependencies**:
   - Remove `@theragpt/ui` from both apps
   - Remove GlueStack dependencies from mobile app
   - Update workspace configuration

2. **Simplify Mobile App**:
   - Replace ThemeProvider with minimal implementation
   - Create basic welcome screen
   - Remove unused screen files

3. **Simplify Web App**:
   - Create basic welcome screen
   - Remove API routes that depend on UI components

4. **Clean Up**:
   - Remove the entire UI package
   - Reinstall dependencies

### 4. Benefits

- **Simplification**: Removes complex UI code that's no longer needed
- **Independence**: Each app becomes responsible for its own UI
- **Fresh Start**: Provides a clean slate for future UI implementation
- **Reduced Dependencies**: Eliminates GlueStack and shared UI dependencies

### 5. Next Steps After Implementation

1. **Verify Functionality**: Ensure both apps build and run correctly
2. **Document Changes**: Update project documentation to reflect the new architecture
3. **Plan Future UI Implementation**: Determine the approach for implementing new UI in each app

## Timeline

| Phase | Estimated Duration |
|-------|-------------------|
| Remove Dependencies | 30 minutes |
| Simplify Mobile App | 1 hour |
| Simplify Web App | 30 minutes |
| Clean Up | 15 minutes |
| Testing | 45 minutes |
| **Total** | **3 hours** |

## Conclusion

This strategy provides a clear path to removing the shared UI library and simplifying both apps to basic welcome screens. By following the detailed implementation plan, we can ensure a smooth transition to a cleaner, more maintainable codebase that's ready for future UI implementation.