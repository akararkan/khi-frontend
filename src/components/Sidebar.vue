<template>
  <aside class="side" :class="{ 'side--slim': slim }">

    <!-- Atmospheric background layers -->
    <div class="side__bg">
      <div class="side__bg-orb side__bg-orb--1"></div>
      <div class="side__bg-orb side__bg-orb--2"></div>
      <div class="side__bg-orb side__bg-orb--3"></div>
      <div class="side__bg-grid"></div>
      <div class="side__bg-noise"></div>
      <div class="side__bg-vignette"></div>
    </div>

    <!-- ═══ BRAND ════════════════════════════════════════ -->
    <div class="brand">
      <div class="brand__gem" @click="slim && toggleSlim(false)" :class="{ 'brand__gem--clickable': slim }">
        <span class="brand__gem-inner">KHI</span>
        <div class="brand__gem-ring"></div>
        <div class="brand__gem-ring brand__gem-ring--outer"></div>
        <div class="brand__gem-glow"></div>
        <div class="brand__gem-shimmer"></div>
      </div>
      <Transition name="slide-fade">
        <div v-if="!slim" class="brand__copy">
          <div class="brand__title">داشبۆرد</div>
          <div class="brand__sub">ناوەندی کەلەپووری کوردی</div>
        </div>
      </Transition>
      <Transition name="slide-fade">
        <button v-if="!slim" class="brand__collapse" @click="toggleSlim(true)" title="تەنگکردن">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8l5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </Transition>
    </div>

    <!-- Slim: expand trigger -->
    <Transition name="pop">
      <button v-if="slim" class="expand-fab" @click="toggleSlim(false)" title="فراوانکردن">
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
          <path d="M6 3l5 5-5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </Transition>

    <!-- ═══ NAV (scrollable) ═════════════════════════════ -->
    <nav class="nav" ref="navEl">

      <!-- Home -->
      <RouterLink class="nav-item" to="/admin" exact-active-class="nav-item--active">
        <span class="nav-item__ico">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
        </span>
        <Transition name="label"><span v-if="!slim" class="nav-item__label">سەرەکی</span></Transition>
        <Transition name="label"><span v-if="!slim" class="nav-item__arrow"><ArrowIcon /></span></Transition>
      </RouterLink>

      <!-- Section divider -->
      <div class="nav-divider">
        <Transition name="label">
          <span v-if="!slim" class="nav-divider__text">ناوەڕۆک</span>
        </Transition>
        <span v-if="slim" class="nav-divider__line"></span>
      </div>

      <!-- Projects -->
      <RouterLink
        class="nav-item"
        :to="{ name: 'AdminProjectList' }"
        :class="{ 'nav-item--active': isActive('projects') }"
        title="پڕۆژەکان"
      >
        <span class="nav-item__ico" v-html="SVGs.projects"></span>
        <Transition name="label"><span v-if="!slim" class="nav-item__label">پڕۆژەکان</span></Transition>
        <Transition name="label"><span v-if="!slim" class="nav-item__arrow"><ArrowIcon /></span></Transition>
      </RouterLink>

      <!-- News -->
      <RouterLink
        class="nav-item"
        :to="{ name: 'AdminNewsList' }"
        :class="{ 'nav-item--active': isActive('news') }"
        title="هەواڵەکان"
      >
        <span class="nav-item__ico" v-html="SVGs.news"></span>
        <Transition name="label"><span v-if="!slim" class="nav-item__label">هەواڵەکان</span></Transition>
        <Transition name="label"><span v-if="!slim" class="nav-item__arrow"><ArrowIcon /></span></Transition>
      </RouterLink>

      <!-- Services -->
      <RouterLink
        class="nav-item"
        :to="{ name: 'AdminServiceList' }"
        :class="{ 'nav-item--active': isActive('services') }"
        title="خزمەتگوزارییەکان"
      >
        <span class="nav-item__ico" v-html="SVGs.services"></span>
        <Transition name="label"><span v-if="!slim" class="nav-item__label">خزمەتگوزارییەکان</span></Transition>
        <Transition name="label"><span v-if="!slim" class="nav-item__arrow"><ArrowIcon /></span></Transition>
      </RouterLink>

      <!-- ── Publications Accordion (wide mode) ── -->
      <div v-if="!slim" class="accordion">
        <button
          class="nav-item nav-item--btn"
          :class="{ 'nav-item--active': isPublicationsActive }"
          @click="togglePub"
        >
          <span class="nav-item__ico">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/>
              <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/>
            </svg>
          </span>
          <span class="nav-item__label">بڵاوکراوەکان</span>
          <span class="nav-item__chevron" :class="{ open: pubOpen }">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M3 4.5l3 3 3-3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
            </svg>
          </span>
        </button>

        <Transition name="accordion">
          <div v-if="pubOpen" class="sub-list">
            <div class="sub-list__track"></div>
            <RouterLink
              v-for="item in publicationItems"
              :key="item.key"
              class="sub-item"
              :to="item.to"
              :class="{ 'sub-item--active': isActive(item.key) }"
            >
              <span class="sub-item__dot" :style="{ background: item.color }"></span>
              <span class="sub-item__ico" v-html="item.icon"></span>
              <span class="sub-item__label">{{ item.label }}</span>
            </RouterLink>
          </div>
        </Transition>
      </div>

      <!-- ── Publications slim mode (icons only) ── -->
      <template v-if="slim">
        <RouterLink
          v-for="item in publicationItems"
          :key="item.key"
          class="nav-item"
          :to="item.to"
          :class="{ 'nav-item--active': isActive(item.key) }"
          :title="item.label"
        >
          <span class="nav-item__ico" v-html="item.icon"></span>
        </RouterLink>
      </template>

      <!-- Section divider -->
      <div class="nav-divider">
        <Transition name="label">
          <span v-if="!slim" class="nav-divider__text">ڕێکخستن</span>
        </Transition>
        <span v-if="slim" class="nav-divider__line"></span>
      </div>

      <!-- About -->
      <RouterLink
        class="nav-item"
        :to="{ name: 'AdminAboutList' }"
        :class="{ 'nav-item--active': isActive('about') }"
        title="دەربارەکان"
      >
        <span class="nav-item__ico" v-html="SVGs.about"></span>
        <Transition name="label"><span v-if="!slim" class="nav-item__label">دەربارەکان</span></Transition>
        <Transition name="label"><span v-if="!slim" class="nav-item__arrow"><ArrowIcon /></span></Transition>
      </RouterLink>

      <!-- Contact -->
      <RouterLink
        class="nav-item"
        :to="{ name: 'AdminContactList' }"
        :class="{ 'nav-item--active': isActive('contact') }"
        title="پەیوەندیەکان"
      >
        <span class="nav-item__ico" v-html="SVGs.contact"></span>
        <Transition name="label"><span v-if="!slim" class="nav-item__label">پەیوەندیەکان</span></Transition>
        <Transition name="label"><span v-if="!slim" class="nav-item__arrow"><ArrowIcon /></span></Transition>
      </RouterLink>

    </nav>

    <!-- ═══ FOOTER ════════════════════════════════════════ -->
    <div class="side-foot">
      <Transition name="slide-fade">
        <div v-if="!slim" class="side-foot__user">
          <div class="side-foot__avatar">
            <span>{{ (auth.username || 'A').charAt(0).toUpperCase() }}</span>
          </div>
          <div class="side-foot__info">
            <span class="side-foot__name">{{ auth.username || 'ئەدمین' }}</span>
            <span class="side-foot__role">{{ auth.role || 'Administrator' }}</span>
          </div>
        </div>
      </Transition>

      <button class="logout-btn" @click="doLogout" :title="slim ? 'چوونەدەرەوە' : ''">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
          <polyline points="16 17 21 12 16 7"/>
          <line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
        <Transition name="label">
          <span v-if="!slim">چوونەدەرەوە</span>
        </Transition>
      </button>
    </div>

  </aside>
