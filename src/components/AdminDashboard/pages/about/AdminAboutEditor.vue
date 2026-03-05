<template>
  <div class="aed" dir="rtl">

    <!-- Header -->
    <div class="aed__head">
      <RouterLink to="/admin/about" class="aed__back">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5M12 5l-7 7 7 7"/>
        </svg>
        گەڕانەوە
      </RouterLink>
      <div>
        <h1 class="aed__title">{{ isEdit ? 'دەستکاری دەربارە' : 'دەربارەی نوێ' }}</h1>
        <p class="aed__sub" v-if="isEdit">ID: {{ route.params.id }}</p>
      </div>
    </div>

    <!-- Toast -->
    <Transition name="toast">
      <div v-if="toast.show" class="toast" :class="`toast--${toast.type}`">
        <span class="toast__ico">{{ toast.type === 'success' ? '✓' : '✕' }}</span>
        {{ toast.msg }}
      </div>
    </Transition>

    <!-- Loading bar -->
    <div v-if="fetching" class="loading-bar"></div>

    <div v-else class="aed__layout">

      <!-- ==================== MAIN COLUMN ==================== -->
      <div class="col-main">

        <!-- Basic Info -->
        <section class="card">
          <div class="card__hd">
            <span class="card__hd-ico">📄</span>
            زانیاری سەرەکی
          </div>

          <div class="field">
            <label class="lbl lbl--req">سلەگ (Slug)</label>
            <input v-model="form.slug" class="inp" :class="{ 'inp--err': errors.slug }"
              placeholder="main-about" :disabled="isEdit" />
            <div class="field__hint">ئەمە ناتوانرێت بگۆڕدرێت دوای دروستکردن</div>
            <div v-if="errors.slug" class="err">{{ errors.slug }}</div>
          </div>

          <div class="field">
            <label class="lbl lbl--req">ناونیشان</label>
            <input v-model="form.title" class="inp" :class="{ 'inp--err': errors.title }"
              placeholder="دەربارەی ئێمە" />
            <div v-if="errors.title" class="err">{{ errors.title }}</div>
          </div>

          <div class="field">
            <label class="lbl">ژێرناونیشان</label>
            <input v-model="form.subtitle" class="inp" placeholder="وەسفی کورت…" />
          </div>

          <div class="field">
            <label class="lbl">وەسفی میتا (SEO)</label>
            <textarea v-model="form.metaDescription" class="inp ta ta--sm"
              placeholder="وەسفی کورت بۆ سێرچ ئەنجین…"></textarea>
          </div>
        </section>

        <!-- Blocks -->
        <section class="card">
          <div class="card__hd">
            <span class="card__hd-ico">🧱</span>
            بلۆکەکان
            <span class="card__hd-badge" v-if="form.blocks.length">{{ form.blocks.length }}</span>
          </div>

          <div class="blocks-list" v-if="form.blocks.length">
            <div class="block-card" v-for="(block, idx) in form.blocks" :key="block._uid">
              <div class="block-card__header">
                <div class="block-card__left">
                  <span class="block-card__seq">{{ idx + 1 }}</span>
                  <span class="block-card__type-badge" :class="`block-card__type-badge--${block.contentType.toLowerCase()}`">
                    {{ blockTypeLabel(block.contentType) }}
                  </span>
                  <span class="block-card__title-text" v-if="block.title">{{ block.title }}</span>
                </div>
                <div class="block-card__actions">
                  <button type="button" class="block-btn" :disabled="idx === 0" @click="moveBlock(idx, -1)" title="بردنە سەرەوە">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 15l-6-6-6 6"/></svg>
                  </button>
                  <button type="button" class="block-btn" :disabled="idx === form.blocks.length - 1" @click="moveBlock(idx, 1)" title="بردنە خوارەوە">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg>
                  </button>
                  <button type="button" class="block-btn block-btn--toggle" @click="block._open = !block._open">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                      <path v-if="block._open" d="M18 15l-6-6-6 6"/>
                      <path v-else d="M6 9l6 6 6-6"/>
                    </svg>
                  </button>
                  <button type="button" class="block-btn block-btn--del" @click="removeBlock(idx)" title="سڕینەوە">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </div>
              </div>

              <Transition name="block-body">
                <div v-if="block._open" class="block-card__body">

                  <div class="field-row">
                    <div class="field" style="flex:1">
                      <label class="lbl">جۆر</label>
                      <select v-model="block.contentType" class="inp">
                        <option v-for="t in contentTypes" :key="t.value" :value="t.value">{{ t.label }}</option>
                      </select>
                    </div>
                    <div class="field" style="flex:2">
                      <label class="lbl">ناونیشان</label>
                      <input v-model="block.title" class="inp" placeholder="ناونیشانی بلۆک (ئیختیاری)" />
                    </div>
                  </div>

                  <div class="field" v-if="showTextField(block.contentType)">
                    <label class="lbl">{{ block.contentType === 'TEXT' || block.contentType === 'QUOTE' ? 'ناوەڕۆکی دەق' : 'وەسف / کەپشن' }}</label>
                    <textarea v-model="block.contentText" class="inp ta"
                      :rows="block.contentType === 'TEXT' || block.contentType === 'QUOTE' ? 6 : 3"
                      placeholder="دەقی ناوەڕۆک…"></textarea>
                  </div>

                  <div class="field" v-if="showMediaField(block.contentType)">
                    <label class="lbl">لینکی میدیا</label>
                    <div class="media-input-row">
                      <input v-model="block.mediaUrl" class="inp" placeholder="https://… یان فایل باربکە" />
                      <label class="upload-btn">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                        </svg>
                        بارکردن
                        <input type="file" hidden :accept="acceptForType(block.contentType)" @change="e => uploadBlockMedia(e, idx)" />
                      </label>
                    </div>
                    <div v-if="block._uploading" class="upload-progress">
                      <div class="upload-progress__bar"></div>
                      <span>بارکردن…</span>
                    </div>
                  </div>

                  <div class="block-preview-img" v-if="block.contentType === 'IMAGE' && block.mediaUrl">
                    <img :src="block.mediaUrl" loading="lazy" />
                  </div>

                  <div class="field" v-if="showMediaField(block.contentType)">
                    <label class="lbl">دەقی جێگرەوە (Alt Text)</label>
                    <input v-model="block.altText" class="inp" placeholder="وەسفی وێنە بۆ دەستگەیشتن…" />
                  </div>

                  <div v-if="block.contentType === 'STATS'" class="stats-editor">
                    <label class="lbl">ئامارەکان (JSON)</label>
                    <textarea v-model="block._metadataJson" class="inp ta ta--code" rows="4"
                      placeholder='{"items": [{"label": "پڕۆژە", "value": "120"}, …]}'
                      @blur="parseMetadata(block)"></textarea>
                    <div class="field__hint">فۆرماتی JSON — بۆ نموونە: {"items": [{"label": "ناو", "value": "ژمارە"}]}</div>
                  </div>

                </div>
              </Transition>
            </div>
          </div>

          <div v-else class="blocks-empty">
            <div class="blocks-empty__ico">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 7h8M8 12h8M8 17h5"/>
              </svg>
            </div>
            <p>هیچ بلۆکێک نییە — بلۆکی نوێ زیاد بکە</p>
          </div>

          <div class="add-block">
            <span class="add-block__label">بلۆکی نوێ زیاد بکە:</span>
            <div class="add-block__btns">
              <button type="button" v-for="t in contentTypes" :key="t.value"
                class="add-block__btn" :class="`add-block__btn--${t.value.toLowerCase()}`"
                @click="addBlock(t.value)">
                <span class="add-block__btn-ico" v-html="t.icon"></span>
                {{ t.label }}
              </button>
            </div>
          </div>
        </section>

      </div>

      <!-- ==================== SIDEBAR ==================== -->
      <div class="col-side">

        <section class="card card--sticky">
          <div class="card__hd">
            <span class="card__hd-ico">🚀</span>
            بڵاوکردنەوە
          </div>

          <div class="publish-info" v-if="isEdit">
            <div class="publish-info__row">
              <span>ناسنامە:</span>
              <strong>#{{ route.params.id }}</strong>
            </div>
            <div class="publish-info__row" v-if="existingData?.createdAt">
              <span>دروستکراوە:</span>
              <strong>{{ existingData.createdAt }}</strong>
            </div>
          </div>

          <div class="publish-actions">
            <button type="button" class="btn btn--primary btn--full" :disabled="saving" @click="submit">
              <span v-if="saving" class="spinner"></span>
              {{ saving ? 'پاشەکەوتکردن…' : (isEdit ? 'نوێکردنەوە' : 'دروستکردن') }}
            </button>
            <button v-if="isEdit" type="button" class="btn btn--danger btn--full" @click="doDelete">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
              </svg>
              سڕینەوە
            </button>
          </div>
        </section>

        <section class="card" v-if="form.blocks.length">
          <div class="card__hd">
            <span class="card__hd-ico">📊</span>
            پوختەی بلۆکەکان
          </div>
          <div class="block-summary">
            <div class="block-summary__row" v-for="(count, type) in blockCounts" :key="type">
              <span class="block-summary__type" :class="`block-summary__type--${type.toLowerCase()}`">{{ blockTypeLabel(type) }}</span>
              <span class="block-summary__count">{{ count }}</span>
            </div>
          </div>
        </section>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/api.js'

