<template>
  <div class="plist" dir="rtl">

    <!-- ── HEADER ── -->
    <div class="plist__head">
      <div>
        <h1 class="plist__title">پڕۆژەکان</h1>
        <p class="plist__sub">بینین، گەڕان و بەڕێوەبردنی هەموو پڕۆژەکان</p>
      </div>
      <RouterLink class="btn btn--primary" to="/admin/projects/new">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        پڕۆژەی نوێ
      </RouterLink>
    </div>

    <!-- ── SEARCH BAR ── -->
    <div class="plist__bar">
      <div class="search">
        <svg class="search__ico" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
        <input v-model="searchQ" class="search__input" placeholder="گەڕان بە ناونیشان، تاگ یا کیوۆرد" @input="onSearch" />
        <Transition name="fade">
          <button v-if="searchQ" class="search__clear" @click="clearSearch">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </Transition>
      </div>
      <select v-model="filterLang" class="sel" @change="load">
        <option value="">هەموو زمانەکان</option>
        <option value="CKB">سۆرانی</option>
        <option value="KMR">کورمانجی</option>
      </select>
      <!-- ✅ Status filter -->
      <select v-model="filterStatus" class="sel" @change="load">
        <option value="">هەموو دۆخەکان</option>
        <option value="ONGOING">بەردەوام</option>
        <option value="COMPLETED">تەواو</option>
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
    <div v-else-if="!projects.length" class="state-box">
      <div class="state-box__ico"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg></div>
      <p>هیچ پڕۆژەیەک نەدۆزرایەوە</p>
      <RouterLink class="btn btn--primary btn--sm" to="/admin/projects/new">یەکەمین پڕۆژەت زیاد بکە</RouterLink>
    </div>

    <!-- ── TABLE ── -->
    <div v-else class="table-wrap">
      <div class="table-meta">کۆی {{ totalItems }} پڕۆژە<span v-if="searchQ"> — ئەنجامی گەڕان بۆ «{{ searchQ }}»</span></div>
      <table class="tbl">
        <thead>
          <tr>
            <th style="width:52px">#</th>
            <th style="width:66px">وێنەی ڕووکار</th>
            <th>ناونیشانی سۆرانی</th>
            <th>ناونیشانی کورمانجی</th>
            <th style="width:160px">جۆر</th>
            <th style="width:100px">دۆخ</th>
            <th style="width:112px">بەروار</th>
            <th style="width:88px">زمان</th>
            <th style="width:72px">میدیا</th>
            <th style="width:116px">کردار</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in filteredProjects" :key="p.id" class="tbl__row" @click="openDetail(p)">
            <td><span class="tbl__id">#{{ p.id }}</span></td>
            <td>
              <div class="cover-wrap" v-if="p.coverUrl"><img class="cover-img" :src="p.coverUrl" loading="lazy" /></div>
              <div class="cover-empty" v-else><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg></div>
            </td>
            <td>
              <div class="tbl__name">{{ p.ckbContent?.title || '—' }}</div>
              <div v-if="p.ckbContent?.location" class="tbl__loc"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>{{ p.ckbContent.location }}</div>
            </td>
            <td>
              <div class="tbl__name tbl__name--kmr">{{ p.kmrContent?.title || '—' }}</div>
              <div v-if="p.kmrContent?.location" class="tbl__loc"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>{{ p.kmrContent.location }}</div>
            </td>
            <!-- ✅ Bilingual type: show relevant one based on available langs -->
            <td>
              <div v-if="p.projectTypeCkb" class="tbl__type-row">
                <span class="pill pill--type pill--ckb">{{ p.projectTypeCkb }}</span>
              </div>
              <div v-if="p.projectTypeKmr" class="tbl__type-row" style="margin-top:.25rem;">
                <span class="pill pill--type pill--kmr">{{ p.projectTypeKmr }}</span>
              </div>
              <span v-if="!p.projectTypeCkb && !p.projectTypeKmr" class="tbl__dash">—</span>
            </td>
            <!-- ✅ Status badge -->
            <td>
              <span class="status-pill" :class="p.status === 'COMPLETED' ? 'status-pill--completed' : 'status-pill--ongoing'">
                <span class="status-pill__dot"></span>
                {{ p.status === 'COMPLETED' ? 'تەواو' : 'بەردەوام' }}
              </span>
            </td>
            <td class="tbl__date">{{ fmtDate(p.projectDate) }}</td>
            <td><div class="lang-row"><span v-for="l in (p.contentLanguages||[])" :key="l" class="lang-dot" :class="`lang-dot--${l.toLowerCase()}`">{{ l }}</span></div></td>
            <td><span class="media-pill" v-if="p.media?.length"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>{{ p.media.length }}</span><span v-else class="tbl__dash">—</span></td>
            <td @click.stop>
              <div class="tbl__acts">
                <button class="act act--view" title="تەواوی زانیاری" @click="openDetail(p)"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></button>
                <RouterLink class="act act--edit" :to="`/admin/projects/${p.id}/edit`"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4z"/></svg></RouterLink>
                <button class="act act--del" @click="confirmDelete(p)"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg></button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- ── PAGINATION ── -->
    <div v-if="totalPages > 1" class="pager">
      <button class="pager__btn" :disabled="page===0" @click="changePage(page-1)"><svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M10 3l-5 5 5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></button>
      <button v-for="p in pageRange" :key="p" class="pager__btn" :class="{'pager__btn--on':p===page}" @click="changePage(p)">{{ p+1 }}</button>
      <button class="pager__btn" :disabled="page>=totalPages-1" @click="changePage(page+1)"><svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M6 3l5 5-5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></button>
    </div>

    <!-- ══ DELETE MODAL ══ -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="delTarget" class="overlay" @click.self="delTarget=null">
          <div class="del-modal">
            <div class="del-modal__ico"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#8C1515" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg></div>
            <h3 class="del-modal__title">دڵنیای لە سڕینەوە؟</h3>
            <p class="del-modal__body">پڕۆژەی <strong>«{{ ckbTitle(delTarget) || '#'+delTarget.id }}»</strong><br/>بە تەواوی سڕاوەتەوە و ناگەڕێتەوە.</p>
            <div class="del-modal__acts">
              <button class="btn btn--ghost" @click="delTarget=null">نەخێر</button>
              <button class="btn btn--danger" :disabled="deleting" @click="doDelete"><span v-if="deleting" class="spinner"></span>{{ deleting?'…':'بەڵێ، بیسڕەوە' }}</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ══ PROJECT DETAIL MODAL ══ -->
    <Teleport to="body">
      <Transition name="pdm-fade">
        <div v-if="detail" class="pdm-overlay" @click.self="closeDetail" @keydown.esc="closeDetail">
          <Transition name="pdm-rise" appear>
            <div v-if="detail" class="pdm" role="dialog" :aria-label="activeContent(detail)?.title">

              <!-- CLOSE -->
              <button class="pdm-x" @click="closeDetail" aria-label="داخستن">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>

              <!-- ════ LEFT — MEDIA ════ -->
              <div class="pdm-media">
                <div class="pdm-media__empty" v-if="!allMediaItems.length">
                  <div class="pdm-media__empty-icon">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                  </div>
                  <span>هیچ میدیایەک نییە</span>
                  <img v-if="detail.coverUrl" :src="detail.coverUrl" class="pdm-media__cover-fallback" />
                </div>

                <div class="pdm-stage" v-else>
                  <!-- IMAGE -->
                  <div v-if="currentMedia.type === 'IMAGE'" class="pdm-stage__image-wrap">
                    <img
                      v-if="currentMedia.imageUrl"
                      :src="currentMedia.imageUrl"
                      :key="currentMedia.imageUrl"
                      class="pdm-stage__image"
                      :alt="currentMedia.caption || ''"
                    />

                    <iframe
                      v-else-if="currentMedia.iframeUrl"
                      :src="currentMedia.iframeUrl"
                      :key="currentMedia.iframeUrl"
                      title="embedded image/media"
                      style="width:100%; height:100%; min-height:360px; border:0; background:#000;"
                      allow="autoplay; encrypted-media; picture-in-picture"
                      allowfullscreen
                    ></iframe>

                    <div v-else class="pdm-doc-card">
                      <div class="pdm-doc-card__icon">
                        <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4">
                          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                          <polyline points="14 2 14 8 20 8"/>
                        </svg>
                      </div>
                      <div class="pdm-doc-card__type">IMAGE</div>
                      <div class="pdm-doc-card__name">{{ currentMedia.caption || 'وێنە' }}</div>
                      <div class="pdm-doc-card__actions" v-if="currentMedia.openUrl">
                        <a :href="currentMedia.openUrl" target="_blank" class="pdm-doc-btn pdm-doc-btn--primary">کردنەوەی لینک</a>
                      </div>
                    </div>

                    <div class="pdm-stage__caption" v-if="currentMedia.caption">{{ currentMedia.caption }}</div>
                  </div>

                  <!-- VIDEO -->
                  <div v-else-if="currentMedia.type === 'VIDEO'" class="pdm-stage__video-wrap">
                    <!-- Prefer embed for YouTube / Vimeo / Drive preview -->
                    <iframe
                      v-if="currentMedia.iframeUrl"
                      :src="currentMedia.iframeUrl"
                      :key="currentMedia.iframeUrl"
                      class="pdm-stage__video"
                      title="embedded video"
                      style="border:0;"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                      allowfullscreen
                      referrerpolicy="strict-origin-when-cross-origin"
                    ></iframe>

                    <!-- Direct video file (.mp4/.webm/...) -->
                    <video
                      v-else-if="currentMedia.videoUrl"
                      :key="currentMedia.videoUrl"
                      class="pdm-stage__video"
                      controls
                      controlsList="nodownload"
                      preload="metadata"
                      playsinline
                    >
                      <source :src="currentMedia.videoUrl" :type="currentMedia.mimeType || undefined" />
                      Your browser does not support the video tag.
                    </video>

                    <!-- Fallback when only external link exists -->
                    <div v-else class="pdm-stage__doc-wrap">
                      <div class="pdm-doc-card">
                        <div class="pdm-doc-card__icon">
                          <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4">
                            <polygon points="23 7 16 12 23 17 23 7"/>
                            <rect x="1" y="5" width="15" height="14" rx="2"/>
                          </svg>
                        </div>
                        <div class="pdm-doc-card__type">VIDEO</div>
                        <div class="pdm-doc-card__name">{{ currentMedia.caption || 'ڤیدیۆ' }}</div>
                        <div class="pdm-doc-card__actions" v-if="currentMedia.openUrl">
                          <a :href="currentMedia.openUrl" target="_blank" class="pdm-doc-btn pdm-doc-btn--primary">
                            کردنەوەی ڤیدیۆ
                          </a>
                        </div>
                      </div>
                    </div>

                    <div class="pdm-stage__caption" v-if="currentMedia.caption">{{ currentMedia.caption }}</div>
                  </div>

                  <!-- AUDIO -->
                  <div v-else-if="currentMedia.type === 'AUDIO'" class="pdm-stage__audio-wrap">
                    <div class="pdm-audio-player">
                      <div class="pdm-audio-player__wave">
                        <span v-for="i in 32" :key="i" class="pdm-audio-player__bar" :style="{ animationDelay: `${i * 0.06}s`, height: `${18 + Math.sin(i * 0.8) * 14}px` }"></span>
                      </div>
                      <div class="pdm-audio-player__title">{{ currentMedia.caption || 'دەنگ' }}</div>

                      <!-- Embed audio (e.g. SoundCloud/other players) -->
                      <iframe
                        v-if="currentMedia.iframeUrl"
                        :src="currentMedia.iframeUrl"
                        :key="currentMedia.iframeUrl"
                        title="embedded audio"
                        style="width:100%; min-height:130px; border:0; border-radius:8px; background:#111;"
                        allow="autoplay"
                      ></iframe>

                      <!-- Direct audio file -->
                      <audio
                        v-else-if="currentMedia.audioUrl"
                        :key="currentMedia.audioUrl"
                        class="pdm-audio-player__ctrl"
                        controls
                        controlsList="nodownload"
                        preload="metadata"
                      >
                        <source :src="currentMedia.audioUrl" :type="currentMedia.mimeType || undefined" />
                        Your browser does not support the audio tag.
                      </audio>

                      <!-- Fallback -->
                      <div v-else style="color: rgba(255,255,255,.65); font-size:.85rem; text-align:center;">
                        پێشبینینی دەنگ بەردەست نییە، بەڵام دەتوانیت لینکەکە بکەیتەوە.
                      </div>

                      <a v-if="currentMedia.openUrl" :href="currentMedia.openUrl" target="_blank" class="pdm-ext-link">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                        لینک / پلەیەر دەرەکی
                      </a>
                    </div>
                  </div>

                  <!-- DOC/PDF -->
                  <div v-else-if="currentMedia.type === 'PDF' || currentMedia.type === 'DOCUMENT'" class="pdm-stage__doc-wrap">
                    <!-- Inline preview when possible -->
                    <iframe
                      v-if="currentMedia.docPreviewUrl"
                      :src="currentMedia.docPreviewUrl"
                      :key="currentMedia.docPreviewUrl"
                      title="document preview"
                      style="width:100%; height:100%; min-height:360px; border:0; background:#fff;"
                    ></iframe>

                    <!-- Fallback card -->
                    <div v-else class="pdm-doc-card">
                      <div class="pdm-doc-card__icon">
                        <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                      </div>
                      <div class="pdm-doc-card__type">{{ currentMedia.type }}</div>
                      <div class="pdm-doc-card__name">{{ currentMedia.caption || 'بەلگەنامە' }}</div>
                      <div class="pdm-doc-card__actions">
                        <a v-if="currentMedia.openUrl" :href="currentMedia.openUrl" target="_blank" class="pdm-doc-btn pdm-doc-btn--primary">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                          کردنەوەی فایل
                        </a>
                      </div>
                    </div>
                  </div>

                  <div v-else-if="detail.coverUrl" class="pdm-stage__image-wrap">
                    <img :src="detail.coverUrl" class="pdm-stage__image" alt="cover" />
                  </div>

                  <button v-if="allMediaItems.length > 1" class="pdm-arrow pdm-arrow--prev" @click="prevMedia" :disabled="mediaIdx === 0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M15 18l-6-6 6-6"/></svg>
                  </button>
                  <button v-if="allMediaItems.length > 1" class="pdm-arrow pdm-arrow--next" @click="nextMedia" :disabled="mediaIdx === allMediaItems.length - 1">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M9 18l6-6-6-6"/></svg>
                  </button>
                  <div class="pdm-counter" v-if="allMediaItems.length > 1">{{ mediaIdx + 1 }} / {{ allMediaItems.length }}</div>
                </div>

                <div class="pdm-thumbs" v-if="allMediaItems.length > 1">
                  <button v-for="(m, i) in allMediaItems" :key="i" class="pdm-thumb" :class="{ 'pdm-thumb--on': i === mediaIdx }" @click="mediaIdx = i">
                    <img v-if="m.type === 'IMAGE' && (m.imageUrl || m.url)" :src="m.imageUrl || m.url" loading="lazy" />
                    <span v-else-if="m.type === 'VIDEO'" class="pdm-thumb__icon pdm-thumb__icon--video"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg></span>
                    <span v-else-if="m.type === 'AUDIO'" class="pdm-thumb__icon pdm-thumb__icon--audio"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg></span>
                    <span v-else class="pdm-thumb__icon pdm-thumb__icon--doc"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></span>
                    <span class="pdm-thumb__bar" v-if="i === mediaIdx"></span>
                  </button>
                </div>
              </div>

              <!-- ════ RIGHT — DETAIL PANEL ════ -->
              <div class="pdm-info">
                <div class="pdm-info__head">
                  <div class="pdm-info__head-meta">
                    <span class="pdm-id-tag"># {{ detail.id }}</span>
                    <!-- ✅ Status badge in detail modal -->
                    <span class="pdm-status-badge" :class="detail.status === 'COMPLETED' ? 'pdm-status-badge--completed' : 'pdm-status-badge--ongoing'">
                      <span class="pdm-status-badge__dot"></span>
                      {{ detail.status === 'COMPLETED' ? 'تەواو' : 'بەردەوام' }}
                    </span>
                  </div>

                  <!-- ✅ Bilingual type display in detail -->
                  <div class="pdm-types" v-if="detail.projectTypeCkb || detail.projectTypeKmr">
                    <span v-if="detail.projectTypeCkb" class="pdm-type-tag pdm-type-tag--ckb">{{ detail.projectTypeCkb }}</span>
                    <span v-if="detail.projectTypeKmr" class="pdm-type-tag pdm-type-tag--kmr">{{ detail.projectTypeKmr }}</span>
                  </div>

                  <h2 class="pdm-title">{{ activeContent(detail)?.title || '—' }}</h2>
                  <p class="pdm-subtitle" v-if="detail.kmrContent?.title && detail.ckbContent?.title !== detail.kmrContent?.title">
                    {{ detail.contentLanguages?.includes('CKB') ? detail.kmrContent.title : detail.ckbContent?.title }}
                  </p>

                  <div class="pdm-langs">
                    <span v-for="l in detail.contentLanguages" :key="l" class="pdm-lang" :class="`pdm-lang--${l.toLowerCase()}`">
                      {{ l === 'CKB' ? 'سۆرانی' : 'کورمانجی' }}
                    </span>
                    <span class="pdm-date" v-if="detail.projectDate">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                      {{ fmtDate(detail.projectDate) }}
                    </span>
                  </div>

                  <RouterLink class="pdm-edit-btn" :to="`/admin/projects/${detail.id}/edit`" @click="closeDetail">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4z"/></svg>
                    دەستکاری پڕۆژە
                  </RouterLink>
                </div>

                <div class="pdm-tabs" v-if="detail.contentLanguages?.length > 1">
                  <button v-for="l in detail.contentLanguages" :key="l" class="pdm-tab" :class="{ 'pdm-tab--on': detailLang === l }" @click="detailLang = l">
                    <span class="pdm-tab__pip" :class="`pdm-tab__pip--${l.toLowerCase()}`"></span>
                    {{ l === 'CKB' ? 'سۆرانی' : 'کورمانجی' }}
                  </button>
                </div>

                <div class="pdm-info__body">

                  <!-- Description -->
                  <div class="acc" v-if="activeContent(detail)?.description">
                    <button class="acc__hd" @click="toggleAcc('desc')">
                      <span class="acc__hd-left"><span class="acc__ico acc__ico--desc"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="14 2 14 8 20 8"/></svg></span><span class="acc__title">وەسف</span></span>
                      <svg class="acc__chevron" :class="{ 'acc__chevron--open': openAccordions.has('desc') }" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M6 9l6 6 6-6"/></svg>
                    </button>
                    <Transition name="acc-body">
                      <div v-if="openAccordions.has('desc')" class="acc__body">
                        <p class="acc__text acc__text--desc">{{ activeContent(detail).description }}</p>
                      </div>
                    </Transition>
                  </div>

                  <!-- Location -->
                  <div class="acc" v-if="activeContent(detail)?.location">
                    <button class="acc__hd" @click="toggleAcc('loc')">
                      <span class="acc__hd-left"><span class="acc__ico acc__ico--loc"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg></span><span class="acc__title">شوێن</span></span>
                      <svg class="acc__chevron" :class="{ 'acc__chevron--open': openAccordions.has('loc') }" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M6 9l6 6 6-6"/></svg>
                    </button>
                    <Transition name="acc-body">
                      <div v-if="openAccordions.has('loc')" class="acc__body">
                        <div class="acc__location"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>{{ activeContent(detail).location }}</div>
                      </div>
                    </Transition>
                  </div>

                  <!-- Contents -->
                  <div class="acc" v-if="activeContents(detail).length">
                    <button class="acc__hd" @click="toggleAcc('contents')">
                      <span class="acc__hd-left"><span class="acc__ico acc__ico--content"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg></span><span class="acc__title">ناوەڕۆک</span><span class="acc__badge">{{ activeContents(detail).length }}</span></span>
                      <svg class="acc__chevron" :class="{ 'acc__chevron--open': openAccordions.has('contents') }" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M6 9l6 6 6-6"/></svg>
                    </button>
                    <Transition name="acc-body">
                      <div v-if="openAccordions.has('contents')" class="acc__body">
                        <div class="acc__chips"><span v-for="t in activeContents(detail)" :key="t" class="acc__chip acc__chip--content">{{ t }}</span></div>
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
                        <div class="acc__chips"><span v-for="t in activeTags(detail)" :key="t" class="acc__chip acc__chip--tag"><svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/></svg>{{ t }}</span></div>
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

                  <!-- Media list -->
                  <div class="acc" v-if="allMediaItems.length">
                    <button class="acc__hd" @click="toggleAcc('media')">
                      <span class="acc__hd-left"><span class="acc__ico acc__ico--media"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg></span><span class="acc__title">میدیاکان</span><span class="acc__badge acc__badge--media">{{ allMediaItems.length }}</span></span>
                      <svg class="acc__chevron" :class="{ 'acc__chevron--open': openAccordions.has('media') }" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M6 9l6 6 6-6"/></svg>
                    </button>
                    <Transition name="acc-body">
                      <div v-if="openAccordions.has('media')" class="acc__body acc__body--flush">
                        <div v-for="(m, i) in allMediaItems" :key="i" class="acc__media-row" :class="{ 'acc__media-row--on': i === mediaIdx }" @click="mediaIdx = i">
                          <div class="acc__media-ico" :class="`acc__media-ico--${m.type?.toLowerCase()}`"><span v-html="mediaIcon(m.type)"></span></div>
                          <div class="acc__media-info">
                            <div class="acc__media-type">{{ m.type }}</div>
                            <div class="acc__media-cap" v-if="m.caption">{{ m.caption }}</div>
                            <div class="acc__media-cap acc__media-cap--url" v-else-if="m.openUrl">{{ m.openUrl }}</div>
                          </div>
                          <div class="acc__media-playing" v-if="i === mediaIdx"><span class="acc__media-playing__dot"></span><span class="acc__media-playing__dot"></span><span class="acc__media-playing__dot"></span></div>
                        </div>
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
import { ref, computed, onMounted, watch, onBeforeUnmount, nextTick } from 'vue'
import api from '@/api.js'

