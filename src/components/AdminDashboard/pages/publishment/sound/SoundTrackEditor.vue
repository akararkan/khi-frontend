<template>
  <div class="ste" dir="rtl">

    <!-- Header -->
    <div class="ste__head">
      <RouterLink to="/admin/soundtracks" class="ste__back">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5M12 5l-7 7 7 7"/>
        </svg>
        گەڕانەوە
      </RouterLink>
      <div>
        <h1 class="ste__title">{{ isEdit ? 'دەستکاری دەنگ' : 'دەنگی نوێ' }}</h1>
        <p class="ste__sub" v-if="isEdit">ID: {{ route.params.id }}</p>
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
      <div class="ste__layout">

        <!-- ═══════════════ MAIN COLUMN ═══════════════ -->
        <div class="col-main">

          <!-- Sound Type -->
          <section class="card">
            <div class="card__hd"><span class="card__hd-ico">🎵</span> جۆری دەنگ</div>
            <div class="type-picks">
              <label class="type-pick" :class="{ 'type-pick--on': form.soundType === 'LAWK', 'type-pick--lawk': true }">
                <input type="radio" value="LAWK" v-model="form.soundType" />
                <span class="type-pick__icon">🎶</span>
                <span class="type-pick__label">لاوک (LAWK)</span>
                <span class="type-pick__hint">دەنگی لاوکی کوردی</span>
              </label>
              <label class="type-pick" :class="{ 'type-pick--on': form.soundType === 'HAIRAN', 'type-pick--hairan': true }">
                <input type="radio" value="HAIRAN" v-model="form.soundType" />
                <span class="type-pick__icon">🪕</span>
                <span class="type-pick__label">حەیران (HAIRAN)</span>
                <span class="type-pick__hint">دەنگی حەیران</span>
              </label>
            </div>
            <div v-if="errors.soundType" class="err">{{ errors.soundType }}</div>
          </section>

          <!-- Track State -->
          <section class="card">
            <div class="card__hd"><span class="card__hd-ico">📼</span> دۆخی فایل (Track State)</div>
            <div class="state-picks">
              <label class="state-pick" :class="{ 'state-pick--on': form.trackState === 'SINGLE' }">
                <input type="radio" value="SINGLE" v-model="form.trackState" />
                <span class="state-pick__flag">🟢</span>
                تاک دەنگ <span class="state-pick__code">SINGLE</span>
              </label>
              <label class="state-pick" :class="{ 'state-pick--on': form.trackState === 'MULTI' }">
                <input type="radio" value="MULTI" v-model="form.trackState" />
                <span class="state-pick__flag">🟣</span>
                چند دەنگ <span class="state-pick__code">MULTI</span>
              </label>
            </div>
            <div v-if="errors.trackState" class="err">{{ errors.trackState }}</div>
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
                <label class="lbl lbl--req">ناونیشان (سۆرانی)</label>
                <input v-model="form.ckbContent.title" class="inp" placeholder="ناونیشانی دەنگ بە سۆرانی…" />
              </div>
              <div class="field">
                <label class="lbl">وەسف (سۆرانی)</label>
                <textarea v-model="form.ckbContent.description" class="inp ta" placeholder="وەسف…"></textarea>
              </div>
              <div class="field">
                <label class="lbl">خوێندن (سۆرانی)</label>
                <input v-model="form.ckbContent.reading" class="inp" placeholder="ناوی خوێنەر / گروپ…" />
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
                <label class="lbl lbl--req">ناونیشان (کورمانجی)</label>
                <input v-model="form.kmrContent.title" class="inp" placeholder="Sernavê dengê…" />
              </div>
              <div class="field">
                <label class="lbl">وەسف (کورمانجی)</label>
                <textarea v-model="form.kmrContent.description" class="inp ta" placeholder="Danasîn…"></textarea>
              </div>
              <div class="field">
                <label class="lbl">خوێندن (کورمانجی)</label>
                <input v-model="form.kmrContent.reading" class="inp" placeholder="Navê xwîner / kom…" />
              </div>

              <div class="field">
                <label class="lbl">تاگەکان (KMR)</label>
                <TagInput v-model="form.tagsKmr" placeholder="Tagê nû" color="gold" />
              </div>
              <div class="field">
                <label class="lbl">کیووەردەکان (KMR)</label>
                <TagInput v-model="form.keywordsKmr" placeholder="Keyword" color="blue" />
              </div>
            </div>

            <div v-if="errors.titles" class="err">{{ errors.titles }}</div>
          </section>

          <!-- Shared meta -->
          <section class="card">
            <div class="card__hd"><span class="card__hd-ico">🧾</span> زانیاری گشتی</div>

            <div class="two-grid">
              <div class="field">
                <label class="lbl">Director</label>
                <input v-model="form.director" class="inp" placeholder="Director…" />
              </div>
              <div class="field">
                <label class="lbl">پڕۆژەی ناوەند؟</label>
                <button type="button" class="toggle" :class="{ 'toggle--on': form.isThisProjectOfInstitute }" @click="form.isThisProjectOfInstitute = !form.isThisProjectOfInstitute">
                  <span class="toggle__dot"></span>
                  {{ form.isThisProjectOfInstitute ? 'بەڵێ' : 'نەخێر' }}
                </button>
              </div>
            </div>

            <div class="field">
              <label class="lbl">شوێنەکان (Locations)</label>
              <TagInput v-model="form.locations" placeholder="شوێنی نوێ" color="default" />
            </div>
          </section>

          <!-- Files builder -->
          <section class="card card--files">
            <div class="card__hd">
              <span class="card__hd-ico">🎧</span>
              فایلەکان
              <span class="card__hd-badge">{{ fileCount }}</span>
              <span class="album-req" :class="fileReqClass">{{ fileReqLabel }}</span>
            </div>

            <div v-if="errors.files" class="err err--album">{{ errors.files }}</div>

            <div class="files-list" v-if="form.files.length">
              <div class="file-item" v-for="(item, idx) in form.files" :key="item._key">

                <div class="file-item__head">
                  <span class="file-item__num">{{ idx + 1 }}</span>

                  <div class="src-toggle">
                    <button type="button" class="src-btn" :class="{ 'src-btn--on': !item.useUrl }" @click="item.useUrl = false">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                      </svg>
                      بارکردنی فایل
                    </button>
                    <button type="button" class="src-btn" :class="{ 'src-btn--on': item.useUrl }" @click="item.useUrl = true">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
                        <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
                      </svg>
                      لینک URL
                    </button>
                  </div>

                  <button type="button" class="mini-btn" @click="moveUp(idx)" :disabled="idx===0" title="سەرەوە">↑</button>
                  <button type="button" class="mini-btn" @click="moveDown(idx)" :disabled="idx===form.files.length-1" title="خوارەوە">↓</button>

                  <button type="button" class="file-item__del" @click="removeFile(idx)" title="سڕینەوە">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                </div>

                <!-- Upload -->
                <div v-if="!item.useUrl" class="file-item__body">
                  <label class="upload-zone upload-zone--inline">
                    <input type="file" accept="audio/*" @change="onAudioFile($event, idx)" style="display:none;" />
                    <div class="upload-zone__inner upload-zone__inner--inline">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                      </svg>
                      <span>{{ item.file ? item.file.name : 'فایلی دەنگ هەڵبژێرە' }}</span>
                    </div>
                  </label>
                </div>

                <!-- URL -->
                <div v-else class="file-item__body">
                  <div class="two-grid two-grid--sm">
                    <div class="field">
                      <label class="lbl lbl--sm">fileUrl</label>
                      <input v-model="item.fileUrl" class="inp inp--sm" placeholder="S3/CDN direct url…" />
                    </div>
                    <div class="field">
                      <label class="lbl lbl--sm">fileType</label>
                      <select v-model="item.fileType" class="inp inp--sm">
                        <option value="MP3">MP3</option>
                        <option value="WAV">WAV</option>
                        <option value="OGG">OGG</option>
                        <option value="AAC">AAC</option>
                        <option value="FLAC">FLAC</option>
                        <option value="OTHER">OTHER</option>
                      </select>
                    </div>
                  </div>

                  <div class="field">
                    <label class="lbl lbl--sm">externalUrl</label>
                    <input v-model="item.externalUrl" class="inp inp--sm" placeholder="YouTube/SoundCloud page…" />
                  </div>
                  <div class="field">
                    <label class="lbl lbl--sm">embedUrl</label>
                    <input v-model="item.embedUrl" class="inp inp--sm" placeholder="Embed url…" />
                  </div>
                </div>

                <!-- Meta -->
                <div class="file-item__meta">
                  <div class="two-grid two-grid--sm">
                    <div class="field">
                      <label class="lbl lbl--sm">Reader name</label>
                      <input v-model="item.readerName" class="inp inp--sm" placeholder="خوێنەر / گروپ…" />
                    </div>
                    <div class="field">
                      <label class="lbl lbl--sm">durationSeconds</label>
                      <input v-model.number="item.durationSeconds" type="number" class="inp inp--sm" placeholder="0" min="0" />
                    </div>
                  </div>
                  <div class="two-grid two-grid--sm" style="margin-top:.45rem;">
                    <div class="field">
                      <label class="lbl lbl--sm">sizeBytes</label>
                      <input v-model.number="item.sizeBytes" type="number" class="inp inp--sm" placeholder="0" min="0" />
                    </div>
                    <div class="field">
                      <label class="lbl lbl--sm">Preview</label>
                      <div class="mini-preview">
                        <audio v-if="previewUrl(item)" :src="previewUrl(item)" controls preload="none" style="width:100%"></audio>
                        <div v-else class="mini-preview__empty">—</div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            <div class="album-empty" v-else>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
                <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
              </svg>
              <span>هیچ فایلێک نییە — فایل زیاد بکە</span>
            </div>

            <div class="album-actions">
              <button type="button" class="btn btn--outline btn--sm"
                :disabled="form.trackState === 'SINGLE' && form.files.length >= 1"
                @click="addFile(false)">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                فایل نوێ (Upload)
              </button>

              <button type="button" class="btn btn--outline btn--sm"
                :disabled="form.trackState === 'SINGLE' && form.files.length >= 1"
                @click="addFile(true)">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
                  <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
                </svg>
                فایل نوێ (URL)
              </button>
            </div>
          </section>

        </div>

        <!-- ═══════════════ SIDE COLUMN ═══════════════ -->
        <aside class="col-side">

          <!-- Cover -->
          <section class="card">
            <div class="card__hd"><span class="card__hd-ico">🖼</span> کڤەر (Cover)</div>

            <div class="cover-preview" v-if="coverPreview || form.coverUrl">
              <img :src="coverPreview || form.coverUrl" alt="cover preview" />
              <button type="button" class="cover-preview__remove" @click="removeCover">✕</button>
            </div>

            <label class="upload-zone upload-zone--sm" v-else>
              <input type="file" accept="image/*" @change="onCoverFile" style="display:none;" />
              <div class="upload-zone__inner">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                </svg>
                <span>هەڵبژاردنی وێنەی کڤەر</span>
              </div>
            </label>

            <div class="field" style="margin-top:.75rem;">
              <label class="lbl">یان URL یی کڤەر بنووسە</label>
              <input v-model="form.coverUrl" class="inp" placeholder="https://…" :disabled="!!coverFile" />
            </div>
          </section>

          <!-- Submit -->
          <div class="side-actions">
            <button type="submit" class="btn btn--primary btn--full" :disabled="saving">
              <span v-if="saving" class="spinner"></span>
              {{ saving ? 'پاشەکەوتکردن…' : (isEdit ? 'پاشەکەوتکردنی گۆڕانکاری' : 'دروستکردنی دەنگ') }}
            </button>
            <RouterLink to="/admin/soundtracks" class="btn btn--ghost btn--full">هەڵوەشاندنەوە</RouterLink>
          </div>

          <!-- Danger zone -->
          <section v-if="isEdit" class="card card--danger">
            <div class="card__hd card__hd--danger"><span class="card__hd-ico">⚠️</span> ناوچەی مەترسیدار</div>
            <p class="danger-text">سڕینەوەی دەنگ ناگەڕێتەوە.</p>
            <button type="button" class="btn btn--danger btn--full" @click="doDelete">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                <path d="M10 11v6M14 11v6"/>
              </svg>
              سڕینەوەی ئەم دەنگە
            </button>
          </section>

        </aside>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, defineComponent, h, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/api.js'

