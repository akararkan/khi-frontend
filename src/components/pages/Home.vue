<template>
  <main id="main-content" class="home">
    <!-- ═══════════════════════════════════════════════════════════
         HERO SECTION - Stanford Style with Parallax
         ═══════════════════════════════════════════════════════════ -->
    <section class="hero" aria-label="Hero">
      <div class="hero__bg" ref="heroBgRef" :style="{ backgroundImage: `url(${hero.image})` }" />
      <div class="hero__overlay" />
      <div class="hero__particles">
        <span v-for="i in 20" :key="i" class="particle" :style="getParticleStyle(i)"></span>
      </div>

      <div class="container hero__content" data-animate="fade-up">
        <p class="hero__kicker">
          <span class="kicker__line"></span>
          {{ hero.kicker }}
          <span class="kicker__line"></span>
        </p>
        <h1 class="hero__title">{{ hero.title }}</h1>
        <p class="hero__sub">{{ hero.sub }}</p>

        <div class="hero__actions">
          <button class="btn btn--primary btn--glow" @click="scrollTo('#spotlight')">
            <span>{{ hero.primaryCta }}</span>
            <svg class="btn__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M7 17L17 7M17 7H7M17 7V17"/>
            </svg>
          </button>
          <button class="btn btn--glass" @click="scrollTo('#popular')">
            <span>{{ hero.secondaryCta }}</span>
          </button>
        </div>

        <div class="hero__stats">
          <div v-for="(stat, idx) in stats" :key="idx" class="stat" data-animate="fade-up" :data-delay="idx * 100">
            <span class="stat__value">{{ stat.value }}</span>
            <span class="stat__label">{{ stat.label }}</span>
          </div>
        </div>
      </div>

      <!-- Scroll Indicator -->
      <button class="scroll-indicator" @click="scrollTo('#spotlight')" aria-label="Scroll down">
        <span class="scroll-indicator__mouse">
          <span class="scroll-indicator__wheel"></span>
        </span>
        <span class="scroll-indicator__text">گەڕان بۆ خوارەوە</span>
      </button>
    </section>

    <!-- ═══════════════════════════════════════════════════════════
         SPOTLIGHT / NEWS SECTION
         ═══════════════════════════════════════════════════════════ -->
    <section id="spotlight" class="section">
      <div class="container">
        <header class="section__header" data-animate="fade-up">
          <div class="section__badge">هەواڵەکان</div>
          <h2 class="section__title">لە ناوەندی ڕووناکی</h2>
          <p class="section__desc">هەواڵ و دیاریترین بابەتەکان</p>
        </header>

        <div class="news-grid">
          <!-- Featured News (Large) -->
          <article 
            class="news-card news-card--featured" 
            data-animate="fade-up"
            @click="openNewsModal(news[0])"
          >
            <div class="news-card__media">
              <img :src="news[0].image" :alt="news[0].title" loading="lazy" />
              <div class="news-card__overlay">
                <span class="news-card__play">
                  <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                </span>
              </div>
            </div>
            <div class="news-card__content">
              <span class="news-card__badge">{{ news[0].category }}</span>
              <h3 class="news-card__title">{{ news[0].title }}</h3>
              <p class="news-card__excerpt">{{ news[0].summary }}</p>
              <div class="news-card__meta">
                <time>{{ news[0].date }}</time>
                <span class="meta-dot"></span>
                <span>{{ news[0].readTime }}</span>
              </div>
              <span class="news-card__link">
                زیاتر بخوێنەوە
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </span>
            </div>
          </article>

          <!-- Secondary News -->
          <div class="news-secondary">
            <article 
              v-for="(item, idx) in news.slice(1)" 
              :key="item.slug"
              class="news-card news-card--small"
              data-animate="fade-up"
              :data-delay="(idx + 1) * 100"
              @click="openNewsModal(item)"
            >
              <div class="news-card__media">
                <img :src="item.image" :alt="item.title" loading="lazy" />
              </div>
              <div class="news-card__content">
                <span class="news-card__badge news-card__badge--sm">{{ item.category }}</span>
                <h3 class="news-card__title news-card__title--sm">{{ item.title }}</h3>
                <div class="news-card__meta">
                  <time>{{ item.date }}</time>
                  <span class="meta-dot"></span>
                  <span>{{ item.readTime }}</span>
                </div>
              </div>
            </article>
          </div>
        </div>

        <div class="section__footer" data-animate="fade-up">
          <button class="btn btn--outline" @click="go('/news')">
            هەموو هەواڵەکان
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════
         POPULAR / TRENDING SECTION with Slider
         ═══════════════════════════════════════════════════════════ -->
    <section id="popular" class="section section--dark">
      <div class="container">
        <header class="section__header section__header--row" data-animate="fade-up">
          <div>
            <div class="section__badge section__badge--light">دڵخواز</div>
            <h2 class="section__title section__title--light">پەسەندکراوەکان</h2>
            <p class="section__desc section__desc--light">زۆرترین سەردان و دڵخوازی بەکارهێنەران</p>
          </div>
          <div class="slider-nav">
            <button class="slider-btn slider-btn--prev" @click="prevPopular" aria-label="Previous">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </button>
            <div class="slider-dots">
              <span 
                v-for="(_, idx) in Math.ceil(popularItems.length / 3)" 
                :key="idx"
                class="slider-dot"
                :class="{ active: currentSlide === idx }"
                @click="goToSlide(idx)"
              ></span>
            </div>
            <button class="slider-btn slider-btn--next" @click="nextPopular" aria-label="Next">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
        </header>

        <div class="popular-slider" ref="popularSliderRef">
          <article
            v-for="(item, idx) in popularItems"
            :key="item.key"
            class="popular-card"
            data-animate="fade-up"
            :data-delay="idx * 80"
          >
            <div class="popular-card__media">
              <img :src="item.image" :alt="item.title" loading="lazy" />
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
              <p class="popular-card__text">{{ item.summary }}</p>
              <span class="popular-card__link">
                کردنەوە
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </span>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════
         MEDIA GALLERY SECTION - Featured Display with List Below
         ═══════════════════════════════════════════════════════════ -->
    <section id="media" class="section">
      <div class="container">
        <header class="section__header" data-animate="fade-up">
          <div class="section__badge">میدیا</div>
          <h2 class="section__title">گالەری میدیا</h2>
          <p class="section__desc">ڤیدیۆ، دەنگ، و وێنەکان</p>
        </header>

        <!-- Media Type Tabs -->
        <div class="media-tabs" data-animate="fade-up">
          <button 
            v-for="tab in mediaTabs" 
            :key="tab.id"
            class="media-tab"
            :class="{ active: activeMediaTab === tab.id }"
            @click="switchMediaTab(tab.id)"
          >
            <component :is="tab.icon" class="media-tab__icon" />
            <span>{{ tab.label }}</span>
          </button>
        </div>

        <!-- Featured Media Display -->
        <div class="media-showcase" data-animate="fade-up">
          <Transition name="media-fade" mode="out-in">
            <div class="media-featured" :key="selectedMedia.id">
              <!-- Video Player -->
              <template v-if="activeMediaTab === 'video'">
                <div class="video-player">
                  <video 
                    ref="videoRef"
                    class="video-player__video"
                    :poster="selectedMedia.poster"
                    @click="toggleVideo"
                  >
                    <source :src="selectedMedia.src" type="video/mp4" />
                  </video>
                  <div class="video-player__controls" :class="{ hidden: isPlaying }">
                    <button class="video-player__play" @click="toggleVideo">
                      <svg v-if="!isPlaying" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="5 3 19 12 5 21 5 3"/>
                      </svg>
                      <svg v-else viewBox="0 0 24 24" fill="currentColor">
                        <rect x="6" y="4" width="4" height="16"/>
                        <rect x="14" y="4" width="4" height="16"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </template>

              <!-- Audio Player -->
              <template v-else-if="activeMediaTab === 'audio'">
                <div class="audio-player">
                  <div class="audio-player__artwork">
                    <img :src="selectedMedia.cover" :alt="selectedMedia.title" />
                    <div class="audio-player__visualizer" :class="{ playing: isAudioPlaying }">
                      <span v-for="i in 5" :key="i" class="bar"></span>
                    </div>
                  </div>
                  <div class="audio-player__info">
                    <h3 class="audio-player__title">{{ selectedMedia.title }}</h3>
                    <p class="audio-player__caption">{{ selectedMedia.caption }}</p>
                    <div class="audio-player__waveform">
                      <div class="waveform-progress" :style="{ width: audioProgress + '%' }"></div>
                    </div>
                    <audio 
                      ref="audioRef" 
                      @timeupdate="updateAudioProgress"
                      @play="isAudioPlaying = true"
                      @pause="isAudioPlaying = false"
                    >
                      <source :src="selectedMedia.src" type="audio/mpeg" />
                    </audio>
                    <div class="audio-player__actions">
                      <button class="audio-btn" @click="toggleAudio">
                        <svg v-if="!isAudioPlaying" viewBox="0 0 24 24" fill="currentColor">
                          <polygon points="5 3 19 12 5 21 5 3"/>
                        </svg>
                        <svg v-else viewBox="0 0 24 24" fill="currentColor">
                          <rect x="6" y="4" width="4" height="16"/>
                          <rect x="14" y="4" width="4" height="16"/>
                        </svg>
                      </button>
                      <span class="audio-time">{{ formatTime(audioCurrentTime) }} / {{ formatTime(audioDuration) }}</span>
                    </div>
                  </div>
                </div>
              </template>

              <!-- Image Display -->
              <template v-else>
                <div class="image-display">
                  <img 
                    :src="selectedMedia.src" 
                    :alt="selectedMedia.title" 
                    @click="openLightbox(selectedMedia)"
                  />
                  <div class="image-display__overlay">
                    <button class="image-display__zoom" @click="openLightbox(selectedMedia)">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8"/>
                        <path d="m21 21-4.35-4.35M11 8v6M8 11h6"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </template>

              <!-- Media Info -->
              <div class="media-info">
                <h3 class="media-info__title">{{ selectedMedia.title }}</h3>
                <p class="media-info__caption">{{ selectedMedia.caption }}</p>
              </div>
            </div>
          </Transition>

          <!-- Media Thumbnails List -->
          <div class="media-list">
            <h4 class="media-list__title">
              <span>{{ getMediaListTitle }}</span>
              <span class="media-list__count">{{ currentMediaList.length }}</span>
            </h4>
            <div class="media-list__items">
              <button
                v-for="(item, idx) in currentMediaList"
                :key="item.id"
                class="media-thumb"
                :class="{ active: selectedMedia.id === item.id }"
                @click="selectMedia(item)"
              >
                <div class="media-thumb__image">
                  <img :src="item.thumbnail || item.cover || item.poster || item.src" :alt="item.title" />
                  <span class="media-thumb__number">{{ idx + 1 }}</span>
                </div>
                <div class="media-thumb__info">
                  <span class="media-thumb__title">{{ item.title }}</span>
                  <span class="media-thumb__duration" v-if="item.duration">{{ item.duration }}</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════
         EVENTS SECTION
         ═══════════════════════════════════════════════════════════ -->
    <section class="section section--alt">
      <div class="container">
        <header class="section__header section__header--row" data-animate="fade-up">
          <div>
            <div class="section__badge">چالاکییەکان</div>
            <h2 class="section__title">چالاکییەکانی داهاتوو</h2>
            <p class="section__desc">سمینار، وۆرکشۆپ، کۆنفرانس</p>
          </div>
          <button class="btn btn--outline" @click="go('/events')">
            هەموو چالاکییەکان
          </button>
        </header>

        <div class="events-grid">
          <article 
            v-for="(event, idx) in events" 
            :key="event.id"
            class="event-card"
            data-animate="fade-up"
            :data-delay="idx * 100"
          >
            <div class="event-card__date">
              <span class="event-card__day">{{ event.day }}</span>
              <span class="event-card__month">{{ event.month }}</span>
            </div>
            <div class="event-card__content">
              <h3 class="event-card__title">{{ event.title }}</h3>
              <div class="event-card__meta">
                <span class="event-card__time">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                  {{ event.time }}
                </span>
                <span class="event-card__place">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  {{ event.place }}
                </span>
              </div>
            </div>
            <button class="event-card__action">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </article>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════
         PROJECTS SECTION
         ═══════════════════════════════════════════════════════════ -->
    <section id="projects" class="section">
      <div class="container">
        <header class="section__header" data-animate="fade-up">
          <div class="section__badge">پڕۆژەکان</div>
          <h2 class="section__title">پڕۆژەکانمان</h2>
          <p class="section__desc">دەنگ، نووسین، وێنە، ڤیدیۆ — لەگەڵ بەردەوام/تەواوکراو</p>
        </header>

        <!-- Filter Chips -->
        <div class="filter-bar" data-animate="fade-up">
          <button 
            v-for="filter in projectFilters"
            :key="filter.value"
            class="filter-chip"
            :class="{ active: projectFilter === filter.value }"
            @click="projectFilter = filter.value"
          >
            {{ filter.label }}
          </button>
        </div>

        <!-- Projects Grid -->
        <TransitionGroup name="grid-fade" tag="div" class="projects-grid">
          <article 
            v-for="(project, idx) in filteredProjects" 
            :key="project.slug"
            class="project-card"
            data-animate="fade-up"
            :data-delay="idx * 80"
          >
            <div class="project-card__media">
              <img :src="project.cover.url" :alt="project.title" loading="lazy" />
              <div class="project-card__status" :class="project.status">
                {{ project.status === 'ongoing' ? 'بەردەوام' : 'تەواوکراو' }}
              </div>
              <div class="project-card__hover">
                <span class="project-card__category">{{ project.category }}</span>
                <span class="project-card__media-count">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                  {{ project.mediaCount }}
                </span>
              </div>
            </div>
            <div class="project-card__body">
              <h3 class="project-card__title">{{ project.title }}</h3>
              <p class="project-card__text">{{ project.summary }}</p>
              <div class="project-card__tags">
                <span 
                  v-for="tag in project.tags.slice(0, 3)" 
                  :key="tag"
                  class="project-tag"
                >
                  #{{ tag }}
                </span>
              </div>
              <span class="project-card__link">
                پڕۆژە ببینە
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </span>
            </div>
          </article>
        </TransitionGroup>

        <div class="section__footer" data-animate="fade-up">
          <button class="btn btn--primary" @click="go('/projects')">
            هەموو پڕۆژەکان
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════
         PUBLICATIONS SECTION
         ═══════════════════════════════════════════════════════════ -->
    <section class="section section--dark">
      <div class="container">
        <header class="section__header" data-animate="fade-up">
          <div class="section__badge section__badge--light">بڵاوکراوەکان</div>
          <h2 class="section__title section__title--light">بڵاوکراوەکانمان</h2>
          <p class="section__desc section__desc--light">نووسین، دەنگ، وێنە، ڤیدیۆ، فیلم</p>
        </header>

        <!-- Publication Type Filter -->
        <div class="filter-bar filter-bar--dark" data-animate="fade-up">
          <button 
            v-for="filter in pubFilters"
            :key="filter.value"
            class="filter-chip filter-chip--dark"
            :class="{ active: pubFilter === filter.value }"
            @click="pubFilter = filter.value"
          >
            {{ filter.label }}
          </button>
        </div>

        <!-- Publications List -->
        <div class="publications-list">
          <TransitionGroup name="list-fade">
            <article 
              v-for="(pub, idx) in filteredPubs" 
              :key="pub.slug"
              class="pub-card"
              data-animate="fade-up"
              :data-delay="idx * 100"
            >
              <div class="pub-card__media">
                <img :src="pub.cover.url" :alt="pub.title" loading="lazy" />
                <div class="pub-card__type">
                  <component :is="getTypeIcon(pub.pub_type)" />
                </div>
              </div>
              <div class="pub-card__body">
                <div class="pub-card__meta">
                  <span class="pub-card__badge">{{ typeLabel(pub.pub_type) }}</span>
                  <time class="pub-card__date">{{ pub.published_at }}</time>
                </div>
                <h3 class="pub-card__title">{{ pub.title }}</h3>
                <p class="pub-card__text">{{ pub.summary }}</p>
                <span class="pub-card__link">
                  بینینی زیاتر
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </span>
              </div>
            </article>
          </TransitionGroup>
        </div>

        <div class="section__footer" data-animate="fade-up">
          <button class="btn btn--glass" @click="go('/publishments')">
            هەموو بڵاوکراوەکان
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════
         SERVICES SECTION
         ═══════════════════════════════════════════════════════════ -->
    <section class="section">
      <div class="container">
        <header class="section__header" data-animate="fade-up">
          <div class="section__badge">خزمەتگوزارییەکان</div>
          <h2 class="section__title">خزمەتگوزارییەکانمان</h2>
          <p class="section__desc">هۆڵی چالاکی، چاپخانە، ستۆدیۆ، فرۆش، کتێبخانە</p>
        </header>

        <div class="services-grid">
          <article 
            v-for="(service, idx) in services" 
            :key="service.slug"
            class="service-card"
            data-animate="fade-up"
            :data-delay="idx * 100"
          >
            <div class="service-card__media">
              <img :src="service.cover.url" :alt="service.name" loading="lazy" />
              <div class="service-card__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
                </svg>
              </div>
            </div>
            <div class="service-card__body">
              <div class="service-card__status" :class="{ active: service.is_active }">
                {{ service.is_active ? 'چالاک' : 'ناچالاک' }}
              </div>
              <h3 class="service-card__title">{{ service.name }}</h3>
              <p class="service-card__text">{{ service.description }}</p>
              <span class="service-card__link">
                زیاتر بزانە
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </span>
            </div>
          </article>
        </div>

        <div class="section__footer" data-animate="fade-up">
          <button class="btn btn--outline" @click="go('/services')">
            هەموو خزمەتگوزارییەکان
          </button>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════
         ABOUT SECTION
         ═══════════════════════════════════════════════════════════ -->
    <section class="section section--alt">
      <div class="container">
        <header class="section__header" data-animate="fade-up">
          <div class="section__badge">دەربارە</div>
          <h2 class="section__title">دەربارەی ناوەند</h2>
          <p class="section__desc">ناساندنی ناوەند، تیم، بەشەکان</p>
        </header>

        <div class="about-grid">
          <article 
            v-for="(about, idx) in aboutSections" 
            :key="about.slug"
            class="about-card"
            data-animate="fade-up"
            :data-delay="idx * 150"
          >
            <div class="about-card__media">
              <img :src="about.cover.url" :alt="about.title" loading="lazy" />
            </div>
            <div class="about-card__body">
              <h3 class="about-card__title">{{ about.title }}</h3>
              <p class="about-card__text">{{ about.body }}</p>
              <button class="about-card__link" @click="go('/about')">
                زیاتر دەربارە
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════
         FLOATING DONATION BUTTON
         ═══════════════════════════════════════════════════════════ -->
    <button class="donate-fab" @click="go('/donate')" aria-label="Donation">
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
      </svg>
      <span class="donate-fab__pulse"></span>
    </button>

    <!-- ═══════════════════════════════════════════════════════════
         LIGHTBOX MODAL
         ═══════════════════════════════════════════════════════════ -->
    <Teleport to="body">
      <Transition name="lightbox-fade">
        <div v-if="lightboxOpen" class="lightbox" @click.self="closeLightbox">
          <button class="lightbox__close" @click="closeLightbox">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
          <div class="lightbox__content">
            <img :src="lightboxImage.src" :alt="lightboxImage.title" />
            <div class="lightbox__info">
              <h3>{{ lightboxImage.title }}</h3>
              <p>{{ lightboxImage.caption }}</p>
            </div>
          </div>
          <div class="lightbox__nav">
            <button class="lightbox__prev" @click="prevLightbox">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </button>
            <button class="lightbox__next" @click="nextLightbox">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </main>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// ═══════════════════════════════════════════════════════════
