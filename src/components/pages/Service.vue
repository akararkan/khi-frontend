<template>
  <main id="main-content" class="svc-page" :dir="lang.dir" :lang="lang.strings.code">

    <!-- ═══════════════════ LISTING ═══════════════════ -->
    <transition name="page" mode="out-in">
      <div v-if="!activeService" key="listing" class="listing">

        <!-- HERO -->
        <header class="hero">
          <div class="hero__bg"></div>
          <div class="hero__overlay"></div>
          <div class="hero__inner container">
            <p class="hero__kicker">{{ t('kicker') }}</p>
            <h1 class="hero__title">{{ t('pageTitle') }}</h1>
            <p class="hero__sub">{{ t('pageSub') }}</p>
            <div class="hero__stats">
              <div class="hstat">
                <span class="hstat__val">{{ services.length }}</span>
                <span class="hstat__lbl">{{ t('totalServices') }}</span>
              </div>
              <div class="hstat">
                <span class="hstat__val">{{ serviceTypes.length }}</span>
                <span class="hstat__lbl">{{ t('types') }}</span>
              </div>
            </div>
          </div>
        </header>

        <!-- TOOLBAR -->
        <section class="toolbar-section">
          <div class="container toolbar">
            <div class="toolbar__search">
              <svg class="toolbar__ico" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              <input v-model.trim="q" type="text" class="toolbar__input" :placeholder="t('searchPlaceholder')" />
            </div>
            <div class="toolbar__pills">
              <button class="pill" :class="{ 'pill--on': typeFilter === 'all' }" @click="typeFilter = 'all'">{{ t('all') }}</button>
              <button v-for="tp in serviceTypes" :key="tp" class="pill" :class="{ 'pill--on': typeFilter === tp }" @click="typeFilter = tp">{{ tp }}</button>
            </div>
            <div class="toolbar__sort">
              <select v-model="sortBy" class="toolbar__sel">
                <option value="newest">{{ t('newest') }}</option>
                <option value="oldest">{{ t('oldest') }}</option>
                <option value="title">{{ t('byTitle') }}</option>
              </select>
            </div>
          </div>
        </section>

        <!-- LOADING -->
        <section v-if="loading" class="section">
          <div class="container">
            <div class="grid">
              <div v-for="i in 6" :key="i" class="skel" :style="{ '--d': `${(i-1)*0.07}s` }">
                <div class="skel__thumb shimmer"></div>
                <div class="skel__body">
                  <div class="skel__line shimmer" style="width:55%"></div>
                  <div class="skel__line shimmer" style="width:100%;margin-top:.5rem"></div>
                  <div class="skel__line shimmer" style="width:75%"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- ERROR -->
        <section v-else-if="error" class="section">
          <div class="container state">
            <div class="state__icon">⚠</div>
            <p class="state__msg">{{ error }}</p>
            <button class="btn-primary" @click="fetchServices">{{ t('retry') }}</button>
          </div>
        </section>

        <!-- EMPTY -->
        <section v-else-if="filtered.length === 0" class="section">
          <div class="container state">
            <div class="state__icon">📂</div>
            <h3 class="state__title">{{ t('noResults') }}</h3>
            <p class="state__msg">{{ t('noResultsHint') }}</p>
            <button class="btn-primary" @click="resetFilters">{{ t('reset') }}</button>
          </div>
        </section>

        <!-- GRID -->
        <section v-else class="section">
          <div class="container">
            <div class="section__head">
              <h2 class="section__title">{{ t('listTitle') }}</h2>
              <span class="section__count"><b>{{ filtered.length }}</b> {{ t('service') }}</span>
            </div>

            <div class="grid">
              <article
                v-for="(svc, i) in filtered"
                :key="svc.id"
                class="card"
                :class="{ 'card--featured': i === 0 }"
                :style="{ '--d': `${i * 0.04}s` }"
                tabindex="0"
                @click="openService(svc)"
                @keyup.enter="openService(svc)"
              >
                <div class="card__thumb">
                  <img v-if="svc.coverMediaUrl" :src="resolveUrl(svc.coverMediaUrl)" :alt="svcTitle(svc)" loading="lazy" class="card__img" @error="onImgError" />
                  <div v-else class="card__placeholder">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                  </div>
                  <span class="card__badge" v-if="svc.serviceType">{{ svc.serviceType }}</span>
                </div>
                <div class="card__body">
                  <div class="card__meta">
                    <span class="card__date" v-if="svc.publishedAt || svc.createdAt">{{ formatDate(svc.publishedAt || svc.createdAt) }}</span>
                    <span class="card__loc" v-if="svc.location">📍 {{ svc.location }}</span>
                  </div>
                  <h3 class="card__title">{{ svcTitle(svc) }}</h3>
                  <p class="card__desc">{{ truncate(svcDesc(svc), 120) }}</p>
                  <div class="card__foot">
                    <span class="card__cta">{{ t('viewService') }}</span>
                    <span class="card__arrow">{{ lang.isKMR ? '→' : '←' }}</span>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>
      </div>

      <!-- ═══════════════════ DETAIL VIEW ═══════════════════ -->
      <div v-else key="detail" class="detail">

        <!-- STICKY NAV -->
        <nav class="dnav">
          <div class="container dnav__inner">
            <button class="back-btn" @click="closeService">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
              <span>{{ t('backToServices') }}</span>
            </button>

            <div class="dnav__langs" v-if="detailHasBothLangs">
              <button
                class="langpill"
                :class="{ 'langpill--active': detailLang === 'CKB' }"
                @click="detailLang = 'CKB'"
              >
                <span class="langpill__dot langpill__dot--ckb"></span>
                <span>سۆرانی</span>
              </button>
              <button
                class="langpill"
                :class="{ 'langpill--active': detailLang === 'KMR' }"
                @click="detailLang = 'KMR'"
              >
                <span class="langpill__dot langpill__dot--kmr"></span>
                <span>Kurmancî</span>
              </button>
            </div>
          </div>
        </nav>

        <!-- DETAIL HERO -->
        <header class="dhero">
          <div class="dhero__bg" :style="activeService.coverMediaUrl ? { backgroundImage: `url(${resolveUrl(activeService.coverMediaUrl)})` } : {}"></div>
          <div class="dhero__gradient"></div>

          <div class="container dhero__content">
            <div class="dhero__badges">
              <span class="dbadge" v-if="activeService.serviceType">{{ activeService.serviceType }}</span>
              <span class="dbadge" v-if="activeService.location">📍 {{ activeService.location }}</span>
              <span class="dbadge" v-if="activeService.publishedAt">📅 {{ formatDate(activeService.publishedAt) }}</span>
            </div>
            <transition name="lang-swap" mode="out-in">
              <div :key="detailLang">
                <h1 class="dhero__title">{{ detailTitle }}</h1>
                <p class="dhero__desc" v-if="detailDescription">{{ detailDescription }}</p>
              </div>
            </transition>
          </div>
        </header>

        <!-- CONTENT BLOCKS -->
        <div class="su-stack">

          <section v-if="detailDescription" class="su-text-block">
            <div class="su-container">
              <h2 class="su-block-h">{{ t('description') }}</h2>
              <div class="su-prose su-prose--wide" v-html="formatParagraphs(detailDescription)"></div>
            </div>
          </section>

          <template v-for="(col, ci) in activeService.mediaCollections || []" :key="col.id || ci">
            <div class="su-rule" aria-hidden="true"></div>

            <section class="su-text-block" v-if="col.collectionName">
              <div class="su-container">
                <h2 class="su-block-h">{{ col.collectionName }}</h2>
              </div>
            </section>

            <template v-for="(file, fi) in col.files || []" :key="file.id || fi">

              <!-- IMAGE -->
              <section v-if="isImage(file)" class="su-duo" :class="{ 'su-duo--reversed': fi % 2 !== 0 }">
                <div class="su-duo__text">
                  <h3 v-if="fileTitle(file)" class="su-block-h su-block-h--sm">{{ fileTitle(file) }}</h3>
                  <p v-if="fileCaption(file)" class="su-prose su-prose--caption">{{ fileCaption(file) }}</p>
                  <div v-if="fileDescription(file)" class="su-prose" v-html="formatParagraphs(fileDescription(file))"></div>
                </div>
                <div class="su-duo__media">
                  <figure class="su-figure" @click="openLightbox(file)">
                    <div class="su-figure__crop">
                      <img :src="resolveUrl(file.fileUrl)" :alt="fileTitle(file) || svcTitle(activeService)" loading="lazy" />
                    </div>
                    <figcaption v-if="fileCaption(file)" class="su-figure__cap">{{ fileCaption(file) }}</figcaption>
                  </figure>
                </div>
              </section>

              <!-- VIDEO -->
              <section v-else-if="isVideo(file)" class="su-media-block">
                <div class="su-container">
                  <h3 v-if="fileTitle(file)" class="su-block-h center">{{ fileTitle(file) }}</h3>
                  <div class="su-video-wrapper shadow">
                    <iframe v-if="isEmbed(file.fileUrl)" :src="toEmbed(file.fileUrl)" frameborder="0" allowfullscreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>
                    <video v-else controls preload="metadata" :poster="activeService.coverMediaUrl ? resolveUrl(activeService.coverMediaUrl) : undefined">
                      <source :src="resolveUrl(file.fileUrl)" />
                    </video>
                  </div>
                  <p v-if="fileCaption(file)" class="su-caption">{{ fileCaption(file) }}</p>
                  <div v-if="fileDescription(file)" class="su-prose center" v-html="formatParagraphs(fileDescription(file))"></div>
                </div>
              </section>

              <!-- AUDIO -->
              <section v-else-if="isAudio(file)" class="su-audio-block">
                <div class="su-container">
                  <div class="su-audio-row">
                    <div class="su-audio-row__info">
                      <h3 v-if="fileTitle(file)" class="su-block-h su-block-h--sm">{{ fileTitle(file) }}</h3>
                      <p v-if="fileCaption(file)" class="su-prose su-prose--caption">{{ fileCaption(file) }}</p>
                      <div v-if="fileDescription(file)" class="su-prose" v-html="formatParagraphs(fileDescription(file))"></div>
                    </div>
                    <audio controls class="su-audio-row__el" preload="metadata">
                      <source :src="resolveUrl(file.fileUrl)" />
                    </audio>
                  </div>
                </div>
              </section>

              <!-- DOCUMENT / OTHER -->
              <section v-else class="su-doc-block">
                <div class="su-container">
                  <div class="su-doc-row">
                    <div class="su-doc-row__icon">📄</div>
                    <div class="su-doc-row__info">
                      <h3 v-if="fileTitle(file)" class="su-block-h su-block-h--sm">{{ fileTitle(file) }}</h3>
                      <p v-if="fileCaption(file)" class="su-prose su-prose--caption">{{ fileCaption(file) }}</p>
                      <div v-if="fileDescription(file)" class="su-prose" v-html="formatParagraphs(fileDescription(file))"></div>
                    </div>
                    <a v-if="file.fileUrl" :href="resolveUrl(file.fileUrl)" target="_blank" rel="noopener" class="btn-primary">{{ t('openDocument') }}</a>
                  </div>
                </div>
              </section>

            </template>
          </template>

          <!-- Gallery for images without text content -->
          <template v-if="galleryImages.length > 0">
            <div class="su-rule" aria-hidden="true"></div>
            <section class="su-media-block">
              <div class="su-container">
                <h2 class="su-block-h">{{ t('gallery') }}</h2>
                <div class="gallery-grid">
                  <figure
                    v-for="img in galleryImages"
                    :key="img.id || img.fileUrl"
                    class="gallery-grid__item"
                    @click="openLightbox(img)"
                  >
                    <img :src="resolveUrl(img.fileUrl)" :alt="fileTitle(img)" loading="lazy" />
                    <figcaption v-if="fileCaption(img)">{{ fileCaption(img) }}</figcaption>
                  </figure>
                </div>
              </div>
            </section>
          </template>
        </div>

        <!-- OTHER SERVICES -->
        <section v-if="otherServices.length" class="related">
          <div class="container">
            <h2 class="related__title">{{ t('otherServices') }}</h2>
            <div class="related__grid">
              <article
                v-for="svc in otherServices"
                :key="svc.id"
                class="rcard"
                @click="openService(svc)"
              >
                <div class="rcard__thumb">
                  <img v-if="svc.coverMediaUrl" :src="resolveUrl(svc.coverMediaUrl)" :alt="svcTitle(svc)" loading="lazy" />
                  <div v-else class="rcard__placeholder"></div>
                </div>
                <div class="rcard__body">
                  <span class="rcard__type" v-if="svc.serviceType">{{ svc.serviceType }}</span>
                  <h4 class="rcard__title">{{ svcTitle(svc) }}</h4>
                </div>
              </article>
            </div>
          </div>
        </section>

      </div>
    </transition>

    <!-- LIGHTBOX -->
    <Teleport to="body">
      <Transition name="lb">
        <div v-if="lightbox" class="lb" role="dialog" aria-modal="true" @click.self="lightbox = null">
          <button class="lb__close" @click="lightbox = null" aria-label="Close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
          <figure class="lb__fig">
            <img :src="resolveUrl(lightbox.fileUrl)" :alt="fileTitle(lightbox)" />
            <figcaption v-if="fileCaption(lightbox)">{{ fileCaption(lightbox) }}</figcaption>
          </figure>
        </div>
      </Transition>
    </Teleport>

  </main>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import api from '@/api'
