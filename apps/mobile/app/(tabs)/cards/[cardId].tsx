import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from 'expo-router'
import { useEffect } from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { CardScreen } from '../../../src/screens/Card/CardScreen'
import { useTheme } from '@/apps/mobile/lib/theme/context'

export default function Page() {
  const navigation = useNavigation()
  const { themeObject: theme } = useTheme()

  useEffect(() => {
    navigation.setOptions({
      title: 'Card',
      headerShown: true,
      tabBarVisible: false,
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ marginLeft: 16 }}
        >
          <Ionicons name="chevron-back" size={24} color={theme.colors.textOnBackground} />
        </TouchableOpacity>
      ),
    })
  }, [navigation])
  return <CardScreen />
}
