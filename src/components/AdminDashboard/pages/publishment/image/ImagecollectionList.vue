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
            <th style="width:100px">شوێن</th>
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
            <td><div class="tbl__meta" :title="c.ckbContent?.location || c.kmrContent?.location">{{ c.ckbContent?.location || c.kmrContent?.location || '—' }}</div></td>
            <td><div class="tbl__meta" :title="c.ckbContent?.collectedBy || c.kmrContent?.collectedBy">{{ c.ckbContent?.collectedBy || c.kmrContent?.collectedBy || '—' }}</div></td>
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
    <!--  DETAIL MODAL — BEAUTIFUL FULL-FIELD DISPLAY                         -->
    <!-- ══════════════════════════════════════════════════════════════════════ -->
    <Teleport to="body">
      <Transition name="dk-anim">
        <div v-if="detailItem" class="dk-bg" @click.self="detailItem = null">
          <div class="dk">

            <!-- ══ CLOSE ══ -->
            <button class="dk__close" @click="detailItem = null" title="داخستن">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>

            <!-- ══ HERO ══ -->
            <div class="dk__hero" :style="heroStyle(detailItem)">
              <div class="dk__hero-overlay"></div>
              <!-- Hover image shown on hover -->
              <div v-if="detailItem.hoverCoverUrl" class="dk__hero-hover-img" :style="`background-image:url(${detailItem.hoverCoverUrl})`"></div>

              <div class="dk__hero-inner">
                <!-- Top badges row -->
                <div class="dk__hero-top">
                  <span class="dk__pill dk__pill--type">{{ typeIcon(detailItem.collectionType) }} {{ typeLabel(detailItem.collectionType) }}</span>
                  <span v-if="detailItem.topic" class="dk__pill dk__pill--topic">🏷 {{ detailItem.topic.nameCkb || detailItem.topic.nameKmr }}</span>
                  <span v-for="l in detectedLangs(detailItem)" :key="l" class="dk__pill dk__pill--lang">{{ l === 'CKB' ? '🇮🇶 سۆرانی' : '🌍 کورمانجی' }}</span>
                  <span v-if="detailItem.hoverCoverUrl" class="dk__pill dk__pill--hover">✦ Hover</span>
                </div>

                <!-- Title block -->
                <div class="dk__hero-titles">
                  <h2 class="dk__hero-ckb">{{ detailItem.ckbContent?.title || detailItem.kmrContent?.title || '—' }}</h2>
                  <p v-if="detailItem.kmrContent?.title && detailItem.ckbContent?.title" class="dk__hero-kmr">{{ detailItem.kmrContent.title }}</p>
                </div>

                <!-- Quick stats strip -->
                <div class="dk__hero-strip">
                  <div class="dk__strip-item">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                    {{ detailItem.imageAlbum?.length || 0 }} وێنە
                  </div>
                  <div class="dk__strip-item" v-if="detailItem.publishmentDate">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    {{ fmtDate(detailItem.publishmentDate) }}
                  </div>
                  <div class="dk__strip-item" v-if="detailItem.ckbContent?.location || detailItem.kmrContent?.location">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    {{ detailItem.ckbContent?.location || detailItem.kmrContent?.location }}
                  </div>
                  <div class="dk__strip-item" v-if="detailItem.ckbContent?.collectedBy || detailItem.kmrContent?.collectedBy">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
                    {{ detailItem.ckbContent?.collectedBy || detailItem.kmrContent?.collectedBy }}
                  </div>
                  <div class="dk__strip-item">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/></svg>
                    ID: #{{ detailItem.id }}
                  </div>
                </div>
              </div>
            </div>

            <!-- ══ BODY ══ -->
            <div class="dk__body">

              <!-- ── 1. COVER IMAGES ── -->
              <section class="dk__sec">
                <div class="dk__sec-label">
                  <span class="dk__sec-icon">🖼</span>
                  وێنەی کڤەر
                </div>
                <div class="dk__covers">
                  <!-- CKB Cover -->
                  <div class="dk__cover-card" :class="{ 'dk__cover-card--empty': !detailItem.ckbCoverUrl }">
                    <div class="dk__cover-badge dk__cover-badge--ckb">🟡 CKB — سۆرانی</div>
                    <div class="dk__cover-frame">
                      <img v-if="detailItem.ckbCoverUrl" :src="detailItem.ckbCoverUrl" alt="CKB Cover" />
                      <div v-else class="dk__cover-none">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                        <span>نییە</span>
                      </div>
                    </div>
                    <div class="dk__cover-url" v-if="detailItem.ckbCoverUrl">
                      <a :href="detailItem.ckbCoverUrl" target="_blank" class="dk__url-link">{{ shortUrl(detailItem.ckbCoverUrl) }}</a>
                    </div>
                  </div>
                  <!-- KMR Cover -->
                  <div class="dk__cover-card" :class="{ 'dk__cover-card--empty': !detailItem.kmrCoverUrl }">
                    <div class="dk__cover-badge dk__cover-badge--kmr">🔵 KMR — کورمانجی</div>
                    <div class="dk__cover-frame">
                      <img v-if="detailItem.kmrCoverUrl" :src="detailItem.kmrCoverUrl" alt="KMR Cover" />
                      <div v-else class="dk__cover-none">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                        <span>نییە</span>
                      </div>
                    </div>
                    <div class="dk__cover-url" v-if="detailItem.kmrCoverUrl">
                      <a :href="detailItem.kmrCoverUrl" target="_blank" class="dk__url-link">{{ shortUrl(detailItem.kmrCoverUrl) }}</a>
                    </div>
                  </div>
                  <!-- Hover Cover -->
                  <div class="dk__cover-card dk__cover-card--hover-slot" :class="{ 'dk__cover-card--empty': !detailItem.hoverCoverUrl }">
                    <div class="dk__cover-badge dk__cover-badge--hover">✦ Hover Image</div>
                    <div class="dk__cover-frame dk__cover-frame--hover">
                      <img v-if="detailItem.hoverCoverUrl" :src="detailItem.hoverCoverUrl" alt="Hover" />
                      <div v-else class="dk__cover-none">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                        <span>نییە</span>
                      </div>
                    </div>
                    <div class="dk__cover-url" v-if="detailItem.hoverCoverUrl">
                      <a :href="detailItem.hoverCoverUrl" target="_blank" class="dk__url-link">{{ shortUrl(detailItem.hoverCoverUrl) }}</a>
                    </div>
                  </div>
                </div>
              </section>

              <!-- ── 2. BILINGUAL CONTENT (ALL FIELDS) ── -->
              <section class="dk__sec">
                <div class="dk__sec-label">
                  <span class="dk__sec-icon">📝</span>
                  ناوەڕۆکی دووزمانە
                </div>
                <div class="dk__bilingual">

                  <!-- CKB Column -->
                  <div class="dk__lang-col dk__lang-col--ckb" v-if="detailItem.ckbContent || detectedLangs(detailItem).includes('CKB')">
                    <div class="dk__lang-header">
                      <span class="dk__lang-flag">🟡</span>
                      <span class="dk__lang-name">کوردی سۆرانی (CKB)</span>
                    </div>
                    <div class="dk__field-list">
                      <div class="dk__field">
                        <span class="dk__field-key">ناونیشان</span>
                        <span class="dk__field-val" :class="{ 'dk__field-val--empty': !detailItem.ckbContent?.title }">
                          {{ detailItem.ckbContent?.title || '—' }}
                        </span>
                      </div>
                      <div class="dk__field">
                        <span class="dk__field-key">وەسف</span>
                        <span class="dk__field-val dk__field-val--text" :class="{ 'dk__field-val--empty': !detailItem.ckbContent?.description }">
                          {{ detailItem.ckbContent?.description || '—' }}
                        </span>
                      </div>
                      <div class="dk__field">
                        <span class="dk__field-key">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                          شوێن
                        </span>
                        <span class="dk__field-val" :class="{ 'dk__field-val--empty': !detailItem.ckbContent?.location }">
                          {{ detailItem.ckbContent?.location || '—' }}
                        </span>
                      </div>
                      <div class="dk__field">
                        <span class="dk__field-key">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
                          کۆکەر
                        </span>
                        <span class="dk__field-val" :class="{ 'dk__field-val--empty': !detailItem.ckbContent?.collectedBy }">
                          {{ detailItem.ckbContent?.collectedBy || '—' }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <!-- KMR Column -->
                  <div class="dk__lang-col dk__lang-col--kmr" v-if="detailItem.kmrContent || detectedLangs(detailItem).includes('KMR')">
                    <div class="dk__lang-header">
                      <span class="dk__lang-flag">🔵</span>
                      <span class="dk__lang-name">Kurdî Kurmancî (KMR)</span>
                    </div>
                    <div class="dk__field-list">
                      <div class="dk__field">
                        <span class="dk__field-key">Sernav</span>
                        <span class="dk__field-val" :class="{ 'dk__field-val--empty': !detailItem.kmrContent?.title }">
                          {{ detailItem.kmrContent?.title || '—' }}
                        </span>
                      </div>
                      <div class="dk__field">
                        <span class="dk__field-key">Danasîn</span>
                        <span class="dk__field-val dk__field-val--text" :class="{ 'dk__field-val--empty': !detailItem.kmrContent?.description }">
                          {{ detailItem.kmrContent?.description || '—' }}
                        </span>
                      </div>
                      <div class="dk__field">
                        <span class="dk__field-key">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                          Cih
                        </span>
                        <span class="dk__field-val" :class="{ 'dk__field-val--empty': !detailItem.kmrContent?.location }">
                          {{ detailItem.kmrContent?.location || '—' }}
                        </span>
                      </div>
                      <div class="dk__field">
                        <span class="dk__field-key">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
                          Berhevkar
                        </span>
                        <span class="dk__field-val" :class="{ 'dk__field-val--empty': !detailItem.kmrContent?.collectedBy }">
                          {{ detailItem.kmrContent?.collectedBy || '—' }}
                        </span>
                      </div>
                    </div>
                  </div>

                </div>
              </section>

              <!-- ── 3. TAGS & KEYWORDS ── -->
              <section class="dk__sec" v-if="hasTags(detailItem)">
                <div class="dk__sec-label">
                  <span class="dk__sec-icon">🏷</span>
                  تاگ و کلیلەوشەکان
                </div>
                <div class="dk__tags-wrap">
                  <div class="dk__tag-row" v-if="detailItem.tags?.ckb?.length">
                    <span class="dk__tag-label dk__tag-label--ckb">تاگی سۆرانی</span>
                    <div class="dk__tag-chips">
                      <span v-for="t in detailItem.tags.ckb" :key="t" class="dk__chip dk__chip--ckb">{{ t }}</span>
                    </div>
                  </div>
                  <div class="dk__tag-row" v-if="detailItem.tags?.kmr?.length">
                    <span class="dk__tag-label dk__tag-label--kmr">تاگی کورمانجی</span>
                    <div class="dk__tag-chips">
                      <span v-for="t in detailItem.tags.kmr" :key="t" class="dk__chip dk__chip--kmr">{{ t }}</span>
                    </div>
                  </div>
                  <div class="dk__tag-row" v-if="detailItem.keywords?.ckb?.length">
                    <span class="dk__tag-label dk__tag-label--kw">کلیلەوشەی سۆرانی</span>
                    <div class="dk__tag-chips">
                      <span v-for="k in detailItem.keywords.ckb" :key="k" class="dk__chip dk__chip--kw">{{ k }}</span>
                    </div>
                  </div>
                  <div class="dk__tag-row" v-if="detailItem.keywords?.kmr?.length">
                    <span class="dk__tag-label dk__tag-label--kw">کلیلەوشەی کورمانجی</span>
                    <div class="dk__tag-chips">
                      <span v-for="k in detailItem.keywords.kmr" :key="k" class="dk__chip dk__chip--kw">{{ k }}</span>
                    </div>
                  </div>
                </div>
              </section>

              <!-- ── 4. IMAGE ALBUM (FULL METADATA) ── -->
              <section class="dk__sec" v-if="detailItem.imageAlbum?.length">
                <div class="dk__sec-label">
                  <span class="dk__sec-icon">🎞</span>
                  وێنەکانی ئەلبووم
                  <span class="dk__sec-count">{{ detailItem.imageAlbum.length }}</span>
                </div>
                <div class="dk__album">
                  <div v-for="(img, i) in detailItem.imageAlbum" :key="img.id || i" class="dk__album-row">

                    <!-- Thumbnail -->
                    <div class="dk__album-thumb">
                      <span class="dk__album-num">{{ i + 1 }}</span>
                      <div class="dk__album-img">
                        <img v-if="img.imageUrl || img.externalUrl" :src="img.imageUrl || img.externalUrl" loading="lazy" @error="e => e.target.style.display='none'" />
                        <div v-else class="dk__album-noimg">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
                        </div>
                      </div>
                    </div>

                    <!-- All fields -->
                    <div class="dk__album-data">
                      <!-- Tech metadata chips -->
                      <div class="dk__album-tech" v-if="img.widthPx || img.heightPx || img.fileSizeBytes || img.mimeType">
                        <span v-if="img.widthPx && img.heightPx" class="dk__tech dk__tech--dim">
                          📐 {{ img.widthPx }}×{{ img.heightPx }}px
                          <em v-if="img.aspectRatio">({{ img.aspectRatio.toFixed(2) }})</em>
                        </span>
                        <span v-if="img.humanReadableSize || img.fileSizeBytes" class="dk__tech dk__tech--size">
                          📦 {{ img.humanReadableSize || formatBytes(img.fileSizeBytes) }}
                        </span>
                        <span v-if="img.mimeType" class="dk__tech dk__tech--mime">
                          {{ img.mimeType }}
                        </span>
                        <span v-if="img.widthPx && img.heightPx" class="dk__tech dk__tech--orient">
                          {{ img.widthPx > img.heightPx ? '↔ Landscape' : img.heightPx > img.widthPx ? '↕ Portrait' : '⬜ Square' }}
                        </span>
                      </div>

                      <!-- Captions -->
                      <div class="dk__album-caps" v-if="img.captionCkb || img.captionKmr">
                        <div class="dk__album-cap-row" v-if="img.captionCkb">
                          <span class="dk__album-lang--ckb">CKB</span>
                          <strong>{{ img.captionCkb }}</strong>
                        </div>
                        <div class="dk__album-cap-row" v-if="img.captionKmr">
                          <span class="dk__album-lang--kmr">KMR</span>
                          <strong>{{ img.captionKmr }}</strong>
                        </div>
                      </div>

                      <!-- Descriptions -->
                      <div class="dk__album-descs" v-if="img.descriptionCkb || img.descriptionKmr">
                        <div class="dk__album-desc-row" v-if="img.descriptionCkb">
                          <span class="dk__album-lang--ckb">CKB</span>
                          <span class="dk__album-desc-text">{{ img.descriptionCkb }}</span>
                        </div>
                        <div class="dk__album-desc-row" v-if="img.descriptionKmr">
                          <span class="dk__album-lang--kmr">KMR</span>
                          <span class="dk__album-desc-text">{{ img.descriptionKmr }}</span>
                        </div>
                      </div>

                      <!-- URL fields -->
                      <div class="dk__album-urls" v-if="img.imageUrl || img.externalUrl || img.embedUrl">
                        <a v-if="img.imageUrl"    :href="img.imageUrl"    target="_blank" class="dk__album-url dk__album-url--s3">☁ S3 URL</a>
                        <a v-if="img.externalUrl" :href="img.externalUrl" target="_blank" class="dk__album-url dk__album-url--ext">↗ دەرەکی</a>
                        <a v-if="img.embedUrl"    :href="img.embedUrl"    target="_blank" class="dk__album-url dk__album-url--embed">&lt;/&gt; Embed</a>
                      </div>
                    </div>

                  </div>
                </div>
              </section>

              <!-- ── 5. GENERAL INFO GRID (ALL FIELDS) ── -->
              <section class="dk__sec">
                <div class="dk__sec-label">
                  <span class="dk__sec-icon">📋</span>
                  زانیاری گشتی
                </div>
                <div class="dk__info-grid">

                  <div class="dk__info-cell">
                    <span class="dk__info-k">🆔 ناسنامە</span>
                    <span class="dk__info-v">#{{ detailItem.id }}</span>
                  </div>

                  <div class="dk__info-cell">
                    <span class="dk__info-k">🗂 جۆری کۆکراوە</span>
                    <span class="dk__info-v">
                      <span class="type-pill" :class="`type-pill--${(detailItem.collectionType||'').toLowerCase()}`">
                        {{ typeIcon(detailItem.collectionType) }} {{ typeLabel(detailItem.collectionType) }}
                      </span>
                    </span>
                  </div>

                  <div class="dk__info-cell">
                    <span class="dk__info-k">🏷 موضوع / بابەت</span>
                    <span class="dk__info-v">
                      <span v-if="detailItem.topic" class="dk__info-topic">
                        {{ detailItem.topic.nameCkb || '—' }}
                        <em v-if="detailItem.topic.nameKmr">/ {{ detailItem.topic.nameKmr }}</em>
                        <small>(#{{ detailItem.topic.id }})</small>
                      </span>
                      <span v-else class="dk__info-v--empty">— نییە</span>
                    </span>
                  </div>

                  <div class="dk__info-cell">
                    <span class="dk__info-k">📅 بەرواری بڵاوکردنەوە</span>
                    <span class="dk__info-v" :class="{ 'dk__info-v--empty': !detailItem.publishmentDate }">
                      {{ detailItem.publishmentDate ? fmtDate(detailItem.publishmentDate) : '— دیاری نەکراوە' }}
                    </span>
                  </div>

                  <div class="dk__info-cell">
                    <span class="dk__info-k">🌐 زمانی ناوەڕۆک</span>
                    <span class="dk__info-v">
                      <div class="lang-row" style="margin-top:2px">
                        <span v-for="l in detectedLangs(detailItem)" :key="l" class="lang-dot" :class="`lang-dot--${l.toLowerCase()}`">{{ l }}</span>
                      </div>
                    </span>
                  </div>

                  <div class="dk__info-cell">
                    <span class="dk__info-k">📸 ژمارەی وێنەکان</span>
                    <span class="dk__info-v">{{ detailItem.imageAlbum?.length || 0 }} وێنە</span>
                  </div>

                  <div class="dk__info-cell">
                    <span class="dk__info-k">🖼 کڤەری CKB</span>
                    <span class="dk__info-v" :class="detailItem.ckbCoverUrl ? 'dk__info-v--yes' : 'dk__info-v--empty'">
                      {{ detailItem.ckbCoverUrl ? '✓ هەیە' : '— نییە' }}
                    </span>
                  </div>

                  <div class="dk__info-cell">
                    <span class="dk__info-k">🖼 کڤەری KMR</span>
                    <span class="dk__info-v" :class="detailItem.kmrCoverUrl ? 'dk__info-v--yes' : 'dk__info-v--empty'">
                      {{ detailItem.kmrCoverUrl ? '✓ هەیە' : '— نییە' }}
                    </span>
                  </div>

                  <div class="dk__info-cell">
                    <span class="dk__info-k">✦ Hover Image</span>
                    <span class="dk__info-v" :class="detailItem.hoverCoverUrl ? 'dk__info-v--yes' : 'dk__info-v--empty'">
                      {{ detailItem.hoverCoverUrl ? '✓ هەیە' : '— نییە' }}
                    </span>
                  </div>

                  <div class="dk__info-cell">
                    <span class="dk__info-k">🕐 دروستکراوە</span>
                    <span class="dk__info-v">{{ fmtDateFull(detailItem.createdAt) }}</span>
                  </div>

                  <div class="dk__info-cell" v-if="detailItem.updatedAt">
                    <span class="dk__info-k">🔄 دوایین نوێکردنەوە</span>
                    <span class="dk__info-v">{{ fmtDateFull(detailItem.updatedAt) }}</span>
                  </div>

                </div>
              </section>

            </div>

            <!-- ══ STICKY FOOTER ══ -->
            <div class="dk__foot">
              <RouterLink :to="`/admin/image-collections/${detailItem.id}/edit`" class="btn btn--primary btn--sm">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4z"/></svg>
                دەستکاریکردن
              </RouterLink>
              <button class="btn btn--danger btn--sm" @click="() => { confirmDelete(detailItem); detailItem = null }">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></svg>
                سڕینەوە
              </button>
              <button class="btn btn--ghost btn--sm" style="margin-right:auto" @click="detailItem = null">داخستن</button>
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

  out.ckbCoverUrl   = d.ckbCoverUrl   || ''
  out.kmrCoverUrl   = d.kmrCoverUrl   || ''
  out.hoverCoverUrl = d.hoverCoverUrl || ''

  out.topic = d.topicId
    ? { id: d.topicId, nameCkb: d.topicNameCkb || '', nameKmr: d.topicNameKmr || '' }
    : (d.topic || null)

  out.contentLanguages = Array.isArray(d.contentLanguages) ? [...d.contentLanguages] : []
  out.tags     = { ckb: [...(d.tags?.ckb || [])], kmr: [...(d.tags?.kmr || [])] }
  out.keywords = { ckb: [...(d.keywords?.ckb || [])], kmr: [...(d.keywords?.kmr || [])] }

  out.imageAlbum = Array.isArray(d.imageAlbum)
    ? d.imageAlbum.map(img => ({
        ...img,
        aspectRatio: img.aspectRatio || (img.widthPx && img.heightPx ? img.widthPx / img.heightPx : null),
        humanReadableSize: img.humanReadableSize || formatBytes(img.fileSizeBytes),
      })).sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    : []

  return out
}

function formatBytes(bytes) {
  if (!bytes) return null
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB'
}

const availableTopics = computed(() => {
  const seen = new Set()
  return items.value.reduce((acc, item) => {
    if (item.topic && !seen.has(item.topic.id)) {
      seen.add(item.topic.id); acc.push(item.topic)
    }
    return acc
  }, [])
})

const filteredItems = computed(() => {
  let list = items.value
  if (searchQ.value.trim()) {
    const q = searchQ.value.trim().toLowerCase()
    list = list.filter(c =>
      (c.ckbContent?.title       || '').toLowerCase().includes(q) ||
      (c.kmrContent?.title       || '').toLowerCase().includes(q) ||
      (c.ckbContent?.description || '').toLowerCase().includes(q) ||
      (c.kmrContent?.description || '').toLowerCase().includes(q) ||
      (c.ckbContent?.collectedBy || '').toLowerCase().includes(q) ||
      (c.kmrContent?.collectedBy || '').toLowerCase().includes(q) ||
      (c.ckbContent?.location    || '').toLowerCase().includes(q) ||
      (c.kmrContent?.location    || '').toLowerCase().includes(q) ||
      (c.topic?.nameCkb          || '').toLowerCase().includes(q) ||
      (c.topic?.nameKmr          || '').toLowerCase().includes(q) ||
      [...(c.tags?.ckb || []), ...(c.tags?.kmr || [])].some(t => t.toLowerCase().includes(q)) ||
      [...(c.keywords?.ckb || []), ...(c.keywords?.kmr || [])].some(k => k.toLowerCase().includes(q))
    )
  }
  if (filterLang.value) {
    list = list.filter(c => {
      const langs = c.contentLanguages?.length ? c.contentLanguages
        : [c.ckbContent ? 'CKB' : null, c.kmrContent ? 'KMR' : null].filter(Boolean)
      return langs.includes(filterLang.value)
    })
  }
  if (filterType.value)  list = list.filter(c => c.collectionType === filterType.value)
  if (filterTopic.value) list = list.filter(c => c.topic?.id === Number(filterTopic.value))
  return list
})

const load = async () => {
  loading.value = true; error.value = ''
  try {
    const { data } = await api.get('/api/v1/image-collections')
    const payload = data?.data ?? data ?? []
    const arr = Array.isArray(payload) ? payload
      : Array.isArray(payload?.content) ? payload.content : []
    items.value = arr.map(normalize)
  } catch (e) {
    error.value = e?.response?.data?.message || e.message || 'هەڵەیەک ڕوویدا'
  } finally { loading.value = false }
}

const openDetail  = (c) => { detailItem.value = normalize(c) }
const onKeydown   = (e) => { if (e.key === 'Escape' && detailItem.value) detailItem.value = null }
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
const bestTitle   = (c) => c?.ckbContent?.title || c?.kmrContent?.title || ''
const hasTags     = (c) => c?.tags?.ckb?.length || c?.tags?.kmr?.length || c?.keywords?.ckb?.length || c?.keywords?.kmr?.length

const detectedLangs = (c) => {
  if (!c) return []
  if (c.contentLanguages?.length) return c.contentLanguages
  const l = []
  if (c.ckbContent && (c.ckbContent.title || c.ckbContent.description)) l.push('CKB')
  if (c.kmrContent && (c.kmrContent.title || c.kmrContent.description)) l.push('KMR')
  return l
}

const typeLabel = (t) => ({ SINGLE: 'تەنها وێنە', GALLERY: 'گەلەری', PHOTO_STORY: 'چیرۆکی وێنە' }[t] || t || '—')
const typeIcon  = (t) => ({ SINGLE: '🖼', GALLERY: '🗂', PHOTO_STORY: '📖' }[t] || '📁')

const heroStyle = (c) => {
  const url = c.ckbCoverUrl || c.kmrCoverUrl
  return url ? `background-image: url(${url})` : ''
}

const shortUrl = (url) => {
  try { return new URL(url).pathname.split('/').pop() || url.slice(-32) }
  catch { return url.slice(-32) }
}

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
    + ' · ' + dt.toLocaleTimeString('ckb', { hour: '2-digit', minute: '2-digit' })
}

