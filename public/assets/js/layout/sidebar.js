document.addEventListener('DOMContentLoaded', () => {
    const sidebarDisplay = document.getElementById('sidebar-display'); //

    const itemPages = [
        {name: 'Dashboard', path: '/pages/dashboards/dashboard', icon: 'bi bi-grid'},
        {name: 'Projects', path: '/pages/projects/project-list', icon: 'bi bi-gear'},
        {name: 'Clients', path: '/pages/clients/client-list', icon: 'bi bi-people'}
    ];

    // Cek state di localStorage, default set ke 'collapsed' (tertutup)
    let sidebarState = localStorage.getItem('sidebar_state') || 'collapsed';

    async function renderSidebar(){
        // Tentukan styling awal berdasarkan state
        const isCollapsed = sidebarState === 'collapsed';
        const sidebarWidth = isCollapsed ? '70px' : '200px';
        const textDisplayClass = isCollapsed ? 'd-none' : '';

        let sidebarList = '';
        itemPages.forEach(item => {
            sidebarList += `
                <li class="nav-item">
                    <a href="${item.path}" class="nav-link text-dark text-nowrap" title="${item.name}">
                        <i class="${item.icon} fs-5"></i> 
                        <span class="sidebar-text ${textDisplayClass} ms-2">${item.name}</span>
                    </a>
                </li>
            `;
        });

        sidebarDisplay.innerHTML = `
            <div id="sidebar-container" class="d-flex border flex-column flex-shrink-0 shadow-sm p-2 vh-100 bg-light" style="width:${sidebarWidth}; overflow-y:auto; transition: width 0.3s ease;">
                <a href="#" class="d-flex align-items-center text-dark text-decoration-none">
                    <i class="bi bi-box fs-3 ms-2"></i> <!-- Icon default untuk Brand saat collapse -->
                    <span class="fs-4 sidebar-text ${textDisplayClass} ms-2 fw-bold">WKM</span>
                </a>
                <hr>
                <ul class="nav nav-pills flex-column mb-auto">
                    ${sidebarList}
                </ul>
            </div>
        `;
    }

    renderSidebar();

    document.addEventListener('toggleSidebar', () => {
        // Toggle state
        sidebarState = sidebarState === 'collapsed' ? 'expanded' : 'collapsed';
        
        localStorage.setItem('sidebar_state', sidebarState); // Simpan state sidebar
        
        // Update DOM langsung untuk animasi transisi
        const isCollapsed = sidebarState === 'collapsed';
        const sidebarContainer = document.getElementById('sidebar-container');
        const textElements = document.querySelectorAll('.sidebar-text');

        if (sidebarContainer) {
            sidebarContainer.style.width = isCollapsed ? '70px' : '200px';
        }
        
        textElements.forEach(el => {
            if (isCollapsed) {
                el.classList.add('d-none');
            } else {
                // Memberi sedikit delay agar teks muncul setelah div melebar
                setTimeout(() => el.classList.remove('d-none'), 100); 
            }
        });
    });
});