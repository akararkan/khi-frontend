

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
// ── API Endpoints (FIXED: videos extraction simplified) ─────────────
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
    url: '/api/v1/videos?page=0&size=1',
    // ✅ FIXED - Simplified extraction logic
    extract: d => {
      // Try common patterns for Spring Boot paginated responses
      if (d?.totalElements !== undefined) return d.totalElements;
      if (d?.data?.totalElements !== undefined) return d.data.totalElements;
      if (d?.page?.totalElements !== undefined) return d.page.totalElements;
      if (d?.data?.page?.totalElements !== undefined) return d.data.page.totalElements;
      // Fallback: if content array exists, return its length (for non-paginated responses)
      if (Array.isArray(d?.content)) return d.content.length;
      if (Array.isArray(d?.data?.content)) return d.data.content.length;
      if (Array.isArray(d)) return d.length;
      return null;
    }
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
  
  // Debug: Log the videos response specifically
  try {
    const videoRes = await api.get('/api/v1/videos?page=0&size=1')
    console.log('Videos API Response:', JSON.stringify(videoRes.data, null, 2))
  } catch (e) {
    console.error('Videos API Error:', e)
  }
  
  const results = await Promise.allSettled(
    endpoints.map(ep =>
      api.get(ep.url)
        .then(r => ({ key: ep.key, val: ep.extract(r.data), ok: true }))
        .catch((e) => ({ key: ep.key, val: null, ok: false, error: e.message }))
    )
  )
  
  // Debug: Log results
  console.log('Count Results:', results)
  
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

