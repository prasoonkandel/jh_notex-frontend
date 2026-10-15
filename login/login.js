const loginForm = document.querySelector("#login-form");

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
      throw new Error(`Login failed due to an unexpected error.`);
    }
    showSuccessMessage("Login successful!");
    hideLoading();
    localStorage.setItem("auth_token", `${result.access_token}`);
  } catch (error) {
    showErrorMessage(error.message);
    hideLoading();
  }
});
