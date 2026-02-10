document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form.report-form');
    const thumbnailInput = document.getElementById('thumbnail');
    const fileInfoSpan = document.querySelector('.custom-file-upload .file-info');
    const previewContainer = document.getElementById('thumbnailPreview');
    const previewImage = document.getElementById('thumbnailPreviewImg');

    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    const MAX_IMAGE_WIDTH = 10000;
    const MAX_IMAGE_HEIGHT = 10000;
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

    if (!thumbnailInput || !form) return;

    // File change handler (preview + basic check)
    thumbnailInput.addEventListener('change', () => {
        const file = thumbnailInput.files[0];

        fileInfoSpan.textContent = "No file selected";
        if (previewContainer) previewContainer.style.display = "none";

        if (!file) return;

        if (!ALLOWED_TYPES.includes(file.type)) {
            alert("Only JPEG, PNG, GIF, or WebP images allowed.");
            thumbnailInput.value = "";
            return;
        }

        if (file.size > MAX_FILE_SIZE) {
            alert(`File too large! Max allowed: ${MAX_FILE_SIZE / 1024 / 1024}MB`);
            thumbnailInput.value = "";
            return;
        }

        // Valid → preview
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                if (img.width > MAX_IMAGE_WIDTH || img.height > MAX_IMAGE_HEIGHT) {
                    alert(`Image too large! Max dimensions: ${MAX_IMAGE_WIDTH}×${MAX_IMAGE_HEIGHT}px`);
                    thumbnailInput.value = "";
                    return;
                }
                previewImage.src = e.target.result;
                previewContainer.style.display = "flex";
                fileInfoSpan.textContent = file.name;
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });

    // Custom button click
    document.querySelector('.file-btn')?.addEventListener('click', e => {
        e.preventDefault();
        thumbnailInput.click();
    });

    // Block submit if no file
    form.addEventListener('submit', e => {
        const file = thumbnailInput.files[0];

        if (!file) {
            e.preventDefault();
            alert("You must upload an image thumbnail to submit the report!");
            thumbnailInput.focus();
            return false;
        }

        // Extra safety (type + size)
        if (!file.type.startsWith("image/")) {
            e.preventDefault();
            alert("Only image files are allowed.");
            return false;
        }

        if (file.size > MAX_FILE_SIZE) {
            e.preventDefault();
            alert("File too large! Max 5MB.");
            return false;
        }

        // Submit OK
    });
});