<template>
  <div class="dash-luxury" dir="rtl">
    <!-- Enhanced Hero with Particle Effect -->
    <header class="hero-luxury">
      <div class="hero-particles">
        <div v-for="n in 20" :key="n" class="particle" :style="{ '--delay': `${n * 0.2}s` }"></div>
      </div>
      
      <div class="hero-content">
        <div class="hero-badge">
          <div class="badge-emblem">
            <span class="badge-text">KHI</span>
            <div class="badge-ring badge-ring--outer"></div>
            <div class="badge-ring badge-ring--inner"></div>
          </div>
        </div>
        
        <div class="hero-typography">
          <span class="hero-eyebrow">سیستەمی بەڕێوەبردنی ناوەڕۆک</span>
          <h1 class="hero-title">
            <span class="title-welcome">بەخێربێیت،</span>
            <span class="title-name">{{ auth.username || auth.role || 'ئەدمین' }}</span>
          </h1>
          <p class="hero-subtitle">ناوەندی کەلەپووری کوردی — Dashboard</p>
        </div>
      </div>

      <div class="hero-status">
        <div class="status-pill status-pill--live">
          <span class="status-pulse"></span>
          <span>سیستەم چالاکە</span>
        </div>
        <time class="status-date">{{ today }}</time>
        <div class="total-counter" v-if="!loading">
          <span class="counter-value">{{ totalContent }}</span>
          <span class="counter-label">تۆمار</span>
        </div>
      </div>
    </header>

    <!-- Quick Actions Bento Grid -->
    <section class="bento-ribbon">
      <div class="bento-header">
        <div class="bento-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
          </svg>
        </div>
        <span>دەستپێکردنی خێرا</span>
      </div>
      
      <div class="bento-grid">
        <RouterLink 
          v-for="(q, idx) in quickActions" 
          :key="q.label" 
          :to="q.to" 
          class="bento-item"
          :style="{ '--i': idx }"
        >
          <div class="bento-shine"></div>
          <span class="bento-icon-bg" v-html="q.icon"></span>
          <span class="bento-text">{{ q.label }}</span>
          <div class="bento-arrow">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </div>
        </RouterLink>
      </div>
    </section>

    <!-- Stats Masonry -->
    <section class="stats-masonry">
      <RouterLink
        v-for="(s, idx) in stats"
        :key="s.key"
        class="stat-card"
        :to="s.to"
        :style="{ 
          '--c': s.color, 
          '--cs': s.soft, 
          '--delay': `${idx * 80}ms`,
          '--angle': `${(idx * 45) % 360}deg`
        }"
      >
        <div class="stat-aurora"></div>
        <div class="stat-border"></div>
        
        <div class="stat-header">
          <div class="stat-icon-wrap">
            <div class="stat-icon" v-html="s.icon"></div>
            <div class="stat-glow-icon"></div>
          </div>
          <div class="stat-trend" v-if="!loading">
            <svg width="12" height="12" viewBox="0 0 12 12">
              <path d="M2 10L6 2L10 10" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/>
            </svg>
          </div>
        </div>

        <div class="stat-body">
          <div class="stat-value">
            <span v-if="loading" class="skeleton-text"></span>
            <AnimatedCounter v-else :to="Number(s.num) || 0" class="counter-animated" />
          </div>
          <div class="stat-label">{{ s.label }}</div>
        </div>

        <div class="stat-progress">
          <div class="progress-track">
            <div class="progress-fill" :style="{ width: loading ? '0%' : barPct(s.num) }"></div>
          </div>
          <div class="progress-glow" :style="{ width: loading ? '0%' : barPct(s.num) }"></div>
        </div>
      </RouterLink>
    </section>

    <!-- Main Layout -->
    <div class="layout-split">
      <!-- Content Sections -->
      <section class="content-sections">
        <div class="section-header">
          <div class="header-accent"></div>
          <div class="header-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="7" height="7" rx="1.5"/>
              <rect x="14" y="3" width="7" height="7" rx="1.5"/>
              <rect x="3" y="14" width="7" height="7" rx="1.5"/>
              <rect x="14" y="14" width="7" height="7" rx="1.5"/>
            </svg>
          </div>
          <h2>بەشەکانی ناوەڕۆک</h2>
        </div>

        <div class="cards-compact">
          <RouterLink
            v-for="(c, idx) in shortcuts"
            :key="c.key"
            class="compact-card"
            :to="c.to"
            :style="{ 
              '--cc': c.color, 
              '--ccs': c.soft,
              '--enter-delay': `${idx * 50}ms`
            }"
          >
            <div class="card-ambient"></div>
            <div class="card-border"></div>
            
            <div class="card-top">
              <div class="card-icon-box" :style="{ background: c.soft }">
                <span v-html="c.icon"></span>
              </div>
              <div class="card-count" v-if="!loading && getCount(c.key) !== null">
                <AnimatedCounter :to="getCount(c.key)" />
              </div>
            </div>

            <div class="card-content">
              <h3>{{ c.label }}</h3>
              <p>{{ c.hint }}</p>
            </div>

            <div class="card-actions">
              <RouterLink :to="c.toNew" class="btn-add" @click.stop>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                <span>نوێ</span>
              </RouterLink>
              <div class="btn-arrow">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </div>
            </div>

            <div class="card-underline" :style="{ background: c.color }"></div>
          </RouterLink>
        </div>
      </section>

      <!-- Sidebar -->
      <aside class="sidebar-luxury">
        <!-- Donut Chart Card -->
        <div class="panel-luxury" v-if="!loading && totalRaw > 0">
          <div class="panel-header">
            <div class="panel-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 2a10 10 0 0110 10h-10z"/>
              </svg>
            </div>
            <h3>دابەشبوونی ناوەڕۆک</h3>
          </div>

          <div class="chart-container">
            <div class="donut-chart">
              <svg viewBox="0 0 200 200">
                <defs>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                <circle cx="100" cy="100" r="70" fill="none" stroke="currentColor" stroke-width="20" class="donut-track"/>
                <circle
                  v-for="(seg, i) in donutSegments"
                  :key="i"
                  cx="100" cy="100" r="70"
                  fill="none"
                  :stroke="seg.color"
                  stroke-width="20"
                  :stroke-dasharray="seg.dash"
                  :stroke-dashoffset="seg.offset"
                  class="donut-segment"
                  :style="{ animationDelay: `${i * 150}ms` }"
                />
              </svg>
              <div class="donut-center">
                <span class="donut-total">{{ totalContent }}</span>
                <span class="donut-label">کۆی گشتی</span>
              </div>
            </div>
          </div>

          <div class="chart-legend">
            <div 
              v-for="(seg, i) in donutSegments" 
              :key="i"
              class="legend-item"
              :style="{ '--lc': seg.color }"
            >
              <div class="legend-dot"></div>
              <span class="legend-name">{{ seg.label }}</span>
              <span class="legend-value">{{ seg.count }}</span>
              <span class="legend-pct">{{ pct(seg.count) }}٪</span>
            </div>
          </div>
        </div>

        <!-- Stats List -->
        <div class="panel-luxury panel-stats">
          <div class="panel-header">
            <div class="panel-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 20V10M12 20V4M6 20v-6"/>
              </svg>
            </div>
            <h3>ئامار بە جۆر</h3>
          </div>

          <div class="stats-list">
            <RouterLink
              v-for="(b, idx) in breakdownStats"
              :key="b.key"
              :to="b.to"
              class="stat-row"
              :style="{ '--row-color': b.color, '--row-delay': `${idx * 60}ms` }"
            >
              <div class="row-left">
                <div class="row-icon" v-html="b.icon"></div>
                <div class="row-info">
                  <span class="row-title">{{ b.label }}</span>
                  <span class="row-sub">{{ b.sub }}</span>
                </div>
              </div>
              <div class="row-right">
                <span v-if="loading" class="skeleton-sm"></span>
                <span v-else class="row-number">{{ getCount(b.key) ?? '—' }}</span>
                <div class="row-bar">
                  <div class="row-fill" :style="{ width: loading ? '0%' : barPct(getCount(b.key)) }"></div>
                </div>
              </div>
            </RouterLink>
          </div>

          <div class="total-summary" v-if="!loading">
            <div class="summary-content">
              <span class="summary-label">کۆی گشتی تۆمارەکان</span>
              <span class="summary-value">{{ totalContent }}</span>
              <span class="summary-meta">لە {{ Object.keys(counts).length }} بەش</span>
            </div>
            <div class="summary-glow"></div>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>



