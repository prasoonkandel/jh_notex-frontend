const usernameInput = document.querySelector("#username");
const update_btn = document.querySelector("#update");
const updateForm = document.querySelector("#update-form");
let currentUsername = localStorage.getItem("username") || "";

document.addEventListener("DOMContentLoaded", () => {
  currentUsername = localStorage.getItem("username") || "";
  usernameInput.value = currentUsername;
  update_btn.disabled = true;
});

usernameInput.addEventListener("input", () => {
  update_btn.disabled = usernameInput.value.trim() === currentUsername;
  update_btn.disabled = usernameInput.value.trim() === "";
});
