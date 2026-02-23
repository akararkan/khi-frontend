<template>
  <div class="editor" dir="rtl">

    <!-- ── HEADER ── -->
    <div class="editor__head">
      <RouterLink class="back-btn" to="/admin/films">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        گەڕانەوە
      </RouterLink>
      <div>
        <h1 class="editor__title">{{ isEdit ? 'دەستکاریکردنی فیلم' : 'فیلمی نوێ' }}</h1>
        <p class="editor__sub">{{ isEdit ? `بەڕێوەبردنی : ${bestTitle}` : 'پڕکردنەوەی زانیاریەکان بۆ فیلمی نوێ' }}</p>
      </div>
      <button class="btn btn--primary" :disabled="saving" @click="submit">
        <span v-if="saving" class="spinner"></span>
        <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
          <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/>
          <polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
        </svg>
        {{ saving ? 'پاشەکەوتکردن…' : (isEdit ? 'نوێکردنەوە' : 'تۆمارکردن') }}
      </button>
    </div>

    <!-- ── TOAST ── -->
    <Transition name="slide-down">
      <div v-if="toast.show" class="toast" :class="`toast--${toast.type}`">
        <span>{{ toast.type === 'success' ? '✓' : '✕' }}</span> {{ toast.msg }}
      </div>
    </Transition>

    <!-- ── LOADING ── -->
    <div v-if="loading" class="skeletons">
      <div class="skel" v-for="i in 4" :key="i"></div>
    </div>

    <div v-else class="editor__body">

      <!-- ═══════════════════════════════
           SECTION 1 — MEDIA
      ═══════════════════════════════ -->
      <section class="card">
        <div class="card__hd">
          <span class="card__ico card__ico--media">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="2" width="20" height="20" rx="2"/><polygon points="10 8 16 12 10 16 10 8"/>
            </svg>
          </span>
          <div>
            <h2 class="card__title">میدیا</h2>
            <p class="card__sub">کڤەر و سەرچاوەی فیلم</p>
          </div>
        </div>

        <div class="media-grid">

          <!-- Cover -->
          <div class="upload-zone">
            <div class="upload-zone__label">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
              کڤەری فیلم
            </div>
            <!-- Preview -->
            <div v-if="coverPreview" class="upload-preview" @click="$refs.coverInput.click()">
              <img :src="coverPreview" class="upload-preview__img" />
              <div class="upload-preview__overlay">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4z"/></svg>
                گۆڕانکاری
              </div>
            </div>
            <div v-else class="upload-drop" @click="$refs.coverInput.click()" @dragover.prevent @drop.prevent="onCoverDrop">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
              <span>کلیک بکە یان بکێشە</span>
              <small>PNG, JPG, WEBP · Max 5MB</small>
            </div>
            <input ref="coverInput" type="file" accept="image/*" class="hidden-input" @change="onCoverFile" />
            <!-- OR direct URL -->
            <div class="url-alt">
              <span class="url-alt__label">یان لینکی پەڕتووک</span>
              <input v-model="form.coverUrl" class="inp" :placeholder="coverFile ? '(فایل هەڵبژێردراوە)' : 'https://…'" :disabled="!!coverFile" />
              <button v-if="coverFile" class="clear-file-btn" @click="clearCoverFile" type="button">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                سڕینەوەی فایل
              </button>
            </div>
          </div>

          <!-- Film source -->
          <div class="upload-zone">
            <div class="upload-zone__label">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              فایلی فیلم / سەرچاوە
            </div>

            <!-- Source type tabs -->
            <div class="src-tabs">
              <button v-for="st in srcTypes" :key="st.key" type="button" class="src-tab" :class="{'src-tab--on': srcType===st.key}" @click="srcType=st.key">
                <span class="src-tab__ico">{{ st.icon }}</span>{{ st.label }}
              </button>
            </div>

            <!-- Upload file -->
            <template v-if="srcType === 'upload'">
              <div v-if="filmFile" class="file-chosen">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                <span class="file-chosen__name">{{ filmFile.name }}</span>
                <span class="file-chosen__size">{{ fmtBytes(filmFile.size) }}</span>
                <button class="file-chosen__rm" type="button" @click="clearFilmFile">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
              <div v-else class="upload-drop upload-drop--film" @click="$refs.filmInput.click()" @dragover.prevent @drop.prevent="onFilmDrop">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                <span>فایلی فیلم هەڵبژێرە</span>
                <small>MP4, MKV, MOV, AVI, WEBM</small>
              </div>
              <input ref="filmInput" type="file" accept="video/*" class="hidden-input" @change="onFilmFile" />
            </template>

            <!-- Direct sourceUrl -->
            <template v-if="srcType === 'direct'">
              <div class="field-grp">
                <label class="lbl">Source URL (S3 / CDN)</label>
                <input v-model="form.sourceUrl" class="inp" placeholder="https://cdn.example.com/film.mp4" />
              </div>
            </template>

            <!-- Embed URL -->
            <template v-if="srcType === 'embed'">
              <div class="field-grp">
                <label class="lbl">Embed URL (YouTube embed, Vimeo embed…)</label>
                <input v-model="form.sourceEmbedUrl" class="inp" placeholder="https://www.youtube.com/embed/XXXXXX" />
                <p class="field-hint">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  بۆ یوتیوب: Share → Embed → لینکی src
                </p>
              </div>
            </template>

            <!-- External URL -->
            <template v-if="srcType === 'external'">
              <div class="field-grp">
                <label class="lbl">External Link (YouTube watch, Vimeo, Dailymotion…)</label>
                <input v-model="form.sourceExternalUrl" class="inp" placeholder="https://www.youtube.com/watch?v=…" />
              </div>
            </template>

          </div>
        </div>
      </section>

      <!-- ═══════════════════════════════
           SECTION 2 — LANGUAGES
      ═══════════════════════════════ -->
      <section class="card">
        <div class="card__hd">
          <span class="card__ico card__ico--lang">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
              <path d="M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"/>
            </svg>
          </span>
          <div>
            <h2 class="card__title">زمانەکان</h2>
            <p class="card__sub">زمانی ناوەڕۆکی فیلم هەڵبژێرە</p>
          </div>
        </div>

        <div class="lang-toggles">
          <label class="lang-toggle" :class="{'lang-toggle--on': form.contentLanguages.includes('CKB')}">
            <input type="checkbox" :value="'CKB'" v-model="form.contentLanguages" class="hidden-input" />
            <span class="lang-toggle__pip lang-toggle__pip--ckb"></span>
            سۆرانی (CKB)
            <span v-if="form.contentLanguages.includes('CKB')" class="lang-toggle__check">✓</span>
          </label>
          <label class="lang-toggle" :class="{'lang-toggle--on': form.contentLanguages.includes('KMR')}">
            <input type="checkbox" :value="'KMR'" v-model="form.contentLanguages" class="hidden-input" />
            <span class="lang-toggle__pip lang-toggle__pip--kmr"></span>
            کورمانجی (KMR)
            <span v-if="form.contentLanguages.includes('KMR')" class="lang-toggle__check">✓</span>
          </label>
        </div>

        <div class="lang-sections">

          <!-- CKB Content -->
          <Transition name="section-slide">
            <div v-if="form.contentLanguages.includes('CKB')" class="lang-section lang-section--ckb">
              <div class="lang-section__hd">
                <span class="lang-section__pip lang-section__pip--ckb"></span>
                ناوەڕۆکی سۆرانی
              </div>
              <div class="fields-grid">
                <div class="field-grp field-grp--full">
                  <label class="lbl lbl--req">ناونیشان (سۆرانی)</label>
                  <input v-model="form.ckbContent.title" class="inp" placeholder="ناونیشانی فیلم بە سۆرانی…" />
                  <p v-if="errors.ckbTitle" class="field-err">{{ errors.ckbTitle }}</p>
                </div>
                <div class="field-grp field-grp--full">
                  <label class="lbl">وەسف (سۆرانی)</label>
                  <textarea v-model="form.ckbContent.description" class="inp inp--ta" rows="4" placeholder="وەسفی فیلم بە سۆرانی…"></textarea>
                </div>
                <div class="field-grp">
                  <label class="lbl">بابەت</label>
                  <input v-model="form.ckbContent.topic" class="inp" placeholder="بابەتی فیلم…" />
                </div>
                <div class="field-grp">
                  <label class="lbl">شوێن</label>
                  <input v-model="form.ckbContent.location" class="inp" placeholder="شوێنی تۆمارکردن…" />
                </div>
                <div class="field-grp">
                  <label class="lbl">دەرهێنەر</label>
                  <input v-model="form.ckbContent.director" class="inp" placeholder="ناوی دەرهێنەر…" />
                </div>
                <div class="field-grp">
                  <label class="lbl">بەرهەمهێنەر</label>
                  <input v-model="form.ckbContent.producer" class="inp" placeholder="ناوی بەرهەمهێنەر…" />
                </div>
              </div>
            </div>
          </Transition>

          <!-- KMR Content -->
          <Transition name="section-slide">
            <div v-if="form.contentLanguages.includes('KMR')" class="lang-section lang-section--kmr">
              <div class="lang-section__hd">
                <span class="lang-section__pip lang-section__pip--kmr"></span>
                ناوەڕۆکی کورمانجی
              </div>
              <div class="fields-grid">
                <div class="field-grp field-grp--full">
                  <label class="lbl lbl--req">Navnîşan (Kurmancî)</label>
                  <input v-model="form.kmrContent.title" class="inp" placeholder="Navnîşana fîlimê…" />
                  <p v-if="errors.kmrTitle" class="field-err">{{ errors.kmrTitle }}</p>
                </div>
                <div class="field-grp field-grp--full">
                  <label class="lbl">Danasîn (Kurmancî)</label>
                  <textarea v-model="form.kmrContent.description" class="inp inp--ta" rows="4" placeholder="Danasîna fîlimê…"></textarea>
                </div>
                <div class="field-grp">
                  <label class="lbl">Mijar</label>
                  <input v-model="form.kmrContent.topic" class="inp" placeholder="Mijara fîlimê…" />
                </div>
                <div class="field-grp">
                  <label class="lbl">Cih</label>
                  <input v-model="form.kmrContent.location" class="inp" placeholder="Cihê tomarkirin…" />
                </div>
                <div class="field-grp">
                  <label class="lbl">Derhêner</label>
                  <input v-model="form.kmrContent.director" class="inp" placeholder="Navê derhêner…" />
                </div>
                <div class="field-grp">
                  <label class="lbl">Hilberîner</label>
                  <input v-model="form.kmrContent.producer" class="inp" placeholder="Navê hilberîner…" />
                </div>
              </div>
            </div>
          </Transition>

        </div>
      </section>

      <!-- ═══════════════════════════════
           SECTION 3 — FILM METADATA
      ═══════════════════════════════ -->
      <section class="card">
        <div class="card__hd">
          <span class="card__ico card__ico--meta">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </span>
          <div>
            <h2 class="card__title">زانیاری فیلم</h2>
            <p class="card__sub">جۆر، کات، ڕیزەڵوشن و زانیاری تەکنیکی</p>
          </div>
        </div>

        <div class="fields-grid">

          <div class="field-grp">
            <label class="lbl lbl--req">جۆری فیلم (Film Type)</label>
            <div class="select-wrap">
              <select v-model="form.filmType" class="inp inp--sel">
                <option value="">جۆر هەڵبژێرە…</option>
                <option v-for="ft in filmTypes" :key="ft" :value="ft">{{ ft }}</option>
              </select>
              <svg class="select-wrap__ico" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
            </div>
            <!-- custom filmType input -->
            <input v-if="form.filmType === '__custom__'" v-model="customFilmType" class="inp" style="margin-top:.5rem" placeholder="جۆری تایبەتی بنووسە…" />
            <p v-if="errors.filmType" class="field-err">{{ errors.filmType }}</p>
          </div>

          <div class="field-grp">
            <label class="lbl">فۆرماتی فایل</label>
            <div class="select-wrap">
              <select v-model="form.fileFormat" class="inp inp--sel">
                <option value="">هەڵبژێرە…</option>
                <option v-for="ff in fileFormats" :key="ff" :value="ff">{{ ff }}</option>
              </select>
              <svg class="select-wrap__ico" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
            </div>
          </div>

          <div class="field-grp">
            <label class="lbl">کاتی فیلم (چرکە)</label>
            <div class="dur-row">
              <input v-model.number="durH" type="number" min="0" class="inp inp--num" placeholder="کاتژمێر" @input="syncDur" />
              <span class="dur-sep">:</span>
              <input v-model.number="durM" type="number" min="0" max="59" class="inp inp--num" placeholder="خولەک" @input="syncDur" />
              <span class="dur-sep">:</span>
              <input v-model.number="durS" type="number" min="0" max="59" class="inp inp--num" placeholder="چرکە" @input="syncDur" />
            </div>
            <p class="field-hint">{{ form.durationSeconds ? fmtSeconds(form.durationSeconds) : '—' }}</p>
          </div>

          <div class="field-grp">
            <label class="lbl">بەرواری بڵاوکردن</label>
            <input v-model="form.publishmentDate" type="date" class="inp" />
          </div>

          <div class="field-grp">
            <label class="lbl">ڕیزەڵوشن</label>
            <div class="select-wrap">
              <select v-model="form.resolution" class="inp inp--sel">
                <option value="">هەڵبژێرە…</option>
                <option v-for="r in resolutions" :key="r" :value="r">{{ r }}</option>
              </select>
              <svg class="select-wrap__ico" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
            </div>
          </div>

          <div class="field-grp">
            <label class="lbl">قەبارەی فایل (MB)</label>
            <input v-model.number="form.fileSizeMb" type="number" min="0" step="0.1" class="inp" placeholder="0.0" />
          </div>

        </div>
      </section>

      <!-- ═══════════════════════════════
           SECTION 4 — TAGS & KEYWORDS
      ═══════════════════════════════ -->
      <section class="card">
        <div class="card__hd">
          <span class="card__ico card__ico--tags">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/>
              <line x1="7" y1="7" x2="7.01" y2="7"/>
            </svg>
          </span>
          <div>
            <h2 class="card__title">تاگ و کیووەردەکان</h2>
            <p class="card__sub">بۆ گەڕان و پۆلێنکردن بەکاربێن</p>
          </div>
        </div>

        <div class="tags-grid">

          <!-- CKB Tags -->
          <div class="tag-section" v-if="form.contentLanguages.includes('CKB')">
            <label class="lbl">
              <span class="lang-pip lang-pip--ckb"></span>
              تاگەکانی سۆرانی
            </label>
            <div class="tag-input-row">
              <input v-model="tagInput.ckb" class="inp" placeholder="تاگ بنووسە + Enter" @keydown.enter.prevent="addTag('ckb')" />
              <button class="add-btn" type="button" @click="addTag('ckb')">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              </button>
            </div>
            <div class="chips">
              <span v-for="t in form.tagsCkb" :key="t" class="chip chip--tag">
                {{ t }}
                <button type="button" @click="removeTag('ckb', t)">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </span>
              <span v-if="!form.tagsCkb.length" class="chips__empty">هیچ تاگێک نییە</span>
            </div>
          </div>

          <!-- KMR Tags -->
          <div class="tag-section" v-if="form.contentLanguages.includes('KMR')">
            <label class="lbl">
              <span class="lang-pip lang-pip--kmr"></span>
              Tagên Kurmancî
            </label>
            <div class="tag-input-row">
              <input v-model="tagInput.kmr" class="inp" placeholder="Tagekê binivîse + Enter" @keydown.enter.prevent="addTag('kmr')" />
              <button class="add-btn" type="button" @click="addTag('kmr')">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              </button>
            </div>
            <div class="chips">
              <span v-for="t in form.tagsKmr" :key="t" class="chip chip--tag">
                {{ t }}
                <button type="button" @click="removeTag('kmr', t)">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </span>
              <span v-if="!form.tagsKmr.length" class="chips__empty">Tu tag nîne</span>
            </div>
          </div>

          <!-- CKB Keywords -->
          <div class="tag-section" v-if="form.contentLanguages.includes('CKB')">
            <label class="lbl">
              <span class="lang-pip lang-pip--ckb"></span>
              کیووەردەکانی سۆرانی
            </label>
            <div class="tag-input-row">
              <input v-model="kwInput.ckb" class="inp" placeholder="کیووەرد بنووسە + Enter" @keydown.enter.prevent="addKw('ckb')" />
              <button class="add-btn add-btn--kw" type="button" @click="addKw('ckb')">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              </button>
            </div>
            <div class="chips">
              <span v-for="k in form.keywordsCkb" :key="k" class="chip chip--kw">
                {{ k }}
                <button type="button" @click="removeKw('ckb', k)">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </span>
              <span v-if="!form.keywordsCkb.length" class="chips__empty">هیچ کیووەردێک نییە</span>
            </div>
          </div>

          <!-- KMR Keywords -->
          <div class="tag-section" v-if="form.contentLanguages.includes('KMR')">
            <label class="lbl">
              <span class="lang-pip lang-pip--kmr"></span>
              Peyvên sereke Kurmancî
            </label>
            <div class="tag-input-row">
              <input v-model="kwInput.kmr" class="inp" placeholder="Peyvekê binivîse + Enter" @keydown.enter.prevent="addKw('kmr')" />
              <button class="add-btn add-btn--kw" type="button" @click="addKw('kmr')">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              </button>
            </div>
            <div class="chips">
              <span v-for="k in form.keywordsKmr" :key="k" class="chip chip--kw">
                {{ k }}
                <button type="button" @click="removeKw('kmr', k)">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </span>
              <span v-if="!form.keywordsKmr.length" class="chips__empty">Tu peyv nîne</span>
            </div>
          </div>

        </div>
      </section>

      <!-- ── BOTTOM ACTIONS ── -->
      <div class="bottom-acts">
        <RouterLink class="btn btn--ghost" to="/admin/films">هەڵوەشاندنەوە</RouterLink>
        <button class="btn btn--primary" :disabled="saving" @click="submit">
          <span v-if="saving" class="spinner"></span>
          {{ saving ? 'پاشەکەوتکردن…' : (isEdit ? 'نوێکردنەوە' : 'تۆمارکردن') }}
        </button>
      </div>

    </div>

  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/api.js'

