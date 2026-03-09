<template>
  <main id="main-content" class="contact" :dir="lang.dir">
    <!-- HERO -->
    <header class="hero">
      <div class="hero__bg" :style="{ backgroundImage: `url(${heroImage})` }"></div>
      <div class="hero__overlay"></div>

      <div class="container hero__content">
        <p class="hero__kicker">{{ lang.t('contact.heroKicker') }}</p>
        <h1 class="hero__title">{{ lang.t('contact.heroTitle') }}</h1>
        <p class="hero__sub">{{ lang.t('contact.heroSub') }}</p>

        <div class="hero__stats">
          <div class="stat">
            <span class="stat__label">{{ lang.t('contact.workHours') }}</span>
            <span class="stat__value">{{ lang.t('contact.workHoursValue') }}</span>
          </div>
          <div class="stat">
            <span class="stat__label">{{ lang.t('contact.phone') }}</span>
            <span class="stat__value" dir="ltr">{{ phoneNumber }}</span>
          </div>
        </div>
      </div>
    </header>

    <!-- CONTENT -->
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
                  <select v-model="form.topic" class="input">
                    <option value="GENERAL">{{ lang.t('contact.topicGeneral') }}</option>
                    <option value="SERVICE">{{ lang.t('contact.topicService') }}</option>
                    <option value="PROJECT">{{ lang.t('contact.topicProject') }}</option>
                    <option value="PUBLICATION">{{ lang.t('contact.topicPublication') }}</option>
                    <option value="PARTNERSHIP">{{ lang.t('contact.topicPartnership') }}</option>
                  </select>
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
                  {{ sending ? lang.t('contact.sending') : lang.t('contact.sendBtn') }}
                </button>
                <button class="btnX" type="button" @click="resetForm">{{ lang.t('contact.resetBtn') }}</button>
              </div>
            </form>
          </div>

          <!-- SUCCESS STATE -->
          <div class="card success-card" v-else>
            <div class="success-card__inner">
              <div class="success-icon">✅</div>
              <h2 class="card__title">{{ lang.t('contact.successTitle') }}</h2>
              <p class="card__sub">{{ lang.t('contact.successMsg') }}</p>
              <button class="btnX btnX--primary" @click="submitted = false; resetForm()">{{ lang.t('contact.sendAnother') }}</button>
            </div>
          </div>

          <!-- RIGHT: INFO PANEL -->
          <aside class="side">
            <!-- Contact Info -->
            <div class="panel">
              <span class="kicker">{{ lang.t('contact.infoTitle') }}</span>

              <div class="info">
                <div class="info__row">
                  <span class="info__label">{{ lang.t('contact.location') }}</span>
                  <b class="info__value">{{ lang.t('footer.locationText') }}</b>
                </div>
                <div class="info__row">
                  <span class="info__label">{{ lang.t('contact.email') }}</span>
                  <a :href="`mailto:${emailAddress}`" class="info__value info__value--link">{{ emailAddress }}</a>
                </div>
                <div class="info__row">
                  <span class="info__label">{{ lang.t('contact.phone') }}</span>
                  <a :href="`tel:${phoneNumber}`" class="info__value info__value--link" dir="ltr">{{ phoneNumber }}</a>
                </div>
                <div class="info__row">
                  <span class="info__label">{{ lang.t('contact.workHours') }}</span>
                  <b class="info__value">{{ lang.t('contact.workHoursValue') }}</b>
                </div>
              </div>

              <div class="actions">
                <a :href="`tel:${phoneNumber}`" class="btnX btnX--primary">{{ lang.t('contact.phone') }}</a>
                <a :href="`mailto:${emailAddress}`" class="btnX">{{ lang.t('contact.email') }}</a>
              </div>
            </div>

            <!-- MAP -->
            <div class="panel panel--map">
              <h3 class="panel__map-title">{{ lang.t('contact.mapTitle') }}</h3>
              <div class="map-embed">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3258.0!2d45.4351!3d35.5614!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzXCsDMzJzQxLjAiTiA0NcKwMjYnMDYuNCJF!5e0!3m2!1sen!2siq!4v1"
                  width="100%"
                  height="260"
                  style="border:0;"
                  allowfullscreen=""
                  loading="lazy"
                  referrerpolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>

    <button class="toTop" @click="scrollTop" aria-label="Back to top">↑</button>
  </main>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useLanguageStore } from '@/stores/useLanguageStore'
