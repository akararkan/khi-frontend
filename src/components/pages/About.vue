<template>
  <main id="main-content" class="stanford-about" :dir="dir" :lang="langAttr">

    <div v-if="loading" class="state-screen">
      <div class="su-dots"><span/><span/><span/></div>
      <p class="state-caption">{{ t('loading') }}</p>
    </div>

    <div v-else-if="error" class="state-screen">
      <svg class="state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="13"/><circle cx="12" cy="16.5" r=".6" fill="currentColor"/>
      </svg>
      <p class="state-err">{{ error }}</p>
      <button class="su-text-btn" @click="fetchAbout">{{ t('retry') }}</button>
    </div>

    <div v-else-if="!page" class="state-screen">
      <p class="state-caption">{{ t('empty') }}</p>
    </div>

    <template v-else>

      <div v-if="hasBothLangs" class="lang-bar">
        <div class="lang-bar__inner">
          <button class="lang-bar__btn" :class="{ 'lang-bar__btn--active': lang === 'ckb' }" @click="setLang('ckb')">
            <span class="lang-bar__dot lang-bar__dot--ckb"></span>
            کوردی سۆرانی
          </button>
          <div class="lang-bar__sep"></div>
          <button class="lang-bar__btn" :class="{ 'lang-bar__btn--active': lang === 'kmr' }" @click="setLang('kmr')">
            <span class="lang-bar__dot lang-bar__dot--kmr"></span>
            Kurmancî
          </button>
        </div>
      </div>

      <section v-if="heroImage" class="su-hero" role="img" :aria-label="pageTitle">
        <img :src="heroImage" alt="" class="su-hero__img" loading="eager" fetchpriority="high" />
        <div class="su-hero__overlay" aria-hidden="true"></div>
      </section>

      <header class="su-intro">
        <h1 class="su-intro__title">{{ pageTitle }}</h1>
        <p v-if="pageSubtitle" class="su-intro__lead">{{ pageSubtitle }}</p>
      </header>

      <div class="su-stack">
        <template v-for="(block, idx) in pairedBlocks" :key="`b${idx}`">

          <div v-if="idx > 0 && block.type !== 'stats' && pairedBlocks[idx-1].type !== 'stats'" class="su-rule" aria-hidden="true"></div>

          <section v-if="block.type === 'pair'" class="su-duo" :class="{ 'su-duo--reversed': idx % 2 !== 0 }">
            <div class="su-duo__text">
              <h2 v-if="bTitle(block.text)" class="su-block-h">{{ bTitle(block.text) }}</h2>
              <div class="su-prose" v-html="fmt(bText(block.text))"></div>
              <a v-if="block.text.mediaUrl" :href="resolveUrl(block.text.mediaUrl)" class="su-btn" target="_blank" rel="noopener">{{ t('readMore') }}</a>
            </div>
            
            <div class="su-duo__media">
              <div v-if="block.media.contentType === 'VIDEO'" class="su-video-wrapper shadow">
                 <iframe v-if="isEmbed(block.media.mediaUrl)" :src="toEmbed(block.media.mediaUrl)" frameborder="0" allowfullscreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>
                 <video v-else controls preload="metadata" :src="resolveUrl(block.media.mediaUrl)"></video>
              </div>
              <figure v-else class="su-figure" @click="openLb(block.media)">
                <div class="su-figure__crop">
                  <img :src="resolveUrl(block.media.mediaUrl)" :alt="bAlt(block.media)" loading="lazy" />
                </div>
                <figcaption v-if="bTitle(block.media) || bText(block.media)" class="su-figure__cap">
                  <strong v-if="bTitle(block.media)">{{ bTitle(block.media) }}</strong>
                  <template v-if="bTitle(block.media) && bText(block.media)"> — </template>
                  {{ bText(block.media) }}
                </figcaption>
              </figure>
            </div>
          </section>

          <section v-else-if="block.type === 'text'" class="su-text-block" :id="`s${block.data.sequence}`">
            <div class="su-container">
              <h2 v-if="bTitle(block.data)" class="su-block-h">{{ bTitle(block.data) }}</h2>
              <div class="su-prose su-prose--wide" v-html="fmt(bText(block.data))"></div>
            </div>
          </section>

          <section v-else-if="block.type === 'image' || block.type === 'gallery'" class="su-media-block" :id="`s${block.data.sequence}`">
             <div class="su-container">
               <figure class="su-figure su-figure--full" @click="openLb(block.data)">
                 <div class="su-figure__crop">
                   <img :src="resolveUrl(block.data.mediaUrl)" :alt="bAlt(block.data)" loading="lazy" />
                 </div>
                 <figcaption v-if="bTitle(block.data) || bText(block.data)" class="su-figure__cap">
                   <strong v-if="bTitle(block.data)">{{ bTitle(block.data) }}</strong>
                   <template v-if="bTitle(block.data) && bText(block.data)"> — </template>
                   {{ bText(block.data) }}
                 </figcaption>
               </figure>
             </div>
          </section>

          <section v-else-if="block.type === 'video'" class="su-media-block" :id="`s${block.data.sequence}`">
            <div class="su-container">
              <h2 v-if="bTitle(block.data)" class="su-block-h center">{{ bTitle(block.data) }}</h2>
              <div class="su-video-wrapper shadow">
                <iframe v-if="isEmbed(block.data.mediaUrl)" :src="toEmbed(block.data.mediaUrl)" frameborder="0" allowfullscreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>
                <video v-else controls preload="metadata">
                  <source :src="resolveUrl(block.data.mediaUrl)" />
                </video>
              </div>
              <p v-if="bText(block.data)" class="su-caption">{{ bText(block.data) }}</p>
            </div>
          </section>

          <section v-else-if="block.type === 'audio'" class="su-audio-block" :id="`s${block.data.sequence}`">
            <div class="su-container">
              <div class="su-audio-row">
                <div class="su-audio-row__info">
                  <h2 v-if="bTitle(block.data)" class="su-block-h su-block-h--sm">{{ bTitle(block.data) }}</h2>
                  <p v-if="bText(block.data)" class="su-prose">{{ bText(block.data) }}</p>
                </div>
                <audio controls class="su-audio-row__el" preload="metadata">
                  <source :src="resolveUrl(block.data.mediaUrl)" />
                </audio>
              </div>
            </div>
          </section>

          <section v-else-if="block.type === 'quote'" class="su-quote-block" :id="`s${block.data.sequence}`">
            <blockquote class="su-quote">
              <p class="su-quote__text">“{{ bText(block.data) }}”</p>
              <cite v-if="bTitle(block.data)" class="su-quote__author">— {{ bTitle(block.data) }}</cite>
            </blockquote>
          </section>

          <section v-else-if="block.type === 'stats'" class="su-stats-band" :id="`s${block.data.sequence}`">
            <div class="su-container">
              <h2 v-if="bTitle(block.data)" class="su-block-h center light">{{ bTitle(block.data) }}</h2>
              <p v-if="bText(block.data)" class="su-prose center light">{{ bText(block.data) }}</p>
              
              <div v-if="getStats(block.data).length" class="su-stats-grid">
                <div v-for="(s, si) in getStats(block.data)" :key="si" class="su-stat-card">
                  <span class="su-stat-val">{{ s.value }}</span>
                  <span class="su-stat-bar" aria-hidden="true"></span>
                  <span class="su-stat-lbl">{{ s.label }}</span>
                </div>
              </div>
            </div>
          </section>

        </template>
      </div>

      <div v-if="pageMetaDesc" class="su-meta">
        <div class="su-container">
          <p>{{ pageMetaDesc }}</p>
        </div>
      </div>

      <nav v-if="allPages.length > 1" class="su-page-nav" :aria-label="t('pagesNav')">
        <div class="su-container su-page-nav__inner">
          <span class="su-page-nav__label">{{ t('otherPages') }}</span>
          <div class="su-page-nav__list">
            <button v-for="p in allPages" :key="p.id" class="su-page-nav__item" :class="{ 'su-page-nav__item--current': p.id === page.id }" @click="switchPage(p)">
              {{ getPageTitle(p) }}
            </button>
          </div>
        </div>
      </nav>

    </template>

    <Teleport to="body">
      <Transition name="lb">
        <div v-if="lightbox" class="su-lb" role="dialog" :aria-label="t('imageView')" @click.self="lightbox = null">
          <button class="su-lb__close" @click="lightbox = null" :aria-label="t('close')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
          <figure class="su-lb__fig">
            <img :src="resolveUrl(lightbox.mediaUrl)" :alt="bAlt(lightbox)" />
            <figcaption v-if="bTitle(lightbox) || bText(lightbox)">
              <strong v-if="bTitle(lightbox)">{{ bTitle(lightbox) }}</strong>
              <template v-if="bTitle(lightbox) && bText(lightbox)"> — </template>
              {{ bText(lightbox) }}
            </figcaption>
          </figure>
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
const lang     = ref('ckb')

