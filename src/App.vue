<script setup>
import { computed, ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Footer from './components/Footer.vue'
import NavBar from './components/NavBar.vue'
import { useLanguageStore } from '@/stores/useLanguageStore'

const route  = useRoute()
const router = useRouter()
const lang   = useLanguageStore()
const ready  = ref(false)

router.isReady().then(() => { ready.value = true })

const isAdmin = computed(() => route.path.startsWith('/admin'))

onMounted(() => {
  if (!isAdmin.value) {
    lang.restoreLanguage()
  }
})

watch(isAdmin, (adminPage) => {
  if (!adminPage) {
    lang.restoreLanguage()
  } else {
    document.documentElement.dir  = 'rtl'
    document.documentElement.lang = 'ckb'
  }
})
</script>

<template>
  <template v-if="ready">
    <!-- ── ADMIN pages: no NavBar/Footer ── -->
    <template v-if="isAdmin">
      <router-view />
    </template>

    <!-- ── USER pages: NavBar + Footer always visible ── -->
    <template v-else>
      <div :dir="lang.dir" :lang="lang.strings.code" class="user-root">
        <!-- 
          NavBar is OUTSIDE the scrollable content area.
          This ensures it's ALWAYS visible regardless of page content.
        -->
        <NavBar />

        <main class="page-content">
          <router-view v-slot="{ Component, route: currentRoute }">
            <component :is="Component" :key="currentRoute.path" />
          </router-view>
        </main>

        <Footer />
      </div>
    </template>
  </template>
</template>

<style>
/* ── Reset ────────────────────────────────────────────────────────── */
* {
  font-family: "Rabar", sans-serif;
}

/* ── Root layout ──────────────────────────────────────────────────── */
html, body {
  margin: 0;
  padding: 0;
  /* CRITICAL: Never set overflow:hidden on html/body — it breaks sticky */
  overflow-x: hidden;
}

.user-root {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  /* 
    CRITICAL: Do NOT set overflow:hidden here.
    overflow:hidden on ANY ancestor kills position:sticky on the NavBar.
  */
  position: relative;
}

.user-root[dir="ltr"] {
  text-align: left;
}
.user-root[dir="rtl"] {
  text-align: right;
}

/* ── Page content area ────────────────────────────────────────────── */
.page-content {
  flex: 1;
  /* 
    This ensures the content area grows to fill space,
    pushing the Footer to the bottom even on short pages.
  */
}

/*
  ── SAFETY NET ─────────────────────────────────────────────────────
  Prevent ANY page component from accidentally covering the navbar.
  The navbar uses z-index:100, so we cap page content below that.
*/
.page-content > * {
  position: relative;
  z-index: 1;
}

/*
  ── FIX for full-height pages ──────────────────────────────────────
  If any page uses 100vh, it should subtract the navbar height.
  Use this CSS variable in your page components:
*/
:root {
  --navbar-height: 72px;
}
@media (min-width: 768px)  { :root { --navbar-height: 78px; } }
@media (min-width: 1024px) { :root { --navbar-height: 84px; } }
</style>