document
  .querySelector('button[name="add_status"]')
  .addEventListener("click", function () {
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

    // Create the form inside the modal
    let form = document.createElement("form");
    // Fetch statuses from API
    form.innerHTML = `
            <form id="statusForm">
                <h2 class="text-xl font-bold mb-4">Thêm sinh viên mới</h2>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label for="status_id" class="block text-sm font-medium text-gray-700">ID:</label>
                        <input type="text" id="status_id" name="status_id" required 
                            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                    </div>
                    <div>
                        <label for="name" class="block text-sm font-medium text-gray-700">Tên trạng thái</label>
                        <input type="text" id="name" name="name" required 
                            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                    </div>   
                </div>
                <div class="mt-4 flex justify-end">
                    <button type="submit" class="inline-flex justify-center py-2 px-4 border border-transparent shadow-lg text-sm font-semibold rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">Lưu</button>
                    <button type="button" id="closeModal" class="ml-2 inline-flex justify-center py-2 px-4 border border-transparent shadow-lg text-sm font-semibold rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Đóng</button>
                </div>
            </form>
        `;
      
        form.querySelector("#closeModal")
          .addEventListener("click", function () {
            document.body.removeChild(overlay);
          });
          
        // Form submit event
        form.addEventListener("submit", function (event) {
          event.preventDefault();

          let formData = new FormData(form);
          let statusData = {};
          formData.forEach((value, key) => {
            statusData[key] = value;
          });

          // Send data to the server
          fetch("/api/add_status", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(statusData),
          })
            .then((response) => response.json())
            .then((data) => {
              if (data.message === "Status added successfully") {
                alert("Khoa mới đã được thêm!");
                document.body.removeChild(overlay);
                
                const statusData = data.newStatus;
                const statusTableBody = document.getElementById("status-table-body");
                const row = document.createElement("tr");
                row.classList.add("text-gray-700", "dark:text-gray-400");
                row.innerHTML = `
                <td class="px-4 py-3 text-sm">${statusData.status_id}</td>
                <td class="px-4 py-3 text-sm">${statusData.name}</td>
                <td class="px-4 py-3 text-sm">
                    <button class="p-1 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-md active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple" type="submit" onclick="editStatus(${statusData.status_id})">Edit</button>
                </td>
            `;
            statusTableBody.appendChild(row);
            statuses.push(statusData);
                
              } else {
                alert("Đã xảy ra lỗi khi thêm khoa.");
              }
            })
            .catch((error) => {
              console.error("Error adding status:", error);
              alert("Đã xảy ra lỗi khi thêm khoa.");
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
      "bg-opacity-50",
    );
    
    modal.appendChild(form);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
      });
    
    