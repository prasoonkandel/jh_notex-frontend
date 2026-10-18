const pageLoader = document.getElementById("page-loader");
const pageLoaderStartedAt = performance.now();

let pageLoaderHidden = false;

window.hidePageLoader = () => {
  if (pageLoaderHidden || !pageLoader) {
    return;
  }

  pageLoaderHidden = true;
  const remainingTime = Math.max(
    0,
    500 - (performance.now() - pageLoaderStartedAt),
  );

  window.setTimeout(
    () => pageLoader?.classList.add("is-hidden"),
    remainingTime,
  );
};

window.addEventListener(
  "load",
  () => {
    if (!pageLoader?.hasAttribute("data-manual")) {
      window.hidePageLoader();
    }
  },
  { once: true },
);
