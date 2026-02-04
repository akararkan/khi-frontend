<template>
  <main id="main-content" class="about">
    <!-- HERO -->
    <header class="hero">
      <div class="hero__bg" :style="{ backgroundImage: `url(${heroImage})` }"></div>
      <div class="hero__overlay"></div>

      <div class="container hero__content">
        <p class="hero__kicker">دەربارە</p>
        <h1 class="hero__title">دەربارەی ناوەند</h1>
        <p class="hero__sub">
          ئەمە demo ـە. داتاکان fake ـن، بەڵام لەگەڵ schema ـەکەت (about_sections + about_media) گونجاوە.
        </p>

        <div class="hero__stats">
          <div class="stat">
            <span class="stat__label">ژمارەی بەشەکان</span>
            <span class="stat__value">{{ sections.length }}</span>
          </div>
          <div class="stat">
            <span class="stat__label">بینراو</span>
            <span class="stat__value">{{ sections.filter(s => s.is_visible).length }}</span>
          </div>
          <div class="stat">
            <span class="stat__label">میدیا</span>
            <span class="stat__value">{{ totalMedia }}</span>
          </div>
        </div>

        <div class="hero__ctaRow">
          <a class="ghostBtn" href="#sections">بینینی بەشەکان ↓</a>
          <button class="ghostBtn" type="button" @click="scrollTo('values')">ئامانج و بەرزترین‌ها ↓</button>
        </div>
      </div>
    </header>

    <!-- QUICK NAV -->
    <section class="quickNav" id="sections">
      <div class="container">
        <div class="quickNav__bar">
          <div class="quickNav__left">
            <h2 class="quickNav__title">بەشەکان</h2>
            <p class="quickNav__sub">کلیک بکە بۆ چوونە ناو بەشەکان بە smooth scroll.</p>
          </div>

          <div class="quickNav__right">
            <a
              v-for="s in visibleSections"
              :key="s.slug"
              class="jump"
              :href="'#' + s.slug"
            >
              {{ s.title }}
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTIONS -->
    <section class="section">
      <div class="container">
        <div class="gridHead">
          <h2 class="gridHead__title">دەربارەی ناوەند</h2>
          <p class="gridHead__sub">پاکیزە • ڕێک • ستانفۆرد-وەک</p>
        </div>

        <div class="cards">
          <article
            v-for="s in visibleSections"
            :key="s.slug"
            class="card"
            :id="s.slug"
          >
            <div class="card__media">
              <img :src="coverFor(s).url" :alt="s.title" />
              <span class="badge badge--dark">{{ s.slug }}</span>
              <span class="badge badge--light">{{ s.media.length }} میدیا</span>
            </div>

            <div class="card__body">
              <h3 class="card__title">{{ s.title }}</h3>
              <p class="card__text">{{ s.body }}</p>

              <div class="meta">
                <span class="meta__pill">Sort: {{ s.sort_order }}</span>
                <span class="meta__pill meta__pill--muted">Updated: {{ s.updated_at }}</span>
              </div>

              <div class="ctaRow">
                <button class="btnX btnX--primary" type="button" @click="openSection(s)">
                  View media →
                </button>
                <button class="btnX" type="button" @click="copyLink(s.slug)">
                  Copy link
                </button>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- VALUES / HIGHLIGHTS -->
    <section class="values" id="values">
      <div class="container">
        <div class="values__wrap">
          <div class="values__left">
            <span class="kicker">Highlights</span>
            <h2 class="values__title">ئامانج و ڕێنماییەکان</h2>
            <p class="values__text">
              دیزاینەکە وەک ستانفۆرد: سادە، سپی، کارتە پاکیزەکان، و حرکتە نەرمه‌کان.
              دواتر دەتوانیت ئەم دەقانە لە DB بخوێنیت.
            </p>

            <div class="bullets">
              <div class="bullet">
                <b>ئەرشیڤ</b>
                <span>پاراستنی دەنگ/وێنە/فیلم بۆ داهاتوو.</span>
              </div>
              <div class="bullet">
                <b>توێژینەوە</b>
                <span>سەرچاوە و داتاسێت بۆ توێژەران.</span>
              </div>
              <div class="bullet">
                <b>خزمەتگوزاری</b>
                <span>هۆڵ، ستۆدیۆ، چاپ، کتێبخانە (وەک Services page).</span>
              </div>
            </div>
          </div>

          <div class="values__right">
            <div class="panel">
              <b>Quick facts (demo)</b>
              <div class="fact"><span>دامەزراندن</span><b>2026</b></div>
              <div class="fact"><span>شوێن</span><b>سلێمانی</b></div>
              <div class="fact"><span>ژمارەی بەش</span><b>{{ visibleSections.length }}</b></div>
              <div class="fact"><span>کۆی میدیا</span><b>{{ totalMedia }}</b></div>
              <button class="btnX btnX--primary" type="button" @click="scrollTo('main-content')">Back to top ↑</button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- MODAL -->
    <div v-if="active" class="modal" @click.self="closeSection" role="dialog" aria-modal="true">
      <div class="modal__panel">
        <button class="modal__close" @click="closeSection" aria-label="Close">✕</button>

        <div class="modal__top">
          <div class="topline">
            <span class="pillX">{{ active.title }}</span>
            <span class="pillX pillX--muted">{{ active.slug }}</span>
            <span class="pillX pillX--muted">{{ active.media.length }} میدیا</span>
          </div>
          <p class="modal__summary">{{ active.body }}</p>
        </div>

        <div class="body">
          <div class="body__left">
            <div class="preview">
              <template v-if="selected?.media_type === 'image'">
                <img class="preview__img" :src="selected.url" :alt="selected.caption || active.title" />
              </template>

              <template v-else-if="selected?.media_type === 'video'">
                <video class="preview__video" controls :poster="selected.poster || coverFor(active).url">
                  <source :src="selected.url" type="video/mp4" />
                </video>
              </template>

              <template v-else-if="selected?.media_type === 'audio'">
                <div class="preview__audioWrap">
                  <img class="preview__audioCover" :src="coverFor(active).url" :alt="active.title" />
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
              <p>{{ selected?.note || 'نمونەی دەق بۆ caption.' }}</p>
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
                  <span class="thumb__sub">{{ m.media_type }}</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        <div class="modal__foot">
          <button class="btnX btnX--primary" type="button" @click="closeSection">Close</button>
        </div>
      </div>
    </div>

    <button class="toTop" @click="scrollTo('main-content')" aria-label="Back to top">↑</button>
  </main>
