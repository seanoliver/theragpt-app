# Supabase Integration Guide

TheraGPT uses Supabase as the primary data store with local storage as a fallback. Here's how the integration works:

## 🔄 How It Works

### Data Flow
1. **Online Mode**: Data is read from and written to Supabase first, then cached locally
2. **Offline Mode**: Data is read from and written to local storage only
3. **Sync**: When going back online, local changes can be synced to Supabase

### Existing API Unchanged
The Zustand store and service methods remain exactly the same:

```typescript
import { useEntryStore, entryService, MigrationService } from '@theragpt/logic'

// Your existing code continues to work
const { entries, addEntry, updateEntry, deleteEntry } = useEntryStore()
```

## 🗄️ Database Schema

The Supabase database now has these tables:
- `entries` - Main journal entries with user authentication
- `reframes` - Therapeutic reframings linked to entries
- `distortion_instances` - Detected cognitive distortions in entries
- `distortions` - Reference data for all distortion types (pre-populated)

## 🔐 Authentication Integration

To use Supabase features, users need to be authenticated.

```typescript
import { supabase } from '@theragpt/config'

// Sign up
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123'
})

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
})

// Sign out
await supabase.auth.signOut()
```

## 📱 Migration for Existing Users

For users with existing local data, run migration after authentication:

```typescript
import { MigrationService, entryService } from '@theragpt/logic'

// After user signs in
const { data: { user } } = await supabase.auth.getUser()
if (user) {
  try {
    await MigrationService.migrateLocalEntriesToSupabase(entryService)
    // Optionally clear local storage after successful migration
    // await MigrationService.clearLocalStorageAfterMigration(entryService)
  } catch (error) {
    console.error('Migration failed:', error)
  }
}
```

## 🔧 Configuration

### Environment Variables
Make sure these are set in the apps:

**Web (.env):**
```
NEXT_PUBLIC_SUPABASE_URL=https://pobyuvznrxxbnqksrepx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

**Mobile (.env):**
```
EXPO_PUBLIC_SUPABASE_URL=https://pobyuvznrxxbnqksrepx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### Supabase Client Access
```typescript
import { supabase } from '@theragpt/config'

// The client is fully typed with your database schema
const { data, error } = await supabase
  .from('entries')
  .select('*')
```

## 🎯 Benefits

1. **Seamless Transition**: The existing code continues to work unchanged
2. **Offline Support**: App works offline with local storage fallback
3. **Real-time Sync**: Data syncs automatically when online
4. **Type Safety**: Full TypeScript support with generated database types
5. **Security**: Row Level Security ensures users only see their own data
6. **Cross-Device**: Data syncs across all user devices

## 🔍 Debugging

The service includes comprehensive logging:
- Supabase operations are logged with fallback behavior
- Migration status is logged for troubleshooting
- Online/offline status affects data source selection

Check browser/app console for detailed logs about data operations.