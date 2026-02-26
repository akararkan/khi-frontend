<template>
  <header class="site-header" :dir="lang.dir">

    <!-- MAIN NAVIGATION -->
    <nav class="main-nav" :class="{ 'is-scrolled': isScrolled }">
      <div class="main-nav__container">

        <!-- Logo -->
        <router-link to="/" class="main-nav__logo">
          <span class="main-nav__logo-text">پەیمانگای کەلەپووری کوردی</span>
        </router-link>

        <!-- Desktop Menu -->
        <ul class="main-nav__menu">
          <li v-for="item in menuItems" :key="item.path" class="main-nav__item">
            <router-link :to="item.path" class="main-nav__link" active-class="is-active" exact-active-class="is-exact-active">
              {{ item.label }}
            </router-link>
          </li>
        </ul>

        <!-- Right Actions -->
        <div class="main-nav__actions">

          <!-- Search Button -->
          <button class="main-nav__search-btn" @click="openSearch" :aria-label="lang.t('nav.search')">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </svg>
          </button>

          <!-- Logged in: user menu -->
          <div v-if="authStore.isAuthenticated" class="user-menu" ref="userMenuRef">
            <button class="user-menu__trigger" @click="toggleUserMenu" :aria-expanded="userMenuOpen">
              <div class="user-menu__avatar">
                {{ authStore.username?.charAt(0)?.toUpperCase() || 'K' }}
              </div>
              <span class="user-menu__name">{{ authStore.username }}</span>
              <svg class="user-menu__chevron" :class="{ 'is-rotated': userMenuOpen }"
                xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
            <Transition name="dropdown">
              <div class="user-dropdown" v-show="userMenuOpen">
                <div class="user-dropdown__info">
                  <span class="user-dropdown__username">{{ authStore.username }}</span>
                  <span class="user-dropdown__role">{{ authStore.role }}</span>
                </div>
                <router-link to="/admin" class="user-dropdown__item" @click="userMenuOpen = false">
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
                    <rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>
                  </svg>
                  {{ lang.t('nav.dashboard') }}
                </router-link>
                <button class="user-dropdown__item user-dropdown__item--danger" @click="handleLogout">
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16 17 21 12 16 7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                  {{ lang.t('nav.logout') }}
                </button>
              </div>
            </Transition>
          </div>

          <!-- Not logged in -->
          <router-link v-else to="/login" class="login-btn" :aria-label="lang.t('nav.login')">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
              <polyline points="10 17 15 12 10 7"/>
              <line x1="15" y1="12" x2="3" y2="12"/>
            </svg>
            <span class="login-btn__text">{{ lang.t('nav.login') }}</span>
          </router-link>

          <!-- ── Language Switcher ── -->
          <div class="lang-switcher" ref="langSwitcherRef">
            <button class="lang-switcher__trigger" @click="toggleLangMenu" :aria-expanded="langMenuOpen">
              <!-- Kurdistan Flag -->
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
                xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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
                    xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
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
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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
              @keyup.enter="performSearch"
              @keyup.escape="closeSearch"
            />
            <button class="search-overlay__submit" @click="performSearch" :aria-label="lang.t('nav.search')">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </svg>
            </button>
          </div>
          <div class="search-overlay__quick">
            <span class="search-overlay__quick-label">{{ lang.t('search.quickLabel') }}</span>
            <router-link to="/library"      class="search-overlay__quick-link" @click="closeSearch">{{ lang.t('nav.library') }}</router-link>
            <router-link to="/archive"      class="search-overlay__quick-link" @click="closeSearch">{{ lang.t('nav.archive') }}</router-link>
            <router-link to="/publishments" class="search-overlay__quick-link" @click="closeSearch">{{ lang.t('nav.publishments') }}</router-link>
            <router-link to="/projects"     class="search-overlay__quick-link" @click="closeSearch">{{ lang.t('nav.projects') }}</router-link>
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
            <span class="mobile-menu__logo">پەیمانگای کەلەپووری کوردی</span>
            <button class="mobile-menu__close" @click="closeMobileMenu" :aria-label="lang.t('ui.close')">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="mobile-menu__search">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </svg>
            <input type="text" :placeholder="lang.t('nav.searchPlaceholder')" v-model="searchQuery" @keyup.enter="performSearch" />
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
                <div class="mobile-menu__user-avatar">{{ authStore.username?.charAt(0)?.toUpperCase() || 'K' }}</div>
                <div>
                  <p class="mobile-menu__user-name">{{ authStore.username }}</p>
                  <p class="mobile-menu__user-role">{{ authStore.role }}</p>
                </div>
              </div>
              <div class="mobile-menu__auth-btns">
                <router-link to="/admin" class="mobile-menu__auth-btn mobile-menu__auth-btn--secondary" @click="closeMobileMenu">
                  {{ lang.t('nav.dashboard') }}
                </router-link>
                <button class="mobile-menu__auth-btn mobile-menu__auth-btn--danger" @click="handleLogout">
                  {{ lang.t('nav.logout') }}
                </button>
              </div>
            </template>
            <router-link v-else to="/login" class="mobile-menu__auth-btn mobile-menu__auth-btn--primary" @click="closeMobileMenu">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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
            <router-link to="/students"    @click="closeMobileMenu">{{ lang.t('mobile.students') }}</router-link>
            <router-link to="/researchers" @click="closeMobileMenu">{{ lang.t('mobile.researchers') }}</router-link>
            <router-link to="/visitors"    @click="closeMobileMenu">{{ lang.t('mobile.visitors') }}</router-link>
            <router-link to="/partners"    @click="closeMobileMenu">{{ lang.t('mobile.partners') }}</router-link>
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

