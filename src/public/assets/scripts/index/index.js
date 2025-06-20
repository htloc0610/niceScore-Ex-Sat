var currentStudents;
const tableBody = document.getElementById("student-table-body");
const facultySelect = document.getElementById("faculty_search");
let t;

// Function to load translations and update UI
async function loadTranslationsAndUpdateUI(lang) {
  const translationUrl = `/assets/scripts/locales/${lang}.json`;
  try {
    const res = await fetch(translationUrl);
    if (!res.ok) throw new Error("Failed to load translations");
    t = await res.json();
    console.log("Loaded translations for index page", t);
    
    // Update UI elements with the new translations
    updateCountsAndTable();
  } catch (error) {
    console.error("Error loading translations:", error);
    // Fall back to English if there's an error loading translations
    if (lang !== 'en') {
      loadTranslationsAndUpdateUI('en');
    }
  }
}

// Update student counts and refresh table
function updateCountsAndTable() {
  document.getElementById("studentCount").innerHTML = students.length || 0;

  graduatedCount = students.filter(
    (student) => student.status.name === t?.index?.js?.studentStatus?.graduated
  ).length;
  document.getElementById("graduatedCount").innerHTML = graduatedCount || 0;

  studyingCount = students.filter(
    (student) => student.status.name === t?.index?.js?.studentStatus?.studying
  ).length;
  document.getElementById("studyingCount").innerHTML = studyingCount || 0;

  pauseCount = students.filter(
    (student) => student.status.name === t?.index?.js?.studentStatus?.pause
  ).length;
  document.getElementById("pauseCount").innerHTML = pauseCount || 0;
  
  // Refresh the table with the current search term
  const inputField = document.getElementById("searchInput");
  tableBody.innerHTML = "";
  RefreshTable(inputField?.value || "");
}

document.addEventListener("DOMContentLoaded", async () => {
  console.log("Index page initialized");
  currentStudents = students;
  
  // Load translations using the current language preference
  const lang = localStorage.getItem("lang") || 'en';
  await loadTranslationsAndUpdateUI(lang);

  document.getElementById("studentCount").innerHTML = students.length || 0;

  graduatedCount = students.filter(
    (student) => student.status.name === t.index.js.studentStatus.graduated
  ).length;
  console.log("Graduated Count:", graduatedCount, t.index.js.studentStatus.graduated);
  document.getElementById("graduatedCount").innerHTML = graduatedCount|| 0;

  studyingCount = students.filter(
    (student) => student.status.name === t.index.js.studentStatus.studying
  ).length;
  document.getElementById("studyingCount").innerHTML = studyingCount || 0;

  pauseCount = students.filter(
    (student) => student.status.name === t.index.js.studentStatus.pause
  ).length;
  document.getElementById("pauseCount").innerHTML = pauseCount || 0;
  const inputField = document.getElementById("searchInput");
  facultySelect.addEventListener("change", function () {
    tableBody.innerHTML = "";
    RefreshTable(inputField.value);
  });

  inputField.addEventListener("input", (event) => {
    tableBody.innerHTML = "";
    RefreshTable(inputField.value);
  });
  
  // Listen for language changes from the language selector
  const languageSelect = document.getElementById('languageSelect');
  if (languageSelect) {
    languageSelect.addEventListener('change', function() {
      const selectedLang = this.value;
      // Update translations and refresh UI with the new language
      // Note: The URL navigation is handled in header.hbs
      loadTranslationsAndUpdateUI(selectedLang);
    });
  }
  
  // Listen for custom language change event
  window.addEventListener('languageChanged', async (e) => {
    if (e.detail && e.detail.language) {
      await loadTranslationsAndUpdateUI(e.detail.language);
    }
  });
});

const slugify = (text) => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
};

function RefreshTable(id) {
  tableBody.innerHTML = ``;
  currentStudents = [];
  const selectedText = facultySelect.options[facultySelect.selectedIndex]? 
  facultySelect.options[facultySelect.selectedIndex].text: "";

  students.forEach((student) => {
    if (
      (selectedText === t.index.js.faculty.all ||
        student.faculty.name === selectedText) &&
      (String(student.student_id).includes(id) ||
        slugify(student.full_name).includes(slugify(id)))
    ) { 
      const row = document.createElement("tr");
      row.classList.add("text-gray-700", "dark:text-gray-400");

      let statusClass = "";

      switch (student.status.name) {
        case t.index.js.studentStatus.studying:
          statusClass =
            "px-2 py-1 font-semibold leading-tight text-orange-700 bg-orange-100 rounded-full dark:text-white dark:bg-orange-600";
          break;
        case t.index.js.studentStatus.graduated:
          statusClass =
            "px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-full dark:bg-green-700 dark:text-green-100";
          break;
        case t.index.js.studentStatus.dropped:
          statusClass =
            "px-2 py-1 font-semibold leading-tight text-red-700 bg-red-100 rounded-full dark:text-red-100 dark:bg-red-700";
          break;
        case t.index.js.studentStatus.pause:
          statusClass =
            "px-2 py-1 font-semibold leading-tight text-yellow-700 bg-yellow-100 rounded-full dark:text-yellow-100 dark:bg-yellow-700";
          break;
        default:
          statusClass =
            "px-2 py-1 font-semibold leading-tight text-gray-700 bg-gray-100 rounded-full dark:text-gray-100 dark:bg-gray-700";
          break;
      }

      row.innerHTML = `
        <td class="px-2 py-3">
          <div class="flex items-center text-sm">
            <div>
              <p class="font-semibold">${student.full_name}</p>
              <p class="text-xs text-gray-600 dark:text-gray-400">${student.student_id}</p>
            </div>
          </div>
        </td>
        <td class="px-2 py-3 text-sm">${student.date_of_birth}</td>
        <td class="px-2 py-3 text-sm">${student.gender}</td>
        <td class="px-2 py-3 text-sm">${student.faculty.name}</td>
        <td class="px-2 py-3 text-sm">${student.course.course_name}</td>
        <td class="px-2 py-3 text-sm">${student.program}</td>
        <td class="px-2 py-3 text-sm">${student.permanentAddress.city}</td>
        <td class="px-2 py-3 text-sm max-w-[150px] truncate hover:overflow-visible hover:whitespace-normal">
          <span class="relative group">
            <span class="cursor-pointer">${student.email}</span>
            <span class="absolute left-0 z-10 hidden w-auto p-2 text-xs text-white bg-gray-800 rounded-md group-hover:block">
              ${student.email}
            </span>
          </span>
        </td>
        <td class="px-2 py-3 text-sm">${student.phone_number}</td>
        <td class="px-2 py-3 text-xs">
          <span class="${statusClass}">
            ${student.status.name}
          </span>
        </td>
        <td class="px-2 py-3 text-sm">
          <button onclick="fetchCancellationData(${student.student_id})" class="bg-blue-500 hover:bg-blue-700 text-white font-bold p-1 rounded">
            ${t.index.button.history}
          </button>
          <button class="p-1 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-md active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple" onclick="window.location.href='/${student.student_id}'">
            ${t.index.button.details}
          </button>
          <button class="p-1 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-md active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple" onclick="downloadAndPrint(${student.student_id})">
            ${t.index.button.transcript}
          </button>
          <button class="p-1 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-red-600 border border-transparent rounded-md active:bg-red-600 hover:bg-red-700 focus:outline-none focus:shadow-outline-purple" onclick="deleteStudent('${student.student_id}')">
            ${t.index.button.delete}
          </button>
        </td>

      `;

      tableBody.appendChild(row);
      currentStudents.push(student);
    }
  });
}
