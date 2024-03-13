-- Group 16: Team Two Guys - Hoang Son Nguyen, Andrew Creaton


-- disable commits
SET FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT = 0;


CREATE OR REPLACE TABLE departments (
    department_id VARCHAR(3) NOT NULL,
    department_name VARCHAR(55) NOT NULL,
    PRIMARY KEY(department_id),
    CONSTRAINT UC_department UNIQUE(department_id, department_name)
)ENGINE=InnoDB;


CREATE OR REPLACE TABLE instructors (
    instructor_id INT(9) NOT NULL,
    first_name VARCHAR(20) NOT NULL,
    last_name VARCHAR(20) NOT NULL,
    email VARCHAR(55) NOT NULL,
    PRIMARY KEY(instructor_id),
    CONSTRAINT UC_iemail UNIQUE(email)  
)ENGINE=InnoDB;


CREATE OR REPLACE TABLE sections (
    section INT NOT NULL,
    method VARCHAR(20) NOT NULL,
    PRIMARY KEY(section)
)ENGINE=InnoDB;


CREATE OR REPLACE TABLE classes (
    class_id INT(6) NOT NULL,
    class_code VARCHAR(6) NOT NULL,
    class_name VARCHAR(55) NOT NULL,
    department_id VARCHAR(3) NOT NULL,
    capacity INT(2) NOT NULL,
    instructor_id INT(9) NOT NULL,
    section INT NOT NULL,
    year INT(4) NOT NULL,
    quarter VARCHAR(6) NOT NULL,
    PRIMARY KEY (class_id),
    CONSTRAINT classes_ibfk_1 FOREIGN KEY (department_id) REFERENCES departments(department_id)
    ON DELETE NO ACTION ON UPDATE CASCADE,
    CONSTRAINT classes_ibfk_2 FOREIGN KEY (instructor_id) REFERENCES instructors(instructor_id)
    ON DELETE NO ACTION ON UPDATE CASCADE,
    CONSTRAINT classes_ibfk_3 FOREIGN KEY (section) REFERENCES sections(section)
    ON DELETE NO ACTION ON UPDATE CASCADE
)ENGINE=InnoDB;


CREATE OR REPLACE TABLE students (
    student_id INT(9) NOT NULL,
    first_name VARCHAR(20) NOT NULL,
    last_name VARCHAR(20) NOT NULL,
    email VARCHAR(55) NOT NULL,
    pin INT(9) NOT NULL,
    PRIMARY KEY(student_id),
    CONSTRAINT UC_semail UNIQUE(email),
    CONSTRAINT UC_pin UNIQUE(pin)
)ENGINE=InnoDB;


CREATE OR REPLACE TABLE registrations (
    registration_id INT(10) NOT NULL AUTO_INCREMENT,
    student_id INT(9) NOT NULL,
    year INT(4) NOT NULL,
    quarter VARCHAR(6) NOT NULL,
    PRIMARY KEY(registration_id),
    CONSTRAINT registrations_ibfk_1 FOREIGN KEY(student_id) REFERENCES students(student_id)
    ON DELETE CASCADE ON UPDATE CASCADE
)ENGINE=InnoDB;


CREATE OR REPLACE TABLE registration_details (
    registration_details_id INT(11) NOT NULL AUTO_INCREMENT,
    registration_id INT(10) NOT NULL,
    class_id INT(6) NOT NULL,
    PRIMARY KEY(registration_details_id),
    CONSTRAINT FK_registration_details_registrationid FOREIGN KEY (registration_id)
    REFERENCES registrations(registration_id)
    ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT FK_registration_details_classID FOREIGN KEY (class_id)
    REFERENCES classes(class_id)
    ON DELETE CASCADE ON UPDATE CASCADE
)ENGINE=InnoDB;

INSERT INTO departments (department_id, department_name)
VALUES
('BUS', 'Business'),
('EGR', 'Engineering'),
('LAW', 'Law');

INSERT INTO sections (section, method)
VALUES (1, 'Campus'),
(2, 'Campus'),
(3, 'Online'),
(4, 'Online');

INSERT INTO instructors (instructor_id, first_name, last_name, email)
VALUES
(118217041, 'John', 'Samosa', 'john.samosa@au.com'),
(103755182, 'Nance', 'Harland', 'nance.harland@au.com'),
(114990191, 'Elvina', 'Ursella', 'elvina.ursella@au.com'),
(101178686, 'Allan', 'Delacruz', 'allan.delacruz@au.com'),
(115338712, 'Celine', 'Navarro', 'celine.navarro@au.com'),
(117040050, 'Reid', 'Adams', 'reid.adams@au.com');

