(() => {
  "use strict";

  const CART_STORAGE_KEY = "shopsphere-cart-v1";
  const $ = (selector) => document.querySelector(selector);
  const productGrid = $("#productGrid");
  const searchInput = $("#searchInput");
  const sortSelect = $("#sortSelect");
  const activeFilter = $("#activeFilter");
  const noResults = $("#noResults");
  const cartDrawer = $("#cartDrawer");
  const overlay = $("#overlay");
  const toast = $("#toast");
  let selectedCategory = "All";
  let searchTerm = "";
  let toastTimer;
  const API_BASE_URL = "http://localhost:8080/api";
  let backendAvailable = false;

  function loadCart() {
    try {
      const parsed = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || "[]");
      if (!Array.isArray(parsed)) return [];
      return parsed.filter((entry) => PRODUCTS.some((product) => product.id === entry.id))
        .map((entry) => ({ id: entry.id, quantity: Math.max(1, Math.min(99, Number(entry.quantity) || 1)) }));
    } catch {
      return [];
    }
  }

  let cart = loadCart();

  function saveCart() {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    renderCart();
  }

  function money(amount) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency", currency: "INR", maximumFractionDigits: 0
    }).format(amount);
  }

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2400);
  }

  function filteredProducts() {
    let result = PRODUCTS.filter((product) => {
      const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
      const text = `${product.name} ${product.category} ${product.description}`.toLowerCase();
      return matchesCategory && text.includes(searchTerm.toLowerCase());
    });

    switch (sortSelect.value) {
      case "low": result.sort((a, b) => a.price - b.price); break;
      case "high": result.sort((a, b) => b.price - a.price); break;
      case "name": result.sort((a, b) => a.name.localeCompare(b.name)); break;
      default: result.sort((a, b) => a.id - b.id);
    }
    return result;
  }

  function renderProducts() {
    const products = filteredProducts();
    productGrid.innerHTML = products.map((product) => `
      <article class="product-card">
        <div class="product-image">
          <img src="${product.image}" alt="${product.name}" loading="lazy" />
          ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ""}
          <button class="quick-add" data-add="${product.id}" type="button">Add to bag +</button>
        </div>
        <div class="product-info">
          <div class="product-meta"><span>${product.category}</span><span>${money(product.price)}</span></div>
          <a class="product-name" href="#shop" data-product="${product.id}">${product.name}</a>
          <p class="product-description">${product.description}</p>
        </div>
      </article>
    `).join("");

    noResults.hidden = products.length !== 0;
    productGrid.hidden = products.length === 0;
    const hasFilter = selectedCategory !== "All" || searchTerm;
    activeFilter.hidden = !hasFilter;
    activeFilter.textContent = hasFilter
      ? `${products.length} ${products.length === 1 ? "find" : "finds"} · ${selectedCategory === "All" ? "All categories" : selectedCategory}${searchTerm ? ` · Search: “${searchTerm}”` : ""}`
      : "";
    document.querySelectorAll(".category-pill").forEach((button) => {
      button.classList.toggle("active", button.dataset.category === selectedCategory);
    });
  }

  function cartProductCount() {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  function cartTotal() {
    return cart.reduce((sum, item) => {
      const product = PRODUCTS.find((candidate) => candidate.id === item.id);
      return sum + (product ? product.price * item.quantity : 0);
    }, 0);
  }

  function renderCart() {
    $("#cartCount").textContent = cartProductCount();
    $("#cartSubtotal").textContent = money(cartTotal());
    $("#checkoutTotal").textContent = money(cartTotal());

    if (!cart.length) {
      $("#cartItems").innerHTML = `<div class="cart-empty"><span>↗</span><strong>Your bag is taking a little break.</strong><p>Find something you love and it will show up here.</p></div>`;
      $("#cartFooter").hidden = true;
      return;
    }

    $("#cartFooter").hidden = false;
    $("#cartItems").innerHTML = cart.map((item) => {
      const product = PRODUCTS.find((candidate) => candidate.id === item.id);
      if (!product) return "";
      return `
        <article class="cart-row">
          <img src="${product.image}" alt="${product.name}" />
          <div><h3>${product.name}</h3><span class="cart-category">${product.category}</span>
            <div class="quantity-controls">
              <button type="button" data-quantity="${product.id}" data-change="-1" aria-label="Decrease ${product.name} quantity">−</button>
              <span>${item.quantity}</span>
              <button type="button" data-quantity="${product.id}" data-change="1" aria-label="Increase ${product.name} quantity">+</button>
            </div>
            <button type="button" class="remove-item" data-remove="${product.id}">Remove</button>
          </div>
          <span class="cart-row-price">${money(product.price * item.quantity)}</span>
        </article>`;
    }).join("");
  }

  function addToCart(id) {
    const product = PRODUCTS.find((item) => item.id === Number(id));
    if (!product) return;
    const existing = cart.find((item) => item.id === product.id);
    if (existing) existing.quantity = Math.min(99, existing.quantity + 1);
    else cart.push({ id: product.id, quantity: 1 });
    saveCart();
    showToast(`${product.name} added to your bag.`);
  }

  function changeQuantity(id, change) {
    const item = cart.find((entry) => entry.id === Number(id));
    if (!item) return;
    item.quantity += Number(change);
    if (item.quantity < 1) cart = cart.filter((entry) => entry.id !== Number(id));
    saveCart();
  }

  function removeFromCart(id) {
    const product = PRODUCTS.find((item) => item.id === Number(id));
    cart = cart.filter((item) => item.id !== Number(id));
    saveCart();
    if (product) showToast(`${product.name} removed from your bag.`);
  }

  function openCart() {
    overlay.hidden = false;
    requestAnimationFrame(() => overlay.classList.add("show"));
    cartDrawer.classList.add("open");
    cartDrawer.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
    $("#closeCart").focus();
  }

  function closeCart() {
    overlay.classList.remove("show");
    cartDrawer.classList.remove("open");
    cartDrawer.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");
    setTimeout(() => { if (!cartDrawer.classList.contains("open")) overlay.hidden = true; }, 260);
  }

  function resetFilters() {
    selectedCategory = "All";
    searchTerm = "";
    searchInput.value = "";
    sortSelect.value = "featured";
    renderProducts();
  }

  $("#searchForm").addEventListener("submit", (event) => {
    event.preventDefault();
    searchTerm = searchInput.value.trim();
    renderProducts();
    $("#shop").scrollIntoView({ behavior: "smooth" });
  });

  searchInput.addEventListener("input", () => {
    searchTerm = searchInput.value.trim();
    renderProducts();
  });

  sortSelect.addEventListener("change", renderProducts);

  document.querySelectorAll(".category-pill").forEach((button) => {
    button.addEventListener("click", () => {
      selectedCategory = button.dataset.category;
      renderProducts();
      $("#shop").scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  productGrid.addEventListener("click", (event) => {
    const addButton = event.target.closest("[data-add]");
    if (addButton) addToCart(addButton.dataset.add);
    const productLink = event.target.closest("[data-product]");
    if (productLink) {
      event.preventDefault();
      const product = PRODUCTS.find((item) => item.id === Number(productLink.dataset.product));
      if (product) showToast(`${product.name} · ${money(product.price)} — use “Add to bag” to add it.`);
    }
  });

  $("#clearFilters").addEventListener("click", resetFilters);
  $("#openCart").addEventListener("click", openCart);
  $("#closeCart").addEventListener("click", closeCart);
  overlay.addEventListener("click", closeCart);

  $("#cartItems").addEventListener("click", (event) => {
    const quantityButton = event.target.closest("[data-quantity]");
    const removeButton = event.target.closest("[data-remove]");
    if (quantityButton) changeQuantity(quantityButton.dataset.quantity, quantityButton.dataset.change);
    if (removeButton) removeFromCart(removeButton.dataset.remove);
  });

  $("#checkoutButton").addEventListener("click", () => {
    if (!cart.length) return;
    closeCart();
    $("#checkoutDialog").showModal();
  });

  $("#closeCheckout").addEventListener("click", () => $("#checkoutDialog").close());
  $("#checkoutDialog").addEventListener("click", (event) => {
    if (event.target === $("#checkoutDialog")) $("#checkoutDialog").close();
  });

  $("#checkoutForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity() || !cart.length) return;
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton ? submitButton.textContent : "Place demo order";
    if (submitButton) { submitButton.disabled = true; submitButton.textContent = "Saving order…"; }
    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: $("#customerName").value.trim(),
          customerEmail: $("#customerEmail").value.trim(),
          deliveryAddress: $("#customerAddress").value.trim(),
          items: cart.map((item) => ({ productId: item.id, quantity: item.quantity }))
        })
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Could not save the order. Check that the backend and database are running.");
      const customerName = $("#customerName").value.trim();
      $("#successName").textContent = customerName.split(/\s+/)[0] || "friend";
      $("#orderNumber").textContent = result.orderId || "Saved";
      $("#checkoutDialog").close();
      cart = [];
      saveCart();
      form.reset();
      $("#successDialog").showModal();
    } catch (error) {
      showToast(error.message || "Unable to connect to the backend.");
    } finally {
      if (submitButton) { submitButton.disabled = false; submitButton.textContent = originalText; }
    }
  });

  $("#finishOrder").addEventListener("click", () => $("#successDialog").close());
  $("#successDialog").addEventListener("click", (event) => {
    if (event.target === $("#successDialog")) $("#successDialog").close();
  });

  $("#newsletterForm").addEventListener("submit", (event) => {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    $("#newsletterMessage").textContent = "Thanks! This demo form is working locally.";
    event.currentTarget.reset();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeCart();
  });

  async function loadProductsFromBackend() {
    try {
      const response = await fetch(`${API_BASE_URL}/products`);
      if (!response.ok) throw new Error("Products API returned an error");
      const products = await response.json();
      if (Array.isArray(products) && products.length) {
        PRODUCTS = products;
        backendAvailable = true;
        cart = loadCart();
        renderProducts();
        renderCart();
        showToast("Connected to ShopSphere backend.");
      }
    } catch (error) {
      backendAvailable = false;
      console.info("ShopSphere backend is not running; showing demo products.");
      showToast("Demo mode: start the Java backend for database checkout.");
    }
  }

  renderProducts();
  renderCart();
  loadProductsFromBackend();
})();
