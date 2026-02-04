<template>
  <main id="main-content" class="projects">
    <!-- ========================================
         CLEAN HERO SECTION
         ======================================== -->
    <header class="hero">
      <div class="hero__bg" :style="{ backgroundImage: `url(${heroImage})` }"></div>
      <div class="hero__overlay"></div>

      <div class="container hero__content">
        <div class="heroCard">
          <span class="heroCard__badge">✨ پڕۆژەکان</span>

          <h1 class="heroCard__title">
            هەموو پڕۆژەکانی ناوەند
          </h1>

          <p class="heroCard__sub">
            کاتێک تێکۆشان لەگەڵ فێربوون و تێپەڕبوون
          </p>

          <div class="heroCard__stats">
            <div class="stat">
              <b>{{ totalElements || 0 }}</b>
              <span>پڕۆژە</span>
            </div>
            <div class="stat">
              <b>{{ projects.length }}</b>
              <span>نیشاندراو</span>
            </div>
            <div class="stat">
              <b>{{ loading ? '⏳' : error ? '⚠️' : '✓' }}</b>
              <span>دۆخ</span>
            </div>
          </div>

          <div class="heroCard__actions">
            <button class="btn btn--ghost" @click="resetAllFilters">
              🔄 دووبارەکردنەوە
            </button>

            <span v-if="tagFilter !== 'all'" class="activeTag">
              فلتەر: <b>#{{ tagFilter }}</b>
              <button class="activeTag__x" @click="clearTagFilter" aria-label="Remove tag filter">✕</button>
            </span>
          </div>
        </div>
      </div>
    </header>

    <!-- ========================================
         PROJECTS GRID SECTION
         ======================================== -->
    <section class="section">
      <div class="container">
        <!-- Status line -->
        <div class="topLine">
          <div class="hint">
            <span v-if="loading" class="hint__loading">
              <span class="spinner"></span> بارکردن...
            </span>
            <span v-else-if="error" class="hint__error">
              ⚠️ {{ error }}
            </span>
            <span v-else class="hint__success">
              ✓ {{ filteredProjects.length }} پڕۆژە نیشاندراوە
            </span>
          </div>

          <div class="sort">
            <label class="sort__label">ڕیزکردن:</label>
            <select v-model="sortBy" class="sort__box">
              <option value="newest">نوێترین</option>
              <option value="oldest">کۆنترین</option>
              <option value="title_az">ناونیشان A→Z</option>
              <option value="media_desc">زۆرترین میدیا</option>
            </select>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="!loading && filteredProjects.length === 0" class="empty">
          <div class="empty__icon">📭</div>
          <h3 class="empty__title">هیچ پڕۆژەیەک نەدۆزرایەوە</h3>
          <p class="empty__text">
            تکایە تاگێکی تر هەڵبژێرە یان دووبارەکردنەوە بکە
          </p>
          <button class="btn btn--primary" @click="resetAllFilters">
            فلتەرەکان دووبارە کردنەوە
          </button>
        </div>

        <!-- Projects Grid -->
        <div v-else class="grid">
          <article
            v-for="project in filteredProjects"
            :key="project.id"
            class="card"
            tabindex="0"
            @click="openProjectModal(project)"
            @keyup.enter="openProjectModal(project)"
            role="button"
            :aria-label="`پڕۆژە بینین: ${project.title}`"
          >
            <div class="card__media">
              <img
                :src="project.cover.url"
                :alt="project.title"
                loading="lazy"
                class="card__img"
                @error="onCoverError($event)"
              />

              <span class="badge badge--type">
                {{ project.typeLabel }}
              </span>
            </div>

            <div class="card__body">
              <h3 class="card__title">{{ project.title }}</h3>
              <p class="card__text">{{ truncateText(project.summary, 120) }}</p>

              <div class="meta">
                <span class="meta__pill">{{ project.category }}</span>
                <span class="meta__pill meta__pill--muted">
                  {{ project.media.length }} میدیا
                </span>
                <span class="meta__dot">•</span>
                <span class="meta__date">{{ project.publishedAt }}</span>
              </div>

              <!-- Clickable tags (search by tag) -->
              <div v-if="project.tags.length > 0" class="tags">
                <button
                  v-for="tag in project.tags.slice(0, 3)"
                  :key="tag"
                  class="tag"
                  type="button"
                  @click.stop="filterByTag(tag)"
                  :aria-label="`تاگ فلتەر بکە: ${tag}`"
                >
                  #{{ tag }}
                </button>
                <span v-if="project.tags.length > 3" class="tag tag--more">
                  +{{ project.tags.length - 3 }}
                </span>
              </div>

              <div class="cta">
                <span class="cta__text">بینینی پڕۆژە</span>
                <span class="cta__arrow">→</span>
              </div>
            </div>
          </article>
        </div>

        <!-- Clean Pagination (BOTTOM ONLY) -->
        <div class="pagerWrap" v-if="totalPages > 1">
          <button
            class="pagerBtn"
            :disabled="currentPage === 0 || loading"
            @click="goToPreviousPage"
          >
            ← پێش
          </button>

          <span class="pagerInfo">
            {{ currentPage + 1 }} / {{ totalPages }}
          </span>

          <button
            class="pagerBtn"
            :disabled="currentPage + 1 >= totalPages || loading"
            @click="goToNextPage"
          >
            دواتر →
          </button>
        </div>
      </div>
    </section>

    <!-- ========================================
         PROJECT DETAILS MODAL
         ======================================== -->
    <Teleport to="body">
      <div
        v-if="activeProject"
        class="modal"
        @click.self="closeProjectModal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div class="modal__panel">
          <button class="modal__close" @click="closeProjectModal" aria-label="بندکردن">
            ✕
          </button>

          <!-- Modal Header -->
          <div class="modal__top">
            <div class="modal__titleRow">
              <span class="modal__type">{{ activeProject.typeLabel }}</span>
              <span class="pillMini">{{ activeProject.category }}</span>
              <span class="pillMini">{{ activeProject.publishedAt }}</span>
              <span class="pillMini">{{ activeProject.media.length }} میدیا</span>
            </div>

            <h2 id="modal-title" class="modal__title">{{ activeProject.title }}</h2>
            <p class="modal__summary">{{ activeProject.summary }}</p>

            <!-- Modal tags clickable -->
            <div v-if="activeProject.tags.length > 0" class="modal__tags">
              <button
                v-for="tag in activeProject.tags"
                :key="tag"
                class="tagX"
                type="button"
                @click="filterFromModal(tag)"
              >
                #{{ tag }}
              </button>
            </div>
          </div>

          <!-- Media Gallery -->
          <div class="gallery">
            <div class="gallery__left">
              <!-- Media Preview -->
              <div class="preview">
                <!-- IMAGE -->
                <template v-if="selectedMedia?.mediaType === 'image'">
                  <div class="imgViewer">
                    <img
                      class="preview__img"
                      :src="selectedMedia.url"
                      :alt="selectedMedia.caption || activeProject.title"
                      :style="{ transform: `scale(${zoomLevel})` }"
                      @error="onPreviewError($event)"
                    />
                    <div class="imgViewer__controls">
                      <button class="btnMini" @click="zoomOut" :disabled="zoomLevel <= 1">−</button>
                      <button class="btnMini" @click="zoomIn" :disabled="zoomLevel >= 3">+</button>
                      <button class="btnMini" @click="resetZoom" :disabled="zoomLevel === 1">Reset</button>
                      <a class="btnMini btnMini--link" :href="selectedMedia.url" target="_blank" rel="noopener noreferrer">
                        کردنەوە
                      </a>
                    </div>
                  </div>
                </template>

                <!-- VIDEO -->
                <template v-else-if="selectedMedia?.mediaType === 'video'">
                  <div class="videoPlayer">
                    <video
                      ref="videoPlayer"
                      class="plyrVideo"
                      controls
                      :poster="activeProject.cover.url"
                    >
                      <source :src="selectedMedia.url" type="video/mp4" />
                      وێبگێڕ ئەم تاگی ڤیدیۆ پاڵپشتی ناکات.
                    </video>
                  </div>
                </template>

                <!-- AUDIO -->
                <template v-else-if="selectedMedia?.mediaType === 'audio'">
                  <div class="audioWrap">
                    <img class="audioCover" :src="activeProject.cover.url" :alt="activeProject.title" @error="onCoverError($event)" />
                    <div class="audioMeta">
                      <b>{{ selectedMedia.caption || 'Audio Track' }}</b>
                      <span class="muted">
                        {{ selectedMedia.note || selectedMedia.textBody || 'بێ شرۆڤە' }}
                      </span>
                      <audio ref="audioPlayer" controls class="audioPlayer">
                        <source :src="selectedMedia.url" type="audio/mpeg" />
                        وێبگێڕ ئەم تاگی ئۆدیۆ پاڵپشتی ناکات.
                      </audio>
                    </div>
                  </div>
                </template>

                <!-- DOCUMENT -->
                <template v-else>
                  <div class="preview__doc">
                    <div class="docIcon">{{ getMediaIcon(selectedMedia?.mediaType) }}</div>
                    <div class="docText">
                      <b>{{ selectedMedia?.caption || 'Document' }}</b>
                      <span class="muted">{{ selectedMedia?.url }}</span>
                    </div>
                    <a class="btn btn--primary" :href="selectedMedia?.url" target="_blank" rel="noopener noreferrer">
                      کردنەوە
                    </a>
                  </div>
                </template>
              </div>

              <!-- Media Caption -->
              <div class="caption">
                <b>{{ selectedMedia?.caption || activeProject.title }}</b>
                <p>{{ selectedMedia?.note || selectedMedia?.textBody || activeProject.body }}</p>
              </div>
            </div>

            <!-- Media Thumbnails -->
            <div class="gallery__right">
              <div class="thumbHead">
                <h3 class="thumbHead__title">میدیاکان</h3>
                <span class="thumbHead__sub">{{ activeProject.media.length }} فایل</span>
              </div>

              <div class="thumbs">
                <button
                  v-for="media in activeProject.media"
                  :key="media.id"
                  class="thumb"
                  :class="{ 'is-active': selectedMedia?.id === media.id }"
                  @click="selectMedia(media)"
                  type="button"
                >
                  <div class="thumb__icon">{{ getMediaIcon(media.mediaType) }}</div>
                  <div class="thumb__info">
                    <b class="thumb__title">{{ media.caption || getMediaLabel(media.mediaType) }}</b>
                    <span class="thumb__sub">{{ media.mediaType }}</span>
                  </div>
                </button>
              </div>

              <div class="quickNav">
                <button class="btn btn--ghost" @click="previousMedia" :disabled="!canGoPreviousMedia">
                  ← پێش
                </button>
                <button class="btn btn--ghost" @click="nextMedia" :disabled="!canGoNextMedia">
                  دواتر →
                </button>
              </div>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="modal__foot">
            <button class="btn btn--ghost" @click="closeProjectModal">بندکردن</button>
            <a class="btn btn--primary" :href="selectedMedia?.url" target="_blank" rel="noopener noreferrer">
              داگرتن
            </a>
          </div>
        </div>
      </div>
    </Teleport>
  </main>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import axios from 'axios'
