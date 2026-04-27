<template>
  <main id="main-content" class="home" :dir="lang.dir" :class="{ 'home--ltr': lang.isKMR }">
    
    <!-- ══════════════════════════════════════════════════════ HERO ══ -->
    <section class="hero" aria-label="Hero">
      <div class="hero__bg">
        <div class="hero__gradient" />
        <div class="hero__pattern" />
      </div>
      
      <div class="container hero__content">
        <div class="hero__eyebrow">
          <span class="hero__line" />
          <span>EST. 1992</span>
          <span class="hero__line" />
        </div>
        
        <h1 class="hero__title">
          <span class="hero__title-top">{{ lbl('heroKicker') }}</span>
          <span class="hero__title-main">{{ lbl('heroMain') }}</span>
        </h1>
        
        <p class="hero__desc">{{ lbl('heroDesc') }}</p>
        
        <div class="hero__actions">
          <button class="btn btn--primary" @click="scrollTo('#news')">
            {{ lbl('exploreNews') }}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M7 17L17 7M17 7H7M17 7V17"/>
            </svg>
          </button>
          <button class="btn btn--secondary" @click="scrollTo('#videos')">
            {{ lbl('publications') }}
          </button>
        </div>

        <div class="hero__stats">
          <div v-for="(stat, i) in heroStats" :key="i" class="hero__stat">
            <span class="hero__stat-num">{{ stat.value }}</span>
            <span class="hero__stat-label">{{ stat.label }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════════════ NEWS ══ -->
    <section id="news" class="section section--news">
      <div class="container">
        <div class="section__header">
          <span class="badge badge--red">{{ lbl('newsBadge') }}</span>
          <h2 class="section__title section__title--dark">{{ lbl('newsTitle') }}</h2>
          <p class="section__subtitle section__subtitle--dark">{{ lbl('newsDesc') }}</p>
        </div>

        <div v-if="newsLoading" class="loading-grid">
          <div v-for="i in 4" :key="i" class="loading-card" />
        </div>

        <div v-else-if="!displayedNews.length" class="empty-state">
          <span class="empty-icon">📰</span>
          <p>{{ lbl('noContent') }}</p>
        </div>

        <template v-else>
          <div class="news-grid">
            <!-- Featured -->
            <article class="news-card news-card--featured" @click="openNewsModal(displayedNews[0])">
              <div class="news-card__image">
                <img :src="safeImg(displayedNews[0].coverUrl) || fallback" :alt="nTitle(displayedNews[0])" @error="onImgErr">
                <div class="news-card__overlay" />
              </div>
              <div class="news-card__content">
                <span class="news-card__cat">{{ nCat(displayedNews[0]) }}</span>
                <h3 class="news-card__title">{{ nTitle(displayedNews[0]) }}</h3>
                <p class="news-card__excerpt">{{ truncate(nDesc(displayedNews[0]), 140) }}</p>
                <div class="news-card__footer">
                  <time>{{ formatDate(displayedNews[0].datePublished) }}</time>
                  <span class="read-more">{{ lbl('readMore') }} →</span>
                </div>
              </div>
            </article>

            <!-- Side items -->
            <div class="news-side">
              <article v-for="(item, idx) in displayedNews.slice(1, 4)" :key="item.id" 
                class="news-card news-card--small" @click="openNewsModal(item)">
                <div class="news-card__image">
                  <img :src="safeImg(item.coverUrl) || fallback" :alt="nTitle(item)" @error="onImgErr">
                </div>
                <div class="news-card__content">
                  <span class="news-card__cat">{{ nCat(item) }}</span>
                  <h4 class="news-card__title">{{ nTitle(item) }}</h4>
                  <time>{{ formatDate(item.datePublished) }}</time>
                </div>
              </article>
            </div>
          </div>
        </template>

        <div class="section__footer">
  <button class="btn btn--outline-dark" @click="go('/news')">
    {{ lbl('allNews') }}
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
  </button>
</div>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════════════ PROJECTS ══ -->
    <section id="projects" class="section section--projects">
      <div class="container">
        <div class="section__header">
          <span class="badge badge--gold">{{ lbl('projBadge') }}</span>
          <h2 class="section__title section__title--dark">{{ lbl('projTitle') }}</h2>
          <p class="section__subtitle section__subtitle--dark">{{ lbl('projDesc') }}</p>
        </div>

        <div v-if="projLoading" class="loading-grid loading-grid--3">
          <div v-for="i in 3" :key="i" class="loading-card loading-card--tall" />
        </div>

        <div v-else-if="!filteredProjects.length" class="empty-state">
          <span class="empty-icon">📂</span>
          <p>{{ lbl('noContent') }}</p>
        </div>

        <div v-else class="projects-grid">
          <article v-for="(proj, idx) in filteredProjects.slice(0, 3)" :key="proj.id" 
            class="project-card" @click="go('/projects')">
            <div class="project-card__image">
              <img :src="safeImg(proj.coverUrl) || fallback" :alt="projTitle(proj)" @error="onImgErr">
              <div class="project-card__status" :class="'project-card__status--' + proj.status?.toLowerCase()">
                {{ proj.status === 'COMPLETED' ? lbl('completed') : lbl('ongoing') }}
              </div>
            </div>
            <div class="project-card__body">
              <h3 class="project-card__title">{{ projTitle(proj) }}</h3>
              <p class="project-card__desc">{{ truncate(projDesc(proj), 100) }}</p>
              <div class="project-card__tags" v-if="projTags(proj).length">
                <span v-for="t in projTags(proj).slice(0, 2)" :key="t" class="project-tag">#{{ t }}</span>
              </div>
            </div>
          </article>
        </div>

        <div class="section__footer">
          <button class="btn btn--primary" @click="go('/projects')">
            {{ lbl('allProjects') }}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════════════ VIDEOS ══ -->
    <section id="videos" class="section section--videos">
      <div class="container">
        <div class="section__header section__header--row">
          <div>
            <span class="badge badge--teal">{{ lbl('video') }}</span>
            <h2 class="section__title section__title--light">{{ lbl('videoDesc') }}</h2>
          </div>
          <button class="btn btn--light" @click="go('/publishments')">
            {{ lbl('viewAll') }}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        </div>

        <div v-if="pubLoading" class="loading-grid loading-grid--4">
          <div v-for="i in 4" :key="i" class="loading-card loading-card--video" />
        </div>

        <!-- Films Row -->
        <div v-if="films.length" class="video-row">
          <h3 class="video-row__title">{{ lbl('films') }}</h3>
          <div class="films-grid">
            <article v-for="film in films.slice(0, 2)" :key="film.id" class="film-card" @click="go('/publishments')">
              <div class="film-card__thumb">
                <img :src="pCover(film)" :alt="pTitle(film)" @error="onImgErr">
                <div class="film-card__overlay" />
                <div class="film-card__play">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                </div>
                <div v-if="film.durationSeconds" class="film-card__duration">{{ formatTime(film.durationSeconds) }}</div>
              </div>
              <div class="film-card__info">
                <h4 class="film-card__title">{{ pTitle(film) }}</h4>
                <p class="film-card__desc">{{ truncate(pDesc(film), 80) }}</p>
              </div>
            </article>
          </div>
        </div>

        <!-- Video Clips Row -->
        <div v-if="videoClips.length" class="video-row">
          <h3 class="video-row__title">{{ lbl('videoClips') }}</h3>
          <div class="clips-grid">
            <article v-for="clip in videoClips.slice(0, 4)" :key="clip.id" class="clip-card" @click="go('/publishments')">
              <div class="clip-card__thumb">
                <img :src="pCover(clip)" :alt="pTitle(clip)" @error="onImgErr">
                <div class="clip-card__overlay" />
                <div class="clip-card__play">▶</div>
                <div v-if="clip.albumOfMemories" class="clip-card__badge">💫 {{ lbl('memories') }}</div>
              </div>
              <h5 class="clip-card__title">{{ pTitle(clip) }}</h5>
              <span v-if="clip.videoClipItems?.length" class="clip-card__count">{{ clip.videoClipItems.length }} {{ lbl('clips') }}</span>
            </article>
          </div>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════════════ SOUNDS ══ -->
    <section id="sounds" class="section section--sounds">
      <div class="container">
        <div class="section__header section__header--row">
          <div>
            <span class="badge badge--purple">{{ lbl('sound') }}</span>
            <h2 class="section__title section__title--dark">{{ lbl('soundDesc') }}</h2>
          </div>
          <button class="btn btn--outline-dark" @click="go('/publishments')">
            {{ lbl('viewAll') }}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        </div>

        <div v-if="pubLoading" class="loading-grid loading-grid--sound">
          <div v-for="i in 4" :key="i" class="loading-card loading-card--sound" />
        </div>

        <!-- Singles -->
        <div v-if="singleTracks.length" class="sound-section">
          <h3 class="sound-section__title">{{ lbl('singleTracks') }}</h3>
          <div class="singles-list">
            <div v-for="(track, idx) in singleTracks.slice(0, 4)" :key="track.id" class="single-item" @click="go('/publishments')">
              <div class="single-item__num">{{ String(idx + 1).padStart(2, '0') }}</div>
              <img class="single-item__img" :src="pCover(track)" :alt="pTitle(track)" @error="onImgErr">
              <div class="single-item__info">
                <h5 class="single-item__title">{{ pTitle(track) }}</h5>
                <p v-if="pWriter(track)" class="single-item__artist">{{ pWriter(track) }}</p>
              </div>
              <div class="single-item__visualizer">
                <span v-for="b in 4" :key="b" :style="{ animationDelay: `${b * 0.1}s` }" />
              </div>
              <span v-if="track.files?.[0]?.durationSeconds" class="single-item__time">{{ formatTime(track.files[0].durationSeconds) }}</span>
            </div>
          </div>
        </div>

        <!-- Albums -->
        <div v-if="soundGalleries.length" class="sound-section">
          <h3 class="sound-section__title">{{ lbl('soundGalleries') }}</h3>
          <div class="albums-grid">
            <article v-for="album in soundGalleries.slice(0, 3)" :key="album.id" class="album-card" @click="go('/publishments')">
              <div class="album-card__cover">
                <img :src="pCover(album)" :alt="pTitle(album)" @error="onImgErr">
                <div class="album-card__vinyl" />
                <div class="album-card__play">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                </div>
              </div>
              <div class="album-card__info">
                <h4 class="album-card__title">{{ pTitle(album) }}</h4>
                <p class="album-card__count" v-if="album.files?.length">{{ album.files.length }} {{ lbl('tracks') }}</p>
                <div v-if="album.albumOfMemories" class="album-card__badge">💫 {{ lbl('memories') }}</div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════════════ WRITINGS ══ -->
    <section id="writings" class="section section--writings">
      <div class="container">
        <div class="section__header section__header--row">
          <div>
            <span class="badge badge--green">{{ lbl('writings') }}</span>
            <h2 class="section__title section__title--dark">{{ lbl('writingDesc') }}</h2>
          </div>
          <button class="btn btn--outline-dark" @click="go('/publishments')">
            {{ lbl('viewAll') }}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        </div>

        <div v-if="pubLoading" class="loading-grid loading-grid--books">
          <div v-for="i in 4" :key="i" class="loading-card loading-card--book" />
        </div>

        <div v-else-if="writings.length" class="books-grid">
          <article v-for="book in writings.slice(0, 4)" :key="book.id" class="book-card" @click="go('/publishments')">
            <div class="book-card__cover">
              <div class="book-card__spine" />
              <img :src="pCover(book)" :alt="pTitle(book)" @error="onImgErr">
              <div class="book-card__pages" />
              <div class="book-card__hover">
                <span>{{ lbl('read') }}</span>
              </div>
              <div class="book-card__category" v-if="book.writingTopic">
                {{ writingTopicLabel(book.writingTopic) }}
              </div>
            </div>
            <div class="book-card__info">
              <h4 class="book-card__title">{{ pTitle(book) }}</h4>
              <p v-if="pWriter(book)" class="book-card__author">{{ pWriter(book) }}</p>
              <div class="book-card__meta-row">
                <span v-if="book.ckbContent?.pageCount || book.kmrContent?.pageCount" class="book-card__pages-count">
                  📄 {{ book.ckbContent?.pageCount || book.kmrContent?.pageCount }} {{ lbl('pages') }}
                </span>
                <span v-if="book.writingTopic" class="book-card__topic-chip">{{ writingTopicLabel(book.writingTopic) }}</span>
              </div>
            </div>
          </article>
        </div>

        <!-- Writing Categories Summary -->
        <div v-if="writingCategories.length" class="writing-cats">
          <div class="writing-cats__row">
            <div v-for="cat in writingCategories" :key="cat.key" class="writing-cat-chip" @click="go('/publishments')">
              <span class="writing-cat-chip__icon">{{ cat.icon }}</span>
              <span class="writing-cat-chip__label">{{ cat.label }}</span>
              <span class="writing-cat-chip__count">{{ cat.count }}</span>
            </div>
          </div>
        </div>

        <div v-else class="empty-state">
          <span class="empty-icon">📚</span>
          <p>{{ lbl('noContent') }}</p>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════════════ IMAGES ══ -->
    <section id="images" class="section section--images">
      <div class="container">
        <div class="section__header section__header--row">
          <div>
            <span class="badge badge--orange">{{ lbl('images') }}</span>
            <h2 class="section__title section__title--light">{{ lbl('imageDesc') }}</h2>
          </div>
          <button class="btn btn--light" @click="go('/publishments')">
            {{ lbl('viewAll') }}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        </div>

        <div v-if="pubLoading" class="loading-grid loading-grid--images">
          <div v-for="i in 6" :key="i" class="loading-card loading-card--image" />
        </div>

        <template v-else>
          <!-- Single Images -->
          <div v-if="imageSingles.length" class="images-row">
            <h3 class="images-row__title">{{ lbl('singleImages') }}</h3>
            <div class="masonry-grid">
              <figure v-for="(img, idx) in imageSingles.slice(0, 3)" :key="img.id" 
                class="masonry-item" 
                :class="{ 'masonry-item--large': idx === 0 }"
                @click="openImageLightbox(img)">
                <img :src="pCover(img)" :alt="pTitle(img)" @error="onImgErr">
                <figcaption>
                  <h4>{{ pTitle(img) }}</h4>
                </figcaption>
              </figure>
            </div>
          </div>

          <!-- Galleries -->
          <div v-if="imageGalleries.length" class="images-row">
            <h3 class="images-row__title">{{ lbl('photoGalleries') }}</h3>
            <div class="galleries-grid">
              <article v-for="col in imageGalleries.slice(0, 3)" :key="col.id" class="gallery-card" @click="openImageLightbox(col)">
                <div class="gallery-card__thumb">
                  <img :src="pCover(col)" :alt="pTitle(col)" @error="onImgErr">
                  <div class="gallery-card__count">
                    <span>🖼 {{ col.imageAlbum?.length || 0 }}</span>
                  </div>
                </div>
                <h4 class="gallery-card__title">{{ pTitle(col) }}</h4>
              </article>
            </div>
          </div>

          <!-- Photo Stories -->
          <div v-if="photoStories.length" class="images-row">
            <h3 class="images-row__title">{{ lbl('photoStories') }}</h3>
            <div class="stories-grid">
              <article v-for="story in photoStories.slice(0, 3)" :key="story.id" class="story-card" @click="openImageLightbox(story)">
                <div class="story-card__thumb">
                  <img :src="pCover(story)" :alt="pTitle(story)" @error="onImgErr">
                  <div class="story-card__overlay" />
                  <div class="story-card__badge">📖 {{ lbl('photoStory') }}</div>
                  <div class="story-card__count" v-if="story.imageAlbum?.length">
                    {{ story.imageAlbum.length }} {{ lbl('steps') }}
                  </div>
                </div>
                <div class="story-card__info">
                  <h4 class="story-card__title">{{ pTitle(story) }}</h4>
                  <p class="story-card__desc">{{ truncate(pDesc(story), 80) }}</p>
                </div>
              </article>
            </div>
          </div>
        </template>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════════════ MEMORIES ══ -->
    <section v-if="allMemories.length" id="memories" class="section section--memories">
      <div class="container">
        <div class="section__header">
          <span class="badge badge--gold">💫 {{ lbl('memBadge') }}</span>
          <h2 class="section__title section__title--light">{{ lbl('memTitle') }}</h2>
          <p class="section__subtitle section__subtitle--light">{{ lbl('memDesc') }}</p>
        </div>

        <div class="memories-grid">
          <article v-for="mem in filteredMemories.slice(0, 6)" :key="`${mem._mtype}-${mem.id}`" 
            class="memory-card" @click="go('/publishments')">
            <div class="memory-card__thumb">
              <img :src="memCover(mem)" :alt="memTitle(mem)" @error="onImgErr">
              <div class="memory-card__overlay" />
              <div class="memory-card__type">
                {{ mem._mtype === 'sound' ? '🎵 ' + lbl('sound') : '🎬 ' + lbl('video') }}
              </div>
              <div class="memory-card__star">💫</div>
            </div>
            <div class="memory-card__content">
              <h4 class="memory-card__title">{{ memTitle(mem) }}</h4>
              <p class="memory-card__desc">{{ truncate(memDesc(mem), 60) }}</p>
              <div class="memory-card__meta">
                <span v-if="mem.files?.length">{{ mem.files.length }} {{ lbl('tracks') }}</span>
                <span v-if="mem.durationSeconds">{{ formatTime(mem.durationSeconds) }}</span>
              </div>
            </div>
          </article>
        </div>

        <div class="section__footer">
          <button class="btn btn--gold" @click="go('/publishments')">
            {{ lbl('allMemories') }}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════════════ DONATE ══ -->
    <section class="section section--donate">
      <div class="container">
        <div class="donate-card">
          <div class="donate-content">
            <span class="donate-badge">❤️ {{ lbl('donateBadge') }}</span>
            <h2 class="donate-title">{{ lbl('donateTitle') }}</h2>
            <p class="donate-text">{{ lbl('donateLead') }}</p>
            
            <div class="donate-features">
              <div v-for="(feat, i) in [lbl('donateR1'), lbl('donateR2'), lbl('donateR3')]" :key="i" class="donate-feature">
                <span class="donate-check">✓</span>
                {{ feat }}
              </div>
            </div>

            <div class="donate-amounts">
              <button v-for="amt in [10, 25, 50, 100]" :key="amt" 
                class="amount-btn" 
                :class="{ 'amount-btn--active': selectedAmt === amt }"
                @click="selectedAmt = amt">
                ${{ amt }}
              </button>
            </div>

            <div class="donate-actions">
              <button class="btn btn--donate" @click="go('/donate')">
                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                {{ lbl('donateNow') }}
              </button>
            </div>
          </div>
          
          <div class="donate-visual">
            <div class="impact-grid">
              <div class="impact-item">
                <span class="impact-num">{{ sounds.length || '0' }}</span>
                <span class="impact-label">{{ lbl('sound') }}</span>
              </div>
              <div class="impact-item">
                <span class="impact-num">{{ writings.length || '0' }}</span>
                <span class="impact-label">{{ lbl('writings') }}</span>
              </div>
              <div class="impact-item">
                <span class="impact-num">{{ imageCollections.length || '0' }}</span>
                <span class="impact-label">{{ lbl('images') }}</span>
              </div>
              <div class="impact-item impact-item--gold">
                <span class="impact-num">{{ allMemories.length || '0' }}</span>
                <span class="impact-label">{{ lbl('memBadge') }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- MODALS -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="activeNews" class="modal-overlay" @click.self="closeModal">
          <div class="modal">
            <button class="modal__close" @click="closeModal">✕</button>
            <div class="modal__image" v-if="activeNews.coverUrl">
              <img :src="safeImg(activeNews.coverUrl) || fallback" @error="onImgErr">
            </div>
            <div class="modal__content">
              <span class="modal__cat">{{ nCat(activeNews) }}</span>
              <h2 class="modal__title">{{ nTitle(activeNews) }}</h2>
              <time class="modal__date">{{ formatDate(activeNews.datePublished) }}</time>
              <p class="modal__desc">{{ nDesc(activeNews) }}</p>
            </div>
          </div>
        </div>
      </Transition>

      <Transition name="fade">
        <div v-if="lightboxUrl" class="lightbox" @click="lightboxUrl = null">
          <button class="lightbox__close" @click.stop="lightboxUrl = null">✕</button>
          <img :src="lightboxUrl" @error="onImgErr">
        </div>
      </Transition>
    </Teleport>

  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { API_BASE_URL } from '../consts.js'
import { useLanguageStore } from '@/stores/useLanguageStore'

const router = useRouter()
const lang = useLanguageStore()

const fallback = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='400' height='300' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23999' font-family='sans-serif'%3EKHI%3C/text%3E%3C/svg%3E"

function safeImg(url) {
  if (!url || !url.startsWith('http')) return null
  try {
    const host = new URL(url).hostname
    if (['example.com', 'placeholder.com'].includes(host)) return null
  } catch { return null }
  return url
}

const api = axios.create({ baseURL: API_BASE_URL, timeout: 15000 })

const i18n = {
  CKB: {
    heroKicker: 'ناوەندی کەلەپووری کوردی',
    heroMain: 'پاراستن و پەرەپێدانی کەلەپووری کوردی',
    heroDesc: 'لە ڕێگەی دیجیتاڵکردن، توێژینەوە، و بڵاوکردنەوەی زانست و هونەر — بۆ نەوەکانی داهاتوو.',
    exploreNews: 'دوا هەواڵەکان',
    publications: 'بڵاوکراوەکان',
    newsBadge: 'هەواڵ',
    newsTitle: 'لە ناوەندی ڕووناکی',
    newsDesc: 'نوێترین هەواڵ و ڕوداوەکان',
    readMore: 'زیاتر بخوێنەوە',
    allNews: 'هەموو هەواڵەکان',
    projBadge: 'پڕۆژەکان',
    projTitle: 'پڕۆژە جێگیرەکان',
    projDesc: 'پڕۆژەکانی ناوەند لە بوارەکانی جیاوازدا',
    completed: 'تەواوکراو',
    ongoing: 'بەردەوام',
    allProjects: 'هەموو پڕۆژەکان',
    viewProject: 'پڕۆژە ببینە',
    video: 'ڤیدیۆ',
    videoDesc: 'فیلم و بەڵگەفیلمی کوردی',
    films: 'فیلمەکان',
    videoClips: 'کلیپەکان',
    viewAll: 'هەمووی ببینە',
    clips: 'کلیپ',
    memories: 'یادگاری',
    sound: 'دەنگ',
    soundDesc: 'تۆمارەکانی دەنگی کوردی',
    singleTracks: 'تاکە گۆرانیەکان',
    soundGalleries: 'ئەلبوومەکان',
    tracks: 'تراک',
    writings: 'نووسین',
    writingDesc: 'کتێب و دەستنووسی کوردی',
    read: 'خوێندنەوە',
    pages: 'لاپەڕە',
    images: 'وێنە',
    imageDesc: 'گالەری وێنەی مێژوویی کوردی',
    singleImages: 'وێنە تاکەکان',
    photoGalleries: 'گالەری وێنە',
    photoStories: 'چیرۆکی وێنەیی',
    photoStory: 'چیرۆکی وێنەیی',
    steps: 'هەنگاو',
    memBadge: 'یادگاریەکان',
    memTitle: 'ئەلبوومی یادگاری',
    memDesc: 'تۆمارەکانی نایابی مێژوویی',
    allMemories: 'هەموو یادگاریەکان',
    donateBadge: 'پشتیوانی',
    donateTitle: 'پشتیوانی لە پاراستنی میراس بکە',
    donateLead: 'بەخشینەکەت یارمەتی ئەم کارە پیرۆزە دەدات بۆ پاراستنی کەلەپووری کوردی',
    donateR1: 'تۆمارکردن و دیجیتاڵکردنی دەنگی کوردی',
    donateR2: 'بڵاوکردنەوەی کتێب و دەستنووسی کوردی',
    donateR3: 'پاراستنی ئەرشیڤی کوردی بۆ نەوەکانی داهاتوو',
    donateNow: 'ئێستا بەخشە',
    donateOther: 'بڕی دیکە',
    noContent: 'هیچ ناوەڕۆکێک بەردەست نییە'
  },
  KMR: {
    heroKicker: 'Dezgeha Mîrasa Kurdî',
    heroMain: 'Parastina û Mezinkirina Mîrasa Kurdî',
    heroDesc: 'Bi rêya dîjîtalkirin, lêkolîn û belavkirina zanist û hunerê.',
    exploreNews: 'Nûçeyên Dawîn',
    publications: 'Weşandin',
    newsBadge: 'Nûçe',
    newsTitle: 'Di Navenda Ronahiyê de',
    newsDesc: 'Nûçeyên herî nû û bûyerên giring',
    readMore: 'Bêtir bixwîne',
    allNews: 'Hemû Nûçe',
    projBadge: 'Projeyên Me',
    projTitle: 'Projeyên Berdewam',
    projDesc: 'Projeyên dezgehê di warên cihê de',
    completed: 'Qediyayî',
    ongoing: 'Berdewam',
    allProjects: 'Hemû Proje',
    viewProject: 'Projeyê bibîne',
    video: 'Vîdyo',
    videoDesc: 'Fîlm û belgefîlmên Kurdî',
    films: 'Fîlm',
    videoClips: 'Klîp',
    viewAll: 'Hemûyan bibîne',
    clips: 'Klîp',
    memories: 'Bîranîn',
    sound: 'Deng',
    soundDesc: 'Tomarên dengê Kurdî',
    singleTracks: 'Stranên Yekane',
    soundGalleries: 'Albûm',
    tracks: 'Stran',
    writings: 'Nivîsar',
    writingDesc: 'Pirtûk û destxetên Kurdî',
    read: 'Bixwîne',
    pages: 'Rûpel',
    images: 'Wêne',
    imageDesc: 'Galeriya wêneyên dîrokî',
    singleImages: 'Wêneyên Yekane',
    photoGalleries: 'Galerî',
    photoStories: 'Çîroka Wêneyan',
    photoStory: 'Çîroka Wêne',
    steps: 'Gavar',
    memBadge: 'Bîranîn',
    memTitle: 'Albûma Bîranînê',
    memDesc: 'Tomarên kêm ên dîrokî yên taybet',
    allMemories: 'Hemû Bîranîn',
    donateBadge: 'Piştgirî',
    donateTitle: 'Piştgirî Bide Parastina Mîrasê',
    donateLead: 'Bexşîna te vê karê pîroz piştgirî dike.',
    donateR1: 'Tomarkirin û dîjîtalkirina dengê Kurdî',
    donateR2: 'Belavkirina pirtûk û destxetên Kurdî',
    donateR3: 'Parastina arşîva Kurdî ji bo pêşerojê',
    donateNow: 'Niha bexşîn',
    donateOther: 'Mîqdara din',
    noContent: 'Naverok tune'
  }
}

function lbl(k) { return i18n[lang?.activeLang || 'CKB']?.[k] ?? k }

// State
const newsList = ref([])
const newsLoading = ref(false)
const sounds = ref([])
const videos = ref([])
const writings = ref([])
const imageCollections = ref([])
const pubLoading = ref(false)
const projects = ref([])
const projLoading = ref(false)
const selectedAmt = ref(25)
const activeNews = ref(null)
const lightboxUrl = ref(null)

// Computed
const heroStats = computed(() => [
  { value: newsList.value.length + '+', label: lbl('newsBadge') },
  { value: (sounds.value.length + videos.value.length + writings.value.length + imageCollections.value.length) + '+', label: lbl('publications') },
  { value: projects.value.length + '+', label: lbl('projBadge') }
])

const displayedNews = computed(() => {
  const al = lang?.activeLang || 'CKB'
  return newsList.value.filter(n => {
    const l = n.contentLanguages || []
    return l.length === 0 || l.includes(al)
  }).sort((a, b) => (b.datePublished || '').localeCompare(a.datePublished || '')).slice(0, 4)
})

const films = computed(() => videos.value.filter(v => v.videoType === 'FILM'))
const videoClips = computed(() => videos.value.filter(v => v.videoType === 'VIDEO_CLIP'))
const singleTracks = computed(() => sounds.value.filter(s => s.trackState === 'SINGLE'))
const soundGalleries = computed(() => sounds.value.filter(s => s.trackState === 'MULTI'))
const imageSingles = computed(() => imageCollections.value.filter(i => i.collectionType === 'SINGLE'))
const imageGalleries = computed(() => imageCollections.value.filter(i => i.collectionType === 'GALLERY'))
const photoStories = computed(() => imageCollections.value.filter(i => i.collectionType === 'PHOTO_STORY'))

const filteredProjects = computed(() => {
  const al = lang?.activeLang || 'CKB'
  return projects.value.filter(p => {
    const l = p.contentLanguages || []
    return l.length === 0 || l.includes(al)
  })
})

const allMemories = computed(() => [
  ...sounds.value.filter(x => x.albumOfMemories).map(x => ({ ...x, _mtype: 'sound' })),
  ...videos.value.filter(x => x.albumOfMemories).map(x => ({ ...x, _mtype: 'video' }))
])

const filteredMemories = computed(() => allMemories.value)

const writingTopicMap = {
  HISTORICAL: { icon: '📜', CKB: 'مێژوویی', KMR: 'Dîrokî' },
  FOLKLORE: { icon: '🏺', CKB: 'فۆلکلۆر', KMR: 'Folklor' },
  RELIGIOUS: { icon: '🕌', CKB: 'ئاینی', KMR: 'Olî' },
  POLITICAL: { icon: '⚖️', CKB: 'سیاسی', KMR: 'Siyasî' },
  POETRY: { icon: '✨', CKB: 'شیعر', KMR: 'Helbest' },
  LITERATURE: { icon: '📖', CKB: 'ئەدەبی', KMR: 'Edebî' },
  CULTURAL: { icon: '🎭', CKB: 'کەلتووری', KMR: 'Çandî' },
  EDUCATIONAL: { icon: '🎓', CKB: 'پەروەردەیی', KMR: 'Perwerdehî' },
  SCIENTIFIC: { icon: '🔬', CKB: 'زانستی', KMR: 'Zanistî' },
  BIOGRAPHICAL: { icon: '👤', CKB: 'ژیاننامە', KMR: 'Jiyannivîs' },
  CHILDREN: { icon: '🧸', CKB: 'منداڵان', KMR: 'Zarokan' },
  PHILOSOPHY: { icon: '💭', CKB: 'فەلسەفە', KMR: 'Felsefe' },
  SOCIOLOGY: { icon: '🏘️', CKB: 'کۆمەڵناسی', KMR: 'Civaknas' },
  LINGUISTICS: { icon: '🗣️', CKB: 'زمانەوانی', KMR: 'Zimannasî' },
  ARTS: { icon: '🎨', CKB: 'هونەر', KMR: 'Huner' },
  ECONOMICS: { icon: '📊', CKB: 'ئابووری', KMR: 'Aborî' },
  MEDICINE: { icon: '🩺', CKB: 'پزیشکی', KMR: 'Bijîşkî' },
  LAW: { icon: '⚖️', CKB: 'یاسایی', KMR: 'Yasayî' },
  OTHER: { icon: '📁', CKB: 'تر', KMR: 'Din' },
}

function writingTopicLabel(topic) {
  const al = lang?.activeLang || 'CKB'
  return writingTopicMap[topic]?.[al] || topic || ''
}

const writingCategories = computed(() => {
  const al = lang?.activeLang || 'CKB'
  const counts = {}
  writings.value.forEach(w => {
    const t = w.writingTopic || 'OTHER'
    counts[t] = (counts[t] || 0) + 1
  })
  return Object.entries(counts)
    .map(([key, count]) => ({
      key,
      label: writingTopicMap[key]?.[al] || key,
      icon: writingTopicMap[key]?.icon || '📁',
      count
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8)
})

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

// Methods
async function fetchNews() {
  newsLoading.value = true
  try {
    const { data } = await api.get('/news')
    newsList.value = toArray(data)
  } catch (e) {
    console.error('[KHI] fetchNews failed', e)
    newsList.value = []
  } finally {
    newsLoading.value = false
  }
}

async function fetchPublications() {
  pubLoading.value = true
  try {
    const [s, v, w, i] = await Promise.allSettled([
      api.get('/sound-tracks'),
      api.get('/videos',            { params: { page: 0, size: 100 } }),
      api.get('/writings',          { params: { page: 0, size: 100 } }),
      api.get('/image-collections')
    ])
    sounds.value           = s.status === 'fulfilled' ? toArray(s.value.data) : []
    videos.value           = v.status === 'fulfilled' ? toArray(v.value.data) : []
    writings.value         = w.status === 'fulfilled' ? toArray(w.value.data) : []
    imageCollections.value = i.status === 'fulfilled' ? toArray(i.value.data) : []
  } catch (e) {
    console.error('[KHI] fetchPublications failed', e)
  } finally {
    pubLoading.value = false
  }
}

// ── Projects ──────────────────────────────────────────────────────────────────
async function fetchProjects() {
  projLoading.value = true
  try {
    const { data } = await api.get('/projects/getAll', { params: { page: 0, size: 50 } })
    projects.value = toArray(data)
  } catch (e) {
    console.error('[KHI] fetchProjects failed', e)
    projects.value = []
  } finally {
    projLoading.value = false
  }
}

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

function pCover(item) {
  if (!item) return fallback
  const al = lang?.activeLang
  return safeImg(al === 'KMR' ? item.kmrCoverUrl : item.ckbCoverUrl) ||
    safeImg(item.ckbCoverUrl) ||
    safeImg(item.kmrCoverUrl) ||
    fallback
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

function pWriter(item) {
  if (!item) return ''
  const c = lang?.activeLang === 'KMR'
  return (c ? item.kmrContent?.writer || item.ckbContent?.writer : item.ckbContent?.writer || item.kmrContent?.writer) || ''
}

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

function memCover(m) { return pCover(m) }
function memTitle(m) { return pTitle(m) }
function memDesc(m) { return pDesc(m) }

function openNewsModal(item) {
  activeNews.value = item
  document.body.style.overflow = 'hidden'
}

function closeModal() {
  activeNews.value = null
  document.body.style.overflow = ''
}

function openImageLightbox(item) {
  const first = item.imageAlbum?.[0]
  const url = first?.imageUrl || first?.externalUrl || pCover(item)
  if (url) lightboxUrl.value = url
  else go('/publishments')
}

function go(path) { router.push(path) }
function scrollTo(sel) { document.querySelector(sel)?.scrollIntoView({ behavior: 'smooth' }) }
function truncate(t, max) { if (!t) return ''; return t.length > max ? t.slice(0, max) + '…' : t }
function formatDate(v) {
  if (!v) return ''
  try {
    const d = new Date(v)
    return d.toLocaleDateString(lang?.activeLang === 'KMR' ? 'ku' : 'ckb', { year: 'numeric', month: 'long', day: 'numeric' })
  } catch { return String(v) }
}

function formatTime(s) {
  if (!s || isNaN(s)) return '0:00'
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60).toString().padStart(2, '0')
  return `${m}:${sec}`
}

function onImgErr(e) { e.target.src = fallback }

onMounted(async () => {
  await Promise.allSettled([fetchNews(), fetchPublications(), fetchProjects()])
})
</script>

<style scoped>
/* Base */
.home {
  font-family: 'Noto Sans Arabic', system-ui, sans-serif;
  background: #ffffff;
  color: #1a1a1a;
  line-height: 1.6;
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9375rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
}

.btn svg {
  width: 18px;
  height: 18px;
}

.btn--primary {
  background: #8C1515;
  color: white;
}

.btn--primary:hover {
  background: #6B0F0F;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(140, 21, 21, 0.3);
}

.btn--secondary {
  background: white;
  color: #8C1515;
  border: 2px solid #8C1515;
}

.btn--secondary:hover {
  background: #8C1515;
  color: white;
}

.btn--outline-dark {
  background: transparent;
  color: #1a1a1a;
  border: 2px solid #1a1a1a;
}

.btn--outline-dark:hover {
  background: #1a1a1a;
  color: white;
}

.btn--light {
  background: white;
  color: #1a1a1a;
}

.btn--light:hover {
  background: rgba(255, 255, 255, 0.9);
  transform: translateY(-2px);
}

.btn--donate {
  background: linear-gradient(135deg, #C6922A, #E8B84B);
  color: white;
  font-size: 1.1rem;
  padding: 1rem 2rem;
}

.btn--donate:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(198, 146, 42, 0.4);
}

/* Badges */
.badge {
  display: inline-block;
  padding: 0.375rem 1rem;
  border-radius: 100px;
  font-size: 0.8125rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 1rem;
}

.badge--red {
  background: rgba(140, 21, 21, 0.1);
  color: #8C1515;
}

.badge--gold {
  background: rgba(198, 146, 42, 0.15);
  color: #9E7420;
}

.badge--teal {
  background: rgba(13, 115, 119, 0.15);
  color: #095456;
}

.badge--purple {
  background: rgba(107, 70, 193, 0.15);
  color: #553C9A;
}

.badge--green {
  background: rgba(56, 161, 105, 0.15);
  color: #276749;
}

.badge--orange {
  background: rgba(237, 137, 54, 0.15);
  color: #C05621;
}

/* Hero */
.hero {
  position: relative;
  min-height: 90vh;
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #1a1a1a 0%, #2d1818 100%);
  color: white;
  overflow: hidden;
}

.hero__gradient {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 30% 50%, rgba(140, 21, 21, 0.4) 0%, transparent 50%);
}

.hero__pattern {
  position: absolute;
  inset: 0;
  opacity: 0.05;
  background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}

.hero__content {
  position: relative;
  z-index: 10;
  text-align: center;
  padding-top: 4rem;
  padding-bottom: 4rem;
}

.hero__eyebrow {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.875rem;
  letter-spacing: 0.2em;
}

.hero__line {
  width: 50px;
  height: 1px;
  background: rgba(255, 255, 255, 0.3);
}

.hero__title {
  margin-bottom: 1.5rem;
}

.hero__title-top {
  display: block;
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 0.5rem;
  font-weight: 400;
}

.hero__title-main {
  display: block;
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 800;
  line-height: 1.2;
}

.hero__desc {
  font-size: 1.125rem;
  color: rgba(255, 255, 255, 0.8);
  max-width: 600px;
  margin: 0 auto 2rem;
}

.hero__actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 3rem;
  flex-wrap: wrap;
}

.hero__stats {
  display: flex;
  gap: 3rem;
  justify-content: center;
  flex-wrap: wrap;
}

.hero__stat {
  text-align: center;
}

.hero__stat-num {
  display: block;
  font-size: 2.5rem;
  font-weight: 800;
  color: #C6922A;
  line-height: 1;
}

.hero__stat-label {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 0.25rem;
  display: block;
}

/* Sections */
.section {
  padding: 5rem 0;
}

.section__header {
  text-align: center;
  max-width: 600px;
  margin: 0 auto 3rem;
}

.section__header--row {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  text-align: left;
  max-width: none;
  margin-bottom: 2rem;
}

.section__title {
  font-size: clamp(1.75rem, 3vw, 2.25rem);
  font-weight: 800;
  margin-bottom: 0.75rem;
}

.section__title--dark {
  color: #1a1a1a;
}

.section__title--light {
  color: white;
}

.section__subtitle {
  font-size: 1.125rem;
}

.section__subtitle--dark {
  color: #53565A;
}

.section__subtitle--light {
  color: rgba(255, 255, 255, 0.8);
}

.section__footer {
  text-align: center;
  margin-top: 3rem;
}

/* News Section */
.section--news {
  background: #FAFAFA;
}

.news-grid {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: 1.2fr 1fr;
}

.news-side {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.news-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.news-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
}

.news-card--featured {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.news-card__image {
  position: relative;
  overflow: hidden;
}

.news-card--featured .news-card__image {
  aspect-ratio: 16/10;
}

.news-card--small .news-card__image {
  aspect-ratio: 16/9;
  width: 150px;
  min-width: 150px;
}

.news-card__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.news-card:hover .news-card__image img {
  transform: scale(1.05);
}

.news-card__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
}

.news-card__content {
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.news-card--small {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.news-card--small .news-card__content {
  padding: 1rem;
}

.news-card__cat {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: rgba(140, 21, 21, 0.1);
  color: #8C1515;
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  width: fit-content;
}

.news-card__title {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #1a1a1a;
  line-height: 1.3;
}

.news-card--small .news-card__title {
  font-size: 1rem;
  margin-bottom: 0.25rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.news-card__excerpt {
  color: #53565A;
  line-height: 1.6;
  margin-bottom: 1rem;
  flex: 1;
}

.news-card__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
  color: #767674;
}

.read-more {
  color: #8C1515;
  font-weight: 600;
}

/* Projects Section */
.section--projects {
  background: white;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.project-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  border: 1px solid #e5e5e5;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.project-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0,0,0,0.12);
}

.project-card__image {
  position: relative;
  aspect-ratio: 16/10;
  overflow: hidden;
}

.project-card__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.project-card:hover .project-card__image img {
  transform: scale(1.05);
}

.project-card__status {
  position: absolute;
  top: 1rem;
  left: 1rem;
  padding: 0.375rem 0.875rem;
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 700;
  color: white;
}

.project-card__status--completed {
  background: #38A169;
}

.project-card__status--ongoing {
  background: #C6922A;
}

.project-card__body {
  padding: 1.25rem;
}

.project-card__title {
  font-size: 1.125rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #1a1a1a;
}

.project-card__desc {
  color: #53565A;
  font-size: 0.9375rem;
  line-height: 1.5;
  margin-bottom: 1rem;
}

.project-card__tags {
  display: flex;
  gap: 0.5rem;
}

.project-tag {
  padding: 0.25rem 0.625rem;
  background: #F7F7F7;
  border-radius: 100px;
  font-size: 0.75rem;
  color: #53565A;
}

/* Videos Section */
.section--videos {
  background: linear-gradient(135deg, #1a1a1a 0%, #0D7377 100%);
  color: white;
}

.video-row {
  margin-bottom: 3rem;
}

.video-row__title {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: rgba(255, 255, 255, 0.9);
  border-right: 3px solid #C6922A;
  padding-right: 1rem;
}

.films-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.film-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.film-card:hover {
  transform: translateY(-4px);
  background: rgba(255, 255, 255, 0.1);
}

.film-card__thumb {
  position: relative;
  aspect-ratio: 16/9;
  overflow: hidden;
}

.film-card__thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.film-card__overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.4);
  transition: background 0.2s;
}

.film-card:hover .film-card__overlay {
  background: rgba(0,0,0,0.2);
}

.film-card__play {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #8C1515;
  opacity: 0;
  transition: opacity 0.2s, transform 0.2s;
}

.film-card:hover .film-card__play {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1.1);
}

.film-card__play svg {
  width: 24px;
  height: 24px;
  margin-left: 4px;
}

.film-card__duration {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  background: rgba(0,0,0,0.8);
  padding: 0.25rem 0.625rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
}

.film-card__info {
  padding: 1.25rem;
}

.film-card__title {
  font-size: 1.125rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.film-card__desc {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9375rem;
  line-height: 1.5;
}

.clips-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

.clip-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.clip-card:hover {
  transform: translateY(-4px);
}

.clip-card__thumb {
  position: relative;
  aspect-ratio: 16/9;
  overflow: hidden;
}

.clip-card__thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.clip-card__overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.3);
}

.clip-card__play {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 1.5rem;
  opacity: 0;
  transition: opacity 0.2s;
}

.clip-card:hover .clip-card__play {
  opacity: 1;
}

.clip-card__badge {
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  background: #C6922A;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.625rem;
  font-weight: 700;
}

.clip-card__title {
  padding: 0.75rem;
  font-weight: 600;
  font-size: 0.9375rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.clip-card__count {
  padding: 0 0.75rem 0.75rem;
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.6);
}

/* Sounds Section */
.section--sounds {
  background: #F7F9FC;
}

.sound-section {
  margin-bottom: 3rem;
}

.sound-section__title {
  font-size: 1.125rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #1a1a1a;
  border-right: 3px solid #8C1515;
  padding-right: 1rem;
}

.singles-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.single-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  border: 1px solid #e5e5e5;
}

