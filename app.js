/**
 * Lisbon Mobile Pocket Companion
 * Interactive, zero-build, mobile-first Web Application
 */

// ================= CURATED LISBON DATA =================
const SPOTS_DATA = [
  {
    id: "santa-luzia",
    title: "Miradouro de Santa Luzia",
    category: "miradouros",
    neighborhood: "Alfama",
    emoji: "🌸",
    gradient: "linear-gradient(135deg, #f472b6, #e11d48)",
    bestTime: "Sunrise / Morning",
    desc: "A romantic azulejo-tiled terrace framed by vibrant bougainvillea flowers, offering postcard panoramas over Alfama's red terra-cotta roofs and the sparkling Tagus River.",
    tip: "Arrive before 9:00 AM to enjoy the terrace completely alone before tour groups arrive. Admire the tile panels depicting Praça do Comércio before the 1755 earthquake.",
    mapsQuery: "Miradouro+de+Santa+Luzia+Lisboa"
  },
  {
    id: "tram-28",
    title: "Historic Tram 28",
    category: "iconic",
    neighborhood: "Alfama",
    emoji: "🚋",
    gradient: "linear-gradient(135deg, #fde047, #ca8a04)",
    bestTime: "Early Morning (before 8:30)",
    desc: "Lisbon’s legendary 1930s 'Remodelado' yellow tram. Rattles through narrow cobblestone alleys, tight hairpin curves, and historic quarters from Martim Moniz to Campo de Ourique.",
    tip: "Lines at Martim Moniz get enormous by mid-morning. Board at Campo de Ourique in reverse or ride Tram 12 instead for an authentic Alfama loop without the 1-hour queue.",
    mapsQuery: "Martim+Moniz+Tram+28+Lisboa"
  },
  {
    id: "pasteis-belem",
    title: "Pastéis de Belém",
    category: "food",
    neighborhood: "Belém",
    emoji: "🥧",
    gradient: "linear-gradient(135deg, #fed7aa, #d97706)",
    bestTime: "Mid-afternoon",
    desc: "The birthplace of pastel de nata since 1837. Baked according to an ancient, top-secret recipe guarded by the master pastry makers from Jerónimos Monastery.",
    tip: "Skip the gigantic takeaway queue outside! Walk directly inside — the historic bakery has over 400 seats across labyrinthine blue-and-white tiled salons with fast table service.",
    mapsQuery: "Pasteis+de+Belem+Lisbon"
  },
  {
    id: "senhora-do-monte",
    title: "Miradouro da Senhora do Monte",
    category: "miradouros",
    neighborhood: "Graça",
    emoji: "🌅",
    gradient: "linear-gradient(135deg, #fb923c, #ea580c)",
    bestTime: "Sunset (Golden Hour)",
    desc: "The highest and most expansive natural viewpoint in all of Lisbon. Sweeping 270-degree vistas across the castle, downtown Baixa, the 25 de Abril Bridge, and the Cristo Rei statue.",
    tip: "Grab a chilled Super Bock or Sagres from a nearby kiosk, bring a sweater for the evening breeze, and watch the entire city turn gold as acoustic musicians play under the pine trees.",
    mapsQuery: "Miradouro+da+Senhora+do+Monte+Lisboa"
  },
  {
    id: "castelo-sao-jorge",
    title: "Castelo de São Jorge",
    category: "iconic",
    neighborhood: "Alfama",
    emoji: "🏰",
    gradient: "linear-gradient(135deg, #94a3b8, #475569)",
    bestTime: "Late Afternoon",
    desc: "An 11th-century Moorish citadel crowning Lisbon's central hill. Walk the ancient stone ramparts, meet the resident peacocks, and gaze through the camera obscura in the Tower of Ulysses.",
    tip: "Buy your entrance ticket online ahead of time on your smartphone to breeze past the ticket counter line.",
    mapsQuery: "Castelo+de+Sao+Jorge+Lisboa"
  },
  {
    id: "torre-belem",
    title: "Torre de Belém & Jerónimos",
    category: "iconic",
    neighborhood: "Belém",
    emoji: "⛵",
    gradient: "linear-gradient(135deg, #38bdf8, #0284c7)",
    bestTime: "Morning",
    desc: "UNESCO World Heritage crown jewels of Manueline Portuguese Gothic architecture. Built in 1515 directly on the river bank to safeguard Lisbon and commemorate Vasco da Gama’s expedition.",
    tip: "Take the train from Cais do Sodré to Belém station (7 minutes, covered by Navegante). Photograph Torre de Belém from the wooden walkway at high tide.",
    mapsQuery: "Torre+de+Belem+Lisboa"
  },
  {
    id: "time-out-market",
    title: "Time Out Market (Mercado da Ribeira)",
    category: "food",
    neighborhood: "Baixa-Chiado",
    emoji: "🍷",
    gradient: "linear-gradient(135deg, #f87171, #dc2626)",
    bestTime: "Lunch or Late Dinner",
    desc: "A sprawling gourmet food hall under the iron roof of the historic 1892 riverfront market. Handpicked stalls from Portugal's award-winning chefs, seafood masters, and wine bars.",
    tip: "Order Bacalhau à Brás (salted cod with eggs and shoestring potatoes) or garlic shrimp, and snag a stool at the central shared wooden tables.",
    mapsQuery: "Time+Out+Market+Lisboa"
  },
  {
    id: "santa-justa-lift",
    title: "Elevador de Santa Justa",
    category: "iconic",
    neighborhood: "Baixa-Chiado",
    emoji: "🏗️",
    gradient: "linear-gradient(135deg, #64748b, #334155)",
    bestTime: "Early Morning or Night",
    desc: "A neo-gothic iron passenger lift constructed in 1902 by Raoul Mesnier du Ponsard, a disciple of Gustave Eiffel, connecting Baixa with the higher Carmo Square.",
    tip: "Don't pay €5.30 to ride inside the wooden elevator cars. Walk up behind the Carmo Convent ruins to access the upper viewing footbridge completely free!",
    mapsQuery: "Elevador+de+Santa+Justa+Lisboa"
  },
  {
    id: "manteigaria",
    title: "Manteigaria Fábrica de Pastéis",
    category: "food",
    neighborhood: "Baixa-Chiado",
    emoji: "☕",
    gradient: "linear-gradient(135deg, #fbbf24, #b45309)",
    bestTime: "Anytime (Cravings!)",
    desc: "The local connoisseur's favorite pastel de nata. Crunchy, flaky, blistering-hot pastry with velvety cinnamon-perfumed custard, made fresh every 15 minutes before your eyes.",
    tip: "Listen for the brass bell ringing outside — that signals a piping hot tray of fresh pastéis just came out of the oven! Pair with a €0.90 bica (espresso).",
    mapsQuery: "Manteigaria+Chiado+Lisboa"
  },
  {
    id: "pink-street",
    title: "Pink Street & Bairro Alto",
    category: "nightlife",
    neighborhood: "Bairro Alto",
    emoji: "🍸",
    gradient: "linear-gradient(135deg, #ec4899, #be185d)",
    bestTime: "Night (11:00 PM onwards)",
    desc: "Lisbon’s famous nightlife strip (Rua Nova do Carvalho) painted vivid magenta, paired with the labyrinthine bohemian bar scene of hillside Bairro Alto.",
    tip: "Lisbon nightlife starts late! Grab dinner around 9:00 PM, head to Bairro Alto for street caipirinhas and Fado taverns, then descend to Pink Street past midnight.",
    mapsQuery: "Pink+Street+Lisboa"
  },
  {
    id: "lx-factory",
    title: "LX Factory",
    category: "iconic",
    neighborhood: "Alcântara",
    emoji: "🎨",
    gradient: "linear-gradient(135deg, #a855f7, #7c3aed)",
    bestTime: "Sunday Afternoon",
    desc: "A massive 19th-century fabric manufacture transformed into an indie creative city within a city, packed with design concept shops, restaurants, and the legendary Ler Devagar bookstore.",
    tip: "Visit on Sundays for the bustling outdoor vintage market, and head up to Rio Maravilha or Village Underground for river views and quirky shipping-container cafés.",
    mapsQuery: "LX+Factory+Lisboa"
  },
  {
    id: "sintra-trip",
    title: "Sintra & Pena Palace",
    category: "daytrip",
    neighborhood: "Sintra",
    emoji: "👑",
    gradient: "linear-gradient(135deg, #4ade80, #15803d)",
    bestTime: "Full Day (Morning Departure)",
    desc: "A magical UNESCO World Heritage mountain enclave of Romanticism palaces, mossy enchanted forests, and fairytale yellow and red turrets overlooking the Atlantic Ocean.",
    tip: "Board the 40-minute direct train from Rossio station in downtown Lisbon using your Navegante card. Book Pena Palace palace interior entry slots in advance.",
    mapsQuery: "Palacio+Nacional+da+Pena+Sintra"
  }
];

