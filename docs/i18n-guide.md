# Hướng Dẫn Đa Ngôn Ngữ (i18n)

Tài liệu này mô tả cách hệ thống đa ngôn ngữ (internationalization - i18n) được cấu trúc trong dự án. Hệ thống này được thiết kế để dễ dàng bảo trì và mở rộng.

## Cấu trúc thư mục

```plaintext
src/
  ├── i18n/                     # Thư mục trung tâm cho tất cả logic đa ngôn ngữ
  │   ├── config.ts             # Cấu hình ngôn ngữ và các hằng số
  │   ├── helpers.ts            # Các helper function cho Handlebars
  │   ├── middleware.ts         # Middleware Express cho xử lý ngôn ngữ
  │   └── index.ts              # Tệp xuất tất cả chức năng i18n (điểm truy cập chính)
  │
  ├── utils/                    # (Đang loại dần để tránh trùng lặp)
  │   └── languageUtils.ts      # Các utilities sẽ được di chuyển vào i18n/
  │
  ├── config/
  │   ├── handlebars.ts         # Cấu hình Handlebars sử dụng helpers từ i18n/
  │   └── language.ts           # (Không còn sử dụng, thay thế bằng i18n/middleware.ts)
  │
  ├── public/assets/scripts/
  │   ├── language-handler.js   # Logic xử lý ngôn ngữ phía client
  │   └── locales/              # Thư mục chứa tệp dịch
  │       ├── en.json           # Bản dịch tiếng Anh
  │       └── vi.json           # Bản dịch tiếng Việt  
```

## Các tệp phiên dịch (Translation files)

Các bản dịch được lưu trữ trong các tệp JSON, mỗi ngôn ngữ một tệp:

- `src/public/assets/scripts/locales/en.json`: Bản dịch tiếng Anh
- `src/public/assets/scripts/locales/vi.json`: Bản dịch tiếng Việt

Các bản dịch được tổ chức theo cấu trúc phân cấp, ví dụ:

```json
{
  "index": {
    "header": {
      "title": "FIT@HCMUS Student Management System"
    },
    "button": {
      "add_student": "Add New Student"
    }
  }
}
```

## Sử dụng trong mã nguồn

### Server-side (TypeScript/Node.js)

```typescript
// Nhập tất cả từ module i18n
import { 
  LANGUAGES,
  isSupportedLanguage, 
  getTranslation,
  loadTranslations 
} from '../i18n';

// Lấy bản dịch
const translations = loadTranslations();
const message = getTranslation(LANGUAGES.EN, 'index.header.title', translations);
```

### Templates (Handlebars)

```handlebars
<!-- Sử dụng helper t để hiển thị văn bản đã dịch -->
<h1>{{t "index.header.title"}}</h1>

<!-- Helper khác dành cho định dạng -->
<span class="{{statusClass status}}">
  {{isActiveText isActive}}
</span>
```

### Client-side (JavaScript)

#### Option 1: Using `language-handler.js` (Recommended)

```html
<!-- Nhúng language-handler.js vào layout -->
<script src="/assets/scripts/language-handler.js"></script>

<!-- Sử dụng t() để dịch trong JavaScript -->
<script>
  document.addEventListener('DOMContentLoaded', async () => {
    await LanguageHandler.init();
    
    // Cách 1: Sử dụng hàm t() toàn cục 
    const message = t('index.header.title');
    
    // Cách 2: Sử dụng phương thức của LanguageHandler
    const greeting = LanguageHandler.translate('index.greetings.hello');
  });
</script>
```

#### Option 2: Direct Implementation in Script Files

Cho các tệp JavaScript độc lập, bạn có thể tải trực tiếp tệp dịch và tạo hàm dịch t():

