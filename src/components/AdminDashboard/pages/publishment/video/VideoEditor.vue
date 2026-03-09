<template>
  <div class="ste" dir="rtl">

    <!-- Header -->
    <div class="ste__head">
      <RouterLink to="/admin/videos" class="ste__back">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5M12 5l-7 7 7 7"/>
        </svg>
        گەڕانەوە
      </RouterLink>
      <div>
        <h1 class="ste__title">{{ isEdit ? 'دەستکاری ڤیدیۆ' : 'ڤیدیۆی نوێ' }}</h1>
        <p class="ste__sub" v-if="isEdit">ID: {{ route.params.id }}</p>
      </div>
    </div>

    <!-- Toast -->
    <Transition name="toast">
      <div v-if="toast.show" class="toast" :class="`toast--${toast.type}`">
        <span class="toast__ico">{{ toast.type === 'success' ? '✓' : '✕' }}</span>
        {{ toast.msg }}
      </div>
    </Transition>

    <div v-if="fetching" class="loading-bar"></div>

    <form @submit.prevent="submit" novalidate>
      <div class="ste__layout">

        <!-- ═══ MAIN COLUMN ═══ -->
        <div class="col-main">

          <!-- Video Type -->
          <section class="card">
            <div class="card__hd"><span class="card__hd-ico">🎬</span> جۆری ڤیدیۆ</div>
            <div class="state-picks">
              <label class="state-pick" :class="{ 'state-pick--on': form.videoType === 'FILM' }">
                <input type="radio" value="FILM" v-model="form.videoType" />
                <span class="state-pick__flag">🎥</span>
                فیلم <span class="state-pick__code">FILM</span>
              </label>
              <label class="state-pick" :class="{ 'state-pick--on': form.videoType === 'VIDEO_CLIP' }">
                <input type="radio" value="VIDEO_CLIP" v-model="form.videoType" />
                <span class="state-pick__flag">🎞</span>
                ڤیدیۆ کلیپ <span class="state-pick__code">VIDEO_CLIP</span>
              </label>
            </div>
            <div v-if="errors.videoType" class="err">{{ errors.videoType }}</div>

            <!-- Album of Memories (only for VIDEO_CLIP) -->
            <Transition name="slide">
              <div v-if="form.videoType === 'VIDEO_CLIP'" class="album-memories-section">
                <div class="album-memories-divider"></div>
                <div class="album-memories-wrap">
                  <div class="album-memories-info">
                    <span class="album-memories-label">ئەلبوومی بیرەوەرییەکان؟</span>
                    <span class="album-memories-hint">ئەگەر ئەم کۆمەڵە ڤیدیۆیە ئەلبوومی بیرەوەرییەکانە، چالاکی بکە</span>
                  </div>
                  <button type="button" class="toggle" :class="{ 'toggle--on': form.albumOfMemories }" @click="form.albumOfMemories = !form.albumOfMemories">
                    <span class="toggle__dot"></span>
                    {{ form.albumOfMemories ? 'بەڵێ ❤' : 'نەخێر' }}
                  </button>
                </div>
              </div>
            </Transition>
          </section>

          <!-- Topic -->
          <section class="card">
            <div class="card__hd"><span class="card__hd-ico">🏷</span> بابەت (Topic)</div>
            <div class="state-picks">
              <label class="state-pick" :class="{ 'state-pick--on': topicMode === 'none' }">
                <input type="radio" value="none" v-model="topicMode" /> بێ بابەت
              </label>
              <label class="state-pick" :class="{ 'state-pick--on': topicMode === 'existing' }">
                <input type="radio" value="existing" v-model="topicMode" />
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>
                </svg>
                بابەتی هەبوو
              </label>
              <label class="state-pick" :class="{ 'state-pick--on': topicMode === 'new' }">
                <input type="radio" value="new" v-model="topicMode" />
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                بابەتی نوێ
              </label>
            </div>

            <div v-if="topicMode === 'existing'" class="field" style="margin-top:.9rem">
              <label class="lbl lbl--req">بابەت هەڵبژێرە</label>
              <div v-if="topicsLoading" class="topics-loading">
                <div class="spinner spinner--dark"></div><span>بابەتەکان بارکردن…</span>
              </div>
              <select v-else v-model="form.topicId" class="inp">
                <option :value="null">— هیچ —</option>
                <option v-for="tp in topics" :key="tp.id" :value="tp.id">
                  {{ tp.nameCkb || tp.nameKmr || `#${tp.id}` }}
                  <template v-if="tp.nameCkb && tp.nameKmr"> — {{ tp.nameKmr }}</template>
                </option>
              </select>
              <div v-if="errors.topicId" class="err">{{ errors.topicId }}</div>
            </div>

            <div v-if="topicMode === 'new'" style="margin-top:.9rem">
              <div class="two-grid">
                <div class="field">
                  <label class="lbl">ناوی بابەت (سۆرانی)</label>
                  <input v-model.trim="form.newTopic.nameCkb" class="inp" placeholder="ناوی بابەت بە سۆرانی…" />
                </div>
                <div class="field">
                  <label class="lbl">ناوی بابەت (کورمانجی)</label>
                  <input v-model.trim="form.newTopic.nameKmr" class="inp" placeholder="Navê mijarê bi Kurmancî…" />
                </div>
              </div>
              <div class="topic-hint">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                بابەتی نوێ دروست دەکرێت و بە ئەم ڤیدیۆیەوە دابمەزرێت
              </div>
              <div v-if="errors.newTopic" class="err">{{ errors.newTopic }}</div>
            </div>

            <div v-if="isEdit && topicMode === 'existing'" style="margin-top:.75rem">
              <label class="lang-pick" :class="{ 'lang-pick--on': form.clearTopic }">
                <input type="checkbox" v-model="form.clearTopic" />
                <span>سڕینەوەی بابەتی ئێستا</span>
              </label>
            </div>
          </section>

          <!-- Languages -->
          <section class="card">
            <div class="card__hd"><span class="card__hd-ico">🌐</span> زمانەکانی ناوەڕۆک</div>
            <div class="lang-picks">
              <label class="lang-pick" :class="{ 'lang-pick--on': form.contentLanguages.includes('CKB') }">
                <input type="checkbox" value="CKB" v-model="form.contentLanguages" />
                <span class="lang-pick__flag">🟡</span> سۆرانی <span class="lang-pick__code">سۆرانی</span>
              </label>
              <label class="lang-pick" :class="{ 'lang-pick--on': form.contentLanguages.includes('KMR') }">
                <input type="checkbox" value="KMR" v-model="form.contentLanguages" />
                <span class="lang-pick__flag">🔵</span> کورمانجی <span class="lang-pick__code">کورمانجی</span>
              </label>
            </div>
            <div v-if="errors.contentLanguages" class="err">{{ errors.contentLanguages }}</div>
          </section>

          <!-- Bilingual Content -->
          <section class="card" v-if="form.contentLanguages.length">
            <div class="tabs">
              <button
                v-for="lang in form.contentLanguages"
                :key="lang"
                type="button"
                class="tab"
                :class="{ 'tab--on': activeLang === lang }"
                @click="activeLang = lang"
              >
                <span class="tab__pip" :class="`tab__pip--${lang.toLowerCase()}`"></span>
                {{ lang === 'CKB' ? 'سۆرانی' : 'کورمانجی' }}
              </button>
            </div>

            <!-- CKB -->
            <div v-show="activeLang === 'CKB'" class="tab-panel">
              <div class="field">
                <label class="lbl lbl--req">ناونیشان (سۆرانی)</label>
                <input v-model="form.ckbContent.title" class="inp" placeholder="ناونیشانی ڤیدیۆ بە سۆرانی…" />
              </div>
              <div class="field">
                <label class="lbl">وەسف (سۆرانی)</label>
                <textarea v-model="form.ckbContent.description" class="inp ta" placeholder="وەسف…"></textarea>
              </div>
              <div class="two-grid">
                <div class="field">
                  <label class="lbl">دەرهێنەر (سۆرانی)</label>
                  <input v-model="form.ckbContent.director" class="inp" placeholder="ناوی دەرهێنەر…" />
                </div>
                <div class="field">
                  <label class="lbl">بەرهەمهێنەر (سۆرانی)</label>
                  <input v-model="form.ckbContent.producer" class="inp" placeholder="ناوی بەرهەمهێنەر…" />
                </div>
              </div>
              <div class="field">
                <label class="lbl">شوێن (سۆرانی)</label>
                <input v-model="form.ckbContent.location" class="inp" placeholder="شوێنی تۆمارکردن…" />
              </div>
              <div class="field">
                <label class="lbl">نیشانەکان (سۆرانی)</label>
                <TagInput v-model="form.tagsCkb" placeholder="نیشانەی نوێ زیاد بکە" color="gold" />
              </div>
              <div class="field">
                <label class="lbl">کلیلەوشەکان (سۆرانی)</label>
                <TagInput v-model="form.keywordsCkb" placeholder="کلیلەوشەی نوێ" color="blue" />
              </div>
            </div>

            <!-- KMR -->
            <div v-show="activeLang === 'KMR'" class="tab-panel">
              <div class="field">
                <label class="lbl lbl--req">ناونیشان (کورمانجی)</label>
                <input v-model="form.kmrContent.title" class="inp" placeholder="Sernavê vîdyoyê…" />
              </div>
              <div class="field">
                <label class="lbl">وەسف (کورمانجی)</label>
                <textarea v-model="form.kmrContent.description" class="inp ta" placeholder="Danasîn…"></textarea>
              </div>
              <div class="two-grid">
                <div class="field">
                  <label class="lbl">دەرهێنەر (کورمانجی)</label>
                  <input v-model="form.kmrContent.director" class="inp" placeholder="Navê derhêner…" />
                </div>
                <div class="field">
                  <label class="lbl">بەرهەمهێنەر (کورمانجی)</label>
                  <input v-model="form.kmrContent.producer" class="inp" placeholder="Navê hilberîner…" />
                </div>
              </div>
              <div class="field">
                <label class="lbl">شوێن (کورمانجی)</label>
                <input v-model="form.kmrContent.location" class="inp" placeholder="Cihê tomarkirinê…" />
              </div>
              <div class="field">
                <label class="lbl">نیشانەکان (کورمانجی)</label>
                <TagInput v-model="form.tagsKmr" placeholder="نیشانەی نوێ" color="gold" />
              </div>
              <div class="field">
                <label class="lbl">کلیلەوشەکان (کورمانجی)</label>
                <TagInput v-model="form.keywordsKmr" placeholder="کلیلەوشەی نوێ" color="blue" />
              </div>
            </div>

            <div v-if="errors.titles" class="err">{{ errors.titles }}</div>
          </section>

          <!-- Video Meta -->
          <section class="card">
            <div class="card__hd"><span class="card__hd-ico">🧾</span> زانیاری گشتی</div>
            <div class="two-grid">
              <div class="field">
                <label class="lbl">فۆرمات</label>
                <select v-model="form.fileFormat" class="inp">
                  <option value="">— هیچ —</option>
                  <option value="mp4">MP4</option>
                  <option value="webm">WEBM</option>
                  <option value="mkv">MKV</option>
                  <option value="avi">AVI</option>
                  <option value="mov">MOV</option>
                </select>
              </div>
              <div class="field">
                <label class="lbl">ڕیزۆلیوشن</label>
                <select v-model="form.resolution" class="inp">
                  <option value="">— هیچ —</option>
                  <option value="360p">360p</option>
                  <option value="480p">480p</option>
                  <option value="720p">720p</option>
                  <option value="1080p">1080p</option>
                  <option value="1440p">1440p</option>
                  <option value="2160p">4K (2160p)</option>
                </select>
              </div>
            </div>
            <div class="two-grid">
              <div class="field">
                <label class="lbl">ماوە (چرکە)</label>
                <input v-model.number="form.durationSeconds" type="number" class="inp" placeholder="0" min="0" />
              </div>
              <div class="field">
                <label class="lbl">قەبارە (MB)</label>
                <input v-model.number="form.fileSizeMb" type="number" class="inp" placeholder="0" min="0" step="0.1" />
              </div>
            </div>
            <div class="field">
              <label class="lbl">بەرواری بڵاوکردنەوە</label>
              <input v-model="form.publishmentDate" type="date" class="inp" />
            </div>
          </section>

          <!-- FILM Source -->
          <section class="card" v-if="form.videoType === 'FILM'">
            <div class="card__hd"><span class="card__hd-ico">🎥</span> سەرچاوەی ڤیدیۆ (فیلم)</div>

            <div class="field">
              <label class="lbl">فایلی ڤیدیۆ بارکردن</label>
              <label class="upload-zone upload-zone--sm">
                <input type="file" accept="video/*" @change="onVideoFile" style="display:none;" />
                <div class="upload-zone__inner">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
                  </svg>
                  <span>{{ videoFile ? videoFile.name : 'فایلی ڤیدیۆ هەڵبژێرە' }}</span>
                </div>
              </label>
            </div>

            <div class="field">
              <label class="lbl">یان لینکی سەرەکی</label>
              <input v-model="form.sourceUrl" class="inp" placeholder="S3/CDN direct url…" :disabled="!!videoFile" />
            </div>
            <div class="field">
              <label class="lbl">لینکی دەرەکی</label>
              <input v-model="form.sourceExternalUrl" class="inp" placeholder="YouTube watch URL…" />
            </div>
            <div class="field">
              <label class="lbl">لینکی Embed</label>
              <input v-model="form.sourceEmbedUrl" class="inp" placeholder="YouTube embed URL…" />
            </div>
          </section>

          <!-- VIDEO_CLIP Items -->
          <section class="card card--files" v-if="form.videoType === 'VIDEO_CLIP'">
            <div class="card__hd">
              <span class="card__hd-ico">🎞</span> کلیپەکان
              <span class="card__hd-badge">{{ form.videoClipItems.length }}</span>
            </div>

            <div v-if="errors.clips" class="err err--album">{{ errors.clips }}</div>

            <div class="files-list" v-if="form.videoClipItems.length">
              <div class="file-item" v-for="(clip, idx) in form.videoClipItems" :key="clip._key">
                <div class="file-item__head">
                  <span class="file-item__num">{{ idx + 1 }}</span>
                  <button type="button" class="mini-btn" @click="moveClipUp(idx)" :disabled="idx === 0" title="سەرەوە">↑</button>
                  <button type="button" class="mini-btn" @click="moveClipDown(idx)" :disabled="idx === form.videoClipItems.length - 1" title="خوارەوە">↓</button>
                  <button type="button" class="file-item__del" @click="removeClip(idx)" title="سڕینەوە">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                </div>

                <div class="file-item__body">
                  <div class="two-grid two-grid--sm">
                    <div class="field"><label class="lbl lbl--sm">ناو (سۆرانی)</label><input v-model="clip.titleCkb" class="inp inp--sm" placeholder="ناوی کلیپ…" /></div>
                    <div class="field"><label class="lbl lbl--sm">ناو (کورمانجی)</label><input v-model="clip.titleKmr" class="inp inp--sm" placeholder="Navê klîp…" /></div>
                  </div>

                  <div class="two-grid two-grid--sm">
                    <div class="field"><label class="lbl lbl--sm">وەسف (سۆرانی)</label><textarea v-model="clip.descriptionCkb" class="inp inp--sm ta ta--sm" placeholder="وەسف…"></textarea></div>
                    <div class="field"><label class="lbl lbl--sm">وەسف (کورمانجی)</label><textarea v-model="clip.descriptionKmr" class="inp inp--sm ta ta--sm" placeholder="Danasîn…"></textarea></div>
                  </div>

                  <div class="field"><label class="lbl lbl--sm">لینکی فایل</label><input v-model="clip.url" class="inp inp--sm" placeholder="S3/CDN url…" /></div>
                  <div class="field"><label class="lbl lbl--sm">لینکی دەرەکی</label><input v-model="clip.externalUrl" class="inp inp--sm" placeholder="YouTube watch…" /></div>
                  <div class="field"><label class="lbl lbl--sm">لینکی Embed</label><input v-model="clip.embedUrl" class="inp inp--sm" placeholder="YouTube embed…" /></div>
                </div>

                <div class="file-item__meta">
                  <div class="two-grid two-grid--sm">
                    <div class="field"><label class="lbl lbl--sm">ژمارەی کلیپ</label><input v-model.number="clip.clipNumber" type="number" class="inp inp--sm" :placeholder="String(idx+1)" min="1" /></div>
                    <div class="field"><label class="lbl lbl--sm">ماوە (چرکە)</label><input v-model.number="clip.durationSeconds" type="number" class="inp inp--sm" placeholder="0" min="0" /></div>
                  </div>
                  <div class="two-grid two-grid--sm" style="margin-top:.45rem">
                    <div class="field">
                      <label class="lbl lbl--sm">ڕیزۆلیوشن</label>
                      <select v-model="clip.resolution" class="inp inp--sm">
                        <option value="">—</option><option value="360p">360p</option><option value="480p">480p</option>
                        <option value="720p">720p</option><option value="1080p">1080p</option><option value="2160p">4K</option>
                      </select>
                    </div>
                    <div class="field">
                      <label class="lbl lbl--sm">فۆرمات</label>
                      <select v-model="clip.fileFormat" class="inp inp--sm">
                        <option value="">—</option><option value="mp4">MP4</option><option value="webm">WEBM</option><option value="mkv">MKV</option>
                      </select>
                    </div>
                  </div>
                  <div class="field" style="margin-top:.45rem">
                    <label class="lbl lbl--sm">قەبارە (MB)</label>
                    <input v-model.number="clip.fileSizeMb" type="number" class="inp inp--sm" placeholder="0" min="0" step="0.1" />
                  </div>
                </div>
              </div>
            </div>

            <div class="album-empty" v-else>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
                <rect x="2" y="2" width="20" height="20" rx="2"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/>
              </svg>
              <span>هیچ کلیپێک نییە — کلیپ زیاد بکە</span>
            </div>

            <div class="album-actions">
              <button type="button" class="btn btn--outline btn--sm" @click="addClip">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                کلیپی نوێ زیاد بکە
              </button>
            </div>
          </section>
        </div>

        <!-- ═══ SIDE COLUMN ═══ -->
        <aside class="col-side">

          <!-- Covers (CKB / KMR / Hover) -->
          <section class="card">
            <div class="card__hd"><span class="card__hd-ico">🖼</span> وێنەی ڕووکار</div>

            <!-- CKB -->
            <div class="img-block">
              <div class="img-block__title">وێنەی ڕووکاری سۆرانی</div>

              <div class="cover-preview" v-if="ckbCoverPreview || form.ckbCoverUrl">
                <img :src="ckbCoverPreview || form.ckbCoverUrl" alt="ckb cover preview" />
                <button type="button" class="cover-preview__remove" @click="removeCkbCover">✕</button>
              </div>

              <label class="upload-zone upload-zone--sm" v-else>
                <input type="file" accept="image/*" @change="onCkbCoverFile" style="display:none;" />
                <div class="upload-zone__inner">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                  </svg>
                  <span>هەڵبژاردنی وێنەی ڕووکاری سۆرانی</span>
                </div>
              </label>

              <div class="field" style="margin-top:.75rem;">
                <label class="lbl">یان URL بنووسە</label>
                <input v-model="form.ckbCoverUrl" class="inp" placeholder="https://…" :disabled="!!ckbCoverFile" />
              </div>

              <div v-if="errors.ckbCover" class="err">{{ errors.ckbCover }}</div>
            </div>

            <div class="img-sep"></div>

            <!-- KMR -->
            <div class="img-block">
              <div class="img-block__title">وێنەی ڕووکاری کورمانجی</div>

              <div class="cover-preview" v-if="kmrCoverPreview || form.kmrCoverUrl">
                <img :src="kmrCoverPreview || form.kmrCoverUrl" alt="kmr cover preview" />
                <button type="button" class="cover-preview__remove" @click="removeKmrCover">✕</button>
              </div>

              <label class="upload-zone upload-zone--sm" v-else>
                <input type="file" accept="image/*" @change="onKmrCoverFile" style="display:none;" />
                <div class="upload-zone__inner">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                  </svg>
                  <span>هەڵبژاردنی وێنەی ڕووکاری کورمانجی</span>
                </div>
              </label>

              <div class="field" style="margin-top:.75rem;">
                <label class="lbl">یان URL بنووسە</label>
                <input v-model="form.kmrCoverUrl" class="inp" placeholder="https://…" :disabled="!!kmrCoverFile" />
              </div>

              <div v-if="errors.kmrCover" class="err">{{ errors.kmrCover }}</div>
            </div>

            <div class="img-sep"></div>

            <!-- Hover -->
            <div class="img-block">
              <div class="img-block__title">
                وێنەی ماووس (Hover)
                <span class="img-block__hint">دەرکەوتە لە سەر hover</span>
              </div>

              <div class="cover-preview cover-preview--hover" v-if="hoverPreview || form.hoverCoverUrl">
                <img :src="hoverPreview || form.hoverCoverUrl" alt="hover cover preview" />
                <button type="button" class="cover-preview__remove" @click="removeHover">✕</button>
                <div class="cover-preview__hover-badge">H</div>
              </div>

              <label class="upload-zone upload-zone--sm upload-zone--hover" v-else>
                <input type="file" accept="image/*" @change="onHoverFile" style="display:none;" />
                <div class="upload-zone__inner">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                  </svg>
                  <span>هەڵبژاردنی وێنەی ماووس</span>
                </div>
              </label>

              <div class="field" style="margin-top:.75rem;">
                <label class="lbl">یان URL بنووسە</label>
                <input v-model="form.hoverCoverUrl" class="inp" placeholder="https://…" :disabled="!!hoverFile" />
              </div>

              <div v-if="errors.hoverCover" class="err">{{ errors.hoverCover }}</div>
            </div>
          </section>

          <!-- Current topic preview -->
          <section class="card" v-if="isEdit && currentTopicName">
            <div class="card__hd"><span class="card__hd-ico">🏷</span> بابەتی ئێستا</div>
            <div class="topic-current">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>
              </svg>
              {{ currentTopicName }}
            </div>
          </section>

          <!-- Album status -->
          <section class="card" v-if="form.videoType === 'VIDEO_CLIP'">
            <div class="card__hd"><span class="card__hd-ico">💿</span> دۆخی ئەلبووم</div>
            <div class="album-status" :class="form.albumOfMemories ? 'album-status--memories' : 'album-status--regular'">
              <span class="album-status__icon">{{ form.albumOfMemories ? '❤' : '🎬' }}</span>
              <div class="album-status__text">
                <span class="album-status__label">{{ form.albumOfMemories ? 'ئەلبوومی بیرەوەرییەکان' : 'کۆمەڵەی ئاسایی' }}</span>
                <span class="album-status__hint">{{ form.albumOfMemories ? 'کۆمەڵە ڤیدیۆی بیرەوەری' : 'کۆمەڵە ڤیدیۆی ئاسایی' }}</span>
              </div>
            </div>
          </section>

          <!-- Submit -->
          <div class="side-actions">
            <button type="submit" class="btn btn--primary btn--full" :disabled="saving">
              <span v-if="saving" class="spinner"></span>
              {{ saving ? 'پاشەکەوتکردن…' : (isEdit ? 'پاشەکەوتکردنی گۆڕانکاری' : 'دروستکردنی ڤیدیۆ') }}
            </button>
            <RouterLink to="/admin/videos" class="btn btn--ghost btn--full">هەڵوەشاندنەوە</RouterLink>
          </div>

          <!-- Danger zone -->
          <section v-if="isEdit" class="card card--danger">
            <div class="card__hd card__hd--danger"><span class="card__hd-ico">⚠️</span> ناوچەی مەترسیدار</div>
            <p class="danger-text">سڕینەوەی ڤیدیۆ ناگەڕێتەوە.</p>
            <button type="button" class="btn btn--danger btn--full" @click="doDelete">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/>
              </svg>
              سڕینەوەی ئەم ڤیدیۆیە
            </button>
          </section>

        </aside>
      </div>
    </form>
  </div>
