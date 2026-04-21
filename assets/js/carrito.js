/* =============================================================
   carrito.js — Carrito de compras ObraFuerte
   -------------------------------------------------------------
   Responsabilidades:
     - Mantener el estado del carrito en memoria (carritoState)
     - Persistir en localStorage (clave: "obrafuerte-cart")
     - Mutaciones: agregar, incrementar, decrementar, quitar, vaciar
     - Renderizar el drawer (#cartDrawer) con ítems y totales
     - Generar el link de WhatsApp con el detalle del pedido
     - Abrir/cerrar el panel lateral (drawer) del carrito

   Exporta (globalmente):
     carritoState, addToCart, increaseCartItem, decreaseCartItem
   Depende de:
     - Nada. Debe cargarse ANTES que app.js.
   ============================================================= */


/* ── Estado global del carrito ──────────────────────────────────
   Se hidrata desde localStorage al cargar la página.
   Si no hay datos previos, arranca con carrito vacío.
   Cada ítem: { id, nombre, codigo, precio, stock, quantity }
   ─────────────────────────────────────────────────────────── */
const carritoState = {
  items: JSON.parse(localStorage.getItem("obrafuerte-cart")) || []
};


/* ── Formateador de moneda ─────────────────────────────────────
   Usado para mostrar precios con formato ARS dentro del drawer.
   ─────────────────────────────────────────────────────────── */
const cartCurrencyFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0
});

/* ── saveCart ────────────────────────────────────────────────────
   Serializa carritoState.items en localStorage.
   Llamada por todas las funciones de mutación.
   ─────────────────────────────────────────────────────────── */
function saveCart() {
  localStorage.setItem("obrafuerte-cart", JSON.stringify(carritoState.items));
}


/* ── syncProducts ──────────────────────────────────────────────
   Puente de comunicación entre carrito.js y app.js.
   Llama a renderProducts() si la función existe en el ámbito global
   (definida en app.js). Esto re-dibuja las tarjetas del catálogo
   para mostrar el control de cantidad en vez del botón "Agregar".
   ─────────────────────────────────────────────────────────── */
function syncProducts() {
  if (typeof renderProducts === "function") renderProducts();
}

/* ── addToCart ─────────────────────────────────────────────────
   Agrega un producto al carrito o incrementa su cantidad si ya existe.
   Busca el producto en el array "products" (pasado desde app.js).
   Respeta el límite de stock: no agrega más unidades que el stock.
   Flujo: saveCart → renderCart → syncProducts
   ─────────────────────────────────────────────────────────── */
function addToCart(productId, products) {
  const product = products.find((item) => String(item.id) === String(productId));
  if (!product) return;

  const existingItem = carritoState.items.find(
    (item) => String(item.id) === String(productId)
  );

  const stock = Number(product.stock || 0);
  const precio = Number(product.precioARS || product.precio || 0);

  if (existingItem) {
    if (existingItem.quantity < stock) {
      existingItem.quantity += 1;
    }
  } else {
    carritoState.items.push({
      id: product.id,
      nombre: product.nombre,
      codigo: product.codigo,
      precio,
      stock,
      quantity: 1
    });
  }

  saveCart();
  renderCart();
  syncProducts();
}

/* ── increaseCartItem ───────────────────────────────────────────
   Incrementa en 1 la cantidad del ítem. Respeta el stock máximo.
   Llamado desde los botones (+) del drawer y de las tarjetas.
   Flujo: saveCart → renderCart → syncProducts
   ─────────────────────────────────────────────────────────── */
function increaseCartItem(productId) {
  const item = carritoState.items.find(
    (cartItem) => String(cartItem.id) === String(productId)
  );

  if (!item) return;

  if (item.quantity < item.stock) {
    item.quantity += 1;
    saveCart();
    renderCart();
    syncProducts();
  }
}

/* ── decreaseCartItem ───────────────────────────────────────────
   Decrementa en 1 la cantidad del ítem.
   Si la cantidad llega a 0, elimina el ítem del carrito.
   Flujo: saveCart → renderCart → syncProducts
   ─────────────────────────────────────────────────────────── */
function decreaseCartItem(productId) {
  const item = carritoState.items.find(
    (cartItem) => String(cartItem.id) === String(productId)
  );

  if (!item) return;

  item.quantity -= 1;

  if (item.quantity <= 0) {
    carritoState.items = carritoState.items.filter(
      (cartItem) => String(cartItem.id) !== String(productId)
    );
  }

  saveCart();
  renderCart();
  syncProducts();
}

/* ── removeFromCart ────────────────────────────────────────────
   Elimina completamente un producto del carrito sin importar la cantidad.
   ─────────────────────────────────────────────────────────── */
function removeFromCart(productId) {
  carritoState.items = carritoState.items.filter(
    (item) => String(item.id) !== String(productId)
  );

  saveCart();
  renderCart();
  syncProducts();
}

/* ── clearCart ───────────────────────────────────────────────────
   Vacía el carrito por completo. Vinculado al botón #clearCartBtn.
   ─────────────────────────────────────────────────────────── */
function clearCart() {
  carritoState.items = [];
  saveCart();
  renderCart();
  syncProducts();
}

/* ── getCartTotal / getCartCount ───────────────────────────────
   getCartTotal: suma precio × cantidad de todos los ítems
   getCartCount: suma total de unidades (para el badge del header)
   ─────────────────────────────────────────────────────────── */
function getCartTotal() {
  return carritoState.items.reduce(
    (acc, item) => acc + item.precio * item.quantity,
    0
  );
}

function getCartCount() {
  return carritoState.items.reduce(
    (acc, item) => acc + item.quantity,
    0
  );
}

