<template>
  <div class="stl" dir="rtl">

    <!-- ── HEADER ── -->
    <div class="stl__head">
      <div>
        <h1 class="stl__title">فیلمەکان (Films)</h1>
        <p class="stl__sub">بینین، گەڕان و بەڕێوەبردنی هەموو فیلمەکان</p>
      </div>
      <RouterLink class="btn btn--primary" to="/admin/films/new">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        فیلمی نوێ
      </RouterLink>
    </div>

    <!-- ── SEARCH + FILTERS ── -->
    <div class="stl__bar">
      <div class="search">
        <svg class="search__ico" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
        </svg>
        <input v-model="searchQ" class="search__input" placeholder="گەڕان بە ناونیشان / تاگ / کیووەرد…" @keyup.enter="doSearch" />
        <Transition name="fade">
          <button v-if="searchQ" class="search__clear" @click="clearSearch">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </Transition>
      </div>
      <select v-model="filterLang" class="sel" @change="applyFilter">
        <option value="">هەموو زمانەکان</option>
        <option value="CKB">سۆرانی</option>
        <option value="KMR">کورمانجی</option>
      </select>
    </div>

    <!-- ── TOAST ── -->
    <Transition name="slide-down">
      <div v-if="toast.show" class="toast" :class="`toast--${toast.type}`">
        <span class="toast__ico">{{ toast.type === 'success' ? '✓' : '✕' }}</span>
        {{ toast.msg }}
      </div>
    </Transition>

    <!-- ── SKELETON ── -->
    <div v-if="loading" class="skeletons">
      <div class="skel" v-for="i in 7" :key="i" :style="{ animationDelay: `${i * 0.07}s` }"></div>
    </div>

    <!-- ── ERROR ── -->
    <div v-else-if="error" class="state-box state-box--error">
      <div class="state-box__ico">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      </div>
      <p>{{ error }}</p>
      <button class="btn btn--ghost btn--sm" @click="load">دووبارەتەکەیەوە</button>
    </div>

    <!-- ── EMPTY ── -->
    <div v-else-if="!filteredItems.length" class="state-box">
      <div class="state-box__ico">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <rect x="2" y="2" width="20" height="20" rx="2.18"/><path d="M7 2v20M17 2v20M2 12h20M2 7h5M17 7h5M2 17h5M17 17h5"/>
        </svg>
      </div>
      <p>هیچ فیلمێک نەدۆزرایەوە</p>
      <RouterLink class="btn btn--primary btn--sm" to="/admin/films/new">یەکەمین فیلمت زیاد بکە</RouterLink>
    </div>

    <!-- ── TABLE ── -->
    <div v-else class="table-wrap">
      <div class="table-meta">
        کۆی {{ page.totalElements }} فیلم
        <span v-if="searchQ"> — ئەنجامی گەڕان بۆ «{{ searchQ }}»</span>
      </div>
      <table class="tbl">
        <thead>
          <tr>
            <th style="width:52px">#</th>
            <th style="width:66px">کڤەر</th>
            <th>ناونیشانی سۆرانی</th>
            <th>ناونیشانی کورمانجی</th>
            <th style="width:130px">جۆری فیلم</th>
            <th style="width:98px">زمان</th>
            <th style="width:80px">فۆرمات</th>
            <th style="width:90px">کات</th>
            <th style="width:110px">بەرواری بڵاوکردن</th>
            <th style="width:116px">کردار</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="f in filteredItems" :key="f.id" class="tbl__row" @click="openDetail(f)">
            <td><span class="tbl__id">#{{ f.id }}</span></td>
            <td>
              <div class="cover-wrap" v-if="f.coverUrl">
                <img class="cover-img" :src="f.coverUrl" loading="lazy" />
              </div>
              <div class="cover-empty" v-else>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <rect x="2" y="2" width="20" height="20" rx="2"/><polygon points="10 8 16 12 10 16 10 8"/>
                </svg>
              </div>
            </td>
            <td><div class="tbl__name">{{ f.ckbContent?.title || '—' }}</div></td>
            <td><div class="tbl__name tbl__name--kmr">{{ f.kmrContent?.title || '—' }}</div></td>
            <td>
              <span class="type-pill" :style="filmTypeStyle(f.filmType)">{{ f.filmType || '—' }}</span>
            </td>
            <td>
              <div class="lang-row">
                <span v-for="l in (f.contentLanguages||[])" :key="l" class="lang-dot" :class="`lang-dot--${l.toLowerCase()}`">{{ l }}</span>
              </div>
            </td>
            <td><span class="fmt-pill" v-if="f.fileFormat">{{ f.fileFormat }}</span><span v-else class="tbl__dash">—</span></td>
            <td class="tbl__date">{{ f.durationFormatted || fmtSeconds(f.durationSeconds) }}</td>
            <td class="tbl__date">{{ fmtDate(f.publishmentDate) }}</td>
            <td @click.stop>
              <div class="tbl__acts">
                <button class="act act--view" @click="openDetail(f)">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                  </svg>
                </button>
                <RouterLink class="act act--edit" :to="`/admin/films/${f.id}/edit`">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4z"/>
                  </svg>
                </RouterLink>
                <button class="act act--del" @click="confirmDelete(f)">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                    <path d="M10 11v6M14 11v6"/>
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div class="pagination" v-if="page.totalPages > 1">
        <button class="pg-btn" :disabled="page.number === 0" @click="goPage(page.number - 1)">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <button
          v-for="n in pageNumbers"
          :key="n"
          class="pg-btn"
          :class="{ 'pg-btn--on': n === page.number }"
          @click="goPage(n)"
        >{{ n + 1 }}</button>
        <button class="pg-btn" :disabled="page.number >= page.totalPages - 1" @click="goPage(page.number + 1)">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
        </button>
      </div>
    </div>

    <!-- ══ DELETE MODAL ══ -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="delTarget" class="overlay" @click.self="delTarget=null">
          <div class="del-modal">
            <div class="del-modal__ico">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#8C1515" stroke-width="2">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                <path d="M10 11v6M14 11v6"/>
              </svg>
            </div>
            <h3 class="del-modal__title">دڵنیای لە سڕینەوە؟</h3>
            <p class="del-modal__body">
              فیلمی <strong>«{{ bestTitle(delTarget) || '#'+delTarget.id }}»</strong><br/>
              بە تەواوی سڕاوەتەوە و ناگەڕێتەوە.
            </p>
            <div class="del-modal__acts">
              <button class="btn btn--ghost" @click="delTarget=null">نەخێر</button>
              <button class="btn btn--danger" :disabled="deleting" @click="doDelete">
                <span v-if="deleting" class="spinner"></span>{{ deleting ? '…' : 'بەڵێ، بیسڕەوە' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ══ DETAIL MODAL ══ -->
    <Teleport to="body">
      <Transition name="pdm-fade">
        <div v-if="detail" class="pdm-overlay" @click.self="closeDetail">
          <Transition name="pdm-rise" appear>
            <div v-if="detail" class="pdm" role="dialog">

              <button class="pdm-x" @click="closeDetail">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>

              <!-- ════ LEFT — VIDEO PLAYER ════ -->
              <div class="pdm-media">
                <!-- Cover background -->
                <div class="pdm-media__bg" v-if="detail.coverUrl" :style="`background-image:url(${detail.coverUrl})`"></div>

                <div class="pdm-media__inner">

                  <!-- No source at all -->
                  <div class="no-source" v-if="!detail.sourceUrl && !detail.sourceEmbedUrl && !detail.sourceExternalUrl">
                    <div class="no-source__ico">
                      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
                        <rect x="2" y="2" width="20" height="20" rx="2"/><polygon points="10 8 16 12 10 16 10 8"/>
                      </svg>
                    </div>
                    <span>هیچ سەرچاوەیەک نییە</span>
                    <img v-if="detail.coverUrl" :src="detail.coverUrl" class="fallback-cover" />
                  </div>

                  <!-- Source blocks -->
                  <div class="src-blocks" v-else>

                    <!-- 1) Direct video (S3/CDN) -->
                    <div v-if="detail.sourceUrl" class="src-block src-block--direct">
                      <div class="src-block__hd">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                        Direct Video
                      </div>
                      <video :src="detail.sourceUrl" controls preload="none" class="native-video" :poster="detail.coverUrl || undefined"></video>
                      <a :href="detail.sourceUrl" target="_blank" class="raw-link">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                        {{ truncUrl(detail.sourceUrl) }}
                      </a>
                    </div>

                    <!-- 2) Embed -->
                    <div v-if="detail.sourceEmbedUrl" class="src-block src-block--embed">
                      <div class="src-block__hd">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
                        Embed Player
                      </div>
                      <div class="iframe-wrap">
                        <iframe
                          :src="detail.sourceEmbedUrl"
                          frameborder="0"
                          allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                          allowfullscreen
                          class="embed-iframe"
                        ></iframe>
                      </div>
                      <a :href="detail.sourceEmbedUrl" target="_blank" class="raw-link">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                        {{ truncUrl(detail.sourceEmbedUrl) }}
                      </a>
                    </div>

                    <!-- 3) External link -->
                    <div v-if="detail.sourceExternalUrl" class="src-block src-block--ext">
                      <div class="src-block__hd">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"/></svg>
                        External Link
                      </div>
                      <a :href="detail.sourceExternalUrl" target="_blank" class="ext-btn">
                        <span class="ext-btn__platform">{{ platformLabel(detail.sourceExternalUrl) }}</span>
                        <span class="ext-btn__url">{{ truncUrl(detail.sourceExternalUrl) }}</span>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="ext-btn__arrow"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                      </a>
                    </div>

                  </div>

                  <!-- Quick film stats -->
                  <div class="film-stats" v-if="detail.durationSeconds || detail.resolution || detail.fileSizeMb || detail.fileFormat">
                    <div class="film-stat" v-if="detail.fileFormat">
                      <span class="film-stat__k">فۆرمات</span>
                      <span class="film-stat__v">{{ detail.fileFormat }}</span>
                    </div>
                    <div class="film-stat" v-if="detail.durationSeconds">
                      <span class="film-stat__k">کات</span>
                      <span class="film-stat__v">{{ fmtSeconds(detail.durationSeconds) }}</span>
                    </div>
                    <div class="film-stat" v-if="detail.resolution">
                      <span class="film-stat__k">ڕیزەڵوشن</span>
                      <span class="film-stat__v">{{ detail.resolution }}</span>
                    </div>
                    <div class="film-stat" v-if="detail.fileSizeMb">
                      <span class="film-stat__k">قەبارە</span>
                      <span class="film-stat__v">{{ detail.fileSizeMb }} MB</span>
                    </div>
                  </div>

                </div>
              </div>

              <!-- ════ RIGHT — INFO ════ -->
              <div class="pdm-info">
                <div class="pdm-info__head">
                  <div class="pdm-info__head-meta">
                    <span class="pdm-id-tag"># {{ detail.id }}</span>
                    <span class="type-pill" :style="filmTypeStyle(detail.filmType)">{{ detail.filmType || '—' }}</span>
                    <span class="date-pill" v-if="detail.publishmentDate">📅 {{ fmtDate(detail.publishmentDate) }}</span>
                  </div>

                  <h2 class="pdm-title">{{ bestTitle(detail) || '—' }}</h2>
                  <p class="pdm-subtitle" v-if="altTitle(detail)">{{ altTitle(detail) }}</p>

                  <div class="pdm-langs">
                    <span v-for="l in (detail.contentLanguages||[])" :key="l" class="pdm-lang" :class="`pdm-lang--${l.toLowerCase()}`">
                      {{ l === 'CKB' ? 'سۆرانی' : 'کورمانجی' }}
                    </span>
                  </div>

                  <RouterLink class="pdm-edit-btn" :to="`/admin/films/${detail.id}/edit`" @click="closeDetail">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4z"/>
                    </svg>
                    دەستکاری فیلم
                  </RouterLink>
                </div>

                <!-- Language tabs -->
                <div class="pdm-tabs" v-if="(detail.contentLanguages||[]).length > 1">
                  <button v-for="l in (detail.contentLanguages||[])" :key="l" class="pdm-tab" :class="{ 'pdm-tab--on': detailLang === l }" @click="detailLang = l">
                    <span class="pdm-tab__pip" :class="`pdm-tab__pip--${l.toLowerCase()}`"></span>
                    {{ l === 'CKB' ? 'سۆرانی' : 'کورمانجی' }}
                  </button>
                </div>

                <div class="pdm-info__body">

                  <!-- Description -->
                  <div class="acc" v-if="activeLangContent(detail)?.description">
                    <button class="acc__hd" @click="toggleAcc('desc')">
                      <span class="acc__hd-left">
                        <span class="acc__ico acc__ico--desc">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                            <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
                          </svg>
                        </span>
                        <span class="acc__title">وەسف</span>
                      </span>
                      <svg class="acc__chevron" :class="{'acc__chevron--open':openAccordions.has('desc')}" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M6 9l6 6 6-6"/></svg>
                    </button>
                    <Transition name="acc-body">
                      <div v-if="openAccordions.has('desc')" class="acc__body">
                        <p class="acc__text acc__text--desc">{{ activeLangContent(detail).description }}</p>
                      </div>
                    </Transition>
                  </div>

                  <!-- Film details (topic, director, producer, location) -->
                  <div class="acc" v-if="activeLangContent(detail)?.topic || activeLangContent(detail)?.director || activeLangContent(detail)?.producer || activeLangContent(detail)?.location">
                    <button class="acc__hd" @click="toggleAcc('meta')">
                      <span class="acc__hd-left">
                        <span class="acc__ico acc__ico--meta">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                          </svg>
                        </span>
                        <span class="acc__title">زانیاری فیلم</span>
                      </span>
                      <svg class="acc__chevron" :class="{'acc__chevron--open':openAccordions.has('meta')}" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M6 9l6 6 6-6"/></svg>
                    </button>
                    <Transition name="acc-body">
                      <div v-if="openAccordions.has('meta')" class="acc__body">
                        <div class="acc__meta-grid">
                          <div class="acc__meta-row" v-if="activeLangContent(detail)?.topic">
                            <span class="acc__meta-k">بابەت</span>
                            <span class="acc__meta-v">{{ activeLangContent(detail).topic }}</span>
                          </div>
                          <div class="acc__meta-row" v-if="activeLangContent(detail)?.director">
                            <span class="acc__meta-k">دەرهێنەر</span>
                            <span class="acc__meta-v">{{ activeLangContent(detail).director }}</span>
                          </div>
                          <div class="acc__meta-row" v-if="activeLangContent(detail)?.producer">
                            <span class="acc__meta-k">بەرهەمهێنەر</span>
                            <span class="acc__meta-v">{{ activeLangContent(detail).producer }}</span>
                          </div>
                          <div class="acc__meta-row" v-if="activeLangContent(detail)?.location">
                            <span class="acc__meta-k">
                              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                              شوێن
                            </span>
                            <span class="acc__meta-v">{{ activeLangContent(detail).location }}</span>
                          </div>
                        </div>
                      </div>
                    </Transition>
                  </div>

                  <!-- Source URLs info -->
                  <div class="acc" v-if="detail.sourceUrl || detail.sourceEmbedUrl || detail.sourceExternalUrl">
                    <button class="acc__hd" @click="toggleAcc('src')">
                      <span class="acc__hd-left">
                        <span class="acc__ico acc__ico--files">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="2" y="2" width="20" height="20" rx="2"/><polygon points="10 8 16 12 10 16 10 8"/>
                          </svg>
                        </span>
                        <span class="acc__title">سەرچاوەکان</span>
                      </span>
                      <svg class="acc__chevron" :class="{'acc__chevron--open':openAccordions.has('src')}" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M6 9l6 6 6-6"/></svg>
                    </button>
                    <Transition name="acc-body">
                      <div v-if="openAccordions.has('src')" class="acc__body">
                        <div class="src-url-list">
                          <div v-if="detail.sourceUrl" class="src-url-row">
                            <span class="src-url-label src-url-label--direct">SOURCE URL</span>
                            <a :href="detail.sourceUrl" target="_blank" class="src-url-link">{{ detail.sourceUrl }}</a>
                          </div>
                          <div v-if="detail.sourceEmbedUrl" class="src-url-row">
                            <span class="src-url-label src-url-label--embed">EMBED URL</span>
                            <a :href="detail.sourceEmbedUrl" target="_blank" class="src-url-link">{{ detail.sourceEmbedUrl }}</a>
                          </div>
                          <div v-if="detail.sourceExternalUrl" class="src-url-row">
                            <span class="src-url-label src-url-label--ext">EXTERNAL URL</span>
                            <a :href="detail.sourceExternalUrl" target="_blank" class="src-url-link">{{ detail.sourceExternalUrl }}</a>
                          </div>
                        </div>
                      </div>
                    </Transition>
                  </div>

                  <!-- Tags -->
                  <div class="acc" v-if="activeTags(detail).length">
                    <button class="acc__hd" @click="toggleAcc('tags')">
                      <span class="acc__hd-left">
                        <span class="acc__ico acc__ico--tag">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/>
                            <line x1="7" y1="7" x2="7.01" y2="7"/>
                          </svg>
                        </span>
                        <span class="acc__title">تاگەکان</span>
                        <span class="acc__badge acc__badge--tag">{{ activeTags(detail).length }}</span>
                      </span>
                      <svg class="acc__chevron" :class="{'acc__chevron--open':openAccordions.has('tags')}" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M6 9l6 6 6-6"/></svg>
                    </button>
                    <Transition name="acc-body">
                      <div v-if="openAccordions.has('tags')" class="acc__body">
                        <div class="acc__chips">
                          <span v-for="t in activeTags(detail)" :key="t" class="acc__chip acc__chip--tag">{{ t }}</span>
                        </div>
                      </div>
                    </Transition>
                  </div>

                  <!-- Keywords -->
                  <div class="acc" v-if="activeKeywords(detail).length">
                    <button class="acc__hd" @click="toggleAcc('kw')">
                      <span class="acc__hd-left">
                        <span class="acc__ico acc__ico--kw">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                          </svg>
                        </span>
                        <span class="acc__title">کیووەردەکان</span>
                        <span class="acc__badge acc__badge--kw">{{ activeKeywords(detail).length }}</span>
                      </span>
                      <svg class="acc__chevron" :class="{'acc__chevron--open':openAccordions.has('kw')}" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M6 9l6 6 6-6"/></svg>
                    </button>
                    <Transition name="acc-body">
                      <div v-if="openAccordions.has('kw')" class="acc__body">
                        <div class="acc__chips">
                          <span v-for="t in activeKeywords(detail)" :key="t" class="acc__chip acc__chip--kw">{{ t }}</span>
                        </div>
                      </div>
                    </Transition>
                  </div>

                  <!-- System info -->
                  <div class="acc acc--system">
                    <button class="acc__hd acc__hd--system" @click="toggleAcc('sys')">
                      <span class="acc__hd-left">
                        <span class="acc__ico acc__ico--sys">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="2" y="3" width="20" height="14" rx="2"/>
                            <line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
                          </svg>
                        </span>
                        <span class="acc__title">زانیاری سیستەم</span>
                      </span>
                      <svg class="acc__chevron" :class="{'acc__chevron--open':openAccordions.has('sys')}" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M6 9l6 6 6-6"/></svg>
                    </button>
                    <Transition name="acc-body">
                      <div v-if="openAccordions.has('sys')" class="acc__body acc__body--flush">
                        <div class="acc__sys-grid">
                          <div class="acc__sys-cell" v-if="detail.createdAt">
                            <div class="acc__sys-k">دروستکراوە لە</div>
                            <div class="acc__sys-v">{{ fmtDatetime(detail.createdAt) }}</div>
                          </div>
                          <div class="acc__sys-cell" v-if="detail.updatedAt">
                            <div class="acc__sys-k">دواین نوێکردنەوە</div>
                            <div class="acc__sys-v">{{ fmtDatetime(detail.updatedAt) }}</div>
                          </div>
                          <div class="acc__sys-cell acc__sys-cell--full">
                            <div class="acc__sys-k">ID</div>
                            <div class="acc__sys-v acc__sys-v--mono">{{ detail.id }}</div>
                          </div>
                          <div class="acc__sys-cell acc__sys-cell--full" v-if="detail.coverUrl">
                            <div class="acc__sys-k">Cover URL</div>
                            <a :href="detail.coverUrl" target="_blank" class="acc__sys-v acc__sys-v--link">{{ detail.coverUrl }}</a>
                          </div>
                        </div>
                      </div>
                    </Transition>
                  </div>

                </div>
              </div>

            </div>
          </Transition>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import api from '@/api.js'

