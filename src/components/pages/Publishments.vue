<template>
  <main class="pubs" :dir="lang.dir" :class="{ 'pubs--ltr': lang.isKMR }">

    <!-- ══════════════════════════════════════
         LISTING VIEW
    ══════════════════════════════════════ -->
    <transition name="page" mode="out-in">
      <div v-if="!activePub" key="listing" class="listing">

        <!-- ── EDITORIAL HERO ── -->
        <header class="hero">
          <div class="hero__canvas">
            <div class="hero__bg" :style="{ backgroundImage: `url(${heroImage})` }"></div>
            <div class="hero__film"></div>
            <div class="hero__vignette"></div>
            <div class="hero__grain"></div>
            <div class="hero__scanlines"></div>
            <!-- Decorative quill lines -->
            <div class="hero__quill hero__quill--l"></div>
            <div class="hero__quill hero__quill--r"></div>
            <!-- Floating ink orbs -->
            <div class="hero__orb orb--a"></div>
            <div class="hero__orb orb--b"></div>
            <div class="hero__orb orb--c"></div>
          </div>

          <div class="hero__inner container">
            <!-- Archive stamp -->
            <div class="hero__stamp">
              <div class="stamp__ring">
                <span class="stamp__text">{{ lang.t('publishments.heroStampText') }}</span>
                <span class="stamp__year">{{ lang.t('publishments.heroStampYear') }}</span>
              </div>
            </div>

            <div class="hero__kicker">
              <span class="kicker__rule"></span>
              <span class="kicker__text">{{ lang.t('publishments.heroKicker') }}</span>
              <span class="kicker__rule"></span>
            </div>

            <h1 class="hero__headline">
              <span class="headline__line headline__line--deco">{{ lang.t('publishments.heroHeadlineDeco') }}</span>
              <span class="headline__line headline__line--main">{{ lang.t('publishments.heroHeadlineMain') }}</span>
              <span class="headline__line headline__line--sub">{{ lang.t('publishments.heroHeadlineSub') }}</span>
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
            :aria-label="lang.t('publishments.heroScrollAria')"
          >
            <span class="scroll__label">{{ lang.t('publishments.heroScrollLabel') }}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </button>
        </header>

        <!-- ── PUBLISHMENTS BODY ── -->
        <section class="body" ref="gridSection">
          <div class="container">

            <!-- Toolbar -->
            <div class="toolbar">
              <div class="toolbar__left">
                <span class="toolbar__indicator" :class="loading ? 'ind--loading' : error ? 'ind--err' : 'ind--ok'"></span>
                <span class="toolbar__label">
                  <template v-if="loading">{{ lang.t('publishments.loading') }}</template>
                  <template v-else-if="error">{{ error }}</template>
                  <template v-else>
                    <strong>{{ filteredPubs.length }}</strong> {{ lang.t('publishments.foundResultsLabel') }}
                  </template>
                </span>
              </div>
              <div class="toolbar__right">
                <div class="tsort">
                  <select v-model="sortBy" class="tsort__sel">
                    <option value="newest">{{ lang.t('publishments.sortNewest') }}</option>
                    <option value="oldest">{{ lang.t('publishments.sortOldest') }}</option>
                    <option value="title_az">{{ lang.t('publishments.sortTitle') }}</option>
                    <option value="media_desc">{{ lang.t('publishments.sortMedia') }}</option>
                  </select>
                  <svg class="tsort__ico" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
                <button class="treset" @click="resetAllFilters" :title="lang.t('publishments.toolbarResetTitle')">
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
            <div v-else-if="!loading && filteredPubs.length === 0" class="empty">
              <div class="empty__icon">📚</div>
              <h3 class="empty__title">{{ lang.t('publishments.noResults') }}</h3>
              <p class="empty__hint">
                <template v-if="pubs.length > 0 && pubs.filter(p => hasActiveLangContent(p)).length === 0">
                  <span v-if="lang.activeLang === 'KMR'">
                    {{ lang.t('publishments.emptyActiveLangMissingKMR') }}
                  </span>
                  <span v-else>
                    {{ lang.t('publishments.emptyActiveLangMissingCKB') }}
                  </span>
                </template>
                <template v-else>{{ lang.t('publishments.noResultsHint') }}</template>
              </p>
              <button class="btn-primary" @click="resetAllFilters">{{ lang.t('publishments.resetFilters') }}</button>
            </div>

            <!-- Grid -->
            <div v-else class="grid">
              <article
                v-for="(pub, i) in filteredPubs"
                :key="pub.id"
                class="card"
                :class="{ 'card--featured': i === 0 }"
                :style="{ '--d': `${i * 0.05}s` }"
                tabindex="0"
                @click="openPub(pub)"
                @keyup.enter="openPub(pub)"
                :aria-label="`${lang.t('publishments.cardOpenAriaPrefix')}: ${pTitle(pub)}`"
              >
                <!-- Thumb -->
                <div class="card__thumb">
                  <img :src="pCover(pub)" :alt="pTitle(pub)" loading="lazy" class="card__img" @error="onCoverError($event)" />
                  <div class="card__film"></div>
                  <div class="card__scrim"></div>

                  <!-- Top badges -->
                  <div class="card__badges">
                    <div class="card__typebadge" v-if="pType(pub)">{{ getTypeIcon(pType(pub)) }} {{ pType(pub) }}</div>
                    <div class="card__statusbadge" :class="pub.status === 'PUBLISHED' ? 'card__statusbadge--done' : ''">
                      {{ pub.status === 'PUBLISHED' ? lang.t('publishments.published') : lang.t('publishments.draft') }}
                    </div>
                  </div>

                  <div class="card__count" v-if="pub.media?.length">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12z"/></svg>
                    {{ pub.media.length }}
                  </div>

                  <!-- View button overlay -->
                  <div class="card__view">
                    <span class="card__viewbtn">{{ lang.t('publishments.viewPublishment') }}</span>
                  </div>
                </div>

                <!-- Body -->
                <div class="card__body">
                  <div class="card__meta">
                    <span class="card__date" v-if="pub.publishDate || pub.createdAt">{{ formatDate(pub.publishDate || pub.createdAt) }}</span>
                    <span class="card__lang" v-for="l in (pub.contentLanguages || [])" :key="l">{{ getLanguageName(l) }}</span>
                  </div>
                  <h3 class="card__title">{{ pTitle(pub) }}</h3>
                  <p class="card__desc">{{ truncateText(pDesc(pub), 110) }}</p>

                  <div class="card__tags" v-if="pTags(pub).length">
                    <button
                      v-for="tag in pTags(pub).slice(0, 3)"
                      :key="tag"
                      class="ctag"
                      @click.stop="filterByTag(tag)"
                    >#{{ tag }}</button>
                    <span v-if="pTags(pub).length > 3" class="ctag ctag--more">+{{ pTags(pub).length - 3 }}</span>
                  </div>
                </div>

                <div class="card__foot">
                  <span class="card__cta">{{ lang.t('publishments.viewPublishment') }}</span>
                  <span class="card__arrow">{{ lang.isKMR ? '→' : '←' }}</span>
                </div>
              </article>
            </div>

            <!-- Pagination -->
            <nav class="pager" v-if="totalPages > 1 && !loading">
              <button class="pager__btn" :disabled="currentPage === 0" @click="goToPrev">{{ lang.t('publishments.prevPage') }}</button>
              <div class="pager__dots">
                <span
                  v-for="p in Math.min(totalPages, 7)"
                  :key="p"
                  class="pager__dot"
                  :class="{ 'pager__dot--on': (p - 1) === currentPage }"
                  @click="goToPage(p - 1)"
                ></span>
              </div>
              <button class="pager__btn" :disabled="currentPage + 1 >= totalPages" @click="goToNext">{{ lang.t('publishments.nextPage') }}</button>
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
            <button class="back-btn" @click="closePub">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
              <span>{{ lang.t('publishments.backToPublishments') }}</span>
            </button>

            <!-- Language indicator -->
            <div class="dnav__langinfo" v-if="activePub.contentLanguages?.length">
              <div
                v-for="l in activePub.contentLanguages"
                :key="l"
                class="langpill"
                :class="{
                  'langpill--active': lang.activeLang === l,
                  'langpill--inactive': lang.activeLang !== l
                }"
                :title="lang.activeLang !== l
                  ? (l === 'CKB' ? lang.t('publishments.publishmentHasSorani') : lang.t('publishments.publishmentHasKurmanji'))
                  : ''"
              >
                <span class="langpill__dot" :class="`langpill__dot--${l.toLowerCase()}`"></span>
                <span class="langpill__name">{{ l === 'CKB' ? lang.t('publishments.sorani') : lang.t('publishments.kurmanji') }}</span>
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
              <span class="dnav__langhelp">{{ lang.t('publishments.languageSwitchHint') }}</span>
            </div>
          </div>
        </nav>

        <!-- Detail Hero -->
        <header class="dhero">
          <div class="dhero__bg" :style="{ backgroundImage: `url(${pCover(activePub)})` }"></div>
          <div class="dhero__gradient"></div>
          <div class="dhero__grain"></div>
          <div class="dhero__frame dhero__frame--tl"></div>
          <div class="dhero__frame dhero__frame--br"></div>

          <div class="container dhero__content">
            <transition name="lang-swap" mode="out-in">
              <div :key="detailLang" class="dhero__inner">
                <div class="dhero__badges">
                  <span class="dbadge dbadge--type" v-if="pType(activePub)">{{ getTypeIcon(pType(activePub)) }} {{ pType(activePub) }}</span>
                  <span class="dbadge" v-if="activePub.publishDate || activePub.createdAt">📅 {{ formatDate(activePub.publishDate || activePub.createdAt) }}</span>
                  <span class="dbadge" v-if="pLocation(activePub)">📍 {{ pLocation(activePub) }}</span>
                  <span class="dbadge" v-for="l in (activePub.contentLanguages || [])" :key="l">🗣️ {{ getLanguageName(l) }}</span>
                  <span class="dbadge" :class="activePub.status === 'PUBLISHED' ? 'dbadge--done' : 'dbadge--ongoing'">
                    {{ activePub.status === 'PUBLISHED' ? lang.t('publishments.publishedBadge') : lang.t('publishments.draftBadge') }}
                  </span>
                </div>
                <h1 class="dhero__title">{{ pTitle(activePub) }}</h1>
                <p class="dhero__desc" v-if="pDesc(activePub)">{{ pDesc(activePub) }}</p>
                <div class="dhero__tags" v-if="pTags(activePub).length">
                  <button v-for="tag in pTags(activePub)" :key="tag" class="dtag" @click="filterFromDetail(tag)">#{{ tag }}</button>
                </div>
              </div>
            </transition>
          </div>
        </header>

        <!-- ── MEDIA GALLERY ── -->
        <section class="gallery" v-if="pubMedia.length">
          <div class="container">

            <!-- Tab Row -->
            <div class="gtabs" v-if="availableMediaTypes.length > 1">
              <button class="gtab" :class="{ 'gtab--on': activeMediaFilter === 'all' }" @click="activeMediaFilter = 'all'">
                {{ lang.t('publishments.allMedia') }} <span class="gtab__n">{{ pubMedia.length }}</span>
              </button>
              <button
                v-for="type in availableMediaTypes"
                :key="type"
                class="gtab"
                :class="{ 'gtab--on': activeMediaFilter === type }"
                @click="activeMediaFilter = type"
              >
                {{ getMediaIcon(type) }} {{ getMediaLabel(type) }}
                <span class="gtab__n">{{ pubMedia.filter(m => m.mediaType === type).length }}</span>
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
                    :alt="selectedMedia.caption || pTitle(activePub)"
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
                    <span>{{ lang.t('publishments.zoomImage') }}</span>
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
                    :poster="pCover(activePub)"
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
                    <img :src="pCover(activePub)" :alt="pTitle(activePub)" @error="onCoverError($event)" />
                    <div class="audart__rings">
                      <span v-for="n in 4" :key="n" class="audart__ring" :style="{ '--n': n }"></span>
                    </div>
                    <div class="audart__vinyl"></div>
                  </div>

                  <div class="audinfo">
                    <h4 class="audinfo__title">{{ selectedMedia.caption || lang.t('publishments.unnamed') }}</h4>
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
                  <h4 class="docstage__name">{{ selectedMedia?.caption || lang.t('publishments.documentDefault') }}</h4>
                  <p class="docstage__url" v-if="selectedMedia?.url">{{ selectedMedia?.url }}</p>
                  <a v-if="selectedMedia?.url" :href="selectedMedia.url" target="_blank" class="btn-primary">
                    {{ lang.t('publishments.openDocument') }}
                  </a>
                </div>
              </div>

              <!-- Caption -->
              <div class="caption" v-if="selectedMedia">
                <h4 class="caption__title">{{ selectedMedia.caption || pTitle(activePub) }}</h4>
                <p class="caption__text" v-if="selectedMedia.textBody || pDesc(activePub)">
                  {{ selectedMedia.textBody || pDesc(activePub) }}
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
              <button class="mnav__btn" @click="previousMedia" :disabled="!canGoPreviousMedia">{{ lang.t('publishments.prevMedia') }}</button>
              <span class="mnav__pos">{{ currentMediaIndex + 1 }} / {{ displayedMedia.length }}</span>
              <button class="mnav__btn" @click="nextMedia" :disabled="!canGoNextMedia">{{ lang.t('publishments.nextMedia') }}</button>
            </div>
          </div>
        </section>

        <!-- Contents -->
        <section class="chips-section" v-if="pContents(activePub).length">
          <div class="container">
            <div class="chips-block">
              <h3 class="chips-block__heading">{{ lang.t('publishments.contents') }}</h3>
              <div class="chips-row">
                <span v-for="c in pContents(activePub)" :key="c" class="chip chip--content">{{ c }}</span>
              </div>
            </div>
          </div>
        </section>

        <!-- Keywords -->
        <section class="chips-section chips-section--alt" v-if="pKeywords(activePub).length">
          <div class="container">
            <div class="chips-block">
              <h3 class="chips-block__heading">{{ lang.t('publishments.keywords') }}</h3>
              <div class="chips-row">
                <span v-for="k in pKeywords(activePub)" :key="k" class="chip chip--kw">{{ k }}</span>
              </div>
            </div>
          </div>
        </section>

        <!-- Related -->
        <section class="related" v-if="relatedPubs.length">
          <div class="container">
            <div class="related__head">
              <h2 class="related__title">{{ lang.t('publishments.related') }}</h2>
              <div class="related__rule"></div>
            </div>
            <div class="related__grid">
              <article
                v-for="rp in relatedPubs"
                :key="rp.id"
                class="rcard"
                tabindex="0"
                @click="openPub(rp)"
                @keyup.enter="openPub(rp)"
              >
                <div class="rcard__img">
                  <img :src="pCover(rp)" :alt="pTitle(rp)" loading="lazy" @error="onCoverError($event)" />
                  <div class="rcard__overlay"></div>
                </div>
                <div class="rcard__body">
                  <div class="rcard__meta">
                    <span v-if="pType(rp)">{{ getTypeIcon(pType(rp)) }} {{ pType(rp) }}</span>
                    <span v-if="rp.publishDate || rp.createdAt">{{ formatDate(rp.publishDate || rp.createdAt) }}</span>
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
import axios from 'axios'
import { API_BASE_URL } from '../consts.js'
import { useLanguageStore } from '@/stores/useLanguageStore'

