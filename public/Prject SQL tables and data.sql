#*****************  USERS *********************************
use chat;

DROP TABLE users, groups, members, messages;

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
('Coffe', null),
('Friends', null),
('Best Friends', 1000001),
('Good Friends', 1000001),
('Room1', 1000000),
('Room2', 1000000),
('Work', 1000002),
('Neighborhood', 1000002),
('Work', 1000003),
('Neighborhood', 1000003),
('E2', 1000006),
('F2', 1000006),
('E3', 1000010);







#*****************  MESSAGES *********************************




 CREATE TABLE `messages` (
`id` int(11) NOT NULL AUTO_INCREMENT,
`content` varchar(45) NOT NULL,
`sender_name` varchar(45) NOT NULL,
`receiver_name` varchar(45) NOT NULL,
`sender_id` int(11) NOT NULL,
`receiver_id` int(11) NOT NULL,
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



 CREATE TABLE `members` (
`host_id` varchar(50) NOT NULL,
`user_id` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


INSERT INTO members
(host_id, user_id)
VALUES
(1000012, 1),
(1000012, 4),
(1000012, 5),
(1000012, 7);



select *
from users;

SELECT *
FROM groups;

select *
from messages;

select *
from members;


# INSERT INTO groups
# (name, parent_id)
# VALUES
# ('No Friends', null),
# ('Friends', null),
# ('Best Friends', 1000001),
# ('Good Friends', 1000002),
# ('AAA', 1000000),
# ('BBB', 1000000);