/* ── Inline TagInput (same as your ImageCollectionEditor) ── */
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

/* ── Setup ── */
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
let _keyCounter    = 0

const form = reactive({
  soundType: '',
  trackState: 'SINGLE',
  contentLanguages: ['CKB'],
  coverUrl: '',
  ckbContent: { title: '', description: '', reading: '' },
  kmrContent: { title: '', description: '', reading: '' },
  director: '',
  isThisProjectOfInstitute: false,
  locations: [],
  tagsCkb: [], tagsKmr: [],
  keywordsCkb: [], keywordsKmr: [],
  files: [],
})

/* ── Files requirement label ── */
const fileCount = computed(() => form.files.length)
const fileReqLabel = computed(() => {
  if (!form.trackState) return ''
  const count = form.files.length
  if (form.trackState === 'SINGLE') return count === 1 ? '✓ ١ فایل' : `${count}/١`
  return count >= 1 ? `✓ ${count} فایل` : '١ یان زیاتر'
})
const fileReqClass = computed(() => {
  const count = form.files.length
  const ok = (form.trackState === 'SINGLE' && count === 1) || (form.trackState === 'MULTI' && count >= 1)
  return ok ? 'album-req--ok' : 'album-req--warn'
})

/* ── File item management ── */
const makeFileItem = (useUrl=false) => ({
  _key: ++_keyCounter,
  useUrl,
  file: null,
  fileUrl: '',
  externalUrl: '',
  embedUrl: '',
  fileType: 'OTHER',
  durationSeconds: 0,
  sizeBytes: 0,
  readerName: '',
})