</template>

<script setup>
import { ref, computed } from 'vue'

/* smooth scroll helper */
function scrollTo(id) {
  const el = document.getElementById(id)
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
  if (!el) return
  const top = el.getBoundingClientRect().top + window.scrollY - 90
  window.scrollTo({ top, behavior: reduced ? 'auto' : 'smooth' })
}

function iconFor(type) {
  return type === 'image' ? '🖼️' : type === 'video' ? '🎬' : type === 'audio' ? '🎧' : '📄'
}
function labelFor(type) {
  return type === 'image' ? 'وێنە' : type === 'video' ? 'ڤیدیۆ' : type === 'audio' ? 'دەنگ' : 'دۆکیومێنت'
}

/* fake data like about_sections + about_media */
const heroImage = 'https://picsum.photos/seed/aboutHero/2200/1100'

const sections = ref([
  {
    id: 1,
    slug: 'institution',
    title: 'دەربارەی دامەزراوە',
    body: 'دەقی demo: ئامانج و کردارە سەرەکییەکان، پاراستن، ڕووناکی، و بەرهەمهێنان.',
    sort_order: 1,
    is_visible: 1,
    created_at: '2026-01-02',
    updated_at: '2026-01-20',
    media: [
      { id: 'am1', media_type: 'image', url: 'https://picsum.photos/seed/about1/1600/1000', caption: 'وێنەی ناوەند' },
      { id: 'am2', media_type: 'video', url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', caption: 'Tour (demo)' },
      { id: 'am3', media_type: 'document', url: 'https://example.com/about.pdf', caption: 'PDF (demo)' },
    ],
  },
  {
    id: 2,
    slug: 'team',
    title: 'تیم و هاوبەشەکان',
    body: 'دەقی demo: تیمی کار و هاوبەشییەکان، بەرهەم و پلاندانان.',
    sort_order: 2,
    is_visible: 1,
    created_at: '2026-01-05',
    updated_at: '2026-01-18',
    media: [
      { id: 'am4', media_type: 'image', url: 'https://picsum.photos/seed/about2/1600/1000', caption: 'تیم (demo)' },
      { id: 'am5', media_type: 'image', url: 'https://picsum.photos/seed/about3/1600/1000', caption: 'هاوبەشی (demo)' },
    ],
  },
  {
    id: 3,
    slug: 'departments',
    title: 'بەشەکان و کاریگەری',
    body: 'دەقی demo: بەشەکانی ناوەند، کار و توێژینەوە و ڕووناکی بۆ کۆمەڵگا.',
    sort_order: 3,
    is_visible: 1,
    created_at: '2026-01-08',
    updated_at: '2026-01-19',
    media: [
      { id: 'am6', media_type: 'image', url: 'https://picsum.photos/seed/about4/1600/1000', caption: 'بەشەکان' },
      { id: 'am7', media_type: 'audio', url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3', caption: 'دەنگی نموونە', note: 'Demo only' },
    ],
  },
  {
    id: 4,
    slug: 'vision',
    title: 'بینین و ئامانج',
    body: 'دەقی demo: بینینی داهاتوو، پلان بۆ ئەرشیڤی گشتی دیژیتاڵ و پەیوەندی بە جیهان.',
    sort_order: 4,
    is_visible: 1,
    created_at: '2026-01-10',
    updated_at: '2026-01-21',
    media: [
      { id: 'am8', media_type: 'image', url: 'https://picsum.photos/seed/about5/1600/1000', caption: 'Vision (demo)' },
      { id: 'am9', media_type: 'document', url: 'https://example.com/strategy.pdf', caption: 'Strategy (demo)' },
    ],
  },
])

const visibleSections = computed(() =>
  [...sections.value].filter(s => !!s.is_visible).sort((a,b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
)

const totalMedia = computed(() =>
  visibleSections.value.reduce((sum, s) => sum + (s.media?.length || 0), 0)
)

function coverFor(section) {
  const img = section.media.find(m => m.media_type === 'image')
  return img || { url: 'https://picsum.photos/seed/aboutFallback/1600/1000' }
}

/* modal */
const active = ref(null)
const selected = ref(null)

function openSection(s) {
  active.value = s
  selected.value = s.media.find(m => m.media_type === 'image') || s.media[0]
  document.body.style.overflow = 'hidden'
}
function closeSection() {
  active.value = null
  selected.value = null
  document.body.style.overflow = ''
}

async function copyLink(slug) {
  const url = `${window.location.origin}${window.location.pathname}#${slug}`
  try {
    await navigator.clipboard.writeText(url)
    alert('Copied ✅')
  } catch {
    alert(url)
  }
}

function fakeOpenDoc() {
  alert('Demo: open document')
}
</script>

<style scoped>
.about{
  --brand:#8C1515; --bg:#fff; --alt:#f6f7f8; --text:#2E2D29; --muted:#5f6368;
  --line:rgba(0,0,0,.10); --shadow:0 18px 54px rgba(0,0,0,.18); --shadow2:0 10px 26px rgba(0,0,0,.10);
  --radius:18px; --container:1200px;

  background:var(--bg); color:var(--text); min-height:100vh;
}

/* smooth scroll (no @media here) */
:global(html){ scroll-behavior:smooth; }

.container{ max-width:var(--container); margin:0 auto; padding:0 22px; }

/* hero */
.hero{ position:relative; min-height:56vh; overflow:hidden; display:grid; place-items:center; }
.hero__bg{ position:absolute; inset:0; background-size:cover; background-position:center; transform:scale(1.02); }
.hero__overlay{ position:absolute; inset:0; background:linear-gradient(180deg,rgba(0,0,0,.62) 0%,rgba(0,0,0,.24) 55%,rgba(0,0,0,.55) 100%); }
.hero__content{ position:relative; z-index:2; padding-top:140px; padding-bottom:48px; color:#fff; }
.hero__kicker{ margin:0 0 10px; letter-spacing:.16em; text-transform:uppercase; font-weight:800; opacity:.92; font-size:12px; }
.hero__title{ font-family:Georgia,"Times New Roman",serif; font-weight:900; font-size:62px; line-height:1.02; margin:0 0 12px; }
.hero__sub{ margin:0 0 18px; max-width:70ch; opacity:.92; color:rgba(255,255,255,.92); }
.hero__stats{ display:flex; gap:14px; margin-bottom:14px; }
.stat{ background:rgba(255,255,255,.12); border:1px solid rgba(255,255,255,.22); border-radius:14px; padding:10px 12px; backdrop-filter:blur(10px); }
.stat__label{ display:block; font-size:12px; opacity:.9; }
.stat__value{ display:block; font-weight:900; font-size:18px; }

.hero__ctaRow{ display:flex; gap:10px; }
.ghostBtn{
  border:1px solid rgba(255,255,255,.28);
  background:rgba(255,255,255,.10);
  color:#fff;
  border-radius:999px;
  padding:10px 12px;
  font-weight:900;
  cursor:pointer;
  text-decoration:none;
  transition: transform .16s ease, background .16s ease;
}
.ghostBtn:hover{ transform: translateY(-1px); background: rgba(255,255,255,.16); }

/* quick nav */
.quickNav{ background:var(--alt); border-bottom:1px solid rgba(0,0,0,.06); padding:16px 0; }
.quickNav__bar{
  border:1px solid var(--line);
  background:#fff;
  border-radius:22px;
  padding:14px 14px;
  box-shadow: var(--shadow2);
  display:flex;
  align-items:flex-start;
  justify-content:space-between;
  gap:14px;
}
.quickNav__title{ margin:0; font-family:Georgia,"Times New Roman",serif; font-weight:900; font-size:22px; }
.quickNav__sub{ margin:6px 0 0; color:var(--muted); }
.quickNav__right{ display:flex; flex-wrap:wrap; gap:10px; justify-content:flex-end; }
.jump{
  border:1px solid rgba(0,0,0,.10);
  background:rgba(0,0,0,.03);
  border-radius:999px;
  padding:9px 12px;
  font-weight:900;
  color:#111;
  text-decoration:none;
  transition: transform .16s ease, background .16s ease, border-color .16s ease;
}
.jump:hover{ transform: translateY(-1px); background: rgba(140,21,21,.08); border-color: rgba(140,21,21,.18); }

/* section */
.section{ padding:26px 0 40px; }
.gridHead{ display:flex; align-items:baseline; justify-content:space-between; margin:18px 0 16px; }
.gridHead__title{ font-family:Georgia,"Times New Roman",serif; font-weight:900; margin:0; font-size:26px; }
.gridHead__sub{ margin:0; color:var(--muted); }

/* cards */
.cards{ display:grid; grid-template-columns: repeat(2, 1fr); gap:16px; }
.card{
  border:1px solid var(--line);
  background:#fff;
  border-radius:22px;
  overflow:hidden;
  box-shadow: 0 0 0 rgba(0,0,0,0);
  transition: transform .18s ease, box-shadow .18s ease;
}
.card:hover{ transform: translateY(-3px); box-shadow: var(--shadow2); }
.card__media{ position:relative; aspect-ratio: 16/9; overflow:hidden; }
.card__media img{ width:100%; height:100%; object-fit:cover; transform:scale(1.02); transition: transform .35s ease; display:block; }
.card:hover .card__media img{ transform: scale(1.07); }

.badge{
  position:absolute; top:12px; left:12px;
  border-radius:999px; padding:6px 10px;
  font-weight:900; font-size:12px;
  border:1px solid rgba(0,0,0,.10);
  background: rgba(255,255,255,.92);
}
.badge--dark{ left:auto; right:12px; background: rgba(0,0,0,.62); color:#fff; border-color: rgba(255,255,255,.14); }
.badge--light{ top:auto; bottom:12px; background: rgba(255,255,255,.88); }

.card__body{ padding:14px 14px 16px; }
.card__title{ margin:0 0 8px; font-weight:900; font-size:20px; }
.card__text{ margin:0 0 12px; color:var(--muted); line-height:1.6; }

.meta{ display:flex; gap:8px; flex-wrap:wrap; margin-bottom:12px; }
.meta__pill{
  border-radius:999px; padding:6px 10px; font-weight:900; font-size:12px;
  background: rgba(0,0,0,.04); border:1px solid rgba(0,0,0,.08);
}
.meta__pill--muted{ opacity:.85; }

.ctaRow{ display:flex; gap:10px; }
.btnX{
  border:1px solid rgba(0,0,0,.12);
  background:#fff;
  border-radius:12px;
  padding:12px 14px;
  font-weight:900;
  cursor:pointer;
  transition: transform .16s ease, box-shadow .16s ease;
}
.btnX:hover{ transform: translateY(-1px); box-shadow: var(--shadow2); }
.btnX--primary{
  background: var(--brand);
  border-color: rgba(140,21,21,.25);
  color:#fff;
  box-shadow: 0 16px 42px rgba(140,21,21,.22);
}

/* values */
.values{ background: var(--alt); border-top:1px solid rgba(0,0,0,.06); padding:26px 0 60px; }
.values__wrap{ display:grid; grid-template-columns: 1.3fr 1fr; gap:16px; }
.kicker{ display:inline-flex; border-radius:999px; padding:7px 10px; font-weight:900; font-size:12px;
  background: rgba(140,21,21,.10); border:1px solid rgba(140,21,21,.20); color:#6b0f0f; }
.values__title{ font-family:Georgia,"Times New Roman",serif; font-weight:900; font-size:30px; margin:10px 0 10px; }
.values__text{ margin:0 0 14px; color:var(--muted); line-height:1.7; }
.bullets{ display:grid; gap:10px; }
.bullet{
  border:1px solid rgba(0,0,0,.08);
  background:#fff;
  border-radius:16px;
  padding:12px;
  box-shadow: var(--shadow2);
}
.bullet b{ display:block; margin-bottom:6px; }
.bullet span{ color:var(--muted); }

.panel{
  border:1px solid rgba(0,0,0,.10);
  background:#fff;
  border-radius:22px;
  padding:14px;
  box-shadow: var(--shadow2);
}
.panel b{ display:block; margin-bottom:10px; }
.fact{ display:flex; align-items:center; justify-content:space-between; padding:10px 0; border-top:1px solid rgba(0,0,0,.06); }
.fact span{ color:var(--muted); font-weight:800; }
.fact b{ margin:0; }

/* modal */
.modal{ position:fixed; inset:0; background: rgba(0,0,0,.62); z-index:9999; display:grid; place-items:center; padding:26px; }
.modal__panel{
  width: 1100px; max-width:1100px;
  background:#fff; border-radius:22px;
  border:1px solid rgba(0,0,0,.10);
  box-shadow: var(--shadow);
  overflow:hidden; position:relative;
}
.modal__close{
  position:absolute; top:12px; right:12px; width:44px; height:44px;
  border-radius:999px; border:1px solid rgba(0,0,0,.12); background:#fff; font-weight:900; cursor:pointer;
}
.modal__top{ padding:18px 18px 14px; border-bottom:1px solid rgba(0,0,0,.08); }
.topline{ display:flex; gap:8px; flex-wrap:wrap; margin-bottom:10px; }
.pillX{ border-radius:999px; padding:7px 10px; font-weight:900; background:rgba(0,0,0,.04); border:1px solid rgba(0,0,0,.08); }
.pillX--muted{ opacity:.85; }
.modal__summary{ margin:0; color:var(--muted); }

.body{ display:grid; grid-template-columns: 1.6fr 1fr; }
.body__left{ padding:16px 16px 18px; border-right:1px solid rgba(0,0,0,.08); }
.body__right{ padding:16px 16px 18px; }

.preview{ border-radius:16px; border:1px solid rgba(0,0,0,.10); overflow:hidden; background:#0b0b0b; }
.preview__img{ width:100%; height:520px; object-fit:cover; display:block; }
.preview__video{ width:100%; height:520px; display:block; background:#000; }

.preview__audioWrap{ height:520px; background:#fff; display:grid; grid-template-columns:260px 1fr; gap:14px; padding:16px; }
.preview__audioCover{ width:100%; height:100%; border-radius:14px; object-fit:cover; border:1px solid rgba(0,0,0,.10); }
.preview__audioMeta{ display:grid; gap:10px; color:var(--muted); }
.preview__audioMeta b{ color:#111; }
.preview__audio{ width:100%; }

.preview__doc{ height:520px; background:#fff; display:grid; grid-template-columns:72px 1fr auto; align-items:center; gap:12px; padding:18px; }
.docIcon{ width:60px; height:60px; border-radius:16px; background:rgba(0,0,0,.04); border:1px solid rgba(0,0,0,.10); display:grid; place-items:center; font-size:26px; }
.docText{ display:grid; gap:6px; color:var(--muted); }
.docText b{ color:#111; }

.caption{ margin-top:12px; color:var(--muted); }
.caption b{ color:#111; }

.thumbHead{ display:flex; align-items:baseline; justify-content:space-between; margin-bottom:10px; }
.thumbHead__title{ margin:0; font-weight:900; font-size:16px; }
.thumbHead__sub{ color:var(--muted); font-size:12px; }

.thumbs{ display:grid; gap:10px; max-height:610px; overflow:auto; padding-right:6px; }
.thumb{
  width:100%; text-align:left;
  border:1px solid rgba(0,0,0,.10);
  background:#fff;
  border-radius:14px;
  padding:12px;
  cursor:pointer;
  display:grid;
  grid-template-columns:46px 1fr;
  gap:10px;
  transition: transform .16s ease, box-shadow .16s ease, border-color .16s ease;
}
.thumb:hover{ transform: translateY(-1px); box-shadow: var(--shadow2); }
.thumb.is-active{ border-color: rgba(140,21,21,.32); box-shadow: 0 0 0 4px rgba(140,21,21,.10); }
.thumb__icon{ width:46px; height:46px; border-radius:14px; background:rgba(0,0,0,.04); border:1px solid rgba(0,0,0,.10); display:grid; place-items:center; font-size:18px; }
.thumb__info{ display:grid; gap:5px; }
.thumb__title{ font-size:13px; font-weight:900; color:#111; }
.thumb__sub{ font-size:12px; color:var(--muted); }

.modal__foot{ padding:14px 16px; border-top:1px solid rgba(0,0,0,.08); display:flex; justify-content:flex-end; gap:10px; }

/* to top */
.toTop{
  position:fixed; bottom:18px; left:18px;
  width:46px; height:46px; border-radius:999px;
  border:1px solid rgba(0,0,0,.12); background:#fff; font-weight:900; cursor:pointer;
  box-shadow: var(--shadow2); transition: transform .16s ease;
  z-index:2000;
}
.toTop:hover{ transform: translateY(-2px); }
</style>
