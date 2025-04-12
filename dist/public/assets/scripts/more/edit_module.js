function editModule(moduleId) {
    // Fetch the module data by its ID
    fetch(`/api/module/${moduleId}`)
        .then(response => response.json())
        .then(moduleData => {
            // Fetch faculties and modules
            Promise.all([
                fetch('/api/faculty').then(response => response.json()),
                fetch('/api/module').then(response => response.json())
            ])
            .then(([facultiesDataValue, modulesDataValue]) => {
                // Create a form with the existing data
                const modal = document.createElement("div");
                modal.style.position = "fixed";
                modal.style.top = "50%";
                modal.style.left = "50%";
                modal.style.transform = "translate(-50%, -50%)";
                modal.style.backgroundColor = "white";
                modal.style.padding = "20px";
                modal.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.1)";
                modal.style.zIndex = "1000";
                const module = moduleData.module;
                const faculties = facultiesDataValue.faculties;
                const modules = modulesDataValue.modules;
                console.log(module)
                const form = document.createElement("form");
                form.innerHTML = `
                    <h2 class="text-xl font-bold mb-4">Chỉnh sửa khóa học</h2>
                    <div class="grid gap-4"  >
                        <label hidden>Mã khóa học</label>
                        <input type="text" name="module_code" value="${module.module_code}" required class="input-style" hidden disabled/>
                        
                        <label>Tên khóa học</label>
                        <input type="text" name="module_name" value="${module.module_name}" required class="input-style" />
                        
                        <label>Số tín chỉ</label>
                        <input type="number" name="credits" min="1" value="${module.credits}" required class="input-style" />
        
                        <label>Khoa phụ trách</label>
                        <select name="faculty_id" required class="input-style">
                            <option value="" selected>Chọn khoa</option>
                            ${faculties.map(f => `<option value="${f.faculty_id}" ${f.faculty_id === module.faculty_id ? 'selected' : ''}>${f.name}</option>`).join("")}
                        </select>
        
                        <label>Môn tiên quyết</label>
                        <select name="prerequisite_id" class="input-style">
                            <option value="">Không có</option>
                            ${modules
                                .filter(m => m.module_id !== module.module_id) 
                                .map(m => `<option value="${m.module_id}" ${m.module_id === module.prerequisite_id ? 'selected' : ''}>${m.module_code} - ${m.module_name}</option>`)
                                .join("")}
                        </select>
                            
                        <label>Tình trạng</label>
                        <select name="is_active" class="input-style" ${module.is_active ? '' : 'disabled'}>
                            <option value="true" ${module.is_active ? 'selected' : ''}>Đang hoạt động</option>
                            <option value="false" ${!module.is_active ? 'selected' : ''}>Không còn được mở</option>
                        </select>
        
                        <label>Mô tả</label>
                        <textarea name="description" class="input-style">${module.description || ''}</textarea>
        
                        <div class="mt-4 flex justify-end">
                            <button type="button" id="closeModal" class="btn-red">Đóng</button>
                            <button type="submit" class="btn-blue">Lưu</button>
                        </div>
                    </div>
                `;
                
          
    
                form.querySelector("#closeModal").addEventListener("click", () => document.body.removeChild(overlay));
                form.addEventListener("submit", async (event) => {
                    event.preventDefault();
                    const formData = Object.fromEntries(new FormData(form).entries());
                    formData.credits = parseInt(formData.credits);
                    formData.faculty_id = parseInt(formData.faculty_id);
                    formData.prerequisite_id = formData.prerequisite_id === "" ? null : formData.prerequisite_id;
                    formData.is_active = formData.is_active === "true";
        
                    try {
                        const res = await fetch(`/api/module/${moduleId}`, {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(formData)
                        });
                        const data = await res.json();
        
                        if (data.message.includes("success")) {
                            alert("Chỉnh sửa thành công!");
                            document.body.removeChild(overlay);
                             // Find and update the row in the table with the new module data
                        const tableBody = document.getElementById("module-table-body");
                        const row = [...tableBody.children].find(row => row.children[0].textContent == moduleId);
                        if (row) {
                            //row.children[1].textContent = formData.module_code;
                            row.children[2].textContent = formData.module_name;
                            row.children[3].textContent = formData.credits;
                            row.children[4].textContent = faculties.find(f => f.faculty_id === formData.faculty_id).name;
                            row.children[5].textContent = formData.prerequisite_id ? modules.find(m => m.module_id === formData.prerequisite_id).module_code : 'Không có';
                            row.children[6].textContent = formData.is_active ? 'Đang hoạt động' : 'Không còn được mở';
                            row.children[7].textContent = formData.description || 'N/A';
                        }
                        } else {
                            alert("Chỉnh sửa thất bại.");
                        }
                    } catch (err) {
                        console.error("Edit module error:", err);
                        alert("Lỗi kết nối server.");
                    }
                });

                modal.appendChild(form);
                const overlay = document.createElement("div");
                overlay.classList.add("fixed", "top-0", "left-0", "w-full", "h-full", "bg-gray-50", "bg-opacity-50");
                overlay.appendChild(modal);
                document.body.appendChild(overlay);

                
    // Tailwind classes for input/button reuse
    const inputStyle = "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm";
    const btnRed = "ml-2 inline-flex justify-center py-2 px-4 border border-transparent shadow-lg text-sm font-semibold rounded-md text-white bg-red-600 hover:bg-red-700";
    const btnBlue = "ml-2 inline-flex justify-center py-2 px-4 border border-transparent shadow-lg text-sm font-semibold rounded-md text-white bg-blue-600 hover:bg-blue-700";
  
    form.querySelectorAll("input, select, textarea").forEach(el => el.classList.add(...inputStyle.split(" ")));
    form.querySelector(".btn-red").classList.add(...btnRed.split(" "));
    form.querySelector(".btn-blue").classList.add(...btnBlue.split(" "));
            })
            .catch(err => {
                console.error("Error fetching faculties and modules:", err);
                alert("Lỗi kết nối với dữ liệu.");
            });
        })
        .catch(err => {
            console.error("Error fetching module data:", err);
            alert("Lỗi kết nối với khóa học.");
        });
}