/* ── state ── */
const projects       = ref([])
const page           = ref(0)
const pageSize       = ref(15)
const totalPages     = ref(0)
const totalItems     = ref(0)
const loading        = ref(false)
const error          = ref('')
const searchQ        = ref('')
const filterLang     = ref('')
const filterStatus   = ref('')
const delTarget      = ref(null)
const deleting       = ref(false)
const detail         = ref(null)
const detailLang     = ref('CKB')
const mediaIdx       = ref(0)
const detailOverlayEl= ref(null)
const toast          = ref({ show: false, type: 'success', msg: '' })
const openAccordions = ref(new Set(['desc', 'loc', 'contents', 'tags', 'kw', 'media']))

let searchTimer = null
let toastTimer  = null

/* ── generic helpers ── */
const ensureArray = (v) => Array.isArray(v) ? v : []
const cleanUrl = (u) => (typeof u === 'string' ? u.trim() : '')

/* ── HTML / embed helpers (fix pasted iframe + YouTube links) ── */
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

/* ── normalize project shape ── */
const normalizeProject = (p = {}) => {
  const out = { ...p }

  out.coverUrl = out.coverUrl || out.coverImageUrl || out.imageUrl || ''
  out.media = ensureArray(out.media?.length ? out.media : (out.mediaItems || out.attachments || []))

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
  out.contentsCkb = ensureArray(out.contentsCkb || out.contents?.ckb)
  out.contentsKmr = ensureArray(out.contentsKmr || out.contents?.kmr)

  return out
}

