-- These are some Database Manipulation queries for a partially implemented Project
-- using the AU registration project database.
-- Your submission should contain ALL the queries required to implement ALL the
-- functionalities listed in the Project Specs

------------- Manage Classes Page --------------
-- To display classes table
SELECT * FROM classes;

-- To show classes based on class_name
SELECT * FROM classes
WHERE class_name LIKE :input_class_name;

-- To create a dynamic dropdown for instructors, departments, sections
SELECT * FROM instructors;
SELECT * FROM departments;
SELECT * FROM sections;

-- Insert value into classes --
INSERT INTO classes (class_id, class_code, class_name, department_id, capacity, instructor_id, section, year, quarter)
VALUES (:input_class_id, :input_class_code, :input_class_name, :input_class_department_id, :input_capacity, :input_instructor_id,
:input_class_section, :input_class_year, :input_class_quarter);

-- Update value in classes --
UPDATE classes
SET class_code = CASE WHEN :input_class_code <> '' THEN :input_class_code ELSE class_code END, 
class_name = CASE WHEN :input_class_name <> '' THEN :input_class_name ELSE class_name END, 
department_id = CASE WHEN :input_department_id <> '' THEN :input_department_id ELSE department_id END, 
capacity = CASE WHEN :input_class_capacity <> '' THEN :input_class_capacity ELSE capacity END, 
instructor_id = CASE WHEN :input_instructor_id <> '' THEN :input_instructor_id ELSE instructor_id END, 
section = CASE WHEN :input_class_section <> '' THEN :input_class_section ELSE section END, 
year = CASE WHEN :input_class_year <> '' THEN :input_class_year ELSE year END, 
quarter = CASE WHEN :input_class_quarter <> '' THEN :input_class_quarter ELSE quarter END 
WHERE class_id = :update_class_id

-- Delete value from classes --
DELETE FROM classes WHERE class_id = :delete_class_id;


------------- Manage Instructors Page --------------
-- Get info for instructors page --
SELECT * FROM instructors;

-- To show instructors based on last_name
SELECT * FROM instructors
WHERE last_name LIKE :input_last_name;

-- Insert value into instructors --
INSERT INTO instructors (instructor_id, first_name, last_name, email)
VALUES (:input_instructor_id, :input_first_name, :input_last_name, :input_email);

-- Update value in instructors --
UPDATE instructors
SET first_name = CASE WHEN :input_first_name <> '' THEN :input_first_name ELSE first_name END,
last_name = CASE WHEN :input_last_name <> '' THEN :input_last_name ELSE last_name END,
email = CASE WHEN :input_email <> '' THEN :input_email ELSE email END
WHERE instructor_id = :input_instructor_id

-- Delete value from instructors --
DELETE FROM instructors WHERE instructor_id = :input_instructor_id;


------------- Manage Students Page --------------
-- Get info for students page --
SELECT * FROM students;

-- To show students based on last_name
SELECT * FROM students
WHERE last_name LIKE :input_last_name;

-- Insert value into students --
INSERT INTO students (student_id, first_name, last_name, email)
VALUES (:input_student_id, :input_first_name, :input_last_name, :input_email);

-- Update value in students --
UPDATE students
SET first_name = CASE WHEN :input_first_name <> '' THEN :input_first_name ELSE first_name END,
last_name = CASE WHEN :input_last_name <> '' THEN :input_last_name ELSE last_name END,
email = CASE WHEN :input_email <> '' THEN :input_email ELSE email END,
pin = CASE WHEN :input_pin <> '' THEN :input_pin ELSE pin END
WHERE student_id = :input_student_id

-- Delete value from students --
DELETE FROM students WHERE student_id = :input_student_id;


------------- Manage Registrations Page --------------
--Get info for Registrations Page
SELECT * FROM registrations;

--Show registrations based on student's last name
SELECT registrations.registration_id, registrations.student_id, registrations.year, registrations.quarter 
FROM registrations 
INNER JOIN students ON registrations.student_id = students.student_id 
WHERE students.last_name LIKE :input_student_last_name;

--Show drop down for students--
SELECT * FROM students;

-- Query to insert classes to registration based on input
INSERT INTO registrations (
    student_id, year, quarter
) VALUES (
    :student_id_input, :year_input_from_dropdown, :quarter_input_from_dropdown
);

--Query to delete from Registrations--
DELETE FROM registrations WHERE registration_id = :input_registraion_id;

--Update registrations--
UPDATE registrations 
    SET year = CASE WHEN :input_year <> :input_year THEN ? ELSE year END,
    quarter = CASE WHEN :input_quarter <> '' THEN :input_quarter ELSE quarter END
    WHERE registrations.registration_id = :input_registraion_id;

------------- Manage Registration Details Page --------------
--Get info for Registrations Page
SELECT * FROM registration_details;

--Show registrations based on student's last name or registration_id, or both
SELECT registration_details.registration_details_id, registration_details.registration_id, registration_details.class_id 
        FROM registration_details 
        INNER JOIN registrations on registration_details.registration_id = registrations.registration_id 
        INNER JOIN students on registrations.student_id = students.student_id
        WHERE registration_details.registration_id LIKE COALESCE(:input_registration_id,registration_details.registration_id)
        AND students.last_name LIKE COALESCE(:input_student_last_name, students.last_name)

--Show drop down for classes and registrations
SELECT * FROM class;
SELECT * FROM registrations;

-- Query to insert classes to registration based on input
INSERT INTO registration_detailss (
    registration_details_id, registration_id, class_id
) VALUES (
    :input_registration_details_id, :input_registraion_id, :input_class_id
);

--Query to delete from Registrations--
DELETE FROM registration_details WHERE registration_details_id = :input_registraion_details_id;

--Update registrations--
UPDATE registrations_details
    SET registration_id = CASE WHEN :input_registration_id <> :input_registration_id THEN ? ELSE year END,
    class_id = CASE WHEN :input_class_id <> '' THEN :input_class_id ELSE class_id END
    WHERE registration_details.registration_details_id = :input_registraion_details_id;

------------- Manage Sections Page --------------
-- Get info for sections page --
SELECT * FROM sections;

-- Insert value into sections --
INSERT INTO sections (section, method)
VALUES (:input_section, :input_method);

-- Update value in sections --
UPDATE sections
SET method = :input_input_method
WHERE section = :input_dropdown_section;

-- Delete value from sections --
DELETE FROM sections WHERE section = :delete_section;

------------- Manage Deparments Page --------------
-- Get info for departments page --
SELECT * FROM departments;

-- Insert value into departments --
INSERT INTO deparments (department_id, department_name)
VALUES (:input_deparment_id, :input_department_name);

-- Update value in departments --
UPDATE departments
SET department_name = :input_department_name
WHERE department_id = :input_dropdown_department_id;

-- Delete value from departments --
DELETE FROM departments WHERE department_id = :delete_department_id;