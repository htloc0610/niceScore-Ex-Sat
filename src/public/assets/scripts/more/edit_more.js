function editMore(id, entityType) {
    const entityConfigs = {
        "Faculty": { name: "Khoa", idField: "faculty_id", nameField: "name", apiEndpoint: "/api/faculty", tableId: "faculty-table-body" },
        "Status": { name: "Tình trạng", idField: "status_id", nameField: "name", apiEndpoint: "/api/status", tableId: "status-table-body" },
        "Course": { name: "Khóa", idField: "course_id", nameField: "course_name", apiEndpoint: "/api/course", tableId: "course-table-body" }
    };

    const config = entityConfigs[entityType];
    if (!config) return;

    const tableBody = document.getElementById(config.tableId);
    const row = [...tableBody.children].find(row => row.children[0].textContent == id);
    if (!row) {
        console.error("Error updating entity:", error);
        // alert("Đã xảy ra lỗi khi cập nhật.");
        Swal.fire({
            icon: 'error',
            title: 'Lỗi!',
            text: 'Đã xảy ra lỗi khi cập nhật.',
            confirmButtonText: 'Đóng'
        });
    }
    const name = row.children[1].textContent;


    // const overlay = document.createElement("div");
    // overlay.classList.add("fixed", "top-0", "left-0", "w-full", "h-full", "bg-gray-50", "bg-opacity-50");

    const overlay = document.createElement("div");
    overlay.classList.add(
        "fixed",          // Cố định trên màn hình
        "top-0",          // Từ đỉnh
        "left-0",         // Từ trái
        "w-full",         // Chiều rộng đầy đủ
        "h-full",         // Chiều cao đầy đủ
        "bg-gray-50",     // Màu nền
        "bg-opacity-50",  // Độ mờ
        "flex",           // Dùng flexbox
        "items-center",   // Căn giữa theo chiều dọc
        "justify-center"  // Căn giữa theo chiều ngang
    );

    // const modal = document.createElement("div");
    // modal.classList.add("fixed", "top-1/2", "left-1/2", "transform", "-translate-x-1/2", "-translate-y-1/2", "bg-white", "p-5", "shadow-lg", "rounded-lg");

    // Tạo modal (div con)
    // Tạo modal (div con)
    const modal = document.createElement("div");
    modal.classList.add(
        "bg-white",       // Nền trắng
        "p-5",            // Padding
        "shadow-lg",      // Bóng
        "rounded-lg",     // Bo góc
        "max-w-md"        // Giới hạn chiều rộng tối đa
    );

    const form = document.createElement("form");
    form.innerHTML = `
      <h2 class="text-xl font-bold mb-4 mx-20">Chỉnh sửa ${config.name}</h2>
      <div class="grid gap-4">
        <div>
          <input type="text" id="${config.idField}" name="${config.idField}" value="${id}" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" hidden>
        </div>
        <div>
          <label for="${config.nameField}" class="block text-sm font-medium text-gray-700">Tên ${config.name.toLowerCase()}:</label>
          <input type="text" id="${config.nameField}" name="${config.nameField}" value="${name}" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm">
        </div>
      </div>
      <div class="mt-4 flex justify-end">
        <button type="button" id="closeModal" class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">Đóng</button>
        <button type="submit" class="ml-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Lưu</button>
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
                    // alert(`${config.name} đã được cập nhật!`);
                    Swal.fire({
                        icon: 'success',
                        title: 'Thành công!',
                        text: `${config.name} đã được cập nhật!`,
                        confirmButtonText: 'OK',
                        timer: 2000,
                        timerProgressBar: true,
                        showConfirmButton: false
                    });
                    document.body.removeChild(overlay);

                    row.children[1].textContent = entityData[config.nameField];
                } else {
                    // alert(`Lỗi khi cập nhật ${config.name}.`);
                    Swal.fire({
                        icon: 'error',
                        title: 'Lỗi!',
                        text: `Lỗi khi cập nhật ${config.name}.`,
                        confirmButtonText: 'Đóng'
                    });
                }
            })
            .catch(error => {
                console.error("Error updating entity:", error);
                // alert("Đã xảy ra lỗi khi cập nhật.");
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi!',
                    text: 'Đã xảy ra lỗi khi cập nhật.',
                    confirmButtonText: 'Đóng'
                });
            });
    });

    form.querySelector("#closeModal").addEventListener("click", function () {
        document.body.removeChild(overlay);
    });

    modal.appendChild(form);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
}
