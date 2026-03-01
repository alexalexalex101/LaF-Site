document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('itemModal');
    const closeBtn = document.querySelector('.close-modal');
    const submitBtn = document.getElementById('inquirySubmit');
    const emailInput = document.getElementById('inquiryEmail');
    const successMsg = document.getElementById('inquirySuccess');

    // Open modal when clicking an item image
    document.querySelectorAll('.item-card img').forEach(img => {
        img.addEventListener('click', function() {
            const modalImage = document.getElementById('modalImage');

            // Set the image source
            modalImage.src = this.src;

            // IMPORTANT: Copy all data attributes from the clicked image to modalImage
            modalImage.dataset.location   = this.dataset.location   || 'Not specified';
            modalImage.dataset.dateFound  = this.dataset.dateFound  || 'Not specified';
            modalImage.dataset.createdAt  = this.dataset.createdAt  || 'Not specified';
            modalImage.dataset.desc       = this.dataset.desc       || 'No description';
            modalImage.dataset.fullphoto  = this.dataset.fullphoto  || '';

            // Reset form
            successMsg.style.display = 'none';
            submitBtn.style.display = 'block';
            emailInput.disabled = false;
            emailInput.value = '';

            // Show modal with transition
            modal.style.display = 'flex';
            setTimeout(() => {
                modal.classList.add('active');
            }, 10);

            document.body.style.overflow = 'hidden';
        });
    });

    // Close modal
    const closeModal = () => {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 400); // match your CSS transition duration
        document.body.style.overflow = 'auto';
    };

    closeBtn.onclick = closeModal;

    window.onclick = (e) => {
        if (e.target === modal) {
            closeModal();
        }
    };

    // Submit inquiry
    if (submitBtn) {
        submitBtn.onclick = () => {
            const receiver = emailInput.value.trim();
            if (!receiver) {
                alert('Please enter your email');
                return;
            }

            const modalImage = document.getElementById('modalImage');

            const location = modalImage.dataset.location || 'Not specified';
            let pdfFilename = null;
            if (location !== 'Not specified') {
                pdfFilename = `maps/${location}.pdf`;  // must exist on server
            }

            const bodyData = {
                email_receiver: receiver,
                item_location: location,
                date_found: modalImage.dataset.dateFound || 'Not specified',
                created_at: modalImage.dataset.createdAt || 'Not specified',
                description: modalImage.dataset.desc || 'No description',
                filename: modalImage.dataset.fullphoto || '',  // server-side image path
                pdf_filename: pdfFilename
            };

            // Debug: Check what is actually being sent
            console.log('Sending to backend:', bodyData);

            const API_URL = `http://${window.location.hostname}:5000`;

            fetch(`${API_URL}/send-inquiry`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bodyData)
            })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`Server responded with ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                if (data.message) {
                    successMsg.style.display = 'block';
                    submitBtn.style.display = 'none';
                    emailInput.disabled = true; // prevent double submit
                } else {
                    alert('Error: ' + (data.error || 'Unknown error'));
                }
            })
            .catch(err => {
                console.error('Fetch error:', err);
                alert('Failed to send inquiry: ' + err.message);
            });
        };
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const typeFilter = document.getElementById('typeFilter');
    const searchInput = document.getElementById('searchInput');
    const activeFiltersContainer = document.getElementById('activeFilters');
    const resetBtn = document.getElementById('resetFilters');
    const allCards = document.querySelectorAll('.item-card');
    const resultsGrid = document.querySelector('.results-grid');

    let activeTypes = new Set();

    // === Create no-results message ===
    let noResultsMessage = document.querySelector('.no-results');

    if (!noResultsMessage) {
        noResultsMessage = document.createElement('p');
        noResultsMessage.className = 'no-results';
        noResultsMessage.style.color = 'white';
        noResultsMessage.style.textAlign = 'center';
        noResultsMessage.style.gridColumn = '1 / -1';
        noResultsMessage.style.display = 'none';
        noResultsMessage.style.padding = '30px';
        resultsGrid.appendChild(noResultsMessage);
    }

    // === SEARCH ===
    searchInput.addEventListener('input', applyFilters);

    // === TYPE FILTER ===
    typeFilter.addEventListener('change', () => {
        const selectedValue = typeFilter.value;

        if (selectedValue && !activeTypes.has(selectedValue)) {
            activeTypes.add(selectedValue);
            addFilterChip(selectedValue);
            disableOption(selectedValue);
            applyFilters();
        }

        typeFilter.value = '';
        activeFiltersContainer.style.display = "flex";
    });

    // === RESET FILTERS ===
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            activeTypes.clear();
            activeFiltersContainer.innerHTML = '';
            activeFiltersContainer.style.display = "none";

            searchInput.value = '';

            typeFilter.querySelectorAll('option').forEach(opt => {
                opt.disabled = false;
            });

            applyFilters();
        });
    }

    function addFilterChip(type) {
        const chip = document.createElement('div');
        chip.className = 'filter-chip';
        chip.innerHTML = `
            <span class="filter-chip-text">
                ${type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
            </span>
            <span class="remove-filter" data-type="${type}">×</span>
        `;

        chip.querySelector('.remove-filter').addEventListener('click', () => {
            activeTypes.delete(type);
            chip.remove();
            enableOption(type);
            applyFilters();

            if (activeFiltersContainer.children.length === 0) {
                activeFiltersContainer.style.display = "none";
            }
        });

        activeFiltersContainer.appendChild(chip);
    }

    function disableOption(value) {
        const option = typeFilter.querySelector(`option[value="${value}"]`);
        if (option) option.disabled = true;
    }

    function enableOption(value) {
        const option = typeFilter.querySelector(`option[value="${value}"]`);
        if (option) option.disabled = false;
    }

    function applyFilters() {
        const filtersArray = Array.from(activeTypes);
        const searchTerm = searchInput.value.trim().toLowerCase();

        let visibleCount = 0;

        allCards.forEach(card => {
            const img = card.querySelector('img');
            const itemType = img.dataset.type?.toLowerCase() || '';
            const description = img.dataset.desc?.toLowerCase() || '';

            const typeMatch =
                filtersArray.length === 0 ||
                filtersArray.includes(itemType);

            const searchMatch =
                !searchTerm ||
                description.includes(searchTerm) ||
                itemType.includes(searchTerm);

            if (typeMatch && searchMatch) {
                card.style.display = 'flex';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        if (visibleCount === 0) {
            noResultsMessage.style.display = 'block';

            if (allCards.length === 0) {
                noResultsMessage.textContent = "No items have been posted yet.";
            } else {
                noResultsMessage.textContent = "No items match your search.";
            }
        } else {
            noResultsMessage.style.display = 'none';
        }
    }

    // Run once on page load
    applyFilters();
});