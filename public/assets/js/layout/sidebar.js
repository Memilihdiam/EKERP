document.addEventListener('DOMContentLoaded', () => {
    const sidebarDisplay = document.getElementById('sidebar-display');

    const itemPages = [
        {name: 'Dashboard', path: '/pages/dashboards/dashboard'},
        {name: 'Projects', path: '/pages/projects/project-list'},
        {name: 'Clients', path: '/pages/clients/client-list'}
    ]

    async function renderSidebar(){
        let sidebarList = '';
        itemPages.forEach(item => {
            sidebarList += `
                <li>
                    <a href="${item.path}">${item.name}</a>
                </li>
            `;
        })

        sidebarDisplay.innerHTML = sidebarList;
    }

    renderSidebar();
})