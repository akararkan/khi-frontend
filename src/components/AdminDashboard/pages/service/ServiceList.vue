<template>
	<div class="slist" dir="rtl">

		<div class="slist__head">
			<div>
				<h1 class="slist__title">خزمەتگوزارییەکان</h1>
				<p class="slist__sub">بینین، گەڕان و بەڕێوەبردنی خزمەتگوزارییەکان بە پێی داتای Service لە backend</p>
			</div>
			<RouterLink class="btn btn--primary" to="/admin/services/new">
				<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
					<line x1="12" y1="5" x2="12" y2="19"/>
					<line x1="5" y1="12" x2="19" y2="12"/>
				</svg>
				خزمەتگوزاریی نوێ
			</RouterLink>
		</div>



		<div class="slist__bar">
			<div class="search">
				<svg class="search__ico" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<circle cx="11" cy="11" r="8"/>
					<path d="M21 21l-4.35-4.35"/>
				</svg>
				<input v-model.trim="searchQ" class="search__input" placeholder="گەڕان بە ناونیشان، وەسف، جۆر، شوێن یا کۆمەڵە میدیا…" />
				<Transition name="fade">
					<button v-if="searchQ" class="search__clear" @click="searchQ = ''">
						<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
							<line x1="18" y1="6" x2="6" y2="18"/>
							<line x1="6" y1="6" x2="18" y2="18"/>
						</svg>
					</button>
				</Transition>
			</div>

			<select v-model="filterType" class="sel">
				<option value="">هەموو جۆرەکان</option>
				<option v-for="type in serviceTypes" :key="type" :value="type">{{ type }}</option>
			</select>

			<div class="lang-switcher">
				<button type="button" class="lang-btn" :class="{ 'lang-btn--active': listLang === 'CKB' }" @click="listLang = 'CKB'">
					<span class="lang-btn__dot lang-btn__dot--ckb"></span>سۆرانی
				</button>
				<button type="button" class="lang-btn" :class="{ 'lang-btn--active': listLang === 'KMR' }" @click="listLang = 'KMR'">
					<span class="lang-btn__dot lang-btn__dot--kmr"></span>کرمانجی
				</button>
			</div>
		</div>

		<Transition name="slide-down">
			<div v-if="toast.show" class="toast" :class="`toast--${toast.type}`">
				<span class="toast__ico">{{ toast.type === 'success' ? '✓' : '✕' }}</span>
				{{ toast.msg }}
			</div>
		</Transition>

		<div v-if="loading" class="skeletons">
			<div v-for="i in 4" :key="i" class="skel" :style="{ animationDelay: `${i * 0.07}s` }"></div>
		</div>

		<div v-else-if="error" class="state-box state-box--error">
			<div class="state-box__ico">
				<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
					<circle cx="12" cy="12" r="10"/>
					<line x1="12" y1="8" x2="12" y2="12"/>
					<line x1="12" y1="16" x2="12.01" y2="16"/>
				</svg>
			</div>
			<p>{{ error }}</p>
			<button class="btn btn--ghost btn--sm" @click="load">دووبارەتەکەیەوە</button>
		</div>

		<div v-else-if="!visibleItems.length" class="state-box">
			<div class="state-box__ico">
				<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
					<circle cx="12" cy="12" r="3"/>
					<path d="M19.4 15a1 1 0 00.2 1.1l.04.04a2 2 0 01-2.83 2.83l-.04-.04a1 1 0 00-1.1-.2 1 1 0 00-.6.92V21a2 2 0 01-4 0v-.06a1 1 0 00-.67-.94 1 1 0 00-1.1.2l-.04.04a2 2 0 01-2.83-2.83l.04-.04a1 1 0 00.2-1.1 1 1 0 00-.92-.6H3a2 2 0 010-4h.06a1 1 0 00.94-.67 1 1 0 00-.2-1.1l-.04-.04a2 2 0 012.83-2.83l.04.04a1 1 0 001.1.2H7.8a1 1 0 00.6-.92V3a2 2 0 014 0v.06a1 1 0 00.67.94 1 1 0 001.1-.2l.04-.04a2 2 0 012.83 2.83l-.04.04a1 1 0 00-.2 1.1v.07a1 1 0 00.92.6H21a2 2 0 010 4h-.06a1 1 0 00-.94.67 1 1 0 00.2 1.1z"/>
				</svg>
			</div>
			<p>هیچ خزمەتگوزارییەک نەدۆزرایەوە</p>
			<RouterLink class="btn btn--primary btn--sm" to="/admin/services/new">یەکەمین خزمەتگوزاری زیاد بکە</RouterLink>
		</div>

		<div v-else class="table-wrap">
			<div class="table-meta">
				کۆی {{ visibleItems.length }} خزمەتگوزاری
				<span v-if="searchQ"> — «{{ searchQ }}»</span>
				<span v-if="filterType"> — {{ filterType }}</span>
				<span class="table-meta__lang" :class="`table-meta__lang--${listLang.toLowerCase()}`">{{ listLang === 'CKB' ? 'سۆرانی' : 'کرمانجی' }}</span>
			</div>

			<table class="tbl">
				<thead>
					<tr>
						<th style="width:52px">#</th>
						<th style="width:68px">کڤەر</th>
						<th>ناونیشان</th>
						<th style="width:150px">جۆر</th>
						<th style="width:140px">شوێن</th>
						<th style="width:100px">کۆمەڵە</th>
						<th style="width:100px">فایل</th>
						<th style="width:132px">بڵاوکردنەوە</th>
						<th style="width:100px">دۆخ</th>
						<th style="width:148px">کردار</th>
					</tr>
				</thead>

				<tbody>
					<tr v-for="service in visibleItems" :key="service.id" class="tbl__row" @click="openDetail(service)">
						<td><span class="tbl__id">#{{ service.id }}</span></td>

						<td>
							<div class="cover-wrap" :class="{ 'cover-wrap--empty': !bestPreview(service) }">
								<img v-if="bestPreview(service) && isImageUrl(bestPreview(service))" class="cover-img" :src="bestPreview(service)" loading="lazy" />
								<video v-else-if="bestPreview(service) && isVideoUrl(bestPreview(service))" class="cover-video" :src="bestPreview(service)" muted playsinline></video>
								<svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
									<path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
									<polyline points="17 8 12 3 7 8"/>
									<line x1="12" y1="3" x2="12" y2="15"/>
								</svg>
							</div>
						</td>

						<td>
							<div class="tbl__name">{{ displayTitle(service) || '—' }}</div>
							<div v-if="altTitle(service)" class="tbl__name-alt">{{ altTitle(service) }}</div>
							<div v-if="displayDescription(service)" class="tbl__desc">{{ truncate(displayDescription(service), 80) }}</div>
						</td>

						<td>
							<span class="type-pill">{{ service.serviceType || '—' }}</span>
						</td>

						<td>
							<div class="location-cell">{{ service.location || '—' }}</div>
						</td>

						<td>
							<span class="count-pill">
								<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
									<rect x="3" y="3" width="18" height="18" rx="2"/>
									<path d="M8 7h8M8 12h8M8 17h5"/>
								</svg>
								{{ collectionCount(service) }}
							</span>
						</td>

						<td>
							<span class="count-pill count-pill--media">
								<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
									<circle cx="12" cy="12" r="3"/>
									<path d="M19.4 15a1 1 0 00.2 1.1l.04.04a2 2 0 01-2.83 2.83l-.04-.04a1 1 0 00-1.1-.2 1 1 0 00-.6.92V21a2 2 0 01-4 0v-.06a1 1 0 00-.67-.94 1 1 0 00-1.1.2l-.04.04a2 2 0 01-2.83-2.83l.04-.04a1 1 0 00.2-1.1 1 1 0 00-.92-.6H3a2 2 0 010-4h.06a1 1 0 00.94-.67 1 1 0 00-.2-1.1l-.04-.04a2 2 0 012.83-2.83l.04.04a1 1 0 001.1.2H7.8a1 1 0 00.6-.92V3a2 2 0 014 0v.06a1 1 0 00.67.94 1 1 0 001.1-.2l.04-.04a2 2 0 012.83 2.83l-.04.04a1 1 0 00-.2 1.1v.07a1 1 0 00.92.6H21a2 2 0 010 4h-.06a1 1 0 00-.94.67 1 1 0 00.2 1.1z"/>
								</svg>
								{{ fileCount(service) }}
							</span>
						</td>

						<td class="tbl__date">{{ fmtDate(service.publishedAt || service.createdAt) }}</td>

						<td>
							<span class="status-pill" :class="service.active ? 'status-pill--published' : 'status-pill--draft'">
								<span class="status-pill__dot"></span>
								{{ service.active ? 'چالاک' : 'ناچالاک' }}
							</span>
						</td>

						<td @click.stop>
							<div class="tbl__acts">
								<button class="act act--view" title="بینین" @click="openDetail(service)">
									<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
										<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
										<circle cx="12" cy="12" r="3"/>
									</svg>
								</button>
								<RouterLink class="act act--edit" :to="`/admin/services/${service.id}/edit`" title="دەستکاری">
									<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
										<path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
										<path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4z"/>
									</svg>
								</RouterLink>
								<button class="act act--toggle" :disabled="patchingId === service.id" title="ناچالاککردن" @click="setActive(service, false)">
									<span v-if="patchingId === service.id" class="spinner spinner--dark spinner--tiny"></span>
									<svg v-else width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
										<path d="M12 2v10"/>
										<path d="M18.4 5.6a9 9 0 11-12.8 0"/>
									</svg>
								</button>
								<button class="act act--del" title="سڕینەوە" @click="confirmDelete(service)">
									<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
										<polyline points="3 6 5 6 21 6"/>
										<path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
										<path d="M10 11v6M14 11v6"/>
									</svg>
								</button>
							</div>
						</td>
					</tr>
				</tbody>
			</table>
		</div>

		<Teleport to="body">
			<Transition name="modal">
				<div v-if="delTarget" class="overlay" @click.self="delTarget = null">
					<div class="del-modal">
						<div class="del-modal__ico">
							<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#8C1515" stroke-width="2">
								<polyline points="3 6 5 6 21 6"/>
								<path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
								<path d="M10 11v6M14 11v6"/>
								<path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
							</svg>
						</div>
						<h3 class="del-modal__title">دڵنیای لە سڕینەوە؟</h3>
						<p class="del-modal__body">
							خزمەتگوزاری <strong>«{{ displayTitle(delTarget) || ('#' + delTarget.id) }}»</strong><br />
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

		<Teleport to="body">
			<Transition name="pdm-fade">
				<div v-if="detail" class="pdm-overlay" @click.self="closeDetail">
					<Transition name="pdm-rise" appear>
						<div v-if="detail" class="pdm" role="dialog">
							<button class="pdm-x" @click="closeDetail">
								<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
									<line x1="18" y1="6" x2="6" y2="18"/>
									<line x1="6" y1="6" x2="18" y2="18"/>
								</svg>
							</button>

							<div class="pdm-cover" v-if="bestPreview(detail)">
								<img v-if="isImageUrl(bestPreview(detail))" :src="bestPreview(detail)" loading="lazy" />
								<video v-else-if="isVideoUrl(bestPreview(detail))" :src="bestPreview(detail)" controls playsinline></video>
								<div v-else class="pdm-cover__fallback">
									<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4">
										<path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
										<polyline points="17 8 12 3 7 8"/>
										<line x1="12" y1="3" x2="12" y2="15"/>
									</svg>
								</div>
							</div>

							<div class="pdm-content">
								<div class="pdm-info__head">
									<div class="pdm-info__head-meta">
										<span class="pdm-id-tag"># {{ detail.id }}</span>
										<span class="type-pill">{{ detail.serviceType || 'بێ جۆر' }}</span>
										<span class="status-pill" :class="detail.active ? 'status-pill--published' : 'status-pill--draft'">
											<span class="status-pill__dot"></span>
											{{ detail.active ? 'چالاک' : 'ناچالاک' }}
										</span>
									</div>

									<div class="pdm-summary">
										<div class="summary-card">
											<span class="summary-card__label">شوێن</span>
											<strong>{{ valueOrDash(detail.location) }}</strong>
										</div>
										<div class="summary-card">
											<span class="summary-card__label">کۆمەڵەکان</span>
											<strong>{{ collectionCount(detail) }}</strong>
										</div>
										<div class="summary-card">
											<span class="summary-card__label">فایلەکان</span>
											<strong>{{ fileCount(detail) }}</strong>
										</div>
										<div class="summary-card">
											<span class="summary-card__label">بڵاوکردنەوە</span>
											<strong>{{ fmtDate(detail.publishedAt || detail.createdAt) }}</strong>
										</div>
									</div>

									<div class="pdm-lang-tabs">
										<button type="button" class="pdm-lang-tab" :class="{ 'pdm-lang-tab--active': detailLang === 'CKB' }" @click="detailLang = 'CKB'">
											<span class="lang-btn__dot lang-btn__dot--ckb"></span>
											سۆرانی
											<span v-if="contentFor(detail, 'CKB').title" class="pdm-lang-tab__check">✓</span>
										</button>
										<button type="button" class="pdm-lang-tab" :class="{ 'pdm-lang-tab--active': detailLang === 'KMR' }" @click="detailLang = 'KMR'">
											<span class="lang-btn__dot lang-btn__dot--kmr"></span>
											کرمانجی
											<span v-if="contentFor(detail, 'KMR').title" class="pdm-lang-tab__check">✓</span>
										</button>
									</div>

									<h2 class="pdm-title">{{ detailTitle(detail) || '—' }}</h2>
									<p v-if="detailDescription(detail)" class="pdm-desc">{{ detailDescription(detail) }}</p>

									<div class="pdm-actions">
										<RouterLink class="pdm-edit-btn" :to="`/admin/services/${detail.id}/edit`" @click="closeDetail">
											<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
												<path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
												<path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4z"/>
											</svg>
											دەستکاری
										</RouterLink>
										<button class="pdm-ghost-btn" :disabled="patchingId === detail.id" @click="setActive(detail, false)">
											<span v-if="patchingId === detail.id" class="spinner spinner--dark spinner--tiny"></span>
											<template v-else>ناچالاککردن</template>
										</button>
									</div>
								</div>

								<section class="detail-section">
									<div class="detail-section__head">
										<h3 class="detail-section__title">زانیاری سەرەکی</h3>
										<span class="detail-section__sub">Service details</span>
									</div>

									<div class="field-grid field-grid--service">
										<div class="field-card">
											<span class="field-card__label">ID</span>
											<strong class="field-card__value">{{ valueOrDash(detail.id) }}</strong>
										</div>
										<div class="field-card">
											<span class="field-card__label">جۆر</span>
											<strong class="field-card__value">{{ valueOrDash(detail.serviceType) }}</strong>
										</div>
										<div class="field-card">
											<span class="field-card__label">شوێن</span>
											<strong class="field-card__value">{{ valueOrDash(detail.location) }}</strong>
										</div>
										<div class="field-card">
											<span class="field-card__label">دۆخ</span>
											<strong class="field-card__value">{{ detail.active ? 'چالاک' : 'ناچالاک' }}</strong>
										</div>
										<div class="field-card">
											<span class="field-card__label">بڵاوکردنەوە</span>
											<strong class="field-card__value">{{ valueOrDash(detail.publishedAt) }}</strong>
										</div>
										<div class="field-card">
											<span class="field-card__label">دروستکراو</span>
											<strong class="field-card__value">{{ valueOrDash(detail.createdAt) }}</strong>
										</div>
										<div class="field-card">
											<span class="field-card__label">کۆمەڵە</span>
											<strong class="field-card__value">{{ collectionCount(detail) }}</strong>
										</div>
										<div class="field-card">
											<span class="field-card__label">فایل</span>
											<strong class="field-card__value">{{ fileCount(detail) }}</strong>
										</div>
									</div>
								</section>

								<section class="detail-section">
									<div class="detail-section__head">
										<h3 class="detail-section__title">ناوەڕۆکی هەردوو زمان</h3>
										<span class="detail-section__sub">contents[] values</span>
									</div>

									<div class="language-panels">
										<div class="lang-panel lang-panel--ckb">
											<div class="lang-panel__head">
												<span class="lang-panel__badge">CKB</span>
												<span class="lang-panel__title">سۆرانی</span>
											</div>
											<div class="field-grid field-grid--lang">
												<div class="field-card">
													<span class="field-card__label">content.id</span>
													<strong class="field-card__value">{{ valueOrDash(contentFor(detail, 'CKB').id) }}</strong>
												</div>
												<div class="field-card">
													<span class="field-card__label">languageCode</span>
													<strong class="field-card__value">{{ valueOrDash(contentFor(detail, 'CKB').languageCode) }}</strong>
												</div>
												<div class="field-card field-card--wide">
													<span class="field-card__label">title</span>
													<strong class="field-card__value">{{ valueOrDash(contentFor(detail, 'CKB').title) }}</strong>
												</div>
												<div class="field-card field-card--wide">
													<span class="field-card__label">description</span>
													<strong class="field-card__value field-card__value--multiline">{{ valueOrDash(contentFor(detail, 'CKB').description) }}</strong>
												</div>
											</div>
										</div>

										<div class="lang-panel lang-panel--kmr">
											<div class="lang-panel__head">
												<span class="lang-panel__badge">KMR</span>
												<span class="lang-panel__title">کرمانجی</span>
											</div>
											<div class="field-grid field-grid--lang">
												<div class="field-card">
													<span class="field-card__label">content.id</span>
													<strong class="field-card__value">{{ valueOrDash(contentFor(detail, 'KMR').id) }}</strong>
												</div>
												<div class="field-card">
													<span class="field-card__label">languageCode</span>
													<strong class="field-card__value">{{ valueOrDash(contentFor(detail, 'KMR').languageCode) }}</strong>
												</div>
												<div class="field-card field-card--wide">
													<span class="field-card__label">title</span>
													<strong class="field-card__value">{{ valueOrDash(contentFor(detail, 'KMR').title) }}</strong>
												</div>
												<div class="field-card field-card--wide">
													<span class="field-card__label">description</span>
													<strong class="field-card__value field-card__value--multiline">{{ valueOrDash(contentFor(detail, 'KMR').description) }}</strong>
												</div>
											</div>
										</div>
									</div>
								</section>

								<div v-if="detail.mediaCollections?.length" class="pdm-collections">
									<div v-for="collection in sortedCollections(detail)" :key="collection.id || collection.collectionName" class="collection-card">
										<div class="collection-card__head">
											<div>
												<h3 class="collection-card__title">{{ collection.collectionName || 'بێ ناو' }}</h3>
												<p class="collection-card__meta">{{ mediaTypesLabel(collection.mediaTypes || (collection.mediaType ? [collection.mediaType] : [])) }} · {{ collection.files?.length || 0 }} فایل · ڕیز: {{ collection.sortOrder ?? '—' }}</p>
									</div>
									<span class="type-pill type-pill--soft">{{ mediaTypesLabel(collection.mediaTypes || (collection.mediaType ? [collection.mediaType] : [])) }}</span>
										</div>

										<div v-if="collection.files?.length" class="collection-card__files">
											<div v-for="file in sortedFiles(collection)" :key="file.id || file.fileUrl" class="file-card">
												<div class="file-card__preview">
													<img v-if="filePreviewUrl(file) && isImageUrl(filePreviewUrl(file))" :src="filePreviewUrl(file)" loading="lazy" />
													<video v-else-if="filePreviewUrl(file) && isVideoUrl(filePreviewUrl(file))" :src="filePreviewUrl(file)" muted playsinline></video>
													<div v-else class="file-card__icon">{{ inferFileIcon(file) }}</div>
												</div>

												<div class="file-card__body">
													<div class="file-card__title">{{ fileTitle(file) || 'بێ ناونیشان' }}</div>
													<div v-if="fileCaption(file)" class="file-card__caption">{{ fileCaption(file) }}</div>
													<div class="file-card__meta-line">
														<span class="file-card__meta-id">#{{ file.id }}</span>
														<span v-if="file.fileFormat">{{ file.fileFormat }}</span>
														<span v-if="file.formattedFileSize">{{ file.formattedFileSize }}</span>
														<span v-if="file.formattedDuration">{{ file.formattedDuration }}</span>
														<span v-if="file.resolution">{{ file.resolution }}</span>
														<span v-if="file.sortOrder != null">ڕیز: {{ file.sortOrder }}</span>
														<span v-if="file.createdAt">{{ file.createdAt }}</span>
													</div>
													<div v-if="file.fileUrl" class="file-card__url">{{ file.fileUrl }}</div>

													<div class="file-content-panels">
														<div class="file-content-panel" v-if="file.ckbContent?.title || file.ckbContent?.caption || file.ckbContent?.description">
															<span class="file-content-panel__badge file-content-panel__badge--ckb">CKB</span>
															<div v-if="file.ckbContent?.title" class="file-content-panel__row"><span class="file-content-panel__label">ناونیشان</span> {{ file.ckbContent.title }}</div>
															<div v-if="file.ckbContent?.caption" class="file-content-panel__row"><span class="file-content-panel__label">کەپشن</span> {{ file.ckbContent.caption }}</div>
															<div v-if="file.ckbContent?.description" class="file-content-panel__row"><span class="file-content-panel__label">وەسف</span> {{ file.ckbContent.description }}</div>
														</div>
														<div class="file-content-panel" v-if="file.kmrContent?.title || file.kmrContent?.caption || file.kmrContent?.description">
															<span class="file-content-panel__badge file-content-panel__badge--kmr">KMR</span>
															<div v-if="file.kmrContent?.title" class="file-content-panel__row"><span class="file-content-panel__label">Sernav</span> {{ file.kmrContent.title }}</div>
															<div v-if="file.kmrContent?.caption" class="file-content-panel__row"><span class="file-content-panel__label">Caption</span> {{ file.kmrContent.caption }}</div>
															<div v-if="file.kmrContent?.description" class="file-content-panel__row"><span class="file-content-panel__label">Danasîn</span> {{ file.kmrContent.description }}</div>
														</div>
													</div>
												</div>
											</div>
										</div>

										<div v-else class="collection-card__empty">هیچ فایلێک نییە</div>
									</div>
								</div>

								<div v-else class="collection-card__empty collection-card__empty--standalone">بۆ ئەم خزمەتگوزارییە هێشتا کۆمەڵەی میدیا نییە.</div>

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
import { computed, onMounted, ref } from 'vue'
import api from '@/api.js'

