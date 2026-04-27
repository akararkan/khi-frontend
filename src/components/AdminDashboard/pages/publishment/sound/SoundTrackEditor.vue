<template>
  <div class="ste" dir="rtl">
 
    <!-- Header -->
    <div class="ste__head">
      <RouterLink to="/admin/sound-tracks" class="ste__back">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5M12 5l-7 7 7 7"/>
        </svg>
        گەڕانەوە
      </RouterLink>
      <div>
        <h1 class="ste__title">{{ isEdit ? 'دەستکاری دەنگ' : 'دەنگی نوێ' }}</h1>
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
 
          <!-- Sound Type -->
          <section class="card">
            <div class="card__hd"><span class="card__hd-ico">🎵</span> جۆری دەنگ</div>
            <div class="field">
              <label class="lbl lbl--req">جۆری دەنگ</label>
              <input
                v-model.trim="form.soundType"
                class="inp"
                placeholder="جۆری دەنگ بنووسە… (نمونە: LAWK / HAIRAN / any custom type)"
                list="sound-type-options"
              />
              <datalist id="sound-type-options">
                <option value="LAWK"></option>
                <option value="HAIRAN"></option>
              </datalist>
            </div>
            <div v-if="errors.soundType" class="err">{{ errors.soundType }}</div>
          </section>
 
          <!-- Track State -->
          <section class="card">
            <div class="card__hd"><span class="card__hd-ico">📼</span> دۆخی فایل</div>
            <div class="state-picks">
              <label class="state-pick" :class="{ 'state-pick--on': form.trackState === 'SINGLE' }">
                <input type="radio" value="SINGLE" v-model="form.trackState" />
                <span class="state-pick__flag">🟢</span>
                تاک دەنگ <span class="state-pick__code">SINGLE</span>
              </label>
              <label class="state-pick" :class="{ 'state-pick--on': form.trackState === 'MULTI' }">
                <input type="radio" value="MULTI" v-model="form.trackState" />
                <span class="state-pick__flag">🟣</span>
                چند دەنگ <span class="state-pick__code">MULTI</span>
              </label>
            </div>
            <div v-if="errors.trackState" class="err">{{ errors.trackState }}</div>
 
            <Transition name="slide">
              <div v-if="form.trackState === 'MULTI'" class="album-memories-section">
                <div class="album-memories-divider"></div>
                <div class="album-memories-wrap">
                  <div class="album-memories-info">
                    <span class="album-memories-label">ئەلبوومی بیرەوەرییەکان؟</span>
                    <span class="album-memories-hint">ئەگەر ئەم کۆمەڵە دەنگە ئەلبوومی بیرەوەرییەکانە، چالاکی بکە</span>
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
                <input type="radio" value="none" v-model="topicMode" />بێ بابەت
              </label>
              <label class="state-pick" :class="{ 'state-pick--on': topicMode === 'existing' }">
                <input type="radio" value="existing" v-model="topicMode" />بابەتی هەبوو
              </label>
              <label class="state-pick" :class="{ 'state-pick--on': topicMode === 'new' }">
                <input type="radio" value="new" v-model="topicMode" />بابەتی نوێ دروستبکە
              </label>
            </div>
            <div v-if="topicMode === 'existing'" class="field" style="margin-top:.9rem">
              <label class="lbl lbl--req">بابەت هەڵبژێرە</label>
              <select v-model="form.topicId" class="inp">
                <option :value="null">— هیچ —</option>
                <option v-for="tp in topics" :key="tp.id" :value="tp.id">{{ tp.nameCkb || tp.nameKmr || `#${tp.id}` }}</option>
              </select>
              <div v-if="errors.topicId" class="err">{{ errors.topicId }}</div>
            </div>
            <div v-if="topicMode === 'new'" style="margin-top:.9rem">
              <div class="two-grid">
                <div class="field"><label class="lbl">ناوی بابەت (سۆرانی)</label><input v-model.trim="form.newTopic.nameCkb" class="inp" placeholder="ناوی بابەت بە سۆرانی…" /></div>
                <div class="field"><label class="lbl">ناوی بابەت (کورمانجی)</label><input v-model.trim="form.newTopic.nameKmr" class="inp" placeholder="Navê mijarê bi Kurmancî…" /></div>
              </div>
              <div v-if="errors.newTopic" class="err">{{ errors.newTopic }}</div>
            </div>
            <div v-if="isEdit && topicMode === 'existing'" style="margin-top:.75rem">
              <label class="lang-pick" :class="{ 'lang-pick--on': form.clearTopic }">
                <input type="checkbox" v-model="form.clearTopic" /><span>سڕینەوەی بابەتی ئێستا</span>
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
              <button v-for="lang in form.contentLanguages" :key="lang" type="button"
                class="tab" :class="{ 'tab--on': activeLang === lang }" @click="activeLang = lang">
                <span class="tab__pip" :class="`tab__pip--${lang.toLowerCase()}`"></span>
                {{ lang === 'CKB' ? 'سۆرانی' : 'کورمانجی' }}
              </button>
            </div>
            <div v-show="activeLang === 'CKB'" class="tab-panel">
              <div class="field"><label class="lbl lbl--req">ناونیشان (سۆرانی)</label><input v-model="form.ckbContent.title" class="inp" placeholder="ناونیشانی دەنگ بە سۆرانی…" /></div>
              <div class="field"><label class="lbl">وەسف (سۆرانی)</label><textarea v-model="form.ckbContent.description" class="inp ta" placeholder="وەسف…"></textarea></div>
              <div class="field"><label class="lbl">خوێندن (سۆرانی)</label><input v-model="form.reader" class="inp" placeholder="ناوی خوێنەر / گروپ…" /></div>
              <div class="field"><label class="lbl">نیشانەکان (سۆرانی)</label><TagInput v-model="form.tagsCkb" placeholder="نیشانەی نوێ زیاد بکە" color="gold" /></div>
              <div class="field"><label class="lbl">کلیلەوشەکان (سۆرانی)</label><TagInput v-model="form.keywordsCkb" placeholder="کلیلەوشەی نوێ" color="blue" /></div>
            </div>
            <div v-show="activeLang === 'KMR'" class="tab-panel">
              <div class="field"><label class="lbl lbl--req">ناونیشان (کورمانجی)</label><input v-model="form.kmrContent.title" class="inp" placeholder="Sernavê dengê…" /></div>
              <div class="field"><label class="lbl">وەسف (کورمانجی)</label><textarea v-model="form.kmrContent.description" class="inp ta" placeholder="Danasîn…"></textarea></div>
              <div class="field"><label class="lbl">خوێندن (کورمانجی)</label><input v-model="form.kmrContent.reading" class="inp" placeholder="Navê xwîner / kom…" /></div>
              <div class="field"><label class="lbl">نیشانەکان (کورمانجی)</label><TagInput v-model="form.tagsKmr" placeholder="نیشانەی نوێ" color="gold" /></div>
              <div class="field"><label class="lbl">کلیلەوشەکان (کورمانجی)</label><TagInput v-model="form.keywordsKmr" placeholder="کلیلەوشەی نوێ" color="blue" /></div>
            </div>
            <div v-if="errors.titles" class="err">{{ errors.titles }}</div>
          </section>
 
          <!-- Shared meta -->
          <section class="card">
            <div class="card__hd"><span class="card__hd-ico">🧾</span> زانیاری گشتی</div>
 
            <div class="field">
              <label class="lbl">دەرهێنەران</label>
              <TagInput v-model="form.directors" placeholder="ناوی دەرهێنەر زیاد بکە…" color="default" />
            </div>
 
            <div class="two-grid">
              <div class="field">
                <label class="lbl">زاراوە / شێوەزار</label>
                <input v-model="form.terms" class="inp" placeholder="سۆرانی، کرمانجی، ..." />
              </div>
              <div class="field">
                <label class="lbl">پڕۆژەی ناوەند؟</label>
                <button type="button" class="toggle" :class="{ 'toggle--on': form.thisProjectOfInstitute }"
                  @click="form.thisProjectOfInstitute = !form.thisProjectOfInstitute">
                  <span class="toggle__dot"></span>
                  {{ form.thisProjectOfInstitute ? 'بەڵێ' : 'نەخێر' }}
                </button>
              </div>
            </div>
 
            <div class="field">
              <label class="lbl">شوێنەکان</label>
              <TagInput v-model="form.locations" placeholder="شوێنی نوێ" color="default" />
            </div>
          </section>
 
          <!-- Multi-Album Fields -->
          <Transition name="slide">
            <section class="card" v-if="form.trackState === 'MULTI'">
              <div class="card__hd"><span class="card__hd-ico">💿</span> زانیاری ئەلبووم (MULTI)</div>
              <div class="two-grid">
                <div class="field"><label class="lbl">ناوی ئەلبووم</label><input v-model="form.albumName" class="inp" placeholder="ناوی ئەلبووم…" /></div>
                <div class="field"><label class="lbl">ساڵی بڵاوکردنەوە</label><input v-model.number="form.publishmentYear" type="number" class="inp" placeholder="2024" /></div>
              </div>
              <div class="two-grid">
                <div class="field"><label class="lbl">ژمارەی CD</label><input v-model.number="form.cdNumber" type="number" class="inp" placeholder="1" min="1" /></div>
                <div class="field"><label class="lbl">کۆی تراکەکان</label><input v-model.number="form.totalTracks" type="number" class="inp" placeholder="12" min="1" /></div>
              </div>
            </section>
          </Transition>
 
          <!-- Files builder -->
          <section class="card card--files">
            <div class="card__hd">
              <span class="card__hd-ico">🎧</span>
              فایلەکان
              <span class="card__hd-badge">{{ fileCount }}</span>
              <span class="album-req" :class="fileReqClass">{{ fileReqLabel }}</span>
            </div>
            <div v-if="errors.files" class="err err--album">{{ errors.files }}</div>
            <div class="files-list" v-if="form.files.length">
              <div class="file-item" v-for="(item, idx) in form.files" :key="item._key">
                <div class="file-item__head">
                  <span class="file-item__num">{{ idx + 1 }}</span>
                  <div class="src-toggle">
                    <button type="button" class="src-btn" :class="{ 'src-btn--on': !item.useUrl }" @click="item.useUrl = false">بارکردنی فایل</button>
                    <button type="button" class="src-btn" :class="{ 'src-btn--on': item.useUrl }" @click="item.useUrl = true">لینکی URL</button>
                  </div>
                  <button type="button" class="mini-btn" @click="moveUp(idx)"   :disabled="idx === 0" title="سەرەوە">↑</button>
                  <button type="button" class="mini-btn" @click="moveDown(idx)" :disabled="idx === form.files.length - 1" title="خوارەوە">↓</button>
                  <button type="button" class="file-item__del" @click="removeFile(idx)" title="سڕینەوە">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </div>
 
                <div v-if="!item.useUrl" class="file-item__body">
                  <label class="upload-zone upload-zone--inline">
                    <input type="file" accept="audio/*" @change="onAudioFile($event, idx)" style="display:none;" />
                    <div class="upload-zone__inner upload-zone__inner--inline">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                      <span>{{ item.file ? item.file.name : 'فایلی دەنگ هەڵبژێرە' }}</span>
                    </div>
                  </label>
                </div>
 
                <div v-else class="file-item__body">
                  <div class="two-grid two-grid--sm">
                    <div class="field"><label class="lbl lbl--sm">لینکی فایل</label><input v-model="item.fileUrl" class="inp inp--sm" placeholder="S3/CDN direct url…" /></div>
                    <div class="field"><label class="lbl lbl--sm">لینکی دەرەکی</label><input v-model="item.externalUrl" class="inp inp--sm" placeholder="YouTube/SoundCloud…" /></div>
                  </div>
                  <div class="field"><label class="lbl lbl--sm">لینکی Embed</label><input v-model="item.embedUrl" class="inp inp--sm" placeholder="Embed url…" /></div>
                </div>
 
                <div class="file-item__meta">
                  <div class="two-grid two-grid--sm">
                    <div class="field"><label class="lbl lbl--sm">ناونیشان</label><input v-model="item.title" class="inp inp--sm" placeholder="ناونیشانی فایل…" /></div>
                    <div class="field">
                      <label class="lbl lbl--sm">جۆری فایل</label>
                      <select v-model="item.fileType" class="inp inp--sm">
                        <option value="MP3">MP3</option>
                        <option value="WAV">WAV</option>
                        <option value="OGG">OGG</option>
                        <option value="AAC">AAC</option>
                        <option value="FLAC">FLAC</option>
                        <option value="OTHER">OTHER</option>
                      </select>
                    </div>
                  </div>
 
                  <div class="two-grid two-grid--sm">
                    <div class="field"><label class="lbl lbl--sm">کەناڵ</label>
                      <select v-model="item.audioChannel" class="inp inp--sm">
                        <option :value="null">— هەڵبژێرە —</option>
                        <option value="STEREO">STEREO</option>
                        <option value="MONO">MONO</option>
                      </select>
                    </div>
                    <!-- ✅ Duration: auto-filled in minutes from file -->
                    <div class="field">
                      <label class="lbl lbl--sm">ماوە (خولەک)</label>
                      <input v-model.number="item.durationMinutes" type="number" class="inp inp--sm" placeholder="0.00" min="0" step="0.01" />
                    </div>
                  </div>
 
                  <div class="two-grid two-grid--sm">
                    <!-- ✅ Size: auto-filled in MB from file -->
                    <div class="field">
                      <label class="lbl lbl--sm">قەبارە (MB)</label>
                      <input v-model.number="item.sizeMb" type="number" class="inp inp--sm" placeholder="0.00" min="0" step="0.01" />
                    </div>
                    <div class="field"><label class="lbl lbl--sm">بیت ڕەیت</label><input v-model="item.bitRate" class="inp inp--sm" placeholder="320 kbps, 24-bit…" /></div>
                  </div>
 
                  <div class="two-grid two-grid--sm">
                    <div class="field"><label class="lbl lbl--sm">نمونەی ڕەیت</label><input v-model="item.sampleRate" class="inp inp--sm" placeholder="44100 Hz…" /></div>
                    <div class="field"><label class="lbl lbl--sm">شێواز (فۆرم)</label><input v-model="item.form" class="inp inp--sm" placeholder="کێشدار، بێکەش…" /></div>
                  </div>
 
                  <div class="two-grid two-grid--sm">
                    <div class="field"><label class="lbl lbl--sm">ژانرا</label><input v-model="item.genre" class="inp inp--sm" placeholder="Folk, Classical…" /></div>
                    <div class="field"><label class="lbl lbl--sm">شوێنی تۆمارکردن</label><input v-model="item.recordingVenue" class="inp inp--sm" placeholder="Studio A, Sulaymaniyah…" /></div>
                  </div>
 
                  <div class="field">
                    <label class="lbl lbl--sm">ساڵ</label>
                    <input v-model.number="item.publishmentYear" type="number" class="inp inp--sm" placeholder="2024" />
                  </div>
 
                  <!-- Brochures -->
                  <div class="broch-section">
                    <div class="broch-section__head">
                      <span class="lbl lbl--sm">بڕۆشورەکان</span>
                      <button type="button" class="mini-btn" @click="addBrochure(idx)">+ بڕۆشور</button>
                    </div>
                    <div class="broch-grid" v-if="item.brochures.length">
                      <div v-for="(br, bi) in item.brochures" :key="bi" class="broch-card">
                        <div class="cover-preview" v-if="br._preview || br.imageUrl">
                          <img :src="br._preview || br.imageUrl" alt="" />
                          <button type="button" class="cover-preview__remove" @click="removeBrochure(idx, bi)">✕</button>
                        </div>
                        <label class="upload-zone upload-zone--sm" v-else>
                          <input type="file" accept="image/*" @change="onBrochureFile($event, idx, bi)" style="display:none" />
                          <div class="upload-zone__inner">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                            <span>هەڵبژاردنی وێنە</span>
                          </div>
                        </label>
                        <input v-model="br.caption" class="inp inp--sm" placeholder="سەردێر…" style="margin-top:.35rem" />
                      </div>
                    </div>
                  </div>
 
                  <div class="field" style="margin-top:.5rem">
                    <label class="lbl lbl--sm">پێشبینی</label>
                    <div class="mini-preview">
                      <audio v-if="previewUrl(item)" :src="previewUrl(item)" controls preload="none" style="width:100%"></audio>
                      <div v-else class="mini-preview__empty">—</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
 
            <div class="album-empty" v-else>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
              <span>هیچ فایلێک نییە — فایل زیاد بکە</span>
            </div>
 
            <div class="album-actions">
              <button type="button" class="btn btn--outline btn--sm"
                :disabled="form.trackState === 'SINGLE' && form.files.length >= 1" @click="addFile(false)">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                فایلی نوێ (بارکردن)
              </button>
              <button type="button" class="btn btn--outline btn--sm"
                :disabled="form.trackState === 'SINGLE' && form.files.length >= 1" @click="addFile(true)">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
                لینکی میدیا زیاد بکە
              </button>
            </div>
          </section>
 
          <!-- Attachments -->
          <section class="card">
            <div class="card__hd">
              <span class="card__hd-ico">📎</span>
              هاوپێچەکان (Attachments)
              <span class="card__hd-badge">{{ form.attachments.length }}</span>
              <span class="attach-hint">ئارەزووی — PDF، ڤیدیۆ، بووکلێت…</span>
            </div>
            <div class="files-list" v-if="form.attachments.length">
              <div class="file-item" v-for="(att, ai) in form.attachments" :key="att._key">
                <div class="file-item__head">
                  <span class="file-item__num">{{ ai + 1 }}</span>
                  <span style="flex:1;font-size:.82rem;font-weight:700">{{ att.title || `هاوپێچ ${ai+1}` }}</span>
                  <button type="button" class="file-item__del" @click="form.attachments.splice(ai, 1)">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </div>
                <div class="file-item__body">
                  <div class="two-grid two-grid--sm">
                    <div class="field"><label class="lbl lbl--sm">ناونیشان</label><input v-model="att.title" class="inp inp--sm" placeholder="Album Booklet, Making Of…" /></div>
                    <div class="field">
                      <label class="lbl lbl--sm">جۆر</label>
                      <select v-model="att.attachmentType" class="inp inp--sm">
                        <option value="PDF">PDF</option>
                        <option value="VIDEO">VIDEO</option>
                        <option value="IMAGE">IMAGE</option>
                        <option value="AUDIO">AUDIO</option>
                        <option value="OTHER">OTHER</option>
                      </select>
                    </div>
                  </div>
                  <div class="two-grid two-grid--sm">
                    <div class="field"><label class="lbl lbl--sm">لینکی فایل</label><input v-model="att.fileUrl" class="inp inp--sm" placeholder="https://…" /></div>
                    <div class="field"><label class="lbl lbl--sm">MIME Type</label><input v-model="att.mimeType" class="inp inp--sm" placeholder="application/pdf…" /></div>
                  </div>
                  <div class="field"><label class="lbl lbl--sm">قەبارە (بایت)</label><input v-model.number="att.sizeBytes" type="number" class="inp inp--sm" placeholder="0" /></div>
                </div>
              </div>
            </div>
            <div class="album-empty" v-else style="padding:1.2rem">
              <span style="font-size:.84rem;color:var(--muted)">هاوپێچ ئارەزووییە — دەتوانیت بێهێڵیتەوە</span>
            </div>
            <div class="album-actions">
              <button type="button" class="btn btn--outline btn--sm" @click="addAttachment">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                هاوپێچی نوێ
              </button>
            </div>
          </section>
 
        </div>
 
        <!-- ═══ SIDE COLUMN ═══ -->
        <aside class="col-side">
 
          <!-- Images -->
          <section class="card">
            <div class="card__hd"><span class="card__hd-ico">🖼</span> وێنەی ڕووکار</div>
 
            <div class="img-block">
              <div class="img-block__title">وێنەی ڕووکاری سۆرانی</div>
              <div class="cover-preview" v-if="ckbCoverPreview || form.coverUrlCkb">
                <img :src="ckbCoverPreview || form.coverUrlCkb" alt="ckb cover preview" />
                <button type="button" class="cover-preview__remove" @click="removeCkbCover">✕</button>
              </div>
              <label class="upload-zone upload-zone--sm" v-else>
                <input type="file" accept="image/*" @change="onCkbCoverFile" style="display:none;" />
                <div class="upload-zone__inner">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                  <span>هەڵبژاردنی وێنەی ڕووکاری سۆرانی</span>
                </div>
              </label>
            </div>
 
            <div class="img-sep"></div>
 
            <div class="img-block">
              <div class="img-block__title">وێنەی ڕووکاری کورمانجی</div>
              <div class="cover-preview" v-if="kmrCoverPreview || form.coverUrlKmr">
                <img :src="kmrCoverPreview || form.coverUrlKmr" alt="kmr cover preview" />
                <button type="button" class="cover-preview__remove" @click="removeKmrCover">✕</button>
              </div>
              <label class="upload-zone upload-zone--sm" v-else>
                <input type="file" accept="image/*" @change="onKmrCoverFile" style="display:none;" />
                <div class="upload-zone__inner">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                  <span>هەڵبژاردنی وێنەی ڕووکاری کورمانجی</span>
                </div>
              </label>
            </div>
 
            <div class="img-sep"></div>
 
            <div class="img-block">
              <div class="img-block__title">وێنەی ماووس (Hover)<span class="img-block__hint">دەرکەوتە لە سەر hover</span></div>
              <div class="cover-preview cover-preview--hover" v-if="hoverPreview || form.hoverUrl">
                <img :src="hoverPreview || form.hoverUrl" alt="hover preview" />
                <button type="button" class="cover-preview__remove" @click="removeHover">✕</button>
                <div class="cover-preview__hover-badge">H</div>
              </div>
              <label class="upload-zone upload-zone--sm upload-zone--hover" v-else>
                <input type="file" accept="image/*" @change="onHoverFile" style="display:none;" />
                <div class="upload-zone__inner">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                  <span>هەڵبژاردنی وێنەی ماووس</span>
                </div>
              </label>
            </div>
          </section>
 
          <!-- Submit -->
          <div class="side-actions">
            <button type="submit" class="btn btn--primary btn--full" :disabled="saving">
              <span v-if="saving" class="spinner"></span>
              {{ saving ? 'پاشەکەوتکردن…' : (isEdit ? 'پاشەکەوتکردنی گۆڕانکاری' : 'دروستکردنی دەنگ') }}
            </button>
            <RouterLink to="/admin/sound-tracks" class="btn btn--ghost btn--full">هەڵوەشاندنەوە</RouterLink>
          </div>
 
          <!-- Danger zone -->
          <section v-if="isEdit" class="card card--danger">
            <div class="card__hd card__hd--danger"><span class="card__hd-ico">⚠️</span> ناوچەی مەترسیدار</div>
            <p class="danger-text">سڕینەوەی دەنگ ناگەرێتەوە.</p>
            <button type="button" class="btn btn--danger btn--full" @click="doDelete">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>
              سڕینەوەی ئەم دەنگە
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
    color: { type: String, default: 'default' }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const inp = ref('')
    const add = () => {
      const v = inp.value.trim()
      if (v && !props.modelValue.includes(v)) emit('update:modelValue', [...props.modelValue, v])
      inp.value = ''
    }
    const rem = (i) => { const a = [...props.modelValue]; a.splice(i, 1); emit('update:modelValue', a) }
    return () => h('div', { class: 'tag-input' }, [
      h('div', { class: 'tag-input__tags' }, [
        ...props.modelValue.map((t, i) => h('span', {
          class: `tag-input__tag tag-input__tag--${props.color}`, key: t
        }, [t, h('button', { type: 'button', onClick: () => rem(i) }, '✕')])),
        h('input', {
          class: 'tag-input__inp',
          placeholder: props.placeholder,
          value: inp.value,
          onInput: (e) => { inp.value = e.target.value },
          onKeydown: (e) => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add() } },
          onBlur: add
        })
      ])
    ])
  }
})
 
