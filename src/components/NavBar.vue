<template>
  <header class="header">
    <nav class="navbar" dir="rtl">
      <!-- Logo -->
      <div class="logo">
        <span class="logo-icon">📚</span>
    
      </div>

      <!-- Navigation Links -->
      <ul class="nav-links">
        <li>
          <router-link to="/" active-class="active">
            <span class="link-text">سەرەکی</span>
          </router-link>
        </li>
         <li>
          <router-link to="/projects" active-class="active">
            <span class="link-text">پڕۆژەکان</span>
          </router-link>
        </li>
        <li>
          <router-link to="/publishments" active-class="active">
            <span class="link-text">بڵاوکراوەکان</span>
          </router-link>
        </li>
        <li>
          <router-link to="/about" active-class="active">
            <span class="link-text">دەربارە</span>
          </router-link>
        </li>
        <li>
          <router-link to="/contact" active-class="active">
            <span class="link-text">پەیوەندی</span>
          </router-link>
        </li>
        <li>
          <router-link to="/services" active-class="active">
            <span class="link-text">خزمەتگوزارییەکان</span>
          </router-link>
        </li>
        <li>
          <router-link to="/library" active-class="active">
            <span class="link-text">کتێبخانە</span>
          </router-link>
        </li>
        <li>
          <router-link to="/archive" active-class="active">
            <span class="link-text">ئەرشیڤ</span>
          </router-link>
        </li>
      </ul>

      <!-- Language & Search -->
      <div class="nav-actions">
        <!-- Language Chooser -->
        <div class="language-chooser" @click="toggleLangMenu" ref="langChooser">
          <div class="flag-container">
            <!-- Kurdistan Flag SVG -->
            <svg class="flag" viewBox="0 0 36 24" xmlns="http://www.w3.org/2000/svg">
              <rect width="36" height="8" fill="#ED2939"/>
              <rect y="8" width="36" height="8" fill="#FFFFFF"/>
              <rect y="16" width="36" height="8" fill="#00A651"/>
              <circle cx="18" cy="12" r="4.5" fill="#FEDD00"/>
              <!-- Sun rays -->
              <g fill="#FEDD00">
                <polygon points="18,3 19,6.5 17,6.5"/>
                <polygon points="18,21 19,17.5 17,17.5"/>
                <polygon points="9,12 12.5,13 12.5,11"/>
                <polygon points="27,12 23.5,13 23.5,11"/>
                <polygon points="11.5,5.5 13.8,8.2 12.5,9.2"/>
                <polygon points="24.5,18.5 22.2,15.8 23.5,14.8"/>
                <polygon points="24.5,5.5 22.2,8.2 23.5,9.2"/>
                <polygon points="11.5,18.5 13.8,15.8 12.5,14.8"/>
              </g>
            </svg>
          </div>
          <span class="lang-text">{{ selectedDialect.name }}</span>
          <svg class="chevron" :class="{ 'rotated': langMenuOpen }" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="m6 9 6 6 6-6"/>
          </svg>
          
          <!-- Dropdown Menu -->
          <transition name="dropdown">
            <div class="lang-dropdown" v-show="langMenuOpen">
              <div class="dropdown-header">زمانی کوردی</div>
              <div 
                class="lang-option" 
                :class="{ 'active': selectedDialect.id === 'sorani' }"
                @click.stop="selectDialect('sorani')"
              >
                <div class="dialect-info">
                  <span class="dialect-name">کوردی</span>
                  <span class="dialect-desc">کوردی ناوەندی</span>
                </div>
                <svg v-if="selectedDialect.id === 'sorani'" class="check-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <div 
                class="lang-option" 
                :class="{ 'active': selectedDialect.id === 'kurmanji' }"
                @click.stop="selectDialect('kurmanji')"
              >
                <div class="dialect-info">
                  <span class="dialect-name">Kurdî</span>
                  <span class="dialect-desc">Kurdiya Bakur </span>
                </div>
                <svg v-if="selectedDialect.id === 'kurmanji'" class="check-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
            </div>
          </transition>
        </div>

        <!-- Search Bar -->
        <div class="search-container">
          <input 
            type="text" 
            class="search-input" 
            placeholder="گەڕان..."
            v-model="searchQuery"
            @focus="searchFocused = true"
            @blur="searchFocused = false"
          />
          <button class="search-btn" :class="{ 'focused': searchFocused }">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </svg>
          </button>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const searchQuery = ref('')
const searchFocused = ref(false)
const langMenuOpen = ref(false)
const langChooser = ref(null)

const dialects = {
  sorani: { id: 'sorani', name: 'کوردی', code: 'ckb' },
  kurmanji: { id: 'kurmanji', name: 'Kurdî', code: 'kmr' }
}

const selectedDialect = ref(dialects.sorani)

const toggleLangMenu = () => {
  langMenuOpen.value = !langMenuOpen.value
}

