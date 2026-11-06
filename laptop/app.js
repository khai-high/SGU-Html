
/* ==========================================
   LAPTOP STORE - JAVASCRIPT
========================================== */

/* ==========================================
   1. ĐỌC VÀ LƯU DỮ LIỆU
========================================== */

function loadData(key, defaultValue) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : defaultValue;
    } catch (error) {
        return defaultValue;
    }
}

function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[char]);
}

function formatMoney(number) {
    return Number(number || 0).toLocaleString("vi-VN") + " ₫";
}

/* ==========================================
   2. DANH SÁCH 15 LAPTOP
========================================== */

const defaultProducts = [
    {
        id: 1,
        name: "Acer Aspire",
        brand: "Acer",
        cpu: "Intel Core i5",
        ram: "16GB",
        storage: "SSD 512GB",
        price: 14500000,
        image: "image/acer-aspire.jpg",
        category: "office"
    },
    {
        id: 2,
        name: "ASUS VivoBook",
        brand: "ASUS",
        cpu: "Intel Core i5",
        ram: "16GB",
        storage: "SSD 512GB",
        price: 15900000,
        image: "image/asus-vivobook.jpg",
        category: "office"
    },
    {
        id: 3,
        name: "Lenovo IdeaPad",
        brand: "Lenovo",
        cpu: "AMD Ryzen 5",
        ram: "16GB",
        storage: "SSD 512GB",
        price: 14900000,
        image: "image/lenovo-ideapad.jpg",
        category: "office"
    },
    {
        id: 4,
        name: "HP Pavilion",
        brand: "HP",
        cpu: "Intel Core i5",
        ram: "16GB",
        storage: "SSD 512GB",
        price: 16500000,
        image: "image/hp-pavilion.jpg",
        category: "office"
    },
    {
        id: 5,
        name: "Dell Inspiron",
        brand: "Dell",
        cpu: "Intel Core i5",
        ram: "16GB",
        storage: "SSD 512GB",
        price: 16900000,
        image: "image/dell-inspiron.jpg",
        category: "office"
    },
    {
        id: 6,
        name: "HP Victus",
        brand: "HP",
        cpu: "AMD Ryzen 5",
        ram: "16GB",
        storage: "SSD 512GB",
        price: 19900000,
        image: "image/hp-victus.jpg",
        category: "gaming"
    },
    {
        id: 7,
        name: "Dell Gaming",
        brand: "Dell",
        cpu: "Intel Core i5",
        ram: "16GB",
        storage: "SSD 512GB",
        price: 21500000,
        image: "image/dell-gaming.jpg",
        category: "gaming"
    },
    {
        id: 8,
        name: "Lenovo Legion",
        brand: "Lenovo",
        cpu: "Intel Core i7",
        ram: "16GB",
        storage: "SSD 1TB",
        price: 28900000,
        image: "image/lenovo-legion.jpg",
        category: "gaming"
    },
    {
        id: 9,
        name: "Acer Nitro",
        brand: "Acer",
        cpu: "Intel Core i5",
        ram: "16GB",
        storage: "SSD 512GB",
        price: 21900000,
        image: "image/acer-nitro.jpg",
        category: "gaming"
    },
    {
        id: 10,
        name: "ASUS TUF Gaming",
        brand: "ASUS",
        cpu: "AMD Ryzen 7",
        ram: "16GB",
        storage: "SSD 512GB",
        price: 24900000,
        image: "image/asus-tuf.jpg",
        category: "gaming"
    },
    {
        id: 11,
        name: "MacBook Pro M4",
        brand: "Apple",
        cpu: "Apple M4",
        ram: "16GB Unified Memory",
        storage: "SSD 512GB",
        price: 39900000,
        image: "image/macbook-pro-m4.jpg",
        category: "apple"
    },
    {
        id: 12,
        name: "MacBook Pro M3",
        brand: "Apple",
        cpu: "Apple M3",
        ram: "8GB Unified Memory",
        storage: "SSD 512GB",
        price: 32900000,
        image: "image/macbook-pro-m3.jpg",
        category: "apple"
    },
    {
        id: 13,
        name: "MacBook Air M4",
        brand: "Apple",
        cpu: "Apple M4",
        ram: "16GB Unified Memory",
        storage: "SSD 256GB",
        price: 27900000,
        image: "image/macbook-air-m4.jpg",
        category: "apple"
    },
    {
        id: 14,
        name: "MacBook Air M3",
        brand: "Apple",
        cpu: "Apple M3",
        ram: "8GB Unified Memory",
        storage: "SSD 256GB",
        price: 24900000,
        image: "image/macbook-air-m3.jpg",
        category: "apple"
    },
    {
        id: 15,
        name: "MacBook Air M2 13.6 inch",
        brand: "Apple",
        cpu: "Apple M2 (8 nhân CPU, 8 nhân GPU)",
        ram: "8GB Unified Memory",
        storage: "SSD 256GB",
        price: 22900000,
        image: "image/macbook-air-m2.jpg",
        category: "apple"
    }
];

