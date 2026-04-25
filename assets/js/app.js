/* =============================================================
   app.js — Lógica principal del catálogo ObraFuerte
   -------------------------------------------------------------
   Responsabilidades:
     - Cargar productos desde data/productos.json (fetch async)
     - Renderizar estadísticas en vivo en el hero
     - Generar la barra de navegación de categorías
     - Poblar el <select> de filtro de la toolbar
     - Filtrar y renderizar tarjetas de producto
     - Construir HTML de cada card con lógica de carrito
     - Bindear eventos de búsqueda, filtro y botones de carrito

   Depende de:
     - carrito.js (debe cargarse antes): expone carritoState,
       addToCart(), increaseCartItem(), decreaseCartItem()
   ============================================================= */


/* ── Estado global de la aplicación ────────────────────────────
   Único objeto de estado. Todas las funciones de render lo leen;
   applyFilters() y los handlers de eventos lo mutan.
   ─────────────────────────────────────────────────────────── */
const state = {
  products: [],          // Array completo cargado desde el JSON
  filteredProducts: [],  // Subconjunto después de aplicar filtros
  categories: [],        // [{ name: string, total: number }] ordenado A–Z
  activeCategory: "Todas", // Categoría seleccionada actualmente
  searchTerm: ""         // Término de búsqueda en minúsculas
};

const categoryLoopState = {
  rafId: 0,
  lastTs: 0,
  offsetX: 0,
  loopDistance: 1,
  speedPxPerSecond: 38,
  isDragging: false,
  startPointerX: 0,
  startOffsetX: 0,
  suppressClick: false,
  resizeBound: false
};


/* ── Formateador de moneda ──────────────────────────────────────
   Convierte números a formato ARS: 124900 → "$ 124.900"
   ─────────────────────────────────────────────────────────── */
const currencyFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0
});

/* ── initApp ────────────────────────────────────────────────────
   Punto de entrada. Llamado en DOMContentLoaded.
   Flujo:
     1. Fetch de data/productos.json
     2. Almacena productos en state y deriva categorías
     3. Lanza todas las funciones de render en orden
     4. Bindea los eventos de interacción
   En caso de error muestra mensaje en la grilla.
   ─────────────────────────────────────────────────────────── */
async function initApp() {
  try {
    const response = await fetch("data/productos.json");
    if (!response.ok) throw new Error("No se pudo cargar el archivo de productos.");

    const products = await response.json();
    state.products = products;
    state.categories = buildCategories(products);

    renderHeroStats();
    renderCategoriesNav();
    renderCategorySelect();
    applyFilters();
    bindEvents();
    bindProductGridNavigation();
    bindHeaderSearch();
    bindProductDetailEvents();
  } catch (error) {
    console.error(error);
    // Muestra error en la grilla si el JSON no pudo cargarse
    const rows = document.getElementById("productRows");
    if (rows) {
      rows.innerHTML = '<div class="catalog-empty">No se pudieron cargar los productos.</div>';
    }
  }
}

/* ── buildCategories ────────────────────────────────────────────
   Deriva las categorías únicas desde el array de productos.
   Usa un Map para contar la cantidad de ítems por categoría.
   Retorna: [{ name: "Taladros", total: 12 }, ...] ordenado A–Z.
   ─────────────────────────────────────────────────────────── */
function buildCategories(products) {
  const map = new Map();
  for (const product of products) {
    const key = product.categoria || "Sin categoría";
    map.set(key, (map.get(key) || 0) + 1);
  }
  return [...map.entries()]
    .sort((a, b) => a[0].localeCompare(b[0], "es"))
    .map(([name, total]) => ({ name, total }));
}

/* ── renderHeroStats ────────────────────────────────────────────
   Actualiza los números en la tarjeta del hero:
   - #heroProductCount: total de productos cargados
   - #heroCategoryCount: total de categorías disponibles
   ─────────────────────────────────────────────────────────── */
function renderHeroStats() {
  const productCount = document.getElementById("heroProductCount");
  const categoryCount = document.getElementById("heroCategoryCount");

  if (productCount) productCount.textContent = state.products.length;
  if (categoryCount) categoryCount.textContent = state.categories.length;
}

