function addMore(entityType) {
  switch (entityType) {
    case "Faculty":
      openModal("Khoa", "Faculty", "faculty_id", "name", "/api/faculty", "faculty-table-body", "editFaculty");
      break;
    case "Status":
      openModal("Tình trạng", "Status", "status_id", "name", "/api/status", "status-table-body", "editStatus");
      break;
    default:
      openModal("Khóa", "Course", "course_id", "course_name", "/api/course", "course-table-body", "editCourse");
  }

}
function openModal(entityName, entityType, entityIdField, entityNameField, apiEndpoint, tableId, editFunction) {
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

  // Create the form dynamically
  let form = document.createElement("form");


  form.innerHTML = `
      <h2 class="text-xl font-bold mb-4 mx-20">Thêm ${entityName}</h2>
      <div class="grid gap-4">
        <label for="${entityNameField}" class="block text-sm font-medium text-gray-700">Tên ${entityName.toLowerCase()}: </label>
        <input type="text" id="${entityNameField}" name="${entityNameField}" required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
      <div class="mt-4 flex justify-end">
          <button type="submit" class="inline-flex justify-center py-2 px-4 border border-transparent shadow-lg text-sm font-semibold rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">Lưu</button>
          <button type="button" id="closeModal" class="ml-2 inline-flex justify-center py-2 px-4 border border-transparent shadow-lg text-sm font-semibold rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Đóng</button>
      </div>`;

  // Close modal event
  form.querySelector("#closeModal").addEventListener("click", function () {
    document.body.removeChild(overlay);
  });

  // Form submit event
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    let formData = new FormData(form);
    let entityData = {};
    formData.forEach((value, key) => {
      entityData[key] = value;
    });
    console.log(entityData);

    // Send data to the server
    fetch(apiEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(entityData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message.includes("successfully")) {
          alert(`${entityName} đã được thêm!`);
          document.body.removeChild(overlay);

          const newData = data[`new${entityType}`];
          const tableBody = document.getElementById(tableId);
          const row = document.createElement("tr");
          row.classList.add("text-gray-700", "dark:text-gray-400");

          row.innerHTML = `
              <td class="px-4 py-2 border-t border-gray-200 dark:border-gray-700">${newData[entityIdField]}</td>
              <td class="px-4 py-2 border-t border-gray-200 dark:border-gray-700">${newData[entityNameField]}</td>
              <td class="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
                <button class="px-2 py-1 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue"
                  onclick='editMore(${newData[entityIdField]}, "${entityType}")'>
                  Chỉnh sửa
                </button>
              </td>`;

          tableBody.appendChild(row);
        } else {
          alert(`Đã xảy ra lỗi khi thêm ${entityName}.`);
        }
      })
      .catch((error) => {
        console.error(`Error adding ${entityType}:`, error);
        alert(`Đã xảy ra lỗi khi thêm ${entityName}.`);
      });
  });

  // Append the form to the modal
  const overlay = document.createElement("div");
  overlay.classList.add(
    "fixed",
    "top-0",
    "left-0",
    "w-full",
    "h-full",
    "bg-gray-50",
    "bg-opacity-50"
  );

  modal.appendChild(form);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
}
