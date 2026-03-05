<!-- src/components/LoginView.vue -->
<template>
  <div class="auth-page">
    <!-- Background -->
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
      <!-- Brand Panel -->
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
                <line x1="8"  y1="38" x2="18" y2="43"/>
                <line x1="102" y1="77" x2="112" y2="82"/>
                <line x1="8"  y1="82" x2="18" y2="77"/>
                <line x1="102" y1="43" x2="112" y2="38"/>
                <line x1="38" y1="8"  x2="43" y2="18"/>
                <line x1="77" y1="102" x2="82" y2="112"/>
                <line x1="82" y1="8"  x2="77" y2="18"/>
                <line x1="43" y1="102" x2="38" y2="112"/>
              </g>
              <circle cx="60" cy="60" r="12" fill="rgba(254,221,0,0.18)" stroke="rgba(254,221,0,0.55)" stroke-width="1.5"/>
              <circle cx="60" cy="60" r="5"  fill="rgba(254,221,0,0.75)"/>
            </svg>
          </div>

          <div class="brand-panel__text">
            <h1 class="brand-panel__title">پەیمانگای کەلەپووری کوردی</h1>
            <p class="brand-panel__subtitle">Kurdish Heritage Institute</p>
            <div class="brand-panel__divider"></div>
            <p class="brand-panel__desc">
              چوونەژوورەوە بۆ میوانان و بەرپرسان. بەرپرسان دەتوانن داشبۆرد ببینن، میوان تەنها مافی بینین هەیە.
            </p>
          </div>

          <div class="brand-panel__roles">
            <div class="role-badge">
              <span class="role-icon">👁️</span>
              <div class="role-info">
                <span class="role-title">میوان</span>
                <span class="role-desc">تەنها بینین</span>
              </div>
            </div>
            <div class="role-badge">
              <span class="role-icon">⚡</span>
              <div class="role-info">
                <span class="role-title">بەرپرس</span>
                <span class="role-desc">داشبۆرد و بەڕێوەبردن</span>
              </div>
            </div>
          </div>

          <div class="brand-panel__quote">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="rgba(255,255,255,0.28)">
              <path d="M10 11H6a4 4 0 0 1 4-4V5a6 6 0 0 0-6 6v5h6v-5zm8 0h-4a4 4 0 0 1 4-4V5a6 6 0 0 0-6 6v5h6v-5z"/>
            </svg>
            <span>کەلتوور بنیادی نەتەوەیەتییە</span>
          </div>
        </div>
      </aside>

      <!-- Form Panel -->
      <main class="form-panel">
        <div class="form-panel__inner">
          <!-- Mobile brand -->
          <div class="form-panel__mobile-brand">
            <span class="form-panel__mobile-logo">پەیمانگای کەلەپووری کوردی</span>
            <span class="form-panel__mobile-sub">Kurdish Heritage Institute</span>
          </div>

          <!-- Card -->
          <div class="auth-card">
            <div class="auth-card__header">
              <h2 class="auth-card__title">چوونەژوورەوە</h2>
              <p class="auth-card__subtitle">Login</p>
              <div class="status-indicator">
                <span class="status-dot" :class="{ active: form.username && form.password }"></span>
                <span class="status-text">{{ statusText }}</span>
              </div>
            </div>

            <!-- Session Expired Warning (for admins) -->
            <Transition name="error-slide">
              <div v-if="isExpiredSession" class="auth-warning" role="alert">
                <span class="auth-warning__icon">⏱️</span>
                <div class="auth-warning__content">
                  <strong class="auth-warning__title">کاتی چوونەژوورەوە بەسەرچووە</strong>
                  <span class="auth-warning__text">تکایە دوبارە بچۆرەوە ژوورەوە بۆ بەردەوامی</span>
                </div>
              </div>
            </Transition>

            <!-- Error Alert -->
            <Transition name="error-slide">
              <div v-if="authStore.error && !isExpiredSession" class="auth-error" role="alert">
                <span class="auth-error__icon">⚠️</span>
                <span class="auth-error__text">{{ authStore.error }}</span>
                <button class="auth-error__close" @click="authStore.clearError" aria-label="داخستن">×</button>
              </div>
            </Transition>

            <!-- Success Alert -->
            <Transition name="success-slide">
              <div v-if="showSuccess" class="auth-success" role="status">
                <span class="auth-success__icon">✓</span>
                <span class="auth-success__text">سەرکەوتوو بوو! ڕەوانەکردن...</span>
              </div>
            </Transition>

            <form class="auth-form" @submit.prevent="handleSubmit" novalidate>
              <!-- Username Field -->
              <div class="field" :class="{ 
                'field--error': v$.username.$error,
                'field--success': !v$.username.$error && form.username && form.username.length >= 3
              }">
                <label class="field__label" for="username">
                  ناوی بەکارهێنەر / ئیمەیڵ
                  <span class="field__required">*</span>
                </label>
                <div class="field__wrap">
                  <span class="field__icon" aria-hidden="true">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                  </span>
                  <input
                    id="username"
                    v-model.trim="form.username"
                    type="text"
                    class="field__input"
                    placeholder="username@example.com"
                    autocomplete="username"
                    :disabled="authStore.loading"
                    @blur="v$.username.$touch()"
                    @input="authStore.clearError()"
                  />
                  <span v-if="!v$.username.$error && form.username && form.username.length >= 3" class="field__check">✓</span>
                </div>
                <Transition name="error-fade">
                  <span v-if="v$.username.$error" class="field__error">
                    {{ v$.username.$errors[0].$message }}
                  </span>
                </Transition>
              </div>

              <!-- Password Field -->
              <div class="field" :class="{ 
                'field--error': v$.password.$error,
                'field--success': !v$.password.$error && form.password && form.password.length >= 6
              }">
                <label class="field__label" for="password">
                  وشەی نهێنی
                  <span class="field__required">*</span>
                </label>
                <div class="field__wrap">
                  <span class="field__icon" aria-hidden="true">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  </span>
                  <input
                    id="password"
                    v-model="form.password"
                    :type="showPassword ? 'text' : 'password'"
                    class="field__input"
                    placeholder="••••••••"
                    autocomplete="current-password"
                    :disabled="authStore.loading"
                    @blur="v$.password.$touch()"
                    @input="authStore.clearError()"
                  />
                  <button
                    type="button"
                    class="field__eye"
                    @click="showPassword = !showPassword"
                    :aria-label="showPassword ? 'شاردنەوەی وشەی نهێنی' : 'پیشاندانی وشەی نهێنی'"
                  >
                    <svg v-if="!showPassword" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                    <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  </button>
                </div>
                <Transition name="error-fade">
                  <span v-if="v$.password.$error" class="field__error">
                    {{ v$.password.$errors[0].$message }}
                  </span>
                </Transition>
              </div>

              <!-- Submit Button -->
              <button
                type="submit"
                class="auth-btn"
                :disabled="authStore.loading || v$.$invalid"
              >
                <span v-if="!authStore.loading" class="auth-btn__content">
                  <span class="auth-btn__text">چوونەژوورەوە</span>
                  <span class="auth-btn__icon">→</span>
                </span>
                <span v-else class="spinner-container">
                  <span class="spinner"></span>
                  <span class="spinner-text">چاوەڕێبە...</span>
                </span>
              </button>

              <!-- Divider -->
              <div class="auth-divider">
                <span class="auth-divider__line"></span>
                <span class="auth-divider__text">یان</span>
                <span class="auth-divider__line"></span>
              </div>

              <!-- Google OAuth2 Button -->
              <button
                type="button"
                class="google-btn"
                :disabled="authStore.loading"
                @click="handleGoogleLogin"
              >
                <svg class="google-btn__icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span class="google-btn__text">چوونەژوورەوە بە Google</span>
              </button>

              <!-- Role Hints -->
              <div class="auth-hint">
                <span class="pill pill--guest">
                  <span class="pill-dot"></span>
                  میوان: تەنها بینین
                </span>
                <span class="pill-separator">·</span>
                <span class="pill pill--admin">
                  <span class="pill-dot"></span>
                  بەرپرس: داشبۆرد
                </span>
              </div>
            </form>

            <!-- Footer Links -->
            <div class="auth-card__footer">
              <router-link to="/" class="link-muted">
                گەڕانەوە بۆ ماڵپەر
              </router-link>
              <router-link to="/register" class="link-strong">
                <span class="link-icon">+</span>
                تۆماربوون وەک میوان
              </router-link>
            </div>
          </div>

          <p class="form-panel__version">KHI · {{ new Date().getFullYear() }}</p>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useVuelidate } from '@vuelidate/core'
