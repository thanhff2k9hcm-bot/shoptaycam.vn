function shuffleArray(array) {
  let arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function renderInfoProductCard(p, isSale = false) {
  let imgUrl =
    p.image || p.img || "https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=300";
  let name = p.name || p.title;
  let originalPrice = Number(p.price || 0);

  if (isSale && originalPrice > 1000000) {
    let salePrice = originalPrice;
    if (originalPrice > 2000000) {
      salePrice = Math.floor((originalPrice * 0.75) / 1000) * 1000;
    } else {
      salePrice = Math.floor((originalPrice * 0.8) / 1000) * 1000;
    }

    return `
      <div class="product-card">
          <img src="${imgUrl}" alt="${name}">
          <h4>${name}</h4>
          <div class="price">
              <span class="old-price" style="text-decoration: line-through; color: var(--text-muted); font-size: 13px; margin-right: 8px;">${originalPrice.toLocaleString("vi-VN")} đ</span>
              <span style="color: var(--danger); font-weight: bold;">${salePrice.toLocaleString("vi-VN")} đ</span>
          </div>
          <button class="btn-main" onclick="addToCart('${p.id}', ${salePrice})">Thêm Vào Giỏ</button>
      </div>
    `;
  }

  return `
    <div class="product-card">
        <img src="${imgUrl}" alt="${name}">
        <h4>${name}</h4>
        <div class="price" style="color: var(--danger); font-weight: bold;">${originalPrice.toLocaleString("vi-VN")} đ</div>
        <button class="btn-main" onclick="addToCart('${p.id}', ${originalPrice})">Thêm Vào Giỏ</button>
    </div>
  `;
}

document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const type = urlParams.get("type") || "all";
  const title = urlParams.get("title") || "Danh Sách Sản Phẩm";

  let headingEl = document.getElementById("page-heading");
  let breadcrumbEl = document.getElementById("breadcrumb-title");
  if (headingEl) headingEl.innerText = title;
  if (breadcrumbEl) breadcrumbEl.innerText = title;

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

  const container = document.getElementById("infomation-product-grid");
  if (!container) return;

  if (products.length === 0) {
    container.innerHTML =
      '<p style="text-align: center; color: #888; width: 100%; padding: 30px;">Không có sản phẩm nào!</p>';
    return;
  }

  let targetList = products;
  let isSaleType = type === "sale";

  if (isSaleType) {
    targetList = products.filter((p) => Number(p.price || 0) > 1000000);
  }

  let randomizedList = shuffleArray(targetList).slice(0, 8);

  if (randomizedList.length === 0) {
    container.innerHTML =
      '<p style="text-align: center; color: var(--text-muted); width: 100%; padding: 30px;">Không có sản phẩm nào thỏa mãn điều kiện giảm giá.</p>';
    return;
  }

  container.innerHTML = randomizedList.map((p) => renderInfoProductCard(p, isSaleType)).join("");
});
