<template>
  <div class="wrap">
    <h2 class="title">{{ isEdit ? 'دەستکاری' : 'زیادکردن' }} <span class="accent">{{ resourceLabel }}</span></h2>

    <div class="card">
      <div class="field">
        <label>ناونیشان</label>
        <input v-model="title" placeholder="ناونیشان بنووسە" />
      </div>

      <div class="field">
        <label>دەربارە</label>
        <textarea v-model="desc" placeholder="کورتەیەک بنووسە"></textarea>
      </div>

      <div class="actions">
        <button class="btn" type="button">{{ isEdit ? 'پاشەکەوتکردنی گۆڕانکاری' : 'دروستکردن' }}</button>
        <RouterLink class="link" :to="`/admin/${resource}`">گەڕانەوە</RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const resource = computed(() => route.params.resource)
const isEdit = computed(() => !!route.params.id)

const title = ref('')
const desc = ref('')

const map = {
  projects:'پڕۆژەکان', news:'هەواڵ', films:'فیلم',
  'image-collections':'کۆمەڵە وێنە', soundtracks:'دەنگ',
  albums:'ئالبوم', writings:'نووسراوەکان',
}
const resourceLabel = computed(() => map[resource.value] || resource.value)
</script>

<style scoped>
.wrap{direction:rtl;max-width:860px;margin:0 auto}
.title{margin:0 0 1rem;font-size:1.35rem;font-weight:1000;color:#2E2D29}
.accent{color:#8C1515}
.card{background:#fff;border:1px solid #E0DFDC;border-radius:16px;padding:1rem;box-shadow:0 14px 40px rgba(0,0,0,.07)}
.field{display:flex;flex-direction:column;gap:.45rem;margin-bottom:1rem}
label{font-weight:1000;color:#2E2D29}
input,textarea{border:1.6px solid #E0DFDC;border-radius:14px;padding:.9rem 1rem;outline:none;background:#FAFAF9;transition:.18s ease}
textarea{min-height:120px;resize:vertical}
input:focus,textarea:focus{background:#fff;border-color:#8C1515;box-shadow:0 0 0 3px rgba(140,21,21,.12)}
.actions{display:flex;align-items:center;gap:.75rem;flex-wrap:wrap}
.btn{background:#8C1515;color:#fff;border:none;padding:.8rem 1rem;border-radius:12px;font-weight:1000;cursor:pointer;
  box-shadow:0 12px 30px rgba(140,21,21,.18);transition:.18s ease}
.btn:hover{transform:translateY(-1px)}
.link{color:#767571;font-weight:1000;text-decoration:none}
.link:hover{color:#8C1515}
</style>
