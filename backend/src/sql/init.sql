CREATE TYPE sex_enum AS ENUM ('Maschio', 'Femmina');

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    sex sex_enum NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    label VARCHAR(100) NOT NULL
);

CREATE TABLE proposal_info (
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category_id INTEGER REFERENCES categories(id)
);

CREATE TABLE proposals (
    LIKE proposal_info INCLUDING ALL,
    id SERIAL PRIMARY KEY,
    status VARCHAR(50) NOT NULL,
    vote_count INTEGER DEFAULT 0,
    author_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE proposal_version (
    LIKE proposal_info INCLUDING ALL,
    id SERIAL PRIMARY KEY,
    proposal_id INTEGER REFERENCES proposals(id),
    votes_at_edit INTEGER NOT NULL,
    editor_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE proposal_changes (
    LIKE proposal_info INCLUDING ALL,
    id SERIAL PRIMARY KEY,
    proposal_id INTEGER REFERENCES proposals(id) ON DELETE CASCADE,
    change_description TEXT,
    editor_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE proposal_votes (
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    proposal_id INTEGER REFERENCES proposals(id) ON DELETE CASCADE,
    vote SMALLINT NOT NULL CHECK (vote IN (-1, 1)),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, proposal_id)
);

CREATE TABLE favorite_proposals (
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    proposal_id INTEGER REFERENCES proposals(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, proposal_id)
);

INSERT INTO categories (label) VALUES
    ('Urbanistica'),
    ('Ambiente'),
    ('Sicurezza'),
    ('Cultura'),
    ('Istruzione'),
    ('Innovazione'),
    ('Mobilità e Trasporti'),
    ('Welfare'),
    ('Sport');