/* ==========================================
   3. KHỞI TẠO DỮ LIỆU
========================================== */

let oldProducts = loadData("products", []);

if (!Array.isArray(oldProducts)) {
    oldProducts = [];
}

const customProducts = oldProducts.filter(product =>
    product &&
    !defaultProducts.some(item => Number(item.id) === Number(product.id)) &&
    !/msi/i.test(product.name || "") &&
    !/msi/i.test(product.brand || "")
);

let products = [
    ...defaultProducts,
    ...customProducts
];

saveData("products", products);

let cart = loadData("cart", []);
let invoices = loadData("invoices", []);
let customers = loadData("customers", []);
let users = loadData("users", []);

if (!Array.isArray(cart)) cart = [];
if (!Array.isArray(invoices)) invoices = [];
if (!Array.isArray(customers)) customers = [];
if (!Array.isArray(users)) users = [];

/* Xóa sản phẩm MSI trong giỏ hàng cũ */

cart = cart.filter(item =>
    !/msi/i.test(item.name || "")
);

saveData("cart", cart);

let currentCategory = "all";

/* ==========================================
   4. NHÂN VIÊN
========================================== */

const employees = [
    {
        id: "NV001",
        name: "Nguyễn Văn An",
        position: "Quản lý",
        phone: "0901111222"
    },
    {
        id: "NV002",
        name: "Trần Thị Bình",
        position: "Nhân viên bán hàng",
        phone: "0902222333"
    },
    {
        id: "NV003",
        name: "Lê Minh Khang",
        position: "Nhân viên kỹ thuật",
        phone: "0903333444"
    }
];

/* ==========================================
   5. TÀI KHOẢN ADMIN
========================================== */

if (!users.some(user =>
    String(user.username || "").toLowerCase() === "admin"
)) {
    users.push({
        fullName: "Quản trị viên",
        username: "admin",
        email: "admin@gmail.com",
        password: "123456",
        role: "admin"
    });

    saveData("users", users);
}

/* ==========================================
   6. KIỂM TRA TÀI KHOẢN
========================================== */

function getCurrentUser() {
    const username = sessionStorage.getItem("currentUser");

    if (!username) return null;

    return users.find(user =>
        user.username === username
    ) || null;
}

function isAdmin() {
    const user = getCurrentUser();

    return !!user && user.role === "admin";
}

/* ==========================================
   7. ĐIỀU HƯỚNG TRANG
========================================== */

