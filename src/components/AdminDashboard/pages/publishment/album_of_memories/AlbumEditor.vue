<template>
  <div class="aed" dir="rtl">

    <!-- Header -->
    <div class="aed__head">
      <RouterLink to="/admin/albums" class="aed__back">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5M12 5l-7 7 7 7"/>
        </svg>
        گەڕانەوە
      </RouterLink>
      <div>
        <h1 class="aed__title">{{ isEdit ? 'دەستکاری ئەڵبووم' : 'ئەڵبوومی نوێ' }}</h1>
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

    <form @submit.prevent="submit" novalidate>
      <div class="aed__layout">

        <!-- ==================== MAIN COLUMN ==================== -->
        <div class="col-main">

          <!-- Language selector -->
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
                <span class="lang-pick__code">CKB</span>
              </label>
              <label class="lang-pick" :class="{ 'lang-pick--on': form.contentLanguages.includes('KMR') }">
                <input type="checkbox" value="KMR" v-model="form.contentLanguages" />
                <span class="lang-pick__flag">🔵</span>
                کورمانجی
                <span class="lang-pick__code">KMR</span>
              </label>
            </div>
            <div v-if="errors.contentLanguages" class="err">{{ errors.contentLanguages }}</div>
          </section>

          <!-- Bilingual content tabs -->
          <section class="card" v-if="form.contentLanguages.length">
            <div class="tabs">
              <button
                v-for="lang in form.contentLanguages" :key="lang"
                type="button" class="tab"
                :class="{ 'tab--on': activeLang === lang }"
                @click="activeLang = lang"
              >
                <span class="tab__pip" :class="`tab__pip--${lang.toLowerCase()}`"></span>
                {{ lang === 'CKB' ? 'سۆرانی (CKB)' : 'کورمانجی (KMR)' }}
              </button>
            </div>

            <!-- CKB -->
            <div v-show="activeLang === 'CKB'" class="tab-panel">
              <div class="field">
                <label class="lbl lbl--req">ناونیشانی سۆرانی</label>
                <input v-model="form.ckbContent.title" class="inp" :class="{ 'inp--err': errors.ckbTitle }" placeholder="ناونیشانی ئەڵبووم بە سۆرانی…" />
                <div v-if="errors.ckbTitle" class="err">{{ errors.ckbTitle }}</div>
              </div>
              <div class="field">
                <label class="lbl">وەسف</label>
                <textarea v-model="form.ckbContent.description" class="inp ta" placeholder="وەسفی ئەڵبووم بە سۆرانی…"></textarea>
              </div>
              <div class="field">
                <label class="lbl">شوێن</label>
                <input v-model="form.ckbContent.location" class="inp" placeholder="شوێن یان ناوچەی تۆمارکردن…" />
              </div>
              <div class="field">
                <label class="lbl">تاگەکان (CKB)</label>
                <TagInput v-model="form.tagsCkb" placeholder="تاگی نوێ زیاد بکە — ئینتەر" color="gold" />
              </div>
              <div class="field">
                <label class="lbl">کیووەردەکان (CKB)</label>
                <TagInput v-model="form.keywordsCkb" placeholder="کیووەردی نوێ" color="blue" />
              </div>
            </div>

            <!-- KMR -->
            <div v-show="activeLang === 'KMR'" class="tab-panel">
              <div class="field">
                <label class="lbl lbl--req">ناونیشانی کورمانجی</label>
                <input v-model="form.kmrContent.title" class="inp" :class="{ 'inp--err': errors.kmrTitle }" placeholder="ناونیشانی ئەڵبووم بە کورمانجی…" />
                <div v-if="errors.kmrTitle" class="err">{{ errors.kmrTitle }}</div>
              </div>
              <div class="field">
                <label class="lbl">وەسف</label>
                <textarea v-model="form.kmrContent.description" class="inp ta" placeholder="وەسفی ئەڵبووم بە کورمانجی…"></textarea>
              </div>
              <div class="field">
                <label class="lbl">شوێن</label>
                <input v-model="form.kmrContent.location" class="inp" placeholder="شوێن یان ناوچەی تۆمارکردن…" />
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

          <!-- ==================== TRACKS / MEDIA ==================== -->
          <section class="card">
            <div class="card__hd">
              <span class="card__hd-ico">🎵</span>
              تراکەکان
              <span class="card__hd-badge">{{ form.tracks.length }}</span>
            </div>

            <!-- Track list -->
            <div class="track-editor-list" v-if="form.tracks.length">
              <div class="track-editor-item" v-for="(t, idx) in form.tracks" :key="idx">
                <div class="track-editor-item__num">{{ idx + 1 }}</div>
                <div class="track-editor-item__fields">
                  <div class="track-row">
                    <div class="field field--inline">
                      <label class="lbl">ناوی تراک (CKB)</label>
                      <input v-model="t.trackTitleCkb" class="inp inp--sm" placeholder="ناوی تراک بە سۆرانی…" />
                    </div>
                    <div class="field field--inline">
                      <label class="lbl">ناوی تراک (KMR)</label>
                      <input v-model="t.trackTitleKmr" class="inp inp--sm" placeholder="ناوی تراک بە کورمانجی…" />
                    </div>
                  </div>
                  <div class="track-row">
                    <div class="field field--inline">
                      <label class="lbl">ژمارەی تراک</label>
                      <input v-model.number="t.trackNumber" type="number" class="inp inp--sm" placeholder="#" min="1" />
                    </div>
                    <div class="field field--inline">
                      <label class="lbl">ماوە (چرکە)</label>
                      <input v-model.number="t.durationSeconds" type="number" class="inp inp--sm" placeholder="بڕوانە: 214" min="0" />
                    </div>
                  </div>
                  <div class="field">
                    <label class="lbl">URL ی فایل (S3 / CDN)</label>
                    <input v-model="t.url" class="inp inp--sm" placeholder="https://cdn.example.com/track.mp3" />
                  </div>
                  <div class="field">
                    <label class="lbl">بەستەری دەرەکی (External URL)</label>
                    <input v-model="t.externalUrl" class="inp inp--sm" placeholder="https://soundcloud.com/…" />
                  </div>
                  <div class="field">
                    <label class="lbl">بەستەری Embed</label>
                    <input v-model="t.embedUrl" class="inp inp--sm" placeholder="https://w.soundcloud.com/player/…" />
                  </div>
                </div>
                <button type="button" class="track-del-btn" @click="removeTrack(idx)" title="سڕینەوەی تراک">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
            </div>

            <!-- Upload zone for track files -->
            <div
              class="upload-zone"
              @dragover.prevent="trackDragOver = true"
              @dragleave="trackDragOver = false"
              @drop.prevent="onTrackDrop"
              :class="{ 'upload-zone--over': trackDragOver }"
            >
              <label class="upload-zone__inner">
                <input type="file" multiple accept="audio/*,video/*,.mp3,.mp4,.wav,.ogg,.flac,.aac,.m4a" @change="onTrackFiles" style="display:none;" />
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
                <span>فایلی دەنگ / ڤیدیۆ بکێشە یان کلیک بکە</span>
                <span class="upload-zone__hint">MP3، MP4، WAV، OGG، FLAC، AAC پشتگیریکراوە</span>
              </label>
            </div>

            <!-- Pending track files -->
            <div class="file-list" v-if="newTrackFiles.length">
              <div class="file-chip" v-for="(f, i) in newTrackFiles" :key="i">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
                {{ f.name }}
                <button type="button" @click="removeNewTrackFile(i)">✕</button>
              </div>
            </div>

            <button type="button" class="btn btn--outline btn--sm" @click="addTrackItem">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              تراکی دستی زیاد بکە (URL)
            </button>
          </section>

          <!-- ==================== ATTACHMENT ==================== -->
          <section class="card">
            <div class="card__hd">
              <span class="card__hd-ico">📎</span>
              پاوانتەکە (Attachment)
              <span class="card__hd-hint">پڕۆگرامی ئەڵبووم، PDF، ڤیدیۆی رەکلامی…</span>
            </div>

            <div class="attach-upload-row">
              <label class="upload-zone upload-zone--sm upload-zone--attach" v-if="!attachFile">
                <input type="file" accept=".pdf,.mp4,.mp3,.doc,.docx,video/*" @change="onAttachFile" style="display:none;" />
                <div class="upload-zone__inner">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/></svg>
                  <span>هەڵبژاردنی فایل</span>
                </div>
              </label>
              <div v-else class="attach-preview">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/></svg>
                <span>{{ attachFile.name }}</span>
                <button type="button" @click="attachFile = null">✕</button>
              </div>
            </div>

            <div class="field" style="margin-top:.75rem;">
              <label class="lbl">یان URL ی پاوانتەکە</label>
              <input v-model="form.attachmentUrl" class="inp" placeholder="https://…" :disabled="!!attachFile" />
            </div>
            <div class="field">
              <label class="lbl">بەستەری دەرەکی (External URL)</label>
              <input v-model="form.attachmentExternalUrl" class="inp" placeholder="https://…" />
            </div>
            <div class="field">
              <label class="lbl">بەستەری Embed</label>
              <input v-model="form.attachmentEmbedUrl" class="inp" placeholder="https://…" />
            </div>
            <div class="field">
              <label class="lbl">جۆری فایل</label>
              <input v-model="form.attachmentType" class="inp" placeholder="pdf, mp4, mp3…" style="max-width:160px;" />
            </div>
          </section>

        </div>

        <!-- ==================== SIDE COLUMN ==================== -->
        <aside class="col-side">

          <!-- Album Type -->
          <section class="card">
            <div class="card__hd"><span class="card__hd-ico">🎚</span> جۆری ئەڵبووم</div>
            <div class="type-toggle">
              <button
                type="button" class="type-btn"
                :class="{ 'type-btn--on type-btn--audio': form.albumType === 'AUDIO' }"
                @click="form.albumType = 'AUDIO'"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
                دەنگ (AUDIO)
              </button>
              <button
                type="button" class="type-btn"
                :class="{ 'type-btn--on type-btn--video': form.albumType === 'VIDEO' }"
                @click="form.albumType = 'VIDEO'"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
                ڤیدیۆ (VIDEO)
              </button>
            </div>
            <div v-if="errors.albumType" class="err" style="margin-top:.5rem;">{{ errors.albumType }}</div>
          </section>

          <!-- Three Covers -->
          <section class="card">
            <div class="card__hd"><span class="card__hd-ico">🖼</span> کڤەرەکان</div>

            <!-- CKB Cover -->
            <div class="cover-block">
              <div class="cover-block__lbl">
                <span class="lang-chip lang-chip--ckb">CKB</span>
                کڤەری سۆرانی
              </div>
              <div class="cover-preview" v-if="coverPreviewCkb || form.coverUrlCkb">
                <img :src="coverPreviewCkb || form.coverUrlCkb" alt="CKB cover" />
                <button type="button" class="cover-preview__remove" @click="removeCover('ckb')">✕</button>
              </div>
              <label class="upload-zone upload-zone--sm" v-else>
                <input type="file" accept="image/*" @change="e => onCoverFile(e, 'ckb')" style="display:none;" />
                <div class="upload-zone__inner">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                  <span>هەڵبژاردن</span>
                </div>
              </label>
              <div class="field" style="margin-top:.5rem;">
                <input v-model="form.coverUrlCkb" class="inp inp--sm" placeholder="https://… (URL)" :disabled="!!coverFileCkb" />
              </div>
            </div>

            <!-- KMR Cover -->
            <div class="cover-block">
              <div class="cover-block__lbl">
                <span class="lang-chip lang-chip--kmr">KMR</span>
                کڤەری کورمانجی
              </div>
              <div class="cover-preview" v-if="coverPreviewKmr || form.coverUrlKmr">
                <img :src="coverPreviewKmr || form.coverUrlKmr" alt="KMR cover" />
                <button type="button" class="cover-preview__remove" @click="removeCover('kmr')">✕</button>
              </div>
              <label class="upload-zone upload-zone--sm" v-else>
                <input type="file" accept="image/*" @change="e => onCoverFile(e, 'kmr')" style="display:none;" />
                <div class="upload-zone__inner">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                  <span>هەڵبژاردن</span>
                </div>
              </label>
              <div class="field" style="margin-top:.5rem;">
                <input v-model="form.coverUrlKmr" class="inp inp--sm" placeholder="https://… (URL)" :disabled="!!coverFileKmr" />
              </div>
            </div>

            <!-- Hover Image -->
            <div class="cover-block">
              <div class="cover-block__lbl">
                <span class="hover-badge">Hover</span>
                وێنەی Hover ئیفێکت
              </div>
              <div class="cover-preview" v-if="coverPreviewHover || form.hoverUrl">
                <img :src="coverPreviewHover || form.hoverUrl" alt="Hover" />
                <button type="button" class="cover-preview__remove" @click="removeCover('hover')">✕</button>
              </div>
              <label class="upload-zone upload-zone--sm" v-else>
                <input type="file" accept="image/*" @change="e => onCoverFile(e, 'hover')" style="display:none;" />
                <div class="upload-zone__inner">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                  <span>هەڵبژاردن</span>
                </div>
              </label>
              <div class="field" style="margin-top:.5rem;">
                <input v-model="form.hoverUrl" class="inp inp--sm" placeholder="https://… (URL)" :disabled="!!coverFileHover" />
              </div>
            </div>
          </section>

          <!-- Album Metadata -->
          <section class="card">
            <div class="card__hd"><span class="card__hd-ico">⚙</span> زانیاری ئەڵبووم</div>
            <div class="field">
              <label class="lbl">ساڵی بڵاوکردنەوە</label>
              <input v-model.number="form.yearOfPublishment" type="number" class="inp" placeholder="بڕوانە: 2024" min="1900" max="2100" />
            </div>
            <div class="field">
              <label class="lbl">فۆرماتی فایل</label>
              <input v-model="form.fileFormat" class="inp" placeholder="mp3, mp4, wav…" />
            </div>
            <div class="two-col">
              <div class="field">
                <label class="lbl">ژمارەی CD</label>
                <input v-model.number="form.cdNumber" type="number" class="inp" placeholder="1" min="1" />
              </div>
              <div class="field">
                <label class="lbl">ژمارەی تراک</label>
                <input v-model.number="form.numberOfTracks" type="number" class="inp" placeholder="بڕوانە: 12" min="0" />
              </div>
            </div>
          </section>

          <!-- Submit -->
          <div class="side-actions">
            <button type="submit" class="btn btn--primary btn--full" :disabled="saving">
              <span v-if="saving" class="spinner"></span>
              {{ saving ? 'پاشەکەوتکردن…' : (isEdit ? 'پاشەکەوتکردنی گۆڕانکاری' : 'دروستکردنی ئەڵبووم') }}
            </button>
            <RouterLink to="/admin/albums" class="btn btn--ghost btn--full">هەڵوەشاندنەوە</RouterLink>
          </div>

          <!-- Danger Zone -->
          <section v-if="isEdit" class="card card--danger">
            <div class="card__hd card__hd--danger">
              <span class="card__hd-ico">⚠️</span>
              ناوچەی مەترسیدار
            </div>
            <p class="danger-text">سڕینەوەی ئەڵبووم ناگەڕێتەوە. هەموو تراکەکان و داتاکانی دەسڕێتەوە.</p>
            <button type="button" class="btn btn--danger btn--full" @click="doDelete">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>
              سڕینەوەی ئەم ئەڵبوومە
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