const items           = ref([])
const loading         = ref(false)
const error           = ref('')
const searchQ         = ref('')
const filterLang      = ref('')
const delTarget       = ref(null)
const deleting        = ref(false)
const toast           = ref({ show: false, type: 'success', msg: '' })
const detail          = ref(null)
const detailLang      = ref('CKB')
const detailOverlayEl = ref(null)
const openAccordions  = ref(new Set(['desc', 'meta', 'src', 'tags', 'kw']))
const page            = ref({ number: 0, totalPages: 1, totalElements: 0, size: 10 })

let toastTimer = null

/* ── generic helpers ── */
const ensureArray = (v) => Array.isArray(v) ? v : []
const cleanUrl = (u) => (typeof u === 'string' ? u.trim() : '')

/* ── HTML/embed helpers (fix pasted iframe + youtube link) ── */
const decodeHtmlEntities = (str = '') =>
  String(str)
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')

const isHttpUrl = (u) => /^https?:\/\//i.test(cleanUrl(u))

const getUrlObj = (u) => {
  try { return new URL(cleanUrl(u)) } catch { return null }
}

const extractIframeSrcFromHtml = (raw = '') => {
  const s = String(raw || '')
  if (!/<iframe[\s\S]*?>/i.test(s)) return ''
  const m = s.match(/src\s*=\s*["']([^"']+)["']/i)
  return m?.[1] ? decodeHtmlEntities(m[1]) : ''
}

