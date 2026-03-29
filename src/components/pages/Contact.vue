<template>
  <main id="main-content" class="contact" :dir="lang.dir">

    <!-- ══════════════════════════════════════════
         HERO
    ══════════════════════════════════════════ -->
    <header class="hero">
      <div class="hero__bg"
        :class="{ 'hero__bg--fallback': !contact?.heroImageUrl }"
        :style="contact?.heroImageUrl ? { backgroundImage: `url(${contact.heroImageUrl})` } : {}">
      </div>
      <div class="hero__overlay"></div>
      <div class="hero__grain"></div>

      <span class="hero__c hero__c--tl"></span>
      <span class="hero__c hero__c--tr"></span>
      <span class="hero__c hero__c--bl"></span>
      <span class="hero__c hero__c--br"></span>

      <div class="container hero__content">
        <p class="hero__kicker">
          <span class="hero__kicker-dot"></span>
          {{ lang.t('contact.heroKicker') }}
        </p>
        <h1 class="hero__title">
          <span v-if="contact">{{ heroTitle }}</span>
          <span v-else class="hero__title-skel"></span>
        </h1>
        <p class="hero__sub">{{ lang.t('contact.heroSub') }}</p>
        <div class="hero__stats">
          <div class="stat" v-if="activeContent?.workingHours">
            <span class="stat__label">{{ lang.t('contact.workHours') }}</span>
            <span class="stat__value">{{ activeContent.workingHours }}</span>
          </div>
          <div class="stat" v-if="contact?.phone">
            <span class="stat__label">{{ lang.t('contact.phone') }}</span>
            <span class="stat__value" dir="ltr">{{ contact.phone }}</span>
          </div>
        </div>
      </div>
    </header>

    <!-- ══════════════════════════════════════════
         CONTENT
    ══════════════════════════════════════════ -->
    <section class="section">
      <div class="container">
        <div class="layout">

          <!-- LEFT: FORM -->
          <div class="card" v-if="!submitted">
            <div class="card__top">
              <h2 class="card__title">{{ lang.t('contact.formTitle') }}</h2>
              <p class="card__sub">{{ lang.t('contact.formSub') }}</p>
            </div>
            <form class="form" @submit.prevent="submitForm">
              <div class="row">
                <div class="field">
                  <label class="label">{{ lang.t('contact.nameLabel') }}</label>
                  <input v-model.trim="form.name" class="input" type="text" :placeholder="lang.t('contact.namePlaceholder')" />
                  <span v-if="errors.name" class="err">{{ errors.name }}</span>
                </div>
                <div class="field">
                  <label class="label">{{ lang.t('contact.emailLabel') }}</label>
                  <input v-model.trim="form.email" class="input" type="email" :placeholder="lang.t('contact.emailPlaceholder')" />
                  <span v-if="errors.email" class="err">{{ errors.email }}</span>
                </div>
              </div>
              <div class="row">
                <div class="field">
                  <label class="label">{{ lang.t('contact.subjectLabel') }}</label>
                  <input v-model.trim="form.subject" class="input" type="text" :placeholder="lang.t('contact.subjectPlaceholder')" />
                  <span v-if="errors.subject" class="err">{{ errors.subject }}</span>
                </div>
                <div class="field">
                  <label class="label">{{ lang.t('contact.topicLabel') }}</label>
                  <div class="select-wrap">
                    <select v-model="form.topic" class="input">
                      <option value="GENERAL">{{ lang.t('contact.topicGeneral') }}</option>
                      <option value="SERVICE">{{ lang.t('contact.topicService') }}</option>
                      <option value="PROJECT">{{ lang.t('contact.topicProject') }}</option>
                      <option value="PUBLICATION">{{ lang.t('contact.topicPublication') }}</option>
                      <option value="PARTNERSHIP">{{ lang.t('contact.topicPartnership') }}</option>
                    </select>
                    <svg class="select-wrap__chev" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg>
                  </div>
                </div>
              </div>
              <div class="field">
                <label class="label">{{ lang.t('contact.messageLabel') }}</label>
                <textarea v-model.trim="form.message" class="textarea" rows="7" :placeholder="lang.t('contact.messagePlaceholder')"></textarea>
                <span v-if="errors.message" class="err">{{ errors.message }}</span>
              </div>
              <div v-if="sendError" class="send-error">{{ sendError }}</div>
              <div class="row row--actions">
                <button class="btnX btnX--primary" type="submit" :disabled="sending">
                  <Transition name="swap" mode="out-in">
                    <span v-if="sending" key="s" class="btn-inner">
                      <span class="btn-spinner"></span>{{ lang.t('contact.sending') }}
                    </span>
                    <span v-else key="i" class="btn-inner">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                      {{ lang.t('contact.sendBtn') }}
                    </span>
                  </Transition>
                </button>
                <button class="btnX" type="button" @click="resetForm">{{ lang.t('contact.resetBtn') }}</button>
              </div>
            </form>
          </div>

          <!-- SUCCESS STATE -->
          <div class="card success-card" v-else>
            <div class="success-card__inner">
              <div class="success-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <h2 class="card__title">{{ lang.t('contact.successTitle') }}</h2>
              <p class="card__sub">{{ lang.t('contact.successMsg') }}</p>
              <button class="btnX btnX--primary" @click="submitted = false; resetForm()">{{ lang.t('contact.sendAnother') }}</button>
            </div>
          </div>

          <!-- RIGHT: INFO + MAP -->
          <aside class="side">

            <!-- Info panel -->
            <div class="panel">
              <span class="kicker">{{ lang.t('contact.infoTitle') }}</span>

              <!-- shimmer while loading -->
              <div v-if="loading" class="info-loading">
                <div class="shimmer"></div>
                <div class="shimmer shimmer--sm"></div>
                <div class="shimmer shimmer--sm"></div>
                <div class="shimmer shimmer--sm"></div>
              </div>

              <div v-else class="info">
                <div class="info__row" v-if="activeContent?.address">
                  <span class="info__label">{{ lang.t('contact.location') }}</span>
                  <b class="info__value">{{ activeContent.address }}</b>
                </div>
                <div class="info__row" v-if="contact?.email">
                  <span class="info__label">{{ lang.t('contact.email') }}</span>
                  <a :href="`mailto:${contact.email}`" class="info__value info__value--link" dir="ltr">{{ contact.email }}</a>
                </div>
                <div class="info__row" v-if="contact?.phone">
                  <span class="info__label">{{ lang.t('contact.phone') }}</span>
                  <a :href="`tel:${contact.phone}`" class="info__value info__value--link" dir="ltr">{{ contact.phone }}</a>
                </div>
                <div class="info__row" v-if="contact?.secondaryPhone">
                  <span class="info__label"></span>
                  <a :href="`tel:${contact.secondaryPhone}`" class="info__value info__value--link info__value--dim" dir="ltr">{{ contact.secondaryPhone }}</a>
                </div>
                <div class="info__row" v-if="activeContent?.workingHours">
                  <span class="info__label">{{ lang.t('contact.workHours') }}</span>
                  <b class="info__value">{{ activeContent.workingHours }}</b>
                </div>
              </div>

              <div class="actions" v-if="!loading && contact">
                <a v-if="contact.phone" :href="`tel:${contact.phone}`" class="btnX btnX--primary">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.1 1.22 2 2 0 012.1 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z"/></svg>
                  {{ lang.t('contact.phone') }}
                </a>
                <a v-if="contact.email" :href="`mailto:${contact.email}`" class="btnX">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  {{ lang.t('contact.email') }}
                </a>
              </div>
            </div>

            <!-- Map panel -->
            <div class="panel panel--map">
              <h3 class="panel__map-title">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>
                {{ lang.t('contact.mapTitle') }}
              </h3>

              <div class="map-embed">
                <!-- loading shimmer -->
                <div v-if="loading" class="map-state">
                  <div class="shimmer shimmer--map"></div>
                </div>

                <!-- proper embed URL (/maps/embed?pb=...) — safe to iframe -->
                <iframe
                  v-else-if="isEmbeddable"
                  :src="contact.mapEmbedUrl"
                  width="100%" height="260" style="border:0;"
                  allowfullscreen loading="lazy"
                  referrerpolicy="no-referrer-when-downgrade"
                ></iframe>

                <!-- non-embeddable URL (short link / plain maps URL) or lat/lng only -->
                <div v-else-if="contact?.mapEmbedUrl || (contact?.latitude && contact?.longitude)" class="map-latlng">
                  <div class="map-latlng__pin">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  </div>
                  <p class="map-latlng__coords" dir="ltr" v-if="contact?.latitude && contact?.longitude">{{ contact.latitude }}, {{ contact.longitude }}</p>
                  <a :href="mapsHref" target="_blank" rel="noopener noreferrer" class="map-latlng__btn">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                    {{ lang.t('contact.openMaps') }}
                  </a>
                </div>

                <!-- nothing configured -->
                <div v-else class="map-state map-state--empty">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>
                  <span>{{ lang.t('contact.noMap') }}</span>
                </div>
              </div>

              <!-- open-in-maps strip (shown only when a real iframe is embedded) -->
              <a
                v-if="!loading && isEmbeddable"
                :href="mapsHref"
                target="_blank" rel="noopener noreferrer"
                class="map-open-row"
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                {{ lang.t('contact.openMaps') }}
              </a>
            </div>

          </aside>
        </div>
      </div>
    </section>

    <button class="toTop" @click="scrollTop" aria-label="Back to top">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 15l-6-6-6 6"/></svg>
    </button>

  </main>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from 'vue'