const items = ref([])
const loading = ref(false)
const error = ref('')
const searchQ = ref('')
const filterType = ref('')
const listLang = ref('CKB')
const detailLang = ref('CKB')
const detail = ref(null)
const delTarget = ref(null)
const deleting = ref(false)
const patchingId = ref(null)
const toast = ref({ show: false, type: 'success', msg: '' })

async function load() {
	loading.value = true
	error.value = ''
	try {
		const { data } = await api.get('/api/v1/services', { _skipCache: true })
		// Backend returns Page<ServiceResponse> inside ApiResponse
		// Structure: { data: { content: [...], totalElements, totalPages, ... }, message: "..." }
		const page = data?.data ?? data
		const list = page?.content ?? page
		items.value = Array.isArray(list) ? list : []
	} catch (err) {
		error.value = err?.response?.data?.message || err.message || 'هەڵەیەک ڕوویدا'
	} finally {
		loading.value = false
	}
}

const serviceTypes = computed(() => {
	return [...new Set(items.value.map(service => normalizeText(service.serviceType)).filter(Boolean))]
		.sort((left, right) => left.localeCompare(right))
})

const visibleItems = computed(() => {
	let pool = [...items.value]

	if (filterType.value) {
		pool = pool.filter(service => normalizeText(service.serviceType) === filterType.value)
	}

	if (searchQ.value) {
		const query = normalizeText(searchQ.value)
		pool = pool.filter(service => searchIndex(service).includes(query))
	}

	return pool
})

