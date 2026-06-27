# spec.md — Spotify Flow MVP Prototype

## 0. Purpose of this Spec

This is the implementation-facing build spec for Codex.

Use this spec to:
1. build a **functional deployed prototype** of Spotify Flow
2. keep implementation tightly scoped to the fellowship MVP
3. implement in **testable phases**
4. enable a follow-up `architecture.md` to be generated cleanly from this spec

This document is intentionally stricter than the PRD. It defines:
- exact product scope
- exact UI structure
- exact hardcoded demo flows
- exact steering behavior
- exact mocked data expectations
- exact save/reopen semantics
- phase-by-phase deliverables
- acceptance criteria

Do **not** use the master playbook as implementation input. It is too broad and contains research history, superseded thinking, and non-build material.

### Implementation inputs only
Codex should use only:
- this `spec.md`
- `DESIGN-spotify.md` (for color, typography, spacing, surface, interaction langua)
- a placeholder Spotify UI screenshot reference `spotify_reference.png` (for layout structure, topbar rhythm, shell composition, bottom player placement)
- later, a generated `architecture.md`

---

## 1. Product Overview

### Product Name
**Spotify Flow**

### Tagline
**Find your next sound**

### One-line Summary
Spotify Flow is a temporary AI-powered discovery room that helps users explore music for a specific moment or intent, refine it live while listening, and do so without affecting their main Spotify profile by default.

### Core Product Thesis
Flow is **not**:
- AI DJ with a wrapper
- AI Playlist with prompt input
- Song Radio / Smart Shuffle continuation
- a generic chatbot for music

Flow **is**:
- a temporary exploration room
- with room-level local memory
- that adapts during playback
- using structured exploration arcs
- while keeping exploration separate from the main recommendation profile unless explicitly saved

---

## 2. Product Goal

### Primary Goal
Increase meaningful music discovery for active music explorers.

### Secondary Goal
Reduce fallback dependence on repeat playlists, familiar artists, and previously discovered tracks.

### Product Success Logic
Flow should create a better path from:

intent  
→ exploration  
→ refinement  
→ meaningful discovery  
→ save / replay / follow

instead of the user defaulting to:
- repeat playlists
- familiar artists
- known songs
- external discovery sources

This prototype should visibly support that logic.

---

## 3. Target User

### Primary Segment
**Active Music Explorers**

Users who:
- listen frequently
- care about discovering new music
- already use Spotify discovery surfaces sometimes
- feel friction when recommendations are repetitive, too generic, or wrong for the current moment

### Out of Scope
- passive playback-only users
- podcast-first or audiobook-first users
- users seeking a social-first music experience
- users who do not care about discovery

---

## 4. Prototype vs Production

### Prototype
The prototype may use:
- hardcoded room examples
- mocked tracks
- mocked playback states
- mocked AI responses
- predefined refinement outcomes
- simplified room memory behavior

### Production Vision
A production version would require:
- real prompt interpretation
- real-time room generation
- real recommendation updates
- deeper room memory logic
- catalog-aware ranking
- integration with Spotify playback and recommendation systems

### Critical Rule
Even though mocked, the prototype must still feel functional and believable.

### Acceptable
- mocked room generation
- mocked queues
- deterministic state changes
- hardcoded examples that still behave like a real product

### Not Acceptable
- static screens with no meaningful state change
- decorative AI copy with no interaction effect
- a click-through that cannot demonstrate room creation, refinement, queue mutation, pulse updates, and save/reopen logic

---

## 5. Inputs / Reference Files

### Required Inputs
1. `spec.md`
2. `DESIGN-spotify.md`

### Optional Visual Placeholder
Reserve support for an additional reference image path such as:

`/references/spotify-ui-reference.png`

If present, use it only for structural inspiration.

### Important
Do **not** feed Codex the master playbook.

---

## 6. Differentiation That Must Be Visible in the Prototype

The prototype must visibly communicate the following differences from current Spotify offerings.

### Current Spotify-like Offerings
- prompt-driven playlist generation
- AI DJ request-based playback
- Song Radio / Smart Shuffle continuation
- some taste-profile correction after the fact

### Flow Must Visibly Introduce
1. **temporary discovery rooms by default**
2. **room-level local memory**
3. **live refinement during playback**
4. **structured exploration arcs**
5. **saveable room identity**
6. **fresh session on room reopen**
7. **profile-safe exploration by default**

