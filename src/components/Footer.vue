<template>
  <footer class="khi-footer" role="contentinfo" :dir="lang.dir" :class="{ 'khi-footer--ltr': lang.isKMR }">

    <!-- ═══════════════════════════════════ HERITAGE BANNER ═══ -->
    <div class="heritage-banner">
      <div class="heritage-banner__deco" aria-hidden="true">
        <span class="hb-line" /><span class="hb-diamond">◆</span><span class="hb-line" />
      </div>
      <div class="heritage-banner__inner container">
        <div class="heritage-banner__text">
          <p class="heritage-banner__kicker">{{ lang.t('footer.donateTitle') }}</p>
          <h2 class="heritage-banner__title">
            <span class="hb-word hb-word--light">{{ lang.isKMR ? 'Mîrateya' : 'میراتی' }}</span>
            <span class="hb-word hb-word--gold">{{ lang.isKMR ? 'Kurdî' : 'کوردی' }}</span>
          </h2>
          <p class="heritage-banner__sub">{{ lang.t('footer.donateText') }}</p>
        </div>
        <div class="heritage-banner__actions">
          <RouterLink class="donate-btn" to="/contact">
            <span class="donate-btn__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            </span>
            {{ lang.t('footer.donateBtn') }}
          </RouterLink>
          <RouterLink class="submit-btn" to="/contact">
            {{ lang.t('footer.submitProject') }}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </RouterLink>
        </div>
      </div>
      <!-- Ornamental geometric overlay -->
      <div class="heritage-banner__geo" aria-hidden="true">
        <svg viewBox="0 0 200 200" class="geo-svg"><polygon points="100,10 190,55 190,145 100,190 10,145 10,55" fill="none" stroke="rgba(198,146,42,0.18)" stroke-width="1"/><polygon points="100,30 170,65 170,135 100,170 30,135 30,65" fill="none" stroke="rgba(198,146,42,0.12)" stroke-width="1"/><circle cx="100" cy="100" r="48" fill="none" stroke="rgba(198,146,42,0.10)" stroke-width="1"/></svg>
      </div>
    </div>

    <!-- ═══════════════════════════════════ NEWSLETTER + SOCIAL ═══ -->
    <div class="comms-row">
      <div class="container comms-row__inner">

        <div class="newsletter-block">
          <div class="newsletter-block__head">
            <div class="nl-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            </div>
            <div>
              <h4 class="nl-title">{{ lang.t('footer.newsletterTitle') }}</h4>
              <p class="nl-sub">{{ lang.t('footer.newsletterText') }}</p>
            </div>
          </div>
          <form class="nl-form" @submit.prevent="subscribeNewsletter" novalidate>
            <div class="nl-form__wrap">
              <input
                class="nl-form__input"
                type="email"
                :placeholder="lang.t('footer.newsletterPlaceholder')"
                v-model.trim="email"
                :aria-label="lang.t('footer.newsletterTitle')"
                required
              />
              <button type="submit" class="nl-form__btn" :disabled="subscribed">
                <template v-if="!subscribed">
                  <span>{{ lang.t('footer.subscribe') }}</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </template>
                <template v-else>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                </template>
              </button>
            </div>
          </form>
        </div>

        <div class="social-block">
          <span class="social-block__label">{{ lang.t('footer.socialLabel') }}</span>
          <div class="social-block__links" dir="ltr">
            <a class="s-btn" href="#" @click.prevent aria-label="Facebook">
              <svg viewBox="0 0 24 24" class="s-ico"><path d="M14 8h2V5h-2c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h2.4l.6-3H13V9c0-.6.4-1 1-1z"/></svg>
            </a>
            <a class="s-btn" href="#" @click.prevent aria-label="Instagram">
              <svg viewBox="0 0 24 24" class="s-ico"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm10 2H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3zm-5 4.5A5.5 5.5 0 1 1 6.5 14 5.5 5.5 0 0 1 12 8.5zm0 2A3.5 3.5 0 1 0 15.5 14 3.5 3.5 0 0 0 12 10.5zM18 6.8a1.2 1.2 0 1 1-1.2-1.2A1.2 1.2 0 0 1 18 6.8z"/></svg>
            </a>
            <a class="s-btn" href="#" @click.prevent aria-label="YouTube">
              <svg viewBox="0 0 24 24" class="s-ico"><path d="M21.8 8.1a3 3 0 0 0-2.1-2.1C17.9 5.5 12 5.5 12 5.5s-5.9 0-7.7.5A3 3 0 0 0 2.2 8.1 31.4 31.4 0 0 0 2 12a31.4 31.4 0 0 0 .2 3.9 3 3 0 0 0 2.1 2.1c1.8.5 7.7.5 7.7.5s5.9 0 7.7-.5a3 3 0 0 0 2.1-2.1A31.4 31.4 0 0 0 22 12a31.4 31.4 0 0 0-.2-3.9zM10 15.5v-7l6 3.5-6 3.5z"/></svg>
            </a>
            <a class="s-btn" href="#" @click.prevent aria-label="X / Twitter">
              <svg viewBox="0 0 24 24" class="s-ico"><path d="M18.9 3H21l-6.6 7.5L22 21h-6.2l-4.8-6.3L5.6 21H3.5l7.1-8.1L2 3h6.3l4.3 5.7L18.9 3zm-1.1 16h1.2L7.1 4.9H5.8L17.8 19z"/></svg>
            </a>
          </div>
        </div>

      </div>
    </div>

    <!-- ═══════════════════════════════════ DIVIDER ═══ -->
    <div class="footer-rule" aria-hidden="true">
      <div class="container footer-rule__inner">
        <span class="footer-rule__line" />
        <span class="footer-rule__ornament">✦</span>
        <span class="footer-rule__line" />
      </div>
    </div>

    <!-- ═══════════════════════════════════ MAIN COLUMNS ═══ -->
    <div class="footer-main">
      <div class="container footer-main__inner">

        <!-- Brand Column -->
        <div class="brand-col">
          <RouterLink to="/" class="brand-col__logo">
            <div class="brand-col__mark" aria-hidden="true">
              <svg viewBox="0 0 52 52" fill="none">
                <rect width="52" height="52" rx="13" fill="rgba(198,146,42,0.14)"/>
                <circle cx="26" cy="26" r="10" fill="#C6922A" opacity="0.9"/>
                <path d="M26 8L28 14H24L26 8Z" fill="#C6922A"/>
                <path d="M26 44L24 38H28L26 44Z" fill="#C6922A"/>
                <path d="M8 26L14 24V28L8 26Z" fill="#C6922A"/>
                <path d="M44 26L38 28V24L44 26Z" fill="#C6922A"/>
                <path d="M13.5 13.5L18.5 17L16 19.5L13.5 13.5Z" fill="rgba(198,146,42,0.6)"/>
                <path d="M38.5 38.5L33.5 35L36 32.5L38.5 38.5Z" fill="rgba(198,146,42,0.6)"/>
              </svg>
            </div>
            <div class="brand-col__name">{{ projectName }}</div>
          </RouterLink>
          <p class="brand-col__tagline">{{ lang.isKMR ? 'Navendeke taybetî ya parastina mîrateya çandî ya Kurdî' : 'ناوەندێکی تایبەتی بۆ پاراستنی میراتی کلتووری کوردی' }}</p>
          <div class="brand-col__contact">
            <a :href="`mailto:${emailText}`" class="contact-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              {{ emailText }}
            </a>
            <a :href="`tel:${phoneText}`" class="contact-item" dir="ltr">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38 2 2 0 0 1 3.58 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.55a16 16 0 0 0 6.29 6.29l.54-.54a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              {{ phoneText }}
            </a>
          </div>

          <!-- Language Switcher in brand col -->
          <div class="brand-col__lang">
            <span class="lang-lbl">{{ lang.t('footer.language') }}</span>
            <div class="lang-pills">
              <button
                v-for="d in dialects" :key="d.code"
                class="lang-pill"
                :class="{ 'lang-pill--active': lang.activeLang === d.code }"
                @click="lang.setLanguage(d.code)"
                type="button"
              >{{ d.label }}</button>
            </div>
          </div>
        </div>

        <!-- Nav Columns -->
        <nav class="nav-cols" aria-label="Footer navigation">
          <div class="nav-col">
            <h4 class="nav-col__title">
              <span class="nav-col__dot" />
              {{ lang.t('footer.projectsTitle') }}
            </h4>
            <ul class="nav-col__links" role="list">
              <li><RouterLink class="nav-link" to="/projects">{{ lang.t('footer.allProjects') }}</RouterLink></li>
              <li><RouterLink class="nav-link" to="/projects">{{ lang.t('footer.ongoing') }}</RouterLink></li>
              <li><RouterLink class="nav-link" to="/projects">{{ lang.t('footer.completed') }}</RouterLink></li>
            </ul>
          </div>

          <div class="nav-col">
            <h4 class="nav-col__title">
              <span class="nav-col__dot" />
              {{ lang.t('footer.publishmentsTitle') }}
            </h4>
            <ul class="nav-col__links" role="list">
              <li><RouterLink class="nav-link" to="/publishments">{{ lang.t('footer.allPublishments') }}</RouterLink></li>
              <li><RouterLink class="nav-link" to="/publishments">{{ lang.t('footer.writings') }}</RouterLink></li>
              <li><RouterLink class="nav-link" to="/publishments">{{ lang.t('footer.sounds') }}</RouterLink></li>
              <li><RouterLink class="nav-link" to="/publishments">{{ lang.t('footer.videos') }}</RouterLink></li>
            </ul>
          </div>

          <div class="nav-col">
            <h4 class="nav-col__title">
              <span class="nav-col__dot" />
              {{ lang.t('footer.servicesTitle') }}
            </h4>
            <ul class="nav-col__links" role="list">
              <li><RouterLink class="nav-link" to="/services">{{ lang.t('footer.allServices') }}</RouterLink></li>
              <li><RouterLink class="nav-link" to="/services">{{ lang.t('footer.studio') }}</RouterLink></li>
              <li><RouterLink class="nav-link" to="/services">{{ lang.t('footer.print') }}</RouterLink></li>
              <li><RouterLink class="nav-link" to="/library">{{ lang.t('nav.library') }}</RouterLink></li>
              <li><RouterLink class="nav-link" to="/archive">{{ lang.t('nav.archive') }}</RouterLink></li>
            </ul>
          </div>

          <div class="nav-col">
            <h4 class="nav-col__title">
              <span class="nav-col__dot" />
              {{ lang.t('footer.aboutTitle') }}
            </h4>
            <ul class="nav-col__links" role="list">
              <li><RouterLink class="nav-link" to="/about">{{ lang.t('footer.aboutUs') }}</RouterLink></li>
              <li><RouterLink class="nav-link" to="/about">{{ lang.t('footer.team') }}</RouterLink></li>
              <li><RouterLink class="nav-link" to="/about">{{ lang.t('footer.vision') }}</RouterLink></li>
              <li><RouterLink class="nav-link" to="/contact">{{ lang.t('footer.contactUs') }}</RouterLink></li>
            </ul>
          </div>
        </nav>

      </div>
    </div>

    <!-- ═══════════════════════════════════ BOTTOM BAR ═══ -->
    <div class="footer-bottom">
      <div class="container footer-bottom__inner">

        <div class="bottom-left">
          <span class="copy-text">© {{ year }} {{ projectName }}</span>
          <span class="copy-sep" aria-hidden="true">·</span>
          <span class="copy-text">{{ lang.t('footer.copyright') }}</span>
          <span class="copy-sep" aria-hidden="true">·</span>
          <span class="copy-loc">{{ lang.t('footer.locationText') }}</span>
        </div>

        <div class="bottom-links" dir="ltr">
          <a class="bl" href="#">{{ lang.t('footer.privacy') }}</a>
          <span class="bl-sep" aria-hidden="true">·</span>
          <a class="bl" href="#">{{ lang.t('footer.terms') }}</a>
        </div>

      </div>
    </div>

    <!-- ═══════════════════════════════════ BACK TO TOP ═══ -->
    <Transition name="btt-fade">
      <button
        v-if="showBTT"
        class="back-to-top"
        @click="scrollTop"
        :aria-label="lang.t('ui.close')"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M18 15l-6-6-6 6"/></svg>
      </button>
    </Transition>

  </footer>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useLanguageStore } from '@/stores/useLanguageStore'