const route  = useRoute()
const router = useRouter()
const isEdit = computed(() => !!route.params.id)
 
const activeLang   = ref('CKB')
const fetching     = ref(false)
const saving       = ref(false)
const toast        = ref({ show: false, type: 'success', msg: '' })
const errors       = ref({})
const topics       = ref([])
const topicMode    = ref('none')
let _keyCounter    = 0
 
const ckbCoverFile    = ref(null)
const kmrCoverFile    = ref(null)
const hoverFile       = ref(null)
const ckbCoverPreview = ref('')
const kmrCoverPreview = ref('')
const hoverPreview    = ref('')
 
const form = reactive({
  soundType: '',
  trackState: 'SINGLE',
  albumOfMemories: false,
  contentLanguages: ['CKB'],
  coverUrlCkb: '',
  coverUrlKmr: '',
  hoverUrl: '',
  ckbContent: { title: '', description: ''},
  kmrContent: { title: '', description: ''},
  reader: '',
  directors: [],
  terms: '',
  thisProjectOfInstitute: false,
  locations: [],
  tagsCkb: [],
  tagsKmr: [],
  keywordsCkb: [],
  keywordsKmr: [],
  files: [],
  albumName: '',
  publishmentYear: null,
  cdNumber: null,
  totalTracks: null,
  attachments: [],
  topicId: null,
  newTopic: { nameCkb: '', nameKmr: '' },
  clearTopic: false,
})
 
