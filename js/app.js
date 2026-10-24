let currentPage = 1;
const itemsPerPage = 8;
let currentFilteredList = [];

function getCartKey() {
  let currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (currentUser && (currentUser.username || currentUser.name)) {
    return "cart_" + (currentUser.username || currentUser.name);
  }
  return "cart_guest";
}

function updateCartBadge() {
  let cart = JSON.parse(localStorage.getItem(getCartKey())) || [];
  let total = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  let badgeEl = document.getElementById("cart-count");
  if (badgeEl) {
    badgeEl.innerText = total;
  }
}

function updateHeaderAuth() {
  let currentUser = JSON.parse(localStorage.getItem("currentUser"));

  let userDisplays = document.querySelectorAll("#user-display");
  let adminNavs = document.querySelectorAll("#nav-admin");

  if (currentUser) {
    let displayName = currentUser.username || currentUser.name || "Tài khoản";

    userDisplays.forEach((el) => {
      el.innerText = displayName;
      el.href = "profile.html";
    });

    adminNavs.forEach((el) => {
      if (currentUser.role === "admin") {
        el.style.display = "inline-block";
        el.href = "admincontroller.html";
      } else {
        el.style.display = "none";
      }
    });
  } else {
    userDisplays.forEach((el) => {
      el.innerText = "Đăng Nhập";
      el.href = "login.html";
    });
    adminNavs.forEach((el) => {
      el.style.display = "none";
    });
  }
}

function addToCart(productId, salePrice) {
  let allProducts = [];
  let savedProducts = localStorage.getItem("customProducts");
  if (savedProducts) {
    try {
      allProducts = JSON.parse(savedProducts);
    } catch (e) {
      allProducts = [];
    }
  }
  if (!allProducts || allProducts.length === 0) {
    allProducts =
      window.products || window.productsData || window.listProducts || window.productArr || [];
  }

  let product = allProducts.find((p) => p.id == productId);
  if (!product) {
    showToast("Không tìm thấy sản phẩm!");
    return;
  }

  let finalPrice = salePrice !== undefined ? salePrice : Number(product.price || 0);

  let cartKey = getCartKey();
  let cart = JSON.parse(localStorage.getItem(cartKey)) || [];
  let existingIndex = cart.findIndex((item) => item.id == productId && item.price === finalPrice);

  if (existingIndex > -1) {
    cart[existingIndex].quantity = (cart[existingIndex].quantity || 1) + 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name || product.title,
      price: finalPrice,
      image: product.image || product.img || "",
      quantity: 1,
    });
  }

  localStorage.setItem(cartKey, JSON.stringify(cart));
  updateCartBadge();
  showToast("Đã thêm vào giỏ hàng thành công!");
}

function calculateSalePrice(originalPrice) {
  let price = Number(originalPrice || 0);
  if (price <= 1000000) return price;

  let salePrice = price;
  if (price > 2000000) {
    salePrice = Math.floor((price * 0.75) / 1000) * 1000;
  } else {
    salePrice = Math.floor((price * 0.8) / 1000) * 1000;
  }
  return salePrice;
}

function renderProducts(filteredList, page = 1) {
  let productList = document.getElementById("product-grid");
  if (!productList) return;

  if (filteredList) {
    currentFilteredList = filteredList;
  }

  currentPage = page;
  let allProducts = currentFilteredList;

  if (!allProducts || allProducts.length === 0) {
    productList.innerHTML =
      "<p style='text-align:center; width:100%; color:#888; grid-column: 1 / -1; padding: 30px;'>Không tìm thấy sản phẩm phù hợp!</p>";
    let paginationEl = document.getElementById("pagination-container");
    if (paginationEl) paginationEl.innerHTML = "";
    return;
  }

  let start = (currentPage - 1) * itemsPerPage;
  let end = start + itemsPerPage;
  let paginatedItems = allProducts.slice(start, end);

  productList.innerHTML = paginatedItems
    .map((p) => {
      let originalPrice = Number(p.price || 0);
      let salePrice = calculateSalePrice(originalPrice);

      let priceHtml = "";
      if (originalPrice > 1000000) {
        priceHtml = `
          <div class="price">
            <span class="old-price" style="text-decoration: line-through; color: var(--text-muted); font-size: 13px; margin-right: 8px;">${originalPrice.toLocaleString("vi-VN")} đ</span>
            <span style="color: var(--danger); font-weight: bold;">${salePrice.toLocaleString("vi-VN")} đ</span>
          </div>
        `;
      } else {
        priceHtml = `<div class="price" style="color: var(--danger); font-weight: bold;">${originalPrice.toLocaleString("vi-VN")} đ</div>`;
      }

      let finalPriceToAddToCart = originalPrice > 1000000 ? salePrice : originalPrice;

      return `
        <div class="product-card">
          <img src="${p.image || p.img || "https://via.placeholder.com/150"}" alt="${p.name || p.title}">
          <h4>${p.name || p.title}</h4>
          ${priceHtml}
          <button class="btn-main" onclick="addToCart('${p.id}', ${finalPriceToAddToCart})">Thêm Vào Giỏ</button>
        </div>
      `;
    })
    .join("");

  renderPagination(allProducts.length);
}

