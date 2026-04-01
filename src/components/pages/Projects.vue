<template>
  <main class="projects" :dir="lang.dir" :class="{ 'projects--ltr': lang.isKMR }">

    <!-- ══════════════════════════════════════
         LISTING VIEW
    ══════════════════════════════════════ -->
    <transition name="page" mode="out-in">
      <div v-if="!activeProject" key="listing" class="listing">

        <!-- ── CINEMATIC HERO ── -->
        <header class="hero">
          <div class="hero__canvas">
            <div class="hero__bg" :style="{ backgroundImage: `url(${heroImage})` }"></div>
            <div class="hero__film"></div>
            <div class="hero__vignette"></div>
            <div class="hero__grain"></div>
            <div class="hero__scanlines"></div>
            <!-- Decorative corner frames -->
            <div class="hero__corner hero__corner--tl"></div>
            <div class="hero__corner hero__corner--tr"></div>
            <div class="hero__corner hero__corner--bl"></div>
            <div class="hero__corner hero__corner--br"></div>
            <!-- Floating orbs -->
            <div class="hero__orb orb--a"></div>
            <div class="hero__orb orb--b"></div>
            <div class="hero__orb orb--c"></div>
          </div>

          <div class="hero__inner container">
            <!-- Archive stamp -->
            <div class="hero__stamp">
              <div class="stamp__ring">
                <span class="stamp__text">{{ lang.t('projects.heroStampText') }}</span>
                <span class="stamp__year">{{ lang.t('projects.heroStampYear') }}</span>
              </div>
            </div>

            <div class="hero__kicker">
              <span class="kicker__rule"></span>
              <span class="kicker__text">{{ lang.t('projects.heroKicker') }}</span>
              <span class="kicker__rule"></span>
            </div>

            <h1 class="hero__headline">
              <span class="headline__line headline__line--deco">{{ lang.t('projects.heroHeadlineDeco') }}</span>
              <span class="headline__line headline__line--main">{{ lang.t('projects.heroHeadlineMain') }}</span>
              <span class="headline__line headline__line--sub">{{ lang.t('projects.heroHeadlineSub') }}</span>
            </h1>

            <!-- Stats Row -->
            <div class="hero__stats">
              <div class="hstat" v-for="(s, i) in heroStats" :key="i" :style="{ '--i': i }">
                <div class="hstat__inner">
                  <div class="hstat__num">{{ s.value }}</div>
                  <div class="hstat__lbl">{{ s.label }}</div>
                </div>
                <div class="hstat__sep" v-if="i < heroStats.length - 1"></div>
              </div>
            </div>

            <!-- Active Filter -->
            <transition name="pill">
              <div class="hero__activetag" v-if="tagFilter">
                <div class="atag">
                  <span class="atag__hash">#</span>
                  <span class="atag__name">{{ tagFilter }}</span>
                  <button class="atag__x" @click="clearTagFilter">✕</button>
                </div>
              </div>
            </transition>
          </div>

          <button
            class="hero__scroll"
            @click="scrollToGrid"
            :aria-label="lang.t('projects.heroScrollAria')"
          >
            <span class="scroll__label">{{ lang.t('projects.heroScrollLabel') }}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </button>
        </header>

        <!-- ── PROJECTS BODY ── -->
        <section class="body" ref="gridSection">
          <div class="container">

            <!-- Toolbar -->
            <div class="toolbar">
              <div class="toolbar__left">
                <span class="toolbar__indicator" :class="loading ? 'ind--loading' : error ? 'ind--err' : 'ind--ok'"></span>
                <span class="toolbar__label">
                  <template v-if="loading">{{ lang.t('projects.loading') }}</template>
                  <template v-else-if="error">{{ error }}</template>
                  <template v-else>
                    <strong>{{ filteredProjects.length }}</strong> {{ lang.t('projects.foundResultsLabel') }}
                  </template>
                </span>
              </div>
              <div class="toolbar__right">
                <div class="tsort">
                  <select v-model="sortBy" class="tsort__sel">
                    <option value="newest">{{ lang.t('projects.sortNewest') }}</option>
                    <option value="oldest">{{ lang.t('projects.sortOldest') }}</option>
                    <option value="title_az">{{ lang.t('projects.sortTitle') }}</option>
                    <option value="media_desc">{{ lang.t('projects.sortMedia') }}</option>
                  </select>
                  <svg class="tsort__ico" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
                <button class="treset" @click="resetAllFilters" :title="lang.t('projects.toolbarResetTitle')">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                    <polyline points="23 4 23 10 17 10" />
                    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Loading Skeletons -->
            <div v-if="loading" class="grid">
              <div v-for="i in 6" :key="`sk-${i}`" class="skel" :style="{ '--d': `${(i-1)*0.07}s` }">
                <div class="skel__thumb shimmer"></div>
                <div class="skel__body">
                  <div class="skel__line shimmer" style="width:55%"></div>
                  <div class="skel__line shimmer" style="width:100%;margin-top:.5rem"></div>
                  <div class="skel__line shimmer" style="width:75%"></div>
                  <div class="skel__pills">
                    <div class="skel__pill shimmer"></div>
                    <div class="skel__pill shimmer"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty -->
            <div v-else-if="!loading && filteredProjects.length === 0" class="empty">
              <div class="empty__icon">📂</div>
              <h3 class="empty__title">{{ lang.t('projects.noResults') }}</h3>
              <p class="empty__hint">
                <template v-if="projects.length > 0 && projects.filter(p => hasActiveLangContent(p)).length === 0">
                  <span v-if="lang.activeLang === 'KMR'">
                    {{ lang.t('projects.emptyActiveLangMissingKMR') }}
                  </span>
                  <span v-else>
                    {{ lang.t('projects.emptyActiveLangMissingCKB') }}
                  </span>
                </template>
                <template v-else>{{ lang.t('projects.noResultsHint') }}</template>
              </p>
              <button class="btn-primary" @click="resetAllFilters">{{ lang.t('projects.resetFilters') }}</button>
            </div>

            <!-- Grid -->
            <div v-else class="grid">
              <article
                v-for="(project, i) in filteredProjects"
                :key="project.id"
                class="card"
                :class="{ 'card--featured': i === 0 }"
                :style="{ '--d': `${i * 0.05}s` }"
                tabindex="0"
                @click="openProject(project)"
                @keyup.enter="openProject(project)"
                :aria-label="`${lang.t('projects.cardOpenAriaPrefix')}: ${pTitle(project)}`"
              >
                <!-- Thumb -->
                <div class="card__thumb">
                  <img :src="pCover(project)" :alt="pTitle(project)" loading="lazy" class="card__img" @error="onCoverError($event)" />
                  <div class="card__film"></div>
                  <div class="card__scrim"></div>

                  <!-- Top badges -->
                  <div class="card__badges">
                    <div class="card__typebadge" v-if="pType(project)">{{ getTypeIcon(pType(project)) }} {{ pType(project) }}</div>
                    <div class="card__statusbadge" :class="project.status === 'COMPLETED' ? 'card__statusbadge--done' : ''">
                      {{ project.status === 'COMPLETED' ? lang.t('projects.completed') : lang.t('projects.ongoing') }}
                    </div>
                  </div>

                  <div class="card__count" v-if="project.media?.length">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12z"/></svg>
                    {{ project.media.length }}
                  </div>

                  <!-- View button overlay -->
                  <div class="card__view">
                    <span class="card__viewbtn">{{ lang.t('projects.viewProject') }}</span>
                  </div>
                </div>

                <!-- Body -->
                <div class="card__body">
                  <div class="card__meta">
                    <span class="card__date" v-if="project.projectDate">{{ formatDate(project.projectDate) }}</span>
                    <span class="card__lang" v-for="l in (project.contentLanguages || [])" :key="l">{{ getLanguageName(l) }}</span>
                  </div>
                  <h3 class="card__title">{{ pTitle(project) }}</h3>
                  <p class="card__desc">{{ truncateText(pDesc(project), 110) }}</p>

                  <div class="card__tags" v-if="pTags(project).length">
                    <button
                      v-for="tag in pTags(project).slice(0, 3)"
                      :key="tag"
                      class="ctag"
                      @click.stop="filterByTag(tag)"
                    >#{{ tag }}</button>
                    <span v-if="pTags(project).length > 3" class="ctag ctag--more">+{{ pTags(project).length - 3 }}</span>
                  </div>
                </div>

                <div class="card__foot">
                  <span class="card__cta">{{ lang.t('projects.viewProject') }}</span>
                  <span class="card__arrow">{{ lang.isKMR ? '→' : '←' }}</span>
                </div>
              </article>
            </div>

            <!-- Pagination -->
            <nav class="pager" v-if="totalPages > 1 && !loading">
              <button class="pager__btn" :disabled="currentPage === 0" @click="goToPrev">{{ lang.t('projects.prevPage') }}</button>
              <div class="pager__dots">
                <span
                  v-for="p in Math.min(totalPages, 7)"
                  :key="p"
                  class="pager__dot"
                  :class="{ 'pager__dot--on': (p - 1) === currentPage }"
                  @click="goToPage(p - 1)"
                ></span>
              </div>
              <button class="pager__btn" :disabled="currentPage + 1 >= totalPages" @click="goToNext">{{ lang.t('projects.nextPage') }}</button>
            </nav>
          </div>
        </section>
      </div>

      <!-- ══════════════════════════════════════
           DETAIL VIEW
      ══════════════════════════════════════ -->
      <div v-else key="detail" class="detail">

        <!-- Sticky Nav -->
        <nav class="dnav">
          <div class="container dnav__inner">
            <button class="back-btn" @click="closeProject">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
              <span>{{ lang.t('projects.backToProjects') }}</span>
            </button>

            <!-- Language indicator -->
            <div class="dnav__langinfo" v-if="activeProject.contentLanguages?.length">
              <div
                v-for="l in activeProject.contentLanguages"
                :key="l"
                class="langpill"
                :class="{
                  'langpill--active': lang.activeLang === l,
                  'langpill--inactive': lang.activeLang !== l
                }"
                :title="lang.activeLang !== l
                  ? (l === 'CKB' ? lang.t('projects.projectHasSorani') : lang.t('projects.projectHasKurmanji'))
                  : ''"
              >
                <span class="langpill__dot" :class="`langpill__dot--${l.toLowerCase()}`"></span>
                <span class="langpill__name">{{ l === 'CKB' ? lang.t('projects.sorani') : lang.t('projects.kurmanji') }}</span>
                <svg
                  v-if="lang.activeLang === l"
                  class="langpill__check"
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="3"
                >
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>

              <span class="dnav__langhelp">{{ lang.t('projects.languageSwitchHint') }}</span>
            </div>
          </div>
        </nav>

        <!-- Detail Hero -->
        <header class="dhero">
          <div class="dhero__bg" :style="{ backgroundImage: `url(${pCover(activeProject)})` }"></div>
          <div class="dhero__gradient"></div>
          <div class="dhero__grain"></div>
          <div class="dhero__frame dhero__frame--tl"></div>
          <div class="dhero__frame dhero__frame--br"></div>

          <div class="container dhero__content">
            <transition name="lang-swap" mode="out-in">
              <div :key="detailLang" class="dhero__inner">
                <div class="dhero__badges">
                  <span class="dbadge dbadge--type" v-if="pType(activeProject)">{{ getTypeIcon(pType(activeProject)) }} {{ pType(activeProject) }}</span>
                  <span class="dbadge" v-if="activeProject.projectDate">📅 {{ formatDate(activeProject.projectDate) }}</span>
                  <span class="dbadge" v-if="pLocation(activeProject)">📍 {{ pLocation(activeProject) }}</span>
                  <span class="dbadge" v-for="l in (activeProject.contentLanguages || [])" :key="l">🗣️ {{ getLanguageName(l) }}</span>
                  <span class="dbadge" :class="activeProject.status === 'COMPLETED' ? 'dbadge--done' : 'dbadge--ongoing'">
                    {{ activeProject.status === 'COMPLETED' ? lang.t('projects.completedBadge') : lang.t('projects.ongoingBadge') }}
                  </span>
                </div>
                <h1 class="dhero__title">{{ pTitle(activeProject) }}</h1>
                <p class="dhero__desc" v-if="pDesc(activeProject)">{{ pDesc(activeProject) }}</p>
                <div class="dhero__tags" v-if="pTags(activeProject).length">
                  <button v-for="tag in pTags(activeProject)" :key="tag" class="dtag" @click="filterFromDetail(tag)">#{{ tag }}</button>
                </div>
              </div>
            </transition>
          </div>
        </header>

        <!-- ── MEDIA GALLERY ── -->
        <section class="gallery" v-if="projectMedia.length">
          <div class="container">

            <!-- Tab Row -->
            <div class="gtabs" v-if="availableMediaTypes.length > 1">
              <button class="gtab" :class="{ 'gtab--on': activeMediaFilter === 'all' }" @click="activeMediaFilter = 'all'">
                {{ lang.t('projects.allMedia') }} <span class="gtab__n">{{ projectMedia.length }}</span>
              </button>
              <button
                v-for="type in availableMediaTypes"
                :key="type"
                class="gtab"
                :class="{ 'gtab--on': activeMediaFilter === type }"
                @click="activeMediaFilter = type"
              >
                {{ getMediaIcon(type) }} {{ getMediaLabel(type) }}
                <span class="gtab__n">{{ projectMedia.filter(m => m.mediaType === type).length }}</span>
              </button>
            </div>

            <!-- Stage -->
            <div class="stage">

              <!-- IMAGE -->
              <div v-if="selectedMedia?.mediaType === 'IMAGE'" class="preview preview--image">
                <div class="imgstage" @click="openFullscreen(selectedMedia)">
                  <img
                    class="imgstage__img"
                    :src="selectedMedia.url"
                    :alt="selectedMedia.caption || pTitle(activeProject)"
                    :style="{ transform: `scale(${zoomLevel})` }"
                    @error="onPreviewError($event)"
                  />
                  <div class="imgstage__hint">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="15 3 21 3 21 9"/>
                      <polyline points="9 21 3 21 3 15"/>
                      <line x1="21" y1="3" x2="14" y2="10"/>
                      <line x1="3" y1="21" x2="10" y2="14"/>
                    </svg>
                    <span>{{ lang.t('projects.zoomImage') }}</span>
                  </div>
                </div>
                <div class="zoombar">
                  <button class="zbtn" @click="zoomOut" :disabled="zoomLevel <= 1">−</button>
                  <span class="zbtn__val">{{ Math.round(zoomLevel * 100) }}%</span>
                  <button class="zbtn" @click="zoomIn" :disabled="zoomLevel >= 3">+</button>
                  <button class="zbtn zbtn--reset" @click="resetZoom" :disabled="zoomLevel === 1">↺</button>
                </div>
              </div>

              <!-- VIDEO -->
              <div v-else-if="selectedMedia?.mediaType === 'VIDEO'" class="preview preview--video">
                <div class="vidwrap" ref="videoPlayerContainer">
                  <video
                    ref="videoPlayer"
                    class="vid"
                    :poster="pCover(activeProject)"
                    @loadedmetadata="onVideoLoaded"
                    @timeupdate="onVideoTimeUpdate"
                    @play="isVideoPlaying=true"
                    @pause="isVideoPlaying=false"
                    @ended="isVideoPlaying=false"
                    @click="toggleVideoPlay"
                  >
                    <source :src="selectedMedia.url" type="video/mp4" />
                  </video>

                  <div class="vcontrols">
                    <div class="vprog" @click="seekVideo">
                      <div class="vprog__bg">
                        <div class="vprog__fill" :style="{ width: videoProgress+'%' }"></div>
                        <div class="vprog__thumb" :style="{ left: videoProgress+'%' }"></div>
                      </div>
                    </div>
                    <div class="vcontrols__row">
                      <div class="vcontrols__left">
                        <button class="vbtn vbtn--play" @click="toggleVideoPlay">{{ isVideoPlaying ? '⏸' : '▶' }}</button>
                        <span class="vtime">{{ formatTime(videoCurrentTime) }} / {{ formatTime(videoDuration) }}</span>
                        <div class="volrow">
                          <button class="vbtn vbtn--sm" @click="toggleMute">{{ isVideoMuted || videoVolume===0 ? '🔇' : '🔊' }}</button>
                          <input type="range" class="volvol" min="0" max="100" :value="videoVolume*100" @input="changeVideoVolume"/>
                        </div>
                      </div>
                      <button class="vbtn vbtn--sm" @click="toggleVideoFullscreen">⛶</button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- AUDIO -->
              <div v-else-if="selectedMedia?.mediaType === 'AUDIO'" class="preview preview--audio">
                <div class="audstage">
                  <div class="audart" :class="{ 'audart--playing': isAudioPlaying }">
                    <img :src="pCover(activeProject)" :alt="pTitle(activeProject)" @error="onCoverError($event)" />
                    <div class="audart__rings">
                      <span v-for="n in 4" :key="n" class="audart__ring" :style="{ '--n': n }"></span>
                    </div>
                    <div class="audart__vinyl"></div>
                  </div>

                  <div class="audinfo">
                    <h4 class="audinfo__title">{{ selectedMedia.caption || lang.t('projects.unnamed') }}</h4>
                    <p class="audinfo__body" v-if="selectedMedia.textBody">{{ selectedMedia.textBody }}</p>
                  </div>

                  <audio
                    ref="audioPlayer"
                    @loadedmetadata="onAudioLoaded"
                    @timeupdate="onAudioTimeUpdate"
                    @play="isAudioPlaying=true"
                    @pause="isAudioPlaying=false"
                    @ended="isAudioPlaying=false"
                  >
                    <source :src="selectedMedia.url" type="audio/mpeg" />
                  </audio>

                  <div class="audcontrols">
                    <div class="audprog" @click="seekAudio">
                      <div class="audprog__track">
                        <div class="audprog__fill" :style="{ width: audioProgress+'%' }"></div>
                      </div>
                    </div>
                    <div class="audcontrols__row">
                      <button class="audbtn audbtn--play" @click="toggleAudioPlay">{{ isAudioPlaying ? '⏸' : '▶' }}</button>
                      <span class="audtime">{{ formatTime(audioCurrentTime) }} / {{ formatTime(audioDuration) }}</span>
                      <div class="volrow">
                        <button class="audbtn audbtn--sm" @click="toggleAudioMute">{{ isAudioMuted || audioVolume===0 ? '🔇' : '🔊' }}</button>
                        <input type="range" class="volvol volvol--warm" min="0" max="100" :value="audioVolume*100" @input="changeAudioVolume"/>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- DOCUMENT / OTHER -->
              <div v-else class="preview preview--doc">
                <div class="docstage">
                  <div class="docstage__ico">{{ getMediaIcon(selectedMedia?.mediaType) }}</div>
                  <h4 class="docstage__name">{{ selectedMedia?.caption || lang.t('projects.documentDefault') }}</h4>
                  <p class="docstage__url" v-if="selectedMedia?.url">{{ selectedMedia?.url }}</p>
                  <a v-if="selectedMedia?.url" :href="selectedMedia.url" target="_blank" class="btn-primary">
                    {{ lang.t('projects.openDocument') }}
                  </a>
                </div>
              </div>

              <!-- Caption -->
              <div class="caption" v-if="selectedMedia">
                <h4 class="caption__title">{{ selectedMedia.caption || pTitle(activeProject) }}</h4>
                <p class="caption__text" v-if="selectedMedia.textBody || pDesc(activeProject)">
                  {{ selectedMedia.textBody || pDesc(activeProject) }}
                </p>
              </div>
            </div>

            <!-- Thumbnail Strip -->
            <div class="strip" v-if="displayedMedia.length > 1">
              <button
                v-for="m in displayedMedia"
                :key="m.id || m.url"
                class="sthumb"
                :class="{ 'sthumb--on': selectedMedia?.url === m.url }"
                @click="selectMedia(m)"
              >
                <span class="sthumb__ico">{{ getMediaIcon(m.mediaType) }}</span>
                <span class="sthumb__lbl">{{ m.caption || getMediaLabel(m.mediaType) }}</span>
              </button>
            </div>

            <!-- Strip Nav -->
            <div class="mnav" v-if="displayedMedia.length > 1">
              <button class="mnav__btn" @click="previousMedia" :disabled="!canGoPreviousMedia">{{ lang.t('projects.prevMedia') }}</button>
              <span class="mnav__pos">{{ currentMediaIndex + 1 }} / {{ displayedMedia.length }}</span>
              <button class="mnav__btn" @click="nextMedia" :disabled="!canGoNextMedia">{{ lang.t('projects.nextMedia') }}</button>
            </div>
          </div>
        </section>

        <!-- Contents -->
        <section class="chips-section" v-if="pContents(activeProject).length">
          <div class="container">
            <div class="chips-block">
              <h3 class="chips-block__heading">{{ lang.t('projects.contents') }}</h3>
              <div class="chips-row">
                <span v-for="c in pContents(activeProject)" :key="c" class="chip chip--content">{{ c }}</span>
              </div>
            </div>
          </div>
        </section>



        <!-- Related -->
        <section class="related" v-if="relatedProjects.length">
          <div class="container">
            <div class="related__head">
              <h2 class="related__title">{{ lang.t('projects.related') }}</h2>
              <div class="related__rule"></div>
            </div>
            <div class="related__grid">
              <article
                v-for="rp in relatedProjects"
                :key="rp.id"
                class="rcard"
                tabindex="0"
                @click="openProject(rp)"
                @keyup.enter="openProject(rp)"
              >
                <div class="rcard__img">
                  <img :src="pCover(rp)" :alt="pTitle(rp)" loading="lazy" @error="onCoverError($event)" />
                  <div class="rcard__overlay"></div>
                </div>
                <div class="rcard__body">
                  <div class="rcard__meta">
                    <span v-if="pType(rp)">{{ getTypeIcon(pType(rp)) }} {{ pType(rp) }}</span>
                    <span v-if="rp.projectDate">{{ formatDate(rp.projectDate) }}</span>
                  </div>
                  <h3 class="rcard__title">{{ pTitle(rp) }}</h3>
                  <p class="rcard__desc">{{ truncateText(pDesc(rp), 100) }}</p>
                  <div class="rcard__tags" v-if="pTags(rp).length">
                    <span v-for="t in pTags(rp).slice(0,2)" :key="t" class="rtag">#{{ t }}</span>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>
      </div>
    </transition>

    <!-- ══════════════════════════════════════
         FULLSCREEN
    ══════════════════════════════════════ -->
    <transition name="fs">
      <div v-if="isFullscreen" class="fsoverlay" @click="exitFullscreen">
        <button class="fsoverlay__x" @click="exitFullscreen">✕</button>
        <div class="fsoverlay__frame" @click.stop>
          <img
            v-if="fullscreenContent?.type==='image'"
            :src="fullscreenContent.url"
            :alt="fullscreenContent.caption"
            class="fsoverlay__img"
          />
        </div>
      </div>
    </transition>
  </main>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import { API_BASE_URL } from '../consts.js'
