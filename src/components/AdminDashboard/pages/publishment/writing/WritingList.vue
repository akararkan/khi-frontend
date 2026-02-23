<template>
  <div class="wlist" dir="rtl">

    <!-- ── HEADER ── -->
    <div class="wlist__head">
      <div class="wlist__head-text">
        <div class="wlist__title-row">
          <div class="wlist__title-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
            </svg>
          </div>
          <h1 class="wlist__title">نووسراوەکان</h1>
          <span class="wlist__title-en">Books</span>
        </div>
        <p class="wlist__sub">بینین، گەڕان و بەڕێوەبردنی هەموو کتێب و نووسراوەکان</p>
      </div>
      <RouterLink class="btn btn--primary" to="/admin/writings/new">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        کتێبی نوێ
      </RouterLink>
    </div>

    <!-- ── SEARCH + FILTERS ── -->
    <div class="wlist__bar">
      <div class="search">
        <svg class="search__ico" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
        </svg>
        <input v-model="searchQ" class="search__input" placeholder="گەڕان بە ناونیشان، نووسەر، تاگ، کیووەرد…" @input="onSearch" />
        <Transition name="fade">
          <button v-if="searchQ" class="search__clear" @click="clearSearch">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </Transition>
      </div>

      <div class="filter-group">
        <select v-model="filterTopic" class="sel">
          <option value="">هەموو بابەتەکان</option>
          <option value="RELIGIOUS">مەذھەبی</option>
          <option value="HISTORICAL">مێژووی</option>
          <option value="FOLKLORE">فۆڵکلۆر</option>
          <option value="POLITICAL">سیاسی</option>
          <option value="POETRY">شیعر</option>
          <option value="SCIENTIFIC">تێبینی</option>
          <option value="EDUCATIONAL">فێرخوازی</option>
          <option value="OTHER">یتر</option>
        </select>

        <select v-model="filterLang" class="sel">
          <option value="">هەموو زمانەکان</option>
          <option value="CKB">سۆرانی</option>
          <option value="KMR">کورمانجی</option>
        </select>

        <select v-model="filterInstitute" class="sel">
          <option value="">هەموو</option>
          <option value="yes">بڕیاری ناوەند</option>
          <option value="no">دەرەکی</option>
        </select>
      </div>
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
      <div class="skel" v-for="i in 6" :key="i" :style="{ animationDelay: `${i * 0.06}s` }"></div>
    </div>

    <!-- ── ERROR ── -->
    <div v-else-if="error" class="state-box state-box--error">
      <div class="state-box__ico">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      </div>
      <p>{{ error }}</p>
      <button class="btn btn--ghost btn--sm" @click="load">دووبارەتەکەیەوە</button>
    </div>

    <!-- ── EMPTY ── -->
    <div v-else-if="!filteredItems.length" class="state-box">
      <div class="state-box__ico">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
        </svg>
      </div>
      <p>هیچ کتێبێک نەدۆزرایەوە</p>
      <RouterLink class="btn btn--primary btn--sm" to="/admin/writings/new">یەکەمین کتێب زیاد بکە</RouterLink>
    </div>

    <!-- ── TABLE ── -->
    <div v-else class="table-wrap">
      <div class="table-meta">
        <span class="table-meta__count">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
          </svg>
          {{ filteredItems.length }} کتێب
        </span>
        <span v-if="searchQ" class="table-meta__query">ئەنجامی «{{ searchQ }}»</span>
      </div>

      <table class="tbl">
        <thead>
          <tr>
            <th class="th--id">#</th>
            <th class="th--cover">کڤەر</th>
            <th>ناونیشانی سۆرانی</th>
            <th>ناونیشانی کورمانجی</th>
            <th class="th--writer">نووسەر</th>
            <th class="th--topic">بابەت</th>
            <th class="th--lang">زمان</th>
            <th class="th--series">سەری</th>
            <th class="th--acts">کردار</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(w, idx) in filteredItems"
            :key="w.id"
            class="tbl__row"
            :style="{ animationDelay: `${idx * 0.03}s` }"
            @click="openDetail(w)"
          >
            <!-- ID -->
            <td><span class="tbl__id">#{{ w.id }}</span></td>

            <!-- Cover -->
            <td>
              <div class="cover-wrap" v-if="getCoverUrl(w)">
                <img class="cover-img" :src="getCoverUrl(w)" loading="lazy" />
                <div class="cover-shine"></div>
              </div>
              <div class="cover-empty" v-else>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                </svg>
              </div>
            </td>

            <!-- CKB Title -->
            <td>
              <div class="tbl__name">{{ w.ckbContent?.title || '—' }}</div>
              <div class="tbl__genre" v-if="w.ckbContent?.genre">{{ w.ckbContent.genre }}</div>
            </td>

            <!-- KMR Title -->
            <td>
              <div class="tbl__name tbl__name--kmr">{{ w.kmrContent?.title || '—' }}</div>
              <div class="tbl__genre" v-if="w.kmrContent?.genre">{{ w.kmrContent.genre }}</div>
            </td>

            <!-- Writer -->
            <td>
              <div class="tbl__writer" v-if="getWriter(w)">
                <span class="writer-dot"></span>
                {{ getWriter(w) }}
              </div>
              <span v-else class="tbl__dash">—</span>
            </td>

            <!-- Topic -->
            <td>
              <span class="topic-pill" :style="topicStyle(w.writingTopic)">
                <span class="topic-dot" :style="{ background: topicDotColor(w.writingTopic) }"></span>
                {{ topicLabel(w.writingTopic) }}
              </span>
            </td>

            <!-- Languages -->
            <td>
              <div class="lang-row">
                <span v-for="l in (w.contentLanguages||[])" :key="l" class="lang-chip" :class="`lang-chip--${l.toLowerCase()}`">
                  {{ l === 'CKB' ? 'سۆر' : 'کور' }}
                </span>
              </div>
            </td>

            <!-- Series -->
            <td>
              <div class="series-info" v-if="w.seriesInfo">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                <span>{{ w.seriesInfo.seriesOrder }}</span>
              </div>
              <span v-else class="tbl__dash">—</span>
            </td>

            <!-- Actions -->
            <td @click.stop>
              <div class="tbl__acts">
                <button class="act act--view" title="تەواوی زانیاری" @click="openDetail(w)">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                  </svg>
                </button>
                <RouterLink class="act act--edit" :to="`/admin/writings/${w.id}/edit`">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4z"/>
                  </svg>
                </RouterLink>
                <button class="act act--del" @click="confirmDelete(w)">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                    <path d="M10 11v6M14 11v6"/>
                  </svg>
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
        <div v-if="delTarget" class="overlay" @click.self="delTarget=null">
          <div class="del-modal">
            <div class="del-modal__ico">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8C1515" stroke-width="2">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                <path d="M10 11v6M14 11v6"/>
              </svg>
            </div>
            <h3 class="del-modal__title">دڵنیای لە سڕینەوە؟</h3>
            <p class="del-modal__body">
              کتێبی <strong>«{{ bestTitle(delTarget) || '#'+delTarget.id }}»</strong><br/>
              <span v-if="delTarget.seriesInfo" class="del-warning">
                ⚠️ ئەم کتێبە بەشێکە لە سەری. سڕینەوەکە دەتوانێت ئامار سەری کاریگەر بکات.
              </span>
              <span v-else>بە تەواوی سڕاوەتەوە و ناگەڕێتەوە.</span>
            </p>
            <div class="del-modal__acts">
              <button class="btn btn--ghost" @click="delTarget=null">نەخێر</button>
              <button class="btn btn--danger" :disabled="deleting" @click="doDelete">
                <span v-if="deleting" class="spinner"></span>{{ deleting ? '…' : 'بەڵێ، بیسڕەوە' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ══ DETAIL MODAL ══ -->
    <Teleport to="body">
      <Transition name="pdm-fade">
        <div v-if="detail" class="pdm-overlay" @click.self="closeDetail">
          <Transition name="pdm-rise" appear>
            <div v-if="detail" class="pdm" role="dialog">

              <button class="pdm-x" @click="closeDetail" aria-label="داخستن">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>

              <!-- ════ LEFT — BOOK VISUAL ════ -->
              <div class="pdm-media">

                <!-- Book cover display -->
                <div class="book-stage" v-if="getCoverUrl(detail)">
                  <div class="book-stage__bg">
                    <img :src="getCoverUrl(detail)" class="book-stage__blur-bg" />
                    <div class="book-stage__bg-overlay"></div>
                  </div>
                  <div class="book-stage__content">
                    <div class="book-3d">
                      <div class="book-3d__cover">
                        <img :src="getCoverUrl(detail)" alt="cover" />
                      </div>
                      <div class="book-3d__spine"></div>
                    </div>
                    <!-- File download button -->
                    <div class="book-stage__actions" v-if="activeContent(detail)?.fileUrl">
                      <a :href="activeContent(detail).fileUrl" target="_blank" class="download-btn">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                        </svg>
                        داگرتنی کتێب
                      </a>
                    </div>
                  </div>
                </div>

                <!-- No cover empty state -->
                <div class="book-empty" v-else>
                  <div class="book-empty__icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.9">
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                    </svg>
                  </div>
                  <span>کڤەری کتێب نییە</span>
                  <div class="book-stage__actions" v-if="activeContent(detail)?.fileUrl">
                    <a :href="activeContent(detail).fileUrl" target="_blank" class="download-btn">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                      </svg>
                      داگرتنی کتێب
                    </a>
                  </div>
                </div>

                <!-- Quick stats bar at bottom -->
                <div class="book-stats-bar">
                  <div class="book-stat" v-if="activeContent(detail)?.pageCount">
                    <span class="book-stat__k">پەڕە</span>
                    <span class="book-stat__v">{{ activeContent(detail).pageCount }}</span>
                  </div>
                  <div class="book-stat" v-if="activeContent(detail)?.fileSizeBytes">
                    <span class="book-stat__k">قەبارە</span>
                    <span class="book-stat__v">{{ fmtBytes(activeContent(detail).fileSizeBytes) }}</span>
                  </div>
                  <div class="book-stat" v-if="activeContent(detail)?.fileFormat">
                    <span class="book-stat__k">فۆرمات</span>
                    <span class="book-stat__v">{{ activeContent(detail).fileFormat }}</span>
                  </div>
                  <div class="book-stat" v-if="(detail.contentLanguages||[]).length">
                    <span class="book-stat__k">زمان</span>
                    <span class="book-stat__v">{{ (detail.contentLanguages||[]).length }}</span>
                  </div>
                </div>

              </div>

              <!-- ════ RIGHT — INFO ════ -->
              <div class="pdm-info">
                <!-- Header -->
                <div class="pdm-info__head">
                  <div class="pdm-info__head-meta">
                    <span class="pdm-id-tag">#{{ detail.id }}</span>
                    <span class="topic-pill-sm" :style="topicStyle(detail.writingTopic)">
                      <span class="topic-dot" :style="{ background: topicDotColor(detail.writingTopic) }"></span>
                      {{ topicLabel(detail.writingTopic) }}
                    </span>
                    <span class="inst-badge" v-if="detail.publishedByInstitute">🏛 ناوەند</span>
                  </div>

                  <h2 class="pdm-title">{{ bestTitle(detail) || '—' }}</h2>
                  <p class="pdm-subtitle" v-if="altTitle(detail)">{{ altTitle(detail) }}</p>

                  <div class="pdm-langs">
                    <span v-for="l in (detail.contentLanguages||[])" :key="l" class="pdm-lang" :class="`pdm-lang--${l.toLowerCase()}`">
                      <span class="pdm-lang__dot" :class="`pdm-lang__dot--${l.toLowerCase()}`"></span>
                      {{ l === 'CKB' ? 'سۆرانی' : 'کورمانجی' }}
                    </span>
                  </div>

                  <RouterLink class="pdm-edit-btn" :to="`/admin/writings/${detail.id}/edit`" @click="closeDetail">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4z"/>
                    </svg>
                    دەستکاری کتێب
                  </RouterLink>
                </div>

                <!-- Language Tabs -->
                <div class="pdm-tabs" v-if="(detail.contentLanguages||[]).length > 1">
                  <button v-for="l in (detail.contentLanguages||[])" :key="l"
                    class="pdm-tab" :class="{ 'pdm-tab--on': detailLang === l }"
                    @click="detailLang = l">
                    <span class="pdm-tab__pip" :class="`pdm-tab__pip--${l.toLowerCase()}`"></span>
                    {{ l === 'CKB' ? 'سۆرانی' : 'کورمانجی' }}
                  </button>
                </div>

                <!-- Body accordions -->
                <div class="pdm-info__body">

                  <!-- Writer & Genre -->
                  <div class="acc" v-if="activeContent(detail)?.writer || activeContent(detail)?.genre">
                    <button class="acc__hd" @click="toggleAcc('writer')">
                      <span class="acc__hd-left">
                        <span class="acc__ico acc__ico--writer">✍️</span>
                        <span class="acc__title">نووسەر و جۆر</span>
                      </span>
                      <svg class="acc__chevron" :class="{'acc__chevron--open':openAcc.has('writer')}" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M6 9l6 6 6-6"/></svg>
                    </button>
                    <Transition name="acc-body">
                      <div v-if="openAcc.has('writer')" class="acc__body">
                        <div class="acc__kv-grid">
                          <div class="acc__kv" v-if="activeContent(detail).writer">
                            <span class="acc__k">نووسەر</span>
                            <span class="acc__v acc__v--writer">{{ activeContent(detail).writer }}</span>
                          </div>
                          <div class="acc__kv" v-if="activeContent(detail).genre">
                            <span class="acc__k">جۆر</span>
                            <span class="acc__v">{{ activeContent(detail).genre }}</span>
                          </div>
                        </div>
                      </div>
                    </Transition>
                  </div>

                  <!-- Description -->
                  <div class="acc" v-if="activeContent(detail)?.description">
                    <button class="acc__hd" @click="toggleAcc('desc')">
                      <span class="acc__hd-left">
                        <span class="acc__ico acc__ico--desc">📝</span>
                        <span class="acc__title">کورتە</span>
                      </span>
                      <svg class="acc__chevron" :class="{'acc__chevron--open':openAcc.has('desc')}" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M6 9l6 6 6-6"/></svg>
                    </button>
                    <Transition name="acc-body">
                      <div v-if="openAcc.has('desc')" class="acc__body">
                        <p class="acc__desc-text">{{ activeContent(detail).description }}</p>
                      </div>
                    </Transition>
                  </div>

                  <!-- Tags -->
                  <div class="acc" v-if="activeTags(detail).length">
                    <button class="acc__hd" @click="toggleAcc('tags')">
                      <span class="acc__hd-left">
                        <span class="acc__ico acc__ico--tag">🏷️</span>
                        <span class="acc__title">تاگەکان</span>
                        <span class="acc__badge acc__badge--tag">{{ activeTags(detail).length }}</span>
                      </span>
                      <svg class="acc__chevron" :class="{'acc__chevron--open':openAcc.has('tags')}" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M6 9l6 6 6-6"/></svg>
                    </button>
                    <Transition name="acc-body">
                      <div v-if="openAcc.has('tags')" class="acc__body">
                        <div class="acc__chips">
                          <span v-for="t in activeTags(detail)" :key="t" class="chip chip--tag">{{ t }}</span>
                        </div>
                      </div>
                    </Transition>
                  </div>

                  <!-- Keywords -->
                  <div class="acc" v-if="activeKeywords(detail).length">
                    <button class="acc__hd" @click="toggleAcc('kw')">
                      <span class="acc__hd-left">
                        <span class="acc__ico acc__ico--kw">🔍</span>
                        <span class="acc__title">کیووەردەکان</span>
                        <span class="acc__badge acc__badge--kw">{{ activeKeywords(detail).length }}</span>
                      </span>
                      <svg class="acc__chevron" :class="{'acc__chevron--open':openAcc.has('kw')}" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M6 9l6 6 6-6"/></svg>
                    </button>
                    <Transition name="acc-body">
                      <div v-if="openAcc.has('kw')" class="acc__body">
                        <div class="acc__chips">
                          <span v-for="k in activeKeywords(detail)" :key="k" class="chip chip--kw">{{ k }}</span>
                        </div>
                      </div>
                    </Transition>
                  </div>

                  <!-- Series -->
                  <div class="acc" v-if="detail.seriesInfo">
                    <button class="acc__hd" @click="toggleAcc('series')">
                      <span class="acc__hd-left">
                        <span class="acc__ico acc__ico--series">⭐</span>
                        <span class="acc__title">سەری کتێب</span>
                      </span>
                      <svg class="acc__chevron" :class="{'acc__chevron--open':openAcc.has('series')}" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M6 9l6 6 6-6"/></svg>
                    </button>
                    <Transition name="acc-body">
                      <div v-if="openAcc.has('series')" class="acc__body">
                        <div class="series-card">
                          <div class="series-card__name">{{ detail.seriesInfo.seriesName || '—' }}</div>
                          <div class="series-card__meta">
                            <span class="series-order-badge">سەری {{ detail.seriesInfo.seriesOrder }}</span>
                            <span class="series-count-badge">{{ detail.seriesInfo.totalBooks }} کتێب</span>
                          </div>
                        </div>
                      </div>
                    </Transition>
                  </div>

                  <!-- System Info -->
                  <div class="acc acc--system">
                    <button class="acc__hd" @click="toggleAcc('sys')">
                      <span class="acc__hd-left">
                        <span class="acc__ico acc__ico--sys">⚙️</span>
                        <span class="acc__title">زانیاری سیستەم</span>
                      </span>
                      <svg class="acc__chevron" :class="{'acc__chevron--open':openAcc.has('sys')}" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M6 9l6 6 6-6"/></svg>
                    </button>
                    <Transition name="acc-body">
                      <div v-if="openAcc.has('sys')" class="acc__body acc__body--flush">
                        <div class="acc__sys-grid">
                          <div class="acc__sys-cell" v-if="detail.createdAt">
                            <div class="acc__sys-k">دروستکراوە</div>
                            <div class="acc__sys-v">{{ fmtDatetime(detail.createdAt) }}</div>
                          </div>
                          <div class="acc__sys-cell" v-if="detail.updatedAt">
                            <div class="acc__sys-k">نوێکراوەتەوە</div>
                            <div class="acc__sys-v">{{ fmtDatetime(detail.updatedAt) }}</div>
                          </div>
                          <div class="acc__sys-cell acc__sys-cell--full">
                            <div class="acc__sys-k">ID</div>
                            <div class="acc__sys-v acc__sys-v--mono">{{ detail.id }}</div>
                          </div>
                        </div>
                      </div>
                    </Transition>
                  </div>

                </div><!-- /body -->
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

const items            = ref([])
const loading          = ref(false)
const error            = ref('')
const searchQ          = ref('')
const filterTopic      = ref('')
const filterLang       = ref('')
const filterInstitute  = ref('')
const delTarget        = ref(null)
const deleting         = ref(false)
const toast            = ref({ show: false, type: 'success', msg: '' })
const detail           = ref(null)
const detailLang       = ref('CKB')
const detailOverlayEl  = ref(null)
const openAcc          = ref(new Set(['writer', 'desc']))
let searchTimer        = null
let toastTimer         = null

/* ── helpers ── */
const ensureArray = (v) => Array.isArray(v) ? v : []
const cleanStr = (v) => (typeof v === 'string' ? v.trim() : '')
const safeLower = (v) => String(v ?? '').toLowerCase()

const normalizeWriting = (w = {}) => {
  const out = { ...w }

  // content fallback shapes
  if (!out.ckbContent && out.content?.ckb) out.ckbContent = out.content.ckb
  if (!out.kmrContent && out.content?.kmr) out.kmrContent = out.content.kmr

  // tags / keywords fallback shapes
  out.tags = out.tags || {}
  out.tags.ckb = ensureArray(out.tags?.ckb || out.tagsCkb)
  out.tags.kmr = ensureArray(out.tags?.kmr || out.tagsKmr)

  out.keywords = out.keywords || {}
  out.keywords.ckb = ensureArray(out.keywords?.ckb || out.keywordsCkb)
  out.keywords.kmr = ensureArray(out.keywords?.kmr || out.keywordsKmr)

  // content languages inference
  if (!ensureArray(out.contentLanguages).length) {
    const langs = []
    if (out.ckbContent?.title || out.ckbContent?.description || out.ckbContent?.writer) langs.push('CKB')
    if (out.kmrContent?.title || out.kmrContent?.description || out.kmrContent?.writer) langs.push('KMR')
    out.contentLanguages = langs
  }

  // normalize booleans / alt field names
  if (typeof out.publishedByInstitute === 'undefined') {
    out.publishedByInstitute = !!(out.isPublishedByInstitute ?? out.institutePublished ?? false)
  } else {
    out.publishedByInstitute = !!out.publishedByInstitute
  }

  // normalize file/link-ish metadata if backend names differ (optional, harmless)
  out.fileUrl     = cleanStr(out.fileUrl || out.url || out.documentUrl || '')
  out.externalUrl = cleanStr(out.externalUrl || out.link || '')
  out.embedUrl    = cleanStr(out.embedUrl || out.embed || '')
  out.coverUrl    = cleanStr(out.coverUrl || out.ckbContent?.coverUrl || out.kmrContent?.coverUrl || '')

  return out
}

/* ── filtered list ── */
const filteredItems = computed(() => {
  let list = ensureArray(items.value)

  if (searchQ.value.trim()) {
    const q = searchQ.value.trim().toLowerCase()

    list = list.filter(w => {
      const t1   = safeLower(w.ckbContent?.title)
      const t2   = safeLower(w.kmrContent?.title)
      const wr1  = safeLower(w.ckbContent?.writer)
      const wr2  = safeLower(w.kmrContent?.writer)
      const d1   = safeLower(w.ckbContent?.description)
      const d2   = safeLower(w.kmrContent?.description)
      const tags = [...ensureArray(w.tags?.ckb), ...ensureArray(w.tags?.kmr)].join(' ').toLowerCase()
      const kws  = [...ensureArray(w.keywords?.ckb), ...ensureArray(w.keywords?.kmr)].join(' ').toLowerCase()
      const tp   = safeLower(w.writingTopic)
      const yr   = safeLower(w.yearOfPublishment)

      return (
        t1.includes(q) || t2.includes(q) ||
        wr1.includes(q) || wr2.includes(q) ||
        d1.includes(q) || d2.includes(q) ||
        tags.includes(q) || kws.includes(q) ||
        tp.includes(q) || yr.includes(q)
      )
    })
  }

  if (filterTopic.value) {
    list = list.filter(w => w.writingTopic === filterTopic.value)
  }

  if (filterLang.value) {
    list = list.filter(w => ensureArray(w.contentLanguages).includes(filterLang.value))
  }

  if (filterInstitute.value === 'yes') {
    list = list.filter(w => !!w.publishedByInstitute)
  } else if (filterInstitute.value === 'no') {
    list = list.filter(w => !w.publishedByInstitute)
  }

  return list
})

/* ── API ── */
const load = async () => {
  loading.value = true
  error.value = ''
  try {
    const { data } = await api.get('/api/v1/writings')
    const payload = data?.data ?? data ?? []

    if (Array.isArray(payload)) {
      items.value = payload.map(normalizeWriting)
    } else if (Array.isArray(payload?.content)) {
      items.value = payload.content.map(normalizeWriting)
    } else if (Array.isArray(payload?.data?.content)) {
      items.value = payload.data.content.map(normalizeWriting)
    } else {
      items.value = []
    }
  } catch (e) {
    error.value = e?.response?.data?.message || e.message || 'هەڵەیەک ڕوویدا'
  } finally {
    loading.value = false
  }
}

/* ── UI actions ── */
const onSearch = () => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    // client-side filtering only
  }, 250)
}

