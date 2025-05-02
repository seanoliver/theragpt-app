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

### Mistake: Not using Zustand store for review/vote actions in review flow, causing stale stats in CardsScreen
**Wrong**:
```
// In CardPager.tsx
cardInteractionService.logReview(cards[currentIndex].id)

// In CardActions.tsx
const { handleUpvote, handleDownvote } = useCardInteractionService(cardId)
```

**Correct**:
```
// In CardPager.tsx
const reviewCard = useCardStore(state => state.reviewCard)
reviewCard(cards[currentIndex].id)

// In CardActions.tsx
const upvoteCard = useCardStore(state => state.upvoteCard)
const downvoteCard = useCardStore(state => state.downvoteCard)
// ...
onPress={() => upvoteCard(cardId)}
onPress={() => downvoteCard(cardId)}
```

- Also, update useCardInteractionService to refetch stats when the card changes in the store, and pass the card as a dependency in Card.tsx.

### Mistake: Including 'cards' in the dependency array of reviewCard useEffect in CardPager.tsx, causing infinite loop
**Wrong**:
```
useEffect(() => {
  if (cards[currentIndex] && !loggedCardIds.current.has(cards[currentIndex].id)) {
    reviewCard(cards[currentIndex].id)
    loggedCardIds.current.add(cards[currentIndex].id)
  }
}, [currentIndex, cards, reviewCard])
```

**Correct**:
```
useEffect(() => {
  const card = cards[currentIndex]
  if (card && !loggedCardIds.current.has(card.id)) {
    reviewCard(card.id)
    loggedCardIds.current.add(card.id)
  }
}, [currentIndex, reviewCard])
```

### Mistake: Showing NaN for Last Reviewed in CardScreenStats when there is a review
**Wrong**:
```
value={
  typeof stat.value === 'number'
    ? stat.value
    : stat.value === 'Never' ? 0 : Number.NaN
}
```

**Correct**:
```
value={stat.value} // where stat.value is always a string for Last Reviewed, never coerced to a number
```

### Mistake: Not using a ref-based Gorhom BottomSheet for editing FlatList items
**Wrong**:
```
// Navigating to a detail screen or opening a modal from inside FlatList item directly
<TouchableOpacity onPress={() => router.push(`/cards/${card.id}`)}>
  ...
</TouchableOpacity>
```

**Correct**:
```
// Use a ref-based Gorhom BottomSheet at the screen root
const bottomSheetRef = useRef<CardEditBottomSheetRef>(null)
const handleCardPress = (card: CardType) => bottomSheetRef.current?.open(card)
<CardList cards={filteredCards} onCardPress={handleCardPress} />
<CardEditBottomSheet ref={bottomSheetRef} />

// CardList passes onPress to Card, Card uses onPress prop
```

### Mistake: CardsScreen did not filter out archived cards (isActive: false)
**Wrong**:
```
const filteredCards = useMemo(
  () => filterCardData(cards, searchQuery),
  [cards, searchQuery],
)
```

**Correct**:
```
const filteredCards = useMemo(
  () => filterCardData(cards.filter(card => card.isActive), searchQuery),
  [cards, searchQuery],
)
```

### Mistake: FAB appears above the bottom sheet when it should be hidden
**Wrong**:
```
export const FAB = ({ style, onPress = () => {}, backgroundColor }: FABProps) => {
  const { themeObject: theme } = useTheme()
  const styles = makeStyles(theme)

  return (
    <View style={[styles.fabContainer, style]}>
      <TouchableOpacity
        onPress={onPress}
        style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
      >
        <Ionicons name="add" size={24} color={theme.colors.white} />
      </TouchableOpacity>
    </View>
  )
}
```

**Correct**:
```
import { useFABContext } from './FABContext'

export const FAB = ({ style, onPress = () => {}, backgroundColor }: FABProps) => {
  const { themeObject: theme } = useTheme()
  const styles = makeStyles(theme)
  const { editingCard } = useFABContext()

  if (editingCard) return null

  return (
    <View style={[styles.fabContainer, style]}>
      <TouchableOpacity
        onPress={onPress}
        style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
      >
        <Ionicons name="add" size={24} color={theme.colors.white} />
      </TouchableOpacity>
    </View>
  )
}
```

