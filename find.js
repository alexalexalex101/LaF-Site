document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('itemModal');
    const closeBtn = document.querySelector('.close-modal');
    const submitBtn = document.getElementById('inquirySubmit');
    const emailInput = document.getElementById('inquiryEmail');
    const successMsg = document.getElementById('inquirySuccess');

    // Open with transition
    document.querySelectorAll('.item-card img').forEach(img => {
        img.addEventListener('click', function() {
            document.getElementById('modalImage').src = this.src;

            // Reset form
            successMsg.style.display = 'none';
            submitBtn.style.display = 'block';
            emailInput.disabled = false;
            emailInput.value = '';

            // Trigger animation
            modal.style.display = 'flex';           // make visible first
            setTimeout(() => {                      // tiny delay to trigger transition
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
            if (emailInput.value.trim() !== '') {
                successMsg.style.display = 'block';
                submitBtn.style.display = 'none';
                emailInput.disabled = true;
            } else {
                alert('Please enter your email address');
            }
        };
    }
});