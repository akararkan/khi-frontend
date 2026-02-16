<template>
  <div class="wrap">
    <h2 class="title">لیستی <span class="accent">{{ resourceLabel }}</span></h2>
    <p class="sub">ئەمە placeholder ـە، دواتر API پێوە دەبەستین.</p>

    <div class="actions">
      <RouterLink class="btn" :to="`/admin/${resource}/new`">زیادکردنی نوێ</RouterLink>
    </div>

    <div class="box">
      <div class="row head">
        <div>ناو</div><div>دۆخ</div><div>کردار</div>
      </div>

      <div class="row">
        <div class="muted">نمونە #1</div>
        <div class="pill">چالاک</div>
        <div><RouterLink class="link" :to="`/admin/${resource}/1/edit`">دەستکاری</RouterLink></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const resource = computed(() => route.params.resource)

const map = {
  projects:'پڕۆژەکان', news:'هەواڵ', films:'فیلم',
  'image-collections':'کۆمەڵە وێنە', soundtracks:'دەنگ',
  albums:'ئالبوم', writings:'نووسراوەکان',
}
const resourceLabel = computed(() => map[resource.value] || resource.value)
</script>

<style scoped>
.wrap{direction:rtl;max-width:1100px;margin:0 auto}
.title{margin:0 0 .35rem;font-size:1.35rem;font-weight:1000;color:#2E2D29}
.accent{color:#8C1515}
.sub{margin:0 0 1rem;color:#767571;font-weight:800}
.actions{display:flex;justify-content:flex-start;margin-bottom:1rem}
.btn{background:#8C1515;color:#fff;text-decoration:none;padding:.75rem 1rem;border-radius:12px;font-weight:1000;
  box-shadow:0 12px 30px rgba(140,21,21,.18);transition:.18s ease}
.btn:hover{transform:translateY(-1px)}
.box{background:#fff;border:1px solid #E0DFDC;border-radius:16px;overflow:hidden}
.row{display:grid;grid-template-columns:2fr 1fr 1fr;gap:1rem;padding:.9rem 1rem;align-items:center}
.head{background:#FAFAF9;font-weight:1000;color:#2E2D29;border-bottom:1px solid #F0EFED}
.muted{color:#767571;font-weight:900}
.pill{display:inline-flex;justify-content:center;padding:.25rem .6rem;background:rgba(254,221,0,.18);
  border:1px solid rgba(254,221,0,.35);border-radius:999px;font-weight:1000;color:#2E2D29}
.link{color:#8C1515;font-weight:1000;text-decoration:none}
.link:hover{text-decoration:underline}
</style>