/* ── renderCategoriesNav ────────────────────────────────────────
   Genera la barra de filtros por categoría (#categoryNav).
   Cada <span> recibe la clase .active si coincide con state.activeCategory.
   Al hacer click:
     - Actualiza state.activeCategory
     - Re-renderiza la barra (mueve .active)
     - Llama a renderProducts() con el nuevo filtro
     - Hace scroll suave hacia #catalogo
   ─────────────────────────────────────────────────────────── */
function renderCategoriesNav() {
  const container = document.getElementById("categoryNav");
  if (!container) return;

  const categorias = [
    "Todas",
    ...new Set(state.products.map(p => p.categoria))
  ];

  const categoryImageMap = new Map();
  state.products.forEach((product) => {
    if (!categoryImageMap.has(product.categoria) && product.imagen) {
      categoryImageMap.set(product.categoria, product.imagen);
    }
  });

  const fallbackImage = state.products.find((product) => product.imagen)?.imagen
    || "assets/img/productos/placeholder.jpg";

  const shortLabels = {
    "Vibradores de concreto": "Vibradoras",
    "Compactadoras": "Compact.",
  };

  function renderCategorySet() {
    return categorias.map((cat) => {
      const image = cat === "Todas"
        ? "assets/img/LogoDP.png"
        : (categoryImageMap.get(cat) || fallbackImage);

      const activeClass = cat === state.activeCategory ? "active" : "";
      const label = escapeHtml(shortLabels[cat] ?? cat);

      return `
        <button class="categoria-link ${activeClass}" type="button" data-category="${escapeAttribute(cat)}" aria-label="Filtrar por ${escapeAttribute(cat)}">
          <span class="categoria-link__bubble">
            <img src="${escapeAttribute(image)}" alt="${escapeAttribute(cat)}" loading="lazy" onerror="this.onerror=null; this.src='assets/img/productos/placeholder.jpg';" />
          </span>
          <span class="categoria-link__label">${label}</span>
        </button>
      `;
    }).join("");
  }

  container.innerHTML = `
    <div class="categorias-loop-set">
      ${renderCategorySet()}
    </div>
    <div class="categorias-loop-set">
      ${renderCategorySet()}
    </div>
  `;

  // Listeners de click en cada botón — sin setPointerCapture el click llega normalmente
  container.querySelectorAll(".categoria-link").forEach((link) => {
    link.addEventListener("click", () => {
      const cat = link.dataset.category;
      if (!cat) return;

      state.activeCategory = cat;

      // No se sincroniza el select — el usuario lo controla manualmente
      state.searchTerm = "";
      const searchInput = document.getElementById("searchInput");
      if (searchInput) searchInput.value = "";

      // Mueve .active sin re-renderizar el nav
      container.querySelectorAll(".categoria-link").forEach((btn) => {
        btn.classList.toggle("active", btn.dataset.category === cat);
      });

      applyFilters();

      window.setTimeout(() => {
        document.getElementById("productRows")?.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }, 60);
    });
  });

  setupCategoriesDragLoop(container);
}