// SMOOTH SCROLL & ANIMATIONS
// ═══════════════════════════════════════════════════════════
function scrollTo(selector) {
  const el = document.querySelector(selector)
  if (!el) return
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
  el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
}

function go(path) {
  router.push(path)
}

// Intersection Observer for scroll animations
let observer = null

function initAnimations() {
  const elements = document.querySelectorAll('[data-animate]')
  
  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0
        setTimeout(() => {
          entry.target.classList.add('animated')
        }, parseInt(delay))
        observer.unobserve(entry.target)
      }
    })
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  })

  elements.forEach(el => observer.observe(el))
}

// Parallax effect for hero
const heroBgRef = ref(null)
let parallaxTicking = false

function handleParallax() {
  if (!parallaxTicking) {
    requestAnimationFrame(() => {
      if (heroBgRef.value) {
        const scrolled = window.scrollY
        heroBgRef.value.style.transform = `translateY(${scrolled * 0.4}px) scale(1.1)`
      }
      parallaxTicking = false
    })
    parallaxTicking = true
  }
}

// Particle styles for hero
function getParticleStyle(i) {
  return {
    '--x': `${Math.random() * 100}%`,
    '--y': `${Math.random() * 100}%`,
    '--duration': `${15 + Math.random() * 20}s`,
    '--delay': `${Math.random() * 5}s`,
    '--size': `${2 + Math.random() * 4}px`
  }
}

