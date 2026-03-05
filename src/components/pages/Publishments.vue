<template>
  <main class="pub" :dir="lang.dir" :class="{ 'pub--ltr': lang.isKMR }">
    <transition name="page" mode="out-in">

      <!-- ══════════════════════════════════════
           LISTING VIEW
      ══════════════════════════════════════ -->
      <div v-if="!activeItem" key="listing" class="listing">

        <!-- ── CINEMATIC HERO ── -->
        <header class="hero">
          <div class="hero__canvas">
            <div class="hero__slides">
              <div
                v-for="(slide, si) in heroSlides"
                :key="slide.url + si"
                class="hero__slide"
                :class="{
                  'hero__slide--active':  si === heroSlideIndex,
                  'hero__slide--prev':    si === heroPrevIndex,
                  'hero__slide--kb-a':    si % 2 === 0,
                  'hero__slide--kb-b':    si % 2 !== 0,
                }"
                :style="{ backgroundImage: `url(${slide.url})` }"
              ></div>
              <div
                v-if="!heroSlides.length"
                class="hero__slide hero__slide--active hero__slide--gradient"
                :class="`hero__slide--grad-${activeTab}`"
              ></div>
            </div>
            <div class="hero__dots" v-if="heroSlides.length > 1">
              <button
                v-for="(_, di) in heroSlides"
                :key="di"
                class="hero__dot"
                :class="{ 'hero__dot--on': di === heroSlideIndex }"
                @click.stop="jumpSlide(di)"
              ></button>
            </div>

            <!-- Layered cinematic overlays -->
            <div class="hero__overlay hero__overlay--base"></div>
            <div class="hero__overlay hero__overlay--vignette"></div>
            <div class="hero__overlay hero__overlay--bottom"></div>
            <div class="hero__overlay hero__overlay--top"></div>
            <div class="hero__film"></div>
            <div class="hero__grain"></div>
            <div class="hero__scanlines"></div>

            <!-- Gold filigree lines -->
            <div class="hero__filigree hero__filigree--h1"></div>
            <div class="hero__filigree hero__filigree--h2"></div>
            <div class="hero__filigree hero__filigree--v1"></div>
            <div class="hero__filigree hero__filigree--v2"></div>

            <div class="hero__particles">
              <span v-for="i in 22" :key="i" class="hparticle" :style="particleStyle(i)"></span>
            </div>
            <div class="hero__corner hero__corner--tl"></div>
            <div class="hero__corner hero__corner--tr"></div>
            <div class="hero__corner hero__corner--bl"></div>
            <div class="hero__corner hero__corner--br"></div>
            <div class="hero__orb orb--a"></div>
            <div class="hero__orb orb--b"></div>
            <div class="hero__orb orb--c"></div>
            <div class="hero__orb orb--gold"></div>
          </div>

          <div class="hero__inner container">
            <div class="hero__eyebrow">
              <div class="hero__stamp">
                <div class="stamp__ring">
                  <div class="stamp__inner">
                    <span class="stamp__text">{{ lbl('archive') }}</span>
                    <span class="stamp__year">{{ currentYear }}</span>
                  </div>
                </div>
              </div>
              <div class="hero__kicker">
                <span class="kicker__rule"></span>
                <span class="kicker__diamond">◆</span>
                <span class="kicker__text">{{ lbl('heroDeco') }}</span>
                <span class="kicker__diamond">◆</span>
                <span class="kicker__rule"></span>
              </div>
            </div>
            <h1 class="hero__headline">
              <span class="headline__line headline__line--main">{{ lbl('heroMain') }}</span>
              <span class="headline__line headline__line--sub">
                <span class="headline__word" v-for="(word, wi) in lbl('heroSub').split(' · ')" :key="wi">
                  <span class="headline__word-text">{{ word }}</span>
                  <span class="headline__separator" v-if="wi < lbl('heroSub').split(' · ').length - 1"> · </span>
                </span>
              </span>
            </h1>
            <div class="hero__divider">
              <span class="hdiv__line"></span>
              <span class="hdiv__ornament">✦</span>
              <span class="hdiv__line"></span>
            </div>
            <div class="hero__stats">
              <div class="hstat" v-for="(s, i) in heroStats" :key="i" :style="{ '--i': i }">
                <div class="hstat__inner">
                  <div class="hstat__num">
                    <span class="hstat__num-val">{{ s.value }}</span>
                  </div>
                  <div class="hstat__lbl">{{ s.label }}</div>
                </div>
                <div class="hstat__sep" v-if="i < heroStats.length - 1"></div>
              </div>
            </div>
          </div>
          <button class="hero__scroll" @click="scrollToContent">
            <span class="scroll__label">{{ lbl('explore') }}</span>
            <div class="scroll__arrow">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
                <path d="M12 5v14M5 12l7 7 7-7"/>
              </svg>
            </div>
          </button>
        </header>

        <!-- ── TAB NAVIGATION ── -->
        <nav class="tabnav" ref="tabNavRef">
          <div class="container">
            <div class="tabnav__row">
              <div
                v-for="tab in tabDefs"
                :key="tab.key"
                class="tabnav__item"
                :class="{ 'tabnav__item--on': activeTab === tab.key }"
                @mouseenter="openDropdownKey = tab.key"
                @mouseleave="openDropdownKey = null"
                @click="switchTab(tab.key)"
              >
                <button class="tabtn" :class="{ 'tabtn--on': activeTab === tab.key }">
                  <span class="tabtn__ico">
                    <svg v-if="tab.key === 'image'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                      <circle cx="12" cy="13" r="4"/>
                    </svg>
                    <svg v-else-if="tab.key === 'sound'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M3 18v-6a9 9 0 0 1 18 0v6"/>
                      <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>
                    </svg>
                    <svg v-else-if="tab.key === 'video'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                      <polygon points="23 7 16 12 23 17 23 7"/>
                      <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
                    </svg>
                    <svg v-else-if="tab.key === 'writing'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"/>
                      <line x1="16" y1="8" x2="2" y2="22"/>
                      <line x1="17.5" y1="15" x2="9" y2="15"/>
                    </svg>
                    <svg v-else-if="tab.key === 'memories'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3.332.88-4.5 2-1.168-1.12-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                    </svg>
                  </span>
                  <span class="tabtn__lbl">{{ tab.label }}</span>
                  <svg class="tabtn__chevron" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                  <span class="tabtn__count" v-if="tabCount(tab.key) > 0">{{ tabCount(tab.key) }}</span>
                </button>

                <transition name="drop">
                  <div
                    v-if="openDropdownKey === tab.key"
                    class="tabdrop"
                    :class="{ 'tabdrop--memories': tab.key === 'memories' }"
                    @mouseenter="cancelDropClose"
                    @mouseleave="openDropdownKey = null"
                  >
                    <div class="tabdrop__inner">
                      <template v-if="tab.key !== 'memories'">
                        <div class="tabdrop__header">
                          <span class="tabdrop__header-ico">{{ tab.icon }}</span>
                          <span class="tabdrop__header-lbl">{{ tab.label }}</span>
                        </div>
                        <div class="tabdrop__divider"></div>
                        <button
                          class="tabdrop__item"
                          :class="{ 'tabdrop__item--on': !activeTopicFilter }"
                          @click.stop="setTopicFilter(null)"
                        >
                          <span class="tabdrop__item-ico">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                          </span>
                          <span class="tabdrop__item-name">{{ lbl('allTopics') }}</span>
                          <span class="tabdrop__item-count">{{ tabCount(tab.key) }}</span>
                        </button>
                        <div class="tabdrop__topics-list">
                          <button
                            v-for="topic in getTopicsFor(tab.key)"
                            :key="topic.id"
                            class="tabdrop__item"
                            :class="{ 'tabdrop__item--on': activeTopicFilter === topic.id }"
                            @click.stop="setTopicFilter(topic.id)"
                          >
                            <span class="tabdrop__item-ico">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
                            </span>
                            <span class="tabdrop__item-name">{{ topicName(topic) }}</span>
                          </button>
                          <div v-if="!getTopicsFor(tab.key).length" class="tabdrop__empty">
                            <span>{{ lbl('noTopics') }}</span>
                          </div>
                        </div>
                      </template>
                      <template v-else>
                        <div class="tabdrop__header">
                          <span class="tabdrop__header-ico">💫</span>
                          <span class="tabdrop__header-lbl">{{ lbl('memories') }}</span>
                        </div>
                        <div class="tabdrop__divider"></div>
                        <div v-if="memorySounds.length" class="tabdrop__mem-section">
                          <div class="tabdrop__mem-section-title">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="12" height="12"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>
                            {{ lbl('sound') }}
                            <span class="tabdrop__sec-count">{{ memorySounds.length }}</span>
                          </div>
                          <button
                            v-for="mem in memorySounds.slice(0, 6)"
                            :key="`ms-${mem.id}`"
                            class="tabdrop__item tabdrop__item--mem"
                            @click.stop="openMemoryFromDropdown(mem)"
                          >
                            <span class="tabdrop__mem-cover">
                              <img :src="pCover(mem)" @error="onImgError($event)" />
                              <span class="tabdrop__mem-play">▶</span>
                            </span>
                            <span class="tabdrop__item-name">{{ truncate(pTitle(mem), 30) }}</span>
                            <span class="tabdrop__mem-badge">💫</span>
                          </button>
                        </div>
                        <div v-if="memoryVideos.length" class="tabdrop__mem-section">
                          <div class="tabdrop__mem-section-title">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="12" height="12"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
                            {{ lbl('video') }}
                            <span class="tabdrop__sec-count">{{ memoryVideos.length }}</span>
                          </div>
                          <button
                            v-for="mem in memoryVideos.slice(0, 6)"
                            :key="`mv-${mem.id}`"
                            class="tabdrop__item tabdrop__item--mem"
                            @click.stop="openMemoryFromDropdown(mem)"
                          >
                            <span class="tabdrop__mem-cover">
                              <img :src="pCover(mem)" @error="onImgError($event)" />
                              <span class="tabdrop__mem-play">▶</span>
                            </span>
                            <span class="tabdrop__item-name">{{ truncate(pTitle(mem), 30) }}</span>
                            <span class="tabdrop__mem-badge">💫</span>
                          </button>
                        </div>
                        <div v-if="!memorySounds.length && !memoryVideos.length" class="tabdrop__empty">
                          <span>💫 {{ lbl('noMemories') }}</span>
                        </div>
                      </template>
                    </div>
                  </div>
                </transition>
              </div>
            </div>
          </div>
        </nav>

        <!-- ── BODY ── -->
        <section class="body" ref="gridSection">
          <div class="container">

            <transition name="pill">
              <div class="active-filter" v-if="activeTopicFilter">
                <div class="afilt">
                  <span class="afilt__dot"></span>
                  <span class="afilt__label">{{ activeTopicName }}</span>
                  <button class="afilt__x" @click="clearTopicFilter">✕</button>
                </div>
              </div>
            </transition>

            <div class="toolbar" v-if="!isLoading">
              <div class="toolbar__left">
                <span class="toolbar__indicator ind--ok"></span>
                <span class="toolbar__label">
                  <strong>{{ displayedItems.length }}</strong>&nbsp;{{ lbl('results') }}
                </span>
              </div>
              <div class="toolbar__right">
                <div class="tsort">
                  <select v-model="sortBy" class="tsort__sel">
                    <option value="newest">{{ lbl('sortNewest') }}</option>
                    <option value="oldest">{{ lbl('sortOldest') }}</option>
                    <option value="title">{{ lbl('sortTitle') }}</option>
                  </select>
                  <svg class="tsort__ico" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </div>
              </div>
            </div>

            <div v-if="isLoading" class="grid">
              <div v-for="i in 8" :key="`sk-${i}`" class="skel" :style="{ '--d': `${(i-1)*0.07}s` }">
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

            <div v-else-if="!paginatedItems.length" class="empty">
              <div class="empty__icon">{{ tabDefs.find(t => t.key === activeTab)?.icon || '📂' }}</div>
              <h3 class="empty__title">{{ lbl('noResults') }}</h3>
              <p class="empty__hint">{{ lbl('noResultsHint') }}</p>
              <button class="btn-primary" @click="clearTopicFilter">{{ lbl('resetFilter') }}</button>
            </div>

            <div v-else class="grid">
              <article
                v-for="(item, i) in paginatedItems"
                :key="`${item._mediaType}-${item.id}`"
                class="card"
                :class="[`card--${item._mediaType}`, { 'card--featured': i === 0 && clientPage === 0 }]"
                :style="{ '--d': `${i * 0.05}s` }"
                tabindex="0"
                @click="openItem(item)"
                @keyup.enter="openItem(item)"
              >
                <div class="card__thumb">
                  <img :src="pCover(item)" :alt="pTitle(item)" loading="lazy" class="card__img card__img--main" @error="onImgError($event)" />
                  <img v-if="pHoverCover(item)" :src="pHoverCover(item)" :alt="pTitle(item)" loading="lazy" class="card__img card__img--hover" @error="onImgError($event)" />
                  <div class="card__film"></div>
                  <div class="card__scrim"></div>
                  <div class="card__badges">
                    <div class="card__typebadge">{{ getTypeEmoji(item) }} {{ getTypeLabel(item) }}</div>
                    <div class="card__mediabadge" v-if="activeTab === 'memories'">{{ getMediaIcon(item._mediaType) }}</div>
                  </div>
                  <div class="card__countbadge" v-if="getCountBadge(item)">{{ getCountBadge(item) }}</div>
                  <div class="card__memorybadge" v-if="item.albumOfMemories">💫</div>
                  <div class="card__view">
                    <span class="card__viewbtn">
                      {{ lbl('viewItem') }}
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </span>
                  </div>
                  <div class="card__accent"></div>
                </div>
                <div class="card__body">
                  <div class="card__meta">
                    <span class="card__date" v-if="getItemDate(item)">{{ formatDate(getItemDate(item)) }}</span>
                    <span class="card__lang" v-for="l in (item.contentLanguages || [])" :key="l">{{ l }}</span>
                  </div>
                  <h3 class="card__title">{{ pTitle(item) }}</h3>
                  <p class="card__desc">{{ truncate(pDesc(item), 100) }}</p>
                  <div class="card__extra" v-if="getExtraLine(item)">
                    <span class="card__extra-val">{{ getExtraLine(item) }}</span>
                  </div>
                  <div class="card__tags" v-if="pTags(item).length">
                    <span v-for="tag in pTags(item).slice(0, 3)" :key="tag" class="ctag">#{{ tag }}</span>
                    <span v-if="pTags(item).length > 3" class="ctag ctag--more">+{{ pTags(item).length - 3 }}</span>
                  </div>
                </div>
                <div class="card__foot">
                  <span class="card__cta">{{ lbl('viewItem') }}</span>
                  <span class="card__arrow">{{ lang.isKMR ? '→' : '←' }}</span>
                </div>
              </article>
            </div>

            <nav class="pager" v-if="totalClientPages > 1 && !isLoading">
              <button class="pager__btn" :disabled="clientPage === 0" @click="goPrev">{{ lbl('prev') }}</button>
              <div class="pager__dots">
                <span
                  v-for="p in Math.min(totalClientPages, 7)"
                  :key="p"
                  class="pager__dot"
                  :class="{ 'pager__dot--on': clientPage === p - 1 }"
                  @click="clientPage = p - 1; scrollToContent()"
                ></span>
              </div>
              <button class="pager__btn" :disabled="clientPage + 1 >= totalClientPages" @click="goNext">{{ lbl('next') }}</button>
            </nav>
          </div>
        </section>
      </div>

      <!-- ══════════════════════════════════════
           DETAIL VIEW
      ══════════════════════════════════════ -->
      <div v-else key="detail" class="detail">

        <nav class="dnav">
          <div class="container dnav__inner">
            <button class="back-btn" @click="closeItem">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
              <span>{{ lbl('back') }}</span>
            </button>
            <div class="dnav__right">
              <span class="dtype-pill">{{ getMediaIcon(activeItem._mediaType) }} {{ getMediaTypeLabel(activeItem._mediaType) }}</span>
              <div class="langpills" v-if="activeItem.contentLanguages?.length">
                <span v-for="l in activeItem.contentLanguages" :key="l" class="langpill" :class="{ 'langpill--on': lang.activeLang === l }">
                  <span class="langpill__dot" :class="`lpdot--${l.toLowerCase()}`"></span>
                  {{ l }}
                </span>
              </div>
            </div>
          </div>
        </nav>

        <header class="dhero">
          <div class="dhero__bg" :style="{ backgroundImage: `url(${pCover(activeItem)})` }"></div>
          <div class="dhero__gradient"></div>
          <div class="dhero__gradient dhero__gradient--side"></div>
          <div class="dhero__grain"></div>
          <div class="dhero__scanlines"></div>
          <div class="dhero__frame dhero__frame--tl"></div>
          <div class="dhero__frame dhero__frame--br"></div>
          <div class="dhero__gold-line dhero__gold-line--top"></div>
          <div class="dhero__gold-line dhero__gold-line--bottom"></div>

          <div class="container dhero__content">
            <transition name="lang-swap" mode="out-in">
              <div :key="lang.activeLang" class="dhero__left">
                <div class="dhero__badges">
                  <span class="dbadge dbadge--type">{{ getTypeEmoji(activeItem) }} {{ getTypeLabel(activeItem) }}</span>
                  <span class="dbadge" v-if="getItemDate(activeItem)">📅 {{ formatDate(getItemDate(activeItem)) }}</span>
                  <span class="dbadge dbadge--mem" v-if="activeItem.albumOfMemories">💫 {{ lbl('albumOfMemories') }}</span>
                  <span class="dbadge" v-if="activeItem.publishedByInstitute">🏛️ {{ lbl('institute') }}</span>
                </div>
                <h1 class="dhero__title">{{ pTitle(activeItem) }}</h1>
                <p class="dhero__desc" v-if="pDesc(activeItem)">{{ pDesc(activeItem) }}</p>
                <div class="dhero__stats">
                  <template v-if="activeItem._mediaType === 'sound'">
                    <div class="dstat" v-if="activeItem.files?.length"><span class="dstat__ico">🎵</span><span class="dstat__val">{{ activeItem.files.length }}</span><span class="dstat__lbl">{{ lbl('tracks') }}</span></div>
                    <div class="dstat" v-if="activeItem.soundType"><span class="dstat__ico">🎼</span><span class="dstat__val">{{ activeItem.soundType }}</span></div>
                    <div class="dstat" v-if="activeItem.director"><span class="dstat__ico">🎤</span><span class="dstat__val">{{ activeItem.director }}</span></div>
                    <div class="dstat" v-if="totalSoundDuration > 0"><span class="dstat__ico">⏱</span><span class="dstat__val">{{ formatTime(totalSoundDuration) }}</span></div>
                  </template>
                  <template v-else-if="activeItem._mediaType === 'video'">
                    <div class="dstat" v-if="activeItem.durationSeconds"><span class="dstat__ico">⏱</span><span class="dstat__val">{{ formatTime(activeItem.durationSeconds) }}</span></div>
                    <div class="dstat" v-if="pDirector(activeItem)"><span class="dstat__ico">🎬</span><span class="dstat__val">{{ pDirector(activeItem) }}</span></div>
                    <div class="dstat" v-if="pProducer(activeItem)"><span class="dstat__ico">🎞</span><span class="dstat__val">{{ pProducer(activeItem) }}</span></div>
                    <div class="dstat" v-if="activeItem.resolution"><span class="dstat__ico">📺</span><span class="dstat__val">{{ activeItem.resolution }}</span></div>
                  </template>
                  <template v-else-if="activeItem._mediaType === 'writing'">
                    <div class="dstat" v-if="pPageCount(activeItem)"><span class="dstat__ico">📄</span><span class="dstat__val">{{ pPageCount(activeItem) }}</span><span class="dstat__lbl">{{ lbl('pages') }}</span></div>
                    <div class="dstat" v-if="pWriter(activeItem)"><span class="dstat__ico">✍️</span><span class="dstat__val">{{ pWriter(activeItem) }}</span></div>
                    <div class="dstat" v-if="pGenre(activeItem)"><span class="dstat__ico">📚</span><span class="dstat__val">{{ pGenre(activeItem) }}</span></div>
                  </template>
                  <template v-else-if="activeItem._mediaType === 'image'">
                    <div class="dstat" v-if="activeItem.imageAlbum?.length"><span class="dstat__ico">🖼️</span><span class="dstat__val">{{ activeItem.imageAlbum.length }}</span><span class="dstat__lbl">{{ lbl('images') }}</span></div>
                    <div class="dstat" v-if="pLocation(activeItem)"><span class="dstat__ico">📍</span><span class="dstat__val">{{ pLocation(activeItem) }}</span></div>
                    <div class="dstat" v-if="pCollectedBy(activeItem)"><span class="dstat__ico">🏛️</span><span class="dstat__val">{{ pCollectedBy(activeItem) }}</span></div>
                  </template>
                </div>
                <div class="dhero__tags" v-if="pTags(activeItem).length">
                  <span v-for="tag in pTags(activeItem)" :key="tag" class="dtag">#{{ tag }}</span>
                </div>
              </div>
            </transition>
            <div class="dhero__right">
              <div class="mockup-sound" v-if="activeItem._mediaType === 'sound'">
                <div class="msound__case">
                  <div class="msound__spine"></div>
                  <div class="msound__front">
                    <img :src="pCover(activeItem)" :alt="pTitle(activeItem)" @error="onImgError($event)" />
                    <div class="msound__overlay"></div>
                  </div>
                </div>
                <div class="msound__disc">
                  <div class="msound__disc-ring"></div>
                  <div class="msound__disc-art"><img :src="pCover(activeItem)" :alt="pTitle(activeItem)" @error="onImgError($event)" /></div>
                  <div class="msound__disc-hole"></div>
                </div>
              </div>
              <div class="mockup-book" v-else-if="activeItem._mediaType === 'writing'">
                <div class="mbook__spine"></div>
                <div class="mbook__cover">
                  <img :src="pCover(activeItem)" :alt="pTitle(activeItem)" @error="onImgError($event)" />
                  <div class="mbook__sheen"></div>
                </div>
                <div class="mbook__pages"></div>
              </div>
              <div class="mockup-video" v-else-if="activeItem._mediaType === 'video'">
                <div class="mvideo__frame">
                  <img :src="pCover(activeItem)" :alt="pTitle(activeItem)" @error="onImgError($event)" />
                  <div class="mvideo__play-ico">▶</div>
                </div>
                <div class="mvideo__stand"></div>
              </div>
              <div class="mockup-image" v-else-if="activeItem._mediaType === 'image'">
                <div class="mimage__frame">
                  <div class="mimage__mat"></div>
                  <div class="mimage__photo"><img :src="pCover(activeItem)" :alt="pTitle(activeItem)" @error="onImgError($event)" /></div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <!-- ── SOUND: Track Stream ── -->
        <section class="stream-section" v-if="activeItem._mediaType === 'sound' && activeItem.files?.length">
          <div class="container">
            <div class="stream-layout">
              <div class="stream-main">
                <div class="stream-head">
                  <h3 class="section-heading">{{ lbl('yourStream') }}</h3>
                  <span class="stream-count">{{ activeItem.files.length }} {{ lbl('tracks') }}</span>
                </div>
                <div class="track-list">
                  <div
                    v-for="(file, i) in activeItem.files"
                    :key="file.id || i"
                    class="track"
                    :class="{ 'track--playing': currentTrackIdx === i && isAudioPlaying, 'track--selected': currentTrackIdx === i }"
                    @click="playTrack(file, i)"
                  >
                    <div class="track__num">{{ String(i + 1).padStart(2, '0') }}</div>
                    <div class="track__cover">
                      <img :src="pCover(activeItem)" :alt="`Track ${i + 1}`" @error="onImgError($event)" />
                      <div class="track__play-ico"><span>{{ currentTrackIdx === i && isAudioPlaying ? '⏸' : '▶' }}</span></div>
                    </div>
                    <div class="track__indicator">
                      <span v-for="b in 3" :key="b" class="track__bar" :class="{ 'track__bar--live': currentTrackIdx === i && isAudioPlaying }" :style="{ '--b': b }"></span>
                    </div>
                    <div class="track__info">
                      <div class="track__title">{{ file.readerName || `${lbl('track')} ${i + 1}` }}</div>
                      <div class="track__sub">{{ file.fileType || 'AUDIO' }}</div>
                    </div>
                    <div class="track__waves">
                      <div class="wave-wrap" :class="{ 'wave-wrap--live': currentTrackIdx === i && isAudioPlaying }">
                        <span v-for="(h, bi) in getWaveform(file.id || i)" :key="bi" class="wbar" :style="{ '--h': h, '--bi': bi }"></span>
                      </div>
                    </div>
                    <div class="track__right">
                      <span class="track__dur" v-if="file.durationSeconds">{{ formatTime(file.durationSeconds) }}</span>
                      <span class="track__size" v-if="file.sizeBytes > 0">{{ formatSize(file.sizeBytes) }}</span>
                    </div>
                  </div>
                </div>
                <div class="audio-bar" v-if="currentTrack">
                  <div class="audio-bar__cover">
                    <img :src="pCover(activeItem)" alt="playing" @error="onImgError($event)" />
                    <div class="audio-bar__vinyl" :class="{ 'audio-bar__vinyl--spin': isAudioPlaying }"></div>
                  </div>
                  <div class="audio-bar__info">
                    <div class="audio-bar__title">{{ currentTrack.readerName || `${lbl('track')} ${currentTrackIdx + 1}` }}</div>
                    <div class="audio-bar__album">{{ pTitle(activeItem) }}</div>
                  </div>
                  <div class="audio-bar__controls">
                    <button class="abtn" @click="prevTrack" :disabled="currentTrackIdx <= 0">⏮</button>
                    <button class="abtn abtn--play" @click="togglePlay">{{ isAudioPlaying ? '⏸' : '▶' }}</button>
                    <button class="abtn" @click="nextTrack" :disabled="currentTrackIdx >= activeItem.files.length - 1">⏭</button>
                  </div>
                  <div class="audio-bar__prog-wrap" @click="seekAudio">
                    <div class="audio-bar__prog-track">
                      <div class="audio-bar__prog-fill" :style="{ width: audioProgress + '%' }"></div>
                      <div class="audio-bar__prog-thumb" :style="{ left: audioProgress + '%' }"></div>
                    </div>
                  </div>
                  <div class="audio-bar__time">{{ formatTime(audioCurrentTime) }} / {{ formatTime(audioDuration) }}</div>
                  <audio ref="audioPlayer" @loadedmetadata="onAudioLoaded" @timeupdate="onAudioTimeUpdate" @play="isAudioPlaying = true" @pause="isAudioPlaying = false" @ended="onTrackEnded"></audio>
                </div>
              </div>
              <div class="stream-side">
                <div class="side-featured">
                  <h4 class="side-heading">{{ lbl('featured') }}</h4>
                  <div class="side-cover">
                    <img :src="pCover(activeItem)" :alt="pTitle(activeItem)" @error="onImgError($event)" />
                    <div class="side-cover__overlay"><div class="side-cover__title">{{ pTitle(activeItem) }}</div></div>
                  </div>
                  <div class="side-meta">
                    <div class="side-meta__row" v-if="activeItem.soundType"><span class="side-meta__key">{{ lbl('type') }}</span><span class="side-meta__val">{{ activeItem.soundType }}</span></div>
                    <div class="side-meta__row" v-if="activeItem.director"><span class="side-meta__key">{{ lbl('director') }}</span><span class="side-meta__val">{{ activeItem.director }}</span></div>
                    <div class="side-meta__row" v-for="loc in (activeItem.locations || []).slice(0, 2)" :key="loc"><span class="side-meta__key">📍</span><span class="side-meta__val">{{ loc }}</span></div>
                  </div>
                </div>
                <div class="side-keywords" v-if="pKeywords(activeItem).length">
                  <h4 class="side-heading">{{ lbl('keywords') }}</h4>
                  <div class="chips-row"><span v-for="kw in pKeywords(activeItem)" :key="kw" class="chip chip--kw">{{ kw }}</span></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- ── VIDEO ── -->
        <section class="video-section" v-if="activeItem._mediaType === 'video'">
          <div class="container">
            <template v-if="activeItem.videoType === 'FILM'">
              <div class="video-stage">
                <div class="vplayer-wrap" v-if="activeItem.sourceUrl">
                  <video ref="videoPlayerEl" class="vplayer-el" controls :poster="pCover(activeItem)">
                    <source :src="activeItem.sourceUrl" type="video/mp4" />
                  </video>
                </div>
                <div class="vembed-wrap" v-else-if="activeItem.sourceEmbedUrl">
                  <iframe :src="activeItem.sourceEmbedUrl" frameborder="0" allowfullscreen class="vembed"></iframe>
                </div>
                <div class="vno-source" v-else><div class="vno-source__icon">🎬</div><div class="vno-source__text">{{ lbl('noSource') }}</div></div>
                <div class="vfilm-info">
                  <div class="vfilm-chips">
                    <span v-if="activeItem.resolution" class="vchip">📺 {{ activeItem.resolution }}</span>
                    <span v-if="activeItem.fileFormat" class="vchip">🎞 {{ activeItem.fileFormat }}</span>
                    <span v-if="activeItem.durationSeconds" class="vchip">⏱ {{ formatTime(activeItem.durationSeconds) }}</span>
                    <span v-if="activeItem.fileSizeMb" class="vchip">💾 {{ activeItem.fileSizeMb?.toFixed(1) }}MB</span>
                  </div>
                </div>
              </div>
            </template>
            <template v-else-if="activeItem.videoType === 'VIDEO_CLIP'">
              <div class="clips-layout">
                <div class="clips-player" v-if="selectedClip">
                  <div class="vplayer-wrap" v-if="selectedClip.url"><video class="vplayer-el" controls :poster="pCover(activeItem)"><source :src="selectedClip.url" type="video/mp4" /></video></div>
                  <div class="vembed-wrap" v-else-if="selectedClip.embedUrl"><iframe :src="selectedClip.embedUrl" frameborder="0" allowfullscreen class="vembed"></iframe></div>
                  <div class="clip-desc" v-if="lang.activeLang === 'CKB' ? selectedClip.descriptionCkb : selectedClip.descriptionKmr"><p>{{ lang.activeLang === 'CKB' ? selectedClip.descriptionCkb : selectedClip.descriptionKmr }}</p></div>
                </div>
                <div class="clips-list">
                  <h4 class="clips-list__heading">{{ lbl('clips') }} ({{ activeItem.videoClipItems?.length }})</h4>
                  <div v-for="clip in activeItem.videoClipItems" :key="clip.id" class="clip-item" :class="{ 'clip-item--on': selectedClip?.id === clip.id }" @click="selectedClip = clip">
                    <div class="clip-item__num">{{ clip.clipNumber }}</div>
                    <div class="clip-item__info">
                      <div class="clip-item__title">{{ lang.activeLang === 'CKB' ? (clip.titleCkb || clip.titleKmr) : (clip.titleKmr || clip.titleCkb) || `Clip ${clip.clipNumber}` }}</div>
                      <div class="clip-item__meta"><span v-if="clip.durationSeconds">⏱ {{ formatTime(clip.durationSeconds) }}</span><span v-if="clip.resolution">{{ clip.resolution }}</span></div>
                    </div>
                    <svg class="clip-item__play" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </section>

        <!-- ── IMAGE ── -->
        <section class="gallery-section" v-if="activeItem._mediaType === 'image'">
          <div class="container">
            <div class="gallery-layout" v-if="activeItem.imageAlbum?.length">
              <div class="gallery-main">
                <div class="gallery-preview" v-if="selectedImage">
                  <img :src="selectedImage.imageUrl || selectedImage.externalUrl || selectedImage.embedUrl" :alt="lang.activeLang === 'CKB' ? selectedImage.captionCkb : selectedImage.captionKmr" class="gallery-preview__img" @click="openFullscreen(selectedImage)" @error="onImgError($event)" />
                  <div class="gallery-zoom-hint">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
                    {{ lbl('clickToExpand') }}
                  </div>
                </div>
                <div class="gallery-caption" v-if="selectedImage">
                  <div class="gallery-caption__title">{{ lang.activeLang === 'CKB' ? selectedImage.captionCkb : selectedImage.captionKmr }}</div>
                  <div class="gallery-caption__desc">{{ lang.activeLang === 'CKB' ? selectedImage.descriptionCkb : selectedImage.descriptionKmr }}</div>
                </div>
              </div>
              <div class="gallery-strip">
                <button v-for="img in activeItem.imageAlbum" :key="img.id" class="gthumb" :class="{ 'gthumb--on': selectedImage?.id === img.id }" @click="selectedImage = img">
                  <img :src="img.imageUrl || img.externalUrl" @error="onImgError($event)" />
                </button>
              </div>
              <div class="gallery-nav" v-if="activeItem.imageAlbum.length > 1">
                <button class="gnav-btn" @click="prevImage" :disabled="!canPrevImage">{{ lbl('prev') }}</button>
                <span class="gnav-pos">{{ currentImageIdx + 1 }} / {{ activeItem.imageAlbum.length }}</span>
                <button class="gnav-btn" @click="nextImage" :disabled="!canNextImage">{{ lbl('next') }}</button>
              </div>
            </div>
            <div class="gallery-empty" v-else><img :src="pCover(activeItem)" :alt="pTitle(activeItem)" class="gallery-single" @error="onImgError($event)" /></div>
          </div>
        </section>

        <!-- ── WRITING ── -->
        <section class="writing-section" v-if="activeItem._mediaType === 'writing'">
          <div class="container">
            <div class="writing-layout">
              <div class="writing-info-grid">
                <div class="winfo-card" v-if="pWriter(activeItem)"><div class="winfo-card__ico">✍️</div><div class="winfo-card__content"><div class="winfo-card__lbl">{{ lbl('writer') }}</div><div class="winfo-card__val">{{ pWriter(activeItem) }}</div></div></div>
                <div class="winfo-card" v-if="pGenre(activeItem)"><div class="winfo-card__ico">🎭</div><div class="winfo-card__content"><div class="winfo-card__lbl">{{ lbl('genre') }}</div><div class="winfo-card__val">{{ pGenre(activeItem) }}</div></div></div>
                <div class="winfo-card" v-if="pPageCount(activeItem)"><div class="winfo-card__ico">📄</div><div class="winfo-card__content"><div class="winfo-card__lbl">{{ lbl('pages') }}</div><div class="winfo-card__val">{{ pPageCount(activeItem) }}</div></div></div>
                <div class="winfo-card" v-if="activeItem.writingTopic"><div class="winfo-card__ico">🏷️</div><div class="winfo-card__content"><div class="winfo-card__lbl">{{ lbl('category') }}</div><div class="winfo-card__val">{{ activeItem.writingTopic }}</div></div></div>
                <div class="winfo-card" v-if="pFileFormat(activeItem)"><div class="winfo-card__ico">💾</div><div class="winfo-card__content"><div class="winfo-card__lbl">{{ lbl('format') }}</div><div class="winfo-card__val">{{ pFileFormat(activeItem) }}</div></div></div>
                <div class="winfo-card" v-if="activeItem.publishedByInstitute"><div class="winfo-card__ico">🏛️</div><div class="winfo-card__content"><div class="winfo-card__lbl">{{ lbl('publisher') }}</div><div class="winfo-card__val">{{ lbl('institute') }}</div></div></div>
              </div>
              <div class="series-block" v-if="activeItem.seriesName || activeItem.seriesId">
                <div class="series-block__ico">📚</div>
                <div class="series-block__info">
                  <div class="series-block__lbl">{{ lbl('series') }}</div>
                  <div class="series-block__name">{{ activeItem.seriesName || activeItem.seriesId }}</div>
                  <div class="series-block__order" v-if="activeItem.seriesOrder">Vol. {{ activeItem.seriesOrder }}</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section class="chips-section" v-if="pTags(activeItem).length">
          <div class="container">
            <div class="chips-block">
              <h3 class="chips-block__heading">{{ lbl('tags') }}</h3>
              <div class="chips-row"><span v-for="tag in pTags(activeItem)" :key="tag" class="chip chip--tag">#{{ tag }}</span></div>
            </div>
          </div>
        </section>

        <section class="chips-section chips-section--alt" v-if="pKeywords(activeItem).length">
          <div class="container">
            <div class="chips-block">
              <h3 class="chips-block__heading">{{ lbl('keywords') }}</h3>
              <div class="chips-row"><span v-for="kw in pKeywords(activeItem)" :key="kw" class="chip chip--kw">{{ kw }}</span></div>
            </div>
          </div>
        </section>

        <section class="related" v-if="relatedItems.length">
          <div class="container">
            <div class="related__head">
              <h2 class="related__title">{{ lbl('related') }}</h2>
              <div class="related__rule"></div>
            </div>
            <div class="related__grid">
              <article
                v-for="rp in relatedItems"
                :key="`rel-${rp._mediaType}-${rp.id}`"
                class="rcard"
                tabindex="0"
                @click="openItem(rp)"
                @keyup.enter="openItem(rp)"
              >
                <div class="rcard__img">
                  <img :src="pCover(rp)" :alt="pTitle(rp)" loading="lazy" class="rcard__img-main" @error="onImgError($event)" />
                  <img v-if="pHoverCover(rp)" :src="pHoverCover(rp)" :alt="pTitle(rp)" loading="lazy" class="rcard__img-hover" @error="onImgError($event)" />
                  <div class="rcard__overlay"></div>
                  <span class="rcard__typebadge">{{ getMediaIcon(rp._mediaType) }}</span>
                </div>
                <div class="rcard__body">
                  <h3 class="rcard__title">{{ pTitle(rp) }}</h3>
                  <p class="rcard__desc">{{ truncate(pDesc(rp), 90) }}</p>
                  <div class="rcard__tags" v-if="pTags(rp).length">
                    <span v-for="t in pTags(rp).slice(0, 2)" :key="t" class="rtag">#{{ t }}</span>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>
      </div>
    </transition>

    <!-- ── FULLSCREEN OVERLAY ── -->
    <transition name="fs">
      <div v-if="isFullscreen" class="fsoverlay" @click="isFullscreen = false">
        <button class="fsoverlay__x" @click.stop="isFullscreen = false">✕</button>
        <div class="fsoverlay__frame" @click.stop>
          <img :src="fullscreenUrl" class="fsoverlay__img" />
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

