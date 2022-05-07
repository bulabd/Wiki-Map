DROP TABLE users_favoutite_maps CASCADE;
CREATE table users_favoutite_maps (
  id  SERIAL PRIMARY KEY NOT NULL,
  user_id INTEGER REFERENCES users2(id) ON DELETE CASCADE,
  map_id INTEGER REFERENCES maps(id) ON DELETE CASCADE,
  owner_id INTEGER REFERENCES users2(id) ON DELETE CASCADE
);
