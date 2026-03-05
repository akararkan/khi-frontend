<template>
  <div class="alist" dir="rtl">

    <!-- ── HEADER ── -->
    <div class="alist__head">
      <div>
        <h1 class="alist__title">دەربارەکان</h1>
        <p class="alist__sub">بینین، گەڕان و بەڕێوەبردنی هەموو پەڕەکانی دەربارە</p>
      </div>
      <RouterLink class="btn btn--primary" to="/admin/about/new">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        دەربارەی نوێ
      </RouterLink>
    </div>

    <!-- ── SEARCH BAR ── -->
    <div class="alist__bar">
      <div class="search">
        <svg class="search__ico" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
        <input v-model="searchQ" class="search__input" placeholder="گەڕان بە ناونیشان، سلەگ…" />
        <Transition name="fade">
          <button v-if="searchQ" class="search__clear" @click="searchQ = ''">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </Transition>
      </div>
      <select v-model="filterStatus" class="sel">
        <option value="">هەموو دۆخەکان</option>
        <option value="active">چالاک</option>
        <option value="inactive">ناچالاک</option>
      </select>
    </div>

    <!-- ── TOAST ── -->
    <Transition name="slide-down">
      <div v-if="toast.show" class="toast" :class="`toast--${toast.type}`">
        <span class="toast__ico">{{ toast.type === 'success' ? '✓' : '✕' }}</span>
        {{ toast.msg }}
      </div>
    </Transition>

    <!-- ── SKELETON ── -->
    <div v-if="loading" class="skeletons">
      <div class="skel" v-for="i in 4" :key="i" :style="{ animationDelay: `${i * 0.07}s` }"></div>
    </div>

    <!-- ── ERROR ── -->
    <div v-else-if="error" class="state-box state-box--error">
      <div class="state-box__ico">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      </div>
      <p>{{ error }}</p>
      <button class="btn btn--ghost btn--sm" @click="load">دووبارەتەکەیەوە</button>
    </div>

    <!-- ── EMPTY ── -->
    <div v-else-if="!visibleItems.length" class="state-box">
      <div class="state-box__ico">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
        </svg>
      </div>
      <p>هیچ دەربارەیەک نەدۆزرایەوە</p>
      <RouterLink class="btn btn--primary btn--sm" to="/admin/about/new">یەکەمین دەربارە زیاد بکە</RouterLink>
    </div>

    <!-- ── TABLE ── -->
    <div v-else class="table-wrap">
      <div class="table-meta">
        کۆی {{ visibleItems.length }} دەربارە
        <span v-if="searchQ"> — ئەنجامی گەڕان بۆ «{{ searchQ }}»</span>
      </div>
      <table class="tbl">
        <thead>
          <tr>
            <th style="width:52px">#</th>
            <th>ناونیشان</th>
            <th>سلەگ</th>
            <th style="width:200px">ژێرناونیشان</th>
            <th style="width:90px">بلۆکەکان</th>
            <th style="width:100px">دۆخ</th>
            <th style="width:130px">بەروار</th>
            <th style="width:116px">کردار</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="a in visibleItems" :key="a.id" class="tbl__row" @click="openDetail(a)">
            <td><span class="tbl__id">#{{ a.id }}</span></td>
            <td><div class="tbl__name">{{ a.title || '—' }}</div></td>
            <td><span class="slug-pill">{{ a.slug }}</span></td>
            <td><div class="tbl__sub-text">{{ truncate(a.subtitle, 40) || '—' }}</div></td>
            <td>
              <span class="media-pill" v-if="(a.blocks || []).length">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 7h8M8 12h8M8 17h5"/>
                </svg>
                {{ (a.blocks || []).length }}
              </span>
              <span v-else class="tbl__dash">—</span>
            </td>
            <td>
              <span class="status-pill" :class="a.active ? 'status-pill--published' : 'status-pill--draft'">
                <span class="status-pill__dot"></span>
                {{ a.active ? 'چالاک' : 'ناچالاک' }}
              </span>
            </td>
            <td class="tbl__date">{{ fmtDate(a.createdAt) }}</td>
            <td @click.stop>
              <div class="tbl__acts">
                <button class="act act--view" title="تەواوی زانیاری" @click="openDetail(a)">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                  </svg>
                </button>
                <RouterLink class="act act--edit" :to="`/admin/about/${a.id}/edit`">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4z"/>
                  </svg>
                </RouterLink>
                <button class="act act--del" @click="confirmDelete(a)">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/>
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- ══ DELETE MODAL ══ -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="delTarget" class="overlay" @click.self="delTarget = null">
          <div class="del-modal">
            <div class="del-modal__ico">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#8C1515" stroke-width="2">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                <path d="M10 11v6M14 11v6"/>
                <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
              </svg>
            </div>
            <h3 class="del-modal__title">دڵنیای لە سڕینەوە؟</h3>
            <p class="del-modal__body">
              دەربارەی <strong>«{{ delTarget.title || delTarget.slug }}»</strong><br/>
              بە تەواوی سڕاوەتەوە و ناگەڕێتەوە.
            </p>
            <div class="del-modal__acts">
              <button class="btn btn--ghost" @click="delTarget = null">نەخێر</button>
              <button class="btn btn--danger" :disabled="deleting" @click="doDelete">
                <span v-if="deleting" class="spinner"></span>
                {{ deleting ? '…' : 'بەڵێ، بیسڕەوە' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ══ DETAIL MODAL ══ -->
    <Teleport to="body">
      <Transition name="pdm-fade">
        <div v-if="detail" class="pdm-overlay" tabindex="0" @click.self="closeDetail">
          <Transition name="pdm-rise" appear>
            <div v-if="detail" class="pdm" role="dialog" :aria-label="detail.title">
              <button class="pdm-x" @click="closeDetail" aria-label="داخستن">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
              <div class="pdm-content">
                <div class="pdm-info__head">
                  <div class="pdm-info__head-meta">
                    <span class="pdm-id-tag"># {{ detail.id }}</span>
                    <span class="pdm-status-badge" :class="detail.active ? 'pdm-status-badge--published' : 'pdm-status-badge--draft'">
                      <span class="pdm-status-badge__dot"></span>
                      {{ detail.active ? 'چالاک' : 'ناچالاک' }}
                    </span>
                  </div>
                  <h2 class="pdm-title">{{ detail.title }}</h2>
                  <p class="pdm-subtitle" v-if="detail.subtitle">{{ detail.subtitle }}</p>
                  <p class="pdm-slug">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
                      <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
                    </svg>
                    {{ detail.slug }}
                  </p>
                  <p class="pdm-meta-desc" v-if="detail.metaDescription">{{ detail.metaDescription }}</p>
                  <RouterLink class="pdm-edit-btn" :to="`/admin/about/${detail.id}/edit`" @click="closeDetail">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4z"/>
                    </svg>
                    دەستکاری
                  </RouterLink>
                </div>
                <div class="pdm-blocks" v-if="(detail.blocks || []).length">
                  <h3 class="pdm-blocks__title">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 7h8M8 12h8M8 17h5"/>
                    </svg>
                    بلۆکەکان ({{ detail.blocks.length }})
                  </h3>
                  <div class="block-preview" v-for="(b, idx) in detail.blocks" :key="idx">
                    <div class="block-preview__seq">{{ idx + 1 }}</div>
                    <div class="block-preview__info">
                      <span class="block-preview__type" :class="`block-preview__type--${b.contentType.toLowerCase()}`">
                        {{ blockTypeLabel(b.contentType) }}
                      </span>
                      <span class="block-preview__title" v-if="b.title">{{ b.title }}</span>
                      <p class="block-preview__text" v-if="b.contentText">{{ truncate(b.contentText, 120) }}</p>
                      <div class="block-preview__media" v-if="b.mediaUrl">
                        <img v-if="b.contentType === 'IMAGE'" :src="b.mediaUrl" loading="lazy" />
                        <span v-else class="block-preview__media-url">{{ b.mediaUrl }}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="pdm-dates">
                  <span v-if="detail.createdAt">دروستکراوە: {{ detail.createdAt }}</span>
                  <span v-if="detail.updatedAt">نوێکراوەتەوە: {{ detail.updatedAt }}</span>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/api.js'

const items        = ref([])
const loading      = ref(false)
const error        = ref('')
const searchQ      = ref('')
const filterStatus = ref('')
const delTarget    = ref(null)
const deleting     = ref(false)
const detail       = ref(null)
const toast        = ref({ show: false, type: 'success', msg: '' })

// ── Load ─────────────────────────────────────────────────────────
async function load() {
  loading.value = true
  error.value   = ''
  try {
    const { data } = await api.get('/api/v1/about')
    // Backend wraps response in ApiResponse → payload is at data.data
    const list = data?.data ?? data
    items.value = Array.isArray(list) ? list : []
  } catch (e) {
    error.value = e?.response?.data?.message || e.message || 'هەڵەیەک ڕوویدا'
  } finally {
    loading.value = false
  }
}

// ── Search & Filter ──────────────────────────────────────────────
const visibleItems = computed(() => {
  let pool = [...items.value]
  if (searchQ.value.trim()) {
    const q = searchQ.value.trim().toLowerCase()
    pool = pool.filter(a =>
      (a.title    || '').toLowerCase().includes(q) ||
      (a.slug     || '').toLowerCase().includes(q) ||
      (a.subtitle || '').toLowerCase().includes(q)
    )
  }
  if (filterStatus.value === 'active')   pool = pool.filter(a =>  a.active)
  if (filterStatus.value === 'inactive') pool = pool.filter(a => !a.active)
  return pool
})

// ── Detail ───────────────────────────────────────────────────────
function openDetail(a) { detail.value = a }
function closeDetail()  { detail.value = null }

// ── Delete ───────────────────────────────────────────────────────
function confirmDelete(a) { delTarget.value = a }

async function doDelete() {
  if (!delTarget.value) return
  deleting.value = true
  const targetId = delTarget.value.id
  try {
    await api.delete(`/api/v1/about/${targetId}`)
    items.value = items.value.filter(x => x.id !== targetId)
    if (detail.value?.id === targetId) closeDetail()
    showToast('success', 'دەربارەکە سڕایەوە ✓')
    delTarget.value = null
  } catch (e) {
    showToast('error', e?.response?.data?.message || 'سڕینەوە سەرکەوتوو نەبوو')
  } finally {
    deleting.value = false
  }
}

// ── Helpers ──────────────────────────────────────────────────────
function showToast(type, msg) {
  toast.value = { show: true, type, msg }
  setTimeout(() => { toast.value.show = false }, 3500)
}
function fmtDate(d) {
  if (!d) return '—'
  try   { return new Date(d).toLocaleDateString('ku', { year: 'numeric', month: 'short', day: 'numeric' }) }
  catch { return String(d).slice(0, 10) }
}
function truncate(s, n) {
  if (!s) return ''
  return s.length > n ? s.slice(0, n) + '…' : s
}
const blockTypeLabelMap = {
  TEXT: 'دەق', IMAGE: 'وێنە', VIDEO: 'ڤیدیۆ',
  AUDIO: 'دەنگ', GALLERY: 'گالەری', QUOTE: 'وتە', STATS: 'ئامار'
}
function blockTypeLabel(t) { return blockTypeLabelMap[t] || t }

onMounted(load)
</script>

<style scoped>
:root {
  --crimson: #8C1515; --crimson-soft: #faf0f0;
  --text: #2E2D29; --muted: #767571; --border: #E0DFDC;
  --white: #fff; --bg: #FAFAF9; --shadow-sm: 0 8px 24px rgba(0,0,0,.04);
}
.alist { direction: rtl; max-width: 1200px; margin: 0 auto; }
.alist__head { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; margin-bottom: 1rem; }
.alist__title { margin: 0 0 .35rem; font-size: clamp(1.2rem, 2vw, 2rem); font-weight: 900; color: var(--text, #2E2D29); }
.alist__sub { margin: 0; color: var(--muted, #767571); font-weight: 600; line-height: 1.6; }
.alist__bar { display: grid; grid-template-columns: 1fr 160px; gap: .75rem; margin-bottom: 1rem; }
@media (max-width: 700px) { .alist__bar { grid-template-columns: 1fr; } }
.search { height: 48px; border: 1px solid var(--border, #E0DFDC); background: var(--white, #fff); border-radius: 12px; display: flex; align-items: center; padding: 0 .8rem; gap: .55rem; color: var(--muted, #767571); transition: border-color .2s; }
.search:focus-within { border-color: var(--crimson, #8C1515); }
.search__ico { flex-shrink: 0; }
.search__input { border: none; outline: none; width: 100%; background: transparent; color: var(--text, #2E2D29); font: inherit; }
.search__clear { border: none; background: #f0eeeb; border-radius: 50%; width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--muted, #767571); }
.sel { height: 48px; border: 1px solid var(--border, #E0DFDC); background: var(--white, #fff); border-radius: 12px; padding: 0 .9rem; font-weight: 700; color: var(--muted, #767571); font: inherit; cursor: pointer; outline: none; }
.sel:focus { border-color: var(--crimson, #8C1515); }
.toast { position: fixed; top: 1.2rem; left: 50%; transform: translateX(-50%); z-index: 9999; padding: .7rem 1.2rem; border-radius: 12px; font-weight: 700; display: flex; align-items: center; gap: .5rem; box-shadow: 0 12px 32px rgba(0,0,0,.12); }
.toast--success { background: #065f46; color: #fff; }
.toast--error   { background: #8C1515; color: #fff; }
.toast__ico { font-size: 1.1rem; }
.slide-down-enter-active, .slide-down-leave-active { transition: all .35s ease; }
.slide-down-enter-from, .slide-down-leave-to { opacity: 0; transform: translate(-50%, -20px); }
.skeletons { display: flex; flex-direction: column; gap: .6rem; }
.skel { height: 52px; border-radius: 12px; background: linear-gradient(90deg, #f0eeeb 25%, #e8e5e1 50%, #f0eeeb 75%); background-size: 200% 100%; animation: shimmer 1.4s ease infinite; }
@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
.state-box { background: var(--white, #fff); border: 1px solid var(--border, #E0DFDC); border-radius: 18px; min-height: 220px; box-shadow: var(--shadow-sm); display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 2rem; text-align: center; gap: .6rem; }
.state-box--error { border-color: #f5c6c6; }
.state-box__ico { width: 56px; height: 56px; border-radius: 50%; background: #FAFAF9; border: 1px solid var(--border, #E0DFDC); display: flex; align-items: center; justify-content: center; color: var(--muted, #767571); }
.state-box p { color: var(--muted, #767571); font-weight: 600; }
.table-wrap { background: var(--white, #fff); border: 1px solid var(--border, #E0DFDC); border-radius: 18px; box-shadow: var(--shadow-sm); overflow: hidden; }
.table-meta { padding: .85rem 1.2rem; font-weight: 700; color: var(--muted, #767571); font-size: .85rem; border-bottom: 1px solid var(--border, #E0DFDC); }
.tbl { width: 100%; border-collapse: collapse; font-size: .88rem; }
.tbl thead th { text-align: right; padding: .75rem .7rem; font-weight: 800; color: var(--muted, #767571); font-size: .78rem; border-bottom: 1px solid var(--border, #E0DFDC); background: #FAFAF9; white-space: nowrap; }
.tbl tbody td { padding: .7rem; border-bottom: 1px solid #f0eeeb; vertical-align: middle; }
.tbl__row { cursor: pointer; transition: background .15s; }
.tbl__row:hover { background: #FAFAF9; }
.tbl__id { font-weight: 700; color: var(--muted, #767571); font-size: .8rem; background: #f0eeeb; padding: .15rem .45rem; border-radius: 6px; }
.tbl__name { font-weight: 800; color: var(--text, #2E2D29); line-height: 1.4; }
.tbl__sub-text { color: var(--muted, #767571); font-size: .83rem; line-height: 1.4; }
.tbl__date { color: var(--muted, #767571); font-size: .82rem; white-space: nowrap; }
.tbl__dash { color: #ccc; }
.slug-pill { display: inline-block; padding: .2rem .6rem; border-radius: 8px; background: #f0eeeb; font-family: monospace; font-size: .8rem; color: var(--muted, #767571); font-weight: 600; }
.media-pill { display: inline-flex; align-items: center; gap: .3rem; padding: .2rem .5rem; border-radius: 8px; font-weight: 700; background: #eef6ff; color: #1d4ed8; font-size: .82rem; }
.status-pill { display: inline-flex; align-items: center; gap: .35rem; padding: .2rem .6rem; border-radius: 8px; font-weight: 700; font-size: .8rem; }
.status-pill--published { background: #ecfdf5; color: #065f46; }
.status-pill--draft     { background: #fef3c7; color: #92400e; }
.status-pill__dot { width: 7px; height: 7px; border-radius: 50%; }
.status-pill--published .status-pill__dot { background: #10b981; }
.status-pill--draft .status-pill__dot     { background: #f59e0b; }
.tbl__acts { display: flex; gap: .35rem; }
.act { width: 32px; height: 32px; border-radius: 8px; border: 1px solid var(--border, #E0DFDC); background: var(--white, #fff); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all .15s; color: var(--muted, #767571); text-decoration: none; }
.act:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,.06); }
.act--view:hover { border-color: #3b82f6; color: #3b82f6; background: #eff6ff; }
.act--edit:hover { border-color: #8C1515; color: #8C1515; background: #faf0f0; }
.act--del:hover  { border-color: #dc2626; color: #dc2626; background: #fef2f2; }
.btn { display: inline-flex; align-items: center; justify-content: center; gap: .4rem; text-decoration: none; border-radius: 12px; padding: .75rem 1rem; font-weight: 900; border: 1px solid transparent; transition: .18s ease; white-space: nowrap; cursor: pointer; font: inherit; }
.btn:hover { transform: translateY(-1px); }
.btn--primary { background: #8C1515; color: #fff; box-shadow: 0 10px 24px rgba(140,21,21,.18); }
.btn--ghost   { background: #fff; color: #6E6B66; border-color: #E0DFDC; }
.btn--danger  { background: #dc2626; color: #fff; }
.btn--sm      { padding: .55rem .85rem; font-size: .88rem; }
.overlay { position: fixed; inset: 0; z-index: 10000; background: rgba(0,0,0,.45); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; }
.del-modal { background: #fff; border-radius: 20px; padding: 2rem; max-width: 400px; width: 90%; text-align: center; box-shadow: 0 24px 64px rgba(0,0,0,.15); }
.del-modal__ico { width: 64px; height: 64px; border-radius: 50%; background: #fef2f2; border: 2px solid #fecaca; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; }
.del-modal__title { font-weight: 900; color: var(--text, #2E2D29); margin: 0 0 .5rem; }
.del-modal__body  { color: var(--muted, #767571); line-height: 1.7; margin: 0 0 1.2rem; }
.del-modal__acts  { display: flex; gap: .6rem; justify-content: center; }
.modal-enter-active, .modal-leave-active { transition: all .3s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-from .del-modal, .modal-leave-to .del-modal { transform: scale(.92); }
.pdm-overlay { position: fixed; inset: 0; z-index: 10000; background: rgba(0,0,0,.5); backdrop-filter: blur(6px); display: flex; align-items: center; justify-content: center; padding: 1.5rem; }
.pdm { background: #fff; border-radius: 22px; max-width: 680px; width: 100%; max-height: 85vh; overflow-y: auto; position: relative; box-shadow: 0 32px 80px rgba(0,0,0,.2); }
.pdm-x { position: absolute; top: 1rem; left: 1rem; width: 36px; height: 36px; border-radius: 10px; background: #f0eeeb; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--muted, #767571); transition: all .15s; z-index: 2; }
.pdm-x:hover { background: #e8e5e1; color: var(--text, #2E2D29); }
.pdm-content { padding: 2rem; }
.pdm-info__head { margin-bottom: 1.5rem; }
.pdm-info__head-meta { display: flex; gap: .5rem; align-items: center; flex-wrap: wrap; margin-bottom: .75rem; }
.pdm-id-tag { font-weight: 700; color: var(--muted, #767571); font-size: .8rem; background: #f0eeeb; padding: .15rem .5rem; border-radius: 6px; }
.pdm-status-badge { display: inline-flex; align-items: center; gap: .3rem; padding: .2rem .6rem; border-radius: 8px; font-weight: 700; font-size: .8rem; }
.pdm-status-badge--published { background: #ecfdf5; color: #065f46; }
.pdm-status-badge--draft     { background: #fef3c7; color: #92400e; }
.pdm-status-badge__dot { width: 7px; height: 7px; border-radius: 50%; }
.pdm-status-badge--published .pdm-status-badge__dot { background: #10b981; }
.pdm-status-badge--draft .pdm-status-badge__dot     { background: #f59e0b; }
.pdm-title    { font-weight: 900; font-size: 1.4rem; color: var(--text, #2E2D29); margin: 0 0 .3rem; }
.pdm-subtitle { color: var(--muted, #767571); margin: 0 0 .5rem; font-weight: 600; }
.pdm-slug { display: inline-flex; align-items: center; gap: .4rem; font-family: monospace; font-size: .85rem; color: var(--muted, #767571); background: #f0eeeb; padding: .25rem .6rem; border-radius: 8px; margin-bottom: .6rem; }
.pdm-meta-desc { color: var(--muted, #767571); font-size: .88rem; line-height: 1.6; margin: .5rem 0; }
.pdm-edit-btn { display: inline-flex; align-items: center; gap: .4rem; text-decoration: none; font-weight: 800; font-size: .88rem; color: #8C1515; margin-top: .6rem; padding: .5rem .9rem; border-radius: 10px; background: #faf0f0; transition: all .15s; }
.pdm-edit-btn:hover { background: #f5e0e0; }
.pdm-blocks { margin-top: 1.5rem; }
.pdm-blocks__title { display: flex; align-items: center; gap: .5rem; font-weight: 800; color: var(--text, #2E2D29); margin: 0 0 .8rem; font-size: .95rem; }
.block-preview { display: flex; gap: .75rem; padding: .75rem; border: 1px solid #f0eeeb; border-radius: 12px; margin-bottom: .5rem; transition: background .15s; }
.block-preview:hover { background: #FAFAF9; }
.block-preview__seq { width: 28px; height: 28px; border-radius: 8px; background: #f0eeeb; color: var(--muted, #767571); display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: .8rem; flex-shrink: 0; }
.block-preview__info { flex: 1; min-width: 0; }
.block-preview__type { display: inline-block; padding: .12rem .5rem; border-radius: 6px; font-weight: 700; font-size: .75rem; margin-bottom: .3rem; }
.block-preview__type--text    { background: #eff6ff; color: #1d4ed8; }
.block-preview__type--image   { background: #ecfdf5; color: #065f46; }
.block-preview__type--video   { background: #fef3c7; color: #92400e; }
.block-preview__type--audio   { background: #fdf4ff; color: #7c3aed; }
.block-preview__type--gallery { background: #fff7ed; color: #c2410c; }
.block-preview__type--quote   { background: #f0eeeb; color: #57534e; }
.block-preview__type--stats   { background: #f0fdf4; color: #166534; }
.block-preview__title { font-weight: 700; font-size: .88rem; color: var(--text, #2E2D29); display: block; }
.block-preview__text  { color: var(--muted, #767571); font-size: .83rem; margin: .2rem 0 0; line-height: 1.5; }
.block-preview__media img { max-width: 120px; max-height: 60px; border-radius: 8px; margin-top: .4rem; object-fit: cover; }
.block-preview__media-url { font-family: monospace; font-size: .75rem; color: var(--muted, #767571); }
.pdm-dates { margin-top: 1.2rem; padding-top: .8rem; border-top: 1px solid #f0eeeb; display: flex; flex-direction: column; gap: .3rem; font-size: .82rem; color: var(--muted, #767571); }
.pdm-fade-enter-active, .pdm-fade-leave-active { transition: opacity .3s ease; }
.pdm-fade-enter-from, .pdm-fade-leave-to { opacity: 0; }
.pdm-rise-enter-active { transition: all .35s cubic-bezier(.16,1,.3,1); }
.pdm-rise-leave-active { transition: all .25s ease; }
.pdm-rise-enter-from { opacity: 0; transform: translateY(24px) scale(.96); }
.pdm-rise-leave-to   { opacity: 0; transform: translateY(12px) scale(.98); }
.fade-enter-active, .fade-leave-active { transition: opacity .2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.spinner { width: 16px; height: 16px; border-radius: 50%; border: 2px solid rgba(255,255,255,.3); border-top-color: #fff; animation: spin .7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>