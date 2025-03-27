document.addEventListener("DOMContentLoaded", () => {
    const editButtons = document.querySelectorAll("tbody button");

    editButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const row = button.closest("tr");
            const configKey = row.querySelector("td:nth-child(1)").textContent.trim();
            const configValue = row.querySelector("td:nth-child(2)").textContent.trim();

            // Tạo overlay
            const overlay = document.createElement("div");
            overlay.className = "fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50";

            // Tạo modal lớn hơn
            const modal = document.createElement("div");
            modal.className = "bg-white p-8 rounded-2xl shadow-2xl w-[500px] max-w-full";

            // Tiêu đề modal
            const title = document.createElement("h2");
            title.className = "text-2xl font-bold mb-6 text-gray-700";
            title.textContent = `Chỉnh sửa: ${configKey}`;

            // Input
            const input = document.createElement("input");
            input.type = "text";
            input.value = configValue;
            input.className = "w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500";

            // Container nút bấm
            const buttonContainer = document.createElement("div");
            buttonContainer.className = "flex justify-end space-x-4 mt-6";

            // Nút Save
            const saveButton = document.createElement("button");
            saveButton.textContent = "Lưu";
            saveButton.className =
                "bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 transition";

            // Nút Cancel
            const cancelButton = document.createElement("button");
            cancelButton.textContent = "Hủy";
            cancelButton.className =
                "bg-gray-300 text-black px-5 py-2 rounded-lg font-medium hover:bg-gray-400 transition";

            // Gán sự kiện cho nút Save
            saveButton.addEventListener("click", () => {
                const newValue = input.value.trim();
                if (newValue !== configValue) {
                    fetch(`/api/configurations`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ config_key: configKey, config_value: newValue }),
                    })
                        .then((response) => {
                            if (!response.ok) throw new Error("Failed to update configuration");
                            return response.json();
                        })
                        .then(() => {
                            alert("Configuration updated successfully!");
                            row.querySelector("td:nth-child(2)").textContent = newValue;
                        })
                        .catch((error) => {
                            console.error(error);
                            alert("An error occurred while updating the configuration.");
                        });
                }
                document.body.removeChild(overlay);
            });

            // Gán sự kiện cho nút Cancel
            cancelButton.addEventListener("click", () => {
                document.body.removeChild(overlay);
            });

            // Gán các phần tử vào modal
            buttonContainer.appendChild(cancelButton);
            buttonContainer.appendChild(saveButton);
            modal.appendChild(title);
            modal.appendChild(input);
            modal.appendChild(buttonContainer);
            overlay.appendChild(modal);
            document.body.appendChild(overlay);
        });
    });
});
