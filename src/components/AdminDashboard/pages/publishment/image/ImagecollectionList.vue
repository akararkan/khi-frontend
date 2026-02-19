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
        <input v-model="searchQ" class="search__input" placeholder="گەڕان بە ناونیشان یا تاگ…" @input="onSearch" />
        <Transition name="fade">
          <button v-if="searchQ" class="search__clear" @click="clearSearch">
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
            <th style="width:112px">بەروار</th>
            <th style="width:88px">زمان</th>
            <th style="width:72px">وێنە</th>
            <th style="width:116px">کردار</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="c in filteredItems" :key="c.id" class="tbl__row" @click="openDetail(c)">
            <td><span class="tbl__id">#{{ c.id }}</span></td>
            <td>
              <div class="cover-wrap" v-if="c.coverUrl"><img class="cover-img" :src="c.coverUrl" loading="lazy" /></div>
              <div class="cover-empty" v-else><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg></div>
            </td>
            <td><div class="tbl__name">{{ c.ckbContent?.title || '—' }}</div></td>
            <td><div class="tbl__name tbl__name--kmr">{{ c.kmrContent?.title || '—' }}</div></td>
            <td>
              <span class="type-pill" :class="`type-pill--${(c.collectionType||'').toLowerCase()}`">
                {{ typeLabel(c.collectionType) }}
              </span>
            </td>
            <td class="tbl__date">{{ fmtDate(c.publishmentDate) }}</td>
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
                <button class="act act--view" title="تەواوی زانیاری" @click="openDetail(c)"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></button>
                <RouterLink class="act act--edit" :to="`/admin/image-collections/${c.id}/edit`"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4z"/></svg></RouterLink>
                <button class="act act--del" @click="confirmDelete(c)"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg></button>
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
            <div class="del-modal__ico"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#8C1515" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg></div>
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

    <!-- ══ DETAIL MODAL ══ -->
    <Teleport to="body">
      <Transition name="pdm-fade">
        <div v-if="detail" class="pdm-overlay" @click.self="closeDetail">
          <Transition name="pdm-rise" appear>
            <div v-if="detail" class="pdm" role="dialog">

              <button class="pdm-x" @click="closeDetail" aria-label="داخستن">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>

              <!-- ════ LEFT — GALLERY ════ -->
              <div class="pdm-media">
                <div class="pdm-media__empty" v-if="!albumItems.length">
                  <div class="pdm-media__empty-icon"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg></div>
                  <span>هیچ وێنەیەک نییە</span>
                  <img v-if="detail.coverUrl" :src="detail.coverUrl" class="pdm-media__cover-fallback" />
                </div>

                <div class="pdm-stage" v-else>
                  <div class="pdm-stage__image-wrap">
                    <img :src="currentAlbumItem.displayUrl" :key="currentAlbumItem.displayUrl" class="pdm-stage__image" />
                    <div class="pdm-stage__caption" v-if="currentAlbumCaption">{{ currentAlbumCaption }}</div>
                  </div>

                  <button v-if="albumItems.length > 1" class="pdm-arrow pdm-arrow--prev" @click="prevImg" :disabled="imgIdx === 0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M15 18l-6-6 6-6"/></svg>
                  </button>
                  <button v-if="albumItems.length > 1" class="pdm-arrow pdm-arrow--next" @click="nextImg" :disabled="imgIdx === albumItems.length - 1">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M9 18l6-6-6-6"/></svg>
                  </button>
                  <div class="pdm-counter" v-if="albumItems.length > 1">{{ imgIdx + 1 }} / {{ albumItems.length }}</div>
                </div>

                <!-- Thumbnail strip -->
                <div class="pdm-thumbs" v-if="albumItems.length > 1">
                  <button v-for="(m, i) in albumItems" :key="i" class="pdm-thumb" :class="{ 'pdm-thumb--on': i === imgIdx }" @click="imgIdx = i">
                    <img v-if="m.displayUrl" :src="m.displayUrl" loading="lazy" />
                    <span v-else class="pdm-thumb__icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg></span>
                    <span class="pdm-thumb__bar" v-if="i === imgIdx"></span>
                  </button>
                </div>
              </div>

              <!-- ════ RIGHT — INFO PANEL ════ -->
              <div class="pdm-info">
                <div class="pdm-info__head">
                  <div class="pdm-info__head-meta">
                    <span class="pdm-id-tag"># {{ detail.id }}</span>
                    <span class="type-pill" :class="`type-pill--${(detail.collectionType||'').toLowerCase()}`">{{ typeLabel(detail.collectionType) }}</span>
                    <span class="pdm-date-tag" v-if="detail.publishmentDate">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                      {{ fmtDate(detail.publishmentDate) }}
                    </span>
                  </div>

                  <h2 class="pdm-title">{{ bestTitle(detail) || '—' }}</h2>
                  <p class="pdm-subtitle" v-if="altTitle(detail)">{{ altTitle(detail) }}</p>

                  <div class="pdm-langs">
                    <span v-for="l in (detail.contentLanguages||[])" :key="l" class="pdm-lang" :class="`pdm-lang--${l.toLowerCase()}`">
                      {{ l === 'CKB' ? 'سۆرانی' : 'کورمانجی' }}
                    </span>
                  </div>

                  <RouterLink class="pdm-edit-btn" :to="`/admin/image-collections/${detail.id}/edit`" @click="closeDetail">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4z"/></svg>
                    دەستکاری کۆکراوە
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
                  <div class="acc" v-if="activeContent(detail)?.description">
                    <button class="acc__hd" @click="toggleAcc('desc')">
                      <span class="acc__hd-left"><span class="acc__ico acc__ico--desc"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg></span><span class="acc__title">وەسف</span></span>
                      <svg class="acc__chevron" :class="{ 'acc__chevron--open': openAccordions.has('desc') }" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M6 9l6 6 6-6"/></svg>
                    </button>
                    <Transition name="acc-body">
                      <div v-if="openAccordions.has('desc')" class="acc__body">
                        <p class="acc__text acc__text--desc">{{ activeContent(detail).description }}</p>
                      </div>
                    </Transition>
                  </div>

                  <!-- Topic / Location / CollectedBy -->
                  <div class="acc" v-if="activeContent(detail)?.topic || activeContent(detail)?.location || activeContent(detail)?.collectedBy">
                    <button class="acc__hd" @click="toggleAcc('meta')">
                      <span class="acc__hd-left"><span class="acc__ico acc__ico--meta"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg></span><span class="acc__title">زانیاری زیاتر</span></span>
                      <svg class="acc__chevron" :class="{ 'acc__chevron--open': openAccordions.has('meta') }" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M6 9l6 6 6-6"/></svg>
                    </button>
                    <Transition name="acc-body">
                      <div v-if="openAccordions.has('meta')" class="acc__body">
                        <div class="acc__meta-grid">
                          <div class="acc__meta-row" v-if="activeContent(detail)?.topic">
                            <span class="acc__meta-k">بابەت</span>
                            <span class="acc__meta-v">{{ activeContent(detail).topic }}</span>
                          </div>
                          <div class="acc__meta-row" v-if="activeContent(detail)?.location">
                            <span class="acc__meta-k"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg> شوێن</span>
                            <span class="acc__meta-v">{{ activeContent(detail).location }}</span>
                          </div>
                          <div class="acc__meta-row" v-if="activeContent(detail)?.collectedBy">
                            <span class="acc__meta-k"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> کۆکەر</span>
                            <span class="acc__meta-v">{{ activeContent(detail).collectedBy }}</span>
                          </div>
                        </div>
                      </div>
                    </Transition>
                  </div>

                  <!-- Current image caption/description -->
                  <div class="acc" v-if="albumItems.length && (currentAlbumItem.captionCkb || currentAlbumItem.captionKmr || currentAlbumItem.descriptionCkb || currentAlbumItem.descriptionKmr)">
                    <button class="acc__hd" @click="toggleAcc('imginfo')">
                      <span class="acc__hd-left"><span class="acc__ico acc__ico--img"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg></span><span class="acc__title">زانیاری وێنەی ئێستا</span></span>
                      <svg class="acc__chevron" :class="{ 'acc__chevron--open': openAccordions.has('imginfo') }" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M6 9l6 6 6-6"/></svg>
                    </button>
                    <Transition name="acc-body">
                      <div v-if="openAccordions.has('imginfo')" class="acc__body">
                        <div class="acc__meta-grid">
                          <div class="acc__meta-row" v-if="currentAlbumItem.captionCkb"><span class="acc__meta-k">کاپشن سۆرانی</span><span class="acc__meta-v">{{ currentAlbumItem.captionCkb }}</span></div>
                          <div class="acc__meta-row" v-if="currentAlbumItem.captionKmr"><span class="acc__meta-k">کاپشن کورمانجی</span><span class="acc__meta-v">{{ currentAlbumItem.captionKmr }}</span></div>
                          <div class="acc__meta-row" v-if="currentAlbumItem.descriptionCkb"><span class="acc__meta-k">وەسف سۆرانی</span><span class="acc__meta-v">{{ currentAlbumItem.descriptionCkb }}</span></div>
                          <div class="acc__meta-row" v-if="currentAlbumItem.descriptionKmr"><span class="acc__meta-k">وەسف کورمانجی</span><span class="acc__meta-v">{{ currentAlbumItem.descriptionKmr }}</span></div>
                        </div>
                      </div>
                    </Transition>
                  </div>

                  <!-- Tags -->
                  <div class="acc" v-if="activeTags(detail).length">
                    <button class="acc__hd" @click="toggleAcc('tags')">
                      <span class="acc__hd-left"><span class="acc__ico acc__ico--tag"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg></span><span class="acc__title">تاگەکان</span><span class="acc__badge acc__badge--tag">{{ activeTags(detail).length }}</span></span>
                      <svg class="acc__chevron" :class="{ 'acc__chevron--open': openAccordions.has('tags') }" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M6 9l6 6 6-6"/></svg>
                    </button>
                    <Transition name="acc-body">
                      <div v-if="openAccordions.has('tags')" class="acc__body">
                        <div class="acc__chips"><span v-for="t in activeTags(detail)" :key="t" class="acc__chip acc__chip--tag">{{ t }}</span></div>
                      </div>
                    </Transition>
                  </div>

                  <!-- Keywords -->
                  <div class="acc" v-if="activeKeywords(detail).length">
                    <button class="acc__hd" @click="toggleAcc('kw')">
                      <span class="acc__hd-left"><span class="acc__ico acc__ico--kw"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg></span><span class="acc__title">کیووەردەکان</span><span class="acc__badge acc__badge--kw">{{ activeKeywords(detail).length }}</span></span>
                      <svg class="acc__chevron" :class="{ 'acc__chevron--open': openAccordions.has('kw') }" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M6 9l6 6 6-6"/></svg>
                    </button>
                    <Transition name="acc-body">
                      <div v-if="openAccordions.has('kw')" class="acc__body">
                        <div class="acc__chips"><span v-for="t in activeKeywords(detail)" :key="t" class="acc__chip acc__chip--kw">{{ t }}</span></div>
                      </div>
                    </Transition>
                  </div>

                  <!-- System info -->
                  <div class="acc acc--system">
                    <button class="acc__hd acc__hd--system" @click="toggleAcc('sys')">
                      <span class="acc__hd-left"><span class="acc__ico acc__ico--sys"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg></span><span class="acc__title">زانیاری سیستەم</span></span>
                      <svg class="acc__chevron" :class="{ 'acc__chevron--open': openAccordions.has('sys') }" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M6 9l6 6 6-6"/></svg>
                    </button>
                    <Transition name="acc-body">
                      <div v-if="openAccordions.has('sys')" class="acc__body acc__body--flush">
                        <div class="acc__sys-grid">
                          <div class="acc__sys-cell" v-if="detail.createdAt"><div class="acc__sys-k">دروستکراوە لە</div><div class="acc__sys-v">{{ fmtDatetime(detail.createdAt) }}</div></div>
                          <div class="acc__sys-cell" v-if="detail.updatedAt"><div class="acc__sys-k">دواین نوێکردنەوە</div><div class="acc__sys-v">{{ fmtDatetime(detail.updatedAt) }}</div></div>
                          <div class="acc__sys-cell acc__sys-cell--full"><div class="acc__sys-k">شناسەی یەکتا (ID)</div><div class="acc__sys-v acc__sys-v--mono">{{ detail.id }}</div></div>
                          <div class="acc__sys-cell acc__sys-cell--full" v-if="detail.coverUrl"><div class="acc__sys-k">Cover URL</div><a :href="detail.coverUrl" target="_blank" class="acc__sys-v acc__sys-v--link">{{ detail.coverUrl }}</a></div>
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
import { ref, computed, onMounted, watch } from 'vue'
import api from '@/api.js'