// ═══════════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════════
const hero = ref({
  image: 'https://picsum.photos/seed/stanfordlike/2200/1200',
  kicker: 'ناوەندی کەلەپووری کوردی',
  title: 'بەخێربێیت بۆ ناوەندی توێژینەوە و کەلەپووری کوردی',
  sub: 'پاراستن و پەرەپێدانی کەلەپووری کوردی لە ڕێگەی دیجیتاڵکردن، توێژینەوە، و بڵاوکردنەوەی زانست و هونەر.',
  primaryCta: 'دۆزینەوە',
  secondaryCta: 'دڵخوازەکان'
})

const stats = ref([
  { label: 'پڕۆژە', value: '128+' },
  { label: 'بڵاوکراوە', value: '340+' },
  { label: 'چالاکی/ساڵ', value: '52' },
])

const news = ref([
  {
    slug: 'spotlight-1',
    category: 'هەواڵ',
    title: 'ڕاپۆرتی نوێ: کۆکردنەوەی دەنگ و ڕێزمان',
    summary: 'پڕۆژەی نوێ بۆ دیژیتاڵکردنی دەنگ و نووسین لەگەڵ تەکنەلۆژیای هەڵگرتنی دەنگ و تێکستی کوردی.',
    date: '2026-02-01',
    readTime: '5 خولەک',
    image: 'https://picsum.photos/seed/news1/1200/800'
  },
  {
    slug: 'spotlight-2',
    category: 'توێژینەوە',
    title: 'پیشاندانی ئەرشیڤی وێنەی مێژوویی',
    summary: 'کۆمەڵێک وێنەی نایاب لە سەدەی رابردوو بۆ یەکەم جار دەردەکەوێت.',
    date: '2026-01-28',
    readTime: '4 خولەک',
    image: 'https://picsum.photos/seed/news2/1200/800'
  },
  {
    slug: 'spotlight-3',
    category: 'چالاکی',
    title: 'سمینار: زمان و کەلەپوور لە ژیانەوەی دیجیتاڵ',
    summary: 'سمیناری تایبەتی بە ئامادەبوونی توێژەرانی نێودەوڵەتی.',
    date: '2026-01-19',
    readTime: '6 خولەک',
    image: 'https://picsum.photos/seed/news3/1200/800'
  }
])

const events = ref([
  { id: 1, day: '05', month: 'Feb', title: 'سمینار: ڕێزمان و فۆنێتیک', time: '6:00 PM', place: 'هۆڵی 1' },
  { id: 2, day: '12', month: 'Feb', title: 'وۆرکشۆپ: دیژیتاڵکردنی ئەرشیڤ', time: '4:00 PM', place: 'ستۆدیۆ' },
  { id: 3, day: '21', month: 'Mar', title: 'کۆنفرانس: کەلەپووری کوردی', time: '10:00 AM', place: 'هۆڵی سەرەکی' },
  { id: 4, day: '03', month: 'Apr', title: 'نمایشگا: وێنەکانی مێژوویی', time: '9:00 AM', place: 'گالەری' }
])

// ═══════════════════════════════════════════════════════════
// MEDIA GALLERY
// ═══════════════════════════════════════════════════════════
const activeMediaTab = ref('video')
const isPlaying = ref(false)
const isAudioPlaying = ref(false)
const audioProgress = ref(0)
const audioCurrentTime = ref(0)
const audioDuration = ref(0)
const videoRef = ref(null)
const audioRef = ref(null)

const mediaTabs = [
  { id: 'video', label: 'ڤیدیۆ', icon: 'VideoIcon' },
  { id: 'audio', label: 'دەنگ', icon: 'AudioIcon' },
  { id: 'image', label: 'وێنە', icon: 'ImageIcon' }
]

const videoList = ref([
  {
    id: 'v1',
    title: 'ڤیدیۆی ناساندنی ناوەند',
    caption: 'ناساندنی تەواوی ناوەند و ئامانجەکانی',
    poster: 'https://picsum.photos/seed/poster1/1200/800',
    thumbnail: 'https://picsum.photos/seed/poster1/400/300',
    src: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    duration: '3:24'
  },
  {
    id: 'v2',
    title: 'چۆنیەتی تۆمارکردنی دەنگ',
    caption: 'ڕێنمایی بۆ تۆمارکردنی دەنگی کەلەپووری',
    poster: 'https://picsum.photos/seed/poster2/1200/800',
    thumbnail: 'https://picsum.photos/seed/poster2/400/300',
    src: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    duration: '5:12'
  },
  {
    id: 'v3',
    title: 'گەشت بۆ گوندەکان',
    caption: 'بەڵگەفیلم دەربارەی کۆکردنەوەی کەلەپوور',
    poster: 'https://picsum.photos/seed/poster3/1200/800',
    thumbnail: 'https://picsum.photos/seed/poster3/400/300',
    src: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    duration: '12:45'
  }
])

const audioList = ref([
  {
    id: 'a1',
    title: 'گۆرانی: خاکی کوردستان',
    caption: 'تۆمارکراو لە ساڵی 1965',
    cover: 'https://picsum.photos/seed/audio1/600/600',
    src: 'https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3',
    duration: '4:32'
  },
  {
    id: 'a2',
    title: 'چیرۆکی پیرەمێرد',
    caption: 'گێڕانەوەی چیرۆکی کۆن',
    cover: 'https://picsum.photos/seed/audio2/600/600',
    src: 'https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3',
    duration: '8:15'
  },
  {
    id: 'a3',
    title: 'هەڵپەڕکێی فۆلکلۆری',
    caption: 'لە هەورامان',
    cover: 'https://picsum.photos/seed/audio3/600/600',
    src: 'https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3',
    duration: '3:48'
  }
])

