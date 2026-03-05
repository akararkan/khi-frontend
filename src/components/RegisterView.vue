<!-- src/components/RegisterView.vue -->
<template>
  <div class="auth-page">
    <div class="auth-page__bg" aria-hidden="true">
      <div class="auth-page__bg-pattern"></div>
      <div class="auth-page__bg-glow"></div>
      <div class="auth-page__bg-grid"></div>
      <div class="auth-page__bg-orbs">
        <div class="orb orb--1"></div>
        <div class="orb orb--2"></div>
        <div class="orb orb--3"></div>
      </div>
    </div>

    <div class="auth-page__split">
      <aside class="brand-panel" aria-hidden="true">
        <div class="brand-panel__inner">
          <div class="brand-panel__ornament">
            <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="60" cy="60" r="56" stroke="rgba(255,255,255,0.15)" stroke-width="2"/>
              <circle cx="60" cy="60" r="40" stroke="rgba(255,255,255,0.10)" stroke-width="1"/>
              <g stroke="rgba(254,221,0,0.65)" stroke-width="1.5">
                <line x1="60" y1="4"  x2="60" y2="16"/>
                <line x1="60" y1="104" x2="60" y2="116"/>
                <line x1="4"  y1="60" x2="16" y2="60"/>
                <line x1="104" y1="60" x2="116" y2="60"/>
                <line x1="15" y1="15" x2="23" y2="23"/>
                <line x1="97" y1="97" x2="105" y2="105"/>
                <line x1="105" y1="15" x2="97" y2="23"/>
                <line x1="23" y1="97" x2="15" y2="105"/>
              </g>
              <circle cx="60" cy="60" r="12" fill="rgba(254,221,0,0.18)" stroke="rgba(254,221,0,0.55)" stroke-width="1.5"/>
              <circle cx="60" cy="60" r="5"  fill="rgba(254,221,0,0.75)"/>
            </svg>
          </div>

          <div class="brand-panel__text">
            <h1 class="brand-panel__title">پەیمانگای کەلەپووری کوردی</h1>
            <p class="brand-panel__subtitle">Kurdish Heritage Institute</p>
            <div class="brand-panel__divider"></div>
            <p class="brand-panel__desc">دروستکردنی هەژمار</p>
          </div>

          <div class="brand-panel__features">
            <div class="feature-item">
              <span class="feature-icon">🔒</span>
              <span class="feature-text">پارێزراو و دڵنیا</span>
            </div>
            <div class="feature-item">
              <span class="feature-icon">⚡</span>
              <span class="feature-text">خێرا و ئاسان</span>
            </div>
            <div class="feature-item">
              <span class="feature-icon">✨</span>
              <span class="feature-text">بێ بەرامبەر</span>
            </div>
          </div>

          <div class="brand-panel__stamp" aria-hidden="true">
            <div class="stamp__ring"></div>
            <div class="stamp__dot"></div>
            <div class="stamp__dot stamp__dot--b"></div>
          </div>
        </div>
      </aside>

      <main class="form-panel">
        <div class="form-panel__inner">
          <div class="form-panel__mobile-brand">
            <span class="form-panel__mobile-logo">دروستکردنی هەژمار</span>
            <span class="form-panel__mobile-sub">Kurdish Heritage Institute</span>
          </div>

          <div class="auth-card">
            <div class="auth-card__header">
              <h2 class="auth-card__title">تۆماربوون</h2>
              <p class="auth-card__subtitle">Register</p>
              <div class="progress-dots">
                <span class="dot" :class="{ active: currentStep >= 1 }"></span>
                <span class="dot" :class="{ active: currentStep >= 2 }"></span>
                <span class="dot" :class="{ active: currentStep >= 3 }"></span>
              </div>
            </div>

            <Transition name="error-slide">
              <div v-if="authStore.error" class="auth-error" role="alert">
                <span class="auth-error__icon">⚠️</span>
                <span class="auth-error__text">{{ authStore.error }}</span>
                <button class="auth-error__close" @click="authStore.clearError" aria-label="داخستن">×</button>
              </div>
            </Transition>

            <Transition name="success-slide">
              <div v-if="showSuccess" class="auth-success" role="status">
                <span class="auth-success__icon">✓</span>
                <span class="auth-success__text">تۆمارکردن سەرکەوتوو بوو!</span>
              </div>
            </Transition>

            <form class="auth-form" @submit.prevent="submit" novalidate>
              <!-- Row 1 -->
              <div class="row">
                <div class="field" :class="{ 'field--error': v$.name.$error, 'field--success': !v$.name.$error && form.name }">
                  <label class="field__label" for="name">
                    ناو <span class="field__required">*</span>
                  </label>
                  <div class="field__wrap">
                    <span class="field__icon">✦</span>
                    <input id="name" v-model.trim="form.name" class="field__input" type="text"
                      placeholder="ناوت بنووسە" :disabled="authStore.loading"
                      @blur="v$.name.$touch()" @input="authStore.clearError()" @focus="currentStep = 1" autocomplete="name"/>
                    <span v-if="!v$.name.$error && form.name" class="field__check">✓</span>
                  </div>
                  <Transition name="error-fade">
                    <span v-if="v$.name.$error" class="field__error">{{ v$.name.$errors[0].$message }}</span>
                  </Transition>
                </div>

                <div class="field" :class="{ 'field--error': v$.username.$error, 'field--success': !v$.username.$error && form.username }">
                  <label class="field__label" for="username">
                    ناوی بەکارهێنەر <span class="field__required">*</span>
                  </label>
                  <div class="field__wrap">
                    <span class="field__icon">@</span>
                    <input id="username" v-model.trim="form.username" class="field__input" type="text"
                      placeholder="user_01" :disabled="authStore.loading"
                      @blur="v$.username.$touch()" @input="authStore.clearError()" @focus="currentStep = 1" autocomplete="username"/>
                    <span v-if="!v$.username.$error && form.username" class="field__check">✓</span>
                  </div>
                  <Transition name="error-fade">
                    <span v-if="v$.username.$error" class="field__error">{{ v$.username.$errors[0].$message }}</span>
                  </Transition>
                </div>
              </div>

              <!-- Row 2 -->
              <div class="row row--single">
                <div class="field" :class="{ 'field--error': v$.email.$error, 'field--success': !v$.email.$error && form.email }">
                  <label class="field__label" for="email">
                    ئیمەیڵ <span class="field__required">*</span>
                  </label>
                  <div class="field__wrap">
                    <span class="field__icon">✉</span>
                    <input id="email" v-model.trim="form.email" class="field__input" type="email"
                      placeholder="user@example.com" :disabled="authStore.loading"
                      @blur="v$.email.$touch()" @input="authStore.clearError()" @focus="currentStep = 2" autocomplete="email"/>
                    <span v-if="!v$.email.$error && form.email" class="field__check">✓</span>
                  </div>
                  <Transition name="error-fade">
                    <span v-if="v$.email.$error" class="field__error">{{ v$.email.$errors[0].$message }}</span>
                  </Transition>
                </div>
              </div>

              <!-- Row 3 -->
              <div class="row">
                <div class="field" :class="{ 'field--error': v$.password.$error, 'field--success': !v$.password.$error && form.password }">
                  <label class="field__label" for="password">
                    وشەی نهێنی <span class="field__required">*</span>
                  </label>
                  <div class="field__wrap">
                    <span class="field__icon">🔒</span>
                    <input id="password" v-model="form.password" class="field__input"
                      :type="showPassword ? 'text' : 'password'" placeholder="••••••••"
                      :disabled="authStore.loading"
                      @blur="v$.password.$touch()" @input="authStore.clearError()" @focus="currentStep = 3" autocomplete="new-password"/>
                    <button type="button" class="field__eye" @click="showPassword = !showPassword" aria-label="show/hide">
                      <span v-if="!showPassword">👁️</span>
                      <span v-else>🙈</span>
                    </button>
                  </div>
                  <Transition name="error-fade">
                    <span v-if="v$.password.$error" class="field__error">{{ v$.password.$errors[0].$message }}</span>
                  </Transition>
                  <Transition name="fade">
                    <div v-if="form.password && !v$.password.$error" class="password-strength">
                      <div class="strength-bar">
                        <div class="strength-bar__fill" :class="`strength-bar__fill--${passwordStrength.level}`" :style="{ width: `${passwordStrength.score}%` }"></div>
                      </div>
                      <span class="strength-text" :class="`strength-text--${passwordStrength.level}`">{{ passwordStrength.label }}</span>
                    </div>
                  </Transition>
                </div>

                <div class="field" :class="{ 'field--error': v$.confirm.$error, 'field--success': !v$.confirm.$error && form.confirm }">
                  <label class="field__label" for="confirm">
                    دووبارەکردنەوە <span class="field__required">*</span>
                  </label>
                  <div class="field__wrap">
                    <span class="field__icon">✓</span>
                    <input id="confirm" v-model="form.confirm" class="field__input"
                      :type="showPassword ? 'text' : 'password'" placeholder="••••••••"
                      :disabled="authStore.loading"
                      @blur="v$.confirm.$touch()" @input="authStore.clearError()" @focus="currentStep = 3" autocomplete="new-password"/>
                    <span v-if="!v$.confirm.$error && form.confirm && form.confirm === form.password" class="field__check">✓</span>
                  </div>
                  <Transition name="error-fade">
                    <span v-if="v$.confirm.$error" class="field__error">{{ v$.confirm.$errors[0].$message }}</span>
                  </Transition>
                </div>
              </div>

              <!-- Submit -->
              <button class="auth-btn" type="submit" :disabled="authStore.loading || v$.$invalid">
                <span v-if="!authStore.loading" class="auth-btn__content">
                  <span class="auth-btn__text">تۆماربوون</span>
                  <span class="auth-btn__icon">→</span>
                </span>
                <span v-else class="spinner-container">
                  <span class="spinner"></span>
                  <span class="spinner-text">تکایە چاوەڕێ بە...</span>
                </span>
              </button>

              <!-- Divider -->
              <div class="auth-divider">
                <span class="auth-divider__line"></span>
                <span class="auth-divider__text">یان</span>
                <span class="auth-divider__line"></span>
              </div>

              <!-- ✅ Google OAuth2 Button -->
              <button
                type="button"
                class="google-btn"
                :disabled="authStore.loading"
                @click="handleGoogleSignup"
              >
                <svg class="google-btn__icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span class="google-btn__text">تۆماربوون بە Google</span>
              </button>

              <div class="auth-card__footer auth-card__footer--center">
                <router-link to="/login" class="link-strong">
                  <span class="link-icon">←</span>
                  هەژمار هەیە؟ چوونەژوورەوە
                </router-link>
                <router-link to="/" class="link-muted">گەڕانەوە بۆ ماڵپەر</router-link>
              </div>
            </form>
          </div>

          <p class="form-panel__version">KHI · {{ new Date().getFullYear() }}</p>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useVuelidate } from '@vuelidate/core'