// ── Setup ──────────────────────────────────────────────────────────────────────
const route  = useRoute()
const router = useRouter()

const isEdit    = computed(() => !!route.params.id)
const activeLang = ref('CKB')
const fetching   = ref(false)
const saving     = ref(false)
const toast      = ref({ show: false, type: 'success', msg: '' })
const errors     = ref({})
const trackDragOver = ref(false)

// Cover files
const coverFileCkb   = ref(null)
const coverFileKmr   = ref(null)
const coverFileHover = ref(null)
const coverPreviewCkb   = ref('')
const coverPreviewKmr   = ref('')
const coverPreviewHover = ref('')

// Track files
const newTrackFiles = ref([])

// Attachment file
const attachFile = ref(null)

const form = reactive({
  contentLanguages: ['CKB'],
  albumType: 'AUDIO',
  fileFormat: '',
  cdNumber: null,
  numberOfTracks: null,
  yearOfPublishment: null,
  // Covers (URLs)
  coverUrlCkb: '',
  coverUrlKmr: '',
  hoverUrl: '',
  // Bilingual content
  ckbContent: { title: '', description: '', location: '' },
  kmrContent: { title: '', description: '', location: '' },
  // Tags / keywords
  tagsCkb: [], tagsKmr: [],
  keywordsCkb: [], keywordsKmr: [],
  // Tracks (manual URL entries)
  tracks: [],
  // Attachment
  attachmentUrl: '',
  attachmentExternalUrl: '',
  attachmentEmbedUrl: '',
  attachmentType: '',
})

