<template>
  <div class="clist" dir="rtl">

    <!-- HEADER -->
    <div class="clist__head">
      <div>
        <h1 class="clist__title">پەیوەندیەکان</h1>
        <p class="clist__sub">بینین، گەڕان و بەڕێوەبردنی هەموو پەڕەکانی پەیوەندی</p>
      </div>
      <RouterLink class="btn btn--primary" to="/admin/contact/new">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        پەیوەندی نوێ
      </RouterLink>
    </div>

    <!-- SEARCH BAR -->
    <div class="clist__bar">
      <div class="search">
        <svg class="search__ico" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
        <input v-model="searchQ" class="search__input" placeholder="گەڕان — ناونیشان، ئیمەیل، تەلەفۆن، سلەگ…" />
        <Transition name="fade">
          <button v-if="searchQ" class="search__clear" @click="searchQ = ''">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </Transition>
      </div>
      <select v-model="filterStatus" class="sel">
        <option value="">هەموو دۆخەکان</option>
        <option value="active">چالاک</option>
        <option value="inactive">ناچالاک</option>
      </select>
      <div class="lang-switcher">
        <button type="button" class="lang-btn" :class="{ 'lang-btn--active': listLang === 'ckb' }" @click="listLang = 'ckb'">
          <span class="lang-btn__dot lang-btn__dot--ckb"></span>سۆرانی
        </button>
        <button type="button" class="lang-btn" :class="{ 'lang-btn--active': listLang === 'kmr' }" @click="listLang = 'kmr'">
          <span class="lang-btn__dot lang-btn__dot--kmr"></span>کرمانجی
        </button>
      </div>
    </div>

    <!-- TOAST -->
    <Transition name="slide-down">
      <div v-if="toast.show" class="toast" :class="`toast--${toast.type}`">
        <span class="toast__ico">{{ toast.type === 'success' ? '✓' : '✕' }}</span>
        {{ toast.msg }}
      </div>
    </Transition>

    <!-- SKELETON -->
    <div v-if="loading" class="skeletons">
      <div class="skel" v-for="i in 3" :key="i" :style="{ animationDelay: `${i * 0.07}s` }"></div>
    </div>

    <!-- ERROR -->
    <div v-else-if="error" class="state-box state-box--error">
      <div class="state-box__ico"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg></div>
      <p>{{ error }}</p>
      <button class="btn btn--ghost btn--sm" @click="load">دووبارەتەکەیەوە</button>
    </div>

    <!-- EMPTY -->
    <div v-else-if="!visibleItems.length" class="state-box">
      <div class="state-box__ico">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.1 1.22 2 2 0 012.1 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z"/></svg>
      </div>
      <p>هیچ پەیوەندیێک نەدۆزرایەوە</p>
      <RouterLink class="btn btn--primary btn--sm" to="/admin/contact/new">یەکەمین پەیوەندی زیاد بکە</RouterLink>
    </div>

    <!-- TABLE -->
    <div v-else class="table-wrap">
      <div class="table-meta">
        کۆی {{ visibleItems.length }} پەیوەندی
        <span v-if="searchQ"> — «{{ searchQ }}»</span>
        <span class="table-meta__lang" :class="`table-meta__lang--${listLang}`">{{ listLang === 'ckb' ? 'سۆرانی' : 'کرمانجی' }}</span>
      </div>
      <table class="tbl">
        <thead>
          <tr>
            <th style="width:52px">#</th>
            <th>ناونیشان</th>
            <th>سلەگەکان</th>
            <th>تەلەفۆن</th>
            <th>ئیمەیل</th>
            <th style="width:90px">نەخشە</th>
            <th style="width:90px">زمان</th>
            <th style="width:100px">دۆخ</th>
            <th style="width:120px">بەروار</th>
            <th style="width:116px">کردار</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="c in visibleItems" :key="c.id" class="tbl__row" @click="openDetail(c)">
            <td><span class="tbl__id">#{{ c.id }}</span></td>

            <td>
              <div class="tbl__name">{{ displayTitle(c) || '—' }}</div>
              <div class="tbl__name-alt" v-if="altTitle(c)">{{ altTitle(c) }}</div>
              <div class="tbl__address" v-if="displayAddress(c)">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                {{ truncate(displayAddress(c), 30) }}
              </div>
            </td>

            <td>
              <div class="slug-stack">
                <span class="slug-pill slug-pill--ckb" v-if="c.slugCkb">
                  <span class="slug-pill__badge">CKB</span>{{ c.slugCkb }}
                </span>
                <span class="slug-pill slug-pill--kmr" v-if="c.slugKmr">
                  <span class="slug-pill__badge">KMR</span>{{ c.slugKmr }}
                </span>
                <span v-if="!c.slugCkb && !c.slugKmr" class="tbl__dash">—</span>
              </div>
            </td>

            <td>
              <div v-if="c.phone" class="contact-val contact-val--phone">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.1 1.22 2 2 0 012.1 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z"/></svg>
                {{ c.phone }}
              </div>
              <div v-if="c.secondaryPhone" class="contact-val contact-val--phone contact-val--secondary">
                {{ c.secondaryPhone }}
              </div>
              <span v-if="!c.phone" class="tbl__dash">—</span>
            </td>

            <td>
              <div v-if="c.email" class="contact-val contact-val--email">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                {{ c.email }}
              </div>
              <span v-else class="tbl__dash">—</span>
            </td>

            <td>
              <span v-if="c.mapEmbedUrl || (c.latitude && c.longitude)" class="map-badge">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                نەخشە ✓
              </span>
              <span v-else class="tbl__dash">—</span>
            </td>

            <td>
              <div class="lang-dots">
                <span class="lang-dot lang-dot--ckb" :class="{ 'lang-dot--filled': c.ckbContent?.title && c.slugCkb }" title="سۆرانی">ک</span>
                <span class="lang-dot lang-dot--kmr" :class="{ 'lang-dot--filled': c.kmrContent?.title && c.slugKmr }" title="کرمانجی">م</span>
              </div>
            </td>

            <td>
              <span class="status-pill" :class="c.active ? 'status-pill--published' : 'status-pill--draft'">
                <span class="status-pill__dot"></span>
                {{ c.active ? 'چالاک' : 'ناچالاک' }}
              </span>
            </td>

            <td class="tbl__date">{{ fmtDate(c.createdAt) }}</td>

            <td @click.stop>
              <div class="tbl__acts">
                <button class="act act--view" @click="openDetail(c)" title="بینین">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                </button>
                <RouterLink class="act act--edit" :to="`/admin/contact/${c.id}/edit`" title="دەستکاری">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4z"/></svg>
                </RouterLink>
                <button class="act act--del" @click="confirmDelete(c)" title="سڕینەوە">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- DELETE MODAL -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="delTarget" class="overlay" @click.self="delTarget = null">
          <div class="del-modal">
            <div class="del-modal__ico">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#8C1515" stroke-width="2">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                <path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
              </svg>
            </div>
            <h3 class="del-modal__title">دڵنیای لە سڕینەوە؟</h3>
            <p class="del-modal__body">
              پەیوەندی <strong>«{{ delTarget.ckbContent?.title || delTarget.kmrContent?.title || delTarget.slugCkb }}»</strong><br/>
              بە تەواوی سڕاوەتەوە و ناگەڕێتەوە.
            </p>
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

    <!-- DETAIL MODAL -->
    <Teleport to="body">
      <Transition name="pdm-fade">
        <div v-if="detail" class="pdm-overlay" @click.self="closeDetail">
          <Transition name="pdm-rise" appear>
            <div v-if="detail" class="pdm" role="dialog">
              <button class="pdm-x" @click="closeDetail">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>

              <!-- Hero image if present -->
              <div v-if="detail.heroImageUrl" class="pdm-hero">
                <img :src="detail.heroImageUrl" loading="lazy" />
                <div class="pdm-hero__gradient"></div>
              </div>

              <div class="pdm-content">
                <div class="pdm-info__head">
                  <div class="pdm-info__head-meta">
                    <span class="pdm-id-tag"># {{ detail.id }}</span>
                    <span class="pdm-status-badge" :class="detail.active ? 'pdm-status-badge--published' : 'pdm-status-badge--draft'">
                      <span class="pdm-status-badge__dot"></span>
                      {{ detail.active ? 'چالاک' : 'ناچالاک' }}
                    </span>
                  </div>

                  <!-- Slugs -->
                  <div class="pdm-slugs">
                    <span class="pdm-slug pdm-slug--ckb" v-if="detail.slugCkb">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
                      <span class="pdm-slug__badge">CKB</span>{{ detail.slugCkb }}
                    </span>
                    <span class="pdm-slug pdm-slug--kmr" v-if="detail.slugKmr">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
                      <span class="pdm-slug__badge">KMR</span>{{ detail.slugKmr }}
                    </span>
                    <span class="pdm-slug pdm-slug--missing" v-if="!detail.slugKmr">
                      <span class="pdm-slug__badge pdm-slug__badge--missing">KMR</span>سلەگ نییە
                    </span>
                  </div>

                  <!-- Lang tabs -->
                  <div class="pdm-lang-tabs">
                    <button type="button" class="pdm-lang-tab" :class="{ 'pdm-lang-tab--active': detailLang === 'ckb' }" @click="detailLang = 'ckb'">
                      <span class="lang-btn__dot lang-btn__dot--ckb"></span> سۆرانی
                      <span v-if="detail.ckbContent?.title" class="pdm-lang-tab__check">✓</span>
                    </button>
                    <button type="button" class="pdm-lang-tab" :class="{ 'pdm-lang-tab--active': detailLang === 'kmr' }" @click="detailLang = 'kmr'">
                      <span class="lang-btn__dot lang-btn__dot--kmr"></span> کرمانجی
                      <span v-if="detail.kmrContent?.title" class="pdm-lang-tab__check">✓</span>
                    </button>
                  </div>

                  <template v-if="detailLang === 'ckb'">
                    <h2 class="pdm-title">{{ detail.ckbContent?.title || '—' }}</h2>
                    <p class="pdm-subtitle" v-if="detail.ckbContent?.subtitle">{{ detail.ckbContent.subtitle }}</p>
                  </template>
                  <template v-else>
                    <h2 class="pdm-title">{{ detail.kmrContent?.title || '—' }}</h2>
                    <p class="pdm-subtitle" v-if="detail.kmrContent?.subtitle">{{ detail.kmrContent.subtitle }}</p>
                  </template>

                  <RouterLink class="pdm-edit-btn" :to="`/admin/contact/${detail.id}/edit`" @click="closeDetail">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4z"/></svg>
                    دەستکاری
                  </RouterLink>
                </div>

                <!-- Contact details card -->
                <div class="pdm-contact-card">
                  <div class="pdm-contact-row" v-if="detail.phone">
                    <div class="pdm-contact-icon pdm-contact-icon--phone">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.1 1.22 2 2 0 012.1 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z"/></svg>
                    </div>
                    <div class="pdm-contact-info">
                      <span class="pdm-contact-label">تەلەفۆن</span>
                      <span class="pdm-contact-val">{{ detail.phone }}</span>
                      <span class="pdm-contact-val pdm-contact-val--secondary" v-if="detail.secondaryPhone">{{ detail.secondaryPhone }}</span>
                    </div>
                  </div>

                  <div class="pdm-contact-row" v-if="detail.email">
                    <div class="pdm-contact-icon pdm-contact-icon--email">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    </div>
                    <div class="pdm-contact-info">
                      <span class="pdm-contact-label">ئیمەیل</span>
                      <span class="pdm-contact-val">{{ detail.email }}</span>
                    </div>
                  </div>

                  <template v-if="detailLang === 'ckb'">
                    <div class="pdm-contact-row" v-if="detail.ckbContent?.address">
                      <div class="pdm-contact-icon pdm-contact-icon--location">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      </div>
                      <div class="pdm-contact-info">
                        <span class="pdm-contact-label">ناونیشان</span>
                        <span class="pdm-contact-val">{{ detail.ckbContent.address }}</span>
                      </div>
                    </div>
                    <div class="pdm-contact-row" v-if="detail.ckbContent?.workingHours">
                      <div class="pdm-contact-icon pdm-contact-icon--clock">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      </div>
                      <div class="pdm-contact-info">
                        <span class="pdm-contact-label">کاتی کارکردن</span>
                        <span class="pdm-contact-val">{{ detail.ckbContent.workingHours }}</span>
                      </div>
                    </div>
                  </template>
                  <template v-else>
                    <div class="pdm-contact-row" v-if="detail.kmrContent?.address">
                      <div class="pdm-contact-icon pdm-contact-icon--location">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      </div>
                      <div class="pdm-contact-info">
                        <span class="pdm-contact-label">ناونیشان</span>
                        <span class="pdm-contact-val">{{ detail.kmrContent.address }}</span>
                      </div>
                    </div>
                    <div class="pdm-contact-row" v-if="detail.kmrContent?.workingHours">
                      <div class="pdm-contact-icon pdm-contact-icon--clock">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      </div>
                      <div class="pdm-contact-info">
                        <span class="pdm-contact-label">کاتی کارکردن</span>
                        <span class="pdm-contact-val">{{ detail.kmrContent.workingHours }}</span>
                      </div>
                    </div>
                  </template>

                  <div class="pdm-contact-row" v-if="detail.mapEmbedUrl">
                    <div class="pdm-contact-icon pdm-contact-icon--map">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>
                    </div>
                    <div class="pdm-contact-info">
                      <span class="pdm-contact-label">نەخشە</span>
                      <span class="pdm-contact-val pdm-contact-val--map">Embed ✓
                        <template v-if="detail.latitude && detail.longitude"> · {{ detail.latitude }}, {{ detail.longitude }}</template>
                      </span>
                    </div>
                  </div>
                </div>

                <div class="pdm-dates">
                  <span v-if="detail.createdAt">دروستکراوە: {{ detail.createdAt }}</span>
                  <span v-if="detail.updatedAt">نوێکراوەتەوە: {{ detail.updatedAt }}</span>
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
import { ref, computed, onMounted } from 'vue'
import api from '@/api.js'

