<template>
  <header class="top">
    <div class="left">
      <div class="title">{{ pageTitle }}</div>
      <div class="crumb">{{ pageSub }}</div>
    </div>

    <div class="right">
      <div class="chip">
        <span class="dot"></span>
        <span>{{ auth.role || '—' }}</span>
      </div>
      <RouterLink class="home" to="/">ماڵپەر</RouterLink>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'

const route = useRoute()
const auth = useAuthStore()

const map = {
  projects: 'پڕۆژەکان',
  news: 'هەواڵ',
  films: 'فیلم',
  'image-collections': 'کۆمەڵە وێنە',
  soundtracks: 'دەنگ',
  albums: 'ئالبوم',
  writings: 'نووسراوەکان',
}

const pageTitle = computed(() => {
  if (route.name === 'AdminHome') return 'داشبۆرد'
  const r = route.params.resource
  if (r) return map[r] || String(r)
  return 'بەڕێوەبردن'
})

const pageSub = computed(() => {
  if (route.name === 'AdminResourceCreate') return 'زیادکردنی نوێ'
  if (route.name === 'AdminResourceEdit') return 'دەستکاری'
  if (route.name === 'AdminResourceList') return 'لیست'
  return 'سەرەکی'
})
</script>

<style scoped>
.top{direction:rtl;display:flex;align-items:center;justify-content:space-between;padding:1rem 1.25rem;background:#fff;
  border-bottom:1px solid #E0DFDC;border-radius:16px;box-shadow:0 10px 34px rgba(0,0,0,.06)}
.title{font-weight:1000;font-size:1.1rem;color:#2E2D29}
.crumb{color:#767571;font-weight:800;font-size:.85rem}
.right{display:flex;align-items:center;gap:.75rem}
.chip{display:flex;align-items:center;gap:.5rem;padding:.5rem .75rem;border-radius:999px;background:rgba(140,21,21,.06);
  border:1px solid rgba(140,21,21,.12);font-weight:1000;color:#8C1515}
.dot{width:8px;height:8px;border-radius:50%;background:#FEDD00;box-shadow:0 0 0 3px rgba(254,221,0,.18)}
.home{text-decoration:none;font-weight:1000;color:#2E2D29;padding:.55rem .85rem;border-radius:12px;border:1px solid #E0DFDC;background:#FAFAF9;transition:.18s ease}
.home:hover{transform:translateY(-1px);border-color:#8C1515}
</style>
