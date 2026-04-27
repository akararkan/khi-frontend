<template>
  <main class="pub" :dir="lang.dir" :class="{ 'pub--ltr': lang.isKMR }">
    <transition name="page" mode="out-in">
 
      <div v-if="activeItem" key="detail" class="detail">
        <nav class="dnav">
          <div class="container dnav__inner">
            <button class="back-btn" @click="closeItem">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              <span>{{ lbl('back') }}</span>
            </button>
            <div class="dnav__right">
              <span class="dtype-pill">{{ getMediaIcon(activeItem._mediaType) }} {{ getMediaTypeLabel(activeItem._mediaType) }}</span>
              <div class="langpills" v-if="activeItem.contentLanguages?.length">
                <span v-for="l in activeItem.contentLanguages" :key="l" class="langpill" :class="{ 'langpill--on': lang.activeLang === l }">
                  <span class="langpill__dot" :class="`lpdot--${l.toLowerCase()}`"></span>{{ l }}
                </span>
              </div>
            </div>
          </div>
        </nav>
 
        <header class="dhero">
          <div class="dhero__bg" :style="{ backgroundImage: `url(${pCover(activeItem)})` }"></div>
          <div class="dhero__gradient"></div>
          <div class="dhero__gradient dhero__gradient--side"></div>
          <div class="dhero__grain"></div>
          <div class="dhero__scanlines"></div>
          <div class="dhero__frame dhero__frame--tl"></div>
          <div class="dhero__frame dhero__frame--br"></div>
          <div class="dhero__gold-line dhero__gold-line--top"></div>
          <div class="dhero__gold-line dhero__gold-line--bottom"></div>
          <div class="container dhero__content">
            <transition name="lang-swap" mode="out-in">
              <div :key="lang.activeLang" class="dhero__left">
                <div class="dhero__badges">
                  <span class="dbadge dbadge--type">{{ getTypeEmoji(activeItem) }} {{ getTypeLabel(activeItem) }}</span>
                  <span class="dbadge" v-if="getItemDate(activeItem)">📅 {{ formatDate(getItemDate(activeItem)) }}</span>
                  <span class="dbadge dbadge--mem" v-if="activeItem.albumOfMemories">💫 {{ lbl('albumOfMemories') }}</span>
                  <span class="dbadge" v-if="activeItem.thisProjectOfInstitute">🏛️ {{ lbl('institute') }}</span>
                  <span class="dbadge dbadge--topic" v-if="pTopicName(activeItem)">🏷️ {{ pTopicName(activeItem) }}</span>
                </div>
                <h1 class="dhero__title">{{ pTitle(activeItem) }}</h1>
                <p class="dhero__desc" v-if="pDesc(activeItem)">{{ pDesc(activeItem) }}</p>
                <div class="dhero__stats">
                  <template v-if="activeItem._mediaType === 'sound'">
                    <div class="dstat" v-if="activeItem.files?.length"><span class="dstat__ico">🎵</span><span class="dstat__val">{{ activeItem.files.length }}</span><span class="dstat__lbl">{{ lbl('tracks') }}</span></div>
                    <div class="dstat" v-if="activeItem.soundType"><span class="dstat__ico">🎼</span><span class="dstat__val">{{ activeItem.soundType }}</span></div>
                    <div class="dstat" v-if="activeItem.reader"><span class="dstat__ico">🎤</span><span class="dstat__val">{{ activeItem.reader }}</span></div>
                    <div class="dstat" v-if="activeItem.directors?.length"><span class="dstat__ico">🎬</span><span class="dstat__val">{{ activeItem.directors.join('، ') }}</span></div>
                    <div class="dstat" v-if="totalSoundDuration > 0"><span class="dstat__ico">⏱</span><span class="dstat__val">{{ formatTime(totalSoundDuration) }}</span></div>
                    <div class="dstat" v-if="activeItem.trackState === 'MULTI' && activeItem.albumName"><span class="dstat__ico">💿</span><span class="dstat__val">{{ activeItem.albumName }}</span></div>
                    <div class="dstat" v-if="activeItem.publishmentYear"><span class="dstat__ico">📅</span><span class="dstat__val">{{ activeItem.publishmentYear }}</span></div>
                    <div class="dstat" v-if="activeItem.terms"><span class="dstat__ico">🗣</span><span class="dstat__val">{{ activeItem.terms }}</span></div>
                    <div class="dstat" v-if="activeItem.totalSizeBytes > 0"><span class="dstat__ico">💾</span><span class="dstat__val">{{ formatSize(activeItem.totalSizeBytes) }}</span></div>
                  </template>
                  <template v-else-if="activeItem._mediaType === 'video'">
                    <div class="dstat" v-if="activeItem.durationSeconds"><span class="dstat__ico">⏱</span><span class="dstat__val">{{ formatTime(activeItem.durationSeconds) }}</span></div>
                    <div class="dstat" v-if="pDirector(activeItem)"><span class="dstat__ico">🎬</span><span class="dstat__val">{{ pDirector(activeItem) }}</span></div>
                    <div class="dstat" v-if="pProducer(activeItem)"><span class="dstat__ico">🎞</span><span class="dstat__val">{{ pProducer(activeItem) }}</span></div>
                    <div class="dstat" v-if="activeItem.resolution"><span class="dstat__ico">📺</span><span class="dstat__val">{{ activeItem.resolution }}</span></div>
                    <div class="dstat" v-if="activeItem.fileFormat"><span class="dstat__ico">🎞</span><span class="dstat__val">{{ activeItem.fileFormat }}</span></div>
                    <div class="dstat" v-if="activeItem.fileSizeMb"><span class="dstat__ico">💾</span><span class="dstat__val">{{ activeItem.fileSizeMb?.toFixed(1) }} MB</span></div>
                    <div class="dstat" v-if="activeItem.videoClipItems?.length"><span class="dstat__ico">📹</span><span class="dstat__val">{{ activeItem.videoClipItems.length }}</span><span class="dstat__lbl">{{ lbl('clips') }}</span></div>
                    <div class="dstat" v-if="pLocation(activeItem)"><span class="dstat__ico">📍</span><span class="dstat__val">{{ pLocation(activeItem) }}</span></div>
                  </template>
                  <template v-else-if="activeItem._mediaType === 'writing'">
                    <div class="dstat" v-if="pPageCount(activeItem)"><span class="dstat__ico">📄</span><span class="dstat__val">{{ pPageCount(activeItem) }}</span><span class="dstat__lbl">{{ lbl('pages') }}</span></div>
                    <div class="dstat" v-if="pWriter(activeItem)"><span class="dstat__ico">✍️</span><span class="dstat__val">{{ pWriter(activeItem) }}</span></div>
                    <div class="dstat" v-if="activeItem.bookGenres?.length || activeItem.bookGenres?.size"><span class="dstat__ico">📚</span><span class="dstat__val">{{ [...(activeItem.bookGenres || [])].map(g => getGenreLabel(g)).join('، ') }}</span></div>
                    <div class="dstat" v-if="pFileFormat(activeItem)"><span class="dstat__ico">💾</span><span class="dstat__val">{{ pFileFormat(activeItem) }}</span></div>
                    <div class="dstat" v-if="pFileSizeBytes(activeItem)"><span class="dstat__ico">📁</span><span class="dstat__val">{{ formatSize(pFileSizeBytes(activeItem)) }}</span></div>
                    <div class="dstat" v-if="activeItem.publishedByInstitute"><span class="dstat__ico">🏛️</span><span class="dstat__val">{{ lbl('institute') }}</span></div>
                  </template>
                  <template v-else-if="activeItem._mediaType === 'image'">
                    <div class="dstat" v-if="activeItem.imageAlbum?.length"><span class="dstat__ico">🖼️</span><span class="dstat__val">{{ activeItem.imageAlbum.length }}</span><span class="dstat__lbl">{{ lbl('images') }}</span></div>
                    <div class="dstat" v-if="activeItem.collectionType"><span class="dstat__ico">📷</span><span class="dstat__val">{{ activeItem.collectionType }}</span></div>
                    <div class="dstat" v-if="pLocation(activeItem)"><span class="dstat__ico">📍</span><span class="dstat__val">{{ pLocation(activeItem) }}</span></div>
                    <div class="dstat" v-if="pCollectedBy(activeItem)"><span class="dstat__ico">🏛️</span><span class="dstat__val">{{ pCollectedBy(activeItem) }}</span></div>
                    <div class="dstat" v-if="activeItem.publishmentDate"><span class="dstat__ico">📅</span><span class="dstat__val">{{ formatDate(activeItem.publishmentDate) }}</span></div>
                  </template>
                </div>
                <div class="dhero__tags" v-if="pTags(activeItem).length">
                  <span v-for="tag in pTags(activeItem)" :key="tag" class="dtag dtag--clickable" @click.stop="searchByTagGlobal(tag)" :title="`#${tag}`">#{{ tag }}</span>
                </div>
              </div>
            </transition>
            <div class="dhero__right">
              <div class="mockup-sound" v-if="activeItem._mediaType === 'sound'">
                <div class="msound__case"><div class="msound__spine"></div><div class="msound__front"><img :src="pCover(activeItem)" :alt="pTitle(activeItem)" @error="onImgError($event)" /><div class="msound__overlay"></div></div></div>
                <div class="msound__disc"><div class="msound__disc-ring"></div><div class="msound__disc-art"><img :src="pCover(activeItem)" :alt="pTitle(activeItem)" @error="onImgError($event)" /></div><div class="msound__disc-hole"></div></div>
              </div>
              <div class="mockup-book" v-else-if="activeItem._mediaType === 'writing'">
                <div class="mbook__spine"></div><div class="mbook__cover"><img :src="pCover(activeItem)" :alt="pTitle(activeItem)" @error="onImgError($event)" /><div class="mbook__sheen"></div></div><div class="mbook__pages"></div>
              </div>
              <div class="mockup-video" v-else-if="activeItem._mediaType === 'video'">
                <div class="mvideo__frame"><img :src="pCover(activeItem)" :alt="pTitle(activeItem)" @error="onImgError($event)" /><div class="mvideo__play-ico">▶</div></div><div class="mvideo__stand"></div>
              </div>
              <div class="mockup-image" v-else-if="activeItem._mediaType === 'image'">
                <div class="mimage__frame"><div class="mimage__mat"></div><div class="mimage__photo"><img :src="pCover(activeItem)" :alt="pTitle(activeItem)" @error="onImgError($event)" /></div></div>
              </div>
            </div>
          </div>
        </header>
 
        <!-- ══ SOUND ══ -->
        <section class="stream-section" v-if="activeItem._mediaType === 'sound' && activeItem.files?.length">
          <div class="container">
            <div class="stream-layout">
              <div class="stream-main">
                <div class="stream-head">
                  <h3 class="section-heading">{{ lbl('yourStream') }}</h3>
                  <span class="stream-count">{{ activeItem.files.length }} {{ lbl('tracks') }}</span>
                </div>
                <div v-if="audioError" class="audio-error"><span>⚠️ {{ audioError }}</span></div>
                <div class="track-list">
                  <div
                    v-for="(file, i) in activeItem.files" :key="file.id || i"
                    class="track"
                    :class="{ 'track--playing': currentTrackIdx === i && isAudioPlaying, 'track--selected': currentTrackIdx === i }"
                    @click="playTrack(file, i)"
                  >
                    <div class="track__num">{{ String(i + 1).padStart(2, '0') }}</div>
                    <div class="track__cover">
                      <img :src="pCover(activeItem)" :alt="`Track ${i + 1}`" @error="onImgError($event)" />
                      <div class="track__play-ico"><span>{{ currentTrackIdx === i && isAudioPlaying ? '⏸' : '▶' }}</span></div>
                    </div>
                    <div class="track__indicator">
                      <span v-for="b in 3" :key="b" class="track__bar" :class="{ 'track__bar--live': currentTrackIdx === i && isAudioPlaying }" :style="{ '--b': b }"></span>
                    </div>
                    <div class="track__info">
                      <div class="track__title">{{ file.title || `${lbl('track')} ${i + 1}` }}</div>
                      <div class="track__sub-row">
                        <span v-if="file.fileType" class="track__chip">{{ file.fileType }}</span>
                        <span v-if="file.genre" class="track__chip">{{ file.genre }}</span>
                        <span v-if="file.form" class="track__chip">{{ file.form }}</span>
                        <span v-if="file.audioChannel" class="track__chip">{{ file.audioChannel }}</span>
                        <span v-if="file.publishmentYear" class="track__chip">{{ file.publishmentYear }}</span>
                      </div>
                      <div class="track__extra-row" v-if="file.recordingVenue || file.bitRate || file.sampleRate">
                        <span v-if="file.recordingVenue" class="track__extra-item">📍 {{ file.recordingVenue }}</span>
                        <span v-if="file.bitRate" class="track__extra-item">🔊 {{ file.bitRate }}</span>
                        <span v-if="file.sampleRate" class="track__extra-item">〰 {{ file.sampleRate }}</span>
                      </div>
                      <!-- Inline controls — only visible for the selected track -->
                      <div class="track__inline-controls" v-if="currentTrackIdx === i" @click.stop>
                        <button class="iabtn" @click.stop="prevTrack" :disabled="currentTrackIdx <= 0">⏮</button>
                        <button class="iabtn iabtn--play" @click.stop="togglePlay">{{ isAudioPlaying ? '⏸' : '▶' }}</button>
                        <button class="iabtn" @click.stop="nextTrack" :disabled="currentTrackIdx >= activeItem.files.length - 1">⏭</button>
                        <span class="track__inline-time">
                          <span class="itime__cur">{{ formatTime(audioCurrentTime) }}</span>
                          <span class="itime__sep">/</span>
                          <span class="itime__dur">{{ formatTime(audioDuration) }}</span>
                        </span>
                      </div>
                    </div>
                    <div class="track__waves" @click.stop="seekByWave($event, i)">
                      <div class="wave-wrap" :class="{ 'wave-wrap--live': currentTrackIdx === i && isAudioPlaying }">
                        <span
                          v-for="(h, bi) in getWaveform(file.id || i)"
                          :key="bi"
                          class="wbar"
                          :class="{
                            'wbar--played':  currentTrackIdx === i && bi < playedBars,
                            'wbar--current': currentTrackIdx === i && bi === playedBars,
                            'wbar--live':    currentTrackIdx === i && isAudioPlaying && bi > playedBars
                          }"
                          :style="{ '--h': h, '--bi': bi }"
                        ></span>
                      </div>
                      <div class="wave-time" v-if="currentTrackIdx === i">{{ formatTime(audioCurrentTime) }} / {{ formatTime(audioDuration) }}</div>
                    </div>
                    <div class="track__right">
                      <span class="track__dur" v-if="file.durationSeconds">{{ formatTime(file.durationSeconds) }}</span>
                      <span class="track__size" v-if="file.sizeBytes > 0">{{ formatSize(file.sizeBytes) }}</span>
                    </div>
                  </div>
                </div>
                <!-- Brochures for selected track -->
                <div class="track-brochures" v-if="currentTrack?.brochures?.length">
                  <h4 class="track-brochures__title">بروشووری تراک</h4>
                  <div class="track-brochures__grid">
                    <div v-for="(br, bi) in currentTrack.brochures" :key="br.id || bi" class="brochure-thumb" @click="openFullscreen(br.imageUrl)">
                      <img :src="br.imageUrl" :alt="br.caption || ''" @error="onImgError($event)" />
                      <span v-if="br.caption" class="brochure-thumb__cap">{{ br.caption }}</span>
                    </div>
                  </div>
                </div>
                <!-- Hidden audio element -->
                <audio ref="audioPlayer" style="display:none" preload="auto"
                  @loadedmetadata="onAudioLoaded" @timeupdate="onAudioTimeUpdate"
                  @play="isAudioPlaying = true" @pause="isAudioPlaying = false"
                  @ended="onTrackEnded" @error="onAudioError"></audio>
              </div>
              <!-- Side panel -->
              <div class="stream-side">
                <div class="side-featured">
                  <h4 class="side-heading">{{ lbl('featured') }}</h4>
                  <div class="side-cover">
                    <img :src="pCover(activeItem)" :alt="pTitle(activeItem)" @error="onImgError($event)" />
                    <div class="side-cover__overlay"><div class="side-cover__title">{{ pTitle(activeItem) }}</div></div>
                  </div>
                  <div class="side-meta">
                    <div class="side-meta__row" v-if="activeItem.soundType"><span class="side-meta__key">{{ lbl('type') }}</span><span class="side-meta__val">{{ activeItem.soundType }}</span></div>
                    <div class="side-meta__row" v-if="activeItem.trackState"><span class="side-meta__key">دۆخ</span><span class="side-meta__val sfm-value--badge">{{ activeItem.trackState }}</span></div>
                    <div class="side-meta__row" v-if="activeItem.reader"><span class="side-meta__key">{{ lbl('reader') }}</span><span class="side-meta__val">{{ activeItem.reader }}</span></div>
                    <div class="side-meta__row" v-if="activeItem.directors?.length"><span class="side-meta__key">{{ lbl('director') }}</span><span class="side-meta__val">{{ activeItem.directors.join('، ') }}</span></div>
                    <div class="side-meta__row" v-if="activeItem.terms"><span class="side-meta__key">زاراوە</span><span class="side-meta__val">{{ activeItem.terms }}</span></div>
                    <div class="side-meta__row" v-if="activeItem.totalDurationSeconds > 0"><span class="side-meta__key">کاتی گشتی</span><span class="side-meta__val">{{ formatTime(activeItem.totalDurationSeconds) }}</span></div>
                    <div class="side-meta__row" v-if="activeItem.totalSizeBytes > 0"><span class="side-meta__key">قەبارە</span><span class="side-meta__val">{{ formatSize(activeItem.totalSizeBytes) }}</span></div>
                    <template v-for="loc in (activeItem.locations || []).slice(0, 3)" :key="loc">
                      <div class="side-meta__row"><span class="side-meta__key">📍</span><span class="side-meta__val">{{ loc }}</span></div>
                    </template>
                  </div>
                  <div class="side-covers-row" v-if="activeItem.ckbCoverUrl || activeItem.kmrCoverUrl || activeItem.hoverCoverUrl">
                    <div class="cover-slot" v-if="activeItem.ckbCoverUrl" @click="openFullscreen(activeItem.ckbCoverUrl)"><img :src="activeItem.ckbCoverUrl" alt="CKB Cover" @error="onImgError($event)" /><span class="cover-slot__lbl">CKB</span></div>
                    <div class="cover-slot" v-if="activeItem.kmrCoverUrl" @click="openFullscreen(activeItem.kmrCoverUrl)"><img :src="activeItem.kmrCoverUrl" alt="KMR Cover" @error="onImgError($event)" /><span class="cover-slot__lbl">KMR</span></div>
                    <div class="cover-slot" v-if="activeItem.hoverCoverUrl" @click="openFullscreen(activeItem.hoverCoverUrl)"><img :src="activeItem.hoverCoverUrl" alt="Hover" @error="onImgError($event)" /><span class="cover-slot__lbl">HOVER</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
 
        <!-- ══ SOUND Full Metadata ══ -->
        <section class="sound-full-meta" v-if="activeItem._mediaType === 'sound'">
          <div class="container">
            <div class="sfm-block" v-if="activeItem.trackState === 'MULTI' && (activeItem.albumName || activeItem.publishmentYear || activeItem.cdNumber || activeItem.totalTracks)">
              <h3 class="sfm-block__title">زانیاری ئەلبووم</h3>
              <div class="sfm-grid">
                <div class="sfm-item" v-if="activeItem.albumName"><span class="sfm-label">ناوی ئەلبووم</span><span class="sfm-value">{{ activeItem.albumName }}</span></div>
                <div class="sfm-item" v-if="activeItem.publishmentYear"><span class="sfm-label">ساڵی بڵاوکردنەوە</span><span class="sfm-value">{{ activeItem.publishmentYear }}</span></div>
                <div class="sfm-item" v-if="activeItem.cdNumber"><span class="sfm-label">ژمارەی CD</span><span class="sfm-value">{{ activeItem.cdNumber }}</span></div>
                <div class="sfm-item" v-if="activeItem.totalTracks"><span class="sfm-label">کۆی تراکەکان</span><span class="sfm-value">{{ activeItem.totalTracks }}</span></div>
              </div>
            </div>
            <div class="sfm-block">
              <h3 class="sfm-block__title">زانیاری تەکنیکی</h3>
              <div class="sfm-grid">
                <div class="sfm-item"><span class="sfm-label">جۆری دەنگ</span><span class="sfm-value">{{ activeItem.soundType || '—' }}</span></div>
                <div class="sfm-item"><span class="sfm-label">دۆخی تراک</span><span class="sfm-value sfm-value--badge">{{ activeItem.trackState }}</span></div>
                <div class="sfm-item" v-if="activeItem.reader"><span class="sfm-label">خوێنەر</span><span class="sfm-value">{{ activeItem.reader }}</span></div>
                <div class="sfm-item" v-if="activeItem.directors?.length"><span class="sfm-label">دەرهێنەران</span><span class="sfm-value">{{ activeItem.directors.join('، ') }}</span></div>
                <div class="sfm-item" v-if="activeItem.terms"><span class="sfm-label">زاراوە / شێوەزار</span><span class="sfm-value">{{ activeItem.terms }}</span></div>
                <div class="sfm-item" v-if="activeItem.thisProjectOfInstitute"><span class="sfm-label">پرۆژەی دامەزراوە</span><span class="sfm-value sfm-value--yes">بەڵێ ✓</span></div>
                <div class="sfm-item" v-if="activeItem.albumOfMemories"><span class="sfm-label">یادگاریەکان</span><span class="sfm-value sfm-value--yes">بەڵێ 💫</span></div>
                <div class="sfm-item" v-if="activeItem.files?.length"><span class="sfm-label">ژمارەی فایلەکان</span><span class="sfm-value">{{ activeItem.files.length }}</span></div>
                <div class="sfm-item" v-if="activeItem.totalDurationSeconds > 0"><span class="sfm-label">کاتی گشتی</span><span class="sfm-value">{{ formatTime(activeItem.totalDurationSeconds) }}</span></div>
                <div class="sfm-item" v-if="activeItem.totalSizeBytes > 0"><span class="sfm-label">قەبارەی گشتی</span><span class="sfm-value">{{ formatSize(activeItem.totalSizeBytes) }}</span></div>
              </div>
            </div>
            <div class="sfm-block" v-if="activeItem.ckbContent?.description || activeItem.kmrContent?.description">
              <h3 class="sfm-block__title">وەسف</h3>
              <div class="sfm-bilingual">
                <div class="sfm-lang-col" v-if="activeItem.ckbContent?.description"><span class="sfm-lang-badge sfm-lang-badge--ckb">سۆرانی</span><p class="sfm-desc">{{ activeItem.ckbContent.description }}</p></div>
                <div class="sfm-lang-col" v-if="activeItem.kmrContent?.description"><span class="sfm-lang-badge sfm-lang-badge--kmr">کورمانجی</span><p class="sfm-desc">{{ activeItem.kmrContent.description }}</p></div>
              </div>
            </div>
            <div class="sfm-block" v-if="activeItem.locations?.length">
              <h3 class="sfm-block__title">شوێنەکان</h3>
              <div class="sfm-chips"><span v-for="loc in activeItem.locations" :key="loc" class="sfm-chip sfm-chip--loc">📍 {{ loc }}</span></div>
            </div>
            <div class="sfm-block" v-if="activeItem.contentLanguages?.length">
              <h3 class="sfm-block__title">زمانی ناوەڕۆک</h3>
              <div class="sfm-chips"><span v-for="l in activeItem.contentLanguages" :key="l" class="sfm-chip">{{ l === 'CKB' ? 'سۆرانی' : l === 'KMR' ? 'کورمانجی' : l }}</span></div>
            </div>
            <div class="sfm-block" v-if="pTopicName(activeItem)">
              <h3 class="sfm-block__title">بابەت</h3>
              <div class="sfm-chips"><span class="sfm-chip sfm-chip--topic">🏷️ {{ pTopicName(activeItem) }}</span></div>
            </div>
            <div class="sfm-block" v-if="pTags(activeItem).length || pTagsOther(activeItem).length">
              <h3 class="sfm-block__title">{{ lbl('tags') }}</h3>
              <div class="sfm-bilingual-tags">
                <div v-if="pTagsCkb(activeItem).length"><span class="sfm-lang-badge sfm-lang-badge--ckb" style="margin-bottom:8px">سۆرانی</span><div class="sfm-chips" style="margin-top:8px"><span v-for="tag in pTagsCkb(activeItem)" :key="tag" class="sfm-chip sfm-chip--tag" @click="searchByTagGlobal(tag)">#{{ tag }}</span></div></div>
                <div v-if="pTagsKmr(activeItem).length"><span class="sfm-lang-badge sfm-lang-badge--kmr" style="margin-bottom:8px">کورمانجی</span><div class="sfm-chips" style="margin-top:8px"><span v-for="tag in pTagsKmr(activeItem)" :key="tag" class="sfm-chip sfm-chip--tag" @click="searchByTagGlobal(tag)">#{{ tag }}</span></div></div>
              </div>
            </div>
            <div class="sfm-block" v-if="activeItem.attachments?.length">
              <h3 class="sfm-block__title">هاوپێچەکان <span class="sfm-count">{{ activeItem.attachments.length }}</span></h3>
              <div class="sfm-attachments">
                <a v-for="(att, ai) in activeItem.attachments" :key="att.id || ai" :href="att.fileUrl" target="_blank" rel="noopener" class="sfm-attachment">
                  <span class="sfm-attachment__type">{{ att.attachmentType || 'FILE' }}</span>
                  <span class="sfm-attachment__title">{{ att.title || `هاوپێچ ${ai + 1}` }}</span>
                  <span class="sfm-attachment__meta"><span v-if="att.mimeType">{{ att.mimeType }}</span><span v-if="att.sizeBytes > 0">{{ formatSize(att.sizeBytes) }}</span></span>
                  <span class="sfm-attachment__arrow">↗</span>
                </a>
              </div>
            </div>
            <div class="sfm-block sfm-block--timestamps">
              <div class="sfm-ts" v-if="activeItem.createdAt"><span class="sfm-ts__label">دروستکراوە:</span><span class="sfm-ts__val">{{ formatDate(activeItem.createdAt) }}</span></div>
              <div class="sfm-ts" v-if="activeItem.updatedAt"><span class="sfm-ts__label">نوێکراوەتەوە:</span><span class="sfm-ts__val">{{ formatDate(activeItem.updatedAt) }}</span></div>
            </div>
          </div>
        </section>
 
        <!-- ══ VIDEO ══ -->
        <section class="video-section" v-if="activeItem._mediaType === 'video'">
          <div class="container">
            <template v-if="activeItem.videoType === 'VIDEO_CLIP' && activeItem.videoClipItems?.length">
              <div class="clips-layout">
                <div class="clips-player" v-if="selectedClip">
                  <div class="vplayer-wrap" v-if="getClipUrl(selectedClip)"><video class="vplayer-el" controls :poster="pCover(activeItem)" :key="getClipUrl(selectedClip)"><source :src="getClipUrl(selectedClip)" type="video/mp4" /></video></div>
                  <div class="vembed-wrap" v-else-if="getClipEmbedUrl(selectedClip)"><iframe :src="getClipEmbedUrl(selectedClip)" frameborder="0" allowfullscreen class="vembed"></iframe></div>
                  <div class="vno-source" v-else><div class="vno-source__icon">📹</div><div class="vno-source__text">{{ lbl('noSource') }}</div></div>
                  <div class="clip-meta-full">
                    <div class="clip-meta-full__chips">
                      <span v-if="selectedClip.resolution" class="vchip">📺 {{ selectedClip.resolution }}</span>
                      <span v-if="selectedClip.fileFormat" class="vchip">🎞 {{ selectedClip.fileFormat }}</span>
                      <span v-if="selectedClip.durationSeconds" class="vchip">⏱ {{ formatTime(selectedClip.durationSeconds) }}</span>
                      <span v-if="selectedClip.fileSizeMb" class="vchip">💾 {{ selectedClip.fileSizeMb?.toFixed(1) }}MB</span>
                      <span v-if="selectedClip.clipNumber" class="vchip">🔢 #{{ selectedClip.clipNumber }}</span>
                    </div>
                    <div class="clip-desc" v-if="lang.activeLang === 'CKB' ? selectedClip.descriptionCkb : selectedClip.descriptionKmr"><p>{{ lang.activeLang === 'CKB' ? selectedClip.descriptionCkb : selectedClip.descriptionKmr }}</p></div>
                    <div class="clip-titles" v-if="selectedClip.titleCkb || selectedClip.titleKmr">
                      <div class="clip-title-row" v-if="selectedClip.titleCkb"><span class="sfm-lang-badge sfm-lang-badge--ckb">سۆرانی</span><span>{{ selectedClip.titleCkb }}</span></div>
                      <div class="clip-title-row" v-if="selectedClip.titleKmr"><span class="sfm-lang-badge sfm-lang-badge--kmr">کورمانجی</span><span>{{ selectedClip.titleKmr }}</span></div>
                    </div>
                  </div>
                </div>
                <div class="clips-list">
                  <h4 class="clips-list__heading">{{ lbl('clips') }} ({{ activeItem.videoClipItems?.length }})</h4>
                  <div v-for="clip in activeItem.videoClipItems" :key="clip.id" class="clip-item" :class="{ 'clip-item--on': selectedClip?.id === clip.id }" @click="selectedClip = clip">
                    <div class="clip-item__num">{{ clip.clipNumber }}</div>
                    <div class="clip-item__info">
                      <div class="clip-item__title">{{ lang.activeLang === 'CKB' ? (clip.titleCkb || clip.titleKmr) : (clip.titleKmr || clip.titleCkb) || `Clip ${clip.clipNumber}` }}</div>
                      <div class="clip-item__meta"><span v-if="clip.durationSeconds">⏱ {{ formatTime(clip.durationSeconds) }}</span><span v-if="clip.resolution">{{ clip.resolution }}</span><span v-if="clip.fileFormat">{{ clip.fileFormat }}</span><span v-if="clip.fileSizeMb">{{ clip.fileSizeMb?.toFixed(1) }}MB</span></div>
                    </div>
                    <svg class="clip-item__play" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                  </div>
                </div>
              </div>
            </template>
            <template v-else>
              <div class="video-stage">
                <div class="vplayer-wrap" v-if="getVideoSourceUrl(activeItem)"><video ref="videoPlayerEl" class="vplayer-el" controls :poster="pCover(activeItem)"><source :src="getVideoSourceUrl(activeItem)" type="video/mp4" /></video></div>
                <div class="vembed-wrap" v-else-if="getVideoEmbedUrl(activeItem)"><iframe :src="getVideoEmbedUrl(activeItem)" frameborder="0" allowfullscreen class="vembed"></iframe></div>
                <div class="vno-source" v-else><div class="vno-source__icon">🎬</div><div class="vno-source__text">{{ lbl('noSource') }}</div></div>
                <div class="vfilm-info"><div class="vfilm-chips">
                  <span v-if="activeItem.resolution" class="vchip">📺 {{ activeItem.resolution }}</span>
                  <span v-if="activeItem.fileFormat" class="vchip">🎞 {{ activeItem.fileFormat }}</span>
                  <span v-if="activeItem.durationSeconds" class="vchip">⏱ {{ formatTime(activeItem.durationSeconds) }}</span>
                  <span v-if="activeItem.fileSizeMb" class="vchip">💾 {{ activeItem.fileSizeMb?.toFixed(1) }}MB</span>
                </div></div>
              </div>
            </template>
            <div class="video-full-meta">
              <div class="sfm-block">
                <h3 class="sfm-block__title">ناوەڕۆکی دووزمانەیی</h3>
                <div class="sfm-bilingual">
                  <div class="sfm-lang-col" v-if="activeItem.ckbContent"><span class="sfm-lang-badge sfm-lang-badge--ckb">سۆرانی</span><div class="content-detail-block"><div class="cdb-row" v-if="activeItem.ckbContent.title"><span class="cdb-key">ناونیشان</span><span class="cdb-val">{{ activeItem.ckbContent.title }}</span></div><div class="cdb-row" v-if="activeItem.ckbContent.description"><span class="cdb-key">وەسف</span><span class="cdb-val">{{ activeItem.ckbContent.description }}</span></div><div class="cdb-row" v-if="activeItem.ckbContent.location"><span class="cdb-key">شوێن</span><span class="cdb-val">{{ activeItem.ckbContent.location }}</span></div><div class="cdb-row" v-if="activeItem.ckbContent.director"><span class="cdb-key">دەرهێنەر</span><span class="cdb-val">{{ activeItem.ckbContent.director }}</span></div><div class="cdb-row" v-if="activeItem.ckbContent.producer"><span class="cdb-key">بەرهەمهێنەر</span><span class="cdb-val">{{ activeItem.ckbContent.producer }}</span></div></div></div>
                  <div class="sfm-lang-col" v-if="activeItem.kmrContent"><span class="sfm-lang-badge sfm-lang-badge--kmr">کورمانجی</span><div class="content-detail-block"><div class="cdb-row" v-if="activeItem.kmrContent.title"><span class="cdb-key">Sernavê</span><span class="cdb-val">{{ activeItem.kmrContent.title }}</span></div><div class="cdb-row" v-if="activeItem.kmrContent.description"><span class="cdb-key">Danasîn</span><span class="cdb-val">{{ activeItem.kmrContent.description }}</span></div><div class="cdb-row" v-if="activeItem.kmrContent.location"><span class="cdb-key">Cih</span><span class="cdb-val">{{ activeItem.kmrContent.location }}</span></div><div class="cdb-row" v-if="activeItem.kmrContent.director"><span class="cdb-key">Derhêner</span><span class="cdb-val">{{ activeItem.kmrContent.director }}</span></div><div class="cdb-row" v-if="activeItem.kmrContent.producer"><span class="cdb-key">Hilberîner</span><span class="cdb-val">{{ activeItem.kmrContent.producer }}</span></div></div></div>
                </div>
              </div>
              <div class="sfm-block">
                <h3 class="sfm-block__title">زانیاری تەکنیکی</h3>
                <div class="sfm-grid">
                  <div class="sfm-item"><span class="sfm-label">جۆری ڤیدیۆ</span><span class="sfm-value sfm-value--badge">{{ activeItem.videoType }}</span></div>
                  <div class="sfm-item" v-if="activeItem.publishmentDate"><span class="sfm-label">{{ lbl('publishmentDate') }}</span><span class="sfm-value">{{ formatDate(activeItem.publishmentDate) }}</span></div>
                  <div class="sfm-item" v-if="activeItem.resolution"><span class="sfm-label">ریزۆلووشن</span><span class="sfm-value">{{ activeItem.resolution }}</span></div>
                  <div class="sfm-item" v-if="activeItem.fileFormat"><span class="sfm-label">فۆرمات</span><span class="sfm-value">{{ activeItem.fileFormat }}</span></div>
                  <div class="sfm-item" v-if="activeItem.durationSeconds"><span class="sfm-label">ماوە</span><span class="sfm-value">{{ formatTime(activeItem.durationSeconds) }}</span></div>
                  <div class="sfm-item" v-if="activeItem.fileSizeMb"><span class="sfm-label">قەبارە</span><span class="sfm-value">{{ activeItem.fileSizeMb?.toFixed(2) }} MB</span></div>
                  <div class="sfm-item" v-if="activeItem.albumOfMemories"><span class="sfm-label">یادگاریەکان</span><span class="sfm-value sfm-value--yes">بەڵێ 💫</span></div>
                </div>
              </div>
              <div class="sfm-block" v-if="activeItem.sourceUrl || activeItem.sourceExternalUrl || activeItem.sourceEmbedUrl">
                <h3 class="sfm-block__title">سەرچاوەی ڤیدیۆ</h3>
                <div class="sfm-attachments">
                  <a v-if="activeItem.sourceUrl" :href="activeItem.sourceUrl" target="_blank" class="sfm-attachment"><span class="sfm-attachment__type">S3/CDN</span><span class="sfm-attachment__title">فایلی ڤیدیۆ</span><span class="sfm-attachment__arrow">↗</span></a>
                  <a v-if="activeItem.sourceExternalUrl" :href="activeItem.sourceExternalUrl" target="_blank" class="sfm-attachment"><span class="sfm-attachment__type">EXTERNAL</span><span class="sfm-attachment__title">لینکی دەرەکی</span><span class="sfm-attachment__arrow">↗</span></a>
                  <a v-if="activeItem.sourceEmbedUrl" :href="activeItem.sourceEmbedUrl" target="_blank" class="sfm-attachment"><span class="sfm-attachment__type">EMBED</span><span class="sfm-attachment__title">لینکی ئەمبێد</span><span class="sfm-attachment__arrow">↗</span></a>
                </div>
              </div>
              <div class="sfm-block" v-if="activeItem.contentLanguages?.length"><h3 class="sfm-block__title">زمانی ناوەڕۆک</h3><div class="sfm-chips"><span v-for="l in activeItem.contentLanguages" :key="l" class="sfm-chip">{{ l === 'CKB' ? 'سۆرانی' : l === 'KMR' ? 'کورمانجی' : l }}</span></div></div>
              <div class="sfm-block" v-if="pTopicName(activeItem)"><h3 class="sfm-block__title">بابەت</h3><div class="sfm-chips"><span class="sfm-chip sfm-chip--topic">🏷️ {{ pTopicName(activeItem) }}</span></div></div>
              <div class="sfm-block" v-if="pTagsCkb(activeItem).length || pTagsKmr(activeItem).length"><h3 class="sfm-block__title">{{ lbl('tags') }}</h3><div class="sfm-bilingual-tags"><div v-if="pTagsCkb(activeItem).length"><span class="sfm-lang-badge sfm-lang-badge--ckb" style="margin-bottom:8px">سۆرانی</span><div class="sfm-chips" style="margin-top:8px"><span v-for="tag in pTagsCkb(activeItem)" :key="tag" class="sfm-chip sfm-chip--tag" @click="searchByTagGlobal(tag)">#{{ tag }}</span></div></div><div v-if="pTagsKmr(activeItem).length"><span class="sfm-lang-badge sfm-lang-badge--kmr" style="margin-bottom:8px">کورمانجی</span><div class="sfm-chips" style="margin-top:8px"><span v-for="tag in pTagsKmr(activeItem)" :key="tag" class="sfm-chip sfm-chip--tag" @click="searchByTagGlobal(tag)">#{{ tag }}</span></div></div></div></div>
              <div class="sfm-block sfm-block--timestamps"><div class="sfm-ts" v-if="activeItem.createdAt"><span class="sfm-ts__label">دروستکراوە:</span><span class="sfm-ts__val">{{ formatDate(activeItem.createdAt) }}</span></div><div class="sfm-ts" v-if="activeItem.updatedAt"><span class="sfm-ts__label">نوێکراوەتەوە:</span><span class="sfm-ts__val">{{ formatDate(activeItem.updatedAt) }}</span></div></div>
            </div>
          </div>
        </section>
 
        <!-- ══ IMAGE ══ -->
        <section class="gallery-section" v-if="activeItem._mediaType === 'image'">
          <div class="container">
            <div class="gallery-layout" v-if="activeItem.imageAlbum?.length">
              <div class="gallery-main">
                <div class="gallery-preview" v-if="selectedImage">
                  <img :src="selectedImage.imageUrl || selectedImage.externalUrl || selectedImage.embedUrl" :alt="lang.activeLang === 'CKB' ? selectedImage.captionCkb : selectedImage.captionKmr" class="gallery-preview__img" @click="openFullscreen(selectedImage.imageUrl || selectedImage.externalUrl)" @error="onImgError($event)" />
                  <div class="gallery-zoom-hint"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>{{ lbl('clickToExpand') }}</div>
                  <div class="gallery-img-meta" v-if="selectedImage.widthPx || selectedImage.heightPx || selectedImage.mimeType"><span v-if="selectedImage.widthPx && selectedImage.heightPx">{{ selectedImage.widthPx }}×{{ selectedImage.heightPx }}</span><span v-if="selectedImage.mimeType">{{ selectedImage.mimeType }}</span><span v-if="selectedImage.humanReadableSize">{{ selectedImage.humanReadableSize }}</span></div>
                </div>
                <div class="gallery-caption" v-if="selectedImage">
                  <div class="gallery-caption__title">{{ lang.activeLang === 'CKB' ? selectedImage.captionCkb : selectedImage.captionKmr }}</div>
                  <div class="gallery-caption__desc">{{ lang.activeLang === 'CKB' ? selectedImage.descriptionCkb : selectedImage.descriptionKmr }}</div>
                  <div class="gallery-caption__bilingual" v-if="selectedImage.captionCkb && selectedImage.captionKmr"><div class="gcap-row"><span class="sfm-lang-badge sfm-lang-badge--ckb">سۆرانی</span><span>{{ selectedImage.captionCkb }}</span></div><div class="gcap-row"><span class="sfm-lang-badge sfm-lang-badge--kmr">کورمانجی</span><span>{{ selectedImage.captionKmr }}</span></div></div>
                  <div class="gallery-img-tech" v-if="selectedImage.fileSizeBytes || selectedImage.widthPx"><div class="git-row" v-if="selectedImage.widthPx && selectedImage.heightPx"><span class="git-key">ئەندازە</span><span class="git-val">{{ selectedImage.widthPx }} × {{ selectedImage.heightPx }} px</span></div><div class="git-row" v-if="selectedImage.aspectRatio"><span class="git-key">نسبەی ئەندازە</span><span class="git-val">{{ selectedImage.aspectRatio?.toFixed(2) }}</span></div><div class="git-row" v-if="selectedImage.mimeType"><span class="git-key">جۆری فایل</span><span class="git-val">{{ selectedImage.mimeType }}</span></div><div class="git-row" v-if="selectedImage.humanReadableSize"><span class="git-key">قەبارە</span><span class="git-val">{{ selectedImage.humanReadableSize }}</span></div><div class="git-row" v-if="selectedImage.sortOrder != null"><span class="git-key">ئۆردەر</span><span class="git-val">{{ selectedImage.sortOrder }}</span></div></div>
                </div>
              </div>
              <div class="gallery-strip">
                <button v-for="img in activeItem.imageAlbum" :key="img.id" class="gthumb" :class="{ 'gthumb--on': selectedImage?.id === img.id }" @click="selectedImage = img"><img :src="img.imageUrl || img.externalUrl" @error="onImgError($event)" /><div class="gthumb__meta" v-if="img.widthPx">{{ img.widthPx }}×{{ img.heightPx }}</div></button>
              </div>
              <div class="gallery-nav" v-if="activeItem.imageAlbum.length > 1"><button class="gnav-btn" @click="prevImage" :disabled="!canPrevImage">{{ lbl('prev') }}</button><span class="gnav-pos">{{ currentImageIdx + 1 }} / {{ activeItem.imageAlbum.length }}</span><button class="gnav-btn" @click="nextImage" :disabled="!canNextImage">{{ lbl('next') }}</button></div>
            </div>
            <div class="gallery-empty" v-else><img :src="pCover(activeItem)" :alt="pTitle(activeItem)" class="gallery-single" @error="onImgError($event)" /></div>
            <div class="image-full-meta">
              <div class="sfm-block"><h3 class="sfm-block__title">ناوەڕۆکی دووزمانەیی</h3><div class="sfm-bilingual"><div class="sfm-lang-col" v-if="activeItem.ckbContent"><span class="sfm-lang-badge sfm-lang-badge--ckb">سۆرانی</span><div class="content-detail-block"><div class="cdb-row" v-if="activeItem.ckbContent.title"><span class="cdb-key">ناونیشان</span><span class="cdb-val">{{ activeItem.ckbContent.title }}</span></div><div class="cdb-row" v-if="activeItem.ckbContent.description"><span class="cdb-key">وەسف</span><span class="cdb-val">{{ activeItem.ckbContent.description }}</span></div><div class="cdb-row" v-if="activeItem.ckbContent.location"><span class="cdb-key">شوێن</span><span class="cdb-val">{{ activeItem.ckbContent.location }}</span></div><div class="cdb-row" v-if="activeItem.ckbContent.collectedBy"><span class="cdb-key">کۆکردنەوەکار</span><span class="cdb-val">{{ activeItem.ckbContent.collectedBy }}</span></div></div></div><div class="sfm-lang-col" v-if="activeItem.kmrContent"><span class="sfm-lang-badge sfm-lang-badge--kmr">کورمانجی</span><div class="content-detail-block"><div class="cdb-row" v-if="activeItem.kmrContent.title"><span class="cdb-key">Sernavê</span><span class="cdb-val">{{ activeItem.kmrContent.title }}</span></div><div class="cdb-row" v-if="activeItem.kmrContent.description"><span class="cdb-key">Danasîn</span><span class="cdb-val">{{ activeItem.kmrContent.description }}</span></div><div class="cdb-row" v-if="activeItem.kmrContent.location"><span class="cdb-key">Cih</span><span class="cdb-val">{{ activeItem.kmrContent.location }}</span></div><div class="cdb-row" v-if="activeItem.kmrContent.collectedBy"><span class="cdb-key">Berhevkar</span><span class="cdb-val">{{ activeItem.kmrContent.collectedBy }}</span></div></div></div></div></div>
              <div class="sfm-block"><h3 class="sfm-block__title">زانیاری کۆلێکشن</h3><div class="sfm-grid"><div class="sfm-item"><span class="sfm-label">جۆری کۆلێکشن</span><span class="sfm-value sfm-value--badge">{{ activeItem.collectionType }}</span></div><div class="sfm-item" v-if="activeItem.publishmentDate"><span class="sfm-label">{{ lbl('publishmentDate') }}</span><span class="sfm-value">{{ formatDate(activeItem.publishmentDate) }}</span></div><div class="sfm-item" v-if="activeItem.imageAlbum?.length"><span class="sfm-label">ژمارەی وێنەکان</span><span class="sfm-value">{{ activeItem.imageAlbum.length }}</span></div></div></div>
              <div class="sfm-block" v-if="activeItem.ckbCoverUrl || activeItem.kmrCoverUrl || activeItem.hoverCoverUrl"><h3 class="sfm-block__title">کڤەرەکان</h3><div class="cover-slots-grid"><div class="cover-slot-full" v-if="activeItem.ckbCoverUrl" @click="openFullscreen(activeItem.ckbCoverUrl)"><img :src="activeItem.ckbCoverUrl" alt="CKB" @error="onImgError($event)" /><span class="cover-slot-full__lbl">سۆرانی (CKB)</span></div><div class="cover-slot-full" v-if="activeItem.kmrCoverUrl" @click="openFullscreen(activeItem.kmrCoverUrl)"><img :src="activeItem.kmrCoverUrl" alt="KMR" @error="onImgError($event)" /><span class="cover-slot-full__lbl">کورمانجی (KMR)</span></div><div class="cover-slot-full" v-if="activeItem.hoverCoverUrl" @click="openFullscreen(activeItem.hoverCoverUrl)"><img :src="activeItem.hoverCoverUrl" alt="Hover" @error="onImgError($event)" /><span class="cover-slot-full__lbl">هۆڤەر</span></div></div></div>
              <div class="sfm-block" v-if="activeItem.contentLanguages?.length"><h3 class="sfm-block__title">زمانی ناوەڕۆک</h3><div class="sfm-chips"><span v-for="l in activeItem.contentLanguages" :key="l" class="sfm-chip">{{ l === 'CKB' ? 'سۆرانی' : l === 'KMR' ? 'کورمانجی' : l }}</span></div></div>
              <div class="sfm-block" v-if="pTopicName(activeItem)"><h3 class="sfm-block__title">بابەت</h3><div class="sfm-chips"><span class="sfm-chip sfm-chip--topic">🏷️ {{ pTopicName(activeItem) }}</span></div></div>
              <div class="sfm-block" v-if="pTagsCkb(activeItem).length || pTagsKmr(activeItem).length"><h3 class="sfm-block__title">{{ lbl('tags') }}</h3><div class="sfm-bilingual-tags"><div v-if="pTagsCkb(activeItem).length"><span class="sfm-lang-badge sfm-lang-badge--ckb" style="margin-bottom:8px">سۆرانی</span><div class="sfm-chips" style="margin-top:8px"><span v-for="tag in pTagsCkb(activeItem)" :key="tag" class="sfm-chip sfm-chip--tag" @click="searchByTagGlobal(tag)">#{{ tag }}</span></div></div><div v-if="pTagsKmr(activeItem).length"><span class="sfm-lang-badge sfm-lang-badge--kmr" style="margin-bottom:8px">کورمانجی</span><div class="sfm-chips" style="margin-top:8px"><span v-for="tag in pTagsKmr(activeItem)" :key="tag" class="sfm-chip sfm-chip--tag" @click="searchByTagGlobal(tag)">#{{ tag }}</span></div></div></div></div>
              <div class="sfm-block sfm-block--timestamps"><div class="sfm-ts" v-if="activeItem.createdAt"><span class="sfm-ts__label">دروستکراوە:</span><span class="sfm-ts__val">{{ formatDate(activeItem.createdAt) }}</span></div><div class="sfm-ts" v-if="activeItem.updatedAt"><span class="sfm-ts__label">نوێکراوەتەوە:</span><span class="sfm-ts__val">{{ formatDate(activeItem.updatedAt) }}</span></div></div>
            </div>
          </div>
        </section>
 
        <!-- ══ WRITING ══ -->
        <section class="writing-section" v-if="activeItem._mediaType === 'writing'">
          <div class="container">
            <div class="writing-layout">
              <div class="writing-genres" v-if="activeItem.bookGenres?.length || (activeItem.bookGenres && [...activeItem.bookGenres].length)"><span class="wg-label">{{ lbl('genre') }}:</span><div class="wg-chips"><span v-for="g in [...(activeItem.bookGenres || [])]" :key="g" class="wg-chip">{{ getGenreLabel(g) }}</span></div></div>
              <div class="writing-bilingual-content">
                <div class="wbc-col" v-if="activeItem.ckbContent">
                  <div class="wbc-header"><span class="sfm-lang-badge sfm-lang-badge--ckb">سۆرانی CKB</span></div>
                  <div class="winfo-card" v-if="activeItem.ckbContent.writer"><div class="winfo-card__ico">✍️</div><div class="winfo-card__content"><div class="winfo-card__lbl">{{ lbl('writer') }}</div><div class="winfo-card__val">{{ activeItem.ckbContent.writer }}</div></div></div>
                  <div class="winfo-card" v-if="activeItem.ckbContent.genre"><div class="winfo-card__ico">🎭</div><div class="winfo-card__content"><div class="winfo-card__lbl">{{ lbl('genre') }}</div><div class="winfo-card__val">{{ activeItem.ckbContent.genre }}</div></div></div>
                  <div class="winfo-card" v-if="activeItem.ckbContent.pageCount"><div class="winfo-card__ico">📄</div><div class="winfo-card__content"><div class="winfo-card__lbl">{{ lbl('pages') }}</div><div class="winfo-card__val">{{ activeItem.ckbContent.pageCount }}</div></div></div>
                  <div class="winfo-card" v-if="activeItem.ckbContent.fileFormat"><div class="winfo-card__ico">💾</div><div class="winfo-card__content"><div class="winfo-card__lbl">{{ lbl('format') }}</div><div class="winfo-card__val">{{ activeItem.ckbContent.fileFormat }}</div></div></div>
                  <div class="winfo-card" v-if="activeItem.ckbContent.fileSizeBytes"><div class="winfo-card__ico">📁</div><div class="winfo-card__content"><div class="winfo-card__lbl">قەبارە</div><div class="winfo-card__val">{{ formatSize(activeItem.ckbContent.fileSizeBytes) }}</div></div></div>
                  <div class="wdesc" v-if="activeItem.ckbContent.description"><p>{{ activeItem.ckbContent.description }}</p></div>
                  <a v-if="activeItem.ckbContent.fileUrl" :href="activeItem.ckbContent.fileUrl" target="_blank" class="wdownload-btn"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>داونلۆدی نسخەی سۆرانی</a>
                </div>
                <div class="wbc-col" v-if="activeItem.kmrContent">
                  <div class="wbc-header"><span class="sfm-lang-badge sfm-lang-badge--kmr">کورمانجی KMR</span></div>
                  <div class="winfo-card" v-if="activeItem.kmrContent.writer"><div class="winfo-card__ico">✍️</div><div class="winfo-card__content"><div class="winfo-card__lbl">{{ lbl('writer') }}</div><div class="winfo-card__val">{{ activeItem.kmrContent.writer }}</div></div></div>
                  <div class="winfo-card" v-if="activeItem.kmrContent.genre"><div class="winfo-card__ico">🎭</div><div class="winfo-card__content"><div class="winfo-card__lbl">{{ lbl('genre') }}</div><div class="winfo-card__val">{{ activeItem.kmrContent.genre }}</div></div></div>
                  <div class="winfo-card" v-if="activeItem.kmrContent.pageCount"><div class="winfo-card__ico">📄</div><div class="winfo-card__content"><div class="winfo-card__lbl">{{ lbl('pages') }}</div><div class="winfo-card__val">{{ activeItem.kmrContent.pageCount }}</div></div></div>
                  <div class="winfo-card" v-if="activeItem.kmrContent.fileFormat"><div class="winfo-card__ico">💾</div><div class="winfo-card__content"><div class="winfo-card__lbl">{{ lbl('format') }}</div><div class="winfo-card__val">{{ activeItem.kmrContent.fileFormat }}</div></div></div>
                  <div class="winfo-card" v-if="activeItem.kmrContent.fileSizeBytes"><div class="winfo-card__ico">📁</div><div class="winfo-card__content"><div class="winfo-card__lbl">قەبارە</div><div class="winfo-card__val">{{ formatSize(activeItem.kmrContent.fileSizeBytes) }}</div></div></div>
                  <div class="wdesc" v-if="activeItem.kmrContent.description"><p>{{ activeItem.kmrContent.description }}</p></div>
                  <a v-if="activeItem.kmrContent.fileUrl" :href="activeItem.kmrContent.fileUrl" target="_blank" class="wdownload-btn"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>Daxistina Nusxeya Kurmancî</a>
                </div>
              </div>
              <div class="writing-info-grid">
                <div class="winfo-card" v-if="activeItem.publishedByInstitute"><div class="winfo-card__ico">🏛️</div><div class="winfo-card__content"><div class="winfo-card__lbl">{{ lbl('publisher') }}</div><div class="winfo-card__val">{{ lbl('institute') }}</div></div></div>
                <div class="winfo-card" v-if="pTopicName(activeItem)"><div class="winfo-card__ico">🏷️</div><div class="winfo-card__content"><div class="winfo-card__lbl">{{ lbl('category') }}</div><div class="winfo-card__val">{{ pTopicName(activeItem) }}</div></div></div>
              </div>
              <div class="series-block" v-if="activeItem.seriesInfo || activeItem.seriesName || activeItem.seriesId"><div class="series-block__ico">📚</div><div class="series-block__info"><div class="series-block__lbl">{{ lbl('series') }}</div><div class="series-block__name">{{ activeItem.seriesInfo?.seriesName || activeItem.seriesName || activeItem.seriesInfo?.seriesId || activeItem.seriesId }}</div><div class="series-block__meta"><span v-if="activeItem.seriesInfo?.seriesOrder || activeItem.seriesOrder">Vol. {{ activeItem.seriesInfo?.seriesOrder || activeItem.seriesOrder }}</span><span v-if="activeItem.seriesInfo?.totalBooks || activeItem.seriesTotalBooks"> · {{ activeItem.seriesInfo?.totalBooks || activeItem.seriesTotalBooks }} کتێب</span><span v-if="activeItem.seriesInfo?.isParent" class="series-parent-badge">📖 سەرەکی</span></div></div></div>
              <div class="sfm-block" v-if="activeItem.contentLanguages?.length"><h3 class="sfm-block__title">زمانی ناوەڕۆک</h3><div class="sfm-chips"><span v-for="l in activeItem.contentLanguages" :key="l" class="sfm-chip">{{ l === 'CKB' ? 'سۆرانی' : l === 'KMR' ? 'کورمانجی' : l }}</span></div></div>
              <div class="sfm-block" v-if="activeItem.ckbCoverUrl || activeItem.kmrCoverUrl || activeItem.hoverCoverUrl"><h3 class="sfm-block__title">کڤەرەکان</h3><div class="cover-slots-grid"><div class="cover-slot-full" v-if="activeItem.ckbCoverUrl" @click="openFullscreen(activeItem.ckbCoverUrl)"><img :src="activeItem.ckbCoverUrl" alt="CKB" @error="onImgError($event)" /><span class="cover-slot-full__lbl">سۆرانی</span></div><div class="cover-slot-full" v-if="activeItem.kmrCoverUrl" @click="openFullscreen(activeItem.kmrCoverUrl)"><img :src="activeItem.kmrCoverUrl" alt="KMR" @error="onImgError($event)" /><span class="cover-slot-full__lbl">کورمانجی</span></div><div class="cover-slot-full" v-if="activeItem.hoverCoverUrl" @click="openFullscreen(activeItem.hoverCoverUrl)"><img :src="activeItem.hoverCoverUrl" alt="Hover" @error="onImgError($event)" /><span class="cover-slot-full__lbl">هۆڤەر</span></div></div></div>
              <div class="sfm-block" v-if="pTagsCkb(activeItem).length || pTagsKmr(activeItem).length"><h3 class="sfm-block__title">{{ lbl('tags') }}</h3><div class="sfm-bilingual-tags"><div v-if="pTagsCkb(activeItem).length"><span class="sfm-lang-badge sfm-lang-badge--ckb" style="margin-bottom:8px">سۆرانی</span><div class="sfm-chips" style="margin-top:8px"><span v-for="tag in pTagsCkb(activeItem)" :key="tag" class="sfm-chip sfm-chip--tag" @click="searchByTagGlobal(tag)">#{{ tag }}</span></div></div><div v-if="pTagsKmr(activeItem).length"><span class="sfm-lang-badge sfm-lang-badge--kmr" style="margin-bottom:8px">کورمانجی</span><div class="sfm-chips" style="margin-top:8px"><span v-for="tag in pTagsKmr(activeItem)" :key="tag" class="sfm-chip sfm-chip--tag" @click="searchByTagGlobal(tag)">#{{ tag }}</span></div></div></div></div>
              <div class="sfm-block sfm-block--timestamps"><div class="sfm-ts" v-if="activeItem.createdAt"><span class="sfm-ts__label">دروستکراوە:</span><span class="sfm-ts__val">{{ formatDate(activeItem.createdAt) }}</span></div><div class="sfm-ts" v-if="activeItem.updatedAt"><span class="sfm-ts__label">نوێکراوەتەوە:</span><span class="sfm-ts__val">{{ formatDate(activeItem.updatedAt) }}</span></div></div>
            </div>
          </div>
        </section>
 
        <!-- Related -->
        <section class="related" v-if="relatedItems.length">
          <div class="container">
            <div class="related__head"><h2 class="related__title">{{ lbl('related') }}</h2><div class="related__rule"></div></div>
            <div class="related__grid">
              <article v-for="rp in relatedItems" :key="`rel-${rp._mediaType}-${rp.id}`" class="rcard" tabindex="0" @click="openItem(rp)" @keyup.enter="openItem(rp)">
                <div class="rcard__img"><img :src="pCover(rp)" :alt="pTitle(rp)" loading="lazy" class="rcard__img-main" @error="onImgError($event)" /><img v-if="pHoverCover(rp)" :src="pHoverCover(rp)" :alt="pTitle(rp)" loading="lazy" class="rcard__img-hover" @error="onImgError($event)" /><div class="rcard__overlay"></div><span class="rcard__typebadge">{{ getMediaIcon(rp._mediaType) }}</span></div>
                <div class="rcard__body"><h3 class="rcard__title">{{ pTitle(rp) }}</h3><p class="rcard__desc">{{ truncate(pDesc(rp), 90) }}</p><div class="rcard__tags" v-if="pTags(rp).length"><span v-for="t in pTags(rp).slice(0, 2)" :key="t" class="rtag rtag--clickable" @click.stop="searchByTagGlobal(t)">#{{ t }}</span></div></div>
              </article>
            </div>
          </div>
        </section>
      </div>
 
      <!-- TAG SEARCH VIEW -->
      <div v-else-if="tagSearchMode" key="tag-search" class="listing tag-search-page">
        <div class="ts-hero">
          <div class="container">
            <button class="back-btn ts-back" @click="clearTagSearch"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg><span>{{ lbl('back') }}</span></button>
            <div class="ts-title"><span class="ts-hash">#</span><span class="ts-query">{{ tagSearchQuery }}</span></div>
            <div class="ts-total" v-if="!isTagSearchLoading">{{ totalTagResults }} {{ lbl('results') }}</div>
          </div>
        </div>
        <div class="container ts-body">
          <div v-if="isTagSearchLoading" class="grid"><div v-for="i in 8" :key="`tsk-${i}`" class="skel" :style="{ '--d': `${(i-1)*0.07}s` }"><div class="skel__thumb shimmer"></div><div class="skel__body"><div class="skel__line shimmer" style="width:55%"></div><div class="skel__line shimmer" style="width:100%;margin-top:.5rem"></div><div class="skel__line shimmer" style="width:75%"></div></div></div></div>
          <template v-else>
            <div v-if="totalTagResults === 0" class="empty"><div class="empty__icon">🔍</div><h3 class="empty__title">{{ lbl('noResults') }}</h3><p class="empty__hint">#{{ tagSearchQuery }}</p><button class="btn-primary" @click="clearTagSearch">{{ lbl('resetFilter') }}</button></div>
            <div class="ts-section" v-if="tagSearchResults.sounds.filter(s => !s.albumOfMemories).length"><div class="ts-section-head"><span class="ts-section-icon">🎵</span><h3 class="ts-section-title">{{ lbl('sound') }}</h3><span class="ts-section-count">{{ tagSearchResults.sounds.filter(s => !s.albumOfMemories).length }}</span></div><div class="grid"><article v-for="(item, i) in tagSearchResults.sounds.filter(s => !s.albumOfMemories)" :key="`ts-snd-${item.id}`" class="card card--sound" :style="{ '--d': `${i * 0.04}s` }" tabindex="0" @click="openItem(item)" @keyup.enter="openItem(item)"><div class="card__thumb"><img :src="pCover(item)" :alt="pTitle(item)" loading="lazy" class="card__img card__img--main" @error="onImgError($event)" /><img v-if="pHoverCover(item)" :src="pHoverCover(item)" :alt="pTitle(item)" loading="lazy" class="card__img card__img--hover" @error="onImgError($event)" /><div class="card__film"></div><div class="card__scrim"></div><div class="card__badges"><div class="card__typebadge">{{ getTypeEmoji(item) }} {{ getTypeLabel(item) }}</div></div><div class="card__countbadge" v-if="item.files?.length">🎵 {{ item.files.length }}</div><div class="card__view"><span class="card__viewbtn">{{ lbl('viewItem') }}</span></div><div class="card__accent"></div></div><div class="card__body"><div class="card__meta"><span class="card__date" v-if="getItemDate(item)">{{ formatDate(getItemDate(item)) }}</span></div><h3 class="card__title">{{ pTitle(item) }}</h3><p class="card__desc">{{ truncate(pDesc(item), 100) }}</p><div class="card__extra" v-if="item.soundType"><span class="card__extra-val">{{ item.soundType }}</span></div><div class="card__tags" v-if="pTags(item).length"><span v-for="tag in pTags(item).slice(0, 3)" :key="tag" class="ctag ctag--clickable" @click.stop="searchByTagGlobal(tag)">#{{ tag }}</span><span v-if="pTags(item).length > 3" class="ctag ctag--more">+{{ pTags(item).length - 3 }}</span></div></div><div class="card__foot"><span class="card__cta">{{ lbl('viewItem') }}</span><span class="card__arrow">{{ lang.isKMR ? '→' : '←' }}</span></div></article></div></div>
            <hr v-if="tagSearchResults.sounds.filter(s=>!s.albumOfMemories).length && tagSearchResults.images.length" class="ts-divider">
            <div class="ts-section" v-if="tagSearchResults.images.length"><div class="ts-section-head"><span class="ts-section-icon">🖼️</span><h3 class="ts-section-title">{{ lbl('images') }}</h3><span class="ts-section-count">{{ tagSearchResults.images.length }}</span></div><div class="grid"><article v-for="(item, i) in tagSearchResults.images" :key="`ts-img-${item.id}`" class="card card--image" :style="{ '--d': `${i * 0.04}s` }" tabindex="0" @click="openItem(item)" @keyup.enter="openItem(item)"><div class="card__thumb"><img :src="pCover(item)" :alt="pTitle(item)" loading="lazy" class="card__img card__img--main" @error="onImgError($event)" /><img v-if="pHoverCover(item)" :src="pHoverCover(item)" :alt="pTitle(item)" loading="lazy" class="card__img card__img--hover" @error="onImgError($event)" /><div class="card__film"></div><div class="card__scrim"></div><div class="card__badges"><div class="card__typebadge">{{ getTypeEmoji(item) }} {{ getTypeLabel(item) }}</div></div><div class="card__countbadge" v-if="item.imageAlbum?.length">🖼️ {{ item.imageAlbum.length }}</div><div class="card__view"><span class="card__viewbtn">{{ lbl('viewItem') }}</span></div><div class="card__accent"></div></div><div class="card__body"><div class="card__meta"><span class="card__date" v-if="getItemDate(item)">{{ formatDate(getItemDate(item)) }}</span></div><h3 class="card__title">{{ pTitle(item) }}</h3><p class="card__desc">{{ truncate(pDesc(item), 100) }}</p><div class="card__tags" v-if="pTags(item).length"><span v-for="tag in pTags(item).slice(0, 3)" :key="tag" class="ctag ctag--clickable" @click.stop="searchByTagGlobal(tag)">#{{ tag }}</span><span v-if="pTags(item).length > 3" class="ctag ctag--more">+{{ pTags(item).length - 3 }}</span></div></div><div class="card__foot"><span class="card__cta">{{ lbl('viewItem') }}</span><span class="card__arrow">{{ lang.isKMR ? '→' : '←' }}</span></div></article></div></div>
            <hr v-if="tagSearchResults.images.length && tagSearchResults.videos.filter(v=>!v.albumOfMemories).length" class="ts-divider">
            <div class="ts-section" v-if="tagSearchResults.videos.filter(v => !v.albumOfMemories).length"><div class="ts-section-head"><span class="ts-section-icon">🎬</span><h3 class="ts-section-title">{{ lbl('video') }}</h3><span class="ts-section-count">{{ tagSearchResults.videos.filter(v => !v.albumOfMemories).length }}</span></div><div class="grid"><article v-for="(item, i) in tagSearchResults.videos.filter(v => !v.albumOfMemories)" :key="`ts-vid-${item.id}`" class="card card--video" :style="{ '--d': `${i * 0.04}s` }" tabindex="0" @click="openItem(item)" @keyup.enter="openItem(item)"><div class="card__thumb"><img :src="pCover(item)" :alt="pTitle(item)" loading="lazy" class="card__img card__img--main" @error="onImgError($event)" /><div class="card__film"></div><div class="card__scrim"></div><div class="card__badges"><div class="card__typebadge">{{ getTypeEmoji(item) }} {{ getTypeLabel(item) }}</div></div><div class="card__view"><span class="card__viewbtn">{{ lbl('viewItem') }}</span></div><div class="card__accent"></div></div><div class="card__body"><div class="card__meta"><span class="card__date" v-if="getItemDate(item)">{{ formatDate(getItemDate(item)) }}</span></div><h3 class="card__title">{{ pTitle(item) }}</h3><p class="card__desc">{{ truncate(pDesc(item), 100) }}</p><div class="card__tags" v-if="pTags(item).length"><span v-for="tag in pTags(item).slice(0, 3)" :key="tag" class="ctag ctag--clickable" @click.stop="searchByTagGlobal(tag)">#{{ tag }}</span><span v-if="pTags(item).length > 3" class="ctag ctag--more">+{{ pTags(item).length - 3 }}</span></div></div><div class="card__foot"><span class="card__cta">{{ lbl('viewItem') }}</span><span class="card__arrow">{{ lang.isKMR ? '→' : '←' }}</span></div></article></div></div>
            <hr v-if="tagSearchResults.writings.length" class="ts-divider">
            <div class="ts-section" v-if="tagSearchResults.writings.length"><div class="ts-section-head"><span class="ts-section-icon">📚</span><h3 class="ts-section-title">{{ lbl('writings') }}</h3><span class="ts-section-count">{{ tagSearchResults.writings.length }}</span></div><div class="grid"><article v-for="(item, i) in tagSearchResults.writings" :key="`ts-wrt-${item.id}`" class="card card--writing" :style="{ '--d': `${i * 0.04}s` }" tabindex="0" @click="openItem(item)" @keyup.enter="openItem(item)"><div class="card__thumb"><img :src="pCover(item)" :alt="pTitle(item)" loading="lazy" class="card__img card__img--main" @error="onImgError($event)" /><img v-if="pHoverCover(item)" :src="pHoverCover(item)" :alt="pTitle(item)" loading="lazy" class="card__img card__img--hover" @error="onImgError($event)" /><div class="card__film"></div><div class="card__scrim"></div><div class="card__badges"><div class="card__typebadge">{{ getTypeEmoji(item) }} {{ getTypeLabel(item) }}</div></div><div class="card__view"><span class="card__viewbtn">{{ lbl('viewItem') }}</span></div><div class="card__accent"></div></div><div class="card__body"><div class="card__meta"><span class="card__date" v-if="getItemDate(item)">{{ formatDate(getItemDate(item)) }}</span></div><h3 class="card__title">{{ pTitle(item) }}</h3><p class="card__desc">{{ truncate(pDesc(item), 100) }}</p><div class="card__extra" v-if="pWriter(item)"><span class="card__extra-val">✍️ {{ pWriter(item) }}</span></div><div class="card__tags" v-if="pTags(item).length"><span v-for="tag in pTags(item).slice(0, 3)" :key="tag" class="ctag ctag--clickable" @click.stop="searchByTagGlobal(tag)">#{{ tag }}</span><span v-if="pTags(item).length > 3" class="ctag ctag--more">+{{ pTags(item).length - 3 }}</span></div></div><div class="card__foot"><span class="card__cta">{{ lbl('viewItem') }}</span><span class="card__arrow">{{ lang.isKMR ? '→' : '←' }}</span></div></article></div></div>
            <hr v-if="tagSearchMemories.length" class="ts-divider">
            <div class="ts-section" v-if="tagSearchMemories.length"><div class="ts-section-head"><span class="ts-section-icon">💫</span><h3 class="ts-section-title">{{ lbl('memories') }}</h3><span class="ts-section-count">{{ tagSearchMemories.length }}</span></div><div class="grid"><article v-for="(item, i) in tagSearchMemories" :key="`ts-mem-${item._mediaType}-${item.id}`" class="card" :class="`card--${item._mediaType}`" :style="{ '--d': `${i * 0.04}s` }" tabindex="0" @click="openItem(item)" @keyup.enter="openItem(item)"><div class="card__thumb"><img :src="pCover(item)" :alt="pTitle(item)" loading="lazy" class="card__img card__img--main" @error="onImgError($event)" /><div class="card__film"></div><div class="card__scrim"></div><div class="card__badges"><div class="card__typebadge">{{ getTypeEmoji(item) }} {{ getTypeLabel(item) }}</div><div class="card__mediabadge">{{ getMediaIcon(item._mediaType) }}</div></div><div class="card__memorybadge">💫</div><div class="card__view"><span class="card__viewbtn">{{ lbl('viewItem') }}</span></div><div class="card__accent"></div></div><div class="card__body"><div class="card__meta"><span class="card__date" v-if="getItemDate(item)">{{ formatDate(getItemDate(item)) }}</span></div><h3 class="card__title">{{ pTitle(item) }}</h3><p class="card__desc">{{ truncate(pDesc(item), 100) }}</p><div class="card__tags" v-if="pTags(item).length"><span v-for="tag in pTags(item).slice(0, 3)" :key="tag" class="ctag ctag--clickable" @click.stop="searchByTagGlobal(tag)">#{{ tag }}</span><span v-if="pTags(item).length > 3" class="ctag ctag--more">+{{ pTags(item).length - 3 }}</span></div></div><div class="card__foot"><span class="card__cta">{{ lbl('viewItem') }}</span><span class="card__arrow">{{ lang.isKMR ? '→' : '←' }}</span></div></article></div></div>
          </template>
        </div>
      </div>
 
      <!-- LISTING VIEW -->
      <div v-else key="listing" class="listing">
        <header class="hero">
          <div class="hero__canvas">
            <div class="hero__slides"><div v-for="(slide, si) in heroSlides" :key="slide.url + si" class="hero__slide" :class="{ 'hero__slide--active': si === heroSlideIndex, 'hero__slide--prev': si === heroPrevIndex, 'hero__slide--kb-a': si % 2 === 0, 'hero__slide--kb-b': si % 2 !== 0 }" :style="{ backgroundImage: `url(${slide.url})` }"></div><div v-if="!heroSlides.length" class="hero__slide hero__slide--active hero__slide--gradient" :class="`hero__slide--grad-${activeTab}`"></div></div>
            <div class="hero__dots" v-if="heroSlides.length > 1"><button v-for="(_, di) in heroSlides" :key="di" class="hero__dot" :class="{ 'hero__dot--on': di === heroSlideIndex }" @click.stop="jumpSlide(di)"></button></div>
            <div class="hero__overlay hero__overlay--base"></div><div class="hero__overlay hero__overlay--vignette"></div><div class="hero__overlay hero__overlay--bottom"></div><div class="hero__overlay hero__overlay--top"></div>
            <div class="hero__film"></div><div class="hero__grain"></div><div class="hero__scanlines"></div>
            <div class="hero__filigree hero__filigree--h1"></div><div class="hero__filigree hero__filigree--h2"></div><div class="hero__filigree hero__filigree--v1"></div><div class="hero__filigree hero__filigree--v2"></div>
            <div class="hero__particles"><span v-for="i in 22" :key="i" class="hparticle" :style="particleStyle(i)"></span></div>
            <div class="hero__corner hero__corner--tl"></div><div class="hero__corner hero__corner--tr"></div><div class="hero__corner hero__corner--bl"></div><div class="hero__corner hero__corner--br"></div>
            <div class="hero__orb orb--a"></div><div class="hero__orb orb--b"></div><div class="hero__orb orb--c"></div><div class="hero__orb orb--gold"></div>
          </div>
          <div class="hero__inner container">
            <div class="hero__eyebrow"><div class="hero__stamp"><div class="stamp__ring"><div class="stamp__inner"><span class="stamp__text">{{ lbl('archive') }}</span><span class="stamp__year">{{ currentYear }}</span></div></div></div><div class="hero__kicker"><span class="kicker__rule"></span><span class="kicker__diamond">◆</span><span class="kicker__text">{{ lbl('heroDeco') }}</span><span class="kicker__diamond">◆</span><span class="kicker__rule"></span></div></div>
            <h1 class="hero__headline"><span class="headline__line headline__line--main">{{ lbl('heroMain') }}</span><span class="headline__line headline__line--sub"><span class="headline__word" v-for="(word, wi) in lbl('heroSub').split(' · ')" :key="wi"><span class="headline__word-text">{{ word }}</span><span class="headline__separator" v-if="wi < lbl('heroSub').split(' · ').length - 1"> · </span></span></span></h1>
            <div class="hero__divider"><span class="hdiv__line"></span><span class="hdiv__ornament">✦</span><span class="hdiv__line"></span></div>
            <div class="hero__stats"><div class="hstat" v-for="(s, i) in heroStats" :key="i" :style="{ '--i': i }"><div class="hstat__inner"><div class="hstat__num"><span class="hstat__num-val">{{ s.value }}</span></div><div class="hstat__lbl">{{ s.label }}</div></div><div class="hstat__sep" v-if="i < heroStats.length - 1"></div></div></div>
          </div>
          <button class="hero__scroll" @click="scrollToContent"><span class="scroll__label">{{ lbl('explore') }}</span><div class="scroll__arrow"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M12 5v14M5 12l7 7 7-7"/></svg></div></button>
        </header>
 
        <nav class="tabnav" ref="tabNavRef">
          <div class="container">
            <div class="tabnav__row">
              <template v-for="(tab, ti) in tabDefs" :key="tab.key">
                <div class="tabnav__item" :class="{ 'tabnav__item--on': activeTab === tab.key }" @mouseenter="onTabEnter(tab.key)" @mouseleave="scheduleDropClose" @click="switchTab(tab.key)">
                  <button class="tabtn" :class="{ 'tabtn--on': activeTab === tab.key }">
                    <span class="tabtn__lbl">{{ tab.label }}</span>
                    <svg class="tabtn__chevron" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
                    <span class="tabtn__count" v-if="tabCount(tab.key) > 0">{{ tabCount(tab.key) }}</span>
                  </button>
                  <transition name="drop">
                    <div v-if="openDropdownKey === tab.key" class="tabdrop" :class="{ 'tabdrop--memories': tab.key === 'memories' }" @mouseenter="cancelDropClose" @mouseleave="scheduleDropClose">
                      <div class="tabdrop__inner">
                        <template v-if="tab.key !== 'memories'">
                          <div class="tabdrop__header"><span class="tabdrop__header-lbl">{{ tab.label }}</span></div>
                          <div class="tabdrop__divider"></div>
                          <button class="tabdrop__item" :class="{ 'tabdrop__item--on': !activeTopicFilter }" @click.stop="setTopicFilter(null)"><span class="tabdrop__item-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg></span><span class="tabdrop__item-name">{{ lbl('allTopics') }}</span><span class="tabdrop__item-count">{{ tabCount(tab.key) }}</span></button>
                          <div class="tabdrop__topics-list"><button v-for="topic in getTopicsFor(tab.key)" :key="topic.id" class="tabdrop__item" :class="{ 'tabdrop__item--on': activeTopicFilter === topic.id }" @click.stop="setTopicFilter(topic.id)"><span class="tabdrop__item-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg></span><span class="tabdrop__item-name">{{ topicName(topic) }}</span><span class="tabdrop__item-count">{{ getCountForTopic(tab.key, topic.id) }}</span></button><div v-if="!getTopicsFor(tab.key).length" class="tabdrop__empty"><span>{{ lbl('noTopics') }}</span></div></div>
                        </template>
                        <template v-else>
                          <div class="tabdrop__header"><span class="tabdrop__header-lbl">{{ lbl('memories') }}</span></div>
                          <div class="tabdrop__divider"></div>
                          <div v-if="memorySounds.length" class="tabdrop__mem-section"><div class="tabdrop__mem-section-title">{{ lbl('sound') }}<span class="tabdrop__sec-count">{{ memorySounds.length }}</span></div><button v-for="mem in memorySounds.slice(0, 6)" :key="`ms-${mem.id}`" class="tabdrop__item tabdrop__item--mem" @click.stop="openMemoryFromDropdown(mem)"><span class="tabdrop__mem-cover"><img :src="pCover(mem)" @error="onImgError($event)" /><span class="tabdrop__mem-play">▶</span></span><span class="tabdrop__item-name">{{ truncate(pTitle(mem), 30) }}</span><span class="tabdrop__mem-badge">💫</span></button></div>
                          <div v-if="memoryVideos.length" class="tabdrop__mem-section"><div class="tabdrop__mem-section-title">{{ lbl('video') }}<span class="tabdrop__sec-count">{{ memoryVideos.length }}</span></div><button v-for="mem in memoryVideos.slice(0, 6)" :key="`mv-${mem.id}`" class="tabdrop__item tabdrop__item--mem" @click.stop="openMemoryFromDropdown(mem)"><span class="tabdrop__mem-cover"><img :src="pCover(mem)" @error="onImgError($event)" /><span class="tabdrop__mem-play">▶</span></span><span class="tabdrop__item-name">{{ truncate(pTitle(mem), 30) }}</span><span class="tabdrop__mem-badge">💫</span></button></div>
                          <div v-if="!memorySounds.length && !memoryVideos.length" class="tabdrop__empty"><span>💫 {{ lbl('noMemories') }}</span></div>
                        </template>
                      </div>
                    </div>
                  </transition>
                </div>
                <span v-if="ti < tabDefs.length - 1" class="tabnav__sep" aria-hidden="true"></span>
              </template>
            </div>
          </div>
        </nav>
 
        <section class="body" ref="gridSection">
          <div class="container">
            <transition name="pill"><div class="active-filter" v-if="activeTopicFilter"><div class="afilt"><span class="afilt__dot"></span><span class="afilt__label">{{ activeTopicName }}</span><button class="afilt__x" @click="clearTopicFilter">✕</button></div></div></transition>
            <div class="toolbar" v-if="!isLoading">
              <div class="toolbar__left"><span class="toolbar__indicator ind--ok"></span><span class="toolbar__label"><strong>{{ displayedItems.length }}</strong>&nbsp;{{ lbl('results') }}</span></div>
              <div class="toolbar__right"><div class="tsort"><select v-model="sortBy" class="tsort__sel"><option value="newest">{{ lbl('sortNewest') }}</option><option value="oldest">{{ lbl('sortOldest') }}</option><option value="title">{{ lbl('sortTitle') }}</option></select><svg class="tsort__ico" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg></div></div>
            </div>
            <div v-if="isLoading" class="grid"><div v-for="i in 8" :key="`sk-${i}`" class="skel" :style="{ '--d': `${(i-1)*0.07}s` }"><div class="skel__thumb shimmer"></div><div class="skel__body"><div class="skel__line shimmer" style="width:55%"></div><div class="skel__line shimmer" style="width:100%;margin-top:.5rem"></div><div class="skel__line shimmer" style="width:75%"></div><div class="skel__pills"><div class="skel__pill shimmer"></div><div class="skel__pill shimmer"></div></div></div></div></div>
            <div v-else-if="!paginatedItems.length" class="empty"><div class="empty__icon">{{ tabDefs.find(t => t.key === activeTab)?.icon || '📂' }}</div><h3 class="empty__title">{{ lbl('noResults') }}</h3><p class="empty__hint">{{ lbl('noResultsHint') }}</p><button class="btn-primary" @click="clearFilters">{{ lbl('resetFilter') }}</button></div>
            <div v-else class="grid">
              <article v-for="(item, i) in paginatedItems" :key="`${item._mediaType}-${item.id}`" class="card" :class="[`card--${item._mediaType}`, { 'card--featured': i === 0 && clientPage === 0 && !activeTopicFilter }]" :style="{ '--d': `${i * 0.05}s` }" tabindex="0" @click="openItem(item)" @keyup.enter="openItem(item)">
                <div class="card__thumb"><img :src="pCover(item)" :alt="pTitle(item)" loading="lazy" class="card__img card__img--main" @error="onImgError($event)" /><img v-if="pHoverCover(item)" :src="pHoverCover(item)" :alt="pTitle(item)" loading="lazy" class="card__img card__img--hover" @error="onImgError($event)" /><div class="card__film"></div><div class="card__scrim"></div><div class="card__badges"><div class="card__typebadge">{{ getTypeEmoji(item) }} {{ getTypeLabel(item) }}</div><div class="card__mediabadge" v-if="activeTab === 'memories'">{{ getMediaIcon(item._mediaType) }}</div></div><div class="card__countbadge" v-if="getCountBadge(item)">{{ getCountBadge(item) }}</div><div class="card__memorybadge" v-if="item.albumOfMemories">💫</div><div class="card__view"><span class="card__viewbtn">{{ lbl('viewItem') }}<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></span></div><div class="card__accent"></div></div>
                <div class="card__body"><div class="card__meta"><span class="card__date" v-if="getItemDate(item)">{{ formatDate(getItemDate(item)) }}</span><span class="card__lang" v-for="l in (item.contentLanguages || [])" :key="l">{{ l }}</span></div><h3 class="card__title">{{ pTitle(item) }}</h3><p class="card__desc">{{ truncate(pDesc(item), 100) }}</p><div class="card__extra" v-if="getExtraLine(item)"><span class="card__extra-val">{{ getExtraLine(item) }}</span></div><div class="card__tags" v-if="pTags(item).length"><span v-for="tag in pTags(item).slice(0, 3)" :key="tag" class="ctag ctag--clickable" @click.stop="searchByTagGlobal(tag)">#{{ tag }}</span><span v-if="pTags(item).length > 3" class="ctag ctag--more">+{{ pTags(item).length - 3 }}</span></div></div>
                <div class="card__foot"><span class="card__cta">{{ lbl('viewItem') }}</span><span class="card__arrow">{{ lang.isKMR ? '→' : '←' }}</span></div>
              </article>
            </div>
            <nav class="pager" v-if="totalClientPages > 1 && !isLoading"><button class="pager__btn" :disabled="clientPage === 0" @click="goPrev">{{ lbl('prev') }}</button><div class="pager__dots"><span v-for="p in Math.min(totalClientPages, 7)" :key="p" class="pager__dot" :class="{ 'pager__dot--on': clientPage === p - 1 }" @click="clientPage = p - 1; scrollToContent()"></span></div><button class="pager__btn" :disabled="clientPage + 1 >= totalClientPages" @click="goNext">{{ lbl('next') }}</button></nav>
          </div>
        </section>
      </div>
 
    </transition>
 
    <transition name="fs">
      <div v-if="isFullscreen" class="fsoverlay" @click="isFullscreen = false">
        <button class="fsoverlay__x" @click.stop="isFullscreen = false">✕</button>
        <div class="fsoverlay__frame" @click.stop><img :src="fullscreenUrl" class="fsoverlay__img" /></div>
      </div>
    </transition>
  </main>