import { API_BASE_URL } from '../consts.js'
import { useLanguageStore } from '@/stores/useLanguageStore'

const lang = useLanguageStore()
const API_ROOT = API_BASE_URL.replace('/api/v1', '')

// ── i18n ─────────────────────────────────────────────────────
const STRINGS = {
  CKB: {
    kicker: 'خزمەتگوزاری',
    pageTitle: 'خزمەتگوزارییەکان',
    pageSub: 'خزمەتگوزارییەکانی پەیمانگای کەلەپووری کوردی بۆ پشتگیری لە کەلتوور و میرات',
    totalServices: 'کۆی خزمەتگوزاری',
    types: 'جۆر',
    searchPlaceholder: 'گەڕان بۆ خزمەتگوزاری...',
    all: 'هەموو',
    newest: 'نوێترین',
    oldest: 'کۆنترین',
    byTitle: 'ناونیشان',
    listTitle: 'خزمەتگوزارییەکان',
    service: 'خزمەتگوزاری',
    viewService: 'بینینی خزمەتگوزاری',
    noResults: 'هیچ خزمەتگوزارییەک نەدۆزرایەوە',
    noResultsHint: 'تکایە فلتەرێکی تر هەڵبژێرە یان ڕیسێت بکە',
    reset: 'ڕیسێت',
    retry: 'دووبارە هەوڵبدەرەوە',
    backToServices: 'خزمەتگوزارییەکان',
    description: 'وەسف',
    gallery: 'گالەری',
    otherServices: 'خزمەتگوزارییەکانی تر',
    openDocument: 'کردنەوەی فایل',
    loading: 'بارکردن...',
  },
  KMR: {
    kicker: 'Karûbar',
    pageTitle: 'Karûbar',
    pageSub: 'Karûbarên Enstîtuya Mîrasa Kurdî ji bo piştgirîkirina çand û mîrasê',
    totalServices: 'Tevahiya Karûbar',
    types: 'Cure',
    searchPlaceholder: 'Li karûbaran bigere...',
    all: 'Hemû',
    newest: 'Nûtirîn',
    oldest: 'Kevntirîn',
    byTitle: 'Sernav',
    listTitle: 'Karûbar',
    service: 'Karûbar',
    viewService: 'Binêre Karûbar',
    noResults: 'Tu karûbar nehate dîtin',
    noResultsHint: 'Ji kerema xwe filterek din hilbijêre an jî reset bike',
    reset: 'Reset',
    retry: 'Dîsa biceribîne',
    backToServices: 'Karûbar',
    description: 'Danasîn',
    gallery: 'Galerî',
    otherServices: 'Karûbarên din',
    openDocument: 'Pelê veke',
    loading: 'Barkirin...',
  },
}
const t = key => STRINGS[lang.activeLang]?.[key] ?? STRINGS.CKB[key]

