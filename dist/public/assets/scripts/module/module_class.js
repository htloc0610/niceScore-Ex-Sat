// module_class.js
let selectedModuleId = null;
let selectedModuleName = "";
let selectedFacultyName = "";

// Translation variables
let translations = {};
let currentLang = "en";

// Load translations
async function loadTranslations() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get("lang");
    const localStorageLang = localStorage.getItem("lang");
    
    // Prioritize URL param, then localStorage, then default to "en"
    currentLang = urlLang || localStorageLang || "en";
    
    // If the language was specified in URL, save it to localStorage for consistency
    if (urlLang) {
      localStorage.setItem("lang", urlLang);
    }

    const enResponse = await fetch("/assets/scripts/locales/en.json");
    const viResponse = await fetch("/assets/scripts/locales/vi.json");

    const enData = await enResponse.json();
    const viData = await viResponse.json();

    translations = {
      en: enData,
      vi: viData,
    };
  } catch (error) {
    console.error("Error loading translations:", error);
  }
}

// Load translations when page loads
document.addEventListener("DOMContentLoaded", async () => {
  await loadTranslations();
});

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
        row.className =
          "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors";
        const viewText =
          (translations &&
            translations[currentLang] &&
            translations[currentLang].modules &&
            translations[currentLang].modules.classes &&
            translations[currentLang].modules.classes.view) ||
          "View";
        const editText =
          (translations &&
            translations[currentLang] &&
            translations[currentLang].modules &&
            translations[currentLang].modules.classes &&
            translations[currentLang].modules.classes.edit) ||
          "Edit";

        row.innerHTML = `
            <td class="px-4 py-3 text-sm truncate">${classItem.class_id}</td>
            <td class="px-4 py-3 text-sm truncate" title="${classItem.class_name}">${classItem.class_name}</td>
            <td class="px-4 py-3 text-sm truncate" title="${classItem.instructor}">${classItem.instructor}</td>
            <td class="px-4 py-3 text-sm">${classItem.max_students}</td>
            <td class="px-4 py-3 text-sm truncate" title="${classItem.schedule}">${classItem.schedule}</td>
            <td class="px-4 py-3 text-sm truncate" title="${classItem.classroom}">${classItem.classroom}</td>
            <td class="px-4 py-3 text-sm">
              <button class="px-2 py-1 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 transition-colors"
                onclick="window.location.href='/class/${classItem.class_id}'">${viewText}</button>
              <button class="px-2 py-1 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                onclick="editClass('${classItem.class_id}')">${editText}</button>
            </td>
          `;
        classTableBody.appendChild(row);
      });
      classTable.classList.remove("hidden");
      noClassesDiv.classList.add("hidden");
      const totalClassesText =
        (translations &&
          translations[currentLang] &&
          translations[currentLang].modules &&
          translations[currentLang].modules.classes &&
          translations[currentLang].modules.classes.total_classes) ||
        "Total classes";
      classCount.textContent = `${totalClassesText}: ${classes.length}`;
      addClassBtn.classList.remove("hidden");
      addClassBtn.href = `/classes/add?module_id=${moduleId}`;
    } else {
      classTable.classList.add("hidden");
      noClassesDiv.classList.remove("hidden");
      const noClassesText =
        (translations &&
          translations[currentLang] &&
          translations[currentLang].modules &&
          translations[currentLang].modules.classes &&
          translations[currentLang].modules.classes.no_classes) ||
        "No classes for this module";
      noClassesDiv.textContent = noClassesText;
      const totalClassesText =
        (translations &&
          translations[currentLang] &&
          translations[currentLang].modules &&
          translations[currentLang].modules.classes &&
          translations[currentLang].modules.classes.total_classes) ||
        "Total classes";
      classCount.textContent = `${totalClassesText}: 0`;
      addClassBtn.classList.remove("hidden");
      addClassBtn.href = `/classes/add?module_id=${moduleId}`;
    }
  } catch (error) {
    console.error("Error fetching classes:", error);
    classTable.classList.add("hidden");
    noClassesDiv.classList.remove("hidden");
    const loadingErrorText =
      (translations &&
        translations[currentLang] &&
        translations[currentLang].modules &&
        translations[currentLang].modules.classes &&
        translations[currentLang].modules.classes.loading_error) ||
      "Error loading class list";
    noClassesDiv.textContent = loadingErrorText;
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

document
  .getElementById("add-class-form")
  ?.addEventListener("submit", async (e) => {
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
        // alert("Thêm lớp học thành công!");      const successTitle = translations && translations[currentLang] && translations[currentLang].index && translations[currentLang].index.alert && translations[currentLang].index.alert.success || 'Success';
        const successText =
          (translations &&
            translations[currentLang] &&
            translations[currentLang].modules &&
            translations[currentLang].modules.classes &&
            translations[currentLang].modules.classes.add_class_success) ||
          "Class added successfully!";

        Swal.fire({
          icon: "success",
          title: successTitle,
          text: successText,
          confirmButtonText: "OK",
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
        });

        document.getElementById("add-class-modal").classList.add("hidden");
        loadClasses(selectedModuleId);
      } else {
        // alert("Thêm lớp học thất bại: " + (data.message || "Lỗi không xác định"));      const errorTitle = translations && translations[currentLang] && translations[currentLang].modules && translations[currentLang].modules.alerts && translations[currentLang].modules.alerts.error && translations[currentLang].modules.alerts.error.title || 'Error!';
        const closeButton =
          (translations &&
            translations[currentLang] &&
            translations[currentLang].modules &&
            translations[currentLang].modules.classes &&
            translations[currentLang].modules.classes.close) ||
          "Close";

        Swal.fire({
          icon: "error",
          title: errorTitle,
          text:
            "Thêm lớp học thất bại: " + (data.message || "Lỗi không xác định"),
          confirmButtonText: closeButton,
        });
      }
    } catch (error) {
      console.error("Error adding class:", error);
      // alert("Lỗi kết nối server.");
      const errorTitle =
        (translations &&
          translations[currentLang] &&
          translations[currentLang].modules &&
          translations[currentLang].modules.alerts &&
          translations[currentLang].modules.alerts.error &&
          translations[currentLang].modules.alerts.error.title) ||
        "Error!";
      const serverErrorText =
        (translations &&
          translations[currentLang] &&
          translations[currentLang].modules &&
          translations[currentLang].modules.classes &&
          translations[currentLang].modules.classes.server_error) ||
        "Server connection error";
      const closeButton =
        (translations &&
          translations[currentLang] &&
          translations[currentLang].modules &&
          translations[currentLang].modules.classes &&
          translations[currentLang].modules.classes.close) ||
        "Close";

      Swal.fire({
        icon: "error",
        title: errorTitle,
        text: serverErrorText,
        confirmButtonText: closeButton,
      });
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
    document.getElementById("edit-academic-year").value =
      classItem.academic_year;
    document.getElementById("edit-semester").value = classItem.semester;
    document.getElementById("edit-schedule").value = classItem.schedule;
    document.getElementById("edit-classroom").value = classItem.classroom;

    document.getElementById("edit-class-modal").classList.remove("hidden");
  } catch (error) {
    console.error("Error fetching class:", error);
    // alert("Lỗi tải dữ liệu lớp học.");
    const errorTitle =
      (translations &&
        translations[currentLang] &&
        translations[currentLang].modules &&
        translations[currentLang].modules.alerts &&
        translations[currentLang].modules.alerts.error &&
        translations[currentLang].modules.alerts.error.title) ||
      "Error!";
    const loadErrorText =
      (translations &&
        translations[currentLang] &&
        translations[currentLang].modules &&
        translations[currentLang].modules.classes &&
        translations[currentLang].modules.classes.loading_error_class) ||
      "Error loading class data";
    const closeButton =
      (translations &&
        translations[currentLang] &&
        translations[currentLang].modules &&
        translations[currentLang].modules.classes &&
        translations[currentLang].modules.classes.close) ||
      "Close";

    Swal.fire({
      icon: "error",
      title: errorTitle,
      text: loadErrorText,
      confirmButtonText: closeButton,
    });
  }
}

