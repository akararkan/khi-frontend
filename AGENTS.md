# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is the **Kurdish Heritage Institute (KHI) Web Frontend** — a bilingual Vue 3 application for managing and presenting Kurdish cultural heritage content. The application supports two Kurdish dialects:
- **Sorani (CKB)** - Right-to-left (RTL), default
- **Kurmanji (KMR)** - Left-to-right (LTR)

The frontend connects to a Java Spring Boot backend API (default: `http://localhost:8080`).

## Common Development Commands

### Development Server
```bash
npm run dev
```
Starts Vite dev server with hot-reload (typically at `http://localhost:5173`)

### Production Build
```bash
npm run build
```
Outputs production-ready files to `dist/` directory

### Preview Production Build
```bash
npm run preview
```
Locally preview the production build

### Docker Build & Deploy
```bash
# Build Docker image
docker build -t khi-web-frontend .

# Run container
docker run -p 80:80 khi-web-frontend
```
The Dockerfile uses a multi-stage build: Node.js build stage → nginx runtime stage

## Architecture Overview

### Core Technology Stack
- **Framework**: Vue 3 (Composition API with `<script setup>`)
- **State Management**: Pinia stores
- **Routing**: Vue Router with role-based access control
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS 4 (PostCSS-based)
- **HTTP Client**: 
  - Axios (primary, with interceptors) via `src/api.js`
  - Native fetch (auth flows only) in `useAuthStore.js`
- **Validation**: Vuelidate
- **Internationalization**: vue-i18n

### Project Structure

```
src/
├── main.js                    # App entry point, Pinia + Router setup
├── App.vue                    # Root component with language/admin routing logic
├── router.js                  # All route definitions with auth guards
├── api.js                     # Axios instance with Bearer token interceptors
│
├── stores/                    # Pinia state management
│   ├── useAuthStore.js        # JWT auth, login, register, logout
│   └── useLanguageStore.js    # Bilingual strings, content helpers
│
├── components/
│   ├── NavBar.vue             # Public site navigation
│   ├── Topbar.vue             # Admin dashboard topbar
│   ├── Sidebar.vue            # Admin dashboard sidebar (inferred)
│   ├── Footer.vue             # Public site footer
│   ├── LoginView.vue          # Login form
│   ├── RegisterView.vue       # Registration form
│   ├── consts.js              # API_BASE_URL constant
│   │
│   ├── pages/                 # Public-facing pages
│   │   ├── Home.vue
│   │   ├── Projects.vue       # Project listing/detail (bilingual)
│   │   ├── Publishments.vue   # Publications listing (bilingual)
│   │   ├── About.vue
│   │   ├── Contact.vue
│   │   ├── Services.vue
│   │   ├── Archive.vue
│   │   └── Library.vue
│   │
│   └── AdminDashboard/        # Admin-only components
│       ├── AdminLayout.vue    # Admin shell (Sidebar + Topbar)
│       └── pages/
│           ├── AdminHome.vue
│           ├── ResourceList.vue      # Generic resource listing
│           ├── ResourceEditor.vue    # Generic resource editor
│           ├── projects/
│           │   ├── ProjectList.vue
│           │   └── ProjectEditor.vue
│           ├── news/
│           │   ├── NewsList.vue
│           │   └── NewsEditor.vue
│           └── publishment/
│               ├── video/
│               │   ├── VideoList.vue
│               │   └── VideoEditor.vue
│               ├── image/
│               │   ├── ImagecollectionList.vue
│               │   └── ImagecollectionEditor.vue
│               ├── sound/
│               │   ├── SoundTrackList.vue
│               │   └── SoundTrackEditor.vue
│               └── writing/
│                   ├── WritingList.vue
│                   └── WritingEditor.vue
```

### Key Architectural Patterns

#### 1. Bilingual Content Model
All content entities (Projects, Publishments, etc.) have separate content objects for each language:
- `ckbContent`: { title, description, location, ... }
- `kmrContent`: { title, description, location, ... }
- `contentLanguages`: ['CKB', 'KMR']
- Language-specific arrays: `tagsCkb`, `tagsKmr`, `keywordsCkb`, `keywordsKmr`, etc.

The `useLanguageStore` provides helper methods to extract content in the active language:
- `lang.getContent(item)` - Returns active language content
- `lang.title(item)`, `lang.description(item)` - Shortcuts
- `lang.tags(item)`, `lang.keywords(item)` - Language-aware arrays
- `lang.hasContentInLanguage(item, 'CKB')` - Check availability

#### 2. Authentication & Authorization
- **JWT-based** auth stored in localStorage: `khi_token`, `khi_user`
- **Roles**: `GUEST`, `EMPLOYEE`, `ADMIN`, `SUPER_ADMIN`
- Admin roles (`EMPLOYEE`+) have access to `/admin/*` routes
- Navigation guard in `router.js` enforces role-based access
- Axios interceptor automatically attaches `Bearer` token to all requests
- 401/403 responses clear session and redirect to `/login`

**Important**: The auth store uses **native fetch** for login/register (explicit `Content-Type: application/json` headers required for backend compatibility), while all other API calls use the configured Axios instance.

#### 3. Admin Page Layout
Admin routes use a **nested layout pattern**:
- `/admin` → `AdminLayout.vue` (provides Sidebar + Topbar chrome)
- Child routes render in `<router-view>` within `AdminLayout`
- All admin pages are RTL Kurdish by default (no language switching in admin)
- Generic `ResourceList` and `ResourceEditor` components handle dynamic resource types

