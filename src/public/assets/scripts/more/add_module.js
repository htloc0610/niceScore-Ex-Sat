function addModule() {
    fetch('/api/faculty', { 
        method: "GET", 
        headers: { "Content-Type": "application/json" } 
    })
    .then(response => response.json())
    .then(async faculties => {
      const response = await fetch('/api/module', { method: "GET", headers: { "Content-Type": "application/json" } });
        const modules = await response.json();
        renderForm(faculties.faculties, modules.modules);
    })
    .catch(error => {
      console.error("Error fetching data:", error);
    });
  }
  
  function renderForm(faculties, modules) {
    console.log(faculties, modules)
    const modal = document.createElement("div");
    modal.style.position = "fixed";
    modal.style.top = "50%";
    modal.style.left = "50%";
    modal.style.transform = "translate(-50%, -50%)";
    modal.style.backgroundColor = "white";
    modal.style.padding = "20px";
    modal.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.1)";
    modal.style.zIndex = "1000";
  
    const form = document.createElement("form");
    form.innerHTML = `
      <h2 class="text-xl font-bold mb-4 mx-20">Thêm Khóa học</h2>
      <div class="grid gap-4">
        <label>Mã khóa học</label>
        <input type="text" name="module_code" required class="input-style" />
        
        <label>Tên khóa học</label>
        <input type="text" name="module_name" required class="input-style" />
        
        <label>Số tín chỉ</label>
        <input type="number" name="credits" min="1" required class="input-style" />
    
        <label>Khoa phụ trách</label>
        <select name="faculty_id" required class="input-style">        
          <option value="" selected>Chọn khoa</option>
          ${faculties.map(f => `<option value="${f.faculty_id}">${f.name}</option>`).join("")}
        </select>
    
        <label>Môn tiên quyết</label>
        <select name="prerequisite_id" class="input-style">
          <option value="">Không có</option>
          ${modules.map(m => `<option value="${m.module_id}">${m.module_code} - ${m.module_name}</option>`).join("")}
        </select>
    
        <label>Tình trạng</label>
        <select name="is_active" class="input-style" hidden>
          <option value="true" selected>Hoạt động</option>
          <option value="false">Dừng</option>
        </select>
    
        <label>Mô tả</label>
        <textarea name="description" class="input-style"></textarea>
    
        <div class="mt-4 flex justify-end">
          <button type="button" id="closeModal" class="btn-red">Đóng</button>
          <button type="submit" class="btn-blue">Lưu</button>
        </div>
      </div>
    `;
    
    form.querySelector("#closeModal").addEventListener("click", () => {
      document.body.removeChild(overlay);  // Close the modal
    });
    
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const formData = Object.fromEntries(new FormData(form).entries());
      formData.credits = parseInt(formData.credits);  
      formData.prerequisite_id = formData.prerequisite_id === "" ? null : formData.prerequisite_id;
      formData.is_active = formData.is_active === "true";
  
      try {
        const res = await fetch("/api/module", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        });
        const data = await res.json();
    
        if (data.message.includes("success")) {
          // alert("Add module success!");
          Swal.fire({
            icon: 'success',
            title: 'Thành công!',
            text: 'Thêm module thành công!',
            confirmButtonText: 'OK',
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false
          });
          document.body.removeChild(overlay);  // Close the modal after success
          addRowToTable(data.newModule); // Call function to add row to the table

          // Optionally update table or UI
        } else {
          // alert("Thêm module thất bại.");
          Swal.fire({
            icon: 'error',
            title: 'Lỗi!',
            text: 'Thêm module thất bại: ' + (data.message || "Lỗi không xác định"),
            confirmButtonText: 'Đóng'
          });
        }
      } catch (err) {
        console.error("Add module error:", err);
        // alert("Lỗi kết nối server.");
        Swal.fire({
          icon: 'error',
          title: 'Lỗi!',
          text: 'Lỗi kết nối server.',
          confirmButtonText: 'Đóng'
        });
      }
    });
  
    const overlay = document.createElement("div");
    overlay.classList.add("fixed", "top-0", "left-0", "w-full", "h-full", "bg-gray-50", "bg-opacity-50");
  
    // Tailwind classes for input/button reuse
    const inputStyle = "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm";
    const btnRed = "ml-2 inline-flex justify-center py-2 px-4 border border-transparent shadow-lg text-sm font-semibold rounded-md text-white bg-red-600 hover:bg-red-700";
    const btnBlue = "ml-2 inline-flex justify-center py-2 px-4 border border-transparent shadow-lg text-sm font-semibold rounded-md text-white bg-blue-600 hover:bg-blue-700";
  
    form.querySelectorAll("input, select, textarea").forEach(el => el.classList.add(...inputStyle.split(" ")));
    form.querySelector(".btn-red").classList.add(...btnRed.split(" "));
    form.querySelector(".btn-blue").classList.add(...btnBlue.split(" "));
  
    modal.appendChild(form);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
  }
  function addRowToTable(newData) {
    const tableBody = document.getElementById("module-table-body"); // replace tableId with the actual ID of your table body
    const row = document.createElement("tr");
    row.classList.add("text-gray-700", "dark:text-gray-400");

    row.innerHTML = `
        <td class="px-4 py-2 border-t border-gray-200 dark:border-gray-700">${newData.module_id}</td>
        <td class="px-4 py-2 border-t border-gray-200 dark:border-gray-700">${newData.module_code}</td>
        <td class="px-4 py-2 border-t border-gray-200 dark:border-gray-700">${newData.module_name}</td>
        <td class="px-4 py-2 border-t border-gray-200 dark:border-gray-700">${newData.credits}</td>
        <td class="px-4 py-2 border-t border-gray-200 dark:border-gray-700">${newData.faculty.name}</td>
        <td class="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
            ${newData.prerequisite ? newData.prerequisite.module_code + ' - ' + newData.prerequisite.module_name : 'Không'}
        </td>
        <td class="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
            <span class="${newData.is_active ? 'px-2 py-1 font-semibold leading-tight text-orange-700 bg-orange-100 rounded-full dark:text-white dark:bg-orange-600' : 'px-2 py-1 font-semibold leading-tight text-red-700 bg-red-100 rounded-full dark:text-red-100 dark:bg-red-700'}">
                ${newData.is_active ? 'Hoạt động' : 'Dừng'}
            </span>
        </td>
        <td class="px-4 py-2 border-t border-gray-200 dark:border-gray-700">${newData.description || ''}</td>
        <td class="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
            <button class="px-2 py-1 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue"
                onclick='editModule(${newData.module_id})'>
                Chỉnh sửa
            </button>
            <button class="px-2 py-1 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700 focus:outline-none focus:shadow-outline-red"
                onclick='deleteModule(${newData.module_id})'>
                Xóa
            </button>
        </td>
    `;

    tableBody.appendChild(row);
}
