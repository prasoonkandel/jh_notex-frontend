const profileButton = document.getElementById("profile-button");
const profileMenu = document.getElementById("profile-menu");
const user = document.getElementById("user");
const pageLoaderStartedAt = performance.now();

profileButton.addEventListener("click", () => {
  const isOpen = profileButton.getAttribute("aria-expanded") === "true";
  profileButton.setAttribute("aria-expanded", String(!isOpen));
  profileMenu.hidden = isOpen;
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
    const pageLoader = document.getElementById("page-loader");
    const remainingTime = Math.max(
      0,
      500 - (performance.now() - pageLoaderStartedAt),
    );
    window.setTimeout(
      () => pageLoader?.classList.add("is-hidden"),
      remainingTime,
    );
  } catch (error) {
    alert("The Login has Expired");
    localStorage.removeItem("auth_token");

    if (!window.location.pathname.includes("/login/")) {
      window.location.href = "/login/";
    }
  }
});
