INSERT INTO users (username, email, password_hash, role_id, email_opt_in) VALUES
('admin', 'admin@example.com', 
 '$2b$10$QYwn4Zp/jIg9NKRb0zrZauBhjegjsMbhr5lQSpZirMLguCSeBejxa', 
 (SELECT id FROM roles WHERE code = 'admin'), TRUE),

('mod_marta', 'marta.moderatore@example.com', 
 '$2b$10$QYwn4Zp/jIg9NKRb0zrZauBhjegjsMbhr5lQSpZirMLguCSeBejxa', 
 (SELECT id FROM roles WHERE code = 'moderatore'), TRUE),

('alice', 'alice@example.com', 
 '$2b$10$QYwn4Zp/jIg9NKRb0zrZauBhjegjsMbhr5lQSpZirMLguCSeBejxa', 
 (SELECT id FROM roles WHERE code = 'cittadino'), TRUE),

('bob', 'bob@example.com', 
 '$2b$10$QYwn4Zp/jIg9NKRb0zrZauBhjegjsMbhr5lQSpZirMLguCSeBejxa', 
 (SELECT id FROM roles WHERE code = 'cittadino'), TRUE);

 ('enpa', 'enpa@example.com', 
 '$2b$10$QYwn4Zp/jIg9NKRb0zrZauBhjegjsMbhr5lQSpZirMLguCSeBejxa', 
 (SELECT id FROM roles WHERE code = 'associazione'), TRUE);


INSERT INTO proposals (title, description, vote_value, category_id, status_id, author_id, created_at, additional_data) VALUES
('Nuovo parco per cani',
 'Creazione di un parco recintato per cani con giochi e fontanelle.',
 1,
 (SELECT id FROM categories WHERE code = 'ambiente'),
 (SELECT id FROM statuses WHERE code = 'pubblicata'),
 (SELECT id FROM users WHERE username = 'alice'),
 NOW() - INTERVAL '5 days',
 '{"budget": 5000, "impatto": "Miglioramento benessere animale"}'::jsonb);

INSERT INTO proposals (title, description, vote_value, category_id, status_id, author_id, created_at, additional_data) VALUES
('Corso di pittura gratuito',
 'Organizzazione di un corso di pittura per principianti nel weekend.',
 0,
 (SELECT id FROM categories WHERE code = 'cultura'),
 (SELECT id FROM statuses WHERE code = 'pubblicata'),
 (SELECT id FROM users WHERE username = 'bob'),
 NOW() - INTERVAL '10 days',
 '{}'::jsonb);

INSERT INTO proposal_history (proposal_id, version, title, description, additional_data) 
SELECT id, current_version, title, description, additional_data FROM proposals;


INSERT INTO proposal_votes (user_id, proposal_id, proposal_version, vote_value) VALUES
((SELECT id FROM users WHERE username = 'bob'), 
 (SELECT id FROM proposals WHERE title = 'Nuovo parco per cani'), 
 1, 1);

INSERT INTO favourites (user_id, proposal_id) VALUES
((SELECT id FROM users WHERE username = 'alice'), 
 (SELECT id FROM proposals WHERE title = 'Corso di pittura gratuito'));

WITH new_poll AS (
  INSERT INTO polls (title, description, category_id, created_by, is_active, expires_at) 
  VALUES (
    'Quale priorità per il 2024?',
    'Aiutaci a decidere su cosa investire il budget annuale.',
    (SELECT id FROM categories WHERE code = 'urbanistica'),
    (SELECT id FROM users WHERE username = 'mod_marta'),
    TRUE,
    NOW() + INTERVAL '30 days'
  ) RETURNING id
)
INSERT INTO poll_questions (poll_id, text, order_index) 
SELECT id, 'Quale settore necessita di più fondi?', 0 FROM new_poll;

INSERT INTO poll_options (question_id, text, order_index)
VALUES 
((SELECT id FROM poll_questions LIMIT 1), 'Manutenzione Strade', 0),
((SELECT id FROM poll_questions LIMIT 1), 'Verde Pubblico', 1),
((SELECT id FROM poll_questions LIMIT 1), 'Scuole', 2);