const lang = useLanguageStore()

const projectName = 'پەیمانگای کەلەپووری کوردی'
const emailText   = 'info@kurdheritage.org'
const phoneText   = '+964 770 123 4567'
const year        = computed(() => new Date().getFullYear())
const dialects    = [{ code: 'CKB', label: 'کوردی' }, { code: 'KMR', label: 'Kurdî' }]

// Newsletter
const email     = ref('')
const subscribed = ref(false)
function subscribeNewsletter() {
  if (!email.value) return
  subscribed.value = true
  email.value = ''
  setTimeout(() => { subscribed.value = false }, 4000)
}

// Back-to-top
const showBTT = ref(false)
function onScroll()  { showBTT.value = window.scrollY > 500 }
function scrollTop() { window.scrollTo({ top: 0, behavior: 'smooth' }) }
onMounted(()   => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<style scoped>
/* ═══════════════════════════════════════════════════════════════════
   KHI FOOTER — DARK ARCHIVE LUXURY
   Brand palette: --ruby #8C1515 | --gold #C6922A | --teal #0D7377
   ═══════════════════════════════════════════════════════════════════ */

.khi-footer {
  --ruby:    #8C1515;
  --ruby-dk: #6B0F0F;
  --ruby-lt: #B83A4B;
  --gold:    #C6922A;
  --gold-lt: #E8B84B;
  --gold-dk: #9E7420;
  --teal:    #0D7377;
  --teal-lt: #14A3A8;

  --ink:     #F5F2EE;
  --ink-2:   rgba(245,242,238,.72);
  --ink-3:   rgba(245,242,238,.44);
  --ink-4:   rgba(245,242,238,.22);

  --bg-1:    #0E0C0C;
  --bg-2:    #141010;
  --bg-3:    #1A1414;
  --bg-stripe: rgba(198,146,42,.04);

  --container: 1280px;
  --r-sm: 8px;
  --r-md: 12px;
  --r-lg: 18px;

  background: var(--bg-1);
  color: var(--ink);
  font-family: 'Noto Sans Arabic', 'Noto Kufi Arabic', 'Source Sans 3', system-ui, sans-serif;
  position: relative;
  overflow: hidden;
}

/* Subtle noise-texture overlay */
.khi-footer::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 39px,
      var(--bg-stripe) 39px,
      var(--bg-stripe) 40px
    );
  pointer-events: none;
  z-index: 0;
}

