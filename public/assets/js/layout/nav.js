import { fetchUserData } from "../modules/hris/users/user.data.js";
import { handleAuthError } from "../shared/auth.js";

document.addEventListener('DOMContentLoaded', () => {
    const header_display = document.getElementById('header-display');

    if(header_display){
        render_header();
    }

    async function render_header(){
        try {
            const userData = await fetchUserData();
            const employer_image = userData.image_path ?? '/assets/images/default_profile_image.png';
    
            const path = window.location.pathname;
            const pageName = path.split('/').filter(Boolean).pop();
            const currentPage = pageName.replace(/[-_]/g, ' ').toUpperCase();

            const todayDate = new Date().toDateString('id-ID');
    
            const rawHTML = `
                <header class="p-3 border bg-white shadow-sm d-flex justify-content-between align-items-center">
                    <button class="btn" id="burger-btn"><i class="bi bi-list"></i></button>
                    <h1 class="h4 fw-bold mb-0">${currentPage}</h1>
                    <div class="d-flex align-items-center">
                        <div class="p-1">
                            <strong style="display:block; margin:0; line-height:15px;">
                                ${todayDate}
                            </strong>
                            <div id="time-display" style="margin:0; line-height:15px;"></div>
                        </div>
                        <i class="bi bi-bell-fill fs-5 text-secondary me-3"></i>
                        <div class="d-flex align-items-center">
                            <div>
                                <div class="dropdown">
                                    <img src="${employer_image}" width="40" height="40" class="rounded-circle me-2 dropdown-toggle" id="dropdownUser" data-bs-toggle="dropdown" aria-expanded="false">
                                    <ul class="dropdown-menu dropdown-menu-dark text-small shadow" aria-labelledby="dropdownUser" style="width:250px;">
                                        <li>
                                            <div class="d-flex">
                                            <img src="${employer_image}" width="25" height="25" class="rounded-circle me-2"> 
                                            <p>${userData.name}</p>
                                            </div>
                                        </li>
                                        <li><hr class="dropdown-divider"></li>
                                        <li><a class="dropdown-item" href="/pages/dashboards/profile.html"><i class="bi bi-person-fill"></i> Profile</a></li>
                                        <li><a class="dropdown-item" href="/pages/setting.html"><i class="bi bi-gear-fill"></i> Settings</a></li>
                                        <li><hr class="dropdown-divider"></li>
                                        <li><button class="dropdown-item text-danger" id="logout-btn"><i class="bi bi-door-open-fill"></i> Sign out</button></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>
            `;
    
            header_display.innerHTML = rawHTML;
    
            const timeDisplay = document.getElementById('time-display');
            function updateClock() {
                if (timeDisplay) {
                    timeDisplay.textContent = new Date().toLocaleTimeString('id-ID');
                }
            }
            
            setInterval(updateClock, 1000);
            updateClock();

            const logoutButton = document.getElementById('logout-btn');
            logoutButton?.addEventListener('click', () => {
                window.location.href = '/';
            });
    
            const burgerBtn = document.getElementById('burger-btn');
            burgerBtn?.addEventListener('click', () => {
                document.dispatchEvent(new Event('toggleSidebar'));
            });
        } catch (error) {
            handleAuthError(error);
        }
    }
})