/* ── state ── */
const items          = ref([])
const loading        = ref(false)
const error          = ref('')
const searchQ        = ref('')
const filterLang     = ref('')
const filterType     = ref('')
const delTarget      = ref(null)
const deleting       = ref(false)
const detail         = ref(null)
const detailLang     = ref('CKB')
const imgIdx         = ref(0)
const toast          = ref({ show: false, type: 'success', msg: '' })
const openAccordions = ref(new Set(['desc', 'meta', 'imginfo', 'tags', 'kw']))
let searchTimer      = null

/* ── client-side filters ── */
const filteredItems = computed(() => {
  let list = items.value

  if (searchQ.value.trim()) {
    const q = searchQ.value.trim().toLowerCase()
    list = list.filter(c => {
      const t1 = (c.ckbContent?.title || '').toLowerCase()
      const t2 = (c.kmrContent?.title || '').toLowerCase()
      const tags = [...(c.tags?.ckb || []), ...(c.tags?.kmr || [])].join(' ').toLowerCase()
      return t1.includes(q) || t2.includes(q) || tags.includes(q)
    })
  }

  if (filterLang.value) {
    list = list.filter(c => (c.contentLanguages || []).includes(filterLang.value))
  }

  if (filterType.value) {
    list = list.filter(c => c.collectionType === filterType.value)
  }

  return list
})

