<template>
  <div class="sr-page" :dir="lang.dir" :class="{ 'sr-page--ltr': lang.activeLang === 'KMR' }">

    <!-- ══════════════════════════════════
         HERO SEARCH BAR
    ══════════════════════════════════ -->
    <section class="sr-hero">
      <div class="sr-hero__mesh"></div>
      <div class="sr-hero__glow"></div>
      <div class="sr-hero__noise"></div>
      <div class="container sr-hero__inner">
        <div class="sr-hero__eyebrow">
          <router-link to="/" class="sr-breadcrumb">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            {{ lbl('home') }}
          </router-link>
          <span class="sr-breadcrumb__sep">
            <svg width="5" height="8" viewBox="0 0 5 8" fill="none"><path d="M1 1l3 3-3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </span>
          <span class="sr-breadcrumb__cur">{{ lbl('searchResults') }}</span>
        </div>

        <h1 class="sr-hero__title">
          <span class="sr-hero__title-line">{{ lbl('heroTitle') }}</span>
        </h1>

        <div class="sr-search-form">
          <div class="sr-search-input-wrap">
            <svg class="sr-search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input
              ref="searchInputRef"
              v-model="localQuery"
              class="sr-search-input"
              type="text"
              :placeholder="lbl('placeholder')"
              @keyup.enter="doSearch"
              @input="onLiveInput"
            />
            <button v-if="localQuery" class="sr-search-clear" @click="clearQuery" :aria-label="lbl('clear')">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
          </div>
          <button class="sr-search-btn" @click="doSearch" :disabled="isLoading">
            <span v-if="!isLoading">{{ lbl('search') }}</span>
            <span v-else class="sr-btn-spinner"></span>
          </button>
        </div>

        <!-- Type-filter chips in hero -->
        <div class="sr-hero__type-filters">
          <span class="sr-hero__type-filters-label">{{ lbl('searchIn') }}</span>
          <div class="sr-hero__type-chips">
            <button
              v-for="tf in typeFilters"
              :key="tf.key"
              class="sr-hero__chip"
              :class="{ 'sr-hero__chip--on': activeTypes.includes(tf.key) }"
              @click="toggleType(tf.key)"
              :aria-pressed="activeTypes.includes(tf.key)"
            >
              <span class="sr-hero__chip-indicator"></span>
              <span class="sr-hero__chip-label">{{ tf.label }}</span>
              <span class="sr-hero__chip-count" v-if="currentQuery">{{ getTypeCount(tf.key) }}</span>
            </button>
            <button
              class="sr-hero__chip-all"
              @click="selectAllTypes"
              v-if="activeTypes.length < typeFilters.length"
            >{{ lbl('selectAll') }}</button>
          </div>
        </div>

        <div class="sr-hero__meta" v-if="currentQuery">
          <span class="sr-meta__query">
            {{ lbl('resultsFor') }} <em>"{{ currentQuery }}"</em>
          </span>
          <span class="sr-meta__divider"></span>
          <span class="sr-meta__count">
            <strong>{{ totalResults.toLocaleString() }}</strong> {{ lbl('results') }}
          </span>
          <span class="sr-meta__divider" v-if="searchDuration"></span>
          <span class="sr-meta__time" v-if="searchDuration">{{ searchDuration }}ms</span>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════
         ACTIVE TAG PILLS
    ══════════════════════════════════ -->
    <div class="sr-active-filters" v-if="selectedTags.length || activeTypes.length < typeFilters.length">
      <div class="container sr-active-filters__inner">
        <span class="sr-af__label">{{ lbl('activeFilters') }}</span>
        <div class="sr-af__pills">
          <span
            v-for="t in typeFilters.filter(f => !activeTypes.includes(f.key))"
            :key="`hidden-${t.key}`"
            class="sr-af__pill sr-af__pill--type"
          >
            {{ t.label }}
            <button @click="restoreType(t.key)" aria-label="Remove">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
          </span>
          <span
            v-for="tag in selectedTags"
            :key="`tag-${tag}`"
            class="sr-af__pill sr-af__pill--tag"
          >
            {{ tag }}
            <button @click="removeTag(tag)" aria-label="Remove">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
          </span>
        </div>
        <button class="sr-af__reset" @click="resetAllFilters">{{ lbl('resetAll') }}</button>
      </div>
    </div>

    <!-- ══════════════════════════════════
         MAIN BODY
    ══════════════════════════════════ -->
    <div class="sr-body container">

      <!-- ── SIDEBAR FILTERS ── -->
      <aside class="sr-sidebar">
        <div class="sr-sidebar__panel">
          <div class="sr-sidebar__header">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
            {{ lbl('filters') }}
            <button class="sr-sidebar__reset" @click="resetAllFilters" v-if="hasActiveFilters">{{ lbl('reset') }}</button>
          </div>

          <!-- ── Type Checkboxes ── -->
          <div class="sr-filter-group">
            <h3 class="sr-filter-group__title">{{ lbl('contentType') }}</h3>
            <div class="sr-filter-group__items">
              <label
                v-for="tf in typeFilters"
                :key="tf.key"
                class="sr-checkbox-label"
                :class="{ 'sr-checkbox-label--checked': activeTypes.includes(tf.key) }"
              >
                <input
                  type="checkbox"
                  class="sr-checkbox-native"
                  :checked="activeTypes.includes(tf.key)"
                  @change="toggleType(tf.key)"
                />
                <span class="sr-checkbox-box">
                  <svg class="sr-checkbox-tick" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5"><polyline points="20 6 9 17 4 12"/></svg>
                </span>
                <span class="sr-checkbox-dot" :style="{ background: tf.color }"></span>
                <span class="sr-checkbox-text">{{ tf.label }}</span>
                <span class="sr-checkbox-count" :class="{ 'sr-checkbox-count--active': activeTypes.includes(tf.key) }">
                  {{ getTypeCount(tf.key) }}
                </span>
              </label>
            </div>
          </div>

          <!-- ── Tag Checkboxes ── -->
          <div class="sr-filter-group sr-filter-group--tags" v-if="availableTags.length">
            <h3 class="sr-filter-group__title">
              {{ lbl('filterByTag') }}
              <span class="sr-filter-tag-count">{{ availableTags.length }}</span>
            </h3>
            <div class="sr-tag-search">
              <input
                v-model="tagSearchQuery"
                class="sr-tag-search__input"
                type="text"
                :placeholder="lbl('searchTags')"
              />
            </div>
            <div class="sr-filter-group__items sr-filter-group__items--tags">
              <label
                v-for="tag in visibleTags"
                :key="`tag-${tag}`"
                class="sr-checkbox-label sr-checkbox-label--tag"
                :class="{ 'sr-checkbox-label--checked': selectedTags.includes(tag) }"
              >
                <input
                  type="checkbox"
                  class="sr-checkbox-native"
                  :checked="selectedTags.includes(tag)"
                  @change="toggleTag(tag)"
                />
                <span class="sr-checkbox-box sr-checkbox-box--sm">
                  <svg class="sr-checkbox-tick" width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5"><polyline points="20 6 9 17 4 12"/></svg>
                </span>
                <span class="sr-checkbox-text sr-checkbox-text--tag">#{{ tag }}</span>
              </label>
              <div v-if="!visibleTags.length && tagSearchQuery" class="sr-filter-no-tags">
                {{ lbl('noTagsFound') }}
              </div>
            </div>
            <button
              v-if="filteredAvailableTags.length > tagShowLimit"
              class="sr-filter-show-more"
              @click="showAllTags = !showAllTags"
            >
              {{ showAllTags ? lbl('showLess') : `+ ${filteredAvailableTags.length - tagShowLimit} ${lbl('more')}` }}
            </button>
          </div>
        </div>
      </aside>

      <!-- ── MAIN RESULTS ── -->
      <main class="sr-main">

        <!-- No query state -->
        <div v-if="!currentQuery && !isLoading" class="sr-no-query">
          <div class="sr-no-query__icon">
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </div>
          <h2 class="sr-no-query__title">{{ lbl('startSearching') }}</h2>
          <p class="sr-no-query__hint">{{ lbl('startSearchingHint') }}</p>
          <div class="sr-quick-tags" v-if="availableTags.length">
            <span class="sr-quick-tags__label">{{ lbl('popularTags') }}</span>
            <div class="sr-quick-tags__list">
              <button
                v-for="tag in availableTags.slice(0, 8)"
                :key="`quick-${tag}`"
                class="sr-quick-tag"
                @click="searchByTag(tag)"
              >{{ tag }}</button>
            </div>
          </div>
        </div>

        <!-- Loading Skeletons -->
        <template v-else-if="isLoading">
          <div v-for="i in 3" :key="`sec-sk-${i}`" class="sr-section">
            <div class="sr-section__header">
              <div class="sk-line sk-line--sm" style="width: 120px;"></div>
              <div class="sk-line sk-line--sm" style="width: 50px;"></div>
            </div>
            <div class="sr-results-grid">
              <div v-for="j in 3" :key="`card-sk-${j}`" class="sr-card sr-card--sk">
                <div class="sr-card__img-wrap sk-block"></div>
                <div class="sr-card__body">
                  <div class="sk-line" style="width: 40%; margin-bottom: 10px;"></div>
                  <div class="sk-line" style="width: 90%; margin-bottom: 6px;"></div>
                  <div class="sk-line" style="width: 70%;"></div>
                </div>
              </div>
            </div>
          </div>
        </template>

        <!-- Results -->
        <template v-else-if="currentQuery">
          <!-- Sort + Summary Bar -->
          <div class="sr-results-bar" v-if="totalResults > 0">
            <span class="sr-results-bar__summary">
              {{ totalResults }} {{ lbl('results') }}
            </span>
            <div class="sr-sort">
              <select v-model="sortBy" class="sr-sort__sel">
                <option value="relevance">{{ lbl('sortRelevance') }}</option>
                <option value="newest">{{ lbl('sortNewest') }}</option>
                <option value="oldest">{{ lbl('sortOldest') }}</option>
              </select>
              <svg class="sr-sort__ico" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
          </div>

          <!-- Sections -->
          <div
            v-for="section in visibleSections"
            :key="section.key"
            class="sr-section"
            :class="{ 'sr-section--empty': !section.items.length }"
          >
            <div class="sr-section__header" v-if="!isSingleType">
              <div class="sr-section__title-wrap">
                <span class="sr-section__dot" :style="{ background: section.color }"></span>
                <h2 class="sr-section__title">{{ section.label }}</h2>
              </div>
              <div class="sr-section__meta">
                <span class="sr-section__count">{{ section.totalElements }}</span>
                <button
                  v-if="section.totalElements > pageSize"
                  class="sr-section__more"
                  @click="focusType(section.key)"
                >
                  {{ lbl('seeAll') }}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </button>
              </div>
            </div>

            <!-- No items in this section -->
            <div class="sr-section__no-results" v-if="!section.items.length">
              <span class="sr-section__no-dot" :style="{ background: section.color }"></span>
              <span>{{ lbl('noResultsInType') }} {{ section.label }}</span>
            </div>

            <div v-else class="sr-results-grid">
              <article
                v-for="item in sortedItems(section.items)"
                :key="`${section.key}-${item.id}`"
                class="sr-card"
                :class="`sr-card--${section.key.toLowerCase()}`"
                tabindex="0"
                @click="navigateToItem(item, section.key)"
                @keyup.enter="navigateToItem(item, section.key)"
              >
                <div class="sr-card__img-wrap">
                  <img
                    :src="item.coverUrl || fallbackImg"
                    :alt="getTitle(item)"
                    class="sr-card__img"
                    loading="lazy"
                    @error="onImgError"
                  />
                  <div class="sr-card__img-overlay"></div>
                  <span class="sr-card__type-badge" :style="{ '--badge-color': section.color }">{{ section.label }}</span>
                  <div class="sr-card__hover-cta">
                    <span>{{ lbl('view') }}</span>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </div>
                </div>
                <div class="sr-card__body">
                  <div class="sr-card__meta">
                    <span class="sr-card__type-label" :style="{ '--type-color': section.color }">{{ section.label }}</span>
                    <span class="sr-card__date" v-if="item.createdAt">{{ formatDate(item.createdAt) }}</span>
                  </div>
                  <h3 class="sr-card__title">
                    <span v-html="highlight(getTitle(item))"></span>
                  </h3>
                  <p class="sr-card__desc">
                    <span v-html="highlight(getDesc(item))"></span>
                  </p>
                </div>
                <div class="sr-card__accent" :style="{ background: section.color }"></div>
              </article>
            </div>

            <!-- Per-section pagination (only when viewing single type) -->
            <div class="sr-pager" v-if="isSingleType && section.totalPages > 1">
              <button class="sr-pager__btn" :disabled="sectionPages[section.key] <= 0" @click="prevPage(section.key)">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                {{ lbl('prev') }}
              </button>
              <div class="sr-pager__dots">
                <button
                  v-for="p in Math.min(section.totalPages, 7)"
                  :key="p"
                  class="sr-pager__dot"
                  :class="{ 'sr-pager__dot--on': (sectionPages[section.key] || 0) === p - 1 }"
                  @click="goToPage(section.key, p - 1)"
                ></button>
              </div>
              <span class="sr-pager__info">
                {{ (sectionPages[section.key] || 0) + 1 }} / {{ section.totalPages }}
              </span>
              <button class="sr-pager__btn" :disabled="(sectionPages[section.key] || 0) >= section.totalPages - 1" @click="nextPage(section.key)">
                {{ lbl('next') }}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
            </div>
          </div>

          <!-- Totally empty -->
          <div class="sr-empty" v-if="totalResults === 0">
            <div class="sr-empty__illustration">
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                <circle cx="34" cy="34" r="22" stroke="var(--accent)" stroke-width="2.5" stroke-dasharray="6 4" opacity=".35"/>
                <line x1="50" y1="50" x2="66" y2="66" stroke="var(--accent)" stroke-width="3" stroke-linecap="round" opacity=".25"/>
                <circle cx="34" cy="34" r="8" stroke="var(--accent)" stroke-width="1.5" opacity=".2"/>
              </svg>
            </div>
            <h2 class="sr-empty__title">{{ lbl('noResults') }}</h2>
            <p class="sr-empty__hint">{{ lbl('noResultsHint') }}</p>
            <div class="sr-empty__actions">
              <button class="sr-empty__btn" @click="resetAllFilters">{{ lbl('clearFilters') }}</button>
              <router-link to="/archive" class="sr-empty__link">{{ lbl('browseArchive') }}</router-link>
            </div>
          </div>
        </template>

      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { API_BASE_URL } from '@/components/consts.js'
