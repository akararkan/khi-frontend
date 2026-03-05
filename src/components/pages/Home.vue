<template>
  <main id="main-content" class="home" :dir="lang.dir" :class="{ 'home--ltr': lang.isKMR }">

    <!-- ══════════════════════════════════════════════════════
         HERO — Cinematic parallax, particles, live stats
    ══════════════════════════════════════════════════════ -->
    <section class="hero" aria-label="Hero">
      <div class="hero__slides" ref="heroBgRef">
        <div
          v-for="(url, i) in heroSlides"
          :key="i"
          class="hero__slide"
          :class="{ 'hero__slide--active': i === heroSlideIndex }"
          :style="{ backgroundImage: `url(${url})` }"
        />
        <div class="hero__slide hero__slide--gradient" :class="{ 'hero__slide--active': !heroSlides.length }" />
      </div>
      <!-- Slide indicators -->
      <div class="hero__dots" v-if="heroSlides.length > 1">
        <span
          v-for="(_, i) in heroSlides"
          :key="i"
          class="hero__dot"
          :class="{ 'hero__dot--active': i === heroSlideIndex }"
          @click="heroSlideIndex = i"
        />
      </div>
      <div class="hero__overlay" />
      <div class="hero__grain" />
      <div class="hero__particles">
        <span v-for="i in 22" :key="i" class="particle" :style="particleStyle(i)" />
      </div>
      <div class="hero__corner hero__corner--tl" />
      <div class="hero__corner hero__corner--tr" />
      <div class="hero__corner hero__corner--bl" />
      <div class="hero__corner hero__corner--br" />

      <div class="container hero__content" data-animate="fade-up">
        <p class="hero__kicker">
          <span class="kicker__line" />
          {{ lbl('heroKicker') }}
          <span class="kicker__line" />
        </p>
        <h1 class="hero__title">
          <span class="hero__title-line hero__title-line--main">{{ lbl('heroMain') }}</span>
          <span class="hero__title-line hero__title-line--sub">{{ lbl('heroSub') }}</span>
        </h1>
        <p class="hero__desc">{{ lbl('heroDesc') }}</p>

        <div class="hero__actions">
          <button class="btn btn--primary btn--glow" @click="scrollTo('#spotlight')">
            <span>{{ lbl('exploreNews') }}</span>
            <svg class="btn__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M7 17L17 7M17 7H7M17 7V17"/>
            </svg>
          </button>
          <button class="btn btn--glass" @click="scrollTo('#memories')">
            <span>💫 {{ lbl('albumMemories') }}</span>
          </button>
          <button class="btn btn--ghost" @click="scrollTo('#publications')">
            <span>{{ lbl('publications') }}</span>
          </button>
        </div>

        <div class="hero__stats">
          <div v-for="(s, i) in heroStats" :key="i" class="hstat" data-animate="fade-up" :data-delay="i * 100">
            <div class="hstat__inner">
              <span class="hstat__value" :class="{ 'hstat__value--loading': statsLoading }">
                {{ statsLoading ? '—' : s.value }}
              </span>
              <span class="hstat__label">{{ s.label }}</span>
            </div>
            <div class="hstat__sep" v-if="i < heroStats.length - 1" />
          </div>
        </div>
      </div>

      <button class="scroll-cue" @click="scrollTo('#ticker')" aria-label="Scroll down">
        <span class="scroll-cue__mouse"><span class="scroll-cue__wheel" /></span>
        <span class="scroll-cue__text">{{ lbl('scrollDown') }}</span>
      </button>
    </section>

    <!-- ══════════════════════════════════════════════════════
         LIVE TICKER — scrolling content strip
    ══════════════════════════════════════════════════════ -->
    <div id="ticker" class="ticker">
      <div class="ticker__track">
        <span v-for="(item, i) in tickerItems" :key="i" class="ticker__item">
          <span class="ticker__dot">◆</span>
          {{ item }}
        </span>
        <!-- duplicate for infinite loop -->
        <span v-for="(item, i) in tickerItems" :key="`dup-${i}`" class="ticker__item" aria-hidden="true">
          <span class="ticker__dot">◆</span>
          {{ item }}
        </span>
      </div>
    </div>

    <!-- ══════════════════════════════════════════════════════
         ABOUT THE INSTITUTE
    ══════════════════════════════════════════════════════ -->
    <section class="section" id="about">
      <div class="container">
        <div class="about-layout" data-animate="fade-up">
          <!-- Media side -->
          <div class="about__media-wrap">
            <div class="about__img-frame">
              <img v-if="aboutImage" :src="aboutImage" alt="Kurdish Heritage Institute" class="about__img" @error="onImgErr" />
              <div v-else class="about__img about__img--gradient" />
              <div class="about__img-border" />
            </div>
            <div class="about__year-badge">
              <span class="about__year-num">١٩٩٢</span>
              <span class="about__year-lbl">{{ lbl('founded') }}</span>
            </div>
            <div class="about__float-card">
              <div class="about__float-ico">🏛️</div>
              <div>
                <div class="about__float-title">{{ lbl('khi') }}</div>
                <div class="about__float-sub">{{ lbl('sulaymaniyah') }}</div>
              </div>
            </div>
          </div>

          <!-- Text side -->
          <div class="about__body">
            <div class="section__badge">{{ lbl('aboutBadge') }}</div>
            <h2 class="section__title">{{ lbl('aboutTitle') }}</h2>
            <p class="about__lead">{{ lbl('aboutLead') }}</p>
            <p class="about__text">{{ lbl('aboutText') }}</p>

            <div class="about__pillars">
              <div v-for="p in aboutPillars" :key="p.icon" class="pillar">
                <span class="pillar__icon">{{ p.icon }}</span>
                <div class="pillar__info">
                  <span class="pillar__title">{{ p.title }}</span>
                  <span class="pillar__sub">{{ p.sub }}</span>
                </div>
              </div>
            </div>

            <div class="about__actions">
              <button class="btn btn--primary" @click="go('/about')">
                {{ lbl('learnMore') }}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
              <button class="btn btn--outline" @click="go('/contact')">
                {{ lbl('contactUs') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════════════
         SPOTLIGHT / NEWS
    ══════════════════════════════════════════════════════ -->
    <section id="spotlight" class="section section--alt">
      <div class="container">
        <header class="section__header" data-animate="fade-up">
          <div class="section__badge">{{ lbl('newsBadge') }}</div>
          <h2 class="section__title">{{ lbl('newsTitle') }}</h2>
          <p class="section__desc">{{ lbl('newsDesc') }}</p>
        </header>

        <!-- Loading skeletons -->
        <div v-if="newsLoading" class="news-grid">
          <div v-for="i in 4" :key="`nsk-${i}`" class="skel" :style="{ '--d': `${(i-1)*.07}s` }">
            <div class="skel__thumb shimmer" />
            <div class="skel__body">
              <div class="skel__line shimmer" style="width:40%" />
              <div class="skel__line shimmer" style="width:100%;margin-top:.5rem" />
              <div class="skel__line shimmer" style="width:70%" />
            </div>
          </div>
        </div>

        <!-- Empty -->
        <div v-else-if="!displayedNews.length" class="empty">
          <div class="empty__icon">📰</div>
          <h3 class="empty__title">{{ lbl('noContent') }}</h3>
        </div>

        <template v-else>
          <div class="news-grid">
            <!-- Featured card -->
            <article
              class="news-card news-card--featured"
              data-animate="fade-up"
              @click="openNewsModal(displayedNews[0])"
            >
              <div class="news-card__media">
                <img :src="safeImg(displayedNews[0].coverUrl) || fallback" :alt="nTitle(displayedNews[0])" loading="lazy" @error="onImgErr" />
                <div class="news-card__overlay">
                  <span class="news-card__play">
                    <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                  </span>
                </div>
                <div class="nc-badges">
                  <span class="nc-cat">{{ nCat(displayedNews[0]) }}</span>
                  <span v-for="l in (displayedNews[0].contentLanguages||[])" :key="l" class="nc-lang">{{ l }}</span>
                </div>
              </div>
              <div class="news-card__content">
                <span class="news-card__subcat" v-if="nSubCat(displayedNews[0])">{{ nSubCat(displayedNews[0]) }}</span>
                <h3 class="news-card__title">{{ nTitle(displayedNews[0]) }}</h3>
                <p class="news-card__excerpt">{{ truncate(nDesc(displayedNews[0]), 180) }}</p>
                <div class="news-card__meta">
                  <time>{{ formatDate(displayedNews[0].datePublished) }}</time>
                  <span class="meta-dot" />
                  <div class="nc-tags-row">
                    <span v-for="t in nTags(displayedNews[0]).slice(0,3)" :key="t" class="nctag">#{{ t }}</span>
                  </div>
                </div>
                <span class="news-card__cta">
                  {{ lbl('readMore') }}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </span>
              </div>
            </article>

            <!-- Secondary cards -->
            <div class="news-secondary">
              <article
                v-for="(item, idx) in displayedNews.slice(1, 4)"
                :key="item.id"
                class="news-card news-card--sm"
                data-animate="fade-up"
                :data-delay="`${(idx+1)*90}ms`"
                @click="openNewsModal(item)"
              >
                <div class="news-card__media">
                  <img :src="safeImg(item.coverUrl) || fallback" :alt="nTitle(item)" loading="lazy" @error="onImgErr" />
                  <div class="nc-badges">
                    <span class="nc-cat nc-cat--sm">{{ nCat(item) }}</span>
                  </div>
                </div>
                <div class="news-card__content">
                  <h3 class="news-card__title news-card__title--sm">{{ nTitle(item) }}</h3>
                  <p class="news-card__excerpt news-card__excerpt--sm">{{ truncate(nDesc(item), 80) }}</p>
                  <div class="news-card__meta">
                    <time>{{ formatDate(item.datePublished) }}</time>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </template>

        <div class="section__footer" data-animate="fade-up">
          <button class="btn btn--outline" @click="go('/news')">
            {{ lbl('allNews') }}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════════════
         POPULAR / TRENDING SLIDER
    ══════════════════════════════════════════════════════ -->
    <section class="section section--dark" id="popular">
      <div class="container">
        <header class="section__header section__header--row" data-animate="fade-up">
          <div>
            <div class="section__badge section__badge--light">{{ lbl('popularBadge') }}</div>
            <h2 class="section__title section__title--light">{{ lbl('popularTitle') }}</h2>
            <p class="section__desc section__desc--light">{{ lbl('popularDesc') }}</p>
          </div>
          <div class="slider-nav">
            <button class="slider-btn" @click="prevPopular" aria-label="Previous">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </button>
            <div class="slider-dots">
              <span
                v-for="(_, i) in Math.ceil(popularItems.length / 3)"
                :key="i"
                class="slider-dot"
                :class="{ active: popularSlide === i }"
                @click="goPopularSlide(i)"
              />
            </div>
            <button class="slider-btn" @click="nextPopular" aria-label="Next">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
        </header>

        <div class="popular-slider" ref="popularSliderRef">
          <article
            v-for="(item, idx) in popularItems"
            :key="item._key"
            class="popular-card"
            data-animate="fade-up"
            :data-delay="`${idx * 70}ms`"
            @click="go(item._route)"
          >
            <div class="popular-card__media">
              <img :src="item.image || fallback" :alt="item.title" loading="lazy" @error="onImgErr" />
              <div class="popular-card__badge">{{ item.typeLabel }}</div>
              <div class="popular-card__hover">
                <button class="popular-card__action">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                </button>
              </div>
            </div>
            <div class="popular-card__body">
              <h3 class="popular-card__title">{{ item.title }}</h3>
              <p class="popular-card__text">{{ truncate(item.summary, 80) }}</p>
              <span class="popular-card__cta">
                {{ lbl('open') }}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </span>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════════════
         PUBLICATIONS — tabbed: sound / video / writing / image
    ══════════════════════════════════════════════════════ -->
    <section class="section section--dark section--publications" id="publications">
      <div class="container">
        <header class="section__header section__header--row" data-animate="fade-up">
          <div>
            <div class="section__badge section__badge--light">{{ lbl('pubBadge') }}</div>
            <h2 class="section__title section__title--light">{{ lbl('pubTitle') }}</h2>
            <p class="section__desc section__desc--light">{{ lbl('pubDesc') }}</p>
          </div>
          <div class="pub-tabs">
            <button
              v-for="t in pubTabDefs"
              :key="t.key"
              class="pub-tab"
              :class="{ 'pub-tab--on': activePubTab === t.key }"
              @click="switchPubTab(t.key)"
            >
              <span class="pub-tab__ico">{{ t.icon }}</span>
              <span>{{ t.label }}</span>
              <span class="pub-tab__count">{{ pubTabCount(t.key) }}</span>
            </button>
          </div>
        </header>

        <!-- Pub skeletons -->
        <div v-if="pubLoading" class="pub-grid">
          <div v-for="i in 4" :key="`psk-${i}`" class="skel skel--dark" :style="{ '--d': `${(i-1)*.07}s` }">
            <div class="skel__thumb shimmer shimmer--dark" />
            <div class="skel__body">
              <div class="skel__line shimmer shimmer--dark" style="width:55%" />
              <div class="skel__line shimmer shimmer--dark" style="width:90%;margin-top:.5rem" />
            </div>
          </div>
        </div>

        <Transition name="tab-switch" mode="out-in">
          <div :key="activePubTab" class="pub-grid" v-if="!pubLoading">

            <!-- ── SOUND cards ── -->
            <template v-if="activePubTab === 'sound'">
              <article
                v-for="(item, idx) in sounds.slice(0, 4)"
                :key="`snd-${item.id}`"
                class="pub-card"
                data-animate="fade-up"
                :data-delay="`${idx * 70}ms`"
                @click="go('/publishments')"
              >
                <div class="pub-card__media">
                  <img :src="pCover(item)" :alt="pTitle(item)" loading="lazy" @error="onImgErr" />
                  <div class="pub-card__type-badge">🎵</div>
                  <div class="pub-card__tracks" v-if="item.files?.length">
                    🎵 {{ item.files.length }} {{ lbl('tracks') }}
                  </div>
                  <div class="pub-card__mem-badge" v-if="item.albumOfMemories">💫</div>
                </div>
                <div class="pub-card__body">
                  <div class="pub-card__meta">
                    <span class="pub-card__badge-pill">{{ lbl('sound') }}</span>
                    <span class="pub-card__date">{{ formatDate(item.publishmentDate || item.createdAt) }}</span>
                  </div>
                  <h3 class="pub-card__title">{{ pTitle(item) }}</h3>
                  <p class="pub-card__desc">{{ truncate(pDesc(item), 75) }}</p>
                  <div class="pub-card__tags" v-if="pTags(item).length">
                    <span v-for="t in pTags(item).slice(0,3)" :key="t" class="ptag">#{{ t }}</span>
                  </div>
                  <span class="pub-card__cta">
                    {{ lbl('listen') }}
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </span>
                </div>
              </article>
              <div v-if="!sounds.length" class="pub-empty">
                <span>🎵</span><p>{{ lbl('noContent') }}</p>
              </div>
            </template>

            <!-- ── VIDEO cards ── -->
            <template v-if="activePubTab === 'video'">
              <article
                v-for="(item, idx) in videos.slice(0, 4)"
                :key="`vid-${item.id}`"
                class="pub-card"
                data-animate="fade-up"
                :data-delay="`${idx * 70}ms`"
                @click="go('/publishments')"
              >
                <div class="pub-card__media">
                  <img :src="pCover(item)" :alt="pTitle(item)" loading="lazy" @error="onImgErr" />
                  <div class="pub-card__type-badge">🎬</div>
                  <div class="pub-card__play-overlay">
                    <span class="pub-play-btn">▶</span>
                  </div>
                  <div class="pub-card__duration" v-if="item.durationSeconds">
                    ⏱ {{ formatTime(item.durationSeconds) }}
                  </div>
                  <div class="pub-card__mem-badge" v-if="item.albumOfMemories">💫</div>
                </div>
                <div class="pub-card__body">
                  <div class="pub-card__meta">
                    <span class="pub-card__badge-pill">{{ item.videoType || lbl('video') }}</span>
                    <span class="pub-card__date">{{ formatDate(item.publishmentDate || item.createdAt) }}</span>
                  </div>
                  <h3 class="pub-card__title">{{ pTitle(item) }}</h3>
                  <p class="pub-card__desc">{{ truncate(pDesc(item), 75) }}</p>
                  <div class="pub-card__tags" v-if="pTags(item).length">
                    <span v-for="t in pTags(item).slice(0,3)" :key="t" class="ptag">#{{ t }}</span>
                  </div>
                  <span class="pub-card__cta">
                    {{ lbl('watch') }}
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </span>
                </div>
              </article>
              <div v-if="!videos.length" class="pub-empty">
                <span>🎬</span><p>{{ lbl('noContent') }}</p>
              </div>
            </template>

            <!-- ── WRITING cards ── -->
            <template v-if="activePubTab === 'writing'">
              <article
                v-for="(item, idx) in writings.slice(0, 4)"
                :key="`wrt-${item.id}`"
                class="pub-card pub-card--writing"
                data-animate="fade-up"
                :data-delay="`${idx * 70}ms`"
                @click="go('/publishments')"
              >
                <div class="pub-card__media">
                  <img :src="pCover(item)" :alt="pTitle(item)" loading="lazy" @error="onImgErr" />
                  <div class="pub-card__type-badge">📚</div>
                  <div class="pub-card__pages" v-if="item.ckbContent?.pageCount || item.kmrContent?.pageCount">
                    📄 {{ item.ckbContent?.pageCount || item.kmrContent?.pageCount }} {{ lbl('pages') }}
                  </div>
                </div>
                <div class="pub-card__body">
                  <div class="pub-card__meta">
                    <span class="pub-card__badge-pill">{{ lbl('writings') }}</span>
                    <span class="pub-card__date">{{ formatDate(item.publishmentDate || item.createdAt) }}</span>
                  </div>
                  <h3 class="pub-card__title">{{ pTitle(item) }}</h3>
                  <p class="pub-card__desc">{{ truncate(pDesc(item), 75) }}</p>
                  <div class="pub-card__writer" v-if="pWriter(item)">
                    ✍️ {{ pWriter(item) }}
                  </div>
                  <span class="pub-card__cta">
                    {{ lbl('read') }}
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </span>
                </div>
              </article>
              <div v-if="!writings.length" class="pub-empty">
                <span>📚</span><p>{{ lbl('noContent') }}</p>
              </div>
            </template>

            <!-- ── IMAGE cards ── -->
            <template v-if="activePubTab === 'image'">
              <article
                v-for="(item, idx) in imageCollections.slice(0, 4)"
                :key="`img-${item.id}`"
                class="pub-card pub-card--image"
                data-animate="fade-up"
                :data-delay="`${idx * 70}ms`"
                @click="openImageLightbox(item)"
              >
                <div class="pub-card__media pub-card__media--gallery">
                  <img :src="pCover(item)" :alt="pTitle(item)" loading="lazy" @error="onImgErr" />
                  <div class="pub-card__type-badge">🖼️</div>
                  <div class="pub-card__img-count" v-if="item.imageAlbum?.length">
                    🖼️ {{ item.imageAlbum.length }}
                  </div>
                  <!-- mini album strip -->
                  <div class="pub-card__strip" v-if="item.imageAlbum?.length > 1">
                    <img
                      v-for="(al, ai) in item.imageAlbum.slice(0,3)"
                      :key="ai"
                      :src="al.imageUrl || al.externalUrl || fallback"
                      @error="onImgErr"
                    />
                  </div>
                </div>
                <div class="pub-card__body">
                  <div class="pub-card__meta">
                    <span class="pub-card__badge-pill">{{ item.collectionType || lbl('images') }}</span>
                    <span class="pub-card__date">{{ formatDate(item.publishmentDate || item.createdAt) }}</span>
                  </div>
                  <h3 class="pub-card__title">{{ pTitle(item) }}</h3>
                  <p class="pub-card__desc">{{ truncate(pDesc(item), 75) }}</p>
                  <span class="pub-card__cta">
                    {{ lbl('view') }}
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </span>
                </div>
              </article>
              <div v-if="!imageCollections.length" class="pub-empty">
                <span>🖼️</span><p>{{ lbl('noContent') }}</p>
              </div>
            </template>

          </div>
        </Transition>

        <div class="section__footer" data-animate="fade-up">
          <button class="btn btn--glass" @click="go('/publishments')">
            {{ lbl('allPubs') }}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════════════
         PROJECTS
    ══════════════════════════════════════════════════════ -->
    <section class="section" id="projects">
      <div class="container">
        <header class="section__header" data-animate="fade-up">
          <div class="section__badge">{{ lbl('projBadge') }}</div>
          <h2 class="section__title">{{ lbl('projTitle') }}</h2>
          <p class="section__desc">{{ lbl('projDesc') }}</p>
        </header>

        <div class="filter-bar" data-animate="fade-up">
          <button
            v-for="f in projFilterDefs"
            :key="f.val"
            class="filter-chip"
            :class="{ active: projFilter === f.val }"
            @click="projFilter = f.val"
          >{{ f.label }}</button>
        </div>

        <div v-if="projLoading" class="projects-grid">
          <div v-for="i in 3" :key="`pjsk-${i}`" class="skel" :style="{ '--d': `${(i-1)*.07}s` }">
            <div class="skel__thumb shimmer" style="aspect-ratio:16/10" />
            <div class="skel__body">
              <div class="skel__line shimmer" style="width:55%" />
              <div class="skel__line shimmer" style="width:100%;margin-top:.5rem" />
              <div class="skel__line shimmer" style="width:70%" />
            </div>
          </div>
        </div>

        <div v-else-if="!filteredProjects.length" class="empty">
          <div class="empty__icon">📂</div>
          <h3 class="empty__title">{{ lbl('noContent') }}</h3>
          <button class="btn btn--outline" @click="projFilter = 'all'">{{ lbl('reset') }}</button>
        </div>

        <TransitionGroup v-else name="grid-fade" tag="div" class="projects-grid">
          <article
            v-for="(proj, idx) in filteredProjects.slice(0, 3)"
            :key="proj.id"
            class="project-card"
            data-animate="fade-up"
            :data-delay="`${idx * 80}ms`"
            @click="go('/projects')"
          >
            <div class="project-card__media">
              <img :src="safeImg(proj.coverUrl) || fallback" :alt="projTitle(proj)" loading="lazy" @error="onImgErr" />
              <div class="project-card__status" :class="proj.status === 'COMPLETED' ? 'status--done' : 'status--active'">
                {{ proj.status === 'COMPLETED' ? lbl('completed') : lbl('ongoing') }}
              </div>
              <div class="project-card__hover-info">
                <span class="pcard-type">{{ projType(proj) }}</span>
                <span class="pcard-media" v-if="proj.media?.length">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                  {{ proj.media.length }}
                </span>
              </div>
            </div>
            <div class="project-card__body">
              <h3 class="project-card__title">{{ projTitle(proj) }}</h3>
              <p class="project-card__text">{{ truncate(projDesc(proj), 110) }}</p>
              <div class="project-card__tags" v-if="projTags(proj).length">
                <span v-for="t in projTags(proj).slice(0,3)" :key="t" class="proj-tag">#{{ t }}</span>
              </div>
              <span class="project-card__cta">
                {{ lbl('viewProject') }}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </span>
            </div>
          </article>
        </TransitionGroup>

        <div class="section__footer" data-animate="fade-up">
          <button class="btn btn--primary" @click="go('/projects')">
            {{ lbl('allProjects') }}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════════════
         ALBUM OF MEMORIES — special cinematic dark section
    ══════════════════════════════════════════════════════ -->
    <section class="section section--memories" id="memories">
      <div class="memories__bg-art">
        <div class="mem-orb mem-orb--a" />
        <div class="mem-orb mem-orb--b" />
        <div class="mem-orb mem-orb--c" />
        <div class="mem-grid-lines" />
      </div>
      <div class="container" style="position:relative;z-index:2">
        <header class="section__header" data-animate="fade-up">
          <div class="section__badge section__badge--mem">💫 {{ lbl('memBadge') }}</div>
          <h2 class="section__title section__title--light">{{ lbl('memTitle') }}</h2>
          <p class="section__desc section__desc--light">{{ lbl('memDesc') }}</p>
        </header>

        <!-- Memories sub-filter -->
        <div class="mem-filter" data-animate="fade-up">
          <button
            v-for="f in memFilterDefs"
            :key="f.val"
            class="mem-chip"
            :class="{ 'mem-chip--on': memFilter === f.val }"
            @click="memFilter = f.val"
          >{{ f.icon }} {{ f.label }}</button>
        </div>

        <div v-if="memLoading" class="memories-grid">
          <div v-for="i in 6" :key="`msk-${i}`" class="skel skel--dark" :style="{ '--d': `${(i-1)*.06}s` }">
            <div class="skel__thumb shimmer shimmer--dark" style="aspect-ratio:1" />
          </div>
        </div>

        <div v-else-if="!filteredMemories.length" class="empty">
          <div class="empty__icon">💫</div>
          <h3 class="empty__title" style="color:rgba(255,255,255,.7)">{{ lbl('noContent') }}</h3>
        </div>

        <div v-else class="memories-grid">
          <article
            v-for="(mem, idx) in filteredMemories.slice(0, 6)"
            :key="`mem-${mem._mtype}-${mem.id}`"
            class="memory-card"
            data-animate="fade-up"
            :data-delay="`${idx * 75}ms`"
            @click="go('/publishments')"
          >
            <div class="memory-card__media">
              <img :src="memCover(mem)" :alt="memTitle(mem)" loading="lazy" @error="onImgErr" />
              <div class="memory-card__film" />
              <div class="memory-card__vignette" />

              <!-- top row -->
              <div class="mem-top-row">
                <span class="mem-type-pill">
                  {{ mem._mtype === 'sound' ? '🎵' : '🎬' }}
                  {{ mem._mtype === 'sound' ? lbl('sound') : lbl('video') }}
                </span>
                <span class="mem-badge-💫">💫</span>
              </div>

              <!-- playing indicator for sounds -->
              <div class="mem-wave" v-if="mem._mtype === 'sound' && mem.files?.length">
                <span v-for="b in 5" :key="b" class="mem-bar" :style="{ '--b': b }" />
              </div>

              <!-- bottom -->
              <div class="memory-card__footer">
                <h3 class="memory-card__title">{{ memTitle(mem) }}</h3>
                <p class="memory-card__sub">{{ truncate(memDesc(mem), 65) }}</p>
                <div class="memory-card__pills">
                  <span v-if="mem.files?.length">🎵 {{ mem.files.length }} {{ lbl('tracks') }}</span>
                  <span v-if="mem.durationSeconds">⏱ {{ formatTime(mem.durationSeconds) }}</span>
                  <span v-if="mem.videoClipItems?.length">📹 {{ mem.videoClipItems.length }} {{ lbl('clips') }}</span>
                  <span v-if="mem.resolution">📺 {{ mem.resolution }}</span>
                </div>
              </div>
            </div>
          </article>
        </div>

        <div class="section__footer" data-animate="fade-up">
          <button class="btn btn--glass-purple" @click="go('/publishments')">
            {{ lbl('allMemories') }}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════════════
         EVENTS (upcoming)
    ══════════════════════════════════════════════════════ -->
    <section class="section section--alt" id="events">
      <div class="container">
        <header class="section__header section__header--row" data-animate="fade-up">
          <div>
            <div class="section__badge">{{ lbl('eventsBadge') }}</div>
            <h2 class="section__title">{{ lbl('eventsTitle') }}</h2>
            <p class="section__desc">{{ lbl('eventsDesc') }}</p>
          </div>
          <button class="btn btn--outline" @click="go('/events')">
            {{ lbl('allEvents') }}
          </button>
        </header>

        <div class="events-grid">
          <article
            v-for="(ev, idx) in upcomingEvents"
            :key="ev.id"
            class="event-card"
            data-animate="fade-up"
            :data-delay="`${idx * 90}ms`"
          >
            <div class="event-card__date">
              <span class="event-card__day">{{ ev.day }}</span>
              <span class="event-card__month">{{ ev.month }}</span>
            </div>
            <div class="event-card__content">
              <span class="event-card__type">{{ ev.type }}</span>
              <h3 class="event-card__title">{{ ev.title }}</h3>
              <div class="event-card__meta">
                <span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                  {{ ev.time }}
                </span>
                <span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  {{ ev.place }}
                </span>
              </div>
            </div>
            <button class="event-card__arrow">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </article>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════════════
         SERVICES brief
    ══════════════════════════════════════════════════════ -->
    <section class="section" id="services">
      <div class="container">
        <header class="section__header" data-animate="fade-up">
          <div class="section__badge">{{ lbl('svcBadge') }}</div>
          <h2 class="section__title">{{ lbl('svcTitle') }}</h2>
          <p class="section__desc">{{ lbl('svcDesc') }}</p>
        </header>

        <div class="services-grid">
          <article
            v-for="(svc, idx) in services"
            :key="svc.slug"
            class="service-card"
            data-animate="fade-up"
            :data-delay="`${idx * 90}ms`"
          >
            <div class="service-card__media service-card__media--gradient">
              <span class="service-card__icon-large">{{ svc.icon }}</span>
            </div>
            <div class="service-card__body">
              <div class="service-card__status" :class="{ 'svc--active': svc.active }">
                {{ svc.active ? lbl('active') : lbl('inactive') }}
              </div>
              <h3 class="service-card__title">{{ svc.name }}</h3>
              <p class="service-card__text">{{ svc.desc }}</p>
              <span class="service-card__cta">
                {{ lbl('learnMore') }}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </span>
            </div>
          </article>
        </div>

        <div class="section__footer" data-animate="fade-up">
          <button class="btn btn--outline" @click="go('/services')">
            {{ lbl('allServices') }}
          </button>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════════════
         DONATION FAB
    ══════════════════════════════════════════════════════ -->
    <button class="donate-fab" @click="go('/donate')" aria-label="Donate">
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
      </svg>
      <span class="donate-fab__pulse" />
      <span class="donate-fab__label">{{ lbl('donate') }}</span>
    </button>

    <!-- ══════════════════════════════════════════════════════
         NEWS DETAIL MODAL
    ══════════════════════════════════════════════════════ -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="activeNews" class="modal-backdrop" @click.self="closeNewsModal">
          <div class="modal" role="dialog" aria-modal="true">
            <!-- Close -->
            <button class="modal__close" @click="closeNewsModal">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>

            <!-- Hero image -->
            <div class="modal__hero">
              <img :src="safeImg(activeNews.coverUrl) || fallback" :alt="nTitle(activeNews)" @error="onImgErr" />
              <div class="modal__hero-grad" />
              <div class="modal__hero-info">
                <div class="modal__hero-badges">
                  <span class="nc-cat">{{ nCat(activeNews) }}</span>
                  <span v-if="nSubCat(activeNews)" class="nc-sub">{{ nSubCat(activeNews) }}</span>
                  <span v-for="l in (activeNews.contentLanguages||[])" :key="l" class="nc-lang">{{ l }}</span>
                </div>
                <h2 class="modal__title">{{ nTitle(activeNews) }}</h2>
                <div class="modal__hero-meta">
                  <time>📅 {{ formatDate(activeNews.datePublished) }}</time>
                </div>
              </div>
            </div>

            <!-- Body -->
            <div class="modal__body">
              <!-- Description -->
              <p class="modal__desc">{{ nDesc(activeNews) }}</p>

              <!-- Both languages if available -->
              <div class="modal__bilingual" v-if="activeNews.ckbContent?.description && activeNews.kmrContent?.description && lang.activeLang !== 'KMR'">
                <div class="modal__lang-block" dir="rtl">
                  <span class="modal__lang-tag">CKB</span>
                  <p>{{ activeNews.ckbContent.description }}</p>
                </div>
              </div>

              <!-- Tags -->
              <div class="modal__chips-row" v-if="nTags(activeNews).length">
                <h4 class="modal__chips-label">{{ lbl('tags') }}</h4>
                <div class="chips-flex">
                  <span v-for="t in nTags(activeNews)" :key="t" class="chip chip--tag">#{{ t }}</span>
                </div>
              </div>

              <!-- Keywords -->
              <div class="modal__chips-row" v-if="nKeywords(activeNews).length">
                <h4 class="modal__chips-label">{{ lbl('keywords') }}</h4>
                <div class="chips-flex">
                  <span v-for="k in nKeywords(activeNews)" :key="k" class="chip chip--kw">{{ k }}</span>
                </div>
              </div>

              <!-- Media grid -->
              <div class="modal__media-section" v-if="activeNews.media?.length">
                <h4 class="modal__chips-label">{{ lbl('media') }} ({{ activeNews.media.length }})</h4>
                <div class="modal__media-grid">
                  <div v-for="(m, mi) in activeNews.media" :key="mi" class="modal__media-item">
                    <!-- IMAGE -->
                    <div v-if="m.type === 'IMAGE'" class="mmedia--image" @click="openLightbox(m.url || m.externalUrl)">
                      <img :src="m.url || m.externalUrl || fallback" @error="onImgErr" />
                      <div class="mmedia__zoom">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
                        </svg>
                      </div>
                    </div>
                    <!-- VIDEO embed -->
                    <div v-else-if="m.type === 'VIDEO'" class="mmedia--video">
                      <iframe v-if="m.embedUrl" :src="m.embedUrl" allowfullscreen class="mmedia__iframe" />
                      <video v-else-if="m.url" controls class="mmedia__video">
                        <source :src="m.url" type="video/mp4" />
                      </video>
                      <a v-else-if="m.externalUrl" :href="m.externalUrl" target="_blank" class="mmedia__ext-btn">
                        🎬 {{ lbl('openVideo') }}
                      </a>
                    </div>
                    <!-- AUDIO -->
                    <div v-else-if="m.type === 'AUDIO'" class="mmedia--audio">
                      <span class="mmedia__audio-ico">🎵</span>
                      <audio v-if="m.url" controls class="mmedia__audio-el">
                        <source :src="m.url" type="audio/mpeg" />
                      </audio>
                      <a v-else-if="m.externalUrl" :href="m.externalUrl" target="_blank" class="mmedia__ext-btn">
                        🎵 {{ lbl('openAudio') }}
                      </a>
                    </div>
                    <!-- DOCUMENT -->
                    <a v-else :href="m.url || m.externalUrl" target="_blank" class="mmedia--doc">
                      <span class="mmedia__doc-ico">📄</span>
                      <span>{{ lbl('document') }} {{ mi + 1 }}</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ══════════════════════════════════════════════════════
         IMAGE LIGHTBOX
    ══════════════════════════════════════════════════════ -->
    <Teleport to="body">
      <Transition name="lb-fade">
        <div v-if="lightboxUrl" class="lightbox" @click="lightboxUrl = null">
          <button class="lightbox__close" @click="lightboxUrl = null">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
          <div class="lightbox__frame" @click.stop>
            <img :src="lightboxUrl" class="lightbox__img" @error="onImgErr" />
          </div>
        </div>
      </Transition>
    </Teleport>

  </main>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { API_BASE_URL } from '../consts.js'
import { useLanguageStore } from '@/stores/useLanguageStore'

const router = useRouter()
const lang   = useLanguageStore()

const fallback = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f4f4f5'/%3E%3Crect x='160' y='95' width='80' height='65' rx='8' fill='%23e4e4e7'/%3E%3Ccircle cx='185' cy='118' r='10' fill='%23d4d4d8'/%3E%3Cpolygon points='160,160 200,125 230,148 260,125 280,160' fill='%23d4d4d8'/%3E%3C/svg%3E"

const BAD_HOSTS = new Set(['example.com', 'placeholder.com', 'via.placeholder.com', 'dummyimage.com'])
function safeImg(url) {
  if (!url || typeof url !== 'string' || !url.startsWith('http')) return null
  try { if (BAD_HOSTS.has(new URL(url).hostname)) return null } catch { return null }
  return url
}

/* ── API instance ── */
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' }
})

