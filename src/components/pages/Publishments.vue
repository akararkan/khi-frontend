<template>
  <main class="pub" :dir="lang.dir" :class="{ 'pub--ltr': lang.isKMR }">
    <transition name="page" mode="out-in">

      <div v-if="!activeItem" key="listing" class="listing">
        <header class="hero">
          <div class="hero__canvas">
            <div class="hero__slides">
              <div v-for="(slide, si) in heroSlides" :key="slide.url + si" class="hero__slide" :class="{ 'hero__slide--active': si === heroSlideIndex, 'hero__slide--prev': si === heroPrevIndex, 'hero__slide--kb-a': si % 2 === 0, 'hero__slide--kb-b': si % 2 !== 0 }" :style="{ backgroundImage: `url(${slide.url})` }"></div>
              <div v-if="!heroSlides.length" class="hero__slide hero__slide--active hero__slide--gradient" :class="`hero__slide--grad-${activeTab}`"></div>
            </div>
            <div class="hero__dots" v-if="heroSlides.length > 1">
              <button v-for="(_, di) in heroSlides" :key="di" class="hero__dot" :class="{ 'hero__dot--on': di === heroSlideIndex }" @click.stop="jumpSlide(di)"></button>
            </div>
            <div class="hero__overlay hero__overlay--base"></div>
            <div class="hero__overlay hero__overlay--vignette"></div>
            <div class="hero__overlay hero__overlay--bottom"></div>
            <div class="hero__overlay hero__overlay--top"></div>
            <div class="hero__film"></div>
            <div class="hero__grain"></div>
            <div class="hero__scanlines"></div>
            <div class="hero__filigree hero__filigree--h1"></div>
            <div class="hero__filigree hero__filigree--h2"></div>
            <div class="hero__filigree hero__filigree--v1"></div>
            <div class="hero__filigree hero__filigree--v2"></div>
            <div class="hero__particles"><span v-for="i in 22" :key="i" class="hparticle" :style="particleStyle(i)"></span></div>
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
                  <div class="hstat__num"><span class="hstat__num-val">{{ s.value }}</span></div>
                  <div class="hstat__lbl">{{ s.label }}</div>
                </div>
                <div class="hstat__sep" v-if="i < heroStats.length - 1"></div>
              </div>
            </div>
          </div>
          <button class="hero__scroll" @click="scrollToContent">
            <span class="scroll__label">{{ lbl('explore') }}</span>
            <div class="scroll__arrow">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
            </div>
          </button>
        </header>

        <nav class="tabnav" ref="tabNavRef">
          <div class="container">
            <div class="tabnav__row">
              <div v-for="tab in tabDefs" :key="tab.key" class="tabnav__item" :class="{ 'tabnav__item--on': activeTab === tab.key }" @mouseenter="onTabEnter(tab.key)" @mouseleave="scheduleDropClose" @click="switchTab(tab.key)">
                <button class="tabtn" :class="{ 'tabtn--on': activeTab === tab.key }">
                  <span class="tabtn__ico">
                    <svg v-if="tab.key === 'image'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                    <svg v-else-if="tab.key === 'sound'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>
                    <svg v-else-if="tab.key === 'video'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
                    <svg v-else-if="tab.key === 'writing'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"/><line x1="16" y1="8" x2="2" y2="22"/><line x1="17.5" y1="15" x2="9" y2="15"/></svg>
                    <svg v-else-if="tab.key === 'memories'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3.332.88-4.5 2-1.168-1.12-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                  </span>
                  <span class="tabtn__lbl">{{ tab.label }}</span>
                  <svg class="tabtn__chevron" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
                  <span class="tabtn__count" v-if="tabCount(tab.key) > 0">{{ tabCount(tab.key) }}</span>
                </button>
                <transition name="drop">
                  <div v-if="openDropdownKey === tab.key" class="tabdrop" :class="{ 'tabdrop--memories': tab.key === 'memories' }" @mouseenter="cancelDropClose" @mouseleave="scheduleDropClose">
                    <div class="tabdrop__inner">
                      <template v-if="tab.key !== 'memories'">
                        <div class="tabdrop__header"><span class="tabdrop__header-ico">{{ tab.icon }}</span><span class="tabdrop__header-lbl">{{ tab.label }}</span></div>
                        <div class="tabdrop__divider"></div>
                        <button class="tabdrop__item" :class="{ 'tabdrop__item--on': !activeTopicFilter }" @click.stop="setTopicFilter(null)">
                          <span class="tabdrop__item-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg></span>
                          <span class="tabdrop__item-name">{{ lbl('allTopics') }}</span>
                          <span class="tabdrop__item-count">{{ tabCount(tab.key) }}</span>
                        </button>
                        <div class="tabdrop__topics-list">
                          <button v-for="topic in getTopicsFor(tab.key)" :key="topic.id" class="tabdrop__item" :class="{ 'tabdrop__item--on': activeTopicFilter === topic.id }" @click.stop="setTopicFilter(topic.id)">
                            <span class="tabdrop__item-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg></span>
                            <span class="tabdrop__item-name">{{ topicName(topic) }}</span>
                          </button>
                          <div v-if="!getTopicsFor(tab.key).length" class="tabdrop__empty"><span>{{ lbl('noTopics') }}</span></div>
                        </div>
                      </template>
                      <template v-else>
                        <div class="tabdrop__header"><span class="tabdrop__header-ico">💫</span><span class="tabdrop__header-lbl">{{ lbl('memories') }}</span></div>
                        <div class="tabdrop__divider"></div>
                        <div v-if="memorySounds.length" class="tabdrop__mem-section">
                          <div class="tabdrop__mem-section-title"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="12" height="12"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>{{ lbl('sound') }}<span class="tabdrop__sec-count">{{ memorySounds.length }}</span></div>
                          <button v-for="mem in memorySounds.slice(0, 6)" :key="`ms-${mem.id}`" class="tabdrop__item tabdrop__item--mem" @click.stop="openMemoryFromDropdown(mem)"><span class="tabdrop__mem-cover"><img :src="pCover(mem)" @error="onImgError($event)" /><span class="tabdrop__mem-play">▶</span></span><span class="tabdrop__item-name">{{ truncate(pTitle(mem), 30) }}</span><span class="tabdrop__mem-badge">💫</span></button>
                        </div>
                        <div v-if="memoryVideos.length" class="tabdrop__mem-section">
                          <div class="tabdrop__mem-section-title"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="12" height="12"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>{{ lbl('video') }}<span class="tabdrop__sec-count">{{ memoryVideos.length }}</span></div>
                          <button v-for="mem in memoryVideos.slice(0, 6)" :key="`mv-${mem.id}`" class="tabdrop__item tabdrop__item--mem" @click.stop="openMemoryFromDropdown(mem)"><span class="tabdrop__mem-cover"><img :src="pCover(mem)" @error="onImgError($event)" /><span class="tabdrop__mem-play">▶</span></span><span class="tabdrop__item-name">{{ truncate(pTitle(mem), 30) }}</span><span class="tabdrop__mem-badge">💫</span></button>
                        </div>
                        <div v-if="!memorySounds.length && !memoryVideos.length" class="tabdrop__empty"><span>💫 {{ lbl('noMemories') }}</span></div>
                      </template>
                    </div>
                  </div>
                </transition>
              </div>
            </div>
          </div>
        </nav>

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
                <span class="toolbar__label"><strong>{{ displayedItems.length }}</strong>&nbsp;{{ lbl('results') }}</span>
              </div>
              <div class="toolbar__right">
                <div class="tsort">
                  <select v-model="sortBy" class="tsort__sel">
                    <option value="newest">{{ lbl('sortNewest') }}</option>
                    <option value="oldest">{{ lbl('sortOldest') }}</option>
                    <option value="title">{{ lbl('sortTitle') }}</option>
                  </select>
                  <svg class="tsort__ico" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
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
                  <div class="skel__pills"><div class="skel__pill shimmer"></div><div class="skel__pill shimmer"></div></div>
                </div>
              </div>
            </div>
            <div v-else-if="!paginatedItems.length" class="empty">
              <div class="empty__icon">{{ tabDefs.find(t => t.key === activeTab)?.icon || '📂' }}</div>
              <h3 class="empty__title">{{ lbl('noResults') }}</h3>
              <p class="empty__hint">{{ lbl('noResultsHint') }}</p>
              <button class="btn-primary" @click="clearFilters">{{ lbl('resetFilter') }}</button>
            </div>
            <div v-else class="grid">
              <article v-for="(item, i) in paginatedItems" :key="`${item._mediaType}-${item.id}`" class="card" :class="[`card--${item._mediaType}`, { 'card--featured': i === 0 && clientPage === 0 && !activeTopicFilter }]" :style="{ '--d': `${i * 0.05}s` }" tabindex="0" @click="openItem(item)" @keyup.enter="openItem(item)">
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
                  <div class="card__view"><span class="card__viewbtn">{{ lbl('viewItem') }}<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></span></div>
                  <div class="card__accent"></div>
                </div>
                <div class="card__body">
                  <div class="card__meta">
                    <span class="card__date" v-if="getItemDate(item)">{{ formatDate(getItemDate(item)) }}</span>
                    <span class="card__lang" v-for="l in (item.contentLanguages || [])" :key="l">{{ l }}</span>
                  </div>
                  <h3 class="card__title">{{ pTitle(item) }}</h3>
                  <p class="card__desc">{{ truncate(pDesc(item), 100) }}</p>
                  <div class="card__extra" v-if="getExtraLine(item)"><span class="card__extra-val">{{ getExtraLine(item) }}</span></div>
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
                <span v-for="p in Math.min(totalClientPages, 7)" :key="p" class="pager__dot" :class="{ 'pager__dot--on': clientPage === p - 1 }" @click="clientPage = p - 1; scrollToContent()"></span>
              </div>
              <button class="pager__btn" :disabled="clientPage + 1 >= totalClientPages" @click="goNext">{{ lbl('next') }}</button>
            </nav>
          </div>
        </section>
      </div>

      <div v-else key="detail" class="detail">
        <nav class="dnav">
          <div class="container dnav__inner">
            <button class="back-btn" @click="closeItem">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              <span>{{ lbl('back') }}</span>
            </button>
            <div class="dnav__right">
              <span class="dtype-pill">{{ getMediaIcon(activeItem._mediaType) }} {{ getMediaTypeLabel(activeItem._mediaType) }}</span>
              <div class="langpills" v-if="activeItem.contentLanguages?.length">
                <span v-for="l in activeItem.contentLanguages" :key="l" class="langpill" :class="{ 'langpill--on': lang.activeLang === l }">
                  <span class="langpill__dot" :class="`lpdot--${l.toLowerCase()}`"></span>{{ l }}
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
                <div class="msound__case"><div class="msound__spine"></div><div class="msound__front"><img :src="pCover(activeItem)" :alt="pTitle(activeItem)" @error="onImgError($event)" /><div class="msound__overlay"></div></div></div>
                <div class="msound__disc"><div class="msound__disc-ring"></div><div class="msound__disc-art"><img :src="pCover(activeItem)" :alt="pTitle(activeItem)" @error="onImgError($event)" /></div><div class="msound__disc-hole"></div></div>
              </div>
              <div class="mockup-book" v-else-if="activeItem._mediaType === 'writing'">
                <div class="mbook__spine"></div><div class="mbook__cover"><img :src="pCover(activeItem)" :alt="pTitle(activeItem)" @error="onImgError($event)" /><div class="mbook__sheen"></div></div><div class="mbook__pages"></div>
              </div>
              <div class="mockup-video" v-else-if="activeItem._mediaType === 'video'">
                <div class="mvideo__frame"><img :src="pCover(activeItem)" :alt="pTitle(activeItem)" @error="onImgError($event)" /><div class="mvideo__play-ico">▶</div></div><div class="mvideo__stand"></div>
              </div>
              <div class="mockup-image" v-else-if="activeItem._mediaType === 'image'">
                <div class="mimage__frame"><div class="mimage__mat"></div><div class="mimage__photo"><img :src="pCover(activeItem)" :alt="pTitle(activeItem)" @error="onImgError($event)" /></div></div>
              </div>
            </div>
          </div>
        </header>

        <!-- ── SOUND ── -->
        <section class="stream-section" v-if="activeItem._mediaType === 'sound' && activeItem.files?.length">
          <div class="container">
            <div class="stream-layout">
              <div class="stream-main">
                <div class="stream-head">
                  <h3 class="section-heading">{{ lbl('yourStream') }}</h3>
                  <span class="stream-count">{{ activeItem.files.length }} {{ lbl('tracks') }}</span>
                </div>
                <div v-if="audioError" class="audio-error"><span>⚠️ {{ audioError }}</span></div>
                <div class="track-list">
                  <div v-for="(file, i) in activeItem.files" :key="file.id || i" class="track" :class="{ 'track--playing': currentTrackIdx === i && isAudioPlaying, 'track--selected': currentTrackIdx === i }" @click="playTrack(file, i)">
                    <div class="track__num">{{ String(i + 1).padStart(2, '0') }}</div>
                    <div class="track__cover"><img :src="pCover(activeItem)" :alt="`Track ${i + 1}`" @error="onImgError($event)" /><div class="track__play-ico"><span>{{ currentTrackIdx === i && isAudioPlaying ? '⏸' : '▶' }}</span></div></div>
                    <div class="track__indicator"><span v-for="b in 3" :key="b" class="track__bar" :class="{ 'track__bar--live': currentTrackIdx === i && isAudioPlaying }" :style="{ '--b': b }"></span></div>
                    <div class="track__info">
                      <div class="track__title">{{ file.readerName || `${lbl('track')} ${i + 1}` }}</div>
                      <div class="track__sub">{{ file.fileType || 'AUDIO' }}</div>
                    </div>
                    <div class="track__waves"><div class="wave-wrap" :class="{ 'wave-wrap--live': currentTrackIdx === i && isAudioPlaying }"><span v-for="(h, bi) in getWaveform(file.id || i)" :key="bi" class="wbar" :style="{ '--h': h, '--bi': bi }"></span></div></div>
                    <div class="track__right">
                      <span class="track__dur" v-if="file.durationSeconds">{{ formatTime(file.durationSeconds) }}</span>
                      <span class="track__size" v-if="file.sizeBytes > 0">{{ formatSize(file.sizeBytes) }}</span>
                    </div>
                  </div>
                </div>
                <div class="audio-bar" v-if="currentTrack">
                  <div class="audio-bar__cover"><img :src="pCover(activeItem)" alt="playing" @error="onImgError($event)" /><div class="audio-bar__vinyl" :class="{ 'audio-bar__vinyl--spin': isAudioPlaying }"></div></div>
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
                </div>
                <audio ref="audioPlayer" style="display:none" preload="auto" @loadedmetadata="onAudioLoaded" @timeupdate="onAudioTimeUpdate" @play="isAudioPlaying = true" @pause="isAudioPlaying = false" @ended="onTrackEnded" @error="onAudioError"></audio>
              </div>
              <div class="stream-side">
                <div class="side-featured">
                  <h4 class="side-heading">{{ lbl('featured') }}</h4>
                  <div class="side-cover"><img :src="pCover(activeItem)" :alt="pTitle(activeItem)" @error="onImgError($event)" /><div class="side-cover__overlay"><div class="side-cover__title">{{ pTitle(activeItem) }}</div></div></div>
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
            <template v-if="activeItem.videoType === 'VIDEO_CLIP' && activeItem.videoClipItems?.length">
              <div class="clips-layout">
                <div class="clips-player" v-if="selectedClip">
                  <div class="vplayer-wrap" v-if="getClipUrl(selectedClip)"><video class="vplayer-el" controls :poster="pCover(activeItem)" :key="getClipUrl(selectedClip)"><source :src="getClipUrl(selectedClip)" type="video/mp4" /></video></div>
                  <div class="vembed-wrap" v-else-if="getClipEmbedUrl(selectedClip)"><iframe :src="getClipEmbedUrl(selectedClip)" frameborder="0" allowfullscreen class="vembed"></iframe></div>
                  <div class="vno-source" v-else><div class="vno-source__icon">📹</div><div class="vno-source__text">{{ lbl('noSource') }}</div></div>
                  <div class="clip-desc" v-if="lang.activeLang === 'CKB' ? selectedClip.descriptionCkb : selectedClip.descriptionKmr"><p>{{ lang.activeLang === 'CKB' ? selectedClip.descriptionCkb : selectedClip.descriptionKmr }}</p></div>
                </div>
                <div class="clips-list">
                  <h4 class="clips-list__heading">{{ lbl('clips') }} ({{ activeItem.videoClipItems?.length }})</h4>
                  <div v-for="clip in activeItem.videoClipItems" :key="clip.id" class="clip-item" :class="{ 'clip-item--on': selectedClip?.id === clip.id }" @click="selectedClip = clip">
                    <div class="clip-item__num">{{ clip.clipNumber }}</div>
                    <div class="clip-item__info"><div class="clip-item__title">{{ lang.activeLang === 'CKB' ? (clip.titleCkb || clip.titleKmr) : (clip.titleKmr || clip.titleCkb) || `Clip ${clip.clipNumber}` }}</div><div class="clip-item__meta"><span v-if="clip.durationSeconds">⏱ {{ formatTime(clip.durationSeconds) }}</span><span v-if="clip.resolution">{{ clip.resolution }}</span></div></div>
                    <svg class="clip-item__play" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                  </div>
                </div>
              </div>
            </template>
            <template v-else>
              <div class="video-stage">
                <div class="vplayer-wrap" v-if="getVideoSourceUrl(activeItem)"><video ref="videoPlayerEl" class="vplayer-el" controls :poster="pCover(activeItem)"><source :src="getVideoSourceUrl(activeItem)" type="video/mp4" /></video></div>
                <div class="vembed-wrap" v-else-if="getVideoEmbedUrl(activeItem)"><iframe :src="getVideoEmbedUrl(activeItem)" frameborder="0" allowfullscreen class="vembed"></iframe></div>
                <div class="vno-source" v-else><div class="vno-source__icon">🎬</div><div class="vno-source__text">{{ lbl('noSource') }}</div></div>
                <div class="vfilm-info"><div class="vfilm-chips">
                  <span v-if="activeItem.resolution" class="vchip">📺 {{ activeItem.resolution }}</span>
                  <span v-if="activeItem.fileFormat" class="vchip">🎞 {{ activeItem.fileFormat }}</span>
                  <span v-if="activeItem.durationSeconds" class="vchip">⏱ {{ formatTime(activeItem.durationSeconds) }}</span>
                  <span v-if="activeItem.fileSizeMb" class="vchip">💾 {{ activeItem.fileSizeMb?.toFixed(1) }}MB</span>
                </div></div>
              </div>
            </template>
          </div>
        </section>

        <!-- ── IMAGE ── -->
        <section class="gallery-section" v-if="activeItem._mediaType === 'image'">
          <div class="container">
            <div class="gallery-layout" v-if="activeItem.imageAlbum?.length">
              <div class="gallery-main">
                <div class="gallery-preview" v-if="selectedImage"><img :src="selectedImage.imageUrl || selectedImage.externalUrl || selectedImage.embedUrl" :alt="lang.activeLang === 'CKB' ? selectedImage.captionCkb : selectedImage.captionKmr" class="gallery-preview__img" @click="openFullscreen(selectedImage)" @error="onImgError($event)" /><div class="gallery-zoom-hint"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>{{ lbl('clickToExpand') }}</div></div>
                <div class="gallery-caption" v-if="selectedImage"><div class="gallery-caption__title">{{ lang.activeLang === 'CKB' ? selectedImage.captionCkb : selectedImage.captionKmr }}</div><div class="gallery-caption__desc">{{ lang.activeLang === 'CKB' ? selectedImage.descriptionCkb : selectedImage.descriptionKmr }}</div></div>
              </div>
              <div class="gallery-strip"><button v-for="img in activeItem.imageAlbum" :key="img.id" class="gthumb" :class="{ 'gthumb--on': selectedImage?.id === img.id }" @click="selectedImage = img"><img :src="img.imageUrl || img.externalUrl" @error="onImgError($event)" /></button></div>
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
                <div class="series-block__info"><div class="series-block__lbl">{{ lbl('series') }}</div><div class="series-block__name">{{ activeItem.seriesName || activeItem.seriesId }}</div><div class="series-block__order" v-if="activeItem.seriesOrder">Vol. {{ activeItem.seriesOrder }}</div></div>
              </div>
            </div>
          </div>
        </section>

        <section class="chips-section" v-if="pTags(activeItem).length"><div class="container"><div class="chips-block"><h3 class="chips-block__heading">{{ lbl('tags') }}</h3><div class="chips-row"><span v-for="tag in pTags(activeItem)" :key="tag" class="chip chip--tag">#{{ tag }}</span></div></div></div></section>
        <section class="chips-section chips-section--alt" v-if="pKeywords(activeItem).length"><div class="container"><div class="chips-block"><h3 class="chips-block__heading">{{ lbl('keywords') }}</h3><div class="chips-row"><span v-for="kw in pKeywords(activeItem)" :key="kw" class="chip chip--kw">{{ kw }}</span></div></div></div></section>

        <section class="related" v-if="relatedItems.length">
          <div class="container">
            <div class="related__head"><h2 class="related__title">{{ lbl('related') }}</h2><div class="related__rule"></div></div>
            <div class="related__grid">
              <article v-for="rp in relatedItems" :key="`rel-${rp._mediaType}-${rp.id}`" class="rcard" tabindex="0" @click="openItem(rp)" @keyup.enter="openItem(rp)">
                <div class="rcard__img"><img :src="pCover(rp)" :alt="pTitle(rp)" loading="lazy" class="rcard__img-main" @error="onImgError($event)" /><img v-if="pHoverCover(rp)" :src="pHoverCover(rp)" :alt="pTitle(rp)" loading="lazy" class="rcard__img-hover" @error="onImgError($event)" /><div class="rcard__overlay"></div><span class="rcard__typebadge">{{ getMediaIcon(rp._mediaType) }}</span></div>
                <div class="rcard__body"><h3 class="rcard__title">{{ pTitle(rp) }}</h3><p class="rcard__desc">{{ truncate(pDesc(rp), 90) }}</p><div class="rcard__tags" v-if="pTags(rp).length"><span v-for="t in pTags(rp).slice(0, 2)" :key="t" class="rtag">#{{ t }}</span></div></div>
              </article>
            </div>
          </div>
        </section>
      </div>
    </transition>

    <transition name="fs">
      <div v-if="isFullscreen" class="fsoverlay" @click="isFullscreen = false">
        <button class="fsoverlay__x" @click.stop="isFullscreen = false">✕</button>
        <div class="fsoverlay__frame" @click.stop><img :src="fullscreenUrl" class="fsoverlay__img" /></div>
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
const audioError = ref(null)