const imageList = ref([
  {
    id: 'i1',
    title: 'وێنەی شاری سلێمانی - 1920',
    caption: 'وێنەیەکی نایاب لە سەرەتای سەدەی بیستەم',
    src: 'https://picsum.photos/seed/imgfeature1/1400/900',
    thumbnail: 'https://picsum.photos/seed/imgfeature1/400/300'
  },
  {
    id: 'i2',
    title: 'جلوبەرگی کوردی',
    caption: 'جلوبەرگی نەریتی ژنانی کورد',
    src: 'https://picsum.photos/seed/imgfeature2/1400/900',
    thumbnail: 'https://picsum.photos/seed/imgfeature2/400/300'
  },
  {
    id: 'i3',
    title: 'پیشەسازی دەستی',
    caption: 'قالیبافی و چەرمکاری',
    src: 'https://picsum.photos/seed/imgfeature3/1400/900',
    thumbnail: 'https://picsum.photos/seed/imgfeature3/400/300'
  },
  {
    id: 'i4',
    title: 'شوێنەوارە مێژووییەکان',
    caption: 'قەڵای ئەربیل',
    src: 'https://picsum.photos/seed/imgfeature4/1400/900',
    thumbnail: 'https://picsum.photos/seed/imgfeature4/400/300'
  }
])

const currentMediaList = computed(() => {
  switch (activeMediaTab.value) {
    case 'video': return videoList.value
    case 'audio': return audioList.value
    case 'image': return imageList.value
    default: return []
  }
})

const selectedMedia = ref(videoList.value[0])

const getMediaListTitle = computed(() => {
  switch (activeMediaTab.value) {
    case 'video': return 'ڤیدیۆکان'
    case 'audio': return 'دەنگەکان'
    case 'image': return 'وێنەکان'
    default: return ''
  }
})

function switchMediaTab(tabId) {
  // Stop current media
  if (videoRef.value) {
    videoRef.value.pause()
    isPlaying.value = false
  }
  if (audioRef.value) {
    audioRef.value.pause()
    isAudioPlaying.value = false
  }
  
  activeMediaTab.value = tabId
  
  // Select first item of new tab
  nextTick(() => {
    switch (tabId) {
      case 'video':
        selectedMedia.value = videoList.value[0]
        break
      case 'audio':
        selectedMedia.value = audioList.value[0]
        break
      case 'image':
        selectedMedia.value = imageList.value[0]
        break
    }
  })
}

function selectMedia(item) {
  // Stop current media before switching
  if (videoRef.value) {
    videoRef.value.pause()
    isPlaying.value = false
  }
  if (audioRef.value) {
    audioRef.value.pause()
    isAudioPlaying.value = false
  }
  
  selectedMedia.value = item
}

function toggleVideo() {
  if (!videoRef.value) return
  if (videoRef.value.paused) {
    videoRef.value.play()
    isPlaying.value = true
  } else {
    videoRef.value.pause()
    isPlaying.value = false
  }
}

function toggleAudio() {
  if (!audioRef.value) return
  if (audioRef.value.paused) {
    audioRef.value.play()
  } else {
    audioRef.value.pause()
  }
}

function updateAudioProgress() {
  if (!audioRef.value) return
  audioCurrentTime.value = audioRef.value.currentTime
  audioDuration.value = audioRef.value.duration || 0
  audioProgress.value = (audioCurrentTime.value / audioDuration.value) * 100 || 0
}

function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

// ═══════════════════════════════════════════════════════════
// LIGHTBOX
// ═══════════════════════════════════════════════════════════
const lightboxOpen = ref(false)
const lightboxImage = ref({})
const lightboxIndex = ref(0)

function openLightbox(image) {
  lightboxImage.value = image
  lightboxIndex.value = imageList.value.findIndex(i => i.id === image.id)
  lightboxOpen.value = true
  document.body.style.overflow = 'hidden'
}

function closeLightbox() {
  lightboxOpen.value = false
  document.body.style.overflow = ''
}

function prevLightbox() {
  lightboxIndex.value = (lightboxIndex.value - 1 + imageList.value.length) % imageList.value.length
  lightboxImage.value = imageList.value[lightboxIndex.value]
}

function nextLightbox() {
  lightboxIndex.value = (lightboxIndex.value + 1) % imageList.value.length
  lightboxImage.value = imageList.value[lightboxIndex.value]
}

// ═══════════════════════════════════════════════════════════
// POPULAR SLIDER
// ═══════════════════════════════════════════════════════════
const popularSliderRef = ref(null)
const currentSlide = ref(0)

const projects = ref([
  {
    slug: 'proj-oral-history',
    title: 'پڕۆژەی مێژووی دەنگی',
    summary: 'کۆکردنەوەی گفتوگۆ و دەنگی شەهیدان و پیران.',
    status: 'ongoing',
    category: 'دەنگ',
    tags: ['archive', 'audio', 'interviews'],
    cover: { url: 'https://picsum.photos/seed/proj1/1200/800', role: 'cover' },
    mediaCount: 14
  },
  {
    slug: 'proj-photo-story',
    title: 'فتۆستۆری: چیرۆکی وێنە',
    summary: 'چیرۆکی وێنەکان لە شاری و گوند.',
    status: 'completed',
    category: 'وێنە',
    tags: ['image', 'history'],
    cover: { url: 'https://picsum.photos/seed/proj2/1200/800', role: 'cover' },
    mediaCount: 22
  },
  {
    slug: 'proj-film-restoration',
    title: 'پاککردنەوە و ڕێکخستنی فیلم',
    summary: 'ڕێکخستنی ڤیدیۆ و فیلمە کۆنەکان.',
    status: 'ongoing',
    category: 'ڤیدیۆ/فیلم',
    tags: ['video', 'restoration'],
    cover: { url: 'https://picsum.photos/seed/proj3/1200/800', role: 'cover' },
    mediaCount: 9
  },
  {
    slug: 'proj-manuscripts',
    title: 'دەستنووسە کۆنەکان',
    summary: 'دیژیتاڵکردنی دەستنووسە کۆنەکان.',
    status: 'completed',
    category: 'نووسین',
    tags: ['manuscripts', 'digitization'],
    cover: { url: 'https://picsum.photos/seed/proj4/1200/800', role: 'cover' },
    mediaCount: 45
  }
])

const publications = ref([
  {
    slug: 'pub-book-1',
    title: 'کتێب: زمان و مێژوو',
    summary: 'کتێبی تازە دەربارەی مێژووی زمانی کوردی.',
    pub_type: 'writing',
    published_at: '2026-01-10',
    cover: { url: 'https://picsum.photos/seed/pub1/900/600', role: 'cover' }
  },
  {
    slug: 'pub-album-1',
    title: 'ئالبووم: دەنگی کەلەپوور',
    summary: 'کۆمەڵە گۆرانی و دەنگی تۆمارکراو.',
    pub_type: 'music',
    published_at: '2025-12-02',
    cover: { url: 'https://picsum.photos/seed/pub2/900/600', role: 'cover' }
  },
  {
    slug: 'pub-video-1',
    title: 'ڤیدیۆ: ناساندنی ناوەند',
    summary: 'ڤیدیۆی ناساندن و گەشت لە ناوەند.',
    pub_type: 'video',
    published_at: '2025-11-18',
    cover: { url: 'https://picsum.photos/seed/pub3/900/600', role: 'cover' }
  },
  {
    slug: 'pub-photo-1',
    title: 'کۆمەڵەوێنە: ئارشیڤ',
    summary: 'وێنەی تاک و کۆمەڵەوێنەی مێژوویی.',
    pub_type: 'image',
    published_at: '2025-10-05',
    cover: { url: 'https://picsum.photos/seed/pub4/900/600', role: 'cover' }
  }
])

const services = ref([
  {
    slug: 'svc-hall',
    name: 'هۆڵی چالاکی',
    description: 'بۆ سمینار، بۆنە، و پێشانگا بە تەواوی ئامادەیی.',
    service_type: 'hall',
    is_active: 1,
    cover: { url: 'https://picsum.photos/seed/svc1/1200/800', role: 'cover' }
  },
  {
    slug: 'svc-studio',
    name: 'ستۆدیۆی تۆمارکردن',
    description: 'تۆمارکردنی دەنگ و ڤیدیۆ بە شێوەی پڕۆفێشناڵ.',
    service_type: 'studio',
    is_active: 1,
    cover: { url: 'https://picsum.photos/seed/svc2/1200/800', role: 'cover' }
  },
  {
    slug: 'svc-print',
    name: 'چاپخانە و دیزاین',
    description: 'چاپ، پوستر، کتێب، و بڕۆشور بە کوالیتی بەرز.',
    service_type: 'printing',
    is_active: 1,
    cover: { url: 'https://picsum.photos/seed/svc3/1200/800', role: 'cover' }
  }
])

const aboutSections = ref([
  {
    slug: 'about-institute',
    title: 'ئامانج و بینین',
    body: 'ناوەندەکە کار دەکات بۆ پاراستن و پەرەپێدانی کەلەپووری کوردی لە هەموو بوارەکاندا.',
    cover: { url: 'https://picsum.photos/seed/about1/1200/800' }
  },
  {
    slug: 'about-team',
    title: 'تیمی ناوەند',
    body: 'تیمێکی توێژەر و هونەر و دیژیتاڵ کە تایبەتمەندن لە کارەکانیان.',
    cover: { url: 'https://picsum.photos/seed/about2/1200/800' }
  }
])

const popularItems = computed(() => {
  const p = projects.value.slice(0, 3).map(x => ({
    key: `p-${x.slug}`,
    typeLabel: 'پڕۆژە',
    title: x.title,
    summary: x.summary,
    image: x.cover.url
  }))
  const u = publications.value.slice(0, 3).map(x => ({
    key: `u-${x.slug}`,
    typeLabel: 'بڵاوکراوە',
    title: x.title,
    summary: x.summary,
    image: x.cover.url
  }))
  return [...p, ...u]
})

