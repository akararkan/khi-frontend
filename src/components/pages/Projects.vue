<template>
  <main id="main-content" class="projects">
    <!-- ========================================
         STANFORD-INSPIRED HERO SECTION
         ======================================== -->
    <header class="hero">
      <div class="hero__bg" :style="{ backgroundImage: `url(${heroImage})` }"></div>
      <div class="hero__overlay"></div>

      <div class="container hero__content">
        <div class="heroCard">
          <div class="heroCard__badge">
            <span class="badge-icon">✨</span>
            <span>پڕۆژەکانی ناوەندی میراتی کوردی</span>
          </div>

          <h1 class="heroCard__title">
            ئەرشیڤی دیجیتاڵی
            <span class="title-accent">میراتی کوردی</span>
          </h1>

          <p class="heroCard__sub">
            پاراستن و بڵاوکردنەوەی میراتی کلتووری کوردی بۆ نەوەکانی داهاتوو
          </p>

          <div class="heroCard__stats">
            <div class="stat">
              <div class="stat__value">{{ totalElements || 0 }}</div>
              <div class="stat__label">پڕۆژەی کۆ</div>
            </div>
            <div class="stat-divider"></div>
            <div class="stat">
              <div class="stat__value">{{ projects.length }}</div>
              <div class="stat__label">نیشاندراو</div>
            </div>
            <div class="stat-divider"></div>
            <div class="stat">
              <div class="stat__value">{{ calculateTotalMedia() }}</div>
              <div class="stat__label">میدیا</div>
            </div>
          </div>

          <div class="heroCard__actions" v-if="tagFilter !== 'all'">
            <div class="activeFilter">
              <span class="activeFilter__icon">🔍</span>
              <span class="activeFilter__text">فلتەر: <strong>#{{ tagFilter }}</strong></span>
              <button 
                class="activeFilter__remove" 
                @click="clearTagFilter" 
                aria-label="لابردنی فلتەر"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- ========================================
         PROJECTS SECTION
         ======================================== -->
    <section class="section">
      <div class="container">
        
        <!-- Controls Bar -->
        <div class="controlsBar">
          <div class="controlsBar__left">
            <div class="statusBadge" :class="statusClass">
              <span class="statusBadge__icon">
                <span v-if="loading" class="spinner"></span>
                <span v-else-if="error">⚠️</span>
                <span v-else>✓</span>
              </span>
              <span class="statusBadge__text">
                <span v-if="loading">بارکردن...</span>
                <span v-else-if="error">{{ error }}</span>
                <span v-else>{{ filteredProjects.length }} پڕۆژە نیشاندراوە</span>
              </span>
            </div>
          </div>

          <div class="controlsBar__right">
            <div class="sortControl">
              <label class="sortControl__label">ڕیزکردن بەپێی:</label>
              <select v-model="sortBy" class="sortControl__select">
                <option value="newest">نوێترین</option>
                <option value="oldest">کۆنترین</option>
                <option value="title_az">ناونیشان (أ-ی)</option>
                <option value="media_desc">زۆرترین میدیا</option>
              </select>
            </div>

            <button 
              class="btnIcon" 
              @click="resetAllFilters"
              aria-label="دووبارەکردنەوە"
              title="دووبارەکردنەوە"
            >
              <span class="btnIcon__icon">🔄</span>
            </button>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="!loading && filteredProjects.length === 0" class="emptyState">
          <div class="emptyState__icon">📭</div>
          <h3 class="emptyState__title">هیچ پڕۆژەیەک نەدۆزرایەوە</h3>
          <p class="emptyState__text">
            تکایە فلتەرێکی تر هەڵبژێرە یان هەموو فلتەرەکان دووبارە بکەرەوە
          </p>
          <button class="btn btn--primary" @click="resetAllFilters">
            <span class="btn__icon">🔄</span>
            <span>دووبارەکردنەوەی فلتەرەکان</span>
          </button>
        </div>

        <!-- Projects Grid -->
        <div v-else class="projectsGrid">
          <article
            v-for="(project, index) in filteredProjects"
            :key="project.id"
            class="projectCard"
            :style="{ animationDelay: `${index * 0.05}s` }"
            tabindex="0"
            @click="openProjectModal(project)"
            @keyup.enter="openProjectModal(project)"
            role="button"
            :aria-label="`بینینی پڕۆژە: ${project.title}`"
          >
            <!-- Card Image with Hover Effect -->
            <div class="projectCard__cover">
              <img
                :src="project.cover.url"
                :alt="project.title"
                loading="lazy"
                class="projectCard__img"
                @error="onCoverError($event)"
              />
              <div class="projectCard__overlay">
                <div class="overlayContent">
                  <span class="overlayContent__icon">👁️</span>
                  <span class="overlayContent__text">بینینی پڕۆژە</span>
                </div>
              </div>
              
              <!-- Type Badge -->
              <div class="typeBadge">
                <span class="typeBadge__icon">{{ getTypeIcon(project.category) }}</span>
                <span class="typeBadge__text">{{ project.category }}</span>
              </div>
            </div>

            <!-- Card Content -->
            <div class="projectCard__body">
              <h3 class="projectCard__title">{{ project.title }}</h3>
              
              <p class="projectCard__desc">
                {{ truncateText(project.summary, 100) }}
              </p>

              <!-- Meta Info -->
              <div class="projectCard__meta">
                <div class="metaItem metaItem--primary">
                  <span class="metaItem__icon">📅</span>
                  <span class="metaItem__text">{{ project.publishedAt }}</span>
                </div>
                
                <div class="metaItem" v-if="project.location">
                  <span class="metaItem__icon">📍</span>
                  <span class="metaItem__text">{{ truncateText(project.location, 20) }}</span>
                </div>
                
                <div class="metaItem">
                  <span class="metaItem__icon">🎬</span>
                  <span class="metaItem__text">{{ project.media.length }} میدیا</span>
                </div>
                
                <!-- Language Badge -->
                <div class="metaItem metaItem--language">
                  <span class="metaItem__icon">🗣️</span>
                  <span class="metaItem__text">{{ getLanguageName(project.language) }}</span>
                </div>
              </div>

              <!-- Tags -->
              <div v-if="project.tags.length > 0" class="projectCard__tags">
                <button
                  v-for="tag in project.tags.slice(0, 3)"
                  :key="tag"
                  class="tagBtn"
                  type="button"
                  @click.stop="filterByTag(tag)"
                  :aria-label="`فلتەرکردن بە تاگی: ${tag}`"
                >
                  #{{ tag }}
                </button>
                <span v-if="project.tags.length > 3" class="tagBtn tagBtn--more">
                  +{{ project.tags.length - 3 }}
                </span>
              </div>
            </div>

            <!-- Card Footer -->
            <div class="projectCard__footer">
              <div class="viewLink">
                <span class="viewLink__text">بینینی وردەکاری</span>
                <span class="viewLink__arrow">←</span>
              </div>
            </div>
          </article>
        </div>

        <!-- Pagination -->
        <div class="pagination" v-if="totalPages > 1 && !loading">
          <button
            class="pagination__btn"
            :disabled="currentPage === 0"
            @click="goToPreviousPage"
            aria-label="لاپەڕەی پێشوو"
          >
            <span class="pagination__icon">←</span>
            <span>پێشوو</span>
          </button>

          <div class="pagination__info">
            <span class="pagination__current">{{ currentPage + 1 }}</span>
            <span class="pagination__divider">/</span>
            <span class="pagination__total">{{ totalPages }}</span>
          </div>

          <button
            class="pagination__btn"
            :disabled="currentPage + 1 >= totalPages"
            @click="goToNextPage"
            aria-label="لاپەڕەی دواتر"
          >
            <span>دواتر</span>
            <span class="pagination__icon">→</span>
          </button>
        </div>
      </div>
    </section>

    <!-- ========================================
         PROJECT DETAILS MODAL
         ======================================== -->
    <Teleport to="body">
      <transition name="modal">
        <div
          v-if="activeProject"
          class="modal"
          @click.self="closeProjectModal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div class="modalPanel">
            
            <!-- Close Button -->
            <button 
              class="modalClose" 
              @click="closeProjectModal" 
              aria-label="داخستن"
            >
              <span class="modalClose__icon">✕</span>
            </button>

            <!-- Modal Header -->
            <div class="modalHeader">
              <div class="modalHeader__badges">
                <span class="badge badge--type">
                  <span class="badge__icon">{{ getTypeIcon(activeProject.category) }}</span>
                  <span>{{ activeProject.category }}</span>
                </span>
                <span class="badge badge--date">
                  <span class="badge__icon">📅</span>
                  <span>{{ activeProject.publishedAt }}</span>
                </span>
                <span class="badge" v-if="activeProject.location">
                  <span class="badge__icon">📍</span>
                  <span>{{ activeProject.location }}</span>
                </span>
                <span class="badge">
                  <span class="badge__icon">🎬</span>
                  <span>{{ activeProject.media.length }} میدیا</span>
                </span>
                <span class="badge badge--language">
                  <span class="badge__icon">🗣️</span>
                  <span>{{ getLanguageName(activeProject.language) }}</span>
                </span>
              </div>

              <h2 id="modal-title" class="modalHeader__title">
                {{ activeProject.title }}
              </h2>
              
              <p class="modalHeader__desc">{{ activeProject.summary }}</p>

              <!-- Tags in Modal -->
              <div v-if="activeProject.tags.length > 0" class="modalHeader__tags">
                <button
                  v-for="tag in activeProject.tags"
                  :key="tag"
                  class="modalTag"
                  type="button"
                  @click="filterFromModal(tag)"
                >
                  #{{ tag }}
                </button>
              </div>
            </div>

            <!-- Media Gallery -->
            <div class="mediaGallery">
              
              <!-- Main Preview -->
              <div class="mediaPreview">
                
                <!-- IMAGE -->
                <div v-if="selectedMedia?.mediaType === 'image'" class="mediaPreview__content">
                  <div class="imageViewer">
                    <img
                      class="imageViewer__img"
                      :src="selectedMedia.url"
                      :alt="selectedMedia.caption || activeProject.title"
                      :style="{ transform: `scale(${zoomLevel})` }"
                      @error="onPreviewError($event)"
                      @click="toggleFullscreen"
                    />
                    <div class="imageViewer__controls">
                      <button 
                        class="controlBtn" 
                        @click="zoomOut" 
                        :disabled="zoomLevel <= 1"
                        title="Zoom Out"
                      >
                        <span>−</span>
                      </button>
                      <button 
                        class="controlBtn" 
                        @click="zoomIn" 
                        :disabled="zoomLevel >= 3"
                        title="Zoom In"
                      >
                        <span>+</span>
                      </button>
                      <button 
                        class="controlBtn" 
                        @click="resetZoom" 
                        :disabled="zoomLevel === 1"
                        title="Reset"
                      >
                        <span>⟲</span>
                      </button>
                      <button 
                        class="controlBtn" 
                        @click="toggleFullscreen"
                        title="پڕ کردنی شاشە"
                      >
                        <span>⛶</span>
                      </button>
                    </div>
                  </div>
                </div>

                <!-- VIDEO WITH CUSTOM CONTROLS -->
                <div v-else-if="selectedMedia?.mediaType === 'video'" class="mediaPreview__content">
                  <div class="videoPlayer" ref="videoPlayerContainer">
                    <video
                      ref="videoPlayer"
                      class="videoPlayer__element"
                      :poster="activeProject.cover.url"
                      @loadedmetadata="onVideoLoaded"
                      @timeupdate="onVideoTimeUpdate"
                      @play="isVideoPlaying = true"
                      @pause="isVideoPlaying = false"
                      @ended="isVideoPlaying = false"
                      @click="toggleVideoPlay"
                    >
                      <source :src="selectedMedia.url" type="video/mp4" />
                      وێبگەڕەکەت پشتگیری ئەم ڤیدیۆیە ناکات.
                    </video>
                    
                    <!-- Custom Video Controls -->
                    <div class="videoControls">
                      <!-- Progress Bar -->
                      <div class="videoControls__progress" @click="seekVideo">
                        <div class="progressBar">
                          <div 
                            class="progressBar__filled" 
                            :style="{ width: videoProgress + '%' }"
                          ></div>
                          <div 
                            class="progressBar__handle" 
                            :style="{ left: videoProgress + '%' }"
                          ></div>
                        </div>
                      </div>
                      
                      <!-- Bottom Controls -->
                      <div class="videoControls__bottom">
                        <div class="videoControls__left">
                          <button 
                            class="videoBtn videoBtn--play" 
                            @click="toggleVideoPlay"
                            :aria-label="isVideoPlaying ? 'وەستان' : 'لێدان'"
                          >
                            <span v-if="isVideoPlaying">⏸</span>
                            <span v-else>▶</span>
                          </button>
                          
                          <div class="videoTime">
                            <span class="videoTime__current">{{ formatTime(videoCurrentTime) }}</span>
                            <span class="videoTime__divider">/</span>
                            <span class="videoTime__duration">{{ formatTime(videoDuration) }}</span>
                          </div>
                          
                          <!-- Volume Control -->
                          <div class="volumeControl">
                            <button 
                              class="videoBtn videoBtn--volume" 
                              @click="toggleMute"
                              :aria-label="isVideoMuted ? 'کردنەوەی دەنگ' : 'بێدەنگکردن'"
                            >
                              <span v-if="isVideoMuted || videoVolume === 0">🔇</span>
                              <span v-else-if="videoVolume < 0.5">🔉</span>
                              <span v-else>🔊</span>
                            </button>
                            <input
                              type="range"
                              class="volumeSlider"
                              min="0"
                              max="100"
                              :value="videoVolume * 100"
                              @input="changeVideoVolume"
                              aria-label="ئاستی دەنگ"
                            />
                          </div>
                        </div>
                        
                        <div class="videoControls__right">
                          <button 
                            class="videoBtn" 
                            @click="toggleVideoFullscreen"
                            aria-label="پڕکردنی شاشە"
                          >
                            <span>⛶</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- AUDIO -->
                <div v-else-if="selectedMedia?.mediaType === 'audio'" class="mediaPreview__content">
                  <div class="audioPlayer">
                    <div class="audioPlayer__artwork">
                      <img 
                        :src="activeProject.cover.url" 
                        :alt="activeProject.title"
                        @error="onCoverError($event)"
                      />
                    </div>
                    <div class="audioPlayer__info">
                      <h4 class="audioPlayer__title">
                        {{ selectedMedia.caption || 'Audio Track' }}
                      </h4>
                      <p class="audioPlayer__desc">
                        {{ selectedMedia.note || selectedMedia.textBody || 'بێ شرۆڤە' }}
                      </p>
                    </div>
                    
                    <!-- Custom Audio Controls -->
                    <div class="customAudioPlayer">
                      <audio 
                        ref="audioPlayer"
                        @loadedmetadata="onAudioLoaded"
                        @timeupdate="onAudioTimeUpdate"
                        @play="isAudioPlaying = true"
                        @pause="isAudioPlaying = false"
                        @ended="isAudioPlaying = false"
                      >
                        <source :src="selectedMedia.url" type="audio/mpeg" />
                      </audio>
                      
                      <!-- Progress Bar -->
                      <div class="audioProgress" @click="seekAudio">
                        <div class="audioProgress__bar">
                          <div 
                            class="audioProgress__filled" 
                            :style="{ width: audioProgress + '%' }"
                          ></div>
                        </div>
                      </div>
                      
                      <!-- Controls -->
                      <div class="audioControls">
                        <button 
                          class="audioBtn audioBtn--play" 
                          @click="toggleAudioPlay"
                          :aria-label="isAudioPlaying ? 'وەستان' : 'لێدان'"
                        >
                          <span v-if="isAudioPlaying">⏸</span>
                          <span v-else>▶</span>
                        </button>
                        
                        <div class="audioTime">
                          <span>{{ formatTime(audioCurrentTime) }}</span>
                          <span class="audioTime__divider">/</span>
                          <span>{{ formatTime(audioDuration) }}</span>
                        </div>
                        
                        <!-- Volume Control -->
                        <div class="volumeControl volumeControl--audio">
                          <button 
                            class="audioBtn audioBtn--volume" 
                            @click="toggleAudioMute"
                            :aria-label="isAudioMuted ? 'کردنەوەی دەنگ' : 'بێدەنگکردن'"
                          >
                            <span v-if="isAudioMuted || audioVolume === 0">🔇</span>
                            <span v-else-if="audioVolume < 0.5">🔉</span>
                            <span v-else>🔊</span>
                          </button>
                          <input
                            type="range"
                            class="volumeSlider"
                            min="0"
                            max="100"
                            :value="audioVolume * 100"
                            @input="changeAudioVolume"
                            aria-label="ئاستی دەنگ"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- DOCUMENT -->
                <div v-else class="mediaPreview__content">
                  <div class="documentPreview">
                    <div class="documentPreview__icon">
                      {{ getMediaIcon(selectedMedia?.mediaType) }}
                    </div>
                    <h4 class="documentPreview__title">
                      {{ selectedMedia?.caption || 'Document' }}
                    </h4>
                    <p class="documentPreview__url">
                      {{ selectedMedia?.url }}
                    </p>
                    <button 
                      class="btn btn--primary" 
                      @click="openInFullscreen(selectedMedia?.url)"
                    >
                      <span class="btn__icon">⛶</span>
                      <span>کردنەوە بە پڕ شاشە</span>
                    </button>
                  </div>
                </div>

                <!-- Caption -->
                <div class="mediaCaption">
                  <h4 class="mediaCaption__title">
                    {{ selectedMedia?.caption || activeProject.title }}
                  </h4>
                  <p class="mediaCaption__text">
                    {{ selectedMedia?.note || selectedMedia?.textBody || activeProject.body }}
                  </p>
                </div>
              </div>

              <!-- Media Sidebar with Type-based Dropdowns -->
              <div class="mediaSidebar">
                <!-- Images Section -->
                <div v-if="getMediasByType('image').length > 0" class="mediaTypeSection">
                  <button 
                    class="mediaTypeToggle"
                    @click="toggleMediaType('image')"
                    :class="{ 'mediaTypeToggle--expanded': expandedMediaTypes.image }"
                  >
                    <span class="mediaTypeToggle__icon">🖼️</span>
                    <span class="mediaTypeToggle__label">وێنەکان</span>
                    <span class="mediaTypeToggle__count">{{ getMediasByType('image').length }}</span>
                    <span class="mediaTypeToggle__arrow">{{ expandedMediaTypes.image ? '▲' : '▼' }}</span>
                  </button>
                  <div 
                    class="mediaTypeList" 
                    v-if="expandedMediaTypes.image"
                  >
                    <button
                      v-for="media in getMediasByType('image')"
                      :key="media.id"
                      class="mediaItem"
                      :class="{ 'mediaItem--active': selectedMedia?.id === media.id }"
                      @click="selectMedia(media)"
                      type="button"
                    >
                      <span class="mediaItem__icon">🖼️</span>
                      <span class="mediaItem__title">{{ media.caption || 'وێنە بێ ناونیشان' }}</span>
                    </button>
                  </div>
                </div>

                <!-- Videos Section -->
                <div v-if="getMediasByType('video').length > 0" class="mediaTypeSection">
                  <button 
                    class="mediaTypeToggle"
                    @click="toggleMediaType('video')"
                    :class="{ 'mediaTypeToggle--expanded': expandedMediaTypes.video }"
                  >
                    <span class="mediaTypeToggle__icon">🎬</span>
                    <span class="mediaTypeToggle__label">ڤیدیۆکان</span>
                    <span class="mediaTypeToggle__count">{{ getMediasByType('video').length }}</span>
                    <span class="mediaTypeToggle__arrow">{{ expandedMediaTypes.video ? '▲' : '▼' }}</span>
                  </button>
                  <div 
                    class="mediaTypeList" 
                    v-if="expandedMediaTypes.video"
                  >
                    <button
                      v-for="media in getMediasByType('video')"
                      :key="media.id"
                      class="mediaItem"
                      :class="{ 'mediaItem--active': selectedMedia?.id === media.id }"
                      @click="selectMedia(media)"
                      type="button"
                    >
                      <span class="mediaItem__icon">🎬</span>
                      <span class="mediaItem__title">{{ media.caption || 'ڤیدیۆ بێ ناونیشان' }}</span>
                    </button>
                  </div>
                </div>

                <!-- Audio Section -->
                <div v-if="getMediasByType('audio').length > 0" class="mediaTypeSection">
                  <button 
                    class="mediaTypeToggle"
                    @click="toggleMediaType('audio')"
                    :class="{ 'mediaTypeToggle--expanded': expandedMediaTypes.audio }"
                  >
                    <span class="mediaTypeToggle__icon">🎵</span>
                    <span class="mediaTypeToggle__label">دەنگەکان</span>
                    <span class="mediaTypeToggle__count">{{ getMediasByType('audio').length }}</span>
                    <span class="mediaTypeToggle__arrow">{{ expandedMediaTypes.audio ? '▲' : '▼' }}</span>
                  </button>
                  <div 
                    class="mediaTypeList" 
                    v-if="expandedMediaTypes.audio"
                  >
                    <button
                      v-for="media in getMediasByType('audio')"
                      :key="media.id"
                      class="mediaItem"
                      :class="{ 'mediaItem--active': selectedMedia?.id === media.id }"
                      @click="selectMedia(media)"
                      type="button"
                    >
                      <span class="mediaItem__icon">🎵</span>
                      <span class="mediaItem__title">{{ media.caption || 'دەنگ بێ ناونیشان' }}</span>
                    </button>
                  </div>
                </div>

                <!-- Documents/Files Section -->
                <div v-if="getMediasByType('document').length + getMediasByType('pdf').length > 0" class="mediaTypeSection">
                  <button 
                    class="mediaTypeToggle"
                    @click="toggleMediaType('document')"
                    :class="{ 'mediaTypeToggle--expanded': expandedMediaTypes.document }"
                  >
                    <span class="mediaTypeToggle__icon">📄</span>
                    <span class="mediaTypeToggle__label">بەڵگەنامەکان</span>
                    <span class="mediaTypeToggle__count">{{ getMediasByType('document').length + getMediasByType('pdf').length }}</span>
                    <span class="mediaTypeToggle__arrow">{{ expandedMediaTypes.document ? '▲' : '▼' }}</span>
                  </button>
                  <div 
                    class="mediaTypeList" 
                    v-if="expandedMediaTypes.document"
                  >
                    <button
                      v-for="media in [...getMediasByType('document'), ...getMediasByType('pdf')]"
                      :key="media.id"
                      class="mediaItem"
                      :class="{ 'mediaItem--active': selectedMedia?.id === media.id }"
                      @click="selectMedia(media)"
                      type="button"
                    >
                      <span class="mediaItem__icon">{{ media.mediaType === 'pdf' ? '📕' : '📄' }}</span>
                      <span class="mediaItem__title">{{ media.caption || 'بەڵگەنامە بێ ناونیشان' }}</span>
                    </button>
                  </div>
                </div>

                <!-- Navigation -->
                <div class="mediaNav">
                  <button 
                    class="mediaNav__btn" 
                    @click="previousMedia" 
                    :disabled="!canGoPreviousMedia"
                  >
                    <span class="mediaNav__icon">←</span>
                    <span>پێشوو</span>
                  </button>
                  <button 
                    class="mediaNav__btn" 
                    @click="nextMedia" 
                    :disabled="!canGoNextMedia"
                  >
                    <span>دواتر</span>
                    <span class="mediaNav__icon">→</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Modal Footer -->
            <div class="modalFooter">
              <button class="btn btn--ghost" @click="closeProjectModal">
                <span class="btn__icon">✕</span>
                <span>داخستن</span>
              </button>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>

    <!-- Fullscreen Overlay -->
    <Teleport to="body">
      <transition name="fullscreen">
        <div v-if="isFullscreen" class="fullscreenOverlay" @click="exitFullscreen">
          <button class="fullscreenClose" @click="exitFullscreen">
            <span>✕</span>
          </button>
          <div class="fullscreenContent" @click.stop>
            <img 
              v-if="fullscreenContent?.type === 'image'" 
              :src="fullscreenContent.url" 
              :alt="fullscreenContent.caption"
              class="fullscreenImage"
            />
            <iframe 
              v-else-if="fullscreenContent?.type === 'document'" 
              :src="fullscreenContent.url" 
              class="fullscreenIframe"
              frameborder="0"
            ></iframe>
          </div>
        </div>
      </transition>
    </Teleport>
  </main>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import axios from 'axios'