</template>
<script setup>
import { ref, reactive, computed, onMounted, defineComponent, h, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/api.js'

/* ── Inline TagInput ── */
const TagInput = defineComponent({
  name: 'TagInput',
  props: {
    modelValue: { type: Array, default: () => [] },
    placeholder: { type: String, default: 'زیاد بکە…' },
    color: { type: String, default: 'default' },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const inp = ref('')
    const add = () => {
      const v = inp.value.trim()
      if (v && !props.modelValue.includes(v)) emit('update:modelValue', [...props.modelValue, v])
      inp.value = ''
    }
    const rem = (i) => {
      const a = [...props.modelValue]
      a.splice(i, 1)
      emit('update:modelValue', a)
    }
    return () => h('div', { class: 'tag-input' }, [
      h('div', { class: 'tag-input__tags' }, [
        ...props.modelValue.map((t, i) =>
          h('span', { class: `tag-input__tag tag-input__tag--${props.color}`, key: t },
            [t, h('button', { type: 'button', onClick: () => rem(i) }, '✕')])
        ),
        h('input', {
          class: 'tag-input__inp',
          placeholder: props.placeholder,
          value: inp.value,
          onInput: (e) => { inp.value = e.target.value },
          onKeydown: (e) => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add() } },
          onBlur: add,
        })
      ])
    ])
  }
})

