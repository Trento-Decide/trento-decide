INSERT INTO role (id, name) VALUES
(1, 'amministratore'),
(2, 'moderatore'),
(3, 'cittadino');

INSERT INTO status (id, name) VALUES
(1, 'bozza'),
(2, 'pubblicata'),
(3, 'in valutazione'),
(4, 'accettata'),
(5, 'rifiutata'),
(6, 'in attuazione'),
(7, 'completata');

INSERT INTO category (id, name) VALUES
(1, 'Urbanistica'),
(2, 'Ambiente'),
(3, 'Sicurezza'),
(4, 'Cultura'),
(5, 'Istruzione'),
(6, 'Innovazione'),
(7, 'Mobilità e Trasporti'),
(8, 'Welfare'),
(9, 'Sport');

INSERT INTO "user" (id, username, email, password_hash, notifications, role_id) VALUES
(1, 'admin', 'admin@example.com',
 '$2b$10$QYwn4Zp/jIg9NKRb0zrZauBhjegjsMbhr5lQSpZirMLguCSeBejxa',
 TRUE, 1),

(2, 'mod_marta', 'marta.moderatore@example.com',
 '$2b$10$QYwn4Zp/jIg9NKRb0zrZauBhjegjsMbhr5lQSpZirMLguCSeBejxa',
 TRUE, 2),

(3, 'alice', 'alice@example.com',
 '$2b$10$QYwn4Zp/jIg9NKRb0zrZauBhjegjsMbhr5lQSpZirMLguCSeBejxa',
 TRUE, 3),
(4, 'bob', 'bob@example.com',
 '$2b$10$QYwn4Zp/jIg9NKRb0zrZauBhjegjsMbhr5lQSpZirMLguCSeBejxa',
 TRUE, 3);

INSERT INTO proposal (id, title, description, category_id, creation_date, status_id, user_id) VALUES
(1, 'Nuovo parco per cani',
 'Creazione di un parco recintato per cani con giochi e fontanelle.',
 2, NOW() - INTERVAL '5 days', 2, 3),
(2, 'Corso di pittura gratuito',
 'Organizzazione di un corso di pittura per principianti.',
 4, NOW() - INTERVAL '10 days', 2, 4);

INSERT INTO favorite (user_id, proposal_id) VALUES
 (3, 2),
 (4, 1);
