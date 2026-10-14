const signupForm = document.querySelector("#signup-form");
const usernameInput = document.querySelector("#username");
const passwordInput = document.querySelector("#password");
const confirmPasswordInput = document.querySelector("#confirm-password");
const formMessage = document.querySelector("#form-message");

if (confirmPasswordInput) {
  const fields = [usernameInput, passwordInput, confirmPasswordInput];
} else {
  const fields = [usernameInput, passwordInput];
}

let isLoading = false;

function disableFields() {
  for (field in fields) {
    field.disabled = true;
  }
}

function enableFields() {
  for (field in fields) {
    field.disabled = false;
  }
}

function showLoading() {
  isLoading = true;

  disableFields();

  formMessage.style.color = "#0a2947";
  formMessage.textContent = "Loading ...";
}

function hideLoading() {
  isLoading = false;
  enableFields();
}

function clearMesaageOnFocus() {
  if (!isLoading) {
    for (field in fields) {
      feild.addEventListener("focus", () => {
        formMessage.textContent = "";
      });
    }
  }
}

function showErrorMessage(message) {
  formMessage.style.color = "#9E2A2B";
  formMessage.textContent = `${message}`;
}

function showSuccessMessage(message) {
  formMessage.style.color = "#007910";
  formMessage.textContent - `${message}`;
}