const i18n = {
  CKB: { archive: 'ئەرشیڤ', heroDeco: 'کتێبخانەی کهیە', heroMain: 'بڵاوکراوەکان', heroSub: 'وێنە · دەنگ · ڤیدیۆ · نووسین', images: 'وێنەکان', sound: 'دەنگ', video: 'ڤیدیۆ', writings: 'نووسینەکان', memories: 'یادگاریەکان', albumOfMemories: 'یادگاریەکان', allTopics: 'هەموو بابەتەکان', all: 'هەموو', explore: 'بگەڕێ', back: 'گەڕانەوە', results: 'ئەنجام', noResults: 'ئەنجامێک نەدۆزرایەوە', noResultsHint: 'فیلتر بگۆڕە یان سیفرەوە', resetFilter: 'سیفرکردنەوە', viewItem: 'بینین', tracks: 'گۆرانیەکان', track: 'گۆرانی', pages: 'لاپەڕە', clips: 'کلیپەکان', yourStream: 'گۆرانیەکان', featured: 'تایبەتمەند', type: 'جۆر', director: 'دەرهێنەر', writer: 'نووسەر', genre: 'جۆری نووسین', category: 'پۆل', format: 'فۆرمات', publisher: 'بڵاوکەرەوە', institute: 'ڕێکخراو', series: 'زنجیرە', tags: 'تاگەکان', keywords: 'کلیلەوشەکان', related: 'پەیوەندیدار', sortNewest: 'نوێترین', sortOldest: 'کۆنترین', sortTitle: 'ناوی', prev: 'پێشتر', next: 'دواتر', noSource: 'سەرچاوەیەک نییە', clickToExpand: 'کلیک بکە بۆ گەورەکردن', totalItems: 'کۆی بابەتەکان', noTopics: 'بابەتێک نییە', noMemories: 'یادگاریەک نییە' },
  KMR: { archive: 'Arşîv', heroDeco: 'Lîbrariya KHI', heroMain: 'Weşandin', heroSub: 'Wêne · Deng · Vîdyo · Nivîsar', images: 'Wêne', sound: 'Deng', video: 'Vîdyo', writings: 'Nivîsarên', memories: 'Bîranîn', albumOfMemories: 'Albûma Bîranînê', allTopics: 'Hemû Mijar', all: 'Hemû', explore: 'Bigere', back: 'Vegere', results: 'Encam', noResults: 'Encam nehat dîtin', noResultsHint: 'Fîlteran biguherîne', resetFilter: 'Sifirkirin', viewItem: 'Bibîne', tracks: 'Stran', track: 'Stran', pages: 'Rûpel', clips: 'Klîp', yourStream: 'Stranên Te', featured: 'Taybet', type: 'Cûre', director: 'Derhêner', writer: 'Nivîskar', genre: 'Cûre', category: 'Kategorî', format: 'Format', publisher: 'Weşanger', institute: 'Dezgeh', series: 'Rêze', tags: 'Etiket', keywords: 'Peyvên Kilîtê', related: 'Girêdayî', sortNewest: 'Herî nû', sortOldest: 'Herî kevn', sortTitle: 'Sernavê', prev: 'Berî', next: 'Paş', noSource: 'Çavkanî tune', clickToExpand: 'Klikê bike mezin bike', totalItems: 'Giştî', noTopics: 'Mijar tune', noMemories: 'Bîranîn tune' }
}
function lbl(key) { const al = lang?.activeLang || 'CKB'; return i18n[al]?.[key] || i18n['CKB']?.[key] || key }

const api = axios.create({ baseURL: API_BASE_URL, timeout: 15000 })

