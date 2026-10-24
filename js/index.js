let currentSlide = 0;
const slides = document.getElementsByClassName("banner-slide");

function showSlide(index) {
  if (!slides || slides.length === 0) return;
  if (index >= slides.length) currentSlide = 0;
  if (index < 0) currentSlide = slides.length - 1;
  for (let i = 0; i < slides.length; i++) {
    slides[i].classList.remove("active");
  }
  slides[currentSlide].classList.add("active");
}

function changeSlide(n) {
  showSlide((currentSlide += n));
}

setInterval(() => {
  changeSlide(1);
}, 4000);

function startCountdown() {
  let totalSeconds = 3 * 3600 + 15 * 60;
  let timerInterval = setInterval(() => {
    let hours = Math.floor(totalSeconds / 3600);
    let minutes = Math.floor((totalSeconds % 3600) / 60);
    let seconds = totalSeconds % 60;

    let hEl = document.getElementById("hours");
    let mEl = document.getElementById("minutes");
    let sEl = document.getElementById("seconds");

    if (hEl) hEl.innerText = String(hours).padStart(2, "0");
    if (mEl) mEl.innerText = String(minutes).padStart(2, "0");
    if (sEl) sEl.innerText = String(seconds).padStart(2, "0");

    if (totalSeconds > 0) {
      totalSeconds--;
    } else {
      clearInterval(timerInterval);
    }
  }, 1000);
}

function toggleTheme() {
  document.body.classList.toggle("light-mode");
  localStorage.setItem("theme", document.body.classList.contains("light-mode") ? "light" : "dark");
}

window.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("theme") === "light") {
    document.body.classList.add("light-mode");
  }
  startCountdown();
  renderHomeProducts();
  updateCartBadge();
});

function updateCartBadge() {
  let cart = JSON.parse(localStorage.getItem("cart") || "[]");
  let cartCountEl = document.getElementById("cart-count");
  if (cartCountEl) {
    let totalQty = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    cartCountEl.innerText = totalQty;
  }
}

function renderCard(p) {
  let imgUrl =
    p.image || p.img || "https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=300";
  let name = p.name || p.title;
  let price = Number(p.price || 0).toLocaleString("vi-VN");
  return `
    <div class="product-card">
        <img src="${imgUrl}" alt="${name}">
        <h4>${name}</h4>
        <div class="price">${price} đ</div>
        <button class="btn-main" onclick="addToCart('${p.id}')">Thêm Vào Giỏ</button>
    </div>
  `;
}

function renderSaleCard(p) {
  let imgUrl =
    p.image || p.img || "https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=300";
  let name = p.name || p.title;
  let originalPrice = Number(p.price || 0);
  let salePrice = originalPrice;

  if (originalPrice > 2000000) {
    salePrice = Math.floor((originalPrice * 0.75) / 1000) * 1000; // Giảm 25%
  } else if (originalPrice >= 1000000) {
    salePrice = Math.floor((originalPrice * 0.8) / 1000) * 1000; // Giảm 20%
  }

  return `
    <div class="product-card">
        <img src="${imgUrl}" alt="${name}">
        <h4>${name}</h4>
        <div class="price">
            <span class="old-price">${originalPrice.toLocaleString("vi-VN")} đ</span>
            <span>${salePrice.toLocaleString("vi-VN")} đ</span>
        </div>
        <button class="btn-main" onclick="addToCart('${p.id}', ${salePrice})">Thêm Vào Giỏ</button>
    </div>
  `;
}

function shuffleArray(array) {
  let arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function renderHomeProducts() {
  const containerArea = document.getElementById("dynamic-content-area");
  if (!containerArea) return;

  let products = [];
  let savedProducts = localStorage.getItem("customProducts");
  if (savedProducts) {
    try {
      products = JSON.parse(savedProducts);
    } catch (e) {
      products = [];
    }
  }

  if (!products || products.length === 0) {
    products =
      window.products || window.productsData || window.listProducts || window.productArr || [];
  }

  if (products.length === 0) {
    containerArea.innerHTML =
      '<p style="text-align: center; color: var(--text-muted); padding: 30px;">Chưa có sản phẩm nào!</p>';
    return;
  }

  let usedIds = new Set();

  let eligibleSaleProducts = products.filter((p) => Number(p.price || 0) > 1000000);
  let shuffledSale = shuffleArray(eligibleSaleProducts);
  let saleList = shuffledSale.slice(0, 4);
  saleList.forEach((p) => usedIds.add(p.id));

  let remainingProducts = products.filter((p) => !usedIds.has(p.id));
  let shuffledRemaining = shuffleArray(remainingProducts);

  let hotList = shuffledRemaining.slice(0, 4);
  hotList.forEach((p) => usedIds.add(p.id));

  let featuredList = shuffledRemaining.slice(4, 8);

  containerArea.innerHTML = `
    <div class="section-header">
        <h2>🔥 Sản Phẩm Giảm Giá</h2>
        <a href="infomation.html?type=sale&title=Sản%20Phẩm%20Giảm%20Giá">Xem thêm &raquo;</a>
    </div>
    <div class="product-grid">
        ${saleList.length > 0 ? saleList.map((p) => renderSaleCard(p)).join("") : '<p style="color:var(--text-muted);">Không có sản phẩm trên 1 triệu thỏa mãn điều kiện giảm giá.</p>'}
    </div>

    <div class="section-header">
        <h2>⚡ Sản Phẩm Hot</h2>
        <a href="infomation.html?type=hot&title=Sản%20Phẩm%20Hot">Xem thêm &raquo;</a>
    </div>
    <div class="product-grid">
        ${hotList.map((p) => renderCard(p)).join("")}
    </div>

    <div class="section-header">
        <h2>⭐ Sản Phẩm Nổi Bật</h2>
        <a href="infomation.html?type=featured&title=Sản%20Phẩm%20Nổi%20Bật">Xem thêm &raquo;</a>
    </div>
    <div class="product-grid">
        ${featuredList.map((p) => renderCard(p)).join("")}
    </div>

    <div style="text-align: center; margin-top: 40px;">
        <a href="products.html" class="btn-main" style="display: inline-block; width: auto; padding: 12px 30px; font-size: 16px; text-decoration: none;">Xem Tất Cả Sản Phẩm &raquo;</a>
    </div>
  `;
}
