import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'

// Public pages
import Home         from './components/pages/Home.vue'
import About        from './components/pages/About.vue'
import Contact      from './components/pages/Contact.vue'
import Services     from './components/pages/Services.vue'
import Archive      from './components/pages/Archive.vue'
import Library      from './components/pages/Library.vue'
import Publishments from './components/pages/Publishments.vue'
import Projects     from './components/pages/Projects.vue'

// Auth pages
import Login              from './components/LoginView.vue'
import Register           from './components/RegisterView.vue'
import OAuth2Redirect     from './components/OAuth2RedirectHandler.vue'
import UserProfile        from './components/UserProfileView.vue' // ✅ NEW

// Admin layout + pages
import AdminLayout    from './components/AdminDashboard/AdminLayout.vue'
import AdminHome      from './components/AdminDashboard/pages/AdminHome.vue'
import ResourceList   from './components/AdminDashboard/pages/ResourceList.vue'
import ResourceEditor from './components/AdminDashboard/pages/ResourceEditor.vue'

// Admin — Projects
import ProjectList   from './components/AdminDashboard/pages/projects/ProjectList.vue'
import ProjectEditor from './components/AdminDashboard/pages/projects/ProjectEditor.vue'

// Admin — News
import NewsList   from './components/AdminDashboard/pages/news/NewsList.vue'
import NewsEditor from './components/AdminDashboard/pages/news/NewsEditor.vue'

// Admin — Image Collections
import ImageCollectionList   from './components/AdminDashboard/pages/publishment/image/ImagecollectionList.vue'
import ImageCollectionEditor from './components/AdminDashboard/pages/publishment/image/ImagecollectionEditor.vue'

// Admin — SoundTracks
import SoundTrackList   from './components/AdminDashboard/pages/publishment/sound/SoundTrackList.vue'
import SoundTrackEditor from './components/AdminDashboard/pages/publishment/sound/SoundTrackEditor.vue'

// Admin — Videos
import VideoList   from './components/AdminDashboard/pages/publishment/video/VideoList.vue'
import VideoEditor from './components/AdminDashboard/pages/publishment/video/VideoEditor.vue'

// Admin — Writings
import WritingList   from './components/AdminDashboard/pages/publishment/writing/WritingList.vue'
import WritingEditor from './components/AdminDashboard/pages/publishment/writing/WritingEditor.vue'

// Admin — About
import AdminAboutList   from './components/AdminDashboard/pages/about/AdminAboutList.vue'
import AdminAboutEditor from './components/AdminDashboard/pages/about/AdminAboutEditor.vue'

