<template>
  <main id="main-content" class="projects">
    
    <!-- ============================================
         VIEW: PROJECTS LISTING
         ============================================ -->
    <transition name="view-fade" mode="out-in">
      <div v-if="!activeProject" key="listing">
        
        <!-- HERO SECTION -->
        <header class="hero">
          <div class="hero__bg" :style="{ backgroundImage: `url(${heroImage})` }"></div>
          <div class="hero__overlay"></div>
          <div class="hero__grain"></div>

          <div class="container hero__content">
            <div class="heroCard">
              <div class="heroCard__eyebrow">
                <span class="eyebrow-line"></span>
                <span class="eyebrow-text">پڕۆژەکانی ناوەندی میراتی کوردی</span>
                <span class="eyebrow-line"></span>
              </div>

              <h1 class="heroCard__title">
                ئەرشیڤی دیجیتاڵی
                <span class="title-accent">میراتی کوردی</span>
              </h1>

              <p class="heroCard__sub">
                پاراستن و بڵاوکردنەوەی میراتی کلتووری کوردی بۆ نەوەکانی داهاتوو
              </p>

              <div class="heroCard__stats">
                <div class="stat" v-for="(s, i) in heroStats" :key="i" :style="{ animationDelay: `${i * 0.15 + 0.6}s` }">
                  <div class="stat__value">{{ s.value }}</div>
                  <div class="stat__label">{{ s.label }}</div>
                </div>
              </div>

              <!-- Active Filter Pill -->
              <div class="heroCard__filter" v-if="tagFilter !== 'all'">
                <div class="filterPill">
                  <span class="filterPill__hash">#</span>
                  <span class="filterPill__text">{{ tagFilter }}</span>
                  <button class="filterPill__close" @click="clearTagFilter" aria-label="لابردنی فلتەر">✕</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Scroll Indicator -->
          <div class="hero__scroll" @click="scrollToProjects">
            <div class="scrollIndicator">
              <span class="scrollIndicator__line"></span>
            </div>
          </div>
        </header>

        <!-- PROJECTS SECTION -->
        <section class="section" ref="projectsSection">
          <div class="container">
            
            <!-- Toolbar -->
            <div class="toolbar">
              <div class="toolbar__status">
                <span v-if="loading" class="statusDot statusDot--loading"></span>
                <span v-else-if="error" class="statusDot statusDot--error"></span>
                <span v-else class="statusDot statusDot--ok"></span>
                <span class="toolbar__statusText" v-if="loading">بارکردن...</span>
                <span class="toolbar__statusText" v-else-if="error">{{ error }}</span>
                <span class="toolbar__statusText" v-else>{{ filteredProjects.length }} پڕۆژە</span>
              </div>

              <div class="toolbar__actions">
                <div class="selectWrap">
                  <select v-model="sortBy" class="selectWrap__input">
                    <option value="newest">نوێترین</option>
                    <option value="oldest">کۆنترین</option>
                    <option value="title_az">ناونیشان</option>
                    <option value="media_desc">زۆرترین میدیا</option>
                  </select>
                  <span class="selectWrap__icon">▾</span>
                </div>

                <button class="toolBtn" @click="resetAllFilters" title="دووبارەکردنەوە">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
                </button>
              </div>
            </div>

            <!-- Loading Skeletons -->
            <div v-if="loading" class="grid">
              <div v-for="i in 6" :key="`skeleton-${i}`" class="cardSkeleton">
                <div class="cardSkeleton__img shimmer"></div>
                <div class="cardSkeleton__body">
                  <div class="cardSkeleton__line shimmer" style="width: 70%"></div>
                  <div class="cardSkeleton__line shimmer" style="width: 100%"></div>
                  <div class="cardSkeleton__line shimmer" style="width: 85%"></div>
                  <div class="cardSkeleton__tags">
                    <div class="cardSkeleton__tag shimmer"></div>
                    <div class="cardSkeleton__tag shimmer"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div v-else-if="!loading && filteredProjects.length === 0" class="emptyState">
              <div class="emptyState__visual">
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                  <rect x="10" y="16" width="60" height="48" rx="6" stroke="#d4d4d1" stroke-width="2" fill="none"/>
                  <line x1="25" y1="32" x2="55" y2="32" stroke="#d4d4d1" stroke-width="2" stroke-linecap="round"/>
                  <line x1="25" y1="40" x2="45" y2="40" stroke="#d4d4d1" stroke-width="2" stroke-linecap="round"/>
                  <line x1="25" y1="48" x2="50" y2="48" stroke="#d4d4d1" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </div>
              <h3 class="emptyState__title">هیچ پڕۆژەیەک نەدۆزرایەوە</h3>
              <p class="emptyState__text">تکایە فلتەرێکی تر هەڵبژێرە یان هەموو فلتەرەکان دووبارە بکەرەوە</p>
              <button class="btn btn--primary" @click="resetAllFilters">
                دووبارەکردنەوەی فلتەرەکان
              </button>
            </div>

            <!-- Projects Grid -->
            <div v-else class="grid">
              <article
                v-for="(project, index) in filteredProjects"
                :key="project.id"
                class="card"
                :style="{ animationDelay: `${index * 0.04}s` }"
                tabindex="0"
                @click="openProject(project)"
                @keyup.enter="openProject(project)"
                role="button"
                :aria-label="`بینینی پڕۆژە: ${project.title}`"
              >
                <div class="card__visual">
                  <img
                    :src="project.cover.url"
                    :alt="project.title"
                    loading="lazy"
                    class="card__img"
                    @error="onCoverError($event)"
                  />
                  <div class="card__imgOverlay"></div>
                  <div class="card__badge">{{ getTypeIcon(project.category) }} {{ project.category }}</div>
                  <div class="card__mediaCount">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12z"/></svg>
                    {{ project.media.length }}
                  </div>
                </div>

                <div class="card__body">
                  <h3 class="card__title">{{ project.title }}</h3>
                  <p class="card__desc">{{ truncateText(project.summary, 110) }}</p>

                  <div class="card__meta">
                    <span class="card__date">{{ project.publishedAt }}</span>
                    <span class="card__lang">{{ getLanguageName(project.language) }}</span>
                  </div>

                  <div v-if="project.tags.length > 0" class="card__tags">
                    <button
                      v-for="tag in project.tags.slice(0, 3)"
                      :key="tag"
                      class="tag"
                      type="button"
                      @click.stop="filterByTag(tag)"
                    >
                      #{{ tag }}
                    </button>
                    <span v-if="project.tags.length > 3" class="tag tag--more">+{{ project.tags.length - 3 }}</span>
                  </div>
                </div>

                <div class="card__foot">
                  <span class="card__cta">بینینی پڕۆژە</span>
                  <span class="card__arrow">←</span>
                </div>
              </article>
            </div>

            <!-- Pagination -->
            <nav class="pager" v-if="totalPages > 1 && !loading">
              <button class="pager__btn" :disabled="currentPage === 0" @click="goToPreviousPage">
                → پێشوو
              </button>
              <div class="pager__info">
                <span class="pager__current">{{ currentPage + 1 }}</span>
                <span class="pager__sep">/</span>
                <span class="pager__total">{{ totalPages }}</span>
              </div>
              <button class="pager__btn" :disabled="currentPage + 1 >= totalPages" @click="goToNextPage">
                دواتر ←
              </button>
            </nav>
          </div>
        </section>
      </div>

      <!-- ============================================
           VIEW: PROJECT DETAIL
           ============================================ -->
      <div v-else key="detail" class="projectDetail">
        
        <!-- Back Navigation -->
        <div class="detailNav">
          <div class="container detailNav__inner">
            <button class="backBtn" @click="closeProject">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              <span>گەڕانەوە بۆ پڕۆژەکان</span>
            </button>
          </div>
        </div>

        <!-- Project Hero -->
        <header class="detailHero">
          <div class="detailHero__bg" :style="{ backgroundImage: `url(${activeProject.cover.url})` }"></div>
          <div class="detailHero__overlay"></div>
          <div class="detailHero__grain"></div>

          <div class="container detailHero__content">
            <div class="detailHero__badges">
              <span class="dbadge dbadge--type">{{ getTypeIcon(activeProject.category) }} {{ activeProject.category }}</span>
              <span class="dbadge">📅 {{ activeProject.publishedAt }}</span>
              <span class="dbadge" v-if="activeProject.location">📍 {{ activeProject.location }}</span>
              <span class="dbadge">🗣️ {{ getLanguageName(activeProject.language) }}</span>
            </div>
            <h1 class="detailHero__title">{{ activeProject.title }}</h1>
            <p class="detailHero__desc">{{ activeProject.summary }}</p>
            
            <div v-if="activeProject.tags.length > 0" class="detailHero__tags">
              <button
                v-for="tag in activeProject.tags"
                :key="tag"
                class="dtag"
                type="button"
                @click="filterFromDetail(tag)"
              >
                #{{ tag }}
              </button>
            </div>
          </div>
        </header>

        <!-- Media Gallery Section -->
        <section class="mediaSection">
          <div class="container">
            
            <!-- Media Type Tabs -->
            <div class="mediaTabs" v-if="activeProject.media.length > 1">
              <button
                class="mediaTab"
                :class="{ 'mediaTab--active': activeMediaFilter === 'all' }"
                @click="activeMediaFilter = 'all'"
              >
                هەموو
                <span class="mediaTab__count">{{ activeProject.media.length }}</span>
              </button>
              <button
                v-for="type in availableMediaTypes"
                :key="type"
                class="mediaTab"
                :class="{ 'mediaTab--active': activeMediaFilter === type }"
                @click="activeMediaFilter = type"
              >
                {{ getMediaIcon(type) }} {{ getMediaLabel(type) }}
                <span class="mediaTab__count">{{ getMediasByType(type).length }}</span>
              </button>
            </div>

            <!-- Main Media Display -->
            <div class="mediaStage">
              <!-- Active Media Preview -->
              <div class="mediaStage__main">
                <div class="preview" :class="`preview--${selectedMedia?.mediaType}`">
                  
                  <!-- IMAGE -->
                  <template v-if="selectedMedia?.mediaType === 'image'">
                    <div class="imgFrame" @click="openFullscreen(selectedMedia)">
                      <img
                        class="imgFrame__img"
                        :src="selectedMedia.url"
                        :alt="selectedMedia.caption || activeProject.title"
                        :style="{ transform: `scale(${zoomLevel})` }"
                        @error="onPreviewError($event)"
                      />
                      <div class="imgFrame__expand">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>
                      </div>
                    </div>
                    <!-- Zoom Controls -->
                    <div class="zoomBar">
                      <button class="zoomBtn" @click="zoomOut" :disabled="zoomLevel <= 1">−</button>
                      <span class="zoomBar__level">{{ Math.round(zoomLevel * 100) }}%</span>
                      <button class="zoomBtn" @click="zoomIn" :disabled="zoomLevel >= 3">+</button>
                      <button class="zoomBtn" @click="resetZoom" :disabled="zoomLevel === 1">⟲</button>
                    </div>
                  </template>

                  <!-- VIDEO -->
                  <template v-else-if="selectedMedia?.mediaType === 'video'">
                    <div class="vidFrame" ref="videoPlayerContainer">
                      <video
                        ref="videoPlayer"
                        class="vidFrame__el"
                        :poster="activeProject.cover.url"
                        @loadedmetadata="onVideoLoaded"
                        @timeupdate="onVideoTimeUpdate"
                        @play="isVideoPlaying = true"
                        @pause="isVideoPlaying = false"
                        @ended="isVideoPlaying = false"
                        @click="toggleVideoPlay"
                      >
                        <source :src="selectedMedia.url" type="video/mp4" />
                      </video>
                      
                      <!-- Video Controls -->
                      <div class="vidControls">
                        <div class="vidProgress" @click="seekVideo">
                          <div class="vidProgress__track">
                            <div class="vidProgress__fill" :style="{ width: videoProgress + '%' }"></div>
                            <div class="vidProgress__thumb" :style="{ left: videoProgress + '%' }"></div>
                          </div>
                        </div>
                        <div class="vidControls__row">
                          <div class="vidControls__left">
                            <button class="vidBtn vidBtn--play" @click="toggleVideoPlay">
                              <span v-if="isVideoPlaying">⏸</span>
                              <span v-else>▶</span>
                            </button>
                            <div class="vidTime">
                              {{ formatTime(videoCurrentTime) }} / {{ formatTime(videoDuration) }}
                            </div>
                            <div class="volWrap">
                              <button class="vidBtn vidBtn--sm" @click="toggleMute">
                                <span v-if="isVideoMuted || videoVolume === 0">🔇</span>
                                <span v-else>🔊</span>
                              </button>
                              <input
                                type="range" class="volSlider" min="0" max="100"
                                :value="videoVolume * 100" @input="changeVideoVolume"
                              />
                            </div>
                          </div>
                          <button class="vidBtn vidBtn--sm" @click="toggleVideoFullscreen">⛶</button>
                        </div>
                      </div>
                    </div>
                  </template>

                  <!-- AUDIO -->
                  <template v-else-if="selectedMedia?.mediaType === 'audio'">
                    <div class="audioFrame">
                      <div class="audioFrame__art">
                        <img :src="activeProject.cover.url" :alt="activeProject.title" @error="onCoverError($event)" />
                        <div class="audioFrame__pulse" :class="{ 'audioFrame__pulse--playing': isAudioPlaying }"></div>
                      </div>
                      <div class="audioFrame__info">
                        <h4>{{ selectedMedia.caption || 'دەنگی ناونیشان نەدراو' }}</h4>
                        <p>{{ selectedMedia.note || selectedMedia.textBody || '' }}</p>
                      </div>
                      <audio
                        ref="audioPlayer"
                        @loadedmetadata="onAudioLoaded"
                        @timeupdate="onAudioTimeUpdate"
                        @play="isAudioPlaying = true"
                        @pause="isAudioPlaying = false"
                        @ended="isAudioPlaying = false"
                      >
                        <source :src="selectedMedia.url" type="audio/mpeg" />
                      </audio>
                      <div class="audioControls">
                        <div class="audioProgress" @click="seekAudio">
                          <div class="audioProgress__track">
                            <div class="audioProgress__fill" :style="{ width: audioProgress + '%' }"></div>
                          </div>
                        </div>
                        <div class="audioControls__row">
                          <button class="audioBtn audioBtn--play" @click="toggleAudioPlay">
                            <span v-if="isAudioPlaying">⏸</span>
                            <span v-else>▶</span>
                          </button>
                          <div class="audioTime">{{ formatTime(audioCurrentTime) }} / {{ formatTime(audioDuration) }}</div>
                          <div class="volWrap">
                            <button class="audioBtn audioBtn--sm" @click="toggleAudioMute">
                              <span v-if="isAudioMuted || audioVolume === 0">🔇</span>
                              <span v-else>🔊</span>
                            </button>
                            <input
                              type="range" class="volSlider volSlider--warm" min="0" max="100"
                              :value="audioVolume * 100" @input="changeAudioVolume"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </template>

                  <!-- DOCUMENT / PDF / OTHER -->
                  <template v-else>
                    <div class="docFrame">
                      <div class="docFrame__icon">{{ getMediaIcon(selectedMedia?.mediaType) }}</div>
                      <h4 class="docFrame__title">{{ selectedMedia?.caption || 'بەڵگەنامە' }}</h4>
                      <p class="docFrame__url">{{ selectedMedia?.url }}</p>
                      <button class="btn btn--primary" @click="openInFullscreen(selectedMedia?.url)">
                        کردنەوە بە پڕ شاشە
                      </button>
                    </div>
                  </template>
                </div>

                <!-- Caption Area -->
                <div class="captionBox" v-if="selectedMedia">
                  <h4 class="captionBox__title">{{ selectedMedia.caption || activeProject.title }}</h4>
                  <p class="captionBox__text" v-if="selectedMedia.note || selectedMedia.textBody || activeProject.body">
                    {{ selectedMedia.note || selectedMedia.textBody || activeProject.body }}
                  </p>
                </div>
              </div>

              <!-- Media Thumbnails Strip -->
              <div class="mediaStrip" v-if="displayedMedia.length > 1">
                <button
                  v-for="media in displayedMedia"
                  :key="media.id"
                  class="mediaThumb"
                  :class="{ 'mediaThumb--active': selectedMedia?.id === media.id }"
                  @click="selectMedia(media)"
                  type="button"
                >
                  <span class="mediaThumb__icon">{{ getMediaIcon(media.mediaType) }}</span>
                  <span class="mediaThumb__label">{{ media.caption || getMediaLabel(media.mediaType) }}</span>
                </button>
              </div>

              <!-- Navigation -->
              <div class="mediaNav" v-if="activeProject.media.length > 1">
                <button class="mediaNav__btn" @click="previousMedia" :disabled="!canGoPreviousMedia">
                  → پێشوو
                </button>
                <span class="mediaNav__pos">
                  {{ currentMediaIndex + 1 }} / {{ activeProject.media.length }}
                </span>
                <button class="mediaNav__btn" @click="nextMedia" :disabled="!canGoNextMedia">
                  دواتر ←
                </button>
              </div>
            </div>
          </div>
        </section>

        <!-- Project Body Content -->
        <section class="bodySection" v-if="activeProject.body">
          <div class="container">
            <div class="bodyContent">
              <p>{{ activeProject.body }}</p>
            </div>
          </div>
        </section>

        <!-- Related Projects -->
        <section class="relatedSection" v-if="relatedProjects.length > 0">
          <div class="container">
            <div class="relatedHeader">
              <h2 class="relatedHeader__title">پڕۆژە پەیوەندیدارەکان</h2>
              <p class="relatedHeader__sub">پڕۆژەکانی تر کە تاگی هاوبەشیان هەیە</p>
            </div>

            <div class="relatedGrid">
              <article
                v-for="rp in relatedProjects"
                :key="rp.id"
                class="relatedCard"
                @click="openProject(rp)"
                @keyup.enter="openProject(rp)"
                tabindex="0"
                role="button"
              >
                <div class="relatedCard__img">
                  <img :src="rp.cover.url" :alt="rp.title" loading="lazy" @error="onCoverError($event)" />
                  <div class="relatedCard__overlay">
                    <span class="relatedCard__viewIcon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                    </span>
                  </div>
                </div>

                <div class="relatedCard__body">
                  <div class="relatedCard__meta">
                    <span class="relatedCard__cat">{{ getTypeIcon(rp.category) }} {{ rp.category }}</span>
                    <span class="relatedCard__date">{{ rp.publishedAt }}</span>
                  </div>

                  <h3 class="relatedCard__title">{{ rp.title }}</h3>
                  <p class="relatedCard__desc">{{ truncateText(rp.summary, 120) }}</p>

                  <div class="relatedCard__footer">
                    <div class="relatedCard__tags" v-if="rp.tags.length > 0">
                      <span v-for="tag in rp.tags.slice(0, 2)" :key="tag" class="relatedCard__tag">#{{ tag }}</span>
                      <span v-if="rp.tags.length > 2" class="relatedCard__tagMore">+{{ rp.tags.length - 2 }}</span>
                    </div>
                    <div class="relatedCard__stats">
                      <span class="relatedCard__stat">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12z"/></svg>
                        {{ rp.media.length }}
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>
      </div>
    </transition>

    <!-- ============================================
         FULLSCREEN OVERLAY
         ============================================ -->
    <transition name="fs">
      <div v-if="isFullscreen" class="fsOverlay" @click="exitFullscreen">
        <button class="fsOverlay__close" @click="exitFullscreen">✕</button>
        <div class="fsOverlay__content" @click.stop>
          <img
            v-if="fullscreenContent?.type === 'image'"
            :src="fullscreenContent.url"
            :alt="fullscreenContent.caption"
            class="fsOverlay__img"
          />
          <iframe
            v-else-if="fullscreenContent?.type === 'document'"
            :src="fullscreenContent.url"
            class="fsOverlay__iframe"
            frameborder="0"
          ></iframe>
        </div>
      </div>
    </transition>
  </main>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import axios from 'axios'
