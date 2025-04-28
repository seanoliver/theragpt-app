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
