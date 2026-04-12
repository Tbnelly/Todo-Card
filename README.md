Sure! Here are both READMEs:

Frontend README
markdown# Todo Task Card Component

A clean, modern, and accessible Todo Task Card built with React. This component was built as part of a frontend task to demonstrate component architecture, state management, accessibility, and responsive design.

## Preview

The card displays a single todo task with:
- A completable checkbox that strikes through the title and updates the status
- Priority and status badges
- Due date and live time remaining countdown
- Filterable tags
- Edit and Delete action buttons

## Tech Stack

- React 18 (functional components + hooks)
- Vite (build tool)
- Plain CSS (global stylesheet — no CSS modules or styled-components)

## Project Structure
src/
├── components/
│   └── TodoCard.jsx       # Main todo card component
├── App.jsx                # Root component
├── index.css              # All styles live here
└── main.jsx               # Entry point

## Getting Started

### Prerequisites

- Node.js v18 or higher
- npm v9 or higher

### Installation

```bash
# Clone the repository
git clone https://github.com/Tbnelly/Todo-Card
cd todo-card

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The output will be in the `dist/` folder, ready to deploy.

## Component API

`TodoCard` accepts the following props:

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | string | `"Redesign the onboarding flow..."` | The task title |
| `description` | string | `"Update wireframes..."` | The task description |
| `priority` | `"Low"` \| `"Medium"` \| `"High"` | `"High"` | Priority level |
| `tags` | string[] | `["UX Design", "Mobile", ...]` | List of tag labels |

### Example Usage

```jsx
<TodoCard
  title="Write unit tests for auth module"
  description="Cover login, logout, and token refresh flows."
  priority="Medium"
  tags={["Testing", "Auth", "Backend"]}
/>
```

## Features

### Checkbox Toggle
Checking the checkbox:
- Applies a line-through style to the title
- Changes the status badge from **Pending** to **Done**

Unchecking reverses both changes.

### Live Time Remaining
The time remaining field calculates the difference between now and the fixed due date (`March 1, 2026 18:00 UTC`) and updates every 60 seconds. It displays human-friendly text:

- `Due in 3 days`
- `Due tomorrow`
- `Due in 2 hours`
- `Due now!`
- `Overdue by 2 hours`

### Priority Colors
| Priority | Color |
|---|---|
| High | Red |
| Medium | Amber |
| Low | Green |

## Accessibility

- Checkbox has both a label association (`htmlFor`) and an `aria-label`
- Status and time remaining use `aria-live="polite"` so screen readers announce changes
- All buttons have `aria-label` attributes
- Full keyboard navigation support with visible `:focus-visible` rings
- Semantic HTML: `<article>`, `<h2>`, `<time>`, `<ul>`, `<li>`

## data-testid Reference

All test IDs are exactly as specified:

| Element | data-testid |
|---|---|
| Root card | `test-todo-card` |
| Title | `test-todo-title` |
| Description | `test-todo-description` |
| Priority badge | `test-todo-priority` |
| Due date | `test-todo-due-date` |
| Time remaining | `test-todo-time-remaining` |
| Status badge | `test-todo-status` |
| Checkbox | `test-todo-complete-toggle` |
| Tags list | `test-todo-tags` |
| Individual tag | `test-todo-tag` |
| Edit button | `test-todo-edit-button` |
| Delete button | `test-todo-delete-button` |

## Responsiveness

- Mobile-first layout
- Full width on small screens
- Max width of `420px` on desktop
- Tags wrap naturally with `flex-wrap`
- No horizontal overflow

## Dark Mode

Dark mode is handled automatically via `@media (prefers-color-scheme: dark)` — no toggle needed. The component adapts to the user's OS preference.

## Deployment

### Vercel (recommended)

https://todo-card-ashy.vercel.app/

### Netlify

```bash
npm run build
# Drag and drop the dist/ folder to netlify.com/drop