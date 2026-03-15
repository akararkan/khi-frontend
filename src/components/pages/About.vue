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
          <button
            class="lang-bar__btn"
            :class="{ 'lang-bar__btn--active': lang === 'ckb' }"
            @click="setLang('ckb')"
          >
            <span class="lang-bar__dot lang-bar__dot--ckb"></span>
            کوردی سۆرانی
          </button>
          <div class="lang-bar__sep"></div>
          <button
            class="lang-bar__btn"
            :class="{ 'lang-bar__btn--active': lang === 'kmr' }"
            @click="setLang('kmr')"
          >
            <span class="lang-bar__dot lang-bar__dot--kmr"></span>
            Kurmancî
          </button>
        </div>
      </div>

      <!-- ── Hero ─────────────────────────────────── -->
      <!--
        Priority order for the hero image:
          1. page.heroImageUrl  — dedicated banner set in the admin editor
          2. first IMAGE block with a mediaUrl — automatic fallback
          3. picsum placeholder — last resort
      -->
      <div class="hero" role="img" :aria-label="pageTitle">
        <img
          :src="heroImage"
          alt=""
          class="hero__photo"
          loading="eager"
          fetchpriority="high"
        />
        <div class="hero__veil" aria-hidden="true"></div>
      </div>

      <!-- ── Page intro ─────────────────────────────── -->
      <div class="intro">
        <div class="intro__shell">
          <p class="eyebrow">
            <span class="eyebrow__rule" aria-hidden="true"></span>
            {{ t('about') }}
          </p>
          <h1 class="intro__title">{{ pageTitle }}</h1>
          <p v-if="pageSubtitle" class="intro__lead">{{ pageSubtitle }}</p>
        </div>
      </div>

      <!-- ── Content blocks ─────────────────────────── -->
      <div class="content-stack">
        <template v-for="(block, idx) in pairedBlocks" :key="`b${idx}`">

          <!-- separator (not after last, not before/after stats) -->
          <div
            v-if="idx > 0 && block.type !== 'stats' && pairedBlocks[idx-1].type !== 'stats'"
            class="su-rule"
            aria-hidden="true"
          ></div>

          <!-- TEXT + IMAGE → two-column alternating -->
          <section
            v-if="block.type === 'pair'"
            class="su-duo wrap"
            :class="{ 'su-duo--mirror': idx % 2 !== 0 }"
          >
            <div class="su-duo__body">
              <h2 v-if="bTitle(block.text)" class="su-h">{{ bTitle(block.text) }}</h2>
              <div class="su-prose" v-html="fmt(bText(block.text))"></div>
              <a
                v-if="block.text.mediaUrl"
                :href="resolveUrl(block.text.mediaUrl)"
                class="su-cta" target="_blank" rel="noopener"
              >
                {{ t('readMore') }}
                <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <line x1="4" y1="10" x2="16" y2="10"/><polyline points="10 4 16 10 10 16"/>
                </svg>
              </a>
            </div>
            <figure class="su-fig" @click="openLb(block.image)">
              <div class="su-fig__crop">
                <img
                  :src="resolveUrl(block.image.mediaUrl)"
                  :alt="bAlt(block.image)"
                  loading="lazy"
                />
              </div>
              <figcaption v-if="bTitle(block.image) || bText(block.image)" class="su-fig__cap">
                <strong v-if="bTitle(block.image)">{{ bTitle(block.image) }}</strong>
                <template v-if="bTitle(block.image) && bText(block.image)"> — </template>
                {{ bText(block.image) }}
              </figcaption>
            </figure>
          </section>

          <!-- TEXT standalone -->
          <section v-else-if="block.type === 'text'" class="su-text wrap" :id="`s${block.data.sequence}`">
            <h2 v-if="bTitle(block.data)" class="su-h">{{ bTitle(block.data) }}</h2>
            <div class="su-prose su-prose--wide" v-html="fmt(bText(block.data))"></div>
          </section>

          <!-- IMAGE standalone -->
          <figure
            v-else-if="block.type === 'image'"
            class="su-img-full"
            :id="`s${block.data.sequence}`"
            @click="openLb(block.data)"
          >
            <div class="su-img-full__crop wrap">
              <img
                :src="resolveUrl(block.data.mediaUrl)"
                :alt="bAlt(block.data)"
                loading="lazy"
              />
            </div>
            <figcaption v-if="bTitle(block.data) || bText(block.data)" class="su-fig__cap wrap">
              <strong v-if="bTitle(block.data)">{{ bTitle(block.data) }}</strong>
              <template v-if="bTitle(block.data) && bText(block.data)"> — </template>
              {{ bText(block.data) }}
            </figcaption>
          </figure>

          <!-- VIDEO -->
          <section v-else-if="block.type === 'video'" class="su-media wrap" :id="`s${block.data.sequence}`">
            <h2 v-if="bTitle(block.data)" class="su-h">{{ bTitle(block.data) }}</h2>
            <div class="su-video">
              <iframe
                v-if="isEmbed(block.data.mediaUrl)"
                :src="toEmbed(block.data.mediaUrl)"
                frameborder="0" allowfullscreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              ></iframe>
              <video v-else controls preload="metadata">
                <source :src="resolveUrl(block.data.mediaUrl)" />
              </video>
            </div>
            <p v-if="bText(block.data)" class="su-caption">{{ bText(block.data) }}</p>
          </section>

          <!-- AUDIO -->
          <section v-else-if="block.type === 'audio'" class="su-audio-row wrap" :id="`s${block.data.sequence}`">
            <div class="su-audio-row__info">
              <h2 v-if="bTitle(block.data)" class="su-h su-h--sm">{{ bTitle(block.data) }}</h2>
              <p v-if="bText(block.data)" class="su-prose">{{ bText(block.data) }}</p>
            </div>
            <audio controls class="su-audio-row__el" preload="metadata">
              <source :src="resolveUrl(block.data.mediaUrl)" />
            </audio>
          </section>

          <!-- QUOTE — full-width pull quote, Stanford style -->
          <section v-else-if="block.type === 'quote'" class="su-pullquote" :id="`s${block.data.sequence}`">
            <div class="wrap">
              <div class="su-pullquote__inner">
                <span class="su-pullquote__deco" aria-hidden="true">"</span>
                <blockquote class="su-pullquote__body">
                  <p>{{ bText(block.data) }}</p>
                  <cite v-if="bTitle(block.data)">{{ bTitle(block.data) }}</cite>
                </blockquote>
              </div>
            </div>
          </section>

          <!-- STATS — dark band, Stanford numbers row -->
          <section v-else-if="block.type === 'stats'" class="su-stats-band" :id="`s${block.data.sequence}`">
            <div class="wrap">
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

          <!-- GALLERY item -->
          <figure
            v-else-if="block.type === 'gallery'"
            class="su-img-full"
            :id="`s${block.data.sequence}`"
            @click="openLb(block.data)"
          >
            <div class="su-img-full__crop wrap">
              <img :src="resolveUrl(block.data.mediaUrl)" :alt="bAlt(block.data)" loading="lazy" />
            </div>
            <figcaption v-if="bTitle(block.data)" class="su-fig__cap wrap">{{ bTitle(block.data) }}</figcaption>
          </figure>

        </template>
      </div>

      <!-- ── Meta description ─────────────────────── -->
      <div v-if="pageMetaDesc" class="su-meta wrap">
        <p>{{ pageMetaDesc }}</p>
      </div>

      <!-- ── Multi-page nav ─────────────────────────── -->
      <nav v-if="allPages.length > 1" class="su-page-nav wrap" :aria-label="t('pagesNav')">
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
        <div
          v-if="lightbox"
          class="su-lb"
          role="dialog"
          :aria-label="t('imageView')"
          @click.self="lightbox = null"
        >
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

