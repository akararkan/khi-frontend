<template>
  <div class="dash" dir="rtl">

    <!-- ═══ Hero Banner ═══ -->
    <header class="hero">
      <div class="hero__bg">
        <div class="hero__orb hero__orb--1"></div>
        <div class="hero__orb hero__orb--2"></div>
        <div class="hero__pattern"></div>
      </div>
      <div class="hero__body">
        <div class="hero__badge">KHI</div>
        <div class="hero__info">
          <h1 class="hero__greet">بەخێربێیت، <span class="hero__name">{{ auth.username || auth.role || 'ئەدمین' }}</span></h1>
          <p class="hero__desc">ناوەندی کەلەپووری کوردی — سیستەمی بەڕێوەبردنی ناوەڕۆک</p>
        </div>
      </div>
      <div class="hero__right">
        <time class="hero__date">{{ today }}</time>
        <div class="hero__status">
          <span class="hero__dot"></span>
          سیستەم چالاکە
        </div>
      </div>
    </header>

    <!-- ═══ Stat Cards Row ═══ -->
    <section class="stats-section">
      <RouterLink
        v-for="(s, idx) in stats"
        :key="s.key"
        class="sc"
        :to="s.to"
        :style="{ '--c': s.color, '--c-soft': s.soft, animationDelay: (idx * 60) + 'ms' }"
      >
        <div class="sc__icon" v-html="s.icon"></div>
        <div class="sc__data">
          <div class="sc__val">
            <template v-if="loading"><span class="skel"></span></template>
            <template v-else>{{ s.num }}</template>
          </div>
          <div class="sc__name">{{ s.label }}</div>
        </div>
        <div class="sc__bar"><div class="sc__bar-inner" :style="{ width: loading ? '0%' : barWidth(s.num) }"></div></div>
      </RouterLink>
    </section>

    <!-- ═══ Quick Actions ═══ -->
    <section class="quick-strip">
      <span class="quick-strip__title">دەستپێکردنی خێرا</span>
      <div class="quick-strip__list">
        <RouterLink v-for="q in quickActions" :key="q.label" :to="q.to" class="qbtn">
          <span class="qbtn__plus">+</span>
          {{ q.label }}
        </RouterLink>
      </div>
    </section>

    <!-- ═══ Main Content ═══ -->
    <div class="content">

      <!-- Left: Section Cards -->
      <section class="sections">
        <h2 class="heading">
          <span class="heading__icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--crimson)" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>
          </span>
          بەشەکانی ناوەڕۆک
        </h2>

        <div class="cards">
          <RouterLink
            v-for="(c, idx) in shortcuts"
            :key="c.key"
            class="scard"
            :to="c.to"
            :style="{ '--sc': c.color, animationDelay: (idx * 50 + 200) + 'ms' }"
          >
            <div class="scard__top">
              <div class="scard__ico" :style="{ background: c.soft }" v-html="c.icon"></div>
              <span class="scard__count" v-if="!loading && getCount(c.key) !== null">{{ getCount(c.key) }}</span>
            </div>
            <h3 class="scard__title">{{ c.label }}</h3>
            <p class="scard__hint">{{ c.hint }}</p>
            <div class="scard__foot">
              <RouterLink :to="c.toNew" class="scard__add" @click.stop>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                نوێ زیادبکە
              </RouterLink>
              <svg class="scard__arrow" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3L11 8L6 13" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </div>
            <div class="scard__accent"></div>
          </RouterLink>
        </div>
      </section>

      <!-- Right: Chart + Summary -->
      <aside class="sidebar">

        <!-- Donut Chart -->
        <div class="chart-panel" v-if="!loading && totalRaw > 0">
          <h2 class="heading heading--sm">
            <span class="heading__icon heading__icon--sm">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--crimson)" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0110 10h-10z"/></svg>
            </span>
            دابەشبوونی ناوەڕۆک
          </h2>

          <div class="donut-area">
            <svg class="donut" viewBox="0 0 160 160">
              <!-- Background circle -->
              <circle cx="80" cy="80" r="62" fill="none" stroke="#f0eeeb" stroke-width="16"/>
              <!-- Data segments -->
              <circle
                v-for="(seg, i) in donutSegments"
                :key="'d'+i"
                cx="80" cy="80" r="62"
                fill="none"
                :stroke="seg.color"
                stroke-width="16"
                :stroke-dasharray="seg.dash"
                :stroke-dashoffset="seg.offset"
                stroke-linecap="round"
                class="donut__arc"
                :style="{ animationDelay: (i * 120) + 'ms' }"
              />
            </svg>
            <div class="donut__mid">
              <div class="donut__big">{{ totalContent }}</div>
              <div class="donut__lbl">کۆی گشتی</div>
            </div>
          </div>

          <!-- Legend -->
          <div class="legend">
            <div v-for="(seg, i) in donutSegments" :key="'l'+i" class="legend__row">
              <span class="legend__dot" :style="{ background: seg.color }"></span>
              <span class="legend__text">{{ seg.label }}</span>
              <span class="legend__num">{{ seg.count }}</span>
            </div>
          </div>
        </div>

        <!-- Summary Panel -->
        <div class="summary-panel">
          <h2 class="heading heading--sm">
            <span class="heading__icon heading__icon--sm">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--crimson)" stroke-width="2"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>
            </span>
            ئامار بە جۆر
          </h2>

          <div class="summary-list">
            <RouterLink
              v-for="b in breakdownStats"
              :key="b.key"
              :to="b.to"
              class="srow"
              :style="{ '--rc': b.color }"
            >
              <div class="srow__ico" v-html="b.icon"></div>
              <div class="srow__info">
                <div class="srow__label">{{ b.label }}</div>
                <div class="srow__sub">{{ b.sub }}</div>
              </div>
              <div class="srow__num">
                <template v-if="loading"><span class="skel skel--sm"></span></template>
                <template v-else>{{ getCount(b.key) ?? '—' }}</template>
              </div>
            </RouterLink>
          </div>

          <!-- Total footer -->
          <div class="summary-total" v-if="!loading">
            <div class="summary-total__lbl">کۆی گشتی تۆمارەکان</div>
            <div class="summary-total__val">{{ totalContent }}</div>
          </div>
        </div>
      </aside>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/useAuthStore'