.single-item:hover {
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

.single-item__num {
  font-size: 0.875rem;
  color: #8C1515;
  font-weight: 700;
  min-width: 2rem;
}

.single-item__img {
  width: 48px;
  height: 48px;
  border-radius: 4px;
  object-fit: cover;
}

.single-item__info {
  flex: 1;
  min-width: 0;
}

.single-item__title {
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.single-item__artist {
  font-size: 0.875rem;
  color: #53565A;
}

.single-item__visualizer {
  display: flex;
  gap: 3px;
  align-items: flex-end;
  height: 20px;
}

.single-item__visualizer span {
  width: 3px;
  background: #8C1515;
  border-radius: 2px;
  animation: equalizer 1s ease-in-out infinite;
  height: 40%;
}

.single-item:hover .single-item__visualizer span {
  animation-duration: 0.5s;
}

@keyframes equalizer {
  0%, 100% { height: 40%; }
  50% { height: 100%; }
}

.single-item__time {
  font-size: 0.875rem;
  color: #767674;
  font-weight: 500;
}

.albums-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.album-card {
  cursor: pointer;
}

.album-card__cover {
  position: relative;
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 1rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  transition: transform 0.2s;
}

.album-card:hover .album-card__cover {
  transform: translateY(-4px);
}

.album-card__cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.album-card__vinyl {
  position: absolute;
  top: 50%;
  right: -30%;
  transform: translateY(-50%);
  width: 70%;
  height: 70%;
  background: linear-gradient(135deg, #1a1a1a, #333);
  border-radius: 50%;
  opacity: 0;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(0,0,0,0.3);
}

.album-card:hover .album-card__vinyl {
  right: 10%;
  opacity: 1;
}

.album-card__play {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0.8);
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #8C1515;
  opacity: 0;
  transition: all 0.2s;
}

.album-card:hover .album-card__play {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1);
}

.album-card__play svg {
  width: 20px;
  height: 20px;
  margin-left: 2px;
}

.album-card__title {
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 0.25rem;
}

.album-card__count {
  font-size: 0.875rem;
  color: #53565A;
}

.album-card__badge {
  display: inline-block;
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: #C6922A;
  font-weight: 600;
}

/* Writings Section */
.section--writings {
  background: white;
}

.books-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
}

