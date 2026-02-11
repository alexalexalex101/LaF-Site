const modeSelect = document.getElementById('modeSelect');
const detailPhoto = document.getElementById('detailPhoto');
const detailLocationSelect = document.getElementById('detailLocationSelect');
const detailTypeSelect = document.getElementById('detailTypeSelect');
const detailDateFound = document.getElementById('detailDateFound');
const detailCreatedAt = document.getElementById('detailCreatedAt');
const detailDesc = document.getElementById('detailDesc');
const formId = document.getElementById('formId');
const formAction = document.getElementById('formAction');
const btnApprove = document.getElementById('btnApprove');
const btnReject = document.getElementById('btnReject');
const btnSave = document.getElementById('btnSave');
const btnRemove = document.getElementById('btnRemove');
const textarea = detailDesc;
const itemListContainer = document.getElementById('itemList');
const helpText = document.getElementById('help-text');

// Dynamic empty message
const emptyMessage = document.createElement('div');
emptyMessage.className = 'admin-list-empty';
emptyMessage.style.display = 'none';
itemListContainer.appendChild(emptyMessage);

// Prevent native form submit
document.getElementById('actionForm').addEventListener('submit', e => e.preventDefault());

function getCurrentItems() {
    return itemListContainer.querySelectorAll('.admin-list-item');
}

function handleAction(action) {
    const id = formId.value;
    if (!id || !action) {
        alert('No item selected');
        return;
    }

    const formData = new FormData();
    formData.append('action', action);
    formData.append('id', id);

    if (action === 'save') {
        formData.append('description', detailDesc.value.trim());
        formData.append('location', detailLocationSelect.value);
        formData.append('item_type', detailTypeSelect.value);
    }

    fetch(window.location.href, {
        method: 'POST',
        body: formData
    })
    .then(response => {
        // First check if the HTTP request was successful (200-299)
        if (!response.ok) {
            throw new Error(`Server responded with ${response.status}`);
        }
        // If your PHP starts returning JSON, you can change to .json()
        return response.text();   // or response.json() if you make PHP return JSON
    })
    .then(data => {
        // ────────────────────────────────────────────────
        //   Only run UI updates if the server accepted the request
        // ────────────────────────────────────────────────

        const currentItem = document.querySelector(`.admin-list-item[data-id="${id}"]`);

        let message = '';
        switch (action) {
            case 'approve':
                message = 'Item approved!';
                if (currentItem) {
                    currentItem.dataset.mode = 'existing';
                    if (modeSelect.value === 'incoming') {
                        currentItem.style.display = 'none';
                    }
                }
                break;

            case 'reject':
            case 'remove':
                message = action === 'reject' ? 'Item rejected!' : 'Item removed!';
                if (currentItem) currentItem.remove();
                clearDetail();
                break;

            case 'save':
                message = 'Changes saved!';
                if (currentItem) {
                    // Only update data attributes if server said OK
                    currentItem.dataset.desc = detailDesc.value.trim();
                    currentItem.dataset.location = detailLocationSelect.value;
                    currentItem.dataset.type = detailTypeSelect.value;
                }
                break;
        }

        alert(message);
        updateEmptyMessage();
        
        // Auto-load next item only on success
        setTimeout(loadNextItem, 100);
    })
    .catch(err => {
        console.error('Action failed:', err);
        alert('Failed to process action: ' + err.message);
    });
}

// Button listeners
btnApprove.addEventListener('click', () => handleAction('approve'));
btnReject.addEventListener('click', () => handleAction('reject'));
btnSave.addEventListener('click', () => handleAction('save'));
btnRemove.addEventListener('click', () => handleAction('remove'));

// Mode switch
modeSelect.addEventListener('change', updateView);

function updateView() {
    const mode = modeSelect.value;
    const items = getCurrentItems();
    getCurrentItems().forEach(item => {
        item.style.display = (item.dataset.mode === mode) ? 'block' : 'none';
    });

    // Help text
    if (mode === 'incoming') {
        helpText.textContent = "Select an item from the list to start approving or rejecting reports!"
    }
    else {
        helpText.textContent = "Select an item from the list to edit or remove approved items!";
    }

    btnApprove.style.display = "none"
    btnReject.style.display = "none"
    btnSave.style.display = "none"
    btnRemove.style.display = "none"

    updateEmptyMessage();
    clearDetail();
}

function updateEmptyMessage() {
    const mode = modeSelect.value;
    const items = getCurrentItems();
    const visibleItems = Array.from(getCurrentItems()).filter(item => item.style.display !== 'none');

    if (visibleItems.length === 0) {
        emptyMessage.textContent = mode === 'incoming'
            ? 'No pending reports'
            : 'No approved items yet';
        emptyMessage.style.display = 'block';
    } else {
        emptyMessage.style.display = 'none';
    }
}