const toggleAcc = (key) => {
  const s = new Set(openAccordions.value)
  s.has(key) ? s.delete(key) : s.add(key)
  openAccordions.value = s
}

/* ── album items for detail modal ── */
const albumItems = computed(() => {
  if (!detail.value) return []
  const raw = (detail.value.imageAlbum || [])
    .slice()
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))

  const list = raw.map(i => ({
    displayUrl:     i.imageUrl || i.externalUrl || i.embedUrl || '',
    captionCkb:     i.captionCkb || '',
    captionKmr:     i.captionKmr || '',
    descriptionCkb: i.descriptionCkb || '',
    descriptionKmr: i.descriptionKmr || '',
  })).filter(i => i.displayUrl)

  // Fallback to cover if no album images
  if (!list.length && detail.value.coverUrl) {
    list.push({ displayUrl: detail.value.coverUrl, captionCkb: '', captionKmr: '', descriptionCkb: '', descriptionKmr: '' })
  }

  return list
})

const currentAlbumItem = computed(() => albumItems.value[imgIdx.value] || { displayUrl: '', captionCkb: '', captionKmr: '', descriptionCkb: '', descriptionKmr: '' })
const currentAlbumCaption = computed(() => detailLang.value === 'CKB' ? currentAlbumItem.value.captionCkb : currentAlbumItem.value.captionKmr)

