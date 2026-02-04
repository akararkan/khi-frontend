<template>
  <footer class="site-footer" role="contentinfo" dir="rtl">
    <!-- TOP STRIP -->
    <div class="footer-top">
      <div class="container footer-top__inner">
        <!-- Newsletter -->
        <div class="newsletter">
          <div class="newsletter__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
          </div>

          <div class="newsletter__content">
            <h4 class="newsletter__title">بەشداری لە نامەی نوێترینەکان</h4>
            <p class="newsletter__text">نوێترین هەواڵ و چالاکییەکان وەربگرە</p>
          </div>

          <form class="newsletter__form" @submit.prevent="subscribeNewsletter">
            <input
              type="email"
              class="newsletter__input"
              placeholder="ئیمەیڵ..."
              v-model.trim="email"
              required
            />
            <button type="submit" class="newsletter__btn">
              <span>بەشداربە</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </form>
        </div>

        <!-- Social -->
        <div class="social">
          <span class="social__label">پەیوەندی</span>

          <div class="social__links" dir="ltr">
            <a class="social__btn" href="#" @click.prevent="openSocial('Facebook')" aria-label="Facebook">
              <svg viewBox="0 0 24 24" class="ico"><path d="M14 8h2V5h-2c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h2.4l.6-3H13V9c0-.6.4-1 1-1z"/></svg>
              <span class="tip">Facebook</span>
            </a>

            <a class="social__btn" href="#" @click.prevent="openSocial('Instagram')" aria-label="Instagram">
              <svg viewBox="0 0 24 24" class="ico"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm10 2H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3zm-5 4.5A5.5 5.5 0 1 1 6.5 14 5.5 5.5 0 0 1 12 8.5zm0 2A3.5 3.5 0 1 0 15.5 14 3.5 3.5 0 0 0 12 10.5zM18 6.8a1.2 1.2 0 1 1-1.2-1.2A1.2 1.2 0 0 1 18 6.8z"/></svg>
              <span class="tip">Instagram</span>
            </a>

            <a class="social__btn" href="#" @click.prevent="openSocial('YouTube')" aria-label="YouTube">
              <svg viewBox="0 0 24 24" class="ico"><path d="M21.8 8.1a3 3 0 0 0-2.1-2.1C17.9 5.5 12 5.5 12 5.5s-5.9 0-7.7.5A3 3 0 0 0 2.2 8.1 31.4 31.4 0 0 0 2 12a31.4 31.4 0 0 0 .2 3.9 3 3 0 0 0 2.1 2.1c1.8.5 7.7.5 7.7.5s5.9 0 7.7-.5a3 3 0 0 0 2.1-2.1A31.4 31.4 0 0 0 22 12a31.4 31.4 0 0 0-.2-3.9zM10 15.5v-7l6 3.5-6 3.5z"/></svg>
              <span class="tip">YouTube</span>
            </a>

            <a class="social__btn" href="#" @click.prevent="openSocial('X')" aria-label="X">
              <svg viewBox="0 0 24 24" class="ico"><path d="M18.9 3H21l-6.6 7.5L22 21h-6.2l-4.8-6.3L5.6 21H3.5l7.1-8.1L2 3h6.3l4.3 5.7L18.9 3zm-1.1 16h1.2L7.1 4.9H5.8L17.8 19z"/></svg>
              <span class="tip">X</span>
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- MAIN -->
    <div class="footer-main">
      <div class="container footer-main__inner">
        <div class="footer-grid">
          <!-- Projects -->
          <div class="col">
            <h4 class="col__title">پڕۆژەکان</h4>
            <nav class="links">
              <RouterLink class="link" to="/projects">هەموو پڕۆژەکان</RouterLink>
              <a class="link" href="#" @click.prevent="goTo('projects','ongoing')">بەردەوام</a>
              <a class="link" href="#" @click.prevent="goTo('projects','completed')">تەواوکراو</a>
            </nav>
          </div>

          <!-- Publishments -->
          <div class="col">
            <h4 class="col__title">بڵاوکراوەکان</h4>
            <nav class="links">
              <RouterLink class="link" to="/publishments">هەموو بڵاوکراوەکان</RouterLink>
              <a class="link" href="#" @click.prevent="goTo('publishments','writing')">نووسین</a>
              <a class="link" href="#" @click.prevent="goTo('publishments','music')">دەنگ</a>
              <a class="link" href="#" @click.prevent="goTo('publishments','video')">ڤیدیۆ</a>
            </nav>
          </div>

          <!-- Services -->
          <div class="col">
            <h4 class="col__title">خزمەتگوزاری</h4>
            <nav class="links">
              <RouterLink class="link" to="/services">هەموو خزمەتگوزارییەکان</RouterLink>
              <a class="link" href="#" @click.prevent="goTo('services','studio')">ستۆدیۆ</a>
              <a class="link" href="#" @click.prevent="goTo('services','print')">چاپ</a>
            </nav>
          </div>

          <!-- About -->
          <div class="col">
            <h4 class="col__title">دەربارە</h4>
            <nav class="links">
              <RouterLink class="link" to="/about">دەربارەی ئێمە</RouterLink>
              <a class="link" href="#" @click.prevent="goTo('about','team')">تیم</a>
              <a class="link" href="#" @click.prevent="goTo('about','vision')">بینین</a>
            </nav>
          </div>

          <!-- Contact + Language -->
          <div class="col">
            <h4 class="col__title">پەیوەندی</h4>
            <nav class="links">
              <RouterLink class="link" to="/contact">پەیوەندیمان پێوە بکە</RouterLink>
              <a class="link" :href="`mailto:${emailText}`">{{ emailText }}</a>
              <a class="link" :href="`tel:${phoneText}`">{{ phoneText }}</a>
            </nav>

            <div class="lang">
              <span class="lang__label">زمان</span>
              <div class="lang__buttons">
                <button
                  v-for="lang in languages"
                  :key="lang.code"
                  class="langBtn"
                  :class="{ active: currentLang === lang.code }"
                  @click="switchLanguage(lang.code)"
                  type="button"
                >
                  {{ lang.label }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions (Stanford-like right buttons) -->
        <div class="actions">
          <button class="actionBtn" type="button" @click="goTo('submit','project')">ناردنی پڕۆژە</button>
          <button class="actionBtn" type="button" @click="goTo('submit','service')">داواکاری خزمەتگوزاری</button>
          <RouterLink class="actionBtn actionBtn--dark" to="/contact">پەیوەندی</RouterLink>
        </div>
      </div>
    </div>

    <!-- BOTTOM BAR -->
    <div class="footer-bottom">
      <div class="container footer-bottom__inner">
        <div class="brand">
          <div class="brand__mark" aria-hidden="true">
            <svg viewBox="0 0 40 40" fill="none">
              <rect width="40" height="40" rx="10" fill="rgba(255,255,255,0.16)"/>
              <circle cx="20" cy="20" r="8" fill="#FEDD00"/>
              <path d="M20 8L21.5 12H18.5L20 8Z" fill="#FEDD00"/>
              <path d="M20 32L18.5 28H21.5L20 32Z" fill="#FEDD00"/>
              <path d="M8 20L12 18.5V21.5L8 20Z" fill="#FEDD00"/>
              <path d="M32 20L28 21.5V18.5L32 20Z" fill="#FEDD00"/>
            </svg>
          </div>

          <div class="brand__text">
            <div class="brand__name">{{ projectName }}</div>
            <div class="brand__loc">{{ locationText }}</div>
          </div>
        </div>

        <div class="bottomLinks">
          <RouterLink class="bLink" to="/">سەرەکی</RouterLink>
          <RouterLink class="bLink" to="/projects">پڕۆژەکان</RouterLink>
          <RouterLink class="bLink" to="/publishments">بڵاوکراوەکان</RouterLink>
          <RouterLink class="bLink" to="/services">خزمەتگوزاری</RouterLink>
          <RouterLink class="bLink" to="/about">دەربارە</RouterLink>
          <RouterLink class="bLink" to="/contact">پەیوەندی</RouterLink>

          <span class="dot">•</span>

          <a class="bLink" href="#" @click.prevent="goTo('legal','privacy')">تایبەتمەندی</a>
          <a class="bLink" href="#" @click.prevent="goTo('legal','terms')">مەرجەکان</a>
        </div>

        <div class="copyRow">
          <span>© {{ year }} {{ projectName }}. هەموو مافەکان پارێزراون.</span>
        </div>
      </div>
    </div>

    <!-- Back to top -->
    <Transition name="fade">
      <button v-if="showBackToTop" class="backToTop" @click="scrollTop" aria-label="بگەڕێوە سەرەوە">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 15l-6-6-6 6"/>
        </svg>
      </button>
    </Transition>
  </footer>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

/* CONFIG — بگۆڕە بۆ پڕۆژەکەت */
const projectName = 'پەیمانگای کەلەپووری کوردی'
const locationText = 'سلێمانی، هەرێمی کوردستان'
const emailText = 'info@kurdheritage.org'
const phoneText = '+9647701234567'

const year = computed(() => new Date().getFullYear())

/* Language */
const currentLang = ref('ckb')
const languages = [
  { code: 'ckb', label: 'کوردی' },
  { code: 'kmr', label: 'Kurmancî' },
  { code: 'ar',  label: 'عەرەبی' },
  { code: 'en',  label: 'English' },
]
function switchLanguage(code) {
  currentLang.value = code
  // implement later
}

/* Newsletter */
const email = ref('')
function subscribeNewsletter() {
  alert(`Demo: بەشداری ${email.value}`)
  email.value = ''
}

/* Navigation */
function goTo(section, filter = null) {
  // demo routing
  if (section === 'projects') return router.push('/projects')
  if (section === 'publishments') return router.push('/publishments')
  if (section === 'services') return router.push('/services')
  if (section === 'about') return router.push('/about')
  if (section === 'contact') return router.push('/contact')
  console.log('GoTo:', section, filter)
}
function openSocial(name) {
  console.log('Open social:', name)
}

/* Back to top */
const showBackToTop = ref(false)
function onScroll() { showBackToTop.value = window.scrollY > 600 }
function scrollTop() {
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
  window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })
}
onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<style scoped>
/* ===== Tokens ===== */
.site-footer{
  --brand:#8C1515;
  --ink:#1f1f1f;
  --muted:#6b6b6b;
  --line:#e2e2e2;
  --soft:#f1f1f1;
  --soft2:#fafafa;
  --white:#fff;

  --container:1240px;

  --radius-sm:10px;
  --radius-md:14px;
  --radius-lg:18px;

  --shadow-sm:0 2px 10px rgba(0,0,0,.06);
  --shadow-md:0 10px 28px rgba(0,0,0,.10);

  font-family: system-ui, -apple-system, "Noto Sans Arabic", "Noto Kufi Arabic", Segoe UI, Roboto, Arial, sans-serif;
  color: var(--ink);
}
.container{
  max-width: var(--container);
  margin: 0 auto;
  padding: 0 24px;
}