/* ── media url helpers (NO CSS CHANGES) ── */
const getExt = (u = '') => {
  const clean = cleanUrl(u)
  const iframeSrc = extractIframeSrcFromHtml(clean)
  const finalUrl = iframeSrc || decodeHtmlEntities(clean)
  const obj = getUrlObj(finalUrl)
  const path = obj?.pathname || finalUrl.split('?')[0] || ''
  const m = path.toLowerCase().match(/\.([a-z0-9]+)$/i)
  return m?.[1] || ''
}

const VIDEO_EXTS = ['mp4', 'webm', 'ogg', 'ogv', 'm4v', 'mov']
const AUDIO_EXTS = ['mp3', 'wav', 'ogg', 'm4a', 'aac', 'flac']
const IMAGE_EXTS = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg', 'avif']
const DOC_EXTS   = ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'txt']

const isDirectVideoUrl = (u) => VIDEO_EXTS.includes(getExt(u))
const isDirectAudioUrl = (u) => AUDIO_EXTS.includes(getExt(u))
const isDirectImageUrl = (u) => IMAGE_EXTS.includes(getExt(u))
const isDocLikeUrl     = (u) => DOC_EXTS.includes(getExt(u))

const inferMimeType = (u = '', mediaType = '') => {
  const ext = getExt(u)
  const map = {
    mp4: 'video/mp4',
    webm: 'video/webm',
    ogv: 'video/ogg',
    ogg: mediaType === 'AUDIO' ? 'audio/ogg' : 'video/ogg',
    m4v: 'video/mp4',
    mov: 'video/quicktime',
    mp3: 'audio/mpeg',
    wav: 'audio/wav',
    m4a: 'audio/mp4',
    aac: 'audio/aac',
    flac: 'audio/flac',
    pdf: 'application/pdf'
  }
  return map[ext] || ''
}

