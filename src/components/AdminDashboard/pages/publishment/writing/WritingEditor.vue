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

          <!-- Writing Topic -->
          <section class="card">
            <div class="card__hd">
              <span class="card__hd-ico">📚</span>
              <span class="card__hd-title">بابەتی نووسین</span>
            </div>
            <div class="field">
              <label class="lbl lbl--req">بابەت</label>
              <div class="topic-select-grid">
                <label v-for="topic in writingTopics" :key="topic.value"
                  class="topic-card" :class="{ 'topic-card--active': form.writingTopic === topic.value }">
                  <input type="radio" :value="topic.value" v-model="form.writingTopic" class="topic-card__input" />
                  <span class="topic-card__dot" :style="{ background: topic.color }"></span>
                  <span class="topic-card__label">{{ topic.label }}</span>
                </label>
              </div>
            </div>
            <div v-if="errors.writingTopic" class="err">{{ errors.writingTopic }}</div>
          </section>

          <!-- Publishment Topic (Dynamic) -->
          <section class="card">
            <div class="card__hd">
              <span class="card__hd-ico">🏷️</span>
              <span class="card__hd-title">بابەتی بڵاوکردنەوە</span>
            </div>

            <div class="state-picks">
              <label class="state-pick" :class="{ 'state-pick--on': topicMode === 'none' }">
                <input type="radio" value="none" v-model="topicMode" />
                <span class="state-pick__flag">❌</span>
                بێ بابەت
              </label>
              <label class="state-pick" :class="{ 'state-pick--on': topicMode === 'existing' }">
                <input type="radio" value="existing" v-model="topicMode" />
                <span class="state-pick__flag">📋</span>
                بابەتی هەبوو
              </label>
              <label class="state-pick" :class="{ 'state-pick--on': topicMode === 'new' }">
                <input type="radio" value="new" v-model="topicMode" />
                <span class="state-pick__flag">➕</span>
                بابەتی نوێ
              </label>
            </div>

            <div v-if="topicMode === 'existing'" class="field mt-3">
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

            <div v-if="topicMode === 'new'" class="mt-3">
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
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
                </svg>
                بابەتی نوێ دروست دەکرێت و بەم کتێبەوە دابمەزرێت
              </div>
            </div>

            <div v-if="isEdit && topicMode === 'existing'" class="mt-3">
              <label class="lang-pick" :class="{ 'lang-pick--on': form.clearTopic }">
                <input type="checkbox" v-model="form.clearTopic" />
                <span>سڕینەوەی بابەتی ئێستا</span>
              </label>
            </div>
          </section>

          <!-- Languages -->
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
                  <span class="lang-pick__code">سۆرانی</span>
                </div>
              </label>
              <label class="lang-pick" :class="{ 'lang-pick--on': form.contentLanguages.includes('KMR') }">
                <input type="checkbox" value="KMR" v-model="form.contentLanguages" />
                <span class="lang-pick__flag">🔵</span>
                <div class="lang-pick__info">
                  <span class="lang-pick__name">کورمانجی</span>
                  <span class="lang-pick__code">کورمانجی</span>
                </div>
              </label>
            </div>
            <div v-if="errors.contentLanguages" class="err">{{ errors.contentLanguages }}</div>
          </section>

          <!-- Bilingual Content -->
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
                <input v-model="form.ckbContent.title" class="inp" placeholder="ناونیشانی کتێب بە سۆرانی…" />
              </div>
              <div class="field">
                <label class="lbl">وەسف (سۆرانی)</label>
                <textarea v-model="form.ckbContent.description" class="inp ta" placeholder="کورتەیەکی کتێب…" rows="4"></textarea>
              </div>
              <div class="two-grid">
                <div class="field">
                  <label class="lbl">نووسەر (سۆرانی)</label>
                  <input v-model="form.ckbContent.writer" class="inp" placeholder="ناوی نووسەر…" />
                </div>
                <div class="field">
                  <label class="lbl">جۆر</label>
                  <input v-model="form.ckbContent.genre" class="inp" placeholder="بۆ نموونە: نوول، شیعر…" />
                </div>
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

            <div v-show="activeLang === 'KMR'" class="tab-panel">
              <div class="field">
                <label class="lbl lbl--req">ناونیشان (کورمانجی)</label>
                <input v-model="form.kmrContent.title" class="inp" placeholder="Sernavê kitêbê…" />
              </div>
              <div class="field">
                <label class="lbl">وەسف (کورمانجی)</label>
                <textarea v-model="form.kmrContent.description" class="inp ta" placeholder="Danasîna kitêbê…" rows="4"></textarea>
              </div>
              <div class="two-grid">
                <div class="field">
                  <label class="lbl">نووسەر (کورمانجی)</label>
                  <input v-model="form.kmrContent.writer" class="inp" placeholder="Navê nivîskar…" />
                </div>
                <div class="field">
                  <label class="lbl">جۆر</label>
                  <input v-model="form.kmrContent.genre" class="inp" placeholder="Mînak: Roman, Helbest…" />
                </div>
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

          <!-- Book Files -->
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
                      <path d="M12 18v-6"/><path d="M9 15l3 3 3-3"/>
                    </svg>
                    <span class="upload-zone__title">فایلی کتێب باربکە</span>
                    <span class="upload-zone__hint">PDF, DOCX, TXT, EPUB</span>
                  </div>
                </label>

                <div class="field mt-3">
                  <label class="lbl">یان لینکی فایل</label>
                  <input v-model="form.ckbContent.fileUrl" class="inp" placeholder="https://cdn.example.com/book.pdf" :disabled="!!ckbBookFile" />
                </div>

                <div class="two-grid mt-3">
                  <div class="field">
                    <label class="lbl">فۆرمات</label>
                    <select v-model="form.ckbContent.fileFormat" class="inp">
                      <option value="">هەڵبژێرە</option>
                      <option value="PDF">PDF</option>
                      <option value="DOCX">DOCX</option>
                      <option value="DOC">DOC</option>
                      <option value="TXT">TXT</option>
                      <option value="EPUB">EPUB</option>
                      <option value="OTHER">یتر</option>
                    </select>
                  </div>
                  <div class="field">
                    <label class="lbl">ژمارەی پەڕەکان</label>
                    <input v-model.number="form.ckbContent.pageCount" type="number" class="inp" placeholder="0" min="1" />
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
                      <path d="M12 18v-6"/><path d="M9 15l3 3 3-3"/>
                    </svg>
                    <span class="upload-zone__title">فایلی کتێب باربکە</span>
                    <span class="upload-zone__hint">PDF, DOCX, TXT, EPUB</span>
                  </div>
                </label>

                <div class="field mt-3">
                  <label class="lbl">یان لینکی فایل</label>
                  <input v-model="form.kmrContent.fileUrl" class="inp" placeholder="https://cdn.example.com/book.pdf" :disabled="!!kmrBookFile" />
                </div>

                <div class="two-grid mt-3">
                  <div class="field">
                    <label class="lbl">فۆرمات</label>
                    <select v-model="form.kmrContent.fileFormat" class="inp">
                      <option value="">هەڵبژێرە</option>
                      <option value="PDF">PDF</option>
                      <option value="DOCX">DOCX</option>
                      <option value="DOC">DOC</option>
                      <option value="TXT">TXT</option>
                      <option value="EPUB">EPUB</option>
                      <option value="OTHER">یتر</option>
                    </select>
                  </div>
                  <div class="field">
                    <label class="lbl">ژمارەی پەڕەکان</label>
                    <input v-model.number="form.kmrContent.pageCount" type="number" class="inp" placeholder="0" min="1" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Series Management -->
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
                  <span class="series-mode__desc">سەری نیە</span>
                </div>
              </label>

              <label class="series-mode" :class="{ 'series-mode--on': form.seriesMode === 'new-series' }">
                <input type="radio" value="new-series" v-model="form.seriesMode" />
                <div class="series-mode__icon">📚</div>
                <div class="series-mode__info">
                  <span class="series-mode__title">سەری نوێ</span>
                  <span class="series-mode__desc">یەکەمین کتێب</span>
                </div>
              </label>

              <label class="series-mode" :class="{ 'series-mode--on': form.seriesMode === 'add-to-series' }">
                <input type="radio" value="add-to-series" v-model="form.seriesMode" />
                <div class="series-mode__icon">➕</div>
                <div class="series-mode__info">
                  <span class="series-mode__title">زیادکردن بە سەر</span>
                  <span class="series-mode__desc">بە سەری هەبوو</span>
                </div>
              </label>
            </div>

            <Transition name="slide">
              <div v-if="form.seriesMode === 'new-series'" class="series-form">
                <div class="field">
                  <label class="lbl lbl--req">ناوی سەری</label>
                  <input v-model="form.seriesName" class="inp" placeholder="ناوی سەری کتێب…" />
                </div>
              </div>
            </Transition>

            <Transition name="slide">
              <div v-if="form.seriesMode === 'add-to-series'" class="series-form">
                <div class="field">
                  <label class="lbl lbl--req">سەری پاڵپشتوو</label>
                  <div v-if="seriesParentsLoading" class="topics-loading">
                    <div class="spinner spinner--dark"></div>
                    <span>سەریەکان بارکردن…</span>
                  </div>
                  <select v-else v-model.number="form.parentBookId" class="inp">
                    <option value="">سەری هەڵبژێرە…</option>
                    <option v-for="book in seriesParents" :key="book.id" :value="book.id">
                      {{ book.ckbContent?.title || book.kmrContent?.title || `کتێب #${book.id}` }}
                    </option>
                  </select>
                  <div v-if="errors.parentBookId" class="err">{{ errors.parentBookId }}</div>
                </div>

                <div class="field">
                  <label class="lbl">ناوی سەری (ئارەزوویانە)</label>
                  <input v-model="form.seriesName" class="inp" placeholder="یان ناوی سەری نوێ بنووسە…" />
                </div>
              </div>
            </Transition>

            <Transition name="slide">
              <div v-if="form.seriesMode !== 'standalone'" class="field mt-3">
                <label class="lbl lbl--req">ڕیزبەندی لە سەری</label>
                <input v-model.number="form.seriesOrder" type="number" class="inp" placeholder="1, 2, 3…" min="1" step="0.1" />
              </div>
            </Transition>
          </section>

          <!-- Publishing Info -->
          <section class="card">
            <div class="card__hd">
              <span class="card__hd-ico">🏛️</span>
              <span class="card__hd-title">زانیاری بڵاوکردنەوە</span>
            </div>
            <div class="institute-toggle">
              <div class="institute-toggle__info">
                <span class="institute-toggle__label">بڕیاری ناوەند</span>
                <span class="institute-toggle__hint">ئەم کتێبە لەلایەن ناوەندەوە بڵاوکراوەتەوە؟</span>
              </div>
              <button type="button" class="toggle" :class="{ 'toggle--on': form.publishedByInstitute }"
                @click="form.publishedByInstitute = !form.publishedByInstitute">
                <span class="toggle__dot"></span>
                {{ form.publishedByInstitute ? 'بەڵێ' : 'نەخێر' }}
              </button>
            </div>
          </section>

        </div>

        <!-- ═══════════════ SIDE COLUMN ═══════════════ -->
        <aside class="col-side">

          <!-- Cover Images (3 Slots) -->
          <section class="card card--covers">
            <div class="card__hd">
              <span class="card__hd-ico">🖼️</span>
              <span class="card__hd-title">وێنەی ڕووکار</span>
              <span class="card__hd-badge">3</span>
            </div>

            <div class="cover-tabs">
              <button type="button" class="cover-tab" :class="{ 'cover-tab--on': coverTab === 'ckb' }" @click="coverTab = 'ckb'">
                <span class="cover-tab__dot" style="background: #c8a800;"></span>
                سۆرانی
              </button>
              <button type="button" class="cover-tab" :class="{ 'cover-tab--on': coverTab === 'kmr' }" @click="coverTab = 'kmr'">
                <span class="cover-tab__dot" style="background: #4a7af0;"></span>
                کورمانجی
              </button>
              <button type="button" class="cover-tab" :class="{ 'cover-tab--on': coverTab === 'hover' }" @click="coverTab = 'hover'">
                <span class="cover-tab__dot" style="background: #7c3aed;"></span>
                ماووس
              </button>
            </div>

            <!-- CKB Cover -->
            <div v-show="coverTab === 'ckb'" class="cover-panel">
              <div v-if="ckbCoverPreview || form.ckbContent.coverUrl" class="cover-preview-large">
                <img :src="ckbCoverPreview || form.ckbContent.coverUrl" alt="وێنەی ڕووکاری سۆرانی" />
                <button type="button" class="cover-preview-large__remove" @click="removeCkbCover">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
              <label v-else class="upload-zone upload-zone--cover">
                <input type="file" accept="image/*" @change="onCkbCover" style="display:none;" />
                <div class="upload-zone__inner">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                  </svg>
                  <span>وێنەی ڕووکاری سۆرانی</span>
                </div>
              </label>
              <div class="field mt-3">
                <label class="lbl">یان URL</label>
                <input v-model="form.ckbContent.coverUrl" class="inp" placeholder="https://…" :disabled="!!ckbCoverFile" />
              </div>
            </div>

            <!-- KMR Cover -->
            <div v-show="coverTab === 'kmr'" class="cover-panel">
              <div v-if="kmrCoverPreview || form.kmrContent.coverUrl" class="cover-preview-large">
                <img :src="kmrCoverPreview || form.kmrContent.coverUrl" alt="وێنەی ڕووکاری کورمانجی" />
                <button type="button" class="cover-preview-large__remove" @click="removeKmrCover">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
              <label v-else class="upload-zone upload-zone--cover">
                <input type="file" accept="image/*" @change="onKmrCover" style="display:none;" />
                <div class="upload-zone__inner">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                  </svg>
                  <span>وێنەی ڕووکاری کورمانجی</span>
                </div>
              </label>
              <div class="field mt-3">
                <label class="lbl">یان URL</label>
                <input v-model="form.kmrContent.coverUrl" class="inp" placeholder="https://…" :disabled="!!kmrCoverFile" />
              </div>
            </div>

            <!-- Hover Cover -->
            <div v-show="coverTab === 'hover'" class="cover-panel">
              <div v-if="hoverPreview || form.hoverCoverUrl" class="cover-preview-large cover-preview-large--hover">
                <img :src="hoverPreview || form.hoverCoverUrl" alt="وێنەی ماووس" />
                <div class="cover-preview-large__badge">H</div>
                <button type="button" class="cover-preview-large__remove" @click="removeHoverCover">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
              <label v-else class="upload-zone upload-zone--cover upload-zone--hover">
                <input type="file" accept="image/*" @change="onHoverCover" style="display:none;" />
                <div class="upload-zone__inner">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                  </svg>
                  <span>وێنەی ماووس</span>
                  <small>دەرکەوتن لەسەر ماووس</small>
                </div>
              </label>
              <div class="field mt-3">
                <label class="lbl">یان URL</label>
                <input v-model="form.hoverCoverUrl" class="inp" placeholder="https://…" :disabled="!!hoverCoverFile" />
              </div>
            </div>
          </section>

          <!-- Submit Actions -->
          <div class="side-actions">
            <button type="submit" class="btn btn--primary btn--full" :disabled="saving">
              <span v-if="saving" class="spinner"></span>
              <span v-else>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </span>
              {{ saving ? 'پاشەکەوتکردن…' : (isEdit ? 'نوێکردنەوە' : 'دروستکردن') }}
            </button>
            <RouterLink to="/admin/writings" class="btn btn--ghost btn--full">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
              هەڵوەشاندنەوە
            </RouterLink>
          </div>

          <!-- Danger Zone -->
          <section v-if="isEdit" class="card card--danger">
            <div class="card__hd card__hd--danger">
              <span class="card__hd-ico">⚠️</span>
              <span class="card__hd-title">ناوچەی مەترسیدار</span>
            </div>
            <p class="danger-text">
              سڕینەوەی کتێب ناگەڕێتەوە.
              <span v-if="form.seriesMode !== 'standalone'" class="text-danger">
                ئەم کتێبە بەشێکە لە سەری!
              </span>
            </p>
            <button type="button" class="btn btn--danger btn--full" @click="doDelete">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                <path d="M10 11v6M14 11v6"/>
              </svg>
              سڕینەوەی کتێب
            </button>
          </section>

        </aside>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, defineComponent, h } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/api.js'