This differentiation must be visible in:
- labels
- helper copy
- queue behavior
- save/reopen behavior
- room pulse
- room state transitions

---

## 7. UX and Design Requirements

Use `DESIGN-spotify.md` as the design system reference.

### Visual Requirements
- near-black Spotify-like immersive background
- Spotify Green only for meaningful action / active states
- rounded pills and cards
- dark elevated surfaces
- content-first hierarchy
- minimal clutter
- music-first feel
- no enterprise copilot styling
- no generic chatbot styling

### Product Feel
Flow should feel:
- native to Spotify
- premium
- music-led
- lightweight
- not overloaded with controls

### Copy Principle
- user-facing entry surfaces should use plain language
- avoid internal or abstract labels on first-view surfaces when a clearer phrase works better
- examples of preferred phrasing:
  - `Tune it as you listen` over `live refinement during playback`
  - `Just for this moment` over technical-sounding isolation labels
  - `Starts with your vibe` on preview surfaces instead of exposing internal pulse states too early

### Design Intent
The room should feel like a **playable discovery object**, not like a chat session.

---

## 8. App Structure

Build the prototype as a Spotify-inspired desktop web experience.

### Main Areas
1. Left navigation / library shell
2. Main content area
3. Bottom playback bar
4. Expandable queue panel / drawer
5. Flow launcher modal or elevated panel
6. Active Flow room view
7. Saved Rooms view

### Required Views
- Home
- Flow launcher
- Active Flow room
- Saved Rooms

Routes or local state views are both acceptable, but the UX should feel like distinct product states.

---

## 9. Recommended UI Layout

### Main Content Area
This should show the **Flow room card** and the room-level controls:
- room title
- helper text
- status badge
- arc badge
- room pulse
- save/discard actions
- diagnostic chips
- natural-language refinement input
- `Adjust room` affordance

### Bottom Player
This should work like a real music app player:
- current track
- play/pause
- progress state
- next / previous icons
- queue access trigger

### Queue Panel / Drawer
This is important. The user should be able to open a queue view similar to a real music platform.

The queue view should show:
- now playing
- next up tracks
- queue changes after steering

This is how the prototype demonstrates that the room is actually adapting, not just visually claiming to do so.

### Steering Placement
Do **not** create a generic AI chat side panel.

Steering should be embedded in the room view:
- diagnostic chips under the room header
- natural-language `Refine this room…` field below them
- `Adjust room` as a small secondary affordance

This keeps the experience:
**music-first, AI-assisted**
not
**chat-first**

---

## 10. Core Data Model

```ts
type ArcType = "deep_dive" | "refresh" | "surprise_me";
type RoomStatus = "temporary" | "saved";

type PulseState =
  | "staying_close"
  | "getting_fresher"
  | "going_deeper"
  | "pulling_back";

type Track = {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration?: string;
  coverColor?: string;
  tags: string[];
};

type RoomMemory = {
  skippedTrackIds: string[];
  savedTrackIds: string[];
  acceptedDirections: string[];
  rejectedDirections: string[];
  explorationTolerance: "low" | "medium" | "high";
  moodCorrections: string[];
  energyCorrections: string[];
};

type FlowRoom = {
  id: string;
  title: string;
  prompt: string;
  starterPrompt?: string;
  arc: ArcType;
  status: RoomStatus;
  pulse: PulseState;
  helperText: string;
  roomDescription?: string;
  currentTrackId: string;
  trackQueue: string[];
  memory: RoomMemory;
};

type SavedRoomCard = {
  id: string;
  title: string;
  helperText: string;
  arc: ArcType;
  seedPrompt: string;
};
```

---

## 11. Core Product Objects

### Flow Room
A temporary or saved discovery environment with:
- title
- prompt / starting intent
- current arc
- room pulse state
- room memory
- temporary / saved status
- current playable session

### Room Memory
Stores local in-room signals such as:
- skipped tracks
- saved tracks
- accepted directions
- rejected directions
- current exploration tolerance
- mood corrections
- energy corrections

### Room Arc
The room’s exploration behavior pattern:
- Deep Dive
- Refresh
- Surprise Me

### Room Pulse
A compact signal showing how the room is evolving:
- Staying close
- Getting fresher
- Going deeper
- Pulling back

