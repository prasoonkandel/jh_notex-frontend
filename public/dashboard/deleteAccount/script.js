const delete_btn = document.querySelector("#delete");
const deleteForm = document.querySelector("#delete-form");

const passwordInput = document.querySelector("#password");

document.addEventListener("DOMContentLoaded", () => {
  delete_btn.disabled = true;
});

passwordInput.addEventListener("input", () => {
  delete_btn.disabled = passwordInput.value.trim() === "";
});

deleteForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const password = passwordInput.value;
  const token = localStorage.getItem("auth_token");

  if (!token) {
    showErrorMessage("Your session has expired. Please log in again.");
    window.location.href = "/login/";
    return;
  }

  data = {
    password: password,
  };
  url = API_ENDPOINTS.user.me;

  showLoading();

  try {
    const response = await fetch(url, {
      method: "DELETE",
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

    showSuccessMessage(result.message || "User deleted Succesfully!");
    localStorage.removeItem("auth_token");
    localStorage.removeItem("username");
    hideLoading();
    setTimeout(() => {
      window.location.replace("/dashboard/");
    }, 2000);
  } catch (error) {
    showErrorMessage(error.message);
    hideLoading();
  }
});