```javascript
// Global translations object
let t = key => key; // Default fallback function that returns the key itself

document.addEventListener('DOMContentLoaded', async function() {
    // Load translations
    const lang = localStorage.getItem("lang") || 'en';
    const translationUrl = `/assets/scripts/locales/${lang}.json`;

    try {
        const res = await fetch(translationUrl);
        if (res.ok) {
            const translations = await res.json();
            // Create translation function
            t = key => {
                // Navigate through nested keys (e.g. "detail.document.title")
                const parts = key.split('.');
                let value = translations;
                for (const part of parts) {
                    if (value && typeof value === 'object' && part in value) {
                        value = value[part];
                    } else {
                        return key; // Key not found, return the key itself
                    }
                }
                return value;
            };
            
            // Proceed with initializing the page with translations
            initializePage();
        } else {
            console.error("Failed to load translations");
        }
    } catch (error) {
        console.error("Error loading translations:", error);
    }
});
```

Phương pháp này được sử dụng trong các tệp như `politic.js` và các tệp JS khác mà cần có chức năng dịch nhưng không phụ thuộc hoàn toàn vào `language-handler.js`.

## Thêm ngôn ngữ mới

Để thêm một ngôn ngữ mới (ví dụ: Tiếng Pháp):

1. Tạo tệp bản dịch mới `src/public/assets/scripts/locales/fr.json`

2. Cập nhật tệp `src/i18n/config.ts`:

```typescript
export const LANGUAGES = {
  EN: 'en',
  VI: 'vi',
  FR: 'fr'  // Thêm mã ngôn ngữ mới
} as const;

// Cập nhật các tùy chọn ngôn ngữ
export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { value: LANGUAGES.EN, label: 'English' },
  { value: LANGUAGES.VI, label: 'Tiếng Việt' },
  { value: LANGUAGES.FR, label: 'Français' }  // Thêm tùy chọn mới
];

// Cập nhật hàm loadTranslations
export function loadTranslations() {
  const translations: Record<SupportedLanguage, any> = {
    [LANGUAGES.EN]: JSON.parse(fs.readFileSync(path.join(__dirname, '../public/assets/scripts/locales/en.json'), 'utf-8')),
    [LANGUAGES.VI]: JSON.parse(fs.readFileSync(path.join(__dirname, '../public/assets/scripts/locales/vi.json'), 'utf-8')),
    [LANGUAGES.FR]: JSON.parse(fs.readFileSync(path.join(__dirname, '../public/assets/scripts/locales/fr.json'), 'utf-8'))  // Thêm ngôn ngữ mới
  };
  return translations;
}
```

3. Cập nhật các cấu hình khác trong `src/i18n/config.ts`:

```typescript
// Thêm vào STATUS_NAMES, ACTIVE_STATUS_TEXT, PREREQUISITE_TEXT, v.v.
export const STATUS_NAMES = {
  [LANGUAGES.EN]: {
    is_learning: 'Studying',
    // ...
  },
  [LANGUAGES.VI]: {
    is_learning: 'Đang học',
    // ...
  },
  [LANGUAGES.FR]: {
    is_learning: 'En cours',
    graduated: 'Diplômé',
    dropped_out: 'Abandonné',
    paused: 'En pause'
  }
};
```

4. Cập nhật UI ngôn ngữ trong `src/views/partials/header.hbs`:

```handlebars
<select name="lang" id="languageSelect">
  <option value="en">English</option>
  <option value="vi">Tiếng Việt</option>
  <option value="fr">Français</option>  <!-- Thêm tùy chọn mới -->
</select>
```

5. Cập nhật `src/public/assets/scripts/language-handler.js`:

```javascript
// Cập nhật mảng các ngôn ngữ được hỗ trợ
SUPPORTED_LANGUAGES: ['en', 'vi', 'fr'], // Thêm ngôn ngữ mới
```

## Thêm bản dịch mới

Để thêm chuỗi văn bản mới cần dịch:

1. Thêm khóa mới vào tệp `en.json` và `vi.json` (và các tệp ngôn ngữ khác nếu có):

```json
{
  "new_section": {
    "new_key": "New translated text"
  }
}
```

