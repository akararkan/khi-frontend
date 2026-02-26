<template>
  <div class="vlist" dir="rtl">

    <!-- ── Header ─────────────────────────────────────────────────── -->
    <div class="vlist__head">
      <div class="vlist__head-text">
        <h1 class="vlist__title">
          <span class="vlist__title-accent">ڤیدیۆ</span>کان
        </h1>
        <p class="vlist__sub">لیستی هەموو تۆمارە ڤیدیۆییەکان</p>
      </div>
      <RouterLink class="btn btn--primary" :to="{ name: 'AdminVideoCreate' }">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        ڤیدیۆی نوێ
      </RouterLink>
    </div>

    <!-- ── Toolbar ─────────────────────────────────────────────────── -->
    <div class="toolbar">
      <div class="toolbar__search">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>
        <input v-model="search" type="text" placeholder="گەڕان بە ناو، تاگ، بابەت..." />
      </div>
      <select v-model="filterLang" class="toolbar__select">
        <option value="">هەموو زمانەکان</option>
        <option value="CKB">سۆرانی</option>
        <option value="KMR">کرمانجی</option>
      </select>
      <select v-model="filterType" class="toolbar__select">
        <option value="">هەموو جۆرەکان</option>
        <option value="FILM">فیلم</option>
        <option value="VIDEO_CLIP">ڤیدیۆ کلیپ</option>
      </select>
      <select v-model="filterTopic" class="toolbar__select">
        <option value="">هەموو بابەتەکان</option>
        <option v-for="t in availableTopics" :key="t.id" :value="t.id">{{ t.nameCkb || t.nameKmr }}</option>
      </select>
      <select v-model="filterAlbum" class="toolbar__select">
        <option value="">هەموو</option>
        <option value="true">ئەلبوومی بیرەوەرییەکان</option>
        <option value="false">ئاسایی</option>
      </select>
    </div>

    <!-- ── Loading ─────────────────────────────────────────────────── -->
    <div v-if="loading" class="state-card">
      <div class="state-spinner"></div>
      <span>ڤیدیۆکان باردەکرێن...</span>
    </div>

    <!-- ── Empty ───────────────────────────────────────────────────── -->
    <div v-else-if="!filtered.length" class="state-card state-card--empty">
      <div class="state-card__icon">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>
      </div>
      <div class="state-card__title">هیچ ڤیدیۆیەک نەدۆزرایەوە</div>
      <div class="state-card__sub">فلتەرەکان بگۆڕە یان ڤیدیۆی نوێ زیاد بکە.</div>
      <RouterLink class="btn btn--primary btn--sm" :to="{ name: 'AdminVideoCreate' }">ڤیدیۆی نوێ</RouterLink>
    </div>

    <!-- ── Table ───────────────────────────────────────────────────── -->
    <div v-else class="panel">
      <table class="table">
        <thead>
          <tr>
            <th style="width:44px">#</th>
            <th style="width:60px">کڤەر</th>
            <th>ناو</th>
            <th>جۆر</th>
            <th>بابەت</th>
            <th>زمان</th>
            <th>بیرەوەری</th>
            <th>ماوە</th>
            <th>بڵاوکردنەوە</th>
            <th style="width:80px">کردار</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, idx) in filtered"
            :key="item.id"
            @click="openDetail(item)"
            class="table__row"
          >
            <td class="table__num">{{ idx + 1 }}</td>

            <!-- Cover cell -->
            <td>
              <div class="cover-wrap">
                <div class="cover-frame">
                  <img v-if="item.baseCoverUrl" class="cover-frame__base" :src="item.baseCoverUrl" alt="" />
                  <img v-if="item.hoverCoverUrl" class="cover-frame__hover" :src="item.hoverCoverUrl" alt="" />
                  <div v-if="!item.baseCoverUrl" class="cover-frame__empty">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>
                  </div>
                </div>
                <span v-if="item.hoverCoverUrl" class="cover-h-dot" title="Hover Image">H</span>
              </div>
            </td>

            <!-- Title -->
            <td>
              <div class="title-stack">
                <span class="title-stack__main">{{ item.titleCkb || item.titleKmr || '—' }}</span>
                <span v-if="item.titleCkb && item.titleKmr" class="title-stack__sub">{{ item.titleKmr }}</span>
              </div>
            </td>

            <!-- Type -->
            <td>
              <span class="chip" :class="item.videoType === 'FILM' ? 'chip--film' : 'chip--clip'">
                <span class="chip__dot"></span>
                {{ item.videoType === 'FILM' ? 'فیلم' : 'کلیپ' }}
              </span>
            </td>

            <!-- Topic -->
            <td>
              <span v-if="item.topic" class="topic-tag">{{ item.topic.nameCkb || item.topic.nameKmr }}</span>
              <span v-else class="muted">—</span>
            </td>

            <!-- Language -->
            <td>
              <div class="lang-flags" v-if="(item.contentLanguages||[]).length">
                <span v-for="l in item.contentLanguages" :key="l" class="lang-flag" :class="`lang-flag--${l.toLowerCase()}`">{{ l }}</span>
              </div>
              <span v-else class="muted">—</span>
            </td>

            <!-- Album of memories -->
            <td>
              <span v-if="item.videoType === 'VIDEO_CLIP'" class="chip" :class="item.albumOfMemories ? 'chip--mem' : 'chip--gray'">
                {{ item.albumOfMemories ? '❤ بیرەوەری' : 'ئاسایی' }}
              </span>
              <span v-else class="muted">—</span>
            </td>

            <td class="mono">{{ fmtDuration(item.durationSeconds) }}</td>
            <td class="mono">{{ fmtDate(item.publishmentDate || item.createdAt) }}</td>

            <!-- Actions -->
            <td @click.stop>
              <div class="act-btns">
                <RouterLink :to="{ name: 'AdminVideoEdit', params: { id: item.id } }" class="icon-btn icon-btn--edit" title="دەستکاری">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4z"/></svg>
                </RouterLink>
                <button class="icon-btn icon-btn--del" title="سڕینەوە" @click="confirmDelete(item)">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="pag">
        <button class="pag__btn" :disabled="currentPage === 0" @click="goPage(currentPage - 1)">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
        <span class="pag__info">{{ currentPage + 1 }} <span class="pag__sep">/</span> {{ totalPages }}</span>
        <button class="pag__btn" :disabled="currentPage >= totalPages - 1" @click="goPage(currentPage + 1)">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════════════════
         DETAIL MODAL  — cinematic full-spec popup
    ═══════════════════════════════════════════════════════════════════ -->
    <Teleport to="body">
      <Transition name="vmodal">
        <div v-if="detailItem" class="vd-bg" @click.self="detailItem = null">
          <div class="vd" :class="{ 'vd--memories': detailItem.albumOfMemories && detailItem.videoType === 'VIDEO_CLIP' }">

            <!-- Close -->
            <button class="vd__x" @click="detailItem = null" aria-label="داخستن">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>

            <!-- ── HERO ─────────────────────────────────────────────── -->
            <div class="vd__hero" :style="detailItem.baseCoverUrl ? `--hero-img:url(${detailItem.baseCoverUrl})` : ''">
              <!-- hover image overlay -->
              <div v-if="detailItem.hoverCoverUrl" class="vd__hero-hover" :style="`background-image:url(${detailItem.hoverCoverUrl})`"></div>
              <div class="vd__hero-noise"></div>
              <div class="vd__hero-grad"></div>

              <!-- album of memories ribbon -->
              <div v-if="detailItem.albumOfMemories && detailItem.videoType === 'VIDEO_CLIP'" class="vd__ribbon">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
                ئەلبوومی بیرەوەرییەکان
              </div>

              <div class="vd__hero-body">
                <!-- badges row -->
                <div class="vd__badges">
                  <span class="vd__b" :class="detailItem.videoType === 'FILM' ? 'vd__b--film' : 'vd__b--clip'">
                    {{ detailItem.videoType === 'FILM' ? '🎬 فیلم' : '🎞 ڤیدیۆ کلیپ' }}
                  </span>
                  <span v-if="detailItem.resolution" class="vd__b vd__b--tech">{{ detailItem.resolution }}</span>
                  <span v-if="detailItem.fileFormat" class="vd__b vd__b--tech">{{ detailItem.fileFormat.toUpperCase() }}</span>
                  <span v-if="detailItem.topic" class="vd__b vd__b--topic">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
                    {{ detailItem.topic.nameCkb || detailItem.topic.nameKmr }}
                  </span>
                  <span v-for="l in (detailItem.contentLanguages||[])" :key="l" class="vd__b vd__b--lang">{{ l }}</span>
                </div>

                <h2 class="vd__hero-title">{{ detailItem.titleCkb || detailItem.titleKmr || 'بێ ناو' }}</h2>
                <p v-if="detailItem.titleCkb && detailItem.titleKmr" class="vd__hero-alt">{{ detailItem.titleKmr }}</p>

                <!-- quick stats bar -->
                <div class="vd__qstats">
                  <div v-if="detailItem.durationSeconds" class="vd__qs">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    {{ fmtDuration(detailItem.durationSeconds) }}
                  </div>
                  <div v-if="detailItem.fileSizeMb" class="vd__qs">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    {{ detailItem.fileSizeMb.toFixed(1) }} MB
                  </div>
                  <div v-if="detailItem.videoType === 'VIDEO_CLIP' && detailItem.videoClipItems?.length" class="vd__qs">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="2"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/></svg>
                    {{ detailItem.videoClipItems.length }} کلیپ
                  </div>
                  <div v-if="detailItem.publishmentDate" class="vd__qs">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/></svg>
                    {{ fmtDate(detailItem.publishmentDate) }}
                  </div>
                  <div class="vd__qs vd__qs--id"># {{ detailItem.id }}</div>
                </div>
              </div>
            </div>

            <!-- ── BODY ────────────────────────────────────────────── -->
            <div class="vd__body">

              <!-- ①  THREE COVER IMAGES ──────────────────────────── -->
              <section class="vd__sec" v-if="detailItem.ckbCoverUrl || detailItem.kmrCoverUrl || detailItem.hoverCoverUrl">
                <h3 class="vd__sec-title">
                  <span class="vd__sec-icon">🖼</span>
                  وێنەی کڤەر
                </h3>
                <div class="covers-grid">
                  <!-- CKB cover -->
                  <div v-if="detailItem.ckbCoverUrl" class="cover-card cover-card--ckb">
                    <div class="cover-card__badge">CKB · سۆرانی</div>
                    <div class="cover-card__img-wrap">
                      <img :src="detailItem.ckbCoverUrl" alt="CKB Cover" loading="lazy" />
                    </div>
                    <a :href="detailItem.ckbCoverUrl" target="_blank" rel="noopener" class="cover-card__link">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                      بینینی تەواو
                    </a>
                  </div>

                  <!-- KMR cover -->
                  <div v-if="detailItem.kmrCoverUrl" class="cover-card cover-card--kmr">
                    <div class="cover-card__badge">KMR · کورمانجی</div>
                    <div class="cover-card__img-wrap">
                      <img :src="detailItem.kmrCoverUrl" alt="KMR Cover" loading="lazy" />
                    </div>
                    <a :href="detailItem.kmrCoverUrl" target="_blank" rel="noopener" class="cover-card__link">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                      بینینی تەواو
                    </a>
                  </div>

                  <!-- Hover cover -->
                  <div v-if="detailItem.hoverCoverUrl" class="cover-card cover-card--hover">
                    <div class="cover-card__badge">HOVER</div>
                    <div class="cover-card__img-wrap cover-card__img-wrap--hover">
                      <img :src="detailItem.hoverCoverUrl" alt="Hover Cover" loading="lazy" />
                      <div class="cover-card__hover-label">ژێر مەوس</div>
                    </div>
                    <a :href="detailItem.hoverCoverUrl" target="_blank" rel="noopener" class="cover-card__link cover-card__link--hover">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                      بینینی تەواو
                    </a>
                  </div>
                </div>
              </section>

              <!-- ②  BILINGUAL CONTENT ──────────────────────────── -->
              <section class="vd__sec" v-if="detailItem.descriptionCkb || detailItem.descriptionKmr || detailItem.directorCkb || detailItem.directorKmr || detailItem.producerCkb || detailItem.producerKmr || detailItem.locationCkb || detailItem.locationKmr">
                <h3 class="vd__sec-title">
                  <span class="vd__sec-icon">📝</span>
                  ناوەڕۆک و وەسف
                </h3>
                <div class="bilingual-grid">
                  <!-- CKB column -->
                  <div class="bilingual-col bilingual-col--ckb" v-if="detailItem.descriptionCkb || detailItem.directorCkb || detailItem.producerCkb || detailItem.locationCkb">
                    <div class="bilingual-col__lang">
                      <span class="lang-dot lang-dot--ckb"></span>
                      سۆرانی
                    </div>
                    <p v-if="detailItem.descriptionCkb" class="bilingual-col__desc">{{ detailItem.descriptionCkb }}</p>
                    <div class="bilingual-col__meta">
                      <div v-if="detailItem.directorCkb" class="bmeta">
                        <span class="bmeta__label">🎬 دەرهێنەر</span>
                        <strong class="bmeta__val">{{ detailItem.directorCkb }}</strong>
                      </div>
                      <div v-if="detailItem.producerCkb" class="bmeta">
                        <span class="bmeta__label">🎥 بەرهەمهێنەر</span>
                        <strong class="bmeta__val">{{ detailItem.producerCkb }}</strong>
                      </div>
                      <div v-if="detailItem.locationCkb" class="bmeta">
                        <span class="bmeta__label">📍 شوێن</span>
                        <strong class="bmeta__val">{{ detailItem.locationCkb }}</strong>
                      </div>
                    </div>
                  </div>
                  <!-- KMR column -->
                  <div class="bilingual-col bilingual-col--kmr" v-if="detailItem.descriptionKmr || detailItem.directorKmr || detailItem.producerKmr || detailItem.locationKmr">
                    <div class="bilingual-col__lang">
                      <span class="lang-dot lang-dot--kmr"></span>
                      کورمانجی
                    </div>
                    <p v-if="detailItem.descriptionKmr" class="bilingual-col__desc">{{ detailItem.descriptionKmr }}</p>
                    <div class="bilingual-col__meta">
                      <div v-if="detailItem.directorKmr" class="bmeta">
                        <span class="bmeta__label">🎬 دەرهێنەر</span>
                        <strong class="bmeta__val">{{ detailItem.directorKmr }}</strong>
                      </div>
                      <div v-if="detailItem.producerKmr" class="bmeta">
                        <span class="bmeta__label">🎥 بەرهەمهێنەر</span>
                        <strong class="bmeta__val">{{ detailItem.producerKmr }}</strong>
                      </div>
                      <div v-if="detailItem.locationKmr" class="bmeta">
                        <span class="bmeta__label">📍 شوێن</span>
                        <strong class="bmeta__val">{{ detailItem.locationKmr }}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <!-- ③  FILM — single video source ────────────────── -->
              <section class="vd__sec" v-if="detailItem.videoType === 'FILM' && (detailItem.sourceUrl || detailItem.sourceExternalUrl || detailItem.sourceEmbedUrl)">
                <h3 class="vd__sec-title">
                  <span class="vd__sec-icon">▶</span>
                  سەرچاوەی ڤیدیۆ
                </h3>
                <div class="player-wrap">
                  <div v-if="detailItem.sourceEmbedUrl" class="player-embed">
                    <iframe :src="detailItem.sourceEmbedUrl" frameborder="0" allowfullscreen></iframe>
                  </div>
                  <div v-else-if="detailItem.sourceUrl" class="player-native">
                    <video controls :src="detailItem.sourceUrl" preload="metadata"></video>
                  </div>
                </div>
                <!-- source links row -->
                <div class="src-links">
                  <a v-if="detailItem.sourceUrl" :href="detailItem.sourceUrl" target="_blank" rel="noopener" class="src-link">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    فایل ڕاستەوخۆ
                  </a>
                  <a v-if="detailItem.sourceExternalUrl" :href="detailItem.sourceExternalUrl" target="_blank" rel="noopener" class="src-link src-link--ext">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                    بەستەری دەرەکی
                  </a>
                  <a v-if="detailItem.sourceEmbedUrl" :href="detailItem.sourceEmbedUrl" target="_blank" rel="noopener" class="src-link src-link--embed">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
                    Embed URL
                  </a>
                </div>
              </section>

              <!-- ④  VIDEO_CLIP — tracks list ───────────────────── -->
              <section class="vd__sec" v-if="detailItem.videoType === 'VIDEO_CLIP' && detailItem.videoClipItems?.length">
                <h3 class="vd__sec-title">
                  <span class="vd__sec-icon">🎞</span>
                  کلیپەکان
                  <span class="vd__sec-count">{{ detailItem.videoClipItems.length }}</span>
                </h3>
                <div class="tracks">
                  <div v-for="(clip, ci) in detailItem.videoClipItems" :key="clip.id || ci" class="track">
                    <!-- number -->
                    <div class="track__num">{{ clip.clipNumber ?? (ci + 1) }}</div>

                    <!-- info body -->
                    <div class="track__body">
                      <!-- title row -->
                      <div class="track__titles">
                        <span class="track__t-main">{{ clip.titleCkb || clip.titleKmr || `کلیپ ${clip.clipNumber ?? (ci + 1)}` }}</span>
                        <span v-if="clip.titleCkb && clip.titleKmr" class="track__t-alt">{{ clip.titleKmr }}</span>
                      </div>

                      <!-- description -->
                      <p v-if="clip.descriptionCkb || clip.descriptionKmr" class="track__desc">
                        {{ clip.descriptionCkb || clip.descriptionKmr }}
                      </p>

                      <!-- meta chips -->
                      <div class="track__meta">
                        <span v-if="clip.durationSeconds" class="track__chip">⏱ {{ fmtDuration(clip.durationSeconds) }}</span>
                        <span v-if="clip.resolution" class="track__chip">📐 {{ clip.resolution }}</span>
                        <span v-if="clip.fileFormat" class="track__chip">📁 {{ clip.fileFormat.toUpperCase() }}</span>
                        <span v-if="clip.fileSizeMb" class="track__chip">💾 {{ clip.fileSizeMb.toFixed(1) }} MB</span>
                      </div>

                      <!-- player / links -->
                      <video v-if="clip.url" controls class="track__player" :src="clip.url" preload="none"></video>
                      <div v-else-if="clip.embedUrl" class="track__embed">
                        <iframe :src="clip.embedUrl" frameborder="0" allowfullscreen></iframe>
                      </div>
                      <div class="track__links">
                        <a v-if="clip.url" :href="clip.url" target="_blank" rel="noopener" class="track__link">فایل</a>
                        <a v-if="clip.externalUrl" :href="clip.externalUrl" target="_blank" rel="noopener" class="track__link track__link--ext">دەرەکی</a>
                        <a v-if="clip.embedUrl" :href="clip.embedUrl" target="_blank" rel="noopener" class="track__link track__link--embed">Embed</a>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <!-- ⑤  TECHNICAL METADATA ────────────────────────── -->
              <section class="vd__sec">
                <h3 class="vd__sec-title">
                  <span class="vd__sec-icon">⚙</span>
                  زانیاری تەکنیکی
                </h3>
                <div class="meta-grid">
                  <div class="meta-item">
                    <span class="meta-item__label">ناسنامە</span>
                    <span class="meta-item__val meta-item__val--id">#{{ detailItem.id }}</span>
                  </div>
                  <div class="meta-item">
                    <span class="meta-item__label">جۆری ڤیدیۆ</span>
                    <span class="meta-item__val">{{ detailItem.videoType }}</span>
                  </div>
                  <div class="meta-item" v-if="detailItem.resolution">
                    <span class="meta-item__label">ریزووڵوشن</span>
                    <span class="meta-item__val">{{ detailItem.resolution }}</span>
                  </div>
                  <div class="meta-item" v-if="detailItem.fileFormat">
                    <span class="meta-item__label">فۆرماتی فایل</span>
                    <span class="meta-item__val">{{ detailItem.fileFormat.toUpperCase() }}</span>
                  </div>
                  <div class="meta-item" v-if="detailItem.durationSeconds">
                    <span class="meta-item__label">ماوە</span>
                    <span class="meta-item__val">{{ fmtDuration(detailItem.durationSeconds) }}</span>
                  </div>
                  <div class="meta-item" v-if="detailItem.fileSizeMb">
                    <span class="meta-item__label">قەبارەی فایل</span>
                    <span class="meta-item__val">{{ detailItem.fileSizeMb.toFixed(2) }} MB</span>
                  </div>
                  <div class="meta-item" v-if="detailItem.publishmentDate">
                    <span class="meta-item__label">بڵاوکردنەوە</span>
                    <span class="meta-item__val">{{ fmtDate(detailItem.publishmentDate) }}</span>
                  </div>
                  <div class="meta-item">
                    <span class="meta-item__label">CKB Cover</span>
                    <span class="meta-item__val" :class="detailItem.ckbCoverUrl ? 'meta-item__val--yes' : 'meta-item__val--no'">
                      {{ detailItem.ckbCoverUrl ? '✓ هەیە' : '✗ نییە' }}
                    </span>
                  </div>
                  <div class="meta-item">
                    <span class="meta-item__label">KMR Cover</span>
                    <span class="meta-item__val" :class="detailItem.kmrCoverUrl ? 'meta-item__val--yes' : 'meta-item__val--no'">
                      {{ detailItem.kmrCoverUrl ? '✓ هەیە' : '✗ نییە' }}
                    </span>
                  </div>
                  <div class="meta-item">
                    <span class="meta-item__label">Hover Cover</span>
                    <span class="meta-item__val" :class="detailItem.hoverCoverUrl ? 'meta-item__val--yes' : 'meta-item__val--no'">
                      {{ detailItem.hoverCoverUrl ? '✓ هەیە' : '✗ نییە' }}
                    </span>
                  </div>
                  <div class="meta-item" v-if="detailItem.videoType === 'VIDEO_CLIP'">
                    <span class="meta-item__label">ئەلبوومی بیرەوەرییەکان</span>
                    <span class="meta-item__val" :class="detailItem.albumOfMemories ? 'meta-item__val--yes' : ''">
                      {{ detailItem.albumOfMemories ? '❤ بەڵێ' : 'نەخێر' }}
                    </span>
                  </div>
                  <div class="meta-item" v-if="detailItem.topic">
                    <span class="meta-item__label">بابەت (Topic)</span>
                    <span class="meta-item__val">{{ detailItem.topic.nameCkb || detailItem.topic.nameKmr }}</span>
                  </div>
                </div>
              </section>

              <!-- ⑥  TAGS & KEYWORDS ──────────────────────────── -->
              <section class="vd__sec" v-if="(detailItem.tagsCkb?.length || detailItem.tagsKmr?.length || detailItem.keywordsCkb?.length || detailItem.keywordsKmr?.length)">
                <h3 class="vd__sec-title">
                  <span class="vd__sec-icon">🏷</span>
                  تاگ و کیووەردەکان
                </h3>
                <div class="tags-section">
                  <!-- Tags CKB -->
                  <div v-if="detailItem.tagsCkb?.length" class="tags-group">
                    <div class="tags-group__label tags-group__label--ckb">تاگی سۆرانی</div>
                    <div class="tags-group__items">
                      <span v-for="t in detailItem.tagsCkb" :key="t" class="tag-pill tag-pill--ckb">{{ t }}</span>
                    </div>
                  </div>
                  <!-- Tags KMR -->
                  <div v-if="detailItem.tagsKmr?.length" class="tags-group">
                    <div class="tags-group__label tags-group__label--kmr">تاگی کورمانجی</div>
                    <div class="tags-group__items">
                      <span v-for="t in detailItem.tagsKmr" :key="t" class="tag-pill tag-pill--kmr">{{ t }}</span>
                    </div>
                  </div>
                  <!-- Keywords CKB -->
                  <div v-if="detailItem.keywordsCkb?.length" class="tags-group">
                    <div class="tags-group__label tags-group__label--kw">کیووەردی سۆرانی</div>
                    <div class="tags-group__items">
                      <span v-for="k in detailItem.keywordsCkb" :key="k" class="tag-pill tag-pill--kw">{{ k }}</span>
                    </div>
                  </div>
                  <!-- Keywords KMR -->
                  <div v-if="detailItem.keywordsKmr?.length" class="tags-group">
                    <div class="tags-group__label tags-group__label--kw">کیووەردی کورمانجی</div>
                    <div class="tags-group__items">
                      <span v-for="k in detailItem.keywordsKmr" :key="k" class="tag-pill tag-pill--kw">{{ k }}</span>
                    </div>
                  </div>
                </div>
              </section>

              <!-- ⑦  TIMESTAMPS ──────────────────────────────────── -->
              <section class="vd__sec vd__sec--timestamps">
                <div class="ts-row">
                  <div class="ts-item">
                    <span class="ts-item__label">دروستکراوە</span>
                    <span class="ts-item__val">{{ fmtDateFull(detailItem.createdAt) }}</span>
                  </div>
                  <div class="ts-item">
                    <span class="ts-item__label">دوایین نوێکردنەوە</span>
                    <span class="ts-item__val">{{ fmtDateFull(detailItem.updatedAt) }}</span>
                  </div>
                </div>
              </section>

            </div><!-- end vd__body -->

            <!-- ── FOOTER ──────────────────────────────────────── -->
            <div class="vd__foot">
              <RouterLink :to="{ name: 'AdminVideoEdit', params: { id: detailItem.id } }" class="btn btn--primary btn--sm">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4z"/></svg>
                دەستکاریکردن
              </RouterLink>
              <button class="btn btn--danger-ghost btn--sm" @click="confirmDelete(detailItem); detailItem = null">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></svg>
                سڕینەوە
              </button>
              <button class="btn btn--ghost btn--sm" @click="detailItem = null">داخستن</button>
            </div>

          </div><!-- end vd -->
        </div>
      </Transition>
    </Teleport>

    <!-- ── DELETE CONFIRM ─────────────────────────────────────────── -->
    <Teleport to="body">
      <Transition name="vmodal">
        <div v-if="deleteTarget" class="vd-bg" @click.self="deleteTarget = null">
          <div class="del-modal">
            <div class="del-modal__icon">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>
            </div>
            <h3 class="del-modal__title">سڕینەوەی ڤیدیۆ</h3>
            <p class="del-modal__sub">دەتەوێت <strong>{{ deleteTarget.titleCkb || deleteTarget.titleKmr || 'ئەم ڤیدیۆیە' }}</strong> بسڕیتەوە؟<br/>ئەم کردارە گەرێنەوەی نییە.</p>
            <div class="del-modal__acts">
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

