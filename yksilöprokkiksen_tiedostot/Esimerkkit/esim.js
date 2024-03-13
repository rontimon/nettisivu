import './style.css';
import { fetchData } from './fetch.js';

showUsername(); 
document.addEventListener('DOMContentLoaded', function() {
    getEntryById();
});



const entryButton = document.querySelector('.get_entry');
entryButton.addEventListener('click', getEntryById);

async function getEntryById() {
  console.log('Haetaan kaikki käyttäjän merkinnät tietokannasta')
  const user_id = localStorage.getItem('user_id');
  const url = `http://127.0.0.1:3000/api/entries/${user_id}`;
  let token = localStorage.getItem('token');
  const options = {
    method: 'GET',
    headers: {
      Authorization : 'Bearer: ' + token,
    },
  };

  fetchData(url, options).then((data) => {
    createTable(data);
  });
}

function createTable(data) {
  console.log(data);

  // etsitään tbody -elementti
  const tbody = document.querySelector('.tbody');
  tbody.innerHTML = '';


// luodaan jokaiselle tietoriville oikeat elementit
// elementtien sisään pistetään oikeat tiedot
  data.forEach((element) => {
    console.log(
      element.entry_date, element.user_id, element.user_level);

    // Luodaan jokaiselle riville ensin TR elementti 
    const tr = document.createElement('tr');
    
    const formattedDate = new Date(element.entry_date).toLocaleDateString(
        "fi-Fi"
    );
    // Luodaan soluja
    const td1 = document.createElement('td');
    td1.innerText = formattedDate;

    const td2 = document.createElement('td');
    td2.innerText = element.mood;

    const td3 = document.createElement('td');
    td3.innerText = element.weight;

    const td4 = document.createElement('td');
    td4.innerText = element.sleep_hours;

    const td5 = document.createElement('td');
    td5.innerText = element.notes;

    const td6 = document.createElement('td');
    const button1 = document.createElement('button');
    button1.className = 'del';
    button1.setAttribute('data-id', element.entry_id);
    button1.innerText = 'Poista merkintä';
    button1.addEventListener('click', deleteEntry);
    td6.appendChild(button1);

    const td7 = document.createElement('td');
    const button2 = document.createElement('button');
    button2.className = 'mod';
    button2.setAttribute('data-id', element.entry_id);
    button2.innerText = 'Muokkaa';
    button2.addEventListener('click', () => showModal(element));
    td7.appendChild(button2);



    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);
    tr.appendChild(td5);
    tr.appendChild(td7);
    tr.appendChild(td6);
    tbody.appendChild(tr);
  });
}


// Get the modal
const modal = document.getElementById("editEntryModal");

// Get the <span> element that closes the modal
const span = document.querySelector('.close');

// When the user clicks the button, open the modal 
function showModal(element) {
    document.getElementById('editDate').value = new Date(element.entry_date).toISOString().split('T')[0]; 
    document.getElementById('editMood').value = element.mood;
    document.getElementById('editWeight').value = element.weight;
    document.getElementById('editSleep').value = element.sleep_hours;
    document.getElementById('editEntry').value = element.notes;
    document.getElementById('entryId').value = element.entry_id; 
    const form = document.getElementById('editEntryForm');
    form.addEventListener('submit', updateEntry)
    const modal = document.getElementById("editEntryModal");
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}


function updateEntry(evt) {
    evt.preventDefault();
    console.log('Päivitetään merkintä');
    console.log(evt);

    const entry_id = document.getElementById('entryId').value;
    const url = `http://127.0.0.1:3000/api/entries/${entry_id}`;
    let token = localStorage.getItem('token');

    const newEntryDate = document.getElementById('editDate').value;
    const newMood = document.getElementById('editMood').value;
    const newWeight = document.getElementById('editWeight').value;
    const newSleep = document.getElementById('editSleep').value;
    const newEntry = document.getElementById('editEntry').value;

    const options = {
        method: 'PUT',
        headers: {
            Authorization: 'Bearer: ' + token,
            'Content-type': 'application/json',
        },
        body: JSON.stringify({
            id: entry_id,
            entry_date: newEntryDate, 
            mood: newMood, 
            weight: newWeight,
            sleep_hours: newSleep, 
            notes: newEntry}),
    };

    fetchData(url, options).then((data) => {
        console.log(data);
        alert('Merkinnän päivitys onnistunut!')
        const modal = document.getElementById('editEntryModal');
        modal.style.display ="none";
        getEntryById();
    });
}