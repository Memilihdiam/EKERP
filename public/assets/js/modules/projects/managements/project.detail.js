import { fetchProjectId } from "./project.data.js";
import { handleAuthError } from "../../../shared/auth.js";

document.addEventListener('DOMContentLoaded', () => {
    const projectDetailContent = document.getElementById('project-detail-content');
    const loadingSpinner = document.getElementById('loading-spinner');
    const detailsTab = document.getElementById('details-tab');

    const getProjectIdFromUrl = () => {
        const path = window.location.pathname;
        const parts = path.split('/');
        return parts[parts.length - 1];
    };

    const renderProjectDetails = (project) => {
        const statusColor = {
            DRAFT: "badge text-bg-secondary",
            PLANNING: "badge text-bg-info",
            RUNNING: "badge text-bg-primary",
            ON_HOLD: "badge text-bg-warning",
            COMPLETED: "badge text-bg-success",
            CLOSED: "badge text-bg-dark"
        };
        const badgeClass = statusColor[project.status] || "badge text-bg-light";

        const detailHTML = `
            <div class="card shadow-sm">
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-6">
                            <p><strong>Project Code:</strong> ${project.project_code}</p>
                            <p><strong>Project Name:</strong> ${project.project_name}</p>
                            <p><strong>Client:</strong> ${project.client_name || 'N/A'}</p>
                        </div>
                        <div class="col-md-6">
                            <p><strong>Start Date:</strong> ${new Date(project.start_date).toLocaleDateString('id-ID')}</p>
                            <p><strong>End Date:</strong> ${new Date(project.end_date).toLocaleDateString('id-ID')}</p>
                            <p><strong>Contract Value:</strong> ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(project.contract_value)}</p>
                        </div>
                        <div class="col-12">
                            <p><strong>Status:</strong> <span class="${badgeClass}">${project.status}</span></p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        projectDetailContent.innerHTML = detailHTML;

        // Render additional details
        renderAdditionalDetails('budget-details', project.budgets, 'No budget data available.');
        renderAdditionalDetails('tasks-details', project.tasks, 'No tasks available.');
        renderAdditionalDetails('milestones-details', project.milestones, 'No milestones available.');

        detailsTab.style.display = 'block';
    };

    const renderAdditionalDetails = (elementId, data, emptyMessage) => {
        const container = document.getElementById(elementId);
        if (data && data.length > 0) {
            container.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
        } else {
            container.innerHTML = `<p class="text-muted">${emptyMessage}</p>`;
        }
    };

    const loadProject = async () => {
        const projectId = getProjectIdFromUrl();
        if (!projectId) {
            projectDetailContent.innerHTML = `<div class="alert alert-danger">Project ID not found in URL.</div>`;
            loadingSpinner.style.display = 'none';
            return;
        }

        try {
            const data = await fetchProjectId(projectId);
            if (data.project) {
                renderProjectDetails(data.project);
            } else {
                projectDetailContent.innerHTML = `<div class="alert alert-warning">Project not found.</div>`;
            }
        } catch (error) {
            handleAuthError(error);
            projectDetailContent.innerHTML = `<div class="alert alert-danger">Failed to load project details: ${error.message}</div>`;
        } finally {
            loadingSpinner.style.display = 'none';
        }
    };

    loadProject();
});