const items       = ref([])
const loading     = ref(false)
const currentPage = ref(0)
const totalPages  = ref(0)
const pageSize    = 20

const search      = ref('')
const filterLang  = ref('')
const filterType  = ref('')
const filterTopic = ref('')
const filterAlbum = ref('')

const detailItem   = ref(null)
const deleteTarget = ref(null)
const deleting     = ref(false)

/* ─── normalize ─────────────────────────────────────────────────── */
const normalize = (d) => {
  const ckb   = d.ckbCoverUrl  || ''
  const kmr   = d.kmrCoverUrl  || ''
  const hover = d.hoverCoverUrl || d.hoverUrl || ''
  return {
    ...d,
    baseCoverUrl : ckb || kmr || d.coverUrl || '',
    ckbCoverUrl  : ckb,
    kmrCoverUrl  : kmr,
    hoverCoverUrl: hover,
    titleCkb     : d.ckbContent?.title        || d.titleCkb     || '',
    titleKmr     : d.kmrContent?.title        || d.titleKmr     || '',
    descriptionCkb: d.ckbContent?.description || d.descriptionCkb || '',
    descriptionKmr: d.kmrContent?.description || d.descriptionKmr || '',
    locationCkb  : d.ckbContent?.location     || d.locationCkb  || '',
    locationKmr  : d.kmrContent?.location     || d.locationKmr  || '',
    directorCkb  : d.ckbContent?.director     || d.directorCkb  || '',
    directorKmr  : d.kmrContent?.director     || d.directorKmr  || '',
    producerCkb  : d.ckbContent?.producer     || d.producerCkb  || '',
    producerKmr  : d.kmrContent?.producer     || d.producerKmr  || '',
    tagsCkb      : [...(d.tags?.ckb      || d.tagsCkb      || [])],
    tagsKmr      : [...(d.tags?.kmr      || d.tagsKmr      || [])],
    keywordsCkb  : [...(d.keywords?.ckb  || d.keywordsCkb  || [])],
    keywordsKmr  : [...(d.keywords?.kmr  || d.keywordsKmr  || [])],
    topic: d.topicId
      ? { id: d.topicId, nameCkb: d.topicNameCkb || '', nameKmr: d.topicNameKmr || '' }
      : (d.topic || null),
    videoClipItems  : d.videoClipItems  || [],
    albumOfMemories : d.albumOfMemories ?? false,
    contentLanguages: Array.isArray(d.contentLanguages)
      ? d.contentLanguages
      : [...(d.contentLanguages || [])],
  }
}

