<template>
  <div class="ped" dir="rtl">

    <!-- Header -->
    <div class="ped__head">
      <RouterLink :to="`/admin/projects`" class="ped__back">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5M12 5l-7 7 7 7"/>
        </svg>
        گەڕانەوە
      </RouterLink>
      <div>
        <h1 class="ped__title">{{ isEdit ? 'دەستکاری پڕۆژە' : 'پڕۆژەی نوێ' }}</h1>
        <p class="ped__sub" v-if="isEdit">ID: {{ route.params.id }}</p>
      </div>
    </div>

    <!-- Toast -->
    <Transition name="toast">
      <div v-if="toast.show" class="toast" :class="`toast--${toast.type}`">
        <span class="toast__ico">{{ toast.type === 'success' ? '✓' : '✕' }}</span>
        {{ toast.msg }}
      </div>
    </Transition>

    <!-- Loading existing data -->
    <div v-if="fetching" class="loading-bar"></div>

    <form @submit.prevent="submit" novalidate>
      <div class="ped__layout">

        <!-- ==================== MAIN COLUMN ==================== -->
        <div class="col-main">

          <!-- Languages selector -->
          <section class="card">
            <div class="card__hd">
              <span class="card__hd-ico">🌐</span>
              زمانەکانی ناوەڕۆک
            </div>
            <div class="lang-picks">
              <label class="lang-pick" :class="{ 'lang-pick--on': form.contentLanguages.includes('CKB') }">
                <input type="checkbox" value="CKB" v-model="form.contentLanguages" />
                <span class="lang-pick__flag">🟡</span>
                سۆرانی
                <span class="lang-pick__code">سۆرانی</span>
              </label>
              <label class="lang-pick" :class="{ 'lang-pick--on': form.contentLanguages.includes('KMR') }">
                <input type="checkbox" value="KMR" v-model="form.contentLanguages" />
                <span class="lang-pick__flag">🔵</span>
                کورمانجی
                <span class="lang-pick__code">کورمانجی</span>
              </label>
            </div>
            <div v-if="errors.contentLanguages" class="err">{{ errors.contentLanguages }}</div>
          </section>

          <!-- Language tabs for content -->
          <section class="card" v-if="form.contentLanguages.length">
            <div class="tabs">
              <button
                v-for="lang in form.contentLanguages" :key="lang"
                type="button" class="tab"
                :class="{ 'tab--on': activeLang === lang }"
                @click="activeLang = lang"
              >
                <span class="tab__pip" :class="`tab__pip--${lang.toLowerCase()}`"></span>
                {{ lang === 'CKB' ? 'سۆرانی' : 'کورمانجی' }}
              </button>
            </div>

            <!-- CKB -->
            <div v-show="activeLang === 'CKB'" class="tab-panel">
              <div class="field">
                <label class="lbl lbl--req">ناونیشانی سۆرانی</label>
                <input v-model="form.ckbContent.title" class="inp" :class="{ 'inp--err': errors.ckbTitle }" placeholder="ناونیشانی پڕۆژە بە سۆرانی…" />
                <div v-if="errors.ckbTitle" class="err">{{ errors.ckbTitle }}</div>
              </div>
              <div class="field">
                <label class="lbl">وەسف</label>
                <textarea v-model="form.ckbContent.description" class="inp ta" placeholder="وەسفی تەواوی پڕۆژە بە سۆرانی…"></textarea>
              </div>
              <div class="field">
                <label class="lbl">شوێن</label>
                <input v-model="form.ckbContent.location" class="inp" placeholder="شوێن یان ناوچە…" />
              </div>
              <div class="field">
                <label class="lbl lbl--req">جۆری پڕۆژە (سۆرانی)</label>
                <input v-model="form.projectTypeCkb" class="inp" :class="{ 'inp--err': errors.projectTypeCkb }" placeholder="وێنەکێشی، دۆکیومینتاری، مووسیقا…" />
                <div v-if="errors.projectTypeCkb" class="err">{{ errors.projectTypeCkb }}</div>
              </div>
              <div class="field">
                <label class="lbl">ناوەڕۆکەکان (سۆرانی)</label>
                <TagInput v-model="form.contentsCkb" placeholder="ناوەڕۆکی نوێ زیاد بکە — ئینتەر پشار بدە" />
              </div>
              <div class="field">
                <label class="lbl">نیشانەکان (سۆرانی)</label>
                <TagInput v-model="form.tagsCkb" placeholder="نیشانەی نوێ زیاد بکە" color="gold" />
              </div>
              <div class="field">
                <label class="lbl">کلیلەوشەکان (سۆرانی)</label>
                <TagInput v-model="form.keywordsCkb" placeholder="کلیلەوشەی نوێ" color="blue" />
              </div>
            </div>

            <!-- KMR -->
            <div v-show="activeLang === 'KMR'" class="tab-panel">
              <div class="field">
                <label class="lbl lbl--req">ناونیشانی کورمانجی</label>
                <input v-model="form.kmrContent.title" class="inp" :class="{ 'inp--err': errors.kmrTitle }" placeholder="ناونیشانی پڕۆژە بە کورمانجی…" />
                <div v-if="errors.kmrTitle" class="err">{{ errors.kmrTitle }}</div>
              </div>
              <div class="field">
                <label class="lbl">وەسف</label>
                <textarea v-model="form.kmrContent.description" class="inp ta" placeholder="وەسفی تەواوی پڕۆژە بە کورمانجی…"></textarea>
              </div>
              <div class="field">
                <label class="lbl">شوێن</label>
                <input v-model="form.kmrContent.location" class="inp" placeholder="شوێن یان ناوچە…" />
              </div>
              <div class="field">
                <label class="lbl lbl--req">جۆری پڕۆژە (کورمانجی)</label>
                <input v-model="form.projectTypeKmr" class="inp" :class="{ 'inp--err': errors.projectTypeKmr }" placeholder="وێنەکێشی، دۆکیومینتاری، مووسیقا…" />
                <div v-if="errors.projectTypeKmr" class="err">{{ errors.projectTypeKmr }}</div>
              </div>
              <div class="field">
                <label class="lbl">ناوەڕۆکەکان (کورمانجی)</label>
                <TagInput v-model="form.contentsKmr" placeholder="ناوەڕۆکی نوێ زیاد بکە" />
              </div>
              <div class="field">
                <label class="lbl">نیشانەکان (کورمانجی)</label>
                <TagInput v-model="form.tagsKmr" placeholder="نیشانەی نوێ زیاد بکە" color="gold" />
              </div>
              <div class="field">
                <label class="lbl">کلیلەوشەکان (کورمانجی)</label>
                <TagInput v-model="form.keywordsKmr" placeholder="کلیلەوشەی نوێ" color="blue" />
              </div>
            </div>
          </section>

          <!-- Media section -->
          <section class="card">
            <div class="card__hd">
              <span class="card__hd-ico">🖼️</span>
              میدیاکان
              <span class="card__hd-badge">{{ form.media.length }}</span>
            </div>

            <div class="media-list" v-if="form.media.length">
              <div class="media-item" v-for="(m, idx) in form.media" :key="idx">
                <div class="media-item__top">
                  <select v-model="m.mediaType" class="sel sel--sm">
                    <option value="IMAGE">وێنە</option>
                    <option value="VIDEO">ڤیدیۆ</option>
                    <option value="AUDIO">دەنگ</option>
                    <option value="PDF">PDF</option>
                    <option value="DOCUMENT">بەلگەنامە</option>
                  </select>
                  <input v-model.number="m.sortOrder" type="number" class="inp inp--sm" placeholder="#" style="width:70px;" />
                  <button type="button" class="media-item__del" @click="removeMedia(idx)">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </div>
                <div class="media-item__fields">
                  <input v-model="m.url" class="inp inp--sm" placeholder="لینکی فایل (URL)" />
                  <input v-model="m.externalUrl" class="inp inp--sm" placeholder="لینکی دەرەکی" />
                  <input v-model="m.embedUrl" class="inp inp--sm" placeholder="لینکی Embed" />
                  <input v-model="m.caption" class="inp inp--sm" placeholder="ناونیشانی وێنە / وەسف" />
                </div>
              </div>
            </div>

            <div class="upload-zone" @dragover.prevent="dragOver = true" @dragleave="dragOver = false" @drop.prevent="onDrop" :class="{ 'upload-zone--over': dragOver }">
              <label class="upload-zone__inner">
                <input type="file" multiple accept="image/*,video/*,audio/*,.pdf,.doc,.docx" @change="onMediaFiles" style="display:none;" />
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                <span>فایلەکان بکێشە یان کلیک بکە بۆ هەڵبژاردن</span>
                <span class="upload-zone__hint">وێنە، ڤیدیۆ، دەنگ، PDF پشتگیریکراوە</span>
              </label>
            </div>

            <div class="file-list" v-if="newMediaFiles.length">
              <div class="file-chip" v-for="(f, i) in newMediaFiles" :key="i">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>
                {{ f.name }}
                <button type="button" @click="removeNewFile(i)">✕</button>
              </div>
            </div>

            <button type="button" class="btn btn--outline btn--sm" @click="addMediaItem">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              لینکی میدیا زیاد بکە
            </button>
          </section>

        </div>

        <!-- ==================== SIDE COLUMN ==================== -->
        <aside class="col-side">

          <!-- Cover image -->
          <section class="card">
            <div class="card__hd"><span class="card__hd-ico">🖼</span> وێنەی ڕووکار</div>

            <div class="cover-preview" v-if="coverPreview || form.coverUrl">
              <img :src="coverPreview || form.coverUrl" alt="Cover preview" />
              <button type="button" class="cover-preview__remove" @click="removeCover">✕</button>
            </div>

            <label class="upload-zone upload-zone--sm" v-else>
              <input type="file" accept="image/*" @change="onCoverFile" style="display:none;" />
              <div class="upload-zone__inner">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                <span>هەڵبژاردنی وێنەی ڕووکار</span>
              </div>
            </label>

            <div class="field" style="margin-top:.75rem;">
              <label class="lbl">یان URL ی وێنەی ڕووکار بنووسە</label>
              <input v-model="form.coverUrl" class="inp" placeholder="https://…" :disabled="!!coverFile" />
            </div>
            <div v-if="errors.cover" class="err">{{ errors.cover }}</div>
          </section>

          <!-- Project Status -->
          <section class="card">
            <div class="card__hd"><span class="card__hd-ico">📌</span> دۆخی پڕۆژە</div>
            <div class="status-toggle">
              <button type="button" class="status-btn" :class="{ 'status-btn--on status-btn--ongoing': form.status === 'ONGOING' }" @click="form.status = 'ONGOING'">
                <span class="status-btn__dot status-btn__dot--ongoing"></span>
                بەردەوام
              </button>
              <button type="button" class="status-btn" :class="{ 'status-btn--on status-btn--completed': form.status === 'COMPLETED' }" @click="form.status = 'COMPLETED'">
                <span class="status-btn__dot status-btn__dot--completed"></span>
                تەواو
              </button>
            </div>
          </section>

          <!-- Project meta -->
          <section class="card">
            <div class="card__hd"><span class="card__hd-ico">⚙</span> زانیاری گشتی</div>
            <div class="field">
              <label class="lbl">بەرواری پڕۆژە</label>
              <input v-model="form.projectDate" type="date" class="inp" />
            </div>
          </section>

          <!-- Submit -->
          <div class="side-actions">
            <button type="submit" class="btn btn--primary btn--full" :disabled="saving">
              <span v-if="saving" class="spinner"></span>
              {{ saving ? 'پاشەکەوتکردن…' : (isEdit ? 'پاشەکەوتکردنی گۆڕانکاری' : 'دروستکردنی پڕۆژە') }}
            </button>
            <RouterLink to="/admin/projects" class="btn btn--ghost btn--full">هەڵوەشاندنەوە</RouterLink>
          </div>

          <!-- Danger zone -->
          <section v-if="isEdit" class="card card--danger">
            <div class="card__hd card__hd--danger">
              <span class="card__hd-ico">⚠️</span>
              ناوچەی مەترسیدار
            </div>
            <p class="danger-text">
              سڕینەوەی پڕۆژە ناگەڕێتەوە و هەموو داتاکانی دەسڕێتەوە.
            </p>
            <button type="button" class="btn btn--danger btn--full" @click="doDelete">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>
              سڕینەوەی ئەم پڕۆژەیە
            </button>
          </section>

        </aside>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, defineComponent, h } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/api.js'

