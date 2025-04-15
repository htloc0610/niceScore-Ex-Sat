# Student Management Program Version 3.0

## 1. Implementation Technologies  

The following technologies are used in this version:  

- **Frontend**: HTML, CSS, JavaScript, TailwindCSS  
- **Backend**: Node.js, Express, TypeScript  
- **Database**: PostgreSQL with Sequelize ORM  

## 2. Project Structure  

```
Student_Management/
├── .env              # Environment variables configuration
├── .gitignore        # Git ignore file
├── package.json      # Project dependencies and scripts
├── public/           # Static assets for the frontend
│   ├── assets/       # CSS, JavaScript, and other static files
│   │   ├── css/      # CSS files
│   │   ├── js/       # JavaScript files
│   │   └── scripts/  # Additional JavaScript scripts
│   ├── add.html      # Add student page
│   ├── detail.html   # Student detail page
│   ├── index.html    # Main frontend file
│   └── more.html     # Additional information page
├── src/              # Backend source code
│   ├── config/       # Database and logger configuration
│   ├── controllers/  # Handles business logic for students, courses, etc.
│   ├── models/       # Database models (Student, Faculty, Course, etc.)
│   ├── routes/       # API route definitions
│   ├── services/     # Service layer for handling data operations
│   ├── exports/      # JSON/Excel export files
│   ├── logs/         # Application logs
│   └── index.ts      # Entry point for the backend
├── tsconfig.json     # TypeScript configuration
├── vercel.json       # Deployment configuration for Vercel
└── README.md         # Project documentation
```

## 3. New Features in Version 3.0  

- **Improved UI/UX**: Enhanced frontend design with TailwindCSS for better responsiveness and usability.  
- **Advanced Search and Filters**: Search students by name, ID, faculty, or status with real-time filtering.  
- **Dynamic Status Management**: Added support for managing student status transitions with validation.  
- **Excel/JSON Import and Export**: Import/export student data in Excel or JSON format with error handling.  
- **Faculty and Course Management**: Added CRUD operations for faculties and courses.  
- **Validation Enhancements**: Improved email and phone number validation based on configurable rules.  
- **Error Logging**: Centralized error logging for better debugging and monitoring.  
- **Unique Student ID (MSSV)**: Student IDs must be unique. When adding or updating a student, the system ensures no duplicate MSSV exists.  
- **Configurable Email Domain Restriction**: Emails must belong to a specific domain, configurable dynamically (e.g., only `@student.university.edu.vn` is allowed).  
- **Configurable Phone Number Validation**: Phone numbers must follow a valid format based on the country, configurable dynamically (e.g., Vietnam: `+84` or `0[3|5|7|8|9]xxxxxxxx`).  
- **Configurable Student Status Rules**: Student status changes are restricted to predefined rules (e.g., `"Đang học"` can transition to `"Bảo lưu"`, `"Tốt nghiệp"`, or `"Đình chỉ"`, but `"Đã tốt nghiệp"` cannot revert to `"Đang học"`).  

## 4. Installation & Running the Application  

### 4.1. Install Dependencies  
Ensure you have **Node.js** installed. Then, install the required packages:  
```sh
npm install
```

### 4.2. Configure Environment Variables  
Create a `.env` file in the root directory with the following variables:  
```
PORT=3000
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_HOST=localhost
DB_PORT=5432
DB_DIALECT=postgres
```

### 4.3. Build & Run the Application  
To start the application, run:  
```sh
npm start
```

## 5. Screenshots
![Import JSON](screenshot/import_json.png)

![Import Excel](screenshot/import_excel.png)

![Export JSON](screenshot/export_json.png)

![Export Excel 1](screenshot/export_excel.png)

![Export Excel 2](screenshot/export_excel_2.png)

## 6. Deployment  
The application is deployed on Vercel. Access it at:  
[https://nice-score-ex-sat.vercel.app/](https://nice-score-ex-sat.vercel.app/)

## 7. License  
This project is licensed under the MIT License.

---

This README reflects the improvements and features of version 3.0 while maintaining a clear and professional structure.
