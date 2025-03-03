const API_URL = "https://67b733482bddacfb270e154a.mockapi.io/Product";

// Lấy danh sách sản phẩm
async function fetchAdminProducts() {
  try {
    let response = await axios.get(API_URL);
    renderAdminProducts(response.data);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách sản phẩm:", error);
  }
}

// Hiển thị danh sách sản phẩm
function renderAdminProducts(products) {
  let productList = document.getElementById("adminProductList");
  productList.innerHTML = "";

  products.forEach((product) => {
    let row = document.createElement("tr");
    row.innerHTML = `
      <td>${product.id}</td>
      <td><img src="${product.img}" width="50"></td>
      <td>${product.name}</td>
      <td>${product.price}</td>
      <td>${product.screen}</td>
      <td>${product.backCamera}</td>
      <td>${product.frontCamera}</td>
      <td>${product.type}</td>
      <td>${product.desc}</td>
    `;
    productList.appendChild(row);
  });
}

// Thêm sản phẩm mới
document
  .getElementById("addProductForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    let newProduct = {
      name: document.getElementById("productName").value,
      price: document.getElementById("productPrice").value,
      screen: document.getElementById("productScreen").value,
      backCamera: document.getElementById("productBackCamera").value,
      frontCamera: document.getElementById("productFrontCamera").value,
      img: document.getElementById("productImage").value,
      type: document.getElementById("productType").value,
      desc: document.getElementById("productDesc").value,
    };

    try {
      await axios.post(API_URL, newProduct);
      alert("Thêm sản phẩm thành công!");
      fetchAdminProducts(); // Cập nhật danh sách sản phẩm
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm:", error);
    }
  });

// Gọi API khi trang load
fetchAdminProducts();
