(function () {
  if (window.__npnSubscribeBound) return;
  window.__npnSubscribeBound = true;

  document.addEventListener("submit", async function (event) {
    var form = event.target;
    if (!form || !form.classList || !form.classList.contains("npn-form")) {
      return;
    }

    event.preventDefault();

    var button = form.querySelector("button[type='submit']");
    var message = form.querySelector("[data-npn-message]");
    var path = (form.getAttribute("data-proxy-path") || "").trim();
    var locale = form.getAttribute("data-locale") || "en";
    var successText = form.getAttribute("data-msg-success") || "Subscribed";
    var failedText =
      form.getAttribute("data-msg-failed") || "Could not subscribe. Try again.";
    var networkText =
      form.getAttribute("data-msg-network") || "Network error. Try again.";

    function showMessage(text) {
      if (!message) return;
      message.textContent = text;
      message.hidden = false;
    }

    var endpoint;
    try {
      endpoint = new URL(path || "/apps/subscribe", window.location.origin);
      if (endpoint.origin !== window.location.origin) throw new Error("Off-store proxy URL");
      endpoint.searchParams.set("locale", locale);
    } catch {
      console.warn("NX Swift subscription proxy URL is invalid or off-store");
      showMessage(failedText);
      return;
    }

    if (button) button.disabled = true;
    try {
      var response;
      try {
        response = await fetch(endpoint, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: new FormData(form),
        });
      } catch {
        showMessage(networkText);
        return;
      }

      var contentType = response.headers.get("Content-Type") || "";
      var data = contentType.includes("application/json")
        ? await response.json().catch(function () { return null; })
        : null;
      if (!data || typeof data.success !== "boolean") {
        console.warn("NX Swift subscription proxy returned an unexpected response", {
          status: response.status,
          redirected: response.redirected,
          path: endpoint.pathname,
        });
        showMessage(failedText);
        return;
      }
      showMessage(
        typeof data.message === "string" && data.message
          ? data.message
          : response.ok && data.success ? successText : failedText,
      );
    } finally {
      if (button) button.disabled = false;
    }
  });
})();
