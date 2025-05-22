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

### Animation Patterns: Sliding animations for expandable content
- Use combination of `max-h-0`/`max-h-[size]`, `opacity-0`/`opacity-100`, and `overflow-hidden` with `transition-all` for slide animations
- Example implementation in ThoughtEntryForm.tsx where ThoughtStarters panel slides down from underneath the textarea
- Apply `transition-all duration-300 ease-in-out` for smooth animations

### AI Model Selection Implementation (TheraGPT Web)
- **Component**: `ModelSelector.tsx` provides dropdown for Claude 4 Sonnet, Claude 3.7 Sonnet, GPT 4o, and GPT 4.1
- **Integration**: Added to `ThoughtEntryForm.tsx` above the textarea with proper state management
- **API Updates**: Both `/api/analyze` and `/api/analyze-stream` routes accept `model` parameter
- **State Flow**: `useAnalyzeThought` hook manages `selectedModel` state and passes it to `streamPromptOutput`
- **Default Model**: Claude 4 Sonnet (`LLMModel.CLAUDE_4_SONNET`) for superior reasoning capabilities
- **Styling**: Consistent with TheraGPT's glass-panel design with purple accent hover states

### Project Overview: TheraGPT
- **Purpose**: AI-powered CBT journal for mental health - analyzes troubling thoughts, identifies cognitive distortions, provides reframing strategies
- **Architecture**: Turborepo monorepo with apps/web (Next.js - primary platform), apps/mobile (Expo/RN - in development), shared packages for logic/llm/prompts/config
- **Tech Stack**: Next.js + Tailwind (web), React Native/Expo (mobile), Zustand state management, OpenAI API, PNPM package manager
- **Key Features**: AI thought analysis, cognitive distortion identification, CBT techniques, offline support, privacy-focused (local storage default)
- **Current State**: Web app production-ready at theragpt.ai, mobile app in active development with Cards/Review/Archive/Onboarding screens
- **State Management**: Uses Zustand (useCardStore) for mobile card state, shared types via @theragpt/logic package