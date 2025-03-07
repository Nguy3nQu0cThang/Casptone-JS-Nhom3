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

    let productId = document.getElementById("productId").value; // Lấy ID sản phẩm nếu có

    let newProduct = {
      name: document.getElementById("name").value,
      img: document.getElementById("img").value,
      price: document.getElementById("price").value,
      screen: document.getElementById("screen").value,
      backCamera: document.getElementById("backCamera").value,
      frontCamera: document.getElementById("frontCamera").value,
      type: document.getElementById("type").value,
      desc: document.getElementById("desc").value,
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
      if (productId) {
        // Nếu có ID, thực hiện cập nhật
        await axios.put(API_URL + productId, newProduct);
        alert("Cập nhật sản phẩm thành công!");
        document.getElementById("saveButton").remove(); // Xóa nút cập nhật sau khi xong
      } else {
        // Nếu không có ID, thêm mới sản phẩm
        await axios.post(API_URL, newProduct);
        alert("Thêm sản phẩm thành công!");
      }

      document.getElementById("addProductForm").reset(); // Reset form sau khi xong
      document.getElementById("productId").value = ""; // Xóa ID để tránh cập nhật nhầm
      fetchAdminProducts(); // Cập nhật danh sách sản phẩm
    } catch (error) {
      console.error("Lỗi:", error);
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
  let response = await axios.get(API_URL + id);
  let productEdit = response.data;

  // Điền dữ liệu vào form
  document.getElementById("productId").value = id; // Gán ID sản phẩm
  document.getElementById("name").value = productEdit.name;
  document.getElementById("img").value = productEdit.img;
  document.getElementById("price").value = productEdit.price;
  document.getElementById("screen").value = productEdit.screen;
  document.getElementById("backCamera").value = productEdit.backCamera;
  document.getElementById("frontCamera").value = productEdit.frontCamera;
  document.getElementById("type").value = productEdit.type;
  document.getElementById("desc").value = productEdit.desc;

  // Tạo nút "Ghi chú & Cập nhật" nếu chưa có
  if (!document.getElementById("saveButton")) {
    let saveButton = document.createElement("button");
    saveButton.id = "saveButton";
    saveButton.textContent = "Ghi chú & Cập nhật";
    saveButton.classList.add("btn", "btn-success");
    document.getElementById("addProductForm").appendChild(saveButton);
  }
};


async function capNhatSanPhamAPI(id) {
  try {
    
      let productData = {
          id: id,
          name: document.getElementById("name").value,
          img: document.getElementById("img").value,
          price: document.getElementById("price").value,
          screen: document.getElementById("screen").value,
          backCamera: document.getElementById("backCamera").value,
          frontCamera: document.getElementById("frontCamera").value,
          type: document.getElementById("type").value,
          desc: document.getElementById("desc").value,  
      };

      console.log("Gửi dữ liệu cập nhật:", productData);

      let response = await axios({
          url: API_URL + `${id}`,
          method: "PUT",
          data: productData
      });

      if (response.status === 200) {
          alert("Sản phẩm đã được cập nhật thành công!");
          fetchAdminProducts();
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