</template>

<script setup>
import { ref, computed, defineComponent, h, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'
import { useAdminStore } from '@/stores/useAdminStore'

const router = useRouter()
const route  = useRoute()
const auth   = useAuthStore()
const adminStore = useAdminStore()

// ── Persistent sidebar state (survives reload) ──────────────
const slim    = ref(adminStore.sidebarSlim)
const pubOpen = ref(adminStore.pubAccordionOpen)
const navEl   = ref(null)

function toggleSlim(value) {
  slim.value = value
  adminStore.sidebarSlim = value
}

function togglePub() {
  pubOpen.value = !pubOpen.value
  adminStore.pubAccordionOpen = pubOpen.value
}

// ── Tiny inline Arrow component ─────────────────────────────
const ArrowIcon = defineComponent({
  setup: () => () => h('svg', { width:12, height:12, viewBox:'0 0 12 12', fill:'none' },
    [h('path', { d:'M4.5 2.5L8 6l-3.5 3.5', stroke:'currentColor', 'stroke-width':'1.5', 'stroke-linecap':'round' })]
  )
})

// ── Icons ───────────────────────────────────────────────────
const SVGs = {
  projects: `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>`,
  news:     `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 22h16a2 2 0 002-2V4a2 2 0 00-2-2H8a2 2 0 00-2 2v16a2 2 0 01-2 2z"/><path d="M18 14h-8M15 18h-5M10 6h8v4h-8z"/></svg>`,
  services: `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="3.25"/><path d="M19.4 15a1 1 0 00.2 1.1l.04.04a2 2 0 01-2.83 2.83l-.04-.04a1 1 0 00-1.1-.2 1 1 0 00-.6.92V21a2 2 0 01-4 0v-.06a1 1 0 00-.67-.94 1 1 0 00-1.1.2l-.04.04a2 2 0 01-2.83-2.83l.04-.04a1 1 0 00.2-1.1 1 1 0 00-.92-.6H3a2 2 0 010-4h.06a1 1 0 00.94-.67 1 1 0 00-.2-1.1l-.04-.04a2 2 0 012.83-2.83l.04.04a1 1 0 001.1.2H7.8a1 1 0 00.6-.92V3a2 2 0 014 0v.06a1 1 0 00.67.94 1 1 0 001.1-.2l.04-.04a2 2 0 012.83 2.83l-.04.04a1 1 0 00-.2 1.1v.07a1 1 0 00.92.6H21a2 2 0 010 4h-.06a1 1 0 00-.94.67 1 1 0 00.2 1.1z"/></svg>`,
  images:   `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`,
  videos:   `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="2" y="7" width="15" height="10" rx="1.5"/><path d="M17 9l4-2v10l-4-2V9z"/></svg>`,
  sounds:   `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`,
  writings: `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4z"/></svg>`,
  about:    `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>`,
  contact:  `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.1 1.22 2 2 0 012.1 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z"/></svg>`,
}

const publicationItems = [
  { key: 'videos',            label: 'ڤیدیۆکان',       to: { name: 'AdminVideoList' },           icon: SVGs.videos,   color: '#f59e0b' },
  { key: 'soundtracks',       label: 'دەنگەکان',        to: { name: 'AdminSoundTrackList' },       icon: SVGs.sounds,   color: '#ec4899' },
  { key: 'image-collections', label: 'کۆمەڵە وێنەکان',  to: { name: 'AdminImageCollectionList' }, icon: SVGs.images,   color: '#a78bfa' },
  { key: 'writings',          label: 'نووسراوەکان',     to: { name: 'AdminWritingList' },          icon: SVGs.writings, color: '#60a5fa' },
]

const isPublicationsActive = computed(() => publicationItems.some(i => isActive(i.key)))

const isActive = (key) => {
  const routeMap = {
    projects:            { names: ['AdminProjectList','AdminProjectCreate','AdminProjectEdit'],                           prefix: '/admin/projects' },
    news:                { names: ['AdminNewsList','AdminNewsCreate','AdminNewsEdit'],                                    prefix: '/admin/news' },
    services:            { names: ['AdminServiceList','AdminServiceCreate','AdminServiceEdit'],                           prefix: '/admin/services' },
    'image-collections': { names: ['AdminImageCollectionList','AdminImageCollectionCreate','AdminImageCollectionEdit'],  prefix: '/admin/image-collections' },
    soundtracks:         { names: ['AdminSoundTrackList','AdminSoundTrackCreate','AdminSoundTrackEdit'],                  prefix: '/admin/soundtracks' },
    videos:              { names: ['AdminVideoList','AdminVideoCreate','AdminVideoEdit'],                                 prefix: '/admin/videos' },
    writings:            { names: ['AdminWritingList','AdminWritingCreate','AdminWritingEdit'],                           prefix: '/admin/writings' },
    about:               { names: ['AdminAboutList','AdminAboutCreate','AdminAboutEdit'],                                 prefix: '/admin/about' },
    contact:             { names: ['AdminContactList','AdminContactCreate','AdminContactEdit'],                           prefix: '/admin/contact' },
  }
  const m = routeMap[key]
  return m ? m.names.includes(route.name || '') || (route.path || '').startsWith(m.prefix) : false
}

const doLogout = async () => {
  await auth.logout()
  window.location.href = '/login?logout=1'
}
</script>

<style scoped>
/* ── Design Tokens ─────────────────────────────────────── */
.side {
  --s-bg1:     #200404;
  --s-bg2:     #6B0F0F;
  --s-bg3:     #420C0C;
  --s-gold:    #FEDD00;
  --s-gold-a:  rgba(254,221,0,.14);
  --s-white:   rgba(255,255,255,.9);
  --s-dim:     rgba(255,255,255,.55);
  --s-faint:   rgba(255,255,255,.06);
  --s-border:  rgba(255,255,255,.09);
  --s-hover:   rgba(255,255,255,.08);
  --s-active:  rgba(254,221,0,.12);

  --s-gold-dim:   rgba(254,221,0,.55);
  --s-gold-soft:  rgba(254,221,0,.18);
  --s-gold-ghost: rgba(254,221,0,.07);
  --s-gold-glow:  rgba(254,221,0,.28);
  --s-faint-text: rgba(255,255,255,.28);
  --s-glass:      rgba(255,255,255,.042);
  --s-glass-hi:   rgba(255,255,255,.075);
  --s-border-hi:  rgba(255,255,255,.13);

  --s-rad:        12px;
  --s-rad-sm:     9px;

  --s-ease:       cubic-bezier(.4,0,.2,1);
  --s-spring:     cubic-bezier(.34,1.56,.64,1);
  --s-trans:      .22s var(--s-ease);
  --s-trans-slow: .35s var(--s-ease);

  width: 276px;
  flex: 0 0 276px;
  height: 100vh;
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: width var(--s-trans-slow), flex-basis var(--s-trans-slow);
  z-index: 100;
  font-family: inherit;
}
.side--slim { width: 74px; flex: 0 0 74px; }

.side::after {
  content: '';
  position: absolute;
  top: 0; right: 0; bottom: 0;
  width: 1px;
  background: linear-gradient(
    180deg,
    transparent 0%,
    rgba(254,221,0,.12) 20%,
    rgba(254,221,0,.22) 50%,
    rgba(254,221,0,.12) 80%,
    transparent 100%
  );
  pointer-events: none;
  z-index: 10;
}

/* ── Atmospheric BG ────────────────────────────────────── */
.side__bg {
  position: absolute; inset: 0; pointer-events: none; z-index: 0;
  background:
    radial-gradient(ellipse 130% 55% at 65% 0%,  var(--s-bg2) 0%, transparent 60%),
    radial-gradient(ellipse 80%  70% at 0%  100%, var(--s-bg3) 0%, transparent 65%),
    linear-gradient(175deg, var(--s-bg1) 0%, var(--s-bg2) 55%, var(--s-bg3) 100%);
}

.side__bg-orb {
  position: absolute; border-radius: 50%; pointer-events: none;
  filter: blur(1px);
}
.side__bg-orb--1 {
  width: 320px; height: 320px; top: -140px; right: -80px;
  background: radial-gradient(circle, rgba(254,221,0,.12) 0%, rgba(107,15,15,.18) 40%, transparent 70%);
  animation: orb1 14s ease-in-out infinite alternate;
}
.side__bg-orb--2 {
  width: 200px; height: 200px; bottom: 40px; left: -80px;
  background: radial-gradient(circle, rgba(200,30,30,.15) 0%, rgba(254,221,0,.06) 45%, transparent 70%);
  animation: orb2 18s ease-in-out infinite alternate;
}
.side__bg-orb--3 {
  width: 140px; height: 140px; top: 45%; left: 50%;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(254,221,0,.05) 0%, transparent 70%);
  animation: orb3 22s ease-in-out infinite alternate;
}

