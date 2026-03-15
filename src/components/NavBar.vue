<template>
  <header class="site-header" :dir="lang.dir">
    <!-- Scroll Progress Indicator -->
    <div class="scroll-progress" :style="{ transform: `scaleX(${scrollProgress})` }" />

    <!-- MAIN NAVIGATION -->
    <nav 
      class="main-nav" 
      :class="{ 
        'is-scrolled': isScrolled, 
        'is-hidden': isNavHidden,
        'is-at-top': isAtTop 
      }"
    >
      <div class="main-nav__container">
        <!-- Logo (Image) -->
        <router-link to="/" class="main-nav__logo">
          <img
            src="@/assets/images/khi_logo.jpeg"
            alt="پەیمانگای کەلەپووری کوردی"
            class="main-nav__logo-img"
          />
        </router-link>

        <!-- Desktop Menu -->
        <ul class="main-nav__menu">
          <li v-for="item in menuItems" :key="item.path" class="main-nav__item">
            <router-link
              :to="item.path"
              class="main-nav__link"
              active-class="is-active"
              exact-active-class="is-exact-active"
            >
              {{ item.label }}
            </router-link>
          </li>
        </ul>

        <!-- ★ Library & Archive Buttons ★ -->
        <div class="featured-btns">
          <router-link to="/library" class="featured-btn featured-btn--library">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
            </svg>
            <span>{{ lang.t('nav.library') }}</span>
          </router-link>
          <router-link to="/archive" class="featured-btn featured-btn--archive">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect width="20" height="5" x="2" y="3" rx="1"/>
              <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/>
              <path d="M10 12h4"/>
            </svg>
            <span>{{ lang.t('nav.archive') }}</span>
          </router-link>
        </div>

        <!-- Right Actions -->
        <div class="main-nav__actions">
          <!-- Search Button -->
          <button class="main-nav__search-btn" @click="openSearch" :aria-label="lang.t('nav.search')">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </svg>
          </button>

          <!-- Logged in: user menu -->
          <div v-if="authStore.isAuthenticated" class="user-menu" ref="userMenuRef">
            <button class="user-menu__trigger" @click="toggleUserMenu" :aria-expanded="userMenuOpen">
              <div class="user-menu__avatar">
                <img
                  v-if="authStore.profileImage && !avatarError"
                  :src="authStore.profileImage"
                  :key="authStore.profileImage"
                  :alt="authStore.username"
                  class="user-menu__avatar-img"
                  @error="avatarError = true"
                />
                <span v-else>{{ authStore.username?.charAt(0)?.toUpperCase() || 'K' }}</span>
              </div>
              <span class="user-menu__name">{{ authStore.username }}</span>
              <svg class="user-menu__chevron" :class="{ 'is-rotated': userMenuOpen }"
                xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" stroke-width="2">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
            <Transition name="dropdown">
              <div class="user-dropdown" v-show="userMenuOpen">
                <div class="user-dropdown__info">
                  <div class="user-dropdown__avatar-lg">
                    <img
                      v-if="authStore.profileImage && !avatarError"
                      :src="authStore.profileImage"
                      :key="authStore.profileImage"
                      :alt="authStore.username"
                      class="user-dropdown__avatar-img"
                      @error="avatarError = true"
                    />
                    <span v-else>{{ authStore.username?.charAt(0)?.toUpperCase() || 'K' }}</span>
                  </div>
                  <div class="user-dropdown__info-text">
                    <span class="user-dropdown__username">{{ authStore.username }}</span>
                    <span class="user-dropdown__role">{{ getRoleLabel(authStore.role) }}</span>
                  </div>
                </div>
                <div class="user-dropdown__divider"></div>
                <router-link to="/profile" class="user-dropdown__item" @click="userMenuOpen = false">
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  <span>پرۆفایل</span>
                  <span class="user-dropdown__item-badge">دەستکاری</span>
                </router-link>
                <router-link
                  v-if="authStore.hasAdminAccess"
                  to="/admin"
                  class="user-dropdown__item"
                  @click="userMenuOpen = false"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="3" width="7" height="7" rx="1"/>
                    <rect x="14" y="3" width="7" height="7" rx="1"/>
                    <rect x="14" y="14" width="7" height="7" rx="1"/>
                    <rect x="3" y="14" width="7" height="7" rx="1"/>
                  </svg>
                  <span>{{ lang.t('nav.dashboard') }}</span>
                </router-link>
                <div class="user-dropdown__divider"></div>
                <button class="user-dropdown__item user-dropdown__item--danger" @click="handleLogout">
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16 17 21 12 16 7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                  <span>{{ lang.t('nav.logout') }}</span>
                </button>
              </div>
            </Transition>
          </div>

          <!-- Not logged in -->
          <router-link v-else to="/login" class="login-btn" :aria-label="lang.t('nav.login')">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" stroke-width="2">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
              <polyline points="10 17 15 12 10 7"/>
              <line x1="15" y1="12" x2="3" y2="12"/>
            </svg>
            <span class="login-btn__text">{{ lang.t('nav.login') }}</span>
          </router-link>

          <!-- ── Language Switcher ── -->
          <div class="lang-switcher" ref="langSwitcherRef">
            <button class="lang-switcher__trigger" @click="toggleLangMenu" :aria-expanded="langMenuOpen">
              <div class="lang-switcher__flag">
                <svg viewBox="0 0 36 24" xmlns="http://www.w3.org/2000/svg">
                  <rect width="36" height="8" fill="#ED2939"/>
                  <rect y="8" width="36" height="8" fill="#FFFFFF"/>
                  <rect y="16" width="36" height="8" fill="#00A651"/>
                  <circle cx="18" cy="12" r="4" fill="#FEDD00"/>
                  <g fill="#FEDD00">
                    <polygon points="18,4 18.7,6 17.3,6"/>
                    <polygon points="18,20 18.7,18 17.3,18"/>
                    <polygon points="10,12 12,12.7 12,11.3"/>
                    <polygon points="26,12 24,12.7 24,11.3"/>
                    <polygon points="12,6 13.5,7.8 12.3,8.3"/>
                    <polygon points="24,18 22.5,16.2 23.7,15.7"/>
                    <polygon points="24,6 22.5,7.8 23.7,8.3"/>
                    <polygon points="12,18 13.5,16.2 12.3,15.7"/>
                  </g>
                </svg>
              </div>
              <span class="lang-switcher__text">{{ lang.strings.shortName }}</span>
              <svg class="lang-switcher__chevron" :class="{ 'is-rotated': langMenuOpen }"
                xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" stroke-width="2">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
            <Transition name="dropdown">
              <div class="lang-dropdown" v-show="langMenuOpen">
                <div class="lang-dropdown__header">{{ lang.t('nav.language') }}</div>
                <button
                  v-for="dialect in dialects" :key="dialect.code"
                  class="lang-dropdown__item"
                  :class="{ 'is-active': lang.activeLang === dialect.code }"
                  @click="selectDialect(dialect.code)"
                >
                  <div class="lang-dropdown__info">
                    <span class="lang-dropdown__name">{{ dialect.name }}</span>
                    <span class="lang-dropdown__desc">{{ dialect.description }}</span>
                  </div>
                  <svg v-if="lang.activeLang === dialect.code" class="lang-dropdown__check"
                    xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" stroke-width="2.5">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </button>
              </div>
            </Transition>
          </div>

          <!-- Mobile Toggle -->
          <button class="mobile-toggle" @click="toggleMobileMenu" :aria-expanded="mobileMenuOpen" aria-label="مێنیو">
            <span class="hamburger" :class="{ 'is-active': mobileMenuOpen }">
              <span></span><span></span><span></span>
            </span>
          </button>
        </div>
      </div>
    </nav>

    <!-- SEARCH OVERLAY -->
    <Transition name="search-fade">
      <div class="search-overlay" v-show="searchOpen" @click.self="closeSearch">
        <div class="search-overlay__content">
          <button class="search-overlay__close" @click="closeSearch" :aria-label="lang.t('ui.close')">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
          <h2 class="search-overlay__title">{{ lang.t('search.title') }}</h2>
          <div class="search-overlay__form">
            <input
              ref="searchInputRef"
              type="text"
              class="search-overlay__input"
              :placeholder="lang.t('search.placeholder')"
              v-model="searchQuery"
              @input="onSearchInput"
              @keyup.enter="performSearch"
              @keyup.escape="closeSearch"
            />
            <button class="search-overlay__submit" @click="performSearch" :aria-label="lang.t('nav.search')">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </svg>
            </button>
          </div>

          <!-- Live Search Results -->
          <div class="search-results" v-if="searchQuery.trim().length >= 2">
            <div v-if="searchLoading" class="search-results__loading">
              <span class="search-spinner"></span>
            </div>
            <div v-else-if="searchResults.length" class="search-results__list">
              <button
                v-for="(result, idx) in searchResults.slice(0, 8)"
                :key="`${result._type}-${result.id}-${idx}`"
                class="search-result-item"
                @click="goToResult(result)"
              >
                <span class="search-result-item__icon">{{ result._icon }}</span>
                <div class="search-result-item__info">
                  <span class="search-result-item__title">{{ result._title }}</span>
                  <span class="search-result-item__meta">{{ result._typeName }}</span>
                </div>
                <svg class="search-result-item__arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
            </div>
            <div v-else class="search-results__empty">
              {{ lang.activeLang === 'CKB' ? 'هیچ ئەنجامێک نەدۆزرایەوە' : 'Encam nehat dîtin' }}
            </div>
          </div>
          <div class="search-overlay__quick">
            <span class="search-overlay__quick-label">{{ lang.t('search.quickLabel') }}</span>
            <router-link to="/library" class="search-overlay__quick-link" @click="closeSearch">{{ lang.t('nav.library') }}</router-link>
            <router-link to="/archive" class="search-overlay__quick-link" @click="closeSearch">{{ lang.t('nav.archive') }}</router-link>
            <router-link to="/publishments" class="search-overlay__quick-link" @click="closeSearch">{{ lang.t('nav.publishments') }}</router-link>
            <router-link to="/projects" class="search-overlay__quick-link" @click="closeSearch">{{ lang.t('nav.projects') }}</router-link>
          </div>
        </div>
      </div>
    </Transition>

    <!-- MOBILE MENU -->
    <Transition name="mobile-slide">
      <div class="mobile-menu" v-show="mobileMenuOpen">
        <div class="mobile-menu__overlay" @click="closeMobileMenu"></div>
        <div class="mobile-menu__drawer">
          <div class="mobile-menu__header">
            <img
              src="@/assets/images/khi_logo.jpeg"
              alt="پەیمانگای کەلەپووری کوردی"
              class="mobile-menu__logo-img"
            />
            <button class="mobile-menu__close" @click="closeMobileMenu" :aria-label="lang.t('ui.close')">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="mobile-menu__search">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </svg>
            <input type="text" :placeholder="lang.t('nav.searchPlaceholder')" v-model="searchQuery" @keyup.enter="performSearch" />
          </div>

          <!-- ★ Mobile Library & Archive Buttons ★ -->
          <div class="mobile-menu__featured">
            <router-link to="/library" class="mobile-featured-btn mobile-featured-btn--library" @click="closeMobileMenu">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
              </svg>
              <span class="mobile-featured-btn__label">{{ lang.t('nav.library') }}</span>
              <span class="mobile-featured-btn__arrow">←</span>
            </router-link>
            <router-link to="/archive" class="mobile-featured-btn mobile-featured-btn--archive" @click="closeMobileMenu">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect width="20" height="5" x="2" y="3" rx="1"/>
                <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/>
                <path d="M10 12h4"/>
              </svg>
              <span class="mobile-featured-btn__label">{{ lang.t('nav.archive') }}</span>
              <span class="mobile-featured-btn__arrow">←</span>
            </router-link>
          </div>

          <nav class="mobile-menu__nav">
            <router-link v-for="item in menuItems" :key="item.path" :to="item.path" class="mobile-menu__link" @click="closeMobileMenu">
              {{ item.label }}
            </router-link>
          </nav>

          <!-- Mobile Auth -->
          <div class="mobile-menu__auth">
            <template v-if="authStore.isAuthenticated">
              <div class="mobile-menu__user-info">
                <div class="mobile-menu__user-avatar">
                  <img
                    v-if="authStore.profileImage && !avatarError"
                    :src="authStore.profileImage"
                    :key="authStore.profileImage"
                    :alt="authStore.username"
                    class="mobile-menu__user-avatar-img"
                    @error="avatarError = true"
                  />
                  <span v-else>{{ authStore.username?.charAt(0)?.toUpperCase() || 'K' }}</span>
                </div>
                <div>
                  <p class="mobile-menu__user-name">{{ authStore.username }}</p>
                  <p class="mobile-menu__user-role">{{ getRoleLabel(authStore.role) }}</p>
                </div>
              </div>
              <div class="mobile-menu__auth-btns">
                <router-link to="/profile" class="mobile-menu__auth-btn mobile-menu__auth-btn--profile" @click="closeMobileMenu">
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  پرۆفایل
                </router-link>
                <router-link
                  v-if="authStore.hasAdminAccess"
                  to="/admin"
                  class="mobile-menu__auth-btn mobile-menu__auth-btn--secondary"
                  @click="closeMobileMenu"
                >
                  {{ lang.t('nav.dashboard') }}
                </router-link>
                <button class="mobile-menu__auth-btn mobile-menu__auth-btn--danger" @click="handleLogout">
                  {{ lang.t('nav.logout') }}
                </button>
              </div>
            </template>
            <router-link v-else to="/login" class="mobile-menu__auth-btn mobile-menu__auth-btn--primary" @click="closeMobileMenu">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" stroke-width="2">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                <polyline points="10 17 15 12 10 7"/>
                <line x1="15" y1="12" x2="3" y2="12"/>
              </svg>
              {{ lang.t('nav.login') }}
            </router-link>
          </div>

          <!-- Mobile Language -->
          <div class="mobile-menu__lang">
            <span class="mobile-menu__lang-title">{{ lang.t('nav.language') }}</span>
            <div class="mobile-menu__lang-btns">
              <button
                v-for="dialect in dialects" :key="dialect.code"
                class="mobile-menu__lang-btn"
                :class="{ 'is-active': lang.activeLang === dialect.code }"
                @click="selectDialect(dialect.code)"
              >
                {{ dialect.shortName }}
              </button>
            </div>
          </div>

          <div class="mobile-menu__quick">
            <router-link to="/students" @click="closeMobileMenu">{{ lang.t('mobile.students') }}</router-link>
            <router-link to="/researchers" @click="closeMobileMenu">{{ lang.t('mobile.researchers') }}</router-link>
            <router-link to="/visitors" @click="closeMobileMenu">{{ lang.t('mobile.visitors') }}</router-link>
            <router-link to="/partners" @click="closeMobileMenu">{{ lang.t('mobile.partners') }}</router-link>
          </div>
        </div>
      </div>
    </Transition>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'