import { useLanguageStore } from '@/stores/useLanguageStore'

const route  = useRoute()
const router = useRouter()
const lang   = useLanguageStore()

const api = axios.create({ baseURL: API_BASE_URL, timeout: 15000 })

// ── i18n ────────────────────────────────────────────────────────
const i18n = {
  CKB: {
    home: 'سەرەکی', searchResults: 'ئەنجامەکانی گەڕان',
    heroTitle: 'گەڕان لە ناو ئەرشیڤدا',
    placeholder: 'گەڕان بکە لە نووسین، دەنگ، ڤیدیۆ...',
    search: 'گەڕان', clear: 'سڕینەوە',
    resultsFor: 'ئەنجامی گەڕانی', results: 'ئەنجام',
    filters: 'فیلتەر', reset: 'سیفر', resetAll: 'هەموو سیفر',
    contentType: 'جۆری ناوەڕۆک',
    filterByTag: 'فیلتەر بە تاگ', searchTags: 'گەڕان لە تاگەکان...',
    activeFilters: 'فیلتەری چالاک',
    noTagsFound: 'تاگێک نەدۆزرایەوە',
    showLess: 'کەمتر پیشان بدە', more: 'زیاتر',
    startSearching: 'گەڕانت دەست پێبکە',
    startSearchingHint: 'بنووسە بۆ گەڕان لە هەموو ناوەڕۆکەکان',
    popularTags: 'تاگە بەناوەکان',
    sortRelevance: 'پەیوەندی', sortNewest: 'نوێترین', sortOldest: 'کۆنترین',
    noResultsInType: 'هیچ ئەنجامێک نییە لە',
    seeAll: 'هەموو ببینە',
    view: 'بینین',
    prev: 'پێشتر', next: 'دواتر',
    noResults: 'هیچ ئەنجامێک نەدۆزرایەوە',
    noResultsHint: 'بکۆشە فیلتەر بگۆڕیت یان وشەیەکی تر بنووسی',
    clearFilters: 'فیلتەر پاک بکەرەوە',
    browseArchive: 'بگەڕێ لە ئەرشیڤ',
    searchIn: 'گەڕان لە',
    selectAll: 'هەموو هەڵبژێرە',
    project: 'پڕۆژەکان', news: 'هەواڵەکان', video: 'ڤیدیۆکان',
    writing: 'نووسینەکان', soundtrack: 'دەنگەکان', image: 'وێنەکان',
  },
  KMR: {
    home: 'Mal', searchResults: 'Encamên Lêgerînê',
    heroTitle: 'Di Arşîvê de Bigere',
    placeholder: 'Di nivîsar, deng, vîdyo de bigere...',
    search: 'Bigere', clear: 'Paqij bike',
    resultsFor: 'Encamên', results: 'Encam',
    filters: 'Fîlter', reset: 'Sifir', resetAll: 'Hemû sifir',
    contentType: 'Cûreyê Naverokê',
    filterByTag: 'Bi etîketê fîlter bike', searchTags: 'Di etîketan de bigere...',
    activeFilters: 'Fîlterên çalak',
    noTagsFound: 'Etîket nehat dîtin',
    showLess: 'Kêmtir nîşan bide', more: 'zêdetir',
    startSearching: 'Lêgerîna xwe dest pê bike',
    startSearchingHint: 'Ji bo lêgerînê binivîse',
    popularTags: 'Etîketên populer',
    sortRelevance: 'Girêdayîbûn', sortNewest: 'Herî nû', sortOldest: 'Herî kevn',
    noResultsInType: 'Di de encam tuneye',
    seeAll: 'Hemû bibîne',
    view: 'Bibîne',
    prev: 'Berî', next: 'Paş',
    noResults: 'Encam nehat dîtin',
    noResultsHint: 'Fîlteran biguherîne an peyveke din binivîse',
    clearFilters: 'Fîlteran paqij bike',
    browseArchive: 'Arşîvê bigere',
    searchIn: 'Di de bigere',
    selectAll: 'Hemûyan hilbijêre',
    project: 'Proje', news: 'Nûçe', video: 'Vîdyo',
    writing: 'Nivîsar', soundtrack: 'Deng', image: 'Wêne',
  }
}
function lbl(key) {
  const al = lang?.activeLang || 'CKB'
  return i18n[al]?.[key] || i18n['CKB']?.[key] || key
}

