use nodeapi;

CREATE TABLE Users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name NVARCHAR(100),
  email VARCHAR(100),
  password VARCHAR(255),
  phone VARCHAR(20),
  role VARCHAR(50)
);

select * from users;