// ── State ────────────────────────────────────────────────────
const services      = ref([])
const loading       = ref(true)
const error         = ref(null)
const activeService = ref(null)
const lightbox      = ref(null)
const detailLang    = ref(lang.activeLang)

// Filters
const q          = ref('')
const typeFilter = ref('all')
const sortBy     = ref('newest')

// ── Fetch ────────────────────────────────────────────────────
async function fetchServices() {
  loading.value = true
  error.value   = null
  try {
    const { data } = await api.get('/api/v1/services', { params: { size: 200 } })
    // ✅ FIX: Handle Spring Boot Page<T> response wrapped in ApiResponse
    // Structure: { data: { content: [...], totalElements, ... }, message: "..." }
    const wrapper = data?.data ?? data
    const list = wrapper?.content ?? (Array.isArray(wrapper) ? wrapper : [])
    services.value = Array.isArray(list) ? list : []
  } catch (e) {
    error.value = e?.response?.data?.message || e.message || 'Error loading services'
  } finally {
    loading.value = false
  }
}

onMounted(fetchServices)

watch(() => lang.activeLang, val => { detailLang.value = val })

// ── Content helpers ──────────────────────────────────────────
function pickContent(svc, langCode) {
  const code = (langCode || lang.activeLang).toUpperCase()
  const contents = svc.contents || []
  const primary   = contents.find(c => c.languageCode === code)
  const secondary = contents.find(c => c.languageCode !== code)
  return primary || secondary || {}
}

