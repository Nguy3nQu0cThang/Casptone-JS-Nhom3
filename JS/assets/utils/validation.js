export function kiemTraRong(value, selectorErr, id) {
    //abc .trim()=>abc
    if (value.trim() === "") {
      document.getElementById(
        selectorErr
      ).innerHTML = `${id} không được bỏ trống`;
      return false;
    }
    document.getElementById(selectorErr).innerHTML = "";
    return true;
  }