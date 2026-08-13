document.addEventListener('DOMContentLoaded', () => {
    const sidebarDisplay = document.getElementById('sidebar-display');

    const itemPages = [
        {name: 'Dashboard', path: '/pages/dashboards/dashboard.html'},
        {name: 'Projects', path: '/pages/projects/project-list.html'}
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