function svcTitle(svc) {
  return pickContent(svc)?.title || svc.serviceType || ''
}

function svcDesc(svc) {
  return pickContent(svc)?.description || ''
}

const detailTitle = computed(() => {
  if (!activeService.value) return ''
  return pickContent(activeService.value, detailLang.value)?.title || activeService.value.serviceType || ''
})

const detailDescription = computed(() => {
  if (!activeService.value) return ''
  return pickContent(activeService.value, detailLang.value)?.description || ''
})

const detailHasBothLangs = computed(() => {
  if (!activeService.value) return false
  const contents = activeService.value.contents || []
  return contents.some(c => c.languageCode === 'CKB') && contents.some(c => c.languageCode === 'KMR')
})

function fileContent(file) {
  const code = detailLang.value?.toUpperCase()
  if (code === 'KMR' && file.kmrContent?.title) return file.kmrContent
  if (code === 'KMR' && file.kmrContent?.caption) return file.kmrContent
  if (code === 'CKB' && file.ckbContent?.title) return file.ckbContent
  if (code === 'CKB' && file.ckbContent?.caption) return file.ckbContent
  return file.ckbContent || file.kmrContent || {}
}

function fileTitle(file) { return fileContent(file)?.title || '' }
function fileCaption(file) { return fileContent(file)?.caption || '' }
function fileDescription(file) { return fileContent(file)?.description || '' }

// ── Media type helpers ───────────────────────────────────────
// ✅ FIX: Backend returns normalized format names like "JPEG", "MP4", "MP3"
//    NOT MIME types like "image/jpeg". Updated regex to match.

function isImage(file) {
  if (file.fileFormat && /^(JPEG|JPG|PNG|GIF|WEBP|SVG|BMP|TIFF|AVIF)$/i.test(file.fileFormat)) return true
  if (file.fileUrl) return /\.(jpe?g|png|gif|webp|svg|bmp|avif)(\?|$)/i.test(file.fileUrl)
  return false
}

function isVideo(file) {
  if (file.fileFormat && /^(MP4|MOV|MKV|WEBM|AVI|MPEG)$/i.test(file.fileFormat)) return true
  if (file.fileUrl) return /\.(mp4|webm|ogg|mov|avi|mkv)(\?|$)/i.test(file.fileUrl) || isEmbed(file.fileUrl)
  return false
}

