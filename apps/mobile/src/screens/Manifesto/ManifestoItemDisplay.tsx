import theme from '@/apps/mobile/lib/theme'
import { Statement } from '@/packages/logic/src/statement/statementService'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'

export const ManifestoItemDisplay = ({
  statement,
  setIsEditing,
}: {
  statement: Statement
  setIsEditing: (isEditing: boolean) => void
}) => {
  return (
    <TouchableOpacity onPress={() => setIsEditing(true)}>
      <Text key={statement.id} style={styles.text}>
        {statement.text}
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  text: {
    color: theme.colors.text,
    fontFamily: theme.fontFamilies.bodySans,
    fontWeight: '500',
    fontSize: 20,
    letterSpacing: 0.15,
    textShadowColor: 'rgba(44,44,44,0.10)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    paddingVertical: 2,
  },
})
