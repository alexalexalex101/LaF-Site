function updateFileInfo(input, infoSpan) {
    const files = input.files;

    if (files.length === 0) {
        infoSpan.textContent = "No file selected";
    } else if (input.multiple) {
        infoSpan.textContent = `${files.length} file${files.length > 1 ? 's' : ''} selected`;
    } else {
        infoSpan.textContent = files[0].name;
    }
}

/* ───────────────────────────────────────────────
   Thumbnail (single file) + Image Preview
─────────────────────────────────────────────── */

const thumbnailInput = document.getElementById('thumbnail');
const thumbnailInfo =
    document.querySelector('#thumbnail ~ .file-info') ||
    document.querySelector('.custom-file-upload .file-info');

const previewContainer = document.getElementById('thumbnailPreview');
const previewImage = document.getElementById('thumbnailPreviewImg');

if (thumbnailInput && thumbnailInfo) {

    // Update file name + preview when file is chosen
    thumbnailInput.addEventListener('change', () => {
        updateFileInfo(thumbnailInput, thumbnailInfo);

        const file = thumbnailInput.files[0];

        // No file → hide preview
        if (!file) {
            if (previewContainer) {
                previewContainer.style.display = "none";
            }
            return;
        }

        // Only allow images
        if (!file.type.startsWith("image/")) {
            alert("Please select an image file.");
            thumbnailInput.value = "";
            thumbnailInfo.textContent = "No file selected";
            if (previewContainer) {
                previewContainer.style.display = "none";
            }
            return;
        }

        const reader = new FileReader();

        reader.onload = function (e) {
            if (previewImage && previewContainer) {
                previewImage.src = e.target.result;
                previewContainer.style.display = "flex";
            }
        };

        reader.readAsDataURL(file);
    });

    // Custom button opens file picker
    const thumbnailButton = thumbnailInput
        .closest('.custom-file-upload')
        ?.querySelector('.file-btn');

    if (thumbnailButton) {
        thumbnailButton.addEventListener('click', (e) => {
            e.preventDefault();
            thumbnailInput.click();
        });
    }
}