import Plyr from 'plyr'
import 'plyr/dist/plyr.css'

// ✅ USE YOUR CONSTANT FILE
import { API_BASE_URL } from '../consts.js'

/* ============================================
   CONFIGURATION
   ============================================ */
const heroImage =
  'https://images.unsplash.com/photo-1497366216548-37526070297c?w=2000&q=80'
const fallbackCover =
  'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1400&q=80'

/* ============================================
   AXIOS INSTANCE
   ============================================ */
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
})

/* ============================================
   STATE
   ============================================ */
const projects = ref([])
const loading = ref(false)
const error = ref('')

// Pagination
const currentPage = ref(0)
const pageSize = ref(12)
const totalPages = ref(0)
const totalElements = ref(0)

// Filters (ONLY TAG FILTER + SORT NOW)
const tagFilter = ref('all')
const sortBy = ref('newest')

// Modal
const activeProject = ref(null)
const selectedMedia = ref(null)
const zoomLevel = ref(1)

// Media players
const videoPlayer = ref(null)
const audioPlayer = ref(null)
let plyrVideo = null
let plyrAudio = null

/* ============================================
   COMPUTED
   ============================================ */
const filteredProjects = computed(() => {
  let list = [...projects.value]

  // Tag filter (backend fetch also happens, but keep safe client-side too)
  if (tagFilter.value !== 'all') {
    list = list.filter(p => (p.tags || []).includes(tagFilter.value))
  }

  switch (sortBy.value) {
    case 'newest':
      list.sort((a, b) => (b.publishedAt || '').localeCompare(a.publishedAt || ''))
      break
    case 'oldest':
      list.sort((a, b) => (a.publishedAt || '').localeCompare(b.publishedAt || ''))
      break
    case 'title_az':
      list.sort((a, b) => a.title.localeCompare(b.title))
      break
    case 'media_desc':
      list.sort((a, b) => (b.media?.length || 0) - (a.media?.length || 0))
      break
  }

  return list
})