watch(detail, () => { imgIdx.value = 0 })

/* ── data loading ── */
const load = async () => {
  loading.value = true
  error.value   = ''
  try {
    const { data } = await api.get('/api/v1/image-collections')
    // Response: ApiResponse<List<Response>> → data.data is plain array
    const payload = data?.data ?? data ?? []
    items.value = Array.isArray(payload) ? payload : (Array.isArray(payload?.content) ? payload.content : [])
  } catch (e) {
    error.value = e?.response?.data?.message || e.message || 'هەڵەیەک ڕوویدا'
  } finally {
    loading.value = false
  }
}

const onSearch    = () => { clearTimeout(searchTimer); searchTimer = setTimeout(() => {}, 0) } // client-side only
const clearSearch = () => { searchQ.value = '' }

/* ── delete ── */
const confirmDelete = (c) => { delTarget.value = c }
const doDelete = async () => {
  if (!delTarget.value) return
  deleting.value = true
  try {
    await api.delete(`/api/v1/image-collections/${delTarget.value.id}`)
    showToast('success', 'کۆکراوەکە بە سەرکەوتنی سڕایەوە')
    delTarget.value = null
    load()
  } catch (e) {
    showToast('error', e?.response?.data?.message || 'سڕینەوە سەرنەکەوت')
  } finally {
    deleting.value = false
  }
}