// ── Inline TagInput component ──────────────────────────────────────────────────
const TagInput = defineComponent({
  name: 'TagInput',
  props: {
    modelValue: { type: Array, default: () => [] },
    placeholder: { type: String, default: 'زیاد بکە…' },
    color: { type: String, default: 'default' },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const inp = ref('')
    const add = () => {
      const v = inp.value.trim()
      if (v && !props.modelValue.includes(v)) emit('update:modelValue', [...props.modelValue, v])
      inp.value = ''
    }
    const rem = (i) => {
      const arr = [...props.modelValue]; arr.splice(i, 1); emit('update:modelValue', arr)
    }
    return () => h('div', { class: 'tag-input' }, [
      h('div', { class: 'tag-input__tags' }, [
        ...props.modelValue.map((t, i) =>
          h('span', { class: `tag-input__tag tag-input__tag--${props.color}`, key: t },
            [t, h('button', { type: 'button', onClick: () => rem(i) }, '✕')]
          )
        ),
        h('input', {
          class: 'tag-input__inp', placeholder: props.placeholder, value: inp.value,
          onInput: (e) => { inp.value = e.target.value },
          onKeydown: (e) => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add() } },
          onBlur: add,
        })
      ])
    ])
  }
})

// ── Setup ─────────────────────────────────────────────────────────────────────
const route  = useRoute()
const router = useRouter()