const lang = useLanguageStore()

const fallbackCover = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f4f4f5'/%3E%3Crect x='160' y='95' width='80' height='65' rx='8' fill='%23e4e4e7'/%3E%3Ccircle cx='185' cy='118' r='10' fill='%23d4d4d8'/%3E%3Cpolygon points='160,160 200,125 230,148 260,125 280,160' fill='%23d4d4d8'/%3E%3C/svg%3E"
const currentYear = new Date().getFullYear()

const i18n = {
  CKB: {
    archive: 'ئەرشیڤ', heroDeco: 'کتێبخانەی کهیە', heroMain: 'بڵاوکراوەکان',
    heroSub: 'وێنە · دەنگ · ڤیدیۆ · نووسین',
    images: 'وێنەکان', sound: 'دەنگ', video: 'ڤیدیۆ', writings: 'نووسینەکان',
    memories: 'یادگاریەکان', albumOfMemories: 'یادگاریەکان', allTopics: 'هەموو بابەتەکان',
    all: 'هەموو', explore: 'بگەڕێ', back: 'گەڕانەوە', results: 'ئەنجام',
    noResults: 'ئەنجامێک نەدۆزرایەوە', noResultsHint: 'فیلتر بگۆڕە یان سیفرەوە',
    resetFilter: 'سیفرکردنەوە', viewItem: 'بینین', tracks: 'گۆرانیەکان', track: 'گۆرانی',
    pages: 'لاپەڕە', clips: 'کلیپەکان', yourStream: 'گۆرانیەکان', featured: 'تایبەتمەند',
    type: 'جۆر', director: 'دەرهێنەر', writer: 'نووسەر', genre: 'جۆری نووسین',
    category: 'پۆل', format: 'فۆرمات', publisher: 'بڵاوکەرەوە', institute: 'ڕێکخراو',
    series: 'زنجیرە', tags: 'تاگەکان', keywords: 'کلیلەوشەکان', related: 'پەیوەندیدار',
    sortNewest: 'نوێترین', sortOldest: 'کۆنترین', sortTitle: 'ناوی',
    prev: 'پێشتر', next: 'دواتر', noSource: 'سەرچاوەیەک نییە',
    clickToExpand: 'کلیک بکە بۆ گەورەکردن', totalItems: 'کۆی بابەتەکان',
    noTopics: 'بابەتێک نییە', noMemories: 'یادگاریەک نییە',
  },
  KMR: {
    archive: 'Arşîv', heroDeco: 'Lîbrariya KHI', heroMain: 'Weşandin',
    heroSub: 'Wêne · Deng · Vîdyo · Nivîsar',
    images: 'Wêne', sound: 'Deng', video: 'Vîdyo', writings: 'Nivîsarên',
    memories: 'Bîranîn', albumOfMemories: 'Albûma Bîranînê', allTopics: 'Hemû Mijar',
    all: 'Hemû', explore: 'Bigere', back: 'Vegere', results: 'Encam',
    noResults: 'Encam nehat dîtin', noResultsHint: 'Fîlteran biguherîne',
    resetFilter: 'Sifirkirin', viewItem: 'Bibîne', tracks: 'Stran', track: 'Stran',
    pages: 'Rûpel', clips: 'Klîp', yourStream: 'Stranên Te', featured: 'Taybet',
    type: 'Cûre', director: 'Derhêner', writer: 'Nivîskar', genre: 'Cûre',
    category: 'Kategorî', format: 'Format', publisher: 'Weşanger', institute: 'Dezgeh',
    series: 'Rêze', tags: 'Etiket', keywords: 'Peyvên Kilîtê', related: 'Girêdayî',
    sortNewest: 'Herî nû', sortOldest: 'Herî kevn', sortTitle: 'Sernavê',
    prev: 'Berî', next: 'Paş', noSource: 'Çavkanî tune',
    clickToExpand: 'Klikê bike mezin bike', totalItems: 'Giştî',
    noTopics: 'Mijar tune', noMemories: 'Bîranîn tune',
  }
}
function lbl(key) {
  const al = lang?.activeLang || 'CKB'
  return i18n[al]?.[key] || i18n['CKB']?.[key] || key
}

