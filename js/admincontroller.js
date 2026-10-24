document.addEventListener("DOMContentLoaded", () => {
  loadAdminProducts();
  loadAdminOrders();
  updateDashboardStats();
});

function loadAdminProducts(list = null) {
  let tbody = document.getElementById("admin-products-body");
  if (!tbody) return;

  let products = list;
  if (!products) {
    let saved = localStorage.getItem("customProducts");
    if (saved) {
      try {
        products = JSON.parse(saved);
      } catch (e) {
        products = [];
      }
    }
    if (!products || products.length === 0) {
      products = window.productsData || [];
    }
  }

  updateDashboardStats(products);

  if (products.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color: var(--text-muted);">Không có sản phẩm nào!</td></tr>`;
    return;
  }

  tbody.innerHTML = products
    .map((p) => {
      let originalPrice = Number(p.price || 0);
      let isOutStock = p.status === "het-hang";
      let statusText = isOutStock ? "Hết hàng" : "Còn hàng";
      let statusBg = isOutStock ? "rgba(218, 54, 51, 0.2)" : "rgba(35, 134, 54, 0.2)";
      let statusColor = isOutStock ? "var(--danger)" : "var(--primary)";

      return `
      <tr>
        <td><img src="${p.image || p.img || "https://via.placeholder.com/150"}" class="thumb" alt="img"></td>
        <td>${p.name || p.title}</td>
        <td style="color: var(--danger); font-weight: bold;">${originalPrice.toLocaleString("vi-VN")} đ</td>
        <td>${p.category || "khong-day"}</td>
        <td><span style="padding: 4px 8px; border-radius: 4px; font-size: 12px; background: ${statusBg}; color: ${statusColor}; font-weight: bold;">${statusText}</span></td>
        <td>
          <button class="btn-edit" onclick="editProduct('${p.id}')">Sửa</button>
          <button class="btn-action" onclick="deleteProduct('${p.id}')">Xóa</button>
        </td>
      </tr>
    `;
    })
    .join("");
}

function updateDashboardStats(productList = null) {
  let products = productList;
  if (!products) {
    let saved = localStorage.getItem("customProducts");
    if (saved) {
      try {
        products = JSON.parse(saved);
      } catch (e) {}
    }
    if (!products || products.length === 0) {
      products = window.productsData || [];
    }
  }

  let total = products.length;
  let outStock = products.filter((p) => p.status === "het-hang").length;
  let inStock = total - outStock;

  let totalEl = document.getElementById("stat-total-products");
  let inEl = document.getElementById("stat-in-stock");
  let outEl = document.getElementById("stat-out-stock");

  if (totalEl) totalEl.innerText = total;
  if (inEl) inEl.innerText = inStock;
  if (outEl) outEl.innerText = outStock;
}

function filterAdminProducts() {
  let cat = document.getElementById("admin-filter-category").value;
  let keyword = document.getElementById("admin-search-product").value.toLowerCase().trim();

  let products = [];
  let saved = localStorage.getItem("customProducts");
  if (saved) {
    try {
      products = JSON.parse(saved);
    } catch (e) {}
  }
  if (!products.length) products = window.productsData || [];

  let filtered = products.filter((p) => {
    let name = (p.name || p.title || "").toLowerCase();
    let pCat = p.category || "khong-day";
    if (cat !== "all" && pCat !== cat) return false;
    if (keyword && !name.includes(keyword)) return false;
    return true;
  });

  loadAdminProducts(filtered);
}

function resetProductForm() {
  document.getElementById("form-title").innerText = "Thêm Sản Phẩm Mới";
  document.getElementById("edit-product-id").value = "";
  document.getElementById("prod-name").value = "";
  document.getElementById("prod-price").value = "";
  document.getElementById("prod-image").value = "";
  document.getElementById("prod-category").value = "khong-day";
  document.getElementById("prod-status").value = "con-hang";
}

