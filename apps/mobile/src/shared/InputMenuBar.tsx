import {
  InputAccessoryView,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  TextInput,
} from 'react-native'
import { colors } from '../../lib/theme'

export const InputMenuBar = ({
  inputRef,
  inputAccessoryViewID,
}: {
  inputRef: React.RefObject<TextInput>
  inputAccessoryViewID: string
}) => {

  return (
    <InputAccessoryView nativeID={inputAccessoryViewID}>
      <View style={styles.accessoryContainer}>
        <TouchableOpacity
          style={styles.doneButton}
          onPress={() => inputRef.current?.blur()}
        >
          <Text style={styles.doneButtonText}>Done</Text>
        </TouchableOpacity>
      </View>
    </InputAccessoryView>
  )
}

const styles = StyleSheet.create({
  accessoryContainer: {
    backgroundColor: colors.charcoal[200],
    padding: 8,
    borderTopWidth: 1,
    borderColor: colors.charcoal[300],
    alignItems: 'flex-end',
  },
  doneButton: {
    backgroundColor: colors.charcoal[100],
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  doneButtonText: {
    color: colors.text.primary,
    fontWeight: '600',
    fontSize: 16,
  },
})
