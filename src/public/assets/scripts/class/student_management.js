function addGrade(studentId, classId) {
    
    const overlay = document.createElement("div");
    overlay.classList.add("fixed", "top-0", "left-0", "w-full", "h-full", "bg-gray-50", "bg-opacity-50");
  
    const modal = document.createElement("div");
    modal.classList.add(
        "fixed",
        "top-1/2",
        "left-1/2",
        "transform",
        "-translate-x-1/2",
        "-translate-y-1/2",
        "bg-white",
        "p-5",
        "shadow-lg",
        "rounded-lg"
    );

    let form = document.createElement("form");
    form.innerHTML = `
        <h2 class="text-xl font-bold mb-4 mx-20">Thêm điểm</h2>
        <input type="number" id="class_id" name="class_id" value="${classId}" hidden>
        <input type="number" id="student_id" name="student_id" value="${studentId}" hidden>
        <div class="grid gap-4">
            <label for="grade" class="block text-sm font-medium text-gray-700">Điểm số: </label>
            <input type="text" id="grade" name="grade" required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
        <div class="mt-4 flex justify-end">
        <button type="button" id="closeModal" class="ml-2 inline-flex justify-center py-2 px-4 border border-transparent shadow-lg text-sm font-semibold rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">Đóng</button>
            <button type="submit" class="ml-2 inline-flex justify-center py-2 px-4 border border-transparent shadow-lg text-sm font-semibold rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Lưu</button>
        </div>`;
    form.querySelector("#closeModal").addEventListener("click", function () {
        document.body.removeChild(overlay);
      });
    
    form.addEventListener("submit", function (event) {
        event.preventDefault();
    
        let entityData = 
        {
            class_id: parseInt(form.class_id.value, 10),
            student_id: parseInt(form.student_id.value, 10),
            grade: form.grade.value
        };
    
        // Send data to the server
        fetch(`/api/transcript`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(entityData),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.message.includes("successfully")) {
                    alert(`Điểm đã được thêm!`);
                    document.body.removeChild(overlay);
                
                    const newData = data.transcript;
                    const tableBody = document.getElementById("student-table-body");
                    const row = [...tableBody.children].find(row => row.children[0].textContent == studentId);
                            if (row) {
                                row.children[2].innerHTML = 
                                    `<span class="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-200 text-gray-700">
                                    ${transcript.grade}
                              </span>`
                            } else {
                                alert("Chỉnh sửa thất bại.");
                                }
                    tableBody.appendChild(row);
                } else {
                  alert(`Đã xảy ra lỗi khi thêm điểm.`);
                }
          })
          .catch((error) => {
            console.error(`Error adding grade:`, error);
            alert(`Đã xảy ra lỗi khi thêm điểm.`);
          });
      });
    
      modal.appendChild(form);
      overlay.appendChild(modal);
      document.body.appendChild(overlay);
    }
async function deleteStudent(studentId) {
  //ask for confirmation by a model
  const result = await Swal.fire({
    title: "Bạn có chắc chắn?",
    text: "Dữ liệu sẽ bị xóa vĩnh viễn!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Xóa!",
    cancelButtonText: "Hủy",
  });
  if (!result.isConfirmed) {
    return;
  }
  try {
    const studentIndex = currentStudents.findIndex(student => String(student.student_id) === studentId);

    const response = await fetch('/api/student', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ student_id: studentId }),
    });

    if (response.ok) {
      const data = await response.json();
      alert(data.message);
      const tableBody = document.getElementById("student-table-body");
      const row = tableBody.children[studentIndex];
      tableBody.removeChild(row);

      students = students.filter(student => student.student_id != studentId);
      currentStudents = currentStudents.filter(student => student.student_id != studentId);

      document.getElementById("studentCount").innerHTML = students.length;


    } else {
      const errorData = await response.json();
      console.error(errorData.message);
      alert(errorData.message);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Đã xảy ra lỗi khi xóa sinh viên.');
  }
}

async function cancel(registrationId, studentId) {
    // Ask for confirmation with a model
    const result = await Swal.fire({
      title: "Hủy đăng ký",
      text: "Bạn có chắc không? Sinh viên sẽ bị hủy học phần!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Xóa!",
      cancelButtonText: "Hủy",
      input: 'textarea', // Use a textarea for the reason input
      inputPlaceholder: 'Nhập lý do hủy...',
      inputAttributes: {
        'aria-label': 'Nhập lý do hủy'
      },
      showLoaderOnConfirm: true, // Show a loader when confirming
      preConfirm: (reason) => {
        if (!reason || reason.trim() === '') {
          Swal.showValidationMessage('Vui lòng nhập lý do');
        }
        return reason; // Return the reason entered
      },
    });
  
    if (!result.isConfirmed) {
      return; // If not confirmed, do nothing
    }
  
    const reason = result.value; // Reason entered by the user
  
    try {
      // Make the delete request to the server with the reason
      const response = await fetch(`/api/class_registation/${registrationId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason: reason, studentId: studentId }), // Pass reason and studentId
      });
  
      if (response.ok) {
        const data = await response.json();
        alert(data.message); // Show success message
        
        // Find the row in the table and remove it
        const tableBody = document.getElementById("student-table-body");
        const row = Array.from(tableBody.children).find(row => row.children[0].textContent == studentId); // Assuming row has `data-student-id` attribute
        if (row) {
          tableBody.removeChild(row);
        }
        
        // Update the students list and currentStudents list
        const studentCount = document.getElementById("student-count");
        studentCount.textContent = `Tổng: ${tableBody.children.length} học sinh`;
      } else {
        const errorData = await response.json();
        console.error(errorData.message);
        alert(errorData.message); // Show error message
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Đã xảy ra lỗi khi xóa sinh viên.'); // Show error alert if something goes wrong
    }
  }
  