const items        = ref([])
const loading      = ref(false)
const error        = ref('')
const searchQ      = ref('')
const filterStatus = ref('')
const delTarget    = ref(null)
const deleting     = ref(false)
const detail       = ref(null)
const detailLang   = ref('ckb')
const listLang     = ref('ckb')
const toast        = ref({ show: false, type: 'success', msg: '' })

async function load() {
  loading.value = true; error.value = ''
  try {
    const { data } = await api.get('/api/v1/contact')
    const list = data?.data ?? data
    items.value = Array.isArray(list) ? list : []
  } catch (e) {
    error.value = e?.response?.data?.message || e.message || 'هەڵەیەک ڕوویدا'
  } finally { loading.value = false }
}

function displayTitle(c) {
  return listLang.value === 'ckb'
    ? (c.ckbContent?.title || c.kmrContent?.title || '')
    : (c.kmrContent?.title || c.ckbContent?.title || '')
}
function altTitle(c) {
  if (listLang.value === 'ckb') {
    const kmr = c.kmrContent?.title || '', ckb = c.ckbContent?.title || ''
    return kmr && kmr !== ckb ? kmr : ''
  }
  const ckb = c.ckbContent?.title || '', kmr = c.kmrContent?.title || ''
  return ckb && ckb !== kmr ? ckb : ''
}
function displayAddress(c) {
  return listLang.value === 'ckb'
    ? (c.ckbContent?.address || c.kmrContent?.address || '')
    : (c.kmrContent?.address || c.ckbContent?.address || '')
}

