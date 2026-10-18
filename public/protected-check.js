(function () {
  const token = localStorage.getItem("auth_token");

  if (!token) {
    if (!window.location.pathname.includes("/login/")) {
      window.location.href = "/login/";
      return;
    }
  }
})();
