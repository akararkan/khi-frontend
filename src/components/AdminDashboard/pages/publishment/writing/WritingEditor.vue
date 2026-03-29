<template>
  <div class="wed" dir="rtl">
    <!-- Header -->
    <div class="wed__head">
      <RouterLink to="/admin/writings" class="wed__back">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5M12 5l-7 7 7 7"/>
        </svg>
        گەڕانەوە
      </RouterLink>
      <div>
        <h1 class="wed__title">{{ isEdit ? 'دەستکاری کتێب' : 'کتێبی نوێ' }}</h1>
        <p class="wed__sub" v-if="isEdit">ID: {{ route.params.id }}</p>
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
      <div class="wed__layout">

        <!-- ═══════════════ MAIN COLUMN ═══════════════ -->
        <div class="col-main">

          <!-- ── Book Genres (MULTI-SELECT checkboxes → Set<BookGenre>) ──────── -->
          <section class="card">
            <div class="card__hd">
              <span class="card__hd-ico">📖</span>
              <span class="card__hd-title">جۆرەکانی کتێب</span>
              <!-- live count badge -->
              <span class="card__hd-badge">
                {{ form.bookGenres.length ? form.bookGenres.length + ' هەڵبژێردراو' : 'هیچ' }}
              </span>
            </div>

            <!-- Selected genre pills — shown above the grid for quick overview -->
            <TransitionGroup
              v-if="form.bookGenres.length"
              name="genre-selected"
              tag="div"
              class="genre-selected-pills"
            >
              <div v-for="gVal in form.bookGenres" :key="gVal" class="genre-selected-pill">
                <span class="genre-selected-pill__icon">{{ genreMap[gVal]?.icon }}</span>
                <div class="genre-selected-pill__info">
                  <span class="genre-selected-pill__label">{{ genreMap[gVal]?.label }}</span>
                  <span class="genre-selected-pill__en">{{ genreMap[gVal]?.en }}</span>
                </div>
                <button
                  type="button"
                  class="genre-selected-pill__clear"
                  @click="toggleGenre(gVal)"
                  :title="'سڕینەوەی ' + genreMap[gVal]?.label"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
            </TransitionGroup>

            <!-- Genre groups — each genre is a toggle checkbox card -->
            <div class="genre-groups">
              <div v-for="group in genreGroups" :key="group.label" class="genre-group">
                <div class="genre-group__label">{{ group.label }}</div>
                <div class="genre-grid">
                  <label
                    v-for="g in group.genres"
                    :key="g.value"
                    class="genre-card"
                    :class="{
                      'genre-card--active': form.bookGenres.includes(g.value),
                      [`genre-card--${g.color}`]: true,
                    }"
                    :title="g.en"
                  >
                    <!-- Hidden checkbox — the label IS the click target -->
                    <input
                      type="checkbox"
                      :value="g.value"
                      :checked="form.bookGenres.includes(g.value)"
                      @change="toggleGenre(g.value)"
                      class="genre-card__input"
                    />
                    <!-- Check indicator -->
                    <span v-if="form.bookGenres.includes(g.value)" class="genre-card__check">✓</span>
                    <span class="genre-card__icon">{{ g.icon }}</span>
                    <span class="genre-card__label">{{ g.label }}</span>
                  </label>
                </div>
              </div>
            </div>

            <div v-if="errors.bookGenres" class="err">{{ errors.bookGenres }}</div>
          </section>

          <!-- ── Publishment Topic ──────────────────────────────── -->
          <section class="card">
            <div class="card__hd">
              <span class="card__hd-ico">🏷️</span>
              <span class="card__hd-title">بابەت (Topic)</span>
            </div>

            <div class="state-picks">
              <label class="state-pick" :class="{ 'state-pick--on': topicMode === 'none' }">
                <input type="radio" value="none" v-model="topicMode" />
                بێ بابەت
              </label>
              <label class="state-pick" :class="{ 'state-pick--on': topicMode === 'existing' }">
                <input type="radio" value="existing" v-model="topicMode" />
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/>
                  <line x1="7" y1="7" x2="7.01" y2="7"/>
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
                <div class="spinner spinner--dark"></div>
                <span>بابەتەکان بارکردن…</span>
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
              <div v-if="errors.newTopic" class="err">{{ errors.newTopic }}</div>
            </div>

            <div v-if="isEdit && topicMode === 'existing'" style="margin-top:.75rem">
              <label class="lang-pick" :class="{ 'lang-pick--on': form.clearTopic }">
                <input type="checkbox" v-model="form.clearTopic" />
                <span>سڕینەوەی بابەتی ئێستا</span>
              </label>
            </div>
          </section>

          <!-- ── Languages ──────────────────────────────────────────────────── -->
          <section class="card">
            <div class="card__hd">
              <span class="card__hd-ico">🌐</span>
              <span class="card__hd-title">زمانەکان</span>
            </div>
            <div class="lang-picks">
              <label class="lang-pick" :class="{ 'lang-pick--on': form.contentLanguages.includes('CKB') }">
                <input type="checkbox" value="CKB" v-model="form.contentLanguages" />
                <span class="lang-pick__flag">🟡</span>
                <div class="lang-pick__info">
                  <span class="lang-pick__name">سۆرانی</span>
                  <span class="lang-pick__code">CKB</span>
                </div>
              </label>
              <label class="lang-pick" :class="{ 'lang-pick--on': form.contentLanguages.includes('KMR') }">
                <input type="checkbox" value="KMR" v-model="form.contentLanguages" />
                <span class="lang-pick__flag">🔵</span>
                <div class="lang-pick__info">
                  <span class="lang-pick__name">کورمانجی</span>
                  <span class="lang-pick__code">KMR</span>
                </div>
              </label>
            </div>
            <div v-if="errors.contentLanguages" class="err">{{ errors.contentLanguages }}</div>
          </section>

          <!-- ── Bilingual Content ───────────────────────────────────────────── -->
          <section class="card" v-if="form.contentLanguages.length">
            <div class="tabs">
              <button v-for="lang in form.contentLanguages" :key="lang" type="button"
                class="tab" :class="{ 'tab--on': activeLang === lang }" @click="activeLang = lang">
                <span class="tab__pip" :class="`tab__pip--${lang.toLowerCase()}`"></span>
                {{ lang === 'CKB' ? 'سۆرانی' : 'کورمانجی' }}
              </button>
            </div>

            <div v-show="activeLang === 'CKB'" class="tab-panel">
              <div class="field">
                <label class="lbl lbl--req">ناونیشان (سۆرانی)</label>
                <input v-model="form.ckbContent.title" class="inp" placeholder="ناونیشانی کتێب…" />
              </div>
              <div class="field">
                <label class="lbl">وەسف (سۆرانی)</label>
                <textarea v-model="form.ckbContent.description" class="inp ta" rows="4"></textarea>
              </div>
              <div class="two-grid">
                <div class="field">
                  <label class="lbl">نووسەر (سۆرانی)</label>
                  <input v-model="form.ckbContent.writer" class="inp" />
                </div>
                <div class="field">
                  <label class="lbl">جۆر / Genre (سۆرانی)</label>
                  <input v-model="form.ckbContent.genre" class="inp" placeholder="بۆ نموونە: ڕۆمان، شیعر…" />
                </div>
              </div>
              <div class="field">
                <label class="lbl">نیشانەکان (سۆرانی)</label>
                <TagInput v-model="form.tagsCkb" placeholder="نیشانەی نوێ" color="gold" />
              </div>
              <div class="field">
                <label class="lbl">کلیلەوشەکان (سۆرانی)</label>
                <TagInput v-model="form.keywordsCkb" placeholder="کلیلەوشەی نوێ" color="blue" />
              </div>
            </div>

            <div v-show="activeLang === 'KMR'" class="tab-panel">
              <div class="field">
                <label class="lbl lbl--req">ناونیشان (کورمانجی)</label>
                <input v-model="form.kmrContent.title" class="inp" placeholder="Sernavê kitêbê…" />
              </div>
              <div class="field">
                <label class="lbl">وەسف (کورمانجی)</label>
                <textarea v-model="form.kmrContent.description" class="inp ta" rows="4"></textarea>
              </div>
              <div class="two-grid">
                <div class="field">
                  <label class="lbl">نووسەر (کورمانجی)</label>
                  <input v-model="form.kmrContent.writer" class="inp" />
                </div>
                <div class="field">
                  <label class="lbl">جۆر / Genre (کورمانجی)</label>
                  <input v-model="form.kmrContent.genre" class="inp" placeholder="Mînak: Roman, Helbest…" />
                </div>
              </div>
              <div class="field">
                <label class="lbl">نیشانەکان (کورمانجی)</label>
                <TagInput v-model="form.tagsKmr" placeholder="Tag nû" color="gold" />
              </div>
              <div class="field">
                <label class="lbl">کلیلەوشەکان (کورمانجی)</label>
                <TagInput v-model="form.keywordsKmr" placeholder="Keyword nû" color="blue" />
              </div>
            </div>

            <div v-if="errors.titles" class="err">{{ errors.titles }}</div>
          </section>

          <!-- ── Book Files ──────────────────────────────────────────────────── -->
          <section class="card">
            <div class="card__hd">
              <span class="card__hd-ico">📄</span>
              <span class="card__hd-title">فایلەکانی کتێب</span>
            </div>

            <div class="file-lang-tabs">
              <button v-for="lang in form.contentLanguages" :key="lang" type="button"
                class="file-lang-tab" :class="{ 'file-lang-tab--on': fileActiveLang === lang }"
                @click="fileActiveLang = lang">
                {{ lang === 'CKB' ? 'فایلی سۆرانی' : 'فایلی کورمانجی' }}
              </button>
            </div>

            <!-- CKB File -->
            <div v-show="fileActiveLang === 'CKB'" class="tab-panel">
              <div class="file-upload-section">
                <div v-if="ckbFilePreview" class="file-preview-box">
                  <div class="file-preview-box__icon">📄</div>
                  <div class="file-preview-box__info">
                    <div class="file-preview-box__name">{{ ckbFilePreview.name }}</div>
                    <div class="file-preview-box__size">{{ fmtBytes(ckbFilePreview.size) }}</div>
                  </div>
                  <button type="button" class="file-preview-box__remove" @click="removeCkbFile">✕</button>
                </div>
                <label v-else class="upload-zone upload-zone--file">
                  <input type="file" accept=".pdf,.doc,.docx,.txt,.epub" @change="onCkbFile" style="display:none;" />
                  <div class="upload-zone__inner">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                    </svg>
                    <span class="upload-zone__title">فایلی کتێب باربکە</span>
                    <span class="upload-zone__hint">PDF, DOCX, TXT, EPUB</span>
                  </div>
                </label>
                <div class="field mt-3">
                  <label class="lbl">یان لینکی فایل</label>
                  <input v-model="form.ckbContent.fileUrl" class="inp" :disabled="!!ckbBookFile" />
                </div>
                <div class="two-grid mt-3">
                  <div class="field">
                    <label class="lbl">فۆرمات</label>
                    <select v-model="form.ckbContent.fileFormat" class="inp">
                      <option value="">هەڵبژێرە</option>
                      <option value="PDF">PDF</option>
                      <option value="DOCX">DOCX</option>
                      <option value="EPUB">EPUB</option>
                      <option value="OTHER">یتر</option>
                    </select>
                  </div>
                  <div class="field">
                    <label class="lbl">ژمارەی پەڕەکان</label>
                    <input v-model.number="form.ckbContent.pageCount" type="number" class="inp" min="1" />
                  </div>
                </div>
              </div>
            </div>

            <!-- KMR File -->
            <div v-show="fileActiveLang === 'KMR'" class="tab-panel">
              <div class="file-upload-section">
                <div v-if="kmrFilePreview" class="file-preview-box">
                  <div class="file-preview-box__icon">📄</div>
                  <div class="file-preview-box__info">
                    <div class="file-preview-box__name">{{ kmrFilePreview.name }}</div>
                    <div class="file-preview-box__size">{{ fmtBytes(kmrFilePreview.size) }}</div>
                  </div>
                  <button type="button" class="file-preview-box__remove" @click="removeKmrFile">✕</button>
                </div>
                <label v-else class="upload-zone upload-zone--file">
                  <input type="file" accept=".pdf,.doc,.docx,.txt,.epub" @change="onKmrFile" style="display:none;" />
                  <div class="upload-zone__inner">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                    </svg>
                    <span class="upload-zone__title">فایلی کتێب باربکە</span>
                    <span class="upload-zone__hint">PDF, DOCX, TXT, EPUB</span>
                  </div>
                </label>
                <div class="field mt-3">
                  <label class="lbl">یان لینکی فایل</label>
                  <input v-model="form.kmrContent.fileUrl" class="inp" :disabled="!!kmrBookFile" />
                </div>
                <div class="two-grid mt-3">
                  <div class="field">
                    <label class="lbl">فۆرمات</label>
                    <select v-model="form.kmrContent.fileFormat" class="inp">
                      <option value="">هەڵبژێرە</option>
                      <option value="PDF">PDF</option>
                      <option value="DOCX">DOCX</option>
                      <option value="EPUB">EPUB</option>
                      <option value="OTHER">یتر</option>
                    </select>
                  </div>
                  <div class="field">
                    <label class="lbl">ژمارەی پەڕەکان</label>
                    <input v-model.number="form.kmrContent.pageCount" type="number" class="inp" min="1" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- ── Series Management ───────────────────────────────────────────── -->
          <section class="card">
            <div class="card__hd">
              <span class="card__hd-ico">⭐</span>
              <span class="card__hd-title">سەری کتێب</span>
            </div>

            <div class="series-modes">
              <label class="series-mode" :class="{ 'series-mode--on': form.seriesMode === 'standalone' }">
                <input type="radio" value="standalone" v-model="form.seriesMode" />
                <div class="series-mode__icon">📕</div>
                <div class="series-mode__info">
                  <span class="series-mode__title">تاک کتێب</span>
                </div>
              </label>
              <label class="series-mode" :class="{ 'series-mode--on': form.seriesMode === 'new-series' }">
                <input type="radio" value="new-series" v-model="form.seriesMode" />
                <div class="series-mode__icon">📚</div>
                <div class="series-mode__info">
                  <span class="series-mode__title">سەری نوێ</span>
                </div>
              </label>
              <label class="series-mode" :class="{ 'series-mode--on': form.seriesMode === 'add-to-series' }">
                <input type="radio" value="add-to-series" v-model="form.seriesMode" />
                <div class="series-mode__icon">➕</div>
                <div class="series-mode__info">
                  <span class="series-mode__title">زیادکردن بە سەر</span>
                </div>
              </label>
            </div>

            <div v-if="form.seriesMode === 'new-series'" class="series-form">
              <div class="field">
                <label class="lbl lbl--req">ناوی سەری</label>
                <input v-model="form.seriesName" class="inp" />
              </div>
            </div>

            <div v-if="form.seriesMode === 'add-to-series'" class="series-form">
              <div class="field">
                <label class="lbl lbl--req">سەری پاڵپشتوو</label>
                <select v-model.number="form.parentBookId" class="inp">
                  <option value="">هەڵبژێرە…</option>
                  <option v-for="book in seriesParents" :key="book.id" :value="book.id">
                    {{ book.ckbContent?.title || book.kmrContent?.title || `کتێب #${book.id}` }}
                  </option>
                </select>
              </div>
            </div>

            <div v-if="form.seriesMode !== 'standalone'" class="field mt-3">
              <label class="lbl lbl--req">ڕیزبەندی</label>
              <input v-model.number="form.seriesOrder" type="number" class="inp" min="1" step="0.1" />
            </div>
          </section>

          <!-- ── Publishing Info ─────────────────────────────────────────────── -->
          <section class="card">
            <div class="card__hd">
              <span class="card__hd-ico">🏛️</span>
              <span class="card__hd-title">زانیاری بڵاوکردنەوە</span>
            </div>
            <div class="institute-toggle">
              <span>بڕیاری ناوەند؟</span>
              <button type="button" class="toggle" :class="{ 'toggle--on': form.publishedByInstitute }"
                @click="form.publishedByInstitute = !form.publishedByInstitute">
                {{ form.publishedByInstitute ? 'بەڵێ' : 'نەخێر' }}
              </button>
            </div>
          </section>

        </div>

        <!-- ═══════════════ SIDE COLUMN ═══════════════ -->
        <aside class="col-side">

          <!-- Cover Images -->
          <section class="card card--covers">
            <div class="card__hd">
              <span class="card__hd-ico">🖼️</span>
              <span class="card__hd-title">وێنەی ڕووکار</span>
            </div>

            <div class="cover-tabs">
              <button type="button" class="cover-tab" :class="{ 'cover-tab--on': coverTab === 'ckb' }" @click="coverTab = 'ckb'">
                <span class="cover-tab__dot" style="background:#c8a800;"></span>سۆرانی
              </button>
              <button type="button" class="cover-tab" :class="{ 'cover-tab--on': coverTab === 'kmr' }" @click="coverTab = 'kmr'">
                <span class="cover-tab__dot" style="background:#4a7af0;"></span>کورمانجی
              </button>
              <button type="button" class="cover-tab" :class="{ 'cover-tab--on': coverTab === 'hover' }" @click="coverTab = 'hover'">
                <span class="cover-tab__dot" style="background:#7c3aed;"></span>ماووس
              </button>
            </div>

            <!-- CKB Cover -->
            <div v-show="coverTab === 'ckb'" class="cover-panel">
              <div v-if="ckbCoverPreview || form.ckbCoverUrl" class="cover-preview-large">
                <img :src="ckbCoverPreview || form.ckbCoverUrl" />
                <button type="button" class="cover-preview-large__remove" @click="removeCkbCover">✕</button>
                <!-- Show all selected genres on the cover preview -->
                <div v-if="form.bookGenres.length" class="cover-genre-badge">
                  <span v-for="(gVal, i) in form.bookGenres.slice(0, 2)" :key="gVal">
                    {{ genreMap[gVal]?.icon }}<template v-if="i === 0 && form.bookGenres.length === 1"> {{ genreMap[gVal]?.label }}</template>
                  </span>
                  <span v-if="form.bookGenres.length > 2">+{{ form.bookGenres.length - 2 }}</span>
                </div>
              </div>
              <label v-else class="upload-zone upload-zone--cover">
                <input type="file" accept="image/*" @change="onCkbCover" style="display:none;" />
                <div class="upload-zone__inner">
                  <span>وێنەی ڕووکاری سۆرانی</span>
                </div>
              </label>
              <div class="field mt-3">
                <label class="lbl">یان URL</label>
                <input v-model="form.ckbCoverUrl" class="inp" :disabled="!!ckbCoverFile" />
              </div>
            </div>

            <!-- KMR Cover -->
            <div v-show="coverTab === 'kmr'" class="cover-panel">
              <div v-if="kmrCoverPreview || form.kmrCoverUrl" class="cover-preview-large">
                <img :src="kmrCoverPreview || form.kmrCoverUrl" />
                <button type="button" class="cover-preview-large__remove" @click="removeKmrCover">✕</button>
              </div>
              <label v-else class="upload-zone upload-zone--cover">
                <input type="file" accept="image/*" @change="onKmrCover" style="display:none;" />
                <div class="upload-zone__inner">
                  <span>وێنەی ڕووکاری کورمانجی</span>
                </div>
              </label>
              <div class="field mt-3">
                <label class="lbl">یان URL</label>
                <input v-model="form.kmrCoverUrl" class="inp" :disabled="!!kmrCoverFile" />
              </div>
            </div>

            <!-- Hover Cover -->
            <div v-show="coverTab === 'hover'" class="cover-panel">
              <div v-if="hoverPreview || form.hoverCoverUrl" class="cover-preview-large cover-preview-large--hover">
                <img :src="hoverPreview || form.hoverCoverUrl" />
                <button type="button" class="cover-preview-large__remove" @click="removeHoverCover">✕</button>
              </div>
              <label v-else class="upload-zone upload-zone--cover upload-zone--hover">
                <input type="file" accept="image/*" @change="onHoverCover" style="display:none;" />
                <div class="upload-zone__inner">
                  <span>وێنەی ماووس</span>
                </div>
              </label>
              <div class="field mt-3">
                <label class="lbl">یان URL</label>
                <input v-model="form.hoverCoverUrl" class="inp" :disabled="!!hoverCoverFile" />
              </div>
            </div>
          </section>

          <!-- Submit -->
          <div class="side-actions">
            <button type="submit" class="btn btn--primary btn--full" :disabled="saving">
              <span v-if="saving" class="spinner"></span>
              {{ saving ? 'پاشەکەوتکردن…' : (isEdit ? 'نوێکردنەوە' : 'دروستکردن') }}
            </button>
            <RouterLink to="/admin/writings" class="btn btn--ghost btn--full">هەڵوەشاندنەوە</RouterLink>
          </div>

          <!-- Danger Zone -->
          <section v-if="isEdit" class="card card--danger">
            <div class="card__hd card__hd--danger">
              <span>⚠️</span>
              <span>ناوچەی مەترسیدار</span>
            </div>
            <button type="button" class="btn btn--danger btn--full" @click="doDelete">سڕینەوەی کتێب</button>
          </section>

        </aside>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/api.js'