/* ── CONFIG ── */
const heroImage   = 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=2000&q=80'
const fallbackCover = 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1400&q=80'

/* ── GLOBAL LANGUAGE STORE ── */
const lang = useLanguageStore()

const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' }
})

/* ── STATE ── */
const pubs        = ref([])
const loading     = ref(false)
const error       = ref('')
const currentPage = ref(0)
const pageSize    = ref(20)
const tagFilter   = ref('')
const sortBy      = ref('newest')

const activePub         = ref(null)
const detailLang        = computed(() => lang.activeLang)
const selectedMedia     = ref(null)
const zoomLevel         = ref(1)
const activeMediaFilter = ref('all')

const videoPlayer           = ref(null)
const videoPlayerContainer  = ref(null)
const isVideoPlaying  = ref(false)
const isVideoMuted    = ref(false)
const videoVolume     = ref(1)
const videoCurrentTime = ref(0)
const videoDuration   = ref(0)
const videoProgress   = ref(0)

const audioPlayer     = ref(null)
const isAudioPlaying  = ref(false)
const isAudioMuted    = ref(false)
const audioVolume     = ref(1)
const audioCurrentTime = ref(0)
const audioDuration   = ref(0)
const audioProgress   = ref(0)

const isFullscreen      = ref(false)
const fullscreenContent = ref(null)
const gridSection       = ref(null)

/* ── RESPONSE EXTRACTORS
     Each controller returns a different shape — normalize all to a plain array
── */
function extractList(responseData) {
  if (!responseData) return []

  // ApiResponse<List>  →  { success, data: [...], message }   (writings, image-collections)
  if (responseData.success !== undefined && Array.isArray(responseData.data)) {
    return responseData.data
  }

  // Spring Page  →  { content: [...], totalPages, ... }   (films)
  if (Array.isArray(responseData.content)) {
    return responseData.content
  }

  // Plain array  →  [...]   (soundtracks, albums)
  if (Array.isArray(responseData)) {
    return responseData
  }

  return []
}

/* ── FETCH ALL SOURCES IN PARALLEL ── */
async function fetchPubs() {
  loading.value = true
  error.value   = ''

  const endpoints = [
    { url: '/films',              source: 'film'              },
    { url: '/image-collections',  source: 'image_collection'  },
    { url: '/soundtracks',        source: 'soundtrack'        },
    { url: '/albums',             source: 'album'             },
    { url: '/writings',           source: 'writing'           },
  ]

  try {
    const results = await Promise.allSettled(
      endpoints.map(e => api.get(e.url))
    )

    const merged = []

    results.forEach((result, i) => {
      if (result.status === 'fulfilled') {
        const list = extractList(result.value.data)
        list.forEach(item => {
          merged.push({ ...item, _source: endpoints[i].source })
        })
      } else {
        console.warn(`⚠️ Failed to fetch ${endpoints[i].url}:`, result.reason?.message)
      }
    })

    pubs.value    = merged
    currentPage.value = 0
  } catch (e) {
    error.value = e.message || lang.t('publishments.fetchFailed')
  } finally {
    loading.value = false
  }
}

/* ── CONTENT HELPERS — delegated to global language store ── */
function pTitle(p)    { return lang.title(p) }
function pDesc(p)     { return lang.description(p) }
function pLocation(p) { return lang.location(p) }
function pType(p)     { return lang.publishmentType(p) }
function pTags(p)     { return lang.tags(p) }
function pContents(p) { return lang.contents(p) }
function pKeywords(p) { return lang.keywords(p) }
function allTags(p)   { return lang.allTags(p) }

function pCover(p) {
  if (!p) return fallbackCover
  // albums use coverUrlCkb / coverUrlKmr
  if (p.coverUrlCkb || p.coverUrlKmr) return p.coverUrlCkb || p.coverUrlKmr
  if (p.coverUrl) return p.coverUrl
  const img = (p.media || []).find(m => m.mediaType === 'IMAGE' && m.url)
  return img?.url || fallbackCover
}

function hasActiveLangContent(p) {
  return lang.hasContentInLanguage(p, lang.activeLang)
}

