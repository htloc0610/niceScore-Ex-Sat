-- -------------------------
-- Diverse data for niceScore-Ex-Sat
-- -------------------------

-- Insert addresses
INSERT INTO addresses (house_number, street_name, ward, district, city, country)
VALUES 
('12', 'Nguyen Van Cu', 'Ward 5', 'District 5', 'HCMC', 'Vietnam'),
('43', 'Tran Phu', 'Ward 6', 'District 10', 'HCMC', 'Vietnam'),
('78', 'Hoang Van Thu', 'Ward 2', 'District 3', 'HCMC', 'Vietnam'),
('90', 'Pham Van Dong', 'Ward 3', 'District 7', 'HCMC', 'Vietnam'),
('55', 'Le Duan', 'Ward 1', 'District 1', 'HCMC', 'Vietnam'),
('66', 'Ly Thuong Kiet', 'Ward 4', 'District 11', 'HCMC', 'Vietnam');

-- Insert configurations
INSERT INTO configurations (config_key, config_value)
VALUES 
('max_credits_per_semester', '20'),
('min_credits_per_semester', '12'),
('max_retakes', '3');

-- Insert courses
INSERT INTO courses (course_name)
VALUES 
('Computer Engineering'),
('Information Technology'),
('Cybersecurity'),
('Artificial Intelligence'),
('Business Analytics'),
('Economics');

-- Insert faculties
INSERT INTO faculties (name)
VALUES 
('Computer Science'),
('Information System'),
('Cyber Security'),
('AI Department'),
('Business Faculty');

-- Insert identifications
INSERT INTO identifications (type, number, issue_date, expiry_date, place_of_issue, country_of_issue, has_chip, notes)
VALUES 
('CCCD', '987654321000', '2016-05-10', '2036-05-10', 'Hanoi', 'Vietnam', true, ''),
('Passport', 'PA1234567', '2018-01-15', '2028-01-15', 'HCMC', 'Vietnam', false, ''),
('CCCD', '876543210999', '2017-08-12', '2037-08-12', 'Da Nang', 'Vietnam', true, ''),
('Passport', 'PB2345678', '2019-03-22', '2029-03-22', 'HCMC', 'Vietnam', false, ''),
('CCCD', '765432109888', '2018-07-10', '2038-07-10', 'Hue', 'Vietnam', true, ''),
('CCCD', '654321098777', '2020-10-01', '2040-10-01', 'Can Tho', 'Vietnam', true, ''),
('Passport', 'PC3456789', '2020-06-20', '2030-06-20', 'HCMC', 'Vietnam', false, ''),
('CCCD', '543210987666', '2021-04-15', '2041-04-15', 'HCMC', 'Vietnam', true, '');

-- Insert status
INSERT INTO status (name)
VALUES 
('Enrolled'),
('On Leave'),
('Graduated'),
('Suspended');

-- Insert status_transitions
INSERT INTO status_transitions (current_status, new_status)
VALUES 
(1, 2),
(1, 3),
(1, 4),
(2, 1),
(2, 3);

-- Insert modules
INSERT INTO modules (module_code, module_name, credits, faculty_id, description, is_active, "createdAt", "updatedAt")
VALUES 
('CE101', 'Computer Architecture', 3, 1, 'CPU, Memory, IO', true, NOW(), NOW()),
('IT102', 'Data Structures', 3, 2, 'List, Stack, Queue', true, NOW(), NOW()),
('CS301', 'Network Security', 3, 3, 'Security Basics', true, NOW(), NOW()),
('AI201', 'Deep Learning', 4, 4, 'CNN, RNN, GAN', true, NOW(), NOW()),
('BA301', 'Data Visualization', 3, 5, 'Power BI, Tableau', true, NOW(), NOW()),
('ECO101', 'Microeconomics', 3, 5, 'Supply & Demand', true, NOW(), NOW()),
('AI202', 'Natural Language Processing', 3, 4, 'NLP, Transformers', true, NOW(), NOW()),
('IT303', 'Distributed Systems', 3, 2, 'Cluster, Consensus', true, NOW(), NOW());