<style scoped>
/* ═══════════════════════════════════════════════════════════════
   LUXURY DASHBOARD - Enhanced Kurdish CMS Interface
   ═══════════════════════════════════════════════════════════════ */

/* ─── Design Tokens ───────────────────────────────────────────── */
.dash-luxury {
  --bg-primary: #faf9f7;
  --bg-secondary: #ffffff;
  --text-primary: #1a1a1a;
  --text-secondary: #666666;
  --accent-crimson: #8C1515;
  --accent-gold: #D4AF37;
  --accent-cream: #f5f3f0;
  --border-light: rgba(0, 0, 0, 0.06);
  --border-medium: rgba(0, 0, 0, 0.1);
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.04);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.05);
  --shadow-lg: 0 12px 40px rgba(0, 0, 0, 0.08);
  --shadow-glow: 0 0 40px rgba(140, 21, 21, 0.15);
  
  direction: rtl;
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  background: var(--bg-primary);
  font-family: system-ui, -apple-system, "Segoe UI", "Noto Sans Arabic", sans-serif;
  line-height: 1.6;
}

/* ─── Animations ──────────────────────────────────────────────── */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

@keyframes pulse-glow {
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.05); }
}

@keyframes border-flow {
  0% { background-position: 0% 50%; }
  100% { background-position: 200% 50%; }
}

@keyframes enter-up {
  from { 
    opacity: 0; 
    transform: translateY(20px) scale(0.98); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0) scale(1); 
  }
}

@keyframes particle-rise {
  0% { 
    transform: translateY(100%) rotate(0deg); 
    opacity: 0; 
  }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { 
    transform: translateY(-100vh) rotate(360deg); 
    opacity: 0; 
  }
}