/* ── COMPUTED ── */
const sortedFiltered = computed(() => {
  let list = pubs.value.filter(p => hasActiveLangContent(p))

  if (tagFilter.value) {
    list = list.filter(p => allTags(p).includes(tagFilter.value))
  }

  switch (sortBy.value) {
    case 'newest':
      list.sort((a, b) => (b.publishDate || b.createdAt || '').localeCompare(a.publishDate || a.createdAt || ''))
      break
    case 'oldest':
      list.sort((a, b) => (a.publishDate || a.createdAt || '').localeCompare(b.publishDate || b.createdAt || ''))
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

// client-side pagination
const totalPages    = computed(() => Math.max(1, Math.ceil(sortedFiltered.value.length / pageSize.value)))
const totalElements = computed(() => pubs.value.length)

const filteredPubs = computed(() => {
  const start = currentPage.value * pageSize.value
  return sortedFiltered.value.slice(start, start + pageSize.value)
})

const heroStats = computed(() => {
  const visible = pubs.value.filter(p => hasActiveLangContent(p))
  return [
    { value: totalElements.value,                                                   label: lang.t('publishments.totalPublishments') },
    { value: visible.length,                                                        label: lang.t('publishments.shown') },
    { value: visible.reduce((s, p) => s + (p.media?.length || 0), 0),              label: lang.t('publishments.media') },
  ]
})

const relatedPubs = computed(() => {
  if (!activePub.value) return []
  const myTags = new Set(allTags(activePub.value))
  return pubs.value
    .filter(p =>
      p.id !== activePub.value.id &&
      p._source === activePub.value._source &&   // same content type
      hasActiveLangContent(p) &&
      allTags(p).some(t => myTags.has(t))
    )
    .slice(0, 4)
})

const pubMedia = computed(() => {
  if (!activePub.value) return []
  const media = [...(activePub.value.media || [])].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
  // inject cover as first image if no IMAGE media exists
  const coverUrl = pCover(activePub.value)
  if (!media.some(m => m.mediaType === 'IMAGE') && coverUrl !== fallbackCover) {
    media.unshift({ id: '__cover__', mediaType: 'IMAGE', url: coverUrl, caption: lang.t('publishments.coverLabel'), sortOrder: -1 })
  }
  return media
})

const availableMediaTypes = computed(() => [...new Set(pubMedia.value.map(m => m.mediaType))])

const displayedMedia = computed(() =>
  activeMediaFilter.value === 'all'
    ? pubMedia.value
    : pubMedia.value.filter(m => m.mediaType === activeMediaFilter.value)
)

const currentMediaIndex = computed(() => {
  if (!selectedMedia.value) return 0
  return displayedMedia.value.findIndex(m => (m.id || m.url) === (selectedMedia.value.id || selectedMedia.value.url))
})

const canGoPreviousMedia = computed(() => currentMediaIndex.value > 0)
const canGoNextMedia     = computed(() => currentMediaIndex.value < displayedMedia.value.length - 1)

/* ── HELPERS ── */
function getLanguageName(code) { return lang.languageName(code) }

function getTypeIcon(type) {
  return {
    BOOK:'📖', ARTICLE:'📝', JOURNAL:'📰', THESIS:'🎓', REPORT:'📊',
    MAGAZINE:'📰', NEWSPAPER:'🗞️', RESEARCH:'🔬', POETRY:'✒️',
    CULTURAL_EVENT:'🎭', WORKSHOP:'🎓', EXHIBITION:'🖼️', CONFERENCE:'🎤',
    PUBLICATION:'📖', DIGITIZATION:'💾', OTHER:'📋',
    // album types
    AUDIO:'🎵', VIDEO:'🎬',
  }[type] || '📋'
}

function getMediaIcon(type) {
  return { IMAGE:'🖼️', VIDEO:'🎬', AUDIO:'🎵', DOCUMENT:'📄', PDF:'📕', TEXT:'📝' }[type] || '📎'
}

function getMediaLabel(type)    { return lang.mediaLabel(type) }

function truncateText(text, max) {
  if (!text) return ''
  return text.length > max ? text.slice(0, max) + '…' : text
}

function formatDate(v) {
  if (!v) return ''
  try {
    const d = new Date(v)
    if (Number.isNaN(d.getTime())) return String(v)
    return d.toLocaleDateString(lang.dateLocales, { year: 'numeric', month: 'long', day: 'numeric' })
  } catch {
    const d = new Date(v)
    return isNaN(d.getTime()) ? String(v) : d.toISOString().slice(0, 10)
  }
}

function formatTime(s) {
  if (!s || isNaN(s)) return '0:00'
  return `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, '0')}`
}

/* ── Filters / Pagination ── */
function filterByTag(tag)   { tagFilter.value = tag; currentPage.value = 0; window.scrollTo({ top: 0, behavior: 'smooth' }) }
function filterFromDetail(tag) { closePub(); setTimeout(() => filterByTag(tag), 400) }
function clearTagFilter()   { tagFilter.value = ''; currentPage.value = 0 }
function resetAllFilters()  { tagFilter.value = ''; sortBy.value = 'newest'; currentPage.value = 0 }

function goToPrev() {
  if (currentPage.value > 0) { currentPage.value--; window.scrollTo({ top: 0, behavior: 'smooth' }) }
}
function goToNext() {
  if (currentPage.value + 1 < totalPages.value) { currentPage.value++; window.scrollTo({ top: 0, behavior: 'smooth' }) }
}
function goToPage(p)    { currentPage.value = p; window.scrollTo({ top: 0, behavior: 'smooth' }) }
function scrollToGrid() { gridSection.value?.scrollIntoView({ behavior: 'smooth' }) }

/* ── Detail / Media ── */
function openPub(p) {
  activePub.value       = p
  activeMediaFilter.value = 'all'
  zoomLevel.value       = 1
  window.scrollTo({ top: 0, behavior: 'smooth' })
  nextTick(() => { selectedMedia.value = pubMedia.value[0] || null; resetVideoState(); resetAudioState() })
}

function closePub() {
  resetVideoState(); resetAudioState()
  activePub.value = null; selectedMedia.value = null; zoomLevel.value = 1
}

function selectMedia(media) { resetVideoState(); resetAudioState(); selectedMedia.value = media; zoomLevel.value = 1 }

function resetVideoState() {
  if (videoPlayer.value) { videoPlayer.value.pause(); videoPlayer.value.currentTime = 0 }
  isVideoPlaying.value = false; videoCurrentTime.value = 0; videoDuration.value = 0; videoProgress.value = 0
}

function resetAudioState() {
  if (audioPlayer.value) { audioPlayer.value.pause(); audioPlayer.value.currentTime = 0 }
  isAudioPlaying.value = false; audioCurrentTime.value = 0; audioDuration.value = 0; audioProgress.value = 0
}

watch(activeMediaFilter, () => { selectedMedia.value = displayedMedia.value[0] || null; zoomLevel.value = 1 })

watch(displayedMedia, (list) => {
  if (!list?.length) { selectedMedia.value = null; return }
  if (!selectedMedia.value) { selectedMedia.value = list[0]; return }
  const exists = list.some(m => (m.id || m.url) === (selectedMedia.value.id || selectedMedia.value.url))
  if (!exists) selectedMedia.value = list[0]
})

watch([tagFilter, sortBy], () => { currentPage.value = 0 })

/* ── Video ── */
function onVideoLoaded() {
  if (videoPlayer.value) { videoDuration.value = videoPlayer.value.duration; videoPlayer.value.volume = videoVolume.value }
}
function onVideoTimeUpdate() {
  if (videoPlayer.value) {
    videoCurrentTime.value = videoPlayer.value.currentTime
    videoProgress.value    = (videoPlayer.value.currentTime / videoPlayer.value.duration) * 100 || 0
  }
}
function toggleVideoPlay()    { if (!videoPlayer.value) return; videoPlayer.value.paused ? videoPlayer.value.play() : videoPlayer.value.pause() }
function toggleMute()         { if (!videoPlayer.value) return; videoPlayer.value.muted = !videoPlayer.value.muted; isVideoMuted.value = videoPlayer.value.muted }
function changeVideoVolume(e) {
  if (!videoPlayer.value) return
  const v = Number(e.target.value) / 100
  videoPlayer.value.volume = v; videoVolume.value = v
  if (v > 0 && isVideoMuted.value) { videoPlayer.value.muted = false; isVideoMuted.value = false }
}
function seekVideo(e) {
  if (!videoPlayer.value) return
  const r = e.currentTarget.getBoundingClientRect()
  videoPlayer.value.currentTime = ((e.clientX - r.left) / r.width) * videoPlayer.value.duration
}
function toggleVideoFullscreen() {
  if (!videoPlayerContainer.value) return
  document.fullscreenElement
    ? document.exitFullscreen()
    : (videoPlayerContainer.value.requestFullscreen?.() || videoPlayerContainer.value.webkitRequestFullscreen?.())
}

/* ── Audio ── */
function onAudioLoaded() {
  if (audioPlayer.value) { audioDuration.value = audioPlayer.value.duration; audioPlayer.value.volume = audioVolume.value }
}
function onAudioTimeUpdate() {
  if (audioPlayer.value) {
    audioCurrentTime.value = audioPlayer.value.currentTime
    audioProgress.value    = (audioPlayer.value.currentTime / audioPlayer.value.duration) * 100 || 0
  }
}
function toggleAudioPlay()    { if (!audioPlayer.value) return; audioPlayer.value.paused ? audioPlayer.value.play() : audioPlayer.value.pause() }
function toggleAudioMute()    { if (!audioPlayer.value) return; audioPlayer.value.muted = !audioPlayer.value.muted; isAudioMuted.value = audioPlayer.value.muted }
function changeAudioVolume(e) {
  if (!audioPlayer.value) return
  const v = Number(e.target.value) / 100
  audioPlayer.value.volume = v; audioVolume.value = v
  if (v > 0 && isAudioMuted.value) { audioPlayer.value.muted = false; isAudioMuted.value = false }
}
function seekAudio(e) {
  if (!audioPlayer.value) return
  const r = e.currentTarget.getBoundingClientRect()
  audioPlayer.value.currentTime = ((e.clientX - r.left) / r.width) * audioPlayer.value.duration
}
function previousMedia() { if (canGoPreviousMedia.value) selectMedia(displayedMedia.value[currentMediaIndex.value - 1]) }
function nextMedia()     { if (canGoNextMedia.value)     selectMedia(displayedMedia.value[currentMediaIndex.value + 1]) }

/* ── Zoom / Fullscreen ── */
function zoomIn()    { if (zoomLevel.value < 3) zoomLevel.value += 0.25 }
function zoomOut()   { if (zoomLevel.value > 1) zoomLevel.value -= 0.25 }
function resetZoom() { zoomLevel.value = 1 }
function openFullscreen(media) {
  if (media?.mediaType === 'IMAGE') {
    fullscreenContent.value = { type: 'image', url: media.url, caption: media.caption }
    isFullscreen.value = true
  }
}
function exitFullscreen() { isFullscreen.value = false; fullscreenContent.value = null }

/* ── Fallback Images ── */
function onCoverError(e)   { e.target.src = fallbackCover }
function onPreviewError(e) { e.target.src = fallbackCover }

/* ── Keyboard ── */
function handleKeydown(e) {
  if (isFullscreen.value && e.key === 'Escape') { exitFullscreen(); return }
  if (!activePub.value) return
  if (e.key === 'Escape')     closePub()
  if (e.key === 'ArrowLeft')  nextMedia()
  if (e.key === 'ArrowRight') previousMedia()
}

/* ── React to global language changes ── */
watch(() => lang.activeLang, () => {
  if (isFullscreen.value) exitFullscreen()
  zoomLevel.value   = 1
  currentPage.value = 0

  if (activePub.value && !hasActiveLangContent(activePub.value)) closePub()
  if (activePub.value && activeMediaFilter.value !== 'all' && !availableMediaTypes.value.includes(activeMediaFilter.value)) {
    activeMediaFilter.value = 'all'
  }
  if (tagFilter.value) {
    const visible = pubs.value.filter(p => hasActiveLangContent(p))
    if (!visible.some(p => allTags(p).includes(tagFilter.value))) tagFilter.value = ''
  }
  if (!activePub.value) window.scrollTo({ top: 0, behavior: 'smooth' })
})

/* ── Lifecycle ── */
onMounted(() => { fetchPubs(); window.addEventListener('keydown', handleKeydown) })
onUnmounted(() => { resetVideoState(); resetAudioState(); exitFullscreen(); window.removeEventListener('keydown', handleKeydown) })
</script>



<style scoped>
/* ════════════════════════════════════════════════
   FONTS & ROOT TOKENS — Editorial Theme
════════════════════════════════════════════════ */
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,600&family=DM+Sans:wght@300;400;500;600;700&display=swap');

.pubs {
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

.container {
  max-width: 1300px;
  margin: 0 auto;
  padding: 0 2.5rem;
}

/* ── PAGE TRANSITIONS ── */
.page-enter-active { transition: opacity .5s var(--ease), transform .5s var(--ease); }
.page-leave-active { transition: opacity .3s ease, transform .3s ease; }
.page-enter-from   { opacity: 0; transform: translateY(40px); }
.page-leave-to     { opacity: 0; transform: translateY(-20px); }

/* ════════════════════════════════════════════════
   HERO — Editorial Library
════════════════════════════════════════════════ */
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: var(--void);
}

.hero__canvas { position: absolute; inset: 0; }

.hero__bg {
  position: absolute; inset: -5%;
  background-size: cover;
  background-position: center;
  filter: brightness(.16) saturate(1.3) sepia(.3);
  animation: bgdrift 80s ease-in-out infinite alternate;
}
@keyframes bgdrift {
  0%   { transform: scale(1.05) translateX(0) translateY(0); }
  33%  { transform: scale(1.12) translateX(-25px) translateY(10px); }
  66%  { transform: scale(1.08) translateX(15px) translateY(-8px); }
  100% { transform: scale(1.15) translateX(-10px) translateY(5px); }
}

.hero__film {
  position: absolute; inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)' opacity='0.08'/%3E%3C/svg%3E");
  pointer-events: none;
  mix-blend-mode: overlay;
  animation: grainshift 0.18s steps(1) infinite;
}
@keyframes grainshift {
  0%   { transform: translateX(0) translateY(0); }
  25%  { transform: translateX(-2px) translateY(1px); }
  50%  { transform: translateX(1px) translateY(-2px); }
  75%  { transform: translateX(-1px) translateY(2px); }
  100% { transform: translateX(2px) translateY(-1px); }
}

.hero__vignette {
  position: absolute; inset: 0;
  background:
    radial-gradient(ellipse 120% 80% at 50% 0%, transparent 0%, rgba(0,0,0,.7) 100%),
    radial-gradient(ellipse 90% 60% at 85% 15%, rgba(124,28,28,.18) 0%, transparent 55%),
    radial-gradient(ellipse 70% 50% at 15% 85%, rgba(196,154,60,.1) 0%, transparent 55%),
    linear-gradient(180deg, rgba(0,0,0,.25) 0%, rgba(0,0,0,.5) 50%, rgba(0,0,0,.92) 100%);
}

.hero__scanlines {
  position: absolute; inset: 0; pointer-events: none;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0,0,0,.04) 2px,
    rgba(0,0,0,.04) 4px
  );
}

