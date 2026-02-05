<template>
  <!-- ============================================
       STANFORD-STYLE NAVBAR - Kurdish Heritage Institute
       Features: Brand Bar, Main Nav, Search Overlay, Mobile Menu
       RTL Support for Kurdish (Sorani)
       ============================================ -->

  <header class="site-header">
    <!-- BRAND BAR (Top Red Identity Bar) -->
    <div class="brand-bar">
      <div class="brand-bar__container">
        <!-- Logo -->
        <router-link to="/" class="brand-bar__logo">
          <span class="brand-bar__logo-text">پەیمانگای کەلەپووری کوردی</span>
        </router-link>

        <!-- Quick Links (Desktop) -->
        <div class="brand-bar__links">
          <span class="brand-bar__label">زانیاری بۆ:</span>
          <router-link to="/students" class="brand-bar__link">خوێندکاران</router-link>
          <router-link to="/researchers" class="brand-bar__link">توێژەران</router-link>
          <router-link to="/visitors" class="brand-bar__link">میوانان</router-link>
          <router-link to="/partners" class="brand-bar__link">هاوبەشان</router-link>

          <!-- Search Button -->
          <button class="brand-bar__search-btn" @click="openSearch" aria-label="گەڕان">
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </svg>
            <span>گەڕان</span>
          </button>
        </div>

        <!-- Mobile Menu Toggle -->
        <button class="mobile-toggle" @click="toggleMobileMenu" :aria-expanded="mobileMenuOpen" aria-label="مێنیو">
          <span class="hamburger" :class="{ 'is-active': mobileMenuOpen }">
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
      </div>
    </div>

    <!-- MAIN NAVIGATION -->
    <nav class="main-nav" :class="{ 'is-scrolled': isScrolled }">
      <div class="main-nav__container">
        <!-- Desktop Menu -->
        <ul class="main-nav__menu">
          <li v-for="item in menuItems" :key="item.path" class="main-nav__item">
            <router-link :to="item.path" class="main-nav__link" active-class="is-active"
              exact-active-class="is-exact-active">
              {{ item.label }}
            </router-link>
          </li>
        </ul>

        <!-- Language Switcher -->
        <div class="lang-switcher" ref="langSwitcherRef">
          <button class="lang-switcher__trigger" @click="toggleLangMenu" :aria-expanded="langMenuOpen">
            <!-- Kurdistan Flag -->
            <div class="lang-switcher__flag">
              <svg viewBox="0 0 36 24" xmlns="http://www.w3.org/2000/svg">
                <rect width="36" height="8" fill="#ED2939" />
                <rect y="8" width="36" height="8" fill="#FFFFFF" />
                <rect y="16" width="36" height="8" fill="#00A651" />
                <circle cx="18" cy="12" r="4" fill="#FEDD00" />
                <g fill="#FEDD00">
                  <polygon points="18,4 18.7,6 17.3,6" />
                  <polygon points="18,20 18.7,18 17.3,18" />
                  <polygon points="10,12 12,12.7 12,11.3" />
                  <polygon points="26,12 24,12.7 24,11.3" />
                  <polygon points="12,6 13.5,7.8 12.3,8.3" />
                  <polygon points="24,18 22.5,16.2 23.7,15.7" />
                  <polygon points="24,6 22.5,7.8 23.7,8.3" />
                  <polygon points="12,18 13.5,16.2 12.3,15.7" />
                </g>
              </svg>
            </div>

            <span class="lang-switcher__text">{{ currentDialect.name }}</span>

            <svg class="lang-switcher__chevron" :class="{ 'is-rotated': langMenuOpen }"
              xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>

          <!-- Language Dropdown -->
          <Transition name="dropdown">
            <div class="lang-dropdown" v-show="langMenuOpen">
              <div class="lang-dropdown__header">زمان / Language</div>

              <button v-for="dialect in dialects" :key="dialect.id" class="lang-dropdown__item"
                :class="{ 'is-active': currentDialect.id === dialect.id }" @click="selectDialect(dialect)">
                <div class="lang-dropdown__info">
                  <span class="lang-dropdown__name">{{ dialect.name }}</span>
                  <span class="lang-dropdown__desc">{{ dialect.description }}</span>
                </div>

                <svg v-if="currentDialect.id === dialect.id" class="lang-dropdown__check"
                  xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2.5">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </button>
            </div>
          </Transition>
        </div>
      </div>
    </nav>

    <!-- SEARCH OVERLAY -->
    <Transition name="search-fade">
      <div class="search-overlay" v-show="searchOpen" @click.self="closeSearch">
        <div class="search-overlay__content">
          <!-- Close Button -->
          <button class="search-overlay__close" @click="closeSearch" aria-label="داخستن">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>

          <h2 class="search-overlay__title">گەڕان لە پەیمانگا</h2>

          <!-- Search Input -->
          <div class="search-overlay__form">
            <input ref="searchInputRef" type="text" class="search-overlay__input" :placeholder="getSearchPlaceholder"
              v-model="searchQuery" @keyup.enter="performSearch" @keyup.escape="closeSearch" />

            <button class="search-overlay__submit" @click="performSearch" aria-label="گەڕان">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </svg>
            </button>
          </div>

          <!-- Quick Links -->
          <div class="search-overlay__quick">
            <span class="search-overlay__quick-label">گەڕانی خێرا:</span>
            <router-link to="/library" class="search-overlay__quick-link" @click="closeSearch">کتێبخانە</router-link>
            <router-link to="/archive" class="search-overlay__quick-link" @click="closeSearch">ئەرشیڤ</router-link>
            <router-link to="/publishments" class="search-overlay__quick-link"
              @click="closeSearch">بڵاوکراوەکان</router-link>
            <router-link to="/projects" class="search-overlay__quick-link" @click="closeSearch">پڕۆژەکان</router-link>
          </div>
        </div>
      </div>
    </Transition>

    <!-- MOBILE MENU -->
    <Transition name="mobile-slide">
      <div class="mobile-menu" v-show="mobileMenuOpen">
        <div class="mobile-menu__overlay" @click="closeMobileMenu"></div>

        <div class="mobile-menu__drawer">
          <!-- Header -->
          <div class="mobile-menu__header">
            <span class="mobile-menu__logo">پەیمانگای کەلەپووری کوردی</span>
            <button class="mobile-menu__close" @click="closeMobileMenu" aria-label="داخستن">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Search -->
          <div class="mobile-menu__search">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </svg>

            <input type="text" placeholder="گەڕان..." v-model="searchQuery" @keyup.enter="performSearch" />
          </div>

          <!-- Navigation Links -->
          <nav class="mobile-menu__nav">
            <router-link v-for="item in menuItems" :key="item.path" :to="item.path" class="mobile-menu__link"
              @click="closeMobileMenu">
              {{ item.label }}
            </router-link>
          </nav>

          <!-- Language Options -->
          <div class="mobile-menu__lang">
            <span class="mobile-menu__lang-title">زمان</span>
            <div class="mobile-menu__lang-btns">
              <button v-for="dialect in dialects" :key="dialect.id" class="mobile-menu__lang-btn"
                :class="{ 'is-active': currentDialect.id === dialect.id }" @click="selectDialect(dialect)">
                {{ dialect.name }}
              </button>
            </div>
          </div>

          <!-- Quick Links -->
          <div class="mobile-menu__quick">
            <router-link to="/students" @click="closeMobileMenu">خوێندکاران</router-link>
            <router-link to="/researchers" @click="closeMobileMenu">توێژەران</router-link>
            <router-link to="/visitors" @click="closeMobileMenu">میوانان</router-link>
            <router-link to="/partners" @click="closeMobileMenu">هاوبەشان</router-link>
          </div>
        </div>
      </div>
    </Transition>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// ============================================
