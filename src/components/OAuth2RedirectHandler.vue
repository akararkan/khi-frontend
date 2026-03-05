<!-- src/components/OAuth2RedirectHandler.vue -->
<template>
  <div class="redirect-page">
    <div class="redirect-page__bg" aria-hidden="true">
      <div class="redirect-page__bg-glow"></div>
      <div class="redirect-page__bg-grid"></div>
    </div>

    <div class="redirect-card">
      <!-- Loading state -->
      <template v-if="status === 'loading'">
        <div class="redirect-card__icon redirect-card__icon--spin">
          <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" width="72" height="72">
            <circle cx="60" cy="60" r="56" stroke="rgba(140,21,21,0.15)" stroke-width="3"/>
            <path d="M60 4 A56 56 0 0 1 116 60" stroke="#8C1515" stroke-width="3" stroke-linecap="round"/>
          </svg>
        </div>
        <h2 class="redirect-card__title">چاوەڕێبە...</h2>
        <p class="redirect-card__desc">چوونەژوورەوەی Google پرۆسەس دەکرێت</p>
        <div class="redirect-card__dots">
          <span></span><span></span><span></span>
        </div>
      </template>

      <!-- Success state -->
      <template v-else-if="status === 'success'">
        <div class="redirect-card__icon redirect-card__icon--success">
          <svg width="52" height="52" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="11" fill="rgba(22,163,74,0.12)" stroke="#16A34A" stroke-width="1.5"/>
            <path d="M7 12.5l3.5 3.5 6.5-7" stroke="#16A34A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <h2 class="redirect-card__title redirect-card__title--success">سەرکەوتوو بوو!</h2>
        <p class="redirect-card__desc">بەخێربێیت! ڕەوانەکردن...</p>
      </template>

      <!-- Error state -->
      <template v-else-if="status === 'error'">
        <div class="redirect-card__icon redirect-card__icon--error">
          <svg width="52" height="52" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="11" fill="rgba(204,41,54,0.10)" stroke="#CC2936" stroke-width="1.5"/>
            <path d="M9 9l6 6M15 9l-6 6" stroke="#CC2936" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
        <h2 class="redirect-card__title redirect-card__title--error">هەڵە ڕوویدا</h2>
        <p class="redirect-card__desc redirect-card__desc--error">{{ errorMessage }}</p>
        <button class="redirect-btn" @click="router.push('/login')">
          گەڕانەوە بۆ چوونەژوورەوە
        </button>
      </template>
    </div>

    <p class="redirect-page__brand">پەیمانگای کەلەپووری کوردی · KHI</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'

const router    = useRouter()
const authStore = useAuthStore()

const status       = ref('loading')
const errorMessage = ref('')

onMounted(async () => {
  const params = new URLSearchParams(window.location.search)
  const token  = params.get('token')
  const error  = params.get('error')

  if (error) {
    status.value       = 'error'
    errorMessage.value = decodeURIComponent(error) || 'چوونەژوورەوەی Google سەرکەوتوو نەبوو'
    return
  }

  if (!token) {
    status.value       = 'error'
    errorMessage.value = 'Token نەدۆزرایەوە. تکایە دووبارە هەوڵبدەرەوە.'
    return
  }

  // ✅ FIX: Clear any old session before setting new token from OAuth
  authStore._clearSession()

  // setToken decodes the JWT, sets state, and persists to localStorage
  const ok = authStore.setToken(token)

  if (!ok) {
    status.value       = 'error'
    errorMessage.value = authStore.error || 'Token نادروستە. تکایە دووبارە هەوڵبدەرەوە.'
    return
  }

  status.value = 'success'

  // ✅ FIX: fetch full profile with the new token
  await authStore.fetchMe()

  setTimeout(() => {
    router.replace(authStore.hasAdminAccess ? '/admin' : '/')
  }, 1000)
})
</script>

