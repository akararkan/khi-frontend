<template>
  <div class="ced" dir="rtl">

    <!-- Header -->
    <div class="ced__head">
      <RouterLink to="/admin/contact" class="ced__back">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5M12 5l-7 7 7 7"/>
        </svg>
        گەڕانەوە
      </RouterLink>
      <div>
        <h1 class="ced__title">{{ isEdit ? 'دەستکاری پەیوەندی' : 'پەیوەندی نوێ' }}</h1>
        <p class="ced__sub" v-if="isEdit">ID: {{ route.params.id }}</p>
      </div>

      <!-- Global Language Switcher -->
      <div class="lang-switcher">
        <button type="button" class="lang-btn" :class="{ 'lang-btn--active': activeLang === 'ckb' }" @click="activeLang = 'ckb'">
          <span class="lang-btn__dot lang-btn__dot--ckb"></span>سۆرانی
        </button>
        <button type="button" class="lang-btn" :class="{ 'lang-btn--active': activeLang === 'kmr' }" @click="activeLang = 'kmr'">
          <span class="lang-btn__dot lang-btn__dot--kmr"></span>کرمانجی
        </button>
      </div>
    </div>

    <!-- Toast -->
    <Transition name="toast">
      <div v-if="toast.show" class="toast" :class="`toast--${toast.type}`">
        <span class="toast__ico">{{ toast.type === 'success' ? '✓' : '✕' }}</span>
        {{ toast.msg }}
      </div>
    </Transition>

    <!-- Loading bar -->
    <div v-if="fetching" class="loading-bar"></div>

    <div v-else class="ced__layout">

      <!-- ==================== MAIN COLUMN ==================== -->
      <div class="col-main">

        <!-- ── Hero Image ── -->
        <section class="card">
          <div class="card__hd">
            <span class="card__hd-ico">🖼️</span>
            وێنەی هیرۆ
            <span class="card__hd-hint">بانەری سەرەوەی پەڕەکە — هاوبەش بۆ هەر دوو زمان</span>
          </div>

          <div class="hero-field">
            <div class="hero-preview" :class="{ 'hero-preview--empty': !form.heroImageUrl }">
              <img v-if="form.heroImageUrl" :src="form.heroImageUrl" class="hero-preview__img" loading="lazy" />
              <div v-else class="hero-preview__placeholder">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
                <span>وێنەی هیرۆ هەڵنەبژێردراوە</span>
                <span class="hero-preview__hint">پێشنیاری پێوانە: 1600 × 600px</span>
              </div>
              <button v-if="form.heroImageUrl" type="button" class="hero-preview__remove" @click="form.heroImageUrl = ''">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <div class="hero-input-row">
              <div class="slug-input-wrap" style="flex:1">
                <span class="slug-input-wrap__prefix">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                </span>
                <input v-model="form.heroImageUrl" class="inp inp--slug" placeholder="https://… یان فایل باربکە" dir="ltr" />
              </div>
              <label class="upload-btn" :class="{ 'upload-btn--loading': heroUploading }">
                <span v-if="heroUploading" class="spinner spinner--dark"></span>
                <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                {{ heroUploading ? 'بارکردن…' : 'بارکردن' }}
                <input type="file" hidden accept="image/*" @change="uploadHeroImage" />
              </label>
            </div>
            <div class="field__hint">وێنەی بانەر — پێشنیار: 1600×600px، کوالیتی بەرز.</div>
          </div>
        </section>

        <!-- ── Basic Info (slugs + bilingual text) ── -->
        <section class="card">
          <div class="card__hd">
            <span class="card__hd-ico">📄</span>
            زانیاری سەرەکی
            <span class="card__hd-lang" :class="`card__hd-lang--${activeLang}`">
              {{ activeLang === 'ckb' ? 'سۆرانی' : 'کرمانجی' }}
            </span>
          </div>

          <!-- Slugs -->
          <div class="slug-row">
            <div class="field slug-field" :class="{ 'slug-field--active': activeLang === 'ckb' }">
              <label class="lbl lbl--req">
                سلەگی سۆرانی
                <span class="lbl__lang lbl__lang--ckb">CKB</span>
              </label>
              <div class="slug-input-wrap">
                <span class="slug-input-wrap__prefix">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
                </span>
                <input v-model="form.slugCkb" class="inp inp--slug" :class="{ 'inp--err': errors.slugCkb }" placeholder="contact-ckb" :disabled="isEdit" dir="ltr" />
              </div>
              <div v-if="errors.slugCkb" class="err">{{ errors.slugCkb }}</div>
              <div v-else class="field__hint">{{ isEdit ? 'ناتوانرێت بگۆڕدرێت' : 'ناسەری URL — ASCII یان کوردی' }}</div>
            </div>

            <div class="field slug-field" :class="{ 'slug-field--active': activeLang === 'kmr' }">
              <label class="lbl">
                سلەگی کرمانجی
                <span class="lbl__lang lbl__lang--kmr">KMR</span>
                <span class="lbl__optional">ئیختیاری</span>
              </label>
              <div class="slug-input-wrap">
                <span class="slug-input-wrap__prefix">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
                </span>
                <input v-model="form.slugKmr" class="inp inp--slug" :class="{ 'inp--err': errors.slugKmr }" placeholder="contact-kmr" :disabled="isEdit" dir="ltr" />
              </div>
              <div v-if="errors.slugKmr" class="err">{{ errors.slugKmr }}</div>
              <div v-else class="field__hint">{{ isEdit ? 'ناتوانرێت بگۆڕدرێت' : 'ئەگەر بۆشبێت، سلەگی سۆرانی بەکاردێت' }}</div>
            </div>
          </div>

          <!-- Title -->
          <div class="field">
            <label class="lbl lbl--req">
              ناونیشان
              <span class="lbl__lang" :class="`lbl__lang--${activeLang}`">{{ activeLang === 'ckb' ? 'CKB' : 'KMR' }}</span>
            </label>
            <input v-if="activeLang === 'ckb'" v-model="form.ckbContent.title" class="inp" :class="{ 'inp--err': errors.ckbTitle }" placeholder="پەیوەندیمان پێوە بکە…" />
            <input v-else v-model="form.kmrContent.title" class="inp" placeholder="Bi me re têkiliyê daynin…" />
            <div v-if="errors.ckbTitle && activeLang === 'ckb'" class="err">{{ errors.ckbTitle }}</div>
          </div>

          <!-- Subtitle -->
          <div class="field">
            <label class="lbl">
              ژێرناونیشان
              <span class="lbl__lang" :class="`lbl__lang--${activeLang}`">{{ activeLang === 'ckb' ? 'CKB' : 'KMR' }}</span>
            </label>
            <input v-if="activeLang === 'ckb'" v-model="form.ckbContent.subtitle" class="inp" placeholder="وەسفی کورت…" />
            <input v-else v-model="form.kmrContent.subtitle" class="inp" placeholder="Danasîna kurt…" />
          </div>

          <!-- Address -->
          <div class="field">
            <label class="lbl">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
              ناونیشانی شوێن
              <span class="lbl__lang" :class="`lbl__lang--${activeLang}`">{{ activeLang === 'ckb' ? 'CKB' : 'KMR' }}</span>
            </label>
            <input v-if="activeLang === 'ckb'" v-model="form.ckbContent.address" class="inp" placeholder="سلێمانی، هەرێمی کوردستان…" />
            <input v-else v-model="form.kmrContent.address" class="inp" placeholder="Silêmanî, Herêma Kurdistanê…" />
          </div>

          <!-- Working Hours -->
          <div class="field">
            <label class="lbl">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              کاتی کارکردن
              <span class="lbl__lang" :class="`lbl__lang--${activeLang}`">{{ activeLang === 'ckb' ? 'CKB' : 'KMR' }}</span>
            </label>
            <input v-if="activeLang === 'ckb'" v-model="form.ckbContent.workingHours" class="inp" placeholder="یەکشەممە - پێنجشەممە، ٩:٠٠ - ١٦:٠٠…" />
            <input v-else v-model="form.kmrContent.workingHours" class="inp" placeholder="Duşem - Înê, 09:00 - 16:00…" />
          </div>

          <!-- Fill status -->
          <div class="fill-status">
            <div class="fill-status__item" :class="{ 'fill-status__item--ok': form.ckbContent.title && form.slugCkb }">
              <span class="fill-status__dot"></span>
              سۆرانی — {{ (form.ckbContent.title && form.slugCkb) ? 'تەواو ✓' : 'ناونیشان / سلەگ پێویستە' }}
            </div>
            <div class="fill-status__item" :class="{ 'fill-status__item--ok': form.kmrContent.title && form.slugKmr }">
              <span class="fill-status__dot"></span>
              کرمانجی — {{ (form.kmrContent.title && form.slugKmr) ? 'تەواو ✓' : 'تازەیە (ئیختیاری)' }}
            </div>
          </div>
        </section>

        <!-- ── Contact Details ── -->
        <section class="card">
          <div class="card__hd">
            <span class="card__hd-ico">📞</span>
            زانیاری پەیوەندی
            <span class="card__hd-hint">هاوبەش بۆ هەر دوو زمان</span>
          </div>

          <div class="contact-details-grid">
            <!-- Phone -->
            <div class="field">
              <label class="lbl lbl--icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.1 1.22 2 2 0 012.1 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z"/></svg>
                تەلەفۆنی سەرەکی
              </label>
              <div class="contact-input-wrap">
                <input v-model="form.phone" class="inp" placeholder="+964 770 123 4567" dir="ltr" />
                <span class="contact-input-wrap__preview" v-if="form.phone">{{ form.phone }}</span>
              </div>
            </div>

            <!-- Secondary Phone -->
            <div class="field">
              <label class="lbl lbl--icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.1 1.22 2 2 0 012.1 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z"/></svg>
                تەلەفۆنی دووەم
                <span class="lbl__optional">ئیختیاری</span>
              </label>
              <input v-model="form.secondaryPhone" class="inp" placeholder="+964 750 000 0000" dir="ltr" />
            </div>

            <!-- Email -->
            <div class="field">
              <label class="lbl lbl--icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                ئیمەیل
              </label>
              <input v-model="form.email" class="inp" placeholder="info@example.org" dir="ltr" type="email" />
            </div>
          </div>
        </section>

        <!-- ── Map ── -->
        <section class="card">
          <div class="card__hd">
            <span class="card__hd-ico">🗺️</span>
            نەخشە
            <span class="card__hd-hint">Google Maps یان هەر نەخشەیەک</span>
          </div>

          <!-- Map Embed Preview -->
          <div v-if="form.mapEmbedUrl" class="map-preview">
            <iframe :src="form.mapEmbedUrl" class="map-preview__iframe" loading="lazy" allowfullscreen referrerpolicy="no-referrer-when-downgrade"></iframe>
            <button type="button" class="map-preview__remove" @click="form.mapEmbedUrl = ''">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
              سڕینەوەی نەخشە
            </button>
          </div>

          <div class="field" :class="{ 'mt-0': !form.mapEmbedUrl }">
            <label class="lbl">لینکی Embed نەخشە</label>
            <textarea v-model="form.mapEmbedUrl" class="inp ta ta--sm ta--code" rows="2"
              placeholder="https://www.google.com/maps/embed?pb=…" dir="ltr"></textarea>

            <!-- Warn if a non-embeddable URL is pasted -->
            <div v-if="form.mapEmbedUrl && !isEmbeddableUrl(form.mapEmbedUrl)" class="map-url-warn">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              <div>
                <strong>ئەم لینکە embed ناکرێت</strong> — لینکی کورت یان لینکی ئاسای Google Maps ناتوانرێت لە iframe نیشان بدرێت.<br/>
                چۆن لینکی ڕاست وەربگرێت:
                <ol class="map-url-steps">
                  <li>Google Maps بکەرەوە و شوێنەکەت بدۆزەرەوە</li>
                  <li>کلیک لەسەر <strong>Share</strong> بکە</li>
                  <li>بەشی <strong>Embed a map</strong> هەڵبژێرە</li>
                  <li>لە کۆدی HTML، تەنها ناوەڕۆکی <code>src="…"</code> کۆپی بکە</li>
                </ol>
                نمونە: <code dir="ltr" class="map-url-example">https://www.google.com/maps/embed?pb=!1m18…</code>
              </div>
            </div>

            <div v-else class="field__hint">
              <strong>تەنها</strong> لینکی <code dir="ltr">google.com/maps/embed?pb=…</code> کار دەکات —
              لینکی کورت (<code dir="ltr">maps.app.goo.gl</code>) یان لینکی ئاسای Maps embed ناکرێت.
              بۆ وەرگرتن: Google Maps → Share → Embed a map → src="…" کۆپی بکە.
            </div>
          </div>

          <!-- Lat / Lng -->
          <div class="two-grid">
            <div class="field">
              <label class="lbl">Latitude</label>
              <input v-model.number="form.latitude" class="inp" placeholder="35.5653" type="number" step="any" dir="ltr" />
            </div>
            <div class="field">
              <label class="lbl">Longitude</label>
              <input v-model.number="form.longitude" class="inp" placeholder="45.4347" type="number" step="any" dir="ltr" />
            </div>
          </div>
          <div class="field__hint" style="margin-top:-.5rem">
            Latitude + Longitude بەکاردێن کاتێک Embed بۆشە — دەگواستن بۆ "Open in Maps" دوگمە.
          </div>
        </section>

      </div>

      <!-- ==================== SIDEBAR ==================== -->
      <div class="col-side">

        <section class="card card--sticky">
          <div class="card__hd"><span class="card__hd-ico">🚀</span>بڵاوکردنەوە</div>

          <div class="publish-info" v-if="isEdit">
            <div class="publish-info__row"><span>ناسنامە:</span><strong>#{{ route.params.id }}</strong></div>
            <div class="publish-info__row" v-if="existingData?.createdAt"><span>دروستکراوە:</span><strong>{{ existingData.createdAt }}</strong></div>
            <div class="publish-info__row">
              <span>سلەگ CKB:</span>
              <code class="slug-code slug-code--ckb">{{ form.slugCkb || '—' }}</code>
            </div>
            <div class="publish-info__row">
              <span>سلەگ KMR:</span>
              <code class="slug-code slug-code--kmr">{{ form.slugKmr || '—' }}</code>
            </div>
            <div class="publish-info__row">
              <span>هیرۆ:</span>
              <span v-if="form.heroImageUrl" class="hero-status hero-status--ok">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                دیاریکراوە ✓
              </span>
              <span v-else class="hero-status hero-status--empty">نییە</span>
            </div>
          </div>

          <!-- Fill completeness bars -->
          <div class="lang-completeness">
            <div class="lang-completeness__row">
              <span class="lang-completeness__label lang-completeness__label--ckb">سۆرانی</span>
              <span class="lang-completeness__val">{{ ckbFillCount }}/{{ totalFillFields }}</span>
              <div class="lang-completeness__bar">
                <div class="lang-completeness__bar-fill lang-completeness__bar-fill--ckb"
                  :style="{ width: `${Math.round(ckbFillCount / Math.max(totalFillFields,1) * 100)}%` }"></div>
              </div>
            </div>
            <div class="lang-completeness__row">
              <span class="lang-completeness__label lang-completeness__label--kmr">کرمانجی</span>
              <span class="lang-completeness__val">{{ kmrFillCount }}/{{ totalFillFields }}</span>
              <div class="lang-completeness__bar">
                <div class="lang-completeness__bar-fill lang-completeness__bar-fill--kmr"
                  :style="{ width: `${Math.round(kmrFillCount / Math.max(totalFillFields,1) * 100)}%` }"></div>
              </div>
            </div>
          </div>

          <!-- Contact details summary in sidebar -->
          <div class="contact-summary">
            <div class="contact-summary__row" v-if="form.phone">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.1 1.22 2 2 0 012.1 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z"/></svg>
              <span>{{ form.phone }}</span>
            </div>
            <div class="contact-summary__row" v-if="form.email">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              <span>{{ form.email }}</span>
            </div>
            <div class="contact-summary__row" v-if="form.mapEmbedUrl">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <span>نەخشە ✓</span>
            </div>
          </div>

          <div class="publish-actions">
            <button type="button" class="btn btn--primary btn--full" :disabled="saving" @click="submit">
              <span v-if="saving" class="spinner"></span>
              {{ saving ? 'پاشەکەوتکردن…' : (isEdit ? 'نوێکردنەوە' : 'دروستکردن') }}
            </button>
            <button v-if="isEdit" type="button" class="btn btn--danger btn--full" @click="doDelete">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
              </svg>
              سڕینەوە
            </button>
            <RouterLink to="/admin/contact" class="btn btn--ghost btn--full">هەڵوەشاندنەوە</RouterLink>
          </div>
        </section>

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

