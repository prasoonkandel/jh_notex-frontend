const usernameInput = document.querySelector("#username");
const update_btn = document.querySelector("#update");
const updateForm = document.querySelector("#update-form");
let currentUsername = localStorage.getItem("username") || "";

document.addEventListener("DOMContentLoaded", () => {
  currentUsername = localStorage.getItem("username") || "";
  usernameInput.value = currentUsername;
  update_btn.disabled = true;
});

usernameInput.addEventListener("input", () => {
  if (
    usernameInput.value.trim() === currentUsername ||
    usernameInput.value.trim() === ""
  ) {
    update_btn.disabled = true;
  } else {
    update_btn.disabled = false;
  }
});

updateForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const new_username = usernameInput.value.trim();
  const data = {
    new_username: new_username,
  };
  const url = API_ENDPOINTS.user.me;
  const token = localStorage.getItem("auth_token");

  if (!token) {
    showErrorMessage("Your session has expired. Please log in again.");
    window.location.href = "/login/";
    return;
  }

  showLoading();

  try {
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.detail || "Unexpected Error Occured");
    }

    showSuccessMessage(result.message || "Username Updated Succesfully!");
    hideLoading();
    setTimeout(() => {
      window.location.replace("/dashboard/");
    }, 2000);
  } catch (error) {
    showErrorMessage(error.message);
    hideLoading();
  }
});