const visibleItems = computed(() => {
  let pool = [...items.value]
  if (searchQ.value.trim()) {
    const q = searchQ.value.trim().toLowerCase()
    pool = pool.filter(c =>
      (c.slugCkb                 || '').toLowerCase().includes(q) ||
      (c.slugKmr                 || '').toLowerCase().includes(q) ||
      (c.ckbContent?.title       || '').toLowerCase().includes(q) ||
      (c.kmrContent?.title       || '').toLowerCase().includes(q) ||
      (c.phone                   || '').toLowerCase().includes(q) ||
      (c.secondaryPhone          || '').toLowerCase().includes(q) ||
      (c.email                   || '').toLowerCase().includes(q) ||
      (c.ckbContent?.address     || '').toLowerCase().includes(q) ||
      (c.kmrContent?.address     || '').toLowerCase().includes(q)
    )
  }
  if (filterStatus.value === 'active')   pool = pool.filter(c =>  c.active)
  if (filterStatus.value === 'inactive') pool = pool.filter(c => !c.active)
  return pool
})

function openDetail(c)  { detail.value = c; detailLang.value = 'ckb' }
function closeDetail()   { detail.value = null }
function confirmDelete(c) { delTarget.value = c }

async function doDelete() {
  if (!delTarget.value) return
  deleting.value = true
  const targetId = delTarget.value.id
  try {
    await api.delete(`/api/v1/contact/${targetId}`)
    items.value = items.value.filter(x => x.id !== targetId)
    if (detail.value?.id === targetId) closeDetail()
    showToast('success', 'پەیوەندیکە سڕایەوە ✓')
    delTarget.value = null
  } catch (e) {
    showToast('error', e?.response?.data?.message || 'سڕینەوە سەرکەوتوو نەبوو')
  } finally { deleting.value = false }
}

