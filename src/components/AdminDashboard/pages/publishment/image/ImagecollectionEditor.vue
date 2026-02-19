<template>
  <div class="ice" dir="rtl">

    <!-- Header -->
    <div class="ice__head">
      <RouterLink to="/admin/image-collections" class="ice__back">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        گەڕانەوە
      </RouterLink>
      <div>
        <h1 class="ice__title">{{ isEdit ? 'دەستکاری کۆکراوە' : 'کۆکراوەی نوێ' }}</h1>
        <p class="ice__sub" v-if="isEdit">ID: {{ route.params.id }}</p>
      </div>
    </div>

    <!-- Toast -->
    <Transition name="toast">
      <div v-if="toast.show" class="toast" :class="`toast--${toast.type}`">
        <span class="toast__ico">{{ toast.type === 'success' ? '✓' : '✕' }}</span>
        {{ toast.msg }}
      </div>
    </Transition>

    <div v-if="fetching" class="loading-bar"></div>

    <form @submit.prevent="submit" novalidate>
      <div class="ice__layout">

        <!-- ═══════════════ MAIN COLUMN ═══════════════ -->
        <div class="col-main">

          <!-- Collection Type -->
          <section class="card">
            <div class="card__hd"><span class="card__hd-ico">🗂️</span> جۆری کۆکراوە</div>
            <div class="type-picks">
              <label v-for="t in collectionTypes" :key="t.value"
                class="type-pick"
                :class="{ 'type-pick--on': form.collectionType === t.value, [`type-pick--${t.value.toLowerCase()}`]: true }">
                <input type="radio" :value="t.value" v-model="form.collectionType" />
                <span class="type-pick__icon" v-html="t.icon"></span>
                <span class="type-pick__label">{{ t.label }}</span>
                <span class="type-pick__hint">{{ t.hint }}</span>
              </label>
            </div>
            <div v-if="errors.collectionType" class="err">{{ errors.collectionType }}</div>
          </section>

          <!-- Languages -->
          <section class="card">
            <div class="card__hd"><span class="card__hd-ico">🌐</span> زمانەکانی ناوەڕۆک</div>
            <div class="lang-picks">
              <label class="lang-pick" :class="{ 'lang-pick--on': form.contentLanguages.includes('CKB') }">
                <input type="checkbox" value="CKB" v-model="form.contentLanguages" />
                <span class="lang-pick__flag">🟡</span> سۆرانی <span class="lang-pick__code">CKB</span>
              </label>
              <label class="lang-pick" :class="{ 'lang-pick--on': form.contentLanguages.includes('KMR') }">
                <input type="checkbox" value="KMR" v-model="form.contentLanguages" />
                <span class="lang-pick__flag">🔵</span> کورمانجی <span class="lang-pick__code">KMR</span>
              </label>
            </div>
            <div v-if="errors.contentLanguages" class="err">{{ errors.contentLanguages }}</div>
          </section>

          <!-- Bilingual Content -->
          <section class="card" v-if="form.contentLanguages.length">
            <div class="tabs">
              <button v-for="lang in form.contentLanguages" :key="lang" type="button"
                class="tab" :class="{ 'tab--on': activeLang === lang }" @click="activeLang = lang">
                <span class="tab__pip" :class="`tab__pip--${lang.toLowerCase()}`"></span>
                {{ lang === 'CKB' ? 'سۆرانی (CKB)' : 'کورمانجی (KMR)' }}
              </button>
            </div>

            <!-- CKB -->
            <div v-show="activeLang === 'CKB'" class="tab-panel">
              <div class="field">
                <label class="lbl">ناونیشان (سۆرانی)</label>
                <input v-model="form.ckbContent.title" class="inp" placeholder="ناونیشانی کۆکراوە بە سۆرانی…" />
              </div>
              <div class="field">
                <label class="lbl">وەسف (سۆرانی)</label>
                <textarea v-model="form.ckbContent.description" class="inp ta" placeholder="وەسفی کۆکراوە بە سۆرانی…"></textarea>
              </div>
              <div class="two-grid">
                <div class="field">
                  <label class="lbl">بابەت (سۆرانی)</label>
                  <input v-model="form.ckbContent.topic" class="inp" placeholder="بابەتی سەرەکی…" />
                </div>
                <div class="field">
                  <label class="lbl">شوێن (سۆرانی)</label>
                  <input v-model="form.ckbContent.location" class="inp" placeholder="شوێن یان ناوچە…" />
                </div>
              </div>
              <div class="field">
                <label class="lbl">کۆکەر (سۆرانی)</label>
                <input v-model="form.ckbContent.collectedBy" class="inp" placeholder="ناوی کۆکەر یان وێنەکێش…" />
              </div>
              <div class="field">
                <label class="lbl">تاگەکان (CKB)</label>
                <TagInput v-model="form.tagsCkb" placeholder="تاگی نوێ زیاد بکە" color="gold" />
              </div>
              <div class="field">
                <label class="lbl">کیووەردەکان (CKB)</label>
                <TagInput v-model="form.keywordsCkb" placeholder="کیووەردی نوێ" color="blue" />
              </div>
            </div>

            <!-- KMR -->
            <div v-show="activeLang === 'KMR'" class="tab-panel">
              <div class="field">
                <label class="lbl">ناونیشان (کورمانجی)</label>
                <input v-model="form.kmrContent.title" class="inp" placeholder="ناونیشانی کۆکراوە بە کورمانجی…" />
              </div>
              <div class="field">
                <label class="lbl">وەسف (کورمانجی)</label>
                <textarea v-model="form.kmrContent.description" class="inp ta" placeholder="وەسفی کۆکراوە بە کورمانجی…"></textarea>
              </div>
              <div class="two-grid">
                <div class="field">
                  <label class="lbl">بابەت (کورمانجی)</label>
                  <input v-model="form.kmrContent.topic" class="inp" placeholder="بابەتی سەرەکی…" />
                </div>
                <div class="field">
                  <label class="lbl">شوێن (کورمانجی)</label>
                  <input v-model="form.kmrContent.location" class="inp" placeholder="شوێن یان ناوچە…" />
                </div>
              </div>
              <div class="field">
                <label class="lbl">کۆکەر (کورمانجی)</label>
                <input v-model="form.kmrContent.collectedBy" class="inp" placeholder="ناوی کۆکەر یان وێنەکێش…" />
              </div>
              <div class="field">
                <label class="lbl">تاگەکان (KMR)</label>
                <TagInput v-model="form.tagsKmr" placeholder="تاگی نوێ زیاد بکە" color="gold" />
              </div>
              <div class="field">
                <label class="lbl">کیووەردەکان (KMR)</label>
                <TagInput v-model="form.keywordsKmr" placeholder="کیووەردی نوێ" color="blue" />
              </div>
            </div>
          </section>

          <!-- ══ IMAGE ALBUM BUILDER ══ -->
          <section class="card card--album">
            <div class="card__hd">
              <span class="card__hd-ico">🖼️</span>
              ئەلبووم
              <span class="card__hd-badge">{{ form.album.length }}</span>
              <!-- Type requirement hint -->
              <span class="album-req" :class="albumReqClass">{{ albumReqLabel }}</span>
            </div>

            <!-- Error -->
            <div v-if="errors.album" class="err err--album">{{ errors.album }}</div>

            <!-- Album items -->
            <div class="album-list" v-if="form.album.length">
              <div class="album-item" v-for="(item, idx) in form.album" :key="item._key">

                <!-- Item header -->
                <div class="album-item__head">
                  <span class="album-item__num">{{ idx + 1 }}</span>

                  <!-- Source toggle -->
                  <div class="src-toggle">
                    <button type="button" class="src-btn" :class="{ 'src-btn--on': !item.useUrl }" @click="item.useUrl = false">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                      بارکردنی فایل
                    </button>
                    <button type="button" class="src-btn" :class="{ 'src-btn--on': item.useUrl }" @click="item.useUrl = true">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
                      لینک URL
                    </button>
                  </div>

                  <input v-model.number="item.sortOrder" type="number" class="inp inp--xs" title="ڕیزبەندی" :placeholder="String(idx)" />

                  <button type="button" class="album-item__del" @click="removeAlbumItem(idx)" title="سڕینەوە">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </div>

                <!-- File upload mode -->
                <div v-if="!item.useUrl" class="album-item__body">
                  <div class="album-file-zone" :class="{ 'album-file-zone--has': item.preview }">
                    <img v-if="item.preview" :src="item.preview" class="album-file-zone__preview" />
                    <label class="album-file-zone__label" :class="{ 'album-file-zone__label--overlay': item.preview }">
                      <input type="file" accept="image/*" @change="onAlbumFile($event, idx)" style="display:none;" />
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                      <span>{{ item.file ? item.file.name : 'وێنە هەڵبژێرە' }}</span>
                    </label>
                  </div>
                </div>

                <!-- URL mode -->
                <div v-else class="album-item__body">
                  <div class="album-url-fields">
                    <input v-model="item.imageUrl" class="inp inp--sm" placeholder="imageUrl — لینکی S3 یان سەرەکی" />
                    <input v-model="item.externalUrl" class="inp inp--sm" placeholder="externalUrl — لینکی دەرەکی (ئارەزوویانە)" />
                    <input v-model="item.embedUrl" class="inp inp--sm" placeholder="embedUrl — YouTube یان Embed (ئارەزوویانە)" />
                  </div>
                  <!-- URL preview -->
                  <div class="url-preview" v-if="item.imageUrl || item.externalUrl">
                    <img :src="item.imageUrl || item.externalUrl" class="url-preview__img" @error="e => e.target.style.display='none'" />
                  </div>
                </div>

                <!-- Bilingual captions + descriptions -->
                <div class="album-item__meta">
                  <div class="two-grid two-grid--sm">
                    <div class="field">
                      <label class="lbl lbl--sm">کاپشن سۆرانی</label>
                      <input v-model="item.captionCkb" class="inp inp--sm" placeholder="کاپشنی کورتی وێنە…" />
                    </div>
                    <div class="field">
                      <label class="lbl lbl--sm">کاپشن کورمانجی</label>
                      <input v-model="item.captionKmr" class="inp inp--sm" placeholder="کاپشنی کورتی وێنە…" />
                    </div>
                  </div>
                  <div class="two-grid two-grid--sm" style="margin-top:.4rem;">
                    <div class="field">
                      <label class="lbl lbl--sm">وەسف سۆرانی</label>
                      <textarea v-model="item.descriptionCkb" class="inp inp--sm ta ta--sm" placeholder="وەسفی وێنە بە سۆرانی…"></textarea>
                    </div>
                    <div class="field">
                      <label class="lbl lbl--sm">وەسف کورمانجی</label>
                      <textarea v-model="item.descriptionKmr" class="inp inp--sm ta ta--sm" placeholder="وەسفی وێنە بە کورمانجی…"></textarea>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            <!-- Empty state -->
            <div class="album-empty" v-else>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
              <span>هیچ وێنەیەک نییە — وێنەت زیاد بکە</span>
            </div>

            <!-- Add item button (disabled for SINGLE when already 1 item) -->
            <div class="album-actions">
              <button type="button" class="btn btn--outline btn--sm"
                :disabled="form.collectionType === 'SINGLE' && form.album.length >= 1"
                @click="addAlbumItem(false)">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                وێنەی نوێ (بارکردنی فایل)
              </button>
              <button type="button" class="btn btn--outline btn--sm"
                :disabled="form.collectionType === 'SINGLE' && form.album.length >= 1"
                @click="addAlbumItem(true)">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
                وێنەی نوێ (URL)
              </button>
            </div>
          </section>

        </div>

        <!-- ═══════════════ SIDE COLUMN ═══════════════ -->
        <aside class="col-side">

          <!-- Cover image -->
          <section class="card">
            <div class="card__hd"><span class="card__hd-ico">🖼</span> کڤەر</div>
            <div class="cover-preview" v-if="coverPreview || form.coverUrl">
              <img :src="coverPreview || form.coverUrl" alt="cover preview" />
              <button type="button" class="cover-preview__remove" @click="removeCover">✕</button>
            </div>
            <label class="upload-zone upload-zone--sm" v-else>
              <input type="file" accept="image/*" @change="onCoverFile" style="display:none;" />
              <div class="upload-zone__inner">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                <span>هەڵبژاردنی وێنەی کڤەر</span>
              </div>
            </label>
            <div class="field" style="margin-top:.75rem;">
              <label class="lbl">یان URL یی کڤەر بنووسە</label>
              <input v-model="form.coverUrl" class="inp" placeholder="https://…" :disabled="!!coverFile" />
            </div>
            <div v-if="errors.cover" class="err">{{ errors.cover }}</div>
          </section>

          <!-- Publish date -->
          <section class="card">
            <div class="card__hd"><span class="card__hd-ico">📅</span> بەرواری بڵاوکردنەوە</div>
            <div class="field">
              <input v-model="form.publishmentDate" type="date" class="inp" />
            </div>
          </section>

          <!-- Submit -->
          <div class="side-actions">
            <button type="submit" class="btn btn--primary btn--full" :disabled="saving">
              <span v-if="saving" class="spinner"></span>
              {{ saving ? 'پاشەکەوتکردن…' : (isEdit ? 'پاشەکەوتکردنی گۆڕانکاری' : 'دروستکردنی کۆکراوە') }}
            </button>
            <RouterLink to="/admin/image-collections" class="btn btn--ghost btn--full">هەڵوەشاندنەوە</RouterLink>
          </div>

          <!-- Danger zone -->
          <section v-if="isEdit" class="card card--danger">
            <div class="card__hd card__hd--danger"><span class="card__hd-ico">⚠️</span> ناوچەی مەترسیدار</div>
            <p class="danger-text">سڕینەوەی کۆکراوە ناگەڕێتەوە و هەموو وێنەکانی دەسڕێتەوە.</p>
            <button type="button" class="btn btn--danger btn--full" @click="doDelete">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>
              سڕینەوەی ئەم کۆکراوەیە
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