/* ── detail modal ── */
const openDetail = (c) => {
  detail.value     = c
  detailLang.value = (c.contentLanguages || []).includes('CKB') ? 'CKB' : ((c.contentLanguages || [])[0] || 'CKB')
  openAccordions.value = new Set(['desc', 'meta', 'imginfo', 'tags', 'kw'])
  document.body.style.overflow = 'hidden'
}
const closeDetail = () => { detail.value = null; document.body.style.overflow = '' }

const prevImg = () => { if (imgIdx.value > 0) imgIdx.value-- }
const nextImg = () => { if (imgIdx.value < albumItems.value.length - 1) imgIdx.value++ }

/* ── helpers ── */
const bestTitle  = (c) => c?.ckbContent?.title || c?.kmrContent?.title || ''
const altTitle   = (c) => {
  const ckb = c?.ckbContent?.title || ''
  const kmr = c?.kmrContent?.title || ''
  if (ckb && kmr && ckb !== kmr) return detailLang.value === 'CKB' ? kmr : ckb
  return ''
}
const activeContent  = (c) => detailLang.value === 'CKB' ? c?.ckbContent  : c?.kmrContent
const activeTags     = (c) => detailLang.value === 'CKB' ? [...(c?.tags?.ckb || [])] : [...(c?.tags?.kmr || [])]
const activeKeywords = (c) => detailLang.value === 'CKB' ? [...(c?.keywords?.ckb || [])] : [...(c?.keywords?.kmr || [])]

const typeLabel = (t) => ({ SINGLE: 'تەنها وێنە', GALLERY: 'گەلەری', PHOTO_STORY: 'چیرۆکی وێنە' }[t] || t || '—')