const addFile = (useUrl=false) => {
  if (form.trackState === 'SINGLE' && form.files.length >= 1) return
  form.files.push(makeFileItem(useUrl))
}
const removeFile = (idx) => { form.files.splice(idx, 1) }
const moveUp = (idx) => {
  if (idx <= 0) return
  const t = form.files[idx-1]
  form.files[idx-1] = form.files[idx]
  form.files[idx] = t
}
const moveDown = (idx) => {
  if (idx >= form.files.length - 1) return
  const t = form.files[idx+1]
  form.files[idx+1] = form.files[idx]
  form.files[idx] = t
}

const onAudioFile = (e, idx) => {
  const f = e.target.files?.[0]
  if (!f) return
  form.files[idx].file = f
  form.files[idx].sizeBytes = f.size || 0
  // try to infer type from extension (best-effort)
  const name = (f.name || '').toLowerCase()
  if (name.endsWith('.mp3')) form.files[idx].fileType = 'MP3'
  else if (name.endsWith('.wav')) form.files[idx].fileType = 'WAV'
  else if (name.endsWith('.ogg')) form.files[idx].fileType = 'OGG'
  else if (name.endsWith('.aac')) form.files[idx].fileType = 'AAC'
  else if (name.endsWith('.flac')) form.files[idx].fileType = 'FLAC'
  else form.files[idx].fileType = 'OTHER'
}

