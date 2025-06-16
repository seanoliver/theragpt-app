# Authentication Integration Guide

TheraGPT now includes optional authentication that enhances the app with cross-device sync while keeping all core functionality available offline. Users can use the app completely anonymously or sign up for an account to sync their data.

## 🏗️ Architecture

### Core Principles
- **Offline-First**: App works fully without authentication
- **Enhancement**: Authentication adds data sync, not core functionality  
- **Graceful Degradation**: Falls back to local storage when authentication fails
- **Privacy-Focused**: Users can remain anonymous if they prefer

### Data Flow
```
Anonymous User:     [Local Storage] ←→ [Zustand Store] ←→ [UI]
Authenticated User: [Supabase] ↔ [Local Storage] ←→ [Zustand Store] ←→ [UI]
```

## 📱 Integration

### 1. Web App Setup

**Add AuthProvider to your layout:**
```tsx
// apps/web/app/layout.tsx
import { AuthProvider } from '@/components/auth'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
```

**Add authentication UI to your components:**
```tsx
// Example: Add to header/navigation
import { useAuth, UserMenu, AuthModal } from '@theragpt/logic'
import { AuthModal } from '@/components/auth'

function Header() {
  const { isAuthenticated } = useAuth()
  const [showAuth, setShowAuth] = useState(false)

  return (
    <header>
      {isAuthenticated ? (
        <UserMenu />
      ) : (
        <button onClick={() => setShowAuth(true)}>
          Sign In
        </button>
      )}
      
      {showAuth && (
        <AuthModal 
          onClose={() => setShowAuth(false)}
          onSuccess={() => setShowAuth(false)}
        />
      )}
    </header>
  )
}
```

### 2. Mobile App Setup

**Add AuthProvider to your app root:**
```tsx
// apps/mobile/App.tsx
import { AuthProvider } from './src/shared/auth'

export default function App() {
  return (
    <AuthProvider>
      {/* Your existing app structure */}
    </AuthProvider>
  )
}
```

**Use authentication hooks in your components:**
```tsx
import { useAuth, useSignIn, useSignOut } from './src/shared/auth'

function ProfileScreen() {
  const { isAuthenticated, user } = useAuth()
  const { signOut } = useSignOut()

  if (!isAuthenticated) {
    return <SignInScreen />
  }

  return (
    <View>
      <Text>Welcome, {user?.email}</Text>
      <Button onPress={signOut} title="Sign Out" />
    </View>
  )
}
```

## 🔐 Available Hooks

### Core Authentication
```tsx
import { 
  useAuth,           // Main auth state and actions
  useIsAuthenticated, // Boolean for quick auth check
  useUser,           // Current user object
  useSession,        // Current session object
} from '@theragpt/logic'

const { 
  user, 
  isAuthenticated, 
  isLoading, 
  signIn, 
  signUp, 
  signOut 
} = useAuth()
```

### Form Helpers
```tsx
import { 
  useSignIn,        // Sign in with loading/error states
  useSignUp,        // Sign up with validation
  useSignOut,       // Sign out with loading state  
  usePasswordReset, // Password reset functionality
} from '@theragpt/logic'

const { signIn, isLoading, error, clearError } = useSignIn()
```

### Data Migration
```tsx
import { 
  useAuthMigration,  // Manual migration control
  useAutoMigration,  // Automatic migration on auth
} from '@theragpt/logic'

// Automatically migrates local data when user signs in
const migration = useAutoMigration(true)
```

## 📋 Available Components (Web)

### Authentication Forms
```tsx
import { 
  AuthModal,        // Complete auth flow in modal
  SignInForm,       // Standalone sign in form
  SignUpForm,       // Standalone sign up form
  ResetPasswordForm,// Password reset form
  UserMenu,         // Dropdown menu for authenticated users
  MigrationStatus,  // Shows migration progress
} from '@/components/auth'
```

### Example Usage
```tsx
// Simple auth modal
<AuthModal 
  defaultMode="signin" 
  onSuccess={() => console.log('User signed in')}
  onClose={() => setShowModal(false)}
/>

// User menu in header
{isAuthenticated && <UserMenu />}

// Migration status after sign in
{isAuthenticated && <MigrationStatus />}
```

## 🔄 Data Migration

When users sign in for the first time, their local journal entries are automatically migrated to Supabase:

### Automatic Migration
```tsx
// Happens automatically when useAutoMigration() is used
const migration = useAutoMigration(true)

if (migration.isMigrating) {
  return <MigrationStatus />
}
```

### Manual Migration
```tsx
import { MigrationService, entryService } from '@theragpt/logic'

// Trigger migration manually
try {
  await MigrationService.migrateLocalEntriesToSupabase(entryService)
  console.log('Migration complete!')
} catch (error) {
  console.error('Migration failed:', error)
}
```

## 🎯 User Experience

### Anonymous Users
- Full app functionality available
- Data stored locally only
- No account required
- Complete privacy

### Authenticated Users  
- All anonymous features plus:
- Cross-device data sync
- Secure cloud backup
- Account recovery options
- Seamless local ↔ cloud sync

### Migration Flow
1. User signs up/in for first time
2. Auto-migration starts in background
3. Local entries sync to Supabase
4. Future entries sync automatically
5. Local storage remains as backup

## 🛠️ Development Notes

### Testing Authentication
```tsx
// Use in development to test auth states
import { useAuthStore } from '@theragpt/logic'

const authStore = useAuthStore()
authStore.setUser(mockUser) // Set mock user
authStore.setUser(null)     // Clear user
```

### Error Handling
```tsx
const { error, clearError } = useAuthError()

useEffect(() => {
  if (error) {
    // Handle auth errors
    console.error('Auth error:', error)
    // Clear error after showing to user
    setTimeout(clearError, 5000)
  }
}, [error])
```

### Offline Behavior
- App continues working when offline
- Data syncs when connection restored
- Local storage always available as backup
- No authentication failures block core features

## 🔧 Configuration

The authentication system uses your existing Supabase configuration from the config package. No additional setup required beyond what was done for the Supabase integration.

Environment variables are already configured:
- Web: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Mobile: `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY`