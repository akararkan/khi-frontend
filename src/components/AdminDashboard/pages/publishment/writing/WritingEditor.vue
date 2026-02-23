<template>
  <div class="wed" dir="rtl">

    <!-- Header -->
    <div class="wed__head">
      <RouterLink to="/admin/writings" class="wed__back">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5M12 5l-7 7 7 7"/>
        </svg>
        گەڕانەوە
      </RouterLink>
      <div>
        <h1 class="wed__title">{{ isEdit ? 'دەستکاری کتێب' : 'کتێبی نوێ' }}</h1>
        <p class="wed__sub" v-if="isEdit">ID: {{ route.params.id }}</p>
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
      <div class="wed__layout">

        <!-- ═══════════════ MAIN COLUMN ═══════════════ -->
        <div class="col-main">

          <!-- Writing Topic -->
          <section class="card">
            <div class="card__hd"><span class="card__hd-ico">📚</span> بابەتی نووسین</div>
            <div class="field">
              <label class="lbl lbl--req">بابەت</label>
              <select v-model="form.writingTopic" class="inp">
                <option value="">بابەتێک هەڵبژێرە</option>
                <option value="RELIGIOUS">مەذھەبی</option>
                <option value="HISTORICAL">مێژووی</option>
                <option value="FOLKLORE">فۆڵکلۆر</option>
                <option value="POLITICAL">سیاسی</option>
                <option value="POETRY">شیعر</option>
                <option value="SCIENTIFIC">تێبینی</option>
                <option value="EDUCATIONAL">فێرخوازی</option>
                <option value="OTHER">یتر</option>
              </select>
            </div>
            <div v-if="errors.writingTopic" class="err">{{ errors.writingTopic }}</div>
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
                <input v-model="form.ckbContent.title" class="inp" placeholder="ناونیشانی کتێب بە سۆرانی…" />
              </div>
              <div class="field">
                <label class="lbl">وەسف (سۆرانی)</label>
                <textarea v-model="form.ckbContent.description" class="inp ta" placeholder="کورتە…"></textarea>
              </div>
              <div class="field">
                <label class="lbl">نووسەر (سۆرانی)</label>
                <input v-model="form.ckbContent.writer" class="inp" placeholder="ناوی نووسەر…" />
              </div>
              <div class="field">
                <label class="lbl">جۆری</label>
                <input v-model="form.ckbContent.genre" class="inp" placeholder="بۆ نموونە: نوول، شیعر، کۆنپیڕس…" />
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
                <input v-model="form.kmrContent.title" class="inp" placeholder="Sernavê kitêbê…" />
              </div>
              <div class="field">
                <label class="lbl">وەسف (کورمانجی)</label>
                <textarea v-model="form.kmrContent.description" class="inp ta" placeholder="Danasîn…"></textarea>
              </div>
              <div class="field">
                <label class="lbl">نووسەر (کورمانجی)</label>
                <input v-model="form.kmrContent.writer" class="inp" placeholder="Navê nivîskar…" />
              </div>
              <div class="field">
                <label class="lbl">جۆری</label>
                <input v-model="form.kmrContent.genre" class="inp" placeholder="Wek: Roman, Helbijartina…" />
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

          <!-- File Information -->
          <section class="card">
            <div class="card__hd"><span class="card__hd-ico">📄</span> زانیاری فایل</div>
            <p class="info-text">فایلی کتێب (PDF، DOCX، etc.) و زانیاری وەک فۆرمات، قەبارە و ژمارەی پەڕەکان</p>

            <div class="tabs">
              <button v-for="lang in form.contentLanguages" :key="lang" type="button"
                class="tab" :class="{ 'tab--on': fileActiveLang === lang }" @click="fileActiveLang = lang">
                {{ lang === 'CKB' ? 'سۆرانی' : 'کورمانجی' }}
              </button>
            </div>

            <!-- CKB File -->
            <div v-show="fileActiveLang === 'CKB'" class="tab-panel">
              <div class="field">
                <label class="lbl">فایل کتێب (CKB)</label>
                <label class="upload-zone upload-zone--sm">
                  <input type="file" accept=".pdf,.doc,.docx,.txt,.epub" @change="onCkbFile" style="display:none;" />
                  <div class="upload-zone__inner">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                    <span>{{ form.ckbContent.fileSelected ? form.ckbContent.fileSelected : 'فایلی کتێب هەڵبژێرە' }}</span>
                  </div>
                </label>
              </div>

              <div class="two-grid">
                <div class="field">
                  <label class="lbl">فۆرمات</label>
                  <select v-model="form.ckbContent.fileFormat" class="inp inp--sm">
                    <option value="">فۆرمات هەڵبژێرە</option>
                    <option value="PDF">PDF</option>
                    <option value="DOCX">DOCX</option>
                    <option value="DOC">DOC</option>
                    <option value="TXT">TXT</option>
                    <option value="EPUB">EPUB</option>
                    <option value="OTHER">یتر</option>
                  </select>
                </div>
                <div class="field">
                  <label class="lbl">ژمارەی پەڕەکان</label>
                  <input v-model.number="form.ckbContent.pageCount" type="number" class="inp inp--sm" placeholder="0" min="1" />
                </div>
              </div>

              <div class="field">
                <label class="lbl">یان URL یی فایل بنووسە</label>
                <input v-model="form.ckbContent.fileUrl" class="inp" placeholder="https://cdn.example.com/book.pdf" />
              </div>
            </div>

            <!-- KMR File -->
            <div v-show="fileActiveLang === 'KMR'" class="tab-panel">
              <div class="field">
                <label class="lbl">فایل کتێب (KMR)</label>
                <label class="upload-zone upload-zone--sm">
                  <input type="file" accept=".pdf,.doc,.docx,.txt,.epub" @change="onKmrFile" style="display:none;" />
                  <div class="upload-zone__inner">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                    <span>{{ form.kmrContent.fileSelected ? form.kmrContent.fileSelected : 'فایلی کتێب هەڵبژێرە' }}</span>
                  </div>
                </label>
              </div>

              <div class="two-grid">
                <div class="field">
                  <label class="lbl">فۆرمات</label>
                  <select v-model="form.kmrContent.fileFormat" class="inp inp--sm">
                    <option value="">فۆرمات هەڵبژێرە</option>
                    <option value="PDF">PDF</option>
                    <option value="DOCX">DOCX</option>
                    <option value="DOC">DOC</option>
                    <option value="TXT">TXT</option>
                    <option value="EPUB">EPUB</option>
                    <option value="OTHER">یتر</option>
                  </select>
                </div>
                <div class="field">
                  <label class="lbl">ژمارەی پەڕەکان</label>
                  <input v-model.number="form.kmrContent.pageCount" type="number" class="inp inp--sm" placeholder="0" min="1" />
                </div>
              </div>

              <div class="field">
                <label class="lbl">یان URL یی فایل بنووسە</label>
                <input v-model="form.kmrContent.fileUrl" class="inp" placeholder="https://cdn.example.com/book.pdf" />
              </div>
            </div>
          </section>

          <!-- Publishing Info -->
          <section class="card">
            <div class="card__hd"><span class="card__hd-ico">🏛️</span> زانیاری بڵاوکردنەوە</div>
            <div class="two-grid">
              <div class="field">
                <label class="lbl">بڕیاری ناوەند؟</label>
                <button type="button" class="toggle" :class="{ 'toggle--on': form.publishedByInstitute }" @click="form.publishedByInstitute = !form.publishedByInstitute">
                  <span class="toggle__dot"></span>
                  {{ form.publishedByInstitute ? 'بەڵێ' : 'نەخێر' }}
                </button>
              </div>
            </div>
          </section>

          <!-- Series Management -->
          <section class="card">
            <div class="card__hd"><span class="card__hd-ico">⭐</span> سەری کتێب (ئاختیاری)</div>
            <p class="info-text">بۆ زیادکردنی کتێب بە سەری یان دروستکردنی سەری نوێ</p>

            <div class="series-options">
              <label class="series-option">
                <input type="radio" value="standalone" v-model="form.seriesMode" />
                <span>تاک کتێب (سەری نیە)</span>
              </label>
              <label class="series-option">
                <input type="radio" value="new-series" v-model="form.seriesMode" />
                <span>یەکەمین کتێبی سەری نوێ</span>
              </label>
              <label class="series-option">
                <input type="radio" value="add-to-series" v-model="form.seriesMode" />
                <span>زیادکردن بە سەری هەبوو</span>
              </label>
            </div>

            <!-- New Series -->
            <div v-if="form.seriesMode === 'new-series'" class="series-section">
              <div class="field">
                <label class="lbl lbl--req">ناوی سەری</label>
                <input v-model="form.seriesName" class="inp" placeholder="ناوی سەری کتێب…" />
              </div>
            </div>

            <!-- Add to Existing Series -->
            <div v-if="form.seriesMode === 'add-to-series'" class="series-section">
              <div class="field">
                <label class="lbl lbl--req">سەری پاڵپشتوو</label>
                <select v-model.number="form.parentBookId" class="inp">
                  <option value="">سەری هەڵبژێرە…</option>
                  <option v-for="book in seriesParents" :key="book.id" :value="book.id">
                    {{ book.ckbContent?.title || book.kmrContent?.title || `Book #${book.id}` }}
                  </option>
                </select>
              </div>
              <div class="field">
                <label class="lbl">سەری ناونیشان (ئاختیاری)</label>
                <input v-model="form.seriesName" class="inp" placeholder="یان ناوی سەری نوێ بنووسە…" />
              </div>
            </div>

            <!-- Order in Series -->
            <div v-if="form.seriesMode !== 'standalone'" class="field">
              <label class="lbl lbl--req">بریتی لە سەری</label>
              <input v-model.number="form.seriesOrder" type="number" class="inp" placeholder="1, 2, 3…" min="1" step="0.1" />
            </div>
          </section>

        </div>

        <!-- ═══════════════ SIDE COLUMN ═══════════════ -->
        <aside class="col-side">

          <!-- Cover Images -->
          <section class="card">
            <div class="card__hd"><span class="card__hd-ico">🖼</span> کڤەرەکان</div>
            <p class="info-text">کڤەری جیاوازی بۆ هەر زمانی</p>

            <div class="covers-tabs">
              <button v-for="lang in form.contentLanguages" :key="lang" type="button"
                class="cover-tab" :class="{ 'cover-tab--on': coverActiveLang === lang }" @click="coverActiveLang = lang">
                {{ lang === 'CKB' ? 'سۆرانی' : 'کورمانجی' }}
              </button>
            </div>

            <!-- CKB Cover -->
            <div v-show="coverActiveLang === 'CKB'" class="tab-panel">
              <div class="cover-preview" v-if="ckbCoverPreview || form.ckbContent.coverUrl">
                <img :src="ckbCoverPreview || form.ckbContent.coverUrl" alt="CKB cover" />
                <button type="button" class="cover-preview__remove" @click="removeCkbCover">✕</button>
              </div>
              <label class="upload-zone upload-zone--sm" v-else>
                <input type="file" accept="image/*" @change="onCkbCover" style="display:none;" />
                <div class="upload-zone__inner">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                  </svg>
                  <span>وێنەی کڤەری (سۆرانی)</span>
                </div>
              </label>
              <div class="field" style="margin-top:.75rem;">
                <label class="lbl">یان URL یی کڤەر</label>
                <input v-model="form.ckbContent.coverUrl" class="inp" placeholder="https://…" :disabled="!!ckbCoverFile" />
              </div>
            </div>

            <!-- KMR Cover -->
            <div v-show="coverActiveLang === 'KMR'" class="tab-panel">
              <div class="cover-preview" v-if="kmrCoverPreview || form.kmrContent.coverUrl">
                <img :src="kmrCoverPreview || form.kmrContent.coverUrl" alt="KMR cover" />
                <button type="button" class="cover-preview__remove" @click="removeKmrCover">✕</button>
              </div>
              <label class="upload-zone upload-zone--sm" v-else>
                <input type="file" accept="image/*" @change="onKmrCover" style="display:none;" />
                <div class="upload-zone__inner">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                  </svg>
                  <span>وێنەی کڤەری (کورمانجی)</span>
                </div>
              </label>
              <div class="field" style="margin-top:.75rem;">
                <label class="lbl">یان URL یی کڤەر</label>
                <input v-model="form.kmrContent.coverUrl" class="inp" placeholder="https://…" :disabled="!!kmrCoverFile" />
              </div>
            </div>
          </section>

          <!-- Submit -->
          <div class="side-actions">
            <button type="submit" class="btn btn--primary btn--full" :disabled="saving">
              <span v-if="saving" class="spinner"></span>
              {{ saving ? 'پاشەکەوتکردن…' : (isEdit ? 'پاشەکەوتکردنی گۆڕانکاری' : 'دروستکردنی کتێب') }}
            </button>
            <RouterLink to="/admin/writings" class="btn btn--ghost btn--full">هەڵوەشاندنەوە</RouterLink>
          </div>

          <!-- Danger zone -->
          <section v-if="isEdit" class="card card--danger">
            <div class="card__hd card__hd--danger"><span class="card__hd-ico">⚠️</span> ناوچەی مەترسیدار</div>
            <p class="danger-text">⚠️ سڕینەوەی کتێب ناگەڕێتەوە. ئەگەر سەری سەریانەوە بێ، سڕینەوە دەتوانێت ئامار سەری کاریگەر بکات.</p>
            <button type="button" class="btn btn--danger btn--full" @click="doDelete">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                <path d="M10 11v6M14 11v6"/>
              </svg>
              سڕینەوەی ئەم کتێبە
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