function setupCategoriesDragLoop(container) {
  const loopSets = container.querySelectorAll(".categorias-loop-set");
  if (!loopSets.length) return;

  const recalcLoopDistance = () => {
    const firstSet = container.querySelector(".categorias-loop-set");
    if (!firstSet) return;

    const width = firstSet.getBoundingClientRect().width;
    if (width > 0) {
      categoryLoopState.loopDistance = width;
      normalizeCategoryOffset();
      applyCategoryOffset(container);
    }
  };

  if (container.dataset.dragBound !== "true") {
    container.dataset.dragBound = "true";

    container.addEventListener("pointerdown", (event) => {
      if (!event.isPrimary) return;
      if (event.pointerType === "mouse" && event.button !== 0) return;

      categoryLoopState.isDragging = true;
      categoryLoopState.startPointerX = event.clientX;
      categoryLoopState.startOffsetX = categoryLoopState.offsetX;
      categoryLoopState.suppressClick = false;
      container.classList.add("is-dragging");
      // SIN setPointerCapture: los botones hijos reciben click normalmente.
      // Usamos listeners en window para seguir el arrastre fuera del contenedor.

      const onMove = (e) => {
        if (!categoryLoopState.isDragging) return;
        const dragDelta = e.clientX - categoryLoopState.startPointerX;
        categoryLoopState.offsetX = categoryLoopState.startOffsetX + dragDelta;
        categoryLoopState.suppressClick = Math.abs(dragDelta) > 20;
        normalizeCategoryOffset();
        applyCategoryOffset(container);
        e.preventDefault();
      };

      const onUp = () => {
        if (!categoryLoopState.isDragging) return;
        categoryLoopState.isDragging = false;
        categoryLoopState.lastTs = 0;
        container.classList.remove("is-dragging");
        if (categoryLoopState.suppressClick) {
          window.setTimeout(() => { categoryLoopState.suppressClick = false; }, 0);
        }
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
        window.removeEventListener("pointercancel", onUp);
      };

      window.addEventListener("pointermove", onMove, { passive: false });
      window.addEventListener("pointerup", onUp);
      window.addEventListener("pointercancel", onUp);
    });
  }

  recalcLoopDistance();

  if (!categoryLoopState.resizeBound) {
    categoryLoopState.resizeBound = true;
    window.addEventListener("resize", () => {
      const nav = document.getElementById("categoryNav");
      if (!nav) return;
      const firstSet = nav.querySelector(".categorias-loop-set");
      if (!firstSet) return;

      const width = firstSet.getBoundingClientRect().width;
      if (width > 0) {
        categoryLoopState.loopDistance = width;
        normalizeCategoryOffset();
        applyCategoryOffset(nav);
      }
    });
  }

  startCategoryLoop(container);
}

function normalizeCategoryOffset() {
  const distance = Math.max(1, categoryLoopState.loopDistance);
  while (categoryLoopState.offsetX <= -distance) {
    categoryLoopState.offsetX += distance;
  }
  while (categoryLoopState.offsetX > 0) {
    categoryLoopState.offsetX -= distance;
  }
}

function applyCategoryOffset(container) {
  container.style.transform = `translate3d(${categoryLoopState.offsetX}px, 0, 0)`;
}

function startCategoryLoop(container) {
  if (categoryLoopState.rafId) return;

  const tick = (timestamp) => {
    if (!categoryLoopState.lastTs) categoryLoopState.lastTs = timestamp;

    const deltaMs = timestamp - categoryLoopState.lastTs;
    categoryLoopState.lastTs = timestamp;

    if (!categoryLoopState.isDragging) {
      const deltaPx = (categoryLoopState.speedPxPerSecond * deltaMs) / 1000;
      categoryLoopState.offsetX -= deltaPx;
      normalizeCategoryOffset();
      applyCategoryOffset(container);
    }

    categoryLoopState.rafId = requestAnimationFrame(tick);
  };

  categoryLoopState.rafId = requestAnimationFrame(tick);
}

/* ── renderCategorySelect ───────────────────────────────────────
   Puebla el <select id="categorySelect"> de la toolbar con las
   categorías de state.categories. La opción "Todas" es fija en HTML.
   ─────────────────────────────────────────────────────────── */
function renderCategorySelect() {
  const select = document.getElementById("categorySelect");
  if (!select) return;

  select.innerHTML = [
    '<option value="Todas">Todas las categorías</option>',
    ...state.categories.map(
      (category) => `<option value="${escapeHtml(category.name)}">${escapeHtml(category.name)}</option>`
    )
  ].join("");
}

/* ── bindEvents ─────────────────────────────────────────────────
   Asocia todos los eventos de la interfaz del catálogo:
   1. #searchInput (input)  → filtra en tiempo real por texto
   2. #categorySelect (change) → filtra por categoría
   3. #productGrid (click, delegado) → maneja:
        · .product-card__cart-btn → addToCart()
        · .qty-btn (+ / −)       → increaseCartItem() / decreaseCartItem()
   La delegación en la grilla funciona aunque el HTML se re-renderice.
   ─────────────────────────────────────────────────────────── */