const router    = useRouter()
const authStore = useAuthStore()
const lang      = useLanguageStore()

// ── State ──────────────────────────────────────────────────────────
const searchQuery    = ref('')
const searchOpen     = ref(false)
const searchInputRef = ref(null)
const langMenuOpen   = ref(false)
const langSwitcherRef = ref(null)
const mobileMenuOpen = ref(false)
const isScrolled     = ref(false)
const userMenuOpen   = ref(false)
const userMenuRef    = ref(null)

// ── Dialect list (CKB + KMR only, no English) ─────────────────────
const dialects = [
  {
    code: 'CKB',
    name: 'کوردی (سۆرانی)',
    shortName: 'کوردی',
    description: 'کوردی ناوەندی',
  },
  {
    code: 'KMR',
    name: 'Kurdî (Kurmancî)',
    shortName: 'Kurdî',
    description: 'Kurdiya Bakur',
  },
]

// ── Menu items — reactive to language store ────────────────────────
const menuItems = computed(() => [
  { path: '/',             label: lang.t('nav.home') },
  { path: '/projects',     label: lang.t('nav.projects') },
  { path: '/publishments', label: lang.t('nav.publishments') },
  { path: '/library',      label: lang.t('nav.library') },
  { path: '/archive',      label: lang.t('nav.archive') },
  { path: '/services',     label: lang.t('nav.services') },
  { path: '/about',        label: lang.t('nav.about') },
  { path: '/contact',      label: lang.t('nav.contact') },
])

// ── Language switching ─────────────────────────────────────────────
function selectDialect(code) {
  lang.setLanguage(code)
  langMenuOpen.value = false
}

// ── Auth ───────────────────────────────────────────────────────────
function toggleUserMenu() { userMenuOpen.value = !userMenuOpen.value }
async function handleLogout() {
  userMenuOpen.value = false
  closeMobileMenu()
  await authStore.logout()
  router.push('/')
}

// ── Language toggle ────────────────────────────────────────────────
function toggleLangMenu() { langMenuOpen.value = !langMenuOpen.value }

