<template>
	<div class="sed" dir="rtl">

		<div class="sed__head">
			<RouterLink to="/admin/services" class="sed__back">
				<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path d="M19 12H5M12 5l-7 7 7 7"/>
				</svg>
				گەڕانەوە
			</RouterLink>

			<div>
				<h1 class="sed__title">{{ isEdit ? 'دەستکاری خزمەتگوزاری' : 'خزمەتگوزاریی نوێ' }}</h1>
				<p v-if="isEdit" class="sed__sub">ID: {{ route.params.id }}</p>
			</div>

			<div class="lang-switcher">
				<button type="button" class="lang-btn" :class="{ 'lang-btn--active': activeLang === 'CKB' }" @click="activeLang = 'CKB'">
					<span class="lang-btn__dot lang-btn__dot--ckb"></span>سۆرانی
				</button>
				<button type="button" class="lang-btn" :class="{ 'lang-btn--active': activeLang === 'KMR' }" @click="activeLang = 'KMR'">
					<span class="lang-btn__dot lang-btn__dot--kmr"></span>کرمانجی
				</button>
			</div>
		</div>

		<Transition name="toast">
			<div v-if="toast.show" class="toast" :class="`toast--${toast.type}`">
				<span class="toast__ico">{{ toast.type === 'success' ? '✓' : '✕' }}</span>
				{{ toast.msg }}
			</div>
		</Transition>

		<div v-if="fetching" class="loading-bar"></div>

		<div v-else class="sed__layout">
			<div class="col-main">

				<section class="card">
					<div class="card__hd">
						<span class="card__hd-ico">📌</span>
						زانیاری گشتی
					</div>

					<div class="two-grid">
						<div class="field">
							<label class="lbl lbl--req">جۆری خزمەتگوزاری</label>
							<input v-model.trim="form.serviceType" class="inp" :class="{ 'inp--err': errors.serviceType }" placeholder="بۆ نموونە: Training, Event, Workshop…" dir="ltr" />
							<div v-if="errors.serviceType" class="err">{{ errors.serviceType }}</div>
						</div>

						<div class="field">
							<label class="lbl">شوێن</label>
							<input v-model.trim="form.location" class="inp" placeholder="Online, Sulaymaniyah Hall, Erbil Campus…" dir="ltr" />
						</div>
					</div>

					<div class="field">
						<label class="lbl">کاتی بڵاوکردنەوە</label>
						<input v-model="form.publishedAt" type="datetime-local" class="inp" dir="ltr" />
						<div class="field__hint">لە backend بە شێوەی <span class="mono">yyyy-MM-dd HH:mm:ss</span> دەنێردرێت.</div>
					</div>
				</section>

				<section class="card">
					<div class="card__hd">
						<span class="card__hd-ico">🌐</span>
						ناوەڕۆکی زمانەکان
						<span class="card__hd-lang" :class="`card__hd-lang--${activeLang.toLowerCase()}`">
							{{ activeLang === 'CKB' ? 'سۆرانی' : 'کرمانجی' }}
						</span>
					</div>

					<div class="field">
						<label class="lbl lbl--req">
							ناونیشان
							<span class="lbl__lang" :class="`lbl__lang--${activeLang.toLowerCase()}`">{{ activeLang }}</span>
						</label>
						<input v-if="activeLang === 'CKB'" v-model.trim="form.ckbContent.title" class="inp" :class="{ 'inp--err': errors.ckbTitle }" placeholder="ناونیشانی خزمەتگوزاری…" />
						<input v-else v-model.trim="form.kmrContent.title" class="inp" :class="{ 'inp--err': errors.kmrTitle }" placeholder="Sernavê xizmetê…" />
						<div v-if="activeLang === 'CKB' && errors.ckbTitle" class="err">{{ errors.ckbTitle }}</div>
						<div v-if="activeLang === 'KMR' && errors.kmrTitle" class="err">{{ errors.kmrTitle }}</div>
					</div>

					<div class="field">
						<label class="lbl">
							وەسف
							<span class="lbl__lang" :class="`lbl__lang--${activeLang.toLowerCase()}`">{{ activeLang }}</span>
						</label>
						<textarea v-if="activeLang === 'CKB'" v-model.trim="form.ckbContent.description" class="inp ta" placeholder="وەسفی سۆرانی…"></textarea>
						<textarea v-else v-model.trim="form.kmrContent.description" class="inp ta" placeholder="Danasîna Kurmancî…"></textarea>
					</div>

					<div class="fill-status">
						<div class="fill-status__item" :class="{ 'fill-status__item--ok': form.ckbContent.title }">
							<span class="fill-status__dot"></span>
							سۆرانی — {{ form.ckbContent.title ? 'ئامادە ✓' : 'ناونیشان پێویستە' }}
						</div>
						<div class="fill-status__item" :class="{ 'fill-status__item--ok': form.kmrContent.title }">
							<span class="fill-status__dot"></span>
							کرمانجی — {{ form.kmrContent.title ? 'ئامادە ✓' : 'ئیختیاری' }}
						</div>
					</div>
				</section>

				<section class="card">
					<div class="card__hd">
						<span class="card__hd-ico">🖼️</span>
						کاڤەر / هیرۆ
						<span class="card__hd-hint">coverMediaUrl</span>
					</div>

					<div class="cover-field">
						<div class="cover-preview" :class="{ 'cover-preview--empty': !form.coverMediaUrl }">
							<img v-if="form.coverMediaUrl && isImageUrl(form.coverMediaUrl)" :src="form.coverMediaUrl" class="cover-preview__media" loading="lazy" />
							<video v-else-if="form.coverMediaUrl && isVideoUrl(form.coverMediaUrl)" :src="form.coverMediaUrl" class="cover-preview__media" controls playsinline></video>
							<div v-else class="cover-preview__placeholder">
								<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3">
									<rect x="3" y="3" width="18" height="18" rx="2"/>
									<circle cx="8.5" cy="8.5" r="1.5"/>
									<polyline points="21 15 16 10 5 21"/>
								</svg>
								<span>کاڤەر هەڵنەبژێردراوە</span>
							</div>

							<button v-if="form.coverMediaUrl" type="button" class="cover-preview__remove" @click="form.coverMediaUrl = ''">
								<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
									<line x1="18" y1="6" x2="6" y2="18"/>
									<line x1="6" y1="6" x2="18" y2="18"/>
								</svg>
							</button>
						</div>

						<div class="cover-input-row">
							<input v-model.trim="form.coverMediaUrl" class="inp" placeholder="https://…" dir="ltr" />
							<label class="upload-btn" :class="{ 'upload-btn--loading': coverUploading }">
								<span v-if="coverUploading" class="spinner spinner--dark"></span>
								<svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
									<path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
									<polyline points="17 8 12 3 7 8"/>
									<line x1="12" y1="3" x2="12" y2="15"/>
								</svg>
								{{ coverUploading ? 'بارکردن…' : 'بارکردن' }}
								<input type="file" hidden accept="image/*,video/*" @change="uploadCover" />
							</label>
						</div>
					</div>
				</section>

				<section class="card">
					<div class="card__hd">
						<span class="card__hd-ico">🗂️</span>
						کۆمەڵە میدیاکان
						<span class="card__hd-badge">{{ form.mediaCollections.length }}</span>
					</div>

					<div v-if="!form.mediaCollections.length" class="collection-empty">
						هیچ کۆمەڵەیەک نییە. ئەگەر پێویستت بە gallery هەیە، یەکێک زیاد بکە.
					</div>

					<div class="collection-list">
						<div v-for="(collection, collectionIndex) in form.mediaCollections" :key="collection._uid" class="collection-card">
							<div class="collection-card__head">
								<div class="collection-card__title-wrap">
									<span class="collection-card__seq">{{ collectionIndex + 1 }}</span>
									<div>
										<h3 class="collection-card__title">{{ collection.collectionName || 'کۆمەڵەی نوێ' }}</h3>
										<p class="collection-card__meta">{{ mediaTypesLabel(collection.mediaTypes) }} · {{ collection.files.length }} فایل</p>
									</div>
								</div>

								<div class="collection-card__actions">
									<button type="button" class="mini-btn" @click="collection._open = !collection._open">
										<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
											<path v-if="collection._open" d="M18 15l-6-6-6 6"/>
											<path v-else d="M6 9l6 6 6-6"/>
										</svg>
									</button>
									<button type="button" class="mini-btn mini-btn--danger" @click="removeCollection(collectionIndex)">
										<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
											<line x1="18" y1="6" x2="6" y2="18"/>
											<line x1="6" y1="6" x2="18" y2="18"/>
										</svg>
									</button>
								</div>
							</div>

							<div v-if="collection._open" class="collection-card__body">
								<div class="three-grid">
									<div class="field">
										<label class="lbl lbl--req">ناوی کۆمەڵە</label>
										<input v-model.trim="collection.collectionName" class="inp" :class="{ 'inp--err': collectionError(collectionIndex) }" placeholder="Event Photos, Recap Videos…" dir="ltr" />
									</div>

									<div class="field">
										<label class="lbl lbl--req">جۆری میدیا</label>
										<div class="media-type-checks">
											<label class="media-type-check">
												<input type="checkbox" value="IMAGE" v-model="collection.mediaTypes" class="media-type-check__input" />
												<span class="media-type-check__label">🖼️ وێنە</span>
											</label>
											<label class="media-type-check">
												<input type="checkbox" value="VIDEO" v-model="collection.mediaTypes" class="media-type-check__input" />
												<span class="media-type-check__label">🎬 ڤیدیۆ</span>
											</label>
											<label class="media-type-check">
												<input type="checkbox" value="AUDIO" v-model="collection.mediaTypes" class="media-type-check__input" />
												<span class="media-type-check__label">🎧 دەنگ</span>
											</label>
										</div>
									</div>

									<div class="field">
										<label class="lbl">Sort order</label>
										<input v-model.number="collection.sortOrder" type="number" min="0" class="inp" dir="ltr" />
									</div>
								</div>

								<div v-if="collectionError(collectionIndex)" class="err">{{ collectionError(collectionIndex) }}</div>

								<div class="collection-toolbar">
									<label class="upload-btn" :class="{ 'upload-btn--loading': collection._uploading }">
										<span v-if="collection._uploading" class="spinner spinner--dark"></span>
										<svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
											<path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
											<polyline points="17 8 12 3 7 8"/>
											<line x1="12" y1="3" x2="12" y2="15"/>
										</svg>
										{{ collection._uploading ? 'بارکردن…' : 'بارکردنی فایلەکان' }}
										<input type="file" hidden multiple :accept="acceptForTypes(collection.mediaTypes)" @change="uploadCollectionFiles($event, collection)" />
									</label>

									<button type="button" class="btn btn--ghost btn--sm" @click="addFile(collection)">
										<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
											<line x1="12" y1="5" x2="12" y2="19"/>
											<line x1="5" y1="12" x2="19" y2="12"/>
										</svg>
										زیادکردنی فایل بە URL
									</button>
								</div>

								<div v-if="!collection.files.length" class="collection-empty collection-empty--inner">
									هێشتا فایل زیاد نەکراوە.
								</div>

								<div class="file-list">
									<div v-for="(file, fileIndex) in collection.files" :key="file._uid" class="file-card">
										<div class="file-card__top">
											<div class="file-card__preview">
												<img v-if="filePreviewUrl(file) && isImageUrl(filePreviewUrl(file))" :src="filePreviewUrl(file)" loading="lazy" />
												<video v-else-if="filePreviewUrl(file) && isVideoUrl(filePreviewUrl(file))" :src="filePreviewUrl(file)" muted playsinline></video>
												<div v-else class="file-card__fallback">{{ inferFileIcon(file) }}</div>
											</div>

											<div class="file-card__top-meta">
												<div class="field field--dense">
													<label class="lbl">fileUrl</label>
													<input v-model.trim="file.fileUrl" class="inp inp--sm" :class="{ 'inp--err': fileError(collectionIndex, fileIndex) }" placeholder="https://…" dir="ltr" />
												</div>
												<div class="field field--dense">
													<label class="lbl">thumbnailUrl</label>
													<div class="thumb-row">
														<input v-model.trim="file.thumbnailUrl" class="inp inp--sm" placeholder="https://…" dir="ltr" />
														<label class="upload-btn upload-btn--compact" :class="{ 'upload-btn--loading': file._thumbUploading }">
															<span v-if="file._thumbUploading" class="spinner spinner--dark spinner--tiny"></span>
															<svg v-else width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
																<path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
																<polyline points="17 8 12 3 7 8"/>
																<line x1="12" y1="3" x2="12" y2="15"/>
															</svg>
															<input type="file" hidden accept="image/*" @change="uploadThumbnail($event, file)" />
														</label>
													</div>
												</div>
												<div class="field field--dense field--sort">
													<label class="lbl">sort</label>
													<input v-model.number="file.sortOrder" type="number" min="0" class="inp inp--sm" dir="ltr" />
												</div>
											</div>

											<button type="button" class="file-card__remove" @click="removeFile(collection, fileIndex)">
												<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
													<line x1="18" y1="6" x2="6" y2="18"/>
													<line x1="6" y1="6" x2="18" y2="18"/>
												</svg>
											</button>
										</div>

										<div v-if="fileError(collectionIndex, fileIndex)" class="err">{{ fileError(collectionIndex, fileIndex) }}</div>

										<div class="file-card__meta-line" v-if="file.fileFormat || file.resolution || file.formattedDuration || file.codec || file.formattedFileSize || file.bitrateKbps">
											<span v-if="file.fileFormat">{{ file.fileFormat }}</span>
											<span v-if="file.resolution">{{ file.resolution }}</span>
											<span v-if="file.formattedDuration">{{ file.formattedDuration }}</span>
											<span v-if="file.codec">{{ file.codec }}</span>
											<span v-if="file.bitrateKbps">{{ file.bitrateKbps }} kbps</span>
											<span v-if="file.formattedFileSize">{{ file.formattedFileSize }}</span>
										</div>

										<div class="file-card__content">
											<div class="field">
												<label class="lbl">
													ناونیشان
													<span class="lbl__lang" :class="`lbl__lang--${activeLang.toLowerCase()}`">{{ activeLang }}</span>
												</label>
												<input v-if="activeLang === 'CKB'" v-model.trim="file.ckbContent.title" class="inp" placeholder="ناونیشانی فایل…" />
												<input v-else v-model.trim="file.kmrContent.title" class="inp" placeholder="Sernavê pelê…" />
											</div>

											<div class="field">
												<label class="lbl">
													Caption
													<span class="lbl__lang" :class="`lbl__lang--${activeLang.toLowerCase()}`">{{ activeLang }}</span>
												</label>
												<input v-if="activeLang === 'CKB'" v-model.trim="file.ckbContent.caption" class="inp" placeholder="کورتە دەق…" />
												<input v-else v-model.trim="file.kmrContent.caption" class="inp" placeholder="Daxuyanîya kurt…" />
											</div>

											<div class="field field--full">
												<label class="lbl">
													وەسف
													<span class="lbl__lang" :class="`lbl__lang--${activeLang.toLowerCase()}`">{{ activeLang }}</span>
												</label>
												<textarea v-if="activeLang === 'CKB'" v-model.trim="file.ckbContent.description" class="inp ta ta--sm" placeholder="وەسفی فایل…"></textarea>
												<textarea v-else v-model.trim="file.kmrContent.description" class="inp ta ta--sm" placeholder="Danasîna pelê…"></textarea>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					<button type="button" class="btn btn--outline" @click="addCollection">
						<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
							<line x1="12" y1="5" x2="12" y2="19"/>
							<line x1="5" y1="12" x2="19" y2="12"/>
						</svg>
						زیادکردنی کۆمەڵەی نوێ
					</button>
				</section>
			</div>

			<div class="col-side">
				<section class="card card--sticky">
					<div class="card__hd">
						<span class="card__hd-ico">🚀</span>
						بڵاوکردنەوە
					</div>

					<label class="toggle-row">
						<span>
							<strong>چالاک</strong>
							<small>active flag لە PATCH ـێکی جیاواز دەنێردرێت</small>
						</span>
						<input v-model="form.active" type="checkbox" class="toggle-row__input" />
					</label>

					<div class="publish-info">
						<div class="publish-info__row"><span>جۆر:</span><strong>{{ form.serviceType || '—' }}</strong></div>
						<div class="publish-info__row"><span>کۆمەڵەکان:</span><strong>{{ form.mediaCollections.length }}</strong></div>
						<div class="publish-info__row"><span>فایلەکان:</span><strong>{{ totalFiles }}</strong></div>
						<div class="publish-info__row"><span>کاڤەر:</span><strong>{{ form.coverMediaUrl ? 'دیاریکراوە' : 'نییە' }}</strong></div>
					</div>

					<div v-if="!form.active" class="inactive-note">
						ئەگەر ناچالاک بکرێت، بەهۆی سنووری backend لە لیستی admin ـی services نامێنێت.
					</div>

					<div class="publish-actions">
						<button type="button" class="btn btn--primary btn--full" :disabled="saving" @click="submit">
							<span v-if="saving" class="spinner"></span>
							{{ saving ? 'پاشەکەوتکردن…' : (isEdit ? 'نوێکردنەوە' : 'دروستکردن') }}
						</button>

						<button v-if="isEdit" type="button" class="btn btn--danger btn--full" @click="doDelete">
							<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<polyline points="3 6 5 6 21 6"/>
								<path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
							</svg>
							سڕینەوە
						</button>

						<RouterLink to="/admin/services" class="btn btn--ghost btn--full">هەڵوەشاندنەوە</RouterLink>
					</div>
				</section>
			</div>
		</div>
	</div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/api.js'

