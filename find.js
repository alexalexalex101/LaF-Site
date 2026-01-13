document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('itemModal');
    const closeBtn = document.querySelector('.close-modal');
    const submitBtn = document.getElementById('inquirySubmit');
    const emailInput = document.getElementById('inquiryEmail');
    const successMsg = document.getElementById('inquirySuccess');

document.querySelectorAll('.item-card img').forEach(img => {
    img.addEventListener('click', function() {
        const modalImg = document.getElementById('modalImage');

        // Copy src and ALL data attributes
        modalImg.src = this.src;
        modalImg.dataset.location = this.dataset.location;
        modalImg.dataset.dateFound = this.dataset.dateFound;
        modalImg.dataset.createdAt = this.dataset.createdAt;
        modalImg.dataset.desc = this.dataset.desc;
        modalImg.dataset.fullphoto = this.dataset.fullphoto;

        // Reset form
        successMsg.style.display = 'none';
        submitBtn.style.display = 'block';
        emailInput.disabled = false;
        emailInput.value = '';

        // Trigger animation
        modal.style.display = 'flex';
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);

        document.body.style.overflow = 'hidden';
    });
});

    // Close with fade-out
    const closeModal = () => {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 400); // match transition duration
        document.body.style.overflow = 'auto';
    };

    closeBtn.onclick = closeModal;

    window.onclick = (e) => {
        if (e.target === modal) {
            closeModal();
        }
    };

    // Fake submit
    if (submitBtn) {
        submitBtn.onclick = () => {
            const receiver = document.getElementById('inquiryEmail').value;
            if (!receiver) {
                alert('Please enter your email');
                return;
            }

            const bodyData = {
                email_receiver: receiver,
                item_location: modalImage.dataset.location || 'Not specified',
                date_found: modalImage.dataset.dateFound || 'Not specified',
                created_at: modalImage.dataset.createdAt || 'Not specified',
                description: modalImage.dataset.desc || 'No description',
                filename: modalImage.dataset.fullphoto  // relative path like "uploads/abc.jpg"
            };

            fetch('http://192.168.1.202:5000/send-inquiry', {  // ← YOUR COMPUTER'S IP HERE
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bodyData)
            })
            .then(res => res.json())
            .then(data => {
                if (data.message) {
                    // Show success in modal
                    document.getElementById('inquirySuccess').style.display = 'block';
                    document.getElementById('inquirySubmit').style.display = 'none';
                } else {
                    alert('Error: ' + (data.error || 'Unknown error'));
                }
            })
            .catch(err => alert('Failed to send inquiry: ' + err));
        };
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // Core elements
    const typeFilter = document.getElementById('typeFilter');
    const searchInput = document.getElementById('searchInput');
    const activeFiltersContainer = document.getElementById('activeFilters');
    const resetBtn = document.getElementById('resetFilters');
    const allCards = document.querySelectorAll('.item-card');

    let activeTypes = new Set();

    // === TYPE FILTERING ===
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

    // === Create or get the no-results message element ===
    let noResultsMessage = document.querySelector('.no-results');

    if (!noResultsMessage) {
        noResultsMessage = document.createElement('p');
        noResultsMessage.className = 'no-results';
        noResultsMessage.style.color = 'white';
        noResultsMessage.style.textAlign = 'center';
        noResultsMessage.style.gridColumn = '1 / -1';
        document.querySelector('.results-grid').appendChild(noResultsMessage);
    }

    // === REAL-TIME SEARCH + TYPE FILTER COMBINED ===
    function applyFilters() {
        const filtersArray = Array.from(activeTypes);
        const searchTerm = searchInput.value.trim().toLowerCase();

        let hasAnyFilterOrSearch = 
            filtersArray.length > 0 || 
            searchTerm.length > 0;

        allCards.forEach(card => {
            const img = card.querySelector('img');
            const itemType = img.dataset.type?.toLowerCase() || '';
            const description = img.dataset.desc?.toLowerCase() || '';

            const typeMatch = filtersArray.length === 0 || filtersArray.some(f => itemType === f);
            const searchMatch = !searchTerm || 
                               description.includes(searchTerm) || 
                               itemType.includes(searchTerm);

            card.style.display = (typeMatch && searchMatch) ? 'flex' : 'none';
        });

        // Count visible cards
        const visibleCards = document.querySelectorAll('.item-card[style*="flex"]');
        const noItemsAtAll = allCards.length === 0;

        if (visibleCards.length === 0) {
            // Decide which message to show
            if (!hasAnyFilterOrSearch && noItemsAtAll) {
                noResultsMessage.textContent = "No items are currently posted.";
            } else {
                noResultsMessage.textContent = "No items match your search or filters.";
            }
            noResultsMessage.style.display = 'block';
        } else {
            noResultsMessage.style.display = 'none';
        }
    }

    // Trigger filters on every keystroke in search
    searchInput.addEventListener('input', applyFilters);

    // Reset button
    resetBtn.addEventListener('click', () => {
        activeTypes.clear();
        activeFiltersContainer.innerHTML = '';
        Array.from(typeFilter.options).forEach(opt => {
            if (opt.value !== '') opt.disabled = false;
        });
        searchInput.value = '';
        applyFilters();
        typeFilter.value = '';
    });

    // Initial load - very important!
    applyFilters();
});