.container {
  max-width: var(--container);
  margin: 0 auto;
  padding: 0 28px;
  position: relative;
  z-index: 1;
}

/* ─── TRANSITIONS ──────────────────────────────────────────── */
.btt-fade-enter-active,
.btt-fade-leave-active { transition: opacity .25s ease, transform .25s ease; }
.btt-fade-enter-from,
.btt-fade-leave-to     { opacity: 0; transform: translateY(12px); }

/* ══════════════════════════════════════════════════════════════
   HERITAGE BANNER
   ══════════════════════════════════════════════════════════════ */
.heritage-banner {
  background: linear-gradient(135deg, var(--ruby-dk) 0%, var(--ruby) 50%, #A31A1A 100%);
  padding: 56px 0 52px;
  position: relative;
  overflow: hidden;
}

/* Side glow effects */
.heritage-banner::before {
  content: '';
  position: absolute;
  inset-inline-start: -80px;
  top: -80px;
  width: 340px;
  height: 340px;
  background: radial-gradient(ellipse, rgba(198,146,42,.28) 0%, transparent 70%);
  pointer-events: none;
}
.heritage-banner::after {
  content: '';
  position: absolute;
  inset-inline-end: -60px;
  bottom: -60px;
  width: 280px;
  height: 280px;
  background: radial-gradient(ellipse, rgba(198,146,42,.18) 0%, transparent 70%);
  pointer-events: none;
}

.heritage-banner__deco {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-bottom: 28px;
  position: relative;
  z-index: 1;
}
.hb-line {
  display: block;
  height: 1px;
  width: 80px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.35), transparent);
}
.hb-diamond {
  color: var(--gold-lt);
  font-size: 10px;
  letter-spacing: 2px;
}