// ── Inline TagInput Component ───────────────────────────────────────────────
const TagInput = {
  props: ['modelValue', 'placeholder', 'color'],
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const inp = ref('')
    const add = () => {
      const v = inp.value.trim()
      if (v && !props.modelValue.includes(v)) {
        emit('update:modelValue', [...props.modelValue, v])
      }
      inp.value = ''
    }
    const rem = (i) => {
      const arr = [...props.modelValue]
      arr.splice(i, 1)
      emit('update:modelValue', arr)
    }
    return { inp, add, rem }
  },
  template: `
    <div class="tag-input">
      <div class="tag-input__tags">
        <span v-for="(t, i) in modelValue" :key="t" :class="'tag-input__tag tag-input__tag--' + color">
          {{ t }} <button type="button" @click="rem(i)">×</button>
        </span>
        <input v-model="inp" @keydown.enter.prevent="add" @blur="add" :placeholder="placeholder" class="tag-input__inp" />
      </div>
    </div>
  `
}

// ── Genre Definitions — must match BookGenre enum exactly ───────────────────
// These string values are sent directly to the backend as Set<BookGenre>.
const genreGroups = [
  {
    label: 'ئەدەب و داستان',
    genres: [
      { value: 'POETRY',      label: 'شیعر',         en: 'Poetry',      icon: '📝', color: 'gold' },
      { value: 'NOVEL',       label: 'ڕۆمان',        en: 'Novel',       icon: '📖', color: 'crimson' },
      { value: 'SHORT_STORY', label: 'چیرۆکی کورت',  en: 'Short Story', icon: '📃', color: 'blue' },
      { value: 'DRAMA',       label: 'شانۆ',          en: 'Drama',       icon: '🎭', color: 'purple' },
    ],
  },
  {
    label: 'مێژوو و مرۆڤایەتی',
    genres: [
      { value: 'HISTORY',    label: 'مێژوو',    en: 'History',    icon: '📜', color: 'gold' },
      { value: 'BIOGRAPHY',  label: 'ژیاننامە', en: 'Biography',  icon: '👤', color: 'teal' },
      { value: 'PHILOSOPHY', label: 'فەلسەفە',  en: 'Philosophy', icon: '🧠', color: 'purple' },
      { value: 'RELIGION',   label: 'ئایین',    en: 'Religion',   icon: '☪️', color: 'green' },
      { value: 'FOLKLORE',   label: 'زارگوتن',  en: 'Folklore',   icon: '🎋', color: 'gold' },
    ],
  },
  {
    label: 'کۆمەڵایەتی و سیاسی',
    genres: [
      { value: 'POLITICS',  label: 'سیاسەت',    en: 'Politics',   icon: '🏛️', color: 'crimson' },
      { value: 'SOCIOLOGY', label: 'کۆمەڵناسی', en: 'Sociology',  icon: '👥', color: 'blue' },
      { value: 'ECONOMICS', label: 'ئابووری',   en: 'Economics',  icon: '📊', color: 'green' },
      { value: 'LAW',       label: 'یاسا',       en: 'Law',        icon: '⚖️', color: 'slate' },
    ],
  },
  {
    label: 'زمان، زانست و هونەر',
    genres: [
      { value: 'LINGUISTICS', label: 'زمانناسی',   en: 'Linguistics', icon: '🔤', color: 'blue' },
      { value: 'ARTS',        label: 'هونەر',       en: 'Arts',        icon: '🎨', color: 'rose' },
      { value: 'CULTURAL',    label: 'کولتووری',   en: 'Cultural',    icon: '🏺', color: 'gold' },
      { value: 'SCIENCE',     label: 'زانست',       en: 'Science',     icon: '🔬', color: 'teal' },
      { value: 'MEDICINE',    label: 'پزیشکی',     en: 'Medicine',    icon: '⚕️', color: 'green' },
      { value: 'EDUCATIONAL', label: 'پەروەردەیی', en: 'Educational', icon: '🎓', color: 'blue' },
    ],
  },
  {
    label: 'تایبەت',
    genres: [
      { value: 'CHILDREN', label: 'منداڵان',     en: 'Children', icon: '🌟', color: 'gold' },
      { value: 'TRAVEL',   label: 'گەشتوگوزار', en: 'Travel',   icon: '🗺️', color: 'teal' },
      { value: 'OTHER',    label: 'یتر',          en: 'Other',    icon: '📦', color: 'slate' },
    ],
  },
]

