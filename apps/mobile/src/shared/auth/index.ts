export { AuthProvider } from './AuthProvider'

// Re-export auth hooks and types from logic package for convenience
export {
  useAuth,
  useIsAuthenticated,
  useUser,
  useSession,
  useAuthLoading,
  useAuthError,
  useSignUp,
  useSignIn,
  useSignOut,
  usePasswordReset,
  useAuthMigration,
  useAutoMigration,
} from '@theragpt/logic'