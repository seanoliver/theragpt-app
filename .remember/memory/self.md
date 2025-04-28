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
