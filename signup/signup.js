const signupForm = document.querySelector("#signup-form");
const usernameInput = document.querySelector("#username");
const passwordInput = document.querySelector("#password");
const confirmPasswordInput = document.querySelector("#confirm-password");
const formMessage = document.querySelector("#form-message");
const fields = [usernameInput, passwordInput, confirmPasswordInput];

let isLoading = false;

function showLoading() {
  isLoading = true;

  usernameInput.disabled = true;
  passwordInput.disabled = true;
  confirmPasswordInput.disabled = true;

  formMessage.style.color = "#0a2947";
  formMessage.textContent = "Loading ...";
}

function hideLoading() {
  isLoading = false;
  usernameInput.disabled = false;
  passwordInput.disabled = false;
  confirmPasswordInput.disabled = false;
}
