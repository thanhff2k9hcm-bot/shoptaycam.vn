function validateRegister(event) {
  event.preventDefault();
  let user = document.getElementById("reg-user").value.trim();
  let pass = document.getElementById("reg-pass").value.trim();
  let phone = document.getElementById("reg-phone").value.trim();

  if (user.toLowerCase() === "admin") {
    alert("Tên đăng nhập này không được phép sử dụng!");
    return;
  }

  if (!user || pass.length < 6 || phone.length !== 10 || /\s/.test(pass)) {
    alert(
      "Vui lòng kiểm tra lại thông tin đăng ký (Mật khẩu >= 6 ký tự, không chứa khoảng trắng, SĐT đủ 10 số)!",
    );
    return;
  }

  let users = JSON.parse(localStorage.getItem("users")) || [];
  for (let i = 0; i < users.length; i++) {
    if (users[i].username === user) {
      alert("Tên đăng nhập đã tồn tại!");
      return;
    }
  }

  users.push({ username: user, password: pass, phone: phone, email: "", address: "" });
  localStorage.setItem("users", JSON.stringify(users));
  alert("Đăng ký thành công!");
  window.location.href = "login.html";
}

function validateLogin(event) {
  event.preventDefault();
  let user = document.getElementById("login-user").value.trim();
  let pass = document.getElementById("login-pass").value.trim();

  if (user === "admin" && pass === "123456") {
    localStorage.setItem(
      "currentUser",
      JSON.stringify({
        username: "admin",
        name: "admin",
        role: "admin",
        phone: "0901234567",
        address: "TP. Hồ Chí Minh",
      }),
    );
    alert("Đăng nhập Admin thành công!");
    window.location.href = "admincontroller.html";
    return;
  }

  let users = JSON.parse(localStorage.getItem("users")) || [];
  let found = users.find((u) => u.username === user && u.password === pass);

  if (found) {
    localStorage.setItem("currentUser", JSON.stringify({ ...found, role: "user" }));
    alert("Đăng nhập thành công!");
    window.location.href = "index.html";
  } else {
    alert("Sai tên đăng nhập hoặc mật khẩu!");
  }
}

function loginWithGoogle() {
  let googleUser = {
    username: "GoogleUser_" + Math.floor(Math.random() * 1000),
    role: "user",
    phone: "0900000000",
    address: "",
  };
  localStorage.setItem("currentUser", JSON.stringify(googleUser));
  alert("Đăng nhập Google thành công!");
  window.location.href = "index.html";
}
