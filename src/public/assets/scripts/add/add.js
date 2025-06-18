const addStudentForm = document.getElementById("addStudentForm");
let t; // Local reference to the global translations

/**
 * Get the latest translations from the LanguageHandler
 * This ensures we always have the current language's translations
 */
function getLatestTranslations() {
    if (window.LanguageHandler && window.LanguageHandler.translations) {
        t = window.LanguageHandler.translations;
        console.log("Retrieved latest translations for add student functionality");
        return true;
    } else {
        console.warn("LanguageHandler translations not available");
        return false;
    }
}

/**
 * Fallback function to load translations directly if LanguageHandler is not available
 */
async function loadTranslations() {
    // First try to get translations from LanguageHandler
    if (getLatestTranslations()) {
        return true;
    }
    
    // Fallback to direct loading
    const lang = localStorage.getItem("lang") || 'en';
    const translationUrl = `/assets/scripts/locales/${lang}.json`;

    try {
        const res = await fetch(translationUrl);
        if (!res.ok) throw new Error("Failed to load translations");
        t = await res.json();
        console.log("Loaded translations directly for add student page");
        return true;
    } catch (error) {
        console.error("Error loading translations:", error);
        return false;
    }
}

/**
 * Update select placeholders with translated text
 */
function updateSelectPlaceholders() {
    // Get translations
    const facultyPlaceholder = window.t && typeof window.t === 'function' 
        ? window.t('index.js.add.select.faculty') 
        : (t?.index?.js?.add?.select?.faculty || "Select faculty");
        
    const coursePlaceholder = window.t && typeof window.t === 'function'
        ? window.t('index.js.add.select.course')
        : (t?.index?.js?.add?.select?.course || "Select course");
        
    const statusPlaceholder = window.t && typeof window.t === 'function'
        ? window.t('index.js.add.select.status')
        : (t?.index?.js?.add?.select?.status || "Select status");
    
    // Update faculty select if it exists
    const facultySelect = document.getElementById("faculty_id");
    if (facultySelect && facultySelect.options.length > 0) {
        facultySelect.options[0].textContent = facultyPlaceholder;
    }
    
    // Update course select if it exists
    const courseSelect = document.getElementById("course_id");
    if (courseSelect && courseSelect.options.length > 0) {
        courseSelect.options[0].textContent = coursePlaceholder;
    }
    
    // Update status select if it exists
    const statusSelect = document.getElementById("status_id");
    if (statusSelect && statusSelect.options.length > 0) {
        statusSelect.options[0].textContent = statusPlaceholder;
    }
}