// Flat lookup map: 'NOVEL' → { label, icon, en, color, value }
const genreMap = Object.fromEntries(
  genreGroups.flatMap(g => g.genres).map(g => [g.value, g])
)

// ── Setup ───────────────────────────────────────────────────────────────────
const route  = useRoute()
const router = useRouter()

const isEdit         = computed(() => !!route.params.id)
const activeLang     = ref('CKB')
const fileActiveLang = ref('CKB')
const coverTab       = ref('ckb')
const fetching       = ref(false)
const saving         = ref(false)
const toast          = reactive({ show: false, type: 'success', msg: '' })
const errors         = ref({})

// File refs
const ckbCoverFile    = ref(null)
const kmrCoverFile    = ref(null)
const hoverCoverFile  = ref(null)
const ckbCoverPreview = ref('')
const kmrCoverPreview = ref('')
const hoverPreview    = ref('')

const ckbBookFile   = ref(null)
const kmrBookFile   = ref(null)
const ckbFilePreview = ref(null)
const kmrFilePreview = ref(null)

const topicMode          = ref('none')
const topics             = ref([])
const topicsLoading      = ref(false)
const seriesParents      = ref([])

// ── Form state ──────────────────────────────────────────────────────────────
// bookGenres is a plain JS Array that mirrors the backend Set<BookGenre>.
// Jackson serialises a JS Array as a JSON array, which Spring deserialises
// into Set<BookGenre> — no conversion needed on the Vue side.
const form = reactive({
  bookGenres:          [],   // string[] — enum values e.g. ['NOVEL', 'HISTORY']
  contentLanguages:    ['CKB'],
  topicId:             null,
  newTopic:            { nameCkb: '', nameKmr: '' },
  clearTopic:          false,
  ckbCoverUrl:         '',
  kmrCoverUrl:         '',
  hoverCoverUrl:       '',
  ckbContent:          { title: '', description: '', writer: '', genre: '', fileUrl: '', fileFormat: '', pageCount: null },
  kmrContent:          { title: '', description: '', writer: '', genre: '', fileUrl: '', fileFormat: '', pageCount: null },
  tagsCkb:             [],
  tagsKmr:             [],
  keywordsCkb:         [],
  keywordsKmr:         [],
  seriesMode:          'standalone',
  seriesName:          '',
  parentBookId:        '',
  seriesOrder:         null,
  publishedByInstitute: false,
})

