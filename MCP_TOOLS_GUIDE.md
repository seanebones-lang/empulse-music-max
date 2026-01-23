# MCP Browser Extension Tools - Complete Usage Guide

This guide provides comprehensive examples and best practices for using all available MCP browser extension tools to their maximum advantage.

## Table of Contents
1. [Navigation Tools](#navigation-tools)
2. [Page Inspection Tools](#page-inspection-tools)
3. [Interaction Tools](#interaction-tools)
4. [Form Handling Tools](#form-handling-tools)
5. [Debugging & Monitoring Tools](#debugging--monitoring-tools)
6. [Tab Management](#tab-management)
7. [Workflow Patterns](#workflow-patterns)

---

## Navigation Tools

### `browser_navigate`
Navigate to any URL. Always use this as the first step when testing a new page.

**Best Practices:**
- Always navigate before taking snapshots or interacting
- Use full URLs including protocol (https://)
- Wait for page load after navigation

**Example Commands:**
```
Navigate to your local dev server: http://localhost:3000
Navigate to production: https://your-app.vercel.app
Navigate to specific route: https://your-app.com/artist/dashboard
```

### `browser_navigate_back`
Go back to the previous page in browser history.

**Use Cases:**
- Testing browser back button functionality
- Returning to previous page after navigation
- Multi-step workflow testing

**Example Workflow:**
```
1. Navigate to /home
2. Navigate to /profile
3. Navigate back → returns to /home
```

### `browser_resize`
Resize the browser window for responsive testing.

**Common Sizes:**
- Mobile: 375x667 (iPhone), 390x844 (iPhone Pro)
- Tablet: 768x1024 (iPad)
- Desktop: 1920x1080, 1440x900
- Large Desktop: 2560x1440

**Example Commands:**
```
Test mobile view: Resize to 375x667
Test tablet view: Resize to 768x1024
Test desktop view: Resize to 1920x1080
```

---

## Page Inspection Tools

### `browser_snapshot`
**MOST IMPORTANT TOOL** - Get accessibility snapshot of the page. Use this before ANY interaction.

**Key Points:**
- Returns element references (refs) needed for all interaction commands
- Shows page structure, text content, and interactive elements
- Always snapshot before clicking, typing, or hovering
- Use after navigation or page changes

**Workflow Pattern:**
```
1. Navigate to URL
2. Take snapshot
3. Analyze elements
4. Interact using refs from snapshot
```

**Example:**
```
After navigating, take snapshot to see all available buttons, inputs, and links
```

### `browser_take_screenshot`
Capture visual screenshot of the page or specific elements.

**Use Cases:**
- Visual regression testing
- Documenting UI state
- Debugging layout issues
- Creating documentation

**Options:**
- Full page: `fullPage: true`
- Specific element: Provide `ref` from snapshot
- Formats: PNG (default) or JPEG

**Example Commands:**
```
Screenshot entire page: Take full page screenshot
Screenshot button: Screenshot element with ref "button-123"
Save as JPEG: Take screenshot with format jpeg
```

---

## Interaction Tools

### `browser_click`
Click on any element. Requires `ref` from snapshot.

**Parameters:**
- `ref`: Element reference from snapshot (REQUIRED)
- `element`: Human-readable description (for permission)
- `button`: "left" (default), "right", "middle"
- `doubleClick`: true for double-click
- `modifiers`: ["Control", "Shift", "Alt", "Meta"] for keyboard modifiers

**Example Workflows:**
```
1. Take snapshot
2. Find "Sign In" button ref
3. Click button with ref "button-signin-456"

Right-click menu: Click with button "right"
Ctrl+Click: Click with modifiers ["Control"]
Double-click: Click with doubleClick: true
```

### `browser_hover`
Hover over an element to trigger hover states or tooltips.

**Use Cases:**
- Testing hover effects
- Revealing tooltips
- Triggering dropdown menus
- CSS hover state verification

**Example:**
```
1. Take snapshot
2. Find menu item ref
3. Hover over element to reveal submenu
```

### `browser_type`
Type text into input fields, textareas, or contenteditable elements.

**Parameters:**
- `ref`: Element reference from snapshot
- `text`: Text to type
- `slowly`: true to type character-by-character (triggers key handlers)
- `submit`: true to press Enter after typing

**Best Practices:**
- Always snapshot first to get input refs
- Use `slowly: true` if page has key handlers or validation
- Use `submit: true` for form submissions

**Example Commands:**
```
Type in search box: Type "music" into element with ref "input-search-789"
Slow typing for validation: Type slowly with text "user@example.com"
Submit form: Type with submit: true
```

### `browser_select_option`
Select options in dropdown/select elements.

**Parameters:**
- `ref`: Select element reference
- `values`: Array of option values to select (single or multiple)

**Example Commands:**
```
Select single option: Select "option-value-1" in dropdown
Select multiple: Select ["option1", "option2"] in multi-select
```

### `browser_drag`
Drag and drop between elements.

**Use Cases:**
- Testing drag-and-drop functionality
- Reordering lists
- File uploads via drag
- Moving elements

**Example:**
```
1. Take snapshot
2. Find source element ref (e.g., draggable item)
3. Find target element ref (e.g., drop zone)
4. Drag from source to target
```

### `browser_press_key`
Press keyboard keys for shortcuts or navigation.

**Common Keys:**
- Navigation: "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"
- Modifiers: "Control", "Shift", "Alt", "Meta"
- Special: "Enter", "Escape", "Tab", "Backspace", "Delete"
- Characters: "a", "b", "1", "2", etc.

**Example Commands:**
```
Press Enter: Press key "Enter"
Navigate: Press key "ArrowRight"
Keyboard shortcut: Press key "Control" then "k"
Escape dialog: Press key "Escape"
```

---

## Form Handling Tools

### `browser_fill_form`
Fill multiple form fields at once. More efficient than typing individually.

**Field Types:**
- `textbox`: Text inputs
- `checkbox`: Checkboxes (value: "true" or "false")
- `radio`: Radio buttons
- `combobox`: Dropdowns (value: option text)
- `slider`: Slider controls

**Example:**
```
Fill login form:
- Email field (textbox): "user@example.com"
- Password field (textbox): "password123"
- Remember me (checkbox): "true"

Fill registration:
- Name (textbox): "John Doe"
- Country (combobox): "United States"
- Newsletter (checkbox): "true"
```

**Best Practice:**
1. Take snapshot
2. Identify all form field refs
3. Fill entire form in one command
4. Submit or click submit button

---

## Debugging & Monitoring Tools

### `browser_console_messages`
Get all console messages (logs, errors, warnings).

**Use Cases:**
- Debugging JavaScript errors
- Checking console.log outputs
- Monitoring warnings
- Verifying API calls logged to console

**Workflow:**
```
1. Perform actions on page
2. Get console messages
3. Analyze errors/warnings
4. Fix issues based on console output
```

**Example:**
```
After clicking button, check console messages for errors
```

### `browser_network_requests`
Get all network requests since page load.

**Use Cases:**
- API call verification
- Performance monitoring
- Debugging failed requests
- Checking request/response data

**Information Provided:**
- Request URLs
- HTTP methods
- Status codes
- Request/response headers
- Timing information

**Example Workflow:**
```
1. Navigate to page
2. Interact (click, submit form)
3. Get network requests
4. Verify API calls were made correctly
5. Check response status codes
```

### `browser_wait_for`
Wait for text to appear/disappear or wait for a time duration.

**Use Cases:**
- Waiting for async content to load
- Waiting for animations to complete
- Waiting for API responses
- Synchronizing with page state changes

**Parameters:**
- `text`: Text to wait for (appears on page)
- `textGone`: Text to wait for to disappear
- `time`: Seconds to wait

**Example Commands:**
```
Wait for loading to finish: Wait for text "Loading..." to disappear
Wait for content: Wait for text "Welcome" to appear
Fixed delay: Wait for 2 seconds
```

**Best Practice:**
Use after actions that trigger async operations:
```
1. Click submit button
2. Wait for "Success" text to appear
3. Verify result
```

---

## Tab Management

### `browser_tabs`
Manage browser tabs: list, create, close, or select.

**Actions:**
- `list`: Show all open tabs
- `new`: Open new tab
- `close`: Close tab (current or by index)
- `select`: Switch to tab by index

**Use Cases:**
- Multi-tab testing
- Testing new window functionality
- Managing multiple pages simultaneously

**Example Workflows:**
```
List all tabs: List tabs
Open new tab: Create new tab, then navigate to URL
Switch tabs: Select tab at index 1
Close tab: Close current tab or close tab at index 2
```

---

## Dialog Handling

### `browser_handle_dialog`
Handle browser dialogs (alert, confirm, prompt).

**Parameters:**
- `accept`: true to accept/OK, false to cancel/dismiss
- `promptText`: Text to enter for prompt dialogs

**Use Cases:**
- Testing alert dialogs
- Handling confirm dialogs
- Filling prompt dialogs
- Testing error dialogs

**Example:**
```
Accept alert: Handle dialog with accept: true
Dismiss confirm: Handle dialog with accept: false
Fill prompt: Handle dialog with accept: true, promptText: "User input"
```

---

## JavaScript Evaluation

### `browser_evaluate`
Execute JavaScript code on the page or specific element.

**Use Cases:**
- Custom interactions not covered by other tools
- Reading page state/data
- Triggering custom events
- Manipulating DOM directly
- Getting computed styles or values

**Examples:**
```
Get page title: Evaluate "document.title"
Get element value: Evaluate on element "(el) => el.value"
Trigger custom event: Evaluate "window.dispatchEvent(new CustomEvent('custom'))"
Check if element visible: Evaluate "(el) => el.offsetParent !== null"
Get localStorage: Evaluate "localStorage.getItem('key')"
Set localStorage: Evaluate "localStorage.setItem('key', 'value')"
Scroll to element: Evaluate "(el) => el.scrollIntoView()"
```

**Best Practice:**
Use for advanced scenarios when standard tools aren't sufficient.

---

## Complete Workflow Patterns

### Pattern 1: Testing a Login Flow
```
1. Navigate to /login
2. Take snapshot
3. Fill form:
   - Email field: "user@example.com"
   - Password field: "password123"
4. Click submit button (from snapshot ref)
5. Wait for "Dashboard" text to appear
6. Take snapshot to verify success
7. Check console messages for errors
8. Check network requests for API calls
```

### Pattern 2: Testing Responsive Design
```
1. Navigate to page
2. Resize to 375x667 (mobile)
3. Take screenshot
4. Take snapshot to verify mobile layout
5. Resize to 1920x1080 (desktop)
6. Take screenshot
7. Compare layouts
```

### Pattern 3: Testing Form Submission
```
1. Navigate to /signup
2. Take snapshot
3. Fill form with all fields
4. Click submit
5. Wait for success message
6. Get network requests to verify API call
7. Check console for errors
8. Take screenshot of result
```

### Pattern 4: Testing Interactive Components
```
1. Navigate to page
2. Take snapshot
3. Hover over menu item (triggers dropdown)
4. Take snapshot to see dropdown
5. Click dropdown option
6. Wait for content to load
7. Verify result with snapshot
```

### Pattern 5: Debugging an Issue
```
1. Navigate to problematic page
2. Take snapshot
3. Reproduce issue (click, type, etc.)
4. Get console messages (check for errors)
5. Get network requests (check for failed calls)
6. Take screenshot of current state
7. Evaluate JavaScript to check page state
8. Analyze all data to identify problem
```

### Pattern 6: E2E User Journey
```
1. Navigate to homepage
2. Take snapshot
3. Click "Sign Up" button
4. Fill registration form
5. Submit form
6. Wait for redirect
7. Navigate to profile
8. Take snapshot
9. Edit profile fields
10. Save changes
11. Verify with snapshot and network requests
```

---

## Pro Tips for Maximum Advantage

### 1. Always Snapshot First
- **Never interact without a snapshot** - you need refs for all interactions
- Snapshot after navigation, after waiting, after interactions that change the page

### 2. Combine Tools Strategically
- Use `wait_for` after async operations
- Use `console_messages` and `network_requests` together for debugging
- Use `screenshot` + `snapshot` for complete page analysis

### 3. Error Handling Workflow
```
1. Take snapshot (see current state)
2. Get console messages (find errors)
3. Get network requests (check API failures)
4. Take screenshot (visual state)
5. Evaluate JavaScript (check data/state)
```

### 4. Performance Testing
```
1. Navigate to page
2. Get network requests (baseline)
3. Interact with page
4. Get network requests again (compare)
5. Check timing in network data
```

### 5. Accessibility Testing
- Use snapshots to verify all interactive elements have proper labels
- Check that all functionality is accessible via keyboard (use `press_key`)
- Verify focus states and navigation

### 6. Multi-Step Testing
- Use tab management for testing flows across multiple pages
- Navigate back/forward to test browser history
- Combine navigation with interactions for complete user flows

---

## Common Command Combinations

### Quick Page Check
```
Navigate → Snapshot → Screenshot → Console Messages
```

### Full Interaction Test
```
Navigate → Snapshot → Fill Form → Click Submit → Wait → Snapshot → Network Requests
```

### Debug Session
```
Navigate → Snapshot → Interact → Console Messages → Network Requests → Screenshot → Evaluate
```

### Responsive Test
```
Navigate → Resize Mobile → Screenshot → Snapshot → Resize Desktop → Screenshot → Snapshot
```

---

## Testing Your Music App

Based on your project structure, here are specific use cases:

### Test Audio Player
```
1. Navigate to homepage
2. Take snapshot
3. Click play button (ref from snapshot)
4. Wait for audio to load
5. Check console for Howl/WaveSurfer errors
6. Check network requests for audio file loading
7. Take snapshot to verify player state
```

### Test Artist Dashboard
```
1. Navigate to /artist/dashboard
2. Take snapshot
3. Fill upload form
4. Submit
5. Wait for success
6. Check network requests for upload API
```

### Test Search
```
1. Navigate to /search
2. Take snapshot
3. Type search query slowly
4. Wait for results
5. Take snapshot to see results
6. Click on result
7. Verify navigation
```

### Test Playlist
```
1. Navigate to /playlist/[id]
2. Take snapshot
3. Click play on track
4. Check console for player initialization
5. Verify waveform appears
6. Take screenshot
```

---

## Summary: Essential Commands for Every Session

1. **`browser_navigate`** - Start here
2. **`browser_snapshot`** - Get element refs (use frequently)
3. **`browser_click`** - Most common interaction
4. **`browser_type`** - Fill inputs
5. **`browser_wait_for`** - Handle async operations
6. **`browser_console_messages`** - Debug errors
7. **`browser_network_requests`** - Verify API calls
8. **`browser_take_screenshot`** - Visual documentation

Master these 8 commands and you'll be able to test and debug effectively!