// ============================================================================
// API Response Normalizer - Handles both ApiResponse wrappers and Spring Pages
// ============================================================================
function toArray(raw) {
  if (!raw) return []
  // ApiResponse wrapper → unwrap .data first
  const inner = raw?.data !== undefined ? raw.data : raw
  if (Array.isArray(inner)) return inner
  // Spring Page inside wrapper
  if (Array.isArray(inner?.content)) return inner.content
  // bare Spring Page
  if (Array.isArray(inner?.data)) return inner.data
  // inner.data is itself a Page  { data: { content: [...] } }
  if (Array.isArray(inner?.data?.content)) return inner.data.content
  return []
}

const images = ref([]), sounds = ref([]), videos = ref([]), writings = ref([])
const imageTopics = ref([]), soundTopics = ref([]), videoTopics = ref([]), writingTopics = ref([])
const isLoading = ref(false), activeTab = ref('sound'), activeTopicFilter = ref(null), sortBy = ref('newest')
const openDropdownKey = ref(null), gridSection = ref(null), tabNavRef = ref(null)
let dropCloseTimer = null
const clientPage = ref(0), clientPageSize = 12
const activeItem = ref(null), selectedClip = ref(null), selectedImage = ref(null)
const audioPlayer = ref(null), currentTrackIdx = ref(-1), currentTrack = ref(null)
const isAudioPlaying = ref(false), audioCurrentTime = ref(0), audioDuration = ref(0), audioProgress = ref(0)
const isFullscreen = ref(false), fullscreenUrl = ref('')
const heroSlideIndex = ref(0), heroPrevIndex = ref(-1)
let slideTimer = null

const memorySounds = computed(() => sounds.value.filter(s => s.albumOfMemories).map(s => ({ ...s, _mediaType: 'sound' })))
const memoryVideos = computed(() => videos.value.filter(v => v.albumOfMemories).map(v => ({ ...v, _mediaType: 'video' })))

const heroSlides = computed(() => {
  const seen = new Set(), urls = []
  const addUrl = (u, tab) => { if (!u || seen.has(u) || u.includes('example.com') || u.includes('placeholder') || !u.startsWith('http')) return; seen.add(u); urls.push({ url: u, tab }) }
  images.value.forEach(x => { addUrl(x.ckbCoverUrl, 'image'); addUrl(x.kmrCoverUrl, 'image'); addUrl(x.hoverCoverUrl, 'image') })
  sounds.value.forEach(x => { addUrl(x.ckbCoverUrl, 'sound'); addUrl(x.kmrCoverUrl, 'sound'); addUrl(x.hoverCoverUrl, 'sound') })
  videos.value.forEach(x => { addUrl(x.ckbCoverUrl, 'video'); addUrl(x.kmrCoverUrl, 'video'); addUrl(x.hoverCoverUrl, 'video') })
  writings.value.forEach(x => { addUrl(x.ckbCoverUrl, 'writing'); addUrl(x.kmrCoverUrl, 'writing'); addUrl(x.hoverCoverUrl, 'writing') })
  for (let i = urls.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [urls[i], urls[j]] = [urls[j], urls[i]] }
  return urls.slice(0, 14)
})

function jumpSlide(idx) { heroPrevIndex.value = heroSlideIndex.value; heroSlideIndex.value = idx; restartSlideTimer() }
function advanceSlide() { if (!heroSlides.value.length) return; heroPrevIndex.value = heroSlideIndex.value; heroSlideIndex.value = (heroSlideIndex.value + 1) % heroSlides.value.length }
function restartSlideTimer() { if (slideTimer) clearInterval(slideTimer); slideTimer = setInterval(advanceSlide, 4800) }
watch(heroSlides, (slides) => { if (slides.length > 1) restartSlideTimer() }, { immediate: false })

const waveformCache = new Map()
function getWaveform(seed) {
  const key = String(seed)
  if (!waveformCache.has(key)) { waveformCache.set(key, Array.from({ length: 40 }, (_, i) => { const x = Math.sin(Number(seed || 1) * 9301 + i * 49297 + 233) * 233; return (x - Math.floor(x)) * 0.7 + 0.3 })) }
  return waveformCache.get(key)
}
function particleStyle(i) { const seed = i * 137.508; return { '--x': `${seed % 100}%`, '--y': `${(seed * 1.618) % 100}%`, '--dur': `${14 + (i * 3.2) % 20}s`, '--del': `${(i * 1.1) % 5}s`, '--sz': `${1.5 + (i % 3)}px` } }

const tabDefs = computed(() => [{ key: 'image', label: lbl('images'), icon: '🖼️' }, { key: 'sound', label: lbl('sound'), icon: '🎵' }, { key: 'video', label: lbl('video'), icon: '🎬' }, { key: 'writing', label: lbl('writings'), icon: '📚' }, { key: 'memories', label: lbl('memories'), icon: '💫' }])

const displayedItems = computed(() => {
  let list = []
  switch (activeTab.value) { case 'image': list = [...images.value]; break; case 'sound': list = [...sounds.value]; break; case 'video': list = [...videos.value]; break; case 'writing': list = [...writings.value]; break; case 'memories': list = [...memorySounds.value, ...memoryVideos.value]; break }
  if (activeTopicFilter.value && activeTab.value !== 'memories') { const fid = String(activeTopicFilter.value); list = list.filter(item => { const tid = item.topicId ?? item.topic?.id; return tid != null && String(tid) === fid }) }
  switch (sortBy.value) { case 'newest': list.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || '')); break; case 'oldest': list.sort((a, b) => (a.createdAt || '').localeCompare(b.createdAt || '')); break; case 'title': list.sort((a, b) => pTitle(a).localeCompare(pTitle(b))); break }
  return list
})
const totalClientPages = computed(() => Math.ceil(displayedItems.value.length / clientPageSize))
const paginatedItems = computed(() => { const s = clientPage.value * clientPageSize; return displayedItems.value.slice(s, s + clientPageSize) })
const heroStats = computed(() => [{ value: images.value.length, label: lbl('images') }, { value: sounds.value.length, label: lbl('sound') }, { value: videos.value.length, label: lbl('video') }, { value: writings.value.length, label: lbl('writings') }])
const activeTopicName = computed(() => { if (!activeTopicFilter.value) return ''; const fid = String(activeTopicFilter.value); const all = [...imageTopics.value, ...soundTopics.value, ...videoTopics.value, ...writingTopics.value]; const t = all.find(t => String(t.id) === fid); return t ? topicName(t) : '' })
const relatedItems = computed(() => { if (!activeItem.value) return []; const myTags = new Set(pTags(activeItem.value)); const type = activeItem.value._mediaType; const pool = type === 'image' ? images.value : type === 'sound' ? sounds.value : type === 'video' ? videos.value : writings.value; return pool.filter(p => p.id !== activeItem.value.id && pTags(p).some(t => myTags.has(t))).slice(0, 4) })
const totalSoundDuration = computed(() => { if (!activeItem.value || activeItem.value._mediaType !== 'sound') return 0; return (activeItem.value.files || []).reduce((sum, f) => sum + (f.durationSeconds || 0), 0) })
const currentImageIdx = computed(() => { if (!selectedImage.value || !activeItem.value?.imageAlbum) return 0; return activeItem.value.imageAlbum.findIndex(i => i.id === selectedImage.value.id) })
const canPrevImage = computed(() => currentImageIdx.value > 0)
const canNextImage = computed(() => currentImageIdx.value < (activeItem.value?.imageAlbum?.length || 0) - 1)