/* ─── Skeleton Loaders ────────────────────────────────────────── */
.skeleton-text, .skeleton-sm {
  background: linear-gradient(90deg, #e8e5e1 25%, #f0ede9 50%, #e8e5e1 75%);
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
  border-radius: 4px;
  display: inline-block;
}

.skeleton-text { width: 60px; height: 28px; }
.skeleton-sm { width: 32px; height: 16px; }

/* ─── HERO SECTION ────────────────────────────────────────────── */
.hero-luxury {
  position: relative;
  background: linear-gradient(135deg, #2A0606 0%, #8C1515 50%, #5A0E0E 100%);
  border-radius: 32px;
  padding: 3rem;
  color: white;
  overflow: hidden;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  box-shadow: var(--shadow-glow), 0 20px 60px rgba(0, 0, 0, 0.3);
}

/* Particle Effect */
.hero-particles {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.particle {
  position: absolute;
  bottom: -10px;
  width: 4px;
  height: 4px;
  background: rgba(212, 175, 55, 0.6);
  border-radius: 50%;
  left: calc(var(--i) * 5%);
  animation: particle-rise 15s infinite;
  animation-delay: var(--delay);
  animation-timing-function: linear;
}

/* Hero Content */
.hero-content {
  display: flex;
  align-items: center;
  gap: 2rem;
  z-index: 1;
  position: relative;
}

.hero-badge {
  position: relative;
  animation: float 6s ease-in-out infinite;
}

.badge-emblem {
  width: 72px;
  height: 72px;
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.2), rgba(212, 175, 55, 0.05));
  border: 2px solid rgba(212, 175, 55, 0.5);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  backdrop-filter: blur(10px);
  box-shadow: 
    0 0 0 4px rgba(212, 175, 55, 0.1),
    0 10px 30px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.badge-text {
  font-weight: 900;
  font-size: 1.25rem;
  color: var(--accent-gold);
  letter-spacing: 0.05em;
}

.badge-ring {
  position: absolute;
  border: 1px solid rgba(212, 175, 55, 0.3);
  border-radius: 50%;
  pointer-events: none;
}

.badge-ring--outer {
  width: 90px;
  height: 90px;
  animation: pulse-glow 4s ease-in-out infinite;
}

.badge-ring--inner {
  width: 60px;
  height: 60px;
  animation: pulse-glow 4s ease-in-out infinite reverse;
}

/* Hero Typography */
.hero-typography {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.hero-eyebrow {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  opacity: 0.7;
  color: rgba(255, 255, 255, 0.8);
}

.hero-title {
  font-size: 2rem;
  font-weight: 800;
  line-height: 1.2;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.title-welcome {
  color: rgba(255, 255, 255, 0.9);
}

.title-name {
  color: var(--accent-gold);
  text-shadow: 0 2px 20px rgba(212, 175, 55, 0.3);
}

.hero-subtitle {
  font-size: 0.875rem;
  opacity: 0.6;
  margin: 0;
}

/* Hero Status */
.hero-status {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 1rem;
  z-index: 1;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 99px;
  font-size: 0.75rem;
  font-weight: 600;
}

.status-pulse {
  width: 8px;
  height: 8px;
  background: #4ade80;
  border-radius: 50%;
  box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.7);
  animation: pulse-green 2s infinite;
}

@keyframes pulse-green {
  0% { box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.7); }
  70% { box-shadow: 0 0 0 10px rgba(74, 222, 128, 0); }
  100% { box-shadow: 0 0 0 0 rgba(74, 222, 128, 0); }
}

.status-date {
  font-size: 0.8125rem;
  opacity: 0.6;
  font-weight: 500;
}

.total-counter {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 1.25rem 2rem;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.counter-value {
  font-size: 2.5rem;
  font-weight: 900;
  color: var(--accent-gold);
  line-height: 1;
  font-variant-numeric: tabular-nums;
}

.counter-label {
  font-size: 0.75rem;
  opacity: 0.7;
  font-weight: 600;
  margin-top: 0.25rem;
}

/* ─── BENTO RIBBON ────────────────────────────────────────────── */
.bento-ribbon {
  background: var(--bg-secondary);
  border: 1px solid var(--border-light);
  border-radius: 24px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: var(--shadow-md);
}

.bento-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  color: var(--text-secondary);
  font-weight: 700;
  font-size: 0.875rem;
}

.bento-icon {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, rgba(140, 21, 21, 0.1), rgba(140, 21, 21, 0.05));
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--accent-crimson);
}

.bento-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 0.75rem;
}

