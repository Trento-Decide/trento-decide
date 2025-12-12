CREATE TYPE entity_type AS ENUM (
    'proposal', 
    'poll', 
    'user_sanction',
    'comment'
);

CREATE TYPE sanction_type AS ENUM (
    'ban', 
    'mute', 
    'warning'
);

CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE, -- nome interno (es. 'admin')
  labels JSONB NOT NULL DEFAULT '{}'::jsonb, -- multi lingua: {"it": "Amministratore", "en": "Admin"}
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
  code VARCHAR(100) NOT NULL UNIQUE, -- per l'URL (es. 'ambiente')
  labels JSONB NOT NULL DEFAULT '{}'::jsonb, -- es: {"it": "Ambiente", "en": "Environment"}
  description JSONB, -- descrizione multi lingua
  colour VARCHAR(7) DEFAULT '#007a52',

   -- campi extra che servono per questa categoria
  -- es: [{"label": "Budget Richiesto", "type": "number"}, {"label": "Location", "type": "map"}]
  form_schema JSONB DEFAULT '[]'::jsonb 
);

CREATE TABLE statuses (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE, -- 'approved'
  labels JSONB NOT NULL DEFAULT '{}'::jsonb, -- {"it": "Approvata"}
  colour VARCHAR(7) DEFAULT '#5b6f82'
);

CREATE TABLE proposals (
  id SERIAL PRIMARY KEY,
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
  file_type VARCHAR(50), -- es 'pdf'
  file_name VARCHAR(255),
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
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
  order_index INTEGER DEFAULT 0 -- mantiene l'ordine delle domande nel sondaggio
);

CREATE TABLE poll_options (
  id SERIAL PRIMARY KEY,
  question_id INTEGER NOT NULL REFERENCES poll_questions(id) ON DELETE CASCADE,
  text VARCHAR(255) NOT NULL, 
  order_index INTEGER DEFAULT 0 -- mantiene l'ordine delle opzioni nella domanda
);

CREATE TABLE poll_answers (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  question_id INTEGER NOT NULL REFERENCES poll_questions(id) ON DELETE CASCADE,
  selected_option_id INTEGER REFERENCES poll_options(id),
  text_response TEXT, -- per risposte aperte e risposte ad opzione 'Altro'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT uq_one_answer_per_question UNIQUE (user_id, question_id)
);

CREATE TABLE proposal_votes (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  proposal_id INTEGER NOT NULL REFERENCES proposals(id) ON DELETE CASCADE,
  
  proposal_version INTEGER NOT NULL, 
  
  vote_value INTEGER NOT NULL CHECK (vote_value IN (-1, 1)),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT uq_vote_version UNIQUE (user_id, proposal_id, proposal_version)
);

/*
CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  proposal_id INTEGER NOT NULL REFERENCES proposals(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
*/

CREATE TABLE favourites (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  proposal_id INTEGER NOT NULL REFERENCES proposals(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT uq_fav_proposal UNIQUE (user_id, proposal_id)
);

CREATE TABLE user_views (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  proposal_id INTEGER NOT NULL REFERENCES proposals(id) ON DELETE CASCADE,
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT uq_view_proposal UNIQUE (user_id, proposal_id)
);

CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    /*
  esempi di tipi di notifica:
     'proposal_approved', 
     'proposal_rejected',
     'new_comment', 
     'poll_closing_soon',
     'system_warning'

  si potrebbe usare un enum anche qua ma qui non sono fisse le notifiche 
  (cambiano spesso, ad es. aggiungere tipo 'badge_earned' 
  significa fare ALTER TABLE ...) quindi si dovrebbero gestire dal backend 
  */

  notification_type VARCHAR(50) NOT NULL, 
  title VARCHAR(255) NOT NULL,
  message TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  related_object_id INTEGER, 
  related_object_type entity_type, 
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_sanctions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  moderator_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  sanction_type sanction_type NOT NULL, 
  reason TEXT NOT NULL,
  expires_at TIMESTAMPTZ, 
  created_at TIMESTAMPTZ DEFAULT NOW()
);