.heritage-banner__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 40px;
  flex-wrap: wrap;
  position: relative;
  z-index: 1;
}

.heritage-banner__text { flex: 1; min-width: 260px; }

.heritage-banner__kicker {
  margin: 0 0 10px;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: .16em;
  text-transform: uppercase;
  color: rgba(255,255,255,.65);
}

.heritage-banner__title {
  margin: 0 0 14px;
  font-family: Georgia, 'Noto Serif', serif;
  font-size: clamp(2rem, 4vw, 3rem);
  line-height: 1.1;
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}
.hb-word { display: block; }
.hb-word--light { color: rgba(255,255,255,.95); }
.hb-word--gold  { color: var(--gold-lt); }

.heritage-banner__sub {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: rgba(255,255,255,.72);
  max-width: 420px;
  line-height: 1.65;
}

.heritage-banner__actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 220px;
}

.donate-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 15px 28px;
  border-radius: var(--r-lg);
  background: linear-gradient(135deg, var(--gold-dk), var(--gold-lt));
  color: #fff;
  font-weight: 900;
  font-size: 15px;
  text-decoration: none;
  box-shadow: 0 6px 24px rgba(198,146,42,.45), inset 0 1px 0 rgba(255,255,255,.22);
  transition: transform .2s ease, box-shadow .2s ease;
  letter-spacing: .01em;
}
.donate-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 36px rgba(198,146,42,.55), inset 0 1px 0 rgba(255,255,255,.25);
}
.donate-btn__icon { width: 20px; height: 20px; flex-shrink: 0; }
.donate-btn__icon svg { width: 100%; height: 100%; }