import api from '@/api.js'

const auth    = useAuthStore()
const loading = ref(true)
const counts  = ref({})

// ── Fetch counts ──────────────────────────────────────────────────────────────
const endpoints = [
  { key: 'projects',          url: '/api/v1/projects/getAll?page=0&size=1',  extract: d => d?.data?.totalElements ?? d?.totalElements ?? (Array.isArray(d) ? d.length : null) },
  { key: 'news',              url: '/api/v1/news?page=0&size=1',             extract: d => d?.data?.totalElements ?? d?.totalElements ?? (Array.isArray(d) ? d.length : null) },
  { key: 'films',             url: '/api/v1/films',                          extract: d => Array.isArray(d) ? d.length : (d?.data?.totalElements ?? d?.totalElements ?? null) },
  { key: 'image-collections', url: '/api/v1/image-collections',             extract: d => Array.isArray(d) ? d.length : (d?.data?.totalElements ?? d?.totalElements ?? null) },
  { key: 'soundtracks',       url: '/api/v1/soundtracks',                   extract: d => Array.isArray(d) ? d.length : (d?.data?.totalElements ?? d?.totalElements ?? null) },
  { key: 'writings',          url: '/api/v1/writings',                      extract: d => Array.isArray(d) ? d.length : (d?.data?.totalElements ?? d?.totalElements ?? null) },
  { key: 'albums',            url: '/api/v1/albums',                        extract: d => Array.isArray(d) ? d.length : (d?.data?.totalElements ?? d?.totalElements ?? null) },
]

const fetchCounts = async () => {
  loading.value = true
  const results = await Promise.allSettled(
    endpoints.map(ep => api.get(ep.url).then(r => ({ key: ep.key, val: ep.extract(r.data) })))
  )
  const c = {}
  results.forEach(r => { if (r.status === 'fulfilled') c[r.value.key] = r.value.val })
  counts.value = c
  loading.value = false
}