function editProduct(id) {
  let products = JSON.parse(localStorage.getItem("customProducts")) || window.productsData || [];
  let p = products.find((item) => item.id == id);
  if (!p) return;

  document.getElementById("form-title").innerText = "Chỉnh Sửa Sản Phẩm (ID: " + p.id + ")";
  document.getElementById("edit-product-id").value = p.id;
  document.getElementById("prod-name").value = p.name || p.title || "";
  document.getElementById("prod-price").value = Number(p.price || 0);
  document.getElementById("prod-image").value = p.image || p.img || "";
  document.getElementById("prod-category").value = p.category || "khong-day";
  document.getElementById("prod-status").value = p.status || "con-hang";

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function saveProduct() {
  let id = document.getElementById("edit-product-id").value;
  let name = document.getElementById("prod-name").value.trim();
  let price = Number(document.getElementById("prod-price").value);
  let image = document.getElementById("prod-image").value.trim();
  let category = document.getElementById("prod-category").value;
  let status = document.getElementById("prod-status").value;

  if (!name || !price) {
    alert("Vui lòng nhập tên và giá sản phẩm!");
    return;
  }

  let products = JSON.parse(localStorage.getItem("customProducts")) || window.productsData || [];

  if (id) {
    let index = products.findIndex((item) => item.id == id);
    if (index > -1) {
      products[index].name = name;
      products[index].title = name;
      products[index].price = price;
      if (image) {
        products[index].image = image;
        products[index].img = image;
      }
      products[index].category = category;
      products[index].status = status;
    }
  } else {
    let newId = "SP" + Date.now();
    let newProd = {
      id: newId,
      name: name,
      title: name,
      price: price,
      image: image || "https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=300",
      img: image || "https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=300",
      category: category,
      status: status,
      platform: "pc",
    };
    products.unshift(newProd);
  }

  localStorage.setItem("customProducts", JSON.stringify(products));
  resetProductForm();
  loadAdminProducts();
  alert("Lưu sản phẩm thành công!");
}

function deleteProduct(id) {
  if (!confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) return;
  let products = JSON.parse(localStorage.getItem("customProducts")) || window.productsData || [];
  products = products.filter((item) => item.id != id);
  localStorage.setItem("customProducts", JSON.stringify(products));
  loadAdminProducts();
}

function loadAdminOrders(list = null) {
  let tbody = document.getElementById("admin-orders-body");
  if (!tbody) return;

  let orders = list;
  if (!orders) {
    orders = JSON.parse(localStorage.getItem("orders")) || [];
  }

  if (orders.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color: var(--text-muted);">Chưa có đơn hàng nào!</td></tr>`;
    return;
  }

  tbody.innerHTML = orders
    .map((o, index) => {
      let isCompleted = o.status === "Đã hoàn thành";

      let actionButtonHtml = isCompleted
        ? `<span style="color: var(--text-muted); font-style: italic; font-size: 13px;">Đã khóa (Hoàn thành)</span>`
        : `<button class="btn-edit" onclick="toggleOrderStatus(${index})" style="background: var(--accent);">Đổi Trạng Thái</button>`;

      return `
        <tr>
          <td><strong>${o.id}</strong></td>
          <td>${o.customer || "Khách lẻ"}</td>
          <td>${o.phone || ""}</td>
          <td>${o.address || ""}</td>
          <td style="color: var(--danger); font-weight: bold;">${Number(o.total || 0).toLocaleString("vi-VN")} đ</td>
          <td><span style="padding: 4px 8px; border-radius: 4px; font-size: 12px; background: ${isCompleted ? "rgba(35, 134, 54, 0.2)" : "rgba(210, 153, 34, 0.2)"}; color: ${isCompleted ? "var(--primary)" : "var(--warning)"}; font-weight: bold;">${o.status || "Đang chờ xử lý"}</span></td>
          <td>${actionButtonHtml}</td>
        </tr>
      `;
    })
    .join("");
}

function filterAdminOrders() {
  let keyword = document.getElementById("admin-search-order").value.toLowerCase().trim();
  let orders = JSON.parse(localStorage.getItem("orders")) || [];

  if (!keyword) {
    loadAdminOrders(orders);
    return;
  }

  let filtered = orders.filter((o) => {
    let orderId = (o.id || "").toLowerCase();
    let phone = (o.phone || "").toLowerCase();
    return orderId.includes(keyword) || phone.includes(keyword);
  });

  loadAdminOrders(filtered);
}

function toggleOrderStatus(index) {
  let orders = JSON.parse(localStorage.getItem("orders")) || [];
  if (orders[index]) {
    if (orders[index].status === "Đã hoàn thành") {
      alert("Đơn hàng này đã hoàn thành và không thể thay đổi trạng thái nữa!");
      return;
    }

    if (
      confirm(
        "Bạn có chắc chắn muốn chuyển đơn hàng này sang trạng thái 'Đã hoàn thành'? Thao tác này không thể hoàn tác.",
      )
    ) {
      orders[index].status = "Đã hoàn thành";
      localStorage.setItem("orders", JSON.stringify(orders));
      loadAdminOrders();
    }
  }
}