.submit-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 13px 24px;
  border-radius: var(--r-lg);
  background: rgba(255,255,255,.1);
  color: rgba(255,255,255,.92);
  font-weight: 800;
  font-size: 14px;
  text-decoration: none;
  border: 1px solid rgba(255,255,255,.2);
  backdrop-filter: blur(8px);
  transition: background .2s ease, transform .2s ease, border-color .2s ease;
}
.submit-btn:hover {
  background: rgba(255,255,255,.17);
  border-color: rgba(255,255,255,.38);
  transform: translateY(-2px);
}
.submit-btn svg { width: 15px; height: 15px; }

.heritage-banner__geo {
  position: absolute;
  inset-inline-end: 80px;
  top: 50%;
  transform: translateY(-50%);
  width: 200px;
  height: 200px;
  opacity: .7;
  pointer-events: none;
}
.geo-svg { width: 100%; height: 100%; }

/* ══════════════════════════════════════════════════════════════
   COMMS ROW (Newsletter + Social)
   ══════════════════════════════════════════════════════════════ */
.comms-row {
  background: var(--bg-2);
  border-bottom: 1px solid var(--ink-4);
  padding: 30px 0;
}

.comms-row__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
  flex-wrap: wrap;
}

/* Newsletter block */
.newsletter-block { display: flex; flex-direction: column; gap: 14px; }

.newsletter-block__head {
  display: flex;
  align-items: center;
  gap: 12px;
}

