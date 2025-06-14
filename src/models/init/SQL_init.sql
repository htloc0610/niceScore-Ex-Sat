-- Create the PostgreSQL database tables for niceScore-Ex-Sat project
-- Note: Execute these in order to satisfy foreign key dependencies

-- 1. addresses
CREATE TABLE addresses (
    address_id SERIAL PRIMARY KEY,
    house_number VARCHAR(255),
    street_name VARCHAR(255),
    ward VARCHAR(255),
    district VARCHAR(255),
    city VARCHAR(255),
    country VARCHAR(255)
);

-- 2. configurations
CREATE TABLE configurations (
    config_key VARCHAR(255) PRIMARY KEY,
    config_value TEXT NOT NULL
);

-- 3. courses
CREATE TABLE courses (
    course_id SERIAL PRIMARY KEY,
    course_name VARCHAR(255) NOT NULL UNIQUE
);

-- 4. faculties
CREATE TABLE faculties (
    faculty_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

-- 5. identifications
CREATE TABLE identifications (
    identification_id SERIAL PRIMARY KEY,
    type VARCHAR(8) CHECK (type IN ('CMND', 'CCCD', 'Passport')) NOT NULL,
    number VARCHAR(255) NOT NULL UNIQUE,
    issue_date DATE NOT NULL,
    expiry_date DATE,
    place_of_issue VARCHAR(255) NOT NULL,
    country_of_issue VARCHAR(255),
    has_chip BOOLEAN,
    notes TEXT
);

-- 6. status
CREATE TABLE status (
    status_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

-- 7. status_transitions
CREATE TABLE status_transitions (
    id SERIAL PRIMARY KEY,
    current_status INTEGER NOT NULL,
    new_status INTEGER NOT NULL,
    CONSTRAINT fk_current_status FOREIGN KEY (current_status) REFERENCES status (status_id),
    CONSTRAINT fk_new_status FOREIGN KEY (new_status) REFERENCES status (status_id)
);

-- 8. modules
CREATE TABLE modules (
    module_id SERIAL PRIMARY KEY,
    module_code VARCHAR(50) NOT NULL,
    module_name VARCHAR(255) NOT NULL,
    credits INTEGER NOT NULL CHECK (credits >= 2),
    faculty_id INTEGER NOT NULL,
    description TEXT,
    prerequisite_id INTEGER,
    is_active BOOLEAN DEFAULT TRUE,
    "createdAt" TIMESTAMP WITH TIME ZONE,
    "updatedAt" TIMESTAMP WITH TIME ZONE,
    CONSTRAINT fk_faculty_id FOREIGN KEY (faculty_id) REFERENCES faculties (faculty_id),
    CONSTRAINT fk_prerequisite_id FOREIGN KEY (prerequisite_id) REFERENCES modules (module_id)
);

-- 9. students
CREATE TABLE students (
    student_id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(10) CHECK (gender IN ('Nam', 'Nữ', 'Khác')) NOT NULL,
    faculty_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    program VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone_number VARCHAR(255) NOT NULL,
    status_id INTEGER NOT NULL,
    permanent_address_id INTEGER,
    temporary_address_id INTEGER,
    mailing_address_id INTEGER,
    identification_id INTEGER,
    nationality VARCHAR(255) NOT NULL,
    CONSTRAINT fk_faculty FOREIGN KEY (faculty_id) REFERENCES faculties (faculty_id),
    CONSTRAINT fk_course FOREIGN KEY (course_id) REFERENCES courses (course_id),
    CONSTRAINT fk_status FOREIGN KEY (status_id) REFERENCES status (status_id),
    CONSTRAINT fk_permanent_address FOREIGN KEY (permanent_address_id) REFERENCES addresses (address_id),
    CONSTRAINT fk_temporary_address FOREIGN KEY (temporary_address_id) REFERENCES addresses (address_id),
    CONSTRAINT fk_mailing_address FOREIGN KEY (mailing_address_id) REFERENCES addresses (address_id),
    CONSTRAINT fk_identification FOREIGN KEY (identification_id) REFERENCES identifications (identification_id)
);

-- 10. classes
CREATE TABLE classes (
    class_id SERIAL PRIMARY KEY,
    class_name VARCHAR(255) NOT NULL,
    module_id INTEGER NOT NULL,
    academic_year VARCHAR(10) NOT NULL,
    semester VARCHAR(10) NOT NULL,
    instructor VARCHAR(255) NOT NULL,
    max_students INTEGER CHECK (max_students >= 1),
    schedule TEXT NOT NULL,
    classroom VARCHAR(50) NOT NULL,
    CONSTRAINT fk_module FOREIGN KEY (module_id) REFERENCES modules (module_id)
);

-- 11. class_registrations
CREATE TABLE class_registrations (
    registration_id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL,
    class_id INTEGER NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE,
    "updatedAt" TIMESTAMP WITH TIME ZONE,
    CONSTRAINT fk_student FOREIGN KEY (student_id) REFERENCES students (student_id),
    CONSTRAINT fk_class FOREIGN KEY (class_id) REFERENCES classes (class_id),
    CONSTRAINT unique_class_registration UNIQUE (student_id, class_id)
);

-- 12. registration_cancellations
CREATE TABLE registration_cancellations (
    cancellation_id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL,
    class_id INTEGER NOT NULL,
    reason TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE,
    "updatedAt" TIMESTAMP WITH TIME ZONE,
    CONSTRAINT fk_student FOREIGN KEY (student_id) REFERENCES students (student_id),
    CONSTRAINT fk_class FOREIGN KEY (class_id) REFERENCES classes (class_id)
);

-- 13. transcripts
CREATE TABLE transcripts (
    transcript_id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL,
    class_id INTEGER NOT NULL,
    grade DECIMAL(4,2),
    CONSTRAINT fk_student FOREIGN KEY (student_id) REFERENCES students (student_id),
    CONSTRAINT fk_class FOREIGN KEY (class_id) REFERENCES classes (class_id),
    CONSTRAINT unique_transcript UNIQUE (student_id, class_id)
);

-- Create additional indexes
CREATE INDEX idx_student_faculty ON students (faculty_id);
CREATE INDEX idx_student_course ON students (course_id);
CREATE INDEX idx_student_status ON students (status_id);
CREATE INDEX idx_class_module ON classes (module_id);
CREATE INDEX idx_class_registrations_student ON class_registrations (student_id);
CREATE INDEX idx_class_registrations_class ON class_registrations (class_id);
CREATE INDEX idx_cancellations_student ON registration_cancellations (student_id);
CREATE INDEX idx_cancellations_class ON registration_cancellations (class_id);
CREATE INDEX idx_transcripts_student ON transcripts (student_id);
CREATE INDEX idx_transcripts_class ON transcripts (class_id);
CREATE INDEX idx_modules_faculty ON modules (faculty_id);
CREATE INDEX idx_modules_prerequisite ON modules (prerequisite_id);