/* ── Inline TagInput ── */
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

const route = useRoute()
const router = useRouter()

const isEdit = computed(() => !!route.params.id)
const activeLang = ref('CKB')
const fileActiveLang = ref('CKB')
const coverActiveLang = ref('CKB')
const fetching = ref(false)
const saving = ref(false)
const ckbCoverFile = ref(null)
const kmrCoverFile = ref(null)
const ckbCoverPreview = ref('')
const kmrCoverPreview = ref('')
const ckbBookFile = ref(null)
const kmrBookFile = ref(null)
const toast = ref({ show: false, type: 'success', msg: '' })
const errors = ref({})
const seriesParents = ref([])

const form = reactive({
  writingTopic: '',
  contentLanguages: ['CKB'],
  publishedByInstitute: false,
  ckbContent: { title: '', description: '', writer: '', genre: '', coverUrl: '', fileUrl: '', fileFormat: '', pageCount: null, fileSelected: '' },
  kmrContent: { title: '', description: '', writer: '', genre: '', coverUrl: '', fileUrl: '', fileFormat: '', pageCount: null, fileSelected: '' },
  tagsCkb: [],
  tagsKmr: [],
  keywordsCkb: [],
  keywordsKmr: [],
  seriesMode: 'standalone',
  seriesName: '',
  seriesOrder: 1,
  parentBookId: null,
})