const getCount = (key) => counts.value[key] ?? null
const maxCount = computed(() => Math.max(1, ...Object.values(counts.value).filter(v => v !== null)))
const totalRaw = computed(() => Object.values(counts.value).reduce((a, v) => a + (v ?? 0), 0))
const totalContent = computed(() => totalRaw.value.toLocaleString('ar-IQ'))

const barWidth = (num) => {
  if (num === null || num === undefined || num === '—') return '8%'
  return Math.max(8, Math.round((Number(num) / maxCount.value) * 100)) + '%'
}

// ── Color palette ─────────────────────────────────────────────────────────────
const palette = {
  projects:            { color: '#8C1515', soft: 'rgba(140,21,21,.07)' },
  news:                { color: '#0f766e', soft: 'rgba(15,118,110,.07)' },
  films:               { color: '#a16207', soft: 'rgba(161,98,7,.07)' },
  writings:            { color: '#4338ca', soft: 'rgba(67,56,202,.07)' },
  albums:              { color: '#c2410c', soft: 'rgba(194,65,12,.07)' },
  'image-collections': { color: '#7c3aed', soft: 'rgba(124,58,237,.07)' },
  soundtracks:         { color: '#be185d', soft: 'rgba(190,24,93,.07)' },
}

// ── Stats row data ────────────────────────────────────────────────────────────
const statsData = [
  { key: 'projects',          label: 'پڕۆژەکان',    to: '/admin/projects',          ico: 'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z' },
  { key: 'news',              label: 'هەواڵەکان',    to: '/admin/news',              ico: 'M4 22h16a2 2 0 002-2V4a2 2 0 00-2-2H8a2 2 0 00-2 2v16a2 2 0 01-2 2z' },
  { key: 'films',             label: 'فیلمەکان',     to: '/admin/films',             ico: 'M2 2h20v20H2zM7 2v20M17 2v20M2 12h20' },
  { key: 'writings',          label: 'نووسراوەکان',  to: '/admin/writings',          ico: 'M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4z' },
  { key: 'albums',            label: 'ئەلبوومەکان',  to: '/admin/albums',            ico: 'circle' },
  { key: 'image-collections', label: 'وێنەکان',      to: '/admin/image-collections', ico: 'M3 3h18v18H3z' },
  { key: 'soundtracks',       label: 'دەنگەکان',     to: '/admin/soundtracks',       ico: 'M9 18V5l12-2v13' },
]

const stats = statsData.map(s => ({
  ...s,
  color: palette[s.key].color,
  soft:  palette[s.key].soft,
  get num() { return counts.value[s.key] ?? '—' },
  icon:  s.key === 'albums'
    ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${palette[s.key].color}" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>`
    : s.key === 'image-collections'
    ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${palette[s.key].color}" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`
    : s.key === 'soundtracks'
    ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${palette[s.key].color}" stroke-width="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`
    : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${palette[s.key].color}" stroke-width="2"><path d="${s.ico}"/></svg>`,
}))

// ── Quick actions ─────────────────────────────────────────────────────────────
const quickActions = [
  { label: 'پڕۆژەی نوێ',    to: '/admin/projects/new' },
  { label: 'هەواڵی نوێ',     to: '/admin/news/new' },
  { label: 'فیلمی نوێ',      to: '/admin/films/new' },
  { label: 'نووسراوەی نوێ',  to: '/admin/writings/new' },
  { label: 'ئەلبوومی نوێ',   to: '/admin/albums/new' },
  { label: 'وێنەی نوێ',      to: '/admin/image-collections/new' },
  { label: 'دەنگی نوێ',      to: '/admin/soundtracks/new' },
]

