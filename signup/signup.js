const signupForm = document.querySelector("#signup-form");
const usernameInput = document.querySelector("#username");
const passwordInput = document.querySelector("#password");
const confirmPasswordInput = document.querySelector("#confirm-password");
const formMessage = document.querySelector("#form-message");
const fields = [usernameInput, passwordInput, confirmPasswordInput];

function setFieldError(input, message) {
    const error = document.querySelector(`#${input.id}-error`);
    input.setAttribute("aria-invalid", String(Boolean(message)));
    error.textContent = message;
}

for (const input of fields) {
    input.addEventListener("input", () => {
        setFieldError(input, "");
        formMessage.textContent = "";

        if (input === passwordInput && confirmPasswordInput.value !== "") {
            setFieldError(
                confirmPasswordInput,
                confirmPasswordInput.value === passwordInput.value ? "" : "Passwords do not match."
            );
        }
    });
}

signupForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const usernameMissing = usernameInput.value.trim() === "";
    const passwordMissing = passwordInput.value === "";
    const confirmationMissing = confirmPasswordInput.value === "";
    const passwordsMismatch = !passwordMissing
        && !confirmationMissing
        && passwordInput.value !== confirmPasswordInput.value;

    setFieldError(usernameInput, usernameMissing ? "Enter a username." : "");
    setFieldError(passwordInput, passwordMissing ? "Enter a password." : "");
    setFieldError(
        confirmPasswordInput,
        confirmationMissing
            ? "Confirm your password."
            : passwordsMismatch
                ? "Passwords do not match."
                : ""
    );
    formMessage.textContent = "";

    if (usernameMissing || passwordMissing || confirmationMissing || passwordsMismatch) {
        const firstInvalidField = fields.find((input) => input.getAttribute("aria-invalid") === "true");
        firstInvalidField.focus();
        return;
    }

    formMessage.textContent = "Account creation is unavailable because registration is not connected yet.";
});
