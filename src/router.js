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
import Login    from './components/LoginView.vue'
import Register from './components/RegisterView.vue'

// Admin layout + pages
import AdminLayout    from './components/AdminDashboard/AdminLayout.vue'
import AdminHome      from './components/AdminDashboard/pages/AdminHome.vue'
import ResourceList   from './components/AdminDashboard/pages/ResourceList.vue'
import ResourceEditor from './components/AdminDashboard/pages/ResourceEditor.vue'

// Admin — Projects
import ProjectList   from './components/AdminDashboard/pages/projects/ProjectList.vue'
import ProjectEditor from './components/AdminDashboard/pages/projects/ProjectEditor.vue'


import NewsList   from './components/AdminDashboard/pages/news/NewsList.vue'
import NewsEditor from './components/AdminDashboard/pages/news/NewsEditor.vue'

const routes = [
  // =========================
  // Public  (flat — Navbar/Footer shown by App.vue)
  // =========================
  { path: '/',             name: 'Home',         component: Home         },
  { path: '/about',        name: 'About',        component: About        },
  { path: '/contact',      name: 'Contact',      component: Contact      },
  { path: '/services',     name: 'Services',     component: Services     },
  { path: '/archive',      name: 'Archive',      component: Archive      },
  { path: '/library',      name: 'Library',      component: Library      },
  { path: '/publishments', name: 'Publishments', component: Publishments },
  { path: '/projects',     name: 'Projects',     component: Projects     },

  // =========================
  // Auth
  // =========================
  { path: '/login',    name: 'Login',    component: Login,    meta: { guestOnly: true } },
  { path: '/register', name: 'Register', component: Register, meta: { guestOnly: true } },

  // =========================
  // Admin  (Navbar/Footer hidden by App.vue isAdmin check)
  // =========================
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true, roles: ['EMPLOYEE', 'ADMIN', 'SUPER_ADMIN'] },
    children: [
      { path: '',                  name: 'AdminHome',           component: AdminHome      },
      { path: 'projects',          name: 'AdminProjectList',    component: ProjectList    },
      { path: 'projects/new',      name: 'AdminProjectCreate',  component: ProjectEditor  },
      { path: 'projects/:id/edit', name: 'AdminProjectEdit',    component: ProjectEditor  },
      { path: ':resource',          name: 'AdminResourceList',   component: ResourceList   },
      { path: ':resource/new',      name: 'AdminResourceCreate', component: ResourceEditor },
      { path: ':resource/:id/edit', name: 'AdminResourceEdit',   component: ResourceEditor },

      // News
      { path: 'news',           name: 'AdminNewsList',   component: NewsList },
      { path: 'news/new',       name: 'AdminNewsCreate', component: NewsEditor },
      { path: 'news/:id/edit', name: 'AdminNewsEdit',   component: NewsEditor, props: true },
      { path: ':resource',          name: 'AdminResourceList',   component: ResourceList   },
      { path: ':resource/new',      name: 'AdminResourceCreate', component: ResourceEditor },
      { path: ':resource/:id/edit', name: 'AdminResourceEdit',   component: ResourceEditor },
    ],
  },

  // Fallback
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

router.beforeEach((to) => {
  const auth = useAuthStore()

  if (to.meta?.guestOnly && auth.isAuthenticated) {
    return auth.hasAdminAccess ? { path: '/admin' } : { path: '/' }
  }

  if (!to.meta?.requiresAuth) return true

  if (!auth.isAuthenticated) {
    return { path: '/login', query: { redirect: to.fullPath } }
  }

  const allowed = to.meta.roles || []
  if (allowed.length && !allowed.includes(auth.role)) {
    return { path: '/', query: { denied: '1' } }
  }

  return true
})

export default router