</template>
 
<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import { API_BASE_URL } from '../consts.js'
import { useLanguageStore } from '@/stores/useLanguageStore'

const lang  = useLanguageStore()
const route = useRoute()
const fallbackCover = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f4f4f5'/%3E%3Crect x='160' y='95' width='80' height='65' rx='8' fill='%23e4e4e7'/%3E%3Ccircle cx='185' cy='118' r='10' fill='%23d4d4d8'/%3E%3Cpolygon points='160,160 200,125 230,148 260,125 280,160' fill='%23d4d4d8'/%3E%3C/svg%3E"
const currentYear = new Date().getFullYear()
const audioError = ref(null)
 
const i18n = {
  CKB: {
    archive: 'ئەرشیڤ', heroDeco: 'کتێبخانەی کهیە', heroMain: 'بڵاوکراوەکان',
    heroSub: 'وێنە · دەنگ · ڤیدیۆ · نووسین', images: 'وێنەکان', sound: 'دەنگ',
    video: 'ڤیدیۆ', writings: 'نووسینەکان', memories: 'یادگاریەکان',
    albumOfMemories: 'یادگاریەکان', allTopics: 'هەموو بابەتەکان', all: 'هەموو',
    explore: 'بگەڕێ', back: 'گەڕانەوە', results: 'ئەنجام', noResults: 'ئەنجامێک نەدۆزرایەوە',
    noResultsHint: 'فیلتر بگۆڕە یان سیفرەوە', resetFilter: 'سیفرکردنەوە', viewItem: 'بینین',
    tracks: 'گۆرانیەکان', track: 'گۆرانی', pages: 'لاپەڕە', clips: 'کلیپەکان',
    yourStream: 'گۆرانیەکان', featured: 'تایبەتمەند', type: 'جۆر', director: 'دەرهێنەر',
    reader: 'خوێنەر', writer: 'نووسەر', genre: 'جۆری نووسین', category: 'پۆل',
    format: 'فۆرمات', publisher: 'بڵاوکەرەوە', institute: 'ڕێکخراو', series: 'زنجیرە',
    tags: 'تاگەکان', keywords: 'کلیلەوشەکان', related: 'پەیوەندیدار',
    sortNewest: 'نوێترین', sortOldest: 'کۆنترین', sortTitle: 'ناوی',
    prev: 'پێشتر', next: 'دواتر', noSource: 'سەرچاوەیەک نییە',
    clickToExpand: 'کلیک بکە بۆ گەورەکردن', totalItems: 'کۆی بابەتەکان',
    noTopics: 'بابەتێک نییە', noMemories: 'یادگاریەک نییە',
    publishmentDate: 'بەرواری بڵاوکردنەوە'
  },
  KMR: {
    archive: 'Arşîv', heroDeco: 'Lîbrariya KHI', heroMain: 'Weşandin',
    heroSub: 'Wêne · Deng · Vîdyo · Nivîsar', images: 'Wêne', sound: 'Deng',
    video: 'Vîdyo', writings: 'Nivîsarên', memories: 'Bîranîn',
    albumOfMemories: 'Albûma Bîranînê', allTopics: 'Hemû Mijar', all: 'Hemû',
    explore: 'Bigere', back: 'Vegere', results: 'Encam', noResults: 'Encam nehat dîtin',
    noResultsHint: 'Fîlteran biguherîne', resetFilter: 'Sifirkirin', viewItem: 'Bibîne',
    tracks: 'Stran', track: 'Stran', pages: 'Rûpel', clips: 'Klîp',
    yourStream: 'Stranên Te', featured: 'Taybet', type: 'Cûre', director: 'Derhêner',
    reader: 'Xwendekar', writer: 'Nivîskar', genre: 'Cûre', category: 'Kategorî',
    format: 'Format', publisher: 'Weşanger', institute: 'Dezgeh', series: 'Rêze',
    tags: 'Etiket', keywords: 'Peyvên Sereke', related: 'Girêdayî',
    sortNewest: 'Herî nû', sortOldest: 'Herî kevn', sortTitle: 'Sernavê',
    prev: 'Berî', next: 'Paş', noSource: 'Çavkanî tune',
    clickToExpand: 'Klikê bike mezin bike', totalItems: 'Giştî',
    noTopics: 'Mijar tune', noMemories: 'Bîranîn tune',
    publishmentDate: 'Dîroka Weşandinê'
  }
}
function lbl(key) { const al = lang?.activeLang || 'CKB'; return i18n[al]?.[key] || i18n['CKB']?.[key] || key }
 
