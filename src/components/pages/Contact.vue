<template>
  <main id="main-content" class="su-contact" :dir="lang.dir">

    <header class="su-hero">
      <div class="su-hero__bg"
        :class="{ 'su-hero__bg--fallback': !heroImgUrl }"
        :style="heroImgUrl ? { backgroundImage: `url(${heroImgUrl})` } : {}">
      </div>
      <div class="su-hero__overlay"></div>

      <div class="su-container su-hero__content">
        <p class="su-hero__kicker">
          <span class="su-hero__kicker-dot"></span>
          {{ lang.t('contact.heroKicker') || 'Contact Us' }}
        </p>
        <h1 class="su-hero__title">
          <span v-if="contact">{{ heroTitle }}</span>
          <span v-else class="su-hero__title-skel"></span>
        </h1>
        <p class="su-hero__sub">{{ activeContent?.subtitle || lang.t('contact.heroSub') }}</p>
        
        <div class="su-hero__stats">
          <div class="su-stat" v-if="activeContent?.workingHours">
            <span class="su-stat__label">{{ lang.t('contact.workHours') }}</span>
            <span class="su-stat__value">{{ activeContent.workingHours }}</span>
          </div>
          <div class="su-stat" v-if="contact?.phone">
            <span class="su-stat__label">{{ lang.t('contact.phone') }}</span>
            <span class="su-stat__value" dir="ltr">{{ contact.phone }}</span>
          </div>
        </div>
      </div>
    </header>

    <section class="su-section">
      <div class="su-container">
        <div class="su-layout">

          <div class="su-card" v-if="!submitted">
            <div class="su-card__header">
              <h2 class="su-card__title">{{ lang.t('contact.formTitle') }}</h2>
              <p class="su-card__sub">{{ lang.t('contact.formSub') }}</p>
            </div>
            
            <form class="su-form" @submit.prevent="submitForm">
              <div class="su-form-row">
                <div class="su-field">
                  <label class="su-label">{{ lang.t('contact.nameLabel') }}</label>
                  <input v-model.trim="form.name" class="su-input" type="text" :placeholder="lang.t('contact.namePlaceholder')" />
                  <span v-if="errors.name" class="su-err">{{ errors.name }}</span>
                </div>
                <div class="su-field">
                  <label class="su-label">{{ lang.t('contact.emailLabel') }}</label>
                  <input v-model.trim="form.email" class="su-input" type="email" :placeholder="lang.t('contact.emailPlaceholder')" />
                  <span v-if="errors.email" class="su-err">{{ errors.email }}</span>
                </div>
              </div>
              
              <div class="su-form-row">
                <div class="su-field">
                  <label class="su-label">{{ lang.t('contact.subjectLabel') }}</label>
                  <input v-model.trim="form.subject" class="su-input" type="text" :placeholder="lang.t('contact.subjectPlaceholder')" />
                  <span v-if="errors.subject" class="su-err">{{ errors.subject }}</span>
                </div>
                <div class="su-field">
                  <label class="su-label">{{ lang.t('contact.topicLabel') }}</label>
                  <div class="su-select-wrap">
                    <select v-model="form.topic" class="su-input">
                      <option value="GENERAL">{{ lang.t('contact.topicGeneral') || 'General Inquiry' }}</option>
                      <option value="SERVICE">{{ lang.t('contact.topicService') || 'Services' }}</option>
                      <option value="PROJECT">{{ lang.t('contact.topicProject') || 'Projects' }}</option>
                      <option value="PARTNERSHIP">{{ lang.t('contact.topicPartnership') || 'Partnership' }}</option>
                    </select>
                    <svg class="su-select-chev" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg>
                  </div>
                </div>
              </div>
              
              <div class="su-field">
                <label class="su-label">{{ lang.t('contact.messageLabel') }}</label>
                <textarea v-model.trim="form.message" class="su-textarea" rows="6" :placeholder="lang.t('contact.messagePlaceholder')"></textarea>
                <span v-if="errors.message" class="su-err">{{ errors.message }}</span>
              </div>
              
              <div v-if="sendError" class="su-send-error">{{ sendError }}</div>
              
              <div class="su-form-actions">
                <button class="su-btn" type="submit" :disabled="sending">
                  <Transition name="swap" mode="out-in">
                    <span v-if="sending" key="s" class="btn-inner">
                      <span class="btn-spinner"></span>{{ lang.t('contact.sending') }}
                    </span>
                    <span v-else key="i" class="btn-inner">
                      {{ lang.t('contact.sendBtn') }}
                    </span>
                  </Transition>
                </button>
                <button class="su-btn su-btn--ghost" type="button" @click="resetForm">{{ lang.t('contact.resetBtn') }}</button>
              </div>
            </form>
          </div>

          <div class="su-card su-success" v-else>
            <div class="su-success__inner">
              <div class="su-success-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <h2 class="su-card__title">{{ lang.t('contact.successTitle') }}</h2>
              <p class="su-card__sub">{{ lang.t('contact.successMsg') }}</p>
              <button class="su-btn" @click="submitted = false; resetForm()">{{ lang.t('contact.sendAnother') }}</button>
            </div>
          </div>

          <aside class="su-side">

            <div class="su-panel">
              <span class="su-kicker">{{ lang.t('contact.infoTitle') || 'Contact Information' }}</span>

              <div v-if="loading" class="su-shimmer-group">
                <div class="su-shimmer"></div>
                <div class="su-shimmer su-shimmer--sm"></div>
                <div class="su-shimmer su-shimmer--sm"></div>
              </div>

              <div v-else class="su-info-list">
                <div class="su-info-row" v-if="activeContent?.address">
                  <span class="su-info-label">{{ lang.t('contact.location') }}</span>
                  <b class="su-info-value">{{ activeContent.address }}</b>
                </div>
                <div class="su-info-row" v-if="contact?.email">
                  <span class="su-info-label">{{ lang.t('contact.email') }}</span>
                  <a :href="`mailto:${contact.email}`" class="su-info-link" dir="ltr">{{ contact.email }}</a>
                </div>
                <div class="su-info-row" v-if="contact?.phone">
                  <span class="su-info-label">{{ lang.t('contact.phone') }}</span>
                  <a :href="`tel:${contact.phone}`" class="su-info-link" dir="ltr">{{ contact.phone }}</a>
                </div>
                <div class="su-info-row" v-if="contact?.secondaryPhone">
                  <span class="su-info-label"></span>
                  <a :href="`tel:${contact.secondaryPhone}`" class="su-info-link su-info-link--dim" dir="ltr">{{ contact.secondaryPhone }}</a>
                </div>
                <div class="su-info-row" v-if="activeContent?.workingHours">
                  <span class="su-info-label">{{ lang.t('contact.workHours') }}</span>
                  <b class="su-info-value">{{ activeContent.workingHours }}</b>
                </div>
              </div>
            </div>

            <div class="su-panel su-panel--map">
              <h3 class="su-panel__map-title">
                {{ lang.t('contact.mapTitle') || 'Location Map' }}
              </h3>

              <div class="su-map-embed">
                <div v-if="loading" class="su-map-state">
                  <div class="su-shimmer su-shimmer--map"></div>
                </div>

                <iframe
                  v-else-if="finalMapUrl"
                  :src="finalMapUrl"
                  class="su-map-iframe"
                  allowfullscreen loading="lazy"
                  referrerpolicy="no-referrer-when-downgrade"
                ></iframe>

                <div v-else-if="contact?.latitude && contact?.longitude" class="su-map-latlng">
                  <p class="su-map-coords" dir="ltr">
                    {{ contact.latitude }}, {{ contact.longitude }}
                  </p>
                  <a :href="mapsHref" target="_blank" rel="noopener noreferrer" class="su-btn">
                    {{ lang.t('contact.openMaps') || 'Open in Maps' }}
                  </a>
                </div>

                <div v-else class="su-map-state su-map-state--empty">
                  <span>{{ lang.t('contact.noMap') || 'Map not available' }}</span>
                </div>
              </div>
            </div>

          </aside>
        </div>
      </div>
    </section>

  </main>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from 'vue'
