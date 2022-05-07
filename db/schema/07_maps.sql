DROP TABLE maps CASCADE;
CREATE table maps (
  id  SERIAL PRIMARY KEY NOT NULL,
  owner_id INTEGER REFERENCES users2(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  initial_lat FLOAT NOT NULL,
  initial_long FLOAT NOT NULL,
  description TEXT
);
