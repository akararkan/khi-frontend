<template>
  <main id="main-content" class="services">
    <!-- HERO -->
    <header class="hero">
      <div class="hero__bg" :style="{ backgroundImage: `url(${heroImage})` }"></div>
      <div class="hero__overlay"></div>

      <div class="container hero__content">
        <p class="hero__kicker">خزمەتگوزارییەکان</p>
        <h1 class="hero__title">خزمەتگوزارییەکان و بەکارهێنان</h1>
        <p class="hero__sub">
          ئەم پەڕەیە demo ـە. داتاکان fake ـن، بەڵام service_type و media وەک schema ـەکەتە.
        </p>

        <div class="hero__stats">
          <div class="stat">
            <span class="stat__label">کۆی خزمەتگوزاری</span>
            <span class="stat__value">{{ services.length }}</span>
          </div>
          <div class="stat">
            <span class="stat__label">چالاک</span>
            <span class="stat__value">{{ services.filter(s => s.is_active).length }}</span>
          </div>
          <div class="stat">
            <span class="stat__label">ناچالاک</span>
            <span class="stat__value">{{ services.filter(s => !s.is_active).length }}</span>
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
              placeholder="گەڕان بۆ ناو/دەربارە/جۆر..."
            />
          </div>

          <div class="chips">
            <button class="chip" :class="{active: activeFilter==='all'}" @click="activeFilter='all'">هەموو</button>
            <button class="chip" :class="{active: activeFilter==='active'}" @click="activeFilter='active'">چالاک</button>
            <button class="chip" :class="{active: activeFilter==='inactive'}" @click="activeFilter='inactive'">ناچالاک</button>
          </div>

          <div class="select">
            <label class="select__label">ڕیزکردن:</label>
            <select v-model="sortBy" class="select__box">
              <option value="sort_order">Sort order</option>
              <option value="name_az">ناو A→Z</option>
              <option value="type_az">جۆر A→Z</option>
              <option value="newest">نوێترین</option>
            </select>
          </div>
        </div>

        <div class="controls__row controls__row--2">
          <div class="filters">
            <div class="filter">
              <span class="filter__label">جۆری خزمەتگوزاری:</span>
              <div class="pills">
                <button class="pill" :class="{active: typeFilter==='all'}" @click="typeFilter='all'">هەموو</button>
                <button
                  v-for="t in serviceTypes"
                  :key="t"
                  class="pill"
                  :class="{active: typeFilter===t}"
                  @click="typeFilter=t"
                >
                  {{ t }}
                </button>
              </div>
            </div>
          </div>

          <button class="reset" @click="resetFilters">Reset</button>
        </div>
      </div>
    </section>

    <!-- FEATURED (Stanford-like highlight) -->
    <section class="featured">
      <div class="container">
        <div class="featured__bar">
          <div class="featured__left">
            <span class="featured__label">Featured service</span>
            <b class="featured__title">{{ featured.name }}</b>
            <span class="featured__meta">{{ featured.service_type }} • {{ featured.is_active ? 'چالاک' : 'ناچالاک' }}</span>
            <p class="featured__text">{{ featured.description }}</p>
            <button class="btnX btnX--primary" @click="openService(featured)">Open →</button>
          </div>

          <div class="featured__right">
            <img class="featured__img" :src="featured.cover.url" :alt="featured.name" />
          </div>
        </div>
      </div>
    </section>

    <!-- GRID -->
    <section class="section">
      <div class="container">
        <div class="head">
          <h2 class="head__title">لیستی خزمەتگوزارییەکان</h2>
          <p class="head__sub">نیشاندانی: <b>{{ filtered.length }}</b> خزمەتگوزاری</p>
        </div>

        <div class="grid">
          <article
            v-for="s in filtered"
            :key="s.slug"
            class="card"
            tabindex="0"
            @click="openService(s)"
            @keyup.enter="openService(s)"
          >
            <div class="card__media">
              <img :src="s.cover.url" :alt="s.name" />
              <span class="badge badge--dark">{{ s.service_type }}</span>
              <span class="badge" :class="s.is_active ? 'badge--green' : 'badge--gray'">
                {{ s.is_active ? 'چالاک' : 'ناچالاک' }}
              </span>
            </div>

            <div class="card__body">
              <h3 class="card__title">{{ s.name }}</h3>
              <p class="card__text">{{ s.description }}</p>

              <div class="meta">
                <span class="meta__pill">{{ s.service_type }}</span>
                <span class="meta__pill meta__pill--muted">{{ s.media.length }} میدیا</span>
                <span class="meta__dot">•</span>
                <span class="meta__date">{{ s.created_at }}</span>
              </div>

              <div class="cta">
                <span class="cta__text">زیاتر ببینە</span>
                <span class="cta__arrow">→</span>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- MODAL -->
    <div v-if="active" class="modal" @click.self="closeService" role="dialog" aria-modal="true">
      <div class="modal__panel">
        <button class="modal__close" @click="closeService" aria-label="Close">✕</button>

        <div class="modal__top">
          <div class="topline">
            <span class="pillX">{{ active.service_type }}</span>
            <span class="pillX pillX--muted">{{ active.is_active ? 'چالاک' : 'ناچالاک' }}</span>
            <span class="pillX pillX--muted">{{ active.media.length }} میدیا</span>
          </div>

          <h2 class="modal__title">{{ active.name }}</h2>
          <p class="modal__summary">{{ active.description }}</p>

          <div class="modal__notes">
            <div class="noteBox">
              <b>کات و ڕێنمایی (demo)</b>
              <p>
                بۆ بەکارهێنانی ئەم خزمەتگوزارییە، داواکاری بنووسە و کاتی بەردەست هەڵبژێرە.
                (دواتر دەتوانیت ئەمە لە table ـی booking یان contact هێنیت.)
              </p>
            </div>

            <div class="noteBox">
              <b>شوێن (demo)</b>
              <p>ناوەند • قۆناغی 1 • ژووری 12</p>
            </div>
          </div>
        </div>

        <div class="body">
          <div class="body__left">
            <div class="preview">
              <template v-if="selected?.media_type === 'image'">
                <img class="preview__img" :src="selected.url" :alt="selected.caption || active.name" />
              </template>

              <template v-else-if="selected?.media_type === 'video'">
                <video class="preview__video" controls :poster="selected.poster || active.cover.url">
                  <source :src="selected.url" type="video/mp4" />
                </video>
              </template>

              <template v-else-if="selected?.media_type === 'audio'">
                <div class="preview__audioWrap">
                  <img class="preview__audioCover" :src="active.cover.url" :alt="active.name" />
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
              <b>{{ selected?.caption || active.name }}</b>
              <p>{{ selected?.note || 'نمونەی دەق بۆ caption/description' }}</p>
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
          <button class="btnX" type="button" @click="closeService">Close</button>
        </div>
      </div>
    </div>

    <button class="toTop" @click="scrollTop" aria-label="Back to top">↑</button>
  </main>
