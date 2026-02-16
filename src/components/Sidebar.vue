<template>
  <aside class="side" :class="{ 'side--collapsed': collapsed }">
    <div class="side__top">
      <div class="brand">
        <div class="brand__mark">KHI</div>
        <div class="brand__text" v-if="!collapsed">
          <div class="brand__title">داشبۆرد</div>
          <div class="brand__sub">ناوەندی کەلەپووری کوردی</div>
        </div>
      </div>

      <button class="toggle" type="button" @click="collapsed = !collapsed">
        <span v-if="collapsed">›</span>
        <span v-else>‹</span>
      </button>
    </div>

    <nav class="nav">
      <RouterLink class="item" to="/admin" exact-active-class="item--active">
        <span class="ico">⌂</span>
        <span class="txt" v-if="!collapsed">سەرەکی</span>
      </RouterLink>

      <div class="sep" v-if="!collapsed">ناوەڕۆک</div>

      <RouterLink v-for="it in items" :key="it.key" class="item" :to="it.to" active-class="item--active">
        <span class="ico">{{ it.icon }}</span>
        <span class="txt" v-if="!collapsed">{{ it.label }}</span>
      </RouterLink>
    </nav>

    <div class="side__bottom">
      <div class="mini" v-if="!collapsed">
        <div class="mini__k">ڕۆڵ</div>
        <div class="mini__v">{{ auth.role || '—' }}</div>
      </div>

      <button class="logout" type="button" @click="doLogout">
        <span class="ico">⟲</span>
        <span class="txt" v-if="!collapsed">چوونەدەرەوە</span>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'

const router = useRouter()
const auth = useAuthStore()
const collapsed = ref(false)

const items = [
  { key: 'projects', label: 'پڕۆژەکان', to: '/admin/projects', icon: '▦' },
  { key: 'news', label: 'هەواڵ', to: '/admin/news', icon: '📰' },
  { key: 'films', label: 'فیلم', to: '/admin/films', icon: '▶' },
  { key: 'image-collections', label: 'کۆمەڵە وێنە', to: '/admin/image-collections', icon: '▧' },
  { key: 'soundtracks', label: 'دەنگ', to: '/admin/soundtracks', icon: '♫' },
  { key: 'albums', label: 'ئالبوم', to: '/admin/albums', icon: '◫' },
  { key: 'writings', label: 'نووسراوەکان', to: '/admin/writings', icon: '✎' },
]

const doLogout = () => {
  auth.logout()
  router.push('/login')
}
</script>

<style scoped>
.side{height:100vh;position:sticky;top:0;display:flex;flex-direction:column;
  background:linear-gradient(180deg,#4A0A0A 0%,#8C1515 55%,#6B0F0F 100%);
  color:#fff;border-left:1px solid rgba(255,255,255,.10);box-shadow:18px 0 60px rgba(0,0,0,.18);overflow:hidden}
.side--collapsed{width:78px!important}
.side__top{display:flex;align-items:center;justify-content:space-between;padding:1rem 1rem .85rem}
.brand{display:flex;align-items:center;gap:.75rem;min-width:0}
.brand__mark{width:44px;height:44px;border-radius:14px;background:rgba(254,221,0,.14);
  border:1px solid rgba(254,221,0,.25);display:flex;align-items:center;justify-content:center;font-weight:1000}
.brand__title{font-weight:1000}
.brand__sub{opacity:.75;font-weight:800;font-size:.78rem;margin-top:.15rem}
.toggle{width:36px;height:36px;border-radius:12px;border:1px solid rgba(255,255,255,.14);
  background:rgba(255,255,255,.06);color:#fff;cursor:pointer;transition:.18s ease}
.toggle:hover{transform:translateY(-1px);background:rgba(255,255,255,.10)}
.nav{padding:.4rem .75rem 1rem;display:flex;flex-direction:column;gap:.35rem}
.sep{margin:.55rem .35rem .25rem;opacity:.75;font-weight:900;font-size:.78rem}
.item{display:flex;align-items:center;gap:.75rem;padding:.75rem .75rem;border-radius:14px;color:#fff;text-decoration:none;
  border:1px solid transparent;transition:.18s ease}
.item:hover{background:rgba(255,255,255,.08);border-color:rgba(255,255,255,.12);transform:translateY(-1px)}
.item--active{background:rgba(254,221,0,.16);border-color:rgba(254,221,0,.22);box-shadow:0 14px 34px rgba(0,0,0,.18)}
.ico{width:34px;height:34px;border-radius:12px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.12);
  display:flex;align-items:center;justify-content:center;flex:0 0 34px}
.txt{font-weight:1000;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.side__bottom{margin-top:auto;padding:1rem .75rem 1rem;border-top:1px solid rgba(255,255,255,.10);background:rgba(0,0,0,.08)}
.mini{padding:.6rem .6rem .8rem}
.mini__k{opacity:.75;font-weight:900;font-size:.78rem}
.mini__v{font-weight:1000;margin-top:.2rem}
.logout{width:100%;display:flex;align-items:center;gap:.75rem;padding:.75rem .75rem;border-radius:14px;
  border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.06);color:#fff;cursor:pointer;transition:.18s ease}
.logout:hover{transform:translateY(-1px);background:rgba(255,255,255,.10)}
</style>