/* ─── computed ───────────────────────────────────────────────────── */
const availableTopics = computed(() => {
  const seen = new Set(), r = []
  items.value.forEach(i => {
    if (i.topic && !seen.has(i.topic.id)) {
      seen.add(i.topic.id)
      r.push(i.topic)
    }
  })
  return r
})

const filtered = computed(() => {
  let list = items.value
  const q = search.value.trim().toLowerCase()

  if (q) list = list.filter(i =>
    (i.titleCkb || '').toLowerCase().includes(q) ||
    (i.titleKmr || '').toLowerCase().includes(q) ||
    (i.videoType || '').toLowerCase().includes(q) ||
    (i.topic?.nameCkb || '').toLowerCase().includes(q) ||
    (i.topic?.nameKmr || '').toLowerCase().includes(q) ||
    (i.tagsCkb || []).some(t => t.toLowerCase().includes(q)) ||
    (i.tagsKmr || []).some(t => t.toLowerCase().includes(q))
  )

  if (filterLang.value)  list = list.filter(i => (i.contentLanguages || []).includes(filterLang.value))
  if (filterType.value)  list = list.filter(i => i.videoType === filterType.value)
  if (filterTopic.value) list = list.filter(i => i.topic?.id === Number(filterTopic.value))

  if (filterAlbum.value !== '') {
    const v = filterAlbum.value === 'true'
    list = list.filter(i => i.videoType === 'VIDEO_CLIP' && i.albumOfMemories === v)
  }
  return list
})