const isEdit     = computed(() => !!route.params.id)
const activeLang = ref('CKB')
const fetching   = ref(false)
const saving     = ref(false)
const dragOver   = ref(false)
const coverFile  = ref(null)
const coverPreview  = ref('')
const newMediaFiles = ref([])
const toast  = ref({ show: false, type: 'success', msg: '' })
const errors = ref({})

const form = reactive({
  contentLanguages: ['CKB'],
  coverUrl: '',
  projectTypeCkb: '',
  projectTypeKmr: '',
  status: 'ONGOING',
  projectDate: '',
  ckbContent: { title: '', description: '', location: '' },
  kmrContent: { title: '', description: '', location: '' },
  contentsCkb: [], contentsKmr: [],
  tagsCkb: [], tagsKmr: [],
  keywordsCkb: [], keywordsKmr: [],
  media: [],
})

// ── Load existing project ──────────────────────────────────────────────────────
const loadProject = async () => {
  if (!isEdit.value) return
  fetching.value = true
  try {
    const { data } = await api.get(`/api/v1/projects/getAll?page=0&size=200`)
    const all = data.data.content
    const found = all.find(p => String(p.id) === String(route.params.id))
    if (found) applyProject(found)
  } catch (e) {
    showToast('error', 'داتا هێنان سەرنەکەوت: ' + (e?.response?.data?.message || e.message))
  } finally { fetching.value = false }
}