function isAudio(file) {
  if (file.fileFormat && /^(MP3|WAV|AAC|FLAC|OGG|OPUS|M4A|WMA|ALAC)$/i.test(file.fileFormat)) return true
  if (file.fileUrl) return /\.(mp3|wav|ogg|aac|flac|m4a|opus)(\?|$)/i.test(file.fileUrl)
  return false
}

function isEmbed(url) { return url && (url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com')) }

function toEmbed(url) {
  if (!url) return ''
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`
  const vm = url.match(/vimeo\.com\/(\d+)/)
  if (vm) return `https://player.vimeo.com/video/${vm[1]}`
  return url
}

const galleryImages = computed(() => {
  if (!activeService.value) return []
  const all = []
  for (const col of activeService.value.mediaCollections || []) {
    for (const file of col.files || []) {
      if (isImage(file) && !fileTitle(file) && !fileCaption(file) && !fileDescription(file)) {
        all.push(file)
      }
    }
  }
  return all
})

// ── Filters ──────────────────────────────────────────────────
const serviceTypes = computed(() => {
  const set = new Set(services.value.map(s => s.serviceType).filter(Boolean))
  return Array.from(set)
})

const filtered = computed(() => {
  const text = q.value.toLowerCase()
  let list = services.value.filter(s => {
    const matchText = !text ||
      svcTitle(s).toLowerCase().includes(text) ||
      svcDesc(s).toLowerCase().includes(text) ||
      (s.serviceType || '').toLowerCase().includes(text) ||
      (s.location || '').toLowerCase().includes(text)
    const matchType = typeFilter.value === 'all' || s.serviceType === typeFilter.value
    return matchText && matchType
  })

  list = [...list]
  if (sortBy.value === 'newest') list.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))
  if (sortBy.value === 'oldest') list.sort((a, b) => (a.createdAt || '').localeCompare(b.createdAt || ''))
  if (sortBy.value === 'title') list.sort((a, b) => svcTitle(a).localeCompare(svcTitle(b)))
  return list
})

const otherServices = computed(() => {
  if (!activeService.value) return []
  return services.value.filter(s => s.id !== activeService.value.id).slice(0, 4)
})

function resetFilters() {
  q.value = ''
  typeFilter.value = 'all'
  sortBy.value = 'newest'
}

