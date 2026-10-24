function getCartKey() {
  let currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (currentUser && (currentUser.username || currentUser.name)) {
    return "cart_" + (currentUser.username || currentUser.name);
  }
  return "cart_guest";
}

function renderCart() {
  let cartKey = getCartKey();
  let cart = JSON.parse(localStorage.getItem(cartKey)) || [];
  let wrapper = document.getElementById("cart-content-wrapper");
  let cartBox = document.querySelector(".cart-box");
  if (!cartBox || !wrapper) return;

  if (cart.length === 0) {
    cartBox.innerHTML = `
      <div class="cart-empty-container">
        <p class="cart-empty-text">Giỏ hàng của bạn đang trống!</p>
        <a href="products.html" class="btn-checkout btn-buy-now">Mua Ngay</a>
      </div>
    `;
    updateCartBadge();
    return;
  }

  let body = document.getElementById("cart-body");
  if (!body) return;

  let html = "";
  let grandTotal = 0;
  for (let i = 0; i < cart.length; i++) {
    let itemPrice = Number(cart[i].price || 0);
    let itemQty = Number(cart[i].quantity || 1);
    let total = itemPrice * itemQty;
    grandTotal += total;

    let imgSrc = cart[i].image || cart[i].img || "https://via.placeholder.com/150";

    html += `
      <tr>
        <td><img src="${imgSrc}" alt="${cart[i].name || "Product"}" class="cart-table-img"></td>
        <td>${cart[i].name || "Sản phẩm"}</td>
        <td>${itemPrice.toLocaleString("vi-VN")} đ</td>
        <td>
          <button onclick="updateQuantity(${i}, -1)" class="qty-btn">-</button>
          <span class="qty-value">${itemQty}</span>
          <button onclick="updateQuantity(${i}, 1)" class="qty-btn">+</button>
        </td>
        <td>${total.toLocaleString("vi-VN")} đ</td>
        <td><button onclick="removeCartItem(${i})" class="btn-delete-item">Xóa</button></td>
      </tr>
    `;
  }
  html += `<tr><td colspan="4"><strong>Tổng tiền:</strong></td><td colspan="2"><strong class="grand-total-price">${grandTotal.toLocaleString("vi-VN")} đ</strong></td></tr>`;
  body.innerHTML = html;

  generatePreviewQR(cart);
  updateCartBadge();
  initPhoneInputRestriction();
}

function updateQuantity(index, change) {
  let cartKey = getCartKey();
  let cart = JSON.parse(localStorage.getItem(cartKey)) || [];
  if (cart[index]) {
    cart[index].quantity = (cart[index].quantity || 1) + change;
    if (cart[index].quantity <= 0) {
      cart.splice(index, 1);
    }
    localStorage.setItem(cartKey, JSON.stringify(cart));
    renderCart();
  }
}

function removeCartItem(index) {
  let cartKey = getCartKey();
  let cart = JSON.parse(localStorage.getItem(cartKey)) || [];
  cart.splice(index, 1);
  localStorage.setItem(cartKey, JSON.stringify(cart));
  renderCart();
}

function togglePaymentMethod() {
  let selectedMethod = document.querySelector('input[name="payment-method"]:checked');
  let method = selectedMethod ? selectedMethod.value : "cod";
  let qrSection = document.getElementById("qr-section");
  if (qrSection) {
    qrSection.style.display = method === "online" ? "block" : "none";
  }
}

function generatePreviewQR(cart) {
  let grandTotal = 0;
  for (let i = 0; i < cart.length; i++) {
    grandTotal += Number(cart[i].price || 0) * Number(cart[i].quantity || 1);
  }
  let orderId = "DH" + Math.floor(100 + Math.random() * 900);

  let idEl = document.getElementById("qr-order-id");
  let amtEl = document.getElementById("qr-amount");
  let contentEl = document.getElementById("qr-content");
  let qrImg = document.getElementById("qr-image");

  if (idEl) idEl.innerText = orderId;
  if (amtEl) amtEl.innerText = grandTotal.toLocaleString("vi-VN") + " đ";
  if (contentEl) contentEl.innerText = orderId;

  if (qrImg) {
    qrImg.src = `https://img.vietqr.io/image/VPB-0949895775-compact2.png?amount=${grandTotal}&addInfo=${orderId}&accountName=NGUYEN+NGOC+BAO+THANH`;
  }
}