// ─── state ────────────────────────────────────────────────────────────────────
const allPages = ref([])
const page     = ref(null)
const loading  = ref(true)
const error    = ref(null)
const lightbox = ref(null)
const lang     = ref('ckb') // 'ckb' | 'kmr'

// ─── i18n strings ─────────────────────────────────────────────────────────────
const strings = {
  ckb: {
    loading:   'بارکردنی زانیارییەکان…',
    retry:     'دووبارە هەوڵبدەرەوە',
    empty:     'هیچ پەڕەیەکی دەربارە نییە.',
    readMore:  'زیاتر بخوێنەوە',
    about:     'دەربارەمان',
    otherPages:'پەڕەکانی دیکە:',
    pagesNav:  'پەڕەکانی دەربارە',
    imageView: 'پیشاندانی وێنە',
    close:     'داخستن',
  },
  kmr: {
    loading:   'Barikirna agahdarî…',
    retry:     'Dîsa biceribîne',
    empty:     'Tu rûpela derbarê tune.',
    readMore:  'Bêtir bixwîne',
    about:     'Derbarê me',
    otherPages:'Rûpelên din:',
    pagesNav:  'Rûpelên derbarê',
    imageView: 'Nîşandana wêneyê',
    close:     'Bigire',
  }
}
const t = key => strings[lang.value]?.[key] ?? strings.ckb[key]