import { required, minLength, helpers } from '@vuelidate/validators'
import { useAuthStore } from '@/stores/useAuthStore'

const router  = useRouter()
const route   = useRoute()
const authStore = useAuthStore()

const showPassword = ref(false)
const showSuccess  = ref(false)
const form = reactive({ username: '', password: '' })

// Check if session expired (for admin mandatory login)
const isExpiredSession = computed(() => route.query.expired === '1')

// Check if this is a required login (admin) vs optional
const isRequiredLogin = computed(() => route.query.required === 'true')

const statusText = computed(() => {
  if (isExpiredSession.value) return 'تکایە دوبارە بچۆرەوە ژوورەوە'
  if (!form.username && !form.password) return 'زانیارییەکانت بنووسە'
  if (!form.username) return 'ناوی بەکارهێنەر پێویستە'
  if (!form.password) return 'وشەی نهێنی پێویستە'
  if (v$.value.$invalid) return 'تکایە ڕاستی بکەوە'
  return 'ئامادەیە بۆ چوونەژوورەوە'
})

const rules = {
  username: {
    required: helpers.withMessage('ناوی بەکارهێنەر پێویستە', required),
    minLength: helpers.withMessage('کەمترین ٣ پیت', minLength(3))
  },
  password: {
    required: helpers.withMessage('وشەی نهێنی پێویستە', required),
    minLength: helpers.withMessage('کەمترین ٦ پیت', minLength(6)),
  },
}