const normalizeDirectFileUrl = (raw = '') => {
  let u = decodeHtmlEntities(cleanUrl(raw))
  if (!u) return ''

  const iframeSrc = extractIframeSrcFromHtml(u)
  if (iframeSrc) u = iframeSrc

  if (!isHttpUrl(u)) return ''

  const obj = getUrlObj(u)
  if (!obj) return u

  const host = obj.hostname.toLowerCase()

  // Dropbox -> raw file
  if (host.includes('dropbox.com')) {
    obj.searchParams.delete('dl')
    obj.searchParams.set('raw', '1')
    return obj.toString()
  }

  return obj.toString()
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

  // YouTube (keep start/si if present)
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
    host.includes('soundcloud.com') ||
    host.includes('w.soundcloud.com') ||
    host.includes('spotify.com') ||
    host.includes('open.spotify.com')
  ) return obj.toString()

  return ''
}

const buildMediaPresentation = ({ type, url, embedUrl, externalUrl }) => {
  const rawUrl      = cleanUrl(url)
  const rawEmbed    = cleanUrl(embedUrl)
  const rawExternal = cleanUrl(externalUrl)

  const normalizedUrl = normalizeDirectFileUrl(rawUrl)
  const normalizedExt = normalizeDirectFileUrl(rawExternal)

  const iframeUrl =
    toEmbeddableUrl(rawEmbed) ||
    (
      !isDirectVideoUrl(normalizedUrl) &&
      !isDirectAudioUrl(normalizedUrl) &&
      !isDirectImageUrl(normalizedUrl)
        ? toEmbeddableUrl(normalizedUrl)
        : ''
    ) ||
    toEmbeddableUrl(normalizedExt) ||
    ''

  const item = {
    iframeUrl,
    videoUrl: '',
    audioUrl: '',
    imageUrl: '',
    docPreviewUrl: '',
    openUrl: rawExternal || rawUrl || rawEmbed || '',
    mimeType: ''
  }

  if (type === 'VIDEO') {
    if (isDirectVideoUrl(normalizedUrl)) {
      item.videoUrl = normalizedUrl
      item.mimeType = inferMimeType(normalizedUrl, 'VIDEO')
    }
  } else if (type === 'AUDIO') {
    if (isDirectAudioUrl(normalizedUrl)) {
      item.audioUrl = normalizedUrl
      item.mimeType = inferMimeType(normalizedUrl, 'AUDIO')
    }
  } else if (type === 'IMAGE') {
    if (isDirectImageUrl(normalizedUrl)) item.imageUrl = normalizedUrl
    else if (isDirectImageUrl(normalizedExt)) item.imageUrl = normalizedExt
  } else if (type === 'PDF' || type === 'DOCUMENT') {
    if (iframeUrl) item.docPreviewUrl = iframeUrl
    else if (isHttpUrl(normalizedUrl) && (type === 'PDF' || isDocLikeUrl(normalizedUrl))) {
      item.docPreviewUrl = normalizedUrl
    }
  }

  return item
}

/* ── client-side status/lang filters (applied on top of server results) ── */
const filteredProjects = computed(() => {
  let list = ensureArray(projects.value)

  if (filterStatus.value) {
    list = list.filter(p => p?.status === filterStatus.value)
  }

  if (filterLang.value) {
    list = list.filter(p => ensureArray(p?.contentLanguages).includes(filterLang.value))
  }

  return list
})

const toggleAcc = (key) => {
  const s = new Set(openAccordions.value)
  s.has(key) ? s.delete(key) : s.add(key)
  openAccordions.value = s
}

const pageRange = computed(() => {
  const r = []
  for (let i = Math.max(0, page.value - 2); i <= Math.min(totalPages.value - 1, page.value + 2); i++) r.push(i)
  return r
})

const allMediaItems = computed(() => {
  if (!detail.value) return []

  const list = []
  const seen = new Set()

  const pushUniq = (m) => {
    const key = `${m.type || ''}|${m.url || ''}|${m.embedUrl || ''}|${m.externalUrl || ''}|${m.caption || ''}`
    if (seen.has(key)) return
    seen.add(key)
    list.push(m)
  }

  const media = ensureArray(detail.value.media)
    .slice()
    .sort((a, b) => (a?.sortOrder ?? 0) - (b?.sortOrder ?? 0))

  const hasImageMedia = media.some(m => (m?.mediaType || m?.type) === 'IMAGE' && (m?.url || m?.externalUrl || m?.embedUrl))

  if (detail.value.coverUrl && !hasImageMedia) {
    const coverPresentation = buildMediaPresentation({
      type: 'IMAGE',
      url: detail.value.coverUrl,
      embedUrl: '',
      externalUrl: ''
    })

    pushUniq({
      type: 'IMAGE',
      url: detail.value.coverUrl,
      caption: 'کڤەر',
      isCover: true,
      ...coverPresentation
    })
  }

  media.forEach(m => {
    const type = (m.mediaType || m.type || 'IMAGE').toString().toUpperCase()

    const presentation = buildMediaPresentation({
      type,
      url: m.url || '',
      embedUrl: m.embedUrl || '',
      externalUrl: m.externalUrl || ''
    })

    pushUniq({
      type,
      url: m.url || '',
      externalUrl: m.externalUrl || '',
      embedUrl: m.embedUrl || '',
      caption: m.caption || '',
      sortOrder: m.sortOrder ?? 0,
      ...presentation
    })
  })

  return list
})

const currentMedia = computed(() => allMediaItems.value[mediaIdx.value] || {})

watch(detail, async (v) => {
  mediaIdx.value = 0

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

/* ── data loading ── */
const load = async () => {
  loading.value = true
  error.value = ''

  try {
    const q = searchQ.value.trim()
    let data

    // ── No search: normal list ─────────────────────────────
    if (!q) {
      const res = await api.get('/api/v1/projects/getAll', {
        params: { page: page.value, size: pageSize.value }
      })
      data = res.data
    } else {
      // ── Search flow: keyword first, then tag fallback ─────
      // (because user may type normal title text OR tag text)
      let keywordRes = null
      let keywordItemsCount = 0

      try {
        keywordRes = await api.get('/api/v1/projects/search/keyword', {
          params: { keyword: q, page: page.value, size: pageSize.value }
        })

        const kp = keywordRes?.data?.data ?? keywordRes?.data ?? {}
        const kr = kp?.content !== undefined ? kp : (kp?.data ?? kp?.result ?? {})
        keywordItemsCount = Array.isArray(kr.content) ? kr.content.length : 0
      } catch (_) {
        // ignore here, we'll try tag search next
      }

      if (keywordRes && keywordItemsCount > 0) {
        data = keywordRes.data
      } else {
        // fallback to tag endpoint
        const tagRes = await api.get('/api/v1/projects/search/tag', {
          params: { tag: q, page: page.value, size: pageSize.value }
        })
        data = tagRes.data
      }
    }

    // ── Normalize response (same as your current style) ─────
    const payload = data?.data ?? data ?? {}
    const result  = payload?.content !== undefined ? payload : (payload?.data ?? payload?.result ?? {})

    projects.value   = ensureArray(result.content).map(normalizeProject)
    totalPages.value = Number(result.totalPages ?? 0)
    totalItems.value = Number(result.totalElements ?? projects.value.length)

  } catch (e) {
    error.value = e?.response?.data?.message || e.message || 'هەڵەیەک ڕوویدا'
    projects.value = []
    totalPages.value = 0
    totalItems.value = 0
  } finally {
    loading.value = false
  }
}

const onSearch = () => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    page.value = 0
    load()
  }, 400)
}