// STATE
// ============================================
const searchQuery = ref('')
const searchOpen = ref(false)
const searchInputRef = ref(null)
const langMenuOpen = ref(false)
const langSwitcherRef = ref(null)
const mobileMenuOpen = ref(false)
const isScrolled = ref(false)

// ============================================
// MENU ITEMS
// ============================================
const menuItems = ref([
  { path: '/', label: 'سەرەکی' },
  { path: '/projects', label: 'پڕۆژەکان' },
  { path: '/publishments', label: 'بڵاوکراوەکان' },
  { path: '/library', label: 'کتێبخانە' },
  { path: '/archive', label: 'ئەرشیڤ' },
  { path: '/services', label: 'خزمەتگوزارییەکان' },
  { path: '/about', label: 'دەربارە' },
  { path: '/contact', label: 'پەیوەندی' },
])

// ============================================
// LANGUAGES
// ============================================
const dialects = ref([
  {
    id: 'sorani',
    name: 'کوردی',
    description: 'کوردی ناوەندی (سۆرانی)',
    code: 'ckb',
    dir: 'rtl'
  },
  {
    id: 'kurmanji',
    name: 'Kurdî',
    description: 'Kurdiya Bakur (Kurmancî)',
    code: 'kmr',
    dir: 'ltr'
  },
  {
    id: 'english',
    name: 'English',
    description: 'English Language',
    code: 'en',
    dir: 'ltr'
  },
])

