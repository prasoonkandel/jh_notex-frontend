const noteForm = document.querySelector("#note-form");
const titleInput = document.querySelector("#title");
const createNoteButton = document.querySelector("#create-note");

function updateButtonState() {
  createNoteButton.disabled = titleInput.value.trim() === "";
}

titleInput.addEventListener("input", updateButtonState);
updateButtonState();

noteForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const token = localStorage.getItem("auth_token");

  if (!token) {
    showErrorMessage("Your session has expired. Please log in again.");
    window.location.href = "/login/";
    return;
  }

  showLoading();

  try {
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
    const response = await fetch(API_ENDPOINTS.notes, {
      method: "POST",
      headers,
      body: JSON.stringify({
        title: titleInput.value.trim(),
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.detail || "Unable to create note.");
    }

    showSuccessMessage(result.message || "Note created successfully!");
    hideLoading();

    setTimeout(() => {
      window.location.replace("/dashboard/");
    }, 1200);
  } catch (error) {
    showErrorMessage(error.message);
    hideLoading();
  }
});