const fetchTopics = async () => {
  try {
    const { data } = await api.get('/api/v1/sound-tracks/topics')
    const arr = data?.data ?? data ?? []
    topics.value = Array.isArray(arr) ? arr : []
  } catch { /* non-fatal */ }
}
 
const fileCount    = computed(() => form.files.length)
const fileReqLabel = computed(() => {
  const c = form.files.length
  if (form.trackState === 'SINGLE') return c === 1 ? '✓ ١ فایل' : `${c}/١`
  return c >= 1 ? `✓ ${c} فایل` : '١ یان زیاتر'
})
const fileReqClass = computed(() => {
  const c = form.files.length
  const ok = (form.trackState === 'SINGLE' && c === 1) || (form.trackState === 'MULTI' && c >= 1)
  return ok ? 'album-req--ok' : 'album-req--warn'
})
 
const makeFileItem = (useUrl = false) => ({
  _key: ++_keyCounter,
  useUrl,
  file: null,
  fileUrl: '',
  externalUrl: '',
  embedUrl: '',
  title: '',
  fileType: 'MP3',
  publishmentYear: null,
  durationMinutes: 0,
  sizeMb: 0,
  bitRate: '',
  sampleRate: '',
  audioChannel: null,
  form: '',
  genre: '',
  recordingVenue: '',
  brochures: [],
})
 