function showSection(sectionId) {
    if (
        (sectionId === "management" || sectionId === "statistics") &&
        !isAdmin()
    ) {
        alert("Bạn cần đăng nhập bằng tài khoản quản trị viên!");

        openLogin();
        return;
    }

    document.querySelectorAll("main > section").forEach(section => {
        section.classList.add("hidden");
    });

    const section = document.getElementById(sectionId);

    if (!section) return;

    section.classList.remove("hidden");

    if (sectionId === "products") renderProducts();
    if (sectionId === "cart") renderCart();
    if (sectionId === "invoices") renderInvoices();

    if (sectionId === "management") {
        renderAdminProducts();
        renderCustomers();
        renderEmployees();
    }

    if (sectionId === "statistics") {
        renderStatistics();
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

/* ==========================================
   8. HIỂN THỊ SẢN PHẨM
========================================== */

function renderProducts() {
    const productList = document.getElementById("productList");

    if (!productList) return;

    const keyword = document.getElementById("searchInput")
        .value.toLowerCase().trim();

    const sort = document.getElementById("sortPrice").value;

    let filteredProducts = products.filter(product => {
        const name = (product.name || "").toLowerCase();
        const brand = (product.brand || "").toLowerCase();

        const matchKeyword =
            name.includes(keyword) ||
            brand.includes(keyword);

        const matchCategory =
            currentCategory === "all" ||
            product.category === currentCategory;

        return matchKeyword && matchCategory;
    });

    if (sort === "asc") {
        filteredProducts.sort((a, b) => a.price - b.price);
    }

    if (sort === "desc") {
        filteredProducts.sort((a, b) => b.price - a.price);
    }

    if (filteredProducts.length === 0) {
        productList.innerHTML =
            "<p>Không tìm thấy sản phẩm phù hợp.</p>";
        return;
    }

    productList.innerHTML = filteredProducts.map(product => `
        <div class="product-card">

            <img
                src="${escapeHTML(product.image)}"
                alt="${escapeHTML(product.name)}"
                onerror="this.onerror=null;this.src='https://placehold.co/400x300?text=Laptop'"
            >

            <div class="product-info">

                <h3>${escapeHTML(product.name)}</h3>

                <p>
                    <strong>Thương hiệu:</strong>
                    ${escapeHTML(product.brand)}
                </p>

                <p>
                    <strong>CPU:</strong>
                    ${escapeHTML(product.cpu)}
                </p>

                <p>
                    <strong>RAM:</strong>
                    ${escapeHTML(product.ram)}
                </p>

                <p>
                    <strong>Ổ cứng:</strong>
                    ${escapeHTML(product.storage)}
                </p>

                <h3 class="product-price">
                    ${formatMoney(product.price)}
                </h3>

                <button
                    class="btn-primary"
                    onclick="addToCart(${Number(product.id)})">
                    Thêm vào giỏ
                </button>

            </div>
        </div>
    `).join("");
}

/* ==========================================
   9. LỌC DANH MỤC
========================================== */

function filterCategory(category) {
    currentCategory = category;

    showSection("products");
}

/* ==========================================
   10. GIỎ HÀNG
========================================== */

function addToCart(productId) {
    const product = products.find(item =>
        Number(item.id) === Number(productId)
    );

    if (!product) {
        alert("Không tìm thấy sản phẩm!");
        return;
    }

    const existingItem = cart.find(item =>
        Number(item.id) === Number(productId)
    );

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }

    saveData("cart", cart);

    renderCart();
    updateCartCount();

    alert("Đã thêm sản phẩm vào giỏ hàng!");
}

function changeQuantity(productId, amount) {
    const item = cart.find(product =>
        Number(product.id) === Number(productId)
    );

    if (!item) return;

    item.quantity += amount;

    if (item.quantity <= 0) {
        cart = cart.filter(product =>
            Number(product.id) !== Number(productId)
        );
    }

    saveData("cart", cart);

    renderCart();
    updateCartCount();
}

function removeFromCart(productId) {
    cart = cart.filter(item =>
        Number(item.id) !== Number(productId)
    );

    saveData("cart", cart);

    renderCart();
    updateCartCount();
}

function updateCartCount() {
    const cartCount = document.getElementById("cartCount");

    if (!cartCount) return;

    const total = cart.reduce(
        (sum, item) => sum + Number(item.quantity || 0),
        0
    );

    cartCount.textContent = total;
}

function getCartTotal() {
    return cart.reduce(
        (sum, item) =>
            sum + Number(item.price) * Number(item.quantity),
        0
    );
}

function renderCart() {
    const cartList = document.getElementById("cartList");
    const cartTotal = document.getElementById("cartTotal");

    if (!cartList || !cartTotal) return;

    if (cart.length === 0) {
        cartList.innerHTML = "<p>Giỏ hàng đang trống.</p>";

        cartTotal.textContent = formatMoney(0);

        updateCartCount();
        return;
    }

    cartList.innerHTML = cart.map(item => `
        <div class="cart-item">

            <img
                src="${escapeHTML(item.image)}"
                alt="${escapeHTML(item.name)}"
                onerror="this.onerror=null;this.src='https://placehold.co/200x150?text=Laptop'"
            >

            <div>
                <h3>${escapeHTML(item.name)}</h3>

                <p>
                    Đơn giá: ${formatMoney(item.price)}
                </p>

                <button onclick="changeQuantity(${Number(item.id)}, -1)">
                    -
                </button>

                <strong>${Number(item.quantity)}</strong>

                <button onclick="changeQuantity(${Number(item.id)}, 1)">
                    +
                </button>

                <button onclick="removeFromCart(${Number(item.id)})">
                    Xóa
                </button>
            </div>

        </div>
    `).join("");

    cartTotal.textContent = formatMoney(getCartTotal());

    updateCartCount();
}

/* ==========================================
   11. ĐĂNG NHẬP
========================================== */

function openLogin() {
    document.getElementById("loginModal")
        .classList.remove("hidden");
}

function closeLogin() {
    document.getElementById("loginModal")
        .classList.add("hidden");
}

function login() {
    const username = document.getElementById("username")
        .value.trim();

    const password = document.getElementById("password").value;

    const message = document.getElementById("loginMessage");

    message.style.color = "#e63946";

    if (!username || !password) {
        message.textContent =
            "Vui lòng nhập đầy đủ tài khoản và mật khẩu!";
        return;
    }

    const user = users.find(item =>
        String(item.username).toLowerCase() === username.toLowerCase() &&
        item.password === password
    );

    if (!user) {
        message.textContent =
            "Tên đăng nhập hoặc mật khẩu không đúng!";
        return;
    }

    sessionStorage.setItem("currentUser", user.username);

    message.style.color = "green";
    message.textContent = "Đăng nhập thành công!";

    updateLoginUI();

    setTimeout(() => {
        closeLogin();

        message.textContent = "";

        document.getElementById("password").value = "";

        showSection("home");
    }, 500);
}

/* ==========================================
   12. ĐĂNG KÝ
========================================== */

function openRegister() {
    document.getElementById("registerModal")
        .classList.remove("hidden");
}

function closeRegister() {
    document.getElementById("registerModal")
        .classList.add("hidden");
}

function register() {
    const fullName = document.getElementById("registerFullName")
        .value.trim();

    const username = document.getElementById("registerUsername")
        .value.trim();

    const email = document.getElementById("registerEmail")
        .value.trim().toLowerCase();

    const password = document.getElementById("registerPassword")
        .value;

    const confirmPassword = document.getElementById("confirmPassword")
        .value;

    const message = document.getElementById("registerMessage");

    message.style.color = "#e63946";

    if (!fullName || !username || !email ||
        !password || !confirmPassword) {

        message.textContent =
            "Vui lòng nhập đầy đủ thông tin!";
        return;
    }

    // Kiểm tra email
    const emailRegex =
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(email)) {
        message.textContent =
            "Email không hợp lệ! Ví dụ: abc@gmail.com";
        return;
    }

    if (username.length < 4) {
        message.textContent =
            "Tên đăng nhập phải có ít nhất 4 ký tự!";
        return;
    }

    if (username.toLowerCase() === "admin") {
        message.textContent =
            "Tên đăng nhập này không được sử dụng!";
        return;
    }

    if (password.length < 6) {
        message.textContent =
            "Mật khẩu phải có ít nhất 6 ký tự!";
        return;
    }

    if (password !== confirmPassword) {
        message.textContent =
            "Mật khẩu nhập lại không khớp!";
        return;
    }

    const usernameExists = users.some(user =>
        String(user.username).toLowerCase() === username.toLowerCase()
    );

    if (usernameExists) {
        message.textContent =
            "Tên đăng nhập đã tồn tại!";
        return;
    }

    const emailExists = users.some(user =>
        user.email &&
        String(user.email).toLowerCase() === email
    );

    if (emailExists) {
        message.textContent =
            "Email này đã được đăng ký!";
        return;
    }

    const newUser = {
        fullName,
        username,
        email,
        password,
        role: "customer"
    };

    users.push(newUser);

    saveData("users", users);

    message.style.color = "green";
    message.textContent =
        "Đăng ký thành công! Bạn có thể đăng nhập.";

    document.getElementById("registerFullName").value = "";
    document.getElementById("registerUsername").value = "";
    document.getElementById("registerEmail").value = "";
    document.getElementById("registerPassword").value = "";
    document.getElementById("confirmPassword").value = "";

    setTimeout(() => {
        closeRegister();

        document.getElementById("username").value = username;

        document.getElementById("loginMessage").textContent = "";

        openLogin();

        message.textContent = "";
    }, 1000);
}