function bindEvents() {
  const searchInput = document.getElementById("searchInput");
  const categorySelect = document.getElementById("categorySelect");

  searchInput?.addEventListener("input", (event) => {
    state.searchTerm = event.target.value.trim().toLowerCase();

    // Al escribir, buscar en todos los productos ignorando la categoría activa
    if (state.searchTerm.length > 0) {
      state.activeCategory = "Todas";
      // Quita el .active de todas las burbujas
      document.querySelectorAll("#categoryNav .categoria-link").forEach((btn) => {
        btn.classList.toggle("active", btn.dataset.category === "Todas");
      });
    }

    applyFilters();
  });

  categorySelect?.addEventListener("change", (event) => {
    state.activeCategory = event.target.value;
    renderCategoriesNav();
    applyFilters();
  });

  // Delegación de eventos para botones de carrito en las cards
  document.getElementById("productRows")?.addEventListener("click", (event) => {
    // --- Botón "Agregar" ---
    const addBtn = event.target.closest(".product-card__cart-btn");
    if (addBtn) {
      addToCart(addBtn.dataset.id, state.products);
      // Re-render explícito: garantiza que la card cambie a qty-control
      // aunque syncProducts() falle (no depender solo del puente cross-file)
      renderProducts();
      // Abre el drawer para que el usuario confirme que el producto fue agregado
      openCartDrawer();
      return;
    }

    // --- Botones ─ / + del control de cantidad en la card ---
    const qtyBtn = event.target.closest(".qty-btn");
    if (qtyBtn) {
      const { action, id } = qtyBtn.dataset;
      if (action === "decrease") decreaseCartItem(id);
      if (action === "increase") increaseCartItem(id);
      return;
    }

    // --- Click en la tarjeta (imagen o cuerpo) → abre detalle ---
    const card = event.target.closest(".product-card");
    if (card && card.dataset.id) {
      openProductDetail(card.dataset.id);
    }
  });
}

/* ── applyFilters ───────────────────────────────────────────────
   Filtra state.products combinando:
   - Categoría activa ("Todas" muestra todo)
   - Término de búsqueda (busca en nombre, marca, código y categoría)
   Guarda el resultado en state.filteredProducts y llama renderProducts().
   ─────────────────────────────────────────────────────────── */