import { useLanguageStore } from '@/stores/useLanguageStore'

/* ── CONFIG ── */
const heroImage = 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=2000&q=80'
const fallbackCover = 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1400&q=80'

/* ── GLOBAL LANGUAGE STORE ── */
const lang  = useLanguageStore()
const route = useRoute()

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' }
})

/* ── STATE ── */
const projects = ref([])
const loading = ref(false)
const error = ref('')
const currentPage = ref(0)
const pageSize = ref(20)
const totalPages = ref(0)
const totalElements = ref(0)
const tagFilter = ref('')
const sortBy = ref('newest')

const activeProject = ref(null)
// Always mirrors global navbar language — no local override needed
const detailLang = computed(() => lang.activeLang)
const selectedMedia = ref(null)
const zoomLevel = ref(1)
const activeMediaFilter = ref('all')

const videoPlayer = ref(null)
const videoPlayerContainer = ref(null)
const isVideoPlaying = ref(false)
const isVideoMuted = ref(false)
const videoVolume = ref(1)
const videoCurrentTime = ref(0)
const videoDuration = ref(0)
const videoProgress = ref(0)

const audioPlayer = ref(null)
const isAudioPlaying = ref(false)
const isAudioMuted = ref(false)
const audioVolume = ref(1)
const audioCurrentTime = ref(0)
const audioDuration = ref(0)
const audioProgress = ref(0)

