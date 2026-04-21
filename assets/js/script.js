// ==============================
// Configuración base
// Número de WhatsApp al que se envía el pedido.
// Formato internacional sin + ni espacios.
// ==============================
const WHATSAPP_NUMBER = "5493815550101";

// ==============================
// Datos del catálogo
// Array de objetos que representa cada producto disponible.
// Propiedades:
//   id          → identificador único usado en el carrito
//   name        → nombre visible del producto
//   category    → nombre de la categoría (debe coincidir con categoryMeta)
//   price       → precio en pesos argentinos (ARS)
//   description → texto breve que se muestra en la tarjeta
//   stock       → "Disponible" | "Últimas unidades"
//   badge       → etiqueta de destacado en la imagen
//   badgeType   → "top" | "sale" | "new" (controla el color del badge)
//   featured    → true: aparece en la sección Destacados
//   image       → SVG generado dinámicamente por createProductImage()
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

// Metadatos por categoría: icono emoji y descripción breve.
// Se usan en las tarjetas de la sección Categorías (renderCategories).
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
// Estado de la aplicación
// Variables globales que controlan qué muestra el catálogo en cada momento.
//   cart           → array de {id, quantity}, persistido en localStorage
//   activeCategory → categoría activa para el filtro ("Todos" = sin filtro)
//   searchTerm     → texto de búsqueda actual (en minúsculas)
// ==============================
let cart = loadCart();
let activeCategory = "Todos";
let searchTerm = "";

// ==============================
// Referencias DOM
// Caché de nodos del DOM para evitar múltiples querySelector durante la ejecución.
// Se inicializan al cargar el script (antes del DOMContentLoaded en algunos casos).
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
// Punto de entrada de la aplicación.
// Se ejecuta cuando el HTML está completamente parseado (DOMContentLoaded).
// Orden de inicialización:
//   1. Render de categorías y filtros
//   2. Render del catálogo y destacados
//   3. Render del carrito (desde localStorage)
//   4. Aplicación de links de WhatsApp
//   5. Registro de eventos
//   6. Animaciones de reveal y estado del header
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

/**
 * setupEvents
 * Registra todos los event listeners de la aplicación.
 * Se llama una sola vez desde DOMContentLoaded.
 * Cubre: búsqueda, filtros, carrito, menú móvil, WhatsApp, scroll.
 */
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

/**
 * renderCategories
 * Genera e inyecta en #categoryGrid las tarjetas de categoría.
 * Cada tarjeta es un <button> que al hacer click:
 *   - actualiza activeCategory
 *   - re-renderiza los filter pills
 *   - re-renderiza el catálogo
 *   - hace scroll suave hacia #catalogo
 */
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

/**
 * renderFilterPills
 * Genera e inyecta en #filterPills las pills de filtro por categoría.
 * La pill activa recibe la clase CSS "is-active".
 * Al hacer click en una pill: actualiza activeCategory y re-renderiza productos.
 */
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

/**
 * renderProducts
 * Filtra el array products según activeCategory y searchTerm,
 * actualiza el contador de resultados (#resultsSummary),
 * muestra u oculta el estado vacío (#emptyState) y
 * vuelca las tarjetas generadas por createProductCard en #productGrid.
 * También activa los botones "Agregar" y las animaciones reveal.
 */
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

/**
 * renderFeatured
 * Filtra los productos con featured:true, toma hasta 4 y los
 * inyecta en #featuredGrid usando createProductCard.
 * Se llama una sola vez en el init (los destacados no cambian con filtros).
 */
function renderFeatured() {
  featuredGrid.innerHTML = products
    .filter((product) => product.featured)
    .slice(0, 4)
    .map((product) => createProductCard(product, true))
    .join("");

  bindAddToCartButtons();
}

/**
 * createProductCard
 * Genera el HTML de una tarjeta de producto como string.
 * @param {Object} product - Objeto del array products.
 * @param {boolean} compact - Reservado para variante compacta (no implementada aún).
 * @returns {string} HTML de la tarjeta <article>.
 */
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