const applyProject = (p) => {
  form.contentLanguages = [...(p.contentLanguages || ['CKB'])]
  activeLang.value = form.contentLanguages[0] || 'CKB'
  form.coverUrl       = p.coverUrl || ''
  form.projectTypeCkb = p.projectTypeCkb || ''
  form.projectTypeKmr = p.projectTypeKmr || ''
  form.status         = p.status || 'ONGOING'
  form.projectDate    = p.projectDate || ''
  if (p.ckbContent) Object.assign(form.ckbContent, p.ckbContent)
  if (p.kmrContent) Object.assign(form.kmrContent, p.kmrContent)
  form.contentsCkb = [...(p.contentsCkb || [])]; form.contentsKmr = [...(p.contentsKmr || [])]
  form.tagsCkb     = [...(p.tagsCkb || [])];     form.tagsKmr     = [...(p.tagsKmr || [])]
  form.keywordsCkb = [...(p.keywordsCkb || [])];  form.keywordsKmr = [...(p.keywordsKmr || [])]
  form.media = (p.media || []).map(m => ({
    mediaType: m.mediaType || 'IMAGE', url: m.url || '', externalUrl: m.externalUrl || '',
    embedUrl: m.embedUrl || '', caption: m.caption || '', sortOrder: m.sortOrder ?? 0,
  }))
}

