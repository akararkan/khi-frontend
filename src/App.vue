<script setup>
import Footer from './components/Footer.vue';
import NavBar from './components/NavBar.vue';

</script>

<template>
  <NavBar />
    <div>
    <router-view></router-view>
  </div>
  <Footer />
</template>

<style scoped></style>