.bento-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: var(--bg-primary);
  border: 1.5px solid var(--border-light);
  border-radius: 16px;
  text-decoration: none;
  color: var(--text-primary);
  font-weight: 600;
  font-size: 0.8125rem;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  animation: enter-up 0.5s both;
  animation-delay: calc(var(--i) * 50ms);
}

.bento-shine {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, transparent 40%, rgba(255, 255, 255, 0.4) 50%, transparent 60%);
  transform: translateX(-100%);
  transition: transform 0.6s;
}

.bento-item:hover {
  transform: translateY(-2px) scale(1.02);
  border-color: var(--accent-crimson);
  box-shadow: 0 8px 24px rgba(140, 21, 21, 0.12);
}

.bento-item:hover .bento-shine {
  transform: translateX(100%);
}

.bento-icon-bg {
  width: 32px;
  height: 32px;
  background: white;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-sm);
  color: var(--accent-crimson);
  flex-shrink: 0;
}

.bento-text {
  flex: 1;
}

.bento-arrow {
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.3s;
  color: var(--accent-crimson);
}

.bento-item:hover .bento-arrow {
  opacity: 1;
  transform: translateX(0);
}

/* ─── STATS MASONRY ───────────────────────────────────────────── */
.stats-masonry {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  position: relative;
  background: var(--bg-secondary);
  border: 1.5px solid var(--border-light);
  border-radius: 24px;
  padding: 1.5rem;
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  animation: enter-up 0.6s both;
  animation-delay: var(--delay);
}

.stat-aurora {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at top right, var(--cs), transparent 70%);
  opacity: 0;
  transition: opacity 0.4s;
}

.stat-border {
  position: absolute;
  inset: 0;
  border-radius: 24px;
  padding: 1.5px;
  background: linear-gradient(var(--angle), var(--c), transparent, var(--c));
  background-size: 200% 200%;
  -webkit-mask: 
    linear-gradient(#fff 0 0) content-box, 
    linear-gradient(#fff 0 0);
  mask: 
    linear-gradient(#fff 0 0) content-box, 
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.4s;
  animation: border-flow 3s linear infinite;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.08),
    0 0 0 1px var(--c);
}

.stat-card:hover .stat-aurora {
  opacity: 1;
}

.stat-card:hover .stat-border {
  opacity: 1;
}

.stat-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.stat-icon-wrap {
  position: relative;
  width: 44px;
  height: 44px;
}

.stat-icon {
  width: 100%;
  height: 100%;
  background: var(--cs);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid color-mix(in srgb, var(--c) 20%, transparent);
  position: relative;
  z-index: 1;
}

.stat-glow-icon {
  position: absolute;
  inset: -4px;
  background: var(--c);
  border-radius: 18px;
  opacity: 0.2;
  filter: blur(8px);
  transition: opacity 0.3s;
}

.stat-card:hover .stat-glow-icon {
  opacity: 0.4;
}

.stat-trend {
  color: #10b981;
  background: rgba(16, 185, 129, 0.1);
  padding: 0.25rem;
  border-radius: 6px;
}

.stat-body {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 900;
  color: var(--text-primary);
  font-variant-numeric: tabular-nums;
}

.stat-label {
  font-size: 0.8125rem;
  color: var(--text-secondary);
  font-weight: 600;
}

.stat-progress {
  position: relative;
  height: 4px;
  margin-top: auto;
}

.progress-track {
  position: absolute;
  inset: 0;
  background: var(--accent-cream);
  border-radius: 99px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--c), color-mix(in srgb, var(--c) 70%, white));
  border-radius: 99px;
  transition: width 1.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 0 10px color-mix(in srgb, var(--c) 50%, transparent);
}

.progress-glow {
  position: absolute;
  height: 100%;
  background: var(--c);
  border-radius: 99px;
  filter: blur(4px);
  opacity: 0.5;
  transition: width 1.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* ─── LAYOUT SPLIT ────────────────────────────────────────────── */
.layout-split {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 2rem;
  align-items: start;
}

@media (max-width: 1100px) {
  .layout-split {
    grid-template-columns: 1fr;
  }
}

/* ─── CONTENT SECTIONS ────────────────────────────────────────── */
.content-sections {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  position: relative;
}

.header-accent {
  width: 4px;
  height: 32px;
  background: linear-gradient(to bottom, var(--accent-crimson), transparent);
  border-radius: 99px;
}

.header-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, rgba(140, 21, 21, 0.1), rgba(140, 21, 21, 0.05));
  border: 1px solid rgba(140, 21, 21, 0.15);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--accent-crimson);
}