.book-card {
  cursor: pointer;
}

.book-card__cover {
  position: relative;
  aspect-ratio: 2/3;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 1rem;
  box-shadow: 
    -3px 0 0 rgba(0,0,0,0.1),
    3px 3px 10px rgba(0,0,0,0.2);
  transition: transform 0.3s;
  background: #f0f0f0;
}

.book-card:hover .book-card__cover {
  transform: translateY(-8px) rotateY(-3deg);
  box-shadow: 
    -5px 0 0 rgba(0,0,0,0.1),
    10px 10px 30px rgba(0,0,0,0.25);
}

.book-card__spine {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 12px;
  background: linear-gradient(to right, rgba(255,255,255,0.4), rgba(0,0,0,0.1));
  z-index: 2;
}

.book-card__cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.book-card__pages {
  position: absolute;
  right: 3px;
  top: 3px;
  bottom: 3px;
  width: 6px;
  background: linear-gradient(to right, #eee 0%, #ddd 50%, #eee 100%);
  background-size: 2px 100%;
}

.book-card__hover {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;
}

.book-card:hover .book-card__hover {
  opacity: 1;
}

.book-card__hover span {
  color: white;
  font-weight: 600;
  padding: 0.5rem 1rem;
  border: 2px solid white;
  border-radius: 4px;
}

.book-card__title {
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 0.25rem;
  font-size: 0.9375rem;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.book-card__author {
  font-size: 0.875rem;
  color: #53565A;
  margin-bottom: 0.25rem;
}

.book-card__pages-count {
  font-size: 0.75rem;
  color: #767674;
}

/* Images Section */
.section--images {
  background: linear-gradient(135deg, #2d3748 0%, #1a202c 100%);
  color: white;
}

.images-row {
  margin-bottom: 3rem;
}

.images-row__title {
  font-size: 1.125rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: rgba(255, 255, 255, 0.9);
  border-right: 3px solid #C6922A;
  padding-right: 1rem;
}

.masonry-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: 250px;
  gap: 1rem;
}

.masonry-item {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
}

.masonry-item--large {
  grid-row: span 2;
  grid-column: span 2;
}

.masonry-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.masonry-item:hover img {
  transform: scale(1.05);
}

.masonry-item figcaption {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1.5rem 1rem 1rem;
  background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
  color: white;
}

.masonry-item h4 {
  font-weight: 600;
  font-size: 1rem;
}

.galleries-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.gallery-card {
  cursor: pointer;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: transform 0.2s;
}

.gallery-card:hover {
  transform: translateY(-4px);
  background: rgba(255, 255, 255, 0.1);
}

.gallery-card__thumb {
  position: relative;
  aspect-ratio: 16/10;
  overflow: hidden;
}

.gallery-card__thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.gallery-card__count {
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  background: rgba(0,0,0,0.8);
  color: white;
  padding: 0.375rem 0.75rem;
  border-radius: 100px;
  font-size: 0.8125rem;
  font-weight: 600;
}

.gallery-card__title {
  padding: 1rem;
  font-weight: 600;
  color: white;
}

/* Memories Section */
.section--memories {
  background: linear-gradient(135deg, #1a1a1a 0%, #2d1818 100%);
  color: white;
}

.memories-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.memory-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.memory-card:hover {
  transform: translateY(-8px);
  background: rgba(255, 255, 255, 0.1);
}

.memory-card__thumb {
  position: relative;
  aspect-ratio: 4/3;
  overflow: hidden;
}

.memory-card__thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.memory-card__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.8), transparent 60%);
}