// Initial Curated Itinerary Checklist
const DEFAULT_ITINERARY = [
  { id: "itin-1", time: "Day 1 • 08:30", title: "Pastel & Bica at Manteigaria", desc: "Start your morning with warm custard tart & espresso." },
  { id: "itin-2", time: "Day 1 • 09:30", title: "Walk the Alfama alleys & Miradouros", desc: "Santa Luzia, Portas do Sol, and historic cobblestone lanes." },
  { id: "itin-3", time: "Day 1 • 12:30", title: "Catch Tram 28 or 12", desc: "Scenic ride across the historic hills of Lisbon." },
  { id: "itin-4", time: "Day 1 • 14:00", title: "Lunch at Time Out Market", desc: "Sample bacalhau croquettes and traditional seafood." },
  { id: "itin-5", time: "Day 1 • 18:30", title: "Sunset at Miradouro Senhora do Monte", desc: "Panoramic golden hour over the castle & Tagus river." },
  { id: "itin-6", time: "Day 1 • 21:00", title: "Fado dinner in Alfama or Bairro Alto", desc: "Experience soulful UNESCO-recognized Portuguese music." },
  { id: "itin-7", time: "Day 2 • 09:00", title: "Train to Belém", desc: "Visit Torre de Belém and Jerónimos Monastery." },
  { id: "itin-8", time: "Day 2 • 11:30", title: "Original Pastéis de Belém", desc: "Taste the 1837 secret recipe in the blue-tiled salon." },
  { id: "itin-9", time: "Day 2 • 15:00", title: "Explore LX Factory", desc: "Browse Ler Devagar bookstore & indie design ateliers." },
  { id: "itin-10", time: "Day 2 • 22:00", title: "Nightcap on Pink Street", desc: "Celebrate Lisbon nights with music and street atmosphere." }
];

