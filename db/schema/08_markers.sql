DROP TABLE IF EXISTS markers CASCADE;
CREATE TABLE markers (
  id SERIAL PRIMARY KEY NOT NULL,
  map_id INTEGER REFERENCES maps(id) ON DELETE CASCADE,
  owner_id INTEGER REFERENCES users2(id),
  title VARCHAR(255) NOT NUll,
  description TEXT NOT NULL,
  image_url TEXT,
  latitude FLOAT NOT NULL,
  longitude FLOAT NOT NULL,
  type VARCHAR(255) NOT NULL
);
