const loginForm = document.getElementById("signUpForm");
const { StorageService, ApiService } = window;

class Validation {
  errors = [];
  check(element) {
    if (element) {
      if (element.value === "") {
        this.errors.push(`${element.name} is missing`);
      }
    }
  }
  isValid() {
    return !!this.errors.length;
  }
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const inputEmail = document.getElementById("inputEmail");
  const inputPassword = document.getElementById("inputPassword");
  const rememberMe = document.getElementById("remember-me");

  const validation = new Validation();
  validation.check(inputEmail);
  validation.check(inputPassword);
  if (validation.isValid()) {
    console.log(validation.errors);
    return;
  }

  const regData = {
    email: inputEmail.value,
    password: inputPassword.value,
  };

  const newUser = await ApiService.signUp(regData);
  navigateToDashboard(newUser.token);
});