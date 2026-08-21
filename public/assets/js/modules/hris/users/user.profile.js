import { fetchUserData } from "./user.data.js";

document.addEventListener('DOMContentLoaded', () => {
    const nameDisplay = document.querySelectorAll('.name-display');
    const positionDisplay = document.getElementById('position-display');
    const photoProfileDisplay = document.getElementById('photo-profile-display');

    async function renderCardProfile(){
        const userData = await fetchUserData();
        positionDisplay.textContent = userData.position_name

        nameDisplay.forEach(display => {
            display.textContent = userData.name;
        });

        const userPhoto = userData.image_path ?? '/assets/images/default_profile_image.png';
        photoProfileDisplay.innerHTML = `<img src="${userPhoto}" width="80" height="80" class="d-flex rounded-circle me-2" aria-expanded="false">`;
    }

    const buttons = document.querySelectorAll('.btn');

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            buttons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });

    renderCardProfile();
})