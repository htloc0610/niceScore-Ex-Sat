// Translations - use LanguageHandler's translations
// Using deleteStudentTranslations to avoid conflict with global 't' in index.js
let deleteStudentTranslations; // Local reference to translations for this module only

/**
 * Get the latest translations from the LanguageHandler
 * This ensures we always have the current language's translations
 */
function getLatestTranslations() {
  if (window.LanguageHandler && window.LanguageHandler.translations) {
    deleteStudentTranslations = window.LanguageHandler.translations;
    console.log(
      "Retrieved latest translations for delete student functionality"
    );
    return true;
  } else {
    console.warn("LanguageHandler translations not available");
    return false;
  }
}

/**
 * Fallback function to load translations directly if LanguageHandler is not available
 */
async function loadTranslations() {
  // First try to get translations from LanguageHandler
  if (getLatestTranslations()) {
    return true;
  }
  // Fallback to direct loading
  const lang = localStorage.getItem("lang") || "en";
  const translationUrl = `/assets/scripts/locales/${lang}.json`;

  try {
    const res = await fetch(translationUrl);
    if (!res.ok) throw new Error("Failed to load translations");
    deleteStudentTranslations = await res.json();
    return true;
  } catch (error) {
    console.error("Error loading translations:", error);
    return false;
  }
}

// Initialize on page load and set up language change listener
document.addEventListener("DOMContentLoaded", async function () {
  // Initial load
  await loadTranslations();

  // Listen for custom language change events
  window.addEventListener("languageChanged", async function () {
    console.log("Language change detected in delete_student.js");
    await loadTranslations();
  });
});