const dir      = computed(() => 'rtl')
const langAttr = computed(() => lang.value === 'ckb' ? 'ckb' : 'ku')

// ─── language helpers ─────────────────────────────────────────────────────────
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

const hasBothLangs = computed(() =>
  !!(page.value?.ckbContent?.title && page.value?.kmrContent?.title)
)

const activePage = computed(() => {
  if (!page.value) return {}
  const p = lang.value === 'ckb' ? page.value.ckbContent : page.value.kmrContent
  const f = lang.value === 'ckb' ? page.value.kmrContent : page.value.ckbContent
  return {
    title:           p?.title           || f?.title           || '',
    subtitle:        p?.subtitle        || f?.subtitle        || '',
    metaDescription: p?.metaDescription || f?.metaDescription || '',
  }
})
const pageTitle    = computed(() => activePage.value.title)
const pageSubtitle = computed(() => activePage.value.subtitle)
const pageMetaDesc = computed(() => activePage.value.metaDescription)

function getPageTitle(p) {
  const primary  = lang.value === 'ckb' ? p.ckbContent : p.kmrContent
  const fallback = lang.value === 'ckb' ? p.kmrContent : p.ckbContent
  return primary?.title || fallback?.title || p.slugCkb || p.slugKmr || ''
}

// ─── data fetching ────────────────────────────────────────────────────────────
async function fetchAbout() {
  loading.value = true; error.value = null
  try {
    const { data } = await api.get('/about')
    const list = Array.isArray(data) ? data : (data?.data || [])
    allPages.value = list.filter(p => p.active !== false)

    const slug = window.location.hash?.replace('#', '') || ''
    page.value =
      allPages.value.find(p => p.slugCkb === slug || p.slugKmr === slug) ||
      allPages.value[0] ||
      null
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

// ─── block layout ─────────────────────────────────────────────────────────────
const blocks = computed(() =>
  (page.value?.blocks || []).slice().sort((a, b) => (a.sequence ?? 0) - (b.sequence ?? 0))
)

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

/**
 * Hero image resolution — priority order:
 *   1. page.heroImageUrl — dedicated field set explicitly in the admin editor
 *   2. First IMAGE block with a mediaUrl — automatic content fallback
 *   3. Picsum placeholder — last resort when no image is available
 */
const heroImage = computed(() => {
  // 1. Dedicated hero image
  if (page.value?.heroImageUrl) return resolveUrl(page.value.heroImageUrl)
  // 2. First IMAGE block
  const img = blocks.value.find(b => b.contentType === 'IMAGE' && b.mediaUrl)
  if (img) return resolveUrl(img.mediaUrl)
  // 3. Placeholder
  return 'https://picsum.photos/seed/khi/1600/640'
})

// ─── utilities ────────────────────────────────────────────────────────────────
function resolveUrl(url) {
  if (!url) return ''
  if (url.startsWith('http')) return url
  return `${API_ROOT}${url.startsWith('/') ? '' : '/'}${url}`
}

function fmt(text) {
  if (!text) return ''
  return text
    .split('\n')
    .filter(l => l.trim())
    .map(l => `<p>${l}</p>`)
    .join('')
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
    if (m?.items && Array.isArray(m.items)) return m.items
    if (Array.isArray(m)) return m
    return []
  } catch { return [] }
}

function openLb(block) { lightbox.value = block }

onMounted(fetchAbout)
</script>

<style scoped>
/* ═══════════════════════════════════════════════════════════════════
   ABOUT — Stanford editorial design language
   ───────────────────────────────────────────────────────────────────
   ● Source Serif 4 (display) + Source Sans 3 (body) loaded via Google Fonts
   ● Cardinal #8C1515 as the single accent colour — used sparingly
   ● Full-bleed hero, white canvas, zero shadow cards, zero pill tags
   ● Alternating text/image duos mirroring stanford.edu/about/
   ● RTL-native for Kurdish (Sorani CKB + Kurmanji KMR)
   ● Scroll-reveal via CSS @keyframes with staggered animation-delay
═══════════════════════════════════════════════════════════════════ */
@import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;0,8..60,600;1,8..60,300;1,8..60,400&family=Source+Sans+3:wght@300;400;600;700&display=swap');

/* ─── tokens ──────────────────────────────────────────────── */
.about {
  --red:       #8C1515;
  --red-deep:  #6f1111;
  --gold:      #C9AA71;
  --text:      #2E2D29;
  --muted:     #767571;
  --line:      #D1CFC9;
  --pale:      #F4F4F2;
  --dark:      #1C1A18;
  --w:         1100px;
  --serif:     'Source Serif 4', Georgia, 'Times New Roman', serif;
  --sans:      'Source Sans 3', 'Helvetica Neue', Helvetica, Arial, sans-serif;

  font-family: var(--sans);
  font-size: clamp(16px, 1.1vw, 18px);
  line-height: 1.78;
  color: var(--text);
  background: #fff;
  min-height: 100vh;
  overflow-x: hidden;
}

/* ─── layout shell ────────────────────────────────────────── */
.wrap {
  max-width: var(--w);
  margin-inline: auto;
  padding-inline: clamp(20px, 4vw, 52px);
}

:global(html) { scroll-behavior: smooth; }

/* ═══════════════════════════════════════════════════════════
   STATES
═══════════════════════════════════════════════════════════ */
.state-screen {
  min-height: 60vh;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: 16px; text-align: center; padding: 48px;
  color: var(--muted);
}
.state-caption { font-size: 1.05rem; }
.state-err     { color: var(--red); font-weight: 600; font-size: 1.05rem; }
.state-icon    { width: 40px; height: 40px; color: var(--red); opacity: .65; }

.su-dots { display: flex; gap: 9px; align-items: center; }
.su-dots span {
  width: 11px; height: 11px; border-radius: 50%;
  background: var(--red);
  animation: dot-pulse 1.3s ease-in-out infinite;
}
.su-dots span:nth-child(2) { animation-delay: .18s; background: #b33; }
.su-dots span:nth-child(3) { animation-delay: .36s; background: #c55; }
@keyframes dot-pulse {
  0%,80%,100% { transform: scale(.55); opacity: .35; }
  40%          { transform: scale(1);   opacity: 1;   }
}

.su-text-btn {
  background: none; border: none; padding: 0;
  font: 700 1rem var(--sans);
  color: var(--red); text-decoration: underline; text-underline-offset: 3px;
  cursor: pointer; transition: color .15s;
}
.su-text-btn:hover { color: var(--red-deep); }

/* ═══════════════════════════════════════════════════════════
   LANGUAGE BAR
═══════════════════════════════════════════════════════════ */
.lang-bar {
  position: sticky; top: 0; z-index: 50;
  background: rgba(255,255,255,.96);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--line);
}
.lang-bar__inner {
  max-width: var(--w); margin-inline: auto;
  padding-inline: clamp(20px, 4vw, 52px);
  height: 46px; display: flex; align-items: center; gap: 0;
}
.lang-bar__sep { width: 1px; height: 16px; background: var(--line); flex-shrink: 0; }
.lang-bar__btn {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 0 18px; height: 46px;
  background: none; border: none;
  font: 600 .82rem var(--sans); letter-spacing: .04em;
  color: var(--muted); cursor: pointer; position: relative; transition: color .18s;
}
.lang-bar__btn::after {
  content: ''; position: absolute; bottom: 0; left: 0; right: 0;
  height: 2px; background: var(--red); transform: scaleX(0); transition: transform .2s ease;
}
.lang-bar__btn--active { color: var(--text); font-weight: 700; }
.lang-bar__btn--active::after { transform: scaleX(1); }
.lang-bar__btn:hover { color: var(--text); }
.lang-bar__dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
.lang-bar__dot--ckb { background: var(--red); }
.lang-bar__dot--kmr { background: #1d6bbf; }

/* ═══════════════════════════════════════════════════════════
   HERO — full-bleed photograph
═══════════════════════════════════════════════════════════ */
.hero {
  position: relative; overflow: hidden; background: var(--dark);
  animation: hero-reveal 1.2s cubic-bezier(.2,.8,.2,1) both;
}
@keyframes hero-reveal {
  from { opacity: 0; transform: scale(1.035); }
  to   { opacity: 1; transform: scale(1); }
}
.hero__photo {
  display: block; width: 100%;
  height: clamp(260px, 44vw, 600px);
  object-fit: cover; object-position: center 32%;
}
.hero__veil {
  position: absolute; inset: auto 0 0 0; height: 200px;
  background: linear-gradient(to top, #ffffff 0%, rgba(255,255,255,0) 100%);
  pointer-events: none;
}

/* ═══════════════════════════════════════════════════════════
   PAGE INTRO
═══════════════════════════════════════════════════════════ */
.intro { padding: 0 0 52px; animation: rise .7s .1s cubic-bezier(.2,.8,.2,1) both; }
.intro__shell { max-width: var(--w); margin-inline: auto; padding-inline: clamp(20px, 4vw, 52px); }
.eyebrow {
  display: flex; align-items: center; gap: 14px;
  font: 700 .72rem/.1 var(--sans); letter-spacing: .14em;
  text-transform: uppercase; color: var(--red); margin: 0 0 22px; padding-top: 48px;
}
.eyebrow__rule { display: block; width: 32px; height: 2px; background: var(--red); flex-shrink: 0; }
.intro__title { font: 300 clamp(32px, 5.2vw, 62px)/1.05 var(--serif); letter-spacing: -.01em; color: var(--text); margin: 0 0 20px; }
.intro__lead { font: 300 clamp(1.05rem, 1.5vw, 1.22rem)/1.72 var(--serif); color: #4a4845; max-width: 68ch; margin: 0; }

/* ═══════════════════════════════════════════════════════════
   SECTION HEADING
═══════════════════════════════════════════════════════════ */
.su-h {
  font: 300 clamp(19px, 2.4vw, 26px)/1.22 var(--serif);
  color: var(--text); margin: 0 0 18px; position: relative; padding-bottom: 17px;
}
.su-h::after { content: ''; position: absolute; bottom: 0; inset-inline-start: 0; width: 38px; height: 3px; background: var(--red); }
.su-h--sm   { font-size: clamp(17px, 2vw, 21px); }
.su-h--light { color: rgba(255,255,255,.95); }
.su-h--light::after { background: rgba(255,255,255,.3); }
.su-h--center { text-align: center; }
.su-h--center::after { inset-inline-start: 50%; transform: translateX(-50%); }

/* ═══════════════════════════════════════════════════════════
   HORIZONTAL RULE
═══════════════════════════════════════════════════════════ */
.su-rule { border: none; border-top: 1px solid var(--line); max-width: var(--w); margin: 0 auto; padding-inline: clamp(20px, 4vw, 52px); }
.content-stack .su-rule { max-width: 100%; }

/* ═══════════════════════════════════════════════════════════
   PROSE
═══════════════════════════════════════════════════════════ */
.su-prose { font-size: 1rem; line-height: 1.84; color: var(--text); }
.su-prose--wide { max-width: 74ch; }
.su-prose--center { text-align: center; }
.su-prose--light { color: rgba(255,255,255,.72); }
.su-prose :deep(p) { margin: 0 0 .95em; }
.su-prose :deep(p:last-child) { margin: 0; }

/* ═══════════════════════════════════════════════════════════
   CTA LINK
═══════════════════════════════════════════════════════════ */
.su-cta {
  display: inline-flex; align-items: center; gap: 7px; margin-top: 24px;
  font: 700 .8rem var(--sans); letter-spacing: .1em; text-transform: uppercase;
  color: var(--red); text-decoration: none; border-bottom: 1px solid transparent;
  transition: border-color .18s, gap .2s ease;
}
.su-cta svg { width: 15px; height: 15px; flex-shrink: 0; }
.su-cta:hover { border-bottom-color: var(--red); gap: 11px; }

/* ═══════════════════════════════════════════════════════════
   CONTENT STACK
═══════════════════════════════════════════════════════════ */
.content-stack { display: flex; flex-direction: column; gap: 0; padding-bottom: 80px; }

.su-text { padding: 60px clamp(20px, 4vw, 52px); animation: rise .7s cubic-bezier(.2,.8,.2,1) both; }

.su-duo {
  display: grid; grid-template-columns: 1fr 1fr;
  gap: clamp(40px, 6vw, 96px); align-items: start;
  padding: 64px clamp(20px, 4vw, 52px);
  animation: rise .7s cubic-bezier(.2,.8,.2,1) both;
}
.su-duo--mirror { direction: ltr; }
.su-duo--mirror > * { direction: rtl; }
@media (max-width: 840px) {
  .su-duo { grid-template-columns: 1fr; gap: 28px; }
  .su-duo--mirror { direction: rtl; }
  .su-duo--mirror > * { direction: rtl; }
}
.su-duo__body { padding-top: 6px; }

.su-fig { margin: 0; }
.su-fig, .su-img-full { cursor: zoom-in; }
.su-fig__crop, .su-img-full__crop { overflow: hidden; background: var(--pale); }
.su-fig__crop img, .su-img-full__crop img { display: block; width: 100%; transition: transform .55s cubic-bezier(.2,.8,.2,1), opacity .28s; }
.su-fig:hover .su-fig__crop img, .su-img-full:hover .su-img-full__crop img { transform: scale(1.04); opacity: .9; }
.su-img-full__crop { padding-inline: clamp(20px, 4vw, 52px); max-width: var(--w); margin-inline: auto; }
.su-img-full__crop img { max-height: 500px; object-fit: cover; }
.su-fig__cap { margin-top: 11px; font: 400 .85rem/1.55 var(--sans); color: var(--muted); }
.su-fig__cap strong { color: var(--text); }

.su-media { padding: 60px clamp(20px, 4vw, 52px); max-width: calc(var(--w) * .95); animation: rise .7s cubic-bezier(.2,.8,.2,1) both; }
.su-video { position: relative; aspect-ratio: 16/9; background: #111; overflow: hidden; margin-bottom: 12px; }
.su-video iframe, .su-video video { position: absolute; inset: 0; width: 100%; height: 100%; }
.su-caption { font: 400 .88rem/1.55 var(--sans); color: var(--muted); margin: 0; }

.su-audio-row {
  display: flex; align-items: center; gap: 52px; flex-wrap: wrap;
  padding: 36px clamp(20px, 4vw, 52px);
  border-top: 3px solid var(--red); background: var(--pale);
}
.su-audio-row__info { flex: 1; min-width: 200px; }
.su-audio-row__el   { flex: 0 0 260px; width: 260px; }
@media (max-width: 700px) { .su-audio-row__el { width: 100%; flex: none; } .su-audio-row { gap: 20px; } }

.su-pullquote { background: var(--pale); padding: 72px 0; }
.su-pullquote__inner { max-width: 840px; position: relative; padding-inline-start: 72px; }
.su-pullquote__deco { position: absolute; inset-inline-start: 0; top: -14px; font: 300 9.5rem/1 var(--serif); color: var(--red); opacity: .14; pointer-events: none; user-select: none; }
.su-pullquote__body { margin: 0; }
.su-pullquote__body p { font: 300 clamp(20px, 2.8vw, 28px)/1.58 var(--serif); font-style: italic; color: var(--text); margin: 0 0 20px; }
.su-pullquote__body cite { display: block; font: 700 .78rem var(--sans); font-style: normal; letter-spacing: .1em; text-transform: uppercase; color: var(--red); }
@media (max-width: 700px) { .su-pullquote__inner { padding-inline-start: 32px; } .su-pullquote__deco { font-size: 6rem; } }

.su-stats-band { background: var(--dark); padding: 72px 0; }
.su-stats-band .wrap { animation: rise .7s cubic-bezier(.2,.8,.2,1) both; }
.su-stats { display: flex; flex-wrap: wrap; border-top: 1px solid rgba(255,255,255,.12); margin-top: 48px; }
.su-stats__item { flex: 1; min-width: 140px; padding: 36px 28px; border-inline-end: 1px solid rgba(255,255,255,.1); text-align: center; }
.su-stats__item:last-child { border-inline-end: none; }
.su-stats__num { display: block; font: 300 clamp(2.5rem, 5vw, 3.8rem)/1 var(--serif); color: var(--gold); margin-bottom: 14px; }
.su-stats__bar { display: block; width: 28px; height: 2px; background: rgba(255,255,255,.18); margin: 0 auto 14px; }
.su-stats__lbl { display: block; font: 700 .72rem var(--sans); text-transform: uppercase; letter-spacing: .1em; color: rgba(255,255,255,.48); }
@media (max-width: 700px) {
  .su-stats { flex-direction: column; }
  .su-stats__item { border-inline-end: none; border-bottom: 1px solid rgba(255,255,255,.08); padding: 24px 20px; }
  .su-stats__item:last-child { border-bottom: none; }
}

.su-meta { padding: 28px 0 52px; border-top: 1px solid var(--line); color: var(--muted); font: 400 .93rem/1.72 var(--sans); }
.su-meta p { margin: 0; max-width: 74ch; }

.su-page-nav { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; padding: 26px 0 64px; border-top: 1px solid var(--line); }
.su-page-nav__label { font: 700 .73rem var(--sans); letter-spacing: .11em; text-transform: uppercase; color: var(--muted); flex-shrink: 0; }
.su-page-nav__list { display: flex; gap: 8px; flex-wrap: wrap; }
.su-page-nav__item { background: none; border: 1px solid var(--line); border-radius: 2px; padding: 8px 18px; font: 600 .88rem var(--sans); color: var(--text); cursor: pointer; transition: border-color .15s, color .15s, background .15s; }
.su-page-nav__item:hover { border-color: var(--red); color: var(--red); }
.su-page-nav__item--current { background: var(--red); border-color: var(--red); color: #fff; }

/* ═══════════════════════════════════════════════════════════
   LIGHTBOX
═══════════════════════════════════════════════════════════ */
.su-lb { position: fixed; inset: 0; z-index: 9999; background: rgba(10,8,6,.94); display: flex; align-items: center; justify-content: center; padding: 56px 24px 28px; }
.su-lb__close { position: absolute; top: 16px; inset-inline-end: 20px; width: 42px; height: 42px; border-radius: 50%; background: rgba(255,255,255,.07); border: 1px solid rgba(255,255,255,.2); color: rgba(255,255,255,.8); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: background .15s, border-color .15s, color .15s; }
.su-lb__close svg { width: 18px; height: 18px; }
.su-lb__close:hover { background: rgba(255,255,255,.15); border-color: rgba(255,255,255,.55); color: #fff; }
.su-lb__fig { margin: 0; text-align: center; }
.su-lb__fig img { max-width: 88vw; max-height: 76vh; display: block; margin: 0 auto; border-radius: 2px; box-shadow: 0 32px 80px rgba(0,0,0,.6); }
.su-lb__fig figcaption { margin-top: 14px; color: rgba(255,255,255,.55); font: 400 .85rem var(--sans); text-align: center; max-width: 60ch; margin-inline: auto; }
.su-lb__fig figcaption strong { color: rgba(255,255,255,.9); }

/* ═══════════════════════════════════════════════════════════
   TRANSITIONS + ANIMATIONS
═══════════════════════════════════════════════════════════ */
.lb-enter-active { transition: opacity .28s ease, transform .28s ease; }
.lb-leave-active { transition: opacity .2s ease; }
.lb-enter-from   { opacity: 0; transform: scale(.97); }
.lb-leave-to     { opacity: 0; }

@keyframes rise { from { opacity: 0; transform: translateY(32px); } to { opacity: 1; transform: translateY(0); } }
.content-stack > *:nth-child(1)  { animation: rise .7s .05s cubic-bezier(.2,.8,.2,1) both; }
.content-stack > *:nth-child(2)  { animation: rise .7s .13s cubic-bezier(.2,.8,.2,1) both; }
.content-stack > *:nth-child(3)  { animation: rise .7s .21s cubic-bezier(.2,.8,.2,1) both; }
.content-stack > *:nth-child(4)  { animation: rise .7s .29s cubic-bezier(.2,.8,.2,1) both; }
.content-stack > *:nth-child(5)  { animation: rise .7s .37s cubic-bezier(.2,.8,.2,1) both; }
.content-stack > *:nth-child(n+6){ animation: rise .7s .44s cubic-bezier(.2,.8,.2,1) both; }

/* ═══════════════════════════════════════════════════════════
   RESPONSIVE
═══════════════════════════════════════════════════════════ */
@media (max-width: 840px) {
  .hero__photo  { height: clamp(200px, 50vw, 380px); }
  .intro        { padding-bottom: 36px; }
  .eyebrow      { padding-top: 32px; }
  .su-text, .su-media, .su-duo { padding-block: 40px; }
}
@media (max-width: 600px) {
  .intro__title  { letter-spacing: 0; }
  .su-pullquote  { padding-block: 48px; }
  .su-stats-band { padding-block: 48px; }
  .lang-bar__btn { padding-inline: 12px; }
}
</style>