const isEdit        = computed(() => !!route.params.id)
const fetching      = ref(false)
const saving        = ref(false)
const heroUploading = ref(false)
const existingData  = ref(null)
const toast         = ref({ show: false, type: 'success', msg: '' })
const errors        = ref({})
const activeLang    = ref('ckb')

const blankContent = () => ({ title: '', subtitle: '', address: '', workingHours: '' })

const form = reactive({
  slugCkb:        '',
  slugKmr:        '',
  heroImageUrl:   '',
  ckbContent:     blankContent(),
  kmrContent:     blankContent(),
  phone:          '',
  secondaryPhone: '',
  email:          '',
  mapEmbedUrl:    '',
  latitude:       null,
  longitude:      null,
})

// ─── Fill completeness ────────────────────────────────────────────────────────

const totalFillFields = computed(() => 4) // slug, title, address, workingHours per lang

const ckbFillCount = computed(() => {
  let n = 0
  if (form.slugCkb)                  n++
  if (form.ckbContent.title)         n++
  if (form.ckbContent.address)       n++
  if (form.ckbContent.workingHours)  n++
  return Math.min(n, totalFillFields.value)
})

const kmrFillCount = computed(() => {
  let n = 0
  if (form.slugKmr)                  n++
  if (form.kmrContent.title)         n++
  if (form.kmrContent.address)       n++
  if (form.kmrContent.workingHours)  n++
  return Math.min(n, totalFillFields.value)
})

