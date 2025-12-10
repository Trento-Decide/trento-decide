CREATE TABLE role (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL UNIQUE
);

CREATE TABLE "user" (
  id SERIAL PRIMARY KEY,
  username VARCHAR NOT NULL UNIQUE,
  email VARCHAR NOT NULL UNIQUE,
  password_hash VARCHAR NOT NULL,
  notifications BOOLEAN NOT NULL DEFAULT FALSE,
  role_id INTEGER NOT NULL REFERENCES role(id)
);

CREATE TABLE category (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL UNIQUE
);

CREATE TABLE status (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL UNIQUE
);

CREATE TABLE poll (
  id SERIAL PRIMARY KEY,
  title VARCHAR NOT NULL,
  description VARCHAR NOT NULL,
  category_id INTEGER NOT NULL REFERENCES category(id) ON DELETE CASCADE,
  finish_date TIMESTAMPTZ NOT NULL,
  creation_date TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE proposal (
  id SERIAL PRIMARY KEY,
  title VARCHAR NOT NULL,
  description VARCHAR NOT NULL,
  category_id INTEGER NOT NULL REFERENCES category(id) ON DELETE CASCADE,
  creation_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  proposal_status_id INTEGER NOT NULL REFERENCES status(id),
  user_id INTEGER NOT NULL REFERENCES "user"(id)
);

CREATE TABLE proposal_status (
  proposal_id INTEGER NOT NULL,
  status_id INTEGER NOT NULL,
  motivation VARCHAR,
  PRIMARY KEY (proposal_id, status_id),
  FOREIGN KEY (proposal_id) REFERENCES proposal(id) ON DELETE CASCADE,
  FOREIGN KEY (status_id) REFERENCES status(id) ON DELETE CASCADE
);

CREATE TABLE poll_choice (
  id SERIAL PRIMARY KEY,
  poll_id INTEGER NOT NULL REFERENCES poll(id) ON DELETE CASCADE,
  choice_name VARCHAR NOT NULL
);

ALTER TABLE poll_choice
  ADD CONSTRAINT uq_poll_choice_per_poll UNIQUE (poll_id, choice_name);

CREATE TABLE proposal_vote (
  user_id INTEGER NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  proposal_id INTEGER NOT NULL REFERENCES proposal(id) ON DELETE CASCADE,
  value BOOLEAN NOT NULL,
  PRIMARY KEY (user_id, proposal_id)
);

CREATE TABLE poll_vote (
  user_id INTEGER NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  poll_id INTEGER NOT NULL REFERENCES poll(id) ON DELETE CASCADE,
  poll_choice_id INTEGER NOT NULL REFERENCES poll_choice(id),
  PRIMARY KEY (user_id, poll_id)
);

CREATE TABLE moderation (
  id SERIAL PRIMARY KEY,
  motivation VARCHAR NOT NULL,
  author_id INTEGER NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  action_end TIMESTAMPTZ
);

CREATE TABLE user_view (
  user_id INTEGER NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  proposal_id INTEGER NOT NULL REFERENCES proposal(id) ON DELETE CASCADE,
  last_seen TIMESTAMPTZ NOT NULL,
  PRIMARY KEY (user_id, proposal_id)
);

CREATE TABLE favorite (
  user_id INTEGER NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  proposal_id INTEGER NOT NULL REFERENCES proposal(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, proposal_id)
);