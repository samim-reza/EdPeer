create database edpeer;

use edpeer;

select * from Users;

delete  from Users;

select * from Sessions;

alter table Sessions
modify status enum("pending", "completed", "cancelled");