import { API_BASE_URL } from '../consts.js'

/* ============================================
   CONFIGURATION
   ============================================ */
const heroImage = 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=2000&q=80'
const fallbackCover = 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1400&q=80'

// Optimized API instance with interceptors
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { 
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
})

// Response interceptor for faster error handling
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)

/* ============================================
   STATE
   ============================================ */
const projects = ref([])
const loading = ref(false)
const error = ref('')

const currentPage = ref(0)
const pageSize = ref(20)
const totalPages = ref(0)
const totalElements = ref(0)

const tagFilter = ref('all')
const sortBy = ref('newest')

// Detail View
const activeProject = ref(null)
const selectedMedia = ref(null)
const zoomLevel = ref(1)
const activeMediaFilter = ref('all')

// Video
const videoPlayer = ref(null)
const videoPlayerContainer = ref(null)
const isVideoPlaying = ref(false)
const isVideoMuted = ref(false)
const videoVolume = ref(1)
const videoCurrentTime = ref(0)
const videoDuration = ref(0)
const videoProgress = ref(0)

// Audio
const audioPlayer = ref(null)
const isAudioPlaying = ref(false)
const isAudioMuted = ref(false)
const audioVolume = ref(1)
const audioCurrentTime = ref(0)
const audioDuration = ref(0)
const audioProgress = ref(0)

