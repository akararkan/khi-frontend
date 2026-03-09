<script setup>
import { computed, ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Footer from './components/Footer.vue'
import NavBar from './components/NavBar.vue'
import { useLanguageStore } from '@/stores/useLanguageStore'

const route   = useRoute()
const router  = useRouter()
const lang    = useLanguageStore()
const ready   = ref(false)

router.isReady().then(() => { ready.value = true })

const isAdmin = computed(() => route.path.startsWith('/admin'))

onMounted(() => {
  // Only restore/apply language for non-admin pages
  if (!isAdmin.value) {
    lang.restoreLanguage()
  }
})

// When navigating between admin <-> user pages, apply/remove language settings
watch(isAdmin, (adminPage) => {
  if (!adminPage) {
    // Entering a user page — apply the saved language
    lang.restoreLanguage()
  } else {
    // Entering admin — reset to neutral RTL (Kurdish default) without touching localStorage
    document.documentElement.dir  = 'rtl'
    document.documentElement.lang = 'ckb'
  }
})
</script>

<template>
  <template v-if="ready">

    <!-- ── ADMIN pages: no language switching, no NavBar/Footer ── -->
    <template v-if="isAdmin">
      <router-view />
    </template>

    <!-- ── USER pages: language-aware wrapper ── -->
    <template v-else>
      <div :dir="lang.dir" :lang="lang.strings.code" class="user-root">
        <NavBar />
        <router-view />
        <Footer />
      </div>
    </template>

  </template>
</template>

<style>
*{
  font-family: "Rabar", sans-serif;
}

/* Applied only inside the user-facing wrapper */
.user-root {
  min-height: 100vh;
}

.user-root[dir="ltr"] {
  text-align: left;
}

.user-root[dir="rtl"] {
  text-align: right;
}
</style>