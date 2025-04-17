import {
  MarkdownTextInput,
  parseExpensiMark,
} from '@expensify/react-native-live-markdown';
import React from 'react';
import { StyleSheet } from 'react-native';
import { colors } from '../../lib/theme';

export function MarkdownSandbox() {
  const [text, setText] = React.useState('Hello, *world*!')

  return (
    <MarkdownTextInput
      style={styles.container}
      value={text}
      onChangeText={setText}
      parser={parseExpensiMark}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.charcoal[100],
    padding: 20,
  },
})