const strings = {
  ckb: { loading:'بارکردنی زانیارییەکان…', retry:'دووبارە هەوڵبدەرەوە', empty:'هیچ پەڕەیەکی دەربارە نییە.', readMore:'زیاتر بخوێنەوە', about:'دەربارەمان', otherPages:'پەڕەکانی دیکە:', pagesNav:'پەڕەکانی دەربارە', imageView:'پیشاندانی وێنە', close:'داخستن' },
  kmr: { loading:'Barikirna agahdarî…', retry:'Dîsa biceribîne', empty:'Tu rûpela derbarê tune.', readMore:'Bêtir bixwîne', about:'Derbarê me', otherPages:'Rûpelên din:', pagesNav:'Rûpelên derbarê', imageView:'Nîşandana wêneyê', close:'Bigire' }
}
const t = key => strings[lang.value]?.[key] ?? strings.ckb[key]

const dir      = computed(() => 'rtl')
const langAttr = computed(() => lang.value === 'ckb' ? 'ckb' : 'ku')

function pickContent(block) {
  if (!block) return {}
  const primary   = lang.value === 'ckb' ? block.ckbContent : block.kmrContent
  const secondary = lang.value === 'ckb' ? block.kmrContent : block.ckbContent
  if (primary?.title || primary?.contentText || primary?.altText) return primary ?? {}
  return secondary ?? {}
}

