<template>
  <div class="rlist" dir="rtl">
    <div v-if="isRedirecting" class="loading-card">
      <div class="spinner"></div>
      <div class="loading-text">پەڕەی ڕاست دەکرێتەوە...</div>
    </div>

    <template v-else>
      <div class="rlist__head">
        <div>
          <h1 class="rlist__title">لیستی {{ resourceLabel }}</h1>
          <p class="rlist__sub">
            ئەم بەشە هێشتا پەڕەی تایبەتی نییە. کاتێک پەڕەی تایبەتی دروست بکرێت، لێرە نیشان نادرێت.
          </p>
        </div>
        <RouterLink class="btn btn--primary" :to="`/admin/${resource}/new`">
          <span>+</span>
          زیادکردنی نوێ
        </RouterLink>
      </div>

      <div class="toolbar">
        <div class="toolbar__filter" aria-hidden="true">
          <span>هەموو دۆخەکان</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="toolbar__search" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2"/>
            <path d="M20 20l-3.5-3.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <input type="text" disabled :placeholder="`گەڕان بە ناونیشان / تاگ / کلیلەوشە...`" />
        </div>
      </div>

      <div class="panel">
        <div class="empty">
          <div class="empty__icon">
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="1.8"/>
              <path d="M8 7h8M8 12h8M8 17h5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
            </svg>
          </div>
          <div class="empty__title">هیچ زانیارییەک نەدۆزرایەوە</div>
          <div class="empty__sub">
            بۆ {{ resourceLabel }} هێشتا پەڕەی تایبەتی دروست نەکراوە یان هێشتا داتا نییە.
          </div>
          <div class="empty__actions">
            <RouterLink class="btn btn--primary" :to="`/admin/${resource}/new`">
              یەکەم دانە زیاد بکە
            </RouterLink>
            <RouterLink class="btn btn--ghost" to="/admin">
              گەڕانەوە بۆ داشبۆرد
            </RouterLink>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const isRedirecting = ref(false)
const resource = computed(() => String(route.params.resource || ''))

const labelMap = {
  projects:            'پڕۆژەکان',
  news:                'هەواڵەکان',
  videos:              'ڤیدیۆکان',
  'image-collections': 'کۆمەڵە وێنەکان',
  soundtracks:         'دەنگەکان',
  writings:            'نووسراوەکان',
}

const resourceLabel = computed(() => labelMap[resource.value] || resource.value || 'بەش')

// All dedicated list route names (no albums)
const customListRouteNames = {
  projects:            'AdminProjectList',
  news:                'AdminNewsList',
  videos:              'AdminVideoList',
  'image-collections': 'AdminImageCollectionList',
  soundtracks:         'AdminSoundTrackList',
  writings:            'AdminWritingList',
}

watch(
  () => [route.name, resource.value],
  async () => {
    const targetName = customListRouteNames[resource.value]
    if (route.name === 'AdminResourceList' && targetName) {
      isRedirecting.value = true
      try {
        await router.replace({ name: targetName })
      } finally {
        isRedirecting.value = false
      }
    } else {
      isRedirecting.value = false
    }
  },
  { immediate: true }
)
</script>

<style scoped>
.rlist {
  direction: rtl;
  max-width: 1200px;
  margin: 0 auto;
}
.rlist__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
}
.rlist__title {
  margin: 0 0 .35rem;
  font-size: clamp(1.2rem, 2vw, 2rem);
  font-weight: 900;
  color: var(--text, #2E2D29);
}
.rlist__sub {
  margin: 0;
  color: var(--muted, #767571);
  font-weight: 600;
  line-height: 1.6;
}
.toolbar {
  display: grid;
  grid-template-columns: 160px 1fr;
  gap: .75rem;
  margin-bottom: 1rem;
}
@media (max-width: 700px) { .toolbar { grid-template-columns: 1fr; } }
.toolbar__filter,
.toolbar__search {
  height: 48px;
  border: 1px solid var(--border, #E0DFDC);
  background: var(--white, #fff);
  border-radius: 12px;
  display: flex;
  align-items: center;
  color: var(--muted, #767571);
}
.toolbar__filter { justify-content: space-between; padding: 0 .9rem; font-weight: 700; }
.toolbar__search { padding: 0 .8rem; gap: .55rem; }
.toolbar__search input {
  border: none; outline: none; width: 100%;
  background: transparent; color: inherit; font: inherit;
}
.panel {
  background: var(--white, #fff);
  border: 1px solid var(--border, #E0DFDC);
  border-radius: 18px;
  min-height: 280px;
  box-shadow: var(--shadow-sm, 0 8px 24px rgba(0,0,0,.04));
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}
.empty { text-align: center; max-width: 560px; }
.empty__icon {
  width: 72px; height: 72px;
  border-radius: 50%;
  margin: 0 auto .9rem;
  border: 1px solid #E0DFDC;
  background: #FAFAF9;
  color: #7E7A73;
  display: flex; align-items: center; justify-content: center;
}
.empty__title { font-weight: 900; color: var(--text, #2E2D29); margin-bottom: .35rem; }
.empty__sub { color: var(--muted, #767571); line-height: 1.7; margin-bottom: 1rem; }
.empty__actions { display: flex; gap: .6rem; justify-content: center; flex-wrap: wrap; }
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: .4rem;
  text-decoration: none;
  border-radius: 12px;
  padding: .75rem 1rem;
  font-weight: 900;
  border: 1px solid transparent;
  transition: .18s ease;
  white-space: nowrap;
}
.btn:hover { transform: translateY(-1px); }
.btn--primary { background: #8C1515; color: #fff; box-shadow: 0 10px 24px rgba(140,21,21,.18); }
.btn--ghost { background: #fff; color: #6E6B66; border-color: #E0DFDC; }
.loading-card {
  min-height: 180px;
  background: var(--white, #fff);
  border: 1px solid var(--border, #E0DFDC);
  border-radius: 18px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: .8rem;
}
.spinner {
  width: 26px; height: 26px; border-radius: 50%;
  border: 3px solid #E8E5E1;
  border-top-color: #8C1515;
  animation: spin .8s linear infinite;
}
.loading-text { color: var(--muted, #767571); font-weight: 700; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>