const v$ = useVuelidate(rules, form)

const handleSubmit = async () => {
  authStore.clearError()
  const valid = await v$.value.$validate()
  if (!valid) return

  const result = await authStore.login(form.username, form.password)
  
  // Handle specific expired token error
  if (!result.ok) {
    if (result.expired) {
      // Token was expired, page will show warning
      return
    }
    return
  }

  showSuccess.value = true
  
  // Clear the expired query param from URL after successful login
  setTimeout(() => {
    const redirect = route.query.redirect
    if (authStore.hasAdminAccess) {
      router.push(redirect || '/admin')
    } else {
      router.push(redirect || '/')
    }
  }, 1200)
}

// Redirect browser to backend OAuth2 authorization endpoint
const handleGoogleLogin = () => {
  window.location.href = 'http://localhost:8080/oauth2/authorize/google'
}

onMounted(() => {
  // ✅ FIX: Always clear error state when entering login page
  authStore.clearError()

  // ✅ FIX: If we arrived here from a logout action or with expired flag,
  //         force-clear ALL session data to prevent old user from persisting
  const fromLogout = route.query.logout === '1'
  const isExpired  = isExpiredSession.value

  if (fromLogout || isExpired) {
    // Nuclear clear — wipe everything
    authStore._clearSession()
  }

  // If guest user lands here with expired flag but not required, redirect them home
  if (isExpired && !isRequiredLogin.value && !fromLogout) {
    router.replace('/')
    return
  }
  
  // ✅ FIX: Only redirect if authenticated AND not coming from logout
  if (authStore.isAuthenticated && !fromLogout) {
    if (authStore.hasAdminAccess) {
      router.replace('/admin')
    } else {
      router.replace('/')
    }
  }
})
</script>

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

  min-height:100vh; direction:rtl; background:var(--off);
  position:relative; overflow:hidden;
}

