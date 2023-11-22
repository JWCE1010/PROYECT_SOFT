-- Active: 1695316363730@@localhost@3306@lubrican

CREATE DATABASE lubrican;

CREATE TABLE users (
  id INT(11) NOT NULL,
  username VARCHAR(16) NOT NULL,
  password VARCHAR(60) NOT NULL,
  fullname VARCHAR(100) NOT NULL
);

ALTER TABLE users
  ADD PRIMARY KEY (id);

ALTER TABLE users
  MODIFY id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 2;

DESCRIBE users;
-- PRODUCTO TABLE
CREATE TABLE producto (
  id INT(11) NOT NULL,
  name VARCHAR(150) NOT NULL,
  precio INT(255) NOT NULL,
  description TEXT,
  user_id INT(11),
  created_at timestamp NOT NULL DEFAULT current_timestamp,
  CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES users(id)
);

ALTER TABLE producto
  ADD PRIMARY KEY (id);

ALTER TABLE producto
  MODIFY id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 2;

DESCRIBE producto;

CREATE TABLE proveedor (
  id_pro INT(11) NOT NULL,
  Nombre VARCHAR(50) NOT NULL,
  Apellido VARCHAR(50) NOT NULL,
  Empresa VARCHAR(50) NOT NULL,
  Direccion VARCHAR(50) NOT NULL,
  user_id INT(11),
  created_at timestamp NOT NULL DEFAULT current_timestamp,
  CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES users(id)
);

ALTER TABLE proveedor
  ADD PRIMARY KEY (id_pro);

ALTER TABLE proveedor
  MODIFY id_pro INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 2;

DESCRIBE proveedor;