// ── Toggle a genre in/out of the selection ──────────────────────────────────
// This keeps bookGenres as a de-duplicated array (Set semantics).
const toggleGenre = (val) => {
  const idx = form.bookGenres.indexOf(val)
  if (idx === -1) form.bookGenres.push(val)
  else            form.bookGenres.splice(idx, 1)
}

// ── Loaders ─────────────────────────────────────────────────────────────────
const loadTopics = async () => {
  topicsLoading.value = true
  try {
    const { data } = await api.get('/api/v1/writings/topics')
    topics.value = Array.isArray(data?.data) ? data.data : []
  } finally { topicsLoading.value = false }
}

const loadSeriesParents = async () => {
  try {
    const { data } = await api.get('/api/v1/writings/series/parents?page=0&size=200')
    seriesParents.value = data?.data?.content || []
  } catch {}
}

const loadWriting = async () => {
  if (!isEdit.value) return
  fetching.value = true
  try {
    const { data } = await api.get(`/api/v1/writings/${route.params.id}`)
    applyWriting(data?.data)
  } catch {
    showToast('error', 'هەڵە لە هێنانی داتا')
  } finally { fetching.value = false }
}

// ── Map API response → form state ───────────────────────────────────────────
// bookGenres comes back as a JSON array from the backend Set<BookGenre>.
const applyWriting = (w) => {
  if (!w) return

  // De-duplicate just in case, preserve order
  form.bookGenres = [...new Set(Array.isArray(w.bookGenres) ? w.bookGenres : [])]

  form.contentLanguages = [...(w.contentLanguages || ['CKB'])]
  activeLang.value      = form.contentLanguages[0] || 'CKB'

  form.publishedByInstitute = w.publishedByInstitute || false
  form.ckbCoverUrl          = w.ckbCoverUrl   || ''
  form.kmrCoverUrl          = w.kmrCoverUrl   || ''
  form.hoverCoverUrl        = w.hoverCoverUrl || ''

  if (w.ckbContent) Object.assign(form.ckbContent, w.ckbContent)
  if (w.kmrContent) Object.assign(form.kmrContent, w.kmrContent)

  form.tagsCkb     = [...(w.tags?.ckb     || [])]
  form.tagsKmr     = [...(w.tags?.kmr     || [])]
  form.keywordsCkb = [...(w.keywords?.ckb || [])]
  form.keywordsKmr = [...(w.keywords?.kmr || [])]

  if (w.topic?.id) { topicMode.value = 'existing'; form.topicId = w.topic.id }
  else              { topicMode.value = 'none' }

  const si = w.seriesInfo
  if (si?.parentBookId) {
    form.seriesMode   = 'add-to-series'
    form.parentBookId = si.parentBookId
    form.seriesName   = si.seriesName  || ''
    form.seriesOrder  = si.seriesOrder
  } else if (si?.seriesName) {
    form.seriesMode  = 'new-series'
    form.seriesName  = si.seriesName
    form.seriesOrder = si.seriesOrder
  } else {
    form.seriesMode = 'standalone'
  }
}

