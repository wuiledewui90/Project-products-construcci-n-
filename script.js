// ==============================
// Configuración base
// ==============================
const WHATSAPP_NUMBER = "5493815550101";

// ==============================
// Datos del catálogo
// ==============================
const products = [
  {
    id: 1,
    name: "Taladro Percutor Pro 850W",
    category: "Taladros",
    price: 124900,
    description: "Mandril reforzado, velocidad variable y empuñadura lateral para perforación intensiva en obra.",
    stock: "Disponible",
    badge: "Más vendido",
    badgeType: "top",
    featured: true,
    image: createProductImage("Taladro", "#f59e0b", "#1f2937")
  },
  {
    id: 2,
    name: "Amoladora Angular 115 mm Heavy Duty",
    category: "Amoladoras",
    price: 98900,
    description: "Compacta, potente y estable para corte y desbaste en metal, mampostería y terminaciones.",
    stock: "Últimas unidades",
    badge: "Oferta",
    badgeType: "sale",
    featured: true,
    image: createProductImage("Amoladora", "#f97316", "#111827")
  },
  {
    id: 3,
    name: "Generador Eléctrico 3.5 kVA",
    category: "Generadores",
    price: 684000,
    description: "Arranque manual, salida monofásica y autonomía extendida para obra sin red estable.",
    stock: "Disponible",
    badge: "Nuevo",
    badgeType: "new",
    featured: true,
    image: createProductImage("Generador", "#eab308", "#0f172a")
  },
  {
    id: 4,
    name: "Vibrador de Cemento 1500W",
    category: "Vibradores",
    price: 215500,
    description: "Diseñado para compactación eficiente del hormigón con eje flexible de alto rendimiento.",
    stock: "Disponible",
    badge: "Profesional",
    badgeType: "top",
    featured: false,
    image: createProductImage("Vibrador", "#f59e0b", "#334155")
  },
  {
    id: 5,
    name: "Soldadora Inverter 250A",
    category: "Soldadoras",
    price: 187300,
    description: "Excelente estabilidad de arco, formato portátil y rendimiento confiable para taller y montaje.",
    stock: "Disponible",
    badge: "Alta salida",
    badgeType: "sale",
    featured: true,
    image: createProductImage("Soldadora", "#f97316", "#1e293b")
  },
  {
    id: 6,
    name: "Compresor 50L Doble Salida",
    category: "Compresores",
    price: 329900,
    description: "Tanque de gran capacidad para tareas neumáticas, pintura y mantenimiento técnico.",
    stock: "Últimas unidades",
    badge: "Oferta",
    badgeType: "sale",
    featured: false,
    image: createProductImage("Compresor", "#facc15", "#1f2937")
  },
  {
    id: 7,
    name: "Hidrolavadora Industrial 180 bar",
    category: "Hidrolavadoras",
    price: 274600,
    description: "Presión constante para limpieza de equipos, pisos, vehículos utilitarios y superficies duras.",
    stock: "Disponible",
    badge: "Nuevo",
    badgeType: "new",
    featured: false,
    image: createProductImage("Hidrolavadora", "#f59e0b", "#0f172a")
  },
  {
    id: 8,
    name: "Mezcladora de Obra 130L",
    category: "Mezcladoras",
    price: 549000,
    description: "Estructura reforzada y motorización confiable para mezcla de mortero y hormigón en obra.",
    stock: "Disponible",
    badge: "Trabajo continuo",
    badgeType: "top",
    featured: false,
    image: createProductImage("Mezcladora", "#fb923c", "#111827")
  },
  {
    id: 9,
    name: "Martillo Demoledor 1600W",
    category: "Demolición",
    price: 411800,
    description: "Golpe contundente para demolición liviana y media en pisos, paredes y estructuras.",
    stock: "Disponible",
    badge: "Profesional",
    badgeType: "top",
    featured: false,
    image: createProductImage("Demoledor", "#f59e0b", "#172554")
  },
  {
    id: 10,
    name: "Cortadora Sensitiva 14”",
    category: "Corte",
    price: 239900,
    description: "Precisión y estabilidad para perfiles metálicos, caños y piezas de acero en taller.",
    stock: "Disponible",
    badge: "Alta demanda",
    badgeType: "sale",
    featured: false,
    image: createProductImage("Corte", "#f97316", "#0f172a")
  },
  {
    id: 11,
    name: "Taladro Atornillador 20V Brushless",
    category: "Taladros",
    price: 166400,
    description: "Equipo inalámbrico con batería de litio, ideal para instalación, armado y mantenimiento.",
    stock: "Disponible",
    badge: "Nuevo",
    badgeType: "new",
    featured: true,
    image: createProductImage("Atornillador", "#eab308", "#111827")
  },
  {
    id: 12,
    name: "Amoladora 230 mm Obra Pesada",
    category: "Amoladoras",
    price: 178200,
    description: "Motor robusto y gran diámetro de disco para cortes exigentes en obra y herrería.",
    stock: "Últimas unidades",
    badge: "Más vendido",
    badgeType: "top",
    featured: false,
    image: createProductImage("Amoladora 230", "#fb923c", "#1f2937")
  }
];

