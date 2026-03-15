<template>
  <main class="ns" :dir="lang.dir" :class="{ 'ns--ltr': lang.isKMR }">

    <!-- ══════════════════════════════════════
         LISTING VIEW
    ══════════════════════════════════════ -->
    <transition name="page" mode="out-in">
      <div v-if="!activeNews" key="listing" class="listing">

        <!-- HERO ── -->
        <header class="hero">
          <div class="hero__bg-wrap">
            <div class="hero__bg"></div>
            <div class="hero__overlay"></div>
            <div class="hero__grid-lines"></div>
          </div>

          <div class="hero__body">
            <div class="hero__eyebrow">
              <span class="eyebrow__rule"></span>
              <span class="eyebrow__label">{{ lbl('institute') }}</span>
              <span class="eyebrow__rule"></span>
            </div>
            <h1 class="hero__title">
              <span class="hero__title-main">{{ lbl('heroTitle') }}</span>
              <span class="hero__title-accent">{{ lbl('heroTitleAccent') }}</span>
            </h1>
            <p class="hero__sub">{{ lbl('heroSub') }}</p>

            <div class="hero__counters">
              <div class="hcount">
                <strong class="hcount__n">{{ filteredNews.length }}</strong>
                <span class="hcount__l">{{ lbl('articles') }}</span>
              </div>
              <div class="hcount__sep"></div>
              <div class="hcount">
                <strong class="hcount__n">{{ categories.length }}</strong>
                <span class="hcount__l">{{ lbl('topics') }}</span>
              </div>
            </div>
          </div>

          <button class="hero__down" @click="scrollToContent">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
          </button>
        </header>

        <!-- CONTROLS ── -->
        <div class="controls" ref="contentStart">
          <div class="controls__inner">

            <!-- Search -->
            <div class="search-wrap" :class="{ 'search-wrap--active': searchFocused }">
              <svg class="search-wrap__ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              <input
                v-model="searchQ"
                class="search-wrap__input"
                :placeholder="lbl('searchPlaceholder')"
                @focus="searchFocused = true"
                @blur="searchFocused = false"
              />
              <button v-if="searchQ" class="search-wrap__clear" @click="searchQ = ''">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
              </button>
            </div>

            <!-- Topic Pills -->
            <div class="topic-row">
              <button
                class="topic-pill"
                :class="{ 'topic-pill--on': activeCat === null }"
                @click="activeCat = null"
              >{{ lbl('all') }}</button>
              <button
                v-for="cat in categories"
                :key="cat.id"
                class="topic-pill"
                :class="{ 'topic-pill--on': activeCat === cat.id }"
                @click="activeCat = cat.id"
              >{{ catName(cat) }}</button>
            </div>

          </div>
        </div>

        <!-- GRID ── -->
        <section class="grid-section">
          <div class="grid-inner">

            <!-- Loading -->
            <div v-if="loading" class="skel-grid">
              <div v-for="i in 8" :key="i" class="skel-card" :style="{ '--d': `${(i-1)*0.06}s` }">
                <div class="skel-card__img shimmer"></div>
                <div class="skel-card__body">
                  <div class="skel-line shimmer" style="width:40%"></div>
                  <div class="skel-line shimmer" style="width:90%;margin-top:.6rem"></div>
                  <div class="skel-line shimmer" style="width:70%"></div>
                </div>
              </div>
            </div>

            <!-- Empty -->
            <div v-else-if="!filteredNews.length" class="empty-state">
              <div class="empty-state__icon">📰</div>
              <h3 class="empty-state__title">{{ lbl('noResults') }}</h3>
              <p class="empty-state__hint">{{ lbl('noResultsHint') }}</p>
              <button class="btn-reset" @click="searchQ = ''; activeCat = null">{{ lbl('clearFilters') }}</button>
            </div>

            <!-- News Grid -->
            <template v-else>
              <!-- Featured first card -->
              <article
                v-if="filteredNews[0]"
                class="card card--featured"
                :style="{ '--d': '0s' }"
                @click="openNews(filteredNews[0])"
              >
                <div class="card__visual">
                  <img :src="safeImg(filteredNews[0].coverUrl)" :alt="nTitle(filteredNews[0])" @error="onImgErr" />
                  <div class="card__scrim"></div>
                  <div class="card__cat-badge">{{ nCat(filteredNews[0]) }}</div>
                  <div v-if="mediaCount(filteredNews[0])" class="card__media-badge">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
                    {{ mediaCount(filteredNews[0]) }}
                  </div>
                </div>
                <div class="card__body">
                  <time class="card__date">{{ formatDate(filteredNews[0].datePublished) }}</time>
                  <h2 class="card__title">{{ nTitle(filteredNews[0]) }}</h2>
                  <p class="card__desc">{{ truncate(nDesc(filteredNews[0]), 180) }}</p>
                  <div class="card__tags" v-if="nTags(filteredNews[0]).length">
                    <span v-for="t in nTags(filteredNews[0]).slice(0,3)" :key="t" class="ctag">#{{ t }}</span>
                  </div>
                  <span class="card__cta">{{ lbl('readMore') }} <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M5 12h14M12 5l7 7-7 7"/></svg></span>
                </div>
              </article>

              <!-- Rest of cards -->
              <article
                v-for="(item, idx) in filteredNews.slice(1)"
                :key="item.id"
                class="card"
                :style="{ '--d': `${(idx + 1) * 0.05}s` }"
                @click="openNews(item)"
              >
                <div class="card__visual">
                  <img :src="safeImg(item.coverUrl)" :alt="nTitle(item)" @error="onImgErr" />
                  <div class="card__scrim"></div>
                  <div class="card__cat-badge">{{ nCat(item) }}</div>
                  <div v-if="mediaCount(item)" class="card__media-badge">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
                    {{ mediaCount(item) }}
                  </div>
                </div>
                <div class="card__body">
                  <time class="card__date">{{ formatDate(item.datePublished) }}</time>
                  <h3 class="card__title">{{ nTitle(item) }}</h3>
                  <p class="card__desc">{{ truncate(nDesc(item), 110) }}</p>
                  <div class="card__tags" v-if="nTags(item).length">
                    <span v-for="t in nTags(item).slice(0,2)" :key="t" class="ctag">#{{ t }}</span>
                  </div>
                </div>
              </article>
            </template>

          </div>
        </section>

      </div>

      <!-- ══════════════════════════════════════
           DETAIL VIEW — full page, no modal
      ══════════════════════════════════════ -->
      <div v-else key="detail" class="detail">

        <!-- Sticky back nav -->
        <nav class="dnav">
          <div class="dnav__inner">
            <button class="back-btn" @click="closeNews">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
              <span>{{ lbl('backToNews') }}</span>
            </button>
            <div class="dnav__crumbs">
              <span class="crumb">{{ nCat(activeNews) }}</span>
              <span class="crumb-sep">›</span>
              <span class="crumb crumb--sub" v-if="nSubCat(activeNews)">{{ nSubCat(activeNews) }}</span>
            </div>
          </div>
        </nav>

        <!-- Detail Hero -->
        <header class="dhero">
          <div class="dhero__bg" :style="safeImg(activeNews.coverUrl) ? { backgroundImage: `url(${safeImg(activeNews.coverUrl)})` } : {}"></div>
          <div class="dhero__veil"></div>
          <div class="dhero__content">
            <transition name="fade-up" mode="out-in">
              <div :key="lang.activeLang">
                <div class="dhero__badges">
                  <span class="dbadge dbadge--cat">{{ nCat(activeNews) }}</span>
                  <span class="dbadge" v-if="nSubCat(activeNews)">{{ nSubCat(activeNews) }}</span>
                  <span class="dbadge">📅 {{ formatDateFull(activeNews.datePublished) }}</span>
                  <span class="dbadge">{{ readTime(activeNews) }} {{ lbl('readTime') }}</span>
                </div>
                <h1 class="dhero__title">{{ nTitle(activeNews) }}</h1>
                <div class="dhero__tags" v-if="nTags(activeNews).length">
                  <span v-for="t in nTags(activeNews)" :key="t" class="dtag">#{{ t }}</span>
                </div>
              </div>
            </transition>
          </div>
        </header>

        <!-- Article body -->
        <div class="article-wrap">
          <div class="article-layout">

            <!-- Main content -->
            <main class="article-main">

              <!-- Lead paragraph -->
              <div class="article-lead" v-if="nDesc(activeNews)">
                <span class="drop-cap">{{ nDesc(activeNews).charAt(0) }}</span>
                <p class="lead-text">{{ nDesc(activeNews).slice(1) }}</p>
              </div>

              <!-- Media Section — compact tray -->
              <section class="media-section" v-if="hasMedia(activeNews)">
                <h3 class="section-heading">
                  {{ lbl('mediaCollection') }}
                  <span class="section-heading__count">{{ mediaCount(activeNews) }}</span>
                </h3>

                <!-- ── IMAGES — horizontal filmstrip ── -->
                <div v-if="mediaImages.length" class="media-block">
                  <div class="media-block__label">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
                    {{ mediaImages.length }}
                  </div>
                  <div class="filmstrip">
                    <button
                      v-for="(img, i) in mediaImages"
                      :key="i"
                      class="film-frame"
                      :class="{ 'film-frame--on': galleryIdx === i }"
                      @click="galleryIdx = i; openLightbox(img)"
                    >
                      <img :src="safeImg(img.url) || safeImg(img.externalUrl)" :alt="`${i+1}`" />
                      <div class="film-frame__zoom">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>
                      </div>
                    </button>
                  </div>
                </div>

                <!-- ── VIDEOS — compact row ── -->
                <div v-if="mediaVideos.length" class="media-block">
                  <div class="media-block__label">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>
                    {{ mediaVideos.length }}
                  </div>
                  <div class="video-row">
                    <div v-for="v in mediaVideos" :key="v.id" class="video-chip">
                      <div v-if="v.embedUrl" class="video-chip__embed">
                        <iframe :src="v.embedUrl" frameborder="0" allowfullscreen allow="autoplay; encrypted-media"></iframe>
                      </div>
                      <video v-else-if="v.url" controls class="video-chip__native">
                        <source :src="v.url" type="video/mp4" />
                      </video>
                    </div>
                  </div>
                </div>

                <!-- ── AUDIO — slim pill row ── -->
                <div v-if="mediaAudio.length" class="media-block">
                  <div class="media-block__label">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
                    {{ mediaAudio.length }}
                  </div>
                  <div class="audio-pills">
                    <div v-for="(a, i) in mediaAudio" :key="a.id" class="audio-pill">
                      <span class="audio-pill__num">{{ i + 1 }}</span>
                      <audio controls :src="a.url || a.externalUrl" class="audio-pill__player"></audio>
                    </div>
                  </div>
                </div>

                <!-- ── DOCUMENTS ── -->
                <div v-if="mediaDocs.length" class="media-block">
                  <div class="media-block__label">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                    {{ mediaDocs.length }}
                  </div>
                  <div class="doc-row">
                    <a v-for="d in mediaDocs" :key="d.id" :href="d.url" target="_blank" class="doc-chip">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="16" height="16"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                      <span class="doc-chip__name">{{ docName(d) }}</span>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    </a>
                  </div>
                </div>
              </section>

              <!-- Keywords -->
              <section class="kw-section" v-if="nKeywords(activeNews).length">
                <h4 class="kw-heading">{{ lbl('keywords') }}</h4>
                <div class="kw-cloud">
                  <span v-for="kw in nKeywords(activeNews)" :key="kw" class="kw-tag">{{ kw }}</span>
                </div>
              </section>

            </main>

            <!-- Sidebar -->
            <aside class="article-aside">
              <div class="aside-card">
                <h4 class="aside-card__title">{{ lbl('publicationDetails') }}</h4>
                <dl class="aside-meta">
                  <div class="aside-meta__row">
                    <dt>{{ lbl('category') }}</dt>
                    <dd>{{ nCat(activeNews) }}</dd>
                  </div>
                  <div class="aside-meta__row" v-if="nSubCat(activeNews)">
                    <dt>{{ lbl('subCategory') }}</dt>
                    <dd>{{ nSubCat(activeNews) }}</dd>
                  </div>
                  <div class="aside-meta__row">
                    <dt>{{ lbl('published') }}</dt>
                    <dd>{{ formatDateFull(activeNews.datePublished) }}</dd>
                  </div>
                  <div class="aside-meta__row" v-if="activeNews.createdAt">
                    <dt>{{ lbl('archived') }}</dt>
                    <dd>{{ formatDateTime(activeNews.createdAt) }}</dd>
                  </div>
                </dl>
              </div>

              <div class="aside-tags" v-if="nTags(activeNews).length">
                <div v-for="t in nTags(activeNews)" :key="t" class="aside-tag">#{{ t }}</div>
              </div>

              <button class="share-btn" @click="shareNews">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                {{ lbl('share') }}
              </button>
            </aside>

          </div>
        </div>

        <!-- Related News -->
        <section class="related" v-if="relatedNews.length">
          <div class="related__inner">
            <div class="related__head">
              <h2 class="related__title">{{ lbl('related') }}</h2>
              <div class="related__rule"></div>
            </div>
            <div class="related__grid">
              <article
                v-for="rn in relatedNews"
                :key="rn.id"
                class="rcard"
                @click="openNews(rn)"
              >
                <div class="rcard__visual">
                  <img :src="safeImg(rn.coverUrl)" :alt="nTitle(rn)" @error="onImgErr" />
                  <div class="rcard__scrim"></div>
                </div>
                <div class="rcard__body">
                  <time class="rcard__date">{{ formatDate(rn.datePublished) }}</time>
                  <h3 class="rcard__title">{{ nTitle(rn) }}</h3>
                  <p class="rcard__desc">{{ truncate(nDesc(rn), 90) }}</p>
                  <span class="rcard__cat">{{ nCat(rn) }}</span>
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
        <div v-if="lightboxUrl" class="lightbox" @click="lightboxUrl = ''">
          <button class="lightbox__close" @click="lightboxUrl = ''">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="20" height="20"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
          <img :src="lightboxUrl" class="lightbox__img" @click.stop />
        </div>
      </Transition>
    </Teleport>

  </main>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import axios from 'axios'
