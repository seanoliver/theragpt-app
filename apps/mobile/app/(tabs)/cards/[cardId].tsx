import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from 'expo-router'
import { useEffect } from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { CardScreen } from '../../../src/screens/Card/CardScreen'

export default function Page() {
  const navigation = useNavigation()

  useEffect(() => {
    navigation.setOptions({
      title: 'Statement',
      headerShown: true,
      tabBarVisible: false,
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      ),
    })
  }, [navigation])
  return <CardScreen />
}