const validate = () => {
  const e = {}

  if (!String(form.writingTopic || '').trim()) e.writingTopic = 'بابەتی نووسین پێویستە'
  if (!form.contentLanguages.length) e.contentLanguages = 'کەمی یەک زمانیکی هەڵبژێرە'

  if (form.contentLanguages.includes('CKB') && !form.ckbContent.title.trim()) e.titles = 'ناونیشانی سۆرانی پێویستە'
  if (form.contentLanguages.includes('KMR') && !form.kmrContent.title.trim()) e.titles = 'ناونیشانی کورمانجی پێویستە'

  if (form.seriesMode === 'new-series' && !form.seriesName.trim()) e.seriesName = 'ناوی سەری پێویستە'
  if (form.seriesMode === 'add-to-series' && !form.parentBookId) e.parentBookId = 'سەری پاڵپشتوو هەڵبژێرە'

  errors.value = e
  return !Object.keys(e).length
}

const submit = async () => {
  if (!validate()) { window.scrollTo({ top: 0, behavior: 'smooth' }); return }
  saving.value = true

  try {
    const dto = {
      writingTopic: form.writingTopic,
      contentLanguages: form.contentLanguages,
      publishedByInstitute: form.publishedByInstitute,
      ckbContent: form.contentLanguages.includes('CKB') ? {
        title: form.ckbContent.title || null,
        description: form.ckbContent.description || null,
        writer: form.ckbContent.writer || null,
        genre: form.ckbContent.genre || null,
        coverUrl: form.ckbContent.coverUrl || null,
        fileUrl: form.ckbContent.fileUrl || null,
        fileFormat: form.ckbContent.fileFormat || null,
        pageCount: form.ckbContent.pageCount || null,
      } : null,
      kmrContent: form.contentLanguages.includes('KMR') ? {
        title: form.kmrContent.title || null,
        description: form.kmrContent.description || null,
        writer: form.kmrContent.writer || null,
        genre: form.kmrContent.genre || null,
        coverUrl: form.kmrContent.coverUrl || null,
        fileUrl: form.kmrContent.fileUrl || null,
        fileFormat: form.kmrContent.fileFormat || null,
        pageCount: form.kmrContent.pageCount || null,
      } : null,
      tags: {
        ckb: form.contentLanguages.includes('CKB') ? form.tagsCkb : [],
        kmr: form.contentLanguages.includes('KMR') ? form.tagsKmr : [],
      },
      keywords: {
        ckb: form.contentLanguages.includes('CKB') ? form.keywordsCkb : [],
        kmr: form.contentLanguages.includes('KMR') ? form.keywordsKmr : [],
      },
    }

    // Add series info
    if (form.seriesMode === 'new-series') {
      dto.seriesName = form.seriesName
      dto.seriesOrder = 1
    } else if (form.seriesMode === 'add-to-series') {
      dto.parentBookId = form.parentBookId
      dto.seriesOrder = form.seriesOrder
      if (form.seriesName) dto.seriesName = form.seriesName
    }

    const fd = new FormData()
    fd.append('data', new Blob([JSON.stringify(dto)], { type: 'application/json' }))

    if (ckbCoverFile.value) fd.append('ckbCoverImage', ckbCoverFile.value)
    if (kmrCoverFile.value) fd.append('kmrCoverImage', kmrCoverFile.value)
    if (ckbBookFile.value) fd.append('ckbBookFile', ckbBookFile.value)
    if (kmrBookFile.value) fd.append('kmrBookFile', kmrBookFile.value)

    const cfg = { headers: { 'Content-Type': 'multipart/form-data' } }

    if (isEdit.value) {
      await api.put(`/api/v1/writings/${route.params.id}`, fd, cfg)
    } else {
      await api.post('/api/v1/writings', fd, cfg)
    }

    showToast('success', isEdit.value ? 'کتێبەکە نوێکرایەوە ✓' : 'کتێبەکە دروستکرا ✓')
    setTimeout(() => router.push('/admin/writings'), 1200)

  } catch (e) {
    showToast('error', e?.response?.data?.message || e.message || 'هەڵەیەک ڕوویدا')
  } finally {
    saving.value = false
  }
}