function normalizeText(value) {
	return String(value || '').trim().toLowerCase()
}

function contentFor(service, code) {
	return (service?.contents || []).find(content => String(content.languageCode || '').toUpperCase() === code) || {}
}

function displayTitle(service) {
	const primary = contentFor(service, listLang.value).title
	const fallbackCode = listLang.value === 'CKB' ? 'KMR' : 'CKB'
	return primary || contentFor(service, fallbackCode).title || ''
}

function altTitle(service) {
	const fallbackCode = listLang.value === 'CKB' ? 'KMR' : 'CKB'
	const primary = contentFor(service, listLang.value).title || ''
	const fallback = contentFor(service, fallbackCode).title || ''
	return fallback && fallback !== primary ? fallback : ''
}

function displayDescription(service) {
	const primary = contentFor(service, listLang.value).description
	const fallbackCode = listLang.value === 'CKB' ? 'KMR' : 'CKB'
	return primary || contentFor(service, fallbackCode).description || ''
}

function detailTitle(service) {
	const primary = contentFor(service, detailLang.value).title
	const fallbackCode = detailLang.value === 'CKB' ? 'KMR' : 'CKB'
	return primary || contentFor(service, fallbackCode).title || ''
}

function detailDescription(service) {
	const primary = contentFor(service, detailLang.value).description
	const fallbackCode = detailLang.value === 'CKB' ? 'KMR' : 'CKB'
	return primary || contentFor(service, fallbackCode).description || ''
}