document
  .getElementById("edit-class-form")
  ?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const classId = document.getElementById("edit-class-id").value;
    const formData = {
      class_name: document.getElementById("edit-class-name").value,
      module_id: selectedModuleId,
      academic_year: document.getElementById("edit-academic-year").value,
      semester: document.getElementById("edit-semester").value,
      instructor: document.getElementById("edit-lecturer").value,
      max_students: parseInt(
        document.getElementById("edit-max-students").value
      ),
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
        // alert("Chỉnh sửa lớp học thành công!");      const successTitle = translations && translations[currentLang] && translations[currentLang].index && translations[currentLang].index.alert && translations[currentLang].index.alert.success || 'Success';
        const successText =
          (translations &&
            translations[currentLang] &&
            translations[currentLang].modules &&
            translations[currentLang].modules.classes &&
            translations[currentLang].modules.classes.edit_class_success) ||
          "Class updated successfully!";

        Swal.fire({
          icon: "success",
          title: successTitle,
          text: successText,
          confirmButtonText: "OK",
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
        document.getElementById("edit-class-modal").classList.add("hidden");
        loadClasses(selectedModuleId);
      } else {
        // alert("Chỉnh sửa lớp học thất bại: " + (data.message || "Lỗi không xác định"));
        Swal.fire({
          icon: "error",
          title: "Lỗi!",
          text:
            "Chỉnh sửa lớp học thất bại: " +
            (data.message || "Lỗi không xác định"),
          confirmButtonText: "Đóng",
        });
      }
    } catch (error) {
      console.error("Error editing class:", error);
      // alert("Lỗi kết nối server.");
      Swal.fire({
        icon: "error",
        title: "Lỗi!",
        text: "Lỗi kết nối server.",
        confirmButtonText: "Đóng",
      });
    }
  });

function closeAddClassModal() {
  document.getElementById("add-class-modal").classList.add("hidden");
}

function closeEditClassModal() {
  document.getElementById("edit-class-modal").classList.add("hidden");
}