const categoryMeta = {
  "Taladros": { icon: "🔩", copy: "Percutores, atornilladores y equipos para instalación." },
  "Amoladoras": { icon: "⚙️", copy: "Corte y desbaste para metal, obra y terminaciones." },
  "Generadores": { icon: "🔋", copy: "Energía de respaldo para obra, campo y emergencias." },
  "Vibradores": { icon: "🏗️", copy: "Compactación de hormigón con respuesta profesional." },
  "Soldadoras": { icon: "🔥", copy: "Equipos inverter para taller, herrería y montaje." },
  "Compresores": { icon: "🧰", copy: "Aire comprimido para neumática y mantenimiento." },
  "Hidrolavadoras": { icon: "💧", copy: "Limpieza de máquinas, superficies y vehículos." },
  "Mezcladoras": { icon: "🪣", copy: "Preparación constante de mezcla para obra activa." },
  "Demolición": { icon: "🧱", copy: "Herramientas para rotura controlada y remoción." },
  "Corte": { icon: "🪚", copy: "Máquinas para corte técnico en metal y perfiles." }
};

// ==============================
// Estado
// ==============================
let cart = loadCart();
let activeCategory = "Todos";
let searchTerm = "";

// ==============================
// Referencias DOM
// ==============================
const productGrid = document.getElementById("productGrid");
const featuredGrid = document.getElementById("featuredGrid");
const categoryGrid = document.getElementById("categoryGrid");
const filterPills = document.getElementById("filterPills");
const searchInput = document.getElementById("searchInput");
const resultsSummary = document.getElementById("resultsSummary");
const emptyState = document.getElementById("emptyState");
const cartCount = document.getElementById("cartCount");
const cartItems = document.getElementById("cartItems");
const cartSubtotal = document.getElementById("cartSubtotal");
const cartDrawer = document.getElementById("cartDrawer");
const overlay = document.getElementById("overlay");
const cartToggle = document.getElementById("cartToggle");
const closeCart = document.getElementById("closeCart");
const checkoutWhatsappBtn = document.getElementById("checkoutWhatsappBtn");
const clearCartBtn = document.getElementById("clearCartBtn");
const clearFiltersBtn = document.getElementById("clearFiltersBtn");
const toast = document.getElementById("toast");
const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");
const topbar = document.querySelector(".topbar");
const backToTop = document.getElementById("backToTop");
const floatingWhatsapp = document.getElementById("floatingWhatsapp");
const heroWhatsappLink = document.getElementById("heroWhatsappLink");
const contactWhatsappLink = document.getElementById("contactWhatsappLink");