function collectionCount(service) {
	return (service?.mediaCollections || []).length
}

function fileCount(service) {
	return (service?.mediaCollections || []).reduce((count, collection) => count + ((collection?.files || []).length), 0)
}

function sortedCollections(service) {
	return [...(service?.mediaCollections || [])].sort((left, right) => (left.sortOrder ?? 0) - (right.sortOrder ?? 0))
}

function sortedFiles(collection) {
	return [...(collection?.files || [])].sort((left, right) => (left.sortOrder ?? 0) - (right.sortOrder ?? 0))
}

function firstFile(service) {
	for (const collection of sortedCollections(service)) {
		const files = sortedFiles(collection)
		if (files.length) return files[0]
	}
	return null
}

function bestPreview(service) {
	return service?.coverMediaUrl || filePreviewUrl(firstFile(service)) || ''
}

function filePreviewUrl(file) {
	return file?.thumbnailUrl || file?.fileUrl || ''
}

function fileTitle(file) {
	const primary = detailLang.value === 'CKB' ? file?.ckbContent : file?.kmrContent
	const fallback = detailLang.value === 'CKB' ? file?.kmrContent : file?.ckbContent
	return primary?.title || fallback?.title || primary?.caption || fallback?.caption || ''
}

function fileCaption(file) {
	const primary = detailLang.value === 'CKB' ? file?.ckbContent : file?.kmrContent
	const fallback = detailLang.value === 'CKB' ? file?.kmrContent : file?.ckbContent
	return primary?.caption || fallback?.caption || ''
}