import { API_BASE_URL } from '../consts.js'

/* ============================================
   CONFIGURATION
   ============================================ */
const heroImage = 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=2000&q=80'
const fallbackCover = 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1400&q=80'

/* ============================================
   AXIOS INSTANCE
   ============================================ */
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
})

/* ============================================
   STATE
   ============================================ */
const projects = ref([])
const loading = ref(false)
const error = ref('')

// Pagination (backend-driven)
const currentPage = ref(0)
const pageSize = ref(20)
const totalPages = ref(0)
const totalElements = ref(0)

// Filters
const tagFilter = ref('all')
const sortBy = ref('newest')

// Modal
const activeProject = ref(null)
const selectedMedia = ref(null)
const zoomLevel = ref(1)
const isMediaListOpen = ref(true)

// Media sidebar expanded state by type
const expandedMediaTypes = ref({
  image: true,
  video: false,
  audio: false,
  document: false,
  pdf: false,
})

// Video player state
const videoPlayer = ref(null)
const videoPlayerContainer = ref(null)
const isVideoPlaying = ref(false)
const isVideoMuted = ref(false)
const videoVolume = ref(1)
const videoCurrentTime = ref(0)
const videoDuration = ref(0)
const videoProgress = ref(0)

// Audio player state
const audioPlayer = ref(null)
const isAudioPlaying = ref(false)
const isAudioMuted = ref(false)
const audioVolume = ref(1)
const audioCurrentTime = ref(0)
const audioDuration = ref(0)
const audioProgress = ref(0)