const currentDialect = ref(dialects.value[0])

const getSearchPlaceholder = computed(() => {
  const placeholders = {
    sorani: 'گەڕان بکە...',
    kurmanji: 'Lêgerîn bike...',
    english: 'Search...'
  }
  return placeholders[currentDialect.value.id] || placeholders.sorani
})

// ============================================
// METHODS
// ============================================

// Language
const toggleLangMenu = () => {
  langMenuOpen.value = !langMenuOpen.value
}

const selectDialect = (dialect) => {
  currentDialect.value = dialect
  langMenuOpen.value = false
  document.documentElement.dir = dialect.dir
  document.documentElement.lang = dialect.code
}

// Search
const openSearch = () => {
  searchOpen.value = true
  document.body.style.overflow = 'hidden'
  nextTick(() => {
    searchInputRef.value?.focus()
  })
}

const closeSearch = () => {
  searchOpen.value = false
  searchQuery.value = ''
  document.body.style.overflow = ''
}

const performSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({ path: '/search', query: { q: searchQuery.value } })
    closeSearch()
    closeMobileMenu()
  }
}

// Mobile Menu
const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
  document.body.style.overflow = mobileMenuOpen.value ? 'hidden' : ''
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
  document.body.style.overflow = ''
}

// Scroll Handler
const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

// Click Outside Handler
const handleClickOutside = (event) => {
  if (langSwitcherRef.value && !langSwitcherRef.value.contains(event.target)) {
    langMenuOpen.value = false
  }
}

// Keyboard Handler
const handleKeydown = (event) => {
  if (event.key === 'Escape') {
    if (searchOpen.value) closeSearch()
    if (mobileMenuOpen.value) closeMobileMenu()
    if (langMenuOpen.value) langMenuOpen.value = false
  }
}

// ============================================
// LIFECYCLE
// ============================================
onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleKeydown)

  document.documentElement.dir = currentDialect.value.dir
  document.documentElement.lang = currentDialect.value.code
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleKeydown)
})

watch(() => router.currentRoute.value, () => {
  closeMobileMenu()
})
</script>

<style scoped>
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

  --link-blue: #006CB8;
  --link-blue-dark: #00548F;

  --font-sans: 'Noto Sans Arabic', 'Source Sans 3', system-ui, sans-serif;
  --font-display: 'Noto Kufi Arabic', 'Source Serif 4', Georgia, serif;

  --transition-fast: 150ms ease;
  --transition-normal: 300ms ease;
  --transition-slow: 400ms ease;

  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.08);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 12px 32px rgba(0, 0, 0, 0.15);
  --shadow-xl: 0 24px 48px rgba(0, 0, 0, 0.2);

  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;

  --container-max: 1500px;
}

/* ============================================
   BRAND BAR
   ============================================ */
.brand-bar {
  background-color: var(--brand-primary);
  padding: 0.625rem 0;
}