const isFullscreen = ref(false)
const fullscreenContent = ref(null)
const gridSection = ref(null)
const projectsCache = ref(new Map())

/* ── CONTENT HELPERS — delegated to global language store ── */
function pTitle(p)    { return lang.title(p) }
function pDesc(p)     { return lang.description(p) }
function pLocation(p) { return lang.location(p) }
function pType(p)     { return lang.projectType(p) }
function pTags(p)     { return lang.tags(p) }
function pContents(p) { return lang.contents(p) }
function pKeywords(p) { return lang.keywords(p) }
function allTags(p)   { return lang.allTags(p) }

function pCover(p) {
  if (!p) return fallbackCover
  if (p.coverUrl) return p.coverUrl
  const img = (p.media || []).find(m => m.mediaType === 'IMAGE' && m.url)
  return img?.url || fallbackCover
}

/**
 * Returns true if a project has content in the currently active language.
 */
function hasActiveLangContent(p) {
  return lang.hasContentInLanguage(p, lang.activeLang)
}

/* ── COMPUTED ── */
const filteredProjects = computed(() => {
  // ① Keep only projects that have content in the active navbar language
  let list = projects.value.filter(p => hasActiveLangContent(p))

  // ② Tag filter (uses combined tags from both langs to stay usable)
  if (tagFilter.value) {
    list = list.filter(p => allTags(p).includes(tagFilter.value))
  }

  // ③ Sort
  switch (sortBy.value) {
    case 'newest':
      list.sort((a, b) => (b.projectDate || b.createdAt || '').localeCompare(a.projectDate || a.createdAt || ''))
      break
    case 'oldest':
      list.sort((a, b) => (a.projectDate || a.createdAt || '').localeCompare(b.projectDate || b.createdAt || ''))
      break
    case 'title_az':
      list.sort((a, b) => pTitle(a).localeCompare(pTitle(b)))
      break
    case 'media_desc':
      list.sort((a, b) => (b.media?.length || 0) - (a.media?.length || 0))
      break
  }

  return list
})

const heroStats = computed(() => {
  const visibleProjects = projects.value.filter(p => hasActiveLangContent(p))
  return [
    { value: totalElements.value || 0, label: lang.t('projects.totalProjects') },
    { value: visibleProjects.length, label: lang.t('projects.shown') },
    { value: visibleProjects.reduce((s, p) => s + (p.media?.length || 0), 0), label: lang.t('projects.media') },
  ]
})

const relatedProjects = computed(() => {
  if (!activeProject.value) return []
  const myTags = new Set(allTags(activeProject.value))

  return projects.value
    .filter(
      p =>
        p.id !== activeProject.value.id &&
        hasActiveLangContent(p) &&
        allTags(p).some(t => myTags.has(t))
    )
    .slice(0, 4)
})

const projectMedia = computed(() => {
  if (!activeProject.value) return []

  const media = [...(activeProject.value.media || [])]
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))

  if (!media.some(m => m.mediaType === 'IMAGE') && activeProject.value.coverUrl) {
    media.unshift({
      id: '__cover__',
      mediaType: 'IMAGE',
      url: activeProject.value.coverUrl,
      caption: lang.t('projects.coverLabel'),
      sortOrder: -1
    })
  }

  return media
})

const availableMediaTypes = computed(() => [...new Set(projectMedia.value.map(m => m.mediaType))])

const displayedMedia = computed(() => {
  return activeMediaFilter.value === 'all'
    ? projectMedia.value
    : projectMedia.value.filter(m => m.mediaType === activeMediaFilter.value)
})

const currentMediaIndex = computed(() => {
  if (!selectedMedia.value) return 0
  return displayedMedia.value.findIndex(
    m => (m.id || m.url) === (selectedMedia.value.id || selectedMedia.value.url)
  )
})

const canGoPreviousMedia = computed(() => currentMediaIndex.value > 0)
const canGoNextMedia = computed(() => currentMediaIndex.value < displayedMedia.value.length - 1)

/* ── HELPERS ── */
function getLanguageName(code) {
  return lang.languageName(code)
}

function getTypeIcon(type) {
  return {
    CULTURAL_EVENT: '🎭',
    RESEARCH: '📚',
    WORKSHOP: '🎓',
    EXHIBITION: '🖼️',
    CONFERENCE: '🎤',
    PUBLICATION: '📖',
    DIGITIZATION: '💾',
    OTHER: '📋'
  }[type] || '📋'
}

function getMediaIcon(type) {
  return {
    IMAGE: '🖼️',
    VIDEO: '🎬',
    AUDIO: '🎵',
    DOCUMENT: '📄',
    PDF: '📕',
    TEXT: '📝'
  }[type] || '📎'
}

function getMediaLabel(type) {
  return lang.mediaLabel(type)
}

function truncateText(text, max) {
  if (!text) return ''
  return text.length > max ? text.slice(0, max) + '…' : text
}

function formatDate(v) {
  if (!v) return ''
  try {
    const d = new Date(v)
    if (Number.isNaN(d.getTime())) return String(v)
    return d.toLocaleDateString(lang.dateLocales, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch {
    const d = new Date(v)
    return isNaN(d.getTime()) ? String(v) : d.toISOString().slice(0, 10)
  }
}

function formatTime(s) {
  if (!s || isNaN(s)) return '0:00'
  return `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, '0')}`
}

/* ── API ── */
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

    const cacheKey = JSON.stringify(params)
    if (projectsCache.value.has(cacheKey)) {
      const cached = projectsCache.value.get(cacheKey)
      projects.value = cached.projects
      totalPages.value = cached.totalPages
      totalElements.value = cached.totalElements
      loading.value = false
      return
    }

    const { data: apiResponse } = await api.get('/projects/getAll', { params })

    if (!apiResponse?.success) {
      throw new Error(apiResponse?.message || lang.t('projects.requestFailed'))
    }

    const page = apiResponse.data
    const list = Array.isArray(page?.content) ? page.content : []

    projects.value = list
    totalPages.value = page?.totalPages ?? 1
    totalElements.value = page?.totalElements ?? list.length

    projectsCache.value.set(cacheKey, {
      projects: list,
      totalPages: totalPages.value,
      totalElements: totalElements.value,
      timestamp: Date.now()
    })

    // clear old cache entries (> 5 min)
    for (const [k, v] of projectsCache.value.entries()) {
      if (v.timestamp < Date.now() - 5 * 60 * 1000) projectsCache.value.delete(k)
    }
  } catch (e) {
    error.value = e.response?.data?.message || e.message || lang.t('projects.fetchFailed')
  } finally {
    loading.value = false
  }
}

