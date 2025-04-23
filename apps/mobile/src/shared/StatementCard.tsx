import { Statement } from '@still/logic/src/statement/statementService'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useTheme } from '../../lib/theme.context'

export const StatementCard = ({
  statement,
  handlePress,
}: {
  statement: Statement
  handlePress?: () => void
}) => {
  const { themeObject: theme } = useTheme()

  return (
    <View style={[styles.card, { borderColor: theme.colors.border + '22' }]}>
      <TouchableOpacity onPress={handlePress}>
        <Text key={statement.id} style={styles.text}>
          {statement.text}
        </Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 0,
    backgroundColor: 'transparent',
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.75)',
    paddingVertical: 22,
    paddingHorizontal: 22,
    borderRadius: 18,
    marginHorizontal: 20,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    borderWidth: 1.5,
    overflow: 'hidden',
  },
  text: {
    flex: 1,
    fontSize: 15,
    lineHeight: 24,
    textAlign: 'left',
    fontWeight: '400',
    letterSpacing: 0.1,
  },
})