/* ════════════════════════════════════════
   i18n
   ════════════════════════════════════════ */
const i18n = {
  CKB: {
    heroKicker: 'ناوەندی کەلەپووری کوردی',
    heroMain: 'بەخێربێیت بۆ',
    heroSub: 'ناوەندی توێژینەوە و کەلەپووری کوردی',
    heroDesc: 'پاراستن و پەرەپێدانی کەلەپووری کوردی لە ڕێگەی دیجیتاڵکردن، توێژینەوە، و بڵاوکردنەوەی زانست و هونەر.',
    exploreNews: 'دۆزینەوە',
    albumMemories: 'یادگاریەکان',
    publications: 'بڵاوکراوەکان',
    scrollDown: 'گەڕان بۆ خوارەوە',
    totalNews: 'هەواڵ',
    totalPubs: 'بڵاوکراوە',
    totalProj: 'پڕۆژە',
    totalMem: 'یادگاری',
    aboutBadge: 'دەربارە',
    aboutTitle: 'دەربارەی ناوەند',
    aboutLead: 'ناوەندی کەلەپووری کوردی دامەزرا بۆ پاراستن و پەرەپێدانی کەلەپووری کوردی لەهەموو بوارەکاندا.',
    aboutText: 'ئێمە کار دەکەین لە بواری کۆکردنەوە، دیژیتاڵکردن، توێژینەوە، و بڵاوکردنەوەی کەلەپووری کوردی. گنجینەیەکی بەهایمانە لە دەنگ، وێنە، نووسین، و ڤیدیۆ بۆ داهاتووەکان دەپارێزین.',
    founded: 'ساڵی دامەزراندن',
    khi: 'KHI - ناوەندی کەلەپووری کوردی',
    sulaymaniyah: 'سلێمانی، کوردستان',
    learnMore: 'زیاتر بزانە',
    contactUs: 'پەیوەندیمان پێوە بکە',
    pillarSound: 'دەنگ',
    pillarSoundSub: 'تۆمارکردن و پاراستن',
    pillarImage: 'وێنە',
    pillarImageSub: 'ئەرشیڤی مێژووی',
    pillarVideo: 'ڤیدیۆ',
    pillarVideoSub: 'فیلم و بەڵگەفیلم',
    pillarWriting: 'نووسین',
    pillarWritingSub: 'کتێب و دەستنووس',
    newsBadge: 'هەواڵەکان',
    newsTitle: 'لە ناوەندی ڕووناکی',
    newsDesc: 'دوا هەواڵ و دیاریترین بابەتەکان',
    readMore: 'زیاتر بخوێنەوە',
    allNews: 'هەموو هەواڵەکان',
    popularBadge: 'دڵخوازەکان',
    popularTitle: 'پەسەندکراوەکان',
    popularDesc: 'زۆرترین سەردان و دڵخوازی بەکارهێنەران',
    open: 'کردنەوە',
    pubBadge: 'بڵاوکراوەکان',
    pubTitle: 'بڵاوکراوەکانمان',
    pubDesc: 'نووسین، دەنگ، وێنە، ڤیدیۆ — گنجینەی کەلەپووری کوردی',
    allPubs: 'هەموو بڵاوکراوەکان',
    sound: 'دەنگ',
    video: 'ڤیدیۆ',
    writings: 'نووسین',
    images: 'وێنە',
    tracks: 'گۆرانی',
    pages: 'لاپەڕە',
    clips: 'کلیپ',
    listen: 'گوێدان',
    watch: 'تەماشاکردن',
    read: 'خوێندنەوە',
    view: 'بینین',
    projBadge: 'پڕۆژەکان',
    projTitle: 'پڕۆژەکانمان',
    projDesc: 'دەنگ، نووسین، وێنە، ڤیدیۆ — لەگەڵ بەردەوام/تەواوکراو',
    allProjects: 'هەموو پڕۆژەکان',
    viewProject: 'پڕۆژە ببینە',
    completed: 'تەواوکراو',
    ongoing: 'بەردەوام',
    all: 'هەموو',
    reset: 'سیفرکردنەوە',
    memBadge: 'یادگاریەکان',
    memTitle: 'ئەلبووم یادگاریەکان',
    memDesc: 'دەنگ و ڤیدیۆی نایاب کە چیرۆکی کۆمەڵگا دەگێڕنەوە',
    allMemories: 'هەموو یادگاریەکان',
    memAll: 'هەموو',
    memSound: 'دەنگەکان',
    memVideo: 'ڤیدیۆکان',
    eventsBadge: 'چالاکییەکان',
    eventsTitle: 'چالاکییەکانی داهاتوو',
    eventsDesc: 'سمینار، وۆرکشۆپ، کۆنفرانس',
    allEvents: 'هەموو چالاکییەکان',
    svcBadge: 'خزمەتگوزارییەکان',
    svcTitle: 'خزمەتگوزارییەکانمان',
    svcDesc: 'هۆڵی چالاکی، چاپخانە، ستۆدیۆ، فرۆش، کتێبخانە',
    allServices: 'هەموو خزمەتگوزارییەکان',
    active: 'چالاک',
    inactive: 'ناچالاک',
    donate: 'بەخشین',
    noContent: 'ناوەڕۆک بەردەست نییە',
    tags: 'تاگەکان',
    keywords: 'کلیلەوشەکان',
    media: 'میدیا',
    openVideo: 'کردنەوەی ڤیدیۆ',
    openAudio: 'کردنەوەی دەنگ',
    document: 'بەڵگەنامە',
    sortNewest: 'نوێترین',
  },
  KMR: {
    heroKicker: 'Dezgeha Mîrasa Kurdî',
    heroMain: 'Xêr hatî bo',
    heroSub: 'Navenda Lêkolîn û Mîrasa Kurdî',
    heroDesc: 'Parastina û mezinkirina mîrasa Kurdî bi rêya dîjîtalkirin, lêkolîn û belavkirina zanist û hunerê.',
    exploreNews: 'Bigere',
    albumMemories: 'Bîranîn',
    publications: 'Weşandin',
    scrollDown: 'Xwarê bigere',
    totalNews: 'Nûçe',
    totalPubs: 'Weşandin',
    totalProj: 'Proje',
    totalMem: 'Bîranîn',
    aboutBadge: 'Derbarê',
    aboutTitle: 'Derbarê Dezgehê',
    aboutLead: 'Dezgeha Mîrasa Kurdî hat damezrandin ji bo parastina mîrasa Kurdî di hemû warî de.',
    aboutText: 'Em di warê berhevkirin, dîjîtalkirin, lêkolîn û belavkirina mîrasa Kurdî de dixebitin. Xezîneyek bi giranbiha ya deng, wêne, nivîsar û vîdyoyê ji bo nifşên pêşerojê diparêzin.',
    founded: 'Sala Damezrandinê',
    khi: 'KHI - Dezgeha Mîrasa Kurdî',
    sulaymaniyah: 'Silêmanî, Kurdistanê',
    learnMore: 'Bêtir bizane',
    contactUs: 'Pê re têkilî daynin',
    pillarSound: 'Deng',
    pillarSoundSub: 'Tomarkirin û parastin',
    pillarImage: 'Wêne',
    pillarImageSub: 'Arşîva dîrokî',
    pillarVideo: 'Vîdyo',
    pillarVideoSub: 'Fîlm û belgefîlm',
    pillarWriting: 'Nivîsar',
    pillarWritingSub: 'Pirtûk û destxet',
    newsBadge: 'Nûçe',
    newsTitle: 'Di Navenda Ronahiyê de',
    newsDesc: 'Nûçeyên dawî û mijarên herî girîng',
    readMore: 'Bêtir bixwîne',
    allNews: 'Hemû Nûçe',
    popularBadge: 'Bijartî',
    popularTitle: 'Bijartiyên Bikarhêner',
    popularDesc: 'Zêdetirîn serdanên bikarhêneran',
    open: 'Veke',
    pubBadge: 'Weşandin',
    pubTitle: 'Weşandinên Me',
    pubDesc: 'Nivîsar, deng, wêne, vîdyo — xezîneya mîrasa Kurdî',
    allPubs: 'Hemû Weşandin',
    sound: 'Deng',
    video: 'Vîdyo',
    writings: 'Nivîsar',
    images: 'Wêne',
    tracks: 'Stran',
    pages: 'Rûpel',
    clips: 'Klîp',
    listen: 'Guhdarî bike',
    watch: 'Temaşe bike',
    read: 'Bixwîne',
    view: 'Bibîne',
    projBadge: 'Proje',
    projTitle: 'Projeyên Me',
    projDesc: 'Deng, nivîsar, wêne, vîdyo — berdewam/qediyayî',
    allProjects: 'Hemû Proje',
    viewProject: 'Projeyê bibîne',
    completed: 'Qediyayî',
    ongoing: 'Berdewam',
    all: 'Hemû',
    reset: 'Sifirkirin',
    memBadge: 'Bîranîn',
    memTitle: 'Albûma Bîranînê',
    memDesc: 'Deng û vîdyoyên kêm ên ku çîroka civakê vedibêjin',
    allMemories: 'Hemû Bîranîn',
    memAll: 'Hemû',
    memSound: 'Deng',
    memVideo: 'Vîdyo',
    eventsBadge: 'Çalakî',
    eventsTitle: 'Çalakiyên Pêşerojê',
    eventsDesc: 'Semîner, workshopên, konferans',
    allEvents: 'Hemû Çalakî',
    svcBadge: 'Xizmet',
    svcTitle: 'Xizmetên Me',
    svcDesc: 'Salona çalakiyê, çapxane, stûdyo, firoş, pirtûkxane',
    allServices: 'Hemû Xizmet',
    active: 'Çalak',
    inactive: 'Neçalak',
    donate: 'Bexşîn',
    noContent: 'Naveroka berdest tune',
    tags: 'Etiket',
    keywords: 'Peyvên Kilîtê',
    media: 'Medya',
    openVideo: 'Vîdyoyê veke',
    openAudio: 'Dengê veke',
    document: 'Belge',
    sortNewest: 'Herî nû',
  }
}
function lbl(k) {
  const al = lang?.activeLang || 'CKB'
  return i18n[al]?.[k] ?? i18n['CKB']?.[k] ?? k
}