.brand-bar__container {
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

@media (min-width: 768px) {
  .brand-bar__container {
    padding: 0 2rem;
  }
}

@media (min-width: 1024px) {
  .brand-bar__container {
    padding: 0 3rem;
  }
}

.brand-bar__logo {
  display: flex;
  align-items: center;
  color: var(--white);
  text-decoration: none;
  transition: opacity var(--transition-fast);
}

.brand-bar__logo:hover {
  opacity: 0.9;
}

.brand-bar__logo-text {
  font-family: var(--font-display);
  font-size: 1.0625rem;
  font-weight: 700;
  letter-spacing: 0.01em;
}

@media (min-width: 768px) {
  .brand-bar__logo-text {
    font-size: 1.125rem;
  }
}

.brand-bar__links {
  display: none;
  align-items: center;
  gap: 1.25rem;
}

@media (min-width: 1024px) {
  .brand-bar__links {
    display: flex;
  }
}

.brand-bar__label {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.8125rem;
  font-weight: 500;
}

.brand-bar__link {
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.8125rem;
  font-weight: 400;
  text-decoration: none;
  position: relative;
  transition: color var(--transition-fast);
}

.brand-bar__link::after {
  content: '';
  position: absolute;
  bottom: -3px;
  right: 0;
  width: 0;
  height: 1px;
  background-color: var(--white);
  transition: width var(--transition-normal);
}

[dir="ltr"] .brand-bar__link::after {
  right: auto;
  left: 0;
}

.brand-bar__link:hover {
  color: var(--white);
}

.brand-bar__link:hover::after {
  width: 100%;
}

.brand-bar__search-btn {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-right: 0.75rem;
  padding: 0.4rem 0.875rem;
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-sm);
  color: var(--white);
  font-family: var(--font-sans);
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
}

[dir="ltr"] .brand-bar__search-btn {
  margin-right: 0;
  margin-left: 0.75rem;
}

.brand-bar__search-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
}

/* Mobile Toggle */
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

@media (min-width: 1024px) {
  .mobile-toggle {
    display: none;
  }
}

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
  height: 2px;
  background-color: var(--white);
  border-radius: 2px;
  transition: all var(--transition-normal);
  transform-origin: center;
}

.hamburger span:nth-child(3) {
  width: 65%;
  margin-right: auto;
}

[dir="ltr"] .hamburger span:nth-child(3) {
  margin-right: 0;
  margin-left: auto;
}

.hamburger.is-active span:nth-child(1) {
  transform: translateY(7px) rotate(45deg);
}

.hamburger.is-active span:nth-child(2) {
  opacity: 0;
  transform: scaleX(0);
}

.hamburger.is-active span:nth-child(3) {
  width: 100%;
  transform: translateY(-7px) rotate(-45deg);
}

/* ============================================
   MAIN NAVIGATION
   ============================================ */
.main-nav {
  background-color: var(--white);
  border-bottom: 1px solid var(--grey-100);
  position: sticky;
  top: 0;
  z-index: 100;
  transition: box-shadow var(--transition-normal);
}

.main-nav.is-scrolled {
  box-shadow: var(--shadow-md);
}

.main-nav__container {
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
}

@media (min-width: 768px) {
  .main-nav__container {
    padding: 0 2rem;
    height: 60px;
  }
}

@media (min-width: 1024px) {
  .main-nav__container {
    padding: 0 3rem;
    height: 64px;
  }
}

@media (min-width: 1280px) {
  .main-nav__container {
    height: 70px;
  }
}

.main-nav__menu {
  display: none;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 0.125rem;
}

@media (min-width: 1024px) {
  .main-nav__menu {
    display: flex;
  }
}

.main-nav__link {
  display: block;
  padding: 0.5rem 0.875rem;
  font-family: var(--font-sans);
  font-size: 0.9375rem;
  font-weight: 400;
  color: var(--grey-900);
  text-decoration: none;
  border-radius: var(--radius-sm);
  position: relative;
  transition: all var(--transition-fast);
}

@media (min-width: 1280px) {
  .main-nav__link {
    padding: 0.5rem 1.125rem;
    font-size: 1rem;
  }
}

