async function deleteStudent(studentId) {
    try {
        const studentIndex = currentStudents.findIndex(student => String(student.student_id) === studentId);

      const response = await fetch('/api/delete_student', {
        method: 'POST',
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