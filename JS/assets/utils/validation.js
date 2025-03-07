export function kiemTraRong(value, selectorErr, id) {
  if (!value || typeof value !== "string") {
    console.warn(`Lỗi: Giá trị của ${id} không hợp lệ (undefined hoặc null)`);
    document.getElementById(
      selectorErr
    ).innerHTML = `${id} không được bỏ trống`;
    return false;
  }

  if (value.trim() === "") {
    document.getElementById(
      selectorErr
    ).innerHTML = `${id} không được bỏ trống`;
    return false;
  }

  document.getElementById(selectorErr).innerHTML = "";
  return true;
}