### Room Session
The currently playable flow of tracks for that room at that moment.

---

## 12. Hardcoded Demo Flows

The prototype must contain **3 fully hardcoded end-to-end demo flows**.

Across these 3 flows, all major features must be demonstrated.

### Guidance Notes in Prototype
Each demo room should include a tiny helper note for testing, for example:
- `Try Wrong mood in this room`
- `This room demonstrates refresh + save room`
- `This room demonstrates pull-back + discard`

These notes can be subtle and prototype-only.

---

### Demo Flow A — Rainy Evening Flow

#### Purpose
Demonstrates:
- Deep Dive
- Wrong mood
- arc adjustment
- save room
- reopen saved room as fresh session

#### Start Prompt
`Soft Hindi songs for a rainy evening`

#### Suggested Arc
`Deep Dive`

#### Room Title
`Rainy Evening Flow`

#### Helper Text
`Exploring soft Hindi for a rainy evening`

#### Prototype Test Hint
`Try Wrong mood and Save room`

#### Initial Pulse
`Staying close`

#### Initial Queue
1. Shaam — Aisha Khan
2. Baarish Mein — Rohan Mehta
3. Dheemi Raat — Kavya
4. Mitti Ki Khushboo — Arjun Sen
5. Khidki — Noor
6. Aasman Neecha — Ira

#### Current Track on Entry
`Shaam — Aisha Khan`

#### If user taps `Wrong mood`
Show:
- Happier
- Sadder
- Softer
- Darker

#### If user then taps `Softer`
Apply:
- pulse changes to `Going deeper`
- room memory adds `softer`
- queue changes to a **new set**, not mere reorder:

1. Khidki — Noor
2. Resham Hawa — Mira
3. Naram Si Raat — Vedika
4. Chupke Baarish — Aarav
5. Dheere Se — Anika
6. Saans Halki — Zoya

#### If user opens `Adjust room`
Show Deep Dive controls:
- Go deeper
- Keep it broader

#### If user taps `Go deeper`
Apply:
- pulse remains `Going deeper`
- helper text updates to: `Going deeper into soft Hindi for rainy evenings`
- queue changes again:

1. Resham Hawa — Mira
2. Chupke Baarish — Aarav
3. Dheere Se — Anika
4. Mitti Aur Dhuaan — Arohi
5. Sannata — Advait
6. Noorani Raat — Tara

#### Save Song behavior
If user saves a song:
- the song gets a visible saved state
- saved songs can be surfaced in room memory but do not need a separate playlist feature

#### Save Room behavior
If user clicks `Save room`:
- room status changes to saved
- show confirmation:
  `Rainy Evening Flow saved`
- subcopy:
  `You can reopen this room later for a fresh session in the same vibe`

#### Saved Room Card Details
Card title: `Rainy Evening Flow`  
Card helper: `Reopen for a fresh session in the same vibe`  
Card arc badge: `Deep Dive`

#### Reopen Saved Room behavior
When reopened:
- title remains `Rainy Evening Flow`
- status is saved room
- pulse starts at `Staying close`
- queue is **fresh**, not identical:

1. Bheegi Dhoop — Ishan
2. Naram Si Raat — Vedika
3. Dheere Se — Anika
4. Noorani Raat — Tara
5. Saans Halki — Zoya
6. Resham Hawa — Mira

This must clearly demonstrate:
**saved room != repeat playlist**

---

### Demo Flow B — Fresh Workout Flow

#### Purpose
Demonstrates:
- Refresh arc
- Too familiar direct correction
- Adjust room
- save song vs save room distinction

#### Start Prompt
`Fresh workout music without my usual tracks`

#### Suggested Arc
`Refresh`

#### Room Title
`Fresh Workout Flow`

#### Helper Text
`Refreshing your workout rotation`

#### Prototype Test Hint
`Try Too familiar and Adjust room`

#### Initial Pulse
`Staying close`

#### Initial Queue
1. Charge Up — Nova Run
2. Fireline — KMX
3. Pulse Beat — Rey
4. High Gear — Axton
5. Core Mode — Vira
6. Sprint Echo — T99

#### Current Track on Entry
`Charge Up — Nova Run`

#### If user taps `Too familiar`
Apply immediately:
- pulse changes to `Getting fresher`
- room memory adds `too_familiar`
- queue changes to a genuinely fresher set:

1. Lift Off — Zedha
2. Iron Pulse — Kairo
3. Fuel State — Nox
4. Night Sprint — Ariv
5. Runline — Jett
6. Surgeframe — Riko

#### If user opens `Adjust room`
Show Refresh controls:
- More new
- Keep it familiar

#### If user taps `More new`
Apply:
- helper text updates to:
  `Pushing fresher picks while keeping workout energy`
- pulse remains `Getting fresher`
- queue changes again:

1. Motion Code — Lyra
2. Breakpoint — Eshan
3. Surgeframe — Riko
4. Kinetic Heat — Vaan
5. Aero Rush — Mivik
6. Crossfade Run — Tyra

#### Save Song behavior
If user saves current song:
- only that song gets a saved state
- room remains temporary unless separately saved

This must visibly demonstrate:
**Save song != Save room**

#### Optional Save Room behavior
If user also saves room:
- card appears in Saved Rooms
- title: `Fresh Workout Flow`
- helper: `Reopen for a fresh session in the same vibe`
- reopening should generate a new queue, not reuse the last one exactly

---

### Demo Flow C — Melodic Surprise Flow

#### Purpose
Demonstrates:
- Surprise Me arc
- Too different direct correction
- natural-language refinement
- discard room
- profile-safe exploration messaging

#### Start Prompt
`Surprise me, but keep it Indian and melodic`

#### Suggested Arc
`Surprise Me`

#### Room Title
`Melodic Surprise Flow`

#### Helper Text
`Exploring something new without losing your vibe`

#### Prototype Test Hint
`Try Too different, then refine with text`

#### Initial Pulse
`Staying close`

#### Initial Queue
1. Raahi Unknown — Dev Rai
2. Sitar Bloom — Anvi
3. Monsoon Shapes — Yuvan
4. Parallel Sky — Niva
5. Dune Lights — Reva
6. Echo Bazaar — Kian

#### Current Track on Entry
`Raahi Unknown — Dev Rai`

#### If user taps `Too different`
Apply immediately:
- pulse changes to `Pulling back`
- room memory adds `too_different`
- queue changes to a more grounded set:

1. Sitar Bloom — Anvi
2. Raagline — Iva
3. Safar Dheema — Samar
4. Dil Se Door — Kavir
5. Noor Path — Meher
6. Aabshaar — Niyati

#### If user opens `Adjust room`
Show Surprise Me controls:
- More adventurous
- Stay in my vibe

#### If user taps `Stay in my vibe`
Apply:
- pulse remains `Pulling back`
- helper text updates to:
  `Keeping the room exploratory, but closer to your vibe`

#### Natural-Language Refinement demo
User types:
`more emotional, less noisy`

Apply:
- room memory adds `more_emotional`
- room memory adds `less_noisy`
- queue changes again:

1. Safar Dheema — Samar
2. Noor Path — Meher
3. Dil Se Door — Kavir
4. Aabshaar — Niyati
5. Sheher Ka Chand — Tara V
6. Chalte Reh — Avik

#### Discard Room behavior
If user clicks `Discard room`:
- show confirmation:
  `Room discarded`
- subcopy:
  `Your main taste profile was not affected`

This explicitly demonstrates profile-safe exploration.

---

## 13. Required Screens

### Screen 1 — Home
Required UI:
- Flow card placed in the top discovery grid / primary home content area
- title: `Flow`
- subtitle: `Start a room for what you want right now`
- CTA: `Open Flow`

Interaction:
- clicking opens Flow launcher

---

### Screen 2 — Flow Launcher
Required UI:
- header: `Flow`
- subheader: `Start a room for this moment`
- demo input message that makes it clear this prototype uses predefined prompts only
- starter prompts:
  - Rainy evening Hindi
  - Fresh workout music
  - Surprise me
- toggle:
  `Keep this room separate from my main taste profile`
- toggle default: ON
- CTA: `Start room`

Behavior:
- free text entry is disabled in this prototype
- user must select one of the predefined demo prompts
- empty submit blocked
- expose only starter prompts that map to the 3 fully hardcoded demo flows

---