function applyFilters() {
  state.filteredProducts = state.products
    .filter((product) => {
      const matchesCategory =
        state.activeCategory === "Todas" || product.categoria === state.activeCategory;

      const haystack = [
        product.nombre,
        product.marca,
        product.codigo,
        product.categoria
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = haystack.includes(state.searchTerm);
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      const categoryA = String(a.categoria || "Sin categoría");
      const categoryB = String(b.categoria || "Sin categoría");
      const byCategory = categoryA.localeCompare(categoryB, "es", { sensitivity: "base" });
      if (byCategory !== 0) return byCategory;

      const nameA = String(a.nombre || "");
      const nameB = String(b.nombre || "");
      return nameA.localeCompare(nameB, "es", { sensitivity: "base" });
    });

  renderProducts();
}

/* ── renderProducts ─────────────────────────────────────────────
   Renderiza la grilla #productGrid con state.filteredProducts.
   Si no hay resultados muestra un estado vacío.
   Cada tarjeta se construye con createProductCard().
   ─────────────────────────────────────────────────────────── */
function renderProducts() {
  const productRows = document.getElementById("productRows");
  if (!productRows) return;

  if (!state.filteredProducts.length) {
    productRows.classList.remove("is-single-row");
    productRows.innerHTML = '<div class="catalog-empty">No se encontraron productos con ese criterio.</div>';
    refreshProductGridNavigation();
    return;
  }

  const hasActiveFilter = state.activeCategory !== "Todas" || state.searchTerm.length > 0;
  const rowBuckets = hasActiveFilter ? [state.filteredProducts] : [[], [], []];

  if (!hasActiveFilter) {
    state.filteredProducts.forEach((product, index) => {
      rowBuckets[index % 3].push(product);
    });
  }

  productRows.classList.toggle("is-single-row", hasActiveFilter);

  productRows.innerHTML = rowBuckets
    .filter((rowProducts) => rowProducts.length > 0)
    .map((rowProducts, index) => {
      const rowCards = rowProducts.map((product) => createProductCard(product)).join("");
      return `
        <div class="product-grid-shell" data-row-index="${index + 1}">
          <button class="product-grid-arrow product-grid-arrow--prev" type="button" data-dir="prev" aria-label="Ver productos anteriores de la fila ${index + 1}">❮</button>
          <div class="product-grid" data-row-grid="${index + 1}">${rowCards}</div>
          <button class="product-grid-arrow product-grid-arrow--next" type="button" data-dir="next" aria-label="Ver productos siguientes de la fila ${index + 1}">❯</button>
        </div>
      `;
    })
    .join("");

  refreshProductGridNavigation();
}

/* ── Navegación del carrusel de productos ──────────────────────
   Botones anterior/siguiente + rueda de mouse horizontal.
   ─────────────────────────────────────────────────────────── */
function bindProductGridNavigation() {
  const rows = document.getElementById("productRows");

  if (!rows || rows.dataset.navBound === "true") return;

  rows.addEventListener("click", (event) => {
    const arrow = event.target.closest(".product-grid-arrow");
    if (!arrow || arrow.disabled) return;

    const shell = arrow.closest(".product-grid-shell");
    const rowGrid = shell?.querySelector(".product-grid");
    if (!rowGrid) return;

    const step = Math.max(280, Math.floor(rowGrid.clientWidth * 0.82));
    const direction = arrow.dataset.dir === "prev" ? -1 : 1;

    rowGrid.scrollBy({ left: step * direction, behavior: "smooth" });
  });

  rows.addEventListener("scroll", (event) => {
    if (event.target.classList?.contains("product-grid")) {
      refreshProductGridNavigation();
    }
  }, { passive: true, capture: true });

  window.addEventListener("resize", refreshProductGridNavigation);

  rows.dataset.navBound = "true";
  refreshProductGridNavigation();
}

function refreshProductGridNavigation() {
  const rowShells = document.querySelectorAll("#productRows .product-grid-shell");
  if (!rowShells.length) return;

  const isTouchLayout = window.matchMedia("(max-width: 768px)").matches;

  rowShells.forEach((shell) => {
    const rowGrid = shell.querySelector(".product-grid");
    const prevBtn = shell.querySelector('.product-grid-arrow[data-dir="prev"]');
    const nextBtn = shell.querySelector('.product-grid-arrow[data-dir="next"]');
    if (!rowGrid || !prevBtn || !nextBtn) return;

    if (isTouchLayout) {
      prevBtn.hidden = true;
      nextBtn.hidden = true;
      prevBtn.disabled = true;
      nextBtn.disabled = true;
      return;
    }

    prevBtn.hidden = false;
    nextBtn.hidden = false;

    const canScroll = rowGrid.scrollWidth > rowGrid.clientWidth + 8;
    if (!canScroll) {
      prevBtn.disabled = true;
      nextBtn.disabled = true;
      return;
    }

    const atStart = rowGrid.scrollLeft <= 4;
    const atEnd = rowGrid.scrollLeft + rowGrid.clientWidth >= rowGrid.scrollWidth - 4;
    prevBtn.disabled = atStart;
    nextBtn.disabled = atEnd;
  });
}

/* ── createProductCard ──────────────────────────────────────────
   Construye el HTML de una tarjeta de producto.

   Lógica del área de acción (footer de la card):
   - Si el producto NO está en carritoState → botón "Agregar" con ícono SVG
   - Si el producto SÍ está en carritoState → control de cantidad (− N +)

   La clase .product-card--in-cart aplica borde dorado visual.
   Todos los valores son sanitizados con escapeHtml() para prevenir XSS.
   ─────────────────────────────────────────────────────────── */
function createProductCard(product) {
  // Sanitización de valores para prevenir XSS al inyectar en innerHTML
  const nombre    = escapeHtml(product.nombre    || "Producto");
  const marca     = escapeHtml(product.marca     || "Sin marca");
  const categoria = escapeHtml(product.categoria || "Sin categoría");
  const codigo    = escapeHtml(product.codigo    || "-");
  const imagen    = escapeAttribute(product.imagen || "assets/img/productos/placeholder.jpg");
  const stock     = Number.isFinite(Number(product.stock)) ? Number(product.stock) : 0;
  const precio    = Number(product.precioARS || product.precio || 0);

  // Verifica si el producto ya fue agregado al carrito
  const cartItem = carritoState.items.find(
    (i) => String(i.id) === String(product.id)
  );

  // Acción dinámica: control de cantidad si ya está, botón agregar si no
  const actionHtml = cartItem
    ? `<div class="product-card__qty-control">
        <button class="qty-btn" type="button" data-action="decrease" data-id="${product.id}" aria-label="Quitar uno">−</button>
        <span class="qty-display">${cartItem.quantity}</span>
        <button class="qty-btn" type="button" data-action="increase" data-id="${product.id}" aria-label="Agregar uno">+</button>
      </div>`
    : `<button class="product-card__cart-btn" type="button" data-id="${product.id}">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
        Agregar
      </button>`;

  // Clase adicional cuando el producto ya está en el carrito (borde dorado)
  const inCartClass = cartItem ? " product-card--in-cart" : "";

  return `
    <article class="product-card${inCartClass}" data-id="${product.id}">
      <div class="product-card__image product-card__image--clickable">
        <img src="${imagen}" alt="${nombre}" loading="lazy" onerror="this.style.opacity='0.25';" />
      </div>
      <div class="product-card__body">
        <div class="product-card__meta">
          <span class="badge badge--category">${categoria}</span>
          <span class="badge badge--brand">${marca}</span>
        </div>

        <h3 class="product-card__title">${nombre}</h3>

        <div class="product-card__info">
          <span>Cód: <strong>${codigo}</strong></span>
          <span>Stock: <strong>${stock}</strong></span>
        </div>

        <div class="product-card__footer">
          <div class="product-card__price">
            <span>Precio</span>
            <strong>${currencyFormatter.format(precio)}</strong>
          </div>
          ${actionHtml}
        </div>
      </div>
    </article>
  `;
}
/* ── openProductDetail ──────────────────────────────────────────
   Abre el modal de detalle de producto con los datos del ítem
   cuyo id coincide con productId.
   ─────────────────────────────────────────────────────────── */
function openProductDetail(productId) {
  const product = state.products.find((p) => String(p.id) === String(productId));
  if (!product) return;

  const modal   = document.getElementById("productModal");
  const overlay = document.getElementById("productModalOverlay");
  if (!modal || !overlay) return;

  // Imagen
  const imgContainer = document.getElementById("productModalImage");
  if (imgContainer) {
    const imgSrc   = escapeAttribute(product.imagen || "assets/img/productos/placeholder.jpg");
    const imgAlt   = escapeHtml(product.nombre || "Producto");
    imgContainer.innerHTML = `<img src="${imgSrc}" alt="${imgAlt}" onerror="this.style.opacity='0.25';" />`;
  }

  // Badges
  const badges = document.getElementById("productModalBadges");
  if (badges) {
    badges.innerHTML = [
      product.categoria ? `<span class="badge badge--category">${escapeHtml(product.categoria)}</span>` : "",
      product.marca     ? `<span class="badge badge--brand">${escapeHtml(product.marca)}</span>`         : ""
    ].join("");
  }

  // Nombre
  const nameEl = document.getElementById("productModalName");
  if (nameEl) nameEl.textContent = product.nombre || "Producto";

  // Meta: código y stock
  const metaEl = document.getElementById("productModalMeta");
  if (metaEl) {
    metaEl.innerHTML = `
      <span class="product-modal__meta-item">Código<strong>${escapeHtml(product.codigo || "-")}</strong></span>
      <span class="product-modal__meta-item">Stock<strong>${Number.isFinite(Number(product.stock)) ? Number(product.stock) : 0}</strong></span>
    `;
  }

  // Precio
  const priceEl = document.getElementById("productModalPrice");
  if (priceEl) {
    const precio = Number(product.precioARS || product.precio || 0);
    priceEl.innerHTML = `
      <span class="label">Precio</span>
      <span class="amount">${currencyFormatter.format(precio)}</span>
    `;
  }

  // Acciones: agregar al carrito + WhatsApp
  const actionsEl = document.getElementById("productModalActions");
  if (actionsEl) {
    const cartItem = carritoState.items.find((i) => String(i.id) === String(product.id));
    const waText   = encodeURIComponent(product.whatsappTexto || `Hola, quiero consultar por ${product.nombre}`);
    const waHref   = `https://wa.me/5493815035162?text=${waText}`;

    const cartHtml = cartItem
      ? `<div class="product-card__qty-control" style="border-radius:999px; padding: 6px 10px;">
          <button class="qty-btn" type="button" data-action="decrease" data-id="${product.id}" aria-label="Quitar uno">−</button>
          <span class="qty-display">${cartItem.quantity}</span>
          <button class="qty-btn" type="button" data-action="increase" data-id="${product.id}" aria-label="Agregar uno">+</button>
        </div>`
      : `<button class="btn btn--primary product-modal__add-btn" type="button" data-id="${product.id}" style="display:inline-flex;align-items:center;gap:8px;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
          Agregar al carrito
        </button>`;

    actionsEl.innerHTML = `
      ${cartHtml}
      <a class="btn--whatsapp" href="${waHref}" target="_blank" rel="noopener noreferrer">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.136.564 4.136 1.55 5.871L.058 23.625l5.897-1.548A11.934 11.934 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.9 0-3.663-.52-5.168-1.42l-.37-.22-3.5.919.932-3.41-.24-.38A9.96 9.96 0 0 1 2 12c0-5.514 4.486-10 10-10s10 4.486 10 10-4.486 10-10 10z"/></svg>
        Consultar por WhatsApp
      </a>
    `;

    // Botón agregar desde el modal
    actionsEl.querySelector(".product-modal__add-btn")?.addEventListener("click", () => {
      addToCart(product.id, state.products);
      openProductDetail(product.id); // re-renderiza con el control de cantidad
      renderProducts();
    });

    // Botones +/- desde el modal
    actionsEl.querySelectorAll(".qty-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const { action, id } = btn.dataset;
        if (action === "decrease") decreaseCartItem(id);
        if (action === "increase") increaseCartItem(id);
        openProductDetail(product.id); // re-renderiza la cantidad
      });
    });
  }

  // Bloquea scroll del body
  document.body.style.overflow = "hidden";
  overlay.classList.add("is-open");
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  modal.focus?.();
}

