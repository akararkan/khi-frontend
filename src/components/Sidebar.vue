<template>
  <aside class="side" :class="{ 'side--slim': slim }">

    <!-- Brand -->
    <div class="brand">
      <div class="brand__gem" @click="slim && (slim = false)" :class="{ 'brand__gem--clickable': slim }">
        <span class="brand__gem-text">KHI</span>
      </div>
      <Transition name="fade">
        <div v-if="!slim" class="brand__copy">
          <div class="brand__title">داشبۆرد</div>
          <div class="brand__sub">ناوەندی کەلەپووری کوردی</div>
        </div>
      </Transition>
      <button v-if="!slim" class="brand__toggle" @click="slim = !slim" title="تەنگکردن">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M10 3L5 8l5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>

    <!-- ✅ Expand button — always visible in slim mode -->
    <button v-if="slim" class="expand-btn" @click="slim = false" title="فراوانکردن">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M6 3l5 5-5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>

    <!-- Main nav -->
    <nav class="nav">
      <RouterLink class="nav__item" to="/admin" exact-active-class="nav__item--on">
        <span class="nav__ico">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
        </span>
        <Transition name="fade"><span v-if="!slim" class="nav__label">سەرەکی</span></Transition>
      </RouterLink>

      <div v-if="!slim" class="nav__sep">ناوەڕۆک</div>
      <div v-else class="nav__sep-dot"></div>

      <!-- Projects -->
      <RouterLink
        class="nav__item"
        :to="{ name: 'AdminProjectList' }"
        :class="{ 'nav__item--on': isActive('projects') }"
        title="پڕۆژەکان"
      >
        <span class="nav__ico" v-html="SVGs.projects"></span>
        <Transition name="fade">
          <span v-if="!slim" class="nav__label">پڕۆژەکان</span>
        </Transition>
        <span v-if="!slim" class="nav__arrow">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M4.5 2.5L8 6l-3.5 3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </span>
      </RouterLink>

      <!-- News -->
      <RouterLink
        class="nav__item"
        :to="{ name: 'AdminNewsList' }"
        :class="{ 'nav__item--on': isActive('news') }"
        title="هەواڵەکان"
      >
        <span class="nav__ico" v-html="SVGs.news"></span>
        <Transition name="fade">
          <span v-if="!slim" class="nav__label">هەواڵەکان</span>
        </Transition>
        <span v-if="!slim" class="nav__arrow">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M4.5 2.5L8 6l-3.5 3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </span>
      </RouterLink>

      <!-- Publications Dropdown -->
      <div v-if="!slim">
        <button
          class="nav__item nav__item--dropdown"
          :class="{ 'nav__item--on': isPublicationsActive }"
          @click="publicationsOpen = !publicationsOpen"
        >
          <span class="nav__ico">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/>
              <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/>
            </svg>
          </span>
          <span class="nav__label">بڵاوکراوەکان</span>
          <span class="nav__chevron" :class="{ 'nav__chevron--open': publicationsOpen }">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M3 4.5l3 3 3-3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </span>
        </button>

        <Transition name="dropdown">
          <div v-if="publicationsOpen" class="nav__dropdown">
            <RouterLink
              v-for="item in publicationItems"
              :key="item.key"
              class="nav__subitem"
              :to="item.to"
              :class="{ 'nav__subitem--on': isActive(item.key) }"
              :title="item.label"
            >
              <span class="nav__subitem-ico" v-html="item.icon"></span>
              <span class="nav__subitem-label">{{ item.label }}</span>
            </RouterLink>
          </div>
        </Transition>
      </div>

      <!-- Slim mode: show publication items directly -->
      <template v-if="slim">
        <RouterLink
          v-for="item in publicationItems"
          :key="item.key"
          class="nav__item"
          :to="item.to"
          :class="{ 'nav__item--on': isActive(item.key) }"
          :title="item.label"
        >
          <span class="nav__ico" v-html="item.icon"></span>
        </RouterLink>
      </template>
    </nav>

    <!-- Footer -->
    <div class="foot">
      <div v-if="!slim" class="foot__role">
        <span class="foot__role-dot"></span>
        <span>{{ auth.role || 'ئەدمین' }}</span>
      </div>
      <button class="foot__logout" @click="doLogout" :title="slim ? 'چوونەدەرەوە' : ''">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
          <polyline points="16 17 21 12 16 7"/>
          <line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
        <Transition name="fade"><span v-if="!slim" class="nav__label">چوونەدەرەوە</span></Transition>
      </button>
    </div>

  </aside>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'

