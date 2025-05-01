### Mistake: Redefining shared types (e.g., Card) in frontend code instead of importing from @TheraGPT/logic
**Wrong**:
```
type Card = {
  id: string
  // ...
}
```
**Correct**:
```
import type { Card } from '@theragpt/logic'
```
**Note**: Always import shared types (such as Card, UpdateCardParams, etc.) from the `@theragpt/logic` package in all frontend and mobile code. Never redefine these types locally. This ensures type consistency and prevents drift between service and UI layers.

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

### Mistake: Conditionally rendering <Text> with && or short-circuit logic inside a <Text> parent in React Native
**Wrong**:
```
<Text>
  {!card.isActive && <Text>Archived</Text>}
  {showArchiveBulletSeparator && <Text> • </Text>}
</Text>
```
or
```
{!card.isActive && <Text>Archived</Text>}
```
**Correct**:
Always use a ternary to ensure a <Text> node is rendered in all cases, or move the condition outside the <Text> parent:
```
<Text>{!card.isActive ? 'Archived' : ''}</Text>
<Text>{showArchiveBulletSeparator ? ' • ' : ''}</Text>
```
**Note**: In React Native, children of <Text> must always be valid nodes (string or <Text>), never false/null/undefined. Using && or short-circuit logic can result in invalid children and runtime errors.
### Mistake: Incorrect dependency scope for shared lib/utils.ts
**Wrong**:
```
lib/utils.ts imported 'clsx', but 'clsx' was only listed in apps/web/package.json. This caused build failures when the shared lib was used, as the dependency was not resolvable from outside the web app.
```
**Correct**:
```
Since lib/utils.ts is only used by the web app, 'clsx' should be added to apps/web/package.json. If it were used by multiple packages, it should be hoisted to the workspace root. The fix was to add 'clsx' to apps/web and re-run the build.
```