const clearSearch = () => { searchQ.value = '' }

const confirmDelete = (w) => { delTarget.value = w }

const doDelete = async () => {
  if (!delTarget.value) return
  deleting.value = true
  const deletingId = delTarget.value.id

  try {
    await api.delete(`/api/v1/writings/${deletingId}`)
    showToast('success', 'نووسینەکە بە سەرکەوتنی سڕایەوە')

    if (detail.value?.id === deletingId) closeDetail()

    delTarget.value = null
    await load()
  } catch (e) {
    showToast('error', e?.response?.data?.message || 'سڕینەوە سەرنەکەوت')
  } finally {
    deleting.value = false
  }
}

/* ── Detail modal ── */
const onGlobalKeydown = (e) => {
  if (e.key === 'Escape' && detail.value) closeDetail()
}

const openDetail = async (w) => {
  const item = normalizeWriting(w)
  detail.value = item

  detailLang.value = ensureArray(item.contentLanguages).includes('CKB')
    ? 'CKB'
    : (ensureArray(item.contentLanguages)[0] || 'CKB')

  openAcc.value = new Set(['writer', 'desc'])
  document.body.style.overflow = 'hidden'
  window.addEventListener('keydown', onGlobalKeydown)

  await nextTick()
  detailOverlayEl.value?.focus?.()
}

