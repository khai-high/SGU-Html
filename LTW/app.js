/* LAPTOP STORE - JavaScript
   Phiên bản chạy độc lập bằng localStorage để phục vụ demo/chấm file HTML.
   Dữ liệu chỉ nằm trên trình duyệt đang sử dụng; đây chưa phải hệ thống bảo mật/backend thật.
*/
"use strict";

const KEY = {
  products: "ls_products_v2",
  categories: "ls_categories_v2",
  users: "ls_users_v2",
  orders: "ls_orders_v2",
  cart: "ls_cart_v2",
  imports: "ls_imports_v2",
  moves: "ls_moves_v2",
  margins: "ls_margins_v2"
};

const seedCategories = [
  { id: "office", code: "L01", name: "Văn phòng", margin: 15, active: true },
  { id: "gaming", code: "L02", name: "Gaming", margin: 18, active: true },
  { id: "apple", code: "L03", name: "MacBook", margin: 12, active: true }
];

const seedProducts = [
  ["LT001","Acer Aspire","Acer","Intel Core i5","16GB","SSD 512GB",14500000,"image/acer-aspire.jpg","office","Laptop học tập và văn phòng."],
  ["LT002","ASUS VivoBook","ASUS","Intel Core i5","16GB","SSD 512GB",15900000,"image/asus-vivobook.jpg","office","Laptop mỏng nhẹ cho công việc."],
  ["LT003","Lenovo IdeaPad","Lenovo","AMD Ryzen 5","16GB","SSD 512GB",14900000,"image/lenovo-ideapad.jpg","office","Phù hợp học tập và làm việc."],
  ["LT004","HP Pavilion","HP","Intel Core i5","16GB","SSD 512GB",16500000,"image/hp-pavilion.jpg","office","Thiết kế hiện đại."],
  ["LT005","Dell Inspiron","Dell","Intel Core i5","16GB","SSD 512GB",16900000,"image/dell-inspiron.jpg","office","Laptop đa dụng."],
  ["LT006","HP Victus","HP","AMD Ryzen 5","16GB","SSD 512GB",19900000,"image/hp-victus.jpg","gaming","Laptop gaming và giải trí."],
  ["LT007","Dell Gaming","Dell","Intel Core i5","16GB","SSD 512GB",21500000,"image/dell-gaming.jpg","gaming","Hiệu năng dành cho game."],
  ["LT008","Lenovo Legion","Lenovo","Intel Core i7","16GB","SSD 1TB",28900000,"image/lenovo-legion.jpg","gaming","Dòng máy hiệu năng cao."],
  ["LT009","Acer Nitro","Acer","Intel Core i5","16GB","SSD 512GB",21900000,"image/acer-nitro.jpg","gaming","Laptop gaming phổ biến."],
  ["LT010","ASUS TUF Gaming","ASUS","AMD Ryzen 7","16GB","SSD 512GB",24900000,"image/asus-tuf.jpg","gaming","Thiết kế bền bỉ."],
  ["LT011","MacBook Pro M4","Apple","Apple M4","16GB","SSD 512GB",39900000,"image/macbook-pro-m4.jpg","apple","MacBook Pro chip M4."],
  ["LT012","MacBook Pro M3","Apple","Apple M3","8GB","SSD 512GB",32900000,"image/macbook-pro-m3.jpg","apple","MacBook Pro chip M3."],
  ["LT013","MacBook Air M4","Apple","Apple M4","16GB","SSD 256GB",27900000,"image/macbook-air-m4.jpg","apple","MacBook Air chip M4."],
  ["LT014","MacBook Air M3","Apple","Apple M3","8GB","SSD 256GB",24900000,"image/macbook-air-m3.jpg","apple","MacBook Air chip M3."],
  ["LT015","MacBook Air M2","Apple","Apple M2","8GB","SSD 256GB",22900000,"image/macbook-air-m2.jpg","apple","MacBook Air chip M2."]
].map((a, i) => ({
  id: i + 1,
  code: a[0],
  name: a[1],
  brand: a[2],
  cpu: a[3],
  ram: a[4],
  storage: a[5],
  price: a[6],
  image: a[7],
  category: a[8],
  description: a[9],
  stock: 5,
  cost: 0,
  active: true
}));

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function money(n) {
  return Number(n || 0).toLocaleString("vi-VN") + " ₫";
}

