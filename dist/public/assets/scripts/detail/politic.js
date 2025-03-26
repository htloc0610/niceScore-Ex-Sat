const form = {
    docType: document.getElementById('documentType'),
    docNumber: document.getElementById('documentNumber'),
    issueDate: document.getElementById('issueDate'),
    expiryDate: document.getElementById('expiryDate'),
    issuePlace: document.getElementById('issuePlace'),
    issueCountry: document.getElementById('issueCountry'),
    notes: document.getElementById('notes'),
    hasChip: document.getElementById('hasChip'),
    editBtn: document.getElementById('editBtn')
};

const fieldGroups = {
    CMND: [form.docNumber, form.issueDate, form.expiryDate, form.issuePlace],
    CCCD: [form.docNumber, form.issueDate, form.expiryDate, form.issuePlace, form.hasChip],
    Passport: [form.docNumber, form.issueDate, form.expiryDate, form.issuePlace, form.issueCountry, form.notes]
};

let isEditing = false;

form.editBtn.addEventListener('click', toggleEditMode);
form.docType.addEventListener('change', updateFieldVisibility);

function toggleEditMode() {
    isEditing = !isEditing;

    // Bật/tắt chế độ chỉnh sửa
    const allFields = [
        form.docType, form.docNumber, form.issueDate,
        form.expiryDate, form.issuePlace, form.issueCountry,
        form.notes, form.hasChip
    ];

    allFields.forEach(field => {
        if (isEditing) {
            field.removeAttribute('readonly');
            field.disabled = false;
            field.classList.remove('bg-gray-100', 'cursor-not-allowed');
            field.classList.add('bg-white', 'border-blue-300');
        } else {
            field.setAttribute('readonly', true);
            if (field === form.docType) field.disabled = true;
            field.classList.add('bg-gray-100', 'cursor-not-allowed');
            field.classList.remove('bg-white', 'border-blue-300');
        }
    });

    updateFieldVisibility();
}

function updateFieldVisibility() {
    const docType = form.docType.value;
    const allGroups = [...Object.values(fieldGroups)].flat();
    const uniqueFields = [...new Set(allGroups)];

    // Ẩn các field không cần thiết
    uniqueFields.forEach(field => {
        const formGroup = field.closest('.w-1/2') || field.closest('div:not(.flex)');
        if (formGroup) {
            if (isEditing && !fieldGroups[docType].includes(field)) {
                formGroup.classList.add('hidden');
            } else {
                formGroup.classList.remove('hidden');
            }
        }
    });
}

// Khởi tạo ban đầu
updateFieldVisibility();