.memory-card__type {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: rgba(0,0,0,0.6);
  backdrop-filter: blur(10px);
  padding: 0.375rem 0.875rem;
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 600;
}

.memory-card__star {
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 1.25rem;
}

.memory-card__content {
  padding: 1.25rem;
}

.memory-card__title {
  font-weight: 700;
  margin-bottom: 0.25rem;
  font-size: 1.125rem;
}

.memory-card__desc {
  font-size: 0.9375rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 0.75rem;
  line-height: 1.5;
}

.memory-card__meta {
  display: flex;
  gap: 1rem;
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.6);
}

/* Donate Section */
.section--donate {
  background: #FAFAFA;
  padding: 3rem 0;
}

.donate-card {
  background: white;
  border-radius: 16px;
  padding: 3rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  align-items: center;
}

.donate-badge {
  display: inline-block;
  color: #8C1515;
  font-weight: 700;
  font-size: 0.9375rem;
  margin-bottom: 1rem;
}

.donate-title {
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 1rem;
  color: #1a1a1a;
  line-height: 1.3;
}

.donate-text {
  color: #53565A;
  font-size: 1.125rem;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.donate-features {
  margin-bottom: 2rem;
}

.donate-feature {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  color: #1a1a1a;
}

.donate-check {
  width: 24px;
  height: 24px;
  background: rgba(140, 21, 21, 0.1);
  color: #8C1515;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.75rem;
  flex-shrink: 0;
}

.donate-amounts {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 2rem;
}

.amount-btn {
  padding: 0.75rem 1.5rem;
  border: 2px solid #e5e5e5;
  background: white;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.amount-btn:hover {
  border-color: #8C1515;
  color: #8C1515;
}

.amount-btn--active {
  background: #8C1515;
  border-color: #8C1515;
  color: white;
}

.donate-actions {
  display: flex;
  gap: 1rem;
}

.donate-visual {
  display: flex;
  align-items: center;
  justify-content: center;
}

.impact-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  width: 100%;
}

.impact-item {
  background: #F7F7F7;
  padding: 1.5rem;
  border-radius: 12px;
  text-align: center;
}

.impact-num {
  display: block;
  font-size: 2rem;
  font-weight: 800;
  color: #8C1515;
  line-height: 1;
}

.impact-label {
  font-size: 0.875rem;
  color: #53565A;
  margin-top: 0.25rem;
  display: block;
}

.impact-item--gold .impact-num {
  color: #C6922A;
}

/* Photo Stories */
.stories-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.story-card {
  cursor: pointer;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.story-card:hover {
  transform: translateY(-4px);
  background: rgba(255, 255, 255, 0.1);
}

.story-card__thumb {
  position: relative;
  aspect-ratio: 16/10;
  overflow: hidden;
}

.story-card__thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.story-card:hover .story-card__thumb img {
  transform: scale(1.05);
}

.story-card__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.7), transparent 60%);
}