/* ===== Transition ===== */
.fade-enter-active, .fade-leave-active{
  transition: opacity .22s ease, transform .22s ease;
}
.fade-enter-from, .fade-leave-to{
  opacity: 0;
  transform: translateY(10px);
}

/* ===== Top strip ===== */
.footer-top{
  background: var(--soft);
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
  padding: 18px 0;
}
.footer-top__inner{
  display:flex;
  align-items:center;
  justify-content: space-between;
  gap: 18px;
}

/* Newsletter */
.newsletter{
  display:flex;
  align-items:center;
  gap: 14px;
}
.newsletter__icon{
  width: 46px;
  height: 46px;
  background: var(--brand);
  color: var(--white);
  border-radius: var(--radius-md);
  display:grid;
  place-items:center;
  box-shadow: var(--shadow-sm);
}
.newsletter__icon svg{ width: 22px; height: 22px; }

.newsletter__content{ display:flex; flex-direction:column; gap:4px; }
.newsletter__title{
  margin:0;
  font-size: 15px;
  font-weight: 900;
}
.newsletter__text{
  margin:0;
  font-size: 13px;
  color: var(--muted);
  font-weight: 700;
}

.newsletter__form{
  display:flex;
  align-items:center;
  gap: 8px;
  margin-right: 8px;
}
.newsletter__input{
  width: 320px;
  padding: 12px 14px;
  border-radius: 999px;
  border: 2px solid #e7e7e7;
  background: var(--white);
  font-weight: 800;
  outline: none;
}
.newsletter__input:focus{
  border-color: rgba(140,21,21,.55);
  box-shadow: 0 0 0 4px rgba(140,21,21,.14);
}
.newsletter__btn{
  border: 0;
  background: var(--brand);
  color: var(--white);
  border-radius: 999px;
  padding: 12px 16px;
  font-weight: 900;
  cursor: pointer;
  display:flex;
  align-items:center;
  gap: 8px;
  box-shadow: var(--shadow-sm);
  transition: transform .16s ease, background .16s ease;
}
.newsletter__btn:hover{
  transform: translateY(-1px);
  background: #a31a1a;
}
.newsletter__btn svg{ width: 16px; height:16px; }

