const addStudentForm = document.getElementById("addStudentForm");

document.addEventListener("DOMContentLoaded", function () {

    //configurations for mailwarning and phone warning
    fetch("/api/configurations")
    .then((response) => response.json())
    .then((data) => {
        const configurations = data.configurations;

        // Chuyển danh sách cấu hình thành object để dễ truy xuất
        const configMap = configurations.reduce((acc, item) => {
            acc[item.config_key] = item.config_value;
            return acc;
        }, {});

        // Gán giá trị vào các thẻ HTML
        document.getElementById("emailWarning").textContent =
            "Chỉ chấp nhận email: @" + (configMap.allowed_email_domain || "example.com");

        document.getElementById("phoneWarning").textContent =
            "Chỉ chấp nhận SĐT " + (configMap.phone_country_code || "+00");
    })

    fetch("/api/faculty")
        .then((response) => response.json())
        .then((data) => {
            const facultySelect = document.getElementById("faculty_id");

            // Clear any existing options
            facultySelect.innerHTML = "";

            // Add a default option
            const defaultOption = document.createElement("option");
            defaultOption.value = "";
            defaultOption.textContent = "Chọn khoa";
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
            courseSelect.innerHTML = "";

            // Add a default option
            const defaultOption = document.createElement("option");
            defaultOption.value = "";
            defaultOption.textContent = "Chọn khóa";
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
            statusSelect.innerHTML = "";

            // Add a default option
            const defaultOption = document.createElement("option");
            defaultOption.value = "";
            defaultOption.textContent = "Chọn trạng thái";
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
    updateVisibility();

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
                // alert("Thêm sinh viên thành công!");

                Swal.fire({
                    icon: 'success',
                    title: 'Thành công!',
                    text: 'Thêm sinh viên thành công!',
                    confirmButtonText: 'OK',
                    timer: 2000,
                    timerProgressBar: true,
                    showConfirmButton: false
                  });

                  
                console.log("Server response:", result);
            })
            .catch(error => {
                console.error("Error submitting form:", error);
                // alert("Đã xảy ra lỗi: " + error.message);
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi!',
                    text: 'Đã xảy ra lỗi: ' + error.message,
                    confirmButtonText: 'Đóng'
                  });
                  
            });

    });
})