// Fullscreen
const isFullscreen = ref(false)
const fullscreenContent = ref(null)

// Refs
const projectsSection = ref(null)

// Cache for faster subsequent loads
const projectsCache = ref(new Map())

/* ============================================
   COMPUTED
   ============================================ */
const filteredProjects = computed(() => {
  let list = [...projects.value]
  if (tagFilter.value !== 'all') {
    list = list.filter(p => (p.tags || []).includes(tagFilter.value))
  }
  switch (sortBy.value) {
    case 'newest': list.sort((a, b) => (b.publishedAt || '').localeCompare(a.publishedAt || '')); break
    case 'oldest': list.sort((a, b) => (a.publishedAt || '').localeCompare(b.publishedAt || '')); break
    case 'title_az': list.sort((a, b) => a.title.localeCompare(b.title)); break
    case 'media_desc': list.sort((a, b) => (b.media?.length || 0) - (a.media?.length || 0)); break
  }
  return list
})

const heroStats = computed(() => [
  { value: totalElements.value || 0, label: 'پڕۆژەی کۆ' },
  { value: projects.value.length, label: 'نیشاندراو' },
  { value: calculateTotalMedia(), label: 'میدیا' },
])

const relatedProjects = computed(() => {
  if (!activeProject.value) return []
  const activeTags = new Set(activeProject.value.tags)
  return projects.value
    .filter(p => p.id !== activeProject.value.id && p.tags.some(t => activeTags.has(t)))
    .slice(0, 4)
})

const availableMediaTypes = computed(() => {
  if (!activeProject.value) return []
  const types = new Set(activeProject.value.media.map(m => m.mediaType))
  return [...types]
})

const displayedMedia = computed(() => {
  if (!activeProject.value) return []
  if (activeMediaFilter.value === 'all') return activeProject.value.media
  return activeProject.value.media.filter(m => m.mediaType === activeMediaFilter.value)
})

const currentMediaIndex = computed(() => {
  if (!activeProject.value || !selectedMedia.value) return 0
  return activeProject.value.media.findIndex(m => m.id === selectedMedia.value.id)
})

const canGoPreviousMedia = computed(() => currentMediaIndex.value > 0)
const canGoNextMedia = computed(() => {
  if (!activeProject.value) return false
  return currentMediaIndex.value < activeProject.value.media.length - 1
})

/* ============================================
   HELPERS
   ============================================ */
function getLanguageName(code) {
  const m = { 'CKB': 'کوردی', 'KMR': 'کورمانجی', 'AR': 'عربی', 'EN': 'English' }
  return m[code] || code
}

function isLikelyImageUrl(url) {
  if (!url || typeof url !== 'string') return false
  const u = url.toLowerCase()
  if (u.endsWith('.pdf') || u.endsWith('.mp4') || u.endsWith('.mp3')) return false
  return u.includes('.jpg') || u.includes('.jpeg') || u.includes('.png') || u.includes('.webp') || u.includes('.gif') || u.includes('image')
}

function calculateTotalMedia() {
  return projects.value.reduce((sum, p) => sum + (p.media?.length || 0), 0)
}

function getTypeIcon(type) {
  const icons = {
    'CULTURAL_EVENT': '🎭', 'RESEARCH': '📚', 'WORKSHOP': '🎓',
    'EXHIBITION': '🖼️', 'CONFERENCE': '🎤', 'PUBLICATION': '📖',
    'DIGITIZATION': '💾', 'OTHER': '📋'
  }
  return icons[type] || '📋'
}

