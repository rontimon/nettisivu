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

const editDiary = document.getElementById("editDiaryModal");
const closeButton = document.querySelector(".close-button");
const editForm = document.getElementById("edit-diary-form");

closeButton.onclick = () => (editDiary.style.display = "none");
window.onclick = (event) => {
  if (event.target === editDiary) {
    editDiary.style.display = "none";
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

    // diaryData.user_id = userId;

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
        alert('Päiväkirjamerkintä lisätty!');
    }   catch (error) {
        console.error('Error adding diary entry:', error.message);
        alert('Päiväkirjamerkinnän lisääminen epäonnistui, Yritä uudelleen.');
    }
}


async function getDiaryEntries() {
    const userId = localStorage.getItem("user_id");
    const url = `http://localhost:3000/api/entries/diary/${userId}`;
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

    const tbody = document.querySelector(".tbody");
    tbody.innerHTML = "";

    data.forEach((element) => {
        console.log(
            element.entry_date,
            element.user_id,
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
        deleteButton.setAttribute("diary-id", element.diary_id);
        deleteButton.innerText = "Poista";
        deleteButton.addEventListener("click", deleteEntry);
        td6.appendChild(deleteButton);

        const td7 = document.createElement("td");
        const editButton = document.createElement("button");
        editButton.className = "edit";
        editButton.setAttribute("diary-id", element.diary_id);
        editButton.setAttribute("data-entry-id", element.diary_id);
        editButton.innerText = "Muokkaa";
        editButton.addEventListener("click", () => ShowModal(element);
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
        .querySelectorAll(".del")
        .forEach((button) => button.addEventListener("click", deleteEntry));
    document
        .querySelectorAll(".edit")
        .forEach((button) => button.addEventListener("click", () => ShowModal(element))
    );   
}


function ShowModal(element) {
    document.getElementById('edit-entry-date').value = new Date(element.entry_date).toISOString().split('T')[0]; 
    document.getElementById('edit-mood').value = element.mood;
    document.getElementById('edit-training-time').value = element.training_time;
    document.getElementById('edit-notes').value = element.notes;
    document.getElementById('edit-goals').value = element.goals;
    document.getElementById('entry-diary-id').value = element.diary_id; 
    const form = document.getElementById('edit-diary-form');
    form.addEventListener('submit', updateDiary)
    const modal = document.getElementById("editDiaryModal");
    modal.style.display = "block";
    // console.log(evt.target.dataset.entryId);
    // const entryId = parseInt(evt.target.dataset.entryId, 10);
    // console.log("Entry ID:", entryId);
    // const entryData = data.find((entry) => entry.diary_id === entryId);

    // document.getElementById("edit-diary-id").value = entryId;
    // document.getElementById("edit-entry-date").value = entryData.entry_date;
    // document.getElementById("edit-mood").value = entryData.mood;
    // document.getElementById("edit-training-time").value = entryData.training_time;
    // document.getElementById("edit-notes").value = entryData.notes;
    // document.getElementById("edit-goals").value = entryData.goals;

    // editDiary.style.display = "block";
}
// kun klikataan x ikkuna sulkeutuu
closeButton.onclick = function() {
    editDiary.style.display = "none";
}
// kun klikataan mihin vaan ikkunan ulkopuolelle, ikkuna sulkeutuu
window.onclick = function(event) {
    if (event.target == editDiary) {
        editDiary.style.display = "none";
    }
}

function updateDiary(evt) {
    evt.preventDefault();
    console.log('Päivitetään merkintä');
    console.log(evt);

    const diary_id = document.getElementById('edit-diary-id').value;
    const url = `http://127.0.0.1:3000/api/entries/diary/${diary_id}`;
    let token = localStorage.getItem('token');

    const newEntryDate = document.getElementById('edit-entry-date').value;
    const newMood = document.getElementById('edit-mood').value;
    const newTraining_time = document.getElementById('edit-training-time').value;
    const newNotes = document.getElementById('edit-notes').value;
    const newGoals = document.getElementById('edit-goals').value;

    const options = {
        method: 'PUT',
        headers: {
            Authorization: 'Bearer: ' + token,
            'Content-type': 'application/json',
        },
        body: JSON.stringify({
            diary_id: diary_id,
            entry_date: newEntryDate, 
            mood: newMood, 
            training_time: newTraining_time,
            notes: newNotes, 
            goals: newGoals}),
    };

    fetchData(url, options).then((data) => {
        console.log(data);
        alert('Merkinnän päivitys onnistunut!')
        const editDiary = document.getElementById('editDiaryModal');
        editDiary.style.display ="none";
        getDiaryEntries();
    });
}




// editForm.addEventListener("submit", async (e) => {
//     e.preventDefault();

//     const formData = new FormData(e.target);
//     const entryId = formData.get("edit-diary-id");

//     console.log('FormData', formData);

        
//     const url = `http://localhost:3000/api/entries/diary/${entryId}`;
//     const token = localStorage.getItem("token");

//     const options = {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           entry_date: formData.get("edit-entry-date"),
//           mood: formData.get("edit-mood"),
//           training_time: formData.get("edit-training-time"),
//           notes: formData.get("edit-notes"),
//           goals: formData.get("edit-goals"),
//         }),
//       };

//       console.log('options', options);
//       fetchData(url, options).then(() => {
//         editDiary.style.display = "none";
//         getDiaryEntries(); 
//       });
    
    
// });

async function deleteEntry(evt) {
    console.log(evt);

    const id = evt.target.attributes["diary-id"].value;
    console.log(id);

    const url = `http://localhost:3000/api/entries/diary/${id}`;
    const token = localStorage.getItem("token");

    const options = {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + token,
        },
      };
    
      const answer = confirm("Haluatko varmasti poistaa merkinnän?");
      if (answer) {
        fetchData(url, options).then((data) => {
          console.log(data);
          getDiaryEntries();
        });
      }
}

document.getElementById("fetchEntries").addEventListener("click", getDiaryEntries);