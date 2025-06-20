function addGrade(studentId, classId) {
  const overlay = document.createElement("div");
  overlay.classList.add(
    "fixed",
    "top-0",
    "left-0",
    "w-full",
    "h-full",
    "bg-gray-50",
    "bg-opacity-50"
  );

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
        <h2 class="text-xl font-bold mb-4 mx-20">${t?.class?.score?.add_score?.title || "Add Grade"}</h2>
        <input type="number" id="class_id" name="class_id" value="${classId}" hidden>
        <input type="number" id="student_id" name="student_id" value="${studentId}" hidden>
        <div class="grid gap-4">
            <label for="grade" class="block text-sm font-medium text-gray-700">${t?.class?.score?.add_score?.grade_label || "Grade"}</label>
            <input type="text" id="grade" name="grade" required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
        <div class="mt-4 flex justify-end">
        <button type="button" id="closeModal" class="ml-2 inline-flex justify-center py-2 px-4 border border-transparent shadow-lg text-sm font-semibold rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">${t?.class?.cancel_button || "Cancel"}</button>
            <button type="submit" class="ml-2 inline-flex justify-center py-2 px-4 border border-transparent shadow-lg text-sm font-semibold rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">${t?.class?.score?.add_score?.save_button || "Save"}</button>
        </div>`;
  form.querySelector("#closeModal").addEventListener("click", function () {
    document.body.removeChild(overlay);
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    let entityData = {
      class_id: parseInt(form.class_id.value, 10),
      student_id: parseInt(form.student_id.value, 10),
      grade: form.grade.value,
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

        // Check for successful response with new transcript
        if (data.message.includes("successfully") && data.createdtranscript) {
          Swal.fire({
            icon: "success",
            title: `${t?.class?.score?.add_score?.swal?.success_title || "Success"}`,
            text: `${t?.class?.score?.add_score?.swal?.success_text || "Grade added successfully"}`,
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
          });

          // Remove overlay after successful addition
          document.body.removeChild(overlay);

          const newData = data.createdtranscript;
          const tableBody = document.getElementById("student-table-body");
          
          // Find the student row using a more reliable attribute selector
          const rows = tableBody.querySelectorAll('tr');
          const studentIdStr = String(newData.student_id);
          
          // Find the row containing this student
          let row = null;
          for (const r of rows) {
            const idCell = r.querySelector('td:first-child');
            if (idCell && idCell.textContent && idCell.textContent.trim() === studentIdStr) {
              row = r;
              break;
            }
          }

          if (row) {
            // Update grade display
            const gradeCell = row.querySelector('td:nth-child(4)');
            if (gradeCell) {
              gradeCell.innerHTML = `
                <span class="inline-flex px-2 py-1 text-xs font-medium rounded-full 
                  ${
                    newData.grade >= 5
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }">
                  ${newData.grade}
                </span>
              `;
            }

            // Find and hide the add grade cell
            const addGradeCell = row.querySelector('td:nth-child(5)');
            if (addGradeCell) {
              addGradeCell.classList.add("hidden");
            }

            // Find and show the edit grade cell
            const editGradeCell = row.querySelector('td:nth-child(6)');
            if (editGradeCell) {
              editGradeCell.classList.remove("hidden");
              editGradeCell.innerHTML = `
                <button class="px-2 py-1 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700" onclick="editGrade(${newData.student_id}, ${newData.transcript_id}, '${newData.grade}')">${t?.class?.edit_grade_button || "Edit Grade"}</button>
              `;
            }
          } else {
            // Student not found in table
            Swal.fire({
              icon: "error",
              title: `${t?.class?.score?.add_score?.swal?.error_title || "Error"}`,
              text: `${t?.class?.score?.add_score?.swal?.error_text || "Student not found in table"}`,
              confirmButtonText: t?.class?.close_button || "Close",
            });
          }
        } else {
          // Invalid response
          Swal.fire({
            icon: "error",
            title: `${t?.class?.score?.add_score?.swal?.error_title || "Error"}`,
            text: `${t?.class?.score?.add_score?.swal?.error_text || "Error adding grade"}`,
            confirmButtonText: t?.class?.close_button || "Close",
          });
        }
      })
      .catch((error) => {
        console.error("Error adding grade:", error);
        Swal.fire({
          icon: "error",
          title: `${t?.class?.score?.add_score?.swal?.error_title || "Error"}`,
          text: `${t?.class?.score?.add_score?.swal?.error_text || "Error adding grade"} ${error.message || ""}`,
          confirmButtonText: t?.class?.close_button || "Close",
        });
      });
  });

  modal.appendChild(form);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
}
async function deleteStudent(studentId) {
  // Ask for confirmation
  const result = await Swal.fire({
    title: t?.class?.score?.delete_student?.swal?.title || "Confirm Delete",
    text: t?.class?.score?.delete_student?.swal?.text || "Are you sure you want to delete this student?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: t?.class?.score?.delete_student?.swal?.confirm_button || "Delete!",
    cancelButtonText: t?.class?.cancel_button || "Cancel",
  });
  
  if (!result.isConfirmed) {
    return;
  }
  
  try {
    // Find student by ID in the DOM, rather than relying on index
    const tableBody = document.getElementById("student-table-body");
    const studentIdStr = String(studentId);
    
    // Use a reliable DOM method to find the student row
    let studentRow = null;
    const rows = tableBody.querySelectorAll('tr');
    for (const row of rows) {
      const idCell = row.querySelector('td:first-child');
      if (idCell && idCell.textContent && idCell.textContent.trim() === studentIdStr) {
        studentRow = row;
        break;
      }
    }

    const response = await fetch("/api/student", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ student_id: studentId }),
    });

    if (response.ok) {
      const data = await response.json();
      
      Swal.fire({
        icon: "success",
        title: t?.class?.score?.delete_student?.swal?.success_title || "Success!",
        text: (t?.class?.score?.delete_student?.swal?.success_text || "Student deleted: ") + data.message,
        confirmButtonText: "OK",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      });

      // Remove the student row if we found it
      if (studentRow && tableBody.contains(studentRow)) {
        tableBody.removeChild(studentRow);
      }

      // Update student arrays with null check
      if (typeof students !== "undefined") {
        students = students.filter(
          (student) => student.student_id != studentId
        );
      }
      if (typeof currentStudents !== "undefined") {
        currentStudents = currentStudents.filter(
          (student) => student.student_id != studentId
        );
      }

      // Update student count with proper element checking
      const studentCountElement =
        document.getElementById("studentCount") ||
        document.getElementById("student-count");
        
      if (studentCountElement) {
        const studentsLeft = tableBody ? tableBody.children.length : 0;

        const countText =
          t?.class?.table?.total_count
            ? t.class.table.total_count.replace("{0}", studentsLeft)
            : `Tổng: ${studentsLeft} học sinh`;

        studentCountElement.textContent = countText;
      }
    } else {
      const errorData = await response.json();
      console.error("Delete error:", errorData.message);
      
      Swal.fire({
        icon: "error",
        title: t?.class?.score?.delete_student?.swal?.error_title || "Error",
        text: errorData.message || t?.class?.score?.delete_student?.swal?.error_text || "Error deleting student",
        confirmButtonText: t?.class?.close_button || "Close",
      });
    }
  } catch (error) {
    console.error("Error:", error);
    
    Swal.fire({
      icon: "error",
      title: t?.class?.score?.delete_student?.swal?.error_title || "Error",
      text: t?.class?.score?.delete_student?.swal?.error_text || "An error occurred while deleting the student",
      confirmButtonText: t?.class?.close_button || "Close",
    });
  }
}

async function cancel(registrationId, studentId) {
  // Ask for confirmation with a model
  const result = await Swal.fire({
    title: t?.class?.score?.delete_confirm?.title || "Confirm Cancellation",
    text: t?.class?.score?.delete_confirm?.text || "Please provide a reason for cancellation",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: t?.class?.score?.delete_confirm?.confirm_button || "Cancel Registration",
    cancelButtonText: t?.class?.cancel_button || "Go Back",
    input: "textarea", // Use a textarea for the reason input
    inputPlaceholder: t?.class?.score?.delete_confirm?.reson || "Enter reason for cancellation",
    inputAttributes: {
      "aria-label": t?.class?.score?.delete_confirm?.input_aria || "Enter cancellation reason",
    },
    showLoaderOnConfirm: true, // Show a loader when confirming
    preConfirm: (reason) => {
      if (!reason || reason.trim() === "") {
        Swal.showValidationMessage(t?.class?.score?.delete_confirm?.reason_required || "Please enter a reason");
      }
      return reason; // Return the reason entered
    },
  });

  if (!result.isConfirmed) {
    return; // If not confirmed, do nothing
  }

  const reason = result.value; // Reason entered by the user

  try {    // Get current language
    const currentLang = localStorage.getItem("lang") || "en";
    
    // Make the delete request to the server with the reason and language
    const response = await fetch(`/api/class_registation/${registrationId}?lang=${currentLang}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reason: reason, studentId: studentId }), // Pass reason and studentId
    });

    if (response.ok) {
      const data = await response.json();
      
      Swal.fire({
        icon: "success",
        title: t?.class?.score?.delete_confirm?.success_title || "Success!",
        text: data.message,
        confirmButtonText: "OK",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
      
      // Find the student row using a more reliable method
      const tableBody = document.getElementById("student-table-body");
      const studentIdStr = String(studentId);
      
      // Look for the row with this student ID
      let row = null;
      const rows = tableBody.querySelectorAll('tr');
      for (const r of rows) {
        const idCell = r.querySelector('td:first-child');
        if (idCell && idCell.textContent && idCell.textContent.trim() === studentIdStr) {
          row = r;
          break;
        }
      }

      if (row) {
        tableBody.removeChild(row);

        // Update student count
        const studentCount = document.getElementById("student-count");
        if (studentCount) {
          const studentsLeft = tableBody.children.length;
          const countText = t?.class?.table?.total_count
            ? t.class.table.total_count.replace("{0}", studentsLeft)
            : `Tổng: ${studentsLeft} học sinh`;
          studentCount.textContent = countText;
        }
        
        // Update student arrays if they exist
        if (typeof students !== "undefined") {
          students = students.filter(student => student.student_id != studentId);
        }
        if (typeof currentStudents !== "undefined") {
          currentStudents = currentStudents.filter(student => student.student_id != studentId);
        }
      } else {
        console.warn("Could not find row for student ID:", studentId);
      }
    } else {
      const errorData = await response.json();
      console.error("Cancel error:", errorData.message);
      
      Swal.fire({
        icon: "error",
        title: t?.class?.score?.delete_confirm?.error_title || "Error!",
        text: errorData.message || t?.class?.score?.delete_confirm?.error_text || "Error canceling registration",
        confirmButtonText: t?.class?.close_button || "Close",
      });
    }
  } catch (error) {
    console.error("Error:", error);
    
    Swal.fire({
      icon: "error",
      title: t?.class?.score?.delete_confirm?.error_title || "Error!",
      text: t?.class?.score?.delete_confirm?.error_text || "An error occurred while canceling the registration",
      confirmButtonText: t?.class?.close_button || "Close",
    });
  }
}