function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

function getMediaIcon(type) {
  const i = { image: '🖼️', video: '🎬', audio: '🎵', document: '📄', pdf: '📕', text: '📝' }
  return i[String(type).toLowerCase()] || '📎'
}

function getMediaLabel(type) {
  const l = { image: 'وێنە', video: 'ڤیدیۆ', audio: 'دەنگ', document: 'بەڵگەنامە', pdf: 'PDF', text: 'دەق' }
  return l[String(type).toLowerCase()] || 'فایل'
}

function truncateText(text, max) {
  if (!text) return ''
  return text.length > max ? text.slice(0, max) + '...' : text
}

function getMediasByType(type) {
  if (!activeProject.value) return []
  return activeProject.value.media.filter(m => m.mediaType === type)
}

/* ============================================
   NORMALIZER
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
  let coverUrl = p.cover || ''
  if (!coverUrl || !isLikelyImageUrl(coverUrl)) {
    const firstImage = normalizedMedia.find(m => m.mediaType === 'image')
    coverUrl = firstImage?.url || fallbackCover
  }
  if (!isLikelyImageUrl(coverUrl)) coverUrl = fallbackCover
  return {
    id: p.id,
    title: p.title || 'بێ ناونیشان',
    summary: p.description || '',
    body: p.content || '',
    publishedAt: formatDate(p.date || p.createdAt),
    category: p.projectType || 'OTHER',
    tags: Array.isArray(p.tags) ? p.tags : [],
    location: p.location || '',
    language: p.language || 'CKB',
    cover: { url: coverUrl },
    media: normalizedMedia.length
      ? normalizedMedia
      : [{ id: 'cover', mediaType: 'image', url: coverUrl, caption: 'Cover' }],
  }
}

function formatDate(v) {
  if (!v) return ''
  const d = new Date(v)
  return isNaN(d.getTime()) ? String(v) : d.toISOString().slice(0, 10)
}

/* ============================================
   OPTIMIZED API FETCHING
   ============================================ */
async function fetchProjects(reset = false) {
  try {
    loading.value = true
    error.value = ''
    if (reset) currentPage.value = 0

    const params = { 
      page: currentPage.value, 
      size: pageSize.value, 
      sort: 'createdAt', 
      dir: 'desc' 
    }
    
    if (tagFilter.value !== 'all') params.tags = [tagFilter.value]

    // Check cache first for instant loading
    const cacheKey = JSON.stringify(params)
    if (projectsCache.value.has(cacheKey)) {
      const cached = projectsCache.value.get(cacheKey)
      projects.value = cached.projects
      totalPages.value = cached.totalPages
      totalElements.value = cached.totalElements
      loading.value = false
      // Still fetch in background to update cache
      fetchInBackground(params, cacheKey)
      return
    }

    const response = await api.get('/projects/getAll', { params })
    const apiResponse = response.data
    
    if (!apiResponse || !apiResponse.success) {
      throw new Error(apiResponse?.message || 'فشەلبووی داواکاری')
    }

    const page = apiResponse.data
    const list = Array.isArray(page?.content) ? page.content : []
    const normalized = list.map(normalizeProject)
    
    projects.value = normalized
    totalPages.value = page?.totalPages ?? 1
    totalElements.value = page?.totalElements ?? list.length

    // Cache the results
    projectsCache.value.set(cacheKey, {
      projects: normalized,
      totalPages: totalPages.value,
      totalElements: totalElements.value,
      timestamp: Date.now()
    })

    // Clear old cache entries (older than 5 minutes)
    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000
    for (const [key, value] of projectsCache.value.entries()) {
      if (value.timestamp < fiveMinutesAgo) {
        projectsCache.value.delete(key)
      }
    }

  } catch (e) {
    console.error('API Error:', e)
    error.value = e.response?.data?.message || e.message || 'فشەلبووی بارکردنی پڕۆژەکان'
  } finally {
    loading.value = false
  }
}

// Background fetch to update cache
async function fetchInBackground(params, cacheKey) {
  try {
    const response = await api.get('/projects/getAll', { params })
    const apiResponse = response.data
    
    if (apiResponse && apiResponse.success) {
      const page = apiResponse.data
      const list = Array.isArray(page?.content) ? page.content : []
      const normalized = list.map(normalizeProject)
      
      // Update cache silently
      projectsCache.value.set(cacheKey, {
        projects: normalized,
        totalPages: page?.totalPages ?? 1,
        totalElements: page?.totalElements ?? list.length,
        timestamp: Date.now()
      })
    }
  } catch (e) {
    // Silently fail background updates
    console.warn('Background fetch failed:', e)
  }
}

/* ============================================
   FILTER HANDLERS
   ============================================ */
