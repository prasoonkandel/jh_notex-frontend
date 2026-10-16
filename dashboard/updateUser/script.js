const username = localStorage.getItem("username");
const usernameInput = document.querySelector("#username");
const update_btn = document.querySelector("#update");

document.addEventListener("DOMContentLoaded", () => {
  usernameInput.value = username;
  update_btn.disabled = true;
});

usernameInput.addEventListener("input", () => {
  update_btn.disabled = usernameInput.value.trim() == username ? true : false;
});
