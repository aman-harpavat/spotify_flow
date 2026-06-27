# Spotify Flow Prototype Architecture

## Scope

This architecture is intentionally narrow and implementation-facing for the Spotify Flow prototype described in `docs/spec.md`, visually aligned to `docs/DESIGN-spotify.md`, and informed by `docs/spotify_reference.png`.

Goals for this architecture:
- ship a believable, deployable prototype
- prioritize polished frontend behavior over backend complexity
- keep all core flows deterministic and testable
- avoid production-grade recommendation or platform architecture

---

## 1. Recommended Stack

### Frontend
- React
- TypeScript
- Vite
- React Router
- Tailwind CSS

### State
- Zustand for app/session state
- local component state for short-lived UI state

### Persistence
- `localStorage` for saved rooms during prototype use

### Testing
- Vitest
- React Testing Library

### Deployment
- Vercel or Netlify static deployment

### Why this stack
- fast to build and iterate
- ideal for mocked deterministic flows
- minimal backend requirement
- easy to deploy as a polished demo
- supports phase-by-phase testing cleanly

---

## 2. App Structure

Use a frontend-only app with a small domain-oriented structure:

```text
src/
  app/
    router.tsx
    providers.tsx
    store/
      flowStore.ts
      selectors.ts
  components/
    shell/
    home/
    launcher/
    room/
    queue/
    player/
    saved-rooms/
    shared/
  data/
    demoRooms.ts
    demoTracks.ts
    steeringRules.ts
    arcMappings.ts
  domain/
    types.ts
    room.ts
    steering.ts
    queue.ts
    persistence.ts
  views/
    HomeView.tsx
    RoomView.tsx
    SavedRoomsView.tsx
  styles/
    globals.css
    theme.css
```

### Structural principle
- `data/` contains hardcoded prototype content and deterministic outcomes
- `domain/` contains pure logic for room creation, steering, queue mutation, and reopen behavior
- `components/` contains Spotify-like UI pieces
- `views/` assemble route-level screens
- entry-surface copy should favor plain-language listener phrasing over internal state terminology

---

## 3. Route / View Structure

Use explicit routes so the prototype feels like a real app and is easier to test.

### Routes
- `/`
  - Home view
  - includes Flow entry card
  - launcher opens as modal/panel over home
- `/room/:roomId`
  - active Flow room
  - includes player shell and queue drawer trigger
- `/rooms`
  - Saved Rooms view

### View states inside routes

#### Home route
- default home shell
- launcher open
- arc suggestion step

#### Room route
- room active
- queue drawer open/closed
- adjust room open/closed
- follow-up steering row visible/hidden

### Routing choice
The launcher and arc suggestion should be modal-like internal states rather than separate pages, to preserve the Spotify-native feel and keep the user anchored in the shell.

---

## 4. Component Hierarchy

```text
App
  AppProviders
  AppRouter
    ShellLayout
      Sidebar
      TopBar
      MainContent
        HomeView
          FlowEntryCard
          LauncherModal
            FlowPromptForm
            StarterPromptRow
            SeparateTasteToggle
            ArcSuggestionStep
        RoomView
          FlowRoomHero
            RoomHeader
            RoomBadgeRow
            PulseIndicator
            HelperText
            PrototypeHint
          CurrentTrackCard
          SteeringSection
            DiagnosticChipRow
            FollowUpOptionRow
            RefinementInput
            AdjustRoomToggle
            ArcControlPanel
          RoomActions
            SaveSongButton
            SaveRoomButton
            DiscardRoomButton
        SavedRoomsView
          SavedRoomsHeader
          SavedRoomGrid
            SavedRoomCard
      RightRailOptionalSurface
      BottomPlayerBar
        NowPlayingSummary
        PlaybackControls
        ProgressBar
        QueueDrawerTrigger
      QueueDrawer
        NowPlayingQueueCard
        NextUpList
      ToastLayer
```

### Design note
The room view is the product center. Steering belongs inside the room, not in a chat rail.

---

## 5. State Model

Use one small global store with clear slices.

### App shell state
- `activeRouteContext`
- `isLauncherOpen`
- `launcherStep: "prompt" | "arc"`
- `isQueueOpen`
- `isAdjustRoomOpen`
- `toast`

