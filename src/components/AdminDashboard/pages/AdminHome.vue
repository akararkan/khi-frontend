<template>
  <div class="home">

    <!-- Hero -->
    <div class="hero">
      <div class="hero__inner">
        <div class="hero__gem">KHI</div>
        <div>
          <h1 class="hero__title">بەخێربێیت، {{ auth.role || 'ئەدمین' }}</h1>
          <p class="hero__sub">ئەمڕۆ چی دەمانەوێت بکەین؟ ناوەڕۆکەکان لێرە بەڕێوە دەبری.</p>
        </div>
      </div>
      <div class="hero__date">{{ today }}</div>
    </div>

    <!-- Stats row -->
    <div class="stats">
      <div class="stat" v-for="s in stats" :key="s.label">
        <div class="stat__ico" :style="{ background: s.bg }">
          <span v-html="s.icon"></span>
        </div>
        <div>
          <div class="stat__num">{{ s.num }}</div>
          <div class="stat__label">{{ s.label }}</div>
        </div>
      </div>
    </div>

    <!-- Grid shortcuts -->
    <h2 class="section-title">بەشەکان</h2>
    <div class="grid">
      <RouterLink class="card" v-for="it in shortcuts" :key="it.key" :to="it.to">
        <div class="card__head">
          <div class="card__ico" :style="{ background: it.bg }">
            <span v-html="it.icon"></span>
          </div>
          <svg class="card__arr" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 3L11 8L6 13" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="card__title">{{ it.label }}</div>
        <div class="card__hint">{{ it.hint }}</div>
        <div class="card__bar" :style="{ background: it.accent }"></div>
      </RouterLink>
    </div>

  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/useAuthStore'

const auth = useAuthStore()

const today = computed(() => {
  return new Date().toLocaleDateString('ckb', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
})

const stats = [
  { label: 'پڕۆژە',   num: '—', bg: 'rgba(140,21,21,.08)',   icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8C1515" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>` },
  { label: 'فیلم',    num: '—', bg: 'rgba(254,221,0,.15)',   icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#b08900" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="2"/><path d="M7 2v20M17 2v20M2 12h20"/></svg>` },
  { label: 'هەواڵ',   num: '—', bg: 'rgba(30,130,100,.08)', icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1e6b5a" stroke-width="2"><path d="M4 22h16a2 2 0 002-2V4a2 2 0 00-2-2H8a2 2 0 00-2 2v16a2 2 0 01-2 2z"/><path d="M10 6h8v4h-8z"/></svg>` },
  { label: 'نووسراوە', num: '—', bg: 'rgba(80,60,200,.07)',  icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4040b0" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4z"/></svg>` },
]

const shortcuts = [
  { key: 'projects',          label: 'پڕۆژەکان',    hint: 'بینین، دروستکردن و دەستکاری',  to: '/admin/projects',          icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8C1515" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>`, bg: 'rgba(140,21,21,.08)', accent: '#8C1515' },
  { key: 'news',              label: 'هەواڵ',        hint: 'بڵاوکردنەوەی هەواڵ',           to: '/admin/news',              icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1e6b5a" stroke-width="2"><path d="M4 22h16a2 2 0 002-2V4a2 2 0 00-2-2H8a2 2 0 00-2 2v16a2 2 0 01-2 2z"/></svg>`, bg: 'rgba(30,130,100,.08)', accent: '#1e6b5a' },
  { key: 'films',             label: 'فیلم',         hint: 'کتالۆگی فیلمەکان',             to: '/admin/films',             icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#b08900" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="2"/><path d="M7 2v20M17 2v20M2 12h20"/></svg>`, bg: 'rgba(254,221,0,.15)', accent: '#b08900' },
  { key: 'image-collections', label: 'کۆمەڵە وێنە', hint: 'گالەری و میدیا',               to: '/admin/image-collections', icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6040b0" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`, bg: 'rgba(80,40,180,.07)', accent: '#6040b0' },
  { key: 'soundtracks',       label: 'دەنگ',         hint: 'ئەرشیفی دەنگەکان',            to: '/admin/soundtracks',       icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#b05020" stroke-width="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`, bg: 'rgba(180,80,30,.07)', accent: '#b05020' },
  { key: 'writings',          label: 'نووسراوەکان',  hint: 'کتێبخانەی دیجیتاڵ',           to: '/admin/writings',          icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4040b0" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4z"/></svg>`, bg: 'rgba(60,40,180,.07)', accent: '#4040b0' },
]
</script>

<style scoped>
.home { direction: rtl; max-width: 1200px; margin: 0 auto; }

/* Hero */
.hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(130deg, #4A0A0A 0%, #8C1515 55%, #6B1010 100%);
  border-radius: var(--radius-lg);
  padding: 1.75rem 2rem;
  margin-bottom: 1.5rem;
  color: #fff;
  box-shadow: 0 12px 40px rgba(140,21,21,.3);
  position: relative;
  overflow: hidden;
}
.hero::after {
  content: '';
  position: absolute;
  top: -60px; left: -60px;
  width: 240px; height: 240px;
  border-radius: 50%;
  background: rgba(254,221,0,.06);
  pointer-events: none;
}
.hero__inner { display: flex; align-items: center; gap: 1.25rem; }
.hero__gem {
  width: 52px; height: 52px;
  border-radius: 15px;
  background: rgba(254,221,0,.15);
  border: 1px solid rgba(254,221,0,.35);
  display: flex; align-items: center; justify-content: center;
  font-family: 'Playfair Display', serif;
  font-size: 1rem;
  font-weight: 900;
  color: var(--gold);
  flex: 0 0 52px;
}
.hero__title { font-size: 1.4rem; font-weight: 700; margin-bottom: .25rem; }
.hero__sub { font-size: .87rem; opacity: .78; }
.hero__date { font-size: .8rem; opacity: .6; white-space: nowrap; }

/* Stats */
.stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}
@media (max-width: 900px) { .stats { grid-template-columns: repeat(2, 1fr); } }
.stat {
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 1.1rem 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: var(--shadow-sm);
}
.stat__ico {
  width: 44px; height: 44px;
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  flex: 0 0 44px;
}
.stat__num { font-size: 1.4rem; font-weight: 700; color: var(--text); line-height: 1; }
.stat__label { font-size: .8rem; color: var(--muted); margin-top: .2rem; }

/* Section title */
.section-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 1rem;
  padding-right: .25rem;
}

/* Cards grid */
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}
@media (max-width: 900px) { .grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 600px) { .grid { grid-template-columns: 1fr; } }

.card {
  display: block;
  text-decoration: none;
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 1.35rem;
  box-shadow: var(--shadow-sm);
  transition: var(--transition);
  position: relative;
  overflow: hidden;
}
.card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-lg);
  border-color: rgba(140,21,21,.2);
}
.card__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 1rem;
}
.card__ico {
  width: 46px; height: 46px;
  border-radius: 13px;
  display: flex; align-items: center; justify-content: center;
}
.card__arr { color: var(--border); transition: var(--transition); }
.card:hover .card__arr { color: var(--muted); transform: translateX(-3px); }
.card__title { font-weight: 700; color: var(--text); margin-bottom: .3rem; }
.card__hint { font-size: .82rem; color: var(--muted); }
.card__bar {
  position: absolute;
  bottom: 0; right: 0; left: 0;
  height: 3px;
  opacity: 0;
  transition: var(--transition);
}
.card:hover .card__bar { opacity: 1; }
</style>