const previewUrl = (item) => item?.useUrl ? (item.fileUrl || '') : ''

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

/* ── Load existing (no GET by id, so same trick as your Image editor) ── */
const loadTrack = async () => {
  if (!isEdit.value) return
  fetching.value = true
  try {
    const { data } = await api.get('/api/v1/soundtracks')
    const all = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : [])
    const found = all.find(x => String(x.id) === String(route.params.id))
    if (found) applyTrack(found)
    else showToast('error', 'دەنگەکە نەدۆزرایەوە')
  } catch (e) {
    showToast('error', 'داتا هێنان سەرنەکەوت: ' + (e?.response?.data?.message || e.message))
  } finally {
    fetching.value = false
  }
}

const applyTrack = (t) => {
  form.soundType = t.soundType || ''
  form.trackState = t.trackState || 'SINGLE'
  form.contentLanguages = [...(t.contentLanguages || ['CKB'])]
  activeLang.value = form.contentLanguages[0] || 'CKB'

  form.coverUrl = t.coverUrl || ''
  form.director = t.director || ''
  form.isThisProjectOfInstitute = !!(t.thisProjectOfInstitute ?? t.isThisProjectOfInstitute ?? false)
  form.locations = [...(t.locations || [])]

  if (t.ckbContent) Object.assign(form.ckbContent, {
    title: t.ckbContent.title || '',
    description: t.ckbContent.description || '',
    reading: t.ckbContent.reading || '',
  })
  if (t.kmrContent) Object.assign(form.kmrContent, {
    title: t.kmrContent.title || '',
    description: t.kmrContent.description || '',
    reading: t.kmrContent.reading || '',
  })

  form.tagsCkb = [...(t.tags?.ckb || [])]
  form.tagsKmr = [...(t.tags?.kmr || [])]
  form.keywordsCkb = [...(t.keywords?.ckb || [])]
  form.keywordsKmr = [...(t.keywords?.kmr || [])]

  // existing files come as URLs
  form.files = (t.files || []).map(f => ({
    _key: ++_keyCounter,
    useUrl: true,
    file: null,
    fileUrl: f.fileUrl || '',
    externalUrl: f.externalUrl || '',
    embedUrl: f.embedUrl || '',
    fileType: f.fileType || 'OTHER',
    durationSeconds: Number(f.durationSeconds || 0),
    sizeBytes: Number(f.sizeBytes || 0),
    readerName: f.readerName || '',
  }))
}

