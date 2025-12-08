INSERT INTO users (username, email, password_hash, first_name, last_name, sex)
VALUES
    ('alice','alice@example.com','$2b$10$QYwn4Zp/jIg9NKRb0zrZauBhjegjsMbhr5lQSpZirMLguCSeBejxa','Alice','Rossi','Femmina'),
    ('bob','bob@example.com','$2b$10$QYwn4Zp/jIg9NKRb0zrZauBhjegjsMbhr5lQSpZirMLguCSeBejxa','Bob','Bianchi','Maschio');

INSERT INTO proposals (title, description, category_id, status, author_id)
VALUES
    ('Alice''s Proposal', 'A proposal by Alice', 3, 'open', (SELECT id FROM users WHERE username = 'alice')),
    ('Bob''s Proposal', 'A proposal by Bob', 3, 'open', (SELECT id FROM users WHERE username = 'bob'));

WITH user_ids AS (
    SELECT id FROM users WHERE username = 'bob'
), proposal_ids AS (
    SELECT id FROM proposals WHERE author_id = (SELECT id FROM users WHERE username = 'alice') LIMIT 1
)
INSERT INTO proposal_votes (user_id, proposal_id, vote)
SELECT u.id, p.id, 1 FROM user_ids u, proposal_ids p;

WITH user_ids AS (
    SELECT id FROM users WHERE username = 'alice'
), proposal_ids AS (
    SELECT id FROM proposals WHERE author_id = (SELECT id FROM users WHERE username = 'bob') LIMIT 1
)
INSERT INTO proposal_votes (user_id, proposal_id, vote)
SELECT u.id, p.id, 1 FROM user_ids u, proposal_ids p;

WITH user_ids AS (
    SELECT id FROM users WHERE username = 'bob'
), proposal_ids AS (
    SELECT id FROM proposals WHERE author_id = (SELECT id FROM users WHERE username = 'alice') LIMIT 1
)
INSERT INTO favorite_proposals (user_id, proposal_id)
SELECT u.id, p.id FROM user_ids u, proposal_ids p;

WITH user_ids AS (
    SELECT id FROM users WHERE username = 'alice'
), proposal_ids AS (
    SELECT id FROM proposals WHERE author_id = (SELECT id FROM users WHERE username = 'bob') LIMIT 1
)
INSERT INTO favorite_proposals (user_id, proposal_id)
SELECT u.id, p.id FROM user_ids u, proposal_ids p;

INSERT INTO proposal_changes (proposal_id, title, description, category_id, change_description, editor_id)
VALUES
    ((SELECT id FROM proposals WHERE author_id = (SELECT id FROM users WHERE username = 'alice') LIMIT 1), 'Alice''s Proposal', 'A proposal by Alice', 3, 'Initial creation', (SELECT id FROM users WHERE username = 'alice')),
    ((SELECT id FROM proposals WHERE author_id = (SELECT id FROM users WHERE username = 'bob') LIMIT 1), 'Bob''s Proposal', 'A proposal by Bob', 3, 'Initial creation', (SELECT id FROM users WHERE username = 'bob'));

INSERT INTO proposal_version (proposal_id, title, description, category_id, votes_at_edit, editor_id)
VALUES
    ((SELECT id FROM proposals WHERE author_id = (SELECT id FROM users WHERE username = 'alice') LIMIT 1), 'Alice''s Proposal', 'A proposal by Alice', 3, 0, (SELECT id FROM users WHERE username = 'alice')),
    ((SELECT id FROM proposals WHERE author_id = (SELECT id FROM users WHERE username = 'bob') LIMIT 1), 'Bob''s Proposal', 'A proposal by Bob', 3, 0, (SELECT id FROM users WHERE username = 'bob'));