/**
 * bindAddToCartButtons
 * Agrega el listener "click" a todos los botones .add-to-cart-btn
 * presentes en el DOM en ese momento.
 * Se llama después de cada renderProducts / renderFeatured
 * porque el innerHTML se reemplaza (los listeners viejos se pierden).
 */
function bindAddToCartButtons() {
  document.querySelectorAll(".add-to-cart-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const productId = Number(button.dataset.id);
      addToCart(productId);
    });
  });
}

/**
 * getFilteredProducts
 * Devuelve el subconjunto de products que cumple:
 *   - activeCategory === "Todos" O product.category === activeCategory
 *   - searchTerm vacío O coincide en name, category o description (case-insensitive)
 * @returns {Array} Productos filtrados.
 */
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

/**
 * getCategories
 * Devuelve un array con "Todos" seguido de los nombres únicos de categoría
 * extraídos del array products (en el orden en que aparecen).
 * @returns {string[]} Lista de categorías.
 */
function getCategories() {
  return ["Todos", ...new Set(products.map((product) => product.category))];
}

// ==============================
// Carrito
// Lógica de gestión del carrito de compras.
// El estado se guarda en el array `cart` (en memoria) y se
// sincroniza con localStorage en cada modificación (persistCart).
// ==============================

/**
 * addToCart
 * Agrega un producto al carrito o incrementa su cantidad si ya existe.
 * Luego persiste, re-renderiza el carrito y muestra el toast de confirmación.
 * @param {number} productId - ID del producto a agregar.
 */
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

/**
 * renderCart
 * Actualiza el badge del carrito (#cartCount), genera el HTML de los
 * items en #cartItems con sus controles de cantidad, calcula el subtotal
 * y actualiza el href del botón de checkout con el mensaje de WhatsApp.
 */
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

/**
 * updateQuantity
 * Modifica la cantidad de un item en el carrito.
 * Si la cantidad llega a 0 o menos, elimina el item del array.
 * @param {number} productId - ID del producto.
 * @param {number} delta    - Cambio de cantidad (+1 o -1).
 */
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

/**
 * removeFromCart
 * Elimina completamente un producto del carrito (sin importar la cantidad).
 * @param {number} productId - ID del producto a eliminar.
 */
function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  persistCart();
  renderCart();
  showToast("Producto eliminado del carrito.");
}

/**
 * getCartSubtotal
 * Calcula el total del carrito sumando precio * cantidad de cada item.
 * @returns {number} Subtotal en ARS.
 */