function searchIndex(service) {
	const parts = [
		service?.serviceType,
		service?.location,
		service?.publishedAt,
		service?.createdAt,
		...((service?.contents || []).flatMap(content => [content.title, content.description, content.languageCode])),
		...((service?.mediaCollections || []).flatMap(collection => [
			collection.collectionName,
			...(collection.mediaTypes || []),
			collection.mediaType,
			...((collection.files || []).flatMap(file => [
				file.fileFormat,
				file.codec,
				file.fileUrl,
				file.thumbnailUrl,
				file.ckbContent?.title,
				file.ckbContent?.caption,
				file.ckbContent?.description,
				file.kmrContent?.title,
				file.kmrContent?.caption,
				file.kmrContent?.description,
			])),
		])),
	]

	return parts.map(normalizeText).filter(Boolean).join(' ')
}

function mediaTypesLabel(types) {
	if (!types || !types.length) return 'میدیا'
	const labels = { IMAGE: 'وێنە', VIDEO: 'ڤیدیۆ', AUDIO: 'دەنگ' }
	return types.map(t => labels[t] || t).join(' · ')
}

function inferFileIcon(file) {
	const url = String(file.fileUrl || '')
	if (/\.(jpe?g|png|gif|webp|svg|bmp|avif)(\?|$)/i.test(url)) return '🖼️'
	if (/\.(mp4|webm|mov|avi|mkv)(\?|$)/i.test(url)) return '🎬'
	if (/\.(mp3|wav|ogg|aac|flac|m4a|opus)(\?|$)/i.test(url)) return '🎧'
	return '📦'
}

function valueOrDash(value) {
	if (value === null || value === undefined) return '—'
	if (typeof value === 'string' && value.trim() === '') return '—'
	return value
}

function booleanValue(value) {
	if (value === true) return 'true'
	if (value === false) return 'false'
	return '—'
}

