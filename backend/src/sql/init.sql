<<<<<<< HEAD
CREATE TABLE role (
=======
CREATE TYPE entity_type AS ENUM (
    'proposal', 
    'poll', 
    'user_sanction',
);

CREATE TYPE sanction_type AS ENUM (
    'ban', 
    'mute', 
    'warning'
);

CREATE TABLE roles (
>>>>>>> e49f1c4 (WIP Allineamento Backend con DB)
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL UNIQUE
);

CREATE TABLE "user" (
  id SERIAL PRIMARY KEY,
<<<<<<< HEAD
  username VARCHAR NOT NULL UNIQUE,
  email VARCHAR NOT NULL UNIQUE,
  password_hash VARCHAR NOT NULL,
  notifications BOOLEAN NOT NULL DEFAULT FALSE,
  role_id INTEGER NOT NULL REFERENCES role(id)
=======
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  email_opt_in BOOLEAN NOT NULL DEFAULT FALSE,
  password_hash VARCHAR(255) NOT NULL,
  role_id INTEGER NOT NULL REFERENCES roles(id),
  is_banned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
>>>>>>> e49f1c4 (WIP Allineamento Backend con DB)
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
<<<<<<< HEAD
  title VARCHAR NOT NULL,
  description VARCHAR NOT NULL,
  category_id INTEGER NOT NULL REFERENCES category(id) ON DELETE CASCADE,
  finish_date TIMESTAMPTZ NOT NULL,
  creation_date TIMESTAMPTZ NOT NULL DEFAULT NOW()
=======
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  vote_value INTEGER NOT NULL DEFAULT 0,

  -- dati dei campi aggiuntivi
  -- es: {"budget": 5000, "location": "Piazza Duomo"}
  additional_data JSONB DEFAULT '{}'::jsonb,
  
  current_version INTEGER NOT NULL DEFAULT 1, 
  
  category_id INTEGER NOT NULL REFERENCES categories(id),
  status_id INTEGER NOT NULL REFERENCES statuses(id),
  author_id INTEGER NOT NULL REFERENCES users(id),
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ
>>>>>>> e49f1c4 (WIP Allineamento Backend con DB)
);

CREATE TABLE proposal (
  id SERIAL PRIMARY KEY,
  title VARCHAR NOT NULL,
  description VARCHAR NOT NULL,
  category_id INTEGER NOT NULL REFERENCES category(id) ON DELETE CASCADE,
  creation_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status_id INTEGER NOT NULL REFERENCES status(id),
  user_id INTEGER NOT NULL REFERENCES "user"(id)
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