onMounted(() => { load(); window.addEventListener('keydown', onKeydown) })
onBeforeUnmount(() => { clearTimeout(toastTimer); window.removeEventListener('keydown', onKeydown) })
</script>

<style scoped>
/* ══════════════════════════════════════════════════════════════
   BASE PAGE
══════════════════════════════════════════════════════════════ */
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
.btn:disabled { opacity:.5; cursor:not-allowed; transform:none !important; }

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
.tbl__meta { font-size:.82rem; color:var(--muted); max-width:120px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }

.cover-wrap { width:50px; height:38px; border-radius:8px; overflow:hidden; border:1px solid var(--border); position:relative; }
.cover-img { width:100%; height:100%; object-fit:cover; display:block; position:absolute; inset:0; transition:opacity .2s, transform .2s; }
.cover-img--base { opacity:1; transform:scale(1); }
.cover-img--hover { opacity:0; transform:scale(1.05); }
.cover-wrap:hover .cover-img--hover { opacity:1; transform:scale(1); }
.cover-wrap:hover .cover-img--base  { opacity:0; }
.cover-empty { width:50px; height:38px; border-radius:8px; border:1px dashed var(--border); display:flex; align-items:center; justify-content:center; color:var(--border); }
.cover-hover-badge { position:absolute; bottom:2px; left:2px; width:14px; height:14px; border-radius:3px; background:rgba(124,58,237,.85); color:#fff; font-size:.55rem; font-weight:900; display:flex; align-items:center; justify-content:center; z-index:5; }

.type-pill { display:inline-flex; align-items:center; gap:.3rem; padding:.22rem .65rem; border-radius:99px; font-size:.73rem; font-weight:700; white-space:nowrap; }
.type-pill--single      { background:rgba(40,90,220,.08);  color:#1a47a0; border:1px solid rgba(40,90,220,.18); }
.type-pill--gallery     { background:rgba(140,21,21,.08);  color:var(--crimson); border:1px solid rgba(140,21,21,.14); }
.type-pill--photo_story { background:rgba(80,40,140,.08);  color:#5028a0; border:1px solid rgba(80,40,140,.16); }

.topic-pill { display:inline-flex; padding:.2rem .6rem; border-radius:99px; background:rgba(140,21,21,.07); color:var(--crimson); border:1px solid rgba(140,21,21,.15); font-size:.75rem; font-weight:700; max-width:130px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.lang-dot { display:inline-flex; padding:.18rem .5rem; border-radius:6px; font-size:.72rem; font-weight:700; }
.lang-dot--ckb { background:rgba(254,221,0,.2); color:#806e00; border:1px solid rgba(254,221,0,.4); }
.lang-dot--kmr { background:rgba(30,90,200,.1);  color:#1a47a0; border:1px solid rgba(30,90,200,.2); }
.lang-row { display:flex; gap:.3rem; flex-wrap:wrap; }
.img-pill { display:inline-flex; align-items:center; gap:.35rem; font-size:.8rem; color:var(--muted); font-weight:600; }

.tbl__acts { display:flex; gap:.35rem; }
.act { width:30px; height:30px; border-radius:8px; border:1px solid var(--border); background:var(--cream); color:var(--muted); cursor:pointer; text-decoration:none; display:inline-flex; align-items:center; justify-content:center; transition:var(--transition); }
.act--view:hover { background:rgba(30,90,200,.08); border-color:rgba(30,90,200,.28); color:#1a47a0; }
.act--edit:hover { background:rgba(30,150,80,.08); border-color:rgba(30,150,80,.28); color:#166044; }
.act--del:hover  { background:rgba(140,21,21,.08); border-color:rgba(140,21,21,.25); color:var(--crimson); }

/* ══════════════════════════════════════════════════════════════
   DELETE MODAL
══════════════════════════════════════════════════════════════ */
.overlay { position:fixed; inset:0; z-index:200; background:rgba(20,10,10,.5); display:flex; align-items:center; justify-content:center; padding:1rem; }
.del-modal { background:var(--white); border-radius:var(--radius-lg); padding:2rem; max-width:400px; width:100%; box-shadow:0 30px 80px rgba(0,0,0,.25); text-align:center; }
.del-modal__ico { width:62px; height:62px; border-radius:50%; background:rgba(140,21,21,.07); border:1px solid rgba(140,21,21,.14); display:flex; align-items:center; justify-content:center; margin:0 auto .85rem; }
.del-modal__title { font-size:1.15rem; font-weight:700; margin-bottom:.5rem; }
.del-modal__body { color:var(--muted); font-size:.9rem; line-height:1.7; margin-bottom:1.5rem; }
.del-modal__acts { display:flex; gap:.75rem; justify-content:center; }
.spinner { width:13px; height:13px; border:2px solid rgba(255,255,255,.35); border-top-color:#fff; border-radius:50%; animation:spin .65s linear infinite; display:inline-block; }
@keyframes spin { to { transform:rotate(360deg) } }

/* ══════════════════════════════════════════════════════════════
   DETAIL MODAL — FULL REDESIGN
══════════════════════════════════════════════════════════════ */
.dk-bg {
  position: fixed; inset: 0; z-index: 1000;
  background: rgba(8, 6, 4, 0.65);
  backdrop-filter: blur(8px);
  display: flex; align-items: center; justify-content: center;
  padding: 1rem;
}

.dk {
  background: #FDFCFB;
  border-radius: 20px;
  width: 100%; max-width: 860px;
  max-height: 93vh; overflow-y: auto;
  box-shadow: 0 40px 100px rgba(0,0,0,.35), 0 0 0 1px rgba(0,0,0,.05);
  position: relative;
  scrollbar-width: thin;
  scrollbar-color: rgba(140,21,21,.2) transparent;
}

/* ── Close ── */
.dk__close {
  position: absolute; top: 14px; left: 14px; z-index: 30;
  width: 34px; height: 34px; border-radius: 50%;
  background: rgba(255,255,255,.85); backdrop-filter: blur(8px);
  border: 1px solid rgba(0,0,0,.1);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; color: #555; transition: .18s;
}
.dk__close:hover { background: #fff; color: #111; transform: scale(1.1); }

/* ── Hero ── */
.dk__hero {
  position: relative; min-height: 260px;
  background: linear-gradient(135deg, #1a0505 0%, #4a1010 50%, #8C1515 100%);
  background-size: cover; background-position: center;
  border-radius: 20px 20px 0 0; overflow: hidden;
}
.dk__hero-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,.88) 0%, rgba(0,0,0,.35) 45%, rgba(0,0,0,.1) 100%);
  pointer-events: none;
}
.dk__hero-hover-img {
  position: absolute; inset: 0;
  background-size: cover; background-position: center;
  opacity: 0; transition: opacity .3s ease; pointer-events: none;
}
.dk__hero:hover .dk__hero-hover-img { opacity: 1; }

.dk__hero-inner {
  position: relative; z-index: 5;
  padding: 1.4rem 1.6rem 1.3rem;
  min-height: 260px; display: flex; flex-direction: column;
  justify-content: flex-end; gap: .6rem;
}

.dk__hero-top { display: flex; flex-wrap: wrap; gap: .3rem; }

.dk__pill {
  display: inline-flex; align-items: center; gap: .25rem;
  padding: .22rem .65rem; border-radius: 99px;
  font-size: .72rem; font-weight: 700;
  backdrop-filter: blur(8px);
}
.dk__pill--type  { background: rgba(255,255,255,.15); color: rgba(255,255,255,.92); border: 1px solid rgba(255,255,255,.2); }
.dk__pill--topic { background: rgba(140,21,21,.45);   color: #fecdd3; border: 1px solid rgba(255,255,255,.1); }
.dk__pill--lang  { background: rgba(255,255,255,.12); color: rgba(255,255,255,.88); border: 1px solid rgba(255,255,255,.18); }
.dk__pill--hover { background: rgba(124,58,237,.35);  color: #e9d5ff; border: 1px solid rgba(124,58,237,.4); }

.dk__hero-titles { display: flex; flex-direction: column; gap: .2rem; }
.dk__hero-ckb    { color: #fff; font-size: 1.5rem; font-weight: 900; margin: 0; line-height: 1.3; letter-spacing: -.01em; }
.dk__hero-kmr    { color: rgba(255,255,255,.6); font-size: .9rem; font-weight: 600; margin: 0; }

.dk__hero-strip {
  display: flex; flex-wrap: wrap; gap: .6rem 1.2rem;
  padding-top: .35rem;
  border-top: 1px solid rgba(255,255,255,.12);
}
.dk__strip-item {
  display: inline-flex; align-items: center; gap: .3rem;
  font-size: .75rem; font-weight: 700;
  color: rgba(255,255,255,.65);
}

/* ── Body ── */
.dk__body { padding: 1.4rem 1.6rem; display: flex; flex-direction: column; gap: 1.6rem; }

/* ── Section ── */
.dk__sec {}
.dk__sec-label {
  display: flex; align-items: center; gap: .45rem;
  font-size: .73rem; font-weight: 900; letter-spacing: .07em; text-transform: uppercase;
  color: var(--crimson);
  padding-bottom: .65rem;
  border-bottom: 2px solid rgba(140,21,21,.1);
  margin-bottom: 1rem;
}
.dk__sec-icon { font-size: 1rem; }
.dk__sec-count {
  margin-right: auto;
  background: rgba(140,21,21,.08); color: var(--crimson);
  border: 1px solid rgba(140,21,21,.14);
  border-radius: 99px; padding: .1rem .55rem; font-size: .7rem;
}

/* ── Cover cards ── */
.dk__covers { display: grid; grid-template-columns: repeat(3, 1fr); gap: .9rem; }
@media (max-width: 580px) { .dk__covers { grid-template-columns: 1fr 1fr; } }

.dk__cover-card {
  display: flex; flex-direction: column; gap: .4rem;
  background: #fff; border: 1.5px solid #EEECE8;
  border-radius: 14px; padding: .75rem; overflow: hidden;
}
.dk__cover-card--empty { opacity: .45; }
.dk__cover-card--hover-slot { border-style: dashed; border-color: rgba(124,58,237,.25); background: rgba(124,58,237,.02); }

.dk__cover-badge {
  display: inline-flex; align-self: flex-start;
  padding: .18rem .55rem; border-radius: 6px;
  font-size: .68rem; font-weight: 800;
}
.dk__cover-badge--ckb   { background: rgba(200,168,0,.12); color: #8a7000; border: 1px solid rgba(200,168,0,.2); }
.dk__cover-badge--kmr   { background: rgba(74,122,240,.1);  color: #2d5ac0; border: 1px solid rgba(74,122,240,.18); }
.dk__cover-badge--hover { background: rgba(124,58,237,.08); color: #6d28d9; border: 1px solid rgba(124,58,237,.18); }

.dk__cover-frame {
  aspect-ratio: 4/3; border-radius: 8px; overflow: hidden;
  background: #F0EEEB; border: 1px solid #E8E5E0;
  display: flex; align-items: center; justify-content: center;
}
.dk__cover-frame--hover { border-style: dashed; border-color: rgba(124,58,237,.2); }
.dk__cover-frame img { width: 100%; height: 100%; object-fit: cover; display: block; }
.dk__cover-none { display: flex; flex-direction: column; align-items: center; gap: .35rem; color: #C8C5C0; font-size: .73rem; }

.dk__cover-url { font-size: .68rem; }
.dk__url-link { color: var(--muted); text-decoration: none; word-break: break-all; }
.dk__url-link:hover { color: var(--crimson); text-decoration: underline; }

/* ── Bilingual content ── */
.dk__bilingual { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
@media (max-width: 580px) { .dk__bilingual { grid-template-columns: 1fr; } }

.dk__lang-col {
  border-radius: 14px; padding: 1rem; border: 1.5px solid #EEECE8; background: #fff;
}
.dk__lang-col--ckb { border-top: 4px solid rgba(200,168,0,.5); }
.dk__lang-col--kmr { border-top: 4px solid rgba(74,122,240,.45); }

.dk__lang-header {
  display: flex; align-items: center; gap: .5rem;
  margin-bottom: .85rem;
}
.dk__lang-flag { font-size: 1.1rem; }
.dk__lang-name { font-size: .78rem; font-weight: 800; color: #4a4742; }

.dk__field-list { display: flex; flex-direction: column; gap: .6rem; }
.dk__field { display: flex; flex-direction: column; gap: .18rem; }

.dk__field-key {
  display: inline-flex; align-items: center; gap: .25rem;
  font-size: .68rem; font-weight: 800; letter-spacing: .04em; text-transform: uppercase;
  color: #A8A5A0;
}
.dk__field-val {
  font-size: .88rem; font-weight: 600; color: #2E2D29;
  line-height: 1.45;
}
.dk__field-val--text { font-weight: 400; color: #4E4C48; line-height: 1.65; white-space: pre-line; }
.dk__field-val--empty { color: #C0BDB8; font-style: italic; font-weight: 400; }

/* ── Tags ── */
.dk__tags-wrap { display: flex; flex-direction: column; gap: .75rem; }
.dk__tag-row { display: flex; align-items: flex-start; gap: .75rem; flex-wrap: wrap; }
.dk__tag-label {
  flex-shrink: 0; min-width: 130px; font-size: .7rem; font-weight: 800;
  padding: .22rem .6rem; border-radius: 6px; letter-spacing: .04em;
}
.dk__tag-label--ckb  { background: rgba(140,21,21,.07);  color: #8C1515; border: 1px solid rgba(140,21,21,.12); }
.dk__tag-label--kmr  { background: rgba(67,56,202,.07);  color: #4338ca; border: 1px solid rgba(67,56,202,.12); }
.dk__tag-label--kw   { background: rgba(15,118,110,.07); color: #0f766e; border: 1px solid rgba(15,118,110,.12); }
.dk__tag-chips { display: flex; flex-wrap: wrap; gap: .3rem; }
.dk__chip { display: inline-flex; padding: .22rem .6rem; border-radius: 8px; font-size: .78rem; font-weight: 700; }
.dk__chip--ckb { background: rgba(140,21,21,.07);  color: #8C1515; border: 1px solid rgba(140,21,21,.12); }
.dk__chip--kmr { background: rgba(67,56,202,.07);  color: #4338ca; border: 1px solid rgba(67,56,202,.12); }
.dk__chip--kw  { background: rgba(15,118,110,.07); color: #0f766e; border: 1px solid rgba(15,118,110,.12); }

/* ── Album rows ── */
.dk__album { display: flex; flex-direction: column; gap: .7rem; }

.dk__album-row {
  display: flex; gap: .85rem;
  background: #fff; border: 1.5px solid #EEECE8; border-radius: 14px;
  padding: .85rem 1rem; transition: .15s;
}
.dk__album-row:hover { border-color: rgba(140,21,21,.2); box-shadow: 0 3px 14px rgba(140,21,21,.07); }

.dk__album-thumb {
  display: flex; flex-direction: column; align-items: center; gap: .4rem; flex-shrink: 0;
}
.dk__album-num {
  width: 26px; height: 26px; border-radius: 50%;
  background: linear-gradient(135deg, #8C1515, #b52020);
  color: #fff; font-size: .7rem; font-weight: 900;
  display: flex; align-items: center; justify-content: center;
}
.dk__album-img {
  width: 78px; height: 64px; border-radius: 9px; overflow: hidden;
  border: 1px solid #E8E5E0; background: #F0EEEB;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.dk__album-img img { width: 100%; height: 100%; object-fit: cover; display: block; }
.dk__album-noimg { color: #C0BDB8; }

.dk__album-data { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: .45rem; }

/* Tech chips */
.dk__album-tech { display: flex; flex-wrap: wrap; gap: .35rem; }
.dk__tech {
  display: inline-flex; align-items: center; gap: .25rem;
  padding: .2rem .5rem; border-radius: 6px;
  font-size: .72rem; font-weight: 700; font-family: monospace;
}
.dk__tech em { font-style: normal; opacity: .65; font-size: .65rem; }
.dk__tech--dim    { background: rgba(30,64,175,.07);  color: #1e40af; border: 1px solid rgba(30,64,175,.14); }
.dk__tech--size   { background: rgba(140,21,21,.07);  color: #8C1515; border: 1px solid rgba(140,21,21,.14); }
.dk__tech--mime   { background: rgba(5,150,105,.07);  color: #059669; border: 1px solid rgba(5,150,105,.14); text-transform: uppercase; }
.dk__tech--orient { background: rgba(100,60,200,.07); color: #5b30c0; border: 1px solid rgba(100,60,200,.12); }

/* Captions & descriptions */
.dk__album-caps, .dk__album-descs { display: flex; flex-direction: column; gap: .2rem; }
.dk__album-cap-row, .dk__album-desc-row { display: flex; align-items: baseline; gap: .45rem; }
.dk__album-lang--ckb, .dk__album-lang--kmr {
  flex-shrink: 0; font-size: .6rem; font-weight: 900;
  padding: .08rem .35rem; border-radius: 5px;
}
.dk__album-lang--ckb { background: rgba(140,21,21,.08); color: #8C1515; border: 1px solid rgba(140,21,21,.12); }
.dk__album-lang--kmr { background: rgba(67,56,202,.08); color: #4338ca; border: 1px solid rgba(67,56,202,.12); }
.dk__album-cap-row strong { font-size: .87rem; color: #2E2D29; font-weight: 700; }
.dk__album-desc-text { font-size: .8rem; color: #767571; line-height: 1.5; }

/* URLs */
.dk__album-urls { display: flex; gap: .4rem; flex-wrap: wrap; }
.dk__album-url {
  display: inline-flex; align-items: center; gap: .28rem;
  font-size: .74rem; font-weight: 700;
  padding: .25rem .6rem; border-radius: 7px; text-decoration: none;
  transition: .15s;
}
.dk__album-url--s3    { background: rgba(15,118,110,.06); color: #0f766e; border: 1px solid rgba(15,118,110,.14); }
.dk__album-url--ext   { background: rgba(30,64,175,.06);  color: #1e40af; border: 1px solid rgba(30,64,175,.14); }
.dk__album-url--embed { background: rgba(124,58,237,.06); color: #7c3aed; border: 1px solid rgba(124,58,237,.14); }
.dk__album-url:hover  { filter: brightness(1.1); transform: translateY(-1px); }

/* ── Info grid ── */
.dk__info-grid {
  display: grid; grid-template-columns: 1fr 1fr;
  border: 1.5px solid #EEECE8; border-radius: 14px;
  overflow: hidden; background: #fff;
}
@media (max-width: 480px) { .dk__info-grid { grid-template-columns: 1fr; } }

.dk__info-cell {
  display: flex; flex-direction: column; gap: .25rem;
  padding: .85rem 1.1rem;
  border-bottom: 1px solid #F2F0ED;
  border-left: 1px solid #F2F0ED;
}
.dk__info-cell:nth-child(odd) { border-left: none; }
.dk__info-cell:last-child, .dk__info-cell:nth-last-child(2):nth-child(odd) { border-bottom: none; }

.dk__info-k {
  font-size: .69rem; font-weight: 800; text-transform: uppercase;
  letter-spacing: .05em; color: #B0ADA7;
}
.dk__info-v {
  font-size: .88rem; font-weight: 700; color: #2E2D29;
  word-break: break-word; line-height: 1.4;
}
.dk__info-v--yes   { color: #0f766e; }
.dk__info-v--empty { color: #C0BDB8; font-style: italic; font-weight: 400; font-size: .82rem; }
.dk__info-topic { display: flex; flex-direction: column; gap: .08rem; }
.dk__info-topic em    { font-style: normal; color: #767571; font-size: .8rem; font-weight: 600; }
.dk__info-topic small { color: #B0ADA7; font-size: .72rem; font-weight: 600; }

/* ── Footer ── */
.dk__foot {
  position: sticky; bottom: 0;
  display: flex; gap: .6rem; align-items: center;
  padding: .9rem 1.6rem;
  background: rgba(253,252,251,.95); backdrop-filter: blur(8px);
  border-top: 1px solid #EEECE8;
  border-radius: 0 0 20px 20px;
}

/* ══ TRANSITIONS ══ */
.dk-anim-enter-active, .dk-anim-leave-active { transition: .3s cubic-bezier(.16,1,.3,1); }
.dk-anim-enter-from, .dk-anim-leave-to { opacity: 0; }
.dk-anim-enter-from .dk, .dk-anim-leave-to .dk { transform: scale(.96) translateY(14px); }

.fade-enter-active,.fade-leave-active { transition:opacity .15s }
.fade-enter-from,.fade-leave-to { opacity:0 }
.slide-down-enter-active,.slide-down-leave-active { transition:.3s ease }
.slide-down-enter-from,.slide-down-leave-to { opacity:0; transform:translateY(-8px) }
.modal-enter-active,.modal-leave-active { transition:.25s ease }
.modal-enter-from,.modal-leave-to { opacity:0 }
.modal-enter-active .del-modal,.modal-leave-active .del-modal { transition:.25s ease }
.modal-enter-from .del-modal,.modal-leave-to .del-modal { transform:scale(.94) translateY(8px) }
</style>