async function deleteStudent(studentId) {
  // Always get the most up-to-date translations before showing any UI
  getLatestTranslations() || (await loadTranslations());
  // Default values as fallback
  let confirmTitle = "Bạn có chắc chắn?";
  let confirmText = "Dữ liệu sẽ bị xóa vĩnh viễn!";
  let confirmButton = "Xóa!";
  let cancelButton = "Hủy";

  // Try to use LanguageHandler's translate function first for consistency
  if (window.t && typeof window.t === "function") {
    // Based on JSON structure, the correct path has .js. in it
    confirmTitle = window.t("index.js.delete.confirm.title");
    confirmText = window.t("index.js.delete.confirm.text");
    confirmButton = window.t("index.js.delete.confirm.confirmButton");
    cancelButton = window.t("index.js.delete.confirm.cancelButton");

    // Log translations for debugging
    console.log("Delete dialog using translations:", {
      confirmTitle,
      confirmText,
      confirmButton,
      cancelButton,
    });
  } // Fallback to our local translations
  else if (
    deleteStudentTranslations &&
    deleteStudentTranslations.index &&
    deleteStudentTranslations.index.js &&
    deleteStudentTranslations.index.js.delete &&
    deleteStudentTranslations.index.js.delete.confirm
  ) {
    confirmTitle =
      deleteStudentTranslations.index.js.delete.confirm.title || confirmTitle;
    confirmText =
      deleteStudentTranslations.index.js.delete.confirm.text || confirmText;
    confirmButton =
      deleteStudentTranslations.index.js.delete.confirm.confirmButton ||
      confirmButton;
    cancelButton =
      deleteStudentTranslations.index.js.delete.confirm.cancelButton ||
      cancelButton;
  }

  const result = await Swal.fire({
    title: confirmTitle,
    text: confirmText,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: confirmButton,
    cancelButtonText: cancelButton,
  });
  if (!result.isConfirmed) {
    return;
  }
  try {
    const studentIndex = currentStudents.findIndex(
      (student) => String(student.student_id) === studentId
    );

    const response = await fetch("/api/student", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ student_id: studentId }),
    });

    if (response.ok) {
      const data = await response.json(); // alert(data.message);      let successTitle = 'Thành công!';
      // Try global t function first, then fallback
      if (window.t && typeof window.t === "function") {
        successTitle = window.t("index.alert.success");
      } else if (
        deleteStudentTranslations &&
        deleteStudentTranslations.index &&
        deleteStudentTranslations.index.alert &&
        deleteStudentTranslations.index.alert.success
      ) {
        successTitle = deleteStudentTranslations.index.alert.success;
      }

      Swal.fire({
        icon: "success",
        title: successTitle,
        text: data.message,
        confirmButtonText: "OK",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
      const tableBody = document.getElementById("student-table-body");
      const row = tableBody.children[studentIndex];
      tableBody.removeChild(row);

      students = students.filter((student) => student.student_id != studentId);
      currentStudents = currentStudents.filter(
        (student) => student.student_id != studentId
      );

      document.getElementById("studentCount").innerHTML = students.length;
    } else {
      const errorData = await response.json();
      console.error(errorData.message); // alert(errorData.message);
      let errorTitle = "Lỗi!";
      let closeButton = "Đóng";
      // Try global t function first, then fallback
      if (window.t && typeof window.t === "function") {
        errorTitle = window.t("index.alert.error");
        closeButton = window.t("index.js.alert.close");
      } else {
        if (
          deleteStudentTranslations &&
          deleteStudentTranslations.index &&
          deleteStudentTranslations.index.alert &&
          deleteStudentTranslations.index.alert.error
        ) {
          errorTitle = deleteStudentTranslations.index.alert.error;
        }

        if (
          deleteStudentTranslations &&
          deleteStudentTranslations.index &&
          deleteStudentTranslations.index.js &&
          deleteStudentTranslations.index.js.alert &&
          deleteStudentTranslations.index.js.alert.close
        ) {
          closeButton = deleteStudentTranslations.index.js.alert.close;
        }
      }

      Swal.fire({
        icon: "error",
        title: errorTitle,
        text: errorData.message,
        confirmButtonText: closeButton,
      });
    }
  } catch (error) {
    console.error("Error:", error); // alert('Đã xảy ra lỗi khi xóa sinh viên.');
    let errorTitle = "Lỗi!";
    let errorText = "Đã xảy ra lỗi khi xóa sinh viên.";
    let closeButton = "Đóng";
    // Try global t function first, then fallback
    if (window.t && typeof window.t === "function") {
      errorTitle = window.t("index.alert.error");
      errorText =
        window.t("index.js.delete.error") ||
        window.t("index.js.alert.deleteError");
      closeButton = window.t("index.js.alert.close");
    } else {
      if (
        deleteStudentTranslations &&
        deleteStudentTranslations.index &&
        deleteStudentTranslations.index.alert &&
        deleteStudentTranslations.index.alert.error
      ) {
        errorTitle = deleteStudentTranslations.index.alert.error;
      }

      if (
        deleteStudentTranslations &&
        deleteStudentTranslations.index &&
        deleteStudentTranslations.index.js &&
        deleteStudentTranslations.index.js.delete &&
        deleteStudentTranslations.index.js.delete.error
      ) {
        errorText = deleteStudentTranslations.index.js.delete.error;
      } else if (
        deleteStudentTranslations &&
        deleteStudentTranslations.index &&
        deleteStudentTranslations.index.js &&
        deleteStudentTranslations.index.js.alert &&
        deleteStudentTranslations.index.js.alert.deleteError
      ) {
        errorText = deleteStudentTranslations.index.js.alert.deleteError;
      }

      if (
        deleteStudentTranslations &&
        deleteStudentTranslations.index &&
        deleteStudentTranslations.index.js &&
        deleteStudentTranslations.index.js.alert &&
        deleteStudentTranslations.index.js.alert.close
      ) {
        closeButton = deleteStudentTranslations.index.js.alert.close;
      }
    }

    Swal.fire({
      icon: "error",
      title: errorTitle,
      text: errorText,
      confirmButtonText: closeButton,
    });
  }
}
