const form = document.getElementById('form');
form.addEventListener('submit', (e) => {
  e.preventDefault();
});
const username = document.getElementById('username');
const password = document.getElementById('password');
const fullname = document.getElementById('fullname');
const group = document.getElementById('group');
const idcard = document.getElementById('idcard');
const birthdate = document.getElementById('birthdate');
const email = document.getElementById('email');
const saveButton = document.getElementById('save-button');
const editButton = document.getElementById('edit-button');
const deleteButton = document.getElementById('delete-button');
const logoutButton = document.getElementById('logout-button');

// regex
let checkName = /\b([A-ZÀ-ÿ][-,a-z. ']+[ ]*)+/;
let checkGroup = /[A-Z][A-Z]\-[0-9][0-9]/;
let checkIDcard = /^[A-Za-z]{2}\s№\d{6}$/;
let checkbirthdate = /^\d{2}\.\d{2}\.\d{4}$/;
let checkEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
let checkUsername = /^(?=[a-zA-Z0-9._]{8,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/;
let checkPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,20}$/;

const API_URL = '/api/users/';
let id = '';
let token = '';

editUser = (username, password, fullname, group, idcard, birthdate, email) => {
  fetch(API_URL + id, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
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
    .then((res) => res.json())
    .then((obj) => localStorage.setItem('data', JSON.stringify(obj)))
    .then(() => location.replace('/index.html'))
    .catch((e) => {
      alert(e);
    });
};

// validate form
validateSaveForm = (e) => {
  e.preventDefault();
  let success = true;
  if (!checkUsername.test(username.value)) {
    username.classList.add('input-error');
    success = false;
  }
  if (!checkPassword.test(password.value)) {
    password.classList.add('input-error');
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
  if (!checkIDcard.test(idcard.value)) {
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
    editUser(
      username.value,
      password.value,
      fullname.value,
      group.value,
      idcard.value, 
      birthdate.value,
      email.value
    );
  } else {
    alert('Ви ввели некоректні дані.');
  }
};

const getLocalStorage = () => {
  const userObject = JSON.parse(localStorage.getItem('data'));
  username.value = userObject.username;
  fullname.value = userObject.fullname;
  group.value = userObject.group;
  idcard.value = userObject.idcard;
  birthdate.value = userObject.birthdate;
  email.value = userObject.email;
  id = userObject.id;
  token = userObject.token;
};

const checkLocalStorage = () => {
  if (!localStorage.getItem('data')) {
    location.replace('/login.html');
  }
  getLocalStorage();
};
checkLocalStorage();

editData = (e) => {
  e.preventDefault();

  saveButton.disabled = false;
  deleteButton.disabled = true;
  logoutButton.disabled = true;
  editButton.disabled = true;
  password.type = 'text';

  let inputsArray = [username, password, fullname, group, idcard, birthdate, email];
  inputsArray.forEach((input) => {
    input.removeAttribute('disabled');
  });
};

saveButton.addEventListener('click', (e) => validateSaveForm(e));
editButton.addEventListener('click', (e) => editData(e));

logoutButton.addEventListener('click', () => {
  localStorage.removeItem('data');

  location.replace('/login.html');
});

deleteButton.addEventListener('click', () => {
  fetch(API_URL + id, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
    .then(() => localStorage.removeItem('data'))
    .then(() => alert('Користувача видалено.'))
    .then(() => location.replace('/login.html'))
    .catch((e) => {
      alert(e);
    });
});
