import { View, TouchableOpacity } from 'react-native'
import { colors } from '../../../../lib/theme'
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable'
import { FontAwesome, Ionicons } from '@expo/vector-icons'

export const SwipeMenu = ({
  onArchive,
  onDelete,
  children,
}: {
  onArchive: () => void
  onDelete: () => void
  children: React.ReactNode
}) => {
  const renderRightActions = () => (
    <ArchiveDeleteActions onArchive={onArchive} onDelete={onDelete} />
  )

  return (
    <Swipeable
      renderRightActions={renderRightActions}
      rightThreshold={100}
      overshootRight={true}
    >
      {children}
    </Swipeable>
  )
}

const ArchiveDeleteActions = ({
  onArchive,
  onDelete,
}: {
  onArchive: () => void
  onDelete: () => void
}) => {
  return (
    <View style={{ flexDirection: 'row', height: '100%' }}>
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', height: '100%' }}>
          <ActionWrapper
            backgroundColor={colors.charcoal[300]}
            onPress={onArchive}
            textColor={colors.text.primary}
            iconType="archive"
          />
          <ActionWrapper
            backgroundColor="#E57373"
            onPress={onDelete}
            textColor="#fff"
            iconType="delete"
          />
        </View>
      </View>
    </View>
  )
}

const ActionWrapper = ({
  textColor,
  backgroundColor,
  onPress,
  iconType,
}: {
  textColor: string
  backgroundColor: string
  onPress: () => void
  iconType: 'archive' | 'delete'
}) => {
  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
      }}
    >
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onPress}
        style={{
          backgroundColor,
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          width: 80,
        }}
      >
        {iconType === 'archive' ? (
          <FontAwesome name="archive" size={20} color={textColor} />
        ) : (
          <Ionicons name="trash" size={20} color={textColor} />
        )}
      </TouchableOpacity>
    </View>
  )
}
