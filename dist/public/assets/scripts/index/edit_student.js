function editStudent(id) {
  var facultyOptions;
  const overlay = document.createElement("div");
  overlay.classList.add(
    "fixed",
    "top-0",
    "left-0",
    "w-full",
    "h-full",
    "bg-gray-50",
    "bg-opacity-50",
  );
  document.body.appendChild(overlay);
  
  const studentIndex = currentStudents.findIndex(student => String(student.student_id) === id);
  const student = currentStudents[studentIndex];
  // Fetch faculties from API
  fetch("/api/faculty")
    .then((response) => response.json())
    .then((data) => {
      facultyOptions = data.faculties
        .map(
          (faculty) =>
            `<option value="${faculty.faculty_id}" ${faculty.faculty_id === student.faculty_id ? "selected" : ""}>${faculty.name}</option>`
        )
        .join("");

      // Create the modal container
      const modal = document.createElement("div");
      modal.classList.add(
        "fixed",
        "top-1/2",
        "left-1/2",
        "transform",
        "-translate-x-1/2",
        "-translate-y-1/2",
        "bg-white",
        "p-5",
        "shadow-lg",
        "rounded-lg"
      );

      const form = document.createElement("form");
      form.id = "editStudentForm";

      // Generate the form content with the student's existing data
      form.innerHTML = `
        <h2 class="text-xl font-bold mb-4">Chỉnh sửa sinh viên</h2>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label for="student_id" class="block text-sm font-medium text-gray-700">MSSV:</label>
            <input type="text" id="student_id" name="student_id" value="${student.student_id}" required 
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" readonly>
          </div>
          <div>
            <label for="full_name" class="block text-sm font-medium text-gray-700">Tên đầy đủ:</label>
            <input type="text" id="full_name" name="full_name" value="${student.full_name}" required 
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
          </div>
          <div>
            <label for="date_of_birth" class="block text-sm font-medium text-gray-700">Ngày sinh:</label>
            <input type="date" id="date_of_birth" name="date_of_birth" value="${student.date_of_birth}" required 
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
          </div>
          <div>
            <label for="gender" class="block text-sm font-medium text-gray-700">Giới tính:</label>
            <select id="gender" name="gender" required 
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
              <option value="Nam" ${student.gender === "Nam" ? "selected" : ""}>Nam</option>
              <option value="Nữ" ${student.gender === "Nữ" ? "selected" : ""}>Nữ</option>
              <option value="Khác" ${student.gender === "Khác" ? "selected" : ""}>Khác</option>
            </select>
          </div>
          <div>
            <label for="faculty_id" class="block text-sm font-medium text-gray-700">Khoa:</label>
            <select id="faculty_id" name="faculty_id" required 
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
              ${facultyOptions}
            </select>
          </div>
          <div>
            <label for="course" class="block text-sm font-medium text-gray-700">Khóa học:</label>
            <input type="text" id="course" name="course" value="${student.course}" required 
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
          </div>
          <div>
            <label for="program" class="block text-sm font-medium text-gray-700">Chương trình:</label>
            <input type="text" id="program" name="program" value="${student.program}" required 
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
          </div>
          <div>
            <label for="address" class="block text-sm font-medium text-gray-700">Địa chỉ:</label>
            <textarea id="address" name="address" 
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">${student.address}</textarea>
          </div>
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email:</label>
            <input type="email" id="email" name="email" value="${student.email}" required 
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
          </div>
          <div>
            <label for="phone_number" class="block text-sm font-medium text-gray-700">Số điện thoại:</label>
            <input type="text" id="phone_number" name="phone_number" value="${student.phone_number}" required 
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
          </div>
          <div>
            <label for="status" class="block text-sm font-medium text-gray-700">Trạng thái:</label>
            <select id="status" name="status" required 
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
              <option value="Đang học" ${student.status === "Đang học" ? "selected" : ""}>Đang học</option>
              <option value="Đã tốt nghiệp" ${student.status === "Đã tốt nghiệp" ? "selected" : ""}>Đã tốt nghiệp</option>
              <option value="Đã thôi học" ${student.status === "Đã thôi học" ? "selected" : ""}>Đã thôi học</option>
              <option value="Tạm dừng học" ${student.status === "Tạm dừng học" ? "selected" : ""}>Tạm dừng học</option>
            </select>
          </div>
        </div>
        <div class="mt-4 flex justify-end">
          <button type="submit" id="submitModal" class="inline-flex justify-center py-2 px-4 border border-transparent shadow-lg text-sm font-semibold rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">Lưu</button>
          <button type="button" id="closeModal" class="ml-2 inline-flex justify-center py-2 px-4 border border-transparent shadow-lg text-sm font-semibold rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Đóng</button>
        </div>
      `;

      // Create the close modal function
      function closeModal() {
        document.body.removeChild(overlay);
      }

      // Handle form submit
      form.addEventListener("submit", function (event) {
        event.preventDefault();  // Prevent default form submission
        let formData = new FormData(form);
        let studentData = {};

        formData.forEach((value, key) => {
          studentData[key] = value;
        });
        
        // Send the update request to the server
        fetch(`/api/update_student`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(studentData),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.message === "Student updated successfully") {
              // alert("Cập nhật sinh viên thành công! ");
              Swal.fire({
                icon: 'success',
                title: 'Thành công!',
                text: 'Cập nhật sinh viên thành công!',
                confirmButtonText: 'OK',
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: false
              });

              const tableBody = document.getElementById("student-table-body");
              const row = tableBody.children[studentIndex];
              
              const updatedStudent = data.updatedStudent;
              currentStudents[studentIndex] = updatedStudent;

              students = students.filter(student => student.student_id !== id);

              let statusClass = "";
              switch (updatedStudent.status) {
                case "Đang học":
                  statusClass =
                    "px-2 py-1 font-semibold leading-tight text-orange-700 bg-orange-100 rounded-full dark:text-white dark:bg-orange-600";
                  break;
                case "Đã tốt nghiệp":
                  statusClass =
                    "px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-full dark:bg-green-700 dark:text-green-100";
                  break;
                case "Đã thôi học":
                  statusClass =
                    "px-2 py-1 font-semibold leading-tight text-red-700 bg-red-100 rounded-full dark:text-red-100 dark:bg-red-700";
                  break;
                case "Tạm dừng học":
                  statusClass =
                    "px-2 py-1 font-semibold leading-tight text-yellow-700 bg-yellow-100 rounded-full dark:text-yellow-100 dark:bg-yellow-700";
                  break;
                default:
                  statusClass =
                    "px-2 py-1 font-semibold leading-tight text-gray-700 bg-gray-100 rounded-full dark:text-gray-100 dark:bg-gray-700";
                  statusText = student.status;
                  break;
              }
              row.innerHTML =  
              `
             <td class="px-4 py-3">
          <div class="flex items-center text-sm">
            
            <div>
              <p class="font-semibold">${updatedStudent.full_name}</p>
              <p class="text-xs text-gray-600 dark:text-gray-400">${updatedStudent.student_id}</p>
            </div>
          </div>
        </td>
        <td class="px-4 py-3 text-sm">${updatedStudent.date_of_birth}</td>
        <td class="px-4 py-3 text-sm">${updatedStudent.gender}</td>
        <td class="px-4 py-3 text-sm">${updatedStudent.faculty_id}</td>
        <td class="px-4 py-3 text-sm">${updatedStudent.course}</td>
        <td class="px-4 py-3 text-sm">${updatedStudent.program}</td>
        <td class="px-4 py-3 text-sm">${updatedStudent.address}</td>
        <td class="px-4 py-3 text-sm">${updatedStudent.email}</td>
        <td class="px-4 py-3 text-sm">${updatedStudent.phone_number}</td>
        <td class="px-4 py-3 text-xs">
          <span class="${statusClass}">
            ${updatedStudent.status}
          </span>
        </td>
        <td class="px-4 py-3 text-sm">
          <button class="p-1 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-md active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple" type="submit" onclick="editStudent('${student.student_id}')">Edit</button>
          <button class="p-1 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-red-600 border border-transparent rounded-md active:bg-red-600 hover:bg-red-700 focus:outline-none focus:shadow-outline-purple" type="submit" onclick="deleteStudent('${student.student_id}')">Delete</button>
        </td>
          `;
    
              
            } else {
              // alert("Đã xảy ra lỗi khi chỉnh sinh viên.");
              Swal.fire({
                icon: 'error',
                title: 'Lỗi!',
                text: data.message,
                confirmButtonText: 'Đóng'
              });
            }
          })
          .catch((error) => {
            console.error("Error updating student:", error);
            // alert("An error occurred while updating the student.");
            Swal.fire({
              icon: 'error',
              title: 'Lỗi!',
              text: 'Đã xảy ra lỗi khi cập nhật sinh viên.',
              confirmButtonText: 'Đóng'
            });
          });

        closeModal();  // Close the modal after submission
      });

      // Add an event listener to the close button
      const closeButton = form.querySelector('#closeModal');
      closeButton.addEventListener('click', closeModal);

      modal.appendChild(form);
      overlay.appendChild(modal);
    })
    .catch((error) => {
      console.error("Error fetching faculty data:", error); // Handle any potential errors
    });
}
