import { fetchUserData } from "../hris/users/user.data.js";

async function renderUserDisplay(){
    const userData = await fetchUserData();
    const today = new Date().toDateString();

    const nameDisplay = document.getElementById('display-name');
    const currentDate = document.getElementById('now-date');

    nameDisplay.textContent = userData.name;
    currentDate.textContent = today;
}

renderUserDisplay();