import { useLanguageStore } from '@/stores/useLanguageStore'
import { API_BASE_URL } from '@/components/consts.js'

const lang = useLanguageStore()
const api = axios.create({ baseURL: API_BASE_URL, timeout: 15000 })

// ── i18n ──────────────────────────────────────────────────────
const i18n = {
  CKB: {
    institute: 'ناوەندی کەلەپووری کوردی — ١٩٩٢',
    heroTitle: 'ئەرشیڤی',
    heroTitleAccent: 'هەواڵ',
    heroSub: 'نوێترین هەواڵ و ڕوداوەکان لە ناوەندی کەلەپووری کوردی',
    articles: 'بابەت',
    topics: 'بابەتەکان',
    searchPlaceholder: 'گەڕان...',
    all: 'هەموو',
    readMore: 'زیاتر بخوێنەوە',
    backToNews: 'گەڕانەوە بۆ هەواڵەکان',
    readTime: 'خوێندنەوە',
    mediaCollection: 'کۆمەڵەی میدیا',
    audio: 'دەنگ',
    keywords: 'کلیلی وشەکان',
    publicationDetails: 'وردەکاری بڵاوکردنەوە',
    category: 'هاوپۆل',
    subCategory: 'هاوپۆلی لاوەکی',
    published: 'بەرواری بڵاوکردنەوە',
    archived: 'بەرواری تۆمارکردن',
    share: 'هاوبەشکردن',
    download: 'داگرتن',
    related: 'هەواڵی پەیوەندیدار',
    noResults: 'هیچ ئەنجامێک نەدۆزرایەوە',
    noResultsHint: 'گەڕانەکەت بگۆڕە یان فلتەر پاک بکەرەوە',
    clearFilters: 'پاككردنەوەی فلتەر',
  },
  KMR: {
    institute: 'Navenda Mîrateya Kurdî — 1992',
    heroTitle: 'Arşîva',
    heroTitleAccent: 'Nûçeyan',
    heroSub: 'Nûçeyên herî nû û bûyerên giring ji KHI',
    articles: 'Gotar',
    topics: 'Mijar',
    searchPlaceholder: 'Bigere...',
    all: 'Hemû',
    readMore: 'Bêtir bixwîne',
    backToNews: 'Vegere nûçeyan',
    readTime: 'xwendin',
    mediaCollection: 'Koleksiyona medyayê',
    audio: 'Dengê',
    keywords: 'Kelîmeyên sereke',
    publicationDetails: 'Detayên weşanê',
    category: 'Kategorî',
    subCategory: 'Binkategorî',
    published: 'Dîroka weşanê',
    archived: 'Dîroka tomarkirinê',
    share: 'Parve bike',
    download: 'Daxîne',
    related: 'Nûçeyên têkildar',
    noResults: 'Ti encam nehat dîtin',
    noResultsHint: 'Lêgerîna xwe biguhêze an fîltiran paqij bike',
    clearFilters: 'Fîltiran paqij bike',
  }
}
const lbl = (k) => i18n[lang?.activeLang || 'CKB']?.[k] ?? k

