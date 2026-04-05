# AI Game Specialist

## Current State
New project. No existing application files.

## Requested Changes (Diff)

### Add
- AI Game Suggestion System: text input where user describes mood/preferences; keyword matching engine against a 50+ game database spanning Action, Horror, Racing, Puzzle, Simulation, Escape, Parkour, Funny categories. Returns game name, genre, description, and reason it matches. Tracks suggestion request count per session; every 3rd request triggers a "Please rate our website" modal.
- Image Upload System: upload up to 5 images per day per session. Backend enforces the daily limit with per-session counters and daily reset. UI shows counter "X/5 uploads used today".
- Subscription / Pricing section: shows a "2-Month Package" at $1.00 / 92 rupees with a "Subscribe Now" button. Note that Stripe is not yet connected.
- Website Rating System: 1-5 star widget, stores ratings in backend, shows average rating and total count. Rating modal appears every 3 suggestion requests.
- Navigation: Home, AI Game Suggester, Upload, Pricing, Ratings sections.
- Design: dark gaming aesthetic, neon accent colors, smooth animations, hover effects, fully responsive.

### Modify
N/A

### Remove
N/A

## Implementation Plan

### Backend (Motoko)
- `rateWebsite(rating: Nat)`: store a rating (1-5), return updated average and count
- `getRatings()`: return current average and total count
- `recordUpload(sessionId: Text)`: increment daily upload count for session; return new count or error if limit reached
- `getUploadCount(sessionId: Text)`: return current count for session today
- `recordSubscription(sessionId: Text, plan: Text)`: store subscription intent record
- Daily reset logic: store uploads with date stamps, filter stale entries

### Frontend (React/TypeScript/Tailwind)
- App shell with sticky nav (Home, AI Suggester, Upload, Pricing, Ratings)
- Home section: hero with neon gaming visuals, tagline
- AI Suggester section: text input + submit; result cards showing game name, genre, description, match reason; session counter tracked in local state; RatingModal on every 3rd request
- Game database: 50+ games hardcoded in frontend with keywords/tags for matching
- Upload section: drag-and-drop or file input; calls backend to enforce limit; counter display
- Pricing section: plan card with price in USD and INR, Subscribe Now button, Stripe note
- Ratings section: star widget, average and count from backend, submit rating
- RatingModal: shown after every 3 suggestion requests; contains star rating widget
- Session ID: generated once per browser session (UUID stored in sessionStorage)