// ── Load existing album ────────────────────────────────────────────────────────
const loadAlbum = async () => {
  if (!isEdit.value) return
  fetching.value = true
  try {
    const { data } = await api.get(`/api/v1/albums/${route.params.id}`)
    applyAlbum(data)
  } catch (e) {
    showToast('error', 'داتا هێنان سەرنەکەوت: ' + (e?.response?.data?.message || e.message))
  } finally { fetching.value = false }
}

const applyAlbum = (a) => {
  form.contentLanguages  = [...(a.contentLanguages || ['CKB'])]
  activeLang.value       = form.contentLanguages[0] || 'CKB'
  form.albumType         = a.albumType || 'AUDIO'
  form.fileFormat        = a.fileFormat || ''
  form.cdNumber          = a.cdNumber ?? null
  form.numberOfTracks    = a.numberOfTracks ?? null
  form.yearOfPublishment = a.yearOfPublishment ?? null
  form.coverUrlCkb       = a.coverUrlCkb || ''
  form.coverUrlKmr       = a.coverUrlKmr || ''
  form.hoverUrl          = a.hoverUrl || ''

  if (a.ckbContent) Object.assign(form.ckbContent, a.ckbContent)
  if (a.kmrContent) Object.assign(form.kmrContent, a.kmrContent)

  form.tagsCkb     = [...(a.tags?.ckb || [])]
  form.tagsKmr     = [...(a.tags?.kmr || [])]
  form.keywordsCkb = [...(a.keywords?.ckb || [])]
  form.keywordsKmr = [...(a.keywords?.kmr || [])]

  form.tracks = (a.media || []).map(m => ({
    id: m.id,
    trackNumber:   m.trackNumber ?? null,
    trackTitleCkb: m.trackTitleCkb || '',
    trackTitleKmr: m.trackTitleKmr || '',
    durationSeconds: m.durationSeconds ?? null,
    url:         m.url || '',
    externalUrl: m.externalUrl || '',
    embedUrl:    m.embedUrl || '',
    fileFormat:  m.fileFormat || '',
    fileSizeBytes: m.fileSizeBytes ?? null,
  }))

  if (a.attachment) {
    form.attachmentUrl         = a.attachment.url || ''
    form.attachmentExternalUrl = a.attachment.externalUrl || ''
    form.attachmentEmbedUrl    = a.attachment.embedUrl || ''
    form.attachmentType        = a.attachment.type || ''
  }
}