import { useLanguageStore } from '@/stores/useLanguageStore'
import axios from 'axios'
import { API_BASE_URL } from './consts.js'

const router    = useRouter()
const authStore = useAuthStore()
const lang      = useLanguageStore()

const api = axios.create({ baseURL: API_BASE_URL, timeout: 12000 })

// ── State ──────────────────────────────────────────────────────────
const searchQuery     = ref('')
const searchOpen      = ref(false)
const searchInputRef  = ref(null)
const langMenuOpen    = ref(false)
const langSwitcherRef = ref(null)
const mobileMenuOpen  = ref(false)
const isScrolled      = ref(false)
const isNavHidden     = ref(false)
const isAtTop         = ref(true)
const lastScrollY     = ref(0)
const scrollProgress  = ref(0)
const userMenuOpen    = ref(false)
const userMenuRef     = ref(null)

// New: Track scroll-up amount for smart reveal
const scrollUpStartY  = ref(0)
const scrollUpThreshold = 40 // px - navbar reveals after scrolling up this amount

const avatarError = ref(false)
watch(() => authStore.profileImage, () => { avatarError.value = false })

// ── Live Search State ────────────────────────────────────────────
const searchResults = ref([])
const searchLoading = ref(false)
const searchCache = ref({ sounds: [], videos: [], writings: [], images: [], news: [], projects: [] })
let searchDebounce = null