.story-card__badge {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  background: rgba(198, 146, 42, 0.9);
  color: white;
  padding: 0.25rem 0.625rem;
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 700;
  backdrop-filter: blur(4px);
}

.story-card__count {
  position: absolute;
  bottom: 0.75rem;
  right: 0.75rem;
  background: rgba(0,0,0,0.7);
  color: white;
  padding: 0.25rem 0.625rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
}

.story-card__info {
  padding: 1rem;
}

.story-card__title {
  font-weight: 700;
  color: white;
  margin-bottom: 0.375rem;
  font-size: 1rem;
}

.story-card__desc {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.5;
}

/* Writing Category Chips */
.writing-cats {
  margin-top: 2rem;
}

.writing-cats__row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.625rem;
  justify-content: center;
}

.writing-cat-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #f7f7f7;
  border: 1px solid #e5e5e5;
  border-radius: 100px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.writing-cat-chip:hover {
  background: #8C1515;
  color: white;
  border-color: #8C1515;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(140, 21, 21, 0.2);
}

.writing-cat-chip__icon {
  font-size: 1rem;
}

.writing-cat-chip__label {
  font-weight: 600;
}

.writing-cat-chip__count {
  background: rgba(0,0,0,0.06);
  padding: 0.125rem 0.5rem;
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 700;
}

