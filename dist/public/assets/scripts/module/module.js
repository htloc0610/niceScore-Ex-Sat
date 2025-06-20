// module.js
let t; // Global translations object

// Define default translations to use if loading fails
const defaultTranslations = {
  modules: {
    list: {
      title: "Modules",
      search: "Search modules",
      credits: "credits",
      status: {
        active: "Active",
        inactive: "Inactive"
      },
      buttons: {
        edit: "Edit",
        delete: "Delete"
      }
    },
    form: {
      add: {
        title: "Add Module",
        button: "Add Module"
      },
      edit: {
        title: "Edit Module",
        button: "Save Changes"
      },
      labels: {
        code: "Module Code",
        name_vi: "Module Name (Vietnamese)",
        name_en: "Module Name (English)",
        credits: "Credits",
        faculty: "Faculty",
        prerequisite: "Prerequisite Module",
        status: "Status",
        description_vi: "Description (Vietnamese)",
        description_en: "Description (English)",
        active: "Active",
        inactive: "Inactive",
        no_prerequisite: "None"
      }
    },
    alerts: {
      success: {
        add: "Module added successfully!",
        edit: "Module updated successfully!",
        delete: "Module deleted successfully!"
      },
      error: {
        title: "Error!",
        add: "Failed to add module.",
        edit: "Failed to edit module: ",
        delete: "Failed to delete module: ",
        load: "Failed to load module data.",
        connection: "Server connection error."
      },
      confirm: {
        delete: {
          title: "Are you sure?",
          text: "This action will remove the module from the list!",
          confirmButton: "Delete",
          cancelButton: "Cancel"
        }
      }
    }
  }
};

document.addEventListener("DOMContentLoaded", async () => {
  var credits = null;
  
  // Load translations first
  const lang = localStorage.getItem("lang") || 'en';
  const translationUrl = `/assets/scripts/locales/${lang}.json`;
  try {
    const res = await fetch(translationUrl);
    if (!res.ok) throw new Error("Failed to load translations");
    t = await res.json();
    
    // If the modules section doesn't exist in translations, use our default translations
    if (!t.modules) {
      t.modules = defaultTranslations.modules;
    }
    
    console.log("Loaded translations for modules", t);
  } catch (error) {
    console.error("Error loading translations:", error);
    // Use default translations if loading fails
    t = { modules: defaultTranslations.modules };
  }
  
  // Update UI text elements with translations
  updateUIWithTranslations();
  
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

// Function to update UI elements with translations
function updateUIWithTranslations() {
  // Update page title and all elements with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const text = getNested(t, key) || getNested(defaultTranslations, key) || el.textContent;
    el.textContent = text;
  });
  
  // Update search placeholder
  const searchInput = document.getElementById("moduleSearch");
  if (searchInput) {
    searchInput.placeholder = t.modules?.list?.search || defaultTranslations.modules.list.search;
  }
  
  // Update add module button text
  const addBtn = document.querySelector('a[href="/modules/add"]');
  if (addBtn) {
    addBtn.textContent = t.modules?.form?.add?.button || defaultTranslations.modules.form.add.button;
  }

  // Add class button text
  const addClassBtn = document.getElementById("add-class-btn");
  if (addClassBtn) {
    addClassBtn.textContent = t.modules?.classes?.add || "Add Class";
  }
  
  // Update add module form labels
  document.querySelectorAll('[data-i18n-form-label]').forEach(el => {
    const key = el.getAttribute('data-i18n-form-label');
    if (key) {
      el.textContent = t.modules?.form?.labels?.[key] || defaultTranslations.modules.form.labels[key] || key;
    }
  });
  
  // Update modal titles and buttons
  if (document.querySelector('#add-module-modal h3')) {
    document.querySelector('#add-module-modal h3').textContent = t.modules?.form?.add?.title || "Add Module";
  }
  if (document.querySelector('#edit-module-modal h3')) {
    document.querySelector('#edit-module-modal h3').textContent = t.modules?.form?.edit?.title || "Edit Module";
  }
  if (document.querySelector('#add-class-modal h3')) {
    document.querySelector('#add-class-modal h3').textContent = t.modules?.classes?.add_title || "Add New Class";
  }
  if (document.querySelector('#edit-class-modal h3')) {
    document.querySelector('#edit-class-modal h3').textContent = t.modules?.classes?.edit_title || "Edit Class";
  }
  
  // Update "no classes" message
  if (document.getElementById('no-classes')) {
    document.getElementById('no-classes').textContent = t.modules?.classes?.no_classes || "Select a module to view classes";
  }
  
  // Update class table headers if present
  const tableHeaders = document.querySelectorAll('#class-table th');
  if (tableHeaders.length > 0) {
    const headers = [
      'code', 'name', 'lecturer', 'students', 'schedule', 'classroom', 'actions'
    ];
    headers.forEach((key, index) => {
      if (tableHeaders[index]) {
        tableHeaders[index].textContent = t.modules?.classes?.[key] || key;
      }
    });
  }
}