/* ════════════════════════════════════════
   HERO STATS
   ════════════════════════════════════════ */
const statsLoading = ref(true)
const heroStats = computed(() => [
  { value: newsList.value.length > 0 ? newsList.value.length + '+' : '—', label: lbl('totalNews') },
  { value: (sounds.value.length + videos.value.length + writings.value.length + imageCollections.value.length) > 0
      ? (sounds.value.length + videos.value.length + writings.value.length + imageCollections.value.length) + '+' : '—',
    label: lbl('totalPubs') },
  { value: projects.value.length > 0 ? projects.value.length + '+' : '—', label: lbl('totalProj') },
  { value: allMemories.value.length > 0 ? allMemories.value.length + '+' : '—', label: lbl('totalMem') },
])

/* ════════════════════════════════════════
   TICKER
   ════════════════════════════════════════ */
const tickerItems = computed(() => {
  const ckb = lang?.activeLang === 'KMR'
  const items = []
  newsList.value.slice(0, 5).forEach(n => { const t = nTitle(n); if (t) items.push(t) })
  sounds.value.slice(0, 3).forEach(s => { const t = pTitle(s); if (t) items.push(t) })
  videos.value.slice(0, 3).forEach(v => { const t = pTitle(v); if (t) items.push(t) })
  writings.value.slice(0, 3).forEach(w => { const t = pTitle(w); if (t) items.push(t) })
  if (!items.length) {
    return ckb
      ? ['KHI - Dezgeha Mîrasa Kurdî', 'Nûçe', 'Weşandin', 'Proje', 'Bîranîn']
      : ['KHI - ناوەندی کەلەپووری کوردی', 'هەواڵ', 'بڵاوکراوەکان', 'پڕۆژەکان', 'یادگاریەکان']
  }
  return items
})

