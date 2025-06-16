# Data Model Migration: Simplified Entry Schema

## Overview

This migration simplifies the TheraGPT data model by consolidating all entry-related data into a single `entries` table, eliminating the need for separate `reframes` and `distortion_instances` tables.

## Problem Solved

The original issue was:
- "Entry with ID not found" errors during streaming updates
- Complex relationship management between multiple tables
- Unnecessary complexity for data that doesn't need normalization

## Changes Made

### 1. Database Schema Changes

**Before:**
- `entries` table: Basic entry data
- `reframes` table: Reframe data with `entry_id` foreign key
- `distortion_instances` table: Distortion instances with `entry_id` foreign key

**After:**
- `entries` table: All data in one table
  - Added `reframe_text` column
  - Added `reframe_explanation` column
  - Added `distortions` JSONB column

### 2. Type System Updates

**Updated `packages/config/src/database.types.ts`:**
- Added new columns to entries table type definitions
- Removed dependencies on separate reframes/distortion_instances tables

### 3. Data Mapping Simplification

**Updated `packages/logic/src/entry/type-mappers.ts`:**
- Simplified `mapDbEntryToAppEntry()` to work with single table
- Updated `mapAppEntryToDbEntry()` to serialize data to new columns
- Removed separate mapper functions for reframes and distortions
- Added JSON serialization/deserialization for distortions array

### 4. Service Layer Simplification

**Updated `packages/logic/src/entry/entry.service.ts`:**
- Simplified `fetchFromSupabase()` - no more complex joins
- Simplified `saveEntryToSupabase()` - single insert operation
- Simplified `updateEntryInSupabase()` - single update operation
- Removed complex relationship management logic

**Updated `packages/logic/src/entry/migration.service.ts`:**
- Simplified migration logic to work with single table

### 5. Frontend Updates

**Updated `apps/web/components/thought-analysis/useAnalyzeThought.tsx`:**
- Simplified ID generation (consistent reframe ID pattern)
- Removed complex foreign key management
- Streamlined streaming update logic

## Migration Process

### Database Migration

✅ **COMPLETED** - Migration was applied directly via Supabase MCP tool:
1. Added new columns to entries table
2. Migrated existing reframes data
3. Migrated existing distortion_instances data (as JSONB)
4. Preserved all existing data
5. Old tables remain for safety (can be dropped manually if desired)

### Code Deployment

1. Deploy updated TypeScript code
2. Verify all builds pass
3. Test entry creation and updates

## Benefits

1. **Simplified Architecture**: Single table for all entry data
2. **Reduced Complexity**: No foreign key management needed
3. **Better Performance**: No joins required for fetching entries
4. **Easier Debugging**: All data in one place
5. **Atomic Updates**: All entry data updated in single transaction

## Data Structure

### Reframe Data
Stored directly in entries table:
- `reframe_text`: The reframed thought text
- `reframe_explanation`: Explanation of the reframe

### Distortions Data
Stored as JSONB array in `distortions` column:
```json
[
  {
    "id": "uuid",
    "label": "All-or-Nothing Thinking",
    "distortionId": "all-or-nothing-thinking",
    "description": "Description of the distortion",
    "confidenceScore": 0.85
  }
]
```

## Backward Compatibility

- The migration preserves all existing data
- Old tables are kept (but can be dropped after verification)
- Application types remain the same from consumer perspective
- Only internal data mapping logic changed

## Testing

- ✅ Logic package builds successfully
- ✅ Web app builds successfully
- ✅ TypeScript compilation passes
- ✅ All imports resolved correctly
- ✅ Database migration applied successfully via Supabase MCP
- ✅ New columns added to entries table (reframe_text, reframe_explanation, distortions)
- ✅ Data migration completed (existing data preserved)

## Migration Status

✅ **COMPLETED** - Database migration has been successfully applied to the Supabase project:
- New columns added to entries table
- Existing data migrated to new structure
- All builds passing with new schema

## Next Steps

1. ✅ Database migration applied
2. Monitor application behavior with new simplified data model
3. After verification period, optionally drop old tables (reframes, distortion_instances)
4. Update any remaining references to old schema if found
5. Consider removing old migration service methods that reference separate tables