// ── Shortcuts cards ───────────────────────────────────────────────────────────
const shortcuts = [
  { key: 'projects',          label: 'پڕۆژەکان',              hint: 'بینین و بەڕێوەبردن',           to: '/admin/projects',          toNew: '/admin/projects/new',          ...palette.projects,          icon: stats[0].icon },
  { key: 'news',              label: 'هەواڵەکان',              hint: 'بڵاوکردنەوەی بابەت',           to: '/admin/news',              toNew: '/admin/news/new',              ...palette.news,              icon: stats[1].icon },
  { key: 'albums',            label: 'ئەلبوومی بیرەوەریەکان',  hint: 'ئەرشیفی بیرەوەری',             to: '/admin/albums',            toNew: '/admin/albums/new',            ...palette.albums,            icon: stats[4].icon },
  { key: 'films',             label: 'فیلمەکان',               hint: 'فیلم و دۆکیومێنتاری',          to: '/admin/films',             toNew: '/admin/films/new',             ...palette.films,             icon: stats[2].icon },
  { key: 'image-collections', label: 'کۆمەڵە وێنەکان',        hint: 'گالەری و وێنەکان',             to: '/admin/image-collections', toNew: '/admin/image-collections/new', ...palette['image-collections'], icon: stats[5].icon },
  { key: 'soundtracks',       label: 'دەنگەکان',               hint: 'ئەرشیفی مووسیقا و دەنگ',       to: '/admin/soundtracks',       toNew: '/admin/soundtracks/new',       ...palette.soundtracks,       icon: stats[6].icon },
  { key: 'writings',          label: 'نووسراوەکان',            hint: 'کتێب و نووسراوەی دیجیتاڵ',     to: '/admin/writings',          toNew: '/admin/writings/new',          ...palette.writings,          icon: stats[3].icon },
]

// ── Breakdown ─────────────────────────────────────────────────────────────────
const breakdownStats = [
  { key: 'projects',          label: 'پڕۆژەکان',     sub: 'بەڕێوەبردن',          to: '/admin/projects',          ...palette.projects,          icon: stats[0].icon },
  { key: 'news',              label: 'هەواڵەکان',     sub: 'بابەت و بڵاوکراوە',    to: '/admin/news',              ...palette.news,              icon: stats[1].icon },
  { key: 'albums',            label: 'ئەلبوومەکان',   sub: 'بیرەوەری دەنگ و ڤیدیۆ', to: '/admin/albums',           ...palette.albums,            icon: stats[4].icon },
  { key: 'films',             label: 'فیلمەکان',      sub: 'فیلم و دۆکیومێنتاری',  to: '/admin/films',             ...palette.films,             icon: stats[2].icon },
  { key: 'image-collections', label: 'وێنەکان',       sub: 'کۆمەڵە و گالەری',      to: '/admin/image-collections', ...palette['image-collections'], icon: stats[5].icon },
  { key: 'soundtracks',       label: 'دەنگەکان',      sub: 'مووسیقا و تۆمار',       to: '/admin/soundtracks',       ...palette.soundtracks,       icon: stats[6].icon },
  { key: 'writings',          label: 'نووسراوەکان',   sub: 'کتێب و نووسراوە',       to: '/admin/writings',          ...palette.writings,          icon: stats[3].icon },
]

// ── Donut ──────────────────────────────────────────────────────────────────────
const donutSegments = computed(() => {
  const total = Math.max(1, totalRaw.value)
  const circ  = 2 * Math.PI * 62
  let cum = 0
  const keys = ['projects','news','films','writings','albums','image-collections','soundtracks']
  const labels = { projects:'پڕۆژەکان', news:'هەواڵەکان', films:'فیلمەکان', writings:'نووسراوەکان', albums:'ئەلبوومەکان', 'image-collections':'وێنەکان', soundtracks:'دەنگەکان' }

  return keys.map(key => {
    const count = counts.value[key] ?? 0
    const arc   = (count / total) * circ
    const gap   = count > 0 ? 4 : 0
    const seg   = {
      color: palette[key].color,
      count,
      label: labels[key],
      dash:  `${Math.max(0, arc - gap)} ${circ}`,
      offset: -cum,
    }
    cum += arc
    return seg
  }).filter(s => s.count > 0)
})

