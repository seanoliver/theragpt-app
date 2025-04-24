import React from 'react'
import { FlatList, View, StyleSheet } from 'react-native'
import { ManifestoCard } from './ManifestoCard'
import { DisplayStatement } from './useManifestoData'

interface ManifestoListProps {
  statements: DisplayStatement[]
}

export const ManifestoList: React.FC<ManifestoListProps> = ({ statements }) => {
  return (
    <FlatList
      data={statements}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <View style={styles.cardWrapper}>
          <ManifestoCard statement={item} />
        </View>
      )}
      contentContainerStyle={styles.listContent}
    />
  )
}

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 120,
  },
  cardWrapper: {
    marginBottom: 16,
    marginHorizontal: 16,
  },
})
