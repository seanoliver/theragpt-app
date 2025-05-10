# Entry Service

This directory contains the entry service implementations for TheraGPT.

## Overview

The entry service provides a unified interface for managing therapy entries, including:

1. Creating, reading, updating, and deleting entries
2. Managing reframes for entries
3. Managing distortion instances for entries

## Supabase Entry Service

The `SupabaseEntryService` provides a cloud-based implementation of the entry service using Supabase as the backend. It requires the user to be authenticated with Supabase.

### Features

- Stores entries in the Supabase database
- Automatically associates entries with the authenticated user
- Handles relationships between entries, reframes, and distortion instances
- Provides caching for better performance

### Database Schema

The Supabase implementation uses the following tables:

1. `therapy_entries` - Stores the main entry data
2. `reframes` - Stores reframes associated with entries
3. `distortion_instances` - Stores distortion instances associated with entries
4. `distortion_types` - Stores the available distortion types

Row-level security policies ensure that users can only access their own entries.

## Usage

The entry service is used throughout the app via the exported `entryService` singleton:

```typescript
import { entryService, supabaseEntryService } from '@theragpt/logic'

// Create a new entry
const entry = await entryService.create({
  rawText: 'My thought...',
  createdAt: Date.now()
})

// Update an entry
await entryService.update({
  id: entry.id,
  title: 'My updated title',
  reframe: {
    id: uuidv4(),
    entryId: entry.id,
    text: 'Reframed thought',
    explanation: 'Explanation of reframe'
  }
})

// Get all entries
const entries = await entryService.getAll()

// Get entry by ID
const entry = await entryService.getById('entry-id')

// Delete an entry
await entryService.deleteEntry('entry-id')
```

When using Supabase, you can switch to the Supabase entry service:

```typescript
// Use the Supabase entry service
import { supabaseEntryService } from '@theragpt/logic'

// Initialize the service
await supabaseEntryService.init()

// Create a new entry
const entry = await supabaseEntryService.create({
  rawText: 'My thought...',
  createdAt: Date.now()
})
```

## Authentication

The Supabase entry service requires the user to be authenticated with Supabase. It uses the `supabaseAuthService` to check authentication status and get the current user.

If the user is not authenticated, the service will throw an error when trying to create, update, or delete entries.