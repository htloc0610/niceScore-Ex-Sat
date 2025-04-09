async function loadStudents(classId) {
  const studentTableBody = document.getElementById("student-table-body");

  try {
    const response = await fetch(`/api/class_registation/${classId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch students");
    }
    const data = await response.json();
    const students = data.registrations; // Extract the registrations array

    studentTableBody.innerHTML = "";

    if (!students || students.length === 0) {
      studentTableBody.innerHTML = `
          <tr class="text-gray-700 dark:text-gray-400">
            <td colspan="5" class="px-2 py-3 text-sm text-center">Chưa có học sinh nào trong lớp</td>
          </tr>
        `;
      return;
    }

    students.forEach((registration) => {
      const student = registration.student || {};
      const row = document.createElement("tr");
      row.className = "text-gray-700 dark:text-gray-400";
      row.innerHTML = `
          <td class="px-2 py-3 text-sm">${registration.registration_id}</td>
          <td class="px-2 py-3 text-sm">${student.full_name || "N/A"}</td>
          <td class="px-2 py-3 text-sm">${student.email || "N/A"}</td>
          <td class="px-2 py-3 text-sm">${student.phone_number || "N/A"}</td>
          <td class="px-2 py-3 text-sm">${registration.grade || "Chưa có"}</td>
        `;
      studentTableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Error fetching students:", error);
    studentTableBody.innerHTML = `
        <tr class="text-gray-700 dark:text-gray-400">
          <td colspan="5" class="px-2 py-3 text-sm text-center">Lỗi khi tải danh sách học sinh</td>
        </tr>
      `;
  }
}

// Xử lý modal
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
    const response = await fetch("/api/class-registrations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        student_id: parseInt(studentId), // Ensure integer
        class_id: parseInt(classId), // Ensure integer
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to register student");
    }

    closeAddStudentModal();
    loadStudents(classId); // Refresh student list
    alert("Đã thêm học sinh thành công!");
  } catch (error) {
    console.error("Error registering student:", error);
    alert("Có lỗi khi thêm học sinh: " + error.message);
  }
});

// Load students when page loads
const classId = window.location.pathname.split("/").pop();
loadStudents(classId);
