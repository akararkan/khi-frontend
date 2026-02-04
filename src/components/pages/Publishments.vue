<template>
  <main id="main-content" class="pubs">
    <!-- HERO -->
    <header class="hero">
      <div class="hero__bg" :style="{ backgroundImage: `url(${heroImage})` }"></div>
      <div class="hero__overlay"></div>

      <div class="container hero__content">
        <p class="hero__kicker">بڵاوکراوەکان</p>
        <h1 class="hero__title">هەموو بڵاوکراوەکان</h1>
        <p class="hero__sub">
          ئەمە demo ـە. داتاکان fake ـن، بەڵام لۆجیک و media types وەک schema ـەکەتە.
        </p>

        <div class="hero__stats">
          <div class="stat">
            <span class="stat__label">کۆی بڵاوکراوە</span>
            <span class="stat__value">{{ publications.length }}</span>
          </div>
          <div class="stat">
            <span class="stat__label">نووسین</span>
            <span class="stat__value">{{ publications.filter(p => p.pub_type === 'writing').length }}</span>
          </div>
          <div class="stat">
            <span class="stat__label">دەنگ</span>
            <span class="stat__value">{{ publications.filter(p => p.pub_type === 'music').length }}</span>
          </div>
          <div class="stat">
            <span class="stat__label">ڤیدیۆ/وێنە</span>
            <span class="stat__value">{{ publications.filter(p => ['video','image','film'].includes(p.pub_type)).length }}</span>
          </div>
        </div>
      </div>
    </header>

    <!-- CONTROLS -->
    <section class="controls">
      <div class="container">
        <div class="controls__row">
          <div class="search">
            <span class="search__icon">⌕</span>
            <input
              v-model.trim="q"
              class="search__input"
              type="text"
              placeholder="گەڕان بۆ ناونیشان، پوختە، تاگ..."
            />
          </div>

          <div class="chips">
            <button class="chip" :class="{active: type==='all'}" @click="type='all'">هەموو</button>
            <button class="chip" :class="{active: type==='writing'}" @click="type='writing'">نووسین</button>
            <button class="chip" :class="{active: type==='music'}" @click="type='music'">دەنگ</button>
            <button class="chip" :class="{active: type==='video'}" @click="type='video'">ڤیدیۆ</button>
            <button class="chip" :class="{active: type==='image'}" @click="type='image'">وێنە</button>
            <button class="chip" :class="{active: type==='film'}" @click="type='film'">فیلم</button>
            <button class="chip" :class="{active: type==='other'}" @click="type='other'">تر</button>
          </div>

          <div class="select">
            <label class="select__label">ڕیزکردن:</label>
            <select v-model="sortBy" class="select__box">
              <option value="newest">نوێترین</option>
              <option value="oldest">کۆنترین</option>
              <option value="title_az">ناونیشان A→Z</option>
              <option value="media_desc">زۆرترین میدیا</option>
            </select>
          </div>
        </div>

        <div class="controls__row controls__row--2">
          <div class="filters">
            <div class="filter">
              <span class="filter__label">هاوپۆل:</span>
              <div class="pills">
                <button class="pill" :class="{active: category==='all'}" @click="category='all'">هەموو</button>
                <button v-for="c in categories" :key="c" class="pill" :class="{active: category===c}" @click="category=c">
                  {{ c }}
                </button>
              </div>
            </div>

            <div class="filter">
              <span class="filter__label">تاگ:</span>
              <div class="pills pills--tags">
                <button class="pill pill--muted" :class="{active: tag==='all'}" @click="tag='all'">هەموو</button>
                <button v-for="t in allTags" :key="t" class="pill pill--muted" :class="{active: tag===t}" @click="tag=t">
                  #{{ t }}
                </button>
              </div>
            </div>
          </div>

          <button class="reset" @click="resetFilters">Reset</button>
        </div>
      </div>
    </section>

    <!-- FEATURED STRIP (Stanford-like highlight) -->
    <section class="featured">
      <div class="container">
        <div class="featured__bar">
          <div class="featured__left">
            <span class="featured__label">Featured</span>
            <b class="featured__title">{{ featured.title }}</b>
            <span class="featured__meta">{{ typeLabel(featured.pub_type) }} • {{ featured.published_at }}</span>
            <p class="featured__text">{{ featured.summary }}</p>
            <button class="btnX btnX--primary" @click="openPublication(featured)">Open →</button>
          </div>

          <div class="featured__right">
            <img class="featured__img" :src="featured.cover.url" :alt="featured.title" />
          </div>
        </div>
      </div>
    </section>

    <!-- LIST (Rows like Stanford news list) -->
    <section class="section">
      <div class="container">
        <div class="head">
          <h2 class="head__title">لیستی بڵاوکراوەکان</h2>
          <p class="head__sub">نیشاندانی: <b>{{ filtered.length }}</b> بڵاوکراوە</p>
        </div>

        <div class="list">
          <article
            v-for="p in filtered"
            :key="p.slug"
            class="row"
            tabindex="0"
            @click="openPublication(p)"
            @keyup.enter="openPublication(p)"
          >
            <div class="row__thumb">
              <img :src="p.cover.url" :alt="p.title" />
              <span class="pillType">{{ typeLabel(p.pub_type) }}</span>
            </div>

            <div class="row__body">
              <div class="row__top">
                <span class="row__date">{{ p.published_at }}</span>
                <span class="dot">•</span>
                <span class="row__meta">{{ p.media.length }} میدیا</span>
                <span class="dot">•</span>
                <span class="row__cat">{{ p.category }}</span>
              </div>

              <h3 class="row__title">{{ p.title }}</h3>
              <p class="row__text">{{ p.summary }}</p>

              <div class="row__tags">
                <button
                  v-for="t in p.tags"
                  :key="t"
                  class="tag"
                  type="button"
                  @click.stop="tag = t"
                >
                  #{{ t }}
                </button>
              </div>

              <div class="row__cta">
                <span class="link">بینینی زیاتر</span>
                <span class="arrow">→</span>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- MODAL (media preview) -->
    <div v-if="active" class="modal" @click.self="closePublication" role="dialog" aria-modal="true">
      <div class="modal__panel">
        <button class="modal__close" @click="closePublication" aria-label="Close">✕</button>

        <div class="modal__top">
          <div class="topline">
            <span class="pillX">{{ typeLabel(active.pub_type) }}</span>
            <span class="pillX pillX--muted">{{ active.published_at }}</span>
            <span class="pillX pillX--muted">{{ active.category }}</span>
            <span class="pillX pillX--muted">{{ active.media.length }} میدیا</span>
          </div>

          <h2 class="modal__title">{{ active.title }}</h2>
          <p class="modal__summary">{{ active.summary }}</p>

          <div class="modal__tags">
            <span v-for="t in active.tags" :key="t" class="tagX">#{{ t }}</span>
          </div>
        </div>

        <div class="body">
          <div class="body__left">
            <div class="preview">
              <template v-if="selected?.media_type === 'image'">
                <img class="preview__img" :src="selected.url" :alt="selected.caption || active.title" />
              </template>

              <template v-else-if="selected?.media_type === 'video'">
                <video class="preview__video" controls :poster="selected.poster || active.cover.url">
                  <source :src="selected.url" type="video/mp4" />
                </video>
              </template>

              <template v-else-if="selected?.media_type === 'audio'">
                <div class="preview__audioWrap">
                  <img class="preview__audioCover" :src="active.cover.url" :alt="active.title" />
                  <div class="preview__audioMeta">
                    <b>{{ selected.caption || 'دەنگ (demo)' }}</b>
                    <span>{{ selected.note || 'نمونە بۆ audio player' }}</span>
                    <audio class="preview__audio" controls>
                      <source :src="selected.url" type="audio/mpeg" />
                    </audio>
                  </div>
                </div>
              </template>

              <template v-else>
                <div class="preview__doc">
                  <div class="docIcon">📄</div>
                  <div class="docText">
                    <b>{{ selected?.caption || 'Document (demo)' }}</b>
                    <span>{{ selected?.url }}</span>
                  </div>
                  <button class="btnX" type="button" @click="fakeOpenDoc">Open</button>
                </div>
              </template>
            </div>

            <div class="caption">
              <b>{{ selected?.caption || active.title }}</b>
              <p>{{ selected?.note || active.body }}</p>
            </div>
          </div>

          <div class="body__right">
            <div class="thumbHead">
              <h3 class="thumbHead__title">میدیا</h3>
              <span class="thumbHead__sub">کلیک بکە بۆ گۆڕینی پیشاندان</span>
            </div>

            <div class="thumbs">
              <button
                v-for="m in active.media"
                :key="m.id"
                class="thumb"
                :class="{ 'is-active': selected?.id === m.id }"
                @click="selected = m"
                type="button"
              >
                <div class="thumb__icon">{{ iconFor(m.media_type) }}</div>
                <div class="thumb__info">
                  <b class="thumb__title">{{ m.caption || labelFor(m.media_type) }}</b>
                  <span class="thumb__sub">{{ m.role }} • {{ m.media_type }}</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        <div class="modal__foot">
          <button class="btnX btnX--primary" type="button" @click="fakeNavigate(active.slug)">
            View full page →
          </button>
          <button class="btnX" type="button" @click="closePublication">Close</button>
        </div>
      </div>
    </div>

    <button class="toTop" @click="scrollTop" aria-label="Back to top">↑</button>
  </main>