.writing-cat-chip:hover .writing-cat-chip__count {
  background: rgba(255,255,255,0.2);
}

/* Book Card Category Badge */
.book-card__category {
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  background: rgba(140, 21, 21, 0.9);
  color: white;
  padding: 0.25rem 0.625rem;
  border-radius: 4px;
  font-size: 0.625rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  z-index: 3;
}

.book-card__meta-row {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  flex-wrap: wrap;
}

.book-card__topic-chip {
  font-size: 0.6875rem;
  background: rgba(140, 21, 21, 0.08);
  color: #8C1515;
  padding: 0.125rem 0.5rem;
  border-radius: 100px;
  font-weight: 600;
}

/* Loading */
.loading-grid {
  display: grid;
  gap: 1.5rem;
}

.loading-grid--3 {
  grid-template-columns: repeat(3, 1fr);
}

.loading-grid--4 {
  grid-template-columns: repeat(4, 1fr);
}

.loading-card {
  background: #e5e5e5;
  border-radius: 12px;
  height: 200px;
  animation: pulse 2s infinite;
}

.loading-card--tall {
  height: 300px;
}

.loading-card--video {
  aspect-ratio: 16/9;
}

.loading-card--sound {
  height: 80px;
}

.loading-card--book {
  aspect-ratio: 2/3;
}

