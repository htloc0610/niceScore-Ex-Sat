let t; // Global translations object

// Function to load translations and initialize the page
async function initPage() {
  // Get language preference from URL first, then localStorage, then default to 'en'
  const urlParams = new URLSearchParams(window.location.search);
  const urlLang = urlParams.get('lang');
  const localLang = localStorage.getItem("lang");
  const lang = urlLang || localLang || "en";
  
  // If a language was specified in URL, update localStorage
  if (urlLang) {
    localStorage.setItem("lang", urlLang);
  } 
  // If localStorage has a language but URL doesn't, update URL to maintain language state during navigation
  else if (localLang && !urlLang) {
    const currentUrl = new URL(window.location);
    currentUrl.searchParams.set('lang', localLang);
    
    // Use history.replaceState to update URL without reloading
    history.replaceState(null, '', currentUrl.toString());
  }
  
  // Set language value in the language selector dropdown if it exists
  const languageSelect = document.getElementById('languageSelect');
  if (languageSelect) {
    languageSelect.value = lang;
  }
  
  await loadTranslationsAndUpdateUI(lang);
}

// Function to reload translations and update UI when language changes
async function loadTranslationsAndUpdateUI(lang) {
  const translationUrl = `/assets/scripts/locales/${lang}.json`;

  try {
    const res = await fetch(translationUrl);
    if (!res.ok) {
      throw new Error(`Failed to load translation file for ${lang}`);
    }
    t = await res.json();
    console.log("Loaded translations for class page", t);

    // Update any static UI elements that need translation
    updateUITranslations();
    
    // Load students for the class if we're on a class page
    const classId = window.location.pathname.split("/").pop();
    if (classId) {
      loadStudents(classId);
    }
  } catch (error) {
    console.error("Error loading translations:", error);
    // Fall back to English if there's an error loading translations
    if (lang !== 'en') {
      loadTranslationsAndUpdateUI('en');
    }
  }
}