.auth-page__bg{position:absolute; inset:0; pointer-events:none; z-index:0;}
.auth-page__bg-pattern{
  position:absolute; inset:0;
  background:
    radial-gradient(circle at 15% 70%, rgba(140,21,21,0.08) 0%, transparent 55%),
    radial-gradient(circle at 85% 20%, rgba(254,221,0,0.08) 0%, transparent 55%);
}
.auth-page__bg-glow{
  position:absolute; top:-25%; right:-15%;
  width:680px; height:680px;
  background:radial-gradient(ellipse, rgba(140,21,21,0.10) 0%, transparent 70%);
}
.auth-page__bg-grid{
  position:absolute; inset:-2px;
  background-image: linear-gradient(rgba(46,45,41,0.04) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(46,45,41,0.04) 1px, transparent 1px);
  background-size: 42px 42px;
  mask-image: radial-gradient(circle at 50% 40%, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 70%);
  opacity:0.55;
}

.auth-page__bg-orbs{position:absolute; inset:0; overflow:hidden;}
.orb{
  position:absolute; border-radius:50%;
  filter:blur(60px); opacity:0.15;
  animation:float 20s ease-in-out infinite;
}
.orb--1{width:300px;height:300px;background:radial-gradient(circle,var(--brand),transparent);top:10%;right:15%;animation-delay:-5s;}
.orb--2{width:250px;height:250px;background:radial-gradient(circle,var(--gold),transparent);bottom:20%;left:10%;animation-delay:-10s;}
.orb--3{width:200px;height:200px;background:radial-gradient(circle,var(--brand-dark),transparent);top:60%;right:60%;animation-delay:-15s;}

@keyframes float{
  0%,100%{transform:translate(0,0) scale(1);}
  33%{transform:translate(30px,-30px) scale(1.1);}
  66%{transform:translate(-20px,20px) scale(0.9);}
}

.auth-page__split{position:relative;z-index:1;display:flex;min-height:100vh;}

.brand-panel{
  display:none; width:44%;
  background:linear-gradient(160deg, var(--brand-deep) 0%, var(--brand) 55%, var(--brand-dark) 100%);
  position:relative; overflow:hidden;
}
@media (min-width:980px){.brand-panel{display:flex;}}

.brand-panel::before{
  content:''; position:absolute; bottom:-90px; left:-90px;
  width:420px; height:420px; border-radius:50%;
  background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.07);
}
.brand-panel::after{
  content:''; position:absolute; top:-70px; right:-70px;
  width:320px; height:320px; border-radius:50%;
  background:rgba(254,221,0,0.05); border:1px solid rgba(254,221,0,0.10);
}

.brand-panel__inner{
  flex:1; display:flex; flex-direction:column;
  align-items:center; justify-content:center; text-align:center;
  padding:3.25rem 3rem; gap:2rem; position:relative; z-index:1;
}

.brand-panel__ornament{
  width:128px; height:128px;
  filter:drop-shadow(0 20px 40px rgba(0,0,0,0.25));
  animation:spin 28s linear infinite;
}
@keyframes spin{to{transform:rotate(360deg);}}

.brand-panel__title{
  margin:0; font-family:var(--font-ar); font-weight:1000;
  font-size:clamp(1.65rem,2.6vw,2.2rem); color:var(--white);
  text-shadow:0 2px 20px rgba(0,0,0,0.3);
}
.brand-panel__subtitle{
  margin:0; color:rgba(255,255,255,0.65);
  letter-spacing:0.12em; text-transform:uppercase;
  font-size:0.9rem; font-weight:700;
}
.brand-panel__divider{
  width:56px; height:2px;
  background:linear-gradient(90deg, transparent, var(--gold), transparent);
  margin:0.2rem 0 0.3rem;
}
.brand-panel__desc{
  margin:0; max-width:360px; line-height:1.9;
  color:rgba(255,255,255,0.78); font-family:var(--font-ar); font-size:0.95rem;
}
.brand-panel__roles{display:flex; flex-direction:column; gap:0.85rem; width:100%; max-width:320px;}
.role-badge{
  display:flex; align-items:center; gap:0.85rem;
  padding:0.9rem 1.1rem;
  background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.12);
  border-radius:var(--radius-sm); backdrop-filter:blur(8px);
  transition:all var(--t);
}
.role-badge:hover{background:rgba(255,255,255,0.08); border-color:rgba(254,221,0,0.25); transform:translateX(-2px);}
.role-icon{font-size:1.5rem; filter:drop-shadow(0 2px 8px rgba(0,0,0,0.2));}
.role-info{display:flex; flex-direction:column; gap:0.15rem; text-align:right; flex:1;}
.role-title{font-family:var(--font-ar); font-weight:900; color:var(--white); font-size:0.95rem;}
.role-desc{color:rgba(255,255,255,0.65); font-size:0.8rem; font-weight:700;}
.brand-panel__quote{
  display:flex; align-items:center; gap:0.75rem; color:rgba(255,255,255,0.55);
  padding:1rem 1.35rem; border-radius:var(--radius);
  border:1px solid rgba(255,255,255,0.12); background:rgba(255,255,255,0.04);
  backdrop-filter:blur(6px); font-style:italic; font-size:0.9rem;
}