// ── Fallback image ────────────────────────────────────────────
const fallbackImg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='280' viewBox='0 0 400 280'%3E%3Crect width='400' height='280' fill='%23181820'/%3E%3Crect x='160' y='90' width='80' height='65' rx='8' fill='%2323232e'/%3E%3Ccircle cx='185' cy='113' r='10' fill='%232d2d3a'/%3E%3Cpolygon points='160,155 200,120 230,143 260,120 280,155' fill='%232d2d3a'/%3E%3C/svg%3E"

// ── State ─────────────────────────────────────────────────────
const localQuery     = ref('')
const currentQuery   = ref('')
const isLoading      = ref(false)
const searchDuration = ref(null)
const sortBy         = ref('relevance')
const tagSearchQuery = ref('')
const showAllTags    = ref(false)
const tagShowLimit   = 12
const searchInputRef = ref(null)

const results = reactive({
  projects:         { items: [], totalElements: 0, totalPages: 0, currentPage: 0 },
  news:             { items: [], totalElements: 0, totalPages: 0, currentPage: 0 },
  videos:           { items: [], totalElements: 0, totalPages: 0, currentPage: 0 },
  writings:         { items: [], totalElements: 0, totalPages: 0, currentPage: 0 },
  soundTracks:      { items: [], totalElements: 0, totalPages: 0, currentPage: 0 },
  imageCollections: { items: [], totalElements: 0, totalPages: 0, currentPage: 0 },
})

const sectionPages = reactive({
  PROJECT: 0, NEWS: 0, VIDEO: 0, WRITING: 0, SOUNDTRACK: 0, IMAGE: 0
})

const activeTypes = ref(['PROJECT', 'NEWS', 'VIDEO', 'WRITING', 'SOUNDTRACK', 'IMAGE'])
const allTagsPool  = ref([])
const selectedTags = ref([])
const pageSize = 10

// ── Section definitions (NO emoji icons) ─────────────────────
const typeFilters = computed(() => [
  { key: 'PROJECT',    label: lbl('project'),    color: '#3b82f6' },
  { key: 'NEWS',       label: lbl('news'),       color: '#ef4444' },
  { key: 'VIDEO',      label: lbl('video'),      color: '#8b5cf6' },
  { key: 'WRITING',    label: lbl('writing'),    color: '#f59e0b' },
  { key: 'SOUNDTRACK', label: lbl('soundtrack'), color: '#10b981' },
  { key: 'IMAGE',      label: lbl('image'),      color: '#ec4899' },
])

const sectionMap = computed(() => ({
  PROJECT:    { ...typeFilters.value.find(t => t.key === 'PROJECT'),    items: results.projects.items,         totalElements: results.projects.totalElements,         totalPages: results.projects.totalPages },
  NEWS:       { ...typeFilters.value.find(t => t.key === 'NEWS'),       items: results.news.items,              totalElements: results.news.totalElements,              totalPages: results.news.totalPages },
  VIDEO:      { ...typeFilters.value.find(t => t.key === 'VIDEO'),      items: results.videos.items,            totalElements: results.videos.totalElements,            totalPages: results.videos.totalPages },
  WRITING:    { ...typeFilters.value.find(t => t.key === 'WRITING'),    items: results.writings.items,          totalElements: results.writings.totalElements,          totalPages: results.writings.totalPages },
  SOUNDTRACK: { ...typeFilters.value.find(t => t.key === 'SOUNDTRACK'), items: results.soundTracks.items,       totalElements: results.soundTracks.totalElements,       totalPages: results.soundTracks.totalPages },
  IMAGE:      { ...typeFilters.value.find(t => t.key === 'IMAGE'),      items: results.imageCollections.items,  totalElements: results.imageCollections.totalElements,  totalPages: results.imageCollections.totalPages },
}))

const visibleSections = computed(() =>
  activeTypes.value.map(k => sectionMap.value[k]).filter(Boolean)
)
const isSingleType = computed(() => activeTypes.value.length === 1)
const totalResults = computed(() =>
  activeTypes.value.reduce((sum, k) => sum + getTypeCount(k), 0)
)
const hasActiveFilters = computed(() =>
  selectedTags.value.length > 0 || activeTypes.value.length < 6
)

