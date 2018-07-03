#*****************  USERS *********************************

select *
from users;

CREATE TABLE `users` (
  `id` varchar(50) NOT NULL,
  `name` varchar(45) NOT NULL,
  `password` varchar(45) NOT NULL,
  `age` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO users
(id, name, password, age)
VALUES
('58a2e393-1d4f-46dd-8b5d-7b964f911a1e', 'Moshe', '11', 11),
('974687e9-cbef-4abc-9cb0-b2bf180d7f63', 'Raz', '22', 22),
('7b2781ba-32b8-4343-a064-30e350dc67b1', 'Yosef', '33', 33),
('789f95bc-e75a-4963-8590-73f80761df11', 'Tommy', '44', 44),
('c6b5ee74-7f31-4a1e-b19c-5ee6609c8774', 'Udi', '55', 55),
('47388964-9f87-4c43-bf6d-bb84fab4e4c0', 'Ori', '66', 66),
('6c0e0610-0c63-40f2-b199-146f16f374d6', 'Roni', '77', 77);



#*****************  GROUPS *********************************

SELECT * 
FROM groups;

CREATE TABLE `groups` (
  `id` varchar(50) NOT NULL,
  `name` varchar(45) NOT NULL,
  `parent_id` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO groups
(id, name, parent_id)
VALUES
('f505be8e-73c7-4be5-a438-a3596afcc33c', 'No Friends', null),
('6a646b30-32c4-46d3-a642-a5dbca5da042', 'Friends', null),
('03b1948e-ea68-4076-9a11-e4323bd026dd', 'Best Friends', '6a646b30-32c4-46d3-a642-a5dbca5da042'),
('32010f74-414a-42b7-9452-508417f25d90', 'Good Friends', '03b1948e-ea68-4076-9a11-e4323bd026dd');




#*****************  MESSAGES *********************************


select *
from messages;


CREATE TABLE `messages` (
  `id` varchar(50) NOT NULL,
  `content` varchar(45) NOT NULL,
  `sender_name` varchar(45) NOT NULL,
  `receiver_name` varchar(45) NOT NULL,
  `sender_id` varchar(45) NOT NULL,
  `receiver_id` varchar(45) NOT NULL,
  `time_sent` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



INSERT INTO messages
(id, content, sender_name, receiver_name, sender_id, receiver_id, time_sent)
VALUES
('c839ec99-58ca-463e-92c8-00d51b8520d3', 'שלום לכולם', 'Moshe', 'Good Friends', '58a2e393-1d4f-46dd-8b5d-7b964f911a1e', '32010f74-414a-42b7-9452-508417f25d90', '7:58:06'),
('f5de356c-d0dc-41bd-a4e8-661ad8dc20d7', 'שלום זה אודי', 'Udi', 'Good Friends', 'c6b5ee74-7f31-4a1e-b19c-5ee6609c8774', '32010f74-414a-42b7-9452-508417f25d90', '7:59:22'),
('f81347b9-dd41-4620-be7f-caa34490facc', 'ואני טומי', 'Tommy', 'Good Friends', '789f95bc-e75a-4963-8590-73f80761df11', '32010f74-414a-42b7-9452-508417f25d90', '8:00:28'),
('bbef633e-ee59-4ed2-b1ae-75313da7e96c', 'הגשת את התרגיל', 'Moshe', 'Raz', '3ded4fb2-e986-4a31-8d46-b8f4da13d680', '974687e9-cbef-4abc-9cb0-b2bf180d7f63', '8:00:53'),
('3ded4fb2-e986-4a31-8d46-b8f4da13d680', 'אני כבר מגיש', 'Raz', 'Moshe', '974687e9-cbef-4abc-9cb0-b2bf180d7f63', '58a2e393-1d4f-46dd-8b5d-7b964f911a1e', '8:01:12');



#*****************  MEMBERS *********************************

select *
from members;

CREATE TABLE `members` (
  `host_id` varchar(50) NOT NULL,
  `member_id` varchar(50) NOT NULL,
  `member_type` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


INSERT INTO members
(host_id, member_id, member_type)
VALUES
('6a646b30-32c4-46d3-a642-a5dbca5da042', '03b1948e-ea68-4076-9a11-e4323bd026dd', 'group'),
('03b1948e-ea68-4076-9a11-e4323bd026dd', '32010f74-414a-42b7-9452-508417f25d90', 'group'),
('32010f74-414a-42b7-9452-508417f25d90', '58a2e393-1d4f-46dd-8b5d-7b964f911a1e', 'user'),
('32010f74-414a-42b7-9452-508417f25d90', '789f95bc-e75a-4963-8590-73f80761df11', 'user'),
('32010f74-414a-42b7-9452-508417f25d90', 'c6b5ee74-7f31-4a1e-b19c-5ee6609c8774', 'user'),
('32010f74-414a-42b7-9452-508417f25d90', '6c0e0610-0c63-40f2-b199-146f16f374d6', 'user');