.main-nav__link::after {
  content: '';
  position: absolute;
  bottom: 0;
  right: 0;
  left: 0;
  height: 3px;
  background-color: var(--brand-primary);
  border-radius: 3px 3px 0 0;
  transform: scaleX(0);
  transition: transform var(--transition-normal);
}

.main-nav__link:hover {
  color: var(--brand-primary);
  background-color: var(--grey-50);
}

.main-nav__link:hover::after,
.main-nav__link.is-active::after,
.main-nav__link.is-exact-active::after {
  transform: scaleX(1);
}

.main-nav__link.is-active,
.main-nav__link.is-exact-active {
  color: var(--brand-primary);
  font-weight: 600;
}

/* ============================================
   LANGUAGE SWITCHER
   (UPDATED: fixed dropdown "extra left space" + no hover shifting)
   ============================================ */
.lang-switcher {
  position: relative;
}

.lang-switcher__trigger {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.65rem 1rem;
  background: linear-gradient(135deg, #ffffff 0%, #f9f9f9 100%);
  border: 2px solid #e4e4e1;
  border-radius: 10px;
  font-family: var(--font-sans);
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  font-weight: 600;
  color: #2e2d29;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.lang-switcher__trigger:hover {
  background: linear-gradient(135deg, #f9f9f9 0%, #f0f0f0 100%);
  border-color: #8C1515;
  box-shadow: 0 8px 24px rgba(140, 21, 21, 0.18),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  transform: translateY(-2px);
}

.lang-switcher__flag {
  width: 26px;
  height: 17px;
  border-radius: 3px;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12),
    0 0 0 1.5px rgba(255, 255, 255, 0.8);
  flex-shrink: 0;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.lang-switcher__trigger:hover .lang-switcher__flag {
  box-shadow: 0 4px 12px rgba(140, 21, 21, 0.15),
    0 0 0 1.5px rgba(255, 255, 255, 0.9);
  transform: scale(1.08);
}

.lang-switcher__flag svg {
  width: 100%;
  height: 100%;
  display: block;
}

.lang-switcher__text {
  font-size: 0.9rem;
  font-weight: 700;
  color: #2e2d29;
  transition: color 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.lang-switcher__trigger:hover .lang-switcher__text {
  color: #8C1515;
}

.lang-switcher__chevron {
  color: #8C1515;
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  flex-shrink: 0;
  font-weight: bold;
}

.lang-switcher__chevron.is-rotated {
  transform: rotate(180deg) scale(1.15);
}

/* Dropdown (FIXED ALIGNMENT + no off-screen / no left gap) */
.lang-dropdown {
  position: absolute;
  top: calc(100% + 10px);

  /* RTL default: anchor to end */
  inset-inline-end: 0;
  inset-inline-start: auto;

  width: max-content;
  min-width: 280px;
  max-width: min(360px, calc(100vw - 24px));

  background-color: #ffffff;
  border: 2px solid #e4e4e1;
  border-radius: 14px;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.14),
    0 0 1px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
  overflow: hidden;
  z-index: 200;
  animation: dropdown-scale 0.4s cubic-bezier(0.16, 1, 0.3, 1);

  /* keep away from the screen edges */
  margin-inline: 12px;

  transform-origin: top right;
}

[dir="ltr"] .lang-dropdown {
  inset-inline-start: 0;
  inset-inline-end: auto;
  transform-origin: top left;
}

.lang-dropdown__header {
  padding: 1rem 1.5rem;
  font-size: 0.65rem;
  font-weight: 800;
  color: #767671;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  background: linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%);
  border-bottom: 2px solid #e8e8e5;
}

.lang-dropdown__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  /* IMPORTANT: no hover padding changes (no shifting) */
  padding: 1rem 1.25rem;

  background-color: transparent;
  border: none;

  /* active border without layout shift */
  box-shadow: inset 4px 0 0 transparent;

  font-family: var(--font-sans);
  text-align: start;
  cursor: pointer;
  transition: background 0.25s ease, box-shadow 0.25s ease, color 0.25s ease;
}

[dir="ltr"] .lang-dropdown__item {
  box-shadow: inset -4px 0 0 transparent;
}

.lang-dropdown__item:hover {
  background: linear-gradient(135deg, #ffffff 0%, #fafafa 100%);
  box-shadow: inset 4px 0 0 #8C1515;
}

[dir="ltr"] .lang-dropdown__item:hover {
  box-shadow: inset -4px 0 0 #8C1515;
}

.lang-dropdown__item.is-active {
  background: linear-gradient(135deg, rgba(140, 21, 21, 0.10) 0%, rgba(140, 21, 21, 0.05) 100%);
  box-shadow: inset 4px 0 0 #8C1515;
}

[dir="ltr"] .lang-dropdown__item.is-active {
  box-shadow: inset -4px 0 0 #8C1515;
}

.lang-dropdown__info {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  text-align: start;
}

.lang-dropdown__name {
  font-size: 0.975rem;
  font-weight: 700;
  color: #2e2d29;
}

.lang-dropdown__item:hover .lang-dropdown__name,
.lang-dropdown__item.is-active .lang-dropdown__name {
  color: #8C1515;
}

.lang-dropdown__desc {
  font-size: 0.75rem;
  color: #a6a5a0;
}

.lang-dropdown__item:hover .lang-dropdown__desc {
  color: #8C1515;
  opacity: 0.9;
}

.lang-dropdown__check {
  color: #8C1515;
  flex-shrink: 0;
  animation: check-bounce 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

/* Dropdown Animation */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-16px) scale(0.94);
}

@keyframes dropdown-scale {
  from {
    opacity: 0;
    transform: translateY(-16px) scale(0.92);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes check-bounce {
  0% {
    opacity: 0;
    transform: scale(0.6) rotate(-30deg);
  }

  50% {
    transform: scale(1.2) rotate(10deg);
  }

  100% {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
}

/* ============================================
   SEARCH OVERLAY
   ============================================ */
.search-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.95);
  z-index: 1000;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 12vh 1.5rem 2rem;
  overflow-y: auto;
}

.search-overlay__content {
  width: 100%;
  max-width: 700px;
  position: relative;
}

.search-overlay__close {
  position: fixed;
  top: 1.5rem;
  left: 1.5rem;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  color: var(--white);
  cursor: pointer;
  transition: all var(--transition-fast);
}

[dir="rtl"] .search-overlay__close {
  left: auto;
  right: 1.5rem;
}

.search-overlay__close:hover {
  background-color: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.3);
}

.search-overlay__title {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--white);
  text-align: center;
  margin-bottom: 2rem;
}