/* ════════════════════════════════════════
   ABOUT PILLARS
   ════════════════════════════════════════ */
const aboutPillars = computed(() => [
  { icon: '🎵', title: lbl('pillarSound'),   sub: lbl('pillarSoundSub') },
  { icon: '🖼️', title: lbl('pillarImage'),   sub: lbl('pillarImageSub') },
  { icon: '🎬', title: lbl('pillarVideo'),   sub: lbl('pillarVideoSub') },
  { icon: '📚', title: lbl('pillarWriting'), sub: lbl('pillarWritingSub') },
])

/* ════════════════════════════════════════
   NEWS
   ════════════════════════════════════════ */
const newsList   = ref([])
const newsLoading = ref(false)

async function fetchNews() {
  newsLoading.value = true
  try {
    const { data } = await api.get('/news')
    newsList.value = data?.data || data || []
  } catch { /* silent */ } finally {
    newsLoading.value = false
  }
}

const displayedNews = computed(() => {
  const al = lang?.activeLang || 'CKB'
  return newsList.value
    .filter(n => {
      const langs = n.contentLanguages || []
      return langs.length === 0 || langs.includes(al)
    })
    .sort((a, b) => (b.datePublished || '').localeCompare(a.datePublished || ''))
    .slice(0, 4)
})

/* News helpers */
function nTitle(n) {
  if (!n) return ''
  const c = lang?.activeLang === 'KMR'
  return (c ? n.kmrContent?.title || n.ckbContent?.title : n.ckbContent?.title || n.kmrContent?.title) || ''
}
function nDesc(n) {
  if (!n) return ''
  const c = lang?.activeLang === 'KMR'
  return (c ? n.kmrContent?.description || n.ckbContent?.description : n.ckbContent?.description || n.kmrContent?.description) || ''
}
function nCat(n) {
  if (!n?.category) return ''
  const c = lang?.activeLang === 'KMR'
  return (c ? n.category.kmrName || n.category.ckbName : n.category.ckbName || n.category.kmrName) || ''
}
function nSubCat(n) {
  if (!n?.subCategory) return ''
  const c = lang?.activeLang === 'KMR'
  return (c ? n.subCategory.kmrName || n.subCategory.ckbName : n.subCategory.ckbName || n.subCategory.kmrName) || ''
}
function nTags(n) {
  if (!n) return []
  return [...(lang?.activeLang === 'KMR' ? (n.tags?.kmr || []) : (n.tags?.ckb || []))]
}
function nKeywords(n) {
  if (!n) return []
  return [...(lang?.activeLang === 'KMR' ? (n.keywords?.kmr || []) : (n.keywords?.ckb || []))]
}

/* ════════════════════════════════════════
   PUBLICATIONS
   ════════════════════════════════════════ */
const sounds         = ref([])
const videos         = ref([])
const writings       = ref([])
const imageCollections = ref([])
const pubLoading     = ref(false)
const activePubTab   = ref('sound')

const pubTabDefs = computed(() => [
  { key: 'sound',   icon: '🎵', label: lbl('sound'),    },
  { key: 'video',   icon: '🎬', label: lbl('video'),    },
  { key: 'writing', icon: '📚', label: lbl('writings'), },
  { key: 'image',   icon: '🖼️', label: lbl('images'),  },
])
function pubTabCount(k) {
  return { sound: sounds.value.length, video: videos.value.length, writing: writings.value.length, image: imageCollections.value.length }[k] || 0
}
function switchPubTab(k) { activePubTab.value = k }

async function fetchPublications() {
  pubLoading.value = true
  try {
    const [s, v, w, i] = await Promise.allSettled([
      api.get('/soundtracks'),
      api.get('/videos', { params: { page: 0, size: 100 } }),
      api.get('/writings', { params: { page: 0, size: 100 } }),
      api.get('/image-collections'),
    ])
    if (s.status === 'fulfilled') {
      const d = s.value.data
      sounds.value = (Array.isArray(d) ? d : d?.data || [])
    }
    if (v.status === 'fulfilled') {
      const d = v.value.data
      videos.value = d?.content || d?.data?.content || []
    }
    if (w.status === 'fulfilled') {
      const d = w.value.data
      writings.value = d?.data?.content || d?.content || []
    }
    if (i.status === 'fulfilled') {
      const d = i.value.data
      imageCollections.value = d?.data || d || []
    }
  } finally {
    pubLoading.value = false
    statsLoading.value = false
  }
}

/* Publication helpers */
function pCover(item) {
  if (!item) return fallback
  const al = lang?.activeLang
  return safeImg(al === 'KMR' ? item.kmrCoverUrl : item.ckbCoverUrl)
    || safeImg(item.ckbCoverUrl) || safeImg(item.kmrCoverUrl) || safeImg(item.hoverCoverUrl) || fallback
}
function pTitle(item) {
  if (!item) return ''
  const c = lang?.activeLang === 'KMR'
  return (c ? item.kmrContent?.title || item.ckbContent?.title : item.ckbContent?.title || item.kmrContent?.title) || ''
}
function pDesc(item) {
  if (!item) return ''
  const c = lang?.activeLang === 'KMR'
  return (c ? item.kmrContent?.description || item.ckbContent?.description : item.ckbContent?.description || item.kmrContent?.description) || ''
}
function pTags(item) {
  if (!item) return []
  return [...(lang?.activeLang === 'KMR' ? (item.tagsKmr || []) : (item.tagsCkb || []))]
}
function pWriter(item) {
  if (!item) return ''
  const c = lang?.activeLang === 'KMR'
  return (c ? item.kmrContent?.writer || item.ckbContent?.writer : item.ckbContent?.writer || item.kmrContent?.writer) || ''
}

/* ════════════════════════════════════════
   HERO SLIDESHOW
   ════════════════════════════════════════ */
const heroSlideIndex = ref(0)
let slideTimer = null

const heroSlides = computed(() => {
  const imgs = []
  newsList.value.slice(0, 5).forEach(n => { const u = safeImg(n.coverUrl); if (u) imgs.push(u) })
  sounds.value.slice(0, 2).forEach(s => { const u = safeImg(s.ckbCoverUrl) || safeImg(s.kmrCoverUrl) || safeImg(s.hoverCoverUrl); if (u) imgs.push(u) })
  videos.value.slice(0, 2).forEach(v => { const u = safeImg(v.ckbCoverUrl) || safeImg(v.kmrCoverUrl) || safeImg(v.hoverCoverUrl); if (u) imgs.push(u) })
  imageCollections.value.slice(0, 3).forEach(ic => { const u = safeImg(ic.ckbCoverUrl) || safeImg(ic.kmrCoverUrl); if (u) imgs.push(u) })
  return imgs.slice(0, 8)
})

const aboutImage = computed(() => {
  for (const ic of imageCollections.value) {
    const u = safeImg(ic.ckbCoverUrl) || safeImg(ic.kmrCoverUrl)
    if (u) return u
  }
  for (const n of newsList.value) {
    const u = safeImg(n.coverUrl)
    if (u) return u
  }
  return null
})

function startSlideshow() {
  if (slideTimer) clearInterval(slideTimer)
  slideTimer = setInterval(() => {
    if (heroSlides.value.length > 1) {
      heroSlideIndex.value = (heroSlideIndex.value + 1) % heroSlides.value.length
    }
  }, 5000)
}

watch(heroSlides, (imgs) => {
  if (imgs.length > 1) startSlideshow()
  else { clearInterval(slideTimer); slideTimer = null }
})

/* ════════════════════════════════════════
   POPULAR SLIDER
   ════════════════════════════════════════ */
const popularSliderRef = ref(null)
const popularSlide     = ref(0)

const popularItems = computed(() => {
  const items = []
  sounds.value.slice(0, 2).forEach(x => items.push({
    _key: `s-${x.id}`, _route: '/publishments',
    typeLabel: '🎵 ' + lbl('sound'),
    title: pTitle(x), summary: pDesc(x),
    image: pCover(x),
  }))
  videos.value.slice(0, 2).forEach(x => items.push({
    _key: `v-${x.id}`, _route: '/publishments',
    typeLabel: '🎬 ' + lbl('video'),
    title: pTitle(x), summary: pDesc(x),
    image: pCover(x),
  }))
  writings.value.slice(0, 2).forEach(x => items.push({
    _key: `w-${x.id}`, _route: '/publishments',
    typeLabel: '📚 ' + lbl('writings'),
    title: pTitle(x), summary: pDesc(x),
    image: pCover(x),
  }))
  projects.value.slice(0, 2).forEach(x => items.push({
    _key: `p-${x.id}`, _route: '/projects',
    typeLabel: '📂 ' + lbl('projBadge'),
    title: projTitle(x), summary: projDesc(x),
    image: safeImg(x.coverUrl) || fallback,
  }))
  return items
})

function nextPopular() {
  const el = popularSliderRef.value
  if (!el) return
  el.scrollBy({ left: lang.isKMR ? 340 : -340, behavior: 'smooth' })
  popularSlide.value = Math.min(popularSlide.value + 1, Math.ceil(popularItems.value.length / 3) - 1)
}
function prevPopular() {
  const el = popularSliderRef.value
  if (!el) return
  el.scrollBy({ left: lang.isKMR ? -340 : 340, behavior: 'smooth' })
  popularSlide.value = Math.max(popularSlide.value - 1, 0)
}
function goPopularSlide(i) {
  const el = popularSliderRef.value
  if (!el) return
  el.scrollTo({ left: i * 340 * 3, behavior: 'smooth' })
  popularSlide.value = i
}

/* ════════════════════════════════════════
   PROJECTS
   ════════════════════════════════════════ */
const projects    = ref([])
const projLoading = ref(false)
const projFilter  = ref('all')

const projFilterDefs = computed(() => [
  { val: 'all',       label: lbl('all') },
  { val: 'ONGOING',   label: lbl('ongoing') },
  { val: 'COMPLETED', label: lbl('completed') },
])

const filteredProjects = computed(() => {
  const al = lang?.activeLang || 'CKB'
  let list = projects.value.filter(p => {
    const langs = p.contentLanguages || []
    return langs.length === 0 || langs.includes(al)
  })
  if (projFilter.value !== 'all') list = list.filter(p => p.status === projFilter.value)
  return list
})

function projTitle(p) {
  if (!p) return ''
  const c = lang?.activeLang === 'KMR'
  return (c ? p.kmrContent?.title || p.ckbContent?.title : p.ckbContent?.title || p.kmrContent?.title) || ''
}
function projDesc(p) {
  if (!p) return ''
  const c = lang?.activeLang === 'KMR'
  return (c ? p.kmrContent?.description || p.ckbContent?.description : p.ckbContent?.description || p.kmrContent?.description) || ''
}
function projTags(p) {
  if (!p) return []
  return [...(lang?.activeLang === 'KMR' ? (p.tagsKmr || []) : (p.tagsCkb || []))]
}
function projType(p) { return p?.projectType || p?.status || '' }

async function fetchProjects() {
  projLoading.value = true
  try {
    const { data } = await api.get('/projects/getAll', { params: { page: 0, size: 50 } })
    projects.value = data?.data?.content || data?.content || []
  } catch { /* silent */ } finally {
    projLoading.value = false
  }
}

/* ════════════════════════════════════════
   MEMORIES
   ════════════════════════════════════════ */
const memLoading  = ref(false)
const memFilter   = ref('all')

const memFilterDefs = computed(() => [
  { val: 'all',   icon: '💫', label: lbl('memAll') },
  { val: 'sound', icon: '🎵', label: lbl('memSound') },
  { val: 'video', icon: '🎬', label: lbl('memVideo') },
])

const allMemories = computed(() => {
  const s = sounds.value.filter(x => x.albumOfMemories).map(x => ({ ...x, _mtype: 'sound' }))
  const v = videos.value.filter(x => x.albumOfMemories).map(x => ({ ...x, _mtype: 'video' }))
  return [...s, ...v]
})

const filteredMemories = computed(() => {
  if (memFilter.value === 'all') return allMemories.value
  return allMemories.value.filter(m => m._mtype === memFilter.value)
})

function memCover(m) { return pCover(m) }
function memTitle(m) { return pTitle(m) }
function memDesc(m)  { return pDesc(m) }

/* ════════════════════════════════════════
   IMAGE LIGHTBOX (for image collection preview)
   ════════════════════════════════════════ */