import { useLanguageStore } from '@/stores/useLanguageStore'
import api from '@/api'

const lang = useLanguageStore()

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

// Only proper /maps/embed?pb=... URLs can be iframed.
// Short links (maps.app.goo.gl) and plain /maps URLs block embedding.
const isEmbeddable = computed(() => {
  const url = contact.value?.mapEmbedUrl
  if (!url) return false
  try {
    const u = new URL(url)
    return u.hostname.includes('google.com') && u.pathname.includes('/maps/embed')
  } catch { return false }
})

// Best href for "Open in Maps" button
const mapsHref = computed(() => {
  const c = contact.value
  if (c?.latitude && c?.longitude) return `https://www.google.com/maps?q=${c.latitude},${c.longitude}`
  if (c?.mapEmbedUrl) return c.mapEmbedUrl
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

function scrollTop() { window.scrollTo({ top: 0, behavior: 'smooth' }) }
function validateEmail(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e) }
function clearErrors() { errors.name=''; errors.email=''; errors.subject=''; errors.message=''; sendError.value='' }

async function submitForm() {
  clearErrors()
  if (!form.name)    errors.name    = lang.t('contact.errorName')
  if (!form.email)   errors.email   = lang.t('contact.errorEmail')
  else if (!validateEmail(form.email)) errors.email = lang.t('contact.errorEmailInvalid')
  if (!form.subject) errors.subject = lang.t('contact.errorSubject')
  if (!form.message || form.message.length < 10) errors.message = lang.t('contact.errorMessage')
  if (errors.name || errors.email || errors.subject || errors.message) return
  sending.value = true
  try {
    await api.post('/api/contact', { name:form.name, email:form.email, subject:form.subject, topic:form.topic, message:form.message })
    submitted.value = true; resetForm()
  } catch { sendError.value = lang.t('contact.errorSend') }
  finally  { sending.value = false }
}

function resetForm() { form.name=''; form.email=''; form.subject=''; form.topic='GENERAL'; form.message=''; clearErrors() }

onMounted(loadContact)
</script>

<style scoped>
.contact {
  --brand:   #8C1515; --brand-d: #6a0f0f;
  --gold:    #C8A800;
  --bg:      #fff; --cream: #FAF8F3;
  --text:    #2E2D29; --muted: #5f6368;
  --border:  rgba(0,0,0,.10); --border-s: rgba(0,0,0,.06);
  --shadow:  0 18px 54px rgba(0,0,0,.14);
  --shadow2: 0 4px 20px rgba(0,0,0,.08);
  --shadow3: 0 10px 32px rgba(0,0,0,.11);
  --container: 1200px;
  --ease: cubic-bezier(.4,0,.2,1);
  --spring: cubic-bezier(.16,1,.3,1);
  background: var(--bg); color: var(--text); min-height: 100vh;
  font-family: 'Noto Naskh Arabic', 'Tajawal', Georgia, serif;
}
.container { max-width: var(--container); margin: 0 auto; padding: 0 22px; }

/* ── Hero ──────────────────────────────────────────── */
.hero { position: relative; min-height: 58vh; overflow: hidden; display: grid; place-items: center; }
.hero__bg {
  position: absolute; inset: 0;
  background-size: cover; background-position: center 35%;
  animation: heroZoom 22s ease-in-out infinite alternate;
}
.hero__bg--fallback {
  background:
    radial-gradient(ellipse 100% 55% at 65% 0%, #8C1515 0%, transparent 55%),
    radial-gradient(ellipse 55% 80% at 0% 100%, #3a0808 0%, transparent 60%),
    linear-gradient(160deg, #1a0404 0%, #6a0f0f 50%, #2e0808 100%);
}
@keyframes heroZoom { from{transform:scale(1.02)} to{transform:scale(1.07) translateY(-8px)} }

.hero__overlay {
  position: absolute; inset: 0;
  background: linear-gradient(180deg, rgba(0,0,0,.62) 0%, rgba(0,0,0,.22) 50%, rgba(0,0,0,.58) 100%);
}
.hero__grain {
  position: absolute; inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
  background-size: 180px; opacity: .028; mix-blend-mode: overlay; pointer-events: none;
}
.hero__c { position:absolute; width:20px; height:20px; border-color:rgba(200,168,0,.55); border-style:solid; pointer-events:none; }
.hero__c--tl { top:28px; right:28px; border-width:2px 0 0 2px; }
.hero__c--tr { top:28px; left:28px;  border-width:2px 2px 0 0; }
.hero__c--bl { bottom:28px; right:28px; border-width:0 0 2px 2px; }
.hero__c--br { bottom:28px; left:28px;  border-width:0 2px 2px 0; }

.hero__content { position:relative; z-index:2; padding-top:140px; padding-bottom:52px; color:#fff; width:100%; }

.hero__kicker {
  display:inline-flex; align-items:center; gap:.5rem;
  margin:0 0 12px; letter-spacing:.15em; text-transform:uppercase;
  font-weight:800; font-size:11px; color:rgba(255,255,255,.65);
  animation: fadeUp .5s .1s var(--ease) both;
}
.hero__kicker-dot { width:6px; height:6px; border-radius:50%; background:var(--gold); box-shadow:0 0 8px var(--gold); flex-shrink:0; }

.hero__title {
  font-family: Georgia,'Times New Roman',serif;
  font-weight:900; font-size:clamp(2.4rem,6vw,4.2rem); line-height:1.06;
  margin:0 0 14px; animation:fadeUp .6s .2s var(--ease) both;
}
.hero__title-skel { display:inline-block; width:320px; height:52px; border-radius:10px; background:rgba(255,255,255,.1); animation:pulse 1.6s ease infinite; }

.hero__sub {
  margin:0 0 22px; max-width:64ch; color:rgba(255,255,255,.82);
  font-size:clamp(.92rem,1.8vw,1.1rem); line-height:1.7;
  animation:fadeUp .6s .3s var(--ease) both;
}

.hero__stats { display:flex; gap:10px; flex-wrap:wrap; animation:fadeUp .6s .4s var(--ease) both; }
.stat { background:rgba(255,255,255,.12); border:1px solid rgba(255,255,255,.2); border-radius:14px; padding:10px 14px; backdrop-filter:blur(10px); }
.stat__label { display:block; font-size:11px; opacity:.8; margin-bottom:3px; letter-spacing:.04em; }
.stat__value { display:block; font-weight:900; font-size:17px; }

/* ── Section ───────────────────────────────────────── */
.section { padding:28px 0 64px; background:var(--cream); }
.layout { display:grid; grid-template-columns:1.4fr 1fr; gap:18px; }
@media(max-width:820px){.layout{grid-template-columns:1fr;}}

/* ── Card ──────────────────────────────────────────── */
.card {
  border:1px solid var(--border); background:#fff;
  border-radius:22px; box-shadow:var(--shadow3); overflow:hidden;
  animation:cardRise .6s var(--spring) both;
}
.card__top { padding:20px 20px 14px; border-bottom:1px solid var(--border-s); background:linear-gradient(180deg,#FAFAF9 0%,#fff 100%); }
.card__title { margin:0; font-family:Georgia,'Times New Roman',serif; font-weight:900; font-size:24px; color:var(--text); }
.card__sub { margin:8px 0 0; color:var(--muted); font-size:.92rem; line-height:1.6; }

.form { padding:18px 20px; display:grid; gap:14px; }
.row { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
.row--actions { grid-template-columns:auto auto 1fr; align-items:center; gap:10px; }
@media(max-width:600px){.row{grid-template-columns:1fr;}.row--actions{grid-template-columns:1fr 1fr;}}

.field { display:grid; gap:7px; }
.label { font-weight:800; color:var(--text); font-size:.86rem; }

.input {
  border:1.5px solid rgba(0,0,0,.12); background:#FAFAF9;
  border-radius:12px; padding:.72rem .9rem;
  outline:none; font:inherit; font-size:.9rem; color:var(--text);
  transition:border-color .18s, box-shadow .18s, background .18s;
  width:100%; box-sizing:border-box;
}
.input::placeholder { color:#bbb8b3; }
.input:focus { border-color:var(--brand); background:#fff; box-shadow:0 0 0 3px rgba(140,21,21,.09); }

.textarea {
  border:1.5px solid rgba(0,0,0,.12); background:#FAFAF9;
  border-radius:12px; padding:.72rem .9rem;
  outline:none; resize:vertical; font:inherit; font-size:.9rem;
  color:var(--text); line-height:1.7;
  transition:border-color .18s, box-shadow .18s;
  width:100%; box-sizing:border-box;
}
.textarea::placeholder { color:#bbb8b3; }
.textarea:focus { border-color:var(--brand); background:#fff; box-shadow:0 0 0 3px rgba(140,21,21,.09); }

.select-wrap { position:relative; }
.select-wrap .input { appearance:none; cursor:pointer; padding-inline-end:2rem; }
.select-wrap__chev { position:absolute; inset-inline-end:.75rem; top:50%; transform:translateY(-50%); color:var(--muted); pointer-events:none; }

.err { color:var(--brand); font-weight:800; font-size:.78rem; }
.send-error { background:#FFF0F0; color:#CC2936; padding:10px 14px; border-radius:10px; font-size:.82rem; font-weight:700; border:1px solid #F5C6C8; }

/* ── Success ───────────────────────────────────────── */
.success-card { display:flex; align-items:center; justify-content:center; min-height:440px; }
.success-card__inner { text-align:center; padding:40px; }
.success-icon { width:72px; height:72px; border-radius:50%; background:#ecfdf5; border:2px solid #6ee7b7; display:flex; align-items:center; justify-content:center; color:#065f46; margin:0 auto 18px; box-shadow:0 0 0 8px rgba(110,231,183,.1); }

/* ── Side ──────────────────────────────────────────── */
.side { display:grid; gap:18px; }

.panel { border:1px solid var(--border); background:#fff; border-radius:22px; padding:16px; box-shadow:var(--shadow2); animation:cardRise .6s .1s var(--spring) both; }
.panel--map { padding:0; overflow:hidden; }
.panel__map-title { display:flex; align-items:center; gap:.5rem; margin:0; padding:13px 16px; font-weight:900; font-size:.88rem; border-bottom:1px solid var(--border-s); color:var(--text); }

.kicker { display:inline-flex; border-radius:999px; padding:6px 11px; font-weight:900; font-size:11px; background:rgba(140,21,21,.08); border:1px solid rgba(140,21,21,.18); color:#6b0f0f; margin-bottom:12px; letter-spacing:.05em; }

/* shimmer */
.info-loading { display:flex; flex-direction:column; gap:10px; padding-top:4px; }
.shimmer { height:18px; border-radius:8px; background:linear-gradient(90deg,#f0eeeb 25%,#e8e5e1 50%,#f0eeeb 75%); background-size:200% 100%; animation:shimmer 1.4s ease infinite; }
.shimmer--sm { height:14px; width:72%; }
.shimmer--map { height:260px; border-radius:0; }
@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

.info { display:grid; gap:0; }
.info__row { display:flex; justify-content:space-between; align-items:flex-start; padding:10px 0; border-top:1px solid var(--border-s); gap:8px; }
.info__row:first-child { border-top:none; }
.info__label { color:var(--muted); font-weight:700; font-size:.85rem; flex-shrink:0; }
.info__value { font-weight:800; font-size:.88rem; text-align:end; }
.info__value--link { color:var(--brand); text-decoration:none; transition:opacity .15s; }
.info__value--link:hover { opacity:.75; }
.info__value--dim { color:var(--muted); font-size:.82rem; }
.actions { display:flex; gap:8px; margin-top:14px; flex-wrap:wrap; }

/* ── Map ───────────────────────────────────────────── */
.map-embed { width:100%; }
.map-embed iframe { display:block; width:100%; }

.map-state { height:260px; display:flex; flex-direction:column; align-items:center; justify-content:center; background:#f5f3ef; }
.map-state--empty { gap:8px; color:var(--muted); font-size:.82rem; font-weight:700; }

.map-latlng { height:260px; background:#f5f3ef; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:10px; color:var(--muted); }
.map-latlng__pin { width:50px; height:50px; border-radius:50%; background:#fef2f2; display:flex; align-items:center; justify-content:center; color:var(--brand); }
.map-latlng__coords { font-size:.76rem; font-family:monospace; color:var(--muted); margin:0; }
.map-latlng__btn { display:inline-flex; align-items:center; gap:.4rem; padding:.6rem 1.1rem; border-radius:99px; background:var(--brand); color:#fff; text-decoration:none; font-weight:800; font-size:.82rem; transition:background .15s, transform .15s; box-shadow:0 6px 18px rgba(140,21,21,.22); }
.map-latlng__btn:hover { background:var(--brand-d); transform:translateY(-2px); }

.map-open-row { display:flex; align-items:center; justify-content:center; gap:.4rem; padding:10px; font-size:.78rem; font-weight:800; color:var(--brand); text-decoration:none; border-top:1px solid var(--border-s); transition:background .15s; }
.map-open-row:hover { background:#fef2f2; }

/* ── Buttons ───────────────────────────────────────── */
.btnX {
  display:inline-flex; align-items:center; justify-content:center; gap:.4rem;
  border:1px solid rgba(0,0,0,.12); background:#fff;
  border-radius:12px; padding:11px 14px;
  font:inherit; font-weight:900; font-size:.9rem; cursor:pointer;
  text-decoration:none; text-align:center;
  transition:transform .16s var(--ease), box-shadow .16s var(--ease), background .16s;
  white-space:nowrap;
}
.btnX:hover:not(:disabled) { transform:translateY(-2px); box-shadow:var(--shadow2); }

.btnX--primary { background:var(--brand); border-color:rgba(140,21,21,.22); color:#fff; box-shadow:0 8px 24px rgba(140,21,21,.22); }
.btnX--primary:hover:not(:disabled) { background:var(--brand-d); box-shadow:0 12px 32px rgba(140,21,21,.30); }
.btnX--primary:disabled { opacity:.65; cursor:not-allowed; box-shadow:none; }

.btn-inner { display:inline-flex; align-items:center; gap:.45rem; }
.btn-spinner { width:14px; height:14px; border-radius:50%; border:2px solid rgba(255,255,255,.3); border-top-color:#fff; animation:spin .7s linear infinite; flex-shrink:0; }

/* ── Back to top ───────────────────────────────────── */
.toTop { position:fixed; bottom:18px; left:18px; width:46px; height:46px; border-radius:999px; border:1px solid rgba(0,0,0,.12); background:#fff; color:var(--muted); cursor:pointer; display:flex; align-items:center; justify-content:center; box-shadow:var(--shadow2); transition:all .18s var(--ease); z-index:2000; }
.toTop:hover { background:var(--brand); color:#fff; border-color:var(--brand); transform:translateY(-3px); }

/* ── Keyframes ─────────────────────────────────────── */
@keyframes fadeUp  { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
@keyframes cardRise{ from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
@keyframes pulse   { 0%,100%{opacity:.35} 50%{opacity:.65} }
@keyframes spin    { to{transform:rotate(360deg)} }

.swap-enter-active { transition:all .2s var(--ease); }
.swap-leave-active { transition:all .12s var(--ease); }
.swap-enter-from,.swap-leave-to { opacity:0; transform:translateY(4px); }

@media(max-width:768px) {
  .hero__title { font-size:36px; }
  .hero__stats { flex-direction:column; gap:8px; }
}
</style>