const addFile    = (useUrl = false) => {
  if (form.trackState === 'SINGLE' && form.files.length >= 1) return
  form.files.push(makeFileItem(useUrl))
}
const removeFile = (idx) => {
  form.files[idx].brochures.forEach(b => { if (b._preview) URL.revokeObjectURL(b._preview) })
  form.files.splice(idx, 1)
}
const moveUp   = (idx) => { if (idx <= 0) return; [form.files[idx - 1], form.files[idx]] = [form.files[idx], form.files[idx - 1]] }
const moveDown = (idx) => { if (idx >= form.files.length - 1) return; [form.files[idx + 1], form.files[idx]] = [form.files[idx], form.files[idx + 1]] }
 
const addBrochure    = (fi) => { form.files[fi].brochures.push({ file: null, imageUrl: '', caption: '', _preview: '' }) }
const removeBrochure = (fi, bi) => {
  const br = form.files[fi].brochures[bi]
  if (br._preview) URL.revokeObjectURL(br._preview)
  form.files[fi].brochures.splice(bi, 1)
}
const onBrochureFile = (e, fi, bi) => {
  const f = e.target.files?.[0]; if (!f) return
  const br = form.files[fi].brochures[bi]
  if (br._preview) URL.revokeObjectURL(br._preview)
  br.file = f; br._preview = URL.createObjectURL(f); br.imageUrl = ''
}
 
