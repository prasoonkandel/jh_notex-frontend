const signupForm = document.querySelector("#signup-form");

clearMesaageOnFocus();

signupForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const username = usernameInput.value.trim();
  const password = passwordInput.value;
  let confirmPassword = confirmPasswordInput.value;

  if (!username || !password.trim()) {
    if (username) {
      passwordInput.focus();
    } else {
      usernameInput.focus();
    }
    showErrorMessage("Please enter both username and password.");
    return;
  }

  if (confirmPassword != password) {
    confirmPasswordInput.focus();
    showErrorMessage("The password and confirmation password do not match.");

    return;
  }

  showLoading();

  const data = { username: username, password: password };
  const url = API_ENDPOINTS.register;

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
      throw new Error(
        result.detail || "Registration Failed due to an unexpected error",
      );
    }

    hideLoading();
    showSuccessMessage("Account Registered Succeesfully!");

    localStorage.setItem("auth_token", `${result.access_token}`);

    window.location.replace("/dashboard/createNote/");
  } catch (error) {
    showErrorMessage(error.message);
    hideLoading();
  }
});