### Launcher state
- `promptDraft`
- `selectedStarterPrompt`
- `keepSeparateProfile: boolean`
- `suggestedArc`
- `selectedArc`

### User-facing naming
- keep internal `arc` naming in data and logic if helpful
- use plain-language `room style` phrasing on user-facing surfaces so the choice is understandable without product context
- make the three styles clearly distinct in copy: same mood, newer/fresher picks, and more unfamiliar songs

### Launcher prompt scope
- expose only 3 starter prompts
- each starter prompt maps directly to one fully hardcoded demo flow
- do not include extra starter prompts without a dedicated end-to-end flow
- free text entry is disabled for this prototype build; starter selection is the only room-entry path

### Playback/session state
- `activeRoomId`
- `isPlaying`
- `currentTrackIndex`
- `playbackProgressMs` or seconds-based equivalent for a visibly advancing player bar

### Room collection state
- `activeRooms: Record<string, FlowRoom>`
- `savedRooms: Record<string, SavedRoomDefinition>`

### Ephemeral room UI state
- `selectedDiagnosticChip`
- `visibleFollowUpType`
- `refinementDraft`

### Persistence boundary
- save only `savedRooms` to `localStorage`
- keep active playback session in memory only

---

## 6. Mocked Data Model

Base the prototype data model directly on the spec and add only what is required for UI rendering.

### Core types
- `ArcType`
- `RoomStatus`
- `PulseState`
- `Track`
- `RoomMemory`
- `FlowRoom`
- `SavedRoomCard`

### Prototype additions

```ts
type DemoFlowKey = "rainy_evening" | "fresh_workout" | "melodic_surprise";

type TrackEntity = Track & {
  artistLine: string;
  duration: string;
  coverGradient: string;
};

type QueueSnapshot = {
  key: string;
  trackIds: string[];
  helperText?: string;
  pulse?: PulseState;
};

type SavedRoomDefinition = {
  id: string;
  title: string;
  seedPrompt: string;
  arc: ArcType;
  helperText: string;
  roomMemory: RoomMemory;
  sourceFlow: DemoFlowKey;
  reopenCount: number;
};
```

### Data source design
- one hardcoded config object per demo flow
- one global mocked track catalog for all track metadata
- one steering result map per flow
- one reopen queue map per saved room flow

---

## 7. Room State / Steering State Flow

### Room creation flow
1. User opens Flow launcher.
2. User types prompt or picks starter prompt.
3. App maps prompt to one of the 3 hardcoded demo flows.
4. App shows suggested arc with override chips.
5. User confirms or overrides arc.
6. App creates a temporary room session with:
   - title
   - prompt
   - arc
   - initial pulse
   - initial queue
   - current track
   - empty or seeded room memory
7. App routes directly into playback.

### Steering flow priority
Apply steering in the exact priority defined by the spec:
1. natural-language refinement
2. diagnostic chip or follow-up correction
3. arc adjustment
4. passive signals

### Steering flow behavior
- `Too familiar` and `Too different` mutate immediately
- `Wrong mood` and `Wrong energy` reveal follow-up options
- text refinement submits a deterministic queue transition for the current demo flow
- arc adjustments change room direction at the room level, not just the next song
- unsupported controls for a given demo flow can stay visible for realism, but should be disabled and paired with muted guidance toward the intended hardcoded path

### Steering write targets
Every steering action can update:
- `room.memory`
- `room.pulse`
- `room.helperText`
- `room.trackQueue`
- `currentTrackIndex` when a fresh queue is swapped in

---

## 8. How Queue Mutation Will Work

Queue mutation should be deterministic, visible, and easy to reason about.

### Queue model
- the room stores `trackQueue: string[]`
- the current track is derived from `trackQueue[currentTrackIndex]`
- queue drawer shows:
  - now playing
  - next up = remaining queue items after current index
- when a track finishes, playback advances to the next queued track; if the session reaches the end, it loops back to the start of the current room queue

### Mutation strategy
- each meaningful steering action resolves to a named `QueueSnapshot`
- the app replaces the room queue with that new snapshot
- `currentTrackIndex` resets to `0` for a newly generated queue
- `currentTrackId` updates to the first track in the new snapshot