// ── Date ──────────────────────────────────────────────────────────────────────
const today = computed(() =>
  new Date().toLocaleDateString('ckb', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
)

onMounted(fetchCounts)
</script>

<style scoped>
/* ═══════════════════════════════════════════════════════════════════════════
   Admin Dashboard — KHI — Refined Heritage Style
   ═══════════════════════════════════════════════════════════════════════════ */

.dash {
  direction: rtl;
  max-width: 1300px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
}

/* ── Skeleton loader ───────────────────────────────────────────────────── */
.skel {
  display: inline-block;
  width: 38px; height: 24px;
  border-radius: 6px;
  background: linear-gradient(90deg, var(--cream-dk) 25%, #fff 50%, var(--cream-dk) 75%);
  background-size: 200%;
  animation: shimmer 1.5s infinite;
}
.skel--sm { width: 28px; height: 18px; }
@keyframes shimmer { 0% { background-position: 200% 0 } to { background-position: -200% 0 } }

/* ── Appear animation ──────────────────────────────────────────────────── */
@keyframes slideUp {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ═══ HERO ═════════════════════════════════════════════════════════════════ */
.hero {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1.2rem;
  padding: 2rem 2.2rem;
  border-radius: 20px;
  color: #fff;
  overflow: hidden;
  min-height: 110px;
}
.hero__bg {
  position: absolute; inset: 0;
  background: linear-gradient(135deg, #3A0909 0%, #8C1515 50%, #601010 100%);
  z-index: 0;
}
.hero__orb {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
}
.hero__orb--1 {
  width: 260px; height: 260px;
  top: -100px; left: -60px;
  background: radial-gradient(circle, rgba(254,221,0,.14) 0%, transparent 70%);
}
.hero__orb--2 {
  width: 180px; height: 180px;
  bottom: -70px; right: 8%;
  background: radial-gradient(circle, rgba(255,255,255,.04) 0%, transparent 70%);
}
.hero__pattern {
  position: absolute; inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.015'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E");
}
.hero__body {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  position: relative;
  z-index: 1;
  flex: 1;
  min-width: 0;
}
.hero__badge {
  width: 54px; height: 54px; flex: 0 0 54px;
  border-radius: 15px;
  background: rgba(254,221,0,.14);
  border: 1.5px solid rgba(254,221,0,.35);
  box-shadow: 0 0 32px rgba(254,221,0,.18);
  display: flex; align-items: center; justify-content: center;
  font-family: 'Playfair Display', serif;
  font-weight: 900;
  font-size: 1rem;
  color: var(--gold);
  letter-spacing: .03em;
}
.hero__greet {
  font-size: 1.35rem;
  font-weight: 800;
  line-height: 1.35;
  margin-bottom: .25rem;
}
.hero__name { color: var(--gold); }
.hero__desc { font-size: .82rem; opacity: .68; }
.hero__right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: .45rem;
  position: relative;
  z-index: 1;
  flex-shrink: 0;
}
.hero__date { font-size: .78rem; opacity: .55; white-space: nowrap; }
.hero__status {
  display: flex;
  align-items: center;
  gap: .45rem;
  font-size: .76rem;
  opacity: .72;
}
.hero__dot {
  width: 7px; height: 7px;
  border-radius: 50%;
  background: #4ade80;
  box-shadow: 0 0 0 3px rgba(74,222,128,.25);
  animation: blink 2s ease infinite;
}
@keyframes blink {
  0%, 100% { box-shadow: 0 0 0 3px rgba(74,222,128,.25); }
  50%      { box-shadow: 0 0 0 6px rgba(74,222,128,.08); }
}

/* ═══ STAT CARDS ROW ══════════════════════════════════════════════════════ */
.stats-section {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: .7rem;
}
@media (max-width: 1200px) { .stats-section { grid-template-columns: repeat(4, 1fr); } }
@media (max-width: 700px)  { .stats-section { grid-template-columns: repeat(2, 1fr); } }

.sc {
  display: flex;
  align-items: center;
  gap: .65rem;
  padding: .85rem .95rem;
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: 14px;
  text-decoration: none;
  color: var(--text);
  position: relative;
  overflow: hidden;
  transition: transform .18s, box-shadow .18s, border-color .18s;
  animation: slideUp .5s cubic-bezier(.22,1,.36,1) both;
}
.sc:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 28px rgba(0,0,0,.08);
  border-color: var(--c);
}
.sc::after {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2.5px;
  background: var(--c);
  opacity: 0;
  transition: opacity .2s;
}
.sc:hover::after { opacity: 1; }

.sc__icon {
  width: 36px; height: 36px; flex: 0 0 36px;
  border-radius: 10px;
  background: var(--c-soft);
  display: flex;
  align-items: center;
  justify-content: center;
}
.sc__data { flex: 1; min-width: 0; }
.sc__val {
  font-size: 1.3rem;
  font-weight: 800;
  line-height: 1;
  color: var(--text);
}
.sc__name {
  font-size: .68rem;
  font-weight: 600;
  color: var(--muted);
  margin-top: .15rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.sc__bar {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 2.5px;
  background: var(--cream-dk);
}
.sc__bar-inner {
  height: 100%;
  background: var(--c);
  border-radius: 0 99px 99px 0;
  transition: width 1.2s cubic-bezier(.34,1.56,.64,1);
}

/* ═══ QUICK STRIP ═════════════════════════════════════════════════════════ */
.quick-strip {
  display: flex;
  align-items: center;
  gap: .85rem;
  flex-wrap: wrap;
}
.quick-strip__title {
  font-weight: 700;
  font-size: .78rem;
  color: var(--muted);
  white-space: nowrap;
}
.quick-strip__list {
  display: flex;
  gap: .4rem;
  flex-wrap: wrap;
  flex: 1;
}
.qbtn {
  display: inline-flex;
  align-items: center;
  gap: .3rem;
  padding: .4rem .8rem;
  border-radius: 99px;
  background: var(--white);
  border: 1.5px solid var(--border);
  color: var(--muted);
  text-decoration: none;
  font-size: .76rem;
  font-weight: 700;
  transition: .15s;
  white-space: nowrap;
}
.qbtn:hover {
  background: rgba(140,21,21,.04);
  border-color: var(--crimson);
  color: var(--crimson);
}
.qbtn__plus {
  font-size: .9rem;
  font-weight: 800;
  color: var(--crimson);
  line-height: 1;
}

/* ═══ MAIN CONTENT GRID ══════════════════════════════════════════════════ */
.content {
  display: grid;
  grid-template-columns: 1fr 330px;
  gap: 1.4rem;
  align-items: start;
}
@media (max-width: 1000px) { .content { grid-template-columns: 1fr; } }

/* ── Section heading ──────────────────────────────────────────────────── */
.heading {
  display: flex;
  align-items: center;
  gap: .5rem;
  font-size: .95rem;
  font-weight: 800;
  color: var(--text);
  margin-bottom: 1rem;
}
.heading--sm { font-size: .88rem; margin-bottom: .85rem; }
.heading__icon {
  width: 32px; height: 32px;
  border-radius: 9px;
  background: rgba(140,21,21,.06);
  border: 1px solid rgba(140,21,21,.1);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.heading__icon--sm { width: 28px; height: 28px; border-radius: 7px; }

/* ═══ SECTION CARDS ══════════════════════════════════════════════════════ */
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(195px, 1fr));
  gap: .8rem;
}

.scard {
  display: flex;
  flex-direction: column;
  gap: .15rem;
  text-decoration: none;
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 1.15rem;
  position: relative;
  overflow: hidden;
  transition: transform .18s, box-shadow .18s;
  animation: slideUp .5s cubic-bezier(.22,1,.36,1) both;
}
.scard:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 36px rgba(0,0,0,.07);
}
.scard__top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: .65rem;
}
.scard__ico {
  width: 42px; height: 42px;
  border-radius: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.scard__count {
  font-size: 1.05rem;
  font-weight: 800;
  color: var(--text);
  background: var(--cream-dk);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: .1rem .5rem;
  font-variant-numeric: tabular-nums;
}
.scard__title {
  font-weight: 700;
  font-size: .88rem;
  color: var(--text);
  margin: 0;
}
.scard__hint {
  font-size: .74rem;
  color: var(--muted);
  margin: 0;
  flex: 1;
}
.scard__foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: .7rem;
  padding-top: .65rem;
  border-top: 1px solid var(--cream-dk);
}
.scard__add {
  display: inline-flex;
  align-items: center;
  gap: .25rem;
  padding: .25rem .6rem;
  border-radius: 6px;
  background: rgba(140,21,21,.06);
  border: 1px solid rgba(140,21,21,.12);
  color: var(--crimson);
  font-size: .72rem;
  font-weight: 700;
  text-decoration: none;
  transition: .15s;
}
.scard__add:hover { background: rgba(140,21,21,.12); }
.scard__arrow {
  color: var(--border);
  transition: .15s;
}
.scard:hover .scard__arrow {
  color: var(--muted);
  transform: translateX(-3px);
}
.scard__accent {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 3px;
  background: var(--sc);
  opacity: 0;
  transition: opacity .2s;
}
.scard:hover .scard__accent { opacity: 1; }