-- Insert students
INSERT INTO students (full_name, date_of_birth, gender, faculty_id, course_id, program, email, phone_number, status_id, permanent_address_id, temporary_address_id, mailing_address_id, identification_id, nationality)
VALUES 
('Pham Van Hoang', '2001-01-01', 'Nam', 1, 1, 'CE2025', 'hoang.pv@example.com', '0912345678', 1, 1, 1, 1, 1, 'Vietnam'),
('Tran Thi Mai', '2000-12-12', 'Nữ', 2, 2, 'IT2025', 'mai.tt@example.com', '0923456789', 1, 2, 2, 2, 2, 'Vietnam'),
('Nguyen Van Duy', '2002-02-02', 'Nam', 3, 3, 'CS2025', 'duy.nv@example.com', '0934567890', 1, 3, 3, 3, 3, 'Vietnam'),
('Le Thi Linh', '1999-03-03', 'Nữ', 4, 4, 'AI2025', 'linh.lt@example.com', '0945678901', 1, 4, 4, 4, 4, 'Vietnam'),
('Hoang Van Phuc', '2003-04-04', 'Nam', 5, 5, 'BA2025', 'phuc.hv@example.com', '0956789012', 1, 5, 5, 5, 5, 'Vietnam'),
('Dang Thi Hue', '2001-05-05', 'Nữ', 5, 6, 'ECO2025', 'hue.dt@example.com', '0967890123', 1, 6, 6, 6, 6, 'Vietnam'),
('Bui Van Khanh', '2000-06-06', 'Nam', 2, 2, 'IT2025', 'khanh.bv@example.com', '0978901234', 1, 1, 2, 3, 7, 'Vietnam'),
('Vo Thi Trang', '1998-07-07', 'Nữ', 4, 4, 'AI2025', 'trang.vt@example.com', '0989012345', 1, 3, 5, 2, 8, 'Vietnam');

-- Insert classes
INSERT INTO classes (class_name, module_id, academic_year, semester, instructor, max_students, schedule, classroom)
VALUES 
('CE101-A', 1, '2024', 'Fall', 'Dr. Pham', 60, 'Mon 8-10', 'A101'),
('IT102-B', 2, '2024', 'Spring', 'Dr. Tran', 50, 'Tue 10-12', 'B202'),
('CS301-C', 3, '2024', 'Fall', 'Dr. Nguyen', 45, 'Wed 8-10', 'C303'),
('AI201-D', 4, '2024', 'Spring', 'Dr. Le', 50, 'Thu 10-12', 'D404'),
('BA301-E', 5, '2024', 'Fall', 'Dr. Hoang', 55, 'Fri 8-10', 'E505'),
('ECO101-F', 6, '2024', 'Spring', 'Dr. Vo', 40, 'Sat 10-12', 'F606'),
('AI202-G', 7, '2024', 'Fall', 'Dr. Dao', 50, 'Sun 8-10', 'G707'),
('IT303-H', 8, '2024', 'Spring', 'Dr. Phan', 50, 'Mon 10-12', 'H808');

-- Insert class_registrations
INSERT INTO class_registrations (student_id, class_id, "createdAt", "updatedAt")
VALUES 
(1, 1, NOW(), NOW()),
(2, 2, NOW(), NOW()),
(3, 3, NOW(), NOW()),
(4, 4, NOW(), NOW()),
(5, 5, NOW(), NOW()),
(6, 6, NOW(), NOW()),
(7, 7, NOW(), NOW()),
(8, 8, NOW(), NOW()),
(1, 2, NOW(), NOW()),
(2, 3, NOW(), NOW()),
(3, 4, NOW(), NOW()),
(4, 5, NOW(), NOW()),
(5, 6, NOW(), NOW()),
(6, 7, NOW(), NOW()),
(7, 8, NOW(), NOW()),
(8, 1, NOW(), NOW());

-- Insert transcripts (grades)
INSERT INTO transcripts (student_id, class_id, grade)
VALUES 
(1, 1, 8.5),
(2, 2, 7.0),
(3, 3, 9.0),
(4, 4, 8.8),
(5, 5, 7.5),
(6, 6, 6.5),
(7, 7, 9.2),
(8, 8, 8.0),
(1, 2, 8.0),
(2, 3, 7.8),
(3, 4, 8.9),
(4, 5, 7.3),
(5, 6, 6.8),
(6, 7, 9.5),
(7, 8, 8.2),
(8, 1, 7.9);