const closeDetail = () => {
  detail.value = null
  document.body.style.overflow = ''
  window.removeEventListener('keydown', onGlobalKeydown)
}

const toggleAcc = (key) => {
  const s = new Set(openAcc.value)
  s.has(key) ? s.delete(key) : s.add(key)
  openAcc.value = s
}

watch(detail, (v) => {
  if (!v) return
  // keep valid detailLang if content changes
  if (!ensureArray(v.contentLanguages).includes(detailLang.value)) {
    detailLang.value = ensureArray(v.contentLanguages).includes('CKB')
      ? 'CKB'
      : (ensureArray(v.contentLanguages)[0] || 'CKB')
  }
})

/* ── data helpers for template ── */
const getCoverUrl = (w) =>
  cleanStr(
    w?.ckbContent?.coverUrl ||
    w?.kmrContent?.coverUrl ||
    w?.coverUrl
  )

const getWriter = (w) =>
  cleanStr(
    w?.ckbContent?.writer ||
    w?.kmrContent?.writer
  )

const bestTitle = (w) =>
  cleanStr(
    w?.ckbContent?.title ||
    w?.kmrContent?.title ||
    w?.title
  )

const altTitle = (w) => {
  const ckb = cleanStr(w?.ckbContent?.title)
  const kmr = cleanStr(w?.kmrContent?.title)
  if (ckb && kmr && ckb !== kmr) return detailLang.value === 'CKB' ? kmr : ckb
  return ''
}

