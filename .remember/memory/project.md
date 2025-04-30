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

### State Management: Review/Vote Actions
- All review and vote actions in the review flow (ReviewScreen, CardPager, CardActions, etc.) must use the Zustand store actions (reviewCard, upvoteCard, downvoteCard) to ensure immediate state sync across all screens.
- Card stats (last reviewed, votes, review count, etc.) should always be derived from the store and update on store changes.

### Review Logging UX
- Log the review for a card as soon as it is first shown (when currentIndex changes), not only when the user advances or swipes. Avoid duplicate logs for the same card.

### Mistake: JS bundle corruption or dependency mismatch after UI Kitten integration
**Wrong**:
App fails to load with "Invariant Violation: Failed to call into JavaScript module method RCTLog.logIfNoNativeHook()" after adding/removing UI Kitten or other native modules, or after partial migration.
**Correct**:
Perform a full clean install and cache reset (remove node_modules, lock files, .expo, reinstall dependencies with pnpm, and clear Expo cache) to resolve bundle/dependency mismatches.
```bash
cd apps/mobile && rm -rf node_modules .expo package-lock.json yarn.lock pnpm-lock.yaml && pnpm install && cd ../.. && npx expo start -c
```