// Essential Portuguese Phrases
const PHRASES_DATA = [
  { pt: "Olá / Bom dia", en: "Hello / Good morning", phonetic: "oh-lah / bohn DEE-ah" },
  { pt: "Obrigado (m) / Obrigada (f)", en: "Thank you", phonetic: "oh-bree-GAH-doo / oh-bree-GAH-dah" },
  { pt: "Por favor / Se faz favor", en: "Please", phonetic: "poor fah-VOHR / seh fahz fah-VOHR" },
  { pt: "Uma bica, por favor", en: "An espresso, please (Lisbon slang)", phonetic: "OO-mah BEE-kah, poor fah-VOHR" },
  { pt: "Dois pastéis de nata", en: "Two custard tarts", phonetic: "doysh pahsh-TEYSH deh NAH-tah" },
  { pt: "A conta, por favor", en: "The bill, please", phonetic: "ah KOHN-tah, poor fah-VOHR" },
  { pt: "Onde fica a casa de banho?", en: "Where is the bathroom?", phonetic: "OHN-deh FEE-kah ah KAH-zah deh BAHN-yoo?" },
  { pt: "Desculpe / Com licença", en: "Sorry / Excuse me", phonetic: "desh-KOOL-peh / kohm lee-SEHN-sah" },
  { pt: "Fala inglês?", en: "Do you speak English?", phonetic: "FAH-lah een-GLEHSH?" },
  { pt: "Quanto custa?", en: "How much does it cost?", phonetic: "KWAHN-too KOOSH-tah?" }
];

// ================= APP STATE =================
class LisbonApp {
  constructor() {
    this.currentCategory = "all";
    this.currentNeighborhood = "all";
    this.searchQuery = "";
    this.activeTab = "view-explore";

    // Persistent state
    this.favorites = this.loadFavorites();
    this.itinerary = this.loadItinerary();
    this.theme = localStorage.getItem("lisbon_theme") || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

    this.initDOMElements();
    this.bindEvents();
    this.initClock();
    this.renderAll();
    this.registerServiceWorker();
  }