const doDelete = async () => {
  if (!confirm(`دڵنیای لە سڕینەوەی کتێب #${route.params.id}؟`)) return
  try {
    await api.delete(`/api/v1/writings/${route.params.id}`)
    showToast('success', 'کتێبەکە سڕایەوە')
    setTimeout(() => router.push('/admin/writings'), 800)
  } catch (e) {
    showToast('error', e?.response?.data?.message || 'سڕینەوە سەرنەکەوت')
  }
}

const onCkbCover = (e) => {
  const f = e.target.files?.[0]
  if (!f) return
  ckbCoverFile.value = f
  ckbCoverPreview.value = URL.createObjectURL(f)
  form.ckbContent.coverUrl = ''
}
const removeCkbCover = () => {
  if (ckbCoverPreview.value) URL.revokeObjectURL(ckbCoverPreview.value)
  ckbCoverFile.value = null
  ckbCoverPreview.value = ''
  form.ckbContent.coverUrl = ''
}

const onKmrCover = (e) => {
  const f = e.target.files?.[0]
  if (!f) return
  kmrCoverFile.value = f
  kmrCoverPreview.value = URL.createObjectURL(f)
  form.kmrContent.coverUrl = ''
}
const removeKmrCover = () => {
  if (kmrCoverPreview.value) URL.revokeObjectURL(kmrCoverPreview.value)
  kmrCoverFile.value = null
  kmrCoverPreview.value = ''
  form.kmrContent.coverUrl = ''
}