.form-panel{flex:1;display:flex;justify-content:center;align-items:center;padding:2.2rem 1.25rem;}
.form-panel__inner{width:100%;max-width:480px;display:flex;flex-direction:column;align-items:center;gap:1.25rem;}
.form-panel__mobile-brand{display:flex;flex-direction:column;align-items:center;gap:0.25rem;}
@media (min-width:980px){.form-panel__mobile-brand{display:none;}}
.form-panel__mobile-logo{font-family:var(--font-ar);font-weight:1000;color:var(--brand);font-size:1.15rem;}
.form-panel__mobile-sub{color:var(--g600);font-weight:800;letter-spacing:0.06em;text-transform:uppercase;font-size:0.78rem;}
.form-panel__version{margin:0;font-size:0.75rem;color:var(--g400);direction:ltr;}

.auth-card{
  width:100%; border-radius:var(--radius);
  border:1px solid transparent;
  background:
    linear-gradient(var(--white),var(--white)) padding-box,
    linear-gradient(135deg,rgba(140,21,21,0.22),rgba(254,221,0,0.18),rgba(140,21,21,0.10)) border-box;
  box-shadow:var(--shadow-soft); overflow:hidden;
  transform:translateY(0); transition:transform var(--t),box-shadow var(--t),filter var(--t);
}
.auth-card:hover{transform:translateY(-2px);box-shadow:var(--shadow);filter:saturate(1.02);}

.auth-card__header{
  padding:2.1rem 2rem 1.55rem; text-align:center;
  border-bottom:1px solid rgba(224,223,220,0.7);
  background:
    radial-gradient(circle at 50% 0%, rgba(254,221,0,0.10) 0%, transparent 55%),
    linear-gradient(180deg, rgba(140,21,21,0.045) 0%, transparent 100%);
}
.auth-card__title{margin:0 0 0.25rem;font-family:var(--font-ar);font-weight:1000;font-size:1.75rem;color:var(--g900);}
.auth-card__subtitle{margin:0;color:var(--g600);font-weight:800;font-size:0.9rem;}

.status-indicator{display:flex;align-items:center;justify-content:center;gap:0.5rem;margin-top:1rem;}
.status-dot{width:8px;height:8px;border-radius:50%;background:var(--g200);transition:all var(--t);}
.status-dot.active{background:var(--success);box-shadow:0 0 0 3px rgba(22,163,74,0.15);animation:pulse 2s ease-in-out infinite;}
@keyframes pulse{0%,100%{opacity:1;}50%{opacity:0.6;}}
.status-text{font-size:0.8rem;color:var(--g600);font-weight:800;}

/* NEW: Session Expired Warning */
.auth-warning {
  margin: 1rem 1.6rem 0;
  padding: 1rem;
  background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
  border: 1.5px solid #f39c12;
  border-radius: 12px;
  color: #856404;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-align: right;
}

.auth-warning__icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.auth-warning__content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.auth-warning__title {
  font-family: var(--font-ar);
  font-weight: 900;
  font-size: 0.95rem;
  margin: 0;
}

.auth-warning__text {
  font-size: 0.85rem;
  opacity: 0.9;
  margin: 0;
}