async function loadSearchData() {
  if (searchCache.value.sounds.length || searchCache.value.videos.length) return
  try {
    const [s, v, w, i, n, p] = await Promise.allSettled([
      api.get('/soundtracks'),
      api.get('/videos', { params: { page: 0, size: 200 } }),
      api.get('/writings', { params: { page: 0, size: 200 } }),
      api.get('/image-collections'),
      api.get('/news'),
      api.get('/projects/getAll', { params: { page: 0, size: 50 } })
    ])
    if (s.status === 'fulfilled') { const d = s.value.data; searchCache.value.sounds = Array.isArray(d) ? d : d?.data || [] }
    if (v.status === 'fulfilled') { const d = v.value.data; searchCache.value.videos = d?.content || d?.data?.content || [] }
    if (w.status === 'fulfilled') { const d = w.value.data; searchCache.value.writings = d?.data?.content || d?.content || [] }
    if (i.status === 'fulfilled') { const d = i.value.data; searchCache.value.images = d?.data || d || [] }
    if (n.status === 'fulfilled') { searchCache.value.news = n.value.data?.data || n.value.data || [] }
    if (p.status === 'fulfilled') { const d = p.value.data; searchCache.value.projects = d?.data?.content || d?.content || [] }
  } catch (e) { console.warn('Search data load error:', e.message) }
}

function getTitle(item) {
  const c = lang.activeLang === 'CKB'
  return (c ? item.ckbContent?.title : item.kmrContent?.title) || (c ? item.kmrContent?.title : item.ckbContent?.title) || ''
}
function getDesc(item) {
  const c = lang.activeLang === 'CKB'
  return (c ? item.ckbContent?.description : item.kmrContent?.description) || (c ? item.kmrContent?.description : item.ckbContent?.description) || ''
}

function searchInItem(item, q) {
  const title = getTitle(item).toLowerCase()
  const desc = getDesc(item).toLowerCase()
  const tags = [...(item.tagsCkb || []), ...(item.tagsKmr || []), ...(item.tags?.ckb || []), ...(item.tags?.kmr || [])].join(' ').toLowerCase()
  const keywords = [...(item.keywordsCkb || []), ...(item.keywordsKmr || []), ...(item.keywords?.ckb || []), ...(item.keywords?.kmr || [])].join(' ').toLowerCase()
  const writer = (item.ckbContent?.writer || item.kmrContent?.writer || '').toLowerCase()
  const director = (item.ckbContent?.director || item.kmrContent?.director || item.director || '').toLowerCase()
  return title.includes(q) || desc.includes(q) || tags.includes(q) || keywords.includes(q) || writer.includes(q) || director.includes(q)
}

function runSearch(q) {
  if (!q || q.length < 2) { searchResults.value = []; return }
  const al = lang.activeLang === 'CKB'
  const typeName = (ckb, kmr) => al ? ckb : kmr
  const results = []
  
  searchCache.value.videos.forEach(item => {
    if (searchInItem(item, q)) results.push({ ...item, _type: 'video', _icon: '🎬', _title: getTitle(item), _typeName: typeName('ڤیدیۆ', 'Vîdyo') })
  })
  searchCache.value.sounds.forEach(item => {
    if (searchInItem(item, q)) results.push({ ...item, _type: 'sound', _icon: '🎵', _title: getTitle(item), _typeName: typeName('دەنگ', 'Deng') })
  })
  searchCache.value.writings.forEach(item => {
    if (searchInItem(item, q)) results.push({ ...item, _type: 'writing', _icon: '📚', _title: getTitle(item), _typeName: typeName('نووسین', 'Nivîsar') })
  })
  searchCache.value.images.forEach(item => {
    if (searchInItem(item, q)) results.push({ ...item, _type: 'image', _icon: '🖼️', _title: getTitle(item), _typeName: typeName('وێنە', 'Wêne') })
  })
  searchCache.value.news.forEach(item => {
    if (searchInItem(item, q)) results.push({ ...item, _type: 'news', _icon: '📰', _title: getTitle(item), _typeName: typeName('هەواڵ', 'Nûçe') })
  })
  searchCache.value.projects.forEach(item => {
    if (searchInItem(item, q)) results.push({ ...item, _type: 'project', _icon: '📂', _title: getTitle(item), _typeName: typeName('پڕۆژە', 'Proje') })
  })
  
  searchResults.value = results
}

function onSearchInput() {
  clearTimeout(searchDebounce)
  searchDebounce = setTimeout(() => {
    const q = searchQuery.value.trim().toLowerCase()
    if (q.length < 2) { searchResults.value = []; return }
    searchLoading.value = true
    loadSearchData().then(() => {
      runSearch(q)
      searchLoading.value = false
    })
  }, 300)
}

function goToResult(result) {
  closeSearch()
  closeMobileMenu()
  if (result._type === 'project') {
    router.push('/projects')
  } else if (result._type === 'news') {
    router.push('/')
    nextTick(() => document.getElementById('news')?.scrollIntoView({ behavior: 'smooth' }))
  } else {
    router.push('/publishments')
  }
}

// ── Role display label ────────────────────────────────────────────
function getRoleLabel(role) {
  const map = {
    GUEST:       'میوان',
    EMPLOYEE:    'فەرمانبەر',
    ADMIN:       'بەرپرس',
    SUPER_ADMIN: 'بەرپڕسی باڵا',
  }
  return map[role] || role || ''
}

// ── Dialect list ──────────────────────────────────────────────────
const dialects = [
  { code: 'CKB', name: 'کوردی (سۆرانی)', shortName: 'کوردی', description: 'کوردی ناوەندی' },
  { code: 'KMR', name: 'Kurdî (Kurmancî)', shortName: 'Kurdî', description: 'Kurdiya Bakur' },
]

// ── Menu items ──
const menuItems = computed(() => [
  { path: '/',             label: lang.t('nav.home') },
  { path: '/projects',     label: lang.t('nav.projects') },
  { path: '/publishments', label: lang.t('nav.publishments') },
  { path: '/services',     label: lang.t('nav.services') },
  { path: '/about',        label: lang.t('nav.about') },
  { path: '/contact',      label: lang.t('nav.contact') },
])