/* ============================================
   HELPERS
   ============================================ */
function isLikelyImageUrl(url) {
  if (!url || typeof url !== 'string') return false
  const u = url.toLowerCase()
  // Reject obvious non-images
  if (u.endsWith('.pdf') || u.endsWith('.mp4') || u.endsWith('.mp3')) return false
  // Accept common image formats
  return (
    u.includes('.jpg') ||
    u.includes('.jpeg') ||
    u.includes('.png') ||
    u.includes('.webp') ||
    u.includes('.gif') ||
    u.includes('image') // many CDNs serve without extension
  )
}

/* ============================================
   NORMALIZER (FIXED COVER HANDLING)
   ============================================ */
function normalizeProject(p) {
  const media = Array.isArray(p.media) ? [...p.media] : []
  media.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))

  const normalizedMedia = media.map(m => ({
    id: m.id ?? `${m.url}-${m.sortOrder}`,
    mediaType: String(m.mediaType || '').toLowerCase(),
    url: m.url || '',
    caption: m.caption || '',
    sortOrder: m.sortOrder ?? 0,
    textBody: m.textBody || '',
    note: m.note || m.textBody || '',
  }))

  // ✅ COVER MUST COME FROM BACKEND "cover" FIRST
  const coverFromBackend =
    typeof p.cover === 'string' ? p.cover : (p.cover?.url || '')

  const firstImageFromMedia = normalizedMedia.find(m => m.mediaType === 'image')?.url || ''

  let coverUrl = coverFromBackend || firstImageFromMedia || fallbackCover
  if (!isLikelyImageUrl(coverUrl)) coverUrl = fallbackCover

  return {
    id: p.id,
    title: p.title || 'Untitled',
    summary: p.description || '',
    body: p.content || '',
    publishedAt: formatDate(p.date || p.createdAt),
    category: p.projectType || 'Other',
    tags: Array.isArray(p.tags) ? p.tags : [],
    typeLabel: p.projectType || 'Other',
    cover: { url: coverUrl },
    media: normalizedMedia.length
      ? normalizedMedia
      : [{ id: 'cover', mediaType: 'image', url: coverUrl }],
  }
}

