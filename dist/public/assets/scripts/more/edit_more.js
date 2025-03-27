function editMore(id, entityType) {
    const entityConfigs = {
        "Faculty": { name: "Khoa", idField: "faculty_id", nameField: "name", apiEndpoint: "/api/faculty", tableId: "faculty-table-body" },
        "Status": { name: "Tình trạng", idField: "status_id", nameField: "name", apiEndpoint: "/api/status", tableId: "status-table-body" },
        "Course": { name: "Khóa",  idField: "course_id", nameField: "course_name", apiEndpoint: "/api/course", tableId: "course-table-body" }
    };
    
    const config = entityConfigs[entityType];
    if (!config) return;

    const tableBody = document.getElementById(config.tableId);
    const row = [...tableBody.children].find(row => row.children[0].textContent == id);
    if (!row)
    {
        console.error("Error updating entity:", error);
        alert("Đã xảy ra lỗi khi cập nhật.");
    }
    const name = row.children[1].textContent;


    const overlay = document.createElement("div");
    overlay.classList.add("fixed", "top-0", "left-0", "w-full", "h-full", "bg-gray-50", "bg-opacity-50");
    
    const modal = document.createElement("div");
    modal.classList.add("fixed", "top-1/2", "left-1/2", "transform", "-translate-x-1/2", "-translate-y-1/2", "bg-white", "p-5", "shadow-lg", "rounded-lg");
    
    const form = document.createElement("form");
    form.innerHTML = `
      <h2 class="text-xl font-bold mb-4">Chỉnh sửa ${config.name}</h2>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label for="${config.idField}" class="block text-sm font-medium text-gray-700">ID:</label>
          <input type="text" id="${config.idField}" name="${config.idField}" value="${id}" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" readonly>
        </div>
        <div>
          <label for="${config.nameField}" class="block text-sm font-medium text-gray-700">Tên ${config.name.toLowerCase()}:</label>
          <input type="text" id="${config.nameField}" name="${config.nameField}" value="${name}" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm">
        </div>
      </div>
      <div class="mt-4 flex justify-end">
        <button type="submit" class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">Lưu</button>
        <button type="button" id="closeModal" class="ml-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Đóng</button>
      </div>
    `;

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        let formData = new FormData(form);
        let entityData = {};
        formData.forEach((value, key) => {
            entityData[key] = value;
        });

        fetch(config.apiEndpoint, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(entityData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.message.includes("successfully")) {
                alert(`${config.name} đã được cập nhật!`);
                document.body.removeChild(overlay);

                row.children[1].textContent = entityData[config.nameField];
            } else {
                alert(`Lỗi khi cập nhật ${config.name}.`);
            }
        })
        .catch(error => {
            console.error("Error updating entity:", error);
            alert("Đã xảy ra lỗi khi cập nhật.");
        });
    });

    form.querySelector("#closeModal").addEventListener("click", function () {
        document.body.removeChild(overlay);
    });

    modal.appendChild(form);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
}
