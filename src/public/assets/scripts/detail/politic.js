// Global translations object
let t = key => key; // Default fallback function that returns the key itself

document.addEventListener('DOMContentLoaded', async function() {
    // Load translations
    const lang = localStorage.getItem("lang") || document.documentElement.getAttribute('data-lang') || 'en';
    const translationUrl = `/assets/scripts/locales/${lang}.json`;

    try {
        const res = await fetch(translationUrl);
        if (res.ok) {
            const translations = await res.json();
            // Create translation function
            t = key => {
                // Navigate through nested keys (e.g. "detail.document.title")
                const parts = key.split('.');
                let value = translations;
                for (const part of parts) {
                    if (value && typeof value === 'object' && part in value) {
                        value = value[part];
                    } else {
                        return key; // Key not found, return the key itself
                    }
                }
                return value;
            };
            console.log("Loaded translations for politic.js", lang);
            initializeForm();
        } else {
            console.error("Failed to load translations");
            // Even if translations fail, still initialize the form
            initializeForm();
        }
    } catch (error) {
        console.error("Error loading translations:", error);
        // Even if translations fail, still initialize the form
        initializeForm();
    }
});

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

// Make sure all form elements exist
for (const [key, element] of Object.entries(form)) {
    if (!element) {
        console.warn(`Form element not found: ${key}`);
    }
}

const fieldGroups = {
    CMND: [form.docNumber, form.issueDate, form.expiryDate, form.issuePlace],
    CCCD: [form.docNumber, form.issueDate, form.expiryDate, form.issuePlace, form.hasChip],
    Passport: [form.docNumber, form.issueDate, form.expiryDate, form.issuePlace, form.issueCountry, form.notes]
};

let isEditing = false;

function initializeForm() {
    if (!form.editBtn || !form.docType) {
        console.error("Required form elements not found");
        return;
    }

    // Add event listeners if elements exist
    form.editBtn.addEventListener('click', toggleEditMode);
    form.docType.addEventListener('change', updateFieldVisibility);
    
    // Initialize field visibility
    updateFieldVisibility();
}

function toggleEditMode() {
    isEditing = !isEditing;

    // Toggle edit mode for all relevant form fields
    const allFields = Object.values(form).filter(field => field && field !== form.editBtn);

    allFields.forEach(field => {
        if (field) {
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
        }
    });

    updateFieldVisibility();
}

function updateFieldVisibility() {
    if (!form.docType) return;
    
    const docType = form.docType.value;
    const relevantFields = fieldGroups[docType] || [];
    
    // Create a set of all unique fields from all groups
    const allFields = [...new Set(Object.values(fieldGroups).flat())];

    // For each field, show or hide based on whether it's in the relevant fields
    allFields.forEach(field => {
        if (!field) return;
        
        const formGroup = field.closest('.w-1/2') || field.closest('div:not(.flex)');
        if (formGroup) {
            if (isEditing && !relevantFields.includes(field)) {
                formGroup.classList.add('hidden');
            } else {
                formGroup.classList.remove('hidden');
            }
        }
    });
}