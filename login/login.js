const loginForm = document.querySelector("#login-form");
const usernameInput = document.querySelector("#username");
const passwordInput = document.querySelector("#password");
const formMessage = document.querySelector("#form-message");

function showLoading() {
  formMessage.style.color = "#0a2947";
  formMessage.textContent = "Loading...";
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  if (!username || !password) {
    formMessage.style.color = "#9E2A2B";
    formMessage.textContent = "Please enter both username and password.";

    (!username ? usernameInput : passwordInput).focus();
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
    formMessage.style.color = "green";
    formMessage.textContent = result.message || "Login successful!";
  } catch (error) {
    formMessage.style.color = "#9E2A2B";
    formMessage.textContent = error.message;
  }
});