const route  = useRoute()
const router = useRouter()
const isEdit = computed(() => !!route.params.id)

/* ── State ── */
const loading = ref(false)
const saving  = ref(false)
const toast   = ref({ show: false, type: 'success', msg: '' })
const errors  = reactive({})

const coverInput = ref(null)
const filmInput  = ref(null)
const coverFile  = ref(null)
const filmFile   = ref(null)
const coverPreview = ref('')

const srcType = ref('upload') // upload | direct | embed | external
const srcTypes = [
  { key: 'upload',   icon: '⬆', label: 'ئەپلۆد'   },
  { key: 'direct',   icon: '🔗', label: 'Direct URL' },
  { key: 'embed',    icon: '▶',  label: 'Embed'     },
  { key: 'external', icon: '🌐', label: 'External'  },
]

const filmTypes   = ['DOCUMENTARY','SHORT','FEATURE','ANIMATION','SERIES','REPORT','EDUCATIONAL','OTHER','__custom__']
const fileFormats = ['MP4','MKV','MOV','AVI','WEBM','FLV','WMV']
const resolutions = ['360p','480p','720p','1080p','1440p','4K','8K']

const customFilmType = ref('')

/* Duration helpers */
const durH = ref(0)
const durM = ref(0)
const durS = ref(0)
const syncDur = () => { form.durationSeconds = (Number(durH.value||0)*3600) + (Number(durM.value||0)*60) + Number(durS.value||0) }

