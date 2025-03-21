var students;
var currentStudents;
const tableBody = document.getElementById("student-table-body");
const facultySelect = document.getElementById("faculty_search");

document.addEventListener("DOMContentLoaded", () => {

  fetch("/api/faculty")
  .then((response) => response.json())
  .then((data) => {
   

    // Clear any existing options
    facultySelect.innerHTML = "";
    facultySelect.selectedIndex = 0;  
    // Add a default option
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Tất cả khoa";
    defaultOption.setAttribute("selected", "selected");

    facultySelect.appendChild(defaultOption);

    // Add the fetched faculties to the select list
    data.faculties.forEach((faculty) => {
      const option = document.createElement("option");
      option.value = faculty.faculty_id; // Set faculty_id as value
      option.textContent = faculty.name; // Set name as text
      facultySelect.appendChild(option);
    });
  })
  .catch((error) => console.error("Error fetching faculties:", error));


  fetch("/api/student")
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      students = data.students;
      currentStudents = students;
      document.getElementById("studentCount").innerHTML = students.length;
      RefreshTable("");
    })
    .catch((error) => {
      console.error("Error fetching student data:", error);
    });
  const inputField = document.getElementById("searchInput");
  facultySelect.addEventListener("change", function () {
    tableBody.innerHTML = "";
    RefreshTable(inputField.value);
  });

  inputField.addEventListener("input", (event) => {
    tableBody.innerHTML = "";
    RefreshTable(inputField.value);
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
  const selectedText = facultySelect.options[facultySelect.selectedIndex].text;

  students.forEach((student) => {
    if (
      (selectedText === "Tất cả khoa" ||
        student.faculty.name === selectedText )&&
      ( String(student.student_id).includes(id) ||
      slugify(student.full_name).includes(slugify(id)))
    ) {
      const row = document.createElement("tr");
      row.classList.add("text-gray-700", "dark:text-gray-400");

      let statusClass = "";
      let statusText = "";

      switch (student.status.name) {
        case "Đang học":
          statusClass =
            "px-2 py-1 font-semibold leading-tight text-orange-700 bg-orange-100 rounded-full dark:text-white dark:bg-orange-600";
          break;
        case "Đã tốt nghiệp":
          statusClass =
            "px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-full dark:bg-green-700 dark:text-green-100";
          break;
        case "Đã thôi học":
          statusClass =
            "px-2 py-1 font-semibold leading-tight text-red-700 bg-red-100 rounded-full dark:text-red-100 dark:bg-red-700";
          break;
        case "Tạm dừng học":
          statusClass =
            "px-2 py-1 font-semibold leading-tight text-yellow-700 bg-yellow-100 rounded-full dark:text-yellow-100 dark:bg-yellow-700";
          break;
        default:
          statusClass =
            "px-2 py-1 font-semibold leading-tight text-gray-700 bg-gray-100 rounded-full dark:text-gray-100 dark:bg-gray-700";
          statusText = student.status;
          break;
      }

      row.innerHTML = `
        <td class="px-4 py-3">
          <div class="flex items-center text-sm">
            
            <div>
              <p class="font-semibold">${student.full_name}</p>
              <p class="text-xs text-gray-600 dark:text-gray-400">${student.student_id}</p>
            </div>
          </div>
        </td>
        <td class="px-4 py-3 text-sm">${student.date_of_birth}</td>
        <td class="px-4 py-3 text-sm">${student.gender}</td>
        <td class="px-4 py-3 text-sm">${student.faculty.name}</td>
        <td class="px-4 py-3 text-sm">${student.course.course_name}</td>
        <td class="px-4 py-3 text-sm">${student.program}</td>
        <td class="px-4 py-3 text-sm">${student.email}</td>
        <td class="px-4 py-3 text-sm">${student.phone_number}</td>
        <td class="px-4 py-3 text-xs">
          <span class="${statusClass}">
            ${student.status.name}
          </span>
        </td>
        <td class="px-4 py-3 text-sm">
          <button class="p-1 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-md active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple" type="submit" onclick="window.location.href='/${student.student_id}'">Chi tiết</button>
          <button class="p-1 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-red-600 border border-transparent rounded-md active:bg-red-600 hover:bg-red-700 focus:outline-none focus:shadow-outline-purple" type="submit" onclick="deleteStudent('${student.student_id}')">Xóa</button>
        </td>
      `;

      tableBody.appendChild(row);
      currentStudents.push(student);
    }
  });
}