const activeContent = (w) =>
  detailLang.value === 'CKB'
    ? (w?.ckbContent || {})
    : (w?.kmrContent || {})

const activeTags = (w) =>
  detailLang.value === 'CKB'
    ? [...ensureArray(w?.tags?.ckb || w?.tagsCkb)]
    : [...ensureArray(w?.tags?.kmr || w?.tagsKmr)]

const activeKeywords = (w) =>
  detailLang.value === 'CKB'
    ? [...ensureArray(w?.keywords?.ckb || w?.keywordsCkb)]
    : [...ensureArray(w?.keywords?.kmr || w?.keywordsKmr)]

/* Optional helpers if your template shows source/download links */
const writingOpenUrl = (w) => cleanStr(w?.externalUrl || w?.fileUrl || w?.embedUrl || '')
const hasWritingSource = (w) => !!writingOpenUrl(w)

const topicLabel = (v) => ({
  RELIGIOUS:   'مەذھەبی',
  HISTORICAL:  'مێژووی',
  FOLKLORE:    'فۆڵکلۆر',
  POLITICAL:   'سیاسی',
  POETRY:      'شیعر',
  SCIENTIFIC:  'زانستی',
  EDUCATIONAL: 'فێرکاری',
  OTHER:       'یتر'
}[v] || v || '—')

const TOPIC_COLORS = {
  RELIGIOUS:   { bg: 'rgba(140,21,21,.11)',  color: '#8c1515', border: 'rgba(140,21,21,.22)', dot: '#c0392b' },
  HISTORICAL:  { bg: 'rgba(40,90,220,.11)',  color: '#1a47a0', border: 'rgba(40,90,220,.22)', dot: '#3b6fd4' },
  FOLKLORE:    { bg: 'rgba(100,150,40,.11)', color: '#4d6e1a', border: 'rgba(100,150,40,.22)', dot: '#7aad2a' },
  POLITICAL:   { bg: 'rgba(200,100,0,.11)',  color: '#804200', border: 'rgba(200,100,0,.22)', dot: '#d4720a' },
  POETRY:      { bg: 'rgba(150,40,150,.11)', color: '#6e1870', border: 'rgba(150,40,150,.22)', dot: '#a832aa' },
  SCIENTIFIC:  { bg: 'rgba(0,140,160,.11)',  color: '#005c6a', border: 'rgba(0,140,160,.22)', dot: '#008fa0' },
  EDUCATIONAL: { bg: 'rgba(20,120,80,.11)',  color: '#0a5c3c', border: 'rgba(20,120,80,.22)', dot: '#18a066' },
}

