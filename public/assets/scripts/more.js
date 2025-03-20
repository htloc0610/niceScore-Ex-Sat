var faculties;
var statuses;
document.addEventListener("DOMContentLoaded", () => {
  fetch("/api/faculty")
    .then((response) => response.json())
    .then((data) => {
        faculties = data.faculties;
        const facultyTableBody = document.getElementById("faculty-table-body");
        facultyTableBody.innerHTML = ``;
        faculties.forEach((faculty) => {
            const row = document.createElement("tr");
            row.classList.add("text-gray-700", "dark:text-gray-400");
            row.innerHTML = `
                <td class="px-4 py-3 text-sm">${faculty.faculty_id}</td>
                <td class="px-4 py-3 text-sm">${faculty.name}</td>
                <td class="px-4 py-3 text-sm">
                    <button class="p-1 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-md active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple" type="submit" onclick="editFaculty(${faculty.faculty_id})">Edit</button>
                </td>
            `;
            facultyTableBody.appendChild(row);
        })
    })
    .catch((error) => {
      console.error("Error fetching student data:", error);
    });

    fetch("/api/status")
    .then((response) => response.json())
    .then((data) => {
        statuses = data.status;
        const statusTableBody = document.getElementById("status-table-body");
        statusTableBody.innerHTML = ``;
        statuses.forEach((status) => {
            const row = document.createElement("tr");
            row.classList.add("text-gray-700", "dark:text-gray-400");
            row.innerHTML = `
                <td class="px-4 py-3 text-sm">${status.status_id}</td>
                <td class="px-4 py-3 text-sm">${status.name}</td>
                <td class="px-4 py-3 text-sm">
                    <button class="p-1 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-md active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple" type="submit" onclick="editStatus(${status.status_id})">Edit</button>
                </td>
            `;
            statusTableBody.appendChild(row);
        })
    })
    .catch((error) => {
      console.error("Error fetching student data:", error);
    });
  
  });
