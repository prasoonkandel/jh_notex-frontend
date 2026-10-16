const login_btn = document.querySelector("#login-btn");
const cta_btn_all = document.querySelectorAll(".cta-btn");
const logged_in = Boolean(localStorage.getItem("auth_token"));

const currentYear = document.querySelector("#current-year");
const pageLoader = document.querySelector("#page-loader");
const pageLoaderStartedAt = performance.now();

window.addEventListener(
  "load",
  () => {
    const remainingTime = Math.max(0, 500 - (performance.now() - pageLoaderStartedAt));
    window.setTimeout(() => pageLoader?.classList.add("is-hidden"), remainingTime);
  },
  { once: true },
);

if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}

login_btn.textContent = logged_in ? "Dashboard" : "Login";

for (const cta_btn of cta_btn_all) {
  cta_btn.textContent = logged_in ? "Open App" : "Get Started";
}