.side__bg-grid {
  position: absolute; inset: 0;
  background-image: radial-gradient(rgba(255,255,255,.06) 1px, transparent 1px);
  background-size: 22px 22px;
  mask-image: linear-gradient(180deg, transparent 0%, rgba(0,0,0,.4) 20%, rgba(0,0,0,.4) 80%, transparent 100%);
}

.side__bg-noise {
  position: absolute; inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
  background-size: 160px;
  opacity: .025;
  mix-blend-mode: overlay;
}

.side__bg-vignette {
  position: absolute; inset: 0;
  background:
    linear-gradient(90deg, rgba(0,0,0,.3) 0%, transparent 40%),
    linear-gradient(270deg, rgba(0,0,0,.25) 0%, transparent 35%);
  pointer-events: none;
}

@keyframes orb1 { 0%{transform:translate(0,0) scale(1)} 100%{transform:translate(-18px,25px) scale(1.05)} }
@keyframes orb2 { 0%{transform:translate(0,0) scale(1)} 100%{transform:translate(16px,-20px) scale(.95)} }
@keyframes orb3 { 0%{transform:translate(-50%,-50%) scale(.8); opacity:.4} 100%{transform:translate(-50%,-50%) scale(1.2); opacity:.8} }

.brand, .nav, .side-foot, .expand-fab { position: relative; z-index: 1; }

