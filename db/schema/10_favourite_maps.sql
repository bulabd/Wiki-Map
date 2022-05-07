DROP TABLE favoutite_maps CASCADE;
CREATE table favoutite_maps (
  id  SERIAL PRIMARY KEY NOT NULL,
  owner_id INTEGER REFERENCES users2(id) ON DELETE CASCADE,
  client_id INTEGER REFERENCES users2(id) ON DELETE CASCADE,
  map_id INTEGER REFERENCES maps(id) ON DELETE CASCADE
);
