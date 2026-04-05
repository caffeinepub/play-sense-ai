# Play Sense AI

## Current State
- Full-stack app with Motoko backend and React/TypeScript frontend
- 55-game database across 8 genres (Action, Horror, Racing, Puzzle, Simulation, Escape, Parkour, Funny)
- AI game suggester: user describes mood/preferences, app recommends games
- Daily image upload limit (5/day) tracked via backend
- Subscription recording (2-month plan, $1)
- Star rating system with popup after every 3 interactions
- Dark neon design with Play Sense AI branding
- Backend stores: ratings, upload counts, subscription records

## Requested Changes (Diff)

### Add
- **Full-screen Free Chat page** (ChatGPT-style):
  - Dedicated full-screen chat interface accessible from nav
  - Multi-turn conversation with persistent memory within session
  - AI responds to any game-related questions (not just suggestions)
  - Conversation history shown as chat bubbles (user left/right, AI left)
  - Typing indicator animation while AI is "thinking"
  - Input area at bottom with send button
  - Clear conversation button
  - Chat knows about all 55 games in the database (game memory)
  - Sidebar or header showing conversation count / memory status
  - Free to use (no subscription required)
- **Games Memory panel**:
  - AI remembers all games discussed in the current session
  - Shows a "memory" sidebar or chip list of games mentioned in chat
  - When AI references a game, it's added to the memory list

### Modify
- Navigation: add "Free Chat" link/button in the navbar
- App routing: support switching between main page and full-screen chat page

### Remove
- Nothing removed

## Implementation Plan
1. Add `chatHistory` state management (session-local, no backend needed)
2. Add `gameMentioned` memory tracking across chat messages
3. Build `ChatPage` component as full-screen layout:
   - Top bar with title, memory chips, clear button
   - Scrollable messages area with chat bubbles
   - Bottom input row
4. Implement AI chat logic using the 55-game GAME_DATABASE (pattern match + context-aware responses)
5. Add navigation link from main page navbar to ChatPage
6. Wire routing with simple state toggle (no React Router needed)