/* Decorative quill lines */
.hero__quill {
  position: absolute;
  width: 1px;
  height: 35%;
  z-index: 5; pointer-events: none;
  opacity: .2;
}
.hero__quill--l {
  right: 12%;
  top: 8%;
  background: linear-gradient(180deg, transparent, var(--amber), transparent);
}
.hero__quill--r {
  left: 12%;
  bottom: 8%;
  background: linear-gradient(180deg, transparent, var(--amber), transparent);
}

/* Atmospheric orbs */
.hero__orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  pointer-events: none;
}
.orb--a { width: 600px; height: 600px; background: radial-gradient(circle, rgba(124,28,28,.28) 0%, transparent 70%); top: -20%; right: -10%; animation: orbdrift 20s ease-in-out infinite alternate; }
.orb--b { width: 500px; height: 500px; background: radial-gradient(circle, rgba(196,154,60,.13) 0%, transparent 70%); bottom: -10%; left: -5%; animation: orbdrift 25s ease-in-out infinite alternate-reverse; }
.orb--c { width: 350px; height: 350px; background: radial-gradient(circle, rgba(124,28,28,.13) 0%, transparent 70%); top: 35%; left: 35%; animation: orbdrift 18s ease-in-out infinite; }
@keyframes orbdrift {
  0%   { transform: translate(0, 0) scale(1); }
  50%  { transform: translate(30px, -20px) scale(1.1); }
  100% { transform: translate(-15px, 30px) scale(.95); }
}

.hero__inner {
  position: relative; z-index: 10;
  width: 100%;
  animation: herorise 1.2s var(--ease) .1s both;
}
@keyframes herorise {
  from { opacity: 0; transform: translateY(70px); filter: blur(8px); }
  to   { opacity: 1; transform: translateY(0); filter: blur(0); }
}

/* Archive stamp */
.hero__stamp {
  display: flex; justify-content: center;
  margin-bottom: 3rem;
  animation: fadein 1s var(--ease) .2s both;
}
.stamp__ring {
  width: 90px; height: 90px;
  border: 1.5px solid rgba(196,154,60,.5);
  border-radius: 50%;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: 0;
  position: relative;
  box-shadow: 0 0 0 4px rgba(196,154,60,.08), 0 0 30px rgba(196,154,60,.1);
}
.stamp__text {
  font-size: .38rem;
  letter-spacing: .12em;
  color: rgba(196,154,60,.8);
  text-transform: uppercase;
  font-weight: 600;
  line-height: 1.2;
  text-align: center;
  padding: 0 6px;
}
.stamp__year {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 1.1rem;
  font-weight: 600;
  color: rgba(196,154,60,.9);
  line-height: 1;
  margin-top: 2px;
}

/* Kicker */
.hero__kicker {
  display: flex; align-items: center; gap: 1.25rem;
  justify-content: center;
  margin-bottom: 2rem;
  animation: fadein 1s var(--ease) .4s both;
}
@keyframes fadein { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }

.kicker__rule {
  display: block; flex: 0 0 50px; height: 1px;
  background: linear-gradient(90deg, transparent, rgba(196,154,60,.5));
}
.kicker__rule:last-child { background: linear-gradient(270deg, transparent, rgba(196,154,60,.5)); }
.kicker__text {
  font-family: 'DM Sans', sans-serif;
  font-size: .72rem; font-weight: 600;
  letter-spacing: .2em; color: var(--amber-light);
  text-transform: uppercase; white-space: nowrap;
}

