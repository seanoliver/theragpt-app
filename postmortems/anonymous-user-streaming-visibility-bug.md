# Anonymous User Streaming Visibility Bug - Postmortem

**Date:** December 16, 2024  
**Severity:** Medium (Feature Broken)  
**Status:** Resolved  

## **Problem Summary**
Anonymous users could create and submit thoughts for analysis, but during the streaming process they would only see a loading spinner instead of the actual streaming content. The streaming functionality worked correctly for authenticated users but was completely hidden for anonymous users, making the feature appear broken.

**Impact:** Anonymous users couldn't see their thought analysis in real-time, missing the key interactive experience and potentially thinking the system was stuck or broken.

## **Context**
As part of implementing a feature to show generation process to anonymous users (with signup encouragement), we discovered that streaming was already supposed to work for anonymous users but wasn't visually displaying correctly.

## **Initial Investigation**

### **Expected Behavior**
- Anonymous users submit thought → redirected to `/entry/{id}` → see streaming analysis in real-time
- Same as authenticated users, but with additional signup encouragement notification

### **Actual Behavior**  
- Anonymous users submit thought → redirected to `/entry/{id}` → see only loading spinner
- Streaming process completes in background but UI never shows progress
- Final result eventually appears, but no streaming visualization

### **Authentication vs Anonymous User Differences**
**Authenticated Users (Working):**
- Entries persist to Supabase during streaming
- `reframeText` field gets populated incrementally
- Component stays visible throughout streaming

**Anonymous Users (Broken):**
- Entries only saved to localStorage
- `reframeText` remains empty during streaming  
- Component disappears due to visibility logic

## **Root Cause Analysis**

### **Component Visibility Logic Issue**
**File:** `apps/web/components/journal/EntryItem/EntryItem.tsx`

**Problematic Code (Line 39):**
```typescript
if (!isStreaming && !entry?.reframeText) return null
```

**The Problem:**
1. Anonymous users' entries start with empty `reframeText` (not persisted to Supabase during streaming)
2. If `isStreaming` becomes `false` before `reframeText` is populated, component disappears
3. For authenticated users, Supabase persistence means `reframeText` gets populated incrementally
4. Component visibility logic was too restrictive for anonymous users

### **Data Persistence Timing Differences**

**Authenticated Users:**
```typescript
// entry.service.ts - Real-time Supabase updates during streaming
if (this.isOnline && user) {
  await this.updateEntryInSupabase(updatedEntry)  
}
```

**Anonymous Users:**  
```typescript
// Only localStorage persistence - no real-time updates during streaming
// reframeText stays empty until completion
```

## **The Fix**

### **Before (Restrictive Logic):**
```typescript
if (!isStreaming && !entry?.reframeText) return null
```

### **After (Content-Aware Logic):**
```typescript
// Show component if: streaming, has reframed content, or has raw text to display
const hasContent = entry?.rawText || entry?.reframeText
if (!isStreaming && !hasContent) return null
```

**Why This Works:**
1. **Always shows when streaming** (`isStreaming = true`)
2. **Shows completed analysis** (`reframeText` exists)  
3. **Shows entries with original thought** (`rawText` exists)
4. Since all entries are created with `rawText`, anonymous users see the component from creation

**Files Changed:**
- `apps/web/components/journal/EntryItem/EntryItem.tsx` - Modified visibility logic

## **Key Lessons Learned**

### **1. Component Visibility Logic Should Be Inclusive**
- Don't hide components just because one piece of data is missing
- Consider all user types (authenticated vs anonymous) when designing visibility logic
- If component can show meaningful content, it should be visible

### **2. Data Persistence Timing Affects UI Behavior**
- Different persistence strategies (Supabase vs localStorage) can cause different UI behaviors
- UI logic should accommodate both real-time and batch persistence patterns
- Don't assume data availability timing is the same across user types

### **3. Test All User Journey Variants**
- Anonymous users have different data flow than authenticated users
- Features that work for one user type might break for another
- Always test the complete user journey for each authentication state

### **4. Simple Fixes for Complex-Seeming Problems**
- Issue appeared to be a complex streaming/authentication problem
- Root cause was a simple component visibility condition
- Sometimes the simplest explanation is the correct one

## **Component Logic Breakdown**

The `EntryItem` component displays:
1. **Reframe text** (main analysis result)
2. **Original raw text** (user's original thought - always available)
3. **Streaming indicators** (when `isStreaming = true`)

Since `rawText` is always available from entry creation, there's no reason to hide the component for anonymous users.

## **Prevention Strategies**

1. **Multi-user-type testing** - Test features for both authenticated and anonymous users
2. **Component visibility audits** - Review all conditional rendering logic for edge cases
3. **Data availability documentation** - Document when different data fields are available
4. **Streaming state testing** - Verify streaming indicators work for all user types

## **Time to Resolution**
- **Detection**: During feature development (~10 minutes)
- **Root cause identification**: ~15 minutes (analyzing component logic)
- **Fix implementation**: ~5 minutes (1-line change + refinement)
- **Testing & verification**: ~10 minutes
- **Total**: ~40 minutes

---

**Note:** This bug demonstrates how different data persistence strategies between user types can cause unexpected UI behavior. The key was recognizing that component visibility logic needs to accommodate all data availability patterns, not just the "ideal" case.