// ── Cover handling ─────────────────────────────────────────────────────────────
const onCoverFile = (e, key) => {
  const f = e.target.files?.[0]
  if (!f) return
  const preview = URL.createObjectURL(f)
  if (key === 'ckb')   { coverFileCkb.value   = f; coverPreviewCkb.value   = preview; form.coverUrlCkb = '' }
  if (key === 'kmr')   { coverFileKmr.value   = f; coverPreviewKmr.value   = preview; form.coverUrlKmr = '' }
  if (key === 'hover') { coverFileHover.value = f; coverPreviewHover.value = preview; form.hoverUrl    = '' }
}

const removeCover = (key) => {
  if (key === 'ckb')   { coverFileCkb.value   = null; coverPreviewCkb.value   = ''; form.coverUrlCkb = '' }
  if (key === 'kmr')   { coverFileKmr.value   = null; coverPreviewKmr.value   = ''; form.coverUrlKmr = '' }
  if (key === 'hover') { coverFileHover.value = null; coverPreviewHover.value = ''; form.hoverUrl    = '' }
}

// ── Track files ────────────────────────────────────────────────────────────────
const onTrackFiles   = (e)  => { newTrackFiles.value.push(...Array.from(e.target.files)) }
const onTrackDrop    = (e)  => { trackDragOver.value = false; newTrackFiles.value.push(...Array.from(e.dataTransfer.files)) }
const removeNewTrackFile = (i) => { newTrackFiles.value.splice(i, 1) }
const addTrackItem   = ()   => {
  form.tracks.push({
    trackNumber: form.tracks.length + 1,
    trackTitleCkb: '', trackTitleKmr: '',
    durationSeconds: null,
    url: '', externalUrl: '', embedUrl: '',
    fileFormat: '', fileSizeBytes: null,
  })
}
const removeTrack = (i) => { form.tracks.splice(i, 1) }

