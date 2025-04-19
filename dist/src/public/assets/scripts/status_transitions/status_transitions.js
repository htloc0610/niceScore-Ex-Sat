document.addEventListener("DOMContentLoaded", () => {
    const statusTransitionButton = document.querySelector("#status-transition .ml-4");

    if (statusTransitionButton) {
        statusTransitionButton.addEventListener("click", async () => {
            try {
                // Call the API to fetch data
                const response = await fetch("/api/status_transition");
                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }

                const data = await response.json();
                
                // Render the data into the table
                const tableBody = document.querySelector("tbody");
                if (tableBody) {
                    tableBody.innerHTML = ""; // Clear existing rows
                    const tableHead = document.querySelector("thead");
                    if (tableHead) {
                        tableHead.innerHTML = `
                            <tr>
                                <th class="px-4 py-2 text-left text-gray-600 dark:text-gray-400">Trạng thái hiện tại</th>
                                <th class="px-4 py-2 text-left text-gray-600 dark:text-gray-400">Trạng thái tiếp theo</th>
                                <th class="px-4 py-2 text-left text-gray-600 dark:text-gray-400">Hành động</th>
                            </tr>
                        `;
                    }

                    data.forEach((config) => {
                        const row = document.createElement("tr");

                        row.innerHTML = `
                            <td class="px-4 py-2 border-t border-gray-200 dark:border-gray-700">${config.currentStatus.name}</td>
                            <td class="px-4 py-2 border-t border-gray-200 dark:border-gray-700">${config.newStatus.name}</td>
                            <td class="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
                                <button class="edit-button px-2 py-1 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue" data-id="${config.id}">
                                    Sửa
                                </button>
                                <button class="delete-button px-2 py-1 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700 focus:outline-none focus:shadow-outline-red" data-id="${config.id}">
                                    Xóa
                                </button>
                            </td>
                        `;

                        tableBody.appendChild(row);

                    });

                    // Add "Add" button below the table
                    let addButton = document.querySelector(".add-button");
                    if (!addButton) {
                        addButton = document.createElement("button");
                        addButton.textContent = "Thêm";
                        addButton.className =
                            "add-button mt-4 bg-green-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-green-700 transition";
                    }

                    // Add button event
                    addButton.addEventListener("click", () => {
                        // Create overlay
                        const overlay = document.createElement("div");
                        overlay.className = "fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50";

                        // Create larger modal
                        const modal = document.createElement("div");
                        modal.className = "bg-white p-8 rounded-2xl shadow-2xl w-[500px] max-w-full";

                        // Modal title
                        const title = document.createElement("h2");
                        title.className = "text-2xl font-bold mb-6 text-gray-700";
                        title.textContent = `Thêm trạng thái`;

                        // Dropdown for current status
                        const currentStatusInput = document.createElement("select");
                        currentStatusInput.className = "w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500";
                        currentStatusInput.placeholder = "Trạng thái hiện tại";

                        // Populate current status dropdown
                        status.forEach((option) => {
                            const optionElement = document.createElement("option");
                            optionElement.value = option.status_id;
                            optionElement.textContent = option.name;
                            currentStatusInput.appendChild(optionElement);
                        });

                        // Dropdown for next status
                        const nextStatusInput = document.createElement("select");
                        nextStatusInput.className = "w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500";
                        nextStatusInput.placeholder = "Trạng thái tiếp theo";

                        // Populate next status dropdown
                        status.forEach((option) => {
                            const optionElement = document.createElement("option");
                            optionElement.value = option.status_id;
                            optionElement.textContent = option.name;
                            nextStatusInput.appendChild(optionElement);
                        });

                        // Button container
                        const buttonContainer = document.createElement("div");
                        buttonContainer.className = "flex justify-end space-x-4 mt-6";

                        // Save button
                        const saveButton = document.createElement("button");
                        saveButton.textContent = "Lưu";
                        saveButton.className =
                            "bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 transition";

                        // Cancel button
                        const cancelButton = document.createElement("button");
                        cancelButton.textContent = "Hủy";
                        cancelButton.className =
                            "bg-gray-300 text-black px-5 py-2 rounded-lg font-medium hover:bg-gray-400 transition";

                        // Save button event
                        saveButton.addEventListener("click", () => {
                            const newCurrentStatus = currentStatusInput.value.trim();
                            const newNextStatus = nextStatusInput.value.trim();

                            if (newCurrentStatus && newNextStatus) {
                                fetch(`/api/status_transition`, {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ current_status: newCurrentStatus, new_status: newNextStatus }),
                                })
                                    .then((response) => {                                        
                                        return response.json();
                                    })
                                    .then((newConfig) => {
                                        console.log(newConfig);
                                        
                                        // alert("Status transition added successfully!");
                                        Swal.fire({
                                            icon: 'success',
                                            title: 'Thành công!',
                                            text: 'Thêm trạng thái thành công!',
                                            confirmButtonText: 'OK',
                                            timer: 2000,
                                            timerProgressBar: true,
                                            showConfirmButton: false
                                        });
                                        const row = document.createElement("tr");
                                        row.innerHTML = `
                                            <td class="px-4 py-2 border-t border-gray-200 dark:border-gray-700">${status.find(option => option.status_id == newConfig.current_status)?.name || newConfig.current_status}</td>
                                            <td class="px-4 py-2 border-t border-gray-200 dark:border-gray-700">${status.find(option => option.status_id == newConfig.new_status)?.name || newConfig.new_status}</td>
                                            <td class="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
                                                <button class="edit-button px-2 py-1 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue" data-id="${newConfig.id}">
                                                    Edit
                                                </button>
                                                <button class="delete-button px-2 py-1 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700 focus:outline-none focus:shadow-outline-red" data-id="${newConfig.id}">
                                                    Delete
                                                </button>
                                            </td>
                                        `;
                                        document.querySelector("tbody").appendChild(row);
                                    })
                                    .catch((error) => {
                                        console.error(error);
                                        // alert("An error occurred while adding the status transition.");
                                        Swal.fire({
                                            icon: 'error',
                                            title: 'Lỗi!',
                                            text: 'Đã xảy ra lỗi: ' + error.message,
                                            confirmButtonText: 'Đóng'
                                        });
                                    });
                            }
                            document.body.removeChild(overlay);
                        });

                        // Cancel button event
                        cancelButton.addEventListener("click", () => {
                            document.body.removeChild(overlay);
                        });

                        // Append elements
                        buttonContainer.appendChild(saveButton);
                        buttonContainer.appendChild(cancelButton);
                        modal.appendChild(title);
                        modal.appendChild(currentStatusInput);
                        modal.appendChild(nextStatusInput);
                        modal.appendChild(buttonContainer);
                        overlay.appendChild(modal);
                        document.body.appendChild(overlay);
                    });

                    // Append the "Add" button to the container below the table
                    const table = document.querySelector("table");
                    
                    if (table && !document.querySelector(".mt-4.flex.justify-end")) {
                        const addButtonContainer = document.createElement("div");
                        addButtonContainer.className = "mt-4 flex justify-end";
                        addButtonContainer.appendChild(addButton);
                        table.parentNode.insertBefore(addButtonContainer, table.nextSibling);
                    }
                    

                    // Add event listeners for delete buttons
                    document.querySelectorAll(".delete-button").forEach((button) => {
                        button.addEventListener("click", async (event) => {
                            const id = event.target.getAttribute("data-id");
                            const confirmDelete = confirm("Are you sure you want to delete this item?");
                            if (confirmDelete) {
                                try {
                                    const response = await fetch(`/api/status_transition/${id}`, {
                                        method: "DELETE",
                                    });
                                    if (!response.ok) {
                                        throw new Error("Failed to delete item");
                                    }
                                    // alert("Item deleted successfully");
                                    Swal.fire({
                                        icon: 'success',
                                        title: 'Thành công!',
                                        text: 'Xóa trạng thái thành công!',
                                        confirmButtonText: 'OK',
                                        timer: 2000,
                                        timerProgressBar: true,
                                        showConfirmButton: false
                                    });
                                    event.target.closest("tr").remove();
                                } catch (error) {
                                    console.error("Error deleting item:", error);
                                    // alert("Failed to delete item");
                                    Swal.fire({
                                        icon: 'error',
                                        title: 'Lỗi!',
                                        text: 'Đã xảy ra lỗi khi xóa trạng thái.',
                                        confirmButtonText: 'Đóng'
                                    });
                                }
                            }
                        });
                    });

                    // Fetch options for dropdowns
                    const fetchOptions = async () => {
                        try {
                            const response = await fetch("/api/status");
                            if (!response.ok) {
                                throw new Error("Failed to fetch status options");
                            }
                            return await response.json();
                        } catch (error) {
                            console.error("Error fetching status options:", error);
                            return [];
                        }
                    };

                    const status = (await fetchOptions()).status;

                   

                    // Add event listeners for edit buttons
                    document.querySelectorAll(".edit-button").forEach((button) => {
                        button.addEventListener("click", (event) => {
                            const row = button.closest("tr");
                            const currentStatus = row.querySelector("td:nth-child(1)").textContent.trim();
                            const nextStatus = row.querySelector("td:nth-child(2)").textContent.trim();

                            // Create overlay
                            const overlay = document.createElement("div");
                            overlay.className = "fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50";

                            // Create larger modal
                            const modal = document.createElement("div");
                            modal.className = "bg-white p-8 rounded-2xl shadow-2xl w-[500px] max-w-full";

                            // Modal title
                            const title = document.createElement("h2");
                            title.className = "text-2xl font-bold mb-6 text-gray-700";
                            title.textContent = `Chỉnh sửa`;

                            // Dropdown for current status
                            const currentStatusInput = document.createElement("select");
                            currentStatusInput.className = "w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500";
                            currentStatusInput.placeholder = "Trạng thái hiện tại";

                            // Populate current status dropdown
                            status.forEach((option) => {
                                const optionElement = document.createElement("option");
                                optionElement.value = option.status_id;
                                optionElement.textContent = option.name;
                                if (option.name === currentStatus) {
                                    optionElement.selected = true;
                                }
                                currentStatusInput.appendChild(optionElement);
                            });

                            // Dropdown for next status
                            const nextStatusInput = document.createElement("select");
                            nextStatusInput.className = "w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500";
                            nextStatusInput.placeholder = "Next Status";

                            // Populate next status dropdown
                            status.forEach((option) => {
                                const optionElement = document.createElement("option");
                                optionElement.value = option.status_id;
                                optionElement.textContent = option.name;
                                if (option.name === nextStatus) {
                                    optionElement.selected = true;
                                }
                                nextStatusInput.appendChild(optionElement);
                            });

                            // Button container
                            const buttonContainer = document.createElement("div");
                            buttonContainer.className = "flex justify-end space-x-4 mt-6";

                            // Save button
                            const saveButton = document.createElement("button");
                            saveButton.textContent = "Save";
                            saveButton.className =
                                "bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 transition";

                            // Cancel button
                            const cancelButton = document.createElement("button");
                            cancelButton.textContent = "Cancel";
                            cancelButton.className =
                                "bg-gray-300 text-black px-5 py-2 rounded-lg font-medium hover:bg-gray-400 transition";

                            // Save button event
                            saveButton.addEventListener("click", () => {
                                const newCurrentStatus = currentStatusInput.value.trim();
                                const newNextStatus = nextStatusInput.value.trim();

                                if (newCurrentStatus !== currentStatus || newNextStatus !== nextStatus) {
                                    fetch(`/api/status_transition`, {
                                        method: "PUT",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({ id: button.getAttribute("data-id"), current_status: newCurrentStatus, new_status: newNextStatus }),
                                    })
                                        .then((response) => {
                                            if (!response.ok) throw new Error("Failed to update status transition");
                                            return response.json();
                                        })
                                        .then(() => {
                                            // alert("Status transition updated successfully!");
                                            Swal.fire({
                                                icon: 'success',
                                                title: 'Thành công!',
                                                text: 'Cập nhật trạng thái thành công!',
                                                confirmButtonText: 'OK',
                                                timer: 2000,
                                                timerProgressBar: true,
                                                showConfirmButton: false
                                            });
                                            const newCurrentStatusName = status.find(option => option.status_id == newCurrentStatus)?.name || newCurrentStatus;
                                            const newNextStatusName = status.find(option => option.status_id == newNextStatus)?.name || newNextStatus;

                                            row.querySelector("td:nth-child(1)").textContent = newCurrentStatusName;
                                            row.querySelector("td:nth-child(2)").textContent = newNextStatusName;
                                        })
                                        .catch((error) => {
                                            console.error(error);
                                            // alert("An error occurred while updating the status transition.");
                                            Swal.fire({
                                                icon: 'error',
                                                title: 'Lỗi!',
                                                text: 'Đã xảy ra lỗi: ' + error.message,
                                                confirmButtonText: 'Đóng'
                                            });
                                        });
                                }
                                document.body.removeChild(overlay);
                            });

                            // Cancel button event
                            cancelButton.addEventListener("click", () => {
                                document.body.removeChild(overlay);
                            });

                            // Append elements
                            buttonContainer.appendChild(saveButton);
                            buttonContainer.appendChild(cancelButton);
                            modal.appendChild(title);
                            modal.appendChild(currentStatusInput);
                            modal.appendChild(nextStatusInput);
                            modal.appendChild(buttonContainer);
                            overlay.appendChild(modal);
                            document.body.appendChild(overlay);
                        });
                    });
                }
            } catch (error) {
                console.error("Error fetching or rendering data:", error);
            }
        });
    }
});