const selectDialect = (dialectId) => {
  selectedDialect.value = dialects[dialectId]
  langMenuOpen.value = false
}

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  if (langChooser.value && !langChooser.value.contains(event.target)) {
    langMenuOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;500;600;700&display=swap');

/* ===== CSS Variables ===== */
:root {
  --gold-primary: #fbbf24;
  --gold-light: #fcd34d;
  --gold-dark: #f59e0b;
  --slate-900: #0f172a;
  --slate-800: #1e293b;
  --slate-700: #334155;
  --slate-400: #94a3b8;
  --slate-300: #cbd5e1;
  --slate-100: #f1f5f9;
}

/* ===== Base Header ===== */
.header {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: linear-gradient(
    180deg,
    rgba(15, 23, 42, 0.98) 0%,
    rgba(30, 41, 59, 0.95) 100%
  );
  backdrop-filter: blur(24px) saturate(180%);
  border-bottom: 1px solid rgba(251, 191, 36, 0.12);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.4),
    0 1px 0 rgba(255, 255, 255, 0.03) inset;
}

.navbar {
  max-width: 1440px;
  margin: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 36px;
  font-family: 'Noto Sans Arabic', 'Segoe UI', sans-serif;
  gap: 24px;
}

/* ===== Logo ===== */
.logo {
  display: flex;
  align-items: center;
  gap: 14px;
  cursor: pointer;
  flex-shrink: 0;
}

.logo-icon {
  font-size: 30px;
  filter: drop-shadow(0 4px 12px rgba(251, 191, 36, 0.4));
  animation: gentleFloat 4s ease-in-out infinite;
}

@keyframes gentleFloat {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-4px) rotate(-3deg); }
}

.logo-text {
  font-size: 24px;
  font-weight: 700;
  background: linear-gradient(
    135deg, 
    #fcd34d 0%, 
    #fbbf24 30%, 
    #f59e0b 70%, 
    #fbbf24 100%
  );
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: shimmer 4s linear infinite;
}

@keyframes shimmer {
  0% { background-position: 200% center; }
  100% { background-position: -200% center; }
}

/* ===== Navigation Links ===== */
.nav-links {
  display: flex;
  list-style: none;
  gap: 6px;
  margin: 0;
  padding: 0;
  flex: 1;
  justify-content: center;
}

.nav-links li {
  position: relative;
}

.nav-links a {
  position: relative;
  display: flex;
  align-items: center;
  font-size: 15px;
  font-weight: 500;
  color: #94a3b8;
  text-decoration: none;
  padding: 10px 18px;
  border-radius: 10px;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  overflow: hidden;
}

/* Hover glow background */
.nav-links a::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse at center,
    rgba(251, 191, 36, 0.15) 0%,
    rgba(251, 191, 36, 0.05) 50%,
    transparent 70%
  );
  border-radius: 10px;
  opacity: 0;
  transform: scale(0.5);
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Animated underline */
.nav-links a::after {
  content: '';
  position: absolute;
  bottom: 6px;
  right: 18px;
  left: 18px;
  height: 2.5px;
  background: linear-gradient(90deg, #fbbf24, #f59e0b, #fbbf24);
  background-size: 200% 100%;
  border-radius: 2px;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  animation: gradientMove 2s linear infinite paused;
}

@keyframes gradientMove {
  0% { background-position: 0% 50%; }
  100% { background-position: 200% 50%; }
}

.nav-links a:hover {
  color: #fbbf24;
  transform: translateY(-3px);
}

.nav-links a:hover::before {
  opacity: 1;
  transform: scale(1);
}

.nav-links a:hover::after {
  transform: scaleX(1);
  animation-play-state: running;
}

/* Active State */
.nav-links a.active {
  color: #fbbf24;
  background: linear-gradient(
    135deg, 
    rgba(251, 191, 36, 0.12) 0%, 
    rgba(245, 158, 11, 0.08) 100%
  );
  box-shadow: 
    0 0 20px rgba(251, 191, 36, 0.15),
    inset 0 0 0 1px rgba(251, 191, 36, 0.2);
}

.nav-links a.active::after {
  transform: scaleX(1);
  animation-play-state: running;
  box-shadow: 0 0 12px rgba(251, 191, 36, 0.6);
}

.link-text {
  position: relative;
  z-index: 1;
}

/* ===== Nav Actions (Language & Search) ===== */
.nav-actions {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-shrink: 0;
}

/* ===== Language Chooser ===== */
.language-chooser {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(51, 65, 85, 0.7) 100%);
  border: 1px solid rgba(148, 163, 184, 0.15);
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.language-chooser:hover {
  border-color: rgba(251, 191, 36, 0.4);
  background: linear-gradient(135deg, rgba(30, 41, 59, 1) 0%, rgba(51, 65, 85, 0.9) 100%);
  box-shadow: 
    0 8px 24px rgba(251, 191, 36, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  transform: translateY(-2px);
}

.flag-container {
  width: 30px;
  height: 21px;
  border-radius: 5px;
  overflow: hidden;
  box-shadow: 
    0 2px 8px rgba(0, 0, 0, 0.3),
    inset 0 0 0 1px rgba(255, 255, 255, 0.1);
}

.flag {
  width: 100%;
  height: 100%;
}

.lang-text {
  color: #f1f5f9;
  font-size: 14px;
  font-weight: 600;
}

.chevron {
  color: #94a3b8;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.chevron.rotated {
  transform: rotate(180deg);
  color: #fbbf24;
}

.language-chooser:hover .chevron {
  color: #fbbf24;
}

/* ===== Language Dropdown ===== */
.lang-dropdown {
  position: absolute;
  top: calc(100% + 10px);
  left: 0;
  right: 0;
  min-width: 200px;
  background: linear-gradient(180deg, rgba(30, 41, 59, 0.98) 0%, rgba(15, 23, 42, 0.98) 100%);
  border: 1px solid rgba(148, 163, 184, 0.15);
  border-radius: 16px;
  padding: 8px;
  box-shadow: 
    0 20px 50px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(255, 255, 255, 0.03) inset;
  z-index: 100;
}

/* Dropdown Animation */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-12px) scale(0.95);
}