const route = useRoute()
const router = useRouter()

const isEdit = computed(() => !!route.params.id)
const activeLang = ref('CKB')
const fetching = ref(false)
const saving = ref(false)
const toast = ref({ show: false, type: 'success', msg: '' })
const errors = ref({})
const topics = ref([])
const topicsLoading = ref(false)
const topicMode = ref('none')
let _keyCounter = 0

// ✅ 3 cover files + previews
const ckbCoverFile = ref(null)
const kmrCoverFile = ref(null)
const hoverFile = ref(null)
const ckbCoverPreview = ref('')
const kmrCoverPreview = ref('')
const hoverPreview = ref('')

// film file
const videoFile = ref(null)

const form = reactive({
  videoType: 'FILM',
  albumOfMemories: false,
  contentLanguages: ['CKB'],

  // ✅ new covers
  ckbCoverUrl: '',
  kmrCoverUrl: '',
  hoverCoverUrl: '',

  ckbContent: { title: '', description: '', location: '', director: '', producer: '' },
  kmrContent: { title: '', description: '', location: '', director: '', producer: '' },

  tagsCkb: [], tagsKmr: [],
  keywordsCkb: [], keywordsKmr: [],

  // FILM source
  sourceUrl: '', sourceExternalUrl: '', sourceEmbedUrl: '',

  // VIDEO_CLIP items
  videoClipItems: [],

  // Meta
  fileFormat: '', durationSeconds: 0, resolution: '', fileSizeMb: 0, publishmentDate: '',

  // Topic
  topicId: null,
  newTopic: { nameCkb: '', nameKmr: '' },
  clearTopic: false,
})