function nextPopular() {
  const el = popularSliderRef.value
  if (!el) return
  el.scrollBy({ left: 340, behavior: 'smooth' })
  currentSlide.value = Math.min(currentSlide.value + 1, Math.ceil(popularItems.value.length / 3) - 1)
}

function prevPopular() {
  const el = popularSliderRef.value
  if (!el) return
  el.scrollBy({ left: -340, behavior: 'smooth' })
  currentSlide.value = Math.max(currentSlide.value - 1, 0)
}

function goToSlide(idx) {
  const el = popularSliderRef.value
  if (!el) return
  el.scrollTo({ left: idx * 340 * 3, behavior: 'smooth' })
  currentSlide.value = idx
}

// ═══════════════════════════════════════════════════════════
// FILTERS
// ═══════════════════════════════════════════════════════════
const projectFilter = ref('all')
const projectFilters = [
  { value: 'all', label: 'هەموو' },
  { value: 'ongoing', label: 'بەردەوام' },
  { value: 'completed', label: 'تەواوکراو' }
]

const filteredProjects = computed(() => {
  if (projectFilter.value === 'all') return projects.value
  return projects.value.filter(p => p.status === projectFilter.value)
})

const pubFilter = ref('all')
const pubFilters = [
  { value: 'all', label: 'هەموو' },
  { value: 'writing', label: 'نووسین' },
  { value: 'music', label: 'دەنگ' },
  { value: 'video', label: 'ڤیدیۆ' },
  { value: 'image', label: 'وێنە' }
]

const filteredPubs = computed(() => {
  if (pubFilter.value === 'all') return publications.value
  return publications.value.filter(p => p.pub_type === pubFilter.value)
})

function typeLabel(t) {
  const labels = {
    writing: 'نووسین',
    music: 'دەنگ',
    video: 'ڤیدیۆ',
    image: 'وێنە',
    film: 'فیلم',
    other: 'تر'
  }
  return labels[t] || 'تر'
}

function getTypeIcon(type) {
  // Return component name based on type
  return 'span'
}

// News Modal
function openNewsModal(news) {
  // Implement news modal or navigation
  console.log('Open news:', news.slug)
}

// ═══════════════════════════════════════════════════════════
// LIFECYCLE
// ═══════════════════════════════════════════════════════════
onMounted(() => {
  initAnimations()
  window.addEventListener('scroll', handleParallax, { passive: true })
  
  // Keyboard navigation for lightbox
  document.addEventListener('keydown', (e) => {
    if (!lightboxOpen.value) return
    if (e.key === 'Escape') closeLightbox()
    if (e.key === 'ArrowLeft') prevLightbox()
    if (e.key === 'ArrowRight') nextLightbox()
  })
})

onUnmounted(() => {
  if (observer) observer.disconnect()
  window.removeEventListener('scroll', handleParallax)
})
</script>

<style scoped>
/* ═══════════════════════════════════════════════════════════
   CSS CUSTOM PROPERTIES - Stanford Inspired
   ═══════════════════════════════════════════════════════════ */
.home {
  /* Brand Colors */
  --brand: #8C1515;
  --brand-light: #B83A4B;
  --brand-dark: #6B0F0F;
  --brand-glow: rgba(140, 21, 21, 0.4);
  
  /* Neutrals */
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
  
  /* Semantic */
  --success: #10B981;
  --info: #3B82F6;
  --warning: #F59E0B;
  
  /* Typography */
  --font-sans: 'Noto Sans Arabic', 'Source Sans 3', system-ui, -apple-system, sans-serif;
  --font-display: 'Noto Kufi Arabic', 'Source Serif 4', Georgia, serif;
  
  /* Spacing */
  --container: 1240px;
  --section-spacing: clamp(60px, 8vw, 100px);
  
  /* Transitions */
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  --duration-fast: 150ms;
  --duration-normal: 300ms;
  --duration-slow: 500ms;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  --shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  --shadow-glow: 0 0 40px rgba(140, 21, 21, 0.15);
  
  /* Radius */
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

/* ═══════════════════════════════════════════════════════════
   ANIMATIONS
   ═══════════════════════════════════════════════════════════ */
[data-animate] {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity var(--duration-slow) var(--ease-out),
              transform var(--duration-slow) var(--ease-out);
}

[data-animate].animated {
  opacity: 1;
  transform: translateY(0);
}

/* Grid animation */
.grid-fade-enter-active,
.grid-fade-leave-active {
  transition: all var(--duration-normal) var(--ease-out);
}
.grid-fade-enter-from,
.grid-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* List animation */
.list-fade-enter-active,
.list-fade-leave-active {
  transition: all var(--duration-normal) var(--ease-out);
}
.list-fade-enter-from {
  opacity: 0;
  transform: translateX(20px);
}
.list-fade-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

/* Media fade */
.media-fade-enter-active,
.media-fade-leave-active {
  transition: all var(--duration-normal) var(--ease-out);
}
.media-fade-enter-from,
.media-fade-leave-to {
  opacity: 0;
  transform: scale(0.98);
}

/* Lightbox */
.lightbox-fade-enter-active,
.lightbox-fade-leave-active {
  transition: all var(--duration-normal) var(--ease-out);
}
.lightbox-fade-enter-from,
.lightbox-fade-leave-to {
  opacity: 0;
}
.lightbox-fade-enter-from .lightbox__content,
.lightbox-fade-leave-to .lightbox__content {
  transform: scale(0.9);
}

/* ═══════════════════════════════════════════════════════════
   LAYOUT
   ═══════════════════════════════════════════════════════════ */
.container {
  max-width: var(--container);
  margin: 0 auto;
  padding: 0 24px;
}

@media (min-width: 768px) {
  .container {
    padding: 0 40px;
  }
}

.section {
  padding: var(--section-spacing) 0;
  position: relative;
}

.section--alt {
  background: var(--grey-50);
}

.section--dark {
  background: linear-gradient(135deg, var(--grey-900) 0%, var(--black) 100%);
  color: var(--white);
}

.section__header {
  text-align: center;
  margin-bottom: 48px;
}

.section__header--row {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  text-align: center;
}

@media (min-width: 768px) {
  .section__header--row {
    flex-direction: row;
    justify-content: space-between;
    text-align: right;
  }
}

.section__badge {
  display: inline-flex;
  align-items: center;
  padding: 6px 16px;
  background: linear-gradient(135deg, var(--brand) 0%, var(--brand-light) 100%);
  color: var(--white);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.05em;
  border-radius: var(--radius-full);
  margin-bottom: 16px;
}

.section__badge--light {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
}

.section__title {
  font-family: var(--font-display);
  font-size: clamp(28px, 4vw, 42px);
  font-weight: 800;
  line-height: 1.2;
  margin: 0 0 12px;
}

.section__title--light {
  color: var(--white);
}

.section__desc {
  color: var(--grey-500);
  font-size: 16px;
  margin: 0;
}

.section__desc--light {
  color: var(--grey-400);
}

.section__footer {
  display: flex;
  justify-content: center;
  margin-top: 48px;
}

/* ═══════════════════════════════════════════════════════════
   HERO SECTION
   ═══════════════════════════════════════════════════════════ */
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.hero__bg {
  position: absolute;
  inset: -10%;
  background-size: cover;
  background-position: center;
  will-change: transform;
}

.hero__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.7) 0%,
    rgba(0, 0, 0, 0.4) 40%,
    rgba(0, 0, 0, 0.6) 100%
  );
}

.hero__particles {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.particle {
  position: absolute;
  width: var(--size);
  height: var(--size);
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  left: var(--x);
  top: var(--y);
  animation: float var(--duration) var(--delay) infinite ease-in-out;
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0) scale(1);
    opacity: 0.3;
  }
  50% {
    transform: translate(20px, -30px) scale(1.2);
    opacity: 0.6;
  }
}

.hero__content {
  position: relative;
  z-index: 2;
  text-align: center;
  color: var(--white);
  padding: 120px 0 80px;
  max-width: 900px;
}

.hero__kicker {
  display: inline-flex;
  align-items: center;
  gap: 16px;
  margin: 0 0 24px;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  opacity: 0.9;
}

.kicker__line {
  width: 40px;
  height: 1px;
  background: currentColor;
  opacity: 0.5;
}

.hero__title {
  font-family: var(--font-display);
  font-size: clamp(36px, 6vw, 72px);
  font-weight: 900;
  line-height: 1.1;
  margin: 0 0 24px;
  text-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
}

.hero__sub {
  font-size: clamp(16px, 2vw, 20px);
  line-height: 1.7;
  margin: 0 0 40px;
  opacity: 0.9;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center;
  margin-bottom: 48px;
}

.hero__stats {
  display: flex;
  justify-content: center;
  gap: 48px;
  flex-wrap: wrap;
}

.stat {
  text-align: center;
}

.stat__value {
  display: block;
  font-family: var(--font-display);
  font-size: clamp(32px, 4vw, 48px);
  font-weight: 900;
  line-height: 1;
  margin-bottom: 8px;
}

