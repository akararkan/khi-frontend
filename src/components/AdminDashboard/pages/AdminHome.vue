<template>
  <div class="dash" dir="rtl">

    <!-- ═══════════════════════════════════════════════════════════
         HERO BANNER — Luxury glassmorphism
    ═══════════════════════════════════════════════════════════ -->
    <header class="hero">
      <div class="hero__canvas">
        <div class="hero__mesh"></div>
        <div class="hero__orb hero__orb--1"></div>
        <div class="hero__orb hero__orb--2"></div>
        <div class="hero__orb hero__orb--3"></div>
        <div class="hero__grid"></div>
      </div>

      <div class="hero__left">
        <div class="hero__emblem">
          <span class="hero__emblem-text">KHI</span>
          <div class="hero__emblem-ring"></div>
        </div>
        <div class="hero__copy">
          <p class="hero__eyebrow">سیستەمی بەڕێوەبردنی ناوەڕۆک</p>
          <h1 class="hero__title">
            بەخێربێیت،&nbsp;
            <em class="hero__name">{{ auth.username || auth.role || 'ئەدمین' }}</em>
          </h1>
          <p class="hero__sub">ناوەندی کەلەپووری کوردی — KHI Dashboard</p>
        </div>
      </div>

      <div class="hero__right">
        <div class="hero__meta">
          <time class="hero__date">{{ today }}</time>
          <div class="hero__status">
            <span class="hero__pulse"></span>
            سیستەم چالاکە
          </div>
        </div>
        <div class="hero__total-pill" v-if="!loading">
          <span class="hero__total-n">{{ totalContent }}</span>
          <span class="hero__total-l">تۆمار</span>
        </div>
      </div>
    </header>

    <!-- ═══════════════════════════════════════════════════════════
         QUICK ACTIONS RIBBON
    ═══════════════════════════════════════════════════════════ -->
    <section class="ribbon">
      <span class="ribbon__label">دەستپێکردنی خێرا</span>
      <div class="ribbon__actions">
        <RouterLink v-for="q in quickActions" :key="q.label" :to="q.to" class="qa">
          <span class="qa__icon" v-html="q.icon"></span>
          <span class="qa__text">{{ q.label }}</span>
        </RouterLink>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════
         STAT CARDS
    ═══════════════════════════════════════════════════════════ -->
    <section class="stat-grid">
      <RouterLink
        v-for="(s, idx) in stats"
        :key="s.key"
        class="stat"
        :to="s.to"
        :style="{ '--c': s.color, '--cs': s.soft, animationDelay: `${idx * 70}ms` }"
      >
        <div class="stat__glow"></div>
        <div class="stat__header">
          <div class="stat__ico" v-html="s.icon"></div>
          <div class="stat__trend" v-if="!loading && s.num !== '—'">
            <svg width="10" height="10" viewBox="0 0 10 10"><path d="M1 9 L5 1 L9 9" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
        </div>
        <div class="stat__body">
          <div class="stat__val">
            <span v-if="loading" class="skel"></span>
            <AnimatedCounter v-else :to="Number(s.num) || 0" />
          </div>
          <div class="stat__name">{{ s.label }}</div>
        </div>
        <div class="stat__bar">
          <div class="stat__fill" :style="{ width: loading ? '0%' : barPct(s.num), background: `linear-gradient(90deg, ${s.color}88, ${s.color})` }"></div>
        </div>
      </RouterLink>
    </section>

    <!-- ═══════════════════════════════════════════════════════════
         MAIN CONTENT GRID
    ═══════════════════════════════════════════════════════════ -->
    <div class="body-grid">

      <!-- LEFT: Section Cards -->
      <section class="sections">
        <div class="section-head">
          <div class="section-head__icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--crimson)" stroke-width="2.2">
              <rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/>
              <rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>
            </svg>
          </div>
          <h2 class="section-head__title">بەشەکانی ناوەڕۆک</h2>
        </div>

        <div class="cards">
          <RouterLink
            v-for="(c, idx) in shortcuts"
            :key="c.key"
            class="card"
            :to="c.to"
            :style="{ '--cc': c.color, '--ccs': c.soft, animationDelay: `${idx * 60 + 200}ms` }"
          >
            <div class="card__shine"></div>
            <div class="card__top">
              <div class="card__ico" :style="{ background: c.soft, border: `1.5px solid ${c.color}22` }" v-html="c.icon"></div>
              <div class="card__badge" v-if="!loading && getCount(c.key) !== null">
                <AnimatedCounter :to="getCount(c.key)" />
              </div>
            </div>
            <h3 class="card__title">{{ c.label }}</h3>
            <p class="card__hint">{{ c.hint }}</p>
            <div class="card__foot">
              <RouterLink :to="c.toNew" class="card__add" @click.stop>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                نوێ زیادبکە
              </RouterLink>
              <div class="card__arrow">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M6 3L11 8L6 13" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            </div>
            <div class="card__bar" :style="{ background: `linear-gradient(90deg, ${c.color}00, ${c.color}22, ${c.color}00)` }"></div>
          </RouterLink>
        </div>
      </section>

      <!-- RIGHT: Sidebar -->
      <aside class="sidebar">

        <!-- Donut Chart -->
        <div class="panel" v-if="!loading && totalRaw > 0">
          <div class="panel__head">
            <div class="panel__icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--crimson)" stroke-width="2.2">
                <circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0110 10h-10z"/>
              </svg>
            </div>
            <span class="panel__title">دابەشبوونی ناوەڕۆک</span>
          </div>

          <div class="donut-wrap">
            <svg class="donut" viewBox="0 0 160 160">
              <!-- Track -->
              <circle cx="80" cy="80" r="60" fill="none" stroke="#f0eeeb" stroke-width="14"/>
              <!-- Segments -->
              <circle
                v-for="(seg, i) in donutSegments"
                :key="'arc'+i"
                cx="80" cy="80" r="60"
                fill="none"
                :stroke="seg.color"
                stroke-width="14"
                :stroke-dasharray="seg.dash"
                :stroke-dashoffset="seg.offset"
                stroke-linecap="round"
                class="donut__arc"
                :style="{ animationDelay: `${i * 100}ms` }"
              />
            </svg>
            <div class="donut__center">
              <div class="donut__num">{{ totalContent }}</div>
              <div class="donut__lbl">کۆی گشتی</div>
            </div>
          </div>

          <div class="legend">
            <RouterLink
              v-for="(seg, i) in donutSegments"
              :key="'leg'+i"
              :to="palette[seg.key]?.to || '#'"
              class="legend-row"
            >
              <span class="legend-row__dot" :style="{ background: seg.color }"></span>
              <span class="legend-row__label">{{ seg.label }}</span>
              <span class="legend-row__val" :style="{ color: seg.color }">{{ seg.count }}</span>
              <span class="legend-row__pct">{{ pct(seg.count) }}٪</span>
            </RouterLink>
          </div>
        </div>

        <!-- Summary List -->
        <div class="panel">
          <div class="panel__head">
            <div class="panel__icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--crimson)" stroke-width="2.2">
                <path d="M18 20V10M12 20V4M6 20v-6"/>
              </svg>
            </div>
            <span class="panel__title">ئامار بە جۆر</span>
          </div>

          <div class="slist">
            <RouterLink
              v-for="b in breakdownStats"
              :key="b.key"
              :to="b.to"
              class="srow"
              :style="{ '--rc': b.color }"
            >
              <div class="srow__left">
                <div class="srow__ico" v-html="b.icon"></div>
                <div class="srow__info">
                  <span class="srow__name">{{ b.label }}</span>
                  <span class="srow__sub">{{ b.sub }}</span>
                </div>
              </div>
              <div class="srow__right">
                <span v-if="loading" class="skel skel--sm"></span>
                <span v-else class="srow__num">{{ getCount(b.key) ?? '—' }}</span>
                <div class="srow__pill" :style="{ background: b.soft }">
                  <div class="srow__pill-fill" :style="{ width: loading ? '0%' : barPct(getCount(b.key)), background: b.color }"></div>
                </div>
              </div>
            </RouterLink>
          </div>

          <div class="total-card" v-if="!loading">
            <div class="total-card__label">کۆی گشتی تۆمارەکان</div>
            <div class="total-card__val">{{ totalContent }}</div>
            <div class="total-card__sub">لە ٧ بەش</div>
          </div>
        </div>

      </aside>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, defineComponent, h } from 'vue'