/* ═══ SIDEBAR PANELS ═════════════════════════════════════════════════════ */
.sidebar {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

/* ── Chart panel ──────────────────────────────────────────────────────── */
.chart-panel {
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 1.3rem;
  box-shadow: 0 2px 10px rgba(0,0,0,.04);
}

.donut-area {
  position: relative;
  width: 152px; height: 152px;
  margin: .5rem auto 1.1rem;
}
.donut {
  width: 100%; height: 100%;
  transform: rotate(-90deg);
}
.donut__arc {
  animation: arcIn .9s cubic-bezier(.34,1.56,.64,1) both;
}
@keyframes arcIn {
  from { stroke-dasharray: 0 400; opacity: 0; }
}
.donut__mid {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}
.donut__big {
  font-size: 1.5rem;
  font-weight: 900;
  color: var(--text);
  line-height: 1;
}
.donut__lbl {
  font-size: .65rem;
  color: var(--muted);
  font-weight: 600;
  margin-top: .15rem;
}

/* Legend */
.legend { display: flex; flex-direction: column; gap: .35rem; }
.legend__row {
  display: flex;
  align-items: center;
  gap: .5rem;
  font-size: .78rem;
}
.legend__dot {
  width: 9px; height: 9px;
  border-radius: 3px;
  flex-shrink: 0;
}
.legend__text { flex: 1; font-weight: 600; color: var(--text); }
.legend__num  { font-weight: 800; color: var(--muted); font-variant-numeric: tabular-nums; }

/* ── Summary panel ────────────────────────────────────────────────────── */
.summary-panel {
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 1.3rem;
  box-shadow: 0 2px 10px rgba(0,0,0,.04);
}
.summary-list {
  display: flex;
  flex-direction: column;
  gap: .3rem;
  margin-bottom: 1rem;
}

.srow {
  display: flex;
  align-items: center;
  gap: .55rem;
  padding: .55rem .6rem;
  border-radius: 10px;
  text-decoration: none;
  color: inherit;
  transition: background .15s;
}
.srow:hover { background: var(--cream); }
.srow__ico {
  width: 26px; height: 26px;
  border-radius: 7px;
  background: var(--cream-dk);
  border: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.srow__info { flex: 1; min-width: 0; }
.srow__label { font-size: .82rem; font-weight: 700; color: var(--text); }
.srow__sub   { font-size: .68rem; color: var(--muted); }
.srow__num   { font-size: .88rem; font-weight: 800; color: var(--rc); font-variant-numeric: tabular-nums; }

/* Total */
.summary-total {
  background: linear-gradient(130deg, #3A0909, #7A1212);
  border-radius: 12px;
  padding: 1rem;
  color: #fff;
  text-align: center;
}
.summary-total__lbl { font-size: .72rem; opacity: .65; margin-bottom: .2rem; }
.summary-total__val { font-size: 1.8rem; font-weight: 900; color: var(--gold); line-height: 1; }
</style>