const onCkbFile = (e) => {
  const f = e.target.files?.[0]
  if (!f) return
  ckbBookFile.value = f
  form.ckbContent.fileSelected = f.name
  form.ckbContent.fileSizeBytes = f.size
  const ext = f.name.split('.').pop().toUpperCase()
  if (['PDF', 'DOCX', 'DOC', 'TXT', 'EPUB'].includes(ext)) {
    form.ckbContent.fileFormat = ext === 'DOCX' ? 'DOCX' : ext
  }
}

const onKmrFile = (e) => {
  const f = e.target.files?.[0]
  if (!f) return
  kmrBookFile.value = f
  form.kmrContent.fileSelected = f.name
  form.kmrContent.fileSizeBytes = f.size
  const ext = f.name.split('.').pop().toUpperCase()
  if (['PDF', 'DOCX', 'DOC', 'TXT', 'EPUB'].includes(ext)) {
    form.kmrContent.fileFormat = ext === 'DOCX' ? 'DOCX' : ext
  }
}

const loadSeriesParents = async () => {
  try {
    const { data } = await api.get('/api/v1/writings/series/parents')
    seriesParents.value = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : [])
  } catch (e) {
    console.error('Failed to load series parents:', e)
  }
}

const loadWriting = async () => {
  if (!isEdit.value) return
  fetching.value = true
  try {
    const { data } = await api.get('/api/v1/writings')
    const all = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : [])
    const found = all.find(x => String(x.id) === String(route.params.id))
    if (found) applyWriting(found)
    else showToast('error', 'کتێبەکە نەدۆزرایەوە')
  } catch (e) {
    showToast('error', 'داتا هێنان سەرنەکەوت: ' + (e?.response?.data?.message || e.message))
  } finally {
    fetching.value = false
  }
}