// ── File Handlers ───────────────────────────────────────────────────────────
const setPreview = (refObj, file) => {
  if (refObj.value) URL.revokeObjectURL(refObj.value)
  refObj.value = file ? URL.createObjectURL(file) : ''
}
const onCkbCover    = (e) => { const f = e.target.files?.[0]; if (f) { ckbCoverFile.value = f; setPreview(ckbCoverPreview, f); form.ckbCoverUrl = '' } }
const onKmrCover    = (e) => { const f = e.target.files?.[0]; if (f) { kmrCoverFile.value = f; setPreview(kmrCoverPreview, f); form.kmrCoverUrl = '' } }
const onHoverCover  = (e) => { const f = e.target.files?.[0]; if (f) { hoverCoverFile.value = f; setPreview(hoverPreview, f); form.hoverCoverUrl = '' } }
const removeCkbCover   = () => { ckbCoverFile.value   = null; ckbCoverPreview.value = ''; form.ckbCoverUrl   = '' }
const removeKmrCover   = () => { kmrCoverFile.value   = null; kmrCoverPreview.value = ''; form.kmrCoverUrl   = '' }
const removeHoverCover = () => { hoverCoverFile.value = null; hoverPreview.value    = ''; form.hoverCoverUrl = '' }

const onCkbFile  = (e) => { const f = e.target.files?.[0]; if (f) { ckbBookFile.value = f; ckbFilePreview.value = f; form.ckbContent.fileUrl = '' } }
const onKmrFile  = (e) => { const f = e.target.files?.[0]; if (f) { kmrBookFile.value = f; kmrFilePreview.value = f; form.kmrContent.fileUrl = '' } }
const removeCkbFile = () => { ckbBookFile.value = null; ckbFilePreview.value = null }
const removeKmrFile = () => { kmrBookFile.value = null; kmrFilePreview.value = null }

const fmtBytes = (b) => {
  if (!b) return '—'
  if (b < 1024)    return b + ' B'
  if (b < 1048576) return (b / 1024).toFixed(1)    + ' KB'
  return                  (b / 1048576).toFixed(1) + ' MB'
}

