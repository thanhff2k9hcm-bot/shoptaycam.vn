function loadProfile() {
  let currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) {
    showCustomAlert("Vui lòng đăng nhập để xem thông tin cá nhân!", false, function () {
      window.location.href = "login.html";
    });
    return;
  }

  let usernameEl = document.getElementById("info-username");
  let phoneEl = document.getElementById("info-phone");
  let addressEl = document.getElementById("info-address");

  let inputPhone = document.getElementById("update-phone");
  let inputAddress = document.getElementById("update-address");
  let addressGroup = document.getElementById("address-group");
  let formGroupAddress = document.getElementById("form-group-address");
  let ordersNavTab = document.getElementById("nav-orders-tab");

  if (usernameEl) usernameEl.innerText = currentUser.username || currentUser.name || "Tài khoản";
  if (phoneEl) phoneEl.innerText = currentUser.phone || "Chưa cập nhật";
  if (inputPhone) inputPhone.value = currentUser.phone || "";

  if (addressEl) addressEl.innerText = currentUser.address || "Chưa cập nhật";
  if (inputAddress) inputAddress.value = currentUser.address || "";

  if (addressGroup) addressGroup.style.display = "block";
  if (formGroupAddress) formGroupAddress.style.display = "block";
  if (ordersNavTab) ordersNavTab.style.display = "block";
}

function updateProfileInfo(event) {
  event.preventDefault();
  let currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) return;

  let newPhone = document.getElementById("update-phone").value.trim();
  let newAddress = document.getElementById("update-address")
    ? document.getElementById("update-address").value.trim()
    : "";

  if (!newPhone || newPhone.length !== 10) {
    showCustomAlert("Vui lòng nhập số điện thoại hợp lệ (10 chữ số)!", false);
    return;
  }

  currentUser.phone = newPhone;
  currentUser.address = newAddress;
  localStorage.setItem("currentUser", JSON.stringify(currentUser));

  let users = JSON.parse(localStorage.getItem("users")) || [];
  let index = users.findIndex((u) => u.username === currentUser.username);
  if (index !== -1) {
    users[index].phone = newPhone;
    users[index].address = newAddress;
    localStorage.setItem("users", JSON.stringify(users));
  }

  showCustomAlert("Cập nhật thông tin thành công!", true);
  loadProfile();
}

function updatePassword(event) {
  event.preventDefault();
  let currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) return;

  let oldPass = document.getElementById("old-password").value;
  let newPass = document.getElementById("new-password").value;
  let confirmPass = document.getElementById("confirm-password").value;

  if (currentUser.role === "admin") {
    if (currentUser.password && oldPass !== currentUser.password) {
      showCustomAlert("Mật khẩu hiện tại không chính xác!", false);
      return;
    }
    if (!currentUser.password && oldPass !== "123") {
      showCustomAlert("Mật khẩu hiện tại không chính xác!", false);
      return;
    }
  } else {
    if (oldPass !== currentUser.password) {
      showCustomAlert("Mật khẩu hiện tại không đúng!", false);
      return;
    }
  }

  if (newPass.length < 6) {
    showCustomAlert("Mật khẩu mới phải từ 6 ký tự trở lên!", false);
    return;
  }
  if (newPass !== confirmPass) {
    showCustomAlert("Mật khẩu mới và nhập lại không trùng khớp!", false);
    return;
  }

  currentUser.password = newPass;
  localStorage.setItem("currentUser", JSON.stringify(currentUser));

  let users = JSON.parse(localStorage.getItem("users")) || [];
  let index = users.findIndex((u) => u.username === currentUser.username);
  if (index !== -1) {
    users[index].password = newPass;
    localStorage.setItem("users", JSON.stringify(users));
  }

  showCustomAlert("Đổi mật khẩu thành công!", true);
  document.getElementById("old-password").value = "";
  document.getElementById("new-password").value = "";
  document.getElementById("confirm-password").value = "";
}

function loadUserOrders() {
  let container = document.getElementById("order-list-container");
  if (!container) return;

  let currentUser = JSON.parse(localStorage.getItem("currentUser"));
  let orders = JSON.parse(localStorage.getItem("orders")) || [];
  let myOrders = orders.filter((o) => o.customer === (currentUser?.username || currentUser?.name));

  if (myOrders.length === 0) {
    container.innerHTML =
      "<p style='color: var(--text-muted); text-align: center; padding: 20px;'>Bạn chưa có đơn hàng nào!</p>";
    return;
  }

  container.innerHTML = myOrders
    .map(
      (order) => `
    <div class="order-card">
      <div class="order-header">
        <span>Mã Đơn: ${order.id}</span>
        <span class="badge badge-pending">${order.status || "Đang xử lý"}</span>
      </div>
      <div><strong>Thanh toán:</strong> ${order.payment || "COD"}</div>
      <div><strong>Tổng tiền:</strong> <span style="color: var(--danger); font-weight: bold;">${Number(order.total || 0).toLocaleString("vi-VN")} đ</span></div>
      <div style="font-size: 13px; color: var(--text-muted); margin-top: 5px;"><strong>Địa chỉ:</strong> ${order.address}</div>
    </div>
  `,
    )
    .join("");
}

function switchTab(tabName) {
  let profileTab = document.getElementById("tab-profile");
  let ordersTab = document.getElementById("tab-orders");
  let links = document.querySelectorAll(".tab-link");

  links.forEach((l) => l.classList.remove("active"));

  if (tabName === "profile") {
    if (profileTab) profileTab.style.display = "block";
    if (ordersTab) ordersTab.style.display = "none";
    if (links[0]) links[0].classList.add("active");
  } else {
    if (profileTab) profileTab.style.display = "none";
    if (ordersTab) ordersTab.style.display = "block";
    if (links[1]) links[1].classList.add("active");
    loadUserOrders();
  }
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
  loadProfile();
});