function filterByTag(tag) {
  tagFilter.value = tag
  fetchProjects(true)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function filterFromDetail(tag) {
  closeProject()
  setTimeout(() => filterByTag(tag), 350)
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

function scrollToProjects() {
  projectsSection.value?.scrollIntoView({ behavior: 'smooth' })
}

/* ============================================
   PROJECT DETAIL
   ============================================ */
function openProject(p) {
  activeProject.value = p
  selectedMedia.value = p.media?.[0] || null
  activeMediaFilter.value = 'all'
  zoomLevel.value = 1
  window.scrollTo({ top: 0, behavior: 'smooth' })
  nextTick(() => {
    resetVideoState()
    resetAudioState()
  })
}

function closeProject() {
  resetVideoState()
  resetAudioState()
  activeProject.value = null
  selectedMedia.value = null
  zoomLevel.value = 1
}

function selectMedia(media) {
  resetVideoState()
  resetAudioState()
  selectedMedia.value = media
  zoomLevel.value = 1
  nextTick(() => {
    resetVideoState()
    resetAudioState()
  })
}

function resetVideoState() {
  if (videoPlayer.value) { videoPlayer.value.pause(); videoPlayer.value.currentTime = 0 }
  isVideoPlaying.value = false; videoCurrentTime.value = 0; videoDuration.value = 0; videoProgress.value = 0
}

function resetAudioState() {
  if (audioPlayer.value) { audioPlayer.value.pause(); audioPlayer.value.currentTime = 0 }
  isAudioPlaying.value = false; audioCurrentTime.value = 0; audioDuration.value = 0; audioProgress.value = 0
}

/* ============================================
   VIDEO CONTROLS
   ============================================ */
function onVideoLoaded() { if (videoPlayer.value) { videoDuration.value = videoPlayer.value.duration; videoPlayer.value.volume = videoVolume.value } }
function onVideoTimeUpdate() { if (videoPlayer.value) { videoCurrentTime.value = videoPlayer.value.currentTime; videoProgress.value = (videoPlayer.value.currentTime / videoPlayer.value.duration) * 100 } }
function toggleVideoPlay() { if (!videoPlayer.value) return; videoPlayer.value.paused ? videoPlayer.value.play() : videoPlayer.value.pause() }
function toggleMute() { if (!videoPlayer.value) return; videoPlayer.value.muted = !videoPlayer.value.muted; isVideoMuted.value = videoPlayer.value.muted }
function changeVideoVolume(e) { if (!videoPlayer.value) return; const v = e.target.value / 100; videoPlayer.value.volume = v; videoVolume.value = v; if (v > 0 && isVideoMuted.value) { videoPlayer.value.muted = false; isVideoMuted.value = false } }
function toggleVideoFullscreen() {
  if (!videoPlayerContainer.value) return
  if (document.fullscreenElement) { document.exitFullscreen() }
  else { videoPlayerContainer.value.requestFullscreen?.() || videoPlayerContainer.value.webkitRequestFullscreen?.() }
}
function seekVideo(e) { if (!videoPlayer.value) return; const r = e.currentTarget.getBoundingClientRect(); videoPlayer.value.currentTime = ((e.clientX - r.left) / r.width) * videoPlayer.value.duration }

/* ============================================
   AUDIO CONTROLS
   ============================================ */
function onAudioLoaded() { if (audioPlayer.value) { audioDuration.value = audioPlayer.value.duration; audioPlayer.value.volume = audioVolume.value } }
function onAudioTimeUpdate() { if (audioPlayer.value) { audioCurrentTime.value = audioPlayer.value.currentTime; audioProgress.value = (audioPlayer.value.currentTime / audioPlayer.value.duration) * 100 } }
function toggleAudioPlay() { if (!audioPlayer.value) return; audioPlayer.value.paused ? audioPlayer.value.play() : audioPlayer.value.pause() }
function toggleAudioMute() { if (!audioPlayer.value) return; audioPlayer.value.muted = !audioPlayer.value.muted; isAudioMuted.value = audioPlayer.value.muted }
function changeAudioVolume(e) { if (!audioPlayer.value) return; const v = e.target.value / 100; audioPlayer.value.volume = v; audioVolume.value = v; if (v > 0 && isAudioMuted.value) { audioPlayer.value.muted = false; isAudioMuted.value = false } }
function seekAudio(e) { if (!audioPlayer.value) return; const r = e.currentTarget.getBoundingClientRect(); audioPlayer.value.currentTime = ((e.clientX - r.left) / r.width) * audioPlayer.value.duration }

/* ============================================
   MEDIA NAVIGATION
   ============================================ */
function previousMedia() {
  if (!canGoPreviousMedia.value) return
  selectMedia(activeProject.value.media[currentMediaIndex.value - 1])
}
function nextMedia() {
  if (!canGoNextMedia.value) return
  selectMedia(activeProject.value.media[currentMediaIndex.value + 1])
}

/* ============================================
   ZOOM
   ============================================ */
function zoomIn() { if (zoomLevel.value < 3) zoomLevel.value += 0.25 }
function zoomOut() { if (zoomLevel.value > 1) zoomLevel.value -= 0.25 }
function resetZoom() { zoomLevel.value = 1 }

/* ============================================
   FULLSCREEN
   ============================================ */
function openFullscreen(media) {
  if (media?.mediaType === 'image') {
    fullscreenContent.value = { type: 'image', url: media.url, caption: media.caption }
    isFullscreen.value = true
  }
}
function openInFullscreen(url) {
  fullscreenContent.value = { type: 'document', url }
  isFullscreen.value = true
}
function exitFullscreen() {
  isFullscreen.value = false
  fullscreenContent.value = null
}

/* ============================================
   ERROR HANDLERS
   ============================================ */
function onCoverError(e) { e.target.src = fallbackCover }
function onPreviewError(e) { e.target.src = fallbackCover }

/* ============================================
   KEYBOARD NAVIGATION
   ============================================ */
function handleKeydown(e) {
  if (!activeProject.value) return
  if (e.key === 'Escape') closeProject()
  if (e.key === 'ArrowLeft') nextMedia()
  if (e.key === 'ArrowRight') previousMedia()
}

/* ============================================
   LIFECYCLE
   ============================================ */
onMounted(() => {
  fetchProjects(true)
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  resetVideoState()
  resetAudioState()
  exitFullscreen()
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
/* ============================================
   DESIGN SYSTEM — Premium Stanford Heritage
   ============================================ */
@import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;500;600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap');

.projects {
  --cardinal: #8C1515;
  --cardinal-dark: #6e0f0f;
  --cardinal-light: #a52a2a;
  --gold: #b26f16;
  --gold-light: #d4a24c;
  --ink: #1a1a18;
  --text: #2e2d29;
  --text-secondary: #5f5e5a;
  --text-muted: #8a8985;
  --border: #e2e0db;
  --surface: #faf9f7;
  --surface-alt: #f3f2ee;
  --white: #ffffff;
  --radius-sm: 6px;
  --radius-md: 12px;
  --radius-lg: 20px;
  --radius-xl: 28px;
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
  --shadow-md: 0 4px 16px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.06);
  --shadow-lg: 0 12px 40px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.06);
  --shadow-xl: 0 24px 64px rgba(0,0,0,0.16), 0 8px 24px rgba(0,0,0,0.08);
  --ease: cubic-bezier(0.16, 1, 0.3, 1);

  min-height: 100vh;
  background: var(--surface);
  font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
  color: var(--text);
  direction: rtl;
  text-align: right;
  -webkit-font-smoothing: antialiased;
  position: relative;
  overflow-x: hidden;
}

.container {
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 2rem;
}

.section { padding: 5rem 0; }

/* ============================================
   VIEW TRANSITIONS
   ============================================ */
.view-fade-enter-active { transition: opacity 0.35s var(--ease), transform 0.35s var(--ease); }
.view-fade-leave-active { transition: opacity 0.2s ease; }
.view-fade-enter-from { opacity: 0; transform: translateY(20px); }
.view-fade-leave-to { opacity: 0; }

/* ============================================
   HERO
   ============================================ */
.hero {
  position: relative;
  min-height: 88vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: var(--ink);
}

.hero__bg {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  filter: brightness(0.3) saturate(1.2);
  animation: hero-drift 50s ease-in-out infinite alternate;
}

@keyframes hero-drift {
  0% { transform: scale(1); }
  100% { transform: scale(1.1) translateX(-15px); }
}

.hero__overlay {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 100% 0%, rgba(140,21,21,0.25) 0%, transparent 55%),
    radial-gradient(ellipse at 0% 100%, rgba(178,111,22,0.2) 0%, transparent 55%),
    linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.85) 100%);
}

.hero__grain {
  position: absolute;
  inset: 0;
  opacity: 0.03;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  pointer-events: none;
}

.hero__content {
  position: relative;
  z-index: 10;
  width: 100%;
  animation: hero-enter 1s var(--ease) 0.1s both;
}

@keyframes hero-enter {
  0% { opacity: 0; transform: translateY(50px); filter: blur(8px); }
  100% { opacity: 1; transform: translateY(0); filter: blur(0); }
}

.heroCard {
  max-width: 820px;
  margin: 0 auto;
  text-align: center;
}

.heroCard__eyebrow {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.25rem;
  margin-bottom: 2.5rem;
  animation: eyebrow-in 0.9s var(--ease) 0.3s both;
}

@keyframes eyebrow-in {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}

.eyebrow-line {
  width: 48px;
  height: 1.5px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.5));
}

.eyebrow-text {
  font-size: 0.9rem;
  font-weight: 600;
  color: rgba(255,255,255,0.8);
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.heroCard__title {
  font-family: 'Crimson Pro', Georgia, serif;
  font-size: clamp(2.75rem, 5.5vw, 4.5rem);
  font-weight: 800;
  color: #fff;
  line-height: 1.12;
  margin-bottom: 1.5rem;
  letter-spacing: -0.02em;
}

.title-accent {
  display: block;
  color: var(--gold-light);
  margin-top: 0.25rem;
}

.heroCard__sub {
  font-size: clamp(1.05rem, 2vw, 1.2rem);
  color: rgba(255,255,255,0.75);
  line-height: 1.8;
  margin-bottom: 3.5rem;
  max-width: 560px;
  margin-left: auto;
  margin-right: auto;
}

.heroCard__stats {
  display: flex;
  justify-content: center;
  gap: 4rem;
  margin-bottom: 2rem;
}

.stat {
  text-align: center;
  animation: stat-in 0.7s var(--ease) both;
}

.stat__value {
  font-family: 'Crimson Pro', Georgia, serif;
  font-size: clamp(2.25rem, 4vw, 3rem);
  font-weight: 800;
  color: #fff;
  line-height: 1;
  margin-bottom: 0.5rem;
}

.stat__label {
  font-size: 0.8rem;
  color: rgba(255,255,255,0.6);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.12em;
}

@keyframes stat-in {
  from { opacity: 0; transform: translateY(25px); }
  to { opacity: 1; transform: translateY(0); }
}

.heroCard__filter { margin-top: 2rem; }

.filterPill {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(20px);
  padding: 0.75rem 1.5rem;
  border-radius: 100px;
  border: 1px solid rgba(255,255,255,0.2);
  color: #fff;
  font-size: 0.95rem;
  font-weight: 600;
}

.filterPill__hash { color: var(--gold-light); font-weight: 700; }

.filterPill__close {
  background: rgba(255,255,255,0.15);
  border: none;
  color: #fff;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  transition: all 0.2s ease;
}

.filterPill__close:hover {
  background: var(--cardinal);
  transform: rotate(90deg);
}

/* Scroll Indicator */
.hero__scroll {
  position: absolute;
  bottom: 3rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  cursor: pointer;
}

.scrollIndicator {
  width: 24px;
  height: 40px;
  border: 2px solid rgba(255,255,255,0.3);
  border-radius: 12px;
  position: relative;
  display: flex;
  justify-content: center;
}

.scrollIndicator__line {
  display: block;
  width: 2px;
  height: 10px;
  background: rgba(255,255,255,0.6);
  border-radius: 2px;
  margin-top: 6px;
  animation: scroll-pulse 2s ease-in-out infinite;
}

@keyframes scroll-pulse {
  0%, 100% { opacity: 0; transform: translateY(0); }
  50% { opacity: 1; transform: translateY(8px); }
}

/* ============================================
   TOOLBAR
   ============================================ */
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
  background: var(--white);
  padding: 1.25rem 1.75rem;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border);
  margin-bottom: 2.5rem;
}