const currentTopicName = computed(() => {
  if (!form.topicId) return ''
  const found = topics.value.find(t => t.id === form.topicId)
  return found ? (found.nameCkb || found.nameKmr || `#${found.id}`) : `#${form.topicId}`
})

const fetchTopics = async () => {
  topicsLoading.value = true
  try {
    const { data } = await api.get('/api/v1/videos/topics')
    const arr = data?.data ?? data ?? []
    topics.value = Array.isArray(arr) ? arr : []
  } catch { /* non-fatal */ }
  finally { topicsLoading.value = false }
}

/* ── Clip management ── */
const makeClip = () => ({
  _key: ++_keyCounter,
  url: '', externalUrl: '', embedUrl: '',
  clipNumber: form.videoClipItems.length + 1,
  durationSeconds: 0, resolution: '', fileFormat: '', fileSizeMb: 0,
  titleCkb: '', titleKmr: '',
  descriptionCkb: '', descriptionKmr: ''
})
const addClip = () => { form.videoClipItems.push(makeClip()) }
const removeClip = (idx) => { form.videoClipItems.splice(idx, 1) }
const moveClipUp = (idx) => { if (idx <= 0) return; const t = form.videoClipItems[idx - 1]; form.videoClipItems[idx - 1] = form.videoClipItems[idx]; form.videoClipItems[idx] = t }
const moveClipDown = (idx) => { if (idx >= form.videoClipItems.length - 1) return; const t = form.videoClipItems[idx + 1]; form.videoClipItems[idx + 1] = form.videoClipItems[idx]; form.videoClipItems[idx] = t }