function safe(s) {
  return String(s ?? "").replace(/[&<>"']/g, c => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[c]));
}

function dateOnly(value) {
  return new Date(value).toISOString().slice(0, 10);
}

let categories = read(KEY.categories, seedCategories);
let products = read(KEY.products, seedProducts);

let users = read(KEY.users, [{
  fullName: "Quản trị viên",
  username: "admin",
  email: "admin@laptopstore.local",
  phone: "",
  address: "",
  password: "123456",
  role: "admin",
  active: true
}]);

let orders = read(KEY.orders, []);
let cart = read(KEY.cart, []);
let imports = read(KEY.imports, []);
let movements = read(KEY.moves, []);
let margins = read(KEY.margins, {});

let page = 1;
let pageSize = 8;
let selectedCategory = "all";
let draftLines = [];

function persist() {
  write(KEY.categories, categories);
  write(KEY.products, products);
  write(KEY.users, users);
  write(KEY.orders, orders);
  write(KEY.cart, cart);
  write(KEY.imports, imports);
  write(KEY.moves, movements);
  write(KEY.margins, margins);
}

function user() {
  const name = sessionStorage.getItem("ls_current_user");
  return users.find(x => x.username === name) || null;
}

function admin() {
  return user()?.role === "admin";
}

function requireLogin() {
  if (!user()) {
    alert("Bạn cần đăng nhập trước.");
    openModal("loginModal");
    return false;
  }
  return true;
}

function requireAdmin() {
  if (!admin()) {
    alert("Chức năng này chỉ dành cho quản trị viên.");
    openModal("loginModal");
    return false;
  }
  return true;
}

function openModal(id) {
  document.getElementById(id).classList.remove("hidden");
}

function closeModal(id) {
  document.getElementById(id).classList.add("hidden");
}

function showSection(id) {
  if (id === "admin" && !requireAdmin()) return;
  if (["cart", "myOrders"].includes(id) && !requireLogin()) return;

  document.querySelectorAll("main>.page").forEach(x => x.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");

  if (id === "products") renderProducts();
  if (id === "cart") renderCart();
  if (id === "myOrders") renderMyOrders();

  if (id === "admin") {
    adminTab("customers");
    refreshAdmin();
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function updateAccount() {
  const u = user();

  document.getElementById("welcome").textContent = u
    ? `Xin chào, ${u.fullName} (${u.role === "admin" ? "Admin" : "Khách hàng"})`
    : "";

  ["loginOpen", "registerOpen"].forEach(id => {
    document.getElementById(id).classList.toggle("hidden", !!u);
  });

  document.getElementById("logout").classList.toggle("hidden", !u);
  document.getElementById("profileOpen").classList.toggle("hidden", !u || u.role === "admin");
  document.getElementById("adminNav").classList.toggle("hidden", !admin());

  updateCartCount();
}

function updateCartCount() {
  document.getElementById("cartCount").textContent =
    cart.reduce((s, x) => s + x.qty, 0);
}

function fillOptions() {
  const active = categories.filter(c => c.active);

  const catOptions = active.map(c =>
    `<option value="${safe(c.id)}">${safe(c.name)}</option>`
  ).join("");

  const productOptions = products.map(p =>
    `<option value="${p.id}">${safe(p.name)}</option>`
  ).join("");

  const configs = [
    ["filterCategory", '<option value="all">Tất cả danh mục</option>' + catOptions],
    ["pCategory", catOptions],
    ["stockCategory", '<option value="all">Tất cả loại</option>' + catOptions],
    ["marginCategory", catOptions],
    ["importProduct", productOptions],
    ["movementProduct", productOptions]
  ];

  configs.forEach(([id, html]) => {
    const el = document.getElementById(id);
    if (el) {
      const old = el.value;
      el.innerHTML = html;
      if ([...el.options].some(o => o.value === old)) el.value = old;
    }
  });
}

function renderCategories() {
  const el = document.getElementById("categoryButtons");

  el.innerHTML =
    `<button class="${selectedCategory === "all" ? "active" : ""}" onclick="chooseCategory('all')">Tất cả</button>` +
    categories.filter(c => c.active).map(c =>
      `<button class="${selectedCategory === c.id ? "active" : ""}" onclick="chooseCategory('${safe(c.id)}')">${safe(c.name)}</button>`
    ).join("");
}

function chooseCategory(id) {
  selectedCategory = id;
  document.getElementById("filterCategory").value = id;
  page = 1;
  renderCategories();
  showSection("products");
}

function searchProducts() {
  page = 1;
  renderProducts();
}

/* ===== Bộ lọc nâng cao ===== */
const facets = { brand: new Set(), cpu: new Set(), ram: new Set(), storage: new Set() };

function ramGB(p) {
  const m = String(p.ram || "").match(/(\d+)/);
  return m ? Number(m[1]) : 0;
}

function storageGB(p) {
  const m = String(p.storage || "").toUpperCase().match(/(\d+(?:[.,]\d+)?)\s*(TB|GB)/);
  if (!m) return 0;
  const n = parseFloat(m[1].replace(",", "."));
  return m[2] === "TB" ? n * 1024 : n;
}

function fmtGB(n) {
  return n >= 1024 ? (n / 1024) + "TB" : n + "GB";
}

const facetDefs = {
  brand:   { el: "facetBrand",   title: "Hãng",   val: p => p.brand || "",           label: v => v,                numeric: false },
  cpu:     { el: "facetCPU",     title: "CPU",    val: p => p.cpu || "",             label: v => v,                numeric: false },
  ram:     { el: "facetRAM",     title: "RAM",    val: p => String(ramGB(p) || ""),  label: v => v + "GB",        numeric: true },
  storage: { el: "facetStorage", title: "Ổ cứng", val: p => String(storageGB(p) || ""), label: v => fmtGB(Number(v)), numeric: true }
};

function filterState() {
  return {
    keyword: document.getElementById("searchName").value.trim().toLowerCase(),
    category: document.getElementById("filterCategory").value,
    min: Number(document.getElementById("priceMin").value || 0),
    max: Number(document.getElementById("priceMax").value || 0),
    inStock: document.getElementById("inStock").checked
  };
}

/* skip: bỏ qua 1 nhóm lọc để đếm số lượng cho nhóm đó */
function matches(p, f, skip) {
  if (p.active === false) return false;
  if (f.keyword && !(p.name + " " + p.brand + " " + p.cpu + " " + p.code + " " + p.ram + " " + p.storage).toLowerCase().includes(f.keyword)) return false;
  if (f.category !== "all" && p.category !== f.category) return false;
  if (p.price < f.min) return false;
  if (f.max && p.price > f.max) return false;
  if (f.inStock && p.stock <= 0) return false;

  for (const key in facets) {
    if (key === skip || !facets[key].size) continue;
    if (!facets[key].has(facetDefs[key].val(p))) return false;
  }
  return true;
}

function toggleFacet(key, value) {
  if (facets[key].has(value)) facets[key].delete(value);
  else facets[key].add(value);
  page = 1;
  renderProducts();
}

function setPrice(min, max) {
  document.getElementById("priceMin").value = min || "";
  document.getElementById("priceMax").value = max || "";
  page = 1;
  renderProducts();
}

function resetFilters() {
  document.getElementById("searchName").value = "";
  document.getElementById("filterCategory").value = "all";
  document.getElementById("priceMin").value = "";
  document.getElementById("priceMax").value = "";
  document.getElementById("sortPrice").value = "none";
  document.getElementById("inStock").checked = false;
  Object.values(facets).forEach(s => s.clear());
  selectedCategory = "all";
  renderCategories();
  page = 1;
  renderProducts();
}

function renderFacets() {
  const f = filterState();

  Object.entries(facetDefs).forEach(([key, def]) => {
    const el = document.getElementById(def.el);
    if (!el) return;

    const values = [...new Set(
      products.filter(p => p.active !== false).map(def.val).filter(Boolean)
    )];

    values.sort(def.numeric
      ? (a, b) => Number(a) - Number(b)
      : (a, b) => a.localeCompare(b));

    el.innerHTML = values.map(v => {
      const count = products.filter(p => matches(p, f, key) && def.val(p) === v).length;
      const checked = facets[key].has(v);

      return `
        <label class="check ${count === 0 && !checked ? "zero" : ""}">
          <input type="checkbox" value="${safe(v)}" ${checked ? "checked" : ""}
            onchange="toggleFacet('${key}', this.value)">
          <span>${safe(def.label(v))}</span>
          <em>${count}</em>
        </label>`;
    }).join("") || '<p class="muted">Chưa có dữ liệu.</p>';
  });
}

function renderChips() {
  const f = filterState();
  const chips = [];

  Object.entries(facetDefs).forEach(([key, def]) => {
    facets[key].forEach(v => {
      chips.push({ text: def.title + ": " + def.label(v), onclick: `toggleFacet('${key}', this.dataset.v)`, v });
    });
  });

  if (f.min || f.max) {
    const text = f.min && f.max ? `${money(f.min)} - ${money(f.max)}`
      : f.min ? `Từ ${money(f.min)}` : `Đến ${money(f.max)}`;
    chips.push({ text: "Giá: " + text, onclick: "setPrice(0,0)", v: "" });
  }

  if (f.inStock) {
    chips.push({ text: "Còn hàng", onclick: "document.getElementById('inStock').checked=false;searchProducts()", v: "" });
  }

  document.getElementById("activeChips").innerHTML = chips.map(c =>
    `<button class="chip" data-v="${safe(c.v)}" onclick="${c.onclick}">${safe(c.text)} ✕</button>`
  ).join("");
}

function renderProducts() {
  const f = filterState();
  const sort = document.getElementById("sortPrice").value;

  const list = products.filter(p => matches(p, f));

  if (sort === "asc") list.sort((a, b) => a.price - b.price);
  if (sort === "desc") list.sort((a, b) => b.price - a.price);
  if (sort === "ram") list.sort((a, b) => ramGB(b) - ramGB(a) || a.price - b.price);
  if (sort === "storage") list.sort((a, b) => storageGB(b) - storageGB(a) || a.price - b.price);

  const totalPages = Math.max(1, Math.ceil(list.length / pageSize));
  page = Math.min(page, totalPages);

  const current = list.slice((page - 1) * pageSize, page * pageSize);

  document.getElementById("resultCount").textContent =
    `Tìm thấy ${list.length} sản phẩm`;

  document.getElementById("productGrid").innerHTML = current.length
    ? current.map(p => `
      <article class="product-card">
        <img src="${safe(p.image)}" alt="${safe(p.name)}"
          onerror="this.onerror=null;this.src='https://placehold.co/400x300?text=Laptop'">
        <div class="product-info">
          <h3>${safe(p.name)}</h3>
          <p>${safe(p.brand)} · ${safe(p.cpu)}</p>
          <p>${safe(p.ram)} · ${safe(p.storage)}</p>
          <div class="price">${money(p.price)}</div>
          <p class="${p.stock <= 2 ? "low" : ""}">${p.stock > 0 ? "Còn " + p.stock + " sản phẩm" : "Hết hàng"}</p>
          <button class="btn secondary" onclick="viewProduct(${p.id})">Chi tiết</button>
          <button class="btn" onclick="addCart(${p.id})">Thêm giỏ hàng</button>
        </div>
      </article>
    `).join("")
    : '<p>Không có sản phẩm phù hợp. Hãy thử bỏ bớt điều kiện lọc.</p>';

  document.getElementById("productPages").innerHTML = totalPages > 1
    ? Array.from({ length: totalPages }, (_, i) =>
        `<button class="${page === i + 1 ? "active" : ""}" onclick="goPage(${i + 1})">${i + 1}</button>`
      ).join("")
    : "";

  renderFacets();
  renderChips();
}

function goPage(n) {
  page = n;
  renderProducts();
}

function viewProduct(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;

  document.getElementById("detailContent").innerHTML = `
    <div class="detail-layout">
      <img src="${safe(p.image)}" alt="${safe(p.name)}"
        onerror="this.src='https://placehold.co/500x400?text=Laptop'">
      <div>
        <h2>${safe(p.name)}</h2>
        <p><b>Mã:</b> ${safe(p.code)}</p>
        <p><b>Thương hiệu:</b> ${safe(p.brand)}</p>
        <p><b>CPU:</b> ${safe(p.cpu)}</p>
        <p><b>RAM:</b> ${safe(p.ram)}</p>
        <p><b>Ổ cứng:</b> ${safe(p.storage)}</p>
        <p><b>Mô tả:</b> ${safe(p.description)}</p>
        <h2 class="price">${money(p.price)}</h2>
        <p>Tồn kho: ${p.stock}</p>
        <button class="btn" onclick="addCart(${p.id})">Thêm vào giỏ</button>
      </div>
    </div>`;

  document.querySelectorAll("main>.page").forEach(x => x.classList.add("hidden"));
  document.getElementById("detail").classList.remove("hidden");
  window.scrollTo(0, 0);
}

function addCart(id) {
  if (!requireLogin()) return;

  const p = products.find(x => x.id === id);
  if (!p || p.active === false) return;

  if (p.stock <= 0) {
    alert("Sản phẩm hiện đã hết hàng.");
    return;
  }

  const line = cart.find(x => x.productId === id);

  if (line) {
    if (line.qty >= p.stock) {
      alert("Số lượng vượt tồn kho.");
      return;
    }
    line.qty++;
  } else {
    cart.push({ productId: id, qty: 1 });
  }

  write(KEY.cart, cart);
  renderCart();
  updateCartCount();
  alert("Đã thêm vào giỏ hàng.");
}

function totalCart() {
  return cart.reduce((sum, x) => {
    const p = products.find(y => y.id === x.productId);
    return sum + (p ? p.price * x.qty : 0);
  }, 0);
}

function changeQty(id, delta) {
  const line = cart.find(x => x.productId === id);
  const p = products.find(x => x.id === id);

  if (!line || !p) return;

  line.qty += delta;

  if (line.qty <= 0) {
    cart = cart.filter(x => x.productId !== id);
  } else if (line.qty > p.stock) {
    line.qty = p.stock;
    alert("Số lượng đã đạt tồn kho.");
  }

  write(KEY.cart, cart);
  renderCart();
}

function removeCart(id) {
  cart = cart.filter(x => x.productId !== id);
  write(KEY.cart, cart);
  renderCart();
}

function renderCart() {
  document.getElementById("cartContent").innerHTML = cart.length
    ? cart.map(x => {
      const p = products.find(y => y.id === x.productId);
      if (!p) return "";

      return `
        <div class="cart-line">
          <img src="${safe(p.image)}" alt="${safe(p.name)}">
          <div class="line-info">
            <b>${safe(p.name)}</b>
            <p>${money(p.price)}</p>
            <button onclick="changeQty(${p.id},-1)">−</button>
            ${x.qty}
            <button onclick="changeQty(${p.id},1)">+</button>
            <button class="remove" onclick="removeCart(${p.id})">Xóa</button>
          </div>
          <b>${money(p.price * x.qty)}</b>
        </div>`;
    }).join("")
    : "<p>Giỏ hàng đang trống.</p>";

  document.getElementById("cartTotal").textContent =
    "Tổng tiền: " + money(totalCart());

  updateCartCount();
}

function login() {
  const name = document.getElementById("loginUsername").value.trim();
  const pass = document.getElementById("loginPassword").value;
  const role = document.getElementById("loginRole").value;
  const msg = document.getElementById("loginMessage");

  const u = users.find(x =>
    x.username.toLowerCase() === name.toLowerCase() &&
    x.password === pass &&
    x.role === role
  );

  if (!u) {
    msg.textContent = "Tên đăng nhập, mật khẩu hoặc loại tài khoản không đúng.";
    msg.style.color = "red";
    return;
  }

  if (u.active === false) {
    msg.textContent = "Tài khoản đã bị khóa.";
    msg.style.color = "red";
    return;
  }

  sessionStorage.setItem("ls_current_user", u.username);
  msg.textContent = "Đăng nhập thành công.";
  msg.style.color = "green";
  updateAccount();

  setTimeout(() => {
    closeModal("loginModal");
    showSection(u.role === "admin" ? "admin" : "home");
  }, 350);
}

function register() {
  const fullName = document.getElementById("regName").value.trim();
  const username = document.getElementById("regUsername").value.trim();
  const email = document.getElementById("regEmail").value.trim().toLowerCase();
  const phone = document.getElementById("regPhone").value.trim();
  const address = document.getElementById("regAddress").value.trim();
  const password = document.getElementById("regPassword").value;
  const confirm = document.getElementById("regConfirm").value;
  const msg = document.getElementById("registerMessage");

  const fail = t => {
    msg.textContent = t;
    msg.style.color = "red";
  };

  if (!fullName || !username || !email || !phone || !password || !confirm) {
    return fail("Vui lòng nhập đầy đủ các trường bắt buộc.");
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return fail("Email không hợp lệ.");
  }

  if (username.length < 4 || password.length < 6) {
    return fail("Tên đăng nhập cần ít nhất 4 ký tự, mật khẩu ít nhất 6 ký tự.");
  }

  if (password !== confirm) {
    return fail("Mật khẩu nhập lại không khớp.");
  }

  if (users.some(x =>
    x.username.toLowerCase() === username.toLowerCase() ||
    x.email.toLowerCase() === email
  )) {
    return fail("Tên đăng nhập hoặc email đã tồn tại.");
  }

  users.push({
    fullName,
    username,
    email,
    phone,
    address,
    password,
    role: "customer",
    active: true
  });

  write(KEY.users, users);
  msg.textContent = "Đăng ký thành công. Hãy đăng nhập.";
  msg.style.color = "green";

  setTimeout(() => {
    closeModal("registerModal");
    openModal("loginModal");
    document.getElementById("loginUsername").value = username;
    document.getElementById("loginRole").value = "customer";
  }, 650);
}

function logout() {
  sessionStorage.removeItem("ls_current_user");
  updateAccount();
  showSection("home");
}

function openProfile() {
  if (!requireLogin()) return;

  const u = user();
  if (!u || u.role === "admin") return;

  document.getElementById("profileName").value = u.fullName || "";
  document.getElementById("profileEmail").value = u.email || "";
  document.getElementById("profilePhone").value = u.phone || "";
  document.getElementById("profileAddress").value = u.address || "";

  openModal("profileModal");
}

function saveProfile() {
  const u = user();
  if (!u) return;

  const email = document.getElementById("profileEmail").value.trim().toLowerCase();

  if (
    !document.getElementById("profileName").value.trim() ||
    !email ||
    !document.getElementById("profilePhone").value.trim()
  ) {
    document.getElementById("profileMessage").textContent =
      "Vui lòng nhập họ tên, email và số điện thoại.";
    return;
  }

  if (users.some(x => x !== u && x.email.toLowerCase() === email)) {
    document.getElementById("profileMessage").textContent =
      "Email đã được sử dụng.";
    return;
  }

  u.fullName = document.getElementById("profileName").value.trim();
  u.email = email;
  u.phone = document.getElementById("profilePhone").value.trim();
  u.address = document.getElementById("profileAddress").value.trim();

  write(KEY.users, users);
  updateAccount();

  document.getElementById("profileMessage").textContent =
    "Đã cập nhật thông tin.";
}

function startCheckout() {
  if (!requireLogin()) return;
  if (!cart.length) {
    alert("Giỏ hàng đang trống.");
    return;
  }

  const u = user();

  if (u.role !== "customer") {
    alert("Tài khoản admin không đặt hàng.");
    return;
  }

  document.getElementById("shipName").value = u.fullName || "";
  document.getElementById("shipPhone").value = u.phone || "";
  document.getElementById("shipEmail").value = u.email || "";
  document.getElementById("shipAddress").value = u.address || "";
  document.getElementById("addressType").value = "saved";
  document.getElementById("shipAddress").disabled = true;

  document.getElementById("checkoutAmount").textContent =
    "Tổng thanh toán: " + money(totalCart());

  openModal("checkoutModal");
}

function toggleNewAddress() {
  const isSaved = document.getElementById("addressType").value === "saved";
  document.getElementById("shipAddress").disabled = isSaved;

  if (!isSaved) {
    document.getElementById("shipAddress").value = "";
  }
}

function placeOrder() {
  const u = user();
  const name = document.getElementById("shipName").value.trim();
  const phone = document.getElementById("shipPhone").value.trim();
  const email = document.getElementById("shipEmail").value.trim();
  const address = document.getElementById("shipAddress").value.trim();

  if (!u || !cart.length) return;

  if (!name || !phone || !email || !address) {
    alert("Vui lòng nhập đầy đủ thông tin nhận hàng.");
    return;
  }

  if (!/^[0-9]{9,11}$/.test(phone)) {
    alert("Số điện thoại phải có 9 đến 11 chữ số.");
    return;
  }

  for (const line of cart) {
    const p = products.find(x => x.id === line.productId);

    if (!p || p.stock < line.qty) {
      alert("Sản phẩm không đủ tồn kho: " + (p?.name || ""));
      return;
    }
  }

  const items = cart.map(line => {
    const p = products.find(x => x.id === line.productId);

    return {
      productId: p.id,
      code: p.code,
      name: p.name,
      price: p.price,
      qty: line.qty
    };
  });

  const order = {
    id: "DH" + Date.now(),
    username: u.username,
    customerName: name,
    phone,
    email,
    address,
    payment: document.getElementById("payment").value,
    date: new Date().toISOString(),
    items,
    total: totalCart(),
    status: "Mới đặt"
  };

  orders.push(order);

  items.forEach(i => {
    const p = products.find(x => x.id === i.productId);
    p.stock -= i.qty;

    movements.push({
      id: Date.now() + Math.random(),
      productId: p.id,
      date: dateOnly(new Date()),
      type: "Xuất bán",
      qty: i.qty,
      ref: order.id
    });
  });

  cart = [];
  persist();
  closeModal("checkoutModal");
  renderCart();

  alert("Đặt hàng thành công. Mã đơn: " + order.id);
  showSection("myOrders");
}

function statusBadge(s) {
  return `<span class="status">${safe(s)}</span>`;
}

function orderDetail(id) {
  const o = orders.find(x => x.id === id);
  if (!o) return;

  document.getElementById("orderDetail").innerHTML = `
    <h2>Đơn hàng ${safe(o.id)}</h2>
    <p>Khách hàng: ${safe(o.customerName)}</p>
    <p>SĐT: ${safe(o.phone)}</p>
    <p>Địa chỉ: ${safe(o.address)}</p>
    <p>Thanh toán: ${safe(o.payment)}</p>
    <p>Trạng thái: ${statusBadge(o.status)}</p>
    <div class="table-wrap">
      <table>
        <tr><th>Sản phẩm</th><th>Số lượng</th><th>Đơn giá</th></tr>
        ${o.items.map(i => `
          <tr>
            <td>${safe(i.name)}</td>
            <td>${i.qty}</td>
            <td>${money(i.price)}</td>
          </tr>
        `).join("")}
      </table>
    </div>
    <h3>Tổng: ${money(o.total)}</h3>`;

  openModal("orderModal");
}

function renderMyOrders() {
  const list = orders.filter(o => o.username === user()?.username);

  document.getElementById("myOrdersContent").innerHTML = list.length
    ? `<div class="table-wrap">
        <table>
          <tr>
            <th>Mã đơn</th>
            <th>Ngày đặt</th>
            <th>Tổng tiền</th>
            <th>Trạng thái</th>
            <th></th>
          </tr>
          ${list.map(o => `
            <tr>
              <td>${safe(o.id)}</td>
              <td>${new Date(o.date).toLocaleString("vi-VN")}</td>
              <td>${money(o.total)}</td>
              <td>${statusBadge(o.status)}</td>
              <td><button onclick="orderDetail('${o.id}')">Chi tiết</button></td>
            </tr>
          `).join("")}
        </table>
      </div>`
    : "<p>Bạn chưa có đơn hàng.</p>";
}

function adminTab(id) {
  if (!requireAdmin()) return;

  document.querySelectorAll(".admin-panel").forEach(x =>
    x.classList.add("hidden")
  );

  document.getElementById(id).classList.remove("hidden");

  if (id === "customers") renderCustomers();
  if (id === "categories") renderCategoryAdmin();

  if (id === "productsAdmin") {
    fillOptions();
    renderProductAdmin();
  }

  if (id === "imports") {
    fillOptions();
    renderDraftImport();
    renderImports();
  }

  if (id === "prices") {
    fillOptions();
    renderPrices();
  }

  if (id === "orders") renderAdminOrders();

  if (id === "inventory") {
    fillOptions();
    renderInventory();
    renderMovements();
  }

  if (id === "stats") renderStats();
}

function refreshAdmin() {
  renderCustomers();
  renderCategoryAdmin();
  fillOptions();
  renderProductAdmin();
  renderDraftImport();
  renderImports();
  renderPrices();
  renderAdminOrders();
  renderInventory();
  renderStats();
}

function renderCustomers() {
  const list = users.filter(u => u.role === "customer");

  document.getElementById("customerTable").innerHTML = list.length
    ? `<div class="table-wrap">
        <table>
          <tr>
            <th>Họ tên</th>
            <th>Tài khoản</th>
            <th>Email</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
          ${list.map(u => `
            <tr>
              <td>${safe(u.fullName)}</td>
              <td>${safe(u.username)}</td>
              <td>${safe(u.email)}</td>
              <td>${u.active === false ? "Đã khóa" : "Hoạt động"}</td>
              <td>
                <button onclick="resetPassword('${safe(u.username)}')">Reset mật khẩu</button>
                <button class="danger-btn" onclick="toggleUser('${safe(u.username)}')">
                  ${u.active === false ? "Mở khóa" : "Khóa"}
                </button>
              </td>
            </tr>
          `).join("")}
        </table>
      </div>`
    : "<p>Chưa có khách hàng đăng ký.</p>";
}

function resetPassword(username) {
  if (!requireAdmin()) return;

  const u = users.find(x => x.username === username);
  if (!u) return;

  const p = prompt("Nhập mật khẩu mới (ít nhất 6 ký tự):");
  if (p === null) return;

  if (p.length < 6) {
    alert("Mật khẩu quá ngắn.");
    return;
  }

  u.password = p;
  write(KEY.users, users);
  alert("Đã đặt lại mật khẩu.");
}

function toggleUser(username) {
  const u = users.find(x => x.username === username);
  if (!u) return;

  u.active = u.active === false;
  write(KEY.users, users);
  renderCustomers();
}

function addCategory() {
  const code = document.getElementById("catCode").value.trim();
  const name = document.getElementById("catName").value.trim();

  if (!code || !name) {
    alert("Nhập mã và tên loại.");
    return;
  }

  if (categories.some(c =>
    c.code.toLowerCase() === code.toLowerCase() ||
    c.name.toLowerCase() === name.toLowerCase()
  )) {
    alert("Mã hoặc tên loại đã tồn tại.");
    return;
  }

  categories.push({
    id: "cat" + Date.now(),
    code,
    name,
    margin: 15,
    active: true
  });

  write(KEY.categories, categories);
  document.getElementById("catCode").value = "";
  document.getElementById("catName").value = "";

  renderCategoryAdmin();
  fillOptions();
  renderCategories();
}

function renderCategoryAdmin() {
  document.getElementById("categoryTable").innerHTML =
    categories.map(c => `
      <div class="admin-item">
        <span>${safe(c.code)} - ${safe(c.name)} ${c.active ? "" : "(Đã ẩn)"}</span>
        <span>
          <button onclick="editCategory('${c.id}')">Sửa</button>
          <button onclick="toggleCategory('${c.id}')">${c.active ? "Ẩn" : "Hiện"}</button>
          <button class="danger-btn" onclick="deleteCategory('${c.id}')">Xóa</button>
        </span>
      </div>
    `).join("");
}

function editCategory(id) {
  const c = categories.find(x => x.id === id);
  if (!c) return;

  const value = prompt("Tên loại sản phẩm:", c.name);
  if (value === null) return;
  if (!value.trim()) return alert("Tên loại không được trống.");

  c.name = value.trim();

  write(KEY.categories, categories);
  renderCategoryAdmin();
  fillOptions();
  renderCategories();
}

function toggleCategory(id) {
  const c = categories.find(x => x.id === id);
  if (!c) return;

  c.active = !c.active;

  write(KEY.categories, categories);
  renderCategoryAdmin();
  fillOptions();
  renderCategories();
}

function deleteCategory(id) {
  if (products.some(p => p.category === id)) {
    alert("Không thể xóa loại đang có sản phẩm.");
    return;
  }

  if (!confirm("Xóa loại này?")) return;

  categories = categories.filter(c => c.id !== id);

  write(KEY.categories, categories);
  renderCategoryAdmin();
  fillOptions();
  renderCategories();
}

function resetProductForm() {
  [
    "editProductId",
    "pCode",
    "pName",
    "pBrand",
    "pPrice",
    "pImage",
    "pCPU",
    "pRAM",
    "pStorage",
    "pDescription"
  ].forEach(id => {
    document.getElementById(id).value = "";
  });
}

function saveProduct() {
  const id = document.getElementById("editProductId").value;
  const code = document.getElementById("pCode").value.trim();
  const name = document.getElementById("pName").value.trim();
  const category = document.getElementById("pCategory").value;
  const brand = document.getElementById("pBrand").value.trim();
  const price = Number(document.getElementById("pPrice").value);
  const image = document.getElementById("pImage").value.trim();
  const cpu = document.getElementById("pCPU").value.trim();
  const ram = document.getElementById("pRAM").value.trim();
  const storage = document.getElementById("pStorage").value.trim();
  const description = document.getElementById("pDescription").value.trim();

  if (!code || !name || !category || !brand || !price || !image || !cpu || !ram || !storage) {
    alert("Vui lòng nhập đủ thông tin sản phẩm.");
    return;
  }

  if (price <= 0 || !Number.isFinite(price)) {
    alert("Giá bán phải lớn hơn 0.");
    return;
  }

  if (products.some(p =>
    p.code.toLowerCase() === code.toLowerCase() &&
    String(p.id) !== id
  )) {
    alert("Mã sản phẩm đã tồn tại.");
    return;
  }

  if (id) {
    const p = products.find(x => String(x.id) === id);
    Object.assign(p, {
      code,
      name,
      category,
      brand,
      price,
      image,
      cpu,
      ram,
      storage,
      description
    });
  } else {
    products.push({
      id: Date.now(),
      code,
      name,
      category,
      brand,
      price,
      image,
      cpu,
      ram,
      storage,
      description,
      stock: 0,
      cost: 0,
      active: true
    });
  }

  write(KEY.products, products);
  resetProductForm();
  renderProductAdmin();
  renderProducts();
  fillOptions();
  alert("Đã lưu sản phẩm.");
}

function editProduct(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;

  document.getElementById("editProductId").value = p.id;

  const vals = {
    pCode: p.code,
    pName: p.name,
    pCategory: p.category,
    pBrand: p.brand,
    pPrice: p.price,
    pImage: p.image,
    pCPU: p.cpu,
    pRAM: p.ram,
    pStorage: p.storage,
    pDescription: p.description || ""
  };

  Object.entries(vals).forEach(([k, v]) => {
    document.getElementById(k).value = v;
  });

  window.scrollTo({
    top: document.getElementById("productsAdmin").offsetTop,
    behavior: "smooth"
  });
}

function toggleProduct(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;

  p.active = p.active === false;

  write(KEY.products, products);
  renderProductAdmin();
  renderProducts();
}

function deleteProduct(id) {
  if (!confirm("Xóa sản phẩm?")) return;

  products = products.filter(p => p.id !== id);
  cart = cart.filter(x => x.productId !== id);

  persist();
  renderProductAdmin();
  renderProducts();
  renderCart();
  fillOptions();
}

function renderProductAdmin() {
  const el = document.getElementById("productAdminTable");
  if (!el) return;

  el.innerHTML = products.map(p => `
    <div class="admin-item">
      <div>
        <b>${safe(p.code)} - ${safe(p.name)}</b>
        <p>${money(p.price)} · Tồn: ${p.stock}</p>
      </div>
      <div>
        <button onclick="editProduct(${p.id})">Sửa</button>
        <button onclick="toggleProduct(${p.id})">${p.active === false ? "Hiện" : "Ẩn"}</button>
        <button class="danger-btn" onclick="deleteProduct(${p.id})">Xóa</button>
      </div>
    </div>
  `).join("");
}

function addImportLine() {
  const productId = Number(document.getElementById("importProduct").value);
  const cost = Number(document.getElementById("importCost").value);
  const qty = Number(document.getElementById("importQty").value);

  if (!productId || cost <= 0 || qty <= 0 || !Number.isInteger(qty)) {
    alert("Giá nhập và số lượng phải hợp lệ.");
    return;
  }

  const old = draftLines.find(x => x.productId === productId);

  if (old) {
    old.qty += qty;
    old.cost = cost;
  } else {
    draftLines.push({ productId, cost, qty });
  }

  renderDraftImport();
}

function renderDraftImport() {
  const el = document.getElementById("draftImport");
  if (!el) return;

  el.innerHTML = draftLines.length
    ? `<div class="table-wrap">
        <table>
          <tr>
            <th>Sản phẩm</th>
            <th>Giá nhập</th>
            <th>Số lượng</th>
            <th>Thành tiền</th>
          </tr>
          ${draftLines.map(x => {
            const p = products.find(y => y.id === x.productId);

            return `
              <tr>
                <td>${safe(p?.name)}</td>
                <td>${money(x.cost)}</td>
                <td>${x.qty}</td>
                <td>${money(x.cost * x.qty)}</td>
              </tr>`;
          }).join("")}
        </table>
      </div>`
    : "<p>Phiếu nhập chưa có sản phẩm.</p>";
}

function finishImport() {
  if (!draftLines.length) {
    alert("Chưa có sản phẩm trong phiếu.");
    return;
  }

  const date = document.getElementById("importDate").value || dateOnly(new Date());

  const receipt = {
    id: "PN" + Date.now(),
    date,
    status: "Hoàn thành",
    items: draftLines.map(x => ({ ...x }))
  };

  receipt.items.forEach(x => {
    const p = products.find(y => y.id === x.productId);
    p.stock += x.qty;
    p.cost = x.cost;

    movements.push({
      productId: p.id,
      date,
      type: "Nhập",
      qty: x.qty,
      ref: receipt.id
    });
  });

  imports.push(receipt);
  draftLines = [];

  persist();
  renderDraftImport();
  renderImports();
  renderInventory();
  renderProductAdmin();

  alert("Đã hoàn thành phiếu " + receipt.id);
}

function renderImports() {
  const keyword = (document.getElementById("importSearch")?.value || "").toLowerCase();
  const list = imports.filter(x => x.id.toLowerCase().includes(keyword));

  document.getElementById("importTable").innerHTML = list.length
    ? `<div class="table-wrap">
        <table>
          <tr>
            <th>Mã phiếu</th>
            <th>Ngày nhập</th>
            <th>Số dòng</th>
            <th>Trạng thái</th>
            <th>Tổng tiền</th>
          </tr>
          ${list.map(r => `
            <tr>
              <td>${r.id}</td>
              <td>${r.date}</td>
              <td>${r.items.length}</td>
              <td>${r.status}</td>
              <td>${money(r.items.reduce((s, x) => s + x.cost * x.qty, 0))}</td>
            </tr>
          `).join("")}
        </table>
      </div>`
    : "<p>Không tìm thấy phiếu nhập.</p>";
}

function saveCategoryMargin() {
  const id = document.getElementById("marginCategory").value;
  const value = Number(document.getElementById("marginPercent").value);

  if (!id || !Number.isFinite(value) || value < 0) {
    alert("Tỷ lệ lợi nhuận không hợp lệ.");
    return;
  }

  margins[id] = value;

  const c = categories.find(x => x.id === id);
  if (c) c.margin = value;

  write(KEY.margins, margins);
  write(KEY.categories, categories);
  renderPrices();
}

function renderPrices() {
  const el = document.getElementById("priceTable");
  if (!el) return;

  el.innerHTML = `
    <div class="table-wrap">
      <table>
        <tr>
          <th>Sản phẩm</th>
          <th>Giá vốn</th>
          <th>Lợi nhuận</th>
          <th>Giá bán</th>
          <th>Sửa % riêng</th>
        </tr>
        ${products.map(p => {
          const c = categories.find(x => x.id === p.category);
          const m = p.margin ?? margins[p.category] ?? c?.margin ?? 15;

          return `
            <tr>
              <td>${safe(p.name)}</td>
              <td>${money(p.cost)}</td>
              <td>${m}%</td>
              <td>${money(p.price)}</td>
              <td>
                <input id="productMargin${p.id}" type="number" min="0" value="${m}" style="width:90px">
                <button onclick="saveProductMargin(${p.id})">Lưu</button>
              </td>
            </tr>`;
        }).join("")}
      </table>
    </div>`;
}

function saveProductMargin(id) {
  const p = products.find(x => x.id === id);
  const m = Number(document.getElementById("productMargin" + id).value);

  if (!p || !Number.isFinite(m) || m < 0) {
    alert("Tỷ lệ không hợp lệ.");
    return;
  }

  p.margin = m;

  if (p.cost > 0) {
    p.price = Math.round(p.cost * (1 + m / 100));
  }

  write(KEY.products, products);
  renderPrices();
  renderProductAdmin();
  renderProducts();
}

function renderAdminOrders() {
  const from = document.getElementById("orderStart").value;
  const to = document.getElementById("orderEnd").value;
  const status = document.getElementById("orderStatus").value;

  const list = orders.filter(o => {
    const d = dateOnly(o.date);

    return (!from || d >= from) &&
      (!to || d <= to) &&
      (status === "all" || o.status === status);
  });

  document.getElementById("adminOrderTable").innerHTML = list.length
    ? `<div class="table-wrap">
        <table>
          <tr>
            <th>Mã đơn</th>
            <th>Khách hàng</th>
            <th>Ngày đặt</th>
            <th>Tổng tiền</th>
            <th>Trạng thái</th>
            <th>Cập nhật</th>
            <th>Chi tiết</th>
          </tr>
          ${list.map(o => `
            <tr>
              <td>${safe(o.id)}</td>
              <td>${safe(o.customerName)}</td>
              <td>${new Date(o.date).toLocaleDateString("vi-VN")}</td>
              <td>${money(o.total)}</td>
              <td>${safe(o.status)}</td>
              <td>
                <select id="status${o.id}">
                  <option ${o.status === "Mới đặt" ? "selected" : ""}>Mới đặt</option>
                  <option ${o.status === "Đã xử lý" ? "selected" : ""}>Đã xử lý</option>
                  <option ${o.status === "Đã giao" ? "selected" : ""}>Đã giao</option>
                  <option ${o.status === "Đã hủy" ? "selected" : ""}>Đã hủy</option>
                </select>
                <button onclick="updateOrderStatus('${o.id}')">Lưu</button>
              </td>
              <td><button onclick="orderDetail('${o.id}')">Xem</button></td>
            </tr>
          `).join("")}
        </table>
      </div>`
    : "<p>Không có đơn hàng phù hợp.</p>";
}

function updateOrderStatus(id) {
  const o = orders.find(x => x.id === id);
  if (!o) return;

  const next = document.getElementById("status" + id).value;

  if (o.status !== "Đã hủy" && next === "Đã hủy") {
    if (!confirm("Hủy đơn hàng và hoàn lại số lượng tồn kho?")) return;

    o.items.forEach(i => {
      const p = products.find(x => x.id === i.productId);

      if (p) {
        p.stock += i.qty;

        movements.push({
          productId: p.id,
          date: dateOnly(new Date()),
          type: "Hoàn đơn",
          qty: i.qty,
          ref: o.id
        });
      }
    });
  } else if (o.status === "Đã hủy" && next !== "Đã hủy") {
    alert("Đơn đã hủy không thể khôi phục tự động.");
    return;
  }

  o.status = next;
  persist();
  renderAdminOrders();
  renderInventory();
}

function renderInventory() {
  const cat = document.getElementById("stockCategory").value;
  const list = products.filter(p => cat === "all" || p.category === cat);

  document.getElementById("inventoryTable").innerHTML = list.length
    ? `<div class="table-wrap">
        <table>
          <tr>
            <th>Mã</th>
            <th>Sản phẩm</th>
            <th>Loại</th>
            <th>Tồn kho</th>
            <th>Cảnh báo</th>
          </tr>
          ${list.map(p => `
            <tr>
              <td>${safe(p.code)}</td>
              <td>${safe(p.name)}</td>
              <td>${safe(categories.find(c => c.id === p.category)?.name || "")}</td>
              <td>${p.stock}</td>
              <td>${p.stock <= 3
                ? '<span class="low">Sắp hết hàng</span>'
                : "Đủ hàng"}</td>
            </tr>
          `).join("")}
        </table>
      </div>`
    : "<p>Không có sản phẩm.</p>";
}

function renderMovements() {
  const id = Number(document.getElementById("movementProduct").value);
  const from = document.getElementById("movementStart").value;
  const to = document.getElementById("movementEnd").value;

  const list = movements.filter(m =>
    (!id || m.productId === id) &&
    (!from || m.date >= from) &&
    (!to || m.date <= to)
  );

  const product = products.find(p => p.id === id);

  document.getElementById("movementTable").innerHTML = list.length
    ? `<p>Sản phẩm: ${safe(product?.name || "Tất cả")}</p>
      <div class="table-wrap">
        <table>
          <tr>
            <th>Ngày</th>
            <th>Sản phẩm</th>
            <th>Loại</th>
            <th>Số lượng</th>
            <th>Mã tham chiếu</th>
          </tr>
          ${list.map(m => `
            <tr>
              <td>${m.date}</td>
              <td>${safe(products.find(p => p.id === m.productId)?.name || "")}</td>
              <td>${safe(m.type)}</td>
              <td>${m.qty}</td>
              <td>${safe(m.ref || "")}</td>
            </tr>
          `).join("")}
        </table>
      </div>`
    : "<p>Không có phát sinh trong khoảng thời gian này.</p>";
}

function renderStats() {
  const revenue = orders
    .filter(o => o.status === "Đã giao")
    .reduce((s, o) => s + o.total, 0);

  const customers = users.filter(u => u.role === "customer").length;

  document.getElementById("statistics").innerHTML = `
    <div class="stat-card">Sản phẩm<strong>${products.length}</strong></div>
    <div class="stat-card">Đơn hàng<strong>${orders.length}</strong></div>
    <div class="stat-card">Doanh thu đơn đã giao<strong>${money(revenue)}</strong></div>
    <div class="stat-card">Khách hàng<strong>${customers}</strong></div>`;
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("loginOpen").addEventListener("click", () =>
    openModal("loginModal")
  );

  document.getElementById("registerOpen").addEventListener("click", () =>
    openModal("registerModal")
  );

  document.getElementById("profileOpen").addEventListener("click", openProfile);
  document.getElementById("logout").addEventListener("click", logout);

  fillOptions();
  renderCategories();
  renderProducts();
  renderCart();
  updateAccount();

  document.getElementById("importDate").value = dateOnly(new Date());
});