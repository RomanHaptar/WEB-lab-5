const accountButton = document.getElementById('button-account');
accountButton.addEventListener('click', () => {
  location.replace('/index.html');
});

const API_URL = '/api/users';
const userData = document.querySelector('.user-table-body');
let fetchData = [];

const localData = JSON.parse(localStorage.getItem('data'));
if (!localData.isAdmin) {
  location.replace('/index.html');
}

const getAllUsers = async () => {
  await fetch(`${API_URL}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${JSON.parse(localStorage.getItem('data')).token}`,
    },
  })
    .then((res) => {
      if (res.ok) {
        return res;
      } else {
        throw new Error('Something wrong');
      }
    })
    .then((res) => res.json())
    .then((data) => (fetchData = data.slice()))
    .catch((e) => {
      console.error(e);
    });
};

const setAdmin = async (id) => {
  await fetch(`${API_URL}/setadm/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${JSON.parse(localStorage.getItem('data')).token}`,
    },
  })
    .then((res) => {
      if (res.ok) {
        return res;
      } else {
        throw new Error('Something wrong');
      }
    })
    .then((res) => res.json())
    .then(() => createRows())
    .catch((e) => {
      console.error(e);
    });
};

const deleteUser = async (id) => {
  await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${JSON.parse(localStorage.getItem('data')).token}`,
    },
  })
    .then((res) => {
      if (res.ok) {
        return res;
      } else {
        throw new Error('Something wrong');
      }
    })
    .then((res) => res.json())
    .then(() => createRows())
    .catch((e) => {
      console.error(e);
    });
};

async function createRows() {
  await getAllUsers();
  let userRows = '';
  for (const user of fetchData) {
    userRows += `
    <tr class="user-data">
      <td><span class="users-tag">${user.username}</span></td>
      <td><span class="users-mail">${user.email}</span></td>
      <td class="td-button">
        ${
          user.isAdmin
            ? `<button class="button-admin" disabled>Promote to Admin</button>`
            : `<button class="button-admin" onclick="setAdmin('${user.id}')">Promote to Admin</button>`
        }
      </td>
      <td class="td-button">
        ${
          user.isAdmin
            ? `<button class="button-delete" disabled>Delete</button>`
            : `<button class="button-delete" onclick="deleteUser('${user.id}')">Delete</button>`
        }
      </td>
    </tr>
    `;
  }
  userData.innerHTML = userRows;
}
createRows();