/* ==========================================
   13. ĐĂNG XUẤT
========================================== */

function logout() {
    sessionStorage.removeItem("currentUser");

    updateLoginUI();

    alert("Bạn đã đăng xuất thành công!");

    showSection("home");
}

function updateLoginUI() {
    const user = getCurrentUser();

    document.getElementById("loginBtn")
        .classList.toggle("hidden", !!user);

    document.getElementById("registerBtn")
        .classList.toggle("hidden", !!user);

    document.getElementById("logoutBtn")
        .classList.toggle("hidden", !user);
}

/* ==========================================
   14. THANH TOÁN
========================================== */

function checkout() {
    if (cart.length === 0) {
        alert("Giỏ hàng đang trống!");
        return;
    }

    document.getElementById("checkoutTotal").textContent =
        "Tổng thanh toán: " + formatMoney(getCartTotal());

    const user = getCurrentUser();

    document.getElementById("customerName").value =
        user ? user.fullName || "" : "";

    document.getElementById("customerEmail").value =
        user ? user.email || "" : "";

    document.getElementById("checkoutModal")
        .classList.remove("hidden");
}

function closeCheckout() {
    document.getElementById("checkoutModal")
        .classList.add("hidden");
}

function confirmCheckout() {
    const name = document.getElementById("customerName")
        .value.trim();

    const phone = document.getElementById("customerPhone")
        .value.trim();

    const email = document.getElementById("customerEmail")
        .value.trim().toLowerCase();

    if (!name || !phone || !email) {
        alert("Vui lòng nhập đầy đủ thông tin thanh toán!");
        return;
    }

    const emailRegex =
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(email)) {
        alert("Email không hợp lệ!");
        return;
    }

    if (!/^[0-9]{9,11}$/.test(phone)) {
        alert("Số điện thoại phải gồm 9 đến 11 chữ số!");
        return;
    }

    if (cart.length === 0) {
        alert("Giỏ hàng đang trống!");
        closeCheckout();
        return;
    }

    const total = getCartTotal();

    const invoice = {
        id: "HD" + Date.now(),
        customerName: name,
        phone,
        email,
        date: new Date().toLocaleString("vi-VN"),
        items: cart.map(item => ({ ...item })),
        total
    };

    invoices.push(invoice);

    const existingCustomer = customers.find(customer =>
        customer.phone === phone || customer.email === email
    );

    if (!existingCustomer) {
        customers.push({
            name,
            phone,
            email
        });

        saveData("customers", customers);
    }

    saveData("invoices", invoices);

    cart = [];

    saveData("cart", cart);

    closeCheckout();

    renderCart();
    renderInvoices();
    renderStatistics();
    renderCustomers();

    alert("Đặt hàng thành công! Mã hóa đơn: " + invoice.id);

    showSection("invoices");
}

