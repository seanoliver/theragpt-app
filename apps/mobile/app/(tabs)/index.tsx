import { Box, VStack } from '@gluestack-ui/themed'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { Title, Text, PrimaryButton } from '@theragpt/ui/src/components/common'

export default function HomeScreen() {
  const handleGetStarted = () => {
    router.push('/thought')
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Box flex={1} backgroundColor="$background.light">
        <VStack
          flex={1}
          padding={20}
          justifyContent="center"
          alignItems="center"
          gap={24}
        >
          <Title textAlign="center">Welcome to TheraGPT</Title>

          <Text textAlign="center" lineHeight="$relaxed">
            A Cognitive Behavioral Therapy (CBT) application designed to help you
            identify cognitive distortions in your thoughts and reframe them in a
            more balanced way.
          </Text>

          <PrimaryButton onPress={handleGetStarted} marginTop={4}>
            Get Started
          </PrimaryButton>
        </VStack>
      </Box>
    </SafeAreaView>
  )
}