const addAttachment = () => {
  form.attachments.push({ _key: ++_keyCounter, fileUrl: '', title: '', attachmentType: 'PDF', sizeBytes: 0, mimeType: '' })
}
 
// ── Duration: seconds → M.SS (119s = 1.59, not 1.98) ──
const secondsToMSS = (totalSec) => {
  const s   = Math.round(totalSec)
  const m   = Math.floor(s / 60)
  const sec = String(s % 60).padStart(2, '0')
  return parseFloat(`${m}.${sec}`)
}
const mssToSeconds = (val) => {
  const v = parseFloat((val || 0).toFixed(2))
  const m = Math.floor(v)
  const s = Math.round((v - m) * 100)
  return m * 60 + s
}
 
// ✅ Auto-extract duration (M.SS) and size (bytes / 1,000,000 = MB) on file select
const onAudioFile = (e, idx) => {
  const f = e.target.files?.[0]; if (!f) return
  form.files[idx].file   = f
  form.files[idx].sizeMb = parseFloat((f.size / 1_000_000).toFixed(2))
 
  // Auto-extract duration via browser Audio API
  const blobUrl = URL.createObjectURL(f)
  const audio   = new Audio(blobUrl)
  audio.addEventListener('loadedmetadata', () => {
    form.files[idx].durationMinutes = secondsToMSS(audio.duration)
    URL.revokeObjectURL(blobUrl)
  }, { once: true })
 
  const name = (f.name || '').toLowerCase()
  if      (name.endsWith('.mp3'))  form.files[idx].fileType = 'MP3'
  else if (name.endsWith('.wav'))  form.files[idx].fileType = 'WAV'
  else if (name.endsWith('.ogg'))  form.files[idx].fileType = 'OGG'
  else if (name.endsWith('.aac'))  form.files[idx].fileType = 'AAC'
  else if (name.endsWith('.flac')) form.files[idx].fileType = 'FLAC'
  else                             form.files[idx].fileType = 'OTHER'
}
 
const previewUrl = (item) => item?.useUrl ? (item.fileUrl || '') : ''
 
const setPreview = (refPreview, file) => {
  if (refPreview.value) URL.revokeObjectURL(refPreview.value)
  refPreview.value = file ? URL.createObjectURL(file) : ''
}
const onCkbCoverFile = (e) => { const f = e.target.files?.[0]; if (!f) return; ckbCoverFile.value = f; setPreview(ckbCoverPreview, f); form.coverUrlCkb = '' }
const removeCkbCover = () => { setPreview(ckbCoverPreview, null); ckbCoverFile.value = null; form.coverUrlCkb = '' }
const onKmrCoverFile = (e) => { const f = e.target.files?.[0]; if (!f) return; kmrCoverFile.value = f; setPreview(kmrCoverPreview, f); form.coverUrlKmr = '' }
const removeKmrCover = () => { setPreview(kmrCoverPreview, null); kmrCoverFile.value = null; form.coverUrlKmr = '' }
const onHoverFile    = (e) => { const f = e.target.files?.[0]; if (!f) return; hoverFile.value = f; setPreview(hoverPreview, f); form.hoverUrl = '' }
const removeHover    = () => { setPreview(hoverPreview, null); hoverFile.value = null; form.hoverUrl = '' }
 
const applyTrack = (t) => {
  form.soundType        = t.soundType  || ''
  form.trackState       = t.trackState || 'SINGLE'
  form.albumOfMemories  = !!(t.albumOfMemories ?? false)
  const langs           = Array.isArray(t.contentLanguages) ? [...t.contentLanguages] : ['CKB']
  form.contentLanguages = langs
  activeLang.value      = langs[0] || 'CKB'
  form.coverUrlCkb      = t.ckbCoverUrl   || ''
  form.coverUrlKmr      = t.kmrCoverUrl   || ''
  form.hoverUrl         = t.hoverCoverUrl || ''
  setPreview(ckbCoverPreview, null); ckbCoverFile.value = null
  setPreview(kmrCoverPreview, null); kmrCoverFile.value = null
  setPreview(hoverPreview,    null); hoverFile.value    = null
 
  form.reader    = t.reader    || ''
  form.directors = Array.isArray(t.directors) ? [...t.directors] : []
  form.terms     = t.terms || ''
  form.thisProjectOfInstitute = !!(t.thisProjectOfInstitute ?? false)
  form.locations = Array.isArray(t.locations) ? [...t.locations] : []
 
  if (t.ckbContent) { form.ckbContent.title = t.ckbContent.title || ''; form.ckbContent.description = t.ckbContent.description }
  if (t.kmrContent) { form.kmrContent.title = t.kmrContent.title || ''; form.kmrContent.description = t.kmrContent.description }
 
  form.tagsCkb     = Array.isArray(t.tags?.ckb)     ? [...t.tags.ckb]     : []
  form.tagsKmr     = Array.isArray(t.tags?.kmr)     ? [...t.tags.kmr]     : []
  form.keywordsCkb = Array.isArray(t.keywords?.ckb) ? [...t.keywords.ckb] : []
  form.keywordsKmr = Array.isArray(t.keywords?.kmr) ? [...t.keywords.kmr] : []
 
  if (t.topicId) { form.topicId = t.topicId; topicMode.value = 'existing' }
  else           { form.topicId = null;       topicMode.value = 'none' }
  form.clearTopic = false
  form.newTopic   = { nameCkb: '', nameKmr: '' }
 
  form.albumName       = t.albumName       || ''
  form.publishmentYear = t.publishmentYear || null
  form.cdNumber        = t.cdNumber        || null
  form.totalTracks     = t.totalTracks     || null
 
  form.files = (t.files || []).map(f => ({
    _key: ++_keyCounter,
    useUrl: true,
    file: null,
    fileUrl:      f.fileUrl      || '',
    externalUrl:  f.externalUrl  || '',
    embedUrl:     f.embedUrl     || '',
    title:        f.title        || '',
    fileType:     f.fileType     || 'MP3',
    publishmentYear: f.publishmentYear || null,
    durationMinutes: secondsToMSS(Number(f.durationSeconds || 0)),
    sizeMb:          parseFloat((Number(f.sizeBytes || 0) / 1_000_000).toFixed(2)),
    bitRate:         f.bitRate         || '',
    sampleRate:      f.sampleRate      || '',
    audioChannel:    f.audioChannel    || null,
    form:            f.form            || '',
    genre:           f.genre           || '',
    recordingVenue:  f.recordingVenue  || '',
    brochures: (f.brochures || []).map(b => ({
      file: null, imageUrl: b.imageUrl || '', caption: b.caption || '', _preview: ''
    })),
  }))
 
  form.attachments = (t.attachments || []).map(a => ({
    _key: ++_keyCounter,
    fileUrl:        a.fileUrl        || '',
    title:          a.title          || '',
    attachmentType: a.attachmentType || 'OTHER',
    sizeBytes:      Number(a.sizeBytes || 0),
    mimeType:       a.mimeType       || '',
  }))
}
 