// ==============================
// Inicio
// ==============================
document.addEventListener("DOMContentLoaded", () => {
  renderCategories();
  renderFilterPills();
  renderProducts();
  renderFeatured();
  renderCart();
  applyWhatsappLinks();
  setupEvents();
  setupRevealOnScroll();
  updateStickyState();
});

function setupEvents() {
  searchInput.addEventListener("input", (event) => {
    searchTerm = event.target.value.trim().toLowerCase();
    renderProducts();
  });

  clearFiltersBtn.addEventListener("click", () => {
    activeCategory = "Todos";
    searchTerm = "";
    searchInput.value = "";
    renderFilterPills();
    renderProducts();
  });

  cartToggle.addEventListener("click", openCart);
  closeCart.addEventListener("click", closeCartDrawer);
  overlay.addEventListener("click", () => {
    closeCartDrawer();
    closeMobileMenu();
  });

  clearCartBtn.addEventListener("click", () => {
    cart = [];
    persistCart();
    renderCart();
    showToast("Carrito vaciado.");
  });

  checkoutWhatsappBtn.addEventListener("click", (event) => {
    if (!cart.length) {
      event.preventDefault();
      showToast("Agregá productos antes de finalizar el pedido.");
    }
  });

  menuToggle.addEventListener("click", toggleMobileMenu);

  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });

  floatingWhatsapp.addEventListener("click", () => {
    window.open(buildWhatsappLink(), "_blank", "noopener,noreferrer");
  });

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  window.addEventListener("scroll", () => {
    updateStickyState();
    updateBackToTop();
  });
}

function renderCategories() {
  const categories = getCategories();

  categoryGrid.innerHTML = categories
    .filter((category) => category !== "Todos")
    .map((category) => {
      const meta = categoryMeta[category] || { icon: "🛠️", copy: "Equipos y herramientas para trabajo profesional." };
      const count = products.filter((product) => product.category === category).length;

      return `
        <button class="category-card reveal" type="button" data-category="${category}" data-icon="${meta.icon}" aria-label="Filtrar por ${category}">
          <span class="category-card__chip">${count} productos</span>
          <h3>${category}</h3>
          <p>${meta.copy}</p>
        </button>
      `;
    })
    .join("");

  categoryGrid.querySelectorAll(".category-card").forEach((card) => {
    card.addEventListener("click", () => {
      activeCategory = card.dataset.category;
      renderFilterPills();
      renderProducts();
      document.getElementById("catalogo").scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

function renderFilterPills() {
  filterPills.innerHTML = getCategories()
    .map((category) => `
      <button
        class="filter-pill ${activeCategory === category ? "is-active" : ""}"
        type="button"
        data-category="${category}"
      >
        ${category}
      </button>
    `)
    .join("");

  filterPills.querySelectorAll(".filter-pill").forEach((pill) => {
    pill.addEventListener("click", () => {
      activeCategory = pill.dataset.category;
      renderFilterPills();
      renderProducts();
    });
  });
}

function renderProducts() {
  const filteredProducts = getFilteredProducts();
  resultsSummary.textContent = `${filteredProducts.length} producto${filteredProducts.length === 1 ? "" : "s"}`;
  emptyState.classList.toggle("hidden", filteredProducts.length !== 0);

  productGrid.innerHTML = filteredProducts
    .map((product) => createProductCard(product))
    .join("");

  bindAddToCartButtons();
  observeReveals();
}

function renderFeatured() {
  featuredGrid.innerHTML = products
    .filter((product) => product.featured)
    .slice(0, 4)
    .map((product) => createProductCard(product, true))
    .join("");

  bindAddToCartButtons();
}

function createProductCard(product, compact = false) {
  return `
    <article class="product-card reveal">
      <div class="product-card__media">
        <img src="${product.image}" alt="${product.name}" loading="lazy" />
        <div class="product-card__badges">
          <span class="badge badge--${product.badgeType === "new" ? "new" : product.badgeType === "sale" ? "sale" : "top"}">${product.badge}</span>
        </div>
      </div>
      <div class="product-card__body">
        <div class="product-card__meta">
          <span class="product-card__category">${product.category}</span>
          <span class="stock-pill ${product.stock === "Disponible" ? "stock-pill--ok" : "stock-pill--low"}">${product.stock}</span>
        </div>
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <div class="product-card__footer">
          <div class="price-block">
            <strong>${formatCurrency(product.price)}</strong>
            <span>Precio estimado</span>
          </div>
          <button class="btn btn--secondary add-to-cart-btn" type="button" data-id="${product.id}">
            Agregar
          </button>
        </div>
      </div>
    </article>
  `;
}

function bindAddToCartButtons() {
  document.querySelectorAll(".add-to-cart-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const productId = Number(button.dataset.id);
      addToCart(productId);
    });
  });
}

function getFilteredProducts() {
  return products.filter((product) => {
    const matchesCategory = activeCategory === "Todos" || product.category === activeCategory;
    const matchesSearch =
      !searchTerm ||
      product.name.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm);

    return matchesCategory && matchesSearch;
  });
}

function getCategories() {
  return ["Todos", ...new Set(products.map((product) => product.category))];
}

// ==============================
// Carrito
// ==============================
function addToCart(productId) {
  const existing = cart.find((item) => item.id === productId);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id: productId, quantity: 1 });
  }

  persistCart();
  renderCart();
  showToast("Producto agregado al carrito.");
}

