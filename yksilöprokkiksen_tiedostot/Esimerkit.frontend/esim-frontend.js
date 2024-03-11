import "./style.css";
import { fetchData } from "./fetch.js";

document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.querySelector(".menu-toggle");
  const menu = document.querySelector(".menu");

  menuToggle.addEventListener("click", function () {
    menu.classList.toggle("show");
  });
});


const form = document.getElementById('exercise-form');
console.log(form);
form.addEventListener('submit', submitDiary);
const entriesButton = document.querySelector("#fetch-data");
entriesButton.addEventListener("click", getEntries);

const editModal = document.getElementById("edit-modal");
const closeButton = document.querySelector(".close-button");
const editForm = document.getElementById("edit-form");

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
        const url = `http://localhost:3000/api/entries/${userId}`;
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
          throw new Error('Failed to add diary entry');
        }
    
        // Tyhjennä lomake
        form.reset();
        alert('Diary entry added successfully!');
      } catch (error) {
        console.error('Error adding diary entry:', error.message);
        alert('Failed to add diary entry. Please try again.');
      }
}

async function getEntries() {
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

  const tbody = document.querySelector(".tbody");
  tbody.innerHTML = "";

  data.forEach((element) => {
    console.log(
      element.entry_date,
      element.mood,
      element.weight,
      element.sleep_hours,
      element.notes,
      element.created_at
    );

    const tr = document.createElement("tr");

    const formattedDate = new Date(element.entry_date).toLocaleDateString(
      "fi-FI"
    );

    const td1 = document.createElement("td");
    td1.innerText = formattedDate;

    const td2 = document.createElement("td");
    td2.innerText = element.mood;

    const td3 = document.createElement("td");
    td3.innerText = element.weight;

    const td4 = document.createElement("td");
    td4.innerText = element.sleep_hours;

    const td5 = document.createElement("td");
    td5.innerText = element.notes;

    const td6 = document.createElement("td");
    const deleteButton = document.createElement("button");
    deleteButton.className = "del";
    deleteButton.setAttribute("entry-id", element.entry_id);
    deleteButton.innerText = "Delete";
    deleteButton.addEventListener("click", deleteEntry);
    td6.appendChild(deleteButton);

    const td7 = document.createElement("td");
    const editButton = document.createElement("button");
    editButton.className = "edit";
    editButton.setAttribute("entry-id", element.entry_id);
    editButton.setAttribute("data-entry-id", element.entry_id);
    editButton.innerText = "Edit";
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
    .querySelectorAll(".del")
    .forEach((button) => button.addEventListener("click", deleteEntry));
  document
    .querySelectorAll(".edit")
    .forEach((button) =>
      button.addEventListener("click", (evt) => openEditModal(evt, data))
    );
}

function openEditModal(evt, data) {
    console.log(evt.target.dataset.entryId);
  const entryId = parseInt(evt.target.dataset.entryId, 10);
  console.log("Entry ID:", entryId);
  const entryData = data.find((entry) => entry.entry_id === entryId);

  document.getElementById("edit-entry-id").value = entryId;
  document.getElementById("edit-date").value = entryData.entry_date;
  document.getElementById("edit-mood").value = entryData.mood;
  document.getElementById("edit-weight").value = entryData.weight;
  document.getElementById("edit-sleep").value = entryData.sleep_hours;
  document.getElementById("edit-notes").value = entryData.notes;

  editModal.style.display = "block";
}
editForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const entryId = formData.get("edit-entry-id");


  console.log('FormData:', formData);


  const url = `http://localhost:3000/api/entries/${entryId}`;
  const token = localStorage.getItem("token");

  const options = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      entry_date: formData.get("edit-date"),
      mood: formData.get("edit-mood"),
      weight: formData.get("edit-weight"),
      sleep_hours: formData.get("edit-sleep"),
      notes: formData.get("edit-notes"),
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

  const answer = confirm("Are you sure you want to delete entry?");
  if (answer) {
    fetchData(url, options).then((data) => {
      console.log(data);
      getEntries();
    });
  }
}

document.getElementById("fetch-data").addEventListener("click", getEntries);