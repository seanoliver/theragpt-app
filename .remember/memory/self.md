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
