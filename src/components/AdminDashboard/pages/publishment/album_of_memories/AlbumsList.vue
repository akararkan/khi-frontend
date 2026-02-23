<template>
  <div class="aml" dir="rtl">

    <!-- Header -->
    <div class="aml__head">
      <div class="aml__head-info">
        <h1 class="aml__title">ئەڵبووم بیرەوەریەکان</h1>
        <p class="aml__sub">باڕکردن و بەڕێوەبردنی ئەڵبووم دەنگ و ڤیدیۆ</p>
      </div>
      <RouterLink to="/admin/albums/new" class="btn btn--primary">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        ئەڵبوومی نوێ
      </RouterLink>
    </div>

    <!-- Toast -->
    <Transition name="slide-down">
      <div v-if="toast.show" class="toast" :class="`toast--${toast.type}`">
        <span class="toast__ico">{{ toast.type === 'success' ? '✓' : '✕' }}</span>
        {{ toast.msg }}
      </div>
    </Transition>

    <!-- Search + Filters -->
    <div class="aml__toolbar">
      <div class="search-wrap">
        <svg class="search-ico" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input v-model="searchQ" @input="onSearch" class="search-inp" placeholder="گەڕان بە ناو، تاگ، کیووەرد…" />
        <Transition name="fade">
          <button v-if="searchQ" @click="clearSearch" class="search-clear">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </Transition>
      </div>
      <select v-model="filterLang" @change="applyFilters" class="sel">
        <option value="">هەموو زمانەکان</option>
        <option value="CKB">سۆرانی (CKB)</option>
        <option value="KMR">کورمانجی (KMR)</option>
      </select>
      <select v-model="filterType" @change="applyFilters" class="sel">
        <option value="">هەموو جۆرەکان</option>
        <option value="AUDIO">دەنگ (AUDIO)</option>
        <option value="VIDEO">ڤیدیۆ (VIDEO)</option>
      </select>
      <div class="aml__count" v-if="!loading">
        <span class="count-badge">{{ filtered.length }}</span> ئەڵبووم
      </div>
    </div>

    <!-- Skeleton -->
    <div v-if="loading" class="tbl-wrap">
      <table class="tbl">
        <thead>
          <tr>
            <th style="width:70px">کڤەر</th>
            <th>ناونیشان</th>
            <th style="width:110px">جۆر</th>
            <th style="width:100px">ساڵ</th>
            <th style="width:90px">تراک</th>
            <th style="width:90px">زمان</th>
            <th style="width:105px">کردارەکان</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="i in 6" :key="i" class="skel-row" :style="`animation-delay:${i*0.05}s`">
            <td><div class="skel skel--cover"></div></td>
            <td><div class="skel skel--title"></div><div class="skel skel--sub"></div></td>
            <td><div class="skel skel--pill"></div></td>
            <td><div class="skel skel--chip"></div></td>
            <td><div class="skel skel--chip"></div></td>
            <td><div class="skel skel--chip"></div></td>
            <td><div class="skel skel--actions"></div></td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="state-box state-box--err">
      <div class="state-box__ico"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg></div>
      <p>{{ error }}</p>
      <button @click="loadAlbums" class="btn btn--ghost btn--sm">دووبارە هەوڵبدەرەوە</button>
    </div>

    <!-- Empty -->
    <div v-else-if="!filtered.length" class="state-box">
      <div class="state-box__ico"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg></div>
      <p>هیچ ئەڵبوومێک نەدۆزرایەوە</p>
      <RouterLink to="/admin/albums/new" class="btn btn--primary btn--sm">ئەڵبوومی نوێ دروست بکە</RouterLink>
    </div>

    <!-- Table -->
    <div v-else class="tbl-wrap">
      <div class="table-meta">
        کۆی {{ filtered.length }} ئەڵبووم
        <span v-if="searchQ"> — ئەنجامی گەڕان بۆ «{{ searchQ }}»</span>
      </div>
      <table class="tbl">
        <thead>
          <tr>
            <th style="width:70px">کڤەر</th>
            <th>ناونیشان</th>
            <th style="width:120px">جۆر</th>
            <th style="width:80px">ساڵ</th>
            <th style="width:90px">تراکەکان</th>
            <th style="width:100px">زمان</th>
            <th style="width:105px">کردارەکان</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(album, idx) in filtered" :key="album.id"
            class="tbl-row"
            :style="`animation-delay:${idx * 0.03}s`"
            @click="openDetail(album)"
          >
            <td>
              <div class="cover-wrap" v-if="coverSrc(album)">
                <img class="cover-img" :src="coverSrc(album)" :alt="albumTitle(album)" loading="lazy" />
              </div>
              <div class="cover-empty" v-else>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
              </div>
            </td>

            <td>
              <div class="tbl__name">{{ albumTitle(album) }}</div>
              <div class="tbl__name tbl__name--sub" v-if="albumSubTitle(album)">{{ albumSubTitle(album) }}</div>
              <div class="tbl__loc" v-if="albumLocation(album)">
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                {{ albumLocation(album) }}
              </div>
            </td>

            <td>
              <span class="pill" :class="album.albumType === 'AUDIO' ? 'pill--audio' : 'pill--video'">
                <span class="pill__dot"></span>
                {{ album.albumType === 'AUDIO' ? 'دەنگ' : 'ڤیدیۆ' }}
              </span>
            </td>

            <td>
              <span class="meta-chip" v-if="album.yearOfPublishment">{{ album.yearOfPublishment }}</span>
              <span class="tbl__dash" v-else>—</span>
            </td>

            <td>
              <span class="meta-chip" v-if="album.numberOfTracks || album.media?.length">
                {{ album.numberOfTracks || album.media?.length || 0 }} تراک
              </span>
              <span class="tbl__dash" v-else>—</span>
            </td>

            <td>
              <div class="lang-row">
                <span v-if="hasLang(album, 'CKB')" class="lang-dot lang-dot--ckb">CKB</span>
                <span v-if="hasLang(album, 'KMR')" class="lang-dot lang-dot--kmr">KMR</span>
              </div>
            </td>

            <td @click.stop>
              <div class="tbl__acts">
                <button class="act act--view" title="بینین" @click="openDetail(album)">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                </button>
                <RouterLink :to="`/admin/albums/${album.id}/edit`" class="act act--edit" title="دەستکاری">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4z"/></svg>
                </RouterLink>
                <button class="act act--del" title="سڕینەوە" @click="confirmDelete(album)">
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
        <div v-if="delTarget" class="overlay" @click.self="delTarget = null">
          <div class="del-modal">
            <div class="del-modal__ico">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#8C1515" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
            </div>
            <h3 class="del-modal__title">دڵنیای لە سڕینەوە؟</h3>
            <p class="del-modal__body">ئەڵبوومی <strong>«{{ albumTitle(delTarget) }}»</strong><br/>بە تەواوی سڕاوەتەوە و ناگەڕێتەوە.</p>
            <div class="del-modal__acts">
              <button class="btn btn--ghost" @click="delTarget = null">نەخێر</button>
              <button class="btn btn--danger" :disabled="deleting" @click="doDelete">
                <span v-if="deleting" class="spinner"></span>
                {{ deleting ? '…' : 'بەڵێ، بیسڕەوە' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ══ DETAIL MODAL ══ -->
    <Teleport to="body">
      <Transition name="pdm-fade">
        <div v-if="detailAlbum" class="pdm-overlay" @click.self="closeDetail" @keydown.esc="closeDetail">
          <Transition name="pdm-rise" appear>
            <div v-if="detailAlbum" class="pdm" role="dialog" :aria-label="albumTitle(detailAlbum)">

              <button class="pdm-x" @click="closeDetail" aria-label="داخستن">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>

              <!-- ════ LEFT — VISUAL PANEL ════ -->
              <div class="pdm-media">

                <!-- Cover image area -->
                <div class="pdm-stage">
                  <template v-if="activeCover">
                    <div class="pdm-stage__image-wrap">
                      <img :src="activeCover" :key="activeCover" class="pdm-stage__image" :alt="albumTitle(detailAlbum)" />
                    </div>
                  </template>
                  <div v-else class="pdm-media__empty">
                    <div class="pdm-media__empty-icon">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
                    </div>
                    <span>کڤەر نییە</span>
                  </div>
                </div>

                <!-- Cover switcher tabs -->
                <div class="pdm-thumbs" v-if="multipleCovers">
                  <button
                    v-if="detailAlbum.coverUrlCkb"
                    class="pdm-thumb pdm-thumb--label"
                    :class="{ 'pdm-thumb--on': activeCoverKey === 'ckb' }"
                    @click="activeCoverKey = 'ckb'"
                  >
                    <img :src="detailAlbum.coverUrlCkb" loading="lazy" />
                    <span class="pdm-thumb__bar" v-if="activeCoverKey === 'ckb'"></span>
                  </button>
                  <button
                    v-if="detailAlbum.coverUrlKmr"
                    class="pdm-thumb pdm-thumb--label"
                    :class="{ 'pdm-thumb--on': activeCoverKey === 'kmr' }"
                    @click="activeCoverKey = 'kmr'"
                  >
                    <img :src="detailAlbum.coverUrlKmr" loading="lazy" />
                    <span class="pdm-thumb__bar" v-if="activeCoverKey === 'kmr'"></span>
                  </button>
                  <button
                    v-if="detailAlbum.hoverUrl"
                    class="pdm-thumb pdm-thumb--label"
                    :class="{ 'pdm-thumb--on': activeCoverKey === 'hover' }"
                    @click="activeCoverKey = 'hover'"
                  >
                    <img :src="detailAlbum.hoverUrl" loading="lazy" />
                    <span class="pdm-thumb__bar" v-if="activeCoverKey === 'hover'"></span>
                  </button>
                </div>

                <!-- Track list -->
                <div class="pdm-tracks" v-if="detailAlbum.media && detailAlbum.media.length">
                  <div class="pdm-tracks__head">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>
                    تراکەکان ({{ detailAlbum.media.length }})
                  </div>
                  <div
                    class="pdm-track"
                    v-for="t in detailAlbum.media" :key="t.id"
                    :class="{ 'pdm-track--active': activeTrackIdx === t.trackNumber }"
                    @click="playTrack(t)"
                  >
                    <span class="pdm-track__num">{{ t.trackNumber || '—' }}</span>
                    <div class="pdm-track__info">
                      <span class="pdm-track__title">{{ (detailLang === 'CKB' ? t.trackTitleCkb : t.trackTitleKmr) || '—' }}</span>
                      <span class="pdm-track__dur" v-if="t.durationSeconds">{{ fmtDuration(t.durationSeconds) }}</span>
                    </div>
                    <div class="pdm-track__src" :class="trackSrcClass(t)"></div>
                    <!-- Playing animation -->
                    <div class="pdm-track__playing" v-if="activeTrackIdx === t.trackNumber">
                      <span></span><span></span><span></span>
                    </div>
                  </div>

                  <!-- VIDEO: embed iframe -->
                  <div class="pdm-player pdm-player--embed" v-if="detailAlbum.albumType === 'VIDEO' && currentTrackEmbed">
                    <iframe :src="currentTrackEmbed" :key="currentTrackEmbed" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                  </div>
                  <!-- VIDEO: direct file -->
                  <div class="pdm-player pdm-player--video" v-else-if="detailAlbum.albumType === 'VIDEO' && currentTrackUrl">
                    <video :src="currentTrackUrl" :key="currentTrackUrl" controls controlsList="nodownload" preload="metadata" class="pdm-player__video"></video>
                  </div>
                  <!-- AUDIO: direct file -->
                  <div class="pdm-player" v-else-if="detailAlbum.albumType === 'AUDIO' && currentTrackUrl">
                    <audio :src="currentTrackUrl" :key="currentTrackUrl" controls controlsList="nodownload" preload="metadata" class="pdm-player__audio"></audio>
                  </div>
                  <!-- AUDIO: embed -->
                  <div class="pdm-player pdm-player--embed" v-else-if="detailAlbum.albumType === 'AUDIO' && currentTrackEmbed">
                    <iframe :src="currentTrackEmbed" :key="currentTrackEmbed" frameborder="0" allowfullscreen></iframe>
                  </div>
                </div>

                <!-- Attachment -->
                <div class="pdm-attach" v-if="detailAlbum.attachment">
                  <div class="pdm-attach__lbl">پاوانتەکە</div>
                  <a v-if="detailAlbum.attachment.url" :href="detailAlbum.attachment.url" target="_blank" class="pdm-attach__link">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    {{ detailAlbum.attachment.type?.toUpperCase() || 'فایل' }} داگرتن
                  </a>
                  <a v-else-if="detailAlbum.attachment.externalUrl" :href="detailAlbum.attachment.externalUrl" target="_blank" class="pdm-attach__link">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                    بەستەری دەرەکی
                  </a>
                </div>

              </div><!-- /pdm-media -->

              <!-- ════ RIGHT — INFO PANEL ════ -->
              <div class="pdm-info">
                <div class="pdm-info__head">
                  <div class="pdm-info__head-meta">
                    <span class="pdm-id-tag"># {{ detailAlbum.id }}</span>
                    <span class="pdm-type-badge" :class="detailAlbum.albumType === 'AUDIO' ? 'pdm-type-badge--audio' : 'pdm-type-badge--video'">
                      <span class="pdm-type-badge__dot"></span>
                      {{ detailAlbum.albumType === 'AUDIO' ? 'دەنگ' : 'ڤیدیۆ' }}
                    </span>
                    <span class="pdm-year-tag" v-if="detailAlbum.yearOfPublishment">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                      {{ detailAlbum.yearOfPublishment }}
                    </span>
                  </div>

                  <h2 class="pdm-title">{{ albumTitle(detailAlbum) }}</h2>
                  <p class="pdm-subtitle" v-if="albumSubTitle(detailAlbum)">{{ albumSubTitle(detailAlbum) }}</p>
                  <p class="pdm-loc" v-if="albumLocation(detailAlbum)">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    {{ albumLocation(detailAlbum) }}
                  </p>

                  <div class="pdm-langs">
                    <span v-for="l in (detailAlbum.contentLanguages || [])" :key="l" class="pdm-lang" :class="`pdm-lang--${l.toLowerCase()}`">
                      {{ l === 'CKB' ? 'سۆرانی' : 'کورمانجی' }}
                    </span>
                  </div>

                  <RouterLink class="pdm-edit-btn" :to="`/admin/albums/${detailAlbum.id}/edit`" @click="closeDetail">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4z"/></svg>
                    دەستکاری ئەڵبووم
                  </RouterLink>
                </div>

                <!-- Lang tabs (shown only when multilingual) -->
                <div class="pdm-tabs" v-if="detailAlbum.contentLanguages?.length > 1">
                  <button v-for="l in detailAlbum.contentLanguages" :key="l" class="pdm-tab" :class="{ 'pdm-tab--on': detailLang === l }" @click="detailLang = l">
                    <span class="pdm-tab__pip" :class="`pdm-tab__pip--${l.toLowerCase()}`"></span>
                    {{ l === 'CKB' ? 'سۆرانی' : 'کورمانجی' }}
                  </button>
                </div>

                <div class="pdm-info__body">

                  <!-- Description accordion -->
                  <div class="acc" v-if="activeDescription">
                    <button class="acc__hd" @click="toggleAcc('desc')">
                      <span class="acc__hd-left">
                        <span class="acc__ico acc__ico--desc"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="14 2 14 8 20 8"/></svg></span>
                        <span class="acc__title">وەسف</span>
                      </span>
                      <svg class="acc__chevron" :class="{ 'acc__chevron--open': openAccordions.has('desc') }" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M6 9l6 6 6-6"/></svg>
                    </button>
                    <Transition name="acc-body">
                      <div v-if="openAccordions.has('desc')" class="acc__body">
                        <p class="acc__text acc__text--desc">{{ activeDescription }}</p>
                      </div>
                    </Transition>
                  </div>

                  <!-- Metadata accordion -->
                  <div class="acc">
                    <button class="acc__hd" @click="toggleAcc('meta')">
                      <span class="acc__hd-left">
                        <span class="acc__ico acc__ico--meta"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg></span>
                        <span class="acc__title">زانیاری گشتی</span>
                      </span>
                      <svg class="acc__chevron" :class="{ 'acc__chevron--open': openAccordions.has('meta') }" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M6 9l6 6 6-6"/></svg>
                    </button>
                    <Transition name="acc-body">
                      <div v-if="openAccordions.has('meta')" class="acc__body acc__body--flush">
                        <div class="acc__sys-grid">
                          <div class="acc__sys-cell" v-if="detailAlbum.albumType">
                            <div class="acc__sys-k">جۆر</div>
                            <div class="acc__sys-v">{{ detailAlbum.albumType === 'AUDIO' ? 'دەنگ' : 'ڤیدیۆ' }}</div>
                          </div>
                          <div class="acc__sys-cell" v-if="detailAlbum.yearOfPublishment">
                            <div class="acc__sys-k">ساڵی بڵاوکردنەوە</div>
                            <div class="acc__sys-v">{{ detailAlbum.yearOfPublishment }}</div>
                          </div>
                          <div class="acc__sys-cell" v-if="detailAlbum.fileFormat">
                            <div class="acc__sys-k">فۆرماتی فایل</div>
                            <div class="acc__sys-v">{{ detailAlbum.fileFormat?.toUpperCase() }}</div>
                          </div>
                          <div class="acc__sys-cell" v-if="detailAlbum.cdNumber">
                            <div class="acc__sys-k">ژمارەی CD</div>
                            <div class="acc__sys-v">{{ detailAlbum.cdNumber }}</div>
                          </div>
                          <div class="acc__sys-cell" v-if="detailAlbum.numberOfTracks">
                            <div class="acc__sys-k">ژمارەی تراک</div>
                            <div class="acc__sys-v">{{ detailAlbum.numberOfTracks }}</div>
                          </div>
                        </div>
                      </div>
                    </Transition>
                  </div>

                  <!-- Tags accordion -->
                  <div class="acc" v-if="currentTags.length">
                    <button class="acc__hd" @click="toggleAcc('tags')">
                      <span class="acc__hd-left">
                        <span class="acc__ico acc__ico--tag"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg></span>
                        <span class="acc__title">تاگەکان</span>
                        <span class="acc__badge acc__badge--tag">{{ currentTags.length }}</span>
                      </span>
                      <svg class="acc__chevron" :class="{ 'acc__chevron--open': openAccordions.has('tags') }" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M6 9l6 6 6-6"/></svg>
                    </button>
                    <Transition name="acc-body">
                      <div v-if="openAccordions.has('tags')" class="acc__body">
                        <div class="acc__chips">
                          <span v-for="t in currentTags" :key="t" class="acc__chip acc__chip--tag">
                            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/></svg>
                            {{ t }}
                          </span>
                        </div>
                      </div>
                    </Transition>
                  </div>

                  <!-- Keywords accordion -->
                  <div class="acc" v-if="currentKeywords.length">
                    <button class="acc__hd" @click="toggleAcc('kw')">
                      <span class="acc__hd-left">
                        <span class="acc__ico acc__ico--kw"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg></span>
                        <span class="acc__title">کیووەردەکان</span>
                        <span class="acc__badge acc__badge--kw">{{ currentKeywords.length }}</span>
                      </span>
                      <svg class="acc__chevron" :class="{ 'acc__chevron--open': openAccordions.has('kw') }" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M6 9l6 6 6-6"/></svg>
                    </button>
                    <Transition name="acc-body">
                      <div v-if="openAccordions.has('kw')" class="acc__body">
                        <div class="acc__chips">
                          <span v-for="k in currentKeywords" :key="k" class="acc__chip acc__chip--kw">{{ k }}</span>
                        </div>
                      </div>
                    </Transition>
                  </div>

                  <!-- System info accordion -->
                  <div class="acc acc--system">
                    <button class="acc__hd acc__hd--system" @click="toggleAcc('sys')">
                      <span class="acc__hd-left">
                        <span class="acc__ico acc__ico--sys"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg></span>
                        <span class="acc__title">زانیاری سیستەم</span>
                      </span>
                      <svg class="acc__chevron" :class="{ 'acc__chevron--open': openAccordions.has('sys') }" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M6 9l6 6 6-6"/></svg>
                    </button>
                    <Transition name="acc-body">
                      <div v-if="openAccordions.has('sys')" class="acc__body acc__body--flush">
                        <div class="acc__sys-grid">
                          <div class="acc__sys-cell acc__sys-cell--full">
                            <div class="acc__sys-k">شناسەی یەکتا (ID)</div>
                            <div class="acc__sys-v acc__sys-v--mono">{{ detailAlbum.id }}</div>
                          </div>
                          <div class="acc__sys-cell" v-if="detailAlbum.createdAt">
                            <div class="acc__sys-k">دروستکراوە لە</div>
                            <div class="acc__sys-v">{{ fmtDatetime(detailAlbum.createdAt) }}</div>
                          </div>
                          <div class="acc__sys-cell" v-if="detailAlbum.updatedAt">
                            <div class="acc__sys-k">دواین نوێکردنەوە</div>
                            <div class="acc__sys-v">{{ fmtDatetime(detailAlbum.updatedAt) }}</div>
                          </div>
                          <div class="acc__sys-cell" v-if="detailAlbum.auditLogCount">
                            <div class="acc__sys-k">تۆمارەکانی گۆڕانکاری</div>
                            <div class="acc__sys-v">{{ detailAlbum.auditLogCount }}</div>
                          </div>
                        </div>
                      </div>
                    </Transition>
                  </div>

                </div><!-- /pdm-info__body -->
              </div><!-- /pdm-info -->

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

// ── State ──────────────────────────────────────────────────────────────────────
const loading           = ref(false)
const error             = ref('')
const items             = ref([])
const filtered          = ref([])
const searchQ           = ref('')
const filterLang        = ref('')
const filterType        = ref('')
const searchTimer       = ref(null)
const toast             = ref({ show: false, type: 'success', msg: '' })
const toastTimer        = ref(null)
const delTarget         = ref(null)
const deleting          = ref(false)
const detailAlbum       = ref(null)
const detailLang        = ref('CKB')
const activeCoverKey    = ref('ckb')
const activeTrackIdx    = ref(null)
const currentTrackUrl   = ref('')
const currentTrackEmbed = ref('')
const openAccordions    = ref(new Set(['desc']))
const detailOverlayEl   = ref(null)

/* ── helpers: generic ───────────────────────────────────────────────────────── */
const ensureArray = (v) => Array.isArray(v) ? v : []

/* ── helpers: links/embed (YouTube iframe/link fix) ─────────────────────────── */
const decodeHtmlEntities = (str = '') =>
  String(str)
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')

const extractIframeSrc = (value = '') => {
  const s = String(value || '').trim()
  if (!s) return ''

  // If pasted full iframe HTML
  if (/<iframe[\s\S]*?>/i.test(s)) {
    const m = s.match(/src\s*=\s*["']([^"']+)["']/i)
    return m ? decodeHtmlEntities(m[1]) : ''
  }

  return decodeHtmlEntities(s)
}

const parseYouTubeTimeToSeconds = (t = '') => {
  const s = String(t || '').trim().toLowerCase()
  if (!s) return 0
  if (/^\d+$/.test(s)) return Number(s)

  const m = s.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/)
  if (!m) return 0

  const h = Number(m[1] || 0)
  const min = Number(m[2] || 0)
  const sec = Number(m[3] || 0)
  return h * 3600 + min * 60 + sec
}

const isYouTubeUrl = (url = '') => {
  const u = String(url || '').toLowerCase()
  return (
    u.includes('youtube.com') ||
    u.includes('youtu.be') ||
    u.includes('youtube-nocookie.com')
  )
}

const toYouTubeEmbedUrl = (input = '') => {
  const raw = extractIframeSrc(input)
  if (!raw) return ''

  try {
    const url = new URL(raw)
    const host = url.hostname.toLowerCase()

    // already embed
    if (
      (host.includes('youtube.com') || host.includes('youtube-nocookie.com')) &&
      url.pathname.startsWith('/embed/')
    ) {
      return url.toString()
    }

    let videoId = ''

    if (host.includes('youtu.be')) {
      videoId = url.pathname.replace(/^\/+/, '').split('/')[0] || ''
    }

    if (!videoId && url.pathname === '/watch') {
      videoId = url.searchParams.get('v') || ''
    }

    if (!videoId && url.pathname.startsWith('/shorts/')) {
      videoId = url.pathname.split('/')[2] || ''
    }

    if (!videoId && url.pathname.startsWith('/live/')) {
      videoId = url.pathname.split('/')[2] || ''
    }

    if (!videoId) return raw

    const embed = new URL(`https://www.youtube.com/embed/${videoId}`)

    const start = url.searchParams.get('start')
    const t = url.searchParams.get('t')
    const si = url.searchParams.get('si')

    if (start) {
      embed.searchParams.set('start', start)
    } else if (t) {
      const sec = parseYouTubeTimeToSeconds(t)
      if (sec > 0) embed.searchParams.set('start', String(sec))
    }

    if (si) embed.searchParams.set('si', si)

    return embed.toString()
  } catch {
    return raw
  }
}

/* ── normalize album + tracks ───────────────────────────────────────────────── */
const normalizeTrack = (t = {}, idx = 0) => {
  const out = { ...t }

  // common aliases (in case backend names vary)
  out.trackNumber = out.trackNumber ?? out.orderIndex ?? out.sortOrder ?? (idx + 1)
  out.title = out.title || out.name || out.ckbTitle || out.kmrTitle || `Track ${out.trackNumber}`

  const rawUrl = out.url || out.fileUrl || out.audioUrl || ''
  const rawEmbed = out.embedUrl || out.embed || ''
  const rawExternal = out.externalUrl || out.link || ''

  const candidate = extractIframeSrc(rawEmbed || rawExternal || rawUrl)

  // normalize embed content (especially pasted iframe)
  if (candidate && isYouTubeUrl(candidate)) {
    out.embedUrl = toYouTubeEmbedUrl(candidate)
    out.externalUrl = candidate
    // if raw url was iframe string, don't use it as file audio src
    if (/<iframe/i.test(String(rawUrl || ''))) {
      out.url = ''
    } else {
      out.url = rawUrl || ''
    }
  } else {
    out.url = rawUrl || ''
    out.embedUrl = extractIframeSrc(rawEmbed) || ''
    out.externalUrl = rawExternal || ''
  }

  return out
}

const normalizeAlbum = (a = {}) => {
  const out = { ...a }

  // normalize possible wrappers/names
  out.coverUrlCkb = out.coverUrlCkb || out.ckbCoverUrl || ''
  out.coverUrlKmr = out.coverUrlKmr || out.kmrCoverUrl || ''
  out.hoverUrl = out.hoverUrl || out.hoverImageUrl || ''

  if (!out.ckbContent && out.content?.ckb) out.ckbContent = out.content.ckb
  if (!out.kmrContent && out.content?.kmr) out.kmrContent = out.content.kmr

  if (!ensureArray(out.contentLanguages).length) {
    const langs = []
    if (out.ckbContent?.title || out.ckbContent?.description || out.content?.ckb) langs.push('CKB')
    if (out.kmrContent?.title || out.kmrContent?.description || out.content?.kmr) langs.push('KMR')
    out.contentLanguages = langs
  }

  // tracks aliases
  const rawTracks = ensureArray(
    out.tracks?.length ? out.tracks :
    out.soundTracks?.length ? out.soundTracks :
    out.items?.length ? out.items :
    []
  )
  out.tracks = rawTracks.map((t, i) => normalizeTrack(t, i))

  // normalize multilingual tags/keywords shape
  out.tags = out.tags || { ckb: out.tagsCkb || [], kmr: out.tagsKmr || [] }
  out.keywords = out.keywords || { ckb: out.keywordsCkb || [], kmr: out.keywordsKmr || [] }

  return out
}

// ── Fetch ──────────────────────────────────────────────────────────────────────
const loadAlbums = async () => {
  loading.value = true
  error.value   = ''
  try {
    const { data } = await api.get('/api/v1/albums')
    const payload = Array.isArray(data)
      ? data
      : (data?.content ?? data?.data ?? data?.result ?? [])

    items.value = ensureArray(payload).map(normalizeAlbum)
    applyFilters()
  } catch (e) {
    error.value = e?.response?.data?.message || e.message || 'هەڵەیەک ڕوویدا'
  } finally {
    loading.value = false
  }
}

// ── Search + Filter ────────────────────────────────────────────────────────────
const onSearch = () => {
  clearTimeout(searchTimer.value)
  searchTimer.value = setTimeout(applyFilters, 400)
}

const clearSearch = () => {
  searchQ.value = ''
  applyFilters()
}

const applyFilters = () => {
  let list = [...items.value]

  if (filterType.value) {
    list = list.filter(a => a.albumType === filterType.value)
  }

  if (filterLang.value) {
    list = list.filter(a => ensureArray(a.contentLanguages).includes(filterLang.value))
  }

  if (searchQ.value.trim()) {
    const q = searchQ.value.toLowerCase()

    list = list.filter(a => {
      const searchFields = [
        a.ckbContent?.title,
        a.kmrContent?.title,
        a.ckbContent?.location,
        a.kmrContent?.location,
        ...(a.tags?.ckb || []),
        ...(a.tags?.kmr || []),
        ...(a.keywords?.ckb || []),
        ...(a.keywords?.kmr || []),
        ...(a.tracks || []).map(t => t?.title || ''),
        ...(a.tracks || []).map(t => t?.caption || ''),
        String(a.yearOfPublishment || a.publishYear || '')
      ]

      return searchFields.some(s => String(s || '').toLowerCase().includes(q))
    })
  }

  filtered.value = list
}

// ── Helpers ────────────────────────────────────────────────────────────────────
const albumTitle    = (a) => a?.ckbContent?.title || a?.kmrContent?.title || `ئەڵبووم #${a?.id}`
const albumSubTitle = (a) => (a?.ckbContent?.title && a?.kmrContent?.title) ? a.kmrContent.title : ''
const albumLocation = (a) => a?.ckbContent?.location || a?.kmrContent?.location || ''
const coverSrc      = (a) => a?.coverUrlCkb || a?.coverUrlKmr || a?.hoverUrl || ''
const hasLang       = (a, l) => ensureArray(a?.contentLanguages).includes(l)

// ── Detail modal ───────────────────────────────────────────────────────────────
const openDetail = async (album) => {
  const normalized = normalizeAlbum(album)

  detailAlbum.value    = normalized
  detailLang.value     = normalized.contentLanguages?.includes('CKB')
    ? 'CKB'
    : (normalized.contentLanguages?.[0] || 'CKB')

  activeCoverKey.value = normalized.coverUrlCkb
    ? 'ckb'
    : (normalized.coverUrlKmr ? 'kmr' : 'hover')

  activeTrackIdx.value    = null
  currentTrackUrl.value   = ''
  currentTrackEmbed.value = ''
  openAccordions.value    = new Set(['desc'])

  document.body.style.overflow = 'hidden'

  const bg = coverSrc(normalized)
  if (bg) document.documentElement.style.setProperty('--cover-bg', `url("${bg}")`)

  await nextTick()
  detailOverlayEl.value?.focus?.()
}

const closeDetail = () => {
  detailAlbum.value = null
  activeTrackIdx.value = null
  currentTrackUrl.value = ''
  currentTrackEmbed.value = ''
  document.body.style.overflow = ''
  document.documentElement.style.removeProperty('--cover-bg')
}

const onGlobalKeydown = (e) => {
  if (e.key === 'Escape' && detailAlbum.value) closeDetail()
}

watch(detailAlbum, (v) => {
  if (v) {
    window.addEventListener('keydown', onGlobalKeydown)
  } else {
    window.removeEventListener('keydown', onGlobalKeydown)
  }
})

const activeCover = computed(() => {
  const a = detailAlbum.value
  if (!a) return ''
  if (activeCoverKey.value === 'ckb'   && a.coverUrlCkb) return a.coverUrlCkb
  if (activeCoverKey.value === 'kmr'   && a.coverUrlKmr) return a.coverUrlKmr
  if (activeCoverKey.value === 'hover' && a.hoverUrl)    return a.hoverUrl
  return a.coverUrlCkb || a.coverUrlKmr || a.hoverUrl || ''
})

const multipleCovers = computed(() => {
  const a = detailAlbum.value
  if (!a) return false
  return [a.coverUrlCkb, a.coverUrlKmr, a.hoverUrl].filter(Boolean).length > 1
})

const activeDescription = computed(() => {
  const a = detailAlbum.value
  if (!a) return ''
  return detailLang.value === 'CKB'
    ? (a.ckbContent?.description || '')
    : (a.kmrContent?.description || '')
})

const currentTags = computed(() => {
  const a = detailAlbum.value
  if (!a) return []
  const raw = detailLang.value === 'CKB' ? (a.tags?.ckb || []) : (a.tags?.kmr || [])
  return ensureArray(raw)
})

const currentKeywords = computed(() => {
  const a = detailAlbum.value
  if (!a) return []
  const raw = detailLang.value === 'CKB' ? (a.keywords?.ckb || []) : (a.keywords?.kmr || [])
  return ensureArray(raw)
})

const toggleAcc = (key) => {
  const s = new Set(openAccordions.value)
  s.has(key) ? s.delete(key) : s.add(key)
  openAccordions.value = s
}

// ── Track player ───────────────────────────────────────────────────────────────
const playTrack = (t) => {
  const track = normalizeTrack(t)

  if (activeTrackIdx.value === track.trackNumber) {
    activeTrackIdx.value    = null
    currentTrackUrl.value   = ''
    currentTrackEmbed.value = ''
    return
  }

  activeTrackIdx.value = track.trackNumber

  // priority: file audio > embed > external youtube/embed
  if (track.url) {
    currentTrackUrl.value   = track.url
    currentTrackEmbed.value = ''
    return
  }

  if (track.embedUrl) {
    currentTrackEmbed.value = track.embedUrl
    currentTrackUrl.value   = ''
    return
  }

  if (track.externalUrl && isYouTubeUrl(track.externalUrl)) {
    currentTrackEmbed.value = toYouTubeEmbedUrl(track.externalUrl)
    currentTrackUrl.value   = ''
    return
  }

  currentTrackUrl.value   = ''
  currentTrackEmbed.value = ''
}

const trackSrcClass = (t) => {
  const track = normalizeTrack(t)
  if (track.url)         return 'pdm-track__src--file'
  if (track.embedUrl)    return 'pdm-track__src--embed'
  if (track.externalUrl) return 'pdm-track__src--ext'
  return ''
}

// ── Delete ─────────────────────────────────────────────────────────────────────
const confirmDelete = (album) => { delTarget.value = album }

const doDelete = async () => {
  if (!delTarget.value) return
  deleting.value = true

  const deletingId = delTarget.value.id

  try {
    await api.delete(`/api/v1/albums/${deletingId}`)
    items.value = items.value.filter(a => a.id !== deletingId)
    applyFilters()

    if (detailAlbum.value?.id === deletingId) closeDetail()

    showToast('success', 'ئەڵبووم سڕایەوە ✓')
    delTarget.value = null
  } catch (e) {
    showToast('error', e?.response?.data?.message || 'سڕینەوە سەرنەکەوت')
  } finally {
    deleting.value = false
  }
}

// ── Formatters ─────────────────────────────────────────────────────────────────
const fmtDuration = (sec) => {
  if (!sec && sec !== 0) return ''
  const n = Number(sec)
  if (!Number.isFinite(n) || n < 0) return ''

  const h = Math.floor(n / 3600)
  const m = Math.floor((n % 3600) / 60)
  const s = Math.floor(n % 60)

  return h > 0
    ? `${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`
    : `${m}:${String(s).padStart(2,'0')}`
}

const fmtDatetime = (d) => {
  if (!d) return '—'
  return new Date(d).toLocaleString('ar-IQ', {
    year:'numeric',
    month:'short',
    day:'numeric',
    hour:'2-digit',
    minute:'2-digit'
  })
}

const showToast = (type, msg) => {
  clearTimeout(toastTimer.value)
  toast.value = { show: true, type, msg }
  toastTimer.value = setTimeout(() => {
    toast.value.show = false
  }, 3500)
}

onMounted(loadAlbums)

onBeforeUnmount(() => {
  clearTimeout(searchTimer.value)
  clearTimeout(toastTimer.value)
  document.body.style.overflow = ''
  document.documentElement.style.removeProperty('--cover-bg')
  window.removeEventListener('keydown', onGlobalKeydown)
})
</script>

<style scoped>
/* ── Base ────────────────────────────────────────────────────────── */
.aml { direction:rtl; max-width:1400px; margin:0 auto; }
.aml__head { display:flex; align-items:center; justify-content:space-between; margin-bottom:1.5rem; gap:1rem; flex-wrap:wrap; }
.aml__title { font-size:1.55rem; font-weight:700; color:var(--text); }
.aml__sub { color:var(--muted); font-size:.83rem; margin-top:.2rem; }

/* ── Buttons ─────────────────────────────────────────────────────── */
.btn { display:inline-flex; align-items:center; gap:.45rem; padding:.65rem 1.1rem; border-radius:var(--radius-sm); font-weight:700; font-size:.87rem; cursor:pointer; border:1px solid transparent; transition:var(--transition); text-decoration:none; white-space:nowrap; font-family:inherit; }
.btn--primary { background:var(--crimson); color:#fff; box-shadow:0 6px 20px rgba(140,21,21,.22); }
.btn--primary:hover { background:var(--crimson-lt); transform:translateY(-1px); }
.btn--ghost { background:transparent; border-color:var(--border); color:var(--text); }
.btn--ghost:hover { border-color:var(--crimson); color:var(--crimson); }
.btn--danger { background:#c0392b; color:#fff; border-color:#c0392b; }
.btn--danger:hover { background:#a93226; }
.btn--sm { padding:.45rem .85rem; font-size:.82rem; }
.btn:disabled { opacity:.5; cursor:not-allowed; transform:none!important; }

/* ── Toast ───────────────────────────────────────────────────────── */
.toast { display:flex; align-items:center; gap:.65rem; padding:.75rem 1.1rem; border-radius:var(--radius-sm); font-weight:600; font-size:.87rem; margin-bottom:1rem; }
.toast--success { background:rgba(22,120,70,.09); border:1px solid rgba(22,120,70,.22); color:#166044; }
.toast--error   { background:rgba(140,21,21,.07); border:1px solid rgba(140,21,21,.18); color:var(--crimson); }

/* ── Toolbar ─────────────────────────────────────────────────────── */
.aml__toolbar { display:flex; gap:.75rem; margin-bottom:1.25rem; flex-wrap:wrap; align-items:center; }
.search-wrap { flex:1; min-width:200px; position:relative; display:flex; align-items:center; }
.search-ico { position:absolute; right:.85rem; color:var(--muted); pointer-events:none; }
.search-inp { width:100%; padding:.65rem 2.3rem .65rem 2.5rem; border:1.5px solid var(--border); border-radius:var(--radius-sm); background:var(--white); color:var(--text); font-size:.9rem; outline:none; transition:var(--transition); font-family:inherit; }
.search-inp:focus { border-color:var(--crimson); box-shadow:0 0 0 3px rgba(140,21,21,.1); }
.search-clear { position:absolute; left:.7rem; background:var(--cream-dk); border:1px solid var(--border); border-radius:50%; width:20px; height:20px; display:flex; align-items:center; justify-content:center; cursor:pointer; color:var(--muted); transition:var(--transition); padding:0; }
.search-clear:hover { background:var(--crimson); border-color:var(--crimson); color:#fff; }
.sel { padding:.65rem .9rem; border:1.5px solid var(--border); border-radius:var(--radius-sm); background:var(--white); color:var(--text); font-size:.87rem; outline:none; cursor:pointer; transition:var(--transition); font-family:inherit; }
.sel:focus { border-color:var(--crimson); }
.aml__count { font-size:.83rem; color:var(--muted); display:flex; align-items:center; gap:.4rem; }
.count-badge { display:inline-flex; padding:.18rem .6rem; border-radius:99px; font-weight:700; font-size:.77rem; background:rgba(140,21,21,.08); color:var(--crimson); border:1px solid rgba(140,21,21,.16); }

/* ── Skeletons ───────────────────────────────────────────────────── */
.skel { border-radius:6px; background:linear-gradient(90deg,var(--cream-dk) 25%,#eae8e4 50%,var(--cream-dk) 75%); background-size:200% 100%; animation:shimmer 1.4s ease infinite; }
.skel--cover   { width:48px; height:36px; }
.skel--title   { width:70%; height:14px; margin-bottom:6px; }
.skel--sub     { width:45%; height:11px; }
.skel--pill    { width:60px; height:22px; border-radius:99px; }
.skel--chip    { width:50px; height:22px; border-radius:6px; }
.skel--actions { width:90px; height:28px; border-radius:8px; }
.skel-row { animation:row-fade .5s ease both; }
@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
@keyframes row-fade { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:none} }

/* ── State boxes ─────────────────────────────────────────────────── */
.state-box { display:flex; flex-direction:column; align-items:center; gap:.85rem; padding:4rem 2rem; color:var(--muted); text-align:center; background:var(--white); border:1px solid var(--border); border-radius:var(--radius-md); font-size:.9rem; }
.state-box--err { color:var(--crimson); }
.state-box__ico { width:58px; height:58px; border-radius:50%; background:var(--cream-dk); border:1px solid var(--border); display:flex; align-items:center; justify-content:center; }

/* ── Table ───────────────────────────────────────────────────────── */
.table-meta { font-size:.8rem; color:var(--muted); padding:.6rem .9rem; background:var(--cream-dk); border-bottom:1px solid var(--border); }
.tbl-wrap { background:var(--white); border:1px solid var(--border); border-radius:var(--radius-md); overflow:hidden; box-shadow:var(--shadow-sm); }
.tbl { width:100%; border-collapse:collapse; font-size:.87rem; }
.tbl thead tr { background:var(--cream-dk); border-bottom:2px solid var(--border); }
.tbl th { padding:.8rem .9rem; text-align:right; font-weight:700; color:var(--text); font-size:.79rem; white-space:nowrap; }
.tbl-row { border-bottom:1px solid var(--cream-dk); cursor:pointer; transition:background var(--transition); animation:row-fade .4s ease both; }
.tbl-row:hover { background:rgba(140,21,21,.03); }
.tbl-row:last-child { border-bottom:none; }
.tbl td { padding:.72rem .9rem; vertical-align:middle; }
.tbl__name { font-weight:600; color:var(--text); line-height:1.3; }
.tbl__name--sub { font-weight:500; color:var(--muted); font-size:.84rem; margin-top:.1rem; }
.tbl__loc { display:flex; align-items:center; gap:.3rem; font-size:.75rem; color:var(--muted); margin-top:.2rem; }
.tbl__dash { color:var(--border); }

.cover-wrap { width:50px; height:38px; border-radius:8px; overflow:hidden; border:1px solid var(--border); }
.cover-img { width:100%; height:100%; object-fit:cover; display:block; }
.cover-empty { width:50px; height:38px; border-radius:8px; border:1px dashed var(--border); display:flex; align-items:center; justify-content:center; color:var(--border); }

.pill { display:inline-flex; align-items:center; gap:.35rem; padding:.25rem .65rem; border-radius:99px; font-size:.74rem; font-weight:700; white-space:nowrap; }
.pill__dot { width:7px; height:7px; border-radius:50%; flex-shrink:0; }
.pill--audio { background:rgba(130,60,200,.1); color:#6b2fa0; border:1px solid rgba(130,60,200,.25); }
.pill--audio .pill__dot { background:#7d3bbd; box-shadow:0 0 5px rgba(130,60,200,.5); }
.pill--video { background:rgba(220,50,50,.09); color:#b03020; border:1px solid rgba(220,50,50,.22); }
.pill--video .pill__dot { background:#c0392b; box-shadow:0 0 5px rgba(220,50,50,.5); }

.meta-chip { display:inline-flex; padding:.22rem .62rem; border-radius:7px; font-size:.78rem; font-weight:600; background:var(--cream-dk); color:var(--muted); border:1px solid var(--border); }

.lang-dot { display:inline-flex; padding:.18rem .5rem; border-radius:6px; font-size:.72rem; font-weight:700; }
.lang-dot--ckb { background:rgba(254,221,0,.2); color:#806e00; border:1px solid rgba(254,221,0,.4); }
.lang-dot--kmr { background:rgba(30,90,200,.1); color:#1a47a0; border:1px solid rgba(30,90,200,.2); }
.lang-row { display:flex; gap:.3rem; flex-wrap:wrap; }

.tbl__acts { display:flex; gap:.35rem; }
.act { width:30px; height:30px; border-radius:8px; border:1px solid var(--border); background:var(--cream); color:var(--muted); cursor:pointer; text-decoration:none; display:inline-flex; align-items:center; justify-content:center; transition:var(--transition); }
.act--view:hover { background:rgba(30,90,200,.08); border-color:rgba(30,90,200,.28); color:#1a47a0; }
.act--edit:hover { background:rgba(30,150,80,.08); border-color:rgba(30,150,80,.28); color:#166044; }
.act--del:hover  { background:rgba(140,21,21,.08); border-color:rgba(140,21,21,.25); color:var(--crimson); }

/* ── Delete modal ────────────────────────────────────────────────── */
.overlay { position:fixed; inset:0; z-index:200; background:rgba(20,10,10,.5); display:flex; align-items:center; justify-content:center; padding:1rem; }
.del-modal { background:var(--white); border-radius:var(--radius-lg); padding:2rem; max-width:400px; width:100%; box-shadow:0 30px 80px rgba(0,0,0,.25); text-align:center; }
.del-modal__ico { width:62px; height:62px; border-radius:50%; background:rgba(140,21,21,.07); border:1px solid rgba(140,21,21,.14); display:flex; align-items:center; justify-content:center; margin:0 auto .85rem; }
.del-modal__title { font-size:1.15rem; font-weight:700; margin-bottom:.5rem; }
.del-modal__body { color:var(--muted); font-size:.9rem; line-height:1.7; margin-bottom:1.5rem; }
.del-modal__acts { display:flex; gap:.75rem; justify-content:center; }

.spinner { width:13px; height:13px; border:2px solid rgba(255,255,255,.35); border-top-color:#fff; border-radius:50%; animation:spin .65s linear infinite; }
@keyframes spin { to { transform:rotate(360deg) } }

/* ── Transitions ─────────────────────────────────────────────────── */
.fade-enter-active,.fade-leave-active { transition:opacity .15s }
.fade-enter-from,.fade-leave-to { opacity:0 }
.slide-down-enter-active,.slide-down-leave-active { transition:.3s ease }
.slide-down-enter-from,.slide-down-leave-to { opacity:0; transform:translateY(-8px) }
.modal-enter-active,.modal-leave-active { transition:.25s ease }
.modal-enter-from,.modal-leave-to { opacity:0 }
.modal-enter-active .del-modal,.modal-leave-active .del-modal { transition:.25s ease }
.modal-enter-from .del-modal,.modal-leave-to .del-modal { transform:scale(.94) translateY(8px) }

/* ═══════════════════════════════════════════════════════════════════════
   DETAIL MODAL — CINEMATIC / IMMERSIVE
═══════════════════════════════════════════════════════════════════════ */

/* Overlay: deep blur + rich vignette */
.pdm-overlay {
  position: fixed; inset: 0; z-index: 400;
  background: rgba(4, 1, 1, .82);
  backdrop-filter: blur(22px) saturate(1.4);
  -webkit-backdrop-filter: blur(22px) saturate(1.4);
  display: flex; align-items: center; justify-content: center;
  padding: 1.25rem; overflow-y: auto;
}

/* Modal shell: much wider + taller, rich layered shadow */
.pdm {
  position: relative; width: 100%;
  max-width: 1340px;
  height: min(92vh, 880px);
  background: #100c0c;
  border-radius: 24px; overflow: hidden;
  display: grid; grid-template-columns: 1fr 500px;
  box-shadow:
    0 0 0 1px rgba(255,255,255,.06),
    0 0 80px rgba(140,21,21,.18),
    0 60px 160px rgba(0,0,0,.9),
    0 12px 40px rgba(0,0,0,.6);
}
@media (max-width: 900px) { .pdm { grid-template-columns: 1fr; height: auto; max-height: none; } }

/* Close button: top-left, glassy */
.pdm-x {
  position: absolute; top: 1.1rem; left: 1.1rem; z-index: 60;
  width: 40px; height: 40px; border-radius: 50%;
  background: rgba(0,0,0,.6);
  border: 1px solid rgba(255,255,255,.13);
  color: rgba(255,255,255,.8); cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: all .25s cubic-bezier(.34,1.56,.64,1);
  backdrop-filter: blur(12px);
  box-shadow: 0 4px 16px rgba(0,0,0,.4);
}
.pdm-x:hover {
  background: rgba(140,21,21,.85);
  border-color: rgba(220,80,80,.5); color: #fff;
  transform: rotate(90deg) scale(1.12);
  box-shadow: 0 0 20px rgba(140,21,21,.5);
}

/* ════ LEFT: MEDIA / VISUAL PANEL ════ */
.pdm-media {
  display: flex; flex-direction: column;
  background: #080506;
  position: relative; overflow: hidden;
}

/* Blurred art backdrop — decorative ambiance layer */
.pdm-media::before {
  content: '';
  position: absolute; inset: -30px; z-index: 0;
  background-image: var(--cover-bg, none);
  background-size: cover; background-position: center;
  filter: blur(40px) saturate(1.8) brightness(.35);
  opacity: .7;
  transition: background-image .6s ease;
}

.pdm-media__empty {
  flex: 1; z-index: 1;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 1rem; color: rgba(255,255,255,.2); font-size: .9rem; padding: 3rem;
}
.pdm-media__empty-icon {
  width: 88px; height: 88px; border-radius: 50%;
  background: rgba(255,255,255,.03);
  border: 1px solid rgba(255,255,255,.07);
  display: flex; align-items: center; justify-content: center;
}

/* Stage: cover art — big, centred, with drop shadow */
.pdm-stage {
  flex: 1; position: relative; z-index: 1;
  display: flex; align-items: center; justify-content: center;
  overflow: hidden; min-height: 340px; padding: 2.5rem;
}
.pdm-stage__image-wrap {
  position: relative;
  display: flex; align-items: center; justify-content: center;
  width: 100%; height: 100%;
}
.pdm-stage__image {
  max-width: 100%; max-height: 480px;
  object-fit: contain; display: block;
  border-radius: 16px;
  box-shadow: 0 32px 80px rgba(0,0,0,.7), 0 8px 24px rgba(0,0,0,.5);
  animation: pdm-img-in .4s cubic-bezier(.22,1,.36,1);
}
@keyframes pdm-img-in { from { opacity:0; transform:scale(.93) translateY(12px) } to { opacity:1; transform:none } }

/* Cover thumb switcher */
.pdm-thumbs {
  flex: 0 0 auto; z-index: 1;
  display: flex; gap: .5rem;
  padding: .75rem 1rem;
  background: rgba(0,0,0,.55);
  border-top: 1px solid rgba(255,255,255,.06);
  overflow-x: auto; scrollbar-width: none;
}
.pdm-thumbs::-webkit-scrollbar { display: none }
.pdm-thumb {
  flex: 0 0 72px; height: 54px; border-radius: 10px; overflow: hidden;
  border: 2px solid transparent;
  background: rgba(255,255,255,.07); cursor: pointer;
  transition: all .22s cubic-bezier(.34,1.56,.64,1);
  display: flex; align-items: center; justify-content: center;
  position: relative; padding: 0;
}
.pdm-thumb:hover { border-color: rgba(255,255,255,.35); transform: translateY(-3px) scale(1.04); }
.pdm-thumb--on {
  border-color: #c0392b !important;
  box-shadow: 0 0 0 1px rgba(192,57,43,.5), 0 4px 16px rgba(140,21,21,.35);
}
.pdm-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
.pdm-thumb__bar {
  position: absolute; bottom: 0; left: 0; right: 0; height: 3px;
  background: linear-gradient(90deg, #8c1515, #e05050);
  border-radius: 0 0 8px 8px;
}

/* Track list */
.pdm-tracks {
  flex: 0 0 auto; z-index: 1;
  background: rgba(0,0,0,.45);
  border-top: 1px solid rgba(255,255,255,.06);
  max-height: 260px; overflow-y: auto;
  scrollbar-width: thin; scrollbar-color: rgba(255,255,255,.1) transparent;
}
.pdm-tracks__head {
  padding: .75rem 1.25rem;
  font-size: .7rem; font-weight: 800; letter-spacing: .1em; text-transform: uppercase;
  color: rgba(255,255,255,.3);
  display: flex; align-items: center; gap: .45rem;
  border-bottom: 1px solid rgba(255,255,255,.06);
  position: sticky; top: 0;
  background: rgba(10,5,5,.9); backdrop-filter: blur(8px);
}
.pdm-track {
  display: flex; align-items: center; gap: .85rem;
  padding: .75rem 1.25rem; cursor: pointer;
  transition: background .15s ease;
  border-bottom: 1px solid rgba(255,255,255,.04);
}
.pdm-track:last-child { border-bottom: none }
.pdm-track:hover { background: rgba(255,255,255,.05) }
.pdm-track--active { background: rgba(140,21,21,.22) !important; }
.pdm-track__num {
  width: 22px; text-align: center;
  font-size: .74rem; font-weight: 800; color: rgba(255,255,255,.28); flex-shrink: 0;
}
.pdm-track--active .pdm-track__num { color: #e06060 }
.pdm-track__info { flex: 1; min-width: 0 }
.pdm-track__title {
  font-size: .9rem; font-weight: 600; color: rgba(255,255,255,.78);
  display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.pdm-track--active .pdm-track__title { color: #fff }
.pdm-track__dur { font-size: .74rem; color: rgba(255,255,255,.32); margin-top: .15rem; display: block }
.pdm-track__src { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0 }
.pdm-track__src--file  { background: #27ae60; box-shadow: 0 0 6px rgba(39,174,96,.5) }
.pdm-track__src--embed { background: #e67e22; box-shadow: 0 0 6px rgba(230,126,34,.5) }
.pdm-track__src--ext   { background: #3498db; box-shadow: 0 0 6px rgba(52,152,219,.5) }
.pdm-track__playing { display: flex; align-items: flex-end; gap: 2.5px; height: 16px; flex-shrink: 0 }
.pdm-track__playing span {
  width: 3px; border-radius: 2px;
  background: linear-gradient(to top, #8c1515, #e06060);
  animation: playing-bar .9s ease-in-out infinite alternate; display: block;
}
.pdm-track__playing span:nth-child(1) { height: 8px;  animation-delay: 0s }
.pdm-track__playing span:nth-child(2) { height: 16px; animation-delay: .18s }
.pdm-track__playing span:nth-child(3) { height: 6px;  animation-delay: .34s }
@keyframes playing-bar { from { transform: scaleY(.25); opacity: .45 } to { transform: scaleY(1); opacity: 1 } }

/* Player */
.pdm-player {
  z-index: 1;
  padding: .9rem 1.25rem;
  background: rgba(0,0,0,.5);
  border-top: 1px solid rgba(255,255,255,.07);
}
.pdm-player__audio { width: 100%; border-radius: 10px; outline: none; }
.pdm-player__video {
  width: 100%; display: block; border: none; outline: none;
  background: #000;
  max-height: 320px;
}
.pdm-player--video { padding: 0 }
.pdm-player--embed { padding: 0 }
.pdm-player--embed iframe { width: 100%; height: 240px; border: none; display: block }

/* Attachment */
.pdm-attach {
  z-index: 1;
  padding: .85rem 1.25rem;
  background: rgba(0,0,0,.35);
  border-top: 1px solid rgba(255,255,255,.06);
  display: flex; align-items: center; gap: .85rem;
}
.pdm-attach__lbl {
  font-size: .68rem; font-weight: 800; letter-spacing: .08em;
  text-transform: uppercase; color: rgba(255,255,255,.28);
}
.pdm-attach__link {
  display: inline-flex; align-items: center; gap: .4rem;
  color: rgba(255,255,255,.7); font-size: .83rem; font-weight: 600;
  text-decoration: none; padding: .45rem .95rem; border-radius: 9px;
  background: rgba(255,255,255,.07); border: 1px solid rgba(255,255,255,.12);
  transition: all .2s ease;
}
.pdm-attach__link:hover {
  background: rgba(140,21,21,.55); border-color: rgba(200,80,80,.4); color: #fff;
  transform: translateY(-1px);
}

/* ════ RIGHT: INFO PANEL ════ */
.pdm-info {
  display: flex; flex-direction: column;
  background: #f7f4f0;
  border-right: 1px solid rgba(0,0,0,.1);
  max-height: min(92vh, 880px); overflow: hidden;
}

/* Head section */
.pdm-info__head {
  flex: 0 0 auto;
  padding: 2rem 1.75rem 1.4rem;
  background: #fff;
  border-bottom: 1px solid #e8e2d8;
  position: relative;
}
/* Subtle crimson accent stripe at the top */
.pdm-info__head::before {
  content: '';
  position: absolute; top: 0; right: 0; left: 0; height: 3px;
  background: linear-gradient(90deg, #8c1515, #c0392b, transparent);
}

.pdm-info__head-meta {
  display: flex; align-items: center; gap: .55rem;
  margin-bottom: .9rem; flex-wrap: wrap;
}
.pdm-id-tag {
  font-size: .73rem; font-weight: 800; color: #c0b4a8; letter-spacing: .07em;
  font-variant-numeric: tabular-nums;
}
.pdm-type-badge {
  display: inline-flex; align-items: center; gap: .4rem;
  padding: .26rem .75rem; border-radius: 99px; font-size: .73rem; font-weight: 800;
  letter-spacing: .02em;
}
.pdm-type-badge__dot { width: 7px; height: 7px; border-radius: 50%; }
.pdm-type-badge--audio { background: rgba(130,60,200,.1); color: #6b2fa0; border: 1px solid rgba(130,60,200,.25) }
.pdm-type-badge--audio .pdm-type-badge__dot { background: #7d3bbd; box-shadow: 0 0 6px rgba(130,60,200,.5) }
.pdm-type-badge--video { background: rgba(220,50,50,.09); color: #aa2820; border: 1px solid rgba(220,50,50,.22) }
.pdm-type-badge--video .pdm-type-badge__dot { background: #c0392b; box-shadow: 0 0 6px rgba(220,50,50,.45) }
.pdm-year-tag {
  display: inline-flex; align-items: center; gap: .32rem;
  font-size: .73rem; color: #b0a898; font-weight: 700; margin-right: auto;
}

.pdm-title {
  font-size: 1.65rem; font-weight: 900; color: #140e08;
  line-height: 1.2; letter-spacing: -.03em;
  margin: 0 0 .35rem;
}
.pdm-subtitle { font-size: .92rem; color: #a09286; font-weight: 500; margin: 0 0 .5rem }
.pdm-loc {
  display: flex; align-items: center; gap: .35rem;
  font-size: .82rem; color: #a09286; margin-bottom: .75rem;
}
.pdm-langs {
  display: flex; align-items: center; gap: .45rem; flex-wrap: wrap; margin-bottom: 1.2rem;
}
.pdm-lang {
  display: inline-flex; padding: .24rem .72rem; border-radius: 7px;
  font-size: .74rem; font-weight: 800; letter-spacing: .03em;
}
.pdm-lang--ckb { background: rgba(254,221,0,.15); color: #7a6200; border: 1px solid rgba(254,221,0,.38) }
.pdm-lang--kmr { background: rgba(40,90,220,.08); color: #2848b0; border: 1px solid rgba(40,90,220,.2) }

.pdm-edit-btn {
  display: inline-flex; align-items: center; gap: .5rem;
  padding: .72rem 1.4rem; border-radius: 12px;
  background: linear-gradient(135deg, #8c1515, #b82020);
  color: #fff; border: none; font-size: .88rem; font-weight: 800;
  text-decoration: none; cursor: pointer; transition: all .22s ease;
  width: 100%; justify-content: center; font-family: inherit;
  box-shadow: 0 6px 24px rgba(140,21,21,.35), inset 0 1px 0 rgba(255,255,255,.1);
  letter-spacing: .02em;
}
.pdm-edit-btn:hover {
  background: linear-gradient(135deg, #a61c1c, #cc2828);
  transform: translateY(-2px);
  box-shadow: 0 10px 32px rgba(140,21,21,.45);
}

/* Lang tabs */
.pdm-tabs {
  flex: 0 0 auto; display: flex;
  background: #ede8e0;
  border-bottom: 1px solid #e0d8cd;
}
.pdm-tab {
  flex: 1; display: inline-flex; align-items: center; justify-content: center;
  gap: .45rem; padding: .8rem 1rem; border: none; background: none;
  color: #a09286; font-weight: 800; font-size: .85rem; cursor: pointer;
  transition: all .2s; font-family: inherit;
  border-bottom: 3px solid transparent;
}
.pdm-tab--on { color: #8c1515; background: #f7f4f0; border-bottom-color: #8c1515 }
.pdm-tab__pip { width: 8px; height: 8px; border-radius: 50% }
.pdm-tab__pip--ckb { background: #c8a800 }
.pdm-tab__pip--kmr { background: #4a7af0 }

/* Scrollable body */
.pdm-info__body {
  flex: 1; overflow-y: auto;
  display: flex; flex-direction: column; gap: 0;
  scroll-behavior: smooth; padding-bottom: 2rem;
}
.pdm-info__body::-webkit-scrollbar { width: 4px }
.pdm-info__body::-webkit-scrollbar-track { background: transparent }
.pdm-info__body::-webkit-scrollbar-thumb { background: #d8d0c4; border-radius: 99px }

/* ── Accordions ── */
.acc { border-bottom: 1px solid #ede8e0 }
.acc:last-child { border-bottom: none }
.acc__hd {
  width: 100%; display: flex; align-items: center; justify-content: space-between;
  padding: 1.1rem 1.75rem; background: none; border: none; cursor: pointer;
  font-family: inherit; transition: background .18s ease; gap: .6rem;
}
.acc__hd:hover { background: rgba(140,21,21,.03) }
.acc__hd--system:hover { background: rgba(100,80,50,.04) }
.acc__hd-left { display: flex; align-items: center; gap: .8rem; flex: 1; min-width: 0 }
.acc__ico {
  width: 36px; height: 36px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; transition: transform .2s ease;
}
.acc__hd:hover .acc__ico { transform: scale(1.08) }
.acc__ico--desc  { background: rgba(140,21,21,.09); color: #8c1515; border: 1px solid rgba(140,21,21,.16) }
.acc__ico--meta  { background: rgba(40,130,100,.09); color: #1a7058; border: 1px solid rgba(40,130,100,.16) }
.acc__ico--tag   { background: rgba(200,168,0,.12); color: #7a6200; border: 1px solid rgba(200,168,0,.22) }
.acc__ico--kw    { background: rgba(40,90,220,.09); color: #2848b0; border: 1px solid rgba(40,90,220,.16) }
.acc__ico--sys   { background: rgba(80,80,80,.08); color: #505050; border: 1px solid rgba(80,80,80,.14) }
.acc__title { font-size: .97rem; font-weight: 700; color: #1e1812; letter-spacing: -.01em }
.acc__badge {
  display: inline-flex; padding: .2rem .62rem; border-radius: 99px;
  font-size: .72rem; font-weight: 900; letter-spacing: .04em;
}
.acc__badge--tag   { background: rgba(200,168,0,.12); color: #7a6200; border: 1px solid rgba(200,168,0,.22) }
.acc__badge--kw    { background: rgba(40,90,220,.09); color: #2848b0; border: 1px solid rgba(40,90,220,.16) }
.acc__chevron { color: #c8c0b4; flex-shrink: 0; transition: transform .28s cubic-bezier(.34,1.56,.64,1), color .18s }
.acc__chevron--open { transform: rotate(180deg); color: #8c1515 }
.acc__hd:hover .acc__chevron { color: #8c1515 }
.acc__body { overflow: hidden; padding: 0 1.75rem 1.25rem }
.acc__body--flush { padding: 0 0 .5rem }
.acc-body-enter-active { transition: all .32s cubic-bezier(.22,1,.36,1) }
.acc-body-leave-active { transition: all .22s ease }
.acc-body-enter-from, .acc-body-leave-to { opacity: 0; transform: translateY(-8px) }
.acc__text--desc {
  font-size: .95rem; color: #2e2418; line-height: 1.9;
  white-space: pre-line; margin: 0; padding: .2rem 0;
  max-height: 300px; overflow-y: auto;
  scrollbar-width: thin; scrollbar-color: #d4cec6 transparent;
}
.acc__chips { display: flex; flex-wrap: wrap; gap: .5rem }
.acc__chip {
  display: inline-flex; align-items: center; gap: .32rem;
  padding: .38rem .88rem; border-radius: 9px;
  font-size: .85rem; font-weight: 600; cursor: default;
  transition: transform .15s ease, box-shadow .15s ease;
}
.acc__chip:hover { transform: translateY(-2px); box-shadow: 0 4px 14px rgba(0,0,0,.12) }
.acc__chip--tag { background: rgba(200,168,0,.11); color: #7a6200; border: 1px solid rgba(200,168,0,.22) }
.acc__chip--kw  { background: rgba(40,90,220,.08); color: #2848b0; border: 1px solid rgba(40,90,220,.15) }

/* System info grid */
.acc--system { background: #f5f1eb }
.acc__sys-grid { display: grid; grid-template-columns: 1fr 1fr; padding: 0 1.75rem .9rem; gap: 0 }
.acc__sys-cell {
  padding: .85rem .7rem .85rem 0;
  border-bottom: 1px solid #e8e2d8;
  border-left: 1px solid #e8e2d8;
}
.acc__sys-cell:nth-child(odd) { border-left: none; padding-right: .7rem }
.acc__sys-cell--full { grid-column: 1/-1; border-left: none }
.acc__sys-cell:last-child,
.acc__sys-cell:nth-last-child(2):not(.acc__sys-cell--full) { border-bottom: none }
.acc__sys-k { font-size: .69rem; font-weight: 800; color: #c0b4a8; letter-spacing: .06em; margin-bottom: .3rem; text-transform: uppercase }
.acc__sys-v { font-size: .88rem; color: #2e2418; font-weight: 600; line-height: 1.4 }
.acc__sys-v--mono { font-family: 'Courier New', monospace; font-size: .8rem; letter-spacing: .04em }

/* ── Detail modal transitions ── */
.pdm-fade-enter-active, .pdm-fade-leave-active { transition: opacity .32s ease }
.pdm-fade-enter-from, .pdm-fade-leave-to { opacity: 0 }
.pdm-rise-enter-active { transition: opacity .42s ease, transform .42s cubic-bezier(.22,1,.36,1) }
.pdm-rise-leave-active { transition: opacity .24s ease, transform .24s ease }
.pdm-rise-enter-from { opacity: 0; transform: scale(.93) translateY(28px) }
.pdm-rise-leave-to   { opacity: 0; transform: scale(.97) translateY(12px) }
</style>