function initPhoneInputRestriction() {
  let phoneInput = document.getElementById("checkout-phone");
  if (phoneInput && !phoneInput.hasAttribute("data-restricted")) {
    phoneInput.setAttribute("data-restricted", "true");
    phoneInput.addEventListener("input", function () {
      this.value = this.value.replace(/[^0-9]/g, "");
    });
  }
}

function checkout() {
  let cartKey = getCartKey();
  let cart = JSON.parse(localStorage.getItem(cartKey)) || [];
  if (cart.length === 0) {
    showCustomAlert("Giỏ hàng đang trống!", false);
    return;
  }

  let phoneInput = document.getElementById("checkout-phone");
  let addressInput = document.getElementById("checkout-address");

  let phone = phoneInput ? phoneInput.value.trim() : "";
  let address = addressInput ? addressInput.value.trim() : "";

  if (!phone || phone.length !== 10) {
    showCustomAlert("Vui lòng nhập số điện thoại hợp lệ (đúng 10 chữ số)!", false);
    return;
  }
  if (!address) {
    showCustomAlert("Vui lòng nhập địa chỉ nhận hàng!", false);
    return;
  }

  let grandTotal = 0;
  for (let i = 0; i < cart.length; i++) {
    grandTotal += Number(cart[i].price || 0) * Number(cart[i].quantity || 1);
  }

  let orderId = "DH" + Math.floor(100 + Math.random() * 900);
  let currentUser = JSON.parse(localStorage.getItem("currentUser"));
  let newOrder = {
    id: orderId,
    customer: currentUser ? currentUser.username || currentUser.name : "Khách vãng lai",
    phone: phone,
    address: address,
    total: grandTotal,
    status: "Đang chờ xử lý",
    payment:
      document.querySelector('input[name="payment-method"]:checked')?.value === "online"
        ? "Chuyển khoản QR"
        : "Tiền mặt (COD)",
  };

  let orders = JSON.parse(localStorage.getItem("orders")) || [];
  orders.push(newOrder);
  localStorage.setItem("orders", JSON.stringify(orders));

  localStorage.removeItem(cartKey);

  showCustomAlert(
    `Đã đặt hàng thành công!<br><span style="font-size: 14px; color: var(--text-muted); font-weight: normal;">Mã đơn: ${orderId}<br>Cảm ơn bạn đã ủng hộ shop!</span>`,
    true,
    function () {
      window.location.href = "index.html";
    },
  );
}

function showCustomAlert(message, isSuccess = true, callback = null) {
  let oldAlert = document.getElementById("custom-alert-modal");
  if (oldAlert) oldAlert.remove();

  let iconHtml = isSuccess
    ? `<div style="font-size: 42px; color: #2ea44f; margin-bottom: 12px;">✅</div>`
    : `<div style="font-size: 42px; color: #da3633; margin-bottom: 12px; font-weight: bold;">❌</div>`;

  let alertBox = document.createElement("div");
  alertBox.id = "custom-alert-modal";
  alertBox.innerHTML = `
    <div style="background: var(--card-bg, #161b22); color: var(--text-main, #f0f6fc); padding: 30px; border-radius: 12px; border: 1px solid var(--border-color, #30363d); box-shadow: 0 10px 30px rgba(0,0,0,0.6); text-align: center; max-width: 380px; width: 90%;">
      ${iconHtml}
      <div style="font-size: 16px; font-weight: bold; margin-bottom: 15px; line-height: 1.5;">${message}</div>
      <button id="alert-ok-btn" style="background: ${isSuccess ? "var(--primary, #238636)" : "var(--danger, #da3633)"}; color: white; border: none; padding: 10px 25px; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 14px;">OK</button>
    </div>
  `;

  alertBox.style.position = "fixed";
  alertBox.style.top = "0";
  alertBox.style.left = "0";
  alertBox.style.width = "100%";
  alertBox.style.height = "100%";
  alertBox.style.background = "rgba(0, 0, 0, 0.6)";
  alertBox.style.display = "flex";
  alertBox.style.justifyContent = "center";
  alertBox.style.alignItems = "center";
  alertBox.style.zIndex = "99999";

  document.body.appendChild(alertBox);

  document.getElementById("alert-ok-btn").onclick = function () {
    alertBox.remove();
    if (callback) callback();
  };
}

window.addEventListener("DOMContentLoaded", () => {
  renderCart();
  initPhoneInputRestriction();
});
