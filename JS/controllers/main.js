//link API
const API_URL = "https://67b733482bddacfb270e154a.mockapi.io/Product";

// Danh sách sản phẩm gốc
let allProducts = [];

//Giỏ hàng (lưu sản phẩm khách hàng thêm vào giỏ)
let cart = JSON.parse(localStorage.getItem("cart")) || [];
if (!Array.isArray(cart)) {
  cart = [];
}

// Gọi API lấy sản phẩm và hiển thị giỏ hàng khi trang tải
(async function () {
  await fetchProducts(); // Đợi API trả dữ liệu
  renderCart(); // Sau đó hiển thị giỏ hàng
})();

//Gọi API lấy danh sách sản phẩm
async function fetchProducts() {
  try {
    let response = await axios({
      url: API_URL,
      method: "GET",
      responseType: "json",
    });

    console.log("Dữ liệu từ API:", response.data);

    allProducts = response.data; // Lưu dữ liệu gốc vào danh sách sản phẩm
    renderProducts(allProducts); // Hiển thị tất cả sản phẩm
  } catch (error) {
    console.error("Lỗi khi lấy sản phẩm:", error);
  }
}

// Hiển thị danh sách sản phẩm
function renderProducts(products) {
  console.log("Danh sách sản phẩm nhận được:", products);
  let productContainer = document.getElementById("product-list");
  productContainer.innerHTML = ""; // Xóa dữ liệu cũ

  products.forEach((product) => {
    let productDiv = document.createElement("div");
    productDiv.classList.add("product-item");
    productDiv.innerHTML = `
            <img src="${product.img}">
            <h3>${product.name}</h3>
            <p>Giá: ${product.price}</p>
            <button onclick="addToCart(${product.id})">Thêm vào giỏ</button>
        `;
    productContainer.appendChild(productDiv);
  });
}

//Lọc danh sách sản phẩm
function filterProducts() {
  let filterValue = document.getElementById("filter").value; // Lấy giá trị từ dropdown

  let filteredProducts = allProducts.filter(
    (product) =>
      filterValue === "all" ||
      product.type.toLowerCase() === filterValue.toLowerCase()
  );

  renderProducts(filteredProducts); // Hiển thị danh sách đã lọc
}

// Hiển thị giỏ hàng trên giao diện
function renderCart() {
  let cartTable = document.getElementById("cart"); // Lấy tbody của bảng giỏ hàng
  let cartTotal = document.getElementById("total-price"); // Lấy thẻ hiển thị tổng tiền
  cartTable.innerHTML = ""; // Xóa nội dung cũ

  if (cart.length === 0) {
    cartTable.innerHTML = `<tr><td colspan="5">Giỏ hàng trống.</td></tr>`;
    cartTotal.innerText = "0";
    return;
  }

  let total = 0; // Biến tính tổng tiền

  cart.forEach((item, index) => {
    let itemTotal = item.quantity * item.price;
    total += itemTotal;

    let row = document.createElement("tr"); // Tạo một dòng mới
    row.innerHTML = `
      <td>${index + 1}</td>
      <td><img src="${item.img}" width="50"></td>
      <td>${item.name}</td>
      <td>${item.price}</td>
      <td>
        <button onclick="changeQuantity(${item.id}, -1)">-</button>
        ${item.quantity}
        <button onclick="changeQuantity(${item.id}, 1)">+</button>
      </td>
      <td>${itemTotal}</td>
      <td><button onclick="removeFromCart(${item.id})">Xóa</button></td>
    `;
    cartTable.appendChild(row); // Thêm dòng vào bảng
  });

  // Hiển thị tổng tiền
  cartTotal.innerText = `${total}`;
}

//Sự kiện thay đổi số lượng sản phẩm trong giỏ hàng
function changeQuantity(productId, change) {
  let cartItem = cart.find((item) => item.id == productId);

  if (!cartItem) return;

  cartItem.quantity += change;

  // Nếu số lượng <= 0, xóa khỏi giỏ hàng
  if (cartItem.quantity <= 0) {
    cart = cart.filter((item) => item.id != productId);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

//Loại bỏ sản phẩm ra khỏi giỏ hàng
function removeFromCart(productId) {
  cart = cart.filter((item) => item.id != productId);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

//Thêm sản phẩm vào giỏ hàng
function addToCart(productId) {
  // Tìm sản phẩm trong danh sách `allProducts`
  let product = allProducts.find((item) => item.id == productId);

  if (!product) {
    console.error("Không tìm thấy sản phẩm!");
    return;
  }

  // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
  let cartItemCheck = cart.findIndex((item) => item.id == productId);

  if (cartItemCheck !== -1) {
    // Nếu có, tăng số lượng lên
    cart[cartItemCheck].quantity += 1;
  } else {
    // Nếu chưa có, thêm mới vào giỏ hàng
    let cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      img: product.img,
      quantity: 1,
    };
    cart.push(cartItem);
  }

  // Lưu giỏ hàng vào localStorage
  localStorage.setItem("cart", JSON.stringify(cart));

  // Hiển thị lại giỏ hàng
  renderCart();

  console.log("Giỏ hàng hiện tại:", cart);
}

// Hàm xử lý khi nhấn nút Thanh toán
function checkout() {
  if (cart.length === 0) {
    alert("Giỏ hàng trống, không thể thanh toán!");
    return;
  }

  // Xóa toàn bộ giỏ hàng
  cart = [];

  // Cập nhật localStorage
  localStorage.setItem("cart", JSON.stringify(cart));

  // Hiển thị lại giỏ hàng
  renderCart();

  // Thông báo cho người dùng
  alert("Thanh toán thành công!");
}