const parseYouTubeTimeToSeconds = (t = '') => {
  const s = String(t || '').trim().toLowerCase()
  if (!s) return 0
  if (/^\d+$/.test(s)) return Number(s)

  const m = s.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/)
  if (!m) return 0
  return (Number(m[1] || 0) * 3600) + (Number(m[2] || 0) * 60) + Number(m[3] || 0)
}

const extractYouTubeId = (raw = '') => {
  const input = extractIframeSrcFromHtml(raw) || decodeHtmlEntities(raw)
  const u = getUrlObj(input)
  if (!u) return ''

  const host = u.hostname.toLowerCase()

  if (host.includes('youtu.be')) {
    return u.pathname.replace(/^\/+/, '').split('/')[0] || ''
  }

  if (host.includes('youtube.com') || host.includes('youtube-nocookie.com')) {
    if (u.searchParams.get('v')) return u.searchParams.get('v')

    const parts = u.pathname.split('/').filter(Boolean)
    const idxEmbed = parts.indexOf('embed')
    if (idxEmbed !== -1 && parts[idxEmbed + 1]) return parts[idxEmbed + 1]

    const idxShorts = parts.indexOf('shorts')
    if (idxShorts !== -1 && parts[idxShorts + 1]) return parts[idxShorts + 1]

    const idxLive = parts.indexOf('live')
    if (idxLive !== -1 && parts[idxLive + 1]) return parts[idxLive + 1]
  }

  return ''
}