const showToast   = (type, msg) => { toast.value = { show: true, type, msg }; setTimeout(() => { toast.value.show = false }, 3500) }
const fmtDate     = (d) => d ? new Date(d).toLocaleDateString('ar-IQ') : '—'
const fmtDatetime = (d) => d ? new Date(d).toLocaleString('ar-IQ', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'

onMounted(load)
</script>

<style scoped>
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
.cover-wrap { width:50px; height:38px; border-radius:8px; overflow:hidden; border:1px solid var(--border); }
.cover-img { width:100%; height:100%; object-fit:cover; display:block; }
.cover-empty { width:50px; height:38px; border-radius:8px; border:1px dashed var(--border); display:flex; align-items:center; justify-content:center; color:var(--border); }

/* Collection Type Pills */
.type-pill { display:inline-flex; align-items:center; gap:.3rem; padding:.22rem .65rem; border-radius:99px; font-size:.73rem; font-weight:700; white-space:nowrap; }
.type-pill--single     { background:rgba(40,90,220,.08); color:#1a47a0; border:1px solid rgba(40,90,220,.18); }
.type-pill--gallery    { background:rgba(140,21,21,.08); color:var(--crimson); border:1px solid rgba(140,21,21,.14); }
.type-pill--photo_story{ background:rgba(80,40,140,.08); color:#5028a0; border:1px solid rgba(80,40,140,.16); }

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

/* ════ DETAIL MODAL ════ */
.pdm-overlay { position:fixed; inset:0; z-index:400; background:rgba(5,2,2,.78); backdrop-filter:blur(12px); display:flex; align-items:center; justify-content:center; padding:1.5rem; overflow-y:auto; }
.pdm { position:relative; width:100%; max-width:1080px; max-height:calc(100vh - 3rem); background:#141010; border-radius:20px; overflow:hidden; display:grid; grid-template-columns:1fr 420px; box-shadow:0 0 0 1px rgba(255,255,255,.07),0 40px 120px rgba(0,0,0,.75); }
@media (max-width:820px) { .pdm { grid-template-columns:1fr; max-height:none; } }
.pdm-x { position:absolute; top:1rem; left:1rem; z-index:50; width:36px; height:36px; border-radius:50%; background:rgba(0,0,0,.55); border:1px solid rgba(255,255,255,.15); color:rgba(255,255,255,.85); cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all .22s ease; backdrop-filter:blur(8px); }
.pdm-x:hover { background:rgba(140,21,21,.8); color:#fff; transform:rotate(90deg) scale(1.08); }
.pdm-media { display:flex; flex-direction:column; background:#0c0808; position:relative; min-height:480px; }
.pdm-media__empty { flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:.75rem; color:rgba(255,255,255,.25); font-size:.85rem; padding:2rem; position:relative; }
.pdm-media__empty-icon { width:72px; height:72px; border-radius:50%; background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.08); display:flex; align-items:center; justify-content:center; }
.pdm-media__cover-fallback { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; opacity:.18; }
.pdm-stage { flex:1; position:relative; display:flex; align-items:center; justify-content:center; overflow:hidden; min-height:360px; }
.pdm-stage__image-wrap { position:relative; width:100%; height:100%; display:flex; align-items:center; justify-content:center; min-height:360px; }
.pdm-stage__image { max-width:100%; max-height:500px; object-fit:contain; display:block; animation:pdm-img-in .35s ease; }
@keyframes pdm-img-in { from{opacity:0;transform:scale(.97)} to{opacity:1;transform:scale(1)} }
.pdm-stage__caption { position:absolute; bottom:0; left:0; right:0; padding:.65rem 1rem; background:linear-gradient(transparent,rgba(0,0,0,.82)); color:rgba(255,255,255,.82); font-size:.8rem; font-weight:500; }
.pdm-arrow { position:absolute; top:50%; transform:translateY(-50%); width:42px; height:42px; border-radius:50%; background:rgba(0,0,0,.55); border:1px solid rgba(255,255,255,.12); color:rgba(255,255,255,.85); cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all .2s ease; backdrop-filter:blur(6px); z-index:10; }
.pdm-arrow--prev { right:1rem; }
.pdm-arrow--next { left:1rem; }
.pdm-arrow:hover:not(:disabled) { background:rgba(140,21,21,.75); transform:translateY(-50%) scale(1.08); }
.pdm-arrow:disabled { opacity:.2; cursor:default; }
.pdm-counter { position:absolute; bottom:1rem; right:1rem; background:rgba(0,0,0,.55); border:1px solid rgba(255,255,255,.1); color:rgba(255,255,255,.65); font-size:.72rem; font-weight:700; padding:.28rem .6rem; border-radius:99px; z-index:10; }
.pdm-thumbs { flex:0 0 auto; display:flex; gap:.4rem; padding:.65rem .75rem; background:rgba(0,0,0,.4); border-top:1px solid rgba(255,255,255,.06); overflow-x:auto; scrollbar-width:none; }
.pdm-thumbs::-webkit-scrollbar { display:none }
.pdm-thumb { flex:0 0 64px; height:48px; border-radius:8px; overflow:hidden; border:2px solid transparent; background:rgba(255,255,255,.07); cursor:pointer; transition:all .2s ease; display:flex; align-items:center; justify-content:center; position:relative; padding:0; }
.pdm-thumb:hover { border-color:rgba(255,255,255,.3); transform:translateY(-2px); }
.pdm-thumb--on { border-color:#8c1515!important; box-shadow:0 0 0 1px rgba(140,21,21,.5); }
.pdm-thumb img { width:100%; height:100%; object-fit:cover; display:block; }
.pdm-thumb__icon { display:flex; align-items:center; justify-content:center; width:100%; height:100%; color:rgba(255,255,255,.4); }
.pdm-thumb__bar { position:absolute; bottom:0; left:0; right:0; height:2px; background:#8c1515; }
.pdm-info { display:flex; flex-direction:column; background:#faf8f5; border-right:1px solid rgba(0,0,0,.08); max-height:calc(100vh - 3rem); overflow:hidden; }
.pdm-info__head { flex:0 0 auto; padding:1.6rem 1.4rem 1.1rem; background:#fff; border-bottom:1px solid #ece7df; }
.pdm-info__head-meta { display:flex; align-items:center; gap:.5rem; margin-bottom:.7rem; flex-wrap:wrap; }
.pdm-id-tag { font-size:.72rem; font-weight:700; color:#b0a898; letter-spacing:.06em; }
.pdm-date-tag { display:inline-flex; align-items:center; gap:.3rem; font-size:.72rem; color:#a09888; font-weight:600; margin-right:auto; }
.pdm-title { font-size:1.35rem; font-weight:800; color:#1a1410; line-height:1.25; letter-spacing:-.02em; margin:0 0 .3rem; }
.pdm-subtitle { font-size:.88rem; color:#9a9286; font-weight:500; margin:0 0 .7rem; }
.pdm-langs { display:flex; align-items:center; gap:.4rem; flex-wrap:wrap; margin-bottom:1rem; }
.pdm-lang { display:inline-flex; padding:.2rem .65rem; border-radius:6px; font-size:.72rem; font-weight:700; }
.pdm-lang--ckb { background:rgba(254,221,0,.14); color:#7a6200; border:1px solid rgba(254,221,0,.35); }
.pdm-lang--kmr { background:rgba(40,90,220,.08); color:#2848b0; border:1px solid rgba(40,90,220,.18); }
.pdm-edit-btn { display:inline-flex; align-items:center; gap:.4rem; padding:.55rem 1.1rem; border-radius:10px; background:#8c1515; color:#fff; border:none; font-size:.82rem; font-weight:700; text-decoration:none; cursor:pointer; transition:all .2s ease; width:100%; justify-content:center; font-family:inherit; box-shadow:0 4px 16px rgba(140,21,21,.28); }
.pdm-edit-btn:hover { background:#a61c1c; transform:translateY(-1px); }
.pdm-tabs { flex:0 0 auto; display:flex; background:#f0ece5; border-bottom:1px solid #e4dfd7; }
.pdm-tab { flex:1; display:inline-flex; align-items:center; justify-content:center; gap:.4rem; padding:.65rem 1rem; border:none; background:none; color:#9a9286; font-weight:700; font-size:.83rem; cursor:pointer; transition:all .2s; font-family:inherit; border-bottom:2px solid transparent; }
.pdm-tab--on { color:#8c1515; background:#faf8f5; border-bottom-color:#8c1515; }
.pdm-tab__pip { width:7px; height:7px; border-radius:50%; }
.pdm-tab__pip--ckb { background:#c8a800 }
.pdm-tab__pip--kmr { background:#4a7af0 }
.pdm-info__body { flex:1; overflow-y:auto; display:flex; flex-direction:column; gap:0; scroll-behavior:smooth; padding-bottom:1.5rem; }
.pdm-info__body::-webkit-scrollbar { width:3px }
.pdm-info__body::-webkit-scrollbar-thumb { background:#d4cec6; border-radius:99px }
.acc { border-bottom:1px solid #ede8e0; }
.acc:last-child { border-bottom:none }
.acc__hd { width:100%; display:flex; align-items:center; justify-content:space-between; padding:.95rem 1.3rem; background:none; border:none; cursor:pointer; font-family:inherit; transition:background .18s ease; gap:.5rem; }
.acc__hd:hover { background:rgba(140,21,21,.03) }
.acc__hd--system:hover { background:rgba(100,80,50,.04) }
.acc__hd-left { display:flex; align-items:center; gap:.7rem; flex:1; min-width:0; }
.acc__ico { width:32px; height:32px; border-radius:9px; display:flex; align-items:center; justify-content:center; flex-shrink:0; transition:transform .2s ease; }
.acc__hd:hover .acc__ico { transform:scale(1.08) }
.acc__ico--desc { background:rgba(140,21,21,.09); color:#8c1515; border:1px solid rgba(140,21,21,.16) }
.acc__ico--meta { background:rgba(22,120,70,.09); color:#166044; border:1px solid rgba(22,120,70,.18) }
.acc__ico--img  { background:rgba(80,40,140,.09); color:#5028a0; border:1px solid rgba(80,40,140,.16) }
.acc__ico--tag  { background:rgba(200,168,0,.12); color:#7a6200; border:1px solid rgba(200,168,0,.22) }
.acc__ico--kw   { background:rgba(40,90,220,.09); color:#2848b0; border:1px solid rgba(40,90,220,.16) }
.acc__ico--sys  { background:rgba(80,80,80,.08); color:#505050; border:1px solid rgba(80,80,80,.14) }
.acc__title { font-size:.92rem; font-weight:700; color:#1e1812; letter-spacing:-.01em; }
.acc__badge { display:inline-flex; padding:.18rem .58rem; border-radius:99px; font-size:.71rem; font-weight:800; letter-spacing:.04em; }
.acc__badge--tag { background:rgba(200,168,0,.12); color:#7a6200; border:1px solid rgba(200,168,0,.22) }
.acc__badge--kw  { background:rgba(40,90,220,.09); color:#2848b0; border:1px solid rgba(40,90,220,.16) }
.acc__chevron { color:#c8c0b4; flex-shrink:0; transition:transform .28s cubic-bezier(.34,1.56,.64,1),color .18s; }
.acc__chevron--open { transform:rotate(180deg); color:#8c1515 }
.acc__hd:hover .acc__chevron { color:#8c1515 }
.acc__body { overflow:hidden; padding:0 1.3rem 1.1rem; }
.acc__body--flush { padding:0 0 .5rem; }
.acc-body-enter-active { transition:all .3s cubic-bezier(.22,1,.36,1) }
.acc-body-leave-active { transition:all .22s ease }
.acc-body-enter-from,.acc-body-leave-to { opacity:0; transform:translateY(-6px) }
.acc__text--desc { font-size:.9rem; color:#2e2418; line-height:1.85; white-space:pre-line; margin:0; padding:.2rem 0; max-height:260px; overflow-y:auto; scrollbar-width:thin; }
.acc__meta-grid { display:flex; flex-direction:column; gap:.5rem; }
.acc__meta-row { display:flex; align-items:baseline; gap:.75rem; font-size:.88rem; }
.acc__meta-k { flex:0 0 auto; font-size:.74rem; font-weight:700; color:#b8b0a4; text-transform:uppercase; letter-spacing:.04em; display:inline-flex; align-items:center; gap:.25rem; min-width:80px; }
.acc__meta-v { color:#2e2418; font-weight:600; line-height:1.4; }
.acc__chips { display:flex; flex-wrap:wrap; gap:.42rem; }
.acc__chip { display:inline-flex; align-items:center; gap:.3rem; padding:.32rem .78rem; border-radius:8px; font-size:.82rem; font-weight:600; cursor:default; transition:transform .15s ease; }
.acc__chip:hover { transform:translateY(-2px) }
.acc__chip--tag { background:rgba(200,168,0,.11); color:#7a6200; border:1px solid rgba(200,168,0,.22) }
.acc__chip--kw  { background:rgba(40,90,220,.08); color:#2848b0; border:1px solid rgba(40,90,220,.15) }
.acc--system { background:#faf7f2 }
.acc__sys-grid { display:grid; grid-template-columns:1fr 1fr; padding:0 1.3rem .75rem; gap:0 }
.acc__sys-cell { padding:.72rem .65rem .72rem 0; border-bottom:1px solid #ede8e0; border-left:1px solid #ede8e0 }
.acc__sys-cell:nth-child(odd) { border-left:none; padding-right:.65rem }
.acc__sys-cell--full { grid-column:1/-1; border-left:none }
.acc__sys-cell:last-child,.acc__sys-cell:nth-last-child(2):not(.acc__sys-cell--full) { border-bottom:none }
.acc__sys-k { font-size:.68rem; font-weight:700; color:#c0b8ac; letter-spacing:.05em; margin-bottom:.25rem; text-transform:uppercase }
.acc__sys-v { font-size:.84rem; color:#2e2418; font-weight:600; line-height:1.4 }
.acc__sys-v--mono { font-family:'Courier New',monospace; font-size:.78rem; letter-spacing:.04em }
.acc__sys-v--link { color:#8c1515; font-size:.73rem; font-weight:500; word-break:break-all; text-decoration:none; display:block }
.acc__sys-v--link:hover { text-decoration:underline }
.pdm-fade-enter-active,.pdm-fade-leave-active { transition:opacity .3s ease }
.pdm-fade-enter-from,.pdm-fade-leave-to { opacity:0 }
.pdm-rise-enter-active { transition:opacity .38s ease,transform .38s cubic-bezier(.22,1,.36,1) }
.pdm-rise-leave-active { transition:opacity .22s ease,transform .22s ease }
.pdm-rise-enter-from { opacity:0; transform:scale(.94) translateY(20px) }
.pdm-rise-leave-to   { opacity:0; transform:scale(.97) translateY(10px) }
</style>