const applyWriting = (w) => {
  form.writingTopic = w.writingTopic || ''
  form.contentLanguages = [...(w.contentLanguages || ['CKB'])]
  activeLang.value = form.contentLanguages[0] || 'CKB'
  form.publishedByInstitute = !!w.publishedByInstitute

  if (w.ckbContent) {
    Object.assign(form.ckbContent, {
      title: w.ckbContent.title || '',
      description: w.ckbContent.description || '',
      writer: w.ckbContent.writer || '',
      genre: w.ckbContent.genre || '',
      coverUrl: w.ckbContent.coverUrl || '',
      fileUrl: w.ckbContent.fileUrl || '',
      fileFormat: w.ckbContent.fileFormat || '',
      pageCount: w.ckbContent.pageCount || null,
    })
  }
  if (w.kmrContent) {
    Object.assign(form.kmrContent, {
      title: w.kmrContent.title || '',
      description: w.kmrContent.description || '',
      writer: w.kmrContent.writer || '',
      genre: w.kmrContent.genre || '',
      coverUrl: w.kmrContent.coverUrl || '',
      fileUrl: w.kmrContent.fileUrl || '',
      fileFormat: w.kmrContent.fileFormat || '',
      pageCount: w.kmrContent.pageCount || null,
    })
  }

  form.tagsCkb = [...(w.tags?.ckb || [])]
  form.tagsKmr = [...(w.tags?.kmr || [])]
  form.keywordsCkb = [...(w.keywords?.ckb || [])]
  form.keywordsKmr = [...(w.keywords?.kmr || [])]

  if (w.seriesInfo) {
    form.seriesMode = 'add-to-series'
    form.parentBookId = w.seriesInfo.parentBookId
    form.seriesName = w.seriesInfo.seriesName || ''
    form.seriesOrder = w.seriesInfo.seriesOrder || 1
  }
}

const showToast = (type, msg) => {
  toast.value = { show: true, type, msg }
  setTimeout(() => { toast.value.show = false }, 4000)
}

onMounted(() => {
  loadSeriesParents()
  loadWriting()
})
</script>

