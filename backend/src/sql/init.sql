CREATE TYPE entity_type AS ENUM (
    'proposta', 
    'sondaggio', 
    'sanzione'
);

CREATE TYPE sanction_type AS ENUM (
    'ban', 
    'mute', 
    'warning'
);

CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  labels JSONB NOT NULL DEFAULT '{}'::jsonb,
  colour VARCHAR(7) DEFAULT '#5b6f82'
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  email_opt_in BOOLEAN NOT NULL DEFAULT FALSE,
  password_hash VARCHAR(255) NOT NULL,
  role_id INTEGER NOT NULL REFERENCES roles(id),
  is_banned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  code VARCHAR(100) NOT NULL UNIQUE,
  labels JSONB NOT NULL DEFAULT '{}'::jsonb,
  description JSONB,
  colour VARCHAR(7) DEFAULT '#007a52',
  form_schema JSONB NOT NULL DEFAULT '[]'::jsonb 
);

CREATE TABLE statuses (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  labels JSONB NOT NULL DEFAULT '{}'::jsonb,
  colour VARCHAR(7) DEFAULT '#5b6f82'
);

CREATE TABLE proposals (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  vote_value INTEGER NOT NULL DEFAULT 0,
  additional_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  current_version INTEGER NOT NULL DEFAULT 1, 
  category_id INTEGER REFERENCES categories(id),
  status_id INTEGER NOT NULL REFERENCES statuses(id),
  author_id INTEGER NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

CREATE TABLE proposal_history (
  id SERIAL PRIMARY KEY,
  proposal_id INTEGER NOT NULL REFERENCES proposals(id) ON DELETE CASCADE,
  version INTEGER NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  additional_data JSONB,
  archived_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE attachments (
  id SERIAL PRIMARY KEY,
  proposal_id INTEGER NOT NULL REFERENCES proposals(id) ON DELETE CASCADE,
  file_url VARCHAR(255) NOT NULL,
  file_type VARCHAR(50),
  file_name VARCHAR(255),
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  slot_key VARCHAR(100) -- key del campo "file" nel form_schema (es. 'relazione_pdf'), NULL = allegato extra
);

CREATE TABLE polls (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  created_by INTEGER NOT NULL REFERENCES users(id),
  is_active BOOLEAN DEFAULT TRUE,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE poll_questions (
  id SERIAL PRIMARY KEY,
  poll_id INTEGER NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
  text TEXT NOT NULL, 
  order_index INTEGER DEFAULT 0
);

CREATE TABLE poll_options (
  id SERIAL PRIMARY KEY,
  question_id INTEGER NOT NULL REFERENCES poll_questions(id) ON DELETE CASCADE,
  text VARCHAR(255) NOT NULL, 
  order_index INTEGER DEFAULT 0
);

CREATE TABLE poll_answers (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  question_id INTEGER NOT NULL REFERENCES poll_questions(id) ON DELETE CASCADE,
  selected_option_id INTEGER REFERENCES poll_options(id),
  text_response TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_one_answer_per_question UNIQUE (user_id, question_id)
);

CREATE TABLE proposal_votes (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  proposal_id INTEGER NOT NULL REFERENCES proposals(id) ON DELETE CASCADE,
  proposal_version INTEGER NOT NULL, 
  vote_value INTEGER NOT NULL CHECK (vote_value IN (-1, 1)),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_vote_version UNIQUE (user_id, proposal_id, proposal_version)
);

CREATE TABLE favourites (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  proposal_id INTEGER NOT NULL REFERENCES proposals(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_fav_proposal UNIQUE (user_id, proposal_id)
);

CREATE TABLE user_views (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  proposal_id INTEGER NOT NULL REFERENCES proposals(id) ON DELETE CASCADE,
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_view_proposal UNIQUE (user_id, proposal_id)
);

CREATE TABLE notification_types (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  labels JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  notification_type VARCHAR(50) NOT NULL REFERENCES notification_types(code), 
  title VARCHAR(255) NOT NULL,
  message TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  related_object_id INTEGER, 
  related_object_type entity_type, 
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE user_sanctions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  moderator_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  sanction_type sanction_type NOT NULL, 
  reason TEXT NOT NULL,
  expires_at TIMESTAMPTZ, 
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_attachments_proposal_slot ON attachments (proposal_id, slot_key);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications (user_id, is_read);