.nl-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--ruby), var(--ruby-lt));
  display: grid;
  place-items: center;
  flex-shrink: 0;
  box-shadow: 0 4px 14px rgba(140,21,21,.4);
}
.nl-icon svg { width: 20px; height: 20px; color: #fff; }

.nl-title {
  margin: 0;
  font-size: 15px;
  font-weight: 900;
  color: var(--ink);
}
.nl-sub {
  margin: 2px 0 0;
  font-size: 12.5px;
  color: var(--ink-3);
  font-weight: 600;
}

.nl-form__wrap {
  display: flex;
  background: rgba(255,255,255,.07);
  border: 1px solid var(--ink-4);
  border-radius: 999px;
  overflow: hidden;
  transition: border-color .2s ease, box-shadow .2s ease;
}
.nl-form__wrap:focus-within {
  border-color: rgba(198,146,42,.5);
  box-shadow: 0 0 0 3px rgba(198,146,42,.14);
}

.nl-form__input {
  flex: 1;
  padding: 11px 18px;
  background: transparent;
  border: none;
  outline: none;
  color: var(--ink);
  font-size: 14px;
  font-weight: 600;
  min-width: 220px;
}
.nl-form__input::placeholder { color: var(--ink-3); }

.nl-form__btn {
  flex-shrink: 0;
  padding: 10px 18px;
  background: linear-gradient(135deg, var(--gold-dk), var(--gold));
  border: none;
  border-radius: 999px;
  color: #fff;
  font-weight: 900;
  font-size: 13.5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 3px;
  transition: background .2s ease, transform .18s ease;
}
.nl-form__btn:hover:not(:disabled) {
  background: linear-gradient(135deg, var(--gold), var(--gold-lt));
  transform: scale(1.02);
}
.nl-form__btn:disabled {
  background: linear-gradient(135deg, var(--teal), var(--teal-lt));
  cursor: default;
}
.nl-form__btn svg { width: 14px; height: 14px; }

/* Social block */
.social-block {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-shrink: 0;
}

.social-block__label {
  font-size: 12px;
  font-weight: 900;
  letter-spacing: .1em;
  text-transform: uppercase;
  color: var(--ink-3);
}

.social-block__links { display: flex; gap: 8px; }

.s-btn {
  width: 46px;
  height: 46px;
  border-radius: 12px;
  background: rgba(255,255,255,.06);
  border: 1px solid var(--ink-4);
  display: grid;
  place-items: center;
  text-decoration: none;
  transition: background .2s ease, border-color .2s ease, transform .2s ease;
}
.s-btn:hover {
  background: var(--ruby);
  border-color: var(--ruby);
  transform: translateY(-3px);
}
.s-ico { width: 20px; height: 20px; fill: var(--ink-2); }
.s-btn:hover .s-ico { fill: #fff; }

/* ══════════════════════════════════════════════════════════════
   ORNAMENTAL RULE
   ══════════════════════════════════════════════════════════════ */
.footer-rule { padding: 20px 0 0; }
.footer-rule__inner {
  display: flex;
  align-items: center;
  gap: 16px;
}
.footer-rule__line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--ink-4) 30%, var(--ink-4) 70%, transparent);
}
.footer-rule__ornament {
  color: var(--gold);
  font-size: 11px;
  opacity: .6;
}

/* ══════════════════════════════════════════════════════════════
   MAIN COLUMNS
   ══════════════════════════════════════════════════════════════ */
.footer-main { padding: 40px 0 44px; }

.footer-main__inner {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 48px;
  align-items: start;
}

/* ── Brand Column ── */
.brand-col { display: flex; flex-direction: column; gap: 18px; }

.brand-col__logo {
  display: flex;
  align-items: center;
  gap: 14px;
  text-decoration: none;
}

.brand-col__mark { width: 52px; height: 52px; flex-shrink: 0; }
.brand-col__mark svg { width: 100%; height: 100%; }

.brand-col__name {
  font-family: Georgia, 'Noto Serif', serif;
  font-size: 18px;
  font-weight: 700;
  color: var(--ink);
  line-height: 1.2;
}

.brand-col__tagline {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  color: var(--ink-3);
  line-height: 1.7;
}

.brand-col__contact { display: flex; flex-direction: column; gap: 8px; }

.contact-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--ink-2);
  font-size: 13px;
  font-weight: 700;
  text-decoration: none;
  transition: color .18s ease;
}
.contact-item:hover { color: var(--gold-lt); }
.contact-item svg { width: 14px; height: 14px; flex-shrink: 0; opacity: .65; }

/* Language pills */
.brand-col__lang {
  padding-top: 14px;
  border-top: 1px solid var(--ink-4);
}
.lang-lbl {
  display: block;
  font-size: 11px;
  font-weight: 900;
  letter-spacing: .1em;
  text-transform: uppercase;
  color: var(--ink-3);
  margin-bottom: 10px;
}
.lang-pills { display: flex; gap: 8px; }
.lang-pill {
  padding: 6px 16px;
  border-radius: 999px;
  border: 1px solid var(--ink-4);
  background: transparent;
  color: var(--ink-2);
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
  transition: all .18s ease;
}
.lang-pill:hover { border-color: var(--gold); color: var(--gold-lt); }
.lang-pill--active {
  background: linear-gradient(135deg, var(--ruby-dk), var(--ruby));
  border-color: transparent;
  color: #fff;
  box-shadow: 0 3px 12px rgba(140,21,21,.4);
}