/* ── Filters / Pagination ── */
function filterByTag(tag) {
  tagFilter.value = tag
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function filterFromDetail(tag) {
  closeProject()
  setTimeout(() => filterByTag(tag), 400)
}

function clearTagFilter() {
  tagFilter.value = ''
}

function resetAllFilters() {
  tagFilter.value = ''
  sortBy.value = 'newest'
  fetchProjects(true)
}

function goToPrev() {
  if (currentPage.value > 0) {
    currentPage.value--
    fetchProjects()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

function goToNext() {
  if (currentPage.value + 1 < totalPages.value) {
    currentPage.value++
    fetchProjects()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

function goToPage(p) {
  currentPage.value = p
  fetchProjects()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function scrollToGrid() {
  gridSection.value?.scrollIntoView({ behavior: 'smooth' })
}

/* ── Detail / Media ── */
function openProject(p) {
  activeProject.value = p
  activeMediaFilter.value = 'all'
  zoomLevel.value = 1

  window.scrollTo({ top: 0, behavior: 'smooth' })

  nextTick(() => {
    selectedMedia.value = projectMedia.value[0] || null
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
}

function resetVideoState() {
  if (videoPlayer.value) {
    videoPlayer.value.pause()
    videoPlayer.value.currentTime = 0
  }
  isVideoPlaying.value = false
  videoCurrentTime.value = 0
  videoDuration.value = 0
  videoProgress.value = 0
}

function resetAudioState() {
  if (audioPlayer.value) {
    audioPlayer.value.pause()
    audioPlayer.value.currentTime = 0
  }
  isAudioPlaying.value = false
  audioCurrentTime.value = 0
  audioDuration.value = 0
  audioProgress.value = 0
}

watch(activeMediaFilter, () => {
  selectedMedia.value = displayedMedia.value[0] || null
  zoomLevel.value = 1
})

// Keep selection valid when media list changes (language/filter/detail change)
watch(displayedMedia, (list) => {
  if (!list?.length) {
    selectedMedia.value = null
    return
  }

  if (!selectedMedia.value) {
    selectedMedia.value = list[0]
    return
  }

  const exists = list.some(m => (m.id || m.url) === (selectedMedia.value.id || selectedMedia.value.url))
  if (!exists) {
    selectedMedia.value = list[0]
  }
})

/* ── Video ── */
function onVideoLoaded() {
  if (videoPlayer.value) {
    videoDuration.value = videoPlayer.value.duration
    videoPlayer.value.volume = videoVolume.value
  }
}

function onVideoTimeUpdate() {
  if (videoPlayer.value) {
    videoCurrentTime.value = videoPlayer.value.currentTime
    videoProgress.value = (videoPlayer.value.currentTime / videoPlayer.value.duration) * 100 || 0
  }
}

function toggleVideoPlay() {
  if (!videoPlayer.value) return
  videoPlayer.value.paused ? videoPlayer.value.play() : videoPlayer.value.pause()
}

function toggleMute() {
  if (!videoPlayer.value) return
  videoPlayer.value.muted = !videoPlayer.value.muted
  isVideoMuted.value = videoPlayer.value.muted
}

function changeVideoVolume(e) {
  if (!videoPlayer.value) return
  const v = Number(e.target.value) / 100
  videoPlayer.value.volume = v
  videoVolume.value = v
  if (v > 0 && isVideoMuted.value) {
    videoPlayer.value.muted = false
    isVideoMuted.value = false
  }
}

function seekVideo(e) {
  if (!videoPlayer.value) return
  const r = e.currentTarget.getBoundingClientRect()
  videoPlayer.value.currentTime = ((e.clientX - r.left) / r.width) * videoPlayer.value.duration
}

function toggleVideoFullscreen() {
  if (!videoPlayerContainer.value) return
  if (document.fullscreenElement) {
    document.exitFullscreen()
  } else {
    videoPlayerContainer.value.requestFullscreen?.() || videoPlayerContainer.value.webkitRequestFullscreen?.()
  }
}

/* ── Audio ── */
function onAudioLoaded() {
  if (audioPlayer.value) {
    audioDuration.value = audioPlayer.value.duration
    audioPlayer.value.volume = audioVolume.value
  }
}

function onAudioTimeUpdate() {
  if (audioPlayer.value) {
    audioCurrentTime.value = audioPlayer.value.currentTime
    audioProgress.value = (audioPlayer.value.currentTime / audioPlayer.value.duration) * 100 || 0
  }
}

function toggleAudioPlay() {
  if (!audioPlayer.value) return
  audioPlayer.value.paused ? audioPlayer.value.play() : audioPlayer.value.pause()
}

function toggleAudioMute() {
  if (!audioPlayer.value) return
  audioPlayer.value.muted = !audioPlayer.value.muted
  isAudioMuted.value = audioPlayer.value.muted
}

function changeAudioVolume(e) {
  if (!audioPlayer.value) return
  const v = Number(e.target.value) / 100
  audioPlayer.value.volume = v
  audioVolume.value = v
  if (v > 0 && isAudioMuted.value) {
    audioPlayer.value.muted = false
    isAudioMuted.value = false
  }
}

function seekAudio(e) {
  if (!audioPlayer.value) return
  const r = e.currentTarget.getBoundingClientRect()
  audioPlayer.value.currentTime = ((e.clientX - r.left) / r.width) * audioPlayer.value.duration
}

function previousMedia() {
  if (canGoPreviousMedia.value) {
    selectMedia(displayedMedia.value[currentMediaIndex.value - 1])
  }
}

function nextMedia() {
  if (canGoNextMedia.value) {
    selectMedia(displayedMedia.value[currentMediaIndex.value + 1])
  }
}

/* ── Zoom / Fullscreen ── */
function zoomIn() {
  if (zoomLevel.value < 3) zoomLevel.value += 0.25
}
function zoomOut() {
  if (zoomLevel.value > 1) zoomLevel.value -= 0.25
}
function resetZoom() {
  zoomLevel.value = 1
}

function openFullscreen(media) {
  if (media?.mediaType === 'IMAGE') {
    fullscreenContent.value = { type: 'image', url: media.url, caption: media.caption }
    isFullscreen.value = true
  }
}

function exitFullscreen() {
  isFullscreen.value = false
  fullscreenContent.value = null
}

/* ── Fallback Images ── */
function onCoverError(e) {
  e.target.src = fallbackCover
}
function onPreviewError(e) {
  e.target.src = fallbackCover
}

/* ── Keyboard ── */
function handleKeydown(e) {
  if (isFullscreen.value && e.key === 'Escape') {
    exitFullscreen()
    return
  }

  if (!activeProject.value) return

  if (e.key === 'Escape') closeProject()

  // Keep physical arrow behavior stable for media navigation
  if (e.key === 'ArrowLeft') nextMedia()
  if (e.key === 'ArrowRight') previousMedia()
}

/* ── React to global language changes ────────────────────────────────
   Improved behavior:
   1) Keep open detail if project has the new language content
   2) Close detail only if project lacks the new language
   3) Keep tag filter only if it still exists in visible projects
   4) Reset fullscreen/zoom for clean state
*/
watch(
  () => lang.activeLang,
  () => {
    // fullscreen should close on language change (UI / captions re-render cleanly)
    if (isFullscreen.value) exitFullscreen()
    zoomLevel.value = 1

    // If a detail is open, keep it only if that project supports the newly selected language
    if (activeProject.value && !hasActiveLangContent(activeProject.value)) {
      closeProject()
    }

    // If current media filter type no longer exists, reset to all
    if (activeProject.value && activeMediaFilter.value !== 'all' && !availableMediaTypes.value.includes(activeMediaFilter.value)) {
      activeMediaFilter.value = 'all'
    }

    // Keep tag filter only if at least one visible project still matches it
    if (tagFilter.value) {
      const visible = projects.value.filter(p => hasActiveLangContent(p))
      const stillExists = visible.some(p => allTags(p).includes(tagFilter.value))
      if (!stillExists) tagFilter.value = ''
    }

    // If we're in listing view, scroll top for cleaner re-render
    if (!activeProject.value) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }
)

/* ── Lifecycle ── */
onMounted(async () => {
  await fetchProjects(true)
  window.addEventListener('keydown', handleKeydown)
  if (route.query.id) {
    const target = projects.value.find(p => String(p.id) === String(route.query.id))
    if (target) openProject(target)
  }
})

onUnmounted(() => {
  resetVideoState()
  resetAudioState()
  exitFullscreen()
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
/* =========================================================
   KH Projects - Crimson & Amber Warm Archive System
   Palette: Crimson #7C1C1C, Amber #C49A3C, Charcoal #1E1C19
   Languages: Kurdish Sorani (CKB) RTL + Kurmanji (KMR) LTR
   ========================================================= */

.projects {
  /* ── Palette ── */
  --crimson:       #7C1C1C;
  --crimson-deep:  #4A0F0F;
  --crimson-mid:   #A82828;
  --crimson-glow:  rgba(124,28,28,.55);
  --amber:         #C49A3C;
  --amber-light:   #DDB86A;
  --amber-pale:    #F2E4C4;
  --amber-wash:    rgba(196,154,60,.07);

  --void:          #0C0B09;
  --ink:           #141210;
  --charcoal:      #1E1C19;
  --pewter:        #3A3832;
  --text:          #231F1A;
  --muted:         #6B6560;
  --faint:         #A09990;
  --border:        rgba(60,55,48,.13);
  --border-warm:   rgba(196,154,60,.18);
  --surface:       #F7F4EF;
  --parchment:     #FAF7F2;
  --card-bg:       #FFFFFF;

  /* ── Space & Shape ── */
  --radius-xs:  4px;
  --radius-s:   8px;
  --radius-m:   14px;
  --radius-l:   20px;
  --radius-xl:  28px;
  --radius-full: 9999px;

  /* ── Shadows ── */
  --shadow-xs: 0 1px 3px rgba(0,0,0,.04), 0 1px 2px rgba(0,0,0,.03);
  --shadow-s:  0 2px 8px rgba(0,0,0,.06), 0 1px 3px rgba(0,0,0,.04);
  --shadow-m:  0 8px 24px rgba(0,0,0,.08), 0 2px 8px rgba(0,0,0,.05);
  --shadow-l:  0 20px 50px rgba(0,0,0,.12), 0 6px 16px rgba(0,0,0,.06);
  --shadow-xl: 0 40px 80px rgba(0,0,0,.18), 0 12px 30px rgba(0,0,0,.1);
  --shadow-crimson: 0 8px 30px rgba(124,28,28,.28);
  --shadow-amber:   0 8px 30px rgba(196,154,60,.28);

  /* ── Motion ── */
  --ease:        cubic-bezier(.25, 1, .35, 1);
  --ease-spring: cubic-bezier(.34, 1.56, .64, 1);
  --ease-expo:   cubic-bezier(.87, 0, .13, 1);

  min-height: 100vh;
  background: var(--parchment);
  font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
  color: var(--text);
  direction: rtl;
  text-align: right;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}

/* LTR Support for Kurmanji */
.projects--ltr {
  direction: ltr;
  text-align: left;
}

.projects--ltr .card__badges,
.projects--ltr .toolbar__right,
.projects--ltr .dnav__inner,
.projects--ltr .vcontrols__row,
.projects--ltr .audcontrols__row {
  flex-direction: row-reverse;
}

.projects--ltr .card:hover .card__arrow,
.projects--ltr .pager__btn:hover:not(:disabled) {
  transform: translateX(4px);
}

.projects--ltr .back-btn:hover {
  transform: translateX(-4px);
}

/* Container */
.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
}

/* =========================================================
   CINEMATIC HERO
   ========================================================= */
.hero {
  position: relative;
  min-height: 88vh;
  overflow: hidden;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, var(--crimson-deep) 0%, var(--crimson) 50%, var(--crimson-mid) 100%);
  isolation: isolate;
}

.hero__canvas {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.hero__bg {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  transform: scale(1.1);
  animation: heroZoom 20s ease-in-out infinite alternate;
  filter: brightness(0.6) contrast(1.1);
}

@keyframes heroZoom {
  to { transform: scale(1.2) translateX(-2%); }
}

.hero__film {
  position: absolute;
  inset: 0;
  background: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  opacity: 0.04;
  pointer-events: none;
  z-index: 2;
}

.hero__vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at center, transparent 30%, rgba(12,11,9,0.8) 100%);
  z-index: 3;
}

.hero__grain {
  position: absolute;
  inset: 0;
  opacity: 0.06;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n2'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n2)'/%3E%3C/svg%3E");
  pointer-events: none;
  z-index: 4;
}

.hero__scanlines {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.1) 50%);
  background-size: 100% 4px;
  opacity: 0.05;
  z-index: 5;
  pointer-events: none;
}

/* Decorative Corners */
.hero__corner {
  position: absolute;
  width: 80px;
  height: 80px;
  border: 2px solid var(--amber);
  opacity: 0.4;
  z-index: 6;
  pointer-events: none;
}

.hero__corner--tl { top: 40px; left: 40px; border-right: 0; border-bottom: 0; }
.hero__corner--tr { top: 40px; right: 40px; border-left: 0; border-bottom: 0; }
.hero__corner--bl { bottom: 40px; left: 40px; border-right: 0; border-top: 0; }
.hero__corner--br { bottom: 40px; right: 40px; border-left: 0; border-top: 0; }

/* Floating Orbs */
.hero__orb {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle, var(--amber-light) 0%, transparent 70%);
  opacity: 0.2;
  filter: blur(40px);
  animation: floatOrb 15s ease-in-out infinite;
  z-index: 1;
}

.orb--a { width: 300px; height: 300px; top: 10%; left: 10%; animation-delay: 0s; }
.orb--b { width: 200px; height: 200px; top: 60%; right: 15%; animation-delay: -5s; }
.orb--c { width: 150px; height: 150px; bottom: 20%; left: 30%; animation-delay: -10s; }

@keyframes floatOrb {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(30px, -30px); }
}

/* Hero Content */
.hero__inner {
  position: relative;
  z-index: 10;
  text-align: center;
  color: white;
  padding: 120px 24px 100px;
  max-width: 900px;
}

/* Archive Stamp */
.hero__stamp {
  width: 120px;
  height: 120px;
  margin: 0 auto 32px;
  position: relative;
}

.stamp__ring {
  width: 100%;
  height: 100%;
  border: 3px solid var(--amber);
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  animation: rotateStamp 30s linear infinite;
  box-shadow: 0 0 30px rgba(196,154,60,0.3);
}

.stamp__ring::before {
  content: '';
  position: absolute;
  inset: 10px;
  border: 1px solid rgba(196,154,60,0.4);
  border-radius: 50%;
}

@keyframes rotateStamp {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.stamp__text {
  font-size: 11px;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  font-weight: 700;
  color: var(--amber-light);
  margin-bottom: 4px;
}

.stamp__year {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 28px;
  font-weight: 700;
  color: white;
}

/* Kicker */
.hero__kicker {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-bottom: 24px;
  font-size: 13px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--amber-pale);
  font-weight: 600;
}

.kicker__rule {
  width: 60px;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--amber), transparent);
}

.kicker__text {
  position: relative;
  padding: 0 16px;
}

/* Headline */
.hero__headline {
  margin: 0 0 32px;
  font-family: 'Playfair Display', Georgia, serif;
  font-weight: 700;
  line-height: 1.1;
}

.headline__line {
  display: block;
}

.headline__line--deco {
  font-size: 14px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--amber);
  margin-bottom: 16px;
  font-weight: 600;
}