// Fullscreen state
const isFullscreen = ref(false)
const fullscreenContent = ref(null)

/* ============================================
   COMPUTED
   ============================================ */
const filteredProjects = computed(() => {
  let list = [...projects.value]

  // Client-side tag filter (backend also filters)
  if (tagFilter.value !== 'all') {
    list = list.filter(p => (p.tags || []).includes(tagFilter.value))
  }

  // Client-side sorting
  switch (sortBy.value) {
    case 'newest':
      list.sort((a, b) => (b.publishedAt || '').localeCompare(a.publishedAt || ''))
      break
    case 'oldest':
      list.sort((a, b) => (a.publishedAt || '').localeCompare(b.publishedAt || ''))
      break
    case 'title_az':
      list.sort((a, b) => a.title.localeCompare(b.title))
      break
    case 'media_desc':
      list.sort((a, b) => (b.media?.length || 0) - (a.media?.length || 0))
      break
  }

  return list
})

const statusClass = computed(() => {
  if (loading.value) return 'statusBadge--loading'
  if (error.value) return 'statusBadge--error'
  return 'statusBadge--success'
})

const canGoPreviousMedia = computed(() => {
  if (!activeProject.value || !selectedMedia.value) return false
  const idx = activeProject.value.media.findIndex(m => m.id === selectedMedia.value.id)
  return idx > 0
})

const canGoNextMedia = computed(() => {
  if (!activeProject.value || !selectedMedia.value) return false
  const idx = activeProject.value.media.findIndex(m => m.id === selectedMedia.value.id)
  return idx < activeProject.value.media.length - 1
})

/* ============================================
   HELPERS
   ============================================ */
function getLanguageName(code) {
  const languages = {
    'CKB': 'کوردی',
    'KMR': 'کورمانجی',
    'AR': 'عربی',
    'EN': 'English'
  }
  return languages[code] || code
}

function isLikelyImageUrl(url) {
  if (!url || typeof url !== 'string') return false
  const u = url.toLowerCase()
  if (u.endsWith('.pdf') || u.endsWith('.mp4') || u.endsWith('.mp3')) return false
  return (
    u.includes('.jpg') ||
    u.includes('.jpeg') ||
    u.includes('.png') ||
    u.includes('.webp') ||
    u.includes('.gif') ||
    u.includes('image')
  )
}

function calculateTotalMedia() {
  return projects.value.reduce((sum, p) => sum + (p.media?.length || 0), 0)
}

function getTypeIcon(type) {
  const icons = {
    'CULTURAL_EVENT': '🎭',
    'RESEARCH': '📚',
    'WORKSHOP': '🎓',
    'EXHIBITION': '🖼️',
    'CONFERENCE': '🎤',
    'PUBLICATION': '📖',
    'DIGITIZATION': '💾',
    'OTHER': '📋'
  }
  return icons[type] || '📋'
}

function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

/* ============================================
   NORMALIZER (UPDATED FOR NEW API)
   ============================================ */
function normalizeProject(p) {
  // Normalize media array
  const media = Array.isArray(p.media) ? [...p.media] : []
  media.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))

  const normalizedMedia = media.map(m => ({
    id: m.id ?? `${m.url}-${m.sortOrder}`,
    mediaType: String(m.mediaType || '').toLowerCase(),
    url: m.url || '',
    caption: m.caption || '',
    sortOrder: m.sortOrder ?? 0,
    textBody: m.textBody || '',
    note: m.note || m.textBody || '',
  }))

  // Cover handling: use backend cover first, fallback to first image
  let coverUrl = p.cover || ''
  
  if (!coverUrl || !isLikelyImageUrl(coverUrl)) {
    const firstImage = normalizedMedia.find(m => m.mediaType === 'image')
    coverUrl = firstImage?.url || fallbackCover
  }

  if (!isLikelyImageUrl(coverUrl)) {
    coverUrl = fallbackCover
  }

  return {
    id: p.id,
    title: p.title || 'بێ ناونیشان',
    summary: p.description || '',
    body: p.content || '',
    publishedAt: formatDate(p.date || p.createdAt),
    category: p.projectType || 'OTHER',
    tags: Array.isArray(p.tags) ? p.tags : [],
    location: p.location || '',
    language: p.language || 'CKB',
    cover: { url: coverUrl },
    media: normalizedMedia.length
      ? normalizedMedia
      : [{ id: 'cover', mediaType: 'image', url: coverUrl, caption: 'Cover' }],
  }
}

function formatDate(v) {
  if (!v) return ''
  const d = new Date(v)
  return isNaN(d.getTime()) ? String(v) : d.toISOString().slice(0, 10)
}

/* ============================================
   API CALLS
   ============================================ */
async function fetchProjects(reset = false) {
  try {
    loading.value = true
    error.value = ''

    if (reset) currentPage.value = 0

    const params = {
      page: currentPage.value,
      size: pageSize.value,
      sort: 'createdAt',
      dir: 'desc'
    }

    // Backend tag search
    if (tagFilter.value !== 'all') {
      params.tags = [tagFilter.value]
    }

    const response = await api.get('/projects/getAll', { params })

    const apiResponse = response.data
    if (!apiResponse || !apiResponse.success) {
      throw new Error(apiResponse?.message || 'فشەلبووی داواکاری')
    }

    const page = apiResponse.data
    const list = Array.isArray(page?.content) ? page.content : []

    projects.value = list.map(normalizeProject)
    totalPages.value = page?.totalPages ?? 1
    totalElements.value = page?.totalElements ?? list.length
  } catch (e) {
    console.error('API Error:', e)
    error.value = e.response?.data?.message || e.message || 'فشەلبووی بارکردنی پڕۆژەکان'
  } finally {
    loading.value = false
  }
}