function getCartSubtotal() {
  return cart.reduce((sum, item) => {
    const product = products.find((entry) => entry.id === item.id);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);
}

/**
 * persistCart
 * Guarda el array `cart` serializado como JSON en localStorage
 * bajo la clave "obrafuerte-cart".
 */
function persistCart() {
  localStorage.setItem("obrafuerte-cart", JSON.stringify(cart));
}

/**
 * loadCart
 * Lee y parsea el carrito guardado en localStorage.
 * Si no existe o el JSON es inválido devuelve un array vacío.
 * @returns {Array} Array de items {id, quantity}.
 */
function loadCart() {
  try {
    return JSON.parse(localStorage.getItem("obrafuerte-cart")) || [];
  } catch {
    return [];
  }
}

// ==============================
// WhatsApp
// Funciones que construyen y aplican los enlaces de WhatsApp
// con el mensaje de pedido pre-armado.
// ==============================

/**
 * buildWhatsappLink
 * Construye la URL de WhatsApp con el mensaje codificado que incluye:
 *   - Detalle de cada producto (nombre, cantidad, subtotal)
 *   - Subtotal estimado total
 *   - Pregunta de cierre (stock, entrega, precio final)
 * Si el carrito está vacío, genera un mensaje genérico de asesoramiento.
 * @returns {string} URL completa de wa.me con el parámetro ?text=...
 */
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

/**
 * applyWhatsappLinks
 * Aplica la URL de WhatsApp generada a todos los botones/enlaces
 * de WhatsApp del sitio: checkout del drawer, hero y contacto.
 * Se llama en el init y se recalcula automáticamente en renderCart.
 */
function applyWhatsappLinks() {
  const url = buildWhatsappLink();
  checkoutWhatsappBtn.href = url;
  heroWhatsappLink.href = buildWhatsappLink();
  contactWhatsappLink.href = buildWhatsappLink();
}

// ==============================
// UI helpers
// Funciones para manejar la interfaz de usuario:
// apertura/cierre del carrito y menú móvil, toast de notificaciones,
// estado sticky del header y botón "volver arriba".
// ==============================

/**
 * openCart
 * Abre el drawer del carrito: agrega clases CSS y actualiza aria-hidden.
 */
function openCart() {
  cartDrawer.classList.add("is-open");
  overlay.classList.add("is-visible");
  cartDrawer.setAttribute("aria-hidden", "false");
}

/**
 * closeCartDrawer
 * Cierra el drawer del carrito y el overlay de fondo.
 */
function closeCartDrawer() {
  cartDrawer.classList.remove("is-open");
  overlay.classList.remove("is-visible");
  cartDrawer.setAttribute("aria-hidden", "true");
}

/**
 * toggleMobileMenu
 * Alterna la visibilidad del menú de navegación móvil.
 * Activa/desactiva el overlay de fondo al mismo tiempo.
 */
function toggleMobileMenu() {
  mainNav.classList.toggle("is-open");
  overlay.classList.toggle("is-visible", mainNav.classList.contains("is-open"));
}

/**
 * closeMobileMenu
 * Cierra el menú móvil. El overlay solo se oculta si el carrito
 * también está cerrado (para no ocultar el overlay del carrito).
 */
function closeMobileMenu() {
  mainNav.classList.remove("is-open");
  if (!cartDrawer.classList.contains("is-open")) {
    overlay.classList.remove("is-visible");
  }
}

/**
 * showToast
 * Muestra un mensaje de notificación temporal en la parte inferior.
 * Se oculta automáticamente después de 2200 ms.
 * Usa una propiedad estática (showToast.timeoutId) para cancelar
 * el timeout anterior si se llama antes de que expire.
 * @param {string} message - Texto del mensaje a mostrar.
 */
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");

  clearTimeout(showToast.timeoutId);
  showToast.timeoutId = setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 2200);
}

/**
 * updateStickyState
 * Agrega o quita la clase .is-scrolled en la topbar según el scroll.
 * Se llama en el evento "scroll" y en el init (para páginas recargadas con scroll).
 */
function updateStickyState() {
  topbar.classList.toggle("is-scrolled", window.scrollY > 12);
}

/**
 * updateBackToTop
 * Muestra u oculta el botón "volver arriba" según si el scroll
 * supera los 460px desde la parte superior de la página.
 */
function updateBackToTop() {
  backToTop.classList.toggle("is-visible", window.scrollY > 460);
}

/**
 * setupRevealOnScroll
 * Inicializa el sistema de animaciones reveal al hacer scroll.
 * Delegado a observeReveals() para poder reutilizarlo cuando se
 * renderizan nuevas tarjetas dinámicamente.
 */
function setupRevealOnScroll() {
  observeReveals();
}

/**
 * observeReveals
 * Observa con IntersectionObserver todos los elementos .reveal
 * que aún no tienen la clase .is-visible.
 * Al entrar en el viewport (threshold 12%), agrega .is-visible
 * que activa la transición CSS (opacity + translateY).
 * Si IntersectionObserver no está disponible, muestra todos directamente.
 */
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
// Funciones de soporte reutilizadas en todo el módulo.
// ==============================

/**
 * formatCurrency
 * Formatea un número como moneda argentina (ARS) sin decimales.
 * Ejemplo: 124900 → "$ 124.900"
 * @param {number} value - Valor numérico a formatear.
 * @returns {string} Cadena de texto formateada.
 */
function formatCurrency(value) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0
  }).format(value);
}

/**
 * createProductImage
 * Genera una imagen SVG codificada como data URI para usarla
 * como src de <img>. Evita dependencia de imágenes externas.
 * El SVG es una composición geométrica simple con el nombre del producto.
 * @param {string} label     - Texto (nombre corto) que se muestra en el SVG.
 * @param {string} primary   - Color primario (hex/rgb) para los elementos destacados.
 * @param {string} secondary - Color de fondo del SVG.
 * @returns {string} Data URI con el SVG codificado en UTF-8.
 */
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
