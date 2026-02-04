<template>
  <main id="main-content" class="contact">
    <!-- HERO -->
    <header class="hero">
      <div class="hero__bg" :style="{ backgroundImage: `url(${heroImage})` }"></div>
      <div class="hero__overlay"></div>

      <div class="container hero__content">
        <p class="hero__kicker">پەیوەندی</p>
        <h1 class="hero__title">پەیوەندی لەگەڵ ئێمە</h1>
        <p class="hero__sub">
          ئەمە demo ـە. ئەم فۆرمە لە ئێستا دا تەنها "fake submit" دەکات (alert). دواتر دەتوانیت بە API/Backend ببەستیتەوە.
        </p>

        <div class="hero__stats">
          <div class="stat">
            <span class="stat__label">کاتی وەڵام (demo)</span>
            <span class="stat__value">24–48 کاتژمێر</span>
          </div>
          <div class="stat">
            <span class="stat__label">ژمارەی ڕێگای پەیوەندی</span>
            <span class="stat__value">4</span>
          </div>
        </div>
      </div>
    </header>

    <!-- CONTENT -->
    <section class="section">
      <div class="container">
        <div class="layout">
          <!-- LEFT: FORM -->
          <div class="card">
            <div class="card__top">
              <h2 class="card__title">نامە بنێرە</h2>
              <p class="card__sub">تکایە زانیارییەکان پڕ بکە. (demo)</p>
            </div>

            <form class="form" @submit.prevent="submit">
              <div class="row">
                <div class="field">
                  <label class="label">ناو (Full name)</label>
                  <input v-model.trim="form.name" class="input" type="text" placeholder="مثال: Hunar Maamal" />
                  <span v-if="errors.name" class="err">{{ errors.name }}</span>
                </div>
                <div class="field">
                  <label class="label">ئیمەیڵ</label>
                  <input v-model.trim="form.email" class="input" type="email" placeholder="name@example.com" />
                  <span v-if="errors.email" class="err">{{ errors.email }}</span>
                </div>
              </div>

              <div class="row">
                <div class="field">
                  <label class="label">بابەت</label>
                  <input v-model.trim="form.subject" class="input" type="text" placeholder="بابەتی نامە" />
                  <span v-if="errors.subject" class="err">{{ errors.subject }}</span>
                </div>
                <div class="field">
                  <label class="label">جۆری داواکاری</label>
                  <select v-model="form.topic" class="input">
                    <option value="general">گشتی</option>
                    <option value="service">خزمەتگوزاری</option>
                    <option value="project">پڕۆژە</option>
                    <option value="publication">بڵاوکراوە</option>
                    <option value="partnership">هاوبەشی</option>
                  </select>
                </div>
              </div>

              <div class="field">
                <label class="label">نامە</label>
                <textarea v-model.trim="form.message" class="textarea" rows="7" placeholder="نامەکەت بنووسە..."></textarea>
                <span v-if="errors.message" class="err">{{ errors.message }}</span>
              </div>

              <div class="row row--actions">
                <button class="btnX btnX--primary" type="submit">ناردن →</button>
                <button class="btnX" type="button" @click="reset">Reset</button>
                <span class="hint">By sending, you agree this is demo only.</span>
              </div>
            </form>
          </div>

          <!-- RIGHT: INFO PANEL -->
          <aside class="side">
            <div class="panel">
              <span class="kicker">Contact info</span>
              <h3 class="panel__title">زانیاری پەیوەندی (demo)</h3>

              <div class="info">
                <div class="info__row">
                  <span class="info__label">شوێن</span>
                  <b class="info__value">سلێمانی • ناوەند</b>
                </div>
                <div class="info__row">
                  <span class="info__label">ئیمەیڵ</span>
                  <b class="info__value">info@example.com</b>
                </div>
                <div class="info__row">
                  <span class="info__label">تەلەفۆن</span>
                  <b class="info__value">+964 000 000 0000</b>
                </div>
                <div class="info__row">
                  <span class="info__label">کات</span>
                  <b class="info__value">Sun–Thu • 9:00–16:00</b>
                </div>
              </div>

              <div class="actions">
                <button class="btnX btnX--primary" type="button" @click="fakeMap">Open map →</button>
                <button class="btnX" type="button" @click="fakeCall">Call</button>
              </div>
            </div>

            <div class="panel panel--soft">
              <b>FAQ (demo)</b>
              <div class="faq">
                <details class="qa">
                  <summary>چۆن خزمەتگوزاری داوا بکەم؟</summary>
                  <p>لە فۆرمەکە “جۆری داواکاری = خزمەتگوزاری” هەڵبژێرە و وردەکاری بنووسە.</p>
                </details>
                <details class="qa">
                  <summary>چۆن پڕۆژەکان پێشکەش بکەم؟</summary>
                  <p>وردەکاری و لینک/پەڕگە بنووسە. دواتر دەتوانیت upload زیاد بکەیت.</p>
                </details>
                <details class="qa">
                  <summary>کاتی وەڵام چەندە؟</summary>
                  <p>demo: 24–48 کاتژمێر.</p>
                </details>
              </div>
            </div>

            <div class="panel panel--image">
              <img :src="sideImage" alt="contact" />
              <div class="panel__cap">
                <b>We’re here to help</b>
                <span>Clean, calm, Stanford-like.</span>
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
import { reactive } from 'vue'

const heroImage = 'https://picsum.photos/seed/contactHero/2200/1100'
const sideImage = 'https://picsum.photos/seed/contactSide/1100/900'

