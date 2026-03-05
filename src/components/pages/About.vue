<template>
  <main id="main-content" class="about">

    <!-- LOADING -->
    <div v-if="loading" class="state-screen">
      <div class="spinner"></div>
      <p>بارکردنی دەربارە…</p>
    </div>

    <!-- ERROR -->
    <div v-else-if="error" class="state-screen">
      <p class="state-err">{{ error }}</p>
      <button class="text-btn" @click="fetchAbout">دووبارە هەوڵبدەرەوە</button>
    </div>

    <!-- EMPTY -->
    <div v-else-if="!page" class="state-screen">
      <p>هیچ پەڕەیەکی دەربارە نییە.</p>
    </div>

    <!-- PAGE -->
    <template v-else>

      <!-- HERO IMAGE — full bleed, no text overlay -->
      <div class="hero">
        <img :src="heroImage" alt="" class="hero__img" />
      </div>

      <!-- PAGE TITLE -->
      <div class="page-header container">
        <h1 class="page-header__title">{{ page.title }}</h1>
        <p v-if="page.subtitle" class="page-header__lead">{{ page.subtitle }}</p>
      </div>

      <div class="container"><hr class="rule" /></div>

      <!-- BLOCKS -->
      <div class="blocks container">
        <template v-for="(block, idx) in pairedBlocks" :key="idx">

          <!-- TEXT + IMAGE paired into two columns -->
          <div
            v-if="block.type === 'pair'"
            class="section-pair"
            :class="{ 'section-pair--flip': idx % 2 !== 0 }"
          >
            <div class="section-pair__text">
              <h3 v-if="block.text.title" class="section-h">{{ block.text.title }}</h3>
              <div class="prose" v-html="fmt(block.text.contentText)"></div>
            </div>
            <figure class="fig" @click="openLb(block.image)">
              <img :src="resolveUrl(block.image.mediaUrl)" :alt="block.image.altText || ''" loading="lazy" />
              <figcaption v-if="block.image.title || block.image.contentText">
                {{ [block.image.title, block.image.contentText].filter(Boolean).join(' — ') }}
              </figcaption>
            </figure>
          </div>

          <!-- TEXT standalone -->
          <div v-else-if="block.type === 'text'" class="section-text" :id="`block-${block.data.sequence}`">
            <h3 v-if="block.data.title" class="section-h">{{ block.data.title }}</h3>
            <div class="prose" v-html="fmt(block.data.contentText)"></div>
          </div>

          <!-- IMAGE standalone (full-width) -->
          <figure
            v-else-if="block.type === 'image'"
            class="fig fig--full"
            :id="`block-${block.data.sequence}`"
            @click="openLb(block.data)"
          >
            <img :src="resolveUrl(block.data.mediaUrl)" :alt="block.data.altText || ''" loading="lazy" />
            <figcaption v-if="block.data.title || block.data.contentText">
              <strong v-if="block.data.title">{{ block.data.title }}</strong>
              {{ block.data.contentText }}
            </figcaption>
          </figure>

          <!-- VIDEO -->
          <div v-else-if="block.type === 'video'" class="section-video" :id="`block-${block.data.sequence}`">
            <h3 v-if="block.data.title" class="section-h">{{ block.data.title }}</h3>
            <div class="video-box">
              <iframe v-if="isEmbed(block.data.mediaUrl)" :src="toEmbed(block.data.mediaUrl)"
                frameborder="0" allowfullscreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture">
              </iframe>
              <video v-else controls preload="metadata">
                <source :src="resolveUrl(block.data.mediaUrl)" />
              </video>
            </div>
            <p v-if="block.data.contentText" class="media-cap">{{ block.data.contentText }}</p>
          </div>

          <!-- AUDIO -->
          <div v-else-if="block.type === 'audio'" class="section-audio" :id="`block-${block.data.sequence}`">
            <div class="audio-inner">
              <div class="audio-inner__info">
                <h3 v-if="block.data.title" class="section-h">{{ block.data.title }}</h3>
                <p v-if="block.data.contentText" class="prose">{{ block.data.contentText }}</p>
              </div>
              <audio controls class="audio-el">
                <source :src="resolveUrl(block.data.mediaUrl)" />
              </audio>
            </div>
          </div>

          <!-- QUOTE -->
          <div v-else-if="block.type === 'quote'" class="section-quote" :id="`block-${block.data.sequence}`">
            <blockquote>
              <p>{{ block.data.contentText }}</p>
              <cite v-if="block.data.title">{{ block.data.title }}</cite>
            </blockquote>
          </div>

          <!-- STATS -->
          <div v-else-if="block.type === 'stats'" class="section-stats" :id="`block-${block.data.sequence}`">
            <h3 v-if="block.data.title" class="section-h section-h--center">{{ block.data.title }}</h3>
            <p v-if="block.data.contentText" class="prose prose--center">{{ block.data.contentText }}</p>
            <div class="stats-row" v-if="getStats(block.data).length">
              <div class="stat" v-for="(s, si) in getStats(block.data)" :key="si">
                <span class="stat__n">{{ s.value }}</span>
                <span class="stat__l">{{ s.label }}</span>
              </div>
            </div>
          </div>

          <!-- GALLERY item -->
          <figure
            v-else-if="block.type === 'gallery'"
            class="fig"
            :id="`block-${block.data.sequence}`"
            @click="openLb(block.data)"
          >
            <img :src="resolveUrl(block.data.mediaUrl)" :alt="block.data.altText || ''" loading="lazy" />
            <figcaption v-if="block.data.title">{{ block.data.title }}</figcaption>
          </figure>

          <hr v-if="idx < pairedBlocks.length - 1" class="section-rule" />
        </template>
      </div>

      <!-- META -->
      <div v-if="page.metaDescription" class="meta-footer container">
        <p>{{ page.metaDescription }}</p>
      </div>

      <!-- MULTI-PAGE NAV -->
      <div class="page-nav container" v-if="allPages.length > 1">
        <span class="page-nav__lbl">پەڕەکانی دەربارە:</span>
        <button
          v-for="p in allPages" :key="p.id"
          class="page-nav__btn"
          :class="{ 'is-active': p.id === page.id }"
          @click="switchPage(p)"
        >{{ p.title }}</button>
      </div>

    </template>

    <!-- LIGHTBOX -->
    <Teleport to="body">
      <Transition name="lb">
        <div v-if="lightbox" class="lightbox" @click.self="lightbox = null">
          <button class="lightbox__x" @click="lightbox = null" aria-label="داخستن">✕</button>
          <img :src="resolveUrl(lightbox.mediaUrl)" :alt="lightbox.altText || lightbox.title || ''" />
          <p v-if="lightbox.title || lightbox.contentText" class="lightbox__cap">
            <strong v-if="lightbox.title">{{ lightbox.title }}</strong>
            <template v-if="lightbox.title && lightbox.contentText"> — </template>
            {{ lightbox.contentText }}
          </p>
        </div>
      </Transition>
    </Teleport>

  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { API_BASE_URL } from '../consts.js'