.headline__line--main {
  font-size: clamp(40px, 6vw, 72px);
  margin-bottom: 16px;
  text-shadow: 0 4px 30px rgba(0,0,0,0.4);
  background: linear-gradient(to bottom, #fff 0%, var(--amber-pale) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.headline__line--sub {
  font-size: clamp(18px, 3vw, 28px);
  font-weight: 400;
  opacity: 0.9;
  color: rgba(255,255,255,0.85);
}

/* Stats Row */
.hero__stats {
  display: flex;
  justify-content: center;
  gap: 32px;
  margin-bottom: 40px;
  flex-wrap: wrap;
}

.hstat {
  position: relative;
  text-align: center;
}

.hstat__inner {
  padding: 20px 28px;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(196,154,60,0.3);
  border-radius: var(--radius-l);
  backdrop-filter: blur(10px);
  transition: all 0.3s var(--ease-spring);
  min-width: 120px;
}

.hstat:hover .hstat__inner {
  transform: translateY(-6px);
  background: rgba(255,255,255,0.12);
  border-color: var(--amber);
  box-shadow: var(--shadow-amber);
}

.hstat__num {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 42px;
  font-weight: 700;
  color: var(--amber-light);
  line-height: 1;
  margin-bottom: 8px;
  text-shadow: 0 2px 10px rgba(196,154,60,0.3);
}

.hstat__lbl {
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  opacity: 0.9;
  color: rgba(255,255,255,0.8);
  font-weight: 600;
}

/* Active Tag Filter in Hero */
.hero__activetag {
  margin-top: 24px;
  animation: fadeInDown 0.4s var(--ease-spring);
}

@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

.atag {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: rgba(124,28,28,0.9);
  border: 1px solid var(--amber);
  padding: 12px 20px;
  border-radius: var(--radius-full);
  font-size: 15px;
  font-weight: 700;
  color: white;
  box-shadow: var(--shadow-crimson);
}

.atag__hash {
  color: var(--amber);
  font-size: 18px;
}

.atag__x {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: none;
  background: rgba(255,255,255,0.2);
  color: white;
  cursor: pointer;
  display: grid;
  place-items: center;
  font-size: 14px;
  transition: all 0.2s;
  margin-right: -8px;
  margin-left: 8px;
}

.projects--ltr .atag__x {
  margin-right: 8px;
  margin-left: -8px;
}

.atag__x:hover {
  background: var(--crimson);
  transform: rotate(90deg);
}

/* Scroll Indicator */
.hero__scroll {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 20;
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  opacity: 0.8;
  transition: opacity 0.3s;
  padding: 16px;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateX(-50%) translateY(0); }
  40% { transform: translateX(-50%) translateY(-10px); }
  60% { transform: translateX(-50%) translateY(-5px); }
}

.hero__scroll:hover {
  opacity: 1;
}

.scroll__label {
  font-size: 12px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  font-weight: 600;
}

/* =========================================================
   TOOLBAR & CONTROLS
   ========================================================= */
.body {
  padding: 48px 0 80px;
  background: var(--parchment);
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  padding: 20px 24px;
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: var(--radius-l);
  box-shadow: var(--shadow-s);
}

.toolbar__left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.toolbar__indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  position: relative;
}

.toolbar__indicator.ind--ok {
  background: #22c55e;
  box-shadow: 0 0 0 4px rgba(34,197,94,0.2);
  animation: pulse 2s infinite;
}

.toolbar__indicator.ind--loading {
  background: var(--amber);
  animation: pulse 1s infinite;
}

.toolbar__indicator.ind--err {
  background: var(--crimson);
  box-shadow: 0 0 0 4px rgba(124,28,28,0.2);
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.toolbar__label {
  color: var(--muted);
  font-size: 15px;
  font-weight: 500;
}

.toolbar__label strong {
  color: var(--crimson);
  font-weight: 700;
  margin-left: 4px;
}

.toolbar__right {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* Sort Select */
.tsort {
  position: relative;
}

.tsort__sel {
  appearance: none;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-m);
  padding: 12px 40px 12px 16px;
  font-size: 14px;
  font-weight: 600;
  color: var(--text);
  cursor: pointer;
  min-width: 160px;
  transition: all 0.2s;
}

.projects--ltr .tsort__sel {
  padding: 12px 16px 12px 40px;
}

.tsort__sel:hover {
  border-color: var(--amber);
  box-shadow: var(--shadow-s);
}

.tsort__sel:focus {
  outline: none;
  border-color: var(--crimson);
  box-shadow: 0 0 0 3px rgba(124,28,28,0.1);
}

.tsort__ico {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: var(--muted);
}

.projects--ltr .tsort__ico {
  right: auto;
  left: 16px;
}

/* Reset Button */
.treset {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-m);
  border: 1px solid var(--border);
  background: var(--surface);
  cursor: pointer;
  display: grid;
  place-items: center;
  color: var(--muted);
  transition: all 0.2s;
}