/* ── BRAND ─────────────────────────────────────────────── */
.brand {
  display: flex; align-items: center; gap: .85rem;
  padding: 1.2rem 1rem 1.15rem;
  border-bottom: 1px solid var(--s-border);
  min-height: 72px; flex-shrink: 0;
  position: relative;
  background: linear-gradient(180deg, rgba(254,221,0,.03) 0%, transparent 100%);
}

.brand::after {
  content: '';
  position: absolute; bottom: 0; left: 16px; right: 16px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(254,221,0,.2), transparent);
}

.brand__gem {
  width: 46px; height: 46px; flex: 0 0 46px;
  border-radius: 15px; position: relative;
  background:
    linear-gradient(145deg, rgba(254,221,0,.2) 0%, rgba(254,221,0,.04) 100%);
  border: 1.5px solid rgba(254,221,0,.35);
  display: flex; align-items: center; justify-content: center;
  box-shadow:
    0 0 0 4px rgba(254,221,0,.05),
    0 4px 20px rgba(0,0,0,.45),
    inset 0 1px 0 rgba(255,255,255,.15),
    inset 0 -1px 0 rgba(0,0,0,.3);
  transition: var(--s-trans);
}
.brand__gem--clickable { cursor: pointer; }
.brand__gem--clickable:hover {
  border-color: rgba(254,221,0,.65);
  box-shadow:
    0 0 0 6px rgba(254,221,0,.08),
    0 0 28px rgba(254,221,0,.22),
    0 8px 24px rgba(0,0,0,.5),
    inset 0 1px 0 rgba(255,255,255,.2);
  transform: scale(1.05) translateY(-1px);
}

