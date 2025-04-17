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
        fetch("/api/transcript", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(entityData),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("Server response:", data);
        
            // Kiểm tra phản hồi thành công và có transcript mới
            if (data.message.includes("successfully") && data.createdtranscript) {
              Swal.fire({
                icon: "success",
                title: "Thành công!",
                text: "Thêm điểm thành công!",
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: false,
              });
        
              // Xóa overlay sau khi thêm thành công
              document.body.removeChild(overlay);
        
              const newData = data.createdtranscript;
              const tableBody = document.getElementById("student-table-body");
        
              // Tìm dòng sinh viên trong bảng để cập nhật
              const row = [...tableBody.children].find(
                (row) => row.children[0].textContent == newData.student_id.toString()
              );
        
              if (row) {
                row.children[3].innerHTML = `
                  <span class="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-200 text-gray-700">
                    ${newData.grade}
                  </span>
                `;
              } else {
                // Không tìm thấy sinh viên trong bảng
                Swal.fire({
                  icon: "error",
                  title: "Lỗi!",
                  text: "Không tìm thấy sinh viên để cập nhật điểm.",
                  confirmButtonText: "Đóng",
                });
              }
            } else {
              // Phản hồi không hợp lệ
              Swal.fire({
                icon: "error",
                title: "Lỗi!",
                text: "Đã xảy ra lỗi khi thêm điểm.",
                confirmButtonText: "Đóng",
              });
            }
          })
          .catch((error) => {
            console.error("Error adding grade:", error);
            Swal.fire({
              icon: "error",
              title: "Lỗi!",
              text: "Đã xảy ra lỗi khi thêm điểm: " + error.message,
              confirmButtonText: "Đóng",
            });
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
      // alert(data.message);
      Swal.fire({
        icon: 'success',
        title: 'Thành công!',
        text: 'Thêm sinh viên thành công!' + data.message,
        confirmButtonText: 'OK',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false
      });
      
      const tableBody = document.getElementById("student-table-body");
      const row = tableBody.children[studentIndex];
      tableBody.removeChild(row);

      students = students.filter(student => student.student_id != studentId);
      currentStudents = currentStudents.filter(student => student.student_id != studentId);

      document.getElementById("studentCount").innerHTML = students.length;


    } else {
      const errorData = await response.json();
      console.error(errorData.message);
      // alert(errorData.message);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi!',
        text: errorData.message,
        confirmButtonText: 'Đóng'
      });
    }
  } catch (error) {
    console.error('Error:', error);
    // alert('Đã xảy ra lỗi khi xóa sinh viên.');
    Swal.fire({
      icon: 'error',
      title: 'Lỗi!',
      text: 'Đã xảy ra lỗi khi xóa sinh viên.',
      confirmButtonText: 'Đóng'
    });
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
        // alert(data.message); // Show success message
        Swal.fire({
          icon: 'success',
          title: 'Thành công!',
          text: data.message,
          confirmButtonText: 'OK',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false
        });
        
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
        // alert(errorData.message); // Show error message
        Swal.fire({
          icon: 'error',
          title: 'Lỗi!',
          text: errorData.message,
          confirmButtonText: 'Đóng'
        });
      }
    } catch (error) {
      console.error('Error:', error);
      // alert('Đã xảy ra lỗi khi xóa sinh viên.'); // Show error alert if something goes wrong
      Swal.fire({
        icon: 'error',
        title: 'Lỗi!',
        text: 'Đã xảy ra lỗi khi xóa sinh viên.',
        confirmButtonText: 'Đóng'
      });
    }
  }
  
  function editGrade(transcriptId, currentGrade) {
    const overlay = document.createElement("div");
    overlay.classList.add("fixed", "top-0", "left-0", "w-full", "h-full", "bg-gray-50", "bg-opacity-50");
  
    const modal = document.createElement("div");
    modal.classList.add("fixed", "top-1/2", "left-1/2", "transform", "-translate-x-1/2", "-translate-y-1/2", "bg-white", "p-5", "shadow-lg", "rounded-lg");
  
    let form = document.createElement("form");
    form.innerHTML = `
      <h2 class="text-xl font-bold mb-4 mx-20">Cập nhật điểm</h2>
      <label for="grade" class="block text-sm font-medium text-gray-700">Điểm số mới:</label>
      <input type="text" id="grade" name="grade" required value="${currentGrade}"
        class="mt-1 mb-4 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
      <div class="mt-4 flex justify-end">
        <button type="button" id="closeModal" class="ml-2 inline-flex justify-center py-2 px-4 text-sm font-semibold rounded-md text-white bg-red-600 hover:bg-red-700">Đóng</button>
        <button type="submit" class="ml-2 inline-flex justify-center py-2 px-4 text-sm font-semibold rounded-md text-white bg-blue-600 hover:bg-blue-700">Lưu</button>
      </div>`;
  
    form.querySelector("#closeModal").addEventListener("click", () => document.body.removeChild(overlay));
  
    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      const newGrade = form.grade.value;
  
      try {
        const response = await fetch(`/api/transcript/${transcriptId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ grade: newGrade }),
        });
  
        const data = await response.json();
  
        if (response.ok) {
          // alert("Cập nhật điểm thành công!");
          Swal.fire({
            icon: 'success',
            title: 'Thành công!',
            text: 'Cập nhật điểm thành công!',
            confirmButtonText: 'OK',
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false
          });
          document.body.removeChild(overlay);

          const updatedtranscript = data.updatedtranscript;
  
          const row = document.getElementById(`grade-${updatedtranscript.student_id}`);
          if (row) {
            row.textContent = updatedtranscript.grade;
            row.className = `inline-flex px-2 py-1 text-xs font-medium rounded-full ${
              updatedtranscript.grade && parseFloat(updatedtranscript.grade) < 5
                ? "bg-red-100 text-red-800"
                : "bg-green-100 text-green-800"
            }`;
          }
  
        } else {
          // alert(data.message || "Cập nhật thất bại.");
          Swal.fire({
            icon: 'error',
            title: 'Lỗi!',
            text: data.message || "Cập nhật thất bại.",
            confirmButtonText: 'Đóng'
          });
        }
      } catch (err) {
        console.error("Error updating grade:", err);
        // alert("Có lỗi xảy ra khi cập nhật điểm.");
        Swal.fire({
          icon: 'error',
          title: 'Lỗi!',
          text: 'Có lỗi xảy ra khi cập nhật điểm.',
          confirmButtonText: 'Đóng'
        });
      }
    });
  
    modal.appendChild(form);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
  }
  