.section-header h2 {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--text-primary);
  margin: 0;
}

/* Cards Grid */
.cards-compact {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1rem;
}

.compact-card {
  position: relative;
  background: var(--bg-secondary);
  border: 1.5px solid var(--border-light);
  border-radius: 20px;
  padding: 1.25rem;
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  animation: enter-up 0.5s both;
  animation-delay: var(--enter-delay);
}

.card-ambient {
  position: absolute;
  inset: 0;
  background: radial-gradient(600px circle at var(--mouse-x, 100px) var(--mouse-y, 100px), var(--ccs), transparent 40%);
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
}

.compact-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08);
  border-color: var(--cc);
}

.compact-card:hover .card-ambient {
  opacity: 1;
}

.card-border {
  position: absolute;
  inset: 0;
  border-radius: 20px;
  border: 1.5px solid transparent;
  background: linear-gradient(135deg, var(--cc), transparent 50%) border-box;
  -webkit-mask: 
    linear-gradient(#fff 0 0) padding-box, 
    linear-gradient(#fff 0 0);
  mask: 
    linear-gradient(#fff 0 0) padding-box, 
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.3s;
}

.compact-card:hover .card-border {
  opacity: 1;
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.card-icon-box {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--cc);
  transition: transform 0.3s;
}

.compact-card:hover .card-icon-box {
  transform: scale(1.1) rotate(-5deg);
}

.card-count {
  font-size: 0.875rem;
  font-weight: 900;
  color: var(--text-primary);
  background: var(--accent-cream);
  padding: 0.25rem 0.75rem;
  border-radius: 8px;
  border: 1px solid var(--border-light);
}

.card-content {
  flex: 1;
}

.card-content h3 {
  font-size: 1rem;
  font-weight: 800;
  color: var(--text-primary);
  margin: 0 0 0.25rem 0;
}

.card-content p {
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.5;
}

.card-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
  padding-top: 0.75rem;
  border-top: 1px dashed var(--border-light);
}

.btn-add {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.8rem;
  background: linear-gradient(135deg, rgba(140, 21, 21, 0.08), rgba(140, 21, 21, 0.04));
  border: 1px solid rgba(140, 21, 21, 0.2);
  border-radius: 8px;
  color: var(--accent-crimson);
  font-size: 0.75rem;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.2s;
}

.btn-add:hover {
  background: var(--accent-crimson);
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(140, 21, 21, 0.25);
}

.btn-arrow {
  color: var(--border-medium);
  transition: all 0.3s;
}

.compact-card:hover .btn-arrow {
  color: var(--cc);
  transform: translateX(-4px);
}

.card-underline {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  opacity: 0;
  transition: opacity 0.3s;
}

.compact-card:hover .card-underline {
  opacity: 1;
}

/* ─── SIDEBAR ─────────────────────────────────────────────────── */
.sidebar-luxury {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.panel-luxury {
  background: var(--bg-secondary);
  border: 1px solid var(--border-light);
  border-radius: 24px;
  padding: 1.5rem;
  box-shadow: var(--shadow-md);
}

.panel-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.panel-icon {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, rgba(140, 21, 21, 0.1), rgba(140, 21, 21, 0.05));
  border: 1px solid rgba(140, 21, 21, 0.15);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--accent-crimson);
}

.panel-header h3 {
  font-size: 1rem;
  font-weight: 800;
  color: var(--text-primary);
  margin: 0;
}

/* Donut Chart */
.chart-container {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.donut-chart {
  position: relative;
  width: 180px;
  height: 180px;
}

.donut-chart svg {
  transform: rotate(-90deg);
  width: 100%;
  height: 100%;
  color: var(--accent-cream);
}

.donut-track {
  stroke: currentColor;
}

.donut-segment {
  stroke-linecap: round;
  transition: all 0.3s;
  animation: enter-up 1s both;
  filter: drop-shadow(0 0 4px currentColor);
}

.donut-segment:hover {
  filter: drop-shadow(0 0 8px currentColor);
  transform: scale(1.02);
  transform-origin: center;
}

.donut-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.donut-total {
  display: block;
  font-size: 1.75rem;
  font-weight: 900;
  color: var(--text-primary);
  line-height: 1;
  font-variant-numeric: tabular-nums;
}

.donut-label {
  font-size: 0.6875rem;
  color: var(--text-secondary);
  font-weight: 600;
}

/* Legend */
.chart-legend {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  border-radius: 10px;
  transition: background 0.2s;
}

.legend-item:hover {
  background: var(--accent-cream);
}

.legend-dot {
  width: 10px;
  height: 10px;
  background: var(--lc);
  border-radius: 50%;
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--lc) 20%, transparent);
}

