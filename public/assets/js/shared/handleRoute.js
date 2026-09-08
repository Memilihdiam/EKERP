export function initRowClickNavigation({ container, rowSelector, dataAttribute = 'id', getUrl }) {
    const element = document.querySelector(container);
    if (!element) return; element.addEventListener('click', (e) => {
        const row = e.target.closest(rowSelector);
        if (!row) return;
        
        const id = row.dataset[dataAttribute];
        if (!id) return;
        
        const url = getUrl(id, row);
        if (url) {
            window.location.href = url;
        }
    });
}