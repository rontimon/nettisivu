import './style.css';
import { fetchData } from './fetch.js';

// Get enty alapuolella, poistettiin sillä muita entryjä ei tarvittu kuin se millä on kirjauduttu

// const bt1 = document.querySelector('.get_entry');
// bt1.addEventListener('click', async () => {
//   console.log('Klikki toimii!');
//   const url = 'http://localhost:3000/api/entries/1';

//   fetchData(url).then((data) => {
//     // käsitellään fetch data funktiosta tullut JSON
//     console.log(data);
    
//   });

//   // get entries by id
// });



// Haetaan kaikki käyttäjät ja luodaan niistä taulukko
// 1. hae ensin nappula ja kutsu funktiota (keksi nimi)

const tietobutton = document.querySelector('.get_users');
tietobutton.addEventListener('click', getUsers);

 async function getUsers() {
  console.log('haetaan kaikki käyttäjät')
  const url = 'http://localhost:3000/api/users';
  let token = localStorage.getItem('token');
  const options = {
    method: 'GET',
    headers: {
      Authorization: 'Bearer: ' + token,
    },
  };

  fetchData(url, options).then((data) => {
    // käsitellään fetchData funktiosta tullut JSON
    createTable(data);
  });

  // vaihtoehtoinen rakenne

  try {
    const responseData = await fetchData(url, options);
    console.log(responseData);
  } catch (error) {
    console.error(error);
  }
}

function createTable(data) {
  console.log(data);
  
  // etsitään tbody elementti
  const tbody = document.querySelector('.tbody');
  tbody.innerHTML = '';
  // loopissa luodaan jokaiselle tietoriville oikeat elementit
  // elementtien sisään pistetään oikeat tiedot.
  data.forEach(rivi => {
    console.log(rivi.user_id, rivi.username, rivi.user_level);

    // luodaan jokaiselle riville ensin TR elementti alkuun

    const tr = document.createElement('tr');

    // Luodaan soluja mihin tiedot
    const td1 = document.createElement('td');
    td1.innerText = rivi.username;

    const td2 = document.createElement('td');
    td2.innerText = rivi.user_level;

    const td3 = document.createElement('td');
    // td3.innerHTML = `<button class="check" data-id="${rivi.user_id}">Info</button>`

    const button1 = document.createElement('button');
    button1.className = 'check';
    button1.setAttribute('data-id', rivi.user_id);
    button1.innerText = 'Info';
    td3.appendChild(button1);

    button1.addEventListener('click', getUser);

    // const td3 = document.createElement('td');
    //   const button1 = document.createElement('button');
    //   button1.className = 'check';
    //   button1.setAttribute('data-id', '1');
    //   button1.innerText = 'Info';
    //   td3.appendChild(button1);

    // const td4 = document.createElement('td');
    // td4.innerHTML = '<button class="del" data-id="1">Delete</button>'

    const td4 = document.createElement('td');
    const button2 = document.createElement('button');
    button2.className = 'del';
    button2.setAttribute('data-id', rivi.user_id);
    button2.innerText = 'Delete';
    td4.appendChild(button2);

    button2.addEventListener('click', deleteUser);


    const td5 = document.createElement('td');
    td5.innerText = rivi.user_id

    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);
    tr.appendChild(td5);
    tbody.appendChild(tr);
    
    
  });
}

function getUser() {
  console.log('Haet tietoa!');
}

function deleteUser(evt) {
  console.log('Deletoit tietoa');
  console.log(evt);

  // tapa 1: haetaan arvo tutkimalla eventtiä
  const id = evt.target.attributes['data-id'].value;
  console.log(id);

  // tapa 2: haetaan viereinen elementti
  const id2 = evt.target.parentElement.nextElementSibling.textContent;
  console.log('Toinen tapa:', id2);

//   <tr>
//   <td>Melissa</td>
//   <td>5150</td>
//   <td><button class="check" data-id="2">Info</button></td>
//   <td><button class="del" data-id="2">Delete</button></td>
//   <td>2</td>
//   </tr>


  const url = `http://localhost:3000/api/users/${id}`;
  let token = localStorage.getItem('token');
  const options = {
    method: 'DELETE',
    headers: {
      Authorization: 'Bearer: ' + token,
    },
  };

  const answer = confirm(`Oletko varma että haluat poistaa käyttäjän ID: ${id}`);
  if (answer) {
    fetchData(url, options).then((data) => {
    // käsitellään fetchData funktiosta tullut JSON
      console.log(data);
      getUsers();
    });
  }
}

// getUser();

async function showUserName() {
  console.log('Hei täällä ollaan ja nyt pitäsi hakea käyttäjän tiedot');

  // hae käyttäjän omat tiedot

  // 1. joko local storagesta jos on tallessa

  // let name = localStorage.getItem('name');
  // console.log('Nimesi on:', name);
  // document.getElementById('name').innerHTML = name;

  // 2. hae uudestaan /api/auth/me endpointin kautta
  const url = 'http://localhost:3000/api/auth/me';
  let token = localStorage.getItem('token');
  const options = {
    method: 'GET',
    headers: {
      Authorization: 'Bearer: ' + token,
    },
  };
    fetchData(url, options).then((data) => {
      // käsitellään fetchData funktiosta tullut JSON
      console.log(data);
      document.getElementById('name').innerHTML = data.user.username;
    });
  }
  // hae elementti johon printtaat tiedot

  //koodi jolla haet nimen
showUserName();


// 1. testataan ensin YKSI endpoint joka ei vaadi tokenia
// 2. uudelleen strukturoidaan koodi jotta se on modulaarisempi

// tämä toimi ennen autentikaatiota, nyt tarvitsee tokenin, siistitään pian!
// sivuille on nyt myös lisätty navigaatio html sivuun, sekä siihen sopiva CSS koodi, hae siis uusi HTML ja UUSI CSS ennen kun aloitat

async function getAllUsers() {
  console.log('toimii!');

  try {
    const response = await fetch('http://127.0.0.1:3000/api/users');
    console.log(response);
    const data = await response.json();
    console.log(data);

    data.forEach((element) => {
      console.log(element.username);
    });

    // tänne tiedot
    const tbody = document.querySelector('.tbody');
    tbody.innerHTML = '';

    data.forEach((element) => {
      console.log(element.username);

      // Create table row element
      var tr = document.createElement('tr');

      // td1 Username
      var td1 = document.createElement('td');
      td1.innerText = element.username;

      // td2
      var td2 = document.createElement('td');
      td2.innerText = element.user_level;

      // td3
      var td3 = document.createElement('td');
      var button1 = document.createElement('button');
      button1.className = 'check';
      button1.setAttribute('data-id', '1');
      button1.innerText = 'Info';
      td3.appendChild(button1);

      // td4
      var td4 = document.createElement('td');
      var button2 = document.createElement('button');
      button2.className = 'del';
      button2.setAttribute('data-id', '1');
      button2.innerText = 'Delete';
      td4.appendChild(button2);

      // td5
      var td5 = document.createElement('td');
      td5.innerText = element.user_id;

      // Append table data elements to the table row element
      tr.appendChild(td1);
      tr.appendChild(td2);
      tr.appendChild(td3);
      tr.appendChild(td4);
      tr.appendChild(td5);

      // Append the table row element to the table (assuming you have a table with the id 'myTable')
      tbody.appendChild(tr);
    });
  } catch (error) {
    console.log(error);
  }
}