function pTitle(item) { if (!item) return ''; const c = lang.activeLang === 'CKB'; return (c ? item.ckbContent?.title : item.kmrContent?.title) || (c ? item.kmrContent?.title : item.ckbContent?.title) || '' }
function pDesc(item) { if (!item) return ''; const c = lang.activeLang === 'CKB'; return (c ? item.ckbContent?.description : item.kmrContent?.description) || (c ? item.kmrContent?.description : item.ckbContent?.description) || '' }
function pCover(item) { if (!item) return fallbackCover; const c = lang.activeLang === 'CKB'; return (c ? item.ckbCoverUrl : item.kmrCoverUrl) || (c ? item.kmrCoverUrl : item.ckbCoverUrl) || item.hoverCoverUrl || fallbackCover }
function pHoverCover(item) { if (!item) return null; const cover = pCover(item); const hover = item.hoverCoverUrl; if (!hover || hover === cover || hover === fallbackCover) return null; return hover }
function pTags(item) { if (!item) return []; const c = lang.activeLang === 'CKB'; const ckb = item.tagsCkb || item.tags?.ckb || []; const kmr = item.tagsKmr || item.tags?.kmr || []; return [...(c ? ckb : kmr)] }
function pKeywords(item) { if (!item) return []; const c = lang.activeLang === 'CKB'; const ckb = item.keywordsCkb || item.keywords?.ckb || []; const kmr = item.keywordsKmr || item.keywords?.kmr || []; return [...(c ? ckb : kmr)] }
function pLocation(item) { return !item ? '' : (lang.activeLang === 'CKB' ? item.ckbContent?.location : item.kmrContent?.location) || '' }
function pCollectedBy(item) { return !item ? '' : (lang.activeLang === 'CKB' ? item.ckbContent?.collectedBy : item.kmrContent?.collectedBy) || '' }
function pDirector(item) { return !item ? '' : (lang.activeLang === 'CKB' ? item.ckbContent?.director : item.kmrContent?.director) || '' }
function pProducer(item) { return !item ? '' : (lang.activeLang === 'CKB' ? item.ckbContent?.producer : item.kmrContent?.producer) || '' }
function pWriter(item) { return !item ? '' : (lang.activeLang === 'CKB' ? item.ckbContent?.writer : item.kmrContent?.writer) || '' }
function pGenre(item) { return !item ? '' : (lang.activeLang === 'CKB' ? item.ckbContent?.genre : item.kmrContent?.genre) || '' }
function pPageCount(item) { return !item ? null : item.ckbContent?.pageCount || item.kmrContent?.pageCount || null }
function pFileFormat(item) { return !item ? '' : item.ckbContent?.fileFormat || item.kmrContent?.fileFormat || '' }
function topicName(topic) { if (!topic) return ''; return (lang.activeLang === 'CKB' ? topic.nameCkb : topic.nameKmr) || topic.nameCkb || topic.nameKmr || '' }
function getMediaIcon(type) { return { image: '🖼️', sound: '🎵', video: '🎬', writing: '📚' }[type] || '📎' }
function getMediaTypeLabel(type) { return { image: lbl('images'), sound: lbl('sound'), video: lbl('video'), writing: lbl('writings') }[type] || type }
function getTypeEmoji(item) { if (!item) return '📎'; if (item._mediaType === 'sound') return item.trackState === 'MULTI' ? '💿' : '🎵'; if (item._mediaType === 'video') return item.videoType === 'FILM' ? '🎞' : '📹'; if (item._mediaType === 'image') return item.collectionType === 'SINGLE' ? '🖼️' : '📷'; if (item._mediaType === 'writing') return '📖'; return '📎' }
function getTypeLabel(item) { if (!item) return ''; if (item._mediaType === 'sound') return item.trackState || 'SOUND'; if (item._mediaType === 'video') return item.videoType || 'VIDEO'; if (item._mediaType === 'image') return item.collectionType || 'IMAGE'; if (item._mediaType === 'writing') return item.writingTopic || 'WRITING'; return item._mediaType?.toUpperCase() || '' }
function getItemDate(item) { return item?.publishmentDate || item?.createdAt || null }
function getCountBadge(item) { if (!item) return null; if (item._mediaType === 'sound' && item.files?.length) return `🎵 ${item.files.length}`; if (item._mediaType === 'image' && item.imageAlbum?.length) return `🖼️ ${item.imageAlbum.length}`; if (item._mediaType === 'video' && item.videoClipItems?.length) return `📹 ${item.videoClipItems.length}`; return null }
function getExtraLine(item) { if (!item) return ''; if (item._mediaType === 'writing') return pWriter(item); if (item._mediaType === 'sound') return item.soundType || item.director || ''; if (item._mediaType === 'video') return pDirector(item); if (item._mediaType === 'image') return pLocation(item); return '' }
function tabCount(key) { if (key === 'image') return images.value.length; if (key === 'sound') return sounds.value.length; if (key === 'video') return videos.value.length; if (key === 'writing') return writings.value.length; if (key === 'memories') return memorySounds.value.length + memoryVideos.value.length; return 0 }
function getTopicsFor(key) { if (key === 'image') return imageTopics.value; if (key === 'sound') return soundTopics.value; if (key === 'video') return videoTopics.value; if (key === 'writing') return writingTopics.value; return [] }
function getVideoSourceUrl(item) { if (!item) return ''; const c = lang.activeLang === 'CKB'; return item.sourceUrl || item.videoUrl || item.fileUrl || (c ? item.ckbContent?.sourceUrl : item.kmrContent?.sourceUrl) || (c ? item.ckbContent?.videoUrl : item.kmrContent?.videoUrl) || (c ? item.kmrContent?.sourceUrl : item.ckbContent?.sourceUrl) || '' }
function getVideoEmbedUrl(item) { if (!item) return ''; const c = lang.activeLang === 'CKB'; return item.sourceEmbedUrl || item.embedUrl || (c ? item.ckbContent?.sourceEmbedUrl : item.kmrContent?.sourceEmbedUrl) || (c ? item.ckbContent?.embedUrl : item.kmrContent?.embedUrl) || (c ? item.kmrContent?.sourceEmbedUrl : item.ckbContent?.sourceEmbedUrl) || '' }
function getClipUrl(clip) { return !clip ? '' : clip.url || clip.sourceUrl || clip.videoUrl || clip.fileUrl || '' }
function getClipEmbedUrl(clip) { return !clip ? '' : clip.embedUrl || clip.sourceEmbedUrl || '' }
function truncate(text, max) { if (!text) return ''; return text.length > max ? text.slice(0, max) + '…' : text }
function formatDate(v) { if (!v) return ''; try { const d = new Date(v); if (isNaN(d.getTime())) return String(v); return d.toLocaleDateString(lang.activeLang === 'CKB' ? 'ckb' : 'ku', { year: 'numeric', month: 'long', day: 'numeric' }) } catch { return String(v) } }
function formatTime(s) { if (!s || isNaN(s)) return '0:00'; const m = Math.floor(s / 60); const sec = Math.floor(s % 60).toString().padStart(2, '0'); if (m >= 60) return `${Math.floor(m/60)}:${String(m%60).padStart(2,'0')}:${sec}`; return `${m}:${sec}` }
function formatSize(bytes) { if (!bytes) return ''; return bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(0)}KB` : `${(bytes / (1024 * 1024)).toFixed(1)}MB` }
function onImgError(e) { e.target.src = fallbackCover }

// ============================================================================
// DATA FETCHING - Updated with toArray() to handle inconsistent API formats
// ============================================================================

async function fetchAll() { isLoading.value = true; try { await Promise.allSettled([fetchImages(), fetchSounds(), fetchVideos(), fetchWritings(), fetchTopics()]) } finally { isLoading.value = false } }

async function fetchImages() { 
  try { 
    const { data } = await api.get('/image-collections')
    images.value = toArray(data).map(i => ({ ...i, _mediaType: 'image' }))
  } catch (e) { console.warn('images:', e.message) } 
}

async function fetchSounds() { 
  try { 
    const { data } = await api.get('/soundtracks')
    sounds.value = toArray(data).map(s => ({ ...s, _mediaType: 'sound' }))
  } catch (e) { console.warn('sounds:', e.message) } 
}

async function fetchVideos() { 
  try { 
    const { data } = await api.get('/videos', { params: { page: 0, size: 200 } })
    videos.value = toArray(data).map(v => ({ ...v, _mediaType: 'video' }))
  } catch (e) { console.warn('videos:', e.message) } 
}

async function fetchWritings() { 
  try { 
    const { data } = await api.get('/writings', { params: { page: 0, size: 200 } })
    writings.value = toArray(data).map(w => ({ ...w, _mediaType: 'writing' }))
  } catch (e) { console.warn('writings:', e.message) } 
}

async function fetchTopics() {
  try {
    const [imgT, sndT, vidT, wrtT] = await Promise.allSettled([
      api.get('/image-collections/topics'), 
      api.get('/soundtracks/topics'), 
      api.get('/videos/topics'), 
      api.get('/writings/topics')
    ])
    if (imgT.status === 'fulfilled') imageTopics.value = toArray(imgT.value.data)
    if (sndT.status === 'fulfilled') soundTopics.value = toArray(sndT.value.data)
    if (vidT.status === 'fulfilled') videoTopics.value = toArray(vidT.value.data)
    if (wrtT.status === 'fulfilled') writingTopics.value = toArray(wrtT.value.data)
  } catch (e) { console.warn('topics:', e.message) }
}

function switchTab(key) { activeTab.value = key; activeTopicFilter.value = null; clientPage.value = 0; openDropdownKey.value = null }
function setTopicFilter(id) { activeTopicFilter.value = id; clientPage.value = 0; openDropdownKey.value = null }
function clearTopicFilter() { activeTopicFilter.value = null; clientPage.value = 0 }
function clearFilters() { activeTopicFilter.value = null; clientPage.value = 0 }
function onTabEnter(key) { cancelDropClose(); openDropdownKey.value = key }
function scheduleDropClose() { cancelDropClose(); dropCloseTimer = setTimeout(() => { openDropdownKey.value = null }, 220) }
function cancelDropClose() { if (dropCloseTimer) { clearTimeout(dropCloseTimer); dropCloseTimer = null } }
function goPrev() { if (clientPage.value > 0) { clientPage.value--; scrollToContent() } }
function goNext() { if (clientPage.value + 1 < totalClientPages.value) { clientPage.value++; scrollToContent() } }
function scrollToContent() { gridSection.value?.scrollIntoView({ behavior: 'smooth' }) }

function openItem(item) { stopAudio(); activeItem.value = item; selectedClip.value = item.videoClipItems?.[0] || null; selectedImage.value = item.imageAlbum?.[0] || null; currentTrackIdx.value = -1; currentTrack.value = null; audioError.value = null; window.scrollTo({ top: 0, behavior: 'smooth' }) }
function closeItem() { stopAudio(); activeItem.value = null; selectedClip.value = null; selectedImage.value = null; currentTrackIdx.value = -1; currentTrack.value = null; audioError.value = null }
function openMemoryFromDropdown(item) { openDropdownKey.value = null; activeTab.value = 'memories'; openItem(item) }

function getAudioUrl(file) { if (!file) return ''; return file.fileUrl || file.externalUrl || file.url || file.audioUrl || file.src || file.path || '' }

async function playTrack(file, idx) {
  const url = getAudioUrl(file)
  if (!url) { audioError.value = 'Audio file not available'; return }
  audioError.value = null; currentTrackIdx.value = idx; currentTrack.value = file
  await nextTick()
  if (!audioPlayer.value) { audioError.value = 'Audio player not ready'; return }
  audioPlayer.value.pause(); audioPlayer.value.currentTime = 0
  audioPlayer.value.src = url; audioPlayer.value.load()
  try { await audioPlayer.value.play() } catch (err) { audioError.value = 'Failed to play audio: ' + (err.message || 'Unknown error'); isAudioPlaying.value = false }
}
function togglePlay() { if (!audioPlayer.value) return; if (audioPlayer.value.paused) { audioPlayer.value.play().catch(err => { audioError.value = 'Failed to resume playback' }) } else { audioPlayer.value.pause() } }
function prevTrack() { if (currentTrackIdx.value > 0 && activeItem.value?.files) playTrack(activeItem.value.files[currentTrackIdx.value - 1], currentTrackIdx.value - 1) }
function nextTrack() { if (activeItem.value?.files && currentTrackIdx.value < activeItem.value.files.length - 1) playTrack(activeItem.value.files[currentTrackIdx.value + 1], currentTrackIdx.value + 1) }
function onTrackEnded() { isAudioPlaying.value = false; nextTrack() }
function onAudioLoaded() { if (audioPlayer.value) audioDuration.value = audioPlayer.value.duration || 0 }
function onAudioTimeUpdate() { if (!audioPlayer.value) return; audioCurrentTime.value = audioPlayer.value.currentTime || 0; const dur = audioPlayer.value.duration; audioProgress.value = dur ? (audioCurrentTime.value / dur) * 100 : 0 }
function onAudioError() { const mediaError = audioPlayer.value?.error; let msg = 'Error loading audio file'; if (mediaError) { switch (mediaError.code) { case 1: msg = 'Audio loading was aborted'; break; case 2: msg = 'Network error while loading audio'; break; case 3: msg = 'Audio decoding error'; break; case 4: msg = 'Audio format not supported'; break } } audioError.value = msg; isAudioPlaying.value = false }
function seekAudio(e) { if (!audioPlayer.value || !audioPlayer.value.duration) return; const r = e.currentTarget.getBoundingClientRect(); const pct = (e.clientX - r.left) / r.width; audioPlayer.value.currentTime = pct * audioPlayer.value.duration }
function stopAudio() { if (audioPlayer.value) { audioPlayer.value.pause(); audioPlayer.value.removeAttribute('src'); audioPlayer.value.load() }; isAudioPlaying.value = false; audioCurrentTime.value = 0; audioDuration.value = 0; audioProgress.value = 0; currentTrackIdx.value = -1; currentTrack.value = null }
function prevImage() { if (canPrevImage.value) selectedImage.value = activeItem.value.imageAlbum[currentImageIdx.value - 1] }
function nextImage() { if (canNextImage.value) selectedImage.value = activeItem.value.imageAlbum[currentImageIdx.value + 1] }
function openFullscreen(img) { fullscreenUrl.value = img.imageUrl || img.externalUrl || ''; isFullscreen.value = true }

function handleKeydown(e) {
  if (e.key === 'Escape') { if (isFullscreen.value) { isFullscreen.value = false; return }; if (activeItem.value) closeItem() }
  if (!activeItem.value) return
  if (activeItem.value._mediaType === 'image') { if (e.key === 'ArrowLeft') prevImage(); if (e.key === 'ArrowRight') nextImage() }
}
function handleClickOutside(e) { if (!e.target.closest('.tabnav__item')) openDropdownKey.value = null }
watch(() => lang.activeLang, () => { if (isFullscreen.value) isFullscreen.value = false })

onMounted(() => { fetchAll(); window.addEventListener('keydown', handleKeydown); document.addEventListener('click', handleClickOutside) })
onUnmounted(() => { stopAudio(); if (slideTimer) clearInterval(slideTimer); if (dropCloseTimer) clearTimeout(dropCloseTimer); window.removeEventListener('keydown', handleKeydown); document.removeEventListener('click', handleClickOutside) })
</script>

<style scoped>
.pub {
  --brand: #8C1515; --brand-light: rgba(140,21,21,.09); --brand-dark: #6b0f0f;
  --accent: #c9a84c; --accent-light: rgba(201,168,76,.22);
  --bg: #ffffff; --surface: #ffffff; --surface-elevated: #ffffff;
  --text: #2E2D29; --text-muted: #5f6368;
  --border: rgba(0,0,0,.10); --border-light: rgba(0,0,0,.06);
  --shadow-sm: 0 2px 8px rgba(0,0,0,.06); --shadow: 0 10px 26px rgba(0,0,0,.10); --shadow-lg: 0 20px 56px rgba(0,0,0,.17);
  --radius-sm: 8px; --radius: 16px; --radius-lg: 24px;
  --container: 1280px;
  --font-sans: system-ui, -apple-system, "Segoe UI", Tahoma, sans-serif;
  --font-serif: Georgia, "Times New Roman", serif;
  --font-display: Georgia, "Times New Roman", serif;
  background: var(--bg); color: var(--text); min-height: 100vh; font-family: var(--font-sans); line-height: 1.6;
}
.pub[dir="rtl"] { direction: rtl; text-align: right; }
.pub[dir="ltr"] { direction: ltr; text-align: left; }
.container { max-width: var(--container); margin: 0 auto; padding: 0 24px; }

/* HERO */
.hero { position: relative; min-height: 85vh; overflow: hidden; display: grid; place-items: center; background: linear-gradient(135deg, var(--brand-dark) 0%, var(--brand) 100%); }
.hero__canvas { position: absolute; inset: 0; overflow: hidden; }
.hero__slides { position: absolute; inset: 0; }
.hero__slide { position: absolute; inset: 0; background-size: cover; background-position: center; opacity: 0; transform: scale(1.1); transition: opacity 1.2s ease, transform 8s ease; }
.hero__slide--active { opacity: 1; transform: scale(1); z-index: 2; }
.hero__slide--prev { opacity: 0; transform: scale(1.05); z-index: 1; }
.hero__slide--kb-a { animation: kenBurnsA 20s ease-in-out infinite alternate; }
.hero__slide--kb-b { animation: kenBurnsB 20s ease-in-out infinite alternate; }
@keyframes kenBurnsA { 0% { transform: scale(1) translate(0,0); } 100% { transform: scale(1.1) translate(-2%,-2%); } }
@keyframes kenBurnsB { 0% { transform: scale(1.1) translate(0,0); } 100% { transform: scale(1) translate(2%,2%); } }
.hero__overlay { position: absolute; inset: 0; z-index: 3; }
.hero__overlay--base { background: linear-gradient(to bottom, rgba(15,46,36,0.4) 0%, rgba(15,46,36,0.2) 50%, rgba(15,46,36,0.8) 100%); }
.hero__overlay--vignette { background: radial-gradient(ellipse at center, transparent 40%, rgba(15,46,36,0.6) 100%); }
.hero__overlay--bottom { background: linear-gradient(to top, var(--brand-dark) 0%, transparent 40%); opacity: 0.9; }
.hero__overlay--top { background: linear-gradient(to bottom, rgba(15,46,36,0.6) 0%, transparent 30%); }
.hero__grain { position: absolute; inset: 0; opacity: 0.05; z-index: 4; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E"); pointer-events: none; }
.hero__scanlines { position: absolute; inset: 0; background: linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.1) 50%); background-size: 100% 4px; opacity: 0.1; z-index: 4; pointer-events: none; }
.hero__filigree { position: absolute; z-index: 5; background: linear-gradient(90deg, transparent, var(--accent), transparent); opacity: 0.3; }
.hero__filigree--h1 { top: 15%; left: 10%; right: 10%; height: 1px; }
.hero__filigree--h2 { bottom: 20%; left: 15%; right: 15%; height: 1px; }
.hero__filigree--v1 { left: 10%; top: 15%; bottom: 20%; width: 1px; background: linear-gradient(to bottom, transparent, var(--accent), transparent); }
.hero__filigree--v2 { right: 10%; top: 15%; bottom: 20%; width: 1px; background: linear-gradient(to bottom, transparent, var(--accent), transparent); }
.hero__corner { position: absolute; width: 60px; height: 60px; border: 2px solid var(--accent); opacity: 0.4; z-index: 5; }
.hero__corner--tl { top: 40px; left: 40px; border-right: 0; border-bottom: 0; }
.hero__corner--tr { top: 40px; right: 40px; border-left: 0; border-bottom: 0; }
.hero__corner--bl { bottom: 40px; left: 40px; border-right: 0; border-top: 0; }
.hero__corner--br { bottom: 40px; right: 40px; border-left: 0; border-top: 0; }
.hero__particles { position: absolute; inset: 0; z-index: 3; overflow: hidden; pointer-events: none; }
.hparticle { position: absolute; width: var(--sz, 2px); height: var(--sz, 2px); background: var(--accent); border-radius: 50%; left: var(--x); top: var(--y); opacity: 0; animation: floatUp var(--dur, 15s) var(--del, 0s) ease-in-out infinite; box-shadow: 0 0 10px var(--accent); }
@keyframes floatUp { 0% { transform: translateY(100vh) scale(0); opacity: 0; } 10% { opacity: 0.6; } 90% { opacity: 0.6; } 100% { transform: translateY(-100vh) scale(1); opacity: 0; } }
.hero__dots { position: absolute; bottom: 120px; left: 50%; transform: translateX(-50%); z-index: 10; display: flex; gap: 12px; }
.hero__dot { width: 10px; height: 10px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.5); background: transparent; cursor: pointer; transition: all 0.3s ease; padding: 0; }
.hero__dot:hover { border-color: var(--accent); transform: scale(1.2); }
.hero__dot--on { background: var(--accent); border-color: var(--accent); transform: scale(1.3); }
.hero__inner { position: relative; z-index: 10; text-align: center; color: white; padding: 120px 24px 80px; }
.hero__eyebrow { display: flex; flex-direction: column; align-items: center; gap: 20px; margin-bottom: 32px; }
.hero__stamp { width: 100px; height: 100px; position: relative; }
.stamp__ring { width: 100%; height: 100%; border: 3px solid var(--accent); border-radius: 50%; display: grid; place-items: center; position: relative; animation: rotateStamp 20s linear infinite; }
.stamp__ring::before { content: ''; position: absolute; inset: 8px; border: 1px solid rgba(201,162,39,0.5); border-radius: 50%; }
@keyframes rotateStamp { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
.stamp__inner { text-align: center; animation: rotateStamp 20s linear infinite reverse; }
.stamp__text { display: block; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; font-weight: 700; color: var(--accent); margin-bottom: 4px; }
.stamp__year { display: block; font-family: var(--font-serif); font-size: 24px; font-weight: 700; color: white; }
.hero__kicker { display: flex; align-items: center; gap: 12px; font-size: 13px; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(255,255,255,0.8); font-weight: 600; }
.kicker__rule { width: 60px; height: 1px; background: linear-gradient(90deg, transparent, var(--accent), transparent); }
.kicker__diamond { color: var(--accent); font-size: 8px; }
.hero__headline { margin: 0 0 32px; font-family: var(--font-display); font-weight: 700; line-height: 1.1; }
.headline__line--main { display: block; font-size: clamp(40px, 8vw, 80px); margin-bottom: 16px; text-shadow: 0 4px 20px rgba(0,0,0,0.3); background: linear-gradient(to bottom, #fff 0%, rgba(255,255,255,0.9) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.headline__line--sub { display: block; font-size: clamp(18px, 3vw, 28px); font-weight: 400; opacity: 0.9; color: rgba(255,255,255,0.9); }
.headline__word { display: inline-flex; align-items: center; gap: 12px; }
.headline__separator { color: var(--accent); opacity: 0.8; }
.hero__divider { display: flex; align-items: center; justify-content: center; gap: 16px; margin-bottom: 40px; }
.hdiv__line { width: 100px; height: 1px; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent); }
.hdiv__ornament { color: var(--accent); font-size: 20px; opacity: 0.8; }
.hero__stats { display: flex; justify-content: center; gap: 40px; flex-wrap: wrap; }
.hstat { text-align: center; position: relative; }
.hstat__inner { padding: 16px 24px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); border-radius: var(--radius); backdrop-filter: blur(10px); transition: transform 0.3s ease, background 0.3s ease; }
.hstat:hover .hstat__inner { transform: translateY(-4px); background: rgba(255,255,255,0.12); border-color: var(--accent); }
.hstat__num { font-family: var(--font-serif); font-size: 36px; font-weight: 700; color: var(--accent); line-height: 1; margin-bottom: 6px; }
.hstat__lbl { font-size: 13px; text-transform: uppercase; letter-spacing: 0.1em; opacity: 0.9; color: rgba(255,255,255,0.8); }
.hero__scroll { position: absolute; bottom: 40px; left: 50%; transform: translateX(-50%); z-index: 10; background: transparent; border: none; color: white; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 8px; opacity: 0.8; transition: opacity 0.3s ease; padding: 12px; }
.hero__scroll:hover { opacity: 1; }
.scroll__label { font-size: 12px; letter-spacing: 0.15em; text-transform: uppercase; font-weight: 600; }
.scroll__arrow { animation: bounceArrow 2s infinite; }
@keyframes bounceArrow { 0%, 20%, 50%, 80%, 100% { transform: translateY(0); } 40% { transform: translateY(10px); } 60% { transform: translateY(5px); } }

.audio-error { background: rgba(220,38,38,0.1); border: 1px solid rgba(220,38,38,0.3); color: #dc2626; padding: 12px 16px; border-radius: var(--radius); margin-bottom: 16px; font-weight: 600; text-align: center; }

/* TAB NAV */
.tabnav { background: var(--surface); border-bottom: 1px solid var(--border); position: sticky; top: 0; z-index: 100; box-shadow: var(--shadow-sm); }
.tabnav__row { display: flex; gap: 8px; padding: 8px 0; position: relative; }
.tabnav__item { position: relative; flex: 1; max-width: 200px; }
.tabtn { width: 100%; display: flex; align-items: center; gap: 10px; padding: 16px 20px; background: transparent; border: 1px solid transparent; border-radius: var(--radius); cursor: pointer; transition: all 0.2s ease; font-size: 15px; font-weight: 600; color: var(--text-muted); position: relative; }
.tabtn:hover { background: var(--bg); color: var(--brand); }
.tabtn--on { background: var(--brand); color: white; border-color: var(--brand); box-shadow: var(--shadow); }
.tabtn__ico { width: 20px; height: 20px; display: grid; place-items: center; }
.tabtn__ico svg { width: 100%; height: 100%; stroke-width: 2; }
.tabtn__lbl { flex: 1; text-align: start; }
.tabtn__chevron { transition: transform 0.3s ease; opacity: 0.5; }
.tabnav__item:hover .tabtn__chevron { transform: rotate(180deg); opacity: 1; }
.tabtn__count { background: var(--accent); color: var(--brand-dark); font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 999px; min-width: 20px; text-align: center; }
.tabdrop { position: absolute; top: calc(100% + 8px); left: 0; min-width: 280px; background: var(--surface-elevated); border: 1px solid var(--border); border-radius: var(--radius); box-shadow: var(--shadow-lg); z-index: 200; overflow: hidden; }
.pub[dir="rtl"] .tabdrop { left: auto; right: 0; }
.tabdrop__inner { padding: 8px; max-height: 60vh; overflow-y: auto; }
.tabdrop__header { display: flex; align-items: center; gap: 10px; padding: 12px 16px; font-weight: 700; color: var(--brand); font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; }
.tabdrop__divider { height: 1px; background: var(--border); margin: 8px 0; }
.tabdrop__item { width: 100%; display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-radius: var(--radius-sm); border: none; background: transparent; cursor: pointer; transition: all 0.2s ease; text-align: start; font-size: 14px; color: var(--text); }
.tabdrop__item:hover { background: var(--bg); transform: translateX(4px); }
.pub[dir="rtl"] .tabdrop__item:hover { transform: translateX(-4px); }
.tabdrop__item--on { background: rgba(27,77,62,0.08); color: var(--brand); font-weight: 600; }
.tabdrop__item-ico { width: 18px; height: 18px; opacity: 0.6; flex-shrink: 0; }
.tabdrop__item-name { flex: 1; }
.tabdrop__item-count { background: var(--bg); color: var(--text-muted); font-size: 12px; padding: 2px 8px; border-radius: 999px; font-weight: 600; }
.tabdrop__mem-section { margin-top: 8px; }
.tabdrop__mem-section-title { display: flex; align-items: center; gap: 8px; padding: 8px 16px; font-size: 12px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; }
.tabdrop__sec-count { margin-inline-start: auto; background: var(--accent); color: var(--brand-dark); padding: 2px 6px; border-radius: 999px; font-size: 11px; }
.tabdrop__item--mem { padding: 10px 16px; }
.tabdrop__mem-cover { width: 40px; height: 40px; border-radius: var(--radius-sm); overflow: hidden; position: relative; flex-shrink: 0; background: var(--bg); }
.tabdrop__mem-cover img { width: 100%; height: 100%; object-fit: cover; }
.tabdrop__mem-play { position: absolute; inset: 0; background: rgba(27,77,62,0.7); color: white; display: grid; place-items: center; font-size: 12px; opacity: 0; transition: opacity 0.2s; }
.tabdrop__item:hover .tabdrop__mem-play { opacity: 1; }
.tabdrop__mem-badge { font-size: 12px; }
.tabdrop__empty { padding: 16px; text-align: center; color: var(--text-muted); font-size: 13px; }

/* BODY */
.body { padding: 40px 0 80px; }
.active-filter { margin-bottom: 24px; }
.afilt { display: inline-flex; align-items: center; gap: 10px; background: rgba(27,77,62,0.08); border: 1px solid var(--border); padding: 8px 16px; border-radius: 999px; font-size: 14px; font-weight: 600; color: var(--brand); animation: fadeIn 0.3s ease; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
.afilt__dot { width: 8px; height: 8px; background: var(--accent); border-radius: 50%; box-shadow: 0 0 8px var(--accent); }
.afilt__x { width: 20px; height: 20px; border-radius: 50%; border: none; background: transparent; cursor: pointer; display: grid; place-items: center; color: var(--text-muted); transition: all 0.2s; margin-inline-start: 4px; }
.afilt__x:hover { background: var(--brand); color: white; }
.toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; padding: 16px 0; border-bottom: 1px solid var(--border-light); }
.toolbar__left { display: flex; align-items: center; gap: 12px; }
.toolbar__indicator { width: 8px; height: 8px; border-radius: 50%; background: #22c55e; box-shadow: 0 0 0 4px rgba(34,197,94,0.2); }
.toolbar__indicator.ind--ok { animation: pulse 2s infinite; }
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
.toolbar__label { color: var(--text-muted); font-size: 15px; }
.toolbar__label strong { color: var(--brand); font-weight: 700; }
.tsort { position: relative; }
.tsort__sel { appearance: none; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 12px 40px 12px 16px; font-size: 14px; font-weight: 600; color: var(--text); cursor: pointer; min-width: 160px; transition: all 0.2s; }
.pub[dir="rtl"] .tsort__sel { padding: 12px 16px 12px 40px; }
.tsort__sel:hover { border-color: var(--brand-light); box-shadow: var(--shadow-sm); }
.tsort__sel:focus { outline: none; border-color: var(--brand); box-shadow: 0 0 0 3px rgba(27,77,62,0.1); }
.tsort__ico { position: absolute; right: 16px; top: 50%; transform: translateY(-50%); pointer-events: none; color: var(--text-muted); }
.pub[dir="rtl"] .tsort__ico { right: auto; left: 16px; }

/* GRID & CARDS */
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 24px; }
.skel { background: var(--surface); border-radius: var(--radius); overflow: hidden; border: 1px solid var(--border-light); animation: fadeIn 0.5s ease both; animation-delay: var(--d, 0s); }
.skel__thumb { aspect-ratio: 16/10; background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; }
@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
.skel__body { padding: 20px; }
.skel__line { height: 12px; background: #f0f0f0; border-radius: 6px; margin-bottom: 8px; }
.skel__pills { display: flex; gap: 8px; margin-top: 16px; }
.skel__pill { width: 60px; height: 24px; background: #f0f0f0; border-radius: 999px; }
.card { background: var(--surface); border: 1px solid var(--border-light); border-radius: var(--radius); overflow: hidden; cursor: pointer; transition: all 0.3s cubic-bezier(0.4,0,0.2,1); position: relative; animation: fadeInUp 0.5s ease both; animation-delay: var(--d, 0s); }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
.card:hover { transform: translateY(-8px); box-shadow: var(--shadow-lg); border-color: var(--border); }
.card:focus-visible { outline: 3px solid var(--brand); outline-offset: 3px; }
.card--featured { grid-column: span 2; grid-row: span 2; }
@media (max-width: 768px) { .card--featured { grid-column: span 1; grid-row: span 1; } }
.card__thumb { position: relative; aspect-ratio: 16/10; overflow: hidden; background: linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%); }
.card__img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s ease; }
.card__img--hover { position: absolute; inset: 0; opacity: 0; transition: opacity 0.4s ease; }
.card:hover .card__img--main { transform: scale(1.1); }
.card:hover .card__img--hover { opacity: 1; transform: scale(1.1); }
.card__film { position: absolute; inset: 0; opacity: 0; pointer-events: none; transition: opacity 0.3s; mix-blend-mode: overlay; }
.card:hover .card__film { opacity: 0.03; }
.card__scrim { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%); opacity: 0; transition: opacity 0.3s; }
.card:hover .card__scrim { opacity: 1; }
.card__badges { position: absolute; top: 12px; left: 12px; right: 12px; display: flex; justify-content: space-between; z-index: 3; }
.pub[dir="rtl"] .card__badges { flex-direction: row-reverse; }
.card__typebadge, .card__mediabadge { background: rgba(255,255,255,0.95); color: var(--brand-dark); padding: 6px 12px; border-radius: 999px; font-size: 12px; font-weight: 700; backdrop-filter: blur(10px); box-shadow: 0 2px 8px rgba(0,0,0,0.1); border: 1px solid rgba(255,255,255,0.3); }
.card__mediabadge { background: var(--accent); color: var(--brand-dark); }
.card__countbadge { position: absolute; bottom: 12px; right: 12px; background: rgba(0,0,0,0.7); color: white; padding: 6px 12px; border-radius: 999px; font-size: 12px; font-weight: 600; backdrop-filter: blur(4px); }
.pub[dir="rtl"] .card__countbadge { right: auto; left: 12px; }
.card__memorybadge { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%) scale(0); width: 50px; height: 50px; background: var(--accent); border-radius: 50%; display: grid; place-items: center; font-size: 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.3); transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1); z-index: 4; }
.card:hover .card__memorybadge { transform: translate(-50%,-50%) scale(1); }
.card__view { position: absolute; inset: 0; display: grid; place-items: center; opacity: 0; transition: opacity 0.3s; z-index: 5; }
.card:hover .card__view { opacity: 1; }
.card__viewbtn { background: var(--brand); color: white; padding: 14px 28px; border-radius: 999px; font-weight: 700; font-size: 14px; display: flex; align-items: center; gap: 8px; transform: translateY(10px); transition: transform 0.3s, background 0.3s; box-shadow: var(--shadow); }
.card:hover .card__viewbtn { transform: translateY(0); }
.card__accent { position: absolute; bottom: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, var(--brand), var(--accent)); transform: scaleX(0); transition: transform 0.4s ease; }
.card:hover .card__accent { transform: scaleX(1); }
.card__body { padding: 20px; }
.card__meta { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; font-size: 13px; color: var(--text-muted); flex-wrap: wrap; }
.card__date { font-weight: 600; }
.card__lang { background: var(--bg); padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; border: 1px solid var(--border-light); }
.card__title { font-family: var(--font-serif); font-size: 20px; font-weight: 700; line-height: 1.3; margin: 0 0 10px; color: var(--text); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.card__desc { font-size: 15px; color: var(--text-muted); line-height: 1.6; margin: 0 0 16px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.card__extra { margin-bottom: 12px; }
.card__extra-val { font-size: 13px; color: var(--brand); font-weight: 600; display: flex; align-items: center; gap: 6px; }
.card__tags { display: flex; flex-wrap: wrap; gap: 8px; }
.ctag { font-size: 12px; color: var(--text-muted); background: var(--bg); padding: 6px 12px; border-radius: 999px; border: 1px solid var(--border-light); transition: all 0.2s; }
.ctag:hover { background: var(--brand); color: white; border-color: var(--brand); }
.ctag--more { background: var(--accent); color: var(--brand-dark); font-weight: 700; }
.card__foot { padding: 16px 20px; border-top: 1px solid var(--border-light); display: flex; justify-content: space-between; align-items: center; background: linear-gradient(to bottom, transparent, rgba(27,77,62,0.02)); }
.card__cta { font-size: 14px; font-weight: 700; color: var(--brand); text-transform: uppercase; letter-spacing: 0.05em; }
.card__arrow { color: var(--brand); transition: transform 0.3s; }
.card:hover .card__arrow { transform: translateX(4px); }
.pub[dir="rtl"] .card:hover .card__arrow { transform: translateX(-4px); }

/* DETAIL */
.detail { min-height: 100vh; background: var(--bg); }
.dnav { background: var(--surface); border-bottom: 1px solid var(--border); padding: 16px 0; position: sticky; top: 0; z-index: 100; backdrop-filter: blur(10px); background: rgba(255,255,255,0.95); }
.dnav__inner { display: flex; justify-content: space-between; align-items: center; }
.back-btn { display: flex; align-items: center; gap: 10px; padding: 10px 20px; border: 1px solid var(--border); border-radius: 999px; background: transparent; cursor: pointer; font-size: 15px; font-weight: 600; color: var(--text); transition: all 0.2s; }
.back-btn:hover { background: var(--brand); color: white; border-color: var(--brand); transform: translateX(-4px); }
.pub[dir="rtl"] .back-btn:hover { transform: translateX(4px); }
.dnav__right { display: flex; align-items: center; gap: 16px; }
.dtype-pill { background: var(--brand); color: white; padding: 8px 16px; border-radius: 999px; font-size: 13px; font-weight: 700; display: flex; align-items: center; gap: 6px; }
.langpills { display: flex; gap: 8px; }
.langpill { display: flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 999px; font-size: 13px; font-weight: 600; background: var(--bg); border: 1px solid var(--border); color: var(--text-muted); }
.langpill--on { background: var(--accent); color: var(--brand-dark); border-color: var(--accent); }
.langpill__dot { width: 8px; height: 8px; border-radius: 50%; background: currentColor; }

.dhero { position: relative; min-height: 60vh; display: grid; place-items: center; overflow: hidden; background: linear-gradient(135deg, var(--brand-dark) 0%, var(--brand) 100%); }
.dhero__bg { position: absolute; inset: 0; background-size: cover; background-position: center; opacity: 0.3; filter: blur(10px); transform: scale(1.1); }
.dhero__gradient { position: absolute; inset: 0; background: linear-gradient(to right, var(--brand-dark) 0%, transparent 50%, var(--brand-dark) 100%); opacity: 0.9; }
.dhero__gradient--side { background: linear-gradient(to top, var(--brand-dark) 0%, transparent 60%); }
.dhero__grain, .dhero__scanlines { position: absolute; inset: 0; pointer-events: none; opacity: 0.05; }
.dhero__scanlines { background: linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.1) 50%); background-size: 100% 4px; }
.dhero__frame { position: absolute; width: 80px; height: 80px; border: 2px solid var(--accent); opacity: 0.3; }
.dhero__frame--tl { top: 40px; left: 40px; border-right: 0; border-bottom: 0; }
.dhero__frame--br { bottom: 40px; right: 40px; border-left: 0; border-top: 0; }
.dhero__gold-line { position: absolute; height: 1px; background: linear-gradient(90deg, transparent, var(--accent), transparent); left: 20%; right: 20%; opacity: 0.4; }
.dhero__gold-line--top { top: 40px; }
.dhero__gold-line--bottom { bottom: 40px; }
.dhero__content { position: relative; z-index: 10; display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 60px; align-items: center; padding: 80px 24px; color: white; }
@media (max-width: 968px) { .dhero__content { grid-template-columns: 1fr; text-align: center; } }
.dhero__badges { display: flex; gap: 12px; margin-bottom: 24px; flex-wrap: wrap; }
.dbadge { background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.2); padding: 8px 16px; border-radius: 999px; font-size: 13px; font-weight: 600; backdrop-filter: blur(10px); }
.dbadge--type { background: var(--accent); color: var(--brand-dark); border-color: var(--accent); }
.dbadge--mem { background: rgba(201,162,39,0.2); border-color: var(--accent); color: var(--accent); }
.dhero__title { font-family: var(--font-display); font-size: clamp(32px, 5vw, 56px); font-weight: 700; line-height: 1.2; margin: 0 0 20px; text-shadow: 0 4px 20px rgba(0,0,0,0.3); }
.dhero__desc { font-size: 18px; line-height: 1.7; opacity: 0.9; margin-bottom: 32px; max-width: 600px; }
.dhero__stats { display: flex; gap: 24px; flex-wrap: wrap; }
.dstat { display: flex; align-items: center; gap: 10px; background: rgba(255,255,255,0.1); padding: 12px 20px; border-radius: var(--radius); border: 1px solid rgba(255,255,255,0.15); backdrop-filter: blur(10px); }
.dstat__ico { font-size: 20px; }
.dstat__val { font-weight: 700; font-size: 16px; }
.dstat__lbl { font-size: 13px; opacity: 0.8; text-transform: uppercase; letter-spacing: 0.05em; }
.dhero__tags { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 24px; }
.dtag { background: transparent; border: 1px solid rgba(255,255,255,0.3); padding: 8px 16px; border-radius: 999px; font-size: 14px; font-weight: 600; transition: all 0.2s; }
.dtag:hover { background: var(--accent); border-color: var(--accent); color: var(--brand-dark); }
.dhero__right { display: grid; place-items: center; }

.mockup-sound { position: relative; width: 300px; height: 300px; perspective: 1000px; }
.msound__case { position: relative; width: 260px; height: 260px; background: linear-gradient(145deg, #2a2a2a, #1a1a1a); border-radius: 8px; box-shadow: 0 20px 40px rgba(0,0,0,0.4); overflow: hidden; }
.msound__spine { position: absolute; left: 0; top: 0; bottom: 0; width: 20px; background: linear-gradient(to right, #111, #333); border-radius: 8px 0 0 8px; }
.msound__front { position: absolute; left: 20px; top: 0; right: 0; bottom: 0; overflow: hidden; border-radius: 0 8px 8px 0; }
.msound__front img { width: 100%; height: 100%; object-fit: cover; }
.msound__overlay { position: absolute; inset: 0; background: linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 50%, rgba(0,0,0,0.15) 100%); }
.msound__disc { position: absolute; right: -60px; top: 50%; transform: translateY(-50%); width: 220px; height: 220px; border-radius: 50%; background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #111 100%); box-shadow: 0 10px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05); display: grid; place-items: center; }
.msound__disc-ring { position: absolute; inset: 20px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.05); background: repeating-conic-gradient(rgba(255,255,255,0.015) 0deg, transparent 1deg, transparent 2deg); }
.msound__disc-art { position: absolute; inset: 40px; border-radius: 50%; overflow: hidden; }
.msound__disc-art img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; opacity: 0.85; }
.msound__disc-hole { position: absolute; width: 20px; height: 20px; background: #111; border-radius: 50%; border: 2px solid rgba(255,255,255,0.1); z-index: 2; }

/* BOOK MOCKUP */
.mockup-book { position: relative; width: 220px; height: 300px; perspective: 1200px; }
.mbook__cover { position: absolute; left: 30px; top: 0; right: 0; bottom: 0; border-radius: 0 4px 4px 0; overflow: hidden; box-shadow: 6px 12px 40px rgba(0,0,0,0.5); transform: rotateY(-8deg); transform-origin: left center; transition: transform 0.4s ease; }
.mockup-book:hover .mbook__cover { transform: rotateY(-18deg); }
.mbook__cover img { width: 100%; height: 100%; object-fit: cover; }
.mbook__sheen { position: absolute; inset: 0; background: linear-gradient(105deg, rgba(255,255,255,0.12) 0%, transparent 40%, rgba(255,255,255,0.04) 100%); pointer-events: none; }
.mbook__spine { position: absolute; left: 0; top: 0; bottom: 0; width: 30px; background: linear-gradient(to right, #1a0f0f, #3b1515, #2a1010); border-radius: 4px 0 0 4px; box-shadow: inset -4px 0 10px rgba(0,0,0,0.4); }
.mbook__pages { position: absolute; right: -6px; top: 4px; bottom: 4px; width: 10px; background: repeating-linear-gradient(to bottom, #f5f0e8 0px, #e8e0d0 1px, #f5f0e8 2px); border-radius: 0 2px 2px 0; box-shadow: 2px 0 6px rgba(0,0,0,0.2); }

/* VIDEO MOCKUP */
.mockup-video { position: relative; width: 280px; display: flex; flex-direction: column; align-items: center; gap: 0; }
.mvideo__frame { width: 100%; border-radius: 12px; overflow: hidden; position: relative; box-shadow: 0 20px 50px rgba(0,0,0,0.5); border: 3px solid rgba(255,255,255,0.08); background: #000; aspect-ratio: 16/10; }
.mvideo__frame img { width: 100%; height: 100%; object-fit: cover; opacity: 0.85; }
.mvideo__play-ico { position: absolute; inset: 0; display: grid; place-items: center; font-size: 40px; color: white; text-shadow: 0 4px 20px rgba(0,0,0,0.5); opacity: 0.9; transition: opacity 0.3s, transform 0.3s; }
.mockup-video:hover .mvideo__play-ico { opacity: 1; transform: scale(1.15); }
.mvideo__stand { width: 60px; height: 8px; background: rgba(255,255,255,0.12); border-radius: 0 0 8px 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.3); }

/* IMAGE MOCKUP */
.mockup-image { position: relative; }
.mimage__frame { background: linear-gradient(135deg, #f0ece4, #e8e0d4); border-radius: 4px; padding: 16px; box-shadow: 0 20px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.3); }
.mimage__mat { position: absolute; inset: 8px; border: 1px solid rgba(0,0,0,0.1); pointer-events: none; z-index: 1; }
.mimage__photo { width: 240px; height: 200px; overflow: hidden; border-radius: 2px; box-shadow: inset 0 2px 10px rgba(0,0,0,0.15); }
.mimage__photo img { width: 100%; height: 100%; object-fit: cover; }

/* ORB ANIMATIONS */
.hero__orb { position: absolute; border-radius: 50%; pointer-events: none; z-index: 2; }
.orb--a { width: 400px; height: 400px; top: -100px; left: -100px; background: radial-gradient(circle, rgba(140,21,21,0.3) 0%, transparent 70%); animation: orbFloat 18s ease-in-out infinite; }
.orb--b { width: 300px; height: 300px; bottom: -80px; right: -80px; background: radial-gradient(circle, rgba(201,162,39,0.2) 0%, transparent 70%); animation: orbFloat 22s ease-in-out infinite reverse; }
.orb--c { width: 200px; height: 200px; top: 40%; left: 55%; background: radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%); animation: orbFloat 14s ease-in-out infinite 4s; }
.orb--gold { width: 500px; height: 500px; top: 50%; left: 50%; transform: translate(-50%, -50%); background: radial-gradient(ellipse, rgba(201,162,39,0.06) 0%, transparent 65%); animation: orbPulse 10s ease-in-out infinite; }
@keyframes orbFloat { 0%, 100% { transform: translate(0, 0) scale(1); } 33% { transform: translate(30px, -20px) scale(1.05); } 66% { transform: translate(-20px, 30px) scale(0.95); } }
@keyframes orbPulse { 0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 1; } 50% { transform: translate(-50%, -50%) scale(1.15); opacity: 0.7; } }

/* GRADIENT FALLBACK SLIDES */
.hero__slide--gradient { opacity: 1; transform: none; }
.hero__slide--grad-image { background: linear-gradient(135deg, #1a3a2a 0%, #2d5a42 50%, #1a3a2a 100%); }
.hero__slide--grad-sound { background: linear-gradient(135deg, #3a1a2a 0%, #5a2d42 50%, #3a1a2a 100%); }
.hero__slide--grad-video { background: linear-gradient(135deg, #1a2a3a 0%, #2d425a 50%, #1a2a3a 100%); }
.hero__slide--grad-writing { background: linear-gradient(135deg, #2a2a1a 0%, #4a4a2d 50%, #2a2a1a 100%); }
.hero__slide--grad-memories { background: linear-gradient(135deg, #2a1a3a 0%, #422d5a 50%, #2a1a3a 100%); }

/* STREAM SECTION */
.stream-section { padding: 60px 0; background: var(--bg); }
.stream-layout { display: grid; grid-template-columns: 1fr 320px; gap: 40px; align-items: start; }
@media (max-width: 968px) { .stream-layout { grid-template-columns: 1fr; } }
.stream-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
.section-heading { font-family: var(--font-serif); font-size: 26px; font-weight: 700; color: var(--text); margin: 0; }
.stream-count { background: var(--brand-light); color: var(--brand); padding: 8px 16px; border-radius: 999px; font-size: 13px; font-weight: 700; border: 1px solid rgba(140,21,21,0.12); }

/* TRACK LIST */
.track-list { display: flex; flex-direction: column; gap: 4px; background: var(--surface); border: 1px solid var(--border-light); border-radius: var(--radius); overflow: hidden; }
.track { display: flex; align-items: center; gap: 16px; padding: 16px 20px; cursor: pointer; transition: all 0.25s ease; border-bottom: 1px solid var(--border-light); position: relative; }
.track:last-child { border-bottom: none; }
.track:hover { background: var(--bg); }
.track--selected { background: var(--brand-light); }
.track--playing { background: linear-gradient(to right, rgba(140,21,21,0.08), transparent); }
.track__num { font-size: 13px; color: var(--text-muted); font-weight: 600; width: 28px; text-align: center; flex-shrink: 0; font-variant-numeric: tabular-nums; }
.track--playing .track__num, .track--selected .track__num { color: var(--brand); }
.track__cover { width: 48px; height: 48px; border-radius: var(--radius-sm); overflow: hidden; position: relative; flex-shrink: 0; box-shadow: var(--shadow-sm); }
.track__cover img { width: 100%; height: 100%; object-fit: cover; }
.track__play-ico { position: absolute; inset: 0; background: rgba(140,21,21,0.8); color: white; display: grid; place-items: center; font-size: 14px; opacity: 0; transition: opacity 0.2s; }
.track:hover .track__play-ico { opacity: 1; }
.track--playing .track__play-ico { opacity: 1; }
.track__indicator { width: 20px; flex-shrink: 0; display: flex; align-items: flex-end; justify-content: center; gap: 2px; height: 20px; }
.track__bar { width: 3px; background: var(--text-muted); border-radius: 2px; height: 40%; transition: height 0.2s; }
.track__bar--live:nth-child(1) { height: 60%; animation: barDance 0.6s ease-in-out infinite alternate; }
.track__bar--live:nth-child(2) { height: 100%; animation: barDance 0.8s ease-in-out infinite alternate 0.15s; background: var(--brand); }
.track__bar--live:nth-child(3) { height: 40%; animation: barDance 0.5s ease-in-out infinite alternate 0.3s; }
@keyframes barDance { 0% { transform: scaleY(0.5); } 100% { transform: scaleY(1.2); } }
.track__info { flex: 1; min-width: 0; }
.track__title { font-size: 15px; font-weight: 600; color: var(--text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 4px; }
.track--playing .track__title, .track--selected .track__title { color: var(--brand); }
.track__sub { font-size: 12px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600; }
.track__waves { flex-shrink: 0; }
.wave-wrap { display: flex; align-items: center; gap: 2px; height: 32px; opacity: 0.25; }
.wave-wrap--live { opacity: 1; }
.wbar { width: 3px; border-radius: 2px; background: var(--brand); height: calc(var(--h, 0.5) * 28px); min-height: 4px; transition: height 0.3s ease; }
.wave-wrap--live .wbar { animation: waveLive calc(0.4s + var(--bi, 0) * 0.02s) ease-in-out infinite alternate; }
@keyframes waveLive { 0% { transform: scaleY(0.4); } 100% { transform: scaleY(1); } }
.track__right { text-align: end; flex-shrink: 0; display: flex; flex-direction: column; align-items: flex-end; gap: 4px; }
.track__dur { font-size: 13px; color: var(--text-muted); font-variant-numeric: tabular-nums; font-weight: 600; }
.track__size { font-size: 11px; color: var(--text-muted); opacity: 0.7; }

/* AUDIO BAR */
.audio-bar { margin-top: 24px; background: var(--brand); color: white; border-radius: var(--radius); padding: 20px 24px; display: flex; align-items: center; gap: 20px; box-shadow: var(--shadow-lg); flex-wrap: wrap; }
.audio-bar__cover { width: 56px; height: 56px; border-radius: var(--radius-sm); overflow: hidden; position: relative; flex-shrink: 0; box-shadow: 0 4px 12px rgba(0,0,0,0.3); }
.audio-bar__cover img { width: 100%; height: 100%; object-fit: cover; }
.audio-bar__vinyl { position: absolute; inset: 0; border-radius: 50%; background: rgba(0,0,0,0.4); display: grid; place-items: center; opacity: 0; transition: opacity 0.3s; }
.audio-bar__vinyl::after { content: ''; width: 12px; height: 12px; background: var(--brand); border-radius: 50%; border: 2px solid rgba(255,255,255,0.3); }
.audio-bar__vinyl--spin { opacity: 1; animation: vinylSpin 3s linear infinite; }
@keyframes vinylSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
.audio-bar__info { flex: 1; min-width: 120px; }
.audio-bar__title { font-size: 15px; font-weight: 700; margin-bottom: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.audio-bar__album { font-size: 12px; opacity: 0.75; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.audio-bar__controls { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
.abtn { background: rgba(255,255,255,0.15); border: none; color: white; width: 36px; height: 36px; border-radius: 50%; cursor: pointer; display: grid; place-items: center; font-size: 16px; transition: all 0.2s; }
.abtn:hover:not(:disabled) { background: rgba(255,255,255,0.25); transform: scale(1.1); }
.abtn:disabled { opacity: 0.3; cursor: not-allowed; }
.abtn--play { width: 48px; height: 48px; background: white; color: var(--brand); font-size: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.2); }
.abtn--play:hover { background: var(--accent); color: var(--brand-dark); }

/* ── AUDIO PROGRESS — always LTR so fill grows left→right in both Sorani (RTL) and Kurmanji (LTR) ── */
.audio-bar__prog-wrap { flex: 1; min-width: 120px; cursor: pointer; padding: 8px 0; direction: ltr; }

.audio-bar__prog-track { height: 4px; background: rgba(255,255,255,0.2); border-radius: 4px; position: relative; }
.audio-bar__prog-fill { height: 100%; background: var(--accent); border-radius: 4px; transition: width 0.1s linear; }
.audio-bar__prog-thumb { position: absolute; top: 50%; transform: translate(-50%, -50%); width: 14px; height: 14px; background: white; border-radius: 50%; box-shadow: 0 2px 6px rgba(0,0,0,0.2); transition: left 0.1s linear; }
.audio-bar__time { font-size: 13px; font-variant-numeric: tabular-nums; opacity: 0.8; flex-shrink: 0; white-space: nowrap; font-weight: 600; }

/* STREAM SIDE */
.stream-side { display: flex; flex-direction: column; gap: 24px; }
.side-featured { background: var(--surface); border: 1px solid var(--border-light); border-radius: var(--radius); overflow: hidden; }
.side-heading { font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-muted); padding: 16px 20px 0; margin: 0 0 12px; }
.side-cover { position: relative; aspect-ratio: 1; overflow: hidden; margin: 0 16px 16px; border-radius: var(--radius-sm); }
.side-cover img { width: 100%; height: 100%; object-fit: cover; }
.side-cover__overlay { position: absolute; bottom: 0; left: 0; right: 0; padding: 20px 14px 12px; background: linear-gradient(to top, rgba(0,0,0,0.7), transparent); }
.side-cover__title { color: white; font-weight: 700; font-size: 15px; line-height: 1.3; }
.side-meta { padding: 0 16px 16px; display: flex; flex-direction: column; gap: 8px; }
.side-meta__row { display: flex; justify-content: space-between; align-items: center; font-size: 13px; gap: 12px; }
.side-meta__key { color: var(--text-muted); font-weight: 600; text-transform: uppercase; font-size: 11px; letter-spacing: 0.06em; flex-shrink: 0; }
.side-meta__val { color: var(--text); font-weight: 600; text-align: end; }
.side-keywords { background: var(--surface); border: 1px solid var(--border-light); border-radius: var(--radius); padding: 16px; }
.chips-row { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
.chip { padding: 8px 16px; border-radius: 999px; font-size: 13px; font-weight: 600; }
.chip--tag { background: var(--brand-light); color: var(--brand); border: 1px solid rgba(140,21,21,0.12); }
.chip--kw { background: var(--accent-light); color: #7a5a00; border: 1px solid rgba(201,162,39,0.2); }

/* VIDEO SECTION */
.video-section { padding: 60px 0; }
.clips-layout { display: grid; grid-template-columns: 1fr 320px; gap: 32px; align-items: start; }
@media (max-width: 968px) { .clips-layout { grid-template-columns: 1fr; } }
.clips-player { background: #000; border-radius: var(--radius); overflow: hidden; box-shadow: var(--shadow-lg); }
.vplayer-wrap { width: 100%; aspect-ratio: 16/9; background: #000; overflow: hidden; border-radius: var(--radius); }
.vplayer-el { width: 100%; height: 100%; display: block; background: #000; }
.vembed-wrap { width: 100%; aspect-ratio: 16/9; }
.vembed { width: 100%; height: 100%; border: none; display: block; border-radius: var(--radius); }
.vno-source { aspect-ratio: 16/9; display: grid; place-items: center; background: var(--bg); border: 2px dashed var(--border); border-radius: var(--radius); flex-direction: column; gap: 12px; }
.vno-source__icon { font-size: 48px; opacity: 0.4; }
.vno-source__text { font-size: 16px; font-weight: 600; color: var(--text-muted); }
.clip-desc { padding: 20px; background: var(--surface); }
.clip-desc p { font-size: 15px; color: var(--text-muted); line-height: 1.7; margin: 0; }
.clips-list { background: var(--surface); border: 1px solid var(--border-light); border-radius: var(--radius); overflow: hidden; }
.clips-list__heading { font-size: 15px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--text-muted); padding: 16px 20px; border-bottom: 1px solid var(--border-light); margin: 0; }
.clip-item { display: flex; align-items: center; gap: 14px; padding: 14px 20px; cursor: pointer; transition: all 0.2s; border-bottom: 1px solid var(--border-light); }
.clip-item:last-child { border-bottom: none; }
.clip-item:hover { background: var(--bg); }
.clip-item--on { background: var(--brand-light); border-inline-start: 3px solid var(--brand); }
.clip-item__num { width: 28px; height: 28px; background: var(--bg); border: 1px solid var(--border); border-radius: 50%; display: grid; place-items: center; font-size: 12px; font-weight: 700; color: var(--text-muted); flex-shrink: 0; }
.clip-item--on .clip-item__num { background: var(--brand); color: white; border-color: var(--brand); }
.clip-item__info { flex: 1; min-width: 0; }
.clip-item__title { font-size: 14px; font-weight: 600; color: var(--text); margin-bottom: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.clip-item__meta { display: flex; align-items: center; gap: 12px; font-size: 12px; color: var(--text-muted); }
.clip-item__play { color: var(--text-muted); transition: color 0.2s; flex-shrink: 0; }
.clip-item:hover .clip-item__play { color: var(--brand); }
.video-stage { display: flex; flex-direction: column; gap: 20px; }
.vfilm-info { padding: 4px 0; }
.vfilm-chips { display: flex; flex-wrap: wrap; gap: 10px; }
.vchip { background: var(--bg); border: 1px solid var(--border-light); padding: 8px 16px; border-radius: 999px; font-size: 13px; font-weight: 600; color: var(--text-muted); display: flex; align-items: center; gap: 6px; }

/* GALLERY SECTION */
.gallery-section { padding: 60px 0; }
.gallery-layout { display: flex; flex-direction: column; gap: 20px; }
.gallery-main { position: relative; }
.gallery-preview { position: relative; aspect-ratio: 16/10; border-radius: var(--radius); overflow: hidden; background: var(--bg); border: 1px solid var(--border-light); cursor: zoom-in; box-shadow: var(--shadow); }
.gallery-preview__img { width: 100%; height: 100%; object-fit: contain; transition: transform 0.4s ease; }
.gallery-preview:hover .gallery-preview__img { transform: scale(1.03); }
.gallery-zoom-hint { position: absolute; bottom: 14px; right: 14px; background: rgba(0,0,0,0.6); color: white; font-size: 12px; padding: 8px 14px; border-radius: 999px; display: flex; align-items: center; gap: 6px; opacity: 0; transition: opacity 0.2s; backdrop-filter: blur(4px); }
.gallery-preview:hover .gallery-zoom-hint { opacity: 1; }
.gallery-caption { padding: 16px 4px; }
.gallery-caption__title { font-size: 16px; font-weight: 700; color: var(--text); margin-bottom: 6px; }
.gallery-caption__desc { font-size: 14px; color: var(--text-muted); line-height: 1.6; }
.gallery-strip { display: flex; gap: 10px; flex-wrap: wrap; }
.gthumb { width: 80px; height: 60px; border-radius: var(--radius-sm); overflow: hidden; cursor: pointer; border: 2px solid transparent; transition: all 0.2s; padding: 0; background: var(--bg); flex-shrink: 0; }
.gthumb img { width: 100%; height: 100%; object-fit: cover; }
.gthumb:hover { border-color: var(--brand-light); transform: translateY(-2px); }
.gthumb--on { border-color: var(--brand); box-shadow: 0 0 0 2px var(--brand-light); }
.gallery-nav { display: flex; align-items: center; justify-content: center; gap: 20px; }
.gnav-btn { padding: 10px 24px; border: 1px solid var(--border); border-radius: 999px; background: var(--surface); font-size: 14px; font-weight: 600; cursor: pointer; color: var(--text); transition: all 0.2s; }
.gnav-btn:hover:not(:disabled) { background: var(--brand); color: white; border-color: var(--brand); }
.gnav-btn:disabled { opacity: 0.35; cursor: not-allowed; }
.gnav-pos { font-size: 14px; color: var(--text-muted); font-variant-numeric: tabular-nums; font-weight: 600; min-width: 60px; text-align: center; }
.gallery-single { max-width: 100%; border-radius: var(--radius); box-shadow: var(--shadow-lg); display: block; }
.gallery-empty { text-align: center; padding: 40px; }

/* WRITING SECTION */
.writing-section { padding: 60px 0; }
.writing-layout { display: flex; flex-direction: column; gap: 32px; }
.writing-info-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; }
.winfo-card { background: var(--surface); border: 1px solid var(--border-light); border-radius: var(--radius); padding: 20px; display: flex; align-items: flex-start; gap: 14px; transition: all 0.2s ease; }
.winfo-card:hover { border-color: var(--brand-light); box-shadow: var(--shadow-sm); transform: translateY(-2px); }
.winfo-card__ico { font-size: 24px; flex-shrink: 0; width: 44px; height: 44px; background: var(--bg); border-radius: var(--radius-sm); display: grid; place-items: center; border: 1px solid var(--border-light); }
.winfo-card__content { flex: 1; min-width: 0; }
.winfo-card__lbl { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-muted); margin-bottom: 6px; }
.winfo-card__val { font-size: 15px; font-weight: 600; color: var(--text); word-break: break-word; }
.series-block { background: linear-gradient(135deg, var(--brand-light), rgba(201,162,39,0.06)); border: 1px solid rgba(140,21,21,0.12); border-radius: var(--radius); padding: 24px 28px; display: flex; align-items: center; gap: 20px; }
.series-block__ico { font-size: 36px; flex-shrink: 0; }
.series-block__info { flex: 1; }
.series-block__lbl { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: var(--brand); margin-bottom: 6px; }
.series-block__name { font-family: var(--font-serif); font-size: 22px; font-weight: 700; color: var(--text); margin-bottom: 4px; }
.series-block__order { font-size: 14px; color: var(--text-muted); font-weight: 600; }

/* CHIPS SECTIONS */
.chips-section { padding: 32px 0; border-top: 1px solid var(--border-light); }
.chips-section--alt { background: var(--bg); border-top: 1px solid var(--border-light); }
.chips-block__heading { font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-muted); margin: 0 0 14px; }

/* RELATED */
.related { padding: 60px 0; background: linear-gradient(to bottom, var(--bg), rgba(140,21,21,0.02)); }
.related__head { display: flex; align-items: center; gap: 20px; margin-bottom: 32px; }
.related__title { font-family: var(--font-serif); font-size: 28px; font-weight: 700; color: var(--text); margin: 0; white-space: nowrap; }
.related__rule { flex: 1; height: 1px; background: linear-gradient(to right, var(--border), transparent); }
.related__grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 20px; }
.rcard { background: var(--surface); border: 1px solid var(--border-light); border-radius: var(--radius); overflow: hidden; cursor: pointer; transition: all 0.3s ease; }
.rcard:hover { transform: translateY(-6px); box-shadow: var(--shadow-lg); }
.rcard:focus-visible { outline: 3px solid var(--brand); outline-offset: 2px; }
.rcard__img { position: relative; aspect-ratio: 16/10; overflow: hidden; background: var(--bg); }
.rcard__img-main { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
.rcard__img-hover { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; transition: opacity 0.3s ease; }
.rcard:hover .rcard__img-main { transform: scale(1.08); }
.rcard:hover .rcard__img-hover { opacity: 1; transform: scale(1.08); }
.rcard__overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.4), transparent); opacity: 0; transition: opacity 0.3s; }
.rcard:hover .rcard__overlay { opacity: 1; }
.rcard__typebadge { position: absolute; top: 10px; start: 10px; background: rgba(255,255,255,0.9); padding: 4px 10px; border-radius: 999px; font-size: 14px; backdrop-filter: blur(6px); }
.rcard__body { padding: 16px; }
.rcard__title { font-family: var(--font-serif); font-size: 16px; font-weight: 700; color: var(--text); margin: 0 0 8px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.rcard__desc { font-size: 13px; color: var(--text-muted); line-height: 1.5; margin: 0 0 12px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.rcard__tags { display: flex; flex-wrap: wrap; gap: 6px; }
.rtag { font-size: 11px; color: var(--text-muted); background: var(--bg); padding: 4px 10px; border-radius: 999px; border: 1px solid var(--border-light); }

/* PAGER */
.pager { display: flex; align-items: center; justify-content: center; gap: 20px; padding: 48px 0 20px; }
.pager__btn { padding: 12px 28px; border: 1px solid var(--border); border-radius: 999px; background: var(--surface); font-size: 14px; font-weight: 700; cursor: pointer; color: var(--text); transition: all 0.2s; letter-spacing: 0.03em; }
.pager__btn:hover:not(:disabled) { background: var(--brand); color: white; border-color: var(--brand); box-shadow: var(--shadow); }
.pager__btn:disabled { opacity: 0.3; cursor: not-allowed; }
.pager__dots { display: flex; align-items: center; gap: 8px; }
.pager__dot { width: 10px; height: 10px; border-radius: 50%; background: var(--border); cursor: pointer; transition: all 0.2s; border: none; padding: 0; }
.pager__dot:hover { background: var(--brand-light); transform: scale(1.2); }
.pager__dot--on { background: var(--brand); transform: scale(1.3); box-shadow: 0 0 0 3px var(--brand-light); }

/* EMPTY STATE */
.empty { text-align: center; padding: 80px 40px; }
.empty__icon { font-size: 56px; margin-bottom: 20px; filter: grayscale(0.3); }
.empty__title { font-family: var(--font-serif); font-size: 24px; font-weight: 700; color: var(--text); margin: 0 0 12px; }
.empty__hint { font-size: 15px; color: var(--text-muted); margin: 0 0 28px; }
.btn-primary { background: var(--brand); color: white; border: none; padding: 14px 32px; border-radius: 999px; font-size: 15px; font-weight: 700; cursor: pointer; transition: all 0.2s; letter-spacing: 0.03em; box-shadow: var(--shadow); }
.btn-primary:hover { background: var(--brand-dark); transform: translateY(-2px); box-shadow: var(--shadow-lg); }

/* FULLSCREEN OVERLAY */
.fsoverlay { position: fixed; inset: 0; background: rgba(0,0,0,0.94); z-index: 9999; display: grid; place-items: center; backdrop-filter: blur(8px); }
.fsoverlay__x { position: absolute; top: 20px; right: 20px; width: 44px; height: 44px; border-radius: 50%; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: white; font-size: 20px; cursor: pointer; display: grid; place-items: center; transition: all 0.2s; z-index: 1; }
.fsoverlay__x:hover { background: var(--brand); border-color: var(--brand); }
.fsoverlay__frame { max-width: 90vw; max-height: 90vh; display: flex; align-items: center; justify-content: center; }
.fsoverlay__img { max-width: 100%; max-height: 90vh; object-fit: contain; border-radius: var(--radius-sm); box-shadow: 0 40px 100px rgba(0,0,0,0.6); }

/* TRANSITIONS */
.page-enter-active, .page-leave-active { transition: opacity 0.3s ease, transform 0.3s ease; }
.page-enter-from { opacity: 0; transform: translateY(12px); }
.page-leave-to { opacity: 0; transform: translateY(-12px); }
.drop-enter-active { transition: opacity 0.18s ease, transform 0.18s ease; }
.drop-leave-active { transition: opacity 0.14s ease, transform 0.14s ease; }
.drop-enter-from, .drop-leave-to { opacity: 0; transform: translateY(-8px) scale(0.97); }
.pill-enter-active, .pill-leave-active { transition: all 0.25s ease; }
.pill-enter-from, .pill-leave-to { opacity: 0; transform: translateY(-8px) scale(0.95); }
.fs-enter-active, .fs-leave-active { transition: opacity 0.25s ease; }
.fs-enter-from, .fs-leave-to { opacity: 0; }
.lang-swap-enter-active, .lang-swap-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.lang-swap-enter-from { opacity: 0; transform: translateY(8px); }
.lang-swap-leave-to { opacity: 0; transform: translateY(-8px); }

/* RESPONSIVE */
@media (max-width: 768px) {
  .hero { min-height: 70vh; }
  .hero__inner { padding: 80px 16px 60px; }
  .hero__stats { gap: 16px; }
  .hstat__inner { padding: 12px 16px; }
  .hstat__num { font-size: 28px; }
  .tabnav__row { gap: 4px; overflow-x: auto; padding-bottom: 4px; scrollbar-width: none; }
  .tabnav__row::-webkit-scrollbar { display: none; }
  .tabnav__item { max-width: 140px; flex-shrink: 0; }
  .tabtn { padding: 12px 14px; font-size: 13px; }
  .grid { grid-template-columns: 1fr; }
  .dhero__content { padding: 48px 16px; gap: 32px; }
  .dhero__title { font-size: clamp(26px, 6vw, 40px); }
  .dhero__right { display: none; }
  .stream-layout, .clips-layout { grid-template-columns: 1fr; }
  .audio-bar { gap: 12px; }
  .related__grid { grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); }
  .hero__corner { display: none; }
  .hero__filigree { display: none; }
}
@media (max-width: 480px) {
  .tabnav__item { max-width: 110px; }
  .tabtn__lbl { font-size: 12px; }
  .writing-info-grid { grid-template-columns: 1fr 1fr; }
  .audio-bar { flex-wrap: wrap; }
  .audio-bar__prog-wrap { order: 5; flex: 0 0 100%; }
}
</style>