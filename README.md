# The meal Recipe Finder

A React-based web application that helps users find recipes based on their preferences using [TheMealDB API](https://www.themealdb.com/api.php). The app features a wizard-style interface, smart search, and a preference-learning system that improves recommendations over time.

## 🚀 Features

- **Wizard Interface**: Step-by-step recipe recommendation based on area, category, and ingredients
- **Smart Search**: Real-time recipe search with autocomplete
- **Preference Learning**: Saves user preferences (like/dislike) to improve future recommendations
- **History Tracking**: View all previously recommended recipes with their preference ratings
- **Responsive Design**: Mobile-first design that works seamlessly across all devices
- **Accessible**: WCAG-compliant with full keyboard navigation and screen reader support

## 📋 Table of Contents

- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Architecture & Design Decisions](#architecture--design-decisions)
- [Component Library](#component-library)
- [Styling Approach](#styling-approach)
- [State Management](#state-management)
- [API Integration](#api-integration)
- [Future Enhancements](#future-enhancements)

## 🛠 Tech Stack

- **Framework**: React 19.2.0
- **Build Tool**: Vite 7.2.4
- **Language**: TypeScript 5.9.3
- **Styling**: SCSS with CSS Modules
- **Linting**: ESLint 9 with Prettier
- **API**: TheMealDB REST API

## 🏁 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd the_meal_wizard
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint to check code quality

## 📁 Project Structure

```
src/
├── api/                    # API integration layer
│   └── api.ts              # TheMealDB API client with all endpoints
├── components/             # Reusable UI components
│   ├── Button/             # Primary button component
│   ├── Card/               # Content card component
│   ├── Dropdown/           # Searchable dropdown with keyboard navigation
│   ├── Form/               # Form wrapper with validation
│   ├── Stepper/            # Step indicator component
│   ├── Tabs/               # Tab navigation component
│   └── Toast/              # Toast notification component
├── context/                # React Context providers
│   ├── errorContext.ts     # Global error handling context
│   ├── errorProvider.tsx   # Error provider implementation
│   ├── preferenceContext.ts # User preference context
│   └── preferenceProvider.tsx # Preference storage & sorting logic
├── hooks/                  # Custom React hooks
│   ├── useAreas.ts         # Hook for fetching cuisine areas
│   ├── useIngredientsAndCategories.ts # Hook for fetching ingredients & categories
│   └── useRecipeRecommendation.ts # Hook for recipe recommendation logic
├── pages/                  # Top-level page components
│   └── App/                # Main application page
├── sections/               # Page sections (composed of components)
│   ├── FormStep1/          # First wizard step (area selection)
│   ├── FormStep2/          # Second wizard step (category & ingredient)
│   ├── History/            # Recipe history display
│   ├── PageHeader/         # Page title and description
│   ├── RecipeRecommendation/ # Recipe card with details
│   ├── Search/             # Search interface
│   ├── StepForm/           # Multi-step form orchestrator
│   └── StepFormHeader/     # Form header with stepper
├── styles/                 # Global styles and utilities
│   ├── index.scss          # Design tokens (CSS variables)
│   ├── mixins.scss         # Reusable SCSS mixins
│   └── reset.scss          # CSS reset/normalize
└── utils/                  # Utility functions
    └── utils.ts            # Helper functions
```

## 🏗 Architecture & Design Decisions

### 1. Component Architecture

The application follows a **hierarchical component structure**:

- **Pages**: Top-level routes (`App`)
- **Sections**: Major UI sections that combine multiple components
- **Components**: Reusable, self-contained UI elements
- **Hooks**: Business logic and API integration extracted from components

This separation ensures:

- **Reusability**: Components can be used across different sections
- **Maintainability**: Each layer has a single responsibility
- **Testability**: Components, hooks, and sections can be tested independently

### 2. Compound Component Pattern

Several components (`Dropdown`, `Tabs`, `Form`) use the **compound component pattern**:

```typescript
<Tabs value={activeTab} onChange={setActiveTab}>
  <Tabs.List>
    <Tabs.Tab value="wizard">Wizard</Tabs.Tab>
    <Tabs.Tab value="search">Search</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel value="wizard">
    <StepForm />
  </Tabs.Panel>
</Tabs>
```

**Benefits**:

- More flexible and composable API
- Better encapsulation of internal state
- Improved developer experience with clear structure
- Easier to extend without breaking changes

### 3. Context-Based State Management

Instead of Redux or other heavy state management libraries, the app uses **React Context** for global state:

- **PreferenceContext**: Manages user preferences and sorting logic
- **ErrorContext**: Handles global error states and toast notifications

**Rationale**:

- Simpler setup with less boilerplate
- Sufficient for the app's moderate state complexity
- Better performance with selective re-renders
- No external dependencies needed

### 4. Smart Preference System

The preference system intelligently sorts dropdown options based on user likes/dislikes:

```typescript
// Options are sorted by preference score
sortOptionsByPreference(options, 'area')
// Italian (liked +1) appears first
// British (disliked -1) appears last
```

This creates a **learning interface** that adapts to user behavior over time.

### 5. Priority-Based Recipe Recommendation

The recommendation algorithm uses a **4-tier priority system**:

1. **Priority 1**: Matches area AND (category OR ingredient)
2. **Priority 2**: Matches ONLY category OR ingredient (not area)
3. **Priority 3**: Matches ONLY area
4. **Priority 4**: Random recipe (fallback)

This ensures:

- Most relevant results appear first
- Users always get a recommendation
- Good balance between precision and recall

### 6. Local Storage for Persistence

User preferences are stored in `localStorage`:

```typescript
const STORAGE_KEY = 'recipe_preferences'
```

**Benefits**:

- No backend required
- Instant persistence
- Works offline
- Privacy-friendly (data stays on device)

### 7. Accessibility-First Design

All components are built with accessibility in mind:

- Full keyboard navigation (Arrow keys, Enter, Escape, Tab)
- Proper ARIA labels and roles
- Focus management
- Screen reader announcements
- Semantic HTML

### 8. Mobile-First Responsive Design

The app uses a **mobile-first approach** with SCSS mixins:

```scss
@mixin mq($breakpoint) {
  @media (min-width: var(--breakpoint-#{$breakpoint})) {
    @content;
  }
}
```

Components are designed for mobile by default and enhanced for larger screens.

## 🎨 Component Library

### Button

Primary button with loading and disabled states.

### Card

Container component for displaying content with consistent spacing and borders.

### Dropdown

A fully-featured dropdown with:

- Searchable and non-searchable modes
- Keyboard navigation
- Option grouping
- Loading states
- Error handling

### Form

Form wrapper with validation and field management.

### Stepper

Visual progress indicator for multi-step processes.

### Tabs

Tab navigation with panels for organizing content.

### Toast

Non-blocking notifications for user feedback.

## 🎨 Styling Approach

### Design Tokens

All design values are defined as **CSS variables** in `src/styles/index.scss`:

```scss
:root {
  // Colors
  --color-foreground: #222222;
  --color-background: #fff;
  --color-accent: #007bff;

  // Spacing
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 2rem;

  // Typography
  --title-1-font-size: 2rem;
  --title-1-font-weight: 600;
  --body-1-font-size: 1rem;

  // Border radius
  --radius-sm: 4px;
  --radius-md: 8px;

  // Breakpoints
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
}
```

**Benefits**:

- Single source of truth for design values
- Easy to maintain and update
- Theme switching capability
- Consistent design language

### CSS Modules + SCSS

Each component has its own `.module.scss` file:

```typescript
import styles from './Button.module.scss'

<button className={styles.button}>Click me</button>
```

**Benefits**:

- Scoped styles (no global conflicts)
- TypeScript autocomplete for class names
- SCSS features (nesting, mixins, variables)
- Automatic dead code elimination

### BEM Naming Convention

Component styles follow **BEM (Block Element Modifier)** notation:

```scss
.dropdown {
  // Block

  &__input {
    // Element
  }

  &--open {
    // Modifier
  }
}
```

This creates a clear, predictable naming structure that scales well.

### Shared Mixins

Common patterns are extracted to `src/styles/mixins.scss`:

```scss
// Media query mixin
@mixin mq($breakpoint) {
  @media (min-width: var(--breakpoint-#{$breakpoint})) {
    @content;
  }
}

// Typography mixins
@mixin title-1 {
  font-size: var(--title-1-font-size);
  font-weight: var(--title-1-font-weight);
  line-height: var(--title-1-line-height);
}
```

Mixins are automatically imported in all SCSS files via Vite config.

## 🔄 State Management

### Global State (Context)

**PreferenceContext**:

- Stores all recipe preferences (likes/dislikes)
- Provides preference scoring for sorting
- Manages localStorage persistence
- Exports `usePreference` hook for components

**ErrorContext**:

- Manages error states
- Shows toast notifications
- Exports `useError` hook for error handling

### Local State (useState)

Component-specific state is kept local:

- Form inputs
- UI state (open/closed, loading, etc.)
- Temporary values

### Custom Hooks

Business logic is extracted to custom hooks:

- `useAreas`: Fetches cuisine areas
- `useIngredientsAndCategories`: Fetches ingredients and categories
- `useRecipeRecommendation`: Handles recommendation logic

This keeps components thin and focused on presentation.

## 🌐 API Integration

### TheMealDB API

The app uses the free [TheMealDB API](https://www.themealdb.com/api.php):

```typescript
const API_BASE = 'https://www.themealdb.com/api/json/v1/1'
```

### Available Endpoints

All API functions are in `src/api/api.ts`:

- `fetchAreas()` - Get all cuisine areas
- `fetchCategories()` - Get all meal categories
- `fetchIngredients()` - Get all ingredients
- `searchByArea(area)` - Find recipes by cuisine
- `searchByCategory(category)` - Find recipes by category
- `searchByIngredient(ingredient)` - Find recipes by ingredient
- `getRecipeById(id)` - Get full recipe details
- `searchRecipesByName(name)` - Search recipes by name
- `getRandomRecipe()` - Get a random recipe
- `getRecipeRecommendation(filters, excludeIds)` - Smart recommendation

### Error Handling

API errors are caught and displayed to users via toast notifications:

```typescript
try {
  const recipe = await getRecipeById(id)
} catch (error) {
  showError('Failed to load recipe. Please try again.')
}
```

## 📝 Future Enhancements

### Testing

- [ ] Add unit tests for components using Vitest and React Testing Library
- [ ] Add integration tests for user flows
- [ ] Add E2E tests for critical paths
- [ ] Test accessibility compliance with automated tools

### Dropdown Component Extensions

- [ ] Add multi-select support
- [ ] Add option to disable specific dropdown options
- [ ] Add virtualization for large option lists (100+ items)
- [ ] Add custom option rendering support
- [ ] Add clear button for searchable dropdowns
- [ ] Add "Select All" / "Clear All" for multi-select mode

### General Improvements

- [ ] Add loading skeletons for better perceived performance
- [ ] Implement recipe favoriting/bookmarking
- [ ] Add recipe sharing functionality
- [ ] Add print-friendly recipe view
- [ ] Implement dark mode theme

---
