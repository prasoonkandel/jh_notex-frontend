const login_btn = document.querySelector("#login-btn");
const cta_btn_all = document.querySelectorAll(".cta-btn");
const logged_in = Boolean(localStorage.getItem("auth_token"));

document.addEventListener("DOMContentLoaded", () => {
  const currentYear = document.querySelector("#current-year");

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  login_btn.textContent = logged_in ? "Dashboard" : "Login";

  for (const cta_btn of cta_btn_all) {
    cta_btn.textContent = logged_in ? "Open App" : "Get Started";
  }
});