const loadTrack = async () => {
  if (!isEdit.value) return
  fetching.value = true
  try {
    const { data } = await api.get(`/api/v1/sound-tracks/${route.params.id}`)
    const track = data?.data ?? data
    if (track) applyTrack(track)
    else showToast('error', 'دەنگەکە نەدۆزرایەوە')
  } catch (e) {
    showToast('error', 'داتا هێنان سەرنەکەوت: ' + (e?.response?.data?.message || e.message))
  } finally {
    fetching.value = false
  }
}
 
const validate = () => {
  const e = {}
  if (!String(form.soundType || '').trim())   e.soundType       = 'جۆری دەنگ پێویستە'
  if (!form.trackState)                        e.trackState      = 'TrackState پێویستە'
  if (!form.contentLanguages.length)           e.contentLanguages = 'کەمی یەک زمانیکی هەڵبژێرە'
  if (form.contentLanguages.includes('CKB') && !form.ckbContent.title.trim())
    e.titles = 'ناونیشانی سۆرانی پێویستە'
  if (form.contentLanguages.includes('KMR') && !form.kmrContent.title.trim())
    e.titles = (e.titles ? e.titles + ' | ' : '') + 'ناونیشانی کورمانجی پێویستە'
  if (topicMode.value === 'existing' && !form.topicId)
    e.topicId = 'موضوعێک هەڵبژێرە یان حالەتی "بێ موضوع" هەڵبژێرە'
  if (topicMode.value === 'new' && !form.newTopic.nameCkb.trim() && !form.newTopic.nameKmr.trim())
    e.newTopic = 'کەمی یەک ناوی موضوع (CKB یان KMR) پێویستە'
 
  const count = form.files.length
  if (form.trackState === 'SINGLE' && count !== 1) e.files = 'SINGLE پێویستی بە تەنها ١ فایلە'
  if (form.trackState === 'MULTI'  && count < 1)   e.files = 'کەمی ١ فایل پێویستە'
  form.files.forEach((it, i) => {
    if (it.useUrl && !it.fileUrl.trim() && !it.externalUrl.trim() && !it.embedUrl.trim())
      e.files = `فایل #${i + 1}: پێویستە fileUrl یان externalUrl یان embedUrl بنووسیت`
    else if (!it.useUrl && !it.file)
      e.files = `فایل #${i + 1}: فایلێک هەڵبژێرە`
  })
 
  errors.value = e
  return !Object.keys(e).length
}
 
const submit = async () => {
  if (!validate()) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    showToast('error', 'تکایە هەموو خانە پێویستەکان پڕ بکەوە')
    return
  }
  saving.value = true
  try {
    const allFiles = form.files
 
    const dto = {
      soundType:    form.soundType,
      trackState:   form.trackState,
      albumOfMemories: form.trackState === 'MULTI' ? form.albumOfMemories : false,
      contentLanguages: form.contentLanguages,
      ckbContent: form.contentLanguages.includes('CKB')
        ? { title: form.ckbContent.title || null, description: form.ckbContent.description }
        : null,
      kmrContent: form.contentLanguages.includes('KMR')
        ? { title: form.kmrContent.title || null, description: form.kmrContent.description }
        : null,
      locations:  form.locations,
      reader:     form.reader.trim() || null,
      directors:  form.directors,
      terms:      form.terms || null,
      thisProjectOfInstitute: !!form.thisProjectOfInstitute,
      tags: {
        ckb: form.contentLanguages.includes('CKB') ? form.tagsCkb    : [],
        kmr: form.contentLanguages.includes('KMR') ? form.tagsKmr    : [],
      },
      keywords: {
        ckb: form.contentLanguages.includes('CKB') ? form.keywordsCkb : [],
        kmr: form.contentLanguages.includes('KMR') ? form.keywordsKmr : [],
      },
      files: allFiles.map(x => ({
        fileUrl:         x.useUrl ? (x.fileUrl || null) : null,
        externalUrl:     x.externalUrl  || null,
        embedUrl:        x.embedUrl     || null,
        title:           x.title        || null,
        fileType:        x.fileType     || 'MP3',
        publishmentYear: x.publishmentYear || null,
        durationSeconds: mssToSeconds(x.durationMinutes || 0),
        sizeBytes:       Math.round((x.sizeMb || 0) * 1_000_000),
        bitRate:         x.bitRate         || null,
        sampleRate:      x.sampleRate      || null,
        audioChannel:    x.audioChannel    || null,
        form:            x.form            || null,
        genre:           x.genre           || null,
        recordingVenue:  x.recordingVenue  || null,
        brochures: x.brochures
          .filter(b => b.imageUrl || b.file)
          .map(b => ({ imageUrl: b.imageUrl || null, caption: b.caption || null })),
      })),
      albumName:       form.trackState === 'MULTI' ? (form.albumName       || null) : null,
      publishmentYear: form.trackState === 'MULTI' ? (form.publishmentYear || null) : null,
      cdNumber:        form.trackState === 'MULTI' ? (form.cdNumber        || null) : null,
      totalTracks:     form.trackState === 'MULTI' ? (form.totalTracks     || null) : null,
      attachments: form.attachments.filter(a => a.fileUrl).map(a => ({
        fileUrl:        a.fileUrl,
        title:          a.title          || null,
        attachmentType: a.attachmentType || 'OTHER',
        sizeBytes:      Number(a.sizeBytes || 0),
        mimeType:       a.mimeType       || null,
      })),
      topicId:  topicMode.value === 'existing' ? (form.topicId || null) : null,
      newTopic: topicMode.value === 'new'
        ? { nameCkb: form.newTopic.nameCkb || null, nameKmr: form.newTopic.nameKmr || null }
        : null,
      ...(isEdit.value ? { clearTopic: form.clearTopic } : {}),
    }
 
    const fd = new FormData()
    fd.append('data', new Blob([JSON.stringify(dto)], { type: 'application/json' }))
    if (ckbCoverFile.value) fd.append('ckbCoverImage',   ckbCoverFile.value)
    if (kmrCoverFile.value) fd.append('kmrCoverImage',   kmrCoverFile.value)
    if (hoverFile.value)    fd.append('hoverCoverImage', hoverFile.value)
 
    allFiles.forEach(x => { if (!x.useUrl && x.file) fd.append('audioFiles', x.file) })
    allFiles.forEach(f => { f.brochures.forEach(b => { if (b.file) fd.append('brochureFiles', b.file) }) })
 
    const cfg = { headers: { 'Content-Type': 'multipart/form-data' } }
    if (isEdit.value) await api.put(`/api/v1/sound-tracks/${route.params.id}`, fd, cfg)
    else              await api.post('/api/v1/sound-tracks', fd, cfg)
 
    showToast('success', isEdit.value ? 'دەنگەکە نوێکرایەوە ✓' : 'دەنگەکە دروستکرا ✓')
    setTimeout(() => router.push('/admin/sound-tracks'), 1200)
  } catch (e) {
    console.error('Submit error:', e)
    showToast('error', e?.response?.data?.message || e?.response?.data?.error || e.message || 'هەڵەیەک ڕوویدا')
  } finally {
    saving.value = false
  }
}
 
