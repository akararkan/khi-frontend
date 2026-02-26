/**
 * useLanguageStore.js
 * ─────────────────────────────────────────────────────────────
 * Central language/dialect store for Kurdish Heritage Institute.
 *
 * Two dialects supported:
 *   • CKB  – Sorani  (RTL, default)
 *   • KMR  – Kurmanji (LTR)
 *
 * This store is the SINGLE SOURCE OF TRUTH for:
 *   1. Which dialect is active
 *   2. All static UI strings (navbar, buttons, labels, etc.)
 *   3. Helper functions used by components to pick the right
 *      field from API responses (ckbContent vs kmrContent, etc.)
 * ─────────────────────────────────────────────────────────────
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// ─── Static UI Translations ──────────────────────────────────
const UI_STRINGS = {
  CKB: {
    // Direction & meta
    dir: 'rtl',
    code: 'ckb',
    name: 'کوردی (سۆرانی)',
    shortName: 'کوردی',
    dateLocales: ['ckb-IQ', 'ku-IQ', 'ar-IQ', 'en-US'],

    // Localized language names (for badges / chips)
    languageNames: {
      CKB: 'سۆرانی',
      KMR: 'کورمانجی',
      AR: 'عەرەبی',
      EN: 'ئینگلیزی',
    },

    // Navbar
    nav: {
      home: 'سەرەکی',
      projects: 'پڕۆژەکان',
      publishments: 'بڵاوکراوەکان',
      library: 'کتێبخانە',
      archive: 'ئەرشیڤ',
      services: 'خزمەتگوزارییەکان',
      about: 'دەربارە',
      contact: 'پەیوەندی',
      search: 'گەڕان',
      searchPlaceholder: 'گەڕان بکە...',
      login: 'چوونەژوورەوە',
      logout: 'چوونەدەرەوە',
      dashboard: 'داشبۆرد',
      language: 'زمان',
      quickSearch: 'گەڕانی خێرا:',
    },

    // Projects page
    projects: {
      pageTitle: 'ئەرشیڤی دیجیتاڵی',
      pageSubtitle: 'میراتی کوردی',
      heroSub: 'پاراستن و بڵاوکردنەوەی میراتی کلتووری کوردی بۆ نەوەکانی داهاتوو',

      heroStampText: 'ناوەندی میراتی کوردی',
      heroStampYear: '٢٠٢٤',
      heroKicker: 'ئەرشیڤی دیجیتاڵی',
      heroHeadlineDeco: '✦ ✦ ✦',
      heroHeadlineMain: 'میراتی کوردی',
      heroHeadlineSub: 'پاراستن · بڵاوکردنەوە · بیرکردنەوە',
      heroScrollLabel: 'کۆڵەکتیفەکان',
      heroScrollAria: 'دابەزین بۆ پڕۆژەکان',

      totalProjects: 'پڕۆژەی کۆ',
      shown: 'نیشاندراو',
      media: 'میدیا',
      loading: 'بارکردن...',
      noResults: 'هیچ پڕۆژەیەک نەدۆزرایەوە',
      noResultsHint: 'تکایە فلتەرێکی تر هەڵبژێرە یان ڕیسێت بکە',
      resetFilters: 'ڕیسێتی فلتەرەکان',
      toolbarResetTitle: 'ڕیسێت',
      foundResultsLabel: 'پڕۆژە دۆزرایەوە',

      viewProject: 'بینینی پڕۆژە',
      cardOpenAriaPrefix: 'بینینی',

      backToProjects: 'پڕۆژەکان',
      sortNewest: 'نوێترین',
      sortOldest: 'کۆنترین',
      sortTitle: 'ناونیشان',
      sortMedia: 'زۆرترین میدیا',

      completed: 'تەواو',
      ongoing: 'بەردەوام',
      completedBadge: '✓ تەواوبوو',
      ongoingBadge: '◌ بەردەوامە',

      contents: 'ناوەڕۆکەکان',
      keywords: 'کیووەردەکان',
      related: 'پڕۆژە پەیوەندیدارەکان',
      relatedSub: 'پڕۆژەکانی تر کە تاگی هاوبەشیان هەیە',

      allMedia: 'هەموو',
      expand: 'گەورەکردن',
      open: 'کردنەوە',
      openDocument: 'کردنەوە',
      zoomImage: 'گەورەکردن',

      prev: '→ پێشوو',
      next: 'دواتر ←',
      prevPage: '→ پێشوو',
      nextPage: 'دواتر ←',
      prevMedia: '→ پێشوو',
      nextMedia: 'دواتر ←',

      unnamed: 'دەنگی ناونیشان نەدراو',
      document: 'بەڵگەنامە',
      documentDefault: 'بەڵگەنامە',
      noTitle: 'بێ ناونیشان',
      coverLabel: 'کاڤەر',

      sorani: 'سۆرانی',
      kurmanji: 'کورمانجی',
      languageSwitchHint: 'زمانی سایت دەگۆڕێت لە نێڤبارەکەدا',
      projectHasSorani: 'پڕۆژەکە ناوەڕۆکی سۆرانیی هەیە',
      projectHasKurmanji: 'پڕۆژەکە ناوەڕۆکی کورمانجیی هەیە',

      emptyActiveLangMissingKMR:
        'پڕۆژەیەک بە زمانی کورمانجی نەدۆزرایەوە. زمانی سایت بگۆڕە بۆ سۆرانی بۆ دیتنی هەموو پڕۆژەکان.',
      emptyActiveLangMissingCKB:
        'هیچ پڕۆژەیەک بە زمانی سۆرانی نەدۆزرایەوە. زمانی سایت بگۆڕە بۆ کورمانجی بۆ دیتنی هەموو پڕۆژەکان.',

      requestFailed: 'فشەلبووی داواکاری',
      fetchFailed: 'فشەلبووی بارکردنی پڕۆژەکان',
    },

    // ─── Publishments page ───────────────────────────────────
    publishments: {
      heroStampText: 'بڵاوکراوەکانی پەیمانگا',
      heroStampYear: '٢٠٢٤',
      heroKicker: 'بڵاوکراوە و لێکۆڵینەوەکان',
      heroHeadlineDeco: '✦ ✦ ✦',
      heroHeadlineMain: 'بڵاوکراوەکان',
      heroHeadlineSub: 'لێکۆڵینەوە · بڵاوکردنەوە · زانست',
      heroScrollLabel: 'بڵاوکراوەکان',
      heroScrollAria: 'دابەزین بۆ بڵاوکراوەکان',

      totalPublishments: 'بڵاوکراوەی کۆ',
      shown: 'نیشاندراو',
      media: 'میدیا',
      loading: 'بارکردن...',
      noResults: 'هیچ بڵاوکراوەیەک نەدۆزرایەوە',
      noResultsHint: 'تکایە فلتەرێکی تر هەڵبژێرە یان ڕیسێت بکە',
      resetFilters: 'ڕیسێتی فلتەرەکان',
      toolbarResetTitle: 'ڕیسێت',
      foundResultsLabel: 'بڵاوکراوە دۆزرایەوە',

      viewPublishment: 'بینینی بڵاوکراوە',
      cardOpenAriaPrefix: 'بینینی',

      backToPublishments: 'بڵاوکراوەکان',
      sortNewest: 'نوێترین',
      sortOldest: 'کۆنترین',
      sortTitle: 'ناونیشان',
      sortMedia: 'زۆرترین میدیا',

      published: 'بڵاوکراوەتەوە',
      draft: 'ڕەشنووس',
      publishedBadge: '✓ بڵاوکراوەتەوە',
      draftBadge: '◌ ڕەشنووس',

      contents: 'ناوەڕۆکەکان',
      keywords: 'کیووەردەکان',
      related: 'بڵاوکراوە پەیوەندیدارەکان',
      relatedSub: 'بڵاوکراوەکانی تر کە تاگی هاوبەشیان هەیە',

      allMedia: 'هەموو',
      expand: 'گەورەکردن',
      open: 'کردنەوە',
      openDocument: 'کردنەوە',
      zoomImage: 'گەورەکردن',

      prev: '→ پێشوو',
      next: 'دواتر ←',
      prevPage: '→ پێشوو',
      nextPage: 'دواتر ←',
      prevMedia: '→ پێشوو',
      nextMedia: 'دواتر ←',

      unnamed: 'بڵاوکراوەی ناونیشان نەدراو',
      document: 'بەڵگەنامە',
      documentDefault: 'بەڵگەنامە',
      noTitle: 'بێ ناونیشان',
      coverLabel: 'کاڤەر',

      sorani: 'سۆرانی',
      kurmanji: 'کورمانجی',
      languageSwitchHint: 'زمانی سایت دەگۆڕێت لە نێڤبارەکەدا',
      publishmentHasSorani: 'بڵاوکراوەکە ناوەڕۆکی سۆرانیی هەیە',
      publishmentHasKurmanji: 'بڵاوکراوەکە ناوەڕۆکی کورمانجیی هەیە',

      emptyActiveLangMissingKMR:
        'بڵاوکراوەیەک بە زمانی کورمانجی نەدۆزرایەوە. زمانی سایت بگۆڕە بۆ سۆرانی بۆ دیتنی هەموو بڵاوکراوەکان.',
      emptyActiveLangMissingCKB:
        'هیچ بڵاوکراوەیەک بە زمانی سۆرانی نەدۆزرایەوە. زمانی سایت بگۆڕە بۆ کورمانجی بۆ دیتنی هەموو بڵاوکراوەکان.',

      requestFailed: 'فشەلبووی داواکاری',
      fetchFailed: 'فشەلبووی بارکردنی بڵاوکراوەکان',

      // Publishment types
      typeBook: 'کتێب',
      typeArticle: 'بابەت',
      typeJournal: 'گۆڤار',
      typeThesis: 'تێزی زانکۆیی',
      typeReport: 'ڕاپۆرت',
      typeMagazine: 'گۆڤار',
      typeNewspaper: 'ڕۆژنامە',
      typeOther: 'هیتر',

      authorLabel: 'نووسەر',
      publisherLabel: 'بڵاوکەرەوە',
      yearLabel: 'ساڵی بڵاوکردنەوە',
      isbnLabel: 'ISBN',
      pagesLabel: 'ژمارەی لاپەڕە',
      downloadPdf: 'داگرتنی PDF',
      readMore: 'زیاتر بخوێنەوە',
    },

    // Media types
    media: {
      IMAGE: 'وێنە',
      VIDEO: 'ڤیدیۆ',
      AUDIO: 'دەنگ',
      DOCUMENT: 'بەڵگەنامە',
      PDF: 'PDF',
      TEXT: 'دەق',
      OTHER: 'فایل',
    },

    // Common UI
    ui: {
      reset: 'ڕیسێت',
      close: 'داخستن',
      save: 'پاشەکەوتکردن',
      cancel: 'پەشیمانبوونەوە',
      confirm: 'دڵنیابوونەوە',
      search: 'گەڕان',
      filter: 'فلتەر',
      sort: 'ریزکردن',
      page: 'پەڕە',
      of: 'لە',
      prev: 'پێشوو',
      next: 'دواتر',
      loading: 'بارکردن...',
      error: 'هەڵە',
      success: 'سەرکەوتوو',
    },

    // Search overlay
    search: {
      title: 'گەڕان لە پەیمانگا',
      placeholder: 'گەڕان بکە...',
      quickLabel: 'گەڕانی خێرا:',
    },

    // Mobile menu
    mobile: {
      language: 'زمان',
      students: 'خوێندکاران',
      researchers: 'توێژەران',
      visitors: 'میوانان',
      partners: 'هاوبەشان',
    },
  },

  KMR: {
    // Direction & meta
    dir: 'ltr',
    code: 'kmr',
    name: 'Kurdî (Kurmancî)',
    shortName: 'Kurdî',
    dateLocales: ['ku-TR', 'ku', 'tr-TR', 'en-US'],

    // Localized language names
    languageNames: {
      CKB: 'Soranî',
      KMR: 'Kurmancî',
      AR: 'Erebî',
      EN: 'English',
    },

    // Navbar
    nav: {
      home: 'Sereke',
      projects: 'Proje',
      publishments: 'Weşan',
      library: 'Pirtûkxane',
      archive: 'Arşîv',
      services: 'Karûbar',
      about: 'Derbarê',
      contact: 'Têkilî',
      search: 'Lêgerîn',
      searchPlaceholder: 'Lêgerîn bike...',
      login: 'Têkeve',
      logout: 'Derkeve',
      dashboard: 'Panel',
      language: 'Ziman',
      quickSearch: 'Lêgerîna bilez:',
    },

    // Projects page
    projects: {
      pageTitle: 'Arşîva Dîjîtal',
      pageSubtitle: 'Mîrateya Kurdî',
      heroSub: 'Parastina mîrateya çandî ya Kurdî ji bo nifşên pêşerojê',

      heroStampText: 'Enstîtuya Mîrata Kurdî',
      heroStampYear: '2024',
      heroKicker: 'Arşîva Dîjîtal',
      heroHeadlineDeco: '✦ ✦ ✦',
      heroHeadlineMain: 'Mîrateya Kurdî',
      heroHeadlineSub: 'Parastin · Weşandin · Bîranîn',
      heroScrollLabel: 'Koleksîyon',
      heroScrollAria: 'Herin jêr bo projeyan',

      totalProjects: 'Tevî Proje',
      shown: 'Nîşandayî',
      media: 'Medya',
      loading: 'Barkirin...',
      noResults: 'Proje nehat dîtin',
      noResultsHint: 'Ji kerema xwe fîltireyek din hilbijêre yan riset bike',
      resetFilters: 'Fîltiran Riset Bike',
      toolbarResetTitle: 'Riset',
      foundResultsLabel: 'proje hatin dîtin',

      viewProject: 'Projeya Bibîne',
      cardOpenAriaPrefix: 'Vekirin',

      backToProjects: 'Proje',
      sortNewest: 'Nûtirîn',
      sortOldest: 'Kevntirîn',
      sortTitle: 'Sernavî',
      sortMedia: 'Zêdetirîn Medya',

      completed: 'Qediya',
      ongoing: 'Berdewam',
      completedBadge: '✓ Qediya',
      ongoingBadge: '◌ Berdewam e',

      contents: 'Naverok',
      keywords: 'Peyvên Sereke',
      related: 'Projeyên Têkildar',
      relatedSub: 'Projeyên din ên ku tagan hevpar hene',

      allMedia: 'Hemû',
      expand: 'Mezin bike',
      open: 'Veke',
      openDocument: 'Veke',
      zoomImage: 'Mezin bike',

      prev: 'Berê →',
      next: '← Paşê',
      prevPage: 'Berê →',
      nextPage: '← Paşê',
      prevMedia: 'Berê →',
      nextMedia: '← Paşê',

      unnamed: 'Dengê bê nav',
      document: 'Belge',
      documentDefault: 'Belge',
      noTitle: 'Bê Sernavî',
      coverLabel: 'Cover',

      sorani: 'Soranî',
      kurmanji: 'Kurmancî',
      languageSwitchHint: 'Ziman di barê jorîn de tê guhertin',
      projectHasSorani: 'Di vê projeyê de naveroka Soranî heye',
      projectHasKurmanji: 'Di vê projeyê de naveroka Kurmancî heye',

      emptyActiveLangMissingKMR:
        'Projeyek bi Kurmancî nehat dîtin. Zimanê malperê biguhêre Soranî da ku hemû proje bibînî.',
      emptyActiveLangMissingCKB:
        'Projeyek bi Soranî nehat dîtin. Zimanê malperê biguhêre Kurmancî da ku hemû proje bibînî.',

      requestFailed: 'Daxwaz têk çû',
      fetchFailed: 'Barkirina projeyan têk çû',
    },

    // ─── Publishments page ───────────────────────────────────
    publishments: {
      heroStampText: 'Weşanên Enstîtuyê',
      heroStampYear: '2024',
      heroKicker: 'Weşan û Lêkolîn',
      heroHeadlineDeco: '✦ ✦ ✦',
      heroHeadlineMain: 'Weşan',
      heroHeadlineSub: 'Lêkolîn · Weşandin · Zanist',
      heroScrollLabel: 'Weşan',
      heroScrollAria: 'Herin jêr bo weşanan',

      totalPublishments: 'Tevî Weşan',
      shown: 'Nîşandayî',
      media: 'Medya',
      loading: 'Barkirin...',
      noResults: 'Weşanek nehat dîtin',
      noResultsHint: 'Ji kerema xwe fîltireyek din hilbijêre yan riset bike',
      resetFilters: 'Fîltiran Riset Bike',
      toolbarResetTitle: 'Riset',
      foundResultsLabel: 'weşan hatin dîtin',

      viewPublishment: 'Weşanê Bibîne',
      cardOpenAriaPrefix: 'Vekirin',

      backToPublishments: 'Weşan',
      sortNewest: 'Nûtirîn',
      sortOldest: 'Kevntirîn',
      sortTitle: 'Sernavî',
      sortMedia: 'Zêdetirîn Medya',

      published: 'Weşandî',
      draft: 'Reşnivîs',
      publishedBadge: '✓ Weşandî',
      draftBadge: '◌ Reşnivîs',

      contents: 'Naverok',
      keywords: 'Peyvên Sereke',
      related: 'Weşanên Têkildar',
      relatedSub: 'Weşanên din ên ku tagan hevpar hene',

      allMedia: 'Hemû',
      expand: 'Mezin bike',
      open: 'Veke',
      openDocument: 'Veke',
      zoomImage: 'Mezin bike',

      prev: 'Berê →',
      next: '← Paşê',
      prevPage: 'Berê →',
      nextPage: '← Paşê',
      prevMedia: 'Berê →',
      nextMedia: '← Paşê',

      unnamed: 'Weşana bê nav',
      document: 'Belge',
      documentDefault: 'Belge',
      noTitle: 'Bê Sernavî',
      coverLabel: 'Cover',

      sorani: 'Soranî',
      kurmanji: 'Kurmancî',
      languageSwitchHint: 'Ziman di barê jorîn de tê guhertin',
      publishmentHasSorani: 'Di vê weşanê de naveroka Soranî heye',
      publishmentHasKurmanji: 'Di vê weşanê de naveroka Kurmancî heye',

      emptyActiveLangMissingKMR:
        'Weşanek bi Kurmancî nehat dîtin. Zimanê malperê biguhêre Soranî da ku hemû weşan bibînî.',
      emptyActiveLangMissingCKB:
        'Weşanek bi Soranî nehat dîtin. Zimanê malperê biguhêre Kurmancî da ku hemû weşan bibînî.',

      requestFailed: 'Daxwaz têk çû',
      fetchFailed: 'Barkirina weşanan têk çû',

      // Publishment types
      typeBook: 'Pirtûk',
      typeArticle: 'Gotar',
      typeJournal: 'Kovar',
      typeThesis: 'Tez',
      typeReport: 'Rapor',
      typeMagazine: 'Kovar',
      typeNewspaper: 'Rojname',
      typeOther: 'Yên din',

      authorLabel: 'Nivîskar',
      publisherLabel: 'Weşanxane',
      yearLabel: 'Sala Weşanê',
      isbnLabel: 'ISBN',
      pagesLabel: 'Hejmara Rûpelan',
      downloadPdf: 'PDF Daxîne',
      readMore: 'Zêdetir Bixwîne',
    },

    // Media types
    media: {
      IMAGE: 'Wêne',
      VIDEO: 'Vîdyo',
      AUDIO: 'Deng',
      DOCUMENT: 'Belge',
      PDF: 'PDF',
      TEXT: 'Nivîs',
      OTHER: 'Dosya',
    },

    // Common UI
    ui: {
      reset: 'Riset',
      close: 'Bigire',
      save: 'Tomar bike',
      cancel: 'Betal bike',
      confirm: 'Erê',
      search: 'Lêgerîn',
      filter: 'Fîltre',
      sort: 'Rêzkirin',
      page: 'Rûpel',
      of: 'ji',
      prev: 'Berê',
      next: 'Paşê',
      loading: 'Barkirin...',
      error: 'Çewtî',
      success: 'Serkeftî',
    },

    // Search overlay
    search: {
      title: 'Lêgerîna Enstîtuyê',
      placeholder: 'Lêgerîn bike...',
      quickLabel: 'Lêgerîna bilez:',
    },

    // Mobile menu
    mobile: {
      language: 'Ziman',
      students: 'Xwendekar',
      researchers: 'Lêkolîner',
      visitors: 'Mêvan',
      partners: 'Hevkar',
    },
  },
}

// ─── Store Definition ────────────────────────────────────────
export const useLanguageStore = defineStore('language', () => {
  // ── State ──────────────────────────────────────────────────
  const activeLang = ref('CKB') // 'CKB' | 'KMR'

  // ── Getters ────────────────────────────────────────────────
  const strings = computed(() => UI_STRINGS[activeLang.value])
  const dir = computed(() => UI_STRINGS[activeLang.value].dir)
  const isRTL = computed(() => activeLang.value === 'CKB')
  const isCKB = computed(() => activeLang.value === 'CKB')
  const isKMR = computed(() => activeLang.value === 'KMR')
  const dateLocales = computed(() => UI_STRINGS[activeLang.value].dateLocales || ['en-US'])

  // ── Internal helpers ───────────────────────────────────────
  function applyDocumentMeta(langCode) {
    if (typeof document === 'undefined') return
    const meta = UI_STRINGS[langCode]
    if (!meta) return
    document.documentElement.dir = meta.dir
    document.documentElement.lang = meta.code
  }

  function persistLanguage(langCode) {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('kurdish-lang', langCode)
      }
    } catch {
      // ignore storage errors
    }
  }

  function readSavedLanguage() {
    try {
      if (typeof localStorage !== 'undefined') {
        return localStorage.getItem('kurdish-lang')
      }
    } catch {
      // ignore storage errors
    }
    return null
  }

  // ── Actions ────────────────────────────────────────────────

  /**
   * Switch the active language. Updates <html> dir + lang attributes.
   * @param {'CKB'|'KMR'} langCode
   */
  function setLanguage(langCode) {
    if (!UI_STRINGS[langCode]) return
    activeLang.value = langCode
    applyDocumentMeta(langCode)
    persistLanguage(langCode)
  }

  function toggleLanguage() {
    setLanguage(activeLang.value === 'CKB' ? 'KMR' : 'CKB')
  }

  /**
   * Restore language from localStorage on app boot.
   * Call this once in App.vue onMounted().
   */
  function restoreLanguage() {
    const saved = readSavedLanguage()
    if (saved && UI_STRINGS[saved]) {
      setLanguage(saved)
    } else {
      setLanguage('CKB')
    }
  }

  // ── Translation helper ─────────────────────────────────────
  /**
   * Get a UI string by dot-path, e.g. t('nav.home'), t('projects.loading')
   * Falls back to key if not found.
   */
  function t(key) {
    const parts = key.split('.')
    let val = UI_STRINGS[activeLang.value]
    for (const part of parts) {
      val = val?.[part]
    }
    return val ?? key
  }

  function languageName(code) {
    return UI_STRINGS[activeLang.value]?.languageNames?.[code] || code
  }

  // ── API content helpers ────────────────────────────────────
  function getContent(project) {
    if (!project) return null
    if (activeLang.value === 'KMR' && project.kmrContent?.title) return project.kmrContent
    if (project.ckbContent?.title) return project.ckbContent
    return project.kmrContent || project.ckbContent || null
  }

  /**
   * Check if a project has content for a specific language.
   * @param {object} project
   * @param {'CKB'|'KMR'} langCode
   */
  function hasContentInLanguage(project, langCode = activeLang.value) {
    if (!project) return false

    const langs = Array.isArray(project.contentLanguages) ? project.contentLanguages : []
    if (langCode === 'KMR') {
      return langs.includes('KMR') && !!project.kmrContent?.title
    }
    return langs.includes('CKB') && !!project.ckbContent?.title
  }

  /** Get project title in active language */
  function title(project) {
    return getContent(project)?.title || t('projects.noTitle')
  }

  /** Get project description in active language */
  function description(project) {
    return getContent(project)?.description || ''
  }

  /** Get project location in active language */
  function location(project) {
    return getContent(project)?.location || ''
  }

  /** Get project type label in active language */
  function projectType(project) {
    if (!project) return ''
    if (activeLang.value === 'KMR' && project.projectTypeKmr) return project.projectTypeKmr
    return project.projectTypeCkb || project.projectTypeKmr || ''
  }

  /** Get publishment type label in active language */
  function publishmentType(pub) {
    if (!pub) return ''
    if (activeLang.value === 'KMR' && pub.publishmentTypeKmr) return pub.publishmentTypeKmr
    return pub.publishmentTypeCkb || pub.publishmentTypeKmr || ''
  }

  /** Get tags array in active language */
  function tags(project) {
    if (!project) return []
    if (activeLang.value === 'KMR' && project.tagsKmr?.length) return project.tagsKmr
    return project.tagsCkb?.length ? project.tagsCkb : (project.tagsKmr || [])
  }

  /** Get all tags from both languages (for filtering) */
  function allTags(project) {
    return [...new Set([...(project?.tagsCkb || []), ...(project?.tagsKmr || [])])]
  }

  /** Get contents array in active language */
  function contents(project) {
    if (!project) return []
    if (activeLang.value === 'KMR' && project.contentsKmr?.length) return project.contentsKmr
    return project.contentsCkb?.length ? project.contentsCkb : (project.contentsKmr || [])
  }

  /** Get keywords array in active language */
  function keywords(project) {
    if (!project) return []
    if (activeLang.value === 'KMR' && project.keywordsKmr?.length) return project.keywordsKmr
    return project.keywordsCkb?.length ? project.keywordsCkb : (project.keywordsKmr || [])
  }

  /** Get media label for a media type code */
  function mediaLabel(type) {
    return UI_STRINGS[activeLang.value].media[type] || UI_STRINGS[activeLang.value].media.OTHER
  }

  return {
    // State
    activeLang,

    // Getters
    strings,
    dir,
    isRTL,
    isCKB,
    isKMR,
    dateLocales,

    // Actions
    setLanguage,
    toggleLanguage,
    restoreLanguage,

    // Translation
    t,
    languageName,

    // API content helpers
    getContent,
    hasContentInLanguage,
    title,
    description,
    location,
    projectType,
    publishmentType,
    tags,
    allTags,
    contents,
    keywords,
    mediaLabel,
  }
})  