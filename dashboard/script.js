const profileButton = document.getElementById("profile-button");
const profileMenu = document.getElementById("profile-menu");
const signOut_btn = document.getElementById("sign-out");
const updateUser_btn = document.getElementById("updateUser");
const changePassword_btn = document.getElementById("changePassword");
const user = document.getElementById("user");

profileButton.addEventListener("click", () => {
  const isOpen = profileButton.getAttribute("aria-expanded") === "true";
  profileButton.setAttribute("aria-expanded", String(!isOpen));
  profileMenu.hidden = isOpen;
});

signOut_btn.addEventListener("click", (event) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("username");
  }
  window.location.reload();
});

updateUser_btn.addEventListener("click", (event) => {
  window.location.href = "/dashboard/updateUser/";
});

changePassword_btn.addEventListener("click", (event) => {
  window.location.href = "/dashboard/changePassword/";
});
document.addEventListener("click", (event) => {
  if (
    !(event.target instanceof Element) ||
    !event.target.closest(".site-nav")
  ) {
    profileButton.setAttribute("aria-expanded", "false");
    profileMenu.hidden = true;
  }
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    profileButton.setAttribute("aria-expanded", "false");
    profileMenu.hidden = true;
    profileButton.focus();
  }
});

document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("auth_token");
  const url = API_ENDPOINTS.user.me;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    const username = data.username;
    const id = data.id;

    user.textContent = username;
    localStorage.setItem("username", username);
    window.hidePageLoader();
  } catch (error) {
    window.hidePageLoader();
    alert("The Login has Expired");
    localStorage.removeItem("auth_token");

    if (!window.location.pathname.includes("/login/")) {
      window.location.href = "/login/";
    }
  }
});