const route = useRoute()
const router = useRouter()

const isEdit = computed(() => Boolean(route.params.id))
const fetching = ref(false)
const saving = ref(false)
const coverUploading = ref(false)
const activeLang = ref('CKB')
const existingData = ref(null)
const toast = ref({ show: false, type: 'success', msg: '' })
const errors = ref({})

const form = reactive({
	serviceType: '',
	location: '',
	coverMediaUrl: '',
	publishedAt: '',
	active: true,
	ckbContent: createLocalizedContent(),
	kmrContent: createLocalizedContent(),
	mediaCollections: [],
})

const totalFiles = computed(() => {
	return form.mediaCollections.reduce((count, collection) => count + collection.files.length, 0)
})

function uid() {
	return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

function createLocalizedContent() {
	return { title: '', description: '' }
}

function createFileContent() {
	return { caption: '', title: '', description: '' }
}

function createFile(seed = {}) {
	return {
		id: seed.id ?? null,
		fileUrl: seed.fileUrl || '',
		thumbnailUrl: seed.thumbnailUrl || '',
		ckbContent: {
			caption: seed.ckbContent?.caption || '',
			title: seed.ckbContent?.title || '',
			description: seed.ckbContent?.description || '',
		},
		kmrContent: {
			caption: seed.kmrContent?.caption || '',
			title: seed.kmrContent?.title || '',
			description: seed.kmrContent?.description || '',
		},
		sortOrder: normalizeOrder(seed.sortOrder, 0),
		fileFormat: seed.fileFormat || '',
		resolution: seed.resolution || buildResolution(seed.widthPx, seed.heightPx),
		formattedDuration: seed.formattedDuration || '',
		codec: seed.codec || '',
		bitrateKbps: seed.bitrateKbps ?? null,
		formattedFileSize: seed.formattedFileSize || '',
		_thumbUploading: false,
		_uid: uid(),
	}
}

function createCollection(seed = {}, fallbackOrder = 0) {
	const mediaTypes = seed.mediaTypes
		? (Array.isArray(seed.mediaTypes) ? seed.mediaTypes : [seed.mediaTypes])
		: (seed.mediaType ? [seed.mediaType] : ['IMAGE', 'VIDEO', 'AUDIO'])
	return {
		id: seed.id ?? null,
		collectionName: seed.collectionName || '',
		mediaTypes,
		sortOrder: normalizeOrder(seed.sortOrder, fallbackOrder),
		files: (seed.files || []).map((file, index) => createFile({ ...file, sortOrder: normalizeOrder(file.sortOrder, index) })),
		_uploading: false,
		_open: seed._open ?? true,
		_uid: uid(),
	}
}

function normalizeOrder(value, fallback = 0) {
	return Number.isFinite(Number(value)) ? Number(value) : fallback
}

function buildResolution(width, height) {
	return width && height ? `${width} × ${height}` : ''
}

function trimOrNull(value) {
	const normalized = String(value || '').trim()
	return normalized || null
}

function hasText(value) {
	return Boolean(String(value || '').trim())
}

function toLocalDateTime(value) {
	if (!value) return ''
	const normalized = String(value).replace(' ', 'T')
	return normalized.slice(0, 16)
}

function toBackendDateTime(value) {
	if (!value) return null
	const normalized = String(value).replace('T', ' ')
	return normalized.length === 16 ? `${normalized}:00` : normalized
}

function contentFromResponse(contents, code) {
	return (contents || []).find(content => String(content.languageCode || '').toUpperCase() === code) || {}
}

function applyResponse(service) {
	existingData.value = service
	form.serviceType = service.serviceType || ''
	form.location = service.location || ''
	form.coverMediaUrl = service.coverMediaUrl || ''
	form.publishedAt = toLocalDateTime(service.publishedAt)
	form.active = service.active !== false
	form.ckbContent = {
		title: contentFromResponse(service.contents, 'CKB').title || '',
		description: contentFromResponse(service.contents, 'CKB').description || '',
	}
	form.kmrContent = {
		title: contentFromResponse(service.contents, 'KMR').title || '',
		description: contentFromResponse(service.contents, 'KMR').description || '',
	}
	form.mediaCollections = (service.mediaCollections || []).map((collection, index) => createCollection(collection, index))
}

async function loadService() {
	if (!isEdit.value) return
	fetching.value = true
	try {
		const { data } = await api.get(`/api/v1/services/${route.params.id}`, { _skipCache: true })
		const payload = data?.data ?? data
		applyResponse(payload || {})
	} catch (err) {
		showToast('error', err?.response?.data?.message || err.message || 'بارکردنی زانیاری سەرکەوتوو نەبوو')
	} finally {
		fetching.value = false
	}
}

function addCollection() {
	form.mediaCollections.push(createCollection({}, form.mediaCollections.length))
}

function removeCollection(index) {
	form.mediaCollections.splice(index, 1)
}

function addFile(collection) {
	collection.files.push(createFile({ sortOrder: collection.files.length }))
}

function removeFile(collection, index) {
	collection.files.splice(index, 1)
}

function acceptForTypes(types) {
	if (!types || !types.length) return '*/*'
	const map = { IMAGE: 'image/*', VIDEO: 'video/*', AUDIO: 'audio/*' }
	const accepts = types.map(t => map[t]).filter(Boolean)
	return accepts.length ? accepts.join(',') : '*/*'
}

function inferUploadHint(file) {
	const mime = String(file?.type || '')
	if (mime.startsWith('image/')) return 'image'
	if (mime.startsWith('video/')) return 'video'
	if (mime.startsWith('audio/')) return 'audio'
	return undefined
}

async function uploadCover(event) {
	const file = event.target.files?.[0]
	if (!file) return
	coverUploading.value = true
	try {
		const data = new FormData()
		data.append('file', file)
		const response = await api.post('/api/v1/services/upload', data, {
			headers: { 'Content-Type': 'multipart/form-data' },
			params: inferUploadHint(file) ? { type: inferUploadHint(file) } : undefined,
		})
		const payload = response.data?.data ?? response.data
		form.coverMediaUrl = payload?.fileUrl || ''
		showToast('success', 'کاڤەر بارکرا ✓')
	} catch (err) {
		showToast('error', err?.response?.data?.message || 'بارکردنی کاڤەر سەرکەوتوو نەبوو')
	} finally {
		coverUploading.value = false
		event.target.value = ''
	}
}

async function uploadCollectionFiles(event, collection) {
	const files = Array.from(event.target.files || [])
	if (!files.length) return
	collection._uploading = true

	try {
		const data = new FormData()
		files.forEach(file => data.append('files', file))
		const response = await api.post('/api/v1/services/upload/multiple', data, {
			headers: { 'Content-Type': 'multipart/form-data' },
		})
		const payload = Array.isArray(response.data?.data) ? response.data.data : (Array.isArray(response.data) ? response.data : [])

		payload.forEach((item, index) => {
			collection.files.push(createFile({
				fileUrl: item.fileUrl,
				sortOrder: collection.files.length + index,
				fileFormat: item.fileFormat,
				resolution: item.resolution,
				formattedDuration: item.formattedDuration,
				codec: item.codec,
				bitrateKbps: item.bitrateKbps,
				formattedFileSize: item.formattedFileSize,
			}))
		})

		showToast('success', 'فایلەکان بارکران ✓')
	} catch (err) {
		showToast('error', err?.response?.data?.message || 'بارکردنی فایلەکان سەرکەوتوو نەبوو')
	} finally {
		collection._uploading = false
		event.target.value = ''
	}
}

async function uploadThumbnail(event, file) {
	const image = event.target.files?.[0]
	if (!image) return
	file._thumbUploading = true
	try {
		const data = new FormData()
		data.append('file', image)
		const response = await api.post('/api/v1/services/upload', data, {
			headers: { 'Content-Type': 'multipart/form-data' },
			params: { type: 'image' },
		})
		const payload = response.data?.data ?? response.data
		file.thumbnailUrl = payload?.fileUrl || ''
		showToast('success', 'thumbnail بارکرا ✓')
	} catch (err) {
		showToast('error', err?.response?.data?.message || 'بارکردنی thumbnail سەرکەوتوو نەبوو')
	} finally {
		file._thumbUploading = false
		event.target.value = ''
	}
}

function collectionHasAnyData(collection) {
	return hasText(collection.collectionName) || collection.files.some(fileHasAnyData)
}

function fileHasAnyData(file) {
	return hasText(file.fileUrl)
		|| hasText(file.thumbnailUrl)
		|| hasText(file.ckbContent.title)
		|| hasText(file.ckbContent.caption)
		|| hasText(file.ckbContent.description)
		|| hasText(file.kmrContent.title)
		|| hasText(file.kmrContent.caption)
		|| hasText(file.kmrContent.description)
}

function collectionError(index) {
	return errors.value[`collection-${index}`]
}

function fileError(collectionIndex, fileIndex) {
	return errors.value[`file-${collectionIndex}-${fileIndex}`]
}

function validate() {
	const next = {}

	if (!hasText(form.serviceType)) next.serviceType = 'جۆری خزمەتگوزاری پێویستە'
	if (!hasText(form.ckbContent.title)) next.ckbTitle = 'ناونیشانی سۆرانی پێویستە'

	const hasKmrContent = hasText(form.kmrContent.title) || hasText(form.kmrContent.description)
	if (hasKmrContent && !hasText(form.kmrContent.title)) next.kmrTitle = 'کاتێک ناوەڕۆکی کرمانجی دەنووسی، ناونیشانیش پێویستە'

	form.mediaCollections.forEach((collection, collectionIndex) => {
		if (!collectionHasAnyData(collection)) return

		if (!hasText(collection.collectionName)) {
			next[`collection-${collectionIndex}`] = 'کاتێک کۆمەڵە بەکار دەهێنی، ناوی کۆمەڵە پێویستە'
		}

		collection.files.forEach((file, fileIndex) => {
			if (!fileHasAnyData(file)) return
			if (!hasText(file.fileUrl)) {
				next[`file-${collectionIndex}-${fileIndex}`] = 'هەر فایلێک دەبێت fileUrl هەبێت'
			}
		})
	})

	errors.value = next

	if (next.ckbTitle) activeLang.value = 'CKB'
	else if (next.kmrTitle) activeLang.value = 'KMR'

	return !Object.keys(next).length
}

function buildFileContentPayload(content) {
	const payload = {
		caption: trimOrNull(content.caption),
		title: trimOrNull(content.title),
		description: trimOrNull(content.description),
	}

	return payload.caption || payload.title || payload.description ? payload : null
}

function buildRequest() {
	const contents = [
		{
			languageCode: 'CKB',
			title: form.ckbContent.title.trim(),
			description: trimOrNull(form.ckbContent.description),
		},
	]

	if (hasText(form.kmrContent.title) || hasText(form.kmrContent.description)) {
		contents.push({
			languageCode: 'KMR',
			title: form.kmrContent.title.trim(),
			description: trimOrNull(form.kmrContent.description),
		})
	}

	const mediaCollections = form.mediaCollections
		.filter(collectionHasAnyData)
		.map((collection, collectionIndex) => ({
			collectionName: collection.collectionName.trim(),
			mediaTypes: collection.mediaTypes,
			sortOrder: normalizeOrder(collection.sortOrder, collectionIndex),
			files: collection.files
				.filter(fileHasAnyData)
				.map((file, fileIndex) => ({
					fileUrl: file.fileUrl.trim(),
					thumbnailUrl: trimOrNull(file.thumbnailUrl),
					ckbContent: buildFileContentPayload(file.ckbContent),
					kmrContent: buildFileContentPayload(file.kmrContent),
					sortOrder: normalizeOrder(file.sortOrder, fileIndex),
				})),
		}))

	return {
		serviceType: form.serviceType.trim(),
		location: trimOrNull(form.location),
		coverMediaUrl: trimOrNull(form.coverMediaUrl),
		publishedAt: toBackendDateTime(form.publishedAt),
		contents,
		mediaCollections,
	}
}

async function submit() {
	if (!validate()) {
		window.scrollTo({ top: 0, behavior: 'smooth' })
		showToast('error', 'تکایە خانە پێویستەکان پڕبکەرەوە')
		return
	}

	saving.value = true

	try {
		const payload = buildRequest()
		const response = isEdit.value
			? await api.put(`/api/v1/services/${route.params.id}`, payload)
			: await api.post('/api/v1/services', payload)

		const saved = response.data?.data ?? response.data
		const savedId = saved?.id || route.params.id

		if (savedId && saved?.active !== form.active) {
			await api.patch(`/api/v1/services/${savedId}/active`, null, {
				params: { value: form.active },
			})
		}

		showToast('success', isEdit.value ? 'خزمەتگوزارییەکە نوێکرایەوە ✓' : 'خزمەتگوزارییەکە دروستکرا ✓')
		setTimeout(() => {
			router.push('/admin/services')
		}, form.active ? 1000 : 1400)
	} catch (err) {
		showToast('error', err?.response?.data?.message || err.message || 'هەڵەیەک ڕوویدا')
	} finally {
		saving.value = false
	}
}

async function doDelete() {
	if (!window.confirm(`دڵنیای لە سڕینەوەی خزمەتگوزاری #${route.params.id}؟`)) return
	try {
		await api.delete(`/api/v1/services/${route.params.id}`)
		showToast('success', 'سڕایەوە ✓')
		setTimeout(() => {
			router.push('/admin/services')
		}, 800)
	} catch (err) {
		showToast('error', err?.response?.data?.message || 'سڕینەوە سەرکەوتوو نەبوو')
	}
}

function filePreviewUrl(file) {
	return file.thumbnailUrl || file.fileUrl || ''
}

function isImageUrl(url) {
	return /\.(avif|jpe?g|png|gif|svg|webp)(\?|#|$)/i.test(String(url || ''))
}

function isVideoUrl(url) {
	return /\.(mp4|mov|m4v|webm|avi|mkv)(\?|#|$)/i.test(String(url || ''))
}

const TYPE_LABELS = { IMAGE: 'وێنە', VIDEO: 'ڤیدیۆ', AUDIO: 'دەنگ' }
const TYPE_ICONS  = { IMAGE: '🖼️', VIDEO: '🎬', AUDIO: '🎧' }

function mediaTypesLabel(types) {
	if (!types || !types.length) return 'میدیا'
	return types.map(t => TYPE_LABELS[t] || t).join(' · ')
}

function mediaTypeIcon(value) {
	return TYPE_ICONS[value] || '📦'
}

function inferFileIcon(file) {
	const url = String(file.fileUrl || '')
	if (/\.(jpe?g|png|gif|webp|svg|bmp|avif)(\?|$)/i.test(url)) return '🖼️'
	if (/\.(mp4|webm|mov|avi|mkv)(\?|$)/i.test(url)) return '🎬'
	if (/\.(mp3|wav|ogg|aac|flac|m4a|opus)(\?|$)/i.test(url)) return '🎧'
	return '📦'
}

function showToast(type, msg) {
	toast.value = { show: true, type, msg }
	setTimeout(() => {
		toast.value.show = false
	}, 3500)
}

onMounted(loadService)
</script>

<style scoped>
.sed { direction: rtl; max-width: 1280px; margin: 0 auto; }
.sed__head { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
.sed__back { display: inline-flex; align-items: center; gap: .4rem; text-decoration: none; color: var(--muted, #767571); font-weight: 700; font-size: .9rem; padding: .45rem .7rem; border-radius: 10px; background: var(--white, #fff); border: 1px solid var(--border, #E0DFDC); transition: all .15s; }
.sed__back:hover { border-color: #8C1515; color: #8C1515; }
.sed__title { margin: 0; font-weight: 900; font-size: clamp(1.2rem, 2vw, 1.7rem); color: var(--text, #2E2D29); }
.sed__sub { margin: .15rem 0 0; color: var(--muted, #767571); font-weight: 600; font-size: .85rem; }
.sed__layout { display: grid; grid-template-columns: minmax(0, 1fr) 320px; gap: 1.2rem; align-items: start; }
@media (max-width: 980px) { .sed__layout { grid-template-columns: 1fr; } }
.col-main { display: flex; flex-direction: column; gap: 1rem; }
.col-side { display: flex; flex-direction: column; gap: 1rem; }

.lang-switcher { display: flex; gap: .3rem; margin-right: auto; background: #f0eeeb; border-radius: 12px; padding: .25rem; }
.lang-btn { display: inline-flex; align-items: center; gap: .4rem; padding: .4rem .9rem; border-radius: 9px; border: none; background: transparent; font-weight: 800; font-size: .85rem; color: var(--muted, #767571); cursor: pointer; transition: all .18s; font: inherit; }
.lang-btn--active { background: #fff; color: var(--text, #2E2D29); box-shadow: 0 2px 8px rgba(0,0,0,.08); }
.lang-btn__dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }
.lang-btn__dot--ckb { background: #8C1515; }
.lang-btn__dot--kmr { background: #1d6bbf; }

.card { background: var(--white, #fff); border: 1px solid var(--border, #E0DFDC); border-radius: 16px; padding: 1.25rem; box-shadow: 0 4px 16px rgba(0,0,0,.03); }
.card--sticky { position: sticky; top: 1rem; }
.card__hd { display: flex; align-items: center; gap: .5rem; font-weight: 800; color: var(--text, #2E2D29); margin-bottom: 1rem; font-size: .95rem; padding-bottom: .7rem; border-bottom: 1px solid #f0eeeb; flex-wrap: wrap; }
.card__hd-ico { font-size: 1.1rem; }
.card__hd-lang { font-size: .72rem; font-weight: 800; padding: .15rem .5rem; border-radius: 6px; }
.card__hd-lang--ckb { background: #fef2f2; color: #8C1515; }
.card__hd-lang--kmr { background: #eff6ff; color: #1d6bbf; }
.card__hd-hint { font-size: .72rem; font-weight: 700; color: var(--muted, #767571); background: #f0eeeb; padding: .15rem .5rem; border-radius: 6px; }
.card__hd-badge { width: 24px; height: 24px; border-radius: 999px; display: inline-flex; align-items: center; justify-content: center; background: #8C1515; color: #fff; font-size: .75rem; font-weight: 900; }

.field { margin-bottom: .85rem; }
.field--dense { margin-bottom: .55rem; }
.field--sort { max-width: 92px; }
.field--full { grid-column: 1 / -1; }
.lbl { display: flex; align-items: center; gap: .4rem; font-weight: 700; color: var(--text, #2E2D29); margin-bottom: .3rem; font-size: .85rem; }
.lbl--req::after { content: ' *'; color: #8C1515; font-weight: 800; }
.lbl__lang { font-size: .7rem; font-weight: 800; padding: .1rem .4rem; border-radius: 5px; }
.lbl__lang--ckb { background: #fef2f2; color: #8C1515; }
.lbl__lang--kmr { background: #eff6ff; color: #1d6bbf; }
.inp { width: 100%; padding: .65rem .85rem; border: 1.5px solid var(--border, #E0DFDC); border-radius: 10px; font: inherit; color: var(--text, #2E2D29); background: var(--white, #fff); transition: border-color .2s; box-sizing: border-box; }
.inp:focus { outline: none; border-color: #8C1515; }
.inp--err { border-color: #dc2626; }
.inp--sm { padding: .52rem .75rem; font-size: .84rem; }
.ta { resize: vertical; min-height: 110px; line-height: 1.75; }
.ta--sm { min-height: 86px; }
.err { color: #dc2626; font-size: .82rem; font-weight: 600; margin-top: .25rem; }
.field__hint { color: var(--muted, #767571); font-size: .8rem; margin-top: .25rem; }
.mono { font-family: monospace; }

.two-grid { display: grid; grid-template-columns: 1fr 1fr; gap: .75rem 1rem; }
.three-grid { display: grid; grid-template-columns: 1.6fr 1fr .7fr; gap: .75rem; }
@media (max-width: 760px) { .two-grid, .three-grid { grid-template-columns: 1fr; } }

.media-type-checks { display: flex; gap: .5rem; flex-wrap: wrap; }
.media-type-check { display: inline-flex; align-items: center; gap: .4rem; padding: .5rem .85rem; border-radius: 10px; border: 1.5px solid var(--border, #E0DFDC); background: #fff; cursor: pointer; transition: all .15s; user-select: none; }
.media-type-check:has(:checked) { border-color: #8C1515; background: #fef2f2; }
.media-type-check__input { accent-color: #8C1515; width: 16px; height: 16px; cursor: pointer; }
.media-type-check__label { font-weight: 700; font-size: .85rem; color: var(--text, #2E2D29); pointer-events: none; }

.fill-status { display: flex; gap: 1rem; margin-top: .75rem; padding: .6rem .75rem; border-radius: 10px; background: #FAFAF9; border: 1px solid #f0eeeb; flex-wrap: wrap; }
.fill-status__item { display: flex; align-items: center; gap: .4rem; font-size: .78rem; font-weight: 700; color: var(--muted, #767571); }
.fill-status__item--ok { color: #065f46; }
.fill-status__dot { width: 7px; height: 7px; border-radius: 50%; background: #d1d5db; }
.fill-status__item--ok .fill-status__dot { background: #10b981; }

.cover-field { display: flex; flex-direction: column; gap: .8rem; }
.cover-preview { position: relative; border-radius: 16px; overflow: hidden; border: 2px dashed #dfdad2; background: #FAFAF9; min-height: 220px; display: flex; align-items: center; justify-content: center; }
.cover-preview--empty { border-style: dashed; }
.cover-preview__media { width: 100%; height: 260px; object-fit: cover; display: block; }
.cover-preview__placeholder { display: flex; flex-direction: column; align-items: center; gap: .5rem; color: var(--muted, #767571); font-weight: 700; }
.cover-preview__remove { position: absolute; top: .7rem; left: .7rem; width: 30px; height: 30px; border-radius: 9px; background: rgba(220,38,38,.9); border: none; color: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; }
.cover-input-row { display: flex; gap: .55rem; }
@media (max-width: 640px) { .cover-input-row { flex-direction: column; } }

.upload-btn { display: inline-flex; align-items: center; gap: .4rem; padding: .62rem .95rem; border-radius: 10px; background: #FAFAF9; border: 1.5px solid var(--border, #E0DFDC); font-weight: 700; font-size: .85rem; color: var(--muted, #767571); cursor: pointer; transition: all .15s; white-space: nowrap; font: inherit; flex-shrink: 0; }
.upload-btn:hover:not(.upload-btn--loading) { border-color: #8C1515; color: #8C1515; background: #faf0f0; }
.upload-btn--loading { opacity: .7; cursor: not-allowed; pointer-events: none; }
.upload-btn--compact { padding: .55rem .7rem; }

.collection-empty { padding: .95rem 1rem; border-radius: 14px; background: #FAFAF9; border: 1px dashed #d6d3d1; color: var(--muted, #767571); font-weight: 700; }
.collection-empty--inner { margin-top: .5rem; }
.collection-list { display: flex; flex-direction: column; gap: 1rem; margin-bottom: 1rem; }
.collection-card { border: 1px solid #ece8e1; border-radius: 18px; overflow: hidden; background: #fff; }
.collection-card__head { display: flex; align-items: center; justify-content: space-between; gap: .75rem; padding: 1rem; border-bottom: 1px solid #f0eeeb; background: #FAFAF9; }
.collection-card__title-wrap { display: flex; align-items: center; gap: .8rem; }
.collection-card__seq { width: 32px; height: 32px; border-radius: 10px; background: #8C1515; color: #fff; display: inline-flex; align-items: center; justify-content: center; font-weight: 900; }
.collection-card__title { margin: 0 0 .15rem; color: var(--text, #2E2D29); font-size: 1rem; font-weight: 900; }
.collection-card__meta { margin: 0; color: var(--muted, #767571); font-size: .78rem; font-weight: 700; }
.collection-card__actions { display: flex; gap: .35rem; }
.collection-card__body { padding: 1rem; }
.collection-toolbar { display: flex; gap: .6rem; align-items: center; flex-wrap: wrap; margin: .4rem 0 1rem; }

.mini-btn { width: 30px; height: 30px; border-radius: 9px; border: 1px solid #e7e2da; background: #fff; display: flex; align-items: center; justify-content: center; color: var(--muted, #767571); cursor: pointer; }
.mini-btn--danger { color: #dc2626; }

.file-list { display: flex; flex-direction: column; gap: .85rem; }
.file-card { border: 1px solid #f0eeeb; border-radius: 16px; padding: .9rem; background: #fff; }
.file-card__top { display: grid; grid-template-columns: 110px minmax(0, 1fr) 32px; gap: .75rem; align-items: start; }
@media (max-width: 760px) { .file-card__top { grid-template-columns: 1fr; } }
.file-card__preview { width: 110px; height: 110px; border-radius: 14px; overflow: hidden; background: #f5f3ef; display: flex; align-items: center; justify-content: center; }
.file-card__preview img, .file-card__preview video { width: 100%; height: 100%; object-fit: cover; display: block; }
.file-card__fallback { font-size: 1.7rem; }
.file-card__top-meta { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) 88px; gap: .65rem; }
@media (max-width: 980px) { .file-card__top-meta { grid-template-columns: 1fr; } }
.thumb-row { display: flex; gap: .5rem; align-items: center; }
.file-card__remove { width: 32px; height: 32px; border-radius: 9px; border: 1px solid #fecaca; background: #fff; color: #dc2626; display: flex; align-items: center; justify-content: center; cursor: pointer; }
.file-card__meta-line { display: flex; gap: .35rem; flex-wrap: wrap; margin: .75rem 0; }
.file-card__meta-line span { padding: .15rem .45rem; border-radius: 999px; background: #f5f3ef; color: #6b7280; font-size: .72rem; font-weight: 800; }
.file-card__content { display: grid; grid-template-columns: 1fr 1fr; gap: .75rem; }
@media (max-width: 760px) { .file-card__content { grid-template-columns: 1fr; } }

.toggle-row { display: flex; align-items: center; justify-content: space-between; gap: .75rem; padding: .85rem .95rem; border-radius: 14px; background: #FAFAF9; border: 1px solid #f0eeeb; margin-bottom: 1rem; }
.toggle-row strong { display: block; color: var(--text, #2E2D29); font-size: .9rem; }
.toggle-row small { display: block; color: var(--muted, #767571); margin-top: .15rem; }
.toggle-row__input { width: 18px; height: 18px; accent-color: #8C1515; }

.publish-info { margin-bottom: 1rem; }
.publish-info__row { display: flex; justify-content: space-between; align-items: center; padding: .45rem 0; font-size: .85rem; border-bottom: 1px solid #f0eeeb; color: var(--muted, #767571); gap: .5rem; }
.publish-info__row strong { color: var(--text, #2E2D29); }
.inactive-note { margin-bottom: 1rem; padding: .8rem .9rem; border-radius: 12px; background: #fff7ed; color: #92400e; border: 1px solid #fed7aa; font-size: .8rem; font-weight: 700; line-height: 1.7; }
.publish-actions { display: flex; flex-direction: column; gap: .5rem; }

.btn { display: inline-flex; align-items: center; justify-content: center; gap: .4rem; text-decoration: none; border-radius: 12px; padding: .75rem 1rem; font-weight: 900; border: 1px solid transparent; transition: .18s ease; white-space: nowrap; cursor: pointer; font: inherit; }
.btn:hover:not(:disabled) { transform: translateY(-1px); }
.btn--primary { background: #8C1515; color: #fff; box-shadow: 0 10px 24px rgba(140,21,21,.18); }
.btn--danger { background: #fff; color: #dc2626; border-color: #fecaca; }
.btn--ghost { background: #fff; color: #6E6B66; border-color: #E0DFDC; }
.btn--outline { background: #fff; color: #8C1515; border-color: #d9c4c4; }
.btn--full { width: 100%; }
.btn--sm { padding: .58rem .9rem; font-size: .82rem; }

.toast { position: fixed; top: 1.2rem; left: 50%; transform: translateX(-50%); z-index: 9999; padding: .7rem 1.2rem; border-radius: 12px; font-weight: 700; display: flex; align-items: center; gap: .5rem; box-shadow: 0 12px 32px rgba(0,0,0,.12); }
.toast--success { background: #065f46; color: #fff; }
.toast--error { background: #8C1515; color: #fff; }
.toast__ico { font-size: 1.1rem; }

.loading-bar { height: 3px; border-radius: 3px; margin: 2rem 0; background: #e8e5e1; overflow: hidden; position: relative; }
.loading-bar::after { content: ''; position: absolute; inset: 0; background: #8C1515; border-radius: 3px; animation: bar-slide 1.2s ease infinite; }
@keyframes bar-slide { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }

.spinner { width: 16px; height: 16px; border-radius: 50%; border: 2px solid rgba(255,255,255,.3); border-top-color: #fff; animation: spin .7s linear infinite; }
.spinner--dark { border-color: rgba(0,0,0,.15); border-top-color: var(--muted, #767571); }
.spinner--tiny { width: 12px; height: 12px; border-width: 1.7px; }
@keyframes spin { to { transform: rotate(360deg); } }

.toast-enter-active, .toast-leave-active { transition: all .35s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translate(-50%, -20px); }

@media (max-width: 640px) {
	.sed__head { align-items: flex-start; }
	.lang-switcher { width: 100%; justify-content: center; margin-right: 0; }
	.card { padding: 1rem; }
}
</style>
