CREATE DATABASE smartexpense_tracker;
USE smartexpense_tracker;

create table users (
    id int auto_increment primary key,
    full_name varchar(100) NOT NULL

);

create table categories(
    id int auto_increment primary key,
    category_name varchar(100) not null default 'Miscellaneous' unique
);

create table expenses(
    id int auto_increment primary key,
    user_id int not null,
    category_id int not null,
    expenditure_amount DECIMAL(10,2) not null,
    expenditure_date date not null,
    foreign key (user_id) references users (id) on delete cascade,
    foreign key (category_id) references categories (id) on delete cascade

);

insert into users (full_name) values('Niveditha'), ('Anila'), ('Nikitha');

insert into categories (category_name) values ('Rent'), ('Food'), ('Entertainment');

insert into expenses (user_id, category_id, expenditure_amount, expenditure_date) values
(1, 1, 4000, '2025-09-01'),
(2, 2, 1000, '2025-09-05'),
(3, 3, 800.60, '2025-09-09');