// ── Search ─────────────────────────────────────────────────────────
function openSearch() {
  searchOpen.value = true
  document.body.style.overflow = 'hidden'
  nextTick(() => searchInputRef.value?.focus())
}
function closeSearch() {
  searchOpen.value = false
  searchQuery.value = ''
  document.body.style.overflow = ''
}
function performSearch() {
  if (searchQuery.value.trim()) {
    router.push({ path: '/search', query: { q: searchQuery.value } })
    closeSearch()
    closeMobileMenu()
  }
}

// ── Mobile ─────────────────────────────────────────────────────────
function toggleMobileMenu() {
  mobileMenuOpen.value = !mobileMenuOpen.value
  document.body.style.overflow = mobileMenuOpen.value ? 'hidden' : ''
}
function closeMobileMenu() {
  mobileMenuOpen.value = false
  document.body.style.overflow = ''
}

// ── Scroll ─────────────────────────────────────────────────────────
function handleScroll() { isScrolled.value = window.scrollY > 10 }

// ── Click outside ──────────────────────────────────────────────────
function handleClickOutside(e) {
  if (langSwitcherRef.value && !langSwitcherRef.value.contains(e.target)) langMenuOpen.value = false
  if (userMenuRef.value    && !userMenuRef.value.contains(e.target))    userMenuOpen.value = false
}

// ── Keyboard ───────────────────────────────────────────────────────
function handleKeydown(e) {
  if (e.key === 'Escape') {
    if (searchOpen.value)   closeSearch()
    if (mobileMenuOpen.value) closeMobileMenu()
    langMenuOpen.value  = false
    userMenuOpen.value  = false
  }
}

// ── Lifecycle ──────────────────────────────────────────────────────
onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleKeydown)
})

watch(() => router.currentRoute.value, () => {
  closeMobileMenu()
  userMenuOpen.value = false
})
</script>

<style scoped>
/* ─── all the styles are unchanged from the original ─── */
/* ============================================
   CSS CUSTOM PROPERTIES
   ============================================ */
.site-header {
  --brand-primary: #8C1515;
  --brand-primary-light: #B83A4B;
  --brand-primary-dark: #6B0F0F;
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
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --container-max: 1500px;
}

.main-nav {
  background-color: var(--white);
  border-bottom: 1px solid var(--grey-100);
  position: sticky; top: 0; z-index: 100;
  transition: all var(--transition-normal);
}
.main-nav.is-scrolled { box-shadow: var(--shadow-md); border-bottom-color: transparent; }

.main-nav__container {
  max-width: var(--container-max);
  margin: 0 auto; padding: 0 1.5rem;
  display: flex; align-items: center;
  justify-content: space-between;
  gap: 2rem; height: 72px;
}
@media (min-width: 768px)  { .main-nav__container { padding: 0 2rem; height: 76px; } }
@media (min-width: 1024px) { .main-nav__container { padding: 0 3rem; height: 80px; } }

.main-nav__logo {
  display: flex; align-items: center;
  color: var(--brand-primary); text-decoration: none;
  transition: opacity var(--transition-fast); flex-shrink: 0;
}
.main-nav__logo:hover { opacity: .85; }
.main-nav__logo-text {
  font-family: var(--font-display);
  font-size: 1.125rem; font-weight: 700; letter-spacing: .01em;
}
@media (min-width: 768px)  { .main-nav__logo-text { font-size: 1.25rem; } }
@media (min-width: 1280px) { .main-nav__logo-text { font-size: 1.375rem; } }

.main-nav__menu {
  display: none; list-style: none; margin: 0; padding: 0;
  gap: .25rem; flex: 1; justify-content: center;
}
@media (min-width: 1024px) { .main-nav__menu { display: flex; } }

