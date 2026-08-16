import { fetchUserData } from "../modules/hris/users/user.data.js";

document.addEventListener('DOMContentLoaded', () => {
    const header_display = document.getElementById('header-display');

    if(header_display){
        render_header();
    }

    async function render_header(){
        const response = await fetchUserData(); //
        const userData = response.user;
        const employer_image = userData.image_path ?? '/assets/images/default_profile_image.png';

        const path = window.location.pathname;
        const pageName = path.split('/').filter(Boolean).pop();
        const currentPage = pageName.replace(/[-_]/g, ' ').toUpperCase();


        const rawHTML = `
            <header class="p-3 bg-white shadow-sm d-flex justify-content-between align-items-center">
                <!-- Tambahkan ID burger-btn di bawah ini -->
                <button class="btn" id="burger-btn"><i class="bi bi-list"></i></button>
                <h1 class="h4 fw-bold mb-0">${currentPage}</h1>
                <div class="d-flex align-items-center">
                    <i class="bi bi-bell-fill fs-5 text-secondary me-3"></i>
                    <div class="d-flex align-items-center">
                        <div>
                            <div class="dropdown">
                                <img src="${employer_image}" width="40" height="40" class="rounded-circle me-2 dropdown-toggle" id="dropdownUser" data-bs-toggle="dropdown" aria-expanded="false">
                                <ul class="dropdown-menu dropdown-menu-dark text-small shadow" aria-labelledby="dropdownUser">
                                    <li><a class="dropdown-item" href="/pages/setting.html"><i class="bi bi-gear-fill"></i> Settings</a></li>
                                    <li><a class="dropdown-item" href="/pages/dashboards/profile.html"><i class="bi bi-person-fill"></i> Profile</a></li>
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

        const logoutButton = document.getElementById('logout-btn');
        logoutButton?.addEventListener('click', () => {
            window.location.href = '/';
        });

        const burgerBtn = document.getElementById('burger-btn');
        burgerBtn?.addEventListener('click', () => {
            // Trigger event global 'toggleSidebar' ketika diklik
            document.dispatchEvent(new Event('toggleSidebar'));
        });
    }
})