const api = axios.create({ baseURL: API_BASE_URL, timeout: 15000 })

const images   = ref([])
const sounds   = ref([])
const videos   = ref([])
const writings = ref([])
const imageTopics   = ref([])
const soundTopics   = ref([])
const videoTopics   = ref([])
const writingTopics = ref([])

const isLoading       = ref(false)
const activeTab       = ref('sound')
const activeTopicFilter = ref(null)
const sortBy          = ref('newest')
const openDropdownKey = ref(null)
const gridSection     = ref(null)
const tabNavRef       = ref(null)
let dropCloseTimer    = null

const clientPage     = ref(0)
const clientPageSize = 12

const activeItem    = ref(null)
const selectedClip  = ref(null)
const selectedImage = ref(null)

const audioPlayer      = ref(null)
const currentTrackIdx  = ref(-1)
const currentTrack     = ref(null)
const isAudioPlaying   = ref(false)
const audioCurrentTime = ref(0)
const audioDuration    = ref(0)
const audioProgress    = ref(0)

const isFullscreen  = ref(false)
const fullscreenUrl = ref('')

const memorySounds = computed(() =>
  sounds.value.filter(s => s.albumOfMemories).map(s => ({ ...s, _mediaType: 'sound' }))
)
const memoryVideos = computed(() =>
  videos.value.filter(v => v.albumOfMemories).map(v => ({ ...v, _mediaType: 'video' }))
)

const heroSlideIndex = ref(0)
const heroPrevIndex  = ref(-1)
let   slideTimer     = null

const heroSlides = computed(() => {
  const seen = new Set()
  const urls = []
  const addUrl = (u, tab) => {
    if (!u || seen.has(u)) return
    if (u.includes('example.com') || u.includes('placeholder')) return
    if (!u.startsWith('http')) return
    seen.add(u)
    urls.push({ url: u, tab })
  }
  images.value.forEach(x => { addUrl(x.ckbCoverUrl, 'image'); addUrl(x.kmrCoverUrl, 'image'); addUrl(x.hoverCoverUrl, 'image') })
  sounds.value.forEach(x => { addUrl(x.ckbCoverUrl, 'sound'); addUrl(x.kmrCoverUrl, 'sound'); addUrl(x.hoverCoverUrl, 'sound') })
  videos.value.forEach(x => { addUrl(x.ckbCoverUrl, 'video'); addUrl(x.kmrCoverUrl, 'video'); addUrl(x.hoverCoverUrl, 'video') })
  writings.value.forEach(x => { addUrl(x.ckbCoverUrl, 'writing'); addUrl(x.kmrCoverUrl, 'writing'); addUrl(x.hoverCoverUrl, 'writing') })
  for (let i = urls.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [urls[i], urls[j]] = [urls[j], urls[i]]
  }
  return urls.slice(0, 14)
})

function jumpSlide(idx) {
  heroPrevIndex.value  = heroSlideIndex.value
  heroSlideIndex.value = idx
  restartSlideTimer()
}
function advanceSlide() {
  if (!heroSlides.value.length) return
  heroPrevIndex.value  = heroSlideIndex.value
  heroSlideIndex.value = (heroSlideIndex.value + 1) % heroSlides.value.length
}
function restartSlideTimer() {
  if (slideTimer) clearInterval(slideTimer)
  slideTimer = setInterval(advanceSlide, 4800)
}
watch(heroSlides, (slides) => { if (slides.length > 1) restartSlideTimer() }, { immediate: false })

const waveformCache = new Map()
function getWaveform(seed) {
  const key = String(seed)
  if (!waveformCache.has(key)) {
    const bars = Array.from({ length: 40 }, (_, i) => {
      const x = Math.sin(Number(seed || 1) * 9301 + i * 49297 + 233) * 233
      return (x - Math.floor(x)) * 0.7 + 0.3
    })
    waveformCache.set(key, bars)
  }
  return waveformCache.get(key)
}

function particleStyle(i) {
  const seed = i * 137.508
  return {
    '--x': `${seed % 100}%`,
    '--y': `${(seed * 1.618) % 100}%`,
    '--dur': `${14 + (i * 3.2) % 20}s`,
    '--del': `${(i * 1.1) % 5}s`,
    '--sz': `${1.5 + (i % 3)}px`,
  }
}

const tabDefs = computed(() => [
  { key: 'image',    label: lbl('images'),   icon: '🖼️' },
  { key: 'sound',    label: lbl('sound'),    icon: '🎵' },
  { key: 'video',    label: lbl('video'),    icon: '🎬' },
  { key: 'writing',  label: lbl('writings'), icon: '📚' },
  { key: 'memories', label: lbl('memories'), icon: '💫' },
])

const displayedItems = computed(() => {
  let list = []
  switch (activeTab.value) {
    case 'image':    list = [...images.value]; break
    case 'sound':    list = [...sounds.value]; break
    case 'video':    list = [...videos.value]; break
    case 'writing':  list = [...writings.value]; break
    case 'memories': list = [...memorySounds.value, ...memoryVideos.value]; break
  }
  if (activeTopicFilter.value && activeTab.value !== 'memories') {
    list = list.filter(item => item.topic?.id === activeTopicFilter.value)
  }
  switch (sortBy.value) {
    case 'newest': list.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || '')); break
    case 'oldest': list.sort((a, b) => (a.createdAt || '').localeCompare(b.createdAt || '')); break
    case 'title':  list.sort((a, b) => pTitle(a).localeCompare(pTitle(b))); break
  }
  return list
})

const totalClientPages = computed(() => Math.ceil(displayedItems.value.length / clientPageSize))
const paginatedItems   = computed(() => {
  const s = clientPage.value * clientPageSize
  return displayedItems.value.slice(s, s + clientPageSize)
})

const heroStats = computed(() => [
  { value: images.value.length,   label: lbl('images') },
  { value: sounds.value.length,   label: lbl('sound') },
  { value: videos.value.length,   label: lbl('video') },
  { value: writings.value.length, label: lbl('writings') },
])

const activeTopicName = computed(() => {
  if (!activeTopicFilter.value) return ''
  const all = [...imageTopics.value, ...soundTopics.value, ...videoTopics.value, ...writingTopics.value]
  const t = all.find(t => t.id === activeTopicFilter.value)
  return t ? topicName(t) : ''
})

const relatedItems = computed(() => {
  if (!activeItem.value) return []
  const myTags = new Set(pTags(activeItem.value))
  const type = activeItem.value._mediaType
  const pool = type === 'image' ? images.value : type === 'sound' ? sounds.value : type === 'video' ? videos.value : writings.value
  return pool.filter(p => p.id !== activeItem.value.id && pTags(p).some(t => myTags.has(t))).slice(0, 4)
})

const totalSoundDuration = computed(() => {
  if (!activeItem.value || activeItem.value._mediaType !== 'sound') return 0
  return (activeItem.value.files || []).reduce((sum, f) => sum + (f.durationSeconds || 0), 0)
})

const currentImageIdx = computed(() => {
  if (!selectedImage.value || !activeItem.value?.imageAlbum) return 0
  return activeItem.value.imageAlbum.findIndex(i => i.id === selectedImage.value.id)
})
const canPrevImage = computed(() => currentImageIdx.value > 0)
const canNextImage = computed(() => currentImageIdx.value < (activeItem.value?.imageAlbum?.length || 0) - 1)

function pTitle(item) {
  if (!item) return ''
  const c = lang.activeLang === 'CKB'
  return (c ? item.ckbContent?.title : item.kmrContent?.title) || (c ? item.kmrContent?.title : item.ckbContent?.title) || ''
}
function pDesc(item) {
  if (!item) return ''
  const c = lang.activeLang === 'CKB'
  return (c ? item.ckbContent?.description : item.kmrContent?.description) || (c ? item.kmrContent?.description : item.ckbContent?.description) || ''
}
function pCover(item) {
  if (!item) return fallbackCover
  const c = lang.activeLang === 'CKB'
  return (c ? item.ckbCoverUrl : item.kmrCoverUrl) || (c ? item.kmrCoverUrl : item.ckbCoverUrl) || item.hoverCoverUrl || fallbackCover
}
function pHoverCover(item) {
  if (!item) return null
  const cover = pCover(item)
  const hover = item.hoverCoverUrl
  if (!hover || hover === cover || hover === fallbackCover) return null
  return hover
}
function pTags(item) { if (!item) return []; return [...(lang.activeLang === 'CKB' ? (item.tagsCkb || []) : (item.tagsKmr || []))] }
function pKeywords(item) { if (!item) return []; return [...(lang.activeLang === 'CKB' ? (item.keywordsCkb || []) : (item.keywordsKmr || []))] }
function pLocation(item) { if (!item) return ''; return (lang.activeLang === 'CKB' ? item.ckbContent?.location : item.kmrContent?.location) || '' }
function pCollectedBy(item) { if (!item) return ''; return (lang.activeLang === 'CKB' ? item.ckbContent?.collectedBy : item.kmrContent?.collectedBy) || '' }
function pDirector(item) { if (!item) return ''; return (lang.activeLang === 'CKB' ? item.ckbContent?.director : item.kmrContent?.director) || '' }
function pProducer(item) { if (!item) return ''; return (lang.activeLang === 'CKB' ? item.ckbContent?.producer : item.kmrContent?.producer) || '' }
function pWriter(item) { if (!item) return ''; return (lang.activeLang === 'CKB' ? item.ckbContent?.writer : item.kmrContent?.writer) || '' }
function pGenre(item) { if (!item) return ''; return (lang.activeLang === 'CKB' ? item.ckbContent?.genre : item.kmrContent?.genre) || '' }
function pPageCount(item) { if (!item) return null; return item.ckbContent?.pageCount || item.kmrContent?.pageCount || null }
function pFileFormat(item) { if (!item) return ''; return item.ckbContent?.fileFormat || item.kmrContent?.fileFormat || '' }