</template>

<script setup>
import { ref, computed } from 'vue'

/* best smooth scroll */
function scrollTop() {
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
  window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })
}

function iconFor(type) {
  return type === 'image' ? '🖼️' : type === 'video' ? '🎬' : type === 'audio' ? '🎧' : '📄'
}
function labelFor(type) {
  return type === 'image' ? 'وێنە' : type === 'video' ? 'ڤیدیۆ' : type === 'audio' ? 'دەنگ' : 'دۆکیومێنت'
}
function typeLabel(t) {
  return ({
    writing: 'نووسین',
    music: 'دەنگ',
    video: 'ڤیدیۆ',
    image: 'وێنە',
    film: 'فیلم',
    other: 'تر'
  }[t] || 'تر')
}

/* fake data like publications + publication_media */
const heroImage = 'https://picsum.photos/seed/pubshero/2200/1100'

const publications = ref([
  {
    id: 1,
    slug: 'book-language-history',
    title: 'کتێب: زمان و مێژوو (demo)',
    summary: 'کتێبی نموونە بۆ نمایشکردنی نووسین و سەرچاوە…',
    body: 'دەقی درێژ بۆ demo. دواتر دەکەیت بە DB body.',
    pub_type: 'writing',
    is_published: 1,
    published_at: '2026-01-10',
    category: 'کتێب',
    tags: ['writing', 'research', 'history'],
    cover: { url: 'https://picsum.photos/seed/pubcover1/1400/900', role: 'cover' },
    media: [
      { id: 'pm1', media_type: 'image', role: 'cover', url: 'https://picsum.photos/seed/pbimg1/1600/1000', caption: 'وێنەی سەرەکی' },
      { id: 'pm2', media_type: 'document', role: 'attachment', url: 'https://example.com/book.pdf', caption: 'PDF (demo)', note: 'تەنها بۆ نمایش' },
      { id: 'pm3', media_type: 'image', role: 'gallery', url: 'https://picsum.photos/seed/pbimg2/1600/1000', caption: 'گالەری 1' },
    ],
  },
  {
    id: 2,
    slug: 'album-folklore-audio',
    title: 'ئالبووم: دەنگی کەلەپوور (demo)',
    summary: 'چند تراکی دەنگی نموونە بۆ نمایش…',
    body: 'دەقی درێژ بۆ demo.',
    pub_type: 'music',
    is_published: 1,
    published_at: '2025-12-02',
    category: 'ئالبووم',
    tags: ['music', 'archive', 'culture'],
    cover: { url: 'https://picsum.photos/seed/pubcover2/1400/900', role: 'cover' },
    media: [
      { id: 'pm4', media_type: 'audio', role: 'player', url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3', caption: 'Track 01 (demo)', note: 'نمونە بۆ audio' },
      { id: 'pm5', media_type: 'image', role: 'gallery', url: 'https://picsum.photos/seed/abimg1/1600/1000', caption: 'Artwork (demo)' },
    ],
  },
  {
    id: 3,
    slug: 'video-intro-center',
    title: 'ڤیدیۆ: ناساندنی ناوەند (demo)',
    summary: 'ڤیدیۆی ناساندن بۆ نمایشکردنی player و media…',
    body: 'دەقی درێژ بۆ demo.',
    pub_type: 'video',
    is_published: 1,
    published_at: '2025-11-18',
    category: 'ڕاپۆرت/ڤیدیۆ',
    tags: ['video', 'announcement'],
    cover: { url: 'https://picsum.photos/seed/pubcover3/1400/900', role: 'cover' },
    media: [
      { id: 'pm6', media_type: 'video', role: 'player', url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', caption: 'Intro (demo)', poster: 'https://picsum.photos/seed/vposter/1600/1000' },
      { id: 'pm7', media_type: 'image', role: 'gallery', url: 'https://picsum.photos/seed/vimg1/1600/1000', caption: 'Still 1' },
    ],
  },
  {
    id: 4,
    slug: 'photo-archive-collection',
    title: 'کۆمەڵەوێنە: ئارشیڤ (demo)',
    summary: 'کۆمەڵەوێنەی نموونە بۆ نمایشکردنی گالەری…',
    body: 'دەقی درێژ بۆ demo.',
    pub_type: 'image',
    is_published: 1,
    published_at: '2025-10-05',
    category: 'وێنە',
    tags: ['image', 'archive', 'heritage'],
    cover: { url: 'https://picsum.photos/seed/pubcover4/1400/900', role: 'cover' },
    media: [
      { id: 'pm8', media_type: 'image', role: 'cover', url: 'https://picsum.photos/seed/phimg1/1600/1000', caption: 'وێنەی سەرەکی' },
      { id: 'pm9', media_type: 'image', role: 'gallery', url: 'https://picsum.photos/seed/phimg2/1600/1000', caption: 'گالەری 1' },
      { id: 'pm10', media_type: 'image', role: 'gallery', url: 'https://picsum.photos/seed/phimg3/1600/1000', caption: 'گالەری 2' },
    ],
  },
  {
    id: 5,
    slug: 'film-documentary-demo',
    title: 'فیلم: دۆکیومێنتەری (demo)',
    summary: 'فیلمی نموونە بۆ نمایشکردنی pub_type film…',
    body: 'دەقی درێژ بۆ demo.',
    pub_type: 'film',
    is_published: 1,
    published_at: '2025-09-14',
    category: 'فیلم',
    tags: ['film', 'culture'],
    cover: { url: 'https://picsum.photos/seed/pubcover5/1400/900', role: 'cover' },
    media: [
      { id: 'pm11', media_type: 'video', role: 'player', url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', caption: 'Trailer (demo)' },
      { id: 'pm12', media_type: 'document', role: 'attachment', url: 'https://example.com/press-kit.pdf', caption: 'Press kit (demo)' },
    ],
  },
])

/* featured pick */
const featured = computed(() => publications.value[0])

/* filters */
const q = ref('')
const type = ref('all')
const category = ref('all')
const tag = ref('all')
const sortBy = ref('newest')

const categories = computed(() => {
  const s = new Set(publications.value.map(p => p.category))
  return Array.from(s)
})
const allTags = computed(() => {
  const s = new Set()
  publications.value.forEach(p => p.tags.forEach(t => s.add(t)))
  return Array.from(s)
})

const filtered = computed(() => {
  const text = q.value.toLowerCase()

  let list = publications.value.filter(p => {
    const matchesText =
      !text ||
      p.title.toLowerCase().includes(text) ||
      p.summary.toLowerCase().includes(text) ||
      p.tags.some(t => t.toLowerCase().includes(text))

    const matchesType = type.value === 'all' || p.pub_type === type.value
    const matchesCategory = category.value === 'all' || p.category === category.value
    const matchesTag = tag.value === 'all' || p.tags.includes(tag.value)

    return matchesText && matchesType && matchesCategory && matchesTag
  })

  list = [...list]
  if (sortBy.value === 'newest') {
    list.sort((a, b) => (b.published_at || '').localeCompare(a.published_at || ''))
  } else if (sortBy.value === 'oldest') {
    list.sort((a, b) => (a.published_at || '').localeCompare(b.published_at || ''))
  } else if (sortBy.value === 'title_az') {
    list.sort((a, b) => a.title.localeCompare(b.title))
  } else if (sortBy.value === 'media_desc') {
    list.sort((a, b) => (b.media?.length || 0) - (a.media?.length || 0))
  }

  return list
})

function resetFilters() {
  q.value = ''
  type.value = 'all'
  category.value = 'all'
  tag.value = 'all'
  sortBy.value = 'newest'
}

/* modal */
const active = ref(null)
const selected = ref(null)

function openPublication(p) {
  active.value = p
  selected.value = p.media.find(m => m.role === 'cover') || p.media[0]
  document.body.style.overflow = 'hidden'
}
function closePublication() {
  active.value = null
  selected.value = null
  document.body.style.overflow = ''
}

function fakeNavigate(slug) {
  alert(`Demo: go to /publishments/${slug}`)
}
function fakeOpenDoc() {
  alert('Demo: open document')
}
</script>

<style scoped>
/* =========================================================
   Stanford-like clean design (NO responsive / NO media queries)
   ========================================================= */
.pubs{
  --brand: #8C1515;
  --bg: #ffffff;
  --alt: #f6f7f8;
  --text: #2E2D29;
  --muted: #5f6368;
  --line: rgba(0,0,0,.10);
  --shadow: 0 18px 54px rgba(0,0,0,.18);
  --shadow2: 0 10px 26px rgba(0,0,0,.10);
  --radius: 18px;
  --radius2: 14px;
  --container: 1200px;

  background: var(--bg);
  color: var(--text);
  min-height: 100vh;
}

/* Smooth scroll (best) */
:global(html){ scroll-behavior: smooth; }
@media (prefers-reduced-motion: reduce){
  :global(html){ scroll-behavior: auto; }
}

.container{
  max-width: var(--container);
  margin: 0 auto;
  padding: 0 22px;
}

/* hero */
.hero{
  position: relative;
  min-height: 54vh;
  overflow: hidden;
  display: grid;
  place-items: center;
}
.hero__bg{
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  transform: scale(1.02);
}
.hero__overlay{
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0,0,0,.60) 0%, rgba(0,0,0,.22) 55%, rgba(0,0,0,.55) 100%);
}
.hero__content{
  position: relative;
  z-index: 2;
  padding-top: 140px;
  padding-bottom: 44px;
  color: #fff;
}
.hero__kicker{
  margin: 0 0 10px;
  letter-spacing: .16em;
  text-transform: uppercase;
  font-weight: 800;
  opacity: .92;
  font-size: 12px;
}
.hero__title{
  font-family: Georgia, "Times New Roman", serif;
  font-weight: 900;
  font-size: 62px;
  line-height: 1.02;
  margin: 0 0 12px;
}
.hero__sub{
  margin: 0 0 18px;
  max-width: 70ch;
  opacity: .92;
  color: rgba(255,255,255,.92);
}
.hero__stats{
  display: flex;
  gap: 14px;
}
.stat{
  background: rgba(255,255,255,.12);
  border: 1px solid rgba(255,255,255,.22);
  border-radius: 14px;
  padding: 10px 12px;
  backdrop-filter: blur(10px);
}
.stat__label{ display:block; font-size: 12px; opacity: .9; }
.stat__value{ display:block; font-weight: 900; font-size: 18px; }

/* controls */
.controls{
  background: var(--alt);
  border-bottom: 1px solid rgba(0,0,0,.06);
  padding: 18px 0 16px;
}
.controls__row{
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
}
.controls__row--2{
  margin-top: 12px;
  align-items: flex-start;
}
.search{
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 999px;
  padding: 10px 14px;
  transition: box-shadow .16s ease, transform .16s ease;
}
.search:hover{ box-shadow: var(--shadow2); transform: translateY(-1px); }
.search__icon{ opacity: .75; font-weight: 900; }
.search__input{
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  font-size: 15px;
}

.chips{
  display: flex;
  gap: 8px;
}
.chip{
  border: 1px solid rgba(0,0,0,.12);
  background: #fff;
  border-radius: 999px;
  padding: 10px 12px;
  font-weight: 900;
  cursor: pointer;
  transition: transform .16s ease, background .16s ease, border-color .16s ease;
}
.chip:hover{ transform: translateY(-1px); }
.chip.active{
  background: rgba(140,21,21,.10);
  border-color: rgba(140,21,21,.25);
  color: #6b0f0f;
}

.select{
  display: flex;
  align-items: center;
  gap: 10px;
}
.select__label{ color: var(--muted); font-weight: 800; }
.select__box{
  border: 1px solid rgba(0,0,0,.12);
  background: #fff;
  border-radius: 999px;
  padding: 10px 12px;
  font-weight: 900;
  outline: none;
  cursor: pointer;
}

.filters{
  flex: 1;
  display: grid;
  gap: 10px;
}
.filter{
  display: grid;
  gap: 8px;
}
.filter__label{
  font-weight: 900;
  color: var(--muted);
}
.pills{
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.pills--tags{
  max-height: 72px;
  overflow: auto;
  padding-right: 6px;
}
.pill{
  border: 1px solid rgba(0,0,0,.10);
  background: #fff;
  border-radius: 999px;
  padding: 9px 12px;
  cursor: pointer;
  font-weight: 900;
  transition: transform .16s ease, background .16s ease;
}
.pill:hover{ transform: translateY(-1px); }
.pill.active{
  background: rgba(140,21,21,.10);
  border-color: rgba(140,21,21,.25);
  color: #6b0f0f;
}
.pill--muted{
  background: rgba(0,0,0,.03);
}

.reset{
  border: 1px solid rgba(0,0,0,.12);
  background: #fff;
  border-radius: 12px;
  padding: 12px 14px;
  font-weight: 900;
  cursor: pointer;
  transition: transform .16s ease;
}
.reset:hover{ transform: translateY(-1px); }

/* featured strip */
.featured{
  padding: 18px 0 6px;
  background: #fff;
}
.featured__bar{
  border: 1px solid var(--line);
  border-radius: 22px;
  overflow: hidden;
  box-shadow: var(--shadow2);
  display: grid;
  grid-template-columns: 1.3fr 1fr;
  background: #fff;
}
.featured__left{
  padding: 18px 18px 20px;
}
.featured__label{
  display:inline-flex;
  border-radius: 999px;
  padding: 7px 10px;
  font-weight: 900;
  font-size: 12px;
  background: rgba(140,21,21,.10);
  border: 1px solid rgba(140,21,21,.20);
  color: #6b0f0f;
  margin-bottom: 10px;
}
.featured__title{
  display:block;
  font-family: Georgia, "Times New Roman", serif;
  font-weight: 900;
  font-size: 24px;
  margin-bottom: 6px;
}
.featured__meta{
  display:block;
  color: var(--muted);
  font-weight: 900;
  font-size: 12px;
  margin-bottom: 10px;
}
.featured__text{
  margin: 0 0 12px;
  color: var(--muted);
  line-height: 1.6;
}
.featured__right{
  background: #000;
}
.featured__img{
  width: 100%;
  height: 100%;
  object-fit: cover;
  display:block;
  transform: scale(1.02);
  transition: transform .35s ease;
}
.featured__bar:hover .featured__img{ transform: scale(1.06); }

/* section list */
.section{
  padding: 18px 0 60px;
}
.head{
  display:flex;
  align-items: baseline;
  justify-content: space-between;
  margin: 18px 0 16px;
}
.head__title{
  font-family: Georgia, "Times New Roman", serif;
  font-weight: 900;
  margin: 0;
  font-size: 26px;
}
.head__sub{ margin: 0; color: var(--muted); }

/* rows */
.list{
  display: grid;
  gap: 12px;
}
.row{
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 14px;
  background: #fff;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  padding: 12px;
  cursor: pointer;
  transition: transform .18s ease, box-shadow .18s ease;
}
.row:hover{
  transform: translateY(-2px);
  box-shadow: var(--shadow2);
}
.row:focus-visible{
  outline: 3px solid rgba(140,21,21,.25);
  outline-offset: 3px;
}

.row__thumb{
  position: relative;
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid rgba(0,0,0,.10);
}
.row__thumb img{
  width: 100%;
  height: 150px;
  object-fit: cover;
  display:block;
  transform: scale(1.02);
  transition: transform .35s ease;
}
.row:hover .row__thumb img{ transform: scale(1.06); }

.pillType{
  position: absolute;
  top: 10px;
  left: 10px;
  border-radius: 999px;
  padding: 6px 10px;
  font-weight: 900;
  font-size: 12px;
  background: rgba(0,0,0,.60);
  color: #fff;
  border: 1px solid rgba(255,255,255,.14);
}

.row__body{
  padding: 4px 4px 2px;
}
.row__top{
  display:flex;
  gap: 8px;
  align-items:center;
  color: var(--muted);
  font-size: 12px;
  margin-bottom: 8px;
  font-weight: 800;
}
.dot{ opacity:.6; }
.row__title{
  margin: 0 0 8px;
  font-weight: 900;
  font-size: 20px;
  line-height: 1.15;
}
.row__text{
  margin: 0 0 10px;
  color: var(--muted);
  line-height: 1.6;
}

.row__tags{
  display:flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 8px 0 12px;
}
.tag{
  border: 1px solid rgba(0,0,0,.10);
  background: rgba(0,0,0,.03);
  border-radius: 999px;
  padding: 6px 10px;
  font-weight: 900;
  font-size: 12px;
  cursor: pointer;
  transition: background .16s ease, border-color .16s ease;
}
.tag:hover{
  background: rgba(140,21,21,.08);
  border-color: rgba(140,21,21,.18);
}

/* row CTA underline animation */
.row__cta{
  display:inline-flex;
  align-items:center;
  gap: 10px;
  font-weight: 900;
  color: #111;
}
.link{
  position: relative;
}
.link::after{
  content:"";
  position:absolute;
  left:0;
  bottom:-4px;
  height:2px;
  width:0%;
  background: currentColor;
  transition: width .18s ease;
}
.row:hover .link::after{ width:100%; }
.arrow{ transition: transform .18s ease; }
.row:hover .arrow{ transform: translateX(4px); }

/* modal */
.modal{
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.62);
  z-index: 9999;
  display: grid;
  place-items: center;
  padding: 26px;
}
.modal__panel{
  width: 1100px;
  max-width: 1100px;
  background: #fff;
  border-radius: 22px;
  border: 1px solid rgba(0,0,0,.10);
  box-shadow: var(--shadow);
  overflow: hidden;
  position: relative;
}
.modal__close{
  position: absolute;
  top: 12px;
  right: 12px;
  width: 44px;
  height: 44px;
  border-radius: 999px;
  border: 1px solid rgba(0,0,0,.12);
  background: #fff;
  font-weight: 900;
  cursor: pointer;
}
.modal__top{
  padding: 18px 18px 14px;
  border-bottom: 1px solid rgba(0,0,0,.08);
}
.topline{
  display:flex;
  gap: 8px;
  align-items:center;
  margin-bottom: 10px;
  flex-wrap: wrap;
}
.pillX{
  border-radius: 999px;
  padding: 7px 10px;
  font-weight: 900;
  background: rgba(0,0,0,.04);
  border: 1px solid rgba(0,0,0,.08);
}
.pillX--muted{ opacity: .85; }
.modal__title{
  margin: 0 0 8px;
  font-family: Georgia, "Times New Roman", serif;
  font-weight: 900;
  font-size: 30px;
}
.modal__summary{
  margin: 0 0 10px;
  color: var(--muted);
}
.modal__tags{
  display:flex;
  flex-wrap: wrap;
  gap: 8px;
}
.tagX{
  border-radius: 999px;
  padding: 6px 10px;
  font-weight: 900;
  font-size: 12px;
  background: rgba(140,21,21,.08);
  border: 1px solid rgba(140,21,21,.18);
  color: #6b0f0f;
}

/* body layout */
.body{
  display:grid;
  grid-template-columns: 1.6fr 1fr;
}
.body__left{
  padding: 16px 16px 18px;
  border-right: 1px solid rgba(0,0,0,.08);
}
.body__right{
  padding: 16px 16px 18px;
}

/* preview */
.preview{
  border-radius: 16px;
  border: 1px solid rgba(0,0,0,.10);
  overflow: hidden;
  background: #0b0b0b;
}
.preview__img{
  width: 100%;
  height: 520px;
  object-fit: cover;
  display:block;
}
.preview__video{
  width: 100%;
  height: 520px;
  display:block;
  background: #000;
}
.preview__audioWrap{
  height: 520px;
  background: #fff;
  display:grid;
  grid-template-columns: 260px 1fr;
  gap: 14px;
  padding: 16px;
}
.preview__audioCover{
  width: 100%;
  height: 100%;
  border-radius: 14px;
  object-fit: cover;
  border: 1px solid rgba(0,0,0,.10);
}
.preview__audioMeta{
  display:grid;
  gap: 10px;
  color: var(--muted);
}
.preview__audioMeta b{ color: #111; }
.preview__audio{ width: 100%; }

.preview__doc{
  height: 520px;
  background: #fff;
  display:grid;
  grid-template-columns: 72px 1fr auto;
  align-items:center;
  gap: 12px;
  padding: 18px;
}
.docIcon{
  width: 60px;
  height: 60px;
  border-radius: 16px;
  background: rgba(0,0,0,.04);
  border: 1px solid rgba(0,0,0,.10);
  display:grid;
  place-items:center;
  font-size: 26px;
}
.docText{
  display:grid;
  gap: 6px;
  color: var(--muted);
}
.docText b{ color: #111; }

.caption{
  margin-top: 12px;
  color: var(--muted);
}
.caption b{ color:#111; }

/* thumbs */
.thumbHead{
  display:flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 10px;
}
.thumbHead__title{
  margin: 0;
  font-weight: 900;
  font-size: 16px;
}
.thumbHead__sub{
  color: var(--muted);
  font-size: 12px;
}
.thumbs{
  display:grid;
  gap: 10px;
  max-height: 610px;
  overflow: auto;
  padding-right: 6px;
}
.thumb{
  width: 100%;
  text-align:left;
  border: 1px solid rgba(0,0,0,.10);
  background: #fff;
  border-radius: 14px;
  padding: 12px;
  cursor: pointer;
  display:grid;
  grid-template-columns: 46px 1fr;
  gap: 10px;
  transition: transform .16s ease, box-shadow .16s ease, border-color .16s ease;
}
.thumb:hover{
  transform: translateY(-1px);
  box-shadow: var(--shadow2);
}
.thumb.is-active{
  border-color: rgba(140,21,21,.32);
  box-shadow: 0 0 0 4px rgba(140,21,21,.10);
}
.thumb__icon{
  width: 46px;
  height: 46px;
  border-radius: 14px;
  background: rgba(0,0,0,.04);
  border: 1px solid rgba(0,0,0,.10);
  display:grid;
  place-items:center;
  font-size: 18px;
}
.thumb__info{
  display:grid;
  gap: 5px;
}
.thumb__title{
  font-size: 13px;
  font-weight: 900;
  color: #111;
}
.thumb__sub{
  font-size: 12px;
  color: var(--muted);
}

/* buttons */
.btnX{
  border: 1px solid rgba(0,0,0,.12);
  background: #fff;
  border-radius: 12px;
  padding: 12px 14px;
  font-weight: 900;
  cursor: pointer;
  transition: transform .16s ease, box-shadow .16s ease;
}
.btnX:hover{ transform: translateY(-1px); box-shadow: var(--shadow2); }
.btnX--primary{
  background: var(--brand);
  border-color: rgba(140,21,21,.25);
  color: #fff;
  box-shadow: 0 16px 42px rgba(140,21,21,.22);
}

/* modal footer */
.modal__foot{
  padding: 14px 16px;
  border-top: 1px solid rgba(0,0,0,.08);
  display:flex;
  justify-content:flex-end;
  gap: 10px;
}

/* to top */
.toTop{
  position: fixed;
  bottom: 18px;
  left: 18px;
  width: 46px;
  height: 46px;
  border-radius: 999px;
  border: 1px solid rgba(0,0,0,.12);
  background: #fff;
  font-weight: 900;
  cursor: pointer;
  box-shadow: var(--shadow2);
  transition: transform .16s ease;
  z-index: 2000;
}
.toTop:hover{ transform: translateY(-2px); }
</style>