/* ── helpers for previews ── */
const setPreview = (refPreview, file) => {
  if (refPreview.value) URL.revokeObjectURL(refPreview.value)
  refPreview.value = file ? URL.createObjectURL(file) : ''
}

/* ── Cover files ── */
const onCkbCoverFile = (e) => { const f = e.target.files?.[0]; if (!f) return; ckbCoverFile.value = f; setPreview(ckbCoverPreview, f); form.ckbCoverUrl = '' }
const removeCkbCover = () => { setPreview(ckbCoverPreview, null); ckbCoverFile.value = null; form.ckbCoverUrl = '' }

const onKmrCoverFile = (e) => { const f = e.target.files?.[0]; if (!f) return; kmrCoverFile.value = f; setPreview(kmrCoverPreview, f); form.kmrCoverUrl = '' }
const removeKmrCover = () => { setPreview(kmrCoverPreview, null); kmrCoverFile.value = null; form.kmrCoverUrl = '' }

const onHoverFile = (e) => { const f = e.target.files?.[0]; if (!f) return; hoverFile.value = f; setPreview(hoverPreview, f); form.hoverCoverUrl = '' }
const removeHover = () => { setPreview(hoverPreview, null); hoverFile.value = null; form.hoverCoverUrl = '' }

/* ── Video file ── */
const onVideoFile = (e) => { const f = e.target.files?.[0]; if (!f) return; videoFile.value = f; form.sourceUrl = '' }

/* ── Load existing ── */
const loadVideo = async () => {
  if (!isEdit.value) return
  fetching.value = true
  try {
    const { data } = await api.get(`/api/v1/videos/${route.params.id}`)
    if (data) applyVideo(data)
    else showToast('error', 'ڤیدیۆکە نەدۆزرایەوە')
  } catch (e) {
    showToast('error', 'داتا هێنان سەرنەکەوت: ' + (e?.response?.data?.message || e.message))
  } finally { fetching.value = false }
}

const applyVideo = (v) => {
  form.videoType = v.videoType || 'FILM'
  form.albumOfMemories = !!(v.albumOfMemories ?? false)

  const langs = v.contentLanguages
    ? (Array.isArray(v.contentLanguages) ? v.contentLanguages : [...v.contentLanguages])
    : ['CKB']
  form.contentLanguages = [...langs]
  activeLang.value = form.contentLanguages[0] || 'CKB'

  // ✅ covers (new)
  form.ckbCoverUrl = v.ckbCoverUrl || ''
  form.kmrCoverUrl = v.kmrCoverUrl || ''
  form.hoverCoverUrl = v.hoverCoverUrl || ''

  if (v.ckbContent) {
    form.ckbContent.title = v.ckbContent.title || ''
    form.ckbContent.description = v.ckbContent.description || ''
    form.ckbContent.location = v.ckbContent.location || ''
    form.ckbContent.director = v.ckbContent.director || ''
    form.ckbContent.producer = v.ckbContent.producer || ''
  }
  if (v.kmrContent) {
    form.kmrContent.title = v.kmrContent.title || ''
    form.kmrContent.description = v.kmrContent.description || ''
    form.kmrContent.location = v.kmrContent.location || ''
    form.kmrContent.director = v.kmrContent.director || ''
    form.kmrContent.producer = v.kmrContent.producer || ''
  }

  form.tagsCkb = [...(v.tags?.ckb || v.tagsCkb || [])]
  form.tagsKmr = [...(v.tags?.kmr || v.tagsKmr || [])]
  form.keywordsCkb = [...(v.keywords?.ckb || v.keywordsCkb || [])]
  form.keywordsKmr = [...(v.keywords?.kmr || v.keywordsKmr || [])]

  form.sourceUrl = v.sourceUrl || ''
  form.sourceExternalUrl = v.sourceExternalUrl || ''
  form.sourceEmbedUrl = v.sourceEmbedUrl || ''

  form.fileFormat = v.fileFormat || ''
  form.durationSeconds = v.durationSeconds || 0
  form.resolution = v.resolution || ''
  form.fileSizeMb = v.fileSizeMb || 0
  form.publishmentDate = v.publishmentDate || ''

  if (v.topicId) { form.topicId = v.topicId; topicMode.value = 'existing' }
  else { form.topicId = null; topicMode.value = 'none' }

  form.clearTopic = false
  form.newTopic = { nameCkb: '', nameKmr: '' }

  form.videoClipItems = (v.videoClipItems || []).map(c => ({
    _key: ++_keyCounter,
    url: c.url || '', externalUrl: c.externalUrl || '', embedUrl: c.embedUrl || '',
    clipNumber: c.clipNumber || 0,
    durationSeconds: c.durationSeconds || 0,
    resolution: c.resolution || '',
    fileFormat: c.fileFormat || '',
    fileSizeMb: c.fileSizeMb || 0,
    titleCkb: c.titleCkb || '',
    titleKmr: c.titleKmr || '',
    descriptionCkb: c.descriptionCkb || '',
    descriptionKmr: c.descriptionKmr || ''
  }))
}

/* ── Validation ── */
const validate = () => {
  const e = {}

  if (!form.videoType) e.videoType = 'جۆری ڤیدیۆ پێویستە'
  if (!form.contentLanguages.length) e.contentLanguages = 'کەمی یەک زمان هەڵبژێرە'

  if (form.contentLanguages.includes('CKB') && !form.ckbContent.title.trim())
    e.titles = 'ناونیشانی سۆرانی پێویستە'
  if (form.contentLanguages.includes('KMR') && !form.kmrContent.title.trim())
    e.titles = (e.titles ? e.titles + ' | ' : '') + 'ناونیشانی کورمانجی پێویستە'

  if (topicMode.value === 'existing' && !form.topicId)
    e.topicId = 'موضوعێک هەڵبژێرە'
  if (topicMode.value === 'new' && !form.newTopic.nameCkb.trim() && !form.newTopic.nameKmr.trim())
    e.newTopic = 'کەمی یەک ناوی موضوع پێویستە'

  // ✅ required covers on CREATE (backend requires them)
  if (!isEdit.value) {
    if (!ckbCoverFile.value && !String(form.ckbCoverUrl || '').trim()) e.ckbCover = 'کڤەری CKB پێویستە'
    if (!kmrCoverFile.value && !String(form.kmrCoverUrl || '').trim()) e.kmrCover = 'کڤەری KMR پێویستە'
    if (!hoverFile.value && !String(form.hoverCoverUrl || '').trim()) e.hoverCover = 'Hover پێویستە'
  }

  if (form.videoType === 'VIDEO_CLIP') {
    if (!form.videoClipItems.length) e.clips = 'کەمی ١ کلیپ پێویستە'
    form.videoClipItems.forEach((c, i) => {
      if (!c.url?.trim() && !c.externalUrl?.trim() && !c.embedUrl?.trim())
        e.clips = `کلیپ #${i + 1}: پێویستە url یان externalUrl یان embedUrl بنووسیت`
    })
  }

  errors.value = e
  return !Object.keys(e).length
}