### Screen 3 — Arc Suggestion
Required UI:
- `Building your room…`
- `Best fit: [Room Style]`
- helper: `You can switch this anytime`
- 3 room-style choices with plain-language labels and short explanations
- the 3 choices should be clearly distinguishable at a glance:
  - one that stays in the current mood
  - one that brings in newer or fresher releases
  - one that leans into more unfamiliar songs
- internal arc terminology may power logic, but the user-facing copy should explain the choice in listener language

Behavior:
- one arc preselected using hardcoded mapping
- user may override before entering room

---

### Screen 4 — Active Room
Required UI:
- room title
- temporary/saved badge
- room-style badge
- room pulse
- helper text
- current track state
- bottom playback bar
- queue access control

Important:
- playback starts immediately
- bottom player time and progress should visibly advance during playback and pause when playback is paused
- do not show a playlist-first review screen

---

### Screen 5 — Queue View
This is required.

The queue should be accessible from the bottom player, similar to a real music platform.

#### Queue UI must show
- now playing
- next up list
- queue changes after steering

#### Behavior
After steering, the queue panel should clearly reflect the updated next-up tracks.
This is one of the main signals that the room is adapting.
Playback should advance through the active session queue as tracks finish.

---

### Screen 6 — In-Session Steering
Required UI:
- diagnostic chips:
  - Too familiar
  - Too different
  - Wrong mood
  - Wrong energy
- natural-language input:
  `Refine this room…`
- subtle testing hint if needed in prototype-only mode

Behavior:
- Too familiar = direct apply
- Too different = direct apply
- Wrong mood = open follow-up row
- Wrong energy = open follow-up row
- natural language always available
- in this prototype, unsupported steering paths for a given hardcoded demo may remain visible but should be disabled with a muted hint guiding the user to the intended demo path

---

### Screen 7 — Follow-up Row for Broad Mismatch
Only appears when relevant.

#### Wrong mood options
- Happier
- Sadder
- Softer
- Darker

#### Wrong energy options
- Calmer
- More energetic
- Slower
- Faster

Behavior:
- tapping option updates queue
- updates pulse
- writes to room memory

---

### Screen 8 — Adjust Room
Small affordance:
`Adjust room`

Do not keep expanded by default.

#### Arc controls
##### Deep Dive
- Go deeper
- Keep it broader

##### Refresh
- More new
- Keep it familiar

##### Surprise Me
- More adventurous
- Stay in my vibe

Behavior:
- affects overall room behavior
- distinct from immediate steering correction

---

### Screen 9 — Save / Discard
Required actions:
- Save song
- Save room
- Discard room

Required helper copy for save room:
`Save this room to revisit the same discovery vibe later — with fresh music each time`

Behavior:
- Save room preserves room identity and room memory
- Save room does not preserve identical queue forever

---

### Screen 10 — Saved Rooms
Required UI:
- section title: `Your Rooms`
- saved room cards
- helper copy:
  `Reopen for a fresh session in the same vibe`

Behavior:
- reopening generates a fresh queue
- local room memory still influences it

---

## 14. Exact Steering Logic

### Steering Paths
User can steer in 3 ways:
1. quick correction
2. arc adjustment
3. natural-language refinement

### Quick Correction
- Too familiar → direct apply
- Too different → direct apply
- Wrong mood → show mood sub-options
- Wrong energy → show energy sub-options

### Arc Adjustment
Changes the room’s overall exploration boldness:
- Deep Dive → Go deeper / Keep it broader
- Refresh → More new / Keep it familiar
- Surprise Me → More adventurous / Stay in my vibe

### Natural-Language Refinement
Always available.
Highest control path.

### Priority Order
If multiple steering signals exist, resolve in this order:
1. latest natural-language instruction
2. latest chip/follow-up correction
3. latest arc adjustment
4. passive behavioral signals

Explicit user intent must always win.

---

## 15. Room Pulse Rules

Allowed states:
- Staying close
- Getting fresher
- Going deeper
- Pulling back

Rules:
- compact and ambient
- update after meaningful steering actions
- do not add verbose explanations
- visibly respond in all 3 demo flows

---

## 16. Save Room Semantics

This must be implemented clearly.

### Save Room Means
Preserve:
- room title
- prompt / seed intent
- arc
- local room memory
- exploration style

### Save Room Does Not Mean
- freeze current exact queue forever
- create a repeat playlist clone

