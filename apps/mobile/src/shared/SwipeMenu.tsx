import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';

export interface SwipeAction {
  label: string
  icon: React.ReactNode
  backgroundColor: string
  textColor: string
  onPress: () => void
}

export const SwipeMenu = ({
  actions,
  children,
}: {
  actions: SwipeAction[]
  children: React.ReactNode
}) => {
  const renderRightActions = () => (
    <View style={{ flexDirection: 'row', height: '100%' }}>
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', height: '100%' }}>
          {actions.map((action, idx) => (
            <ActionWrapper key={idx} {...action} />
          ))}
        </View>
      </View>
    </View>
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

const ActionWrapper = ({
  icon,
  textColor,
  backgroundColor,
  onPress,
}: Omit<SwipeAction, 'label'>) => {
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
          width: 44,
          height: 44,
          borderRadius: 22,
          justifyContent: 'center',
          alignItems: 'center',
          marginHorizontal: 6,
        }}
      >
        {icon}
      </TouchableOpacity>
    </View>
  )
}
