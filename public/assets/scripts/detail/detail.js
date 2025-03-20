document.addEventListener('DOMContentLoaded', function () {
    const studentId = 22123456; // Replace with the actual student ID or get it dynamically
    const apiUrl = `/api/student/${studentId}`;

    // Function to fetch data from the API and populate the form fields
    async function fetchAndPopulateData() {
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();

            // Populate the form fields with the fetched data
            document.getElementById('studentId').value = data.student_id;
            document.getElementById('fullName').value = data.full_name;
            document.getElementById('dob').value = data.date_of_birth;
            document.getElementById('gender').value = data.gender;
            document.getElementById('faculty').value = data.faculty.name;
            document.getElementById('course').value = data.course.course_name;
            document.getElementById('program').value = data.program;
            document.getElementById('studentStatus').value = data.status.name;
            document.getElementById('tempHouseNumber').value = data.temporaryAddress.house_number;
            document.getElementById('tempStreet').value = data.temporaryAddress.street_name;
            document.getElementById('tempWard').value = data.temporaryAddress.ward;
            document.getElementById('tempDistrict').value = data.temporaryAddress.district;
            document.getElementById('tempCity').value = data.temporaryAddress.city;
            document.getElementById('tempCountry').value = data.temporaryAddress.country;
            document.getElementById('mailHouseNumber').value = data.mailingAddress.house_number;
            document.getElementById('mailStreet').value = data.mailingAddress.street_name;
            document.getElementById('mailWard').value = data.mailingAddress.ward;
            document.getElementById('mailDistrict').value = data.mailingAddress.district;
            document.getElementById('mailCity').value = data.mailingAddress.city;
            document.getElementById('mailCountry').value = data.mailingAddress.country;
            document.getElementById('email').value = data.email;
            document.getElementById('phone').value = data.phone_number;
            document.getElementById('documentType').value = data.identification.type;
            document.getElementById('documentNumber').value = data.identification.number;
            document.getElementById('issueDate').value = data.identification.issue_date;
            document.getElementById('expiryDate').value = data.identification.expiry_date;
            document.getElementById('hasChip').value = data.identification.has_chip ? 'Có' : 'Không';
            document.getElementById('issuePlace').value = data.identification.place_of_issue;
            document.getElementById('issueCountry').value = data.identification.country_of_issue;
            document.getElementById('notes').value = data.identification.notes;
            document.getElementById('permHouseNumber').value = data.permanentAddress.house_number;
            document.getElementById('permStreet').value = data.permanentAddress.street_name;
            document.getElementById('permWard').value = data.permanentAddress.ward;
            document.getElementById('permDistrict').value = data.permanentAddress.district;
            document.getElementById('permCity').value = data.permanentAddress.city;
            document.getElementById('permCountry').value = data.permanentAddress.country;

            //nationality
            document.getElementById('nationality').value = data.nationality;
        } catch (error) {
            console.error('Error fetching student data:', error);
        }
    }

    // Function to update student data
    async function updateStudentData() {
        const updatedData = {
            student_id: document.getElementById('studentId').value,
            full_name: document.getElementById('fullName').value,
            date_of_birth: document.getElementById('dob').value,
            gender: document.getElementById('gender').value,
            faculty: { name: document.getElementById('faculty').value },
            course: { course_name: document.getElementById('course').value },
            program: document.getElementById('program').value,
            status: { name: document.getElementById('studentStatus').value },
            nationality: { name: document.getElementById('nationality').value },
            temporaryAddress: {
                house_number: document.getElementById('tempHouseNumber').value,
                street_name: document.getElementById('tempStreet').value,
                ward: document.getElementById('tempWard').value,
                district: document.getElementById('tempDistrict').value,
                city: document.getElementById('tempCity').value,
                country: document.getElementById('tempCountry').value,
            },
            mailingAddress: {
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
                house_number: document.getElementById('permHouseNumber').value,
                street_name: document.getElementById('permStreet').value,
                ward: document.getElementById('permWard').value,
                district: document.getElementById('permDistrict').value,
                city: document.getElementById('permCity').value,
                country: document.getElementById('permCountry').value,
            },
        };

        try {
            const response = await fetch(apiUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData),
            });

            if (response.ok) {
                console.log('Student data updated successfully');
            } else {
                console.error('Failed to update student data');
            }
        } catch (error) {
            console.error('Error updating student data:', error);
        }
    }

    // Call the function to fetch and populate data
    fetchAndPopulateData();

    // Add event listener to the save button to update student data
    const editBtn = document.getElementById('editBtn');
    editBtn.addEventListener('click', () => {
        if (editBtn.textContent.includes('✔️ Lưu')) {
            updateStudentData();
        }
    });
});