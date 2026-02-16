import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'

// Public pages
import Home from './components/pages/Home.vue'
import About from './components/pages/About.vue'
import Contact from './components/pages/Contact.vue'
import Services from './components/pages/Services.vue'
import Archive from './components/pages/Archive.vue'
import Library from './components/pages/Library.vue'
import Publishments from './components/pages/Publishments.vue'
import Projects from './components/pages/Projects.vue'

// Auth pages
import Login from './components/LoginView.vue'
import Register from './components/RegisterView.vue'

// Admin layout + pages
import AdminLayout from './components/AdminDashboard/AdminLayout.vue'
import AdminHome from './components/AdminDashboard/pages/AdminHome.vue'
import ResourceList from './components/AdminDashboard/pages/ResourceList.vue'
import ResourceEditor from './components/AdminDashboard/pages/ResourceEditor.vue'

const routes = [
  // =========================
  // Public
  // =========================
  { path: '/', name: 'Home', component: Home },
  { path: '/about', name: 'About', component: About },
  { path: '/contact', name: 'Contact', component: Contact },
  { path: '/services', name: 'Services', component: Services },
  { path: '/archive', name: 'Archive', component: Archive },
  { path: '/library', name: 'Library', component: Library },
  { path: '/publishments', name: 'Publishments', component: Publishments },
  { path: '/projects', name: 'Projects', component: Projects },

  // =========================
  // Auth
  // =========================
  { path: '/login', name: 'Login', component: Login, meta: { guestOnly: true } },
  { path: '/register', name: 'Register', component: Register, meta: { guestOnly: true } },

  // =========================
  // Admin (Protected)
  // =========================
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true, roles: ['EMPLOYEE', 'ADMIN', 'SUPER_ADMIN'] },
    children: [
      { path: '', name: 'AdminHome', component: AdminHome },
      { path: ':resource', name: 'AdminResourceList', component: ResourceList },
      { path: ':resource/new', name: 'AdminResourceCreate', component: ResourceEditor },
      { path: ':resource/:id/edit', name: 'AdminResourceEdit', component: ResourceEditor },
    ],
  },

  // fallback
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Global guard
router.beforeEach((to) => {
  const auth = useAuthStore()

  // ✅ ئەگەر داخڵبوو، /login و /register مەبینێت
  if (to.meta?.guestOnly && auth.isAuthenticated) {
    // ✅ Check if user has admin access
    if (auth.hasAdminAccess) {
      return { path: '/admin' }
    }
    return { path: '/' }
  }

  // پاراستن
  if (!to.meta?.requiresAuth) return true

  if (!auth.isAuthenticated) {
    return { path: '/login', query: { redirect: to.fullPath } }
  }

  const allowed = to.meta.roles || []
  if (allowed.length && !allowed.includes(auth.role)) {
    // ئەگەر GUEST ـە، یان ڕۆڵێکی ترە، نەهێڵێتە ناو داشبۆرد
    return { path: '/', query: { denied: '1' } }
  }

  return true
})

export default router