const extractVimeoId = (raw = '') => {
  const input = extractIframeSrcFromHtml(raw) || decodeHtmlEntities(raw)
  const u = getUrlObj(input)
  if (!u) return ''
  const host = u.hostname.toLowerCase()
  if (!host.includes('vimeo.com')) return ''
  const parts = u.pathname.split('/').filter(Boolean)
  return [...parts].reverse().find(p => /^\d+$/.test(p)) || ''
}

const extractGoogleDriveFileId = (raw = '') => {
  const input = extractIframeSrcFromHtml(raw) || decodeHtmlEntities(raw)
  const u = getUrlObj(input)
  if (!u) return ''
  const host = u.hostname.toLowerCase()
  if (!host.includes('drive.google.com')) return ''

  const m = u.pathname.match(/\/file\/d\/([^/]+)/)
  if (m?.[1]) return m[1]
  return u.searchParams.get('id') || ''
}

const toEmbeddableUrl = (raw = '') => {
  let u = decodeHtmlEntities(cleanUrl(raw))
  if (!u) return ''

  const iframeSrc = extractIframeSrcFromHtml(u)
  if (iframeSrc) u = iframeSrc

  if (!isHttpUrl(u)) return ''

  const obj = getUrlObj(u)
  if (!obj) return ''

  const host = obj.hostname.toLowerCase()
  const pathname = obj.pathname.toLowerCase()

  // already embed/player
  if (pathname.includes('/embed/') || pathname.includes('/player/')) return obj.toString()

  // YouTube
  const ytId = extractYouTubeId(u)
  if (ytId) {
    const srcObj = getUrlObj(u)
    const embed = new URL(`https://www.youtube.com/embed/${ytId}`)

    const start = srcObj?.searchParams.get('start')
    const t = srcObj?.searchParams.get('t')
    const si = srcObj?.searchParams.get('si')

    if (start) embed.searchParams.set('start', start)
    else if (t) {
      const sec = parseYouTubeTimeToSeconds(t)
      if (sec > 0) embed.searchParams.set('start', String(sec))
    }
    if (si) embed.searchParams.set('si', si)

    return embed.toString()
  }

  // Vimeo
  const vimeoId = extractVimeoId(u)
  if (vimeoId) return `https://player.vimeo.com/video/${vimeoId}`

  // Google Drive preview
  const gdid = extractGoogleDriveFileId(u)
  if (gdid) return `https://drive.google.com/file/d/${gdid}/preview`

  // known embeddable providers
  if (
    host.includes('dailymotion.com') ||
    host.includes('soundcloud.com') ||
    host.includes('w.soundcloud.com') ||
    host.includes('spotify.com') ||
    host.includes('open.spotify.com')
  ) return obj.toString()

  return ''
}

const normalizeFilm = (f = {}) => {
  const out = { ...f }

  if (!out.ckbContent && out.content?.ckb) out.ckbContent = out.content.ckb
  if (!out.kmrContent && out.content?.kmr) out.kmrContent = out.content.kmr

  if (!ensureArray(out.contentLanguages).length) {
    const langs = []
    if (out.ckbContent?.title || out.ckbContent?.description || out.content?.ckb) langs.push('CKB')
    if (out.kmrContent?.title || out.kmrContent?.description || out.content?.kmr) langs.push('KMR')
    out.contentLanguages = langs
  }

  out.tagsCkb = ensureArray(out.tagsCkb || out.tags?.ckb)
  out.tagsKmr = ensureArray(out.tagsKmr || out.tags?.kmr)
  out.keywordsCkb = ensureArray(out.keywordsCkb || out.keywords?.ckb)
  out.keywordsKmr = ensureArray(out.keywordsKmr || out.keywords?.kmr)

  // Normalize source links fields (support backend variants)
  out.sourceUrl =
    out.sourceUrl ||
    out.url ||
    out.link ||
    out.watchUrl ||
    out.videoUrl ||
    ''

  out.sourceEmbedUrl =
    out.sourceEmbedUrl ||
    out.embedUrl ||
    out.trailerEmbedUrl ||
    out.playerEmbedUrl ||
    ''

  out.sourceExternalUrl =
    out.sourceExternalUrl ||
    out.externalUrl ||
    out.trailerUrl ||
    out.platformUrl ||
    ''

  // If someone pasted iframe HTML into any field, convert nicely
  if (!out.sourceEmbedUrl) {
    const iframeSrc =
      extractIframeSrcFromHtml(out.sourceUrl) ||
      extractIframeSrcFromHtml(out.sourceExternalUrl)
    if (iframeSrc) out.sourceEmbedUrl = iframeSrc
  }

  out.embeddableUrl =
    toEmbeddableUrl(out.sourceEmbedUrl) ||
    toEmbeddableUrl(out.sourceUrl) ||
    toEmbeddableUrl(out.sourceExternalUrl) ||
    ''

  return out
}

const filteredItems = computed(() => {
  let list = ensureArray(items.value)
  if (filterLang.value) {
    list = list.filter(f => ensureArray(f.contentLanguages).includes(filterLang.value))
  }
  return list
})

const pageNumbers = computed(() => {
  const total = Number(page.value.totalPages || 1)
  const cur   = Number(page.value.number || 0)
  const pages = []
  const from  = Math.max(0, cur - 2)
  const to    = Math.min(total - 1, cur + 2)
  for (let i = from; i <= to; i++) pages.push(i)
  return pages
})

const load = async (pageNum = 0) => {
  loading.value = true
  error.value = ''

  try {
    const q = (searchQ?.value || '').trim()
    let res

    if (!q) {
      // normal paginated list
      res = await api.get('/api/v1/films', {
        params: { page: pageNum, size: 10 }
      })
    } else {
      // 1) try keyword search first (FilmController expects q)
      let keywordRes = null
      let keywordContent = []

      try {
        keywordRes = await api.get('/api/v1/films/search/keyword', {
          params: {
            q,
            page: pageNum,
            size: 10
          }
        })

        const kdata = keywordRes?.data ?? {}
        const kroot = kdata?.data ?? kdata ?? {}
        keywordContent = ensureArray(kroot?.content ?? kdata?.content ?? [])
      } catch (_) {
        // ignore and fallback to tag search
      }

      if (keywordRes && keywordContent.length > 0) {
        res = keywordRes
      } else {
        // 2) fallback tag search (FilmController also expects q)
        res = await api.get('/api/v1/films/search/tag', {
          params: {
            q,
            page: pageNum,
            size: 10
          }
        })
      }
    }

    const data = res?.data ?? {}
    const root = data?.data ?? data ?? {}
    const content = root?.content ?? data?.content ?? []

    items.value = ensureArray(content).map(normalizeFilm)

    page.value = {
      number:        root?.number        ?? data?.number        ?? pageNum,
      totalPages:    root?.totalPages    ?? data?.totalPages    ?? 1,
      totalElements: root?.totalElements ?? data?.totalElements ?? items.value.length,
      size:          root?.size          ?? data?.size          ?? 10
    }
  } catch (e) {
    error.value = e?.response?.data?.message || e.message || 'هەڵەیەک ڕوویدا'
    items.value = []
    page.value = {
      number: pageNum,
      totalPages: 1,
      totalElements: 0,
      size: 10
    }
  } finally {
    loading.value = false
  }
}

/* ✅ FIXED: use load() so keyword -> tag fallback works */
const doSearch = async () => {
  page.value.number = 0
  await load(0)
}

const clearSearch = () => {
  searchQ.value = ''
  load(0)
}

const applyFilter = () => {}

const goPage = (n) => {
  if (n < 0 || n >= (page.value.totalPages || 1)) return
  load(n)
}