import { useLanguageStore } from '@/stores/useLanguageStore'
import api from '@/api'
import { API_BASE_URL } from '../consts'

const lang = useLanguageStore()
const API_ROOT = API_BASE_URL.replace('/api/v1', '')

const contact = ref(null)
const loading  = ref(true)

const activeContent = computed(() => {
  if (!contact.value) return null
  const l = lang.current || 'ckb'
  return l === 'ckb'
    ? (contact.value.ckbContent || contact.value.kmrContent)
    : (contact.value.kmrContent || contact.value.ckbContent)
})

const heroTitle = computed(() => activeContent.value?.title || lang.t('contact.heroTitle'))

const heroImgUrl = computed(() => {
  if (!contact.value?.heroImageUrl) return null;
  if (contact.value.heroImageUrl.startsWith('http')) return contact.value.heroImageUrl;
  return `${API_ROOT}${contact.value.heroImageUrl.startsWith('/') ? '' : '/'}${contact.value.heroImageUrl}`;
})

// ─── NEW SMART MAP EXTRACTOR ────────────────────────────────────
// Detects if you pasted a whole <iframe src="..."> HTML string and extracts just the link safely.
const finalMapUrl = computed(() => {
  let val = contact.value?.mapEmbedUrl;
  if (!val) return null;

  // If the user pasted the entire HTML iframe tag instead of just the link:
  if (val.includes('<iframe') && val.includes('src=')) {
    const match = val.match(/src=["'](.*?)["']/);
    if (match && match[1]) {
      val = match[1]; // Extract just the URL
    }
  }
  return val;
})

const mapsHref = computed(() => {
  const c = contact.value
  if (c?.latitude && c?.longitude) return `https://www.google.com/maps/search/?api=1&query=${c.latitude},${c.longitude}`
  if (finalMapUrl.value) return finalMapUrl.value
  return '#'
})

async function loadContact() {
  loading.value = true
  try {
    const { data } = await api.get('/api/v1/contact/active')
    const list = data?.data ?? data
    contact.value = Array.isArray(list) && list.length ? list[0] : null
  } catch (e) { console.error(e) }
  finally { loading.value = false }
}

const form = reactive({ name: '', email: '', subject: '', topic: 'GENERAL', message: '' })
const errors = reactive({ name: '', email: '', subject: '', message: '' })
const sending = ref(false)
const submitted = ref(false)
const sendError = ref('')

function validateEmail(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e) }
function clearErrors() { errors.name=''; errors.email=''; errors.subject=''; errors.message=''; sendError.value='' }

async function submitForm() {
  clearErrors()
  if (!form.name)    errors.name    = lang.t('contact.errorName') || 'Required'
  if (!form.email)   errors.email   = lang.t('contact.errorEmail') || 'Required'
  else if (!validateEmail(form.email)) errors.email = lang.t('contact.errorEmailInvalid') || 'Invalid Email'
  if (!form.subject) errors.subject = lang.t('contact.errorSubject') || 'Required'
  if (!form.message || form.message.length < 10) errors.message = lang.t('contact.errorMessage') || 'Message too short'
  
  if (errors.name || errors.email || errors.subject || errors.message) return
  
  sending.value = true
  try {
    await api.post('/api/contact', { name:form.name, email:form.email, subject:form.subject, topic:form.topic, message:form.message })
    submitted.value = true
    resetForm()
  } catch { 
    sendError.value = lang.t('contact.errorSend') || 'Failed to send message. Please try again.' 
  } finally  { 
    sending.value = false 
  }
}

function resetForm() { 
  form.name=''; form.email=''; form.subject=''; form.topic='GENERAL'; form.message=''; 
  clearErrors() 
}

onMounted(loadContact)
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;0,8..60,600;0,8..60,700;0,8..60,900;1,8..60,300&family=Source+Sans+3:wght@300;400;600;700&display=swap');

.su-contact {
  /* Stanford Brand Palette */
  --cardinal: #8C1515;
  --cardinal-dark: #6f1111;
  --black: #2E2D29;
  --sandstone: #F4F4F2;
  --fog: #DAD8D2;
  --warm-grey: #767571;
  --gold: #C9AA71;
  --line: #D1CFC9;

  --serif: 'Source Serif 4', Georgia, serif;
  --sans: 'Source Sans 3', 'Helvetica Neue', Arial, sans-serif;
  --max-w: 1200px;

  background: #ffffff;
  color: var(--black);
  min-height: 100vh;
  font-family: var(--sans);
  line-height: 1.6;
}

.su-container {
  max-width: var(--max-w);
  margin: 0 auto;
  padding: 0 clamp(20px, 4vw, 52px);
}

/* ── Hero ──────────────────────────────────────────── */
.su-hero {
  position: relative;
  min-height: 50vh;
  display: flex;
  align-items: center;
  background: var(--black);
  overflow: hidden;
  padding: 120px 0 80px;
}

.su-hero__bg {
  position: absolute; inset: 0;
  background-size: cover; background-position: center;
}
.su-hero__bg--fallback {
  background: linear-gradient(135deg, var(--cardinal-dark) 0%, var(--black) 100%);
}

.su-hero__overlay {
  position: absolute; inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 100%);
}