function renderCart() {
  cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (!cart.length) {
    cartItems.innerHTML = `
      <div class="empty-cart">
        <h4>Tu carrito está vacío</h4>
        <p>Agregá herramientas al pedido y después enviá la consulta por WhatsApp.</p>
      </div>
    `;
    cartSubtotal.textContent = formatCurrency(0);
    checkoutWhatsappBtn.href = buildWhatsappLink();
    return;
  }

  cartItems.innerHTML = cart
    .map((item) => {
      const product = products.find((entry) => entry.id === item.id);
      if (!product) return "";

      return `
        <article class="cart-item">
          <img src="${product.image}" alt="${product.name}" loading="lazy" />
          <div>
            <h4>${product.name}</h4>
            <p>${product.category} · ${formatCurrency(product.price)}</p>
            <div class="qty-controls">
              <button type="button" data-action="decrease" data-id="${product.id}" aria-label="Restar cantidad">−</button>
              <span>${item.quantity}</span>
              <button type="button" data-action="increase" data-id="${product.id}" aria-label="Sumar cantidad">+</button>
            </div>
            <button class="remove-item" type="button" data-action="remove" data-id="${product.id}">Eliminar</button>
          </div>
          <strong>${formatCurrency(product.price * item.quantity)}</strong>
        </article>
      `;
    })
    .join("");

  cartSubtotal.textContent = formatCurrency(getCartSubtotal());
  checkoutWhatsappBtn.href = buildWhatsappLink();

  cartItems.querySelectorAll("[data-action]").forEach((control) => {
    control.addEventListener("click", () => {
      const productId = Number(control.dataset.id);
      const action = control.dataset.action;

      if (action === "increase") updateQuantity(productId, 1);
      if (action === "decrease") updateQuantity(productId, -1);
      if (action === "remove") removeFromCart(productId);
    });
  });
}

function updateQuantity(productId, delta) {
  const item = cart.find((entry) => entry.id === productId);
  if (!item) return;

  item.quantity += delta;

  if (item.quantity <= 0) {
    cart = cart.filter((entry) => entry.id !== productId);
  }

  persistCart();
  renderCart();
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  persistCart();
  renderCart();
  showToast("Producto eliminado del carrito.");
}

