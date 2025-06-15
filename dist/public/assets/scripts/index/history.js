const modal = document.getElementById('cancellationModal');
const closeModal = document.getElementById('closeModal');
const closeModalFooter = document.getElementById('closeModalFooter');
const studentName = document.getElementById('studentName');
const studentEmail = document.getElementById('studentEmail');
const cancellationTableBody = document.getElementById('cancellationTableBody');
const modalContent = document.getElementById('modalContent');
const noHistoryMessage = document.getElementById('noHistoryMessage');

function formatDate(dateString) {
  const date = new Date(dateString);
  const lang = localStorage.getItem("lang") || 'en';
  const locale = lang === 'vi' ? 'vi-VN' : 'en-US';
  return date.toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' });
}

function populateModal(data) {
  if (data.cancellations.length === 0) {
    modalContent.classList.add('hidden');
    noHistoryMessage.classList.remove('hidden');
    return;
  }

  modalContent.classList.remove('hidden');
  noHistoryMessage.classList.add('hidden');

  studentName.textContent = data.cancellations[0].student.full_name;
  studentEmail.textContent = data.cancellations[0].student.email;

  cancellationTableBody.innerHTML = '';
  data.cancellations.forEach(cancellation => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${cancellation.class.class_name}</td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${cancellation.reason}</td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${cancellation.class.schedule}</td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${cancellation.class.instructor}</td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${formatDate(cancellation.createdAt)}</td>
    `;
    cancellationTableBody.appendChild(row);
  });
}

async function fetchCancellationData(studentId) {
  try {
    const response = await fetch(`/api/class_cancellation/student/${studentId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) throw new Error('Failed to fetch data');
    const data = await response.json();
    populateModal(data);
    modal.classList.remove('hidden');
  } catch (error) {
    console.error('Error fetching cancellation data:', error);
    Swal.fire({
      icon: 'error',
      title: t("index.js.alert.error"),
      text: t("index.js.alert.loadCancellationFail"),
      confirmButtonText: t("index.js.alert.close")
    });
    modal.classList.add('hidden');
  }
}

closeModal.addEventListener('click', () => modal.classList.add('hidden'));
closeModalFooter.addEventListener('click', () => modal.classList.add('hidden'));
modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.classList.add('hidden');
  }
});