function topicName(topic) {
  if (!topic) return ''
  return (lang.activeLang === 'CKB' ? topic.nameCkb : topic.nameKmr) || topic.nameCkb || topic.nameKmr || ''
}

function getMediaIcon(type) { return { image: '🖼️', sound: '🎵', video: '🎬', writing: '📚' }[type] || '📎' }
function getMediaTypeLabel(type) { return { image: lbl('images'), sound: lbl('sound'), video: lbl('video'), writing: lbl('writings') }[type] || type }
function getTypeEmoji(item) {
  if (!item) return '📎'
  if (item._mediaType === 'sound')   return item.trackState === 'MULTI' ? '💿' : '🎵'
  if (item._mediaType === 'video')   return item.videoType === 'FILM' ? '🎞' : '📹'
  if (item._mediaType === 'image')   return item.collectionType === 'SINGLE' ? '🖼️' : '📷'
  if (item._mediaType === 'writing') return '📖'
  return '📎'
}
function getTypeLabel(item) {
  if (!item) return ''
  if (item._mediaType === 'sound')   return item.trackState || 'SOUND'
  if (item._mediaType === 'video')   return item.videoType || 'VIDEO'
  if (item._mediaType === 'image')   return item.collectionType || 'IMAGE'
  if (item._mediaType === 'writing') return item.writingTopic || 'WRITING'
  return item._mediaType?.toUpperCase() || ''
}
function getItemDate(item) { return item?.publishmentDate || item?.createdAt || null }
function getCountBadge(item) {
  if (!item) return null
  if (item._mediaType === 'sound'   && item.files?.length)          return `🎵 ${item.files.length}`
  if (item._mediaType === 'image'   && item.imageAlbum?.length)     return `🖼️ ${item.imageAlbum.length}`
  if (item._mediaType === 'video'   && item.videoClipItems?.length) return `📹 ${item.videoClipItems.length}`
  return null
}
function getExtraLine(item) {
  if (!item) return ''
  if (item._mediaType === 'writing') return pWriter(item)
  if (item._mediaType === 'sound')   return item.soundType || item.director || ''
  if (item._mediaType === 'video')   return pDirector(item)
  if (item._mediaType === 'image')   return pLocation(item)
  return ''
}
function tabCount(key) {
  if (key === 'image')    return images.value.length
  if (key === 'sound')    return sounds.value.length
  if (key === 'video')    return videos.value.length
  if (key === 'writing')  return writings.value.length
  if (key === 'memories') return memorySounds.value.length + memoryVideos.value.length
  return 0
}
function getTopicsFor(key) {
  if (key === 'image')   return imageTopics.value
  if (key === 'sound')   return soundTopics.value
  if (key === 'video')   return videoTopics.value
  if (key === 'writing') return writingTopics.value
  return []
}

