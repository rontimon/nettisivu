# HealthDiary Sovellus

Tervetuloa LongWay-sovellukseen! Tämä README.md sisältää kaiken tarvittavan tiedon sovelluksesta, mukaan lukien käyttöliittymän kuvakaappaukset, linkit sovellukseen, ja tietokannan kuvaus.

## Kuvakaappaukset

<img width="1436" alt="Screenshot 2024-03-17 at 22 05 32" src="https://github.com/rontimon/diary/assets/122264249/81667230-ea03-4b72-8605-4f31835cc567">

<img width="1436" alt="Screenshot 2024-03-17 at 21 34 11" src="https://github.com/rontimon/diary/assets/122264249/3d6995fc-efb4-4586-ae05-9a4e3ad08376">

<img width="1436" alt="Screenshot 2024-03-17 at 21 34 21" src="https://github.com/rontimon/diary/assets/122264249/3d0bf3cc-8262-4672-89f2-5b921ef16b88">

<img width="1436" alt="Screenshot 2024-03-17 at 21 34 30" src="https://github.com/rontimon/diary/assets/122264249/c9b3acd1-47cc-4371-a679-8fbeafb3a263">

<img width="1436" alt="Screenshot 2024-03-17 at 21 34 46" src="https://github.com/rontimon/diary/assets/122264249/1fdc35e9-5bbd-4a0c-ae4a-d0caa9262d6b">

<img width="1436" alt="Screenshot 2024-03-17 at 21 35 08" src="https://github.com/rontimon/diary/assets/122264249/608e6f12-f00a-48b2-b96d-74476f7f2b0b">

<img width="1436" alt="Screenshot 2024-03-17 at 21 35 17" src="https://github.com/rontimon/diary/assets/122264249/333c16be-aab2-469c-b94f-fb4c7b4e9705">




## Linkit

- **Front-end Sovellus**: [Linkki julkaistuun sovellukseen](#)
- **Back-end Sovellus/API**: [Linkki käytössä olevaan back-end-sovellukseen/APIin](#)

## Tietokannan Kuvaus

Sovellus käyttää `HealthDiary` nimistä tietokantaa, joka sisältää seuraavat taulut:

- `Users`: Käyttäjän perustiedot
- ( user_id, username, password, email, created_at ja user_level )

- `TrainingDiary`: Treenipäiväkirja
- ( diary_id, user_id, entry_date, mood, training_time, notes, goals ja created_at )


## Toiminnallisuudet

Toteutetut toiminnallisuudet sisältävät:

1. **Uuden käyttäjän luominen**
2. **Sisäänkirjautuminen**
3. **Päiväkirjamerkinnän lisääminen**
4. **Aikaisempien päiväkirjamerkintöjen hakeminen**
5. **Aikaisempien päiväkirjamerkintöjen muokkaaminen**
6. **Aikaisemman päiväkirjamerkinnän poistaminen**
7. **Uloskirjautuminen**

## Tiedossa Olevat Bugit/Ongelmat

Sivua ei saatu julkaistua nettiin.

## Referenssit

- Sovelluksen tyylittelyssä ja logon suunnittelussa on käytetty apuna ChatGPT:tä