.brand__gem-inner {
  font-weight: 900; font-size: .82rem;
  color: var(--s-gold);
  letter-spacing: .1em;
  position: relative; z-index: 2;
  text-shadow: 0 0 12px rgba(254,221,0,.6);
}

.brand__gem-ring {
  position: absolute; inset: -6px; border-radius: 20px;
  border: 1px solid rgba(254,221,0,.1);
  animation: spin-slow 24s linear infinite;
}
.brand__gem-ring--outer {
  inset: -11px; border-radius: 24px;
  border: 1px dashed rgba(254,221,0,.06);
  animation-duration: 40s;
  animation-direction: reverse;
}

.brand__gem-glow {
  position: absolute; inset: -2px; border-radius: inherit;
  background: radial-gradient(ellipse at 35% 30%, rgba(254,221,0,.35), transparent 65%);
  opacity: .5; z-index: 1; pointer-events: none;
}
.brand__gem-shimmer {
  position: absolute; inset: 0; border-radius: inherit;
  background: linear-gradient(135deg, rgba(255,255,255,.12) 0%, transparent 50%, rgba(255,255,255,.04) 100%);
  z-index: 1; pointer-events: none;
}

@keyframes spin-slow { to { transform: rotate(360deg); } }

.brand__copy { flex: 1; min-width: 0; }
.brand__title {
  font-family: 'Tajawal', sans-serif;
  font-weight: 900; font-size: .95rem;
  color: var(--s-white);
  white-space: nowrap;
  letter-spacing: -.01em;
}
.brand__sub {
  font-size: .69rem; color: var(--s-dim); margin-top: .12rem;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  letter-spacing: .01em;
}
.brand__collapse {
  width: 30px; height: 30px; flex: 0 0 30px; border-radius: 9px;
  background: var(--s-glass); border: 1px solid var(--s-border);
  color: var(--s-dim); cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: var(--s-trans); margin-right: auto;
}
.brand__collapse:hover {
  background: var(--s-glass-hi);
  border-color: var(--s-border-hi);
  color: var(--s-white);
  box-shadow: 0 2px 10px rgba(0,0,0,.3);
}

