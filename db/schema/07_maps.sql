DROP TABLE maps CASCADE;
CREATE table maps (
  id  SERIAL PRIMARY KEY,
  owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255),
  initial_lat FLOAT,
  initial_long FLOAT,
  description TEXT
);
