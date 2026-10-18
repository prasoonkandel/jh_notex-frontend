const profileButton = document.getElementById("profile-button");
const profileMenu = document.getElementById("profile-menu");
const signOut_btn = document.getElementById("sign-out");
const updateUser_btn = document.getElementById("updateUser");
const deleteAccount_btn = document.getElementById("deleteAccount");
const changePassword_btn = document.getElementById("changePassword");
const user = document.getElementById("user");

if (profileButton && profileMenu) {
  profileButton.addEventListener("click", () => {
    const isOpen = profileButton.getAttribute("aria-expanded") === "true";
    profileButton.setAttribute("aria-expanded", String(!isOpen));
    profileMenu.hidden = isOpen;
  });
}

if (signOut_btn) {
  signOut_btn.addEventListener("click", () => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("username");
    }
    window.location.reload();
  });
}

if (updateUser_btn) {
  updateUser_btn.addEventListener("click", () => {
    window.location.href = "/dashboard/updateAccount/";
  });
}

if (changePassword_btn) {
  changePassword_btn.addEventListener("click", () => {
    window.location.href = "/dashboard/changePassword/";
  });
}

if (deleteAccount_btn) {
  deleteAccount_btn.addEventListener("click", () => {
    window.location.href = "/dashboard/deleteAccount/";
  });
}

document.addEventListener("click", (event) => {
  if (
    !(event.target instanceof Element) ||
    !event.target.closest(".site-nav")
  ) {
    profileButton?.setAttribute("aria-expanded", "false");
    if (profileMenu) {
      profileMenu.hidden = true;
    }
  }
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && profileButton && profileMenu) {
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

    if (user) {
      user.textContent = username;
    }
    localStorage.setItem("username", username);
  } catch (error) {
    alert("The Login has Expired");
    localStorage.removeItem("auth_token");

    if (!window.location.pathname.includes("/login/")) {
      window.location.href = "/login/";
    }
  } finally {
    window.hidePageLoader?.();
  }
});