// ── Validation ──────────────────────────────────────────────────────────────
const validate = () => {
  const e = {}
  if (!form.bookGenres.length)      e.bookGenres       = 'کەمی یەک جۆر هەڵبژێرە'
  if (!form.contentLanguages.length) e.contentLanguages = 'کەمی یەک زمان هەڵبژێرە'
  if (form.contentLanguages.includes('CKB') && !form.ckbContent.title?.trim()) e.titles = 'ناونیشانی سۆرانی پێویستە'
  if (form.contentLanguages.includes('KMR') && !form.kmrContent.title?.trim()) e.titles = 'ناونیشانی کورمانجی پێویستە'
  if (form.seriesMode === 'add-to-series' && !form.parentBookId) e.parentBookId = 'سەری پاڵپشتوو پێویستە'
  errors.value = e
  return !Object.keys(e).length
}

// ── Submit ───────────────────────────────────────────────────────────────────
const submit = async () => {
  if (!validate()) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    showToast('error', 'تکایە خانە پێویستەکان پڕ بکەوە')
    return
  }
  saving.value = true

  // bookGenres is a JS string[] which JSON.stringify serialises as a JSON array.
  // Spring's Jackson deserialiser maps that array to Set<BookGenre> automatically.
  const dto = {
    bookGenres:           form.bookGenres.length ? [...form.bookGenres] : null,
    contentLanguages:     form.contentLanguages,
    publishedByInstitute: form.publishedByInstitute,
    ckbCoverUrl:          form.ckbCoverUrl  || null,
    kmrCoverUrl:          form.kmrCoverUrl  || null,
    hoverCoverUrl:        form.hoverCoverUrl || null,
    ckbContent: form.contentLanguages.includes('CKB') ? {
      title:         form.ckbContent.title       || null,
      description:   form.ckbContent.description || null,
      writer:        form.ckbContent.writer      || null,
      genre:         form.ckbContent.genre       || null,
      fileUrl:       form.ckbContent.fileUrl     || null,
      fileFormat:    form.ckbContent.fileFormat   || null,
      pageCount:     form.ckbContent.pageCount    ?? null,
    } : null,
    kmrContent: form.contentLanguages.includes('KMR') ? {
      title:         form.kmrContent.title       || null,
      description:   form.kmrContent.description || null,
      writer:        form.kmrContent.writer      || null,
      genre:         form.kmrContent.genre       || null,
      fileUrl:       form.kmrContent.fileUrl     || null,
      fileFormat:    form.kmrContent.fileFormat   || null,
      pageCount:     form.kmrContent.pageCount    ?? null,
    } : null,
    tags:     { ckb: form.tagsCkb,     kmr: form.tagsKmr     },
    keywords: { ckb: form.keywordsCkb, kmr: form.keywordsKmr },
    topicId:  topicMode.value === 'existing' ? form.topicId : null,
    newTopic: topicMode.value === 'new'
      ? { nameCkb: form.newTopic.nameCkb || null, nameKmr: form.newTopic.nameKmr || null }
      : null,
    clearTopic:   isEdit.value ? form.clearTopic : undefined,
    seriesName:   form.seriesMode !== 'standalone' ? (form.seriesName  || null) : null,
    seriesOrder:  form.seriesMode !== 'standalone' ? (form.seriesOrder ?? null) : null,
    parentBookId: form.seriesMode === 'add-to-series' ? (form.parentBookId || null) : null,
  }

  const fd = new FormData()
  fd.append('data', new Blob([JSON.stringify(dto)], { type: 'application/json' }))
  if (ckbCoverFile.value)   fd.append('ckbCoverImage',   ckbCoverFile.value)
  if (kmrCoverFile.value)   fd.append('kmrCoverImage',   kmrCoverFile.value)
  if (hoverCoverFile.value) fd.append('hoverCoverImage', hoverCoverFile.value)
  if (ckbBookFile.value)    fd.append('ckbBookFile',     ckbBookFile.value)
  if (kmrBookFile.value)    fd.append('kmrBookFile',     kmrBookFile.value)

  try {
    const cfg = { headers: { 'Content-Type': 'multipart/form-data' } }
    if (isEdit.value) await api.put(`/api/v1/writings/${route.params.id}`, fd, cfg)
    else              await api.post('/api/v1/writings', fd, cfg)
    showToast('success', isEdit.value ? 'نوێکرایەوە ✓' : 'دروستکرا ✓')
    setTimeout(() => router.push('/admin/writings'), 1200)
  } catch (e) {
    showToast('error', e?.response?.data?.message || 'هەڵەیەک ڕوویدا')
  } finally {
    saving.value = false
  }
}

const doDelete = async () => {
  if (!confirm('دڵنیای لە سڕینەوە؟')) return
  try {
    await api.delete(`/api/v1/writings/${route.params.id}`)
    router.push('/admin/writings')
  } catch { showToast('error', 'سڕینەوە سەرنەکەوت') }
}

const showToast = (type, msg) => {
  toast.show = true; toast.type = type; toast.msg = msg
  setTimeout(() => { toast.show = false }, 4000)
}

watch(() => form.contentLanguages, (langs) => {
  if (!langs.includes(activeLang.value))     activeLang.value     = langs[0]
  if (!langs.includes(fileActiveLang.value)) fileActiveLang.value = langs[0]
}, { deep: true })

onMounted(() => { loadTopics(); loadSeriesParents(); loadWriting() })
</script>

<style scoped>
/* ── CSS Variables ─────────────────────────────────────────────────────────── */
:root {
  --crimson: #8C1515; --crimson-lt: #A61C1C;
  --gold: #C8A800; --blue: #4A7AF0; --purple: #7C3AED;
  --green: #16784a; --teal: #0d7c7c; --rose: #c0285e; --slate: #4b5563;
  --text: #2E2D29; --muted: #767571; --border: #E0DFDC;
  --cream: #FAFAF9; --cream-dk: #F0EEEB;
  --radius-sm: 8px; --radius-md: 12px;
}

.wed { direction: rtl; max-width: 1280px; margin: 0 auto; padding: 0 1rem; }

.wed__head { display: flex; align-items: center; gap: 1.25rem; margin-bottom: 1.5rem; }
.wed__back { display: inline-flex; align-items: center; gap: .4rem; color: var(--muted); text-decoration: none; font-weight: 600; padding: .5rem .8rem; border: 1px solid var(--border); border-radius: var(--radius-sm); background: white; }
.wed__back:hover { color: var(--crimson); border-color: var(--crimson); }
.wed__title { font-size: 1.5rem; font-weight: 800; color: var(--text); margin: 0; }
.wed__sub { font-size: .8rem; color: var(--muted); margin: .25rem 0 0; }