// ── Tags ─────────────────────────────────────────────────────
const availableTags = computed(() => allTagsPool.value)
const filteredAvailableTags = computed(() => {
  if (!tagSearchQuery.value) return availableTags.value
  const q = tagSearchQuery.value.toLowerCase()
  return availableTags.value.filter(t => t.toLowerCase().includes(q))
})
const visibleTags = computed(() =>
  showAllTags.value
    ? filteredAvailableTags.value
    : filteredAvailableTags.value.slice(0, tagShowLimit)
)

// ── Helpers ───────────────────────────────────────────────────
function getTitle(item) {
  const c = lang.activeLang === 'CKB'
  return (c ? item.titleCkb : item.titleKmr) || (c ? item.titleKmr : item.titleCkb) || ''
}
function getDesc(item) {
  const c = lang.activeLang === 'CKB'
  return (c ? item.descriptionCkb : item.descriptionKmr) || (c ? item.descriptionKmr : item.descriptionCkb) || ''
}
function getTypeCount(typeKey) {
  const map = {
    PROJECT:    results.projects.totalElements,
    NEWS:       results.news.totalElements,
    VIDEO:      results.videos.totalElements,
    WRITING:    results.writings.totalElements,
    SOUNDTRACK: results.soundTracks.totalElements,
    IMAGE:      results.imageCollections.totalElements,
  }
  return map[typeKey] || 0
}
function formatDate(v) {
  if (!v) return ''
  try {
    return new Date(v).toLocaleDateString(
      lang.activeLang === 'CKB' ? 'ar' : 'ku',
      { year: 'numeric', month: 'short', day: 'numeric' }
    )
  } catch { return '' }
}
function onImgError(e) { e.target.src = fallbackImg }
function highlight(text) {
  if (!currentQuery.value || !text) return text
  const escaped = currentQuery.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return text.replace(new RegExp(`(${escaped})`, 'gi'), '<mark class="sr-highlight">$1</mark>')
}
function sortedItems(items) {
  if (sortBy.value === 'newest') return [...items].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  if (sortBy.value === 'oldest') return [...items].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
  return items
}

// ── Navigate ─────────────────────────────────────────────────
function navigateToItem(item, sectionKey) {
  const type = item.type || sectionKey
  const id   = item.id
  const typeToPublishmentsTab = {
    VIDEO: 'video', WRITING: 'writing', SOUNDTRACK: 'sound', IMAGE: 'image',
  }
  if (type === 'PROJECT') router.push({ path: '/projects', query: { id } })
  else if (type === 'NEWS') router.push({ path: '/news', query: { id } })
  else if (typeToPublishmentsTab[type]) router.push({ path: '/publishments', query: { type: typeToPublishmentsTab[type], id } })
  else router.push('/')
}

// ── Search ────────────────────────────────────────────────────
async function fetchSection(type, page = 0) {
  const q = buildEffectiveQuery()
  if (!q) return
  try {
    const { data } = await api.get('/search', { params: { q, type, page, size: pageSize } })
    const d = data?.data
    if (!d) return
    const section = d[sectionApiKey(type)]
    if (!section) return
    switch (type) {
      case 'PROJECT':    Object.assign(results.projects, section);         break
      case 'NEWS':       Object.assign(results.news, section);             break
      case 'VIDEO':      Object.assign(results.videos, section);           break
      case 'WRITING':    Object.assign(results.writings, section);         break
      case 'SOUNDTRACK': Object.assign(results.soundTracks, section);      break
      case 'IMAGE':      Object.assign(results.imageCollections, section); break
    }
  } catch (e) { console.warn(`Search [${type}]:`, e.message) }
}
function sectionApiKey(type) {
  return {
    PROJECT: 'projects', NEWS: 'news', VIDEO: 'videos',
    WRITING: 'writings', SOUNDTRACK: 'soundTracks', IMAGE: 'imageCollections'
  }[type]
}
function buildEffectiveQuery() {
  const parts = []
  if (currentQuery.value) parts.push(currentQuery.value)
  if (selectedTags.value.length) parts.push(...selectedTags.value)
  return parts.join(' ')
}
async function doSearch() {
  const q = localQuery.value.trim()
  if (!q && !selectedTags.value.length) return
  currentQuery.value = q
  router.replace({ path: '/search', query: { q: q || undefined } })
  await runSearch()
}
async function runSearch() {
  if (!buildEffectiveQuery()) return
  isLoading.value = true
  searchDuration.value = null
  resetResults()
  const t0 = performance.now()
  await Promise.allSettled(
    activeTypes.value.map(type => fetchSection(type, sectionPages[type] || 0))
  )
  searchDuration.value = Math.round(performance.now() - t0)
  isLoading.value = false
}
function resetResults() {
  ;['projects','news','videos','writings','soundTracks','imageCollections'].forEach(k => {
    Object.assign(results[k], { items: [], totalElements: 0, totalPages: 0, currentPage: 0 })
  })
}
let liveTimer = null
function onLiveInput() {
  clearTimeout(liveTimer)
  liveTimer = setTimeout(() => {
    if (localQuery.value.trim().length >= 2 || localQuery.value.trim() === '') {
      currentQuery.value = localQuery.value.trim()
      runSearch()
    }
  }, 500)
}
function clearQuery() {
  localQuery.value = ''
  currentQuery.value = ''
  router.replace({ path: '/search' })
  resetResults()
  searchInputRef.value?.focus()
}

// ── Filters ───────────────────────────────────────────────────
function toggleType(key) {
  const idx = activeTypes.value.indexOf(key)
  if (idx === -1) {
    activeTypes.value.push(key)
    if (buildEffectiveQuery()) fetchSection(key, 0)
  } else {
    if (activeTypes.value.length === 1) return
    activeTypes.value.splice(idx, 1)
  }
}
function selectAllTypes() {
  activeTypes.value = ['PROJECT', 'NEWS', 'VIDEO', 'WRITING', 'SOUNDTRACK', 'IMAGE']
  if (buildEffectiveQuery()) runSearch()
}
function restoreType(key) {
  if (!activeTypes.value.includes(key)) {
    activeTypes.value.push(key)
    fetchSection(key, 0)
  }
}
function focusType(key) {
  activeTypes.value = [key]
  sectionPages[key] = 0
  fetchSection(key, 0)
}
function toggleTag(tag) {
  const idx = selectedTags.value.indexOf(tag)
  if (idx === -1) selectedTags.value.push(tag)
  else selectedTags.value.splice(idx, 1)
  runSearch()
}
function removeTag(tag) {
  selectedTags.value = selectedTags.value.filter(t => t !== tag)
  runSearch()
}
function searchByTag(tag) {
  selectedTags.value = [tag]
  runSearch()
}
function resetAllFilters() {
  selectedTags.value = []
  activeTypes.value = ['PROJECT', 'NEWS', 'VIDEO', 'WRITING', 'SOUNDTRACK', 'IMAGE']
  runSearch()
}

// ── Pagination ────────────────────────────────────────────────
async function prevPage(key) {
  if ((sectionPages[key] || 0) <= 0) return
  sectionPages[key]--
  await fetchSection(key, sectionPages[key])
  document.querySelector('.sr-main')?.scrollIntoView({ behavior: 'smooth' })
}
async function nextPage(key) {
  const sec = sectionMap.value[key]
  if ((sectionPages[key] || 0) >= (sec.totalPages - 1)) return
  sectionPages[key]++
  await fetchSection(key, sectionPages[key])
  document.querySelector('.sr-main')?.scrollIntoView({ behavior: 'smooth' })
}
async function goToPage(key, page) {
  sectionPages[key] = page
  await fetchSection(key, page)
  document.querySelector('.sr-main')?.scrollIntoView({ behavior: 'smooth' })
}

