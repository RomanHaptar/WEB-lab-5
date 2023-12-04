const API_URL = '/api/users';
// variables
const formRegister = document.getElementById('register-form');
const usernameRegister = document.getElementById('register-username');
const passwordRegister = document.getElementById('register-password');
const passwordConfirm = document.getElementById('confirm-password');
const fullname = document.getElementById('fullname');
const group = document.getElementById('group');
const idcard = document.getElementById('idcard');
const birthdate = document.getElementById('birthdate');
const email = document.getElementById('email');
// regex
let checkName = /\b([A-ZÀ-ÿ][-,a-z. ']+[ ]*)+/;
let checkGroup = /[A-Z][A-Z]\-[0-9][0-9]/;
let checkidcard = /^[A-Za-z]{2}\s№\d{6}$/;
let checkbirthdate = /^\d{2}\.\d{2}\.\d{4}$/;
let checkEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
let checkUsername = /^(?=[a-zA-Z0-9._]{8,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/;
let checkPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,20}$/;

showPasswords = () => {
  let checkbox = document.querySelector('.pass-checkbox');
  let element1 = document.querySelector('.password');
  let element2 = document.querySelector('.password-confirm');
  if (element1.type === 'password' && element2.type === 'password') {
    element1.type = 'text';
    element2.type = 'text';
    checkbox.checked = true;
  } else {
    element1.type = 'password';
    element2.type = 'password';
    checkbox.checked = false;
  }
};

validateRegisterForm = () => {
  let success = true;

  if (!checkUsername.test(usernameRegister.value)) {
    usernameRegister.classList.add('input-error');
    success = false;
  }

  if (!checkPassword.test(passwordRegister.value)) {
    passwordRegister.classList.add('input-error');
    success = false;
  }

  // check if passwords match
  if (passwordRegister.value !== passwordConfirm.value) {
    passwordConfirm.classList.add('input-error');
    success = false;
  }

  if (!checkName.test(fullname.value)) {
    fullname.classList.add('input-error');
    success = false;
  }

  if (!checkGroup.test(group.value)) {
    group.classList.add('input-error');
    success = false;
  }

  if (!checkidcard.test(idcard.value)) {
    idcard.classList.add('input-error');
    success = false;
  }
  
  if (!checkbirthdate.test(birthdate.value)) {
    birthdate.classList.add('input-error');
    success = false;
  }

  if (!checkEmail.test(email.value)) {
    email.classList.add('input-error');
    success = false;
  }
  if (success) {
    alert('Всі поля заповнені коректно.');
    registerUser(
      usernameRegister.value,
      passwordRegister.value,
      fullname.value,
      group.value,
      idcard.value,
      birthdate.value,
      email.value
    );
    myForm.reset();
  } else {
    alert('Ви ввели некоректні дані.');
  }
};

const registerUser = (username, password, fullname, group, idcard, birthdate, email) => {
  fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username,
      password,
      fullname,
      group,
      idcard,
      birthdate,
      email,
    }),
  })
    // check for duplicate users
    .then((res) => {
      if (res.ok) {
        return res;
      } else {
        throw new Error('User already exists.');
      }
    })
    .then((res) => res.json())
    .then((obj) => localStorage.setItem('data', JSON.stringify(obj)))
    .then(() => location.replace('/index.html'))
    .catch((e) => {
      alert(e);
    });
};

const registerButton = document.getElementById('register-button');
registerButton.addEventListener('click', (e) => {
  e.preventDefault();
  validateRegisterForm();
});
