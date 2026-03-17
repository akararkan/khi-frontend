<template>
  <div class="shell">
    <Sidebar />
    <div class="shell__main">
      <Topbar />
      <main class="shell__content" ref="contentEl">
        <router-view :key="$route.fullPath" />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import Sidebar from '@/components/Sidebar.vue'
import Topbar from '@/components/Topbar.vue'
import { useAdminStore } from '@/stores/useAdminStore'

const route = useRoute()
const adminStore = useAdminStore()
const contentEl = ref(null)

// ── Save scroll position before leaving a route ────────────
let currentPath = ''

watch(() => route.fullPath, (newPath, oldPath) => {
  // Save scroll of the page we're leaving
  if (oldPath && contentEl.value) {
    adminStore.saveScrollPosition(oldPath, contentEl.value.scrollTop)
  }
  currentPath = newPath

  // Track last visited admin route
  adminStore.lastRoute = newPath

  // Restore scroll of the page we're arriving at
  nextTick(() => {
    if (contentEl.value) {
      const saved = adminStore.getScrollPosition(newPath)
      contentEl.value.scrollTop = saved
    }
  })
}, { immediate: true })

onMounted(() => {
  adminStore.lastRoute = route.fullPath
})
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Naskh+Arabic:wght@400;500;600;700&family=Playfair+Display:wght@700;900&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --crimson:     #8C1515;
  --crimson-dk:  #4A0A0A;
  --crimson-lt:  #B01E1E;
  --gold:        #FEDD00;
  --gold-lt:     rgba(254,221,0,.14);
  --cream:       #FAFAF9;
  --cream-dk:    #F2F1EE;
  --border:      #E4E2DE;
  --text:        #2E2D29;
  --muted:       #7A7772;
  --white:       #ffffff;
  --shadow-sm:   0 2px 8px rgba(0,0,0,.06);
  --shadow-md:   0 8px 24px rgba(0,0,0,.09);
  --shadow-lg:   0 18px 50px rgba(0,0,0,.12);
  --radius-sm:   10px;
  --radius-md:   16px;
  --radius-lg:   22px;
  --transition:  .2s cubic-bezier(.4,0,.2,1);
}

html { font-size: 15px; }

body {
  font-family: 'Noto Naskh Arabic', serif;
  background: var(--cream);
  color: var(--text);
  direction: rtl;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

button { font-family: inherit; }
input, textarea, select { font-family: inherit; }

::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--border); border-radius: 99px; }
::-webkit-scrollbar-thumb:hover { background: var(--muted); }
</style>

<style scoped>
.shell {
  height: 100vh;
  display: flex;
  background: var(--cream);
  overflow: hidden; /* Prevent body-level scroll — each panel scrolls independently */
}

.shell__main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  height: 100vh;       /* Fill viewport exactly */
  overflow: hidden;    /* Children handle their own scroll */
}

.shell__content {
  flex: 1;
  padding: 1.5rem 1.75rem;
  overflow-y: auto;    /* This is the scrollable main content area */
  overflow-x: hidden;
  min-height: 0;       /* CRITICAL: allows flex child to shrink below content size */
}
</style>