/* ── Expand FAB (slim) ─────────────────────────────────── */
.expand-fab {
  display: flex; align-items: center; justify-content: center;
  width: 40px; height: 40px; margin: .6rem auto .25rem;
  border-radius: 13px;
  background: var(--s-glass);
  border: 1px solid var(--s-border);
  color: var(--s-dim); cursor: pointer;
  transition: all var(--s-trans);
  box-shadow: 0 2px 12px rgba(0,0,0,.25);
  flex-shrink: 0;
}
.expand-fab:hover {
  background: var(--s-gold-ghost);
  border-color: rgba(254,221,0,.28);
  color: var(--s-gold);
  transform: scale(1.08) translateY(-1px);
  box-shadow: 0 4px 20px rgba(254,221,0,.12), 0 2px 12px rgba(0,0,0,.35);
}

/* ═══ NAV ═══════════════════════════════════════════════ */
.nav {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  padding: .85rem .7rem;
  display: flex;
  flex-direction: column;
  gap: .22rem;
  scrollbar-width: thin;
  scrollbar-color: rgba(255,255,255,.08) transparent;
}
.nav::-webkit-scrollbar { width: 3px; }
.nav::-webkit-scrollbar-thumb { background: rgba(255,255,255,.1); border-radius: 99px; }
.nav::-webkit-scrollbar-track { background: transparent; }

/* Divider */
.nav-divider {
  display: flex; align-items: center;
  padding: .7rem .55rem .35rem; height: 34px;
  gap: .6rem;
  flex-shrink: 0;
}
.nav-divider__text {
  font-size: .65rem; font-weight: 800;
  color: var(--s-faint-text);
  letter-spacing: .14em; text-transform: uppercase;
  white-space: nowrap; position: relative;
}
.nav-divider__text::after {
  content: '';
  position: absolute; right: calc(100% + 6px); top: 50%;
  transform: translateY(-50%);
  width: 16px; height: 1px;
  background: linear-gradient(90deg, transparent, var(--s-border-hi));
}
.nav-divider__line {
  display: block; width: 28px; height: 1px;
  background: var(--s-border); margin: 0 auto;
  border-radius: 99px;
}

/* Nav Items */
.nav-item {
  display: flex; align-items: center; gap: .72rem;
  padding: .62rem .8rem; border-radius: var(--s-rad);
  color: var(--s-dim); text-decoration: none;
  border: 1px solid transparent; position: relative;
  min-height: 44px; white-space: nowrap; overflow: hidden;
  flex-shrink: 0;
  transition:
    color var(--s-trans),
    background var(--s-trans),
    border-color var(--s-trans),
    box-shadow var(--s-trans),
    transform .18s var(--s-spring);
}
.nav-item--btn {
  background: none; cursor: pointer; font-family: inherit;
  font-size: inherit; width: 100%; text-align: right;
}

.nav-item::after {
  content: ''; position: absolute; inset: 0;
  background: linear-gradient(105deg, transparent 30%, rgba(255,255,255,.05), transparent 70%);
  transform: translateX(110%);
  transition: transform .5s ease;
  pointer-events: none;
}
.nav-item:hover::after { transform: translateX(-110%); }

.nav-item:hover {
  background: var(--s-hover);
  color: var(--s-white);
  border-color: var(--s-border);
  transform: translateX(-1px);
  box-shadow: 0 2px 12px rgba(0,0,0,.2), inset 0 1px 0 rgba(255,255,255,.04);
}

.nav-item--active {
  background: var(--s-active) !important;
  border-color: rgba(254,221,0,.2) !important;
  color: #fff !important;
  transform: translateX(0) !important;
  box-shadow:
    0 6px 24px rgba(0,0,0,.3),
    0 1px 0 rgba(254,221,0,.06) inset,
    0 0 0 1px rgba(254,221,0,.06) inset !important;
}

.nav-item--active::before {
  content: ''; position: absolute;
  left: 0; top: 18%; bottom: 18%;
  width: 3px; border-radius: 0 4px 4px 0;
  background: linear-gradient(180deg, var(--s-gold) 0%, rgba(254,221,0,.4) 100%);
  box-shadow: 0 0 10px rgba(254,221,0,.6), 0 0 4px rgba(254,221,0,.8);
  animation: pulse-bar 2.5s ease-in-out infinite;
}
@keyframes pulse-bar {
  0%, 100% { box-shadow: 0 0 10px rgba(254,221,0,.6), 0 0 4px rgba(254,221,0,.8); }
  50%       { box-shadow: 0 0 16px rgba(254,221,0,.9), 0 0 6px rgba(254,221,0,1); }
}