const bTitle = block => pickContent(block)?.title       || ''
const bText  = block => pickContent(block)?.contentText || ''
const bAlt   = block => pickContent(block)?.altText     || bTitle(block) || ''

function setLang(l) { lang.value = l }

const hasBothLangs = computed(() => !!(page.value?.ckbContent?.title && page.value?.kmrContent?.title))

const activePage = computed(() => {
  if (!page.value) return {}
  const p = lang.value === 'ckb' ? page.value.ckbContent : page.value.kmrContent
  const f = lang.value === 'ckb' ? page.value.kmrContent : page.value.ckbContent
  return { title: p?.title||f?.title||'', subtitle: p?.subtitle||f?.subtitle||'', metaDescription: p?.metaDescription||f?.metaDescription||'' }
})

const pageTitle    = computed(() => activePage.value.title)
const pageSubtitle = computed(() => activePage.value.subtitle)
const pageMetaDesc = computed(() => activePage.value.metaDescription)

function getPageTitle(p) {
  const primary  = lang.value === 'ckb' ? p.ckbContent : p.kmrContent
  const fallback = lang.value === 'ckb' ? p.kmrContent : p.ckbContent
  return primary?.title || fallback?.title || p.slugCkb || p.slugKmr || ''
}

async function fetchAbout() {
  loading.value = true; error.value = null
  try {
    const { data } = await api.get('/about')
    const list = Array.isArray(data) ? data : (data?.data || [])
    allPages.value = list.filter(p => p.active !== false)
    const slug = window.location.hash?.replace('#', '') || ''
    page.value = allPages.value.find(p => p.slugCkb === slug || p.slugKmr === slug) || allPages.value[0] || null
  } catch (e) {
    error.value = e?.response?.data?.message || e.message || 'هەڵەیەک ڕوویدا'
  } finally { loading.value = false }
}