// ── Navigation ───────────────────────────────────────────────
function openService(svc) {
  activeService.value = svc
  detailLang.value = lang.activeLang
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function closeService() {
  activeService.value = null
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function openLightbox(file) {
  lightbox.value = file
}

// ── Utilities ────────────────────────────────────────────────
function resolveUrl(url) {
  if (!url) return ''
  if (url.startsWith('http')) return url
  return `${API_ROOT}${url.startsWith('/') ? '' : '/'}${url}`
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  try {
    return new Date(dateStr).toLocaleDateString(lang.strings.dateLocales?.[0] || 'en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    })
  } catch { return dateStr }
}

function truncate(text, max) {
  if (!text || text.length <= max) return text || ''
  return text.slice(0, max).replace(/\s+\S*$/, '') + '…'
}

function formatParagraphs(text) {
  if (!text) return ''
  return text.split('\n').filter(l => l.trim()).map(l => `<p>${l}</p>`).join('')
}

function onImgError(e) {
  e.target.style.display = 'none'
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;0,8..60,600;0,8..60,700;0,8..60,900&family=Source+Sans+3:wght@300;400;600;700&display=swap');

.svc-page {
  --cardinal: #8C1515;
  --cardinal-dark: #6f1111;
  --black: #2E2D29;
  --sandstone: #F4F4F2;
  --gold: #C9AA71;
  --warm-grey: #767571;
  --fog: #DAD8D2;
  --line: #D1CFC9;
  --serif: 'Source Serif 4', Georgia, serif;
  --sans: 'Source Sans 3', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  --max-w: 1200px;
  --radius: 16px;

  background: #fff;
  color: var(--black);
  font-family: var(--sans);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  min-height: 100vh;
}

.container {
  max-width: var(--max-w);
  margin: 0 auto;
  padding: 0 clamp(20px, 4vw, 52px);
}

.page-enter-active, .page-leave-active { transition: opacity .3s ease, transform .3s ease; }
.page-enter-from  { opacity: 0; transform: translateY(12px); }
.page-leave-to    { opacity: 0; transform: translateY(-12px); }

.lang-swap-enter-active, .lang-swap-leave-active { transition: opacity .2s ease; }
.lang-swap-enter-from, .lang-swap-leave-to { opacity: 0; }

.lb-enter-active, .lb-leave-active { transition: opacity .25s ease; }
.lb-enter-from, .lb-leave-to { opacity: 0; }

.hero {
  position: relative;
  min-height: 52vh;
  display: grid;
  place-items: center;
  overflow: hidden;
}
.hero__bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #1a0a0a 0%, #3d1111 40%, #8C1515 70%, #1a0a0a 100%);
}
.hero__overlay {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 30% 50%, rgba(200,170,113,0.12) 0%, transparent 60%);
}
.hero__inner {
  position: relative;
  z-index: 2;
  padding: 140px 0 60px;
  color: #fff;
  text-align: center;
}
.hero__kicker {
  display: inline-block;
  font-size: .75rem;
  letter-spacing: .2em;
  text-transform: uppercase;
  font-weight: 700;
  color: var(--gold);
  margin-bottom: 12px;
}
.hero__title {
  font-family: var(--serif);
  font-weight: 900;
  font-size: clamp(2.2rem, 5vw, 3.6rem);
  line-height: 1.08;
  margin: 0 0 14px;
}
.hero__sub {
  max-width: 56ch;
  margin: 0 auto 28px;
  opacity: .88;
  font-size: 1.05rem;
  line-height: 1.7;
}
.hero__stats {
  display: flex;
  justify-content: center;
  gap: 20px;
}
.hstat {
  background: rgba(255,255,255,.1);
  border: 1px solid rgba(255,255,255,.18);
  border-radius: 14px;
  padding: 14px 22px;
  backdrop-filter: blur(10px);
  text-align: center;
}
.hstat__val {
  display: block;
  font-weight: 900;
  font-size: 1.5rem;
  line-height: 1;
}
.hstat__lbl {
  display: block;
  font-size: .75rem;
  opacity: .85;
  margin-top: 4px;
}

.toolbar-section {
  background: var(--sandstone);
  border-bottom: 1px solid var(--fog);
  padding: 16px 0;
}
.toolbar {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}
.toolbar__search {
  flex: 1;
  min-width: 200px;
  display: flex;
  align-items: center;
  gap: 10px;
  background: #fff;
  border: 1px solid var(--fog);
  border-radius: 999px;
  padding: 10px 16px;
  transition: box-shadow .16s ease;
}
.toolbar__search:focus-within {
  box-shadow: 0 0 0 3px rgba(140,21,21,.12);
}
.toolbar__ico { color: var(--warm-grey); flex-shrink: 0; }
.toolbar__input {
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  font: inherit;
  font-size: .92rem;
}
.toolbar__pills {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}
.pill {
  border: 1px solid var(--fog);
  background: #fff;
  border-radius: 999px;
  padding: 8px 14px;
  font-weight: 700;
  font-size: .82rem;
  cursor: pointer;
  transition: all .16s ease;
}
.pill:hover { transform: translateY(-1px); }
.pill--on {
  background: rgba(140,21,21,.1);
  border-color: rgba(140,21,21,.25);
  color: var(--cardinal-dark);
}
.toolbar__sort { flex-shrink: 0; }
.toolbar__sel {
  border: 1px solid var(--fog);
  background: #fff;
  border-radius: 999px;
  padding: 8px 14px;
  font: inherit;
  font-weight: 700;
  font-size: .82rem;
  cursor: pointer;
}

.section { padding: 40px 0 60px; }
.section__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 24px;
}
.section__title {
  font-family: var(--serif);
  font-weight: 900;
  font-size: 1.6rem;
  margin: 0;
}
.section__count { color: var(--warm-grey); font-size: .9rem; }

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

.card {
  background: #fff;
  border: 1px solid rgba(0,0,0,.08);
  border-radius: var(--radius);
  overflow: hidden;
  cursor: pointer;
  transition: transform .2s ease, box-shadow .2s ease;
  animation: cardIn .4s ease both;
  animation-delay: var(--d, 0s);
}
@keyframes cardIn {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}
.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0,0,0,.1);
}
.card:focus-visible {
  outline: 3px solid rgba(140,21,21,.25);
  outline-offset: 2px;
}
.card__thumb {
  position: relative;
  aspect-ratio: 16/10;
  overflow: hidden;
  background: var(--sandstone);
}
.card__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform .35s ease;
}
.card:hover .card__img { transform: scale(1.04); }
.card__placeholder {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  color: var(--fog);
}
.card__badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0,0,0,.6);
  color: #fff;
  border-radius: 999px;
  padding: 5px 10px;
  font-size: .72rem;
  font-weight: 700;
}
[dir="ltr"] .card__badge { right: auto; left: 10px; }
.card__body { padding: 16px; }
.card__meta {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: .78rem;
  color: var(--warm-grey);
  margin-bottom: 8px;
}
.card__title {
  font-family: var(--serif);
  font-weight: 700;
  font-size: 1.12rem;
  line-height: 1.3;
  margin: 0 0 6px;
}
.card__desc {
  color: var(--warm-grey);
  font-size: .88rem;
  line-height: 1.6;
  margin: 0 0 12px;
}
.card__foot {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  font-size: .85rem;
  color: var(--cardinal);
}
.card__arrow { transition: transform .18s ease; }
.card:hover .card__arrow { transform: translateX(4px); }
[dir="rtl"] .card:hover .card__arrow { transform: translateX(-4px); }

.state {
  text-align: center;
  padding: 60px 20px;
}
.state__icon { font-size: 2.5rem; margin-bottom: 12px; }
.state__title { margin: 0 0 8px; font-size: 1.2rem; }
.state__msg { color: var(--warm-grey); margin: 0 0 16px; }
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--cardinal);
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 10px 20px;
  font: 700 .88rem var(--sans);
  cursor: pointer;
  transition: background .16s ease;
  text-decoration: none;
}
.btn-primary:hover { background: var(--cardinal-dark); }