const router = useRouter()
const route  = useRoute()
const auth   = useAuthStore()
const slim   = ref(false)
const publicationsOpen = ref(true)

const SVGs = {
  projects: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>`,
  news:     `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 22h16a2 2 0 002-2V4a2 2 0 00-2-2H8a2 2 0 00-2 2v16a2 2 0 01-2 2zm0 0a2 2 0 01-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8M15 18h-5M10 6h8v4h-8z"/></svg>`,
  albums:   `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>`,
  images:   `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`,
  films:    `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="2"/><path d="M7 2v20M17 2v20M2 12h20M2 7h5M2 17h5M17 7h5M17 17h5"/></svg>`,
  sounds:   `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`,
  writings: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>`,
}

// ✅ All publication sub-items point to their dedicated routes
const publicationItems = [
  {
    key:   'albums',
    label: 'ئەلبوومی بیرەوەریەکان',
    to:    { name: 'AdminAlbumList' },
    icon:  SVGs.albums,
  },
  {
    key:   'image-collections',
    label: 'کۆمەڵە وێنەکان',
    to:    { name: 'AdminImageCollectionList' },
    icon:  SVGs.images,
  },
  {
    key:   'films',
    label: 'فیلمەکان',
    to:    { name: 'AdminFilmList' },
    icon:  SVGs.films,
  },
  {
    key:   'soundtracks',
    label: 'دەنگەکان',
    to:    { name: 'AdminSoundTrackList' },
    icon:  SVGs.sounds,
  },
  {
    key:   'writings',
    label: 'نووسراوەکان',
    to:    { name: 'AdminWritingList' },
    icon:  SVGs.writings,
  },
]

// Check if any publication item is active
const isPublicationsActive = computed(() => {
  return publicationItems.some(item => isActive(item.key))
})

// ✅ Comprehensive active-state detection for ALL dedicated routes
const isActive = (key) => {
  const currentName = route.name || ''
  const currentPath = route.path || ''

  const routeMap = {
    projects:            { names: ['AdminProjectList', 'AdminProjectCreate', 'AdminProjectEdit'],                         prefix: '/admin/projects' },
    news:                { names: ['AdminNewsList', 'AdminNewsCreate', 'AdminNewsEdit'],                                   prefix: '/admin/news' },
    'image-collections': { names: ['AdminImageCollectionList', 'AdminImageCollectionCreate', 'AdminImageCollectionEdit'],   prefix: '/admin/image-collections' },
    soundtracks:         { names: ['AdminSoundTrackList', 'AdminSoundTrackCreate', 'AdminSoundTrackEdit'],                 prefix: '/admin/soundtracks' },
    films:               { names: ['AdminFilmList', 'AdminFilmCreate', 'AdminFilmEdit'],                                   prefix: '/admin/films' },
    writings:            { names: ['AdminWritingList', 'AdminWritingCreate', 'AdminWritingEdit'],                           prefix: '/admin/writings' },
    albums:              { names: ['AdminAlbumList', 'AdminAlbumCreate', 'AdminAlbumEdit'],                                 prefix: '/admin/albums' },
  }

  const mapping = routeMap[key]
  if (mapping) {
    return mapping.names.includes(currentName) || currentPath.startsWith(mapping.prefix)
  }

  // Fallback for generic resource routes
  if (['AdminResourceList', 'AdminResourceCreate', 'AdminResourceEdit'].includes(currentName)) {
    return route.params.resource === key
  }

  return false
}

const doLogout = () => {
  auth.logout()
  router.push('/login')
}
</script>

<style scoped>
/* ✅ ORIGINAL crimson gradient background */
.side {
  width: 270px;
  flex: 0 0 270px;
  height: 100vh;
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  background: linear-gradient(170deg, #3D0808 0%, #7A1212 45%, #5A0E0E 100%);
  color: #fff;
  border-left: 1px solid rgba(255,255,255,.07);
  transition: width var(--transition), flex-basis var(--transition);
  overflow: hidden;
  z-index: 10;
}
.side--slim { width: 74px; flex: 0 0 74px; }

/* Brand */
.brand {
  display: flex;
  align-items: center;
  gap: .75rem;
  padding: 1.1rem 1rem 1rem;
  border-bottom: 1px solid rgba(255,255,255,.08);
  min-height: 70px;
}
.brand__gem {
  width: 42px; height: 42px; flex: 0 0 42px;
  border-radius: 13px;
  background: linear-gradient(135deg, rgba(254,221,0,.22) 0%, rgba(254,221,0,.08) 100%);
  border: 1px solid rgba(254,221,0,.35);
  box-shadow: 0 0 20px rgba(254,221,0,.15);
  display: flex; align-items: center; justify-content: center;
}
.brand__gem--clickable {
  cursor: pointer;
  transition: var(--transition);
}
.brand__gem--clickable:hover {
  box-shadow: 0 0 28px rgba(254,221,0,.3);
  border-color: rgba(254,221,0,.55);
}
.brand__gem-text {
  font-family: 'Playfair Display', serif;
  font-size: .85rem;
  font-weight: 900;
  color: var(--gold);
  letter-spacing: .04em;
}
.brand__copy { flex: 1; min-width: 0; }
.brand__title { font-weight: 700; font-size: .95rem; white-space: nowrap; }
.brand__sub {
  font-size: .72rem;
  opacity: .65;
  margin-top: .1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.brand__toggle {
  width: 32px; height: 32px; flex: 0 0 32px;
  border-radius: 10px;
  background: rgba(255,255,255,.06);
  border: 1px solid rgba(255,255,255,.1);
  color: rgba(255,255,255,.7);
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: var(--transition);
  margin-right: auto;
}
.brand__toggle:hover { background: rgba(255,255,255,.12); color: #fff; }

/* ✅ Expand button — sits below brand in slim mode, always visible */
.expand-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px; height: 38px;
  margin: .5rem auto .25rem;
  border-radius: 10px;
  background: rgba(255,255,255,.08);
  border: 1px solid rgba(255,255,255,.12);
  color: rgba(255,255,255,.7);
  cursor: pointer;
  transition: var(--transition);
}
.expand-btn:hover {
  background: rgba(254,221,0,.15);
  border-color: rgba(254,221,0,.35);
  color: #fff;
}

/* Nav */
.nav {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: .75rem .65rem;
  display: flex;
  flex-direction: column;
  gap: .25rem;
}
.nav::-webkit-scrollbar { width: 3px; }
.nav::-webkit-scrollbar-thumb { background: rgba(255,255,255,.12); }

.nav__sep {
  padding: .55rem .5rem .25rem;
  font-size: .7rem;
  font-weight: 700;
  opacity: .55;
  letter-spacing: .08em;
  text-transform: uppercase;
  white-space: nowrap;
}
.nav__sep-dot {
  height: 1px;
  background: rgba(255,255,255,.1);
  margin: .6rem .4rem;
}
.nav__item {
  display: flex;
  align-items: center;
  gap: .7rem;
  padding: .65rem .75rem;
  border-radius: var(--radius-sm);
  color: rgba(255,255,255,.78);
  text-decoration: none;
  border: 1px solid transparent;
  transition: var(--transition);
  position: relative;
  min-height: 44px;
  white-space: nowrap;
}
.nav__item--dropdown {
  background: none;
  cursor: pointer;
  font-family: inherit;
  font-size: inherit;
  width: 100%;
}
.nav__item:hover {
  background: rgba(255,255,255,.07);
  color: #fff;
  border-color: rgba(255,255,255,.1);
}
.nav__item--on {
  background: rgba(254,221,0,.13);
  border-color: rgba(254,221,0,.25);
  color: #fff;
  box-shadow: 0 4px 16px rgba(0,0,0,.2);
}
.nav__item--on::before {
  content: '';
  position: absolute;
  left: 0; top: 20%; bottom: 20%;
  width: 3px;
  background: var(--gold);
  border-radius: 99px;
}
.nav__ico {
  width: 34px; height: 34px; flex: 0 0 34px;
  border-radius: 9px;
  background: rgba(255,255,255,.08);
  border: 1px solid rgba(255,255,255,.1);
  display: flex; align-items: center; justify-content: center;
}
.nav__label { flex: 1; font-weight: 600; font-size: .9rem; }
.nav__arrow { opacity: .35; display: flex; align-items: center; }
.nav__item--on .nav__arrow { opacity: .7; }

.nav__chevron {
  opacity: .5;
  display: flex;
  align-items: center;
  transition: transform .25s ease;
}
.nav__chevron--open { transform: rotate(180deg); }

/* Dropdown */
.nav__dropdown {
  display: flex;
  flex-direction: column;
  gap: .15rem;
  padding: .35rem 0 .35rem 3rem;
  margin-top: .25rem;
}
.nav__subitem {
  display: flex;
  align-items: center;
  gap: .6rem;
  padding: .55rem .7rem;
  border-radius: var(--radius-sm);
  color: rgba(255,255,255,.65);
  text-decoration: none;
  border: 1px solid transparent;
  transition: var(--transition);
  font-size: .87rem;
  position: relative;
}
.nav__subitem:hover {
  background: rgba(255,255,255,.05);
  color: rgba(255,255,255,.9);
  border-color: rgba(255,255,255,.08);
}
.nav__subitem--on {
  background: rgba(254,221,0,.1);
  border-color: rgba(254,221,0,.18);
  color: #fff;
}
.nav__subitem--on::before {
  content: '';
  position: absolute;
  left: 0;
  top: 30%;
  bottom: 30%;
  width: 2px;
  background: var(--gold);
  border-radius: 99px;
}
.nav__subitem-ico {
  width: 28px;
  height: 28px;
  flex: 0 0 28px;
  border-radius: 7px;
  background: rgba(255,255,255,.06);
  border: 1px solid rgba(255,255,255,.08);
  display: flex;
  align-items: center;
  justify-content: center;
}
.nav__subitem-label {
  flex: 1;
  font-weight: 600;
  font-size: .85rem;
}

/* Dropdown transition */
.dropdown-enter-active {
  transition: all .3s ease;
  overflow: hidden;
}
.dropdown-leave-active {
  transition: all .25s ease;
  overflow: hidden;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-10px);
}
.dropdown-enter-to,
.dropdown-leave-from {
  opacity: 1;
  max-height: 500px;
  transform: translateY(0);
}

/* Footer */
.foot {
  padding: .85rem .65rem .85rem;
  border-top: 1px solid rgba(255,255,255,.08);
  display: flex;
  flex-direction: column;
  gap: .5rem;
}
.foot__role {
  display: flex;
  align-items: center;
  gap: .5rem;
  padding: .4rem .5rem;
  font-size: .8rem;
  opacity: .7;
  white-space: nowrap;
}
.foot__role-dot {
  width: 7px; height: 7px;
  border-radius: 50%;
  background: var(--gold);
  box-shadow: 0 0 0 3px rgba(254,221,0,.2);
  flex: 0 0 7px;
}
.foot__logout {
  display: flex;
  align-items: center;
  gap: .7rem;
  padding: .65rem .75rem;
  border-radius: var(--radius-sm);
  background: rgba(255,255,255,.05);
  border: 1px solid rgba(255,255,255,.08);
  color: rgba(255,255,255,.7);
  cursor: pointer;
  transition: var(--transition);
  min-height: 44px;
  white-space: nowrap;
}
.foot__logout:hover {
  background: rgba(200,30,30,.25);
  border-color: rgba(200,30,30,.4);
  color: #fff;
}

/* Transitions */
.fade-enter-active, .fade-leave-active { transition: opacity .15s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>