const bookGenreLabels = {
  NOVEL: { CKB: 'ڕۆمان', KMR: 'Roman' }, SHORT_STORY: { CKB: 'چیرۆکی کورت', KMR: 'Çîroka Kurt' },
  POETRY: { CKB: 'شیعر', KMR: 'Helbest' }, HISTORY: { CKB: 'مێژوو', KMR: 'Dîrok' },
  BIOGRAPHY: { CKB: 'بیۆگرافی', KMR: 'Biyografî' }, RELIGION: { CKB: 'ئایین', KMR: 'Ol' },
  CHILDREN: { CKB: 'منداڵان', KMR: 'Zarok' }, SCIENCE: { CKB: 'زانست', KMR: 'Zanist' },
  PHILOSOPHY: { CKB: 'فەلسەفە', KMR: 'Felseffe' }, LANGUAGE: { CKB: 'زمان', KMR: 'Ziman' },
  FOLKLORE: { CKB: 'فۆلکلۆر', KMR: 'Folklor' }, GEOGRAPHY: { CKB: 'جوگرافیا', KMR: 'Erdnîgarî' },
  ART: { CKB: 'هونەر', KMR: 'Huner' }, ESSAY: { CKB: 'وتار', KMR: 'Gotar' },
  OTHER: { CKB: 'ترازانیاری', KMR: 'Din' },
}
function getGenreLabel(g) { const al = lang?.activeLang || 'CKB'; return bookGenreLabels[g]?.[al] || g }
 
