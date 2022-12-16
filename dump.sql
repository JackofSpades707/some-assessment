CREATE TABLE question_one_shifts(
shift_id INTEGER PRIMARY KEY,
facility_id INTEGER,
shift_date DATE,
start_time TIME WITHOUT TIME ZONE,
end_time TIME WITHOUT TIME ZONE
);


CREATE TABLE facilities (
    facility_id INTEGER PRIMARY KEY,
    facility_name CHARACTER VARYING(255)
);

CREATE TABLE jobs (
    job_id integer PRIMARY KEY,
    facility_id INTEGER,
    nurse_type_needed CHARACTER VARYING(255),
    total_number_nurses_needed INTEGER
);

CREATE TABLE nurses (
    nurse_id INTEGER PRIMARY KEY,
    nurse_name CHARACTER VARYING(255),
    nurse_type CHARACTER VARYING(255)
);

CREATE TABLE nurse_hired_jobs (
    job_id INTEGER ,
    nurse_id INTEGER,
    PRIMARY KEY (job_id, nurse_id)
);


INSERT INTO question_one_shifts
VALUES
(1, 100, '2022-10-01', '07:00:00', '15:30:00'),
(2, 100, '2022-10-01', '15:00:00', '23:00:00'),
(3, 100, '2022-10-03', '15:00:00', '23:00:00'),
(4, 100, '2022-10-03', '07:00:00', '19:00:00'),
(5, 101, '2022-10-02', '23:00:00', '07:30:00'),
(6, 102, '2022-10-03', '15:00:00', '23:30:00');



INSERT INTO facilities 
VALUES 
(100, 'Facility A'),
(101, 'Facility B'),
(102, 'Facility C');

INSERT INTO jobs
VALUES
(210,102,'LPN',3),
(209,102,'CNA',4),
(208,100,'RN',1),
(207,101,'CNA',1),
(206,101,'LPN',2),
(205,100,'RN',3),
(204,102,'RN',2),
(203,102,'LPN',2),
(202,100,'CNA',2),
(201,101,'LPN',1),
(200,100,'RN',1);


INSERT INTO nurses
VALUES
(1010,'Mark','RN'),
(1009,'Robert','LPN'),
(1008,'Cory','RN'),
(1007,'Adam','CNA'),
(1006,'Wesley','RN'),
(1005,'Sam','CNA'),
(1004,'Thomas','LPN'),
(1003,'John','LPN'),
(1002,'Abby','RN'),
(1001,'Anne','CNA'),
(1000,'Kevin','CNA');


INSERT INTO nurse_hired_jobs
VALUES
(210,1004),
(209,1001),
(208,1006),
(207,1005),
(206,1010),
(206,1003),
(205,1008),
(204,1008),
(204,1006),
(203,1004),
(202,1007),
(201,1003),
(200,1006);
