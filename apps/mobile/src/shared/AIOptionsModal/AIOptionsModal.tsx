import React from 'react'
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import Modal from 'react-native-modal'
import { useTheme } from '../../../lib/theme/context'
import AIOptionsModalItem from './AIOptionsModalItem'

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
  onRetry: (text: string, tone: string) => void
}

const AIOptionsModal: React.FC<AIModalProps> = ({
  visible,
  value,
  alternatives,
  loading,
  error,
  onClose,
  onReplace,
  onAppend,
  onRetry,
}) => {
  const { themeObject: theme } = useTheme()

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      style={styles.modal}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerLabel}>Original Card</Text>
          <Text
            style={{
              color: theme.colors.textOnBackground,
              fontSize: 16,
              textAlign: 'left',
            }}
          >
            {value}
          </Text>
        </View>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
        >
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator
                size="large"
                color={theme.colors.textOnBackground}
              />
              <Text style={styles.loadingText}>Generating alternatives...</Text>
            </View>
          )}
          {error && <Text style={styles.errorText}>{error}</Text>}
          {!loading &&
            !error &&
            alternatives.map(variation => (
              <AIOptionsModalItem
                key={variation.tone}
                variation={variation}
                onReplace={() => onReplace(variation.text)}
                onAppend={() => onAppend(variation.text)}
                onRetry={() => onRetry(variation.text, variation.tone)}
              />
            ))}
        </ScrollView>
        <TouchableOpacity
          style={{
            alignSelf: 'center',
            marginTop: 0,
            marginBottom: 12,
            paddingVertical: 8,
            paddingHorizontal: 24,
            backgroundColor: theme.colors.border,
            borderRadius: 8,
          }}
          onPress={onClose}
        >
          <Text
            style={{
              color: theme.colors.textOnBackground,
              fontWeight: '600',
              fontSize: 16,
            }}
          >
            Close
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  container: {
    // backgroundColor: theme.colors.hoverBackground,
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
    // borderColor: theme.colors.border,
    // backgroundColor: theme.colors.hoverBackground,
    zIndex: 2,
  },
  headerLabel: {
    // color: theme.colors.textOnBackground,
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
    // color: theme.colors.textOnBackground,
    marginTop: 12,
  },
  errorText: {
    color: 'red',
    marginTop: 12,
    textAlign: 'center',
  },
})

export default AIOptionsModal
