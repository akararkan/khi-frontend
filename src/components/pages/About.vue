<template>
  <main id="main-content" class="about" :dir="dir" :lang="langAttr">

    <!-- ══ LOADING ═══════════════════════════════════════════ -->
    <div v-if="loading" class="state-screen">
      <div class="su-dots"><span/><span/><span/></div>
      <p class="state-caption">{{ t('loading') }}</p>
    </div>

    <!-- ══ ERROR ══════════════════════════════════════════════ -->
    <div v-else-if="error" class="state-screen">
      <svg class="state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="13"/><circle cx="12" cy="16.5" r=".6" fill="currentColor"/>
      </svg>
      <p class="state-err">{{ error }}</p>
      <button class="su-text-btn" @click="fetchAbout">{{ t('retry') }}</button>
    </div>

    <!-- ══ EMPTY ═══════════════════════════════════════════════ -->
    <div v-else-if="!page" class="state-screen">
      <p class="state-caption">{{ t('empty') }}</p>
    </div>

    <!-- ══ PAGE ════════════════════════════════════════════════ -->
    <template v-else>

      <!-- ── Language toggle ───────────────────────── -->
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

      <!-- ── Hero ─────────────────────────────────── -->
      <div class="hero" role="img" :aria-label="pageTitle">
        <img :src="heroImage" alt="" class="hero__photo" loading="eager" fetchpriority="high" />
        <div class="hero__veil" aria-hidden="true"></div>
      </div>

      <!-- ── Page intro (title + lead paragraph) ───── -->
      <div class="intro">
        <h1 class="intro__title">{{ pageTitle }}</h1>
        <p v-if="pageSubtitle" class="intro__lead">{{ pageSubtitle }}</p>
      </div>

      <!-- ── Content blocks ─────────────────────────── -->
      <div class="content-stack">
        <template v-for="(block, idx) in pairedBlocks" :key="`b${idx}`">

          <div
            v-if="idx > 0 && block.type !== 'stats' && pairedBlocks[idx-1].type !== 'stats'"
            class="su-rule"
            aria-hidden="true"
          ></div>

          <!-- TEXT + IMAGE pair → alternating two-column -->
          <section
            v-if="block.type === 'pair'"
            class="su-duo"
            :class="{ 'su-duo--flip': idx % 2 !== 0 }"
          >
            <div class="su-duo__body">
              <h2 v-if="bTitle(block.text)" class="su-h">{{ bTitle(block.text) }}</h2>
              <div class="su-prose" v-html="fmt(bText(block.text))"></div>
              <a
                v-if="block.text.mediaUrl"
                :href="resolveUrl(block.text.mediaUrl)"
                class="su-btn"
                target="_blank" rel="noopener"
              >{{ t('readMore') }}</a>
            </div>
            <figure class="su-fig" @click="openLb(block.image)">
              <div class="su-fig__crop">
                <img :src="resolveUrl(block.image.mediaUrl)" :alt="bAlt(block.image)" loading="lazy" />
              </div>
              <figcaption v-if="bTitle(block.image) || bText(block.image)" class="su-fig__cap">
                <strong v-if="bTitle(block.image)">{{ bTitle(block.image) }}</strong>
                <template v-if="bTitle(block.image) && bText(block.image)"> — </template>
                {{ bText(block.image) }}
              </figcaption>
            </figure>
          </section>

          <!-- TEXT standalone -->
          <section v-else-if="block.type === 'text'" class="su-text" :id="`s${block.data.sequence}`">
            <h2 v-if="bTitle(block.data)" class="su-h">{{ bTitle(block.data) }}</h2>
            <div class="su-prose su-prose--wide" v-html="fmt(bText(block.data))"></div>
          </section>

          <!-- IMAGE standalone -->
          <figure v-else-if="block.type === 'image'" class="su-img-full" :id="`s${block.data.sequence}`" @click="openLb(block.data)">
            <div class="su-img-full__crop">
              <img :src="resolveUrl(block.data.mediaUrl)" :alt="bAlt(block.data)" loading="lazy" />
            </div>
            <figcaption v-if="bTitle(block.data) || bText(block.data)" class="su-fig__cap">
              <strong v-if="bTitle(block.data)">{{ bTitle(block.data) }}</strong>
              <template v-if="bTitle(block.data) && bText(block.data)"> — </template>
              {{ bText(block.data) }}
            </figcaption>
          </figure>

          <!-- VIDEO -->
          <section v-else-if="block.type === 'video'" class="su-media" :id="`s${block.data.sequence}`">
            <h2 v-if="bTitle(block.data)" class="su-h">{{ bTitle(block.data) }}</h2>
            <div class="su-video">
              <iframe v-if="isEmbed(block.data.mediaUrl)" :src="toEmbed(block.data.mediaUrl)"
                frameborder="0" allowfullscreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture">
              </iframe>
              <video v-else controls preload="metadata">
                <source :src="resolveUrl(block.data.mediaUrl)" />
              </video>
            </div>
            <p v-if="bText(block.data)" class="su-caption">{{ bText(block.data) }}</p>
          </section>

          <!-- AUDIO -->
          <section v-else-if="block.type === 'audio'" class="su-audio-row" :id="`s${block.data.sequence}`">
            <div class="su-audio-row__info">
              <h2 v-if="bTitle(block.data)" class="su-h su-h--sm">{{ bTitle(block.data) }}</h2>
              <p v-if="bText(block.data)" class="su-prose">{{ bText(block.data) }}</p>
            </div>
            <audio controls class="su-audio-row__el" preload="metadata">
              <source :src="resolveUrl(block.data.mediaUrl)" />
            </audio>
          </section>

          <!-- QUOTE -->
          <section v-else-if="block.type === 'quote'" class="su-pullquote" :id="`s${block.data.sequence}`">
            <div class="su-pullquote__inner">
              <span class="su-pullquote__deco" aria-hidden="true">"</span>
              <blockquote class="su-pullquote__body">
                <p>{{ bText(block.data) }}</p>
                <cite v-if="bTitle(block.data)">{{ bTitle(block.data) }}</cite>
              </blockquote>
            </div>
          </section>

          <!-- STATS -->
          <section v-else-if="block.type === 'stats'" class="su-stats-band" :id="`s${block.data.sequence}`">
            <div class="su-stats-band__inner">
              <h2 v-if="bTitle(block.data)" class="su-h su-h--light su-h--center">{{ bTitle(block.data) }}</h2>
              <p v-if="bText(block.data)" class="su-prose su-prose--light su-prose--center">{{ bText(block.data) }}</p>
              <div v-if="getStats(block.data).length" class="su-stats">
                <div class="su-stats__item" v-for="(s, si) in getStats(block.data)" :key="si">
                  <span class="su-stats__num">{{ s.value }}</span>
                  <span class="su-stats__bar" aria-hidden="true"></span>
                  <span class="su-stats__lbl">{{ s.label }}</span>
                </div>
              </div>
            </div>
          </section>

          <!-- GALLERY -->
          <figure v-else-if="block.type === 'gallery'" class="su-img-full" :id="`s${block.data.sequence}`" @click="openLb(block.data)">
            <div class="su-img-full__crop">
              <img :src="resolveUrl(block.data.mediaUrl)" :alt="bAlt(block.data)" loading="lazy" />
            </div>
            <figcaption v-if="bTitle(block.data)" class="su-fig__cap">{{ bTitle(block.data) }}</figcaption>
          </figure>

        </template>
      </div>

      <!-- ── Meta ─────────────────────────────────── -->
      <div v-if="pageMetaDesc" class="su-meta">
        <p>{{ pageMetaDesc }}</p>
      </div>

      <!-- ── Multi-page nav ────────────────────────── -->
      <nav v-if="allPages.length > 1" class="su-page-nav" :aria-label="t('pagesNav')">
        <span class="su-page-nav__label">{{ t('otherPages') }}</span>
        <div class="su-page-nav__list">
          <button
            v-for="p in allPages" :key="p.id"
            class="su-page-nav__item"
            :class="{ 'su-page-nav__item--current': p.id === page.id }"
            @click="switchPage(p)"
          >{{ getPageTitle(p) }}</button>
        </div>
      </nav>

    </template>

    <!-- ══ LIGHTBOX ════════════════════════════════════════════ -->
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
const pairedBlocks = computed(() => {
  const raw = blocks.value; const out = []; let i = 0
  while (i < raw.length) {
    const cur = raw[i]; const next = raw[i + 1]
    if (cur.contentType === 'TEXT' && next?.contentType === 'IMAGE') { out.push({ type:'pair', text:cur, image:next }); i+=2 }
    else { out.push({ type: cur.contentType.toLowerCase(), data: cur }); i++ }
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
function openLb(block) { lightbox.value = block }
onMounted(fetchAbout)
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;0,8..60,700;0,8..60,900;1,8..60,300&family=Source+Sans+3:wght@300;400;600;700&display=swap');

/* ── tokens ─────────────────────────────────────────── */
.about {
  --red:    #8C1515;
  --red-dk: #6f1111;
  --gold:   #C9AA71;
  --text:   #2E2D29;
  --muted:  #767571;
  --line:   #D1CFC9;
  --pale:   #F4F4F2;
  --dark:   #1C1A18;
  --w:      1100px;
  --serif:  'Source Serif 4', Georgia, 'Times New Roman', serif;
  --sans:   'Source Sans 3', 'Helvetica Neue', Arial, sans-serif;

  font-family: var(--sans);
  font-size: 17px;
  line-height: 1.78;
  color: var(--text);
  background: #fff;
  min-height: 100vh;
  overflow-x: hidden;
}

/* ── loading / error states ────────────────────────── */
.state-screen {
  min-height: 60vh; display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: 16px; text-align: center; padding: 48px; color: var(--muted);
}
.state-caption { font-size: 1.05rem; }
.state-err     { color: var(--red); font-weight: 600; font-size: 1.05rem; }
.state-icon    { width: 40px; height: 40px; color: var(--red); opacity: .65; }
.su-dots       { display: flex; gap: 9px; align-items: center; }
.su-dots span  {
  width: 11px; height: 11px; border-radius: 50%; background: var(--red);
  animation: dot-pulse 1.3s ease-in-out infinite;
}
.su-dots span:nth-child(2) { animation-delay: .18s; background: #b33; }
.su-dots span:nth-child(3) { animation-delay: .36s; background: #c55; }
@keyframes dot-pulse { 0%,80%,100%{transform:scale(.55);opacity:.35} 40%{transform:scale(1);opacity:1} }
.su-text-btn {
  background: none; border: none; padding: 0;
  font: 700 1rem var(--sans); color: var(--red);
  text-decoration: underline; text-underline-offset: 3px; cursor: pointer;
}
.su-text-btn:hover { color: var(--red-dk); }

/* ── language bar ──────────────────────────────────── */
.lang-bar {
  position: sticky; top: 0; z-index: 50;
  background: rgba(255,255,255,.96); backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--line);
}
.lang-bar__inner {
  max-width: var(--w); margin-inline: auto;
  padding-inline: clamp(20px,4vw,52px);
  height: 46px; display: flex; align-items: center;
}
.lang-bar__sep { width: 1px; height: 16px; background: var(--line); flex-shrink: 0; }
.lang-bar__btn {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 0 18px; height: 46px; background: none; border: none;
  font: 600 .82rem var(--sans); letter-spacing: .04em;
  color: var(--muted); cursor: pointer; position: relative; transition: color .18s;
}
.lang-bar__btn::after {
  content: ''; position: absolute; bottom: 0; left: 0; right: 0;
  height: 2px; background: var(--red); transform: scaleX(0); transition: transform .2s;
}
.lang-bar__btn--active         { color: var(--text); font-weight: 700; }
.lang-bar__btn--active::after  { transform: scaleX(1); }
.lang-bar__btn:hover           { color: var(--text); }
.lang-bar__dot                 { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
.lang-bar__dot--ckb            { background: var(--red); }
.lang-bar__dot--kmr            { background: #1d6bbf; }

/* ── hero — full-bleed photo ──────────────────────── */
.hero { position: relative; overflow: hidden; background: var(--dark); }
.hero__photo {
  display: block; width: 100%;
  height: clamp(240px, 42vw, 560px);
  object-fit: cover; object-position: center 32%;
}
.hero__veil {
  position: absolute; inset: auto 0 0 0; height: 180px;
  background: linear-gradient(to top, #fff 0%, rgba(255,255,255,0) 100%);
  pointer-events: none;
}

/* ── page intro ────────────────────────────────────
   Centred bold serif title + light lead paragraph.
   Matches Stanford's "Who We Are" section exactly.
───────────────────────────────────────────────────── */
.intro {
  text-align: center;
  padding: 3rem clamp(2rem, 9vw, 7rem) 3.8rem;
  max-width: var(--w);
  margin-inline: auto;
}

/* Large bold black serif — "Who We Are" */
.intro__title {
  font-family: var(--serif);
  font-size: clamp(2rem, 4.6vw, 3rem);
  font-weight: 900;
  line-height: 1.06;
  letter-spacing: -.02em;
  color: var(--text);
  margin: 0 0 1.8rem;
}

/* Light-weight centred serif lead paragraph */
.intro__lead {
  font-family: var(--serif);
  font-size: clamp(1.02rem, 1.45vw, 1.2rem);
  font-weight: 300;
  line-height: 1.84;
  color: var(--text);
  max-width: 780px;
  margin: 0 auto;
}

/* ── section dividers ──────────────────────────────── */
.su-rule {
  border: none; border-top: 1px solid var(--line);
  max-width: var(--w); margin: 0 auto;
  padding-inline: clamp(20px, 4vw, 52px);
}
.content-stack .su-rule { max-width: 100%; }

/* ── section headings ──────────────────────────────
   Bold serif, compact size — NO red underline bar.
   Matches "Excellence in education across disciplines"
───────────────────────────────────────────────────── */
.su-h {
  font-family: var(--serif);
  font-size: clamp(1.05rem, 1.7vw, 1.28rem);
  font-weight: 700;
  line-height: 1.26;
  color: var(--text);
  margin: 0 0 1rem;
}
.su-h--sm     { font-size: clamp(1rem, 1.5vw, 1.15rem); }
.su-h--light  { color: rgba(255,255,255,.95); }
.su-h--center { text-align: center; }

/* ── prose body ────────────────────────────────────── */
.su-prose             { font-size: 1rem; line-height: 1.82; color: var(--text); }
.su-prose--wide       { max-width: 74ch; }
.su-prose--center     { text-align: center; }
.su-prose--light      { color: rgba(255,255,255,.72); }
.su-prose :deep(p)    { margin: 0 0 .88em; }
.su-prose :deep(p:last-child) { margin: 0; }

/* ── solid red button ──────────────────────────────
   Stanford's rectangular "Learn more about academics"
   button — zero border-radius, cardinal red fill.
───────────────────────────────────────────────────── */
.su-btn {
  display: inline-block;
  margin-top: 1.4rem;
  padding: .78rem 1.6rem;
  background: var(--red);
  color: #fff;
  font-family: var(--sans);
  font-size: .88rem;
  font-weight: 400;
  line-height: 1;
  text-decoration: none;
  border: none;
  border-radius: 0;
  cursor: pointer;
  transition: background .15s;
  white-space: nowrap;
}
.su-btn:hover { background: var(--red-dk); }

/* ── content stack ─────────────────────────────────── */
.content-stack { display: flex; flex-direction: column; padding-bottom: 72px; }

/* standalone text */
.su-text {
  max-width: var(--w); margin-inline: auto;
  padding: 52px clamp(20px,4vw,52px);
}

/* ── two-column duo layout ─────────────────────────
   Text left / image right by default.
   .su-duo--flip  →  image left / text right.
   Uses direction trick to flip columns in RTL context.
───────────────────────────────────────────────────── */
.su-duo {
  max-width: var(--w);
  margin-inline: auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(32px, 5vw, 76px);
  align-items: start;
  padding: clamp(2.6rem, 4.5vw, 4.5rem) clamp(20px, 4vw, 52px);
}

/* flip: swap column order */
.su-duo--flip     { direction: ltr; }
.su-duo--flip > * { direction: rtl; }

@media (max-width: 820px) {
  .su-duo         { grid-template-columns: 1fr; gap: 20px; }
  .su-duo--flip   { direction: rtl; }
  .su-duo--flip > *{ direction: rtl; }
}

.su-duo__body { padding-top: 2px; }

/* ── figure / image ────────────────────────────────── */
.su-fig           { margin: 0; cursor: zoom-in; }
.su-img-full      { cursor: zoom-in; }

.su-fig__crop     { overflow: hidden; background: var(--pale); }
.su-img-full__crop {
  overflow: hidden; background: var(--pale);
  max-width: var(--w); margin-inline: auto;
  padding-inline: clamp(20px,4vw,52px);
}

/* Fixed height so images fill the column uniformly */
.su-fig__crop img {
  display: block; width: 100%;
  height: clamp(220px, 28vw, 400px);
  object-fit: cover;
  transition: transform .5s cubic-bezier(.2,.8,.2,1);
}
.su-img-full__crop img {
  display: block; width: 100%;
  max-height: 480px; object-fit: cover;
  transition: transform .5s cubic-bezier(.2,.8,.2,1);
}
.su-fig:hover .su-fig__crop img,
.su-img-full:hover .su-img-full__crop img { transform: scale(1.04); }

.su-fig__cap       { margin-top: 10px; font: 400 .84rem/1.55 var(--sans); color: var(--muted); }
.su-fig__cap strong{ color: var(--text); }

/* ── video ─────────────────────────────────────────── */
.su-media    { max-width: var(--w); margin-inline: auto; padding: 52px clamp(20px,4vw,52px); }
.su-video    { position: relative; aspect-ratio: 16/9; background: #111; overflow: hidden; margin-bottom: 10px; }
.su-video iframe, .su-video video { position: absolute; inset: 0; width: 100%; height: 100%; }
.su-caption  { font: 400 .87rem/1.55 var(--sans); color: var(--muted); }

/* ── audio row ─────────────────────────────────────── */
.su-audio-row {
  display: flex; align-items: center; gap: 48px; flex-wrap: wrap;
  max-width: var(--w); margin-inline: auto;
  padding: 32px clamp(20px,4vw,52px);
  border-top: 3px solid var(--red); background: var(--pale);
}
.su-audio-row__info { flex: 1; min-width: 200px; }
.su-audio-row__el   { flex: 0 0 260px; width: 260px; }
@media (max-width: 700px) { .su-audio-row__el{width:100%;flex:none} .su-audio-row{gap:16px} }

/* ── pull quote ─────────────────────────────────────── */
.su-pullquote { background: var(--pale); padding: 64px 0; }
.su-pullquote__inner {
  max-width: var(--w); margin-inline: auto;
  padding-inline: clamp(20px,4vw,52px);
  max-width: 840px; position: relative; padding-inline-start: 72px;
}
.su-pullquote__deco {
  position: absolute; inset-inline-start: clamp(20px,4vw,52px); top: -14px;
  font: 300 9rem/1 var(--serif); color: var(--red); opacity: .14;
  pointer-events: none; user-select: none;
}
.su-pullquote__body { margin: 0; }
.su-pullquote__body p {
  font: 300 clamp(19px,2.6vw,27px)/1.58 var(--serif);
  font-style: italic; color: var(--text); margin: 0 0 18px;
}
.su-pullquote__body cite {
  display: block; font: 700 .76rem var(--sans); font-style: normal;
  letter-spacing: .1em; text-transform: uppercase; color: var(--red);
}

/* ── stats band ─────────────────────────────────────── */
.su-stats-band       { background: var(--dark); padding: 64px 0; }
.su-stats-band__inner{ max-width: var(--w); margin-inline: auto; padding-inline: clamp(20px,4vw,52px); }
.su-stats {
  display: flex; flex-wrap: wrap;
  border-top: 1px solid rgba(255,255,255,.12); margin-top: 44px;
}
.su-stats__item {
  flex: 1; min-width: 130px; padding: 32px 24px;
  border-inline-end: 1px solid rgba(255,255,255,.1); text-align: center;
}
.su-stats__item:last-child { border-inline-end: none; }
.su-stats__num { display: block; font: 300 clamp(2.4rem,4.8vw,3.6rem)/1 var(--serif); color: var(--gold); margin-bottom: 12px; }
.su-stats__bar { display: block; width: 26px; height: 2px; background: rgba(255,255,255,.18); margin: 0 auto 12px; }
.su-stats__lbl { display: block; font: 700 .7rem var(--sans); text-transform: uppercase; letter-spacing: .1em; color: rgba(255,255,255,.45); }
@media (max-width:700px){
  .su-stats{flex-direction:column}
  .su-stats__item{border-inline-end:none;border-bottom:1px solid rgba(255,255,255,.08);padding:20px 16px}
  .su-stats__item:last-child{border-bottom:none}
}

/* ── meta + page nav ────────────────────────────────── */
.su-meta {
  max-width: var(--w); margin-inline: auto;
  padding: 24px clamp(20px,4vw,52px) 48px;
  border-top: 1px solid var(--line); color: var(--muted);
  font: 400 .92rem/1.72 var(--sans);
}
.su-meta p { margin: 0; max-width: 72ch; }

.su-page-nav {
  max-width: var(--w); margin-inline: auto;
  display: flex; align-items: center; gap: 12px; flex-wrap: wrap;
  padding: 24px clamp(20px,4vw,52px) 60px; border-top: 1px solid var(--line);
}
.su-page-nav__label { font: 700 .72rem var(--sans); letter-spacing: .11em; text-transform: uppercase; color: var(--muted); flex-shrink: 0; }
.su-page-nav__list  { display: flex; gap: 8px; flex-wrap: wrap; }
.su-page-nav__item  {
  background: none; border: 1px solid var(--line); border-radius: 2px;
  padding: 7px 16px; font: 600 .86rem var(--sans); color: var(--text);
  cursor: pointer; transition: border-color .14s, color .14s, background .14s;
}
.su-page-nav__item:hover           { border-color: var(--red); color: var(--red); }
.su-page-nav__item--current        { background: var(--red); border-color: var(--red); color: #fff; }

/* ── lightbox ───────────────────────────────────────── */
.su-lb {
  position: fixed; inset: 0; z-index: 9999;
  background: rgba(10,8,6,.94);
  display: flex; align-items: center; justify-content: center;
  padding: 52px 20px 24px;
}
.su-lb__close {
  position: absolute; top: 14px; inset-inline-end: 18px;
  width: 40px; height: 40px; border-radius: 50%;
  background: rgba(255,255,255,.07); border: 1px solid rgba(255,255,255,.2);
  color: rgba(255,255,255,.8); display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: background .14s, border-color .14s, color .14s;
}
.su-lb__close svg  { width: 17px; height: 17px; }
.su-lb__close:hover{ background: rgba(255,255,255,.15); border-color: rgba(255,255,255,.5); color:#fff; }
.su-lb__fig        { margin: 0; text-align: center; }
.su-lb__fig img    { max-width: 88vw; max-height: 76vh; display: block; margin: 0 auto; border-radius: 2px; }
.su-lb__fig figcaption { margin-top: 12px; color: rgba(255,255,255,.55); font: 400 .84rem var(--sans); text-align: center; max-width: 58ch; margin-inline: auto; }
.su-lb__fig figcaption strong { color: rgba(255,255,255,.9); }

/* ── lightbox transition ────────────────────────────── */
.lb-enter-active { transition: opacity .26s ease, transform .26s ease; }
.lb-leave-active { transition: opacity .18s ease; }
.lb-enter-from   { opacity: 0; transform: scale(.97); }
.lb-leave-to     { opacity: 0; }

/* ── responsive ─────────────────────────────────────── */
@media (max-width: 840px) {
  .hero__photo { height: clamp(190px,48vw,360px); }
  .intro       { padding-block: 2rem 2.8rem; }
  .su-text, .su-media, .su-duo { padding-block: 36px; }
  .su-pullquote { padding-block: 44px; }
  .su-stats-band{ padding-block: 44px; }
}
@media (max-width: 600px) {
  .intro__title { letter-spacing: 0; }
  .lang-bar__btn{ padding-inline: 10px; }
  .su-pullquote__inner { padding-inline-start: 28px; }
  .su-pullquote__deco  { font-size: 5.5rem; }
}
</style>