// Item selection handler
getCurrentItems().forEach(item => {
    item.addEventListener('click', () => {
        getCurrentItems().forEach(i => i.classList.remove('active'));
        item.classList.add('active');

        detailPhoto.src = item.dataset.photo ? "uploads/" + item.dataset.photo : "images/boxlogo.png";

        // Populate fields
        detailLocationSelect.value = item.dataset.location || '';
        detailTypeSelect.value = (item.dataset.type || '').toLowerCase();
        detailDateFound.textContent = item.dataset.dateFound || 'Not specified';
        detailCreatedAt.textContent = item.dataset.createdAt || 'Not specified';
        detailDesc.value = item.dataset.desc || '';

        formId.value = item.dataset.id;
        document.getElementById('detailReportId').textContent = `Report #${item.dataset.id}`;

        // Enable/disable editing based on mode
        const isExisting = item.dataset.mode === 'existing';

        detailLocationSelect.disabled = !isExisting;
        detailTypeSelect.disabled = !isExisting;
        textarea.readOnly = !isExisting;

        // Button visibility
        if (item.dataset.mode === 'incoming') {
            btnApprove.style.display = 'inline-block';
            btnReject.style.display = 'inline-block';
            btnSave.style.display = 'none';
            btnRemove.style.display = 'none';
        } else {
            btnApprove.style.display = 'none';
            btnReject.style.display = 'none';
            btnSave.style.display = 'inline-block';
            btnRemove.style.display = 'inline-block';
        }
    });
});

function clearDetail() {
    document.getElementById('detailReportId').textContent = 'Report #';
    detailPhoto.src = "images/boxlogo.png";
    detailLocationSelect.value = '';
    detailTypeSelect.value = '';
    detailDateFound.textContent = 'Not selected';
    detailCreatedAt.textContent = 'Not selected';
    detailDesc.value = '';
    formId.value = '';
}

// Soft refresh
document.getElementById('refreshBtn')?.addEventListener('click', async () => {
    try {
        const btn = document.getElementById('refreshBtn');
        btn.disabled = true;
        btn.textContent = 'Refreshing...';

        const response = await fetch(window.location.href);
        const text = await response.text();

        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        const newList = doc.querySelector('#itemList');

        if (newList) {
            const oldList = document.getElementById('itemList');
            oldList.innerHTML = newList.innerHTML;
            attachItemListeners();

            // Re-attach listeners to new items
            const newItems = oldList.querySelectorAll('.admin-list-item');
            newItems.forEach(item => {
                item.addEventListener('click', () => {
                    getCurrentItems().forEach(i => i.classList.remove('active'));
                    item.classList.add('active');

                    detailPhoto.src = item.dataset.photo ? "uploads/" + item.dataset.photo : "images/boxlogo.png";
                    detailLocationSelect.value = item.dataset.location || '';
                    detailTypeSelect.value = (item.dataset.type || '').toLowerCase();
                    detailDateFound.textContent = item.dataset.dateFound || 'Not specified';
                    detailCreatedAt.textContent = item.dataset.createdAt || 'Not specified';
                    detailDesc.value = item.dataset.desc || '';
                    formId.value = item.dataset.id;

                    const isExisting = item.dataset.mode === 'existing';
                    detailLocationSelect.disabled = !isExisting;
                    detailTypeSelect.disabled = !isExisting;
                    textarea.readOnly = !isExisting;

                    if (item.dataset.mode === 'incoming') {
                        btnApprove.style.display = 'inline-block';
                        btnReject.style.display = 'inline-block';
                        btnSave.style.display = 'none';
                        btnRemove.style.display = 'none';
                    } else {
                        btnApprove.style.display = 'none';
                        btnReject.style.display = 'none';
                        btnSave.style.display = 'inline-block';
                        btnRemove.style.display = 'inline-block';
                    }
                });
            });

            updateView();
            alert('List refreshed!');
        }
    } catch (err) {
        alert('Refresh failed: ' + err.message);
    } finally {
        const btn = document.getElementById('refreshBtn');
        btn.disabled = false;
        btn.textContent = '↻ Refresh List';
    }
});

function loadNextItem() {
    const visibleItems = Array.from(getCurrentItems()).filter(item => item.style.display !== 'none');
    if (visibleItems.length === 0) return;

    // Find current active (or first if none)
    let currentIndex = visibleItems.findIndex(item => item.classList.contains('active'));
    if (currentIndex === -1) currentIndex = 0;  // Start from first if none active

    const nextIndex = currentIndex + 1;
    if (nextIndex < visibleItems.length) {
        visibleItems[nextIndex].click();  // Auto-load next item
    } else {
        clearDetail();  // No more items → clear details
    }
}

// Initial load
function attachItemListeners() {
    getCurrentItems().forEach(item => {
        item.addEventListener('click', () => { /* your full click handler code here */ });
    });
}

// Call it once on load
attachItemListeners();
updateView();
