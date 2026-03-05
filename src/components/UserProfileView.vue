<template>
  <div class="pp" dir="rtl">

    <!-- ░░ atmospheric background ░░ -->
    <div class="pp-bg" aria-hidden="true">
      <div class="pp-bg__sand"></div>
      <div class="pp-bg__grid"></div>
      <div class="pp-bg__accent"></div>
    </div>

    <!-- ░░ skeleton ░░ -->
    <div v-if="loading" class="pp-skeleton">
      <div class="sk-sidebar"><div class="sk sk--fill"></div></div>
      <div class="sk-main">
        <div class="sk sk--h200"></div>
        <div class="sk sk--h160"></div>
        <div class="sk sk--h120"></div>
      </div>
    </div>

    <!-- ░░ content ░░ -->
    <div v-else class="pp-root">

      <!-- ▌ SIDEBAR ▌ -->
      <aside class="sidebar">
        <div class="sidebar__top">

          <!-- header label -->
          <div class="sidebar__eyebrow">
            <span class="sidebar__eyebrow-line"></span>
            <span>پرۆفایل</span>
          </div>

          <!-- OAuth badge -->
          <div v-if="isOAuth2" class="sidebar__oauth">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            {{ providerLabel }}
          </div>

          <!-- avatar -->
          <div class="avatar-zone">
            <div
              class="avatar-ring"
              :class="{ 'avatar-ring--drag': isDragOver, 'avatar-ring--uploading': uploadingImage }"
              @click="triggerFileInput"
              @dragover.prevent="isDragOver = true"
              @dragleave.prevent="isDragOver = false"
              @drop.prevent="handleDrop"
            >
              <div class="avatar-img-wrap">
                <img v-if="previewImage || displayAvatarUrl" :src="previewImage || displayAvatarUrl" alt="profile" class="avatar-img" @error="imgLoadError = true" />
                <div v-else class="avatar-initials">{{ userInitials }}</div>
              </div>
              <div class="avatar-hover">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                <span>گۆڕین</span>
              </div>
              <div v-if="uploadingImage" class="avatar-spin">
                <svg viewBox="0 0 44 44"><circle cx="22" cy="22" r="18" fill="none" stroke-width="2.5" stroke-dasharray="90 24" stroke-linecap="round"/></svg>
              </div>
            </div>
            <input ref="fileInputRef" type="file" accept="image/jpeg,image/png,image/gif,image/webp" class="visually-hidden" @change="handleFileChange" />

            <div v-if="selectedFile" class="avatar-actions">
              <button class="aa-btn aa-btn--save" @click="uploadProfileImage" :disabled="uploadingImage">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                پاشەکەوت
              </button>
              <button class="aa-btn aa-btn--discard" @click="cancelImageChange">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M18 6 6 18M6 6l12 12"/></svg>
              </button>
            </div>
            <button v-if="hasLocalImage && !selectedFile" class="avatar-remove" @click="removeProfileImage" :disabled="removingImage">
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
              سڕینەوەی وێنە
            </button>
            <p v-if="imageError" class="avatar-err">{{ imageError }}</p>
          </div>

          <!-- identity -->
          <div class="sidebar__identity">
            <h2 class="sidebar__name">{{ userProfile?.name || userProfile?.username }}</h2>
            <div class="sidebar__role" :class="`role--${(userProfile?.role || '').toLowerCase()}`">
              {{ getRoleLabel(userProfile?.role) }}
            </div>
            <div class="sidebar__email">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              {{ userProfile?.email }}
            </div>
          </div>
        </div>

        <!-- divider -->
        <div class="sidebar__divider"></div>

        <!-- stats -->
        <div class="sidebar__stats">
          <div class="s-stat">
            <span class="s-stat__lbl">بەشداربوون</span>
            <span class="s-stat__val">{{ joinDate }}</span>
          </div>
          <div class="s-stat">
            <span class="s-stat__lbl">دۆخی ئەژمار</span>
            <span class="s-stat__val" :class="userProfile?.isActivated ? 'clr--green' : 'clr--amber'">
              <span class="s-stat__dot" :class="userProfile?.isActivated ? 's-stat__dot--green' : 's-stat__dot--amber'"></span>
              {{ userProfile?.isActivated ? 'چالاک' : 'ناچالاک' }}
            </span>
          </div>
        </div>

        <!-- expiry warning -->
        <div v-if="passwordExpiryWarning" class="sidebar__warning">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          {{ passwordExpiryWarning }}
        </div>

        <!-- breadcrumb at bottom -->
        <nav class="sidebar__breadcrumb">
          <router-link to="/" class="sidebar__bc-link">سەرەتا</router-link>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
          <span>پرۆفایل</span>
        </nav>
      </aside>

      <!-- ▌ MAIN ▌ -->
      <main class="pp-main">

        <!-- page title -->
        <header class="pp-main__header">
          <h1 class="pp-main__title">بەڕێوەبردنی ئەژمار</h1>
          <p class="pp-main__sub">زانیارییەکانت بگۆڕە و ئەژمارەکەت بەڕێوەببە</p>
        </header>

        <!-- ── Basic info ── -->
        <div class="fc">
          <div class="fc__label">
            <div class="fc__label-icon fc__label-icon--teal">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
            <div>
              <div class="fc__label-title">زانیارییەکانی بنەڕەتی</div>
              <div class="fc__label-desc">ناو و بەکارهێنەرت بگۆڕە</div>
            </div>
          </div>
          <div class="fc__body">
            <div class="fg-row">
              <div class="fg">
                <label class="fg__label">ناوی بەکارهێنەر <span class="fg__req">*</span></label>
                <div class="fg__wrap" :class="{ 'fg__wrap--err': profileErrors.username }">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 1 0-16 0"/></svg>
                  <input v-model.trim="profileForm.username" type="text" class="fg__input" @blur="validateProfile('username')" />
                </div>
                <span v-if="profileErrors.username" class="fg__err">{{ profileErrors.username }}</span>
              </div>
              <div class="fg">
                <label class="fg__label">ناوی تەواو</label>
                <div class="fg__wrap">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  <input v-model.trim="profileForm.name" type="text" class="fg__input" placeholder="ناوی تەواو" />
                </div>
              </div>
            </div>
            <div class="fg">
              <label class="fg__label">ئیمەیڵ</label>
              <div class="fg__wrap fg__wrap--locked">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                <input type="email" class="fg__input" :value="profileForm.email" disabled />
                <div class="fg__lock">
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  قەفڵکراو
                </div>
              </div>
            </div>
            <div class="fc__footer">
              <button class="btn btn--primary" @click="updateProfile" :disabled="updatingProfile">
                <template v-if="!updatingProfile">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  پاشەکەوتکردنی گۆڕانکارییەکان
                </template>
                <span v-else class="spinner"></span>
              </button>
            </div>
          </div>
        </div>

        <!-- ── Password ── -->
        <div v-if="!isOAuth2" class="fc">
          <div class="fc__label">
            <div class="fc__label-icon fc__label-icon--copper">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </div>
            <div>
              <div class="fc__label-title">گۆڕینی وشەی نهێنی</div>
              <div class="fc__label-desc">وشەی نهێنیێکی بەهێز بەکاربهێنە</div>
            </div>
          </div>
          <div class="fc__body">
            <div class="fg">
              <label class="fg__label">وشەی نهێنیی ئێستا <span class="fg__req">*</span></label>
              <div class="fg__wrap" :class="{ 'fg__wrap--err': pwErrors.currentPassword }">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <input v-model="pwForm.currentPassword" :type="showCurrent ? 'text' : 'password'" class="fg__input" placeholder="••••••••" @blur="validatePw('currentPassword')" />
                <button type="button" class="fg__eye" @click="showCurrent = !showCurrent">
                  <svg v-if="showCurrent" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  <svg v-else width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                </button>
              </div>
              <span v-if="pwErrors.currentPassword" class="fg__err">{{ pwErrors.currentPassword }}</span>
            </div>
            <div class="fg-row">
              <div class="fg">
                <label class="fg__label">وشەی نهێنیی نوێ <span class="fg__req">*</span></label>
                <div class="fg__wrap" :class="{ 'fg__wrap--err': pwErrors.newPassword }">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  <input v-model="pwForm.newPassword" :type="showNew ? 'text' : 'password'" class="fg__input" placeholder="••••••••" @blur="validatePw('newPassword')" @input="validatePw('confirmPassword')" />
                  <button type="button" class="fg__eye" @click="showNew = !showNew">
                    <svg v-if="showNew" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    <svg v-else width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  </button>
                </div>
                <div v-if="pwForm.newPassword" class="pw-meter">
                  <div class="pw-meter__track">
                    <div class="pw-meter__fill" :class="`pw-meter__fill--${pwStrengthLevel}`" :style="{ width: (pwStrength * 25) + '%' }"></div>
                  </div>
                  <span class="pw-meter__label" :class="`pw-meter__label--${pwStrengthLevel}`">{{ pwStrengthText }}</span>
                </div>
                <span v-if="pwErrors.newPassword" class="fg__err">{{ pwErrors.newPassword }}</span>
              </div>
              <div class="fg">
                <label class="fg__label">دووبارەکردنەوە <span class="fg__req">*</span></label>
                <div class="fg__wrap"
                  :class="{ 'fg__wrap--err': pwErrors.confirmPassword, 'fg__wrap--ok': pwForm.confirmPassword && !pwErrors.confirmPassword && pwForm.newPassword === pwForm.confirmPassword }">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  <input v-model="pwForm.confirmPassword" :type="showNew ? 'text' : 'password'" class="fg__input" placeholder="••••••••" @blur="validatePw('confirmPassword')" />
                  <svg v-if="pwForm.confirmPassword && pwForm.newPassword === pwForm.confirmPassword" class="fg__ok-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <span v-if="pwErrors.confirmPassword" class="fg__err">{{ pwErrors.confirmPassword }}</span>
              </div>
            </div>
            <div class="fc__footer">
              <button class="btn btn--copper" @click="changePassword" :disabled="changingPassword || !isPwValid">
                <template v-if="!changingPassword">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  نوێکردنەوەی وشەی نهێنی
                </template>
                <span v-else class="spinner"></span>
              </button>
            </div>
          </div>
        </div>

        <!-- ── OAuth notice ── -->
        <div v-else class="fc fc--oauth">
          <div class="fc__label">
            <div class="fc__label-icon fc__label-icon--teal">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            </div>
            <div>
              <div class="fc__label-title">وشەی نهێنی</div>
              <div class="fc__label-desc">بەڕێوەکردن لە {{ providerLabel }}</div>
            </div>
          </div>
          <div class="fc__body">
            <p class="fc__oauth-note">چونکە لە ڕێگەی <strong>{{ providerLabel }}</strong> داخڵ بووی، وشەی نهێنی لەو سایتە بەڕێوەدەچێت و ئێرەدا ناتوانرێت بگۆڕدرێت.</p>
          </div>
        </div>

        <!-- ── Danger zone ── -->
        <div class="fc fc--danger">
          <div class="fc__label">
            <div class="fc__label-icon fc__label-icon--red">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </div>
            <div>
              <div class="fc__label-title fc__label-title--red">ناوچەی مەترسیدار</div>
              <div class="fc__label-desc">ئەم کردارانە ناتوانرێن پاشگەز بکرێنەوە</div>
            </div>
          </div>
          <div class="fc__body">
            <div class="dz-list">
              <div class="dz-row">
                <div class="dz-row__info">
                  <div class="dz-row__ico">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
                  </div>
                  <div>
                    <div class="dz-row__title">دەرچوون لە ھەموو ئامێرەکان</div>
                    <div class="dz-row__desc">بەشداریت لە ھەموو شوێنێک کۆتایی دێت</div>
                  </div>
                </div>
                <button class="btn btn--outline-red" @click="logoutAllDevices" :disabled="loggingOutAll">
                  <template v-if="!loggingOutAll">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                    دەرچوونی گشتی
                  </template>
                  <span v-else class="spinner spinner--sm"></span>
                </button>
              </div>
              <div class="dz-row dz-row--critical">
                <div class="dz-row__info">
                  <div class="dz-row__ico dz-row__ico--red">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M9 6V4h6v2"/></svg>
                  </div>
                  <div>
                    <div class="dz-row__title dz-row__title--red">سڕینەوەی ئەژمار</div>
                    <div class="dz-row__desc">ھەموو زانیارییەکانت بە تەواوەتی سڕدرێتەوە</div>
                  </div>
                </div>
                <button class="btn btn--red" @click="openDeleteModal">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
                  سڕینەوەی ئەژمار
                </button>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>

    <!-- ░░ Delete Modal ░░ -->
    <Transition name="modal-fade">
      <div v-if="showDeleteModal" class="modal-veil" @click.self="showDeleteModal = false">
        <div class="modal-box">
          <div class="modal-box__strip"></div>
          <div class="modal-box__body">
            <div class="modal-box__icon">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </div>
            <h3 class="modal-box__title">دڵنیای لە سڕینەوەی ئەژمار؟</h3>
            <p class="modal-box__text">ئەم کردارە ھەرگیز پاشگەز ناکرێتەوە. ھەموو داتاکانت بە تەواوەتی سڕدرێتەوە.</p>
            <div class="modal-box__confirm">
              <label class="fg__label fg__label--sm">بنووسە: <strong class="clr--red">سڕینەوە</strong></label>
              <input v-model="deleteConfirmText" type="text" class="fg__input fg__input--block" placeholder="سڕینەوە" />
            </div>
            <div class="modal-box__actions">
              <button class="btn btn--ghost" @click="showDeleteModal = false">پاشگەزبوونەوە</button>
              <button class="btn btn--red" @click="deleteAccount" :disabled="deletingAccount || deleteConfirmText !== 'سڕینەوە'">
                <template v-if="!deletingAccount">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
                  بەڵێ، بیسڕەوە
                </template>
                <span v-else class="spinner"></span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ░░ Toast ░░ -->
    <Transition name="toast-slide">
      <div v-if="toast.show" class="toast" :class="`toast--${toast.type}`">
        <div class="toast__bar"></div>
        <div class="toast__inner">
          <div class="toast__ico">
            <svg v-if="toast.type === 'success'" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
            <svg v-else width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </div>
          <span class="toast__msg">{{ toast.message }}</span>
          <button class="toast__close" @click="toast.show = false">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'