.loading-card--image {
  aspect-ratio: 1;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 4rem;
  color: #767674;
}

.empty-icon {
  font-size: 3rem;
  display: block;
  margin-bottom: 1rem;
  opacity: 0.5;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.8);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.modal {
  background: white;
  border-radius: 12px;
  max-width: 700px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}

.modal__close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 40px;
  height: 40px;
  background: rgba(0,0,0,0.5);
  border: none;
  border-radius: 50%;
  color: white;
  font-size: 1.25rem;
  cursor: pointer;
  z-index: 10;
}

.modal__image {
  aspect-ratio: 16/9;
  overflow: hidden;
}

.modal__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.modal__content {
  padding: 2rem;
}

.modal__cat {
  display: inline-block;
  padding: 0.375rem 0.875rem;
  background: rgba(140, 21, 21, 0.1);
  color: #8C1515;
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.modal__title {
  font-size: 1.5rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  color: #1a1a1a;
}

.modal__date {
  display: block;
  color: #767674;
  margin-bottom: 1rem;
}

.modal__desc {
  color: #53565A;
  line-height: 1.7;
}

/* Lightbox */
.lightbox {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.95);
  z-index: 1001;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.lightbox img {
  max-width: 100%;
  max-height: 90vh;
  object-fit: contain;
}

.lightbox__close {
  position: absolute;
  top: 2rem;
  right: 2rem;
  width: 48px;
  height: 48px;
  background: rgba(255,255,255,0.1);
  border: none;
  border-radius: 50%;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
}

/* Transitions */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* Responsive */
@media (max-width: 1024px) {
  .news-grid {
    grid-template-columns: 1fr;
  }
  
  .news-side {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }
  
  .projects-grid,
  .books-grid,
  .memories-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .films-grid,
  .masonry-grid {
    grid-template-columns: 1fr;
  }
  
  .masonry-item--large {
    grid-column: span 1;
    grid-row: span 1;
  }
  
  .clips-grid,
  .albums-grid,
  .galleries-grid,
  .stories-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .donate-card {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .hero__title-main {
    font-size: 1.75rem;
  }
  
  .section__header--row {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .news-side,
  .projects-grid,
  .clips-grid,
  .albums-grid,
  .books-grid,
  .galleries-grid,
  .memories-grid,
  .loading-grid--3,
  .loading-grid--4 {
    grid-template-columns: 1fr;
  }
  
  .films-grid {
    grid-template-columns: 1fr;
  }
  
  .donate-card {
    padding: 1.5rem;
  }
  
  .donate-amounts {
    flex-wrap: wrap;
  }
}
</style>