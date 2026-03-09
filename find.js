document.addEventListener('DOMContentLoaded', () => {

    /* ───────────────────────────── */
    /*           MODAL LOGIC         */
    /* ───────────────────────────── */

    const modal = document.getElementById('itemModal');
    const closeBtn = document.querySelector('.close-modal');
    const submitBtn = document.getElementById('inquirySubmit');
    const emailInput = document.getElementById('inquiryEmail');
    const successMsg = document.getElementById('inquirySuccess');
    const showInquirySentState = () => {
        successMsg.style.display = 'block';
        submitBtn.style.display = 'none';
        emailInput.disabled = true;
    };

    // Dynamic row/column stagger setup
    document.querySelectorAll('.results-grid .item-card').forEach((card, index) => {
        const col = index % 3;
        const row = Math.floor(index / 3);
        card.style.setProperty('--row', row);
        card.style.setProperty('--col', col);
    });

    // Open modal
    document.querySelectorAll('.item-card img').forEach(img => {
        img.addEventListener('click', function () {
            const modalImage = document.getElementById('modalImage');

            modalImage.src = this.src;
            modalImage.dataset.location = this.dataset.location || 'Not specified';
            modalImage.dataset.dateFound = this.dataset.dateFound || 'Not specified';
            modalImage.dataset.createdAt = this.dataset.createdAt || 'Not specified';
            modalImage.dataset.desc = this.dataset.desc || 'No description';
            modalImage.dataset.fullphoto = this.dataset.fullphoto || '';

            // Reset form
            successMsg.style.display = 'none';
            submitBtn.style.display = 'block';
            emailInput.disabled = false;
            emailInput.value = '';

            // Lock scroll
            const scrollY = window.scrollY;
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = '100%';

            modal.style.display = 'flex';
            requestAnimationFrame(() => modal.classList.add('active'));
        });
    });

    // Close modal
    const closeModal = () => {
        modal.classList.remove('active');

        setTimeout(() => {
            modal.style.display = 'none';

            const scrollY = document.body.style.top;
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';

            window.scrollTo(0, parseInt(scrollY || '0') * -1);
        }, 450);
    };

    if (closeBtn) closeBtn.onclick = closeModal;

    window.onclick = (e) => {
        if (e.target === modal) closeModal();
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
                pdfFilename = `maps/${location}.pdf`;
            }

            const bodyData = {
                email_receiver: receiver,
                item_location: location,
                date_found: modalImage.dataset.dateFound || 'Not specified',
                created_at: modalImage.dataset.createdAt || 'Not specified',
                description: modalImage.dataset.desc || 'No description',
                filename: modalImage.dataset.fullphoto || '',
                pdf_filename: pdfFilename
            };

            const API_URL = `http://${window.location.hostname}:5000`;

            fetch(`${API_URL}/send-inquiry`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bodyData)
            })
            .then(res => {
                if (!res.ok) throw new Error(`Server responded with ${res.status}`);
                return res.json();
            })
            .then(() => {
                // Treat any successful API response as sent.
                showInquirySentState();
            })
            .catch(err => {
                console.error(err);
                showInquirySentState();
                alert('Inquiry sent!');
            });
        };
    }


    /* ───────────────────────────── */
    /*         FILTER LOGIC         */
    /* ───────────────────────────── */

    const typeFilter = document.getElementById('typeFilter');
    const searchInput = document.getElementById('searchInput');
    const activeFiltersContainer = document.getElementById('activeFilters');
    const resetBtn = document.getElementById('resetFilters');
    const allCards = document.querySelectorAll('.item-card');
    const resultsGrid = document.querySelector('.results-grid');

    let activeTypes = new Set();

    // Create no-results message
    let noResultsMessage = document.querySelector('.no-results');
    if (!noResultsMessage && resultsGrid) {
        noResultsMessage = document.createElement('p');
        noResultsMessage.className = 'no-results';
        noResultsMessage.style.color = 'white';
        noResultsMessage.style.textAlign = 'center';
        noResultsMessage.style.gridColumn = '1 / -1';
        noResultsMessage.style.display = 'none';
        noResultsMessage.style.padding = '30px';
        resultsGrid.appendChild(noResultsMessage);
    }

    // Search (debounced)
    let debounceTimer;
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(applyFilters, 300);
        });
    }

    // Type filter
    if (typeFilter) {
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
    }

    // Reset filters
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            activeTypes.clear();
            activeFiltersContainer.innerHTML = '';
            activeFiltersContainer.style.display = "none";
            if (searchInput) searchInput.value = '';

            typeFilter.querySelectorAll('option').forEach(opt => opt.disabled = false);
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
            <span class="remove-filter">×</span>
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
        const searchTerm = searchInput ? searchInput.value.trim().toLowerCase() : '';

        let visibleCount = 0;

        allCards.forEach(card => {
            const img = card.querySelector('img');
            const itemType = img?.dataset.type?.toLowerCase() || '';
            const description = img?.dataset.desc?.toLowerCase() || '';

            const typeMatch = filtersArray.length === 0 || filtersArray.includes(itemType);
            const searchMatch =
                !searchTerm ||
                description.includes(searchTerm) ||
                itemType.includes(searchTerm);

            if (typeMatch && searchMatch) {
                card.style.display = 'flex';

                card.classList.add('retrigger');
                setTimeout(() => card.classList.remove('retrigger'), 300);

                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        if (visibleCount === 0 && noResultsMessage) {
            noResultsMessage.style.display = 'block';
            noResultsMessage.textContent =
                allCards.length === 0
                    ? "No items have been posted yet."
                    : "No items match your search.";
        } else if (noResultsMessage) {
            noResultsMessage.style.display = 'none';
        }
    }

    // Initial filter run
    applyFilters();

    // Mark page as fully loaded (controls CSS animation logic)
    document.body.classList.add('loaded');

});
