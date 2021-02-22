const loginForm = document.getElementById("loginForm");
const langSection = document.getElementById("langSection");

const { StorageService, ApiService, LangService } = window;
const userToken = StorageService.read(window.USER_TOKEN_KEY);

// translated
const formTitle = document.querySelector(".formTitle");
formTitle.textContent = "ACCOUNT LOGIN";
const inputEmailLabel = document.querySelector('label[for="inputEmail"]');

// const TRANSLATION = {
//   GE: {
//     formTitle: "რეგისტრაცია/ავტორიზაციის აპლიკაცია",
//     emailLabelText: "ელ.ფოსტა",
//   },
//   EN: {
//     formTitle: "ReqRes.In Application",
//     emailLabelText: "Email address",
//   },
// };

/**
 * 
 * 
 * {
    "email": "eve.holt@reqres.in",
    "password": "cityslicka"
}
 */
if (userToken) {
  navigateToDashboard(userToken);
}

const generateLangButtons = (lang) => {
  const div = document.createElement("div");
  div.className = "col-auto";

  const button = document.createElement("button");
  button.className = "btn btn-info";
  button.dataset.lang = lang;
  button.textContent = lang;

  div.appendChild(button);

  return div;
};

// const translatePage = (lang) => {
//   formTitle.textContent = TRANSLATION[lang].formTitle;
//   inputEmailLabel.textContent = TRANSLATION[lang].emailLabelText;
// };

const onSubmit = async (event) => {
  event.preventDefault();
  const inputEmail = document.getElementById("inputEmail");
  const inputPassword = document.getElementById("inputPassword");
  const rememberMe = document.getElementById("remember-me");

  const errors = [];

  if (inputEmail.value === "") {
    errors.push("email is missing");
  }
  if (inputPassword.value === "") {
    errors.push("password is missing");
  }

  if (errors.length) {
    console.error(errors);
    return;
  }

  const loginData = {
    email: inputEmail.value,
    password: inputPassword.value,
  };

  const result = await ApiService.login(loginData);
  if (result && result.token) {
    navigateToDashboard(result.token);
  }
};


// LangService.onChange(({ activeLang }) => {
//   translatePage(activeLang);
// });

// translatePage(LangService.activeLang);
loginForm.addEventListener("submit", onSubmit);