  // LocalStorage Helpers
  loadFavorites() {
    try {
      const data = localStorage.getItem("lisbon_favorites");
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  saveFavorites() {
    localStorage.setItem("lisbon_favorites", JSON.stringify(this.favorites));
    this.updateBadges();
  }

  loadItinerary() {
    try {
      const data = localStorage.getItem("lisbon_itinerary");
      return data ? JSON.parse(data) : DEFAULT_ITINERARY;
    } catch {
      return DEFAULT_ITINERARY;
    }
  }

  saveItinerary() {
    localStorage.setItem("lisbon_itinerary", JSON.stringify(this.itinerary));
    this.updateItineraryProgress();
  }

  initDOMElements() {
    // Navigation
    this.navTabs = document.querySelectorAll(".nav-tab");
    this.tabViews = document.querySelectorAll(".tab-view");

    // Live clock & indicators
    this.statusClock = document.getElementById("status-clock");
    this.lisbonTime = document.getElementById("lisbon-time");
    this.themeToggle = document.getElementById("theme-toggle");

    // Explore View
    this.searchInput = document.getElementById("search-input");
    this.searchClear = document.getElementById("search-clear");
    this.categoryChips = document.querySelectorAll(".chip");
    this.neighborhoodChips = document.querySelectorAll(".sub-chip");
    this.spotsList = document.getElementById("spots-list");
    this.noResults = document.getElementById("no-results");
    this.btnResetFilters = document.getElementById("btn-reset-filters");
    this.btnSurprise = document.getElementById("btn-surprise");

    // Itinerary View
    this.itineraryList = document.getElementById("itinerary-list");
    this.progressFill = document.getElementById("progress-fill");
    this.progressPercent = document.getElementById("progress-percent");
    this.progressCount = document.getElementById("progress-count");
    this.btnResetChecklist = document.getElementById("btn-reset-checklist");
    this.formCustomItem = document.getElementById("form-custom-item");
    this.customItemInput = document.getElementById("custom-item-input");

    // Phrases View
    this.phrasesList = document.getElementById("phrases-list");

    // Saved View
    this.savedSpotsList = document.getElementById("saved-spots-list");
    this.noSaved = document.getElementById("no-saved");
    this.savedActionsBar = document.getElementById("saved-actions-bar");
    this.savedCountLabel = document.getElementById("saved-count-label");
    this.btnClearSaved = document.getElementById("btn-clear-saved");
    this.btnGoExplore = document.getElementById("btn-go-explore");

    // Badges
    this.savedBadge = document.getElementById("saved-badge");
    this.itineraryBadge = document.getElementById("itinerary-badge");

    // Modal
    this.spotModal = document.getElementById("spot-modal");
    this.modalClose = document.getElementById("modal-close");
    this.modalTitle = document.getElementById("modal-spot-title");
    this.modalDesc = document.getElementById("modal-description");
    this.modalTip = document.getElementById("modal-tip");
    this.modalCategory = document.getElementById("modal-category");
    this.modalNeighborhood = document.getElementById("modal-neighborhood");
    this.modalBestTime = document.getElementById("modal-best-time");
    this.modalEmoji = document.getElementById("modal-emoji");
    this.modalHero = document.getElementById("modal-hero");
    this.modalMapsLink = document.getElementById("modal-maps-link");
    this.modalFavBtn = document.getElementById("modal-fav-btn");

    // Toast
    this.toastContainer = document.getElementById("toast-container");
  }

  bindEvents() {
    // Navigation tab switching
    this.navTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        this.switchTab(tab.getAttribute("data-target"));
      });
    });

    // Theme Toggle
    this.themeToggle.addEventListener("click", () => this.toggleTheme());

    // Search events
    this.searchInput.addEventListener("input", (e) => {
      this.searchQuery = e.target.value.trim().toLowerCase();
      this.searchClear.hidden = this.searchQuery.length === 0;
      this.renderSpots();
    });

    this.searchClear.addEventListener("click", () => {
      this.searchInput.value = "";
      this.searchQuery = "";
      this.searchClear.hidden = true;
      this.renderSpots();
      this.searchInput.focus();
    });

    // Category filter chips
    this.categoryChips.forEach((chip) => {
      chip.addEventListener("click", () => {
        this.categoryChips.forEach((c) => c.classList.remove("active"));
        chip.classList.add("active");
        this.currentCategory = chip.getAttribute("data-category");
        this.renderSpots();
      });
    });

    // Neighborhood filter chips
    this.neighborhoodChips.forEach((chip) => {
      chip.addEventListener("click", () => {
        this.neighborhoodChips.forEach((c) => c.classList.remove("active"));
        chip.classList.add("active");
        this.currentNeighborhood = chip.getAttribute("data-neighborhood");
        this.renderSpots();
      });
    });

    // Reset filters
    this.btnResetFilters.addEventListener("click", () => {
      this.searchInput.value = "";
      this.searchQuery = "";
      this.searchClear.hidden = true;
      this.currentCategory = "all";
      this.currentNeighborhood = "all";
      this.categoryChips.forEach((c, idx) => c.classList.toggle("active", idx === 0));
      this.neighborhoodChips.forEach((c, idx) => c.classList.toggle("active", idx === 0));
      this.renderSpots();
    });

    // Surprise Me
    this.btnSurprise.addEventListener("click", () => this.handleSurpriseMe());

    // Itinerary custom note form
    this.formCustomItem.addEventListener("submit", (e) => {
      e.preventDefault();
      const val = this.customItemInput.value.trim();
      if (!val) return;
      const newItem = {
        id: "custom-" + Date.now(),
        time: "Personal Note",
        title: val,
        desc: "Custom travel checklist item.",
        done: false,
        isCustom: true
      };
      this.itinerary.push(newItem);
      this.saveItinerary();
      this.customItemInput.value = "";
      this.renderItinerary();
      this.showToast("Note added to your Lisbon plan!");
    });

    // Reset Checklist
    this.btnResetChecklist.addEventListener("click", () => {
      if (confirm("Reset checklist to original state?")) {
        this.itinerary = DEFAULT_ITINERARY.map((item) => ({ ...item, done: false }));
        this.saveItinerary();
        this.renderItinerary();
        this.showToast("Checklist reset.");
      }
    });

    // Saved View actions
    this.btnClearSaved.addEventListener("click", () => {
      if (confirm("Remove all saved spots?")) {
        this.favorites = [];
        this.saveFavorites();
        this.renderSaved();
        this.renderSpots();
        this.showToast("Saved spots cleared.");
      }
    });

    this.btnGoExplore.addEventListener("click", () => {
      this.switchTab("view-explore");
    });

    // Modal close
    this.modalClose.addEventListener("click", () => this.spotModal.close());
    this.spotModal.addEventListener("click", (e) => {
      if (e.target === this.spotModal) this.spotModal.close();
    });
  }

  // ================= TAB SWITCHING =================
  switchTab(targetId) {
    if (navigator.vibrate) navigator.vibrate(10);
    this.activeTab = targetId;

    this.navTabs.forEach((tab) => {
      const isTarget = tab.getAttribute("data-target") === targetId;
      tab.classList.toggle("active", isTarget);
      tab.setAttribute("aria-selected", isTarget ? "true" : "false");
    });

    this.tabViews.forEach((view) => {
      const isTarget = view.id === targetId;
      view.classList.toggle("active", isTarget);
      view.hidden = !isTarget;
    });

    if (targetId === "view-saved") {
      this.renderSaved();
    }
  }

  // ================= LIVE CLOCK =================
  initClock() {
    const updateTime = () => {
      try {
        const now = new Date();
        const lisbonFormatter = new Intl.DateTimeFormat("en-GB", {
          timeZone: "Europe/Lisbon",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false
        });
        const parts = lisbonFormatter.format(now);
        if (this.lisbonTime) this.lisbonTime.textContent = parts;

        const shortFormatter = new Intl.DateTimeFormat("en-GB", {
          timeZone: "Europe/Lisbon",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false
        });
        if (this.statusClock) this.statusClock.textContent = shortFormatter.format(now);
      } catch (err) {
        console.warn("Timezone error:", err);
      }
    };

    updateTime();
    setInterval(updateTime, 1000);
  }

  // ================= THEME TOGGLING =================
  toggleTheme() {
    const current = document.documentElement.getAttribute("data-theme") || this.theme;
    const nextTheme = current === "dark" ? "light" : "dark";
    
    document.documentElement.setAttribute("data-theme", nextTheme);
    localStorage.setItem("lisbon_theme", nextTheme);
    this.theme = nextTheme;

    const metaColor = document.querySelector('meta[name="theme-color"]');
    if (metaColor) metaColor.content = nextTheme === "dark" ? "#0f172a" : "#d94f26";

    const icon = this.themeToggle.querySelector(".theme-icon");
    if (icon) icon.textContent = nextTheme === "dark" ? "☀️" : "🌙";

    if (navigator.vibrate) navigator.vibrate(12);
  }

  // ================= RENDERING =================
  renderAll() {
    this.renderSpots();
    this.renderItinerary();
    this.renderPhrases();
    this.renderSaved();
    this.updateBadges();

    // Set initial theme icon
    const icon = this.themeToggle.querySelector(".theme-icon");
    if (icon) icon.textContent = this.theme === "dark" ? "☀️" : "🌙";
  }

  // 1. Explore Spots
  renderSpots() {
    const filtered = SPOTS_DATA.filter((spot) => {
      const matchCategory = this.currentCategory === "all" || spot.category === this.currentCategory;
      const matchNeighborhood = this.currentNeighborhood === "all" || spot.neighborhood.toLowerCase().includes(this.currentNeighborhood.toLowerCase());
      const matchSearch =
        !this.searchQuery ||
        spot.title.toLowerCase().includes(this.searchQuery) ||
        spot.desc.toLowerCase().includes(this.searchQuery) ||
        spot.neighborhood.toLowerCase().includes(this.searchQuery) ||
        spot.tip.toLowerCase().includes(this.searchQuery);

      return matchCategory && matchNeighborhood && matchSearch;
    });

    if (filtered.length === 0) {
      this.spotsList.innerHTML = "";
      this.noResults.hidden = false;
      return;
    }

    this.noResults.hidden = true;
    this.spotsList.innerHTML = filtered.map((spot) => this.createSpotCardHTML(spot)).join("");

    // Bind card clicks
    this.spotsList.querySelectorAll(".spot-card").forEach((card) => {
      const id = card.getAttribute("data-id");
      const spot = SPOTS_DATA.find((s) => s.id === id);

      card.addEventListener("click", (e) => {
        // Prevent opening dialog if user clicked favorite or maps link directly
        if (e.target.closest(".btn-card-fav") || e.target.closest(".btn-link-maps")) return;
        this.openSpotModal(spot);
      });

      const favBtn = card.querySelector(".btn-card-fav");
      if (favBtn) {
        favBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          this.toggleFavorite(spot.id);
        });
      }
    });
  }

  createSpotCardHTML(spot) {
    const isFav = this.favorites.includes(spot.id);
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${spot.mapsQuery}`;

    return `
      <article class="spot-card" data-id="${spot.id}" id="card-${spot.id}">
        <div class="spot-card-cover" style="background: ${spot.gradient}">
          <span class="spot-card-emoji">${spot.emoji}</span>
          <div class="spot-card-badges">
            <span class="badge-tag">📍 ${spot.neighborhood}</span>
          </div>
          <button class="btn-card-fav" aria-label="${isFav ? 'Remove from favorites' : 'Add to favorites'}" title="Bookmark">
            ${isFav ? "❤️" : "🤍"}
          </button>
        </div>
        <div class="spot-card-body">
          <div class="spot-title-row">
            <h3 class="spot-title">${spot.title}</h3>
          </div>
          <p class="spot-desc">${spot.desc}</p>
          <div class="spot-tip-preview">
            <span>💡 <strong>Tip:</strong> ${spot.tip}</span>
          </div>
          <div class="spot-footer-row">
            <span class="spot-time-indicator">⏰ ${spot.bestTime}</span>
            <div class="spot-actions">
              <a href="${mapsUrl}" target="_blank" rel="noopener noreferrer" class="btn-link-maps">
                <span>Directions ↗</span>
              </a>
            </div>
          </div>
        </div>
      </article>
    `;
  }

  // 2. Itinerary View
  renderItinerary() {
    this.itineraryList.innerHTML = this.itinerary
      .map(
        (item) => `
        <div class="itinerary-item ${item.done ? "completed" : ""}" data-id="${item.id}">
          <input type="checkbox" class="itinerary-checkbox" ${item.done ? "checked" : ""} aria-label="Mark completed">
          <div class="itinerary-content">
            <div class="itinerary-time">${item.time}</div>
            <div class="itinerary-title">${item.title}</div>
            <div class="itinerary-desc">${item.desc}</div>
          </div>
          ${item.isCustom ? `<button class="btn-remove-custom" aria-label="Delete note" title="Delete">✕</button>` : ""}
        </div>
      `
      )
      .join("");

    // Bind checkboxes & custom deletes
    this.itineraryList.querySelectorAll(".itinerary-item").forEach((el) => {
      const id = el.getAttribute("data-id");
      const checkbox = el.querySelector(".itinerary-checkbox");
      const removeBtn = el.querySelector(".btn-remove-custom");

      checkbox.addEventListener("change", () => {
        const item = this.itinerary.find((i) => i.id === id);
        if (item) {
          item.done = checkbox.checked;
          this.saveItinerary();
          el.classList.toggle("completed", item.done);
          if (navigator.vibrate) navigator.vibrate(15);
        }
      });

      if (removeBtn) {
        removeBtn.addEventListener("click", () => {
          this.itinerary = this.itinerary.filter((i) => i.id !== id);
          this.saveItinerary();
          this.renderItinerary();
        });
      }
    });

    this.updateItineraryProgress();
  }

  updateItineraryProgress() {
    const total = this.itinerary.length;
    const completed = this.itinerary.filter((i) => i.done).length;
    const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

    this.progressFill.style.width = `${pct}%`;
    this.progressPercent.textContent = `${pct}%`;
    this.progressCount.textContent = `${completed} of ${total} completed`;

    if (total - completed > 0) {
      this.itineraryBadge.hidden = false;
      this.itineraryBadge.textContent = total - completed;
    } else {
      this.itineraryBadge.hidden = true;
    }
  }

  // 3. Phrases View
  renderPhrases() {
    this.phrasesList.innerHTML = PHRASES_DATA.map(
      (p, index) => `
        <div class="phrase-card">
          <div class="phrase-info">
            <span class="phrase-pt">${p.pt}</span>
            <span class="phrase-en">${p.en} • <em>${p.phonetic}</em></span>
          </div>
          <div class="phrase-actions">
            <button class="phrase-btn speak-btn" data-index="${index}" title="Listen (Pronounce)">🔊</button>
            <button class="phrase-btn copy-btn" data-index="${index}" title="Copy to clipboard">📋</button>
          </div>
        </div>
      `
    ).join("");

    // Bind Speak and Copy buttons
    this.phrasesList.querySelectorAll(".speak-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const index = btn.getAttribute("data-index");
        const phrase = PHRASES_DATA[index];
        this.speakPortuguese(phrase.pt);
      });
    });

    this.phrasesList.querySelectorAll(".copy-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const index = btn.getAttribute("data-index");
        const phrase = PHRASES_DATA[index];
        if (navigator.clipboard) {
          navigator.clipboard.writeText(phrase.pt);
          this.showToast(`Copied "${phrase.pt}" to clipboard!`);
        }
      });
    });
  }

  speakPortuguese(text) {
    if (!("speechSynthesis" in window)) {
      this.showToast("Speech synthesis not supported in this browser.");
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "pt-PT";
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
    this.showToast(`Pronouncing: "${text}"`);
  }

  // 4. Saved Spots View
  renderSaved() {
    const savedSpots = SPOTS_DATA.filter((s) => this.favorites.includes(s.id));
    this.savedActionsBar.hidden = savedSpots.length === 0;
    this.noSaved.hidden = savedSpots.length > 0;
    this.savedCountLabel.textContent = `${savedSpots.length} spot${savedSpots.length === 1 ? "" : "s"} saved`;

    if (savedSpots.length === 0) {
      this.savedSpotsList.innerHTML = "";
      return;
    }

    this.savedSpotsList.innerHTML = savedSpots.map((spot) => this.createSpotCardHTML(spot)).join("");

    this.savedSpotsList.querySelectorAll(".spot-card").forEach((card) => {
      const id = card.getAttribute("data-id");
      const spot = SPOTS_DATA.find((s) => s.id === id);

      card.addEventListener("click", (e) => {
        if (e.target.closest(".btn-card-fav") || e.target.closest(".btn-link-maps")) return;
        this.openSpotModal(spot);
      });

      const favBtn = card.querySelector(".btn-card-fav");
      if (favBtn) {
        favBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          this.toggleFavorite(spot.id);
          this.renderSaved();
          this.renderSpots();
        });
      }
    });
  }

  // ================= FAVORITES LOGIC =================
  toggleFavorite(spotId) {
    if (navigator.vibrate) navigator.vibrate(15);
    const index = this.favorites.indexOf(spotId);
    let isNowFav = false;

    if (index > -1) {
      this.favorites.splice(index, 1);
      this.showToast("Removed from saved.");
    } else {
      this.favorites.push(spotId);
      isNowFav = true;
      this.showToast("Saved to favorites! ❤️");
    }

    this.saveFavorites();
    this.renderSpots();
    if (this.activeTab === "view-saved") {
      this.renderSaved();
    }
    return isNowFav;
  }

  updateBadges() {
    const count = this.favorites.length;
    if (count > 0) {
      this.savedBadge.hidden = false;
      this.savedBadge.textContent = count;
    } else {
      this.savedBadge.hidden = true;
    }
  }

  // ================= MODAL DIALOG =================
  openSpotModal(spot) {
    if (!spot) return;
    this.modalTitle.textContent = spot.title;
    this.modalDesc.textContent = spot.desc;
    this.modalTip.textContent = spot.tip;
    this.modalCategory.textContent = spot.category;
    this.modalNeighborhood.textContent = `📍 ${spot.neighborhood}`;
    this.modalBestTime.textContent = `⏰ ${spot.bestTime}`;
    this.modalEmoji.textContent = spot.emoji;
    this.modalHero.style.background = spot.gradient;
    this.modalMapsLink.href = `https://www.google.com/maps/search/?api=1&query=${spot.mapsQuery}`;

    const isFav = this.favorites.includes(spot.id);
    this.updateModalFavBtn(isFav);

    // Rebind modal favorite button
    this.modalFavBtn.onclick = () => {
      const nowFav = this.toggleFavorite(spot.id);
      this.updateModalFavBtn(nowFav);
    };

    this.spotModal.showModal();
  }

  updateModalFavBtn(isFav) {
    const icon = this.modalFavBtn.querySelector(".fav-icon");
    const text = this.modalFavBtn.querySelector(".fav-text");
    if (icon) icon.textContent = isFav ? "❤️" : "🤍";
    if (text) text.textContent = isFav ? "Saved" : "Save";
  }

  // ================= SURPRISE ME =================
  handleSurpriseMe() {
    if (navigator.vibrate) navigator.vibrate([20, 50, 20]);
    this.switchTab("view-explore");

    // Pick a random spot
    const randomIndex = Math.floor(Math.random() * SPOTS_DATA.length);
    const chosen = SPOTS_DATA[randomIndex];

    this.showToast(`🎲 Random pick: ${chosen.title}!`);

    // Reset filters to ensure the card is visible
    this.currentCategory = "all";
    this.currentNeighborhood = "all";
    this.searchQuery = "";
    this.searchInput.value = "";
    this.searchClear.hidden = true;
    this.categoryChips.forEach((c, idx) => c.classList.toggle("active", idx === 0));
    this.neighborhoodChips.forEach((c, idx) => c.classList.toggle("active", idx === 0));
    this.renderSpots();

    // Scroll to the card and open it
    setTimeout(() => {
      const cardEl = document.getElementById(`card-${chosen.id}`);
      if (cardEl) {
        cardEl.scrollIntoView({ behavior: "smooth", block: "center" });
        cardEl.style.transition = "transform 0.4s ease, box-shadow 0.4s ease";
        cardEl.style.transform = "scale(1.03)";
        cardEl.style.boxShadow = "0 0 0 3px var(--color-primary)";
        setTimeout(() => {
          cardEl.style.transform = "";
          cardEl.style.boxShadow = "";
          this.openSpotModal(chosen);
        }, 500);
      }
    }, 100);
  }

  // ================= TOAST NOTIFICATION =================
  showToast(message) {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    this.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 2500);
  }

  // ================= SERVICE WORKER =================
  registerServiceWorker() {
    if ("serviceWorker" in navigator && (window.location.protocol === "https:" || window.location.hostname === "localhost")) {
      navigator.serviceWorker
        .register("./sw.js")
        .then((reg) => console.log("Lisbon SW registered successfully:", reg.scope))
        .catch((err) => console.warn("Lisbon SW registration skipped:", err));
    }
  }
}

// Instantiate on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  window.lisbonApp = new LisbonApp();
});
