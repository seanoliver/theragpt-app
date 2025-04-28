### Mistake: Redefining shared types (e.g., Card) in frontend code instead of importing from @still/logic
**Wrong**:
```
type Card = {
  id: string
  // ...
}
```
**Correct**:
```
import type { Card } from '@still/logic'
```
**Note**: Always import shared types (such as Card, UpdateCardParams, etc.) from the `@still/logic` package in all frontend and mobile code. Never redefine these types locally. This ensures type consistency and prevents drift between service and UI layers.

### Layout: Full-width backgrounds, centered content
- For all pages/sections, backgrounds (including header/footer) should span the full width of the viewport.
- Actual content should be centered and constrained using a container (e.g., max-w-screen-xl mx-auto).
- Do not apply max-width or centering to the outermost wrapper; only to inner content containers.
- Use Tailwind classes as in the landing page for consistency.

### State Management: Use Zustand (useCardStore) for cards in mobile
- All card state and actions in mobile apps should use useCardStore (Zustand) from store/useCardStore.ts.
- Do not use custom hooks like useCardService for card state or actions.

### Review Logging UX
- Log the review for a card as soon as it is first shown (when currentIndex changes), not only when the user advances or swipes. Avoid duplicate logs for the same card.
