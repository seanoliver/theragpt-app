# Quick Authentication Setup

Get authentication running in your TheraGPT app in 3 simple steps:

## 1. Add AuthProvider to Web App

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

## 2. Add Auth UI to Header/Navigation

```tsx
// apps/web/components/layout/Header.tsx
'use client'

import { useState } from 'react'
import { useAuth } from '@theragpt/logic'
import { AuthModal, UserMenu } from '@/components/auth'
import { Button } from '@/components/ui/button'

export function Header() {
  const { isAuthenticated } = useAuth()
  const [showAuth, setShowAuth] = useState(false)

  return (
    <header className="flex justify-between items-center p-4">
      <h1>TheraGPT</h1>
      
      <div>
        {isAuthenticated ? (
          <UserMenu />
        ) : (
          <Button onClick={() => setShowAuth(true)}>
            Sign In
          </Button>
        )}
      </div>

      {showAuth && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <AuthModal 
            onClose={() => setShowAuth(false)}
            onSuccess={() => setShowAuth(false)}
          />
        </div>
      )}
    </header>
  )
}
```

## 3. Add AuthProvider to Mobile App

```tsx
// apps/mobile/App.tsx
import { AuthProvider } from './src/shared/auth'

export default function App() {
  return (
    <AuthProvider>
      {/* Your existing app content */}
    </AuthProvider>
  )
}
```

## That's it! 🎉

Your app now has:
- ✅ **Sign up/Sign in functionality**
- ✅ **Automatic data migration** from local storage to Supabase
- ✅ **Cross-device sync** for authenticated users
- ✅ **Offline-first design** - works without authentication
- ✅ **User menu** with sign out option

## Optional Enhancements

### Show Migration Status
```tsx
import { MigrationStatus } from '@/components/auth'

// Show migration progress after user signs in
{isAuthenticated && <MigrationStatus />}
```

### Add Auth to Specific Pages
```tsx
// apps/web/app/profile/page.tsx
'use client'

import { useAuth } from '@theragpt/logic'
import { AuthModal } from '@/components/auth'

export default function ProfilePage() {
  const { isAuthenticated, user } = useAuth()

  if (!isAuthenticated) {
    return <AuthModal />
  }

  return (
    <div>
      <h1>Profile</h1>
      <p>Welcome, {user?.email}</p>
    </div>
  )
}
```

Your users can now:
- Use the app completely anonymously (current behavior)
- Sign up for an account to sync data across devices
- Have their local journal entries automatically migrated when they sign in