const lightboxUrl = ref(null)
function openLightbox(url) { lightboxUrl.value = url }
function openImageLightbox(item) {
  const first = item.imageAlbum?.[0]
  const url = first?.imageUrl || first?.externalUrl || pCover(item)
  if (url) lightboxUrl.value = url
  else go('/publishments')
}

/* ════════════════════════════════════════
   UPCOMING EVENTS (static demo data)
   ════════════════════════════════════════ */
const upcomingEvents = computed(() => {
  const isKMR = lang?.activeLang === 'KMR'
  return [
    { id: 1, day: '٠٥', month: isKMR ? 'Şub' : 'Feb', type: isKMR ? 'Semîner' : 'سمینار',  title: isKMR ? 'Rêziman û Fonetîk' : 'سمینار: ڕێزمان و فۆنێتیک',              time: '18:00', place: isKMR ? 'Salon 1' : 'هۆڵی ١' },
    { id: 2, day: '١٢', month: isKMR ? 'Şub' : 'Feb', type: isKMR ? 'Workshop' : 'وۆرکشۆپ', title: isKMR ? 'Dîjîtalkirin a Arşîvê' : 'وۆرکشۆپ: دیژیتاڵکردنی ئەرشیڤ',      time: '16:00', place: isKMR ? 'Stûdyo' : 'ستۆدیۆ' },
    { id: 3, day: '٢١', month: isKMR ? 'Mar' : 'Mar', type: isKMR ? 'Konferans' : 'کۆنفرانس', title: isKMR ? 'Mîrasa Kurdî' : 'کۆنفرانس: کەلەپووری کوردی',                time: '10:00', place: isKMR ? 'Salona Sereke' : 'هۆڵی سەرەکی' },
    { id: 4, day: '٠٣', month: isKMR ? 'Nis' : 'Apr', type: isKMR ? 'Pêşangehek' : 'پیشاندان', title: isKMR ? 'Wêneyên Dîrokî' : 'پیشاندانی وێنەی مێژوویی',             time: '09:00', place: isKMR ? 'Galerî' : 'گالەری' },
  ]
})

/* ════════════════════════════════════════
   SERVICES (static)
   ════════════════════════════════════════ */
const services = computed(() => {
  const isKMR = lang?.activeLang === 'KMR'
  return [
    { slug: 'hall',    icon: '🏛️', active: true,  name: isKMR ? 'Salona Çalakiyê' : 'هۆڵی چالاکی',   desc: isKMR ? 'Ji bo semîner, bûyer û pêşangahan amade ye.' : 'بۆ سمینار، بۆنە، و پێشانگا بە تەواوی ئامادەیی.' },
    { slug: 'studio',  icon: '🎙️', active: true,  name: isKMR ? 'Stûdyoya Tomarkirinê' : 'ستۆدیۆی تۆمارکردن', desc: isKMR ? 'Tomarkirin deng û vîdyo bi şêweya profesyonel.' : 'تۆمارکردنی دەنگ و ڤیدیۆ بە شێوەی پڕۆفێشناڵ.' },
    { slug: 'library', icon: '📖', active: true,  name: isKMR ? 'Pirtûkxane' : 'کتێبخانە',           desc: isKMR ? 'Pirtûk, kovar û destnivîsên kêm.' : 'کتێب، گۆڤار، و دەستنووسی نایاب.' },
  ]
})

/* ════════════════════════════════════════
   NEWS MODAL
   ════════════════════════════════════════ */
const activeNews = ref(null)
function openNewsModal(item) {
  if (!item) return
  activeNews.value = item
  document.body.style.overflow = 'hidden'
}
function closeNewsModal() {
  activeNews.value = null
  document.body.style.overflow = ''
}

/* ════════════════════════════════════════
   UTILS
   ════════════════════════════════════════ */
function go(path) { router.push(path) }
function scrollTo(sel) {
  document.querySelector(sel)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
function truncate(t, max) {
  if (!t) return ''
  return t.length > max ? t.slice(0, max) + '…' : t
}
function formatDate(v) {
  if (!v) return ''
  try {
    const d = new Date(v)
    if (isNaN(d)) return String(v)
    return d.toLocaleDateString(lang?.activeLang === 'KMR' ? 'ku' : 'ckb', { year: 'numeric', month: 'long', day: 'numeric' })
  } catch { return String(v) }
}
function formatTime(s) {
  if (!s || isNaN(s)) return '0:00'
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60).toString().padStart(2, '0')
  return m >= 60 ? `${Math.floor(m/60)}:${String(m%60).padStart(2,'0')}:${sec}` : `${m}:${sec}`
}
function onImgErr(e) { e.target.src = fallback }
function particleStyle(i) {
  const seed = i * 137.508
  return {
    '--x': `${seed % 100}%`,
    '--y': `${(seed * 1.618) % 100}%`,
    '--duration': `${15 + (i * 3.7) % 22}s`,
    '--delay': `${(i * 1.2) % 6}s`,
    '--size': `${2 + (i % 4)}px`,
  }
}

/* ════════════════════════════════════════
   PARALLAX
   ════════════════════════════════════════ */
const heroBgRef    = ref(null)
let   parallaxRaf  = false
function handleParallax() {
  if (!parallaxRaf) {
    requestAnimationFrame(() => {
      if (heroBgRef.value) {
        heroBgRef.value.style.transform = `translateY(${window.scrollY * 0.35}px) scale(1.1)`
      }
      parallaxRaf = false
    })
    parallaxRaf = true
  }
}

/* ════════════════════════════════════════
   INTERSECTION OBSERVER animations
   ════════════════════════════════════════ */
let observer = null
function initAnimations() {
  const els = document.querySelectorAll('[data-animate]')
  observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const d = parseInt(e.target.dataset.delay) || 0
        setTimeout(() => e.target.classList.add('animated'), d)
        observer.unobserve(e.target)
      }
    })
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' })
  els.forEach(el => observer.observe(el))
}

/* ════════════════════════════════════════
   KEYBOARD
   ════════════════════════════════════════ */
function handleKeydown(e) {
  if (e.key === 'Escape') {
    if (lightboxUrl.value) { lightboxUrl.value = null; return }
    if (activeNews.value) closeNewsModal()
  }
}

/* ════════════════════════════════════════
   LIFECYCLE
   ════════════════════════════════════════ */
onMounted(async () => {
  initAnimations()
  window.addEventListener('scroll', handleParallax, { passive: true })
  document.addEventListener('keydown', handleKeydown)
  await Promise.allSettled([fetchNews(), fetchPublications(), fetchProjects()])
  startSlideshow()
  nextTick(initAnimations)
})
onUnmounted(() => {
  if (observer) observer.disconnect()
  if (slideTimer) clearInterval(slideTimer)
  window.removeEventListener('scroll', handleParallax)
  document.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})
</script>

<style scoped>
/* ════════════════════════════════════════════════════════
   CSS CUSTOM PROPERTIES — Stanford Inspired Home Style
   ════════════════════════════════════════════════════════ */
.home {
  --brand: #8C1515;
  --brand-light: #B83A4B;
  --brand-dark: #6B0F0F;
  --brand-glow: rgba(140,21,21,0.4);
  --white: #FFFFFF;
  --black: #0A0A0A;
  --grey-50: #FAFAFA;
  --grey-100: #F4F4F5;
  --grey-200: #E4E4E7;
  --grey-300: #D4D4D8;
  --grey-400: #A1A1AA;
  --grey-500: #71717A;
  --grey-600: #52525B;
  --grey-700: #3F3F46;
  --grey-800: #27272A;
  --grey-900: #18181B;
  --font-sans: 'Noto Sans Arabic','Source Sans 3',system-ui,sans-serif;
  --font-display: 'Noto Kufi Arabic','Source Serif 4',Georgia,serif;
  --container: 1240px;
  --section-spacing: clamp(60px,8vw,100px);
  --ease-out: cubic-bezier(0.16,1,0.3,1);
  --ease-spring: cubic-bezier(0.34,1.56,0.64,1);
  --duration-fast: 150ms;
  --duration-norm: 300ms;
  --duration-slow: 500ms;
  --shadow-sm: 0 1px 2px rgba(0,0,0,.05);
  --shadow-md: 0 4px 6px -1px rgba(0,0,0,.1),0 2px 4px -1px rgba(0,0,0,.06);
  --shadow-lg: 0 10px 15px -3px rgba(0,0,0,.1),0 4px 6px -2px rgba(0,0,0,.05);
  --shadow-xl: 0 20px 25px -5px rgba(0,0,0,.1),0 10px 10px -5px rgba(0,0,0,.04);
  --shadow-2xl: 0 25px 50px -12px rgba(0,0,0,.25);
  --shadow-glow: 0 0 40px rgba(140,21,21,.15);
  --radius-sm: 6px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  --radius-full: 9999px;
  font-family: var(--font-sans);
  color: var(--grey-900);
  background: var(--white);
  overflow-x: hidden;
}

/* ── ANIMATIONS ── */
[data-animate] {
  opacity: 0;
  transform: translateY(28px);
  transition: opacity var(--duration-slow) var(--ease-out),
              transform var(--duration-slow) var(--ease-out);
}
[data-animate].animated { opacity: 1; transform: translateY(0); }

.grid-fade-enter-active,.grid-fade-leave-active { transition: all var(--duration-norm) var(--ease-out); }
.grid-fade-enter-from,.grid-fade-leave-to { opacity:0; transform:scale(.95); }
.tab-switch-enter-active,.tab-switch-leave-active { transition: all var(--duration-norm) var(--ease-out); }
.tab-switch-enter-from { opacity:0; transform:translateY(12px); }
.tab-switch-leave-to { opacity:0; transform:translateY(-8px); }
.modal-fade-enter-active,.modal-fade-leave-active { transition: all var(--duration-norm) var(--ease-out); }
.modal-fade-enter-from,.modal-fade-leave-to { opacity:0; }
.modal-fade-enter-from .modal,.modal-fade-leave-to .modal { transform:scale(.94) translateY(20px); }
.lb-fade-enter-active,.lb-fade-leave-active { transition: opacity var(--duration-norm); }
.lb-fade-enter-from,.lb-fade-leave-to { opacity:0; }

