document
  .querySelector('button[name="add_student"]')
  .addEventListener("click", function () {
    // Create the pop-up modal
    let modal = document.createElement("div");
    modal.style.position = "fixed";
    modal.style.top = "50%";
    modal.style.left = "50%";
    modal.style.transform = "translate(-50%, -50%)";
    modal.style.backgroundColor = "white";
    modal.style.padding = "20px";
    modal.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.1)";
    modal.style.zIndex = "1000";

    // Create the form inside the modal
    let form = document.createElement("form");
    // Fetch faculties from API
    fetch("/api/faculty")
      .then((response) => response.json())
      .then((data) => {
        let facultyOptions = data.faculties
          .map(
            (faculty) =>
              `<option value="${faculty.faculty_id}">${faculty.name}</option>`
          )
          .join("");

        form.innerHTML = `
            <form id="studentForm">
                <h2 class="text-xl font-bold mb-4">Thêm sinh viên mới</h2>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label for="student_id" class="block text-sm font-medium text-gray-700">MSSV:</label>
                        <input type="text" id="student_id" name="student_id" required 
                            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                    </div>
                    <div>
                        <label for="full_name" class="block text-sm font-medium text-gray-700">Tên đầy đủ:</label>
                        <input type="text" id="full_name" name="full_name" required 
                            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                    </div>
                    <div>
                        <label for="date_of_birth" class="block text-sm font-medium text-gray-700">Ngày sinh:</label>
                        <input type="date" id="date_of_birth" name="date_of_birth" required 
                            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                    </div>
                    <div>
                        <label for="gender" class="block text-sm font-medium text-gray-700">Giới tính:</label>
                        <select id="gender" name="gender" required 
                            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                            <option value="Nam">Nam</option>
                            <option value="Nữ">Nữ</option>
                            <option value="Khác">Khác</option>
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
                        <input type="text" id="course" name="course" required 
                            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                    </div>
                    <div>
                        <label for="program" class="block text-sm font-medium text-gray-700">Chương trình:</label>
                        <input type="text" id="program" name="program" required 
                            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                    </div>
                    <div>
                        <label for="address" class="block text-sm font-medium text-gray-700">Địa chỉ:</label>
                        <textarea id="address" name="address" 
                            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
                    </div>
                    <div>
                        <label for="email" class="block text-sm font-medium text-gray-700">Email:</label>
                        <input type="email" id="email" name="email" required 
                            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                    </div>
                    <div>
                        <label for="phone_number" class="block text-sm font-medium text-gray-700">Số điện thoại:</label>
                        <input type="text" id="phone_number" name="phone_number" required 
                            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                    </div>
                    <div>
                        <label for="status" class="block text-sm font-medium text-gray-700">Trạng thái:</label>
                        <select id="status" name="status" required 
                            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                            <option value="Đang học">Đang học</option>
                            <option value="Đã tốt nghiệp">Đã tốt nghiệp</option>
                            <option value="Đã thôi học">Đã thôi học</option>
                            <option value="Tạm dừng học">Tạm dừng học</option>
                        </select>
                    </div>
                </div>
                <div class="mt-4 flex justify-end">
                    <button type="submit" class="inline-flex justify-center py-2 px-4 border border-transparent shadow-lg text-sm font-semibold rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">Lưu</button>
                    <button type="button" id="closeModal" class="ml-2 inline-flex justify-center py-2 px-4 border border-transparent shadow-lg text-sm font-semibold rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Đóng</button>
                </div>
            </form>
        `;
      })
      .then(() => {
        // Close modal event
        document
          .getElementById("closeModal")
          .addEventListener("click", function () {
            document.body.removeChild(modal);
          });

        // Form submit event
        form.addEventListener("submit", function (event) {
          event.preventDefault();
          // Gather form data
          let formData = new FormData(form);
          let studentData = {};
          formData.forEach((value, key) => {
            studentData[key] = value;
          });

          // Send data to the server
          fetch("/api/add_student", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(studentData),
          })
            .then((response) => response.json())
            .then((data) => {
              if (data.message === "Student added successfully") {
                alert("Sinh viên mới đã được thêm!");
                document.body.removeChild(modal);
                // Add new student data to the table
                let tableBody = document.getElementById("student-table-body");
                let newRow = document.createElement("tr");
                newRow.classList.add("text-gray-700", "dark:text-gray-400");
                let statusClass = "";
                studentData = data.newStudent;
                switch (studentData.status) {
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
                    break;
                }
                newRow.innerHTML = `
                  <td class="px-4 py-3">
                    <div class="flex items-center text-sm">
                      <div>
                        <p class="font-semibold">${studentData.full_name}</p>
                        <p class="text-xs text-gray-600 dark:text-gray-400">${studentData.student_id}</p>
                      </div>
                    </div>
                  </td>
                  <td class="px-4 py-3 text-sm">${studentData.date_of_birth}</td>
                  <td class="px-4 py-3 text-sm">${studentData.gender}</td>
                  <td class="px-4 py-3 text-sm">${studentData.facultyName}</td>
                  <td class="px-4 py-3 text-sm">${studentData.course}</td>
                  <td class="px-4 py-3 text-sm">${studentData.program}</td>
                  <td class="px-4 py-3 text-sm">${studentData.address}</td>
                  <td class="px-4 py-3 text-sm">${studentData.email}</td>
                  <td class="px-4 py-3 text-sm">${studentData.phone_number}</td>
                  <td class="px-4 py-3 text-xs">
                    <span class="${statusClass}">
                      ${studentData.status}
                    </span>
                  </td>
                  <td class="px-4 py-3 text-sm">
                    <button class="p-1 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-md active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple" type="submit">Edit</button>
                    <button class="p-1 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-red-600 border border-transparent rounded-md active:bg-red-600 hover:bg-red-700 focus:outline-none focus:shadow-outline-purple" type="submit">Delete</button>
                  </td>
                `;

                tableBody.appendChild(newRow);
              } else {
                alert("Đã xảy ra lỗi khi thêm sinh viên.");
              }
            })
            .catch((error) => {
              console.error("Error adding student:", error);
              alert("Đã xảy ra lỗi khi thêm sinh viên.");
            });
        });
      })
      .catch((error) => console.error("Error fetching faculties:", error));

    // Append the form to the modal
    modal.appendChild(form);
    document.body.appendChild(modal);
  });