/* ─── actions ────────────────────────────────────────────────────── */
const fetchAll = async (page = 0) => {
  loading.value = true
  try {
    const { data } = await api.get('/api/publishments/videos', { params: { page, size: pageSize } })
    if (Array.isArray(data)) {
      items.value = data.map(normalize)
      totalPages.value = 1
    } else {
      items.value = (data.content || []).map(normalize)
      totalPages.value = data.totalPages || 1
      currentPage.value = data.number ?? page
    }
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const goPage = (p) => { if (p >= 0 && p < totalPages.value) fetchAll(p) }
const openDetail    = (item) => { detailItem.value = item }
const confirmDelete = (item) => { deleteTarget.value = item }

const doDelete = async () => {
  if (!deleteTarget.value) return
  deleting.value = true
  try {
    await api.delete(`/api/publishments/videos/${deleteTarget.value.id}`)
    items.value = items.value.filter(x => x.id !== deleteTarget.value.id)
    deleteTarget.value = null
  } catch (e) {
    console.error(e)
  } finally {
    deleting.value = false
  }
}

/* ─── format helpers ─────────────────────────────────────────────── */
const fmtDate = (d) => {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('ckb', { year:'numeric', month:'short', day:'numeric' })
}
const fmtDateFull = (d) => {
  if (!d) return '—'
  const dt = new Date(d)
  return dt.toLocaleDateString('ckb', { year:'numeric', month:'long', day:'numeric' }) +
    '  ·  ' + dt.toLocaleTimeString('ckb', { hour:'2-digit', minute:'2-digit' })
}
const fmtDuration = (s) => {
  if (!s || s <= 0) return '—'
  const h = Math.floor(s/3600), m = Math.floor((s%3600)/60), sec = s%60
  if (h > 0) return `${h}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`
  return `${m}:${String(sec).padStart(2,'0')}`
}

onMounted(() => fetchAll(0))
</script>

<style scoped>
/* ═══════════════════════════════════════════════════════════════════
   DESIGN TOKENS  — IMPORTANT:
   Teleport moves .vd/.del-modal outside .vlist, so we also define
   variables on .vd + .del-modal.
═══════════════════════════════════════════════════════════════════ */
.vlist, .vd, .del-modal{
  --red: #8C1515;
  --red-dim: rgba(140,21,21,.08);
  --red-border: rgba(140,21,21,.18);
  --gold: #C4A400;
  --blue: #3B6ECC;
  --teal: #0D7E7E;
  --surface: #FDFCFB;
  --panel: #FFFFFF;
  --border: #E8E5E0;
  --border-soft: #F0EDE8;
  --text-main: #1C1A17;
  --text-body: #3D3A35;
  --text-muted: #8A8680;
  --text-hint: #B4B0AA;
  --shadow-sm: 0 1px 4px rgba(0,0,0,.06);
  --shadow-md: 0 4px 16px rgba(0,0,0,.09);
  --shadow-lg: 0 16px 48px rgba(0,0,0,.18);
  --radius: 14px;
  --radius-sm: 8px;
}

/* ═══════════════════════════════════════════════════════════════════
   PAGE SHELL
═══════════════════════════════════════════════════════════════════ */
.vlist { direction:rtl; max-width:1340px; margin:0 auto; padding:0 .5rem; }

/* ── Header ── */
.vlist__head { display:flex; align-items:flex-start; justify-content:space-between; gap:1rem; margin-bottom:1.4rem; }
.vlist__title { margin:0 0 .25rem; font-size:clamp(1.35rem,2.5vw,2.1rem); font-weight:900; color:var(--text-main); letter-spacing:-.02em; }
.vlist__title-accent { color:var(--red); }
.vlist__sub { margin:0; color:var(--text-muted); font-size:.88rem; font-weight:600; }

/* ── Toolbar ── */
.toolbar { display:flex; flex-wrap:wrap; gap:.55rem; margin-bottom:1rem; }
.toolbar__search{
  flex:1; min-width:220px; height:42px;
  display:flex; align-items:center; gap:.5rem; padding:0 .9rem;
  border:1.5px solid var(--border); border-radius:11px; background:var(--panel);
  color:var(--text-hint); transition:border-color .15s;
}
.toolbar__search:focus-within { border-color:var(--red); }
.toolbar__search input { border:none; outline:none; background:transparent; font:inherit; color:var(--text-main); width:100%; }
.toolbar__select{
  height:42px; padding:0 .85rem; border:1.5px solid var(--border); border-radius:11px;
  background:var(--panel); font:inherit; font-size:.84rem; color:var(--text-main);
  cursor:pointer; outline:none; transition:border-color .15s;
}
.toolbar__select:focus { border-color:var(--red); }

/* ── State cards ── */
.state-card{
  background:var(--panel); border:1px solid var(--border); border-radius:var(--radius);
  min-height:220px; display:flex; flex-direction:column; align-items:center;
  justify-content:center; gap:.65rem; color:var(--text-muted); text-align:center; padding:2rem;
}
.state-spinner { width:28px; height:28px; border-radius:50%; border:3px solid var(--border); border-top-color:var(--red); animation:spin .7s linear infinite; }
.state-card__icon { width:56px; height:56px; border-radius:50%; background:rgba(140,21,21,.08); border:1px solid rgba(140,21,21,.18); display:flex; align-items:center; justify-content:center; color:var(--red); }
.state-card__title { font-weight:800; font-size:1rem; color:var(--text-main); }
.state-card__sub { font-size:.84rem; }

/* ═══════════════════════════════════════════════════════════════════
   TABLE
═══════════════════════════════════════════════════════════════════ */
.panel { background:var(--panel); border:1px solid var(--border); border-radius:var(--radius); overflow:hidden; box-shadow:var(--shadow-sm); }
.table { width:100%; border-collapse:collapse; }
.table thead th{
  padding:.7rem 1rem; text-align:right; font-size:.73rem; font-weight:800;
  color:var(--text-muted); background:#F9F7F5; border-bottom:1px solid var(--border);
  white-space:nowrap; letter-spacing:.03em; text-transform:uppercase;
}
.table__row { cursor:pointer; transition:background .12s; }
.table__row:hover { background:#F9F7F5; }
.table__row td { padding:.72rem 1rem; border-bottom:1px solid var(--border-soft); vertical-align:middle; font-size:.84rem; color:var(--text-body); }
.table__row:last-child td { border-bottom:none; }
.table__num { color:var(--text-hint); font-size:.76rem; font-weight:700; font-variant-numeric:tabular-nums; }
.mono { font-variant-numeric:tabular-nums; color:var(--text-muted); font-size:.78rem; white-space:nowrap; }

/* cover cell */
.cover-wrap { position:relative; width:52px; }
.cover-frame { width:52px; height:52px; border-radius:10px; overflow:hidden; border:1px solid var(--border); background:#F3F1EE; position:relative; }
.cover-frame__base,.cover-frame__hover { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; display:block; transition:opacity .2s; }
.cover-frame__hover { opacity:0; }
.table__row:hover .cover-frame__hover { opacity:1; }
.cover-frame__empty { width:100%; height:100%; display:flex; align-items:center; justify-content:center; color:var(--text-hint); }
.cover-h-dot { position:absolute; bottom:-3px; left:-3px; width:16px; height:16px; border-radius:6px; background:rgba(190,24,93,.9); color:#fff; font-size:.6rem; font-weight:900; display:flex; align-items:center; justify-content:center; border:1.5px solid #fff; }

/* title */
.title-stack { display:flex; flex-direction:column; gap:.12rem; }
.title-stack__main { font-weight:700; color:var(--text-main); }
.title-stack__sub { font-size:.76rem; color:var(--text-muted); }

/* chip */
.chip { display:inline-flex; align-items:center; gap:.3rem; padding:.2rem .6rem; border-radius:99px; font-size:.72rem; font-weight:800; white-space:nowrap; }
.chip__dot { width:6px; height:6px; border-radius:50%; background:currentColor; opacity:.7; }
.chip--film  { background:rgba(59,110,204,.08); color:#3B6ECC; border:1px solid rgba(59,110,204,.18); }
.chip--clip  { background:rgba(196,164,0,.09); color:#7A6400; border:1px solid rgba(196,164,0,.2); }
.chip--mem   { background:rgba(190,24,93,.08); color:#be185d; border:1px solid rgba(190,24,93,.2); }
.chip--gray  { background:rgba(120,113,108,.07); color:#78716c; border:1px solid rgba(120,113,108,.15); }

/* topic tag */
.topic-tag { display:inline-block; padding:.2rem .6rem; border-radius:99px; background:rgba(140,21,21,.08); color:var(--red); border:1px solid rgba(140,21,21,.18); font-size:.74rem; font-weight:800; max-width:120px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }

/* lang flags */
.lang-flags { display:flex; gap:.25rem; flex-wrap:wrap; }
.lang-flag { padding:.18rem .45rem; border-radius:6px; font-size:.68rem; font-weight:900; letter-spacing:.04em; }
.lang-flag--ckb { background:rgba(196,164,0,.1); color:#7A6400; border:1px solid rgba(196,164,0,.2); }
.lang-flag--kmr { background:rgba(59,110,204,.08); color:#3B6ECC; border:1px solid rgba(59,110,204,.18); }

.muted { color:var(--text-hint); font-size:.82rem; }

/* action buttons */
.act-btns { display:flex; gap:.3rem; }
.icon-btn { width:30px; height:30px; border-radius:8px; border:1px solid var(--border); background:var(--panel); display:flex; align-items:center; justify-content:center; cursor:pointer; transition:.15s; color:var(--text-muted); }
.icon-btn:hover { background:#F3F1EE; }
.icon-btn--edit:hover { color:#3B6ECC; border-color:rgba(59,110,204,.3); background:rgba(59,110,204,.06); }
.icon-btn--del:hover  { color:#dc2626; border-color:rgba(220,38,38,.25); background:rgba(220,38,38,.05); }

/* pagination */
.pag { display:flex; align-items:center; justify-content:center; gap:.6rem; padding:.75rem 1rem; border-top:1px solid var(--border-soft); }
.pag__btn { width:32px; height:32px; border-radius:9px; border:1px solid var(--border); background:var(--panel); display:flex; align-items:center; justify-content:center; cursor:pointer; transition:.15s; color:var(--text-muted); }
.pag__btn:hover:not(:disabled) { border-color:var(--red); color:var(--red); background:rgba(140,21,21,.08); }
.pag__btn:disabled { opacity:.35; cursor:not-allowed; }
.pag__info { font-size:.82rem; font-weight:700; color:var(--text-muted); }
.pag__sep { color:var(--text-hint); margin:0 .2rem; }

/* ═══════════════════════════════════════════════════════════════════
   DETAIL MODAL (vd) — Premium cinematic sheet (UPDATED)
═══════════════════════════════════════════════════════════════════ */
.vd-bg{
  position:fixed; inset:0; z-index:1000;
  background:
    radial-gradient(1200px 800px at 70% 20%, rgba(140,21,21,.28), transparent 60%),
    radial-gradient(900px 600px at 20% 80%, rgba(59,110,204,.22), transparent 55%),
    rgba(10,8,6,.68);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  display:flex; align-items:center; justify-content:center;
  padding: 1rem;
}

.vd{
  width:100%;
  max-width: 920px;
  max-height: 94vh;
  overflow:auto;
  border-radius: 26px;
  background: linear-gradient(180deg, rgba(255,255,255,.96), rgba(255,255,255,.92));
  box-shadow:
    0 36px 120px rgba(0,0,0,.45),
    0 0 0 1px rgba(255,255,255,.10),
    0 0 0 2px rgba(0,0,0,.08);
  position:relative;
  transform: translateZ(0);
  scrollbar-width: thin;
  scrollbar-color: rgba(140,21,21,.35) rgba(0,0,0,.08);
}

:deep(.vd::-webkit-scrollbar){ width: 10px; }
:deep(.vd::-webkit-scrollbar-track){
  background: rgba(0,0,0,.06);
  border-radius: 999px;
}
:deep(.vd::-webkit-scrollbar-thumb){
  background: linear-gradient(180deg, rgba(140,21,21,.55), rgba(190,24,93,.45));
  border-radius: 999px;
  border: 2px solid rgba(255,255,255,.55);
}

.vd--memories{
  box-shadow:
    0 40px 130px rgba(190,24,93,.30),
    0 0 0 1px rgba(190,24,93,.18),
    0 0 60px rgba(190,24,93,.10);
}

.vd__x{
  position: sticky;
  top: 14px;
  float: left;
  margin-left: 14px;
  z-index: 50;

  width: 42px;
  height: 42px;
  border-radius: 999px;

  background: rgba(255,255,255,.82);
  border: 1px solid rgba(0,0,0,.10);
  box-shadow: 0 10px 26px rgba(0,0,0,.22);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);

  display:flex; align-items:center; justify-content:center;
  cursor:pointer;
  color:#2b2622;
  transition: transform .18s ease, background .18s ease, box-shadow .18s ease;
}
.vd__x:hover{
  transform: translateY(-1px) scale(1.04);
  background: rgba(255,255,255,.92);
  box-shadow: 0 14px 32px rgba(0,0,0,.26);
}
.vd__x:active{ transform: scale(.98); }

.vd__hero{
  position:relative;
  min-height: 290px;
  border-radius: 26px 26px 0 0;
  overflow:hidden;
  background:
    var(--hero-img, none),
    radial-gradient(1200px 500px at 70% 0%, rgba(255,255,255,.08), transparent 55%),
    linear-gradient(140deg, #130606 0%, #3d0f0f 45%, #8C1515 100%);
  background-size: cover;
  background-position: center;
}

.vd__hero-hover{
  position:absolute; inset:0;
  background-size: cover;
  background-position:center;
  opacity: 0;
  transform: scale(1.02);
  transition: opacity .35s ease, transform .55s ease;
  filter: saturate(1.02) contrast(1.02);
}
.vd:hover .vd__hero-hover{
  opacity:.72;
  transform: scale(1.06);
}

.vd__hero-noise{
  position:absolute; inset:0;
  opacity:.06;
  mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}
.vd__hero-grad{
  position:absolute; inset:0;
  background:
    radial-gradient(900px 300px at 70% 0%, rgba(0,0,0,.10), transparent 60%),
    linear-gradient(to top, rgba(0,0,0,.90) 0%, rgba(0,0,0,.45) 45%, rgba(0,0,0,.10) 70%, transparent 82%);
}

.vd__ribbon{
  position:absolute; top:18px; right:18px; z-index:10;
  display:inline-flex; align-items:center; gap:.4rem;
  padding:.42rem .95rem;
  border-radius: 999px;
  color:#fff;
  font-size:.78rem;
  font-weight:900;
  letter-spacing:.02em;
  background: linear-gradient(135deg, rgba(190,24,93,.95), rgba(220,38,93,.85));
  box-shadow: 0 12px 28px rgba(190,24,93,.35);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255,255,255,.18);
}

.vd__hero-body{
  position:relative;
  z-index:5;
  padding: 1.7rem 1.9rem 1.6rem;
  min-height: 290px;
  display:flex;
  flex-direction:column;
  justify-content:flex-end;
  gap:.7rem;
}

.vd__badges{ display:flex; flex-wrap:wrap; gap:.4rem; }
.vd__b{
  display:inline-flex;
  align-items:center;
  gap:.35rem;
  padding: .26rem .72rem;
  border-radius: 999px;
  font-size: .72rem;
  font-weight: 900;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,.16);
}
.vd__b--film{ background: rgba(99,102,241,.25); color:#e0e7ff; }
.vd__b--clip{ background: rgba(245,158,11,.24); color:#fff7ed; }
.vd__b--topic{ background: rgba(140,21,21,.45); color:#ffe4e6; }
.vd__b--lang{ background: rgba(255,255,255,.14); color: rgba(255,255,255,.90); }
.vd__b--tech{
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  background: rgba(0,0,0,.34);
  color: rgba(255,255,255,.86);
}

.vd__hero-title{
  margin:0;
  color:#fff;
  font-weight: 950;
  letter-spacing: -.02em;
  line-height: 1.15;
  font-size: clamp(1.35rem, 3.2vw, 2.05rem);
  text-shadow: 0 10px 28px rgba(0,0,0,.45);
}
.vd__hero-alt{
  margin:0;
  font-size:.92rem;
  font-weight: 700;
  color: rgba(255,255,255,.62);
}

.vd__qstats{ display:flex; flex-wrap:wrap; gap:.5rem; margin-top: .2rem; }
.vd__qs{
  display:inline-flex;
  align-items:center;
  gap:.35rem;
  padding:.24rem .7rem;
  border-radius:999px;
  background: rgba(255,255,255,.12);
  border: 1px solid rgba(255,255,255,.12);
  color: rgba(255,255,255,.88);
  font-size:.76rem;
  font-weight: 850;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}
.vd__qs--id{
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono";
  letter-spacing:.05em;
}

.vd__body{
  padding: 1.7rem 1.9rem 1.9rem;
  display:flex;
  flex-direction:column;
  gap: 1.55rem;
}

.vd__sec{
  background: rgba(255,255,255,.92);
  border: 1px solid rgba(0,0,0,.06);
  border-radius: 18px;
  padding: 1.15rem 1.2rem;
  box-shadow: 0 8px 22px rgba(0,0,0,.06);
}
.vd__sec--timestamps{ background:#F9F7F5; border-color:rgba(0,0,0,.06); }
.vd__sec-title{
  display:flex; align-items:center; gap:.55rem; margin:0 0 1rem;
  font-weight: 950; font-size: .80rem; letter-spacing: .08em;
  text-transform: uppercase; color: var(--red);
  padding-bottom: .75rem; border-bottom: 2px solid rgba(140,21,21,.10);
}
.vd__sec-count{
  margin-right:auto; font-size:.74rem; font-weight: 950;
  padding:.12rem .55rem; border-radius: 999px;
  background: rgba(140,21,21,.08); border: 1px solid rgba(140,21,21,.16);
  color: var(--red);
}

/* Covers grid */
.covers-grid{ display:grid; grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); gap: 1rem; }
.cover-card{
  border-radius: 16px;
  border: 1px solid rgba(0,0,0,.06);
  background: linear-gradient(180deg, rgba(255,255,255,.98), rgba(250,248,246,.96));
  overflow:hidden;
  box-shadow: 0 10px 26px rgba(0,0,0,.06);
  transition: transform .18s ease, box-shadow .18s ease;
}
.cover-card:hover{ transform: translateY(-2px); box-shadow: 0 16px 36px rgba(0,0,0,.10); }
.cover-card__badge{
  padding: .55rem .9rem;
  border-bottom: 1px solid rgba(0,0,0,.06);
  font-weight: 950;
  letter-spacing: .06em;
  font-size: .72rem;
  text-transform: uppercase;
}
.cover-card--ckb .cover-card__badge{ background: rgba(196,164,0,.10); color:#7A6400; }
.cover-card--kmr .cover-card__badge{ background: rgba(59,110,204,.10); color:#2d5ac0; }
.cover-card--hover .cover-card__badge{ background: rgba(190,24,93,.10); color:#be185d; }

.cover-card__img-wrap{
  padding: .8rem;
  background: radial-gradient(600px 180px at 50% 0%, rgba(0,0,0,.06), transparent 55%), #f7f4f1;
  position:relative;
}
.cover-card__img-wrap img{
  width:100%;
  height: 210px;
  object-fit: cover;
  border-radius: 12px;
  border: 1px solid rgba(0,0,0,.08);
  display:block;
}
.cover-card__img-wrap--hover::after{
  content: "HOVER";
  position:absolute;
  bottom: 16px;
  left: 16px;
  padding: .18rem .5rem;
  border-radius: 8px;
  background: rgba(190,24,93,.92);
  color:#fff;
  font-weight: 950;
  font-size: .65rem;
  letter-spacing:.08em;
  border:1px solid rgba(255,255,255,.20);
}
.cover-card__link{
  display:inline-flex;
  align-items:center;
  gap:.35rem;
  margin: .65rem .8rem .85rem;
  padding: .42rem .85rem;
  border-radius: 12px;
  font-weight: 950;
  font-size: .80rem;
  text-decoration:none;
  border: 1px solid rgba(59,110,204,.18);
  background: rgba(59,110,204,.08);
  color: #2d5ac0;
  transition: transform .16s ease, background .16s ease, border-color .16s ease;
}
.cover-card__link:hover{ background: rgba(59,110,204,.14); transform: translateY(-1px); }
.cover-card__link--hover{
  border-color: rgba(124,58,237,.18);
  background: rgba(124,58,237,.08);
  color:#7c3aed;
}
.cover-card__link--hover:hover{ background: rgba(124,58,237,.14); }

/* Bilingual */
.bilingual-grid{ display:grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
@media (max-width: 760px){ .bilingual-grid{ grid-template-columns: 1fr; } }
.bilingual-col{
  border-radius: 16px;
  padding: 1.05rem 1.05rem 1rem;
  background: linear-gradient(180deg, rgba(249,247,245,.95), rgba(255,255,255,.92));
  border: 1px solid rgba(0,0,0,.06);
  box-shadow: 0 10px 24px rgba(0,0,0,.05);
}
.bilingual-col__lang{ display:flex; align-items:center; gap:.45rem; font-size:.76rem; font-weight:900; color:var(--text-muted); text-transform:uppercase; letter-spacing:.05em; margin-bottom:.75rem; }
.lang-dot { width:8px; height:8px; border-radius:50%; }
.lang-dot--ckb { background:var(--gold); }
.lang-dot--kmr { background:var(--blue); }
.bilingual-col__desc{ font-size: .90rem; line-height: 1.8; color: #2a2622; margin:0 0 .85rem; }
.bilingual-col__meta{ display:flex; flex-direction:column; gap:.45rem; }
.bilingual-col__meta .bmeta{ border-radius: 12px; padding: .55rem .65rem; background: rgba(0,0,0,.03); border: 1px solid rgba(0,0,0,.05); }
.bmeta__label{ font-size:.73rem; color:var(--text-muted); font-weight:800; }
.bmeta__val{ font-size:.86rem; color:var(--text-main); font-weight:900; }

/* Player */
.player-wrap{ border-radius: 16px; overflow:hidden; background:#070504; box-shadow: 0 16px 44px rgba(0,0,0,.25); border: 1px solid rgba(255,255,255,.06); margin-bottom:.9rem; }
.player-embed{ position:relative; padding-top:56.25%; }
.player-embed iframe{ position:absolute; inset:0; width:100%; height:100%; }
.player-native video{ width:100%; display:block; max-height:520px; }

/* Source links */
.src-links{ display:flex; flex-wrap:wrap; gap:.5rem; }
.src-link{
  display:inline-flex; align-items:center; gap:.35rem; text-decoration:none;
  padding:.44rem .9rem; border-radius:12px; font-size:.79rem; font-weight:950;
  background:rgba(59,110,204,.07); color:var(--blue); border:1px solid rgba(59,110,204,.18);
  transition:.15s;
}
.src-link:hover{ background:rgba(59,110,204,.14); }
.src-link--ext{ color:var(--teal); background:rgba(13,126,126,.07); border-color:rgba(13,126,126,.18); }
.src-link--ext:hover{ background:rgba(13,126,126,.14); }
.src-link--embed{ color:#7c3aed; background:rgba(124,58,237,.07); border-color:rgba(124,58,237,.18); }
.src-link--embed:hover{ background:rgba(124,58,237,.14); }

/* Tracks */
.tracks{ display:flex; flex-direction:column; gap:.65rem; }
.track{
  display:flex; gap:.9rem; align-items:flex-start;
  background: linear-gradient(180deg, rgba(249,247,245,.96), rgba(255,255,255,.92));
  border: 1px solid rgba(0,0,0,.06);
  border-radius: 18px;
  padding: 1rem 1.05rem;
  box-shadow: 0 10px 24px rgba(0,0,0,.05);
}
.track__num{
  flex-shrink:0; width:38px; height:38px; border-radius:50%;
  background:rgba(140,21,21,.10); color:var(--red); border:1px solid rgba(140,21,21,.20);
  display:flex; align-items:center; justify-content:center;
  font-size:.80rem; font-weight:950;
}
.track__body{ flex:1; min-width:0; }
.track__t-main{ font-weight:950; font-size:.92rem; color:var(--text-main); display:block; }
.track__t-alt{ font-size:.80rem; color:var(--text-muted); display:block; margin-top:.1rem; }
.track__desc{ font-size:.84rem; color:var(--text-body); line-height:1.6; margin:0 0 .6rem; }
.track__meta{ display:flex; flex-wrap:wrap; gap:.35rem; margin-bottom:.6rem; }
.track__chip{ display:inline-flex; padding:.20rem .60rem; border-radius:10px; font-size:.72rem; font-weight:800; background:rgba(0,0,0,.05); color:var(--text-muted); border:1px solid var(--border); }
.track__player{ width:100%; border-radius:9px; margin-bottom:.5rem; max-height:220px; border:1px solid rgba(0,0,0,.08); }
.track__embed{ position:relative; padding-top:40%; border-radius:9px; overflow:hidden; margin-bottom:.5rem; background:#0a0705; }
.track__embed iframe{ position:absolute; inset:0; width:100%; height:100%; }
.track__links{ display:flex; gap:.35rem; flex-wrap:wrap; }
.track__link{
  display:inline-flex; align-items:center; text-decoration:none;
  padding:.44rem .9rem; border-radius:12px; font-size:.74rem; font-weight:950;
  background:rgba(59,110,204,.07); color:var(--blue); border:1px solid rgba(59,110,204,.15);
  transition:.15s;
}
.track__link:hover{ background:rgba(59,110,204,.14); }
.track__link--ext{ color:var(--teal); background:rgba(13,126,126,.07); border-color:rgba(13,126,126,.15); }
.track__link--embed{ color:#7c3aed; background:rgba(124,58,237,.07); border-color:rgba(124,58,237,.15); }

/* Meta grid */
.meta-grid{ display:grid; grid-template-columns:repeat(auto-fill,minmax(170px,1fr)); gap:.6rem; }
.meta-item{
  display:flex; flex-direction:column; gap:.2rem;
  background: linear-gradient(180deg, rgba(249,247,245,.96), rgba(255,255,255,.92));
  border: 1px solid rgba(0,0,0,.06);
  border-radius: 12px;
  padding:.7rem .85rem;
}
.meta-item__label{ font-size:.7rem; font-weight:900; color:var(--text-hint); letter-spacing:.07em; text-transform:uppercase; }
.meta-item__val{ font-size:.86rem; font-weight:900; color:var(--text-main); }
.meta-item__val--id{ font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace; color:var(--red); text-shadow: 0 10px 20px rgba(140,21,21,.12); }
.meta-item__val--yes { color:#16a34a; }
.meta-item__val--no  { color:var(--text-hint); }

/* Tags */
.tags-section{ display:flex; flex-direction:column; gap:1rem; }
.tags-group__label{ font-size:.71rem; font-weight:950; letter-spacing:.05em; text-transform:uppercase; margin-bottom:.45rem; padding:.2rem .5rem; border-radius:6px; display:inline-block; }
.tags-group__label--ckb  { background:rgba(196,164,0,.1); color:#7A6400; }
.tags-group__label--kmr  { background:rgba(59,110,204,.09); color:#2d5ac0; }
.tags-group__label--kw   { background:rgba(13,126,126,.09); color:var(--teal); }
.tags-group__items{ display:flex; flex-wrap:wrap; gap:.4rem; }
.tag-pill{ display:inline-block; padding:.22rem .65rem; border-radius:99px; font-size:.78rem; font-weight:800; }
.tag-pill--ckb  { background:rgba(196,164,0,.09); color:#7A6400; border:1px solid rgba(196,164,0,.2); }
.tag-pill--kmr  { background:rgba(59,110,204,.08); color:#2d5ac0; border:1px solid rgba(59,110,204,.18); }
.tag-pill--kw   { background:rgba(13,126,126,.08); color:var(--teal); border:1px solid rgba(13,126,126,.18); }

/* timestamps */
.ts-row{ display:flex; flex-wrap:wrap; gap:1.5rem; }
.ts-item{ display:flex; flex-direction:column; gap:.18rem; }
.ts-item__label{ font-size:.72rem; font-weight:900; color:var(--text-muted); text-transform:uppercase; letter-spacing:.06em; }
.ts-item__val{ font-size:.84rem; font-weight:900; color:var(--text-main); font-variant-numeric:tabular-nums; }

/* footer */
.vd__foot{
  position: sticky;
  bottom: 0;
  padding: 1rem 1.9rem;
  background: rgba(253,252,251,.92);
  border-top: 1px solid rgba(0,0,0,.06);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 0 0 26px 26px;
  display:flex;
  gap:.55rem;
  flex-wrap:wrap;
}

/* ═══════════════════════════════════════════════════════════════════
   DELETE MODAL
═══════════════════════════════════════════════════════════════════ */
.del-modal{
  background:var(--panel);
  border-radius:22px;
  padding:2rem 2rem 1.8rem;
  width:100%;
  max-width:420px;
  text-align:center;
  box-shadow: 0 36px 120px rgba(0,0,0,.35);
  border:1px solid rgba(0,0,0,.08);
}
.del-modal__icon{
  width:58px; height:58px; border-radius:50%;
  background:rgba(220,38,38,.08); border:1px solid rgba(220,38,38,.18);
  display:flex; align-items:center; justify-content:center;
  color:#dc2626; margin:0 auto 1rem;
}
.del-modal__title{ font-size:1.1rem; font-weight:950; margin:0 0 .5rem; color:var(--text-main); }
.del-modal__sub{ color:var(--text-muted); font-size:.87rem; line-height:1.65; margin:0 0 1.4rem; }
.del-modal__acts{ display:flex; gap:.55rem; justify-content:center; }

/* ═══════════════════════════════════════════════════════════════════
   BUTTONS
═══════════════════════════════════════════════════════════════════ */
.btn{
  display:inline-flex; align-items:center; justify-content:center; gap:.4rem;
  text-decoration:none; border-radius:11px; padding:.72rem 1.2rem;
  font-weight:900; border:1px solid transparent; transition:.15s;
  cursor:pointer; font:inherit; white-space:nowrap; font-size:.88rem;
}
.btn--primary{ background:var(--red); color:#fff; box-shadow:0 2px 10px rgba(140,21,21,.28); }
.btn--primary:hover{ background:#7a1212; box-shadow:0 8px 22px rgba(140,21,21,.30); transform: translateY(-1px); }
.btn--ghost{ background:var(--panel); color:var(--text-muted); border-color:var(--border); }
.btn--ghost:hover{ background:#F3F1EE; }
.btn--danger{ background:#dc2626; color:#fff; }
.btn--danger:hover{ background:#b91c1c; }
.btn--danger-ghost{ background:rgba(220,38,38,.06); color:#dc2626; border-color:rgba(220,38,38,.2); }
.btn--danger-ghost:hover{ background:rgba(220,38,38,.12); }
.btn--sm{ padding:.48rem .9rem; font-size:.82rem; border-radius:10px; }

/* ═══════════════════════════════════════════════════════════════════
   TRANSITION (UPDATED smoother)
═══════════════════════════════════════════════════════════════════ */
.vmodal-enter-active{
  transition: opacity .26s ease, transform .26s cubic-bezier(.22,1,.36,1);
}
.vmodal-leave-active{
  transition: opacity .18s ease;
}
.vmodal-enter-from{ opacity:0; }
.vmodal-leave-to{ opacity:0; }

.vmodal-enter-from .vd,
.vmodal-enter-from .del-modal{
  transform: translateY(14px) scale(.965);
  filter: blur(2px);
}

@keyframes spin { to { transform:rotate(360deg); } }
.spin-sm { width:14px; height:14px; border:2px solid rgba(255,255,255,.3); border-top-color:#fff; border-radius:50%; animation:spin .7s linear infinite; }
</style>