#### 4. API Communication
- Primary API client: `src/api.js` (Axios with interceptors)
- Base URL configuration:
  - `api.js` uses `import.meta.env.VITE_API_URL` (default: `http://localhost:8080`)
  - `useAuthStore.js` uses `import.meta.env.VITE_API_BASE_URL` (default: `http://localhost:8080`)
  - `consts.js` exports `API_BASE_URL = 'http://localhost:8080/api/v1'`
- Admin editors typically fetch data on mount and submit via POST/PUT

#### 5. Language Management
- `useLanguageStore` is the **single source of truth** for all UI strings
- Language persists to localStorage as `kurdish-lang`
- `App.vue` conditionally applies language settings:
  - Public pages: User-selected language (CKB/KMR) with dir/lang attributes
  - Admin pages: Always RTL Kurdish, no language switching
- Direction-aware CSS: `.user-root[dir="rtl"]` vs `[dir="ltr"]`

## Development Guidelines

### Adding New Features

#### Creating a New Public Page
1. Create Vue component in `src/components/pages/`
2. Import and register route in `src/router.js`
3. Add navigation link in `NavBar.vue` (bilingual labels via `lang.strings.nav.*`)
4. Use `useLanguageStore` for all UI text (never hardcode strings)

#### Creating a New Admin Resource Type
1. Create List/Editor components in `src/components/AdminDashboard/pages/<resource>/`
2. Import into `src/router.js` and add routes under `/admin` children
3. Add Sidebar link (component location TBD, inferred to exist)
4. Use `api.js` Axios instance for all CRUD operations
5. Implement bilingual content structure: `ckbContent` / `kmrContent`
6. Handle `contentLanguages` array and language-specific metadata

### Working with API Calls
- **Always** import `api` from `@/api.js` for authenticated requests
- Token is automatically attached via request interceptor
- Structure API calls:
  ```javascript
  import api from '@/api'
  
  // GET
  const { data } = await api.get('/api/v1/resource')
  
  // POST/PUT
  await api.post('/api/v1/resource', payload)
  await api.put(`/api/v1/resource/${id}`, payload)
  
  // DELETE
  await api.delete(`/api/v1/resource/${id}`)
  ```
- Handle errors appropriately (401/403 will auto-redirect via interceptor)

### Path Alias
- `@` is aliased to `src/` (configured in `vite.config.js` and `jsconfig.json`)
- Always use `@/` imports for clarity: `import api from '@/api'`

### Styling Patterns
- Admin dashboard uses **custom CSS variables** (see `AdminLayout.vue` `:root`)
- Primary colors: Crimson (`#8C1515`), Gold (`#FEDD00`), Cream (`#FAFAF9`)
- Font: Noto Naskh Arabic (Arabic/Kurdish), Playfair Display (decorative)
- All admin components expect RTL layout by default
- Tailwind is available but admin pages prefer custom CSS classes

### Environment Configuration
The application uses Vite environment variables:
- `VITE_API_URL` - Backend API base URL (default: `http://localhost:8080`)
- `VITE_API_BASE_URL` - Alternative auth-specific base URL
- Create `.env.local` for local overrides (gitignored)

### Testing
No test framework is currently configured. Tests would typically be run via:
```bash
# Placeholder for future testing setup
npm run test
```

## Important Caveats

1. **Node Version**: Requires Node.js `^20.19.0 || >=22.12.0` (see `package.json` engines)

2. **README.md Conflict**: The README contains a Git merge conflict — resolve before using any README instructions.

3. **API URL Inconsistency**: Multiple base URL configurations exist (`api.js`, `useAuthStore.js`, `consts.js`). When modifying API URLs, update all three locations or consolidate.

4. **Auth Store Fetch**: `useAuthStore.js` uses native fetch instead of Axios for login/register to ensure proper `Content-Type` headers. Do not refactor to Axios without testing backend compatibility.

5. **Admin Language Lock**: Admin pages are intentionally locked to RTL Kurdish. Do not add language switching to admin area without consulting team.

6. **Bilingual Validation**: Always validate that both language content objects exist when `contentLanguages` includes both 'CKB' and 'KMR'. Missing content causes UI errors.

7. **Sidebar Component**: Sidebar.vue is imported but not visible in provided files. It likely contains admin navigation links.

## Common Patterns to Follow

### Bilingual Component Pattern
```vue
<script setup>
import { useLanguageStore } from '@/stores/useLanguageStore'

const lang = useLanguageStore()

// Access UI strings
const title = lang.strings.projects.pageTitle

// Extract bilingual content from API response
const projectTitle = lang.title(project)
const projectTags = lang.tags(project)
</script>

<template>
  <h1>{{ title }}</h1>
  <div :dir="lang.dir">{{ projectTitle }}</div>
</template>
```

### Admin Editor Pattern
```vue
<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/api'

const route = useRoute()
const router = useRouter()
const isEdit = !!route.params.id

const form = ref({
  contentLanguages: ['CKB'],
  ckbContent: { title: '', description: '' },
  kmrContent: { title: '', description: '' },
  tagsCkb: [],
  tagsKmr: [],
  // ...
})

onMounted(async () => {
  if (isEdit) {
    const { data } = await api.get(`/api/v1/resource/${route.params.id}`)
    form.value = data
  }
})

async function submit() {
  if (isEdit) {
    await api.put(`/api/v1/resource/${route.params.id}`, form.value)
  } else {
    await api.post('/api/v1/resource', form.value)
  }
  router.push('/admin/resource')
}
</script>
```

### Auth-Protected Route Pattern
```javascript
// In router.js
{
  path: '/admin/resource',
  component: ResourceComponent,
  meta: { 
    requiresAuth: true, 
    roles: ['EMPLOYEE', 'ADMIN', 'SUPER_ADMIN'] 
  }
}
```
