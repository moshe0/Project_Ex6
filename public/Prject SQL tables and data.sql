#*****************  USERS *********************************

select *
from users;

CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `password` varchar(45) NOT NULL,
  `age` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

INSERT INTO users
(name, password, age)
VALUES
('Moshe', '11', 11),
('Raz', '22', 22),
('Yosef', '33', 33),
('Tommy', '44', 44),
('Udi', '55', 55),
('Ori', '66', 66),
('Roni', '77', 77);



#*****************  GROUPS *********************************

SELECT *
FROM groups;

CREATE TABLE `groups` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `parent_id` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1000000 DEFAULT CHARSET=utf8;

INSERT INTO groups
(name, parent_id)
VALUES
('No Friends', null),
('Friends', null),
('Best Friends', 1000001),
('Good Friends', 1000002);




#*****************  MESSAGES *********************************


select *
from messages;


CREATE TABLE `messages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `content` varchar(45) NOT NULL,
  `sender_name` varchar(45) NOT NULL,
  `receiver_name` varchar(45) NOT NULL,
  `sender_id` varchar(45) NOT NULL,
  `receiver_id` varchar(45) NOT NULL,
  `time_sent` varchar(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;



INSERT INTO messages
(content, sender_name, receiver_name, sender_id, receiver_id, time_sent)
VALUES
('שלום לכולם', 'Moshe', 'Good Friends', 1, 1000003, '7:58:06'),
('שלום זה אודי', 'Udi', 'Good Friends', 5, 1000003, '7:59:22'),
('ואני טומי', 'Tommy', 'Good Friends', 4, 1000003, '8:00:28'),
('הגשת את התרגיל', 'Moshe', 'Raz', 1, 2, '8:00:53'),
('אני כבר מגיש', 'Raz', 'Moshe', 2, 1, '8:01:12');



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
(1000001, 1000002, 'group'),
(1000002, 1000003, 'group'),
(1000003, 1, 'user'),
(1000003, 4, 'user'),
(1000003, 5, 'user'),
(1000003, 7, 'user');