.treset:hover {
  background: var(--crimson);
  color: white;
  border-color: var(--crimson);
  transform: rotate(-180deg);
}

/* =========================================================
   GRID & CARDS
   ========================================================= */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 28px;
}

/* Skeleton Loading */
.skel {
  background: var(--card-bg);
  border-radius: var(--radius-l);
  overflow: hidden;
  border: 1px solid var(--border);
  animation: fadeIn 0.5s ease both;
  animation-delay: var(--d, 0s);
}

.skel__thumb {
  aspect-ratio: 16/10;
  background: linear-gradient(90deg, var(--surface) 25%, #e8e4de 50%, var(--surface) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.skel__body {
  padding: 24px;
}

.skel__line {
  height: 12px;
  background: var(--surface);
  border-radius: 6px;
  margin-bottom: 12px;
}

.skel__pills {
  display: flex;
  gap: 8px;
  margin-top: 20px;
}

.skel__pill {
  width: 60px;
  height: 28px;
  background: var(--surface);
  border-radius: var(--radius-full);
}

/* Cards */
.card {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: var(--radius-l);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.4s var(--ease-spring);
  position: relative;
  animation: fadeInUp 0.6s ease both;
  animation-delay: var(--d, 0s);
  box-shadow: var(--shadow-xs);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-l);
  border-color: var(--border-warm);
}

.card:focus-visible {
  outline: 3px solid var(--crimson);
  outline-offset: 4px;
}

.card--featured {
  grid-column: span 2;
  grid-row: span 2;
}

@media (max-width: 968px) {
  .card--featured {
    grid-column: span 1;
    grid-row: span 1;
  }
}

/* Card Thumbnail */
.card__thumb {
  position: relative;
  aspect-ratio: 16/10;
  overflow: hidden;
  background: linear-gradient(135deg, var(--charcoal) 0%, var(--ink) 100%);
}

.card__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.8s var(--ease);
}

.card:hover .card__img {
  transform: scale(1.08);
}

.card__film {
  position: absolute;
  inset: 0;
  background: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  opacity: 0;
  mix-blend-mode: overlay;
  transition: opacity 0.3s;
  pointer-events: none;
}

.card:hover .card__film {
  opacity: 0.04;
}

.card__scrim {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(12,11,9,0.8) 0%, transparent 60%);
  opacity: 0;
  transition: opacity 0.3s;
}

.card:hover .card__scrim {
  opacity: 1;
}

/* Badges */
.card__badges {
  position: absolute;
  top: 16px;
  left: 16px;
  right: 16px;
  display: flex;
  justify-content: space-between;
  z-index: 5;
  gap: 8px;
}

.card__typebadge {
  background: rgba(255,255,255,0.95);
  color: var(--crimson-deep);
  padding: 8px 14px;
  border-radius: var(--radius-full);
  font-size: 12px;
  font-weight: 700;
  backdrop-filter: blur(10px);
  box-shadow: var(--shadow-s);
  border: 1px solid rgba(255,255,255,0.3);
  display: flex;
  align-items: center;
  gap: 6px;
}

.card__statusbadge {
  background: rgba(196,154,60,0.95);
  color: var(--void);
  padding: 8px 14px;
  border-radius: var(--radius-full);
  font-size: 12px;
  font-weight: 700;
  backdrop-filter: blur(10px);
}

.card__statusbadge--done {
  background: rgba(34,197,94,0.95);
  color: white;
}

.card__count {
  position: absolute;
  bottom: 16px;
  right: 16px;
  background: rgba(12,11,9,0.8);
  color: white;
  padding: 8px 14px;
  border-radius: var(--radius-full);
  font-size: 13px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.1);
}

.projects--ltr .card__count {
  right: auto;
  left: 16px;
}

/* View Overlay */
.card__view {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  opacity: 0;
  transition: opacity 0.3s;
  z-index: 6;
}

.card:hover .card__view {
  opacity: 1;
}

.card__viewbtn {
  background: var(--crimson);
  color: white;
  padding: 14px 28px;
  border-radius: var(--radius-full);
  font-weight: 700;
  font-size: 14px;
  transform: translateY(20px);
  transition: all 0.3s var(--ease-spring);
  box-shadow: var(--shadow-crimson);
  border: 2px solid rgba(255,255,255,0.2);
}

.card:hover .card__viewbtn {
  transform: translateY(0);
}

.card__viewbtn:hover {
  background: var(--crimson-mid);
  transform: scale(1.05);
}

/* Card Body */
.card__body {
  padding: 24px;
}

.card__meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  font-size: 13px;
  color: var(--muted);
  flex-wrap: wrap;
}

.card__date {
  font-weight: 600;
  color: var(--crimson);
}

.card__lang {
  background: var(--amber-wash);
  color: var(--crimson-deep);
  padding: 4px 10px;
  border-radius: var(--radius-xs);
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border: 1px solid var(--border-warm);
}

.card__title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 22px;
  font-weight: 700;
  line-height: 1.3;
  margin: 0 0 12px;
  color: var(--text);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card__desc {
  font-size: 15px;
  color: var(--muted);
  line-height: 1.7;
  margin: 0 0 16px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Tags */
.card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.ctag {
  font-size: 13px;
  color: var(--muted);
  background: var(--surface);
  padding: 8px 14px;
  border-radius: var(--radius-full);
  border: 1px solid var(--border);
  transition: all 0.2s;
  font-weight: 600;
  cursor: pointer;
}

.ctag:hover {
  background: var(--crimson);
  color: white;
  border-color: var(--crimson);
  transform: translateY(-2px);
}

.ctag--more {
  background: var(--amber);
  color: var(--void);
  border-color: var(--amber);
  font-weight: 700;
}

/* Card Footer */
.card__foot {
  padding: 16px 24px;
  border-top: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(to bottom, transparent, var(--amber-wash));
}

.card__cta {
  font-size: 14px;
  font-weight: 700;
  color: var(--crimson);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.card__arrow {
  color: var(--crimson);
  transition: transform 0.3s;
  font-size: 18px;
}

.card:hover .card__arrow {
  transform: translateX(-4px);
}

/* =========================================================
   EMPTY STATE
   ========================================================= */
.empty {
  text-align: center;
  padding: 100px 24px;
  background: var(--card-bg);
  border-radius: var(--radius-l);
  border: 2px dashed var(--border);
  animation: fadeIn 0.5s ease;
}

.empty__icon {
  font-size: 72px;
  margin-bottom: 24px;
  opacity: 0.5;
}

.empty__title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 12px;
  color: var(--text);
}

.empty__hint {
  color: var(--muted);
  font-size: 16px;
  margin-bottom: 24px;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 32px;
  background: var(--crimson);
  color: white;
  border: none;
  border-radius: var(--radius-full);
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s var(--ease-spring);
  box-shadow: var(--shadow-crimson);
}

.btn-primary:hover {
  background: var(--crimson-mid);
  transform: translateY(-3px);
  box-shadow: 0 12px 40px rgba(124,28,28,0.35);
}

/* =========================================================
   PAGINATION
   ========================================================= */
.pager {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 24px;
  margin-top: 60px;
  padding-top: 40px;
  border-top: 1px solid var(--border);
}

.pager__btn {
  padding: 14px 28px;
  border: 1px solid var(--border);
  background: var(--card-bg);
  border-radius: var(--radius-full);
  font-size: 14px;
  font-weight: 700;
  color: var(--text);
  cursor: pointer;
  transition: all 0.3s var(--ease-spring);
  display: flex;
  align-items: center;
  gap: 8px;
}

.pager__btn:hover:not(:disabled) {
  background: var(--crimson);
  color: white;
  border-color: var(--crimson);
  transform: translateX(4px);
  box-shadow: var(--shadow-crimson);
}

.pager__btn:last-child:hover:not(:disabled) {
  transform: translateX(-4px);
}

.pager__btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.pager__dots {
  display: flex;
  gap: 10px;
}

.pager__dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--border);
  cursor: pointer;
  transition: all 0.3s var(--ease-spring);
}

.pager__dot:hover {
  background: var(--amber);
  transform: scale(1.2);
}

.pager__dot--on {
  background: var(--crimson);
  transform: scale(1.3);
  box-shadow: 0 0 0 4px rgba(124,28,28,0.15);
}

/* =========================================================
   DETAIL VIEW
   ========================================================= */
.detail {
  min-height: 100vh;
  background: var(--parchment);
  animation: fadeIn 0.4s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Detail Nav */
.dnav {
  background: rgba(255,255,255,0.95);
  border-bottom: 1px solid var(--border);
  padding: 16px 0;
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(20px);
}

.dnav__inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 24px;
  border: 1px solid var(--border);
  border-radius: var(--radius-full);
  background: transparent;
  cursor: pointer;
  font-size: 15px;
  font-weight: 700;
  color: var(--text);
  transition: all 0.3s var(--ease-spring);
}

.back-btn:hover {
  background: var(--crimson);
  color: white;
  border-color: var(--crimson);
  transform: translateX(4px);
  box-shadow: var(--shadow-crimson);
}

.projects--ltr .back-btn:hover {
  transform: translateX(-4px);
}

.dnav__langinfo {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.dnav__langhelp {
  font-size: 13px;
  color: var(--muted);
  margin-right: 12px;
}

.projects--ltr .dnav__langhelp {
  margin-right: 0;
  margin-left: 12px;
}

.langpill {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  border-radius: var(--radius-full);
  font-size: 14px;
  font-weight: 700;
  border: 2px solid var(--border);
  background: var(--surface);
  transition: all 0.2s;
}

.langpill--active {
  background: var(--crimson);
  color: white;
  border-color: var(--crimson);
  box-shadow: var(--shadow-crimson);
}

.langpill--inactive {
  opacity: 0.6;
  cursor: help;
}

.langpill__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--muted);
}

