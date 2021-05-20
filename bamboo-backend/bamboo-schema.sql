CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(25),
  password TEXT NOT NULL,
  title TEXT UNIQUE NOT NULL,
  is_admin BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE menus (
  id SERIAL,
  restaurant_id INTEGER
    REFERENCES users ON DELETE CASCADE,
  title TEXT NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE items (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    price NUMERIC(2) CHECK (price >= 0),
    ingredients TEXT NOT NULL,
    type TEXT NOT NULL,
    description TEXT NOT NULL
);

CREATE TABLE menu_item (
    menu_id INTEGER REFERENCES menus,
    item_id INTEGER REFERENCES items
);

CREATE TABLE completed_transactions (
    id INTEGER PRIMARY KEY,
    restaurant_id INTEGER
      REFERENCES users ON DELETE CASCADE,
    val NUMERIC(2)
);

CREATE TABLE calendar_events (
    id INTEGER PRIMARY KEY,
    s_date DATE,
    e_date DATE
);