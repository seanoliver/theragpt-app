# Streaming Data Overwrite Bug - Postmortem

**Date:** June 15, 2025  
**Severity:** High (Data Loss)  
**Status:** Resolved  

## **Problem Summary**
During streaming thought analysis, data would appear correctly in the UI but get overwritten with null/empty values in the database. Complete analysis data would show in Zustand state, but after page refresh, only `rawText` field would remain - all other fields (title, category, distortions, etc.) were null.

**Impact:** Every streaming analysis completion resulted in data loss, requiring users to re-run analyses.

## **Initial Hypothesis (Incorrect)**
We initially thought this was a **throttling race condition**:
- Assumed multiple throttled updates were executing after stream completion
- Tried complex solutions like completion flags, setTimeout delays, flushing throttled updates
- **This was a red herring** - the real issue was much simpler

## **Debugging Process**

### **Step 1: Add Comprehensive Logging**
```typescript
// Added logs to trace the data flow
console.log('🔴 finalEntry', finalEntry) // In handleComplete
console.log('🔵 [DB UPDATE]', updateData) // In database layer  
console.log('🟢 [ZUSTAND]', params) // In store layer
```

### **Step 2: Identify Data Persistence vs UI Issue**
- **Key Discovery**: Data persisted correctly in Zustand (client state) but was wrong in database
- **This narrowed the problem** to the database persistence layer, not UI state management

### **Step 3: Trace Database Update Calls**
- Added stack traces to see where `updateEntry` calls were coming from
- Found multiple calls to database update after completion
- **All calls had the same stack trace** - coming from throttled updates, not multiple sources

### **Step 4: Remove Throttling Complexity**
- Simplified approach: removed throttling, updated UI on every chunk
- **Result**: Made performance worse, still had data overwrite issue
- **Lesson**: The throttling wasn't the root cause

### **Step 5: Separate UI Updates from Database Persistence**
- Modified streaming to only update UI state during streaming
- Only persist to database on final completion
- **Result**: Eliminated race conditions but still had overwrite issue

### **Step 6: Deep Database Debugging**
- Added detailed Supabase logging to see actual database requests/responses
- **Key Discovery**: Getting 406 "Not Acceptable" error when trying to fetch existing entry
- **Root Cause Found**: Entry didn't exist in database at all!

### **Step 7: Trace ID Consistency**
- Logged entry IDs throughout the entire flow
- **Critical Discovery**: 
  - **Creation ID**: `c7ffd78e-e307-498c-b763-a90054e47cd8`
  - **Update ID**: `7c864b48-b5ee-42fd-a864-e31a06c4f5db`
  - **IDs were different!**

## **Root Cause**
```typescript
// In useAnalyzeThought.tsx
const entryId = uuidv4() // Generated ID: abc-123
const partialEntryData = { id: entryId, ... }
await addEntry(partialEntryData) // Passes abc-123

// In entry.service.ts create() method  
const entry: Entry = {
  ...params,           // params.id = abc-123
  id: uuidv4(),       // ❌ OVERWRITES with new ID: xyz-789  
  createdAt: Date.now(),
}
```

**The entry service was silently overwriting the provided ID**, causing:
1. Entry created in database with ID `xyz-789`
2. UI/streaming logic trying to update entry with ID `abc-123`  
3. Database update failing because `abc-123` doesn't exist
4. UI showing complete data (from local state) but database having incomplete data

## **The Fix**
```typescript
// ✅ FIXED: Respect provided ID, only generate if none provided
const entry: Entry = {
  ...params,
  id: params.id || uuidv4(), // Use provided ID or generate new one
  createdAt: params.createdAt || Date.now(),
}
```

**Files Changed:**
- `packages/logic/src/entry/entry.service.ts` - Modified `create()` method to respect provided IDs

## **Key Lessons Learned**

### **1. ID Consistency is Critical**
- Always use the same ID throughout the entire data flow
- Be careful about ID generation - don't overwrite provided IDs
- Log IDs at key points to catch mismatches early

### **2. Separate UI State from Persistence**
- UI updates can happen immediately for responsiveness  
- Database persistence can be batched/throttled for performance
- Don't assume UI state matches database state

### **3. Debug from the Database Up**
- When data looks correct in logs but wrong in database, check what's actually in the database
- Use database debugging tools to see actual queries/responses
- 204 responses from Supabase are normal for successful updates

### **4. Systematic Debugging Approach**
1. **Add comprehensive logging** at every layer
2. **Isolate the problem** (UI vs database vs networking)
3. **Trace data flow** end-to-end with unique identifiers
4. **Verify assumptions** with direct database queries
5. **Simplify complex logic** to eliminate variables

### **5. Watch for Silent Overwrites**
- Code that spreads objects and overwrites properties can cause subtle bugs
- Always check if values are being silently replaced in object construction
- Be especially careful with ID fields and timestamps

## **Prevention Strategies**
1. **Add TypeScript strict mode** to catch potential ID type mismatches
2. **Unit tests for ID consistency** in create/update flows
3. **Database constraints** to prevent orphaned updates
4. **Logging standards** for tracing entity IDs through the system

## **Time to Resolution**
- **Detection**: Immediate (user-reported)
- **Investigation**: ~2 hours (complex debugging session)
- **Fix**: 1 line of code change
- **Total**: ~2 hours

---

**Note:** This bug was a perfect example of how a simple ID overwrite issue can manifest as a complex race condition problem. The key was systematic debugging and not getting trapped by the apparent complexity of the symptoms.