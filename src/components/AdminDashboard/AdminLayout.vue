<template>
  <div class="admin-shell">
    <Sidebar class="admin-shell__sidebar" />
    <div class="admin-shell__main">
      <Topbar class="admin-shell__topbar" />
      <section class="admin-shell__content">
        <router-view />
      </section>
    </div>
  </div>
</template>

<script setup>
import Sidebar from '@/components/Sidebar.vue'
import Topbar from '@/components/Topbar.vue'
</script>

<style scoped>
.admin-shell{min-height:100vh;display:flex;background:#FAFAF9;direction:rtl}
.admin-shell__sidebar{width:290px;flex:0 0 290px}
.admin-shell__main{flex:1;display:flex;flex-direction:column;min-width:0}
.admin-shell__content{flex:1;padding:1.25rem;min-width:0}
</style>