.skel {
  border: 1px solid rgba(0,0,0,.06);
  border-radius: var(--radius);
  overflow: hidden;
  animation: cardIn .4s ease both;
  animation-delay: var(--d, 0s);
}
.skel__thumb { aspect-ratio: 16/10; }
.skel__body { padding: 16px; }
.skel__line { height: 14px; border-radius: 6px; }
.shimmer {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s ease infinite;
}
@keyframes shimmer { to { background-position: -200% 0; } }

.dnav {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(255,255,255,.96);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--fog);
}
.dnav__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 54px;
}
.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  font: 700 .88rem var(--sans);
  color: var(--cardinal);
  cursor: pointer;
  padding: 0;
}
.back-btn:hover { text-decoration: underline; }
.dnav__langs { display: flex; gap: 6px; }
.langpill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border: 1px solid var(--fog);
  border-radius: 999px;
  background: #fff;
  font: 600 .78rem var(--sans);
  cursor: pointer;
  color: var(--warm-grey);
  transition: all .16s ease;
}
.langpill--active {
  background: rgba(140,21,21,.08);
  border-color: rgba(140,21,21,.22);
  color: var(--cardinal-dark);
}
.langpill__dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
.langpill__dot--ckb { background: var(--cardinal); }
.langpill__dot--kmr { background: #1d6bbf; }

.dhero {
  position: relative;
  min-height: 44vh;
  display: grid;
  place-items: end stretch;
  overflow: hidden;
  background: var(--black);
}
.dhero__bg {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  opacity: .45;
}
.dhero__gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,.85) 0%, rgba(0,0,0,.2) 60%, rgba(0,0,0,.4) 100%);
}
.dhero__content {
  position: relative;
  z-index: 2;
  padding: 120px 0 48px;
  color: #fff;
}
.dhero__badges {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}
.dbadge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: rgba(255,255,255,.12);
  border: 1px solid rgba(255,255,255,.2);
  border-radius: 999px;
  padding: 6px 12px;
  font-size: .78rem;
  font-weight: 700;
  backdrop-filter: blur(6px);
}
.dhero__title {
  font-family: var(--serif);
  font-weight: 900;
  font-size: clamp(2rem, 4.5vw, 3.2rem);
  line-height: 1.12;
  margin: 0 0 12px;
}
.dhero__desc {
  max-width: 60ch;
  opacity: .88;
  font-size: 1.05rem;
  line-height: 1.7;
  margin: 0;
}

.su-stack {
  padding: clamp(40px, 6vw, 80px) 0;
}
.su-container {
  max-width: var(--max-w);
  margin: 0 auto;
  padding: 0 clamp(20px, 4vw, 52px);
}
.su-rule {
  max-width: var(--max-w);
  margin: clamp(28px, 4vw, 48px) auto;
  padding: 0 clamp(20px, 4vw, 52px);
  height: 0;
  border: none;
  border-top: 1px solid var(--fog);
}
.su-block-h {
  font-family: var(--serif);
  font-weight: 700;
  font-size: clamp(1.4rem, 2.8vw, 2rem);
  color: var(--black);
  margin: 0 0 18px;
}
.su-block-h--sm { font-size: clamp(1.1rem, 2vw, 1.4rem); }
.su-block-h.center { text-align: center; }
.su-prose {
  font-size: 1rem;
  line-height: 1.8;
  color: #444;
}
.su-prose--wide { max-width: 72ch; }
.su-prose--caption {
  font-style: italic;
  color: var(--warm-grey);
}
.su-prose :deep(p) { margin: 0 0 1em; }
.su-prose :deep(p:last-child) { margin-bottom: 0; }
.su-prose.center { text-align: center; max-width: 60ch; margin-inline: auto; }

.su-text-block { padding: 12px 0; }

.su-duo {
  max-width: var(--max-w);
  margin: 0 auto;
  padding: 0 clamp(20px, 4vw, 52px);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(24px, 4vw, 56px);
  align-items: center;
}
.su-duo--reversed { direction: ltr; }
[dir="ltr"] .su-duo--reversed { direction: rtl; }
.su-duo--reversed .su-duo__text,
.su-duo--reversed .su-duo__media { direction: inherit; }
[dir="rtl"] .su-duo--reversed .su-duo__text { direction: rtl; }
[dir="ltr"] .su-duo--reversed .su-duo__text { direction: ltr; }

.su-figure { margin: 0; cursor: pointer; }
.su-figure__crop {
  border-radius: 12px;
  overflow: hidden;
  background: var(--sandstone);
}
.su-figure__crop img {
  width: 100%;
  display: block;
  transition: transform .35s ease;
}
.su-figure:hover .su-figure__crop img { transform: scale(1.03); }
.su-figure__cap {
  margin-top: 10px;
  font-size: .85rem;
  color: var(--warm-grey);
  font-style: italic;
}

