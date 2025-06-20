document.addEventListener("DOMContentLoaded", () => {
    // Đối tượng dịch văn bản tĩnh
    const translations = {
        vi: {
            tableHeaders: {
                currentStatus: "Trạng thái hiện tại",
                nextStatus: "Trạng thái tiếp theo",
                action: "Hành động",
            },
            buttons: {
                add: "Thêm",
                edit: "Sửa",
                delete: "Xóa",
                save: "Lưu",
                cancel: "Hủy",
            },
            modalTitles: {
                add: "Thêm trạng thái",
                edit: "Chỉnh sửa",
            },
            alerts: {
                addSuccess: "Thêm trạng thái thành công!",
                editSuccess: "Cập nhật trạng thái thành công!",
                deleteSuccess: "Xóa trạng thái thành công!",
                addError: "Đã xảy ra lỗi khi thêm trạng thái.",
                editError: "Đã xảy ra lỗi khi cập nhật trạng thái.",
                deleteError: "Đã xảy ra lỗi khi xóa trạng thái.",
            },
        },
        en: {
            tableHeaders: {
                currentStatus: "Current Status",
                nextStatus: "Next Status",
                action: "Action",
            },
            buttons: {
                add: "Add",
                edit: "Edit",
                delete: "Delete",
                save: "Save",
                cancel: "Cancel",
            },
            modalTitles: {
                add: "Add Status",
                edit: "Edit Status",
            },
            alerts: {
                addSuccess: "Status transition added successfully!",
                editSuccess: "Status transition updated successfully!",
                deleteSuccess: "Status transition deleted successfully!",
                addError: "An error occurred while adding the status transition.",
                editError: "An error occurred while updating the status transition.",
                deleteError: "An error occurred while deleting the status transition.",
            },
        },
    };

    // Hàm lấy ngôn ngữ hiện tại
    const getLang = () => localStorage.getItem('lang') || 'vi';

    // Hàm làm mới bảng
    const refreshTable = async () => {
        try {
            const lang = getLang();
            const response = await fetch("/api/status_transition");
            if (!response.ok) {
                throw new Error("Failed to fetch data");
            }

            const data = await response.json();
            const tableBody = document.querySelector("tbody");
            const tableHead = document.querySelector("thead");

            if (tableBody && tableHead) {
                // Cập nhật tiêu đề bảng
                tableHead.innerHTML = `
                    <tr>
                        <th class="px-4 py-2 text-left text-gray-600 dark:text-gray-400">${translations[lang].tableHeaders.currentStatus}</th>
                        <th class="px-4 py-2 text-left text-gray-600 dark:text-gray-400">${translations[lang].tableHeaders.nextStatus}</th>
                        <th class="px-4 py-2 text-left text-gray-600 dark:text-gray-400">${translations[lang].tableHeaders.action}</th>
                    </tr>
                `;

                // Xóa các hàng hiện có
                tableBody.innerHTML = "";

                // Hiển thị dữ liệu
                data.forEach((config) => {
                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td class="px-4 py-2 border-t border-gray-200 dark:border-gray-700">${config.currentStatus[`name_${lang}`]}</td>
                        <td class="px-4 py-2 border-t border-gray-200 dark:border-gray-700">${config.newStatus[`name_${lang}`]}</td>
                        <td class="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
                            <button class="edit-button px-2 py-1 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue" data-id="${config.id}">
                                ${translations[lang].buttons.edit}
                            </button>
                            <button class="delete-button px-2 py-1 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700 focus:outline-none focus:shadow-outline-red" data-id="${config.id}">
                                ${translations[lang].buttons.delete}
                            </button>
                        </td>
                    `;
                    tableBody.appendChild(row);
                });
            }
        } catch (error) {
            console.error("Error fetching or rendering data:", error);
        }
    };

    // Hàm lấy danh sách trạng thái từ API
    const fetchOptions = async () => {
        try {
            const response = await fetch("/api/status");
            if (!response.ok) {
                throw new Error("Failed to fetch status options");
            }
            return (await response.json()).status || [];
        } catch (error) {
            console.error("Error fetching status options:", error);
            return [];
        }
    };

    // Hàm tạo modal (dùng chung cho Thêm và Chỉnh sửa)
    const createModal = (mode, config = {}, row = null) => {
        const lang = getLang();
        const overlay = document.createElement("div");
        overlay.className = "fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50";

        const modal = document.createElement("div");
        modal.className = "bg-white p-8 rounded-2xl shadow-2xl w-[500px] max-w-full";

        const title = document.createElement("h2");
        title.className = "text-2xl font-bold mb-6 text-gray-700";
        title.textContent = translations[lang].modalTitles[mode];

        const currentStatusInput = document.createElement("select");
        currentStatusInput.className = "w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500";

        const nextStatusInput = document.createElement("select");
        nextStatusInput.className = "w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500";

        // Lấy danh sách trạng thái
        fetchOptions().then((status) => {
            status.forEach((option) => {
                const currentOption = document.createElement("option");
                currentOption.value = option.status_id;
                currentOption.textContent = option[`name_${lang}`];
                if (mode === "edit" && option[`name_${lang}`] === row.querySelector("td:nth-child(1)").textContent.trim()) {
                    currentOption.selected = true;
                }
                currentStatusInput.appendChild(currentOption);

                const nextOption = document.createElement("option");
                nextOption.value = option.status_id;
                nextOption.textContent = option[`name_${lang}`];
                if (mode === "edit" && option[`name_${lang}`] === row.querySelector("td:nth-child(2)").textContent.trim()) {
                    nextOption.selected = true;
                }
                nextStatusInput.appendChild(nextOption);
            });
        });

        const buttonContainer = document.createElement("div");
        buttonContainer.className = "flex justify-end space-x-4 mt-6";

        const saveButton = document.createElement("button");
        saveButton.textContent = translations[lang].buttons.save;
        saveButton.className = "bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 transition";

        const cancelButton = document.createElement("button");
        cancelButton.textContent = translations[lang].buttons.cancel;
        cancelButton.className = "bg-gray-300 text-black px-5 py-2 rounded-lg font-medium hover:bg-gray-400 transition";

        saveButton.addEventListener("click", async () => {
            const newCurrentStatus = currentStatusInput.value.trim();
            const newNextStatus = nextStatusInput.value.trim();

            if (newCurrentStatus && newNextStatus) {
                try {
                    const response = await fetch(`/api/status_transition`, {
                        method: mode === "edit" ? "PUT" : "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ 
                            ...(mode === "edit" && { id: config.id }), 
                            current_status: newCurrentStatus, 
                            new_status: newNextStatus 
                        }),
                    });

                    if (!response.ok) {
                        throw new Error(`Failed to ${mode === "edit" ? "update" : "add"} status transition`);
                    }

                    const newConfig = await response.json();
                    Swal.fire({
                        icon: 'success',
                        title: 'Thành công!',
                        text: translations[lang].alerts[`${mode}Success`],
                        confirmButtonText: 'OK',
                        timer: 2000,
                        timerProgressBar: true,
                        showConfirmButton: false,
                    });

                    // Làm mới bảng
                    await refreshTable();
                    document.body.removeChild(overlay);
                } catch (error) {
                    console.error(error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Lỗi!',
                        text: translations[lang].alerts[`${mode}Error`],
                        confirmButtonText: translations[lang].buttons.cancel,
                    });
                }
            }
        });

        cancelButton.addEventListener("click", () => {
            document.body.removeChild(overlay);
        });

        buttonContainer.appendChild(saveButton);
        buttonContainer.appendChild(cancelButton);
        modal.appendChild(title);
        modal.appendChild(currentStatusInput);
        modal.appendChild(nextStatusInput);
        modal.appendChild(buttonContainer);
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
    };

    // Xử lý nút chuyển đổi trạng thái
    const statusTransitionButton = document.querySelector("#status-transition .ml-4");
    if (statusTransitionButton) {
        statusTransitionButton.addEventListener("click", async () => {
            await refreshTable();

            // Thêm nút "Thêm"
            const lang = getLang();
            let addButton = document.querySelector(".add-button");
            if (!addButton) {
                addButton = document.createElement("button");
                addButton.textContent = translations[lang].buttons.add;
                addButton.className = "add-button mt-4 bg-green-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-green-700 transition";
                const table = document.querySelector("table");
                if (table && !document.querySelector(".mt-4.flex.justify-end")) {
                    const addButtonContainer = document.createElement("div");
                    addButtonContainer.className = "mt-4 flex justify-end";
                    addButtonContainer.appendChild(addButton);
                    table.parentNode.insertBefore(addButtonContainer, table.nextSibling);
                }
            }

            addButton.addEventListener("click", () => createModal("add"));

            // Xử lý nút Xóa
            document.querySelectorAll(".delete-button").forEach((button) => {
                button.addEventListener("click", async (event) => {
                    const id = event.target.getAttribute("data-id");
                    const lang = getLang();
                    const confirmDelete = confirm(`Are you sure you want to delete this item?`); // Có thể thay bằng Swal.fire
                    if (confirmDelete) {
                        try {
                            const response = await fetch(`/api/status_transition/${id}`, {
                                method: "DELETE",
                            });
                            if (!response.ok) {
                                throw new Error("Failed to delete item");
                            }
                            Swal.fire({
                                icon: 'success',
                                title: 'Thành công!',
                                text: translations[lang].alerts.deleteSuccess,
                                confirmButtonText: 'OK',
                                timer: 2000,
                                timerProgressBar: true,
                                showConfirmButton: false,
                            });
                            await refreshTable();
                        } catch (error) {
                            console.error("Error deleting item:", error);
                            Swal.fire({
                                icon: 'error',
                                title: 'Lỗi!',
                                text: translations[lang].alerts.deleteError,
                                confirmButtonText: translations[lang].buttons.cancel,
                            });
                        }
                    }
                });
            });

            // Xử lý nút Sửa
            document.querySelectorAll(".edit-button").forEach((button) => {
                button.addEventListener("click", (event) => {
                    const row = button.closest("tr");
                    const config = {
                        id: button.getAttribute("data-id"),
                    };
                    createModal("edit", config, row);
                });
            });
        });
    }

    // Lắng nghe thay đổi ngôn ngữ
    window.addEventListener('storage', async (event) => {
        if (event.key === 'lang') {
            await refreshTable();
            const addButton = document.querySelector(".add-button");
            if (addButton) {
                addButton.textContent = translations[getLang()].buttons.add;
            }
        }
    });
});