const route  = useRoute()
const router = useRouter()

const isEdit       = computed(() => !!route.params.id)
const fetching     = ref(false)
const saving       = ref(false)
const existingData = ref(null)
const toast        = ref({ show: false, type: 'success', msg: '' })
const errors       = ref({})

let uidCounter = 0
const makeUid = () => ++uidCounter

const form = reactive({
  slug: '',
  title: '',
  subtitle: '',
  metaDescription: '',
  blocks: []
})

const contentTypes = [
  { value: 'TEXT',    label: 'دەق',    icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>' },
  { value: 'IMAGE',   label: 'وێنە',   icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>' },
  { value: 'VIDEO',   label: 'ڤیدیۆ',  icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>' },
  { value: 'AUDIO',   label: 'دەنگ',   icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>' },
  { value: 'GALLERY', label: 'گالەری', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>' },
  { value: 'QUOTE',   label: 'وتە',    icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21z"/></svg>' },
  { value: 'STATS',   label: 'ئامار',  icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>' }
]

const blockTypeLabelMap = {
  TEXT: 'دەق', IMAGE: 'وێنە', VIDEO: 'ڤیدیۆ',
  AUDIO: 'دەنگ', GALLERY: 'گالەری', QUOTE: 'وتە', STATS: 'ئامار'
}
function blockTypeLabel(t) { return blockTypeLabelMap[t] || t }

function showTextField(type) {
  return ['TEXT', 'QUOTE', 'IMAGE', 'VIDEO', 'AUDIO', 'GALLERY', 'STATS'].includes(type)
}
function showMediaField(type) {
  return ['IMAGE', 'VIDEO', 'AUDIO', 'GALLERY'].includes(type)
}
function acceptForType(type) {
  switch (type) {
    case 'IMAGE':   return 'image/*'
    case 'VIDEO':   return 'video/*'
    case 'AUDIO':   return 'audio/*'
    case 'GALLERY': return 'image/*'
    default:        return '*/*'
  }
}

function addBlock(type) {
  form.blocks.push({
    _uid: makeUid(), _open: true, _uploading: false, _metadataJson: '{}',
    contentType: type, title: '', contentText: '', mediaUrl: '', altText: '', metadata: {}
  })
}
function removeBlock(idx) { form.blocks.splice(idx, 1) }
function moveBlock(idx, dir) {
  const target = idx + dir
  if (target < 0 || target >= form.blocks.length) return
  ;[form.blocks[idx], form.blocks[target]] = [form.blocks[target], form.blocks[idx]]
}
function parseMetadata(block) {
  try { block.metadata = JSON.parse(block._metadataJson || '{}') } catch { /* invalid JSON */ }
}

const blockCounts = computed(() => {
  const map = {}
  form.blocks.forEach(b => { map[b.contentType] = (map[b.contentType] || 0) + 1 })
  return map
})

// ── Upload ── (ApiResponse<UploadResponse> → payload at data.data)
async function uploadBlockMedia(event, blockIdx) {
  const file = event.target.files?.[0]
  if (!file) return
  const block = form.blocks[blockIdx]
  block._uploading = true
  try {
    const fd = new FormData()
    fd.append('file', file)
    const { data } = await api.post('/api/v1/about/upload', fd, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    // Backend returns ApiResponse<UploadResponse> → actual payload at data.data
    const payload = data?.data ?? data
    block.mediaUrl = payload?.fileUrl ?? payload?.url ?? ''
    showToast('success', 'فایل بارکرا ✓')
  } catch (e) {
    showToast('error', e?.response?.data?.message || 'بارکردن سەرکەوتوو نەبوو')
  } finally {
    block._uploading = false
    event.target.value = ''
  }
}

// ── Validation ───────────────────────────────────────────────────
function validate() {
  const e = {}
  if (!form.slug.trim())  e.slug  = 'سلەگ پێویستە'
  if (!form.title.trim()) e.title = 'ناونیشان پێویستە'
  errors.value = e
  return !Object.keys(e).length
}

// ── Load (edit mode) ─────────────────────────────────────────────
async function loadAbout() {
  if (!isEdit.value) return
  fetching.value = true
  try {
    const { data } = await api.get('/api/v1/about')
    // ApiResponse<List<AboutResponse>> → payload at data.data
    const list = data?.data ?? data
    const all  = Array.isArray(list) ? list : []
    const found = all.find(a => String(a.id) === String(route.params.id))
    if (!found) throw new Error('نەدۆزرایەوە')

    existingData.value = found
    form.slug            = found.slug            || ''
    form.title           = found.title           || ''
    form.subtitle        = found.subtitle        || ''
    form.metaDescription = found.metaDescription || ''

    form.blocks = (found.blocks || []).map(b => ({
      _uid: makeUid(), _open: false, _uploading: false,
      _metadataJson: b.metadata ? JSON.stringify(b.metadata, null, 2) : '{}',
      contentType: b.contentType || 'TEXT',
      title:       b.title       || '',
      contentText: b.contentText || '',
      mediaUrl:    b.mediaUrl    || '',
      altText:     b.altText     || '',
      metadata:    b.metadata    || {}
    }))
  } catch (e) {
    showToast('error', e?.response?.data?.message || e.message || 'بارکردن سەرکەوتوو نەبوو')
  } finally {
    fetching.value = false
  }
}

// ── Submit ── (JSON endpoints, ApiResponse<AboutResponse> returned)
async function submit() {
  if (!validate()) { window.scrollTo({ top: 0, behavior: 'smooth' }); return }
  saving.value = true

  const dto = {
    slug:            form.slug,
    title:           form.title,
    subtitle:        form.subtitle        || null,
    metaDescription: form.metaDescription || null,
    blocks: form.blocks.map((b, idx) => ({
      contentType: b.contentType,
      sequence:    idx,
      contentText: b.contentText || null,
      mediaUrl:    b.mediaUrl    || null,
      title:       b.title       || null,
      altText:     b.altText     || null,
      metadata:    b.metadata && Object.keys(b.metadata).length ? b.metadata : null
    }))
  }

  try {
    if (isEdit.value) {
      await api.put(`/api/v1/about/${route.params.id}`, dto)
      showToast('success', 'دەربارەکە نوێکرایەوە ✓')
    } else {
      await api.post('/api/v1/about', dto)
      showToast('success', 'دەربارەکە دروستکرا ✓')
    }
    setTimeout(() => router.push('/admin/about'), 1200)
  } catch (e) {
    showToast('error', e?.response?.data?.message || e.message || 'هەڵەیەک ڕوویدا')
  } finally {
    saving.value = false
  }
}

// ── Delete ────────────────────────────────────────────────────────
async function doDelete() {
  if (!confirm(`دڵنیای لە سڕینەوەی دەربارە #${route.params.id}؟`)) return
  try {
    await api.delete(`/api/v1/about/${route.params.id}`)
    showToast('success', 'سڕایەوە ✓')
    setTimeout(() => router.push('/admin/about'), 800)
  } catch (e) {
    showToast('error', e?.response?.data?.message || 'سڕینەوە سەرکەوتوو نەبوو')
  }
}

function showToast(type, msg) {
  toast.value = { show: true, type, msg }
  setTimeout(() => { toast.value.show = false }, 3500)
}

onMounted(loadAbout)
</script>

<style scoped>
.aed { direction: rtl; max-width: 1200px; margin: 0 auto; }
.aed__head { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; }
.aed__back { display: inline-flex; align-items: center; gap: .4rem; text-decoration: none; color: var(--muted, #767571); font-weight: 700; font-size: .9rem; padding: .45rem .7rem; border-radius: 10px; background: var(--white, #fff); border: 1px solid var(--border, #E0DFDC); transition: all .15s; }
.aed__back:hover { border-color: #8C1515; color: #8C1515; }
.aed__title { margin: 0; font-weight: 900; font-size: clamp(1.2rem, 2vw, 1.6rem); color: var(--text, #2E2D29); }
.aed__sub { margin: .15rem 0 0; color: var(--muted, #767571); font-weight: 600; font-size: .85rem; }
.aed__layout { display: grid; grid-template-columns: 1fr 300px; gap: 1.2rem; align-items: start; }
@media (max-width: 900px) { .aed__layout { grid-template-columns: 1fr; } }
.col-main { display: flex; flex-direction: column; gap: 1rem; }
.col-side { display: flex; flex-direction: column; gap: 1rem; }
.card { background: var(--white, #fff); border: 1px solid var(--border, #E0DFDC); border-radius: 16px; padding: 1.25rem; box-shadow: 0 4px 16px rgba(0,0,0,.03); }
.card--sticky { position: sticky; top: 1rem; }
.card__hd { display: flex; align-items: center; gap: .5rem; font-weight: 800; color: var(--text, #2E2D29); margin-bottom: 1rem; font-size: .95rem; padding-bottom: .7rem; border-bottom: 1px solid #f0eeeb; }
.card__hd-ico { font-size: 1.1rem; }
.card__hd-badge { margin-right: auto; background: #8C1515; color: #fff; font-size: .75rem; font-weight: 800; padding: .1rem .45rem; border-radius: 8px; min-width: 22px; text-align: center; }
.field { margin-bottom: .85rem; }
.field-row { display: flex; gap: .75rem; }
@media (max-width: 600px) { .field-row { flex-direction: column; } }
.lbl { display: block; font-weight: 700; color: var(--text, #2E2D29); margin-bottom: .3rem; font-size: .85rem; }
.lbl--req::after { content: ' *'; color: #8C1515; font-weight: 800; }
.inp { width: 100%; padding: .65rem .85rem; border: 1.5px solid var(--border, #E0DFDC); border-radius: 10px; font: inherit; color: var(--text, #2E2D29); background: var(--white, #fff); transition: border-color .2s; box-sizing: border-box; }
.inp:focus { outline: none; border-color: #8C1515; }
.inp--err { border-color: #dc2626; }
.ta { resize: vertical; min-height: 80px; line-height: 1.7; }
.ta--sm { min-height: 56px; }
.ta--code { font-family: monospace; font-size: .85rem; direction: ltr; text-align: left; }
.err { color: #dc2626; font-size: .82rem; font-weight: 600; margin-top: .25rem; }
.field__hint { color: var(--muted, #767571); font-size: .8rem; margin-top: .2rem; }
.blocks-list { display: flex; flex-direction: column; gap: .6rem; margin-bottom: 1rem; }
.block-card { border: 1.5px solid var(--border, #E0DFDC); border-radius: 14px; overflow: hidden; transition: border-color .2s; }
.block-card:hover { border-color: #c8c6c1; }
.block-card__header { display: flex; align-items: center; justify-content: space-between; padding: .65rem .85rem; background: #FAFAF9; }
.block-card__left { display: flex; align-items: center; gap: .5rem; min-width: 0; }
.block-card__seq { width: 24px; height: 24px; border-radius: 6px; background: #e8e5e1; color: var(--muted, #767571); display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: .75rem; flex-shrink: 0; }
.block-card__type-badge { display: inline-block; padding: .1rem .45rem; border-radius: 6px; font-weight: 700; font-size: .73rem; }
.block-card__type-badge--text    { background: #eff6ff; color: #1d4ed8; }
.block-card__type-badge--image   { background: #ecfdf5; color: #065f46; }
.block-card__type-badge--video   { background: #fef3c7; color: #92400e; }
.block-card__type-badge--audio   { background: #fdf4ff; color: #7c3aed; }
.block-card__type-badge--gallery { background: #fff7ed; color: #c2410c; }
.block-card__type-badge--quote   { background: #f0eeeb; color: #57534e; }
.block-card__type-badge--stats   { background: #f0fdf4; color: #166534; }
.block-card__title-text { font-weight: 600; font-size: .85rem; color: var(--text, #2E2D29); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.block-card__actions { display: flex; gap: .3rem; flex-shrink: 0; }
.block-btn { width: 28px; height: 28px; border-radius: 7px; border: 1px solid var(--border, #E0DFDC); background: var(--white, #fff); display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--muted, #767571); transition: all .12s; }
.block-btn:hover:not(:disabled) { border-color: #8C1515; color: #8C1515; background: #faf0f0; }
.block-btn:disabled { opacity: .35; cursor: not-allowed; }
.block-btn--del:hover:not(:disabled) { border-color: #dc2626; color: #dc2626; background: #fef2f2; }
.block-btn--toggle { border: none; background: transparent; }
.block-card__body { padding: 1rem .85rem; border-top: 1px solid #f0eeeb; }
.block-body-enter-active { transition: all .25s ease; }
.block-body-leave-active { transition: all .15s ease; }
.block-body-enter-from, .block-body-leave-to { opacity: 0; max-height: 0; padding-top: 0; padding-bottom: 0; }
.media-input-row { display: flex; gap: .5rem; }
.media-input-row .inp { flex: 1; }
.upload-btn { display: inline-flex; align-items: center; gap: .4rem; padding: .6rem .9rem; border-radius: 10px; background: #FAFAF9; border: 1.5px solid var(--border, #E0DFDC); font-weight: 700; font-size: .85rem; color: var(--muted, #767571); cursor: pointer; transition: all .15s; white-space: nowrap; }
.upload-btn:hover { border-color: #8C1515; color: #8C1515; background: #faf0f0; }
.upload-progress { display: flex; align-items: center; gap: .5rem; margin-top: .4rem; font-size: .82rem; color: var(--muted, #767571); }
.upload-progress__bar { width: 80px; height: 4px; border-radius: 4px; background: #e8e5e1; overflow: hidden; position: relative; }
.upload-progress__bar::after { content: ''; position: absolute; inset: 0; background: #8C1515; border-radius: 4px; animation: progress-slide 1.5s ease infinite; }
@keyframes progress-slide { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }
.block-preview-img { margin: .5rem 0; }
.block-preview-img img { max-width: 100%; max-height: 200px; border-radius: 10px; object-fit: cover; border: 1px solid #f0eeeb; }
.blocks-empty { text-align: center; padding: 1.5rem; color: var(--muted, #767571); }
.blocks-empty__ico { width: 56px; height: 56px; border-radius: 50%; background: #FAFAF9; border: 1px solid #E0DFDC; display: flex; align-items: center; justify-content: center; margin: 0 auto .6rem; color: #7E7A73; }
.blocks-empty p { font-weight: 600; margin: 0; }
.add-block { margin-top: .5rem; padding-top: .8rem; border-top: 1px dashed #E0DFDC; }
.add-block__label { display: block; font-weight: 700; font-size: .85rem; color: var(--muted, #767571); margin-bottom: .6rem; }
.add-block__btns { display: flex; flex-wrap: wrap; gap: .4rem; }
.add-block__btn { display: inline-flex; align-items: center; gap: .35rem; padding: .45rem .7rem; border-radius: 9px; border: 1.5px solid var(--border, #E0DFDC); background: var(--white, #fff); font-weight: 700; font-size: .82rem; cursor: pointer; transition: all .15s; color: var(--muted, #767571); font: inherit; }
.add-block__btn:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,.06); }
.add-block__btn--text:hover    { border-color: #3b82f6; color: #1d4ed8; background: #eff6ff; }
.add-block__btn--image:hover   { border-color: #10b981; color: #065f46; background: #ecfdf5; }
.add-block__btn--video:hover   { border-color: #f59e0b; color: #92400e; background: #fef3c7; }
.add-block__btn--audio:hover   { border-color: #a855f7; color: #7c3aed; background: #fdf4ff; }
.add-block__btn--gallery:hover { border-color: #f97316; color: #c2410c; background: #fff7ed; }
.add-block__btn--quote:hover   { border-color: #78716c; color: #57534e; background: #f0eeeb; }
.add-block__btn--stats:hover   { border-color: #22c55e; color: #166534; background: #f0fdf4; }
.add-block__btn-ico { display: flex; }
.publish-info { margin-bottom: 1rem; }
.publish-info__row { display: flex; justify-content: space-between; align-items: center; padding: .4rem 0; font-size: .85rem; border-bottom: 1px solid #f0eeeb; color: var(--muted, #767571); }
.publish-info__row strong { color: var(--text, #2E2D29); }
.publish-actions { display: flex; flex-direction: column; gap: .5rem; }
.block-summary { display: flex; flex-direction: column; gap: .35rem; }
.block-summary__row { display: flex; justify-content: space-between; align-items: center; padding: .35rem .5rem; border-radius: 8px; background: #FAFAF9; }
.block-summary__type { font-weight: 700; font-size: .8rem; padding: .1rem .4rem; border-radius: 6px; }
.block-summary__type--text    { background: #eff6ff; color: #1d4ed8; }
.block-summary__type--image   { background: #ecfdf5; color: #065f46; }
.block-summary__type--video   { background: #fef3c7; color: #92400e; }
.block-summary__type--audio   { background: #fdf4ff; color: #7c3aed; }
.block-summary__type--gallery { background: #fff7ed; color: #c2410c; }
.block-summary__type--quote   { background: #f0eeeb; color: #57534e; }
.block-summary__type--stats   { background: #f0fdf4; color: #166534; }
.block-summary__count { font-weight: 800; color: var(--text, #2E2D29); font-size: .9rem; }
.stats-editor { margin-top: .5rem; }
.btn { display: inline-flex; align-items: center; justify-content: center; gap: .4rem; text-decoration: none; border-radius: 12px; padding: .75rem 1rem; font-weight: 900; border: 1px solid transparent; transition: .18s ease; white-space: nowrap; cursor: pointer; font: inherit; }
.btn:hover { transform: translateY(-1px); }
.btn--primary { background: #8C1515; color: #fff; box-shadow: 0 10px 24px rgba(140,21,21,.18); }
.btn--danger  { background: #fff; color: #dc2626; border-color: #fecaca; }
.btn--danger:hover { background: #fef2f2; }
.btn--full { width: 100%; }
.spinner { width: 16px; height: 16px; border-radius: 50%; border: 2px solid rgba(255,255,255,.3); border-top-color: #fff; animation: spin .7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.toast { position: fixed; top: 1.2rem; left: 50%; transform: translateX(-50%); z-index: 9999; padding: .7rem 1.2rem; border-radius: 12px; font-weight: 700; display: flex; align-items: center; gap: .5rem; box-shadow: 0 12px 32px rgba(0,0,0,.12); }
.toast--success { background: #065f46; color: #fff; }
.toast--error   { background: #8C1515; color: #fff; }
.toast__ico { font-size: 1.1rem; }
.toast-enter-active, .toast-leave-active { transition: all .35s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translate(-50%, -20px); }
.loading-bar { height: 3px; border-radius: 3px; margin: 2rem 0; background: #e8e5e1; overflow: hidden; position: relative; }
.loading-bar::after { content: ''; position: absolute; inset: 0; background: #8C1515; border-radius: 3px; animation: bar-slide 1.2s ease infinite; }
@keyframes bar-slide { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }
</style>