function showToast(type, msg) {
  toast.value = { show: true, type, msg }
  setTimeout(() => { toast.value.show = false }, 3500)
}
function fmtDate(d) {
  if (!d) return '—'
  try { return new Date(d).toLocaleDateString('ku', { year: 'numeric', month: 'short', day: 'numeric' }) }
  catch { return String(d).slice(0, 10) }
}
function truncate(s, n) { if (!s) return ''; return s.length > n ? s.slice(0, n) + '…' : s }

onMounted(load)
</script>

<style scoped>
.clist { direction: rtl; max-width: 1200px; margin: 0 auto; }
.clist__head { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; margin-bottom: 1rem; }
.clist__title { margin: 0 0 .35rem; font-size: clamp(1.2rem, 2vw, 2rem); font-weight: 900; color: var(--text, #2E2D29); }
.clist__sub { margin: 0; color: var(--muted, #767571); font-weight: 600; }
.clist__bar { display: flex; gap: .75rem; margin-bottom: 1rem; flex-wrap: wrap; align-items: center; }
.clist__bar .search { flex: 1; min-width: 200px; }

/* Lang switcher */
.lang-switcher { display: flex; gap: .25rem; background: #f0eeeb; border-radius: 12px; padding: .2rem; }
.lang-btn { display: inline-flex; align-items: center; gap: .35rem; padding: .35rem .75rem; border-radius: 9px; border: none; background: transparent; font-weight: 800; font-size: .8rem; color: var(--muted, #767571); cursor: pointer; transition: all .18s; font: inherit; }
.lang-btn--active { background: #fff; color: var(--text, #2E2D29); box-shadow: 0 2px 8px rgba(0,0,0,.07); }
.lang-btn__dot { width: 7px; height: 7px; border-radius: 50%; display: inline-block; }
.lang-btn__dot--ckb { background: #8C1515; }
.lang-btn__dot--kmr { background: #1d6bbf; }

/* Table contact values */
.contact-val { display: inline-flex; align-items: center; gap: .3rem; font-size: .82rem; font-family: monospace; font-weight: 600; }
.contact-val--phone { color: #065f46; }
.contact-val--email { color: #1d4ed8; }
.contact-val--secondary { color: var(--muted, #767571); font-size: .75rem; display: block; }
.tbl__address { display: flex; align-items: center; gap: .25rem; font-size: .75rem; color: var(--muted, #767571); margin-top: .15rem; }
.tbl__name-alt { font-size: .75rem; color: var(--muted, #767571); margin-top: .1rem; }
.map-badge { display: inline-flex; align-items: center; gap: .3rem; padding: .2rem .5rem; border-radius: 8px; font-weight: 700; background: #ecfdf5; color: #065f46; font-size: .78rem; }

/* Slugs */
.slug-stack { display: flex; flex-direction: column; gap: .25rem; }
.slug-pill { display: inline-flex; align-items: center; gap: .3rem; padding: .18rem .5rem; border-radius: 7px; font-family: monospace; font-size: .77rem; font-weight: 600; max-width: 160px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.slug-pill--ckb { background: #fef2f2; color: #8C1515; }
.slug-pill--kmr { background: #eff6ff; color: #1d6bbf; }
.slug-pill__badge { font-family: inherit; font-size: .65rem; font-weight: 900; opacity: .7; }

/* Lang dots */
.lang-dots { display: flex; gap: .25rem; }
.lang-dot { display: inline-flex; align-items: center; justify-content: center; width: 20px; height: 20px; border-radius: 6px; font-size: .65rem; font-weight: 800; background: #f0eeeb; color: #aaa; }
.lang-dot--ckb.lang-dot--filled { background: #fef2f2; color: #8C1515; }
.lang-dot--kmr.lang-dot--filled { background: #eff6ff; color: #1d6bbf; }

/* Table meta */
.table-meta__lang { font-size: .72rem; font-weight: 800; padding: .1rem .45rem; border-radius: 5px; }
.table-meta__lang--ckb { background: #fef2f2; color: #8C1515; }
.table-meta__lang--kmr { background: #eff6ff; color: #1d6bbf; }

/* Detail modal — hero */
.pdm-hero { position: relative; height: 160px; overflow: hidden; border-radius: 16px 16px 0 0; }
.pdm-hero img { width: 100%; height: 100%; object-fit: cover; object-position: center 30%; }
.pdm-hero__gradient { position: absolute; inset: 0; background: linear-gradient(to bottom, transparent 40%, rgba(0,0,0,.35)); }

/* Detail modal — contact card */
.pdm-contact-card { background: #FAFAF9; border: 1px solid #f0eeeb; border-radius: 14px; overflow: hidden; margin: 1rem 0; }
.pdm-contact-row { display: flex; align-items: flex-start; gap: .85rem; padding: .85rem 1rem; border-bottom: 1px solid #f0eeeb; }
.pdm-contact-row:last-child { border-bottom: none; }
.pdm-contact-icon { width: 34px; height: 34px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.pdm-contact-icon--phone    { background: #ecfdf5; color: #065f46; }
.pdm-contact-icon--email    { background: #eff6ff; color: #1d4ed8; }
.pdm-contact-icon--location { background: #fef2f2; color: #8C1515; }
.pdm-contact-icon--clock    { background: #fef3c7; color: #92400e; }
.pdm-contact-icon--map      { background: #f0fdf4; color: #166534; }
.pdm-contact-info { display: flex; flex-direction: column; gap: .15rem; }
.pdm-contact-label { font-size: .75rem; font-weight: 700; color: var(--muted, #767571); }
.pdm-contact-val { font-size: .9rem; font-weight: 700; color: var(--text, #2E2D29); font-family: monospace; }
.pdm-contact-val--secondary { font-size: .8rem; color: var(--muted, #767571); }
.pdm-contact-val--map { font-family: inherit; font-size: .85rem; color: #065f46; }

/* Detail modal general */
.pdm-slugs { display: flex; gap: .5rem; flex-wrap: wrap; margin-bottom: .85rem; }
.pdm-slug { display: inline-flex; align-items: center; gap: .35rem; font-family: monospace; font-size: .82rem; padding: .25rem .65rem; border-radius: 8px; }
.pdm-slug--ckb { background: #fef2f2; color: #8C1515; }
.pdm-slug--kmr { background: #eff6ff; color: #1d6bbf; }
.pdm-slug--missing { background: #f0eeeb; color: #aaa; font-family: inherit; font-size: .8rem; }
.pdm-slug__badge { font-size: .65rem; font-weight: 900; opacity: .75; }
.pdm-slug__badge--missing { opacity: .5; }

/* Search */
.search { height: 48px; border: 1px solid var(--border, #E0DFDC); background: var(--white, #fff); border-radius: 12px; display: flex; align-items: center; padding: 0 .8rem; gap: .55rem; color: var(--muted, #767571); transition: border-color .2s; }
.search:focus-within { border-color: #8C1515; }
.search__ico { flex-shrink: 0; }
.search__input { border: none; outline: none; width: 100%; background: transparent; color: var(--text, #2E2D29); font: inherit; }
.search__clear { border: none; background: #f0eeeb; border-radius: 50%; width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--muted, #767571); }
.sel { height: 48px; border: 1px solid var(--border, #E0DFDC); background: var(--white, #fff); border-radius: 12px; padding: 0 .9rem; font-weight: 700; color: var(--muted, #767571); font: inherit; cursor: pointer; outline: none; }
.sel:focus { border-color: #8C1515; }
.toast { position: fixed; top: 1.2rem; left: 50%; transform: translateX(-50%); z-index: 9999; padding: .7rem 1.2rem; border-radius: 12px; font-weight: 700; display: flex; align-items: center; gap: .5rem; box-shadow: 0 12px 32px rgba(0,0,0,.12); }
.toast--success { background: #065f46; color: #fff; }
.toast--error   { background: #8C1515; color: #fff; }
.toast__ico { font-size: 1.1rem; }
.slide-down-enter-active, .slide-down-leave-active { transition: all .35s ease; }
.slide-down-enter-from, .slide-down-leave-to { opacity: 0; transform: translate(-50%, -20px); }
.skeletons { display: flex; flex-direction: column; gap: .6rem; }
.skel { height: 52px; border-radius: 12px; background: linear-gradient(90deg, #f0eeeb 25%, #e8e5e1 50%, #f0eeeb 75%); background-size: 200% 100%; animation: shimmer 1.4s ease infinite; }
@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
.state-box { background: #fff; border: 1px solid var(--border, #E0DFDC); border-radius: 18px; min-height: 220px; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 2rem; text-align: center; gap: .6rem; }
.state-box--error { border-color: #f5c6c6; }
.state-box__ico { width: 56px; height: 56px; border-radius: 50%; background: #FAFAF9; border: 1px solid var(--border, #E0DFDC); display: flex; align-items: center; justify-content: center; color: var(--muted, #767571); }
.state-box p { color: var(--muted, #767571); font-weight: 600; }
.table-wrap { background: #fff; border: 1px solid var(--border, #E0DFDC); border-radius: 18px; box-shadow: 0 8px 24px rgba(0,0,0,.04); overflow: hidden; }
.table-meta { padding: .85rem 1.2rem; font-weight: 700; color: var(--muted, #767571); font-size: .85rem; border-bottom: 1px solid var(--border, #E0DFDC); display: flex; align-items: center; gap: .4rem; }
.tbl { width: 100%; border-collapse: collapse; font-size: .88rem; }
.tbl thead th { text-align: right; padding: .75rem .7rem; font-weight: 800; color: var(--muted, #767571); font-size: .78rem; border-bottom: 1px solid var(--border, #E0DFDC); background: #FAFAF9; white-space: nowrap; }
.tbl tbody td { padding: .7rem; border-bottom: 1px solid #f0eeeb; vertical-align: middle; }
.tbl__row { cursor: pointer; transition: background .15s; }
.tbl__row:hover { background: #FAFAF9; }
.tbl__id { font-weight: 700; color: var(--muted, #767571); font-size: .8rem; background: #f0eeeb; padding: .15rem .45rem; border-radius: 6px; }
.tbl__name { font-weight: 800; color: var(--text, #2E2D29); line-height: 1.4; }
.tbl__date { color: var(--muted, #767571); font-size: .82rem; white-space: nowrap; }
.tbl__dash { color: #ccc; }
.status-pill { display: inline-flex; align-items: center; gap: .35rem; padding: .2rem .6rem; border-radius: 8px; font-weight: 700; font-size: .8rem; }
.status-pill--published { background: #ecfdf5; color: #065f46; }
.status-pill--draft     { background: #fef3c7; color: #92400e; }
.status-pill__dot { width: 7px; height: 7px; border-radius: 50%; }
.status-pill--published .status-pill__dot { background: #10b981; }
.status-pill--draft .status-pill__dot { background: #f59e0b; }
.tbl__acts { display: flex; gap: .35rem; }
.act { width: 32px; height: 32px; border-radius: 8px; border: 1px solid var(--border, #E0DFDC); background: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all .15s; color: var(--muted, #767571); text-decoration: none; }
.act:hover { transform: translateY(-1px); }
.act--view:hover { border-color: #3b82f6; color: #3b82f6; background: #eff6ff; }
.act--edit:hover { border-color: #8C1515; color: #8C1515; background: #faf0f0; }
.act--del:hover  { border-color: #dc2626; color: #dc2626; background: #fef2f2; }
.btn { display: inline-flex; align-items: center; justify-content: center; gap: .4rem; text-decoration: none; border-radius: 12px; padding: .75rem 1rem; font-weight: 900; border: 1px solid transparent; transition: .18s ease; white-space: nowrap; cursor: pointer; font: inherit; }
.btn:hover { transform: translateY(-1px); }
.btn--primary { background: #8C1515; color: #fff; box-shadow: 0 10px 24px rgba(140,21,21,.18); }
.btn--ghost   { background: #fff; color: #6E6B66; border-color: #E0DFDC; }
.btn--danger  { background: #dc2626; color: #fff; }
.btn--sm      { padding: .55rem .85rem; font-size: .88rem; }
.overlay { position: fixed; inset: 0; z-index: 10000; background: rgba(0,0,0,.45); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; }
.del-modal { background: #fff; border-radius: 20px; padding: 2rem; max-width: 400px; width: 90%; text-align: center; box-shadow: 0 24px 64px rgba(0,0,0,.15); }
.del-modal__ico { width: 64px; height: 64px; border-radius: 50%; background: #fef2f2; border: 2px solid #fecaca; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; }
.del-modal__title { font-weight: 900; color: var(--text, #2E2D29); margin: 0 0 .5rem; }
.del-modal__body  { color: var(--muted, #767571); line-height: 1.7; margin: 0 0 1.2rem; }
.del-modal__acts  { display: flex; gap: .6rem; justify-content: center; }
.modal-enter-active, .modal-leave-active { transition: all .3s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-from .del-modal, .modal-leave-to .del-modal { transform: scale(.92); }
.pdm-overlay { position: fixed; inset: 0; z-index: 10000; background: rgba(0,0,0,.5); backdrop-filter: blur(6px); display: flex; align-items: center; justify-content: center; padding: 1.5rem; }
.pdm { background: #fff; border-radius: 22px; max-width: 620px; width: 100%; max-height: 88vh; overflow-y: auto; position: relative; box-shadow: 0 32px 80px rgba(0,0,0,.2); }
.pdm-x { position: absolute; top: 1rem; left: 1rem; width: 36px; height: 36px; border-radius: 10px; background: rgba(240,238,235,.9); backdrop-filter: blur(4px); border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--muted, #767571); transition: all .15s; z-index: 2; }
.pdm-x:hover { background: #e8e5e1; }
.pdm-content { padding: 1.5rem 2rem 2rem; }
.pdm-info__head { margin-bottom: 1.25rem; }
.pdm-info__head-meta { display: flex; gap: .5rem; align-items: center; flex-wrap: wrap; margin-bottom: .5rem; }
.pdm-id-tag { font-weight: 700; color: var(--muted, #767571); font-size: .8rem; background: #f0eeeb; padding: .15rem .5rem; border-radius: 6px; }
.pdm-status-badge { display: inline-flex; align-items: center; gap: .3rem; padding: .2rem .6rem; border-radius: 8px; font-weight: 700; font-size: .8rem; }
.pdm-status-badge--published { background: #ecfdf5; color: #065f46; }
.pdm-status-badge--draft     { background: #fef3c7; color: #92400e; }
.pdm-status-badge__dot { width: 7px; height: 7px; border-radius: 50%; }
.pdm-status-badge--published .pdm-status-badge__dot { background: #10b981; }
.pdm-status-badge--draft .pdm-status-badge__dot     { background: #f59e0b; }
.pdm-lang-tabs { display: flex; gap: .3rem; margin-bottom: 1rem; }
.pdm-lang-tab { display: inline-flex; align-items: center; gap: .4rem; padding: .4rem .85rem; border-radius: 9px; border: 1.5px solid var(--border, #E0DFDC); background: #FAFAF9; font-weight: 800; font-size: .83rem; color: var(--muted, #767571); cursor: pointer; transition: all .18s; font: inherit; }
.pdm-lang-tab--active { background: #fff; border-color: #2E2D29; color: var(--text, #2E2D29); box-shadow: 0 2px 8px rgba(0,0,0,.06); }
.pdm-lang-tab__check { color: #10b981; }
.pdm-title    { font-weight: 900; font-size: 1.35rem; color: var(--text, #2E2D29); margin: 0 0 .3rem; }
.pdm-subtitle { color: var(--muted, #767571); margin: 0 0 .5rem; font-weight: 600; }
.pdm-edit-btn { display: inline-flex; align-items: center; gap: .4rem; text-decoration: none; font-weight: 800; font-size: .88rem; color: #8C1515; margin-top: .6rem; padding: .5rem .9rem; border-radius: 10px; background: #faf0f0; transition: all .15s; }
.pdm-edit-btn:hover { background: #f5e0e0; }
.pdm-dates { margin-top: 1.2rem; padding-top: .8rem; border-top: 1px solid #f0eeeb; display: flex; flex-direction: column; gap: .3rem; font-size: .82rem; color: var(--muted, #767571); }
.pdm-fade-enter-active, .pdm-fade-leave-active { transition: opacity .3s ease; }
.pdm-fade-enter-from, .pdm-fade-leave-to { opacity: 0; }
.pdm-rise-enter-active { transition: all .35s cubic-bezier(.16,1,.3,1); }
.pdm-rise-leave-active { transition: all .25s ease; }
.pdm-rise-enter-from { opacity: 0; transform: translateY(24px) scale(.96); }
.pdm-rise-leave-to   { opacity: 0; transform: translateY(12px) scale(.98); }
.fade-enter-active, .fade-leave-active { transition: opacity .2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.spinner { width: 16px; height: 16px; border-radius: 50%; border: 2px solid rgba(255,255,255,.3); border-top-color: #fff; animation: spin .7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>