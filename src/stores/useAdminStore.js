import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

const STORAGE_KEY = 'khi_admin_ui'

/**
 * Persists admin UI state across page reloads:
 *  - Sidebar slim/expanded
 *  - Publications accordion open/closed
 *  - Scroll positions per route
 *  - Draft form data per route
 */
export const useAdminStore = defineStore('adminUI', () => {
  // ── Load persisted state ─────────────────────────────────
  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : {}
    } catch {
      return {}
    }
  }

  const persisted = loadState()

  // ── Sidebar state ────────────────────────────────────────
  const sidebarSlim = ref(persisted.sidebarSlim ?? false)
  const pubAccordionOpen = ref(persisted.pubAccordionOpen ?? true)

  // ── Scroll positions (keyed by route path) ───────────────
  const scrollPositions = ref(persisted.scrollPositions ?? {})

  // ── Draft form data (keyed by route path) ────────────────
  const drafts = ref(persisted.drafts ?? {})

  // ── Last visited admin route ─────────────────────────────
  const lastRoute = ref(persisted.lastRoute ?? '/admin')

  // ── Save to localStorage on every change ─────────────────
  function persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        sidebarSlim: sidebarSlim.value,
        pubAccordionOpen: pubAccordionOpen.value,
        scrollPositions: scrollPositions.value,
        drafts: drafts.value,
        lastRoute: lastRoute.value,
      }))
    } catch {
      // Storage full or unavailable — ignore
    }
  }

  // Auto-persist on state changes
  watch(sidebarSlim, persist)
  watch(pubAccordionOpen, persist)
  watch(lastRoute, persist)

  // ── Scroll position helpers ──────────────────────────────
  function saveScrollPosition(routePath, position) {
    scrollPositions.value[routePath] = position
    persist()
  }

  function getScrollPosition(routePath) {
    return scrollPositions.value[routePath] ?? 0
  }

  // ── Draft form helpers ───────────────────────────────────
  function saveDraft(routePath, formData) {
    drafts.value[routePath] = {
      data: formData,
      savedAt: Date.now(),
    }
    persist()
  }

  function getDraft(routePath) {
    const draft = drafts.value[routePath]
    if (!draft) return null
    // Expire drafts older than 2 hours
    if (Date.now() - draft.savedAt > 2 * 60 * 60 * 1000) {
      delete drafts.value[routePath]
      persist()
      return null
    }
    return draft.data
  }

  function clearDraft(routePath) {
    delete drafts.value[routePath]
    persist()
  }

  function clearAllDrafts() {
    drafts.value = {}
    persist()
  }

  return {
    // Sidebar
    sidebarSlim,
    pubAccordionOpen,
    // Scroll
    saveScrollPosition,
    getScrollPosition,
    // Drafts
    saveDraft,
    getDraft,
    clearDraft,
    clearAllDrafts,
    // Route
    lastRoute,
  }
})
