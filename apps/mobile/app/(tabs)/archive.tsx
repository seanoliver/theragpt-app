import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { ArchiveScreen } from '../../src/screens/Archive/Archive'

export default function Page() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ArchiveScreen />
    </GestureHandlerRootView>
  )
}