### Why replace instead of patch
- aligns with the spec language that the queue becomes a new set
- keeps the adaptation obvious in the queue drawer
- reduces logic complexity for the prototype

### Example mutation sources
- rainy evening + `Wrong mood` -> `Softer`
- rainy evening + `Go deeper`
- workout + `Too familiar`
- workout + `More new`
- surprise + `Too different`
- surprise + text refine `more emotional, less noisy`

---

## 9. How Saved Rooms and Reopen Behavior Will Work

### Save room behavior
When the user saves a room:
- convert current room status to `saved`
- persist a compact `SavedRoomDefinition`
- keep:
  - room title
  - seed prompt
  - arc
  - latest room memory
  - saved-room helper text
  - source demo flow id

### Reopen behavior
When reopening a saved room:
- create a brand-new active room session from the saved definition
- do not reuse the exact last active queue
- choose a fresh queue variant tied to that saved flow
- reset pulse to `Staying close`
- preserve saved room identity and memory

### Prototype implementation rule
For the prototype, reopening uses predetermined fresh queue variants, optionally keyed by `reopenCount`.

Example:
- first reopen of Rainy Evening Flow -> use the exact fresh queue defined in the spec
- later reopens can reuse that same reopen queue unless we explicitly add more variants

### Persistence scope
- saved rooms persist in `localStorage`
- active unsaved rooms do not persist across refresh

---

## 10. Phase-by-Phase Implementation Plan

### Phase 1
- build shell layout
- build home view
- build Flow entry card
- build launcher modal
- build demo prompt message, 3 starter prompts, and separate-profile toggle
- block empty submit

Test:
- user can open Flow and start a valid room flow

### Phase 2
- build arc suggestion step
- add hardcoded prompt-to-demo-flow mapping
- create room session factory
- build room view hero and playback shell
- auto-start playback on room entry

Test:
- all 3 demo prompts create valid rooms
- room title, arc, pulse, helper text, and current track render correctly

### Phase 3
- build queue drawer
- build diagnostic chips
- build follow-up option row
- build natural-language refinement input
- wire deterministic queue snapshot transitions
- update pulse on steering

Test:
- steering visibly changes queue drawer contents
- all four chip paths behave per spec

### Phase 4
- build adjust room affordance and arc control panel
- persist room memory changes inside active room state
- implement save song state
- implement save room
- implement discard room confirmation
- implement helper text transitions

Test:
- room direction updates correctly
- save song is distinct from save room
- discard confirms profile-safe exploration

### Phase 5
- build Saved Rooms view
- add saved room cards
- implement reopen flow
- add prototype-only helper hints
- polish visuals, motion, spacing, and state transitions
- add focused tests for reopen semantics

Test:
- saved rooms reopen into fresh sessions in the same vibe
- prototype feels polished and Spotify-native

---

## 11. What Is Hardcoded vs What Should Feel Dynamic

### Hardcoded
- the 3 demo flows
- prompt-to-demo-flow mapping
- suggested arc defaults
- all queue snapshots after supported steering actions
- helper copy variants
- reopen queue variants
- prototype hint copy

### Dynamic-feeling
- launcher flow
- arc selection and override
- playback start and now-playing state
- queue drawer updates
- pulse changes
- helper text evolution
- follow-up steering rows
- save song visual state
- save room and reopen behavior

### Principle
The prototype should be deterministic under the hood but feel responsive and adaptive in the UI.

---

## 12. Deployment Approach

### Build target
- static SPA deployment

### Recommended host
- Vercel

### Delivery approach
- build with Vite
- deploy compiled frontend only
- no backend required for initial prototype

### Persistence behavior in deployment
- saved rooms use browser `localStorage`
- prototype works fully without server data

### Demo-readiness
- include polished loading and transition states for launcher -> arc suggestion -> room entry
- ensure direct route refresh for `/room/:roomId` gracefully redirects to home if room state is missing
- keep all critical demo flows accessible from starter prompts

---

## Architecture Summary

This prototype should be built as a frontend-first React app with deterministic mocked room logic, a Spotify-native shell, and a small store that manages launcher state, active room state, queue state, and saved rooms. The key architectural idea is that every meaningful steering action resolves to a predefined queue snapshot, making the room feel adaptive while staying simple, testable, and phaseable.
