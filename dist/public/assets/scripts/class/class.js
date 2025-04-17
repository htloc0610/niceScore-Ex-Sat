async function loadStudents(classId) {
  const studentTableBody = document.getElementById("student-table-body");
  const studentCount = document.getElementById("student-count");

  try {
    const response = await fetch(`/api/class_registation/${classId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch students");
    }
    const data = await response.json();
    const students = data.registrations;

    studentTableBody.innerHTML = "";

    if (!students || students.length === 0) {
      studentTableBody.innerHTML = `
          <tr class="text-gray-600">
            <td colspan="4" class="px-4 py-2 text-sm text-center">Chưa có học sinh nào trong lớp</td>
          </tr>
        `;
      studentCount.textContent = "Tổng: 0 học sinh";
      return;
    }

    students.forEach((registration) => {
      const student = registration.student || {};
      const row = document.createElement("tr");
      row.className = "text-gray-700 hover:bg-gray-50 transition-colors";
      row.innerHTML = `
          <td class="px-4 py-2 text-sm truncate">${student.student_id || "N/A"}</td>
          <td class="px-4 py-2 text-sm truncate" title="${student.full_name || "N/A"}">${student.full_name || "N/A"}</td>
          <td class="px-4 py-2 text-sm truncate" title="${student.email || "N/A"}">${student.email || "N/A"}</td>
          <td class="px-4 py-2 text-sm">
            <span id="grade-${student.student_id}" class="inline-flex px-2 py-1 text-xs font-medium rounded-full 
              ${
                student.grade
                  ? parseFloat(student.grade) < 5
                    ? "bg-red-100 text-red-800"
                    : "bg-green-100 text-green-800"
                  : "bg-gray-200 text-gray-700"
              }">
              ${student.grade || "Chưa có"}
            </span>
          </td>

          <td class="px-4 flex gap-2 py-2 text-sm ${student.grade? "hidden" : ""}">
            <button class="px-2 py-1 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700" onclick="addGrade(${student.student_id || "N/A"}, ${classId})">Thêm điểm</button>            
            <button class="px-2 py-1 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700" onclick="cancel(${registration.registration_id || "N/A"}, ${student.student_id || "N/A"})">Hủy đăng ký</button>
          </td>
<<<<<<< HEAD
          <td class="px-4 py-2 text-sm ${student.grade ? "" : "hidden"}">
            ${
              student.transcripts.length > 0
                ? `<button class="px-2 py-1 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
                    onclick="editGrade(${student.transcripts[0].transcript_id}, ${student.grade})">
                    Sửa điểm
                  </button>`
                : `<button class="px-2 py-1 text-sm font-medium text-white bg-gray-400 rounded cursor-not-allowed" disabled>
                    Không có điểm
                  </button>`
            }
=======
          <td class="px-4 py-2 text-sm ${student.grade? "": "hidden"}">
            <button class="px-2 py-1 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700" onclick="editGrade(${student.transcript_id || "N/A"}, ${student.grade})"
            >Sửa điểm</button>            

>>>>>>> dev
          </td>

        `;
      studentTableBody.appendChild(row);
    });
    studentCount.textContent = `Tổng: ${students.length} học sinh`;
  } catch (error) {
    console.error("Error fetching students:", error);
    studentTableBody.innerHTML = `
        <tr class="text-gray-600">
          <td colspan="4" class="px-4 py-2 text-sm text-center">Lỗi khi tải danh sách học sinh</td>
        </tr>
      `;
    studentCount.textContent = "Tổng: 0 học sinh";
  }
}

const addStudentBtn = document.getElementById("add-student-btn");
const addStudentModal = document.getElementById("add-student-modal");
const addStudentForm = document.getElementById("add-student-form");

addStudentBtn.addEventListener("click", () => {
  addStudentModal.classList.remove("hidden");
});

function closeAddStudentModal() {
  addStudentModal.classList.add("hidden");
  addStudentForm.reset();
}

document.addEventListener("click", (e) => {
  if (e.target === addStudentModal) {
    closeAddStudentModal();
  }
});

addStudentForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const studentId = document.getElementById("student-id").value;
  const classId = window.location.pathname.split("/").pop();

  try {
    const response = await fetch("/api/class_registation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        student_id: parseInt(studentId),
        class_id: parseInt(classId),
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to register student");
    }

    closeAddStudentModal();
    loadStudents(classId);
    // alert("Đã thêm học sinh thành công!");
    Swal.fire({
      icon: 'success',
      title: 'Thành công!',
      text: 'Thêm sinh viên thành công!',
      confirmButtonText: 'OK',
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false
    });
    
  } catch (error) {
    console.error("Error registering student:", error);
    // alert("Có lỗi khi thêm sinh viên: " + error.message);
    Swal.fire({
      icon: 'error',
      title: 'Lỗi!',
      text: 'Đã xảy ra lỗi: ' + error.message,
      confirmButtonText: 'Đóng'
    });
    
  }
});

const classId = window.location.pathname.split("/").pop();
loadStudents(classId);