const router    = useRouter()
const authStore = useAuthStore()
const API_BASE  = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

const loading        = ref(true)
const userProfile    = ref(null)
const imgLoadError   = ref(false)
const fileInputRef   = ref(null)
const selectedFile   = ref(null)
const previewImage   = ref(null)
const uploadingImage = ref(false)
const removingImage  = ref(false)
const isDragOver     = ref(false)
const imageError     = ref('')
const updatingProfile  = ref(false)
const profileForm      = reactive({ username: '', name: '', email: '' })
const profileErrors    = reactive({ username: '' })
const changingPassword = ref(false)
const showCurrent = ref(false)
const showNew     = ref(false)
const pwForm   = reactive({ currentPassword: '', newPassword: '', confirmPassword: '' })
const pwErrors = reactive({ currentPassword: '', newPassword: '', confirmPassword: '' })
const loggingOutAll    = ref(false)
const showDeleteModal  = ref(false)
const deletingAccount  = ref(false)
const deleteConfirmText = ref('')
const toast = reactive({ show: false, message: '', type: 'success' })

const isOAuth2      = computed(() => userProfile.value?.provider && userProfile.value.provider !== 'local')
const providerLabel = computed(() => { const p = userProfile.value?.provider || ''; return p.charAt(0).toUpperCase() + p.slice(1) })
const hasLocalImage = computed(() => !!userProfile.value?.profileImage)
const displayAvatarUrl = computed(() => {
  if (imgLoadError.value) return null
  const local = userProfile.value?.profileImage
  const oauth = userProfile.value?.imageUrl
  if (local) return local.startsWith('http') ? local : `${API_BASE}/${local}`
  return oauth || null
})
const userInitials = computed(() => {
  const n = userProfile.value?.name || userProfile.value?.username || ''
  return n.split(' ').map(x => x[0]).join('').toUpperCase().slice(0, 2) || 'K'
})
const joinDate = computed(() => {
  if (!userProfile.value?.createdAt) return '—'
  return new Date(userProfile.value.createdAt).toLocaleDateString('ckb-IQ', { year: 'numeric', month: 'long', day: 'numeric' })
})
const passwordExpiryWarning = computed(() => {
  if (isOAuth2.value || !userProfile.value?.passwordExpiryDate) return null
  const days = Math.ceil((new Date(userProfile.value.passwordExpiryDate) - Date.now()) / 86400000)
  return (days >= 0 && days <= 7) ? `وشەی نهێنیت لە ${days} ڕۆژی دیکە بەسەردێت` : null
})
const pwStrength      = computed(() => { const p = pwForm.newPassword; if (!p) return 0; let s = 0; if (p.length >= 8) s++; if (/[A-Z]/.test(p)) s++; if (/[0-9]/.test(p)) s++; if (/[^A-Za-z0-9]/.test(p)) s++; return s })
const pwStrengthLevel = computed(() => (['', 'weak', 'fair', 'good', 'strong'])[pwStrength.value])
const pwStrengthText  = computed(() => ({ weak: 'قەیلە', fair: 'ناوەند', good: 'باش', strong: 'زۆر باش' })[pwStrengthLevel.value] || '')
const isPwValid       = computed(() => pwForm.currentPassword.length > 0 && pwForm.newPassword.length >= 6 && pwForm.newPassword === pwForm.confirmPassword)

