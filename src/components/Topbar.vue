<template>
  <header class="topbar">

    <!-- Left: breadcrumb -->
    <div class="topbar__left">
      <div class="topbar__crumb">
        <RouterLink to="/admin" class="topbar__crumb-home">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
          </svg>
        </RouterLink>
        <span class="topbar__crumb-sep">›</span>
        <span class="topbar__crumb-page">{{ pageTitle }}</span>
        <template v-if="pageSub">
          <span class="topbar__crumb-sep">›</span>
          <span class="topbar__crumb-sub">{{ pageSub }}</span>
        </template>
      </div>
    </div>

    <!-- Right: chips -->
    <div class="topbar__right">
      <div class="topbar__time">{{ currentTime }}</div>

      <div class="topbar__role">
        <span class="topbar__role-dot"></span>
        {{ auth.role || 'ئەدمین' }}
      </div>

      <RouterLink class="topbar__site" to="/">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
          <polyline points="15 3 21 3 21 9"/>
          <line x1="10" y1="14" x2="21" y2="3"/>
        </svg>
        ماڵپەر
      </RouterLink>
    </div>
  </header>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'

const route = useRoute()
const auth  = useAuthStore()

const map = {
  projects:'پڕۆژەکان', news:'هەواڵ', films:'فیلم',
  'image-collections':'کۆمەڵە وێنە', soundtracks:'دەنگ',
  albums:'ئالبوم', writings:'نووسراوەکان',
}

const pageTitle = computed(() => {
  if (route.name === 'AdminHome') return 'داشبۆرد'
  const r = route.params.resource
  return r ? (map[r] || String(r)) : 'بەڕێوەبردن'
})

const pageSub = computed(() => {
  if (route.name === 'AdminResourceCreate') return 'زیادکردنی نوێ'
  if (route.name === 'AdminResourceEdit')   return 'دەستکاری'
  if (route.name === 'AdminResourceList')   return 'لیست'
  return ''
})

// Live clock
const currentTime = ref('')
let timer = null
const fmt = () => {
  const d = new Date()
  const h = String(d.getHours()).padStart(2,'0')
  const m = String(d.getMinutes()).padStart(2,'0')
  currentTime.value = `${h}:${m}`
}
onMounted(() => { fmt(); timer = setInterval(fmt, 60_000) })
onUnmounted(() => clearInterval(timer))
</script>

<style scoped>
.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: .85rem 1.5rem;
  background: var(--white);
  border-bottom: 1px solid var(--border);
  gap: 1rem;
  position: sticky;
  top: 0;
  z-index: 5;
  box-shadow: var(--shadow-sm);
}

/* Breadcrumb */
.topbar__left { min-width: 0; }
.topbar__crumb {
  display: flex;
  align-items: center;
  gap: .45rem;
  flex-wrap: wrap;
}
.topbar__crumb-home {
  display: flex;
  align-items: center;
  color: var(--muted);
  text-decoration: none;
  transition: color var(--transition);
  padding: .2rem;
  border-radius: 6px;
}
.topbar__crumb-home:hover { color: var(--crimson); }
.topbar__crumb-sep { color: var(--border); font-weight: 400; }
.topbar__crumb-page {
  font-weight: 700;
  color: var(--text);
  font-size: .95rem;
}
.topbar__crumb-sub {
  font-weight: 600;
  color: var(--muted);
  font-size: .87rem;
}

/* Right */
.topbar__right {
  display: flex;
  align-items: center;
  gap: .65rem;
  flex: 0 0 auto;
}
.topbar__time {
  font-variant-numeric: tabular-nums;
  font-size: .8rem;
  color: var(--muted);
  padding: .3rem .6rem;
  border-radius: 8px;
  background: var(--cream-dk);
  border: 1px solid var(--border);
  font-weight: 600;
  letter-spacing: .04em;
}
.topbar__role {
  display: flex;
  align-items: center;
  gap: .45rem;
  padding: .38rem .8rem;
  border-radius: 99px;
  background: rgba(140,21,21,.06);
  border: 1px solid rgba(140,21,21,.14);
  font-weight: 700;
  font-size: .82rem;
  color: var(--crimson);
  white-space: nowrap;
}
.topbar__role-dot {
  width: 7px; height: 7px;
  border-radius: 50%;
  background: var(--gold);
  box-shadow: 0 0 0 3px rgba(254,221,0,.22);
  flex: 0 0 7px;
}
.topbar__site {
  display: flex;
  align-items: center;
  gap: .4rem;
  text-decoration: none;
  font-weight: 700;
  font-size: .82rem;
  color: var(--text);
  padding: .38rem .8rem;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: var(--cream);
  transition: var(--transition);
  white-space: nowrap;
}
.topbar__site:hover { border-color: var(--crimson); color: var(--crimson); }
</style>