<style scoped>
.redirect-page{
  --brand:#8C1515; --brand-dark:#6B0F0F; --gold:#FEDD00;
  --white:#FFFFFF; --off:#FAFAF9;
  --g400:#A8A7A3; --g600:#767571; --g900:#2E2D29;
  --success:#16A34A; --err:#CC2936;
  --font-ar:'Noto Kufi Arabic','Noto Sans Arabic',system-ui,sans-serif;
  --t:0.22s cubic-bezier(0.16,1,0.3,1);

  min-height:100vh; direction:rtl;
  display:flex; flex-direction:column;
  align-items:center; justify-content:center;
  background:var(--off); position:relative; overflow:hidden;
  gap:1.5rem;
}

.redirect-page__bg{position:absolute;inset:0;pointer-events:none;z-index:0;}
.redirect-page__bg-glow{
  position:absolute; top:-20%; right:-10%;
  width:600px; height:600px;
  background:radial-gradient(ellipse, rgba(140,21,21,0.07) 0%, transparent 70%);
}
.redirect-page__bg-grid{
  position:absolute; inset:-2px;
  background-image:
    linear-gradient(rgba(46,45,41,0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(46,45,41,0.04) 1px, transparent 1px);
  background-size:42px 42px;
  mask-image:radial-gradient(circle at 50% 50%, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 65%);
  opacity:0.6;
}

.redirect-card{
  position:relative; z-index:1;
  width:min(420px, 92vw);
  padding:3rem 2.5rem;
  border-radius:20px;
  border:1px solid transparent;
  background:
    linear-gradient(var(--white), var(--white)) padding-box,
    linear-gradient(135deg, rgba(140,21,21,0.18), rgba(254,221,0,0.14), rgba(140,21,21,0.08)) border-box;
  box-shadow:0 20px 70px rgba(0,0,0,0.10), 0 6px 20px rgba(0,0,0,0.06);
  display:flex; flex-direction:column; align-items:center;
  gap:1.25rem; text-align:center;
}

.redirect-card__icon{display:flex; align-items:center; justify-content:center;}
.redirect-card__icon--spin svg{animation:spin 1s linear infinite;}
@keyframes spin{to{transform:rotate(360deg);}}
.redirect-card__icon--success{animation:popIn 0.5s cubic-bezier(0.68,-0.55,0.265,1.55);}
.redirect-card__icon--error{animation:popIn 0.5s cubic-bezier(0.68,-0.55,0.265,1.55);}
@keyframes popIn{0%{transform:scale(0); opacity:0;}100%{transform:scale(1); opacity:1;}}

.redirect-card__title{
  margin:0; font-family:var(--font-ar); font-weight:1000;
  font-size:1.55rem; color:var(--g900);
}
.redirect-card__title--success{color:var(--success);}
.redirect-card__title--error{color:var(--err);}

.redirect-card__desc{
  margin:0; color:var(--g600); font-family:var(--font-ar);
  font-weight:800; font-size:0.92rem; line-height:1.7;
}
.redirect-card__desc--error{color:var(--err);}

/* Animated dots */
.redirect-card__dots{
  display:flex; gap:0.5rem; align-items:center;
}
.redirect-card__dots span{
  width:8px; height:8px; border-radius:50%;
  background:var(--brand); opacity:0.3;
  animation:dotPulse 1.4s ease-in-out infinite;
}
.redirect-card__dots span:nth-child(2){animation-delay:0.2s;}
.redirect-card__dots span:nth-child(3){animation-delay:0.4s;}
@keyframes dotPulse{
  0%,100%{opacity:0.25; transform:scale(0.8);}
  50%{opacity:1; transform:scale(1);}
}

.redirect-btn{
  margin-top:0.5rem;
  padding:0.85rem 2rem; border:none; border-radius:12px;
  color:var(--white); font-family:var(--font-ar); font-weight:900; font-size:0.9rem;
  cursor:pointer;
  background:linear-gradient(135deg, var(--brand) 0%, var(--brand-dark) 100%);
  box-shadow:0 8px 24px rgba(140,21,21,0.22);
  transition:all var(--t);
}
.redirect-btn:hover{transform:translateY(-2px); box-shadow:0 14px 36px rgba(140,21,21,0.30);}

.redirect-page__brand{
  position:relative; z-index:1;
  font-size:0.75rem; color:var(--g400); direction:ltr; letter-spacing:0.05em;
}

@media (prefers-reduced-motion:reduce){*{transition:none !important; animation:none !important;}}
</style>