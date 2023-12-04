const API_URL = '/api/users';
// variables
const formLogin = document.getElementById('login-form');
const usernameLogin = document.getElementById('login-username');
const passwordLogin = document.getElementById('login-password');
// regex
let checkName = /\b([A-ZÀ-ÿ][-,a-z. ']+[ ]*)+/;
let checkGroup = /[A-Z][A-Z]\-[0-9][0-9]/;
let checkIDcard = /^[A-Za-z]{2}\s№\d{6}$/
let checkbirthdate = /^\d{2}\.\d{2}\.\d{4}$/;
let checkEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
let checkUsername = /^(?=[a-zA-Z0-9._]{8,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/;
let checkPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,20}$/;

showLoginPassword = () => {
  let checkbox = document.querySelector('.pass-checkbox');
  let element = document.querySelector('.password');
  if (element.type === 'password') {
    element.type = 'text';
    checkbox.checked = true;
  } else {
    element.type = 'password';
    checkbox.checked = false;
  }
};

validateLoginForm = () => {
  let success = true;
  if (!checkUsername.test(usernameLogin.value)) {
    usernameLogin.classList.add('input-error');
    success = false;
  }
  if (!checkPassword.test(passwordLogin.value)) {
    passwordLogin.classList.add('input-error');
    success = false;
  }
  if (success) {
    loginUser(usernameLogin.value, passwordLogin.value);
    myForm.reset();
  } else {
    alert('Ви ввели некоректні дані.');
  }
};

const loginUser = (username, password) => {
  fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username,
      password,
    }),
  })
    .then((res) => {
      if (res.ok) {
        return res;
      } else {
        throw new Error('Invalid credentials');
      }
    })
    .then((res) => res.json())
    .then((obj) => {
      localStorage.setItem('data', JSON.stringify(obj));
      if (obj.isAdmin) {
        location.replace('/admin.html');
      } else {
        location.replace('/index.html');
      }
    })
    .catch((e) => {
      alert(e);
    });
};

const loginButton = document.getElementById('login-button');
loginButton.addEventListener('click', (e) => {
  e.preventDefault();
  validateLoginForm();
});