const doDelete = async () => {
  if (!confirm(`دڵنیای لە سڕینەوەی دەنگ #${route.params.id}؟`)) return
  try {
    await api.delete(`/api/v1/sound-tracks/${route.params.id}`)
    showToast('success', 'دەنگەکە سڕایەوە')
    setTimeout(() => router.push('/admin/sound-tracks'), 800)
  } catch (e) {
    showToast('error', e?.response?.data?.message || 'سڕینەوە سەرنەکەوت')
  }
}
 
const showToast = (type, msg) => {
  toast.value = { show: true, type, msg }
  setTimeout(() => { toast.value.show = false }, 4000)
}
 
watch(() => form.trackState, (v) => {
  if (v === 'SINGLE') {
    form.albumOfMemories = false
    if (form.files.length > 1) {
      form.files.splice(1)
      showToast('error', 'SINGLE تەنها ١ فایل دەهێڵێت — زیادەکان سڕانەوە')
    }
  }
})
 
watch(() => form.contentLanguages.slice(), (langs) => {
  if (!langs.length) return
  if (!langs.includes(activeLang.value)) activeLang.value = langs[0]
}, { deep: true })
 
onMounted(() => {
  if (!isEdit.value && !form.files.length) addFile(false)
  fetchTopics()
  loadTrack()
})
</script>
 



