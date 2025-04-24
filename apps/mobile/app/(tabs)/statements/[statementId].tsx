import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { useEffect } from 'react';
import {
  GestureHandlerRootView,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import StatementView from '../../../src/screens/StatementDetail/StatementView';

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
  return <StatementView />
}