function getCartSubtotal() {
  return cart.reduce((sum, item) => {
    const product = products.find((entry) => entry.id === item.id);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);
}

function persistCart() {
  localStorage.setItem("obrafuerte-cart", JSON.stringify(cart));
}

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem("obrafuerte-cart")) || [];
  } catch {
    return [];
  }
}

// ==============================
// WhatsApp
// ==============================
function buildWhatsappLink() {
  const intro = "Hola, quiero consultar por el siguiente pedido:";

  const productLines = cart.length
    ? cart
        .map((item) => {
          const product = products.find((entry) => entry.id === item.id);
          if (!product) return "";
          return `• ${product.name} x${item.quantity} — ${formatCurrency(product.price * item.quantity)}`;
        })
        .filter(Boolean)
        .join("\n")
    : "• Quiero recibir asesoramiento sobre herramientas para obra.";

  const totalLine = cart.length ? `\nSubtotal estimado: ${formatCurrency(getCartSubtotal())}` : "";
  const closing = "\n\n¿Me confirman stock, forma de entrega y precio final?";

  const message = encodeURIComponent(`${intro}\n\n${productLines}${totalLine}${closing}`);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
}

function applyWhatsappLinks() {
  const url = buildWhatsappLink();
  checkoutWhatsappBtn.href = url;
  heroWhatsappLink.href = buildWhatsappLink();
  contactWhatsappLink.href = buildWhatsappLink();
}

// ==============================
// UI helpers
// ==============================
function openCart() {
  cartDrawer.classList.add("is-open");
  overlay.classList.add("is-visible");
  cartDrawer.setAttribute("aria-hidden", "false");
}

function closeCartDrawer() {
  cartDrawer.classList.remove("is-open");
  overlay.classList.remove("is-visible");
  cartDrawer.setAttribute("aria-hidden", "true");
}

function toggleMobileMenu() {
  mainNav.classList.toggle("is-open");
  overlay.classList.toggle("is-visible", mainNav.classList.contains("is-open"));
}

function closeMobileMenu() {
  mainNav.classList.remove("is-open");
  if (!cartDrawer.classList.contains("is-open")) {
    overlay.classList.remove("is-visible");
  }
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");

  clearTimeout(showToast.timeoutId);
  showToast.timeoutId = setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 2200);
}

function updateStickyState() {
  topbar.classList.toggle("is-scrolled", window.scrollY > 12);
}

function updateBackToTop() {
  backToTop.classList.toggle("is-visible", window.scrollY > 460);
}

function setupRevealOnScroll() {
  observeReveals();
}

function observeReveals() {
  const revealElements = document.querySelectorAll(".reveal:not(.is-visible)");
  if (!("IntersectionObserver" in window)) {
    revealElements.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealElements.forEach((element) => observer.observe(element));
}

// ==============================
// Utilidades
// ==============================
function formatCurrency(value) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0
  }).format(value);
}

function createProductImage(label, primary, secondary) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="640" height="480" viewBox="0 0 640 480" fill="none">
      <rect width="640" height="480" rx="36" fill="${secondary}"/>
      <circle cx="514" cy="108" r="92" fill="${primary}" opacity="0.16"/>
      <rect x="58" y="76" width="524" height="328" rx="28" fill="white" opacity="0.05"/>
      <rect x="76" y="286" width="244" height="24" rx="12" fill="${primary}" opacity="0.86"/>
      <rect x="76" y="322" width="178" height="16" rx="8" fill="white" opacity="0.4"/>
      <rect x="76" y="114" width="196" height="118" rx="22" fill="${primary}" opacity="0.95"/>
      <rect x="300" y="114" width="214" height="48" rx="18" fill="white" opacity="0.1"/>
      <rect x="300" y="176" width="164" height="24" rx="12" fill="white" opacity="0.08"/>
      <text x="76" y="410" fill="white" font-family="Arial, Helvetica, sans-serif" font-size="40" font-weight="700">${label}</text>
    </svg>
  `.trim();

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}