function formatDate(v) {
  if (!v) return ''
  const d = new Date(v)
  return isNaN(d.getTime()) ? String(v) : d.toISOString().slice(0, 10)
}

/* ============================================
   API
   ============================================ */
async function fetchProjects(reset = false) {
  try {
    loading.value = true
    error.value = ''

    if (reset) currentPage.value = 0

    const params = {
      page: currentPage.value,
      size: pageSize.value,
    }

    // ✅ backend tag search
    if (tagFilter.value !== 'all') params.tags = [tagFilter.value]

    const response = await api.get('/projects/search', { params })

    const apiResponse = response.data
    if (!apiResponse || !apiResponse.success) {
      throw new Error(apiResponse?.message || 'API request failed')
    }

    const page = apiResponse.data
    const list = Array.isArray(page?.content) ? page.content : []

    projects.value = list.map(normalizeProject)
    totalPages.value = page?.totalPages ?? 1
    totalElements.value = page?.totalElements ?? list.length
  } catch (e) {
    error.value = e.response?.data?.message || e.message || 'Failed to load projects'
  } finally {
    loading.value = false
  }
}

/* ============================================
   FILTER HANDLERS
   ============================================ */
function filterByTag(tag) {
  tagFilter.value = tag
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function filterFromModal(tag) {
  closeProjectModal()
  filterByTag(tag)
}

function clearTagFilter() {
  tagFilter.value = 'all'
  fetchProjects(true)
}

function resetAllFilters() {
  tagFilter.value = 'all'
  sortBy.value = 'newest'
  fetchProjects(true)
}

/* ============================================
   PAGINATION
   ============================================ */
function goToPreviousPage() {
  if (currentPage.value > 0) {
    currentPage.value--
    fetchProjects()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

function goToNextPage() {
  if (currentPage.value + 1 < totalPages.value) {
    currentPage.value++
    fetchProjects()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

/* ============================================
   MODAL & MEDIA
   ============================================ */
function openProjectModal(p) {
  activeProject.value = p
  selectedMedia.value = p.media?.[0] || null
  document.body.style.overflow = 'hidden'
  nextTick(initPlayers)
}

function closeProjectModal() {
  destroyPlayers()
  activeProject.value = null
  selectedMedia.value = null
  zoomLevel.value = 1
  document.body.style.overflow = ''
}

function selectMedia(media) {
  destroyPlayers()
  selectedMedia.value = media
  zoomLevel.value = 1
  nextTick(initPlayers)
}

function initPlayers() {
  if (selectedMedia.value?.mediaType === 'video' && videoPlayer.value) {
    plyrVideo = new Plyr(videoPlayer.value, {
      controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'fullscreen'],
    })
  }
  if (selectedMedia.value?.mediaType === 'audio' && audioPlayer.value) {
    plyrAudio = new Plyr(audioPlayer.value, {
      controls: ['play', 'progress', 'current-time', 'mute', 'volume'],
    })
  }
}

function destroyPlayers() {
  plyrVideo?.destroy()
  plyrAudio?.destroy()
  plyrVideo = null
  plyrAudio = null
}

// Media navigation
const canGoPreviousMedia = computed(() => {
  if (!activeProject.value || !selectedMedia.value) return false
  const idx = activeProject.value.media.findIndex(m => m.id === selectedMedia.value.id)
  return idx > 0
})

const canGoNextMedia = computed(() => {
  if (!activeProject.value || !selectedMedia.value) return false
  const idx = activeProject.value.media.findIndex(m => m.id === selectedMedia.value.id)
  return idx < activeProject.value.media.length - 1
})

function previousMedia() {
  if (!canGoPreviousMedia.value) return
  const idx = activeProject.value.media.findIndex(m => m.id === selectedMedia.value.id)
  selectMedia(activeProject.value.media[idx - 1])
}

function nextMedia() {
  if (!canGoNextMedia.value) return
  const idx = activeProject.value.media.findIndex(m => m.id === selectedMedia.value.id)
  selectMedia(activeProject.value.media[idx + 1])
}

// Image zoom
function zoomIn() {
  if (zoomLevel.value < 3) zoomLevel.value += 0.25
}
function zoomOut() {
  if (zoomLevel.value > 1) zoomLevel.value -= 0.25
}
function resetZoom() {
  zoomLevel.value = 1
}

/* ============================================
   IMAGE ERROR HANDLERS
   ============================================ */
function onCoverError(e) {
  e.target.src = fallbackCover
}
function onPreviewError(e) {
  e.target.src = fallbackCover
}

/* ============================================
   UTILITIES
   ============================================ */
function truncateText(text, maxLength) {
  if (!text) return ''
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text
}

function getMediaIcon(type) {
  const icons = {
    image: '🖼️',
    video: '🎬',
    audio: '🎵',
    document: '📄',
    pdf: '📕',
    text: '📝',
  }
  return icons[String(type).toLowerCase()] || '📎'
}

function getMediaLabel(type) {
  const labels = {
    image: 'Image',
    video: 'Video',
    audio: 'Audio',
    document: 'Document',
    pdf: 'PDF',
    text: 'Text',
  }
  return labels[String(type).toLowerCase()] || 'File'
}

/* ============================================
   WATCHERS & LIFECYCLE
   ============================================ */
watch(tagFilter, () => {
  fetchProjects(true)
})

onMounted(() => {
  fetchProjects(true)
})

onUnmounted(() => {
  destroyPlayers()
  document.body.style.overflow = ''
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=Lora:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

:root {
  --cream: #faf8f3;
  --deep: #22201e;
  --muted: #7c7670;
  --rust: #a85c3e;
  --sage: #4f7d6a;
  --line: rgba(0,0,0,0.08);
  --shadow: 0 18px 60px rgba(0,0,0,0.10);
  --shadow2: 0 10px 28px rgba(0,0,0,0.08);
  --radius: 18px;
  --t: 0.25s ease;
}

* { box-sizing: border-box; }
html, body {
  background: var(--cream);
  color: var(--deep);
  font-family: 'Lora', serif;
  margin: 0;
  padding: 0;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1.25rem;
}

/* HERO */
.hero {
  position: relative;
  min-height: 520px;
  display: flex;
  align-items: center;
  overflow: hidden;
  border-bottom: 1px solid var(--line);
}

.hero__bg {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  filter: brightness(0.55);
  transform: scale(1.05);
}

.hero__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(20,18,16,0.6), rgba(168,92,62,0.22));
}

.hero__content {
  position: relative;
  z-index: 2;
  padding: 4rem 0;
}

.heroCard {
  max-width: 820px;
  background: rgba(255,255,255,0.10);
  border: 1px solid rgba(255,255,255,0.18);
  backdrop-filter: blur(14px);
  border-radius: var(--radius);
  padding: 2.25rem;
  box-shadow: var(--shadow);
}

.heroCard__badge {
  display: inline-flex;
  padding: 0.55rem 1rem;
  border-radius: 999px;
  background: rgba(255,255,255,0.14);
  border: 1px solid rgba(255,255,255,0.22);
  color: rgba(255,255,255,0.95);
  font-weight: 600;
  letter-spacing: 0.03em;
  margin-bottom: 1rem;
}

.heroCard__title {
  font-family: 'Playfair Display', serif;
  font-size: 3rem;
  line-height: 1.1;
  margin: 0 0 0.8rem;
  color: #fff;
  text-shadow: 0 18px 40px rgba(0,0,0,0.35);
}

.heroCard__sub {
  margin: 0 0 1.5rem;
  color: rgba(255,255,255,0.88);
  font-size: 1.05rem;
}

.heroCard__stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.75rem;
  margin-bottom: 1.25rem;
}

.stat {
  padding: 1rem;
  border-radius: 14px;
  background: rgba(255,255,255,0.10);
  border: 1px solid rgba(255,255,255,0.18);
  text-align: center;
}
.stat b {
  display: block;
  font-size: 1.35rem;
  color: #fff;
  font-family: 'Playfair Display', serif;
}
.stat span {
  font-size: 0.9rem;
  color: rgba(255,255,255,0.8);
}

.heroCard__actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  align-items: center;
}

.activeTag {
  display: inline-flex;
  gap: 0.5rem;
  align-items: center;
  padding: 0.5rem 0.75rem;
  border-radius: 999px;
  background: rgba(255,255,255,0.12);
  border: 1px solid rgba(255,255,255,0.2);
  color: #fff;
}
.activeTag__x {
  border: none;
  background: transparent;
  cursor: pointer;
  color: #fff;
  font-size: 0.9rem;
  opacity: 0.9;
}
.activeTag__x:hover { opacity: 1; }

/* TOP LINE */
.section {
  padding: 3rem 0 4rem;
}

.topLine {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
}

.hint { color: var(--muted); display: flex; align-items: center; gap: 0.6rem; }
.hint__error { color: #b13a2b; font-weight: 600; }
.hint__success { color: #2d6a4f; font-weight: 600; }

.spinner {
  width: 16px; height: 16px;
  border: 2px solid rgba(0,0,0,0.12);
  border-top-color: var(--rust);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.sort {
  display: inline-flex;
  gap: 0.6rem;
  align-items: center;
}
.sort__label {
  color: var(--muted);
  font-weight: 600;
}
.sort__box {
  padding: 0.6rem 0.75rem;
  border-radius: 12px;
  border: 1px solid var(--line);
  background: #fff;
  outline: none;
}

/* GRID */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(330px, 1fr));
  gap: 1.25rem;
}

.card {
  background: #fff;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  overflow: hidden;
  cursor: pointer;
  box-shadow: var(--shadow2);
  transition: transform var(--t), box-shadow var(--t);
  outline: none;
}
.card:hover {
  transform: translateY(-6px);
  box-shadow: 0 26px 70px rgba(0,0,0,0.12);
}
.card:focus-visible {
  outline: 3px solid rgba(168,92,62,0.25);
  outline-offset: 2px;
}

.card__media {
  position: relative;
  aspect-ratio: 16 / 9;
  background: #f2eee6;
}
.card__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.badge--type {
  position: absolute;
  right: 0.9rem;
  bottom: 0.9rem;
  padding: 0.4rem 0.75rem;
  border-radius: 999px;
  background: rgba(0,0,0,0.7);
  color: #fff;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.03em;
}

.card__body {
  padding: 1.1rem 1.15rem 1.25rem;
}

.card__title {
  margin: 0 0 0.5rem;
  font-family: 'Playfair Display', serif;
  font-size: 1.35rem;
}

.card__text {
  margin: 0 0 0.9rem;
  color: var(--muted);
  line-height: 1.6;
}

.meta {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 0.85rem;
  font-size: 0.85rem;
}
.meta__pill {
  padding: 0.35rem 0.6rem;
  border-radius: 10px;
  background: rgba(168,92,62,0.10);
  color: var(--rust);
  font-weight: 700;
}
.meta__pill--muted {
  background: rgba(0,0,0,0.06);
  color: var(--muted);
  font-weight: 600;
}
.meta__dot { opacity: 0.35; }
.meta__date { color: var(--muted); }

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.9rem;
}
.tag {
  border: 1px solid rgba(168,92,62,0.18);
  background: rgba(168,92,62,0.08);
  color: var(--rust);
  border-radius: 999px;
  padding: 0.35rem 0.65rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.78rem;
  cursor: pointer;
  transition: transform var(--t), background var(--t);
}
.tag:hover {
  transform: translateY(-2px);
  background: rgba(168,92,62,0.14);
}
.tag--more {
  cursor: default;
  border-style: dashed;
  opacity: 0.8;
}
.tag--more:hover { transform: none; }

.cta {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  color: var(--rust);
  font-weight: 800;
}
.cta__arrow { transition: transform var(--t); }
.card:hover .cta__arrow { transform: translateX(6px); }

/* EMPTY */
.empty {
  text-align: center;
  padding: 3rem 1.5rem;
  border: 1px dashed rgba(0,0,0,0.18);
  border-radius: var(--radius);
  background: rgba(255,255,255,0.65);
}
.empty__icon { font-size: 3rem; }
.empty__title { margin: 0.75rem 0 0.35rem; font-family: 'Playfair Display', serif; }
.empty__text { color: var(--muted); margin-bottom: 1rem; }

/* BUTTONS */
.btn {
  border: 1px solid rgba(255,255,255,0.22);
  border-radius: 12px;
  padding: 0.7rem 1rem;
  cursor: pointer;
  font-weight: 700;
  transition: transform var(--t), background var(--t), border var(--t);
}
.btn:active { transform: translateY(1px); }

.btn--primary {
  background: var(--rust);
  color: #fff;
  border-color: rgba(0,0,0,0);
}
.btn--primary:hover { background: var(--sage); }

.btn--ghost {
  background: rgba(255,255,255,0.12);
  color: #fff;
}
.btn--ghost:hover { background: rgba(255,255,255,0.18); }

.btnMini {
  padding: 0.5rem 0.65rem;
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.16);
  background: rgba(255,255,255,0.10);
  color: #fff;
  cursor: pointer;
}
.btnMini--link {
  border-color: rgba(255,255,255,0.25);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
}

/* PAGER */
.pagerWrap {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.9rem;
  margin-top: 2rem;
}
.pagerBtn {
  padding: 0.65rem 1rem;
  border-radius: 12px;
  border: 1px solid var(--line);
  background: #fff;
  cursor: pointer;
  font-weight: 800;
}
.pagerBtn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
.pagerInfo {
  color: var(--muted);
  font-weight: 800;
  min-width: 120px;
  text-align: center;
}

/* MODAL */
.modal {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.55);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1.25rem;
  z-index: 9999;
}