import api from '@/api'

const lang = useLanguageStore()
const heroImage = 'https://picsum.photos/seed/contactHero/2200/1100'

const phoneNumber = '+964 770 123 4567'
const emailAddress = 'info@kurdheritage.org'

const form = reactive({ name: '', email: '', subject: '', topic: 'GENERAL', message: '' })
const errors = reactive({ name: '', email: '', subject: '', message: '' })
const sending = ref(false)
const submitted = ref(false)
const sendError = ref('')

function scrollTop() { window.scrollTo({ top: 0, behavior: 'smooth' }) }
function validateEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) }

function clearErrors() { errors.name = ''; errors.email = ''; errors.subject = ''; errors.message = ''; sendError.value = '' }

async function submitForm() {
  clearErrors()
  if (!form.name) errors.name = lang.t('contact.errorName')
  if (!form.email) errors.email = lang.t('contact.errorEmail')
  else if (!validateEmail(form.email)) errors.email = lang.t('contact.errorEmailInvalid')
  if (!form.subject) errors.subject = lang.t('contact.errorSubject')
  if (!form.message || form.message.length < 10) errors.message = lang.t('contact.errorMessage')
  if (errors.name || errors.email || errors.subject || errors.message) return

  sending.value = true
  try {
    await api.post('/api/contact', { name: form.name, email: form.email, subject: form.subject, topic: form.topic, message: form.message })
    submitted.value = true
    resetForm()
  } catch {
    sendError.value = lang.t('contact.errorSend')
  } finally { sending.value = false }
}

function resetForm() { form.name = ''; form.email = ''; form.subject = ''; form.topic = 'GENERAL'; form.message = ''; clearErrors() }
</script>

<style scoped>
.contact{
  --brand:#8C1515; --bg:#fff; --alt:#f6f7f8; --text:#2E2D29; --muted:#5f6368;
  --line:rgba(0,0,0,.10); --shadow:0 18px 54px rgba(0,0,0,.18); --shadow2:0 10px 26px rgba(0,0,0,.10);
  --container:1200px;
  background:var(--bg); color:var(--text); min-height:100vh;
}
.container{ max-width:var(--container); margin:0 auto; padding:0 22px; }

