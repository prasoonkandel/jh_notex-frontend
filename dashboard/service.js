const formMessage = document.querySelector("#form-message");
const button = document.querySelector("button");
const form = document.querySelector("form");
const fields = [];

for (const field of form.querySelectorAll("input, textarea, select")) {
  fields.push(field);
}

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
  button.disabled = true;
  disableFields();

  formMessage.style.color = "var(--tertiary)";
  formMessage.textContent = "Loading ...";
}

function hideLoading() {
  isLoading = false;
  enableFields();
  button.disabled = false;
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
