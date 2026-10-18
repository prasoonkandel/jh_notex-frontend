(function () {
  const token = localStorage.getItem("auth_token");

  if (token) {
    if (!window.location.pathname.includes("/dashboard/")) {
      window.location.href = "/dashboard/";
    }
  }
})();