.search-overlay__form {
  display: flex;
  background-color: var(--white);
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-xl);
}

.search-overlay__input {
  flex: 1;
  padding: 1.125rem 1.5rem;
  font-family: var(--font-sans);
  font-size: 1.0625rem;
  border: none;
  outline: none;
  background-color: transparent;
}

.search-overlay__submit {
  padding: 1.125rem 1.5rem;
  background-color: var(--brand-primary);
  border: none;
  color: var(--white);
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

.search-overlay__submit:hover {
  background-color: var(--brand-primary-dark);
}

.search-overlay__quick {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1.75rem;
}

.search-overlay__quick-label {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.875rem;
}

.search-overlay__quick-link {
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.875rem;
  padding: 0.375rem 0.875rem;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 100px;
  text-decoration: none;
  transition: all var(--transition-fast);
}

.search-overlay__quick-link:hover {
  background-color: rgba(255, 255, 255, 0.2);
  color: var(--white);
}

/* Search Overlay Animation */
.search-fade-enter-active,
.search-fade-leave-active {
  transition: opacity var(--transition-slow);
}

.search-fade-enter-active .search-overlay__content,
.search-fade-leave-active .search-overlay__content {
  transition: transform var(--transition-slow), opacity var(--transition-slow);
}

.search-fade-enter-from,
.search-fade-leave-to {
  opacity: 0;
}

.search-fade-enter-from .search-overlay__content,
.search-fade-leave-to .search-overlay__content {
  opacity: 0;
  transform: translateY(-16px);
}

/* ============================================
   MOBILE MENU
   ============================================ */
.mobile-menu {
  position: fixed;
  inset: 0;
  z-index: 1000;
}

.mobile-menu__overlay {
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
}

.mobile-menu__drawer {
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  max-width: 360px;
  height: 100%;
  background-color: var(--white);
  overflow-y: auto;
  box-shadow: var(--shadow-xl);
  display: flex;
  flex-direction: column;
}

[dir="ltr"] .mobile-menu__drawer {
  right: auto;
  left: 0;
}

.mobile-menu__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  background-color: var(--brand-primary);
  color: var(--white);
}