const api = axios.create({ baseURL: API_BASE_URL, timeout: 15000 })
 
function toArray(raw) {
  if (!raw) return []
  const inner = raw?.data !== undefined ? raw.data : raw
  if (Array.isArray(inner)) return inner
  if (Array.isArray(inner?.content)) return inner.content
  if (Array.isArray(inner?.data)) return inner.data
  if (Array.isArray(inner?.data?.content)) return inner.data.content
  return []
}
 
const images = ref([]), sounds = ref([]), videos = ref([]), writings = ref([])
const imageTopics = ref([]), soundTopics = ref([]), videoTopics = ref([]), writingTopics = ref([])
const isLoading = ref(false)
const activeTab = ref('sound')
const activeTopicFilter = ref(null)
const sortBy = ref('newest')
const openDropdownKey = ref(null)
const gridSection = ref(null), tabNavRef = ref(null)
let dropCloseTimer = null
const clientPage = ref(0), clientPageSize = 12
const activeItem = ref(null)
const selectedClip = ref(null), selectedImage = ref(null)
const audioPlayer = ref(null)
const currentTrackIdx = ref(-1), currentTrack = ref(null)
const isAudioPlaying = ref(false)
const audioCurrentTime = ref(0), audioDuration = ref(0), audioProgress = ref(0)
const isFullscreen = ref(false), fullscreenUrl = ref('')
const heroSlideIndex = ref(0), heroPrevIndex = ref(-1)
let slideTimer = null
 
const tagSearchMode = ref(false)
const tagSearchQuery = ref('')
const tagSearchResults = ref({ sounds: [], images: [], videos: [], writings: [] })
const isTagSearchLoading = ref(false)
 
const tagSearchMemories = computed(() => [
  ...tagSearchResults.value.sounds.filter(s => s.albumOfMemories),
  ...tagSearchResults.value.videos.filter(v => v.albumOfMemories),
])
const totalTagResults = computed(() =>
  tagSearchResults.value.sounds.length + tagSearchResults.value.images.length +
  tagSearchResults.value.videos.length + tagSearchResults.value.writings.length
)
 