function renderPagination(totalItems) {
  let paginationContainer = document.getElementById("pagination-container");
  if (!paginationContainer) return;

  let totalPages = Math.ceil(totalItems / itemsPerPage);
  if (totalPages <= 1) {
    paginationContainer.innerHTML = "";
    return;
  }

  let html = "";
  for (let i = 1; i <= totalPages; i++) {
    html += `<button class="${i === currentPage ? "active" : ""}" onclick="changePage(${i})">${i}</button>`;
  }
  paginationContainer.innerHTML = html;
}

function changePage(page) {
  renderProducts(null, page);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function initProductFilter() {
  let allProducts = [];
  let savedProducts = localStorage.getItem("customProducts");
  if (savedProducts) {
    try {
      allProducts = JSON.parse(savedProducts);
    } catch (e) {
      allProducts = [];
    }
  }
  if (!allProducts || allProducts.length === 0) {
    allProducts =
      window.products || window.productsData || window.listProducts || window.productArr || [];
    if (allProducts.length > 0) {
      localStorage.setItem("customProducts", JSON.stringify(allProducts));
    }
  }

  const urlParams = new URLSearchParams(window.location.search);
  let searchKeyword = urlParams.get("search");
  if (searchKeyword) {
    let keywordInput = document.getElementById("filter-keyword");
    if (keywordInput) {
      keywordInput.value = searchKeyword;
      applyFilters();
      return;
    }
  }

  renderProducts(allProducts, 1);
}

function applyFilters() {
  let catEl = document.getElementById("filter-category");
  let platEl = document.getElementById("filter-platform");
  let priceEl = document.getElementById("filter-price");
  let keywordEl = document.getElementById("filter-keyword");

  let category = catEl ? catEl.value : "all";
  let platform = platEl ? platEl.value : "all";
  let priceRange = priceEl ? priceEl.value : "all";
  let keyword = keywordEl ? keywordEl.value.toLowerCase().trim() : "";

  let allProducts = [];
  let savedProducts = localStorage.getItem("customProducts");
  if (savedProducts) {
    try {
      allProducts = JSON.parse(savedProducts);
    } catch (e) {
      allProducts = [];
    }
  }
  if (!allProducts || allProducts.length === 0) {
    allProducts =
      window.products || window.productsData || window.listProducts || window.productArr || [];
  }

  let filtered = allProducts.filter((p) => {
    let name = (p.name || p.title || "").toLowerCase();
    let pCat = p.category || "khong-day";
    let pPlat = p.platform || "pc";
    let pPrice = Number(p.price || 0);

    if (keyword && !name.includes(keyword)) return false;
    if (category !== "all" && pCat !== category) return false;
    if (platform !== "all" && pPlat !== platform) return false;

    if (priceRange === "under-500k" && pPrice >= 500000) return false;
    if (priceRange === "500k-1500k" && (pPrice < 500000 || pPrice > 1500000)) return false;
    if (priceRange === "over-1500k" && pPrice <= 1500000) return false;

    return true;
  });

  renderProducts(filtered, 1);
}

function showToast(message) {
  let oldToast = document.getElementById("custom-toast-modal");
  if (oldToast) oldToast.remove();

  let toast = document.createElement("div");
  toast.id = "custom-toast-modal";
  toast.innerHTML = `
    <div style="background: var(--card-bg, #161b22); color: var(--text-main, #f0f6fc); padding: 35px 40px; border-radius: 14px; border: 1px solid var(--border-color, #30363d); box-shadow: 0 12px 35px rgba(0,0,0,0.7); text-align: center; max-width: 420px; width: 90%;">
      <div style="font-size: 48px; color: #2ea44f; margin-bottom: 15px;">✔</div>
      <div style="font-size: 18px; font-weight: bold; margin-bottom: 22px; line-height: 1.4;">${message}</div>
      <button onclick="document.getElementById('custom-toast-modal').remove()" style="background: var(--primary, #238636); color: white; border: none; padding: 12px 30px; border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 15px;">OK</button>
    </div>
  `;

  toast.style.position = "fixed";
  toast.style.top = "0";
  toast.style.left = "0";
  toast.style.width = "100%";
  toast.style.height = "100%";
  toast.style.background = "rgba(0, 0, 0, 0.65)";
  toast.style.display = "flex";
  toast.style.justifyContent = "center";
  toast.style.alignItems = "center";
  toast.style.zIndex = "99999";

  document.body.appendChild(toast);
}

function toggleTheme() {
  document.body.classList.toggle("light-mode");
  let isLight = document.body.classList.contains("light-mode");
  localStorage.setItem("theme", isLight ? "light" : "dark");
}

function loadTheme() {
  let savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") {
    document.body.classList.add("light-mode");
  } else {
    document.body.classList.remove("light-mode");
  }
}

window.addEventListener("DOMContentLoaded", () => {
  loadTheme();
  updateCartBadge();
  updateHeaderAuth();
  if (typeof initProductFilter === "function" && document.getElementById("product-grid")) {
    initProductFilter();
  }
});