/* Tag / keyword inputs */
const tagInput = reactive({ ckb: '', kmr: '' })
const kwInput  = reactive({ ckb: '', kmr: '' })

/* ── Form ── */
const emptyContent = () => ({ title:'', description:'', topic:'', location:'', director:'', producer:'' })
const form = reactive({
  coverUrl:          '',
  sourceUrl:         '',
  sourceExternalUrl: '',
  sourceEmbedUrl:    '',
  filmType:          '',
  fileFormat:        '',
  durationSeconds:   null,
  publishmentDate:   '',
  resolution:        '',
  fileSizeMb:        null,
  contentLanguages:  ['CKB'],
  ckbContent:        emptyContent(),
  kmrContent:        emptyContent(),
  tagsCkb:           [],
  tagsKmr:           [],
  keywordsCkb:       [],
  keywordsKmr:       [],
})

const bestTitle = computed(() => form.ckbContent.title || form.kmrContent.title || '')

/* ── Load for edit ── */
onMounted(async () => {
  if (!isEdit.value) return
  loading.value = true
  try {
    const { data } = await api.get(`/api/v1/films`, { params: { page: 0, size: 1000 } })
    const films = data?.content ?? []
    const found = films.find(f => String(f.id) === String(route.params.id))
    if (!found) throw new Error('فیلمەکە نەدۆزرایەوە')
    fillForm(found)
  } catch (e) {
    showToast('error', e.message || 'هەڵەیەک ڕوویدا لە بارکردندا')
  } finally { loading.value = false }
})

