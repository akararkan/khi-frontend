<template>
  <div class="slist" dir="rtl">

    <!-- Header -->
    <div class="slist__head">
      <div>
        <h1 class="slist__title">دەنگەکان</h1>
        <p class="slist__sub">لیستی هەموو تۆمارە دەنگییەکان.</p>
      </div>
      <RouterLink class="btn btn--primary" :to="{ name: 'AdminSoundTrackCreate' }">
        + دەنگی نوێ
      </RouterLink>
    </div>

    <!-- Toolbar -->
    <div class="toolbar">
      <div class="toolbar__search">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>
        </svg>
        <input v-model="search" type="text" placeholder="گەڕان بە ناو، تاگ، بابەت..." />
      </div>

      <select v-model="filterLang" class="toolbar__select">
        <option value="">هەموو زمانەکان</option>
        <option value="CKB">سۆرانی</option>
        <option value="KMR">کرمانجی</option>
      </select>

      <select v-model="filterState" class="toolbar__select">
        <option value="">هەموو دۆخەکان</option>
        <option value="SINGLE">SINGLE</option>
        <option value="MULTI">MULTI</option>
      </select>

      <select v-model="filterTopic" class="toolbar__select">
        <option value="">هەموو بابەتەکان</option>
        <option v-for="t in availableTopics" :key="t.id" :value="t.id">
          {{ t.nameCkb || t.nameKmr }}
        </option>
      </select>

      <select v-model="filterAlbum" class="toolbar__select">
        <option value="">هەموو جۆرەکان</option>
        <option value="true">ئەلبووم بیرەوەری</option>
        <option value="false">ئادی</option>
      </select>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="loading-card">
      <div class="spinner"></div>
      <span>دەنگەکان باردەکرێن...</span>
    </div>

    <!-- Empty -->
    <div v-else-if="!filtered.length" class="empty-card">
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
      </svg>
      <div class="empty-card__title">هیچ دەنگێک نەدۆزرایەوە</div>
      <div class="empty-card__sub">فلتەرەکان بگۆڕە یان دەنگی نوێ زیاد بکە.</div>
      <RouterLink class="btn btn--primary" :to="{ name: 'AdminSoundTrackCreate' }">دەنگی نوێ</RouterLink>
    </div>

    <!-- Table -->
    <div v-else class="panel">
      <table class="table">
        <thead>
          <tr>
            <th>#</th>
            <th>کڤەر</th>
            <th>ناو</th>
            <th>جۆر / دۆخ</th>
            <th>بابەت</th>
            <th>بیرەوەری</th>
            <th>فایل</th>
            <th>کاتی دروستکردن</th>
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
                  <img
                    v-if="item.ckbCoverUrl || item.kmrCoverUrl || item.hoverUrl"
                    class="cover-cell__img cover-cell__img--base"
                    :src="item.ckbCoverUrl || item.kmrCoverUrl || item.hoverUrl"
                    alt=""
                  />
                  <img
                    v-if="item.hoverUrl"
                    class="cover-cell__img cover-cell__img--hover"
                    :src="item.hoverUrl"
                    alt=""
                  />
                </template>
                <div v-else class="cover-cell__empty">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
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

            <td>
              <div class="badges">
                <span class="badge badge--type">{{ item.soundType }}</span>
                <span class="badge" :class="item.trackState === 'MULTI' ? 'badge--multi' : 'badge--single'">
                  {{ item.trackState }}
                </span>
              </div>
            </td>

            <td>
              <span v-if="item.topic" class="topic-pill">{{ item.topic.nameCkb || item.topic.nameKmr }}</span>
              <span v-else class="muted">—</span>
            </td>

            <td>
              <span v-if="item.trackState === 'MULTI'" class="badge" :class="item.albumOfMemories ? 'badge--album' : 'badge--normal'">
                {{ item.albumOfMemories ? 'بەڵێ' : 'نەخێر' }}
              </span>
              <span v-else class="muted">—</span>
            </td>

            <td>
              <span class="file-count">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/>
                </svg>
                {{ item.files?.length ?? 0 }}
              </span>
            </td>

            <td class="date-cell">{{ fmtDate(item.createdAt) }}</td>

            <td @click.stop>
              <div class="act-btns">
                <RouterLink
                  :to="{ name: 'AdminSoundTrackEdit', params: { id: item.id } }"
                  class="icon-btn icon-btn--edit"
                  title="دەستکاری"
                >
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
          <div class="dk" :class="{ 'dk--memories': detailItem.albumOfMemories && detailItem.trackState === 'MULTI' }">
            <button class="dk__close" @click="detailItem = null">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>

            <!-- Hero base cover -->
            <div
              class="dk__hero"
              :style="(detailItem.ckbCoverUrl || detailItem.kmrCoverUrl)
                ? `background-image:url(${detailItem.ckbCoverUrl || detailItem.kmrCoverUrl})`
                : ''"
            >
              <div
                v-if="detailItem.hoverUrl"
                class="dk__hero-hover"
                :style="`background-image:url(${detailItem.hoverUrl})`"
              />

              <div class="dk__hero-grain"></div>
              <div class="dk__hero-gradient"></div>

              <div class="dk__hero-content">
                <div v-if="detailItem.albumOfMemories && detailItem.trackState === 'MULTI'" class="dk__ribbon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                  </svg>
                  ئەلبوومی بیرەوەرییەکان
                </div>

                <div class="dk__hero-badges">
                  <span class="dk__badge dk__badge--type">{{ detailItem.soundType }}</span>

                  <span class="dk__badge" :class="detailItem.trackState === 'MULTI' ? 'dk__badge--multi' : 'dk__badge--single'">
                    {{ detailItem.trackState === 'MULTI' ? 'چەند تراک' : 'تاک تراک' }}
                  </span>

                  <span v-if="detailItem.topic" class="dk__badge dk__badge--topic">
                    {{ detailItem.topic.nameCkb || detailItem.topic.nameKmr }}
                  </span>

                  <span v-if="detailItem.hoverUrl" class="dk__badge dk__badge--hover">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                    </svg>
                    Hover
                  </span>

                  <!-- ✅ Languages shown in hero -->
                  <span
                    v-for="lang in detailItem.contentLanguages"
                    :key="lang"
                    class="dk__badge dk__badge--lang"
                  >
                    {{ lang === 'CKB' ? '🇮🇶 سۆرانی' : lang === 'KMR' ? '🌍 کورمانجی' : lang }}
                  </span>
                </div>

                <h2 class="dk__hero-title">{{ detailItem.titleCkb || detailItem.titleKmr }}</h2>
                <p v-if="detailItem.titleCkb && detailItem.titleKmr" class="dk__hero-subtitle">{{ detailItem.titleKmr }}</p>

                <div class="dk__hero-stats">
                  <div class="dk__stat">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/>
                    </svg>
                    {{ detailItem.files?.length || 0 }} فایل
                  </div>

                  <div class="dk__stat" v-if="detailItem.totalDurationSeconds">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                    </svg>
                    {{ fmtDuration(detailItem.totalDurationSeconds) }}
                  </div>

                  <div class="dk__stat" v-if="detailItem.totalSizeBytes">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                      <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    {{ fmtSize(detailItem.totalSizeBytes) }}
                  </div>

                  <!-- ✅ Director in hero stats -->
                  <div class="dk__stat" v-if="detailItem.director">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                    </svg>
                    {{ detailItem.director }}
                  </div>

                  <!-- ✅ Institute project badge in hero stats -->
                  <div v-if="detailItem.thisProjectOfInstitute" class="dk__stat dk__stat--institute">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
                    </svg>
                    پرۆژەی دامەزراوە
                  </div>
                </div>

              </div>
            </div>

            <div class="dk__body">

              <!-- Cover Images Row -->
              <div class="dk__section" v-if="detailItem.ckbCoverUrl || detailItem.kmrCoverUrl || detailItem.hoverUrl">
                <div class="dk__sec-head">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                  </svg>
                  وێنەی کڤەر
                </div>

                <div class="dk__covers-grid">
                  <div class="dk__cover-item" v-if="detailItem.ckbCoverUrl">
                    <span class="dk__cover-label dk__cover-label--ckb">سۆرانی (CKB)</span>
                    <div class="dk__cover-img-wrap">
                      <img :src="detailItem.ckbCoverUrl" alt="CKB Cover" />
                    </div>
                  </div>

                  <div class="dk__cover-item" v-if="detailItem.kmrCoverUrl">
                    <span class="dk__cover-label dk__cover-label--kmr">کورمانجی (KMR)</span>
                    <div class="dk__cover-img-wrap">
                      <img :src="detailItem.kmrCoverUrl" alt="KMR Cover" />
                    </div>
                  </div>

                  <div class="dk__cover-item" v-if="detailItem.hoverUrl">
                    <span class="dk__cover-label dk__cover-label--hover">هۆڤەر</span>
                    <div class="dk__cover-img-wrap dk__cover-img-wrap--hover">
                      <img :src="detailItem.hoverUrl" alt="Hover Image" />
                    </div>
                  </div>

                  <!-- ✅ Placeholder cards when a cover is missing -->
                  <div class="dk__cover-item dk__cover-item--empty" v-if="!detailItem.ckbCoverUrl">
                    <span class="dk__cover-label dk__cover-label--ckb">سۆرانی (CKB)</span>
                    <div class="dk__cover-img-wrap dk__cover-img-wrap--empty">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                      <span>نییە</span>
                    </div>
                  </div>

                  <div class="dk__cover-item dk__cover-item--empty" v-if="!detailItem.kmrCoverUrl">
                    <span class="dk__cover-label dk__cover-label--kmr">کورمانجی (KMR)</span>
                    <div class="dk__cover-img-wrap dk__cover-img-wrap--empty">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                      <span>نییە</span>
                    </div>
                  </div>

                  <div class="dk__cover-item dk__cover-item--empty" v-if="!detailItem.hoverUrl">
                    <span class="dk__cover-label dk__cover-label--hover">هۆڤەر</span>
                    <div class="dk__cover-img-wrap dk__cover-img-wrap--empty">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                      <span>نییە</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Bilingual Content -->
              <div class="dk__section" v-if="detailItem.descriptionCkb || detailItem.descriptionKmr || detailItem.readingCkb || detailItem.readingKmr">
                <div class="dk__sec-head">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                  </svg>
                  ناوەڕۆک و وەسف
                </div>

                <div class="dk__content-grid">
                  <div class="dk__content-col" v-if="detailItem.descriptionCkb || detailItem.readingCkb">
                    <div class="dk__lang-tag dk__lang-tag--ckb">سۆرانی</div>
                    <p v-if="detailItem.descriptionCkb" class="dk__desc">{{ detailItem.descriptionCkb }}</p>
                    <div v-if="detailItem.readingCkb" class="dk__reading">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/>
                        <path d="M19 10v2a7 7 0 01-14 0v-2"/>
                        <line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>
                      </svg>
                      <span>خوێنەر: <strong>{{ detailItem.readingCkb }}</strong></span>
                    </div>
                  </div>

                  <div class="dk__content-col" v-if="detailItem.descriptionKmr || detailItem.readingKmr">
                    <div class="dk__lang-tag dk__lang-tag--kmr">کورمانجی</div>
                    <p v-if="detailItem.descriptionKmr" class="dk__desc">{{ detailItem.descriptionKmr }}</p>
                    <div v-if="detailItem.readingKmr" class="dk__reading">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/>
                        <path d="M19 10v2a7 7 0 01-14 0v-2"/>
                        <line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>
                      </svg>
                      <span>خوێنەر: <strong>{{ detailItem.readingKmr }}</strong></span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Audio Files -->
              <div class="dk__section" v-if="detailItem.files?.length">
                <div class="dk__sec-head">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
                  </svg>
                  فایلە دەنگییەکان
                  <span class="dk__sec-count">{{ detailItem.files.length }}</span>
                </div>

                <div class="dk__tracks">
                  <div v-for="(f, i) in detailItem.files" :key="f.id || i" class="dk__track">
                    <div class="dk__track-num">{{ i + 1 }}</div>
                    <div class="dk__track-body">
                      <div class="dk__track-top">
                        <span class="dk__track-name">{{ f.readerName || `تراک ${i + 1}` }}</span>
                        <div class="dk__track-meta">
                          <span class="dk__track-chip">{{ f.fileType || 'OTHER' }}</span>
                          <span v-if="f.durationSeconds" class="dk__track-dur">{{ fmtDuration(f.durationSeconds) }}</span>
                          <span v-if="f.sizeBytes" class="dk__track-size">{{ fmtSize(f.sizeBytes) }}</span>
                        </div>
                      </div>

                      <audio v-if="f.fileUrl" controls class="dk__track-player" :src="f.fileUrl" preload="none"></audio>

                      <div v-else class="dk__track-links">
                        <a v-if="f.externalUrl" :href="f.externalUrl" target="_blank" class="dk__ext-link">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
                            <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                          </svg>
                          لینکی دەرەکی
                        </a>

                        <a v-if="f.embedUrl" :href="f.embedUrl" target="_blank" class="dk__ext-link dk__ext-link--embed">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
                          </svg>
                          لینکی ئێمبێد
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Topic -->
              <div class="dk__section" v-if="detailItem.topic">
                <div class="dk__sec-head">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/>
                    <line x1="7" y1="7" x2="7.01" y2="7"/>
                  </svg>
                  موضوع / بابەت
                </div>

                <div class="dk__topic-card">
                  <div class="dk__topic-icon">🏷</div>
                  <div class="dk__topic-info">
                    <span class="dk__topic-name">{{ detailItem.topic.nameCkb || '—' }}</span>
                    <span v-if="detailItem.topic.nameKmr" class="dk__topic-name-alt">{{ detailItem.topic.nameKmr }}</span>
                    <span class="dk__topic-id">ID: {{ detailItem.topic.id }}</span>
                  </div>
                </div>
              </div>

              <!-- Tags & Keywords -->
              <div class="dk__section" v-if="detailItem.tagsCkb?.length || detailItem.tagsKmr?.length || detailItem.keywordsCkb?.length || detailItem.keywordsKmr?.length">
                <div class="dk__sec-head">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/>
                    <line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/>
                  </svg>
                  تاگ و کلیلەوشەکان
                </div>

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

              <!-- Locations -->
              <div class="dk__section" v-if="detailItem.locations?.length">
                <div class="dk__sec-head">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                  شوێنەکان
                </div>

                <div class="dk__locations">
                  <div v-for="loc in detailItem.locations" :key="loc" class="dk__loc-card">
                    <span class="dk__loc-pin">📍</span><span>{{ loc }}</span>
                  </div>
                </div>
              </div>

              <!-- ✅ NEW: Director & Institute Section -->
              <div class="dk__section" v-if="detailItem.director || detailItem.thisProjectOfInstitute !== undefined">
                <div class="dk__sec-head">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
                  </svg>
                  دیرێکتۆر و دامەزراوە
                </div>

                <div class="dk__director-row">
                  <!-- Director card -->
                  <div class="dk__director-card" v-if="detailItem.director">
                    <div class="dk__director-avatar">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                        <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                      </svg>
                    </div>
                    <div class="dk__director-info">
                      <span class="dk__director-label">دیرێکتۆر</span>
                      <span class="dk__director-name">{{ detailItem.director }}</span>
                    </div>
                  </div>

                  <!-- Institute project card -->
                  <div
                    class="dk__institute-card"
                    :class="detailItem.thisProjectOfInstitute ? 'dk__institute-card--yes' : 'dk__institute-card--no'"
                  >
                    <div class="dk__institute-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                        <polyline points="9 22 9 12 15 12 15 22"/>
                      </svg>
                    </div>
                    <div class="dk__institute-info">
                      <span class="dk__institute-label">پرۆژەی دامەزراوە</span>
                      <span class="dk__institute-value">{{ detailItem.thisProjectOfInstitute ? '✓ بەڵێ' : '✗ نەخێر' }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- ✅ NEW: Content Languages Section -->
              <div class="dk__section" v-if="detailItem.contentLanguages?.length">
                <div class="dk__sec-head">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="2" y1="12" x2="22" y2="12"/>
                    <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
                  </svg>
                  زمانی ناوەڕۆک
                </div>

                <div class="dk__lang-cards">
                  <div
                    v-for="lang in detailItem.contentLanguages"
                    :key="lang"
                    class="dk__lang-card"
                    :class="lang === 'CKB' ? 'dk__lang-card--ckb' : 'dk__lang-card--kmr'"
                  >
                    <span class="dk__lang-card-flag">{{ lang === 'CKB' ? '🇮🇶' : '🌍' }}</span>
                    <div class="dk__lang-card-info">
                      <span class="dk__lang-card-code">{{ lang }}</span>
                      <span class="dk__lang-card-name">{{ lang === 'CKB' ? 'کوردی سۆرانی' : lang === 'KMR' ? 'کوردی کورمانجی' : lang }}</span>
                    </div>
                    <svg class="dk__lang-card-check" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                </div>
              </div>

              <!-- Info Grid — general metadata -->
              <div class="dk__section">
                <div class="dk__sec-head">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
                  </svg>
                  زانیاری گشتی
                </div>

                <div class="dk__info-grid">
                  <div class="dk__info-item">
                    <span class="dk__info-icon">🆔</span>
                    <div class="dk__info-data">
                      <span class="dk__info-label">ناسنامە</span>
                      <span class="dk__info-value">#{{ detailItem.id }}</span>
                    </div>
                  </div>

                  <div class="dk__info-item">
                    <span class="dk__info-icon">🎵</span>
                    <div class="dk__info-data">
                      <span class="dk__info-label">جۆری دەنگ</span>
                      <span class="dk__info-value">{{ detailItem.soundType || '—' }}</span>
                    </div>
                  </div>

                  <div class="dk__info-item">
                    <span class="dk__info-icon">📼</span>
                    <div class="dk__info-data">
                      <span class="dk__info-label">دۆخی تراک</span>
                      <span class="dk__info-value">{{ detailItem.trackState === 'MULTI' ? 'چەند تراک (MULTI)' : 'تاک تراک (SINGLE)' }}</span>
                    </div>
                  </div>

                  <!-- ✅ Album of Memories shown for MULTI -->
                  <div class="dk__info-item" v-if="detailItem.trackState === 'MULTI'">
                    <span class="dk__info-icon">💝</span>
                    <div class="dk__info-data">
                      <span class="dk__info-label">ئەلبوومی بیرەوەری</span>
                      <span class="dk__info-value" :class="detailItem.albumOfMemories ? 'dk__info-value--yes' : ''">
                        {{ detailItem.albumOfMemories ? 'بەڵێ ✓' : 'نەخێر' }}
                      </span>
                    </div>
                  </div>

                  <div class="dk__info-item">
                    <span class="dk__info-icon">🖼</span>
                    <div class="dk__info-data">
                      <span class="dk__info-label">کڤەری CKB</span>
                      <span class="dk__info-value" :class="detailItem.ckbCoverUrl ? 'dk__info-value--yes' : ''">
                        {{ detailItem.ckbCoverUrl ? '✓ هەیە' : '— نییە' }}
                      </span>
                    </div>
                  </div>

                  <div class="dk__info-item">
                    <span class="dk__info-icon">🖼</span>
                    <div class="dk__info-data">
                      <span class="dk__info-label">کڤەری KMR</span>
                      <span class="dk__info-value" :class="detailItem.kmrCoverUrl ? 'dk__info-value--yes' : ''">
                        {{ detailItem.kmrCoverUrl ? '✓ هەیە' : '— نییە' }}
                      </span>
                    </div>
                  </div>

                  <div class="dk__info-item">
                    <span class="dk__info-icon">🎨</span>
                    <div class="dk__info-data">
                      <span class="dk__info-label">Hover Image</span>
                      <span class="dk__info-value" :class="detailItem.hoverUrl ? 'dk__info-value--yes' : ''">
                        {{ detailItem.hoverUrl ? '✓ هەیە' : '— نییە' }}
                      </span>
                    </div>
                  </div>

                  <!-- ✅ Director in grid -->
                  <div class="dk__info-item">
                    <span class="dk__info-icon">🎬</span>
                    <div class="dk__info-data">
                      <span class="dk__info-label">دیرێکتۆر</span>
                      <span class="dk__info-value">{{ detailItem.director || '—' }}</span>
                    </div>
                  </div>

                  <!-- ✅ thisProjectOfInstitute in grid -->
                  <div class="dk__info-item">
                    <span class="dk__info-icon">🏛</span>
                    <div class="dk__info-data">
                      <span class="dk__info-label">پرۆژەی دامەزراوە</span>
                      <span class="dk__info-value" :class="detailItem.thisProjectOfInstitute ? 'dk__info-value--yes' : ''">
                        {{ detailItem.thisProjectOfInstitute ? 'بەڵێ ✓' : 'نەخێر' }}
                      </span>
                    </div>
                  </div>

                  <!-- ✅ Total files -->
                  <div class="dk__info-item">
                    <span class="dk__info-icon">🎶</span>
                    <div class="dk__info-data">
                      <span class="dk__info-label">ژمارەی فایلەکان</span>
                      <span class="dk__info-value">{{ detailItem.files?.length || 0 }}</span>
                    </div>
                  </div>

                  <!-- ✅ Total duration -->
                  <div class="dk__info-item" v-if="detailItem.totalDurationSeconds">
                    <span class="dk__info-icon">⏱</span>
                    <div class="dk__info-data">
                      <span class="dk__info-label">کاتی گشتی</span>
                      <span class="dk__info-value">{{ fmtDuration(detailItem.totalDurationSeconds) }}</span>
                    </div>
                  </div>

                  <!-- ✅ Total size -->
                  <div class="dk__info-item" v-if="detailItem.totalSizeBytes">
                    <span class="dk__info-icon">💾</span>
                    <div class="dk__info-data">
                      <span class="dk__info-label">قەبارەی گشتی</span>
                      <span class="dk__info-value">{{ fmtSize(detailItem.totalSizeBytes) }}</span>
                    </div>
                  </div>

                  <div class="dk__info-item">
                    <span class="dk__info-icon">📅</span>
                    <div class="dk__info-data">
                      <span class="dk__info-label">کاتی دروستکردن</span>
                      <span class="dk__info-value">{{ fmtDateFull(detailItem.createdAt) }}</span>
                    </div>
                  </div>

                  <div class="dk__info-item" v-if="detailItem.updatedAt">
                    <span class="dk__info-icon">🔄</span>
                    <div class="dk__info-data">
                      <span class="dk__info-label">دوایین نوێکردنەوە</span>
                      <span class="dk__info-value">{{ fmtDateFull(detailItem.updatedAt) }}</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            <!-- Footer -->
            <div class="dk__foot">
              <RouterLink :to="{ name: 'AdminSoundTrackEdit', params: { id: detailItem.id } }" class="btn btn--primary btn--sm">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4z"/>
                </svg>
                دەستکاریکردن
              </RouterLink>
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
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
              </svg>
            </div>

            <h3 class="modal__del-title">سڕینەوەی دەنگ</h3>
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
const filterState  = ref('')
const filterTopic  = ref('')
const filterAlbum  = ref('')
const detailItem   = ref(null)
const deleteTarget = ref(null)
const deleting     = ref(false)

const normalize = (d) => ({
  ...d,
  titleCkb:        d.ckbContent?.title        || '',
  titleKmr:        d.kmrContent?.title        || '',
  descriptionCkb:  d.ckbContent?.description  || '',
  descriptionKmr:  d.kmrContent?.description  || '',
  readingCkb:      d.ckbContent?.reading      || '',
  readingKmr:      d.kmrContent?.reading      || '',
  tagsCkb:         [...(d.tags?.ckb     || [])],
  tagsKmr:         [...(d.tags?.kmr     || [])],
  keywordsCkb:     [...(d.keywords?.ckb || [])],
  keywordsKmr:     [...(d.keywords?.kmr || [])],
  locations:       Array.isArray(d.locations) ? [...d.locations] : [],
  files:           d.files || [],
  albumOfMemories: d.albumOfMemories ?? false,
  totalDurationSeconds: d.totalDurationSeconds || 0,
  totalSizeBytes:       d.totalSizeBytes || 0,
  director:         d.director || '',
  thisProjectOfInstitute: d.thisProjectOfInstitute ?? false,
  contentLanguages: Array.isArray(d.contentLanguages) ? [...d.contentLanguages] : [],
  topic: d.topicId
    ? { id: d.topicId, nameCkb: d.topicNameCkb || '', nameKmr: d.topicNameKmr || '' }
    : null,

  // ✅ Cover URL mapping — hoverCoverUrl from backend → hoverUrl in frontend
  ckbCoverUrl: d.ckbCoverUrl   || '',
  kmrCoverUrl: d.kmrCoverUrl   || '',
  hoverUrl:    d.hoverCoverUrl || '',
})

const availableTopics = computed(() => {
  const seen = new Set()
  const result = []
  items.value.forEach(item => {
    if (item.topic && !seen.has(item.topic.id)) {
      seen.add(item.topic.id)
      result.push(item.topic)
    }
  })
  return result
})

const filtered = computed(() => {
  let list = items.value
  const q = search.value.trim().toLowerCase()

  if (q) {
    list = list.filter(item =>
      (item.titleCkb || '').toLowerCase().includes(q) ||
      (item.titleKmr || '').toLowerCase().includes(q) ||
      (item.soundType || '').toLowerCase().includes(q) ||
      (item.director || '').toLowerCase().includes(q) ||
      (item.topic?.nameCkb || '').toLowerCase().includes(q) ||
      (item.topic?.nameKmr || '').toLowerCase().includes(q) ||
      (item.tagsCkb || []).some(t => t.toLowerCase().includes(q)) ||
      (item.tagsKmr || []).some(t => t.toLowerCase().includes(q)) ||
      (item.keywordsCkb || []).some(k => k.toLowerCase().includes(q)) ||
      (item.keywordsKmr || []).some(k => k.toLowerCase().includes(q))
    )
  }

  if (filterLang.value)  list = list.filter(item => (item.contentLanguages || []).includes(filterLang.value))
  if (filterState.value) list = list.filter(item => item.trackState === filterState.value)
  if (filterTopic.value) list = list.filter(item => item.topic?.id === Number(filterTopic.value))

  if (filterAlbum.value !== '') {
    const val = filterAlbum.value === 'true'
    list = list.filter(item => item.trackState === 'MULTI' && item.albumOfMemories === val)
  }

  return list
})

const fetchAll = async () => {
  loading.value = true
  try {
    const { data } = await api.get('/api/v1/soundtracks')
    const arr = data?.data ?? data ?? []
    items.value = (Array.isArray(arr) ? arr : []).map(normalize)
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const openDetail   = (item) => { detailItem.value = item }
const confirmDelete = (item) => { deleteTarget.value = item }

const doDelete = async () => {
  if (!deleteTarget.value) return
  deleting.value = true
  try {
    await api.delete(`/api/v1/soundtracks/${deleteTarget.value.id}`)
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

const fmtDuration = (seconds) => {
  if (!seconds || seconds <= 0) return '—'
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return `${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`
  return `${m}:${String(s).padStart(2,'0')}`
}

const fmtSize = (bytes) => {
  if (!bytes || bytes <= 0) return '—'
  if (bytes < 1024)       return bytes + ' B'
  if (bytes < 1048576)    return (bytes / 1024).toFixed(1) + ' KB'
  if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + ' MB'
  return (bytes / 1073741824).toFixed(2) + ' GB'
}

onMounted(fetchAll)
</script>

<style scoped>
.slist { direction: rtl; max-width: 1300px; margin: 0 auto; }
.slist__head { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; margin-bottom: 1.2rem; }
.slist__title { margin: 0 0 .3rem; font-size: clamp(1.2rem, 2.5vw, 2rem); font-weight: 900; color: #2E2D29; }
.slist__sub { margin: 0; color: #767571; font-weight: 600; }
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
.badges { display: flex; flex-wrap: wrap; gap: .3rem; }
.badge { display: inline-block; padding: .18rem .55rem; border-radius: 99px; font-size: .72rem; font-weight: 700; white-space: nowrap; }
.badge--type   { background: rgba(15,118,110,.08);  color: #0f766e; border: 1px solid rgba(15,118,110,.15); }
.badge--single { background: rgba(67,56,202,.08);   color: #4338ca; border: 1px solid rgba(67,56,202,.15); }
.badge--multi  { background: rgba(161,98,7,.08);    color: #a16207; border: 1px solid rgba(161,98,7,.15); }
.badge--album  { background: rgba(190,24,93,.08);   color: #be185d; border: 1px solid rgba(190,24,93,.2); }
.badge--normal { background: rgba(100,116,139,.08); color: #64748b; border: 1px solid rgba(100,116,139,.15); }
.topic-pill { display: inline-flex; align-items: center; gap: .3rem; padding: .2rem .6rem; border-radius: 99px; background: rgba(140,21,21,.07); color: #8C1515; border: 1px solid rgba(140,21,21,.15); font-size: .75rem; font-weight: 700; max-width: 130px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.file-count { display: inline-flex; align-items: center; gap: .3rem; font-size: .78rem; color: #767571; font-weight: 600; }
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
/* ── Detail Modal ── */
.dk-bg { position: fixed; inset: 0; z-index: 1000; background: rgba(10,8,6,.6); backdrop-filter: blur(6px); display: flex; align-items: center; justify-content: center; padding: 1rem; }
.dk { background: #FDFCFB; border-radius: 20px; width: 100%; max-width: 820px; max-height: 92vh; overflow-y: auto; box-shadow: 0 32px 80px rgba(0,0,0,.3), 0 0 0 1px rgba(0,0,0,.06); position: relative; animation: dk-enter .35s cubic-bezier(.16,1,.3,1) both; }
.dk--memories { box-shadow: 0 32px 80px rgba(140,21,21,.2), 0 0 0 1px rgba(190,24,93,.15), 0 0 60px rgba(190,24,93,.08); }
@keyframes dk-enter { from { opacity: 0; transform: scale(.95) translateY(16px); } to { opacity: 1; transform: scale(1) translateY(0); } }
.dk__close { position: absolute; top: 12px; left: 12px; z-index: 20; width: 36px; height: 36px; border-radius: 50%; background: rgba(255,255,255,.92); border: 1px solid rgba(0,0,0,.08); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: .2s; color: #6E6B66; }
.dk__close:hover { background: #fff; color: #2E2D29; transform: scale(1.08); }
.dk__hero { position: relative; min-height: 240px; background: linear-gradient(135deg, #1a0505 0%, #4a1010 40%, #8C1515 100%); background-size: cover; background-position: center; border-radius: 20px 20px 0 0; overflow: hidden; }
.dk__hero-hover { position: absolute; inset: 0; background-size: cover; background-position: center; opacity: 0; transition: opacity .22s ease; pointer-events: none; }
.dk__hero:hover .dk__hero-hover { opacity: 1; }
.dk__hero-grain { position: absolute; inset: 0; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E"); pointer-events: none; }
.dk__hero-gradient { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,.82) 0%, rgba(0,0,0,.3) 40%, transparent 70%); pointer-events: none; }
.dk__hero-content { position: relative; z-index: 5; padding: 1.5rem 1.5rem 1.3rem; display: flex; flex-direction: column; justify-content: flex-end; min-height: 240px; gap: .55rem; }
.dk__ribbon { display: inline-flex; align-items: center; gap: .45rem; padding: .4rem .85rem; border-radius: 99px; background: linear-gradient(135deg, rgba(190,24,93,.9), rgba(220,38,93,.85)); color: #fff; font-size: .78rem; font-weight: 800; backdrop-filter: blur(4px); box-shadow: 0 4px 16px rgba(190,24,93,.35); align-self: flex-start; animation: ribbon-glow 3s ease-in-out infinite alternate; }
@keyframes ribbon-glow { from { box-shadow: 0 4px 16px rgba(190,24,93,.35); } to { box-shadow: 0 4px 24px rgba(190,24,93,.55); } }
.dk__hero-badges { display: flex; flex-wrap: wrap; gap: .35rem; }
.dk__badge { display: inline-flex; align-items: center; gap: .25rem; padding: .22rem .6rem; border-radius: 99px; font-size: .72rem; font-weight: 700; backdrop-filter: blur(8px); }
.dk__badge--type     { background: rgba(255,255,255,.15); color: rgba(255,255,255,.9); border: 1px solid rgba(255,255,255,.18); }
.dk__badge--single   { background: rgba(99,102,241,.25);  color: #c7d2fe; border: 1px solid rgba(99,102,241,.3); }
.dk__badge--multi    { background: rgba(245,158,11,.25);  color: #fde68a; border: 1px solid rgba(245,158,11,.3); }
.dk__badge--topic    { background: rgba(140,21,21,.4);    color: #fecdd3; border: 1px solid rgba(255,255,255,.15); }
.dk__badge--hover    { background: rgba(124,58,237,.35);  color: #e9d5ff; border: 1px solid rgba(124,58,237,.4); }
.dk__badge--lang     { background: rgba(255,255,255,.12); color: rgba(255,255,255,.85); border: 1px solid rgba(255,255,255,.2); font-size: .7rem; }
.dk__hero-title      { color: #fff; font-size: 1.45rem; font-weight: 900; margin: 0; line-height: 1.35; letter-spacing: -.01em; }
.dk__hero-subtitle   { color: rgba(255,255,255,.6); font-size: .88rem; margin: 0; font-weight: 600; }
.dk__hero-stats      { display: flex; gap: .9rem; margin-top: .25rem; flex-wrap: wrap; }
.dk__stat { display: inline-flex; align-items: center; gap: .3rem; font-size: .76rem; font-weight: 700; color: rgba(255,255,255,.7); }
.dk__stat--institute { color: #fde68a; }
.dk__body { padding: 1.4rem 1.5rem; display: flex; flex-direction: column; gap: 1.5rem; }
.dk__sec-head { display: flex; align-items: center; gap: .5rem; font-size: .82rem; font-weight: 800; color: #8C1515; text-transform: uppercase; letter-spacing: .06em; padding-bottom: .6rem; border-bottom: 2px solid rgba(140,21,21,.1); margin-bottom: .85rem; flex-wrap: wrap; }
.dk__sec-count { background: rgba(140,21,21,.08); border: 1px solid rgba(140,21,21,.15); border-radius: 99px; padding: .1rem .5rem; font-size: .72rem; color: #8C1515; }
.dk__covers-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: .85rem; }
@media (max-width: 600px) { .dk__covers-grid { grid-template-columns: 1fr 1fr; } }
.dk__cover-item { display: flex; flex-direction: column; gap: .4rem; }
.dk__cover-item--empty { opacity: .45; }
.dk__cover-label { display: inline-flex; align-items: center; gap: .25rem; padding: .18rem .55rem; border-radius: 6px; font-size: .7rem; font-weight: 800; align-self: flex-start; }
.dk__cover-label--ckb   { background: rgba(200,168,0,.12); color: #8a7000; border: 1px solid rgba(200,168,0,.2); }
.dk__cover-label--kmr   { background: rgba(74,122,240,.1);  color: #2d5ac0; border: 1px solid rgba(74,122,240,.18); }
.dk__cover-label--hover { background: rgba(124,58,237,.08); color: #6d28d9; border: 1px solid rgba(124,58,237,.18); }
.dk__cover-img-wrap { border-radius: 10px; overflow: hidden; border: 1px solid #E8E5E0; aspect-ratio: 1/1; background: #F0EEEB; position: relative; }
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
.dk__desc { font-size: .88rem; color: #3E3C38; line-height: 1.7; margin: 0 0 .5rem; }
.dk__reading { display: flex; align-items: center; gap: .4rem; font-size: .82rem; color: #767571; padding: .5rem .7rem; border-radius: 8px; background: #FAFAF9; border: 1px solid #F0EEEB; }
.dk__reading strong { color: #2E2D29; }
/* Tracks */
.dk__tracks { display: flex; flex-direction: column; gap: .65rem; }
.dk__track { display: flex; gap: .7rem; padding: .85rem 1rem; background: #fff; border: 1px solid #EEECE8; border-radius: 12px; transition: .15s; }
.dk__track:hover { border-color: rgba(140,21,21,.2); box-shadow: 0 2px 12px rgba(140,21,21,.06); }
.dk__track-num { width: 28px; height: 28px; border-radius: 50%; background: linear-gradient(135deg, #8C1515, #a31d1d); color: #fff; font-size: .72rem; font-weight: 900; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: .1rem; }
.dk__track-body { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: .4rem; }
.dk__track-top { display: flex; align-items: center; justify-content: space-between; gap: .5rem; flex-wrap: wrap; }
.dk__track-name { font-weight: 700; font-size: .88rem; color: #2E2D29; }
.dk__track-meta { display: flex; align-items: center; gap: .4rem; flex-wrap: wrap; }
.dk__track-chip { padding: .12rem .45rem; border-radius: 5px; background: rgba(15,118,110,.07); color: #0f766e; border: 1px solid rgba(15,118,110,.12); font-size: .68rem; font-weight: 800; }
.dk__track-dur, .dk__track-size { font-size: .74rem; color: #9E9A94; font-weight: 600; }
.dk__track-player { width: 100%; height: 34px; border-radius: 8px; }
.dk__track-links { display: flex; gap: .6rem; flex-wrap: wrap; }
.dk__ext-link { display: inline-flex; align-items: center; gap: .3rem; font-size: .8rem; font-weight: 700; color: #4338ca; text-decoration: none; padding: .35rem .65rem; border-radius: 8px; background: rgba(67,56,202,.06); border: 1px solid rgba(67,56,202,.12); transition: .15s; }
.dk__ext-link:hover { background: rgba(67,56,202,.12); }
.dk__ext-link--embed { color: #7c3aed; background: rgba(124,58,237,.06); border-color: rgba(124,58,237,.12); }
.dk__ext-link--embed:hover { background: rgba(124,58,237,.12); }
/* Topic */
.dk__topic-card { display: flex; align-items: center; gap: .75rem; padding: .9rem 1rem; border-radius: 12px; background: rgba(140,21,21,.04); border: 1.5px solid rgba(140,21,21,.12); }
.dk__topic-icon { font-size: 1.4rem; }
.dk__topic-info { display: flex; flex-direction: column; gap: .15rem; }
.dk__topic-name { font-weight: 800; font-size: .92rem; color: #8C1515; }
.dk__topic-name-alt { font-size: .82rem; color: #767571; font-weight: 600; }
.dk__topic-id { font-size: .72rem; color: #B0ADA7; font-weight: 600; }
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
/* Locations */
.dk__locations { display: flex; flex-wrap: wrap; gap: .5rem; }
.dk__loc-card { display: inline-flex; align-items: center; gap: .35rem; padding: .5rem .8rem; border-radius: 10px; background: rgba(161,98,7,.06); border: 1px solid rgba(161,98,7,.14); color: #92640a; font-size: .84rem; font-weight: 700; }
.dk__loc-pin { font-size: .9rem; }
/* ✅ Director & Institute */
.dk__director-row { display: flex; gap: .85rem; flex-wrap: wrap; }
.dk__director-card { display: flex; align-items: center; gap: .75rem; flex: 1; min-width: 180px; padding: .9rem 1rem; border-radius: 12px; background: rgba(67,56,202,.04); border: 1.5px solid rgba(67,56,202,.12); }
.dk__director-avatar { width: 40px; height: 40px; border-radius: 50%; background: rgba(67,56,202,.1); border: 1px solid rgba(67,56,202,.2); display: flex; align-items: center; justify-content: center; color: #4338ca; flex-shrink: 0; }
.dk__director-info { display: flex; flex-direction: column; gap: .1rem; }
.dk__director-label { font-size: .7rem; font-weight: 700; color: #9E9A94; text-transform: uppercase; letter-spacing: .04em; }
.dk__director-name { font-size: .92rem; font-weight: 800; color: #2E2D29; }
.dk__institute-card { display: flex; align-items: center; gap: .75rem; flex: 1; min-width: 180px; padding: .9rem 1rem; border-radius: 12px; }
.dk__institute-card--yes { background: rgba(15,118,110,.05); border: 1.5px solid rgba(15,118,110,.2); }
.dk__institute-card--no  { background: rgba(100,116,139,.04); border: 1.5px solid rgba(100,116,139,.12); }
.dk__institute-icon { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.dk__institute-card--yes .dk__institute-icon { background: rgba(15,118,110,.1); border: 1px solid rgba(15,118,110,.2); color: #0f766e; }
.dk__institute-card--no  .dk__institute-icon { background: rgba(100,116,139,.08); border: 1px solid rgba(100,116,139,.15); color: #64748b; }
.dk__institute-info { display: flex; flex-direction: column; gap: .1rem; }
.dk__institute-label { font-size: .7rem; font-weight: 700; color: #9E9A94; text-transform: uppercase; letter-spacing: .04em; }
.dk__institute-value { font-size: .92rem; font-weight: 800; }
.dk__institute-card--yes .dk__institute-value { color: #0f766e; }
.dk__institute-card--no  .dk__institute-value { color: #64748b; }
/* ✅ Language Cards */
.dk__lang-cards { display: flex; gap: .75rem; flex-wrap: wrap; }
.dk__lang-card { display: flex; align-items: center; gap: .75rem; padding: .85rem 1.1rem; border-radius: 12px; flex: 1; min-width: 160px; }
.dk__lang-card--ckb { background: rgba(200,168,0,.07); border: 1.5px solid rgba(200,168,0,.2); }
.dk__lang-card--kmr { background: rgba(74,122,240,.06); border: 1.5px solid rgba(74,122,240,.18); }
.dk__lang-card-flag { font-size: 1.4rem; flex-shrink: 0; }
.dk__lang-card-info { display: flex; flex-direction: column; gap: .1rem; flex: 1; }
.dk__lang-card-code { font-size: .7rem; font-weight: 800; letter-spacing: .06em; }
.dk__lang-card--ckb .dk__lang-card-code { color: #8a7000; }
.dk__lang-card--kmr .dk__lang-card-code { color: #2d5ac0; }
.dk__lang-card-name { font-size: .86rem; font-weight: 700; color: #2E2D29; }
.dk__lang-card-check { flex-shrink: 0; }
.dk__lang-card--ckb .dk__lang-card-check { color: #ca8a04; }
.dk__lang-card--kmr .dk__lang-card-check { color: #3b6fd4; }
/* Info Grid */
.dk__info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0; border: 1px solid #EEECE8; border-radius: 12px; overflow: hidden; background: #fff; }
@media (max-width: 500px) { .dk__info-grid { grid-template-columns: 1fr; } }
.dk__info-item { display: flex; align-items: flex-start; gap: .65rem; padding: .75rem 1rem; border-bottom: 1px solid #F5F3F0; border-left: 1px solid #F5F3F0; }
.dk__info-item:nth-child(odd) { border-left: none; }
@media (max-width: 500px) { .dk__info-item { border-left: none !important; } }
.dk__info-item:last-child, .dk__info-item:nth-last-child(2):nth-child(odd) { border-bottom: none; }
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
@keyframes spin { to { transform: rotate(360deg); } }
.modal-enter-active, .modal-leave-active { transition: all .25s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-from .modal, .modal-leave-to .modal { transform: scale(.96) translateY(12px); }
.modal-enter-from .dk,    .modal-leave-to .dk    { transform: scale(.96) translateY(12px); }
</style>