/* ==========================================
   15. QUẢN LÝ HÓA ĐƠN
========================================== */

function renderInvoices() {
    const invoiceList = document.getElementById("invoiceList");

    if (!invoiceList) return;

    if (invoices.length === 0) {
        invoiceList.innerHTML = `
            <tr>
                <td colspan="5">Chưa có hóa đơn nào.</td>
            </tr>
        `;
        return;
    }

    invoiceList.innerHTML = invoices.map(invoice => `
        <tr>
            <td>${escapeHTML(invoice.id)}</td>
            <td>${escapeHTML(invoice.customerName)}</td>
            <td>${escapeHTML(invoice.date)}</td>
            <td>${formatMoney(invoice.total)}</td>
            <td>
                <button onclick="viewInvoice('${escapeHTML(invoice.id)}')">
                    Xem
                </button>
            </td>
        </tr>
    `).join("");
}

function viewInvoice(invoiceId) {
    const invoice = invoices.find(item =>
        item.id === invoiceId
    );

    if (!invoice) return;

    document.getElementById("invoiceDetail").innerHTML = `
        <div class="invoice-paper">

            <h2>LAPTOP STORE</h2>
            <h3>CHI TIẾT HÓA ĐƠN</h3>

            <p>
                <strong>Mã hóa đơn:</strong>
                ${escapeHTML(invoice.id)}
            </p>

            <p>
                <strong>Khách hàng:</strong>
                ${escapeHTML(invoice.customerName)}
            </p>

            <p>
                <strong>Số điện thoại:</strong>
                ${escapeHTML(invoice.phone)}
            </p>

            <p>
                <strong>Email:</strong>
                ${escapeHTML(invoice.email)}
            </p>

            <p>
                <strong>Ngày tạo:</strong>
                ${escapeHTML(invoice.date)}
            </p>

            <hr>

            <h3>Sản phẩm đã mua</h3>

            <div class="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>Sản phẩm</th>
                            <th>Số lượng</th>
                            <th>Đơn giá</th>
                            <th>Thành tiền</th>
                        </tr>
                    </thead>

                    <tbody>
                        ${invoice.items.map(item => `
                            <tr>
                                <td>${escapeHTML(item.name)}</td>
                                <td>${Number(item.quantity)}</td>
                                <td>${formatMoney(item.price)}</td>
                                <td>
                                    ${formatMoney(item.price * item.quantity)}
                                </td>
                            </tr>
                        `).join("")}
                    </tbody>
                </table>
            </div>

            <hr>

            <h3>Tổng tiền: ${formatMoney(invoice.total)}</h3>

        </div>
    `;

    document.getElementById("invoiceModal")
        .classList.remove("hidden");
}

