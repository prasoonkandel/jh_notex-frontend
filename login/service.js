const usernameInput = document.querySelector("#username");
const passwordInput = document.querySelector("#password");
const confirmPasswordInput = document.querySelector("#confirm-password");
const formMessage = document.querySelector("#form-message");

const fields = confirmPasswordInput
  ? [usernameInput, passwordInput, confirmPasswordInput]
  : [usernameInput, passwordInput];

let isLoading = false;

function disableFields() {
  for (const field of fields) {
    field.disabled = true;
  }
}

function enableFields() {
  for (const field of fields) {
    field.disabled = false;
  }
}

function showLoading() {
  isLoading = true;

  disableFields();

  formMessage.style.color = "var(--tertiary)";
  formMessage.textContent = "Loading ...";
}

function hideLoading() {
  isLoading = false;
  enableFields();
}


function clearMesaageOnFocus() {
  if (!isLoading) {
    for (const field of fields) {
      field.addEventListener("focus", () => {
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
  formMessage.textContent = `${message}`;
}