// ── Smart Scroll Logic with Up-Threshold ───────────────────────────
let ticking = false

function handleScroll() {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      const currentScrollY = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      
      // Calculate scroll progress (0 to 1)
      scrollProgress.value = docHeight > 0 ? currentScrollY / docHeight : 0
      
      // Determine scroll direction
      const scrollingDown = currentScrollY > lastScrollY.value
      const hideThreshold = 100 // Min scroll before hiding starts
      
      // Update basic states
      isAtTop.value = currentScrollY < 10
      isScrolled.value = currentScrollY > 10
      
      // Smart hide/show logic with threshold for scrolling up:
      if (currentScrollY < hideThreshold) {
        // Always show when near top
        isNavHidden.value = false
        scrollUpStartY.value = 0 // Reset tracking
      } else if (!mobileMenuOpen.value) {
        if (scrollingDown) {
          // Scrolling down: Hide navbar (with small buffer)
          if (currentScrollY > lastScrollY.value + 5) {
            isNavHidden.value = true
            scrollUpStartY.value = currentScrollY // Mark where we started hiding
          }
        } else {
          // Scrolling up: Only show after scrolling up by threshold amount
          if (isNavHidden.value) {
            const scrolledUpAmount = scrollUpStartY.value - currentScrollY
            if (scrolledUpAmount > scrollUpThreshold) {
              isNavHidden.value = false
              scrollUpStartY.value = 0 // Reset
            }
          }
        }
      }
      
      lastScrollY.value = currentScrollY
      ticking = false
    })
    ticking = true
  }
}

// ── Language ──────────────────────────────────────────────────────
function selectDialect(code) { lang.setLanguage(code); langMenuOpen.value = false }
function toggleLangMenu()    { langMenuOpen.value = !langMenuOpen.value }

// ── Auth ──────────────────────────────────────────────────────────
function toggleUserMenu() { userMenuOpen.value = !userMenuOpen.value }
async function handleLogout() {
  userMenuOpen.value = false
  closeMobileMenu()
  await authStore.logout()
  window.location.href = '/login?logout=1'
}

// ── Search ────────────────────────────────────────────────────────
function openSearch() {
  searchOpen.value = true
  document.body.style.overflow = 'hidden'
  nextTick(() => searchInputRef.value?.focus())
  loadSearchData()
}
function closeSearch() {
  searchOpen.value = false
  searchQuery.value = ''
  searchResults.value = []
  document.body.style.overflow = ''
}
function performSearch() {
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.trim().toLowerCase()
    searchLoading.value = true
    loadSearchData().then(() => {
      runSearch(q)
      searchLoading.value = false
      if (searchResults.value.length === 1) {
        goToResult(searchResults.value[0])
      }
    })
  }
}

// ── Mobile ────────────────────────────────────────────────────────
function toggleMobileMenu() {
  mobileMenuOpen.value = !mobileMenuOpen.value
  document.body.style.overflow = mobileMenuOpen.value ? 'hidden' : ''
  // When opening mobile menu, ensure nav is visible
  if (mobileMenuOpen.value) {
    isNavHidden.value = false
  }
}
function closeMobileMenu() {
  mobileMenuOpen.value = false
  document.body.style.overflow = ''
}

// ── Click outside ─────────────────────────────────────────────────
function handleClickOutside(e) {
  if (langSwitcherRef.value && !langSwitcherRef.value.contains(e.target)) langMenuOpen.value = false
  if (userMenuRef.value    && !userMenuRef.value.contains(e.target))    userMenuOpen.value = false
}

// ── Keyboard ──────────────────────────────────────────────────────
function handleKeydown(e) {
  if (e.key === 'Escape') {
    if (searchOpen.value)     closeSearch()
    if (mobileMenuOpen.value) closeMobileMenu()
    langMenuOpen.value = false
    userMenuOpen.value = false
  }
}

// ── Lifecycle ─────────────────────────────────────────────────────
onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleKeydown)
  // Initial check
  handleScroll()
})
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleKeydown)
  if (searchDebounce) clearTimeout(searchDebounce)
})
watch(() => router.currentRoute.value, () => {
  closeMobileMenu()
  userMenuOpen.value = false
})
</script>

<style scoped>
/* ─── CSS CUSTOM PROPERTIES ─────────────────────────────────────── */
.site-header {
  --brand-primary: #8C1515;
  --brand-primary-light: #B83A4B;
  --brand-primary-dark: #6B0F0F;
  --brand-gold: #C6922A;
  --brand-gold-light: #E8B84B;
  --brand-gold-dark: #9E7420;
  --brand-teal: #0D7377;
  --brand-teal-light: #14A3A8;
  --brand-teal-dark: #095456;
  --white: #FFFFFF;
  --black: #1A1A1A;
  --grey-900: #2E2D29;
  --grey-700: #53565A;
  --grey-500: #767674;
  --grey-300: #C0C0BF;
  --grey-200: #D5D5D4;
  --grey-100: #EAEAEA;
  --grey-50: #F7F7F7;
  --font-sans: 'Noto Sans Arabic', 'Source Sans 3', system-ui, sans-serif;
  --font-display: 'Noto Kufi Arabic', 'Source Serif 4', Georgia, serif;
  --transition-fast: 150ms ease;
  --transition-normal: 300ms ease;
  --transition-slow: 400ms ease;
  --shadow-sm: 0 1px 3px rgba(0,0,0,.08);
  --shadow-md: 0 4px 12px rgba(0,0,0,.10);
  --shadow-lg: 0 12px 32px rgba(0,0,0,.15);
  --shadow-xl: 0 24px 48px rgba(0,0,0,.20);
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 14px;
  --container-max: 1500px;
}

/* ─── SCROLL PROGRESS BAR ───────────────────────────────────────── */
.scroll-progress {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, var(--brand-primary), var(--brand-gold));
  transform-origin: left;
  z-index: 1001;
  transition: transform 0.1s linear;
}

/* ─── MAIN NAV ──────────────────────────────────────────────────── */
.main-nav {
  background: linear-gradient(180deg, var(--white) 0%, #FAFAF9 100%);
  border-bottom: 2px solid var(--grey-100);
  position: sticky;
  top: 0;
  z-index: 100;
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1),
              background-color 0.3s ease,
              box-shadow 0.3s ease,
              border-color 0.3s ease;
  will-change: transform;
}

/* Scrolled State */
.main-nav.is-scrolled {
  box-shadow: 0 4px 24px rgba(140, 21, 21, .08), 0 1px 4px rgba(0,0,0,.06);
  border-bottom-color: transparent;
  background: rgba(255, 255, 255, .98);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

/* Hidden State (Smart Scroll) */
.main-nav.is-hidden {
  transform: translateY(-100%);
}

/* At Top State (Additional transparency when at hero section) */
.main-nav.is-at-top {
  background: linear-gradient(180deg, var(--white) 0%, rgba(255,255,255,0.95) 100%);
}

.main-nav__container {
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  height: 72px;
}
@media (min-width: 768px)  { .main-nav__container { padding: 0 2rem; height: 78px; } }
@media (min-width: 1024px) { .main-nav__container { padding: 0 3rem; height: 84px; } }

/* ─── LOGO (IMAGE) ──────────────────────────────────────────────── */
.main-nav__logo {
  display: flex;
  align-items: center;
  text-decoration: none;
  flex-shrink: 0;
  transition: all var(--transition-fast);
  position: relative;
  z-index: 2;
}
.main-nav__logo:hover {
  opacity: .88;
  transform: scale(1.02);
}
.main-nav__logo-img {
  height: 46px;
  width: auto;
  object-fit: contain;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.05));
  transition: height 0.3s ease;
}
.main-nav.is-scrolled .main-nav__logo-img {
  height: 42px;
}
@media (min-width: 768px)  { 
  .main-nav__logo-img { height: 52px; }
  .main-nav.is-scrolled .main-nav__logo-img { height: 48px; }
}
@media (min-width: 1280px) { 
  .main-nav__logo-img { height: 58px; }
  .main-nav.is-scrolled .main-nav__logo-img { height: 52px; }
}