// ── Cover ────────────────────────────────────────────────────────────────────
const onCoverFile = (e) => { const f = e.target.files?.[0]; if (!f) return; coverFile.value = f; coverPreview.value = URL.createObjectURL(f); form.coverUrl = '' }
const removeCover = () => { coverFile.value = null; coverPreview.value = ''; form.coverUrl = '' }

// ── Media files ───────────────────────────────────────────────────────────────
const onMediaFiles  = (e) => { newMediaFiles.value.push(...Array.from(e.target.files)) }
const onDrop        = (e) => { dragOver.value = false; newMediaFiles.value.push(...Array.from(e.dataTransfer.files)) }
const removeNewFile = (i) => { newMediaFiles.value.splice(i, 1) }
const addMediaItem  = () => { form.media.push({ mediaType: 'IMAGE', url: '', externalUrl: '', embedUrl: '', caption: '', sortOrder: form.media.length }) }
const removeMedia   = (i) => { form.media.splice(i, 1) }

// ── Validation ────────────────────────────────────────────────────────────────
const validate = () => {
  const e = {}
  if (!form.contentLanguages.length) e.contentLanguages = 'کەمی یەک زمانیکی هەڵبژێرە'
  if (form.contentLanguages.includes('CKB')) {
    if (!form.ckbContent.title.trim())  e.ckbTitle       = 'ناونیشانی سۆرانی پێویستە'
    if (!form.projectTypeCkb.trim())    e.projectTypeCkb = 'جۆری پڕۆژە (سۆرانی) پێویستە'
  }
  if (form.contentLanguages.includes('KMR')) {
    if (!form.kmrContent.title.trim())  e.kmrTitle       = 'ناونیشانی کورمانجی پێویستە'
    if (!form.projectTypeKmr.trim())    e.projectTypeKmr = 'جۆری پڕۆژە (کورمانجی) پێویستە'
  }
  if (!coverFile.value && !form.coverUrl.trim()) e.cover = 'وێنەی ڕووکار پێویستە — فایل بار بکە یان URL بنووسە'
  errors.value = e
  return !Object.keys(e).length
}

