CREATE DATABASE retraced_testdb;

CREATE TABLE Categories (
Id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
ParentId INT NULL,
Name varchar(100) NOT NULL
);

ALTER TABLE Categories ADD UNIQUE `unique_category_name`(ParentId, Name);

INSERT INTO Categories (ParentId,Name) VALUES 
(NULL,'A')
,(1,'A1')
,(NULL,'B')
,(3,'B1')
,(1,'A2')
,(3,'B2');

INSERT INTO Categories (ParentId,Name) VALUES 
 (4,'B10')
,(4,'B11')

,(6,'B20')
,(6,'B21')


INSERT INTO Categories (ParentId,Name) VALUES 
(9,'B201')
,(9,'B202')

CREATE PROCEDURE `GetCategoriesById`(vId INT)
BEGIN
	
	if vId IS NULL
	THEN		
		SELECT  
		C.Id as id, 
		ifnull(C.Name, '/root') as name,
		C.ParentId `parentId`
		from  
		Categories as C
		order by C.Id, C.ParentId, C.Name;
	ELSE
		SELECT 
		C.Id as id,
		C.ParentId as `parentId`, 
		C.Name as name
		FROM Categories C
		where C.Id IN(
			(select Id from (select  Id,
			        ParentId 
			from    (select  ParentId, Id from Categories
			        order by ParentId, Id) CategoriesSorted,
			       (select @pv := vId) initialisation
			where   find_in_set(ParentId, @pv)
			and     length(@pv := concat(@pv, ',', Id))
		) tb1
		)) OR (C.Id = vId) order by C.Id, C.Name;
	END IF;
END;