function truncate(text, max) { if (!text) return ''; return text.length > max ? text.slice(0, max) + '…' : text }
function formatDate(v) {
  if (!v) return ''
  try {
    const d = new Date(v)
    if (isNaN(d.getTime())) return String(v)
    return d.toLocaleDateString(lang.activeLang === 'CKB' ? 'ckb' : 'ku', { year: 'numeric', month: 'long', day: 'numeric' })
  } catch { return String(v) }
}
function formatTime(s) {
  if (!s || isNaN(s)) return '0:00'
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60).toString().padStart(2, '0')
  if (m >= 60) return `${Math.floor(m/60)}:${String(m%60).padStart(2,'0')}:${sec}`
  return `${m}:${sec}`
}
function formatSize(bytes) { if (!bytes) return ''; return bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(0)}KB` : `${(bytes / (1024 * 1024)).toFixed(1)}MB` }
function onImgError(e) { e.target.src = fallbackCover }

async function fetchAll() {
  isLoading.value = true
  try { await Promise.allSettled([fetchImages(), fetchSounds(), fetchVideos(), fetchWritings(), fetchTopics()]) }
  finally { isLoading.value = false }
}
async function fetchImages() {
  try { const { data } = await api.get('/image-collections'); images.value = (Array.isArray(data?.data || data) ? (data?.data || data) : []).map(i => ({ ...i, _mediaType: 'image' })) }
  catch (e) { console.warn('images:', e.message) }
}
async function fetchSounds() {
  try { const { data } = await api.get('/soundtracks'); sounds.value = (Array.isArray(data) ? data : (data?.data || [])).map(s => ({ ...s, _mediaType: 'sound' })) }
  catch (e) { console.warn('sounds:', e.message) }
}
async function fetchVideos() {
  try { const { data } = await api.get('/videos', { params: { page: 0, size: 200 } }); videos.value = (data?.content || data?.data?.content || []).map(v => ({ ...v, _mediaType: 'video' })) }
  catch (e) { console.warn('videos:', e.message) }
}
async function fetchWritings() {
  try { const { data } = await api.get('/writings', { params: { page: 0, size: 200 } }); writings.value = (data?.data?.content || data?.content || []).map(w => ({ ...w, _mediaType: 'writing' })) }
  catch (e) { console.warn('writings:', e.message) }
}
async function fetchTopics() {
  try {
    const [imgT, sndT, vidT, wrtT] = await Promise.allSettled([
      api.get('/image-collections/topics'), api.get('/soundtracks/topics'),
      api.get('/videos/topics'), api.get('/writings/topics')
    ])
    if (imgT.status === 'fulfilled') imageTopics.value  = imgT.value.data?.data || imgT.value.data || []
    if (sndT.status === 'fulfilled') soundTopics.value  = sndT.value.data || []
    if (vidT.status === 'fulfilled') { const vd = vidT.value.data; videoTopics.value = Array.isArray(vd) ? vd : (vd?.data || vd || []) }
    if (wrtT.status === 'fulfilled') writingTopics.value = wrtT.value.data?.data || wrtT.value.data || []
  } catch (e) { console.warn('topics:', e.message) }
}

function switchTab(key) { activeTab.value = key; activeTopicFilter.value = null; clientPage.value = 0; openDropdownKey.value = null }
function setTopicFilter(id) { activeTopicFilter.value = id; clientPage.value = 0; openDropdownKey.value = null }
function clearTopicFilter() { activeTopicFilter.value = null; clientPage.value = 0 }
function cancelDropClose() {}
function goPrev() { if (clientPage.value > 0) { clientPage.value--; scrollToContent() } }
function goNext() { if (clientPage.value + 1 < totalClientPages.value) { clientPage.value++; scrollToContent() } }
function scrollToContent() { gridSection.value?.scrollIntoView({ behavior: 'smooth' }) }

function openItem(item) {
  stopAudio()
  activeItem.value = item
  selectedClip.value  = item.videoClipItems?.[0] || null
  selectedImage.value = item.imageAlbum?.[0] || null
  currentTrackIdx.value = -1; currentTrack.value = null
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
function closeItem() {
  stopAudio(); activeItem.value = null; selectedClip.value = null; selectedImage.value = null
  currentTrackIdx.value = -1; currentTrack.value = null
}
function openMemoryFromDropdown(item) { openDropdownKey.value = null; activeTab.value = 'memories'; openItem(item) }

function playTrack(file, idx) {
  const url = file.fileUrl || file.externalUrl
  if (!url || !audioPlayer.value) return
  currentTrackIdx.value = idx; currentTrack.value = file
  audioPlayer.value.src = url; audioPlayer.value.load(); audioPlayer.value.play().catch(() => {})
}
function togglePlay() { audioPlayer.value?.paused ? audioPlayer.value.play() : audioPlayer.value.pause() }
function prevTrack() { if (currentTrackIdx.value > 0 && activeItem.value?.files) playTrack(activeItem.value.files[currentTrackIdx.value - 1], currentTrackIdx.value - 1) }
function nextTrack() { if (activeItem.value?.files && currentTrackIdx.value < activeItem.value.files.length - 1) playTrack(activeItem.value.files[currentTrackIdx.value + 1], currentTrackIdx.value + 1) }
function onTrackEnded() { isAudioPlaying.value = false; nextTrack() }
function onAudioLoaded() { if (audioPlayer.value) audioDuration.value = audioPlayer.value.duration }
function onAudioTimeUpdate() {
  if (!audioPlayer.value) return
  audioCurrentTime.value = audioPlayer.value.currentTime
  audioProgress.value = (audioPlayer.value.currentTime / audioPlayer.value.duration) * 100 || 0
}
function seekAudio(e) {
  if (!audioPlayer.value) return
  const r = e.currentTarget.getBoundingClientRect()
  audioPlayer.value.currentTime = ((e.clientX - r.left) / r.width) * audioPlayer.value.duration
}
function stopAudio() {
  if (audioPlayer.value) { audioPlayer.value.pause(); audioPlayer.value.src = '' }
  isAudioPlaying.value = false; audioCurrentTime.value = 0; audioDuration.value = 0; audioProgress.value = 0
}

function prevImage() { if (canPrevImage.value) selectedImage.value = activeItem.value.imageAlbum[currentImageIdx.value - 1] }
function nextImage() { if (canNextImage.value) selectedImage.value = activeItem.value.imageAlbum[currentImageIdx.value + 1] }
function openFullscreen(img) { fullscreenUrl.value = img.imageUrl || img.externalUrl || ''; isFullscreen.value = true }

function handleKeydown(e) {
  if (e.key === 'Escape') {
    if (isFullscreen.value) { isFullscreen.value = false; return }
    if (activeItem.value) closeItem()
  }
  if (!activeItem.value) return
  if (activeItem.value._mediaType === 'image') {
    if (e.key === 'ArrowLeft')  nextImage()
    if (e.key === 'ArrowRight') prevImage()
  }
}
function handleClickOutside(e) { if (!e.target.closest('.tabnav__item')) openDropdownKey.value = null }
watch(() => lang.activeLang, () => { if (isFullscreen.value) isFullscreen.value = false })

onMounted(() => {
  fetchAll()
  window.addEventListener('keydown', handleKeydown)
  document.addEventListener('click', handleClickOutside)
})
onUnmounted(() => {
  stopAudio()
  if (slideTimer) clearInterval(slideTimer)
  window.removeEventListener('keydown', handleKeydown)
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* ════════════════════════════════════════════════════════════
   DESIGN SYSTEM — Luxury Heritage Archive
   Warm editorial dark aesthetic with gold & crimson accents
   ════════════════════════════════════════════════════════════ */
.pub {
  /* ── Brand Palette ── */
  --brand:        #A31B1B;
  --brand-light:  #C9403A;
  --brand-dark:   #7C1414;
  --brand-glow:   rgba(163,27,27,0.38);
  --brand-subtle: rgba(163,27,27,0.07);

  /* ── Gold Accent ── */
  --gold:         #C9A028;
  --gold-light:   #E0BC62;
  --gold-dark:    #9E7D1A;
  --gold-glow:    rgba(201,160,40,0.28);
  --gold-subtle:  rgba(201,160,40,0.07);

  /* ── Memory Purple ── */
  --mem-purple:   #7B3FA0;
  --mem-glow:     rgba(123,63,160,0.35);

  /* ── Warm Neutrals ── */
  --white:     #FEFCF8;
  --black:     #090807;
  --grey-50:   #F8F5F0;
  --grey-100:  #EEE9E1;
  --grey-200:  #E0D9CF;
  --grey-300:  #C5BDB0;
  --grey-400:  #96908A;
  --grey-500:  #726C65;
  --grey-600:  #524D47;
  --grey-700:  #3A3530;
  --grey-800:  #252118;
  --grey-900:  #16130D;

  /* ── Deep Dark Tones ── */
  --deep-1:    #0E0B08;
  --deep-2:    #161209;
  --deep-3:    #1F1A11;
  --deep-4:    #2A2418;

  /* ── Typography ── */
  --font-sans:    'Noto Sans Arabic','Noto Sans','Source Sans 3',system-ui,sans-serif;
  --font-display: 'Noto Kufi Arabic','Noto Serif','Source Serif 4',Georgia,serif;

  --container: 1260px;

  /* ── Easing ── */
  --ease-out:    cubic-bezier(0.16,1,0.3,1);
  --ease-spring: cubic-bezier(0.34,1.56,0.64,1);
  --ease-soft:   cubic-bezier(0.4,0,0.2,1);
  --dur-fast:  140ms;
  --dur-norm:  280ms;
  --dur-slow:  480ms;
  --dur-xslow: 700ms;

  /* ── Shadows ── */
  --shadow-sm:      0 1px 3px rgba(0,0,0,.08), 0 1px 2px rgba(0,0,0,.05);
  --shadow-md:      0 4px 12px rgba(0,0,0,.1), 0 2px 4px rgba(0,0,0,.06);
  --shadow-lg:      0 10px 28px rgba(0,0,0,.13), 0 4px 8px rgba(0,0,0,.06);
  --shadow-xl:      0 20px 48px rgba(0,0,0,.16), 0 8px 16px rgba(0,0,0,.07);
  --shadow-2xl:     0 32px 72px rgba(0,0,0,.24), 0 12px 24px rgba(0,0,0,.1);
  --shadow-glow:    0 0 48px var(--brand-glow);
  --shadow-gold:    0 0 32px var(--gold-glow);
  --shadow-card:    0 2px 8px rgba(0,0,0,.06), 0 1px 2px rgba(0,0,0,.04);
  --shadow-card-h:  0 16px 48px rgba(0,0,0,.15), 0 6px 16px rgba(0,0,0,.08);

  /* ── Radii ── */
  --r-xs:   4px;
  --r-sm:   8px;
  --r-md:   14px;
  --r-lg:   20px;
  --r-xl:   28px;
  --r-2xl:  36px;
  --r-full: 9999px;

  font-family: var(--font-sans);
  color: var(--grey-900);
  background: var(--white);
  overflow-x: hidden;
}

/* ════════════════════════════════════════
   TRANSITIONS
   ════════════════════════════════════════ */
.page-enter-active { transition: opacity var(--dur-slow) var(--ease-out), transform var(--dur-slow) var(--ease-out); }
.page-leave-active { transition: opacity var(--dur-norm) var(--ease-soft), transform var(--dur-norm) var(--ease-soft); }
.page-enter-from   { opacity:0; transform:translateY(28px) scale(.99); }
.page-leave-to     { opacity:0; transform:translateY(-12px); }

.pill-enter-active,.pill-leave-active { transition: all var(--dur-norm) var(--ease-spring); }
.pill-enter-from,.pill-leave-to { opacity:0; transform:scale(.88) translateY(-10px); }

.drop-enter-active { transition: all 240ms var(--ease-spring); }
.drop-leave-active { transition: all 160ms var(--ease-soft); }
.drop-enter-from   { opacity:0; transform:translateY(-14px) scale(.96); }
.drop-leave-to     { opacity:0; transform:translateY(-6px) scale(.98); }

.lang-swap-enter-active,.lang-swap-leave-active { transition: all var(--dur-norm) var(--ease-out); }
.lang-swap-enter-from,.lang-swap-leave-to { opacity:0; transform:translateX(16px); }

.fs-enter-active,.fs-leave-active { transition: opacity var(--dur-norm); }
.fs-enter-from,.fs-leave-to { opacity:0; }

/* ════════════════════════════════════════
   LAYOUT
   ════════════════════════════════════════ */
.container { max-width:var(--container); margin:0 auto; padding:0 28px; }
@media (min-width:768px) { .container { padding:0 44px; } }

/* ════════════════════════════════════════
   CINEMATIC HERO — Enhanced
   ════════════════════════════════════════ */
.hero {
  position: relative;
  min-height: 72vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: var(--deep-1);
}

.hero__canvas {
  position: absolute; inset: 0;
}

/* Slideshow */
.hero__slides { position: absolute; inset: 0; overflow: hidden; }
.hero__slide {
  position: absolute; inset: -10%;
  background-size: cover; background-position: center;
  opacity: 0;
  transition: opacity 1.8s cubic-bezier(0.4,0,0.2,1);
  will-change: transform, opacity;
}
.hero__slide--active { opacity: 1; z-index: 2; }
.hero__slide--prev   { opacity: 0; z-index: 1; }
.hero__slide--kb-a   { animation: kb-a 12s ease-in-out infinite alternate; }
.hero__slide--kb-b   { animation: kb-b 12s ease-in-out infinite alternate; }
@keyframes kb-a { from { transform:scale(1.0) translate(0%,0%); } to { transform:scale(1.14) translate(-2%,-1.5%); } }
@keyframes kb-b { from { transform:scale(1.14) translate(2%,1%); } to { transform:scale(1.0) translate(0%,0%); } }

.hero__slide--gradient { opacity:1; z-index:2; }
.hero__slide--grad-image    { background:linear-gradient(145deg,#05111f 0%,#0d2640 45%,#061220 100%); }
.hero__slide--grad-sound    { background:linear-gradient(145deg,#0d0814 0%,#231040 45%,#120820 100%); }
.hero__slide--grad-video    { background:linear-gradient(145deg,#071007 0%,#102610 45%,#081408 100%); }
.hero__slide--grad-writing  { background:linear-gradient(145deg,#110e04 0%,#281f06 45%,#110d03 100%); }
.hero__slide--grad-memories { background:linear-gradient(145deg,#0a0814 0%,#1c0828 45%,#080d1a 100%); }

/* Hero overlay system — multiple layered for depth */
.hero__overlay { position:absolute; inset:0; pointer-events:none; }
.hero__overlay--base     { background:rgba(8,6,4,.42); }
.hero__overlay--vignette { background:radial-gradient(ellipse at 50% 50%, transparent 30%, rgba(4,3,2,.82) 100%); }
.hero__overlay--bottom   { background:linear-gradient(to top, rgba(8,6,3,.98) 0%, transparent 55%); }
.hero__overlay--top      { background:linear-gradient(to bottom, rgba(8,6,3,.55) 0%, transparent 35%); }

.hero__film {
  position:absolute; inset:0; pointer-events:none; z-index:3;
  background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,.035) 2px,rgba(0,0,0,.035) 4px);
}
.hero__grain {
  position:absolute; inset:0; pointer-events:none; z-index:3;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.92' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E");
  background-size:256px;
}
.hero__scanlines {
  position:absolute; inset:0; pointer-events:none; z-index:3;
  background:repeating-linear-gradient(transparent,transparent 2px,rgba(255,255,255,.011) 2px,rgba(255,255,255,.011) 4px);
}

/* Gold filigree accent lines */
.hero__filigree { position:absolute; pointer-events:none; z-index:4; background:var(--gold); opacity:.18; }
.hero__filigree--h1 { top:0; left:0; right:0; height:1px; }
.hero__filigree--h2 { bottom:0; left:0; right:0; height:1px; }
.hero__filigree--v1 { top:0; bottom:0; right:0; width:1px; }
.hero__filigree--v2 { top:0; bottom:0; left:0; width:1px; }

/* Slide dots */
.hero__dots {
  position:absolute; bottom:100px; left:50%; transform:translateX(-50%);
  display:flex; gap:8px; z-index:6;
}
.hero__dot {
  width:6px; height:6px; border-radius:50%; border:none;
  background:rgba(255,255,255,.28); cursor:pointer; padding:0;
  transition:all 0.4s var(--ease-spring);
}
.hero__dot--on {
  background:var(--gold); width:24px; border-radius:3px;
  box-shadow:0 0 12px var(--gold-glow);
}

/* Ambient orbs */
.hero__orb {
  position:absolute; border-radius:50%; pointer-events:none;
  animation: orb-pulse 11s ease-in-out infinite;
}
.orb--a    { width:750px; height:750px; top:-250px; right:-200px; background:radial-gradient(circle,rgba(163,27,27,.22) 0%,transparent 70%); animation-delay:0s; }
.orb--b    { width:550px; height:550px; bottom:-120px; left:-120px; background:radial-gradient(circle,rgba(123,63,160,.16) 0%,transparent 70%); animation-delay:4s; }
.orb--c    { width:380px; height:380px; top:35%; left:32%; background:radial-gradient(circle,rgba(163,27,27,.09) 0%,transparent 70%); animation-delay:8s; }
.orb--gold { width:300px; height:300px; top:20%; right:25%; background:radial-gradient(circle,rgba(201,160,40,.1) 0%,transparent 70%); animation-delay:2s; }
@keyframes orb-pulse { 0%,100%{transform:scale(1);opacity:.7;} 50%{transform:scale(1.22);opacity:1;} }

/* Particles */
.hero__particles { position:absolute; inset:0; overflow:hidden; pointer-events:none; z-index:4; }
.hparticle {
  position:absolute; width:var(--sz); height:var(--sz);
  border-radius:50%; left:var(--x); top:var(--y);
  background: radial-gradient(circle at 30% 30%, rgba(201,160,40,.55), rgba(255,255,255,.15));
  animation:hpart var(--dur) var(--del) infinite ease-in-out;
}
@keyframes hpart {
  0%,100% { transform:translate(0,0) scale(1); opacity:.18; }
  50%      { transform:translate(16px,-28px) scale(1.4); opacity:.48; }
}

/* Corner decorations — gold tinted */
.hero__corner {
  position:absolute; width:72px; height:72px;
  border-color:rgba(201,160,40,.3); border-style:solid;
  pointer-events:none; z-index:5;
}
.hero__corner--tl { top:32px; right:32px; border-width:2px 0 0 2px; }
.hero__corner--tr { top:32px; left:32px;  border-width:2px 2px 0 0; }
.hero__corner--bl { bottom:32px; right:32px; border-width:0 0 2px 2px; }
.hero__corner--br { bottom:32px; left:32px;  border-width:0 2px 2px 0; }
.pub--ltr .hero__corner--tl { right:auto; left:32px;  border-width:2px 2px 0 0; }
.pub--ltr .hero__corner--tr { left:auto;  right:32px; border-width:2px 0 0 2px; }
.pub--ltr .hero__corner--bl { right:auto; left:32px;  border-width:0 2px 2px 0; }
.pub--ltr .hero__corner--br { left:auto;  right:32px; border-width:0 0 2px 2px; }

/* Hero inner content */
.hero__inner {
  position:relative; z-index:6; text-align:center;
  color:var(--white); padding:100px 0 80px;
}

.hero__eyebrow {
  display:flex; flex-direction:column; align-items:center; gap:16px; margin-bottom:28px;
}

/* Stamp */
.stamp__ring {
  width:88px; height:88px; border-radius:50%;
  border:1.5px solid rgba(201,160,40,.35);
  display:flex; align-items:center; justify-content:center;
  background:rgba(163,27,27,.22);
  backdrop-filter:blur(12px) saturate(140%);
  box-shadow: 0 0 0 8px rgba(201,160,40,.06), 0 8px 32px rgba(0,0,0,.4);
  transition: all var(--dur-norm) var(--ease-out);
}
.stamp__ring:hover { border-color:rgba(201,160,40,.6); box-shadow:0 0 0 12px rgba(201,160,40,.08), 0 8px 32px rgba(0,0,0,.5); }
.stamp__inner { display:flex; flex-direction:column; align-items:center; }
.stamp__text { font-size:8px; font-weight:800; letter-spacing:.2em; text-transform:uppercase; opacity:.7; color:var(--gold-light); }
.stamp__year { font-family:var(--font-display); font-size:18px; font-weight:900; line-height:1.1; color:var(--white); }

/* Kicker */
.hero__kicker {
  display:inline-flex; align-items:center; gap:10px;
  font-size:10px; font-weight:700; letter-spacing:.22em; text-transform:uppercase;
  color:rgba(201,160,40,.75);
}
.kicker__rule { width:28px; height:1px; background:currentColor; opacity:.6; }
.kicker__diamond { font-size:7px; opacity:.8; }
.kicker__text { font-size:10px; }

/* Headline */
.hero__headline { margin:0 0 32px; }
.headline__line { display:block; }
.headline__line--main {
  font-size:clamp(15px,2vw,22px); font-weight:400;
  color:rgba(255,255,255,.65); letter-spacing:.08em;
  margin-bottom:10px;
}
.headline__line--sub {
  font-family:var(--font-display);
  font-size:clamp(32px,5.5vw,68px); font-weight:900; line-height:1.1;
  text-shadow:0 4px 40px rgba(0,0,0,.5);
  letter-spacing:-.01em;
}
.headline__word { display:inline; }
.headline__separator { color:var(--gold); opacity:.7; margin:0 2px; }

/* Hero divider */
.hero__divider {
  display:flex; align-items:center; justify-content:center; gap:16px;
  margin-bottom:36px; opacity:.55;
}
.hdiv__line { width:60px; height:1px; background:linear-gradient(90deg, transparent, var(--gold)); }
.pub--ltr .hdiv__line:first-child { background:linear-gradient(90deg, var(--gold), transparent); }
.pub--ltr .hdiv__line:last-child  { background:linear-gradient(90deg, transparent, var(--gold)); }
.hdiv__ornament { color:var(--gold); font-size:10px; }

/* Hero stats */
.hero__stats { display:flex; justify-content:center; flex-wrap:wrap; gap:0; }
.hstat { display:flex; align-items:center; animation:stat-in .8s var(--ease-spring) calc(var(--i) * .12s) both; }
@keyframes stat-in { from{opacity:0;transform:translateY(20px) scale(.88);} to{opacity:1;transform:none;} }

.hstat__inner {
  text-align:center; padding:0 28px; position:relative; cursor:default;
}
.hstat__num {
  font-family:var(--font-display);
  font-size:clamp(28px,4.5vw,50px); font-weight:900; line-height:1.1; margin-bottom:6px;
  background: linear-gradient(160deg, var(--white) 20%, var(--gold-light) 100%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  filter: drop-shadow(0 2px 12px rgba(201,160,40,.3));
}
.hstat__num-val {}
.hstat__lbl   { font-size:11px; opacity:.55; letter-spacing:.07em; color:rgba(255,255,255,.7); }
.hstat__sep   { width:1px; height:40px; background:linear-gradient(to bottom,transparent,rgba(201,160,40,.3),transparent); }

/* Scroll cue */
.hero__scroll {
  position:absolute; bottom:28px; left:50%; transform:translateX(-50%);
  display:flex; flex-direction:column; align-items:center; gap:10px; z-index:6;
  background:none; border:none; color:rgba(255,255,255,.5); cursor:pointer;
  transition:all var(--dur-norm); font-family:var(--font-sans);
}
.hero__scroll:hover { color:var(--gold-light); transform:translateX(-50%) translateY(-3px); }
.scroll__label { font-size:9px; letter-spacing:.2em; text-transform:uppercase; font-weight:700; }
.scroll__arrow {
  width:34px; height:34px; border-radius:50%;
  border:1px solid rgba(255,255,255,.2); display:flex; align-items:center; justify-content:center;
  animation:scroll-bob 2.4s ease-in-out infinite;
  backdrop-filter:blur(8px); background:rgba(255,255,255,.05);
}
.hero__scroll:hover .scroll__arrow { border-color:rgba(201,160,40,.5); background:rgba(201,160,40,.1); }
@keyframes scroll-bob { 0%,100%{transform:translateY(0)} 55%{transform:translateY(6px)} }

/* ════════════════════════════════════════
   TAB NAVIGATION — Premium
   ════════════════════════════════════════ */
.tabnav {
  position: sticky; top: 0; z-index: 200;
  background: rgba(254,252,248,.95);
  backdrop-filter: blur(24px) saturate(200%);
  border-bottom: 1px solid var(--grey-100);
  box-shadow: 0 1px 0 rgba(201,160,40,.12), 0 4px 32px rgba(0,0,0,.06);
  overflow: visible;
}

/* Gold top accent line */
.tabnav::before {
  content: '';
  position: absolute; top: 0; left: 0; right: 0; height: 2px;
  background: linear-gradient(90deg, transparent, var(--gold), var(--brand), var(--gold), transparent);
  opacity: .45;
}

.tabnav__row {
  display: flex; align-items: stretch; gap: 0; padding: 0; overflow: visible;
}
.tabnav__item { position: relative; flex-shrink: 0; }

.tabtn {
  display: flex; align-items: center; gap: 9px;
  padding: 18px 24px;
  background: none; border: none;
  font-family: var(--font-sans); font-size: 14px; font-weight: 600;
  color: var(--grey-500); cursor: pointer;
  position: relative; white-space: nowrap;
  transition: all var(--dur-norm) var(--ease-out);
  border-bottom: 2px solid transparent;
}
.tabtn::after {
  content: '';
  position: absolute; bottom: -1px; left: 20%; right: 20%;
  height: 2px; border-radius: 2px 2px 0 0;
  background: linear-gradient(90deg, var(--gold), var(--brand), var(--gold));
  opacity: 0; transform: scaleX(0);
  transition: all var(--dur-norm) var(--ease-spring);
}
.tabtn:hover { color: var(--grey-900); background: var(--grey-50); }
.tabtn--on { color: var(--brand); border-bottom-color: transparent; }
.tabtn--on::after { opacity: 1; transform: scaleX(1); left: 8%; right: 8%; }

.tabtn__ico { width:20px; height:20px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.tabtn__ico svg { width:18px; height:18px; transition:transform var(--dur-norm) var(--ease-spring); }
.tabtn:hover .tabtn__ico svg { transform:scale(1.15); }
.tabtn--on .tabtn__ico svg { color:var(--brand); }
.tabtn__chevron { opacity:.4; transition:transform var(--dur-norm) var(--ease-out), opacity var(--dur-norm); flex-shrink:0; }
.tabnav__item:hover .tabtn__chevron { transform:rotate(180deg); opacity:.8; }
.tabtn--on .tabtn__chevron { color:var(--brand); opacity:.7; }
.tabtn__count {
  min-width:20px; height:20px; padding:0 6px;
  background:var(--brand-subtle); color:var(--brand);
  font-size:11px; font-weight:700; border-radius:var(--r-full);
  display:flex; align-items:center; justify-content:center;
  transition:all var(--dur-norm) var(--ease-spring);
}
.tabtn--on .tabtn__count {
  background:linear-gradient(135deg,var(--brand),var(--brand-light));
  color:var(--white);
  box-shadow:0 2px 8px var(--brand-glow);
}

/* DROPDOWN */
.tabdrop {
  position:absolute; top:calc(100% + 8px);
  right:0; min-width:270px; max-width:330px; z-index:600;
}
.pub--ltr .tabdrop { right:auto; left:0; }

.tabdrop__inner {
  background:rgba(254,252,248,.98);
  border:1px solid var(--grey-200);
  border-radius:var(--r-xl);
  box-shadow: 0 24px 72px rgba(0,0,0,.15), 0 8px 24px rgba(0,0,0,.07), 0 0 0 1px rgba(201,160,40,.08);
  overflow:hidden; padding:10px 0;
  backdrop-filter: blur(20px);
}

.tabdrop__header {
  display:flex; align-items:center; gap:10px; padding:10px 18px 8px;
  font-size:10px; font-weight:800; letter-spacing:.14em; text-transform:uppercase;
  color:var(--grey-400);
}
.tabdrop__header-ico { font-size:16px; }
.tabdrop__divider { height:1px; background:linear-gradient(90deg,transparent,var(--grey-200),transparent); margin:4px 14px; }

.tabdrop__item {
  display:flex; align-items:center; gap:10px;
  width:100%; padding:10px 18px;
  background:none; border:none;
  font-family:var(--font-sans); font-size:13.5px; font-weight:500;
  color:var(--grey-700); cursor:pointer;
  transition:all var(--dur-fast);
  text-align:right; position:relative;
}
.pub--ltr .tabdrop__item { text-align:left; }
.tabdrop__item::before {
  content:'';
  position:absolute; right:0; top:4px; bottom:4px; width:2px;
  background:var(--brand); border-radius:2px;
  transform:scaleY(0); transition:transform var(--dur-fast) var(--ease-spring);
}
.pub--ltr .tabdrop__item::before { right:auto; left:0; }
.tabdrop__item:hover { background:var(--grey-50); color:var(--brand); padding-right:22px; }
.pub--ltr .tabdrop__item:hover { padding-right:18px; padding-left:22px; }
.tabdrop__item:hover::before { transform:scaleY(1); }
.tabdrop__item--on { background:var(--brand-subtle); color:var(--brand); font-weight:700; }
.tabdrop__item--on::before { transform:scaleY(1); }

.tabdrop__item-ico { width:20px; height:20px; flex-shrink:0; display:flex; align-items:center; justify-content:center; color:var(--grey-400); }
.tabdrop__item-ico svg { width:14px; height:14px; }
.tabdrop__item--on .tabdrop__item-ico { color:var(--brand); }
.tabdrop__item-name { flex:1; }
.tabdrop__item-count {
  font-size:11px; color:var(--grey-400);
  background:var(--grey-100); padding:2px 8px; border-radius:var(--r-full);
  font-weight:700;
}
.tabdrop__item--on .tabdrop__item-count { background:var(--brand); color:var(--white); }

.tabdrop__topics-list {
  max-height:270px; overflow-y:auto;
  scrollbar-width:thin; scrollbar-color:var(--grey-200) transparent;
}
.tabdrop__topics-list::-webkit-scrollbar { width:3px; }
.tabdrop__topics-list::-webkit-scrollbar-thumb { background:var(--grey-200); border-radius:2px; }
.tabdrop__empty { padding:22px 18px; text-align:center; color:var(--grey-400); font-size:13px; }

/* Memories dropdown */
.tabdrop--memories .tabdrop__inner { min-width:310px; max-height:460px; overflow-y:auto; }
.tabdrop__mem-section { padding:4px 0; }
.tabdrop__mem-section + .tabdrop__mem-section { border-top:1px solid var(--grey-100); margin-top:4px; padding-top:8px; }
.tabdrop__mem-section-title {
  display:flex; align-items:center; gap:6px; padding:6px 18px 4px;
  font-size:10px; font-weight:800; letter-spacing:.12em; text-transform:uppercase; color:var(--grey-400);
}
.tabdrop__sec-count { margin-right:auto; background:var(--grey-100); color:var(--grey-500); font-size:10px; padding:1px 7px; border-radius:var(--r-full); }
.tabdrop__item--mem { gap:10px; padding:8px 16px; }
.tabdrop__mem-cover { width:40px; height:40px; border-radius:var(--r-sm); overflow:hidden; flex-shrink:0; position:relative; background:var(--grey-100); }
.tabdrop__mem-cover img { width:100%; height:100%; object-fit:cover; transition:transform var(--dur-norm); }
.tabdrop__item--mem:hover .tabdrop__mem-cover img { transform:scale(1.1); }
.tabdrop__mem-play {
  position:absolute; inset:0; background:rgba(0,0,0,.45);
  display:flex; align-items:center; justify-content:center;
  font-size:10px; color:var(--white); opacity:0; transition:opacity var(--dur-fast);
}
.tabdrop__item--mem:hover .tabdrop__mem-play { opacity:1; }
.tabdrop__mem-badge { font-size:13px; flex-shrink:0; }

/* ════════════════════════════════════════
   BODY / GRID
   ════════════════════════════════════════ */
.body { padding:44px 0 88px; background:var(--white); }

/* Active filter pill */
.active-filter { margin-bottom:28px; }
.afilt {
  display:inline-flex; align-items:center; gap:10px;
  padding:8px 16px; background:var(--brand-subtle);
  border:1px solid rgba(163,27,27,.18); border-radius:var(--r-full);
  box-shadow:0 2px 12px var(--brand-glow);
}
.afilt__dot { width:7px; height:7px; border-radius:50%; background:var(--brand); flex-shrink:0; animation:pulse-dot 2s ease-in-out infinite; }
@keyframes pulse-dot { 0%,100%{box-shadow:0 0 0 0 var(--brand-glow)} 50%{box-shadow:0 0 0 5px transparent} }
.afilt__label { font-size:13px; font-weight:700; color:var(--brand); }
.afilt__x { background:none; border:none; color:var(--brand); cursor:pointer; font-size:13px; opacity:.55; padding:0; transition:opacity var(--dur-fast); font-weight:700; }
.afilt__x:hover { opacity:1; }

/* Toolbar */
.toolbar {
  display:flex; justify-content:space-between; align-items:center;
  margin-bottom:32px; padding-bottom:18px;
  border-bottom:1px solid var(--grey-100);
}
.toolbar__left { display:flex; align-items:center; gap:9px; }
.toolbar__indicator { width:7px; height:7px; border-radius:50%; flex-shrink:0; }
.ind--ok { background:#22C55E; box-shadow:0 0 8px rgba(34,197,94,.5); animation:pulse-dot 3s ease-in-out infinite; }
.toolbar__label { font-size:14px; color:var(--grey-500); }
.toolbar__label strong { color:var(--grey-900); font-weight:700; }

.tsort { position:relative; display:flex; align-items:center; }
.tsort__sel {
  appearance:none; padding:9px 36px 9px 16px;
  background:var(--white); border:1.5px solid var(--grey-200);
  border-radius:var(--r-full); font-family:var(--font-sans); font-size:13px;
  font-weight:600; color:var(--grey-700); cursor:pointer;
  transition:all var(--dur-norm);
}
.tsort__sel:focus { outline:none; border-color:var(--gold); box-shadow:0 0 0 3px var(--gold-subtle); }
.tsort__ico { position:absolute; left:12px; pointer-events:none; color:var(--grey-400); }
.pub--ltr .tsort__ico { left:auto; right:12px; }

/* ── GRID ── */
.grid {
  display:grid; gap:24px;
  grid-template-columns:repeat(auto-fill, minmax(270px, 1fr));
}
@media (min-width:1024px) { .grid { grid-template-columns:repeat(4,1fr); } }

/* ── CARD ── */
.card {
  background:var(--white); 
  border:1.5px solid var(--grey-100);
  border-radius:var(--r-lg); overflow:hidden; cursor:pointer;
  transition: transform var(--dur-norm) var(--ease-out),
              box-shadow var(--dur-norm) var(--ease-out),
              border-color var(--dur-norm);
  display:flex; flex-direction:column;
  box-shadow:var(--shadow-card);
  animation: card-in var(--dur-slow) var(--ease-out) var(--d,0s) both;
}
@keyframes card-in { from{opacity:0;transform:translateY(24px) scale(.97);} to{opacity:1;transform:none;} }
.card:hover {
  transform:translateY(-7px);
  box-shadow:var(--shadow-card-h);
  border-color:var(--grey-200);
}
.card:focus-visible { outline:2.5px solid var(--gold); outline-offset:3px; }

/* Featured card */
.card--featured { grid-column:span 2; }
@media (max-width:768px) { .card--featured { grid-column:span 1; } }

/* Thumbnail */
.card__thumb {
  position:relative; aspect-ratio:3/2; overflow:hidden; flex-shrink:0;
}
.card--featured .card__thumb { aspect-ratio:16/9; }
.card__img {
  position:absolute; inset:0; width:100%; height:100%;
  object-fit:cover; transition:transform 600ms var(--ease-out), opacity var(--dur-norm);
}
.card__img--main  { opacity:1; }
.card__img--hover { opacity:0; }
.card:hover .card__img--main  { transform:scale(1.07); }
.card:hover .card__img--hover { opacity:1; }

.card__film {
  position:absolute; inset:0; pointer-events:none;
  background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,.025) 2px,rgba(0,0,0,.025) 4px);
}
.card__scrim {
  position:absolute; inset:0; pointer-events:none;
  background:linear-gradient(to bottom,transparent 50%,rgba(0,0,0,.55) 100%);
  opacity:0; transition:opacity var(--dur-norm);
}
.card:hover .card__scrim { opacity:1; }

/* Badges */
.card__badges {
  position:absolute; top:12px; right:12px;
  display:flex; flex-direction:column; gap:5px; align-items:flex-end;
  z-index:2;
}
.pub--ltr .card__badges { right:auto; left:12px; align-items:flex-start; }
.card__typebadge {
  padding:4px 11px;
  background:linear-gradient(135deg,var(--brand-dark),var(--brand));
  color:var(--white); font-size:10px; font-weight:800; letter-spacing:.04em;
  border-radius:var(--r-full);
  box-shadow:0 2px 10px rgba(0,0,0,.3);
}
.card__mediabadge {
  padding:3px 9px; background:rgba(0,0,0,.58); backdrop-filter:blur(8px);
  color:var(--white); font-size:10px; border-radius:var(--r-full);
}
.card__countbadge {
  position:absolute; bottom:12px; left:12px; z-index:2;
  padding:4px 10px; background:rgba(0,0,0,.62); backdrop-filter:blur(8px);
  color:var(--white); font-size:10px; font-weight:700; border-radius:var(--r-full);
  border:1px solid rgba(255,255,255,.1);
}
.pub--ltr .card__countbadge { left:auto; right:12px; }
.card__memorybadge {
  position:absolute; top:12px; left:12px; z-index:2;
  width:28px; height:28px; border-radius:50%;
  background:linear-gradient(135deg,var(--mem-purple),var(--brand));
  display:flex; align-items:center; justify-content:center;
  font-size:13px; box-shadow:0 3px 14px rgba(123,63,160,.5);
}
.pub--ltr .card__memorybadge { left:auto; right:12px; }

/* Gold accent bar — reveals on hover */
.card__accent {
  position:absolute; bottom:0; left:0; right:0; height:2.5px;
  background:linear-gradient(90deg, var(--gold-dark), var(--gold), var(--brand), var(--gold));
  transform:scaleX(0); transform-origin:right;
  transition:transform var(--dur-slow) var(--ease-out);
  z-index:3;
}
.pub--ltr .card__accent { transform-origin:left; }
.card:hover .card__accent { transform:scaleX(1); }

/* View overlay */
.card__view {
  position:absolute; inset:0; display:flex; align-items:center; justify-content:center;
  opacity:0; transition:opacity var(--dur-norm); z-index:2;
}
.card:hover .card__view { opacity:1; }
.card__viewbtn {
  display:flex; align-items:center; gap:8px;
  padding:12px 22px;
  background:rgba(254,252,248,.96); color:var(--grey-900);
  font-size:13px; font-weight:800; border-radius:var(--r-full);
  box-shadow:0 8px 32px rgba(0,0,0,.25);
  transform:translateY(10px) scale(.94);
  transition:all var(--dur-norm) var(--ease-spring);
  border:1px solid rgba(201,160,40,.25);
}
.card:hover .card__viewbtn { transform:translateY(0) scale(1); }

/* Card body */
.card__body { padding:18px 20px 14px; flex:1; display:flex; flex-direction:column; }
.card__meta { display:flex; flex-wrap:wrap; gap:6px; align-items:center; margin-bottom:9px; }
.card__date { font-size:11px; color:var(--grey-400); letter-spacing:.02em; }
.card__lang {
  padding:2px 8px; background:var(--grey-100);
  font-size:10px; font-weight:700; color:var(--grey-600); border-radius:var(--r-full);
  border:1px solid var(--grey-200);
}
.card__title {
  font-family:var(--font-display); font-size:17px; font-weight:700;
  line-height:1.35; margin:0 0 8px; color:var(--grey-900);
  display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;
  transition:color var(--dur-fast);
}
.card:hover .card__title { color:var(--brand-dark); }
.card--featured .card__title { font-size:22px; }
.card__desc {
  font-size:13px; line-height:1.68; color:var(--grey-500);
  margin:0 0 12px; flex:1;
  display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;
}
.card__extra { margin-bottom:8px; }
.card__extra-val { font-size:12px; color:var(--grey-400); font-weight:500; }
.card__tags { display:flex; flex-wrap:wrap; gap:5px; }
.ctag {
  padding:2px 9px;
  background:var(--brand-subtle); color:var(--brand);
  font-size:10px; font-weight:700; border-radius:var(--r-full);
  border:1px solid rgba(163,27,27,.12);
  transition:all var(--dur-fast);
}
.ctag:hover { background:var(--brand); color:var(--white); }
.ctag--more { background:var(--grey-100); color:var(--grey-500); border-color:var(--grey-200); }

/* Card footer */
.card__foot {
  display:flex; align-items:center; justify-content:space-between;
  padding:11px 20px 16px; border-top:1px solid var(--grey-100); margin-top:auto;
}
.card__cta { font-size:12px; font-weight:800; color:var(--brand); letter-spacing:.03em; }
.card__arrow { font-size:16px; color:var(--gold); transition:transform var(--dur-norm) var(--ease-spring); }
.card:hover .card__arrow { transform:translateX(-5px); }
.pub--ltr .card:hover .card__arrow { transform:translateX(5px); }

/* ── SKELETONS ── */
.skel { border-radius:var(--r-lg); overflow:hidden; background:var(--white); border:1.5px solid var(--grey-100); animation:sk-in var(--dur-norm) var(--ease-out) var(--d,0s) both; }
@keyframes sk-in { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:none} }
.skel__thumb { aspect-ratio:3/2; }
.skel__body  { padding:18px; display:flex; flex-direction:column; gap:10px; }
.skel__line  { height:13px; border-radius:var(--r-sm); }
.skel__pills { display:flex; gap:8px; }
.skel__pill  { height:22px; width:64px; border-radius:var(--r-full); }
.shimmer {
  background:linear-gradient(90deg,var(--grey-100) 25%,var(--grey-200) 50%,var(--grey-100) 75%);
  background-size:400% 100%; animation:shimmer 1.5s infinite;
}
@keyframes shimmer { 0%{background-position:100% 0} 100%{background-position:-100% 0} }

/* ── EMPTY STATE ── */
.empty { text-align:center; padding:96px 24px; }
.empty__icon  { font-size:56px; margin-bottom:20px; filter:drop-shadow(0 4px 12px rgba(0,0,0,.12)); }
.empty__title { font-family:var(--font-display); font-size:24px; font-weight:700; color:var(--grey-700); margin:0 0 10px; }
.empty__hint  { font-size:15px; color:var(--grey-400); margin:0 0 28px; line-height:1.6; }
.btn-primary {
  display:inline-flex; align-items:center; gap:9px;
  padding:13px 28px;
  background:linear-gradient(135deg,var(--brand-dark),var(--brand),var(--brand-light));
  color:var(--white); font-family:var(--font-sans); font-size:14px; font-weight:800;
  border:none; border-radius:var(--r-full); cursor:pointer;
  box-shadow:0 6px 24px var(--brand-glow); transition:all var(--dur-norm) var(--ease-out);
  letter-spacing:.03em;
}
.btn-primary:hover { transform:translateY(-2px) scale(1.02); box-shadow:0 10px 32px var(--brand-glow); }

/* ── PAGINATION ── */
.pager {
  display:flex; align-items:center; justify-content:center; gap:20px;
  margin-top:56px; padding-top:36px; border-top:1px solid var(--grey-100);
}
.pager__btn {
  padding:10px 24px; background:var(--white); border:1.5px solid var(--grey-200);
  border-radius:var(--r-full); font-family:var(--font-sans); font-size:13px; font-weight:700;
  color:var(--grey-700); cursor:pointer; transition:all var(--dur-norm) var(--ease-out);
}
.pager__btn:hover:not(:disabled) { border-color:var(--gold); color:var(--brand); background:var(--gold-subtle); }
.pager__btn:disabled { opacity:.3; cursor:not-allowed; }
.pager__dots { display:flex; gap:7px; align-items:center; }
.pager__dot {
  width:8px; height:8px; border-radius:50%; background:var(--grey-200);
  cursor:pointer; transition:all var(--dur-norm) var(--ease-spring);
}
.pager__dot--on {
  background:linear-gradient(90deg,var(--gold),var(--brand));
  transform:scale(1.3); width:24px; border-radius:4px;
  box-shadow:0 2px 8px var(--brand-glow);
}

/* ════════════════════════════════════════
   DETAIL VIEW
   ════════════════════════════════════════ */
.detail { background:var(--white); min-height:100vh; }

/* Sticky nav */
.dnav {
  position:sticky; top:0; z-index:200;
  background:rgba(254,252,248,.94); backdrop-filter:blur(24px) saturate(200%);
  border-bottom:1px solid var(--grey-100);
  box-shadow:0 1px 0 rgba(201,160,40,.1), 0 3px 16px rgba(0,0,0,.05);
}
.dnav::before {
  content:''; position:absolute; top:0; left:0; right:0; height:2px;
  background:linear-gradient(90deg,transparent,var(--gold),var(--brand),var(--gold),transparent);
  opacity:.4;
}
.dnav__inner { display:flex; align-items:center; justify-content:space-between; padding:14px 0; }

.back-btn {
  display:flex; align-items:center; gap:8px;
  padding:9px 20px; background:var(--grey-100);
  border:1.5px solid var(--grey-200); border-radius:var(--r-full);
  font-family:var(--font-sans); font-size:13px; font-weight:700;
  color:var(--grey-700); cursor:pointer; transition:all var(--dur-norm) var(--ease-out);
}
.back-btn:hover { background:var(--brand); color:var(--white); border-color:var(--brand); box-shadow:0 4px 16px var(--brand-glow); }
.back-btn svg { transition:transform var(--dur-norm) var(--ease-spring); }
.back-btn:hover svg { transform:translateX(4px); }
.pub--ltr .back-btn svg { transform:scaleX(-1); }
.pub--ltr .back-btn:hover svg { transform:scaleX(-1) translateX(4px); }

.dnav__right { display:flex; align-items:center; gap:12px; flex-wrap:wrap; }
.dtype-pill {
  padding:7px 16px;
  background:linear-gradient(135deg,var(--brand-dark),var(--brand));
  color:var(--white); font-size:12px; font-weight:800; border-radius:var(--r-full);
  box-shadow:0 3px 12px var(--brand-glow);
}
.langpills { display:flex; gap:6px; }
.langpill {
  display:flex; align-items:center; gap:5px;
  padding:6px 12px; border-radius:var(--r-full);
  background:var(--grey-100); border:1.5px solid var(--grey-200);
  font-size:11px; font-weight:700; color:var(--grey-600);
  transition:all var(--dur-norm);
}
.langpill--on { background:var(--gold-subtle); border-color:var(--gold); color:var(--grey-800); }
.langpill__dot { width:6px; height:6px; border-radius:50%; background:var(--grey-300); }
.lpdot--ckb { background:var(--brand); }
.lpdot--kmr { background:#1a5276; }

/* Detail hero */
.dhero {
  position:relative; min-height:75vh;
  display:flex; align-items:flex-end; overflow:hidden;
  background:var(--deep-1);
}
.dhero__bg {
  position:absolute; inset:-8%;
  background-size:cover; background-position:center;
  filter:blur(2.5px) saturate(.65) brightness(.8);
  transform:scale(1.14);
  transition:filter 1s var(--ease-soft);
}
.dhero__gradient {
  position:absolute; inset:0;
  background:linear-gradient(155deg, rgba(8,6,3,.85) 0%, rgba(8,6,3,.52) 40%, rgba(8,6,3,.92) 100%);
}
.dhero__gradient--side {
  background:linear-gradient(90deg, rgba(8,6,3,.7) 0%, transparent 60%);
}
.pub--ltr .dhero__gradient--side { background:linear-gradient(270deg, rgba(8,6,3,.7) 0%, transparent 60%); }
.dhero__grain {
  position:absolute; inset:0;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.042'/%3E%3C/svg%3E");
  background-size:256px; pointer-events:none;
}
.dhero__scanlines {
  position:absolute; inset:0;
  background:repeating-linear-gradient(transparent,transparent 2px,rgba(255,255,255,.009) 2px,rgba(255,255,255,.009) 4px);
  pointer-events:none;
}

/* Gold lines above/below content */
.dhero__gold-line {
  position:absolute; left:0; right:0; height:1px;
  background:linear-gradient(90deg, transparent, rgba(201,160,40,.4) 30%, rgba(163,27,27,.35) 50%, rgba(201,160,40,.4) 70%, transparent);
  z-index:3;
}
.dhero__gold-line--top { top:72px; }
.dhero__gold-line--bottom { bottom:48px; }

.dhero__frame {
  position:absolute; width:68px; height:68px;
  border-color:rgba(201,160,40,.25); border-style:solid; z-index:3;
}
.dhero__frame--tl { top:24px; right:24px; border-width:2px 0 0 2px; }
.dhero__frame--br { bottom:24px; left:24px; border-width:0 2px 2px 0; }
.pub--ltr .dhero__frame--tl { right:auto; left:24px; border-width:2px 2px 0 0; }
.pub--ltr .dhero__frame--br { left:auto; right:24px; border-width:0 0 2px 2px; }

.dhero__content {
  position:relative; z-index:4;
  display:grid; grid-template-columns:1fr auto; gap:56px;
  align-items:end; padding-top:90px; padding-bottom:64px; color:var(--white);
}
@media (max-width:768px) { .dhero__content { grid-template-columns:1fr; } }

.dhero__badges { display:flex; flex-wrap:wrap; gap:8px; margin-bottom:18px; }
.dbadge {
  padding:5px 13px;
  background:rgba(255,255,255,.1); backdrop-filter:blur(10px);
  color:rgba(255,255,255,.88); font-size:11px; font-weight:700;
  border-radius:var(--r-full); border:1px solid rgba(255,255,255,.14);
  letter-spacing:.03em;
}
.dbadge--type { background:linear-gradient(135deg,rgba(163,27,27,.65),rgba(201,64,58,.5)); border-color:rgba(163,27,27,.4); }
.dbadge--mem  { background:linear-gradient(135deg,rgba(123,63,160,.6),rgba(163,27,27,.4)); border-color:rgba(123,63,160,.35); }

.dhero__title {
  font-family:var(--font-display); font-size:clamp(28px,4.2vw,52px);
  font-weight:900; line-height:1.12; margin:0 0 16px;
  text-shadow:0 4px 40px rgba(0,0,0,.6);
}
.dhero__desc { font-size:16px; line-height:1.78; margin:0 0 22px; opacity:.82; max-width:580px; }
.dhero__stats { display:flex; flex-wrap:wrap; gap:10px; margin-bottom:22px; }
.dstat {
  display:flex; align-items:center; gap:7px; padding:9px 16px;
  background:rgba(255,255,255,.09); backdrop-filter:blur(12px);
  border:1px solid rgba(255,255,255,.13); border-radius:var(--r-full);
  font-size:13px; transition:all var(--dur-norm);
}
.dstat:hover { background:rgba(201,160,40,.15); border-color:rgba(201,160,40,.3); }
.dstat__ico { font-size:15px; }
.dstat__val { font-weight:700; }
.dstat__lbl { opacity:.65; }
.dhero__tags { display:flex; flex-wrap:wrap; gap:7px; }
.dtag {
  padding:5px 12px; background:rgba(255,255,255,.09);
  backdrop-filter:blur(8px); color:rgba(255,255,255,.82);
  font-size:11px; font-weight:600; border-radius:var(--r-full);
  border:1px solid rgba(255,255,255,.13); transition:all var(--dur-norm);
}
.dtag:hover { background:rgba(163,27,27,.45); border-color:rgba(163,27,27,.4); color:var(--white); }

/* ── 3D MOCKUPS ── */
.dhero__right { display:flex; align-items:center; justify-content:center; padding-bottom:20px; }

.mockup-sound { position:relative; width:200px; height:220px; }
.msound__case {
  position:absolute; top:0; right:0; width:162px; height:182px;
  display:flex; border-radius:var(--r-md); overflow:hidden;
  box-shadow:0 24px 64px rgba(0,0,0,.65), -10px 10px 24px rgba(0,0,0,.45);
}
.msound__spine { width:22px; background:linear-gradient(180deg,rgba(0,0,0,.45) 0%,rgba(255,255,255,.1) 50%,rgba(0,0,0,.45) 100%); flex-shrink:0; }
.msound__front { flex:1; position:relative; }
.msound__front img { width:100%; height:100%; object-fit:cover; }
.msound__overlay { position:absolute; inset:0; background:linear-gradient(135deg,rgba(255,255,255,.14) 0%,transparent 55%); }
.msound__disc {
  position:absolute; bottom:-22px; left:-22px; width:124px; height:124px;
  border-radius:50%; overflow:hidden;
  box-shadow:0 16px 48px rgba(0,0,0,.65);
  animation:disc-spin 14s linear infinite paused;
}
.msound__disc-ring {
  position:absolute; inset:0; border-radius:50%;
  background:conic-gradient(from 0deg,#1a1028,#2d1860,#0d3a3a,#2a5540,#2d1860,#1a1028);
}
.msound__disc-art { position:absolute; inset:16px; border-radius:50%; overflow:hidden; }
.msound__disc-art img { width:100%; height:100%; object-fit:cover; }
.msound__disc-hole {
  position:absolute; top:50%; left:50%; transform:translate(-50%,-50%);
  width:20px; height:20px; border-radius:50%;
  background:var(--grey-100); box-shadow:0 0 0 2.5px rgba(0,0,0,.35), inset 0 1px 3px rgba(0,0,0,.3);
}

.mockup-book { position:relative; width:162px; height:204px; perspective:700px; }
.mbook__spine {
  position:absolute; top:0; right:0; width:22px; height:100%;
  background:linear-gradient(180deg,rgba(0,0,0,.45) 0%,rgba(255,255,255,.12) 50%,rgba(0,0,0,.45) 100%);
  border-radius:0 var(--r-sm) var(--r-sm) 0;
  box-shadow:-5px 0 20px rgba(0,0,0,.45);
}
.mbook__cover {
  position:absolute; top:0; left:0; width:calc(100% - 22px); height:100%;
  border-radius:var(--r-sm) 0 0 var(--r-sm); overflow:hidden;
  box-shadow:-14px 14px 48px rgba(0,0,0,.65);
}
.mbook__cover img { width:100%; height:100%; object-fit:cover; }
.mbook__sheen { position:absolute; inset:0; background:linear-gradient(135deg,rgba(255,255,255,.2) 0%,transparent 50%); }
.mbook__pages {
  position:absolute; top:4px; right:-8px; bottom:4px; width:14px;
  background:repeating-linear-gradient(0deg,var(--grey-100),var(--grey-100) 1px,var(--grey-50) 1px,var(--grey-50) 3px);
  border-radius:0 2px 2px 0; box-shadow:4px 0 12px rgba(0,0,0,.22);
}

.mockup-video { display:flex; flex-direction:column; align-items:center; gap:4px; }
.mvideo__frame {
  width:244px; aspect-ratio:16/9;
  border-radius:var(--r-md) var(--r-md) 0 0; overflow:hidden;
  box-shadow:0 20px 56px rgba(0,0,0,.65);
  position:relative; background:var(--grey-900);
  border:4px solid rgba(255,255,255,.08); border-bottom:none;
}
.mvideo__frame img { width:100%; height:100%; object-fit:cover; opacity:.88; }
.mvideo__play-ico {
  position:absolute; top:50%; left:50%; transform:translate(-50%,-50%);
  width:58px; height:58px; border-radius:50%;
  background:rgba(254,252,248,.92); color:var(--brand);
  display:flex; align-items:center; justify-content:center;
  font-size:20px; padding-right:3px;
  box-shadow:0 8px 28px rgba(0,0,0,.45), 0 0 0 8px rgba(255,255,255,.08);
}
.mvideo__stand {
  width:42px; height:20px;
  background:linear-gradient(180deg,rgba(255,255,255,.1) 0%,rgba(0,0,0,.3) 100%);
  clip-path:polygon(20% 0,80% 0,100% 100%,0 100%);
}

.mockup-image { padding:8px; }
.mimage__frame {
  width:204px; aspect-ratio:4/3; padding:14px;
  background:rgba(254,252,248,.95); border-radius:var(--r-md);
  box-shadow:0 24px 64px rgba(0,0,0,.6), 0 0 0 1px rgba(201,160,40,.15), inset 0 0 0 1px rgba(0,0,0,.08);
}
.mimage__mat {
  width:100%; height:100%; padding:8px;
  background:var(--grey-50); border-radius:var(--r-xs);
  border:1px solid var(--grey-200);
}
.mimage__photo { width:100%; height:100%; overflow:hidden; border-radius:2px; }
.mimage__photo img { width:100%; height:100%; object-fit:cover; }

/* ════════════════════════════════════════
   SOUND: STREAM SECTION
   ════════════════════════════════════════ */
.stream-section { padding:64px 0; background:var(--grey-50); }
.stream-layout {
  display:grid; grid-template-columns:1fr 310px; gap:44px; align-items:start;
}
@media (max-width:900px) { .stream-layout { grid-template-columns:1fr; } }

.stream-head {
  display:flex; align-items:center; justify-content:space-between; margin-bottom:26px;
}
.section-heading {
  font-family:var(--font-display); font-size:24px; font-weight:800; color:var(--grey-900);
  margin:0; position:relative; padding-bottom:10px;
}
.section-heading::after {
  content:''; position:absolute; bottom:0; right:0; width:40px; height:3px;
  background:linear-gradient(90deg, var(--gold), var(--brand));
  border-radius:2px;
}
.pub--ltr .section-heading::after { right:auto; left:0; }
.stream-count {
  font-size:13px; font-weight:700; color:var(--grey-400);
  background:var(--white); padding:6px 14px; border-radius:var(--r-full);
  border:1.5px solid var(--grey-200); box-shadow:var(--shadow-sm);
}

/* Track list */
.track-list { display:flex; flex-direction:column; gap:5px; margin-bottom:24px; }
.track {
  display:grid;
  grid-template-columns:32px 48px 20px 1fr 1fr 88px;
  gap:12px; align-items:center;
  padding:13px 18px; border-radius:var(--r-md);
  background:var(--white); border:1.5px solid var(--grey-100);
  cursor:pointer; transition:all var(--dur-norm) var(--ease-out);
  position:relative; overflow:hidden;
}
.track::before {
  content:'';
  position:absolute; right:0; top:0; bottom:0; width:3px;
  background:linear-gradient(to bottom, var(--gold), var(--brand));
  transform:scaleY(0); transition:transform var(--dur-norm) var(--ease-spring);
  border-radius:2px 0 0 2px;
}
.pub--ltr .track::before { right:auto; left:0; border-radius:0 2px 2px 0; }
.track:hover { background:var(--brand-subtle); border-color:rgba(163,27,27,.2); transform:translateX(-4px); }
.track:hover::before { transform:scaleY(1); }
.pub--ltr .track:hover { transform:translateX(4px); }
.track--selected { background:var(--brand-subtle); border-color:rgba(163,27,27,.25); }
.track--selected::before { transform:scaleY(1); }
.track--playing  { background:linear-gradient(135deg,rgba(163,27,27,.07) 0%,rgba(201,64,58,.04) 100%); }

.track__num { font-size:12px; font-weight:700; color:var(--grey-400); text-align:center; font-family:var(--font-display); }
.track--selected .track__num, .track--playing .track__num { color:var(--brand); }

.track__cover {
  width:44px; height:44px; border-radius:var(--r-sm);
  overflow:hidden; flex-shrink:0; position:relative;
  box-shadow:var(--shadow-sm);
}
.track__cover img { width:100%; height:100%; object-fit:cover; }
.track__play-ico {
  position:absolute; inset:0; background:rgba(163,27,27,.72);
  display:flex; align-items:center; justify-content:center;
  color:var(--white); font-size:14px;
  opacity:0; transition:opacity var(--dur-fast);
}
.track:hover .track__play-ico,
.track--selected .track__play-ico { opacity:1; }
.track__indicator { display:flex; gap:2px; align-items:center; }
.track__bar {
  width:3px; height:10px; background:var(--grey-200);
  border-radius:2px; transition:background var(--dur-fast);
}
.track__bar--live {
  background:var(--brand);
  animation:track-pulse 0.55s calc(var(--b) * 0.12s) infinite alternate;
}
@keyframes track-pulse { from{height:4px} to{height:20px} }
.track__info { min-width:0; }
.track__title { font-size:14px; font-weight:700; color:var(--grey-900); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.track__sub   { font-size:11px; color:var(--grey-400); font-weight:500; margin-top:1px; }

/* Waveform */
.wave-wrap { display:flex; gap:1.5px; align-items:center; height:28px; }
.wbar {
  width:2px; border-radius:1px; flex-shrink:0;
  background:var(--grey-200); height:calc(var(--h) * 24px);
  transition:background var(--dur-fast);
}
.wave-wrap--live .wbar {
  background:linear-gradient(to top, var(--brand-dark), var(--brand-light));
  animation:wavebar .45s calc(var(--bi) * 0.018s) infinite alternate;
  opacity:.8;
}
@keyframes wavebar { from{transform:scaleY(.5)} to{transform:scaleY(1)} }
.track__right { display:flex; flex-direction:column; gap:3px; align-items:flex-end; }
.track__dur  { font-size:12px; font-weight:700; color:var(--grey-600); font-family:var(--font-display); }
.track__size { font-size:10px; color:var(--grey-400); }

/* Audio player bar — premium dark */
.audio-bar {
  display:grid;
  grid-template-columns:54px 1fr auto 1fr auto;
  gap:18px; align-items:center;
  padding:18px 22px;
  background:linear-gradient(135deg, var(--deep-2), var(--deep-3));
  border-radius:var(--r-xl);
  box-shadow:0 12px 40px rgba(0,0,0,.28), 0 0 0 1px rgba(201,160,40,.12);
  position:relative; overflow:hidden;
}
.audio-bar::before {
  content:'';
  position:absolute; top:0; left:0; right:0; height:1.5px;
  background:linear-gradient(90deg, transparent, var(--gold), var(--brand), var(--gold), transparent);
  opacity:.5;
}
.audio-bar__cover {
  width:46px; height:46px; border-radius:var(--r-sm);
  overflow:hidden; position:relative; flex-shrink:0;
  box-shadow:0 4px 14px rgba(0,0,0,.4);
}
.audio-bar__cover img { width:100%; height:100%; object-fit:cover; }
.audio-bar__vinyl {
  position:absolute; inset:0; border-radius:50%;
  background:conic-gradient(rgba(0,0,0,.35),transparent,rgba(0,0,0,.35));
  opacity:0;
}
.audio-bar__vinyl--spin { opacity:1; animation:vinyl-spin 2.5s linear infinite; }
@keyframes vinyl-spin { to{transform:rotate(360deg)} }
.audio-bar__info { min-width:0; }
.audio-bar__title { font-size:13px; font-weight:700; color:var(--white); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.audio-bar__album { font-size:11px; color:var(--grey-500); margin-top:2px; }
.audio-bar__controls { display:flex; align-items:center; gap:8px; flex-shrink:0; }
.abtn {
  width:36px; height:36px; border-radius:50%;
  background:rgba(255,255,255,.09); border:1px solid rgba(255,255,255,.13);
  color:var(--white); font-size:13px; cursor:pointer;
  display:flex; align-items:center; justify-content:center;
  transition:all var(--dur-norm) var(--ease-spring);
}
.abtn:hover:not(:disabled) { background:rgba(255,255,255,.18); transform:scale(1.08); }
.abtn:disabled { opacity:.25; cursor:not-allowed; }
.abtn--play {
  width:44px; height:44px;
  background:linear-gradient(135deg,var(--brand-dark),var(--brand-light));
  border:none; font-size:17px;
  box-shadow:0 4px 18px var(--brand-glow), 0 0 0 6px rgba(163,27,27,.12);
}
.abtn--play:hover { transform:scale(1.12); box-shadow:0 6px 24px var(--brand-glow), 0 0 0 8px rgba(163,27,27,.15); }

.audio-bar__prog-wrap {
  flex:1; height:36px; display:flex; align-items:center; cursor:pointer;
}
.audio-bar__prog-track {
  width:100%; height:3px; background:rgba(255,255,255,.12);
  border-radius:2px; position:relative;
}
.audio-bar__prog-fill {
  height:100%; background:linear-gradient(90deg,var(--gold-dark),var(--gold),var(--brand));
  border-radius:2px; transition:width .12s linear;
}
.audio-bar__prog-thumb {
  position:absolute; top:50%; transform:translate(-50%,-50%);
  width:12px; height:12px; border-radius:50%;
  background:var(--gold); box-shadow:0 0 0 3px rgba(201,160,40,.3);
  transition:left .12s linear, transform var(--dur-fast);
}
.audio-bar__prog-wrap:hover .audio-bar__prog-thumb { transform:translate(-50%,-50%) scale(1.4); }
.audio-bar__time { font-size:11px; color:var(--grey-400); white-space:nowrap; font-weight:700; font-family:var(--font-display); }

/* Side panel */
.stream-side { display:flex; flex-direction:column; gap:26px; }
.side-heading { font-size:10px; font-weight:800; letter-spacing:.14em; text-transform:uppercase; color:var(--grey-400); margin:0 0 14px; }
.side-cover { position:relative; border-radius:var(--r-lg); overflow:hidden; margin-bottom:18px; box-shadow:var(--shadow-lg); }
.side-cover img { width:100%; aspect-ratio:1; object-fit:cover; display:block; }
.side-cover__overlay {
  position:absolute; inset:0;
  background:linear-gradient(to bottom,transparent 45%,rgba(0,0,0,.85) 100%);
  display:flex; align-items:flex-end; padding:16px;
}
.side-cover__title { color:var(--white); font-family:var(--font-display); font-size:15px; font-weight:700; line-height:1.3; }
.side-meta { display:flex; flex-direction:column; gap:0; border-radius:var(--r-lg); overflow:hidden; border:1.5px solid var(--grey-100); background:var(--white); }
.side-meta__row {
  display:flex; justify-content:space-between; gap:10px;
  padding:10px 14px; border-bottom:1px solid var(--grey-100); transition:background var(--dur-fast);
}
.side-meta__row:last-child { border-bottom:none; }
.side-meta__row:hover { background:var(--grey-50); }
.side-meta__key { font-size:11px; color:var(--grey-400); font-weight:700; flex-shrink:0; }
.side-meta__val { font-size:12px; color:var(--grey-700); font-weight:600; }
.chips-row { display:flex; flex-wrap:wrap; gap:7px; }
.chip { padding:5px 13px; border-radius:var(--r-full); font-size:12px; font-weight:600; }
.chip--tag { background:var(--brand-subtle); color:var(--brand); border:1px solid rgba(163,27,27,.12); }
.chip--kw  { background:var(--grey-100); color:var(--grey-700); border:1px solid var(--grey-200); }
.chip--tag:hover { background:var(--brand); color:var(--white); }

/* ════════════════════════════════════════
   VIDEO SECTION
   ════════════════════════════════════════ */
.video-section { padding:64px 0; }
.vplayer-wrap { border-radius:var(--r-xl); overflow:hidden; background:var(--black); box-shadow:var(--shadow-2xl); }
.vplayer-el   { width:100%; aspect-ratio:16/9; display:block; background:var(--black); }
.vembed-wrap  { border-radius:var(--r-xl); overflow:hidden; box-shadow:var(--shadow-2xl); }
.vembed       { width:100%; aspect-ratio:16/9; display:block; border:none; }
.vno-source   {
  aspect-ratio:16/9; background:var(--grey-50); border-radius:var(--r-xl);
  display:flex; flex-direction:column; align-items:center; justify-content:center; gap:12px;
  border:2px dashed var(--grey-200);
}
.vno-source__icon { font-size:52px; filter:grayscale(1) opacity(.4); }
.vno-source__text { font-size:16px; color:var(--grey-400); font-weight:500; }
.vfilm-info { margin-top:18px; }
.vfilm-chips { display:flex; flex-wrap:wrap; gap:9px; }
.vchip {
  padding:7px 16px; background:var(--white); border:1.5px solid var(--grey-200);
  color:var(--grey-700); font-size:12px; font-weight:700; border-radius:var(--r-full);
  box-shadow:var(--shadow-sm);
}

.clips-layout { display:grid; grid-template-columns:1fr 350px; gap:36px; }
@media (max-width:768px) { .clips-layout { grid-template-columns:1fr; } }
.clips-player { display:flex; flex-direction:column; gap:16px; }
.clip-desc {
  padding:16px 20px; background:var(--grey-50); border-radius:var(--r-lg);
  font-size:14px; line-height:1.75; color:var(--grey-700);
  border:1.5px solid var(--grey-100);
}
.clips-list__heading { font-family:var(--font-display); font-size:19px; font-weight:800; margin:0 0 18px; color:var(--grey-900); }
.clip-item {
  display:grid; grid-template-columns:34px 1fr 20px; gap:12px; align-items:center;
  padding:13px 16px; border-radius:var(--r-md);
  border:1.5px solid var(--grey-100); cursor:pointer; transition:all var(--dur-norm);
  margin-bottom:6px; background:var(--white); box-shadow:var(--shadow-sm);
}
.clip-item:hover   { background:var(--brand-subtle); border-color:rgba(163,27,27,.2); transform:translateX(-3px); }
.clip-item--on     { background:var(--brand-subtle); border-color:var(--brand); }
.clip-item__num    {
  width:32px; height:32px; border-radius:50%; background:var(--grey-100);
  display:flex; align-items:center; justify-content:center;
  font-size:12px; font-weight:800; color:var(--grey-600); flex-shrink:0;
}
.clip-item--on .clip-item__num { background:linear-gradient(135deg,var(--brand-dark),var(--brand)); color:var(--white); }
.clip-item__title  { font-size:14px; font-weight:600; color:var(--grey-900); }
.clip-item__meta   { display:flex; gap:8px; font-size:11px; color:var(--grey-400); margin-top:2px; }
.clip-item__play   { color:var(--grey-300); transition:color var(--dur-fast), transform var(--dur-fast); }
.clip-item:hover .clip-item__play { color:var(--brand); transform:scale(1.2); }

/* ════════════════════════════════════════
   GALLERY SECTION
   ════════════════════════════════════════ */
.gallery-section { padding:64px 0; background:var(--grey-50); }
.gallery-layout  { display:flex; flex-direction:column; gap:22px; }
.gallery-preview {
  position:relative; border-radius:var(--r-xl); overflow:hidden;
  cursor:zoom-in; background:var(--black); box-shadow:var(--shadow-2xl);
}
.gallery-preview__img { width:100%; max-height:540px; object-fit:contain; display:block; }
.gallery-zoom-hint {
  position:absolute; bottom:16px; right:16px;
  display:flex; align-items:center; gap:7px;
  padding:8px 16px; background:rgba(0,0,0,.58); backdrop-filter:blur(10px);
  color:rgba(255,255,255,.82); font-size:11px; border-radius:var(--r-full);
  font-weight:600; border:1px solid rgba(255,255,255,.12);
}
.gallery-caption {
  padding:18px 22px; background:var(--white); border-radius:var(--r-lg);
  border:1.5px solid var(--grey-100); box-shadow:var(--shadow-sm);
}
.gallery-caption__title { font-weight:800; font-size:15px; color:var(--grey-900); margin-bottom:5px; font-family:var(--font-display); }
.gallery-caption__desc  { font-size:13px; color:var(--grey-500); line-height:1.7; }
.gallery-strip { display:flex; gap:10px; overflow-x:auto; padding-bottom:6px; scrollbar-width:thin; scrollbar-color:var(--grey-200) transparent; }
.gallery-strip::-webkit-scrollbar { height:3px; }
.gallery-strip::-webkit-scrollbar-thumb { background:var(--grey-200); border-radius:2px; }
.gthumb {
  width:84px; height:68px; border-radius:var(--r-md);
  overflow:hidden; flex-shrink:0; border:2px solid transparent;
  cursor:pointer; transition:all var(--dur-norm) var(--ease-spring);
  background:var(--grey-100); box-shadow:var(--shadow-sm);
}
.gthumb img { width:100%; height:100%; object-fit:cover; transition:transform var(--dur-norm); }
.gthumb:hover img { transform:scale(1.08); }
.gthumb--on {
  border-color:var(--gold); transform:scale(1.08);
  box-shadow:0 4px 18px var(--gold-glow);
}
.gallery-nav { display:flex; align-items:center; gap:18px; justify-content:center; padding-top:4px; }
.gnav-btn {
  padding:9px 22px; background:var(--white); border:1.5px solid var(--grey-200);
  border-radius:var(--r-full); font-family:var(--font-sans); font-size:13px; font-weight:700;
  color:var(--grey-700); cursor:pointer; transition:all var(--dur-norm);
  box-shadow:var(--shadow-sm);
}
.gnav-btn:hover:not(:disabled) { border-color:var(--gold); color:var(--brand); background:var(--gold-subtle); }
.gnav-btn:disabled { opacity:.3; cursor:not-allowed; }
.gnav-pos { font-size:14px; font-weight:700; color:var(--grey-600); font-family:var(--font-display); }
.gallery-empty { display:flex; justify-content:center; }
.gallery-single { max-width:100%; border-radius:var(--r-xl); box-shadow:var(--shadow-2xl); }

/* ════════════════════════════════════════
   WRITING SECTION
   ════════════════════════════════════════ */
.writing-section { padding:64px 0; }
.writing-layout  { display:flex; flex-direction:column; gap:36px; }
.writing-info-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(230px,1fr)); gap:14px; }
.winfo-card {
  display:flex; align-items:center; gap:16px;
  padding:20px 22px; background:var(--white);
  border:1.5px solid var(--grey-100); border-radius:var(--r-lg);
  transition:all var(--dur-norm) var(--ease-out);
  box-shadow:var(--shadow-sm); position:relative; overflow:hidden;
}
.winfo-card::before {
  content:'';
  position:absolute; bottom:0; left:0; right:0; height:2px;
  background:linear-gradient(90deg, var(--gold), var(--brand));
  transform:scaleX(0); transition:transform var(--dur-norm) var(--ease-spring);
}
.winfo-card:hover { border-color:rgba(163,27,27,.18); background:var(--brand-subtle); transform:translateY(-3px); box-shadow:var(--shadow-md); }
.winfo-card:hover::before { transform:scaleX(1); }
.winfo-card__ico   { font-size:28px; filter:drop-shadow(0 2px 6px rgba(0,0,0,.1)); }
.winfo-card__lbl   { font-size:10px; color:var(--grey-400); font-weight:800; text-transform:uppercase; letter-spacing:.1em; }
.winfo-card__val   { font-size:16px; font-weight:700; color:var(--grey-900); margin-top:3px; }
.series-block {
  display:flex; align-items:center; gap:20px;
  padding:24px 28px;
  background:linear-gradient(135deg,var(--gold-subtle),var(--brand-subtle));
  border:1.5px solid rgba(201,160,40,.2); border-radius:var(--r-xl);
  box-shadow:0 4px 20px rgba(201,160,40,.08);
  position:relative; overflow:hidden;
}
.series-block::before {
  content:'';
  position:absolute; top:0; left:0; bottom:0; width:3px;
  background:linear-gradient(to bottom, var(--gold), var(--brand));
  border-radius:0 2px 2px 0;
}
.series-block__ico  { font-size:38px; filter:drop-shadow(0 4px 8px rgba(0,0,0,.15)); }
.series-block__lbl  { font-size:10px; font-weight:800; text-transform:uppercase; letter-spacing:.12em; color:var(--gold-dark); margin-bottom:5px; }
.series-block__name { font-family:var(--font-display); font-size:19px; font-weight:800; color:var(--grey-900); }
.series-block__order { font-size:13px; color:var(--grey-500); margin-top:3px; font-weight:600; }

/* ════════════════════════════════════════
   CHIPS SECTIONS
   ════════════════════════════════════════ */
.chips-section { padding:36px 0; }
.chips-section--alt { background:var(--grey-50); }
.chips-block__heading { font-size:10px; font-weight:800; letter-spacing:.16em; text-transform:uppercase; color:var(--grey-400); margin:0 0 16px; }

/* ════════════════════════════════════════
   RELATED SECTION
   ════════════════════════════════════════ */
.related {
  padding:64px 0; border-top:1px solid var(--grey-100);
  background:linear-gradient(to bottom, var(--white), var(--grey-50));
}
.related__head { display:flex; align-items:center; gap:22px; margin-bottom:36px; }
.related__title { font-family:var(--font-display); font-size:26px; font-weight:800; color:var(--grey-900); margin:0; white-space:nowrap; }
.related__rule { flex:1; height:1px; background:linear-gradient(90deg,rgba(201,160,40,.4),transparent); }
.pub--ltr .related__rule { background:linear-gradient(270deg,rgba(201,160,40,.4),transparent); }
.related__grid { display:grid; gap:22px; grid-template-columns:repeat(auto-fill,minmax(250px,1fr)); }
.rcard {
  border-radius:var(--r-lg); overflow:hidden; cursor:pointer;
  border:1.5px solid var(--grey-100); background:var(--white);
  transition:all var(--dur-norm) var(--ease-out);
  box-shadow:var(--shadow-sm);
}
.rcard:hover { transform:translateY(-6px); box-shadow:var(--shadow-xl); border-color:var(--grey-200); }
.rcard__img { position:relative; aspect-ratio:16/10; overflow:hidden; }
.rcard__img-main  { width:100%; height:100%; object-fit:cover; transition:transform 600ms var(--ease-out); }
.rcard__img-hover { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; opacity:0; transition:opacity var(--dur-norm); }
.rcard:hover .rcard__img-main  { transform:scale(1.06); }
.rcard:hover .rcard__img-hover { opacity:1; }
.rcard__overlay { position:absolute; inset:0; background:linear-gradient(to bottom,transparent 50%,rgba(0,0,0,.45) 100%); }
.rcard__typebadge {
  position:absolute; top:10px; right:10px;
  padding:4px 11px; background:rgba(0,0,0,.58); backdrop-filter:blur(8px);
  color:var(--white); font-size:12px; border-radius:var(--r-full);
  border:1px solid rgba(255,255,255,.1);
}
.pub--ltr .rcard__typebadge { right:auto; left:10px; }
.rcard__body { padding:18px; }
.rcard__title { font-family:var(--font-display); font-size:16px; font-weight:700; margin:0 0 7px; color:var(--grey-900); transition:color var(--dur-fast); }
.rcard:hover .rcard__title { color:var(--brand-dark); }
.rcard__desc  { font-size:13px; color:var(--grey-500); line-height:1.65; margin:0 0 12px; }
.rcard__tags  { display:flex; gap:5px; flex-wrap:wrap; }
.rtag { padding:2px 9px; background:var(--brand-subtle); color:var(--brand); font-size:10px; font-weight:700; border-radius:var(--r-full); }

/* ════════════════════════════════════════
   FULLSCREEN OVERLAY
   ════════════════════════════════════════ */
.fsoverlay {
  position:fixed; inset:0; background:rgba(5,4,2,.97); z-index:1100;
  display:flex; align-items:center; justify-content:center; padding:48px;
  backdrop-filter:blur(2px);
}
.fsoverlay__x {
  position:absolute; top:20px; right:20px;
  width:46px; height:46px; border-radius:50%;
  background:rgba(255,255,255,.08); border:1.5px solid rgba(255,255,255,.18);
  color:var(--white); cursor:pointer; font-size:17px;
  display:flex; align-items:center; justify-content:center;
  transition:all var(--dur-norm) var(--ease-spring);
}
.fsoverlay__x:hover { background:var(--brand); border-color:var(--brand); transform:scale(1.12) rotate(90deg); }
.fsoverlay__frame { max-width:90vw; max-height:90vh; }
.fsoverlay__img   {
  max-width:100%; max-height:90vh; object-fit:contain; border-radius:var(--r-lg);
  box-shadow:0 40px 100px rgba(0,0,0,.9), 0 0 0 1px rgba(201,160,40,.1);
  display:block;
}

/* ════════════════════════════════════════
   RTL / LTR FIXES
   ════════════════════════════════════════ */
.pub--ltr .card__foot    { flex-direction:row-reverse; }
.pub--ltr .stream-side   { order:-1; }

/* ════════════════════════════════════════
   RESPONSIVE
   ════════════════════════════════════════ */
@media (max-width:640px) {
  .hero { min-height:60vh; }
  .hero__inner { padding:82px 0 64px; }
  .hstat__inner { padding:0 16px; }
  .hstat__num   { font-size:26px; }
  .hero__stats  { gap:8px; }
  .tabnav__row  { gap:0; overflow-x:auto; scrollbar-width:none; }
  .tabnav__row::-webkit-scrollbar { display:none; }
  .tabtn { padding:16px 16px; font-size:13px; }
  .tabtn__lbl   { display:none; }
  .tabtn__ico svg { width:20px; height:20px; }
  .tabtn__count { display:none; }
  .grid { grid-template-columns:repeat(auto-fill,minmax(200px,1fr)); gap:16px; }
  .card--featured { grid-column:span 1; }
  .dhero__content { grid-template-columns:1fr; gap:28px; }
  .dhero__right   { display:none; }
  .stream-layout  { grid-template-columns:1fr; }
  .clips-layout   { grid-template-columns:1fr; }
  .audio-bar {
    grid-template-columns:46px 1fr auto;
    grid-template-rows:auto auto;
    gap:12px; padding:16px;
  }
  .audio-bar__prog-wrap,
  .audio-bar__time { grid-column:1/-1; }
  .track { grid-template-columns:24px 40px 16px 1fr 60px; }
  .track__waves { display:none; }
}

@media (max-width:400px) {
  .tabdrop { min-width:88vw; right:-12px; }
}

@media (prefers-reduced-motion:reduce) {
  *,*::before,*::after {
    animation-duration:.01ms !important;
    transition-duration:.01ms !important;
    animation-iteration-count:1 !important;
  }
}
</style>