.su-hero__content {
  position: relative;
  z-index: 2;
  color: #fff;
  width: 100%;
}

.su-hero__kicker {
  display: inline-flex; align-items: center; gap: 8px;
  font-family: var(--sans); font-weight: 700; font-size: 0.85rem;
  text-transform: uppercase; letter-spacing: 0.15em;
  color: var(--fog); margin-bottom: 20px;
}
.su-hero__kicker-dot { width: 6px; height: 6px; background: var(--gold); }

.su-hero__title {
  font-family: var(--serif);
  font-size: clamp(2.8rem, 6vw, 4.5rem);
  font-weight: 900;
  line-height: 1.05;
  margin: 0 0 20px;
  letter-spacing: -0.02em;
}

.su-hero__title-skel {
  display: inline-block; width: 300px; height: 60px;
  background: rgba(255,255,255,0.1);
}

.su-hero__sub {
  font-family: var(--serif);
  font-size: clamp(1.2rem, 2vw, 1.4rem);
  font-weight: 300;
  color: var(--fog);
  max-width: 800px;
  margin-bottom: 40px;
}

.su-hero__stats {
  display: flex; gap: 20px; flex-wrap: wrap;
}

.su-stat {
  background: rgba(255,255,255,0.05);
  border-left: 2px solid var(--cardinal);
  padding: 15px 20px;
  backdrop-filter: blur(5px);
}
.su-stat__label { display: block; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--fog); margin-bottom: 5px; }
.su-stat__value { display: block; font-family: var(--serif); font-size: 1.4rem; font-weight: 700; color: #fff; }

/* ── Content Grid ──────────────────────────────────── */
.su-section {
  padding: 80px 0;
  background: #ffffff;
}

.su-layout {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 60px;
  align-items: start;
}

/* ── Form Card ─────────────────────────────────────── */
.su-card {
  background: var(--sandstone);
  padding: 50px;
}

.su-card__header { margin-bottom: 30px; }
.su-card__title { font-family: var(--serif); font-size: 2.2rem; font-weight: 700; margin: 0 0 10px; color: var(--black); }
.su-card__sub { color: var(--warm-grey); font-size: 1.05rem; margin: 0; }

.su-form { display: grid; gap: 20px; }
.su-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }

