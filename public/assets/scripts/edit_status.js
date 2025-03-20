function editStatus(id) {
   
    const statusIndex = statuses.findIndex(status => status.status_id === id);
    const status = statuses[statusIndex];
    console.log(statuses, statusIndex);

    const overlay = document.createElement("div");
    overlay.classList.add(
      "fixed",
      "top-0",  
      "left-0",
      "w-full",
      "h-full",
      "bg-gray-50",
      "bg-opacity-50",
    );
        // Create the modal container
        const modal = document.createElement("div");
        modal.classList.add(
          "fixed",
          "top-1/2",
          "left-1/2",
          "transform",
          "-translate-x-1/2",
          "-translate-y-1/2",
          "bg-white",
          "p-5",
          "shadow-lg",
          "rounded-lg"
        );
  
        const form = document.createElement("form");
        form.id = "editStatusForm";
  
        // Generate the form content with the student's existing data
        form.innerHTML = `
          <h2 class="text-xl font-bold mb-4">Chỉnh sửa sinh viên</h2>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="status_id" class="block text-sm font-medium text-gray-700">ID:</label>
              <input type="number" id="status_id" name="status_id" value="${id}" 
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" readonly>
            </div>
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700">Tên trạng thái:</label>
              <input type="text" id="name" name="name" value="${status.name}" required 
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            </div>
           </div>
          <div class="mt-4 flex justify-end">
            <button type="submit" id="submitModal" class="inline-flex justify-center py-2 px-4 border border-transparent shadow-lg text-sm font-semibold rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">Lưu</button>
            <button type="button" id="closeModal" class="ml-2 inline-flex justify-center py-2 px-4 border border-transparent shadow-lg text-sm font-semibold rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Đóng</button>
          </div>
        `;
  
        // Create the close modal function
        function closeModal() {
          document.body.removeChild(overlay);
        }
  
        // Handle form submit
        form.addEventListener("submit", function (event) {
          event.preventDefault();  // Prevent default form submission
          let formData = new FormData(form);
          let statusData = {};
  
          formData.forEach((value, key) => {
            statusData[key] = key === "status_id" ? Number(value) : value;
        });
          console.log(formData);
          
          // Send the update request to the server
          fetch(`/api/update_status`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(statusData),
          })
            .then((response) => response.json())
            .then((data) => {
              if (data.message === "Status updated successfully") {
                alert("Cập nhật trạng thái thành công! ");
                const tableBody = document.getElementById("status-table-body");
                const row = tableBody.children[statusIndex];
                
                const updatedStatus = data.updatedStatus;
                console.log(data, updatedStatus, statusIndex);
                statuses[statusIndex] = updatedStatus;
                row.innerHTML = 
                `
                <td class="px-4 py-3 text-sm">${id}</td>
                <td class="px-4 py-3 text-sm">${updatedStatus.name}</td>
                <td class="px-4 py-3 text-sm">
                    <button class="p-1 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-md active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple" type="submit" onclick="editStatus(${id})">Edit</button>
                </td>
            `;
                
              } else {
                alert("Đã xảy ra lỗi khi chỉnh trạng thái.");
              }
            })
            .catch((error) => {
              console.error("Error updating status:", error);
              alert("An error occurred while updating the status.");
            });
  
          closeModal();  // Close the modal after submission
        });
  
        // Add an event listener to the close button
        const closeButton = form.querySelector('#closeModal');
        closeButton.addEventListener('click', closeModal);
  
        modal.appendChild(form);
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
      }
  