// ── State ──────────────────────────────────────────────────────
const newsList   = ref([])
const loading    = ref(true)
const searchQ    = ref('')
const activeCat  = ref(null)
const searchFocused = ref(false)
const activeNews = ref(null)
const galleryIdx = ref(0)
const lightboxUrl = ref('')
const contentStart = ref(null)

const fallback = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='500'%3E%3Crect width='800' height='500' fill='%23e8ddd0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23b09070' font-family='sans-serif' font-size='28'%3EKHI%3C/text%3E%3C/svg%3E`

// ── Computed ───────────────────────────────────────────────────
const categories = computed(() => {
  const seen = new Set()
  return newsList.value
    .filter(n => n.category)
    .map(n => n.category)
    .filter(c => { if (seen.has(c.id)) return false; seen.add(c.id); return true })
})

const filteredNews = computed(() => {
  const al = lang?.activeLang || 'CKB'
  let list = newsList.value.filter(n => {
    const l = n.contentLanguages || []
    return l.length === 0 || l.includes(al)
  })
  if (activeCat.value) list = list.filter(n => n.category?.id === activeCat.value)
  if (searchQ.value.trim()) {
    const q = searchQ.value.toLowerCase()
    list = list.filter(n =>
      nTitle(n).toLowerCase().includes(q) ||
      nDesc(n).toLowerCase().includes(q) ||
      nTags(n).some(t => t.toLowerCase().includes(q))
    )
  }
  return list.sort((a, b) => new Date(b.datePublished) - new Date(a.datePublished))
})

const relatedNews = computed(() => {
  if (!activeNews.value) return []
  const myTags = new Set([...nTags(activeNews.value), ...nKeywords(activeNews.value)])
  const catId = activeNews.value.category?.id
  return newsList.value
    .filter(n => n.id !== activeNews.value.id && (
      n.category?.id === catId ||
      nTags(n).some(t => myTags.has(t))
    ))
    .slice(0, 3)
})

const mediaImages = computed(() => (activeNews.value?.media || []).filter(m => m.type === 'IMAGE' || m.url?.match(/\.(jpg|jpeg|png|gif|webp)$/i)))
const mediaVideos = computed(() => (activeNews.value?.media || []).filter(m => m.type === 'VIDEO' || m.embedUrl))
const mediaAudio  = computed(() => (activeNews.value?.media || []).filter(m => m.type === 'AUDIO' || m.url?.match(/\.(mp3|wav|ogg)$/i)))
const mediaDocs   = computed(() => (activeNews.value?.media || []).filter(m => m.type === 'DOCUMENT' || m.url?.match(/\.(pdf|doc|docx)$/i)))

// ── Content helpers ────────────────────────────────────────────
const safeImg   = (url) => (url && url.startsWith('http')) ? url : fallback
const nTitle    = (n) => { if (!n) return ''; const k = lang?.activeLang === 'KMR'; return (k ? n.kmrContent?.title || n.ckbContent?.title : n.ckbContent?.title || n.kmrContent?.title) || '' }
const nDesc     = (n) => { if (!n) return ''; const k = lang?.activeLang === 'KMR'; return (k ? n.kmrContent?.description || n.ckbContent?.description : n.ckbContent?.description || n.kmrContent?.description) || '' }
const nCat      = (n) => { if (!n?.category) return ''; const k = lang?.activeLang === 'KMR'; return (k ? n.category.kmrName || n.category.ckbName : n.category.ckbName || n.category.kmrName) || '' }
const nSubCat   = (n) => { if (!n?.subCategory) return ''; const k = lang?.activeLang === 'KMR'; return (k ? n.subCategory.kmrName || n.subCategory.ckbName : n.subCategory.ckbName || n.subCategory.kmrName) || '' }
const catName   = (cat) => { const k = lang?.activeLang === 'KMR'; return (k ? cat.kmrName || cat.ckbName : cat.ckbName || cat.kmrName) || '' }
const nTags     = (n) => { if (!n) return []; return Array.from(lang?.activeLang === 'KMR' ? (n.tagsKmr || []) : (n.tagsCkb || [])) }
const nKeywords = (n) => { if (!n) return []; return Array.from(lang?.activeLang === 'KMR' ? (n.keywordsKmr || []) : (n.keywordsCkb || [])) }
const hasMedia  = (n) => n?.media?.length > 0
const mediaCount= (n) => n?.media?.length || 0
const docName   = (d) => d.url?.split('/').pop()?.split('?')[0] || 'Document'
const truncate  = (t, max) => t?.length > max ? t.slice(0, max) + '…' : (t || '')
const readTime  = (n) => Math.max(1, Math.ceil((nDesc(n) || '').split(/\s+/).length / 200))

const formatDate = (v) => {
  if (!v) return ''
  try { return new Date(v).toLocaleDateString(lang?.activeLang === 'KMR' ? 'ku' : 'ar-IQ', { year: 'numeric', month: 'short', day: 'numeric' }) }
  catch { return v }
}
const formatDateFull = (v) => {
  if (!v) return ''
  try { return new Date(v).toLocaleDateString(lang?.activeLang === 'KMR' ? 'ku' : 'ar-IQ', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' }) }
  catch { return v }
}
const formatDateTime = (v) => {
  if (!v) return ''
  try { return new Date(v).toLocaleString(lang?.activeLang === 'KMR' ? 'ku' : 'ar-IQ') }
  catch { return v }
}

// ── Actions ────────────────────────────────────────────────────
const openNews = (item) => {
  activeNews.value = item
  galleryIdx.value = 0
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const closeNews = () => {
  activeNews.value = null
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const nextImg = () => { galleryIdx.value = (galleryIdx.value + 1) % mediaImages.value.length }
const prevImg = () => { galleryIdx.value = (galleryIdx.value - 1 + mediaImages.value.length) % mediaImages.value.length }

const openLightbox = (img) => {
  const url = safeImg(img.url) || safeImg(img.externalUrl)
  if (url && url.startsWith('http')) lightboxUrl.value = url
}

const shareNews = () => {
  if (navigator.share) navigator.share({ title: nTitle(activeNews.value), text: truncate(nDesc(activeNews.value), 100), url: window.location.href })
}

const scrollToContent = () => contentStart.value?.scrollIntoView({ behavior: 'smooth' })

const onImgErr = (e) => { e.target.src = fallback }

const handleKey = (e) => {
  if (e.key === 'Escape' && activeNews.value) closeNews()
  if (activeNews.value && mediaImages.value.length > 1) {
    if (e.key === 'ArrowLeft') nextImg()
    if (e.key === 'ArrowRight') prevImg()
  }
}

// ── Lifecycle ──────────────────────────────────────────────────
onMounted(async () => {
  window.addEventListener('keydown', handleKey)
  try {
    const { data } = await api.get('/news')
    newsList.value = data?.data || data || []
  } catch (err) {
    console.error('[News] fetch error:', err)
  } finally {
    loading.value = false
  }
})

onUnmounted(() => { window.removeEventListener('keydown', handleKey) })
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Noto+Sans+Arabic:wght@300;400;500;600;700&family=Noto+Kufi+Arabic:wght@400;700&display=swap');

/* ── Design tokens ─────────────────────────────────────────── */
.ns {
  --ink:        #1C1410;
  --ink-soft:   #3D2F25;
  --muted:      #7A6A5F;
  --border:     rgba(90, 70, 50, 0.14);
  --border-warm:rgba(160, 110, 50, 0.22);
  --gold:       #B8922A;
  --gold-light: #D4AF5A;
  --gold-pale:  #F5EDD8;
  --crimson:    #8B1A1A;
  --crimson-mid:#A82020;
  --parchment:  #FAF6EE;
  --card-bg:    #FFFFFF;
  --surface:    #F5F0E8;

  --r-s:  6px;
  --r-m:  12px;
  --r-l:  18px;
  --r-xl: 26px;
  --r-full: 9999px;

  --ease:   cubic-bezier(.25, 1, .35, 1);
  --spring: cubic-bezier(.34, 1.56, .64, 1);

  min-height: 100vh;
  background: var(--parchment);
  color: var(--ink);
  font-family: 'Noto Sans Arabic', 'Noto Kufi Arabic', sans-serif;
  direction: rtl;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}
.ns--ltr { direction: ltr; }

/* ── Hero ──────────────────────────────────────────────────── */
.hero {
  position: relative;
  min-height: 72vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  overflow: hidden;
  isolation: isolate;
}

.hero__bg-wrap {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.hero__bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 80% 60% at 50% 0%, rgba(139,26,26,0.55) 0%, transparent 65%),
    linear-gradient(160deg, #1C0A0A 0%, #2A1510 50%, #1C0D0A 100%);
}

.hero__overlay {
  position: absolute;
  inset: 0;
  background: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
  pointer-events: none;
}

.hero__grid-lines {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(184,146,42,0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(184,146,42,0.04) 1px, transparent 1px);
  background-size: 60px 60px;
}

.hero__body {
  position: relative;
  z-index: 2;
  padding: 100px 24px 60px;
  max-width: 760px;
  color: #FAF6EE;
}

.hero__eyebrow {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  margin-bottom: 28px;
}
.eyebrow__rule {
  width: 48px;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--gold), transparent);
}
.eyebrow__label {
  font-size: 11px;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--gold-light);
  font-weight: 600;
}

.hero__title {
  font-family: 'DM Serif Display', serif;
  margin: 0 0 18px;
  line-height: 1.1;
}
.hero__title-main {
  display: block;
  font-size: clamp(2.4rem, 6vw, 4.2rem);
  color: rgba(250,246,238,0.9);
  font-weight: 400;
}
.hero__title-accent {
  display: block;
  font-size: clamp(2.4rem, 6vw, 4.2rem);
  color: var(--gold-light);
  font-style: italic;
}

.hero__sub {
  font-size: 1.1rem;
  line-height: 1.8;
  color: rgba(250,246,238,0.65);
  margin: 0 0 36px;
}

.hero__counters {
  display: inline-flex;
  align-items: center;
  gap: 0;
  background: rgba(250,246,238,0.07);
  border: 1px solid rgba(184,146,42,0.28);
  border-radius: var(--r-full);
  padding: 4px;
  backdrop-filter: blur(8px);
}
.hcount {
  padding: 12px 28px;
  text-align: center;
}
.hcount__n {
  display: block;
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--gold-light);
  line-height: 1;
  font-family: 'DM Serif Display', serif;
}
.hcount__l {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: rgba(250,246,238,0.65);
  font-weight: 600;
}
.hcount__sep {
  width: 1px;
  height: 36px;
  background: rgba(184,146,42,0.3);
}

.hero__down {
  position: absolute;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  background: transparent;
  border: 1px solid rgba(184,146,42,0.35);
  color: var(--gold-light);
  width: 46px;
  height: 46px;
  border-radius: 50%;
  cursor: pointer;
  display: grid;
  place-items: center;
  transition: all 0.3s;
  animation: nudge 2.5s ease-in-out infinite;
}
.hero__down:hover { background: rgba(184,146,42,0.15); transform: translateX(-50%) translateY(3px); }

@keyframes nudge {
  0%,100%  { transform: translateX(-50%) translateY(0); }
  50%      { transform: translateX(-50%) translateY(6px); }
}

/* ── Controls ──────────────────────────────────────────────── */
.controls {
  position: sticky;
  top: 0;
  z-index: 80;
  background: rgba(250,246,238,0.9);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--border);
}
.controls__inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 14px 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.search-wrap {
  position: relative;
  max-width: 400px;
  display: flex;
  align-items: center;
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: var(--r-full);
  padding: 0 14px;
  height: 44px;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.search-wrap--active {
  border-color: var(--gold);
  box-shadow: 0 0 0 3px rgba(184,146,42,0.12);
}
.search-wrap__ico {
  width: 16px;
  height: 16px;
  color: var(--muted);
  flex-shrink: 0;
  margin-left: 8px;
}
.ns--ltr .search-wrap__ico { margin-left: 0; margin-right: 8px; }
.search-wrap__input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 14px;
  font-family: inherit;
  color: var(--ink);
  direction: inherit;
}
.search-wrap__input::placeholder { color: var(--muted); }
.search-wrap__clear {
  width: 22px;
  height: 22px;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--muted);
  display: grid;
  place-items: center;
  opacity: 0.6;
  transition: opacity 0.2s;
}
.search-wrap__clear:hover { opacity: 1; }

.topic-row {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  scrollbar-width: none;
  padding: 2px 0;
}
.topic-row::-webkit-scrollbar { display: none; }
.topic-pill {
  flex-shrink: 0;
  padding: 8px 18px;
  border: 1px solid var(--border);
  border-radius: var(--r-full);
  background: transparent;
  font-size: 13px;
  font-weight: 600;
  font-family: inherit;
  color: var(--muted);
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}
.topic-pill:hover { border-color: var(--gold); color: var(--gold); }
.topic-pill--on {
  background: var(--crimson);
  border-color: var(--crimson);
  color: #fff;
  box-shadow: 0 4px 14px rgba(139,26,26,0.25);
}

/* ── Grid ──────────────────────────────────────────────────── */
.grid-section { padding: 48px 0 80px; }
.grid-inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

/* Skeleton */
.skel-grid {
  display: contents;
}
.skel-card {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: var(--r-l);
  overflow: hidden;
  animation: fadeIn 0.4s ease both;
  animation-delay: var(--d, 0s);
}
.skel-card__img {
  aspect-ratio: 16/10;
  background: var(--surface);
}
.skel-card__body { padding: 20px; }
.skel-line {
  height: 11px;
  background: var(--surface);
  border-radius: 6px;
  margin-bottom: 10px;
}
.shimmer {
  background: linear-gradient(90deg, var(--surface) 25%, #EDE6D8 50%, var(--surface) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}
@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Empty */
.empty-state {
  grid-column: 1/-1;
  text-align: center;
  padding: 100px 24px;
  background: var(--card-bg);
  border: 2px dashed var(--border);
  border-radius: var(--r-xl);
}
.empty-state__icon { font-size: 56px; margin-bottom: 20px; opacity: 0.45; }
.empty-state__title {
  font-family: 'DM Serif Display', serif;
  font-size: 1.6rem;
  font-weight: 400;
  margin: 0 0 10px;
}
.empty-state__hint { color: var(--muted); margin-bottom: 28px; }
.btn-reset {
  padding: 12px 28px;
  background: var(--crimson);
  color: #fff;
  border: none;
  border-radius: var(--r-full);
  font-size: 14px;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.25s var(--spring);
}
.btn-reset:hover { background: var(--crimson-mid); transform: translateY(-2px); box-shadow: 0 8px 24px rgba(139,26,26,0.3); }

/* Cards */
.card {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: var(--r-l);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.35s var(--ease);
  animation: fadeInUp 0.5s ease both;
  animation-delay: var(--d, 0s);
  display: flex;
  flex-direction: column;
}
.card:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 50px rgba(28,20,16,0.13);
  border-color: var(--border-warm);
}
.card--featured {
  grid-column: span 2;
  grid-row: span 2;
}

.card__visual {
  position: relative;
  aspect-ratio: 16/10;
  overflow: hidden;
  background: var(--surface);
}
.card--featured .card__visual { aspect-ratio: 4/3; }
.card__visual img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s var(--ease);
}
.card:hover .card__visual img { transform: scale(1.05); }

.card__scrim {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(28,20,16,0.7) 0%, transparent 55%);
  opacity: 0.4;
  transition: opacity 0.3s;
}
.card:hover .card__scrim { opacity: 0.7; }

.card__cat-badge {
  position: absolute;
  top: 14px;
  right: 14px;
  padding: 5px 14px;
  background: var(--crimson);
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  border-radius: var(--r-full);
  letter-spacing: 0.04em;
}
.ns--ltr .card__cat-badge { right: auto; left: 14px; }

.card__media-badge {
  position: absolute;
  bottom: 12px;
  left: 14px;
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 5px 12px;
  background: rgba(28,20,16,0.75);
  color: var(--gold-light);
  font-size: 12px;
  font-weight: 700;
  border-radius: var(--r-full);
  backdrop-filter: blur(8px);
}
.ns--ltr .card__media-badge { left: auto; right: 14px; }

.card__body {
  padding: 22px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.card--featured .card__body { padding: 28px; }

.card__date {
  font-size: 11px;
  font-weight: 600;
  color: var(--crimson);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.card__title {
  font-family: 'DM Serif Display', serif;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.45;
  color: var(--ink);
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.card--featured .card__title {
  font-size: 1.55rem;
  -webkit-line-clamp: 4;
}

.card__desc {
  font-size: 13.5px;
  line-height: 1.7;
  color: var(--muted);
  margin: 0;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 4px;
}
.ctag {
  font-size: 11px;
  font-weight: 700;
  color: var(--muted);
  background: var(--surface);
  padding: 4px 10px;
  border-radius: var(--r-full);
  border: 1px solid var(--border);
  transition: all 0.2s;
}
.card:hover .ctag { color: var(--crimson); border-color: var(--border-warm); }

.card__cta {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 700;
  color: var(--gold);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-top: 8px;
  opacity: 0;
  transform: translateY(4px);
  transition: all 0.25s;
}
.card:hover .card__cta { opacity: 1; transform: translateY(0); }

/* ── Detail ────────────────────────────────────────────────── */
.detail {
  min-height: 100vh;
  background: var(--parchment);
  animation: fadeIn 0.4s ease;
}

.dnav {
  position: sticky;
  top: 0;
  z-index: 90;
  background: rgba(250,246,238,0.95);
  border-bottom: 1px solid var(--border);
  backdrop-filter: blur(16px);
}
.dnav__inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 12px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}
.back-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border: 1px solid var(--border);
  border-radius: var(--r-full);
  background: transparent;
  font-size: 14px;
  font-weight: 600;
  font-family: inherit;
  color: var(--ink);
  cursor: pointer;
  transition: all 0.25s var(--spring);
}
.back-btn:hover { background: var(--crimson); color: #fff; border-color: var(--crimson); transform: translateX(4px); }
.ns--ltr .back-btn:hover { transform: translateX(-4px); }

.dnav__crumbs {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}
.crumb { font-weight: 700; color: var(--crimson); }
.crumb--sub { color: var(--muted); font-weight: 400; }
.crumb-sep { color: var(--muted); }

.dhero {
  position: relative;
  min-height: 55vh;
  display: flex;
  align-items: flex-end;
  overflow: hidden;
}
.dhero__bg {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  background-color: var(--ink-soft);
  transform: scale(1.03);
  filter: brightness(0.65) saturate(1.1);
  transition: transform 8s ease;
}
.dhero:hover .dhero__bg { transform: scale(1.06); }
.dhero__veil {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(28,20,16,0.92) 0%, rgba(28,20,16,0.3) 60%, transparent 100%);
}
.dhero__content {
  position: relative;
  z-index: 2;
  max-width: 860px;
  margin: 0 auto;
  padding: 60px 24px 52px;
  color: #FAF6EE;
  width: 100%;
}
.dhero__badges {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
}
.dbadge {
  padding: 6px 16px;
  border-radius: var(--r-full);
  font-size: 12px;
  font-weight: 600;
  background: rgba(250,246,238,0.12);
  border: 1px solid rgba(250,246,238,0.2);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  gap: 6px;
}
.dbadge--cat {
  background: var(--crimson);
  border-color: var(--crimson);
}
.dhero__title {
  font-family: 'DM Serif Display', serif;
  font-size: clamp(1.8rem, 4.5vw, 3.2rem);
  font-weight: 400;
  line-height: 1.25;
  margin: 0 0 20px;
}
.dhero__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.dtag {
  padding: 7px 16px;
  border: 1px solid rgba(250,246,238,0.3);
  border-radius: var(--r-full);
  font-size: 13px;
  font-weight: 600;
  background: transparent;
  color: rgba(250,246,238,0.85);
  transition: all 0.2s;
  cursor: default;
}

/* Article layout */
.article-wrap {
  max-width: 1280px;
  margin: 0 auto;
  padding: 52px 24px 60px;
}
.article-layout {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 56px;
  align-items: start;
}

.article-main { min-width: 0; }

.article-lead {
  margin-bottom: 48px;
  font-size: 17px;
  line-height: 2;
  color: var(--ink-soft);
  position: relative;
}
.drop-cap {
  float: right;
  font-family: 'DM Serif Display', serif;
  font-size: 4.8rem;
  line-height: 0.82;
  color: var(--crimson);
  padding-left: 16px;
  padding-top: 10px;
}
.ns--ltr .drop-cap { float: left; padding-left: 0; padding-right: 16px; }
.lead-text { margin: 0; }

/* ── MEDIA SECTION — compact unified tray ── */
.media-section {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-l);
  padding: 20px 20px 14px;
  margin-bottom: 40px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.section-heading {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.22em;
  color: var(--gold);
  margin: 0;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  gap: 10px;
}
.section-heading__count {
  background: var(--gold-pale);
  color: var(--gold);
  border: 1px solid rgba(184,146,42,0.25);
  padding: 2px 9px;
  border-radius: var(--r-full);
  font-size: 10px;
  letter-spacing: 0;
}

.media-block { display: flex; flex-direction: column; gap: 8px; }

.media-block__label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--muted);
}

/* Filmstrip */
.filmstrip {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  scrollbar-width: thin;
  scrollbar-color: var(--border) transparent;
  padding-bottom: 4px;
}
.filmstrip::-webkit-scrollbar { height: 3px; }
.filmstrip::-webkit-scrollbar-track { background: transparent; }
.filmstrip::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }

.film-frame {
  flex-shrink: 0;
  width: 120px;
  height: 80px;
  border-radius: var(--r-m);
  overflow: hidden;
  cursor: zoom-in;
  position: relative;
  border: 2px solid transparent;
  background: var(--ink);
  padding: 0;
  transition: border-color 0.2s, transform 0.2s;
}
.film-frame:hover { border-color: var(--crimson); transform: translateY(-2px); }
.film-frame--on { border-color: var(--crimson); }
.film-frame img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.35s; }
.film-frame:hover img { transform: scale(1.08); }
.film-frame__zoom {
  position: absolute;
  inset: 0;
  background: rgba(28,20,16,0.45);
  display: grid;
  place-items: center;
  color: #fff;
  opacity: 0;
  transition: opacity 0.2s;
}
.film-frame:hover .film-frame__zoom { opacity: 1; }

/* Video chips */
.video-row {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  scrollbar-width: none;
}
.video-row::-webkit-scrollbar { display: none; }
.video-chip {
  flex-shrink: 0;
  width: 240px;
  height: 135px;
  border-radius: var(--r-m);
  overflow: hidden;
  background: #000;
  position: relative;
}
.video-chip__embed { position: relative; width: 100%; height: 100%; }
.video-chip__embed iframe { position: absolute; inset: 0; width: 100%; height: 100%; }
.video-chip__native { width: 100%; height: 100%; object-fit: cover; display: block; }

/* Audio pills */
.audio-pills { display: flex; flex-direction: column; gap: 7px; }
.audio-pill {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: var(--r-m);
}
.audio-pill__num {
  width: 24px;
  height: 24px;
  background: var(--crimson);
  color: #fff;
  border-radius: 50%;
  font-size: 10px;
  font-weight: 700;
  display: grid;
  place-items: center;
  flex-shrink: 0;
}
.audio-pill__player { flex: 1; height: 30px; min-width: 0; }

/* Doc chips */
.doc-row { display: flex; flex-wrap: wrap; gap: 8px; }
.doc-chip {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 8px 14px;
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: var(--r-full);
  color: var(--ink-soft);
  text-decoration: none;
  font-size: 13px;
  font-weight: 600;
  transition: all 0.2s;
  max-width: 240px;
}
.doc-chip:hover { background: var(--gold-pale); border-color: var(--gold); color: var(--ink); }
.doc-chip__name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 150px;
}

/* Keywords */
.kw-section { margin-top: 48px; padding-top: 36px; border-top: 1px solid var(--border); }
.kw-heading {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: var(--muted);
  margin: 0 0 16px;
}
.kw-cloud { display: flex; flex-wrap: wrap; gap: 10px; }
.kw-tag {
  padding: 8px 16px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-full);
  font-size: 13px;
  color: var(--ink-soft);
  transition: all 0.2s;
  cursor: default;
}
.kw-tag:hover { background: var(--gold-pale); border-color: var(--gold); }

/* Sidebar */
.article-aside {
  position: sticky;
  top: 80px;
  height: fit-content;
}
.aside-card {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: var(--r-l);
  padding: 24px;
  margin-bottom: 18px;
}
.aside-card__title {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: var(--gold);
  margin: 0 0 20px;
}
.aside-meta { margin: 0; display: flex; flex-direction: column; gap: 0; }
.aside-meta__row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid var(--border);
}
.aside-meta__row:last-child { border-bottom: none; }
.aside-meta dt { font-size: 12px; color: var(--muted); flex-shrink: 0; }
.aside-meta dd { font-size: 13px; font-weight: 600; color: var(--ink); text-align: left; margin: 0; }
.ns--ltr .aside-meta dd { text-align: right; }

.aside-tags {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 18px;
}
.aside-tag {
  padding: 10px 16px;
  background: rgba(139,26,26,0.05);
  border-right: 3px solid var(--crimson);
  border-radius: 0 var(--r-s) var(--r-s) 0;
  font-size: 13px;
  font-weight: 600;
  color: var(--ink-soft);
  transition: all 0.2s;
  cursor: default;
}
.ns--ltr .aside-tag { border-right: none; border-left: 3px solid var(--crimson); border-radius: var(--r-s) 0 0 var(--r-s); }
.aside-tag:hover { background: rgba(139,26,26,0.1); transform: translateX(-4px); }
.ns--ltr .aside-tag:hover { transform: translateX(4px); }

.share-btn {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, var(--gold), #A07820);
  border: none;
  border-radius: var(--r-m);
  color: #fff;
  font-weight: 700;
  font-size: 14px;
  font-family: inherit;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.25s var(--spring);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
.share-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(184,146,42,0.35); }

/* Related */
.related {
  background: var(--surface);
  padding: 64px 0 80px;
  border-top: 1px solid var(--border);
}
.related__inner { max-width: 1280px; margin: 0 auto; padding: 0 24px; }
.related__head {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 36px;
}
.related__title {
  font-family: 'DM Serif Display', serif;
  font-size: 1.8rem;
  font-weight: 400;
  color: var(--ink);
  margin: 0;
  white-space: nowrap;
}
.related__rule {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, var(--border), transparent);
}
.related__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.rcard {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: var(--r-l);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.32s var(--ease);
}
.rcard:hover { transform: translateY(-6px); box-shadow: 0 18px 44px rgba(28,20,16,0.12); border-color: var(--border-warm); }
.rcard__visual { position: relative; aspect-ratio: 16/10; overflow: hidden; background: var(--surface); }
.rcard__visual img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s; }
.rcard:hover .rcard__visual img { transform: scale(1.06); }
.rcard__scrim { position: absolute; inset: 0; background: linear-gradient(to top, rgba(28,20,16,0.45), transparent); opacity: 0.5; transition: opacity 0.3s; }
.rcard:hover .rcard__scrim { opacity: 0.8; }
.rcard__body { padding: 20px; }
.rcard__date { font-size: 11px; font-weight: 700; color: var(--crimson); text-transform: uppercase; letter-spacing: 0.08em; display: block; margin-bottom: 8px; }
.rcard__title {
  font-family: 'DM Serif Display', serif;
  font-size: 1.05rem;
  font-weight: 400;
  margin: 0 0 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.rcard__desc { font-size: 13px; color: var(--muted); line-height: 1.6; margin: 0 0 12px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.rcard__cat { font-size: 11px; font-weight: 700; color: var(--gold); text-transform: uppercase; letter-spacing: 0.08em; }

/* Lightbox */
.lightbox {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(14,10,8,0.97);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  cursor: zoom-out;
}
.lightbox__img {
  max-width: 90vw;
  max-height: 90vh;
  object-fit: contain;
  border-radius: 4px;
  box-shadow: 0 30px 80px rgba(0,0,0,0.6);
  cursor: default;
}
.lightbox__close {
  position: absolute;
  top: 24px;
  right: 24px;
  width: 48px;
  height: 48px;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 50%;
  color: #fff;
  cursor: pointer;
  display: grid;
  place-items: center;
  transition: all 0.2s;
}
.lightbox__close:hover { background: var(--crimson); border-color: var(--crimson); transform: rotate(90deg); }

/* Transitions */
.page-enter-active, .page-leave-active { transition: opacity 0.4s var(--ease), transform 0.4s var(--ease); }
.page-enter-from { opacity: 0; transform: translateY(20px); }
.page-leave-to   { opacity: 0; transform: translateY(-16px); }

.fade-up-enter-active, .fade-up-leave-active { transition: all 0.3s ease; }
.fade-up-enter-from, .fade-up-leave-to { opacity: 0; transform: translateY(10px); }

.lb-enter-active, .lb-leave-active { transition: opacity 0.25s ease; }
.lb-enter-from, .lb-leave-to { opacity: 0; }

/* Animations */
@keyframes fadeIn    { from { opacity: 0 } to { opacity: 1 } }
@keyframes fadeInUp  { from { opacity: 0; transform: translateY(24px) } to { opacity: 1; transform: translateY(0) } }

/* Responsive */
@media (max-width: 1100px) {
  .grid-inner { grid-template-columns: repeat(3, 1fr); }
  .card--featured { grid-column: span 2; }
  .article-layout { grid-template-columns: 1fr 260px; gap: 36px; }
  .related__grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 768px) {
  .grid-inner { grid-template-columns: repeat(2, 1fr); }
  .card--featured { grid-column: span 2; }
  .article-layout { grid-template-columns: 1fr; }
  .article-aside { position: static; order: -1; }
  .related__grid { grid-template-columns: 1fr; }
  .controls__inner { padding: 12px 16px; }
}
@media (max-width: 480px) {
  .grid-inner { grid-template-columns: 1fr; }
  .card--featured { grid-column: span 1; }
  .hero__counters { flex-direction: column; gap: 0; border-radius: var(--r-l); }
  .hcount__sep { width: 40px; height: 1px; }
  .dhero__title { font-size: 1.5rem; }
}
</style>