.toast { display: flex; align-items: center; gap: .65rem; padding: .9rem 1.1rem; border-radius: var(--radius-sm); font-weight: 600; margin-bottom: 1rem; }
.toast--success { background: rgba(22,120,70,.1); border: 1px solid rgba(22,120,70,.2); color: #166044; }
.toast--error   { background: rgba(140,21,21,.08); border: 1px solid rgba(140,21,21,.2); color: var(--crimson); }

.loading-bar { height: 3px; border-radius: 2px; margin-bottom: 1rem; background: linear-gradient(90deg, var(--crimson), var(--gold), var(--crimson)); background-size: 200% 100%; animation: shimmer 1.2s linear infinite; }
@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

.wed__layout { display: grid; grid-template-columns: 1fr 360px; gap: 1.5rem; align-items: start; }
@media (max-width: 900px) { .wed__layout { grid-template-columns: 1fr; } }

.card { background: white; border: 1px solid var(--border); border-radius: var(--radius-md); padding: 1.5rem; margin-bottom: 1.25rem; box-shadow: 0 2px 8px rgba(0,0,0,.04); }
.card--danger { border-color: rgba(140,21,21,.2); background: rgba(140,21,21,.02); }
.card__hd { display: flex; align-items: center; gap: .6rem; margin-bottom: 1.25rem; padding-bottom: .75rem; border-bottom: 1px solid var(--cream-dk); }
.card__hd-title { font-weight: 700; font-size: 1rem; color: var(--text); flex: 1; }
.card__hd-badge { background: var(--cream-dk); color: var(--muted); padding: .2rem .6rem; border-radius: 20px; font-size: .75rem; font-weight: 700; }

/* ── Genre selected pills (above the grid) ─────────────────────────────── */
.genre-selected-pills { display: flex; flex-wrap: wrap; gap: .75rem; margin-bottom: 1.25rem; }
.genre-selected-pill { display: inline-flex; align-items: center; gap: .75rem; padding: .65rem 1rem; border-radius: var(--radius-sm); background: rgba(140,21,21,.06); border: 1.5px solid rgba(140,21,21,.2); }
.genre-selected-pill__icon { font-size: 1.5rem; }
.genre-selected-pill__info { display: flex; flex-direction: column; }
.genre-selected-pill__label { font-weight: 800; font-size: .95rem; }
.genre-selected-pill__en { font-size: .75rem; color: var(--muted); }
.genre-selected-pill__clear { width: 26px; height: 26px; border-radius: 50%; border: none; background: rgba(140,21,21,.08); color: var(--crimson); cursor: pointer; display: flex; align-items: center; justify-content: center; }
.genre-selected-pill__clear:hover { background: var(--crimson); color: white; }

/* Genre enter/leave animation */
.genre-selected-enter-active, .genre-selected-leave-active { transition: all .2s ease; }
.genre-selected-enter-from, .genre-selected-leave-to { opacity: 0; transform: scale(.85); }

/* ── Genre grid ─────────────────────────────────────────────────────────── */
.genre-groups { display: flex; flex-direction: column; gap: 1.25rem; }
.genre-group__label { font-size: .75rem; font-weight: 800; text-transform: uppercase; color: var(--muted); margin-bottom: .6rem; }
.genre-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: .6rem; }

.genre-card {
  display: flex; flex-direction: column; align-items: center; gap: .4rem;
  padding: .85rem .6rem; border: 2px solid var(--border); border-radius: var(--radius-sm);
  cursor: pointer; transition: all .15s; background: white; text-align: center;
  position: relative; user-select: none;
}
.genre-card:hover { border-color: var(--crimson); background: rgba(140,21,21,.03); }
.genre-card__input { display: none; }
.genre-card__icon  { font-size: 1.5rem; }
.genre-card__label { font-size: .8rem; font-weight: 700; color: var(--text); }

/* Active state — generic crimson, then colour-overrides */
.genre-card--active { border-color: var(--crimson); background: rgba(140,21,21,.05); }
.genre-card--gold.genre-card--active   { border-color: var(--gold);   background: rgba(200,168,0,.07); }
.genre-card--blue.genre-card--active   { border-color: var(--blue);   background: rgba(74,122,240,.07); }
.genre-card--purple.genre-card--active { border-color: var(--purple); background: rgba(124,58,237,.07); }
.genre-card--green.genre-card--active  { border-color: var(--green);  background: rgba(22,120,74,.07); }
.genre-card--teal.genre-card--active   { border-color: var(--teal);   background: rgba(13,124,124,.07); }
.genre-card--rose.genre-card--active   { border-color: var(--rose);   background: rgba(192,40,94,.07); }
.genre-card--slate.genre-card--active  { border-color: var(--slate);  background: rgba(75,85,99,.06); }

/* Checkmark badge */
.genre-card__check {
  position: absolute; top: 5px; right: 5px;
  width: 18px; height: 18px; border-radius: 50%;
  background: var(--crimson); color: white;
  font-size: .65rem; font-weight: 900;
  display: flex; align-items: center; justify-content: center;
}

