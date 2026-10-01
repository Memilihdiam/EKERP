import { fetchUserData } from "../hris/users/user.data.js";
import { fetchUrgentTask } from "../miscellaneous/notifications/notification.data.js";

document.addEventListener('DOMContentLoaded', () => {
    async function renderUserDisplay(){
        const userData = await fetchUserData();
        const today = new Date().toDateString();
    
        const nameDisplay = document.getElementById('display-name');
        const currentDate = document.getElementById('now-date');
    
        nameDisplay.textContent = userData.name;
        currentDate.textContent = today;
    }

    async function renderUrgentTask(){
        const taskData = await fetchUrgentTask();
        const taskDisplay = document.getElementById('task-display');

        let taskRow = "";
        taskData.forEach(item => {
            taskRow += `
                <tr>
                    <td>${item.code}</td>
                    <td>${item.title}</td>
                    <td>${item.client}</td>
                    <td>${new Date(item.start).toLocaleDateString('id-ID')} (${item.start_day_left} Day Left)</td>
                    <td>${new Date(item.end).toLocaleDateString('id-ID')} (${item.end_day_left} Day Left)</td>
                    <td>${item.status}</td>
                </tr>
            `
        })

        taskDisplay.innerHTML = `
            <table class="table">
                <tbody>
                    ${taskRow}
                </tbody>
            </table>
        `;
    }
    
    renderUserDisplay();
    renderUrgentTask();
})