2. Sử dụng trong mã nguồn:
   - Trong templates: `{{t "new_section.new_key"}}`
   - Trong JavaScript: `t('new_section.new_key')` hoặc `LanguageHandler.translate('new_section.new_key')`

## Các Helper dành cho Handlebars

Tất cả helper đã được tập trung trong `src/i18n/helpers.ts`:

| Helper | Chức năng |
|--------|----------|
| `t` | Dịch văn bản theo key |
| `statusClass` | Trả về lớp CSS cho trạng thái |
| `isActiveText` | Hiển thị "Active"/"Inactive" đã được dịch |
| `isActiveClass` | Trả về lớp CSS cho trạng thái active |
| `prerequisiteDisplay` | Hiển thị điều kiện tiên quyết |
| `json` | Chuyển đối tượng thành chuỗi JSON |

## Điều cần chú ý khi sử dụng

1. **Truy xuất thống nhất**: Luôn import từ module i18n thay vì các tệp riêng lẻ:
   ```typescript
   // ✓ ĐÚNG
   import { LANGUAGES, getTranslation } from '../i18n';
   
   // ✗ SAI
   import { LANGUAGES } from '../i18n/config';
   import { getTranslation } from '../utils/languageUtils';
   ```

2. **Truyền biến `lang` vào template**: Đảm bảo các route đều truyền biến `lang` vào cho template:
   ```typescript
   res.render("template", { 
     // Dữ liệu khác...
     lang: res.locals.lang // ← Quan trọng!
   });
   ```

3. **Không sử dụng `config/language.ts`**: Thay vào đó, dùng middleware từ i18n:
   ```typescript
   import { languageMiddleware } from './i18n';
   app.use(languageMiddleware);
   ```

## Quy trình hoạt động

1. User thay đổi ngôn ngữ từ giao diện
2. `language-handler.js` lưu vào localStorage và cập nhật cookie
3. Khi tải lại trang, `languageMiddleware` đọc cookie và đặt ngôn ngữ
4. Template handlebars sử dụng ngôn ngữ để hiển thị nội dung phù hợp
5. JavaScript phía client tải bản dịch tương ứng với ngôn ngữ

## Các lỗi thường gặp và cách xử lý

1. **Bản dịch không hiển thị**: Kiểm tra:
   - Biến `lang` có được truyền vào template không?
   - Key đã tồn tại trong tệp JSON chưa?
   - Cấu trúc key có đúng không? Ví dụ: `section.subsection.key`

2. **Ngôn ngữ không lưu sau khi tải lại trang**:
   - Kiểm tra cookie và localStorage
   - Kiểm tra middleware đã được cấu hình đúng chưa

3. **Xung đột import**:
   - Chỉ import từ `'../i18n'` thay vì các tệp con
   - Tránh import trùng lặp các hàm từ nhiều nguồn

## Ví dụ thực tế: Detail View và politic.js

### Detail View

Trang xem chi tiết sinh viên (`detail.hbs`) đã được hoàn toàn quốc tế hóa với tất cả chuỗi văn bản được thay thế bằng helper `{{t}}`:

```handlebars
<h2 class="text-2xl font-semibold text-gray-700">
  📘 {{t 'detail.pageTitle'}}
</h2>

<!-- Các nút -->
<button id="editBtn" class="...">
  {{t 'detail.buttons.edit'}}
</button>

<!-- Trường nhập liệu -->
<label>{{t 'detail.personalInfo.studentId'}}</label>
<input type="text" id="studentId" class="input-field" readonly />
```

### Tệp JS liên quan tới form (politic.js)

Tệp `politic.js` xử lý các tính năng của form đã được cập nhật để sử dụng i18n:

```javascript
// Global translations object
let t = key => key; // Default fallback function

document.addEventListener('DOMContentLoaded', async function() {
    // Load translations
    const lang = localStorage.getItem("lang") || 'en';
    const translationUrl = `/assets/scripts/locales/${lang}.json`;
    
    try {
        const res = await fetch(translationUrl);
        if (res.ok) {
            const translations = await res.json();
            // Create translation function
            t = key => {
                // Navigate through nested keys
                const parts = key.split('.');
                let value = translations;
                for (const part of parts) {
                    if (value && typeof value === 'object' && part in value) {
                        value = value[part];
                    } else {
                        return key; // Key not found
                    }
                }
                return value;
            };
            initializeForm();
        }
    } catch (error) {
        console.error("Error loading translations:", error);
    }
});
```

### Cấu trúc dữ liệu dịch cho Detail

Chi tiết cấu trúc JSON trong các tệp dịch cho trang detail:

```json
"detail": {
  "pageTitle": "Student Information",
  "buttons": {
    "edit": "Edit",
    "back": "Back"
  },
  "personalInfo": {
    "title": "Personal Information",
    "studentId": "Student ID",
    "fullName": "Full Name"
  },
  // ... các phần khác ...
}
```

## Server-Side Rendering (SSR) and i18n Integration

### Overview

The application uses a hybrid approach for rendering content:

1. **Server-Side Rendering (SSR)**: Initial HTML is rendered on the server with appropriate translations based on the user's language preference.
2. **Client-Side Enhancement**: After loading, client-side JavaScript enhances functionality and may update translations if the language is changed.

### How SSR Works with i18n

1. **Language Detection**: The Express middleware (`i18n/middleware.ts`) detects the user's language preference from:
   - URL query parameter (`?lang=en` or `?lang=vi`)
   - Browser cookies
   - Browser's Accept-Language header

2. **Template Rendering**: The detected language is passed to Handlebars templates via `res.locals.lang`, making it available as `{{lang}}` in templates.

3. **Translation Helper**: Templates use the `{{t "key.path"}}` helper to get translated text during server-side rendering.

4. **Data Passing**: When rendering templates that need dynamic data (like student details), the data is fetched from the database and passed to the template for rendering:

```typescript
// Example: Student detail page with SSR
router.get("/:id", async (req, res) => {
  try {
    const lang = res.locals.lang || 'en';
    const studentId = req.params.id;
    
    // Fetch student data from the database
    const student = await studentService.getStudentById(parseInt(studentId, 10));
    
    if (!student) {
      return res.status(404).render("error", { 
        message: lang === 'en' ? "Student not found" : "Không tìm thấy sinh viên",
        lang: lang 
      });
    }
    
    // Convert Sequelize model to plain object
    const studentData = student.get({ plain: true });
    
    // Render the template with data and language
    res.render("detail", { 
      id: studentId, 
      student: studentData, 
      lang: lang 
    });
  } catch (error) {
    // Error handling
  }
});
```

**Data Usage in Templates**: Templates access the data for SSR:

```handlebars
<input type="text" id="fullName" class="input-field" readonly value="{{student.full_name}}" />
```

### Bridging SSR and Client-Side JavaScript

For pages with dynamic content that's initially rendered on the server but may be updated on the client:

**Pass Server Data to Client**: Use the `json` Handlebars helper to make server data available to client JavaScript:

```handlebars
<script>
  // Make student data available to client-side JavaScript
  window.serverStudentData = {{{json student}}};
</script>
```

**Use Server Data When Available**: Client-side JavaScript should check for and use server-rendered data:

```javascript
// Check if we have server-side rendered data
const hasServerData = typeof window.serverStudentData !== 'undefined' && window.serverStudentData !== null;

if (hasServerData) {
  // Use the server data and only fetch supplemental information
  await fetchSupportingData();
} else {
  // If no server data, fetch everything from the API
  await fetchAndPopulateData();
}
```

### Best Practices

- **Avoid Re-Fetching Data**: If data is already provided by the server, client-side code should avoid re-fetching it unnecessarily.

- **Progressive Enhancement**: Design pages to work without JavaScript, using SSR as the foundation.

- **Consistent Naming**: Use the same translation keys in both server and client-side code.

- **Synchronize State**: When language changes on the client, update `localStorage` and cookies to maintain consistency.