// ── Inline TagInput ────────────────────────────────────────────────────────────
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
    const rem = (i) => { const a = [...props.modelValue]; a.splice(i, 1); emit('update:modelValue', a) }
    return () => h('div', { class: 'tag-input' }, [
      h('div', { class: 'tag-input__tags' }, [
        ...props.modelValue.map((t, i) =>
          h('span', { class: `tag-input__tag tag-input__tag--${props.color}`, key: t },
            [t, h('button', { type: 'button', onClick: () => rem(i) }, '✕')])
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

const isEdit       = computed(() => !!route.params.id)
const activeLang   = ref('CKB')
const fetching     = ref(false)
const saving       = ref(false)
const coverFile    = ref(null)
const coverPreview = ref('')
const toast        = ref({ show: false, type: 'success', msg: '' })
const errors       = ref({})
let   _keyCounter  = 0

const collectionTypes = [
  {
    value: 'SINGLE',
    label: 'تەنها وێنە',
    hint: 'تەنها ١ وێنە',
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`,
  },
  {
    value: 'GALLERY',
    label: 'گەلەری',
    hint: '١ وێنە یان زیاتر',
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="2" width="9" height="9" rx="1"/><rect x="13" y="2" width="9" height="9" rx="1"/><rect x="2" y="13" width="9" height="9" rx="1"/><rect x="13" y="13" width="9" height="9" rx="1"/></svg>`,
  },
  {
    value: 'PHOTO_STORY',
    label: 'چیرۆکی وێنە',
    hint: 'کەمی ٢ وێنە',
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>`,
  },
]

const form = reactive({
  collectionType:   '',
  contentLanguages: ['CKB'],
  coverUrl:         '',
  publishmentDate:  '',
  ckbContent: { title: '', description: '', topic: '', location: '', collectedBy: '' },
  kmrContent: { title: '', description: '', topic: '', location: '', collectedBy: '' },
  tagsCkb: [], tagsKmr: [],
  keywordsCkb: [], keywordsKmr: [],
  album: [],   // array of album items
})

/* ── Album requirement label ── */
const albumReqLabel = computed(() => {
  if (!form.collectionType) return ''
  const count = form.album.length
  if (form.collectionType === 'SINGLE') return count === 1 ? '✓ ١ وێنە' : `${count}/١`
  if (form.collectionType === 'GALLERY') return count >= 1 ? `✓ ${count} وێنە` : '١ یان زیاتر'
  if (form.collectionType === 'PHOTO_STORY') return count >= 2 ? `✓ ${count} وێنە` : `${count}/٢+`
  return ''
})
const albumReqClass = computed(() => {
  if (!form.collectionType) return ''
  const count = form.album.length
  const ok = (form.collectionType === 'SINGLE' && count === 1) ||
              (form.collectionType === 'GALLERY' && count >= 1) ||
              (form.collectionType === 'PHOTO_STORY' && count >= 2)
  return ok ? 'album-req--ok' : 'album-req--warn'
})

/* ── Album item management ── */
const makeItem = (useUrl = false) => ({
  _key:           ++_keyCounter,
  useUrl,
  file:           null,
  preview:        '',
  imageUrl:       '',
  externalUrl:    '',
  embedUrl:       '',
  captionCkb:     '',
  captionKmr:     '',
  descriptionCkb: '',
  descriptionKmr: '',
  sortOrder:      form.album.length,
})

const addAlbumItem  = (useUrl = false) => { form.album.push(makeItem(useUrl)) }
const removeAlbumItem = (idx) => {
  if (form.album[idx]?.preview) URL.revokeObjectURL(form.album[idx].preview)
  form.album.splice(idx, 1)
}

const onAlbumFile = (e, idx) => {
  const f = e.target.files?.[0]
  if (!f) return
  if (form.album[idx].preview) URL.revokeObjectURL(form.album[idx].preview)
  form.album[idx].file    = f
  form.album[idx].preview = URL.createObjectURL(f)
}

/* ── Cover ── */
const onCoverFile = (e) => {
  const f = e.target.files?.[0]
  if (!f) return
  coverFile.value    = f
  coverPreview.value = URL.createObjectURL(f)
  form.coverUrl      = ''
}
const removeCover = () => {
  if (coverPreview.value) URL.revokeObjectURL(coverPreview.value)
  coverFile.value    = null
  coverPreview.value = ''
  form.coverUrl      = ''
}

/* ── Load existing ── */
const loadCollection = async () => {
  if (!isEdit.value) return
  fetching.value = true
  try {
    const { data } = await api.get('/api/v1/image-collections')
    const all   = Array.isArray(data?.data) ? data.data : []
    const found = all.find(c => String(c.id) === String(route.params.id))
    if (found) applyCollection(found)
    else showToast('error', 'کۆکراوەکە نەدۆزرایەوە')
  } catch (e) {
    showToast('error', 'داتا هێنان سەرنەکەوت: ' + (e?.response?.data?.message || e.message))
  } finally {
    fetching.value = false
  }
}

const applyCollection = (c) => {
  form.collectionType   = c.collectionType || ''
  form.contentLanguages = [...(c.contentLanguages || ['CKB'])]
  activeLang.value      = form.contentLanguages[0] || 'CKB'
  form.coverUrl         = c.coverUrl || ''
  form.publishmentDate  = c.publishmentDate || ''

  if (c.ckbContent) Object.assign(form.ckbContent, {
    title: c.ckbContent.title || '', description: c.ckbContent.description || '',
    topic: c.ckbContent.topic || '', location: c.ckbContent.location || '',
    collectedBy: c.ckbContent.collectedBy || '',
  })
  if (c.kmrContent) Object.assign(form.kmrContent, {
    title: c.kmrContent.title || '', description: c.kmrContent.description || '',
    topic: c.kmrContent.topic || '', location: c.kmrContent.location || '',
    collectedBy: c.kmrContent.collectedBy || '',
  })

  form.tagsCkb     = [...(c.tags?.ckb     || [])]
  form.tagsKmr     = [...(c.tags?.kmr     || [])]
  form.keywordsCkb = [...(c.keywords?.ckb || [])]
  form.keywordsKmr = [...(c.keywords?.kmr || [])]

  // Restore album items as URL items (existing data always comes back as URLs)
  form.album = (c.imageAlbum || [])
    .slice()
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    .map(i => ({
      _key:           ++_keyCounter,
      useUrl:         true,
      file:           null,
      preview:        '',
      imageUrl:       i.imageUrl     || '',
      externalUrl:    i.externalUrl  || '',
      embedUrl:       i.embedUrl     || '',
      captionCkb:     i.captionCkb   || '',
      captionKmr:     i.captionKmr   || '',
      descriptionCkb: i.descriptionCkb || '',
      descriptionKmr: i.descriptionKmr || '',
      sortOrder:      i.sortOrder ?? 0,
    }))
}

/* ── Validation ── */
const validate = () => {
  const e = {}

  if (!form.collectionType) e.collectionType = 'جۆری کۆکراوە پێویستە'
  if (!form.contentLanguages.length) e.contentLanguages = 'کەمی یەک زمانیکی هەڵبژێرە'
  if (!coverFile.value && !form.coverUrl.trim()) e.cover = 'کڤەر پێویستە — فایل بار بکە یان URL بنووسە'

  const count = form.album.length
  if (form.collectionType === 'SINGLE' && count !== 1) e.album = 'جۆری SINGLE پێویستی بە تەنها ١ وێنەیە'
  if (form.collectionType === 'GALLERY' && count < 1) e.album = 'جۆری GALLERY پێویستی بە کەمی ١ وێنەیە'
  if (form.collectionType === 'PHOTO_STORY' && count < 2) e.album = 'جۆری PHOTO_STORY پێویستی بە کەمی ٢ وێنەیە'

  // Each URL item must have at least one url
  form.album.forEach((item, i) => {
    if (item.useUrl && !item.imageUrl.trim() && !item.externalUrl.trim() && !item.embedUrl.trim()) {
      e.album = `وێنەی #${i + 1}: پێویستە URL بنووسیت یان فایل بارکەیت`
    }
    if (!item.useUrl && !item.file) {
      e.album = `وێنەی #${i + 1}: فایلێک هەڵبژێرە`
    }
  })

  errors.value = e
  return !Object.keys(e).length
}

/* ── Submit ── */
const submit = async () => {
  if (!validate()) { window.scrollTo({ top: 0, behavior: 'smooth' }); return }
  saving.value = true

  try {
    /*
     * File-backed items MUST come first in imageAlbum array so their
     * indices align with the `images` multipart file array the backend zips them against.
     */
    const fileItems = form.album.filter(i => !i.useUrl && i.file)
    const urlItems  = form.album.filter(i => i.useUrl)

    const buildItemDto = (item) => ({
      captionCkb:     item.captionCkb     || null,
      captionKmr:     item.captionKmr     || null,
      descriptionCkb: item.descriptionCkb || null,
      descriptionKmr: item.descriptionKmr || null,
      sortOrder:      item.sortOrder ?? 0,
      // for file items backend uses the uploaded file; keep imageUrl null
      imageUrl:    item.useUrl ? (item.imageUrl    || null) : null,
      externalUrl: item.useUrl ? (item.externalUrl || null) : null,
      embedUrl:    item.useUrl ? (item.embedUrl     || null) : null,
    })

    const dto = {
      collectionType:   form.collectionType,
      contentLanguages: form.contentLanguages,
      coverUrl:         form.coverUrl || null,
      publishmentDate:  form.publishmentDate || null,

      ckbContent: form.contentLanguages.includes('CKB') ? {
        title:       form.ckbContent.title       || null,
        description: form.ckbContent.description || null,
        topic:       form.ckbContent.topic       || null,
        location:    form.ckbContent.location     || null,
        collectedBy: form.ckbContent.collectedBy || null,
      } : null,

      kmrContent: form.contentLanguages.includes('KMR') ? {
        title:       form.kmrContent.title       || null,
        description: form.kmrContent.description || null,
        topic:       form.kmrContent.topic       || null,
        location:    form.kmrContent.location     || null,
        collectedBy: form.kmrContent.collectedBy || null,
      } : null,

      tags:     { ckb: form.tagsCkb,     kmr: form.tagsKmr },
      keywords: { ckb: form.keywordsCkb, kmr: form.keywordsKmr },

      // file items first, then url items — matches the images[] file order below
      imageAlbum: [...fileItems, ...urlItems].map(buildItemDto),
    }

    const fd = new FormData()
    fd.append('data', new Blob([JSON.stringify(dto)], { type: 'application/json' }))

    if (coverFile.value) fd.append('cover', coverFile.value)

    // Append files in the SAME order as fileItems in the dto
    fileItems.forEach(i => fd.append('images', i.file))

    const cfg = { headers: { 'Content-Type': 'multipart/form-data' } }

    if (isEdit.value) {
      await api.put(`/api/v1/image-collections/${route.params.id}`, fd, cfg)
    } else {
      await api.post('/api/v1/image-collections', fd, cfg)
    }

    showToast('success', isEdit.value ? 'کۆکراوەکە نوێکرایەوە ✓' : 'کۆکراوەکە دروستکرا ✓')
    setTimeout(() => router.push('/admin/image-collections'), 1200)

  } catch (e) {
    showToast('error', e?.response?.data?.message || e.message || 'هەڵەیەک ڕوویدا')
  } finally {
    saving.value = false
  }
}

const doDelete = async () => {
  if (!confirm(`دڵنیای لە سڕینەوەی کۆکراوە #${route.params.id}؟`)) return
  try {
    await api.delete(`/api/v1/image-collections/${route.params.id}`)
    showToast('success', 'کۆکراوەکە سڕایەوە')
    setTimeout(() => router.push('/admin/image-collections'), 800)
  } catch (e) {
    showToast('error', e?.response?.data?.message || 'سڕینەوە سەرنەکەوت')
  }
}

const showToast = (type, msg) => {
  toast.value = { show: true, type, msg }
  setTimeout(() => { toast.value.show = false }, 4000)
}

onMounted(loadCollection)
</script>

<style scoped>
.ice { direction:rtl; max-width:1280px; margin:0 auto; }
.ice__head { display:flex; align-items:center; gap:1.25rem; margin-bottom:1.5rem; flex-wrap:wrap; }
.ice__back { display:inline-flex; align-items:center; gap:.4rem; color:var(--muted); text-decoration:none; font-weight:600; font-size:.87rem; padding:.4rem .7rem; border-radius:8px; border:1px solid var(--border); background:var(--white); transition:var(--transition); }
.ice__back:hover { color:var(--crimson); border-color:var(--crimson); }
.ice__title { font-size:1.4rem; font-weight:700; color:var(--text); }
.ice__sub { font-size:.8rem; color:var(--muted); margin-top:.1rem; }
.toast { display:flex; align-items:center; gap:.65rem; padding:.8rem 1.1rem; border-radius:var(--radius-sm); font-weight:600; font-size:.88rem; margin-bottom:1rem; }
.toast__ico { font-size:1rem; }
.toast--success { background:rgba(25,130,80,.1); border:1px solid rgba(25,130,80,.25); color:#186048; }
.toast--error   { background:rgba(180,40,40,.08); border:1px solid rgba(180,40,40,.2); color:var(--crimson); }
.toast-enter-active,.toast-leave-active { transition:.3s ease; }
.toast-enter-from,.toast-leave-to { opacity:0; transform:translateY(-6px); }
.loading-bar { height:3px; border-radius:2px; margin-bottom:.75rem; background:linear-gradient(90deg,var(--crimson),var(--gold),var(--crimson)); background-size:200% 100%; animation:shimmer 1.2s linear infinite; }
@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
.ice__layout { display:grid; grid-template-columns:1fr 320px; gap:1.25rem; align-items:start; }
@media (max-width:900px) { .ice__layout { grid-template-columns:1fr; } }
.card { background:var(--white); border:1px solid var(--border); border-radius:var(--radius-md); padding:1.35rem; box-shadow:var(--shadow-sm); margin-bottom:1.25rem; }
.card--danger { border-color:rgba(140,21,21,.18); }
.card--album  { padding-bottom:.9rem; }
.card__hd { display:flex; align-items:center; gap:.6rem; font-weight:700; font-size:.95rem; color:var(--text); margin-bottom:1.1rem; padding-bottom:.75rem; border-bottom:1px solid var(--cream-dk); flex-wrap:wrap; }
.card__hd--danger { color:var(--crimson); border-bottom-color:rgba(140,21,21,.1); }
.card__hd-ico { font-size:1rem; }
.card__hd-badge { margin-right:auto; background:var(--cream-dk); border:1px solid var(--border); border-radius:99px; padding:.1rem .6rem; font-size:.78rem; color:var(--muted); }
.danger-text { font-size:.84rem; color:var(--muted); margin-bottom:.85rem; line-height:1.65; }

/* Album requirement indicator */
.album-req { display:inline-flex; padding:.15rem .55rem; border-radius:99px; font-size:.72rem; font-weight:700; }
.album-req--ok   { background:rgba(39,174,96,.1); color:#186040; border:1px solid rgba(39,174,96,.25); }
.album-req--warn { background:rgba(243,156,18,.1); color:#8c5f00; border:1px solid rgba(243,156,18,.28); }

/* Collection type picker */
.type-picks { display:grid; grid-template-columns:repeat(3,1fr); gap:.75rem; }
@media (max-width:600px) { .type-picks { grid-template-columns:1fr; } }
.type-pick { display:flex; flex-direction:column; align-items:center; gap:.4rem; padding:.9rem .75rem; border-radius:var(--radius-sm); border:1.5px solid var(--border); cursor:pointer; transition:var(--transition); text-align:center; user-select:none; }
.type-pick input { display:none; }
.type-pick:hover { border-color:var(--crimson); }
.type-pick--on { background:rgba(140,21,21,.05); border-color:var(--crimson); box-shadow:0 0 0 3px rgba(140,21,21,.08); }
.type-pick__icon { color:var(--muted); transition:color .2s; }
.type-pick--on .type-pick__icon { color:var(--crimson); }
.type-pick__label { font-size:.88rem; font-weight:700; color:var(--text); }
.type-pick__hint  { font-size:.73rem; color:var(--muted); }

/* Lang picks */
.lang-picks { display:flex; gap:.75rem; flex-wrap:wrap; }
.lang-pick { display:inline-flex; align-items:center; gap:.5rem; padding:.65rem 1rem; border-radius:var(--radius-sm); border:1.5px solid var(--border); cursor:pointer; transition:var(--transition); font-weight:600; user-select:none; }
.lang-pick input { display:none; }
.lang-pick:hover { border-color:var(--crimson); }
.lang-pick--on { background:rgba(140,21,21,.06); border-color:var(--crimson); color:var(--crimson); }
.lang-pick__code { font-size:.75rem; font-weight:700; opacity:.6; }

/* Tabs */
.tabs { display:flex; gap:.4rem; margin-bottom:1.1rem; border-bottom:1px solid var(--border); }
.tab { display:inline-flex; align-items:center; gap:.4rem; padding:.6rem 1rem; border-radius:8px 8px 0 0; border:1px solid transparent; border-bottom:none; background:none; color:var(--muted); font-weight:700; font-size:.88rem; cursor:pointer; transition:var(--transition); margin-bottom:-1px; font-family:inherit; }
.tab--on { background:var(--white); border-color:var(--border); color:var(--crimson); }
.tab__pip { width:7px; height:7px; border-radius:50%; }
.tab__pip--ckb { background:#c8a800; }
.tab__pip--kmr { background:#4a7af0; }
.tab-panel { padding-top:.25rem; }
.field { display:flex; flex-direction:column; gap:.4rem; margin-bottom:.95rem; }
.lbl { font-weight:700; font-size:.83rem; color:var(--text); }
.lbl--sm { font-size:.77rem; }
.lbl--req::after { content:' *'; color:var(--crimson); }
.two-grid { display:grid; grid-template-columns:1fr 1fr; gap:.9rem; }
.two-grid--sm { gap:.6rem; }
@media (max-width:600px) { .two-grid { grid-template-columns:1fr; } }
.inp { border:1.5px solid var(--border); border-radius:var(--radius-sm); padding:.7rem .9rem; background:var(--cream); color:var(--text); font-size:.9rem; outline:none; transition:var(--transition); width:100%; font-family:inherit; }
.inp:focus { background:var(--white); border-color:var(--crimson); box-shadow:0 0 0 3px rgba(140,21,21,.1); }
.inp--sm { padding:.5rem .7rem; font-size:.85rem; }
.inp--xs { padding:.4rem .5rem; font-size:.82rem; width:60px; text-align:center; }
.ta { min-height:120px; resize:vertical; }
.ta--sm { min-height:72px; }
.err { font-size:.78rem; color:#c0392b; font-weight:600; }
.err--album { margin-bottom:.85rem; padding:.6rem .85rem; background:rgba(192,57,43,.06); border:1px solid rgba(192,57,43,.2); border-radius:var(--radius-sm); }

/* ── ALBUM BUILDER ── */
.album-list { display:flex; flex-direction:column; gap:.85rem; margin-bottom:1rem; }
.album-item { border:1.5px solid var(--border); border-radius:var(--radius-sm); background:var(--cream); overflow:hidden; transition:border-color .2s ease; }
.album-item:hover { border-color:rgba(140,21,21,.3); }
.album-item__head { display:flex; align-items:center; gap:.5rem; padding:.6rem .85rem; background:var(--cream-dk); border-bottom:1px solid var(--border); }
.album-item__num { width:24px; height:24px; border-radius:50%; background:var(--crimson); color:#fff; font-size:.72rem; font-weight:800; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.album-item__del { margin-right:auto; width:26px; height:26px; border-radius:6px; background:none; border:1px solid var(--border); color:var(--muted); cursor:pointer; display:flex; align-items:center; justify-content:center; transition:var(--transition); flex-shrink:0; }
.album-item__del:hover { background:rgba(140,21,21,.08); border-color:var(--crimson); color:var(--crimson); }
.album-item__body { padding:.75rem .85rem; border-bottom:1px solid var(--border); }
.album-item__meta { padding:.75rem .85rem; }

/* Source toggle */
.src-toggle { display:flex; border-radius:8px; overflow:hidden; border:1px solid var(--border); flex-shrink:0; }
.src-btn { display:inline-flex; align-items:center; gap:.35rem; padding:.35rem .65rem; background:none; border:none; color:var(--muted); font-size:.76rem; font-weight:700; cursor:pointer; font-family:inherit; transition:var(--transition); white-space:nowrap; }
.src-btn + .src-btn { border-right:1px solid var(--border); }
.src-btn--on { background:var(--crimson); color:#fff; }

/* File upload zone inside album item */
.album-file-zone { position:relative; min-height:100px; border:2px dashed var(--border); border-radius:var(--radius-sm); display:flex; align-items:center; justify-content:center; transition:var(--transition); cursor:pointer; overflow:hidden; }
.album-file-zone--has { border-color:rgba(140,21,21,.3); min-height:140px; }
.album-file-zone__preview { position:absolute; inset:0; width:100%; height:100%; object-fit:contain; background:#0a0a0a; }
.album-file-zone__label { display:flex; flex-direction:column; align-items:center; gap:.4rem; cursor:pointer; font-size:.82rem; color:var(--muted); padding:1rem; text-align:center; z-index:1; }
.album-file-zone__label--overlay { position:absolute; inset:0; background:rgba(0,0,0,.55); color:rgba(255,255,255,.85); justify-content:center; border-radius:var(--radius-sm); opacity:0; transition:opacity .2s; }
.album-file-zone:hover .album-file-zone__label--overlay { opacity:1; }

/* URL fields inside album item */
.album-url-fields { display:flex; flex-direction:column; gap:.45rem; }
.url-preview { margin-top:.6rem; border-radius:6px; overflow:hidden; border:1px solid var(--border); max-height:120px; display:flex; align-items:center; justify-content:center; background:#0a0a0a; }
.url-preview__img { max-width:100%; max-height:120px; object-fit:contain; display:block; }

/* Album empty + actions */
.album-empty { display:flex; flex-direction:column; align-items:center; gap:.65rem; padding:2.5rem 1rem; color:var(--muted); font-size:.87rem; text-align:center; border:2px dashed var(--border); border-radius:var(--radius-sm); margin-bottom:1rem; }
.album-actions { display:flex; gap:.6rem; flex-wrap:wrap; padding-top:.25rem; }

/* Cover preview */
.cover-preview { position:relative; border-radius:var(--radius-sm); overflow:hidden; border:1px solid var(--border); margin-bottom:.75rem; }
.cover-preview img { width:100%; max-height:200px; object-fit:cover; display:block; }
.cover-preview__remove { position:absolute; top:.5rem; left:.5rem; width:28px; height:28px; border-radius:50%; background:rgba(0,0,0,.55); color:#fff; border:none; cursor:pointer; font-size:.85rem; display:flex; align-items:center; justify-content:center; }
.upload-zone { border:2px dashed var(--border); border-radius:var(--radius-sm); cursor:pointer; transition:var(--transition); display:block; margin-bottom:.75rem; }
.upload-zone:hover { border-color:var(--crimson); background:rgba(140,21,21,.03); }
.upload-zone--sm .upload-zone__inner { padding:1.25rem; }
.upload-zone__inner { display:flex; flex-direction:column; align-items:center; gap:.5rem; padding:1.75rem 1rem; color:var(--muted); font-size:.87rem; text-align:center; cursor:pointer; }

/* Buttons */
.btn { display:inline-flex; align-items:center; justify-content:center; gap:.45rem; padding:.7rem 1.1rem; border-radius:var(--radius-sm); font-weight:700; font-size:.88rem; cursor:pointer; border:1px solid transparent; transition:var(--transition); text-decoration:none; white-space:nowrap; font-family:inherit; }
.btn--primary { background:var(--crimson); color:#fff; box-shadow:0 6px 20px rgba(140,21,21,.25); }
.btn--primary:hover { background:var(--crimson-lt); transform:translateY(-1px); }
.btn--ghost { background:transparent; border-color:var(--border); color:var(--text); }
.btn--ghost:hover { border-color:var(--crimson); color:var(--crimson); }
.btn--outline { background:transparent; border-color:var(--border); color:var(--muted); }
.btn--outline:hover { border-color:var(--crimson); color:var(--crimson); }
.btn--danger { background:#c0392b; color:#fff; border-color:#c0392b; }
.btn--danger:hover { background:#a93226; }
.btn--sm { padding:.5rem .8rem; font-size:.83rem; }
.btn--full { width:100%; }
.btn:disabled { opacity:.55; cursor:not-allowed; transform:none!important; }
.side-actions { display:flex; flex-direction:column; gap:.6rem; }
.spinner { width:14px; height:14px; border:2px solid rgba(255,255,255,.4); border-top-color:#fff; border-radius:50%; animation:spin .7s linear infinite; }
@keyframes spin { to { transform:rotate(360deg) } }
</style>

<!-- TagInput global styles -->
<style>
.tag-input { display:flex; flex-direction:column; gap:.4rem; }
.tag-input__tags { display:flex; flex-wrap:wrap; gap:.4rem; align-items:center; border:1.5px solid var(--border); border-radius:var(--radius-sm); padding:.45rem .65rem; background:var(--cream); min-height:42px; transition:border-color .2s; }
.tag-input__tags:focus-within { border-color:var(--crimson); background:var(--white); box-shadow:0 0 0 3px rgba(140,21,21,.1); }
.tag-input__tag { display:inline-flex; align-items:center; gap:.3rem; padding:.2rem .55rem; border-radius:6px; font-size:.8rem; font-weight:600; }
.tag-input__tag--default { background:var(--cream-dk); border:1px solid var(--border); color:var(--text); }
.tag-input__tag--gold { background:rgba(254,221,0,.2); border:1px solid rgba(254,221,0,.4); color:#807000; }
.tag-input__tag--blue { background:rgba(30,80,200,.1); border:1px solid rgba(30,80,200,.2); color:#1840a0; }
.tag-input__tag button { background:none; border:none; cursor:pointer; color:inherit; opacity:.6; font-size:.75rem; line-height:1; }
.tag-input__tag button:hover { opacity:1; }
.tag-input__inp { border:none; outline:none; background:none; font-family:inherit; font-size:.88rem; min-width:120px; color:var(--text); }
</style>