<style scoped>
.ste { direction:rtl; max-width:1280px; margin:0 auto; }
.ste__head { display:flex; align-items:center; gap:1.25rem; margin-bottom:1.5rem; flex-wrap:wrap; }
.ste__back { display:inline-flex; align-items:center; gap:.4rem; color:var(--muted); text-decoration:none; font-weight:600; font-size:.87rem; padding:.4rem .7rem; border-radius:8px; border:1px solid var(--border); background:var(--white); transition:var(--transition); }
.ste__back:hover { color:var(--crimson); border-color:var(--crimson); }
.ste__title { font-size:1.4rem; font-weight:700; color:var(--text); }
.ste__sub { font-size:.8rem; color:var(--muted); margin-top:.1rem; }
.toast { display:flex; align-items:center; gap:.65rem; padding:.8rem 1.1rem; border-radius:var(--radius-sm); font-weight:600; font-size:.88rem; margin-bottom:1rem; }
.toast__ico { font-size:1rem; }
.toast--success { background:rgba(25,130,80,.1); border:1px solid rgba(25,130,80,.25); color:#186048; }
.toast--error   { background:rgba(180,40,40,.08); border:1px solid rgba(180,40,40,.2); color:var(--crimson); }
.toast-enter-active,.toast-leave-active { transition:.3s ease; }
.toast-enter-from,.toast-leave-to { opacity:0; transform:translateY(-6px); }
.loading-bar { height:3px; border-radius:2px; margin-bottom:.75rem; background:linear-gradient(90deg,var(--crimson),var(--gold),var(--crimson)); background-size:200% 100%; animation:shimmer 1.2s linear infinite; }
@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
.ste__layout { display:grid; grid-template-columns:1fr 320px; gap:1.25rem; align-items:start; }
@media (max-width:900px) { .ste__layout { grid-template-columns:1fr; } }
.card { background:var(--white); border:1px solid var(--border); border-radius:var(--radius-md); padding:1.35rem; box-shadow:var(--shadow-sm); margin-bottom:1.25rem; }
.card--danger { border-color:rgba(140,21,21,.18); }
.card--files  { padding-bottom:.9rem; }
.card__hd { display:flex; align-items:center; gap:.6rem; font-weight:700; font-size:.95rem; color:var(--text); margin-bottom:1.1rem; padding-bottom:.75rem; border-bottom:1px solid var(--cream-dk); flex-wrap:wrap; }
.card__hd--danger { color:var(--crimson); border-bottom-color:rgba(140,21,21,.1); }
.card__hd-ico { font-size:1rem; }
.card__hd-badge { margin-right:auto; background:var(--cream-dk); border:1px solid var(--border); border-radius:99px; padding:.1rem .6rem; font-size:.78rem; color:var(--muted); }
.attach-hint { font-size:.72rem; font-weight:600; color:var(--muted); padding:.1rem .5rem; border-radius:6px; background:rgba(15,118,110,.07); border:1px solid rgba(15,118,110,.15); color:#0f766e; }
.danger-text { font-size:.84rem; color:var(--muted); margin-bottom:.85rem; line-height:1.65; }
.album-req { display:inline-flex; padding:.15rem .55rem; border-radius:99px; font-size:.72rem; font-weight:700; }
.album-req--ok   { background:rgba(39,174,96,.1); color:#186040; border:1px solid rgba(39,174,96,.25); }
.album-req--warn { background:rgba(243,156,18,.1); color:#8c5f00; border:1px solid rgba(243,156,18,.28); }
.album-memories-section { margin-top:1rem; }
.album-memories-divider { height:1px; background:var(--cream-dk); margin-bottom:.9rem; }
.album-memories-wrap { display:flex; align-items:center; justify-content:space-between; gap:1rem; padding:.85rem 1rem; border-radius:var(--radius-sm); background:linear-gradient(135deg, rgba(190,24,93,.04) 0%, rgba(140,21,21,.04) 100%); border:1.5px solid rgba(190,24,93,.12); }
.album-memories-info { display:flex; flex-direction:column; gap:.2rem; }
.album-memories-label { font-weight:800; font-size:.9rem; color:var(--text); }
.album-memories-hint { font-size:.77rem; color:var(--muted); }
.slide-enter-active { transition:all .3s ease; }
.slide-leave-active { transition:all .2s ease; }
.slide-enter-from, .slide-leave-to { opacity:0; max-height:0; margin-top:0; overflow:hidden; }
.slide-enter-to, .slide-leave-from { opacity:1; max-height:800px; }
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
.lbl--sm  { font-size:.77rem; }
.lbl--req::after { content:' *'; color:var(--crimson); }
.two-grid { display:grid; grid-template-columns:1fr 1fr; gap:.9rem; }
.two-grid--sm { gap:.6rem; }
@media (max-width:600px) { .two-grid { grid-template-columns:1fr; } }
.inp { border:1.5px solid var(--border); border-radius:var(--radius-sm); padding:.7rem .9rem; background:var(--cream); color:var(--text); font-size:.9rem; outline:none; transition:var(--transition); width:100%; font-family:inherit; box-sizing:border-box; }
.inp:focus { background:var(--white); border-color:var(--crimson); box-shadow:0 0 0 3px rgba(140,21,21,.1); }
.inp--sm { padding:.5rem .7rem; font-size:.85rem; }
.ta { min-height:120px; resize:vertical; }
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
.file-item__num  { width:24px; height:24px; border-radius:50%; background:var(--crimson); color:#fff; font-size:.72rem; font-weight:900; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.file-item__del  { margin-right:auto; width:26px; height:26px; border-radius:6px; background:none; border:1px solid var(--border); color:var(--muted); cursor:pointer; display:flex; align-items:center; justify-content:center; transition:var(--transition); flex-shrink:0; }
.file-item__del:hover { background:rgba(140,21,21,.08); border-color:var(--crimson); color:var(--crimson); }
.file-item__body { padding:.75rem .85rem; border-bottom:1px solid var(--border); }
.file-item__meta { padding:.75rem .85rem; }
.mini-btn { width:26px; height:26px; border-radius:8px; border:1px solid var(--border); background:var(--white); color:var(--muted); cursor:pointer; font-weight:900; transition:var(--transition); font-family:inherit; }
.mini-btn:hover:not(:disabled) { border-color:var(--crimson); color:var(--crimson); }
.mini-btn:disabled { opacity:.35; cursor:default; }
.src-toggle { display:flex; border-radius:8px; overflow:hidden; border:1px solid var(--border); flex-shrink:0; }
.src-btn { display:inline-flex; align-items:center; gap:.35rem; padding:.35rem .65rem; background:none; border:none; color:var(--muted); font-size:.76rem; font-weight:900; cursor:pointer; font-family:inherit; transition:var(--transition); white-space:nowrap; }
.src-btn + .src-btn { border-right:1px solid var(--border); }
.src-btn--on { background:var(--crimson); color:#fff; }
.upload-zone { border:2px dashed var(--border); border-radius:var(--radius-sm); cursor:pointer; transition:var(--transition); display:block; margin-bottom:.75rem; }
.upload-zone:hover { border-color:var(--crimson); background:rgba(140,21,21,.03); }
.upload-zone--hover { border-color:rgba(124,58,237,.3); }
.upload-zone--hover:hover { border-color:rgba(124,58,237,.6); background:rgba(124,58,237,.03); }
.upload-zone--sm .upload-zone__inner { padding:1.25rem; }
.upload-zone__inner { display:flex; flex-direction:column; align-items:center; gap:.5rem; padding:1.75rem 1rem; color:var(--muted); font-size:.87rem; text-align:center; cursor:pointer; }
.upload-zone--inline { margin-bottom:0; }
.upload-zone__inner--inline { padding:1.1rem 1rem; }
.mini-preview { border:1px solid var(--border); border-radius:10px; background:var(--white); padding:.35rem; }
.mini-preview__empty { padding:.55rem; color:var(--muted); text-align:center; font-weight:800; font-size:.8rem; }
.album-empty { display:flex; flex-direction:column; align-items:center; gap:.65rem; padding:2.5rem 1rem; color:var(--muted); font-size:.87rem; text-align:center; border:2px dashed var(--border); border-radius:var(--radius-sm); margin-bottom:1rem; }
.album-actions { display:flex; gap:.6rem; flex-wrap:wrap; padding-top:.25rem; }
.cover-preview { position:relative; border-radius:var(--radius-sm); overflow:hidden; border:1px solid var(--border); margin-bottom:.75rem; }
.cover-preview img { width:100%; max-height:200px; object-fit:cover; display:block; }
.cover-preview__remove { position:absolute; top:.5rem; left:.5rem; width:28px; height:28px; border-radius:50%; background:rgba(0,0,0,.55); color:#fff; border:none; cursor:pointer; font-size:.85rem; display:flex; align-items:center; justify-content:center; }
.cover-preview--hover { border-color:rgba(124,58,237,.3); border-style:dashed; }
.cover-preview__hover-badge { position:absolute; top:.5rem; right:.5rem; width:22px; height:22px; border-radius:5px; background:rgba(124,58,237,.85); color:#fff; font-size:.65rem; font-weight:900; display:flex; align-items:center; justify-content:center; }
.broch-section { margin-top:.65rem; padding-top:.55rem; border-top:1px dashed var(--border); }
.broch-section__head { display:flex; align-items:center; justify-content:space-between; gap:.5rem; margin-bottom:.5rem; }
.broch-grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(130px, 1fr)); gap:.5rem; }
.broch-card { display:flex; flex-direction:column; }
.btn { display:inline-flex; align-items:center; justify-content:center; gap:.45rem; padding:.7rem 1.1rem; border-radius:var(--radius-sm); font-weight:900; font-size:.88rem; cursor:pointer; border:1px solid transparent; transition:var(--transition); text-decoration:none; white-space:nowrap; font-family:inherit; }
.btn--primary { background:var(--crimson); color:#fff; box-shadow:0 6px 20px rgba(140,21,21,.25); }
.btn--primary:hover { background:var(--crimson-lt); transform:translateY(-1px); }
.btn--ghost { background:transparent; border-color:var(--border); color:var(--text); }
.btn--ghost:hover { border-color:var(--crimson); color:var(--crimson); }
.btn--outline { background:transparent; border-color:var(--border); color:var(--muted); }
.btn--outline:hover { border-color:var(--crimson); color:var(--crimson); }
.btn--danger { background:#c0392b; color:#fff; border-color:#c0392b; }
.btn--danger:hover { background:#a93226; }
.btn--sm   { padding:.5rem .8rem; font-size:.83rem; }
.btn--full { width:100%; }
.btn:disabled { opacity:.55; cursor:not-allowed; transform:none!important; }
.side-actions { display:flex; flex-direction:column; gap:.6rem; }
.spinner { width:14px; height:14px; border:2px solid rgba(255,255,255,.4); border-top-color:#fff; border-radius:50%; animation:spin .7s linear infinite; }
@keyframes spin { to { transform:rotate(360deg) } }
.img-block__title { font-weight:900; font-size:.84rem; color:var(--text); margin-bottom:.55rem; display:flex; align-items:center; gap:.5rem; flex-wrap:wrap; }
.img-block__hint { font-size:.72rem; color:var(--muted); font-weight:600; }
.img-sep { height:1px; background:var(--cream-dk); margin:1rem 0; }

/* Add badge style for auto-extracted values */
.auto-badge {
  display: inline-block;
  margin-right: .4rem;
  padding: .1rem .4rem;
  border-radius: 4px;
  font-size: .72rem;
  font-weight: 600;
  background: color-mix(in srgb, var(--accent, #7c6cfc) 15%, transparent);
  color: var(--accent, #7c6cfc);
  vertical-align: middle;
}
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