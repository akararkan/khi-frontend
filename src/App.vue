<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Footer from './components/Footer.vue'
import NavBar from './components/NavBar.vue'

const route    = useRoute()
const router   = useRouter()
const ready    = ref(false)

router.isReady().then(() => { ready.value = true })

const isAdmin = computed(() => route.path.startsWith('/admin'))
</script>

<template>
  <template v-if="ready">
    <NavBar v-if="!isAdmin" />
    <div>
      <router-view />
    </div>
    <Footer v-if="!isAdmin" />
  </template>
</template>

<style scoped></style>