.mobile-menu__logo {
  font-family: var(--font-display);
  font-size: 0.9375rem;
  font-weight: 700;
}

.mobile-menu__close {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 50%;
  color: var(--white);
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

.mobile-menu__close:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.mobile-menu__search {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  background-color: var(--grey-50);
  border-bottom: 1px solid var(--grey-100);
}

.mobile-menu__search svg {
  color: var(--grey-500);
  flex-shrink: 0;
}

.mobile-menu__search input {
  flex: 1;
  padding: 0.625rem 0;
  font-family: var(--font-sans);
  font-size: 0.9375rem;
  border: none;
  background-color: transparent;
  outline: none;
}

.mobile-menu__nav {
  flex: 1;
  padding: 0.5rem 0;
}

.mobile-menu__link {
  display: block;
  padding: 1rem 1.25rem;
  font-size: 1rem;
  font-weight: 500;
  color: var(--grey-900);
  text-decoration: none;
  border-bottom: 1px solid var(--grey-100);
  transition: all var(--transition-fast);
}

.mobile-menu__link:hover,
.mobile-menu__link.router-link-active {
  background-color: var(--grey-50);
  color: var(--brand-primary);
}

.mobile-menu__lang {
  padding: 1.25rem;
  border-top: 1px solid var(--grey-100);
}

.mobile-menu__lang-title {
  display: block;
  font-size: 0.6875rem;
  font-weight: 700;
  color: var(--grey-500);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 0.75rem;
}

.mobile-menu__lang-btns {
  display: flex;
  gap: 0.5rem;
}

.mobile-menu__lang-btn {
  flex: 1;
  padding: 0.625rem 0.75rem;
  background-color: var(--grey-50);
  border: 1px solid var(--grey-200);
  border-radius: var(--radius-md);
  font-family: var(--font-sans);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--grey-700);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.mobile-menu__lang-btn:hover {
  border-color: var(--grey-300);
}

.mobile-menu__lang-btn.is-active {
  background-color: var(--brand-primary);
  border-color: var(--brand-primary);
  color: var(--white);
}

.mobile-menu__quick {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.625rem;
  padding: 1.25rem;
  background-color: var(--grey-50);
}

.mobile-menu__quick a {
  padding: 0.75rem;
  background-color: var(--white);
  border: 1px solid var(--grey-200);
  border-radius: var(--radius-md);
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--grey-700);
  text-align: center;
  text-decoration: none;
  transition: all var(--transition-fast);
}

.mobile-menu__quick a:hover {
  border-color: var(--brand-primary);
  color: var(--brand-primary);
}

/* Mobile Menu Animation */
.mobile-slide-enter-active,
.mobile-slide-leave-active {
  transition: opacity var(--transition-normal);
}

.mobile-slide-enter-active .mobile-menu__drawer,
.mobile-slide-leave-active .mobile-menu__drawer {
  transition: transform var(--transition-normal);
}

.mobile-slide-enter-from,
.mobile-slide-leave-to {
  opacity: 0;
}

.mobile-slide-enter-from .mobile-menu__drawer,
.mobile-slide-leave-to .mobile-menu__drawer {
  transform: translateX(100%);
}

[dir="ltr"] .mobile-slide-enter-from .mobile-menu__drawer,
[dir="ltr"] .mobile-slide-leave-to .mobile-menu__drawer {
  transform: translateX(-100%);
}
</style>
