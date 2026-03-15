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

      <!-- Global Language Switcher -->
      <div class="lang-switcher">
        <button type="button" class="lang-btn" :class="{ 'lang-btn--active': activeLang === 'ckb' }" @click="activeLang = 'ckb'">
          <span class="lang-btn__dot lang-btn__dot--ckb"></span>سۆرانی
        </button>
        <button type="button" class="lang-btn" :class="{ 'lang-btn--active': activeLang === 'kmr' }" @click="activeLang = 'kmr'">
          <span class="lang-btn__dot lang-btn__dot--kmr"></span>کرمانجی
        </button>
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

        <!-- ── Hero Image ── -->
        <section class="card">
          <div class="card__hd">
            <span class="card__hd-ico">🖼️</span>
            وێنەی هیرۆ
            <span class="card__hd-hint">بانەری سەرەوەی پەڕەکە — هاوبەش بۆ هەر دوو زمان</span>
          </div>

          <div class="hero-field">
            <!-- Preview -->
            <div class="hero-preview" :class="{ 'hero-preview--empty': !form.heroImageUrl }">
              <img v-if="form.heroImageUrl" :src="form.heroImageUrl" class="hero-preview__img" loading="lazy" />
              <div v-else class="hero-preview__placeholder">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
                <span>وێنەی هیرۆ هەڵنەبژێردراوە</span>
                <span class="hero-preview__hint">پێشنیاری پێوانە: 1600 × 600px</span>
              </div>
              <!-- Remove button -->
              <button
                v-if="form.heroImageUrl"
                type="button"
                class="hero-preview__remove"
                @click="removeHeroImage"
                title="لابردنی وێنە"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <!-- URL input + upload -->
            <div class="hero-input-row">
              <div class="slug-input-wrap" style="flex:1">
                <span class="slug-input-wrap__prefix">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                </span>
                <input
                  v-model="form.heroImageUrl"
                  class="inp inp--slug"
                  placeholder="https://… یان فایل باربکە"
                  dir="ltr"
                />
              </div>
              <label class="upload-btn" :class="{ 'upload-btn--loading': heroUploading }">
                <span v-if="heroUploading" class="spinner spinner--dark"></span>
                <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                {{ heroUploading ? 'بارکردن…' : 'بارکردن' }}
                <input type="file" hidden accept="image/*" @change="uploadHeroImage" />
              </label>
            </div>
            <div v-if="heroUploading" class="upload-progress">
              <div class="upload-progress__bar"></div>
              <span>وێنەکە بارکردنی…</span>
            </div>
            <div class="field__hint">
              وێنەی بانەر — پێشنیار: 1600×600px، کوالیتی بەرز. هاوبەش بۆ سۆرانی و کرمانجی.
            </div>
          </div>
        </section>

        <!-- ── Basic Info ── -->
        <section class="card">
          <div class="card__hd">
            <span class="card__hd-ico">📄</span>
            زانیاری سەرەکی
            <span class="card__hd-lang" :class="`card__hd-lang--${activeLang}`">
              {{ activeLang === 'ckb' ? 'سۆرانی' : 'کرمانجی' }}
            </span>
          </div>

          <!-- ── SLUG SECTION — two separate fields ── -->
          <div class="slug-row">
            <!-- CKB Slug -->
            <div class="field slug-field" :class="{ 'slug-field--active': activeLang === 'ckb' }">
              <label class="lbl lbl--req">
                سلەگی سۆرانی
                <span class="lbl__lang lbl__lang--ckb">CKB</span>
              </label>
              <div class="slug-input-wrap">
                <span class="slug-input-wrap__prefix">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
                </span>
                <input
                  v-model="form.slugCkb"
                  class="inp inp--slug"
                  :class="{ 'inp--err': errors.slugCkb }"
                  placeholder="derbare-ckb"
                  :disabled="isEdit"
                  dir="ltr"
                />
              </div>
              <div v-if="errors.slugCkb" class="err">{{ errors.slugCkb }}</div>
              <div v-else class="field__hint">{{ isEdit ? 'ناتوانرێت بگۆڕدرێت' : 'ناسەری URL — کاراکتەری ASCII یان کوردی' }}</div>
            </div>

            <!-- KMR Slug -->
            <div class="field slug-field" :class="{ 'slug-field--active': activeLang === 'kmr' }">
              <label class="lbl">
                سلەگی کرمانجی
                <span class="lbl__lang lbl__lang--kmr">KMR</span>
                <span class="lbl__optional">ئیختیاری</span>
              </label>
              <div class="slug-input-wrap">
                <span class="slug-input-wrap__prefix">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
                </span>
                <input
                  v-model="form.slugKmr"
                  class="inp inp--slug"
                  :class="{ 'inp--err': errors.slugKmr }"
                  placeholder="derbare-kmr"
                  :disabled="isEdit"
                  dir="ltr"
                />
              </div>
              <div v-if="errors.slugKmr" class="err">{{ errors.slugKmr }}</div>
              <div v-else class="field__hint">{{ isEdit ? 'ناتوانرێت بگۆڕدرێت' : 'ئەگەر بۆشبێت، سلەگی سۆرانی بەکاردێت' }}</div>
            </div>
          </div>

          <!-- Bilingual: Title -->
          <div class="field">
            <label class="lbl lbl--req">
              ناونیشان
              <span class="lbl__lang" :class="`lbl__lang--${activeLang}`">{{ activeLang === 'ckb' ? 'CKB' : 'KMR' }}</span>
            </label>
            <input v-if="activeLang === 'ckb'" v-model="form.ckbContent.title" class="inp" :class="{ 'inp--err': errors.ckbTitle }" placeholder="دەربارەی ئێمە…" />
            <input v-else v-model="form.kmrContent.title" class="inp" placeholder="Derbarê me…" />
            <div v-if="errors.ckbTitle && activeLang === 'ckb'" class="err">{{ errors.ckbTitle }}</div>
          </div>

          <!-- Bilingual: Subtitle -->
          <div class="field">
            <label class="lbl">
              ژێرناونیشان
              <span class="lbl__lang" :class="`lbl__lang--${activeLang}`">{{ activeLang === 'ckb' ? 'CKB' : 'KMR' }}</span>
            </label>
            <input v-if="activeLang === 'ckb'" v-model="form.ckbContent.subtitle" class="inp" placeholder="وەسفی کورت…" />
            <input v-else v-model="form.kmrContent.subtitle" class="inp" placeholder="Danasîna kurt…" />
          </div>

          <!-- Bilingual: Meta Description -->
          <div class="field">
            <label class="lbl">
              وەسفی میتا (SEO)
              <span class="lbl__lang" :class="`lbl__lang--${activeLang}`">{{ activeLang === 'ckb' ? 'CKB' : 'KMR' }}</span>
            </label>
            <textarea v-if="activeLang === 'ckb'" v-model="form.ckbContent.metaDescription" class="inp ta ta--sm" placeholder="وەسفی کورت بۆ سێرچ ئەنجین…"></textarea>
            <textarea v-else v-model="form.kmrContent.metaDescription" class="inp ta ta--sm" placeholder="Danasîna kurt ji bo lêgerînê…"></textarea>
          </div>

          <!-- Fill status -->
          <div class="fill-status">
            <div class="fill-status__item" :class="{ 'fill-status__item--ok': form.ckbContent.title && form.slugCkb }">
              <span class="fill-status__dot"></span>
              سۆرانی — {{ (form.ckbContent.title && form.slugCkb) ? 'تەواو ✓' : 'ناونیشان / سلەگ پێویستە' }}
            </div>
            <div class="fill-status__item" :class="{ 'fill-status__item--ok': form.kmrContent.title && form.slugKmr }">
              <span class="fill-status__dot"></span>
              کرمانجی — {{ (form.kmrContent.title && form.slugKmr) ? 'تەواو ✓' : 'تازەیە (ئیختیاری)' }}
            </div>
          </div>
        </section>

        <!-- ── Blocks ── -->
        <section class="card">
          <div class="card__hd">
            <span class="card__hd-ico">🧱</span>
            بلۆکەکان
            <span class="card__hd-badge" v-if="form.blocks.length">{{ form.blocks.length }}</span>
            <span class="card__hd-lang ms-auto" :class="`card__hd-lang--${activeLang}`">
              {{ activeLang === 'ckb' ? 'سۆرانی' : 'کرمانجی' }}
            </span>
          </div>

          <div class="blocks-list" v-if="form.blocks.length">
            <div class="block-card" v-for="(block, idx) in form.blocks" :key="block._uid">
              <div class="block-card__header">
                <div class="block-card__left">
                  <span class="block-card__seq">{{ idx + 1 }}</span>
                  <span class="block-card__type-badge" :class="`block-card__type-badge--${block.contentType.toLowerCase()}`">
                    {{ blockTypeLabel(block.contentType) }}
                  </span>
                  <span class="block-card__title-text" v-if="activeBlockTitle(block)">{{ activeBlockTitle(block) }}</span>
                  <span class="block-card__lang-dots">
                    <span class="block-card__lang-dot" :class="(block.ckbContent.title || block.ckbContent.contentText) ? 'block-card__lang-dot--filled' : ''" title="سۆرانی">ک</span>
                    <span class="block-card__lang-dot" :class="(block.kmrContent.title || block.kmrContent.contentText) ? 'block-card__lang-dot--filled' : ''" title="کرمانجی">م</span>
                  </span>
                </div>
                <div class="block-card__actions">
                  <button type="button" class="block-btn" :disabled="idx === 0" @click="moveBlock(idx, -1)">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 15l-6-6-6 6"/></svg>
                  </button>
                  <button type="button" class="block-btn" :disabled="idx === form.blocks.length - 1" @click="moveBlock(idx, 1)">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg>
                  </button>
                  <button type="button" class="block-btn block-btn--toggle" @click="block._open = !block._open">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                      <path v-if="block._open" d="M18 15l-6-6-6 6"/>
                      <path v-else d="M6 9l6 6 6-6"/>
                    </svg>
                  </button>
                  <button type="button" class="block-btn block-btn--del" @click="removeBlock(idx)">
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
                      <label class="lbl">
                        ناونیشان
                        <span class="lbl__lang" :class="`lbl__lang--${activeLang}`">{{ activeLang === 'ckb' ? 'CKB' : 'KMR' }}</span>
                      </label>
                      <input v-if="activeLang === 'ckb'" v-model="block.ckbContent.title" class="inp" placeholder="ناونیشانی بلۆک…" />
                      <input v-else v-model="block.kmrContent.title" class="inp" placeholder="Sernavê blokê…" />
                    </div>
                  </div>

                  <div class="field" v-if="showTextField(block.contentType)">
                    <label class="lbl">
                      {{ block.contentType === 'TEXT' || block.contentType === 'QUOTE' ? 'ناوەڕۆکی دەق' : 'وەسف / کەپشن' }}
                      <span class="lbl__lang" :class="`lbl__lang--${activeLang}`">{{ activeLang === 'ckb' ? 'CKB' : 'KMR' }}</span>
                    </label>
                    <textarea v-if="activeLang === 'ckb'" v-model="block.ckbContent.contentText" class="inp ta" :rows="['TEXT','QUOTE'].includes(block.contentType) ? 6 : 3" placeholder="دەقی سۆرانی…"></textarea>
                    <textarea v-else v-model="block.kmrContent.contentText" class="inp ta" :rows="['TEXT','QUOTE'].includes(block.contentType) ? 6 : 3" placeholder="Nivîsa Kurmancî…"></textarea>
                  </div>

                  <div class="field" v-if="showMediaField(block.contentType)">
                    <label class="lbl">
                      لینکی میدیا
                      <span class="field__hint-inline">هاوبەش بۆ هەر دوو زمان</span>
                    </label>
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
                    <label class="lbl">
                      دەقی جێگرەوە (Alt Text)
                      <span class="lbl__lang" :class="`lbl__lang--${activeLang}`">{{ activeLang === 'ckb' ? 'CKB' : 'KMR' }}</span>
                    </label>
                    <input v-if="activeLang === 'ckb'" v-model="block.ckbContent.altText" class="inp" placeholder="وەسفی وێنە بۆ دەستگەیشتن…" />
                    <input v-else v-model="block.kmrContent.altText" class="inp" placeholder="Danasîna wêneyê ji bo gihîştinê…" />
                  </div>

                  <div v-if="block.contentType === 'STATS'" class="stats-editor">
                    <label class="lbl">ئامارەکان (JSON — هاوبەش)</label>
                    <textarea v-model="block._metadataJson" class="inp ta ta--code" rows="4"
                      placeholder='{"items": [{"label": "پڕۆژە", "value": "120"}]}'
                      @blur="parseMetadata(block)"></textarea>
                  </div>

                  <div class="block-fill-status">
                    <span :class="(block.ckbContent.title || block.ckbContent.contentText) ? 'fill-dot fill-dot--ok' : 'fill-dot'">سۆرانی</span>
                    <span :class="(block.kmrContent.title || block.kmrContent.contentText) ? 'fill-dot fill-dot--ok' : 'fill-dot'">کرمانجی</span>
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
          <div class="card__hd"><span class="card__hd-ico">🚀</span>بڵاوکردنەوە</div>

          <div class="publish-info" v-if="isEdit">
            <div class="publish-info__row"><span>ناسنامە:</span><strong>#{{ route.params.id }}</strong></div>
            <div class="publish-info__row" v-if="existingData?.createdAt"><span>دروستکراوە:</span><strong>{{ existingData.createdAt }}</strong></div>
            <div class="publish-info__row">
              <span>سلەگ CKB:</span>
              <code class="slug-code slug-code--ckb">{{ form.slugCkb || '—' }}</code>
            </div>
            <div class="publish-info__row">
              <span>سلەگ KMR:</span>
              <code class="slug-code slug-code--kmr">{{ form.slugKmr || '—' }}</code>
            </div>
            <!-- Hero image status in sidebar -->
            <div class="publish-info__row">
              <span>هیرۆ:</span>
              <span v-if="form.heroImageUrl" class="hero-status hero-status--ok">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                دیاریکراوە ✓
              </span>
              <span v-else class="hero-status hero-status--empty">نییە</span>
            </div>
          </div>

          <!-- Lang completeness bars -->
          <div class="lang-completeness">
            <div class="lang-completeness__row">
              <span class="lang-completeness__label lang-completeness__label--ckb">سۆرانی</span>
              <span class="lang-completeness__val">{{ ckbFillCount }}/{{ totalFillFields }}</span>
              <div class="lang-completeness__bar">
                <div class="lang-completeness__bar-fill lang-completeness__bar-fill--ckb"
                  :style="{ width: `${Math.round(ckbFillCount / Math.max(totalFillFields,1) * 100)}%` }"></div>
              </div>
            </div>
            <div class="lang-completeness__row">
              <span class="lang-completeness__label lang-completeness__label--kmr">کرمانجی</span>
              <span class="lang-completeness__val">{{ kmrFillCount }}/{{ totalFillFields }}</span>
              <div class="lang-completeness__bar">
                <div class="lang-completeness__bar-fill lang-completeness__bar-fill--kmr"
                  :style="{ width: `${Math.round(kmrFillCount / Math.max(totalFillFields,1) * 100)}%` }"></div>
              </div>
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
          <div class="card__hd"><span class="card__hd-ico">📊</span>پوختەی بلۆکەکان</div>
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
const activeLang   = ref('ckb')
const heroUploading = ref(false)