/* Headline */
.hero__headline {
  text-align: center;
  margin-bottom: 2.5rem;
  display: flex; flex-direction: column; align-items: center; gap: .5rem;
}
.headline__line {
  display: block;
  animation: fadein 1s var(--ease) both;
}
.headline__line--deco {
  font-size: .85rem;
  color: rgba(196,154,60,.6);
  letter-spacing: .4em;
  animation-delay: .45s;
}
.headline__line--main {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: clamp(4rem, 8vw, 7rem);
  font-weight: 300;
  font-style: italic;
  color: #fff;
  line-height: 1;
  letter-spacing: -.02em;
  background: linear-gradient(165deg, #fff 40%, rgba(196,154,60,.85) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation-delay: .6s;
}
.headline__line--sub {
  font-family: 'DM Sans', sans-serif;
  font-size: clamp(.8rem, 1.5vw, 1rem);
  font-weight: 400;
  letter-spacing: .25em;
  color: rgba(255,255,255,.42);
  text-transform: uppercase;
  animation-delay: .75s;
}

/* Stats */
.hero__stats {
  display: flex; justify-content: center; align-items: center;
  border: 1px solid rgba(196,154,60,.15);
  background: rgba(255,255,255,.03);
  backdrop-filter: blur(20px);
  border-radius: var(--radius-l);
  padding: 2rem 4rem;
  max-width: 580px;
  margin: 0 auto 2rem;
  gap: 0;
  animation: fadein 1s var(--ease) .85s both;
}
.hstat { display: flex; align-items: stretch; gap: 0; flex: 1; }
.hstat__inner { text-align: center; flex: 1; padding: 0 2.5rem; }
.hstat__sep { width: 1px; background: rgba(196,154,60,.2); flex-shrink: 0; }
.hstat__num {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(2.2rem, 4vw, 3rem);
  font-weight: 600;
  color: #fff;
  line-height: 1;
  margin-bottom: .35rem;
}
.hstat__lbl {
  font-size: .68rem;
  font-weight: 600;
  color: rgba(196,154,60,.75);
  letter-spacing: .14em;
  text-transform: uppercase;
}

/* Active tag pill */
.pill-enter-active, .pill-leave-active { transition: all .4s var(--ease); }
.pill-enter-from, .pill-leave-to { opacity: 0; transform: translateY(14px) scale(.95); }
.hero__activetag { margin-top: 1.5rem; display: flex; justify-content: center; }
.atag {
  display: inline-flex; align-items: center; gap: .7rem;
  background: rgba(255,255,255,.06);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(196,154,60,.3);
  padding: .65rem 1.4rem;
  border-radius: var(--radius-full);
  color: #fff;
  font-size: .9rem; font-weight: 500;
}
.atag__hash { color: var(--amber-light); font-weight: 700; }
.atag__x {
  width: 22px; height: 22px;
  display: flex; align-items: center; justify-content: center;
  background: rgba(255,255,255,.08);
  border: none; border-radius: 50%; color: rgba(255,255,255,.7);
  cursor: pointer; font-size: .72rem;
  transition: all .25s var(--ease-spring);
}
.atag__x:hover { background: var(--crimson); color: #fff; transform: rotate(90deg) scale(1.15); }

/* Scroll indicator */
.hero__scroll {
  position: absolute; bottom: 3rem; left: 50%; transform: translateX(-50%);
  z-index: 10; border: none; background: none;
  display: flex; flex-direction: column; align-items: center; gap: .4rem;
  color: rgba(255,255,255,.4); cursor: pointer;
  transition: all .3s; animation: scrollbounce 3s ease-in-out infinite;
  padding: 0;
}
.hero__scroll:hover { color: rgba(196,154,60,.9); }
.scroll__label {
  font-size: .65rem; font-weight: 600; letter-spacing: .16em;
  text-transform: uppercase; color: inherit;
}
@keyframes scrollbounce {
  0%,100% { transform: translateX(-50%) translateY(0); opacity: .5; }
  50% { transform: translateX(-50%) translateY(10px); opacity: 1; }
}

/* ════════════════════════════════════════════════
   BODY & GRID
════════════════════════════════════════════════ */
.body {
  padding: 5rem 0 8rem;
  background: var(--parchment);
  position: relative;
}
.body::before {
  content: '';
  display: block;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--amber), transparent);
  opacity: .4;
}

/* Toolbar */
.toolbar {
  display: flex; justify-content: space-between; align-items: center;
  background: var(--card-bg);
  padding: 1rem 1.5rem;
  border-radius: var(--radius-m);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-xs);
  margin-bottom: 3rem;
  gap: 1rem;
}
.toolbar__left { display: flex; align-items: center; gap: .6rem; }
.toolbar__indicator {
  width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0;
  transition: background .3s;
}
.ind--ok { background: #3D9970; box-shadow: 0 0 0 3px rgba(61,153,112,.12); }
.ind--loading { background: var(--amber); animation: pulse 1.3s ease infinite; }
.ind--err { background: #C0392B; }
@keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: .25; } }
.toolbar__label { font-size: .875rem; font-weight: 500; color: var(--muted); }
.toolbar__label strong { color: var(--text); font-weight: 700; }

.toolbar__right { display: flex; align-items: center; gap: .6rem; }
.tsort { position: relative; }
.tsort__sel {
  padding: .5rem 2rem .5rem .9rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-s);
  background: var(--surface);
  color: var(--text); font-size: .86rem; font-weight: 500;
  cursor: pointer; font-family: inherit; appearance: none;
  transition: border-color .2s, box-shadow .2s;
  min-width: 140px;
}
.tsort__sel:hover, .tsort__sel:focus { border-color: var(--crimson); outline: none; box-shadow: 0 0 0 3px rgba(124,28,28,.06); }
.tsort__ico { position: absolute; left: .65rem; top: 50%; transform: translateY(-50%); pointer-events: none; color: var(--faint); }
.treset {
  width: 36px; height: 36px;
  display: flex; align-items: center; justify-content: center;
  background: var(--surface); border: 1px solid var(--border);
  border-radius: var(--radius-s); cursor: pointer; color: var(--muted);
  transition: all .3s var(--ease-spring);
}
.treset:hover { border-color: var(--crimson); color: var(--crimson); transform: rotate(220deg); }

/* Skeleton */
.skel { background: var(--card-bg); border-radius: var(--radius-l); border: 1px solid var(--border); overflow: hidden; animation: skelrise .5s var(--ease) var(--d) both; }
@keyframes skelrise { from { opacity: 0; } to { opacity: 1; } }
.skel__thumb { width: 100%; height: 240px; }
.skel__body { padding: 1.5rem; display: flex; flex-direction: column; gap: .7rem; }
.skel__line { height: 12px; border-radius: 6px; }
.skel__pills { display: flex; gap: .5rem; margin-top: .35rem; }
.skel__pill { width: 60px; height: 22px; border-radius: var(--radius-full); }
.shimmer { background: var(--surface); position: relative; overflow: hidden; }
.shimmer::after {
  content: ''; position: absolute; inset: 0;
  background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,.7) 50%, transparent 100%);
  animation: shim 1.7s ease-in-out infinite;
}
@keyframes shim { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }

/* Empty */
.empty {
  text-align: center; padding: 6rem 2rem;
  background: var(--card-bg); border-radius: var(--radius-xl);
  border: 1px solid var(--border); color: var(--muted);
}
.empty__icon { font-size: 4rem; margin-bottom: 1.5rem; opacity: .5; }
.empty__title { font-family: 'Cormorant Garamond', serif; font-size: 1.6rem; font-weight: 500; color: var(--text); margin-bottom: .5rem; }
.empty__hint { font-size: .93rem; color: var(--muted); margin-bottom: 2rem; }

/* ── GRID ── */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 1.75rem;
}

