DROP TABLE IF EXISTS users2 CASCADE;
CREATE TABLE users2 (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL
);
