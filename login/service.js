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

usernameInput.addEventListener("focus", () => {
  if (!isLoading) {
    formMessage.textContent = "";
  }
});

passwordInput.addEventListener("focus", () => {
  if (!isLoading) {
    formMessage.textContent = "";
  }
});