function isImageUrl(url) {
	return /\.(avif|jpe?g|png|gif|svg|webp)(\?|#|$)/i.test(String(url || ''))
}

function isVideoUrl(url) {
	return /\.(mp4|mov|m4v|webm|avi|mkv)(\?|#|$)/i.test(String(url || ''))
}

function openDetail(service) {
	detail.value = service
	detailLang.value = 'CKB'
}

function closeDetail() {
	detail.value = null
}

function confirmDelete(service) {
	delTarget.value = service
}

async function doDelete() {
	if (!delTarget.value) return
	deleting.value = true
	const targetId = delTarget.value.id
	try {
		await api.delete(`/api/v1/services/${targetId}`)
		items.value = items.value.filter(item => item.id !== targetId)
		if (detail.value?.id === targetId) closeDetail()
		delTarget.value = null
		showToast('success', 'خزمەتگوزارییەکە سڕایەوە ✓')
	} catch (err) {
		showToast('error', err?.response?.data?.message || 'سڕینەوە سەرکەوتوو نەبوو')
	} finally {
		deleting.value = false
	}
}

async function setActive(service, value) {
	if (!service?.id) return
	patchingId.value = service.id
	try {
		await api.patch(`/api/v1/services/${service.id}/active`, null, {
			params: { value },
		})

		const next = { ...service, active: value }
		items.value = items.value.map(item => item.id === service.id ? next : item)
		if (detail.value?.id === service.id) detail.value = next
		showToast('success', value ? 'خزمەتگوزارییەکە چالاک کرا ✓' : 'خزمەتگوزارییەکە ناچالاک کرا ✓')
	} catch (err) {
		showToast('error', err?.response?.data?.message || 'نوێکردنەوەی دۆخ سەرکەوتوو نەبوو')
	} finally {
		patchingId.value = null
	}
}

function fmtDate(value) {
	if (!value) return '—'
	try {
		return new Date(value).toLocaleDateString('ku', { year: 'numeric', month: 'short', day: 'numeric' })
	} catch {
		return String(value).slice(0, 10)
	}
}

function truncate(value, length) {
	const normalized = String(value || '')
	return normalized.length > length ? `${normalized.slice(0, length)}…` : normalized
}

function showToast(type, msg) {
	toast.value = { show: true, type, msg }
	setTimeout(() => {
		toast.value.show = false
	}, 3500)
}

onMounted(load)
</script>

<style scoped>
.slist { direction: rtl; max-width: 1260px; margin: 0 auto; }
.slist__head { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; margin-bottom: 1rem; }
.slist__title { margin: 0 0 .35rem; font-size: clamp(1.2rem, 2vw, 2rem); font-weight: 900; color: var(--text, #2E2D29); }
.slist__sub { margin: 0; color: var(--muted, #767571); font-weight: 600; }
.api-note { display: flex; align-items: center; gap: .55rem; padding: .8rem 1rem; margin-bottom: 1rem; border-radius: 14px; background: #fff8e8; border: 1px solid #f9df9c; color: #8a5b00; font-size: .82rem; font-weight: 700; }
.slist__bar { display: flex; gap: .75rem; margin-bottom: 1rem; flex-wrap: wrap; align-items: center; }
.slist__bar .search { flex: 1; min-width: 260px; }

.lang-switcher { display: flex; gap: .25rem; background: #f0eeeb; border-radius: 12px; padding: .2rem; }
.lang-btn { display: inline-flex; align-items: center; gap: .35rem; padding: .35rem .75rem; border-radius: 9px; border: none; background: transparent; font-weight: 800; font-size: .8rem; color: var(--muted, #767571); cursor: pointer; transition: all .18s; font: inherit; }
.lang-btn--active { background: #fff; color: var(--text, #2E2D29); box-shadow: 0 2px 8px rgba(0,0,0,.07); }
.lang-btn__dot { width: 7px; height: 7px; border-radius: 50%; display: inline-block; }
.lang-btn__dot--ckb { background: #8C1515; }
.lang-btn__dot--kmr { background: #1d6bbf; }

.search { height: 48px; border: 1px solid var(--border, #E0DFDC); background: var(--white, #fff); border-radius: 12px; display: flex; align-items: center; padding: 0 .8rem; gap: .55rem; color: var(--muted, #767571); transition: border-color .2s; }
.search:focus-within { border-color: #8C1515; }
.search__ico { flex-shrink: 0; }
.search__input { border: none; outline: none; width: 100%; background: transparent; color: var(--text, #2E2D29); font: inherit; }
.search__clear { border: none; background: #f0eeeb; border-radius: 50%; width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--muted, #767571); }
.sel { height: 48px; border: 1px solid var(--border, #E0DFDC); background: var(--white, #fff); border-radius: 12px; padding: 0 .9rem; font-weight: 700; color: var(--muted, #767571); font: inherit; cursor: pointer; outline: none; }
.sel:focus { border-color: #8C1515; }

.toast { position: fixed; top: 1.2rem; left: 50%; transform: translateX(-50%); z-index: 9999; padding: .7rem 1.2rem; border-radius: 12px; font-weight: 700; display: flex; align-items: center; gap: .5rem; box-shadow: 0 12px 32px rgba(0,0,0,.12); }
.toast--success { background: #065f46; color: #fff; }
.toast--error { background: #8C1515; color: #fff; }
.toast__ico { font-size: 1.1rem; }

.skeletons { display: flex; flex-direction: column; gap: .6rem; }
.skel { height: 56px; border-radius: 12px; background: linear-gradient(90deg, #f0eeeb 25%, #e8e5e1 50%, #f0eeeb 75%); background-size: 200% 100%; animation: shimmer 1.4s ease infinite; }
@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

.state-box { background: #fff; border: 1px solid var(--border, #E0DFDC); border-radius: 18px; min-height: 240px; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 2rem; text-align: center; gap: .6rem; }
.state-box--error { border-color: #f5c6c6; }
.state-box__ico { width: 56px; height: 56px; border-radius: 50%; background: #FAFAF9; border: 1px solid var(--border, #E0DFDC); display: flex; align-items: center; justify-content: center; color: var(--muted, #767571); }
.state-box p { color: var(--muted, #767571); font-weight: 600; }

.table-wrap { background: #fff; border: 1px solid var(--border, #E0DFDC); border-radius: 18px; box-shadow: 0 8px 24px rgba(0,0,0,.04); overflow: hidden; }
.table-meta { padding: .85rem 1.2rem; font-weight: 700; color: var(--muted, #767571); font-size: .85rem; border-bottom: 1px solid var(--border, #E0DFDC); display: flex; align-items: center; gap: .4rem; flex-wrap: wrap; }
.table-meta__lang { font-size: .72rem; font-weight: 800; padding: .1rem .45rem; border-radius: 5px; }
.table-meta__lang--ckb { background: #fef2f2; color: #8C1515; }
.table-meta__lang--kmr { background: #eff6ff; color: #1d6bbf; }
.tbl { width: 100%; border-collapse: collapse; font-size: .88rem; }
.tbl thead th { text-align: right; padding: .75rem .7rem; font-weight: 800; color: var(--muted, #767571); font-size: .78rem; border-bottom: 1px solid var(--border, #E0DFDC); background: #FAFAF9; white-space: nowrap; }
.tbl tbody td { padding: .7rem; border-bottom: 1px solid #f0eeeb; vertical-align: middle; }
.tbl__row { cursor: pointer; transition: background .15s; }
.tbl__row:hover { background: #FAFAF9; }
.tbl__id { font-weight: 700; color: var(--muted, #767571); font-size: .8rem; background: #f0eeeb; padding: .15rem .45rem; border-radius: 6px; }
.tbl__name { font-weight: 800; color: var(--text, #2E2D29); line-height: 1.4; }
.tbl__name-alt, .tbl__desc, .location-cell { font-size: .76rem; color: var(--muted, #767571); margin-top: .12rem; }
.tbl__date { color: var(--muted, #767571); font-size: .82rem; white-space: nowrap; }

.cover-wrap { width: 42px; height: 42px; border-radius: 12px; overflow: hidden; background: #f5f3ef; display: flex; align-items: center; justify-content: center; border: 1px solid #ece8e1; }
.cover-wrap--empty { color: #aaa; }
.cover-img, .cover-video { width: 100%; height: 100%; object-fit: cover; display: block; }

.type-pill { display: inline-flex; align-items: center; gap: .3rem; padding: .24rem .62rem; border-radius: 999px; font-weight: 800; font-size: .75rem; background: #faf0f0; color: #8C1515; }
.type-pill--soft { background: #f5f3ef; color: #6E6B66; }
.count-pill { display: inline-flex; align-items: center; gap: .3rem; padding: .24rem .56rem; border-radius: 10px; font-weight: 800; font-size: .75rem; background: #f5f3ef; color: #4b5563; }
.count-pill--media { background: #eff6ff; color: #1d4ed8; }

.status-pill { display: inline-flex; align-items: center; gap: .35rem; padding: .2rem .6rem; border-radius: 8px; font-weight: 700; font-size: .8rem; }
.status-pill--published { background: #ecfdf5; color: #065f46; }
.status-pill--draft { background: #fef3c7; color: #92400e; }
.status-pill__dot { width: 7px; height: 7px; border-radius: 50%; }
.status-pill--published .status-pill__dot { background: #10b981; }
.status-pill--draft .status-pill__dot { background: #f59e0b; }

.tbl__acts { display: flex; gap: .35rem; }
.act { width: 32px; height: 32px; border-radius: 8px; border: 1px solid var(--border, #E0DFDC); background: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all .15s; color: var(--muted, #767571); text-decoration: none; font: inherit; }
.act:hover:not(:disabled) { transform: translateY(-1px); }
.act:disabled { cursor: not-allowed; opacity: .6; }
.act--view:hover { border-color: #3b82f6; color: #3b82f6; background: #eff6ff; }
.act--edit:hover { border-color: #8C1515; color: #8C1515; background: #faf0f0; }
.act--toggle:hover { border-color: #92400e; color: #92400e; background: #fff7ed; }
.act--del:hover { border-color: #dc2626; color: #dc2626; background: #fef2f2; }

.btn { display: inline-flex; align-items: center; justify-content: center; gap: .4rem; text-decoration: none; border-radius: 12px; padding: .75rem 1rem; font-weight: 900; border: 1px solid transparent; transition: .18s ease; white-space: nowrap; cursor: pointer; font: inherit; }
.btn:hover:not(:disabled) { transform: translateY(-1px); }
.btn--primary { background: #8C1515; color: #fff; box-shadow: 0 10px 24px rgba(140,21,21,.18); }
.btn--ghost { background: #fff; color: #6E6B66; border-color: #E0DFDC; }
.btn--danger { background: #dc2626; color: #fff; }
.btn--sm { padding: .55rem .85rem; font-size: .88rem; }

.overlay { position: fixed; inset: 0; z-index: 10000; background: rgba(0,0,0,.45); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; }
.del-modal { background: #fff; border-radius: 20px; padding: 2rem; max-width: 400px; width: 90%; text-align: center; box-shadow: 0 24px 64px rgba(0,0,0,.15); }
.del-modal__ico { width: 64px; height: 64px; border-radius: 50%; background: #fef2f2; border: 2px solid #fecaca; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; }
.del-modal__title { font-weight: 900; color: var(--text, #2E2D29); margin: 0 0 .5rem; }
.del-modal__body { color: var(--muted, #767571); line-height: 1.7; margin: 0 0 1.2rem; }
.del-modal__acts { display: flex; gap: .6rem; justify-content: center; }

.pdm-overlay { position: fixed; inset: 0; z-index: 10000; background: rgba(0,0,0,.5); backdrop-filter: blur(6px); display: flex; align-items: center; justify-content: center; padding: 1.5rem; }
.pdm { background: #fff; border-radius: 22px; max-width: 1100px; width: 100%; max-height: 90vh; overflow-y: auto; position: relative; box-shadow: 0 32px 80px rgba(0,0,0,.2); }
.pdm-x { position: absolute; top: 1rem; left: 1rem; width: 36px; height: 36px; border-radius: 10px; background: rgba(240,238,235,.92); backdrop-filter: blur(4px); border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--muted, #767571); transition: all .15s; z-index: 2; }
.pdm-x:hover { background: #e8e5e1; }
.pdm-cover { background: #f5f3ef; min-height: 210px; display: flex; align-items: center; justify-content: center; overflow: hidden; border-radius: 22px 22px 0 0; }
.pdm-cover img, .pdm-cover video { width: 100%; height: 100%; object-fit: cover; display: block; }
.pdm-cover__fallback { padding: 2rem; color: #9ca3af; }
.pdm-content { padding: 1.5rem 2rem 2rem; }
.pdm-info__head { margin-bottom: 1.25rem; }
.pdm-info__head-meta { display: flex; gap: .5rem; align-items: center; flex-wrap: wrap; margin-bottom: .8rem; }
.pdm-id-tag { font-weight: 700; color: var(--muted, #767571); font-size: .8rem; background: #f0eeeb; padding: .15rem .5rem; border-radius: 6px; }
.pdm-summary { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: .65rem; margin-bottom: 1rem; }
.summary-card { background: #FAFAF9; border: 1px solid #f0eeeb; border-radius: 14px; padding: .8rem .9rem; display: flex; flex-direction: column; gap: .25rem; }
.summary-card__label { color: var(--muted, #767571); font-size: .74rem; font-weight: 700; }
.summary-card strong { color: var(--text, #2E2D29); font-size: .9rem; }

.detail-section { margin-top: 1.4rem; }
.detail-section__head { display: flex; align-items: center; justify-content: space-between; gap: .75rem; margin-bottom: .85rem; flex-wrap: wrap; }
.detail-section__title { margin: 0; font-size: 1rem; font-weight: 900; color: var(--text, #2E2D29); }
.detail-section__sub { font-size: .74rem; font-weight: 800; color: var(--muted, #767571); background: #f5f3ef; padding: .18rem .5rem; border-radius: 999px; }

.field-grid { display: grid; gap: .7rem; }
.field-grid--service { grid-template-columns: repeat(4, minmax(0, 1fr)); }
.field-grid--collection { grid-template-columns: repeat(6, minmax(0, 1fr)); padding: 0 1rem 1rem; border-bottom: 1px solid #f0eeeb; background: #fff; }
.field-grid--file { grid-template-columns: repeat(4, minmax(0, 1fr)); margin-top: .75rem; }
.field-grid--lang { grid-template-columns: repeat(2, minmax(0, 1fr)); }

.field-card { background: #FAFAF9; border: 1px solid #ece8e1; border-radius: 14px; padding: .8rem .9rem; display: flex; flex-direction: column; gap: .32rem; min-width: 0; }
.field-card--wide { grid-column: span 2; }
.field-card__label { color: var(--muted, #767571); font-size: .72rem; font-weight: 800; direction: ltr; text-align: left; }
.field-card__value { color: var(--text, #2E2D29); font-size: .88rem; font-weight: 800; line-height: 1.8; }
.field-card__value--break { word-break: break-word; font-family: monospace; font-size: .8rem; }
.field-card__value--multiline { white-space: pre-line; }

.language-panels { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .9rem; }
.language-panels--files { margin-top: .85rem; }
.lang-panel { border: 1px solid #ece8e1; border-radius: 18px; overflow: hidden; background: #fff; }
.lang-panel--ckb { box-shadow: inset 0 0 0 1px rgba(140,21,21,.06); }
.lang-panel--kmr { box-shadow: inset 0 0 0 1px rgba(29,107,191,.06); }
.lang-panel__head { display: flex; align-items: center; gap: .5rem; padding: .85rem 1rem; background: #fafaf9; border-bottom: 1px solid #f0eeeb; }
.lang-panel__badge { display: inline-flex; align-items: center; justify-content: center; min-width: 44px; height: 24px; padding: 0 .45rem; border-radius: 999px; font-size: .7rem; font-weight: 900; background: #f0eeeb; color: #4b5563; }
.lang-panel--ckb .lang-panel__badge { background: #fef2f2; color: #8C1515; }
.lang-panel--kmr .lang-panel__badge { background: #eff6ff; color: #1d6bbf; }
.lang-panel__title { font-size: .88rem; font-weight: 900; color: var(--text, #2E2D29); }
.lang-panel .field-grid { padding: 1rem; }

.pdm-lang-tabs { display: flex; gap: .3rem; margin-bottom: 1rem; }
.pdm-lang-tab { display: inline-flex; align-items: center; gap: .4rem; padding: .4rem .85rem; border-radius: 9px; border: 1.5px solid var(--border, #E0DFDC); background: #FAFAF9; font-weight: 800; font-size: .83rem; color: var(--muted, #767571); cursor: pointer; transition: all .18s; font: inherit; }
.pdm-lang-tab--active { background: #fff; border-color: #2E2D29; color: var(--text, #2E2D29); box-shadow: 0 2px 8px rgba(0,0,0,.06); }
.pdm-lang-tab__check { color: #10b981; }

.pdm-title { font-weight: 900; font-size: 1.4rem; color: var(--text, #2E2D29); margin: 0 0 .5rem; }
.pdm-desc { color: var(--muted, #767571); margin: 0; line-height: 1.9; white-space: pre-line; }
.pdm-actions { display: flex; gap: .6rem; flex-wrap: wrap; margin-top: 1rem; }
.pdm-edit-btn, .pdm-ghost-btn { display: inline-flex; align-items: center; justify-content: center; gap: .4rem; border-radius: 10px; padding: .55rem .95rem; font-weight: 800; font-size: .88rem; text-decoration: none; border: 1px solid transparent; font: inherit; cursor: pointer; }
.pdm-edit-btn { color: #8C1515; background: #faf0f0; }
.pdm-edit-btn:hover { background: #f5e0e0; }
.pdm-ghost-btn { color: #92400e; background: #fff7ed; border-color: #fed7aa; }

.pdm-collections { display: flex; flex-direction: column; gap: .9rem; margin-top: 1.3rem; }
.collection-card { border: 1px solid #ece8e1; border-radius: 18px; background: #fff; overflow: hidden; }
.collection-card__head { display: flex; align-items: flex-start; justify-content: space-between; gap: .8rem; padding: 1rem 1rem .85rem; border-bottom: 1px solid #f0eeeb; background: #fafaf9; }
.collection-card__title { margin: 0 0 .18rem; font-size: 1rem; font-weight: 900; color: var(--text, #2E2D29); }
.collection-card__meta { margin: 0; font-size: .78rem; color: var(--muted, #767571); font-weight: 700; }
.collection-card__files { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .75rem; padding: 1rem; }
.collection-card__empty { padding: 1rem; color: var(--muted, #767571); font-weight: 700; }
.collection-card__empty--standalone { background: #fff; border: 1px dashed #d6d3d1; border-radius: 16px; }

.file-card { border: 1px solid #f0eeeb; border-radius: 14px; overflow: hidden; background: #fff; }
.file-card__preview { height: 140px; background: #f5f3ef; display: flex; align-items: center; justify-content: center; overflow: hidden; }
.file-card__preview img, .file-card__preview video { width: 100%; height: 100%; object-fit: cover; display: block; }
.file-card__icon { font-size: 1.8rem; }
.file-card__body { padding: .85rem .95rem 1rem; }
.file-card__title { font-weight: 800; color: var(--text, #2E2D29); }
.file-card__caption { margin-top: .2rem; font-size: .8rem; color: var(--muted, #767571); }
.file-card__meta-line { display: flex; gap: .35rem; flex-wrap: wrap; margin-top: .55rem; }
.file-card__meta-line span { padding: .15rem .45rem; border-radius: 999px; background: #f5f3ef; color: #6b7280; font-size: .72rem; font-weight: 800; }
.file-card__meta-id { font-family: monospace; color: var(--muted, #767571) !important; }
.file-card__url { margin-top: .4rem; font-size: .7rem; color: var(--muted, #767571); word-break: break-all; line-height: 1.4; opacity: .7; }
.file-content-panels { display: flex; gap: .6rem; margin-top: .65rem; flex-wrap: wrap; }
.file-content-panel { flex: 1; min-width: 180px; background: #fafaf8; border: 1px solid #f0eeeb; border-radius: 10px; padding: .6rem .75rem; }
.file-content-panel__badge { display: inline-block; font-size: .65rem; font-weight: 900; padding: .15rem .45rem; border-radius: 999px; margin-bottom: .45rem; color: #fff; }
.file-content-panel__badge--ckb { background: #8C1515; }
.file-content-panel__badge--kmr { background: #1d6bbf; }
.file-content-panel__row { font-size: .78rem; line-height: 1.5; margin-bottom: .2rem; color: var(--text, #2E2D29); }
.file-content-panel__label { font-weight: 800; color: var(--muted, #767571); margin-left: .3rem; }

.pdm-dates { margin-top: 1.25rem; padding-top: .8rem; border-top: 1px solid #f0eeeb; display: flex; flex-direction: column; gap: .3rem; font-size: .82rem; color: var(--muted, #767571); }

.spinner { width: 16px; height: 16px; border-radius: 50%; border: 2px solid rgba(255,255,255,.3); border-top-color: #fff; animation: spin .7s linear infinite; }
.spinner--dark { border-color: rgba(0,0,0,.15); border-top-color: var(--muted, #767571); }
.spinner--tiny { width: 13px; height: 13px; border-width: 1.8px; }
@keyframes spin { to { transform: rotate(360deg); } }

.slide-down-enter-active, .slide-down-leave-active, .fade-enter-active, .fade-leave-active { transition: all .25s ease; }
.slide-down-enter-from, .slide-down-leave-to { opacity: 0; transform: translate(-50%, -20px); }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.modal-enter-active, .modal-leave-active { transition: all .3s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-from .del-modal, .modal-leave-to .del-modal { transform: scale(.92); }
.pdm-fade-enter-active, .pdm-fade-leave-active { transition: opacity .3s ease; }
.pdm-fade-enter-from, .pdm-fade-leave-to { opacity: 0; }
.pdm-rise-enter-active { transition: all .35s cubic-bezier(.16,1,.3,1); }
.pdm-rise-leave-active { transition: all .25s ease; }
.pdm-rise-enter-from { opacity: 0; transform: translateY(24px) scale(.96); }
.pdm-rise-leave-to { opacity: 0; transform: translateY(12px) scale(.98); }

@media (max-width: 960px) {
	.tbl { min-width: 1080px; }
	.table-wrap { overflow-x: auto; }
	.pdm-summary { grid-template-columns: repeat(2, minmax(0, 1fr)); }
	.field-grid--service,
	.field-grid--collection,
	.field-grid--file,
	.field-grid--lang,
	.language-panels { grid-template-columns: repeat(2, minmax(0, 1fr)); }
	.collection-card__files { grid-template-columns: 1fr; }
}

@media (max-width: 640px) {
	.slist__head { flex-direction: column; }
	.slist__bar { flex-direction: column; align-items: stretch; }
	.lang-switcher { width: 100%; justify-content: center; }
	.pdm-content { padding: 1.2rem 1rem 1.4rem; }
	.pdm-summary { grid-template-columns: 1fr; }
	.field-grid--service,
	.field-grid--collection,
	.field-grid--file,
	.field-grid--lang,
	.language-panels { grid-template-columns: 1fr; }
	.field-card--wide { grid-column: span 1; }
	.del-modal__acts { flex-direction: column; }
}
</style>
