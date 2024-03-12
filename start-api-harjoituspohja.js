import './style.css';
import { fetchData } from './fetch.js';

document.addEventListener('DOMContentLoaded', async function () {
    const token = localStorage.getItem('token');
    
    if (!token) {
        window.location.href = 'etusivu.html';
        return;
    }

    // Näyttää kirjautuneen käyttäjän nimen
    await showUserName(token);

    
    document.getElementById('logoutButton').addEventListener('click', function() {
        localStorage.removeItem('token');
        window.location.href = 'etusivu.html';
    });

});

async function showUserName(token) {
    const url = 'http://localhost:3000/api/auth/me';
    const options = {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    };

    try {
        const data = await fetchData(url, options);
        document.getElementById('name').textContent = data.user.username;
    } catch (error) {
        console.error('Error fetching user name:', error);
    }
};


const form = document.getElementById('diary-form');
console.log(form);
form.addEventListener('submit', submitDiary);
const entriesButton = document.querySelector("#fetchEntries");
entriesButton.addEventListener("click", getDiaryEntries);

const editDiary = document.getElementById("edit-diary");
const closeButton = document.querySelector(".close-button");
const editForm = document.getElementById("edit-diary-form");

closeButton.onclick = () => (editModal.style.display = "none");
window.onclick = (event) => {
  if (event.target === editModal) {
    editModal.style.display = "none";
  }
};

async function submitDiary(event) {
    event.preventDefault();
    const userId = localStorage.getItem('user_id');

    const formData = new FormData(form);
    const diaryData = {};
    formData.forEach((value, key) => {
        diaryData[key] = value;
        console.log(diaryData);
    });

    diaryData.user_id = userId;

    try {
        const url = `http://localhost:3000/api/entries/diary/${userId}`;
        const token = localStorage.getItem('token');
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(diaryData)
        };

        const response = await fetch(url, options);
        console.log(response);
        if (!response.ok) {
            throw new Error('Failed to add entry');
        }

        // Tyhjennetään lomake
        form.reset();
        alert('diary entry added succesfully!');
    }   catch (error) {
        console.error('Error adding diary entry:', error.message);
        alert('Päiväkirjamerkinnän lisääminen epäonnistui, Yritä uudelleen.');
    }
}


async function getDiaryEntries() {
    const userId = localStorage.getItem("user_id");
    const url = `http://localhost:3000/api/entries/diaries/${userId}`;
    const token = localStorage.getItem("token");

    const options = {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
    
      fetchData(url, options).then((data) => {
        createTable(data);
      });
}

function createTable(data) {
    console.log(data);

    const tbody = document.querySelector(".diary-tbody");
    tbody.innerHTML = "";

    data.forEach((element) => {
        console.log(
            element.entry_date,
            element.mood,
            element.training_time,
            element.notes,
            element.goals,
        );

        const tr = document.createElement("tr");

        const formattedDate = new Date(element.entry_date).toLocaleDateString(
            "fi-Fi"
        );

        const td1 = document.createElement("td");
        td1.innerText = formattedDate;

        const td2 = document.createElement("td");
        td2.innerText = element.mood;

        const td3 = document.createElement("td");
        td3.innerText = element.training_time;

        const td4 = document.createElement("td");
        td4.innerText = element.notes;

        const td5 = document.createElement("td");
        td5.innerText = element.goals;

        const td6 = document.createElement("td");
        const deleteButton = document.createElement("button");
        deleteButton.className = "del";
        deleteButton.setAttribute("entry-id", element.diary_id);
        deleteButton.innerText = "Poista";
        deleteButton.addEventListener("click", deleteEntry);
        td6.appendChild(deleteButton);

        const td7 = document.createElement("td");
        const editButton = document.createElement("button");
        editButton.className = "edit";
        editButton.setAttribute("entry-id", element.diary_id);
        editButton.setAttribute("data-entry-id", element.diary_id);
        editButton.innerText = "Muokkaa";
        editButton.addEventListener("click", (evt) => openEditModal(evt, data));
        td7.appendChild(editButton);

        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
        tr.appendChild(td5);
        tr.appendChild(td6);
        tr.appendChild(td7);

        tbody.appendChild(tr);
    });

    document
        .querySelector(".del")
        .forEach((button) => button.addEventListener("click", deleteEntry));
    document
        .querySelector(".edit")
        .forEach((button) =>
            button.addEventListener("click", (evt) => openEditModal(evt, data))
        );   
}


function openEditModal(evt, data) {
    console.log(evt.target.dataset.entryId);
    const entryId = parseInt(evt.target.dataset.entryId, 10);
    console.log("Entry ID:", entryId);
    const entryData = data.find((entry) => entry.diary_id === entryId);

    document.getElementById("edit-diary-id").value = entryId;
    document.getElementById("edit-entry-date").value = entryData.entry_date;
    document.getElementById("edit-mood").value = entryData.mood;
    document.getElementById("edit-training-time").value = entryData.training_time;
    document.getElementById("edit-notes").value = entryData.notes;
    document.getElementById("edit-goals").value = entryData.goals;

    editModal.style.display = "block";
}

editForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const entryId = formData.get("edit-diary-id");

    console.log('FormData', formData);

    const url = `http://localhost:3000/api/entries/${entryId}`;
    const token = localStorage.getItem("token");

    const options = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          entry_date: formData.get("edit-entry-date"),
          mood: formData.get("edit-mood"),
          training_time: formData.get("edit-training-time"),
          notes: formData.get("edit-notes"),
          goals: formData.get("edit-goals"),
        }),
      };
    
      fetchData(url, options).then(() => {
        editModal.style.display = "none";
        getEntries(); 
      });
    
});

async function deleteEntry(evt) {
    console.log(evt);

    const id = evt.target.attributes["entry-id"].value;
    console.log(id);

    const url = `http://localhost:3000/api/entries/${id}`;
    const token = localStorage.getItem("token");

    const options = {
        method: "DELETE",
        headers: {
          Authorization: "Bearer: " + token,
        },
      };
    
      const answer = confirm("Haluatko varmasti poistaa merkinnän?");
      if (answer) {
        fetchData(url, options).then((data) => {
          console.log(data);
          getEntries();
        });
      }
}

document.getElementById("fetchEntries").addEventListener("click", getDiaryEntries);

// async function submitDiary(entry) {
//     const response = await fetch('/api/entries', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${localStorage.getItem('token')}`
//         },
//         body: JSON.stringify(entry)
//     });
//     return response.json();
// }

// async function fetchDiaryEntries() {
//     const response = await fetch('/api/entries', {
//         method: 'GET',
//         headers: {
//             'Authorization': `Bearer ${localStorage.getItem('token')}`
//         }
//     });
//     return response.json();
// }

// async function updateDiaryEntries() {
//     const entries = await fetchDiaryEntries();
//     const entriesTableBody = document.querySelector('#entriesTable tbody');
//     entriesTableBody.innerHTML = '';

//     entries.forEach(entry => {
//         const row = `<tr>
//             <td>${entry.entry_date}</td>
//             <td>${entry.mood}</td>
//             <td>${entry.training_time}</td>
//             <td>${entry.notes}</td>
//             <td>${entry.goals}</td>
//         </tr>`;
//         entriesTableBody.innerHTML += row;
//     });
// }