async function searchByTagGlobal(tag) {
  if (!tag) return
  stopAudio()
  tagSearchMode.value = true
  tagSearchQuery.value = tag
  activeItem.value = null
  isTagSearchLoading.value = true
  tagSearchResults.value = { sounds: [], images: [], videos: [], writings: [] }
  window.scrollTo({ top: 0, behavior: 'smooth' })
  const [snd, img, vid, wrt] = await Promise.allSettled([
    api.get('/sound-tracks/search/tag', { params: { tag, page: 0, size: 200 } }),
    api.get('/image-collections/search/tag', { params: { tag, page: 0, size: 200 } }),
    api.get('/videos/search/tag', { params: { value: tag, page: 0, size: 200 } }),
    api.get('/writings/search/tag', { params: { tag, page: 0, size: 200 } }),
  ])
  if (snd.status === 'fulfilled') tagSearchResults.value.sounds = toArray(snd.value.data).map(s => ({ ...s, _mediaType: 'sound' }))
  if (img.status === 'fulfilled') tagSearchResults.value.images = toArray(img.value.data).map(i => ({ ...i, _mediaType: 'image' }))
  if (vid.status === 'fulfilled') tagSearchResults.value.videos = toArray(vid.value.data).map(v => ({ ...v, _mediaType: 'video' }))
  if (wrt.status === 'fulfilled') tagSearchResults.value.writings = toArray(wrt.value.data).map(w => ({ ...w, _mediaType: 'writing' }))
  isTagSearchLoading.value = false
}
function clearTagSearch() { tagSearchMode.value = false; tagSearchQuery.value = ''; tagSearchResults.value = { sounds: [], images: [], videos: [], writings: [] } }
 
const memorySounds = computed(() => sounds.value.filter(s => s.albumOfMemories).map(s => ({ ...s, _mediaType: 'sound' })))
const memoryVideos  = computed(() => videos.value.filter(v => v.albumOfMemories).map(v => ({ ...v, _mediaType: 'video' })))
const playedBars    = computed(() => Math.floor((audioProgress.value / 100) * 40))
 
const heroSlides = computed(() => {
  const seen = new Set(), urls = []
  const addUrl = (u) => { if (!u || seen.has(u) || !u.startsWith('http')) return; seen.add(u); urls.push({ url: u }) }
  ;[...images.value, ...sounds.value, ...videos.value, ...writings.value].forEach(x => { addUrl(x.ckbCoverUrl); addUrl(x.kmrCoverUrl); addUrl(x.hoverCoverUrl) })
  for (let i = urls.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [urls[i], urls[j]] = [urls[j], urls[i]] }
  return urls.slice(0, 14)
})
function jumpSlide(idx) { heroPrevIndex.value = heroSlideIndex.value; heroSlideIndex.value = idx; restartSlideTimer() }
function advanceSlide() { if (!heroSlides.value.length) return; heroPrevIndex.value = heroSlideIndex.value; heroSlideIndex.value = (heroSlideIndex.value + 1) % heroSlides.value.length }
function restartSlideTimer() { if (slideTimer) clearInterval(slideTimer); slideTimer = setInterval(advanceSlide, 4800) }
watch(heroSlides, (slides) => { if (slides.length > 1) restartSlideTimer() })
 
const waveformCache = new Map()
function getWaveform(seed) {
  const key = String(seed)
  if (!waveformCache.has(key)) { waveformCache.set(key, Array.from({ length: 40 }, (_, i) => { const x = Math.sin(Number(seed || 1) * 9301 + i * 49297 + 233) * 233; return (x - Math.floor(x)) * 0.7 + 0.3 })) }
  return waveformCache.get(key)
}
function particleStyle(i) { const seed = i * 137.508; return { '--x': `${seed % 100}%`, '--y': `${(seed * 1.618) % 100}%`, '--dur': `${14 + (i * 3.2) % 20}s`, '--del': `${(i * 1.1) % 5}s`, '--sz': `${1.5 + (i % 3)}px` } }
 
const tabDefs = computed(() => [
  { key: 'image', label: lbl('images'), icon: '🖼️' },
  { key: 'sound', label: lbl('sound'), icon: '🎵' },
  { key: 'video', label: lbl('video'), icon: '🎬' },
  { key: 'writing', label: lbl('writings'), icon: '📚' },
  { key: 'memories', label: lbl('memories'), icon: '💫' },
])
 
const displayedItems = computed(() => {
  let list = []
  switch (activeTab.value) {
    case 'image': list = [...images.value]; break
    case 'sound': list = [...sounds.value]; break
    case 'video': list = [...videos.value]; break
    case 'writing': list = [...writings.value]; break
    case 'memories': list = [...memorySounds.value, ...memoryVideos.value]; break
  }
  if (activeTopicFilter.value != null && activeTab.value !== 'memories') {
    const fid = String(activeTopicFilter.value)
    list = list.filter(item => { const tid = item.topicId != null ? item.topicId : (item.topic?.id != null ? item.topic.id : null); return tid != null && String(tid) === fid })
  }
  switch (sortBy.value) {
    case 'newest': list.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || '')); break
    case 'oldest': list.sort((a, b) => (a.createdAt || '').localeCompare(b.createdAt || '')); break
    case 'title': list.sort((a, b) => pTitle(a).localeCompare(pTitle(b))); break
  }
  return list
})
const totalClientPages = computed(() => Math.ceil(displayedItems.value.length / clientPageSize))
const paginatedItems   = computed(() => { const s = clientPage.value * clientPageSize; return displayedItems.value.slice(s, s + clientPageSize) })
const heroStats        = computed(() => [{ value: images.value.length, label: lbl('images') }, { value: sounds.value.length, label: lbl('sound') }, { value: videos.value.length, label: lbl('video') }, { value: writings.value.length, label: lbl('writings') }])
const activeTopicName  = computed(() => { if (!activeTopicFilter.value) return ''; const fid = String(activeTopicFilter.value); const all = [...imageTopics.value, ...soundTopics.value, ...videoTopics.value, ...writingTopics.value]; const t = all.find(t => String(t.id) === fid); return t ? topicName(t) : '' })
const relatedItems     = computed(() => { if (!activeItem.value) return []; const myTags = new Set(pTags(activeItem.value)); const pool = activeItem.value._mediaType === 'image' ? images.value : activeItem.value._mediaType === 'sound' ? sounds.value : activeItem.value._mediaType === 'video' ? videos.value : writings.value; return pool.filter(p => p.id !== activeItem.value.id && pTags(p).some(t => myTags.has(t))).slice(0, 4) })
const totalSoundDuration = computed(() => { if (!activeItem.value || activeItem.value._mediaType !== 'sound') return 0; return (activeItem.value.files || []).reduce((sum, f) => sum + (f.durationSeconds || 0), 0) })
const currentImageIdx  = computed(() => { if (!selectedImage.value || !activeItem.value?.imageAlbum) return 0; return activeItem.value.imageAlbum.findIndex(i => i.id === selectedImage.value.id) })
const canPrevImage     = computed(() => currentImageIdx.value > 0)
const canNextImage     = computed(() => currentImageIdx.value < (activeItem.value?.imageAlbum?.length || 0) - 1)
 
function pTitle(item)        { if (!item) return ''; const c = lang.activeLang === 'CKB'; return (c ? item.ckbContent?.title : item.kmrContent?.title) || (c ? item.kmrContent?.title : item.ckbContent?.title) || '' }
function pDesc(item)         { if (!item) return ''; const c = lang.activeLang === 'CKB'; return (c ? item.ckbContent?.description : item.kmrContent?.description) || (c ? item.kmrContent?.description : item.ckbContent?.description) || '' }
function pCover(item)        { if (!item) return fallbackCover; const c = lang.activeLang === 'CKB'; return (c ? item.ckbCoverUrl : item.kmrCoverUrl) || (c ? item.kmrCoverUrl : item.ckbCoverUrl) || item.hoverCoverUrl || fallbackCover }
function pHoverCover(item)   { if (!item) return null; const cover = pCover(item); const hover = item.hoverCoverUrl; if (!hover || hover === cover || hover === fallbackCover) return null; return hover }
function pTagsCkb(item)      { if (!item) return []; return [...(item.tagsCkb || item.tags?.ckb || [])] }
function pTagsKmr(item)      { if (!item) return []; return [...(item.tagsKmr || item.tags?.kmr || [])] }
function pTags(item)         { const c = lang.activeLang === 'CKB'; return c ? pTagsCkb(item) : pTagsKmr(item) }
function pTagsOther(item)    { const c = lang.activeLang === 'CKB'; return c ? pTagsKmr(item) : pTagsCkb(item) }
function pKeywordsCkb(item)  { if (!item) return []; return [...(item.keywordsCkb || item.keywords?.ckb || [])] }
function pKeywordsKmr(item)  { if (!item) return []; return [...(item.keywordsKmr || item.keywords?.kmr || [])] }
function pLocation(item)     { return !item ? '' : (lang.activeLang === 'CKB' ? item.ckbContent?.location : item.kmrContent?.location) || '' }
function pCollectedBy(item)  { return !item ? '' : (lang.activeLang === 'CKB' ? item.ckbContent?.collectedBy : item.kmrContent?.collectedBy) || '' }
function pDirector(item)     { return !item ? '' : (lang.activeLang === 'CKB' ? item.ckbContent?.director : item.kmrContent?.director) || '' }
function pProducer(item)     { return !item ? '' : (lang.activeLang === 'CKB' ? item.ckbContent?.producer : item.kmrContent?.producer) || '' }
function pWriter(item)       { return !item ? '' : (lang.activeLang === 'CKB' ? item.ckbContent?.writer : item.kmrContent?.writer) || '' }
function pPageCount(item)    { return !item ? null : item.ckbContent?.pageCount || item.kmrContent?.pageCount || null }
function pFileFormat(item)   { return !item ? '' : item.ckbContent?.fileFormat || item.kmrContent?.fileFormat || '' }
function pFileSizeBytes(item){ return !item ? null : item.ckbContent?.fileSizeBytes || item.kmrContent?.fileSizeBytes || null }
 
function pTopicName(item) {
  if (!item) return ''
  const al = lang.activeLang
  if (al === 'CKB' && item.topicNameCkb) return item.topicNameCkb
  if (al === 'KMR' && item.topicNameKmr) return item.topicNameKmr
  if (item.topicNameCkb) return item.topicNameCkb
  if (item.topic) { if (al === 'CKB' && item.topic.nameCkb) return item.topic.nameCkb; if (al === 'KMR' && item.topic.nameKmr) return item.topic.nameKmr; return item.topic.nameCkb || item.topic.nameKmr || '' }
  return ''
}
 
function topicName(topic)    { if (!topic) return ''; return (lang.activeLang === 'CKB' ? topic.nameCkb : topic.nameKmr) || topic.nameCkb || topic.nameKmr || '' }
function getMediaIcon(type)  { return { image: '🖼️', sound: '🎵', video: '🎬', writing: '📚' }[type] || '📎' }
function getMediaTypeLabel(type) { return { image: lbl('images'), sound: lbl('sound'), video: lbl('video'), writing: lbl('writings') }[type] || type }
function getTypeEmoji(item)  { if (!item) return '📎'; if (item._mediaType === 'sound') return item.trackState === 'MULTI' ? '💿' : '🎵'; if (item._mediaType === 'video') return item.videoType === 'FILM' ? '🎞' : '📹'; if (item._mediaType === 'image') return item.collectionType === 'SINGLE' ? '🖼️' : '📷'; if (item._mediaType === 'writing') return '📖'; return '📎' }
function getTypeLabel(item)  { if (!item) return ''; if (item._mediaType === 'sound') return item.trackState || 'SOUND'; if (item._mediaType === 'video') return item.videoType || 'VIDEO'; if (item._mediaType === 'image') return item.collectionType || 'IMAGE'; if (item._mediaType === 'writing') return [...(item.bookGenres || [])].map(g => getGenreLabel(g)).slice(0, 1).join('') || 'WRITING'; return item._mediaType?.toUpperCase() || '' }
function getItemDate(item)   { return item?.publishmentDate || item?.createdAt || null }
function getCountBadge(item) { if (!item) return null; if (item._mediaType === 'sound' && item.files?.length) return `🎵 ${item.files.length}`; if (item._mediaType === 'image' && item.imageAlbum?.length) return `🖼️ ${item.imageAlbum.length}`; if (item._mediaType === 'video' && item.videoClipItems?.length) return `📹 ${item.videoClipItems.length}`; return null }
function getExtraLine(item)  { if (!item) return ''; if (item._mediaType === 'writing') return pWriter(item); if (item._mediaType === 'sound') return item.reader || item.soundType || ''; if (item._mediaType === 'video') return pDirector(item); if (item._mediaType === 'image') return pLocation(item); return '' }
function tabCount(key)       { if (key === 'image') return images.value.length; if (key === 'sound') return sounds.value.length; if (key === 'video') return videos.value.length; if (key === 'writing') return writings.value.length; if (key === 'memories') return memorySounds.value.length + memoryVideos.value.length; return 0 }
function getTopicsFor(key)   { if (key === 'image') return imageTopics.value; if (key === 'sound') return soundTopics.value; if (key === 'video') return videoTopics.value; if (key === 'writing') return writingTopics.value; return [] }
function getCountForTopic(tabKey, topicId) { const fid = String(topicId); let list = []; if (tabKey === 'image') list = images.value; else if (tabKey === 'sound') list = sounds.value; else if (tabKey === 'video') list = videos.value; else if (tabKey === 'writing') list = writings.value; return list.filter(item => { const tid = item.topicId != null ? item.topicId : (item.topic?.id != null ? item.topic.id : null); return tid != null && String(tid) === fid }).length }
function getVideoSourceUrl(item) { if (!item) return ''; return item.sourceUrl || '' }
function getVideoEmbedUrl(item)  { if (!item) return ''; return item.sourceEmbedUrl || '' }
function getClipUrl(clip)        { return !clip ? '' : clip.url || clip.sourceUrl || '' }
function getClipEmbedUrl(clip)   { return !clip ? '' : clip.embedUrl || clip.sourceEmbedUrl || '' }
function truncate(text, max)     { if (!text) return ''; return text.length > max ? text.slice(0, max) + '…' : text }
function formatDate(v)           { if (!v) return ''; try { const d = new Date(v); if (isNaN(d.getTime())) return String(v); return d.toLocaleDateString(lang.activeLang === 'CKB' ? 'ckb' : 'ku', { year: 'numeric', month: 'long', day: 'numeric' }) } catch { return String(v) } }
function formatTime(s)           { if (!s || isNaN(s)) return '0:00'; const m = Math.floor(s / 60); const sec = Math.floor(s % 60).toString().padStart(2, '0'); if (m >= 60) return `${Math.floor(m/60)}:${String(m%60).padStart(2,'0')}:${sec}`; return `${m}:${sec}` }
function formatSize(bytes)       { if (!bytes) return ''; return bytes < 1048576 ? `${(bytes/1024).toFixed(0)} KB` : `${(bytes/1048576).toFixed(1)} MB` }
function onImgError(e)           { e.target.src = fallbackCover }
 
async function fetchAll() {
  isLoading.value = true
  try { await Promise.allSettled([fetchImages(), fetchSounds(), fetchVideos(), fetchWritings(), fetchTopics()]) }
  finally { isLoading.value = false }
}
async function fetchImages()   { try { const { data } = await api.get('/image-collections', { params: { page: 0, size: 1000 } }); images.value   = toArray(data).map(i => ({ ...i, _mediaType: 'image'   })) } catch (e) { console.warn('images:', e.message) } }
async function fetchSounds()   { try { const { data } = await api.get('/sound-tracks',        { params: { page: 0, size: 1000 } }); sounds.value   = toArray(data).map(s => ({ ...s, _mediaType: 'sound'   })) } catch (e) { console.warn('sounds:', e.message) } }
async function fetchVideos()   { try { const { data } = await api.get('/videos',             { params: { page: 0, size: 200  } }); videos.value   = toArray(data).map(v => ({ ...v, _mediaType: 'video'   })) } catch (e) { console.warn('videos:', e.message) } }
async function fetchWritings() { try { const { data } = await api.get('/writings',           { params: { page: 0, size: 200  } }); writings.value = toArray(data).map(w => ({ ...w, _mediaType: 'writing' })) } catch (e) { console.warn('writings:', e.message) } }
async function fetchTopics() {
  try {
    const [imgT, sndT, vidT, wrtT] = await Promise.allSettled([api.get('/image-collections/topics'), api.get('/sound-tracks/topics'), api.get('/videos/topics'), api.get('/writings/topics')])
    if (imgT.status === 'fulfilled') imageTopics.value   = toArray(imgT.value.data)
    if (sndT.status === 'fulfilled') soundTopics.value   = toArray(sndT.value.data)
    if (vidT.status === 'fulfilled') videoTopics.value   = toArray(vidT.value.data)
    if (wrtT.status === 'fulfilled') writingTopics.value = toArray(wrtT.value.data)
  } catch (e) { console.warn('topics:', e.message) }
}
 
function switchTab(key)      { activeTab.value = key; activeTopicFilter.value = null; clientPage.value = 0; openDropdownKey.value = null }
function setTopicFilter(id)  { activeTopicFilter.value = id; clientPage.value = 0; openDropdownKey.value = null; nextTick(() => scrollToContent()) }
function clearTopicFilter()  { activeTopicFilter.value = null; clientPage.value = 0 }
function clearFilters()      { activeTopicFilter.value = null; clientPage.value = 0 }
function onTabEnter(key)     { cancelDropClose(); openDropdownKey.value = key }
function scheduleDropClose() { cancelDropClose(); dropCloseTimer = setTimeout(() => { openDropdownKey.value = null }, 220) }
function cancelDropClose()   { if (dropCloseTimer) { clearTimeout(dropCloseTimer); dropCloseTimer = null } }
function goPrev()            { if (clientPage.value > 0) { clientPage.value--; scrollToContent() } }
function goNext()            { if (clientPage.value + 1 < totalClientPages.value) { clientPage.value++; scrollToContent() } }
function scrollToContent()   { gridSection.value?.scrollIntoView({ behavior: 'smooth' }) }
 
function openItem(item) {
  stopAudio()
  activeItem.value = item
  selectedClip.value  = item.videoClipItems?.[0] || null
  selectedImage.value = item.imageAlbum?.[0] || null
  currentTrackIdx.value = -1; currentTrack.value = null; audioError.value = null
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
function closeItem() {
  stopAudio()
  activeItem.value = null; selectedClip.value = null; selectedImage.value = null
  currentTrackIdx.value = -1; currentTrack.value = null; audioError.value = null
}
function openMemoryFromDropdown(item) { openDropdownKey.value = null; activeTab.value = 'memories'; openItem(item) }
 
function getAudioUrl(file) { if (!file) return ''; return file.fileUrl || file.externalUrl || file.url || file.audioUrl || '' }
async function playTrack(file, idx) {
  const url = getAudioUrl(file)
  if (!url) { audioError.value = 'Audio file not available'; return }
  audioError.value = null; currentTrackIdx.value = idx; currentTrack.value = file
  await nextTick()
  if (!audioPlayer.value) { audioError.value = 'Audio player not ready'; return }
  audioPlayer.value.pause(); audioPlayer.value.currentTime = 0
  audioPlayer.value.src = url; audioPlayer.value.load()
  try { await audioPlayer.value.play() } catch (err) { audioError.value = 'Failed to play audio: ' + (err.message || 'Unknown error'); isAudioPlaying.value = false }
}
function togglePlay()     { if (!audioPlayer.value) return; if (audioPlayer.value.paused) { audioPlayer.value.play().catch(() => { audioError.value = 'Failed to resume playback' }) } else { audioPlayer.value.pause() } }
function prevTrack()      { if (currentTrackIdx.value > 0 && activeItem.value?.files) playTrack(activeItem.value.files[currentTrackIdx.value - 1], currentTrackIdx.value - 1) }
function nextTrack()      { if (activeItem.value?.files && currentTrackIdx.value < activeItem.value.files.length - 1) playTrack(activeItem.value.files[currentTrackIdx.value + 1], currentTrackIdx.value + 1) }
function onTrackEnded()   { isAudioPlaying.value = false; nextTrack() }
function onAudioLoaded()  { if (audioPlayer.value) audioDuration.value = audioPlayer.value.duration || 0 }
function onAudioTimeUpdate() { if (!audioPlayer.value) return; audioCurrentTime.value = audioPlayer.value.currentTime || 0; const dur = audioPlayer.value.duration; audioProgress.value = dur ? (audioCurrentTime.value / dur) * 100 : 0 }
function onAudioError()   { const me = audioPlayer.value?.error; let msg = 'Error loading audio file'; if (me) { switch (me.code) { case 1: msg = 'Audio loading was aborted'; break; case 2: msg = 'Network error while loading audio'; break; case 3: msg = 'Audio decoding error'; break; case 4: msg = 'Audio format not supported'; break } } audioError.value = msg; isAudioPlaying.value = false }
function seekByWave(e, trackIdx) { if (currentTrackIdx.value !== trackIdx || !audioPlayer.value?.duration) return; const rect = e.currentTarget.getBoundingClientRect(); const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)); audioPlayer.value.currentTime = ratio * audioPlayer.value.duration }
function stopAudio() { if (audioPlayer.value) { audioPlayer.value.pause(); audioPlayer.value.removeAttribute('src'); audioPlayer.value.load() }; isAudioPlaying.value = false; audioCurrentTime.value = 0; audioDuration.value = 0; audioProgress.value = 0; currentTrackIdx.value = -1; currentTrack.value = null }
 
function prevImage()       { if (canPrevImage.value) selectedImage.value = activeItem.value.imageAlbum[currentImageIdx.value - 1] }
function nextImage()       { if (canNextImage.value) selectedImage.value = activeItem.value.imageAlbum[currentImageIdx.value + 1] }
function openFullscreen(url) { if (!url) return; fullscreenUrl.value = url; isFullscreen.value = true }
 
function handleKeydown(e) {
  if (e.key === 'Escape') { if (isFullscreen.value) { isFullscreen.value = false; return }; if (activeItem.value) { closeItem(); return }; if (tagSearchMode.value) { clearTagSearch(); return } }
  if (!activeItem.value) return
  if (activeItem.value._mediaType === 'image') { if (e.key === 'ArrowLeft') prevImage(); if (e.key === 'ArrowRight') nextImage() }
  if (activeItem.value._mediaType === 'sound' && currentTrack.value) { if (e.key === 'ArrowLeft') prevTrack(); if (e.key === 'ArrowRight') nextTrack(); if (e.key === ' ') { e.preventDefault(); togglePlay() } }
}
function handleClickOutside(e) { if (!e.target.closest('.tabnav__item')) openDropdownKey.value = null }
watch(() => lang.activeLang, () => { if (isFullscreen.value) isFullscreen.value = false })
onMounted(async () => {
  await fetchAll()
  window.addEventListener('keydown', handleKeydown)
  document.addEventListener('click', handleClickOutside)
  if (route.query.id && route.query.type) {
    const typeMap = {
      video:   { tab: 'video',   list: videos },
      sound:   { tab: 'sound',   list: sounds },
      writing: { tab: 'writing', list: writings },
      image:   { tab: 'image',   list: images },
    }
    const entry = typeMap[route.query.type]
    if (entry) {
      activeTab.value = entry.tab
      const target = entry.list.value.find(i => String(i.id) === String(route.query.id))
      if (target) openItem(target)
    }
  }
})
onUnmounted(() => { stopAudio(); if (slideTimer) clearInterval(slideTimer); if (dropCloseTimer) clearTimeout(dropCloseTimer); window.removeEventListener('keydown', handleKeydown); document.removeEventListener('click', handleClickOutside) })
</script>