const clearSearch = () => {
  searchQ.value = ''
  page.value = 0
  load()
}

const changePage = (p) => {
  page.value = p
  load()
}

/* ── delete ── */
const confirmDelete = (p) => { delTarget.value = p }

const doDelete = async () => {
  if (!delTarget.value) return
  deleting.value = true

  const deletingId = delTarget.value.id

  try {
    await api.delete(`/api/v1/projects/delete/${deletingId}`)
    showToast('success', 'پڕۆژەکە بە سەرکەوتنی سڕایەوە')

    // close detail if same project is open
    if (detail.value?.id === deletingId) closeDetail()

    delTarget.value = null
    await load()

    // if page becomes empty after delete, go back one page
    if (!projects.value.length && page.value > 0) {
      page.value -= 1
      await load()
    }
  } catch (e) {
    showToast('error', e?.response?.data?.message || 'سڕینەوە سەرنەکەوت')
  } finally {
    deleting.value = false
  }
}

/* ── detail modal ── */
const openDetail = (p) => {
  const proj = normalizeProject(p)
  detail.value = proj
  detailLang.value = ensureArray(proj.contentLanguages).includes('CKB')
    ? 'CKB'
    : (ensureArray(proj.contentLanguages)[0] || 'CKB')

  openAccordions.value = new Set(['desc', 'loc', 'contents', 'tags', 'kw', 'media'])
}

const closeDetail = () => {
  detail.value = null
}

const onGlobalKeydown = (e) => {
  if (e.key === 'Escape' && detail.value) closeDetail()
}

const prevMedia = () => { if (mediaIdx.value > 0) mediaIdx.value-- }
const nextMedia = () => { if (mediaIdx.value < allMediaItems.value.length - 1) mediaIdx.value++ }

/* ── content helpers ── */
const activeContent = (p) => {
  if (!p) return {}
  return detailLang.value === 'CKB'
    ? (p.ckbContent || p.content?.ckb || {})
    : (p.kmrContent || p.content?.kmr || {})
}

const activeTags = (p) => {
  if (!p) return []
  return detailLang.value === 'CKB'
    ? ensureArray(p.tagsCkb || p.tags?.ckb)
    : ensureArray(p.tagsKmr || p.tags?.kmr)
}

const activeKeywords = (p) => {
  if (!p) return []
  return detailLang.value === 'CKB'
    ? ensureArray(p.keywordsCkb || p.keywords?.ckb)
    : ensureArray(p.keywordsKmr || p.keywords?.kmr)
}

const activeContents = (p) => {
  if (!p) return []
  return detailLang.value === 'CKB'
    ? ensureArray(p.contentsCkb || p.contents?.ckb)
    : ensureArray(p.contentsKmr || p.contents?.kmr)
}