/* ── Nav Columns ── */
.nav-cols {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.nav-col__title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 16px;
  font-size: 11px;
  font-weight: 900;
  letter-spacing: .12em;
  text-transform: uppercase;
  color: var(--gold);
}
.nav-col__dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--gold);
  flex-shrink: 0;
}

.nav-col__links {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-link {
  display: block;
  padding: 6px 0;
  color: var(--ink-2);
  font-size: 14px;
  font-weight: 700;
  text-decoration: none;
  position: relative;
  transition: color .18s ease, padding-inline-start .2s ease;
}
.nav-link::before {
  content: '';
  position: absolute;
  inset-block: 0;
  inset-inline-start: -10px;
  width: 2px;
  background: var(--gold);
  border-radius: 2px;
  transform: scaleY(0);
  transform-origin: top;
  transition: transform .22s cubic-bezier(.16, 1, .3, 1);
}
.nav-link:hover {
  color: var(--gold-lt);
  padding-inline-start: 6px;
}
.nav-link:hover::before { transform: scaleY(1); }
.khi-footer--ltr .nav-link { padding-inline-start: 0; }

/* ══════════════════════════════════════════════════════════════
   BOTTOM BAR
   ══════════════════════════════════════════════════════════════ */
.footer-bottom {
  background: var(--bg-3);
  border-top: 1px solid var(--ink-4);
  padding: 18px 0;
}

.footer-bottom__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}

.bottom-left {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.copy-text, .copy-loc {
  font-size: 12.5px;
  font-weight: 700;
  color: var(--ink-3);
}
.copy-sep { color: var(--ink-4); font-size: 13px; }
.copy-loc { color: var(--ink-4); }

.bottom-links { display: flex; align-items: center; gap: 10px; }
.bl {
  font-size: 12.5px;
  font-weight: 700;
  color: var(--ink-3);
  text-decoration: none;
  transition: color .18s ease;
}
.bl:hover { color: var(--gold-lt); }
.bl-sep { color: var(--ink-4); }

/* ══════════════════════════════════════════════════════════════
   BACK TO TOP
   ══════════════════════════════════════════════════════════════ */
.back-to-top {
  position: fixed;
  bottom: 28px;
  inset-inline-start: 28px;
  width: 50px;
  height: 50px;
  border-radius: 999px;
  background: linear-gradient(135deg, var(--ruby-dk), var(--ruby));
  border: none;
  color: #fff;
  display: grid;
  place-items: center;
  cursor: pointer;
  box-shadow: 0 6px 24px rgba(140,21,21,.5), 0 2px 6px rgba(0,0,0,.4);
  z-index: 999;
  transition: transform .2s ease, box-shadow .2s ease;
}
.back-to-top:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 36px rgba(140,21,21,.6);
}
.back-to-top svg { width: 22px; height: 22px; }

/* ══════════════════════════════════════════════════════════════
   RESPONSIVE
   ══════════════════════════════════════════════════════════════ */
@media (max-width: 1024px) {
  .footer-main__inner { grid-template-columns: 1fr; }
  .nav-cols { grid-template-columns: repeat(2, 1fr); }
  .heritage-banner__geo { display: none; }
}

@media (max-width: 700px) {
  .nav-cols { grid-template-columns: repeat(2, 1fr); }
  .heritage-banner__inner { flex-direction: column; align-items: stretch; }
  .heritage-banner__actions { flex-direction: row; flex-wrap: wrap; }
  .donate-btn, .submit-btn { flex: 1; }
  .comms-row__inner { flex-direction: column; align-items: stretch; }
  .social-block { flex-wrap: wrap; }
  .nl-form__input { min-width: 0; }
  .footer-bottom__inner { flex-direction: column; align-items: flex-start; }
}

@media (max-width: 460px) {
  .nav-cols { grid-template-columns: 1fr; }
  .container { padding: 0 18px; }
}
</style>