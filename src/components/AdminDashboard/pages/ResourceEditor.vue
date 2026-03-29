<template>
  <div class="reditor" dir="rtl">
    <div v-if="isRedirecting" class="loading-card">
      <div class="spinner"></div>
      <div class="loading-text">پەڕەی دەستکاریی ڕاست دەکرێتەوە...</div>
    </div>

    <template v-else>
      <div class="reditor__head">
        <div>
          <h1 class="reditor__title">
            {{ isEdit ? 'دەستکاری' : 'زیادکردنی نوێ' }} <span class="accent">{{ resourceLabel }}</span>
          </h1>
          <p class="reditor__sub">
            ئەم فۆڕمە یارمەتییە. بۆ بەشە تایبەتییەکان دەبێت پەڕەی تایبەتی هەبێت.
          </p>
        </div>
        <RouterLink class="btn btn--ghost" :to="`/admin/${resource}`">
          گەڕانەوە
        </RouterLink>
      </div>

      <div class="card">
        <div class="field">
          <label>ناونیشان</label>
          <input v-model.trim="title" placeholder="ناونیشان بنووسە" />
        </div>
        <div class="field">
          <label>کورتە</label>
          <textarea v-model.trim="desc" placeholder="کورتەیەک بنووسە"></textarea>
        </div>
        <div class="actions">
          <button class="btn btn--primary" type="button" @click="saveDummy">
            {{ isEdit ? 'پاشەکەوتکردنی گۆڕانکاری' : 'دروستکردن' }}
          </button>
          <RouterLink class="btn btn--ghost" :to="`/admin/${resource}`">
            پاشگەزبوونەوە
          </RouterLink>
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
const isEdit = computed(() => Boolean(route.params.id))
const title = ref('')
const desc  = ref('')

const labelMap = {
  projects:            'پڕۆژەکان',
  news:                'هەواڵەکان',
  videos:              'ڤیدیۆکان',
  'image-collections': 'کۆمەڵە وێنەکان',
  soundtracks:         'دەنگەکان',
  writings:            'نووسراوەکان',
  about:               'دەربارەکان',
  contact:             'پەیوەندیەکان',
}

const resourceLabel = computed(() => labelMap[resource.value] || resource.value || 'بەش')

// All dedicated editor route names
const customEditorRouteNames = {
  projects:            { create: 'AdminProjectCreate',         edit: 'AdminProjectEdit' },
  news:                { create: 'AdminNewsCreate',            edit: 'AdminNewsEdit' },
  videos:              { create: 'AdminVideoCreate',           edit: 'AdminVideoEdit' },
  'image-collections': { create: 'AdminImageCollectionCreate', edit: 'AdminImageCollectionEdit' },
  soundtracks:         { create: 'AdminSoundTrackCreate',      edit: 'AdminSoundTrackEdit' },
  writings:            { create: 'AdminWritingCreate',         edit: 'AdminWritingEdit' },
  about:               { create: 'AdminAboutCreate',           edit: 'AdminAboutEdit' },
  contact:             { create: 'AdminContactCreate',         edit: 'AdminContactEdit' },
}

watch(
  () => [route.name, resource.value, route.params.id],
  async () => {
    const map = customEditorRouteNames[resource.value]
    const targetName = map ? (isEdit.value ? map.edit : map.create) : null
    const isGenericEditorRoute = route.name === 'AdminResourceCreate' || route.name === 'AdminResourceEdit'

    if (isGenericEditorRoute && targetName) {
      isRedirecting.value = true
      try {
        await router.replace({
          name: targetName,
          params: isEdit.value ? { id: route.params.id } : {},
        })
      } finally {
        isRedirecting.value = false
      }
    } else {
      isRedirecting.value = false
    }
  },
  { immediate: true }
)

function saveDummy() {
  window.alert('ئەمە فۆڕمی یارمەتییە. پاشەکەوتکردنە ڕاستەقینەکە لە پەڕەی تایبەتی ئەنجام دەدرێت.')
}
</script>

<style scoped>
.reditor { direction: rtl; max-width: 900px; margin: 0 auto; }
.reditor__head {
  display: flex; align-items: flex-start;
  justify-content: space-between; gap: 1rem; margin-bottom: 1rem;
}
.reditor__title {
  margin: 0 0 .35rem;
  font-size: clamp(1.1rem, 2vw, 1.6rem);
  font-weight: 900;
  color: var(--text, #2E2D29);
}
.accent { color: #8C1515; }
.reditor__sub { margin: 0; color: var(--muted, #767571); font-weight: 600; line-height: 1.6; }
.card {
  background: var(--white, #fff);
  border: 1px solid var(--border, #E0DFDC);
  border-radius: 18px;
  padding: 1rem;
  box-shadow: var(--shadow-sm, 0 10px 30px rgba(0,0,0,.05));
}
.field { display: flex; flex-direction: column; gap: .45rem; margin-bottom: 1rem; }
.field label { font-weight: 800; color: var(--text, #2E2D29); }
.field input,
.field textarea {
  width: 100%;
  border: 1.4px solid var(--border, #E0DFDC);
  border-radius: 14px;
  padding: .9rem 1rem;
  background: #FAFAF9;
  outline: none;
  font: inherit;
  transition: .18s ease;
}
.field textarea { min-height: 140px; resize: vertical; }
.field input:focus,
.field textarea:focus {
  background: #fff;
  border-color: #8C1515;
  box-shadow: 0 0 0 3px rgba(140,21,21,.10);
}
.actions { display: flex; gap: .7rem; flex-wrap: wrap; margin-top: .25rem; }
.btn {
  display: inline-flex; align-items: center; justify-content: center;
  text-decoration: none; border: none; border-radius: 12px;
  padding: .8rem 1rem; font-weight: 900; cursor: pointer; transition: .18s ease;
}
.btn:hover { transform: translateY(-1px); }
.btn--primary { background: #8C1515; color: #fff; box-shadow: 0 10px 24px rgba(140,21,21,.18); }
.btn--ghost { background: #fff; color: #6E6B66; border: 1px solid #E0DFDC; }
.loading-card {
  min-height: 180px; background: var(--white, #fff);
  border: 1px solid var(--border, #E0DFDC); border-radius: 18px;
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: .8rem;
}
.spinner {
  width: 26px; height: 26px; border-radius: 50%;
  border: 3px solid #E8E5E1; border-top-color: #8C1515;
  animation: spin .8s linear infinite;
}
.loading-text { color: var(--muted, #767571); font-weight: 700; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>