.stat__label {
  font-size: 14px;
  opacity: 0.7;
  letter-spacing: 0.05em;
}

/* Scroll Indicator */
.scroll-indicator {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  background: none;
  border: none;
  color: var(--white);
  cursor: pointer;
  opacity: 0.7;
  transition: opacity var(--duration-normal);
}

.scroll-indicator:hover {
  opacity: 1;
}

.scroll-indicator__mouse {
  width: 26px;
  height: 40px;
  border: 2px solid currentColor;
  border-radius: 13px;
  display: flex;
  justify-content: center;
  padding-top: 8px;
}

.scroll-indicator__wheel {
  width: 4px;
  height: 8px;
  background: currentColor;
  border-radius: 2px;
  animation: scroll-wheel 1.5s infinite;
}

@keyframes scroll-wheel {
  0% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(12px);
  }
}

.scroll-indicator__text {
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

/* ═══════════════════════════════════════════════════════════
   BUTTONS
   ═══════════════════════════════════════════════════════════ */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 28px;
  font-family: var(--font-sans);
  font-size: 15px;
  font-weight: 700;
  border: none;
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all var(--duration-normal) var(--ease-out);
}

.btn svg {
  width: 18px;
  height: 18px;
  transition: transform var(--duration-normal) var(--ease-out);
}

.btn:hover svg {
  transform: translateX(-4px);
}

[dir="ltr"] .btn:hover svg {
  transform: translateX(4px);
}

.btn--primary {
  background: linear-gradient(135deg, var(--brand) 0%, var(--brand-light) 100%);
  color: var(--white);
  box-shadow: 0 4px 20px var(--brand-glow);
}

.btn--primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px var(--brand-glow);
}

.btn--glow {
  position: relative;
  overflow: hidden;
}

.btn--glow::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transform: translateX(-100%);
  transition: transform 0.6s;
}

.btn--glow:hover::before {
  transform: translateX(100%);
}

.btn--glass {
  background: rgba(255, 255, 255, 0.1);
  color: var(--white);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
}

.btn--glass:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
}

.btn--outline {
  background: transparent;
  color: var(--grey-900);
  border: 2px solid var(--grey-200);
}

.btn--outline:hover {
  border-color: var(--brand);
  color: var(--brand);
}

/* ═══════════════════════════════════════════════════════════
   NEWS GRID
   ═══════════════════════════════════════════════════════════ */
.news-grid {
  display: grid;
  gap: 24px;
}

@media (min-width: 1024px) {
  .news-grid {
    grid-template-columns: 1.5fr 1fr;
  }
}

.news-card {
  background: var(--white);
  border-radius: var(--radius-lg);
  overflow: hidden;
  cursor: pointer;
  transition: all var(--duration-normal) var(--ease-out);
  border: 1px solid var(--grey-100);
}

.news-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
}

.news-card--featured {
  display: grid;
}

@media (min-width: 768px) {
  .news-card--featured {
    grid-template-columns: 1.2fr 1fr;
  }
}

.news-card__media {
  position: relative;
  aspect-ratio: 16/10;
  overflow: hidden;
}

.news-card--featured .news-card__media {
  aspect-ratio: 4/3;
}

@media (min-width: 768px) {
  .news-card--featured .news-card__media {
    aspect-ratio: auto;
    height: 100%;
  }
}

.news-card__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--duration-slow) var(--ease-out);
}

.news-card:hover .news-card__media img {
  transform: scale(1.05);
}

.news-card__overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity var(--duration-normal);
}

.news-card:hover .news-card__overlay {
  opacity: 1;
}

.news-card__play {
  width: 64px;
  height: 64px;
  background: var(--white);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--brand);
  transform: scale(0.8);
  transition: transform var(--duration-normal) var(--ease-spring);
}

.news-card:hover .news-card__play {
  transform: scale(1);
}

.news-card__play svg {
  width: 24px;
  height: 24px;
  margin-right: -3px;
}

.news-card__content {
  padding: 24px;
  display: flex;
  flex-direction: column;
}

.news-card--featured .news-card__content {
  padding: 32px;
  justify-content: center;
}

.news-card__badge {
  display: inline-flex;
  align-self: flex-start;
  padding: 6px 14px;
  background: var(--grey-100);
  color: var(--grey-700);
  font-size: 12px;
  font-weight: 700;
  border-radius: var(--radius-full);
  margin-bottom: 16px;
}

.news-card__badge--sm {
  padding: 4px 10px;
  font-size: 11px;
  margin-bottom: 12px;
}

.news-card__title {
  font-family: var(--font-display);
  font-size: 24px;
  font-weight: 800;
  line-height: 1.3;
  margin: 0 0 12px;
  color: var(--grey-900);
}

.news-card__title--sm {
  font-size: 18px;
  margin-bottom: 8px;
}

.news-card__excerpt {
  color: var(--grey-600);
  line-height: 1.7;
  margin: 0 0 16px;
  flex: 1;
}

.news-card__meta {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--grey-400);
  font-size: 13px;
  margin-bottom: 16px;
}

.meta-dot {
  width: 4px;
  height: 4px;
  background: currentColor;
  border-radius: 50%;
}

.news-card__link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--brand);
  font-weight: 700;
  font-size: 14px;
}

.news-card__link svg {
  width: 16px;
  height: 16px;
  transition: transform var(--duration-normal);
}

.news-card:hover .news-card__link svg {
  transform: translateX(-4px);
}

.news-secondary {
  display: grid;
  gap: 16px;
}

.news-card--small {
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 16px;
  padding: 12px;
}

.news-card--small .news-card__media {
  aspect-ratio: 1;
  border-radius: var(--radius-md);
}

.news-card--small .news-card__content {
  padding: 0;
  justify-content: center;
}

/* ═══════════════════════════════════════════════════════════
   POPULAR SLIDER
   ═══════════════════════════════════════════════════════════ */
.slider-nav {
  display: flex;
  align-items: center;
  gap: 16px;
}

.slider-btn {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.1);
  color: var(--white);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--duration-normal);
}

.slider-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
}

.slider-btn svg {
  width: 20px;
  height: 20px;
}

.slider-dots {
  display: flex;
  gap: 8px;
}

.slider-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  cursor: pointer;
  transition: all var(--duration-normal);
}

.slider-dot.active {
  background: var(--white);
  transform: scale(1.2);
}

.popular-slider {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(280px, 320px);
  gap: 24px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  padding-bottom: 16px;
  margin: 0 -24px;
  padding-left: 24px;
  padding-right: 24px;
}

.popular-slider::-webkit-scrollbar {
  height: 6px;
}

.popular-slider::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.popular-slider::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

.popular-card {
  scroll-snap-align: start;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: all var(--duration-normal) var(--ease-out);
}

.popular-card:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-4px);
}

.popular-card__media {
  position: relative;
  aspect-ratio: 16/10;
  overflow: hidden;
}

.popular-card__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--duration-slow);
}

.popular-card:hover .popular-card__media img {
  transform: scale(1.05);
}

.popular-card__badge {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 6px 12px;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(10px);
  color: var(--white);
  font-size: 11px;
  font-weight: 700;
  border-radius: var(--radius-full);
}

.popular-card__hover {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity var(--duration-normal);
}

.popular-card:hover .popular-card__hover {
  opacity: 1;
}

.popular-card__action {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--white);
  border: none;
  color: var(--grey-900);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transform: scale(0.8);
  transition: transform var(--duration-normal) var(--ease-spring);
}

.popular-card:hover .popular-card__action {
  transform: scale(1);
}

.popular-card__action svg {
  width: 24px;
  height: 24px;
}

.popular-card__body {
  padding: 20px;
}

.popular-card__title {
  font-size: 17px;
  font-weight: 700;
  color: var(--white);
  margin: 0 0 8px;
  line-height: 1.4;
}

.popular-card__text {
  color: var(--grey-400);
  font-size: 14px;
  line-height: 1.6;
  margin: 0 0 16px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.popular-card__link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--white);
  font-weight: 700;
  font-size: 14px;
}

.popular-card__link svg {
  width: 16px;
  height: 16px;
  transition: transform var(--duration-normal);
}

.popular-card:hover .popular-card__link svg {
  transform: translateX(-4px);
}

/* ═══════════════════════════════════════════════════════════
   MEDIA GALLERY
   ═══════════════════════════════════════════════════════════ */
.media-tabs {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 32px;
  padding: 6px;
  background: var(--grey-100);
  border-radius: var(--radius-full);
  width: fit-content;
  margin-left: auto;
  margin-right: auto;
}

.media-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: transparent;
  border: none;
  border-radius: var(--radius-full);
  font-family: var(--font-sans);
  font-size: 14px;
  font-weight: 600;
  color: var(--grey-600);
  cursor: pointer;
  transition: all var(--duration-normal);
}

.media-tab:hover {
  color: var(--grey-900);
}

.media-tab.active {
  background: var(--white);
  color: var(--brand);
  box-shadow: var(--shadow-md);
}

.media-tab__icon {
  width: 18px;
  height: 18px;
}

.media-showcase {
  display: grid;
  gap: 24px;
}

@media (min-width: 1024px) {
  .media-showcase {
    grid-template-columns: 2fr 1fr;
  }
}

