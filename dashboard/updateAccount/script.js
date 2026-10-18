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
  new_username = usernameInput.value.trim();
  data = {
    new_username: new_username,
  };
  url = API_ENDPOINTS.user.me;
  token = localStorage.getItem("auth_token");
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

    result = await response.json();

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