/* ── CARD ── */
.card {
  background: var(--card-bg);
  border-radius: var(--radius-xl);
  border: 1px solid var(--border);
  overflow: hidden;
  cursor: pointer;
  display: flex; flex-direction: column;
  animation: cardrise .55s var(--ease) var(--d) both;
  transition: transform .45s var(--ease), box-shadow .45s var(--ease), border-color .3s;
  will-change: transform;
  position: relative;
}
@keyframes cardrise {
  from { opacity: 0; transform: translateY(32px) scale(.98); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
.card::before {
  content: '';
  position: absolute; inset: 0;
  border-radius: inherit;
  background: linear-gradient(135deg, rgba(196,154,60,.04) 0%, transparent 60%);
  opacity: 0;
  transition: opacity .4s;
  pointer-events: none;
  z-index: 1;
}
.card:hover {
  transform: translateY(-10px) scale(1.008);
  box-shadow: var(--shadow-l), 0 0 0 1px rgba(196,154,60,.15);
  border-color: rgba(124,28,28,.15);
}
.card:hover::before { opacity: 1; }
.card:focus-visible { outline: 2px solid var(--crimson); outline-offset: 3px; }

.card__thumb {
  position: relative; overflow: hidden;
  height: 255px; background: var(--charcoal);
  flex-shrink: 0;
}
.card__img {
  width: 100%; height: 100%;
  object-fit: cover;
  transition: transform .7s var(--ease), filter .5s;
  filter: saturate(.95);
}
.card:hover .card__img { transform: scale(1.1); filter: saturate(1.05); }

.card__film {
  position: absolute; inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
  pointer-events: none; mix-blend-mode: overlay;
}
.card__scrim {
  position: absolute; inset: 0;
  background: linear-gradient(180deg, transparent 40%, rgba(12,11,9,.75) 100%);
  opacity: .6;
  transition: opacity .4s;
}
.card:hover .card__scrim { opacity: .85; }

.card__view {
  position: absolute; inset: 0;
  display: flex; align-items: center; justify-content: center;
  opacity: 0; transition: opacity .35s;
}
.card:hover .card__view { opacity: 1; }
.card__viewbtn {
  padding: .65rem 1.6rem;
  background: rgba(255,255,255,.12);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255,255,255,.22);
  border-radius: var(--radius-full);
  color: #fff; font-size: .84rem; font-weight: 600;
  letter-spacing: .04em;
  transform: translateY(10px) scale(.95);
  transition: transform .35s var(--ease-spring);
}
.card:hover .card__viewbtn { transform: translateY(0) scale(1); }

.card__badges {
  position: absolute; top: 1rem; right: 1rem; left: 1rem;
  display: flex; justify-content: space-between; align-items: flex-start;
  gap: .5rem;
}
.card__typebadge {
  background: rgba(255,255,255,.92);
  backdrop-filter: blur(12px);
  padding: .28rem .75rem;
  border-radius: var(--radius-full);
  font-size: .72rem; font-weight: 700;
  color: var(--crimson);
  box-shadow: var(--shadow-xs);
}
.card__statusbadge {
  padding: .26rem .65rem;
  border-radius: var(--radius-full);
  font-size: .69rem; font-weight: 700;
  background: rgba(196,152,60,.85); color: var(--void);
  backdrop-filter: blur(8px);
}
.card__statusbadge--done { background: rgba(45,160,100,.85); color: #fff; }
.card__count {
  position: absolute; bottom: .9rem; left: .9rem;
  display: flex; align-items: center; gap: .3rem;
  background: rgba(0,0,0,.55); backdrop-filter: blur(10px);
  color: rgba(255,255,255,.9); padding: .26rem .65rem; border-radius: var(--radius-full);
  font-size: .7rem; font-weight: 700;
}

.card__body { padding: 1.6rem 1.6rem 1.3rem; flex: 1; display: flex; flex-direction: column; gap: .65rem; position: relative; z-index: 2; }
.card__meta { display: flex; align-items: center; gap: .55rem; flex-wrap: wrap; }
.card__date {
  font-size: .78rem; font-weight: 600;
  color: var(--crimson);
  font-variant-numeric: tabular-nums;
}
.card__lang {
  font-size: .68rem; font-weight: 600; color: var(--muted);
  background: var(--surface); border: 1px solid var(--border);
  padding: .12rem .5rem; border-radius: var(--radius-full);
}
.card__title {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 1.35rem; font-weight: 600;
  color: var(--text); line-height: 1.38;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
  transition: color .25s;
}
.card:hover .card__title { color: var(--crimson); }
.card__desc {
  font-size: .875rem; color: var(--muted); line-height: 1.72;
  display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
  flex: 1;
}
.card__tags { display: flex; flex-wrap: wrap; gap: .3rem; }
.ctag {
  padding: .22rem .65rem;
  background: rgba(124,28,28,.05);
  border: 1px solid rgba(124,28,28,.12);
  border-radius: var(--radius-full);
  font-size: .74rem; font-weight: 600; color: var(--crimson);
  cursor: pointer; font-family: inherit;
  transition: all .2s var(--ease-spring);
}
.ctag:hover { background: var(--crimson); color: #fff; border-color: var(--crimson); transform: scale(1.06) translateY(-1px); }
.ctag--more { background: var(--surface); color: var(--faint); border-color: var(--border); cursor: default; }
.ctag--more:hover { background: var(--surface); color: var(--faint); transform: none; }

.card__foot {
  display: flex; align-items: center; justify-content: space-between;
  padding: .95rem 1.6rem;
  border-top: 1px solid var(--border);
  transition: background .25s;
  position: relative; z-index: 2;
}
.card:hover .card__foot { background: var(--surface); }
.card__cta { font-size: .84rem; font-weight: 600; color: var(--crimson); letter-spacing: .01em; }
.card__arrow { font-size: 1rem; color: var(--amber); transition: transform .28s var(--ease); }
.card:hover .card__arrow { transform: translateX(-6px); }

/* ── PAGINATION ── */
.pager {
  display: flex; justify-content: center; align-items: center; gap: 2rem;
  margin-top: 5rem; padding: 1.4rem 2rem;
  background: var(--card-bg); border-radius: var(--radius-l);
  border: 1px solid var(--border); box-shadow: var(--shadow-xs);
}
.pager__btn {
  padding: .6rem 1.25rem;
  background: var(--crimson); color: #fff;
  border: none; border-radius: var(--radius-s);
  font-size: .86rem; font-weight: 600;
  cursor: pointer; font-family: inherit;
  transition: all .25s var(--ease-spring);
}
.pager__btn:hover:not(:disabled) { background: var(--crimson-deep); transform: translateY(-2px); box-shadow: var(--shadow-crimson); }
.pager__btn:disabled { opacity: .3; cursor: not-allowed; }
.pager__dots { display: flex; gap: .45rem; align-items: center; }
.pager__dot {
  width: 7px; height: 7px; border-radius: 50%;
  background: var(--border); cursor: pointer;
  transition: all .25s var(--ease-spring);
}
.pager__dot--on { background: var(--crimson); transform: scale(1.5); }
.pager__dot:hover:not(.pager__dot--on) { background: var(--crimson-mid); transform: scale(1.25); }

/* ════════════════════════════════════════════════
   DETAIL VIEW
════════════════════════════════════════════════ */
.dnav {
  position: sticky; top: 0; z-index: 50;
  background: rgba(247,244,239,.95);
  backdrop-filter: blur(24px) saturate(1.5);
  border-bottom: 1px solid var(--border);
  box-shadow: 0 1px 14px rgba(0,0,0,.06);
}
.dnav__inner {
  display: flex; align-items: center; justify-content: space-between;
  padding-top: .85rem; padding-bottom: .85rem; gap: 1rem; flex-wrap: wrap;
}
.back-btn {
  display: inline-flex; align-items: center; gap: .5rem;
  background: none; border: none; color: var(--crimson);
  font-size: .9rem; font-weight: 600; cursor: pointer; font-family: inherit;
  padding: .4rem .7rem; border-radius: var(--radius-s);
  transition: gap .25s var(--ease), background .2s;
}
.back-btn:hover { background: rgba(124,28,28,.06); gap: .8rem; }

.dnav__langinfo {
  display: flex; align-items: center; gap: .5rem; flex-wrap: wrap;
}
.dnav__langhelp {
  font-size: .68rem; color: var(--faint); font-style: italic;
  display: none;
}
@media (min-width: 900px) { .dnav__langhelp { display: block; } }

.langpill {
  display: inline-flex; align-items: center; gap: .35rem;
  padding: .3rem .75rem;
  border-radius: var(--radius-full);
  font-size: .76rem; font-weight: 600;
  border: 1.5px solid transparent;
  transition: all .25s var(--ease);
  cursor: default;
}
.langpill--active {
  background: rgba(124,28,28,.07);
  border-color: rgba(124,28,28,.18);
  color: var(--crimson);
}
.langpill--inactive {
  background: var(--surface);
  border-color: var(--border);
  color: var(--faint);
  opacity: .65;
}
.langpill__dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
.langpill__dot--ckb { background: #B8960A; }
.langpill__dot--kmr { background: #2855B8; }
.langpill__name { white-space: nowrap; }
.langpill__check { flex-shrink: 0; }

.lang-swap-enter-active { transition: opacity .28s var(--ease), transform .28s var(--ease); }
.lang-swap-leave-active { transition: opacity .18s ease, transform .18s ease; }
.lang-swap-enter-from  { opacity: 0; transform: translateY(10px); }
.lang-swap-leave-to    { opacity: 0; transform: translateY(-6px); }

/* Detail Hero */
.dhero {
  position: relative; min-height: 58vh;
  display: flex; align-items: flex-end; overflow: hidden;
  background: var(--ink);
}
.dhero__bg {
  position: absolute; inset: 0;
  background-size: cover; background-position: center;
  filter: brightness(.26) saturate(1.25) sepia(.2);
  transition: filter 1s;
}
.dhero__gradient {
  position: absolute; inset: 0;
  background: linear-gradient(180deg, rgba(0,0,0,.1) 0%, rgba(12,11,9,.85) 100%);
}
.dhero__grain {
  position: absolute; inset: 0; opacity: .06;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E");
  pointer-events: none; mix-blend-mode: overlay;
}
.dhero__frame {
  position: absolute; width: 44px; height: 44px;
  z-index: 5; pointer-events: none; opacity: .3;
}
.dhero__frame--tl { top: 2rem; right: 2rem; border-top: 1px solid var(--amber); border-right: 1px solid var(--amber); }
.dhero__frame--br { bottom: 2rem; left: 2rem; border-bottom: 1px solid var(--amber); border-left: 1px solid var(--amber); }

.dhero__content {
  position: relative; z-index: 10;
  padding: 5.5rem 0 3.5rem;
}
.dhero__inner {
  animation: fadein .7s var(--ease) .05s both;
}
.dhero__badges { display: flex; flex-wrap: wrap; gap: .4rem; margin-bottom: 1.4rem; }
.dbadge {
  display: inline-flex; align-items: center; gap: .32rem;
  padding: .28rem .75rem;
  border-radius: var(--radius-full);
  font-size: .77rem; font-weight: 600;
  background: rgba(255,255,255,.07);
  backdrop-filter: blur(12px);
  color: rgba(255,255,255,.78);
  border: 1px solid rgba(255,255,255,.1);
}
.dbadge--type { background: var(--crimson); color: #fff; border-color: transparent; }
.dbadge--done { background: rgba(45,160,100,.15); border-color: rgba(45,160,100,.22); color: #88d9b5; }
.dbadge--ongoing { background: rgba(196,154,60,.15); border-color: rgba(196,154,60,.22); color: #e8c97a; }
.dhero__title {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(2.2rem, 5vw, 3.5rem);
  font-weight: 500; font-style: italic;
  color: #fff; line-height: 1.2;
  margin-bottom: 1.1rem; max-width: 800px;
  letter-spacing: -.01em;
}
.dhero__desc {
  font-size: 1.05rem; color: rgba(255,255,255,.65);
  line-height: 1.85; max-width: 680px; margin-bottom: 1.75rem;
}
.dhero__tags { display: flex; flex-wrap: wrap; gap: .4rem; }
.dtag {
  padding: .4rem .95rem;
  background: rgba(255,255,255,.06); backdrop-filter: blur(10px);
  color: rgba(255,255,255,.78); border: 1px solid rgba(255,255,255,.1);
  border-radius: var(--radius-s); font-size: .84rem; font-weight: 500;
  cursor: pointer; font-family: inherit; transition: all .2s var(--ease);
}
.dtag:hover { background: var(--crimson); border-color: var(--crimson); color: #fff; transform: translateY(-1px); }

/* ════════════════════════════════════════════════
   GALLERY
════════════════════════════════════════════════ */
.gallery {
  padding: 3.5rem 0;
  background: var(--card-bg);
  border-bottom: 1px solid var(--border);
}

.gtabs {
  display: flex; flex-wrap: wrap; gap: .4rem;
  margin-bottom: 2rem; padding-bottom: 2rem;
  border-bottom: 1px solid var(--border);
}
.gtab {
  display: inline-flex; align-items: center; gap: .4rem;
  padding: .5rem 1.1rem;
  border: 1px solid var(--border); border-radius: var(--radius-full);
  font-size: .84rem; font-weight: 500; color: var(--muted);
  background: none; cursor: pointer; font-family: inherit;
  transition: all .22s var(--ease);
}
.gtab:hover { border-color: var(--crimson); color: var(--crimson); background: rgba(124,28,28,.04); }
.gtab--on { background: var(--crimson); border-color: var(--crimson); color: #fff; }
.gtab__n {
  padding: .1rem .44rem; border-radius: var(--radius-full);
  font-size: .7rem; background: rgba(0,0,0,.1);
}
.gtab--on .gtab__n { background: rgba(255,255,255,.2); }

.stage { display: flex; flex-direction: column; gap: 1.4rem; }

.preview {
  background: var(--surface); border-radius: var(--radius-xl);
  border: 1px solid var(--border); overflow: hidden;
  position: relative; min-height: 540px;
  display: flex; align-items: center; justify-content: center; flex-direction: column;
}
.preview--image { cursor: default; }
.imgstage {
  position: relative; width: 100%; height: 540px;
  display: flex; align-items: center; justify-content: center;
  overflow: hidden; cursor: zoom-in;
  background: #1a1916;
}
.imgstage__img {
  max-width: 100%; max-height: 530px; object-fit: contain;
  transition: transform .4s ease;
}
.imgstage__hint {
  position: absolute; top: 1.2rem; left: 1.2rem;
  display: flex; align-items: center; gap: .4rem;
  background: rgba(0,0,0,.55); backdrop-filter: blur(12px);
  color: #fff; padding: .38rem .8rem;
  border-radius: var(--radius-full); font-size: .75rem; font-weight: 600;
  opacity: 0; transition: opacity .3s; pointer-events: none;
}
.imgstage:hover .imgstage__hint { opacity: 1; }

.zoombar {
  display: flex; align-items: center; justify-content: center; gap: .5rem;
  padding: .85rem 1.2rem;
  background: var(--card-bg); border-top: 1px solid var(--border); width: 100%; box-sizing: border-box;
}
.zbtn {
  width: 32px; height: 32px;
  display: flex; align-items: center; justify-content: center;
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 50%; font-size: .95rem; font-weight: 700;
  cursor: pointer; color: var(--text);
  transition: all .2s var(--ease-spring);
}
.zbtn:hover:not(:disabled) { border-color: var(--crimson); color: var(--crimson); transform: scale(1.12); }
.zbtn:disabled { opacity: .3; cursor: not-allowed; }
.zbtn__val { font-size: .8rem; font-weight: 600; color: var(--muted); min-width: 42px; text-align: center; }

/* Video */
.preview--video { padding: 0; }
.vidwrap { position: relative; width: 100%; height: 540px; background: #000; display: flex; align-items: center; }
.vid { width: 100%; height: 540px; object-fit: contain; cursor: pointer; display: block; }
.vcontrols {
  position: absolute; bottom: 0; left: 0; right: 0;
  background: linear-gradient(to top, rgba(0,0,0,.9) 0%, transparent 100%);
  padding: 2.5rem 1.5rem 1.25rem;
  opacity: 0; transition: opacity .3s;
}
.vidwrap:hover .vcontrols { opacity: 1; }
.vprog { width: 100%; height: 22px; display: flex; align-items: center; cursor: pointer; margin-bottom: .85rem; }
.vprog__bg { position: relative; width: 100%; height: 3px; background: rgba(255,255,255,.2); border-radius: 10px; transition: height .15s; }
.vprog:hover .vprog__bg { height: 5px; }
.vprog__fill { position: absolute; top: 0; left: 0; height: 100%; background: var(--crimson-mid); border-radius: 10px; }
.vprog__thumb { position: absolute; top: 50%; transform: translate(-50%,-50%); width: 12px; height: 12px; background: #fff; border-radius: 50%; opacity: 0; transition: opacity .2s; }
.vprog:hover .vprog__thumb { opacity: 1; }
.vcontrols__row { display: flex; justify-content: space-between; align-items: center; }
.vcontrols__left { display: flex; align-items: center; gap: .7rem; }
.vbtn {
  background: rgba(255,255,255,.1); backdrop-filter: blur(8px);
  border: none; color: #fff;
  width: 36px; height: 36px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; font-size: .9rem;
  transition: all .2s var(--ease-spring);
}
.vbtn:hover { background: rgba(255,255,255,.2); transform: scale(1.1); }
.vbtn--play { width: 44px; height: 44px; font-size: 1.05rem; background: var(--crimson); }
.vbtn--play:hover { background: var(--crimson-deep); box-shadow: var(--shadow-crimson); }
.vbtn--sm { width: 32px; height: 32px; font-size: .85rem; }
.vtime { font-size: .82rem; color: rgba(255,255,255,.8); font-weight: 500; font-variant-numeric: tabular-nums; }
.volrow { display: flex; align-items: center; gap: .4rem; }
.volvol {
  width: 68px; height: 3px; border-radius: 10px;
  background: rgba(255,255,255,.22); outline: none;
  cursor: pointer; -webkit-appearance: none;
}
.volvol::-webkit-slider-thumb { -webkit-appearance: none; width: 12px; height: 12px; border-radius: 50%; background: #fff; cursor: pointer; }
.volvol--warm::-webkit-slider-thumb { background: var(--amber-light); }

/* Audio */
.preview--audio { background: var(--surface); }
.audstage {
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; gap: 1.75rem; padding: 3rem 2rem;
  height: 540px; text-align: center; box-sizing: border-box;
}
.audart {
  position: relative; width: 180px; height: 180px;
  border-radius: var(--radius-xl); overflow: visible;
  box-shadow: var(--shadow-xl);
}
.audart img { width: 100%; height: 100%; object-fit: cover; border-radius: inherit; }
.audart__vinyl {
  position: absolute; inset: 0;
  border-radius: inherit;
  background: radial-gradient(circle at 50% 50%, rgba(0,0,0,.55) 20%, transparent 60%);
  pointer-events: none;
}
.audart--playing { animation: vinylspin 4s linear infinite; }
@keyframes vinylspin { to { transform: rotate(360deg); } }
.audart__rings { position: absolute; inset: -10px; pointer-events: none; }
.audart__ring {
  position: absolute; inset: 0; border-radius: inherit;
  border: 1.5px solid var(--crimson);
  opacity: 0;
}
.audart--playing .audart__ring { animation: audring 2.4s ease-out calc(var(--n) * .55s) infinite; }
@keyframes audring { 0% { transform: scale(1); opacity: .45; } 100% { transform: scale(1.55); opacity: 0; } }

.audinfo__title { font-family: 'Cormorant Garamond', serif; font-size: 1.3rem; font-weight: 600; color: var(--text); margin-bottom: .35rem; }
.audinfo__body { font-size: .87rem; color: var(--muted); max-width: 380px; }
.audcontrols {
  width: 100%; max-width: 460px;
  background: var(--card-bg); border-radius: var(--radius-l);
  padding: 1.2rem 1.5rem; border: 1px solid var(--border); box-shadow: var(--shadow-s);
}
.audprog { width: 100%; height: 22px; display: flex; align-items: center; cursor: pointer; margin-bottom: .85rem; }
.audprog__track { position: relative; width: 100%; height: 3px; background: var(--border); border-radius: 10px; transition: height .15s; }
.audprog:hover .audprog__track { height: 5px; }
.audprog__fill { position: absolute; top: 0; left: 0; height: 100%; background: linear-gradient(90deg, var(--crimson), var(--amber)); border-radius: 10px; }
.audcontrols__row { display: flex; align-items: center; gap: .7rem; }
.audbtn {
  background: var(--surface); border: 1px solid var(--border);
  color: var(--text); width: 36px; height: 36px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; font-size: .9rem; flex-shrink: 0;
  transition: all .2s var(--ease-spring);
}
.audbtn:hover { border-color: var(--crimson); color: var(--crimson); transform: scale(1.1); }
.audbtn--play { width: 46px; height: 46px; background: var(--crimson); border-color: var(--crimson); color: #fff; font-size: 1.1rem; }
.audbtn--play:hover { background: var(--crimson-deep); box-shadow: var(--shadow-crimson); }
.audbtn--sm { width: 30px; height: 30px; font-size: .82rem; }
.audtime { flex: 1; text-align: center; font-size: .85rem; font-weight: 500; color: var(--muted); font-variant-numeric: tabular-nums; }

/* Document */
.preview--doc { background: var(--surface); }
.docstage { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1.25rem; padding: 3rem; text-align: center; height: 540px; box-sizing: border-box; }
.docstage__ico { font-size: 5rem; opacity: .65; }
.docstage__name { font-family: 'Cormorant Garamond', serif; font-size: 1.3rem; font-weight: 600; color: var(--text); }
.docstage__url { font-size: .78rem; color: var(--faint); word-break: break-all; max-width: 340px; }

/* Caption */
.caption {
  background: var(--card-bg); border-radius: var(--radius-l);
  padding: 1.5rem 1.85rem; border: 1px solid var(--border);
  border-right: 3px solid var(--amber);
}
.caption__title { font-family: 'Cormorant Garamond', serif; font-size: 1.1rem; font-weight: 600; color: var(--text); margin-bottom: .45rem; }
.caption__text { font-size: .88rem; color: var(--muted); line-height: 1.78; }

/* Thumbnail Strip */
.strip {
  display: flex; gap: .4rem; overflow-x: auto; padding: .35rem 0;
  scrollbar-width: thin; scrollbar-color: var(--border) transparent;
}
.sthumb {
  display: flex; align-items: center; gap: .4rem;
  padding: .5rem .95rem;
  background: var(--surface); border: 1px solid var(--border);
  border-radius: var(--radius-s); cursor: pointer; font-family: inherit;
  font-size: .82rem; font-weight: 500; color: var(--muted);
  white-space: nowrap; flex-shrink: 0;
  transition: all .2s var(--ease);
}
.sthumb:hover { border-color: var(--crimson); color: var(--crimson); background: rgba(124,28,28,.04); }
.sthumb--on { background: var(--crimson); border-color: var(--crimson); color: #fff; }
.sthumb__ico { font-size: .95rem; }
.sthumb__lbl { max-width: 130px; overflow: hidden; text-overflow: ellipsis; }

.mnav { display: flex; justify-content: center; align-items: center; gap: 1.5rem; padding: 1rem 0; }
.mnav__btn {
  padding: .5rem 1.15rem; background: none;
  border: 1px solid var(--border); border-radius: var(--radius-s);
  font-size: .84rem; font-weight: 500; color: var(--muted);
  cursor: pointer; font-family: inherit; transition: all .22s;
}
.mnav__btn:hover:not(:disabled) { border-color: var(--crimson); color: var(--crimson); }
.mnav__btn:disabled { opacity: .28; cursor: not-allowed; }
.mnav__pos { font-size: .84rem; font-weight: 600; color: var(--faint); font-variant-numeric: tabular-nums; }

/* ── CHIPS ── */
.chips-section { padding: 2.5rem 0; background: var(--parchment); }
.chips-section--alt { background: var(--card-bg); }
.chips-block {
  max-width: 820px; margin: 0 auto;
  background: var(--card-bg); border-radius: var(--radius-l);
  padding: 2rem 2.5rem; border: 1px solid var(--border);
  box-shadow: var(--shadow-xs);
}
.chips-section--alt .chips-block { background: var(--surface); }
.chips-block__heading {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.1rem; font-weight: 600; color: var(--text); margin-bottom: 1rem;
}
.chips-row { display: flex; flex-wrap: wrap; gap: .45rem; }
.chip {
  padding: .38rem .9rem; border-radius: var(--radius-full);
  font-size: .82rem; font-weight: 500;
  transition: all .2s var(--ease-spring);
  cursor: default;
}
.chip:hover { transform: translateY(-2px); }
.chip--content { background: rgba(124,28,28,.06); color: var(--crimson); border: 1px solid rgba(124,28,28,.12); }
.chip--kw { background: rgba(40,80,180,.06); color: #2850B0; border: 1px solid rgba(40,80,180,.12); }

/* ── RELATED ── */
.related {
  padding: 5rem 0 7rem;
  background: var(--parchment);
  border-top: 1px solid var(--border);
  position: relative;
}
.related::before {
  content: '';
  display: block; position: absolute; top: 0; left: 50%; transform: translateX(-50%);
  width: 80px; height: 2px;
  background: linear-gradient(90deg, transparent, var(--amber), transparent);
  opacity: .6;
}
.related__head { margin-bottom: 3rem; }
.related__title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 2.1rem; font-weight: 500; font-style: italic;
  color: var(--text); margin-bottom: .85rem;
}
.related__rule { width: 44px; height: 2px; background: linear-gradient(90deg, var(--crimson), var(--amber)); border-radius: 2px; }
.related__grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(265px, 1fr)); gap: 1.5rem; }

.rcard {
  background: var(--card-bg); border: 1px solid var(--border);
  border-radius: var(--radius-l); overflow: hidden; cursor: pointer;
  transition: all .38s var(--ease); display: flex; flex-direction: column;
}
.rcard:hover { transform: translateY(-6px); box-shadow: var(--shadow-m); border-color: rgba(124,28,28,.15); }
.rcard:hover .rcard__title { color: var(--crimson); }
.rcard:hover .rcard__img img { transform: scale(1.09); }
.rcard:hover .rcard__overlay { opacity: 1; }
.rcard__img { position: relative; width: 100%; height: 185px; overflow: hidden; background: var(--charcoal); }
.rcard__img img { width: 100%; height: 100%; object-fit: cover; transition: transform .5s var(--ease); }
.rcard__overlay {
  position: absolute; inset: 0;
  background: linear-gradient(180deg, transparent 25%, rgba(12,11,9,.65) 100%);
  opacity: 0; transition: opacity .35s;
}
.rcard__body { padding: 1.2rem; flex: 1; display: flex; flex-direction: column; }
.rcard__meta { display: flex; align-items: center; justify-content: space-between; font-size: .73rem; color: var(--faint); font-weight: 500; margin-bottom: .6rem; gap: .5rem; }
.rcard__title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.12rem; font-weight: 600;
  color: var(--text); line-height: 1.38;
  margin-bottom: .5rem; transition: color .25s;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}
.rcard__desc { font-size: .84rem; color: var(--muted); line-height: 1.65; flex: 1; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
.rcard__tags { display: flex; flex-wrap: wrap; gap: .3rem; padding-top: .7rem; border-top: 1px solid var(--border); margin-top: .7rem; }
.rtag { font-size: .7rem; font-weight: 600; color: var(--amber); background: rgba(196,154,60,.08); padding: .14rem .5rem; border-radius: var(--radius-full); }

/* ── BUTTONS ── */
.btn-primary {
  display: inline-flex; align-items: center; gap: .5rem;
  padding: .75rem 1.65rem; border-radius: var(--radius-s);
  background: var(--crimson); color: #fff;
  font-size: .9rem; font-weight: 600; border: none;
  cursor: pointer; font-family: inherit;
  transition: all .25s var(--ease-spring);
  text-decoration: none;
  box-shadow: 0 4px 14px rgba(124,28,28,.3);
  letter-spacing: .01em;
}
.btn-primary:hover { background: var(--crimson-deep); transform: translateY(-2px); box-shadow: 0 8px 24px rgba(124,28,28,.4); }

/* ── FULLSCREEN ── */
.fs-enter-active { transition: opacity .4s; }
.fs-leave-active { transition: opacity .3s; }
.fs-enter-from, .fs-leave-to { opacity: 0; }
.fsoverlay {
  position: fixed; inset: 0;
  background: rgba(8,7,6,.97); backdrop-filter: blur(16px);
  z-index: 9999; display: flex; align-items: center; justify-content: center;
}
.fsoverlay__x {
  position: fixed; top: 2rem; right: 2rem;
  width: 46px; height: 46px;
  background: rgba(255,255,255,.07); backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,.12); border-radius: 50%;
  color: rgba(255,255,255,.8); font-size: 1.2rem; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  z-index: 10001; transition: all .28s var(--ease-spring);
}
.fsoverlay__x:hover { background: var(--crimson); border-color: var(--crimson); color: #fff; transform: rotate(90deg) scale(1.1); }
.fsoverlay__frame { max-width: 96vw; max-height: 96vh; display: flex; align-items: center; justify-content: center; }
.fsoverlay__img {
  max-width: 100%; max-height: 96vh; object-fit: contain;
  border-radius: var(--radius-s);
  box-shadow: 0 40px 100px rgba(0,0,0,.7);
}

/* ════════════════════════════════════════════════
   RESPONSIVE
════════════════════════════════════════════════ */
@media (max-width: 900px) {
  .container { padding: 0 1.5rem; }
  .hero { min-height: 85vh; }
  .hero__stats { max-width: 100%; padding: 1.5rem 2rem; }
  .hstat__inner { padding: 0 1.5rem; }
  .hstat__num { font-size: 2rem; }
}

@media (max-width: 768px) {
  .container { padding: 0 1.25rem; }
  .hero { min-height: 80vh; }
  .hero__stats { flex-direction: column; gap: 0; border: none; background: none; padding: 0; }
  .hstat { flex-direction: column; }
  .hstat__sep { display: none; }
  .hstat__inner { padding: .75rem 1rem; background: rgba(255,255,255,.04); border-radius: var(--radius-m); margin-bottom: .5rem; }
  .toolbar { flex-direction: column; align-items: stretch; }
  .toolbar__right { justify-content: space-between; }
  .grid { grid-template-columns: 1fr; }
  .preview, .imgstage, .vidwrap, .vid, .audstage, .docstage { height: 380px; min-height: 380px; }
  .imgstage__img { max-height: 370px; }
  .dhero { min-height: 48vh; }
  .dhero__content { padding: 4rem 0 2.5rem; }
  .related__grid { grid-template-columns: 1fr; }
  .chips-block { padding: 1.5rem; }
  .dnav__inner { flex-direction: column; align-items: flex-start; }
  .hero__quill { display: none; }
}

@media (max-width: 480px) {
  .headline__line--main { font-size: 3.2rem; }
  .hero__stats { display: none; }
  .stamp__ring { width: 72px; height: 72px; }
  .card__thumb { height: 210px; }
  .gtabs { gap: .25rem; }
  .gtab { padding: .42rem .8rem; font-size: .79rem; }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .01ms !important;
  }
}

*:focus-visible {
  outline: 2px solid var(--crimson);
  outline-offset: 3px;
  border-radius: var(--radius-xs);
}

/* ════════════════════════════════════════════════
   LANGUAGE-SENSITIVE LTR FIXES (KMR)
════════════════════════════════════════════════ */
.pubs--ltr {
  direction: ltr;
  text-align: left;
}

.pubs--ltr .tsort__sel {
  padding: .5rem .9rem .5rem 2rem;
}
.pubs--ltr .tsort__ico {
  right: .65rem;
  left: auto;
}

.pubs--ltr .card__count {
  right: .9rem;
  left: auto;
}
.pubs--ltr .imgstage__hint {
  right: 1.2rem;
  left: auto;
}

.pubs--ltr .card:hover .card__arrow {
  transform: translateX(6px);
}

.pubs--ltr .caption {
  border-right: 1px solid var(--border);
  border-left: 3px solid var(--amber);
}

.pubs--ltr .fsoverlay__x {
  left: 2rem;
  right: auto;
}

.pubs--ltr .hero__quill--l {
  left: 12%;
  right: auto;
}
.pubs--ltr .hero__quill--r {
  right: 12%;
  left: auto;
}

.pubs--ltr .dhero__frame--tl {
  left: 2rem;
  right: auto;
  border-right: 0;
  border-left: 1px solid var(--amber);
}
.pubs--ltr .dhero__frame--br {
  right: 2rem;
  left: auto;
  border-left: 0;
  border-right: 1px solid var(--amber);
}

.pubs--ltr .toolbar__label,
.pubs--ltr .card__meta,
.pubs--ltr .card__title,
.pubs--ltr .card__desc,
.pubs--ltr .caption__title,
.pubs--ltr .caption__text,
.pubs--ltr .dhero__title,
.pubs--ltr .dhero__desc,
.pubs--ltr .rcard__title,
.pubs--ltr .rcard__desc,
.pubs--ltr .empty,
.pubs--ltr .chips-block {
  text-align: left;
}

@media (max-width: 768px) {
  .pubs--ltr .dnav__inner {
    align-items: flex-start;
  }
}
</style>