/* ============================================
   FILTER HANDLERS
   ============================================ */
function filterByTag(tag) {
  tagFilter.value = tag
  fetchProjects(true)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function filterFromModal(tag) {
  closeProjectModal()
  setTimeout(() => filterByTag(tag), 300)
}

function clearTagFilter() {
  tagFilter.value = 'all'
  fetchProjects(true)
}

function resetAllFilters() {
  tagFilter.value = 'all'
  sortBy.value = 'newest'
  fetchProjects(true)
}

/* ============================================
   PAGINATION
   ============================================ */
function goToPreviousPage() {
  if (currentPage.value > 0) {
    currentPage.value--
    fetchProjects()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

function goToNextPage() {
  if (currentPage.value + 1 < totalPages.value) {
    currentPage.value++
    fetchProjects()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

/* ============================================
   MODAL & MEDIA
   ============================================ */
function openProjectModal(p) {
  activeProject.value = p
  selectedMedia.value = p.media?.[0] || null
  isMediaListOpen.value = true
  document.body.style.overflow = 'hidden'
  nextTick(() => {
    resetVideoState()
    resetAudioState()
  })
}

function closeProjectModal() {
  resetVideoState()
  resetAudioState()
  activeProject.value = null
  selectedMedia.value = null
  zoomLevel.value = 1
  document.body.style.overflow = ''
}

function selectMedia(media) {
  resetVideoState()
  resetAudioState()
  selectedMedia.value = media
  zoomLevel.value = 1
  nextTick(() => {
    resetVideoState()
    resetAudioState()
  })
}

function toggleMediaList() {
  isMediaListOpen.value = !isMediaListOpen.value
}

function toggleMediaType(type) {
  expandedMediaTypes.value[type] = !expandedMediaTypes.value[type]
}

function getMediasByType(type) {
  if (!activeProject.value) return []
  return activeProject.value.media.filter(m => m.mediaType === type)
}

function resetVideoState() {
  if (videoPlayer.value) {
    videoPlayer.value.pause()
    videoPlayer.value.currentTime = 0
  }
  isVideoPlaying.value = false
  videoCurrentTime.value = 0
  videoDuration.value = 0
  videoProgress.value = 0
}

function resetAudioState() {
  if (audioPlayer.value) {
    audioPlayer.value.pause()
    audioPlayer.value.currentTime = 0
  }
  isAudioPlaying.value = false
  audioCurrentTime.value = 0
  audioDuration.value = 0
  audioProgress.value = 0
}

/* ============================================
   VIDEO PLAYER CONTROLS
   ============================================ */
function onVideoLoaded() {
  if (videoPlayer.value) {
    videoDuration.value = videoPlayer.value.duration
    videoPlayer.value.volume = videoVolume.value
  }
}

function onVideoTimeUpdate() {
  if (videoPlayer.value) {
    videoCurrentTime.value = videoPlayer.value.currentTime
    videoProgress.value = (videoPlayer.value.currentTime / videoPlayer.value.duration) * 100
  }
}

function toggleVideoPlay() {
  if (!videoPlayer.value) return
  
  if (videoPlayer.value.paused) {
    videoPlayer.value.play()
  } else {
    videoPlayer.value.pause()
  }
}

function toggleMute() {
  if (!videoPlayer.value) return
  videoPlayer.value.muted = !videoPlayer.value.muted
  isVideoMuted.value = videoPlayer.value.muted
}

function changeVideoVolume(event) {
  if (!videoPlayer.value) return
  const volume = event.target.value / 100
  videoPlayer.value.volume = volume
  videoVolume.value = volume
  if (volume > 0 && isVideoMuted.value) {
    videoPlayer.value.muted = false
    isVideoMuted.value = false
  }
}

function toggleVideoFullscreen() {
  if (!videoPlayerContainer.value) return
  
  if (document.fullscreenElement) {
    document.exitFullscreen()
  } else {
    if (videoPlayerContainer.value.requestFullscreen) {
      videoPlayerContainer.value.requestFullscreen()
    } else if (videoPlayerContainer.value.webkitRequestFullscreen) {
      videoPlayerContainer.value.webkitRequestFullscreen()
    } else if (videoPlayerContainer.value.mozRequestFullScreen) {
      videoPlayerContainer.value.mozRequestFullScreen()
    }
  }
}

function seekVideo(event) {
  if (!videoPlayer.value) return
  
  const progressBar = event.currentTarget
  const rect = progressBar.getBoundingClientRect()
  const clickX = event.clientX - rect.left
  const percentage = clickX / rect.width
  
  videoPlayer.value.currentTime = percentage * videoPlayer.value.duration
}

/* ============================================
   AUDIO PLAYER CONTROLS
   ============================================ */
function onAudioLoaded() {
  if (audioPlayer.value) {
    audioDuration.value = audioPlayer.value.duration
    audioPlayer.value.volume = audioVolume.value
  }
}

function onAudioTimeUpdate() {
  if (audioPlayer.value) {
    audioCurrentTime.value = audioPlayer.value.currentTime
    audioProgress.value = (audioPlayer.value.currentTime / audioPlayer.value.duration) * 100
  }
}

function toggleAudioPlay() {
  if (!audioPlayer.value) return
  
  if (audioPlayer.value.paused) {
    audioPlayer.value.play()
  } else {
    audioPlayer.value.pause()
  }
}

function toggleAudioMute() {
  if (!audioPlayer.value) return
  audioPlayer.value.muted = !audioPlayer.value.muted
  isAudioMuted.value = audioPlayer.value.muted
}

function changeAudioVolume(event) {
  if (!audioPlayer.value) return
  const volume = event.target.value / 100
  audioPlayer.value.volume = volume
  audioVolume.value = volume
  if (volume > 0 && isAudioMuted.value) {
    audioPlayer.value.muted = false
    isAudioMuted.value = false
  }
}

function seekAudio(event) {
  if (!audioPlayer.value) return
  
  const progressBar = event.currentTarget
  const rect = progressBar.getBoundingClientRect()
  const clickX = event.clientX - rect.left
  const percentage = clickX / rect.width
  
  audioPlayer.value.currentTime = percentage * audioPlayer.value.duration
}

/* ============================================
   FULLSCREEN HANDLERS
   ============================================ */
function toggleFullscreen() {
  if (!selectedMedia.value) return
  
  if (selectedMedia.value.mediaType === 'image') {
    fullscreenContent.value = {
      type: 'image',
      url: selectedMedia.value.url,
      caption: selectedMedia.value.caption
    }
    isFullscreen.value = true
    document.body.style.overflow = 'hidden'
  }
}

function openInFullscreen(url) {
  fullscreenContent.value = {
    type: 'document',
    url: url
  }
  isFullscreen.value = true
  document.body.style.overflow = 'hidden'
}

function exitFullscreen() {
  isFullscreen.value = false
  fullscreenContent.value = null
  document.body.style.overflow = ''
}

/* ============================================
   MEDIA NAVIGATION
   ============================================ */
function previousMedia() {
  if (!canGoPreviousMedia.value) return
  const idx = activeProject.value.media.findIndex(m => m.id === selectedMedia.value.id)
  selectMedia(activeProject.value.media[idx - 1])
}

function nextMedia() {
  if (!canGoNextMedia.value) return
  const idx = activeProject.value.media.findIndex(m => m.id === selectedMedia.value.id)
  selectMedia(activeProject.value.media[idx + 1])
}

/* ============================================
   IMAGE ZOOM
   ============================================ */
function zoomIn() {
  if (zoomLevel.value < 3) zoomLevel.value += 0.25
}

function zoomOut() {
  if (zoomLevel.value > 1) zoomLevel.value -= 0.25
}

function resetZoom() {
  zoomLevel.value = 1
}

/* ============================================
   ERROR HANDLERS
   ============================================ */
function onCoverError(e) {
  e.target.src = fallbackCover
}

function onPreviewError(e) {
  e.target.src = fallbackCover
}

/* ============================================
   UTILITIES
   ============================================ */
function truncateText(text, maxLength) {
  if (!text) return ''
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text
}

function getMediaIcon(type) {
  const icons = {
    image: '🖼️',
    video: '🎬',
    audio: '🎵',
    document: '📄',
    pdf: '📕',
    text: '📝',
  }
  return icons[String(type).toLowerCase()] || '📎'
}

function getMediaLabel(type) {
  const labels = {
    image: 'وێنە',
    video: 'ڤیدیۆ',
    audio: 'دەنگ',
    document: 'بەڵگەنامە',
    pdf: 'PDF',
    text: 'دەق',
  }
  return labels[String(type).toLowerCase()] || 'فایل'
}

/* ============================================
   WATCHERS & LIFECYCLE
   ============================================ */
watch(tagFilter, () => {
  // Tag filter triggers new API call
})

onMounted(() => {
  fetchProjects(true)
})

onUnmounted(() => {
  resetVideoState()
  resetAudioState()
  exitFullscreen()
  document.body.style.overflow = ''
})
</script>

<style scoped>
/* ============================================
   STANFORD-INSPIRED DESIGN SYSTEM
   ============================================ */
@import url('https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@300;400;600;700&family=Source+Serif+Pro:wght@400;600;700&display=swap');

/* Main Component Container */
.projects {
  min-height: 100vh;
  background: linear-gradient(180deg, #f8f8f8 0%, #f4f4f4 100%);
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, sans-serif;
  color: #2e2d29;
  direction: rtl;
  text-align: right;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.section {
  padding: 5rem 0;
}

/* ============================================
   HERO SECTION - Stanford Inspired
   ============================================ */
.hero {
  position: relative;
  min-height: 85vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #2d2d2d 100%);
}

.hero__bg {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  filter: brightness(0.35) contrast(1.2) saturate(1.1);
  animation: elegant-zoom 40s ease-in-out infinite alternate;
}

@keyframes elegant-zoom {
  0% { 
    transform: scale(1) translateX(0);
    filter: brightness(0.35) contrast(1.2) saturate(1.1);
  }
  100% { 
    transform: scale(1.12) translateX(-20px);
    filter: brightness(0.3) contrast(1.25) saturate(1.15);
  }
}

.hero__overlay {
  position: absolute;
  inset: 0;
  background: 
    radial-gradient(circle at 100% 0%, rgba(140, 21, 21, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 0% 100%, rgba(178, 111, 22, 0.25) 0%, transparent 50%),
    linear-gradient(180deg, 
      rgba(0, 0, 0, 0.4) 0%, 
      rgba(0, 0, 0, 0.7) 50%,
      rgba(0, 0, 0, 0.85) 100%
    );
}

.hero__content {
  position: relative;
  z-index: 10;
  animation: hero-elegant-enter 1.4s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both;
  width: 100%;
}

@keyframes hero-elegant-enter {
  0% {
    opacity: 0;
    transform: translateY(80px);
    filter: blur(15px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0);
  }
}

.heroCard {
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.08) 0%, 
    rgba(255, 255, 255, 0.02) 100%
  );
  backdrop-filter: blur(50px) saturate(200%);
  border: 1.5px solid rgba(255, 255, 255, 0.25);
  border-radius: 32px;
  padding: 4.5rem 4rem;
  max-width: 900px;
  margin: 0 auto;
  box-shadow: 
    0 50px 100px rgba(0, 0, 0, 0.5),
    inset 0 1px 1px rgba(255, 255, 255, 0.15),
    0 0 60px rgba(140, 21, 21, 0.15);
  position: relative;
  overflow: hidden;
}

.heroCard::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1.5px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.5) 50%,
    transparent 100%
  );
  animation: shimmer 4s ease-in-out infinite;
}

@keyframes shimmer {
  0%, 100% { opacity: 0.2; }
  50% { opacity: 1; }
}

.heroCard__badge {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  background: linear-gradient(135deg, 
    rgba(140, 21, 21, 0.95) 0%, 
    rgba(178, 111, 22, 0.9) 100%
  );
  color: white;
  padding: 0.9rem 2.25rem;
  border-radius: 100px;
  font-size: 0.95rem;
  font-weight: 700;
  margin-bottom: 2.5rem;
  box-shadow: 
    0 12px 32px rgba(140, 21, 21, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.25);
  border: 1.5px solid rgba(255, 255, 255, 0.15);
  font-family: 'Inter', sans-serif;
  letter-spacing: 0.03em;
  animation: badge-glow 3.5s ease-in-out infinite;
  backdrop-filter: blur(20px);
}

@keyframes badge-glow {
  0%, 100% { 
    box-shadow: 
      0 12px 32px rgba(140, 21, 21, 0.5),
      inset 0 1px 0 rgba(255, 255, 255, 0.25);
  }
  50% { 
    box-shadow: 
      0 12px 40px rgba(140, 21, 21, 0.7),
      0 0 50px rgba(140, 21, 21, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.35);
  }
}

.badge-icon {
  font-size: 1.2rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.heroCard__title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 800;
  color: #ffffff;
  line-height: 1.15;
  margin-bottom: 1.5rem;
  letter-spacing: -0.03em;
  text-shadow: 
    0 2px 4px rgba(0, 0, 0, 0.3),
    0 4px 12px rgba(0, 0, 0, 0.2);
  animation: title-shimmer 4s ease-in-out infinite;
}

@keyframes title-shimmer {
  0%, 100% {
    text-shadow: 
      0 2px 4px rgba(0, 0, 0, 0.3),
      0 4px 12px rgba(0, 0, 0, 0.2);
  }
  50% {
    text-shadow: 
      0 2px 4px rgba(0, 0, 0, 0.3),
      0 4px 12px rgba(0, 0, 0, 0.2),
      0 0 30px rgba(255, 255, 255, 0.1);
  }
}

.title-accent {
  display: block;
  background: linear-gradient(135deg, #ffffff 0%, #f0f0f0 50%, #e0e0e0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-top: 0.5rem;
  position: relative;
  animation: gradient-shift 5s ease infinite;
  background-size: 200% 200%;
}

@keyframes gradient-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.heroCard__sub {
  font-family: 'Inter', sans-serif;
  font-size: clamp(1.05rem, 2vw, 1.25rem);
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.8;
  margin-bottom: 3.5rem;
  font-weight: 400;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
  max-width: 650px;
  margin-left: auto;
  margin-right: auto;
}

.heroCard__stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 2.5rem;
  padding: 2.5rem 0;
  margin-bottom: 2.5rem;
  position: relative;
}

.heroCard__stats::before,
.heroCard__stats::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.2) 20%,
    rgba(255, 255, 255, 0.2) 80%,
    transparent 100%
  );
}