import { required, minLength, email as emailRule, helpers } from '@vuelidate/validators'
import { useAuthStore } from '@/stores/useAuthStore'

const router    = useRouter()
const authStore = useAuthStore()
const showPassword = ref(false)
const showSuccess  = ref(false)
const currentStep  = ref(1)

const form = reactive({ name: '', username: '', email: '', password: '', confirm: '' })

const passwordStrength = computed(() => {
  const pwd = form.password
  if (!pwd) return { score: 0, level: 'weak', label: '' }
  let score = 0
  if (pwd.length >= 6)  score += 20
  if (pwd.length >= 8)  score += 15
  if (pwd.length >= 10) score += 15
  if (/[a-z]/.test(pwd)) score += 10
  if (/[A-Z]/.test(pwd)) score += 15
  if (/\d/.test(pwd))    score += 15
  if (/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) score += 10
  let level = 'weak',   label = 'لاواز'
  if (score >= 70) { level = 'strong'; label = 'بەهێز' }
  else if (score >= 40) { level = 'medium'; label = 'مامناوەند' }
  return { score: Math.min(score, 100), level, label }
})

const samePassword = helpers.withMessage('وشەی نهێنی یەک نیە', (v) => v === form.password)

const rules = {
  name:     { required: helpers.withMessage('ناو پێویستە', required) },
  username: { required: helpers.withMessage('ناوی بەکارهێنەر پێویستە', required), minLength: helpers.withMessage('کەمترین ٣ پیت', minLength(3)) },
  email:    { required: helpers.withMessage('ئیمەیڵ پێویستە', required), email: helpers.withMessage('ئیمەیڵ دروست نیە', emailRule) },
  password: { required: helpers.withMessage('وشەی نهێنی پێویستە', required), minLength: helpers.withMessage('کەمترین ٦ پیت', minLength(6)) },
  confirm:  { required: helpers.withMessage('دووبارەکردنەوە پێویستە', required), samePassword },
}