/* Social */
.social{
  display:flex;
  align-items:center;
  gap: 12px;
}
.social__label{
  font-size: 13px;
  color: var(--muted);
  font-weight: 900;
}
.social__links{
  display:flex;
  gap: 8px;
}
.social__btn{
  width: 44px;
  height: 44px;
  border-radius: 12px;
  border: 1px solid #dedede;
  background: var(--white);
  display:grid;
  place-items:center;
  position: relative;
  text-decoration: none;
  box-shadow: var(--shadow-sm);
  transition: transform .16s ease, border-color .16s ease, background .16s ease;
}
.social__btn:hover{
  transform: translateY(-2px);
  background: var(--brand);
  border-color: rgba(140,21,21,.6);
}
.ico{ width: 20px; height: 20px; fill: #444; }
.social__btn:hover .ico{ fill: #fff; }
.tip{
  position:absolute;
  bottom: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%);
  background: #111;
  color: #fff;
  font-size: 12px;
  padding: 6px 10px;
  border-radius: 10px;
  opacity: 0;
  pointer-events:none;
  transition: opacity .14s ease;
  white-space: nowrap;
}
.social__btn:hover .tip{ opacity: 1; }

/* ===== Main ===== */
.footer-main{
  background: var(--white);
  padding: 34px 0;
  border-bottom: 1px solid var(--line);
}
.footer-main__inner{
  display:grid;
  grid-template-columns: 1fr 280px;
  gap: 32px;
  align-items:start;
}

/* Grid of columns */
.footer-grid{
  display:grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 22px;
}
.col{ padding-left: 8px; }
.col__title{
  margin:0 0 12px;
  color: var(--brand);
  font-size: 13px;
  font-weight: 1000;
  letter-spacing: .02em;
}
.links{
  display:flex;
  flex-direction:column;
  gap: 6px;
}
.link{
  color: #111;
  text-decoration: none;
  font-weight: 800;
  font-size: 14px;
  padding: 6px 0;
  position: relative;
  transition: transform .16s ease, color .16s ease;
}
.link::after{
  content:"";
  position:absolute;
  right: 0;
  bottom: 4px;
  height: 2px;
  width: 0%;
  background: var(--brand);
  transition: width .22s ease;
}
.link:hover{
  color: var(--brand);
  transform: translateX(-3px);
}
.link:hover::after{ width: 70%; }

/* Language mini section */
.lang{
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid #efefef;
}
.lang__label{
  display:block;
  font-size: 12px;
  font-weight: 900;
  color: var(--muted);
  margin-bottom: 8px;
}
.lang__buttons{
  display:flex;
  gap: 8px;
  flex-wrap: wrap;
}
.langBtn{
  border: 1px solid #e6e6e6;
  background: var(--soft2);
  border-radius: 999px;
  padding: 6px 12px;
  font-weight: 900;
  cursor: pointer;
  transition: background .16s ease, border-color .16s ease, transform .16s ease;
}
.langBtn:hover{
  transform: translateY(-1px);
  border-color: #d7d7d7;
}
.langBtn.active{
  background: var(--brand);
  color: #fff;
  border-color: rgba(140,21,21,.7);
}

/* Actions (right buttons) */
.actions{
  border: 1px solid var(--line);
  background: var(--soft2);
  border-radius: var(--radius-lg);
  padding: 18px;
  box-shadow: var(--shadow-sm);
}
.actionBtn{
  width: 100%;
  height: 44px;
  border-radius: 2px; /* Stanford-like */
  border: 1px solid #bdbdbd;
  background: #fff;
  font-weight: 900;
  cursor: pointer;
  margin-bottom: 10px;
  display:grid;
  place-items:center;
  text-decoration:none;
  color:#222;
  transition: transform .14s ease, box-shadow .14s ease, border-color .14s ease;
}
.actionBtn:hover{
  transform: translateY(-2px);
  border-color: rgba(140,21,21,.45);
  box-shadow: var(--shadow-md);
}
.actionBtn--dark{
  background: #111;
  color:#fff;
  border-color: #111;
}
.actionBtn--dark:hover{
  background:#000;
  border-color:#000;
}

/* ===== Bottom bar ===== */
.footer-bottom{
  background: var(--brand);
  color: #fff;
  padding: 26px 0 18px;
}
.footer-bottom__inner{
  display:grid;
  grid-template-columns: 360px 1fr;
  gap: 18px;
  align-items:start;
}
.brand{
  display:flex;
  align-items:flex-start;
  gap: 12px;
}
.brand__mark{
  width: 56px;
  height: 56px;
}
.brand__text{ display:flex; flex-direction:column; gap: 6px; }
.brand__name{
  font-family: Georgia, "Times New Roman", serif;
  font-size: 22px;
  font-weight: 1000;
  line-height: 1.1;
}
.brand__loc{
  color: rgba(255,255,255,.86);
  font-weight: 900;
  font-size: 13px;
}

.bottomLinks{
  display:flex;
  flex-wrap: wrap;
  gap: 12px 18px;
  align-items:center;
  padding-top: 6px;
}
.bLink{
  color: rgba(255,255,255,.92);
  text-decoration:none;
  font-weight: 900;
  border-bottom: 2px solid transparent;
  padding-bottom: 2px;
  transition: border-color .14s ease, color .14s ease;
}
.bLink:hover{
  color:#fff;
  border-bottom-color: rgba(255,255,255,.6);
}
.dot{
  color: rgba(255,255,255,.40);
  font-weight: 900;
}
.copyRow{
  grid-column: 1 / -1;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid rgba(255,255,255,.16);
  color: rgba(255,255,255,.86);
  font-weight: 800;
  font-size: 13px;
}

/* Back to top */
.backToTop{
  position: fixed;
  bottom: 22px;
  left: 22px;
  width: 48px;
  height: 48px;
  border-radius: 999px;
  border: 1px solid #e8e8e8;
  background: #fff;
  color: #444;
  display:grid;
  place-items:center;
  box-shadow: var(--shadow-md);
  cursor: pointer;
  transition: transform .16s ease, background .16s ease, border-color .16s ease;
  z-index: 999;
}
.backToTop:hover{
  transform: translateY(-3px);
  background: var(--brand);
  border-color: rgba(140,21,21,.7);
  color:#fff;
}
.backToTop svg{ width: 22px; height: 22px; }
</style>
