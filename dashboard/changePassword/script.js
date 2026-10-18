const update_btn = document.querySelector("#update");
const updateForm = document.querySelector("#update-form");
const oldPasswordInput = document.querySelector("#old_password");
const newPasswordInput = document.querySelector("#new_password");

document.addEventListener("DOMContentLoaded", () => {
  update_btn.disabled = true;
});
oldPasswordInput.addEventListener("input", () => {
  if (
    oldPasswordInput.value.trim() === "" ||
    newPasswordInput.value.trim() === ""
  ) {
    update_btn.disabled = true;
  } else {
    update_btn.disabled = false;
  }
});
newPasswordInput.addEventListener("input", () => {
  if (
    oldPasswordInput.value.trim() === "" ||
    newPasswordInput.value.trim() === ""
  ) {
    update_btn.disabled = true;
  } else {
    update_btn.disabled = false;
  }
});

updateForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const oldPassword = oldPasswordInput.value;
  const newPassword = newPasswordInput.value;
  const token = localStorage.getItem("auth_token");

  if (!token) {
    showErrorMessage("Your session has expired. Please log in again.");
    window.location.href = "/login/";
    return;
  }

  data = {
    old_password: old_password,
    new_password: new_password,
  };
  url = API_ENDPOINTS.user.password;

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

    showSuccessMessage(result.message || "Password Changed Succesfully!");
    hideLoading();
    window.location.href = "/dashboard/";
  } catch (error) {
    showErrorMessage(error.message);
    hideLoading();
  }
});
