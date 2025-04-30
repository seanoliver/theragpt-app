// Test file - imports removed as they're currently unused

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}))

// Mock Appearance API
jest.mock('react-native', () => ({
  Appearance: {
    getColorScheme: jest.fn(),
    addChangeListener: jest.fn(),
    removeChangeListener: jest.fn(),
  },
}))

// Removed unused constant

// ... existing code ...