.langpill__dot--ckb { background: #22c55e; }
.langpill__dot--kmr { background: #3b82f6; }

.langpill--active .langpill__dot {
  background: white;
}

.langpill__check {
  margin-right: -4px;
  margin-left: 4px;
}

.projects--ltr .langpill__check {
  margin-right: 4px;
  margin-left: -4px;
}

/* Detail Hero */
.dhero {
  position: relative;
  min-height: 50vh;
  display: grid;
  place-items: center;
  overflow: hidden;
  background: linear-gradient(135deg, var(--crimson-deep) 0%, var(--crimson) 100%);
}

.dhero__bg {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  opacity: 0.3;
  filter: blur(20px) brightness(0.8);
  transform: scale(1.1);
}

.dhero__gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 0%, var(--crimson-deep) 100%);
  opacity: 0.9;
}

.dhero__grain {
  position: absolute;
  inset: 0;
  opacity: 0.05;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  pointer-events: none;
}

.dhero__frame {
  position: absolute;
  width: 100px;
  height: 100px;
  border: 2px solid var(--amber);
  opacity: 0.3;
  pointer-events: none;
}

.dhero__frame--tl { top: 40px; left: 40px; border-right: 0; border-bottom: 0; }
.dhero__frame--br { bottom: 40px; right: 40px; border-left: 0; border-top: 0; }

.dhero__content {
  position: relative;
  z-index: 10;
  padding: 80px 24px;
  color: white;
  max-width: 900px;
  margin: 0 auto;
  text-align: center;
}

.dhero__badges {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.dbadge {
  background: rgba(255,255,255,0.15);
  border: 1px solid rgba(255,255,255,0.2);
  padding: 10px 18px;
  border-radius: var(--radius-full);
  font-size: 14px;
  font-weight: 600;
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  gap: 6px;
}

.dbadge--type {
  background: var(--amber);
  color: var(--void);
  border-color: var(--amber);
  font-weight: 700;
}

.dbadge--done {
  background: rgba(34,197,94,0.9);
  color: white;
  border-color: transparent;
}

.dbadge--ongoing {
  background: rgba(196,154,60,0.9);
  color: var(--void);
  border-color: transparent;
}

.dhero__title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(32px, 5vw, 56px);
  font-weight: 700;
  line-height: 1.2;
  margin: 0 0 20px;
  text-shadow: 0 4px 30px rgba(0,0,0,0.3);
}

.dhero__desc {
  font-size: 18px;
  line-height: 1.8;
  opacity: 0.9;
  margin-bottom: 32px;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
}

.dhero__tags {
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
}

.dtag {
  background: transparent;
  border: 1px solid rgba(255,255,255,0.4);
  color: white;
  padding: 10px 20px;
  border-radius: var(--radius-full);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.dtag:hover {
  background: var(--amber);
  color: var(--void);
  border-color: var(--amber);
  transform: translateY(-2px);
}

/* =========================================================
   MEDIA GALLERY
   ========================================================= */
.gallery {
  padding: 60px 0;
  background: var(--surface);
}

/* Tabs */
.gtabs {
  display: flex;
  gap: 12px;
  margin-bottom: 32px;
  flex-wrap: wrap;
  padding-bottom: 8px;
  border-bottom: 2px solid var(--border);
}

.gtab {
  padding: 12px 24px;
  border: none;
  background: transparent;
  border-radius: var(--radius-m);
  font-size: 15px;
  font-weight: 700;
  color: var(--muted);
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
}

.gtab:hover {
  color: var(--crimson);
  background: var(--amber-wash);
}

.gtab--on {
  color: var(--crimson);
  background: white;
  box-shadow: var(--shadow-s);
}

.gtab--on::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 20%;
  right: 20%;
  height: 3px;
  background: var(--crimson);
  border-radius: 3px 3px 0 0;
}

.gtab__n {
  background: var(--border);
  color: var(--text);
  padding: 4px 10px;
  border-radius: var(--radius-full);
  font-size: 12px;
  font-weight: 700;
}

.gtab--on .gtab__n {
  background: var(--crimson);
  color: white;
}

/* Stage */
.stage {
  background: var(--card-bg);
  border-radius: var(--radius-xl);
  padding: 32px;
  box-shadow: var(--shadow-m);
  margin-bottom: 24px;
}

/* Image Preview */
.preview--image {
  margin-bottom: 24px;
}

.imgstage {
  position: relative;
  background: var(--ink);
  border-radius: var(--radius-l);
  overflow: hidden;
  cursor: zoom-in;
  aspect-ratio: 16/9;
  display: grid;
  place-items: center;
}

.imgstage__img {
  max-width: 100%;
  max-height: 70vh;
  object-fit: contain;
  transition: transform 0.3s var(--ease);
}

.imgstage__hint {
  position: absolute;
  bottom: 20px;
  right: 20px;
  background: rgba(0,0,0,0.7);
  color: white;
  padding: 10px 16px;
  border-radius: var(--radius-full);
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
  backdrop-filter: blur(10px);
}

.imgstage:hover .imgstage__hint {
  opacity: 1;
}

/* Zoom Bar */
.zoombar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: 20px;
  padding: 16px;
  background: var(--surface);
  border-radius: var(--radius-m);
}

.zbtn {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-m);
  border: 1px solid var(--border);
  background: white;
  cursor: pointer;
  font-size: 20px;
  font-weight: 700;
  color: var(--text);
  transition: all 0.2s;
  display: grid;
  place-items: center;
}

.zbtn:hover:not(:disabled) {
  background: var(--crimson);
  color: white;
  border-color: var(--crimson);
  transform: scale(1.1);
}

.zbtn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.zbtn__val {
  font-size: 15px;
  font-weight: 700;
  color: var(--muted);
  min-width: 60px;
  text-align: center;
  font-variant-numeric: tabular-nums;
}

/* Video Preview */
.preview--video {
  margin-bottom: 24px;
}

.vidwrap {
  position: relative;
  background: #000;
  border-radius: var(--radius-l);
  overflow: hidden;
  aspect-ratio: 16/9;
}

.vid {
  width: 100%;
  height: 100%;
  object-fit: contain;
  cursor: pointer;
}

.vcontrols {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.9), transparent);
  padding: 20px;
  opacity: 0;
  transition: opacity 0.3s;
}

.vidwrap:hover .vcontrols {
  opacity: 1;
}

.vprog {
  margin-bottom: 12px;
  cursor: pointer;
  padding: 8px 0;
}

.vprog__bg {
  height: 6px;
  background: rgba(255,255,255,0.2);
  border-radius: 3px;
  position: relative;
  overflow: hidden;
}

.vprog__fill {
  height: 100%;
  background: var(--crimson);
  border-radius: 3px;
  position: relative;
}

.vprog__thumb {
  position: absolute;
  top: 50%;
  width: 14px;
  height: 14px;
  background: white;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  margin-left: -7px;
}

.vcontrols__row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
}

.vcontrols__left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.vbtn {
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 20px;
  width: 40px;
  height: 40px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  transition: all 0.2s;
}

.vbtn:hover {
  background: rgba(255,255,255,0.2);
  transform: scale(1.1);
}

.vbtn--play {
  width: 50px;
  height: 50px;
  background: var(--crimson);
  font-size: 24px;
}

.vbtn--play:hover {
  background: var(--crimson-mid);
  transform: scale(1.15);
}

.vbtn--sm {
  font-size: 16px;
  width: 36px;
  height: 36px;
}

.vtime {
  font-size: 14px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  min-width: 100px;
}

.volrow {
  display: flex;
  align-items: center;
  gap: 8px;
}

.volvol {
  width: 100px;
  height: 4px;
  -webkit-appearance: none;
  appearance: none;
  background: rgba(255,255,255,0.3);
  border-radius: 2px;
  cursor: pointer;
}

.volvol::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 14px;
  height: 14px;
  background: white;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0,0,0,0.3);
}

.volvol--warm {
  background: rgba(196,154,60,0.3);
}

.volvol--warm::-webkit-slider-thumb {
  background: var(--amber);
}

/* Audio Preview - With Waveform */
.preview--audio {
  margin-bottom: 24px;
}

.audstage {
  background: linear-gradient(135deg, var(--charcoal) 0%, var(--ink) 100%);
  border-radius: var(--radius-l);
  padding: 40px;
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 40px;
  align-items: center;
  color: white;
  position: relative;
  overflow: hidden;
}

.audstage::before {
  content: '';
  position: absolute;
  inset: 0;
  background: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  opacity: 0.03;
  pointer-events: none;
}

@media (max-width: 768px) {
  .audstage {
    grid-template-columns: 1fr;
    text-align: center;
  }
}

/* Animated Album Art */
.audart {
  position: relative;
  width: 200px;
  height: 200px;
  border-radius: var(--radius-m);
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0,0,0,0.5);
  flex-shrink: 0;
}

.audart img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.audart__rings {
  position: absolute;
  inset: -20px;
  pointer-events: none;
}

.audart__ring {
  position: absolute;
  inset: 0;
  border: 2px solid var(--amber);
  border-radius: 50%;
  opacity: 0;
  transform: scale(0.8);
  animation: ringPulse 3s ease-out infinite;
  animation-delay: calc(var(--n) * 0.5s);
}

.audart--playing .audart__ring {
  opacity: 0.4;
}

@keyframes ringPulse {
  0% { transform: scale(0.8); opacity: 0.6; }
  100% { transform: scale(1.5); opacity: 0; }
}

.audart__vinyl {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 60px;
  height: 60px;
  background: radial-gradient(circle, var(--crimson) 30%, transparent 30%);
  border-radius: 50%;
  transform: translate(-50%, -50%) scale(0);
  transition: transform 0.5s var(--ease-spring);
  box-shadow: 0 4px 20px rgba(0,0,0,0.5);
}

.audart--playing .audart__vinyl {
  transform: translate(-50%, -50%) scale(1);
  animation: spinVinyl 4s linear infinite;
}

@keyframes spinVinyl {
  to { transform: translate(-50%, -50%) rotate(360deg); }
}

/* Audio Info */
.audinfo {
  z-index: 1;
}

.audinfo__title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 12px;
  color: var(--amber-light);
}

.audinfo__body {
  font-size: 16px;
  opacity: 0.8;
  line-height: 1.6;
  margin: 0;
}

/* Audio Controls with Waveform */
.audcontrols {
  grid-column: 1 / -1;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid rgba(255,255,255,0.1);
}