const confirmDelete = (f) => { delTarget.value = f }

const doDelete = async () => {
  if (!delTarget.value) return
  deleting.value = true

  const deletingId = delTarget.value.id

  try {
    await api.delete(`/api/v1/films/${deletingId}`)
    showToast('success', 'فیلمەکە بە سەرکەوتنی سڕایەوە')

    if (detail.value?.id === deletingId) closeDetail()

    delTarget.value = null
    await load(page.value.number)

    // if current page became empty after delete, go back one page
    if (!items.value.length && page.value.number > 0) {
      await load(page.value.number - 1)
    }
  } catch (e) {
    showToast('error', e?.response?.data?.message || 'سڕینەوە سەرنەکەوت')
  } finally {
    deleting.value = false
  }
}

const openDetail = (f) => {
  const item = normalizeFilm(f)
  detail.value = item
  detailLang.value = ensureArray(item.contentLanguages).includes('CKB')
    ? 'CKB'
    : (ensureArray(item.contentLanguages)[0] || 'CKB')

  openAccordions.value = new Set(['desc', 'meta', 'src', 'tags', 'kw'])
}

const closeDetail = () => { detail.value = null }

const onGlobalKeydown = (e) => {
  if (e.key === 'Escape' && detail.value) closeDetail()
}

watch(detail, async (v) => {
  if (v) {
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onGlobalKeydown)
    await nextTick()
    detailOverlayEl.value?.focus?.()
  } else {
    document.body.style.overflow = ''
    window.removeEventListener('keydown', onGlobalKeydown)
  }
})

const toggleAcc = (key) => {
  const s = new Set(openAccordions.value)
  s.has(key) ? s.delete(key) : s.add(key)
  openAccordions.value = s
}

/* helpers */
const bestTitle = (f) =>
  f?.ckbContent?.title || f?.kmrContent?.title || f?.content?.ckb?.title || f?.content?.kmr?.title || ''

const altTitle = (f) => {
  const ckb = f?.ckbContent?.title || f?.content?.ckb?.title || ''
  const kmr = f?.kmrContent?.title || f?.content?.kmr?.title || ''
  if (ckb && kmr && ckb !== kmr) return detailLang.value === 'CKB' ? kmr : ckb
  return ''
}

const activeLangContent = (f) =>
  detailLang.value === 'CKB'
    ? (f?.ckbContent || f?.content?.ckb || {})
    : (f?.kmrContent || f?.content?.kmr || {})

const activeTags = (f) =>
  detailLang.value === 'CKB'
    ? ensureArray(f?.tagsCkb || f?.tags?.ckb)
    : ensureArray(f?.tagsKmr || f?.tags?.kmr)

const activeKeywords = (f) =>
  detailLang.value === 'CKB'
    ? ensureArray(f?.keywordsCkb || f?.keywords?.ckb)
    : ensureArray(f?.keywordsKmr || f?.keywords?.kmr)

/* normalized source helpers for template */
const detailSourceInfo = computed(() => {
  const f = detail.value
  if (!f) return { embedUrl: '', openUrl: '', sourceText: '' }

  const embedUrl =
    f.embeddableUrl ||
    toEmbeddableUrl(f.sourceEmbedUrl) ||
    toEmbeddableUrl(f.sourceUrl) ||
    toEmbeddableUrl(f.sourceExternalUrl) ||
    ''

  const openUrl =
    cleanUrl(f.sourceExternalUrl) ||
    cleanUrl(f.sourceUrl) ||
    cleanUrl(f.sourceEmbedUrl) ||
    ''

  const sourceText = truncUrl(openUrl || embedUrl)

  return { embedUrl, openUrl, sourceText }
})

const filmTypeStyle = (type) => {
  if (!type) return {}
  const presets = {
    DOCUMENTARY: { background:'rgba(22,120,70,.12)',  color:'#166044',  border:'1px solid rgba(22,120,70,.22)' },
    SHORT:       { background:'rgba(40,90,220,.12)',  color:'#1a47a0',  border:'1px solid rgba(40,90,220,.22)' },
    FEATURE:     { background:'rgba(140,21,21,.10)',  color:'#8c1515',  border:'1px solid rgba(140,21,21,.22)' },
    ANIMATION:   { background:'rgba(200,100,0,.12)',  color:'#7a4500',  border:'1px solid rgba(200,100,0,.22)' },
    SERIES:      { background:'rgba(80,40,160,.12)',  color:'#5028a0',  border:'1px solid rgba(80,40,160,.22)' },
  }
  if (presets[String(type).toUpperCase()]) return presets[String(type).toUpperCase()]

  let hash = 0
  const s = String(type)
  for (let i = 0; i < s.length; i++) hash = s.charCodeAt(i) + ((hash << 5) - hash)
  const hue = Math.abs(hash) % 360
  return {
    background:`hsla(${hue},55%,45%,.12)`,
    color:`hsl(${hue},55%,28%)`,
    border:`1px solid hsla(${hue},55%,45%,.25)`
  }
}

const platformLabel = (url) => {
  if (!url) return '🔗 Open'
  const u = String(url).toLowerCase()
  if (u.includes('youtube.com') || u.includes('youtu.be')) return '▶ YouTube'
  if (u.includes('vimeo.com')) return '🎬 Vimeo'
  if (u.includes('dailymotion')) return '🎥 Dailymotion'
  if (u.includes('drive.google.com')) return '📁 Drive'
  return '🔗 Open link'
}

const truncUrl = (url) => {
  if (!url) return ''
  try {
    const u = new URL(url)
    const p = u.pathname.length > 28 ? u.pathname.slice(0, 28) + '…' : u.pathname
    return u.hostname + p
  } catch {
    return url.slice(0, 42) + (url.length > 42 ? '…' : '')
  }
}

const fmtSeconds = (s) => {
  if (!s) return '—'
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const ss = Math.floor(s % 60)
  const p = (x) => String(x).padStart(2, '0')
  return h > 0 ? `${h}:${p(m)}:${p(ss)}` : `${m}:${p(ss)}`
}

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString('ar-IQ', { year:'numeric', month:'short', day:'numeric' }) : '—'