.auth-error{
  margin:1rem 1.6rem 0; padding:0.9rem 1rem;
  background:var(--err-bg); border:1px solid var(--err-border);
  border-radius:var(--radius-sm); color:var(--err);
  display:flex; align-items:center; gap:0.6rem;
}
.auth-error__icon{font-size:1.1rem;}
.auth-error__text{font-weight:900;flex:1;}
.auth-error__close{border:none;background:none;color:var(--err);font-size:1.25rem;cursor:pointer;opacity:0.75;transition:opacity var(--t);}
.auth-error__close:hover{opacity:1;}

.auth-success{
  margin:1rem 1.6rem 0; padding:0.9rem 1rem;
  background:var(--success-bg); border:1px solid var(--success-border);
  border-radius:var(--radius-sm); color:var(--success);
  display:flex; align-items:center; gap:0.6rem;
}
.auth-success__icon{font-size:1.1rem;font-weight:bold;}
.auth-success__text{font-weight:900;}

.error-slide-enter-active,.error-slide-leave-active,
.success-slide-enter-active,.success-slide-leave-active{transition:all .25s ease;}
.error-slide-enter-from,.error-slide-leave-to,
.success-slide-enter-from,.success-slide-leave-to{opacity:0;transform:translateY(-8px);}

.auth-form{padding:1.65rem 1.75rem 1.85rem;display:flex;flex-direction:column;gap:1.1rem;}

.field{display:flex;flex-direction:column;gap:0.45rem;}
.field__label{font-family:var(--font-ar);font-weight:900;color:var(--g900);font-size:0.85rem;display:flex;align-items:center;gap:0.25rem;}
.field__required{color:var(--err);font-size:1rem;}
.field__wrap{position:relative;display:flex;align-items:center;}
.field__icon{position:absolute;right:0.85rem;color:var(--g400);display:flex;transition:color var(--t),transform var(--t);z-index:2;}
.field__check{position:absolute;left:0.85rem;color:var(--success);font-weight:bold;font-size:1.1rem;animation:checkBounce 0.4s cubic-bezier(0.68,-0.55,0.265,1.55);}
@keyframes checkBounce{0%{transform:scale(0);}50%{transform:scale(1.2);}100%{transform:scale(1);}}