/* hero */
.hero{ position:relative; min-height:54vh; overflow:hidden; display:grid; place-items:center; }
.hero__bg{ position:absolute; inset:0; background-size:cover; background-position:center; transform:scale(1.02); }
.hero__overlay{ position:absolute; inset:0; background:linear-gradient(180deg,rgba(0,0,0,.62) 0%,rgba(0,0,0,.24) 55%,rgba(0,0,0,.55) 100%); }
.hero__content{ position:relative; z-index:2; padding-top:140px; padding-bottom:44px; color:#fff; }
.hero__kicker{ margin:0 0 10px; letter-spacing:.16em; text-transform:uppercase; font-weight:800; opacity:.92; font-size:12px; }
.hero__title{ font-family:Georgia,"Times New Roman",serif; font-weight:900; font-size:62px; line-height:1.02; margin:0 0 12px; }
.hero__sub{ margin:0 0 18px; max-width:70ch; opacity:.92; color:rgba(255,255,255,.92); }
.hero__stats{ display:flex; gap:14px; }
.stat{ background:rgba(255,255,255,.12); border:1px solid rgba(255,255,255,.22); border-radius:14px; padding:10px 12px; backdrop-filter:blur(10px); }
.stat__label{ display:block; font-size:12px; opacity:.9; }
.stat__value{ display:block; font-weight:900; font-size:18px; }

/* section */
.section{ padding:26px 0 60px; }
.layout{ display:grid; grid-template-columns: 1.4fr 1fr; gap:16px; }

/* card form */
.card{ border:1px solid var(--line); background:#fff; border-radius:22px; box-shadow: var(--shadow2); overflow:hidden; }
.card__top{ padding:16px 16px 12px; border-bottom:1px solid rgba(0,0,0,.08); }
.card__title{ margin:0; font-family:Georgia,"Times New Roman",serif; font-weight:900; font-size:26px; }
.card__sub{ margin:8px 0 0; color:var(--muted); }

.form{ padding:16px; display:grid; gap:12px; }
.row{ display:grid; grid-template-columns: 1fr 1fr; gap:12px; }
.row--actions{ grid-template-columns: auto auto 1fr; align-items:center; gap:10px; }

.field{ display:grid; gap:8px; }
.label{ font-weight:900; color:#111; }
.input{
  border:1px solid rgba(0,0,0,.12); background:#fff; border-radius:14px; padding:12px 12px;
  outline:none; font-weight:700; transition: box-shadow .16s ease, transform .16s ease;
}
.input:focus{ box-shadow: 0 0 0 4px rgba(140,21,21,.10); border-color: rgba(140,21,21,.32); }
.textarea{
  border:1px solid rgba(0,0,0,.12); background:#fff; border-radius:14px; padding:12px 12px;
  outline:none; resize: vertical; font-weight:700; transition: box-shadow .16s ease;
}
.textarea:focus{ box-shadow: 0 0 0 4px rgba(140,21,21,.10); border-color: rgba(140,21,21,.32); }
.err{ color:#8C1515; font-weight:900; font-size:12px; }
.send-error{ background:#FFF0F0; color:#CC2936; padding:10px 14px; border-radius:10px; font-size:13px; font-weight:700; border:1px solid #F5C6C8; }

/* success */
.success-card{ display:flex; align-items:center; justify-content:center; min-height:400px; }
.success-card__inner{ text-align:center; padding:40px; }
.success-icon{ font-size:52px; margin-bottom:16px; }

/* side panels */
.side{ display:grid; gap:16px; }
.panel{ border:1px solid rgba(0,0,0,.10); background:#fff; border-radius:22px; padding:14px; box-shadow: var(--shadow2); }
.panel--map{ padding:0; overflow:hidden; }
.panel__map-title{ margin:0; padding:14px 16px; font-weight:900; font-size:16px; border-bottom:1px solid rgba(0,0,0,.08); }
.map-embed{ width:100%; }
.map-embed iframe{ display:block; width:100%; border-radius:0 0 22px 22px; }

.kicker{
  display:inline-flex; border-radius:999px; padding:7px 10px; font-weight:900; font-size:12px;
  background: rgba(140,21,21,.10); border:1px solid rgba(140,21,21,.20); color:#6b0f0f; margin-bottom:10px;
}

.info{ display:grid; gap:10px; }
.info__row{ display:flex; justify-content:space-between; align-items:center; padding:10px 0; border-top:1px solid rgba(0,0,0,.06); }
.info__label{ color:var(--muted); font-weight:800; }
.info__value{ font-weight:900; }
.info__value--link{ color:var(--brand); text-decoration:none; }
.info__value--link:hover{ text-decoration:underline; }

.actions{ display:flex; gap:10px; margin-top:12px; }

/* buttons */
.btnX{
  border:1px solid rgba(0,0,0,.12); background:#fff; border-radius:12px; padding:12px 14px;
  font-weight:900; cursor:pointer; transition: transform .16s ease, box-shadow .16s ease;
  text-decoration:none; text-align:center; display:inline-block;
}
.btnX:hover{ transform: translateY(-1px); box-shadow: var(--shadow2); }
.btnX--primary{
  background: var(--brand); border-color: rgba(140,21,21,.25); color:#fff;
  box-shadow: 0 16px 42px rgba(140,21,21,.22);
}
.btnX--primary:disabled{ opacity:.6; cursor:not-allowed; }

/* to top */
.toTop{
  position:fixed; bottom:18px; left:18px; width:46px; height:46px; border-radius:999px;
  border:1px solid rgba(0,0,0,.12); background:#fff; font-weight:900; cursor:pointer;
  box-shadow: var(--shadow2); transition: transform .16s ease; z-index:2000;
}
.toTop:hover{ transform: translateY(-2px); }

@media(max-width:768px){
  .layout{ grid-template-columns:1fr; }
  .row{ grid-template-columns:1fr; }
  .hero__title{ font-size:36px; }
  .hero__stats{ flex-direction:column; gap:8px; }
}
</style>