INSERT INTO classes (class_id, class_code, class_name, department_id, capacity, instructor_id, section, year, quarter)
VALUES
(127426, 'BUS101', 'Introduction to Business', 'BUS', 50, 101178686, 3, 2022, 'Summer'),
(147424, 'BUS203', 'Foreign Trade', 'BUS', 50, 101178686, 1, 2023, 'Winter'),
(117917, 'BUS101', 'Introduction to Business', 'BUS', 50, 101178686, 1, 2022, 'Fall'),
(143402, 'BUS203', 'Foreign Trade', 'BUS', 50, 101178686, 1, 2023, 'Spring'),
(117199, 'EGR101', 'Introduction to Engineering', 'EGR', 50, 114990191, 1, 2022, 'Fall'),
(114063, 'EGR250', 'Data structure', 'EGR', 50, 114990191, 1, 2023, 'Spring'),
(116300, 'EGR101', 'Introduction to Engineering', 'EGR', 50, 114990191, 3, 2022, 'Summer'),
(125153, 'EGR250', 'Data structure', 'EGR', 50, 114990191, 1, 2023, 'Winter'),
(119521, 'LAW101', 'Introduction to Law', 'LAW', 50, 114990191, 1, 2022, 'Fall'),
(141579, 'LAW130', 'Law ethics', 'LAW', 50, 114990191, 1, 2023, 'Winter'),
(131019, 'LAW240', 'Criminal Laws', 'LAW', 50, 114990191, 1, 2023, 'Spring'),
(104266, 'LAW101', 'Introduction to Law', 'LAW', 50, 114990191, 3, 2022, 'Summer');

INSERT INTO students (student_id, first_name, last_name, email, pin)
VALUES
(1, 'Jakobe', 'Crawford', 'jakobe.crawford@au.com', 346342576),
(2, 'Aubree', 'Espinosa', 'aubree.espinosa@au.com', 357323165),
(3, 'Khalid', 'Orozco', 'khalid.orozco@au.com', 321110278),
(4, 'Renata', 'Snow', 'renata.snow@au.com', 552107256),
(5, 'Houston', 'Esquivel', 'houston.esquivel@au.com', 670302253),
(6, 'Jaylee', 'Pope', 'jaylee.pope@au.com', 510491958),
(7, 'Gunnar', 'Webb', 'gunnar.webb@au.com', 489261975),
(8, 'Ariella', 'Richards', 'ariella.richards@au.com', 548208705),
(9, 'Holden', 'Stewart', 'holden.stewart@au.com', 530458796),
(10, 'Maya', 'Wilson', 'maya.wilson@au.com', 589300446),
(11, 'Daniel', 'Blankenship', 'daniel.blankenship@au.com', 784397265),
(12, 'Rosalee', 'Molina', 'rosalee.molina@au.com', 311149941),
(13, 'Prince', 'Church', 'prince.church@au.com', 823221542),
(14, 'Ayleen', 'Simmons', 'ayleen.simmons@au.com', 756396731),
(15, 'Harrison', 'Douglas', 'harrison.douglas@au.com', 785399448),
(16, 'Aniyah', 'McKinney', 'aniyah.mckinney@au.com', 609171777),
(17, 'Romeo', 'Short', 'romeo.short@au.com', 689264427),
(18, 'Cheyenne', 'Huff', 'cheyenne.huff@au.com', 237109328),
(19, 'Finnley', 'Glass', 'finnley.glass@au.com', 671372635),
(20, 'Clare', 'Atkins', 'clare.atkins@au.com', 186359728),
(21, 'Cason', 'Randall', 'cason.randall@au.com', 768454501),
(22, 'Christina', 'Norris', 'christina.norris@au.com', 802185738),
(23, 'Cairo', 'Hood', 'cairo.hood@au.com', 741421525),
(24, 'Briana', 'Dillon', 'briana.dillon@au.com', 845133471);


INSERT INTO registrations (
    registration_id, student_id, year, quarter
)
VALUES 
    (1, 1,  2023, 'Summer'),
    (2, 2,  2023, 'Summer'),
    (3, 3,  2023, 'Fall'),
    (4, 4,  2023, 'Winter')
;

INSERT INTO registration_details (
    registration_details_id, registration_id, class_id
)
VALUES 
    (1, 1,  127426),
    (2, 2,  147424),
    (3, 2,  117917),
    (4, 4,  143402),
    (5, 2,  117199),
    (6, 3,  114063),
    (7, 1,  116300),
    (8, 4,  125153),
    (9, 2,  119521),
    (10, 3,  141579);

SET FOREIGN_KEY_CHECKS=1;
COMMIT;