.heroCard__stats::before { top: 0; }
.heroCard__stats::after { bottom: 0; }

.stat {
  text-align: center;
  position: relative;
  animation: stat-float 3s ease-in-out infinite;
}

.stat:nth-child(1) { animation-delay: 0s; }
.stat:nth-child(2) { animation-delay: 0.2s; }
.stat:nth-child(3) { animation-delay: 0.4s; }

@keyframes stat-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.stat__value {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(2.5rem, 4vw, 3.5rem);
  font-weight: 800;
  background: linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
  margin-bottom: 0.75rem;
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.2));
}

.stat__label {
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.stat-divider {
  width: 1px;
  height: 50px;
  background: linear-gradient(
    180deg,
    transparent 0%,
    rgba(255, 255, 255, 0.2) 50%,
    transparent 100%
  );
  display: none;
}

.heroCard__actions {
  display: flex;
  justify-content: center;
  animation: actions-fade-in 1s cubic-bezier(0.16, 1, 0.3, 1) 0.4s both;
}

@keyframes actions-fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.activeFilter {
  display: inline-flex;
  align-items: center;
  gap: 1rem;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20px);
  padding: 1rem 1.75rem;
  border-radius: 100px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  font-size: 1rem;
  color: white;
  font-family: 'Inter', sans-serif;
  animation: filter-glow 2s ease-in-out infinite;
}

@keyframes filter-glow {
  0%, 100% {
    box-shadow: 
      0 8px 32px rgba(0, 0, 0, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }
  50% {
    box-shadow: 
      0 8px 32px rgba(0, 0, 0, 0.3),
      0 0 40px rgba(140, 21, 21, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
  }
}

.activeFilter__icon {
  font-size: 1.2rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.activeFilter__text {
  font-weight: 500;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.activeFilter__text strong {
  font-weight: 700;
  color: #ffffff;
  background: linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.activeFilter__remove {
  background: rgba(140, 21, 21, 0.9);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  width: 26px;
  height: 26px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: 700;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 4px 12px rgba(140, 21, 21, 0.4);
}

.activeFilter__remove:hover {
  background: rgba(110, 15, 15, 1);
  transform: rotate(90deg) scale(1.1);
  box-shadow: 0 6px 20px rgba(140, 21, 21, 0.6);
}

/* Responsive Adjustments */
@media (max-width: 968px) {
  .heroCard {
    padding: 3.5rem 2.5rem;
  }

  .heroCard__stats {
    gap: 2rem;
  }

  .stat__value {
    font-size: 2.5rem;
  }
}

@media (max-width: 640px) {
  .hero {
    min-height: 75vh;
  }

  .heroCard {
    padding: 3rem 2rem;
    border-radius: 20px;
  }

  .heroCard__badge {
    padding: 0.65rem 1.5rem;
    font-size: 0.85rem;
    margin-bottom: 2rem;
  }

  .heroCard__title {
    font-size: 2rem;
    margin-bottom: 1.25rem;
  }

  .title-accent {
    margin-top: 0.25rem;
  }

  .heroCard__sub {
    font-size: 1rem;
    margin-bottom: 2.5rem;
  }

  .heroCard__stats {
    grid-template-columns: 1fr;
    gap: 2rem;
    padding: 2rem 0;
    margin-bottom: 2rem;
  }

  .stat__value {
    font-size: 2.25rem;
  }

  .stat__label {
    font-size: 0.8rem;
  }

  .activeFilter {
    padding: 0.85rem 1.5rem;
    font-size: 0.9rem;
  }
}

/* Glass Morphism Enhancement */
@supports (backdrop-filter: blur(40px)) {
  .heroCard {
    background: rgba(255, 255, 255, 0.06);
  }
  
  .activeFilter {
    background: rgba(255, 255, 255, 0.1);
  }
}

/* Prevent animations on reduced motion */
@media (prefers-reduced-motion: reduce) {
  .hero__bg,
  .heroCard__badge,
  .title-accent,
  .stat,
  .activeFilter {
    animation: none !important;
  }
}

/* ============================================
   CONTROLS BAR
   ============================================ */
.controlsBar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
  background: white;
  padding: 1.5rem;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  margin-bottom: 2.5rem;
  border: 1px solid #e4e4e1;
}

.controlsBar__left {
  flex: 1;
}

.controlsBar__right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.statusBadge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-size: 0.9rem;
  font-weight: 600;
}

.statusBadge--loading {
  background: #f0f0ed;
  color: #5f5e5a;
}

.statusBadge--error {
  background: #fef2f2;
  color: #991b1b;
}

.statusBadge--success {
  background: #f0fdf4;
  color: #166534;
}

.statusBadge__icon {
  display: flex;
  align-items: center;
}

.spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid #d4d4d1;
  border-top-color: #8C1515;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.sortControl {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.sortControl__label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #2e2d29;
  white-space: nowrap;
}

.sortControl__select {
  padding: 0.6rem 1rem;
  border: 2px solid #d4d4d1;
  border-radius: 6px;
  background: white;
  color: #2e2d29;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
  min-width: 150px;
}

.sortControl__select:hover {
  border-color: #8C1515;
}

.sortControl__select:focus {
  outline: none;
  border-color: #8C1515;
  box-shadow: 0 0 0 3px rgba(140, 21, 21, 0.1);
}

.btnIcon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border: 2px solid #d4d4d1;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1.2rem;
}

.btnIcon:hover {
  border-color: #8C1515;
  background: #fafaf9;
  transform: rotate(180deg);
}

/* ============================================
   EMPTY STATE
   ============================================ */
.emptyState {
  text-align: center;
  padding: 5rem 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  animation: fade-in 0.6s ease;
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.emptyState__icon {
  font-size: 5rem;
  margin-bottom: 1.5rem;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
}

.emptyState__title {
  font-family: 'Source Serif Pro', Georgia, serif;
  font-size: 1.75rem;
  font-weight: 700;
  color: #2e2d29;
  margin-bottom: 0.75rem;
}

.emptyState__text {
  font-size: 1.05rem;
  color: #5f5e5a;
  margin-bottom: 2rem;
  line-height: 1.6;
}

/* ============================================
   PROJECTS GRID
   ============================================ */
.projectsGrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 2rem;
}

/* ============================================
   PROJECT CARD - Stanford Style
   ============================================ */
.projectCard {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e4e4e1;
  cursor: pointer;
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  animation: card-appear 0.5s cubic-bezier(0.16, 1, 0.3, 1) backwards;
}

@keyframes card-appear {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.projectCard:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
  border-color: #8C1515;
}

.projectCard:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(140, 21, 21, 0.2), 0 12px 24px rgba(0, 0, 0, 0.15);
}

