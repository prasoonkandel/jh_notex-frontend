const loginForm = document.querySelector("#login-form");
const usernameInput = document.querySelector("#username");
const passwordInput = document.querySelector("#password");
const formMessage = document.querySelector("#form-message");

function setFieldError(input, message) {
    const error = document.querySelector(`#${input.id}-error`);
    input.setAttribute("aria-invalid", String(Boolean(message)));
    error.textContent = message;
}

for (const input of [usernameInput, passwordInput]) {
    input.addEventListener("input", () => {
        setFieldError(input, "");
        formMessage.textContent = "";
    });
}

loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const usernameMissing = usernameInput.value.trim() === "";
    const passwordMissing = passwordInput.value === "";

    setFieldError(usernameInput, usernameMissing ? "Enter your username." : "");
    setFieldError(passwordInput, passwordMissing ? "Enter your password." : "");
    formMessage.textContent = "";

    if (usernameMissing || passwordMissing) {
        (usernameMissing ? usernameInput : passwordInput).focus();
        return;
    }

    formMessage.textContent = "Sign-in is unavailable because authentication is not connected yet.";
});