<style scoped>
.wed { direction: rtl; max-width: 1280px; margin: 0 auto; }
.wed__head { display: flex; align-items: center; gap: 1.25rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
.wed__back { display: inline-flex; align-items: center; gap: .4rem; color: var(--muted); text-decoration: none; font-weight: 600; font-size: .87rem; padding: .4rem .7rem; border-radius: 8px; border: 1px solid var(--border); background: var(--white); transition: var(--transition); }
.wed__back:hover { color: var(--crimson); border-color: var(--crimson); }
.wed__title { font-size: 1.4rem; font-weight: 700; color: var(--text); }
.wed__sub { font-size: .8rem; color: var(--muted); margin-top: .1rem; }

.toast { display: flex; align-items: center; gap: .65rem; padding: .8rem 1.1rem; border-radius: var(--radius-sm); font-weight: 600; font-size: .88rem; margin-bottom: 1rem; }
.toast__ico { font-size: 1rem; }
.toast--success { background: rgba(25,130,80,.1); border: 1px solid rgba(25,130,80,.25); color: #186048; }
.toast--error { background: rgba(180,40,40,.08); border: 1px solid rgba(180,40,40,.2); color: var(--crimson); }

.loading-bar { height: 3px; border-radius: 2px; margin-bottom: .75rem; background: linear-gradient(90deg, var(--crimson), var(--gold), var(--crimson)); background-size: 200% 100%; animation: shimmer 1.2s linear infinite; }
@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

.wed__layout { display: grid; grid-template-columns: 1fr 320px; gap: 1.25rem; align-items: start; }
@media (max-width: 900px) { .wed__layout { grid-template-columns: 1fr; } }

.card { background: var(--white); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 1.35rem; box-shadow: var(--shadow-sm); margin-bottom: 1.25rem; }
.card--danger { border-color: rgba(140, 21, 21, .18); }
.card__hd { display: flex; align-items: center; gap: .6rem; font-weight: 700; font-size: .95rem; color: var(--text); margin-bottom: 1.1rem; padding-bottom: .75rem; border-bottom: 1px solid var(--cream-dk); }
.card__hd--danger { color: var(--crimson); border-bottom-color: rgba(140, 21, 21, .1); }
.card__hd-ico { font-size: 1rem; }

.info-text { font-size: .82rem; color: var(--muted); margin-bottom: .8rem; line-height: 1.6; }
.danger-text { font-size: .84rem; color: var(--muted); margin-bottom: .85rem; line-height: 1.65; }

.field { display: flex; flex-direction: column; gap: .4rem; margin-bottom: .95rem; }
.lbl { font-weight: 800; font-size: .83rem; color: var(--text); }
.lbl--sm { font-size: .77rem; }
.lbl--req::after { content: ' *'; color: var(--crimson); }

.two-grid { display: grid; grid-template-columns: 1fr 1fr; gap: .9rem; }
@media (max-width: 600px) { .two-grid { grid-template-columns: 1fr; } }

.inp { border: 1.5px solid var(--border); border-radius: var(--radius-sm); padding: .7rem .9rem; background: var(--cream); color: var(--text); font-size: .9rem; outline: none; transition: var(--transition); width: 100%; font-family: inherit; }
.inp:focus { background: var(--white); border-color: var(--crimson); box-shadow: 0 0 0 3px rgba(140, 21, 21, .1); }
.inp--sm { padding: .5rem .7rem; font-size: .85rem; }
.ta { min-height: 120px; resize: vertical; }

.err { font-size: .78rem; color: #c0392b; font-weight: 700; }

.lang-picks { display: flex; gap: .75rem; flex-wrap: wrap; }
.lang-pick { display: inline-flex; align-items: center; gap: .5rem; padding: .65rem 1rem; border-radius: var(--radius-sm); border: 1.5px solid var(--border); cursor: pointer; transition: var(--transition); font-weight: 700; user-select: none; }
.lang-pick input { display: none; }
.lang-pick:hover { border-color: var(--crimson); }
.lang-pick--on { background: rgba(140, 21, 21, .06); border-color: var(--crimson); color: var(--crimson); }
.lang-pick__code { font-size: .75rem; font-weight: 900; opacity: .6; }

.tabs { display: flex; gap: .4rem; margin-bottom: 1.1rem; border-bottom: 1px solid var(--border); }
.tab { display: inline-flex; align-items: center; gap: .4rem; padding: .6rem 1rem; border-radius: 8px 8px 0 0; border: 1px solid transparent; border-bottom: none; background: none; color: var(--muted); font-weight: 800; font-size: .88rem; cursor: pointer; transition: var(--transition); margin-bottom: -1px; font-family: inherit; }
.tab--on { background: var(--white); border-color: var(--border); color: var(--crimson); }
.tab__pip { width: 7px; height: 7px; border-radius: 50%; }
.tab__pip--ckb { background: #c8a800; }
.tab__pip--kmr { background: #4a7af0; }

.cover-tab { display: inline-flex; align-items: center; gap: .4rem; padding: .5rem 1rem; border: none; background: transparent; color: var(--muted); font-weight: 700; font-size: .85rem; cursor: pointer; transition: all .2s; border-bottom: 2px solid transparent; margin-bottom: .8rem; }
.cover-tab--on { color: var(--crimson); border-bottom-color: var(--crimson); }
.covers-tabs { display: flex; gap: .3rem; margin-bottom: 1rem; }

.upload-zone { border: 2px dashed var(--border); border-radius: var(--radius-sm); cursor: pointer; transition: var(--transition); display: block; margin-bottom: .75rem; }
.upload-zone:hover { border-color: var(--crimson); background: rgba(140, 21, 21, .03); }
.upload-zone--sm .upload-zone__inner { padding: 1.25rem; }
.upload-zone__inner { display: flex; flex-direction: column; align-items: center; gap: .5rem; padding: 1.75rem 1rem; color: var(--muted); font-size: .87rem; text-align: center; cursor: pointer; }

.cover-preview { position: relative; border-radius: var(--radius-sm); overflow: hidden; border: 1px solid var(--border); margin-bottom: .75rem; }
.cover-preview img { width: 100%; max-height: 200px; object-fit: cover; display: block; }
.cover-preview__remove { position: absolute; top: .5rem; left: .5rem; width: 28px; height: 28px; border-radius: 50%; background: rgba(0, 0, 0, .55); color: #fff; border: none; cursor: pointer; font-size: .85rem; display: flex; align-items: center; justify-content: center; }

.series-options { display: flex; flex-direction: column; gap: .6rem; margin-bottom: 1.2rem; }
.series-option { display: flex; align-items: center; gap: .5rem; padding: .5rem .75rem; border-radius: 8px; border: 1px solid var(--border); cursor: pointer; transition: var(--transition); font-weight: 600; }
.series-option input { appearance: none; width: 18px; height: 18px; border: 1.5px solid var(--border); border-radius: 50%; cursor: pointer; transition: var(--transition); }
.series-option input:checked { background: var(--crimson); border-color: var(--crimson); }
.series-option:hover { border-color: var(--crimson); }

.series-section { padding: 1rem; background: rgba(140, 21, 21, .04); border: 1px solid rgba(140, 21, 21, .1); border-radius: 10px; margin-bottom: .8rem; }

.toggle { width: 100%; display: inline-flex; align-items: center; gap: .6rem; padding: .7rem .9rem; border-radius: var(--radius-sm); border: 1.5px solid var(--border); background: var(--cream); color: var(--muted); cursor: pointer; transition: var(--transition); font-weight: 900; font-family: inherit; justify-content: center; }
.toggle:hover { border-color: rgba(140, 21, 21, .35); }
.toggle--on { background: rgba(22, 120, 70, .09); border-color: rgba(22, 120, 70, .25); color: #166044; }
.toggle__dot { width: 10px; height: 10px; border-radius: 50%; background: var(--border); }
.toggle--on .toggle__dot { background: #22a06b; }

.btn { display: inline-flex; align-items: center; justify-content: center; gap: .45rem; padding: .7rem 1.1rem; border-radius: var(--radius-sm); font-weight: 900; font-size: .88rem; cursor: pointer; border: 1px solid transparent; transition: var(--transition); text-decoration: none; white-space: nowrap; font-family: inherit; }
.btn--primary { background: var(--crimson); color: #fff; box-shadow: 0 6px 20px rgba(140, 21, 21, .25); }
.btn--primary:hover { background: var(--crimson-lt); transform: translateY(-1px); }
.btn--ghost { background: transparent; border-color: var(--border); color: var(--text); }
.btn--ghost:hover { border-color: var(--crimson); color: var(--crimson); }
.btn--danger { background: #c0392b; color: #fff; border-color: #c0392b; }
.btn--danger:hover { background: #a93226; }
.btn--full { width: 100%; }
.btn:disabled { opacity: .55; cursor: not-allowed; transform: none !important; }

.side-actions { display: flex; flex-direction: column; gap: .6rem; }
.spinner { width: 14px; height: 14px; border: 2px solid rgba(255, 255, 255, .4); border-top-color: #fff; border-radius: 50%; animation: spin .7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.toast-enter-active, .toast-leave-active { transition: .3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(-6px); }
</style>

<!-- TagInput global styles -->
<style>
.tag-input { display: flex; flex-direction: column; gap: .4rem; }
.tag-input__tags { display: flex; flex-wrap: wrap; gap: .4rem; align-items: center; border: 1.5px solid var(--border); border-radius: var(--radius-sm); padding: .45rem .65rem; background: var(--cream); min-height: 42px; transition: border-color .2s; }
.tag-input__tags:focus-within { border-color: var(--crimson); background: var(--white); box-shadow: 0 0 0 3px rgba(140, 21, 21, .1); }
.tag-input__tag { display: inline-flex; align-items: center; gap: .3rem; padding: .2rem .55rem; border-radius: 6px; font-size: .8rem; font-weight: 700; }
.tag-input__tag--default { background: var(--cream-dk); border: 1px solid var(--border); color: var(--text); }
.tag-input__tag--gold { background: rgba(254, 221, 0, .2); border: 1px solid rgba(254, 221, 0, .4); color: #807000; }
.tag-input__tag--blue { background: rgba(30, 80, 200, .1); border: 1px solid rgba(30, 80, 200, .2); color: #1840a0; }
.tag-input__tag button { background: none; border: none; cursor: pointer; color: inherit; opacity: .6; font-size: .75rem; line-height: 1; }
.tag-input__tag button:hover { opacity: 1; }
.tag-input__inp { border: none; outline: none; background: none; font-family: inherit; font-size: .88rem; min-width: 120px; color: var(--text); }
</style>