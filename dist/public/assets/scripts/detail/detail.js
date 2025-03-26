document.addEventListener('DOMContentLoaded', function () {
    //get student id from the URL like /detail/:studentId
    const url = window.location.pathname;
    const studentId = url.substring(url.lastIndexOf('/') + 1);
    console.log(studentId);

    // Function to fetch data from the API and populate the form fields
    async function fetchAndPopulateData() {
        try {
            const response = await fetch(`/api/student/${studentId}`);
            const data = await response.json();
            

            if (data.message === "Student found") {
                const student = data.student;

                // Populate the form fields with the fetched data
                document.getElementById('studentId').value = studentId;
                document.getElementById('fullName').value = student.full_name || '';
                document.getElementById('dob').value = student.date_of_birth || '';
                document.getElementById('gender').value = student.gender || '';
                document.getElementById('program').value = student.program || '';
                document.getElementById('tempHouseNumber').value = student.temporaryAddress.house_number || '';
                document.getElementById('tempStreet').value = student.temporaryAddress.street_name || '';
                document.getElementById('tempWard').value = student.temporaryAddress.ward || '';
                document.getElementById('tempDistrict').value = student.temporaryAddress.district || '';
                document.getElementById('tempCity').value = student.temporaryAddress.city || '';
                document.getElementById('tempCountry').value = student.temporaryAddress.country || '';
                document.getElementById('mailHouseNumber').value = student.mailingAddress.house_number || '';
                document.getElementById('mailStreet').value = student.mailingAddress.street_name || '';
                document.getElementById('mailWard').value = student.mailingAddress.ward || '';
                document.getElementById('mailDistrict').value = student.mailingAddress.district || '';
                document.getElementById('mailCity').value = student.mailingAddress.city || '';
                document.getElementById('mailCountry').value = student.mailingAddress.country || '';
                document.getElementById('email').value = student.email || '';
                document.getElementById('phone').value = student.phone_number || '';
                document.getElementById('documentType').value = student.identification.type || '';
                document.getElementById('documentType').dispatchEvent(new Event("change")); 
                document.getElementById('documentNumber').value = student.identification.number || '';
                document.getElementById('issueDate').value = student.identification.issue_date || '';
                document.getElementById('expiryDate').value = student.identification.expiry_date || '';
                document.getElementById('issuePlace').value = student.identification.place_of_issue || '';
                document.getElementById('issueCountry').value = student.identification.country_of_issue || '';
                document.getElementById('notes').value = student.identification.notes || '';
                document.getElementById('permHouseNumber').value = student.permanentAddress.house_number || '';
                document.getElementById('permStreet').value = student.permanentAddress.street_name || '';
                document.getElementById('permWard').value = student.permanentAddress.ward || '';
                document.getElementById('permDistrict').value = student.permanentAddress.district || '';
                document.getElementById('permCity').value = student.permanentAddress.city || '';
                document.getElementById('permCountry').value = student.permanentAddress.country || '';
                document.getElementById('nationality').value = student.nationality || '';


                // <input type="hidden" name="documentId" id="documentId">
                // <input type="hidden" name="permAddress" id="permAddress">
                // <input type="hidden" name="tempAddress" id="tempAddress">

                // <input type="hidden" name="mailAddress" id="mailAddress">

                document.getElementById('documentId').value = student.identification_id || '';
                document.getElementById('permAddress').value = student.permanent_address_id || '';
                document.getElementById('tempAddress').value = student.temporary_address_id || '';
                document.getElementById('mailAddress').value = student.mailing_address_id || '';
                

                
                fetch("/api/faculty")
                .then((response) => response.json())
                .then((data) => {
                const facultySelect = document.getElementById("faculty");

                data.faculties.forEach((faculty) => {
                const option = document.createElement("option");
                option.value = faculty.faculty_id; 
                option.textContent = faculty.name; 
                if (faculty.name === student.faculty.faculty_name)
                    option.setAttribute("selected", "selected");
                facultySelect.appendChild(option);
                });
                })
                .catch((error) => console.error("Error fetching faculties:", error));
                
                fetch("/api/course")
                .then((response) => response.json())
                .then((data) => {
                const courseSelect = document.getElementById("course");
      
                data.courses.forEach((course) => {
                    const option = document.createElement("option");
                    option.value = course.course_id; 
                    option.textContent = course.course_name; 
                    courseSelect.appendChild(option); 
                    if (course.course_name === student.course.course_name)
                        option.setAttribute("selected", "selected");
                });
                })
                .catch((error) => console.error("Error fetching faculties:", error));

                fetch("/api/status")
                .then((response) => response.json())
                .then((data) => {
                const statusSelect = document.getElementById("status");

                data.status.forEach((status) => {
                const option = document.createElement("option");
                option.value = status.status_id; // Set status_id as value
                option.textContent = status.name; // Set name as text
                if (status.name === student.status.name)
                    option.setAttribute("selected", "selected");
                statusSelect.appendChild(option);
                });
                })
                .catch((error) => console.error("Error fetching faculties:", error));
                
                // Handle has_chip field (if applicable)
                if (student.identification.has_chip !== undefined) {
                    document.getElementById('hasChip').value = student.identification.has_chip ? 'Có' : 'Không';
                }
            } else {
                console.error('Student not found');
            }
        } catch (error) {
            console.error('Error fetching student data:', error);
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
            // status_string: document.getElementById('status').options[document.getElementById('status').selectedIndex].text,

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
                has_chip: document.getElementById('hasChip').value === 'Có',
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

            const responseData = await response.json(); // Get the JSON data from the response

            if (response.ok) {
                console.log('Student data updated successfully');
                alert('Updated student data successfully');
            } else {
                alert(responseData.message);
                console.error('Failed to update student data');
                fetchAndPopulateData();
            }
        } catch (error) {
            console.error('Error updating student data:', error);
            alert(error.message)
        }
    }

    // Call the function to fetch and populate data
    fetchAndPopulateData();

    // Add event listener to the save button to update student data
    const editBtn = document.getElementById('editBtn');
    editBtn.addEventListener('click', () => {
        if (editBtn.textContent.includes('Lưu')) {
            updateStudentData();
        }
        editBtn.textContent = editBtn.textContent.includes("Chỉnh Sửa") ? 'Lưu' : 'Chỉnh Sửa';
    });
});