### Reopen Room Behavior
Reopening a saved room must:
- create a new playable session
- stay in the same discovery spirit
- reflect saved room memory
- not replay the exact same previous sequence

This is one of the most important product semantics in the prototype.

---

## 17. Minimal State Management Requirements

The app must support these state changes:
- launcher open / close
- starter selected
- temporary toggle changed
- arc suggested
- arc overridden
- room created
- playback active
- queue visible / hidden
- chip selected
- follow-up option selected
- natural-language refinement submitted
- pulse updated
- song saved
- room saved
- room discarded
- saved room reopened

Saved rooms must persist at least during the active session.

Local room memory must visibly affect:
- pulse
- helper text where relevant
- next-up queue

---

## 18. Design Requirements from DESIGN-spotify.md

Apply these principles explicitly:

### Theme
- near-black immersive dark theme

### Accent
- Spotify green only for meaningful action / active state

### Geometry
- pill buttons
- rounded cards
- circular/pill controls where appropriate

### Elevation
- elevated launcher modal/panel
- premium dark surfaces
- not flat dashboard styling

### Typography
- Spotify-like hierarchy
- concise copy
- bold section labels
- clean card headers

### Interaction Tone
- lightweight
- music-led
- low-friction
- not instructional-heavy

---

## 19. Phased Build Plan

Codex should implement in phases so each phase can be tested before moving forward.

### Phase 1 — Shell + Home + Flow Launcher
Build:
- Spotify-like shell
- Home screen
- Flow entry card
- Flow launcher
- prompt input
- starter prompts
- temporary toggle
- Start room CTA

Also add:
- placeholder hook for optional screenshot reference in docs/comments

Testable outcome:
- user can open Flow and submit a prompt

---

### Phase 2 — Arc Suggestion + Room Creation + Playback UI
Build:
- arc suggestion state
- arc override chips
- active room screen
- room title / badge / pulse / helper text
- bottom player shell
- immediate playback behavior
- hardcoded mapping for 3 demo flows

Testable outcome:
- user can create a room and enter playback

---

### Phase 3 — Queue View + Diagnostic Steering + Natural Language
Build:
- queue panel/drawer
- universal chips
- follow-up row for Wrong mood / Wrong energy
- direct-apply logic for Too familiar / Too different
- natural-language refinement input
- queue mutation for hardcoded flows
- pulse updates

Testable outcome:
- user can steer during playback and visibly see queue changes

---

### Phase 4 — Arc Controls + Room Memory + Save/Discard
Build:
- Adjust room affordance
- final arc control labels
- room-memory updates
- Save song
- Save room
- Discard room
- discard confirmation
- save room confirmation

Testable outcome:
- room direction and save/discard semantics work

---

### Phase 5 — Saved Rooms + Reopen Logic + Polish
Build:
- Your Rooms section
- saved room cards
- reopen room flow
- fresh session generation in same spirit
- prototype-only helper hints
- polish and consistency pass

Testable outcome:
- saved rooms are reusable and clearly not static playlists

---

## 20. Acceptance Criteria by Phase

### Phase 1 accepted when
- launcher opens
- prompt/starter works
- empty submit blocked

### Phase 2 accepted when
- room creation works for all 3 demo prompts
- playback starts immediately
- room title / arc / pulse visible

### Phase 3 accepted when
- queue panel works
- queue changes visibly after steering
- all 4 diagnostic chips behave correctly
- natural-language refinement works
- pulse updates correctly

### Phase 4 accepted when
- arc controls use final labels
- room memory visibly changes future state
- save/discard actions work correctly

### Phase 5 accepted when
- saved rooms display correctly
- reopen creates fresh session
- helper testing notes appear where intended
- visual experience feels polished and Spotify-native

---

## 21. Non-Goals

Do not build:
- real Spotify API integration
- real model inference
- social/community rooms
- room sharing
- voice
- analytics backend
- generalized assistant behavior
- podcast/audiobook extension
- backend architecture beyond what is needed for believable prototype state

---

## 22. Final Build Guidance for Codex

Optimize for:
- clean component structure
- low complexity
- deterministic mocked behavior
- high polish
- easy testability phase by phase

Do not optimize for:
- backend realism
- overengineering
- production-scale architecture inside prototype build

This prototype should be:
- functional
- deployable
- visually strong
- clearly differentiated
- easy to demo live