const fillForm = (d) => {
  form.coverUrl          = d.coverUrl          || ''
  form.sourceUrl         = d.sourceUrl         || ''
  form.sourceExternalUrl = d.sourceExternalUrl || ''
  form.sourceEmbedUrl    = d.sourceEmbedUrl    || ''
  form.filmType          = d.filmType          || ''
  form.fileFormat        = d.fileFormat        || ''
  form.durationSeconds   = d.durationSeconds   || null
  form.publishmentDate   = d.publishmentDate   || ''
  form.resolution        = d.resolution        || ''
  form.fileSizeMb        = d.fileSizeMb        || null
  form.contentLanguages  = d.contentLanguages  ? [...d.contentLanguages] : ['CKB']
  form.ckbContent        = d.ckbContent ? { ...emptyContent(), ...d.ckbContent } : emptyContent()
  form.kmrContent        = d.kmrContent ? { ...emptyContent(), ...d.kmrContent } : emptyContent()
  form.tagsCkb           = d.tagsCkb           ? [...d.tagsCkb]    : []
  form.tagsKmr           = d.tagsKmr           ? [...d.tagsKmr]    : []
  form.keywordsCkb       = d.keywordsCkb       ? [...d.keywordsCkb]: []
  form.keywordsKmr       = d.keywordsKmr       ? [...d.keywordsKmr]: []
  if (d.coverUrl) coverPreview.value = d.coverUrl
  if (d.durationSeconds) {
    const s = d.durationSeconds
    durH.value = Math.floor(s/3600)
    durM.value = Math.floor((s%3600)/60)
    durS.value = Math.floor(s%60)
  }
  // detect srcType
  if (d.sourceUrl)         srcType.value = 'direct'
  else if (d.sourceEmbedUrl)    srcType.value = 'embed'
  else if (d.sourceExternalUrl) srcType.value = 'external'
  else                          srcType.value = 'upload'
}

