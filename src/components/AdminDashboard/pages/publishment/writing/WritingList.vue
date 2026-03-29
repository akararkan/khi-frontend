<template>
  <div class="wlist" dir="rtl">

    <!-- Header -->
    <div class="wlist__head">
      <div>
        <h1 class="wlist__title">کتێبەکان</h1>
        <p class="wlist__sub">لیستی هەموو کتێب و نووسراوەکان.</p>
      </div>
      <RouterLink class="btn btn--primary" to="/admin/writings/new">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        کتێبی نوێ
      </RouterLink>
    </div>

    <!-- Toolbar -->
    <div class="toolbar">
      <div class="toolbar__search">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>
        </svg>
        <input v-model="search" type="text" placeholder="گەڕان بە ناونیشان، نووسەر، بابەت..." />
      </div>

      <select v-model="filterLang" class="toolbar__select">
        <option value="">هەموو زمانەکان</option>
        <option value="CKB">سۆرانی</option>
        <option value="KMR">کرمانجی</option>
      </select>

      <select v-model="filterGenre" class="toolbar__select">
        <option value="">هەموو جۆرەکان</option>
        <option v-for="(def, key) in genreDefs" :key="key" :value="key">{{ def.label }}</option>
      </select>

      <select v-model="filterInstitute" class="toolbar__select">
        <option value="">هەموو جۆرەکان</option>
        <option value="true">بڕیاری ناوەند</option>
        <option value="false">دەرەکی</option>
      </select>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="loading-card">
      <div class="spinner"></div>
      <span>کتێکان باردەکرێن...</span>
    </div>

    <!-- Empty -->
    <div v-else-if="!filtered.length" class="empty-card">
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
      </svg>
      <div class="empty-card__title">هیچ کتێبێک نەدۆزرایەوە</div>
      <div class="empty-card__sub">فلتەرەکان بگۆڕە یان کتێبی نوێ زیاد بکە.</div>
      <RouterLink class="btn btn--primary" to="/admin/writings/new">کتێبی نوێ</RouterLink>
    </div>

    <!-- Grid Table -->
    <div v-else class="panel">
      <table class="table">
        <thead>
          <tr>
            <th>#</th>
            <th>کڤەر</th>
            <th>ناونیشان</th>
            <th>جۆرەکان</th>
            <th>نووسەر</th>
            <th>سەری</th>
            <th>بڕیار</th>
            <th>کات</th>
            <th>کردار</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(item, idx) in filtered" :key="item.id" @click="openDetail(item)" class="table__row">
            <td class="table__num">{{ idx + 1 }}</td>

            <!-- Cover -->
            <td>
              <div class="cover-cell">
                <template v-if="item.ckbCoverUrl || item.kmrCoverUrl || item.hoverUrl">
                  <img class="cover-cell__img cover-cell__img--base"
                    :src="item.ckbCoverUrl || item.kmrCoverUrl || item.hoverUrl" alt="" />
                  <img v-if="item.hoverUrl" class="cover-cell__img cover-cell__img--hover"
                    :src="item.hoverUrl" alt="" />
                </template>
                <div v-else class="cover-cell__empty">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                  </svg>
                </div>
                <div v-if="item.hoverUrl" class="cover-cell__hover-badge" title="دارای Hover Image">H</div>
              </div>
            </td>

            <td>
              <div class="title-cell">
                <span class="title-cell__main">{{ item.titleCkb || item.titleKmr || '—' }}</span>
                <span v-if="item.titleCkb && item.titleKmr" class="title-cell__sub">{{ item.titleKmr }}</span>
              </div>
            </td>

            <!-- Genres (multi) -->
            <td>
              <div class="genre-pills">
                <span v-for="g in item.bookGenres" :key="g" class="topic-pill" :style="genreStyle(g)">
                  {{ genreLabel(g) }}
                </span>
                <span v-if="!item.bookGenres.length" class="muted">—</span>
              </div>
            </td>

            <td>
              <span v-if="item.writer" class="writer-badge">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
                {{ item.writer }}
              </span>
              <span v-else class="muted">—</span>
            </td>

            <td>
              <span v-if="item.seriesInfo" class="series-badge" :class="item.seriesInfo.isParent ? 'series-badge--parent' : 'series-badge--child'">
                {{ item.seriesInfo.isParent ? '👑' : '📚' }}
                {{ item.seriesInfo.seriesName }}
              </span>
              <span v-else class="muted">—</span>
            </td>

            <td>
              <span class="inst-badge" :class="item.publishedByInstitute ? 'inst-badge--yes' : 'inst-badge--no'">
                {{ item.publishedByInstitute ? '✓ ناوەند' : 'دەرەکی' }}
              </span>
            </td>

            <td class="date-cell">{{ fmtDate(item.createdAt) }}</td>

            <td @click.stop>
              <div class="act-btns">
                <RouterLink :to="`/admin/writings/${item.id}/edit`" class="icon-btn icon-btn--edit" title="دەستکاری">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4z"/>
                  </svg>
                </RouterLink>
                <button class="icon-btn icon-btn--del" title="سڕینەوە" @click="confirmDelete(item)">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                    <path d="M10 11v6M14 11v6"/>
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- ══════════════════════════════════════════════════════════════════════ -->
    <!--  DETAIL MODAL                                                        -->
    <!-- ══════════════════════════════════════════════════════════════════════ -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="detailItem" class="dk-bg" @click.self="detailItem = null">
          <div class="dk" :class="{ 'dk--institute': detailItem.publishedByInstitute }">
            <button class="dk__close" @click="detailItem = null">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>

            <!-- Hero -->
            <div class="dk__hero"
              :style="(detailItem.ckbCoverUrl || detailItem.kmrCoverUrl)
                ? `background-image:url(${detailItem.ckbCoverUrl || detailItem.kmrCoverUrl})`
                : ''">
              <div v-if="detailItem.hoverUrl" class="dk__hero-hover"
                :style="`background-image:url(${detailItem.hoverUrl})`" />
              <div class="dk__hero-grain"></div>
              <div class="dk__hero-gradient"></div>

              <div class="dk__hero-content">
                <div v-if="detailItem.publishedByInstitute" class="dk__ribbon dk__ribbon--institute">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
                  </svg>
                  بڕیاری ناوەند
                </div>

                <div class="dk__hero-badges">
                  <span v-for="g in detailItem.bookGenres" :key="g"
                    class="dk__badge dk__badge--topic" :style="genreStyle(g)">
                    {{ genreLabel(g) }}
                  </span>

                  <span v-if="detailItem.seriesInfo" class="dk__badge dk__badge--series">
                    {{ detailItem.seriesInfo.isParent ? '👑 سەری کتێب' : '📚 بەشی سەری' }}
                  </span>

                  <span v-if="detailItem.hoverUrl" class="dk__badge dk__badge--hover">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                    </svg>
                    Hover
                  </span>

                  <span v-for="lang in detailItem.contentLanguages" :key="lang"
                    class="dk__badge dk__badge--lang">
                    {{ lang === 'CKB' ? '🇮🇶 سۆرانی' : '🌍 کورمانجی' }}
                  </span>
                </div>

                <h2 class="dk__hero-title">{{ detailItem.titleCkb || detailItem.titleKmr }}</h2>
                <p v-if="detailItem.titleCkb && detailItem.titleKmr" class="dk__hero-subtitle">{{ detailItem.titleKmr }}</p>

                <div class="dk__hero-stats">
                  <div class="dk__stat" v-if="detailItem.writer">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                    </svg>
                    {{ detailItem.writer }}
                  </div>
                  <div v-if="detailItem.seriesInfo && !detailItem.seriesInfo.isParent" class="dk__stat dk__stat--series">
                    بەشی {{ detailItem.seriesInfo.seriesOrder }} لە {{ detailItem.seriesInfo.totalBooks }}
                  </div>
                  <div v-if="detailItem.pageCount" class="dk__stat">{{ detailItem.pageCount }} پەڕە</div>
                  <div v-if="detailItem.fileFormat" class="dk__stat">{{ detailItem.fileFormat }}</div>
                </div>
              </div>
            </div>

            <div class="dk__body">

              <!-- Covers Grid -->
              <div class="dk__section" v-if="detailItem.ckbCoverUrl || detailItem.kmrCoverUrl || detailItem.hoverUrl">
                <div class="dk__sec-head">🖼️ وێنەی کڤەر</div>
                <div class="dk__covers-grid">
                  <div class="dk__cover-item" v-if="detailItem.ckbCoverUrl">
                    <span class="dk__cover-label dk__cover-label--ckb">سۆرانی</span>
                    <div class="dk__cover-img-wrap"><img :src="detailItem.ckbCoverUrl" alt="" /></div>
                  </div>
                  <div class="dk__cover-item" v-if="detailItem.kmrCoverUrl">
                    <span class="dk__cover-label dk__cover-label--kmr">کورمانجی</span>
                    <div class="dk__cover-img-wrap"><img :src="detailItem.kmrCoverUrl" alt="" /></div>
                  </div>
                  <div class="dk__cover-item" v-if="detailItem.hoverUrl">
                    <span class="dk__cover-label dk__cover-label--hover">هۆڤەر</span>
                    <div class="dk__cover-img-wrap dk__cover-img-wrap--hover"><img :src="detailItem.hoverUrl" alt="" /></div>
                  </div>
                </div>
              </div>

              <!-- Bilingual Content -->
              <div class="dk__section" v-if="detailItem.descriptionCkb || detailItem.descriptionKmr">
                <div class="dk__sec-head">📄 ناوەڕۆک و وەسف</div>
                <div class="dk__content-grid">
                  <div class="dk__content-col" v-if="detailItem.descriptionCkb || detailItem.genreCkb">
                    <div class="dk__lang-tag dk__lang-tag--ckb">سۆرانی</div>
                    <div v-if="detailItem.genreCkb" class="dk__meta-row">
                      <span class="dk__meta-label">جۆر:</span>
                      <span class="dk__meta-value">{{ detailItem.genreCkb }}</span>
                    </div>
                    <p v-if="detailItem.descriptionCkb" class="dk__desc">{{ detailItem.descriptionCkb }}</p>
                  </div>
                  <div class="dk__content-col" v-if="detailItem.descriptionKmr || detailItem.genreKmr">
                    <div class="dk__lang-tag dk__lang-tag--kmr">کورمانجی</div>
                    <div v-if="detailItem.genreKmr" class="dk__meta-row">
                      <span class="dk__meta-label">جۆر:</span>
                      <span class="dk__meta-value">{{ detailItem.genreKmr }}</span>
                    </div>
                    <p v-if="detailItem.descriptionKmr" class="dk__desc">{{ detailItem.descriptionKmr }}</p>
                  </div>
                </div>
              </div>

              <!-- Series Info -->
              <div class="dk__section" v-if="detailItem.seriesInfo">
                <div class="dk__sec-head">📚 زانیاری سەری کتێب</div>
                <div class="dk__series-card" :class="detailItem.seriesInfo.isParent ? 'dk__series-card--parent' : 'dk__series-card--child'">
                  <div class="dk__series-icon">{{ detailItem.seriesInfo.isParent ? '👑' : '📚' }}</div>
                  <div class="dk__series-info">
                    <span class="dk__series-name">{{ detailItem.seriesInfo.seriesName }}</span>
                    <div class="dk__series-meta">
                      <span v-if="!detailItem.seriesInfo.isParent" class="dk__series-order">ڕیزبەندی: {{ detailItem.seriesInfo.seriesOrder }}</span>
                      <span class="dk__series-count">{{ detailItem.seriesInfo.totalBooks }} کتێب</span>
                      <span v-if="detailItem.seriesInfo.isParent" class="dk__series-role">سەری سەرەکی</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Tags & Keywords -->
              <div class="dk__section" v-if="detailItem.tagsCkb?.length || detailItem.tagsKmr?.length || detailItem.keywordsCkb?.length || detailItem.keywordsKmr?.length">
                <div class="dk__sec-head"># تاگ و کلیلەوشەکان</div>
                <div class="dk__tags-grid">
                  <div v-if="detailItem.tagsCkb?.length" class="dk__tag-group">
                    <span class="dk__tag-label">تاگ (سۆرانی)</span>
                    <div class="dk__tag-list">
                      <span v-for="t in detailItem.tagsCkb" :key="'tc'+t" class="dk__chip dk__chip--ckb">{{ t }}</span>
                    </div>
                  </div>
                  <div v-if="detailItem.tagsKmr?.length" class="dk__tag-group">
                    <span class="dk__tag-label">تاگ (کورمانجی)</span>
                    <div class="dk__tag-list">
                      <span v-for="t in detailItem.tagsKmr" :key="'tk'+t" class="dk__chip dk__chip--kmr">{{ t }}</span>
                    </div>
                  </div>
                  <div v-if="detailItem.keywordsCkb?.length" class="dk__tag-group">
                    <span class="dk__tag-label">کلیلەوشە (سۆرانی)</span>
                    <div class="dk__tag-list">
                      <span v-for="k in detailItem.keywordsCkb" :key="'kc'+k" class="dk__chip dk__chip--kw">{{ k }}</span>
                    </div>
                  </div>
                  <div v-if="detailItem.keywordsKmr?.length" class="dk__tag-group">
                    <span class="dk__tag-label">کلیلەوشە (کورمانجی)</span>
                    <div class="dk__tag-list">
                      <span v-for="k in detailItem.keywordsKmr" :key="'kk'+k" class="dk__chip dk__chip--kw">{{ k }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Info Grid -->
              <div class="dk__section">
                <div class="dk__sec-head">ℹ️ زانیاری گشتی</div>
                <div class="dk__info-grid">
                  <div class="dk__info-item">
                    <span class="dk__info-icon">🆔</span>
                    <div class="dk__info-data"><span class="dk__info-label">ناسنامە</span><span class="dk__info-value">#{{ detailItem.id }}</span></div>
                  </div>
                  <div class="dk__info-item">
                    <span class="dk__info-icon">🏷</span>
                    <div class="dk__info-data">
                      <span class="dk__info-label">جۆرەکان</span>
                      <span class="dk__info-value">{{ (detailItem.bookGenres || []).map(g => genreLabel(g)).join('، ') || '—' }}</span>
                    </div>
                  </div>
                  <div class="dk__info-item">
                    <span class="dk__info-icon">✍️</span>
                    <div class="dk__info-data"><span class="dk__info-label">نووسەر</span><span class="dk__info-value">{{ detailItem.writer || '—' }}</span></div>
                  </div>
                  <div class="dk__info-item">
                    <span class="dk__info-icon">🏛</span>
                    <div class="dk__info-data">
                      <span class="dk__info-label">بڕیاری ناوەند</span>
                      <span class="dk__info-value" :class="detailItem.publishedByInstitute ? 'dk__info-value--yes' : ''">
                        {{ detailItem.publishedByInstitute ? 'بەڵێ ✓' : 'نەخێر' }}
                      </span>
                    </div>
                  </div>
                  <div class="dk__info-item">
                    <span class="dk__info-icon">📅</span>
                    <div class="dk__info-data"><span class="dk__info-label">کاتی دروستکردن</span><span class="dk__info-value">{{ fmtDateFull(detailItem.createdAt) }}</span></div>
                  </div>
                  <div class="dk__info-item" v-if="detailItem.updatedAt">
                    <span class="dk__info-icon">🔄</span>
                    <div class="dk__info-data"><span class="dk__info-label">دوایین نوێکردنەوە</span><span class="dk__info-value">{{ fmtDateFull(detailItem.updatedAt) }}</span></div>
                  </div>
                </div>
              </div>

            </div>

            <!-- Footer -->
            <div class="dk__foot">
              <RouterLink :to="`/admin/writings/${detailItem.id}/edit`" class="btn btn--primary btn--sm">دەستکاریکردن</RouterLink>
              <button class="btn btn--ghost btn--sm" @click="detailItem = null">داخستن</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Delete Confirm -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="deleteTarget" class="modal-bg" @click.self="deleteTarget = null">
          <div class="modal modal--sm">
            <div class="modal__del-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
              </svg>
            </div>
            <h3 class="modal__del-title">سڕینەوەی کتێب</h3>
            <p class="modal__del-sub">
              دەتەوێت <strong>{{ deleteTarget.titleCkb || deleteTarget.titleKmr }}</strong> بسڕیتەوە؟
              ئەم کردارە گەرێنەوەی نییە.
            </p>
            <div class="modal__del-acts">
              <button class="btn btn--danger btn--sm" :disabled="deleting" @click="doDelete">
                <span v-if="deleting" class="spin-sm"></span>
                {{ deleting ? 'سڕینەوەدەکرێت...' : 'بەڵێ، بیسڕەرەوە' }}
              </button>
              <button class="btn btn--ghost btn--sm" @click="deleteTarget = null">پاشگەزبوونەوە</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/api.js'

const items        = ref([])
const loading      = ref(false)
const search       = ref('')
const filterLang   = ref('')
const filterGenre  = ref('')
const filterInstitute = ref('')
const detailItem   = ref(null)
const deleteTarget = ref(null)
const deleting     = ref(false)

// ── Genre definitions ─────────────────────────────────────────────────────────
const genreDefs = {
  POETRY:      { label: 'شیعر',         color: '#6e1870' },
  NOVEL:       { label: 'ڕۆمان',        color: '#8c1515' },
  SHORT_STORY: { label: 'چیرۆکی کورت',  color: '#1a47a0' },
  DRAMA:       { label: 'شانۆ',          color: '#7C3AED' },
  HISTORY:     { label: 'مێژوو',         color: '#c8a800' },
  BIOGRAPHY:   { label: 'ژیاننامە',     color: '#0d7c7c' },
  PHILOSOPHY:  { label: 'فەلسەفە',      color: '#7C3AED' },
  RELIGION:    { label: 'ئایین',         color: '#16784a' },
  FOLKLORE:    { label: 'زارگوتن',      color: '#c8a800' },
  POLITICS:    { label: 'سیاسەت',       color: '#8c1515' },
  SOCIOLOGY:   { label: 'کۆمەڵناسی',    color: '#1a47a0' },
  ECONOMICS:   { label: 'ئابووری',       color: '#16784a' },
  LAW:         { label: 'یاسا',           color: '#4b5563' },
  LINGUISTICS: { label: 'زمانناسی',     color: '#1a47a0' },
  ARTS:        { label: 'هونەر',          color: '#c0285e' },
  CULTURAL:    { label: 'کولتووری',      color: '#c8a800' },
  SCIENCE:     { label: 'زانست',          color: '#0d7c7c' },
  MEDICINE:    { label: 'پزیشکی',        color: '#16784a' },
  EDUCATIONAL: { label: 'پەروەردەیی',   color: '#1a47a0' },
  CHILDREN:    { label: 'منداڵان',       color: '#c8a800' },
  TRAVEL:      { label: 'گەشتوگوزار',   color: '#0d7c7c' },
  OTHER:       { label: 'یتر',            color: '#666' },
}

const genreLabel = (v) => genreDefs[v]?.label || v || '—'
const genreStyle = (v) => {
  const g = genreDefs[v]
  if (!g) return { background: '#eee', color: '#666' }
  return { background: g.color + '15', color: g.color, border: `1px solid ${g.color}30` }
}

const normalize = (d) => ({
  ...d,
  titleCkb:        d.ckbContent?.title        || '',
  titleKmr:        d.kmrContent?.title        || '',
  descriptionCkb:  d.ckbContent?.description  || '',
  descriptionKmr:  d.kmrContent?.description  || '',
  genreCkb:        d.ckbContent?.genre        || '',
  genreKmr:        d.kmrContent?.genre        || '',
  writer:          d.ckbContent?.writer || d.kmrContent?.writer || '',
  pageCount:       d.ckbContent?.pageCount || d.kmrContent?.pageCount || 0,
  fileFormat:      d.ckbContent?.fileFormat || d.kmrContent?.fileFormat || '',
  fileUrl:         d.ckbContent?.fileUrl || d.kmrContent?.fileUrl || '',
  tagsCkb:         [...(d.tags?.ckb     || [])],
  tagsKmr:         [...(d.tags?.kmr     || [])],
  keywordsCkb:     [...(d.keywords?.ckb || [])],
  keywordsKmr:     [...(d.keywords?.kmr || [])],
  contentLanguages: Array.isArray(d.contentLanguages) ? [...d.contentLanguages] : [],
  ckbCoverUrl:     d.ckbCoverUrl   || '',
  kmrCoverUrl:     d.kmrCoverUrl   || '',
  hoverUrl:        d.hoverCoverUrl || '',
  bookGenres:      Array.isArray(d.bookGenres) ? [...d.bookGenres] : [],
  publishedByInstitute: !!d.publishedByInstitute,
  createdAt:       d.createdAt,
  updatedAt:       d.updatedAt,
  seriesInfo:      d.seriesInfo ? {
    seriesName: d.seriesInfo.seriesName,
    seriesOrder: d.seriesInfo.seriesOrder,
    totalBooks: d.seriesInfo.totalBooks,
    isParent: d.seriesInfo.isParent
  } : null
})

const filtered = computed(() => {
  let list = items.value
  const q = search.value.trim().toLowerCase()

  if (q) {
    list = list.filter(item =>
      (item.titleCkb || '').toLowerCase().includes(q) ||
      (item.titleKmr || '').toLowerCase().includes(q) ||
      (item.writer || '').toLowerCase().includes(q) ||
      (item.tagsCkb || []).some(t => t.toLowerCase().includes(q)) ||
      (item.tagsKmr || []).some(t => t.toLowerCase().includes(q))
    )
  }

  if (filterLang.value)  list = list.filter(item => (item.contentLanguages || []).includes(filterLang.value))
  if (filterGenre.value) list = list.filter(item => (item.bookGenres || []).includes(filterGenre.value))
  if (filterInstitute.value !== '') {
    const val = filterInstitute.value === 'true'
    list = list.filter(item => item.publishedByInstitute === val)
  }

  return list
})

const fetchAll = async () => {
  loading.value = true
  try {
    const { data } = await api.get('/api/v1/writings')
    const arr = data?.data?.content ?? data?.data ?? data ?? []
    items.value = (Array.isArray(arr) ? arr : []).map(normalize)
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const openDetail    = (item) => { detailItem.value = item }
const confirmDelete = (item) => { deleteTarget.value = item }

const doDelete = async () => {
  if (!deleteTarget.value) return
  deleting.value = true
  try {
    await api.delete(`/api/v1/writings/${deleteTarget.value.id}`)
    items.value = items.value.filter(x => x.id !== deleteTarget.value.id)
    deleteTarget.value = null
  } catch (e) {
    console.error(e)
  } finally {
    deleting.value = false
  }
}

const fmtDate = (d) => {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('ckb', { year: 'numeric', month: 'short', day: 'numeric' })
}

const fmtDateFull = (d) => {
  if (!d) return '—'
  const dt = new Date(d)
  return dt.toLocaleDateString('ckb', { year: 'numeric', month: 'long', day: 'numeric' })
    + '  ·  '
    + dt.toLocaleTimeString('ckb', { hour: '2-digit', minute: '2-digit' })
}

onMounted(fetchAll)
</script>

<style scoped>
.wlist { direction: rtl; max-width: 1300px; margin: 0 auto; }
.wlist__head { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; margin-bottom: 1.2rem; }
.wlist__title { margin: 0 0 .3rem; font-size: clamp(1.2rem, 2.5vw, 2rem); font-weight: 900; color: #2E2D29; }
.wlist__sub { margin: 0; color: #767571; font-weight: 600; }
.toolbar { display: flex; flex-wrap: wrap; gap: .6rem; margin-bottom: 1rem; }
.toolbar__search { flex: 1; min-width: 200px; height: 44px; display: flex; align-items: center; gap: .5rem; padding: 0 .9rem; border: 1.5px solid #E0DFDC; border-radius: 10px; background: #fff; color: #9E9A94; }
.toolbar__search input { border: none; outline: none; background: transparent; font: inherit; color: #2E2D29; width: 100%; }
.toolbar__select { height: 44px; padding: 0 .8rem; border: 1.5px solid #E0DFDC; border-radius: 10px; background: #fff; font: inherit; color: #2E2D29; cursor: pointer; outline: none; }
.toolbar__select:focus { border-color: #8C1515; }
.panel { background: #fff; border: 1px solid #E0DFDC; border-radius: 16px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,.04); }
.table { width: 100%; border-collapse: collapse; }
.table thead th { padding: .75rem 1rem; text-align: right; font-size: .75rem; font-weight: 700; color: #767571; background: #FAFAF9; border-bottom: 1px solid #E0DFDC; white-space: nowrap; }
.table__row { cursor: pointer; transition: background .12s; }
.table__row:hover { background: #FAFAF9; }
.table__row td { padding: .75rem 1rem; border-bottom: 1px solid #F0EEEB; vertical-align: middle; font-size: .85rem; }
.table__row:last-child td { border-bottom: none; }
.table__num { color: #9E9A94; font-size: .78rem; font-weight: 600; }
.cover-cell { width: 46px; height: 46px; border-radius: 8px; overflow: hidden; position: relative; cursor: pointer; flex-shrink: 0; }
.cover-cell__img { width: 100%; height: 100%; object-fit: cover; display: block; position: absolute; inset: 0; transition: opacity .2s ease, transform .2s ease; }
.cover-cell__img--base  { opacity: 1; transform: scale(1); }
.cover-cell__img--hover { opacity: 0; transform: scale(1.05); }
.cover-cell:hover .cover-cell__img--hover { opacity: 1; transform: scale(1); }
.cover-cell:hover .cover-cell__img--base  { opacity: 0; }
.cover-cell__empty { width: 100%; height: 100%; background: #F0EEEB; display: flex; align-items: center; justify-content: center; color: #C0BDB8; }
.cover-cell__hover-badge { position: absolute; bottom: 2px; left: 2px; width: 14px; height: 14px; border-radius: 3px; background: rgba(124,58,237,.85); color: #fff; font-size: .55rem; font-weight: 900; display: flex; align-items: center; justify-content: center; z-index: 5; pointer-events: none; }
.title-cell { display: flex; flex-direction: column; gap: .15rem; }
.title-cell__main { font-weight: 700; color: #2E2D29; }
.title-cell__sub { font-size: .76rem; color: #9E9A94; }
.topic-pill { display: inline-flex; align-items: center; gap: .3rem; padding: .2rem .6rem; border-radius: 99px; font-size: .75rem; font-weight: 700; max-width: 130px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.writer-badge { display: inline-flex; align-items: center; gap: .3rem; padding: .2rem .6rem; border-radius: 99px; background: rgba(67,56,202,.07); color: #4338ca; border: 1px solid rgba(67,56,202,.15); font-size: .75rem; font-weight: 700; }
.series-badge { display: inline-flex; align-items: center; gap: .3rem; padding: .2rem .6rem; border-radius: 99px; font-size: .75rem; font-weight: 700; }
.series-badge--parent { background: rgba(161,98,7,.08); color: #92400e; border: 1px solid rgba(161,98,7,.2); }
.series-badge--child  { background: rgba(100,116,139,.08); color: #475569; border: 1px solid rgba(100,116,139,.2); }
.inst-badge { display: inline-flex; align-items: center; gap: .3rem; padding: .2rem .6rem; border-radius: 99px; font-size: .75rem; font-weight: 700; }
.inst-badge--yes { background: rgba(15,118,110,.08); color: #0f766e; border: 1px solid rgba(15,118,110,.2); }
.inst-badge--no  { background: rgba(100,116,139,.06); color: #64748b; border: 1px solid rgba(100,116,139,.15); }
.date-cell { color: #9E9A94; font-size: .78rem; white-space: nowrap; }
.act-btns { display: flex; gap: .35rem; }
.icon-btn { width: 30px; height: 30px; border-radius: 7px; border: 1px solid #E0DFDC; background: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: .15s; color: #6E6B66; }
.icon-btn:hover { background: #F0EEEB; }
.icon-btn--edit:hover { color: #4338ca; border-color: rgba(67,56,202,.3); background: rgba(67,56,202,.05); }
.icon-btn--del:hover  { color: #dc2626; border-color: rgba(220,38,38,.3); background: rgba(220,38,38,.05); }
.empty-card { background: #fff; border: 1px solid #E0DFDC; border-radius: 16px; min-height: 280px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: .6rem; color: #9E9A94; text-align: center; padding: 2rem; }
.empty-card__title { font-weight: 800; font-size: 1rem; color: #2E2D29; }
.empty-card__sub { font-size: .84rem; }
.loading-card { background: #fff; border: 1px solid #E0DFDC; border-radius: 16px; min-height: 200px; display: flex; align-items: center; justify-content: center; gap: .7rem; color: #767571; font-weight: 600; }
.spinner { width: 24px; height: 24px; border-radius: 50%; border: 3px solid #E0DFDC; border-top-color: #8C1515; animation: spin .7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

/* Detail Modal */
.dk-bg { position: fixed; inset: 0; z-index: 1000; background: rgba(10,8,6,.6); backdrop-filter: blur(6px); display: flex; align-items: center; justify-content: center; padding: 1rem; }
.dk { background: #FDFCFB; border-radius: 20px; width: 100%; max-width: 820px; max-height: 92vh; overflow-y: auto; box-shadow: 0 32px 80px rgba(0,0,0,.3), 0 0 0 1px rgba(0,0,0,.06); position: relative; animation: dk-enter .35s cubic-bezier(.16,1,.3,1) both; }
.dk--institute { box-shadow: 0 32px 80px rgba(140,21,21,.2), 0 0 0 1px rgba(140,21,21,.15), 0 0 60px rgba(140,21,21,.08); }
@keyframes dk-enter { from { opacity: 0; transform: scale(.95) translateY(16px); } to { opacity: 1; transform: scale(1) translateY(0); } }
.dk__close { position: absolute; top: 12px; left: 12px; z-index: 20; width: 36px; height: 36px; border-radius: 50%; background: rgba(255,255,255,.92); border: 1px solid rgba(0,0,0,.08); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: .2s; color: #6E6B66; }
.dk__close:hover { background: #fff; color: #2E2D29; transform: scale(1.08); }
.dk__hero { position: relative; min-height: 240px; background: linear-gradient(135deg, #1a0505 0%, #4a1010 40%, #8C1515 100%); background-size: cover; background-position: center; border-radius: 20px 20px 0 0; overflow: hidden; }
.dk__hero-hover { position: absolute; inset: 0; background-size: cover; background-position: center; opacity: 0; transition: opacity .22s ease; pointer-events: none; }
.dk__hero:hover .dk__hero-hover { opacity: 1; }
.dk__hero-grain { position: absolute; inset: 0; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg '%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E"); pointer-events: none; }
.dk__hero-gradient { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,.82) 0%, rgba(0,0,0,.3) 40%, transparent 70%); pointer-events: none; }
.dk__hero-content { position: relative; z-index: 5; padding: 1.5rem 1.5rem 1.3rem; display: flex; flex-direction: column; justify-content: flex-end; min-height: 240px; gap: .55rem; }
.dk__ribbon { display: inline-flex; align-items: center; gap: .45rem; padding: .4rem .85rem; border-radius: 99px; background: linear-gradient(135deg, rgba(140,21,21,.9), rgba(180,30,30,.85)); color: #fff; font-size: .78rem; font-weight: 800; backdrop-filter: blur(4px); box-shadow: 0 4px 16px rgba(140,21,21,.35); align-self: flex-start; animation: ribbon-glow 3s ease-in-out infinite alternate; }
@keyframes ribbon-glow { from { box-shadow: 0 4px 16px rgba(140,21,21,.35); } to { box-shadow: 0 4px 24px rgba(140,21,21,.55); } }
.dk__hero-badges { display: flex; flex-wrap: wrap; gap: .35rem; }
.dk__badge { display: inline-flex; align-items: center; gap: .25rem; padding: .22rem .6rem; border-radius: 99px; font-size: .72rem; font-weight: 700; backdrop-filter: blur(8px); }
.dk__badge--topic   { background: rgba(255,255,255,.15); color: rgba(255,255,255,.9); border: 1px solid rgba(255,255,255,.18); }
.dk__badge--series  { background: rgba(245,158,11,.25); color: #fde68a; border: 1px solid rgba(245,158,11,.3); }
.dk__badge--hover   { background: rgba(124,58,237,.35); color: #e9d5ff; border: 1px solid rgba(124,58,237,.4); }
.dk__badge--lang    { background: rgba(255,255,255,.12); color: rgba(255,255,255,.85); border: 1px solid rgba(255,255,255,.2); font-size: .7rem; }
.dk__hero-title     { color: #fff; font-size: 1.45rem; font-weight: 900; margin: 0; line-height: 1.35; letter-spacing: -.01em; }
.dk__hero-subtitle  { color: rgba(255,255,255,.6); font-size: .88rem; margin: 0; font-weight: 600; }
.dk__hero-stats     { display: flex; gap: .9rem; margin-top: .25rem; flex-wrap: wrap; }
.dk__stat { display: inline-flex; align-items: center; gap: .3rem; font-size: .76rem; font-weight: 700; color: rgba(255,255,255,.7); }
.dk__stat--series { color: #fde68a; }
.dk__body { padding: 1.4rem 1.5rem; display: flex; flex-direction: column; gap: 1.5rem; }
.dk__sec-head { display: flex; align-items: center; gap: .5rem; font-size: .82rem; font-weight: 800; color: #8C1515; text-transform: uppercase; letter-spacing: .06em; padding-bottom: .6rem; border-bottom: 2px solid rgba(140,21,21,.1); margin-bottom: .85rem; flex-wrap: wrap; }
.dk__covers-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: .85rem; }
@media (max-width: 600px) { .dk__covers-grid { grid-template-columns: 1fr 1fr; } }
.dk__cover-item { display: flex; flex-direction: column; gap: .4rem; }
.dk__cover-item--empty { opacity: .45; }
.dk__cover-label { display: inline-flex; align-items: center; gap: .25rem; padding: .18rem .55rem; border-radius: 6px; font-size: .7rem; font-weight: 800; align-self: flex-start; }
.dk__cover-label--ckb   { background: rgba(200,168,0,.12); color: #8a7000; border: 1px solid rgba(200,168,0,.2); }
.dk__cover-label--kmr   { background: rgba(74,122,240,.1);  color: #2d5ac0; border: 1px solid rgba(74,122,240,.18); }
.dk__cover-label--hover { background: rgba(124,58,237,.08); color: #6d28d9; border: 1px solid rgba(124,58,237,.18); }
.dk__cover-img-wrap { border-radius: 10px; overflow: hidden; border: 1px solid #E8E5E0; aspect-ratio: 3/4; background: #F0EEEB; position: relative; }
.dk__cover-img-wrap--hover { border-style: dashed; border-color: rgba(124,58,237,.3); background: rgba(124,58,237,.04); }
.dk__cover-img-wrap--empty { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: .35rem; color: #C0BDB8; font-size: .75rem; font-weight: 600; }
.dk__cover-img-wrap img { width: 100%; height: 100%; object-fit: cover; display: block; }

/* Content */
.dk__content-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
@media (max-width: 600px) { .dk__content-grid { grid-template-columns: 1fr; } }
.dk__content-col { padding: 1rem; border-radius: 12px; background: #fff; border: 1px solid #EEECE8; }
.dk__lang-tag { display: inline-flex; padding: .18rem .55rem; border-radius: 6px; font-size: .7rem; font-weight: 800; margin-bottom: .65rem; }
.dk__lang-tag--ckb { background: rgba(200,168,0,.12); color: #8a7000; border: 1px solid rgba(200,168,0,.2); }
.dk__lang-tag--kmr { background: rgba(74,122,240,.1);  color: #2d5ac0; border: 1px solid rgba(74,122,240,.18); }
.dk__meta-row { display: flex; align-items: center; gap: .5rem; margin-bottom: .5rem; font-size: .85rem; }
.dk__meta-label { color: #9E9A94; font-weight: 600; }
.dk__meta-value { color: #2E2D29; font-weight: 700; }
.dk__desc { font-size: .88rem; color: #3E3C38; line-height: 1.7; margin: 0; }

/* Series */
.dk__series-card { display: flex; align-items: center; gap: .75rem; padding: .9rem 1rem; border-radius: 12px; border: 1.5px solid; }
.dk__series-card--parent { background: rgba(245,158,11,.06); border-color: rgba(245,158,11,.2); }
.dk__series-card--child  { background: rgba(100,116,139,.04); border-color: rgba(100,116,139,.15); }
.dk__series-icon { font-size: 1.4rem; }
.dk__series-info { display: flex; flex-direction: column; gap: .15rem; }
.dk__series-name { font-weight: 800; font-size: .95rem; color: #2E2D29; }
.dk__series-meta { display: flex; gap: .5rem; flex-wrap: wrap; font-size: .75rem; }
.dk__series-order { background: rgba(140,21,21,.08); color: #8C1515; padding: .15rem .5rem; border-radius: 99px; font-weight: 700; }
.dk__series-count { background: rgba(100,116,139,.08); color: #475569; padding: .15rem .5rem; border-radius: 99px; font-weight: 700; }
.dk__series-role  { background: rgba(245,158,11,.12); color: #92400e; padding: .15rem .5rem; border-radius: 99px; font-weight: 700; }

/* Files */
.dk__files { display: flex; flex-direction: column; gap: .5rem; }
.dk__file-row { display: flex; align-items: center; justify-content: space-between; padding: .75rem 1rem; background: #fff; border: 1px solid #EEECE8; border-radius: 10px; }
.dk__file-label { font-size: .85rem; color: #767571; font-weight: 600; }
.dk__file-link { display: inline-flex; align-items: center; gap: .3rem; font-size: .85rem; font-weight: 700; color: #8C1515; text-decoration: none; padding: .35rem .75rem; border-radius: 8px; background: rgba(140,21,21,.06); border: 1px solid rgba(140,21,21,.12); transition: .15s; }
.dk__file-link:hover { background: rgba(140,21,21,.1); }
.dk__file-link--ext { color: #4338ca; background: rgba(67,56,202,.06); border-color: rgba(67,56,202,.12); }
.dk__file-link--ext:hover { background: rgba(67,56,202,.1); }

/* Tags */
.dk__tags-grid { display: grid; grid-template-columns: 1fr 1fr; gap: .85rem; }
@media (max-width: 600px) { .dk__tags-grid { grid-template-columns: 1fr; } }
.dk__tag-group { display: flex; flex-direction: column; gap: .4rem; }
.dk__tag-label { font-size: .74rem; font-weight: 700; color: #9E9A94; }
.dk__tag-list { display: flex; flex-wrap: wrap; gap: .3rem; }
.dk__chip { display: inline-flex; padding: .22rem .6rem; border-radius: 8px; font-size: .78rem; font-weight: 700; }
.dk__chip--ckb { background: rgba(140,21,21,.07);  color: #8C1515; border: 1px solid rgba(140,21,21,.12); }
.dk__chip--kmr { background: rgba(67,56,202,.07);  color: #4338ca; border: 1px solid rgba(67,56,202,.12); }
.dk__chip--kw  { background: rgba(15,118,110,.07); color: #0f766e; border: 1px solid rgba(15,118,110,.12); }

/* Info Grid */
.dk__info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0; border: 1px solid #EEECE8; border-radius: 12px; overflow: hidden; background: #fff; }
@media (max-width: 500px) { .dk__info-grid { grid-template-columns: 1fr; } }
.dk__info-item { display: flex; align-items: flex-start; gap: .65rem; padding: .75rem 1rem; border-bottom: 1px solid #F5F3F0; border-left: 1px solid #F5F3F0; }
.dk__info-item:nth-child(odd) { border-left: none; }
@media (max-width: 500px) { .dk__info-item { border-left: none !important; } }
.dk__info-icon { font-size: 1rem; flex-shrink: 0; margin-top: .1rem; }
.dk__info-data { display: flex; flex-direction: column; gap: .1rem; min-width: 0; }
.dk__info-label { font-size: .72rem; font-weight: 700; color: #9E9A94; text-transform: uppercase; letter-spacing: .04em; }
.dk__info-value { font-size: .86rem; font-weight: 700; color: #2E2D29; word-break: break-word; }
.dk__info-value--yes { color: #0f766e; }

.dk__foot { padding: 1rem 1.5rem; border-top: 1px solid #F0EEEB; display: flex; gap: .6rem; background: #FDFCFB; border-radius: 0 0 20px 20px; position: sticky; bottom: 0; }

/* Delete modal */
.modal-bg { position: fixed; inset: 0; background: rgba(0,0,0,.45); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 1rem; }
.modal { background: #fff; border-radius: 18px; width: 100%; max-width: 680px; max-height: 90vh; overflow-y: auto; box-shadow: 0 24px 60px rgba(0,0,0,.2); position: relative; }
.modal--sm { max-width: 420px; padding: 2rem; text-align: center; }
.modal__del-icon { width: 60px; height: 60px; border-radius: 50%; background: rgba(220,38,38,.08); border: 1px solid rgba(220,38,38,.15); display: flex; align-items: center; justify-content: center; color: #dc2626; margin: 0 auto 1rem; }
.modal__del-title { font-size: 1.1rem; font-weight: 800; margin-bottom: .5rem; }
.modal__del-sub { color: #767571; font-size: .88rem; line-height: 1.6; margin-bottom: 1.2rem; }
.modal__del-acts { display: flex; gap: .6rem; justify-content: center; }
.btn { display: inline-flex; align-items: center; justify-content: center; gap: .4rem; text-decoration: none; border-radius: 10px; padding: .75rem 1.1rem; font-weight: 800; border: 1px solid transparent; transition: .15s; cursor: pointer; font: inherit; white-space: nowrap; }
.btn:hover { transform: translateY(-1px); }
.btn--primary { background: #8C1515; color: #fff; box-shadow: 0 8px 20px rgba(140,21,21,.18); }
.btn--ghost   { background: #fff; color: #6E6B66; border-color: #E0DFDC; }
.btn--danger  { background: #dc2626; color: #fff; box-shadow: 0 8px 20px rgba(220,38,38,.18); }
.btn--sm { padding: .5rem .9rem; font-size: .84rem; }
.btn:disabled { opacity: .5; cursor: not-allowed; transform: none; }
.muted { color: #9E9A94; }
.spin-sm { width: 14px; height: 14px; border: 2px solid rgba(255,255,255,.3); border-top-color: #fff; border-radius: 50%; animation: spin .7s linear infinite; flex-shrink: 0; }

.modal-enter-active, .modal-leave-active { transition: all .25s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-from .modal, .modal-leave-to .modal { transform: scale(.96) translateY(12px); }
.modal-enter-from .dk,    .modal-leave-to .dk    { transform: scale(.96) translateY(12px); }
</style>