/* ── LAYOUT ── */
.container { max-width:var(--container); margin:0 auto; padding:0 24px; }
@media (min-width:768px) { .container { padding:0 40px; } }
.section { padding:var(--section-spacing) 0; position:relative; }
.section--alt  { background:var(--grey-50); }
.section--dark {
  background: linear-gradient(135deg,var(--grey-900) 0%,var(--black) 100%);
  color:var(--white);
}
.section--publications { background: linear-gradient(160deg,#111 0%,#1a0606 50%,#0a0a0a 100%); }
.section--memories {
  background: linear-gradient(135deg,#0f0a1e 0%,#1a0a2e 55%,#0a1225 100%);
  color:var(--white); overflow:hidden; position:relative;
}

/* ── SECTION HEADERS ── */
.section__header { text-align:center; margin-bottom:48px; }
.section__header--row {
  display:flex; flex-direction:column; align-items:center;
  gap:24px; text-align:center; margin-bottom:40px;
}
@media (min-width:768px) {
  .section__header--row { flex-direction:row; justify-content:space-between; text-align:right; }
}
.section__badge {
  display:inline-flex; align-items:center; padding:6px 16px;
  background: linear-gradient(135deg,var(--brand) 0%,var(--brand-light) 100%);
  color:var(--white); font-size:12px; font-weight:700;
  letter-spacing:.05em; border-radius:var(--radius-full); margin-bottom:16px;
}
.section__badge--light { background:rgba(255,255,255,.15); backdrop-filter:blur(10px); }
.section__badge--mem   { background:linear-gradient(135deg,#6C3483 0%,#8C1515 100%); }
.section__title { font-family:var(--font-display); font-size:clamp(26px,4vw,40px); font-weight:800; line-height:1.2; margin:0 0 12px; }
.section__title--light { color:var(--white); }
.section__desc  { color:var(--grey-500); font-size:16px; margin:0; }
.section__desc--light { color:var(--grey-400); }
.section__footer { display:flex; justify-content:center; margin-top:48px; }

/* ════════════════════════════════════════
   HERO
   ════════════════════════════════════════ */
.hero {
  position:relative; min-height:100vh;
  display:flex; align-items:center; justify-content:center; overflow:hidden;
}
.hero__slides {
  position:absolute; inset:-10%;
  will-change:transform;
}
.hero__slide {
  position:absolute; inset:0;
  background-size:cover; background-position:center;
  opacity:0;
  transition:opacity 1.4s cubic-bezier(0.4,0,0.2,1);
}
.hero__slide--active { opacity:1; }
.hero__slide--gradient {
  background: linear-gradient(135deg, #1a0505 0%, #8C1515 40%, #2d0a0a 70%, #0a0a14 100%);
}
/* Slide dots */
.hero__dots {
  position:absolute; bottom:100px; left:50%; transform:translateX(-50%);
  display:flex; gap:8px; z-index:3;
}
.hero__dot {
  width:7px; height:7px; border-radius:50%;
  background:rgba(255,255,255,.35); cursor:pointer;
  transition:all 0.3s ease;
}
.hero__dot--active {
  width:22px; border-radius:4px;
  background:rgba(255,255,255,.9);
}
.hero__overlay {
  position:absolute; inset:0;
  background:linear-gradient(180deg,rgba(0,0,0,.72) 0%,rgba(0,0,0,.38) 45%,rgba(0,0,0,.65) 100%);
}
.hero__grain {
  position:absolute; inset:0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
  background-size: 256px;
  pointer-events:none;
}
.hero__particles { position:absolute; inset:0; overflow:hidden; pointer-events:none; }
.particle {
  position:absolute; width:var(--size); height:var(--size);
  background:rgba(255,255,255,.25); border-radius:50%;
  left:var(--x); top:var(--y);
  animation:float var(--duration) var(--delay) infinite ease-in-out;
}
@keyframes float {
  0%,100% { transform:translate(0,0) scale(1); opacity:.25; }
  50%      { transform:translate(16px,-28px) scale(1.2); opacity:.5; }
}
/* Corner decoration */
.hero__corner { position:absolute; width:80px; height:80px; border-color:rgba(255,255,255,.15); border-style:solid; }
.hero__corner--tl { top:40px; right:40px; border-width:2px 0 0 2px; }
.hero__corner--tr { top:40px; left:40px; border-width:2px 2px 0 0; }
.hero__corner--bl { bottom:40px; right:40px; border-width:0 0 2px 2px; }
.hero__corner--br { bottom:40px; left:40px; border-width:0 2px 2px 0; }

.hero__content {
  position:relative; z-index:2; text-align:center;
  color:var(--white); padding:110px 0 80px;
}
.hero__kicker { display:inline-flex; align-items:center; gap:14px; margin:0 0 20px; font-size:13px; font-weight:600; letter-spacing:.14em; text-transform:uppercase; opacity:.85; }
.kicker__line { width:36px; height:1px; background:currentColor; opacity:.5; }
.hero__title { font-family:var(--font-display); margin:0 0 22px; text-shadow:0 4px 30px rgba(0,0,0,.3); }
.hero__title-line { display:block; }
.hero__title-line--main { font-size:clamp(22px,3vw,32px); font-weight:400; opacity:.85; }
.hero__title-line--sub  { font-size:clamp(34px,6vw,70px); font-weight:900; line-height:1.1; }
.hero__desc { font-size:clamp(15px,1.8vw,19px); line-height:1.7; max-width:560px; margin:0 auto 36px; opacity:.88; }
.hero__actions { display:flex; flex-wrap:wrap; gap:14px; justify-content:center; margin-bottom:44px; }
.hero__stats  { display:flex; justify-content:center; gap:0; flex-wrap:wrap; }
.hstat { display:flex; align-items:center; }
.hstat__inner { text-align:center; padding:0 28px; }
.hstat__value { display:block; font-family:var(--font-display); font-size:clamp(28px,4vw,44px); font-weight:900; line-height:1; margin-bottom:6px; }
.hstat__value--loading { opacity:.4; }
.hstat__label { font-size:12px; opacity:.7; letter-spacing:.04em; }
.hstat__sep { width:1px; height:40px; background:rgba(255,255,255,.2); }

/* Scroll cue */
.scroll-cue {
  position:absolute; bottom:36px; left:50%; transform:translateX(-50%);
  display:flex; flex-direction:column; align-items:center; gap:10px;
  background:none; border:none; color:var(--white); cursor:pointer; opacity:.65;
  transition:opacity var(--duration-norm);
}
.scroll-cue:hover { opacity:1; }
.scroll-cue__mouse { width:24px; height:38px; border:2px solid currentColor; border-radius:12px; display:flex; justify-content:center; padding-top:7px; }
.scroll-cue__wheel { width:3px; height:7px; background:currentColor; border-radius:2px; animation:sw 1.6s infinite; }
@keyframes sw { 0%{opacity:1;transform:translateY(0)} 100%{opacity:0;transform:translateY(10px)} }
.scroll-cue__text { font-size:10px; letter-spacing:.1em; text-transform:uppercase; }

/* ════════════════════════════════════════
   TICKER
   ════════════════════════════════════════ */
.ticker { background:linear-gradient(135deg,var(--brand) 0%,var(--brand-dark) 100%); overflow:hidden; padding:14px 0; }
.ticker__track {
  display:flex; gap:0; white-space:nowrap;
  animation:scroll-ticker 40s linear infinite;
}
@keyframes scroll-ticker {
  0%   { transform:translateX(0); }
  100% { transform:translateX(-50%); }
}
.ticker__item { display:inline-flex; align-items:center; gap:12px; padding:0 20px; color:rgba(255,255,255,.9); font-size:14px; font-weight:600; }
.ticker__dot  { color:rgba(255,255,255,.4); font-size:8px; }

/* ════════════════════════════════════════
   BUTTONS
   ════════════════════════════════════════ */
.btn {
  display:inline-flex; align-items:center; gap:10px;
  padding:13px 26px; font-family:var(--font-sans); font-size:15px;
  font-weight:700; border:none; border-radius:var(--radius-full);
  cursor:pointer; transition:all var(--duration-norm) var(--ease-out);
  text-decoration:none;
}
.btn svg,.btn__icon { width:17px; height:17px; transition:transform var(--duration-norm) var(--ease-out); }
.btn:hover svg,.btn:hover .btn__icon { transform:translateX(-4px); }
.btn--primary {
  background:linear-gradient(135deg,var(--brand) 0%,var(--brand-light) 100%);
  color:var(--white); box-shadow:0 4px 20px var(--brand-glow);
}
.btn--primary:hover { transform:translateY(-2px); box-shadow:0 8px 30px var(--brand-glow); }
.btn--glow { position:relative; overflow:hidden; }
.btn--glow::before {
  content:''; position:absolute; inset:0;
  background:linear-gradient(90deg,transparent,rgba(255,255,255,.2),transparent);
  transform:translateX(-100%); transition:transform .6s;
}
.btn--glow:hover::before { transform:translateX(100%); }
.btn--glass {
  background:rgba(255,255,255,.1); color:var(--white);
  border:1px solid rgba(255,255,255,.2); backdrop-filter:blur(10px);
}
.btn--glass:hover { background:rgba(255,255,255,.18); }
.btn--ghost {
  background:transparent; color:rgba(255,255,255,.8);
  border:1px solid rgba(255,255,255,.3);
}
.btn--ghost:hover { background:rgba(255,255,255,.08); color:var(--white); }
.btn--outline {
  background:transparent; color:var(--grey-900);
  border:2px solid var(--grey-200);
}
.btn--outline:hover { border-color:var(--brand); color:var(--brand); }
.btn--glass-purple {
  background:linear-gradient(135deg,rgba(108,52,131,.3) 0%,rgba(140,21,21,.3) 100%);
  color:var(--white); border:1px solid rgba(255,255,255,.2); backdrop-filter:blur(10px);
}
.btn--glass-purple:hover { background:linear-gradient(135deg,rgba(108,52,131,.5) 0%,rgba(140,21,21,.5) 100%); }

/* ════════════════════════════════════════
   ABOUT
   ════════════════════════════════════════ */
.about-layout { display:grid; gap:56px; align-items:center; }
@media (min-width:900px) { .about-layout { grid-template-columns:1fr 1fr; } }
.about__media-wrap { position:relative; padding-bottom:24px; padding-left:24px; }
.about__img-frame { position:relative; }
.about__img { width:100%; aspect-ratio:4/3; object-fit:cover; border-radius:var(--radius-xl); box-shadow:var(--shadow-2xl); display:block; }
.about__img--gradient {
  background: linear-gradient(135deg, #1a0505 0%, var(--brand) 45%, #2d0a0a 80%, #0a0a14 100%);
}
.about__img-border {
  position:absolute; inset:12px -12px -12px 12px;
  border:3px solid var(--brand); border-radius:var(--radius-xl); opacity:.3; pointer-events:none;
}
.about__year-badge {
  position:absolute; bottom:0; right:0;
  background:linear-gradient(135deg,var(--brand) 0%,var(--brand-light) 100%);
  color:var(--white); padding:20px 24px; border-radius:var(--radius-lg);
  text-align:center; box-shadow:var(--shadow-lg);
}
.about__year-num { display:block; font-family:var(--font-display); font-size:30px; font-weight:900; line-height:1; }
.about__year-lbl { font-size:11px; opacity:.85; letter-spacing:.06em; }
.about__float-card {
  position:absolute; top:24px; right:0;
  background:var(--white); border:1px solid var(--grey-200);
  padding:14px 18px; border-radius:var(--radius-lg); box-shadow:var(--shadow-lg);
  display:flex; align-items:center; gap:12px;
}
.about__float-ico { font-size:26px; }
.about__float-title { font-weight:700; font-size:13px; color:var(--grey-900); }
.about__float-sub   { font-size:11px; color:var(--grey-500); }
.about__lead { font-size:18px; font-weight:700; line-height:1.55; color:var(--grey-800); margin:0 0 14px; }
.about__text { font-size:15px; line-height:1.8; color:var(--grey-600); margin:0 0 28px; }
.about__pillars { display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-bottom:30px; }
.pillar {
  display:flex; align-items:center; gap:12px;
  padding:14px 16px; background:var(--grey-50);
  border:1px solid var(--grey-100); border-radius:var(--radius-md);
  transition:all var(--duration-norm);
}
.pillar:hover { background:rgba(140,21,21,.04); border-color:rgba(140,21,21,.2); }
.pillar__icon { font-size:22px; }
.pillar__title { display:block; font-weight:700; font-size:14px; color:var(--grey-900); }
.pillar__sub   { font-size:11px; color:var(--grey-500); }
.about__actions { display:flex; gap:12px; flex-wrap:wrap; }

/* ════════════════════════════════════════
   NEWS GRID
   ════════════════════════════════════════ */
.news-grid { display:grid; gap:24px; }
@media (min-width:1024px) { .news-grid { grid-template-columns:1.55fr 1fr; } }

.news-card {
  background:var(--white); border-radius:var(--radius-lg); overflow:hidden;
  cursor:pointer; transition:all var(--duration-norm) var(--ease-out);
  border:1px solid var(--grey-100);
}
.news-card:hover { transform:translateY(-4px); box-shadow:var(--shadow-xl); }
.news-card--featured { display:grid; }
@media (min-width:768px) { .news-card--featured { grid-template-columns:1.15fr 1fr; } }
.news-card__media { position:relative; aspect-ratio:16/10; overflow:hidden; }
.news-card--featured .news-card__media { aspect-ratio:4/3; }
@media (min-width:768px) { .news-card--featured .news-card__media { aspect-ratio:auto; height:100%; } }
.news-card__media img { width:100%; height:100%; object-fit:cover; transition:transform var(--duration-slow); }
.news-card:hover .news-card__media img { transform:scale(1.05); }
.news-card__overlay {
  position:absolute; inset:0; background:rgba(0,0,0,.3);
  display:flex; align-items:center; justify-content:center;
  opacity:0; transition:opacity var(--duration-norm);
}
.news-card:hover .news-card__overlay { opacity:1; }
.news-card__play {
  width:60px; height:60px; background:var(--white); border-radius:50%;
  display:flex; align-items:center; justify-content:center;
  color:var(--brand); transform:scale(.8);
  transition:transform var(--duration-norm) var(--ease-spring);
}
.news-card:hover .news-card__play { transform:scale(1); }
.news-card__play svg { width:22px; height:22px; margin-right:-3px; }
.nc-badges { position:absolute; top:10px; right:10px; display:flex; flex-wrap:wrap; gap:5px; justify-content:flex-end; }
.nc-cat {
  padding:5px 12px; background:linear-gradient(135deg,var(--brand),var(--brand-light));
  color:var(--white); font-size:11px; font-weight:700; border-radius:var(--radius-full);
}
.nc-cat--sm { padding:4px 10px; font-size:10px; }
.nc-sub { padding:4px 10px; background:rgba(140,21,21,.12); color:var(--brand); font-size:10px; font-weight:700; border-radius:var(--radius-full); }
.nc-lang {
  padding:3px 8px; background:rgba(0,0,0,.5); backdrop-filter:blur(6px);
  color:#fff; font-size:10px; font-weight:700; border-radius:var(--radius-full);
}
.news-card__content { padding:24px; display:flex; flex-direction:column; }
.news-card--featured .news-card__content { padding:28px; justify-content:center; }
.news-card__subcat { display:block; font-size:11px; color:var(--brand); font-weight:700; text-transform:uppercase; letter-spacing:.06em; margin-bottom:10px; }
.news-card__title { font-family:var(--font-display); font-size:22px; font-weight:800; line-height:1.3; margin:0 0 10px; color:var(--grey-900); }
.news-card__title--sm { font-size:16px; margin-bottom:6px; }
.news-card__excerpt { color:var(--grey-600); line-height:1.7; margin:0 0 14px; flex:1; }
.news-card__excerpt--sm { font-size:13px; }
.news-card__meta { display:flex; align-items:center; gap:8px; color:var(--grey-400); font-size:12px; margin-bottom:14px; }
.meta-dot { width:3px; height:3px; background:currentColor; border-radius:50%; }
.nc-tags-row { display:flex; gap:5px; flex-wrap:wrap; }
.nctag { color:var(--brand); font-size:11px; font-weight:600; }
.news-card__cta { display:inline-flex; align-items:center; gap:7px; color:var(--brand); font-weight:700; font-size:13px; }
.news-card__cta svg { width:14px; height:14px; transition:transform var(--duration-norm); }
.news-card:hover .news-card__cta svg { transform:translateX(-4px); }
.news-secondary { display:grid; gap:14px; }
.news-card--sm { display:grid; grid-template-columns:110px 1fr; gap:14px; padding:12px; }
.news-card--sm .news-card__media { aspect-ratio:1; border-radius:var(--radius-md); }
.news-card--sm .news-card__content { padding:0; justify-content:center; }

/* ════════════════════════════════════════
   POPULAR SLIDER
   ════════════════════════════════════════ */
.slider-nav { display:flex; align-items:center; gap:14px; }
.slider-btn {
  width:48px; height:48px; border-radius:50%;
  border:1px solid rgba(255,255,255,.2); background:rgba(255,255,255,.08);
  color:var(--white); cursor:pointer; display:flex; align-items:center; justify-content:center;
  transition:all var(--duration-norm);
}
.slider-btn:hover { background:rgba(255,255,255,.18); }
.slider-btn svg { width:20px; height:20px; }
.slider-dots { display:flex; gap:7px; }
.slider-dot { width:8px; height:8px; border-radius:50%; background:rgba(255,255,255,.3); cursor:pointer; transition:all var(--duration-norm); }
.slider-dot.active { background:var(--white); transform:scale(1.25); }
.popular-slider {
  display:grid; grid-auto-flow:column; grid-auto-columns:minmax(280px,320px);
  gap:24px; overflow-x:auto; scroll-snap-type:x mandatory;
  scroll-behavior:smooth; padding-bottom:16px;
  margin:0 -24px; padding-left:24px; padding-right:24px;
}
.popular-slider::-webkit-scrollbar { height:5px; }
.popular-slider::-webkit-scrollbar-track { background:rgba(255,255,255,.07); border-radius:3px; }
.popular-slider::-webkit-scrollbar-thumb { background:rgba(255,255,255,.25); border-radius:3px; }
.popular-card {
  scroll-snap-align:start; background:rgba(255,255,255,.05);
  border:1px solid rgba(255,255,255,.1); border-radius:var(--radius-lg);
  overflow:hidden; cursor:pointer; transition:all var(--duration-norm) var(--ease-out);
}
.popular-card:hover { background:rgba(255,255,255,.1); border-color:rgba(255,255,255,.2); transform:translateY(-4px); }
.popular-card__media { position:relative; aspect-ratio:16/10; overflow:hidden; }
.popular-card__media img { width:100%; height:100%; object-fit:cover; transition:transform var(--duration-slow); }
.popular-card:hover .popular-card__media img { transform:scale(1.05); }
.popular-card__badge {
  position:absolute; top:12px; right:12px; padding:5px 11px;
  background:rgba(0,0,0,.55); backdrop-filter:blur(8px);
  color:var(--white); font-size:11px; font-weight:700; border-radius:var(--radius-full);
}
.popular-card__hover {
  position:absolute; inset:0; background:rgba(0,0,0,.35);
  display:flex; align-items:center; justify-content:center;
  opacity:0; transition:opacity var(--duration-norm);
}
.popular-card:hover .popular-card__hover { opacity:1; }
.popular-card__action {
  width:52px; height:52px; border-radius:50%; background:var(--white);
  border:none; color:var(--grey-900); display:flex; align-items:center; justify-content:center;
  cursor:pointer; transform:scale(.8); transition:transform var(--duration-norm) var(--ease-spring);
}
.popular-card:hover .popular-card__action { transform:scale(1); }
.popular-card__action svg { width:22px; height:22px; }
.popular-card__body { padding:18px; }
.popular-card__title { font-size:16px; font-weight:700; color:var(--white); margin:0 0 7px; line-height:1.4; }
.popular-card__text { color:var(--grey-400); font-size:13px; line-height:1.6; margin:0 0 14px; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
.popular-card__cta { display:inline-flex; align-items:center; gap:6px; color:var(--white); font-weight:700; font-size:13px; }
.popular-card__cta svg { width:14px; height:14px; transition:transform var(--duration-norm); }
.popular-card:hover .popular-card__cta svg { transform:translateX(-4px); }

/* ════════════════════════════════════════
   PUBLICATIONS
   ════════════════════════════════════════ */
.pub-tabs { display:flex; flex-wrap:wrap; gap:8px; }
.pub-tab {
  display:flex; align-items:center; gap:7px; padding:9px 18px;
  background:rgba(255,255,255,.07); border:1px solid rgba(255,255,255,.12);
  border-radius:var(--radius-full); color:var(--grey-400);
  font-family:var(--font-sans); font-size:13px; font-weight:600;
  cursor:pointer; transition:all var(--duration-norm);
}
.pub-tab:hover { background:rgba(255,255,255,.12); color:var(--white); }
.pub-tab--on { background:var(--white) !important; color:var(--grey-900) !important; border-color:var(--white) !important; }
.pub-tab__ico { font-size:15px; }
.pub-tab__count {
  padding:1px 8px; background:rgba(255,255,255,.15);
  border-radius:var(--radius-full); font-size:10px;
}
.pub-tab--on .pub-tab__count { background:var(--grey-100); color:var(--grey-600); }

.pub-grid { display:grid; gap:20px; }
@media (min-width:640px)  { .pub-grid { grid-template-columns:repeat(2,1fr); } }
@media (min-width:1024px) { .pub-grid { grid-template-columns:repeat(4,1fr); } }

.pub-card {
  background:rgba(255,255,255,.05); border:1px solid rgba(255,255,255,.1);
  border-radius:var(--radius-lg); overflow:hidden; cursor:pointer;
  transition:all var(--duration-norm) var(--ease-out);
}
.pub-card:hover { background:rgba(255,255,255,.1); border-color:rgba(255,255,255,.2); transform:translateY(-6px); box-shadow:0 20px 40px rgba(0,0,0,.4); }
.pub-card__media { position:relative; aspect-ratio:3/2; overflow:hidden; }
.pub-card__media img { width:100%; height:100%; object-fit:cover; transition:transform var(--duration-slow); filter:brightness(.88); }
.pub-card:hover .pub-card__media img { transform:scale(1.06); filter:brightness(.75); }
.pub-card__type-badge {
  position:absolute; bottom:8px; right:8px; width:32px; height:32px;
  background:rgba(0,0,0,.6); backdrop-filter:blur(8px);
  border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:15px;
}
.pub-card__mem-badge {
  position:absolute; top:8px; right:8px;
  background:linear-gradient(135deg,#6C3483,#8C1515);
  border-radius:50%; width:26px; height:26px; display:flex; align-items:center; justify-content:center; font-size:12px;
}
.pub-card__play-overlay {
  position:absolute; inset:0; background:rgba(0,0,0,.25);
  display:flex; align-items:center; justify-content:center;
  opacity:0; transition:opacity var(--duration-norm);
}
.pub-card:hover .pub-card__play-overlay { opacity:1; }
.pub-play-btn {
  width:48px; height:48px; border-radius:50%; background:rgba(255,255,255,.9);
  color:var(--brand); font-size:18px; display:flex; align-items:center; justify-content:center;
  transform:scale(.8); transition:transform var(--duration-norm) var(--ease-spring);
  padding-right:3px;
}
.pub-card:hover .pub-play-btn { transform:scale(1); }
.pub-card__tracks,.pub-card__duration,.pub-card__pages {
  position:absolute; bottom:8px; left:8px;
  padding:4px 9px; background:rgba(0,0,0,.6); backdrop-filter:blur(6px);
  color:rgba(255,255,255,.9); font-size:11px; font-weight:600; border-radius:var(--radius-full);
}
.pub-card__media--gallery .pub-card__strip {
  position:absolute; bottom:0; left:0; right:0;
  display:flex; gap:2px; height:32px; overflow:hidden;
}
.pub-card__strip img { flex:1; object-fit:cover; filter:brightness(.7); }
.pub-card__img-count {
  position:absolute; top:8px; left:8px;
  padding:4px 9px; background:rgba(0,0,0,.55); backdrop-filter:blur(6px);
  color:#fff; font-size:11px; font-weight:700; border-radius:var(--radius-full);
}
.pub-card__body { padding:16px; }
.pub-card__meta { display:flex; align-items:center; gap:8px; margin-bottom:9px; }
.pub-card__badge-pill {
  padding:3px 10px; background:rgba(255,255,255,.15);
  color:var(--white); font-size:10px; font-weight:700; border-radius:var(--radius-full);
}
.pub-card__date { color:var(--grey-400); font-size:11px; }
.pub-card__title { font-size:15px; font-weight:700; color:var(--white); margin:0 0 7px; line-height:1.4; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
.pub-card__desc { color:var(--grey-400); font-size:12px; line-height:1.6; margin:0 0 10px; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
.pub-card__writer { color:rgba(255,255,255,.6); font-size:11px; margin-bottom:10px; }
.pub-card__tags { display:flex; flex-wrap:wrap; gap:5px; margin-bottom:12px; }
.ptag { padding:2px 8px; background:rgba(255,255,255,.08); color:var(--grey-300); font-size:10px; font-weight:600; border-radius:var(--radius-full); }
.pub-card__cta { display:inline-flex; align-items:center; gap:6px; color:rgba(255,255,255,.85); font-weight:700; font-size:12px; }
.pub-card__cta svg { width:13px; height:13px; transition:transform var(--duration-norm); }
.pub-card:hover .pub-card__cta svg { transform:translateX(-4px); }
.pub-empty { grid-column:1/-1; text-align:center; padding:60px 24px; color:var(--grey-500); }
.pub-empty span { font-size:40px; display:block; margin-bottom:12px; }
.pub-empty p { font-size:15px; }

/* ════════════════════════════════════════
   FILTER BAR
   ════════════════════════════════════════ */
.filter-bar { display:flex; flex-wrap:wrap; gap:10px; justify-content:center; margin-bottom:36px; }
.filter-chip {
  padding:9px 20px; background:var(--white); border:1px solid var(--grey-200);
  border-radius:var(--radius-full); font-family:var(--font-sans); font-size:13px;
  font-weight:600; color:var(--grey-600); cursor:pointer; transition:all var(--duration-norm);
}
.filter-chip:hover { border-color:var(--grey-300); color:var(--grey-900); }
.filter-chip.active { background:var(--brand); border-color:var(--brand); color:var(--white); }

/* ════════════════════════════════════════
   PROJECTS GRID
   ════════════════════════════════════════ */
.projects-grid { display:grid; gap:24px; }
@media (min-width:640px)  { .projects-grid { grid-template-columns:repeat(2,1fr); } }
@media (min-width:1024px) { .projects-grid { grid-template-columns:repeat(3,1fr); } }

.project-card {
  background:var(--white); border:1px solid var(--grey-200); border-radius:var(--radius-lg);
  overflow:hidden; cursor:pointer; transition:all var(--duration-norm) var(--ease-out);
}
.project-card:hover { transform:translateY(-6px); box-shadow:var(--shadow-xl); }
.project-card__media { position:relative; aspect-ratio:16/10; overflow:hidden; }
.project-card__media img { width:100%; height:100%; object-fit:cover; transition:transform var(--duration-slow); }
.project-card:hover .project-card__media img { transform:scale(1.05); }
.project-card__status { position:absolute; top:12px; right:12px; padding:5px 12px; border-radius:var(--radius-full); font-size:11px; font-weight:700; }
.status--active { background:rgba(16,185,129,.15); color:#059669; border:1px solid rgba(16,185,129,.3); }
.status--done   { background:rgba(59,130,246,.15);  color:#2563eb; border:1px solid rgba(59,130,246,.3); }
.project-card__hover-info {
  position:absolute; bottom:0; left:0; right:0; padding:14px;
  background:linear-gradient(transparent,rgba(0,0,0,.8));
  display:flex; justify-content:space-between; align-items:flex-end;
  opacity:0; transform:translateY(8px); transition:all var(--duration-norm);
}
.project-card:hover .project-card__hover-info { opacity:1; transform:translateY(0); }
.pcard-type { color:var(--white); font-size:11px; font-weight:600; }
.pcard-media { display:flex; align-items:center; gap:5px; color:var(--white); font-size:12px; }
.pcard-media svg { width:14px; height:14px; }
.project-card__body { padding:22px; }
.project-card__title { font-family:var(--font-display); font-size:19px; font-weight:700; margin:0 0 9px; color:var(--grey-900); line-height:1.3; }
.project-card__text { color:var(--grey-600); font-size:14px; line-height:1.6; margin:0 0 14px; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
.project-card__tags { display:flex; flex-wrap:wrap; gap:6px; margin-bottom:14px; }
.proj-tag { padding:3px 9px; background:var(--grey-100); color:var(--grey-600); font-size:11px; font-weight:600; border-radius:var(--radius-full); }
.project-card__cta { display:inline-flex; align-items:center; gap:7px; color:var(--brand); font-weight:700; font-size:13px; }
.project-card__cta svg { width:14px; height:14px; transition:transform var(--duration-norm); }
.project-card:hover .project-card__cta svg { transform:translateX(-4px); }

/* ════════════════════════════════════════
   MEMORIES
   ════════════════════════════════════════ */
.memories__bg-art { position:absolute; inset:0; overflow:hidden; pointer-events:none; }
.mem-orb {
  position:absolute; border-radius:50%;
  animation:mem-pulse 8s ease-in-out infinite;
}
.mem-orb--a { width:600px; height:600px; top:-100px; right:-100px; background:radial-gradient(circle,rgba(108,52,131,.18) 0%,transparent 70%); animation-delay:0s; }
.mem-orb--b { width:400px; height:400px; bottom:50px; left:-80px;  background:radial-gradient(circle,rgba(140,21,21,.12) 0%,transparent 70%); animation-delay:3s; }
.mem-orb--c { width:300px; height:300px; top:40%; left:40%; background:radial-gradient(circle,rgba(59,130,246,.06) 0%,transparent 70%); animation-delay:6s; }
@keyframes mem-pulse {
  0%,100% { transform:scale(1); opacity:.7; }
  50%      { transform:scale(1.15); opacity:1; }
}
.mem-grid-lines {
  position:absolute; inset:0;
  background-image:
    linear-gradient(rgba(255,255,255,.03) 1px,transparent 1px),
    linear-gradient(90deg,rgba(255,255,255,.03) 1px,transparent 1px);
  background-size:60px 60px;
}

.mem-filter { display:flex; justify-content:center; gap:8px; margin-bottom:36px; }
.mem-chip {
  padding:9px 20px; background:rgba(255,255,255,.08);
  border:1px solid rgba(255,255,255,.15); border-radius:var(--radius-full);
  color:rgba(255,255,255,.7); font-family:var(--font-sans); font-size:13px;
  font-weight:600; cursor:pointer; transition:all var(--duration-norm);
}
.mem-chip:hover { background:rgba(255,255,255,.14); color:var(--white); }
.mem-chip--on { background:linear-gradient(135deg,rgba(108,52,131,.7),rgba(140,21,21,.7)) !important; color:var(--white) !important; border-color:transparent !important; box-shadow:0 4px 20px rgba(108,52,131,.3); }

.memories-grid { display:grid; gap:20px; }
@media (min-width:640px)  { .memories-grid { grid-template-columns:repeat(2,1fr); } }
@media (min-width:1024px) { .memories-grid { grid-template-columns:repeat(3,1fr); } }

.memory-card {
  border-radius:var(--radius-xl); overflow:hidden; cursor:pointer;
  transition:all var(--duration-norm) var(--ease-out);
}
.memory-card:hover { transform:translateY(-7px) scale(1.02); box-shadow:0 28px 64px rgba(0,0,0,.55); }
.memory-card__media { position:relative; aspect-ratio:4/3; overflow:hidden; }
.memory-card__media img { width:100%; height:100%; object-fit:cover; transition:transform var(--duration-slow); filter:brightness(.78) saturate(.85); }
.memory-card:hover .memory-card__media img { transform:scale(1.08); filter:brightness(.65); }
.memory-card__film {
  position:absolute; inset:0;
  background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,.06) 2px,rgba(0,0,0,.06) 4px);
  pointer-events:none;
}
.memory-card__vignette {
  position:absolute; inset:0;
  background:linear-gradient(to bottom,rgba(0,0,0,.12) 0%,transparent 35%,rgba(0,0,0,.82) 100%);
}
.mem-top-row { position:absolute; top:12px; left:12px; right:12px; display:flex; justify-content:space-between; align-items:center; }
.mem-type-pill {
  padding:4px 10px; background:rgba(0,0,0,.5); backdrop-filter:blur(8px);
  color:var(--white); font-size:11px; font-weight:700; border-radius:var(--radius-full);
}
.mem-badge-💫 {
  width:28px; height:28px; background:linear-gradient(135deg,#6C3483,#8C1515);
  border-radius:50%; display:flex; align-items:center; justify-content:center;
  font-size:12px; box-shadow:0 3px 12px rgba(108,52,131,.6);
}
.mem-wave {
  position:absolute; top:50%; left:50%; transform:translate(-50%,-50%);
  display:flex; gap:4px; align-items:center; opacity:0;
  transition:opacity var(--duration-norm);
}
.memory-card:hover .mem-wave { opacity:.6; }
.mem-bar {
  width:4px; height:16px; background:var(--white); border-radius:2px;
  animation:mem-wave-bar calc(.3s * var(--b, 1)) ease-in-out infinite alternate;
}
@keyframes mem-wave-bar { from{height:6px} to{height:24px} }
.memory-card__footer { position:absolute; bottom:0; left:0; right:0; padding:20px 16px 16px; }
.memory-card__title { font-family:var(--font-display); font-size:17px; font-weight:800; color:var(--white); margin:0 0 5px; line-height:1.3; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
.memory-card__sub { font-size:12px; color:rgba(255,255,255,.72); margin:0 0 10px; display:-webkit-box; -webkit-line-clamp:1; -webkit-box-orient:vertical; overflow:hidden; }
.memory-card__pills { display:flex; flex-wrap:wrap; gap:6px; }
.memory-card__pills span { font-size:11px; color:rgba(255,255,255,.65); background:rgba(255,255,255,.12); padding:3px 8px; border-radius:var(--radius-full); }

/* ════════════════════════════════════════
   EVENTS
   ════════════════════════════════════════ */
.events-grid { display:grid; gap:16px; }
@media (min-width:768px) { .events-grid { grid-template-columns:repeat(2,1fr); } }
.event-card {
  display:grid; grid-template-columns:80px 1fr 48px; gap:20px;
  align-items:center; padding:22px 20px;
  background:var(--white); border:1px solid var(--grey-200);
  border-radius:var(--radius-lg); transition:all var(--duration-norm) var(--ease-out);
}
.event-card:hover { transform:translateY(-2px); box-shadow:var(--shadow-lg); border-color:var(--grey-300); }
.event-card__date {
  text-align:center;
  background:linear-gradient(135deg,var(--brand) 0%,var(--brand-light) 100%);
  color:var(--white); padding:14px 10px; border-radius:var(--radius-md);
}
.event-card__day   { display:block; font-size:28px; font-weight:900; line-height:1; margin-bottom:3px; }
.event-card__month { font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:.06em; opacity:.9; }
.event-card__content { min-width:0; }
.event-card__type  { display:block; font-size:10px; font-weight:700; color:var(--brand); text-transform:uppercase; letter-spacing:.08em; margin-bottom:6px; }
.event-card__title { font-size:16px; font-weight:700; margin:0 0 8px; color:var(--grey-900); }
.event-card__meta  { display:flex; flex-wrap:wrap; gap:12px; color:var(--grey-500); font-size:12px; }
.event-card__meta span { display:flex; align-items:center; gap:5px; }
.event-card__meta svg { width:13px; height:13px; opacity:.7; }
.event-card__arrow {
  width:44px; height:44px; border-radius:50%;
  background:var(--grey-100); border:none;
  color:var(--grey-500); display:flex; align-items:center; justify-content:center;
  cursor:pointer; transition:all var(--duration-norm);
}
.event-card:hover .event-card__arrow { background:var(--brand); color:var(--white); }
.event-card__arrow svg { width:18px; height:18px; }

/* ════════════════════════════════════════
   SERVICES
   ════════════════════════════════════════ */
.services-grid { display:grid; gap:24px; }
@media (min-width:768px) { .services-grid { grid-template-columns:repeat(3,1fr); } }
.service-card {
  background:var(--white); border:1px solid var(--grey-200);
  border-radius:var(--radius-lg); overflow:hidden;
  transition:all var(--duration-norm) var(--ease-out);
}
.service-card:hover { transform:translateY(-4px); box-shadow:var(--shadow-xl); }
.service-card__media { position:relative; aspect-ratio:16/10; overflow:hidden; }
.service-card__media--gradient {
  display:flex; align-items:center; justify-content:center;
  background: linear-gradient(135deg, #1a0505 0%, var(--brand) 50%, #2d0a0a 100%);
  transition:filter var(--duration-slow);
}
.service-card:hover .service-card__media--gradient { filter:brightness(1.15); }
.service-card__icon-large {
  font-size:56px; line-height:1;
  filter:drop-shadow(0 4px 16px rgba(0,0,0,.4));
  transition:transform var(--duration-slow);
}
.service-card:hover .service-card__icon-large { transform:scale(1.12) translateY(-4px); }
.service-card__ico-badge {
  position:absolute; bottom:-22px; right:20px; width:44px; height:44px;
  background:linear-gradient(135deg,var(--brand) 0%,var(--brand-light) 100%);
  border-radius:var(--radius-md); display:flex; align-items:center; justify-content:center;
  font-size:22px; box-shadow:var(--shadow-lg);
}
.service-card__body { padding:32px 22px 22px; }
.service-card__status { display:inline-flex; padding:4px 10px; border-radius:var(--radius-full); font-size:10px; font-weight:700; margin-bottom:11px; }
.svc--active    { background:rgba(16,185,129,.12); color:#059669; }
.svc--inactive  { background:var(--grey-100); color:var(--grey-500); }
.service-card__title { font-family:var(--font-display); font-size:19px; font-weight:700; margin:0 0 9px; color:var(--grey-900); }
.service-card__text  { color:var(--grey-600); font-size:14px; line-height:1.6; margin:0 0 14px; }
.service-card__cta   { display:inline-flex; align-items:center; gap:7px; color:var(--brand); font-weight:700; font-size:13px; }
.service-card__cta svg { width:14px; height:14px; transition:transform var(--duration-norm); }
.service-card:hover .service-card__cta svg { transform:translateX(-4px); }

/* ════════════════════════════════════════
   DONATE FAB
   ════════════════════════════════════════ */
.donate-fab {
  position:fixed; bottom:24px; left:24px;
  height:56px; padding:0 20px 0 16px;
  border-radius:var(--radius-full);
  background:linear-gradient(135deg,var(--brand) 0%,var(--brand-light) 100%);
  border:none; color:var(--white); cursor:pointer;
  display:flex; align-items:center; gap:10px; z-index:100;
  transition:all var(--duration-norm) var(--ease-out);
  box-shadow:0 4px 20px var(--brand-glow);
}
.home--ltr .donate-fab { left:auto; right:24px; }
.donate-fab:hover { transform:scale(1.06); box-shadow:0 8px 32px var(--brand-glow); }
.donate-fab svg { width:22px; height:22px; }
.donate-fab__label { font-family:var(--font-sans); font-size:14px; font-weight:700; }
.donate-fab__pulse { position:absolute; inset:0; border-radius:var(--radius-full); background:var(--brand); animation:fab-pulse 2s infinite; z-index:-1; }
@keyframes fab-pulse { 0%{transform:scale(1);opacity:.5} 100%{transform:scale(1.6);opacity:0} }

/* ════════════════════════════════════════
   NEWS DETAIL MODAL
   ════════════════════════════════════════ */
.modal-backdrop {
  position:fixed; inset:0; background:rgba(0,0,0,.88); z-index:1000;
  display:flex; align-items:center; justify-content:center; padding:20px;
}
.modal {
  background:var(--white); border-radius:var(--radius-xl);
  max-width:780px; width:100%; max-height:90vh; overflow-y:auto;
  position:relative; box-shadow:var(--shadow-2xl);
  transition:transform var(--duration-norm) var(--ease-out);
}
.modal::-webkit-scrollbar { width:5px; }
.modal::-webkit-scrollbar-thumb { background:var(--grey-200); border-radius:3px; }
.modal__close {
  position:absolute; top:14px; right:14px; z-index:10;
  width:40px; height:40px; border-radius:50%;
  background:rgba(255,255,255,.9); border:1px solid var(--grey-200);
  color:var(--grey-700); cursor:pointer; display:flex; align-items:center; justify-content:center;
  transition:all var(--duration-norm); backdrop-filter:blur(8px);
}
.modal__close:hover { background:var(--brand); color:var(--white); border-color:var(--brand); }
.modal__close svg { width:18px; height:18px; }
.modal__hero { position:relative; aspect-ratio:16/7; overflow:hidden; border-radius:var(--radius-xl) var(--radius-xl) 0 0; }
.modal__hero img { width:100%; height:100%; object-fit:cover; }
.modal__hero-grad { position:absolute; inset:0; background:linear-gradient(to bottom,rgba(0,0,0,.12) 0%,rgba(0,0,0,.72) 100%); }
.modal__hero-info { position:absolute; bottom:0; left:0; right:0; padding:28px; }
.modal__hero-badges { display:flex; flex-wrap:wrap; gap:6px; margin-bottom:12px; }
.modal__title { font-family:var(--font-display); font-size:clamp(19px,3vw,27px); font-weight:900; color:var(--white); margin:0 0 10px; line-height:1.25; }
.modal__hero-meta { display:flex; gap:16px; flex-wrap:wrap; color:rgba(255,255,255,.72); font-size:13px; }
.modal__body { padding:28px; }
.modal__desc { font-size:16px; line-height:1.8; color:var(--grey-700); margin:0 0 24px; }
.modal__bilingual { margin-bottom:24px; }
.modal__lang-block { background:var(--grey-50); border-radius:var(--radius-md); padding:16px 20px; border-right:3px solid var(--brand); }
.modal__lang-tag { display:inline-flex; padding:3px 10px; background:var(--brand); color:var(--white); font-size:11px; font-weight:700; border-radius:var(--radius-full); margin-bottom:8px; }
.modal__lang-block p { color:var(--grey-700); line-height:1.8; margin:0; font-size:15px; }
.modal__chips-row { margin-bottom:20px; }
.modal__chips-label { font-size:12px; font-weight:700; color:var(--grey-500); text-transform:uppercase; letter-spacing:.07em; margin:0 0 10px; }
.chips-flex { display:flex; flex-wrap:wrap; gap:8px; }
.chip { padding:5px 13px; border-radius:var(--radius-full); font-size:13px; font-weight:600; }
.chip--tag { background:rgba(140,21,21,.1); color:var(--brand); }
.chip--kw  { background:var(--grey-100); color:var(--grey-700); }
.modal__media-section { margin-top:10px; }
.modal__media-grid { display:grid; gap:14px; margin-top:10px; }
@media (min-width:600px) { .modal__media-grid { grid-template-columns:repeat(2,1fr); } }
.mmedia--image { position:relative; cursor:zoom-in; border-radius:var(--radius-md); overflow:hidden; }
.mmedia--image img { width:100%; aspect-ratio:16/9; object-fit:cover; display:block; }
.mmedia__zoom {
  position:absolute; inset:0; background:rgba(0,0,0,.3);
  display:flex; align-items:center; justify-content:center;
  opacity:0; transition:opacity var(--duration-norm);
}
.mmedia--image:hover .mmedia__zoom { opacity:1; }
.mmedia__zoom svg { width:32px; height:32px; color:var(--white); }
.mmedia--video,.mmedia--audio { background:var(--grey-900); border-radius:var(--radius-md); overflow:hidden; }
.mmedia__iframe { width:100%; aspect-ratio:16/9; border:none; display:block; }
.mmedia__video  { width:100%; aspect-ratio:16/9; display:block; }
.mmedia--audio  { display:flex; align-items:center; gap:12px; padding:16px; }
.mmedia__audio-ico { font-size:22px; }
.mmedia__audio-el  { flex:1; accent-color:var(--brand); }
.mmedia__ext-btn {
  display:inline-flex; align-items:center; gap:8px;
  padding:10px 18px; background:var(--brand); color:var(--white);
  border-radius:var(--radius-full); font-weight:700; font-size:14px;
  text-decoration:none; margin:14px;
  transition:background var(--duration-norm);
}
.mmedia__ext-btn:hover { background:var(--brand-light); }
.mmedia--doc {
  display:flex; align-items:center; gap:12px; padding:16px;
  background:var(--grey-50); border:1px solid var(--grey-200);
  border-radius:var(--radius-md); text-decoration:none; color:var(--grey-700);
  font-weight:600; transition:all var(--duration-norm);
}
.mmedia--doc:hover { border-color:var(--brand); color:var(--brand); }
.mmedia__doc-ico { font-size:24px; }

/* ════════════════════════════════════════
   LIGHTBOX
   ════════════════════════════════════════ */
.lightbox {
  position:fixed; inset:0; background:rgba(0,0,0,.95); z-index:1100;
  display:flex; align-items:center; justify-content:center; padding:40px;
}
.lightbox__close {
  position:absolute; top:16px; right:16px;
  width:44px; height:44px; border-radius:50%;
  background:rgba(255,255,255,.12); border:1px solid rgba(255,255,255,.2);
  color:var(--white); cursor:pointer; display:flex; align-items:center; justify-content:center;
  transition:background var(--duration-norm);
}
.lightbox__close:hover { background:var(--brand); }
.lightbox__close svg { width:20px; height:20px; }
.lightbox__frame { max-width:90vw; max-height:85vh; }
.lightbox__img { max-width:100%; max-height:85vh; object-fit:contain; border-radius:var(--radius-lg); display:block; }

/* ════════════════════════════════════════
   SKELETON LOADERS
   ════════════════════════════════════════ */
.skel { border-radius:var(--radius-lg); overflow:hidden; background:var(--white); border:1px solid var(--grey-100); animation:sk-in var(--duration-norm) var(--ease-out) var(--d,0s) both; }
.skel--dark { background:rgba(255,255,255,.05); border-color:rgba(255,255,255,.08); }
@keyframes sk-in { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:none} }
.skel__thumb { aspect-ratio:16/9; }
.skel__body  { padding:18px; display:flex; flex-direction:column; gap:10px; }
.skel__line  { height:13px; border-radius:var(--radius-sm); }
.shimmer {
  background:linear-gradient(90deg,var(--grey-100) 25%,var(--grey-200) 50%,var(--grey-100) 75%);
  background-size:400% 100%; animation:shimmer 1.4s infinite;
}
.shimmer--dark {
  background:linear-gradient(90deg,rgba(255,255,255,.06) 25%,rgba(255,255,255,.12) 50%,rgba(255,255,255,.06) 75%);
  background-size:400% 100%; animation:shimmer 1.4s infinite;
}
@keyframes shimmer { 0%{background-position:100% 0} 100%{background-position:-100% 0} }

/* ════════════════════════════════════════
   EMPTY STATE
   ════════════════════════════════════════ */
.empty { text-align:center; padding:64px 24px; }
.empty__icon  { font-size:48px; margin-bottom:14px; }
.empty__title { font-size:20px; font-weight:700; color:var(--grey-700); margin:0 0 16px; }

/* ════════════════════════════════════════
   RTL / LTR DIRECTION FIXES
   ════════════════════════════════════════ */
.home--ltr .btn:hover svg,
.home--ltr .btn:hover .btn__icon,
.home--ltr .news-card__cta svg,
.home--ltr .popular-card__cta svg,
.home--ltr .pub-card__cta svg,
.home--ltr .project-card__cta svg,
.home--ltr .service-card__cta svg { transform:translateX(4px); }
.home--ltr .about__img-border  { inset:12px 12px -12px -12px; }
.home--ltr .about__year-badge  { right:auto; left:0; }
.home--ltr .about__float-card  { right:auto; left:0; }
.home--ltr .about__body        { border-right:none; }
.home--ltr .modal__lang-block  { border-right:none; border-left:3px solid var(--brand); }
.home--ltr .hero__corner--tl   { right:auto; left:40px; border-width:2px 2px 0 0; }
.home--ltr .hero__corner--tr   { left:auto; right:40px; border-width:2px 0 0 2px; }
.home--ltr .hero__corner--bl   { right:auto; left:40px; border-width:0 2px 2px 0; }
.home--ltr .hero__corner--br   { left:auto; right:40px; border-width:0 0 2px 2px; }

/* ════════════════════════════════════════
   RESPONSIVE
   ════════════════════════════════════════ */
@media (max-width:640px) {
  .hero__stats   { gap:8px; }
  .hstat__inner  { padding:0 16px; }
  .hstat__sep    { height:28px; }
  .hstat__value  { font-size:26px; }
  .about__pillars { grid-template-columns:1fr 1fr; gap:10px; }
  .about__float-card { display:none; }
  .news-card--featured { grid-template-columns:1fr; }
  .event-card { grid-template-columns:68px 1fr 40px; gap:14px; padding:16px 14px; }
  .pub-tabs { flex-wrap:wrap; gap:6px; }
  .mem-filter { flex-wrap:wrap; }
  .modal { max-height:95vh; }
  .donate-fab__label { display:none; }
  .donate-fab { width:52px; height:52px; padding:0; justify-content:center; border-radius:50%; }
}
@media (max-width:400px) {
  .hstat__inner { padding:0 10px; }
  .hero__actions { flex-direction:column; align-items:center; }
}
@media (prefers-reduced-motion:reduce) {
  *,*::before,*::after {
    animation-duration:.01ms !important;
    animation-iteration-count:1 !important;
    transition-duration:.01ms !important;
  }
}
</style>