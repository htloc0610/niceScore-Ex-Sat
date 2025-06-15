let t; // Global translations object

document.addEventListener('DOMContentLoaded', async function () {
    // Get student id from the URL like /detail/:studentId
    const url = window.location.pathname;
    const studentId = url.substring(url.lastIndexOf('/') + 1);
    console.log("Loading student data for ID:", studentId);
    
    // Check if we have server-side rendered data
    const hasServerData = typeof window.serverStudentData !== 'undefined' && window.serverStudentData !== null;
    console.log("Server-provided data available:", hasServerData);
    
    // Load translations
    const lang = localStorage.getItem("lang") || document.documentElement.getAttribute('data-lang') || 'en';
    const translationUrl = `/assets/scripts/locales/${lang}.json`;

    try {
        const res = await fetch(translationUrl);
        if (!res.ok) throw new Error("Failed to load translations");
        t = await res.json();
        console.log("Loaded translations for detail page", lang);
        
        // After translations are loaded, ensure all data is properly displayed
        if (hasServerData) {
            // Just load supporting data (faculties, courses, statuses) but don't override the main student data
            await fetchSupportingData();
        } else {
            // If no server data, load everything from the API
            await fetchAndPopulateData();
        }
    } catch (error) {
        console.error("Error loading translations:", error);
        // Even if translations fail, still try to ensure data is displayed
        if (hasServerData) {
            await fetchSupportingData();
        } else {
            await fetchAndPopulateData();
        }
    }

    // Function to fetch status at begin and after update 
    async function fetchStudentStatus(id) {
        try {
            const response = await fetch(`/api/status`);
            if (!response.ok) throw new Error("Failed to fetch statuses");
            
            const data = await response.json();
            const statusSelect = document.getElementById("status");
            statusSelect.innerHTML = ``;
            const statuses = data.status;

            statuses.forEach((status) => {
                const option = document.createElement("option");
                option.value = status.status_id; // Set status_id as value
                
                // Use translated name based on current language
                const displayName = lang === 'vi' ? status.name_vi : status.name_en;
                option.textContent = displayName || status.name;
                
                if (parseInt(status.status_id) === parseInt(id))
                    option.setAttribute("selected", "selected");
                statusSelect.appendChild(option);
            });
        } catch (error) {
            console.error("Error fetching status data:", error);
        }
    }

    // Function to fetch supporting data (faculties, courses, statuses) without changing student data
    async function fetchSupportingData() {
        try {
            // Fetch faculty data with language support
            try {
                const facultyResponse = await fetch("/api/faculty");
                if (!facultyResponse.ok) throw new Error("Failed to fetch faculties");
                
                const facultyData = await facultyResponse.json();
                const facultySelect = document.getElementById("faculty");
                
                // Keep the current selected value
                const currentValue = facultySelect.value;
                
                // If there's only one option (the server-rendered one), we need to load the full list
                if (facultySelect.options.length <= 1) {
                    facultyData.faculties.forEach((faculty) => {
                        // Skip if this option is already in the select
                        if (faculty.faculty_id == currentValue) return;
                        
                        const option = document.createElement("option");
                        option.value = faculty.faculty_id;
                        
                        // Use translated faculty name based on current language
                        option.textContent = lang === 'vi' ? faculty.name_vi : faculty.name_en;
                        facultySelect.appendChild(option);
                    });
                }
            } catch (error) {
                console.error("Error fetching faculty data:", error);
            }

            // Fetch course data with language support
            try {
                const courseResponse = await fetch("/api/course");
                if (!courseResponse.ok) throw new Error("Failed to fetch courses");
                
                const courseData = await courseResponse.json();
                const courseSelect = document.getElementById("course");
                
                // Keep the current selected value
                const currentValue = courseSelect.value;
                
                // If there's only one option (the server-rendered one), we need to load the full list
                if (courseSelect.options.length <= 1) {
                    courseData.courses.forEach((course) => {
                        // Skip if this option is already in the select
                        if (course.course_id == currentValue) return;
                        
                        const option = document.createElement("option");
                        option.value = course.course_id;
                        
                        // Use translated course name based on current language
                        option.textContent = lang === 'vi' ? course.course_name_vi : course.course_name_en;
                        courseSelect.appendChild(option);
                    });
                }
            } catch (error) {
                console.error("Error fetching course data:", error);
            }

            // Fetch student status
            try {
                const statusSelect = document.getElementById("status");
                const currentStatusId = statusSelect.value;
                
                // Only load all statuses if we have just one option (the server-rendered one)
                if (statusSelect.options.length <= 1) {
                    await fetchStudentStatus(currentStatusId);
                }
            } catch (error) {
                console.error("Error fetching status data:", error);
            }

            // Fetch configurations for email and phone warnings
            try {
                const configResponse = await fetch("/api/configurations");
                if (!configResponse.ok) throw new Error("Failed to fetch configurations");
                
                const configData = await configResponse.json();
                const configurations = configData.configurations;

                // Convert to a map for easier access
                const configMap = configurations.reduce((acc, item) => {
                    acc[item.config_key] = item.config_value;
                    return acc;
                }, {});

                // Update warning texts with proper translations
                const emailWarning = document.getElementById("emailWarning");
                if (emailWarning) {
                    const emailDomain = configMap.allowed_email_domain || "example.com";
                    emailWarning.textContent = lang === 'vi' 
                        ? `Chỉ chấp nhận email: @${emailDomain}` 
                        : `Only accepts emails: @${emailDomain}`;
                }

                const phoneWarning = document.getElementById("phoneWarning");
                if (phoneWarning) {
                    const phoneCode = configMap.phone_country_code || "+00";
                    phoneWarning.textContent = lang === 'vi' 
                        ? `Chỉ chấp nhận SĐT ${phoneCode}` 
                        : `Only accepts phone numbers: ${phoneCode}`;
                }
            } catch (error) {
                console.error("Error fetching configurations:", error);
            }
        } catch (error) {
            console.error("Error fetching supporting data:", error);
        }
    }
    
    // Function to fetch data from the API and populate the form fields
    async function fetchAndPopulateData() {
        try {
            const response = await fetch(`/api/student/${studentId}`);
            if (!response.ok) throw new Error("Failed to fetch student data");
            
            const data = await response.json();

            if (data.message === "Student found") {
                const student = data.student;
                console.log("Retrieved student data:", student);

                // Populate the form fields with the fetched data
                document.getElementById('studentId').value = studentId;
                document.getElementById('fullName').value = student.full_name || '';
                document.getElementById('dob').value = student.date_of_birth || '';
                document.getElementById('gender').value = student.gender || '';
                document.getElementById('program').value = student.program || '';
                
                // Populate address fields with null checks
                if (student.temporaryAddress) {
                    document.getElementById('tempHouseNumber').value = student.temporaryAddress.house_number || '';
                    document.getElementById('tempStreet').value = student.temporaryAddress.street_name || '';
                    document.getElementById('tempWard').value = student.temporaryAddress.ward || '';
                    document.getElementById('tempDistrict').value = student.temporaryAddress.district || '';
                    document.getElementById('tempCity').value = student.temporaryAddress.city || '';
                    document.getElementById('tempCountry').value = student.temporaryAddress.country || '';
                    document.getElementById('tempAddress').value = student.temporary_address_id || '';
                }
                
                if (student.mailingAddress) {
                    document.getElementById('mailHouseNumber').value = student.mailingAddress.house_number || '';
                    document.getElementById('mailStreet').value = student.mailingAddress.street_name || '';
                    document.getElementById('mailWard').value = student.mailingAddress.ward || '';
                    document.getElementById('mailDistrict').value = student.mailingAddress.district || '';
                    document.getElementById('mailCity').value = student.mailingAddress.city || '';
                    document.getElementById('mailCountry').value = student.mailingAddress.country || '';
                    document.getElementById('mailAddress').value = student.mailing_address_id || '';
                }
                
                document.getElementById('email').value = student.email || '';
                document.getElementById('phone').value = student.phone_number || '';
                
                if (student.identification) {
                    document.getElementById('documentId').value = student.identification_id || '';
                    document.getElementById('documentType').value = student.identification.type || '';
                    document.getElementById('documentType').dispatchEvent(new Event("change"));
                    document.getElementById('documentNumber').value = student.identification.number || '';
                    document.getElementById('issueDate').value = student.identification.issue_date || '';
                    document.getElementById('expiryDate').value = student.identification.expiry_date || '';
                    document.getElementById('issuePlace').value = student.identification.place_of_issue || '';
                    document.getElementById('issueCountry').value = student.identification.country_of_issue || '';
                    document.getElementById('notes').value = student.identification.notes || '';
                    
                    // Handle has_chip field with translation
                    const hasChipSelect = document.getElementById('hasChip');
                    if (hasChipSelect) {
                        hasChipSelect.value = student.identification.has_chip ? 
                            (lang === 'vi' ? 'Có' : 'Yes') : 
                            (lang === 'vi' ? 'Không' : 'No');
                    }
                }
                
                if (student.permanentAddress) {
                    document.getElementById('permHouseNumber').value = student.permanentAddress.house_number || '';
                    document.getElementById('permStreet').value = student.permanentAddress.street_name || '';
                    document.getElementById('permWard').value = student.permanentAddress.ward || '';
                    document.getElementById('permDistrict').value = student.permanentAddress.district || '';
                    document.getElementById('permCity').value = student.permanentAddress.city || '';
                    document.getElementById('permCountry').value = student.permanentAddress.country || '';
                    document.getElementById('permAddress').value = student.permanent_address_id || '';
                }
                
                document.getElementById('nationality').value = student.nationality || '';

                // Fetch faculty data with language support
                try {
                    const facultyResponse = await fetch("/api/faculty");
                    if (!facultyResponse.ok) throw new Error("Failed to fetch faculties");
                    
                    const facultyData = await facultyResponse.json();
                    const facultySelect = document.getElementById("faculty");
                    facultySelect.innerHTML = ''; // Clear existing options

                    facultyData.faculties.forEach((faculty) => {
                        const option = document.createElement("option");
                        option.value = faculty.faculty_id;
                        
                        // Use translated faculty name based on current language
                        option.textContent = lang === 'vi' ? faculty.name_vi : faculty.name_en;
                        
                        // Match by faculty ID for more reliability
                        if (student.faculty && faculty.faculty_id === student.faculty.faculty_id) {
                            option.setAttribute("selected", "selected");
                        }
                        facultySelect.appendChild(option);
                    });
                } catch (error) {
                    console.error("Error fetching faculty data:", error);
                }

                // Fetch course data with language support
                try {
                    const courseResponse = await fetch("/api/course");
                    if (!courseResponse.ok) throw new Error("Failed to fetch courses");
                    
                    const courseData = await courseResponse.json();
                    const courseSelect = document.getElementById("course");
                    courseSelect.innerHTML = ''; // Clear existing options

                    courseData.courses.forEach((course) => {
                        const option = document.createElement("option");
                        option.value = course.course_id;
                        
                        // Use translated course name based on current language
                        option.textContent = lang === 'vi' ? course.course_name_vi : course.course_name_en;
                        
                        // Match by course ID for more reliability
                        if (student.course && course.course_id === student.course.course_id) {
                            option.setAttribute("selected", "selected");
                        }
                        courseSelect.appendChild(option);
                    });
                } catch (error) {
                    console.error("Error fetching course data:", error);
                }

                // Fetch student status
                await fetchStudentStatus(student.status_id);

                // Fetch configurations for email and phone warnings
                try {
                    const configResponse = await fetch("/api/configurations");
                    if (!configResponse.ok) throw new Error("Failed to fetch configurations");
                    
                    const configData = await configResponse.json();
                    const configurations = configData.configurations;

                    // Convert to a map for easier access
                    const configMap = configurations.reduce((acc, item) => {
                        acc[item.config_key] = item.config_value;
                        return acc;
                    }, {});

                    // Update warning texts with proper translations
                    const emailWarning = document.getElementById("emailWarning");
                    if (emailWarning) {
                        const emailDomain = configMap.allowed_email_domain || "example.com";
                        emailWarning.textContent = lang === 'vi' 
                            ? `Chỉ chấp nhận email: @${emailDomain}` 
                            : `Only accepts emails: @${emailDomain}`;
                    }

                    const phoneWarning = document.getElementById("phoneWarning");
                    if (phoneWarning) {
                        const phoneCode = configMap.phone_country_code || "+00";
                        phoneWarning.textContent = lang === 'vi' 
                            ? `Chỉ chấp nhận SĐT ${phoneCode}` 
                            : `Only accepts phone numbers: ${phoneCode}`;
                    }
                } catch (error) {
                    console.error("Error fetching configurations:", error);
                }
            } else {
                console.error('Student not found');
                alert(lang === 'vi' ? 'Không tìm thấy sinh viên' : 'Student not found');
            }
        } catch (error) {
            console.error('Error fetching student data:', error);
            alert(lang === 'vi' ? 'Lỗi khi tải dữ liệu sinh viên' : 'Error fetching student data');
        }
    }

    // Function to update student data
    async function updateStudentData() {
        const updatedData = {
            student_id: studentId,
            full_name: document.getElementById('fullName').value,
            date_of_birth: document.getElementById('dob').value,
            gender: document.getElementById('gender').value,
            program: document.getElementById('program').value,
            nationality: document.getElementById('nationality').value,
            faculty_id: document.getElementById('faculty').value,
            course_id: document.getElementById('course').value,
            status_id: document.getElementById('status').value,

            temporaryAddress: {
                temporary_address_id: document.getElementById('tempAddress').value,
                house_number: document.getElementById('tempHouseNumber').value,
                street_name: document.getElementById('tempStreet').value,
                ward: document.getElementById('tempWard').value,
                district: document.getElementById('tempDistrict').value,
                city: document.getElementById('tempCity').value,
                country: document.getElementById('tempCountry').value,
            },
            mailingAddress: {
                mailing_address_id: document.getElementById('mailAddress').value,
                house_number: document.getElementById('mailHouseNumber').value,
                street_name: document.getElementById('mailStreet').value,
                ward: document.getElementById('mailWard').value,
                district: document.getElementById('mailDistrict').value,
                city: document.getElementById('mailCity').value,
                country: document.getElementById('mailCountry').value,
            },
            email: document.getElementById('email').value,
            phone_number: document.getElementById('phone').value,
            identification: {
                identification_id: document.getElementById('documentId').value,
                type: document.getElementById('documentType').value,
                number: document.getElementById('documentNumber').value,
                issue_date: document.getElementById('issueDate').value,
                expiry_date: document.getElementById('expiryDate').value,
                has_chip: document.getElementById('hasChip').value === (lang === 'vi' ? 'Có' : 'Yes'),
                place_of_issue: document.getElementById('issuePlace').value,
                country_of_issue: document.getElementById('issueCountry').value,
                notes: document.getElementById('notes').value,
            },
            permanentAddress: {
                permanent_address_id: document.getElementById('permAddress').value,
                house_number: document.getElementById('permHouseNumber').value,
                street_name: document.getElementById('permStreet').value,
                ward: document.getElementById('permWard').value,
                district: document.getElementById('permDistrict').value,
                city: document.getElementById('permCity').value,
                country: document.getElementById('permCountry').value,
            },
        };

        try {
            const response = await fetch(`/api/student/${studentId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData),
            });

            const responseData = await response.json();

            if (response.ok) {
                console.log('Student data updated successfully');
                fetchStudentStatus(updatedData.status_id);
                
                // Success message with language support
                Swal.fire({
                    icon: 'success',
                    title: lang === 'vi' ? 'Thành công!' : 'Success!',
                    text: lang === 'vi' ? 'Cập nhật thông tin sinh viên thành công!' : 'Student information updated successfully!',
                    confirmButtonText: 'OK',
                    timer: 2000,
                    timerProgressBar: true,
                    showConfirmButton: false
                });
            } else {
                // Error message with language support
                Swal.fire({
                    icon: 'error',
                    title: lang === 'vi' ? 'Lỗi!' : 'Error!',
                    text: responseData.message,
                    confirmButtonText: lang === 'vi' ? 'Đóng' : 'Close'
                });
                console.error('Failed to update student data');
                await fetchAndPopulateData();
            }
        } catch (error) {
            console.error('Error updating student data:', error);
            
            // Error message with language support
            Swal.fire({
                icon: 'error',
                title: lang === 'vi' ? 'Lỗi!' : 'Error!',
                text: error.message,
                confirmButtonText: lang === 'vi' ? 'Đóng' : 'Close'
            });
        }
    }

    // Add event listener to the edit/save button
    const editBtn = document.getElementById('editBtn');
    if (editBtn) {
        editBtn.addEventListener('click', () => {
            const isCurrentlyEditing = editBtn.textContent.includes(lang === 'vi' ? 'Lưu' : 'Save');
            
            if (isCurrentlyEditing) {
                updateStudentData();
            }
            
            // Update button text based on current state and language
            editBtn.textContent = isCurrentlyEditing ? 
                (lang === 'vi' ? 'Chỉnh Sửa' : 'Edit') : 
                (lang === 'vi' ? 'Lưu' : 'Save');
        });
    } else {
        console.error("Edit button not found!");
    }
});