.dropdown-header {
  padding: 10px 14px 8px;
  font-size: 12px;
  font-weight: 600;
  color: #fbbf24;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-bottom: 1px solid rgba(148, 163, 184, 0.1);
  margin-bottom: 6px;
}

.lang-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  border-radius: 10px;
  color: #cbd5e1;
  transition: all 0.25s ease;
}

.lang-option:hover {
  background: rgba(251, 191, 36, 0.1);
}

.lang-option.active {
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.15) 0%, rgba(245, 158, 11, 0.1) 100%);
}

.dialect-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.dialect-name {
  font-size: 15px;
  font-weight: 600;
  color: #f1f5f9;
}

.lang-option:hover .dialect-name,
.lang-option.active .dialect-name {
  color: #fbbf24;
}

.dialect-desc {
  font-size: 12px;
  color: #94a3b8;
}

.check-icon {
  color: #fbbf24;
  filter: drop-shadow(0 0 4px rgba(251, 191, 36, 0.5));
}

/* ===== Search Container ===== */
.search-container {
  position: relative;
  display: flex;
  align-items: center;
}

.search-input {
  width: 160px;
  padding: 12px 48px 12px 18px;
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(51, 65, 85, 0.7) 100%);
  border: 1px solid rgba(148, 163, 184, 0.15);
  border-radius: 14px;
  color: #f1f5f9;
  font-size: 14px;
  font-family: inherit;
  direction: rtl;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.search-input::placeholder {
  color: #94a3b8;
}

.search-input:focus {
  outline: none;
  width: 200px;
  border-color: rgba(251, 191, 36, 0.5);
  background: linear-gradient(135deg, rgba(30, 41, 59, 1) 0%, rgba(51, 65, 85, 0.9) 100%);
  box-shadow: 
    0 0 0 4px rgba(251, 191, 36, 0.1),
    0 8px 24px rgba(251, 191, 36, 0.12);
}

.search-btn {
  position: absolute;
  left: 6px;
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  border: none;
  border-radius: 10px;
  padding: 8px;
  cursor: pointer;
  color: #0f172a;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 2px 8px rgba(251, 191, 36, 0.3);
}

.search-btn:hover,
.search-btn.focused {
  transform: scale(1.1) rotate(-5deg);
  box-shadow: 0 6px 20px rgba(251, 191, 36, 0.5);
}

/* ===== Responsive Design ===== */
@media (max-width: 1280px) {
  .navbar {
    padding: 12px 24px;
  }
  
  .nav-links a {
    padding: 8px 14px;
    font-size: 14px;
  }
  
  .logo-text {
    font-size: 20px;
  }
}

@media (max-width: 1100px) {
  .navbar {
    flex-wrap: wrap;
    gap: 16px;
  }
  
  .nav-links {
    order: 3;
    width: 100%;
    justify-content: center;
    flex-wrap: wrap;
    padding-top: 14px;
    border-top: 1px solid rgba(148, 163, 184, 0.08);
    gap: 4px;
  }
  
  .nav-actions {
    order: 2;
  }
}

@media (max-width: 640px) {
  .navbar {
    padding: 12px 16px;
  }
  
  .search-input {
    width: 120px;
    padding: 10px 44px 10px 14px;
  }
  
  .search-input:focus {
    width: 150px;
  }
  
  .lang-text {
    display: none;
  }
  
  .language-chooser {
    padding: 10px 12px;
  }
  
  .logo-text {
    font-size: 18px;
  }
  
  .nav-links a {
    padding: 8px 12px;
    font-size: 13px;
  }
}
</style>