// ── Inline TagInput ────────────────────────────────────────────────────────────
const TagInput = defineComponent({
  name: 'TagInput',
  props: {
    modelValue: { type: Array, default: () => [] },
    placeholder: { type: String, default: 'زیاد بکە…' },
    color: { type: String, default: 'gold' },
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
      const arr = [...props.modelValue]; arr.splice(i, 1); emit('update:modelValue', arr)
    }
    return () => h('div', { class: 'tag-input' }, [
      h('div', { class: 'tag-input__tags' }, [
        ...props.modelValue.map((t, i) =>
          h('span', { class: `tag-input__tag tag-input__tag--${props.color}`, key: t }, [
            t,
            h('button', { type: 'button', class: 'tag-input__remove', onClick: () => rem(i) }, '×')
          ])
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

// ── Setup ─────────────────────────────────────────────────────────────────────
const route   = useRoute()
const router  = useRouter()

const isEdit         = computed(() => !!route.params.id)
const activeLang     = ref('CKB')
const fileActiveLang = ref('CKB')
const coverTab       = ref('ckb')
const fetching       = ref(false)
const saving         = ref(false)
const toast          = reactive({ show: false, type: 'success', msg: '' })
const errors         = ref({})

// Cover files
const ckbCoverFile    = ref(null)
const kmrCoverFile    = ref(null)
const hoverCoverFile  = ref(null)
const ckbCoverPreview = ref('')
const kmrCoverPreview = ref('')
const hoverPreview    = ref('')

// Book files
const ckbBookFile    = ref(null)
const kmrBookFile    = ref(null)
const ckbFilePreview = ref(null)
const kmrFilePreview = ref(null)

// Topic & series
const topicMode            = ref('none')
const topics               = ref([])
const topicsLoading        = ref(false)
const currentTopicName     = ref('')
const seriesParents        = ref([])
const seriesParentsLoading = ref(false)

const writingTopics = [
  { value: 'NOVEL',   label: 'نوول',    color: '#8C1515' },
  { value: 'POETRY',  label: 'شیعر',    color: '#c8a800' },
  { value: 'STORY',   label: 'چیرۆک',   color: '#4a7af0' },
  { value: 'HISTORY', label: 'مێژوو',   color: '#7c3aed' },
  { value: 'OTHER',   label: 'یتر',     color: '#767571' },
]

const form = reactive({
  writingTopic: '',
  contentLanguages: ['CKB'],
  topicId: null,
  newTopic: { nameCkb: '', nameKmr: '' },
  clearTopic: false,
  ckbContent: { title: '', description: '', writer: '', genre: '', fileUrl: '', fileFormat: '', pageCount: null, coverUrl: '' },
  kmrContent: { title: '', description: '', writer: '', genre: '', fileUrl: '', fileFormat: '', pageCount: null, coverUrl: '' },
  tagsCkb: [], tagsKmr: [],
  keywordsCkb: [], keywordsKmr: [],
  seriesMode: 'standalone',
  seriesName: '',
  parentBookId: '',
  seriesOrder: null,
  publishedByInstitute: false,
  hoverCoverUrl: '',
})

// ── Loaders ───────────────────────────────────────────────────────────────────
const loadTopics = async () => {
  topicsLoading.value = true
  try {
    const { data } = await api.get('/api/v1/topics?type=WRITING')
    topics.value = data?.data ?? data ?? []
  } catch { topics.value = [] }
  finally { topicsLoading.value = false }
}

const loadSeriesParents = async () => {
  seriesParentsLoading.value = true
  try {
    const { data } = await api.get('/api/v1/writings?seriesRoot=true')
    seriesParents.value = data?.data ?? data ?? []
  } catch { seriesParents.value = [] }
  finally { seriesParentsLoading.value = false }
}

const loadWriting = async () => {
  if (!isEdit.value) return
  fetching.value = true
  try {
    const { data } = await api.get(`/api/v1/writings/${route.params.id}`)
    applyWriting(data?.data ?? data)
  } catch (e) {
    showToast('error', 'داتا هێنان سەرنەکەوت: ' + (e?.response?.data?.message || e.message))
  } finally { fetching.value = false }
}

const applyWriting = (w) => {
  if (!w) return
  form.writingTopic         = w.writingTopic || ''
  form.contentLanguages     = [...(w.contentLanguages || ['CKB'])]
  activeLang.value          = form.contentLanguages[0] || 'CKB'
  fileActiveLang.value      = form.contentLanguages[0] || 'CKB'
  form.publishedByInstitute = w.publishedByInstitute || false
  form.hoverCoverUrl        = w.hoverCoverUrl || ''
  if (w.ckbContent) Object.assign(form.ckbContent, w.ckbContent)
  if (w.kmrContent) Object.assign(form.kmrContent, w.kmrContent)
  form.tagsCkb     = [...(w.tagsCkb || [])]
  form.tagsKmr     = [...(w.tagsKmr || [])]
  form.keywordsCkb = [...(w.keywordsCkb || [])]
  form.keywordsKmr = [...(w.keywordsKmr || [])]
  if (w.topicId) {
    topicMode.value        = 'existing'
    form.topicId           = w.topicId
    currentTopicName.value = w.topicNameCkb || w.topicNameKmr || ''
  }
  if (w.parentBookId) {
    form.seriesMode   = 'add-to-series'
    form.parentBookId = w.parentBookId
    form.seriesName   = w.seriesName || ''
    form.seriesOrder  = w.seriesOrder || null
  } else if (w.seriesName) {
    form.seriesMode  = 'new-series'
    form.seriesName  = w.seriesName
    form.seriesOrder = w.seriesOrder || null
  }
}

// ── Cover handlers ────────────────────────────────────────────────────────────
const onCkbCover   = (e) => { const f = e.target.files?.[0]; if (!f) return; ckbCoverFile.value = f; ckbCoverPreview.value = URL.createObjectURL(f); form.ckbContent.coverUrl = '' }
const onKmrCover   = (e) => { const f = e.target.files?.[0]; if (!f) return; kmrCoverFile.value = f; kmrCoverPreview.value = URL.createObjectURL(f); form.kmrContent.coverUrl = '' }
const onHoverCover = (e) => { const f = e.target.files?.[0]; if (!f) return; hoverCoverFile.value = f; hoverPreview.value = URL.createObjectURL(f); form.hoverCoverUrl = '' }
const removeCkbCover   = () => { ckbCoverFile.value = null;   ckbCoverPreview.value = '';  form.ckbContent.coverUrl = '' }
const removeKmrCover   = () => { kmrCoverFile.value = null;   kmrCoverPreview.value = '';  form.kmrContent.coverUrl = '' }
const removeHoverCover = () => { hoverCoverFile.value = null; hoverPreview.value = '';     form.hoverCoverUrl = '' }

// ── Book file handlers ────────────────────────────────────────────────────────
const onCkbFile    = (e) => { const f = e.target.files?.[0]; if (!f) return; ckbBookFile.value = f; ckbFilePreview.value = f; form.ckbContent.fileUrl = '' }
const onKmrFile    = (e) => { const f = e.target.files?.[0]; if (!f) return; kmrBookFile.value = f; kmrFilePreview.value = f; form.kmrContent.fileUrl = '' }
const removeCkbFile = () => { ckbBookFile.value = null; ckbFilePreview.value = null }
const removeKmrFile = () => { kmrBookFile.value = null; kmrFilePreview.value = null }

const fmtBytes = (b) => {
  if (!b) return '—'
  if (b < 1024) return b + ' B'
  if (b < 1048576) return (b / 1024).toFixed(1) + ' KB'
  return (b / 1048576).toFixed(1) + ' MB'
}

// ── Validation ────────────────────────────────────────────────────────────────
const validate = () => {
  const e = {}
  if (!form.writingTopic)               e.writingTopic = 'بابەتی نووسین پێویستە'
  if (!form.contentLanguages.length)    e.contentLanguages = 'کەمی یەک زمانیکی هەڵبژێرە'
  if (form.contentLanguages.includes('CKB') && !form.ckbContent.title.trim()) e.titles = 'ناونیشانی سۆرانی پێویستە'
  if (form.contentLanguages.includes('KMR') && !form.kmrContent.title.trim()) e.titles = 'ناونیشانی کورمانجی پێویستە'
  if (form.seriesMode === 'add-to-series' && !form.parentBookId)  e.parentBookId = 'سەری پاڵپشتوو پێویستە'
  if (topicMode.value === 'new' && !form.newTopic.nameCkb.trim() && !form.newTopic.nameKmr.trim()) e.newTopic = 'ناوی بابەت پێویستە'
  errors.value = e
  return !Object.keys(e).length
}

// ── Submit ────────────────────────────────────────────────────────────────────
const submit = async () => {
  if (!validate()) { window.scrollTo({ top: 0, behavior: 'smooth' }); return }
  saving.value = true

  const dto = {
    writingTopic:         form.writingTopic,
    contentLanguages:     form.contentLanguages,
    publishedByInstitute: form.publishedByInstitute,
    hoverCoverUrl:        form.hoverCoverUrl || null,
    ckbContent:           form.contentLanguages.includes('CKB') ? form.ckbContent : null,
    kmrContent:           form.contentLanguages.includes('KMR') ? form.kmrContent : null,
    tagsCkb:              form.tagsCkb,
    tagsKmr:              form.tagsKmr,
    keywordsCkb:          form.keywordsCkb,
    keywordsKmr:          form.keywordsKmr,
    topicId:              topicMode.value === 'existing' ? form.topicId : null,
    newTopic:             topicMode.value === 'new'      ? form.newTopic : null,
    clearTopic:           form.clearTopic,
    seriesName:           form.seriesMode !== 'standalone'       ? form.seriesName  : null,
    seriesOrder:          form.seriesMode !== 'standalone'       ? form.seriesOrder : null,
    parentBookId:         form.seriesMode === 'add-to-series'    ? form.parentBookId : null,
  }

  const fd = new FormData()
  fd.append('data', new Blob([JSON.stringify(dto)], { type: 'application/json' }))
  if (ckbCoverFile.value)  fd.append('ckbCover',  ckbCoverFile.value)
  if (kmrCoverFile.value)  fd.append('kmrCover',  kmrCoverFile.value)
  if (hoverCoverFile.value) fd.append('hoverCover', hoverCoverFile.value)
  if (ckbBookFile.value)   fd.append('ckbFile',   ckbBookFile.value)
  if (kmrBookFile.value)   fd.append('kmrFile',   kmrBookFile.value)

  try {
    if (isEdit.value) {
      await api.put(`/api/v1/writings/${route.params.id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
    } else {
      await api.post('/api/v1/writings', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
    }
    showToast('success', isEdit.value ? 'کتێبەکە نوێکرایەوە ✓' : 'کتێبەکە دروستکرا ✓')
    setTimeout(() => router.push('/admin/writings'), 1200)
  } catch (e) {
    showToast('error', e?.response?.data?.message || e.message || 'هەڵەیەک ڕوویدا')
  } finally { saving.value = false }
}

const doDelete = async () => {
  if (!confirm(`دڵنیای لە سڕینەوەی کتێب #${route.params.id}؟`)) return
  try {
    await api.delete(`/api/v1/writings/${route.params.id}`)
    showToast('success', 'کتێبەکە سڕایەوە')
    setTimeout(() => router.push('/admin/writings'), 800)
  } catch (e) { showToast('error', e?.response?.data?.message || 'سڕینەوە سەرنەکەوت') }
}

const showToast = (type, msg) => {
  toast.show = true; toast.type = type; toast.msg = msg
  setTimeout(() => { toast.show = false }, 4000)
}

onMounted(() => {
  loadTopics()
  loadSeriesParents()
  loadWriting()
})
</script>

<style scoped>
/* CSS Variables */
:root {
  --crimson: #8C1515;
  --crimson-lt: #A61C1C;
  --gold: #C8A800;
  --blue: #4A7AF0;
  --purple: #7C3AED;
  --text: #2E2D29;
  --muted: #767571;
  --border: #E0DFDC;
  --cream: #FAFAF9;
  --cream-dk: #F0EEEB;
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --transition: all 0.2s ease;
}

.wed {
  direction: rtl;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Header */
.wed__head { display: flex; align-items: center; gap: 1.25rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
.wed__back {
  display: inline-flex; align-items: center; gap: 0.4rem; color: var(--muted);
  text-decoration: none; font-weight: 600; font-size: 0.87rem; padding: 0.5rem 0.8rem;
  border-radius: var(--radius-sm); border: 1px solid var(--border); background: white; transition: var(--transition);
}
.wed__back:hover { color: var(--crimson); border-color: var(--crimson); transform: translateX(-2px); }
.wed__title { font-size: 1.5rem; font-weight: 800; color: var(--text); margin: 0; }
.wed__sub { font-size: 0.8rem; color: var(--muted); margin: 0.25rem 0 0; }

/* Toast */
.toast {
  display: flex; align-items: center; gap: 0.65rem; padding: 0.9rem 1.1rem;
  border-radius: var(--radius-sm); font-weight: 600; font-size: 0.9rem;
  margin-bottom: 1rem; animation: slideDown 0.3s ease;
}
.toast--success { background: rgba(22,120,70,0.1); border: 1px solid rgba(22,120,70,0.2); color: #166044; }
.toast--error   { background: rgba(140,21,21,0.08); border: 1px solid rgba(140,21,21,0.2); color: var(--crimson); }

/* Loading */
.loading-bar {
  height: 3px; border-radius: 2px; margin-bottom: 1rem;
  background: linear-gradient(90deg, var(--crimson), var(--gold), var(--crimson));
  background-size: 200% 100%; animation: shimmer 1.2s linear infinite;
}
@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
@keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }

/* Layout */
.wed__layout { display: grid; grid-template-columns: 1fr 360px; gap: 1.5rem; align-items: start; }
@media (max-width: 900px) { .wed__layout { grid-template-columns: 1fr; } }

/* Cards */
.card {
  background: white; border: 1px solid var(--border); border-radius: var(--radius-md);
  padding: 1.5rem; margin-bottom: 1.25rem; box-shadow: 0 2px 8px rgba(0,0,0,0.04); transition: var(--transition);
}
.card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.06); }
.card--danger { border-color: rgba(140,21,21,0.2); background: rgba(140,21,21,0.02); }
.card--covers { padding: 1.25rem; }
.card__hd {
  display: flex; align-items: center; gap: 0.6rem; margin-bottom: 1.25rem;
  padding-bottom: 0.75rem; border-bottom: 1px solid var(--cream-dk);
}
.card__hd-title { font-weight: 700; font-size: 1rem; color: var(--text); flex: 1; }
.card__hd-ico   { font-size: 1.1rem; }
.card__hd-badge { background: var(--cream-dk); color: var(--muted); padding: 0.2rem 0.6rem; border-radius: 20px; font-size: 0.75rem; font-weight: 700; }
.card__hd--danger { color: var(--crimson); border-bottom-color: rgba(140,21,21,0.1); }

/* Fields */
.field { margin-bottom: 1rem; }
.lbl { display: block; font-weight: 700; font-size: 0.85rem; color: var(--text); margin-bottom: 0.5rem; }
.lbl--req::after { content: ' *'; color: var(--crimson); }
.inp {
  width: 100%; padding: 0.75rem 1rem; border: 1.5px solid var(--border);
  border-radius: var(--radius-sm); background: var(--cream); color: var(--text);
  font-size: 0.9rem; font-family: inherit; transition: var(--transition);
}
.inp:focus { outline: none; background: white; border-color: var(--crimson); box-shadow: 0 0 0 3px rgba(140,21,21,0.1); }
.inp:disabled { opacity: 0.6; cursor: not-allowed; }
.ta { min-height: 120px; resize: vertical; line-height: 1.6; }
.two-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
@media (max-width: 600px) { .two-grid { grid-template-columns: 1fr; } }
.err { color: #dc2626; font-size: 0.8rem; font-weight: 600; margin-top: 0.25rem; }
.mt-3 { margin-top: 0.75rem; }
.text-danger { color: var(--crimson); font-weight: 600; }
.danger-text { color: var(--muted); font-size: 0.85rem; line-height: 1.6; margin-bottom: 1rem; }

/* Topic Select Grid */
.topic-select-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 0.75rem; }
.topic-card {
  display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem;
  border: 1.5px solid var(--border); border-radius: var(--radius-sm);
  cursor: pointer; transition: var(--transition); background: white;
}
.topic-card:hover { border-color: var(--crimson); transform: translateY(-1px); }
.topic-card--active { border-color: var(--crimson); background: rgba(140,21,21,0.04); }
.topic-card__input { display: none; }
.topic-card__dot   { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
.topic-card__label { font-size: 0.85rem; font-weight: 600; }

/* State Picks */
.state-picks { display: flex; gap: 0.75rem; flex-wrap: wrap; }
.state-pick {
  display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.65rem 1rem;
  border-radius: var(--radius-sm); border: 1.5px solid var(--border);
  cursor: pointer; transition: var(--transition); font-weight: 600; font-size: 0.9rem; background: white;
}
.state-pick input { display: none; }
.state-pick:hover  { border-color: var(--crimson); }
.state-pick--on    { background: rgba(140,21,21,0.06); border-color: var(--crimson); color: var(--crimson); }
.state-pick__flag  { font-size: 1.1rem; }

/* Language Picks */
.lang-picks { display: flex; gap: 1rem; }
.lang-pick {
  flex: 1; display: flex; align-items: center; gap: 0.75rem; padding: 1rem;
  border: 2px solid var(--border); border-radius: var(--radius-sm);
  cursor: pointer; transition: var(--transition); background: white;
}
.lang-pick input  { display: none; }
.lang-pick:hover  { border-color: var(--crimson); }
.lang-pick--on    { border-color: var(--crimson); background: rgba(140,21,21,0.04); }
.lang-pick__flag  { font-size: 1.5rem; }
.lang-pick__info  { display: flex; flex-direction: column; }
.lang-pick__name  { font-weight: 700; font-size: 1rem; color: var(--text); }
.lang-pick__code  { font-size: 0.75rem; color: var(--muted); font-weight: 600; }

/* Tabs */
.tabs { display: flex; gap: 0.25rem; margin-bottom: 1.25rem; border-bottom: 2px solid var(--border); }
.tab {
  padding: 0.75rem 1.25rem; border: none; background: none; color: var(--muted);
  font-weight: 700; font-size: 0.9rem; cursor: pointer; border-bottom: 2px solid transparent;
  margin-bottom: -2px; transition: var(--transition); display: inline-flex; align-items: center;
  gap: 0.5rem; font-family: inherit;
}
.tab--on  { color: var(--crimson); border-bottom-color: var(--crimson); background: rgba(140,21,21,0.04); }
.tab__pip { width: 8px; height: 8px; border-radius: 50%; }
.tab__pip--ckb { background: var(--gold); }
.tab__pip--kmr { background: var(--blue); }

/* File Upload */
.file-lang-tabs { display: flex; gap: 0.5rem; margin-bottom: 1rem; }
.file-lang-tab {
  padding: 0.5rem 1rem; border: none; background: var(--cream-dk); color: var(--muted);
  font-weight: 600; border-radius: var(--radius-sm); cursor: pointer; transition: var(--transition); font-family: inherit;
}
.file-lang-tab--on { background: var(--crimson); color: white; }

.file-upload-section {
  padding: 1rem; background: var(--cream); border-radius: var(--radius-sm); border: 1px solid var(--border);
}
.file-preview-box {
  display: flex; align-items: center; gap: 1rem; padding: 1rem; background: white;
  border: 2px solid rgba(22,120,70,0.2); border-radius: var(--radius-sm);
}
.file-preview-box__icon { font-size: 2rem; }
.file-preview-box__info { flex: 1; }
.file-preview-box__name { font-weight: 700; color: var(--text); margin-bottom: 0.25rem; }
.file-preview-box__size { font-size: 0.8rem; color: var(--muted); }
.file-preview-box__remove {
  width: 32px; height: 32px; border-radius: 50%; border: none;
  background: rgba(220,38,38,0.1); color: #dc2626; cursor: pointer;
  display: flex; align-items: center; justify-content: center; transition: var(--transition);
}
.file-preview-box__remove:hover { background: #dc2626; color: white; }

/* Upload Zones */
.upload-zone {
  display: block; border: 2px dashed var(--border); border-radius: var(--radius-sm);
  cursor: pointer; transition: var(--transition); background: white;
}
.upload-zone:hover { border-color: var(--crimson); background: rgba(140,21,21,0.02); }
.upload-zone--cover { aspect-ratio: 3/4; max-height: 300px; }
.upload-zone--hover { border-color: var(--purple); background: rgba(124,58,237,0.02); }
.upload-zone--hover:hover { border-color: var(--purple); background: rgba(124,58,237,0.05); }
.upload-zone__inner {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 0.75rem; padding: 2rem 1rem; text-align: center; color: var(--muted); height: 100%;
}
.upload-zone__title { font-weight: 700; font-size: 1rem; color: var(--text); }
.upload-zone__hint  { font-size: 0.8rem; }

/* Series Modes */
.series-modes { display: grid; grid-template-columns: repeat(3,1fr); gap: 0.75rem; margin-bottom: 1rem; }
@media (max-width: 600px) { .series-modes { grid-template-columns: 1fr; } }
.series-mode {
  display: flex; flex-direction: column; align-items: center; gap: 0.5rem;
  padding: 1.25rem 1rem; border: 2px solid var(--border); border-radius: var(--radius-sm);
  cursor: pointer; transition: var(--transition); background: white; text-align: center;
}
.series-mode input     { display: none; }
.series-mode:hover     { border-color: var(--crimson); transform: translateY(-2px); }
.series-mode--on       { border-color: var(--crimson); background: rgba(140,21,21,0.04); }
.series-mode__icon     { font-size: 2rem; }
.series-mode__info     { display: flex; flex-direction: column; gap: 0.25rem; }
.series-mode__title    { font-weight: 700; font-size: 0.95rem; color: var(--text); }
.series-mode__desc     { font-size: 0.8rem; color: var(--muted); }
.series-form {
  padding: 1.25rem; background: rgba(140,21,21,0.04); border: 1px solid rgba(140,21,21,0.1);
  border-radius: var(--radius-sm); margin-top: 1rem; animation: slideDown 0.3s ease;
}

/* Institute Toggle */
.institute-toggle {
  display: flex; align-items: center; justify-content: space-between;
  padding: 1rem; background: var(--cream); border-radius: var(--radius-sm); border: 1px solid var(--border);
}
.institute-toggle__info  { display: flex; flex-direction: column; gap: 0.25rem; }
.institute-toggle__label { font-weight: 700; color: var(--text); }
.institute-toggle__hint  { font-size: 0.8rem; color: var(--muted); }

/* Toggle */
.toggle {
  display: inline-flex; align-items: center; gap: 0.6rem; padding: 0.6rem 1.2rem;
  border-radius: 20px; border: 1.5px solid var(--border); background: white; color: var(--muted);
  cursor: pointer; transition: var(--transition); font-weight: 700; font-family: inherit;
  min-width: 100px; justify-content: center;
}
.toggle:hover    { border-color: rgba(140,21,21,0.3); }
.toggle--on      { background: rgba(22,120,70,0.1); border-color: rgba(22,120,70,0.3); color: #166044; }
.toggle__dot     { width: 10px; height: 10px; border-radius: 50%; background: var(--border); transition: var(--transition); }
.toggle--on .toggle__dot { background: #22a06b; }

/* Cover Tabs */
.cover-tabs {
  display: flex; gap: 0.25rem; margin-bottom: 1rem;
  background: var(--cream); padding: 0.25rem; border-radius: var(--radius-sm);
}
.cover-tab {
  flex: 1; display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem;
  padding: 0.6rem; border: none; background: transparent; color: var(--muted);
  font-weight: 600; font-size: 0.85rem; cursor: pointer; border-radius: 6px; transition: var(--transition); font-family: inherit;
}
.cover-tab--on  { background: white; color: var(--text); box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
.cover-tab__dot { width: 8px; height: 8px; border-radius: 50%; }
.cover-panel    { animation: fadeIn 0.3s ease; }

/* Cover Preview */
.cover-preview-large {
  position: relative; border-radius: var(--radius-sm); overflow: hidden;
  border: 1px solid var(--border); aspect-ratio: 3/4; background: var(--cream);
}
.cover-preview-large img { width: 100%; height: 100%; object-fit: cover; display: block; }
.cover-preview-large--hover { border-color: var(--purple); border-style: dashed; }
.cover-preview-large__badge {
  position: absolute; top: 0.5rem; right: 0.5rem; width: 24px; height: 24px;
  background: var(--purple); color: white; border-radius: 50%;
  display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.75rem;
}
.cover-preview-large__remove {
  position: absolute; top: 0.5rem; left: 0.5rem; width: 32px; height: 32px;
  border-radius: 50%; border: none; background: rgba(0,0,0,0.6); color: white;
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  transition: var(--transition); backdrop-filter: blur(4px);
}
.cover-preview-large__remove:hover { background: #dc2626; transform: scale(1.1); }

/* Topics */
.topics-loading   { display: flex; align-items: center; gap: 0.5rem; color: var(--muted); font-size: 0.9rem; padding: 0.75rem; }
.topic-hint       { display: flex; align-items: center; gap: 0.5rem; font-size: 0.8rem; color: var(--muted); background: var(--cream); padding: 0.75rem; border-radius: var(--radius-sm); margin-top: 0.75rem; }

/* Side Actions */
.side-actions { display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 1.25rem; }

/* Buttons */
.btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem;
  padding: 0.85rem 1.25rem; border-radius: var(--radius-sm); font-weight: 700; font-size: 0.9rem;
  cursor: pointer; border: 1px solid transparent; transition: var(--transition); text-decoration: none; font-family: inherit;
}
.btn--primary { background: var(--crimson); color: white; box-shadow: 0 4px 12px rgba(140,21,21,0.25); }
.btn--primary:hover:not(:disabled) { background: var(--crimson-lt); transform: translateY(-1px); box-shadow: 0 6px 16px rgba(140,21,21,0.3); }
.btn--ghost   { background: transparent; border-color: var(--border); color: var(--text); }
.btn--ghost:hover { border-color: var(--crimson); color: var(--crimson); background: rgba(140,21,21,0.04); }
.btn--danger  { background: #dc2626; color: white; }
.btn--danger:hover { background: #b91c1c; }
.btn--full    { width: 100%; }
.btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none !important; }

/* Spinner */
.spinner { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; }
.spinner--dark { border-color: var(--border); border-top-color: var(--crimson); width: 20px; height: 20px; }
@keyframes spin { to { transform: rotate(360deg); } }

/* Transitions */
.slide-enter-active, .slide-leave-active { transition: all 0.3s ease; max-height: 500px; overflow: hidden; }
.slide-enter-from, .slide-leave-to       { opacity: 0; max-height: 0; margin-top: 0; margin-bottom: 0; padding-top: 0; padding-bottom: 0; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
</style>

<style>
/* Tag Input (global) */
.tag-input { width: 100%; }
.tag-input__tags {
  display: flex; flex-wrap: wrap; gap: 0.5rem; align-items: center;
  border: 1.5px solid var(--border); border-radius: var(--radius-sm);
  padding: 0.5rem; background: var(--cream); min-height: 46px; transition: all 0.2s ease;
}
.tag-input__tags:focus-within { border-color: var(--crimson); background: white; box-shadow: 0 0 0 3px rgba(140,21,21,0.1); }
.tag-input__tag {
  display: inline-flex; align-items: center; gap: 0.25rem; padding: 0.35rem 0.75rem;
  border-radius: 20px; font-size: 0.85rem; font-weight: 600; animation: tagIn 0.2s ease;
}
@keyframes tagIn { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } }
.tag-input__tag--gold { background: rgba(200,168,0,0.15); color: #7a6200; border: 1px solid rgba(200,168,0,0.3); }
.tag-input__tag--blue { background: rgba(74,122,240,0.15); color: #2848b0; border: 1px solid rgba(74,122,240,0.3); }
.tag-input__remove { background: none; border: none; cursor: pointer; color: inherit; opacity: 0.6; font-size: 1.1rem; line-height: 1; padding: 0 0.25rem; }
.tag-input__remove:hover { opacity: 1; }
.tag-input__inp { border: none; outline: none; background: none; font-family: inherit; font-size: 0.9rem; min-width: 120px; flex: 1; color: var(--text); }
</style>