.main-nav__link {
  display: block; padding: .625rem 1rem;
  font-family: var(--font-sans); font-size: .9375rem; font-weight: 500;
  color: var(--grey-900); text-decoration: none;
  border-radius: var(--radius-sm); position: relative;
  transition: all var(--transition-fast);
}
@media (min-width: 1280px) { .main-nav__link { padding: .625rem 1.25rem; font-size: 1rem; } }
.main-nav__link::after {
  content: ''; position: absolute; bottom: 0; right: 0; left: 0;
  height: 3px; background-color: var(--brand-primary);
  border-radius: 3px 3px 0 0; transform: scaleX(0);
  transition: transform var(--transition-normal);
}
.main-nav__link:hover { color: var(--brand-primary); background-color: rgba(140,21,21,.05); }
.main-nav__link:hover::after,
.main-nav__link.is-active::after,
.main-nav__link.is-exact-active::after { transform: scaleX(1); }
.main-nav__link.is-active,
.main-nav__link.is-exact-active { color: var(--brand-primary); font-weight: 600; }

.main-nav__actions {
  display: flex; align-items: center; gap: .75rem; flex-shrink: 0;
}
@media (min-width: 768px) { .main-nav__actions { gap: 1rem; } }

.main-nav__search-btn {
  display: none; align-items: center; justify-content: center;
  width: 42px; height: 42px;
  background-color: var(--grey-50); border: 1px solid var(--grey-200);
  border-radius: var(--radius-md); color: var(--grey-700);
  cursor: pointer; transition: all var(--transition-fast);
}
@media (min-width: 768px) { .main-nav__search-btn { display: flex; } }
.main-nav__search-btn:hover {
  background-color: var(--brand-primary); border-color: var(--brand-primary);
  color: var(--white); transform: translateY(-1px); box-shadow: var(--shadow-sm);
}

.mobile-toggle {
  display: flex; align-items: center; justify-content: center;
  width: 44px; height: 44px; background: transparent; border: none;
  cursor: pointer; -webkit-tap-highlight-color: transparent;
}
@media (min-width: 1024px) { .mobile-toggle { display: none; } }

.hamburger {
  width: 22px; height: 16px; position: relative;
  display: flex; flex-direction: column; justify-content: space-between;
}
.hamburger span {
  display: block; width: 100%; height: 2px;
  background-color: var(--grey-900); border-radius: 2px;
  transition: all var(--transition-normal); transform-origin: center;
}
.hamburger span:nth-child(3) { width: 70%; margin-right: auto; }
[dir="ltr"] .hamburger span:nth-child(3) { margin-right: 0; margin-left: auto; }
.hamburger.is-active span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.hamburger.is-active span:nth-child(2) { opacity: 0; transform: scaleX(0); }
.hamburger.is-active span:nth-child(3) { width: 100%; transform: translateY(-7px) rotate(-45deg); }

.login-btn {
  display: none; align-items: center; gap: .5rem;
  padding: .5rem 1.125rem;
  background-color: var(--brand-primary); color: var(--white);
  border-radius: var(--radius-md); text-decoration: none;
  font-family: var(--font-sans); font-size: .875rem; font-weight: 600;
  transition: all var(--transition-fast); white-space: nowrap;
  box-shadow: 0 2px 8px rgba(140,21,21,.25);
}
@media (min-width: 768px) { .login-btn { display: flex; } }
.login-btn:hover { background-color: var(--brand-primary-dark); transform: translateY(-1px); box-shadow: 0 4px 14px rgba(140,21,21,.35); }
.login-btn:active { transform: translateY(0); }
@media (max-width: 1023px) { .login-btn__text { display: none; } }