.audprog {
  margin-bottom: 20px;
  cursor: pointer;
  height: 60px;
  display: flex;
  align-items: center;
  position: relative;
}

/* CSS-Generated Waveform Visualization */
.audprog__track {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  gap: 3px;
  position: relative;
}

.audprog__track::before {
  content: '';
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    90deg,
    rgba(196,154,60,0.3) 0px,
    rgba(196,154,60,0.3) 4px,
    transparent 4px,
    transparent 7px
  );
  mask-image: linear-gradient(to right, 
    transparent 0%, 
    black 5%, 
    black 95%, 
    transparent 100%
  );
  -webkit-mask-image: linear-gradient(to right, 
    transparent 0%, 
    black 5%, 
    black 95%, 
    transparent 100%
  );
  animation: waveform 1s ease-in-out infinite alternate;
}

@keyframes waveform {
  0% { opacity: 0.5; transform: scaleY(0.8); }
  100% { opacity: 1; transform: scaleY(1.2); }
}

.audprog__fill {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  background: linear-gradient(90deg, var(--crimson), var(--amber));
  opacity: 0.8;
  width: var(--progress, 0%);
  transition: width 0.1s linear;
  mix-blend-mode: overlay;
}

.audcontrols__row {
  display: flex;
  align-items: center;
  gap: 20px;
}

.audbtn {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 2px solid var(--amber);
  background: transparent;
  color: var(--amber);
  cursor: pointer;
  font-size: 24px;
  display: grid;
  place-items: center;
  transition: all 0.3s var(--ease-spring);
  flex-shrink: 0;
}

.audbtn:hover {
  background: var(--amber);
  color: var(--void);
  transform: scale(1.1);
  box-shadow: 0 0 30px rgba(196,154,60,0.4);
}

.audbtn--play {
  width: 70px;
  height: 70px;
  background: var(--crimson);
  border-color: var(--crimson);
  color: white;
  font-size: 28px;
}

.audbtn--play:hover {
  background: var(--crimson-mid);
  box-shadow: var(--shadow-crimson);
}

.audbtn--sm {
  width: 44px;
  height: 44px;
  font-size: 18px;
}

.audtime {
  font-size: 16px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: var(--amber-light);
  min-width: 120px;
}

/* Document Preview */
.preview--doc {
  margin-bottom: 24px;
}

.docstage {
  background: var(--surface);
  border: 2px dashed var(--border);
  border-radius: var(--radius-l);
  padding: 60px;
  text-align: center;
}

.docstage__ico {
  font-size: 64px;
  margin-bottom: 20px;
  opacity: 0.6;
}

.docstage__name {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 12px;
  color: var(--text);
}

.docstage__url {
  font-size: 14px;
  color: var(--muted);
  margin-bottom: 24px;
  word-break: break-all;
}

/* Caption */
.caption {
  text-align: center;
  padding-top: 24px;
  border-top: 1px solid var(--border);
}

.caption__title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 22px;
  font-weight: 700;
  margin: 0 0 12px;
  color: var(--text);
}

.caption__text {
  font-size: 16px;
  color: var(--muted);
  line-height: 1.7;
  max-width: 700px;
  margin: 0 auto;
}

/* Thumbnail Strip */
.strip {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  padding: 4px;
  margin-bottom: 24px;
  scrollbar-width: thin;
  scrollbar-color: var(--crimson) transparent;
}

.strip::-webkit-scrollbar {
  height: 6px;
}

.strip::-webkit-scrollbar-track {
  background: var(--surface);
  border-radius: 3px;
}

.strip::-webkit-scrollbar-thumb {
  background: var(--crimson);
  border-radius: 3px;
}

.sthumb {
  flex: 0 0 140px;
  height: 100px;
  border-radius: var(--radius-m);
  border: 2px solid var(--border);
  background: var(--surface);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s var(--ease-spring);
  padding: 12px;
  overflow: hidden;
}

.sthumb:hover {
  border-color: var(--amber);
  transform: translateY(-4px);
  box-shadow: var(--shadow-m);
}

.sthumb--on {
  border-color: var(--crimson);
  background: var(--crimson);
  color: white;
  box-shadow: var(--shadow-crimson);
}

.sthumb__ico {
  font-size: 28px;
}

.sthumb__lbl {
  font-size: 13px;
  font-weight: 600;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
}

/* Media Nav */
.mnav {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 24px;
}

.mnav__btn {
  padding: 12px 24px;
  border: 1px solid var(--border);
  background: white;
  border-radius: var(--radius-full);
  font-size: 14px;
  font-weight: 700;
  color: var(--text);
  cursor: pointer;
  transition: all 0.3s;
}

.mnav__btn:hover:not(:disabled) {
  background: var(--crimson);
  color: white;
  border-color: var(--crimson);
  transform: translateX(4px);
}

.projects--ltr .mnav__btn:hover:not(:disabled) {
  transform: translateX(-4px);
}

.mnav__btn:last-child:hover:not(:disabled) {
  transform: translateX(-4px);
}

.projects--ltr .mnav__btn:last-child:hover:not(:disabled) {
  transform: translateX(4px);
}

.mnav__btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.mnav__pos {
  font-size: 15px;
  font-weight: 700;
  color: var(--muted);
  font-variant-numeric: tabular-nums;
  min-width: 80px;
  text-align: center;
}

/* =========================================================
   CHIPS SECTIONS
   ========================================================= */
.chips-section {
  padding: 40px 0;
  border-bottom: 1px solid var(--border);
}

.chips-section--alt {
  background: var(--surface);
}

.chips-block__heading {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 20px;
  color: var(--crimson);
  display: flex;
  align-items: center;
  gap: 10px;
}

.chips-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.chip {
  display: inline-flex;
  padding: 10px 18px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-full);
  font-size: 14px;
  font-weight: 600;
  color: var(--text);
  transition: all 0.2s;
}

.chip:hover {
  background: var(--crimson);
  color: white;
  border-color: var(--crimson);
  transform: translateY(-2px);
  box-shadow: var(--shadow-s);
}

.chip--content {
  background: var(--amber-wash);
  border-color: var(--border-warm);
  color: var(--crimson-deep);
}

.chip--kw {
  background: rgba(124,28,28,0.05);
  border-color: rgba(124,28,28,0.2);
  color: var(--crimson);
}

/* =========================================================
   RELATED PROJECTS
   ========================================================= */
.related {
  padding: 80px 0;
  background: linear-gradient(to bottom, var(--parchment), var(--surface));
}

.related__head {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 40px;
}

.related__title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 32px;
  font-weight: 700;
  margin: 0;
  color: var(--text);
  white-space: nowrap;
}

.related__rule {
  flex: 1;
  height: 2px;
  background: linear-gradient(90deg, var(--border), transparent);
}

.related__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

/* Related Card */
.rcard {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: var(--radius-l);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.4s var(--ease-spring);
}

.rcard:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-l);
  border-color: var(--amber);
}

.rcard__img {
  position: relative;
  aspect-ratio: 16/10;
  overflow: hidden;
}

.rcard__img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s;
}

.rcard:hover .rcard__img img {
  transform: scale(1.1);
}

.rcard__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(124,28,28,0.8), transparent);
  opacity: 0;
  transition: opacity 0.3s;
}

.rcard:hover .rcard__overlay {
  opacity: 1;
}

.rcard__body {
  padding: 20px;
}

.rcard__meta {
  display: flex;
  gap: 12px;
  margin-bottom: 8px;
  font-size: 13px;
  color: var(--muted);
}

.rcard__title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 18px;
  font-weight: 700;
  margin: 0 0 8px;
  line-height: 1.3;
  color: var(--text);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.rcard__desc {
  font-size: 14px;
  color: var(--muted);
  line-height: 1.6;
  margin: 0 0 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.rcard__tags {
  display: flex;
  gap: 8px;
}

.rtag {
  font-size: 12px;
  color: var(--crimson);
  background: var(--amber-wash);
  padding: 6px 12px;
  border-radius: var(--radius-full);
  font-weight: 600;
}

/* =========================================================
   FULLSCREEN OVERLAY
   ========================================================= */
.fsoverlay {
  position: fixed;
  inset: 0;
  background: rgba(12,11,9,0.98);
  z-index: 10000;
  display: grid;
  place-items: center;
  padding: 40px;
  animation: fadeIn 0.3s ease;
  cursor: zoom-out;
}

.fsoverlay__x {
  position: absolute;
  top: 24px;
  right: 24px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: 2px solid rgba(255,255,255,0.2);
  background: rgba(0,0,0,0.5);
  color: white;
  font-size: 28px;
  cursor: pointer;
  display: grid;
  place-items: center;
  transition: all 0.3s;
  z-index: 10;
}

.fsoverlay__x:hover {
  background: var(--crimson);
  border-color: var(--crimson);
  transform: rotate(90deg);
}

.fsoverlay__frame {
  max-width: 90vw;
  max-height: 90vh;
  position: relative;
  cursor: default;
}

.fsoverlay__img {
  max-width: 100%;
  max-height: 90vh;
  object-fit: contain;
  border-radius: 4px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.5);
}

/* =========================================================
   TRANSITIONS & ANIMATIONS
   ========================================================= */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.5s var(--ease), transform 0.5s var(--ease);
}

.page-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}

.pill-enter-active,
.pill-leave-active {
  transition: all 0.4s var(--ease-spring);
}

.pill-enter-from,
.pill-leave-to {
  opacity: 0;
  transform: scale(0.8) translateY(-20px);
}

.fs-enter-active,
.fs-leave-active {
  transition: opacity 0.3s ease;
}

.fs-enter-from,
.fs-leave-to {
  opacity: 0;
}

.lang-swap-enter-active,
.lang-swap-leave-active {
  transition: opacity 0.2s ease;
}

.lang-swap-enter-from,
.lang-swap-leave-to {
  opacity: 0;
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  
  .hero__bg,
  .hero__orb,
  .stamp__ring,
  .audart__ring,
  .audart__vinyl,
  .hero__scroll {
    animation: none !important;
  }
}

/* Smooth Scroll */
:global(html) {
  scroll-behavior: smooth;
}

@media (prefers-reduced-motion: reduce) {
  :global(html) {
    scroll-behavior: auto;
  }
}
</style>