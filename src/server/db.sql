create table if not exists  NODE (
    title varchar(30) primary key ,
    author varchar(50) not null

);
alter table node
    add journal varchar (50),
    add doi varchar(80) not null ,
    add publication_date date;
alter table node modify doi varchar(80) ;
create table AUTHORS (
    title varchar(30) not null ,
    author_name varchar(50) not null,
    foreign key (title ) references node(title),
    primary key (title,author_name)
);
insert into node (title, author) values ('paper 3', 'author 3');
insert into node (title, author)values ('paper 4', 'author 4');
insert into node (title, author)values ('paper 5', 'author 5');
insert into node (title, author) values('paper 6', 'author 6');


drop table edge;
create table if not exists EDGE (
    source varchar(60) not null,
    destination  varchar(60) not null,
    primary key (source,destination),
    foreign key (source) references NODE (title),
    foreign key (destination) references NODE (title)
);
update node  set doi = 123456789 where title = 'paper 1';
update node  set doi = 1234567 where title = 'paper 2';
update node  set doi = 12345 where title = 'paper 3';
update node  set doi = 1239 where title = 'paper 4';
update node  set doi = 1239 where title = 'paper 6';
update node  set doi = 1239 where title = 'paper 5';
insert into node (title, author) values ('paper 2','author 2');
insert into node (title, author) values ('paper 3','author 3');
insert into node (title, author) values ('paper 4','author 4');


insert into edge values ('paper 1','paper 2') ;
insert into edge values ('paper 1','paper 3') ;
insert into edge values ('paper 1','paper 4') ;
insert into edge values ('paper 1','paper 5') ;
insert into edge values ('paper 1','paper 6') ;

# select title as paper.pid from node for json path, root ('papers') ;
# select node.*
# from node inner join  edge on edge.destination = node.title
# where edge.source = 'paper 1';