async function editGrade(studentId, transcriptId, grade) {
  const overlay = document.createElement("div");
  overlay.classList.add(
    "fixed",
    "top-0",
    "left-0",
    "w-full",
    "h-full",
    "bg-gray-50",
    "bg-opacity-50",
    "flex",
    "items-center",
    "justify-center"
  );

  const modal = document.createElement("div");
  modal.classList.add("bg-white", "p-5", "shadow-lg", "rounded-lg", "max-w-md");

  const form = document.createElement("form");
  form.innerHTML = `
      <h2 class="text-xl font-bold mb-4 mx-20">${t?.class?.score?.edit_score?.title || "Edit Grade"}</h2>
      <div class="grid gap-4">
        <div>
          <label for="grade" class="block text-sm font-medium text-gray-700">${t?.class?.score?.edit_score?.label || "Grade"}</label>
          <input type="text" id="grade" name="grade" value="${grade}" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm">
        </div>
      </div>
      <div class="mt-4 flex justify-end">
        <button type="button" id="closeModal" class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">${t?.class?.score?.edit_score?.close_button || "Close"}</button>
        <button type="submit" class="ml-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">${t?.class?.score?.edit_score?.save_button || "Save"}</button>
      </div>
    `;

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    let formData = new FormData(form);
    let entityData = {};
    formData.forEach((value, key) => {
      entityData[key] = value;
    });
    let transcript_id = parseInt(transcriptId, 10);
    fetch(`/api/transcript/${transcript_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entityData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message.includes("successfully")) {
          Swal.fire({
            icon: "success",
            title: t?.class?.score?.edit_score?.swal?.success_title || "Success!",
            text: t?.class?.score?.edit_score?.swal?.success_text || "Grade has been updated!",
            confirmButtonText: "OK",
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
          });
          document.body.removeChild(overlay);
          const studentTableBody = document.getElementById("student-table-body");
          
          // Find the student row using a more reliable method
          const rows = studentTableBody.querySelectorAll('tr');
          const studentIdStr = String(studentId);
          
          // Find the row containing this student
          let row = null;
          for (const r of rows) {
            const idCell = r.querySelector('td:first-child');
            if (idCell && idCell.textContent && idCell.textContent.trim() === studentIdStr) {
              row = r;
              break;
            }
          }

          if (row) {
            // Update grade display using querySelector for more reliable selection
            const gradeCell = row.querySelector('td:nth-child(4)');
            if (gradeCell) {
              gradeCell.innerHTML = `<span class="inline-flex px-2 py-1 text-xs font-medium rounded-full 
                ${
                  data.updatedtranscript.grade != null
                    ? data.updatedtranscript.grade >= 5
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                    : "bg-gray-200 text-gray-700"
                }">
                ${data.updatedtranscript.grade ?? "N/A"}
              </span>`;
            }

            // Find and hide the add grade cell
            const addGradeCell = row.querySelector('td:nth-child(5)');
            if (addGradeCell) {
              addGradeCell.classList.add("hidden");
            }

            // Find and show the edit grade cell
            const editGradeCell = row.querySelector('td:nth-child(6)');
            if (editGradeCell) {
              editGradeCell.classList.remove("hidden");
              editGradeCell.innerHTML = `<button class="px-2 py-1 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700" onclick="editGrade(${studentId}, ${transcriptId}, '${data.updatedtranscript.grade}')">${t?.class?.edit_grade_button || "Edit Grade"}</button>`;
            }
          } else {
            Swal.fire({
              icon: "error",
              title: t?.class?.score?.edit_score?.swal?.error_title || "Error!",
              text: t?.class?.score?.edit_score?.swal?.error_text || "Failed to update grade.",
              confirmButtonText: t?.class?.close_button || "Close",
            });
          }
        } else {
          Swal.fire({
            icon: "error",
            title: t?.class?.score?.edit_score?.swal?.error_title || "Error!",
            text: t?.class?.score?.edit_score?.swal?.error_text || "Error updating grade.",
            confirmButtonText: t?.class?.close_button || "Close",
          });
        }
      })
      .catch((error) => {
        console.error("Error updating entity:", error);
        Swal.fire({
          icon: "error",
          title: t?.class?.score?.edit_score?.swal?.error_title || "Error!",
          text: (t?.class?.score?.edit_score?.swal?.error_text || "An error occurred while updating grade.") + 
                (error.message ? ` ${error.message}` : ""),
          confirmButtonText: t?.class?.close_button || "Close",
        });
      });
  });

  form.querySelector("#closeModal").addEventListener("click", function () {
    document.body.removeChild(overlay);
  });

  modal.appendChild(form);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
}