function closeInvoice() {
    document.getElementById("invoiceModal")
        .classList.add("hidden");
}

/* ==========================================
   16. QUẢN LÝ SẢN PHẨM
========================================== */

function showManagement(contentId) {
    if (!isAdmin()) {
        alert("Bạn không có quyền truy cập chức năng này!");
        return;
    }

    document.querySelectorAll(".management-content").forEach(content => {
        content.classList.add("hidden");
    });

    const selected = document.getElementById(contentId);

    if (selected) {
        selected.classList.remove("hidden");
    }
}

function addProduct() {
    if (!isAdmin()) {
        alert("Bạn không có quyền thêm sản phẩm!");
        return;
    }

    const name = document.getElementById("newName").value.trim();

    const price = Number(
        document.getElementById("newPrice").value
    );

    const image = document.getElementById("newImage").value.trim();

    const brand = document.getElementById("newBrand").value.trim();

    const cpu = document.getElementById("newCPU").value.trim();

    const ram = document.getElementById("newRAM").value.trim();

    const storage = document.getElementById("newStorage").value.trim();

    if (!name || !price || !image || !brand ||
        !cpu || !ram || !storage) {

        alert("Vui lòng nhập đầy đủ thông tin sản phẩm!");
        return;
    }

    if (!Number.isFinite(price) || price <= 0) {
        alert("Giá sản phẩm phải lớn hơn 0!");
        return;
    }

    if (/msi/i.test(name) || /msi/i.test(brand)) {
        alert("Sản phẩm MSI không nằm trong danh sách cửa hàng!");
        return;
    }

    const newProduct = {
        id: Date.now(),
        name,
        price,
        image,
        brand,
        cpu,
        ram,
        storage,
        category: "office"
    };

    products.push(newProduct);

    saveData("products", products);

    renderProducts();
    renderAdminProducts();
    renderStatistics();

    document.getElementById("newName").value = "";
    document.getElementById("newPrice").value = "";
    document.getElementById("newImage").value = "";
    document.getElementById("newBrand").value = "";
    document.getElementById("newCPU").value = "";
    document.getElementById("newRAM").value = "";
    document.getElementById("newStorage").value = "";

    alert("Thêm sản phẩm thành công!");
}

function deleteProduct(productId) {
    if (!isAdmin()) {
        alert("Bạn không có quyền xóa sản phẩm!");
        return;
    }

    const product = products.find(item =>
        Number(item.id) === Number(productId)
    );

    if (!product) return;

    if (defaultProducts.some(item =>
        Number(item.id) === Number(productId)
    )) {
        alert("Không thể xóa 15 sản phẩm mặc định của cửa hàng!");
        return;
    }

    if (!confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
        return;
    }

    products = products.filter(item =>
        Number(item.id) !== Number(productId)
    );

    cart = cart.filter(item =>
        Number(item.id) !== Number(productId)
    );

    saveData("products", products);
    saveData("cart", cart);

    renderProducts();
    renderCart();
    renderAdminProducts();
    renderStatistics();
}