/* ── File handlers ── */
const onCoverFile = (e) => {
  const f = e.target.files[0]; if (!f) return
  coverFile.value    = f
  form.coverUrl      = ''
  coverPreview.value = URL.createObjectURL(f)
}
const onCoverDrop = (e) => {
  const f = e.dataTransfer.files[0]; if (!f || !f.type.startsWith('image/')) return
  coverFile.value    = f
  form.coverUrl      = ''
  coverPreview.value = URL.createObjectURL(f)
}
const clearCoverFile = () => { coverFile.value = null; coverPreview.value = ''; if (coverInput.value) coverInput.value.value = '' }

const onFilmFile = (e) => { const f = e.target.files[0]; if (f) filmFile.value = f }
const onFilmDrop = (e) => { const f = e.dataTransfer.files[0]; if (f) filmFile.value = f }
const clearFilmFile  = () => { filmFile.value = null; if (filmInput.value) filmInput.value.value = '' }

/* ── Tags / keywords ── */
const addTag    = (lang) => { const v = tagInput[lang].trim(); if (!v||form[`tags${lang==='ckb'?'Ckb':'Kmr'}`].includes(v)) return; form[`tags${lang==='ckb'?'Ckb':'Kmr'}`].push(v); tagInput[lang]='' }
const removeTag = (lang, t) => { const k = `tags${lang==='ckb'?'Ckb':'Kmr'}`; form[k] = form[k].filter(x=>x!==t) }
const addKw     = (lang) => { const v = kwInput[lang].trim(); if (!v||form[`keywords${lang==='ckb'?'Ckb':'Kmr'}`].includes(v)) return; form[`keywords${lang==='ckb'?'Ckb':'Kmr'}`].push(v); kwInput[lang]='' }
const removeKw  = (lang, k) => { const key = `keywords${lang==='ckb'?'Ckb':'Kmr'}`; form[key] = form[key].filter(x=>x!==k) }

/* ── Validation ── */
const validate = () => {
  Object.keys(errors).forEach(k => delete errors[k])
  let ok = true
  if (!form.filmType && !customFilmType.value) { errors.filmType = 'جۆری فیلم داواکراوە'; ok = false }
  if (form.contentLanguages.includes('CKB') && !form.ckbContent.title.trim()) { errors.ckbTitle = 'ناونیشانی سۆرانی داواکراوە'; ok = false }
  if (form.contentLanguages.includes('KMR') && !form.kmrContent.title.trim()) { errors.kmrTitle = 'Navnîşana Kurmancî pêwîst e'; ok = false }
  if (!form.contentLanguages.length) { errors.lang = 'لانیکەم یەک زمان هەڵبژێرە'; ok = false }
  return ok
}

