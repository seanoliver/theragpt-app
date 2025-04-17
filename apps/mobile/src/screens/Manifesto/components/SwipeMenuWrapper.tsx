import { View, Text } from 'react-native'
import { colors } from '../../../../lib/theme'
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable'

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
          >
            Archive
          </ActionWrapper>
          <ActionWrapper
            backgroundColor="#E57373"
            onPress={onDelete}
            textColor="#fff"
          >
            Delete
          </ActionWrapper>
        </View>
      </View>
    </View>
  )
}

const ActionWrapper = ({
  children,
  textColor,
  backgroundColor,
  onPress,
}: {
  children: React.ReactNode
  textColor: string
  backgroundColor: string
  onPress: () => void
}) => {
  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
      }}
    >
      <View
        style={{
          backgroundColor,
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          width: 80,
        }}
      >
        <Text
          style={{
            color: textColor,
            fontWeight: 'bold',
            fontSize: 16,
          }}
          onPress={onPress}
        >
          {children}
        </Text>
      </View>
    </View>
  )
}