.media-featured {
  background: var(--grey-900);
  border-radius: var(--radius-xl);
  overflow: hidden;
}

/* Video Player */
.video-player {
  position: relative;
}

.video-player__video {
  width: 100%;
  aspect-ratio: 16/9;
  display: block;
  cursor: pointer;
}

.video-player__controls {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.3);
  transition: opacity var(--duration-normal);
}

.video-player__controls.hidden {
  opacity: 0;
  pointer-events: none;
}

.video-player__play {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--white);
  border: none;
  color: var(--brand);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform var(--duration-normal) var(--ease-spring);
  box-shadow: var(--shadow-2xl);
}

.video-player__play:hover {
  transform: scale(1.1);
}

.video-player__play svg {
  width: 32px;
  height: 32px;
  margin-right: -4px;
}

/* Audio Player */
.audio-player {
  display: grid;
  gap: 24px;
  padding: 32px;
}

@media (min-width: 640px) {
  .audio-player {
    grid-template-columns: 200px 1fr;
    align-items: center;
  }
}

.audio-player__artwork {
  position: relative;
  aspect-ratio: 1;
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.audio-player__artwork img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.audio-player__visualizer {
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: flex-end;
  gap: 4px;
  height: 32px;
}

.audio-player__visualizer .bar {
  width: 4px;
  background: var(--white);
  border-radius: 2px;
  transition: height 0.1s;
}

.audio-player__visualizer.playing .bar:nth-child(1) { animation: wave 0.5s ease-in-out infinite; height: 12px; }
.audio-player__visualizer.playing .bar:nth-child(2) { animation: wave 0.5s ease-in-out 0.1s infinite; height: 20px; }
.audio-player__visualizer.playing .bar:nth-child(3) { animation: wave 0.5s ease-in-out 0.2s infinite; height: 16px; }
.audio-player__visualizer.playing .bar:nth-child(4) { animation: wave 0.5s ease-in-out 0.3s infinite; height: 24px; }
.audio-player__visualizer.playing .bar:nth-child(5) { animation: wave 0.5s ease-in-out 0.4s infinite; height: 14px; }

@keyframes wave {
  0%, 100% { height: 8px; }
  50% { height: 32px; }
}

.audio-player__info {
  color: var(--white);
}

.audio-player__title {
  font-family: var(--font-display);
  font-size: 24px;
  font-weight: 800;
  margin: 0 0 8px;
}

.audio-player__caption {
  color: var(--grey-400);
  margin: 0 0 24px;
}

.audio-player__waveform {
  height: 6px;
  background: var(--grey-700);
  border-radius: 3px;
  margin-bottom: 20px;
  overflow: hidden;
}

.waveform-progress {
  height: 100%;
  background: linear-gradient(90deg, var(--brand), var(--brand-light));
  border-radius: 3px;
  transition: width 0.1s;
}

.audio-player__actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.audio-btn {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--brand);
  border: none;
  color: var(--white);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--duration-normal);
}

.audio-btn:hover {
  background: var(--brand-light);
  transform: scale(1.05);
}

.audio-btn svg {
  width: 24px;
  height: 24px;
  margin-right: -2px;
}

.audio-time {
  color: var(--grey-400);
  font-size: 14px;
  font-variant-numeric: tabular-nums;
}

/* Image Display */
.image-display {
  position: relative;
  cursor: pointer;
}

.image-display img {
  width: 100%;
  aspect-ratio: 16/10;
  object-fit: cover;
  display: block;
}

.image-display__overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity var(--duration-normal);
}

.image-display:hover .image-display__overlay {
  opacity: 1;
}

.image-display__zoom {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: var(--white);
  border: none;
  color: var(--grey-900);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transform: scale(0.8);
  transition: transform var(--duration-normal) var(--ease-spring);
}

.image-display:hover .image-display__zoom {
  transform: scale(1);
}

.image-display__zoom svg {
  width: 28px;
  height: 28px;
}

/* Media Info */
.media-info {
  padding: 24px;
  color: var(--white);
}

.media-info__title {
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 8px;
}

.media-info__caption {
  color: var(--grey-400);
  margin: 0;
  font-size: 15px;
}

/* Media List (Thumbnails) */
.media-list {
  background: var(--white);
  border: 1px solid var(--grey-200);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.media-list__title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  color: var(--grey-600);
  border-bottom: 1px solid var(--grey-100);
  background: var(--grey-50);
}

.media-list__count {
  background: var(--grey-200);
  color: var(--grey-600);
  padding: 2px 10px;
  border-radius: var(--radius-full);
  font-size: 12px;
}

.media-list__items {
  max-height: 400px;
  overflow-y: auto;
}

.media-thumb {
  display: grid;
  grid-template-columns: 80px 1fr;
  gap: 12px;
  width: 100%;
  padding: 12px 16px;
  background: transparent;
  border: none;
  border-bottom: 1px solid var(--grey-100);
  text-align: right;
  cursor: pointer;
  transition: background var(--duration-fast);
}

.media-thumb:last-child {
  border-bottom: none;
}

.media-thumb:hover {
  background: var(--grey-50);
}

.media-thumb.active {
  background: rgba(140, 21, 21, 0.05);
}

.media-thumb.active .media-thumb__title {
  color: var(--brand);
}

.media-thumb__image {
  position: relative;
  aspect-ratio: 16/10;
  border-radius: var(--radius-sm);
  overflow: hidden;
}

.media-thumb__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.media-thumb__number {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 20px;
  height: 20px;
  background: rgba(0, 0, 0, 0.6);
  color: var(--white);
  font-size: 10px;
  font-weight: 700;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.media-thumb__info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
}

.media-thumb__title {
  font-size: 14px;
  font-weight: 600;
  color: var(--grey-900);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.media-thumb__duration {
  font-size: 12px;
  color: var(--grey-500);
}

/* ═══════════════════════════════════════════════════════════
   EVENTS GRID
   ═══════════════════════════════════════════════════════════ */
.events-grid {
  display: grid;
  gap: 16px;
}

@media (min-width: 768px) {
  .events-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.event-card {
  display: grid;
  grid-template-columns: 80px 1fr 48px;
  gap: 20px;
  align-items: center;
  padding: 24px;
  background: var(--white);
  border: 1px solid var(--grey-200);
  border-radius: var(--radius-lg);
  transition: all var(--duration-normal) var(--ease-out);
}

.event-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
  border-color: var(--grey-300);
}

.event-card__date {
  text-align: center;
  background: linear-gradient(135deg, var(--brand) 0%, var(--brand-light) 100%);
  color: var(--white);
  padding: 16px 12px;
  border-radius: var(--radius-md);
}

.event-card__day {
  display: block;
  font-size: 28px;
  font-weight: 900;
  line-height: 1;
  margin-bottom: 4px;
}

.event-card__month {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  opacity: 0.9;
}

.event-card__content {
  min-width: 0;
}

.event-card__title {
  font-size: 17px;
  font-weight: 700;
  margin: 0 0 8px;
  color: var(--grey-900);
}

.event-card__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  color: var(--grey-500);
  font-size: 13px;
}

.event-card__time,
.event-card__place {
  display: flex;
  align-items: center;
  gap: 6px;
}

.event-card__time svg,
.event-card__place svg {
  width: 14px;
  height: 14px;
  opacity: 0.7;
}

.event-card__action {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--grey-100);
  border: none;
  color: var(--grey-600);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--duration-normal);
}

.event-card:hover .event-card__action {
  background: var(--brand);
  color: var(--white);
}

.event-card__action svg {
  width: 20px;
  height: 20px;
}

/* ═══════════════════════════════════════════════════════════
   FILTER BAR
   ═══════════════════════════════════════════════════════════ */
.filter-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  margin-bottom: 40px;
}

.filter-bar--dark {
  gap: 8px;
}

.filter-chip {
  padding: 10px 20px;
  background: var(--white);
  border: 1px solid var(--grey-200);
  border-radius: var(--radius-full);
  font-family: var(--font-sans);
  font-size: 14px;
  font-weight: 600;
  color: var(--grey-600);
  cursor: pointer;
  transition: all var(--duration-normal);
}

.filter-chip:hover {
  border-color: var(--grey-300);
  color: var(--grey-900);
}

.filter-chip.active {
  background: var(--brand);
  border-color: var(--brand);
  color: var(--white);
}

.filter-chip--dark {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  color: var(--grey-300);
}

.filter-chip--dark:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
  color: var(--white);
}

.filter-chip--dark.active {
  background: var(--white);
  border-color: var(--white);
  color: var(--grey-900);
}

/* ═══════════════════════════════════════════════════════════
   PROJECTS GRID
   ═══════════════════════════════════════════════════════════ */
.projects-grid {
  display: grid;
  gap: 24px;
}

@media (min-width: 640px) {
  .projects-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .projects-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.project-card {
  background: var(--white);
  border: 1px solid var(--grey-200);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: all var(--duration-normal) var(--ease-out);
}

.project-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-xl);
}

.project-card__media {
  position: relative;
  aspect-ratio: 16/10;
  overflow: hidden;
}

.project-card__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--duration-slow);
}

.project-card:hover .project-card__media img {
  transform: scale(1.05);
}

