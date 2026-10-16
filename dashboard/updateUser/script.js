const username = localStorage.getItem("username");
const usernameInput = document.querySelector("#username");
document.addEventListener("DOMContentLoaded", () => {
  usernameInput.value = username;
});