function getRoleLabel(r) { return { GUEST: 'میوان', EMPLOYEE: 'فەرمانبەر', ADMIN: 'بەرپرس', SUPER_ADMIN: 'بەرپڕسی باڵا' }[r] || r || '' }
function showToast(message, type = 'success') { Object.assign(toast, { message, type, show: true }); setTimeout(() => { toast.show = false }, 3500) }
function validateProfile(f) { if (f === 'username') profileErrors.username = !profileForm.username ? 'ناوی بەکارهێنەر پێویستە' : profileForm.username.length < 3 ? 'کەمترین ٣ پیت' : '' }
function validatePw(f) {
  if (f === 'currentPassword') pwErrors.currentPassword = pwForm.currentPassword ? '' : 'وشەی نهێنیی ئێستا پێویستە'
  if (f === 'newPassword')     pwErrors.newPassword = !pwForm.newPassword ? 'پێویستە' : pwForm.newPassword.length < 6 ? 'کەمترین ٦ پیت' : ''
  if (f === 'confirmPassword') pwErrors.confirmPassword = !pwForm.confirmPassword ? 'پێویستە' : pwForm.confirmPassword !== pwForm.newPassword ? 'یەک ناکەن' : ''
}
async function fetchProfile() {
  try {
    const res = await fetch(`${API_BASE}/api/user/me`, { headers: authStore.authHeader() })
    if (res.status === 401) { await authStore.logout(); router.push('/login'); return }
    if (!res.ok) throw new Error()
    const data = await res.json()
    userProfile.value = data; profileForm.username = data.username || ''; profileForm.name = data.name || ''; profileForm.email = data.email || ''
  } catch { showToast('ھەڵە لە وەرگرتنی زانیارییەکان', 'error') } finally { loading.value = false }
}
async function updateProfile() {
  validateProfile('username'); if (profileErrors.username) return
  updatingProfile.value = true
  try {
    const res = await fetch(`${API_BASE}/api/user/profile`, { method: 'PUT', headers: { ...authStore.authHeader(), 'Content-Type': 'application/json' }, body: JSON.stringify({ username: profileForm.username, name: profileForm.name }) })
    if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.message || `HTTP ${res.status}`) }
    userProfile.value = { ...userProfile.value, ...await res.json() }; await authStore.hydrate()
    showToast('زانیارییەکان نوێ کرانەوە')
    setTimeout(() => router.push('/'), 1200)
  } catch (err) { showToast(err.message || 'ھەڵە', 'error') } finally { updatingProfile.value = false }
}
async function changePassword() {
  ['currentPassword', 'newPassword', 'confirmPassword'].forEach(f => validatePw(f))
  if (Object.values(pwErrors).some(e => e)) return
  changingPassword.value = true
  try {
    const res = await fetch(`${API_BASE}/api/user/password`, { method: 'PUT', headers: { ...authStore.authHeader(), 'Content-Type': 'application/json' }, body: JSON.stringify({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword }) })
    if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.message || 'هەڵە') }
    Object.assign(pwForm, { currentPassword: '', newPassword: '', confirmPassword: '' }); Object.assign(pwErrors, { currentPassword: '', newPassword: '', confirmPassword: '' })
    showToast('وشەی نهێنی گۆڕدرا')
  } catch (err) { showToast(err.message || 'ھەڵە', 'error') } finally { changingPassword.value = false }
}
function triggerFileInput() { fileInputRef.value?.click() }
function handleFileChange(e) { const f = e.target.files[0]; if (f) processFile(f) }
function handleDrop(e) { isDragOver.value = false; const f = e.dataTransfer.files[0]; if (f) processFile(f) }
function processFile(file) {
  if (!['image/jpeg','image/png','image/gif','image/webp'].includes(file.type)) { imageError.value = 'JPEG, PNG, GIF, WebP'; return }
  if (file.size > 5*1024*1024) { imageError.value = 'کەمترین ٥MB'; return }
  selectedFile.value = file; imageError.value = ''; imgLoadError.value = false
  const r = new FileReader(); r.onload = e => { previewImage.value = e.target.result }; r.readAsDataURL(file)
}
function cancelImageChange() { selectedFile.value = null; previewImage.value = null; imageError.value = ''; if (fileInputRef.value) fileInputRef.value.value = '' }
async function uploadProfileImage() {
  if (!selectedFile.value) return; uploadingImage.value = true
  const fd = new FormData(); fd.append('file', selectedFile.value)
  try {
    const res = await fetch(`${API_BASE}/api/user/profile-image`, { method: 'POST', headers: { Authorization: `Bearer ${authStore.token}` }, body: fd })
    if (!res.ok) throw new Error(await res.text())
    userProfile.value = { ...userProfile.value, ...await res.json() }
    cancelImageChange(); imgLoadError.value = false; await authStore.hydrate()
    showToast('وێنەی پرۆفایل نوێ کرایەوە')
  } catch { showToast('ھەڵە لە بارکردنی وێنە', 'error') } finally { uploadingImage.value = false }
}
async function removeProfileImage() {
  removingImage.value = true
  try {
    const res = await fetch(`${API_BASE}/api/user/profile-image`, { method: 'DELETE', headers: authStore.authHeader() })
    if (!res.ok) throw new Error()
    userProfile.value = { ...userProfile.value, ...await res.json() }; imgLoadError.value = false
    showToast('وێنەی پرۆفایل سڕایەوە')
  } catch { showToast('ھەڵە', 'error') } finally { removingImage.value = false }
}
async function logoutAllDevices() {
  loggingOutAll.value = true
  try {
    await fetch(`${API_BASE}/api/auth/logout-all`, { method: 'POST', headers: authStore.authHeader() })
    showToast('لە ھەموو ئامێرەکان دەرچووی')
    setTimeout(async () => { await authStore.logout(); router.push('/login') }, 1500)
  } catch { showToast('ھەڵە', 'error') } finally { loggingOutAll.value = false }
}
function openDeleteModal() { deleteConfirmText.value = ''; showDeleteModal.value = true }
async function deleteAccount() {
  if (deleteConfirmText.value !== 'سڕینەوە') return; deletingAccount.value = true
  try {
    const res = await fetch(`${API_BASE}/api/user/account`, { method: 'DELETE', headers: authStore.authHeader() })
    if (!res.ok) throw new Error()
    showToast('ئەژمارەکەت سڕایەوە'); await authStore.logout(); router.push('/')
  } catch { showToast('ھەڵە', 'error'); deletingAccount.value = false }
}
onMounted(() => { if (!authStore.isAuthenticated) { router.push('/login'); return } fetchProfile() })
</script>