import { useAuthStore } from '@/stores/useAuthStore'
import api from '@/api.js'

// ── Animated Counter component ──────────────────────────────────
const AnimatedCounter = defineComponent({
  props: { to: { type: Number, default: 0 } },
  setup(props) {
    const display = ref(0)
    onMounted(() => {
      const start = performance.now()
      const dur = 1200
      const end = props.to
      const tick = (now) => {
        const p = Math.min((now - start) / dur, 1)
        const ease = 1 - Math.pow(1 - p, 3)
        display.value = Math.round(ease * end)
        if (p < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    })
    return () => h('span', display.value.toLocaleString('ar-IQ'))
  }
})

// ── Store & State ───────────────────────────────────────────────
const auth    = useAuthStore()
const loading = ref(true)
const counts  = ref({})

// ── API Endpoints (FIXED: videos uses correct path) ─────────────
const endpoints = [
  {
    key: 'projects',
    url: '/api/v1/projects/getAll?page=0&size=1',
    extract: d => d?.data?.totalElements ?? d?.totalElements ?? (Array.isArray(d?.data) ? d.data.length : null)
  },
  {
    key: 'news',
    url: '/api/v1/news?page=0&size=1',
    extract: d => d?.data?.totalElements ?? d?.totalElements ?? (Array.isArray(d?.data) ? d.data.length : null)
  },
  {
    key: 'videos',
    url: '/api/publishments/videos?page=0&size=1',   // ✅ FIXED – was /api/v1/videos (500)
    extract: d => d?.totalElements ?? d?.data?.totalElements ?? (Array.isArray(d?.content) ? null : null) ?? (d?.content !== undefined ? d.totalElements : null)
  },
  {
    key: 'image-collections',
    url: '/api/v1/image-collections',
    extract: d => Array.isArray(d) ? d.length : Array.isArray(d?.data) ? d.data.length : (d?.data?.totalElements ?? d?.totalElements ?? null)
  },
  {
    key: 'soundtracks',
    url: '/api/v1/soundtracks',
    extract: d => Array.isArray(d) ? d.length : Array.isArray(d?.data) ? d.data.length : (d?.data?.totalElements ?? d?.totalElements ?? null)
  },
  {
    key: 'writings',
    url: '/api/v1/writings',
    extract: d => Array.isArray(d) ? d.length : Array.isArray(d?.data) ? d.data.length : (d?.data?.totalElements ?? d?.totalElements ?? null)
  },
  {
    key: 'about',
    url: '/api/v1/about',
    extract: d => Array.isArray(d) ? d.length : Array.isArray(d?.data) ? d.data.length : (d?.data?.totalElements ?? d?.totalElements ?? null)
  },
]

const fetchCounts = async () => {
  loading.value = true
  const results = await Promise.allSettled(
    endpoints.map(ep =>
      api.get(ep.url)
        .then(r => ({ key: ep.key, val: ep.extract(r.data), ok: true }))
        .catch(() => ({ key: ep.key, val: null, ok: false }))
    )
  )
  const c = {}
  results.forEach(r => {
    if (r.status === 'fulfilled') c[r.value.key] = r.value.val
  })
  counts.value = c
  loading.value = false
}

const getCount  = k => counts.value[k] ?? null
const maxCount  = computed(() => Math.max(1, ...Object.values(counts.value).filter(v => v !== null && v !== undefined)))
const totalRaw  = computed(() => Object.values(counts.value).reduce((a, v) => a + (v ?? 0), 0))
const totalContent = computed(() => totalRaw.value.toLocaleString('ar-IQ'))
const barPct = (num) => !num ? '4%' : Math.max(4, Math.round((Number(num) / maxCount.value) * 100)) + '%'
const pct = (n) => totalRaw.value ? Math.round((n / totalRaw.value) * 100) : 0

// ── Palette ─────────────────────────────────────────────────────
const palette = {
  projects:            { color: '#8C1515', soft: 'rgba(140,21,21,.08)',   to: '/admin/projects' },
  news:                { color: '#0d7c6e', soft: 'rgba(13,124,110,.08)',  to: '/admin/news' },
  videos:              { color: '#b45309', soft: 'rgba(180,83,9,.08)',    to: '/admin/videos' },
  writings:            { color: '#4338ca', soft: 'rgba(67,56,202,.08)',   to: '/admin/writings' },
  'image-collections': { color: '#6d28d9', soft: 'rgba(109,40,217,.08)', to: '/admin/image-collections' },
  soundtracks:         { color: '#be185d', soft: 'rgba(190,24,93,.08)',   to: '/admin/soundtracks' },
  about:               { color: '#0369a1', soft: 'rgba(3,105,161,.08)',   to: '/admin/about' },
}

// ── Icon factory ────────────────────────────────────────────────
const svg = (key, d) =>
  `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${palette[key].color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="${d}"/></svg>`

const icons = {
  projects:            svg('projects', 'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z'),
  news:                svg('news', 'M4 22h16a2 2 0 002-2V4a2 2 0 00-2-2H8a2 2 0 00-2 2v16a2 2 0 01-2 2z'),
  videos:              `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${palette.videos.color}" stroke-width="2" stroke-linecap="round"><rect x="2" y="2" width="20" height="20" rx="2"/><polygon points="10,8 16,12 10,16"/></svg>`,
  writings:            svg('writings', 'M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4z'),
  'image-collections': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${palette['image-collections'].color}" stroke-width="2" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`,
  soundtracks:         `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${palette.soundtracks.color}" stroke-width="2" stroke-linecap="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`,
  about:               `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${palette.about.color}" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>`,
}

// ── Data arrays ─────────────────────────────────────────────────
const statsDef = [
  { key: 'projects',          label: 'پڕۆژەکان',    to: '/admin/projects' },
  { key: 'news',              label: 'هەواڵەکان',    to: '/admin/news' },
  { key: 'videos',            label: 'ڤیدیۆکان',     to: '/admin/videos' },
  { key: 'writings',          label: 'نووسراوەکان',  to: '/admin/writings' },
  { key: 'image-collections', label: 'وێنەکان',      to: '/admin/image-collections' },
  { key: 'soundtracks',       label: 'دەنگەکان',     to: '/admin/soundtracks' },
  { key: 'about',             label: 'دەربارەکان',   to: '/admin/about' },
]
const stats = statsDef.map(s => ({
  ...s, ...palette[s.key], icon: icons[s.key],
  get num() { return counts.value[s.key] ?? '—' }
}))

const qaIcons = {
  projects:            `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>`,
  news:                `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2z"/><line x1="9" y1="7" x2="15" y2="7"/><line x1="9" y1="11" x2="15" y2="11"/><line x1="9" y1="15" x2="13" y2="15"/></svg>`,
  videos:              `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>`,
  writings:            `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4z"/></svg>`,
  images:              `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`,
  sounds:              `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`,
  about:               `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>`,
}

const quickActions = [
  { label: 'پڕۆژەی نوێ',    to: '/admin/projects/new',          icon: qaIcons.projects },
  { label: 'هەواڵی نوێ',     to: '/admin/news/new',              icon: qaIcons.news },
  { label: 'ڤیدیۆی نوێ',    to: '/admin/videos/new',            icon: qaIcons.videos },
  { label: 'نووسراوەی نوێ',  to: '/admin/writings/new',          icon: qaIcons.writings },
  { label: 'وێنەی نوێ',      to: '/admin/image-collections/new', icon: qaIcons.images },
  { label: 'دەنگی نوێ',      to: '/admin/soundtracks/new',       icon: qaIcons.sounds },
  { label: 'دەربارەی نوێ',   to: '/admin/about/new',             icon: qaIcons.about },
]

const shortcuts = [
  { key: 'projects',          label: 'پڕۆژەکان',       hint: 'بینین و بەڕێوەبردنی پڕۆژەکان',       to: '/admin/projects',          toNew: '/admin/projects/new',          ...palette.projects,            icon: icons.projects },
  { key: 'news',              label: 'هەواڵەکان',       hint: 'بڵاوکردنەوەی بابەت و هەواڵ',          to: '/admin/news',              toNew: '/admin/news/new',              ...palette.news,                icon: icons.news },
  { key: 'videos',            label: 'ڤیدیۆکان',        hint: 'فیلم و دۆکیومێنتاری کوردی',           to: '/admin/videos',            toNew: '/admin/videos/new',            ...palette.videos,              icon: icons.videos },
  { key: 'image-collections', label: 'کۆمەڵە وێنەکان', hint: 'گالەری و ئەرشیفی وێنەکان',            to: '/admin/image-collections', toNew: '/admin/image-collections/new', ...palette['image-collections'],icon: icons['image-collections'] },
  { key: 'soundtracks',       label: 'دەنگەکان',        hint: 'ئەرشیفی مووسیقا و دەنگ',              to: '/admin/soundtracks',       toNew: '/admin/soundtracks/new',       ...palette.soundtracks,         icon: icons.soundtracks },
  { key: 'writings',          label: 'نووسراوەکان',     hint: 'کتێب و نووسراوەی دیجیتاڵ',            to: '/admin/writings',          toNew: '/admin/writings/new',          ...palette.writings,            icon: icons.writings },
  { key: 'about',             label: 'دەربارەکان',      hint: 'پەڕەکانی دەربارە و زانیاری',          to: '/admin/about',             toNew: '/admin/about/new',             ...palette.about,               icon: icons.about },
]

const breakdownStats = [
  { key: 'projects',          label: 'پڕۆژەکان',    sub: 'بەڕێوەبردن',           to: '/admin/projects',          ...palette.projects,            icon: icons.projects },
  { key: 'news',              label: 'هەواڵەکان',    sub: 'بابەت و بڵاوکراوە',    to: '/admin/news',              ...palette.news,                icon: icons.news },
  { key: 'videos',            label: 'ڤیدیۆکان',     sub: 'فیلم و دۆکیومێنتاری',  to: '/admin/videos',            ...palette.videos,              icon: icons.videos },
  { key: 'image-collections', label: 'وێنەکان',      sub: 'کۆمەڵە و گالەری',       to: '/admin/image-collections', ...palette['image-collections'],icon: icons['image-collections'] },
  { key: 'soundtracks',       label: 'دەنگەکان',     sub: 'مووسیقا و تۆمار',       to: '/admin/soundtracks',       ...palette.soundtracks,         icon: icons.soundtracks },
  { key: 'writings',          label: 'نووسراوەکان',  sub: 'کتێب و نووسراوە',       to: '/admin/writings',          ...palette.writings,            icon: icons.writings },
  { key: 'about',             label: 'دەربارەکان',   sub: 'پەڕەی دەربارە',         to: '/admin/about',             ...palette.about,               icon: icons.about },
]

// ── Donut ────────────────────────────────────────────────────────
const donutSegments = computed(() => {
  const total = Math.max(1, totalRaw.value)
  const circ  = 2 * Math.PI * 60
  let cum = 0
  const keys   = ['projects','news','videos','writings','image-collections','soundtracks','about']
  const labels = { projects:'پڕۆژەکان', news:'هەواڵەکان', videos:'ڤیدیۆکان', writings:'نووسراوەکان', 'image-collections':'وێنەکان', soundtracks:'دەنگەکان', about:'دەربارەکان' }
  return keys
    .map(key => {
      const count = counts.value[key] ?? 0
      const arc = (count / total) * circ
      const gap = count > 0 ? 3 : 0
      const seg = { key, color: palette[key].color, count, label: labels[key],
        dash: `${Math.max(0, arc - gap)} ${circ}`,
        offset: -cum + circ * 0.25 }
      cum += arc
      return seg
    })
    .filter(s => s.count > 0)
})

const today = computed(() =>
  new Date().toLocaleDateString('ckb', { weekday:'long', year:'numeric', month:'long', day:'numeric' })
)

onMounted(fetchCounts)
</script>

<style scoped>
/* ─── Reset & Root ────────────────────────────────────────────── */
.dash {
  direction: rtl;
  max-width: 1340px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding-bottom: 2rem;
}

/* ─── Skeletons ───────────────────────────────────────────────── */
.skel {
  display: inline-block; width: 42px; height: 26px; border-radius: 6px;
  background: linear-gradient(90deg, #ede9e4 25%, #f7f5f2 50%, #ede9e4 75%);
  background-size: 300%; animation: shimmer 1.6s infinite;
}
.skel--sm { width: 28px; height: 18px; border-radius: 4px; }
@keyframes shimmer { 0%{background-position:300% 0} 100%{background-position:-300% 0} }
@keyframes up { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
@keyframes fadeIn { from{opacity:0} to{opacity:1} }

/* ─── HERO ────────────────────────────────────────────────────── */
.hero {
  position: relative; display: flex; align-items: center;
  justify-content: space-between; flex-wrap: wrap; gap: 1.5rem;
  padding: 2.2rem 2.4rem; border-radius: 24px; overflow: hidden;
  min-height: 120px; color: #fff;
}
.hero__canvas {
  position: absolute; inset: 0; z-index: 0;
  background: linear-gradient(135deg, #2A0606 0%, #8C1515 45%, #5A0E0E 100%);
}
.hero__mesh {
  position: absolute; inset: 0;
  background:
    radial-gradient(ellipse 70% 60% at 20% 50%, rgba(254,221,0,.10) 0%, transparent 65%),
    radial-gradient(ellipse 40% 80% at 85% 20%, rgba(255,100,100,.08) 0%, transparent 60%);
}
.hero__orb {
  position: absolute; border-radius: 50%; pointer-events: none;
  filter: blur(1px);
}
.hero__orb--1 {
  width: 300px; height: 300px; top: -130px; left: -80px;
  background: radial-gradient(circle, rgba(254,221,0,.18) 0%, transparent 65%);
  animation: drift1 8s ease-in-out infinite alternate;
}
.hero__orb--2 {
  width: 200px; height: 200px; bottom: -80px; right: 12%;
  background: radial-gradient(circle, rgba(255,80,80,.06) 0%, transparent 65%);
  animation: drift2 11s ease-in-out infinite alternate;
}
.hero__orb--3 {
  width: 120px; height: 120px; top: 20px; right: 30%;
  background: radial-gradient(circle, rgba(254,221,0,.08) 0%, transparent 60%);
  animation: drift1 14s ease-in-out infinite alternate-reverse;
}
.hero__grid {
  position: absolute; inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px);
  background-size: 40px 40px;
}
@keyframes drift1 { 0%{transform:translate(0,0)} 100%{transform:translate(20px,12px)} }
@keyframes drift2 { 0%{transform:translate(0,0)} 100%{transform:translate(-15px,10px)} }

.hero__left { display: flex; align-items: center; gap: 1.3rem; position: relative; z-index: 1; flex: 1; min-width: 0; }
.hero__emblem {
  position: relative; width: 58px; height: 58px; flex: 0 0 58px;
  border-radius: 16px; background: rgba(254,221,0,.13);
  border: 1.5px solid rgba(254,221,0,.4);
  box-shadow: 0 0 0 4px rgba(254,221,0,.06), inset 0 1px 0 rgba(255,255,255,.15);
  display: flex; align-items: center; justify-content: center;
}
.hero__emblem-text {
  font-family: 'Playfair Display', Georgia, serif;
  font-weight: 900; font-size: 1rem; color: var(--gold); letter-spacing: .04em; position: relative; z-index: 1;
}
.hero__emblem-ring {
  position: absolute; inset: -5px; border-radius: 20px;
  border: 1px solid rgba(254,221,0,.18);
}
.hero__eyebrow { font-size: .72rem; opacity: .55; margin-bottom: .3rem; letter-spacing: .04em; text-transform: uppercase; }
.hero__title { font-size: 1.4rem; font-weight: 800; line-height: 1.3; margin-bottom: .2rem; }
.hero__name { font-style: normal; color: var(--gold); }
.hero__sub { font-size: .78rem; opacity: .5; }

.hero__right { display: flex; flex-direction: column; align-items: flex-end; gap: .7rem; position: relative; z-index: 1; flex-shrink: 0; }
.hero__meta { display: flex; flex-direction: column; align-items: flex-end; gap: .3rem; }
.hero__date { font-size: .74rem; opacity: .5; white-space: nowrap; }
.hero__status { display: flex; align-items: center; gap: .4rem; font-size: .74rem; opacity: .7; }
.hero__pulse {
  width: 7px; height: 7px; border-radius: 50%; background: #4ade80;
  box-shadow: 0 0 0 3px rgba(74,222,128,.3);
  animation: pulse 2s ease infinite;
}
@keyframes pulse { 0%,100%{box-shadow:0 0 0 3px rgba(74,222,128,.3)} 50%{box-shadow:0 0 0 7px rgba(74,222,128,.06)} }

.hero__total-pill {
  display: flex; align-items: baseline; gap: .4rem; padding: .5rem 1rem;
  background: rgba(255,255,255,.1); border: 1px solid rgba(255,255,255,.18);
  border-radius: 99px; backdrop-filter: blur(12px);
}
.hero__total-n { font-size: 1.5rem; font-weight: 900; color: var(--gold); line-height: 1; }
.hero__total-l { font-size: .72rem; opacity: .6; }

/* ─── RIBBON ──────────────────────────────────────────────────── */
.ribbon {
  display: flex; align-items: center; gap: 1rem; flex-wrap: wrap;
  padding: .85rem 1.2rem;
  background: var(--white); border: 1px solid var(--border); border-radius: 16px;
  box-shadow: var(--shadow-sm);
}
.ribbon__label {
  font-size: .72rem; font-weight: 800; color: var(--muted);
  white-space: nowrap; letter-spacing: .04em; text-transform: uppercase;
  border-left: 2.5px solid var(--crimson); padding-left: .6rem;
}
.ribbon__actions { display: flex; gap: .45rem; flex-wrap: wrap; flex: 1; }
.qa {
  display: inline-flex; align-items: center; gap: .4rem;
  padding: .4rem .9rem; border-radius: 99px;
  background: var(--cream); border: 1.5px solid var(--border);
  color: var(--muted); text-decoration: none;
  font-size: .74rem; font-weight: 700; white-space: nowrap;
  transition: all .18s; position: relative; overflow: hidden;
}
.qa::before {
  content: ''; position: absolute; inset: 0;
  background: linear-gradient(135deg, var(--crimson), #b01e1e);
  opacity: 0; transition: opacity .18s; border-radius: inherit;
}
.qa:hover { color: #fff; border-color: var(--crimson); transform: translateY(-1px); box-shadow: 0 4px 16px rgba(140,21,21,.25); }
.qa:hover::before { opacity: 1; }
.qa__icon, .qa__text { position: relative; z-index: 1; }
.qa__icon :deep(svg) { transition: stroke .18s; }
.qa:hover .qa__icon :deep(svg) { stroke: white !important; }

/* ─── STAT CARDS ──────────────────────────────────────────────── */
.stat-grid {
  display: grid; grid-template-columns: repeat(6, 1fr); gap: .75rem;
}
@media (max-width: 1100px) { .stat-grid { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 680px)  { .stat-grid { grid-template-columns: repeat(2, 1fr); } }

.stat {
  position: relative; display: flex; flex-direction: column; gap: .5rem;
  padding: 1.1rem; background: var(--white); border: 1px solid var(--border);
  border-radius: 18px; text-decoration: none; color: var(--text); overflow: hidden;
  transition: transform .2s, box-shadow .2s, border-color .2s;
  animation: up .5s cubic-bezier(.22,1,.36,1) both;
}
.stat:hover { transform: translateY(-3px); box-shadow: 0 10px 32px rgba(0,0,0,.1); border-color: var(--c); }
.stat__glow {
  position: absolute; inset: 0; border-radius: inherit; opacity: 0; transition: opacity .2s;
  background: radial-gradient(ellipse at top right, var(--cs), transparent 60%);
}
.stat:hover .stat__glow { opacity: 1; }
.stat__header { display: flex; align-items: flex-start; justify-content: space-between; }
.stat__ico {
  width: 38px; height: 38px; border-radius: 11px; background: var(--cs);
  border: 1px solid color-mix(in srgb, var(--c) 20%, transparent);
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.stat__trend { color: #4ade80; opacity: .8; }
.stat__body { flex: 1; }
.stat__val { font-size: 1.45rem; font-weight: 900; line-height: 1; color: var(--text); }
.stat__name { font-size: .68rem; font-weight: 700; color: var(--muted); margin-top: .25rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.stat__bar { height: 3px; background: var(--cream-dk); border-radius: 99px; overflow: hidden; margin-top: .35rem; }
.stat__fill { height: 100%; border-radius: 99px; transition: width 1.4s cubic-bezier(.34,1.56,.64,1); }

/* ─── BODY GRID ───────────────────────────────────────────────── */
.body-grid {
  display: grid; grid-template-columns: 1fr 340px; gap: 1.5rem; align-items: start;
}
@media (max-width: 1020px) { .body-grid { grid-template-columns: 1fr; } }

/* ─── SECTION HEAD ────────────────────────────────────────────── */
.section-head {
  display: flex; align-items: center; gap: .55rem; margin-bottom: 1.1rem;
}
.section-head__icon {
  width: 34px; height: 34px; border-radius: 10px;
  background: rgba(140,21,21,.06); border: 1px solid rgba(140,21,21,.12);
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.section-head__title { font-size: .95rem; font-weight: 800; color: var(--text); }

/* ─── CARDS GRID ──────────────────────────────────────────────── */
.cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(188px, 1fr)); gap: .85rem; }

.card {
  position: relative; display: flex; flex-direction: column; gap: .1rem;
  text-decoration: none; background: var(--white);
  border: 1px solid var(--border); border-radius: 18px;
  padding: 1.2rem; overflow: hidden;
  transition: transform .2s, box-shadow .2s;
  animation: up .5s cubic-bezier(.22,1,.36,1) both;
}
.card:hover { transform: translateY(-4px); box-shadow: 0 14px 40px rgba(0,0,0,.09); }
.card__shine {
  position: absolute; inset: 0; pointer-events: none; border-radius: inherit;
  background: linear-gradient(135deg, rgba(255,255,255,.8) 0%, transparent 50%);
  opacity: 0; transition: opacity .2s;
}
.card:hover .card__shine { opacity: .3; }

.card__top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: .75rem; }
.card__ico {
  width: 44px; height: 44px; border-radius: 13px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  transition: transform .2s;
}
.card:hover .card__ico { transform: scale(1.08) rotate(-3deg); }
.card__badge {
  font-size: 1rem; font-weight: 900; color: var(--text);
  background: var(--cream-dk); border: 1px solid var(--border);
  border-radius: 9px; padding: .12rem .52rem;
  font-variant-numeric: tabular-nums;
}
.card__title { font-size: .87rem; font-weight: 800; color: var(--text); margin-bottom: .2rem; }
.card__hint  { font-size: .73rem; color: var(--muted); flex: 1; line-height: 1.5; }
.card__foot {
  display: flex; align-items: center; justify-content: space-between;
  margin-top: .8rem; padding-top: .7rem;
  border-top: 1px dashed var(--cream-dk);
}
.card__add {
  display: inline-flex; align-items: center; gap: .3rem; padding: .28rem .65rem;
  border-radius: 7px; background: rgba(140,21,21,.06);
  border: 1px solid rgba(140,21,21,.14);
  color: var(--crimson); font-size: .71rem; font-weight: 800;
  text-decoration: none; transition: all .15s;
}
.card__add:hover { background: rgba(140,21,21,.12); transform: scale(1.02); }
.card__arrow { color: var(--border); transition: all .2s; display: flex; }
.card:hover .card__arrow { color: var(--cc); transform: translateX(-4px); }
.card__bar {
  position: absolute; bottom: 0; left: 0; right: 0; height: 3px;
  opacity: 0; transition: opacity .2s;
}
.card:hover .card__bar { opacity: 1; }

/* ─── SIDEBAR ─────────────────────────────────────────────────── */
.sidebar { display: flex; flex-direction: column; gap: 1.2rem; }

.panel {
  background: var(--white); border: 1px solid var(--border);
  border-radius: 18px; padding: 1.35rem;
  box-shadow: 0 2px 12px rgba(0,0,0,.04);
}
.panel__head {
  display: flex; align-items: center; gap: .5rem; margin-bottom: 1rem;
}
.panel__icon {
  width: 30px; height: 30px; border-radius: 8px;
  background: rgba(140,21,21,.06); border: 1px solid rgba(140,21,21,.1);
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.panel__title { font-size: .86rem; font-weight: 800; color: var(--text); }

/* Donut */
.donut-wrap { position: relative; width: 148px; height: 148px; margin: .3rem auto 1.2rem; }
.donut { width: 100%; height: 100%; transform: rotate(-90deg); }
.donut__arc {
  animation: arcDraw 1s cubic-bezier(.34,1.56,.64,1) both;
  transition: stroke-dasharray .5s, stroke-dashoffset .5s;
}
@keyframes arcDraw { from{stroke-dasharray:0 400;opacity:0} }
.donut__center {
  position: absolute; top: 50%; left: 50%;
  transform: translate(-50%, -50%); text-align: center; pointer-events: none;
}
.donut__num { font-size: 1.5rem; font-weight: 900; color: var(--text); line-height: 1; }
.donut__lbl { font-size: .62rem; color: var(--muted); font-weight: 700; margin-top: .2rem; letter-spacing: .03em; }

/* Legend */
.legend { display: flex; flex-direction: column; gap: .3rem; }
.legend-row {
  display: flex; align-items: center; gap: .5rem; padding: .35rem .45rem;
  border-radius: 8px; text-decoration: none; color: inherit; transition: background .15s;
}
.legend-row:hover { background: var(--cream); }
.legend-row__dot { width: 9px; height: 9px; border-radius: 3px; flex-shrink: 0; }
.legend-row__label { flex: 1; font-size: .77rem; font-weight: 700; color: var(--text); }
.legend-row__val { font-size: .8rem; font-weight: 900; font-variant-numeric: tabular-nums; }
.legend-row__pct { font-size: .68rem; color: var(--muted); min-width: 32px; text-align: left; }

/* Summary rows */
.slist { display: flex; flex-direction: column; gap: .25rem; margin-bottom: 1rem; }
.srow {
  display: flex; align-items: center; justify-content: space-between; gap: .6rem;
  padding: .6rem .55rem; border-radius: 11px; text-decoration: none;
  color: inherit; transition: background .15s; cursor: pointer;
}
.srow:hover { background: var(--cream); }
.srow__left { display: flex; align-items: center; gap: .5rem; flex: 1; min-width: 0; }
.srow__ico {
  width: 28px; height: 28px; flex: 0 0 28px; border-radius: 8px;
  background: var(--cream-dk); border: 1px solid var(--border);
  display: flex; align-items: center; justify-content: center;
}
.srow__info { display: flex; flex-direction: column; min-width: 0; }
.srow__name { font-size: .81rem; font-weight: 700; color: var(--text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.srow__sub  { font-size: .67rem; color: var(--muted); }
.srow__right { display: flex; align-items: center; gap: .55rem; flex-shrink: 0; }
.srow__num { font-size: .88rem; font-weight: 900; color: var(--rc); font-variant-numeric: tabular-nums; min-width: 28px; text-align: center; }
.srow__pill { height: 4px; width: 48px; border-radius: 99px; overflow: hidden; }
.srow__pill-fill { height: 100%; border-radius: 99px; transition: width 1.4s cubic-bezier(.34,1.56,.64,1); }

/* Total card */
.total-card {
  background: linear-gradient(135deg, #2A0606, #8C1515);
  border-radius: 14px; padding: 1.1rem; text-align: center; color: #fff;
  box-shadow: 0 6px 24px rgba(140,21,21,.3);
}
.total-card__label { font-size: .7rem; opacity: .6; margin-bottom: .25rem; letter-spacing: .03em; }
.total-card__val   { font-size: 2rem; font-weight: 900; color: var(--gold); line-height: 1; }
.total-card__sub   { font-size: .68rem; opacity: .5; margin-top: .2rem; }
</style>