import React from 'react'
import {
  ActivityIndicator,
  ScrollView,
  Text,
  View,
  StyleSheet,
  TextStyle,
  ViewStyle,
} from 'react-native'
import Markdown from 'react-native-markdown-display'
import Modal from 'react-native-modal'
import { colors } from '../../../../lib/theme'
import AlternativeItem from './AlternativeItem'
import ActionButton from './ActionButton'

interface Alternative {
  tone: string
  text: string
}

interface AIModalProps {
  visible: boolean
  value: string
  alternatives: Alternative[]
  loading: boolean
  error: string | null
  onClose: () => void
  onReplace: (text: string) => void
  onAppend: (text: string) => void
  onRetry: (text: string) => void
}

const markdownStyle: Record<string, TextStyle | ViewStyle> = {
  text: {
    color: colors.text.primary,
    fontSize: 16,
    textAlign: 'left',
  },
  body: {
    backgroundColor: 'transparent',
  },
}

const AIModal: React.FC<AIModalProps> = ({
  visible,
  value,
  alternatives,
  loading,
  error,
  onClose,
  onReplace,
  onAppend,
  onRetry,
}) => (
  <Modal
    isVisible={visible}
    onBackdropPress={onClose}
    onBackButtonPress={onClose}
    style={styles.modal}
  >
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerLabel}>Original Statement</Text>
        <Markdown style={markdownStyle}>{value}</Markdown>
      </View>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
      >
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.text.primary} />
            <Text style={styles.loadingText}>Generating alternatives...</Text>
          </View>
        )}
        {error && <Text style={styles.errorText}>{error}</Text>}
        {!loading &&
          !error &&
          alternatives.map(variation => (
            <AlternativeItem
              key={variation.tone}
              variation={variation}
              onReplace={() => onReplace(variation.text)}
              onAppend={() => onAppend(variation.text)}
              onRetry={() => onRetry(variation.text)}
            />
          ))}
      </ScrollView>
      <ActionButton onPress={onClose}>Close</ActionButton>
    </View>
  </Modal>
)

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  container: {
    backgroundColor: colors.charcoal[200],
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    padding: 0,
    minHeight: 340,
    maxHeight: '70%',
    overflow: 'hidden',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderColor: colors.charcoal[300],
    backgroundColor: colors.charcoal[200],
    zIndex: 2,
  },
  headerLabel: {
    color: colors.text.primary,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
    opacity: 0.7,
    textAlign: 'left',
    letterSpacing: 0.5,
  },
  scrollView: {
    marginBottom: 12,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  scrollViewContent: {
    paddingBottom: 24,
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: 24,
  },
  loadingText: {
    color: colors.text.primary,
    marginTop: 12,
  },
  errorText: {
    color: 'red',
    marginTop: 12,
    textAlign: 'center',
  },
})

export default AIModal
