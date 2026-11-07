// =====================================================
// app.js - Các hàm dùng chung cho phần Bán hàng & Hóa đơn
// Dữ liệu lưu trong localStorage của trình duyệt:
//   "products" : danh sách sản phẩm   (do phần Quản lý sản phẩm cung cấp)
//   "cart"     : giỏ hàng { idSanPham: soLuong }
//   "orders"   : danh sách hóa đơn
// =====================================================

// Sản phẩm mẫu, chỉ dùng khi chưa có dữ liệu "products".
// Khi ghép bài, phần Quản lý sản phẩm chỉ cần lưu vào localStorage "products"
// với các trường: id, name, brand, price, stock.
const DEFAULT_PRODUCTS = [
    { id: 1,  name: 'Dell Inspiron 15 3520',   brand: 'Dell',   price: 12990000, stock: 10 },
    { id: 2,  name: 'Dell XPS 13 9315',        brand: 'Dell',   price: 28990000, stock: 5 },
    { id: 3,  name: 'HP Pavilion 14-dv2073TU', brand: 'HP',     price: 14490000, stock: 8 },
    { id: 4,  name: 'HP Victus 16',            brand: 'HP',     price: 21990000, stock: 6 },
    { id: 5,  name: 'Asus Vivobook 15 X1504',  brand: 'Asus',   price: 11490000, stock: 12 },
    { id: 6,  name: 'Asus TUF Gaming F15',     brand: 'Asus',   price: 22490000, stock: 7 },
    { id: 7,  name: 'Lenovo IdeaPad Slim 3',   brand: 'Lenovo', price: 13290000, stock: 9 },
    { id: 8,  name: 'Lenovo Legion 5',         brand: 'Lenovo', price: 31990000, stock: 4 },
    { id: 9,  name: 'MacBook Air M2 13"',      brand: 'Apple',  price: 24990000, stock: 5 },
    { id: 10, name: 'Acer Aspire 5',           brand: 'Acer',   price: 12490000, stock: 10 }
];

// ---------- Đọc / ghi localStorage ----------
function getData(key, fallback) {
    try {
        const text = localStorage.getItem(key);
        return text ? JSON.parse(text) : fallback;
    } catch (err) {
        return fallback;
    }
}

function setData(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

// ---------- Sản phẩm ----------
function getProducts() {
    let products = getData('products', null);
    if (!products) {
        products = DEFAULT_PRODUCTS;
        setData('products', products);
    }
    return products;
}

function findProduct(id) {
    return getProducts().find(p => p.id === Number(id));
}

// ---------- Giỏ hàng ----------
function getCart() {
    return getData('cart', {});
}

function saveCart(cart) {
    setData('cart', cart);
}

// Danh sách dòng trong giỏ, kèm thành tiền = đơn giá x số lượng
function getCartItems() {
    const cart = getCart();
    const items = [];
    for (const id in cart) {
        const p = findProduct(id);
        if (p) {
            items.push({ id: p.id, name: p.name, price: p.price, stock: p.stock,
                         qty: cart[id], money: p.price * cart[id] });
        }
    }
    return items;
}

function cartTotal() {
    return getCartItems().reduce((sum, it) => sum + it.money, 0);
}

// ---------- Hóa đơn ----------
function getOrders() {
    return getData('orders', []);
}

function saveOrders(orders) {
    setData('orders', orders);
}

function findOrder(id) {
    return getOrders().find(o => o.id === Number(id));
}

// ---------- Hàm tiện ích ----------
// 12990000 -> "12.990.000 đ"
function formatPrice(number) {
    return Number(number).toLocaleString('vi-VN') + ' đ';
}

// 7 -> "HD007"
function invoiceCode(id) {
    return 'HD' + String(id).padStart(3, '0');
}

// Chống XSS: dùng khi đưa dữ liệu người dùng nhập vào innerHTML
function escapeHtml(text) {
    return String(text ?? '')
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function formatDate(isoString) {
    const d = new Date(isoString);
    const pad = n => String(n).padStart(2, '0');
    return pad(d.getDate()) + '/' + pad(d.getMonth() + 1) + '/' + d.getFullYear() +
           ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
}