document.addEventListener("DOMContentLoaded", async function () {
    // Initial load
    await loadTranslations();
    
    // Listen for custom language change events
    window.addEventListener('languageChanged', async function() {
        console.log("Language change detected in add.js");
        await loadTranslations();
        updateSelectPlaceholders(); // Update selection placeholders when language changes
    });//configurations for email warning and phone warning
    fetch("/api/configurations")
    .then((response) => response.json())
    .then((data) => {
        const configurations = data.configurations;

        // Convert configurations to a map for easy access
        const configMap = configurations.reduce((acc, item) => {
            acc[item.config_key] = item.config_value;
            return acc;
        }, {});

        // Update email warning with translation
        const emailWarning = document.getElementById("emailWarning");
        if (emailWarning && configMap.allowed_email_domain) {
            const baseEmailWarning = t?.detail?.contactInfo?.emailWarningPrefix || 'Only accepts emails from:';
            emailWarning.textContent = `${baseEmailWarning} @${configMap.allowed_email_domain}`;
        }

        // Update phone warning with translation
        const phoneWarning = document.getElementById("phoneWarning");
        if (phoneWarning && configMap.phone_country_code) {
            const basePhoneWarning = t?.detail?.contactInfo?.phoneWarningPrefix || 'Phone number should start with:';
            phoneWarning.textContent = `${basePhoneWarning} ${configMap.phone_country_code}`;
        }
    })
    .catch(error => {
        console.error("Error fetching configurations:", error);
    })

    fetch("/api/faculty")
        .then((response) => response.json())
        .then((data) => {
            const facultySelect = document.getElementById("faculty_id");

            // Clear any existing options
            facultySelect.innerHTML = "";            // Add a default option with translation
            const defaultOption = document.createElement("option");
            defaultOption.value = "";
            
            // Use translations if available
            const facultyPlaceholder = window.t && typeof window.t === 'function' 
                ? window.t('index.js.add.select.faculty') 
                : (t?.index?.js?.add?.select?.faculty || "Select faculty");
                
            defaultOption.textContent = facultyPlaceholder;
            facultySelect.appendChild(defaultOption);

            // Add the fetched faculties to the select list
            data.faculties.forEach((faculty) => {
                const option = document.createElement("option");
                option.value = faculty.faculty_id; // Set faculty_id as value
                option.textContent = faculty.name; // Set name as text
                facultySelect.appendChild(option);
            });
        })
        .catch((error) => console.error("Error fetching faculties:", error));

    fetch("/api/course")
        .then((response) => response.json())
        .then((data) => {
            const courseSelect = document.getElementById("course_id");
            console.log(courseSelect);
            // Clear any existing options
            courseSelect.innerHTML = "";            // Add a default option with translation
            const defaultOption = document.createElement("option");
            defaultOption.value = "";
            
            // Use translations if available
            const coursePlaceholder = window.t && typeof window.t === 'function'
                ? window.t('index.js.add.select.course')
                : (t?.index?.js?.add?.select?.course || "Select course");
                
            defaultOption.textContent = coursePlaceholder;
            courseSelect.appendChild(defaultOption);

            // Add the fetched faculties to the select list
            console.log(data.courses);
            data.courses.forEach((course) => {
                const option = document.createElement("option");
                option.value = course.course_id; // Set course_id as value
                option.textContent = course.course_name; // Set name as text
                courseSelect.appendChild(option);
            });
        })
        .catch((error) => console.error("Error fetching faculties:", error));

    fetch("/api/status")
        .then((response) => response.json())
        .then((data) => {
            const statusSelect = document.getElementById("status_id");

            // Clear any existing options
            statusSelect.innerHTML = "";            // Add a default option with translation
            const defaultOption = document.createElement("option");
            defaultOption.value = "";
            
            // Use translations if available
            const statusPlaceholder = window.t && typeof window.t === 'function'
                ? window.t('index.js.add.select.status')
                : (t?.index?.js?.add?.select?.status || "Select status");
                
            defaultOption.textContent = statusPlaceholder;
            statusSelect.appendChild(defaultOption);

            // Add the fetched faculties to the select list
            data.status.forEach((status) => {
                const option = document.createElement("option");
                option.value = status.status_id; // Set status_id as value
                option.textContent = status.name; // Set name as text
                statusSelect.appendChild(option);
            });
        })
        .catch((error) => console.error("Error fetching faculties:", error));

    const idTypeRadios = document.querySelectorAll('input[name="type"]');
    const hasChipLabel = document.getElementById("has_chip-label");
    const countryOfIssueDiv = document.getElementById("country_of_issue-div");
    const notesDiv = document.getElementById("notes-div");

    function updateVisibility() {
        const selectedType = document.querySelector('input[name="type"]:checked').value;

        if (selectedType === "CCCD") {
            hasChipLabel.classList.remove("hidden");
            countryOfIssueDiv.classList.add("hidden");
            notesDiv.classList.add("hidden");
        } else if (selectedType === "Passport") {
            hasChipLabel.classList.add("hidden");
            countryOfIssueDiv.classList.remove("hidden");
            notesDiv.classList.remove("hidden");
        } else {
            hasChipLabel.classList.add("hidden");
            countryOfIssueDiv.classList.add("hidden");
            notesDiv.classList.add("hidden");
        }
    }

    idTypeRadios.forEach(radio => {
        radio.addEventListener("change", updateVisibility);
    });

    // Run initially to set correct visibility
    updateVisibility();    // Update placeholders after all fetch requests complete
    updateSelectPlaceholders();
    
    addStudentForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent page reload

        // Get form data
        const formData = new FormData(event.target);

        // Convert FormData to JSON object
        const data = {};
        formData.forEach((value, key) => {
            const keys = key.split("."); // Split 'permanent.house_number' into ['permanent', 'house_number']
            let current = data;

            // Loop through keys to create nested structure
            for (let i = 0; i < keys.length; i++) {
                if (i === keys.length - 1) {
                    current[keys[i]] = value; // Assign value
                } else {
                    current[keys[i]] = current[keys[i]] || {}; 
                    current = current[keys[i]]; 
                }
            }
        });

        console.log("Form Data JSON:", data);

        fetch("/api/student", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
            .then(response => {
                if (!response.ok) {
                    // If response is not OK (e.g., 400 Bad Request), throw an error
                    return response.json().then(err => { throw new Error(err.message); });
                }
                return response.json();
            })
            .then(result => {
                // alert("Thêm sinh viên thành công!");                // Always get the latest translations
                getLatestTranslations();
                
                // Get translated text
                let successTitle = 'Thành công!';
                let successText = 'Thêm sinh viên thành công!';
                let okButton = 'OK';
                
                if (window.t && typeof window.t === 'function') {
                    successTitle = window.t('index.js.add.success.title');
                    successText = window.t('index.js.add.success.text');
                    okButton = window.t('index.js.add.button.ok');
                } else if (t && t.index && t.index.js && t.index.js.add) {
                    successTitle = t.index.js.add.success.title || successTitle;
                    successText = t.index.js.add.success.text || successText;
                    okButton = t.index.js.add.button.ok || okButton;
                }
                
                Swal.fire({
                    icon: 'success',
                    title: successTitle,
                    text: successText,
                    confirmButtonText: okButton,
                    timer: 2000,
                    timerProgressBar: true,
                    showConfirmButton: false
                  });

                  
                console.log("Server response:", result);
            })
            .catch(error => {
                console.error("Error submitting form:", error);
                // alert("Đã xảy ra lỗi: " + error.message);                // Get latest translations
                getLatestTranslations();
                
                // Get translated text
                let errorTitle = 'Lỗi!';
                let errorPrefix = 'Đã xảy ra lỗi: ';
                let closeButton = 'Đóng';
                
                if (window.t && typeof window.t === 'function') {
                    errorTitle = window.t('index.js.add.error.title');
                    errorPrefix = window.t('index.js.add.error.text');
                    closeButton = window.t('index.js.add.button.close');
                } else if (t && t.index && t.index.js && t.index.js.add) {
                    errorTitle = t.index.js.add.error.title || errorTitle;
                    errorPrefix = t.index.js.add.error.text || errorPrefix;
                    closeButton = t.index.js.add.button.close || closeButton;
                }
                
                Swal.fire({
                    icon: 'error',
                    title: errorTitle,
                    text: errorPrefix + error.message,
                    confirmButtonText: closeButton
                  });
                  
            });

    });
})