function renderAdminProducts() {
    const adminProductList =
        document.getElementById("adminProductList");

    if (!adminProductList) return;

    if (products.length === 0) {
        adminProductList.innerHTML =
            "<p>Chưa có sản phẩm.</p>";
        return;
    }

    adminProductList.innerHTML = products.map(product => `
        <div class="admin-product-item">

            <div>
                <p>
                    <strong>${escapeHTML(product.name)}</strong>
                </p>

                <p>Thương hiệu: ${escapeHTML(product.brand)}</p>
                <p>CPU: ${escapeHTML(product.cpu)}</p>
                <p>RAM: ${escapeHTML(product.ram)}</p>
                <p>Ổ cứng: ${escapeHTML(product.storage)}</p>
                <p>Giá: ${formatMoney(product.price)}</p>
            </div>

            ${
                defaultProducts.some(item =>
                    Number(item.id) === Number(product.id)
                )
                ? "<span>Sản phẩm mặc định</span>"
                : `<button class="delete-btn"
                    onclick="deleteProduct(${Number(product.id)})">
                    Xóa sản phẩm
                  </button>`
            }

        </div>
    `).join("");
}

/* ==========================================
   17. QUẢN LÝ KHÁCH HÀNG
========================================== */

function renderCustomers() {
    const customerList = document.getElementById("customerList");

    if (!customerList) return;

    if (customers.length === 0) {
        customerList.innerHTML = `
            <tr>
                <td colspan="4">Chưa có khách hàng nào.</td>
            </tr>
        `;
        return;
    }

    customerList.innerHTML = customers.map((customer, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${escapeHTML(customer.name)}</td>
            <td>${escapeHTML(customer.phone)}</td>
            <td>${escapeHTML(customer.email)}</td>
        </tr>
    `).join("");
}

/* ==========================================
   18. QUẢN LÝ NHÂN VIÊN
========================================== */

function renderEmployees() {
    const employeeList = document.getElementById("employeeList");

    if (!employeeList) return;

    employeeList.innerHTML = employees.map(employee => `
        <tr>
            <td>${escapeHTML(employee.id)}</td>
            <td>${escapeHTML(employee.name)}</td>
            <td>${escapeHTML(employee.position)}</td>
            <td>${escapeHTML(employee.phone)}</td>
        </tr>
    `).join("");
}

/* ==========================================
   19. THỐNG KÊ
========================================== */

function renderStatistics() {
    const totalProducts =
        document.getElementById("totalProducts");

    const totalInvoices =
        document.getElementById("totalInvoices");

    const totalRevenue =
        document.getElementById("totalRevenue");

    const totalCustomers =
        document.getElementById("totalCustomers");

    if (totalProducts) {
        totalProducts.textContent = products.length;
    }

    if (totalInvoices) {
        totalInvoices.textContent = invoices.length;
    }

    const revenue = invoices.reduce(
        (sum, invoice) =>
            sum + Number(invoice.total || 0),
        0
    );

    if (totalRevenue) {
        totalRevenue.textContent = formatMoney(revenue);
    }

    if (totalCustomers) {
        totalCustomers.textContent = customers.length;
    }
}

/* ==========================================
   20. KHỞI CHẠY WEBSITE
========================================== */

function initializeWebsite() {
    // Nút tài khoản
    document.getElementById("loginBtn")
        .addEventListener("click", openLogin);

    document.getElementById("registerBtn")
        .addEventListener("click", openRegister);

    document.getElementById("logoutBtn")
        .addEventListener("click", logout);

    // Tìm kiếm và sắp xếp
    document.getElementById("searchInput")
        .addEventListener("input", renderProducts);

    document.getElementById("sortPrice")
        .addEventListener("change", renderProducts);

    // Hiển thị dữ liệu
    renderProducts();
    renderCart();
    renderInvoices();
    renderAdminProducts();
    renderCustomers();
    renderEmployees();
    renderStatistics();

    updateCartCount();
    updateLoginUI();

    showSection("home");
}

document.addEventListener(
    "DOMContentLoaded",
    initializeWebsite
);
