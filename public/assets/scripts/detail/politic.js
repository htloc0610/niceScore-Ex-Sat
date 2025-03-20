document.addEventListener('DOMContentLoaded', function () {
    const documentType = document.getElementById('documentType');
    const documentNumber = document.getElementById('documentNumber');
    const issueDate = document.getElementById('issueDate');
    const expiryDate = document.getElementById('expiryDate');
    const issuePlace = document.getElementById('issuePlace');
    const issueCountry = document.getElementById('issueCountry');
    const notes = document.getElementById('notes');
    const hasChip = document.getElementById('hasChip');

    // Hàm để vô hiệu hóa và tô màu xám các trường input và select
    function disableFields(...fields) {
        fields.forEach(field => {
            if (field.tagName === 'SELECT') {
                field.setAttribute('disabled', true);
            } else {
                field.setAttribute('readonly', true);
            }
            field.style.backgroundColor = '#f3f4f6'; // Màu xám nhạt
        });
    }

    // Hàm để kích hoạt lại các trường input và select
    function enableFields(...fields) {
        fields.forEach(field => {
            if (field.tagName === 'SELECT') {
                field.removeAttribute('disabled');
            } else {
                field.removeAttribute('readonly');
            }
            field.style.backgroundColor = '#fff'; // Màu trắng
        });
    }

    // Hàm xử lý khi thay đổi loại giấy tờ
    function handleDocumentTypeChange() {
        const selectedType = documentType.value;

        // Reset tất cả các trường về trạng thái ban đầu
        enableFields(documentNumber, issueDate, expiryDate, issuePlace, issueCountry, notes, hasChip);

        // Xử lý từng loại giấy tờ
        if (selectedType === 'CMND') {
            disableFields(issueCountry, notes, hasChip);
        } else if (selectedType === 'CCCD') {
            disableFields(issueCountry, notes);
        } else if (selectedType === 'Hộ chiếu') {
            disableFields(hasChip);
        }
    }

    // Xử lý sự kiện khi thay đổi loại giấy tờ
    documentType.addEventListener('change', handleDocumentTypeChange);

    // Gọi hàm xử lý ngay khi trang được tải để xử lý giá trị mặc định
    handleDocumentTypeChange();
});
