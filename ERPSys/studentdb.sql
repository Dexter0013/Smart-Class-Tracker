-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 30, 2025 at 07:40 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `studentdb`
--

-- --------------------------------------------------------

--
-- Table structure for table `assessments`
--

CREATE TABLE `assessments` (
  `AssessmentID` int(11) NOT NULL,
  `ClassID` int(11) NOT NULL,
  `AssessmentName` varchar(100) NOT NULL,
  `MaxMarks` decimal(5,2) NOT NULL CHECK (`MaxMarks` > 0),
  `AssessmentDate` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `assessments`
--

INSERT INTO `assessments` (`AssessmentID`, `ClassID`, `AssessmentName`, `MaxMarks`, `AssessmentDate`) VALUES
(1, 1, 'Midterm Exam', 100.00, '2025-10-01'),
(2, 2, 'Final Exam', 100.00, '2025-12-10'),
(3, 3, 'Project Presentation', 50.00, '2026-04-15');

-- --------------------------------------------------------

--
-- Table structure for table `classes`
--

CREATE TABLE `classes` (
  `ClassID` int(11) NOT NULL,
  `CourseID` int(11) NOT NULL,
  `InstructorID` int(11) NOT NULL,
  `SemesterID` int(11) NOT NULL,
  `Location` varchar(50) DEFAULT NULL,
  `Schedule` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `classes`
--

INSERT INTO `classes` (`ClassID`, `CourseID`, `InstructorID`, `SemesterID`, `Location`, `Schedule`) VALUES
(1, 1, 1, 1, 'Room CS101', 'Mon-Wed 10:00-11:30'),
(2, 2, 2, 1, 'Room M201', 'Tue-Thu 09:00-10:30'),
(3, 3, 3, 1, 'Room C301', 'Mon-Wed 14:00-15:30'),
(4, 4, 4, 1, 'Innovation Building - Room 103', 'Monday-Tuesday-Wednesday-Thursday, 11:00-12:30 AM'),
(5, 5, 5, 1, 'Innovation Building - Room 148', 'Tuesday-Thursday-Saturday, 14:00-15:30 AM'),
(6, 6, 6, 1, 'Science Building - Room 104', 'Monday-Wednesday-Friday, 18:30-20:00 AM'),
(7, 7, 7, 1, 'Engineering Building - Room 125', 'Monday-Tuesday-Wednesday-Thursday, 11:00-12:30 AM'),
(8, 8, 4, 1, 'Central Building - Room 115', 'Tuesday-Thursday, 09:30-11:00 AM'),
(9, 9, 3, 1, 'Academic Building - Room 135', 'Monday-Wednesday-Friday, 15:30-17:00 AM'),
(10, 10, 2, 1, 'Engineering Building - Room 129', 'Tuesday-Thursday, 08:00-09:30 AM'),
(11, 11, 8, 1, 'Science Building - Room 141', 'Monday-Tuesday-Wednesday-Thursday, 09:30-11:00 AM'),
(12, 12, 9, 1, 'Technology Building - Room 130', 'Wednesday-Friday, 12:30-14:00 AM'),
(13, 13, 10, 1, 'Admin Building - Room 105', 'Monday-Wednesday, 14:00-15:30 AM'),
(14, 14, 8, 1, 'Research Building - Room 146', 'Tuesday-Thursday-Saturday, 11:00-12:30 AM'),
(15, 15, 9, 1, 'Central Building - Room 118', 'Monday-Friday, 08:00-09:30 AM'),
(16, 16, 10, 1, 'Innovation Building - Room 121', 'Monday-Tuesday-Thursday, 10:00-11:30 AM'),
(17, 17, 11, 1, 'Engineering Building - Room 132', 'Wednesday-Friday, 17:00-18:30 AM'),
(18, 18, 12, 1, 'Science Building - Room 102', 'Tuesday-Thursday, 14:00-15:30 AM'),
(19, 19, 13, 1, 'Academic Building - Room 138', 'Monday-Tuesday-Wednesday-Thursday, 15:30-17:00 AM'),
(20, 20, 8, 1, 'Technology Building - Room 133', 'Friday-Saturday, 18:30-20:00 AM'),
(21, 21, 20, 1, 'Research Building - Room 147', 'Monday-Wednesday-Friday, 08:30-10:00 AM'),
(22, 22, 21, 1, 'Central Building - Room 120', 'Tuesday-Thursday, 17:00-18:30 AM'),
(23, 23, 22, 1, 'Admin Building - Room 110', 'Monday-Friday, 11:00-12:30 AM'),
(24, 24, 23, 1, 'Engineering Building - Room 127', 'Monday-Tuesday-Wednesday-Thursday, 08:00-09:30 AM'),
(25, 25, 24, 1, 'Science Building - Room 145', 'Wednesday-Friday, 10:00-11:30 AM');

-- --------------------------------------------------------

--
-- Table structure for table `courses`
--

CREATE TABLE `courses` (
  `CourseID` int(11) NOT NULL,
  `CourseCode` varchar(15) NOT NULL,
  `CourseName` varchar(100) NOT NULL,
  `Credits` int(11) NOT NULL CHECK (`Credits` > 0),
  `DepartmentID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `courses`
--

INSERT INTO `courses` (`CourseID`, `CourseCode`, `CourseName`, `Credits`, `DepartmentID`) VALUES
(1, 'CS101', 'Intro to Programming', 4, 1),
(2, 'CS102', 'Data Structures', 3, 1),
(3, 'CS103', 'Database Systems', 4, 1),
(4, 'CS104', 'Web Technologies', 3, 1),
(5, 'CS105', 'Object-Oriented Programming', 4, 1),
(6, 'CS106', 'Algorithms', 4, 1),
(7, 'CS107', 'Operating Systems', 4, 1),
(8, 'CS108', 'Computer Networks', 4, 1),
(9, 'CS109', 'Software Engineering', 3, 1),
(10, 'CS110', 'Artificial Intelligence', 4, 1),
(11, 'CE101', 'Engineering Mechanics', 4, 2),
(12, 'CE102', 'Structural Analysis', 4, 2),
(13, 'CE103', 'Concrete Technology', 3, 2),
(14, 'CE104', 'Geotechnical Engineering', 4, 2),
(15, 'CE105', 'Hydraulics and Fluid Mechanics', 4, 2),
(16, 'CE106', 'Highway Engineering', 3, 2),
(17, 'CE107', 'Building Construction', 3, 2),
(18, 'CE108', 'Surveying', 4, 2),
(19, 'CE109', 'Water Resources Engineering', 4, 2),
(20, 'CE110', 'Structural Design', 4, 2),
(21, 'ME101', 'Engineering Thermodynamics', 4, 3),
(22, 'ME102', 'Mechanics of Materials', 4, 3),
(23, 'ME103', 'Fluid Mechanics', 4, 3),
(24, 'ME104', 'Heat Transfer', 4, 3),
(25, 'ME105', 'Machine Design', 4, 3),
(26, 'ME106', 'Manufacturing Technology', 3, 3),
(27, 'ME107', 'Thermal Engineering', 4, 3),
(28, 'ME108', 'Control Systems', 4, 3),
(29, 'ME109', 'Computational Methods', 3, 3),
(30, 'ME110', 'Mechanical Vibrations', 4, 3),
(31, 'ET101', 'Circuit Theory', 4, 4),
(32, 'ET102', 'Digital Electronics', 4, 4),
(33, 'ET103', 'Signals and Systems', 4, 4),
(34, 'ET104', 'Electromagnetic Theory', 4, 4),
(35, 'ET105', 'Microprocessors', 4, 4),
(36, 'ET106', 'Communication Systems', 4, 4),
(37, 'ET107', 'Power Electronics', 3, 4),
(38, 'ET108', 'Microwave Engineering', 4, 4),
(39, 'ET109', 'Antenna Theory', 3, 4),
(40, 'ET110', 'Digital Signal Processing', 4, 4);

-- --------------------------------------------------------

--
-- Table structure for table `departments`
--

CREATE TABLE `departments` (
  `DepartmentID` int(11) NOT NULL,
  `DepartmentName` varchar(100) NOT NULL,
  `HOD_InstructorID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `departments`
--

INSERT INTO `departments` (`DepartmentID`, `DepartmentName`, `HOD_InstructorID`) VALUES
(1, 'CSE', 5),
(2, 'Civil', 9),
(3, 'ETE', 18),
(4, 'Mecha', 24);

-- --------------------------------------------------------

--
-- Table structure for table `enrollments`
--

CREATE TABLE `enrollments` (
  `EnrollmentID` int(11) NOT NULL,
  `StudentID` int(11) NOT NULL,
  `ClassID` int(11) NOT NULL,
  `EnrollmentDate` date NOT NULL,
  `FinalGrade` varchar(5) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `enrollments`
--

INSERT INTO `enrollments` (`EnrollmentID`, `StudentID`, `ClassID`, `EnrollmentDate`, `FinalGrade`) VALUES
(2, 2, 2, '2023-08-01', 'A-'),
(3, 3, 3, '2023-08-01', 'B+'),
(4, 4, 4, '2023-08-01', 'A'),
(5, 5, 5, '2023-08-01', 'B'),
(6, 6, 6, '2023-08-01', 'B+'),
(7, 7, 7, '2023-08-01', 'A-'),
(8, 8, 8, '2023-08-01', 'B+'),
(9, 9, 9, '2023-08-01', 'B'),
(10, 10, 10, '2023-08-01', 'A'),
(11, 11, 11, '2023-08-01', 'A'),
(12, 12, 12, '2023-08-01', 'B+'),
(13, 13, 13, '2023-08-01', 'B'),
(14, 14, 14, '2023-08-01', 'A-'),
(15, 15, 15, '2023-08-01', 'A'),
(16, 16, 16, '2023-08-01', 'B+'),
(17, 17, 17, '2023-08-01', 'B'),
(18, 18, 18, '2023-08-01', 'A-'),
(19, 19, 19, '2023-08-01', 'B+'),
(20, 20, 20, '2023-08-01', 'A'),
(21, 21, 21, '2023-08-01', 'A'),
(22, 22, 22, '2023-08-01', 'B+'),
(23, 23, 23, '2023-08-01', 'A-'),
(24, 24, 24, '2023-08-01', 'B'),
(25, 25, 25, '2023-08-01', 'A');

-- --------------------------------------------------------

--
-- Table structure for table `instructors`
--

CREATE TABLE `instructors` (
  `InstructorID` int(11) NOT NULL,
  `InstructorName` varchar(50) NOT NULL,
  `Email` varchar(100) NOT NULL,
  `PhoneNumber` varchar(20) DEFAULT NULL,
  `DepartmentID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `instructors`
--

INSERT INTO `instructors` (`InstructorID`, `InstructorName`, `Email`, `PhoneNumber`, `DepartmentID`) VALUES
(1, 'Alice Johnson', 'alice.johnson@univ.edu', '1234567890', 1),
(2, 'Bob Smith', 'bob.smith@univ.edu', '1234567891', 2),
(3, 'Carol Lee', 'carol.lee@univ.edu', '1234567892', 3),
(4, 'Prof. Priya Nair', 'priya.nair@college.edu', '9970621012', 1),
(5, 'Dr. Sanjay Singh', 'sanjay.singh@college.edu', '9862277938', 1),
(6, 'Prof. Neha Kumar', 'neha.kumar@college.edu', '9817009106', 1),
(7, 'Dr. Arun Gupta', 'arun.gupta@college.edu', '9915952451', 1),
(8, 'Prof. Divya Patel', 'divya.patel@college.edu', '9867293131', 2),
(9, 'Dr. Rohit Reddy', 'rohit.reddy@college.edu', '9823456789', 2),
(10, 'Prof. Kavya Iyer', 'kavya.iyer@college.edu', '9834567890', 2),
(11, 'Dr. Manish Joshi', 'manish.joshi@college.edu', '9945678901', 2),
(12, 'Prof. Ananya Verma', 'ananya.verma@college.edu', '9856789012', 2),
(13, 'Dr. Suresh Pillai', 'suresh.pillai@college.edu', '9867890123', 2),
(14, 'Prof. Tanvi Rao', 'tanvi.rao@college.edu', '9878901234', 3),
(15, 'Dr. Deepak Mehta', 'deepak.mehta@college.edu', '9889012345', 3),
(16, 'Prof. Nisha Desai', 'nisha.desai@college.edu', '9890123456', 3),
(17, 'Dr. Rahul Bose', 'rahul.bose@college.edu', '9901234567', 3),
(18, 'Prof. Meera Bhatt', 'meera.bhatt@college.edu', '9812345678', 3),
(19, 'Dr. Nikhil Nanda', 'nikhil.nanda@college.edu', '9823456789', 3),
(20, 'Prof. Shreya Saxena', 'shreya.saxena@college.edu', '9834567890', 4),
(21, 'Dr. Ashok Malhotra', 'ashok.malhotra@college.edu', '9945678901', 4),
(22, 'Prof. Pallavi Ghosh', 'pallavi.ghosh@college.edu', '9856789012', 4),
(23, 'Dr. Ravi Mishra', 'ravi.mishra@college.edu', '9867890123', 4),
(24, 'Prof. Simran Pandey', 'simran.pandey@college.edu', '9878901234', 4),
(25, 'Dr. Ajay Kapoor', 'ajay.kapoor@college.edu', '9889012345', 4);

-- --------------------------------------------------------

--
-- Table structure for table `instructorusers`
--

CREATE TABLE `instructorusers` (
  `UserID` int(11) NOT NULL,
  `InstructorID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `instructorusers`
--

INSERT INTO `instructorusers` (`UserID`, `InstructorID`) VALUES
(2, 1);

-- --------------------------------------------------------

--
-- Table structure for table `semesters`
--

CREATE TABLE `semesters` (
  `SemesterID` int(11) NOT NULL,
  `SemesterName` varchar(50) NOT NULL,
  `StartDate` date NOT NULL,
  `EndDate` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `semesters`
--

INSERT INTO `semesters` (`SemesterID`, `SemesterName`, `StartDate`, `EndDate`) VALUES
(1, 'Spring2023', '2023-01-15', '2023-05-15'),
(2, 'Summer2023', '2023-06-06', '2026-07-20'),
(3, 'Fall 2023', '2023-08-01', '2023-12-15'),
(4, 'Winter 2023', '2023-12-16', '2024-02-28'),
(5, 'Spring 2024', '2024-01-15', '2024-05-20'),
(6, 'Summer 2024', '2024-06-01', '2024-07-30'),
(7, 'Fall 2024', '2024-08-01', '2024-12-15'),
(8, 'Winter 2024', '2024-12-16', '2025-02-28');

-- --------------------------------------------------------

--
-- Table structure for table `studentmarks`
--

CREATE TABLE `studentmarks` (
  `MarkID` int(11) NOT NULL,
  `StudentID` int(11) NOT NULL,
  `AssessmentID` int(11) NOT NULL,
  `MarksObtained` decimal(5,2) NOT NULL CHECK (`MarksObtained` >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `studentmarks`
--

INSERT INTO `studentmarks` (`MarkID`, `StudentID`, `AssessmentID`, `MarksObtained`) VALUES
(4, 2, 1, 9.00),
(5, 2, 2, 44.00),
(6, 2, 3, 88.00),
(7, 3, 1, 18.00),
(8, 3, 2, 42.00),
(9, 3, 3, 85.00),
(10, 4, 1, 10.00),
(11, 4, 2, 48.00),
(12, 4, 3, 95.00);

-- --------------------------------------------------------

--
-- Table structure for table `students`
--

CREATE TABLE `students` (
  `StudentID` int(11) NOT NULL,
  `Name` varchar(50) NOT NULL,
  `DateOfBirth` date DEFAULT NULL,
  `Email` varchar(100) NOT NULL,
  `PhoneNumber` varchar(20) DEFAULT NULL,
  `EnrollmentDate` date NOT NULL,
  `Major_DepartmentID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `students`
--

INSERT INTO `students` (`StudentID`, `Name`, `DateOfBirth`, `Email`, `PhoneNumber`, `EnrollmentDate`, `Major_DepartmentID`) VALUES
(2, 'Eva Brown', '2001-11-22', 'eva.brown@univ.edu', '9876543211', '2021-08-01', 2),
(3, 'Frank Wilson', '2003-01-10', 'frank.wilson@univ.edu', '9876543212', '2023-01-10', 3),
(4, 'Sneha Gupta', '2005-09-18', 'sneha.gupta@student.college.edu', '9990000004', '2023-08-01', 1),
(5, 'Vikram Patel', '2005-04-25', 'vikram.patel@student.college.edu', '9990000005', '2023-08-01', 1),
(6, 'Anjali Das', '2005-11-30', 'anjali.das@student.college.edu', '9990000006', '2023-08-01', 1),
(7, 'Rajesh Kumar', '2005-01-12', 'rajesh.kumar@student.college.edu', '9990000007', '2023-08-01', 1),
(8, 'Pooja Singh', '2005-08-14', 'pooja.singh@student.college.edu', '9990000008', '2023-08-01', 1),
(9, 'Arjun Reddy', '2005-06-20', 'arjun.reddy@student.college.edu', '9990000009', '2023-08-01', 1),
(10, 'Kavya Iyer', '2005-02-28', 'kavya.iyer@student.college.edu', '9990000010', '2023-08-01', 1),
(11, 'Sanjay Joshi', '2005-10-05', 'sanjay.joshi@student.college.edu', '9990000011', '2023-08-01', 2),
(12, 'Neha Verma', '2005-12-15', 'neha.verma@student.college.edu', '9990000012', '2023-08-01', 2),
(13, 'Karan Pillai', '2005-03-22', 'karan.pillai@student.college.edu', '9990000013', '2023-08-01', 2),
(14, 'Divya Rao', '2005-07-08', 'divya.rao@student.college.edu', '9990000014', '2023-08-01', 2),
(15, 'Arun Mehta', '2005-05-19', 'arun.mehta@student.college.edu', '9990000015', '2023-08-01', 2),
(16, 'Riya Desai', '2005-09-09', 'riya.desai@student.college.edu', '9990000016', '2023-08-01', 2),
(17, 'Rahul Bose', '2005-04-11', 'rahul.bose@student.college.edu', '9990000017', '2023-08-01', 2),
(18, 'Meera Bhatt', '2005-08-25', 'meera.bhatt@student.college.edu', '9990000018', '2023-08-01', 2),
(19, 'Nikhil Nanda', '2005-06-03', 'nikhil.nanda@student.college.edu', '9990000019', '2023-08-01', 2),
(20, 'Shreya Saxena', '2005-10-17', 'shreya.saxena@student.college.edu', '9990000020', '2023-08-01', 2),
(21, 'Manish Malhotra', '2005-02-14', 'manish.malhotra@student.college.edu', '9990000021', '2023-08-01', 3),
(22, 'Ananya Ghosh', '2005-11-21', 'ananya.ghosh@student.college.edu', '9990000022', '2023-08-01', 3),
(23, 'Suresh Mishra', '2005-07-29', 'suresh.mishra@student.college.edu', '9990000023', '2023-08-01', 3),
(24, 'Tanvi Pandey', '2005-04-06', 'tanvi.pandey@student.college.edu', '9990000024', '2023-08-01', 3),
(25, 'Deepak Kapoor', '2005-09-13', 'deepak.kapoor@student.college.edu', '9990000025', '2023-08-01', 3),
(26, 'Nisha Chopra', '2005-01-27', 'nisha.chopra@student.college.edu', '9990000026', '2023-08-01', 3),
(27, 'Vijay Bhatia', '2005-08-08', 'vijay.bhatia@student.college.edu', '9990000027', '2023-08-01', 3),
(28, 'Sakshi Agarwal', '2005-05-15', 'sakshi.agarwal@student.college.edu', '9990000028', '2023-08-01', 3),
(29, 'Aditya Jain', '2005-10-20', 'aditya.jain@student.college.edu', '9990000029', '2023-08-01', 3),
(30, 'Swati Shah', '2005-03-12', 'swati.shah@student.college.edu', '9990000030', '2023-08-01', 3),
(31, 'Ashok Banerjee', '2005-06-24', 'ashok.banerjee@student.college.edu', '9990000031', '2023-08-01', 4),
(32, 'Pallavi Chatterjee', '2005-09-30', 'pallavi.chatterjee@student.college.edu', '9990000032', '2023-08-01', 4),
(33, 'Ravi Mukherjee', '2005-02-07', 'ravi.mukherjee@student.college.edu', '9990000033', '2023-08-01', 4),
(34, 'Simran Sinha', '2005-11-19', 'simran.sinha@student.college.edu', '9990000034', '2023-08-01', 4),
(35, 'Ajay Thakur', '2005-04-28', 'ajay.thakur@student.college.edu', '9990000035', '2023-08-01', 4),
(36, 'Kritika Kulkarni', '2005-07-05', 'kritika.kulkarni@student.college.edu', '9990000036', '2023-08-01', 4),
(37, 'Mohan Deshpande', '2005-01-16', 'mohan.deshpande@student.college.edu', '9990000037', '2023-08-01', 4),
(38, 'Isha Patil', '2005-08-22', 'isha.patil@student.college.edu', '9990000038', '2023-08-01', 4),
(39, 'Gaurav Naik', '2005-05-10', 'gaurav.naik@student.college.edu', '9990000039', '2023-08-01', 4),
(40, 'Preeti Hegde', '2005-10-02', 'preeti.hegde@student.college.edu', '9990000040', '2023-08-01', 4),
(41, 'Aarav Sharma', '2002-03-11', 'aarav.sharma@college.edu', '+91-9810001001', '2021-08-01', 1),
(42, 'Isha Patel', '2003-04-15', 'isha.patel@college.edu', '+91-9810001002', '2021-08-01', 2),
(43, 'Kunal Das', '2001-06-20', 'kunal.das@college.edu', '+91-9810001003', '2020-07-25', 3),
(44, 'Tanya Gupta', '2002-09-02', 'tanya.gupta@college.edu', '+91-9810001004', '2021-08-01', 1),
(45, 'Vivek Nair', '2001-07-17', 'vivek.nair@college.edu', '+91-9810001005', '2020-07-25', 2),
(46, 'Divya Menon', '2002-12-08', 'divya.menon@college.edu', '+91-9810001006', '2021-08-01', 3),
(47, 'Rohit Agarwal', '2003-01-25', 'rohit.agarwal@college.edu', '+91-9810001007', '2022-07-30', 1),
(48, 'Simran Kaur', '2002-10-10', 'simran.kaur@college.edu', '+91-9810001008', '2021-08-01', 2),
(49, 'Aditya Rao', '2001-09-14', 'aditya.rao@college.edu', '+91-9810001009', '2020-07-25', 3),
(50, 'Pallavi Joshi', '2003-03-21', 'pallavi.joshi@college.edu', '+91-9810001010', '2022-07-30', 1),
(51, 'Mohit Singh', '2002-01-10', 'mohit.singh@college.edu', '+91-9810001011', '2021-08-01', 1),
(52, 'Sneha Iyer', '2003-02-16', 'sneha.iyer@college.edu', '+91-9810001012', '2021-08-01', 2),
(53, 'Arun Prasad', '2001-05-05', 'arun.prasad@college.edu', '+91-9810001013', '2020-07-25', 3),
(54, 'Rekha Sinha', '2002-08-23', 'rekha.sinha@college.edu', '+91-9810001014', '2021-08-01', 1),
(55, 'Dev Mehta', '2001-07-18', 'dev.mehta@college.edu', '+91-9810001015', '2020-07-25', 2),
(56, 'Priya Das', '2002-11-01', 'priya.das@college.edu', '+91-9810001016', '2021-08-01', 3),
(57, 'Nitin Yadav', '2003-01-12', 'nitin.yadav@college.edu', '+91-9810001017', '2022-07-30', 1),
(58, 'Aditi Rao', '2002-07-09', 'aditi.rao@college.edu', '+91-9810001018', '2021-08-01', 2),
(59, 'Sandeep Roy', '2001-09-24', 'sandeep.roy@college.edu', '+91-9810001019', '2020-07-25', 3),
(60, 'Kritika Jain', '2003-05-22', 'kritika.jain@college.edu', '+91-9810001020', '2022-07-30', 1),
(61, 'Ankit Verma', '2002-02-03', 'ankit.verma@college.edu', '+91-9810001021', '2021-08-01', 1),
(62, 'Riya Ghosh', '2003-06-11', 'riya.ghosh@college.edu', '+91-9810001022', '2021-08-01', 2),
(63, 'Harsh Patel', '2001-08-15', 'harsh.patel@college.edu', '+91-9810001023', '2020-07-25', 3),
(64, 'Meena Rani', '2002-09-30', 'meena.rani@college.edu', '+91-9810001024', '2021-08-01', 1),
(65, 'Abhishek Sen', '2001-07-10', 'abhishek.sen@college.edu', '+91-9810001025', '2020-07-25', 2),
(66, 'Rachna Pillai', '2002-12-20', 'rachna.pillai@college.edu', '+91-9810001026', '2021-08-01', 3),
(67, 'Deepak Mishra', '2003-02-14', 'deepak.mishra@college.edu', '+91-9810001027', '2022-07-30', 1),
(68, 'Neelam Thakur', '2002-04-08', 'neelam.thakur@college.edu', '+91-9810001028', '2021-08-01', 2),
(69, 'Rajiv Bhatia', '2001-09-29', 'rajiv.bhatia@college.edu', '+91-9810001029', '2020-07-25', 3),
(70, 'Tara Nanda', '2003-05-17', 'tara.nanda@college.edu', '+91-9810001030', '2022-07-30', 1),
(71, 'Anjali Sharma', '2002-07-07', 'anjali.sharma@college.edu', '+91-9810001031', '2021-08-01', 1),
(72, 'Varun Singh', '2003-03-12', 'varun.singh@college.edu', '+91-9810001032', '2021-08-01', 2),
(73, 'Snehal Patil', '2001-06-23', 'snehal.patil@college.edu', '+91-9810001033', '2020-07-25', 3),
(74, 'Pooja Das', '2002-08-28', 'pooja.das@college.edu', '+91-9810001034', '2021-08-01', 1),
(75, 'Vikas Sharma', '2001-09-10', 'vikas.sharma@college.edu', '+91-9810001035', '2020-07-25', 2),
(76, 'Aarushi Menon', '2002-10-22', 'aarushi.menon@college.edu', '+91-9810001036', '2021-08-01', 3),
(77, 'Amitabh Roy', '2003-02-05', 'amitabh.roy@college.edu', '+91-9810001037', '2022-07-30', 1),
(78, 'Shivani Jain', '2002-03-20', 'shivani.jain@college.edu', '+91-9810001038', '2021-08-01', 2),
(79, 'Chirag Joshi', '2001-12-12', 'chirag.joshi@college.edu', '+91-9810001039', '2020-07-25', 3),
(80, 'Ritika Mehra', '2003-06-18', 'ritika.mehra@college.edu', '+91-9810001040', '2022-07-30', 1),
(81, 'Rohan Kapoor', '2002-01-28', 'rohan.kapoor@college.edu', '+91-9810001041', '2021-08-01', 1),
(82, 'Sonal Gupta', '2003-02-15', 'sonal.gupta@college.edu', '+91-9810001042', '2021-08-01', 2),
(83, 'Manoj Nair', '2001-08-09', 'manoj.nair@college.edu', '+91-9810001043', '2020-07-25', 3),
(84, 'Pallavi Roy', '2002-10-03', 'pallavi.roy@college.edu', '+91-9810001044', '2021-08-01', 1),
(85, 'Rajat Das', '2001-09-16', 'rajat.das@college.edu', '+91-9810001045', '2020-07-25', 2),
(86, 'Shreya Paul', '2002-11-11', 'shreya.paul@college.edu', '+91-9810001046', '2021-08-01', 3),
(87, 'Lokesh Yadav', '2003-03-05', 'lokesh.yadav@college.edu', '+91-9810001047', '2022-07-30', 1),
(88, 'Ishita Bose', '2002-06-20', 'ishita.bose@college.edu', '+91-9810001048', '2021-08-01', 2),
(89, 'Arvind Mishra', '2001-05-15', 'arvind.mishra@college.edu', '+91-9810001049', '2020-07-25', 3),
(90, 'Niharika Jain', '2003-07-30', 'niharika.jain@college.edu', '+91-9810001050', '2022-07-30', 1);

-- --------------------------------------------------------

--
-- Table structure for table `studentusers`
--

CREATE TABLE `studentusers` (
  `UserID` int(11) NOT NULL,
  `StudentID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `studentusers`
--

INSERT INTO `studentusers` (`UserID`, `StudentID`) VALUES
(5, 2),
(6, 3);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `UserID` int(11) NOT NULL,
  `Username` varchar(50) NOT NULL,
  `PasswordHash` varchar(255) NOT NULL,
  `Role` enum('Student','Instructor','Admin') NOT NULL,
  `Email` varchar(100) NOT NULL,
  `CreatedAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`UserID`, `Username`, `PasswordHash`, `Role`, `Email`, `CreatedAt`) VALUES
(1, 'yashin', 'yashin', 'Student', 'david.miller@univ.edu', '2025-11-05 12:38:53'),
(2, 'alicej', 'hashed_pw_2', 'Instructor', 'alice.johnson@univ.edu', '2025-11-05 12:38:53'),
(3, 'admin1', 'hashed_pw_3', 'Admin', 'admin@univ.edu', '2025-11-05 12:38:53'),
(4, 'admin2', '123', 'Admin', 'a@gmail.com', '2025-11-27 16:30:14'),
(5, 'stud1', '123', 'Student', '', '2025-11-30 11:52:39'),
(6, 'stud2', '123', 'Student', 'b@gmail.com', '2025-11-30 14:48:48');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `assessments`
--
ALTER TABLE `assessments`
  ADD PRIMARY KEY (`AssessmentID`),
  ADD KEY `ClassID` (`ClassID`);

--
-- Indexes for table `classes`
--
ALTER TABLE `classes`
  ADD PRIMARY KEY (`ClassID`),
  ADD KEY `CourseID` (`CourseID`),
  ADD KEY `InstructorID` (`InstructorID`),
  ADD KEY `SemesterID` (`SemesterID`);

--
-- Indexes for table `courses`
--
ALTER TABLE `courses`
  ADD PRIMARY KEY (`CourseID`),
  ADD UNIQUE KEY `CourseCode` (`CourseCode`),
  ADD KEY `DepartmentID` (`DepartmentID`);

--
-- Indexes for table `departments`
--
ALTER TABLE `departments`
  ADD PRIMARY KEY (`DepartmentID`),
  ADD UNIQUE KEY `DepartmentName` (`DepartmentName`),
  ADD KEY `FK_HOD` (`HOD_InstructorID`);

--
-- Indexes for table `enrollments`
--
ALTER TABLE `enrollments`
  ADD PRIMARY KEY (`EnrollmentID`),
  ADD UNIQUE KEY `StudentID` (`StudentID`,`ClassID`),
  ADD KEY `ClassID` (`ClassID`);

--
-- Indexes for table `instructors`
--
ALTER TABLE `instructors`
  ADD PRIMARY KEY (`InstructorID`),
  ADD UNIQUE KEY `Email` (`Email`),
  ADD KEY `DepartmentID` (`DepartmentID`);

--
-- Indexes for table `instructorusers`
--
ALTER TABLE `instructorusers`
  ADD PRIMARY KEY (`UserID`),
  ADD UNIQUE KEY `InstructorID` (`InstructorID`);

--
-- Indexes for table `semesters`
--
ALTER TABLE `semesters`
  ADD PRIMARY KEY (`SemesterID`),
  ADD UNIQUE KEY `SemesterName` (`SemesterName`);

--
-- Indexes for table `studentmarks`
--
ALTER TABLE `studentmarks`
  ADD PRIMARY KEY (`MarkID`),
  ADD UNIQUE KEY `StudentID` (`StudentID`,`AssessmentID`),
  ADD KEY `AssessmentID` (`AssessmentID`);

--
-- Indexes for table `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`StudentID`),
  ADD UNIQUE KEY `Email` (`Email`),
  ADD KEY `Major_DepartmentID` (`Major_DepartmentID`);

--
-- Indexes for table `studentusers`
--
ALTER TABLE `studentusers`
  ADD PRIMARY KEY (`UserID`),
  ADD UNIQUE KEY `StudentID` (`StudentID`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`UserID`),
  ADD UNIQUE KEY `Username` (`Username`),
  ADD UNIQUE KEY `Email` (`Email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `assessments`
--
ALTER TABLE `assessments`
  MODIFY `AssessmentID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `classes`
--
ALTER TABLE `classes`
  MODIFY `ClassID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `courses`
--
ALTER TABLE `courses`
  MODIFY `CourseID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT for table `departments`
--
ALTER TABLE `departments`
  MODIFY `DepartmentID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `enrollments`
--
ALTER TABLE `enrollments`
  MODIFY `EnrollmentID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `instructors`
--
ALTER TABLE `instructors`
  MODIFY `InstructorID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `semesters`
--
ALTER TABLE `semesters`
  MODIFY `SemesterID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `studentmarks`
--
ALTER TABLE `studentmarks`
  MODIFY `MarkID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `students`
--
ALTER TABLE `students`
  MODIFY `StudentID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=91;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `UserID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `assessments`
--
ALTER TABLE `assessments`
  ADD CONSTRAINT `assessments_ibfk_1` FOREIGN KEY (`ClassID`) REFERENCES `classes` (`ClassID`) ON DELETE CASCADE;

--
-- Constraints for table `classes`
--
ALTER TABLE `classes`
  ADD CONSTRAINT `classes_ibfk_1` FOREIGN KEY (`CourseID`) REFERENCES `courses` (`CourseID`),
  ADD CONSTRAINT `classes_ibfk_2` FOREIGN KEY (`InstructorID`) REFERENCES `instructors` (`InstructorID`),
  ADD CONSTRAINT `classes_ibfk_3` FOREIGN KEY (`SemesterID`) REFERENCES `semesters` (`SemesterID`);

--
-- Constraints for table `courses`
--
ALTER TABLE `courses`
  ADD CONSTRAINT `courses_ibfk_1` FOREIGN KEY (`DepartmentID`) REFERENCES `departments` (`DepartmentID`);

--
-- Constraints for table `departments`
--
ALTER TABLE `departments`
  ADD CONSTRAINT `FK_HOD` FOREIGN KEY (`HOD_InstructorID`) REFERENCES `instructors` (`InstructorID`) ON DELETE SET NULL;

--
-- Constraints for table `enrollments`
--
ALTER TABLE `enrollments`
  ADD CONSTRAINT `enrollments_ibfk_1` FOREIGN KEY (`StudentID`) REFERENCES `students` (`StudentID`) ON DELETE CASCADE,
  ADD CONSTRAINT `enrollments_ibfk_2` FOREIGN KEY (`ClassID`) REFERENCES `classes` (`ClassID`) ON DELETE CASCADE;

--
-- Constraints for table `instructors`
--
ALTER TABLE `instructors`
  ADD CONSTRAINT `instructors_ibfk_1` FOREIGN KEY (`DepartmentID`) REFERENCES `departments` (`DepartmentID`);

--
-- Constraints for table `instructorusers`
--
ALTER TABLE `instructorusers`
  ADD CONSTRAINT `instructorusers_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`) ON DELETE CASCADE,
  ADD CONSTRAINT `instructorusers_ibfk_2` FOREIGN KEY (`InstructorID`) REFERENCES `instructors` (`InstructorID`) ON DELETE CASCADE;

--
-- Constraints for table `studentmarks`
--
ALTER TABLE `studentmarks`
  ADD CONSTRAINT `studentmarks_ibfk_1` FOREIGN KEY (`StudentID`) REFERENCES `students` (`StudentID`) ON DELETE CASCADE,
  ADD CONSTRAINT `studentmarks_ibfk_2` FOREIGN KEY (`AssessmentID`) REFERENCES `assessments` (`AssessmentID`) ON DELETE CASCADE;

--
-- Constraints for table `students`
--
ALTER TABLE `students`
  ADD CONSTRAINT `students_ibfk_1` FOREIGN KEY (`Major_DepartmentID`) REFERENCES `departments` (`DepartmentID`) ON DELETE SET NULL;

--
-- Constraints for table `studentusers`
--
ALTER TABLE `studentusers`
  ADD CONSTRAINT `studentusers_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`) ON DELETE CASCADE,
  ADD CONSTRAINT `studentusers_ibfk_2` FOREIGN KEY (`StudentID`) REFERENCES `students` (`StudentID`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