<style scoped>
/* ─── INLINE TRACK CONTROLS (replaces audio-bar) ──────────────── */
.track__inline-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
  animation: fadeInControls 0.2s ease both;
}
@keyframes fadeInControls {
  from { opacity: 0; transform: translateY(5px); }
  to   { opacity: 1; transform: translateY(0); }
}
.iabtn {
  background: transparent;
  border: 1px solid var(--border);
  border-radius: 999px;
  width: 32px;
  height: 32px;
  display: grid;
  place-items: center;
  cursor: pointer;
  font-size: 13px;
  color: var(--text-muted);
  transition: all 0.18s ease;
  padding: 0;
  flex-shrink: 0;
}
.iabtn:hover:not(:disabled) {
  background: var(--brand);
  color: white;
  border-color: var(--brand);
  transform: scale(1.1);
}
.iabtn:disabled { opacity: 0.28; cursor: not-allowed; }
.iabtn--play {
  background: var(--brand);
  color: white;
  border-color: var(--brand);
  width: 38px;
  height: 38px;
  font-size: 15px;
  box-shadow: 0 4px 12px rgba(140,21,21,0.35);
}
.iabtn--play:hover { background: var(--brand-dark); }
.track__inline-time {
  display: flex;
  align-items: center;
  gap: 4px;
  font-family: monospace;
  font-size: 13px;
  margin-inline-start: 4px;
}
.itime__cur  { font-weight: 700; color: var(--brand); }
.itime__sep  { color: var(--border); }
.itime__dur  { color: var(--text-muted); }
.pub {
  --brand: #8C1515; --brand-light: rgba(140,21,21,.09); --brand-dark: #6b0f0f;
  --accent: #c9a84c; --accent-light: rgba(201,168,76,.22);
  --bg: #ffffff; --surface: #ffffff; --surface-elevated: #ffffff;
  --text: #2E2D29; --text-muted: #5f6368;
  --border: rgba(0,0,0,.10); --border-light: rgba(0,0,0,.06);
  --shadow-sm: 0 2px 8px rgba(0,0,0,.06); --shadow: 0 10px 26px rgba(0,0,0,.10); --shadow-lg: 0 20px 56px rgba(0,0,0,.17);
  --radius-sm: 8px; --radius: 16px; --radius-lg: 24px;
  --container: 1280px;
  --font-sans: system-ui, -apple-system, "Segoe UI", Tahoma, sans-serif;
  --font-serif: Georgia, "Times New Roman", serif;
  --font-display: Georgia, "Times New Roman", serif;
  background: var(--bg); color: var(--text); min-height: 100vh; font-family: var(--font-sans); line-height: 1.6;
}
.pub[dir="rtl"] { direction: rtl; text-align: right; }
.pub[dir="ltr"] { direction: ltr; text-align: left; }
.container { max-width: var(--container); margin: 0 auto; padding: 0 24px; }

