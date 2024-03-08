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

    const form = document.querySelector('.training-diary-form');
    if(form) {
        form.addEventListener('submit', async function(event) {
            event.preventDefault();
            const formData = new FormData(event.target);
            const data = Object.fromEntries(formData.entries());
            const url = 'http://localhost:3000/api/training-diary';

            try {
                const responseData = await fetchData(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify(data)
                });
                console.log(responseData);
                alert('Päiväkirjamerkintä lisätty onnistuneesti!');
            } catch (error) {
                console.error('Error:', error);
            }
        });
    }

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
}