const topicStyle = (topic) => {
  const c = TOPIC_COLORS[topic]
  if (!c) {
    return {
      background: 'rgba(100,100,100,.1)',
      color: '#555',
      border: '1px solid rgba(100,100,100,.18)'
    }
  }
  return {
    background: c.bg,
    color: c.color,
    border: `1px solid ${c.border}`
  }
}

const topicDotColor = (topic) => TOPIC_COLORS[topic]?.dot || '#888'

const fmtBytes = (b) => {
  const n = Math.max(0, Number(b || 0))
  if (!n) return '0 B'
  const u = ['B', 'KB', 'MB', 'GB']
  let i = 0
  let v = n
  while (v >= 1024 && i < u.length - 1) { v /= 1024; i++ }
  return `${v.toFixed(v >= 10 || i === 0 ? 0 : 1)} ${u[i]}`
}

const fmtDatetime = (d) =>
  d
    ? new Date(d).toLocaleString('ar-IQ', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : '—'

const showToast = (type, msg) => {
  clearTimeout(toastTimer)
  toast.value = { show: true, type, msg }
  toastTimer = setTimeout(() => { toast.value.show = false }, 3500)
}

onMounted(load)

onBeforeUnmount(() => {
  clearTimeout(searchTimer)
  clearTimeout(toastTimer)
  document.body.style.overflow = ''
  window.removeEventListener('keydown', onGlobalKeydown)
})
</script>

<style scoped>
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   BASE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
.wlist { direction: rtl; max-width: 1440px; margin: 0 auto; }

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   HEADER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
.wlist__head {
  display: flex; align-items: flex-end; justify-content: space-between;
  margin-bottom: 1.75rem; gap: 1rem; flex-wrap: wrap;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--border);
}
.wlist__title-row {
  display: flex; align-items: center; gap: .75rem; margin-bottom: .35rem;
}
.wlist__title-icon {
  width: 38px; height: 38px; border-radius: 10px;
  background: linear-gradient(135deg, var(--crimson) 0%, #a61c1c 100%);
  display: flex; align-items: center; justify-content: center;
  color: #fff; box-shadow: 0 4px 14px rgba(140,21,21,.28);
  flex-shrink: 0;
}
.wlist__title { font-size: 1.55rem; font-weight: 800; color: var(--text); letter-spacing: -.02em; }
.wlist__title-en {
  font-size: .8rem; font-weight: 600; color: var(--muted);
  background: var(--cream-dk); border: 1px solid var(--border);
  padding: .2rem .6rem; border-radius: 20px; letter-spacing: .04em;
}
.wlist__sub { color: var(--muted); font-size: .83rem; }

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   BUTTONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
.btn {
  display: inline-flex; align-items: center; gap: .45rem;
  padding: .65rem 1.1rem; border-radius: var(--radius-sm);
  font-weight: 700; font-size: .87rem; cursor: pointer;
  border: 1px solid transparent; transition: var(--transition);
  text-decoration: none; white-space: nowrap; font-family: inherit;
}
.btn--primary {
  background: var(--crimson); color: #fff;
  box-shadow: 0 4px 16px rgba(140,21,21,.25);
}
.btn--primary:hover { background: #a61c1c; transform: translateY(-1px); box-shadow: 0 6px 22px rgba(140,21,21,.3); }
.btn--ghost { background: transparent; border-color: var(--border); color: var(--text); }
.btn--ghost:hover { border-color: var(--crimson); color: var(--crimson); }
.btn--danger { background: #c0392b; color: #fff; }
.btn--danger:hover { background: #a93226; }
.btn--sm { padding: .45rem .85rem; font-size: .82rem; }
.btn:disabled { opacity: .5; cursor: not-allowed; transform: none !important; }

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   SEARCH + FILTERS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
.wlist__bar {
  display: flex; gap: .65rem; margin-bottom: 1.25rem;
  flex-wrap: wrap; align-items: center;
}
.search { flex: 1; min-width: 260px; position: relative; display: flex; align-items: center; }
.search__ico { position: absolute; right: .9rem; color: var(--muted); pointer-events: none; }
.search__input {
  width: 100%; padding: .68rem 2.4rem .68rem 2.4rem;
  border: 1.5px solid var(--border); border-radius: var(--radius-sm);
  background: var(--white); color: var(--text); font-size: .88rem;
  outline: none; transition: var(--transition); font-family: inherit;
}
.search__input:focus { border-color: var(--crimson); box-shadow: 0 0 0 3px rgba(140,21,21,.09); }
.search__clear {
  position: absolute; left: .75rem;
  background: var(--cream-dk); border: 1px solid var(--border);
  border-radius: 50%; width: 20px; height: 20px;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; color: var(--muted); transition: var(--transition); padding: 0;
}
.search__clear:hover { background: var(--crimson); border-color: var(--crimson); color: #fff; }

.filter-group { display: flex; gap: .55rem; flex-wrap: wrap; }
.sel {
  padding: .65rem .85rem; border: 1.5px solid var(--border);
  border-radius: var(--radius-sm); background: var(--white); color: var(--text);
  font-size: .85rem; outline: none; cursor: pointer;
  transition: var(--transition); font-family: inherit;
}
.sel:focus { border-color: var(--crimson); }

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   TOAST
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
.toast {
  display: flex; align-items: center; gap: .6rem;
  padding: .75rem 1.1rem; border-radius: var(--radius-sm);
  font-weight: 600; font-size: .87rem; margin-bottom: 1rem;
}
.toast--success { background: rgba(22,120,70,.08); border: 1px solid rgba(22,120,70,.2); color: #166044; }
.toast--error   { background: rgba(140,21,21,.07); border: 1px solid rgba(140,21,21,.18); color: var(--crimson); }

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   SKELETONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
.skeletons { display: flex; flex-direction: column; gap: .5rem; }
.skel {
  height: 62px; border-radius: var(--radius-sm);
  background: linear-gradient(90deg, var(--cream-dk) 25%, #eae8e4 50%, var(--cream-dk) 75%);
  background-size: 200% 100%; animation: shimmer 1.4s ease infinite;
}
@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   STATE BOXES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
.state-box {
  display: flex; flex-direction: column; align-items: center;
  gap: .85rem; padding: 4rem 2rem; color: var(--muted);
  text-align: center; background: var(--white);
  border: 1.5px dashed var(--border); border-radius: var(--radius-md); font-size: .9rem;
}
.state-box--error { color: var(--crimson); }
.state-box__ico {
  width: 56px; height: 56px; border-radius: 50%;
  background: var(--cream-dk); border: 1px solid var(--border);
  display: flex; align-items: center; justify-content: center;
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   TABLE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
.table-wrap {
  background: var(--white); border: 1px solid var(--border);
  border-radius: var(--radius-md); overflow: hidden;
  box-shadow: 0 2px 12px rgba(0,0,0,.05);
}
.table-meta {
  display: flex; align-items: center; gap: .65rem;
  padding: .6rem 1rem; background: var(--cream-dk);
  border-bottom: 1px solid var(--border);
  font-size: .78rem; color: var(--muted);
}
.table-meta__count {
  display: flex; align-items: center; gap: .35rem;
  font-weight: 700; color: var(--text);
}
.table-meta__query {
  background: rgba(140,21,21,.08); color: var(--crimson);
  border: 1px solid rgba(140,21,21,.18); padding: .15rem .55rem;
  border-radius: 20px; font-size: .74rem; font-weight: 600;
}

.tbl { width: 100%; border-collapse: collapse; font-size: .86rem; }
.tbl thead tr { background: var(--cream-dk); border-bottom: 2px solid var(--border); }
.tbl th {
  padding: .85rem 1rem; text-align: right;
  font-weight: 700; color: var(--muted); font-size: .75rem;
  letter-spacing: .03em; text-transform: uppercase; white-space: nowrap;
}
.th--id     { width: 56px; }
.th--cover  { width: 68px; }
.th--writer { width: 130px; }
.th--topic  { width: 115px; }
.th--lang   { width: 90px; }
.th--series { width: 72px; }
.th--acts   { width: 108px; }

/* Row entrance animation */
@keyframes rowIn {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}
.tbl__row {
  border-bottom: 1px solid var(--cream-dk);
  cursor: pointer;
  transition: background .18s ease;
  animation: rowIn .35s ease both;
}
.tbl__row:hover { background: rgba(140,21,21,.025); }
.tbl__row:last-child { border-bottom: none; }
.tbl td { padding: .78rem 1rem; vertical-align: middle; }

.tbl__id { font-size: .76rem; color: var(--muted); font-weight: 600; font-variant-numeric: tabular-nums; }

/* Cover */
.cover-wrap {
  width: 48px; height: 62px; border-radius: 6px;
  overflow: hidden; border: 1px solid var(--border);
  position: relative; flex-shrink: 0;
  box-shadow: 2px 3px 10px rgba(0,0,0,.12);
}
.cover-img { width: 100%; height: 100%; object-fit: cover; display: block; }
.cover-shine {
  position: absolute; inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,.18) 0%, transparent 60%);
  pointer-events: none;
}
.cover-empty {
  width: 48px; height: 62px; border-radius: 6px;
  border: 1.5px dashed var(--border);
  display: flex; align-items: center; justify-content: center;
  color: var(--border); background: var(--cream-dk);
}

/* Name + genre */
.tbl__name { font-weight: 600; color: var(--text); line-height: 1.3; }
.tbl__name--kmr { font-weight: 500; color: var(--muted); }
.tbl__genre { font-size: .73rem; color: var(--muted); margin-top: .18rem; }

/* Writer */
.tbl__writer {
  display: flex; align-items: center; gap: .45rem;
  font-size: .84rem; color: var(--text); font-weight: 500;
}
.writer-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--crimson); opacity: .6; flex-shrink: 0;
}
.tbl__dash { color: var(--border); font-size: .85rem; }

/* Topic pill */
.topic-pill {
  display: inline-flex; align-items: center; gap: .38rem;
  padding: .25rem .7rem; border-radius: 20px;
  font-size: .72rem; font-weight: 700; white-space: nowrap;
}
.topic-dot {
  width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0;
}

/* Language chips */
.lang-chip {
  display: inline-flex; padding: .2rem .52rem; border-radius: 6px;
  font-size: .7rem; font-weight: 800; letter-spacing: .03em;
}
.lang-chip--ckb { background: rgba(254,221,0,.18); color: #756400; border: 1px solid rgba(254,221,0,.38); }
.lang-chip--kmr { background: rgba(30,90,200,.1); color: #1a47a0; border: 1px solid rgba(30,90,200,.2); }
.lang-row { display: flex; gap: .3rem; flex-wrap: wrap; }

/* Series */
.series-info {
  display: inline-flex; align-items: center; gap: .35rem;
  font-size: .78rem; color: #c8a800; font-weight: 700;
  background: rgba(200,168,0,.1); border: 1px solid rgba(200,168,0,.22);
  padding: .22rem .6rem; border-radius: 20px;
}

/* Action buttons */
.tbl__acts { display: flex; gap: .3rem; }
.act {
  width: 30px; height: 30px; border-radius: 8px;
  border: 1px solid var(--border); background: var(--cream);
  color: var(--muted); cursor: pointer; text-decoration: none;
  display: inline-flex; align-items: center; justify-content: center;
  transition: var(--transition);
}
.act--view:hover  { background: rgba(30,90,200,.08); border-color: rgba(30,90,200,.28); color: #1a47a0; }
.act--edit:hover  { background: rgba(30,150,80,.08); border-color: rgba(30,150,80,.28); color: #166044; }
.act--del:hover   { background: rgba(140,21,21,.08); border-color: rgba(140,21,21,.25); color: var(--crimson); }

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   DELETE MODAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
.overlay { position: fixed; inset: 0; z-index: 200; background: rgba(20,10,10,.5); display: flex; align-items: center; justify-content: center; padding: 1rem; }
.del-modal { background: var(--white); border-radius: var(--radius-lg); padding: 2rem; max-width: 400px; width: 100%; box-shadow: 0 30px 80px rgba(0,0,0,.25); text-align: center; }
.del-modal__ico   { width: 58px; height: 58px; border-radius: 50%; background: rgba(140,21,21,.07); border: 1px solid rgba(140,21,21,.14); display: flex; align-items: center; justify-content: center; margin: 0 auto .85rem; }
.del-modal__title { font-size: 1.1rem; font-weight: 700; margin-bottom: .45rem; }
.del-modal__body  { color: var(--muted); font-size: .88rem; line-height: 1.75; margin-bottom: 1.5rem; }
.del-warning      { display: block; margin-top: .5rem; color: var(--crimson); font-size: .8rem; font-weight: 600; }
.del-modal__acts  { display: flex; gap: .75rem; justify-content: center; }
.spinner { width: 12px; height: 12px; border: 2px solid rgba(255,255,255,.3); border-top-color: #fff; border-radius: 50%; animation: spin .65s linear infinite; }
@keyframes spin { to { transform: rotate(360deg) } }

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   DETAIL MODAL  — dark left panel + light right info
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
.pdm-overlay {
  position: fixed; inset: 0; z-index: 400;
  background: rgba(5,2,2,.82); backdrop-filter: blur(12px);
  display: flex; align-items: center; justify-content: center;
  padding: 1.5rem; overflow-y: auto;
}
.pdm {
  position: relative; width: 100%; max-width: 1060px;
  max-height: calc(100vh - 3rem);
  background: #0f0b0b; border-radius: 22px; overflow: hidden;
  display: grid; grid-template-columns: 340px 1fr;
  box-shadow: 0 0 0 1px rgba(255,255,255,.07), 0 40px 120px rgba(0,0,0,.7);
}
@media (max-width: 800px) { .pdm { grid-template-columns: 1fr; max-height: none; } }

.pdm-x {
  position: absolute; top: 1rem; left: 1rem; z-index: 50;
  width: 34px; height: 34px; border-radius: 50%;
  background: rgba(0,0,0,.55); border: 1px solid rgba(255,255,255,.14);
  color: rgba(255,255,255,.8); cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: all .22s ease; backdrop-filter: blur(6px);
}
.pdm-x:hover { background: rgba(140,21,21,.85); color: #fff; transform: rotate(90deg) scale(1.08); }

/* ── LEFT: Book Visual ── */
.pdm-media {
  display: flex; flex-direction: column;
  background: #0a0707; min-height: 460px;
  overflow: hidden; position: relative;
}

/* Book stage (with cover) */
.book-stage { flex: 1; display: flex; flex-direction: column; position: relative; overflow: hidden; }
.book-stage__bg { position: absolute; inset: 0; overflow: hidden; }
.book-stage__blur-bg { width: 100%; height: 100%; object-fit: cover; filter: blur(28px) saturate(1.4); opacity: .32; transform: scale(1.1); }
.book-stage__bg-overlay { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(10,7,7,.3) 0%, rgba(10,7,7,.75) 60%, rgba(10,7,7,.98) 100%); }
.book-stage__content { position: relative; z-index: 2; flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 2.5rem 1.5rem 1.5rem; gap: 1.4rem; }

/* 3D Book */
.book-3d { position: relative; filter: drop-shadow(0 16px 40px rgba(0,0,0,.65)); transition: transform .35s ease; }
.book-3d:hover { transform: translateY(-6px) rotate(-1.5deg); }
.book-3d__cover {
  width: 130px; height: 180px; border-radius: 3px 7px 7px 3px;
  overflow: hidden; position: relative;
  border-left: 4px solid rgba(0,0,0,.35);
}
.book-3d__cover img { width: 100%; height: 100%; object-fit: cover; display: block; }
.book-3d__spine {
  position: absolute; top: 0; right: -5px; bottom: 0; width: 5px;
  background: linear-gradient(180deg, rgba(255,255,255,.06) 0%, rgba(255,255,255,.01) 100%);
  border-radius: 0 2px 2px 0;
}

/* Book empty */
.book-empty {
  flex: 1; display: flex; flex-direction: column; align-items: center;
  justify-content: center; gap: .75rem; color: rgba(255,255,255,.2);
  font-size: .83rem; padding: 2rem;
}
.book-empty__icon {
  width: 88px; height: 88px; border-radius: 50%;
  background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.08);
  display: flex; align-items: center; justify-content: center;
}

/* Download button */
.book-stage__actions { width: 100%; }
.download-btn {
  display: flex; align-items: center; justify-content: center; gap: .5rem;
  width: 100%; padding: .65rem; border-radius: 12px;
  background: rgba(255,255,255,.09); border: 1px solid rgba(255,255,255,.14);
  color: rgba(255,255,255,.82); font-size: .82rem; font-weight: 600;
  text-decoration: none; transition: all .22s ease;
}
.download-btn:hover { background: rgba(140,21,21,.6); border-color: rgba(140,21,21,.8); transform: translateY(-1px); }

/* Book stats bar */
.book-stats-bar {
  display: flex; background: rgba(0,0,0,.45);
  border-top: 1px solid rgba(255,255,255,.07);
}
.book-stat {
  flex: 1; padding: .65rem .5rem; text-align: center;
  border-left: 1px solid rgba(255,255,255,.06);
}
.book-stat:first-child { border-left: none; }
.book-stat__k { font-size: .62rem; color: rgba(255,255,255,.3); text-transform: uppercase; letter-spacing: .05em; font-weight: 700; }
.book-stat__v { font-size: .84rem; color: rgba(255,255,255,.85); font-weight: 800; margin-top: .14rem; }

/* ── RIGHT: Info Panel ── */
.pdm-info {
  display: flex; flex-direction: column;
  background: #faf8f5;
  border-right: 1px solid rgba(0,0,0,.07);
  max-height: calc(100vh - 3rem); overflow: hidden;
}

.pdm-info__head {
  flex: 0 0 auto; padding: 1.6rem 1.4rem 1.1rem;
  background: #fff; border-bottom: 1px solid #ece7df;
}
.pdm-info__head-meta {
  display: flex; align-items: center; gap: .5rem;
  margin-bottom: .7rem; flex-wrap: wrap;
}
.pdm-id-tag { font-size: .7rem; font-weight: 700; color: #b0a898; letter-spacing: .06em; }

.topic-pill-sm {
  display: inline-flex; align-items: center; gap: .35rem;
  padding: .22rem .65rem; border-radius: 20px;
  font-size: .72rem; font-weight: 700;
}
.inst-badge {
  display: inline-flex; padding: .2rem .6rem; border-radius: 99px;
  font-size: .72rem; font-weight: 700;
  background: rgba(22,120,70,.1); color: #186040;
  border: 1px solid rgba(22,120,70,.22);
}

.pdm-title { font-size: 1.3rem; font-weight: 800; color: #1a1410; line-height: 1.25; letter-spacing: -.02em; margin: 0 0 .28rem; }
.pdm-subtitle { font-size: .86rem; color: #9a9286; font-weight: 500; margin: 0 0 .65rem; }

.pdm-langs { display: flex; align-items: center; gap: .4rem; flex-wrap: wrap; margin-bottom: .9rem; }
.pdm-lang {
  display: inline-flex; align-items: center; gap: .38rem;
  padding: .22rem .65rem; border-radius: 6px; font-size: .72rem; font-weight: 700;
}
.pdm-lang--ckb { background: rgba(254,221,0,.14); color: #7a6200; border: 1px solid rgba(254,221,0,.32); }
.pdm-lang--kmr { background: rgba(40,90,220,.08); color: #2848b0; border: 1px solid rgba(40,90,220,.18); }
.pdm-lang__dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
.pdm-lang__dot--ckb { background: #c8a800; }
.pdm-lang__dot--kmr { background: #4a7af0; }

.pdm-edit-btn {
  display: inline-flex; align-items: center; gap: .45rem;
  padding: .6rem 1.1rem; border-radius: 10px;
  background: linear-gradient(135deg, #8c1515 0%, #a61c1c 100%);
  color: #fff; border: none; font-size: .83rem; font-weight: 700;
  text-decoration: none; cursor: pointer; transition: all .2s ease;
  width: 100%; justify-content: center; font-family: inherit;
  box-shadow: 0 4px 14px rgba(140,21,21,.28);
}
.pdm-edit-btn:hover { background: linear-gradient(135deg, #a61c1c 0%, #8b1616 100%); transform: translateY(-1px); box-shadow: 0 6px 20px rgba(140,21,21,.38); }

/* Language tabs */
.pdm-tabs {
  flex: 0 0 auto; display: flex;
  background: #f0ece5; border-bottom: 1px solid #e4dfd7;
}
.pdm-tab {
  flex: 1; display: inline-flex; align-items: center; justify-content: center;
  gap: .4rem; padding: .65rem 1rem; border: none; background: none;
  color: #9a9286; font-weight: 700; font-size: .83rem;
  cursor: pointer; transition: all .2s; font-family: inherit;
  border-bottom: 2px solid transparent;
}
.pdm-tab--on { color: #8c1515; background: #faf8f5; border-bottom-color: #8c1515; }
.pdm-tab__pip    { width: 7px; height: 7px; border-radius: 50%; transition: all .2s; }
.pdm-tab__pip--ckb { background: #c8a800; }
.pdm-tab__pip--kmr { background: #4a7af0; }

/* Info body (scroll) */
.pdm-info__body {
  flex: 1; overflow-y: auto; display: flex; flex-direction: column;
  gap: 0; scroll-behavior: smooth; padding-bottom: 1.5rem;
}
.pdm-info__body::-webkit-scrollbar { width: 3px; }
.pdm-info__body::-webkit-scrollbar-thumb { background: #d4cec6; border-radius: 99px; }

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ACCORDIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
.acc { border-bottom: 1px solid #ede8e0; }
.acc:last-child { border-bottom: none; }
.acc__hd {
  width: 100%; display: flex; align-items: center; justify-content: space-between;
  padding: .9rem 1.3rem; background: none; border: none;
  cursor: pointer; font-family: inherit; transition: background .18s ease; gap: .5rem;
}
.acc__hd:hover { background: rgba(140,21,21,.025); }
.acc__hd-left { display: flex; align-items: center; gap: .65rem; flex: 1; min-width: 0; }
.acc__ico { font-size: 1rem; flex-shrink: 0; width: 28px; text-align: center; }
.acc__title { font-size: .9rem; font-weight: 700; color: #1e1812; letter-spacing: -.01em; }
.acc__badge {
  display: inline-flex; padding: .15rem .52rem; border-radius: 99px;
  font-size: .69rem; font-weight: 800; letter-spacing: .04em;
}
.acc__badge--tag { background: rgba(200,168,0,.12); color: #7a6200; border: 1px solid rgba(200,168,0,.22); }
.acc__badge--kw  { background: rgba(40,90,220,.09); color: #2848b0; border: 1px solid rgba(40,90,220,.16); }
.acc__chevron { color: #c8c0b4; flex-shrink: 0; transition: transform .28s cubic-bezier(.34,1.56,.64,1), color .18s; }
.acc__chevron--open { transform: rotate(180deg); color: #8c1515; }
.acc__hd:hover .acc__chevron { color: #8c1515; }

.acc__body { overflow: hidden; padding: .15rem 1.3rem 1.1rem; }
.acc__body--flush { padding: 0; }

.acc-body-enter-active { transition: all .3s cubic-bezier(.22,1,.36,1); }
.acc-body-leave-active { transition: all .2s ease; }
.acc-body-enter-from, .acc-body-leave-to { opacity: 0; transform: translateY(-5px); }

/* KV grid */
.acc__kv-grid { display: flex; flex-direction: column; gap: .65rem; }
.acc__kv { display: flex; align-items: baseline; gap: .75rem; }
.acc__k {
  flex: 0 0 auto; min-width: 68px;
  font-size: .72rem; font-weight: 700; color: #b8b0a4;
  text-transform: uppercase; letter-spacing: .04em;
}
.acc__v { font-size: .9rem; font-weight: 600; color: #2e2418; line-height: 1.4; }
.acc__v--writer {
  background: rgba(140,21,21,.07); color: #8c1515;
  padding: .18rem .65rem; border-radius: 20px;
  border: 1px solid rgba(140,21,21,.14); font-size: .84rem;
}

.acc__desc-text {
  font-size: .9rem; color: #2e2418; line-height: 1.85;
  white-space: pre-line; margin: 0;
  max-height: 240px; overflow-y: auto; scrollbar-width: thin;
}

/* Chips */
.acc__chips { display: flex; flex-wrap: wrap; gap: .4rem; }
.chip {
  display: inline-flex; padding: .32rem .78rem; border-radius: 8px;
  font-size: .8rem; font-weight: 600; cursor: default; transition: transform .15s ease;
}
.chip:hover { transform: translateY(-2px); }
.chip--tag { background: rgba(200,168,0,.11); color: #7a6200; border: 1px solid rgba(200,168,0,.22); }
.chip--kw  { background: rgba(40,90,220,.08); color: #2848b0; border: 1px solid rgba(40,90,220,.15); }

/* Series card */
.series-card {
  padding: .8rem 1rem; background: rgba(200,168,0,.06);
  border: 1px solid rgba(200,168,0,.2); border-radius: 12px;
}
.series-card__name { font-size: .95rem; font-weight: 800; color: #7a6200; margin-bottom: .55rem; }
.series-card__meta { display: flex; gap: .5rem; flex-wrap: wrap; }
.series-order-badge {
  display: inline-block; padding: .3rem .7rem;
  background: #8c1515; color: #fff; border-radius: 7px; font-size: .75rem; font-weight: 700;
}
.series-count-badge {
  display: inline-block; padding: .3rem .7rem;
  background: var(--border); color: var(--text); border-radius: 7px; font-size: .75rem; font-weight: 700;
}

/* System accordion */
.acc--system { background: #faf7f2; }
.acc__sys-grid { display: grid; grid-template-columns: 1fr 1fr; padding: 0 1.3rem .8rem; gap: 0; }
.acc__sys-cell { padding: .7rem .6rem .7rem 0; border-bottom: 1px solid #ede8e0; border-left: 1px solid #ede8e0; }
.acc__sys-cell:nth-child(odd) { border-left: none; padding-right: .6rem; }
.acc__sys-cell--full { grid-column: 1/-1; border-left: none; }
.acc__sys-cell:last-child { border-bottom: none; }
.acc__sys-k { font-size: .66rem; font-weight: 700; color: #c0b8ac; letter-spacing: .05em; text-transform: uppercase; margin-bottom: .22rem; }
.acc__sys-v { font-size: .82rem; color: #2e2418; font-weight: 600; }
.acc__sys-v--mono { font-family: 'Courier New', monospace; font-size: .78rem; }

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   TRANSITIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
.pdm-fade-enter-active, .pdm-fade-leave-active { transition: opacity .28s ease; }
.pdm-fade-enter-from,   .pdm-fade-leave-to     { opacity: 0; }
.pdm-rise-enter-active { transition: opacity .38s ease, transform .38s cubic-bezier(.22,1,.36,1); }
.pdm-rise-leave-active { transition: opacity .22s ease, transform .22s ease; }
.pdm-rise-enter-from   { opacity: 0; transform: scale(.94) translateY(20px); }
.pdm-rise-leave-to     { opacity: 0; transform: scale(.97) translateY(10px); }
.modal-enter-active, .modal-leave-active { transition: .24s ease; }
.modal-enter-from,   .modal-leave-to     { opacity: 0; }
.modal-enter-active > *, .modal-leave-active > * { transition: .24s ease; }
.modal-enter-from > *,   .modal-leave-to > *     { transform: scale(.95) translateY(8px); }
.fade-enter-active, .fade-leave-active { transition: opacity .15s; }
.fade-enter-from,   .fade-leave-to     { opacity: 0; }
.slide-down-enter-active, .slide-down-leave-active { transition: .28s ease; }
.slide-down-enter-from,   .slide-down-leave-to     { opacity: 0; transform: translateY(-8px); }

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   RESPONSIVE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
@media (max-width: 900px) {
  .tbl th:nth-child(4), .tbl td:nth-child(4) { display: none; }
  .tbl th:nth-child(8), .tbl td:nth-child(8) { display: none; }
}
@media (max-width: 640px) {
  .tbl th:nth-child(5), .tbl td:nth-child(5) { display: none; }
  .tbl th:nth-child(7), .tbl td:nth-child(7) { display: none; }
  .wlist__bar { flex-direction: column; }
  .filter-group { width: 100%; }
  .filter-group .sel { flex: 1; }
}
</style>