/* ── Validation ── */
const validate = () => {
  const e = {}

  if (!form.soundType) e.soundType = 'جۆری دەنگ پێویستە'
  if (!form.trackState) e.trackState = 'TrackState پێویستە'
  if (!form.contentLanguages.length) e.contentLanguages = 'کەمی یەک زمانیکی هەڵبژێرە'

  // Title requirement based on active languages
  if (form.contentLanguages.includes('CKB') && !form.ckbContent.title.trim()) e.titles = 'ناونیشانی سۆرانی پێویستە'
  if (form.contentLanguages.includes('KMR') && !form.kmrContent.title.trim()) e.titles = 'ناونیشانی کورمانجی پێویستە'

  // Files requirement (UI-enforced)
  const count = form.files.length
  if (form.trackState === 'SINGLE' && count !== 1) e.files = 'SINGLE پێویستی بە تەنها ١ فایلە'
  if (form.trackState === 'MULTI' && count < 1) e.files = 'کەمی ١ فایل پێویستە'

  // each url item must have at least one url, each upload item must have file
  form.files.forEach((it, i) => {
    if (it.useUrl) {
      if (!it.fileUrl.trim() && !it.externalUrl.trim() && !it.embedUrl.trim()) {
        e.files = `فایل #${i+1}: پێویستە fileUrl یان externalUrl یان embedUrl بنووسیت`
      }
    } else {
      if (!it.file) e.files = `فایل #${i+1}: فایلێک هەڵبژێرە`
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
    const uploadItems = form.files.filter(f => !f.useUrl && f.file)
    const urlItems    = form.files.filter(f => f.useUrl)

    const dto = {
      soundType: form.soundType,
      trackState: form.trackState,
      contentLanguages: form.contentLanguages,
      ckbContent: form.contentLanguages.includes('CKB') ? {
        title: form.ckbContent.title || null,
        description: form.ckbContent.description || null,
        reading: form.ckbContent.reading || null,
      } : null,
      kmrContent: form.contentLanguages.includes('KMR') ? {
        title: form.kmrContent.title || null,
        description: form.kmrContent.description || null,
        reading: form.kmrContent.reading || null,
      } : null,

      locations: form.locations,
      director: form.director || null,
      isThisProjectOfInstitute: !!form.isThisProjectOfInstitute,

      tags: {
        ckb: form.contentLanguages.includes('CKB') ? form.tagsCkb : [],
        kmr: form.contentLanguages.includes('KMR') ? form.tagsKmr : [],
      },
      keywords: {
        ckb: form.contentLanguages.includes('CKB') ? form.keywordsCkb : [],
        kmr: form.contentLanguages.includes('KMR') ? form.keywordsKmr : [],
      },

      // readerNames for uploads (service uses this list to map file index → reader name)
      readerNames: uploadItems.map(x => x.readerName || null),

      // link files
      files: urlItems.map(x => ({
        fileUrl: x.fileUrl || null,
        externalUrl: x.externalUrl || null,
        embedUrl: x.embedUrl || null,
        fileType: x.fileType || 'OTHER',
        durationSeconds: Number(x.durationSeconds || 0),
        sizeBytes: Number(x.sizeBytes || 0),
        readerName: x.readerName || null,
      })),
    }

    const fd = new FormData()
    fd.append('data', new Blob([JSON.stringify(dto)], { type: 'application/json' }))

    // cover file (optional) - backend expects "coverImage"
    if (coverFile.value) fd.append('coverImage', coverFile.value)

    // audio files (optional) - backend expects "audioFiles"
    uploadItems.forEach(x => fd.append('audioFiles', x.file))

    const cfg = { headers: { 'Content-Type': 'multipart/form-data' } }

    if (isEdit.value) {
      await api.put(`/api/v1/soundtracks/${route.params.id}`, fd, cfg)
    } else {
      await api.post('/api/v1/soundtracks', fd, cfg)
    }

    showToast('success', isEdit.value ? 'دەنگەکە نوێکرایەوە ✓' : 'دەنگەکە دروستکرا ✓')
    setTimeout(() => router.push('/admin/soundtracks'), 1200)

  } catch (e) {
    showToast('error', e?.response?.data?.message || e.message || 'هەڵەیەک ڕوویدا')
  } finally {
    saving.value = false
  }
}

const doDelete = async () => {
  if (!confirm(`دڵنیای لە سڕینەوەی دەنگ #${route.params.id}؟`)) return
  try {
    await api.delete(`/api/v1/soundtracks/${route.params.id}`)
    showToast('success', 'دەنگەکە سڕایەوە')
    setTimeout(() => router.push('/admin/soundtracks'), 800)
  } catch (e) {
    showToast('error', e?.response?.data?.message || 'سڕینەوە سەرنەکەوت')
  }
}

const showToast = (type, msg) => {
  toast.value = { show: true, type, msg }
  setTimeout(() => { toast.value.show = false }, 4000)
}

/* ── Keep SINGLE clean ── */
watch(() => form.trackState, (v) => {
  if (v === 'SINGLE' && form.files.length > 1) {
    form.files.splice(1) // keep first only
    showToast('error', 'SINGLE تەنها ١ فایل دەهێڵێت — زیادەکان سڕانەوە')
  }
})

onMounted(() => {
  // default one file row for create
  if (!isEdit.value && !form.files.length) addFile(false)
  loadTrack()
})
</script>

<style scoped>
.ste { direction:rtl; max-width:1280px; margin:0 auto; }
.ste__head { display:flex; align-items:center; gap:1.25rem; margin-bottom:1.5rem; flex-wrap:wrap; }
.ste__back { display:inline-flex; align-items:center; gap:.4rem; color:var(--muted); text-decoration:none; font-weight:600; font-size:.87rem; padding:.4rem .7rem; border-radius:8px; border:1px solid var(--border); background:var(--white); transition:var(--transition); }
.ste__back:hover { color:var(--crimson); border-color:var(--crimson); }
.ste__title { font-size:1.4rem; font-weight:700; color:var(--text); }
.ste__sub { font-size:.8rem; color:var(--muted); margin-top:.1rem; }

.toast { display:flex; align-items:center; gap:.65rem; padding:.8rem 1.1rem; border-radius:var(--radius-sm); font-weight:600; font-size:.88rem; margin-bottom:1rem; }
.toast__ico { font-size:1rem; }
.toast--success { background:rgba(25,130,80,.1); border:1px solid rgba(25,130,80,.25); color:#186048; }
.toast--error   { background:rgba(180,40,40,.08); border:1px solid rgba(180,40,40,.2); color:var(--crimson); }
.toast-enter-active,.toast-leave-active { transition:.3s ease; }
.toast-enter-from,.toast-leave-to { opacity:0; transform:translateY(-6px); }

.loading-bar { height:3px; border-radius:2px; margin-bottom:.75rem; background:linear-gradient(90deg,var(--crimson),var(--gold),var(--crimson)); background-size:200% 100%; animation:shimmer 1.2s linear infinite; }
@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

.ste__layout { display:grid; grid-template-columns:1fr 320px; gap:1.25rem; align-items:start; }
@media (max-width:900px) { .ste__layout { grid-template-columns:1fr; } }

.card { background:var(--white); border:1px solid var(--border); border-radius:var(--radius-md); padding:1.35rem; box-shadow:var(--shadow-sm); margin-bottom:1.25rem; }
.card--danger { border-color:rgba(140,21,21,.18); }
.card--files { padding-bottom:.9rem; }

.card__hd { display:flex; align-items:center; gap:.6rem; font-weight:700; font-size:.95rem; color:var(--text); margin-bottom:1.1rem; padding-bottom:.75rem; border-bottom:1px solid var(--cream-dk); flex-wrap:wrap; }
.card__hd--danger { color:var(--crimson); border-bottom-color:rgba(140,21,21,.1); }
.card__hd-ico { font-size:1rem; }
.card__hd-badge { margin-right:auto; background:var(--cream-dk); border:1px solid var(--border); border-radius:99px; padding:.1rem .6rem; font-size:.78rem; color:var(--muted); }
.danger-text { font-size:.84rem; color:var(--muted); margin-bottom:.85rem; line-height:1.65; }

.album-req { display:inline-flex; padding:.15rem .55rem; border-radius:99px; font-size:.72rem; font-weight:700; }
.album-req--ok   { background:rgba(39,174,96,.1); color:#186040; border:1px solid rgba(39,174,96,.25); }
.album-req--warn { background:rgba(243,156,18,.1); color:#8c5f00; border:1px solid rgba(243,156,18,.28); }

/* Type picks */
.type-picks { display:grid; grid-template-columns:repeat(2,1fr); gap:.75rem; }
@media (max-width:600px) { .type-picks { grid-template-columns:1fr; } }
.type-pick { display:flex; flex-direction:column; align-items:center; gap:.4rem; padding:.9rem .75rem; border-radius:var(--radius-sm); border:1.5px solid var(--border); cursor:pointer; transition:var(--transition); text-align:center; user-select:none; }
.type-pick input { display:none; }
.type-pick:hover { border-color:var(--crimson); }
.type-pick--on { background:rgba(140,21,21,.05); border-color:var(--crimson); box-shadow:0 0 0 3px rgba(140,21,21,.08); }
.type-pick__icon { font-size:1.1rem; }
.type-pick__label { font-size:.9rem; font-weight:800; color:var(--text); }
.type-pick__hint  { font-size:.73rem; color:var(--muted); }

/* State picks */
.state-picks { display:flex; gap:.75rem; flex-wrap:wrap; }
.state-pick { display:inline-flex; align-items:center; gap:.5rem; padding:.65rem 1rem; border-radius:var(--radius-sm); border:1.5px solid var(--border); cursor:pointer; transition:var(--transition); font-weight:700; user-select:none; }
.state-pick input { display:none; }
.state-pick:hover { border-color:var(--crimson); }
.state-pick--on { background:rgba(140,21,21,.06); border-color:var(--crimson); color:var(--crimson); }
.state-pick__code { font-size:.75rem; font-weight:900; opacity:.6; }

/* Lang picks */
.lang-picks { display:flex; gap:.75rem; flex-wrap:wrap; }
.lang-pick { display:inline-flex; align-items:center; gap:.5rem; padding:.65rem 1rem; border-radius:var(--radius-sm); border:1.5px solid var(--border); cursor:pointer; transition:var(--transition); font-weight:700; user-select:none; }
.lang-pick input { display:none; }
.lang-pick:hover { border-color:var(--crimson); }
.lang-pick--on { background:rgba(140,21,21,.06); border-color:var(--crimson); color:var(--crimson); }
.lang-pick__code { font-size:.75rem; font-weight:900; opacity:.6; }

/* Tabs */
.tabs { display:flex; gap:.4rem; margin-bottom:1.1rem; border-bottom:1px solid var(--border); }
.tab { display:inline-flex; align-items:center; gap:.4rem; padding:.6rem 1rem; border-radius:8px 8px 0 0; border:1px solid transparent; border-bottom:none; background:none; color:var(--muted); font-weight:800; font-size:.88rem; cursor:pointer; transition:var(--transition); margin-bottom:-1px; font-family:inherit; }
.tab--on { background:var(--white); border-color:var(--border); color:var(--crimson); }
.tab__pip { width:7px; height:7px; border-radius:50%; }
.tab__pip--ckb { background:#c8a800; }
.tab__pip--kmr { background:#4a7af0; }

.field { display:flex; flex-direction:column; gap:.4rem; margin-bottom:.95rem; }
.lbl { font-weight:800; font-size:.83rem; color:var(--text); }
.lbl--sm { font-size:.77rem; }
.lbl--req::after { content:' *'; color:var(--crimson); }

.two-grid { display:grid; grid-template-columns:1fr 1fr; gap:.9rem; }
.two-grid--sm { gap:.6rem; }
@media (max-width:600px) { .two-grid { grid-template-columns:1fr; } }

.inp { border:1.5px solid var(--border); border-radius:var(--radius-sm); padding:.7rem .9rem; background:var(--cream); color:var(--text); font-size:.9rem; outline:none; transition:var(--transition); width:100%; font-family:inherit; }
.inp:focus { background:var(--white); border-color:var(--crimson); box-shadow:0 0 0 3px rgba(140,21,21,.1); }
.inp--sm { padding:.5rem .7rem; font-size:.85rem; }
.ta { min-height:120px; resize:vertical; }

.err { font-size:.78rem; color:#c0392b; font-weight:700; }
.err--album { margin-bottom:.85rem; padding:.6rem .85rem; background:rgba(192,57,43,.06); border:1px solid rgba(192,57,43,.2); border-radius:var(--radius-sm); }

/* Toggle */
.toggle { width:100%; display:inline-flex; align-items:center; gap:.6rem; padding:.7rem .9rem; border-radius:var(--radius-sm); border:1.5px solid var(--border); background:var(--cream); color:var(--muted); cursor:pointer; transition:var(--transition); font-weight:900; font-family:inherit; justify-content:center; }
.toggle:hover { border-color:rgba(140,21,21,.35); }
.toggle--on { background:rgba(22,120,70,.09); border-color:rgba(22,120,70,.25); color:#166044; }
.toggle__dot { width:10px; height:10px; border-radius:50%; background:var(--border); }
.toggle--on .toggle__dot { background:#22a06b; }

/* Files builder */
.files-list { display:flex; flex-direction:column; gap:.85rem; margin-bottom:1rem; }
.file-item { border:1.5px solid var(--border); border-radius:var(--radius-sm); background:var(--cream); overflow:hidden; transition:border-color .2s ease; }
.file-item:hover { border-color:rgba(140,21,21,.3); }
.file-item__head { display:flex; align-items:center; gap:.5rem; padding:.6rem .85rem; background:var(--cream-dk); border-bottom:1px solid var(--border); flex-wrap:wrap; }
.file-item__num { width:24px; height:24px; border-radius:50%; background:var(--crimson); color:#fff; font-size:.72rem; font-weight:900; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.file-item__del { margin-right:auto; width:26px; height:26px; border-radius:6px; background:none; border:1px solid var(--border); color:var(--muted); cursor:pointer; display:flex; align-items:center; justify-content:center; transition:var(--transition); flex-shrink:0; }
.file-item__del:hover { background:rgba(140,21,21,.08); border-color:var(--crimson); color:var(--crimson); }
.file-item__body { padding:.75rem .85rem; border-bottom:1px solid var(--border); }
.file-item__meta { padding:.75rem .85rem; }

.mini-btn { width:26px; height:26px; border-radius:8px; border:1px solid var(--border); background:var(--white); color:var(--muted); cursor:pointer; font-weight:900; transition:var(--transition); }
.mini-btn:hover:not(:disabled) { border-color:var(--crimson); color:var(--crimson); }
.mini-btn:disabled { opacity:.35; cursor:default; }

/* Source toggle */
.src-toggle { display:flex; border-radius:8px; overflow:hidden; border:1px solid var(--border); flex-shrink:0; }
.src-btn { display:inline-flex; align-items:center; gap:.35rem; padding:.35rem .65rem; background:none; border:none; color:var(--muted); font-size:.76rem; font-weight:900; cursor:pointer; font-family:inherit; transition:var(--transition); white-space:nowrap; }
.src-btn + .src-btn { border-right:1px solid var(--border); }
.src-btn--on { background:var(--crimson); color:#fff; }

.upload-zone { border:2px dashed var(--border); border-radius:var(--radius-sm); cursor:pointer; transition:var(--transition); display:block; margin-bottom:.75rem; }
.upload-zone:hover { border-color:var(--crimson); background:rgba(140,21,21,.03); }
.upload-zone--sm .upload-zone__inner { padding:1.25rem; }
.upload-zone__inner { display:flex; flex-direction:column; align-items:center; gap:.5rem; padding:1.75rem 1rem; color:var(--muted); font-size:.87rem; text-align:center; cursor:pointer; }
.upload-zone--inline { margin-bottom:0; }
.upload-zone__inner--inline { padding:1.1rem 1rem; }

.mini-preview { border:1px solid var(--border); border-radius:10px; background:var(--white); padding:.35rem; }
.mini-preview__empty { padding:.55rem; color:var(--muted); text-align:center; font-weight:800; font-size:.8rem; }

/* Empty + actions */
.album-empty { display:flex; flex-direction:column; align-items:center; gap:.65rem; padding:2.5rem 1rem; color:var(--muted); font-size:.87rem; text-align:center; border:2px dashed var(--border); border-radius:var(--radius-sm); margin-bottom:1rem; }
.album-actions { display:flex; gap:.6rem; flex-wrap:wrap; padding-top:.25rem; }

/* Cover preview */
.cover-preview { position:relative; border-radius:var(--radius-sm); overflow:hidden; border:1px solid var(--border); margin-bottom:.75rem; }
.cover-preview img { width:100%; max-height:200px; object-fit:cover; display:block; }
.cover-preview__remove { position:absolute; top:.5rem; left:.5rem; width:28px; height:28px; border-radius:50%; background:rgba(0,0,0,.55); color:#fff; border:none; cursor:pointer; font-size:.85rem; display:flex; align-items:center; justify-content:center; }

/* Buttons */
.btn { display:inline-flex; align-items:center; justify-content:center; gap:.45rem; padding:.7rem 1.1rem; border-radius:var(--radius-sm); font-weight:900; font-size:.88rem; cursor:pointer; border:1px solid transparent; transition:var(--transition); text-decoration:none; white-space:nowrap; font-family:inherit; }
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

<!-- TagInput global styles (same as yours) -->
<style>
.tag-input { display:flex; flex-direction:column; gap:.4rem; }
.tag-input__tags { display:flex; flex-wrap:wrap; gap:.4rem; align-items:center; border:1.5px solid var(--border); border-radius:var(--radius-sm); padding:.45rem .65rem; background:var(--cream); min-height:42px; transition:border-color .2s; }
.tag-input__tags:focus-within { border-color:var(--crimson); background:var(--white); box-shadow:0 0 0 3px rgba(140,21,21,.1); }
.tag-input__tag { display:inline-flex; align-items:center; gap:.3rem; padding:.2rem .55rem; border-radius:6px; font-size:.8rem; font-weight:700; }
.tag-input__tag--default { background:var(--cream-dk); border:1px solid var(--border); color:var(--text); }
.tag-input__tag--gold { background:rgba(254,221,0,.2); border:1px solid rgba(254,221,0,.4); color:#807000; }
.tag-input__tag--blue { background:rgba(30,80,200,.1); border:1px solid rgba(30,80,200,.2); color:#1840a0; }
.tag-input__tag button { background:none; border:none; cursor:pointer; color:inherit; opacity:.6; font-size:.75rem; line-height:1; }
.tag-input__tag button:hover { opacity:1; }
.tag-input__inp { border:none; outline:none; background:none; font-family:inherit; font-size:.88rem; min-width:120px; color:var(--text); }
</style>