/* ── UI helpers ── */
const mediaIcon = (type) => ({
  IMAGE:    `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`,
  VIDEO:    `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>`,
  AUDIO:    `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`,
  PDF:      `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/></svg>`,
  DOCUMENT: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/></svg>`
}[type] || `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/></svg>`)

const showToast = (type, msg) => {
  clearTimeout(toastTimer)
  toast.value = { show: true, type, msg }
  toastTimer = setTimeout(() => {
    toast.value.show = false
  }, 3500)
}

const ckbTitle = (p) => p?.ckbContent?.title || p?.content?.ckb?.title || ''
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('ar-IQ') : '—'
const fmtDatetime = (d) =>
  d
    ? new Date(d).toLocaleString('ar-IQ', {
        year:'numeric',
        month:'short',
        day:'numeric',
        hour:'2-digit',
        minute:'2-digit'
      })
    : '—'

onMounted(load)

onBeforeUnmount(() => {
  clearTimeout(searchTimer)
  clearTimeout(toastTimer)
  document.body.style.overflow = ''
  window.removeEventListener('keydown', onGlobalKeydown)
})
</script>


<style scoped>

/* ── TABLE / LIST ── */
.plist { direction: rtl; max-width: 1400px; margin: 0 auto; }
.plist__head { display:flex; align-items:center; justify-content:space-between; margin-bottom:1.5rem; gap:1rem; flex-wrap:wrap; }
.plist__title { font-size:1.55rem; font-weight:700; color:var(--text); }
.plist__sub { color:var(--muted); font-size:.83rem; margin-top:.2rem; }
.btn { display:inline-flex; align-items:center; gap:.45rem; padding:.65rem 1.1rem; border-radius:var(--radius-sm); font-weight:700; font-size:.87rem; cursor:pointer; border:1px solid transparent; transition:var(--transition); text-decoration:none; white-space:nowrap; font-family:inherit; }
.btn--primary { background:var(--crimson); color:#fff; box-shadow:0 6px 20px rgba(140,21,21,.22); }
.btn--primary:hover { background:var(--crimson-lt); transform:translateY(-1px); }
.btn--ghost { background:transparent; border-color:var(--border); color:var(--text); }
.btn--ghost:hover { border-color:var(--crimson); color:var(--crimson); }
.btn--danger { background:#c0392b; color:#fff; border-color:#c0392b; }
.btn--danger:hover { background:#a93226; }
.btn--sm { padding:.45rem .85rem; font-size:.82rem; }
.btn:disabled { opacity:.5; cursor:not-allowed; transform:none!important; }
.plist__bar { display:flex; gap:.75rem; margin-bottom:1.25rem; flex-wrap:wrap; }
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
.toast--error { background:rgba(140,21,21,.07); border:1px solid rgba(140,21,21,.18); color:var(--crimson); }
.skeletons { display:flex; flex-direction:column; gap:.55rem; }
.skel { height:58px; border-radius:var(--radius-sm); background:linear-gradient(90deg,var(--cream-dk) 25%,#eae8e4 50%,var(--cream-dk) 75%); background-size:200% 100%; animation:shimmer 1.4s ease infinite; }
@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
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
.tbl__loc { display:flex; align-items:center; gap:.3rem; font-size:.73rem; color:var(--muted); margin-top:.2rem; }
.tbl__date { font-size:.82rem; color:var(--muted); white-space:nowrap; }
.tbl__dash { color:var(--border); }
.tbl__type-row { line-height:1; }
.cover-wrap { width:50px; height:38px; border-radius:8px; overflow:hidden; border:1px solid var(--border); }
.cover-img { width:100%; height:100%; object-fit:cover; display:block; }
.cover-empty { width:50px; height:38px; border-radius:8px; border:1px dashed var(--border); display:flex; align-items:center; justify-content:center; color:var(--border); }

/* ✅ Bilingual type pills */
.pill { display:inline-flex; align-items:center; gap:.3rem; padding:.2rem .55rem; border-radius:99px; font-size:.73rem; font-weight:700; white-space:nowrap; }
.pill--type { background:rgba(140,21,21,.08); color:var(--crimson); border:1px solid rgba(140,21,21,.14); }
.pill--ckb { background:rgba(254,221,0,.12); color:#7a6200; border:1px solid rgba(254,221,0,.3); }
.pill--kmr { background:rgba(30,90,200,.08); color:#1a47a0; border:1px solid rgba(30,90,200,.18); }

/* ✅ Status pill in table */
.status-pill {
  display:inline-flex; align-items:center; gap:.38rem;
  padding:.25rem .65rem; border-radius:99px;
  font-size:.74rem; font-weight:700; white-space:nowrap;
}
.status-pill__dot { width:7px; height:7px; border-radius:50%; flex-shrink:0; }
.status-pill--ongoing  { background:rgba(243,156,18,.1); color:#8c5f00; border:1px solid rgba(243,156,18,.3); }
.status-pill--ongoing  .status-pill__dot { background:#f39c12; box-shadow:0 0 5px rgba(243,156,18,.6); }
.status-pill--completed { background:rgba(39,174,96,.09); color:#186040; border:1px solid rgba(39,174,96,.28); }
.status-pill--completed .status-pill__dot { background:#27ae60; box-shadow:0 0 5px rgba(39,174,96,.6); }

.lang-dot { display:inline-flex; padding:.18rem .5rem; border-radius:6px; font-size:.72rem; font-weight:700; }
.lang-dot--ckb { background:rgba(254,221,0,.2); color:#806e00; border:1px solid rgba(254,221,0,.4); }
.lang-dot--kmr { background:rgba(30,90,200,.1); color:#1a47a0; border:1px solid rgba(30,90,200,.2); }
.lang-row { display:flex; gap:.3rem; flex-wrap:wrap; }
.media-pill { display:inline-flex; align-items:center; gap:.35rem; font-size:.8rem; color:var(--muted); font-weight:600; }
.tbl__acts { display:flex; gap:.35rem; }
.act { width:30px; height:30px; border-radius:8px; border:1px solid var(--border); background:var(--cream); color:var(--muted); cursor:pointer; text-decoration:none; display:inline-flex; align-items:center; justify-content:center; transition:var(--transition); }
.act--view:hover { background:rgba(30,90,200,.08); border-color:rgba(30,90,200,.28); color:#1a47a0; }
.act--edit:hover { background:rgba(30,150,80,.08); border-color:rgba(30,150,80,.28); color:#166044; }
.act--del:hover { background:rgba(140,21,21,.08); border-color:rgba(140,21,21,.25); color:var(--crimson); }
.pager { display:flex; align-items:center; gap:.4rem; margin-top:1.25rem; flex-wrap:wrap; }
.pager__btn { min-width:36px; height:36px; padding:0 .6rem; border-radius:8px; border:1px solid var(--border); background:var(--white); color:var(--text); font-weight:600; font-size:.87rem; cursor:pointer; display:inline-flex; align-items:center; justify-content:center; transition:var(--transition); font-family:inherit; }
.pager__btn:hover:not(:disabled) { border-color:var(--crimson); color:var(--crimson); }
.pager__btn--on { background:var(--crimson); border-color:var(--crimson); color:#fff; }
.pager__btn:disabled { opacity:.35; cursor:not-allowed; }
.overlay { position:fixed; inset:0; z-index:200; background:rgba(20,10,10,.5); display:flex; align-items:center; justify-content:center; padding:1rem; }
.del-modal { background:var(--white); border-radius:var(--radius-lg); padding:2rem; max-width:400px; width:100%; box-shadow:0 30px 80px rgba(0,0,0,.25); text-align:center; align-self:center; }
.del-modal__ico { width:62px; height:62px; border-radius:50%; background:rgba(140,21,21,.07); border:1px solid rgba(140,21,21,.14); display:flex; align-items:center; justify-content:center; margin:0 auto .85rem; }
.del-modal__title { font-size:1.15rem; font-weight:700; margin-bottom:.5rem; }
.del-modal__body { color:var(--muted); font-size:.9rem; line-height:1.7; margin-bottom:1.5rem; }
.del-modal__acts { display:flex; gap:.75rem; justify-content:center; }
.spinner { width:13px; height:13px; border:2px solid rgba(255,255,255,.35); border-top-color:#fff; border-radius:50%; animation:spin .65s linear infinite; }
@keyframes spin{to{transform:rotate(360deg)}}
.fade-enter-active,.fade-leave-active{transition:opacity .15s}
.fade-enter-from,.fade-leave-to{opacity:0}
.slide-down-enter-active,.slide-down-leave-active{transition:.3s ease}
.slide-down-enter-from,.slide-down-leave-to{opacity:0;transform:translateY(-8px)}
.modal-enter-active,.modal-leave-active{transition:.25s ease}
.modal-enter-from,.modal-leave-to{opacity:0}
.modal-enter-active .del-modal,.modal-leave-active .del-modal{transition:.25s ease}
.modal-enter-from .del-modal,.modal-leave-to .del-modal{transform:scale(.94) translateY(8px)}

/* ════════════════════════════════════════════
   PROJECT DETAIL MODAL
════════════════════════════════════════════ */
.pdm-overlay { position:fixed; inset:0; z-index:400; background:rgba(5,2,2,.78); backdrop-filter:blur(12px); -webkit-backdrop-filter:blur(12px); display:flex; align-items:center; justify-content:center; padding:1.5rem; overflow-y:auto; }
.pdm { position:relative; width:100%; max-width:1080px; max-height:calc(100vh - 3rem); background:#141010; border-radius:20px; overflow:hidden; display:grid; grid-template-columns:1fr 420px; box-shadow:0 0 0 1px rgba(255,255,255,.07),0 40px 120px rgba(0,0,0,.75),0 8px 32px rgba(0,0,0,.5); }
@media (max-width:820px){ .pdm{grid-template-columns:1fr;max-height:none;} }
.pdm-x { position:absolute; top:1rem; left:1rem; z-index:50; width:36px; height:36px; border-radius:50%; background:rgba(0,0,0,.55); border:1px solid rgba(255,255,255,.15); color:rgba(255,255,255,.85); cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all .22s ease; backdrop-filter:blur(8px); }
.pdm-x:hover { background:rgba(140,21,21,.8); border-color:rgba(200,60,60,.5); color:#fff; transform:rotate(90deg) scale(1.08); }
.pdm-media { display:flex; flex-direction:column; background:#0c0808; position:relative; min-height:480px; }
.pdm-media__empty { flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:.75rem; color:rgba(255,255,255,.25); font-size:.85rem; padding:2rem; position:relative; }
.pdm-media__empty-icon { width:72px; height:72px; border-radius:50%; background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.08); display:flex; align-items:center; justify-content:center; }
.pdm-media__cover-fallback { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; opacity:.18; }
.pdm-stage { flex:1; position:relative; display:flex; align-items:center; justify-content:center; overflow:hidden; min-height:360px; }
.pdm-stage__image-wrap { position:relative; width:100%; height:100%; display:flex; align-items:center; justify-content:center; min-height:360px; }
.pdm-stage__image { max-width:100%; max-height:500px; object-fit:contain; display:block; animation:pdm-img-in .35s ease; }
@keyframes pdm-img-in{from{opacity:0;transform:scale(.97)}to{opacity:1;transform:scale(1)}}
.pdm-stage__video-wrap { width:100%; height:100%; display:flex; flex-direction:column; align-items:stretch; justify-content:center; min-height:360px; position:relative; }
.pdm-stage__video { width:100%; max-height:500px; background:#000; outline:none; display:block; }
.pdm-stage__caption { position:absolute; bottom:0; left:0; right:0; padding:.65rem 1rem; background:linear-gradient(transparent,rgba(0,0,0,.82)); color:rgba(255,255,255,.82); font-size:.8rem; font-weight:500; }
.pdm-stage__audio-wrap { width:100%; padding:2rem; display:flex; align-items:center; justify-content:center; min-height:300px; }
.pdm-audio-player { display:flex; flex-direction:column; align-items:center; gap:1.25rem; width:100%; max-width:360px; }
.pdm-audio-player__wave { display:flex; align-items:flex-end; gap:3px; height:56px; }
.pdm-audio-player__bar { width:4px; background:linear-gradient(to top,#8c1515,#e06060); border-radius:2px; animation:audio-wave 1.2s ease-in-out infinite alternate; display:block; min-height:4px; }
@keyframes audio-wave{from{transform:scaleY(.3);opacity:.5}to{transform:scaleY(1);opacity:1}}
.pdm-audio-player__title { font-size:.9rem; font-weight:600; color:rgba(255,255,255,.7); text-align:center; }
.pdm-audio-player__ctrl { width:100%; border-radius:8px; }
.pdm-ext-link { display:inline-flex; align-items:center; gap:.35rem; color:rgba(255,255,255,.5); font-size:.78rem; text-decoration:none; transition:color .15s; }
.pdm-ext-link:hover { color:#e06060; }
.pdm-stage__doc-wrap { width:100%; display:flex; align-items:center; justify-content:center; min-height:360px; padding:2rem; }
.pdm-doc-card { background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.1); border-radius:16px; padding:2.5rem 2rem; display:flex; flex-direction:column; align-items:center; gap:.85rem; max-width:320px; width:100%; text-align:center; }
.pdm-doc-card__icon { width:72px; height:72px; border-radius:16px; background:rgba(140,21,21,.15); border:1px solid rgba(140,21,21,.25); display:flex; align-items:center; justify-content:center; color:#e06060; }
.pdm-doc-card__type { font-size:.7rem; font-weight:800; letter-spacing:.1em; color:rgba(255,255,255,.35); text-transform:uppercase; }
.pdm-doc-card__name { font-size:.95rem; font-weight:600; color:rgba(255,255,255,.8); line-height:1.4; }
.pdm-doc-card__actions { display:flex; flex-direction:column; gap:.5rem; width:100%; margin-top:.5rem; }
.pdm-doc-btn { display:inline-flex; align-items:center; justify-content:center; gap:.4rem; padding:.6rem 1rem; border-radius:10px; font-size:.82rem; font-weight:700; text-decoration:none; transition:all .2s ease; }
.pdm-doc-btn--primary { background:#8c1515; color:#fff; border:1px solid rgba(200,80,80,.3); }
.pdm-doc-btn--primary:hover { background:#a61c1c; transform:translateY(-1px); }
.pdm-arrow { position:absolute; top:50%; transform:translateY(-50%); width:42px; height:42px; border-radius:50%; background:rgba(0,0,0,.55); border:1px solid rgba(255,255,255,.12); color:rgba(255,255,255,.85); cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all .2s ease; backdrop-filter:blur(6px); z-index:10; }
.pdm-arrow--prev { right:1rem; }
.pdm-arrow--next { left:1rem; }
.pdm-arrow:hover:not(:disabled) { background:rgba(140,21,21,.75); border-color:rgba(200,80,80,.4); transform:translateY(-50%) scale(1.08); }
.pdm-arrow:disabled { opacity:.2; cursor:default; }
.pdm-counter { position:absolute; bottom:1rem; right:1rem; background:rgba(0,0,0,.55); border:1px solid rgba(255,255,255,.1); color:rgba(255,255,255,.65); font-size:.72rem; font-weight:700; padding:.28rem .6rem; border-radius:99px; backdrop-filter:blur(6px); z-index:10; }
.pdm-thumbs { flex:0 0 auto; display:flex; gap:.4rem; padding:.65rem .75rem; background:rgba(0,0,0,.4); border-top:1px solid rgba(255,255,255,.06); overflow-x:auto; scrollbar-width:none; }
.pdm-thumbs::-webkit-scrollbar{display:none}
.pdm-thumb { flex:0 0 64px; height:48px; border-radius:8px; overflow:hidden; border:2px solid transparent; background:rgba(255,255,255,.07); cursor:pointer; transition:all .2s ease; display:flex; align-items:center; justify-content:center; position:relative; padding:0; }
.pdm-thumb:hover { border-color:rgba(255,255,255,.3); transform:translateY(-2px); }
.pdm-thumb--on { border-color:#8c1515!important; box-shadow:0 0 0 1px rgba(140,21,21,.5); }
.pdm-thumb img { width:100%; height:100%; object-fit:cover; display:block; }
.pdm-thumb__icon { display:flex; align-items:center; justify-content:center; width:100%; height:100%; color:rgba(255,255,255,.5); }
.pdm-thumb__icon--video{color:#e05050}.pdm-thumb__icon--audio{color:#a060e0}.pdm-thumb__icon--doc{color:#6090e0}
.pdm-thumb__bar { position:absolute; bottom:0; left:0; right:0; height:2px; background:#8c1515; }

/* ── DETAIL INFO PANEL ── */
.pdm-info { display:flex; flex-direction:column; background:#faf8f5; border-right:1px solid rgba(0,0,0,.08); max-height:calc(100vh - 3rem); overflow:hidden; }
.pdm-info__head { flex:0 0 auto; padding:1.6rem 1.4rem 1.1rem; background:#fff; border-bottom:1px solid #ece7df; }
.pdm-info__head-meta { display:flex; align-items:center; gap:.5rem; margin-bottom:.7rem; flex-wrap:wrap; }
.pdm-id-tag { font-size:.72rem; font-weight:700; color:#b0a898; letter-spacing:.06em; }

/* ✅ Status badge in detail modal */
.pdm-status-badge { display:inline-flex; align-items:center; gap:.38rem; padding:.22rem .65rem; border-radius:99px; font-size:.72rem; font-weight:700; }
.pdm-status-badge__dot { width:7px; height:7px; border-radius:50%; }
.pdm-status-badge--ongoing  { background:rgba(243,156,18,.1); color:#8c5f00; border:1px solid rgba(243,156,18,.3); }
.pdm-status-badge--ongoing  .pdm-status-badge__dot { background:#f39c12; }
.pdm-status-badge--completed { background:rgba(39,174,96,.1); color:#166040; border:1px solid rgba(39,174,96,.28); }
.pdm-status-badge--completed .pdm-status-badge__dot { background:#27ae60; }

/* ✅ Bilingual types in detail modal */
.pdm-types { display:flex; gap:.4rem; flex-wrap:wrap; margin-bottom:.65rem; }
.pdm-type-tag { display:inline-flex; padding:.22rem .65rem; border-radius:99px; font-size:.73rem; font-weight:700; letter-spacing:.03em; }
.pdm-type-tag--ckb { background:rgba(140,21,21,.08); color:#8c1515; border:1px solid rgba(140,21,21,.16); }
.pdm-type-tag--kmr { background:rgba(30,90,200,.08); color:#1a47a0; border:1px solid rgba(30,90,200,.18); }

.pdm-title { font-size:1.35rem; font-weight:800; color:#1a1410; line-height:1.25; letter-spacing:-.02em; margin:0 0 .3rem; }
.pdm-subtitle { font-size:.88rem; color:#9a9286; font-weight:500; margin:0 0 .7rem; }
.pdm-langs { display:flex; align-items:center; gap:.4rem; flex-wrap:wrap; margin-bottom:1rem; }
.pdm-lang { display:inline-flex; padding:.2rem .65rem; border-radius:6px; font-size:.72rem; font-weight:700; }
.pdm-lang--ckb { background:rgba(254,221,0,.14); color:#7a6200; border:1px solid rgba(254,221,0,.35); }
.pdm-lang--kmr { background:rgba(40,90,220,.08); color:#2848b0; border:1px solid rgba(40,90,220,.18); }
.pdm-date { display:inline-flex; align-items:center; gap:.3rem; font-size:.72rem; color:#a09888; font-weight:600; margin-right:auto; }
.pdm-edit-btn { display:inline-flex; align-items:center; gap:.4rem; padding:.55rem 1.1rem; border-radius:10px; background:#8c1515; color:#fff; border:none; font-size:.82rem; font-weight:700; text-decoration:none; cursor:pointer; transition:all .2s ease; width:100%; justify-content:center; font-family:inherit; box-shadow:0 4px 16px rgba(140,21,21,.28); }
.pdm-edit-btn:hover { background:#a61c1c; transform:translateY(-1px); }
.pdm-tabs { flex:0 0 auto; display:flex; background:#f0ece5; border-bottom:1px solid #e4dfd7; }
.pdm-tab { flex:1; display:inline-flex; align-items:center; justify-content:center; gap:.4rem; padding:.65rem 1rem; border:none; background:none; color:#9a9286; font-weight:700; font-size:.83rem; cursor:pointer; transition:all .2s; font-family:inherit; border-bottom:2px solid transparent; }
.pdm-tab--on { color:#8c1515; background:#faf8f5; border-bottom-color:#8c1515; }
.pdm-tab__pip { width:7px; height:7px; border-radius:50%; }
.pdm-tab__pip--ckb{background:#c8a800}.pdm-tab__pip--kmr{background:#4a7af0}
.pdm-info__body { flex:1; overflow-y:auto; display:flex; flex-direction:column; gap:0; scroll-behavior:smooth; padding-bottom:1.5rem; }
.pdm-info__body::-webkit-scrollbar{width:3px}.pdm-info__body::-webkit-scrollbar-track{background:transparent}.pdm-info__body::-webkit-scrollbar-thumb{background:#d4cec6;border-radius:99px}

/* ── ACCORDION ── */
.acc { border-bottom:1px solid #ede8e0; }
.acc:last-child{border-bottom:none}
.acc__hd { width:100%; display:flex; align-items:center; justify-content:space-between; padding:.95rem 1.3rem; background:none; border:none; cursor:pointer; font-family:inherit; transition:background .18s ease; gap:.5rem; }
.acc__hd:hover{background:rgba(140,21,21,.03)}
.acc__hd--system:hover{background:rgba(100,80,50,.04)}
.acc__hd-left { display:flex; align-items:center; gap:.7rem; flex:1; min-width:0; }
.acc__ico { width:32px; height:32px; border-radius:9px; display:flex; align-items:center; justify-content:center; flex-shrink:0; transition:transform .2s ease; }
.acc__hd:hover .acc__ico{transform:scale(1.08)}
.acc__ico--desc   {background:rgba(140,21,21,.09);color:#8c1515;border:1px solid rgba(140,21,21,.16)}
.acc__ico--loc    {background:rgba(22,120,70,.09);color:#166044;border:1px solid rgba(22,120,70,.18)}
.acc__ico--content{background:rgba(200,120,0,.09);color:#8c5800;border:1px solid rgba(200,120,0,.18)}
.acc__ico--tag    {background:rgba(200,168,0,.12);color:#7a6200;border:1px solid rgba(200,168,0,.22)}
.acc__ico--kw     {background:rgba(40,90,220,.09);color:#2848b0;border:1px solid rgba(40,90,220,.16)}
.acc__ico--media  {background:rgba(80,40,140,.09);color:#5028a0;border:1px solid rgba(80,40,140,.16)}
.acc__ico--sys    {background:rgba(80,80,80,.08);color:#505050;border:1px solid rgba(80,80,80,.14)}
.acc__title { font-size:.92rem; font-weight:700; color:#1e1812; letter-spacing:-.01em; }
.acc__badge { display:inline-flex; padding:.18rem .58rem; border-radius:99px; font-size:.71rem; font-weight:800; letter-spacing:.04em; background:rgba(140,21,21,.08); color:#8c1515; border:1px solid rgba(140,21,21,.14); }
.acc__badge--tag  {background:rgba(200,168,0,.12);color:#7a6200;border-color:rgba(200,168,0,.22)}
.acc__badge--kw   {background:rgba(40,90,220,.09);color:#2848b0;border-color:rgba(40,90,220,.16)}
.acc__badge--media{background:rgba(80,40,140,.09);color:#5028a0;border-color:rgba(80,40,140,.16)}
.acc__chevron { color:#c8c0b4; flex-shrink:0; transition:transform .28s cubic-bezier(.34,1.56,.64,1),color .18s; }
.acc__chevron--open{transform:rotate(180deg);color:#8c1515}
.acc__hd:hover .acc__chevron{color:#8c1515}
.acc__body { overflow:hidden; padding:0 1.3rem 1.1rem; }
.acc__body--flush { padding:0 0 .5rem; }
.acc-body-enter-active{transition:all .3s cubic-bezier(.22,1,.36,1)}
.acc-body-leave-active{transition:all .22s ease}
.acc-body-enter-from,.acc-body-leave-to{opacity:0;transform:translateY(-6px)}
.acc__text--desc { font-size:.9rem; color:#2e2418; line-height:1.85; white-space:pre-line; margin:0; padding:.2rem 0; max-height:260px; overflow-y:auto; scrollbar-width:thin; scrollbar-color:#d4cec6 transparent; }
.acc__location { display:inline-flex; align-items:center; gap:.5rem; font-size:.9rem; font-weight:700; color:#166044; background:rgba(22,120,70,.07); border:1px solid rgba(22,120,70,.15); padding:.5rem 1rem; border-radius:10px; }
.acc__chips { display:flex; flex-wrap:wrap; gap:.42rem; }
.acc__chip { display:inline-flex; align-items:center; gap:.3rem; padding:.32rem .78rem; border-radius:8px; font-size:.82rem; font-weight:600; letter-spacing:.01em; cursor:default; transition:transform .15s ease,box-shadow .15s ease; }
.acc__chip:hover{transform:translateY(-2px);box-shadow:0 4px 12px rgba(0,0,0,.1)}
.acc__chip--content{background:rgba(140,21,21,.07);color:#8c1515;border:1px solid rgba(140,21,21,.15)}
.acc__chip--tag    {background:rgba(200,168,0,.11);color:#7a6200;border:1px solid rgba(200,168,0,.22)}
.acc__chip--kw     {background:rgba(40,90,220,.08);color:#2848b0;border:1px solid rgba(40,90,220,.15)}
.acc__media-row { display:flex; align-items:center; gap:.8rem; padding:.8rem 1.3rem; border-bottom:1px solid #f5f0e8; cursor:pointer; transition:background .15s ease; }
.acc__media-row:last-child{border-bottom:none}
.acc__media-row:hover{background:#faf6f0}
.acc__media-row--on{background:rgba(140,21,21,.04)}
.acc__media-ico { width:36px; height:36px; border-radius:9px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.acc__media-ico--image   {background:rgba(140,21,21,.08);color:#8c1515;border:1px solid rgba(140,21,21,.15)}
.acc__media-ico--video   {background:rgba(220,50,50,.08);color:#c0392b;border:1px solid rgba(220,50,50,.15)}
.acc__media-ico--audio   {background:rgba(130,60,200,.08);color:#7030a0;border:1px solid rgba(130,60,200,.15)}
.acc__media-ico--pdf     {background:rgba(220,80,0,.08);color:#c05000;border:1px solid rgba(220,80,0,.15)}
.acc__media-ico--document{background:rgba(30,100,200,.08);color:#1a55aa;border:1px solid rgba(30,100,200,.15)}
.acc__media-info{flex:1;min-width:0}
.acc__media-type{font-size:.68rem;font-weight:800;color:#b8b0a4;letter-spacing:.07em;text-transform:uppercase;margin-bottom:.18rem}
.acc__media-cap{font-size:.84rem;color:#2e2418;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.acc__media-cap--url{font-size:.72rem;color:#b8b0a4;font-family:'Courier New',monospace;font-weight:400}
.acc__media-playing{display:flex;align-items:flex-end;gap:2.5px;height:16px;flex-shrink:0}
.acc__media-playing__dot{width:3px;border-radius:2px;background:#8c1515;animation:playing-bar .9s ease-in-out infinite alternate;display:block}
.acc__media-playing__dot:nth-child(1){height:8px;animation-delay:0s}
.acc__media-playing__dot:nth-child(2){height:14px;animation-delay:.18s}
.acc__media-playing__dot:nth-child(3){height:6px;animation-delay:.34s}
@keyframes playing-bar{from{transform:scaleY(.3);opacity:.5}to{transform:scaleY(1);opacity:1}}
.acc--system{background:#faf7f2}
.acc__sys-grid{display:grid;grid-template-columns:1fr 1fr;padding:0 1.3rem .75rem;gap:0}
.acc__sys-cell{padding:.72rem .65rem .72rem 0;border-bottom:1px solid #ede8e0;border-left:1px solid #ede8e0}
.acc__sys-cell:nth-child(odd){border-left:none;padding-right:.65rem}
.acc__sys-cell--full{grid-column:1/-1;border-left:none}
.acc__sys-cell:last-child,.acc__sys-cell:nth-last-child(2):not(.acc__sys-cell--full){border-bottom:none}
.acc__sys-k{font-size:.68rem;font-weight:700;color:#c0b8ac;letter-spacing:.05em;margin-bottom:.25rem;text-transform:uppercase}
.acc__sys-v{font-size:.84rem;color:#2e2418;font-weight:600;line-height:1.4}
.acc__sys-v--mono{font-family:'Courier New',monospace;font-size:.78rem;letter-spacing:.04em}
.acc__sys-v--link{color:#8c1515;font-size:.73rem;font-weight:500;word-break:break-all;text-decoration:none;display:block}
.acc__sys-v--link:hover{text-decoration:underline}

/* Transitions */
.pdm-fade-enter-active,.pdm-fade-leave-active{transition:opacity .3s ease}
.pdm-fade-enter-from,.pdm-fade-leave-to{opacity:0}
.pdm-rise-enter-active{transition:opacity .38s ease,transform .38s cubic-bezier(.22,1,.36,1)}
.pdm-rise-leave-active{transition:opacity .22s ease,transform .22s ease}
.pdm-rise-enter-from{opacity:0;transform:scale(.94) translateY(20px)}
.pdm-rise-leave-to{opacity:0;transform:scale(.97) translateY(10px)}
</style>