.modal__panel {
  width: 100%;
  max-width: 1200px;
  background: #fff;
  border-radius: var(--radius);
  overflow: hidden;
  box-shadow: var(--shadow);
  max-height: 92vh;
  overflow-y: auto;
  position: relative;
}

.modal__close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 42px;
  height: 42px;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: #fff;
  cursor: pointer;
  font-size: 1.15rem;
}
.modal__close:hover { background: rgba(0,0,0,0.04); }

.modal__top {
  padding: 2rem 2rem 1.25rem;
  border-bottom: 1px solid var(--line);
}

.modal__titleRow {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 0.9rem;
}

.modal__type {
  padding: 0.35rem 0.7rem;
  border-radius: 999px;
  background: rgba(0,0,0,0.75);
  color: #fff;
  font-weight: 900;
  font-size: 0.75rem;
  letter-spacing: 0.03em;
}

.pillMini {
  padding: 0.35rem 0.6rem;
  border-radius: 999px;
  background: rgba(0,0,0,0.06);
  color: var(--muted);
  font-weight: 800;
  font-size: 0.78rem;
}

.modal__title {
  margin: 0 0 0.5rem;
  font-family: 'Playfair Display', serif;
  font-size: 2rem;
}
.modal__summary {
  margin: 0;
  color: var(--muted);
  line-height: 1.7;
}