/* ─── DESKTOP MENU ──────────────────────────────────────────────── */
.main-nav__menu {
  display: none;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: .125rem;
  flex: 1;
  justify-content: center;
}
@media (min-width: 1024px) { .main-nav__menu { display: flex; } }

.main-nav__link {
  display: block;
  padding: .625rem 1rem;
  font-family: var(--font-sans);
  font-size: .9375rem;
  font-weight: 600;
  color: var(--grey-900);
  text-decoration: none;
  border-radius: var(--radius-sm);
  position: relative;
  transition: all var(--transition-fast);
}
@media (min-width: 1280px) { .main-nav__link { padding: .625rem 1.125rem; font-size: 1rem; } }

.main-nav__link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  right: .5rem;
  left: .5rem;
  height: 3px;
  background: linear-gradient(90deg, var(--brand-primary), var(--brand-primary-light));
  border-radius: 3px 3px 0 0;
  transform: scaleX(0);
  transition: transform var(--transition-normal) cubic-bezier(.16, 1, .3, 1);
}
.main-nav__link:hover {
  color: var(--brand-primary);
  background-color: rgba(140, 21, 21, .04);
}
.main-nav__link:hover::after,
.main-nav__link.is-active::after,
.main-nav__link.is-exact-active::after {
  transform: scaleX(1);
}
.main-nav__link.is-active,
.main-nav__link.is-exact-active {
  color: var(--brand-primary);
  font-weight: 700;
}

/* ─── ★ FEATURED BUTTONS (Library & Archive) ★ ──────────────────── */
.featured-btns {
  display: none;
  align-items: center;
  gap: .625rem;
}
@media (min-width: 1024px) { .featured-btns { display: flex; } }

.featured-btn {
  display: flex;
  align-items: center;
  gap: .5rem;
  padding: .5rem 1.125rem;
  border-radius: var(--radius-md);
  font-family: var(--font-sans);
  font-size: .875rem;
  font-weight: 700;
  text-decoration: none;
  white-space: nowrap;
  transition: all .3s cubic-bezier(.16, 1, .3, 1);
  position: relative;
  overflow: hidden;
}
.featured-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity .3s ease;
  border-radius: inherit;
  z-index: 0;
}
.featured-btn:hover::before {
  opacity: 1;
}
.featured-btn svg,
.featured-btn span {
  position: relative;
  z-index: 1;
}
.featured-btn:hover {
  transform: translateY(-2px);
}
.featured-btn:active {
  transform: translateY(0);
}

