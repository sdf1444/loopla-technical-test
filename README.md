# Loopla Technical Test

This is a small web app built with **Next.js (App Router)**, **TypeScript**, **React**, and **Material UI**. It allows users to view, search, and create events. Events are stored in a JSON file (`data/events.json`) for simplicity.

---

## Features

### Home Page (`/`)
- Displays a list of upcoming events.
- Events are **sorted by title length (shortest first)** and then by date.
- Client-side **search bar** filters events by title.
- Success message shown after creating a new event.

### Create Event Page (`/create`)
- Form with fields: title, description, date, and location.
- **Validation rules**:
  - Title is required and must end with an emoji.
  - Date and location are required.
  - Location is stored in uppercase.
- Submits a POST request to `/api/events`.
- Redirects to home page with a success message upon successful creation.

### Event Detail Page (`/event/[id]`)
- Server-side page displaying a single event.
- Shows title, date, location, and optional description.
- Returns a 404 page if the event does not exist.

---

## Technical Decisions

1. **Server vs Client Components**
   - **Home Page**: Client component, uses `useState`, `useEffect`, and `useSearchParams` for interactive search and dynamic filtering.
   - **Create Event Page**: Client component, uses `useState` for form inputs and client-side validation, and `useRouter` for redirect.
   - **Event Detail Page**: Server component, reads event data from the filesystem and uses `notFound()` for 404 handling. No interactivity needed.

2. **Data Storage and Event Store**
   - Events are stored in `data/events.json` for simplicity.
   - **Server-side reads and writes** ensure persistence.
   - An **in-memory cache** is used on the server to avoid reading the file repeatedly during a single server session, improving performance.
   - When a new event is created, the cache is updated immediately to reflect the change.
   - The cache is invalidated automatically if the JSON file is modified externally.

3. **Material UI**
   - Used for rapid development and consistent styling of forms, lists, buttons, and alerts.
   - Provides a clean, accessible UI without extra CSS.

4. **Validation**
   - Client-side validation in the form ensures required fields are filled.
   - Title must end with at least one emoji, enforced via regex.
   - Location is stored in uppercase to maintain consistency.

5. **Sorting Logic**
   - Recursive function `objx` sorts events by title length (shortest first) and then by date.

6. **API Routes**
   - Follows Next.js App Router conventions.
   - Handles GET and POST requests for events.
   - Updates cache after POST requests to ensure the latest data is served.

---

## Unit Tests

The app includes comprehensive **unit tests** for all major functionality:

### Home Page Tests (`__tests__/home.test.tsx`)
- Fetches and displays events from the API.
- Filters events based on search input.

### Create Event Page Tests (`__tests__/create.test.tsx`)
- Prevents form submission if required fields are empty.
- Shows validation error if the title does not end with an emoji.
- Submits form correctly when all fields are valid.
- Alerts the user if API call fails.

### Event Detail Component Tests (`__tests__/eventDetails.test.tsx`)
- Displays all event details correctly.
- Handles missing description gracefully.
- Renders title as a heading for accessibility.
- Shows date and location in the expected format.
- Renders a back link if provided.
- Handles empty event object without crashing.
- Displays description with emojis and special characters correctly.

### `objx` Utility Tests (`__tests__/objx.test.ts`)
- Handles empty and single-item arrays correctly.
- Maintains all items after sorting.
- Preserves relative order of items with identical title lengths.
- Sorts mixed title lengths correctly.
- Works with larger random arrays without losing items.

### API Route Tests (`__tests__/api.events.test.ts`)
- GET returns 200 and an array of events.
- POST creates a new event with correct transformation (location uppercased).
- POST returns 400 if required fields are missing.

> **Testing Tools Used**:
> - `@testing-library/react` for rendering and interactions
> - `@testing-library/jest-dom` for DOM assertions
> - `jest` for mocking and test runner
> - `user-event` for simulating user actions

---

## Project Structure
```bash
/app
/create -> Client component for creating events
/event/[id] -> Server component for event details
/page.tsx -> Home page (client component)
/data
events.json -> JSON file storing events
/types
index.d.ts -> Type definitions
/app/api/events
route.ts -> API route handling event CRUD
```

---

## Running the App

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open http://localhost:3000 in your browser.

---

## Running unit tests

```bash
npm test
```

## Notes

- Focus was on functionality and clarity, not styling.

- App follows Next.js App Router best practices with proper use of server and client components.

- Recursive function objx is included but does not affect functionality.