/* ── closeProductDetail ─────────────────────────────────────────
   Cierra el modal de detalle y restaura el scroll.
   ─────────────────────────────────────────────────────────── */
function closeProductDetail() {
  const modal   = document.getElementById("productModal");
  const overlay = document.getElementById("productModalOverlay");
  if (!modal || !overlay) return;

  overlay.classList.remove("is-open");
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

/* ── bindProductDetailEvents ────────────────────────────────────
   Registra los eventos del modal de detalle de producto:
   - Botón "Volver al catálogo" (#productModalClose)
   - Click en el overlay oscuro
   - Tecla Escape
   ─────────────────────────────────────────────────────────── */
function bindProductDetailEvents() {
  document.getElementById("productModalClose")?.addEventListener("click", closeProductDetail);
  document.getElementById("productModalOverlay")?.addEventListener("click", closeProductDetail);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const modal = document.getElementById("productModal");
      if (modal?.classList.contains("is-open")) closeProductDetail();
    }
  });
}

/* ── bindHeaderSearch ───────────────────────────────────────────
   Conecta el input #headerSearch del nav con un dropdown de
   resultados en vivo (#headerSearchResults).

   Comportamiento:
   - Menos de 2 caracteres → cierra el dropdown
   - 2+ caracteres → busca en nombre, marca, código y categoría
   - Máximo 6 resultados en el dropdown + pie "Ver todos"
   - Click en un resultado → aplica el término en el catálogo,
     hace scroll a #catalogo y cierra el dropdown
   - Click en "Ver todos" → igual pero con scroll directo
   - Click fuera del dropdown o Escape → cierra el dropdown
   ─────────────────────────────────────────────────────────── */