// ── Tags loading ─────────────────────────────────────────────
async function loadTags() {
  try {
    const [s, v, w, i] = await Promise.allSettled([
      api.get('/soundtracks/topics'),
      api.get('/videos/topics'),
      api.get('/writings/topics'),
      api.get('/image-collections/topics'),
    ])
    const tags = new Set()
    const extractName = (topic) => {
      const name = lang.activeLang === 'CKB' ? (topic.nameCkb || topic.nameKmr) : (topic.nameKmr || topic.nameCkb)
      if (name && name.trim()) tags.add(name.trim())
    }
    ;[s, v, w, i].forEach(r => {
      if (r.status === 'fulfilled') {
        const arr = r.value.data?.data || r.value.data || []
        if (Array.isArray(arr)) arr.forEach(extractName)
      }
    })
    allTagsPool.value = [...tags].sort()
  } catch (e) { console.warn('Tags load:', e.message) }
}

// ── Lifecycle ─────────────────────────────────────────────────
onMounted(async () => {
  const q = route.query.q
  if (q) {
    localQuery.value = q
    currentQuery.value = q
    await runSearch()
  }
  loadTags()
})
watch(() => route.query.q, (q) => {
  if (q && q !== currentQuery.value) {
    localQuery.value = q
    currentQuery.value = q
    runSearch()
  }
})
watch(() => lang.activeLang, () => {
  loadTags()
  if (currentQuery.value) runSearch()
})
</script>

<style scoped>
/* ════════════════════════════════════════════════════════
   KHI Archive — Search Results
   Redesign: Deep editorial with warm tones
════════════════════════════════════════════════════════ */

@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700;800&display=swap');

.sr-page {
  --accent:      #c8a44e;
  --accent-dim:  rgba(200,164,78,.12);
  --accent-mid:  rgba(200,164,78,.35);
  --ink:         #0f0f12;
  --ink-soft:    #2a2a32;
  --ink-muted:   #6b6b78;
  --ink-faint:   #9d9daa;
  --parchment:   #f5f3ef;
  --cream:       #faf9f6;
  --surface:     #ffffff;
  --border:      rgba(0,0,0,.06);
  --border-bold: rgba(0,0,0,.1);
  --glass:       rgba(255,255,255,.72);
  --glass-border:rgba(255,255,255,.18);
  --shadow-xs:   0 1px 3px rgba(0,0,0,.04);
  --shadow-sm:   0 2px 8px rgba(0,0,0,.05);
  --shadow:      0 8px 30px rgba(0,0,0,.07);
  --shadow-lg:   0 24px 64px rgba(0,0,0,.1);
  --shadow-lift: 0 20px 48px rgba(0,0,0,.09), 0 2px 6px rgba(0,0,0,.04);
  --radius-sm:   10px;
  --radius:      16px;
  --radius-lg:   24px;
  --radius-xl:   32px;
  --font:        'IBM Plex Sans Arabic', system-ui, sans-serif;
  --font-display:'Playfair Display', 'IBM Plex Sans Arabic', Georgia, serif;
  --ease-out:    cubic-bezier(.16,1,.3,1);
  --ease-spring: cubic-bezier(.34,1.56,.64,1);

  background: var(--parchment);
  font-family: var(--font);
  min-height: 100vh;
  direction: rtl;
  color: var(--ink);
  -webkit-font-smoothing: antialiased;
}
.sr-page--ltr { direction: ltr; }
.container { max-width: 1400px; margin: 0 auto; padding: 0 28px; }

/* ══ HERO ═══════════════════════════════════════════════ */
.sr-hero {
  position: relative;
  background: var(--ink);
  padding: 80px 0 72px;
  overflow: hidden;
  isolation: isolate;
}
.sr-hero__mesh {
  position: absolute; inset: 0;
  background:
    radial-gradient(ellipse 80% 60% at 20% 0%, rgba(200,164,78,.15) 0%, transparent 60%),
    radial-gradient(ellipse 60% 80% at 85% 100%, rgba(59,130,246,.08) 0%, transparent 50%),
    radial-gradient(ellipse 50% 50% at 50% 50%, rgba(139,92,246,.06) 0%, transparent 60%);
  pointer-events: none;
}
.sr-hero__glow {
  position: absolute;
  width: 600px; height: 600px;
  top: -200px; left: 10%;
  background: radial-gradient(circle, rgba(200,164,78,.1) 0%, transparent 70%);
  filter: blur(60px);
  pointer-events: none;
  animation: heroGlowDrift 12s ease-in-out infinite alternate;
}
@keyframes heroGlowDrift {
  0%   { transform: translate(0, 0); }
  100% { transform: translate(60px, 30px); }
}
.sr-hero__noise {
  position: absolute; inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.7' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.03'/%3E%3C/svg%3E");
  pointer-events: none;
}
.sr-hero__inner { position: relative; z-index: 2; }

/* Breadcrumb */
.sr-hero__eyebrow {
  margin-bottom: 32px; display: flex; align-items: center; gap: 10px;
}
.sr-breadcrumb {
  display: inline-flex; align-items: center; gap: 7px;
  color: rgba(255,255,255,.4); font-size: 13px; font-weight: 500;
  text-decoration: none; transition: color .25s;
  letter-spacing: .02em;
}
.sr-breadcrumb:hover { color: var(--accent); }
.sr-breadcrumb__sep { color: rgba(255,255,255,.2); display: flex; }
.sr-breadcrumb__cur { color: rgba(255,255,255,.55); font-size: 13px; font-weight: 500; }

/* Title */
.sr-hero__title {
  font-family: var(--font-display);
  font-size: clamp(30px, 5vw, 56px);
  font-weight: 700; color: #fff;
  margin: 0 0 40px; line-height: 1.15;
  letter-spacing: -.01em;
}
.sr-hero__title-line {
  position: relative; display: inline-block;
}
.sr-hero__title-line::after {
  content: ''; position: absolute;
  bottom: -10px; right: 0; width: 60px; height: 3px;
  background: var(--accent);
  border-radius: 3px;
}
.sr-page--ltr .sr-hero__title-line::after { right: auto; left: 0; }