.toolbar__status {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.statusDot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.statusDot--ok { background: #22c55e; }
.statusDot--loading { background: var(--gold); animation: pulse-dot 1s ease infinite; }
.statusDot--error { background: #ef4444; }

@keyframes pulse-dot { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }

.toolbar__statusText {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-secondary);
}

.toolbar__actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.selectWrap {
  position: relative;
}

.selectWrap__input {
  padding: 0.6rem 2.5rem 0.6rem 1rem;
  border: 1.5px solid var(--border);
  border-radius: var(--radius-sm);
  background: var(--white);
  color: var(--text);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  appearance: none;
  transition: border-color 0.2s;
  min-width: 140px;
}

.selectWrap__input:hover {
  border-color: var(--cardinal);
}

.selectWrap__input:focus {
  outline: none;
  border-color: var(--cardinal);
  box-shadow: 0 0 0 3px rgba(140,21,21,0.08);
}

.selectWrap__icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: var(--text-muted);
  font-size: 0.8rem;
}

.toolBtn {
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--white);
  border: 1.5px solid var(--border);
  border-radius: var(--radius-sm);
  cursor: pointer;
  color: var(--text-secondary);
  transition: all 0.25s var(--ease);
}

.toolBtn:hover {
  border-color: var(--cardinal);
  color: var(--cardinal);
  transform: rotate(180deg);
}

/* ============================================
   SKELETON LOADERS
   ============================================ */
.cardSkeleton {
  background: var(--white);
  border-radius: var(--radius-md);
  overflow: hidden;
  border: 1px solid var(--border);
  animation: skeleton-fade-in 0.4s ease both;
}

@keyframes skeleton-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

.cardSkeleton__img {
  width: 100%;
  height: 240px;
  background: var(--surface-alt);
}

.cardSkeleton__body {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.cardSkeleton__line {
  height: 14px;
  background: var(--surface-alt);
  border-radius: 4px;
}

.cardSkeleton__tags {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.cardSkeleton__tag {
  width: 60px;
  height: 24px;
  background: var(--surface-alt);
  border-radius: 100px;
}

.shimmer {
  position: relative;
  overflow: hidden;
}

.shimmer::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent);
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

/* ============================================
   EMPTY STATE
   ============================================ */
.emptyState {
  text-align: center;
  padding: 5rem 2rem;
  background: var(--white);
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
}

.emptyState__visual { margin-bottom: 1.5rem; opacity: 0.5; }

.emptyState__title {
  font-family: 'Crimson Pro', Georgia, serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 0.5rem;
}

.emptyState__text {
  font-size: 1rem;
  color: var(--text-secondary);
  margin-bottom: 2rem;
}

/* ============================================
   PROJECTS GRID
   ============================================ */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 2rem;
}

/* ============================================
   PROJECT CARD - OPTIMIZED
   ============================================ */
.card {
  background: var(--white);
  border-radius: var(--radius-md);
  overflow: hidden;
  border: 1px solid var(--border);
  cursor: pointer;
  transition: all 0.35s var(--ease);
  animation: card-in 0.45s var(--ease) both;
  display: flex;
  flex-direction: column;
  will-change: transform;
}

@keyframes card-in {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.card:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-lg);
  border-color: rgba(140,21,21,0.2);
}

.card:hover .card__title {
  color: var(--cardinal);
}

.card:hover .card__cta {
  color: var(--cardinal-dark);
}

.card:hover .card__foot {
  background: var(--surface);
  border-color: rgba(140,21,21,0.15);
}

.card:focus-visible {
  outline: 3px solid var(--cardinal);
  outline-offset: 2px;
}

.card__visual {
  position: relative;
  height: 240px;
  overflow: hidden;
  background: var(--surface-alt);
}

.card__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.55s var(--ease);
}

.card:hover .card__img { transform: scale(1.06); }

.card__imgOverlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.5) 100%);
  opacity: 0;
  transition: opacity 0.3s;
}

.card:hover .card__imgOverlay { opacity: 1; }

.card__badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(255,255,255,0.95);
  backdrop-filter: blur(8px);
  padding: 0.3rem 0.8rem;
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--cardinal);
  box-shadow: var(--shadow-sm);
}

.card__mediaCount {
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  background: rgba(0,0,0,0.65);
  backdrop-filter: blur(8px);
  color: #fff;
  padding: 0.3rem 0.7rem;
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 700;
}

.card__body {
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.card__title {
  font-family: 'Crimson Pro', Georgia, serif;
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--text);
  line-height: 1.35;
  margin-bottom: 0.6rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: color 0.25s ease;
}

.card__desc {
  font-size: 0.92rem;
  color: var(--text-secondary);
  line-height: 1.65;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
}

.card__meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  font-size: 0.82rem;
  color: var(--text-muted);
  font-weight: 500;
}

.card__date { color: var(--cardinal); font-weight: 600; }

.card__lang {
  background: var(--surface-alt);
  padding: 0.2rem 0.6rem;
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-secondary);
  border: 1px solid var(--border);
}

.card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.tag {
  padding: 0.25rem 0.7rem;
  background: var(--surface-alt);
  color: var(--cardinal);
  border: 1px solid var(--border);
  border-radius: 100px;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
}

.tag:hover {
  background: var(--cardinal);
  color: #fff;
  border-color: var(--cardinal);
}

.tag--more {
  background: var(--border);
  color: var(--text-muted);
  cursor: default;
  border-color: transparent;
}

.tag--more:hover { background: var(--border); color: var(--text-muted); }

.card__foot {
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid var(--border);
  transition: background 0.25s ease, border-color 0.25s ease;
}

.card__cta {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--cardinal);
}

.card__arrow {
  font-size: 1.1rem;
  color: var(--cardinal);
  transition: transform 0.2s ease;
}

.card:hover .card__arrow { transform: translateX(-4px); }

/* ============================================
   PAGINATION
   ============================================ */
.pager {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  margin-top: 3.5rem;
  padding: 1.5rem 2rem;
  background: var(--white);
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
}

.pager__btn {
  padding: 0.75rem 1.25rem;
  background: var(--cardinal);
  color: #fff;
  border: none;
  border-radius: var(--radius-sm);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.2s ease;
}

.pager__btn:hover:not(:disabled) { background: var(--cardinal-dark); transform: translateY(-1px); }
.pager__btn:disabled { opacity: 0.35; cursor: not-allowed; }

.pager__info { font-family: 'Crimson Pro', serif; font-weight: 700; }
.pager__current { font-size: 1.5rem; color: var(--cardinal); }
.pager__sep { color: var(--text-muted); margin: 0 0.3rem; }
.pager__total { font-size: 1.2rem; color: var(--text-secondary); }

/* ============================================
   DETAIL VIEW — BACK NAV
   ============================================ */
.detailNav {
  background: var(--white);
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: var(--shadow-sm);
}

.detailNav__inner { padding-top: 0.75rem; padding-bottom: 0.75rem; }

.backBtn {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  background: none;
  border: none;
  color: var(--cardinal);
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  padding: 0.5rem 0;
  transition: gap 0.2s ease;
}

.backBtn:hover {
  gap: 1rem;
  color: var(--cardinal-dark);
  background: rgba(140,21,21,0.05);
  border-radius: var(--radius-sm);
  padding: 0.5rem 0.75rem;
}

.backBtn svg { flex-shrink: 0; }

/* ============================================
   DETAIL HERO
   ============================================ */
.detailHero {
  position: relative;
  min-height: 50vh;
  display: flex;
  align-items: flex-end;
  overflow: hidden;
  background: var(--ink);
}

.detailHero__bg {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  filter: brightness(0.35) saturate(1.1);
}

.detailHero__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.75) 100%);
}

.detailHero__grain {
  position: absolute;
  inset: 0;
  opacity: 0.025;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  pointer-events: none;
}

