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

  console.log('inside statement card: ', statement)
  return (
    <View style={[styles.card]}>
      <TouchableOpacity onPress={handlePress}>
        <Text
          key={statement.id}
          style={[styles.text, { color: theme.colors.text }]}
        >
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
    fontSize: 15,
    lineHeight: 24,
    textAlign: 'left',
    fontWeight: '400',
    letterSpacing: 0.1,
  },
})