.project-card__status {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 6px 14px;
  border-radius: var(--radius-full);
  font-size: 11px;
  font-weight: 700;
}

.project-card__status.ongoing {
  background: rgba(16, 185, 129, 0.15);
  color: #059669;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.project-card__status.completed {
  background: rgba(59, 130, 246, 0.15);
  color: #2563eb;
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.project-card__hover {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  background: linear-gradient(transparent, rgba(0,0,0,0.8));
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  opacity: 0;
  transform: translateY(10px);
  transition: all var(--duration-normal);
}

.project-card:hover .project-card__hover {
  opacity: 1;
  transform: translateY(0);
}

.project-card__category {
  color: var(--white);
  font-size: 12px;
  font-weight: 600;
}

.project-card__media-count {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--white);
  font-size: 13px;
}

.project-card__media-count svg {
  width: 16px;
  height: 16px;
}

.project-card__body {
  padding: 24px;
}

.project-card__title {
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 10px;
  color: var(--grey-900);
  line-height: 1.3;
}

.project-card__text {
  color: var(--grey-600);
  font-size: 15px;
  line-height: 1.6;
  margin: 0 0 16px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.project-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.project-tag {
  padding: 4px 10px;
  background: var(--grey-100);
  color: var(--grey-600);
  font-size: 12px;
  font-weight: 600;
  border-radius: var(--radius-full);
}

.project-card__link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--brand);
  font-weight: 700;
  font-size: 14px;
}

.project-card__link svg {
  width: 16px;
  height: 16px;
  transition: transform var(--duration-normal);
}

.project-card:hover .project-card__link svg {
  transform: translateX(-4px);
}

/* ═══════════════════════════════════════════════════════════
   PUBLICATIONS LIST
   ═══════════════════════════════════════════════════════════ */
.publications-list {
  display: grid;
  gap: 20px;
}

.pub-card {
  display: grid;
  gap: 20px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-lg);
  transition: all var(--duration-normal);
}

@media (min-width: 640px) {
  .pub-card {
    grid-template-columns: 160px 1fr;
  }
}

.pub-card:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.15);
  transform: translateX(4px);
}

.pub-card__media {
  position: relative;
  aspect-ratio: 4/3;
  border-radius: var(--radius-md);
  overflow: hidden;
}

.pub-card__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.pub-card__type {
  position: absolute;
  bottom: 8px;
  right: 8px;
  width: 32px;
  height: 32px;
  background: var(--white);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--brand);
}

.pub-card__body {
  display: flex;
  flex-direction: column;
}

.pub-card__meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.pub-card__badge {
  padding: 4px 12px;
  background: rgba(255, 255, 255, 0.15);
  color: var(--white);
  font-size: 11px;
  font-weight: 700;
  border-radius: var(--radius-full);
}

.pub-card__date {
  color: var(--grey-400);
  font-size: 13px;
}

.pub-card__title {
  font-size: 18px;
  font-weight: 700;
  color: var(--white);
  margin: 0 0 8px;
  line-height: 1.4;
}

.pub-card__text {
  color: var(--grey-400);
  font-size: 14px;
  line-height: 1.6;
  margin: 0 0 16px;
  flex: 1;
}

.pub-card__link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--white);
  font-weight: 700;
  font-size: 14px;
}

.pub-card__link svg {
  width: 16px;
  height: 16px;
  transition: transform var(--duration-normal);
}

.pub-card:hover .pub-card__link svg {
  transform: translateX(-4px);
}

/* ═══════════════════════════════════════════════════════════
   SERVICES GRID
   ═══════════════════════════════════════════════════════════ */
.services-grid {
  display: grid;
  gap: 24px;
}

@media (min-width: 768px) {
  .services-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.service-card {
  background: var(--white);
  border: 1px solid var(--grey-200);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: all var(--duration-normal) var(--ease-out);
}

.service-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
}

.service-card__media {
  position: relative;
  aspect-ratio: 16/10;
  overflow: hidden;
}

.service-card__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--duration-slow);
}

.service-card:hover .service-card__media img {
  transform: scale(1.05);
}

.service-card__icon {
  position: absolute;
  bottom: -24px;
  right: 20px;
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, var(--brand) 0%, var(--brand-light) 100%);
  color: var(--white);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-lg);
}

.service-card__icon svg {
  width: 24px;
  height: 24px;
}

.service-card__body {
  padding: 32px 24px 24px;
}

.service-card__status {
  display: inline-flex;
  padding: 4px 10px;
  border-radius: var(--radius-full);
  font-size: 11px;
  font-weight: 700;
  margin-bottom: 12px;
}

.service-card__status.active {
  background: rgba(16, 185, 129, 0.15);
  color: #059669;
}

.service-card__status:not(.active) {
  background: var(--grey-100);
  color: var(--grey-500);
}

.service-card__title {
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 10px;
  color: var(--grey-900);
}

.service-card__text {
  color: var(--grey-600);
  font-size: 15px;
  line-height: 1.6;
  margin: 0 0 16px;
}

.service-card__link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--brand);
  font-weight: 700;
  font-size: 14px;
}

.service-card__link svg {
  width: 16px;
  height: 16px;
  transition: transform var(--duration-normal);
}

.service-card:hover .service-card__link svg {
  transform: translateX(-4px);
}

/* ═══════════════════════════════════════════════════════════
   ABOUT GRID
   ═══════════════════════════════════════════════════════════ */
.about-grid {
  display: grid;
  gap: 24px;
}

@media (min-width: 768px) {
  .about-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.about-card {
  background: var(--white);
  border: 1px solid var(--grey-200);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: all var(--duration-normal) var(--ease-out);
}

.about-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
}

.about-card__media {
  aspect-ratio: 16/9;
  overflow: hidden;
}

.about-card__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--duration-slow);
}

.about-card:hover .about-card__media img {
  transform: scale(1.05);
}

.about-card__body {
  padding: 24px;
}

.about-card__title {
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 700;
  margin: 0 0 12px;
  color: var(--grey-900);
}

.about-card__text {
  color: var(--grey-600);
  line-height: 1.7;
  margin: 0 0 20px;
}

.about-card__link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--brand);
  font-weight: 700;
  font-size: 14px;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
}

.about-card__link svg {
  width: 16px;
  height: 16px;
  transition: transform var(--duration-normal);
}

.about-card:hover .about-card__link svg {
  transform: translateX(-4px);
}

/* ═══════════════════════════════════════════════════════════
   DONATION FAB
   ═══════════════════════════════════════════════════════════ */
.donate-fab {
  position: fixed;
  bottom: 24px;
  left: 24px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--brand) 0%, var(--brand-light) 100%);
  border: none;
  color: var(--white);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  transition: all var(--duration-normal) var(--ease-out);
  box-shadow: 0 4px 20px var(--brand-glow);
}

[dir="ltr"] .donate-fab {
  left: auto;
  right: 24px;
}

.donate-fab:hover {
  transform: scale(1.1);
  box-shadow: 0 8px 30px var(--brand-glow);
}

.donate-fab svg {
  width: 24px;
  height: 24px;
}

.donate-fab__pulse {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: var(--brand);
  animation: pulse 2s infinite;
  z-index: -1;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 0.5;
  }
  100% {
    transform: scale(1.8);
    opacity: 0;
  }
}

/* ═══════════════════════════════════════════════════════════
   LIGHTBOX
   ═══════════════════════════════════════════════════════════ */
.lightbox {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.95);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
}

.lightbox__close {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: var(--white);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--duration-normal);
  z-index: 10;
}

.lightbox__close:hover {
  background: rgba(255, 255, 255, 0.2);
}

.lightbox__close svg {
  width: 24px;
  height: 24px;
}

.lightbox__content {
  max-width: 90vw;
  max-height: 80vh;
  text-align: center;
  transition: transform var(--duration-normal) var(--ease-out);
}

.lightbox__content img {
  max-width: 100%;
  max-height: 70vh;
  object-fit: contain;
  border-radius: var(--radius-md);
}

.lightbox__info {
  margin-top: 20px;
  color: var(--white);
}

.lightbox__info h3 {
  font-size: 20px;
  margin: 0 0 8px;
}

.lightbox__info p {
  color: var(--grey-400);
  margin: 0;
}

.lightbox__nav {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 12px;
}

.lightbox__prev,
.lightbox__next {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: var(--white);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--duration-normal);
}

.lightbox__prev:hover,
.lightbox__next:hover {
  background: rgba(255, 255, 255, 0.2);
}

.lightbox__prev svg,
.lightbox__next svg {
  width: 20px;
  height: 20px;
}

/* ═══════════════════════════════════════════════════════════
   RESPONSIVE ADJUSTMENTS
   ═══════════════════════════════════════════════════════════ */
@media (max-width: 640px) {
  .hero__stats {
    gap: 32px;
  }
  
  .stat__value {
    font-size: 28px;
  }
  
  .media-tabs {
    width: 100%;
    justify-content: space-around;
  }
  
  .media-tab {
    padding: 10px 16px;
    font-size: 13px;
  }
  
  .media-tab span {
    display: none;
  }
  
  .media-tab__icon {
    width: 20px;
    height: 20px;
  }
}

/* Smooth scrolling */
@media (prefers-reduced-motion: no-preference) {
  html {
    scroll-behavior: smooth;
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>