.field__input{
  width:100%; padding:0.95rem 2.65rem 0.95rem 2.8rem;
  border-radius:14px; border:1.6px solid rgba(224,223,220,0.95);
  background:linear-gradient(180deg, #FCFCFB 0%, #FBFBFA 100%);
  outline:none; font-family:var(--font-ar); transition:all var(--t);
}
.field__input::placeholder{color:rgba(168,167,163,0.95);}
.field__wrap:hover .field__input{border-color:rgba(168,167,163,0.95);background:linear-gradient(180deg,#FFFFFF 0%,#FCFCFB 100%);box-shadow:0 10px 24px rgba(0,0,0,0.06);transform:translateY(-1px);}
.field__wrap:hover .field__icon{color:var(--brand);transform:translateX(-2px) scale(1.05);}
.field__input:focus{background:var(--white);border-color:var(--brand);box-shadow:var(--shadow-focus);transform:translateY(-1px);}
.field__input:disabled{opacity:0.75;cursor:not-allowed;background:var(--g50);}

.field__eye{position:absolute;left:0.75rem;border:none;background:none;cursor:pointer;color:var(--g400);display:flex;padding:0.35rem;border-radius:10px;transition:all var(--t);z-index:2;}
.field__eye:hover{color:var(--brand);background:rgba(140,21,21,0.06);transform:translateY(-1px) scale(1.05);}

.field--error .field__input{border-color:var(--err);background:#FFF7F7;animation:shake 0.4s ease;}
.field--error .field__icon{color:var(--err);}
.field--success .field__input{border-color:var(--success);}

@keyframes shake{0%,100%{transform:translateX(0);}25%{transform:translateX(-4px);}75%{transform:translateX(4px);}}

.field__error{color:var(--err);font-weight:900;font-size:0.75rem;display:flex;align-items:center;gap:0.3rem;}
.field__error::before{content:'⚠';font-size:0.85rem;}
.error-fade-enter-active,.error-fade-leave-active{transition:all .2s ease;}
.error-fade-enter-from,.error-fade-leave-to{opacity:0;transform:translateY(-4px);}

.auth-btn{
  width:100%; padding:1rem 1.25rem; border:none; border-radius:14px;
  color:var(--white); font-family:var(--font-ar); font-weight:1000; font-size:1rem;
  cursor:pointer;
  background:linear-gradient(135deg, var(--brand) 0%, var(--brand-dark) 100%);
  box-shadow:0 12px 30px rgba(140,21,21,0.24);
  transition:transform var(--t),box-shadow var(--t),filter var(--t);
  margin-top:0.25rem; position:relative; overflow:hidden;
}
.auth-btn::after{
  content:''; position:absolute; inset:-60% -20%;
  background:radial-gradient(circle at 30% 30%, rgba(255,255,255,0.22), transparent 55%);
  opacity:0; transition:opacity var(--t); pointer-events:none;
}
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

.auth-divider{
  display:flex; align-items:center; gap:0.75rem;
  margin:0.25rem 0;
}
.auth-divider__line{
  flex:1; height:1px;
  background:linear-gradient(90deg, transparent, rgba(200,199,196,0.8), transparent);
}
.auth-divider__text{
  font-size:0.78rem; font-weight:900;
  color:var(--g400); white-space:nowrap; padding:0 0.25rem;
}

.google-btn{
  width:100%; padding:0.92rem 1.25rem;
  border:1.6px solid rgba(224,223,220,0.95);
  border-radius:14px; background:var(--white);
  display:flex; align-items:center; justify-content:center; gap:0.85rem;
  cursor:pointer; font-family:var(--font-ar);
  font-weight:900; font-size:0.95rem; color:var(--g900);
  transition:all var(--t); position:relative; overflow:hidden;
  box-shadow:0 2px 8px rgba(0,0,0,0.06);
}
.google-btn:hover:not(:disabled){
  border-color:rgba(66,133,244,0.45);
  box-shadow:0 8px 24px rgba(66,133,244,0.14);
  transform:translateY(-2px);
  background:linear-gradient(180deg, #FFFFFF 0%, #F8FBFF 100%);
}
.google-btn:active:not(:disabled){transform:translateY(0);}
.google-btn:disabled{opacity:0.6;cursor:not-allowed;}
.google-btn__icon{
  width:20px; height:20px; flex-shrink:0;
  filter:drop-shadow(0 1px 2px rgba(0,0,0,0.12));
}
.google-btn__text{font-size:0.92rem;}

.auth-hint{display:flex;align-items:center;justify-content:center;gap:0.5rem;margin-top:0.15rem;flex-wrap:wrap;}
.pill{padding:0.4rem 0.75rem;border-radius:999px;font-size:0.75rem;font-weight:900;display:flex;align-items:center;gap:0.4rem;transition:all var(--t);}
.pill--guest{background:rgba(22,163,74,0.08);border:1px solid rgba(22,163,74,0.18);color:#15803D;}
.pill--admin{background:rgba(140,21,21,0.08);border:1px solid rgba(140,21,21,0.18);color:var(--brand);}
.pill:hover{transform:translateY(-1px);box-shadow:0 4px 12px rgba(0,0,0,0.08);}
.pill-dot{width:5px;height:5px;border-radius:50%;background:currentColor;}
.pill-separator{color:var(--g400);font-weight:bold;}

.auth-card__footer{
  padding:1.1rem 1.75rem; border-top:1px solid rgba(240,239,237,0.9);
  display:flex; justify-content:space-between; gap:1rem;
}
.link-muted,.link-strong{text-decoration:none;font-weight:1000;font-size:0.85rem;transition:all var(--t);display:flex;align-items:center;gap:0.35rem;}
.link-icon{font-size:1rem;transition:transform var(--t);}
.link-muted{color:var(--g600);}
.link-muted:hover{color:var(--brand);transform:translateX(2px);}
.link-strong{color:var(--brand);}
.link-strong:hover{text-decoration:underline;transform:translateX(-2px);}
.link-strong:hover .link-icon{transform:scale(1.15);}

@media (prefers-reduced-motion:reduce){*{transition:none !important;animation:none !important;}}
</style>