</template>

<script setup>
import { ref, computed } from 'vue'

/* smooth scroll */
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

/* fake services shaped like your schema (services + service_media) */
const heroImage = 'https://picsum.photos/seed/serviceshero/2200/1100'

const services = ref([
  {
    id: 1,
    slug: 'main-hall',
    name: 'هۆڵی چالاکی',
    description: 'هۆڵێکی فراوان بۆ سمینار، بۆنە، کۆنفرانس و پێشانگا (demo).',
    service_type: 'hall',
    sort_order: 1,
    is_active: true,
    created_at: '2026-01-20',
    cover: { url: 'https://picsum.photos/seed/svccover1/1400/900', role: 'cover' },
    media: [
      { id: 'sm1', media_type: 'image', role: 'cover', url: 'https://picsum.photos/seed/hall1/1600/1000', caption: 'وێنەی هۆڵ' },
      { id: 'sm2', media_type: 'image', role: 'gallery', url: 'https://picsum.photos/seed/hall2/1600/1000', caption: 'گالەری 1' },
      { id: 'sm3', media_type: 'video', role: 'player', url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', caption: 'Tour (demo)' },
      { id: 'sm4', media_type: 'document', role: 'attachment', url: 'https://example.com/hall-rules.pdf', caption: 'Rules (demo)' },
    ],
  },
  {
    id: 2,
    slug: 'recording-studio',
    name: 'ستۆدیۆی تۆمارکردن',
    description: 'تۆمارکردنی دەنگ و ڤیدیۆ بە شێوەی پڕۆفێشنال، میکروفۆن و عایقکاری (demo).',
    service_type: 'studio',
    sort_order: 2,
    is_active: true,
    created_at: '2026-01-11',
    cover: { url: 'https://picsum.photos/seed/svccover2/1400/900', role: 'cover' },
    media: [
      { id: 'sm5', media_type: 'image', role: 'cover', url: 'https://picsum.photos/seed/studio1/1600/1000', caption: 'ستۆدیۆ' },
      { id: 'sm6', media_type: 'audio', role: 'player', url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3', caption: 'Sample audio (demo)' },
      { id: 'sm7', media_type: 'document', role: 'attachment', url: 'https://example.com/studio-pricing.pdf', caption: 'Pricing (demo)' },
    ],
  },
  {
    id: 3,
    slug: 'printing-design',
    name: 'چاپخانە و دیزاین',
    description: 'چاپی پوستر، بڕۆشور، کتێب، و دیزاینی material ـەکان (demo).',
    service_type: 'printing',
    sort_order: 3,
    is_active: true,
    created_at: '2025-12-28',
    cover: { url: 'https://picsum.photos/seed/svccover3/1400/900', role: 'cover' },
    media: [
      { id: 'sm8', media_type: 'image', role: 'cover', url: 'https://picsum.photos/seed/print1/1600/1000', caption: 'چاپخانە' },
      { id: 'sm9', media_type: 'image', role: 'gallery', url: 'https://picsum.photos/seed/print2/1600/1000', caption: 'نمونەی چاپ' },
      { id: 'sm10', media_type: 'document', role: 'attachment', url: 'https://example.com/print-catalog.pdf', caption: 'Catalog (demo)' },
    ],
  },
  {
    id: 4,
    slug: 'library-reading',
    name: 'کتێبخانە و خوێندنەوە',
    description: 'شوێنی خوێندن و کتێب و سەرچاوە بۆ توێژینەوە (demo).',
    service_type: 'library',
    sort_order: 4,
    is_active: false,
    created_at: '2025-11-10',
    cover: { url: 'https://picsum.photos/seed/svccover4/1400/900', role: 'cover' },
    media: [
      { id: 'sm11', media_type: 'image', role: 'cover', url: 'https://picsum.photos/seed/library1/1600/1000', caption: 'کتێبخانە' },
      { id: 'sm12', media_type: 'document', role: 'attachment', url: 'https://example.com/library-guides.pdf', caption: 'Guide (demo)' },
    ],
  },
])

const featured = computed(() => services.value[0])

/* filters */
const q = ref('')
const activeFilter = ref('all')
const typeFilter = ref('all')
const sortBy = ref('sort_order')

const serviceTypes = computed(() => {
  const s = new Set(services.value.map(x => x.service_type).filter(Boolean))
  return Array.from(s)
})

const filtered = computed(() => {
  const text = q.value.toLowerCase()

  let list = services.value.filter(s => {
    const matchesText =
      !text ||
      s.name.toLowerCase().includes(text) ||
      (s.description || '').toLowerCase().includes(text) ||
      (s.service_type || '').toLowerCase().includes(text)

    const matchesActive =
      activeFilter.value === 'all' ||
      (activeFilter.value === 'active' && s.is_active) ||
      (activeFilter.value === 'inactive' && !s.is_active)

    const matchesType = typeFilter.value === 'all' || s.service_type === typeFilter.value

    return matchesText && matchesActive && matchesType
  })

  list = [...list]
  if (sortBy.value === 'sort_order') list.sort((a,b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
  if (sortBy.value === 'name_az') list.sort((a,b) => a.name.localeCompare(b.name))
  if (sortBy.value === 'type_az') list.sort((a,b) => (a.service_type||'').localeCompare(b.service_type||''))
  if (sortBy.value === 'newest') list.sort((a,b) => (b.created_at||'').localeCompare(a.created_at||''))

  return list
})

function resetFilters(){
  q.value = ''
  activeFilter.value = 'all'
  typeFilter.value = 'all'
  sortBy.value = 'sort_order'
}

/* modal */
const active = ref(null)
const selected = ref(null)

function openService(s){
  active.value = s
  selected.value = s.media.find(m => m.role === 'cover') || s.media[0]
  document.body.style.overflow = 'hidden'
}
function closeService(){
  active.value = null
  selected.value = null
  document.body.style.overflow = ''
}

function fakeNavigate(slug){
  alert(`Demo: go to /services/${slug}`)
}
function fakeOpenDoc(){
  alert('Demo: open document')
}
</script>

<style scoped>
/* =========================================================
   Stanford-like clean design (NO responsive / NO media queries)
   ========================================================= */
.services{
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

/* smooth scroll */
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

/* grid */
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

.grid{
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

/* card */
.card{
  background: #fff;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  overflow: hidden;
  cursor: pointer;
  transition: transform .18s ease, box-shadow .18s ease;
  box-shadow: 0 0 0 rgba(0,0,0,0);
}
.card:hover{
  transform: translateY(-5px);
  box-shadow: var(--shadow2);
}
.card:focus-visible{
  outline: 3px solid rgba(140,21,21,.25);
  outline-offset: 3px;
}
.card__media{
  position: relative;
  aspect-ratio: 16/10;
  overflow: hidden;
}
.card__media img{
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1.02);
  transition: transform .35s ease;
}
.card:hover .card__media img{ transform: scale(1.07); }

.badge{
  position: absolute;
  top: 12px;
  left: 12px;
  background: rgba(255,255,255,.92);
  border: 1px solid rgba(0,0,0,.10);
  border-radius: 999px;
  padding: 6px 10px;
  font-weight: 900;
  font-size: 12px;
}
.badge--dark{
  left: auto;
  right: 12px;
  background: rgba(0,0,0,.62);
  color: #fff;
  border-color: rgba(255,255,255,.14);
}
.badge--green{
  background: rgba(18, 122, 66, .12);
  color: #0b5a30;
  border-color: rgba(18,122,66,.25);
}
.badge--gray{
  background: rgba(0,0,0,.06);
  color: #444;
  border-color: rgba(0,0,0,.12);
}

.card__body{
  padding: 14px 14px 16px;
}
.card__title{
  margin: 0 0 8px;
  font-weight: 900;
  font-size: 18px;
  line-height: 1.12;
}
.card__text{
  margin: 0 0 12px;
  color: var(--muted);
  line-height: 1.5;
}
.meta{
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--muted);
  font-size: 12px;
  margin-bottom: 10px;
}
.meta__pill{
  border-radius: 999px;
  padding: 6px 10px;
  font-weight: 900;
  background: rgba(0,0,0,.04);
  border: 1px solid rgba(0,0,0,.08);
  color: #111;
}
.meta__pill--muted{ opacity: .85; }
.meta__dot{ opacity: .7; }
.meta__date{ opacity: .9; }

/* CTA underline animation */
.cta{
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-weight: 900;
  color: #111;
}
.cta__text{ position: relative; }
.cta__text::after{
  content:"";
  position:absolute;
  left:0; bottom:-4px;
  height:2px; width:0%;
  background: currentColor;
  transition: width .18s ease;
}
.card:hover .cta__text::after{ width:100%; }
.cta__arrow{ transition: transform .18s ease; }
.card:hover .cta__arrow{ transform: translateX(4px); }

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

/* notes */
.modal__notes{
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 10px;
}
.noteBox{
  border: 1px solid rgba(0,0,0,.08);
  background: rgba(0,0,0,.02);
  border-radius: 14px;
  padding: 12px;
}
.noteBox b{ display:block; margin-bottom: 6px; }
.noteBox p{ margin: 0; color: var(--muted); line-height: 1.55; }

/* body */
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
  background: #8C1515;
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

/* top */
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