.projectCard__cover {
  position: relative;
  width: 100%;
  height: 260px;
  overflow: hidden;
  background: #f0f0ed;
}

.projectCard__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.projectCard:hover .projectCard__img {
  transform: scale(1.08);
}

.projectCard__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(140, 21, 21, 0) 0%,
    rgba(140, 21, 21, 0.7) 100%
  );
  display: flex;
  align-items: flex-end;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.35s ease;
  padding: 2rem;
}

.projectCard:hover .projectCard__overlay {
  opacity: 1;
}

.overlayContent {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  transform: translateY(10px);
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  text-shadow: 0 3px 8px rgba(0, 0, 0, 0.7);
  z-index: 5;
  position: relative;
}

.projectCard:hover .overlayContent {
  transform: translateY(0);
}

.overlayContent__icon {
  font-size: 1.5rem;
}

.typeBadge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 0.4rem 1rem;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 600;
  color: #8C1515;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.typeBadge__icon {
  font-size: 1rem;
}

.projectCard__body {
  padding: 1.75rem;
}

.projectCard__title {
  font-family: 'Source Serif Pro', Georgia, serif;
  font-size: 1.35rem;
  font-weight: 700;
  color: #2e2d29;
  line-height: 1.4;
  margin-bottom: 0.75rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.projectCard__desc {
  font-size: 0.95rem;
  color: #5f5e5a;
  line-height: 1.65;
  margin-bottom: 1.25rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.projectCard__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid #e4e4e1;
}

.metaItem {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.85rem;
  color: #767671;
  font-weight: 500;
}

.metaItem--primary {
  color: #8C1515;
  font-weight: 600;
}

.metaItem--language {
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  color: #0369a1;
  padding: 0.35rem 0.75rem;
  border-radius: 50px;
  border: 1px solid #bae6fd;
  font-weight: 600;
}

.metaItem__icon {
  font-size: 1rem;
}

.projectCard__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tagBtn {
  padding: 0.35rem 0.9rem;
  background: #f4f4f4;
  color: #8C1515;
  border: 1px solid #d4d4d1;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
}

.tagBtn:hover {
  background: #8C1515;
  color: white;
  border-color: #8C1515;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(140, 21, 21, 0.2);
}

.tagBtn--more {
  background: #e4e4e1;
  color: #767671;
  cursor: default;
  border-color: transparent;
}

.tagBtn--more:hover {
  transform: none;
  background: #e4e4e1;
  color: #767671;
  box-shadow: none;
}

.projectCard__footer {
  padding: 0 1.75rem 1.75rem;
}

.viewLink {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #8C1515;
  font-weight: 600;
  font-size: 0.95rem;
  padding-top: 1rem;
  border-top: 1px solid #e4e4e1;
  transition: all 0.2s ease;
}

.projectCard:hover .viewLink {
  gap: 0.5rem;
}

.viewLink__arrow {
  transition: transform 0.2s ease;
}

.projectCard:hover .viewLink__arrow {
  transform: translateX(-4px);
}

/* ============================================
   BUTTONS
   ============================================ */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.9rem 1.75rem;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.2s ease;
  text-decoration: none;
  font-family: inherit;
}

.btn--primary {
  background: linear-gradient(135deg, #8C1515 0%, #6e0f0f 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(140, 21, 21, 0.25);
}

.btn--primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(140, 21, 21, 0.35);
}

.btn--ghost {
  background: transparent;
  color: #2e2d29;
  border: 2px solid #d4d4d1;
}

.btn--ghost:hover {
  background: #fafaf9;
  border-color: #8C1515;
  color: #8C1515;
}

.btn__icon {
  font-size: 1.1rem;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

/* ============================================
   PAGINATION
   ============================================ */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  margin-top: 4rem;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  border: 1px solid #e4e4e1;
}

.pagination__btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.9rem 1.5rem;
  background: #8C1515;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
}

.pagination__btn:hover:not(:disabled) {
  background: #6e0f0f;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(140, 21, 21, 0.3);
}

.pagination__btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.pagination__icon {
  font-size: 1.1rem;
}

.pagination__info {
  display: flex;
  align-items: baseline;
  gap: 0.4rem;
  font-family: 'Source Serif Pro', Georgia, serif;
  font-weight: 700;
}

.pagination__current {
  font-size: 1.5rem;
  color: #8C1515;
}

.pagination__divider {
  font-size: 1.2rem;
  color: #767671;
}

.pagination__total {
  font-size: 1.2rem;
  color: #5f5e5a;
}

/* ============================================
   MODAL - Stanford Design
   ============================================ */
