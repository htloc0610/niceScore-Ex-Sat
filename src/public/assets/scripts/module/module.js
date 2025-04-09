let selectedModuleId = null;

async function loadClasses(moduleId) {
  const classTable = document.getElementById('class-table');
  const classTableBody = document.getElementById('class-table-body');
  const noClassesDiv = document.getElementById('no-classes');
  const classCount = document.getElementById('class-count');
  const addClassBtn = document.getElementById('add-class-btn');

  selectedModuleId = moduleId;

  try {
    const response = await fetch(`/api/class/module/${moduleId}`);
    const res = await response.json();
    const classes = res.classes;

    console.log('Classes:', classes);

    classTableBody.innerHTML = '';

    if (classes && classes.length > 0) {
      classes.forEach(classItem => {
        const row = document.createElement('tr');
        row.className = 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors';
        row.innerHTML = `
          <td class="px-4 py-3 text-sm">${classItem.class_id}</td>
          <td class="px-4 py-3 text-sm">${classItem.class_name}</td>
          <td class="px-4 py-3 text-sm">${classItem.instructor}</td>
          <td class="px-4 py-3 text-sm">${classItem.max_students}</td>
          <td class="px-4 py-3 text-sm">${classItem.current_students || 0}</td>
          <td class="px-4 py-3 text-sm">${classItem.academic_year}</td>
          <td class="px-4 py-3 text-sm">${classItem.semester}</td>
          <td class="px-4 py-3 text-sm">
            <button class="px-2 py-1 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 transition-colors"
              onclick="window.location.href='/class/${classItem.class_id}'">Chi tiết</button>
          </td>
        `;
        classTableBody.appendChild(row);
      });
      classTable.classList.remove('hidden');
      noClassesDiv.classList.add('hidden');
      classCount.textContent = `Tổng số lớp: ${classes.length}`;
      addClassBtn.classList.remove('hidden');
      addClassBtn.href = `/classes/add?module_id=${moduleId}`;
    } else {
      classTable.classList.add('hidden');
      noClassesDiv.classList.remove('hidden');
      noClassesDiv.textContent = 'Không có lớp học nào cho môn học này';
      classCount.textContent = 'Tổng số lớp: 0';
      addClassBtn.classList.remove('hidden');
      addClassBtn.href = `/classes/add?module_id=${moduleId}`;
    }
  } catch (error) {
    console.error('Error fetching classes:', error);
    classTable.classList.add('hidden');
    noClassesDiv.classList.remove('hidden');
    noClassesDiv.textContent = 'Có lỗi khi tải danh sách lớp học';
    classCount.textContent = '';
    addClassBtn.classList.add('hidden');
  }
}

// Xử lý tìm kiếm môn học
const moduleSearch = document.getElementById('moduleSearch');
moduleSearch.addEventListener('input', function(e) {
  const searchTerm = e.target.value.toLowerCase();
  const moduleItems = document.querySelectorAll('#module-list li');

  moduleItems.forEach(item => {
    const moduleName = item.querySelector('p.font-medium').textContent.toLowerCase();
    item.style.display = moduleName.includes(searchTerm) ? '' : 'none';
  });
});

// Xử lý modal thêm môn học
const addModuleBtn = document.querySelector('a[href="/modules/add"]');
const addModuleModal = document.getElementById('add-module-modal');

addModuleBtn.addEventListener('click', (e) => {
  e.preventDefault();
  addModuleModal.classList.remove('hidden');
});

function closeAddModuleModal() {
  addModuleModal.classList.add('hidden');
}

// Xử lý modal thêm lớp học
const addClassBtn = document.getElementById('add-class-btn');
const addClassModal = document.getElementById('add-class-modal');

addClassBtn.addEventListener('click', (e) => {
  e.preventDefault();
  addClassModal.classList.remove('hidden');
});

function closeAddClassModal() {
  addClassModal.classList.add('hidden');
}

// Đóng modal khi click ra ngoài
document.addEventListener('click', (e) => {
  if (e.target === addModuleModal) {
    closeAddModuleModal();
  }
  if (e.target === addClassModal) {
    closeAddClassModal();
  }
});