const v$ = useVuelidate(rules, form)

const submit = async () => {
  authStore.clearError()
  const ok = await v$.value.$validate()
  if (!ok) return
  const res = await authStore.registerGuest({ name: form.name, username: form.username, email: form.email, password: form.password })
  if (!res.ok) return
  showSuccess.value = true
  setTimeout(() => router.push('/login'), 1500)
}

// ✅ NEW: same flow as login — Google handles both sign-up and sign-in
const handleGoogleSignup = () => {
  window.location.href = 'http://localhost:8080/oauth2/authorize/google'
}

onMounted(() => authStore.clearError())
</script>

<!-- All styles identical to the original RegisterView — no changes needed -->
<style scoped>
.auth-page{
  --brand:#8C1515; --brand-dark:#6B0F0F; --brand-deep:#4A0A0A; --gold:#FEDD00;
  --white:#FFFFFF; --off:#FAFAF9;
  --g50:#F6F5F3; --g100:#F0EFED; --g200:#E0DFDC; --g350:#C6C5C1; --g400:#A8A7A3;
  --g600:#767571; --g900:#2E2D29;
  --err:#CC2936; --err-bg:#FFF0F0; --err-border:#F5C6C8;
  --success:#16A34A; --success-bg:#F0FDF4; --success-border:#BBF7D0;
  --radius:16px; --radius-sm:12px;
  --shadow:0 18px 70px rgba(0,0,0,0.12), 0 6px 18px rgba(0,0,0,0.06);
  --shadow-soft:0 14px 52px rgba(0,0,0,0.10), 0 4px 14px rgba(0,0,0,0.06);
  --shadow-focus:0 0 0 3px rgba(140,21,21,0.16);
  --font-ar:'Noto Kufi Arabic','Noto Sans Arabic',system-ui,sans-serif;
  --t:0.22s cubic-bezier(0.16,1,0.3,1);
  min-height:100vh; direction:rtl; background:var(--off); position:relative; overflow:hidden;
}
.auth-page__bg{position:absolute;inset:0;pointer-events:none;z-index:0;}
.auth-page__bg-pattern{position:absolute;inset:0;background:radial-gradient(circle at 15% 70%,rgba(140,21,21,0.08) 0%,transparent 55%),radial-gradient(circle at 85% 20%,rgba(254,221,0,0.08) 0%,transparent 55%);}
.auth-page__bg-glow{position:absolute;top:-25%;right:-15%;width:680px;height:680px;background:radial-gradient(ellipse,rgba(140,21,21,0.10) 0%,transparent 70%);}
.auth-page__bg-grid{position:absolute;inset:-2px;background-image:linear-gradient(rgba(46,45,41,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(46,45,41,0.04) 1px,transparent 1px);background-size:42px 42px;mask-image:radial-gradient(circle at 50% 40%,rgba(0,0,0,0.9) 0%,rgba(0,0,0,0) 70%);opacity:0.55;}
.auth-page__bg-orbs{position:absolute;inset:0;overflow:hidden;}
.orb{position:absolute;border-radius:50%;filter:blur(60px);opacity:0.15;animation:float 20s ease-in-out infinite;}
.orb--1{width:300px;height:300px;background:radial-gradient(circle,var(--brand),transparent);top:10%;right:15%;animation-delay:-5s;}
.orb--2{width:250px;height:250px;background:radial-gradient(circle,var(--gold),transparent);bottom:20%;left:10%;animation-delay:-10s;}
.orb--3{width:200px;height:200px;background:radial-gradient(circle,var(--brand-dark),transparent);top:60%;right:60%;animation-delay:-15s;}
@keyframes float{0%,100%{transform:translate(0,0) scale(1);}33%{transform:translate(30px,-30px) scale(1.1);}66%{transform:translate(-20px,20px) scale(0.9);}}
.auth-page__split{position:relative;z-index:1;display:flex;min-height:100vh;}
.brand-panel{display:none;width:44%;background:linear-gradient(160deg,var(--brand-deep) 0%,var(--brand) 55%,var(--brand-dark) 100%);position:relative;overflow:hidden;}
@media (min-width:980px){.brand-panel{display:flex;}}
.brand-panel::before{content:'';position:absolute;bottom:-90px;left:-90px;width:420px;height:420px;border-radius:50%;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);}
.brand-panel::after{content:'';position:absolute;top:-70px;right:-70px;width:320px;height:320px;border-radius:50%;background:rgba(254,221,0,0.05);border:1px solid rgba(254,221,0,0.10);}
.brand-panel__inner{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:3.25rem 3rem;gap:2.2rem;position:relative;z-index:1;}
.brand-panel__ornament{width:132px;height:132px;filter:drop-shadow(0 20px 40px rgba(0,0,0,0.25));animation:spin 28s linear infinite;}
@keyframes spin{to{transform:rotate(360deg);}}
.brand-panel__title{margin:0;font-family:var(--font-ar);font-weight:1000;font-size:clamp(1.65rem,2.6vw,2.2rem);color:var(--white);text-shadow:0 2px 20px rgba(0,0,0,0.3);}
.brand-panel__subtitle{margin:0;color:rgba(255,255,255,0.65);letter-spacing:0.12em;text-transform:uppercase;font-size:0.9rem;font-weight:700;}
.brand-panel__divider{width:56px;height:2px;background:linear-gradient(90deg,transparent,var(--gold),transparent);margin:0.2rem 0 0.15rem;}
.brand-panel__desc{margin:0;font-family:var(--font-ar);font-weight:900;font-size:1rem;color:rgba(255,255,255,0.80);}
.brand-panel__features{display:flex;flex-direction:column;gap:1rem;margin-top:0.5rem;}
.feature-item{display:flex;align-items:center;gap:0.75rem;color:rgba(255,255,255,0.85);font-family:var(--font-ar);font-weight:800;font-size:0.9rem;}
.feature-icon{font-size:1.2rem;filter:drop-shadow(0 2px 8px rgba(0,0,0,0.2));}
.brand-panel__stamp{width:170px;height:170px;position:relative;opacity:0.95;}
.stamp__ring{position:absolute;inset:0;border-radius:50%;border:1px solid rgba(255,255,255,0.14);background:radial-gradient(circle at 30% 30%,rgba(254,221,0,0.10),transparent 55%),radial-gradient(circle at 70% 70%,rgba(255,255,255,0.06),transparent 55%);box-shadow:inset 0 0 0 10px rgba(255,255,255,0.02);backdrop-filter:blur(6px);}
.stamp__dot{position:absolute;width:12px;height:12px;border-radius:50%;background:rgba(254,221,0,0.55);top:32px;left:32px;filter:drop-shadow(0 10px 18px rgba(0,0,0,0.25));}
.stamp__dot--b{top:auto;left:auto;bottom:34px;right:34px;background:rgba(255,255,255,0.22);}
.form-panel{flex:1;display:flex;justify-content:center;align-items:center;padding:2.2rem 1.25rem;}
.form-panel__inner{width:100%;max-width:720px;display:flex;flex-direction:column;align-items:center;gap:1.25rem;}
.form-panel__mobile-brand{display:flex;flex-direction:column;align-items:center;gap:0.25rem;}
@media (min-width:980px){.form-panel__mobile-brand{display:none;}}
.form-panel__mobile-logo{font-family:var(--font-ar);font-weight:1000;color:var(--brand);font-size:1.18rem;}
.form-panel__mobile-sub{color:var(--g600);font-weight:800;letter-spacing:0.06em;text-transform:uppercase;font-size:0.78rem;}
.form-panel__version{margin:0;font-size:0.75rem;color:var(--g400);direction:ltr;}
.auth-card{width:100%;border-radius:var(--radius);border:1px solid transparent;background:linear-gradient(var(--white),var(--white)) padding-box,linear-gradient(135deg,rgba(140,21,21,0.22),rgba(254,221,0,0.18),rgba(140,21,21,0.10)) border-box;box-shadow:var(--shadow-soft);overflow:hidden;transform:translateY(0);transition:transform var(--t),box-shadow var(--t),filter var(--t);}
.auth-card:hover{transform:translateY(-2px);box-shadow:var(--shadow);filter:saturate(1.02);}
.auth-card__header{padding:2.1rem 2rem 1.35rem;text-align:center;border-bottom:1px solid rgba(224,223,220,0.7);background:radial-gradient(circle at 50% 0%,rgba(254,221,0,0.10) 0%,transparent 55%),linear-gradient(180deg,rgba(140,21,21,0.045) 0%,transparent 100%);}
.auth-card__title{margin:0 0 0.25rem;font-family:var(--font-ar);font-weight:1000;font-size:1.75rem;color:var(--g900);}
.auth-card__subtitle{margin:0;color:var(--g600);font-weight:800;font-size:0.9rem;}
.progress-dots{display:flex;gap:0.5rem;justify-content:center;margin-top:1.25rem;}
.dot{width:8px;height:8px;border-radius:50%;background:var(--g200);transition:all var(--t);}
.dot.active{background:var(--brand);box-shadow:0 0 0 3px rgba(140,21,21,0.15);}
.auth-error{margin:1rem 1.6rem 0;padding:0.9rem 1rem;background:var(--err-bg);border:1px solid var(--err-border);border-radius:var(--radius-sm);color:var(--err);display:flex;align-items:center;gap:0.6rem;}
.auth-error__icon{font-size:1.1rem;}
.auth-error__text{font-weight:900;flex:1;}
.auth-error__close{border:none;background:none;color:var(--err);font-size:1.25rem;cursor:pointer;opacity:0.75;transition:opacity var(--t);}
.auth-error__close:hover{opacity:1;}
.auth-success{margin:1rem 1.6rem 0;padding:0.9rem 1rem;background:var(--success-bg);border:1px solid var(--success-border);border-radius:var(--radius-sm);color:var(--success);display:flex;align-items:center;gap:0.6rem;}
.auth-success__icon{font-size:1.1rem;font-weight:bold;}
.auth-success__text{font-weight:900;}
.error-slide-enter-active,.error-slide-leave-active,.success-slide-enter-active,.success-slide-leave-active{transition:all .25s ease;}
.error-slide-enter-from,.error-slide-leave-to,.success-slide-enter-from,.success-slide-leave-to{opacity:0;transform:translateY(-8px);}
.auth-form{padding:1.55rem 1.75rem 1.85rem;display:flex;flex-direction:column;gap:1.05rem;}
.row{display:grid;grid-template-columns:1fr;gap:1rem;}
@media (min-width:760px){.row{grid-template-columns:1fr 1fr;}}
.row--single{grid-template-columns:1fr !important;}
.field{display:flex;flex-direction:column;gap:0.45rem;}
.field__label{font-family:var(--font-ar);font-weight:900;color:var(--g900);font-size:0.85rem;display:flex;align-items:center;gap:0.25rem;}
.field__required{color:var(--err);font-size:1rem;}
.field__wrap{position:relative;display:flex;align-items:center;border-radius:14px;transition:transform var(--t);}
.field__icon{position:absolute;right:0.85rem;color:var(--g400);font-weight:900;opacity:0.9;transition:color var(--t),transform var(--t),opacity var(--t);z-index:2;}
.field__check{position:absolute;left:0.85rem;color:var(--success);font-weight:bold;font-size:1.1rem;animation:checkBounce 0.4s cubic-bezier(0.68,-0.55,0.265,1.55);}
@keyframes checkBounce{0%{transform:scale(0);}50%{transform:scale(1.2);}100%{transform:scale(1);}}
.field__input{width:100%;padding:0.98rem 2.65rem 0.98rem 2.9rem;border-radius:14px;border:1.6px solid rgba(224,223,220,0.95);background:linear-gradient(180deg,#FCFCFB 0%,#FBFBFA 100%);outline:none;font-family:var(--font-ar);transition:all var(--t);}
.field__input::placeholder{color:rgba(168,167,163,0.95);}
.field__wrap:hover .field__input{border-color:rgba(168,167,163,0.95);background:linear-gradient(180deg,#FFFFFF 0%,#FCFCFB 100%);box-shadow:0 10px 24px rgba(0,0,0,0.06);transform:translateY(-1px);}
.field__wrap:hover .field__icon{color:var(--brand);transform:translateX(-2px) scale(1.05);opacity:1;}
.field__input:focus{background:var(--white);border-color:var(--brand);box-shadow:var(--shadow-focus);transform:translateY(-1px);}
.field__input:disabled{opacity:0.75;cursor:not-allowed;background:var(--g50);}
.field__eye{position:absolute;left:0.75rem;border:none;background:none;cursor:pointer;color:var(--g400);display:flex;padding:0.35rem;border-radius:10px;transition:all var(--t);z-index:2;}
.field__eye:hover{color:var(--brand);background:rgba(140,21,21,0.06);transform:translateY(-1px) scale(1.05);}
.field--error .field__input{border-color:var(--err);background:#FFF7F7;animation:shake 0.4s ease;}
.field--error .field__icon{color:var(--err);opacity:1;}
.field--success .field__input{border-color:var(--success);}
@keyframes shake{0%,100%{transform:translateX(0);}25%{transform:translateX(-4px);}75%{transform:translateX(4px);}}
.field__error{color:var(--err);font-weight:900;font-size:0.75rem;display:flex;align-items:center;gap:0.3rem;}
.field__error::before{content:'⚠';font-size:0.85rem;}
.error-fade-enter-active,.error-fade-leave-active{transition:all .2s ease;}
.error-fade-enter-from,.error-fade-leave-to{opacity:0;transform:translateY(-4px);}
.password-strength{display:flex;flex-direction:column;gap:0.4rem;margin-top:0.25rem;}
.strength-bar{height:4px;background:var(--g200);border-radius:2px;overflow:hidden;}
.strength-bar__fill{height:100%;transition:all 0.3s ease;border-radius:2px;}
.strength-bar__fill--weak{background:var(--err);box-shadow:0 0 8px rgba(204,41,54,0.4);}
.strength-bar__fill--medium{background:#F59E0B;box-shadow:0 0 8px rgba(245,158,11,0.4);}
.strength-bar__fill--strong{background:var(--success);box-shadow:0 0 8px rgba(22,163,74,0.4);}
.strength-text{font-size:0.75rem;font-weight:900;}
.strength-text--weak{color:var(--err);}
.strength-text--medium{color:#F59E0B;}
.strength-text--strong{color:var(--success);}
.fade-enter-active,.fade-leave-active{transition:all .25s ease;}
.fade-enter-from,.fade-leave-to{opacity:0;transform:translateY(-4px);}

/* ── Submit Button ── */
.auth-btn{width:100%;padding:1rem 1.25rem;border:none;border-radius:14px;color:var(--white);font-family:var(--font-ar);font-weight:1000;font-size:1rem;cursor:pointer;background:linear-gradient(135deg,var(--brand) 0%,var(--brand-dark) 100%);box-shadow:0 12px 30px rgba(140,21,21,0.24);transition:transform var(--t),box-shadow var(--t),filter var(--t);margin-top:0.25rem;position:relative;overflow:hidden;}
.auth-btn::after{content:'';position:absolute;inset:-60% -20%;background:radial-gradient(circle at 30% 30%,rgba(255,255,255,0.22),transparent 55%);transform:translateX(0);opacity:0;transition:opacity var(--t);pointer-events:none;}
.auth-btn:hover:not(:disabled){transform:translateY(-3px) scale(1.01);box-shadow:0 20px 50px rgba(140,21,21,0.32);filter:saturate(1.05);}
.auth-btn:hover:not(:disabled)::after{opacity:1;}
.auth-btn:active:not(:disabled){transform:translateY(-1px) scale(0.99);}
.auth-btn:focus-visible{outline:none;box-shadow:0 0 0 3px rgba(254,221,0,0.25),0 18px 42px rgba(140,21,21,0.30);}
.auth-btn:disabled{opacity:0.65;cursor:not-allowed;transform:none;box-shadow:0 8px 20px rgba(140,21,21,0.15);}
.auth-btn__content{display:flex;align-items:center;justify-content:center;gap:0.5rem;}
.auth-btn__icon{font-size:1.2rem;transition:transform var(--t);}
.auth-btn:hover:not(:disabled) .auth-btn__icon{transform:translateX(-3px);}
.spinner-container{display:flex;align-items:center;justify-content:center;gap:0.6rem;}
.spinner{width:18px;height:18px;border-radius:50%;border:2px solid rgba(255,255,255,0.35);border-top-color:rgba(255,255,255,0.95);display:inline-block;animation:spin2 0.7s linear infinite;}
@keyframes spin2{to{transform:rotate(360deg);}}
.spinner-text{font-size:0.9rem;opacity:0.95;}

/* ── Divider ── */
.auth-divider{display:flex;align-items:center;gap:0.75rem;margin:0.25rem 0;}
.auth-divider__line{flex:1;height:1px;background:linear-gradient(90deg,transparent,rgba(200,199,196,0.8),transparent);}
.auth-divider__text{font-size:0.78rem;font-weight:900;color:var(--g400);white-space:nowrap;padding:0 0.25rem;}

/* ── Google Button ── */
.google-btn{width:100%;padding:0.92rem 1.25rem;border:1.6px solid rgba(224,223,220,0.95);border-radius:14px;background:var(--white);display:flex;align-items:center;justify-content:center;gap:0.85rem;cursor:pointer;font-family:var(--font-ar);font-weight:900;font-size:0.95rem;color:var(--g900);transition:all var(--t);position:relative;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);}
.google-btn:hover:not(:disabled){border-color:rgba(66,133,244,0.45);box-shadow:0 8px 24px rgba(66,133,244,0.14);transform:translateY(-2px);background:linear-gradient(180deg,#FFFFFF 0%,#F8FBFF 100%);}
.google-btn:active:not(:disabled){transform:translateY(0);}
.google-btn:disabled{opacity:0.6;cursor:not-allowed;}
.google-btn__icon{width:20px;height:20px;flex-shrink:0;filter:drop-shadow(0 1px 2px rgba(0,0,0,0.12));}
.google-btn__text{font-size:0.92rem;}

/* ── Footer ── */
.auth-card__footer{padding:1.15rem 0 0;display:flex;gap:0.9rem;justify-content:center;flex-wrap:wrap;}
.auth-card__footer--center{margin-top:0.25rem;border-top:1px solid rgba(240,239,237,0.9);padding:1.1rem 1.75rem 0;}
.link-muted,.link-strong{text-decoration:none;font-weight:1000;font-size:0.85rem;transition:all var(--t);display:flex;align-items:center;gap:0.35rem;}
.link-icon{font-size:1rem;transition:transform var(--t);}
.link-muted{color:var(--g600);}
.link-muted:hover{color:var(--brand);transform:translateX(2px);}
.link-strong{color:var(--brand);}
.link-strong:hover{text-decoration:underline;transform:translateX(-2px);}
.link-strong:hover .link-icon{transform:translateX(-2px);}

@media (prefers-reduced-motion:reduce){*{transition:none !important;animation:none !important;}}
</style>