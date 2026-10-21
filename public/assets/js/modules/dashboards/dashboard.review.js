import { fetchReviewData, fetchValueProject } from "./dashboard.data.js";

document.addEventListener('DOMContentLoaded', () => {
    const currencyFormat = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR'
    })
    function renderProgressBar(data, total, legendHTML) {
        const segments = data.map(item => {
            const value = Math.max(0, Number(item.value) || 0);
            const percent = total > 0 ? (value / total) * 100 : 0;

            return {
                ...item,
                value,
                percent
            };
        });

        let legendsMark = "";
        data.forEach(item => {
            legendsMark += `
                <div class="col card-lift border">
                    <div class="row g-3">
                        <div class="col-2">
                            <div style="border:1px solid black;width:10px;height:10px;background:${item.color}"></div>
                        </div>
                        <div class="col-8">
                            <p>${item.label}</p>
                        </div>
                    </div>
                    <div class="text-center">
                        <p>${item.value}</p>
                    </div>
                </div>
            `;
        })
        
        document.getElementById(legendHTML).innerHTML = `<div class="row g-3 m-3">${legendsMark}</div>`;
        
        return `
            <div style="display:flex;width:100%;height:10px;overflow:hidden;border-radius:999px;background:#e5e7eb;">
                ${segments.map(item => `
                    <div title="${item.label ?? ""}: ${item.value}" style="width:${item.percent}%;height:10px;background:${item.color};"></div>
                `).join("")}
            </div>
        `;
    }

    async function renderProcurementReview() {
        const data = await fetchReviewData();
        const projects = data.projects;
        const clients = data.clientsStatus;

        const projectProgress = [
            {key:"project_completed", value:projects.project_completed, label:"Completed",color:"#22c55e"},
            {key:"project_running", value:projects.project_running, label:"Running",color:"#3b82f6"},
            {key:"project_draft", value:projects.project_draft, label:"Draft",color:"#f59e0b"},
            {key:"project_cancelled", value:projects.project_cancelled, label:"Cancelled",color:"#ef4444"}
        ];

        const clientProgress = [
            {key:"client_active", value:clients.client_active, label:"Active", color:"#22c55e"},
            {key:"client_inactive", value:clients.client_inactive, label:"Inactive", color:"#ef4444"}
        ]

        document.querySelector("#progress-project").innerHTML = renderProgressBar(projectProgress, Number(projects.project_total), "project-legend");
        document.querySelector("#progress-client").innerHTML = renderProgressBar(clientProgress, Number(clients.client_total), "client-legend");
    }

    async function renderValue(){
        const data = await fetchValueProject();
        const value = data.value;

        const quotationDisplay = document.getElementById('quotation-value-display');
        const PODisplay = document.getElementById('po-value-display');

        quotationDisplay.innerHTML = `<p>${currencyFormat.format(value.quotation_value)}</p>`
        PODisplay.innerHTML = `<p>${value.po_value}</p>`
    }

    renderProcurementReview();
    renderValue();
})