let uidCounter = 0
const makeUid = () => ++uidCounter

const blankPageContent  = () => ({ title: '', subtitle: '', metaDescription: '' })
const blankBlockContent = () => ({ contentText: '', title: '', altText: '' })

const form = reactive({
  slugCkb:      '',
  slugKmr:      '',
  heroImageUrl: '',
  ckbContent:   blankPageContent(),
  kmrContent:   blankPageContent(),
  blocks:       []
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

const blockTypeLabelMap = { TEXT: 'دەق', IMAGE: 'وێنە', VIDEO: 'ڤیدیۆ', AUDIO: 'دەنگ', GALLERY: 'گالەری', QUOTE: 'وتە', STATS: 'ئامار' }
function blockTypeLabel(t) { return blockTypeLabelMap[t] || t }
function activeBlockTitle(block) { return activeLang.value === 'ckb' ? block.ckbContent.title : block.kmrContent.title }
function showTextField(type) { return ['TEXT','QUOTE','IMAGE','VIDEO','AUDIO','GALLERY','STATS'].includes(type) }
function showMediaField(type) { return ['IMAGE','VIDEO','AUDIO','GALLERY'].includes(type) }
function acceptForType(type) {
  return ({ IMAGE: 'image/*', VIDEO: 'video/*', AUDIO: 'audio/*', GALLERY: 'image/*' })[type] || '*/*'
}

function addBlock(type) {
  form.blocks.push({ _uid: makeUid(), _open: true, _uploading: false, _metadataJson: '{}',
    contentType: type, ckbContent: blankBlockContent(), kmrContent: blankBlockContent(),
    mediaUrl: '', thumbnailUrl: '', metadata: {} })
}
function removeBlock(idx) { form.blocks.splice(idx, 1) }
function moveBlock(idx, dir) {
  const t = idx + dir
  if (t < 0 || t >= form.blocks.length) return
  ;[form.blocks[idx], form.blocks[t]] = [form.blocks[t], form.blocks[idx]]
}
function parseMetadata(block) {
  try { block.metadata = JSON.parse(block._metadataJson || '{}') } catch { /**/ }
}

const blockCounts = computed(() => {
  const m = {}; form.blocks.forEach(b => { m[b.contentType] = (m[b.contentType] || 0) + 1 }); return m
})

const totalFillFields = computed(() => 4 + form.blocks.filter(b => showTextField(b.contentType)).length)
const ckbFillCount = computed(() => {
  let n = 0
  if (form.slugCkb)                    n++
  if (form.ckbContent.title)           n++
  if (form.ckbContent.subtitle)        n++
  if (form.ckbContent.metaDescription) n++
  form.blocks.forEach(b => { if (showTextField(b.contentType) && (b.ckbContent.contentText || b.ckbContent.title)) n++ })
  return Math.min(n, totalFillFields.value)
})
const kmrFillCount = computed(() => {
  let n = 0
  if (form.slugKmr)                    n++
  if (form.kmrContent.title)           n++
  if (form.kmrContent.subtitle)        n++
  if (form.kmrContent.metaDescription) n++
  form.blocks.forEach(b => { if (showTextField(b.contentType) && (b.kmrContent.contentText || b.kmrContent.title)) n++ })
  return Math.min(n, totalFillFields.value)
})

// ─── Hero Image Upload ────────────────────────────────────────────────────────

async function uploadHeroImage(event) {
  const file = event.target.files?.[0]; if (!file) return
  heroUploading.value = true
  try {
    const fd = new FormData()
    fd.append('file', file)
    fd.append('type', 'image')
    const { data } = await api.post('/api/v1/about/upload', fd, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    const payload = data?.data ?? data
    form.heroImageUrl = payload?.fileUrl ?? payload?.url ?? ''
    showToast('success', 'وێنەی هیرۆ بارکرا ✓')
  } catch (e) {
    showToast('error', e?.response?.data?.message || 'بارکردن سەرکەوتوو نەبوو')
  } finally {
    heroUploading.value = false
    event.target.value = ''
  }
}

function removeHeroImage() {
  form.heroImageUrl = ''
}

// ─── Block Media Upload ───────────────────────────────────────────────────────

async function uploadBlockMedia(event, blockIdx) {
  const file = event.target.files?.[0]; if (!file) return
  const block = form.blocks[blockIdx]; block._uploading = true
  try {
    const fd = new FormData(); fd.append('file', file)
    const { data } = await api.post('/api/v1/about/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
    const payload = data?.data ?? data
    block.mediaUrl = payload?.fileUrl ?? payload?.url ?? ''
    showToast('success', 'فایل بارکرا ✓')
  } catch (e) {
    showToast('error', e?.response?.data?.message || 'بارکردن سەرکەوتوو نەبوو')
  } finally { block._uploading = false; event.target.value = '' }
}

// ─── Validation ───────────────────────────────────────────────────────────────

function validate() {
  const e = {}
  if (!form.slugCkb.trim())             e.slugCkb  = 'سلەگی سۆرانی پێویستە'
  if (form.slugKmr && form.slugKmr.trim() === form.slugCkb.trim())
                                         e.slugKmr  = 'سلەگی کرمانجی دەبێت جیاواز بێت لە سۆرانی'
  if (!form.ckbContent.title.trim())    e.ckbTitle = 'ناونیشانی سۆرانی پێویستە'
  errors.value = e
  if (e.slugCkb || e.ckbTitle) activeLang.value = 'ckb'
  if (e.slugKmr && !e.slugCkb && !e.ckbTitle) activeLang.value = 'kmr'
  return !Object.keys(e).length
}

// ─── Load (edit mode) ─────────────────────────────────────────────────────────

async function loadAbout() {
  if (!isEdit.value) return
  fetching.value = true
  try {
    const { data } = await api.get('/api/v1/about')
    const list  = data?.data ?? data
    const found = (Array.isArray(list) ? list : []).find(a => String(a.id) === String(route.params.id))
    if (!found) throw new Error('نەدۆزرایەوە')
    existingData.value = found
    form.slugCkb      = found.slugCkb || ''
    form.slugKmr      = found.slugKmr || ''
    form.heroImageUrl = found.heroImageUrl || ''
    form.ckbContent   = { title: found.ckbContent?.title || '', subtitle: found.ckbContent?.subtitle || '', metaDescription: found.ckbContent?.metaDescription || '' }
    form.kmrContent   = { title: found.kmrContent?.title || '', subtitle: found.kmrContent?.subtitle || '', metaDescription: found.kmrContent?.metaDescription || '' }
    form.blocks = (found.blocks || []).map(b => ({
      _uid: makeUid(), _open: false, _uploading: false,
      _metadataJson: b.metadata ? JSON.stringify(b.metadata, null, 2) : '{}',
      contentType: b.contentType || 'TEXT',
      ckbContent: { contentText: b.ckbContent?.contentText || '', title: b.ckbContent?.title || '', altText: b.ckbContent?.altText || '' },
      kmrContent: { contentText: b.kmrContent?.contentText || '', title: b.kmrContent?.title || '', altText: b.kmrContent?.altText || '' },
      mediaUrl: b.mediaUrl || '', thumbnailUrl: b.thumbnailUrl || '', metadata: b.metadata || {}
    }))
  } catch (e) {
    showToast('error', e?.response?.data?.message || e.message || 'بارکردن سەرکەوتوو نەبوو')
  } finally { fetching.value = false }
}

// ─── Submit ───────────────────────────────────────────────────────────────────

async function submit() {
  if (!validate()) { window.scrollTo({ top: 0, behavior: 'smooth' }); return }
  saving.value = true
  const dto = {
    slugCkb:      form.slugCkb.trim(),
    slugKmr:      form.slugKmr.trim() || null,
    heroImageUrl: form.heroImageUrl.trim() || null,
    ckbContent: { title: form.ckbContent.title || null, subtitle: form.ckbContent.subtitle || null, metaDescription: form.ckbContent.metaDescription || null },
    kmrContent: { title: form.kmrContent.title || null, subtitle: form.kmrContent.subtitle || null, metaDescription: form.kmrContent.metaDescription || null },
    blocks: form.blocks.map((b, idx) => ({
      contentType: b.contentType, sequence: idx,
      ckbContent: { contentText: b.ckbContent.contentText || null, title: b.ckbContent.title || null, altText: b.ckbContent.altText || null },
      kmrContent: { contentText: b.kmrContent.contentText || null, title: b.kmrContent.title || null, altText: b.kmrContent.altText || null },
      mediaUrl: b.mediaUrl || null, thumbnailUrl: b.thumbnailUrl || null,
      metadata: b.metadata && Object.keys(b.metadata).length ? b.metadata : null
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
  } finally { saving.value = false }
}

async function doDelete() {
  if (!confirm(`دڵنیای لە سڕینەوەی دەربارە #${route.params.id}؟`)) return
  try {
    await api.delete(`/api/v1/about/${route.params.id}`)
    showToast('success', 'سڕایەوە ✓')
    setTimeout(() => router.push('/admin/about'), 800)
  } catch (e) { showToast('error', e?.response?.data?.message || 'سڕینەوە سەرکەوتوو نەبوو') }
}

function showToast(type, msg) {
  toast.value = { show: true, type, msg }
  setTimeout(() => { toast.value.show = false }, 3500)
}

onMounted(loadAbout)
</script>

<style scoped>
.aed { direction: rtl; max-width: 1200px; margin: 0 auto; }
.aed__head { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
.aed__back { display: inline-flex; align-items: center; gap: .4rem; text-decoration: none; color: var(--muted, #767571); font-weight: 700; font-size: .9rem; padding: .45rem .7rem; border-radius: 10px; background: var(--white, #fff); border: 1px solid var(--border, #E0DFDC); transition: all .15s; }
.aed__back:hover { border-color: #8C1515; color: #8C1515; }
.aed__title { margin: 0; font-weight: 900; font-size: clamp(1.2rem, 2vw, 1.6rem); color: var(--text, #2E2D29); }
.aed__sub { margin: .15rem 0 0; color: var(--muted, #767571); font-weight: 600; font-size: .85rem; }
.aed__layout { display: grid; grid-template-columns: 1fr 300px; gap: 1.2rem; align-items: start; }
@media (max-width: 900px) { .aed__layout { grid-template-columns: 1fr; } }
.col-main { display: flex; flex-direction: column; gap: 1rem; }
.col-side { display: flex; flex-direction: column; gap: 1rem; }

/* Lang switcher */
.lang-switcher { display: flex; gap: .3rem; margin-right: auto; background: #f0eeeb; border-radius: 12px; padding: .25rem; }
.lang-btn { display: inline-flex; align-items: center; gap: .4rem; padding: .4rem .9rem; border-radius: 9px; border: none; background: transparent; font-weight: 800; font-size: .85rem; color: var(--muted, #767571); cursor: pointer; transition: all .18s; font: inherit; }
.lang-btn--active { background: #fff; color: var(--text, #2E2D29); box-shadow: 0 2px 8px rgba(0,0,0,.08); }
.lang-btn__dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }
.lang-btn__dot--ckb { background: #8C1515; }
.lang-btn__dot--kmr { background: #1d6bbf; }

/* Cards */
.card { background: var(--white, #fff); border: 1px solid var(--border, #E0DFDC); border-radius: 16px; padding: 1.25rem; box-shadow: 0 4px 16px rgba(0,0,0,.03); }
.card--sticky { position: sticky; top: 1rem; }
.card__hd { display: flex; align-items: center; gap: .5rem; font-weight: 800; color: var(--text, #2E2D29); margin-bottom: 1rem; font-size: .95rem; padding-bottom: .7rem; border-bottom: 1px solid #f0eeeb; }
.card__hd-ico { font-size: 1.1rem; }
.card__hd-badge { margin-right: auto; background: #8C1515; color: #fff; font-size: .75rem; font-weight: 800; padding: .1rem .45rem; border-radius: 8px; min-width: 22px; text-align: center; }
.card__hd-lang { font-size: .72rem; font-weight: 800; padding: .15rem .5rem; border-radius: 6px; }
.card__hd-lang--ckb { background: #fef2f2; color: #8C1515; }
.card__hd-lang--kmr { background: #eff6ff; color: #1d6bbf; }
.card__hd-hint { font-size: .72rem; font-weight: 600; color: var(--muted, #767571); background: #f0eeeb; padding: .15rem .5rem; border-radius: 6px; margin-right: auto; }
.ms-auto { margin-right: auto; }

/* ── Hero Image Field ─────────────────────────────────────────── */
.hero-field { display: flex; flex-direction: column; gap: .75rem; }

.hero-preview {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  background: #FAFAF9;
  border: 2px dashed var(--border, #E0DFDC);
  transition: border-color .2s;
}
.hero-preview:has(img) { border-style: solid; border-color: #c8c6c1; }
.hero-preview__img {
  display: block;
  width: 100%;
  height: 200px;
  object-fit: cover;
  object-position: center 30%;
}
.hero-preview__placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: .5rem;
  height: 160px;
  color: var(--muted, #767571);
}
.hero-preview__placeholder svg { opacity: .4; }
.hero-preview__placeholder span { font-weight: 600; font-size: .85rem; }
.hero-preview__hint { font-size: .75rem; opacity: .7; }
.hero-preview__remove {
  position: absolute;
  top: .6rem;
  left: .6rem;
  width: 28px; height: 28px;
  border-radius: 8px;
  background: rgba(220, 38, 38, .85);
  backdrop-filter: blur(4px);
  border: none;
  color: #fff;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  transition: background .15s;
}
.hero-preview__remove:hover { background: rgba(185, 28, 28, 1); }

.hero-input-row { display: flex; gap: .5rem; }
.hero-input-row .slug-input-wrap { flex: 1; }

/* Slug row — side by side */
.slug-row { display: grid; grid-template-columns: 1fr 1fr; gap: .75rem; margin-bottom: .25rem; }
@media (max-width: 600px) { .slug-row { grid-template-columns: 1fr; } }
.slug-field { border: 1.5px solid var(--border, #E0DFDC); border-radius: 12px; padding: .75rem; transition: border-color .2s; }
.slug-field--active.slug-field:has(.lbl__lang--ckb) { border-color: rgba(140,21,21,.3); background: #fffafa; }
.slug-field--active.slug-field:has(.lbl__lang--kmr) { border-color: rgba(29,107,191,.3); background: #f8fbff; }
.slug-input-wrap { position: relative; display: flex; align-items: center; }
.slug-input-wrap__prefix { position: absolute; right: .75rem; color: var(--muted, #767571); display: flex; }
.inp--slug { padding-right: 2.2rem; font-family: monospace; font-size: .9rem; }

/* Fields */
.field { margin-bottom: .85rem; }
.field-row { display: flex; gap: .75rem; }
@media (max-width: 600px) { .field-row { flex-direction: column; } }
.lbl { display: flex; align-items: center; gap: .4rem; font-weight: 700; color: var(--text, #2E2D29); margin-bottom: .3rem; font-size: .85rem; }
.lbl--req::after { content: ' *'; color: #8C1515; font-weight: 800; }
.lbl__lang { font-size: .7rem; font-weight: 800; padding: .1rem .4rem; border-radius: 5px; }
.lbl__lang--ckb { background: #fef2f2; color: #8C1515; }
.lbl__lang--kmr { background: #eff6ff; color: #1d6bbf; }
.lbl__optional { font-size: .7rem; font-weight: 600; color: var(--muted, #767571); background: #f0eeeb; padding: .1rem .4rem; border-radius: 5px; }
.field__hint-inline { font-size: .72rem; font-weight: 600; color: var(--muted, #767571); background: #f0eeeb; padding: .1rem .4rem; border-radius: 5px; }
.inp { width: 100%; padding: .65rem .85rem; border: 1.5px solid var(--border, #E0DFDC); border-radius: 10px; font: inherit; color: var(--text, #2E2D29); background: var(--white, #fff); transition: border-color .2s; box-sizing: border-box; }
.inp:focus { outline: none; border-color: #8C1515; }
.inp--err { border-color: #dc2626; }
.ta { resize: vertical; min-height: 80px; line-height: 1.7; }
.ta--sm { min-height: 56px; }
.ta--code { font-family: monospace; font-size: .85rem; direction: ltr; text-align: left; }
.err { color: #dc2626; font-size: .82rem; font-weight: 600; margin-top: .25rem; }
.field__hint { color: var(--muted, #767571); font-size: .8rem; margin-top: .2rem; }

/* Fill status */
.fill-status { display: flex; gap: 1rem; margin-top: .75rem; padding: .6rem .75rem; border-radius: 10px; background: #FAFAF9; border: 1px solid #f0eeeb; }
.fill-status__item { display: flex; align-items: center; gap: .4rem; font-size: .78rem; font-weight: 700; color: var(--muted, #767571); }
.fill-status__item--ok { color: #065f46; }
.fill-status__dot { width: 7px; height: 7px; border-radius: 50%; background: #d1d5db; }
.fill-status__item--ok .fill-status__dot { background: #10b981; }

/* Hero status in sidebar */
.hero-status { font-size: .78rem; font-weight: 700; display: inline-flex; align-items: center; gap: .25rem; }
.hero-status--ok    { color: #065f46; }
.hero-status--empty { color: var(--muted, #767571); }

/* Blocks */
.blocks-list { display: flex; flex-direction: column; gap: .6rem; margin-bottom: 1rem; }
.block-card { border: 1.5px solid var(--border, #E0DFDC); border-radius: 14px; overflow: hidden; transition: border-color .2s; }
.block-card:hover { border-color: #c8c6c1; }
.block-card__header { display: flex; align-items: center; justify-content: space-between; padding: .65rem .85rem; background: #FAFAF9; }
.block-card__left { display: flex; align-items: center; gap: .5rem; min-width: 0; flex: 1; }
.block-card__seq { width: 24px; height: 24px; border-radius: 6px; background: #e8e5e1; color: var(--muted, #767571); display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: .75rem; flex-shrink: 0; }
.block-card__type-badge { display: inline-block; padding: .1rem .45rem; border-radius: 6px; font-weight: 700; font-size: .73rem; flex-shrink: 0; }
.block-card__type-badge--text    { background: #eff6ff; color: #1d4ed8; }
.block-card__type-badge--image   { background: #ecfdf5; color: #065f46; }
.block-card__type-badge--video   { background: #fef3c7; color: #92400e; }
.block-card__type-badge--audio   { background: #fdf4ff; color: #7c3aed; }
.block-card__type-badge--gallery { background: #fff7ed; color: #c2410c; }
.block-card__type-badge--quote   { background: #f0eeeb; color: #57534e; }
.block-card__type-badge--stats   { background: #f0fdf4; color: #166534; }
.block-card__title-text { font-weight: 600; font-size: .85rem; color: var(--text, #2E2D29); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 180px; }
.block-card__lang-dots { display: flex; gap: .2rem; margin-right: auto; }
.block-card__lang-dot { display: inline-flex; align-items: center; justify-content: center; width: 18px; height: 18px; border-radius: 5px; font-size: .65rem; font-weight: 800; background: #f0eeeb; color: #aaa; }
.block-card__lang-dot--filled { background: #ecfdf5; color: #065f46; }
.block-card__actions { display: flex; gap: .3rem; flex-shrink: 0; }
.block-btn { width: 28px; height: 28px; border-radius: 7px; border: 1px solid var(--border, #E0DFDC); background: var(--white, #fff); display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--muted, #767571); transition: all .12s; }
.block-btn:hover:not(:disabled) { border-color: #8C1515; color: #8C1515; background: #faf0f0; }
.block-btn:disabled { opacity: .35; cursor: not-allowed; }
.block-btn--del:hover:not(:disabled) { border-color: #dc2626; color: #dc2626; background: #fef2f2; }
.block-btn--toggle { border: none; background: transparent; }
.block-card__body { padding: 1rem .85rem; border-top: 1px solid #f0eeeb; }
.block-body-enter-active { transition: all .25s ease; }
.block-body-leave-active { transition: all .15s ease; }
.block-body-enter-from, .block-body-leave-to { opacity: 0; }
.block-fill-status { display: flex; gap: .5rem; margin-top: .75rem; padding-top: .6rem; border-top: 1px dashed #f0eeeb; }
.fill-dot { font-size: .72rem; font-weight: 800; padding: .12rem .45rem; border-radius: 5px; background: #f0eeeb; color: #aaa; }
.fill-dot--ok { background: #ecfdf5; color: #065f46; }
.media-input-row { display: flex; gap: .5rem; }
.media-input-row .inp { flex: 1; }
.upload-btn { display: inline-flex; align-items: center; gap: .4rem; padding: .6rem .9rem; border-radius: 10px; background: #FAFAF9; border: 1.5px solid var(--border, #E0DFDC); font-weight: 700; font-size: .85rem; color: var(--muted, #767571); cursor: pointer; transition: all .15s; white-space: nowrap; font: inherit; }
.upload-btn:hover { border-color: #8C1515; color: #8C1515; background: #faf0f0; }
.upload-btn--loading { opacity: .7; cursor: not-allowed; }
.upload-progress { display: flex; align-items: center; gap: .5rem; margin-top: .4rem; font-size: .82rem; color: var(--muted, #767571); }
.upload-progress__bar { width: 80px; height: 4px; border-radius: 4px; background: #e8e5e1; overflow: hidden; position: relative; }
.upload-progress__bar::after { content: ''; position: absolute; inset: 0; background: #8C1515; border-radius: 4px; animation: progress-slide 1.5s ease infinite; }
@keyframes progress-slide { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }
.block-preview-img { margin: .5rem 0; }
.block-preview-img img { max-width: 100%; max-height: 200px; border-radius: 10px; object-fit: cover; border: 1px solid #f0eeeb; }
.blocks-empty { text-align: center; padding: 1.5rem; color: var(--muted, #767571); }
.blocks-empty__ico { width: 56px; height: 56px; border-radius: 50%; background: #FAFAF9; border: 1px solid #E0DFDC; display: flex; align-items: center; justify-content: center; margin: 0 auto .6rem; }
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
.stats-editor { margin-top: .5rem; }

/* Sidebar */
.slug-code { font-family: monospace; font-size: .78rem; padding: .1rem .4rem; border-radius: 5px; }
.slug-code--ckb { background: #fef2f2; color: #8C1515; }
.slug-code--kmr { background: #eff6ff; color: #1d6bbf; }
.lang-completeness { margin-bottom: 1rem; display: flex; flex-direction: column; gap: .5rem; }
.lang-completeness__row { display: flex; align-items: center; gap: .5rem; flex-wrap: wrap; }
.lang-completeness__label { font-size: .75rem; font-weight: 800; padding: .1rem .4rem; border-radius: 5px; min-width: 52px; text-align: center; }
.lang-completeness__label--ckb { background: #fef2f2; color: #8C1515; }
.lang-completeness__label--kmr { background: #eff6ff; color: #1d6bbf; }
.lang-completeness__val { font-size: .75rem; color: var(--muted, #767571); font-weight: 600; min-width: 38px; text-align: left; }
.lang-completeness__bar { flex: 1; height: 5px; border-radius: 4px; background: #f0eeeb; overflow: hidden; }
.lang-completeness__bar-fill { height: 100%; border-radius: 4px; transition: width .4s ease; }
.lang-completeness__bar-fill--ckb { background: #8C1515; }
.lang-completeness__bar-fill--kmr { background: #1d6bbf; }
.publish-info { margin-bottom: 1rem; }
.publish-info__row { display: flex; justify-content: space-between; align-items: center; padding: .4rem 0; font-size: .85rem; border-bottom: 1px solid #f0eeeb; color: var(--muted, #767571); gap: .5rem; }
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
.btn { display: inline-flex; align-items: center; justify-content: center; gap: .4rem; text-decoration: none; border-radius: 12px; padding: .75rem 1rem; font-weight: 900; border: 1px solid transparent; transition: .18s ease; white-space: nowrap; cursor: pointer; font: inherit; }
.btn:hover { transform: translateY(-1px); }
.btn--primary { background: #8C1515; color: #fff; box-shadow: 0 10px 24px rgba(140,21,21,.18); }
.btn--danger  { background: #fff; color: #dc2626; border-color: #fecaca; }
.btn--danger:hover { background: #fef2f2; }
.btn--full { width: 100%; }
.spinner { width: 16px; height: 16px; border-radius: 50%; border: 2px solid rgba(255,255,255,.3); border-top-color: #fff; animation: spin .7s linear infinite; }
.spinner--dark { border-color: rgba(0,0,0,.15); border-top-color: var(--muted, #767571); }
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