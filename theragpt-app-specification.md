# TheraGPT App Specification

## Overview

This document outlines the specifications for TheraGPT, a Cognitive Behavioral Therapy (CBT) application designed to help users identify cognitive distortions in their thoughts and reframe them in a more balanced way. The application will leverage AI (specifically OpenAI's API) to analyze user-submitted thoughts, identify potential cognitive distortions, and suggest reframed perspectives.

## Project Structure

The project will follow a monorepo architecture with the following components:

```
theragpt-app/
├── apps/
│   ├── web/                 # Next.js web application
│   └── mobile/              # Expo mobile application
├── packages/
│   ├── logic/               # Shared business logic
│   ├── ui/                  # Shared UI components using Gluestack
│   └── config/              # Shared configuration
├── turbo.json               # Turborepo configuration
├── package.json             # Root package.json
└── pnpm-workspace.yaml      # PNPM workspace configuration
```

## Technical Requirements

### Monorepo Management
- **Turborepo**: For efficient build system and task running
- **PNPM Workspaces**: For package management and dependency sharing

### Frontend Frameworks
- **Web**: Next.js with App Router
- **Mobile**: Expo with Expo Router
- **Shared UI**: Gluestack UI components

### Code Quality
- **ESLint**: Modern configuration with:
  - No semicolons
  - 80 character line width
  - Preference for arrow functions
- **Prettier**: Consistent code formatting

### CI/CD
- **GitHub Actions**: For continuous integration and deployment

### Future Considerations
- **Supabase**: For authentication and database
- **Monetization**: Options to be explored

## Functional Requirements

### 1. User Thought Entry

#### Core Functionality
- Users can enter troubling thoughts via a text input
- Input should support multi-line text
- Character limit of 500 characters per thought
- Option to add context to the thought (situation, emotions, intensity)

#### Edge Cases
- Empty submissions should be prevented
- Very long submissions should be truncated or split
- Special characters and emojis should be handled appropriately
- Multiple rapid submissions should be rate-limited

#### Constraints
- Mobile input should be optimized for on-screen keyboards
- Web input should support both desktop and mobile views

### 2. AI Analysis Integration

#### Core Functionality
- Thoughts are sent to OpenAI API for analysis
- API returns:
  - Identified cognitive distortions (with confidence levels)
  - Suggested reframed thoughts (multiple options)
  - Explanation of why the original thought might be distorted

#### Edge Cases
- API failures should be gracefully handled with appropriate user feedback
- Timeout handling for slow responses
- Content moderation for inappropriate submissions
- Handling of non-English inputs (if supported)

#### Constraints
- API keys must be securely stored and not exposed to clients
- Rate limiting to manage API costs
- Response caching strategy to reduce duplicate API calls
- Compliance with OpenAI's usage policies

### 3. Thought Reframing

#### Core Functionality
- Display original thought alongside AI analysis
- Show identified cognitive distortions with explanations
- Present multiple reframed thought options
- Allow users to select which reframe resonates most with them

#### Edge Cases
- Handle cases where AI cannot identify clear distortions
- Allow users to disagree with AI analysis
- Support user-created reframes

#### Constraints
- UI must clearly distinguish original thought from reframes
- Mobile view must be optimized for smaller screens

### 4. Saving and Favoriting

#### Core Functionality
- Users can save compelling reframes to their collection
- Favoriting mechanism for particularly helpful reframes
- Organization of saved reframes by categories or tags

#### Edge Cases
- Duplicate saves should be prevented or merged
- Syncing favorites across devices
- Handling large collections of saved reframes

#### Constraints
- Local storage for offline access
- Cloud sync when online (future consideration with Supabase)

### 5. SRS Flashcard Review

#### Core Functionality
- Spaced Repetition System (SRS) for reviewing saved reframes
- Scheduling algorithm to determine optimal review times
- Flashcard interface showing original thought and prompting for reframe
- Performance tracking to adjust review intervals

#### Edge Cases
- Handling missed review sessions
- Prioritization of critical reframes
- User-adjustable review frequency

#### Constraints
- Notifications for review reminders
- Offline support for reviews
- Battery and resource optimization for mobile

### 6. Cross-Platform Experience

#### Core Functionality
- Consistent user experience across web and mobile
- Shared data and progress between platforms
- Platform-specific optimizations

#### Edge Cases
- Handling different screen sizes and orientations
- Accessibility considerations for various devices
- Feature parity considerations

#### Constraints
- Performance optimization for lower-end mobile devices
- Responsive design for all screen sizes

## Non-Functional Requirements

### Performance
- App should load within 2 seconds on standard connections
- API responses should be processed within 3 seconds
- Animations and transitions should be smooth (60fps)

### Security
- Secure storage of user data
- Encryption of sensitive information
- Compliance with data protection regulations

### Scalability
- Architecture should support growth to 100,000+ users
- Database design should accommodate long-term usage patterns

### Accessibility
- WCAG 2.1 AA compliance
- Screen reader compatibility
- Keyboard navigation support
- Color contrast considerations

### Internationalization
- Support for multiple languages (future consideration)
- Localization of UI elements
- Right-to-left language support (future consideration)

## Pseudocode with TDD Anchors

### 1. Monorepo Setup

```pseudocode
// TDD: Verify correct monorepo structure is initialized
function initializeMonorepo():
  createDirectory("apps/web")
  createDirectory("apps/mobile")
  createDirectory("packages/logic")
  createDirectory("packages/ui")
  createDirectory("packages/config")

  createFile("turbo.json", turboConfig)
  createFile("package.json", rootPackageConfig)
  createFile("pnpm-workspace.yaml", workspaceConfig)

  initializeGit()
  setupGitHubActions()

  return monorepoStructure

// TDD: Verify package dependencies are correctly configured
function setupDependencies():
  installRootDependencies()
  setupNextjsApp("apps/web")
  setupExpoApp("apps/mobile")
  setupSharedPackages()

  return dependencyTree
```

### 2. Logic Package

```pseudocode
// TDD: Verify thought validation rules
function validateThought(thought):
  if isEmpty(thought):
    return { valid: false, error: "Thought cannot be empty" }

  if length(thought) > MAX_THOUGHT_LENGTH:
    return { valid: false, error: "Thought exceeds maximum length" }

  return { valid: true }

// TDD: Verify OpenAI API integration
function analyzeThought(thought):
  if !validateThought(thought).valid:
    throw ValidationError

  try:
    response = sendToOpenAI(thought)

    if !response.success:
      throw APIError

    return {
      originalThought: thought,
      distortions: response.distortions,
      reframes: response.reframes,
      explanation: response.explanation
    }
  catch error:
    logError(error)
    throw error

// TDD: Verify reframe saving functionality
function saveReframe(userId, originalThought, selectedReframe):
  if !userId:
    throw AuthenticationError

  reframeRecord = {
    id: generateUniqueId(),
    userId: userId,
    originalThought: originalThought,
    reframe: selectedReframe,
    createdAt: currentTimestamp(),
    lastReviewed: null,
    nextReviewDate: calculateInitialReviewDate(),
    reviewCount: 0,
    isFavorite: false
  }

  storeReframe(reframeRecord)
  return reframeRecord.id

// TDD: Verify SRS algorithm
function calculateNextReviewDate(reframeRecord, reviewResult):
  if reviewResult.difficulty === "easy":
    interval = reframeRecord.interval * 2.5
  else if reviewResult.difficulty === "medium":
    interval = reframeRecord.interval * 1.5
  else:
    interval = reframeRecord.interval * 1.2

  if interval < MIN_INTERVAL:
    interval = MIN_INTERVAL

  if interval > MAX_INTERVAL:
    interval = MAX_INTERVAL

  return currentDate() + interval
```

### 3. UI Package

```pseudocode
// TDD: Verify ThoughtInput component renders correctly
component ThoughtInput(onSubmit):
  state = {
    thought: "",
    context: "",
    isSubmitting: false,
    error: null
  }

  function handleSubmit():
    state.isSubmitting = true
    state.error = null

    try:
      validationResult = validateThought(state.thought)

      if !validationResult.valid:
        state.error = validationResult.error
        state.isSubmitting = false
        return

      onSubmit({
        thought: state.thought,
        context: state.context
      })

      state.thought = ""
      state.context = ""
    catch error:
      state.error = "Failed to submit thought"
    finally:
      state.isSubmitting = false

  render:
    TextArea(
      value: state.thought,
      onChange: (text) => state.thought = text,
      placeholder: "Enter your troubling thought...",
      maxLength: MAX_THOUGHT_LENGTH
    )

    TextArea(
      value: state.context,
      onChange: (text) => state.context = text,
      placeholder: "Add context (optional)...",
      maxLength: MAX_CONTEXT_LENGTH
    )

    Button(
      text: "Analyze",
      onClick: handleSubmit,
      disabled: state.isSubmitting || isEmpty(state.thought)
    )

    if state.error:
      ErrorMessage(text: state.error)

// TDD: Verify AnalysisResult component displays correctly
component AnalysisResult(analysis, onSaveReframe):
  state = {
    selectedReframeIndex: null
  }

  function handleSaveReframe():
    if state.selectedReframeIndex === null:
      return

    selectedReframe = analysis.reframes[state.selectedReframeIndex]
    onSaveReframe(analysis.originalThought, selectedReframe)

  render:
    Card(
      header: "Original Thought",
      content: analysis.originalThought
    )

    Card(
      header: "Potential Cognitive Distortions",
      content: List(analysis.distortions.map(distortion =>
        ListItem(
          title: distortion.name,
          description: distortion.explanation,
          confidenceLevel: distortion.confidence
        )
      ))
    )

    Card(
      header: "Reframed Perspectives",
      content: List(analysis.reframes.map((reframe, index) =>
        SelectableListItem(
          content: reframe,
          isSelected: index === state.selectedReframeIndex,
          onSelect: () => state.selectedReframeIndex = index
        )
      ))
    )

    Button(
      text: "Save Selected Reframe",
      onClick: handleSaveReframe,
      disabled: state.selectedReframeIndex === null
    )

// TDD: Verify Flashcard component functions correctly
component Flashcard(reframe, onReviewComplete):
  state = {
    isFlipped: false,
    selectedDifficulty: null
  }

  function handleFlip():
    state.isFlipped = !state.isFlipped

  function handleDifficultySelect(difficulty):
    state.selectedDifficulty = difficulty

  function handleComplete():
    if state.selectedDifficulty === null:
      return

    onReviewComplete(reframe.id, {
      difficulty: state.selectedDifficulty,
      reviewedAt: currentTimestamp()
    })

  render:
    Card(
      onClick: handleFlip,
      frontContent: reframe.originalThought,
      backContent: reframe.reframe,
      isFlipped: state.isFlipped
    )

    if state.isFlipped:
      ButtonGroup(
        buttons: [
          Button(text: "Hard", onClick: () => handleDifficultySelect("hard")),
          Button(text: "Medium", onClick: () => handleDifficultySelect("medium")),
          Button(text: "Easy", onClick: () => handleDifficultySelect("easy"))
        ],
        selectedButton: state.selectedDifficulty
      )

      Button(
        text: "Complete Review",
        onClick: handleComplete,
        disabled: state.selectedDifficulty === null
      )
```

### 4. Web App (Next.js)

```pseudocode
// TDD: Verify API route for thought analysis
function analyzeThoughtAPIRoute(request):
  if request.method !== "POST":
    return { status: 405, body: { error: "Method not allowed" } }

  try:
    requestBody = parseRequestBody(request)

    if !requestBody.thought:
      return { status: 400, body: { error: "Thought is required" } }

    // Rate limiting check
    if isRateLimited(request.ip):
      return { status: 429, body: { error: "Too many requests" } }

    // Content moderation check
    if containsInappropriateContent(requestBody.thought):
      return { status: 400, body: { error: "Content violates guidelines" } }

    analysisResult = analyzeThought(requestBody.thought)

    return { status: 200, body: analysisResult }
  catch error:
    logError(error)
    return { status: 500, body: { error: "Failed to analyze thought" } }

// TDD: Verify home page rendering
page HomePage():
  state = {
    thoughts: [],
    currentAnalysis: null,
    isAnalyzing: false,
    error: null
  }

  function handleThoughtSubmit(thoughtData):
    state.isAnalyzing = true
    state.error = null

    try:
      response = fetch("/api/analyze", {
        method: "POST",
        body: JSON.stringify(thoughtData)
      })

      if !response.ok:
        throw new Error("Failed to analyze thought")

      analysisResult = await response.json()
      state.currentAnalysis = analysisResult
      state.thoughts = [analysisResult, ...state.thoughts]
    catch error:
      state.error = error.message
    finally:
      state.isAnalyzing = false

  function handleSaveReframe(originalThought, selectedReframe):
    // Implementation for saving reframe

  render:
    Layout(
      header: AppHeader(),
      content: (
        ThoughtInput(onSubmit: handleThoughtSubmit)

        if state.isAnalyzing:
          LoadingSpinner()

        if state.error:
          ErrorMessage(text: state.error)

        if state.currentAnalysis:
          AnalysisResult(
            analysis: state.currentAnalysis,
            onSaveReframe: handleSaveReframe
          )

        ThoughtHistory(thoughts: state.thoughts)
      ),
      footer: AppFooter()
    )

// TDD: Verify review page functionality
page ReviewPage():
  state = {
    dueReframes: [],
    currentReframeIndex: 0,
    isLoading: true,
    error: null
  }

  function loadDueReframes():
    state.isLoading = true
    state.error = null

    try:
      response = fetch("/api/reframes/due")

      if !response.ok:
        throw new Error("Failed to load due reframes")

      reframes = await response.json()
      state.dueReframes = reframes
    catch error:
      state.error = error.message
    finally:
      state.isLoading = false

  function handleReviewComplete(reframeId, reviewData):
    // Implementation for completing review

    if state.currentReframeIndex < state.dueReframes.length - 1:
      state.currentReframeIndex++
    else:
      // Review session complete

  onMount:
    loadDueReframes()

  render:
    Layout(
      header: AppHeader(),
      content: (
        if state.isLoading:
          LoadingSpinner()

        if state.error:
          ErrorMessage(text: state.error)

        if state.dueReframes.length === 0 && !state.isLoading:
          EmptyState(
            title: "No Reviews Due",
            description: "Check back later for new reviews"
          )

        if state.dueReframes.length > 0:
          ReviewProgress(
            current: state.currentReframeIndex + 1,
            total: state.dueReframes.length
          )

          Flashcard(
            reframe: state.dueReframes[state.currentReframeIndex],
            onReviewComplete: handleReviewComplete
          )
      ),
      footer: AppFooter()
    )
```

### 5. Mobile App (Expo)

```pseudocode
// TDD: Verify mobile navigation setup
function setupMobileNavigation():
  return createRouter({
    home: () => HomePage,
    analysis: () => AnalysisPage,
    saved: () => SavedReframesPage,
    review: () => ReviewPage,
    settings: () => SettingsPage
  })

// TDD: Verify mobile home screen
screen HomePage():
  state = {
    isLoading: false
  }

  function handleThoughtSubmit(thoughtData):
    state.isLoading = true

    try:
      // Navigate to analysis page with thought data
      router.navigate("analysis", { thoughtData })
    finally:
      state.isLoading = false

  render:
    SafeArea(
      content: (
        AppHeader()

        WelcomeCard()

        ThoughtInput(onSubmit: handleThoughtSubmit)

        if state.isLoading:
          LoadingIndicator()

        QuickStatsCard()

        Button(
          text: "Review Due Cards",
          onClick: () => router.navigate("review")
        )
      )
    )

// TDD: Verify mobile analysis screen
screen AnalysisPage(params):
  state = {
    analysis: null,
    isAnalyzing: true,
    error: null
  }

  function analyzeThought():
    state.isAnalyzing = true
    state.error = null

    try:
      analysisResult = await Logic.analyzeThought(params.thoughtData.thought)
      state.analysis = analysisResult
    catch error:
      state.error = error.message
    finally:
      state.isAnalyzing = false

  function handleSaveReframe(originalThought, selectedReframe):
    try:
      reframeId = await Logic.saveReframe(
        getCurrentUserId(),
        originalThought,
        selectedReframe
      )

      showToast("Reframe saved successfully")

      // Optionally navigate to saved reframes
      router.navigate("saved")
    catch error:
      showToast("Failed to save reframe")

  onMount:
    analyzeThought()

  render:
    SafeArea(
      content: (
        AppHeader(
          title: "Thought Analysis",
          showBackButton: true
        )

        if state.isAnalyzing:
          LoadingIndicator()

        if state.error:
          ErrorCard(
            message: state.error,
            retryAction: analyzeThought
          )

        if state.analysis:
          AnalysisResult(
            analysis: state.analysis,
            onSaveReframe: handleSaveReframe
          )
      )
    )

// TDD: Verify mobile review screen
screen ReviewPage():
  // Similar to web ReviewPage but with mobile-specific UI components
```

### 6. Data Synchronization

```pseudocode
// TDD: Verify data sync mechanism
function syncUserData(userId):
  if !isOnline():
    return { success: false, error: "Offline" }

  try:
    localData = getLocalUserData(userId)
    lastSyncTimestamp = getLastSyncTimestamp(userId)

    // Get remote changes since last sync
    remoteChanges = fetchRemoteChanges(userId, lastSyncTimestamp)

    // Get local changes since last sync
    localChanges = getLocalChangesSinceSync(userId, lastSyncTimestamp)

    // Resolve conflicts
    mergedData = resolveConflicts(localChanges, remoteChanges)

    // Update remote
    updateRemoteData(userId, localChanges)

    // Update local with merged data
    updateLocalData(userId, mergedData)

    // Update sync timestamp
    updateLastSyncTimestamp(userId, currentTimestamp())

    return { success: true }
  catch error:
    logError(error)
    return { success: false, error: error.message }

// TDD: Verify conflict resolution
function resolveConflicts(localChanges, remoteChanges):
  resolvedChanges = []

  for each change in localChanges:
    conflictingRemoteChange = findConflictingChange(remoteChanges, change)

    if conflictingRemoteChange:
      // Resolve based on timestamp (last write wins)
      if change.timestamp > conflictingRemoteChange.timestamp:
        resolvedChanges.push(change)
      else:
        resolvedChanges.push(conflictingRemoteChange)
    else:
      resolvedChanges.push(change)

  // Add non-conflicting remote changes
  for each remoteChange in remoteChanges:
    if !hasConflictingLocalChange(localChanges, remoteChange):
      resolvedChanges.push(remoteChange)

  return resolvedChanges
```

### 7. OpenAI Integration

```pseudocode
// TDD: Verify OpenAI prompt construction
function constructOpenAIPrompt(thought, context = null):
  prompt = "Analyze the following thought for cognitive distortions:\n\n"
  prompt += thought

  if context:
    prompt += "\n\nContext: " + context

  prompt += "\n\nIdentify any cognitive distortions present in this thought, "
  prompt += "explain why they are distortions, and provide 3 healthier "
  prompt += "alternative perspectives or reframes."

  return prompt

// TDD: Verify OpenAI API call
function sendToOpenAI(thought, context = null):
  apiKey = getSecureAPIKey()

  if !apiKey:
    throw new Error("API key not configured")

  prompt = constructOpenAIPrompt(thought, context)

  try:
    response = fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + apiKey
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a CBT therapist specialized in identifying cognitive distortions and providing healthier alternative perspectives."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7
      })
    })

    if !response.ok:
      throw new Error("OpenAI API request failed")

    responseData = await response.json()

    // Parse the response to extract distortions and reframes
    parsedResponse = parseOpenAIResponse(responseData)

    return {
      success: true,
      distortions: parsedResponse.distortions,
      reframes: parsedResponse.reframes,
      explanation: parsedResponse.explanation
    }
  catch error:
    logError(error)
    return { success: false, error: error.message }

// TDD: Verify response parsing
function parseOpenAIResponse(responseData):
  content = responseData.choices[0].message.content

  // Parse the content to extract distortions and reframes
  // This would involve NLP or structured response parsing

  return {
    distortions: extractedDistortions,
    reframes: extractedReframes,
    explanation: extractedExplanation
  }
```

### 8. SRS Algorithm

```pseudocode
// TDD: Verify initial interval calculation
function calculateInitialInterval():
  return 24 * 60 * 60 * 1000 // 1 day in milliseconds

// TDD: Verify due reframes retrieval
function getDueReframes(userId):
  currentTime = currentTimestamp()

  reframes = queryReframes({
    userId: userId,
    nextReviewDate: { $lte: currentTime }
  })

  return sortByPriority(reframes)

// TDD: Verify review result processing
function processReviewResult(reframeId, reviewResult):
  reframe = getReframeById(reframeId)

  if !reframe:
    throw new Error("Reframe not found")

  // Update review count
  reframe.reviewCount += 1

  // Calculate new interval based on difficulty
  newInterval = calculateNewInterval(reframe, reviewResult.difficulty)

  // Calculate next review date
  reframe.nextReviewDate = currentTimestamp() + newInterval

  // Update last reviewed timestamp
  reframe.lastReviewed = currentTimestamp()

  // Save updated reframe
  updateReframe(reframe)

  return reframe

// TDD: Verify interval calculation
function calculateNewInterval(reframe, difficulty):
  baseInterval = reframe.interval || calculateInitialInterval()

  if difficulty === "easy":
    return baseInterval * 2.5
  else if difficulty === "medium":
    return baseInterval * 1.5
  else: // hard
    return baseInterval * 1.2
```

## Implementation Plan

### Phase 1: Project Setup
1. Initialize monorepo structure with Turborepo and PNPM
2. Set up ESLint and Prettier configuration
3. Configure GitHub Actions for CI/CD
4. Create basic Next.js and Expo applications

### Phase 2: Core Functionality
1. Implement shared logic package
2. Develop OpenAI integration
3. Create basic UI components with Gluestack
4. Implement thought entry and analysis flow

### Phase 3: User Experience
1. Develop thought reframing UI
2. Implement saving and favoriting functionality
3. Create SRS flashcard review system
4. Enhance cross-platform experience

### Phase 4: Polish and Optimization
1. Implement offline support
2. Add data synchronization
3. Optimize performance
4. Enhance accessibility

### Phase 5: Future Enhancements
1. Integrate Supabase for auth and database
2. Explore monetization options
3. Add internationalization support
4. Implement advanced analytics

## Conclusion

This specification outlines a comprehensive plan for developing TheraGPT, a cognitive behavioral therapy application using a monorepo structure with Next.js and Expo. The application will leverage OpenAI's API to analyze user thoughts, identify cognitive distortions, and suggest healthier reframes. The SRS flashcard system will help users internalize these reframes through spaced repetition.

The modular pseudocode provides clear guidance for implementation, with TDD anchors to ensure proper testing throughout the development process. The implementation plan provides a phased approach to building the application, starting with the core infrastructure and gradually adding features and polish.