const api      = axios.create({ baseURL: API_BASE_URL })
const API_ROOT = API_BASE_URL.replace('/api/v1', '')

const allPages = ref([])
const page     = ref(null)
const loading  = ref(true)
const error    = ref(null)
const lightbox = ref(null)

async function fetchAbout() {
  loading.value = true; error.value = null
  try {
    const { data } = await api.get('/about')
    const list = Array.isArray(data) ? data : (data?.data || [])
    allPages.value = list.filter(p => p.active !== false)
    const slug = window.location.hash?.replace('#', '')
    page.value = allPages.value.find(p => p.slug === slug) || allPages.value[0] || null
  } catch (e) {
    error.value = e?.response?.data?.message || e.message || 'هەڵەیەک ڕوویدا'
  } finally { loading.value = false }
}

function switchPage(p) {
  page.value = p
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const blocks = computed(() =>
  (page.value?.blocks || []).slice().sort((a, b) => (a.sequence ?? 0) - (b.sequence ?? 0))
)

// Pair adjacent TEXT + IMAGE blocks → two-column rows; everything else standalone
const pairedBlocks = computed(() => {
  const raw = blocks.value
  const out = []
  let i = 0
  while (i < raw.length) {
    const cur  = raw[i]
    const next = raw[i + 1]
    if (cur.contentType === 'TEXT' && next?.contentType === 'IMAGE') {
      out.push({ type: 'pair', text: cur, image: next })
      i += 2
    } else {
      out.push({ type: cur.contentType.toLowerCase(), data: cur })
      i++
    }
  }
  return out
})

const heroImage = computed(() => {
  const img = blocks.value.find(b => b.contentType === 'IMAGE' && b.mediaUrl)
  return img ? resolveUrl(img.mediaUrl) : 'https://picsum.photos/seed/khi/1600/640'
})

function resolveUrl(url) {
  if (!url) return ''
  if (url.startsWith('http')) return url
  return `${API_ROOT}${url.startsWith('/') ? '' : '/'}${url}`
}

function fmt(text) {
  if (!text) return ''
  return text.split('\n').filter(l => l.trim()).map(l => `<p>${l}</p>`).join('')
}

function isEmbed(url) {
  return url && (url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com'))
}

function toEmbed(url) {
  if (!url) return ''
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`
  const vm = url.match(/vimeo\.com\/(\d+)/)
  if (vm) return `https://player.vimeo.com/video/${vm[1]}`
  return url
}

function getStats(block) {
  try {
    const m = block.metadata
    return (m?.items && Array.isArray(m.items)) ? m.items : (Array.isArray(m) ? m : [])
  } catch { return [] }
}

function openLb(block) { lightbox.value = block }

onMounted(fetchAbout)
</script>

<style scoped>
/* ═══════════════════════════════════════════════════════════
   ABOUT — Stanford editorial
   Full-bleed imagery · Serif type · Cardinal red · White space
   Zero glassmorphism · Zero pill tags · Zero shadow cards
═══════════════════════════════════════════════════════════ */

.about {
  --red:    #8C1515;
  --text:   #2e2d29;
  --muted:  #767674;
  --line:   #d1cfc9;
  --bg:     #ffffff;
  --alt:    #f4f4f4;
  --w:      1060px;
  --serif:  Georgia, "Times New Roman", serif;
  --sans:   "Source Sans 3", "Helvetica Neue", Arial, sans-serif;

  font-family: var(--sans);
  font-size: 17px;
  line-height: 1.75;
  color: var(--text);
  background: var(--bg);
  min-height: 100vh;
}

:global(html) { scroll-behavior: smooth; }

.container { max-width: var(--w); margin: 0 auto; padding: 0 32px; }

/* ── States ── */
.state-screen {
  min-height: 60vh;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center; gap: 14px;
  color: var(--muted);
}
.state-err { color: var(--red); font-weight: 600; }
.spinner {
  width: 30px; height: 30px; border-radius: 50%;
  border: 2px solid #e0ddd8; border-top-color: var(--red);
  animation: spin .7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
.text-btn {
  background: none; border: none; padding: 0;
  color: var(--red); font: inherit; font-weight: 700;
  text-decoration: underline; cursor: pointer;
}

/* ── HERO ── */
.hero { width: 100%; overflow: hidden; }
.hero__img {
  display: block; width: 100%;
  height: clamp(280px, 40vw, 560px);
  object-fit: cover; object-position: center 30%;
}

/* ── Page header ── */
.page-header { padding: 48px 32px 28px; }
.page-header__title {
  font-family: var(--serif);
  font-size: clamp(30px, 4.5vw, 52px);
  font-weight: 400;
  line-height: 1.1;
  margin: 0 0 14px;
  color: var(--text);
}
.page-header__lead {
  font-size: 1.1rem;
  color: var(--muted);
  max-width: 72ch;
  margin: 0;
  line-height: 1.7;
}

/* ── Rules ── */
.rule        { border: none; border-top: 1px solid var(--line); margin: 0 0 48px; }
.section-rule { border: none; border-top: 1px solid var(--line); margin: 56px 0; }

/* ── Blocks wrapper ── */
.blocks { padding-bottom: 72px; }

/* ── Typography inside blocks ── */
.section-h {
  font-family: var(--serif);
  font-size: clamp(19px, 2.2vw, 24px);
  font-weight: 400;
  line-height: 1.25;
  margin: 0 0 14px;
  color: var(--text);
}
.section-h--center { text-align: center; }

.prose { color: var(--text); line-height: 1.8; font-size: 1rem; }
.prose--center { text-align: center; }
.prose :deep(p) { margin: 0 0 .9em; }
.prose :deep(p:last-child) { margin: 0; }

/* ── TEXT + IMAGE pair (two-column) ── */
.section-pair {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
  align-items: start;
}
.section-pair--flip { direction: rtl; }
.section-pair--flip > * { direction: ltr; }

/* ── Standalone text ── */
.section-text { max-width: 72ch; }

/* ── Figures ── */
.fig { margin: 0; cursor: zoom-in; }
.fig img {
  width: 100%; display: block;
  transition: opacity .22s;
  border-radius: 1px;
}
.fig:hover img { opacity: .9; }
.fig figcaption {
  margin-top: 10px;
  font-size: .87rem;
  color: var(--muted);
  line-height: 1.5;
}
.fig--full img {
  max-height: 500px;
  object-fit: cover;
}

/* ── Video ── */
.section-video { max-width: 820px; }
.video-box {
  position: relative; aspect-ratio: 16/9;
  background: #111; border-radius: 2px; overflow: hidden;
  margin-bottom: 10px;
}
.video-box iframe,
.video-box video {
  position: absolute; inset: 0; width: 100%; height: 100%;
}
.media-cap { font-size: .9rem; color: var(--muted); margin: 0; }

/* ── Audio ── */
.section-audio {
  background: var(--alt);
  border-top: 3px solid var(--red);
  padding: 28px 32px;
}
.audio-inner {
  display: flex; align-items: center;
  gap: 32px; flex-wrap: wrap;
}
.audio-inner__info { flex: 1; min-width: 180px; }
.audio-el { flex: 0 0 260px; width: 260px; }

/* ── Quote ── */
.section-quote { padding-left: 24px; border-left: 4px solid var(--red); max-width: 68ch; }
.section-quote blockquote { margin: 0; }
.section-quote blockquote p {
  font-family: var(--serif);
  font-size: clamp(18px, 2vw, 22px);
  font-style: italic;
  line-height: 1.65;
  margin: 0 0 12px;
}
.section-quote blockquote cite {
  display: block; font-style: normal;
  font-weight: 700; font-size: .9rem; color: var(--red);
}

/* ── Stats ── */
.section-stats { text-align: center; }
.stats-row {
  display: flex; justify-content: center; flex-wrap: wrap;
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
  margin-top: 28px;
}
.stat {
  flex: 1; min-width: 130px;
  padding: 28px 20px;
  border-right: 1px solid var(--line);
}
.stat:last-child { border-right: none; }
.stat__n {
  display: block;
  font-family: var(--serif);
  font-size: 2.6rem;
  font-weight: 400;
  color: var(--red);
  line-height: 1;
  margin-bottom: 8px;
}
.stat__l {
  display: block;
  font-size: .82rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .07em;
  color: var(--muted);
}

/* ── Meta footer ── */
.meta-footer {
  padding: 28px 32px 52px;
  border-top: 1px solid var(--line);
  color: var(--muted);
  font-size: .95rem;
  max-width: 74ch;
  line-height: 1.7;
}
.meta-footer p { margin: 0; }

/* ── Page nav ── */
.page-nav {
  display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
  padding: 24px 32px 56px;
  border-top: 1px solid var(--line);
}
.page-nav__lbl {
  font-size: .82rem; font-weight: 700;
  text-transform: uppercase; letter-spacing: .07em; color: var(--muted);
}
.page-nav__btn {
  background: none; border: 1px solid var(--line);
  border-radius: 2px; padding: 7px 16px;
  font: inherit; font-size: .9rem; font-weight: 600;
  color: var(--text); cursor: pointer;
  transition: border-color .15s, color .15s;
}
.page-nav__btn:hover { border-color: var(--red); color: var(--red); }
.page-nav__btn.is-active { background: var(--red); border-color: var(--red); color: #fff; }

/* ── Lightbox ── */
.lightbox {
  position: fixed; inset: 0; z-index: 9999;
  background: rgba(0,0,0,.92);
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  padding: 48px 24px 24px;
}
.lightbox__x {
  position: absolute; top: 18px; right: 18px;
  width: 40px; height: 40px; border-radius: 50%;
  background: none; border: 1px solid rgba(255,255,255,.3);
  color: #fff; font-size: 1rem; cursor: pointer;
  transition: border-color .15s;
}
.lightbox__x:hover { border-color: #fff; }
.lightbox img { max-width: 88vw; max-height: 78vh; display: block; border-radius: 2px; }
.lightbox__cap {
  margin-top: 12px; color: rgba(255,255,255,.7);
  font-size: .88rem; text-align: center;
}
.lightbox__cap strong { color: #fff; }

.lb-enter-active, .lb-leave-active { transition: opacity .25s ease; }
.lb-enter-from, .lb-leave-to { opacity: 0; }

/* ── Responsive ── */
@media (max-width: 800px) {
  .section-pair { grid-template-columns: 1fr; gap: 24px; }
  .section-pair--flip { direction: ltr; }
  .hero__img { height: 220px; }
  .audio-inner { flex-direction: column; }
  .audio-el { width: 100%; flex: none; }
  .stat { border-right: none; border-bottom: 1px solid var(--line); }
  .stat:last-child { border-bottom: none; }
  .stats-row { flex-direction: column; }
  .section-audio { padding: 20px; }
  .container { padding: 0 18px; }
}
</style>