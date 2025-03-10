document.addEventListener("DOMContentLoaded", () => {
    const tableBody = document.getElementById("student-table-body");
  
    fetch("http://localhost:3000/api/student")
      .then(response => response.json())
      .then(data => {
        const students = data.students;
        students.forEach(student => {
          const row = document.createElement("tr");
          row.classList.add("text-gray-700", "dark:text-gray-400");
  
          let statusClass = "";
          let statusText = "";
  
          switch (student.status) {
            case "Đang học":
              statusClass = "px-2 py-1 font-semibold leading-tight text-orange-700 bg-orange-100 rounded-full dark:text-white dark:bg-orange-600";
              break;
            case "Đã tốt nghiệp":
              statusClass = "px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-full dark:bg-green-700 dark:text-green-100";
              break;
            case "Đã thôi học":
              statusClass = "px-2 py-1 font-semibold leading-tight text-red-700 bg-red-100 rounded-full dark:text-red-100 dark:bg-red-700";
              break;
            case "Tạm dừng học":
              statusClass = "px-2 py-1 font-semibold leading-tight text-yellow-700 bg-yellow-100 rounded-full dark:text-yellow-100 dark:bg-yellow-700";
              break;
            default:
              statusClass = "px-2 py-1 font-semibold leading-tight text-gray-700 bg-gray-100 rounded-full dark:text-gray-100 dark:bg-gray-700";
              statusText = student.status;
              break;
          }
  
          row.innerHTML = `
            
            <td class="px-4 py-3">
              <div class="flex items-center text-sm">
                <div class="relative hidden w-8 h-8 mr-3 rounded-full md:block">
                  <div class="absolute inset-0 rounded-full shadow-inner" aria-hidden="true"></div>
                </div>
                <div>
                  <p class="font-semibold">${student.full_name}</p>
                  <p class="text-xs text-gray-600 dark:text-gray-400">${student.student_id}</p>
                </div>
              </div>
            </td>
            <td class="px-4 py-3 text-sm">${student.date_of_birth}</td>
            <td class="px-4 py-3 text-sm">${student.gender}</td>
            <td class="px-4 py-3 text-sm">${student.faculty_id}</td>
            <td class="px-4 py-3 text-sm">${student.course}</td>
            <td class="px-4 py-3 text-sm">${student.program}</td>
            <td class="px-4 py-3 text-sm">${student.address}</td>
            <td class="px-4 py-3 text-sm">${student.email}</td>
            <td class="px-4 py-3 text-sm">${student.phone_number}</td>
            <td class="px-4 py-3 text-xs">
              <span class="${statusClass}">
                ${student.status}
              </span>
            </td>
            <td class="px-4 py-3 text-sm">
              <button class="p-1 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-md active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple" type="submit">Edit</button>
              <button class="p-1 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-red-600 border border-transparent rounded-md active:bg-red-600 hover:bg-red-700 focus:outline-none focus:shadow-outline-purple" type="submit">Delete</button>
            </td>
          `;
  
          tableBody.appendChild(row);
        });
      })
      .catch(error => {
        console.error("Error fetching student data:", error);
      });
  });