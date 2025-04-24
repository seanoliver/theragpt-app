import React, { useMemo, useState } from 'react'
import { SafeAreaView, StyleSheet, View } from 'react-native'
import { useTheme } from '../../../lib/theme/context'
import { FAB } from '../../shared/FAB'
// Placeholder imports for new components to be implemented
// import { SearchBar } from './SearchBar';
// import { NewStatementButton } from './NewStatementButton';
import { ManifestoList } from './ManifestoList'
// import { EmptyState } from './EmptyState';
import { filterManifestoData } from './filterManifestoData'
import { useManifestoData } from './useManifestoData'
import { Theme } from '@/apps/mobile/lib/theme'

export const ManifestoScreen = () => {
  const { themeObject: theme } = useTheme()
  const styles = makeStyles(theme)
  const [searchQuery, setSearchQuery] = useState('')
  const {
    data: statements,
    loading,
    error,
    createStatement,
  } = useManifestoData()

  // Filtered data based on search query
  const filteredStatements = useMemo(
    () => filterManifestoData(statements, searchQuery),
    [statements, searchQuery],
  )

  // Handler for creating a new statement
  const handleNew = async () => {
    await createStatement()
    // Optionally scroll to top or show feedback
  }

  // TODO: Render loading or error state
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          {/* Replace with a loading spinner if desired */}
        </View>
      </SafeAreaView>
    )
  }
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>{/* TODO: Replace with error UI */}</View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        {/* TODO: <SearchBar value={searchQuery} onChange={setSearchQuery} /> */}
        <ManifestoList statements={filteredStatements} />
        {/* TODO: {filteredStatements.length === 0 && <EmptyState />} */}
      </View>
      <FAB onPress={handleNew} backgroundColor={theme.colors.accent}>
        {/* TODO: Use Ionicons or similar for "+" icon */}
      </FAB>
    </SafeAreaView>
  )
}

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    inner: {
      flex: 1,
      paddingTop: 16,
      paddingHorizontal: 0,
    },
    centered: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
  })
