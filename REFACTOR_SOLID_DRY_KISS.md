# SOLID / DRY / KISS Refactor Summary

## Overview

Refactoring applied across the EmPulse codebase to improve **SOLID** (Single Responsibility, Open/Closed, etc.), **DRY** (Don’t Repeat Yourself), and **KISS** (Keep It Simple).

---

## 1. DRY – Shared Utilities & Styles

### `lib/utils.ts`
- **`formatTime(seconds)`** – Format seconds as `M:SS`. Moved from `page.tsx`; single source for time formatting.

### `lib/api.ts` (new)
- **`fetchApi<T>(url)`** – Generic fetch with error handling.
- **`fetchTracks<T>()`** – Fetches `/api/tracks`, returns `[]` on error. Replaces duplicated fetch logic in `page.tsx`.
- **`fetchSections<T>()`** – Fetches `/api/sections`, returns `[]` on error.

### `lib/styles.ts` (new)
- **`CARD_CLASSES`** – `bg-white/5 backdrop-blur-sm border-purple-500/30`
- **`CARD_HOVER_CLASSES`** – Card + hover transition
- **`AUTH_CARD_CLASSES`** – Auth layout card
- **`AUTH_BUTTON_OUTLINE_CLASSES`** – OAuth / secondary auth buttons
- **`AUTH_INPUT_CLASSES`** – Auth form inputs
- **`FORM_INPUT_CLASSES`** – Settings/profile inputs
- **`TABS_LIST_CLASSES`** – TabsList styling

Use these constants instead of repeating long Tailwind strings.

---

## 2. KISS – Types & Structure

### `types/speech.ts` (new)
- **Speech Recognition types** moved out of `page.tsx`:
  - `SpeechRecognition`, `SpeechRecognitionEvent`, `SpeechRecognitionResultList`, etc.
  - `WindowWithSpeechRecognition`

Keeps `page.tsx` simpler and makes speech types reusable.

---

## 3. SRP – Hooks & Components

### `hooks/use-voice-control.ts` (new)
- **Single responsibility:** Speech recognition for play/pause/next/previous.
- **API:** `useVoiceControl({ isPlaying, togglePlay, onNext, onPrevious })` → `{ isVoiceActive, toggleVoiceControl }`.
- Replaces the large voice `useEffect` and `toggleVoiceControl` in `page.tsx`.

### `components/auth/auth-card.tsx` (new)
- **`AuthCard`** – Reusable auth layout: title, optional description, consistent card styling.
- Used in login, signup, forgot-password, reset-password, verify-email (as you migrate them).

### `components/auth/password-requirements.tsx` (new)
- **`PasswordRequirements`** – Renders the checklist (length, upper, lower, number, special).
- **`getPasswordRequirements(password)`** – Returns `PasswordRequirementsState`.
- **`allRequirementsMet(state)`** – Boolean check.
- Replaces duplicated password UI and logic in signup and reset-password.

---

## 4. Page & Auth Refactors

### `app/page.tsx`
- Uses **`formatTime`** from `@/lib/utils`.
- Uses **`fetchTracks`**, **`fetchSections`** from `@/lib/api` with `Track` / `Section` generics.
- Uses **`useVoiceControl`**; voice logic removed from the page.
- **Speech types** removed; `WindowWithSpeechRecognition` imported from `@/types/speech` only where needed.
- **Duplicate `onerror`** in Howl config removed (single handler).
- **`handleCardClick`** simplified (removed `console.log`; TODO kept for missing routes).

### `app/auth/signup/page.tsx`
- Uses **`AuthCard`**, **`PasswordRequirements`**, **`getPasswordRequirements`**, **`allRequirementsMet`**.
- Uses **`AUTH_BUTTON_OUTLINE_CLASSES`**, **`AUTH_INPUT_CLASSES`** from `@/lib/styles`.
- Password requirements UI and logic centralized.

### `app/auth/reset-password/page.tsx`
- Same use of **`AuthCard`**, **`PasswordRequirements`**, **`getPasswordRequirements`**, **`allRequirementsMet`**, and **`AUTH_INPUT_CLASSES`**.

---

## 5. Files Touched

| File | Change |
|------|--------|
| `lib/utils.ts` | Added `formatTime` |
| `lib/api.ts` | **New** – fetch helpers |
| `lib/styles.ts` | **New** – shared UI classes |
| `types/speech.ts` | **New** – speech API types |
| `hooks/use-voice-control.ts` | **New** – voice control hook |
| `components/auth/auth-card.tsx` | **New** – auth layout card |
| `components/auth/password-requirements.tsx` | **New** – password UI + helpers |
| `app/page.tsx` | Use libs, hook, types; fix duplicate `onerror`; simplify `handleCardClick` |
| `app/auth/signup/page.tsx` | Use `AuthCard`, `PasswordRequirements`, shared styles |
| `app/auth/reset-password/page.tsx` | Use `AuthCard`, `PasswordRequirements`, shared styles |

---

## 6. Possible Next Steps

1. **`use-audio-player` hook** – Extract Howl + WaveSurfer + position logic from `page.tsx` (SRP).
2. **`AuthCard` + styles** – Migrate login, forgot-password, verify-email to `AuthCard` and `lib/styles`.
3. **`CARD_*` / `FORM_*`** – Gradually replace duplicated Tailwind in dashboard, profile, settings, etc., with `lib/styles` constants.
4. **`ContentSection`** – Use `CARD_CLASSES` / `CARD_HOVER_CLASSES` where relevant.

---

## 7. Principles Applied

- **DRY:** `formatTime`, fetch helpers, password requirements, and shared UI classes centralized.
- **SRP:** Voice logic in `useVoiceControl`; auth layout in `AuthCard`; password rules in `PasswordRequirements`.
- **KISS:** Less inline logic in `page.tsx`; clearer types in `types/speech`; simpler auth pages via shared components and styles.