/* Search bar */
.sr-search-form { display: flex; gap: 12px; max-width: 780px; }
.sr-search-input-wrap {
  flex: 1; display: flex; align-items: center;
  background: rgba(255,255,255,.95);
  border-radius: var(--radius-lg); padding: 0 24px; gap: 16px;
  box-shadow: 0 12px 48px rgba(0,0,0,.25);
  border: 1px solid rgba(255,255,255,.15);
  transition: box-shadow .35s, border-color .35s;
  backdrop-filter: blur(20px);
}
.sr-search-input-wrap:focus-within {
  box-shadow: 0 12px 48px rgba(0,0,0,.3), 0 0 0 2px var(--accent);
  border-color: var(--accent);
}
.sr-search-icon { color: var(--ink-muted); flex-shrink: 0; opacity: .6; }
.sr-search-input {
  flex: 1; border: none; outline: none;
  font-family: var(--font); font-size: 16px; font-weight: 500;
  padding: 22px 0; background: transparent;
  color: var(--ink); min-width: 0;
  letter-spacing: .01em;
}
.sr-search-input::placeholder { color: var(--ink-faint); font-weight: 400; }
.sr-search-clear {
  width: 32px; height: 32px; border-radius: 50%; border: none;
  background: var(--parchment); color: var(--ink-muted); cursor: pointer;
  display: grid; place-items: center; flex-shrink: 0;
  transition: all .25s var(--ease-out);
}
.sr-search-clear:hover { background: var(--ink); color: #fff; }

.sr-search-btn {
  height: 68px; padding: 0 40px;
  background: var(--accent);
  color: var(--ink); border: none; border-radius: var(--radius-lg);
  font-family: var(--font); font-size: 15px; font-weight: 700;
  cursor: pointer; transition: all .35s var(--ease-out);
  white-space: nowrap;
  box-shadow: 0 8px 32px rgba(200,164,78,.35);
  display: flex; align-items: center; justify-content: center; min-width: 120px;
  letter-spacing: .03em;
}
.sr-search-btn:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 14px 40px rgba(200,164,78,.45);
  background: #d4b05c;
}
.sr-search-btn:active:not(:disabled) { transform: translateY(-1px); }
.sr-search-btn:disabled { opacity: .6; }
.sr-btn-spinner {
  width: 20px; height: 20px;
  border: 2.5px solid rgba(15,15,18,.2); border-top-color: var(--ink);
  border-radius: 50%; animation: spin .7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* Type chips */
.sr-hero__type-filters {
  margin-top: 28px; max-width: 780px;
  display: flex; align-items: center; gap: 16px; flex-wrap: wrap;
}
.sr-hero__type-filters-label {
  font-size: 11px; font-weight: 700; color: rgba(255,255,255,.3);
  text-transform: uppercase; letter-spacing: .16em; white-space: nowrap; flex-shrink: 0;
}
.sr-hero__type-chips { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }

.sr-hero__chip {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 8px 16px 8px 12px; border-radius: 99px;
  border: 1px solid rgba(255,255,255,.12);
  background: rgba(255,255,255,.06);
  color: rgba(255,255,255,.6); font-size: 13px; font-weight: 600;
  font-family: var(--font); cursor: pointer;
  transition: all .25s var(--ease-out);
  backdrop-filter: blur(12px);
}
.sr-hero__chip:hover {
  background: rgba(255,255,255,.12); border-color: rgba(255,255,255,.25);
  color: #fff; transform: translateY(-1px);
}
.sr-hero__chip--on {
  background: rgba(255,255,255,.92);
  border-color: rgba(255,255,255,.95);
  color: var(--ink);
}
.sr-hero__chip--on:hover { background: #fff; transform: translateY(-1px); }

.sr-hero__chip-indicator {
  width: 8px; height: 8px; border-radius: 50%;
  background: currentColor; opacity: .4; flex-shrink: 0;
  transition: all .2s;
}
.sr-hero__chip--on .sr-hero__chip-indicator {
  opacity: 1; background: var(--accent);
  box-shadow: 0 0 8px rgba(200,164,78,.5);
}
.sr-hero__chip-label { font-size: 13px; letter-spacing: .01em; }
.sr-hero__chip-count {
  background: rgba(255,255,255,.1); font-size: 10px; font-weight: 700;
  padding: 2px 8px; border-radius: 99px; min-width: 22px; text-align: center;
  letter-spacing: .03em;
}
.sr-hero__chip--on .sr-hero__chip-count {
  background: var(--accent-dim); color: #8a6d20;
}

.sr-hero__chip-all {
  padding: 8px 18px; border-radius: 99px;
  border: 1px dashed rgba(255,255,255,.2); background: transparent;
  color: rgba(255,255,255,.4); font-size: 12px; font-weight: 600;
  font-family: var(--font); cursor: pointer; transition: all .25s;
  letter-spacing: .02em;
}
.sr-hero__chip-all:hover {
  border-color: var(--accent); color: var(--accent);
  background: rgba(200,164,78,.06);
}

/* Hero meta */
.sr-hero__meta {
  margin-top: 24px; display: flex; align-items: center;
  gap: 12px; flex-wrap: wrap; font-size: 14px; color: rgba(255,255,255,.5);
  font-weight: 400;
}
.sr-hero__meta em {
  color: var(--accent); font-style: normal; font-weight: 600;
}
.sr-meta__divider {
  width: 3px; height: 3px; border-radius: 50%;
  background: rgba(255,255,255,.25);
}
.sr-hero__meta strong {
  color: #fff; font-size: 18px; font-weight: 700;
  font-family: var(--font-display);
}
.sr-meta__time {
  color: rgba(255,255,255,.28); font-size: 12px;
  font-variant-numeric: tabular-nums;
}

/* ══ ACTIVE FILTERS BAR ══════════════════════════════════ */
.sr-active-filters {
  background: var(--cream);
  border-bottom: 1px solid var(--border);
  padding: 14px 0; position: sticky; top: 80px; z-index: 50;
  box-shadow: 0 4px 16px rgba(0,0,0,.03);
}
.sr-active-filters__inner { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; }
.sr-af__label {
  font-size: 11px; font-weight: 700; color: var(--ink-faint);
  text-transform: uppercase; letter-spacing: .14em; white-space: nowrap;
}
.sr-af__pills { display: flex; gap: 8px; flex-wrap: wrap; flex: 1; }
.sr-af__pill {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 6px 10px 6px 14px; border-radius: 99px;
  font-size: 13px; font-weight: 600;
}
.sr-af__pill--type {
  background: rgba(15,15,18,.06); color: var(--ink-soft);
  border: 1px solid rgba(15,15,18,.08);
}
.sr-af__pill--tag {
  background: var(--accent-dim); color: #7a5c15;
  border: 1px solid rgba(200,164,78,.18);
}
.sr-af__pill button {
  width: 20px; height: 20px; border-radius: 50%; border: none;
  background: rgba(0,0,0,.06); cursor: pointer;
  display: grid; place-items: center; transition: all .2s;
  color: inherit;
}
.sr-af__pill button:hover { background: rgba(0,0,0,.15); }
.sr-af__reset {
  margin-inline-start: auto; font-size: 13px; font-weight: 600;
  color: var(--ink-muted); background: transparent;
  border: 1.5px solid var(--border-bold); border-radius: 99px;
  padding: 7px 20px; cursor: pointer; transition: all .25s;
  white-space: nowrap; font-family: var(--font);
  letter-spacing: .02em;
}
.sr-af__reset:hover { background: var(--ink); color: #fff; border-color: var(--ink); }

/* ══ BODY ════════════════════════════════════════════════ */
.sr-body {
  display: grid; grid-template-columns: 260px 1fr;
  gap: 40px; padding-top: 48px; padding-bottom: 120px; align-items: start;
}
@media (max-width: 1024px) { .sr-body { grid-template-columns: 230px 1fr; gap: 28px; } }
@media (max-width: 768px) { .sr-body { grid-template-columns: 1fr; } .sr-sidebar { display: none; } }

/* ══ SIDEBAR ═════════════════════════════════════════════ */
.sr-sidebar__panel {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: var(--radius-lg); overflow: hidden;
  position: sticky; top: 140px;
  box-shadow: var(--shadow-sm);
}
.sr-sidebar__header {
  display: flex; align-items: center; gap: 10px; padding: 16px 22px;
  font-size: 11px; font-weight: 700; color: var(--ink-soft);
  background: var(--cream);
  border-bottom: 1px solid var(--border);
  text-transform: uppercase; letter-spacing: .14em;
}
.sr-sidebar__reset {
  margin-inline-start: auto; font-size: 11px; color: var(--ink-faint);
  background: transparent; border: none; cursor: pointer;
  padding: 4px 12px; border-radius: 8px; transition: all .2s;
  font-weight: 600; font-family: var(--font);
}
.sr-sidebar__reset:hover { background: rgba(200,164,78,.12); color: #8a6d20; }

.sr-filter-group { padding: 20px 22px; border-bottom: 1px solid var(--border); }
.sr-filter-group:last-child { border-bottom: 0; }
.sr-filter-group__title {
  font-size: 11px; font-weight: 700; color: var(--ink-faint);
  text-transform: uppercase; letter-spacing: .12em; margin: 0 0 14px;
  display: flex; align-items: center; gap: 8px;
}
.sr-filter-tag-count {
  background: var(--accent-dim); color: #8a6d20;
  padding: 2px 8px; border-radius: 99px; font-size: 10px; font-weight: 700;
}
.sr-filter-group__items { display: flex; flex-direction: column; gap: 2px; }
.sr-filter-group__items--tags {
  max-height: 240px; overflow-y: auto;
  scrollbar-width: thin; scrollbar-color: rgba(0,0,0,.12) transparent;
}
.sr-filter-group__items--tags::-webkit-scrollbar { width: 3px; }
.sr-filter-group__items--tags::-webkit-scrollbar-thumb { background: rgba(0,0,0,.12); border-radius: 4px; }

/* Checkboxes */
.sr-checkbox-label {
  display: flex; align-items: center; gap: 10px; padding: 9px 12px;
  border-radius: var(--radius-sm); cursor: pointer;
  transition: background .2s; user-select: none;
}
.sr-checkbox-label:hover { background: var(--parchment); }
.sr-checkbox-label--checked { background: var(--accent-dim); }
.sr-checkbox-native { display: none; }
.sr-checkbox-box {
  width: 18px; height: 18px; border: 2px solid #d4d1cc; border-radius: 6px;
  display: grid; place-items: center; flex-shrink: 0;
  transition: all .2s; background: #fff;
}
.sr-checkbox-box--sm { width: 16px; height: 16px; border-radius: 5px; }
.sr-checkbox-label--checked .sr-checkbox-box {
  background: var(--ink); border-color: var(--ink);
}
.sr-checkbox-tick { opacity: 0; stroke: #fff; transition: opacity .15s; }
.sr-checkbox-label--checked .sr-checkbox-tick { opacity: 1; }
.sr-checkbox-dot {
  width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; opacity: .6;
  transition: opacity .2s;
}
.sr-checkbox-label--checked .sr-checkbox-dot { opacity: 1; }
.sr-checkbox-text { flex: 1; font-size: 14px; font-weight: 500; color: var(--ink-soft); }
.sr-checkbox-text--tag { font-size: 13px; color: var(--ink-muted); }
.sr-checkbox-label--checked .sr-checkbox-text { color: var(--ink); font-weight: 600; }
.sr-checkbox-label--checked .sr-checkbox-text--tag { color: #8a6d20; }
.sr-checkbox-count {
  font-size: 11px; font-weight: 700; color: var(--ink-faint);
  background: var(--parchment); padding: 2px 9px; border-radius: 99px;
  min-width: 26px; text-align: center; transition: all .2s;
  font-variant-numeric: tabular-nums;
}
.sr-checkbox-count--active { background: var(--ink); color: #fff; }

.sr-tag-search { margin-bottom: 12px; }
.sr-tag-search__input {
  width: 100%; padding: 10px 14px;
  border: 1px solid var(--border-bold); border-radius: var(--radius-sm);
  font-size: 13px; font-family: var(--font); font-weight: 500;
  background: var(--parchment); outline: none;
  transition: border-color .25s, background .25s;
  box-sizing: border-box; color: var(--ink);
}
.sr-tag-search__input:focus { border-color: var(--accent); background: #fff; }
.sr-filter-no-tags { padding: 16px; text-align: center; font-size: 13px; color: var(--ink-faint); }
.sr-filter-show-more {
  width: 100%; margin-top: 12px; padding: 10px; background: transparent;
  border: 1px dashed var(--border-bold); border-radius: var(--radius-sm);
  font-size: 13px; font-weight: 600; color: var(--ink-muted);
  cursor: pointer; transition: all .25s; font-family: var(--font);
}
.sr-filter-show-more:hover { background: var(--accent-dim); color: #8a6d20; border-color: var(--accent); }

/* ══ MAIN ════════════════════════════════════════════════ */
.sr-main { min-width: 0; }

/* Results bar */
.sr-results-bar {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 36px; padding-bottom: 20px;
  border-bottom: 1px solid var(--border);
}
.sr-results-bar__summary {
  font-family: var(--font-display); font-size: 18px; font-weight: 600;
  color: var(--ink-soft);
}
.sr-sort { position: relative; }
.sr-sort__sel {
  appearance: none; background: var(--surface); border: 1px solid var(--border-bold);
  border-radius: var(--radius); padding: 11px 40px 11px 18px;
  font-size: 14px; font-weight: 600; color: var(--ink-soft); cursor: pointer;
  font-family: var(--font); outline: none; transition: border-color .25s;
  box-shadow: var(--shadow-xs);
}
.sr-sort__sel:focus { border-color: var(--accent); }
.sr-sort__ico {
  position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
  pointer-events: none; color: var(--ink-faint);
}
.sr-page--ltr .sr-sort__ico { right: auto; left: 14px; }

/* ══ SECTIONS ════════════════════════════════════════════ */
.sr-section { margin-bottom: 60px; }
.sr-section:last-child { margin-bottom: 0; }
.sr-section__header {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 24px; padding: 16px 24px;
  background: var(--surface); border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow-xs);
}
.sr-section__title-wrap { display: flex; align-items: center; gap: 14px; }
.sr-section__dot {
  width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0;
  box-shadow: 0 0 0 3px rgba(0,0,0,.04);
}
.sr-section__title {
  font-family: var(--font-display); font-size: 20px; font-weight: 600;
  margin: 0; color: var(--ink);
}
.sr-section__meta { display: flex; align-items: center; gap: 12px; }
.sr-section__count {
  background: var(--ink); color: #fff;
  font-size: 12px; font-weight: 700;
  padding: 4px 14px; border-radius: 99px;
  min-width: 30px; text-align: center;
  font-variant-numeric: tabular-nums;
}
.sr-section__more {
  display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600;
  color: var(--ink-muted); background: var(--parchment);
  border: 1px solid var(--border-bold);
  border-radius: 99px; padding: 7px 18px; cursor: pointer;
  transition: all .25s var(--ease-out); font-family: var(--font);
}
.sr-section__more:hover { background: var(--ink); color: #fff; border-color: var(--ink); }

.sr-section__no-results {
  display: flex; align-items: center; gap: 12px; padding: 32px 24px;
  background: var(--cream); border: 1px dashed var(--border-bold);
  border-radius: var(--radius); color: var(--ink-faint); font-size: 14px;
}
.sr-section__no-dot {
  width: 8px; height: 8px; border-radius: 50%; opacity: .3; flex-shrink: 0;
}

/* ══ GRID ════════════════════════════════════════════════ */
.sr-results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 22px;
}

/* ══ CARDS ═══════════════════════════════════════════════ */
.sr-card {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: var(--radius-lg); overflow: hidden; cursor: pointer;
  transition: all .4s var(--ease-out);
  position: relative;
  box-shadow: var(--shadow-sm);
}
.sr-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-lift);
  border-color: var(--border-bold);
}
.sr-card__img-wrap {
  position: relative; aspect-ratio: 16/10; overflow: hidden;
  background: var(--ink);
}
.sr-card__img {
  width: 100%; height: 100%; object-fit: cover;
  transition: transform .7s var(--ease-out), opacity .5s;
  opacity: .92;
}
.sr-card:hover .sr-card__img { transform: scale(1.05); opacity: 1; }
.sr-card__img-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(to top,
    rgba(15,15,18,.7) 0%,
    rgba(15,15,18,.15) 40%,
    transparent 65%);
  opacity: 0; transition: opacity .4s;
}
.sr-card:hover .sr-card__img-overlay { opacity: 1; }
.sr-card__type-badge {
  position: absolute; top: 14px; right: 14px;
  background: var(--badge-color, var(--ink));
  color: #fff; font-size: 10px; font-weight: 700;
  padding: 5px 12px; border-radius: 99px;
  letter-spacing: .06em; text-transform: uppercase;
  box-shadow: 0 4px 14px rgba(0,0,0,.2);
  transition: transform .3s var(--ease-out);
}
.sr-page--ltr .sr-card__type-badge { right: auto; left: 14px; }
.sr-card:hover .sr-card__type-badge { transform: scale(1.05); }

.sr-card__hover-cta {
  position: absolute; bottom: 16px; left: 50%;
  transform: translateX(-50%) translateY(12px);
  background: var(--accent);
  color: var(--ink); padding: 10px 24px; border-radius: 99px;
  font-size: 13px; font-weight: 700; display: flex; align-items: center; gap: 8px;
  white-space: nowrap; opacity: 0;
  transition: all .35s var(--ease-out);
  box-shadow: 0 8px 24px rgba(200,164,78,.4); font-family: var(--font);
  letter-spacing: .03em;
}
.sr-card:hover .sr-card__hover-cta { opacity: 1; transform: translateX(-50%) translateY(0); }

.sr-card__body { padding: 18px 20px 22px; }
.sr-card__meta {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 10px;
}
.sr-card__type-label {
  font-size: 10px; font-weight: 700;
  color: var(--type-color, var(--ink-muted));
  text-transform: uppercase; letter-spacing: .1em;
}
.sr-card__date {
  font-size: 12px; color: var(--ink-faint); font-weight: 500;
  font-variant-numeric: tabular-nums;
}
.sr-card__title {
  font-family: var(--font); font-size: 15px; font-weight: 700;
  margin: 0 0 8px; color: var(--ink); line-height: 1.5;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
  transition: color .25s;
}
.sr-card:hover .sr-card__title { color: var(--ink); }
.sr-card__desc {
  font-size: 13px; color: var(--ink-muted); line-height: 1.7; margin: 0;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}
:deep(.sr-highlight) {
  background: rgba(200,164,78,.25); color: var(--ink);
  border-radius: 3px; padding: 1px 3px; font-weight: 700;
}
.sr-card__accent {
  position: absolute; bottom: 0; left: 0; right: 0; height: 3px;
  transform: scaleX(0);
  transition: transform .45s var(--ease-out);
  transform-origin: right;
}
.sr-page--ltr .sr-card__accent { transform-origin: left; }
.sr-card:hover .sr-card__accent { transform: scaleX(1); }

/* ══ PAGINATION ══════════════════════════════════════════ */
.sr-pager {
  display: flex; justify-content: center; align-items: center;
  gap: 16px; margin-top: 48px; padding-top: 32px;
  border-top: 1px solid var(--border);
}
.sr-pager__btn {
  padding: 11px 26px; background: var(--surface);
  border: 1px solid var(--border-bold);
  border-radius: 99px; font-size: 14px; font-weight: 600; color: var(--ink-soft);
  cursor: pointer; transition: all .25s var(--ease-out);
  font-family: var(--font); box-shadow: var(--shadow-xs);
  display: flex; align-items: center; gap: 8px;
}
.sr-pager__btn:hover:not(:disabled) {
  background: var(--ink); color: #fff; border-color: var(--ink);
  box-shadow: 0 4px 18px rgba(0,0,0,.15);
}
.sr-pager__btn:disabled { opacity: .3; cursor: not-allowed; }
.sr-pager__dots { display: flex; gap: 8px; }
.sr-pager__dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: var(--border-bold); border: none; cursor: pointer;
  transition: all .25s var(--ease-out);
}
.sr-pager__dot--on {
  background: var(--accent); transform: scale(1.5);
  box-shadow: 0 0 8px rgba(200,164,78,.4);
}
.sr-pager__info {
  font-size: 13px; font-weight: 600; color: var(--ink-faint);
  font-variant-numeric: tabular-nums;
}

/* ══ NO QUERY ════════════════════════════════════════════ */
.sr-no-query { padding: 120px 24px 100px; text-align: center; }
.sr-no-query__icon {
  margin-bottom: 28px; color: var(--ink-faint); opacity: .3;
  display: flex; justify-content: center;
}
.sr-no-query__title {
  font-family: var(--font-display); font-size: 28px; font-weight: 600;
  margin-bottom: 12px; color: var(--ink-soft);
}
.sr-no-query__hint {
  font-size: 16px; color: var(--ink-muted); margin-bottom: 40px;
  line-height: 1.7; font-weight: 400;
}
.sr-quick-tags { display: flex; flex-direction: column; align-items: center; gap: 16px; }
.sr-quick-tags__label {
  font-size: 11px; color: var(--ink-faint); font-weight: 700;
  text-transform: uppercase; letter-spacing: .14em;
}
.sr-quick-tags__list { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; }
.sr-quick-tag {
  background: var(--surface); color: var(--ink-soft);
  border: 1px solid var(--border-bold);
  padding: 10px 22px; border-radius: 99px;
  font-size: 14px; font-weight: 600; cursor: pointer;
  transition: all .25s var(--ease-out); font-family: var(--font);
  box-shadow: var(--shadow-xs);
}
.sr-quick-tag:hover {
  background: var(--accent); color: var(--ink);
  border-color: var(--accent);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(200,164,78,.3);
}

/* ══ EMPTY STATE ═════════════════════════════════════════ */
.sr-empty { padding: 100px 24px; text-align: center; }
.sr-empty__illustration { margin-bottom: 36px; display: flex; justify-content: center; }
.sr-empty__title {
  font-family: var(--font-display); font-size: 26px; font-weight: 600;
  margin-bottom: 12px; color: var(--ink-soft);
}
.sr-empty__hint {
  font-size: 15px; color: var(--ink-muted); margin-bottom: 36px; line-height: 1.7;
}
.sr-empty__actions { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }
.sr-empty__btn {
  padding: 14px 32px; background: var(--ink);
  color: #fff; border: none; border-radius: 99px; font-size: 15px; font-weight: 700;
  cursor: pointer; transition: all .25s var(--ease-out); font-family: var(--font);
  box-shadow: 0 6px 24px rgba(0,0,0,.15); letter-spacing: .02em;
}
.sr-empty__btn:hover { transform: translateY(-3px); box-shadow: 0 10px 32px rgba(0,0,0,.2); }
.sr-empty__link {
  padding: 14px 32px; background: transparent; color: var(--ink-soft);
  border: 1.5px solid var(--border-bold); border-radius: 99px;
  font-size: 15px; font-weight: 700; text-decoration: none;
  transition: all .25s var(--ease-out);
}
.sr-empty__link:hover { background: var(--parchment); border-color: var(--ink); color: var(--ink); }

/* ══ SKELETONS ═══════════════════════════════════════════ */
.sk-line {
  height: 12px;
  background: linear-gradient(90deg, #eae7e2 25%, #e0dcd5 50%, #eae7e2 75%);
  background-size: 200% 100%; animation: shimmer 1.8s ease infinite;
  border-radius: 8px; margin-bottom: 8px;
}
.sk-line--sm { height: 10px; }
.sk-block {
  background: linear-gradient(90deg, #eae7e2 25%, #e0dcd5 50%, #eae7e2 75%);
  background-size: 200% 100%; animation: shimmer 1.8s ease infinite;
}
@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
.sr-card--sk { pointer-events: none; }
.sr-card--sk .sr-card__img-wrap { background: none; }

/* ══ RESPONSIVE ══════════════════════════════════════════ */
@media (max-width: 640px) {
  .sr-search-form { flex-direction: column; }
  .sr-search-btn { width: 100%; height: 56px; }
  .sr-search-input-wrap { padding: 0 18px; }
  .sr-results-grid { grid-template-columns: 1fr; }
  .sr-hero { padding: 48px 0 44px; }
  .sr-hero__type-filters { gap: 10px; }
  .sr-hero__chip { padding: 7px 12px 7px 10px; }
  .container { padding: 0 18px; }
}
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: .01ms !important;
    transition-duration: .01ms !important;
  }
}
</style>