/* ─── HERO ─────────────────────────────────────────────────────── */
.hero { position: relative; min-height: 85vh; overflow: hidden; display: grid; place-items: center; background: linear-gradient(135deg, var(--brand-dark) 0%, var(--brand) 100%); }
.hero__canvas { position: absolute; inset: 0; overflow: hidden; }
.hero__slides { position: absolute; inset: 0; }
.hero__slide { position: absolute; inset: 0; background-size: cover; background-position: center; opacity: 0; transform: scale(1.1); transition: opacity 1.2s ease, transform 8s ease; }
.hero__slide--active { opacity: 1; transform: scale(1); z-index: 2; }
.hero__slide--prev { opacity: 0; transform: scale(1.05); z-index: 1; }
.hero__slide--kb-a { animation: kenBurnsA 20s ease-in-out infinite alternate; }
.hero__slide--kb-b { animation: kenBurnsB 20s ease-in-out infinite alternate; }
@keyframes kenBurnsA { 0% { transform: scale(1) translate(0,0); } 100% { transform: scale(1.1) translate(-2%,-2%); } }
@keyframes kenBurnsB { 0% { transform: scale(1.1) translate(0,0); } 100% { transform: scale(1) translate(2%,2%); } }
.hero__overlay { position: absolute; inset: 0; z-index: 3; }
.hero__overlay--base { background: linear-gradient(to bottom, rgba(15,46,36,0.4) 0%, rgba(15,46,36,0.2) 50%, rgba(15,46,36,0.8) 100%); }
.hero__overlay--vignette { background: radial-gradient(ellipse at center, transparent 40%, rgba(15,46,36,0.6) 100%); }
.hero__overlay--bottom { background: linear-gradient(to top, var(--brand-dark) 0%, transparent 40%); opacity: 0.9; }
.hero__overlay--top { background: linear-gradient(to bottom, rgba(15,46,36,0.6) 0%, transparent 30%); }
.hero__grain { position: absolute; inset: 0; opacity: 0.05; z-index: 4; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); pointer-events: none; }
.hero__scanlines { position: absolute; inset: 0; background: linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.1) 50%); background-size: 100% 4px; opacity: 0.1; z-index: 4; pointer-events: none; }
.hero__filigree { position: absolute; z-index: 5; background: linear-gradient(90deg, transparent, var(--accent), transparent); opacity: 0.3; }
.hero__filigree--h1 { top: 15%; left: 10%; right: 10%; height: 1px; }
.hero__filigree--h2 { bottom: 20%; left: 15%; right: 15%; height: 1px; }
.hero__filigree--v1 { left: 10%; top: 15%; bottom: 20%; width: 1px; background: linear-gradient(to bottom, transparent, var(--accent), transparent); }
.hero__filigree--v2 { right: 10%; top: 15%; bottom: 20%; width: 1px; background: linear-gradient(to bottom, transparent, var(--accent), transparent); }
.hero__corner { position: absolute; width: 60px; height: 60px; border: 2px solid var(--accent); opacity: 0.4; z-index: 5; }
.hero__corner--tl { top: 40px; left: 40px; border-right: 0; border-bottom: 0; }
.hero__corner--tr { top: 40px; right: 40px; border-left: 0; border-bottom: 0; }
.hero__corner--bl { bottom: 40px; left: 40px; border-right: 0; border-top: 0; }
.hero__corner--br { bottom: 40px; right: 40px; border-left: 0; border-top: 0; }
.hero__particles { position: absolute; inset: 0; z-index: 3; overflow: hidden; pointer-events: none; }
.hparticle { position: absolute; width: var(--sz, 2px); height: var(--sz, 2px); background: var(--accent); border-radius: 50%; left: var(--x); top: var(--y); opacity: 0; animation: floatUp var(--dur, 15s) var(--del, 0s) ease-in-out infinite; box-shadow: 0 0 10px var(--accent); }
@keyframes floatUp { 0% { transform: translateY(100vh) scale(0); opacity: 0; } 10% { opacity: 0.6; } 90% { opacity: 0.6; } 100% { transform: translateY(-100vh) scale(1); opacity: 0; } }
.hero__dots { position: absolute; bottom: 120px; left: 50%; transform: translateX(-50%); z-index: 10; display: flex; gap: 12px; }
.hero__dot { width: 10px; height: 10px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.5); background: transparent; cursor: pointer; transition: all 0.3s ease; padding: 0; }
.hero__dot:hover { border-color: var(--accent); transform: scale(1.2); }
.hero__dot--on { background: var(--accent); border-color: var(--accent); transform: scale(1.3); }
.hero__inner { position: relative; z-index: 10; text-align: center; color: white; padding: 120px 24px 80px; }
.hero__eyebrow { display: flex; flex-direction: column; align-items: center; gap: 20px; margin-bottom: 32px; }
.hero__stamp { width: 100px; height: 100px; }
.stamp__ring { width: 100%; height: 100%; border: 3px solid var(--accent); border-radius: 50%; display: grid; place-items: center; position: relative; animation: rotateStamp 20s linear infinite; }
.stamp__ring::before { content: ''; position: absolute; inset: 8px; border: 1px solid rgba(201,162,39,0.5); border-radius: 50%; }
@keyframes rotateStamp { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
.stamp__inner { text-align: center; animation: rotateStamp 20s linear infinite reverse; }
.stamp__text { display: block; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; font-weight: 700; color: var(--accent); margin-bottom: 4px; }
.stamp__year { display: block; font-family: var(--font-serif); font-size: 24px; font-weight: 700; color: white; }
.hero__kicker { display: flex; align-items: center; gap: 12px; font-size: 13px; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(255,255,255,0.8); font-weight: 600; }
.kicker__rule { width: 60px; height: 1px; background: linear-gradient(90deg, transparent, var(--accent), transparent); }
.kicker__diamond { color: var(--accent); font-size: 8px; }
.hero__headline { margin: 0 0 32px; font-family: var(--font-display); font-weight: 700; line-height: 1.1; }
.headline__line--main { display: block; font-size: clamp(40px, 8vw, 80px); margin-bottom: 16px; text-shadow: 0 4px 20px rgba(0,0,0,0.3); background: linear-gradient(to bottom, #fff 0%, rgba(255,255,255,0.9) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.headline__line--sub { display: block; font-size: clamp(18px, 3vw, 28px); font-weight: 400; opacity: 0.9; color: rgba(255,255,255,0.9); }
.headline__word { display: inline-flex; align-items: center; gap: 12px; }
.headline__separator { color: var(--accent); opacity: 0.8; }
.hero__divider { display: flex; align-items: center; justify-content: center; gap: 16px; margin-bottom: 40px; }
.hdiv__line { width: 100px; height: 1px; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent); }
.hdiv__ornament { color: var(--accent); font-size: 20px; opacity: 0.8; }
.hero__stats { display: flex; justify-content: center; gap: 40px; flex-wrap: wrap; }
.hstat { text-align: center; position: relative; }
.hstat__inner { padding: 16px 24px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); border-radius: var(--radius); backdrop-filter: blur(10px); transition: transform 0.3s ease, background 0.3s ease; }
.hstat:hover .hstat__inner { transform: translateY(-4px); background: rgba(255,255,255,0.12); border-color: var(--accent); }
.hstat__num { font-family: var(--font-serif); font-size: 36px; font-weight: 700; color: var(--accent); line-height: 1; margin-bottom: 6px; }
.hstat__lbl { font-size: 13px; text-transform: uppercase; letter-spacing: 0.1em; opacity: 0.9; color: rgba(255,255,255,0.8); }
.hero__scroll { position: absolute; bottom: 40px; left: 50%; transform: translateX(-50%); z-index: 10; background: transparent; border: none; color: white; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 8px; opacity: 0.8; transition: opacity 0.3s ease; padding: 12px; }
.hero__scroll:hover { opacity: 1; }
.scroll__label { font-size: 12px; letter-spacing: 0.15em; text-transform: uppercase; font-weight: 600; }
.scroll__arrow { animation: bounceArrow 2s infinite; }
@keyframes bounceArrow { 0%, 20%, 50%, 80%, 100% { transform: translateY(0); } 40% { transform: translateY(10px); } 60% { transform: translateY(5px); } }
.hero__orb { position: absolute; border-radius: 50%; pointer-events: none; z-index: 2; }
.orb--a { width: 400px; height: 400px; top: -100px; left: -100px; background: radial-gradient(circle, rgba(140,21,21,0.3) 0%, transparent 70%); animation: orbFloat 18s ease-in-out infinite; }
.orb--b { width: 300px; height: 300px; bottom: -80px; right: -80px; background: radial-gradient(circle, rgba(201,162,39,0.2) 0%, transparent 70%); animation: orbFloat 22s ease-in-out infinite reverse; }
.orb--c { width: 200px; height: 200px; top: 40%; left: 55%; background: radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%); animation: orbFloat 14s ease-in-out infinite 4s; }
.orb--gold { width: 500px; height: 500px; top: 50%; left: 50%; transform: translate(-50%, -50%); background: radial-gradient(ellipse, rgba(201,162,39,0.06) 0%, transparent 65%); animation: orbPulse 10s ease-in-out infinite; }
@keyframes orbFloat { 0%, 100% { transform: translate(0, 0) scale(1); } 33% { transform: translate(30px, -20px) scale(1.05); } 66% { transform: translate(-20px, 30px) scale(0.95); } }
@keyframes orbPulse { 0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 1; } 50% { transform: translate(-50%, -50%) scale(1.15); opacity: 0.7; } }
.hero__slide--gradient { opacity: 1; transform: none; }
.hero__slide--grad-image { background: linear-gradient(135deg, #1a3a2a 0%, #2d5a42 50%, #1a3a2a 100%); }
.hero__slide--grad-sound { background: linear-gradient(135deg, #3a1a2a 0%, #5a2d42 50%, #3a1a2a 100%); }
.hero__slide--grad-video { background: linear-gradient(135deg, #1a2a3a 0%, #2d425a 50%, #1a2a3a 100%); }
.hero__slide--grad-writing { background: linear-gradient(135deg, #2a2a1a 0%, #4a4a2d 50%, #2a2a1a 100%); }
.hero__slide--grad-memories { background: linear-gradient(135deg, #2a1a3a 0%, #422d5a 50%, #2a1a3a 100%); }

.audio-error { background: rgba(220,38,38,0.1); border: 1px solid rgba(220,38,38,0.3); color: #dc2626; padding: 12px 16px; border-radius: var(--radius); margin-bottom: 16px; font-weight: 600; text-align: center; }

/* ─── TAB NAV ─────────────────────────────────────────────────── */
.tabnav { background: var(--surface); border-bottom: 1px solid var(--border); position: sticky; top: 0; z-index: 100; box-shadow: var(--shadow-sm); }
.tabnav__row { display: flex; gap: 8px; padding: 8px 0; position: relative; align-items: center; }
.tabnav__item { position: relative; flex: 1; max-width: 200px; }
.tabtn { width: 100%; display: flex; align-items: center; gap: 10px; padding: 16px 20px; background: transparent; border: 1px solid transparent; border-radius: var(--radius); cursor: pointer; transition: all 0.2s ease; font-size: 15px; font-weight: 600; color: var(--text-muted); position: relative; }
.tabtn:hover { background: var(--bg); color: var(--brand); }
.tabtn--on { background: var(--brand); color: white; border-color: var(--brand); box-shadow: var(--shadow); }
.tabtn__lbl { flex: 1; text-align: start; }
.tabtn__chevron { transition: transform 0.3s ease; opacity: 0.5; }
.tabnav__item:hover .tabtn__chevron { transform: rotate(180deg); opacity: 1; }
.tabtn__count { background: var(--accent); color: var(--brand-dark); font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 999px; min-width: 20px; text-align: center; }
.tabdrop { position: absolute; top: calc(100% + 8px); left: 0; min-width: 280px; background: var(--surface-elevated); border: 1px solid var(--border); border-radius: var(--radius); box-shadow: var(--shadow-lg); z-index: 200; overflow: hidden; }
.pub[dir="rtl"] .tabdrop { left: auto; right: 0; }
.tabdrop__inner { padding: 8px; max-height: 60vh; overflow-y: auto; }
.tabdrop__header { display: flex; align-items: center; gap: 10px; padding: 12px 16px; font-weight: 700; color: var(--brand); font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; }
.tabdrop__divider { height: 1px; background: var(--border); margin: 8px 0; }
.tabdrop__item { width: 100%; display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-radius: var(--radius-sm); border: none; background: transparent; cursor: pointer; transition: all 0.2s ease; text-align: start; font-size: 14px; color: var(--text); }
.tabdrop__item:hover { background: var(--bg); transform: translateX(4px); }
.pub[dir="rtl"] .tabdrop__item:hover { transform: translateX(-4px); }
.tabdrop__item--on { background: rgba(140,21,21,0.08); color: var(--brand); font-weight: 600; }
.tabdrop__item-ico { width: 18px; height: 18px; opacity: 0.6; flex-shrink: 0; }
.tabdrop__item-name { flex: 1; }
.tabdrop__item-count { background: var(--bg); color: var(--text-muted); font-size: 12px; padding: 2px 8px; border-radius: 999px; font-weight: 600; min-width: 24px; text-align: center; }
.tabdrop__topics-list { max-height: 300px; overflow-y: auto; }
.tabdrop__mem-section { margin-top: 8px; }
.tabdrop__mem-section-title { display: flex; align-items: center; gap: 8px; padding: 8px 16px; font-size: 12px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; }
.tabdrop__sec-count { margin-inline-start: auto; background: var(--accent); color: var(--brand-dark); padding: 2px 6px; border-radius: 999px; font-size: 11px; }
.tabdrop__item--mem { padding: 10px 16px; }
.tabdrop__mem-cover { width: 40px; height: 40px; border-radius: var(--radius-sm); overflow: hidden; position: relative; flex-shrink: 0; background: var(--bg); }
.tabdrop__mem-cover img { width: 100%; height: 100%; object-fit: cover; }
.tabdrop__mem-play { position: absolute; inset: 0; background: rgba(27,77,62,0.7); color: white; display: grid; place-items: center; font-size: 12px; opacity: 0; transition: opacity 0.2s; }
.tabdrop__item:hover .tabdrop__mem-play { opacity: 1; }
.tabdrop__mem-badge { font-size: 12px; }
.tabdrop__empty { padding: 16px; text-align: center; color: var(--text-muted); font-size: 13px; }
.tabnav__sep { display: inline-block; width: 1px; height: 1.4em; background: currentColor; opacity: 0.18; flex-shrink: 0; margin: 0 2px; }

/* ─── BODY / TOOLBAR ───────────────────────────────────────────── */
.body { padding: 40px 0 80px; }
.active-filter { margin-bottom: 24px; }
.afilt { display: inline-flex; align-items: center; gap: 10px; background: rgba(140,21,21,0.08); border: 1px solid var(--border); padding: 8px 16px; border-radius: 999px; font-size: 14px; font-weight: 600; color: var(--brand); animation: fadeIn 0.3s ease; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
.afilt__dot { width: 8px; height: 8px; background: var(--accent); border-radius: 50%; box-shadow: 0 0 8px var(--accent); }
.afilt__x { width: 20px; height: 20px; border-radius: 50%; border: none; background: transparent; cursor: pointer; display: grid; place-items: center; color: var(--text-muted); transition: all 0.2s; margin-inline-start: 4px; }
.afilt__x:hover { background: var(--brand); color: white; }
.toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; padding: 16px 0; border-bottom: 1px solid var(--border-light); }
.toolbar__left { display: flex; align-items: center; gap: 12px; }
.toolbar__indicator { width: 8px; height: 8px; border-radius: 50%; background: #22c55e; box-shadow: 0 0 0 4px rgba(34,197,94,0.2); }
.toolbar__indicator.ind--ok { animation: pulse 2s infinite; }
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
.toolbar__label { color: var(--text-muted); font-size: 15px; }
.toolbar__label strong { color: var(--brand); font-weight: 700; }
.tsort { position: relative; }
.tsort__sel { appearance: none; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 12px 40px 12px 16px; font-size: 14px; font-weight: 600; color: var(--text); cursor: pointer; min-width: 160px; transition: all 0.2s; }
.pub[dir="rtl"] .tsort__sel { padding: 12px 16px 12px 40px; }
.tsort__sel:hover { border-color: var(--brand-light); box-shadow: var(--shadow-sm); }
.tsort__sel:focus { outline: none; border-color: var(--brand); }
.tsort__ico { position: absolute; right: 16px; top: 50%; transform: translateY(-50%); pointer-events: none; color: var(--text-muted); }
.pub[dir="rtl"] .tsort__ico { right: auto; left: 16px; }

/* ─── GRID & CARDS ─────────────────────────────────────────────── */
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 24px; }
.skel { background: var(--surface); border-radius: var(--radius); overflow: hidden; border: 1px solid var(--border-light); animation: fadeIn 0.5s ease both; animation-delay: var(--d, 0s); }
.skel__thumb { aspect-ratio: 16/10; }
.shimmer { background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; }
@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
.skel__body { padding: 20px; }
.skel__line { height: 12px; background: #f0f0f0; border-radius: 6px; margin-bottom: 8px; }
.skel__pills { display: flex; gap: 8px; margin-top: 16px; }
.skel__pill { width: 60px; height: 24px; background: #f0f0f0; border-radius: 999px; }
.card { background: var(--surface); border: 1px solid var(--border-light); border-radius: var(--radius); overflow: hidden; cursor: pointer; transition: all 0.3s cubic-bezier(0.4,0,0.2,1); position: relative; animation: fadeInUp 0.5s ease both; animation-delay: var(--d, 0s); }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
.card:hover { transform: translateY(-8px); box-shadow: var(--shadow-lg); border-color: var(--border); }
.card:focus-visible { outline: 3px solid var(--brand); outline-offset: 3px; }
.card--featured { grid-column: span 2; grid-row: span 2; }
@media (max-width: 768px) { .card--featured { grid-column: span 1; grid-row: span 1; } }
.card__thumb { position: relative; aspect-ratio: 16/10; overflow: hidden; background: linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%); }
.card__img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s ease; }
.card__img--hover { position: absolute; inset: 0; opacity: 0; transition: opacity 0.4s ease; }
.card:hover .card__img--main { transform: scale(1.1); }
.card:hover .card__img--hover { opacity: 1; transform: scale(1.1); }
.card__film,.card__scrim { position: absolute; inset: 0; pointer-events: none; }
.card__scrim { background: linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%); opacity: 0; transition: opacity 0.3s; }
.card:hover .card__scrim { opacity: 1; }
.card__badges { position: absolute; top: 12px; left: 12px; right: 12px; display: flex; justify-content: space-between; z-index: 3; }
.pub[dir="rtl"] .card__badges { flex-direction: row-reverse; }
.card__typebadge,.card__mediabadge { background: rgba(255,255,255,0.95); color: var(--brand-dark); padding: 6px 12px; border-radius: 999px; font-size: 12px; font-weight: 700; backdrop-filter: blur(10px); box-shadow: 0 2px 8px rgba(0,0,0,0.1); border: 1px solid rgba(255,255,255,0.3); }
.card__mediabadge { background: var(--accent); color: var(--brand-dark); }
.card__countbadge { position: absolute; bottom: 12px; right: 12px; background: rgba(0,0,0,0.7); color: white; padding: 6px 12px; border-radius: 999px; font-size: 12px; font-weight: 600; backdrop-filter: blur(4px); }
.pub[dir="rtl"] .card__countbadge { right: auto; left: 12px; }
.card__memorybadge { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%) scale(0); width: 50px; height: 50px; background: var(--accent); border-radius: 50%; display: grid; place-items: center; font-size: 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.3); transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1); z-index: 4; }
.card:hover .card__memorybadge { transform: translate(-50%,-50%) scale(1); }
.card__view { position: absolute; inset: 0; display: grid; place-items: center; opacity: 0; transition: opacity 0.3s; z-index: 5; }
.card:hover .card__view { opacity: 1; }
.card__viewbtn { background: var(--brand); color: white; padding: 14px 28px; border-radius: 999px; font-weight: 700; font-size: 14px; display: flex; align-items: center; gap: 8px; transform: translateY(10px); transition: transform 0.3s, background 0.3s; box-shadow: var(--shadow); }
.card:hover .card__viewbtn { transform: translateY(0); }
.card__accent { position: absolute; bottom: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, var(--brand), var(--accent)); transform: scaleX(0); transition: transform 0.4s ease; }
.card:hover .card__accent { transform: scaleX(1); }
.card__body { padding: 20px; }
.card__meta { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; font-size: 13px; color: var(--text-muted); flex-wrap: wrap; }
.card__date { font-weight: 600; }
.card__lang { background: var(--bg); padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; border: 1px solid var(--border-light); }
.card__title { font-family: var(--font-serif); font-size: 20px; font-weight: 700; line-height: 1.3; margin: 0 0 10px; color: var(--text); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.card__desc { font-size: 15px; color: var(--text-muted); line-height: 1.6; margin: 0 0 16px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.card__extra { margin-bottom: 12px; }
.card__extra-val { font-size: 13px; color: var(--brand); font-weight: 600; }
.card__tags { display: flex; flex-wrap: wrap; gap: 8px; }
.ctag { font-size: 12px; color: var(--text-muted); background: var(--bg); padding: 6px 12px; border-radius: 999px; border: 1px solid var(--border-light); transition: all 0.2s; }
.ctag--clickable { cursor: pointer; }
.ctag--clickable:hover { background: var(--brand); color: white; border-color: var(--brand); }
.ctag--more { background: var(--accent); color: var(--brand-dark); font-weight: 700; }
.card__foot { padding: 16px 20px; border-top: 1px solid var(--border-light); display: flex; justify-content: space-between; align-items: center; }
.card__cta { font-size: 14px; font-weight: 700; color: var(--brand); text-transform: uppercase; letter-spacing: 0.05em; }
.card__arrow { color: var(--brand); transition: transform 0.3s; }
.card:hover .card__arrow { transform: translateX(4px); }
.pub[dir="rtl"] .card:hover .card__arrow { transform: translateX(-4px); }

/* ─── DETAIL ───────────────────────────────────────────────────── */
.detail { min-height: 100vh; background: var(--bg); }
.dnav { background: rgba(255,255,255,0.95); border-bottom: 1px solid var(--border); padding: 16px 0; position: sticky; top: 0; z-index: 100; backdrop-filter: blur(10px); }
.dnav__inner { display: flex; justify-content: space-between; align-items: center; }
.back-btn { display: flex; align-items: center; gap: 10px; padding: 10px 20px; border: 1px solid var(--border); border-radius: 999px; background: transparent; cursor: pointer; font-size: 15px; font-weight: 600; color: var(--text); transition: all 0.2s; }
.back-btn:hover { background: var(--brand); color: white; border-color: var(--brand); transform: translateX(-4px); }
.pub[dir="rtl"] .back-btn:hover { transform: translateX(4px); }
.dnav__right { display: flex; align-items: center; gap: 16px; }
.dtype-pill { background: var(--brand); color: white; padding: 8px 16px; border-radius: 999px; font-size: 13px; font-weight: 700; }
.langpills { display: flex; gap: 8px; }
.langpill { display: flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 999px; font-size: 13px; font-weight: 600; background: var(--bg); border: 1px solid var(--border); color: var(--text-muted); }
.langpill--on { background: var(--accent); color: var(--brand-dark); border-color: var(--accent); }
.langpill__dot { width: 8px; height: 8px; border-radius: 50%; background: currentColor; }

.dhero { position: relative; min-height: 60vh; display: grid; place-items: center; overflow: hidden; background: linear-gradient(135deg, var(--brand-dark) 0%, var(--brand) 100%); }
.dhero__bg { position: absolute; inset: 0; background-size: cover; background-position: center; opacity: 0.3; filter: blur(10px); transform: scale(1.1); }
.dhero__gradient { position: absolute; inset: 0; background: linear-gradient(to right, var(--brand-dark) 0%, transparent 50%, var(--brand-dark) 100%); opacity: 0.9; }
.dhero__gradient--side { background: linear-gradient(to top, var(--brand-dark) 0%, transparent 60%); }
.dhero__grain,.dhero__scanlines { position: absolute; inset: 0; pointer-events: none; opacity: 0.05; }
.dhero__scanlines { background: linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.1) 50%); background-size: 100% 4px; }
.dhero__frame { position: absolute; width: 80px; height: 80px; border: 2px solid var(--accent); opacity: 0.3; }
.dhero__frame--tl { top: 40px; left: 40px; border-right: 0; border-bottom: 0; }
.dhero__frame--br { bottom: 40px; right: 40px; border-left: 0; border-top: 0; }
.dhero__gold-line { position: absolute; height: 1px; background: linear-gradient(90deg, transparent, var(--accent), transparent); left: 20%; right: 20%; opacity: 0.4; }
.dhero__gold-line--top { top: 40px; }
.dhero__gold-line--bottom { bottom: 40px; }
.dhero__content { position: relative; z-index: 10; display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 60px; align-items: center; padding: 80px 24px; color: white; }
@media (max-width: 968px) { .dhero__content { grid-template-columns: 1fr; text-align: center; } }
.dhero__badges { display: flex; gap: 12px; margin-bottom: 24px; flex-wrap: wrap; }
.dbadge { background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.2); padding: 8px 16px; border-radius: 999px; font-size: 13px; font-weight: 600; backdrop-filter: blur(10px); }
.dbadge--type { background: var(--accent); color: var(--brand-dark); border-color: var(--accent); }
.dbadge--mem { background: rgba(201,162,39,0.2); border-color: var(--accent); color: var(--accent); }
.dbadge--topic { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.25); }
.dhero__title { font-family: var(--font-display); font-size: clamp(32px, 5vw, 56px); font-weight: 700; line-height: 1.2; margin: 0 0 20px; text-shadow: 0 4px 20px rgba(0,0,0,0.3); }
.dhero__desc { font-size: 18px; line-height: 1.7; opacity: 0.9; margin-bottom: 32px; max-width: 600px; }
.dhero__stats { display: flex; gap: 24px; flex-wrap: wrap; }
.dstat { display: flex; align-items: center; gap: 10px; background: rgba(255,255,255,0.1); padding: 12px 20px; border-radius: var(--radius); border: 1px solid rgba(255,255,255,0.15); backdrop-filter: blur(10px); }
.dstat__ico { font-size: 20px; }
.dstat__val { font-weight: 700; font-size: 16px; }
.dstat__lbl { font-size: 13px; opacity: 0.8; text-transform: uppercase; letter-spacing: 0.05em; }
.dhero__tags { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 24px; }
.dtag { background: transparent; border: 1px solid rgba(255,255,255,0.25); color: rgba(255,255,255,0.85); padding: 6px 14px; border-radius: 999px; font-size: 13px; font-weight: 600; transition: all 0.2s; }
.dtag--clickable { cursor: pointer; }
.dtag--clickable:hover { background: var(--accent); color: var(--brand-dark); border-color: var(--accent); transform: translateY(-2px); }

/* ─── MOCKUPS ──────────────────────────────────────────────────── */
.dhero__right { display: flex; align-items: center; justify-content: center; }

/* Sound / CD mockup */
.mockup-sound { position: relative; width: 220px; height: 220px; }
.msound__case { position: absolute; left: 0; top: 0; width: 160px; height: 160px; z-index: 2; }
.msound__spine { position: absolute; left: 0; top: 0; bottom: 0; width: 18px; background: linear-gradient(to right, #1a1a1a, #3a3a3a); border-radius: 4px 0 0 4px; }
.msound__front { position: absolute; left: 18px; top: 0; right: 0; bottom: 0; border-radius: 0 4px 4px 0; overflow: hidden; box-shadow: var(--shadow-lg); }
.msound__front img { width: 100%; height: 100%; object-fit: cover; }
.msound__overlay { position: absolute; inset: 0; background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 60%); }
.msound__disc { position: absolute; right: 0; bottom: 0; width: 130px; height: 130px; z-index: 3; animation: spinDisc 8s linear infinite; }
.msound__disc-ring { position: absolute; inset: 0; border-radius: 50%; background: linear-gradient(135deg, #222 0%, #444 50%, #222 100%); box-shadow: 0 8px 30px rgba(0,0,0,0.5); }
.msound__disc-art { position: absolute; inset: 14px; border-radius: 50%; overflow: hidden; }
.msound__disc-art img { width: 100%; height: 100%; object-fit: cover; }
.msound__disc-hole { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); width: 20px; height: 20px; border-radius: 50%; background: #111; box-shadow: inset 0 0 4px rgba(0,0,0,0.8); z-index: 4; }
@keyframes spinDisc { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

/* Book mockup */
.mockup-book { position: relative; width: 180px; height: 240px; transform: perspective(800px) rotateY(-12deg); transition: transform 0.4s ease; }
.mockup-book:hover { transform: perspective(800px) rotateY(-4deg); }
.mbook__spine { position: absolute; left: 0; top: 0; bottom: 0; width: 24px; background: linear-gradient(to right, var(--brand-dark), var(--brand)); border-radius: 4px 0 0 4px; }
.mbook__cover { position: absolute; left: 24px; top: 0; right: 0; bottom: 0; border-radius: 0 6px 6px 0; overflow: hidden; box-shadow: var(--shadow-lg); }
.mbook__cover img { width: 100%; height: 100%; object-fit: cover; }
.mbook__sheen { position: absolute; inset: 0; background: linear-gradient(135deg, rgba(255,255,255,0.18) 0%, transparent 55%); pointer-events: none; }
.mbook__pages { position: absolute; right: -6px; top: 4px; bottom: 4px; width: 10px; background: repeating-linear-gradient(to bottom, #f0f0ee 0px, #e8e8e5 2px, #f0f0ee 3px); border-radius: 0 3px 3px 0; box-shadow: 3px 0 6px rgba(0,0,0,0.15); }

/* Video mockup */
.mockup-video { display: flex; flex-direction: column; align-items: center; gap: 0; }
.mvideo__frame { width: 260px; background: #111; border-radius: 10px 10px 4px 4px; overflow: hidden; position: relative; border: 6px solid #222; box-shadow: var(--shadow-lg); }
.mvideo__frame img { width: 100%; aspect-ratio: 16/9; object-fit: cover; display: block; }
.mvideo__play-ico { position: absolute; inset: 0; display: grid; place-items: center; background: rgba(0,0,0,0.3); color: white; font-size: 40px; opacity: 0; transition: opacity 0.3s; }
.mockup-video:hover .mvideo__play-ico { opacity: 1; }
.mvideo__stand { width: 60px; height: 8px; background: #333; border-radius: 0 0 4px 4px; margin: 0 auto; }

/* Image mockup */
.mockup-image { display: flex; align-items: center; justify-content: center; }
.mimage__frame { background: white; padding: 16px 16px 40px; box-shadow: var(--shadow-lg); border-radius: 2px; transform: rotate(-2deg); transition: transform 0.4s ease; }
.mimage__frame:hover { transform: rotate(0deg); }
.mimage__mat { width: 200px; height: 200px; background: #f8f8f8; border: 1px solid #eee; display: flex; align-items: center; justify-content: center; overflow: hidden; }
.mimage__photo { position: absolute; }
.mimage__mat img { width: 100%; height: 100%; object-fit: cover; display: block; }

/* lang-swap transition */
.lang-swap-enter-active,.lang-swap-leave-active { transition: opacity 0.25s ease, transform 0.25s ease; }
.lang-swap-enter-from { opacity: 0; transform: translateY(10px); }
.lang-swap-leave-to { opacity: 0; transform: translateY(-10px); }

/* ─── STREAM / AUDIO ───────────────────────────────────────────── */
.stream-section { padding: 60px 0; background: var(--surface); border-bottom: 1px solid var(--border-light); }
.stream-layout { display: grid; grid-template-columns: 1fr 300px; gap: 40px; align-items: start; }
@media (max-width: 1024px) { .stream-layout { grid-template-columns: 1fr; } }
.stream-main { display: flex; flex-direction: column; gap: 24px; }
.stream-head { display: flex; justify-content: space-between; align-items: center; }
.section-heading { font-family: var(--font-serif); font-size: 24px; font-weight: 700; color: var(--text); margin: 0; position: relative; }
.section-heading::after { content: ''; position: absolute; bottom: -6px; left: 0; width: 40px; height: 3px; background: linear-gradient(90deg, var(--brand), var(--accent)); border-radius: 2px; }
.pub[dir="rtl"] .section-heading::after { left: auto; right: 0; }
.stream-count { font-size: 13px; font-weight: 600; color: var(--text-muted); background: var(--bg); padding: 6px 16px; border-radius: 999px; border: 1px solid var(--border-light); }

/* Track list */
.track-list { display: flex; flex-direction: column; gap: 4px; }
.track { display: grid; grid-template-columns: 36px 48px 24px 1fr 1fr 80px; gap: 14px; align-items: center; padding: 14px 16px; border-radius: var(--radius); border: 1px solid transparent; cursor: pointer; transition: all 0.2s ease; position: relative; }
.track:hover { background: var(--bg); border-color: var(--border-light); }
.track--selected { background: var(--bg); border-color: var(--border); }
.track--playing { background: rgba(140,21,21,0.05); border-color: var(--brand-light); }
.track--playing::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 3px; background: linear-gradient(to bottom, var(--brand), var(--accent)); border-radius: 0 2px 2px 0; }
.pub[dir="rtl"] .track--playing::before { left: auto; right: 0; border-radius: 2px 0 0 2px; }
.track__num { font-size: 12px; font-weight: 700; color: var(--text-muted); text-align: center; font-family: monospace; }
.track__cover { width: 48px; height: 48px; border-radius: var(--radius-sm); overflow: hidden; position: relative; flex-shrink: 0; background: var(--bg); }
.track__cover img { width: 100%; height: 100%; object-fit: cover; }
.track__play-ico { position: absolute; inset: 0; background: rgba(0,0,0,0.55); color: white; display: grid; place-items: center; font-size: 16px; opacity: 0; transition: opacity 0.2s; }
.track:hover .track__play-ico,.track--selected .track__play-ico { opacity: 1; }
.track__indicator { display: flex; gap: 2px; align-items: flex-end; height: 20px; }
.track__bar { display: block; width: 3px; background: var(--border); border-radius: 2px; height: 40%; transition: height 0.1s; }
.track__bar--live { background: var(--brand); animation: barBounce calc(0.4s + var(--b, 1) * 0.1s) ease-in-out infinite alternate; }
@keyframes barBounce { 0% { height: 20%; } 100% { height: 100%; } }
.track__info { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
.track__title { font-weight: 600; font-size: 15px; color: var(--text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.track__sub-row,.track__extra-row { display: flex; gap: 6px; flex-wrap: wrap; }
.track__chip { background: var(--bg); border: 1px solid var(--border-light); padding: 3px 8px; border-radius: 999px; font-size: 11px; color: var(--text-muted); font-weight: 500; }
.track__extra-item { font-size: 12px; color: var(--text-muted); }
.track__waves { cursor: pointer; display: flex; flex-direction: column; gap: 6px; }
.wave-wrap { display: flex; gap: 2px; align-items: center; height: 40px; }
.wave-wrap--live .wbar--live { animation: wbarPulse 0.5s ease-in-out infinite alternate; }
.wbar { display: block; width: 3px; border-radius: 2px; background: var(--border); flex-shrink: 0; transition: height 0.1s, background 0.2s; height: calc(var(--h, 0.5) * 38px); }
.wbar--played { background: var(--brand); opacity: 0.7; }
.wbar--current { background: var(--accent); box-shadow: 0 0 6px var(--accent); }
.wbar--live { background: var(--brand); opacity: 0.4; }
@keyframes wbarPulse { 0% { opacity: 0.3; } 100% { opacity: 0.9; } }
.wave-time { font-size: 11px; color: var(--text-muted); font-weight: 600; font-family: monospace; }
.track__right { display: flex; flex-direction: column; gap: 4px; align-items: flex-end; }
.track__dur { font-size: 13px; font-weight: 600; color: var(--text-muted); font-family: monospace; }
.track__size { font-size: 11px; color: var(--text-muted); }

/* Brochures */
.track-brochures { padding: 20px; background: var(--bg); border-radius: var(--radius); border: 1px solid var(--border-light); }
.track-brochures__title { font-size: 15px; font-weight: 700; color: var(--text); margin: 0 0 16px; }
.track-brochures__grid { display: flex; gap: 12px; flex-wrap: wrap; }
.brochure-thumb { position: relative; width: 80px; height: 80px; border-radius: var(--radius-sm); overflow: hidden; cursor: zoom-in; border: 1px solid var(--border-light); transition: transform 0.2s; }
.brochure-thumb:hover { transform: scale(1.05); }
.brochure-thumb img { width: 100%; height: 100%; object-fit: cover; }
.brochure-thumb__cap { position: absolute; bottom: 0; left: 0; right: 0; background: rgba(0,0,0,0.65); color: white; font-size: 9px; padding: 4px; text-align: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

/* Audio bar */
.audio-bar { position: sticky; bottom: 20px; display: grid; grid-template-columns: 56px 1fr auto auto; gap: 16px; align-items: center; background: white; border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 14px 20px; box-shadow: var(--shadow-lg); z-index: 50; transition: transform 0.3s ease; }
.audio-bar:hover { transform: translateY(-2px); box-shadow: 0 24px 60px rgba(0,0,0,0.15); }
.audio-bar__cover { position: relative; width: 56px; height: 56px; border-radius: var(--radius-sm); overflow: hidden; flex-shrink: 0; }
.audio-bar__cover img { width: 100%; height: 100%; object-fit: cover; display: block; }
.audio-bar__vinyl { position: absolute; inset: 0; border-radius: 50%; background: radial-gradient(circle, rgba(0,0,0,0.5) 0%, transparent 60%); opacity: 0; transition: opacity 0.3s; }
.audio-bar__vinyl--spin { opacity: 1; animation: spinDisc 3s linear infinite; }
.audio-bar__info { min-width: 0; }
.audio-bar__title { font-weight: 700; font-size: 14px; color: var(--text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.audio-bar__album { font-size: 12px; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.audio-bar__controls { display: flex; align-items: center; gap: 8px; }
.abtn { background: transparent; border: 1px solid var(--border-light); border-radius: 999px; width: 40px; height: 40px; display: grid; place-items: center; cursor: pointer; font-size: 16px; color: var(--text-muted); transition: all 0.2s; padding: 0; }
.abtn:hover:not(:disabled) { background: var(--brand); color: white; border-color: var(--brand); transform: scale(1.1); }
.abtn:disabled { opacity: 0.3; cursor: not-allowed; }
.abtn--play { background: var(--brand); color: white; border-color: var(--brand); width: 48px; height: 48px; font-size: 20px; }
.abtn--play:hover { background: var(--brand-dark); transform: scale(1.1); }
.audio-bar__time-only { display: flex; align-items: center; gap: 4px; font-family: monospace; font-size: 13px; white-space: nowrap; flex-shrink: 0; }
.atime__cur { font-weight: 700; color: var(--brand); }
.atime__sep { color: var(--border); }
.atime__dur { color: var(--text-muted); }

/* ─── SIDE PANEL ───────────────────────────────────────────────── */
.stream-side { position: sticky; top: 80px; }
.side-featured { background: var(--bg); border: 1px solid var(--border-light); border-radius: var(--radius); overflow: hidden; }
.side-heading { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; color: var(--text-muted); padding: 20px 20px 12px; margin: 0; }
.side-cover { position: relative; aspect-ratio: 1; overflow: hidden; }
.side-cover img { width: 100%; height: 100%; object-fit: cover; display: block; }
.side-cover__overlay { position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 60%); padding: 20px 16px 16px; }
.side-cover__title { color: white; font-weight: 700; font-size: 15px; line-height: 1.3; }
.side-meta { padding: 16px 20px; display: flex; flex-direction: column; gap: 10px; }
.side-meta__row { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; }
.side-meta__key { font-size: 12px; color: var(--text-muted); font-weight: 600; flex-shrink: 0; text-transform: uppercase; letter-spacing: 0.05em; }
.side-meta__val { font-size: 13px; font-weight: 600; color: var(--text); text-align: end; }
.sfm-value--badge { background: var(--brand); color: white; padding: 3px 10px; border-radius: 999px; font-size: 11px; font-weight: 700; letter-spacing: 0.05em; }
.side-covers-row { display: flex; gap: 8px; padding: 12px 20px 20px; }
.cover-slot { flex: 1; position: relative; cursor: zoom-in; border-radius: var(--radius-sm); overflow: hidden; border: 1px solid var(--border-light); transition: transform 0.2s; }
.cover-slot:hover { transform: scale(1.04); }
.cover-slot img { width: 100%; aspect-ratio: 1; object-fit: cover; display: block; }
.cover-slot__lbl { position: absolute; bottom: 0; left: 0; right: 0; background: rgba(0,0,0,0.65); color: white; font-size: 9px; font-weight: 700; text-align: center; padding: 4px; letter-spacing: 0.05em; }

/* ─── SOUND FULL METADATA ──────────────────────────────────────── */
.sound-full-meta { padding: 60px 0; background: var(--bg); }
.sfm-block { margin-bottom: 40px; padding: 28px; background: var(--surface); border: 1px solid var(--border-light); border-radius: var(--radius); }
.sfm-block--timestamps { background: transparent; border-color: transparent; padding: 8px 0; }
.sfm-block__title { font-family: var(--font-serif); font-size: 20px; font-weight: 700; color: var(--text); margin: 0 0 20px; padding-bottom: 14px; border-bottom: 1px solid var(--border-light); position: relative; }
.sfm-block__title::after { content: ''; position: absolute; bottom: -1px; left: 0; width: 40px; height: 2px; background: linear-gradient(90deg, var(--brand), var(--accent)); }
.pub[dir="rtl"] .sfm-block__title::after { left: auto; right: 0; }
.sfm-count { font-size: 13px; color: var(--text-muted); font-weight: 400; font-family: var(--font-sans); margin-inline-start: 8px; }
.sfm-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; }
.sfm-item { display: flex; flex-direction: column; gap: 6px; }
.sfm-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-muted); }
.sfm-value { font-size: 15px; font-weight: 600; color: var(--text); }
.sfm-value--yes { color: #16a34a; }
.sfm-bilingual { display: grid; grid-template-columns: 1fr 1fr; gap: 28px; }
@media (max-width: 768px) { .sfm-bilingual { grid-template-columns: 1fr; } }
.sfm-lang-col { display: flex; flex-direction: column; gap: 16px; }
.sfm-lang-badge { display: inline-flex; padding: 6px 14px; border-radius: 999px; font-size: 12px; font-weight: 700; letter-spacing: 0.05em; }
.sfm-lang-badge--ckb { background: rgba(140,21,21,0.08); color: var(--brand); border: 1px solid rgba(140,21,21,0.2); }
.sfm-lang-badge--kmr { background: rgba(201,168,76,0.12); color: #92700d; border: 1px solid rgba(201,168,76,0.3); }
.sfm-desc { font-size: 15px; line-height: 1.8; color: var(--text-muted); margin: 0; }
.sfm-chips { display: flex; flex-wrap: wrap; gap: 10px; }
.sfm-chip { padding: 8px 18px; border-radius: 999px; font-size: 13px; font-weight: 600; background: var(--bg); border: 1px solid var(--border-light); color: var(--text); }
.sfm-chip--loc { color: var(--brand); border-color: rgba(140,21,21,0.2); background: rgba(140,21,21,0.04); }
.sfm-chip--topic { color: #7c3aed; background: rgba(124,58,237,0.07); border-color: rgba(124,58,237,0.2); }
.sfm-chip--tag { cursor: pointer; transition: all 0.2s; }
.sfm-chip--tag:hover { background: var(--brand); color: white; border-color: var(--brand); transform: translateY(-2px); }
.sfm-chip--kw { background: rgba(201,168,76,0.1); color: #92700d; border-color: rgba(201,168,76,0.3); }
.sfm-bilingual-tags { display: flex; flex-direction: column; gap: 20px; }
.sfm-attachments { display: flex; flex-direction: column; gap: 10px; }
.sfm-attachment { display: flex; align-items: center; gap: 14px; padding: 16px 20px; background: var(--bg); border: 1px solid var(--border-light); border-radius: var(--radius); text-decoration: none; color: var(--text); transition: all 0.2s; }
.sfm-attachment:hover { border-color: var(--brand); background: rgba(140,21,21,0.03); transform: translateX(4px); }
.pub[dir="rtl"] .sfm-attachment:hover { transform: translateX(-4px); }
.sfm-attachment__type { background: var(--brand); color: white; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 700; letter-spacing: 0.06em; flex-shrink: 0; }
.sfm-attachment__title { flex: 1; font-weight: 600; font-size: 14px; }
.sfm-attachment__meta { display: flex; gap: 10px; font-size: 12px; color: var(--text-muted); }
.sfm-attachment__arrow { color: var(--brand); font-size: 18px; font-weight: 700; transition: transform 0.2s; }
.sfm-attachment:hover .sfm-attachment__arrow { transform: translate(4px, -4px); }
.sfm-ts { display: inline-flex; align-items: center; gap: 10px; font-size: 13px; color: var(--text-muted); margin-inline-end: 24px; }
.sfm-ts__label { font-weight: 700; }
.sfm-ts__val { font-weight: 400; }

/* ─── VIDEO SECTION ────────────────────────────────────────────── */
.video-section { padding: 60px 0; }
.video-stage { display: flex; flex-direction: column; gap: 16px; margin-bottom: 40px; }
.vplayer-wrap { border-radius: var(--radius); overflow: hidden; background: #000; box-shadow: var(--shadow-lg); }
.vplayer-el { width: 100%; aspect-ratio: 16/9; display: block; }
.vembed-wrap { border-radius: var(--radius); overflow: hidden; box-shadow: var(--shadow-lg); aspect-ratio: 16/9; }
.vembed { width: 100%; height: 100%; border: none; display: block; }
.vno-source { aspect-ratio: 16/9; background: var(--bg); border: 1px solid var(--border-light); border-radius: var(--radius); display: flex; flex-direction: column; gap: 12px; align-items: center; justify-content: center; }
.vno-source__icon { font-size: 48px; opacity: 0.4; }
.vno-source__text { font-size: 15px; color: var(--text-muted); font-weight: 600; }
.vfilm-info { display: flex; justify-content: center; }
.vfilm-chips { display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; }
.vchip { background: var(--surface); border: 1px solid var(--border-light); padding: 8px 16px; border-radius: 999px; font-size: 13px; font-weight: 600; color: var(--text); }
.clips-layout { display: grid; grid-template-columns: 1fr 320px; gap: 32px; margin-bottom: 40px; }
@media (max-width: 1024px) { .clips-layout { grid-template-columns: 1fr; } }
.clips-player { display: flex; flex-direction: column; gap: 20px; }
.clip-meta-full { padding: 20px; background: var(--bg); border: 1px solid var(--border-light); border-radius: var(--radius); display: flex; flex-direction: column; gap: 16px; }
.clip-meta-full__chips { display: flex; flex-wrap: wrap; gap: 10px; }
.clip-desc p { font-size: 15px; line-height: 1.7; color: var(--text-muted); margin: 0; }
.clip-titles { display: flex; flex-direction: column; gap: 12px; }
.clip-title-row { display: flex; align-items: center; gap: 12px; font-size: 15px; font-weight: 600; }
.clips-list { display: flex; flex-direction: column; gap: 4px; }
.clips-list__heading { font-size: 16px; font-weight: 700; color: var(--text); margin: 0 0 16px; }
.clip-item { display: flex; align-items: center; gap: 14px; padding: 14px 16px; border-radius: var(--radius); border: 1px solid transparent; cursor: pointer; transition: all 0.2s; }
.clip-item:hover { background: var(--bg); border-color: var(--border-light); }
.clip-item--on { background: rgba(140,21,21,0.05); border-color: var(--brand-light); }
.clip-item__num { width: 28px; height: 28px; background: var(--bg); border: 1px solid var(--border); border-radius: 50%; display: grid; place-items: center; font-size: 12px; font-weight: 700; color: var(--text-muted); flex-shrink: 0; }
.clip-item--on .clip-item__num { background: var(--brand); border-color: var(--brand); color: white; }
.clip-item__info { flex: 1; min-width: 0; }
.clip-item__title { font-weight: 600; font-size: 14px; color: var(--text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.clip-item__meta { display: flex; gap: 10px; font-size: 12px; color: var(--text-muted); margin-top: 4px; flex-wrap: wrap; }
.clip-item__play { color: var(--brand); opacity: 0; transition: opacity 0.2s; flex-shrink: 0; }
.clip-item:hover .clip-item__play,.clip-item--on .clip-item__play { opacity: 1; }
.video-full-meta { padding: 0; }
.content-detail-block { display: flex; flex-direction: column; gap: 10px; }
.cdb-row { display: grid; grid-template-columns: 100px 1fr; gap: 12px; }
.cdb-key { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-muted); padding-top: 2px; }
.cdb-val { font-size: 14px; color: var(--text); line-height: 1.6; }

/* ─── GALLERY / IMAGE ──────────────────────────────────────────── */
.gallery-section { padding: 60px 0; }
.gallery-layout { display: grid; grid-template-columns: 1fr auto; gap: 24px; align-items: start; margin-bottom: 40px; }
@media (max-width: 900px) { .gallery-layout { grid-template-columns: 1fr; } }
.gallery-main { display: flex; flex-direction: column; gap: 20px; }
.gallery-preview { position: relative; border-radius: var(--radius); overflow: hidden; background: var(--bg); border: 1px solid var(--border-light); cursor: zoom-in; }
.gallery-preview__img { width: 100%; max-height: 520px; object-fit: contain; display: block; }
.gallery-zoom-hint { position: absolute; bottom: 12px; left: 50%; transform: translateX(-50%); background: rgba(0,0,0,0.55); color: white; padding: 6px 14px; border-radius: 999px; font-size: 12px; font-weight: 600; display: flex; align-items: center; gap: 6px; backdrop-filter: blur(8px); opacity: 0; transition: opacity 0.3s; pointer-events: none; white-space: nowrap; }
.gallery-preview:hover .gallery-zoom-hint { opacity: 1; }
.gallery-img-meta { position: absolute; top: 12px; right: 12px; display: flex; gap: 6px; flex-wrap: wrap; }
.pub[dir="rtl"] .gallery-img-meta { right: auto; left: 12px; }
.gallery-img-meta span { background: rgba(0,0,0,0.6); color: white; padding: 4px 10px; border-radius: 999px; font-size: 11px; font-weight: 600; font-family: monospace; backdrop-filter: blur(8px); }
.gallery-caption { padding: 20px; background: var(--surface); border: 1px solid var(--border-light); border-radius: var(--radius); display: flex; flex-direction: column; gap: 16px; }
.gallery-caption__title { font-family: var(--font-serif); font-size: 22px; font-weight: 700; color: var(--text); line-height: 1.3; }
.gallery-caption__desc { font-size: 15px; color: var(--text-muted); line-height: 1.7; }
.gallery-caption__bilingual { display: flex; flex-direction: column; gap: 10px; border-top: 1px solid var(--border-light); padding-top: 16px; }
.gcap-row { display: flex; align-items: flex-start; gap: 12px; font-size: 14px; line-height: 1.6; }
.gallery-img-tech { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 12px; border-top: 1px solid var(--border-light); padding-top: 16px; }
.git-row { display: flex; flex-direction: column; gap: 4px; }
.git-key { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-muted); }
.git-val { font-size: 14px; font-weight: 600; color: var(--text); }
.gallery-strip { display: flex; flex-direction: column; gap: 8px; width: 90px; max-height: 600px; overflow-y: auto; padding: 4px; scrollbar-width: thin; }
.gthumb { width: 80px; height: 80px; border-radius: var(--radius-sm); overflow: hidden; border: 2px solid transparent; padding: 0; cursor: pointer; transition: all 0.2s; flex-shrink: 0; position: relative; background: var(--bg); }
.gthumb:hover { border-color: var(--brand); transform: scale(1.04); }
.gthumb--on { border-color: var(--brand); box-shadow: 0 0 0 3px rgba(140,21,21,0.15); }
.gthumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
.gthumb__meta { position: absolute; bottom: 0; left: 0; right: 0; background: rgba(0,0,0,0.65); color: white; font-size: 8px; text-align: center; padding: 2px; font-family: monospace; }
.gallery-nav { display: flex; align-items: center; justify-content: center; gap: 20px; padding: 16px 0; }
.gnav-btn { background: var(--surface); border: 1px solid var(--border); padding: 10px 24px; border-radius: 999px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; color: var(--text); }
.gnav-btn:hover:not(:disabled) { background: var(--brand); color: white; border-color: var(--brand); }
.gnav-btn:disabled { opacity: 0.35; cursor: not-allowed; }
.gnav-pos { font-size: 14px; font-weight: 700; color: var(--text-muted); font-family: monospace; }
.gallery-single { width: 100%; max-width: 600px; border-radius: var(--radius); display: block; margin: 0 auto; }
.gallery-empty { text-align: center; padding: 40px 0; }
.image-full-meta { display: flex; flex-direction: column; gap: 0; }
.cover-slots-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 16px; }
.cover-slot-full { border-radius: var(--radius); overflow: hidden; border: 1px solid var(--border-light); cursor: zoom-in; transition: all 0.2s; position: relative; }
.cover-slot-full:hover { transform: translateY(-4px); box-shadow: var(--shadow); }
.cover-slot-full img { width: 100%; aspect-ratio: 3/4; object-fit: cover; display: block; }
.cover-slot-full__lbl { position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%); color: white; font-size: 12px; font-weight: 700; text-align: center; padding: 20px 8px 8px; }

/* ─── WRITING SECTION ──────────────────────────────────────────── */
.writing-section { padding: 60px 0; }
.writing-layout { display: flex; flex-direction: column; gap: 40px; }
.writing-genres { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
.wg-label { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-muted); }
.wg-chips { display: flex; gap: 8px; flex-wrap: wrap; }
.wg-chip { background: var(--brand); color: white; padding: 8px 20px; border-radius: 999px; font-size: 13px; font-weight: 700; }
.writing-bilingual-content { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; }
@media (max-width: 900px) { .writing-bilingual-content { grid-template-columns: 1fr; } }
.wbc-col { display: flex; flex-direction: column; gap: 16px; padding: 24px; background: var(--surface); border: 1px solid var(--border-light); border-radius: var(--radius); }
.wbc-header { display: flex; align-items: center; gap: 12px; margin-bottom: 4px; }
.winfo-card { display: flex; align-items: flex-start; gap: 14px; padding: 14px; background: var(--bg); border-radius: var(--radius-sm); border: 1px solid var(--border-light); transition: border-color 0.2s; }
.winfo-card:hover { border-color: var(--brand-light); }
.winfo-card__ico { font-size: 22px; flex-shrink: 0; width: 32px; text-align: center; }
.winfo-card__content { flex: 1; min-width: 0; }
.winfo-card__lbl { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-muted); margin-bottom: 4px; }
.winfo-card__val { font-size: 15px; font-weight: 600; color: var(--text); }
.wdesc p { font-size: 15px; line-height: 1.8; color: var(--text-muted); margin: 0; }
.wdownload-btn { display: inline-flex; align-items: center; gap: 10px; background: var(--brand); color: white; padding: 14px 24px; border-radius: var(--radius); font-size: 14px; font-weight: 700; text-decoration: none; transition: all 0.2s; margin-top: 8px; }
.wdownload-btn:hover { background: var(--brand-dark); transform: translateY(-2px); box-shadow: var(--shadow); }
.writing-info-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px; }
.series-block { display: flex; align-items: center; gap: 20px; padding: 24px; background: linear-gradient(135deg, rgba(140,21,21,0.04) 0%, rgba(201,168,76,0.06) 100%); border: 1px solid rgba(140,21,21,0.15); border-radius: var(--radius); }
.series-block__ico { font-size: 40px; flex-shrink: 0; }
.series-block__lbl { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-muted); margin-bottom: 6px; }
.series-block__name { font-family: var(--font-serif); font-size: 22px; font-weight: 700; color: var(--brand); margin-bottom: 8px; }
.series-block__meta { display: flex; align-items: center; gap: 12px; font-size: 13px; color: var(--text-muted); font-weight: 600; flex-wrap: wrap; }
.series-parent-badge { background: var(--accent); color: var(--brand-dark); padding: 4px 12px; border-radius: 999px; font-size: 12px; font-weight: 700; }

/* ─── TAG SEARCH PAGE ──────────────────────────────────────────── */
.tag-search-page { min-height: 100vh; background: var(--bg); }
.ts-hero { background: linear-gradient(135deg, var(--brand-dark) 0%, var(--brand) 100%); padding: 48px 0; position: relative; overflow: hidden; }
.ts-hero::before { content: ''; position: absolute; inset: 0; background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"); }
.ts-back { border-color: rgba(255,255,255,0.3); color: white; }
.ts-back:hover { background: rgba(255,255,255,0.15); border-color: white; color: white; }
.ts-title { display: flex; align-items: baseline; gap: 4px; margin: 20px 0 12px; }
.ts-hash { font-family: var(--font-serif); font-size: 48px; font-weight: 700; color: var(--accent); opacity: 0.8; }
.ts-query { font-family: var(--font-serif); font-size: 48px; font-weight: 700; color: white; word-break: break-all; }
.ts-total { font-size: 16px; color: rgba(255,255,255,0.7); font-weight: 600; }
.ts-body { padding: 48px 24px 80px; }
.ts-section { margin-bottom: 56px; }
.ts-section-head { display: flex; align-items: center; gap: 14px; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 2px solid var(--border-light); }
.ts-section-icon { font-size: 28px; }
.ts-section-title { font-family: var(--font-serif); font-size: 24px; font-weight: 700; color: var(--text); margin: 0; flex: 1; }
.ts-section-count { background: var(--brand); color: white; padding: 6px 16px; border-radius: 999px; font-size: 14px; font-weight: 700; }
.ts-divider { border: none; border-top: 1px solid var(--border-light); margin: 40px 0; }

/* ─── RELATED ──────────────────────────────────────────────────── */
.related { padding: 60px 0 80px; background: var(--bg); border-top: 1px solid var(--border-light); }
.related__head { display: flex; align-items: center; gap: 20px; margin-bottom: 32px; }
.related__title { font-family: var(--font-serif); font-size: 28px; font-weight: 700; color: var(--text); margin: 0; white-space: nowrap; }
.related__rule { flex: 1; height: 1px; background: linear-gradient(90deg, var(--accent), transparent); opacity: 0.5; }
.pub[dir="rtl"] .related__rule { background: linear-gradient(270deg, var(--accent), transparent); }
.related__grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 20px; }
.rcard { background: var(--surface); border: 1px solid var(--border-light); border-radius: var(--radius); overflow: hidden; cursor: pointer; transition: all 0.3s ease; }
.rcard:hover { transform: translateY(-6px); box-shadow: var(--shadow-lg); border-color: var(--border); }
.rcard__img { position: relative; aspect-ratio: 16/9; overflow: hidden; }
.rcard__img-main { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease; display: block; }
.rcard__img-hover { position: absolute; inset: 0; object-fit: cover; width: 100%; height: 100%; opacity: 0; transition: opacity 0.3s ease; }
.rcard:hover .rcard__img-main { transform: scale(1.08); }
.rcard:hover .rcard__img-hover { opacity: 1; }
.rcard__overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%); opacity: 0; transition: opacity 0.3s; }
.rcard:hover .rcard__overlay { opacity: 1; }
.rcard__typebadge { position: absolute; top: 10px; left: 10px; background: rgba(255,255,255,0.92); color: var(--brand-dark); padding: 5px 10px; border-radius: 999px; font-size: 12px; font-weight: 700; }
.pub[dir="rtl"] .rcard__typebadge { left: auto; right: 10px; }
.rcard__body { padding: 18px; }
.rcard__title { font-family: var(--font-serif); font-size: 17px; font-weight: 700; margin: 0 0 8px; color: var(--text); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.rcard__desc { font-size: 13px; color: var(--text-muted); line-height: 1.6; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; margin-bottom: 12px; }
.rcard__tags { display: flex; gap: 6px; flex-wrap: wrap; }
.rtag { font-size: 12px; color: var(--text-muted); background: var(--bg); padding: 4px 10px; border-radius: 999px; border: 1px solid var(--border-light); transition: all 0.2s; }
.rtag--clickable { cursor: pointer; }
.rtag--clickable:hover { background: var(--brand); color: white; border-color: var(--brand); }

/* ─── PAGER ────────────────────────────────────────────────────── */
.pager { display: flex; align-items: center; justify-content: center; gap: 20px; padding: 48px 0 0; }
.pager__btn { background: var(--surface); border: 1px solid var(--border); padding: 12px 28px; border-radius: 999px; font-size: 15px; font-weight: 600; cursor: pointer; transition: all 0.2s; color: var(--text); }
.pager__btn:hover:not(:disabled) { background: var(--brand); color: white; border-color: var(--brand); transform: scale(1.04); }
.pager__btn:disabled { opacity: 0.35; cursor: not-allowed; }
.pager__dots { display: flex; gap: 8px; align-items: center; }
.pager__dot { width: 10px; height: 10px; border-radius: 50%; background: var(--border); cursor: pointer; transition: all 0.2s; }
.pager__dot:hover { background: var(--brand-light); transform: scale(1.2); }
.pager__dot--on { background: var(--brand); transform: scale(1.3); box-shadow: 0 0 0 3px rgba(140,21,21,0.15); }

/* ─── EMPTY STATE ──────────────────────────────────────────────── */
.empty { text-align: center; padding: 80px 24px; }
.empty__icon { font-size: 64px; margin-bottom: 24px; }
.empty__title { font-family: var(--font-serif); font-size: 28px; font-weight: 700; color: var(--text); margin: 0 0 12px; }
.empty__hint { font-size: 16px; color: var(--text-muted); margin: 0 0 32px; }
.btn-primary { display: inline-flex; align-items: center; gap: 10px; background: var(--brand); color: white; border: none; padding: 14px 28px; border-radius: 999px; font-size: 15px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
.btn-primary:hover { background: var(--brand-dark); transform: translateY(-2px); box-shadow: var(--shadow); }

/* ─── FULLSCREEN OVERLAY ───────────────────────────────────────── */
.fsoverlay { position: fixed; inset: 0; background: rgba(0,0,0,0.92); z-index: 1000; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(12px); }
.fsoverlay__x { position: absolute; top: 24px; right: 24px; width: 44px; height: 44px; border-radius: 50%; background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.2); color: white; font-size: 20px; cursor: pointer; display: grid; place-items: center; transition: all 0.2s; }
.fsoverlay__x:hover { background: var(--brand); border-color: var(--brand); transform: scale(1.1); }
.fsoverlay__frame { max-width: 90vw; max-height: 90vh; }
.fsoverlay__img { max-width: 100%; max-height: 90vh; border-radius: var(--radius); object-fit: contain; box-shadow: 0 40px 100px rgba(0,0,0,0.6); }

/* ─── TRANSITIONS ──────────────────────────────────────────────── */
.page-enter-active,.page-leave-active { transition: opacity 0.3s ease, transform 0.3s ease; }
.page-enter-from { opacity: 0; transform: translateY(16px); }
.page-leave-to { opacity: 0; transform: translateY(-8px); }
.drop-enter-active,.drop-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.drop-enter-from,.drop-leave-to { opacity: 0; transform: translateY(-8px); }
.pill-enter-active,.pill-leave-active { transition: opacity 0.3s, transform 0.3s; }
.pill-enter-from,.pill-leave-to { opacity: 0; transform: scale(0.85); }
.fs-enter-active,.fs-leave-active { transition: opacity 0.25s ease; }
.fs-enter-from,.fs-leave-to { opacity: 0; }

/* ─── RESPONSIVE ───────────────────────────────────────────────── */
@media (max-width: 1280px) { .stream-layout { grid-template-columns: 1fr 280px; } }
@media (max-width: 1024px) { .track { grid-template-columns: 36px 48px 24px 1fr 60px; } .track__waves { display: none; } }
@media (max-width: 768px) {
  .hero { min-height: 70vh; }
  .hero__stats { gap: 16px; }
  .hstat__inner { padding: 12px 16px; }
  .hstat__num { font-size: 28px; }
  .dhero__content { grid-template-columns: 1fr; padding: 60px 24px; }
  .dhero__right { display: none; }
  .dhero__stats { flex-direction: column; align-items: flex-start; }
  .tabnav__row { gap: 4px; flex-wrap: wrap; }
  .tabnav__item { max-width: none; flex: none; }
  .tabtn { padding: 12px 14px; font-size: 13px; }
  .tabtn__chevron,.tabtn__count { display: none; }
  .grid { grid-template-columns: 1fr; }
  .track { grid-template-columns: 36px 48px 1fr 60px; }
  .track__indicator,.track__waves { display: none; }
  .audio-bar { grid-template-columns: 48px 1fr auto; }
  .audio-bar__time-only { display: none; }
  .sfm-bilingual,.writing-bilingual-content { grid-template-columns: 1fr; }
  .clips-layout { grid-template-columns: 1fr; }
  .gallery-layout { grid-template-columns: 1fr; }
  .gallery-strip { flex-direction: row; width: 100%; max-height: none; overflow-x: auto; overflow-y: hidden; padding: 4px 0; }
  .gthumb { flex-shrink: 0; }
  .hero__corner { width: 40px; height: 40px; }
  .ts-hash,.ts-query { font-size: 32px; }
  .dnav__right { display: none; }
}
@media (max-width: 480px) {
  .container { padding: 0 16px; }
  .card { border-radius: var(--radius-sm); }
  .sfm-grid { grid-template-columns: 1fr; }
  .cdb-row { grid-template-columns: 80px 1fr; }
  .hero__filigree,.hero__stamp { display: none; }
  .hstat { flex: 1; min-width: 120px; }
  .wbc-col { padding: 16px; }
}
@media (prefers-color-scheme: dark) {
  .pub {
    --bg: #0d0d0d; --surface: #161616; --surface-elevated: #1f1f1f;
    --text: #f0eeeb; --text-muted: #9ca3af;
    --border: rgba(255,255,255,0.09); --border-light: rgba(255,255,255,0.05);
    --shadow-sm: 0 2px 8px rgba(0,0,0,0.3); --shadow: 0 10px 26px rgba(0,0,0,0.45); --shadow-lg: 0 20px 56px rgba(0,0,0,0.6);
    --brand-light: rgba(140,21,21,0.18);
  }
  .shimmer { background: linear-gradient(90deg, #1a1a1a 25%, #262626 50%, #1a1a1a 75%); }
  .skel__line,.skel__thumb,.skel__pill { background: #1f1f1f; }
  .tabnav { background: rgba(13,13,13,0.95); }
  .audio-bar { background: var(--surface); }
  .sfm-block { background: var(--surface); }
  .tabdrop { background: var(--surface-elevated); }
  .tsort__sel { background: var(--surface); color: var(--text); }
  .hero__overlay--base { background: linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.25) 50%, rgba(0,0,0,0.88) 100%); }
}
@media (prefers-reduced-motion: reduce) {
  *,.hero__slide,.hparticle,.msound__disc,.stamp__ring,.stamp__inner { animation: none !important; transition: none !important; }
}



</style>