const routes = [
  // ── Public ────────────────────────────────────────────────────
  { path: '/',             name: 'Home',         component: Home },
  { path: '/about',        name: 'About',        component: About },
  { path: '/contact',      name: 'Contact',      component: Contact },
  { path: '/services',     name: 'Services',     component: Services },
  { path: '/archive',      name: 'Archive',      component: Archive },
  { path: '/library',      name: 'Library',      component: Library },
  { path: '/publishments', name: 'Publishments', component: Publishments },
  { path: '/projects',     name: 'Projects',     component: Projects },

  // ── Auth ──────────────────────────────────────────────────────
  { 
    path: '/login',    
    name: 'Login',    
    component: Login,    
    meta: { guestOnly: true } 
  },
  { 
    path: '/register', 
    name: 'Register', 
    component: Register, 
    meta: { guestOnly: true } 
  },

  // OAuth2 redirect landing page
  {
    path: '/oauth2/redirect',
    name: 'OAuth2Redirect',
    component: OAuth2Redirect,
    meta: { public: true },
  },

  // ✅ NEW: User Profile (Accessible to all authenticated users)
  {
    path: '/profile',
    name: 'UserProfile',
    component: UserProfile,
    meta: { 
      requiresAuth: true,
      title: 'تەنیشت بەکارهێنەر'
    }
  },

  // ── Admin ─────────────────────────────────────────────────────
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true, roles: ['EMPLOYEE', 'ADMIN', 'SUPER_ADMIN'] },
    children: [
      { path: '', name: 'AdminHome', component: AdminHome },

      // Projects
      { path: 'projects',          name: 'AdminProjectList',   component: ProjectList },
      { path: 'projects/new',      name: 'AdminProjectCreate', component: ProjectEditor },
      { path: 'projects/:id/edit', name: 'AdminProjectEdit',   component: ProjectEditor, props: true },

      // News
      { path: 'news',          name: 'AdminNewsList',   component: NewsList },
      { path: 'news/new',      name: 'AdminNewsCreate', component: NewsEditor },
      { path: 'news/:id/edit', name: 'AdminNewsEdit',   component: NewsEditor, props: true },

      // Videos
      { path: 'videos',          name: 'AdminVideoList',   component: VideoList },
      { path: 'videos/new',      name: 'AdminVideoCreate', component: VideoEditor },
      { path: 'videos/:id/edit', name: 'AdminVideoEdit',   component: VideoEditor, props: true },

      // Image Collections
      { path: 'image-collections',          name: 'AdminImageCollectionList',   component: ImageCollectionList },
      { path: 'image-collections/new',      name: 'AdminImageCollectionCreate', component: ImageCollectionEditor },
      { path: 'image-collections/:id/edit', name: 'AdminImageCollectionEdit',   component: ImageCollectionEditor, props: true },

      // SoundTracks
      { path: 'soundtracks',          name: 'AdminSoundTrackList',   component: SoundTrackList },
      { path: 'soundtracks/new',      name: 'AdminSoundTrackCreate', component: SoundTrackEditor },
      { path: 'soundtracks/:id/edit', name: 'AdminSoundTrackEdit',   component: SoundTrackEditor, props: true },

      // Writings
      { path: 'writings',          name: 'AdminWritingList',   component: WritingList },
      { path: 'writings/new',      name: 'AdminWritingCreate', component: WritingEditor },
      { path: 'writings/:id/edit', name: 'AdminWritingEdit',   component: WritingEditor, props: true },

      // About
      { path: 'about',          name: 'AdminAboutList',   component: AdminAboutList },
      { path: 'about/new',      name: 'AdminAboutCreate', component: AdminAboutEditor },
      { path: 'about/:id/edit', name: 'AdminAboutEdit',   component: AdminAboutEditor, props: true },

      // Generic dynamic resources — MUST be last
      { path: ':resource',          name: 'AdminResourceList',   component: ResourceList },
      { path: ':resource/new',      name: 'AdminResourceCreate', component: ResourceEditor },
      { path: ':resource/:id/edit', name: 'AdminResourceEdit',   component: ResourceEditor, props: true },
    ],
  },

  // ── Fallback ──────────────────────────────────────────────────
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

// Navigation Guard
router.beforeEach((to) => {
  const auth = useAuthStore()

  // Update page title if available
  if (to.meta?.title) {
    document.title = `${to.meta.title} · KHI`
  } else {
    document.title = 'پەیمانگای کەلەپووری کوردی · KHI'
  }

  // Allow public routes
  if (to.meta?.public) return true

  // Handle guest-only routes (login/register)
  if (to.meta?.guestOnly && auth.isAuthenticated) {
    return auth.hasAdminAccess ? { path: '/admin' } : { path: '/' }
  }

  // Allow non-auth routes
  if (!to.meta?.requiresAuth) return true

  // Check authentication
  if (!auth.isAuthenticated) {
    return { 
      path: '/login', 
      query: { redirect: to.fullPath } 
    }
  }

  // Check role authorization for admin routes
  const allowed = to.meta.roles || []
  if (allowed.length && !allowed.includes(auth.role)) {
    return { path: '/', query: { denied: '1' } }
  }

  return true
})

export default router