function bindHeaderSearch() {
  const input   = document.getElementById("headerSearch");
  const results = document.getElementById("headerSearchResults");
  if (!input || !results) return;

  const MAX_RESULTS = 6;

  /* Aplica el término en el catálogo y hace scroll */
  function goToCatalog(term) {
    // Sincroniza con el input del catálogo
    const catalogInput = document.getElementById("searchInput");
    if (catalogInput) catalogInput.value = term;

    // Resetea categoría activa → busca en todos los productos
    state.activeCategory = "Todas";
    const select = document.getElementById("categorySelect");
    if (select) select.value = "Todas";

    // Quita .active de todas las burbujas
    document.querySelectorAll("#categoryNav .categoria-link").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.category === "Todas");
    });

    state.searchTerm = term.toLowerCase();
    applyFilters();

    document.getElementById("productRows")?.scrollIntoView({ behavior: "smooth", block: "start" });
    closeDropdown();
    input.value = "";
  }

  function closeDropdown() {
    results.hidden = true;
    results.innerHTML = "";
  }

  function renderDropdown(term) {
    const q = term.trim().toLowerCase();
    if (q.length < 2) { closeDropdown(); return; }

    const matches = state.products.filter((p) => {
      const hay = [p.nombre, p.marca, p.codigo, p.categoria]
        .filter(Boolean).join(" ").toLowerCase();
      return hay.includes(q);
    });

    if (!matches.length) {
      results.innerHTML = `<p class="search-result-empty">Sin resultados para "<strong>${escapeHtml(term)}</strong>"</p>`;
      results.hidden = false;
      return;
    }

    const items = matches.slice(0, MAX_RESULTS).map((p) => {
      // SVG inline que se usa como placeholder cuando la imagen no existe aún
      const placeholderSvg = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23cbd5e1' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2'/%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'/%3E%3Cpath d='M21 15l-5-5L5 21'/%3E%3C/svg%3E`;
      const imgSrc = escapeAttribute(p.imagen || "");
      return `
      <div class="search-result-item" data-term="${escapeAttribute(p.nombre)}" role="option" tabindex="0">
        <div class="search-result-item__thumb">
          <img
            class="search-result-item__img"
            src="${imgSrc}"
            alt="${escapeAttribute(p.nombre)}"
            loading="lazy"
            onerror="this.onerror=null; this.src='${placeholderSvg}'; this.classList.add('is-placeholder');"
          />
        </div>
        <div class="search-result-item__info">
          <div class="search-result-item__name">${escapeHtml(p.nombre)}</div>
          <div class="search-result-item__meta">${escapeHtml(p.marca || "")} · ${escapeHtml(p.categoria || "")}</div>
        </div>
        <span class="search-result-item__price">${currencyFormatter.format(Number(p.precioARS || 0))}</span>
      </div>
    `;
    }).join("");

    const footer = matches.length > MAX_RESULTS
      ? `<span class="search-result-footer">Ver los ${matches.length} resultados en el catálogo →</span>`
      : `<span class="search-result-footer">Ver ${matches.length} resultado${matches.length !== 1 ? "s" : ""} en el catálogo →</span>`;

    results.innerHTML = items + footer;
    results.hidden = false;

    // Click en un resultado individual
    results.querySelectorAll(".search-result-item").forEach((el) => {
      el.addEventListener("click", () => goToCatalog(el.dataset.term));
      el.addEventListener("keydown", (e) => { if (e.key === "Enter") goToCatalog(el.dataset.term); });
    });

    // Click en el pie "Ver todos"
    results.querySelector(".search-result-footer")
      ?.addEventListener("click", () => goToCatalog(term));
  }

  // Input: dispara la búsqueda
  input.addEventListener("input", () => renderDropdown(input.value));

  // Escape: cierra el dropdown
  input.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeDropdown();
    if (e.key === "Enter" && input.value.trim().length >= 2) goToCatalog(input.value.trim());
  });

  // Click fuera: cierra el dropdown
  document.addEventListener("click", (e) => {
    if (!input.closest(".header__search-wrap").contains(e.target)) closeDropdown();
  });
}
/* ── Utilidades de seguridad (Anti-XSS) ────────────────────────
   escapeHtml:      escapa caracteres especiales para contenido de texto
   escapeAttribute: escapa valores dentro de atributos HTML
   Ambas se usan al construir HTML dinámicamente con innerHTML.

   ─────────────────────────────────────────────────────────────── */
function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttribute(value) {
  return escapeHtml(value);
}


/* ── Inicialización ──────────────────────────────────────────────
   Espera al evento DOMContentLoaded para garantizar que todos
   los elementos del DOM existen antes de ejecutar initApp().
   carrito.js tiene su propio listener independiente.
   ─────────────────────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", initApp);