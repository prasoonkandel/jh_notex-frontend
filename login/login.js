const loginForm = document.querySelector("#login-form");
const usernameInput = document.querySelector("#username");
const passwordInput = document.querySelector("#password");
const formMessage = document.querySelector("#form-message");

clearMesaageOnFocus();

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  if (!username || !password) {
    showErrorMessage("Please enter both username and password.");

    if (username) {
      passwordInput.focus();
    } else {
      usernameInput.focus();
    }
    return;
  }

  showLoading();

  const data = { username, password };
  const url = API_ENDPOINTS.login;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.detail || `Login failed: ${response}`);
    }
    hideLoading();
    showSuccessMessage(result.message || "Login successful!");
  } catch (error) {
    hideLoading();
    showErrorMessage(error.message);
  }
});