.user-menu { display: none; position: relative; }
@media (min-width: 768px) { .user-menu { display: block; } }
.user-menu__trigger {
  display: flex; align-items: center; gap: .5rem;
  padding: .375rem .75rem .375rem .5rem;
  background: var(--grey-50); border: 1.5px solid var(--grey-200);
  border-radius: var(--radius-md); cursor: pointer;
  transition: all var(--transition-fast);
}
.user-menu__trigger:hover { border-color: var(--brand-primary); background: var(--white); }
.user-menu__avatar {
  width: 30px; height: 30px; border-radius: 50%;
  background: linear-gradient(135deg, var(--brand-primary) 0%, var(--brand-primary-dark) 100%);
  color: var(--white); font-size: .8125rem; font-weight: 700;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.user-menu__name {
  font-family: var(--font-sans); font-size: .8125rem; font-weight: 600;
  color: var(--grey-900); max-width: 100px; overflow: hidden;
  text-overflow: ellipsis; white-space: nowrap; display: none;
}
@media (min-width: 1100px) { .user-menu__name { display: block; } }
.user-menu__chevron { color: var(--grey-500); transition: transform var(--transition-fast); flex-shrink: 0; }
.user-menu__chevron.is-rotated { transform: rotate(180deg); }

.user-dropdown {
  position: absolute; top: calc(100% + 8px);
  inset-inline-end: 0; width: 200px;
  background: var(--white); border: 1.5px solid var(--grey-200);
  border-radius: var(--radius-md); box-shadow: var(--shadow-lg);
  overflow: hidden; z-index: 200;
}
.user-dropdown__info {
  padding: .875rem 1rem; background: var(--grey-50);
  border-bottom: 1px solid var(--grey-100);
  display: flex; flex-direction: column; gap: .125rem;
}
.user-dropdown__username { font-size: .875rem; font-weight: 700; color: var(--grey-900); }
.user-dropdown__role { font-size: .7rem; color: var(--grey-500); text-transform: uppercase; letter-spacing: .06em; }
.user-dropdown__item {
  display: flex; align-items: center; gap: .625rem; width: 100%;
  padding: .75rem 1rem; background: none; border: none;
  font-family: var(--font-sans); font-size: .875rem; color: var(--grey-900);
  text-decoration: none; cursor: pointer; text-align: start;
  transition: all var(--transition-fast);
}
.user-dropdown__item:hover { background: var(--grey-50); color: var(--brand-primary); }
.user-dropdown__item--danger { color: #CC2936; }
.user-dropdown__item--danger:hover { background: #FFF0F0; color: #CC2936; }

/* ── Language Switcher ── */
.lang-switcher { position: relative; }
.lang-switcher__trigger {
  display: flex; align-items: center; gap: .5rem;
  padding: .625rem .875rem;
  background: linear-gradient(135deg, #fff 0%, #f9f9f9 100%);
  border: 2px solid #e4e4e1; border-radius: 10px;
  font-family: var(--font-sans); cursor: pointer;
  transition: all .3s cubic-bezier(.16,1,.3,1);
  font-weight: 600; color: #2e2d29;
  box-shadow: 0 2px 6px rgba(0,0,0,.05);
}
.lang-switcher__trigger:hover {
  background: linear-gradient(135deg, #f9f9f9 0%, #f0f0f0 100%);
  border-color: var(--brand-primary);
  box-shadow: 0 6px 20px rgba(140,21,21,.15);
  transform: translateY(-2px);
}
.lang-switcher__flag {
  width: 24px; height: 16px; border-radius: 3px; overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,.1); flex-shrink: 0;
  transition: all .3s cubic-bezier(.16,1,.3,1);
}
.lang-switcher__trigger:hover .lang-switcher__flag { box-shadow: 0 3px 8px rgba(140,21,21,.15); transform: scale(1.05); }
.lang-switcher__flag svg { width: 100%; height: 100%; display: block; }
.lang-switcher__text { font-size: .875rem; font-weight: 700; color: #2e2d29; transition: color .3s; }
.lang-switcher__trigger:hover .lang-switcher__text { color: var(--brand-primary); }
.lang-switcher__chevron { color: var(--brand-primary); transition: transform .3s cubic-bezier(.16,1,.3,1); flex-shrink: 0; }
.lang-switcher__chevron.is-rotated { transform: rotate(180deg); }

.lang-dropdown {
  position: absolute; top: calc(100% + 8px); inset-inline-end: 0;
  width: max-content; min-width: 240px; max-width: 280px;
  background-color: #fff; border: 2px solid #e4e4e1;
  border-radius: 10px; box-shadow: 0 12px 40px rgba(0,0,0,.12);
  overflow: hidden; z-index: 200;
}
.lang-dropdown__header {
  padding: .875rem 1.25rem; font-size: .65rem; font-weight: 800;
  color: #767671; text-transform: uppercase; letter-spacing: .12em;
  background: linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%);
  border-bottom: 2px solid #e8e8e5;
}
.lang-dropdown__item {
  display: flex; align-items: center; justify-content: space-between;
  width: 100%; padding: .875rem 1.125rem;
  background-color: transparent; border: none;
  font-family: var(--font-sans); text-align: start; cursor: pointer;
  transition: all .2s ease;
  box-shadow: inset 4px 0 0 transparent;
}
[dir="ltr"] .lang-dropdown__item { box-shadow: inset -4px 0 0 transparent; }
.lang-dropdown__item:hover { background: linear-gradient(135deg, #fafafa 0%, #f9f9f9 100%); box-shadow: inset 4px 0 0 var(--brand-primary); }
[dir="ltr"] .lang-dropdown__item:hover { box-shadow: inset -4px 0 0 var(--brand-primary); }
.lang-dropdown__item.is-active {
  background: linear-gradient(135deg, rgba(140,21,21,.08) 0%, rgba(140,21,21,.04) 100%);
  box-shadow: inset 4px 0 0 var(--brand-primary);
}
[dir="ltr"] .lang-dropdown__item.is-active { box-shadow: inset -4px 0 0 var(--brand-primary); }
.lang-dropdown__info { display: flex; flex-direction: column; gap: .25rem; text-align: start; }
.lang-dropdown__name { font-size: .9375rem; font-weight: 700; color: #2e2d29; transition: color .2s; }
.lang-dropdown__item:hover .lang-dropdown__name,
.lang-dropdown__item.is-active .lang-dropdown__name { color: var(--brand-primary); }
.lang-dropdown__desc { font-size: .7rem; color: #a6a5a0; transition: color .2s; }
.lang-dropdown__item:hover .lang-dropdown__desc { color: #8C1515; opacity: .85; }
.lang-dropdown__check { color: var(--brand-primary); flex-shrink: 0; }

/* Dropdown animation */
.dropdown-enter-active,
.dropdown-leave-active { transition: all .3s cubic-bezier(.16,1,.3,1); }
.dropdown-enter-from,
.dropdown-leave-to { opacity: 0; transform: translateY(-12px) scale(.95); }

/* ── Search Overlay ── */
.search-overlay {
  position: fixed; inset: 0; background-color: rgba(0,0,0,.95);
  z-index: 1000; display: flex; align-items: flex-start; justify-content: center;
  padding: 12vh 1.5rem 2rem; overflow-y: auto;
}
.search-overlay__content { width: 100%; max-width: 700px; position: relative; }
.search-overlay__close {
  position: fixed; top: 1.5rem; left: 1.5rem;
  width: 48px; height: 48px; display: flex; align-items: center; justify-content: center;
  background-color: transparent; border: 1px solid rgba(255,255,255,.2);
  border-radius: 50%; color: var(--white); cursor: pointer;
  transition: all var(--transition-fast);
}
[dir="rtl"] .search-overlay__close { left: auto; right: 1.5rem; }
.search-overlay__close:hover { background-color: rgba(255,255,255,.1); border-color: rgba(255,255,255,.3); }
.search-overlay__title {
  font-family: var(--font-display); font-size: 1.5rem; font-weight: 600;
  color: var(--white); text-align: center; margin-bottom: 2rem;
}
.search-overlay__form {
  display: flex; background-color: var(--white);
  border-radius: var(--radius-md); overflow: hidden; box-shadow: var(--shadow-xl);
}
.search-overlay__input {
  flex: 1; padding: 1.125rem 1.5rem;
  font-family: var(--font-sans); font-size: 1.0625rem;
  border: none; outline: none; background-color: transparent;
}
.search-overlay__submit {
  padding: 1.125rem 1.5rem; background-color: var(--brand-primary);
  border: none; color: var(--white); cursor: pointer;
  transition: background-color var(--transition-fast);
}
.search-overlay__submit:hover { background-color: var(--brand-primary-dark); }
.search-overlay__quick {
  display: flex; align-items: center; justify-content: center;
  flex-wrap: wrap; gap: .75rem; margin-top: 1.75rem;
}
.search-overlay__quick-label { color: rgba(255,255,255,.5); font-size: .875rem; }
.search-overlay__quick-link {
  color: rgba(255,255,255,.85); font-size: .875rem;
  padding: .375rem .875rem; background-color: rgba(255,255,255,.1);
  border-radius: 100px; text-decoration: none; transition: all var(--transition-fast);
}
.search-overlay__quick-link:hover { background-color: rgba(255,255,255,.2); color: var(--white); }

.search-fade-enter-active,
.search-fade-leave-active { transition: opacity var(--transition-slow); }
.search-fade-enter-active .search-overlay__content,
.search-fade-leave-active .search-overlay__content { transition: transform var(--transition-slow), opacity var(--transition-slow); }
.search-fade-enter-from,
.search-fade-leave-to { opacity: 0; }
.search-fade-enter-from .search-overlay__content,
.search-fade-leave-to .search-overlay__content { opacity: 0; transform: translateY(-16px); }

/* ── Mobile Menu ── */
.mobile-menu { position: fixed; inset: 0; z-index: 1000; }
.mobile-menu__overlay { position: absolute; inset: 0; background-color: rgba(0,0,0,.5); }
.mobile-menu__drawer {
  position: absolute; top: 0; right: 0;
  width: 100%; max-width: 360px; height: 100%;
  background-color: var(--white); overflow-y: auto;
  box-shadow: var(--shadow-xl); display: flex; flex-direction: column;
}
[dir="ltr"] .mobile-menu__drawer { right: auto; left: 0; }
.mobile-menu__header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 1rem 1.25rem; background-color: var(--brand-primary); color: var(--white);
}
.mobile-menu__logo { font-family: var(--font-display); font-size: .9375rem; font-weight: 700; }
.mobile-menu__close {
  width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;
  background-color: rgba(255,255,255,.1); border: none; border-radius: 50%;
  color: var(--white); cursor: pointer; transition: background-color var(--transition-fast);
}
.mobile-menu__close:hover { background-color: rgba(255,255,255,.2); }
.mobile-menu__search {
  display: flex; align-items: center; gap: .75rem; padding: 1rem 1.25rem;
  background-color: var(--grey-50); border-bottom: 1px solid var(--grey-100);
}
.mobile-menu__search svg { color: var(--grey-500); flex-shrink: 0; }
.mobile-menu__search input {
  flex: 1; padding: .625rem 0; font-family: var(--font-sans);
  font-size: .9375rem; border: none; background-color: transparent; outline: none;
}
.mobile-menu__nav { flex: 1; padding: .5rem 0; }
.mobile-menu__link {
  display: block; padding: 1rem 1.25rem; font-size: 1rem; font-weight: 500;
  color: var(--grey-900); text-decoration: none; border-bottom: 1px solid var(--grey-100);
  transition: all var(--transition-fast);
}
.mobile-menu__link:hover, .mobile-menu__link.router-link-active { background-color: var(--grey-50); color: var(--brand-primary); }
.mobile-menu__auth {
  padding: 1.25rem; border-top: 2px solid var(--grey-100);
  display: flex; flex-direction: column; gap: .75rem;
}
.mobile-menu__user-info {
  display: flex; align-items: center; gap: .875rem; padding: .75rem;
  background: var(--grey-50); border-radius: var(--radius-md); border: 1px solid var(--grey-200);
}
.mobile-menu__user-avatar {
  width: 38px; height: 38px; border-radius: 50%;
  background: linear-gradient(135deg, var(--brand-primary) 0%, var(--brand-primary-dark) 100%);
  color: var(--white); font-size: 1rem; font-weight: 700;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.mobile-menu__user-name { font-size: .9375rem; font-weight: 700; color: var(--grey-900); margin: 0; }
.mobile-menu__user-role { font-size: .7rem; color: var(--grey-500); text-transform: uppercase; letter-spacing: .06em; margin: 0; }
.mobile-menu__auth-btns { display: flex; gap: .625rem; }
.mobile-menu__auth-btn {
  flex: 1; display: flex; align-items: center; justify-content: center; gap: .5rem;
  padding: .75rem; border-radius: var(--radius-md); font-family: var(--font-sans);
  font-size: .875rem; font-weight: 600; cursor: pointer; text-decoration: none;
  border: none; text-align: center; transition: all var(--transition-fast);
}
.mobile-menu__auth-btn--primary { background-color: var(--brand-primary); color: var(--white); box-shadow: 0 2px 8px rgba(140,21,21,.25); }
.mobile-menu__auth-btn--primary:hover { background-color: var(--brand-primary-dark); }
.mobile-menu__auth-btn--secondary { background-color: var(--grey-50); color: var(--grey-900); border: 1px solid var(--grey-200); }
.mobile-menu__auth-btn--secondary:hover { border-color: var(--brand-primary); color: var(--brand-primary); }
.mobile-menu__auth-btn--danger { background-color: #FFF0F0; color: #CC2936; border: 1px solid #F5C6C8; }
.mobile-menu__auth-btn--danger:hover { background-color: #FFE0E2; }
.mobile-menu__lang { padding: 1.25rem; border-top: 1px solid var(--grey-100); }
.mobile-menu__lang-title {
  display: block; font-size: .6875rem; font-weight: 700; color: var(--grey-500);
  text-transform: uppercase; letter-spacing: .08em; margin-bottom: .75rem;
}
.mobile-menu__lang-btns { display: flex; gap: .5rem; }
.mobile-menu__lang-btn {
  flex: 1; padding: .625rem .75rem;
  background-color: var(--grey-50); border: 1px solid var(--grey-200);
  border-radius: var(--radius-md); font-family: var(--font-sans);
  font-size: .875rem; font-weight: 500; color: var(--grey-700);
  cursor: pointer; transition: all var(--transition-fast);
}
.mobile-menu__lang-btn:hover { border-color: var(--grey-300); }
.mobile-menu__lang-btn.is-active { background-color: var(--brand-primary); border-color: var(--brand-primary); color: var(--white); }
.mobile-menu__quick {
  display: grid; grid-template-columns: repeat(2, 1fr);
  gap: .625rem; padding: 1.25rem; background-color: var(--grey-50);
}
.mobile-menu__quick a {
  padding: .75rem; background-color: var(--white); border: 1px solid var(--grey-200);
  border-radius: var(--radius-md); font-size: .8125rem; font-weight: 500;
  color: var(--grey-700); text-align: center; text-decoration: none;
  transition: all var(--transition-fast);
}
.mobile-menu__quick a:hover { border-color: var(--brand-primary); color: var(--brand-primary); }

.mobile-slide-enter-active,
.mobile-slide-leave-active { transition: opacity var(--transition-normal); }
.mobile-slide-enter-active .mobile-menu__drawer,
.mobile-slide-leave-active .mobile-menu__drawer { transition: transform var(--transition-normal); }
.mobile-slide-enter-from,
.mobile-slide-leave-to { opacity: 0; }
.mobile-slide-enter-from .mobile-menu__drawer,
.mobile-slide-leave-to .mobile-menu__drawer { transform: translateX(100%); }
[dir="ltr"] .mobile-slide-enter-from .mobile-menu__drawer,
[dir="ltr"] .mobile-slide-leave-to .mobile-menu__drawer { transform: translateX(-100%); }
</style>