.nav-item__ico {
  width: 34px; height: 34px; flex: 0 0 34px; border-radius: 10px;
  background: rgba(255,255,255,.065);
  border: 1px solid rgba(255,255,255,.09);
  display: flex; align-items: center; justify-content: center;
  transition: background var(--s-trans), transform var(--s-trans), box-shadow var(--s-trans);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.08), 0 2px 6px rgba(0,0,0,.2);
}
.nav-item:hover .nav-item__ico {
  background: rgba(255,255,255,.11);
  transform: scale(1.07) rotate(-2deg);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.12), 0 3px 10px rgba(0,0,0,.3);
}
.nav-item--active .nav-item__ico {
  background: rgba(254,221,0,.12) !important;
  border-color: rgba(254,221,0,.2) !important;
  transform: scale(1.05);
  box-shadow: 0 0 10px rgba(254,221,0,.1), inset 0 1px 0 rgba(254,221,0,.15) !important;
}

.nav-item__label {
  flex: 1;
  font-size: .88rem;
  font-weight: 700;
  letter-spacing: .01em;
}

.nav-item__arrow {
  opacity: .2; display: flex;
  transition: opacity var(--s-trans), transform var(--s-trans);
}
.nav-item:hover .nav-item__arrow  { opacity: .55; transform: translateX(-3px); }
.nav-item--active .nav-item__arrow { opacity: .65; transform: translateX(-2px); }

.nav-item__chevron {
  opacity: .35; display: flex;
  transition: transform var(--s-trans-slow), opacity var(--s-trans);
}
.nav-item__chevron.open { transform: rotate(180deg); opacity: .65; }

/* ── Sub-list (accordion) ──────────────────────────────── */
.accordion { display: flex; flex-direction: column; flex-shrink: 0; }

.sub-list {
  position: relative; display: flex; flex-direction: column;
  gap: .18rem; padding: .35rem 0 .35rem 2.8rem;
  margin-top: .18rem; overflow: hidden;
}

.sub-list__track {
  position: absolute; right: calc(2.8rem - 14px); top: 8px; bottom: 8px;
  width: 1px;
  background: linear-gradient(180deg,
    rgba(254,221,0,.3) 0%,
    rgba(254,221,0,.12) 60%,
    transparent 100%
  );
  border-radius: 99px;
}

.sub-item {
  display: flex; align-items: center; gap: .58rem;
  padding: .5rem .72rem; border-radius: var(--s-rad-sm);
  color: rgba(255,255,255,.52); text-decoration: none;
  border: 1px solid transparent; position: relative;
  transition: all var(--s-trans); font-size: .85rem;
  font-weight: 600;
  flex-shrink: 0;
}

.sub-item::before {
  content: ''; position: absolute;
  right: calc(100% + 6px); top: 50%;
  transform: translateY(-50%);
  width: 8px; height: 1px;
  background: rgba(254,221,0,.18);
  transition: background var(--s-trans), width var(--s-trans);
}
.sub-item:hover {
  background: rgba(255,255,255,.055);
  color: rgba(255,255,255,.86);
  border-color: rgba(255,255,255,.07);
  transform: translateX(-1px);
}
.sub-item:hover::before { background: rgba(254,221,0,.5); width: 10px; }

.sub-item--active {
  background: rgba(254,221,0,.09) !important;
  border-color: rgba(254,221,0,.16) !important;
  color: rgba(255,255,255,.96) !important;
  box-shadow: 0 2px 12px rgba(0,0,0,.2) !important;
}
.sub-item--active::before { background: var(--s-gold) !important; width: 12px; }

.sub-item__dot {
  position: absolute; right: -20px; top: 50%;
  transform: translateY(-50%);
  width: 7px; height: 7px; border-radius: 50%;
  flex-shrink: 0;
  opacity: 0; transition: opacity var(--s-trans), box-shadow var(--s-trans);
}
.sub-item--active .sub-item__dot {
  opacity: 1;
  box-shadow: 0 0 8px currentColor, 0 0 3px currentColor;
}