function switchPage(p) {
  page.value = p
  const slug = lang.value === 'ckb' ? (p.slugCkb || p.slugKmr) : (p.slugKmr || p.slugCkb)
  if (slug) window.location.hash = slug
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const blocks = computed(() =>
  (page.value?.blocks || []).slice().sort((a, b) => (a.sequence ?? 0) - (b.sequence ?? 0))
)

// UPDATED: Now pairs TEXT with either IMAGE or VIDEO to fix layout crashes
const pairedBlocks = computed(() => {
  const raw = blocks.value; const out = []; let i = 0
  while (i < raw.length) {
    const cur = raw[i]; const next = raw[i + 1]
    if (cur.contentType === 'TEXT' && (next?.contentType === 'IMAGE' || next?.contentType === 'VIDEO')) { 
      out.push({ type:'pair', text:cur, media:next }); 
      i+=2 
    }
    else { 
      out.push({ type: cur.contentType.toLowerCase(), data: cur }); 
      i++ 
    }
  }
  return out
})

const heroImage = computed(() => {
  if (page.value?.heroImageUrl) return resolveUrl(page.value.heroImageUrl)
  const img = blocks.value.find(b => b.contentType === 'IMAGE' && b.mediaUrl)
  if (img) return resolveUrl(img.mediaUrl)
  return 'https://picsum.photos/seed/khi/1600/640'
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

function isEmbed(url) { return url && (url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com')) }

function toEmbed(url) {
  if (!url) return ''
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`
  const vm = url.match(/vimeo\.com\/(\d+)/)
  if (vm) return `https://player.vimeo.com/video/${vm[1]}`
  return url
}

function getStats(block) {
  try { const m = block.metadata; if (m?.items && Array.isArray(m.items)) return m.items; if (Array.isArray(m)) return m; return [] }
  catch { return [] }
}

function openLb(block) { 
  if(block.contentType !== 'VIDEO' && block.contentType !== 'AUDIO') {
    lightbox.value = block 
  }
}

onMounted(fetchAbout)
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;0,8..60,600;0,8..60,700;0,8..60,900;1,8..60,300&family=Source+Sans+3:wght@300;400;600;700&display=swap');

/* ── tokens ─────────────────────────────────────────── */
.stanford-about {
  /* Official Stanford Brand Specs */
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
  
  background-color: #fff;
  color: var(--black);
  font-family: var(--sans);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  min-height: 100vh;
}

.su-container {
  max-width: var(--max-w);
  margin: 0 auto;
  padding: 0 clamp(20px, 4vw, 52px);
}

/* ── loading / error states ────────────────────────── */
.state-screen {
  min-height: 60vh; display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: 16px; text-align: center; padding: 48px; color: var(--warm-grey);
}
.state-caption { font-size: 1.05rem; }
.state-err     { color: var(--cardinal); font-weight: 600; font-size: 1.05rem; }
.state-icon    { width: 40px; height: 40px; color: var(--cardinal); opacity: .65; }
.su-dots       { display: flex; gap: 9px; align-items: center; }
.su-dots span  {
  width: 11px; height: 11px; border-radius: 50%; background: var(--cardinal);
  animation: dot-pulse 1.3s ease-in-out infinite;
}
.su-dots span:nth-child(2) { animation-delay: .18s; background: #b33; }
.su-dots span:nth-child(3) { animation-delay: .36s; background: #c55; }
@keyframes dot-pulse { 0%,80%,100%{transform:scale(.55);opacity:.35} 40%{transform:scale(1);opacity:1} }
.su-text-btn {
  background: none; border: none; padding: 0;
  font: 700 1rem var(--sans); color: var(--cardinal);
  text-decoration: underline; text-underline-offset: 3px; cursor: pointer;
}

/* ── language bar ──────────────────────────────────── */
.lang-bar {
  position: sticky; top: 0; z-index: 50;
  background: rgba(255,255,255,.96); backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--fog);
}
.lang-bar__inner {
  max-width: var(--max-w); margin-inline: auto;
  padding-inline: clamp(20px,4vw,52px);
  height: 46px; display: flex; align-items: center;
}
.lang-bar__sep { width: 1px; height: 16px; background: var(--fog); flex-shrink: 0; }
.lang-bar__btn {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 0 18px; height: 46px; background: none; border: none;
  font: 600 .82rem var(--sans); letter-spacing: .04em;
  color: var(--warm-grey); cursor: pointer; position: relative; transition: color .18s;
}
.lang-bar__btn::after {
  content: ''; position: absolute; bottom: 0; left: 0; right: 0;
  height: 2px; background: var(--cardinal); transform: scaleX(0); transition: transform .2s;
}
.lang-bar__btn--active         { color: var(--black); font-weight: 700; }
.lang-bar__btn--active::after  { transform: scaleX(1); }
.lang-bar__btn:hover           { color: var(--black); }
.lang-bar__dot                 { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
.lang-bar__dot--ckb            { background: var(--cardinal); }
.lang-bar__dot--kmr            { background: #1d6bbf; }

/* ── HERO ─────────────────────────────────────────── */
.su-hero {
  position: relative;
  height: 60vh;
  min-height: 400px;
  overflow: hidden;
  background: var(--black);
}

.su-hero__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.su-hero__overlay {
  position: absolute; inset: auto 0 0 0; height: 180px;
  background: linear-gradient(to top, #fff 0%, rgba(255,255,255,0) 100%);
  pointer-events: none;
}

/* ── INTRO ────────────────────────────────────────── */
.su-intro {
  text-align: center;
  padding: 80px clamp(20px, 6vw, 80px) 60px;
  max-width: 950px;
  margin: 0 auto;
}

.su-intro__title {
  font-family: var(--serif);
  font-size: clamp(2.8rem, 6vw, 4.5rem);
  font-weight: 900; 
  line-height: 1.05;
  color: var(--black);
  margin-bottom: 30px;
  letter-spacing: -0.02em;
}

.su-intro__lead {
  font-family: var(--serif);
  font-size: clamp(1.2rem, 2.5vw, 1.6rem);
  font-weight: 300;
  line-height: 1.5;
  color: var(--warm-grey);
}

/* ── Content rules ────────────────────────────────── */
.su-rule {
  border: none; border-top: 1px solid var(--line);
  max-width: var(--max-w); margin: 0 auto;
  padding-inline: clamp(20px, 4vw, 52px);
}
.su-stack .su-rule { max-width: 100%; }

/* ── DUO (Alternating Grid) ───────────────────────── */
.su-duo {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(40px, 8vw, 100px);
  align-items: center;
  max-width: var(--max-w);
  margin: 0 auto;
  padding: 80px clamp(20px, 4vw, 52px);
}

.su-duo--reversed { direction: ltr; }
.su-duo--reversed > * { direction: rtl; }

.su-block-h {
  font-family: var(--serif);
  font-size: clamp(1.6rem, 3vw, 2.2rem);
  font-weight: 700;
  margin-bottom: 25px;
  color: var(--black);
  line-height: 1.2;
}
.su-block-h.center { text-align: center; }
.su-block-h.light { color: #fff; }
.su-block-h--sm { font-size: clamp(1.2rem, 2vw, 1.5rem); }

.su-prose {
  font-size: 1.15rem;
  line-height: 1.75;
}
.su-prose.center { text-align: center; }
.su-prose.light { color: rgba(255,255,255,0.8); }
.su-prose :deep(p) { margin: 0 0 1em; }
.su-prose :deep(p:last-child) { margin: 0; }

.su-btn {
  display: inline-block;
  background-color: var(--cardinal);
  color: #ffffff;
  padding: 12px 24px;
  font-family: var(--sans);
  font-weight: 700;
  font-size: 0.95rem;
  text-decoration: none;
  border-radius: 0; 
  margin-top: 25px;
  transition: background-color 0.2s ease;
  border: none;
  cursor: pointer;
}
.su-btn:hover { background-color: var(--cardinal-dark); }

/* ── MEDIA (Video / Standalone) ───────────────────── */
.su-text-block, .su-media-block, .su-audio-block {
  padding: 60px 0;
}

.su-video-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  background: #000;
  overflow: hidden;
  border-radius: 2px;
}
.su-video-wrapper.shadow {
  box-shadow: 0 15px 35px rgba(0,0,0,0.1);
}
.su-video-wrapper iframe, .su-video-wrapper video {
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
}

.su-caption {
  margin-top: 15px; font-size: 0.95rem; color: var(--warm-grey);
  font-style: italic; text-align: center;
}

/* ── IMAGES ───────────────────────────────────────── */
.su-figure { cursor: zoom-in; margin: 0; }
.su-figure__crop { overflow: hidden; background: var(--sandstone); border-radius: 2px; }
.su-figure__crop img {
  width: 100%; display: block;
  transition: transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
}
.su-figure:hover .su-figure__crop img { transform: scale(1.03); }
.su-figure__cap {
  margin-top: 15px; font-size: 0.95rem; color: var(--warm-grey);
  font-family: var(--sans); border-inline-start: 2px solid var(--cardinal);
  padding-inline-start: 15px;
}
.su-figure__cap strong { color: var(--black); }

/* ── AUDIO ────────────────────────────────────────── */
.su-audio-row {
  display: flex; align-items: center; gap: 40px; flex-wrap: wrap;
  padding: 40px; border-top: 3px solid var(--cardinal); background: var(--sandstone);
}
.su-audio-row__info { flex: 1; min-width: 250px; }
.su-audio-row__el   { flex: 0 0 300px; width: 300px; }

/* ── STATS ────────────────────────────────────────── */
.su-stats-band {
  background: var(--black); color: #fff; padding: 100px 0; margin: 40px 0;
}
.su-stats-grid {
  display: flex; justify-content: center; flex-wrap: wrap;
  margin-top: 50px; gap: 60px;
}
.su-stat-card { text-align: center; flex: 1; min-width: 180px; }
.su-stat-val {
  display: block; font-family: var(--serif); font-size: clamp(3.5rem, 6vw, 5rem);
  font-weight: 700; color: var(--gold); line-height: 1; margin-bottom: 15px;
}
.su-stat-bar {
  display: block; width: 40px; height: 2px; background: rgba(255,255,255,0.2); margin: 0 auto 15px;
}
.su-stat-lbl {
  display: block; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.1em; font-size: 0.9rem; color: var(--fog);
}

/* ── QUOTES ───────────────────────────────────────── */
.su-quote-block {
  background: var(--sandstone); padding: 100px 0; text-align: center; margin: 40px 0;
}
.su-quote { max-width: 900px; margin: 0 auto; padding: 0 20px; }
.su-quote__text {
  font-family: var(--serif); font-size: clamp(1.8rem, 4vw, 2.6rem);
  font-style: italic; font-weight: 300; color: var(--cardinal);
  margin: 0 auto 30px; line-height: 1.4;
}
.su-quote__author {
  display: block; font-family: var(--sans); font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.15em; font-size: 0.85rem;
  color: var(--warm-grey); font-style: normal;
}

/* ── META & NAV ───────────────────────────────────── */
.su-meta {
  padding: 40px 0 60px; border-top: 1px solid var(--line);
  color: var(--warm-grey); font-size: 0.95rem;
}
.su-page-nav { padding: 0 0 80px; }
.su-page-nav__inner { display: flex; align-items: center; gap: 15px; flex-wrap: wrap; }
.su-page-nav__label { font: 700 .75rem var(--sans); letter-spacing: .1em; text-transform: uppercase; color: var(--warm-grey); }
.su-page-nav__list  { display: flex; gap: 10px; flex-wrap: wrap; }
.su-page-nav__item  {
  background: none; border: 1px solid var(--line); border-radius: 2px;
  padding: 8px 18px; font: 600 .9rem var(--sans); color: var(--black);
  cursor: pointer; transition: all .15s;
}
.su-page-nav__item:hover { border-color: var(--cardinal); color: var(--cardinal); }
.su-page-nav__item--current { background: var(--cardinal); border-color: var(--cardinal); color: #fff; }

/* ── LIGHTBOX ─────────────────────────────────────── */
.su-lb {
  position: fixed; inset: 0; z-index: 9999; background: rgba(10,8,6,.96);
  display: flex; align-items: center; justify-content: center; padding: 40px 20px;
}
.su-lb__close {
  position: absolute; top: 20px; inset-inline-end: 20px;
  width: 44px; height: 44px; border-radius: 50%;
  background: rgba(255,255,255,.1); border: 1px solid rgba(255,255,255,.2);
  color: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer;
}
.su-lb__close:hover { background: rgba(255,255,255,.2); }
.su-lb__fig img { max-width: 90vw; max-height: 80vh; display: block; margin: 0 auto; border-radius: 2px; }
.su-lb__fig figcaption { margin-top: 15px; color: rgba(255,255,255,.7); font: 400 .9rem var(--sans); text-align: center; }
.su-lb__fig figcaption strong { color: #fff; }

.lb-enter-active, .lb-leave-active { transition: opacity .25s ease; }
.lb-enter-from, .lb-leave-to { opacity: 0; }

/* ── RESPONSIVE ───────────────────────────────────── */
@media (max-width: 900px) {
  .su-duo { grid-template-columns: 1fr; gap: 40px; padding-block: 60px; }
  .su-duo--reversed { direction: rtl; } /* Reset stack logic for mobile */
  .su-audio-row__el { width: 100%; flex: none; }
  .su-stats-grid { gap: 40px; }
}
</style>