<style scoped>
/* ═══════════════════════════════════════════════════
   TOKENS  — warm sand editorial
═══════════════════════════════════════════════════ */
.pp {
  /* core palette */
  --sand-0:    #FDFCF8;
  --sand-1:    #F7F4ED;
  --sand-2:    #EDE9DF;
  --sand-3:    #DDD8CC;
  --sand-4:    #C8C1B2;
  --ink:       #2A2720;
  --ink-2:     #4A453C;
  --ink-3:     #6B6459;
  --ink-4:     #8C8378;
  /* accent — forest green sidebar */
  --forest:    #1C3528;
  --forest-2:  #254535;
  --forest-3:  #2E5540;
  --forest-lt: rgba(28,53,40,.06);
  /* accent — copper/bronze */
  --copper:    #9B6128;
  --copper-lt: #B8793A;
  --copper-glow: rgba(155,97,40,.15);
  /* semantic */
  --teal:      #0D7377;
  --teal-lt:   rgba(13,115,119,.1);
  --green:     #2D7A4F;
  --amber:     #92600A;
  --red:       #C0392B;
  --red-lt:    rgba(192,57,43,.08);
  /* surfaces */
  --card-bg:   #FFFFFF;
  --card-border: rgba(0,0,0,.07);
  /* utils */
  --r:    18px;
  --r-sm: 10px;
  --r-xs:  6px;
  --sh:   0 1px 3px rgba(0,0,0,.06), 0 4px 16px rgba(0,0,0,.06);
  --sh-lg: 0 2px 4px rgba(0,0,0,.08), 0 12px 40px rgba(0,0,0,.1);
  --ease: cubic-bezier(.16,1,.3,1);
  --t:    .22s var(--ease);
  --font: 'Noto Kufi Arabic','Noto Sans Arabic',system-ui,sans-serif;
  /* layout */
  min-height: 100vh;
  background: var(--sand-1);
  direction: rtl;
  font-family: var(--font);
  color: var(--ink);
}