.sub-item__ico {
  width: 27px; height: 27px; flex: 0 0 27px; border-radius: 8px;
  background: rgba(255,255,255,.055);
  border: 1px solid rgba(255,255,255,.07);
  display: flex; align-items: center; justify-content: center;
  transition: background var(--s-trans), transform var(--s-trans);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.07);
}
.sub-item:hover .sub-item__ico  { background: rgba(255,255,255,.09); transform: scale(1.06); }
.sub-item--active .sub-item__ico {
  background: rgba(254,221,0,.1) !important;
  border-color: rgba(254,221,0,.15) !important;
}

.sub-item__label { flex: 1; }

/* ── FOOTER ────────────────────────────────────────────── */
.side-foot {
  flex-shrink: 0;
  padding: .85rem .7rem;
  border-top: 1px solid var(--s-border);
  display: flex; flex-direction: column; gap: .6rem;
  background: linear-gradient(0deg, rgba(0,0,0,.2) 0%, transparent 100%);
  position: relative;
}

.side-foot::before {
  content: '';
  position: absolute; top: 0; left: 16px; right: 16px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(254,221,0,.15), transparent);
}

.side-foot__user {
  display: flex; align-items: center; gap: .68rem;
  padding: .55rem .65rem; border-radius: var(--s-rad);
  background: var(--s-glass);
  border: 1px solid var(--s-border);
  transition: background var(--s-trans), border-color var(--s-trans);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.05);
}
.side-foot__user:hover {
  background: var(--s-glass-hi);
  border-color: var(--s-border-hi);
}

.side-foot__avatar {
  width: 34px; height: 34px; flex: 0 0 34px; border-radius: 10px;
  background: linear-gradient(140deg, var(--s-gold) 0%, rgba(254,221,0,.75) 100%);
  display: flex; align-items: center; justify-content: center;
  font-size: .78rem; font-weight: 900; color: #2A0606;
  box-shadow:
    0 3px 12px rgba(254,221,0,.25),
    0 1px 0 rgba(255,255,255,.2) inset;
}
.side-foot__info { display: flex; flex-direction: column; min-width: 0; }
.side-foot__name {
  font-size: .82rem; font-weight: 800;
  color: var(--s-white);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.side-foot__role {
  font-size: .67rem;
  color: var(--s-dim);
  letter-spacing: .02em;
}

.logout-btn {
  display: flex; align-items: center; gap: .72rem;
  padding: .65rem .8rem; border-radius: var(--s-rad);
  background: var(--s-glass);
  border: 1px solid var(--s-border);
  color: rgba(255,255,255,.55); cursor: pointer;
  white-space: nowrap;
  transition: all var(--s-trans);
  min-height: 44px;
  font-family: inherit;
  font-size: .875rem; font-weight: 700;
  box-shadow: inset 0 1px 0 rgba(255,255,255,.05);
}
.logout-btn:hover {
  background: rgba(185,20,20,.18);
  border-color: rgba(185,20,20,.35);
  color: #fff;
  box-shadow:
    0 6px 20px rgba(140,0,0,.3),
    inset 0 1px 0 rgba(255,100,100,.08);
  transform: translateY(-1px);
}
.logout-btn svg { flex-shrink: 0; transition: transform var(--s-trans); }
.logout-btn:hover svg { transform: translateX(-3px); }

/* ── Transitions ───────────────────────────────────────── */
.slide-fade-enter-active { transition: all .24s var(--s-ease); }
.slide-fade-leave-active { transition: all .18s var(--s-ease); }
.slide-fade-enter-from   { opacity: 0; transform: translateX(-10px); }
.slide-fade-leave-to     { opacity: 0; transform: translateX(-7px); }

.label-enter-active { transition: all .2s var(--s-ease); }
.label-leave-active { transition: all .15s var(--s-ease); }
.label-enter-from, .label-leave-to { opacity: 0; transform: translateX(-6px); }

.accordion-enter-active {
  transition: all .34s var(--s-ease);
  max-height: 420px; overflow: hidden;
}
.accordion-leave-active {
  transition: all .26s var(--s-ease);
  max-height: 420px; overflow: hidden;
}
.accordion-enter-from, .accordion-leave-to {
  opacity: 0; max-height: 0; transform: translateY(-8px);
}

.pop-enter-active { transition: all .28s var(--s-spring); }
.pop-leave-active { transition: all .18s var(--s-ease); }
.pop-enter-from, .pop-leave-to { opacity: 0; transform: scale(.65); }
</style>