/* ── Submit ── */
const submit = async () => {
  if (!validate()) { showToast('error', 'تکایە خانەی پێویست پڕبکەوە'); return }
  saving.value = true

  const dto = {
    coverUrl:          coverFile.value ? null : (form.coverUrl || null),
    filmType:          form.filmType === '__custom__' ? customFilmType.value.trim() : (form.filmType || null),
    fileFormat:        form.fileFormat    || null,
    durationSeconds:   form.durationSeconds || null,
    publishmentDate:   form.publishmentDate || null,
    resolution:        form.resolution    || null,
    fileSizeMb:        form.fileSizeMb    || null,
    sourceUrl:         srcType.value === 'direct'   ? (form.sourceUrl         || null) : null,
    sourceEmbedUrl:    srcType.value === 'embed'    ? (form.sourceEmbedUrl    || null) : null,
    sourceExternalUrl: srcType.value === 'external' ? (form.sourceExternalUrl || null) : null,
    contentLanguages:  form.contentLanguages,
    ckbContent:        form.contentLanguages.includes('CKB') ? cleanContent(form.ckbContent) : null,
    kmrContent:        form.contentLanguages.includes('KMR') ? cleanContent(form.kmrContent) : null,
    tagsCkb:           form.contentLanguages.includes('CKB') ? [...form.tagsCkb]     : [],
    tagsKmr:           form.contentLanguages.includes('KMR') ? [...form.tagsKmr]     : [],
    keywordsCkb:       form.contentLanguages.includes('CKB') ? [...form.keywordsCkb] : [],
    keywordsKmr:       form.contentLanguages.includes('KMR') ? [...form.keywordsKmr] : [],
  }

  const fd = new FormData()
  fd.append('data', JSON.stringify(dto))
  if (coverFile.value)                            fd.append('cover', coverFile.value)
  if (filmFile.value && srcType.value === 'upload') fd.append('film',  filmFile.value)

  try {
    if (isEdit.value) {
      await api.put(`/api/v1/films/${route.params.id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
    } else {
      await api.post('/api/v1/films', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
    }
    showToast('success', isEdit.value ? 'فیلمەکە نوێکرایەوە ✓' : 'فیلمی نوێ تۆمارکرا ✓')
    setTimeout(() => router.push('/admin/films'), 1200)
  } catch (e) {
    showToast('error', e?.response?.data?.message || e.message || 'هەڵەیەک ڕوویدا')
  } finally { saving.value = false }
}

const cleanContent = (c) => {
  const out = {}
  Object.entries(c).forEach(([k,v]) => { if (v && v.trim()) out[k] = v.trim() })
  return Object.keys(out).length ? out : null
}

const fmtSeconds = (s) => {
  if (!s) return '—'
  const h=Math.floor(s/3600), m=Math.floor((s%3600)/60), ss=Math.floor(s%60)
  const p=(x)=>String(x).padStart(2,'0')
  return h>0 ? `${h}:${p(m)}:${p(ss)}` : `${m}:${p(ss)}`
}
const fmtBytes = (b) => {
  if (!b) return '0 B'
  const u=['B','KB','MB','GB']; let i=0,v=b
  while(v>=1024&&i<u.length-1){v/=1024;i++}
  return `${v.toFixed(v>=10||i===0?0:1)} ${u[i]}`
}
const showToast = (type,msg) => { toast.value={show:true,type,msg}; setTimeout(()=>{toast.value.show=false},3800) }
</script>

<style scoped>
.editor { direction:rtl; max-width:980px; margin:0 auto; padding-bottom:3rem; }
.editor__head { display:flex; align-items:center; gap:1rem; margin-bottom:1.75rem; flex-wrap:wrap; }
.editor__title { font-size:1.45rem; font-weight:800; color:var(--text); margin:0; }
.editor__sub   { font-size:.82rem; color:var(--muted); margin:.15rem 0 0; }

.back-btn { display:inline-flex; align-items:center; gap:.4rem; color:var(--muted); text-decoration:none; font-size:.85rem; font-weight:600; padding:.45rem .8rem; border-radius:9px; border:1px solid var(--border); background:var(--white); transition:var(--transition); flex-shrink:0; }
.back-btn:hover { border-color:var(--crimson); color:var(--crimson); }

.btn { display:inline-flex; align-items:center; gap:.45rem; padding:.65rem 1.25rem; border-radius:var(--radius-sm); font-weight:700; font-size:.87rem; cursor:pointer; border:1px solid transparent; transition:var(--transition); text-decoration:none; white-space:nowrap; font-family:inherit; }
.btn--primary { background:var(--crimson); color:#fff; box-shadow:0 6px 20px rgba(140,21,21,.22); margin-right:auto; }
.btn--primary:hover { background:var(--crimson-lt); transform:translateY(-1px); }
.btn--ghost { background:transparent; border-color:var(--border); color:var(--text); }
.btn--ghost:hover { border-color:var(--crimson); color:var(--crimson); }
.btn:disabled { opacity:.5; cursor:not-allowed; transform:none!important; }
.spinner { width:13px; height:13px; border:2px solid rgba(255,255,255,.35); border-top-color:#fff; border-radius:50%; animation:spin .65s linear infinite; }
@keyframes spin { to { transform:rotate(360deg) } }

.toast { display:flex; align-items:center; gap:.65rem; padding:.75rem 1.1rem; border-radius:var(--radius-sm); font-weight:600; font-size:.87rem; margin-bottom:1rem; }
.toast--success { background:rgba(22,120,70,.09); border:1px solid rgba(22,120,70,.22); color:#166044; }
.toast--error   { background:rgba(140,21,21,.07); border:1px solid rgba(140,21,21,.18); color:var(--crimson); }
.slide-down-enter-active,.slide-down-leave-active { transition:.3s ease }
.slide-down-enter-from,.slide-down-leave-to { opacity:0; transform:translateY(-8px) }

.skeletons { display:flex; flex-direction:column; gap:.9rem; }
.skel { height:120px; border-radius:var(--radius-md); background:linear-gradient(90deg,var(--cream-dk) 25%,#eae8e4 50%,var(--cream-dk) 75%); background-size:200% 100%; animation:shimmer 1.4s ease infinite; }
@keyframes shimmer { 0%{background-position:200% 0}100%{background-position:-200% 0} }

.editor__body { display:flex; flex-direction:column; gap:1.25rem; }

/* Cards */
.card { background:var(--white); border:1px solid var(--border); border-radius:var(--radius-md); overflow:hidden; box-shadow:var(--shadow-sm); }
.card__hd { display:flex; align-items:center; gap:1rem; padding:1.25rem 1.5rem; border-bottom:1px solid var(--cream-dk); background:var(--cream-dk); }
.card__ico { width:40px; height:40px; border-radius:11px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.card__ico--media { background:rgba(140,21,21,.09); color:#8c1515; border:1px solid rgba(140,21,21,.16); }
.card__ico--lang  { background:rgba(22,120,70,.09);  color:#166044; border:1px solid rgba(22,120,70,.18); }
.card__ico--meta  { background:rgba(40,90,220,.09);  color:#1a47a0; border:1px solid rgba(40,90,220,.18); }
.card__ico--tags  { background:rgba(200,168,0,.12);  color:#7a6200; border:1px solid rgba(200,168,0,.22); }
.card__title { font-size:1rem; font-weight:800; color:var(--text); margin:0; }
.card__sub   { font-size:.78rem; color:var(--muted); margin:.15rem 0 0; }

/* Fields */
.fields-grid { display:grid; grid-template-columns:1fr 1fr; gap:1rem 1.25rem; padding:1.3rem 1.5rem; }
.field-grp { display:flex; flex-direction:column; gap:.4rem; }
.field-grp--full { grid-column:1/-1; }
.lbl { font-size:.82rem; font-weight:700; color:var(--text); display:flex; align-items:center; gap:.35rem; }
.lbl--req::after { content:'*'; color:var(--crimson); margin-right:.25rem; }
.inp { padding:.65rem .9rem; border:1.5px solid var(--border); border-radius:var(--radius-sm); background:var(--white); color:var(--text); font-size:.9rem; outline:none; transition:var(--transition); font-family:inherit; width:100%; box-sizing:border-box; }
.inp:focus { border-color:var(--crimson); box-shadow:0 0 0 3px rgba(140,21,21,.09); }
.inp:disabled { opacity:.45; cursor:not-allowed; }
.inp--ta  { resize:vertical; min-height:100px; line-height:1.7; }
.inp--sel { appearance:none; }
.inp--num { width:80px; text-align:center; }
.field-hint { font-size:.76rem; color:var(--muted); margin:0; display:flex; align-items:center; gap:.3rem; }
.field-err  { font-size:.76rem; color:var(--crimson); margin:0; font-weight:600; }

.select-wrap { position:relative; }
.select-wrap__ico { position:absolute; left:.75rem; top:50%; transform:translateY(-50%); pointer-events:none; color:var(--muted); }

.dur-row { display:flex; align-items:center; gap:.4rem; }
.dur-sep { font-weight:800; color:var(--muted); }

/* Media grid */
.media-grid { display:grid; grid-template-columns:1fr 1fr; gap:1.25rem; padding:1.3rem 1.5rem; }
@media (max-width:700px) { .media-grid { grid-template-columns:1fr; } .fields-grid { grid-template-columns:1fr; } }

.upload-zone__label { display:flex; align-items:center; gap:.4rem; font-size:.82rem; font-weight:700; color:var(--text); margin-bottom:.6rem; }
.upload-drop { display:flex; flex-direction:column; align-items:center; justify-content:center; gap:.4rem; min-height:130px; border:2px dashed var(--border); border-radius:12px; cursor:pointer; color:var(--muted); font-size:.85rem; transition:var(--transition); text-align:center; padding:1rem; }
.upload-drop:hover { border-color:var(--crimson); color:var(--crimson); background:rgba(140,21,21,.03); }
.upload-drop--film { background:rgba(80,40,160,.02); }
.upload-drop--film:hover { border-color:#5028a0; color:#5028a0; background:rgba(80,40,160,.03); }
.upload-drop small { font-size:.74rem; opacity:.65; }

.upload-preview { position:relative; border-radius:12px; overflow:hidden; cursor:pointer; aspect-ratio:16/10; border:2px solid var(--border); }
.upload-preview__img { width:100%; height:100%; object-fit:cover; display:block; }
.upload-preview__overlay { position:absolute; inset:0; background:rgba(0,0,0,.5); display:flex; align-items:center; justify-content:center; gap:.5rem; color:#fff; font-size:.82rem; font-weight:700; opacity:0; transition:.2s; }
.upload-preview:hover .upload-preview__overlay { opacity:1; }

.url-alt { display:flex; flex-direction:column; gap:.4rem; margin-top:.75rem; }
.url-alt__label { font-size:.74rem; font-weight:600; color:var(--muted); }
.clear-file-btn { display:inline-flex; align-items:center; gap:.3rem; font-size:.75rem; font-weight:700; color:var(--crimson); cursor:pointer; background:rgba(140,21,21,.05); border:1px solid rgba(140,21,21,.18); border-radius:7px; padding:.3rem .65rem; transition:.18s; font-family:inherit; }
.clear-file-btn:hover { background:var(--crimson); color:#fff; }

.hidden-input { display:none; }

.file-chosen { display:flex; align-items:center; gap:.5rem; padding:.7rem .9rem; background:rgba(80,40,160,.06); border:1.5px solid rgba(80,40,160,.18); border-radius:10px; }
.file-chosen__name { font-weight:700; font-size:.85rem; color:var(--text); flex:1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.file-chosen__size { font-size:.75rem; color:var(--muted); white-space:nowrap; }
.file-chosen__rm   { width:22px; height:22px; border-radius:50%; background:rgba(140,21,21,.08); border:1px solid rgba(140,21,21,.18); color:var(--crimson); cursor:pointer; display:flex; align-items:center; justify-content:center; flex-shrink:0; transition:.18s; padding:0; }
.file-chosen__rm:hover { background:var(--crimson); color:#fff; }

/* Source type tabs */
.src-tabs { display:flex; gap:.4rem; flex-wrap:wrap; margin-bottom:.8rem; }
.src-tab  { display:inline-flex; align-items:center; gap:.35rem; padding:.38rem .75rem; border-radius:8px; border:1.5px solid var(--border); background:var(--cream-dk); color:var(--muted); font-size:.8rem; font-weight:700; cursor:pointer; transition:.18s; font-family:inherit; }
.src-tab:hover  { border-color:var(--crimson); color:var(--crimson); }
.src-tab--on    { border-color:var(--crimson); background:rgba(140,21,21,.07); color:var(--crimson); }
.src-tab__ico   { font-size:.85rem; }

/* Languages */
.lang-toggles { display:flex; gap:.75rem; flex-wrap:wrap; padding:1.1rem 1.5rem 0; }
.lang-toggle  { display:inline-flex; align-items:center; gap:.55rem; padding:.65rem 1.1rem; border-radius:12px; border:2px solid var(--border); cursor:pointer; font-weight:700; font-size:.88rem; color:var(--muted); transition:.2s; user-select:none; }
.lang-toggle:hover  { border-color:var(--crimson); color:var(--text); }
.lang-toggle--on    { border-color:var(--crimson); color:var(--text); background:rgba(140,21,21,.04); }
.lang-toggle__pip   { width:10px; height:10px; border-radius:50%; }
.lang-toggle__pip--ckb { background:#c8a800; }
.lang-toggle__pip--kmr { background:#4a7af0; }
.lang-toggle__check { color:var(--crimson); font-size:.88rem; margin-right:auto; }

.lang-sections { display:flex; flex-direction:column; gap:.75rem; padding:1rem 1.5rem 1.5rem; }
.lang-section  { border-radius:14px; overflow:hidden; border:1.5px solid var(--border); }
.lang-section--ckb { border-color:rgba(200,168,0,.28); }
.lang-section--kmr { border-color:rgba(74,122,240,.28); }
.lang-section__hd  { display:flex; align-items:center; gap:.55rem; padding:.7rem 1.1rem; font-weight:800; font-size:.85rem; color:var(--text); }
.lang-section--ckb .lang-section__hd { background:rgba(200,168,0,.07); border-bottom:1px solid rgba(200,168,0,.2); }
.lang-section--kmr .lang-section__hd { background:rgba(74,122,240,.07); border-bottom:1px solid rgba(74,122,240,.18); }
.lang-section__pip      { width:10px; height:10px; border-radius:50%; }
.lang-section__pip--ckb { background:#c8a800; }
.lang-section__pip--kmr { background:#4a7af0; }
.lang-section .fields-grid { padding:.9rem 1rem 1rem; }

.section-slide-enter-active,.section-slide-leave-active { transition:all .32s cubic-bezier(.22,1,.36,1); }
.section-slide-enter-from,.section-slide-leave-to { opacity:0; transform:translateY(-12px); max-height:0; }

/* Tags */
.tags-grid { display:grid; grid-template-columns:1fr 1fr; gap:1.25rem; padding:1.3rem 1.5rem; }
@media (max-width:700px) { .tags-grid { grid-template-columns:1fr; } }
.tag-section { display:flex; flex-direction:column; gap:.55rem; }
.lang-pip     { width:8px; height:8px; border-radius:50%; display:inline-block; margin-left:.2rem; }
.lang-pip--ckb { background:#c8a800; }
.lang-pip--kmr { background:#4a7af0; }
.tag-input-row { display:flex; gap:.4rem; }
.tag-input-row .inp { flex:1; }
.add-btn { width:38px; height:38px; border-radius:var(--radius-sm); background:rgba(200,168,0,.12); border:1.5px solid rgba(200,168,0,.28); color:#7a6200; cursor:pointer; display:flex; align-items:center; justify-content:center; flex-shrink:0; transition:.18s; }
.add-btn:hover   { background:rgba(200,168,0,.22); }
.add-btn--kw     { background:rgba(40,90,220,.09); border-color:rgba(40,90,220,.22); color:#2848b0; }
.add-btn--kw:hover { background:rgba(40,90,220,.18); }
.chips { display:flex; flex-wrap:wrap; gap:.38rem; min-height:34px; }
.chip  { display:inline-flex; align-items:center; gap:.35rem; padding:.3rem .7rem; border-radius:8px; font-size:.82rem; font-weight:600; }
.chip button { width:16px; height:16px; border-radius:50%; display:flex; align-items:center; justify-content:center; cursor:pointer; border:none; transition:.15s; padding:0; }
.chip--tag { background:rgba(200,168,0,.11); color:#7a6200; border:1px solid rgba(200,168,0,.22); }
.chip--tag button { background:rgba(200,168,0,.2); color:#7a6200; }
.chip--tag button:hover { background:#c8a800; color:#fff; }
.chip--kw  { background:rgba(40,90,220,.08); color:#2848b0; border:1px solid rgba(40,90,220,.15); }
.chip--kw button { background:rgba(40,90,220,.14); color:#2848b0; }
.chip--kw button:hover { background:#4a7af0; color:#fff; }
.chips__empty { font-size:.78rem; color:var(--border); font-style:italic; padding:.15rem 0; }

/* Bottom acts */
.bottom-acts { display:flex; align-items:center; justify-content:flex-end; gap:.75rem; padding:1.1rem 0 .5rem; }
</style>