/* Library Button — Warm gold/amber */
.featured-btn--library {
  background: linear-gradient(135deg, #C6922A 0%, #E8B84B 100%);
  color: #fff;
  box-shadow: 0 3px 12px rgba(198, 146, 42, .35), inset 0 1px 0 rgba(255,255,255,.2);
}
.featured-btn--library::before {
  background: linear-gradient(135deg, #B58425 0%, #D4A63F 100%);
}
.featured-btn--library:hover {
  box-shadow: 0 6px 20px rgba(198, 146, 42, .45), inset 0 1px 0 rgba(255,255,255,.25);
}

/* Archive Button — Deep teal */
.featured-btn--archive {
  background: linear-gradient(135deg, #0D7377 0%, #14A3A8 100%);
  color: #fff;
  box-shadow: 0 3px 12px rgba(13, 115, 119, .35), inset 0 1px 0 rgba(255,255,255,.15);
}
.featured-btn--archive::before {
  background: linear-gradient(135deg, #0A5F62 0%, #118F93 100%);
}
.featured-btn--archive:hover {
  box-shadow: 0 6px 20px rgba(13, 115, 119, .45), inset 0 1px 0 rgba(255,255,255,.2);
}

/* ─── ACTIONS ───────────────────────────────────────────────────── */
.main-nav__actions {
  display: flex;
  align-items: center;
  gap: .625rem;
  flex-shrink: 0;
}
@media (min-width: 768px) { .main-nav__actions { gap: .875rem; } }

.main-nav__search-btn {
  display: none;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  background: var(--grey-50);
  border: 1.5px solid var(--grey-200);
  border-radius: var(--radius-md);
  color: var(--grey-700);
  cursor: pointer;
  transition: all .3s cubic-bezier(.16, 1, .3, 1);
}
@media (min-width: 768px) { .main-nav__search-btn { display: flex; } }
.main-nav__search-btn:hover {
  background: var(--brand-primary);
  border-color: var(--brand-primary);
  color: var(--white);
  transform: translateY(-2px);
  box-shadow: 0 4px 14px rgba(140, 21, 21, .3);
}

/* ─── MOBILE TOGGLE ─────────────────────────────────────────────── */
.mobile-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: transparent;
  border: none;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}
@media (min-width: 1024px) { .mobile-toggle { display: none; } }

.hamburger {
  width: 22px;
  height: 16px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.hamburger span {
  display: block;
  width: 100%;
  height: 2.5px;
  background-color: var(--grey-900);
  border-radius: 2px;
  transition: all var(--transition-normal);
  transform-origin: center;
}
.hamburger span:nth-child(3) { width: 70%; margin-right: auto; }
[dir="ltr"] .hamburger span:nth-child(3) { margin-right: 0; margin-left: auto; }
.hamburger.is-active span:nth-child(1) { transform: translateY(7px) rotate(45deg); background-color: var(--brand-primary); }
.hamburger.is-active span:nth-child(2) { opacity: 0; transform: scaleX(0); }
.hamburger.is-active span:nth-child(3) { width: 100%; transform: translateY(-7px) rotate(-45deg); background-color: var(--brand-primary); }

/* ─── LOGIN BUTTON ──────────────────────────────────────────────── */
.login-btn {
  display: none;
  align-items: center;
  gap: .5rem;
  padding: .5rem 1.25rem;
  background: linear-gradient(135deg, var(--brand-primary) 0%, var(--brand-primary-light) 100%);
  color: var(--white);
  border-radius: var(--radius-md);
  text-decoration: none;
  font-family: var(--font-sans);
  font-size: .875rem;
  font-weight: 700;
  transition: all .3s cubic-bezier(.16, 1, .3, 1);
  white-space: nowrap;
  box-shadow: 0 3px 12px rgba(140, 21, 21, .3);
}
@media (min-width: 768px) { .login-btn { display: flex; } }
.login-btn:hover {
  background: linear-gradient(135deg, var(--brand-primary-dark) 0%, var(--brand-primary) 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(140, 21, 21, .4);
}
.login-btn:active { transform: translateY(0); }
@media (max-width: 1023px) { .login-btn__text { display: none; } }

/* ─── USER MENU ─────────────────────────────────────────────────── */
.user-menu { display: none; position: relative; }
@media (min-width: 768px) { .user-menu { display: block; } }

.user-menu__trigger {
  display: flex;
  align-items: center;
  gap: .5rem;
  padding: .375rem .75rem .375rem .375rem;
  background: var(--grey-50);
  border: 2px solid var(--grey-200);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all .3s cubic-bezier(.16, 1, .3, 1);
}
.user-menu__trigger:hover {
  border-color: var(--brand-primary);
  background: var(--white);
  box-shadow: 0 4px 16px rgba(140, 21, 21, .1);
}

.user-menu__avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--brand-primary) 0%, var(--brand-primary-dark) 100%);
  color: var(--white);
  font-size: .8125rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(140, 21, 21, .2);
}
.user-menu__avatar-img { width: 100%; height: 100%; object-fit: cover; }

.user-menu__name {
  font-family: var(--font-sans);
  font-size: .8125rem;
  font-weight: 600;
  color: var(--grey-900);
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: none;
}
@media (min-width: 1100px) { .user-menu__name { display: block; } }

.user-menu__chevron {
  color: var(--grey-500);
  transition: transform .3s cubic-bezier(.16, 1, .3, 1);
  flex-shrink: 0;
}
.user-menu__chevron.is-rotated { transform: rotate(180deg); }

/* ─── USER DROPDOWN ─────────────────────────────────────────────── */
.user-dropdown {
  position: absolute;
  top: calc(100% + 10px);
  inset-inline-end: 0;
  width: 240px;
  background: var(--white);
  border: 2px solid var(--grey-200);
  border-radius: var(--radius-lg);
  box-shadow: 0 16px 48px rgba(0, 0, 0, .14);
  overflow: hidden;
  z-index: 200;
}

.user-dropdown__info {
  padding: 1.125rem;
  background: linear-gradient(135deg, #FAF5F5 0%, #F9F9F7 100%);
  display: flex;
  align-items: center;
  gap: .75rem;
  border-bottom: 1px solid var(--grey-100);
}

.user-dropdown__avatar-lg {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  flex-shrink: 0;
  background: linear-gradient(135deg, var(--brand-primary) 0%, var(--brand-primary-dark) 100%);
  color: var(--white);
  font-size: 1.125rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  box-shadow: 0 3px 10px rgba(140, 21, 21, .25);
}
.user-dropdown__avatar-img { width: 100%; height: 100%; object-fit: cover; }

.user-dropdown__info-text { display: flex; flex-direction: column; gap: .2rem; min-width: 0; }

.user-dropdown__username {
  font-size: .9rem;
  font-weight: 700;
  color: var(--grey-900);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.user-dropdown__role {
  font-size: .675rem;
  color: var(--brand-primary);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .06em;
}

.user-dropdown__divider { height: 1px; background: var(--grey-100); margin: .25rem 0; }

.user-dropdown__item {
  display: flex;
  align-items: center;
  gap: .625rem;
  width: 100%;
  padding: .75rem 1.125rem;
  background: none;
  border: none;
  font-family: var(--font-sans);
  font-size: .875rem;
  font-weight: 500;
  color: var(--grey-900);
  text-decoration: none;
  cursor: pointer;
  text-align: start;
  transition: all var(--transition-fast);
}
.user-dropdown__item:hover {
  background: var(--grey-50);
  color: var(--brand-primary);
}
.user-dropdown__item--danger { color: #CC2936; }
.user-dropdown__item--danger:hover { background: #FFF0F0; color: #CC2936; }

.user-dropdown__item-badge {
  margin-inline-start: auto;
  font-size: .6rem;
  font-weight: 800;
  color: var(--brand-primary);
  background: rgba(140, 21, 21, .08);
  padding: .15rem .4rem;
  border-radius: 4px;
  letter-spacing: .03em;
}

/* ─── LANGUAGE SWITCHER ─────────────────────────────────────────── */
.lang-switcher { position: relative; }

.lang-switcher__trigger {
  display: flex;
  align-items: center;
  gap: .5rem;
  padding: .5rem .75rem;
  background: linear-gradient(135deg, #fff 0%, #fafaf9 100%);
  border: 2px solid var(--grey-200);
  border-radius: var(--radius-md);
  font-family: var(--font-sans);
  cursor: pointer;
  transition: all .3s cubic-bezier(.16, 1, .3, 1);
  font-weight: 600;
  color: var(--grey-900);
  box-shadow: 0 2px 6px rgba(0, 0, 0, .04);
}
.lang-switcher__trigger:hover {
  border-color: var(--brand-primary);
  box-shadow: 0 4px 16px rgba(140, 21, 21, .12);
  transform: translateY(-1px);
}

.lang-switcher__flag {
  width: 24px;
  height: 16px;
  border-radius: 3px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .1);
  flex-shrink: 0;
}
.lang-switcher__flag svg { width: 100%; height: 100%; display: block; }

.lang-switcher__text {
  font-size: .875rem;
  font-weight: 700;
  color: var(--grey-900);
  transition: color .3s;
}
.lang-switcher__trigger:hover .lang-switcher__text { color: var(--brand-primary); }

.lang-switcher__chevron {
  color: var(--brand-primary);
  transition: transform .3s cubic-bezier(.16, 1, .3, 1);
  flex-shrink: 0;
}
.lang-switcher__chevron.is-rotated { transform: rotate(180deg); }

.lang-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  inset-inline-end: 0;
  width: max-content;
  min-width: 240px;
  max-width: 280px;
  background: var(--white);
  border: 2px solid var(--grey-200);
  border-radius: var(--radius-lg);
  box-shadow: 0 16px 48px rgba(0, 0, 0, .14);
  overflow: hidden;
  z-index: 200;
}

.lang-dropdown__header {
  padding: .875rem 1.25rem;
  font-size: .65rem;
  font-weight: 800;
  color: var(--grey-500);
  text-transform: uppercase;
  letter-spacing: .12em;
  background: linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%);
  border-bottom: 2px solid #e8e8e5;
}

.lang-dropdown__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: .875rem 1.125rem;
  background: transparent;
  border: none;
  font-family: var(--font-sans);
  text-align: start;
  cursor: pointer;
  transition: all .2s ease;
  box-shadow: inset 4px 0 0 transparent;
}
[dir="ltr"] .lang-dropdown__item { box-shadow: inset -4px 0 0 transparent; }
.lang-dropdown__item:hover {
  background: linear-gradient(135deg, #fafafa 0%, #f9f9f9 100%);
  box-shadow: inset 4px 0 0 var(--brand-primary);
}
[dir="ltr"] .lang-dropdown__item:hover { box-shadow: inset -4px 0 0 var(--brand-primary); }
.lang-dropdown__item.is-active {
  background: linear-gradient(135deg, rgba(140, 21, 21, .08) 0%, rgba(140, 21, 21, .04) 100%);
  box-shadow: inset 4px 0 0 var(--brand-primary);
}
[dir="ltr"] .lang-dropdown__item.is-active { box-shadow: inset -4px 0 0 var(--brand-primary); }

.lang-dropdown__info { display: flex; flex-direction: column; gap: .25rem; text-align: start; }
.lang-dropdown__name { font-size: .9375rem; font-weight: 700; color: var(--grey-900); transition: color .2s; }
.lang-dropdown__item:hover .lang-dropdown__name,
.lang-dropdown__item.is-active .lang-dropdown__name { color: var(--brand-primary); }
.lang-dropdown__desc { font-size: .7rem; color: #a6a5a0; transition: color .2s; }
.lang-dropdown__item:hover .lang-dropdown__desc { color: var(--brand-primary); opacity: .85; }
.lang-dropdown__check { color: var(--brand-primary); flex-shrink: 0; }

/* ─── DROPDOWN ANIMATION ────────────────────────────────────────── */
.dropdown-enter-active,
.dropdown-leave-active { transition: all .3s cubic-bezier(.16, 1, .3, 1); }
.dropdown-enter-from,
.dropdown-leave-to { opacity: 0; transform: translateY(-12px) scale(.95); }

/* ─── SEARCH OVERLAY ────────────────────────────────────────────── */
.search-overlay {
  position: fixed;
  inset: 0;
  background: linear-gradient(180deg, rgba(26, 26, 26, .97) 0%, rgba(107, 15, 15, .95) 100%);
  z-index: 1000;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 12vh 1.5rem 2rem;
  overflow-y: auto;
}

.search-overlay__content { width: 100%; max-width: 700px; position: relative; }

.search-overlay__close {
  position: fixed;
  top: 1.5rem;
  left: 1.5rem;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1.5px solid rgba(255, 255, 255, .2);
  border-radius: 50%;
  color: var(--white);
  cursor: pointer;
  transition: all var(--transition-fast);
}
[dir="rtl"] .search-overlay__close { left: auto; right: 1.5rem; }
.search-overlay__close:hover {
  background: rgba(255, 255, 255, .1);
  border-color: rgba(255, 255, 255, .4);
  transform: rotate(90deg);
}

.search-overlay__title {
  font-family: var(--font-display);
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--white);
  text-align: center;
  margin-bottom: 2rem;
}

.search-overlay__form {
  display: flex;
  background: var(--white);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: 0 24px 64px rgba(0, 0, 0, .3);
}

.search-overlay__input {
  flex: 1;
  padding: 1.25rem 1.5rem;
  font-family: var(--font-sans);
  font-size: 1.0625rem;
  border: none;
  outline: none;
  background: transparent;
}

.search-overlay__submit {
  padding: 1.125rem 1.5rem;
  background: linear-gradient(135deg, var(--brand-primary), var(--brand-primary-light));
  border: none;
  color: var(--white);
  cursor: pointer;
  transition: background .3s;
}
.search-overlay__submit:hover {
  background: linear-gradient(135deg, var(--brand-primary-dark), var(--brand-primary));
}

.search-overlay__quick {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: .75rem;
  margin-top: 1.75rem;
}
.search-overlay__quick-label { color: rgba(255, 255, 255, .5); font-size: .875rem; }
.search-overlay__quick-link {
  color: rgba(255, 255, 255, .85);
  font-size: .875rem;
  padding: .375rem .875rem;
  background: rgba(255, 255, 255, .08);
  border: 1px solid rgba(255, 255, 255, .1);
  border-radius: 100px;
  text-decoration: none;
  transition: all var(--transition-fast);
}
.search-overlay__quick-link:hover {
  background: rgba(255, 255, 255, .18);
  border-color: rgba(255, 255, 255, .25);
  color: var(--white);
}

/* ─── SEARCH RESULTS ────────────────────────────────────────────── */
.search-results {
  margin-top: 1.5rem;
  background: var(--white);
  border-radius: var(--radius-lg);
  box-shadow: 0 16px 48px rgba(0, 0, 0, .25);
  overflow: hidden;
  max-height: 50vh;
  overflow-y: auto;
}

.search-results__loading {
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-spinner {
  width: 24px;
  height: 24px;
  border: 3px solid #e5e5e5;
  border-top-color: var(--brand-primary);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.search-results__list {
  display: flex;
  flex-direction: column;
}

.search-result-item {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  width: 100%;
  padding: 0.875rem 1.25rem;
  background: transparent;
  border: none;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: all 0.15s;
  text-align: start;
  font-family: var(--font-sans);
}

.search-result-item:last-child {
  border-bottom: none;
}

.search-result-item:hover {
  background: linear-gradient(135deg, rgba(140, 21, 21, 0.04), rgba(140, 21, 21, 0.02));
}

.search-result-item__icon {
  font-size: 1.25rem;
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  background: #f7f7f7;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-result-item__info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.search-result-item__title {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--grey-900);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.search-result-item:hover .search-result-item__title {
  color: var(--brand-primary);
}

.search-result-item__meta {
  font-size: 0.75rem;
  color: var(--grey-500);
  font-weight: 500;
}

.search-result-item__arrow {
  color: var(--grey-300);
  flex-shrink: 0;
  transition: transform 0.2s;
}

.search-result-item:hover .search-result-item__arrow {
  color: var(--brand-primary);
  transform: translateX(-4px);
}

[dir="ltr"] .search-result-item:hover .search-result-item__arrow {
  transform: translateX(4px);
}

.search-results__empty {
  padding: 2rem;
  text-align: center;
  color: var(--grey-500);
  font-size: 0.9375rem;
}

.search-fade-enter-active,
.search-fade-leave-active { transition: opacity var(--transition-slow); }
.search-fade-enter-active .search-overlay__content,
.search-fade-leave-active .search-overlay__content { transition: transform var(--transition-slow), opacity var(--transition-slow); }
.search-fade-enter-from,
.search-fade-leave-to { opacity: 0; }
.search-fade-enter-from .search-overlay__content,
.search-fade-leave-to .search-overlay__content { opacity: 0; transform: translateY(-16px); }

/* ─── MOBILE MENU ───────────────────────────────────────────────── */
.mobile-menu { position: fixed; inset: 0; z-index: 1000; }
.mobile-menu__overlay { position: absolute; inset: 0; background: rgba(0, 0, 0, .55); }

.mobile-menu__drawer {
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  max-width: 380px;
  height: 100%;
  background: var(--white);
  overflow-y: auto;
  box-shadow: var(--shadow-xl);
  display: flex;
  flex-direction: column;
}
[dir="ltr"] .mobile-menu__drawer { right: auto; left: 0; }

.mobile-menu__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  background: linear-gradient(135deg, var(--brand-primary) 0%, var(--brand-primary-dark) 100%);
  color: var(--white);
}

.mobile-menu__logo-img {
  height: 36px;
  width: auto;
  object-fit: contain;
  filter: brightness(0) invert(1);
}

.mobile-menu__close {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, .1);
  border: none;
  border-radius: 50%;
  color: var(--white);
  cursor: pointer;
  transition: all var(--transition-fast);
}
.mobile-menu__close:hover { background: rgba(255, 255, 255, .2); transform: rotate(90deg); }

.mobile-menu__search {
  display: flex;
  align-items: center;
  gap: .75rem;
  padding: 1rem 1.25rem;
  background: var(--grey-50);
  border-bottom: 1px solid var(--grey-100);
}
.mobile-menu__search svg { color: var(--grey-500); flex-shrink: 0; }
.mobile-menu__search input {
  flex: 1;
  padding: .625rem 0;
  font-family: var(--font-sans);
  font-size: .9375rem;
  border: none;
  background: transparent;
  outline: none;
}

/* ─── ★ MOBILE FEATURED BUTTONS ★ ──────────────────────────────── */
.mobile-menu__featured {
  display: flex;
  flex-direction: column;
  gap: .75rem;
  padding: 1.25rem;
  background: linear-gradient(135deg, #FEFCF8 0%, #F5FAFA 100%);
  border-bottom: 2px solid var(--grey-100);
}

.mobile-featured-btn {
  display: flex;
  align-items: center;
  gap: .875rem;
  padding: 1rem 1.25rem;
  border-radius: var(--radius-md);
  text-decoration: none;
  font-family: var(--font-sans);
  transition: all .3s cubic-bezier(.16, 1, .3, 1);
  position: relative;
  overflow: hidden;
}
.mobile-featured-btn__label {
  font-size: 1rem;
  font-weight: 700;
  flex: 1;
}
.mobile-featured-btn__arrow {
  font-size: 1.25rem;
  opacity: .6;
  transition: transform .3s;
}
[dir="ltr"] .mobile-featured-btn__arrow { transform: scaleX(-1); }
.mobile-featured-btn:hover .mobile-featured-btn__arrow {
  transform: translateX(-4px);
}
[dir="ltr"] .mobile-featured-btn:hover .mobile-featured-btn__arrow {
  transform: scaleX(-1) translateX(-4px);
}

.mobile-featured-btn--library {
  background: linear-gradient(135deg, #C6922A 0%, #E8B84B 100%);
  color: #fff;
  box-shadow: 0 4px 16px rgba(198, 146, 42, .3);
}
.mobile-featured-btn--library:hover {
  box-shadow: 0 6px 24px rgba(198, 146, 42, .45);
  transform: translateX(-4px);
}
[dir="ltr"] .mobile-featured-btn--library:hover { transform: translateX(4px); }

.mobile-featured-btn--archive {
  background: linear-gradient(135deg, #0D7377 0%, #14A3A8 100%);
  color: #fff;
  box-shadow: 0 4px 16px rgba(13, 115, 119, .3);
}
.mobile-featured-btn--archive:hover {
  box-shadow: 0 6px 24px rgba(13, 115, 119, .45);
  transform: translateX(-4px);
}
[dir="ltr"] .mobile-featured-btn--archive:hover { transform: translateX(4px); }

/* ─── MOBILE NAV ────────────────────────────────────────────────── */
.mobile-menu__nav { flex: 1; padding: .5rem 0; }

.mobile-menu__link {
  display: block;
  padding: 1rem 1.25rem;
  font-size: 1rem;
  font-weight: 600;
  color: var(--grey-900);
  text-decoration: none;
  border-bottom: 1px solid var(--grey-100);
  transition: all var(--transition-fast);
}
.mobile-menu__link:hover,
.mobile-menu__link.router-link-active {
  background: var(--grey-50);
  color: var(--brand-primary);
  padding-inline-start: 1.75rem;
}

/* ─── MOBILE AUTH ───────────────────────────────────────────────── */
.mobile-menu__auth {
  padding: 1.25rem;
  border-top: 2px solid var(--grey-100);
  display: flex;
  flex-direction: column;
  gap: .75rem;
}

.mobile-menu__user-info {
  display: flex;
  align-items: center;
  gap: .875rem;
  padding: .875rem;
  background: linear-gradient(135deg, #FAF5F5 0%, #F7F7F5 100%);
  border-radius: var(--radius-md);
  border: 1.5px solid var(--grey-200);
}

.mobile-menu__user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--brand-primary) 0%, var(--brand-primary-dark) 100%);
  color: var(--white);
  font-size: 1rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(140, 21, 21, .2);
}
.mobile-menu__user-avatar-img { width: 100%; height: 100%; object-fit: cover; }

.mobile-menu__user-name { font-size: .9375rem; font-weight: 700; color: var(--grey-900); margin: 0; }
.mobile-menu__user-role { font-size: .7rem; color: var(--brand-primary); font-weight: 600; text-transform: uppercase; letter-spacing: .06em; margin: .125rem 0 0; }

.mobile-menu__auth-btns { display: flex; flex-wrap: wrap; gap: .625rem; }

.mobile-menu__auth-btn {
  flex: 1;
  min-width: calc(50% - .3125rem);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: .5rem;
  padding: .75rem;
  border-radius: var(--radius-md);
  font-family: var(--font-sans);
  font-size: .875rem;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  border: none;
  text-align: center;
  transition: all .3s cubic-bezier(.16, 1, .3, 1);
}
.mobile-menu__auth-btn--primary {
  background: linear-gradient(135deg, var(--brand-primary), var(--brand-primary-light));
  color: var(--white);
  box-shadow: 0 3px 12px rgba(140, 21, 21, .3);
}
.mobile-menu__auth-btn--primary:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(140, 21, 21, .4); }
.mobile-menu__auth-btn--profile { background: rgba(140, 21, 21, .08); color: var(--brand-primary); border: 1.5px solid rgba(140, 21, 21, .18); }
.mobile-menu__auth-btn--profile:hover { background: rgba(140, 21, 21, .14); }
.mobile-menu__auth-btn--secondary { background: var(--grey-50); color: var(--grey-900); border: 1.5px solid var(--grey-200); }
.mobile-menu__auth-btn--secondary:hover { border-color: var(--brand-primary); color: var(--brand-primary); }
.mobile-menu__auth-btn--danger { background: #FFF0F0; color: #CC2936; border: 1.5px solid #F5C6C8; }
.mobile-menu__auth-btn--danger:hover { background: #FFE0E2; }

/* ─── MOBILE LANGUAGE ───────────────────────────────────────────── */
.mobile-menu__lang { padding: 1.25rem; border-top: 1px solid var(--grey-100); }

.mobile-menu__lang-title {
  display: block;
  font-size: .6875rem;
  font-weight: 700;
  color: var(--grey-500);
  text-transform: uppercase;
  letter-spacing: .08em;
  margin-bottom: .75rem;
}

.mobile-menu__lang-btns { display: flex; gap: .5rem; }

.mobile-menu__lang-btn {
  flex: 1;
  padding: .625rem .75rem;
  background: var(--grey-50);
  border: 1.5px solid var(--grey-200);
  border-radius: var(--radius-md);
  font-family: var(--font-sans);
  font-size: .875rem;
  font-weight: 600;
  color: var(--grey-700);
  cursor: pointer;
  transition: all .3s cubic-bezier(.16, 1, .3, 1);
}
.mobile-menu__lang-btn:hover { border-color: var(--brand-primary); color: var(--brand-primary); }
.mobile-menu__lang-btn.is-active {
  background: linear-gradient(135deg, var(--brand-primary), var(--brand-primary-light));
  border-color: var(--brand-primary);
  color: var(--white);
  box-shadow: 0 3px 12px rgba(140, 21, 21, .25);
}

/* ─── MOBILE QUICK LINKS ───────────────────────────────────────── */
.mobile-menu__quick {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: .625rem;
  padding: 1.25rem;
  background: var(--grey-50);
}
.mobile-menu__quick a {
  padding: .75rem;
  background: var(--white);
  border: 1.5px solid var(--grey-200);
  border-radius: var(--radius-md);
  font-size: .8125rem;
  font-weight: 600;
  color: var(--grey-700);
  text-align: center;
  text-decoration: none;
  transition: all var(--transition-fast);
}
.mobile-menu__quick a:hover {
  border-color: var(--brand-primary);
  color: var(--brand-primary);
  box-shadow: 0 2px 8px rgba(140, 21, 21, .1);
}

/* ─── MOBILE SLIDE ANIMATION ────────────────────────────────────── */
.mobile-slide-enter-active,
.mobile-slide-leave-active { transition: opacity var(--transition-normal); }
.mobile-slide-enter-active .mobile-menu__drawer,
.mobile-slide-leave-active .mobile-menu__drawer { transition: transform var(--transition-normal) cubic-bezier(.16, 1, .3, 1); }
.mobile-slide-enter-from,
.mobile-slide-leave-to { opacity: 0; }
.mobile-slide-enter-from .mobile-menu__drawer,
.mobile-slide-leave-to .mobile-menu__drawer { transform: translateX(100%); }
[dir="ltr"] .mobile-slide-enter-from .mobile-menu__drawer,
[dir="ltr"] .mobile-slide-leave-to .mobile-menu__drawer { transform: translateX(-100%); }
</style>