.detailHero__content {
  position: relative;
  z-index: 10;
  padding: 4rem 0;
  animation: detail-enter 0.7s var(--ease) 0.05s both;
}

@keyframes detail-enter {
  from { opacity: 0; transform: translateY(25px); }
  to { opacity: 1; transform: translateY(0); }
}

.detailHero__badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.dbadge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem 0.85rem;
  border-radius: 100px;
  font-size: 0.82rem;
  font-weight: 600;
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(10px);
  color: rgba(255,255,255,0.85);
  border: 1px solid rgba(255,255,255,0.12);
}

.dbadge--type {
  background: var(--cardinal);
  color: #fff;
  border-color: transparent;
}

.detailHero__title {
  font-family: 'Crimson Pro', Georgia, serif;
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 800;
  color: #fff;
  line-height: 1.2;
  margin-bottom: 1rem;
  letter-spacing: -0.015em;
  max-width: 800px;
}

.detailHero__desc {
  font-size: 1.1rem;
  color: rgba(255,255,255,0.75);
  line-height: 1.75;
  max-width: 700px;
  margin-bottom: 1.5rem;
}

.detailHero__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.dtag {
  padding: 0.45rem 1rem;
  background: rgba(255,255,255,0.08);
  backdrop-filter: blur(10px);
  color: #fff;
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: var(--radius-sm);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.2s ease;
}

.dtag:hover {
  background: var(--cardinal);
  border-color: var(--cardinal);
}

/* ============================================
   MEDIA SECTION
   ============================================ */
.mediaSection {
  padding: 3.5rem 0;
  background: var(--white);
  border-bottom: 1px solid var(--border);
}

/* Media Tabs */
.mediaTabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--border);
}

.mediaTab {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.25rem;
  background: none;
  border: 1.5px solid var(--border);
  border-radius: 100px;
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--text-secondary);
  cursor: pointer;
  font-family: inherit;
  transition: all 0.2s ease;
}

.mediaTab:hover {
  border-color: var(--cardinal);
  color: var(--cardinal);
  background: rgba(140,21,21,0.04);
}

.mediaTab--active {
  background: var(--cardinal);
  border-color: var(--cardinal);
  color: #fff;
}

.mediaTab__count {
  background: rgba(0,0,0,0.08);
  padding: 0.15rem 0.5rem;
  border-radius: 100px;
  font-size: 0.75rem;
}

.mediaTab--active .mediaTab__count {
  background: rgba(255,255,255,0.2);
}

/* Media Stage */
.mediaStage {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.mediaStage__main {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Preview Frame */
.preview {
  background: var(--surface-alt);
  border-radius: var(--radius-md);
  overflow: hidden;
  border: 1px solid var(--border);
  height: 550px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

/* Image Frame */
.imgFrame {
  position: relative;
  width: 100%;
  height: 550px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  cursor: zoom-in;
}

.imgFrame__img {
  max-width: 100%;
  max-height: 540px;
  object-fit: contain;
  transition: transform 0.3s ease;
}

.imgFrame__expand {
  position: absolute;
  top: 1.25rem;
  left: 1.25rem;
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,0.6);
  backdrop-filter: blur(10px);
  border-radius: 50%;
  color: #fff;
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
}

.imgFrame:hover .imgFrame__expand { opacity: 1; }

.zoomBar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
}

.zoomBtn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--surface-alt);
  border: 1.5px solid var(--border);
  border-radius: 50%;
  color: var(--text);
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.zoomBtn:hover:not(:disabled) { border-color: var(--cardinal); color: var(--cardinal); }
.zoomBtn:disabled { opacity: 0.3; cursor: not-allowed; }

.zoomBar__level {
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--text-muted);
  min-width: 45px;
  text-align: center;
}

/* Video Frame */
.vidFrame {
  position: relative;
  width: 100%;
  height: 550px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000;
}

.vidFrame__el {
  width: 100%;
  height: 550px;
  object-fit: contain;
  cursor: pointer;
  display: block;
}

.vidControls {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 60%, transparent 100%);
  padding: 2rem 1.25rem 1rem;
  opacity: 0;
  transition: opacity 0.3s;
}

.vidFrame:hover .vidControls { opacity: 1; }

.vidProgress {
  width: 100%;
  height: 24px;
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-bottom: 0.75rem;
}

.vidProgress__track {
  position: relative;
  width: 100%;
  height: 4px;
  background: rgba(255,255,255,0.2);
  border-radius: 10px;
  transition: height 0.15s;
}

.vidProgress:hover .vidProgress__track { height: 6px; }

.vidProgress__fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: var(--cardinal-light);
  border-radius: 10px;
  box-shadow: 0 0 8px rgba(140,21,21,0.5);
}

.vidProgress__thumb {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 14px;
  height: 14px;
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 2px 6px rgba(0,0,0,0.3);
  opacity: 0;
  transition: opacity 0.2s;
}

.vidProgress:hover .vidProgress__thumb { opacity: 1; }

.vidControls__row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.vidControls__left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.vidBtn {
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(8px);
  border: none;
  color: #fff;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s;
}

.vidBtn:hover { background: rgba(255,255,255,0.2); transform: scale(1.05); }

.vidBtn--play {
  width: 44px;
  height: 44px;
  background: var(--cardinal);
}

.vidBtn--play:hover { background: var(--cardinal-dark); box-shadow: 0 4px 12px rgba(140,21,21,0.4); }

.vidBtn--sm { width: 34px; height: 34px; font-size: 0.9rem; }

.vidTime {
  font-size: 0.85rem;
  color: rgba(255,255,255,0.8);
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

.volWrap {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.volSlider {
  width: 70px;
  height: 4px;
  border-radius: 10px;
  background: rgba(0,0,0,0.12);
  outline: none;
  cursor: pointer;
  -webkit-appearance: none;
}

.volSlider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--cardinal);
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0,0,0,0.2);
}

/* Video player slider (dark background) */
.vidControls .volSlider {
  background: rgba(255,255,255,0.2);
}

.vidControls .volSlider::-webkit-slider-thumb {
  background: #fff;
  box-shadow: 0 2px 6px rgba(0,0,0,0.4);
}

.volSlider--warm::-webkit-slider-thumb { background: var(--cardinal-light); }

/* Audio Frame */
.audioFrame {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  padding: 3rem 2rem;
  height: 550px;
  text-align: center;
  box-sizing: border-box;
}

.audioFrame__art {
  position: relative;
  width: 200px;
  height: 200px;
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-lg);
}

.audioFrame__art img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.audioFrame__pulse {
  position: absolute;
  inset: -4px;
  border: 3px solid var(--cardinal);
  border-radius: inherit;
  opacity: 0;
  transition: opacity 0.3s;
}

.audioFrame__pulse--playing {
  opacity: 1;
  animation: pulse-ring 1.5s ease-out infinite;
}

@keyframes pulse-ring {
  0% { transform: scale(1); opacity: 0.6; }
  100% { transform: scale(1.08); opacity: 0; }
}

.audioFrame__info h4 {
  font-family: 'Crimson Pro', serif;
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 0.4rem;
}

.audioFrame__info p {
  font-size: 0.9rem;
  color: var(--text-secondary);
  max-width: 400px;
}

.audioControls {
  width: 100%;
  max-width: 460px;
  background: var(--white);
  border-radius: var(--radius-md);
  padding: 1.25rem 1.5rem;
  border: 1px solid var(--border);
  box-shadow: var(--shadow-sm);
}

.audioProgress {
  width: 100%;
  height: 24px;
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-bottom: 0.75rem;
}

.audioProgress__track {
  position: relative;
  width: 100%;
  height: 4px;
  background: var(--border);
  border-radius: 10px;
  transition: height 0.15s;
}

.audioProgress:hover .audioProgress__track { height: 6px; }

.audioProgress__fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: linear-gradient(90deg, var(--cardinal) 0%, var(--gold) 100%);
  border-radius: 10px;
}

.audioControls__row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.audioBtn {
  background: var(--surface-alt);
  border: 1.5px solid var(--border);
  color: var(--text);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1rem;
  flex-shrink: 0;
  transition: all 0.2s;
}

.audioBtn:hover { border-color: var(--cardinal); color: var(--cardinal); }

.audioBtn--play {
  width: 48px;
  height: 48px;
  background: var(--cardinal);
  border-color: var(--cardinal);
  color: #fff;
  font-size: 1.2rem;
}