.modal {
  position: fixed;
  inset: 0;
  background: rgba(20, 20, 20, 0.92);
  backdrop-filter: blur(20px) saturate(150%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  z-index: 1000;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-gutter: stable;
  -webkit-font-smoothing: antialiased;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modalPanel,
.modal-leave-active .modalPanel {
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-enter-from .modalPanel,
.modal-leave-to .modalPanel {
  opacity: 0;
  transform: translateY(40px) scale(0.94);
}

.modalPanel {
  background: linear-gradient(135deg, #ffffff 0%, #f9f9f9 100%);
  border-radius: 22px;
  width: 100%;
  max-width: 1200px;
  max-height: 90vh;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-gutter: stable;
  position: relative;
  box-shadow: 
    0 40px 80px rgba(0, 0, 0, 0.4),
    0 0 60px rgba(140, 21, 21, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.9);
}

.modalClose {
  position: sticky;
  top: 1.5rem;
  left: 1.5rem;
  float: left;
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #ffffff 0%, #f9f9f9 100%);
  border: 2px solid #e4e4e1;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

.modalClose:hover {
  background: #8C1515;
  border-color: #8C1515;
  color: white;
  transform: rotate(90deg);
}

.modalClose__icon {
  font-size: 1.3rem;
  font-weight: 700;
}

.modalHeader {
  padding: 4rem 3rem 2.5rem;
  border-bottom: 2px solid #e4e4e1;
}

.modalHeader__badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin-bottom: 1.5rem;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 1rem;
  background: #f4f4f4;
  color: #5f5e5a;
  border-radius: 50px;
  font-size: 0.85rem;
  font-weight: 600;
  border: 1px solid #e4e4e1;
}

.badge--type {
  background: linear-gradient(135deg, #8C1515 0%, #6e0f0f 100%);
  color: white;
  border-color: transparent;
}

.badge--date {
  background: #f0fdf4;
  color: #166534;
  border-color: #bbf7d0;
}

.badge--language {
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  color: #0369a1;
  border: 1px solid #bae6fd;
}

.badge__icon {
  font-size: 1rem;
}

.modalHeader__title {
  font-family: 'Source Serif Pro', Georgia, serif;
  font-size: 2.25rem;
  font-weight: 700;
  color: #2e2d29;
  line-height: 1.3;
  margin-bottom: 1rem;
}

.modalHeader__desc {
  font-size: 1.1rem;
  color: #5f5e5a;
  line-height: 1.75;
  margin-bottom: 1.75rem;
}

.modalHeader__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}

.modalTag {
  padding: 0.6rem 1.25rem;
  background: #f4f4f4;
  color: #8C1515;
  border: 2px solid #d4d4d1;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
}

.modalTag:hover {
  background: #8C1515;
  color: white;
  border-color: #8C1515;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(140, 21, 21, 0.25);
}

/* ============================================
   MEDIA GALLERY - STANDARD SIZES
   ============================================ */
.mediaGallery {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  padding: 2.5rem 3rem;
}

.mediaPreview {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.mediaPreview__content {
  background: #fafaf9;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid #e4e4e1;
  
  /* STANDARD SIZE FOR ALL MEDIA */
  min-height: 500px;
  max-height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* IMAGE VIEWER */
.imageViewer {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.imageViewer__img {
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: contain;
  transition: transform 0.3s ease;
  cursor: zoom-in;
}

.imageViewer__img:hover {
  cursor: pointer;
}

.imageViewer__controls {
  position: absolute;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.5rem;
  background: rgba(46, 45, 41, 0.9);
  backdrop-filter: blur(10px);
  padding: 0.6rem;
  border-radius: 50px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.controlBtn {
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.15);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.controlBtn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.25);
  transform: scale(1.1);
}

.controlBtn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

/* ============================================
   VIDEO PLAYER WITH CUSTOM CONTROLS
   ============================================ */
.videoPlayer {
  position: relative;
  width: 100%;
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000;
}

.videoPlayer__element {
  width: 100%;
  height: 100%;
  max-height: 500px;
  object-fit: contain;
  cursor: pointer;
}

/* Custom Video Controls */
.videoControls {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.9) 0%,
    rgba(0, 0, 0, 0.7) 60%,
    transparent 100%
  );
  padding: 1.5rem 1.25rem 1rem;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.videoPlayer:hover .videoControls {
  opacity: 1;
}

/* Progress Bar */
.videoControls__progress {
  width: 100%;
  height: 28px;
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
  cursor: pointer;
  padding: 8px 0;
}

.progressBar {
  position: relative;
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.25);
  border-radius: 10px;
  overflow: visible;
  transition: height 0.2s ease;
}

.videoControls__progress:hover .progressBar {
  height: 8px;
}

.progressBar__filled {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: linear-gradient(90deg, #1E90FF 0%, #4169E1 100%);
  border-radius: 10px;
  transition: width 0.1s linear;
  box-shadow: 0 0 10px rgba(30, 144, 255, 0.5);
}

.progressBar__handle {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 16px;
  height: 16px;
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
  opacity: 0;
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.videoControls__progress:hover .progressBar__handle {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1.2);
}

/* Bottom Controls */
.videoControls__bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.videoControls__left,
.videoControls__right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

/* Video Buttons */
.videoBtn {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.1rem;
  transition: all 0.2s ease;
}

.videoBtn:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: scale(1.1);
}

.videoBtn--play {
  width: 44px;
  height: 44px;
  background: rgba(30, 144, 255, 0.9);
  border-color: rgba(30, 144, 255, 1);
}

.videoBtn--play:hover {
  background: rgba(30, 144, 255, 1);
  box-shadow: 0 4px 16px rgba(30, 144, 255, 0.4);
}

.videoBtn--volume {
  width: 36px;
  height: 36px;
  min-width: 36px;
}

/* Video Time Display */
.videoTime {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: 'Source Sans Pro', monospace;
  font-size: 0.9rem;
  color: white;
  font-weight: 600;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  min-width: 120px;
}

.videoTime__current {
  color: #1E90FF;
}

.videoTime__divider {
  color: rgba(255, 255, 255, 0.6);
}

.videoTime__duration {
  color: rgba(255, 255, 255, 0.9);
}

/* ============================================
   VOLUME CONTROL STYLING
   ============================================ */
.volumeControl {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: rgba(255, 255, 255, 0.08);
  padding: 0.5rem 1rem;
  border-radius: 50px;
  backdrop-filter: blur(10px);
}

.volumeControl--audio {
  background: rgba(140, 21, 21, 0.08);
  border: 1px solid rgba(140, 21, 21, 0.15);
}

.volumeSlider {
  width: 80px;
  height: 6px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.2);
  outline: none;
  cursor: pointer;
  -webkit-appearance: none;
  appearance: none;
}

.volumeSlider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: white;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  transition: all 0.2s ease;
}

.volumeSlider::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: white;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  border: none;
  transition: all 0.2s ease;
}

.volumeSlider::-webkit-slider-thumb:hover,
.volumeSlider::-moz-range-thumb:hover {
  transform: scale(1.2);
}

.volumeSlider::-webkit-slider-runnable-track {
  height: 6px;
  border-radius: 10px;
  background: linear-gradient(90deg, #1E90FF 0%, #1E90FF var(--volume-percent, 100%), rgba(255, 255, 255, 0.2) var(--volume-percent, 100%), rgba(255, 255, 255, 0.2) 100%);
}

.volumeSlider::-moz-range-track {
  height: 6px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.2);
}

.volumeSlider::-moz-range-progress {
  height: 6px;
  border-radius: 10px;
  background: #1E90FF;
}

/* ============================================
   AUDIO PLAYER - STANDARD SIZE
   ============================================ */
.audioPlayer {
  width: 100%;
  height: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  padding: 2.5rem;
  text-align: center;
}

.audioPlayer__artwork {
  width: 240px;
  height: 240px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
}

.audioPlayer__artwork img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.audioPlayer__info {
  max-width: 500px;
}

.audioPlayer__title {
  font-family: 'Source Serif Pro', Georgia, serif;
  font-size: 1.4rem;
  font-weight: 700;
  color: #2e2d29;
  margin-bottom: 0.5rem;
}

.audioPlayer__desc {
  font-size: 0.95rem;
  color: #5f5e5a;
  line-height: 1.6;
  margin-bottom: 1rem;
}

/* ============================================
   AUDIO PLAYER CUSTOM CONTROLS
   ============================================ */
.customAudioPlayer {
  width: 100%;
  max-width: 500px;
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 2px solid #e4e4e1;
}

.audioProgress {
  width: 100%;
  height: 28px;
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  cursor: pointer;
  padding: 8px 0;
}

.audioProgress__bar {
  position: relative;
  width: 100%;
  height: 6px;
  background: #e4e4e1;
  border-radius: 10px;
  overflow: visible;
  transition: height 0.2s ease;
}

.audioProgress:hover .audioProgress__bar {
  height: 8px;
}

.audioProgress__filled {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: linear-gradient(90deg, #8C1515 0%, #b26f16 100%);
  border-radius: 10px;
  transition: width 0.1s linear;
  box-shadow: 0 0 10px rgba(140, 21, 21, 0.3);
}

.audioControls {
  display: flex;
  align-items: center;
  gap: 1rem;
  justify-content: space-between;
}

.audioBtn {
  background: white;
  border: 2px solid #d4d4d1;
  color: #2e2d29;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.1rem;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.audioBtn:hover {
  background: #fafaf9;
  border-color: #8C1515;
  color: #8C1515;
  transform: scale(1.1);
}

.audioBtn--play {
  width: 52px;
  height: 52px;
  background: linear-gradient(135deg, #8C1515 0%, #6e0f0f 100%);
  border-color: #8C1515;
  color: white;
  font-size: 1.3rem;
}

.audioBtn--play:hover {
  background: linear-gradient(135deg, #6e0f0f 0%, #8C1515 100%);
  box-shadow: 0 4px 16px rgba(140, 21, 21, 0.4);
}

.audioBtn--volume {
  width: 36px;
  height: 36px;
  min-width: 36px;
}

.audioTime {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: 'Source Sans Pro', monospace;
  font-size: 0.95rem;
  color: #2e2d29;
  font-weight: 600;
  flex: 1;
  justify-content: center;
}

.audioTime__divider {
  color: #767671;
}

/* DOCUMENT PREVIEW - STANDARD SIZE */
.documentPreview {
  width: 100%;
  height: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  padding: 3rem;
  text-align: center;
}

.documentPreview__icon {
  font-size: 6rem;
  animation: float 3s ease-in-out infinite;
}

.documentPreview__title {
  font-family: 'Source Serif Pro', Georgia, serif;
  font-size: 1.4rem;
  font-weight: 700;
  color: #2e2d29;
}

.documentPreview__url {
  font-size: 0.85rem;
  color: #767671;
  word-break: break-all;
  max-width: 400px;
}

/* MEDIA CAPTION */
.mediaCaption {
  background: white;
  border-radius: 8px;
  padding: 1.75rem;
  border: 1px solid #e4e4e1;
}

.mediaCaption__title {
  font-family: 'Source Serif Pro', Georgia, serif;
  font-size: 1.25rem;
  font-weight: 700;
  color: #2e2d29;
  margin-bottom: 0.75rem;
}

.mediaCaption__text {
  font-size: 0.95rem;
  color: #5f5e5a;
  line-height: 1.7;
}

/* ============================================
   MEDIA SIDEBAR
   ============================================ */
.mediaSidebar {
  display: flex;
  flex-direction: column;
  gap: 0;
  background: linear-gradient(180deg, #ffffff 0%, #f9f9f9 100%);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  border: 1px solid #e4e4e1;
}

.mediaTypeSection {
  border-bottom: 1px solid #e4e4e1;
}

.mediaTypeSection:last-child {
  border-bottom: none;
}

.mediaTypeToggle {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  background: linear-gradient(135deg, #ffffff 0%, #f9f9f9 100%);
  border: 2px solid #e4e4e1;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  font-family: inherit;
  color: #2e2d29;
  font-weight: 600;
  gap: 1rem;
  border-radius: 12px;
}

.mediaTypeToggle:hover {
  background: linear-gradient(135deg, #f9f9f9 0%, #f0f0f0 100%);
  border-color: #8C1515;
  transform: translateX(4px) translateY(-1px);
  box-shadow: 0 8px 24px rgba(140, 21, 21, 0.2),
              0 0 40px rgba(140, 21, 21, 0.08),
              inset 0 1px 0 rgba(255, 255, 255, 0.6);
}

.mediaTypeToggle--expanded {
  background: linear-gradient(135deg, #8C1515 0%, #6e0f0f 100%);
  color: white;
  border-color: #6e0f0f;
  box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.2), 0 4px 16px rgba(140, 21, 21, 0.25);
}

.mediaTypeToggle__icon {
  font-size: 1.5rem;
  flex-shrink: 0;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.mediaTypeToggle:hover .mediaTypeToggle__icon {
  transform: scale(1.15);
}

.mediaTypeToggle__label {
  flex: 1;
  text-align: right;
  font-size: 1.05rem;
  font-weight: 700;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.mediaTypeToggle:hover .mediaTypeToggle__label {
  color: #8C1515;
}

.mediaTypeToggle__count {
  background: rgba(255, 255, 255, 0.15);
  padding: 0.4rem 0.9rem;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 700;
  flex-shrink: 0;
  min-width: 32px;
  text-align: center;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.mediaTypeToggle--expanded .mediaTypeToggle__count {
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.3);
  color: white;
}

.mediaTypeToggle:hover .mediaTypeToggle__count {
  background: rgba(140, 21, 21, 0.08);
  border-color: #8C1515;
}

.mediaTypeToggle__arrow {
  font-size: 0.8rem;
  flex-shrink: 0;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  color: #8C1515;
}

.mediaTypeToggle:hover .mediaTypeToggle__arrow {
  transform: translateY(-3px) scale(1.15);
}

.mediaTypeToggle--expanded .mediaTypeToggle__arrow {
  color: white;
  transform: rotate(180deg);
}

.mediaTypeList {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  padding: 1rem;
  background: linear-gradient(180deg, #fafafa 0%, #f5f5f5 100%);
  animation: dropdown-appear 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  border-radius: 8px;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05);
}

@keyframes dropdown-appear {
  from {
    opacity: 0;
    max-height: 0;
  }
  to {
    opacity: 1;
    max-height: 500px;
  }
}

.mediaItem {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.2rem;
  background: linear-gradient(135deg, #ffffff 0%, #fafafa 100%);
  border: 2px solid #e8e8e5;
  border-left: 4px solid transparent;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  text-align: right;
  font-family: inherit;
  color: #2e2d29;
  font-weight: 500;
  font-size: 0.95rem;
  position: relative;
}

[dir="ltr"] .mediaItem {
  border-left: none;
  border-right: 4px solid transparent;
}

.mediaItem:hover {
  background: linear-gradient(135deg, #ffffff 0%, #f9f9f9 100%);
  border-color: #8C1515;
  border-left-color: #8C1515;
  transform: translateX(-6px) translateY(-3px);
  box-shadow: 0 12px 32px rgba(140, 21, 21, 0.28),
              0 0 1px rgba(140, 21, 21, 0.1),
              inset 0 1px 0 rgba(255, 255, 255, 0.8),
              -4px 0 12px rgba(140, 21, 21, 0.15);
  color: #8C1515;
  font-weight: 700;
}

[dir="ltr"] .mediaItem:hover {
  border-right-color: #8C1515;
  transform: translateX(6px) translateY(-3px);
  box-shadow: 0 12px 32px rgba(140, 21, 21, 0.28),
              0 0 1px rgba(140, 21, 21, 0.1),
              inset 0 1px 0 rgba(255, 255, 255, 0.8),
              4px 0 12px rgba(140, 21, 21, 0.15);
}

.mediaItem--active {
  background: linear-gradient(135deg, #8C1515 0%, #6e0f0f 100%);
  border-color: #8C1515;
  border-left-color: #fdd500;
  color: white;
  font-weight: 700;
  box-shadow: 0 8px 24px rgba(140, 21, 21, 0.35),
              0 0 1px rgba(0, 0, 0, 0.1),
              inset 0 1px 0 rgba(255, 255, 255, 0.15),
              -4px 0 16px rgba(140, 21, 21, 0.2);
  position: relative;
}

[dir="ltr"] .mediaItem--active {
  border-left: 2px solid #8C1515;
  border-right: 4px solid #fdd500;
  box-shadow: 0 8px 24px rgba(140, 21, 21, 0.35),
              0 0 1px rgba(0, 0, 0, 0.1),
              inset 0 1px 0 rgba(255, 255, 255, 0.15),
              4px 0 16px rgba(140, 21, 21, 0.2);
}

.mediaItem--active:hover {
  transform: translateX(-2px) translateY(-2px);
}

[dir="ltr"] .mediaItem--active:hover {
  transform: translateX(2px) translateY(-2px);
}

.mediaItem--active .mediaItem__icon {
  animation: icon-spin 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.mediaItem--active:hover .mediaItem__icon {
  animation: icon-pulse 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes icon-spin {
  0% { transform: scale(0.8) rotate(-20deg); }
  50% { transform: scale(1.15) rotate(8deg); }
  100% { transform: scale(1) rotate(0deg); }
}

@keyframes icon-pulse {
  0% { transform: scale(1) rotate(0deg); }
  50% { transform: scale(1.25) rotate(-10deg); }
  100% { transform: scale(1) rotate(0deg); }
}

.mediaItem__icon {
  font-size: 1.4rem;
  flex-shrink: 0;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  color: inherit;
}

.mediaItem:hover .mediaItem__icon {
  transform: scale(1.25) rotate(8deg);
}

.mediaItem--active .mediaItem__icon {
  color: #fdd500;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.mediaItem__title {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mediaSidebar__header {
  display: none;
}

.mediaSidebar__toggle {
  display: none;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
}

.slide-enter-from,
.slide-leave-to {
  max-height: 0;
  opacity: 0;
  transform: translateY(-10px);
}

.slide-enter-to,
.slide-leave-from {
  max-height: 600px;
  opacity: 1;
  transform: translateY(0);
}

.thumbnailList {
  display: none;
  margin-bottom: 0;
}

.thumbnailList::-webkit-scrollbar {
  width: 6px;
}

.thumbnailList::-webkit-scrollbar-track {
  background: #f4f4f4;
  border-radius: 10px;
}

.thumbnailList::-webkit-scrollbar-thumb {
  background: #d4d4d1;
  border-radius: 10px;
}

.thumbnailList::-webkit-scrollbar-thumb:hover {
  background: #8C1515;
}

.thumbnail {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: linear-gradient(135deg, #ffffff 0%, #f9f9f9 100%);
  border: 2px solid #e4e4e1;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  text-align: right;
  font-family: inherit;
  position: relative;
  overflow: hidden;
}

.thumbnail::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(140, 21, 21, 0.08) 0%, rgba(178, 111, 22, 0.05) 100%);
  opacity: 0;
  transition: opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  border-radius: 10px;
}

.thumbnail:hover::before {
  opacity: 1;
}

.thumbnail:hover {
  background: linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%);
  border-color: #8C1515;
  transform: translateX(-5px) translateY(-2px);
  box-shadow: 
    0 8px 24px rgba(140, 21, 21, 0.25),
    0 0 40px rgba(140, 21, 21, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
}

.thumbnail__icon {
  font-size: 1.75rem;
  flex-shrink: 0;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.thumbnail:hover .thumbnail__icon {
  transform: scale(1.25) rotate(5deg);
  animation: none;
}

.thumbnail--active .thumbnail__icon {
  animation: icon-bounce 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes icon-bounce {
  0%, 100% { transform: scale(1) rotate(0deg); }
  50% { transform: scale(1.3) rotate(-5deg); }
}

.thumbnail__content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.thumbnail__title {
  font-size: 0.95rem;
  font-weight: 700;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  color: #2e2d29;
  position: relative;
  z-index: 1;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.thumbnail:hover .thumbnail__title {
  color: #8C1515;
  text-shadow: 0 1px 3px rgba(140, 21, 21, 0.2);
}


.thumbnail__type {
  font-size: 0.8rem;
  opacity: 0.75;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #767671;
  position: relative;
  z-index: 1;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.thumbnail:hover .thumbnail__type {
  color: #8C1515;
  opacity: 1;
}

.thumbnail:hover .thumbnail__type {
  color: #b26f16;
}

.thumbnail--active {
  background: linear-gradient(135deg, #8C1515 0%, #6e0f0f 100%);
  border-color: #8C1515;
  transform: translateX(-3px);
  box-shadow: 0 4px 12px rgba(140, 21, 21, 0.3);
}

.thumbnail--active::before {
  opacity: 0;
}

.thumbnail--active .thumbnail__title,
.thumbnail--active .thumbnail__type {
  color: white !important;
}

.mediaNav {
  display: flex;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 2px solid #e4e4e1;
}

.mediaNav__btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.9rem;
  background: white;
  border: 2px solid #d4d4d1;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
  color: #2e2d29;
}

.mediaNav__btn:hover:not(:disabled) {
  background: #fafaf9;
  border-color: #8C1515;
  color: #8C1515;
}

.mediaNav__btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.mediaNav__icon {
  font-size: 1rem;
}

/* ============================================
   MODAL FOOTER
   ============================================ */
.modalFooter {
  display: flex;
  justify-content: flex-start;
  gap: 1rem;
  padding: 2rem 3rem;
  border-top: 2px solid #e4e4e1;
  background: #fafaf9;
}

/* ============================================
   FULLSCREEN OVERLAY
   ============================================ */
.fullscreenOverlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(10px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.fullscreen-enter-active,
.fullscreen-leave-active {
  transition: opacity 0.3s ease;
}

.fullscreen-enter-from,
.fullscreen-leave-to {
  opacity: 0;
}

.fullscreenClose {
  position: fixed;
  top: 2rem;
  right: 2rem;
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  z-index: 10001;
}

.fullscreenClose:hover {
  background: rgba(140, 21, 21, 0.9);
  border-color: #8C1515;
  transform: rotate(90deg);
}

.fullscreenContent {
  max-width: 95vw;
  max-height: 95vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.fullscreenImage {
  max-width: 100%;
  max-height: 95vh;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.fullscreenIframe {
  width: 95vw;
  height: 95vh;
  border-radius: 8px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

/* ============================================
   RESPONSIVE DESIGN
   ============================================ */
@media (max-width: 1024px) {
  .mediaGallery {
    grid-template-columns: 1fr;
  }

  .mediaSidebar {
    order: -1;
  }

  .thumbnailList {
    max-height: 250px;
  }
}

@media (max-width: 768px) {
  .container {
    padding: 0 1rem;
  }

  .hero {
    height: 60vh;
    min-height: 500px;
  }

  .heroCard {
    padding: 2.5rem 2rem;
  }

  .heroCard__title {
    font-size: 2rem;
  }

  .heroCard__stats {
    flex-direction: column;
    gap: 1.5rem;
  }

  .stat-divider {
    display: none;
  }

  .controlsBar {
    flex-direction: column;
    align-items: stretch;
  }

  .controlsBar__right {
    justify-content: space-between;
  }

  .projectsGrid {
    grid-template-columns: 1fr;
  }

  .modalPanel {
    max-height: 95vh;
  }

  .modalHeader {
    padding: 3rem 2rem 2rem;
  }

  .modalHeader__title {
    font-size: 1.75rem;
  }

  .mediaGallery {
    padding: 2rem 1.5rem;
  }

  .mediaPreview__content,
  .videoPlayer,
  .audioPlayer,
  .documentPreview {
    min-height: 400px;
    max-height: 400px;
    height: 400px;
  }

  .videoPlayer__element {
    max-height: 400px;
  }

  .modalFooter {
    padding: 1.5rem 2rem;
  }

  .volumeControl {
    padding: 0.4rem 0.75rem;
  }

  .volumeSlider {
    width: 60px;
  }

  .audioControls {
    flex-wrap: wrap;
  }

  .volumeControl--audio {
    flex: 1;
    min-width: 200px;
  }

  .mediaSidebar__header {
    padding: 0.75rem;
  }

  .thumbnailList {
    max-height: 300px;
  }
}

@media (max-width: 640px) {
  .heroCard__title {
    font-size: 1.75rem;
  }

  .stat__value {
    font-size: 2rem;
  }

  .projectCard__cover {
    height: 220px;
  }

  .mediaGallery {
    padding: 1.5rem 1rem;
  }

  .audioPlayer__artwork {
    width: 180px;
    height: 180px;
  }

  .videoControls {
    padding: 1rem 0.75rem 0.75rem;
  }

  .videoBtn {
    width: 36px;
    height: 36px;
    font-size: 1rem;
  }

  .videoBtn--play {
    width: 40px;
    height: 40px;
  }

  .videoTime {
    font-size: 0.8rem;
    min-width: 100px;
  }

  .progressBar__handle {
    width: 14px;
    height: 14px;
  }

  .videoControls__left {
    flex-wrap: wrap;
  }

  .volumeControl {
    width: 100%;
    justify-content: space-between;
  }

  .volumeSlider {
    flex: 1;
  }

  .customAudioPlayer {
    padding: 1rem;
  }

  .audioBtn {
    width: 40px;
    height: 40px;
  }

  .audioBtn--play {
    width: 48px;
    height: 48px;
  }
}

/* ============================================
   ACCESSIBILITY
   ============================================ */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

.projects :focus-visible {
  outline: 3px solid #8C1515;
  outline-offset: 3px;
  border-radius: 4px;
}

.volumeSlider:focus-visible {
  outline: 2px solid #1E90FF;
  outline-offset: 2px;
}

.audioBtn:focus-visible,
.mediaSidebar__toggle:focus-visible {
  outline: 2px solid #8C1515;
  outline-offset: 2px;
}

/* ============================================
   VIDEO PLAYER - ADDITIONAL POLISH
   ============================================ */

/* Smooth fade in for controls */
@keyframes controls-fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.videoPlayer:hover .videoControls {
  animation: controls-fade-in 0.3s ease;
}

/* Loading state for video */
.videoPlayer__element:not([src]) {
  background: #000;
}

/* Better focus states for video controls */
.videoBtn:focus-visible {
  outline: 2px solid #1E90FF;
  outline-offset: 2px;
}

.videoControls__progress:focus-visible {
  outline: 2px solid #1E90FF;
  outline-offset: 4px;
  border-radius: 4px;
}
</style>