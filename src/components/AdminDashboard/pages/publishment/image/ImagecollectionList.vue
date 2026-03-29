<template>
  <div class="icl" dir="rtl">

    <!-- ── HEADER ── -->
    <div class="icl__head">
      <div>
        <h1 class="icl__title">کۆکراوەی وێنەکان</h1>
        <p class="icl__sub">بینین، گەڕان و بەڕێوەبردنی هەموو کۆکراوەکان</p>
      </div>
      <RouterLink class="btn btn--primary" to="/admin/image-collections/new">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        کۆکراوەی نوێ
      </RouterLink>
    </div>

    <!-- ── SEARCH + FILTERS ── -->
    <div class="icl__bar">
      <div class="search">
        <svg class="search__ico" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
        <input v-model="searchQ" class="search__input" placeholder="گەڕان بە ناونیشان، تاگ، کۆکەر…" />
        <Transition name="fade">
          <button v-if="searchQ" class="search__clear" @click="searchQ = ''">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </Transition>
      </div>
      <select v-model="filterLang" class="sel">
        <option value="">هەموو زمانەکان</option>
        <option value="CKB">سۆرانی</option>
        <option value="KMR">کورمانجی</option>
      </select>
      <select v-model="filterType" class="sel">
        <option value="">هەموو جۆرەکان</option>
        <option value="SINGLE">تەنها وێنە</option>
        <option value="GALLERY">گەلەری</option>
        <option value="PHOTO_STORY">چیرۆکی وێنە</option>
      </select>
      <select v-model="filterTopic" class="sel">
        <option value="">هەموو موضوعەکان</option>
        <option v-for="t in availableTopics" :key="t.id" :value="t.id">{{ t.nameCkb || t.nameKmr }}</option>
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
      <div class="skel" v-for="i in 6" :key="i" :style="{ animationDelay: `${i * 0.07}s` }"></div>
    </div>

    <!-- ── ERROR ── -->
    <div v-else-if="error" class="state-box state-box--error">
      <div class="state-box__ico"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg></div>
      <p>{{ error }}</p>
      <button class="btn btn--ghost btn--sm" @click="load">دووبارەتەکەیەوە</button>
    </div>

    <!-- ── EMPTY ── -->
    <div v-else-if="!filteredItems.length" class="state-box">
      <div class="state-box__ico"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg></div>
      <p>هیچ کۆکراوەیەک نەدۆزرایەوە</p>
      <RouterLink class="btn btn--primary btn--sm" to="/admin/image-collections/new">یەکەمین کۆکراوەت زیاد بکە</RouterLink>
    </div>

    <!-- ── TABLE ── -->
    <div v-else class="table-wrap">
      <div class="table-meta">کۆی {{ filteredItems.length }} کۆکراوە<span v-if="searchQ"> — ئەنجامی گەڕان بۆ «{{ searchQ }}»</span></div>
      <table class="tbl">
        <thead>
          <tr>
            <th style="width:52px">#</th>
            <th style="width:66px">کڤەر</th>
            <th>ناونیشانی سۆرانی</th>
            <th>ناونیشانی کورمانجی</th>
            <th style="width:130px">جۆر</th>
            <th style="width:120px">موضوع</th>
            <th style="width:112px">بەروار</th>
            <!-- NEW: LOCATION -->
            <th style="width:100px">شوێن</th>
            <!-- NEW: COLLECTED BY -->
            <th style="width:100px">کۆکەر</th>
            <th style="width:88px">زمان</th>
            <th style="width:72px">وێنە</th>
            <th style="width:116px">کردار</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(c, idx) in filteredItems" :key="c.id" class="tbl__row" @click="openDetail(c)">
            <td><span class="tbl__id">{{ idx + 1 }}</span></td>
            <td>
              <!-- FIXED: Using correct DTO field names -->
              <div class="cover-wrap" v-if="c.ckbCoverUrl || c.kmrCoverUrl || c.hoverCoverUrl">
                <img class="cover-img cover-img--base"  :src="c.ckbCoverUrl || c.kmrCoverUrl" loading="lazy" />
                <img class="cover-img cover-img--hover" :src="c.hoverCoverUrl || c.ckbCoverUrl" loading="lazy" v-if="c.hoverCoverUrl" />
                <div class="cover-hover-badge" v-if="c.hoverCoverUrl" title="هۆڤەر">H</div>
              </div>
              <div class="cover-empty" v-else>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
              </div>
            </td>
            <td><div class="tbl__name">{{ c.ckbContent?.title || '—' }}</div></td>
            <td><div class="tbl__name tbl__name--kmr">{{ c.kmrContent?.title || '—' }}</div></td>
            <td>
              <span class="type-pill" :class="`type-pill--${(c.collectionType||'').toLowerCase()}`">
                {{ typeLabel(c.collectionType) }}
              </span>
            </td>
            <td>
              <span v-if="c.topic" class="topic-pill">{{ c.topic.nameCkb || c.topic.nameKmr }}</span>
              <span v-else class="tbl__dash">—</span>
            </td>
            <td class="tbl__date">{{ fmtDate(c.publishmentDate) }}</td>
            
            <!-- NEW CELLS -->
            <td>
              <div class="tbl__meta" :title="c.ckbContent?.location || c.kmrContent?.location">
                {{ c.ckbContent?.location || c.kmrContent?.location || '—' }}
              </div>
            </td>
            <td>
              <div class="tbl__meta" :title="c.ckbContent?.collectedBy || c.kmrContent?.collectedBy">
                {{ c.ckbContent?.collectedBy || c.kmrContent?.collectedBy || '—' }}
              </div>
            </td>
            
            <td>
              <div class="lang-row">
                <span v-for="l in (c.contentLanguages||[])" :key="l" class="lang-dot" :class="`lang-dot--${l.toLowerCase()}`">{{ l }}</span>
              </div>
            </td>
            <td>
              <span class="img-pill" v-if="c.imageAlbum?.length">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                {{ c.imageAlbum.length }}
              </span>
              <span v-else class="tbl__dash">—</span>
            </td>
            <td @click.stop>
              <div class="tbl__acts">
                <button class="act act--view" title="تەواوی زانیاری" @click="openDetail(c)">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                </button>
                <RouterLink class="act act--edit" :to="`/admin/image-collections/${c.id}/edit`">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4z"/></svg>
                </RouterLink>
                <button class="act act--del" @click="confirmDelete(c)">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- ══ DELETE MODAL ══ -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="delTarget" class="overlay" @click.self="delTarget=null">
          <div class="del-modal">
            <div class="del-modal__ico">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#8C1515" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
            </div>
            <h3 class="del-modal__title">دڵنیای لە سڕینەوە؟</h3>
            <p class="del-modal__body">کۆکراوەی <strong>«{{ bestTitle(delTarget) || '#'+delTarget.id }}»</strong><br/>بە تەواوی سڕاوەتەوە و ناگەڕێتەوە.</p>
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

    <!-- ══════════════════════════════════════════════════════════════════════ -->
    <!--  DETAIL MODAL - UPDATED WITH MISSING FIELDS                          -->
    <!-- ══════════════════════════════════════════════════════════════════════ -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="detailItem" class="dk-bg" @click.self="detailItem = null">
          <div class="dk">
            <button class="dk__close" @click="detailItem = null">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>

            <!-- ── Hero ── -->
            <div
              class="dk__hero"
              :style="(detailItem.ckbCoverUrl || detailItem.kmrCoverUrl)
                ? `background-image:url(${detailItem.ckbCoverUrl || detailItem.kmrCoverUrl})`
                : ''"
            >
              <div v-if="detailItem.hoverCoverUrl" class="dk__hero-hover" :style="`background-image:url(${detailItem.hoverCoverUrl})`" />
              <div class="dk__hero-grain"></div>
              <div class="dk__hero-gradient"></div>

              <div class="dk__hero-content">
                <div class="dk__hero-badges">
                  <span class="dk__badge dk__badge--type">{{ typeLabel(detailItem.collectionType) }}</span>
                  <span v-if="detailItem.topic" class="dk__badge dk__badge--topic">
                    {{ detailItem.topic.nameCkb || detailItem.topic.nameKmr }}
                  </span>
                  <span v-if="detailItem.hoverCoverUrl" class="dk__badge dk__badge--hover">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/></svg>
                    Hover
                  </span>
                  <span v-for="lang in detectedLangs(detailItem)" :key="lang" class="dk__badge dk__badge--lang">
                    {{ lang === 'CKB' ? '🇮🇶 سۆرانی' : '🌍 کورمانجی' }}
                  </span>
                </div>

                <h2 class="dk__hero-title">{{ detailItem.ckbContent?.title || detailItem.kmrContent?.title || '—' }}</h2>
                <p v-if="detailItem.ckbContent?.title && detailItem.kmrContent?.title" class="dk__hero-subtitle">{{ detailItem.kmrContent.title }}</p>

                <div class="dk__hero-stats">
                  <div class="dk__stat">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/></svg>
                    {{ detailItem.imageAlbum?.length || 0 }} وێنە
                  </div>
                  <div class="dk__stat" v-if="detailItem.publishmentDate">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    {{ fmtDate(detailItem.publishmentDate) }}
                  </div>
                  <div class="dk__stat" v-if="detailItem.ckbContent?.collectedBy || detailItem.kmrContent?.collectedBy">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
                    {{ detailItem.ckbContent?.collectedBy || detailItem.kmrContent?.collectedBy }}
                  </div>
                  <div class="dk__stat" v-if="detailItem.ckbContent?.location || detailItem.kmrContent?.location">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    {{ detailItem.ckbContent?.location || detailItem.kmrContent?.location }}
                  </div>
                </div>
              </div>
            </div>

            <div class="dk__body">

              <!-- ── 3 Cover Slots ── -->
              <div class="dk__section">
                <div class="dk__sec-head">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                  وێنەی کڤەر
                </div>
                <div class="dk__covers-grid">
                  <!-- CKB -->
                  <div class="dk__cover-item" :class="{ 'dk__cover-item--empty': !detailItem.ckbCoverUrl }">
                    <span class="dk__cover-label dk__cover-label--ckb">سۆرانی (CKB)</span>
                    <div class="dk__cover-img-wrap" :class="{ 'dk__cover-img-wrap--empty': !detailItem.ckbCoverUrl }">
                      <img v-if="detailItem.ckbCoverUrl" :src="detailItem.ckbCoverUrl" alt="CKB Cover" />
                      <template v-else>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                        <span>نییە</span>
                      </template>
                    </div>
                  </div>
                  <!-- KMR -->
                  <div class="dk__cover-item" :class="{ 'dk__cover-item--empty': !detailItem.kmrCoverUrl }">
                    <span class="dk__cover-label dk__cover-label--kmr">کورمانجی (KMR)</span>
                    <div class="dk__cover-img-wrap" :class="{ 'dk__cover-img-wrap--empty': !detailItem.kmrCoverUrl }">
                      <img v-if="detailItem.kmrCoverUrl" :src="detailItem.kmrCoverUrl" alt="KMR Cover" />
                      <template v-else>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                        <span>نییە</span>
                      </template>
                    </div>
                  </div>
                  <!-- Hover -->
                  <div class="dk__cover-item" :class="{ 'dk__cover-item--empty': !detailItem.hoverCoverUrl }">
                    <span class="dk__cover-label dk__cover-label--hover">هۆڤەر</span>
                    <div class="dk__cover-img-wrap" :class="{ 'dk__cover-img-wrap--empty': !detailItem.hoverCoverUrl, 'dk__cover-img-wrap--hover': !!detailItem.hoverCoverUrl }">
                      <img v-if="detailItem.hoverCoverUrl" :src="detailItem.hoverCoverUrl" alt="Hover Image" />
                      <template v-else>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                        <span>نییە</span>
                      </template>
                    </div>
                  </div>
                </div>
              </div>

              <!-- ── Bilingual Content ── -->
              <div class="dk__section" v-if="detailItem.ckbContent || detailItem.kmrContent">
                <div class="dk__sec-head">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                  ناوەڕۆک و زانیاری
                  <span class="dk__sec-count" v-if="[detailItem.ckbContent, detailItem.kmrContent].filter(Boolean).length">
                    {{ [detailItem.ckbContent, detailItem.kmrContent].filter(Boolean).length }} زمان
                  </span>
                </div>

                <div class="dk__content-grid" :class="{ 'dk__content-grid--single': !(detailItem.ckbContent && detailItem.kmrContent) }">

                  <!-- ── CKB Content Column ── -->
                  <div class="dk__content-col" v-if="detailItem.ckbContent">
                    <div class="dk__lang-tag dk__lang-tag--ckb">🟡 سۆرانی (CKB)</div>
                    <div class="dk__content-title" v-if="detailItem.ckbContent.title">{{ detailItem.ckbContent.title }}</div>
                    <p v-if="detailItem.ckbContent.description" class="dk__desc">{{ detailItem.ckbContent.description }}</p>
                    <div class="dk__meta-rows">
                      <div class="dk__meta-row" v-if="detailItem.ckbContent.location">
                        <span class="dk__meta-k">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                          شوێن
                        </span>
                        <span class="dk__meta-v">{{ detailItem.ckbContent.location }}</span>
                      </div>
                      <div class="dk__meta-row" v-if="detailItem.ckbContent.collectedBy">
                        <span class="dk__meta-k">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                          کۆکەر
                        </span>
                        <span class="dk__meta-v">{{ detailItem.ckbContent.collectedBy }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- ── KMR Content Column ── -->
                  <div class="dk__content-col" v-if="detailItem.kmrContent">
                    <div class="dk__lang-tag dk__lang-tag--kmr">🔵 Kurmancî (KMR)</div>
                    <div class="dk__content-title" v-if="detailItem.kmrContent.title">{{ detailItem.kmrContent.title }}</div>
                    <p v-if="detailItem.kmrContent.description" class="dk__desc">{{ detailItem.kmrContent.description }}</p>
                    <div class="dk__meta-rows">
                      <div class="dk__meta-row" v-if="detailItem.kmrContent.location">
                        <span class="dk__meta-k">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                          Cih
                        </span>
                        <span class="dk__meta-v">{{ detailItem.kmrContent.location }}</span>
                      </div>
                      <div class="dk__meta-row" v-if="detailItem.kmrContent.collectedBy">
                        <span class="dk__meta-k">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                          Berhevkar
                        </span>
                        <span class="dk__meta-v">{{ detailItem.kmrContent.collectedBy }}</span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              <!-- ── Image Album WITH METADATA ── -->
              <div class="dk__section" v-if="detailItem.imageAlbum?.length">
                <div class="dk__sec-head">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="9" height="9" rx="1"/><rect x="13" y="2" width="9" height="9" rx="1"/><rect x="2" y="13" width="9" height="9" rx="1"/><rect x="13" y="13" width="9" height="9" rx="1"/></svg>
                  وێنەکانی ئەلبووم
                  <span class="dk__sec-count">{{ detailItem.imageAlbum.length }}</span>
                </div>
                <div class="dk__album-grid">
                  <div v-for="(img, i) in detailItem.imageAlbum" :key="img.id || i" class="dk__album-item">
                    <div class="dk__album-num">{{ i + 1 }}</div>
                    
                    <!-- Image -->
                    <div class="dk__album-img-wrap">
                      <img v-if="img.imageUrl || img.externalUrl" :src="img.imageUrl || img.externalUrl" loading="lazy" @error="e => e.target.style.display='none'" />
                      <div v-else class="dk__album-img-empty">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
                      </div>
                    </div>

                    <!-- Info -->
                    <div class="dk__album-meta">
                      <!-- NEW: Metadata Chips (The missing fields!) -->
                      <div v-if="img.widthPx || img.heightPx || img.fileSizeBytes" class="dk__album-tech">
                        <span v-if="img.widthPx && img.heightPx" class="dk__tech-chip dk__tech-chip--dim">
                          {{ img.widthPx }}×{{ img.heightPx }}
                          <small v-if="img.aspectRatio">({{ img.aspectRatio.toFixed(2) }})</small>
                        </span>
                        <span v-if="img.humanReadableSize" class="dk__tech-chip dk__tech-chip--size">
                          {{ img.humanReadableSize }}
                        </span>
                        <span v-if="img.mimeType" class="dk__tech-chip dk__tech-chip--mime">
                          {{ img.mimeType.replace('image/', '') }}
                        </span>
                      </div>

                      <!-- URLs Indicator -->
                      <div class="dk__album-source" v-if="img.externalUrl || img.embedUrl">
                        <span v-if="img.externalUrl" class="dk__source-badge dk__source-badge--ext">دەرەکی</span>
                        <span v-if="img.embedUrl" class="dk__source-badge dk__source-badge--embed">Embed</span>
                      </div>

                      <div v-if="img.captionCkb || img.captionKmr" class="dk__album-captions">
                        <div v-if="img.captionCkb" class="dk__album-cap-row">
                          <span class="dk__album-lang-dot dk__album-lang-dot--ckb">CKB</span>
                          <span class="dk__album-caption">{{ img.captionCkb }}</span>
                        </div>
                        <div v-if="img.captionKmr" class="dk__album-cap-row">
                          <span class="dk__album-lang-dot dk__album-lang-dot--kmr">KMR</span>
                          <span class="dk__album-caption">{{ img.captionKmr }}</span>
                        </div>
                      </div>
                      <div v-if="img.descriptionCkb || img.descriptionKmr" class="dk__album-descs">
                        <div v-if="img.descriptionCkb" class="dk__album-desc-row">
                          <span class="dk__album-lang-dot dk__album-lang-dot--ckb">CKB</span>
                          <span class="dk__album-desc">{{ img.descriptionCkb }}</span>
                        </div>
                        <div v-if="img.descriptionKmr" class="dk__album-desc-row">
                          <span class="dk__album-lang-dot dk__album-lang-dot--kmr">KMR</span>
                          <span class="dk__album-desc">{{ img.descriptionKmr }}</span>
                        </div>
                      </div>
                      <div class="dk__album-links">
                        <a v-if="img.externalUrl" :href="img.externalUrl" target="_blank" class="dk__ext-link">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                          لینکی دەرەکی
                        </a>
                        <a v-if="img.embedUrl" :href="img.embedUrl" target="_blank" class="dk__ext-link dk__ext-link--embed">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
                          Embed
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- ── Topic Card ── -->
              <div class="dk__section" v-if="detailItem.topic">
                <div class="dk__sec-head">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
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

              <!-- ── Tags & Keywords ── -->
              <div class="dk__section" v-if="hasTags(detailItem)">
                <div class="dk__sec-head">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/></svg>
                  تاگ و کلیلەوشەکان
                </div>
                <div class="dk__tags-grid">
                  <div v-if="detailItem.tags?.ckb?.length" class="dk__tag-group">
                    <span class="dk__tag-label">تاگ (سۆرانی)</span>
                    <div class="dk__tag-list">
                      <span v-for="t in detailItem.tags.ckb" :key="'tc'+t" class="dk__chip dk__chip--ckb">{{ t }}</span>
                    </div>
                  </div>
                  <div v-if="detailItem.tags?.kmr?.length" class="dk__tag-group">
                    <span class="dk__tag-label">تاگ (کورمانجی)</span>
                    <div class="dk__tag-list">
                      <span v-for="t in detailItem.tags.kmr" :key="'tk'+t" class="dk__chip dk__chip--kmr">{{ t }}</span>
                    </div>
                  </div>
                  <div v-if="detailItem.keywords?.ckb?.length" class="dk__tag-group">
                    <span class="dk__tag-label">کلیلەوشە (سۆرانی)</span>
                    <div class="dk__tag-list">
                      <span v-for="k in detailItem.keywords.ckb" :key="'kc'+k" class="dk__chip dk__chip--kw">{{ k }}</span>
                    </div>
                  </div>
                  <div v-if="detailItem.keywords?.kmr?.length" class="dk__tag-group">
                    <span class="dk__tag-label">کلیلەوشە (کورمانجی)</span>
                    <div class="dk__tag-list">
                      <span v-for="k in detailItem.keywords.kmr" :key="'kk'+k" class="dk__chip dk__chip--kw">{{ k }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- ── Language Cards ── -->
              <div class="dk__section" v-if="detectedLangs(detailItem).length">
                <div class="dk__sec-head">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>
                  زمانی ناوەڕۆک
                </div>
                <div class="dk__lang-cards">
                  <div v-for="lang in detectedLangs(detailItem)" :key="lang"
                    class="dk__lang-card" :class="lang === 'CKB' ? 'dk__lang-card--ckb' : 'dk__lang-card--kmr'">
                    <span class="dk__lang-card-flag">{{ lang === 'CKB' ? '🇮🇶' : '🌍' }}</span>
                    <div class="dk__lang-card-info">
                      <span class="dk__lang-card-code">{{ lang }}</span>
                      <span class="dk__lang-card-name">{{ lang === 'CKB' ? 'کوردی سۆرانی' : 'Kurdî Kurmancî' }}</span>
                    </div>
                    <svg class="dk__lang-card-check" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                </div>
              </div>

              <!-- ── General Info Grid ── -->
              <div class="dk__section">
                <div class="dk__sec-head">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                  زانیاری گشتی
                </div>
                <div class="dk__info-grid">
                  <div class="dk__info-item">
                    <span class="dk__info-icon">🆔</span>
                    <div class="dk__info-data"><span class="dk__info-label">ناسنامە</span><span class="dk__info-value">#{{ detailItem.id }}</span></div>
                  </div>
                  <div class="dk__info-item">
                    <span class="dk__info-icon">🗂️</span>
                    <div class="dk__info-data"><span class="dk__info-label">جۆری کۆکراوە</span><span class="dk__info-value">{{ typeLabel(detailItem.collectionType) }}</span></div>
                  </div>
                  <div class="dk__info-item">
                    <span class="dk__info-icon">🖼</span>
                    <div class="dk__info-data"><span class="dk__info-label">کڤەری CKB</span><span class="dk__info-value" :class="detailItem.ckbCoverUrl ? 'dk__info-value--yes' : ''">{{ detailItem.ckbCoverUrl ? '✓ هەیە' : '— نییە' }}</span></div>
                  </div>
                  <div class="dk__info-item">
                    <span class="dk__info-icon">🖼</span>
                    <div class="dk__info-data"><span class="dk__info-label">کڤەری KMR</span><span class="dk__info-value" :class="detailItem.kmrCoverUrl ? 'dk__info-value--yes' : ''">{{ detailItem.kmrCoverUrl ? '✓ هەیە' : '— نییە' }}</span></div>
                  </div>
                  <div class="dk__info-item">
                    <span class="dk__info-icon">🎨</span>
                    <div class="dk__info-data"><span class="dk__info-label">Hover Image</span><span class="dk__info-value" :class="detailItem.hoverCoverUrl ? 'dk__info-value--yes' : ''">{{ detailItem.hoverCoverUrl ? '✓ هەیە' : '— نییە' }}</span></div>
                  </div>
                  <div class="dk__info-item">
                    <span class="dk__info-icon">📸</span>
                    <div class="dk__info-data"><span class="dk__info-label">ژمارەی وێنەکان</span><span class="dk__info-value">{{ detailItem.imageAlbum?.length || 0 }}</span></div>
                  </div>
                  <div class="dk__info-item">
                    <span class="dk__info-icon">🏷</span>
                    <div class="dk__info-data"><span class="dk__info-label">موضوع</span><span class="dk__info-value" :class="detailItem.topic ? 'dk__info-value--yes' : ''">{{ detailItem.topic ? (detailItem.topic.nameCkb || detailItem.topic.nameKmr) : '— نییە' }}</span></div>
                  </div>
                  <div class="dk__info-item">
                    <span class="dk__info-icon">📅</span>
                    <div class="dk__info-data"><span class="dk__info-label">بەرواری بڵاوکردنەوە</span><span class="dk__info-value">{{ detailItem.publishmentDate ? fmtDate(detailItem.publishmentDate) : '—' }}</span></div>
                  </div>
                  <div class="dk__info-item">
                    <span class="dk__info-icon">📅</span>
                    <div class="dk__info-data"><span class="dk__info-label">دروستکراوە</span><span class="dk__info-value">{{ fmtDateFull(detailItem.createdAt) }}</span></div>
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
              <RouterLink :to="`/admin/image-collections/${detailItem.id}/edit`" class="btn btn--primary btn--sm">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4z"/></svg>
                دەستکاریکردن
              </RouterLink>
              <button class="btn btn--ghost btn--sm" @click="detailItem = null">داخستن</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import api from '@/api.js'

const items        = ref([])
const loading      = ref(false)
const error        = ref('')
const searchQ      = ref('')
const filterLang   = ref('')
const filterType   = ref('')
const filterTopic  = ref('')
const delTarget    = ref(null)
const deleting     = ref(false)
const detailItem   = ref(null)
const toast        = ref({ show: false, type: 'success', msg: '' })
let   toastTimer   = null

// ── Normalize raw backend record ──────────────────────────────────────────────
const normalize = (d = {}) => {
  const out = { ...d }

  // CRITICAL FIX: Map DTO field names correctly (hoverCoverUrl, not hoverUrl)
  out.ckbCoverUrl = d.ckbCoverUrl || ''
  out.kmrCoverUrl = d.kmrCoverUrl || ''
  out.hoverCoverUrl = d.hoverCoverUrl || ''  // Correct DTO field name

  out.topic = d.topicId
    ? { id: d.topicId, nameCkb: d.topicNameCkb || '', nameKmr: d.topicNameKmr || '' }
    : null

  out.contentLanguages = Array.isArray(d.contentLanguages) ? [...d.contentLanguages] : []

  out.tags     = { ckb: [...(d.tags?.ckb     || [])], kmr: [...(d.tags?.kmr     || [])] }
  out.keywords = { ckb: [...(d.keywords?.ckb || [])], kmr: [...(d.keywords?.kmr || [])] }

  // NEW: Normalize album items with metadata
  out.imageAlbum = Array.isArray(d.imageAlbum)
    ? d.imageAlbum.map(img => ({
        ...img,
        // Ensure metadata fields exist
        widthPx: img.widthPx || null,
        heightPx: img.heightPx || null,
        fileSizeBytes: img.fileSizeBytes || null,
        mimeType: img.mimeType || null,
        aspectRatio: img.aspectRatio || (img.widthPx && img.heightPx ? img.widthPx / img.heightPx : null),
        humanReadableSize: img.humanReadableSize || formatBytes(img.fileSizeBytes)
      })).sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    : []

  return out
}

// Helper for formatting bytes if backend doesn't send human readable
function formatBytes(bytes) {
  if (!bytes) return null
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB'
}

// ── Topics for filter dropdown ────────────────────────────────────────────────
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

// ── Filtered list ─────────────────────────────────────────────────────────────
const filteredItems = computed(() => {
  let list = items.value

  if (searchQ.value.trim()) {
    const q = searchQ.value.trim().toLowerCase()
    list = list.filter(c =>
      (c.ckbContent?.title        || '').toLowerCase().includes(q) ||
      (c.kmrContent?.title        || '').toLowerCase().includes(q) ||
      (c.ckbContent?.description  || '').toLowerCase().includes(q) ||
      (c.kmrContent?.description  || '').toLowerCase().includes(q) ||
      (c.ckbContent?.collectedBy  || '').toLowerCase().includes(q) ||
      (c.kmrContent?.collectedBy  || '').toLowerCase().includes(q) ||
      (c.ckbContent?.location     || '').toLowerCase().includes(q) ||
      (c.kmrContent?.location     || '').toLowerCase().includes(q) ||
      (c.topic?.nameCkb           || '').toLowerCase().includes(q) ||
      (c.topic?.nameKmr           || '').toLowerCase().includes(q) ||
      [...(c.tags?.ckb || []), ...(c.tags?.kmr || [])].some(t => t.toLowerCase().includes(q)) ||
      [...(c.keywords?.ckb || []), ...(c.keywords?.kmr || [])].some(k => k.toLowerCase().includes(q))
    )
  }

  if (filterLang.value) list = list.filter(c => {
    const langs = c.contentLanguages?.length
      ? c.contentLanguages
      : [c.ckbContent ? 'CKB' : null, c.kmrContent ? 'KMR' : null].filter(Boolean)
    return langs.includes(filterLang.value)
  })
  if (filterType.value)  list = list.filter(c => c.collectionType === filterType.value)
  if (filterTopic.value) list = list.filter(c => c.topic?.id === Number(filterTopic.value))

  return list
})

// ── Data loading ──────────────────────────────────────────────────────────────
const load = async () => {
  loading.value = true
  error.value   = ''
  try {
    const { data } = await api.get('/api/v1/image-collections')
    const payload = data?.data ?? data ?? []
    const arr = Array.isArray(payload) ? payload
              : Array.isArray(payload?.content) ? payload.content : []
    items.value = arr.map(normalize)
  } catch (e) {
    error.value = e?.response?.data?.message || e.message || 'هەڵەیەک ڕوویدا'
  } finally {
    loading.value = false
  }
}

// ── Detail modal ──────────────────────────────────────────────────────────────
const openDetail = (c) => { detailItem.value = normalize(c) }
const onKeydown  = (e) => { if (e.key === 'Escape' && detailItem.value) detailItem.value = null }

// ── Delete ────────────────────────────────────────────────────────────────────
const confirmDelete = (c) => { delTarget.value = c }

const doDelete = async () => {
  if (!delTarget.value) return
  deleting.value = true
  const id = delTarget.value.id
  try {
    await api.delete(`/api/v1/image-collections/${id}`)
    showToast('success', 'کۆکراوەکە بە سەرکەوتنی سڕایەوە')
    if (detailItem.value?.id === id) detailItem.value = null
    delTarget.value = null
    await load()
  } catch (e) {
    showToast('error', e?.response?.data?.message || 'سڕینەوە سەرنەکەوت')
  } finally { deleting.value = false }
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const bestTitle = (c) => c?.ckbContent?.title || c?.kmrContent?.title || ''
const hasTags   = (c) => c?.tags?.ckb?.length || c?.tags?.kmr?.length || c?.keywords?.ckb?.length || c?.keywords?.kmr?.length

const detectedLangs = (c) => {
  if (!c) return []
  if (c.contentLanguages?.length) return c.contentLanguages
  const langs = []
  if (c.ckbContent && (c.ckbContent.title || c.ckbContent.description)) langs.push('CKB')
  if (c.kmrContent && (c.kmrContent.title || c.kmrContent.description)) langs.push('KMR')
  return langs
}

const typeLabel = (t) => ({
  SINGLE: 'تەنها وێنە',
  GALLERY: 'گەلەری',
  PHOTO_STORY: 'چیرۆکی وێنە'
}[t] || t || '—')

const showToast = (type, msg) => {
  clearTimeout(toastTimer)
  toast.value = { show: true, type, msg }
  toastTimer = setTimeout(() => { toast.value.show = false }, 3500)
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

onMounted(() => { load(); window.addEventListener('keydown', onKeydown) })
onBeforeUnmount(() => { clearTimeout(toastTimer); window.removeEventListener('keydown', onKeydown) })
</script>

<style scoped>
/* ─── NEW TABLE COLUMNS STYLES ─── */
.tbl__meta {
  font-size: 0.82rem;
  color: var(--muted);
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ─── ALBUM TECH METADATA (The missing fields display) ─── */
.dk__album-tech {
  display: flex;
  gap: 0.4rem;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
}

.dk__tech-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.2rem 0.5rem;
  border-radius: 5px;
  font-size: 0.75rem;
  font-weight: 700;
  font-family: monospace;
}

.dk__tech-chip--dim {
  background: rgba(30, 64, 175, 0.08);
  color: #1e40af;
  border: 1px solid rgba(30, 64, 175, 0.15);
}

.dk__tech-chip--size {
  background: rgba(140, 21, 21, 0.08);
  color: #8c1515;
  border: 1px solid rgba(140, 21, 21, 0.15);
}

.dk__tech-chip--mime {
  background: rgba(5, 150, 105, 0.08);
  color: #059669;
  border: 1px solid rgba(5, 150, 105, 0.15);
  text-transform: uppercase;
  font-size: 0.7rem;
}

.dk__album-source {
  display: flex;
  gap: 0.35rem;
  margin-bottom: 0.4rem;
}

.dk__source-badge {
  font-size: 0.7rem;
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
  font-weight: 700;
}

.dk__source-badge--ext {
  background: rgba(30, 64, 175, 0.1);
  color: #1e40af;
}

.dk__source-badge--embed {
  background: rgba(124, 58, 237, 0.1);
  color: #7c3aed;
}

/* ─── EXISTING STYLES FROM ORIGINAL (Preserved) ─── */
.icl { direction:rtl; max-width:1400px; margin:0 auto; }
.icl__head { display:flex; align-items:center; justify-content:space-between; margin-bottom:1.5rem; gap:1rem; flex-wrap:wrap; }
.icl__title { font-size:1.55rem; font-weight:700; color:var(--text); }
.icl__sub { color:var(--muted); font-size:.83rem; margin-top:.2rem; }

.btn { display:inline-flex; align-items:center; gap:.45rem; padding:.65rem 1.1rem; border-radius:var(--radius-sm); font-weight:700; font-size:.87rem; cursor:pointer; border:1px solid transparent; transition:var(--transition); text-decoration:none; white-space:nowrap; font-family:inherit; }
.btn--primary { background:var(--crimson); color:#fff; box-shadow:0 6px 20px rgba(140,21,21,.22); }
.btn--primary:hover { background:var(--crimson-lt); transform:translateY(-1px); }
.btn--ghost { background:transparent; border-color:var(--border); color:var(--text); }
.btn--ghost:hover { border-color:var(--crimson); color:var(--crimson); }
.btn--danger { background:#c0392b; color:#fff; border-color:#c0392b; }
.btn--danger:hover { background:#a93226; }
.btn--sm { padding:.45rem .85rem; font-size:.82rem; }
.btn:disabled { opacity:.5; cursor:not-allowed; transform:none!important; }

.icl__bar { display:flex; gap:.75rem; margin-bottom:1.25rem; flex-wrap:wrap; }
.search { flex:1; min-width:200px; position:relative; display:flex; align-items:center; }
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
.toast__ico { font-size:1rem; }

.skeletons { display:flex; flex-direction:column; gap:.55rem; }
.skel { height:58px; border-radius:var(--radius-sm); background:linear-gradient(90deg,var(--cream-dk) 25%,#eae8e4 50%,var(--cream-dk) 75%); background-size:200% 100%; animation:shimmer 1.4s ease infinite; }
@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

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
.tbl__id { font-size:.78rem; color:var(--muted); font-weight:600; }
.tbl__name { font-weight:600; color:var(--text); line-height:1.3; }
.tbl__name--kmr { font-weight:500; color:var(--muted); }
.tbl__date { font-size:.82rem; color:var(--muted); white-space:nowrap; }
.tbl__dash { color:var(--border); }

.cover-wrap { width:50px; height:38px; border-radius:8px; overflow:hidden; border:1px solid var(--border); position:relative; }
.cover-img { width:100%; height:100%; object-fit:cover; display:block; position:absolute; inset:0; transition:opacity .2s, transform .2s; }
.cover-img--base  { opacity:1; transform:scale(1); }
.cover-img--hover { opacity:0; transform:scale(1.05); }
.cover-wrap:hover .cover-img--hover { opacity:1; transform:scale(1); }
.cover-wrap:hover .cover-img--base  { opacity:0; }
.cover-empty { width:50px; height:38px; border-radius:8px; border:1px dashed var(--border); display:flex; align-items:center; justify-content:center; color:var(--border); }
.cover-hover-badge { position:absolute; bottom:2px; left:2px; width:14px; height:14px; border-radius:3px; background:rgba(124,58,237,.85); color:#fff; font-size:.55rem; font-weight:900; display:flex; align-items:center; justify-content:center; z-index:5; pointer-events:none; }

.type-pill { display:inline-flex; align-items:center; gap:.3rem; padding:.22rem .65rem; border-radius:99px; font-size:.73rem; font-weight:700; white-space:nowrap; }
.type-pill--single      { background:rgba(40,90,220,.08); color:#1a47a0; border:1px solid rgba(40,90,220,.18); }
.type-pill--gallery     { background:rgba(140,21,21,.08); color:var(--crimson); border:1px solid rgba(140,21,21,.14); }
.type-pill--photo_story { background:rgba(80,40,140,.08); color:#5028a0; border:1px solid rgba(80,40,140,.16); }

.topic-pill { display:inline-flex; align-items:center; gap:.3rem; padding:.2rem .6rem; border-radius:99px; background:rgba(140,21,21,.07); color:var(--crimson); border:1px solid rgba(140,21,21,.15); font-size:.75rem; font-weight:700; max-width:130px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }

.lang-dot { display:inline-flex; padding:.18rem .5rem; border-radius:6px; font-size:.72rem; font-weight:700; }
.lang-dot--ckb { background:rgba(254,221,0,.2); color:#806e00; border:1px solid rgba(254,221,0,.4); }
.lang-dot--kmr { background:rgba(30,90,200,.1); color:#1a47a0; border:1px solid rgba(30,90,200,.2); }
.lang-row { display:flex; gap:.3rem; flex-wrap:wrap; }
.img-pill { display:inline-flex; align-items:center; gap:.35rem; font-size:.8rem; color:var(--muted); font-weight:600; }

.tbl__acts { display:flex; gap:.35rem; }
.act { width:30px; height:30px; border-radius:8px; border:1px solid var(--border); background:var(--cream); color:var(--muted); cursor:pointer; text-decoration:none; display:inline-flex; align-items:center; justify-content:center; transition:var(--transition); }
.act--view:hover { background:rgba(30,90,200,.08); border-color:rgba(30,90,200,.28); color:#1a47a0; }
.act--edit:hover { background:rgba(30,150,80,.08); border-color:rgba(30,150,80,.28); color:#166044; }
.act--del:hover  { background:rgba(140,21,21,.08); border-color:rgba(140,21,21,.25); color:var(--crimson); }

.overlay { position:fixed; inset:0; z-index:200; background:rgba(20,10,10,.5); display:flex; align-items:center; justify-content:center; padding:1rem; }
.del-modal { background:var(--white); border-radius:var(--radius-lg); padding:2rem; max-width:400px; width:100%; box-shadow:0 30px 80px rgba(0,0,0,.25); text-align:center; }
.del-modal__ico { width:62px; height:62px; border-radius:50%; background:rgba(140,21,21,.07); border:1px solid rgba(140,21,21,.14); display:flex; align-items:center; justify-content:center; margin:0 auto .85rem; }
.del-modal__title { font-size:1.15rem; font-weight:700; margin-bottom:.5rem; }
.del-modal__body { color:var(--muted); font-size:.9rem; line-height:1.7; margin-bottom:1.5rem; }
.del-modal__acts { display:flex; gap:.75rem; justify-content:center; }
.spinner { width:13px; height:13px; border:2px solid rgba(255,255,255,.35); border-top-color:#fff; border-radius:50%; animation:spin .65s linear infinite; display:inline-block; }
@keyframes spin { to { transform:rotate(360deg) } }

/* ── Detail Modal ── */
.dk-bg { position:fixed; inset:0; z-index:1000; background:rgba(10,8,6,.6); backdrop-filter:blur(6px); display:flex; align-items:center; justify-content:center; padding:1rem; }
.dk { background:#FDFCFB; border-radius:20px; width:100%; max-width:820px; max-height:92vh; overflow-y:auto; box-shadow:0 32px 80px rgba(0,0,0,.3),0 0 0 1px rgba(0,0,0,.06); position:relative; animation:dk-enter .35s cubic-bezier(.16,1,.3,1) both; }
@keyframes dk-enter { from{opacity:0;transform:scale(.95) translateY(16px)} to{opacity:1;transform:scale(1) translateY(0)} }

.dk__close { position:absolute; top:12px; left:12px; z-index:20; width:36px; height:36px; border-radius:50%; background:rgba(255,255,255,.92); border:1px solid rgba(0,0,0,.08); backdrop-filter:blur(8px); display:flex; align-items:center; justify-content:center; cursor:pointer; transition:.2s; color:#6E6B66; }
.dk__close:hover { background:#fff; color:#2E2D29; transform:scale(1.08); }

.dk__hero { position:relative; min-height:240px; background:linear-gradient(135deg,#1a0505 0%,#4a1010 40%,#8C1515 100%); background-size:cover; background-position:center; border-radius:20px 20px 0 0; overflow:hidden; }
.dk__hero-hover { position:absolute; inset:0; background-size:cover; background-position:center; opacity:0; transition:opacity .22s ease; pointer-events:none; }
.dk__hero:hover .dk__hero-hover { opacity:1; }
.dk__hero-grain { position:absolute; inset:0; background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E"); pointer-events:none; }
.dk__hero-gradient { position:absolute; inset:0; background:linear-gradient(to top,rgba(0,0,0,.82) 0%,rgba(0,0,0,.3) 40%,transparent 70%); pointer-events:none; }
.dk__hero-content { position:relative; z-index:5; padding:1.5rem 1.5rem 1.3rem; display:flex; flex-direction:column; justify-content:flex-end; min-height:240px; gap:.55rem; }
.dk__hero-badges { display:flex; flex-wrap:wrap; gap:.35rem; }
.dk__badge { display:inline-flex; align-items:center; gap:.25rem; padding:.22rem .6rem; border-radius:99px; font-size:.72rem; font-weight:700; backdrop-filter:blur(8px); }
.dk__badge--type  { background:rgba(255,255,255,.15); color:rgba(255,255,255,.9); border:1px solid rgba(255,255,255,.18); }
.dk__badge--topic { background:rgba(140,21,21,.4); color:#fecdd3; border:1px solid rgba(255,255,255,.15); }
.dk__badge--hover { background:rgba(124,58,237,.35); color:#e9d5ff; border:1px solid rgba(124,58,237,.4); }
.dk__badge--lang  { background:rgba(255,255,255,.12); color:rgba(255,255,255,.85); border:1px solid rgba(255,255,255,.2); font-size:.7rem; }
.dk__hero-title    { color:#fff; font-size:1.45rem; font-weight:900; margin:0; line-height:1.35; letter-spacing:-.01em; }
.dk__hero-subtitle { color:rgba(255,255,255,.6); font-size:.88rem; margin:0; font-weight:600; }
.dk__hero-stats { display:flex; gap:.9rem; margin-top:.25rem; flex-wrap:wrap; }
.dk__stat { display:inline-flex; align-items:center; gap:.3rem; font-size:.76rem; font-weight:700; color:rgba(255,255,255,.7); }

.dk__body { padding:1.4rem 1.5rem; display:flex; flex-direction:column; gap:1.5rem; }
.dk__sec-head { display:flex; align-items:center; gap:.5rem; font-size:.82rem; font-weight:800; color:#8C1515; text-transform:uppercase; letter-spacing:.06em; padding-bottom:.6rem; border-bottom:2px solid rgba(140,21,21,.1); margin-bottom:.85rem; flex-wrap:wrap; }
.dk__sec-count { background:rgba(140,21,21,.08); border:1px solid rgba(140,21,21,.15); border-radius:99px; padding:.1rem .5rem; font-size:.72rem; color:#8C1515; }

.dk__covers-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:.85rem; }
@media (max-width:600px) { .dk__covers-grid { grid-template-columns:1fr 1fr; } }
.dk__cover-item { display:flex; flex-direction:column; gap:.4rem; }
.dk__cover-item--empty { opacity:.45; }
.dk__cover-label { display:inline-flex; padding:.18rem .55rem; border-radius:6px; font-size:.7rem; font-weight:800; align-self:flex-start; }
.dk__cover-label--ckb   { background:rgba(200,168,0,.12); color:#8a7000; border:1px solid rgba(200,168,0,.2); }
.dk__cover-label--kmr   { background:rgba(74,122,240,.1);  color:#2d5ac0; border:1px solid rgba(74,122,240,.18); }
.dk__cover-label--hover { background:rgba(124,58,237,.08); color:#6d28d9; border:1px solid rgba(124,58,237,.18); }
.dk__cover-img-wrap { border-radius:10px; overflow:hidden; border:1px solid #E8E5E0; aspect-ratio:1/1; background:#F0EEEB; display:flex; align-items:center; justify-content:center; }
.dk__cover-img-wrap--hover { border-style:dashed; border-color:rgba(124,58,237,.3); background:rgba(124,58,237,.04); }
.dk__cover-img-wrap--empty { flex-direction:column; gap:.35rem; color:#C0BDB8; font-size:.75rem; font-weight:600; }
.dk__cover-img-wrap img { width:100%; height:100%; object-fit:cover; display:block; }

.dk__content-grid { display:grid; grid-template-columns:1fr 1fr; gap:1rem; }
@media (max-width:600px) { .dk__content-grid { grid-template-columns:1fr; } }
.dk__content-col { padding:1rem; border-radius:12px; background:#fff; border:1px solid #EEECE8; }
.dk__lang-tag { display:inline-flex; padding:.18rem .55rem; border-radius:6px; font-size:.7rem; font-weight:800; margin-bottom:.65rem; }
.dk__lang-tag--ckb { background:rgba(200,168,0,.12); color:#8a7000; border:1px solid rgba(200,168,0,.2); }
.dk__lang-tag--kmr { background:rgba(74,122,240,.1);  color:#2d5ac0; border:1px solid rgba(74,122,240,.18); }
.dk__desc { font-size:.88rem; color:#3E3C38; line-height:1.7; margin:0 0 .65rem; }
.dk__meta-rows { display:flex; flex-direction:column; gap:.4rem; }
.dk__meta-row { display:flex; align-items:baseline; gap:.65rem; font-size:.85rem; }
.dk__meta-k { flex:0 0 auto; font-size:.73rem; font-weight:700; color:#B0ADA7; display:inline-flex; align-items:center; gap:.25rem; min-width:55px; }
.dk__meta-v { color:#2E2D29; font-weight:600; }
.dk__content-title { font-size:1rem; font-weight:800; color:#2E2D29; margin-bottom:.5rem; line-height:1.4; }
.dk__content-grid--single { grid-template-columns:1fr; }

.dk__album-grid { display:flex; flex-direction:column; gap:.65rem; }
.dk__album-item { display:flex; gap:.75rem; padding:.8rem 1rem; background:#fff; border:1px solid #EEECE8; border-radius:12px; transition:.15s; }
.dk__album-item:hover { border-color:rgba(140,21,21,.2); box-shadow:0 2px 12px rgba(140,21,21,.06); }
.dk__album-num { width:28px; height:28px; border-radius:50%; background:linear-gradient(135deg,#8C1515,#a31d1d); color:#fff; font-size:.72rem; font-weight:900; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.dk__album-img-wrap { width:72px; height:60px; border-radius:8px; overflow:hidden; border:1px solid #E8E5E0; background:#F0EEEB; flex-shrink:0; display:flex; align-items:center; justify-content:center; }
.dk__album-img-wrap img { width:100%; height:100%; object-fit:cover; display:block; }
.dk__album-img-empty { display:flex; align-items:center; justify-content:center; width:100%; height:100%; color:#C0BDB8; }
.dk__album-meta { flex:1; min-width:0; display:flex; flex-direction:column; gap:.25rem; }
.dk__album-caption { font-weight:700; font-size:.88rem; color:#2E2D29; }
.dk__album-desc { font-size:.82rem; color:#767571; line-height:1.5; }
.dk__album-links { display:flex; gap:.5rem; flex-wrap:wrap; margin-top:.25rem; }
.dk__ext-link { display:inline-flex; align-items:center; gap:.3rem; font-size:.78rem; font-weight:700; color:#4338ca; text-decoration:none; padding:.28rem .6rem; border-radius:7px; background:rgba(67,56,202,.06); border:1px solid rgba(67,56,202,.12); transition:.15s; }
.dk__ext-link:hover { background:rgba(67,56,202,.12); }
.dk__ext-link--embed { color:#7c3aed; background:rgba(124,58,237,.06); border-color:rgba(124,58,237,.12); }

.dk__topic-card { display:flex; align-items:center; gap:.75rem; padding:.9rem 1rem; border-radius:12px; background:rgba(140,21,21,.04); border:1.5px solid rgba(140,21,21,.12); }
.dk__topic-icon { font-size:1.4rem; }
.dk__topic-info { display:flex; flex-direction:column; gap:.15rem; }
.dk__topic-name { font-weight:800; font-size:.92rem; color:#8C1515; }
.dk__topic-name-alt { font-size:.82rem; color:#767571; font-weight:600; }
.dk__topic-id { font-size:.72rem; color:#B0ADA7; font-weight:600; }

.dk__tags-grid { display:grid; grid-template-columns:1fr 1fr; gap:.85rem; }
@media (max-width:600px) { .dk__tags-grid { grid-template-columns:1fr; } }
.dk__tag-group { display:flex; flex-direction:column; gap:.4rem; }
.dk__tag-label { font-size:.74rem; font-weight:700; color:#9E9A94; }
.dk__tag-list { display:flex; flex-wrap:wrap; gap:.3rem; }
.dk__chip { display:inline-flex; padding:.22rem .6rem; border-radius:8px; font-size:.78rem; font-weight:700; }
.dk__chip--ckb { background:rgba(140,21,21,.07);  color:#8C1515; border:1px solid rgba(140,21,21,.12); }
.dk__chip--kmr { background:rgba(67,56,202,.07);  color:#4338ca; border:1px solid rgba(67,56,202,.12); }
.dk__chip--kw  { background:rgba(15,118,110,.07); color:#0f766e; border:1px solid rgba(15,118,110,.12); }

.dk__lang-cards { display:flex; gap:.75rem; flex-wrap:wrap; }
.dk__lang-card { display:flex; align-items:center; gap:.75rem; padding:.85rem 1.1rem; border-radius:12px; flex:1; min-width:160px; }
.dk__lang-card--ckb { background:rgba(200,168,0,.07); border:1.5px solid rgba(200,168,0,.2); }
.dk__lang-card--kmr { background:rgba(74,122,240,.06); border:1.5px solid rgba(74,122,240,.18); }
.dk__lang-card-flag { font-size:1.4rem; flex-shrink:0; }
.dk__lang-card-info { display:flex; flex-direction:column; gap:.1rem; flex:1; }
.dk__lang-card-code { font-size:.7rem; font-weight:800; letter-spacing:.06em; }
.dk__lang-card--ckb .dk__lang-card-code { color:#8a7000; }
.dk__lang-card--kmr .dk__lang-card-code { color:#2d5ac0; }
.dk__lang-card-name { font-size:.86rem; font-weight:700; color:#2E2D29; }
.dk__lang-card-check { flex-shrink:0; }
.dk__lang-card--ckb .dk__lang-card-check { color:#ca8a04; }
.dk__lang-card--kmr .dk__lang-card-check { color:#3b6fd4; }

.dk__info-grid { display:grid; grid-template-columns:1fr 1fr; gap:0; border:1px solid #EEECE8; border-radius:12px; overflow:hidden; background:#fff; }
@media (max-width:500px) { .dk__info-grid { grid-template-columns:1fr; } }
.dk__info-item { display:flex; align-items:flex-start; gap:.65rem; padding:.75rem 1rem; border-bottom:1px solid #F5F3F0; border-left:1px solid #F5F3F0; }
.dk__info-item:nth-child(odd) { border-left:none; }
.dk__info-item:last-child,.dk__info-item:nth-last-child(2):nth-child(odd) { border-bottom:none; }
.dk__info-icon { font-size:1rem; flex-shrink:0; margin-top:.1rem; }
.dk__info-data { display:flex; flex-direction:column; gap:.1rem; min-width:0; }
.dk__info-label { font-size:.72rem; font-weight:700; color:#9E9A94; text-transform:uppercase; letter-spacing:.04em; }
.dk__info-value { font-size:.86rem; font-weight:700; color:#2E2D29; word-break:break-word; }
.dk__info-value--yes { color:#0f766e; }

.dk__foot { padding:1rem 1.5rem; border-top:1px solid #F0EEEB; display:flex; gap:.6rem; background:#FDFCFB; border-radius:0 0 20px 20px; position:sticky; bottom:0; }

.dk__album-captions,.dk__album-descs { display:flex; flex-direction:column; gap:.18rem; }
.dk__album-captions { margin-bottom:.1rem; }
.dk__album-cap-row,.dk__album-desc-row { display:flex; align-items:baseline; gap:.4rem; }
.dk__album-lang-dot { flex-shrink:0; font-size:.62rem; font-weight:800; padding:.1rem .35rem; border-radius:5px; line-height:1.4; }
.dk__album-lang-dot--ckb { background:rgba(140,21,21,.08); color:#8C1515; border:1px solid rgba(140,21,21,.12); }
.dk__album-lang-dot--kmr { background:rgba(67,56,202,.08); color:#4338ca; border:1px solid rgba(67,56,202,.12); }
.dk__album-cap-row .dk__album-caption { font-weight:700; font-size:.86rem; color:#2E2D29; }
.dk__album-desc-row .dk__album-desc   { font-size:.8rem; color:#767571; line-height:1.5; }

.fade-enter-active,.fade-leave-active { transition:opacity .15s }
.fade-enter-from,.fade-leave-to { opacity:0 }
.slide-down-enter-active,.slide-down-leave-active { transition:.3s ease }
.slide-down-enter-from,.slide-down-leave-to { opacity:0; transform:translateY(-8px) }
.modal-enter-active,.modal-leave-active { transition:.25s ease }
.modal-enter-from,.modal-leave-to { opacity:0 }
.modal-enter-active .del-modal,.modal-leave-active .del-modal { transition:.25s ease }
.modal-enter-from .del-modal,.modal-leave-to .del-modal { transform:scale(.94) translateY(8px) }
.modal-enter-from .dk,.modal-leave-to .dk { transform:scale(.96) translateY(12px) }
</style>