/* ── buildWhatsappCartMessage ──────────────────────────────────
   Construye el mensaje de texto que se pre-carga en el link de WhatsApp.
   Formato:
     Hola, quiero realizar este pedido:
     - Nombre | Código: XXX | Cantidad: N | Precio: $ X.XXX
     Total estimado: $ XX.XXX
   Si el carrito está vacío, usa un texto genérico.
   ─────────────────────────────────────────────────────────── */
function buildWhatsappCartMessage() {
  if (!carritoState.items.length) {
    return "Hola, quiero consultar por productos de ObraFuerte.";
  }

  const lines = [
    "Hola, quiero realizar este pedido:",
    ""
  ];

  carritoState.items.forEach((item) => {
    lines.push(
      `- ${item.nombre} | Código: ${item.codigo} | Cantidad: ${item.quantity} | Precio: ${cartCurrencyFormatter.format(item.precio)}`
    );
  });

  lines.push("");
  lines.push(`Total estimado: ${cartCurrencyFormatter.format(getCartTotal())}`);

  return lines.join("\\n");
}

/* ── renderCart ───────────────────────────────────────────────────
Actualiza toda la UI del drawer:
- #cartCount: número en el badge del header (se oculta si = 0)
- #cartTotal: precio total formateado
- #cartWhatsappLink: URL con el mensaje codificado
- #cartItems: lista de tarjetas de ítems con controles
Luego de reconstruir #cartItems, registra listeners en cada botón
de acción (increase / decrease / remove) mediante iteración directa.
   ─────────────────────────────────────────────────────────── */
function renderCart() {
  const cartItems = document.getElementById("cartItems");
  const cartCount = document.getElementById("cartCount");
  const cartTotal = document.getElementById("cartTotal");
  const cartWhatsappLink = document.getElementById("cartWhatsappLink");

  const count = getCartCount();

  if (cartCount) {
    cartCount.textContent = count;
    cartCount.hidden = count === 0;
  }

  if (cartTotal) {
    cartTotal.textContent = cartCurrencyFormatter.format(getCartTotal());
  }

  if (cartWhatsappLink) {
    const message = encodeURIComponent(buildWhatsappCartMessage());
    cartWhatsappLink.href = `https://wa.me/5493815035162?text=${message}`;
  }

  if (!cartItems) return;

  if (!carritoState.items.length) {
    cartItems.innerHTML = `<p class="cart-empty">Todavía no agregaste productos.</p>`;
    return;
  }

cartItems.innerHTML = carritoState.items.map((item) => `
    <article class="cart-item">
    <div class="cart-item__info">
        <h3>${escapeCartHtml(item.nombre)}</h3>
        <p>Código: ${escapeCartHtml(item.codigo || "-")}</p>
        <strong>${cartCurrencyFormatter.format(item.precio)}</strong>
    </div>

    <div class="cart-item__controls">
        <button type="button" class="cart-qty-btn" data-action="decrease" data-id="${item.id}">−</button>
        <span class="cart-qty">${item.quantity}</span>
        <button type="button" class="cart-qty-btn" data-action="increase" data-id="${item.id}">+</button>
        <button type="button" class="cart-remove-btn" data-action="remove" data-id="${item.id}">Quitar</button>
    </div>
    </article>
`).join("");

cartItems.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", () => {
    const { action, id } = button.dataset;

    if (action === "increase") increaseCartItem(id);
    if (action === "decrease") decreaseCartItem(id);
    if (action === "remove") removeFromCart(id);
    });
});
}

/* ── openCartDrawer / closeCartDrawer ────────────────────────
Abre o cierra el panel lateral del carrito.
- Agrega/quita la clase .is-open en #cartDrawer y #cartOverlay
- Bloquea/restaura el scroll del body mientras el drawer está abierto
   ─────────────────────────────────────────────────────────── */
function openCartDrawer() {
const drawer = document.getElementById("cartDrawer");
const overlay = document.getElementById("cartOverlay");
drawer?.classList.add("is-open");
overlay?.classList.add("is-open");
document.body.style.overflow = "hidden";
}

function closeCartDrawer() {
const drawer = document.getElementById("cartDrawer");
const overlay = document.getElementById("cartOverlay");
drawer?.classList.remove("is-open");
overlay?.classList.remove("is-open");
document.body.style.overflow = "";
}

/* ── bindCartEvents ────────────────────────────────────────────
   Asocia los eventos de apertura/cierre del drawer y vaciado:
   - #cartToggle (header)  → openCartDrawer()
   - #cartClose (drawer)   → closeCartDrawer()
   - #cartOverlay (fondo)  → closeCartDrawer()
   - #clearCartBtn         → clearCart()
   ─────────────────────────────────────────────────────────── */
function bindCartEvents() {
  document.getElementById("clearCartBtn")?.addEventListener("click", clearCart);
  document.getElementById("cartToggle")?.addEventListener("click", openCartDrawer);
  document.getElementById("cartClose")?.addEventListener("click", closeCartDrawer);
  document.getElementById("cartOverlay")?.addEventListener("click", closeCartDrawer);
}

/* ── escapeCartHtml (Anti-XSS) ─────────────────────────────────
   Sanitiza valores de texto antes de inyectarlos en innerHTML.
   Previene XSS al mostrar datos del carrito (nombres de productos).
   ─────────────────────────────────────────────────────────── */
function escapeCartHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/* ── Inicialización ──────────────────────────────────────────────
   Ejecuta al cargar el DOM:
     1. Bindea los eventos del drawer (bindCartEvents)
     2. Renderiza el estado inicial del carrito (hidratado desde localStorage)
   Debe ejecutarse antes que app.js para que carritoState esté disponible.
   ─────────────────────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
  bindCartEvents();
  renderCart();
});