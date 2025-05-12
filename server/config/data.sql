create database edpeer;

use edpeer;

select * from Users;

delete  from Users;

<<<<<<< HEAD
select * from sessions;
=======
select * from Sessions;

alter table Sessions
modify status enum("pending", "completed", "accepted", "cancelled");
>>>>>>> my-temp-work