/* ── Background ── */
.pp-bg { position: fixed; inset: 0; z-index: 0; pointer-events: none; overflow: hidden; }
.pp-bg__sand {
  position: absolute; inset: 0;
  background: linear-gradient(160deg, var(--sand-0) 0%, var(--sand-1) 40%, #EDE7DC 100%);
}
.pp-bg__grid {
  position: absolute; inset: 0;
  background-image:
    linear-gradient(rgba(42,39,32,.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(42,39,32,.025) 1px, transparent 1px);
  background-size: 48px 48px;
}
.pp-bg__accent {
  position: absolute; width: 700px; height: 700px;
  top: -200px; right: -200px; border-radius: 50%;
  background: radial-gradient(circle, rgba(155,97,40,.06) 0%, transparent 70%);
}

/* ── Skeleton ── */
.pp-skeleton {
  position: relative; z-index: 1;
  display: grid; grid-template-columns: 300px 1fr; gap: 0;
  min-height: 100vh;
}
.sk-sidebar { background: var(--forest); }
.sk-main { padding: 2.5rem; display: flex; flex-direction: column; gap: 1.25rem; background: var(--sand-1); }
.sk {
  border-radius: var(--r-sm);
  background: linear-gradient(90deg, var(--sand-2) 0%, var(--sand-0) 50%, var(--sand-2) 100%);
  background-size: 200% 100%;
  animation: shimmer 1.8s ease-in-out infinite;
}
.sk--fill { width: 100%; height: 100%; border-radius: 0; background: linear-gradient(180deg, rgba(255,255,255,.04) 0%, rgba(255,255,255,.01) 100%); animation: none; }
.sk--h200 { height: 200px; }
.sk--h160 { height: 160px; }
.sk--h120 { height: 120px; }
@keyframes shimmer { from { background-position: 200% 0; } to { background-position: -200% 0; } }

/* ── Root grid ── */
.pp-root {
  position: relative; z-index: 1;
  display: grid;
  grid-template-columns: 300px 1fr;
  min-height: 100vh;
}
@media (max-width: 900px) { .pp-root { grid-template-columns: 1fr; } }

/* ═══════════════════════════════════════
   SIDEBAR  — forest green panel
═══════════════════════════════════════ */
.sidebar {
  background: var(--forest);
  display: flex; flex-direction: column;
  padding: 2.5rem 1.75rem;
  position: sticky; top: 0; height: 100vh; overflow-y: auto;
  /* subtle inner texture */
  background-image: radial-gradient(ellipse 120% 60% at 60% -10%, rgba(255,255,255,.04) 0%, transparent 60%);
}
.sidebar__top { flex: 1; }

.sidebar__eyebrow {
  display: flex; align-items: center; gap: .625rem;
  font-size: .65rem; font-weight: 800; letter-spacing: .16em; text-transform: uppercase;
  color: rgba(255,255,255,.4); margin-bottom: 2rem;
}
.sidebar__eyebrow-line {
  display: block; width: 24px; height: 1.5px;
  background: linear-gradient(90deg, rgba(255,255,255,.5), rgba(255,255,255,.1));
}

.sidebar__oauth {
  display: flex; align-items: center; gap: .5rem;
  font-size: .72rem; font-weight: 700;
  color: rgba(255,255,255,.6);
  background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.12);
  border-radius: var(--r-xs); padding: .45rem .75rem; margin-bottom: 1.5rem;
}

/* avatar */
.avatar-zone { text-align: center; margin-bottom: 2rem; }
.avatar-ring {
  width: 120px; height: 120px;
  margin: 0 auto 1rem; border-radius: 50%;
  position: relative; cursor: pointer;
  border: 2.5px solid rgba(255,255,255,.15);
  transition: border-color var(--t), transform var(--t);
  overflow: hidden;
}
.avatar-ring:hover, .avatar-ring--drag {
  border-color: var(--copper-lt);
  transform: scale(1.04);
}
.avatar-img-wrap { width: 100%; height: 100%; border-radius: 50%; overflow: hidden; }
.avatar-img { width: 100%; height: 100%; object-fit: cover; }
.avatar-initials {
  width: 100%; height: 100%;
  display: flex; align-items: center; justify-content: center;
  background: linear-gradient(145deg, var(--forest-3) 0%, var(--forest) 100%);
  color: rgba(255,255,255,.7); font-size: 2rem; font-weight: 900;
  border: 2px solid rgba(255,255,255,.08);
}
.avatar-hover {
  position: absolute; inset: 0; border-radius: 50%;
  background: rgba(0,0,0,.6); backdrop-filter: blur(4px);
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: .35rem; color: rgba(255,255,255,.9); opacity: 0; transition: opacity var(--t);
}
.avatar-hover span { font-size: .7rem; font-weight: 700; }
.avatar-ring:hover .avatar-hover { opacity: 1; }
.avatar-spin {
  position: absolute; inset: -3px;
  width: calc(100% + 6px); height: calc(100% + 6px);
  animation: spin .9s linear infinite;
}
.avatar-spin svg { width: 100%; height: 100%; }
.avatar-spin svg circle { stroke: var(--copper-lt); }
@keyframes spin { to { transform: rotate(360deg); } }

.avatar-actions { display: flex; gap: .5rem; justify-content: center; margin-bottom: .5rem; }
.aa-btn {
  display: inline-flex; align-items: center; gap: .3rem;
  padding: .4rem .75rem; border: none; border-radius: var(--r-xs);
  font-family: var(--font); font-size: .72rem; font-weight: 700; cursor: pointer; transition: all var(--t);
}
.aa-btn--save { background: var(--copper-lt); color: #fff; }
.aa-btn--save:hover { background: var(--copper); }
.aa-btn--discard { background: rgba(255,255,255,.08); color: rgba(255,255,255,.6); }
.aa-btn--discard:hover { background: rgba(255,255,255,.14); }

.avatar-remove {
  display: inline-flex; align-items: center; gap: .3rem;
  background: none; border: none; color: rgba(255,255,255,.3);
  font-family: var(--font); font-size: .7rem; cursor: pointer; transition: color var(--t);
}
.avatar-remove:hover { color: #FF8080; }
.avatar-err { color: #FF8080; font-size: .72rem; margin-top: .25rem; }

/* identity */
.sidebar__identity { text-align: center; }
.sidebar__name { font-size: 1.125rem; font-weight: 800; color: rgba(255,255,255,.92); margin: 0 0 .5rem; }
.sidebar__role {
  display: inline-flex; align-items: center;
  padding: .22rem .75rem; border-radius: 100px;
  font-size: .62rem; font-weight: 800; letter-spacing: .1em; text-transform: uppercase;
  margin-bottom: .625rem;
}
.role--guest     { background: rgba(45,122,79,.25);  color: #7DE8A8;  border: 1px solid rgba(45,122,79,.4); }
.role--employee  { background: rgba(13,115,119,.25); color: #7DE8E8;  border: 1px solid rgba(13,115,119,.4); }
.role--admin,
.role--super_admin { background: rgba(155,97,40,.3); color: var(--copper-lt); border: 1px solid rgba(155,97,40,.45); }
.sidebar__email {
  display: flex; align-items: center; justify-content: center; gap: .375rem;
  color: rgba(255,255,255,.35); font-size: .775rem;
}

/* divider */
.sidebar__divider {
  width: 100%; height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.1), transparent);
  margin: 1.75rem 0;
}

/* stats */
.sidebar__stats { display: flex; flex-direction: column; gap: .75rem; margin-bottom: 1.25rem; }
.s-stat {
  display: flex; justify-content: space-between; align-items: center;
  padding: .625rem .875rem;
  background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.07);
  border-radius: var(--r-xs);
}
.s-stat__lbl { font-size: .72rem; color: rgba(255,255,255,.35); font-weight: 600; }
.s-stat__val {
  display: flex; align-items: center; gap: .375rem;
  font-size: .8rem; font-weight: 800; color: rgba(255,255,255,.75);
}
.s-stat__dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
.s-stat__dot--green { background: #7DE8A8; box-shadow: 0 0 6px rgba(125,232,168,.6); }
.s-stat__dot--amber { background: #FFD166; }
.clr--green { color: #7DE8A8; }
.clr--amber { color: #FFD166; }

/* expiry */
.sidebar__warning {
  display: flex; align-items: flex-start; gap: .5rem;
  padding: .75rem .875rem; border-radius: var(--r-xs);
  background: rgba(255,209,102,.08); border: 1px solid rgba(255,209,102,.2);
  color: #FFD166; font-size: .76rem; line-height: 1.55; margin-bottom: .75rem;
}

/* breadcrumb */
.sidebar__breadcrumb {
  display: flex; align-items: center; gap: .375rem;
  font-size: .7rem; color: rgba(255,255,255,.25);
  margin-top: auto; padding-top: 1.5rem;
}
.sidebar__bc-link {
  color: rgba(255,255,255,.35); text-decoration: none; transition: color var(--t);
}
.sidebar__bc-link:hover { color: rgba(255,255,255,.6); }

/* ═══════════════════════════════════════
   MAIN AREA
═══════════════════════════════════════ */
.pp-main {
  padding: 3rem 2.5rem 4rem;
  background: var(--sand-1);
  display: flex; flex-direction: column; gap: 1.5rem;
}
@media (max-width: 640px) { .pp-main { padding: 2rem 1.25rem 3rem; } }

.pp-main__header { margin-bottom: .5rem; }
.pp-main__title {
  font-size: 1.625rem; font-weight: 900; color: var(--ink);
  margin: 0 0 .25rem; letter-spacing: -.02em;
}
.pp-main__sub { font-size: .875rem; color: var(--ink-4); margin: 0; }

/* ── Form card ── */
.fc {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: var(--r);
  box-shadow: var(--sh);
  overflow: hidden;
  transition: box-shadow var(--t);
}
.fc:hover { box-shadow: var(--sh-lg); }
.fc--oauth { border-right: 3px solid var(--teal); }
.fc--danger { border-right: 3px solid var(--red); }

.fc__label {
  display: flex; align-items: center; gap: .875rem;
  padding: 1.125rem 1.5rem;
  background: var(--sand-0);
  border-bottom: 1px solid var(--sand-2);
}
.fc__label-icon {
  width: 36px; height: 36px; border-radius: var(--r-xs); flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
}
.fc__label-icon--teal   { background: var(--teal-lt);   color: var(--teal); }
.fc__label-icon--copper { background: var(--copper-glow); color: var(--copper); }
.fc__label-icon--red    { background: var(--red-lt);    color: var(--red); }
.fc__label-title { font-size: .9rem; font-weight: 800; color: var(--ink); }
.fc__label-title--red { color: var(--red); }
.fc__label-desc  { font-size: .775rem; color: var(--ink-4); margin-top: .1rem; }

.fc__body { padding: 1.5rem; display: flex; flex-direction: column; gap: 1.125rem; }
.fc__footer { padding-top: .25rem; }

.fc__oauth-note { color: var(--ink-3); font-size: .875rem; line-height: 1.7; margin: 0; }
.fc__oauth-note strong { color: var(--teal); }

/* ── Form groups ── */
.fg-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
@media (max-width: 580px) { .fg-row { grid-template-columns: 1fr; } }
.fg { display: flex; flex-direction: column; gap: .375rem; }

.fg__label {
  font-size: .78rem; font-weight: 700; color: var(--ink-3);
  display: flex; align-items: center; gap: .25rem;
}
.fg__label--sm { font-size: .75rem; }
.fg__req { color: var(--copper); }

.fg__wrap {
  display: flex; align-items: center; gap: .625rem;
  background: var(--sand-1); border: 1.5px solid var(--sand-3);
  border-radius: var(--r-sm); padding: 0 .875rem;
  transition: all var(--t);
}
.fg__wrap svg:first-child { color: var(--sand-4); flex-shrink: 0; }
.fg__wrap:focus-within {
  border-color: var(--forest-3);
  background: #fff;
  box-shadow: 0 0 0 3px var(--forest-lt);
}
.fg__wrap--err  { border-color: var(--red)!important; background: rgba(192,57,43,.03)!important; box-shadow: none!important; }
.fg__wrap--ok   { border-color: var(--green)!important; }
.fg__wrap--locked { opacity: .65; cursor: not-allowed; }

.fg__input {
  flex: 1; padding: .8rem 0; background: transparent;
  border: none; outline: none; font-family: var(--font);
  font-size: .9375rem; color: var(--ink); caret-color: var(--forest-3);
}
.fg__input:disabled { cursor: not-allowed; }
.fg__input--block {
  width: 100%; padding: .8rem .875rem;
  background: var(--sand-1); border: 1.5px solid var(--sand-3);
  border-radius: var(--r-sm); color: var(--ink); font-family: var(--font);
  font-size: .9375rem; outline: none; transition: all var(--t); box-sizing: border-box;
  caret-color: var(--forest-3);
}
.fg__input--block:focus {
  border-color: var(--forest-3); background: #fff;
  box-shadow: 0 0 0 3px var(--forest-lt);
}
.fg__lock {
  display: flex; align-items: center; gap: .25rem;
  font-size: .65rem; font-weight: 700; color: var(--ink-4);
  background: var(--sand-2); border-radius: var(--r-xs);
  padding: .2rem .5rem; white-space: nowrap;
}
.fg__eye {
  background: none; border: none; cursor: pointer;
  color: var(--sand-4); padding: .375rem; display: flex;
  align-items: center; transition: color var(--t);
}
.fg__eye:hover { color: var(--forest-3); }
.fg__ok-icon { color: var(--green); }
.fg__err { font-size: .72rem; color: var(--red); font-weight: 700; }

/* password meter */
.pw-meter { display: flex; align-items: center; gap: .75rem; margin-top: .25rem; }
.pw-meter__track {
  flex: 1; height: 3px; border-radius: 2px;
  background: var(--sand-2); overflow: hidden;
}
.pw-meter__fill {
  height: 100%; border-radius: 2px;
  transition: width .4s var(--ease), background .3s;
}
.pw-meter__fill--weak   { background: var(--red); }
.pw-meter__fill--fair   { background: #C07800; }
.pw-meter__fill--good   { background: var(--teal); }
.pw-meter__fill--strong { background: var(--green); }
.pw-meter__label { font-size: .7rem; font-weight: 800; flex-shrink: 0; }
.pw-meter__label--weak   { color: var(--red); }
.pw-meter__label--fair   { color: #C07800; }
.pw-meter__label--good   { color: var(--teal); }
.pw-meter__label--strong { color: var(--green); }

/* ── Buttons ── */
.btn {
  display: inline-flex; align-items: center; gap: .5rem;
  padding: .7rem 1.5rem; border: none; border-radius: var(--r-sm);
  font-family: var(--font); font-size: .875rem; font-weight: 800;
  cursor: pointer; transition: all var(--t); white-space: nowrap;
}
.btn:disabled { opacity: .5; cursor: not-allowed; pointer-events: none; }

.btn--primary {
  background: var(--forest); color: rgba(255,255,255,.9);
  box-shadow: 0 4px 14px rgba(28,53,40,.3);
}
.btn--primary:hover { background: var(--forest-2); box-shadow: 0 6px 20px rgba(28,53,40,.4); transform: translateY(-1px); }

.btn--copper {
  background: var(--copper); color: #fff;
  box-shadow: 0 4px 14px rgba(155,97,40,.3);
}
.btn--copper:hover { background: var(--copper-lt); box-shadow: 0 6px 20px rgba(155,97,40,.4); transform: translateY(-1px); }

.btn--ghost {
  background: transparent; color: var(--ink-3);
  border: 1.5px solid var(--sand-3);
}
.btn--ghost:hover { background: var(--sand-1); }

.btn--red {
  background: var(--red); color: #fff;
  box-shadow: 0 4px 12px rgba(192,57,43,.25);
}
.btn--red:hover { background: #A8291D; transform: translateY(-1px); }

.btn--outline-red {
  background: transparent; color: var(--red);
  border: 1.5px solid rgba(192,57,43,.3);
}
.btn--outline-red:hover { background: var(--red-lt); border-color: var(--red); }

/* spinner */
.spinner {
  width: 16px; height: 16px; border-radius: 50%;
  border: 2px solid rgba(255,255,255,.25); border-top-color: currentColor;
  display: inline-block; animation: spin .7s linear infinite;
}
.spinner--sm { width: 13px; height: 13px; }

.visually-hidden { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; }

/* ── Danger list ── */
.dz-list { display: flex; flex-direction: column; gap: .75rem; }
.dz-row {
  display: flex; align-items: center; justify-content: space-between;
  flex-wrap: wrap; gap: 1rem;
  padding: 1rem 1.125rem;
  border-radius: var(--r-sm);
  background: var(--sand-1); border: 1px solid var(--sand-2);
}
.dz-row--critical { background: rgba(192,57,43,.02); border-color: rgba(192,57,43,.15); }
.dz-row__info { display: flex; align-items: center; gap: .875rem; flex: 1; min-width: 0; }
.dz-row__ico {
  width: 34px; height: 34px; border-radius: var(--r-xs); flex-shrink: 0;
  background: var(--sand-2); border: 1px solid var(--sand-3);
  display: flex; align-items: center; justify-content: center; color: var(--ink-4);
}
.dz-row__ico--red { background: var(--red-lt); border-color: rgba(192,57,43,.2); color: var(--red); }
.dz-row__title { font-size: .875rem; font-weight: 800; color: var(--ink); margin-bottom: .1rem; }
.dz-row__title--red { color: var(--red); }
.dz-row__desc  { font-size: .775rem; color: var(--ink-4); }

/* ═══════════════════════════════════════
   MODAL
═══════════════════════════════════════ */
.modal-veil {
  position: fixed; inset: 0; z-index: 1000;
  background: rgba(42,39,32,.5); backdrop-filter: blur(6px);
  display: flex; align-items: center; justify-content: center; padding: 1.5rem;
}
.modal-box {
  background: #fff; border-radius: var(--r);
  box-shadow: 0 8px 40px rgba(0,0,0,.18);
  max-width: 420px; width: 100%; overflow: hidden;
}
.modal-box__strip { height: 4px; background: var(--red); }
.modal-box__body  { padding: 2.25rem; text-align: center; }
.modal-box__icon {
  width: 58px; height: 58px; border-radius: 50%;
  background: var(--red-lt); border: 1px solid rgba(192,57,43,.2);
  color: var(--red); display: flex; align-items: center; justify-content: center;
  margin: 0 auto 1.25rem;
}
.modal-box__title { font-size: 1.0625rem; font-weight: 900; color: var(--ink); margin: 0 0 .625rem; }
.modal-box__text  { color: var(--ink-3); font-size: .875rem; line-height: 1.7; margin: 0 0 1.5rem; }
.modal-box__confirm { margin-bottom: 1.5rem; text-align: start; }
.modal-box__actions { display: flex; gap: .75rem; justify-content: center; }
.clr--red { color: var(--red); }

.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity .25s var(--ease); }
.modal-fade-enter-from,   .modal-fade-leave-to    { opacity: 0; }
.modal-fade-enter-active .modal-box, .modal-fade-leave-active .modal-box { transition: transform .25s var(--ease); }
.modal-fade-enter-from .modal-box, .modal-fade-leave-to .modal-box { transform: scale(.94) translateY(10px); }

/* ═══════════════════════════════════════
   TOAST
═══════════════════════════════════════ */
.toast {
  position: fixed; bottom: 2rem; left: 50%;
  transform: translateX(-50%);
  min-width: 280px; max-width: 380px;
  border-radius: var(--r-sm);
  box-shadow: 0 8px 32px rgba(0,0,0,.14);
  z-index: 1100; overflow: hidden;
  background: #fff; border: 1px solid var(--sand-2);
}
.toast__bar { height: 3px; }
.toast--success .toast__bar { background: var(--green); }
.toast--error   .toast__bar { background: var(--red); }
.toast__inner {
  display: flex; align-items: center; gap: .75rem;
  padding: .875rem 1.125rem;
}
.toast__ico {
  width: 24px; height: 24px; border-radius: 50%; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
}
.toast--success .toast__ico { background: rgba(45,122,79,.1); color: var(--green); }
.toast--error   .toast__ico { background: var(--red-lt); color: var(--red); }
.toast__msg { flex: 1; font-size: .875rem; font-weight: 700; color: var(--ink); }
.toast__close {
  background: none; border: none; cursor: pointer;
  color: var(--sand-4); padding: .25rem; display: flex;
  transition: color var(--t);
}
.toast__close:hover { color: var(--ink); }

.toast-slide-enter-active, .toast-slide-leave-active { transition: all .32s var(--ease); }
.toast-slide-enter-from, .toast-slide-leave-to { opacity: 0; transform: translateX(-50%) translateY(12px); }
</style>