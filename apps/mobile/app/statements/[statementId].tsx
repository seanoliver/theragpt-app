import { GestureHandlerRootView } from 'react-native-gesture-handler'
import StatementView from '../../src/screens/StatementDetail/StatementView'

export default function Page() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatementView />
    </GestureHandlerRootView>
  )
}