const form = reactive({
  name: '',
  email: '',
  subject: '',
  topic: 'general',
  message: '',
})

const errors = reactive({
  name: '',
  email: '',
  subject: '',
  message: '',
})

function scrollTop() {
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
  window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function clearErrors() {
  errors.name = ''
  errors.email = ''
  errors.subject = ''
  errors.message = ''
}

function submit() {
  clearErrors()

  if (!form.name) errors.name = 'ناو پێویستە'
  if (!form.email) errors.email = 'ئیمەیڵ پێویستە'
  else if (!validateEmail(form.email)) errors.email = 'ئیمەیڵ دروست نییە'
  if (!form.subject) errors.subject = 'بابەت پێویستە'
  if (!form.message || form.message.length < 10) errors.message = 'نامەکەت کەمە (10 پیت زیاتر)'

  const hasError = !!(errors.name || errors.email || errors.subject || errors.message)
  if (hasError) return

  alert(`Demo submit ✅\n\nName: ${form.name}\nEmail: ${form.email}\nTopic: ${form.topic}\nSubject: ${form.subject}\nMessage: ${form.message}`)
  reset()
}

function reset() {
  form.name = ''
  form.email = ''
  form.subject = ''
  form.topic = 'general'
  form.message = ''
  clearErrors()
}

function fakeMap() {
  alert('Demo: open map')
}
function fakeCall() {
  alert('Demo: call phone')
}
</script>

<style scoped>
.contact{
  --brand:#8C1515; --bg:#fff; --alt:#f6f7f8; --text:#2E2D29; --muted:#5f6368;
  --line:rgba(0,0,0,.10); --shadow:0 18px 54px rgba(0,0,0,.18); --shadow2:0 10px 26px rgba(0,0,0,.10);
  --container:1200px;

  background:var(--bg); color:var(--text); min-height:100vh;
}

/* smooth scroll (no @media) */
:global(html){ scroll-behavior:smooth; }

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
.card{
  border:1px solid var(--line);
  background:#fff;
  border-radius:22px;
  box-shadow: var(--shadow2);
  overflow:hidden;
}
.card__top{ padding:16px 16px 12px; border-bottom:1px solid rgba(0,0,0,.08); }
.card__title{ margin:0; font-family:Georgia,"Times New Roman",serif; font-weight:900; font-size:26px; }
.card__sub{ margin:8px 0 0; color:var(--muted); }

.form{ padding:16px; display:grid; gap:12px; }
.row{ display:grid; grid-template-columns: 1fr 1fr; gap:12px; }
.row--actions{ grid-template-columns: auto auto 1fr; align-items:center; gap:10px; }

.field{ display:grid; gap:8px; }
.label{ font-weight:900; color:#111; }
.input{
  border:1px solid rgba(0,0,0,.12);
  background:#fff;
  border-radius:14px;
  padding:12px 12px;
  outline:none;
  font-weight:700;
  transition: box-shadow .16s ease, transform .16s ease;
}
.input:focus{ box-shadow: 0 0 0 4px rgba(140,21,21,.10); border-color: rgba(140,21,21,.32); }
.textarea{
  border:1px solid rgba(0,0,0,.12);
  background:#fff;
  border-radius:14px;
  padding:12px 12px;
  outline:none;
  resize: vertical;
  font-weight:700;
  transition: box-shadow .16s ease;
}
.textarea:focus{ box-shadow: 0 0 0 4px rgba(140,21,21,.10); border-color: rgba(140,21,21,.32); }

.err{ color:#8C1515; font-weight:900; font-size:12px; }
.hint{ color:var(--muted); font-weight:800; justify-self:end; }

/* side panels */
.side{ display:grid; gap:16px; }

.panel{
  border:1px solid rgba(0,0,0,.10);
  background:#fff;
  border-radius:22px;
  padding:14px;
  box-shadow: var(--shadow2);
}
.panel--soft{ background: rgba(0,0,0,.02); }
.kicker{
  display:inline-flex;
  border-radius:999px;
  padding:7px 10px;
  font-weight:900;
  font-size:12px;
  background: rgba(140,21,21,.10);
  border:1px solid rgba(140,21,21,.20);
  color:#6b0f0f;
  margin-bottom:10px;
}
.panel__title{ margin:0 0 10px; font-weight:900; font-size:18px; }

.info{ display:grid; gap:10px; }
.info__row{
  display:flex; justify-content:space-between; align-items:center;
  padding:10px 0; border-top:1px solid rgba(0,0,0,.06);
}
.info__label{ color:var(--muted); font-weight:800; }
.info__value{ font-weight:900; }

.actions{ display:flex; gap:10px; margin-top:12px; }

/* faq */
.faq{ display:grid; gap:10px; margin-top:10px; }
.qa{
  border:1px solid rgba(0,0,0,.10);
  background:#fff;
  border-radius:14px;
  padding:10px 12px;
}
.qa summary{ cursor:pointer; font-weight:900; }
.qa p{ margin:10px 0 0; color:var(--muted); line-height:1.6; }

/* image panel */
.panel--image{ padding:0; overflow:hidden; }
.panel--image img{ width:100%; height:240px; object-fit:cover; display:block; transform:scale(1.02); transition: transform .35s ease; }
.panel--image:hover img{ transform: scale(1.06); }
.panel__cap{
  padding:12px 14px;
  border-top:1px solid rgba(0,0,0,.08);
  display:flex; flex-direction:column; gap:4px;
}
.panel__cap b{ font-weight:900; }
.panel__cap span{ color:var(--muted); font-weight:800; }

/* buttons */
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