/* ── Submit ── */
const submit = async () => {
  if (!validate()) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    showToast('error', 'تکایە هەموو خانە پێویستەکان پڕ بکەوە')
    return
  }

  saving.value = true
  try {
    const dto = {
      videoType: form.videoType,
      albumOfMemories: form.videoType === 'VIDEO_CLIP' ? form.albumOfMemories : false,
      contentLanguages: form.contentLanguages,

      // ✅ covers
      ckbCoverUrl: form.ckbCoverUrl || null,
      kmrCoverUrl: form.kmrCoverUrl || null,
      hoverCoverUrl: form.hoverCoverUrl || null,

      ckbContent: form.contentLanguages.includes('CKB') ? {
        title: form.ckbContent.title || null,
        description: form.ckbContent.description || null,
        location: form.ckbContent.location || null,
        director: form.ckbContent.director || null,
        producer: form.ckbContent.producer || null,
      } : null,

      kmrContent: form.contentLanguages.includes('KMR') ? {
        title: form.kmrContent.title || null,
        description: form.kmrContent.description || null,
        location: form.kmrContent.location || null,
        director: form.kmrContent.director || null,
        producer: form.kmrContent.producer || null,
      } : null,

      // keep your existing shape (works with your current backend)
      tagsCkb: form.contentLanguages.includes('CKB') ? form.tagsCkb : [],
      tagsKmr: form.contentLanguages.includes('KMR') ? form.tagsKmr : [],
      keywordsCkb: form.contentLanguages.includes('CKB') ? form.keywordsCkb : [],
      keywordsKmr: form.contentLanguages.includes('KMR') ? form.keywordsKmr : [],

      fileFormat: form.fileFormat || null,
      durationSeconds: form.durationSeconds || null,
      resolution: form.resolution || null,
      fileSizeMb: form.fileSizeMb || null,
      publishmentDate: form.publishmentDate || null,

      sourceUrl: form.videoType === 'FILM' ? (form.sourceUrl || null) : null,
      sourceExternalUrl: form.videoType === 'FILM' ? (form.sourceExternalUrl || null) : null,
      sourceEmbedUrl: form.videoType === 'FILM' ? (form.sourceEmbedUrl || null) : null,

      videoClipItems: form.videoType === 'VIDEO_CLIP'
        ? form.videoClipItems.map(c => ({
          url: c.url || null,
          externalUrl: c.externalUrl || null,
          embedUrl: c.embedUrl || null,
          clipNumber: c.clipNumber || null,
          durationSeconds: c.durationSeconds || null,
          resolution: c.resolution || null,
          fileFormat: c.fileFormat || null,
          fileSizeMb: c.fileSizeMb || null,
          titleCkb: c.titleCkb || null,
          titleKmr: c.titleKmr || null,
          descriptionCkb: c.descriptionCkb || null,
          descriptionKmr: c.descriptionKmr || null,
        }))
        : null,

      topicId: topicMode.value === 'existing' ? (form.topicId || null) : null,
      newTopic: topicMode.value === 'new'
        ? { nameCkb: form.newTopic.nameCkb || null, nameKmr: form.newTopic.nameKmr || null }
        : null,

      ...(isEdit.value ? { clearTopic: form.clearTopic } : {}),
    }

    // ✅ multipart
    const fd = new FormData()
    fd.append('data', new Blob([JSON.stringify(dto)], { type: 'application/json' }))

    // ✅ cover parts must match controller
    if (ckbCoverFile.value) fd.append('ckbCoverImage', ckbCoverFile.value)
    if (kmrCoverFile.value) fd.append('kmrCoverImage', kmrCoverFile.value)
    if (hoverFile.value) fd.append('hoverImage', hoverFile.value)
    if (videoFile.value) fd.append('videoFile', videoFile.value)

    const cfg = { headers: { 'Content-Type': 'multipart/form-data' } }
    if (isEdit.value) await api.put(`/api/v1/videos/${route.params.id}`, fd, cfg)
    else await api.post('/api/v1/videos', fd, cfg)

    showToast('success', isEdit.value ? 'ڤیدیۆکە نوێکرایەوە ✓' : 'ڤیدیۆکە دروستکرا ✓')
    setTimeout(() => router.push('/admin/videos'), 1200)

  } catch (e) {
    console.error('Submit error:', e)
    showToast('error', e?.response?.data?.message || e?.response?.data?.error || e.message || 'هەڵەیەک ڕوویدا')
  } finally { saving.value = false }
}

const doDelete = async () => {
  if (!confirm(`دڵنیای لە سڕینەوەی ڤیدیۆ #${route.params.id}؟`)) return
  try {
    await api.delete(`/api/v1/videos/${route.params.id}`)
    showToast('success', 'ڤیدیۆکە سڕایەوە')
    setTimeout(() => router.push('/admin/videos'), 800)
  } catch (e) {
    showToast('error', e?.response?.data?.message || 'سڕینەوە سەرنەکەوت')
  }
}

const showToast = (type, msg) => {
  toast.value = { show: true, type, msg }
  setTimeout(() => { toast.value.show = false }, 4000)
}

watch(() => form.videoType, (v) => {
  if (v === 'FILM') form.albumOfMemories = false
})

watch(() => form.contentLanguages.slice(), (langs) => {
  if (!langs.length) return
  if (!langs.includes(activeLang.value)) activeLang.value = langs[0]
}, { deep: true })

onMounted(() => {
  fetchTopics()
  loadVideo()
})
</script>

