import React, { useEffect } from 'react'
import { useUserStore, userServiceProvider } from '../user'

/**
 * Example component demonstrating how to use Supabase authentication with Zustand store
 * This is for demonstration purposes only and should be adapted to your actual UI components
 */
export const SupabaseAuthExample: React.FC = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    initialize,
    signUp,
    signIn,
    signOut
  } = useUserStore()

  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')

  // Initialize the user store on component mount
  useEffect(() => {
    // The userServiceProvider is already initialized when imported
    // but we still need to initialize the store
    initialize()
  }, [initialize])

  // Handle sign up
  const handleSignUp = async () => {
    if (!email || !password) return
    await signUp(email, password)
    // Clear form on success
    if (!error) {
      setEmail('')
      setPassword('')
    }
  }

  // Handle sign in
  const handleSignIn = async () => {
    if (!email || !password) return
    await signIn(email, password)
    // Clear form on success
    if (!error) {
      setEmail('')
      setPassword('')
    }
  }

  // Handle sign out
  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <div>
      <h1>Supabase Auth Example</h1>

      {error && <div style={{ color: 'red' }}>{error}</div>}

      {isLoading && <div>Loading...</div>}

      {!isAuthenticated ? (
        <div>
          <h2>Sign In / Sign Up</h2>
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <button onClick={handleSignIn}>Sign In</button>
            <button onClick={handleSignUp}>Sign Up</button>
          </div>
        </div>
      ) : (
        <div>
          <h2>Welcome, {user?.email}</h2>
          <button onClick={handleSignOut}>Sign Out</button>

          <h3>User Details</h3>
          <pre>{JSON.stringify(user, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}

/**
 * Example of how to wrap your app with the UserServiceProvider
 * This ensures the user service is initialized before your app renders
 */
export const AppWithAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // In a real app, you would create a proper React context provider
  // This is just a simplified example

  // The userServiceProvider is already initialized when imported
  const userService = userServiceProvider.getCurrentService()

  // Initialize the user store
  const initialize = useUserStore((state: { initialize: () => Promise<void> }) => state.initialize)

  useEffect(() => {
    initialize()
  }, [initialize])

  return <>{children}</>
}