// Helper function to get nested properties from an object
function getNested(obj, path) {
  if (!obj || !path) return undefined;
  return path.split('.').reduce((o, k) => (o || {})[k], obj);
}

async function loadModules() {
  try {
    const lang = localStorage.getItem("lang") || 'en';
    const response = await fetch(`/api/module?language=${lang}`, {
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
      // Get faculty name properly based on current language
      const lang = localStorage.getItem("lang") || 'en';
      let facultyName = "N/A";
      if (m.faculty) {
        facultyName = lang === 'en' ? m.faculty.name_en : m.faculty.name_vi;
      }
      
      // Get translations for status and buttons
      const activeText = t.modules?.list?.status?.[m.is_active ? 'active' : 'inactive'] || 
                        defaultTranslations.modules.list.status[m.is_active ? 'active' : 'inactive'];
      const editText = t.modules?.list?.buttons?.edit || defaultTranslations.modules.list.buttons.edit;
      const deleteText = t.modules?.list?.buttons?.delete || defaultTranslations.modules.list.buttons.delete;
      const creditsText = t.modules?.list?.credits || defaultTranslations.modules.list.credits;
      
      return `
        <li class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
          <div class="flex items-center justify-between">
            <div onclick="loadClasses('${m.module_id}')">
              <p class="font-medium text-gray-800 dark:text-gray-100">${m.module_name}</p>
              <p class="text-xs text-gray-600 dark:text-gray-400">${m.module_code} - ${m.credits} ${creditsText} - ${facultyName}</p>
            </div>
            <div class="flex gap-2 items-center justify-center">
              <span class="text-xs px-2 py-1 rounded-full ${m.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                ${activeText}
              </span>
              <button class="px-2 py-1 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700" onclick="editModule('${m.module_id}')">${editText}</button>
              <button class="px-2 py-1 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700" onclick="deleteModule('${m.module_id}')">${deleteText}</button>
            </div>
          </div>
        </li>
      `;
    })
    .join("");
}

async function loadDropdownData(type = "add", currentFacultyId = "", currentPrerequisiteId = "") {
  try {
    const lang = localStorage.getItem("lang") || 'en';
    const [facultyResponse, moduleResponse] = await Promise.all([
      fetch("/api/faculty", { method: "GET", headers: { "Content-Type": "application/json" } }),
      fetch(`/api/module?language=${lang}`, { method: "GET", headers: { "Content-Type": "application/json" } }),
    ]);
    const faculties = (await facultyResponse.json()).faculties;
    const modules = (await moduleResponse.json()).modules;

    const selectFaculty = t.modules?.form?.labels?.faculty || defaultTranslations.modules.form.labels.faculty;
    const noPrereq = t.modules?.form?.labels?.no_prerequisite || defaultTranslations.modules.form.labels.no_prerequisite;
    
    const facultySelect = document.getElementById(`${type}-faculty-id`);
    facultySelect.innerHTML = `<option value="" selected>${selectFaculty}</option>` + 
      faculties.map(f => {
        // Use the appropriate language name based on current language setting
        const facultyName = lang === 'en' ? f.name_en : f.name_vi;
        return `<option value="${f.faculty_id}">${facultyName}</option>`;
      }).join("");
    
    const prerequisiteSelect = document.getElementById(`${type}-prerequisite-id`);
    prerequisiteSelect.innerHTML = `<option value="" selected>${noPrereq}</option>` + 
      modules.map(m => `<option value="${m.module_id}">${m.module_code} - ${m.module_name}</option>`).join("");

    // If editing, select current values
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
    module_name_vi: document.getElementById("module-name-vi").value,
    module_name_en: document.getElementById("module-name-en").value,
    credits: parseInt(document.getElementById("credits").value),
    faculty_id: parseInt(document.getElementById("add-faculty-id").value),
    prerequisite_id: document.getElementById("add-prerequisite-id").value || null,
    is_active: document.getElementById("module-status").value === "1",
    description_vi: document.getElementById("description_vi").value || null,
    description_en: document.getElementById("description_en").value || null,
  };

  try {
    const response = await fetch("/api/module", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await response.json();
    if (data.message?.includes("success") || response.ok) {
      Swal.fire({
        icon: 'success',
        title: t.index?.alert?.success || 'Success',
        text: t.modules?.alerts?.success?.add || defaultTranslations.modules.alerts.success.add,
        confirmButtonText: 'OK',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false
      });
      document.getElementById("add-module-modal").classList.add("hidden");
      loadModules();
    } else {
      Swal.fire({
        icon: 'error',
        title: t.modules?.alerts?.error?.title || defaultTranslations.modules.alerts.error.title,
        text: t.modules?.alerts?.error?.add || defaultTranslations.modules.alerts.error.add,
        confirmButtonText: t.index?.modal?.close || 'Close'
      });
    }
  } catch (error) {
    console.error("Error adding module:", error);
    Swal.fire({
      icon: 'error',
      title: t.modules?.alerts?.error?.title || defaultTranslations.modules.alerts.error.title,
      text: t.modules?.alerts?.error?.connection || defaultTranslations.modules.alerts.error.connection,
      confirmButtonText: t.index?.modal?.close || 'Close'
    });
  }
});

async function editModule(moduleId) {
  try {
    const lang = localStorage.getItem("lang") || 'en';
    const response = await fetch(`/api/module/no-lang/${moduleId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    const module = data.module;
    credits = module.credits;
    
    // Fill form with data
    const viTrans = module.translations.find(tr => tr.language === "vi") || {};
    const enTrans = module.translations.find(tr => tr.language === "en") || {};
    console.log("Module data:", module, viTrans, enTrans);
    document.getElementById("edit-module-id").value = module.module_id;
    document.getElementById("edit-module-name-vi").value = viTrans.module_name || "";
    document.getElementById("edit-module-name-en").value = enTrans.module_name || "";
    document.getElementById("edit-credits").value = module.credits;
    document.getElementById("edit-faculty-id").value = module.faculty_id;
    document.getElementById("edit-prerequisite-id").value = module.prerequisite_id || "";
    document.getElementById("edit-module-status").value = module.is_active ? "1" : "0";
    document.getElementById("edit-description-vi").value = viTrans.description || "";
    document.getElementById("edit-description-en").value = enTrans.description || "";
    console.log("Module translations:", viTrans, enTrans);
    // Load dropdowns and select current values
    await loadDropdownData("edit", module.faculty_id, module.prerequisite_id || "");

    document.getElementById("edit-module-modal").classList.remove("hidden");
  } catch (error) {
    console.error("Error fetching module:", error);
    Swal.fire({
      icon: 'error',
      title: t.modules?.alerts?.error?.title || defaultTranslations.modules.alerts.error.title,
      text: t.modules?.alerts?.error?.load || defaultTranslations.modules.alerts.error.load,
      confirmButtonText: t.index?.modal?.close || 'Close'
    });
  }
}

document.getElementById("edit-module-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  console.log("Clicked edit module submit");
  const moduleId = document.getElementById("edit-module-id").value;
  var formData = {
    module_id: document.getElementById("edit-module-id").value,
    module_name_vi: document.getElementById("edit-module-name-vi").value,
    module_name_en: document.getElementById("edit-module-name-en").value,
    credits: parseInt(document.getElementById("edit-credits").value),
    faculty_id: parseInt(document.getElementById("edit-faculty-id").value),
    prerequisite_id: document.getElementById("edit-prerequisite-id").value || null,
    is_active: document.getElementById("edit-module-status").value === "1",
    description_vi: document.getElementById("edit-description-vi").value || null,
    description_en: document.getElementById("edit-description-en").value || null,
  };

  if (formData.credits === credits)
  {
    delete formData.credits;
  }

  try {
    const response = await fetch(`/api/module/${moduleId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await response.json();
    if (data.message?.includes("success") || response.ok) {
      Swal.fire({
        icon: 'success',
        title: t.index?.alert?.success || 'Success',
        text: t.modules?.alerts?.success?.edit || defaultTranslations.modules.alerts.success.edit,
        confirmButtonText: 'OK',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false
      });
      document.getElementById("edit-module-modal").classList.add("hidden");
      loadModules();
    } else {
      Swal.fire({
        icon: 'error',
        title: t.modules?.alerts?.error?.title || defaultTranslations.modules.alerts.error.title,
        text: (t.modules?.alerts?.error?.edit || defaultTranslations.modules.alerts.error.edit) + 
          (data.message || "Unknown error"),
        confirmButtonText: t.index?.modal?.close || 'Close'
      });
    }
  } catch (error) {
    console.error("Error editing module:", error);
    Swal.fire({
      icon: 'error',
      title: t.modules?.alerts?.error?.title || defaultTranslations.modules.alerts.error.title,
      text: t.modules?.alerts?.error?.connection || defaultTranslations.modules.alerts.error.connection,
      confirmButtonText: t.index?.modal?.close || 'Close'
    });
  }
});

function closeEditModuleModal() {
  document.getElementById("edit-module-modal").classList.add("hidden");
}

async function deleteModule(moduleId) {
  const result = await Swal.fire({
    title: t.modules?.alerts?.confirm?.delete?.title || defaultTranslations.modules.alerts.confirm.delete.title,
    text: t.modules?.alerts?.confirm?.delete?.text || defaultTranslations.modules.alerts.confirm.delete.text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: t.modules?.alerts?.confirm?.delete?.confirmButton || defaultTranslations.modules.alerts.confirm.delete.confirmButton,
    cancelButtonText: t.modules?.alerts?.confirm?.delete?.cancelButton || defaultTranslations.modules.alerts.confirm.delete.cancelButton
  });

  if (!result.isConfirmed) {
    return;
  }

  try {
    const response = await fetch(`/api/module/${moduleId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      Swal.fire({
        icon: 'success',
        title: t.index?.alert?.success || 'Success',
        text: t.modules?.alerts?.success?.delete || defaultTranslations.modules.alerts.success.delete,
        confirmButtonText: 'OK',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false
      });
      loadModules(); 
    } else {
      const data = await response.json();
      Swal.fire({
        icon: 'error',
        title: t.modules?.alerts?.error?.title || defaultTranslations.modules.alerts.error.title,
        text: (t.modules?.alerts?.error?.delete || defaultTranslations.modules.alerts.error.delete) + 
          (data.message || "Unknown error"),
        confirmButtonText: t.index?.modal?.close || 'Close'
      });
    }
  } catch (error) {
    console.error("Error deleting module:", error);
    Swal.fire({
      icon: 'error',
      title: t.modules?.alerts?.error?.title || defaultTranslations.modules.alerts.error.title,
      text: t.modules?.alerts?.error?.connection || defaultTranslations.modules.alerts.error.connection,
      confirmButtonText: t.index?.modal?.close || 'Close'
    });
  }
}