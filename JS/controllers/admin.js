import { kiemTraRong } from "../assets/utils/validation.js";

const API_URL = "https://67b733482bddacfb270e154a.mockapi.io/Product/";

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
      <td>
              <button class="btn btn-primary" onclick="capNhatSanPham('${product.id}')">Chỉnh sửa</button>
              <button class="btn btn-danger" onclick="xoaSanPham('${product.id}')">Xóa</button>
          </td>
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
      img: document.getElementById("productImage").value,
      price: document.getElementById("productPrice").value,
      screen: document.getElementById("productScreen").value,
      backCamera: document.getElementById("productBackCamera").value,
      frontCamera: document.getElementById("productFrontCamera").value,
      type: document.getElementById("productType").value,
      desc: document.getElementById("productDesc").value,
    };

    let { name, price, screen, backCamera, frontCamera, img, type, desc } =
      newProduct;
    let valid = true;
    valid &=
      kiemTraRong(name, "err_required_productName", "Tên") &
      kiemTraRong(price, "err_required_productPrice", "Giá tiền") &
      kiemTraRong(screen, "err_required_productScreen", "Màn hình") &
      kiemTraRong(backCamera, "err_required_productBackCamera", "Camera sau") &
      kiemTraRong(
        frontCamera,
        "err_required_productFrontCamera",
        "Camera trước"
      ) &
      kiemTraRong(img, "err_required_productImage", "Ảnh") &
      kiemTraRong(type, "err_required_productType", "Loại");

    if (!valid) return;
    try {
      await axios.post(API_URL, newProduct);
      alert("Thêm sản phẩm thành công!");
      fetchAdminProducts(); // Cập nhật danh sách sản phẩm
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm:", error);
    }
  });

//Xóa sản phẩm
window.xoaSanPham = async function (id) {
  let response = await axios({
    url: API_URL + `${id}`,
    method: "DELETE",
  });
  fetchAdminProducts();
};

//Cập nhật sản phẩm
window.capNhatSanPham = async function (id) {
  let response = await axios({
    url: API_URL + `${id}`,
    method: "GET",
  });
  console.log(response.data);
  let productEdit = response.data;
  // let arrInput = document.querySelectorAll("#addProductForm .form-control");
  let fieldMapping = {
    productName: "name",
    productPrice: "price",
    productImage: "img",
    productScreen: "screen",
    productBackCamera: "backCamera",
    productFrontCamera: "frontCamera",
    productType: "type",
    productDesc: "desc",
  };
  for (let inputId in fieldMapping) {
    let fieldName = fieldMapping[inputId];
    let inputElement = document.getElementById(inputId);
    if (inputElement) {
      console.log(`Gán giá trị cho ${inputId}:`, productEdit[fieldName]); // Debug
      inputElement.value = productEdit[fieldName] ?? "";
    }
  }

  let saveButton = document.getElementById("saveButton");
  if (!saveButton) {
    saveButton = document.createElement("button");
    saveButton.id = "saveButton";
    saveButton.textContent = "Ghi chú & Cập nhật";
    saveButton.classList.add("btn", "btn-success");
    saveButton.onclick = function () {
      capNhatSanPhamAPI(productId);
    };

    document.getElementById("addProductForm").appendChild(saveButton);
  }
};

async function capNhatSanPhamAPI(productId) {
  try {
      let productData = {
          id: productId,
          name: document.getElementById("productName").value,
          price: document.getElementById("productPrice").value,
          image: document.getElementById("productImage").value,
          screen: document.getElementById("productScreen").value,
          backCamera: document.getElementById("productBackCamera").value,
          frontCamera: document.getElementById("productFrontCamera").value,
          desc: document.getElementById("productDesc").value,
          type: document.getElementById("productType").value
      };

      console.log("Gửi dữ liệu cập nhật:", productData);

      let response = await axios({
          url: `https://your-api.com/products/${productId}`,
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          data: productData
      });

      if (response.status === 200) {
          alert("Sản phẩm đã được cập nhật thành công!");
      } else {
          throw new Error("Cập nhật thất bại!");
      }
  } catch (error) {
      console.error("Lỗi khi cập nhật sản phẩm:", error);
      alert("Không thể cập nhật sản phẩm. Vui lòng thử lại!");
  }
}


// Hàm tìm kiếm sản phẩm
document.getElementById("searchInput").addEventListener("input", function () {
  let searchValue = this.value.toLowerCase().trim();
  let productRows = document.querySelectorAll("#adminProductList tr");

  productRows.forEach((row) => {
    let productName = row
      .querySelector("td:nth-child(3)")
      ?.textContent.toLowerCase();
    if (productName.includes(searchValue)) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });
});

// Hàm sắp xếp sản phẩm theo giá
document.getElementById("sortPriceBtn").addEventListener("click", function () {
  let productRows = Array.from(
    document.querySelectorAll("#adminProductList tr")
  );
  let ascending = this.getAttribute("data-asc") === "true";

  productRows.sort((a, b) => {
    let priceA =
      parseFloat(a.querySelector("td:nth-child(4)")?.textContent) || 0;
    let priceB =
      parseFloat(b.querySelector("td:nth-child(4)")?.textContent) || 0;
    return ascending ? priceA - priceB : priceB - priceA;
  });

  let tbody = document.getElementById("adminProductList");
  tbody.innerHTML = "";
  productRows.forEach((row) => tbody.appendChild(row));

  this.setAttribute("data-asc", !ascending);
  this.textContent = ascending
    ? "Sắp xếp: Giá giảm dần"
    : "Sắp xếp: Giá tăng dần";
});

// Gọi API khi trang load
fetchAdminProducts();
