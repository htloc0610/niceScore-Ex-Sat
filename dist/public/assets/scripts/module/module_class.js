// module_class.js
let selectedModuleId = null;
let selectedModuleName = "";
let selectedFacultyName = "";

async function loadClasses(moduleId) {
    selectedModuleId = moduleId;
    const classTable = document.getElementById("class-table");
    const classTableBody = document.getElementById("class-table-body");
    const noClassesDiv = document.getElementById("no-classes");
    const classCount = document.getElementById("class-count");
    const addClassBtn = document.getElementById("add-class-btn");

  
    try {
      const [classResponse] = await Promise.all([
        fetch(`/api/class/module/${moduleId}`),
      ]);
      const classData = await classResponse.json();
      const classes = classData.classes || [];

      classTableBody.innerHTML = "";
  
      if (classes.length > 0) {
        classes.forEach((classItem) => {
          const row = document.createElement("tr");
          row.className = "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors";
          row.innerHTML = `
            <td class="px-4 py-3 text-sm truncate">${classItem.class_id}</td>
            <td class="px-4 py-3 text-sm truncate" title="${classItem.class_name}">${classItem.class_name}</td>
            <td class="px-4 py-3 text-sm truncate" title="${classItem.instructor}">${classItem.instructor}</td>
            <td class="px-4 py-3 text-sm">${classItem.max_students}</td>
            <td class="px-4 py-3 text-sm truncate" title="${classItem.schedule}">${classItem.schedule}</td>
            <td class="px-4 py-3 text-sm truncate" title="${classItem.classroom}">${classItem.classroom}</td>
            <td class="px-4 py-3 text-sm">
              <button class="px-2 py-1 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 transition-colors"
                onclick="window.location.href='/class/${classItem.class_id}'">Xem</button>
              <button class="px-2 py-1 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                onclick="editClass('${classItem.class_id}')">Sửa</button>
            </td>
          `;
          classTableBody.appendChild(row);
        });
        classTable.classList.remove("hidden");
        noClassesDiv.classList.add("hidden");
        classCount.textContent = `Tổng số lớp: ${classes.length}`;
        addClassBtn.classList.remove("hidden");
        addClassBtn.href = `/classes/add?module_id=${moduleId}`;
      } else {
        classTable.classList.add("hidden");
        noClassesDiv.classList.remove("hidden");
        noClassesDiv.textContent = "Không có lớp học nào cho môn học này";
        classCount.textContent = "Tổng số lớp: 0";
        addClassBtn.classList.remove("hidden");
        addClassBtn.href = `/classes/add?module_id=${moduleId}`;
      }
    } catch (error) {
      console.error("Error fetching classes:", error);
      classTable.classList.add("hidden");
      noClassesDiv.classList.remove("hidden");
      noClassesDiv.textContent = "Có lỗi khi tải danh sách lớp học";
      classCount.textContent = "";
      addClassBtn.classList.add("hidden");
    }
  }

document.getElementById("add-class-btn").addEventListener("click", (e) => {
  e.preventDefault();
  document.getElementById("add-class-modal").classList.remove("hidden");
});

const addClassModal = document.getElementById("add-class-modal");
addClassModal.addEventListener("click", (e) => {
  if (e.target === addClassModal) addClassModal.classList.add("hidden");
});

const editClassModal = document.getElementById("edit-class-modal");
editClassModal.addEventListener("click", (e) => {
  if (e.target === editClassModal) editClassModal.classList.add("hidden");
});

document.getElementById("add-class-form")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = {
    class_name: document.getElementById("class-name").value,
    module_id: selectedModuleId,
    academic_year: document.getElementById("academic-year").value,
    semester: document.getElementById("semester").value,
    instructor: document.getElementById("lecturer").value,
    max_students: parseInt(document.getElementById("max-students").value),
    schedule: document.getElementById("schedule").value,
    classroom: document.getElementById("classroom").value,
  };

  try {
    const response = await fetch("/api/class", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await response.json();
    if (data.message?.includes("success") || response.ok) {
      alert("Thêm lớp học thành công!");
      document.getElementById("add-class-modal").classList.add("hidden");
      loadClasses(selectedModuleId);
    } else {
      alert("Thêm lớp học thất bại: " + (data.message || "Lỗi không xác định"));
    }
  } catch (error) {
    console.error("Error adding class:", error);
    alert("Lỗi kết nối server.");
  }
});

async function editClass(classId) {
  try {
    const response = await fetch(`/api/class/${classId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    const classItem = data.classData;

    document.getElementById("edit-class-id").value = classItem.class_id;
    document.getElementById("edit-class-name").value = classItem.class_name;
    document.getElementById("edit-lecturer").value = classItem.instructor;
    document.getElementById("edit-max-students").value = classItem.max_students;
    document.getElementById("edit-academic-year").value = classItem.academic_year;
    document.getElementById("edit-semester").value = classItem.semester;
    document.getElementById("edit-schedule").value = classItem.schedule;
    document.getElementById("edit-classroom").value = classItem.classroom;

    document.getElementById("edit-class-modal").classList.remove("hidden");
  } catch (error) {
    console.error("Error fetching class:", error);
    alert("Lỗi tải dữ liệu lớp học.");
  }
}

document.getElementById("edit-class-form")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const classId = document.getElementById("edit-class-id").value;
  const formData = {
    class_name: document.getElementById("edit-class-name").value,
    module_id: selectedModuleId,
    academic_year: document.getElementById("edit-academic-year").value,
    semester: document.getElementById("edit-semester").value,
    instructor: document.getElementById("edit-lecturer").value,
    max_students: parseInt(document.getElementById("edit-max-students").value),
    schedule: document.getElementById("edit-schedule").value,
    classroom: document.getElementById("edit-classroom").value,
  };

  try {
    const response = await fetch(`/api/class/${classId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await response.json();
    if (data.message?.includes("success") || response.ok) {
      alert("Chỉnh sửa lớp học thành công!");
      document.getElementById("edit-class-modal").classList.add("hidden");
      loadClasses(selectedModuleId);
    } else {
      alert("Chỉnh sửa lớp học thất bại: " + (data.message || "Lỗi không xác định"));
    }
  } catch (error) {
    console.error("Error editing class:", error);
    alert("Lỗi kết nối server.");
  }
});

function closeAddClassModal() {
  document.getElementById("add-class-modal").classList.add("hidden");
}

function closeEditClassModal() {
  document.getElementById("edit-class-modal").classList.add("hidden");
}