<style scoped>
:root, .ste { --crimson:#8C1515; --crimson-lt:#a31d1d; --gold:#c8a800; --text:#2E2D29; --muted:#767571; --border:#E0DFDC; --cream:#FAFAF9; --cream-dk:#F0EEEB; --white:#fff; --radius-sm:10px; --radius-md:14px; --shadow-sm:0 2px 8px rgba(0,0,0,.04); --transition:.15s ease; }
.ste { direction:rtl; max-width:1280px; margin:0 auto; }
.ste__head { display:flex; align-items:center; gap:1.25rem; margin-bottom:1.5rem; flex-wrap:wrap; }
.ste__back { display:inline-flex; align-items:center; gap:.4rem; color:var(--muted); text-decoration:none; font-weight:600; font-size:.87rem; padding:.4rem .7rem; border-radius:8px; border:1px solid var(--border); background:var(--white); transition:var(--transition); }
.ste__back:hover { color:var(--crimson); border-color:var(--crimson); }
.ste__title { font-size:1.4rem; font-weight:700; color:var(--text); }
.ste__sub { font-size:.8rem; color:var(--muted); margin-top:.1rem; }
.toast { display:flex; align-items:center; gap:.65rem; padding:.8rem 1.1rem; border-radius:var(--radius-sm); font-weight:600; font-size:.88rem; margin-bottom:1rem; }
.toast__ico { font-size:1rem; }
.toast--success { background:rgba(25,130,80,.1); border:1px solid rgba(25,130,80,.25); color:#186048; }
.toast--error { background:rgba(180,40,40,.08); border:1px solid rgba(180,40,40,.2); color:var(--crimson); }
.toast-enter-active,.toast-leave-active { transition:.3s ease; }
.toast-enter-from,.toast-leave-to { opacity:0; transform:translateY(-6px); }
.loading-bar { height:3px; border-radius:2px; margin-bottom:.75rem; background:linear-gradient(90deg,var(--crimson),var(--gold),var(--crimson)); background-size:200% 100%; animation:shimmer 1.2s linear infinite; }
@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
.ste__layout { display:grid; grid-template-columns:1fr 320px; gap:1.25rem; align-items:start; }
@media (max-width:900px) { .ste__layout { grid-template-columns:1fr; } }
.card { background:var(--white); border:1px solid var(--border); border-radius:var(--radius-md); padding:1.35rem; box-shadow:var(--shadow-sm); margin-bottom:1.25rem; }
.card--danger { border-color:rgba(140,21,21,.18); }
.card--files { padding-bottom:.9rem; }
.card__hd { display:flex; align-items:center; gap:.6rem; font-weight:700; font-size:.95rem; color:var(--text); margin-bottom:1.1rem; padding-bottom:.75rem; border-bottom:1px solid var(--cream-dk); flex-wrap:wrap; }
.card__hd--danger { color:var(--crimson); border-bottom-color:rgba(140,21,21,.1); }
.card__hd-ico { font-size:1rem; }
.card__hd-badge { margin-right:auto; background:var(--cream-dk); border:1px solid var(--border); border-radius:99px; padding:.1rem .6rem; font-size:.78rem; color:var(--muted); }
.danger-text { font-size:.84rem; color:var(--muted); margin-bottom:.85rem; line-height:1.65; }
.album-memories-section { margin-top:1rem; }
.album-memories-divider { height:1px; background:var(--cream-dk); margin-bottom:.9rem; }
.album-memories-wrap { display:flex; align-items:center; justify-content:space-between; gap:1rem; padding:.85rem 1rem; border-radius:var(--radius-sm); background:linear-gradient(135deg, rgba(190,24,93,.04) 0%, rgba(140,21,21,.04) 100%); border:1.5px solid rgba(190,24,93,.12); }
.album-memories-info { display:flex; flex-direction:column; gap:.2rem; }
.album-memories-label { font-weight:800; font-size:.9rem; color:var(--text); }
.album-memories-hint { font-size:.77rem; color:var(--muted); }
.album-status { display:flex; align-items:center; gap:.65rem; padding:.7rem .9rem; border-radius:var(--radius-sm); }
.album-status--memories { background:rgba(190,24,93,.06); border:1px solid rgba(190,24,93,.18); }
.album-status--regular { background:var(--cream); border:1px solid var(--border); }
.album-status__icon { font-size:1.2rem; }
.album-status__text { display:flex; flex-direction:column; gap:.1rem; }
.album-status__label { font-weight:800; font-size:.85rem; color:var(--text); }
.album-status__hint { font-size:.75rem; color:var(--muted); }
.slide-enter-active { transition:all .3s ease; }
.slide-leave-active { transition:all .2s ease; }
.slide-enter-from, .slide-leave-to { opacity:0; max-height:0; margin-top:0; overflow:hidden; }
.slide-enter-to, .slide-leave-from { opacity:1; max-height:200px; }
.topics-loading { display:flex; align-items:center; gap:.6rem; padding:.7rem; color:var(--muted); font-size:.87rem; }
.topic-hint { display:flex; align-items:center; gap:.4rem; font-size:.78rem; color:var(--muted); background:var(--cream); border:1px solid var(--border); border-radius:var(--radius-sm); padding:.55rem .75rem; margin-top:.5rem; }
.topic-current { display:inline-flex; align-items:center; gap:.5rem; padding:.55rem .85rem; border-radius:var(--radius-sm); background:rgba(140,21,21,.06); border:1px solid rgba(140,21,21,.18); color:var(--crimson); font-size:.88rem; font-weight:700; }
.state-picks { display:flex; gap:.75rem; flex-wrap:wrap; }
.state-pick { display:inline-flex; align-items:center; gap:.5rem; padding:.65rem 1rem; border-radius:var(--radius-sm); border:1.5px solid var(--border); cursor:pointer; transition:var(--transition); font-weight:700; user-select:none; }
.state-pick input { display:none; }
.state-pick:hover { border-color:var(--crimson); }
.state-pick--on { background:rgba(140,21,21,.06); border-color:var(--crimson); color:var(--crimson); }
.state-pick__flag { font-size:.85rem; }
.state-pick__code { font-size:.75rem; font-weight:900; opacity:.6; }
.lang-picks { display:flex; gap:.75rem; flex-wrap:wrap; }
.lang-pick { display:inline-flex; align-items:center; gap:.5rem; padding:.65rem 1rem; border-radius:var(--radius-sm); border:1.5px solid var(--border); cursor:pointer; transition:var(--transition); font-weight:700; user-select:none; }
.lang-pick input { display:none; }
.lang-pick:hover { border-color:var(--crimson); }
.lang-pick--on { background:rgba(140,21,21,.06); border-color:var(--crimson); color:var(--crimson); }
.lang-pick__flag { font-size:.85rem; }
.lang-pick__code { font-size:.75rem; font-weight:900; opacity:.6; }
.tabs { display:flex; gap:.4rem; margin-bottom:1.1rem; border-bottom:1px solid var(--border); }
.tab { display:inline-flex; align-items:center; gap:.4rem; padding:.6rem 1rem; border-radius:8px 8px 0 0; border:1px solid transparent; border-bottom:none; background:none; color:var(--muted); font-weight:800; font-size:.88rem; cursor:pointer; transition:var(--transition); margin-bottom:-1px; font-family:inherit; }
.tab--on { background:var(--white); border-color:var(--border); color:var(--crimson); }
.tab__pip { width:7px; height:7px; border-radius:50%; }
.tab__pip--ckb { background:#c8a800; }
.tab__pip--kmr { background:#4a7af0; }
.field { display:flex; flex-direction:column; gap:.4rem; margin-bottom:.95rem; }
.lbl { font-weight:800; font-size:.83rem; color:var(--text); }
.lbl--sm { font-size:.77rem; }
.lbl--req::after { content:' *'; color:var(--crimson); }
.two-grid { display:grid; grid-template-columns:1fr 1fr; gap:.9rem; }
.two-grid--sm { gap:.6rem; }
@media (max-width:600px) { .two-grid { grid-template-columns:1fr; } }
.inp { border:1.5px solid var(--border); border-radius:var(--radius-sm); padding:.7rem .9rem; background:var(--cream); color:var(--text); font-size:.9rem; outline:none; transition:var(--transition); width:100%; font-family:inherit; }
.inp:focus { background:var(--white); border-color:var(--crimson); box-shadow:0 0 0 3px rgba(140,21,21,.1); }
.inp--sm { padding:.5rem .7rem; font-size:.85rem; }
.ta { min-height:120px; resize:vertical; }
.ta--sm { min-height:70px; }
.err { font-size:.78rem; color:#c0392b; font-weight:700; }
.err--album { margin-bottom:.85rem; padding:.6rem .85rem; background:rgba(192,57,43,.06); border:1px solid rgba(192,57,43,.2); border-radius:var(--radius-sm); }
.toggle { display:inline-flex; align-items:center; gap:.6rem; padding:.7rem .9rem; border-radius:var(--radius-sm); border:1.5px solid var(--border); background:var(--cream); color:var(--muted); cursor:pointer; transition:var(--transition); font-weight:900; font-family:inherit; justify-content:center; min-width:120px; }
.toggle:hover { border-color:rgba(140,21,21,.35); }
.toggle--on { background:rgba(22,120,70,.09); border-color:rgba(22,120,70,.25); color:#166044; }
.toggle__dot { width:10px; height:10px; border-radius:50%; background:var(--border); transition:.2s; }
.toggle--on .toggle__dot { background:#22a06b; }
.files-list { display:flex; flex-direction:column; gap:.85rem; margin-bottom:1rem; }
.file-item { border:1.5px solid var(--border); border-radius:var(--radius-sm); background:var(--cream); overflow:hidden; transition:border-color .2s ease; }
.file-item:hover { border-color:rgba(140,21,21,.3); }
.file-item__head { display:flex; align-items:center; gap:.5rem; padding:.6rem .85rem; background:var(--cream-dk); border-bottom:1px solid var(--border); flex-wrap:wrap; }
.file-item__num { width:24px; height:24px; border-radius:50%; background:var(--crimson); color:#fff; font-size:.72rem; font-weight:900; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.file-item__del { margin-right:auto; width:26px; height:26px; border-radius:6px; background:none; border:1px solid var(--border); color:var(--muted); cursor:pointer; display:flex; align-items:center; justify-content:center; transition:var(--transition); flex-shrink:0; }
.file-item__del:hover { background:rgba(140,21,21,.08); border-color:var(--crimson); color:var(--crimson); }
.file-item__body { padding:.75rem .85rem; border-bottom:1px solid var(--border); }
.file-item__meta { padding:.75rem .85rem; }
.mini-btn { width:26px; height:26px; border-radius:8px; border:1px solid var(--border); background:var(--white); color:var(--muted); cursor:pointer; font-weight:900; transition:var(--transition); }
.mini-btn:hover:not(:disabled) { border-color:var(--crimson); color:var(--crimson); }
.mini-btn:disabled { opacity:.35; cursor:default; }
.upload-zone { border:2px dashed var(--border); border-radius:var(--radius-sm); cursor:pointer; transition:var(--transition); display:block; margin-bottom:.75rem; }
.upload-zone:hover { border-color:var(--crimson); background:rgba(140,21,21,.03); }
.upload-zone--sm .upload-zone__inner { padding:1.25rem; }
.upload-zone__inner { display:flex; flex-direction:column; align-items:center; gap:.5rem; padding:1.75rem 1rem; color:var(--muted); font-size:.87rem; text-align:center; cursor:pointer; }
.album-empty { display:flex; flex-direction:column; align-items:center; gap:.65rem; padding:2.5rem 1rem; color:var(--muted); font-size:.87rem; text-align:center; border:2px dashed var(--border); border-radius:var(--radius-sm); margin-bottom:1rem; }
.album-actions { display:flex; gap:.6rem; flex-wrap:wrap; padding-top:.25rem; }

.cover-preview { position:relative; border-radius:var(--radius-sm); overflow:hidden; border:1px solid var(--border); margin-bottom:.75rem; background:#fff; }
.cover-preview img { width:100%; max-height:200px; object-fit:cover; display:block; }
.cover-preview__remove { position:absolute; top:.5rem; left:.5rem; width:28px; height:28px; border-radius:50%; background:rgba(0,0,0,.55); color:#fff; border:none; cursor:pointer; font-size:.85rem; display:flex; align-items:center; justify-content:center; }
.cover-preview--hover::after { content:''; position:absolute; inset:0; background:linear-gradient(135deg, rgba(190,24,93,.15), rgba(0,0,0,0)); pointer-events:none; }
.cover-preview__hover-badge { position:absolute; bottom:.5rem; left:.5rem; width:28px; height:28px; border-radius:9px; display:flex; align-items:center; justify-content:center; background:rgba(190,24,93,.9); color:#fff; font-weight:900; font-size:.8rem; box-shadow:0 10px 18px rgba(190,24,93,.22); }

.img-block { display:flex; flex-direction:column; }
.img-block__title { font-weight:900; font-size:.9rem; color:var(--text); display:flex; align-items:center; justify-content:space-between; }
.img-block__hint { font-weight:700; font-size:.72rem; color:var(--muted); }
.img-sep { height:1px; background:var(--cream-dk); margin:1rem 0; }

.btn { display:inline-flex; align-items:center; justify-content:center; gap:.45rem; padding:.7rem 1.1rem; border-radius:var(--radius-sm); font-weight:900; font-size:.88rem; cursor:pointer; border:1px solid transparent; transition:var(--transition); text-decoration:none; white-space:nowrap; font-family:inherit; }
.btn--primary { background:var(--crimson); color:#fff; box-shadow:0 6px 20px rgba(140,21,21,.25); }
.btn--primary:hover { background:var(--crimson-lt); transform:translateY(-1px); }
.btn--ghost { background:transparent; border-color:var(--border); color:var(--text); }
.btn--ghost:hover { border-color:var(--crimson); color:var(--crimson); }
.btn--outline { background:transparent; border-color:var(--border); color:var(--muted); }
.btn--outline:hover { border-color:var(--crimson); color:var(--crimson); }
.btn--danger { background:#c0392b; color:#fff; border-color:#c0392b; }
.btn--danger:hover { background:#a93226; }
.btn--sm { padding:.5rem .8rem; font-size:.83rem; }
.btn--full { width:100%; }
.btn:disabled { opacity:.55; cursor:not-allowed; transform:none!important; }
.side-actions { display:flex; flex-direction:column; gap:.6rem; }
.spinner { width:14px; height:14px; border:2px solid rgba(255,255,255,.4); border-top-color:#fff; border-radius:50%; animation:spin .7s linear infinite; }
.spinner--dark { border-color:rgba(0,0,0,.15); border-top-color:var(--crimson); }
@keyframes spin { to { transform:rotate(360deg) } }
</style>

<style>
.tag-input { display:flex; flex-direction:column; gap:.4rem; }
.tag-input__tags { display:flex; flex-wrap:wrap; gap:.4rem; align-items:center; border:1.5px solid var(--border); border-radius:var(--radius-sm); padding:.45rem .65rem; background:var(--cream); min-height:42px; transition:border-color .2s; }
.tag-input__tags:focus-within { border-color:var(--crimson); background:var(--white); box-shadow:0 0 0 3px rgba(140,21,21,.1); }
.tag-input__tag { display:inline-flex; align-items:center; gap:.3rem; padding:.2rem .55rem; border-radius:6px; font-size:.8rem; font-weight:700; }
.tag-input__tag--default { background:var(--cream-dk); border:1px solid var(--border); color:var(--text); }
.tag-input__tag--gold { background:rgba(254,221,0,.2); border:1px solid rgba(254,221,0,.4); color:#807000; }
.tag-input__tag--blue { background:rgba(30,80,200,.1); border:1px solid rgba(30,80,200,.2); color:#1840a0; }
.tag-input__tag button { background:none; border:none; cursor:pointer; color:inherit; opacity:.6; font-size:.75rem; line-height:1; }
.tag-input__tag button:hover { opacity:1; }
.tag-input__inp { border:none; outline:none; background:none; font-family:inherit; font-size:.88rem; min-width:120px; color:var(--text); }
</style>