// ── Submit ────────────────────────────────────────────────────────────────────
const submit = async () => {
  if (!validate()) { window.scrollTo({ top: 0, behavior: 'smooth' }); return }
  saving.value = true
  const fd = new FormData()
  const dto = {
    contentLanguages: form.contentLanguages,
    coverUrl: form.coverUrl || null,
    projectTypeCkb: form.contentLanguages.includes('CKB') ? form.projectTypeCkb : null,
    projectTypeKmr: form.contentLanguages.includes('KMR') ? form.projectTypeKmr : null,
    status: form.status,
    projectDate: form.projectDate || null,
    ckbContent: form.contentLanguages.includes('CKB') ? form.ckbContent : null,
    kmrContent: form.contentLanguages.includes('KMR') ? form.kmrContent : null,
    contentsCkb: form.contentsCkb, contentsKmr: form.contentsKmr,
    tagsCkb: form.tagsCkb, tagsKmr: form.tagsKmr,
    keywordsCkb: form.keywordsCkb, keywordsKmr: form.keywordsKmr,
    media: form.media.filter(m => m.url || m.externalUrl || m.embedUrl),
  }
  fd.append('data', new Blob([JSON.stringify(dto)], { type: 'application/json' }))
  if (coverFile.value) fd.append('cover', coverFile.value)
  newMediaFiles.value.forEach(f => fd.append('media', f))
  try {
    let url, method
    if (isEdit.value) { url = `/api/v1/projects/update/${route.params.id}/with-files`; method = 'put' }
    else { url = `/api/v1/projects/with-files`; method = 'post' }
    await api[method](url, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
    showToast('success', isEdit.value ? 'پڕۆژەکە نوێکرایەوە ✓' : 'پڕۆژەکە دروستکرا ✓')
    setTimeout(() => router.push('/admin/projects'), 1200)
  } catch (e) {
    showToast('error', e?.response?.data?.message || e.message || 'هەڵەیەک ڕوویدا')
  } finally { saving.value = false }
}

const doDelete = async () => {
  if (!confirm(`دڵنیای لە سڕینەوەی پڕۆژە #${route.params.id}؟`)) return
  try {
    await api.delete(`/api/v1/projects/delete/${route.params.id}`)
    showToast('success', 'پڕۆژەکە سڕایەوە')
    setTimeout(() => router.push('/admin/projects'), 800)
  } catch (e) { showToast('error', e?.response?.data?.message || 'سڕینەوە سەرنەکەوت') }
}

const showToast = (type, msg) => {
  toast.value = { show: true, type, msg }
  setTimeout(() => { toast.value.show = false }, 4000)
}

onMounted(loadProject)
</script>

<style scoped>
.ped { direction: rtl; max-width: 1280px; margin: 0 auto; }
.ped__head { display: flex; align-items: center; gap: 1.25rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
.ped__back { display: inline-flex; align-items: center; gap: .4rem; color: var(--muted); text-decoration: none; font-weight: 600; font-size: .87rem; padding: .4rem .7rem; border-radius: 8px; border: 1px solid var(--border); background: var(--white); transition: var(--transition); }
.ped__back:hover { color: var(--crimson); border-color: var(--crimson); }
.ped__title { font-size: 1.4rem; font-weight: 700; color: var(--text); }
.ped__sub { font-size: .8rem; color: var(--muted); margin-top: .1rem; }
.toast { display: flex; align-items: center; gap: .65rem; padding: .8rem 1.1rem; border-radius: var(--radius-sm); font-weight: 600; font-size: .88rem; margin-bottom: 1rem; }
.toast__ico { font-size: 1rem; }
.toast--success { background: rgba(25,130,80,.1); border: 1px solid rgba(25,130,80,.25); color: #186048; }
.toast--error { background: rgba(180,40,40,.08); border: 1px solid rgba(180,40,40,.2); color: var(--crimson); }
.toast-enter-active, .toast-leave-active { transition: .3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(-6px); }
.loading-bar { height: 3px; border-radius: 2px; margin-bottom: .75rem; background: linear-gradient(90deg, var(--crimson), var(--gold), var(--crimson)); background-size: 200% 100%; animation: shimmer 1.2s linear infinite; }
@keyframes shimmer { 0% { background-position: 200% 0 } 100% { background-position: -200% 0 } }
.ped__layout { display: grid; grid-template-columns: 1fr 320px; gap: 1.25rem; align-items: start; }
@media (max-width: 900px) { .ped__layout { grid-template-columns: 1fr; } }
.card { background: var(--white); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 1.35rem; box-shadow: var(--shadow-sm); margin-bottom: 1.25rem; }
.card--danger { border-color: rgba(140,21,21,.18); }
.card__hd { display: flex; align-items: center; gap: .6rem; font-weight: 700; font-size: .95rem; color: var(--text); margin-bottom: 1.1rem; padding-bottom: .75rem; border-bottom: 1px solid var(--cream-dk); }
.card__hd--danger { color: var(--crimson); border-bottom-color: rgba(140,21,21,.1); }
.card__hd-ico { font-size: 1rem; }
.card__hd-badge { margin-right: auto; background: var(--cream-dk); border: 1px solid var(--border); border-radius: 99px; padding: .1rem .6rem; font-size: .78rem; color: var(--muted); }
.danger-text { font-size: .84rem; color: var(--muted); margin-bottom: .85rem; line-height: 1.65; }
.lang-picks { display: flex; gap: .75rem; flex-wrap: wrap; }
.lang-pick { display: inline-flex; align-items: center; gap: .5rem; padding: .65rem 1rem; border-radius: var(--radius-sm); border: 1.5px solid var(--border); cursor: pointer; transition: var(--transition); font-weight: 600; user-select: none; }
.lang-pick input { display: none; }
.lang-pick:hover { border-color: var(--crimson); }
.lang-pick--on { background: rgba(140,21,21,.06); border-color: var(--crimson); color: var(--crimson); }
.lang-pick__code { font-size: .75rem; font-weight: 700; opacity: .6; }
.tabs { display: flex; gap: .4rem; margin-bottom: 1.1rem; border-bottom: 1px solid var(--border); padding-bottom: 0; }
.tab { display: inline-flex; align-items: center; gap: .4rem; padding: .6rem 1rem; border-radius: 8px 8px 0 0; border: 1px solid transparent; border-bottom: none; background: none; color: var(--muted); font-weight: 700; font-size: .88rem; cursor: pointer; transition: var(--transition); margin-bottom: -1px; font-family: inherit; }
.tab--on { background: var(--white); border-color: var(--border); color: var(--crimson); }
.tab__pip { width: 7px; height: 7px; border-radius: 50%; }
.tab__pip--ckb { background: #c8a800; }
.tab__pip--kmr { background: #4a7af0; }
.tab-panel { padding-top: .25rem; }
.field { display: flex; flex-direction: column; gap: .4rem; margin-bottom: .95rem; }
.lbl { font-weight: 700; font-size: .83rem; color: var(--text); }
.lbl--req::after { content: ' *'; color: var(--crimson); }
.inp { border: 1.5px solid var(--border); border-radius: var(--radius-sm); padding: .7rem .9rem; background: var(--cream); color: var(--text); font-size: .9rem; outline: none; transition: var(--transition); width: 100%; font-family: inherit; }
.inp:focus { background: var(--white); border-color: var(--crimson); box-shadow: 0 0 0 3px rgba(140,21,21,.1); }
.inp--err { border-color: #c0392b; }
.inp--sm { padding: .5rem .7rem; font-size: .85rem; }
.ta { min-height: 130px; resize: vertical; }
.err { font-size: .78rem; color: #c0392b; font-weight: 600; }
.status-toggle { display: grid; grid-template-columns: 1fr 1fr; gap: .6rem; }
.status-btn { display: flex; align-items: center; justify-content: center; gap: .55rem; padding: .75rem .9rem; border-radius: var(--radius-sm); border: 1.5px solid var(--border); background: var(--cream); color: var(--muted); font-weight: 700; font-size: .88rem; cursor: pointer; transition: var(--transition); font-family: inherit; }
.status-btn:hover { border-color: var(--crimson); color: var(--text); }
.status-btn__dot { width: 9px; height: 9px; border-radius: 50%; flex-shrink: 0; }
.status-btn__dot--ongoing { background: #f39c12; box-shadow: 0 0 6px rgba(243,156,18,.6); }
.status-btn__dot--completed { background: #27ae60; box-shadow: 0 0 6px rgba(39,174,96,.6); }
.status-btn--on.status-btn--ongoing { background: rgba(243,156,18,.08); border-color: #f39c12; color: #b37a00; box-shadow: 0 0 0 3px rgba(243,156,18,.12); }
.status-btn--on.status-btn--completed { background: rgba(39,174,96,.08); border-color: #27ae60; color: #186040; box-shadow: 0 0 0 3px rgba(39,174,96,.12); }
.cover-preview { position: relative; border-radius: var(--radius-sm); overflow: hidden; border: 1px solid var(--border); margin-bottom: .75rem; }
.cover-preview img { width: 100%; max-height: 200px; object-fit: cover; display: block; }
.cover-preview__remove { position: absolute; top: .5rem; left: .5rem; width: 28px; height: 28px; border-radius: 50%; background: rgba(0,0,0,.55); color: #fff; border: none; cursor: pointer; font-size: .85rem; display: flex; align-items: center; justify-content: center; }
.upload-zone { border: 2px dashed var(--border); border-radius: var(--radius-sm); cursor: pointer; transition: var(--transition); display: block; margin-bottom: .75rem; }
.upload-zone:hover, .upload-zone--over { border-color: var(--crimson); background: rgba(140,21,21,.03); }
.upload-zone--sm .upload-zone__inner { padding: 1.25rem; }
.upload-zone__inner { display: flex; flex-direction: column; align-items: center; gap: .5rem; padding: 1.75rem 1rem; color: var(--muted); font-size: .87rem; text-align: center; cursor: pointer; }
.upload-zone__hint { font-size: .76rem; opacity: .7; }
.media-list { display: flex; flex-direction: column; gap: .75rem; margin-bottom: 1rem; }
.media-item { border: 1px solid var(--border); border-radius: var(--radius-sm); padding: .85rem; background: var(--cream); }
.media-item__top { display: flex; align-items: center; gap: .5rem; margin-bottom: .6rem; }
.media-item__del { margin-right: auto; width: 26px; height: 26px; border-radius: 6px; background: none; border: 1px solid var(--border); color: var(--muted); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: var(--transition); }
.media-item__del:hover { background: rgba(140,21,21,.08); border-color: var(--crimson); color: var(--crimson); }
.media-item__fields { display: grid; grid-template-columns: 1fr 1fr; gap: .5rem; }
@media (max-width: 600px) { .media-item__fields { grid-template-columns: 1fr; } }
.file-list { display: flex; flex-wrap: wrap; gap: .4rem; margin-bottom: .75rem; }
.file-chip { display: inline-flex; align-items: center; gap: .4rem; padding: .3rem .65rem; border-radius: 6px; background: var(--cream-dk); border: 1px solid var(--border); font-size: .78rem; color: var(--muted); }
.file-chip button { background: none; border: none; cursor: pointer; color: var(--muted); font-size: .75rem; }
.file-chip button:hover { color: var(--crimson); }
.sel { padding: .5rem .7rem; border: 1.5px solid var(--border); border-radius: var(--radius-sm); background: var(--white); color: var(--text); font-size: .88rem; outline: none; cursor: pointer; transition: var(--transition); font-family: inherit; }
.sel:focus { border-color: var(--crimson); }
.sel--sm { font-size: .83rem; }
.btn { display: inline-flex; align-items: center; justify-content: center; gap: .45rem; padding: .7rem 1.1rem; border-radius: var(--radius-sm); font-weight: 700; font-size: .88rem; cursor: pointer; border: 1px solid transparent; transition: var(--transition); text-decoration: none; white-space: nowrap; font-family: inherit; }
.btn--primary { background: var(--crimson); color: #fff; box-shadow: 0 6px 20px rgba(140,21,21,.25); }
.btn--primary:hover { background: var(--crimson-lt); transform: translateY(-1px); }
.btn--ghost { background: transparent; border-color: var(--border); color: var(--text); }
.btn--ghost:hover { border-color: var(--crimson); color: var(--crimson); }
.btn--outline { background: transparent; border-color: var(--border); color: var(--muted); }
.btn--outline:hover { border-color: var(--crimson); color: var(--crimson); }
.btn--danger { background: #c0392b; color: #fff; border-color: #c0392b; }
.btn--danger:hover { background: #a93226; }
.btn--sm { padding: .5rem .8rem; font-size: .83rem; }
.btn--full { width: 100%; }
.btn:disabled { opacity: .55; cursor: not-allowed; transform: none !important; }
.side-actions { display: flex; flex-direction: column; gap: .6rem; }
.spinner { width: 14px; height: 14px; border: 2px solid rgba(255,255,255,.4); border-top-color: #fff; border-radius: 50%; animation: spin .7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg) } }
</style>

<!-- Tag Input global styles -->
<style>
.tag-input { display: flex; flex-direction: column; gap: .4rem; }
.tag-input__tags { display: flex; flex-wrap: wrap; gap: .4rem; align-items: center; border: 1.5px solid var(--border); border-radius: var(--radius-sm); padding: .45rem .65rem; background: var(--cream); min-height: 42px; transition: border-color .2s; }
.tag-input__tags:focus-within { border-color: var(--crimson); background: var(--white); box-shadow: 0 0 0 3px rgba(140,21,21,.1); }
.tag-input__tag { display: inline-flex; align-items: center; gap: .3rem; padding: .2rem .55rem; border-radius: 6px; font-size: .8rem; font-weight: 600; }
.tag-input__tag--default { background: var(--cream-dk); border: 1px solid var(--border); color: var(--text); }
.tag-input__tag--gold { background: rgba(254,221,0,.2); border: 1px solid rgba(254,221,0,.4); color: #807000; }
.tag-input__tag--blue { background: rgba(30,80,200,.1); border: 1px solid rgba(30,80,200,.2); color: #1840a0; }
.tag-input__tag button { background: none; border: none; cursor: pointer; color: inherit; opacity: .6; font-size: .75rem; line-height: 1; }
.tag-input__tag button:hover { opacity: 1; }
.tag-input__inp { border: none; outline: none; background: none; font-family: inherit; font-size: .88rem; min-width: 120px; color: var(--text); }
</style>