### Mistake: Memoizing getCardById caused stale card detail navigation
**Wrong**:
```
const getCardById = useMemo(() => {
  return (id: string) => {
    if (!allCards) return undefined
    return cardService.getCardById(id)
  }
}, [allCards])
```

**Correct**:
```
const getCardById = (id: string) => {
  if (!allCards) return undefined
  return cardService.getCardById(id)
}
```

### Mistake: CardScreen did not remount on cardId change, causing stale card detail
**Wrong**:
```
return <CardScreen />
```

**Correct**:
```
return <CardScreen key={cardId} />
```

### Mistake: Using Zustand persist middleware without specifying AsyncStorage in React Native
**Wrong**:
```
export const useCardStore = create<CardStore>()(
  persist(
    (set, get) => ({ /* ... */ }),
    {
      name: 'card-storage',
      partialize: (state) => ({ cards: state.cards }),
    }
  )
);
```

**Correct**:
```
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useCardStore = create<CardStore>()(
  persist(
    (set, get) => ({ /* ... */ }),
    {
      name: 'card-storage',
      partialize: (state) => ({ cards: state.cards }),
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
```

### Mistake: Using useCardService instead of useCardStore (Zustand) for card state management in mobile screens
**Wrong**:
```
import { useCardService } from '../../hooks/useCardService'
const { service, cards, getCardById } = useCardService()
// ...
const card = cardId ? getCardById(cardId) : null
```

**Correct**:
```
import { useCardStore } from '../../store/useCardStore'
const cards = useCardStore(state => state.cards)
const isLoading = useCardStore(state => state.isLoading)
const card = cardId ? cards.find(card => card.id === cardId) : null
```

- Also, updateCard and deleteCard should be called as actions from useCardStore, not from a service object.
