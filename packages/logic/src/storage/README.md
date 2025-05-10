# Storage Service

This directory contains the storage service implementations for TheraGPT.

## Overview

The storage service provides a unified interface for storing and retrieving data across different platforms:

1. **Device Storage** - Uses localStorage in web browsers and AsyncStorage in React Native
2. **Supabase Storage** - Uses Supabase as a backend for cloud storage with authentication

## Hybrid Storage

The default storage service is the `HybridStorageService`, which provides the following features:

- When authenticated, it stores data in both device storage and Supabase by default
- When not authenticated, it falls back to device storage only
- On sign-up, it copies data from device to Supabase
- On sign-in, it merges data from device to Supabase

This ensures that:
- Users never lose their data, even when offline
- Data is automatically synced to the cloud when authenticated
- Users can access their data across multiple devices when signed in

## Storage Modes

The hybrid storage service supports two modes:

1. `HYBRID` - Stores data in both device storage and Supabase (default when authenticated)
2. `DEVICE_ONLY` - Stores data only in device storage (default when not authenticated)

You can change the mode using:

```typescript
import { hybridStorageService, StorageMode } from '@theragpt/logic'

// To use device storage only, even when authenticated
hybridStorageService.setMode(StorageMode.DEVICE_ONLY)

// To use hybrid storage (both device and Supabase)
hybridStorageService.setMode(StorageMode.HYBRID)
```

## Supabase Setup

The Supabase storage integration requires:

1. A Supabase project with authentication enabled
2. The `entries` table in the public schema (already set up)
3. Environment variables for Supabase URL and anon key

### Database Schema

The `entries` table has the following structure:

```sql
CREATE TABLE public.entries (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  key TEXT NOT NULL,
  value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, key)
);
```

Row-level security policies ensure that users can only access their own entries.

### Environment Variables

Add the following to your `.env` file:

```
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

## Usage

The storage service is used throughout the app via the exported `storageService` singleton:

```typescript
import { storageService } from '@theragpt/logic'

// Store data
await storageService.setItem('my-key', { data: 'value' })

// Retrieve data
const data = await storageService.getItem('my-key')

// Remove data
await storageService.removeItem('my-key')

// Get all keys
const keys = await storageService.getAllKeys()

// Clear all data
await storageService.clear()
```

This will automatically use the appropriate storage backend based on authentication state and storage mode.