.su-media-block { padding: 12px 0; }
.su-video-wrapper {
  position: relative;
  padding-bottom: 56.25%;
  border-radius: 12px;
  overflow: hidden;
  background: #000;
}
.su-video-wrapper.shadow { box-shadow: 0 12px 40px rgba(0,0,0,.15); }
.su-video-wrapper iframe,
.su-video-wrapper video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: none;
}
.su-caption {
  text-align: center;
  font-size: .9rem;
  color: var(--warm-grey);
  margin: 14px 0 0;
  font-style: italic;
}

.su-audio-block { padding: 12px 0; }
.su-audio-row {
  display: flex;
  align-items: center;
  gap: 24px;
  background: var(--sandstone);
  border: 1px solid var(--fog);
  border-radius: 14px;
  padding: 20px 24px;
}
.su-audio-row__info { flex: 1; }
.su-audio-row__el { flex-shrink: 0; max-width: 320px; width: 100%; }

.su-doc-block { padding: 12px 0; }
.su-doc-row {
  display: flex;
  align-items: center;
  gap: 16px;
  background: var(--sandstone);
  border: 1px solid var(--fog);
  border-radius: 14px;
  padding: 20px 24px;
}
.su-doc-row__icon { font-size: 2rem; flex-shrink: 0; }
.su-doc-row__info { flex: 1; }
.su-doc-row__info .su-block-h { margin-bottom: 6px; }

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 14px;
}
.gallery-grid__item {
  margin: 0;
  cursor: pointer;
  border-radius: 10px;
  overflow: hidden;
  background: var(--sandstone);
}
.gallery-grid__item img {
  width: 100%;
  aspect-ratio: 4/3;
  object-fit: cover;
  display: block;
  transition: transform .3s ease;
}
.gallery-grid__item:hover img { transform: scale(1.04); }
.gallery-grid__item figcaption {
  padding: 8px 12px;
  font-size: .82rem;
  color: var(--warm-grey);
}

.related {
  background: var(--sandstone);
  border-top: 1px solid var(--fog);
  padding: 48px 0 60px;
}
.related__title {
  font-family: var(--serif);
  font-weight: 700;
  font-size: 1.4rem;
  margin: 0 0 24px;
}
.related__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
}
.rcard {
  background: #fff;
  border: 1px solid rgba(0,0,0,.06);
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: transform .18s ease, box-shadow .18s ease;
}
.rcard:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0,0,0,.08);
}
.rcard__thumb {
  aspect-ratio: 16/9;
  overflow: hidden;
  background: var(--fog);
}
.rcard__thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform .3s ease;
}
.rcard:hover .rcard__thumb img { transform: scale(1.04); }
.rcard__placeholder { width: 100%; height: 100%; background: linear-gradient(135deg, var(--fog), var(--sandstone)); }
.rcard__body { padding: 12px 14px; }
.rcard__type {
  display: inline-block;
  font-size: .7rem;
  font-weight: 700;
  color: var(--cardinal);
  letter-spacing: .05em;
  text-transform: uppercase;
  margin-bottom: 4px;
}
.rcard__title {
  font-family: var(--serif);
  font-weight: 700;
  font-size: .95rem;
  margin: 0;
  line-height: 1.3;
}

.lb {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0,0,0,.88);
  display: grid;
  place-items: center;
  padding: 24px;
}
.lb__close {
  position: fixed;
  top: 16px;
  right: 16px;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: rgba(255,255,255,.12);
  border: 1px solid rgba(255,255,255,.2);
  color: #fff;
  cursor: pointer;
  display: grid;
  place-items: center;
  z-index: 2;
}
.lb__close svg { width: 20px; height: 20px; }
.lb__fig {
  margin: 0;
  max-width: 90vw;
  max-height: 88vh;
  text-align: center;
}
.lb__fig img {
  max-width: 100%;
  max-height: 82vh;
  border-radius: 8px;
  object-fit: contain;
}
.lb__fig figcaption {
  color: rgba(255,255,255,.8);
  font-size: .9rem;
  margin-top: 12px;
}

@media (max-width: 768px) {
  .hero__title { font-size: 2rem; }
  .hero__stats { gap: 10px; }
  .toolbar { flex-direction: column; align-items: stretch; }
  .toolbar__pills { order: 2; }
  .grid { grid-template-columns: 1fr; }
  .su-duo { grid-template-columns: 1fr; }
  .su-audio-row { flex-direction: column; }
  .su-audio-row__el { max-width: 100%; }
  .su-doc-row { flex-direction: column; text-align: center; }
  .dnav__inner { flex-direction: column; align-items: flex-start; gap: 6px; height: auto; padding: 10px 0; }
  .gallery-grid { grid-template-columns: repeat(2, 1fr); }
  .related__grid { grid-template-columns: 1fr 1fr; }
  .dhero__title { font-size: 1.8rem; }
}

@media (max-width: 480px) {
  .gallery-grid { grid-template-columns: 1fr; }
  .related__grid { grid-template-columns: 1fr; }
  .hero__stats { flex-direction: column; align-items: center; }
}
</style>