.legend-name {
  flex: 1;
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--text-primary);
}

.legend-value {
  font-size: 0.875rem;
  font-weight: 900;
  color: var(--lc);
  font-variant-numeric: tabular-nums;
}

.legend-pct {
  font-size: 0.75rem;
  color: var(--text-secondary);
  font-weight: 600;
  min-width: 36px;
  text-align: left;
}

/* Stats List */
.stats-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  border-radius: 14px;
  text-decoration: none;
  color: inherit;
  transition: all 0.2s;
  animation: enter-up 0.4s both;
  animation-delay: var(--row-delay);
}

.stat-row:hover {
  background: var(--accent-cream);
  transform: translateX(-4px);
}

.row-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.row-icon {
  width: 36px;
  height: 36px;
  background: white;
  border: 1px solid var(--border-light);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--row-color);
  box-shadow: var(--shadow-sm);
}

.row-info {
  display: flex;
  flex-direction: column;
}

.row-title {
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--text-primary);
}

.row-sub {
  font-size: 0.6875rem;
  color: var(--text-secondary);
}

.row-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.row-number {
  font-size: 0.9375rem;
  font-weight: 900;
  color: var(--row-color);
  min-width: 32px;
  text-align: center;
  font-variant-numeric: tabular-nums;
}

.row-bar {
  width: 50px;
  height: 4px;
  background: var(--accent-cream);
  border-radius: 99px;
  overflow: hidden;
}

.row-fill {
  height: 100%;
  background: var(--row-color);
  border-radius: 99px;
  transition: width 1s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 0 8px color-mix(in srgb, var(--row-color) 50%, transparent);
}

/* Total Summary */
.total-summary {
  position: relative;
  background: linear-gradient(135deg, #2A0606 0%, #8C1515 100%);
  border-radius: 16px;
  padding: 1.25rem;
  color: white;
  text-align: center;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(140, 21, 21, 0.3);
}

.summary-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(212, 175, 55, 0.2), transparent 70%);
  animation: rotate 10s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.summary-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.summary-label {
  font-size: 0.75rem;
  opacity: 0.7;
  font-weight: 600;
}

.summary-value {
  font-size: 2rem;
  font-weight: 900;
  color: var(--accent-gold);
  line-height: 1;
  font-variant-numeric: tabular-nums;
}

.summary-meta {
  font-size: 0.6875rem;
  opacity: 0.5;
}

/* ─── Responsive ──────────────────────────────────────────────── */
@media (max-width: 768px) {
  .dash-luxury {
    padding: 1rem;
  }
  
  .hero-luxury {
    flex-direction: column;
    text-align: center;
    padding: 2rem;
    gap: 2rem;
  }
  
  .hero-content {
    flex-direction: column;
  }
  
  .hero-status {
    align-items: center;
  }
  
  .stats-masonry {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .cards-compact {
    grid-template-columns: 1fr;
  }
  
  .bento-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .stats-masonry {
    grid-template-columns: 1fr;
  }
  
  .total-counter {
    padding: 1rem 1.5rem;
  }
  
  .counter-value {
    font-size: 2rem;
  }
}
</style>