// ─── Hero Image Upload ────────────────────────────────────────────────────────

async function uploadHeroImage(event) {
  const file = event.target.files?.[0]; if (!file) return
  heroUploading.value = true
  try {
    const fd = new FormData()
    fd.append('file', file)
    const { data } = await api.post('/api/v1/contact/upload', fd, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    const payload = data?.data ?? data
    form.heroImageUrl = payload?.fileUrl ?? payload?.url ?? ''
    showToast('success', 'وێنەی هیرۆ بارکرا ✓')
  } catch (e) {
    showToast('error', e?.response?.data?.message || 'بارکردن سەرکەوتوو نەبوو')
  } finally {
    heroUploading.value = false
    event.target.value = ''
  }
}

// ─── Validation ───────────────────────────────────────────────────────────────

function validate() {
  const e = {}
  if (!form.slugCkb.trim())          e.slugCkb  = 'سلەگی سۆرانی پێویستە'
  if (form.slugKmr && form.slugKmr.trim() === form.slugCkb.trim())
                                      e.slugKmr  = 'سلەگی کرمانجی دەبێت جیاواز بێت'
  if (!form.ckbContent.title.trim()) e.ckbTitle = 'ناونیشانی سۆرانی پێویستە'
  errors.value = e
  if (e.slugCkb || e.ckbTitle) activeLang.value = 'ckb'
  if (e.slugKmr && !e.slugCkb && !e.ckbTitle) activeLang.value = 'kmr'
  return !Object.keys(e).length
}

// ─── Load (edit mode) ─────────────────────────────────────────────────────────

async function loadContact() {
  if (!isEdit.value) return
  fetching.value = true
  try {
    const { data } = await api.get('/api/v1/contact')
    const list  = data?.data ?? data
    const found = (Array.isArray(list) ? list : []).find(c => String(c.id) === String(route.params.id))
    if (!found) throw new Error('نەدۆزرایەوە')
    existingData.value = found
    form.slugCkb        = found.slugCkb        || ''
    form.slugKmr        = found.slugKmr        || ''
    form.heroImageUrl   = found.heroImageUrl   || ''
    form.phone          = found.phone          || ''
    form.secondaryPhone = found.secondaryPhone || ''
    form.email          = found.email          || ''
    form.mapEmbedUrl    = found.mapEmbedUrl    || ''
    form.latitude       = found.latitude       ?? null
    form.longitude      = found.longitude      ?? null
    form.ckbContent = {
      title:        found.ckbContent?.title        || '',
      subtitle:     found.ckbContent?.subtitle     || '',
      address:      found.ckbContent?.address      || '',
      workingHours: found.ckbContent?.workingHours || '',
    }
    form.kmrContent = {
      title:        found.kmrContent?.title        || '',
      subtitle:     found.kmrContent?.subtitle     || '',
      address:      found.kmrContent?.address      || '',
      workingHours: found.kmrContent?.workingHours || '',
    }
  } catch (e) {
    showToast('error', e?.response?.data?.message || e.message || 'بارکردن سەرکەوتوو نەبوو')
  } finally { fetching.value = false }
}

// ─── Submit ───────────────────────────────────────────────────────────────────

async function submit() {
  if (!validate()) { window.scrollTo({ top: 0, behavior: 'smooth' }); return }
  saving.value = true

  const dto = {
    slugCkb:        form.slugCkb.trim(),
    slugKmr:        form.slugKmr.trim()  || null,
    heroImageUrl:   form.heroImageUrl.trim() || null,
    ckbContent: {
      title:        form.ckbContent.title        || null,
      subtitle:     form.ckbContent.subtitle     || null,
      address:      form.ckbContent.address      || null,
      workingHours: form.ckbContent.workingHours || null,
    },
    kmrContent: {
      title:        form.kmrContent.title        || null,
      subtitle:     form.kmrContent.subtitle     || null,
      address:      form.kmrContent.address      || null,
      workingHours: form.kmrContent.workingHours || null,
    },
    phone:          form.phone.trim()          || null,
    secondaryPhone: form.secondaryPhone.trim() || null,
    email:          form.email.trim()          || null,
    mapEmbedUrl:    form.mapEmbedUrl.trim()    || null,
    latitude:       form.latitude  ?? null,
    longitude:      form.longitude ?? null,
  }

  try {
    if (isEdit.value) {
      await api.put(`/api/v1/contact/${route.params.id}`, dto)
      showToast('success', 'پەیوەندیکە نوێکرایەوە ✓')
    } else {
      await api.post('/api/v1/contact', dto)
      showToast('success', 'پەیوەندیکە دروستکرا ✓')
    }
    setTimeout(() => router.push('/admin/contact'), 1200)
  } catch (e) {
    showToast('error', e?.response?.data?.message || e.message || 'هەڵەیەک ڕوویدا')
  } finally { saving.value = false }
}

async function doDelete() {
  if (!confirm(`دڵنیای لە سڕینەوەی پەیوەندی #${route.params.id}؟`)) return
  try {
    await api.delete(`/api/v1/contact/${route.params.id}`)
    showToast('success', 'سڕایەوە ✓')
    setTimeout(() => router.push('/admin/contact'), 800)
  } catch (e) { showToast('error', e?.response?.data?.message || 'سڕینەوە سەرکەوتوو نەبوو') }
}

function isEmbeddableUrl(url) {
  if (!url) return false
  try {
    const u = new URL(url)
    return u.hostname.includes('google.com') && u.pathname.includes('/maps/embed')
  } catch { return false }
}

function showToast(type, msg) {
  toast.value = { show: true, type, msg }
  setTimeout(() => { toast.value.show = false }, 3500)
}

onMounted(loadContact)
</script>

<style scoped>
.ced { direction: rtl; max-width: 1200px; margin: 0 auto; }
.ced__head { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
.ced__back { display: inline-flex; align-items: center; gap: .4rem; text-decoration: none; color: var(--muted, #767571); font-weight: 700; font-size: .9rem; padding: .45rem .7rem; border-radius: 10px; background: var(--white, #fff); border: 1px solid var(--border, #E0DFDC); transition: all .15s; }
.ced__back:hover { border-color: #8C1515; color: #8C1515; }
.ced__title { margin: 0; font-weight: 900; font-size: clamp(1.2rem, 2vw, 1.6rem); color: var(--text, #2E2D29); }
.ced__sub { margin: .15rem 0 0; color: var(--muted, #767571); font-weight: 600; font-size: .85rem; }
.ced__layout { display: grid; grid-template-columns: 1fr 300px; gap: 1.2rem; align-items: start; }
@media (max-width: 900px) { .ced__layout { grid-template-columns: 1fr; } }
.col-main { display: flex; flex-direction: column; gap: 1rem; }
.col-side { display: flex; flex-direction: column; gap: 1rem; }

/* Lang switcher */
.lang-switcher { display: flex; gap: .3rem; margin-right: auto; background: #f0eeeb; border-radius: 12px; padding: .25rem; }
.lang-btn { display: inline-flex; align-items: center; gap: .4rem; padding: .4rem .9rem; border-radius: 9px; border: none; background: transparent; font-weight: 800; font-size: .85rem; color: var(--muted, #767571); cursor: pointer; transition: all .18s; font: inherit; }
.lang-btn--active { background: #fff; color: var(--text, #2E2D29); box-shadow: 0 2px 8px rgba(0,0,0,.08); }
.lang-btn__dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }
.lang-btn__dot--ckb { background: #8C1515; }
.lang-btn__dot--kmr { background: #1d6bbf; }

/* Cards */
.card { background: var(--white, #fff); border: 1px solid var(--border, #E0DFDC); border-radius: 16px; padding: 1.25rem; box-shadow: 0 4px 16px rgba(0,0,0,.03); }
.card--sticky { position: sticky; top: 1rem; }
.card__hd { display: flex; align-items: center; gap: .5rem; font-weight: 800; color: var(--text, #2E2D29); margin-bottom: 1rem; font-size: .95rem; padding-bottom: .7rem; border-bottom: 1px solid #f0eeeb; }
.card__hd-ico { font-size: 1.1rem; }
.card__hd-lang { font-size: .72rem; font-weight: 800; padding: .15rem .5rem; border-radius: 6px; }
.card__hd-lang--ckb { background: #fef2f2; color: #8C1515; }
.card__hd-lang--kmr { background: #eff6ff; color: #1d6bbf; }
.card__hd-hint { font-size: .72rem; font-weight: 600; color: var(--muted, #767571); background: #f0eeeb; padding: .15rem .5rem; border-radius: 6px; margin-right: auto; }

/* Hero image */
.hero-field { display: flex; flex-direction: column; gap: .75rem; }
.hero-preview { position: relative; border-radius: 12px; overflow: hidden; background: #FAFAF9; border: 2px dashed var(--border, #E0DFDC); transition: border-color .2s; }
.hero-preview:has(img) { border-style: solid; border-color: #c8c6c1; }
.hero-preview__img { display: block; width: 100%; height: 200px; object-fit: cover; object-position: center 30%; }
.hero-preview__placeholder { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: .5rem; height: 160px; color: var(--muted, #767571); }
.hero-preview__placeholder svg { opacity: .4; }
.hero-preview__placeholder span { font-weight: 600; font-size: .85rem; }
.hero-preview__hint { font-size: .75rem; opacity: .7; }
.hero-preview__remove { position: absolute; top: .6rem; left: .6rem; width: 28px; height: 28px; border-radius: 8px; background: rgba(220,38,38,.85); backdrop-filter: blur(4px); border: none; color: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: background .15s; }
.hero-preview__remove:hover { background: rgba(185,28,28,1); }
.hero-input-row { display: flex; gap: .5rem; }
.hero-input-row .slug-input-wrap { flex: 1; }

/* Upload button — was missing, caused broken/invisible button */
.upload-btn {
  display: inline-flex; align-items: center; gap: .4rem;
  padding: .62rem .95rem; border-radius: 10px;
  background: #FAFAF9; border: 1.5px solid var(--border, #E0DFDC);
  font-weight: 700; font-size: .85rem; color: var(--muted, #767571);
  cursor: pointer; transition: all .15s; white-space: nowrap; font: inherit;
  flex-shrink: 0;
}
.upload-btn:hover:not(.upload-btn--loading) { border-color: #8C1515; color: #8C1515; background: #faf0f0; }
.upload-btn--loading { opacity: .7; cursor: not-allowed; pointer-events: none; }

/* Slugs */
.slug-row { display: grid; grid-template-columns: 1fr 1fr; gap: .75rem; margin-bottom: .25rem; }
@media (max-width: 600px) { .slug-row { grid-template-columns: 1fr; } }
.slug-field { border: 1.5px solid var(--border, #E0DFDC); border-radius: 12px; padding: .75rem; transition: border-color .2s; }
.slug-field--active.slug-field:has(.lbl__lang--ckb) { border-color: rgba(140,21,21,.3); background: #fffafa; }
.slug-field--active.slug-field:has(.lbl__lang--kmr) { border-color: rgba(29,107,191,.3); background: #f8fbff; }
.slug-input-wrap { position: relative; display: flex; align-items: center; }
/* Icon sits at the inline-end (right in RTL). Inputs with dir="ltr" need padding-right, not padding-left */
.slug-input-wrap__prefix { position: absolute; right: .75rem; color: var(--muted, #767571); display: flex; pointer-events: none; }
.inp--slug { padding-right: 2.2rem; padding-left: .85rem; font-family: monospace; font-size: .9rem; }

/* Contact details grid */
.contact-details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: .75rem 1rem; }
@media (max-width: 640px) { .contact-details-grid { grid-template-columns: 1fr; } }
.contact-input-wrap { position: relative; }
.contact-input-wrap__preview { position: absolute; left: .75rem; top: 50%; transform: translateY(-50%); font-size: .75rem; color: var(--muted, #767571); font-family: monospace; pointer-events: none; }

/* Map preview */
.map-preview { position: relative; border-radius: 12px; overflow: hidden; margin-bottom: .75rem; border: 1px solid var(--border, #E0DFDC); }
.map-preview__iframe { display: block; width: 100%; height: 220px; border: none; }
.map-preview__remove { position: absolute; top: .6rem; left: .6rem; display: inline-flex; align-items: center; gap: .35rem; padding: .35rem .7rem; border-radius: 8px; background: rgba(220,38,38,.9); color: #fff; border: none; font-weight: 700; font-size: .78rem; cursor: pointer; transition: background .15s; font: inherit; }
.map-preview__remove:hover { background: rgba(185,28,28,1); }

/* Two grid */
.two-grid { display: grid; grid-template-columns: 1fr 1fr; gap: .75rem; }
@media (max-width: 600px) { .two-grid { grid-template-columns: 1fr; } }

/* Fields */
.field { margin-bottom: .85rem; }
.lbl { display: flex; align-items: center; gap: .4rem; font-weight: 700; color: var(--text, #2E2D29); margin-bottom: .3rem; font-size: .85rem; }
.lbl--req::after { content: ' *'; color: #8C1515; font-weight: 800; }
.lbl--icon { gap: .35rem; }
.lbl__lang { font-size: .7rem; font-weight: 800; padding: .1rem .4rem; border-radius: 5px; }
.lbl__lang--ckb { background: #fef2f2; color: #8C1515; }
.lbl__lang--kmr { background: #eff6ff; color: #1d6bbf; }
.lbl__optional { font-size: .7rem; font-weight: 600; color: var(--muted, #767571); background: #f0eeeb; padding: .1rem .4rem; border-radius: 5px; }
.inp { width: 100%; padding: .65rem .85rem; border: 1.5px solid var(--border, #E0DFDC); border-radius: 10px; font: inherit; color: var(--text, #2E2D29); background: var(--white, #fff); transition: border-color .2s; box-sizing: border-box; }
.inp:focus { outline: none; border-color: #8C1515; }
.inp--err { border-color: #dc2626; }
.ta { resize: vertical; min-height: 80px; line-height: 1.7; }
.ta--sm { min-height: 56px; }
.ta--code { font-family: monospace; font-size: .85rem; direction: ltr; text-align: left; }
.err { color: #dc2626; font-size: .82rem; font-weight: 600; margin-top: .25rem; }
.field__hint { color: var(--muted, #767571); font-size: .8rem; margin-top: .2rem; }
.mt-0 { margin-top: 0; }

/* Fill status */
.fill-status { display: flex; gap: 1rem; margin-top: .75rem; padding: .6rem .75rem; border-radius: 10px; background: #FAFAF9; border: 1px solid #f0eeeb; }
.fill-status__item { display: flex; align-items: center; gap: .4rem; font-size: .78rem; font-weight: 700; color: var(--muted, #767571); }
.fill-status__item--ok { color: #065f46; }
.fill-status__dot { width: 7px; height: 7px; border-radius: 50%; background: #d1d5db; }
.fill-status__item--ok .fill-status__dot { background: #10b981; }

/* Sidebar */
.contact-summary { display: flex; flex-direction: column; gap: .35rem; margin-bottom: 1rem; padding: .75rem; background: #FAFAF9; border-radius: 10px; border: 1px solid #f0eeeb; }
.contact-summary__row { display: flex; align-items: center; gap: .5rem; font-size: .82rem; font-weight: 600; color: var(--text, #2E2D29); font-family: monospace; }
.contact-summary__row svg { color: #8C1515; flex-shrink: 0; }
.slug-code { font-family: monospace; font-size: .78rem; padding: .1rem .4rem; border-radius: 5px; }
.slug-code--ckb { background: #fef2f2; color: #8C1515; }
.slug-code--kmr { background: #eff6ff; color: #1d6bbf; }
.hero-status { font-size: .78rem; font-weight: 700; display: inline-flex; align-items: center; gap: .25rem; }
.hero-status--ok { color: #065f46; }
.hero-status--empty { color: var(--muted, #767571); }
.lang-completeness { margin-bottom: 1rem; display: flex; flex-direction: column; gap: .5rem; }
.lang-completeness__row { display: flex; align-items: center; gap: .5rem; flex-wrap: wrap; }
.lang-completeness__label { font-size: .75rem; font-weight: 800; padding: .1rem .4rem; border-radius: 5px; min-width: 52px; text-align: center; }
.lang-completeness__label--ckb { background: #fef2f2; color: #8C1515; }
.lang-completeness__label--kmr { background: #eff6ff; color: #1d6bbf; }
.lang-completeness__val { font-size: .75rem; color: var(--muted, #767571); font-weight: 600; min-width: 38px; text-align: left; }
.lang-completeness__bar { flex: 1; height: 5px; border-radius: 4px; background: #f0eeeb; overflow: hidden; }
.lang-completeness__bar-fill { height: 100%; border-radius: 4px; transition: width .4s ease; }
.lang-completeness__bar-fill--ckb { background: #8C1515; }
.lang-completeness__bar-fill--kmr { background: #1d6bbf; }
.publish-info { margin-bottom: 1rem; }
.publish-info__row { display: flex; justify-content: space-between; align-items: center; padding: .4rem 0; font-size: .85rem; border-bottom: 1px solid #f0eeeb; color: var(--muted, #767571); gap: .5rem; }
.publish-info__row strong { color: var(--text, #2E2D29); }
.publish-actions { display: flex; flex-direction: column; gap: .5rem; }
.btn { display: inline-flex; align-items: center; justify-content: center; gap: .4rem; text-decoration: none; border-radius: 12px; padding: .75rem 1rem; font-weight: 900; border: 1px solid transparent; transition: .18s ease; white-space: nowrap; cursor: pointer; font: inherit; }
.btn:hover:not(:disabled) { transform: translateY(-1px); }
.btn--primary { background: #8C1515; color: #fff; box-shadow: 0 10px 24px rgba(140,21,21,.18); }
.btn--primary:hover:not(:disabled) { background: #6a0f0f; }
.btn--primary:disabled { background: #8C1515; color: rgba(255,255,255,.55); box-shadow: none; cursor: not-allowed; opacity: .65; }
.btn--danger  { background: #fff; color: #dc2626; border-color: #fecaca; }
.btn--danger:hover { background: #fef2f2; }
.btn--ghost   { background: #fff; color: #6E6B66; border-color: #E0DFDC; }
.btn--ghost:hover { background: #f5f3ef; }
.btn--full { width: 100%; }
.spinner { width: 16px; height: 16px; border-radius: 50%; border: 2px solid rgba(255,255,255,.3); border-top-color: #fff; animation: spin .7s linear infinite; }
.spinner--dark { border-color: rgba(0,0,0,.15); border-top-color: var(--muted, #767571); }
@keyframes spin { to { transform: rotate(360deg); } }
.toast { position: fixed; top: 1.2rem; left: 50%; transform: translateX(-50%); z-index: 9999; padding: .7rem 1.2rem; border-radius: 12px; font-weight: 700; display: flex; align-items: center; gap: .5rem; box-shadow: 0 12px 32px rgba(0,0,0,.12); }
.toast--success { background: #065f46; color: #fff; }
.toast--error   { background: #8C1515; color: #fff; }
.toast__ico { font-size: 1.1rem; }
.toast-enter-active, .toast-leave-active { transition: all .35s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translate(-50%, -20px); }
.loading-bar { height: 3px; border-radius: 3px; margin: 2rem 0; background: #e8e5e1; overflow: hidden; position: relative; }
.loading-bar::after { content: ''; position: absolute; inset: 0; background: #8C1515; border-radius: 3px; animation: bar-slide 1.2s ease infinite; }
@keyframes bar-slide { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }

/* Map URL warning box */
.map-url-warn {
  display: flex; align-items: flex-start; gap: .6rem;
  margin-top: .5rem; padding: .75rem .9rem;
  background: #fffbeb; border: 1.5px solid #fcd34d;
  border-radius: 10px; font-size: .8rem; line-height: 1.65;
  color: #78350f;
}
.map-url-warn svg { flex-shrink: 0; margin-top: 2px; color: #d97706; }
.map-url-warn strong { color: #92400e; }
.map-url-steps { margin: .4rem 0 .4rem 1.2rem; padding: 0; font-size: .78rem; }
.map-url-steps li { margin-bottom: .2rem; }
.map-url-example { font-size: .72rem; background: rgba(0,0,0,.06); padding: .1rem .35rem; border-radius: 4px; word-break: break-all; }
code { font-family: monospace; font-size: .8em; background: rgba(0,0,0,.06); padding: .05rem .3rem; border-radius: 4px; }

</style>