.modal__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
}

.tagX {
  border: 1px solid rgba(168,92,62,0.18);
  background: rgba(168,92,62,0.08);
  color: var(--rust);
  border-radius: 999px;
  padding: 0.35rem 0.65rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem;
  cursor: pointer;
}
.tagX:hover { background: rgba(168,92,62,0.14); }

.gallery {
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 1.25rem;
  padding: 1.5rem 2rem 2rem;
}

.gallery__right {
  border-left: 1px solid var(--line);
  padding-left: 1.25rem;
}

.preview {
  background: #f2eee6;
  border-radius: 16px;
  overflow: hidden;
  aspect-ratio: 4 / 3;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.imgViewer {
  width: 100%;
  height: 100%;
  overflow: auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview__img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.imgViewer__controls {
  position: absolute;
  right: 0.75rem;
  bottom: 0.75rem;
  display: flex;
  gap: 0.5rem;
  padding: 0.55rem;
  border-radius: 14px;
  background: rgba(0,0,0,0.55);
  backdrop-filter: blur(8px);
}

.videoPlayer { width: 100%; height: 100%; background: #000; }
.plyrVideo { width: 100%; height: 100%; }

.audioWrap {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
}
.audioCover {
  width: 160px;
  height: 160px;
  border-radius: 16px;
  object-fit: cover;
}
.audioPlayer { width: 100%; max-width: 420px; }

.preview__doc {
  padding: 2rem;
  text-align: center;
}
.docIcon { font-size: 3rem; }
.docText { margin: 1rem 0; }
.muted { color: var(--muted); word-break: break-all; }

.caption {
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 16px;
  background: rgba(0,0,0,0.04);
}
.caption b { display: block; margin-bottom: 0.4rem; }
.caption p { margin: 0; color: var(--muted); line-height: 1.7; }

.thumbHead__title { margin: 0; font-family: 'Playfair Display', serif; }
.thumbHead__sub { color: var(--muted); }

.thumbs {
  margin-top: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  max-height: 360px;
  overflow: auto;
  padding-right: 0.25rem;
}

.thumb {
  border: 1px solid var(--line);
  border-radius: 14px;
  background: rgba(0,0,0,0.04);
  padding: 0.75rem;
  display: flex;
  gap: 0.75rem;
  cursor: pointer;
  text-align: left;
}
.thumb.is-active {
  background: rgba(168,92,62,0.10);
  border-color: rgba(168,92,62,0.22);
}
.thumb__icon { font-size: 1.6rem; }
.thumb__title {
  display: block;
  font-weight: 900;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.thumb__sub { color: var(--muted); font-size: 0.78rem; }

.quickNav {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.85rem;
}

.modal__foot {
  padding: 1.25rem 2rem 2rem;
  border-top: 1px solid var(--line);
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
}

@media (max-width: 1024px) {
  .heroCard__title { font-size: 2.2rem; }
  .gallery { grid-template-columns: 1fr; }
  .gallery__right { border-left: none; padding-left: 0; border-top: 1px solid var(--line); padding-top: 1rem; }
}

@media (max-width: 520px) {
  .heroCard { padding: 1.5rem; }
  .heroCard__stats { grid-template-columns: 1fr; }
  .grid { grid-template-columns: 1fr; }
}
</style>
