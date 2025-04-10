// module.js
document.addEventListener("DOMContentLoaded", () => {
  loadModules();

  const searchInput = document.getElementById("moduleSearch");
  searchInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const moduleItems = document.querySelectorAll("#module-list li");
    moduleItems.forEach((item) => {
      const moduleName = item.querySelector("p.font-medium").textContent.toLowerCase();
      item.style.display = moduleName.includes(searchTerm) ? "" : "none";
    });
  });

  const addModuleBtn = document.querySelector('a[href="/modules/add"]');
  addModuleBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    await loadDropdownData("add");
    document.getElementById("add-module-modal").classList.remove("hidden");
  });

  const addModuleModal = document.getElementById("add-module-modal");
  addModuleModal.addEventListener("click", (e) => {
    if (e.target === addModuleModal) addModuleModal.classList.add("hidden");
  });

  const editModuleModal = document.getElementById("edit-module-modal");
  editModuleModal.addEventListener("click", (e) => {
    if (e.target === editModuleModal) editModuleModal.classList.add("hidden");
  });
});

async function loadModules() {
  try {
    const response = await fetch("/api/module", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    const modules = data.modules;
    renderModuleList(modules);
  } catch (error) {
    console.error("Error loading modules:", error);
  }
}

function renderModuleList(modules) {
  const moduleList = document.getElementById("module-list");
  moduleList.innerHTML = modules
    .map((m) => {
      const facultyName = m.faculty?.name || "N/A";
      return `
        <li class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
          <div class="flex items-center justify-between">
            <div onclick="loadClasses('${m.module_id}')">
              <p class="font-medium text-gray-800 dark:text-gray-100">${m.module_name}</p>
              <p class="text-xs text-gray-600 dark:text-gray-400">${m.module_code} - ${m.credits} tín chỉ - ${facultyName}</p>
            </div>
            <div class="flex gap-2 items-center justify-center">
              <span class="text-xs px-2 py-1 rounded-full ${m.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                ${m.is_active ? 'Active' : 'Inactive'}
              </span>
              <button class="px-2 py-1 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700" onclick="editModule('${m.module_id}')">Sửa</button>
            </div>
          </div>
        </li>
      `;
    })
    .join("");
}

async function loadDropdownData(type = "add", currentFacultyId = "", currentPrerequisiteId = "") {
  try {
    const [facultyResponse, moduleResponse] = await Promise.all([
      fetch("/api/faculty", { method: "GET", headers: { "Content-Type": "application/json" } }),
      fetch("/api/module", { method: "GET", headers: { "Content-Type": "application/json" } }),
    ]);
    const faculties = (await facultyResponse.json()).faculties;
    const modules = (await moduleResponse.json()).modules;

    const facultySelect = document.getElementById(`${type}-faculty-id`);
    facultySelect.innerHTML = `<option value="" selected>Chọn khoa</option>` + 
      faculties.map(f => `<option value="${f.faculty_id}">${f.name}</option>`).join("");
    
    const prerequisiteSelect = document.getElementById(`${type}-prerequisite-id`);
    prerequisiteSelect.innerHTML = `<option value="" selected>Không có</option>` + 
      modules.map(m => `<option value="${m.module_id}">${m.module_code} - ${m.module_name}</option>`).join("");

    // Nếu là modal chỉnh sửa, chọn giá trị hiện tại
    if (type === "edit") {
      facultySelect.value = currentFacultyId || "";
      prerequisiteSelect.value = currentPrerequisiteId || "";
    }
  } catch (error) {
    console.error("Error loading dropdown data:", error);
  }
}

document.getElementById("add-module-form")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = {
    module_code: document.getElementById("module-code").value,
    module_name: document.getElementById("module-name").value,
    credits: parseInt(document.getElementById("credits").value),
    faculty_id: parseInt(document.getElementById("add-faculty-id").value),
    prerequisite_id: document.getElementById("add-prerequisite-id").value || null,
    is_active: document.getElementById("module-status").value === "1",
    description: document.getElementById("description").value || null,
  };

  try {
    const response = await fetch("/api/module", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await response.json();
    if (data.message?.includes("success") || response.ok) {
      alert("Thêm môn học thành công!");
      document.getElementById("add-module-modal").classList.add("hidden");
      loadModules();
    } else {
      alert("Thêm môn học thất bại.");
    }
  } catch (error) {
    console.error("Error adding module:", error);
    alert("Lỗi kết nối server.");
  }
});

async function editModule(moduleId) {
  try {
    const response = await fetch(`/api/module/${moduleId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    const module = data.module;

    // Điền dữ liệu vào form
    document.getElementById("edit-module-id").value = module.module_id;
    document.getElementById("edit-module-code-display").textContent = `Mã môn học: ${module.module_code}`;
    document.getElementById("edit-module-name").value = module.module_name;
    document.getElementById("edit-credits").value = module.credits;
    document.getElementById("edit-faculty-id").value = module.faculty_id;
    document.getElementById("edit-prerequisite-id").value = module.prerequisite_id || "";
    document.getElementById("edit-module-status").value = module.is_active ? "1" : "0";
    document.getElementById("edit-description").value = module.description || "";

    // Tải dropdown và chọn giá trị hiện tại
    await loadDropdownData("edit", module.faculty_id, module.prerequisite_id || "");

    document.getElementById("edit-module-modal").classList.remove("hidden");
  } catch (error) {
    console.error("Error fetching module:", error);
    alert("Lỗi tải dữ liệu môn học.");
  }
}

document.getElementById("edit-module-form")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const moduleId = document.getElementById("edit-module-id").value;
  const formData = {
    module_name: document.getElementById("edit-module-name").value,
    credits: parseInt(document.getElementById("edit-credits").value),
    faculty_id: parseInt(document.getElementById("edit-faculty-id").value),
    prerequisite_id: document.getElementById("edit-prerequisite-id").value || null,
    is_active: document.getElementById("edit-module-status").value === "1",
    description: document.getElementById("edit-description").value || null,
  };

  try {
    const response = await fetch(`/api/module/${moduleId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await response.json();
    if (data.message?.includes("success") || response.ok) {
      alert("Chỉnh sửa môn học thành công!");
      document.getElementById("edit-module-modal").classList.add("hidden");
      loadModules();
    } else {
      alert("Chỉnh sửa môn học thất bại: " + (data.message || "Lỗi không xác định"));
    }
  } catch (error) {
    console.error("Error editing module:", error);
    alert("Lỗi kết nối server.");
  }
});

function closeEditModuleModal() {
  document.getElementById("edit-module-modal").classList.add("hidden");
}