/* ── Standard fields ────────────────────────────────────────────────────── */
.field { margin-bottom: 1rem; }
.lbl { display: block; font-weight: 700; font-size: .85rem; color: var(--text); margin-bottom: .5rem; }
.lbl--req::after { content: ' *'; color: var(--crimson); }
.inp { width: 100%; padding: .75rem 1rem; border: 1.5px solid var(--border); border-radius: var(--radius-sm); background: var(--cream); color: var(--text); font-size: .9rem; box-sizing: border-box; }
.inp:focus { outline: none; background: white; border-color: var(--crimson); box-shadow: 0 0 0 3px rgba(140,21,21,.1); }
.ta { min-height: 120px; resize: vertical; }
.two-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
@media (max-width: 600px) { .two-grid { grid-template-columns: 1fr; } }
.err { color: #dc2626; font-size: .8rem; font-weight: 600; margin-top: .25rem; }
.mt-3 { margin-top: .75rem; }

.state-picks { display: flex; gap: .75rem; flex-wrap: wrap; }
.state-pick { display: inline-flex; align-items: center; gap: .5rem; padding: .65rem 1rem; border-radius: var(--radius-sm); border: 1.5px solid var(--border); cursor: pointer; font-weight: 700; font-size: .9rem; background: white; }
.state-pick input { display: none; }
.state-pick--on { background: rgba(140,21,21,.06); border-color: var(--crimson); color: var(--crimson); }

.lang-picks { display: flex; gap: 1rem; }
.lang-pick { flex: 1; display: flex; align-items: center; gap: .75rem; padding: 1rem; border: 2px solid var(--border); border-radius: var(--radius-sm); cursor: pointer; background: white; }
.lang-pick--on { border-color: var(--crimson); background: rgba(140,21,21,.04); }
.lang-pick input { display: none; }

.tabs { display: flex; gap: .25rem; margin-bottom: 1.25rem; border-bottom: 2px solid var(--border); }
.tab { padding: .75rem 1.25rem; border: none; background: none; color: var(--muted); font-weight: 700; cursor: pointer; border-bottom: 2px solid transparent; margin-bottom: -2px; }
.tab--on { color: var(--crimson); border-bottom-color: var(--crimson); background: rgba(140,21,21,.04); }

.file-lang-tabs { display: flex; gap: .5rem; margin-bottom: 1rem; }
.file-lang-tab { padding: .55rem 1rem; border: 1.5px solid var(--border); border-radius: var(--radius-sm); background: white; color: var(--muted); font-weight: 700; cursor: pointer; }
.file-lang-tab--on { border-color: var(--crimson); color: var(--crimson); background: rgba(140,21,21,.04); }

.file-preview-box { display: flex; align-items: center; gap: .75rem; padding: .85rem 1rem; border: 1.5px solid var(--border); border-radius: var(--radius-sm); background: var(--cream); }
.file-preview-box__icon { font-size: 1.5rem; }
.file-preview-box__info { flex: 1; min-width: 0; }
.file-preview-box__name { font-weight: 700; font-size: .88rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.file-preview-box__size { font-size: .78rem; color: var(--muted); }
.file-preview-box__remove { width: 28px; height: 28px; border-radius: 50%; border: none; background: rgba(140,21,21,.08); color: var(--crimson); cursor: pointer; }

.series-modes { display: grid; grid-template-columns: repeat(3,1fr); gap: .75rem; margin-bottom: 1rem; }
@media (max-width: 600px) { .series-modes { grid-template-columns: 1fr; } }
.series-mode { display: flex; flex-direction: column; align-items: center; gap: .5rem; padding: 1.25rem; border: 2px solid var(--border); border-radius: var(--radius-sm); cursor: pointer; text-align: center; }
.series-mode input { display: none; }
.series-mode--on { border-color: var(--crimson); background: rgba(140,21,21,.04); }
.series-mode__icon { font-size: 2rem; }
.series-form { padding: 1.25rem; background: rgba(140,21,21,.04); border: 1px solid rgba(140,21,21,.1); border-radius: var(--radius-sm); margin-top: 1rem; }

.institute-toggle { display: flex; align-items: center; gap: 1rem; font-weight: 700; }
.toggle { padding: .6rem 1.2rem; border-radius: 20px; border: 1.5px solid var(--border); background: white; color: var(--muted); cursor: pointer; font-weight: 700; }
.toggle--on { background: rgba(22,120,70,.1); border-color: rgba(22,120,70,.3); color: #166044; }

/* ── Cover tabs & preview ─────────────────────────────────────────────────── */
.cover-tabs { display: flex; gap: .25rem; margin-bottom: 1rem; background: var(--cream); padding: .25rem; border-radius: var(--radius-sm); }
.cover-tab { flex: 1; display: inline-flex; align-items: center; justify-content: center; gap: .5rem; padding: .6rem; border: none; background: transparent; color: var(--muted); font-weight: 600; cursor: pointer; border-radius: 6px; }
.cover-tab--on { background: white; color: var(--text); box-shadow: 0 2px 4px rgba(0,0,0,.05); }
.cover-tab__dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }

.cover-preview-large { position: relative; border-radius: var(--radius-sm); overflow: hidden; aspect-ratio: 3/4; background: var(--cream); border: 1px solid var(--border); }
.cover-preview-large img { width: 100%; height: 100%; object-fit: cover; }
.cover-preview-large__remove { position: absolute; top: .5rem; left: .5rem; width: 32px; height: 32px; border-radius: 50%; border: none; background: rgba(0,0,0,.6); color: white; cursor: pointer; }
.cover-genre-badge { position: absolute; bottom: .5rem; right: .5rem; display: flex; align-items: center; gap: .2rem; padding: .3rem .65rem; border-radius: 20px; background: rgba(0,0,0,.55); color: white; font-size: .75rem; font-weight: 700; }

.upload-zone { display: block; border: 2px dashed var(--border); border-radius: var(--radius-sm); cursor: pointer; }
.upload-zone:hover { border-color: var(--crimson); }
.upload-zone--cover { aspect-ratio: 3/4; max-height: 300px; }
.upload-zone__inner { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: .75rem; padding: 2rem; text-align: center; color: var(--muted); height: 100%; }
.upload-zone__title { font-weight: 700; font-size: .9rem; }
.upload-zone__hint  { font-size: .78rem; }

/* ── Sidebar actions ─────────────────────────────────────────────────────── */
.side-actions { display: flex; flex-direction: column; gap: .75rem; margin-bottom: 1.25rem; }

.btn { display: inline-flex; align-items: center; justify-content: center; gap: .5rem; padding: .85rem 1.25rem; border-radius: var(--radius-sm); font-weight: 700; font-size: .9rem; cursor: pointer; border: 1px solid transparent; text-decoration: none; font: inherit; }
.btn--primary { background: var(--crimson); color: white; }
.btn--primary:disabled { opacity: .6; cursor: not-allowed; }
.btn--ghost { background: transparent; border-color: var(--border); color: var(--text); }
.btn--danger { background: #dc2626; color: white; }
.btn--full { width: 100%; box-sizing: border-box; }

.spinner { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,.3); border-top-color: white; border-radius: 50%; animation: spin .8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

/* ── Tag Input ──────────────────────────────────────────────────────────── */
:global(.tag-input__tags) { display: flex; flex-wrap: wrap; gap: .5rem; align-items: center; border: 1.5px solid var(--border); border-radius: var(--radius-sm); padding: .5rem; background: var(--cream); min-height: 46px; }
:global(.tag-input__tag)  { display: inline-flex; align-items: center; gap: .25rem; padding: .35rem .75rem; border-radius: 20px; font-size: .85rem; font-weight: 600; }
:global(.tag-input__tag--gold) { background: rgba(200,168,0,.15); color: #7a6200; border: 1px solid rgba(200,168,0,.3); }
:global(.tag-input__tag--blue) { background: rgba(74,122,240,.12); color: #2d5ac0; border: 1px solid rgba(74,122,240,.25); }
:global(.tag-input__tag button) { background: none; border: none; cursor: pointer; margin-right: .25rem; }
:global(.tag-input__inp) { border: none; outline: none; background: none; min-width: 120px; flex: 1; }

/* ── Toast transition ────────────────────────────────────────────────────── */
.toast-enter-active, .toast-leave-active { transition: all .3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(-8px); }
</style>