.su-field { display: flex; flex-direction: column; gap: 8px; }
.su-label { font-family: var(--sans); font-weight: 700; font-size: 0.9rem; color: var(--black); }

.su-input, .su-textarea {
  font-family: var(--sans);
  font-size: 1rem;
  padding: 14px 16px;
  border: 1px solid var(--line);
  background: #fff;
  border-radius: 0; 
  color: var(--black);
  transition: border-color 0.2s, box-shadow 0.2s;
  width: 100%;
  box-sizing: border-box;
}
.su-input:focus, .su-textarea:focus {
  outline: none;
  border-color: var(--cardinal);
  box-shadow: inset 2px 0 0 var(--cardinal);
}

.su-select-wrap { position: relative; }
.su-select-wrap .su-input { appearance: none; padding-right: 40px; cursor: pointer; }
.su-select-chev { position: absolute; right: 16px; top: 50%; transform: translateY(-50%); pointer-events: none; color: var(--black); }

.su-err { color: var(--cardinal); font-size: 0.85rem; font-weight: 600; }
.su-send-error { background: var(--cardinal); color: #fff; padding: 15px; font-weight: 600; font-size: 0.9rem; }

.su-form-actions { display: flex; gap: 15px; margin-top: 10px; }

/* Buttons */
.su-btn {
  display: inline-block;
  background: var(--cardinal);
  color: #fff;
  padding: 14px 28px;
  font-family: var(--sans);
  font-weight: 700;
  border: 1px solid var(--cardinal);
  border-radius: 0;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  text-align: center;
}
.su-btn:hover:not(:disabled) { background: var(--cardinal-dark); border-color: var(--cardinal-dark); }
.su-btn:disabled { opacity: 0.6; cursor: not-allowed; }

.su-btn--ghost { background: transparent; color: var(--cardinal); border-color: var(--cardinal); }
.su-btn--ghost:hover { background: var(--cardinal); color: #fff; }

.btn-inner { display: inline-flex; align-items: center; gap: 8px; }
.btn-spinner { width: 14px; height: 14px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; animation: spin 0.8s linear infinite; }

/* Success State */
.su-success { text-align: center; padding: 80px 40px; }
.su-success-icon { color: var(--cardinal); margin-bottom: 20px; }
.su-success-icon svg { width: 48px; height: 48px; }

/* ── Side Panels ───────────────────────────────────── */
.su-side { display: grid; gap: 40px; }

.su-panel { border-top: 3px solid var(--cardinal); padding-top: 20px; }

.su-kicker { font-family: var(--sans); font-weight: 700; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--warm-grey); display: block; margin-bottom: 25px; }

.su-info-list { display: grid; gap: 15px; }
.su-info-row { display: flex; flex-direction: column; gap: 5px; padding-bottom: 15px; border-bottom: 1px solid var(--line); }
.su-info-row:last-child { border-bottom: none; }
.su-info-label { font-size: 0.85rem; font-weight: 700; color: var(--warm-grey); text-transform: uppercase; letter-spacing: 0.05em; }
.su-info-value { font-family: var(--serif); font-size: 1.1rem; color: var(--black); }
.su-info-link { font-family: var(--sans); font-size: 1.1rem; color: var(--cardinal); text-decoration: none; font-weight: 600; }
.su-info-link:hover { text-decoration: underline; }
.su-info-link--dim { color: var(--warm-grey); font-weight: 400; }

/* ── Map Panel FIX ─────────────────────────────────── */
.su-panel__map-title { font-family: var(--serif); font-size: 1.4rem; font-weight: 700; margin: 0 0 20px; }

.su-map-embed { 
  background: var(--sandstone); 
  height: 350px; /* Made taller */
  width: 100%;
  position: relative;
  display: flex; 
  align-items: center; 
  justify-content: center; 
  border: 1px solid var(--line); 
}
.su-map-iframe {
  position: absolute;
  top: 0; left: 0;
  width: 100%;
  height: 100%;
  border: none;
}

.su-map-latlng { display: flex; flex-direction: column; align-items: center; gap: 15px; z-index: 2;}
.su-map-coords { font-family: monospace; color: var(--warm-grey); font-size: 0.9rem; margin: 0;}
.su-map-state { color: var(--warm-grey); font-weight: 700; z-index: 2;}

/* Shimmers */
.su-shimmer-group { display: grid; gap: 15px; }
.su-shimmer { height: 20px; background: var(--line); animation: pulse 1.5s infinite; }
.su-shimmer--sm { width: 60%; }
.su-shimmer--map { width: 100%; height: 100%; }

@keyframes spin { 100% { transform: rotate(360deg); } }
@keyframes pulse { 50% { opacity: 0.5; } }

/* ── Responsive ────────────────────────────────────── */
@media (max-width: 992px) {
  .su-layout { grid-template-columns: 1fr; gap: 50px; }
  .su-card { padding: 30px 20px; }
}
@media (max-width: 600px) {
  .su-form-row { grid-template-columns: 1fr; }
  .su-hero__stats { flex-direction: column; gap: 10px; }
  .su-stat { border-left: none; border-top: 2px solid var(--cardinal); }
}
</style>