const fmtDatetime = (d) =>
  d ? new Date(d).toLocaleString('ar-IQ', { year:'numeric', month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' }) : '—'

const showToast = (type, msg) => {
  clearTimeout(toastTimer)
  toast.value = { show: true, type, msg }
  toastTimer = setTimeout(() => { toast.value.show = false }, 3500)
}

onMounted(() => load())

onBeforeUnmount(() => {
  clearTimeout(toastTimer)
  document.body.style.overflow = ''
  window.removeEventListener('keydown', onGlobalKeydown)
})
</script>

<style scoped>
.stl { direction:rtl; max-width:1400px; margin:0 auto; }
.stl__head { display:flex; align-items:center; justify-content:space-between; margin-bottom:1.5rem; gap:1rem; flex-wrap:wrap; }
.stl__title { font-size:1.55rem; font-weight:700; color:var(--text); }
.stl__sub   { color:var(--muted); font-size:.83rem; margin-top:.2rem; }

.btn { display:inline-flex; align-items:center; gap:.45rem; padding:.65rem 1.1rem; border-radius:var(--radius-sm); font-weight:700; font-size:.87rem; cursor:pointer; border:1px solid transparent; transition:var(--transition); text-decoration:none; white-space:nowrap; font-family:inherit; }
.btn--primary { background:var(--crimson); color:#fff; box-shadow:0 6px 20px rgba(140,21,21,.22); }
.btn--primary:hover { background:var(--crimson-lt); transform:translateY(-1px); }
.btn--ghost   { background:transparent; border-color:var(--border); color:var(--text); }
.btn--ghost:hover { border-color:var(--crimson); color:var(--crimson); }
.btn--danger  { background:#c0392b; color:#fff; border-color:#c0392b; }
.btn--danger:hover { background:#a93226; }
.btn--sm { padding:.45rem .85rem; font-size:.82rem; }
.btn:disabled { opacity:.5; cursor:not-allowed; transform:none!important; }

.stl__bar { display:flex; gap:.75rem; margin-bottom:1.25rem; flex-wrap:wrap; }
.search { flex:1; min-width:240px; position:relative; display:flex; align-items:center; }
.search__ico { position:absolute; right:.85rem; color:var(--muted); pointer-events:none; }
.search__input { width:100%; padding:.65rem 2.3rem .65rem 2.5rem; border:1.5px solid var(--border); border-radius:var(--radius-sm); background:var(--white); color:var(--text); font-size:.9rem; outline:none; transition:var(--transition); font-family:inherit; }
.search__input:focus { border-color:var(--crimson); box-shadow:0 0 0 3px rgba(140,21,21,.1); }
.search__clear { position:absolute; left:.7rem; background:var(--cream-dk); border:1px solid var(--border); border-radius:50%; width:20px; height:20px; display:flex; align-items:center; justify-content:center; cursor:pointer; color:var(--muted); transition:var(--transition); padding:0; }
.search__clear:hover { background:var(--crimson); border-color:var(--crimson); color:#fff; }
.sel { padding:.65rem .9rem; border:1.5px solid var(--border); border-radius:var(--radius-sm); background:var(--white); color:var(--text); font-size:.87rem; outline:none; cursor:pointer; transition:var(--transition); font-family:inherit; }
.sel:focus { border-color:var(--crimson); }

.toast { display:flex; align-items:center; gap:.65rem; padding:.75rem 1.1rem; border-radius:var(--radius-sm); font-weight:600; font-size:.87rem; margin-bottom:1rem; }
.toast--success { background:rgba(22,120,70,.09); border:1px solid rgba(22,120,70,.22); color:#166044; }
.toast--error   { background:rgba(140,21,21,.07); border:1px solid rgba(140,21,21,.18); color:var(--crimson); }
.skeletons { display:flex; flex-direction:column; gap:.55rem; }
.skel { height:58px; border-radius:var(--radius-sm); background:linear-gradient(90deg,var(--cream-dk) 25%,#eae8e4 50%,var(--cream-dk) 75%); background-size:200% 100%; animation:shimmer 1.4s ease infinite; }
@keyframes shimmer { 0%{background-position:200% 0}100%{background-position:-200% 0} }

.state-box { display:flex; flex-direction:column; align-items:center; gap:.85rem; padding:4rem 2rem; color:var(--muted); text-align:center; background:var(--white); border:1px solid var(--border); border-radius:var(--radius-md); font-size:.9rem; }
.state-box--error { color:var(--crimson); }
.state-box__ico { width:58px; height:58px; border-radius:50%; background:var(--cream-dk); border:1px solid var(--border); display:flex; align-items:center; justify-content:center; }

.table-meta { font-size:.8rem; color:var(--muted); padding:.6rem .9rem; background:var(--cream-dk); border-bottom:1px solid var(--border); }
.table-wrap { background:var(--white); border:1px solid var(--border); border-radius:var(--radius-md); overflow:hidden; box-shadow:var(--shadow-sm); }
.tbl { width:100%; border-collapse:collapse; font-size:.87rem; }
.tbl thead tr { background:var(--cream-dk); border-bottom:2px solid var(--border); }
.tbl th { padding:.8rem .9rem; text-align:right; font-weight:700; color:var(--text); font-size:.79rem; white-space:nowrap; }
.tbl__row { border-bottom:1px solid var(--cream-dk); cursor:pointer; transition:background var(--transition); }
.tbl__row:hover { background:rgba(140,21,21,.03); }
.tbl__row:last-child { border-bottom:none; }
.tbl td { padding:.72rem .9rem; vertical-align:middle; }
.tbl__id   { font-size:.78rem; color:var(--muted); font-weight:600; }
.tbl__name { font-weight:600; color:var(--text); line-height:1.3; }
.tbl__name--kmr { font-weight:500; color:var(--muted); }
.tbl__date { font-size:.82rem; color:var(--muted); white-space:nowrap; }
.tbl__dash { color:var(--border); }

.cover-wrap  { width:50px; height:38px; border-radius:8px; overflow:hidden; border:1px solid var(--border); }
.cover-img   { width:100%; height:100%; object-fit:cover; display:block; }
.cover-empty { width:50px; height:38px; border-radius:8px; border:1px dashed var(--border); display:flex; align-items:center; justify-content:center; color:var(--border); }

.type-pill { display:inline-flex; padding:.22rem .65rem; border-radius:99px; font-size:.73rem; font-weight:700; white-space:nowrap; }
.fmt-pill  { display:inline-flex; padding:.18rem .5rem; border-radius:6px; font-size:.72rem; font-weight:700; background:var(--cream-dk); border:1px solid var(--border); color:var(--muted); }
.lang-dot      { display:inline-flex; padding:.18rem .5rem; border-radius:6px; font-size:.72rem; font-weight:700; }
.lang-dot--ckb { background:rgba(254,221,0,.2); color:#806e00; border:1px solid rgba(254,221,0,.4); }
.lang-dot--kmr { background:rgba(30,90,200,.1);  color:#1a47a0; border:1px solid rgba(30,90,200,.2); }
.lang-row { display:flex; gap:.3rem; flex-wrap:wrap; }

.tbl__acts { display:flex; gap:.35rem; }
.act { width:30px; height:30px; border-radius:8px; border:1px solid var(--border); background:var(--cream); color:var(--muted); cursor:pointer; text-decoration:none; display:inline-flex; align-items:center; justify-content:center; transition:var(--transition); }
.act--view:hover { background:rgba(30,90,200,.08); border-color:rgba(30,90,200,.28); color:#1a47a0; }
.act--edit:hover { background:rgba(30,150,80,.08); border-color:rgba(30,150,80,.28); color:#166044; }
.act--del:hover  { background:rgba(140,21,21,.08); border-color:rgba(140,21,21,.25); color:var(--crimson); }

/* Pagination */
.pagination { display:flex; align-items:center; justify-content:center; gap:.4rem; padding:.9rem; border-top:1px solid var(--border); }
.pg-btn { width:34px; height:34px; border-radius:8px; border:1px solid var(--border); background:var(--white); color:var(--muted); cursor:pointer; font-weight:700; font-size:.82rem; display:flex; align-items:center; justify-content:center; transition:var(--transition); font-family:inherit; }
.pg-btn:hover:not(:disabled) { border-color:var(--crimson); color:var(--crimson); }
.pg-btn--on { background:var(--crimson); border-color:var(--crimson); color:#fff; }
.pg-btn:disabled { opacity:.35; cursor:default; }

/* Delete modal */
.overlay   { position:fixed; inset:0; z-index:200; background:rgba(20,10,10,.5); display:flex; align-items:center; justify-content:center; padding:1rem; }
.del-modal { background:var(--white); border-radius:var(--radius-lg); padding:2rem; max-width:400px; width:100%; box-shadow:0 30px 80px rgba(0,0,0,.25); text-align:center; }
.del-modal__ico   { width:62px; height:62px; border-radius:50%; background:rgba(140,21,21,.07); border:1px solid rgba(140,21,21,.14); display:flex; align-items:center; justify-content:center; margin:0 auto .85rem; }
.del-modal__title { font-size:1.15rem; font-weight:700; margin-bottom:.5rem; }
.del-modal__body  { color:var(--muted); font-size:.9rem; line-height:1.7; margin-bottom:1.5rem; }
.del-modal__acts  { display:flex; gap:.75rem; justify-content:center; }
.spinner { width:13px; height:13px; border:2px solid rgba(255,255,255,.35); border-top-color:#fff; border-radius:50%; animation:spin .65s linear infinite; }
@keyframes spin { to { transform:rotate(360deg) } }
.fade-enter-active,.fade-leave-active { transition:opacity .15s }
.fade-enter-from,.fade-leave-to { opacity:0 }
.slide-down-enter-active,.slide-down-leave-active { transition:.3s ease }
.slide-down-enter-from,.slide-down-leave-to { opacity:0; transform:translateY(-8px) }
.modal-enter-active,.modal-leave-active { transition:.25s ease }
.modal-enter-from,.modal-leave-to { opacity:0 }
.modal-enter-active .del-modal,.modal-leave-active .del-modal { transition:.25s ease }
.modal-enter-from .del-modal,.modal-leave-to .del-modal { transform:scale(.94) translateY(8px) }

/* ══════════════ DETAIL MODAL ══════════════ */
.pdm-overlay { position:fixed; inset:0; z-index:400; background:rgba(5,2,2,.78); backdrop-filter:blur(12px); display:flex; align-items:center; justify-content:center; padding:1.5rem; overflow-y:auto; }
.pdm { position:relative; width:100%; max-width:1100px; max-height:calc(100vh - 3rem); background:#141010; border-radius:20px; overflow:hidden; display:grid; grid-template-columns:1fr 430px; box-shadow:0 0 0 1px rgba(255,255,255,.07),0 40px 120px rgba(0,0,0,.75); }
@media (max-width:840px) { .pdm { grid-template-columns:1fr; max-height:none; } }

.pdm-x { position:absolute; top:1rem; left:1rem; z-index:50; width:36px; height:36px; border-radius:50%; background:rgba(0,0,0,.55); border:1px solid rgba(255,255,255,.15); color:rgba(255,255,255,.85); cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all .22s ease; }
.pdm-x:hover { background:rgba(140,21,21,.8); color:#fff; transform:rotate(90deg) scale(1.08); }

/* Left / Media */
.pdm-media { position:relative; display:flex; flex-direction:column; background:#0c0808; min-height:480px; overflow-y:auto; }
.pdm-media__bg { position:absolute; inset:0; background-size:cover; background-position:center; opacity:.12; filter:blur(20px); transform:scale(1.05); }
.pdm-media__inner { position:relative; z-index:1; flex:1; display:flex; flex-direction:column; gap:.85rem; padding:1.25rem 1.15rem 1.4rem; }
.pdm-media::-webkit-scrollbar { width:3px } .pdm-media::-webkit-scrollbar-thumb { background:rgba(255,255,255,.1); border-radius:99px; }

.no-source { flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:.7rem; color:rgba(255,255,255,.25); font-size:.85rem; position:relative; }
.no-source__ico { width:72px; height:72px; border-radius:50%; background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.08); display:flex; align-items:center; justify-content:center; }
.fallback-cover { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; opacity:.2; border-radius:0; }

.src-blocks { display:flex; flex-direction:column; gap:.7rem; }
.src-block { border-radius:14px; padding:.85rem 1rem; display:flex; flex-direction:column; gap:.55rem; }
.src-block--direct { background:rgba(22,180,90,.06);  border:1px solid rgba(22,180,90,.14); }
.src-block--embed  { background:rgba(80,120,255,.06); border:1px solid rgba(80,120,255,.14); }
.src-block--ext    { background:rgba(255,180,30,.05); border:1px solid rgba(255,180,30,.14); }
.src-block__hd { display:flex; align-items:center; gap:.4rem; font-size:.69rem; font-weight:900; letter-spacing:.05em; text-transform:uppercase; }
.src-block--direct .src-block__hd { color:rgba(22,200,90,.75); }
.src-block--embed  .src-block__hd { color:rgba(80,140,255,.75); }
.src-block--ext    .src-block__hd { color:rgba(255,190,50,.75); }

.native-video { width:100%; border-radius:10px; max-height:220px; background:#000; }
.iframe-wrap  { border-radius:10px; overflow:hidden; background:#000; }
.embed-iframe { width:100%; height:210px; border:none; display:block; }
.raw-link { display:inline-flex; align-items:center; gap:.35rem; font-size:.71rem; color:rgba(255,255,255,.28); text-decoration:none; transition:.18s; word-break:break-all; }
.raw-link:hover { color:rgba(255,255,255,.65); }

.ext-btn { display:flex; flex-direction:column; gap:.2rem; padding:.8rem 1rem; border-radius:12px; background:rgba(255,255,255,.07); border:1px solid rgba(255,255,255,.12); color:rgba(255,255,255,.88); text-decoration:none; transition:.2s; position:relative; }
.ext-btn:hover { background:rgba(140,21,21,.55); border-color:rgba(140,21,21,.8); }
.ext-btn__platform { font-weight:800; font-size:.92rem; }
.ext-btn__url      { font-size:.72rem; color:rgba(255,255,255,.35); word-break:break-all; }
.ext-btn__arrow    { position:absolute; top:.75rem; left:.8rem; color:rgba(255,255,255,.3); }

/* Film stats strip */
.film-stats { display:flex; gap:.5rem; flex-wrap:wrap; padding:.65rem .8rem; background:rgba(255,255,255,.04); border-radius:12px; border:1px solid rgba(255,255,255,.08); }
.film-stat  { display:flex; flex-direction:column; gap:.1rem; flex:1; min-width:55px; }
.film-stat__k { font-size:.66rem; font-weight:700; color:rgba(255,255,255,.3); text-transform:uppercase; letter-spacing:.04em; }
.film-stat__v { font-size:.82rem; font-weight:800; color:rgba(255,255,255,.78); }

/* Right info panel */
.pdm-info { display:flex; flex-direction:column; background:#faf8f5; border-right:1px solid rgba(0,0,0,.08); max-height:calc(100vh - 3rem); overflow:hidden; }
.pdm-info__head { flex:0 0 auto; padding:1.6rem 1.4rem 1.1rem; background:#fff; border-bottom:1px solid #ece7df; }
.pdm-info__head-meta { display:flex; align-items:center; gap:.5rem; margin-bottom:.7rem; flex-wrap:wrap; }
.pdm-id-tag  { font-size:.72rem; font-weight:700; color:#b0a898; letter-spacing:.06em; }
.date-pill   { display:inline-flex; padding:.2rem .6rem; border-radius:99px; font-size:.72rem; font-weight:700; background:var(--cream-dk,#f0ece5); color:var(--muted,#9a9286); border:1px solid #e4dfd7; }
.pdm-title   { font-size:1.35rem; font-weight:800; color:#1a1410; line-height:1.25; letter-spacing:-.02em; margin:0 0 .3rem; }
.pdm-subtitle{ font-size:.88rem; color:#9a9286; font-weight:500; margin:0 0 .65rem; }
.pdm-langs   { display:flex; align-items:center; gap:.4rem; flex-wrap:wrap; margin-bottom:.85rem; }
.pdm-lang    { display:inline-flex; padding:.2rem .65rem; border-radius:6px; font-size:.72rem; font-weight:700; }
.pdm-lang--ckb { background:rgba(254,221,0,.14); color:#7a6200; border:1px solid rgba(254,221,0,.35); }
.pdm-lang--kmr { background:rgba(40,90,220,.08); color:#2848b0; border:1px solid rgba(40,90,220,.18); }
.pdm-edit-btn { display:inline-flex; align-items:center; gap:.4rem; padding:.55rem 1.1rem; border-radius:10px; background:#8c1515; color:#fff; border:none; font-size:.82rem; font-weight:700; text-decoration:none; cursor:pointer; transition:all .2s; width:100%; justify-content:center; font-family:inherit; box-shadow:0 4px 16px rgba(140,21,21,.28); }
.pdm-edit-btn:hover { background:#a61c1c; transform:translateY(-1px); }

.pdm-tabs { flex:0 0 auto; display:flex; background:#f0ece5; border-bottom:1px solid #e4dfd7; }
.pdm-tab  { flex:1; display:inline-flex; align-items:center; justify-content:center; gap:.4rem; padding:.65rem 1rem; border:none; background:none; color:#9a9286; font-weight:700; font-size:.83rem; cursor:pointer; transition:all .2s; font-family:inherit; border-bottom:2px solid transparent; }
.pdm-tab--on { color:#8c1515; background:#faf8f5; border-bottom-color:#8c1515; }
.pdm-tab__pip      { width:7px; height:7px; border-radius:50%; }
.pdm-tab__pip--ckb { background:#c8a800; }
.pdm-tab__pip--kmr { background:#4a7af0; }

.pdm-info__body { flex:1; overflow-y:auto; display:flex; flex-direction:column; gap:0; padding-bottom:1.5rem; }
.pdm-info__body::-webkit-scrollbar { width:3px } .pdm-info__body::-webkit-scrollbar-thumb { background:#d4cec6; border-radius:99px; }

/* Accordions */
.acc { border-bottom:1px solid #ede8e0; }
.acc:last-child { border-bottom:none; }
.acc__hd { width:100%; display:flex; align-items:center; justify-content:space-between; padding:.95rem 1.3rem; background:none; border:none; cursor:pointer; font-family:inherit; transition:background .18s; gap:.5rem; }
.acc__hd:hover { background:rgba(140,21,21,.03); }
.acc__hd--system:hover { background:rgba(100,80,50,.04); }
.acc__hd-left { display:flex; align-items:center; gap:.7rem; flex:1; min-width:0; }
.acc__ico { width:32px; height:32px; border-radius:9px; display:flex; align-items:center; justify-content:center; flex-shrink:0; transition:transform .2s; }
.acc__hd:hover .acc__ico { transform:scale(1.08); }
.acc__ico--desc  { background:rgba(140,21,21,.09); color:#8c1515;  border:1px solid rgba(140,21,21,.16); }
.acc__ico--meta  { background:rgba(22,120,70,.09);  color:#166044;  border:1px solid rgba(22,120,70,.18); }
.acc__ico--files { background:rgba(80,40,160,.09);  color:#5028a0;  border:1px solid rgba(80,40,160,.18); }
.acc__ico--tag   { background:rgba(200,168,0,.12);  color:#7a6200;  border:1px solid rgba(200,168,0,.22); }
.acc__ico--kw    { background:rgba(40,90,220,.09);  color:#2848b0;  border:1px solid rgba(40,90,220,.16); }
.acc__ico--sys   { background:rgba(80,80,80,.08);   color:#505050;  border:1px solid rgba(80,80,80,.14);  }
.acc__title { font-size:.92rem; font-weight:700; color:#1e1812; }
.acc__badge { display:inline-flex; padding:.18rem .58rem; border-radius:99px; font-size:.71rem; font-weight:800; }
.acc__badge--tag { background:rgba(200,168,0,.12); color:#7a6200; border:1px solid rgba(200,168,0,.22); }
.acc__badge--kw  { background:rgba(40,90,220,.09); color:#2848b0; border:1px solid rgba(40,90,220,.16); }
.acc__chevron { color:#c8c0b4; flex-shrink:0; transition:transform .28s cubic-bezier(.34,1.56,.64,1),color .18s; }
.acc__chevron--open { transform:rotate(180deg); color:#8c1515; }
.acc__hd:hover .acc__chevron { color:#8c1515; }
.acc__body { overflow:hidden; padding:0 1.3rem 1.1rem; }
.acc__body--flush { padding:0 0 .5rem; }
.acc-body-enter-active { transition:all .3s cubic-bezier(.22,1,.36,1); }
.acc-body-leave-active { transition:all .22s ease; }
.acc-body-enter-from,.acc-body-leave-to { opacity:0; transform:translateY(-6px); }
.acc__text--desc { font-size:.9rem; color:#2e2418; line-height:1.85; white-space:pre-line; margin:0; max-height:260px; overflow-y:auto; }
.acc__meta-grid { display:flex; flex-direction:column; gap:.5rem; }
.acc__meta-row  { display:flex; align-items:baseline; gap:.75rem; font-size:.88rem; }
.acc__meta-k    { flex:0 0 auto; font-size:.74rem; font-weight:700; color:#b8b0a4; text-transform:uppercase; letter-spacing:.04em; display:inline-flex; align-items:center; gap:.25rem; min-width:90px; }
.acc__meta-v    { color:#2e2418; font-weight:600; line-height:1.4; }

/* Source URLs inside accordion */
.src-url-list { display:flex; flex-direction:column; gap:.3rem; }
.src-url-row  { display:flex; align-items:flex-start; gap:.5rem; padding:.25rem 0; border-top:1px dashed #ede8e0; }
.src-url-row:first-child { border-top:none; }
.src-url-label { font-size:.63rem; font-weight:900; letter-spacing:.05em; flex-shrink:0; padding:.15rem .42rem; border-radius:5px; margin-top:.1rem; }
.src-url-label--direct { background:rgba(22,180,90,.12); color:#186040; border:1px solid rgba(22,180,90,.22); }
.src-url-label--embed  { background:rgba(80,120,255,.1);  color:#2848b0; border:1px solid rgba(80,120,255,.22); }
.src-url-label--ext    { background:rgba(200,140,0,.1);   color:#7a5200; border:1px solid rgba(200,140,0,.2);  }
.src-url-link { font-size:.76rem; color:#8c1515; word-break:break-all; text-decoration:none; font-weight:500; }
.src-url-link:hover { text-decoration:underline; }

.acc__chips { display:flex; flex-wrap:wrap; gap:.42rem; }
.acc__chip  { display:inline-flex; padding:.32rem .78rem; border-radius:8px; font-size:.82rem; font-weight:600; cursor:default; transition:transform .15s; }
.acc__chip:hover { transform:translateY(-2px); }
.acc__chip--tag { background:rgba(200,168,0,.11); color:#7a6200; border:1px solid rgba(200,168,0,.22); }
.acc__chip--kw  { background:rgba(40,90,220,.08); color:#2848b0; border:1px solid rgba(40,90,220,.15); }
.acc--system { background:#faf7f2; }
.acc__sys-grid { display:grid; grid-template-columns:1fr 1fr; padding:0 1.3rem .75rem; gap:0; }
.acc__sys-cell { padding:.72rem .65rem .72rem 0; border-bottom:1px solid #ede8e0; border-left:1px solid #ede8e0; }
.acc__sys-cell:nth-child(odd) { border-left:none; padding-right:.65rem; }
.acc__sys-cell--full { grid-column:1/-1; border-left:none; }
.acc__sys-cell:last-child,.acc__sys-cell:nth-last-child(2):not(.acc__sys-cell--full) { border-bottom:none; }
.acc__sys-k { font-size:.68rem; font-weight:700; color:#c0b8ac; letter-spacing:.05em; margin-bottom:.25rem; text-transform:uppercase; }
.acc__sys-v { font-size:.84rem; color:#2e2418; font-weight:600; line-height:1.4; }
.acc__sys-v--mono { font-family:'Courier New',monospace; font-size:.78rem; }
.acc__sys-v--link { color:#8c1515; font-size:.73rem; word-break:break-all; text-decoration:none; display:block; }
.acc__sys-v--link:hover { text-decoration:underline; }

.pdm-fade-enter-active,.pdm-fade-leave-active { transition:opacity .3s ease; }
.pdm-fade-enter-from,.pdm-fade-leave-to { opacity:0; }
.pdm-rise-enter-active { transition:opacity .38s ease,transform .38s cubic-bezier(.22,1,.36,1); }
.pdm-rise-leave-active { transition:opacity .22s ease,transform .22s ease; }
.pdm-rise-enter-from   { opacity:0; transform:scale(.94) translateY(20px); }
.pdm-rise-leave-to     { opacity:0; transform:scale(.97) translateY(10px); }
</style>