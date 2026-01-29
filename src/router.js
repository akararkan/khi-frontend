import { createRouter, createWebHistory } from 'vue-router'

import Home from './components/pages/Home.vue'
import About from './components/pages/About.vue'
import Contact from './components/pages/Contact.vue'
import Services from './components/pages/Services.vue'
import Archive from './components/pages/Archive.vue'
import Library from './components/pages/Library.vue'
import Publishments from './components/pages/Publishments.vue'
import Projects from './components/pages/Projects.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/about', name: 'About', component: About },
  { path: '/contact', name: 'Contact', component: Contact },
  { path: '/services', name: 'Services', component: Services },
  { path: '/archive', name: 'Archive', component: Archive },
  { path: '/library', name: 'Library', component: Library },
  { path: '/publishments', name: 'Publishments', component: Publishments },
  { path: '/projects', name: 'Projects', component: Projects },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