.audioBtn--play:hover { background: var(--cardinal-dark); }

.audioBtn--sm { width: 34px; height: 34px; }

.audioTime {
  flex: 1;
  text-align: center;
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--text-secondary);
  font-variant-numeric: tabular-nums;
}

/* Document Frame */
.docFrame {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.25rem;
  padding: 3rem;
  text-align: center;
  height: 550px;
  box-sizing: border-box;
}

.docFrame__icon { font-size: 5rem; opacity: 0.8; }

.docFrame__title {
  font-family: 'Crimson Pro', serif;
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--text);
}

.docFrame__url {
  font-size: 0.82rem;
  color: var(--text-muted);
  word-break: break-all;
  max-width: 350px;
}

/* Caption */
.captionBox {
  background: var(--surface-alt);
  border-radius: var(--radius-md);
  padding: 1.5rem;
  border: 1px solid var(--border);
}

.captionBox__title {
  font-family: 'Crimson Pro', serif;
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 0.5rem;
}

.captionBox__text {
  font-size: 0.92rem;
  color: var(--text-secondary);
  line-height: 1.7;
}

/* Media Strip */
.mediaStrip {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding: 0.5rem 0;
  scrollbar-width: thin;
}

.mediaThumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1rem;
  background: var(--surface-alt);
  border: 1.5px solid var(--border);
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-family: inherit;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-secondary);
  white-space: nowrap;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.mediaThumb:hover {
  border-color: var(--cardinal);
  color: var(--cardinal);
  background: rgba(140,21,21,0.04);
}

.mediaThumb--active {
  background: var(--cardinal);
  border-color: var(--cardinal);
  color: #fff;
}

.mediaThumb__icon { font-size: 1.1rem; }

.mediaThumb__label {
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Media Nav */
.mediaNav {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  padding: 1rem 0;
}

.mediaNav__btn {
  padding: 0.6rem 1.25rem;
  background: none;
  border: 1.5px solid var(--border);
  border-radius: var(--radius-sm);
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--text-secondary);
  cursor: pointer;
  font-family: inherit;
  transition: all 0.2s;
}

.mediaNav__btn:hover:not(:disabled) { border-color: var(--cardinal); color: var(--cardinal); }
.mediaNav__btn:disabled { opacity: 0.3; cursor: not-allowed; }

.mediaNav__pos {
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--text-muted);
}

/* ============================================
   BODY SECTION
   ============================================ */
.bodySection {
  padding: 3rem 0;
}

.bodyContent {
  max-width: 800px;
  margin: 0 auto;
  font-size: 1.05rem;
  color: var(--text);
  line-height: 1.85;
  background: var(--white);
  padding: 2.5rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
}

/* ============================================
   RELATED PROJECTS - IMPROVED DESIGN
   ============================================ */
.relatedSection {
  padding: 4rem 0 5rem;
  background: var(--surface-alt);
  border-top: 1px solid var(--border);
}

.relatedHeader {
  margin-bottom: 2.5rem;
}

.relatedHeader__title {
  font-family: 'Crimson Pro', Georgia, serif;
  font-size: 2rem;
  font-weight: 800;
  color: var(--text);
  margin-bottom: 0.4rem;
}

.relatedHeader__sub {
  font-size: 1rem;
  color: var(--text-secondary);
}

.relatedGrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.75rem;
}

.relatedCard {
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.35s var(--ease);
  display: flex;
  flex-direction: column;
}

.relatedCard:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-md);
  border-color: rgba(140,21,21,0.25);
}

.relatedCard:hover .relatedCard__title {
  color: var(--cardinal);
}

.relatedCard:hover .relatedCard__overlay {
  opacity: 1;
}

.relatedCard__img {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: var(--surface-alt);
}

.relatedCard__img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s var(--ease);
}

.relatedCard:hover .relatedCard__img img {
  transform: scale(1.08);
}

.relatedCard__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent, rgba(140,21,21,0.85));
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  padding: 1rem;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.relatedCard__viewIcon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--white);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--cardinal);
  box-shadow: var(--shadow-sm);
}

.relatedCard__body {
  padding: 1.25rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.relatedCard__meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  font-size: 0.75rem;
}

.relatedCard__cat {
  font-weight: 700;
  color: var(--cardinal);
  flex: 1;
}

.relatedCard__date {
  color: var(--text-muted);
  font-weight: 600;
}

.relatedCard__title {
  font-family: 'Crimson Pro', serif;
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--text);
  line-height: 1.35;
  margin-bottom: 0.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: color 0.25s ease;
}

.relatedCard__desc {
  font-size: 0.88rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
}

.relatedCard__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--border);
}

.relatedCard__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  flex: 1;
}

.relatedCard__tag {
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--gold);
  background: rgba(178,111,22,0.08);
  padding: 0.15rem 0.5rem;
  border-radius: 100px;
}

.relatedCard__tagMore {
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--text-muted);
  background: var(--surface-alt);
  padding: 0.15rem 0.5rem;
  border-radius: 100px;
}

.relatedCard__stats {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.relatedCard__stat {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--text-muted);
}

.relatedCard__stat svg {
  opacity: 0.6;
}

/* ============================================
   BUTTONS
   ============================================ */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  border-radius: var(--radius-sm);
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  font-family: inherit;
  transition: all 0.2s ease;
}

.btn--primary {
  background: var(--cardinal);
  color: #fff;
  box-shadow: 0 4px 12px rgba(140,21,21,0.2);
}

.btn--primary:hover { background: var(--cardinal-dark); transform: translateY(-1px); }

/* ============================================
   FULLSCREEN OVERLAY
   ============================================ */
.fsOverlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.95);
  backdrop-filter: blur(10px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.fs-enter-active, .fs-leave-active { transition: opacity 0.3s; }
.fs-enter-from, .fs-leave-to { opacity: 0; }

.fsOverlay__close {
  position: fixed;
  top: 2rem;
  right: 2rem;
  width: 48px;
  height: 48px;
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 50%;
  color: #fff;
  font-size: 1.3rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10001;
  transition: all 0.2s;
}

.fsOverlay__close:hover { background: var(--cardinal); transform: rotate(90deg); }

.fsOverlay__content {
  max-width: 95vw;
  max-height: 95vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.fsOverlay__img {
  max-width: 100%;
  max-height: 95vh;
  object-fit: contain;
  border-radius: var(--radius-sm);
  box-shadow: 0 20px 60px rgba(0,0,0,0.5);
}

.fsOverlay__iframe {
  width: 95vw;
  height: 95vh;
  border-radius: var(--radius-sm);
}

/* ============================================
   RESPONSIVE
   ============================================ */
@media (max-width: 768px) {
  .container { padding: 0 1.25rem; }

  .hero { min-height: 75vh; }

  .heroCard__stats { gap: 2rem; flex-wrap: wrap; justify-content: center; }

  .toolbar { flex-direction: column; align-items: stretch; }
  .toolbar__actions { justify-content: space-between; }

  .grid { grid-template-columns: 1fr; }

  .preview { height: 400px; }
  .imgFrame, .vidFrame { height: 400px; }
  .imgFrame__img { max-height: 390px; }
  .vidFrame__el { height: 400px; }
  .audioFrame { height: 400px; }
  .docFrame { height: 400px; }

  .detailHero { min-height: 40vh; }
  .detailHero__title { font-size: 1.75rem; }
  .detailHero__content { padding: 3rem 0; }

  .mediaSection { padding: 2.5rem 0; }

  .relatedGrid { grid-template-columns: 1fr; }

  .bodyContent { padding: 1.75rem; }

  .vidControls__left { flex-wrap: wrap; }
  .volWrap { width: 100%; }
  .volSlider { flex: 1; }
}

@media (max-width: 480px) {
  .heroCard__title { font-size: 2rem; }
  .stat__value { font-size: 2rem; }
  .heroCard__stats { gap: 1.5rem; }
  .card__visual { height: 200px; }

  .mediaTabs { gap: 0.35rem; }
  .mediaTab { padding: 0.5rem 0.9rem; font-size: 0.8rem; }
}

/* ============================================
   ACCESSIBILITY
   ============================================ */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

*:focus-visible {
  outline: 3px solid var(--cardinal);
  outline-offset: 2px;
  border-radius: 4px;
}
</style>