### Mistake: White edges appearing in BottomSheet components
**Wrong**:
```
<BottomSheet
  ref={bottomSheetRef}
  snapPoints={snapPoints}
  index={-1}
  enablePanDownToClose
  backdropComponent={renderBackdrop}
  onClose={closeFAB}
  handleComponent={BottomSheetHandle}
  style={styles.sheet}
>
  <BottomSheetView style={styles.overlay}>
    {children}
  </BottomSheetView>
</BottomSheet>

// Missing overflow and consistent background styling between components
```

**Correct**:
```
<BottomSheet
  ref={bottomSheetRef}
  snapPoints={snapPoints}
  index={-1}
  enablePanDownToClose
  backdropComponent={renderBackdrop}
  onClose={closeFAB}
  handleComponent={BottomSheetHandle}
  style={styles.sheet}
  backgroundStyle={styles.sheetBackground}
  handleIndicatorStyle={styles.handleIndicator}
>
  <BottomSheetView style={styles.overlay}>
    {children}
  </BottomSheetView>
</BottomSheet>

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: theme.colors.foregroundBackground,
    },
    sheet: {
      backgroundColor: theme.colors.foregroundBackground,
      overflow: 'hidden',
    },
    sheetBackground: {
      backgroundColor: theme.colors.foregroundBackground,
    },
    handleIndicator: {
      backgroundColor: theme.colors.hoverAccent,
    },
  })
```

Also ensure the BottomSheetHandle component has consistent styles with overflow: 'hidden' and proper borderRadius values.

### Mistake: Using invalid theme color keys in DebugConsole styles
**Wrong**:
```
backgroundColor: theme.colors.background,
backgroundColor: theme.colors.primary,
color: theme.colors.buttonText,
```
**Correct**:
```
backgroundColor: theme.colors.primaryBackground,
backgroundColor: theme.colors.accent,
color: theme.colors.textOnAccent,

### Mistake: Using `async` on a Next.js app directory page component without needing it causes type errors for route params
**Wrong**:
```
export default async function EntryDetailPage({
  params,
}: EntryDetailPageProps) {
  // ...no await inside...
}
```
**Correct**:
```
export default function EntryDetailPage({
  params,
}: EntryDetailPageProps) {
  // ...no await inside...
}
```
**Note**: Declaring a page component as `async` when it does not use `await` can cause Next.js to infer that `params` is a Promise, leading to type errors like "Type '{ id: string }' is missing the following properties from type 'Promise<any>': then, catch, finally, [Symbol.toStringTag]". Only use `async` if you actually need to await something in the component body.

### Mistake: Next.js 15.3.x expects dynamic route params to be a Promise in app directory
**Wrong**:
```
type EntryDetailPageProps = {
  params: {
    id: string
  }
}

export default function EntryDetailPage({ params }: EntryDetailPageProps) {
  // ...
  <EntryDetail id={params.id} />
}
```
**Correct**:
```
export default async function EntryDetailPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  // Resolve the Promise to get the actual params
  const resolvedParams = await params;
  // ...
  <EntryDetail id={resolvedParams.id} />
}
```
**Note**: In Next.js 15.3.x, the type system expects `params` in dynamic route components to be a Promise, not a direct object. This is unusual compared to standard Next.js behavior and documentation. When using dynamic routes in the app directory with Next.js 15.3.x, you must:
1. Declare the page component as `async`
2. Type the `params` prop as a Promise
3. Use `await` to resolve the Promise and get the actual params
4. Use the resolved params in the component

### Mistake: Hardcoded fallback response in API route causing same output regardless of input
**Wrong**:
```
// In parseLLMResponse function
try {
  // Attempt to parse as JSON
  // ...
} catch (e) {
  // If parsing fails, return hardcoded mock response
  return {
    distortions: [
      {
        id: uuidv4(),
        name: 'Catastrophizing',
        explanation: 'You\'re imagining the worst possible outcome...',
      },
      // ...more hardcoded distortions
    ],
    reframedThought: 'While this situation is challenging...',
    justification: 'This reframed thought acknowledges the difficulty...',
  }
}
```
**Correct**:
```
// In parseLLMResponse function
try {
  // Attempt to parse as JSON
  // Handle different possible response formats
  // ...
} catch (e) {
  // Log the error and throw it to be handled by the route handler
  console.error('Error parsing LLM response:', e)
  console.error('Raw LLM response:', response)
  throw new Error('Failed to parse LLM response')
}
```
**Note**: Never use hardcoded fallback responses in API routes that process dynamic user input. This can lead to confusing behavior where the same output is returned regardless of input. Instead, properly handle errors and provide meaningful error messages to the client.