// ── Attachment file ────────────────────────────────────────────────────────────
const onAttachFile = (e) => { const f = e.target.files?.[0]; if (f) { attachFile.value = f; form.attachmentUrl = '' } }

// ── Validation ─────────────────────────────────────────────────────────────────
const validate = () => {
  const e = {}
  if (!form.contentLanguages.length) e.contentLanguages = 'کەمی یەک زمانیکی هەڵبژێرە'
  if (!form.albumType) e.albumType = 'جۆری ئەڵبووم پێویستە'
  if (form.contentLanguages.includes('CKB') && !form.ckbContent.title.trim()) e.ckbTitle = 'ناونیشانی سۆرانی پێویستە'
  if (form.contentLanguages.includes('KMR') && !form.kmrContent.title.trim()) e.kmrTitle = 'ناونیشانی کورمانجی پێویستە'
  errors.value = e
  return !Object.keys(e).length
}

// ── Submit ─────────────────────────────────────────────────────────────────────
const submit = async () => {
  if (!validate()) { window.scrollTo({ top: 0, behavior: 'smooth' }); return }
  saving.value = true

  const fd = new FormData()

  const dto = {
    contentLanguages:  form.contentLanguages,
    albumType:         form.albumType,
    fileFormat:        form.fileFormat || null,
    cdNumber:          form.cdNumber   || null,
    numberOfTracks:    form.numberOfTracks || null,
    yearOfPublishment: form.yearOfPublishment || null,
    coverUrlCkb: form.coverUrlCkb || null,
    coverUrlKmr: form.coverUrlKmr || null,
    hoverUrl:    form.hoverUrl    || null,
    ckbContent: form.contentLanguages.includes('CKB') ? form.ckbContent : null,
    kmrContent: form.contentLanguages.includes('KMR') ? form.kmrContent : null,
    tags: {
      ckb: form.tagsCkb,
      kmr: form.tagsKmr,
    },
    keywords: {
      ckb: form.keywordsCkb,
      kmr: form.keywordsKmr,
    },
    media: form.tracks.filter(t => t.url || t.externalUrl || t.embedUrl || t.trackTitleCkb || t.trackTitleKmr).map(t => ({
      id:            t.id || null,
      trackNumber:   t.trackNumber || null,
      trackTitleCkb: t.trackTitleCkb || null,
      trackTitleKmr: t.trackTitleKmr || null,
      durationSeconds: t.durationSeconds || null,
      url:         t.url || null,
      externalUrl: t.externalUrl || null,
      embedUrl:    t.embedUrl    || null,
      fileFormat:  t.fileFormat  || null,
      fileSizeBytes: t.fileSizeBytes || null,
    })),
    attachment: (form.attachmentUrl || form.attachmentExternalUrl || form.attachmentEmbedUrl) ? {
      url:         form.attachmentUrl         || null,
      externalUrl: form.attachmentExternalUrl || null,
      embedUrl:    form.attachmentEmbedUrl    || null,
      type:        form.attachmentType        || null,
    } : null,
  }

  fd.append('album', new Blob([JSON.stringify(dto)], { type: 'application/json' }))

  if (coverFileCkb.value)   fd.append('coverImageCkb', coverFileCkb.value)
  if (coverFileKmr.value)   fd.append('coverImageKmr', coverFileKmr.value)
  if (coverFileHover.value) fd.append('hoverImage',    coverFileHover.value)
  newTrackFiles.value.forEach(f => fd.append('mediaFiles', f))
  if (attachFile.value) fd.append('attachment', attachFile.value)

  try {
    if (isEdit.value) {
      await api.put(`/api/v1/albums/${route.params.id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
    } else {
      await api.post('/api/v1/albums', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
    }
    showToast('success', isEdit.value ? 'ئەڵبوومەکە نوێکرایەوە ✓' : 'ئەڵبوومەکە دروستکرا ✓')
    setTimeout(() => router.push('/admin/albums'), 1200)
  } catch (e) {
    showToast('error', e?.response?.data?.message || e.message || 'هەڵەیەک ڕوویدا')
  } finally { saving.value = false }
}

const doDelete = async () => {
  if (!confirm(`دڵنیای لە سڕینەوەی ئەڵبووم #${route.params.id}؟`)) return
  try {
    await api.delete(`/api/v1/albums/${route.params.id}`)
    showToast('success', 'ئەڵبوومەکە سڕایەوە')
    setTimeout(() => router.push('/admin/albums'), 800)
  } catch (e) { showToast('error', e?.response?.data?.message || 'سڕینەوە سەرنەکەوت') }
}

const showToast = (type, msg) => {
  toast.value = { show: true, type, msg }
  setTimeout(() => { toast.value.show = false }, 4000)
}

onMounted(loadAlbum)
</script>

<style scoped>
.aed { direction: rtl; max-width: 1280px; margin: 0 auto; }

/* Header */
.aed__head { display: flex; align-items: center; gap: 1.25rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
.aed__back { display: inline-flex; align-items: center; gap: .4rem; color: var(--muted); text-decoration: none; font-weight: 600; font-size: .87rem; padding: .4rem .7rem; border-radius: 8px; border: 1px solid var(--border); background: var(--white); transition: .2s; }
.aed__back:hover { color: var(--crimson); border-color: var(--crimson); }
.aed__title { font-size: 1.4rem; font-weight: 700; color: var(--text); }
.aed__sub { font-size: .8rem; color: var(--muted); margin-top: .1rem; }

/* Toast */
.toast { display: flex; align-items: center; gap: .65rem; padding: .8rem 1.1rem; border-radius: var(--radius-sm); font-weight: 600; font-size: .88rem; margin-bottom: 1rem; }
.toast__ico { font-size: 1rem; }
.toast--success { background: rgba(25,130,80,.1); border: 1px solid rgba(25,130,80,.25); color: #186048; }
.toast--error   { background: rgba(180,40,40,.08); border: 1px solid rgba(180,40,40,.2); color: var(--crimson); }
.toast-enter-active, .toast-leave-active { transition: .3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(-6px); }

/* Loading bar */
.loading-bar { height: 3px; border-radius: 2px; margin-bottom: .75rem; background: linear-gradient(90deg, var(--crimson), #f39c12, var(--crimson)); background-size: 200%; animation: shimmer 1.2s linear infinite; }
@keyframes shimmer { 0% { background-position: 200% 0 } 100% { background-position: -200% 0 } }

/* Layout */
.aed__layout { display: grid; grid-template-columns: 1fr 320px; gap: 1.25rem; align-items: start; }
@media (max-width: 900px) { .aed__layout { grid-template-columns: 1fr; } }

/* Card */
.card { background: var(--white); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 1.35rem; box-shadow: var(--shadow-sm); margin-bottom: 1.25rem; }
.card--danger { border-color: rgba(140,21,21,.18); }
.card__hd { display: flex; align-items: center; gap: .6rem; font-weight: 700; font-size: .95rem; color: var(--text); margin-bottom: 1.1rem; padding-bottom: .75rem; border-bottom: 1px solid var(--cream-dk); flex-wrap: wrap; }
.card__hd--danger { color: var(--crimson); border-bottom-color: rgba(140,21,21,.1); }
.card__hd-ico { font-size: 1rem; }
.card__hd-badge { margin-right: auto; background: var(--cream-dk); border: 1px solid var(--border); border-radius: 99px; padding: .1rem .6rem; font-size: .78rem; color: var(--muted); }
.card__hd-hint { font-size: .75rem; font-weight: 400; color: var(--muted); }
.danger-text { font-size: .84rem; color: var(--muted); margin-bottom: .85rem; line-height: 1.65; }

/* Language picks */
.lang-picks { display: flex; gap: .75rem; flex-wrap: wrap; }
.lang-pick { display: inline-flex; align-items: center; gap: .5rem; padding: .65rem 1rem; border-radius: var(--radius-sm); border: 1.5px solid var(--border); cursor: pointer; transition: .2s; font-weight: 600; user-select: none; }
.lang-pick input { display: none; }
.lang-pick:hover { border-color: var(--crimson); }
.lang-pick--on { background: rgba(140,21,21,.06); border-color: var(--crimson); color: var(--crimson); }
.lang-pick__code { font-size: .75rem; font-weight: 700; opacity: .6; }

/* Tabs */
.tabs { display: flex; gap: .4rem; margin-bottom: 1.1rem; border-bottom: 1px solid var(--border); padding-bottom: 0; }
.tab { display: inline-flex; align-items: center; gap: .4rem; padding: .6rem 1rem; border-radius: 8px 8px 0 0; border: 1px solid transparent; border-bottom: none; background: none; color: var(--muted); font-weight: 700; font-size: .88rem; cursor: pointer; transition: .2s; margin-bottom: -1px; font-family: inherit; }
.tab--on { background: var(--white); border-color: var(--border); color: var(--crimson); }
.tab__pip { width: 7px; height: 7px; border-radius: 50%; }
.tab__pip--ckb { background: #c8a800; }
.tab__pip--kmr { background: #4a7af0; }
.tab-panel { padding-top: .25rem; }

/* Fields */
.field { display: flex; flex-direction: column; gap: .4rem; margin-bottom: .95rem; }
.field--inline { flex: 1; }
.lbl { font-weight: 700; font-size: .83rem; color: var(--text); }
.lbl--req::after { content: ' *'; color: var(--crimson); }
.inp { border: 1.5px solid var(--border); border-radius: var(--radius-sm); padding: .7rem .9rem; background: var(--cream); color: var(--text); font-size: .9rem; outline: none; transition: .2s; width: 100%; font-family: inherit; box-sizing: border-box; }
.inp:focus { background: var(--white); border-color: var(--crimson); box-shadow: 0 0 0 3px rgba(140,21,21,.1); }
.inp--err { border-color: #c0392b; }
.inp--sm { padding: .5rem .7rem; font-size: .85rem; }
.ta { min-height: 130px; resize: vertical; }
.err { font-size: .78rem; color: #c0392b; font-weight: 600; }
.two-col { display: grid; grid-template-columns: 1fr 1fr; gap: .65rem; }

/* Track row */
.track-row { display: grid; grid-template-columns: 1fr 1fr; gap: .65rem; }
@media (max-width: 600px) { .track-row { grid-template-columns: 1fr; } }

/* Track editor */
.track-editor-list { display: flex; flex-direction: column; gap: .85rem; margin-bottom: 1rem; }
.track-editor-item { border: 1px solid var(--border); border-radius: var(--radius-sm); padding: .9rem; background: var(--cream); display: flex; gap: .75rem; align-items: flex-start; }
.track-editor-item__num { min-width: 26px; height: 26px; border-radius: 50%; background: var(--crimson); color: #fff; font-size: .75rem; font-weight: 800; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: .15rem; }
.track-editor-item__fields { flex: 1; min-width: 0; }
.track-del-btn { width: 28px; height: 28px; border-radius: 7px; background: none; border: 1px solid var(--border); color: var(--muted); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: .15s; flex-shrink: 0; margin-top: .1rem; }
.track-del-btn:hover { background: rgba(192,57,43,.08); border-color: #c0392b; color: #c0392b; }

/* Upload zone */
.upload-zone { border: 2px dashed var(--border); border-radius: var(--radius-sm); cursor: pointer; transition: .2s; display: block; margin-bottom: .75rem; }
.upload-zone:hover, .upload-zone--over { border-color: var(--crimson); background: rgba(140,21,21,.03); }
.upload-zone--sm .upload-zone__inner { padding: 1rem; }
.upload-zone--attach .upload-zone__inner { padding: .85rem 1rem; }
.upload-zone__inner { display: flex; flex-direction: column; align-items: center; gap: .5rem; padding: 1.5rem 1rem; color: var(--muted); font-size: .87rem; text-align: center; cursor: pointer; }
.upload-zone__hint { font-size: .74rem; opacity: .65; }

/* Attach preview */
.attach-upload-row { display: flex; gap: .65rem; align-items: flex-start; flex-wrap: wrap; }
.attach-preview { display: inline-flex; align-items: center; gap: .5rem; padding: .5rem .85rem; border-radius: var(--radius-sm); background: var(--cream-dk); border: 1px solid var(--border); font-size: .83rem; color: var(--text); }
.attach-preview button { background: none; border: none; cursor: pointer; color: var(--muted); font-size: .8rem; }
.attach-preview button:hover { color: var(--crimson); }

/* File list */
.file-list { display: flex; flex-wrap: wrap; gap: .4rem; margin-bottom: .75rem; }
.file-chip { display: inline-flex; align-items: center; gap: .4rem; padding: .3rem .65rem; border-radius: 6px; background: var(--cream-dk); border: 1px solid var(--border); font-size: .78rem; color: var(--muted); }
.file-chip button { background: none; border: none; cursor: pointer; color: var(--muted); font-size: .75rem; }
.file-chip button:hover { color: var(--crimson); }

/* Type toggle */
.type-toggle { display: grid; grid-template-columns: 1fr 1fr; gap: .6rem; }
.type-btn { display: flex; align-items: center; justify-content: center; gap: .5rem; padding: .75rem .8rem; border-radius: var(--radius-sm); border: 1.5px solid var(--border); background: var(--cream); color: var(--muted); font-weight: 700; font-size: .85rem; cursor: pointer; transition: .2s; font-family: inherit; }
.type-btn:hover { border-color: var(--crimson); color: var(--text); }
.type-btn--on.type-btn--audio { background: rgba(74,122,240,.08); border-color: #4a7af0; color: #2a5ac0; box-shadow: 0 0 0 3px rgba(74,122,240,.12); }
.type-btn--on.type-btn--video { background: rgba(140,21,21,.07); border-color: var(--crimson); color: var(--crimson); box-shadow: 0 0 0 3px rgba(140,21,21,.1); }

/* Cover blocks */
.cover-block { margin-bottom: 1.1rem; padding-bottom: 1.1rem; border-bottom: 1px solid var(--cream-dk); }
.cover-block:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
.cover-block__lbl { display: flex; align-items: center; gap: .5rem; font-size: .8rem; font-weight: 700; color: var(--muted); margin-bottom: .6rem; }
.cover-preview { position: relative; border-radius: var(--radius-sm); overflow: hidden; border: 1px solid var(--border); margin-bottom: .5rem; }
.cover-preview img { width: 100%; max-height: 160px; object-fit: cover; display: block; }
.cover-preview__remove { position: absolute; top: .4rem; left: .4rem; width: 26px; height: 26px; border-radius: 50%; background: rgba(0,0,0,.55); color: #fff; border: none; cursor: pointer; font-size: .8rem; display: flex; align-items: center; justify-content: center; }

/* Lang chips */
.lang-chip { display: inline-block; padding: .15rem .5rem; border-radius: 5px; font-size: .72rem; font-weight: 800; letter-spacing: .04em; }
.lang-chip--ckb { background: rgba(255,215,0,.2); border: 1px solid rgba(255,215,0,.4); color: #8a6c00; }
.lang-chip--kmr { background: rgba(74,122,240,.12); border: 1px solid rgba(74,122,240,.25); color: #2a5ac0; }
.hover-badge { display: inline-block; padding: .15rem .5rem; border-radius: 5px; font-size: .72rem; font-weight: 800; background: rgba(140,21,21,.08); border: 1px solid rgba(140,21,21,.18); color: var(--crimson); }

/* Buttons */
.btn { display: inline-flex; align-items: center; justify-content: center; gap: .45rem; padding: .7rem 1.1rem; border-radius: var(--radius-sm); font-weight: 700; font-size: .88rem; cursor: pointer; border: 1px solid transparent; transition: .15s; text-decoration: none; white-space: nowrap; font-family: inherit; }
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

<!-- Global TagInput styles -->
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