// Function to update static UI elements with translations
function updateUITranslations() {
  // Update modal title and buttons
  const addStudentTitle = document.querySelector("#add-student-modal h3");
  if (addStudentTitle) {
    addStudentTitle.textContent = t?.class?.add_student || "Add Student";
  }
  
  const studentIdLabel = document.querySelector('label[for="student-id"]');
  if (studentIdLabel) {
    studentIdLabel.textContent = t?.class?.add_student_form?.student_id || "Student ID:";
  }
  
  const closeButton = document.querySelector('#add-student-modal button[type="button"]');
  if (closeButton) {
    closeButton.textContent = t?.class?.add_student_form?.close_button || "Close";
  }
  
  const addButton = document.querySelector('#add-student-form button[type="submit"]');
  if (addButton) {
    // Keep the SVG if it exists, but update the text
    const svg = addButton.querySelector('svg');
    if (svg) {
      const textNode = Array.from(addButton.childNodes).find(node => node.nodeType === 3);
      if (textNode) {
        textNode.nodeValue = t?.class?.add_student_form?.add_button || "Add";
      }
    } else {
      addButton.textContent = t?.class?.add_student_form?.add_button || "Add";
    }
  }
  
  // Update table header
  const tableHeader = document.querySelector("h4");
  if (tableHeader) {
    tableHeader.textContent = t?.class?.table?.title || "Students List";
  }
  
  // Update add student button text
  const addStudentBtn = document.getElementById("add-student-btn");
  if (addStudentBtn) {
    // Preserve the SVG if it exists
    const svg = addStudentBtn.querySelector('svg');
    if (svg) {
      // Find the text node and update it
      const textNodes = Array.from(addStudentBtn.childNodes)
        .filter(node => node.nodeType === 3);
      if (textNodes.length > 0) {
        textNodes[textNodes.length - 1].nodeValue = t?.class?.add_student_button || "Add Student";
      }
    } else {
      addStudentBtn.textContent = t?.class?.add_student_button || "Add Student";
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initPage();
  
  // Listen for language changes from the language selector
  const languageSelect = document.getElementById('languageSelect');
  if (languageSelect) {
    languageSelect.addEventListener('change', function() {
      const selectedLang = this.value;
      // Update localStorage and reload the page with the new language param
      localStorage.setItem('lang', selectedLang);
      
      // Redirect to the same page with the language parameter
      const currentUrl = new URL(window.location);
      currentUrl.searchParams.set('lang', selectedLang);
      window.location.href = currentUrl.toString();
    });
  }
  
  // Listen for custom language change event (from language-handler.js if used)
  window.addEventListener('languageChanged', async (e) => {
    if (e.detail && e.detail.language) {
      await loadTranslationsAndUpdateUI(e.detail.language);
    }
  });
});

async function loadStudents(classId) {
  const studentTable = document.getElementById("student-table");
  const studentCount = document.getElementById("student-count");
  const lang = localStorage.getItem("lang") || "en";

  // First, make sure we have a proper table structure
  if (!document.getElementById("student-table-head") || !document.getElementById("student-table-body")) {
    // Create table structure if it doesn't exist
    studentTable.innerHTML = `
      <thead id="student-table-head">
        <tr class="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b bg-gray-50">
          <th class="px-4 py-3">${t?.class?.table?.student_id || "Student ID"}</th>
          <th class="px-4 py-3">${t?.class?.table?.full_name || "Full Name"}</th>
          <th class="px-4 py-3">${t?.class?.table?.email || "Email"}</th>
          <th class="px-4 py-3">${t?.class?.table?.grade || "Grade"}</th>
          <th class="px-4 py-3" colspan="2">${t?.class?.table?.actions || "Actions"}</th>
        </tr>
      </thead>
      <tbody id="student-table-body">
      </tbody>
    `;
  } else {
    // Just update the header text if the structure exists
    const headers = document.querySelectorAll("#student-table-head th");
    if (headers && headers.length >= 5) {
      headers[0].textContent = t?.class?.table?.student_id || "Student ID";
      headers[1].textContent = t?.class?.table?.full_name || "Full Name";
      headers[2].textContent = t?.class?.table?.email || "Email";
      headers[3].textContent = t?.class?.table?.grade || "Grade";
      headers[4].textContent = t?.class?.table?.actions || "Actions";
    }
  }

  const studentTableBody = document.getElementById("student-table-body");
  try {
    // Show loading indicator
    studentTableBody.innerHTML = `
      <tr class="text-gray-600">
        <td colspan="6" class="px-4 py-2 text-sm text-center">
          <div class="flex justify-center items-center">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            ${t?.class?.table?.loading || "Loading students..."}
          </div>
        </td>
      </tr>`;

    // Get current language
    const currentLang = localStorage.getItem("lang") || "en";
    
    // Fetch class registrations with language parameter
    const response = await fetch(`/api/class_registation/${classId}?lang=${currentLang}`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch students");
    }
    
    const data = await response.json();
    const students = data.registrations || [];

    // Store students in global variables for reference
    if (typeof window.currentStudents === 'undefined') {
      window.currentStudents = students;
    } else {
      window.currentStudents = students;
    }
    
    studentTableBody.innerHTML = "";
    if (students.length === 0) {
      const emptyMessage = t?.class?.table?.empty_message || "No students in this class yet";
      studentTableBody.innerHTML = `
        <tr class="text-gray-600">
          <td colspan="6" class="px-4 py-2 text-sm text-center">${emptyMessage}</td>
        </tr>`;
      studentCount.textContent = (
        t?.class?.table?.total_count || "Total: {0} students"
      ).replace("{0}", "0");
      return;
    }

    // Fetch transcripts in parallel
    const transcriptPromises = students.map((r) => {
      if (!r.student || !r.student.student_id) {
        console.warn("Registration has missing student data", r);
        return Promise.resolve({ transcript: null });
      }
      
      return fetch(`/api/transcript/student/${r.student.student_id}/class/${classId}`)
        .then((res) => {
          if (!res.ok) {
            console.warn(`Failed to fetch transcript for student ${r.student.student_id}`);
            return { transcript: null };
          }
          return res.json();
        })
        .catch((err) => {
          console.error(`Error fetching transcript for student ${r.student.student_id}:`, err);
          return { transcript: null };
        });
    });

    const transcriptResults = await Promise.all(transcriptPromises);

    students.forEach((registration, index) => {
      const student = registration.student || {};
      const transcriptData = transcriptResults[index]?.transcript || null;
      const grade = transcriptData?.grade;
      const transcript_id = transcriptData?.transcript_id;
      const row = document.createElement("tr");
      row.className = "text-gray-700 hover:bg-gray-50 transition-colors";

      // Format and sanitize data
      const studentId = student.student_id || "N/A";
      const fullName = student.full_name || "N/A";
      const email = student.email || "N/A";
      const formattedGrade =
        grade !== null && grade !== undefined
          ? Number(grade).toFixed(2)
          : t?.class?.grade?.not_available || "Not available";
      const hasGrade = grade !== null && grade !== undefined;

      // Create the row HTML with proper null checks
      row.innerHTML = `
        <td class="px-4 py-2 text-sm truncate">${studentId}</td>
        <td class="px-4 py-2 text-sm truncate" title="${fullName}">${fullName}</td>
        <td class="px-4 py-2 text-sm truncate" title="${email}">${email}</td>
        <td class="px-4 py-2 text-sm">
          <span class="inline-flex px-2 py-1 text-xs font-medium rounded-full 
            ${
              hasGrade
                ? grade >= 5
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
                : "bg-gray-200 text-gray-700"
            }">
            ${formattedGrade}
          </span>
        </td>
        <td class="px-4 py-2 text-sm ${hasGrade ? "hidden" : ""}">
          <button class="px-2 py-1 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 mb-1" onclick="addGrade(${studentId}, ${classId})">${
        t?.class?.add_grade_button || "Add Grade"
      }</button>            
          <button class="px-2 py-1 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700" onclick="cancel(${
            registration.registration_id
          }, ${studentId})">${t?.class?.cancel_button || "Cancel"}</button>
        </td>
        <td class="px-4 py-2 text-sm ${hasGrade ? "" : "hidden"}">
          <button class="px-2 py-1 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700" onclick="editGrade(${studentId}, ${
        transcript_id || "null"
      }, '${hasGrade ? grade : ""}')">${
        t?.class?.edit_grade_button || "Edit Grade"
      }</button>
        </td>`;
      studentTableBody.appendChild(row);
    });

    studentCount.textContent = (
      t?.class?.table?.total_count || "Total: {0} students"
    ).replace("{0}", students.length);
  } catch (error) {
    console.error("Error fetching students:", error);
    studentTableBody.innerHTML = `
      <tr class="text-gray-600">
        <td colspan="6" class="px-4 py-2 text-sm text-center">
          <div class="flex flex-col items-center">
            <svg class="w-8 h-8 text-red-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            ${t?.class?.table?.error_message || "Error loading student list"}: ${error.message}
          </div>
        </td>
      </tr>`;
    studentCount.textContent = (
      t?.class?.table?.total_count || "Total: {0} students"
    ).replace("{0}", "0");
  }
}

document.getElementById("add-student-btn").addEventListener("click", () => {
  document.getElementById("add-student-modal").classList.remove("hidden");
});

document.addEventListener("click", (e) => {
  if (e.target === document.getElementById("add-student-modal")) {
    closeAddStudentModal();
  }
});

function closeAddStudentModal() {
  document.getElementById("add-student-modal").classList.add("hidden");
  document.getElementById("add-student-form").reset();
}

document
  .getElementById("add-student-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    
    // Validate input
    const studentIdInput = document.getElementById("student-id");
    const studentId = studentIdInput.value.trim();
    const classId = window.location.pathname.split("/").pop();
    
    if (!studentId) {
      Swal.fire({
        icon: "error",
        title: t?.class?.add_table?.swal?.validation_title || "Validation Error",
        text: t?.class?.add_table?.swal?.student_id_required || "Please enter a student ID",
        confirmButtonText: t?.class?.close_button || "Close",
      });
      return;
    }
    
    // Add loading state to submit button
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalBtnContent = submitBtn.innerHTML;
    submitBtn.disabled = true;    submitBtn.innerHTML = `
      <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      ${t?.class?.add_student_form?.processing || "Processing..."}
    `;

    try {
      const response = await fetch("/api/class_registation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: parseInt(studentId, 10),
          class_id: parseInt(classId, 10),
        }),
      });

      // Reset form button
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnContent;

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to register student");
      }

      closeAddStudentModal();
      
      Swal.fire({
        icon: "success",
        title: t?.class?.add_table?.swal?.success_title || "Success",
        text: t?.class?.add_table?.swal?.success_text || "Student registered successfully",
        confirmButtonText: "OK",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
      
      // Reload student list after successful registration
      await loadStudents(classId);
      
    } catch (error) {
      console.error("Error registering student:", error);
      Swal.fire({
        icon: "error",
        title: t?.class?.add_table?.swal?.error_title || "Error",
        text: (t?.class?.add_table?.swal?.error_text || "Failed to register student: ") + error.message,
        confirmButtonText: t?.class?.close_button || "Close",
      });
    }
  });
