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
(1, 'admin', 'admin@trentodecide.it',
 '$2b$10$QYwn4Zp/jIg9NKRb0zrZauBhjegjsMbhr5lQSpZirMLguCSeBejxa',
 TRUE, 1),

(2, 'mod_marta', 'marta.moderatore@trentodecide.it',
 '$2b$10$QYwn4Zp/jIg9NKRb0zrZauBhjegjsMbhr5lQSpZirMLguCSeBejxa',
 TRUE, 2),
(3, 'mod_simone', 'simone.moderatore@trentodecide.it',
 '$2b$10$QYwn4Zp/jIg9NKRb0zrZauBhjegjsMbhr5lQSpZirMLguCSeBejxa',
 FALSE, 2),
(4, 'mod_luca', 'luca.moderatore@trentodecide.it',
 '$2b$10$QYwn4Zp/jIg9NKRb0zrZauBhjegjsMbhr5lQSpZirMLguCSeBejxa',
 TRUE, 2),

(5, 'marco', 'marco.rossi@example.com',
 '$2b$10$QYwn4Zp/jIg9NKRb0zrZauBhjegjsMbhr5lQSpZirMLguCSeBejxa',
 FALSE, 3),
(6, 'giulia', 'giulia.bianchi@example.com',
 '$2b$10$QYwn4Zp/jIg9NKRb0zrZauBhjegjsMbhr5lQSpZirMLguCSeBejxa',
 TRUE, 3),
(7, 'federico', 'federico.verdi@example.com',
 '$2b$10$QYwn4Zp/jIg9NKRb0zrZauBhjegjsMbhr5lQSpZirMLguCSeBejxa',
 FALSE, 3),
(8, 'chiara', 'chiara.neri@example.com',
 '$2b$10$QYwn4Zp/jIg9NKRb0zrZauBhjegjsMbhr5lQSpZirMLguCSeBejxa',
 TRUE, 3),
(9, 'andrea', 'andrea.galli@example.com',
 '$2b$10$QYwn4Zp/jIg9NKRb0zrZauBhjegjsMbhr5lQSpZirMLguCSeBejxa',
 FALSE, 3),
(10, 'paolo', 'paolo.rizzi@example.com',
 '$2b$10$QYwn4Zp/jIg9NKRb0zrZauBhjegjsMbhr5lQSpZirMLguCSeBejxa',
 FALSE, 3),
(11, 'francesca', 'francesca.vitali@example.com',
 '$2b$10$QYwn4Zp/jIg9NKRb0zrZauBhjegjsMbhr5lQSpZirMLguCSeBejxa',
 TRUE, 3),
(12, 'sofia', 'sofia.fontana@example.com',
 '$2b$10$QYwn4Zp/jIg9NKRb0zrZauBhjegjsMbhr5lQSpZirMLguCSeBejxa',
 TRUE, 3),
(13, 'davide', 'davide.moretti@example.com',
 '$2b$10$QYwn4Zp/jIg9NKRb0zrZauBhjegjsMbhr5lQSpZirMLguCSeBejxa',
 FALSE, 3),
(14, 'ilaria', 'ilaria.greco@example.com',
 '$2b$10$QYwn4Zp/jIg9NKRb0zrZauBhjegjsMbhr5lQSpZirMLguCSeBejxa',
 FALSE, 3),
(15, 'stefano', 'stefano.messina@example.com',
 '$2b$10$QYwn4Zp/jIg9NKRb0zrZauBhjegjsMbhr5lQSpZirMLguCSeBejxa',
 TRUE, 3),
(16, 'bianca', 'bianca.sala@example.com',
 '$2b$10$QYwn4Zp/jIg9NKRb0zrZauBhjegjsMbhr5lQSpZirMLguCSeBejxa',
 FALSE, 3),
(17, 'giorgio', 'giorgio.lombardi@example.com',
 '$2b$10$QYwn4Zp/jIg9NKRb0zrZauBhjegjsMbhr5lQSpZirMLguCSeBejxa',
 TRUE, 3),
(18, 'valentina', 'valentina.riva@example.com',
 '$2b$10$QYwn4Zp/jIg9NKRb0zrZauBhjegjsMbhr5lQSpZirMLguCSeBejxa',
 TRUE, 3);

INSERT INTO poll (id, title, description, category_id, finish_date, creation_date) VALUES
(1, 'Nuove piste ciclabili in centro',
 'Realizzazione di nuove piste ciclabili nelle vie principali del centro storico.',
 7, NOW() + INTERVAL '14 days', NOW() - INTERVAL '2 days'),
(2, 'Riduzione plastica monouso nei parchi',
 'Proposta per eliminare la plastica monouso nelle aree verdi e nei parchi pubblici.',
 2, NOW() + INTERVAL '10 days', NOW() - INTERVAL '1 day'),
(3, 'Illuminazione aree verdi periferiche',
 'Aumento dell’illuminazione nei parchi periferici per migliorare la sicurezza.',
 3, NOW() + INTERVAL '20 days', NOW() - INTERVAL '3 days'),
(4, 'Festival culturale cittadino',
 'Organizzazione di un festival culturale annuale con musica, teatro e arte di strada.',
 4, NOW() + INTERVAL '30 days', NOW() - INTERVAL '5 days'),
(5, 'Ristrutturazione scuole elementari',
 'Piano di ristrutturazione e messa in sicurezza delle scuole elementari.',
 5, NOW() + INTERVAL '25 days', NOW() - INTERVAL '4 days'),
(6, 'WiFi pubblico nelle piazze principali',
 'Installazione di hotspot WiFi gratuiti nelle principali piazze della città.',
 6, NOW() + INTERVAL '18 days', NOW() - INTERVAL '2 days'),
(7, 'Sostegno alle famiglie fragili',
 'Ampliamento dei servizi di supporto alle famiglie in difficoltà economica.',
 8, NOW() + INTERVAL '22 days', NOW() - INTERVAL '1 day'),
(8, 'Nuovo palazzetto dello sport',
 'Costruzione o ristrutturazione di un palazzetto per attività sportive indoor.',
 9, NOW() + INTERVAL '28 days', NOW() - INTERVAL '6 days'),
(9, 'Piano regolatore quartiere nord',
 'Revisione del piano regolatore per il quartiere nord della città.',
 1, NOW() + INTERVAL '40 days', NOW() - INTERVAL '7 days'),
(10,'Verde urbano e nuove alberature',
 'Piantumazione di nuovi alberi lungo i viali principali.',
 2, NOW() + INTERVAL '16 days', NOW() - INTERVAL '2 days');

INSERT INTO poll_choice (id, poll_id, choice_name) VALUES
(1, 1, 'Si'),
(2, 1, 'No'),
(3, 1, 'Non so'),

(4, 2, 'Si'),
(5, 2, 'No'),
(6, 2, 'Non so'),

(7, 3, 'Si'),
(8, 3, 'No'),
(9, 3, 'Non so'),

(10, 4, 'Si'),
(11, 4, 'No'),
(12, 4, 'Non so'),

(13, 5, 'Si'),
(14, 5, 'No'),
(15, 5, 'Non so'),

(16, 6, 'Si'),
(17, 6, 'No'),
(18, 6, 'Non so'),

(19, 7, 'Si'),
(20, 7, 'No'),
(21, 7, 'Non so'),

(22, 8, 'Si'),
(23, 8, 'No'),
(24, 8, 'Non so'),

(25, 9, 'Si'),
(26, 9, 'No'),
(27, 9, 'Non so'),

(28, 10, 'Si'),
(29, 10, 'No'),
(30, 10, 'Non so');

INSERT INTO proposal (id, title, description, category_id, creation_date, proposal_status_id, user_id) VALUES
(1, 'Nuovo parco in via Brescia',
 'Creazione di un parco di quartiere con area giochi e zona verde.',
 2, NOW() - INTERVAL '10 days', 3, 5),   

(2, 'Rotatoria in incrocio pericoloso',
 'Realizzazione di una rotatoria in un incrocio a forte incidentalità.',
 3, NOW() - INTERVAL '20 days', 4, 6),  

(3, 'Pedonalizzazione del centro storico',
 'Trasformare alcune vie centrali in aree pedonali permanenti.',
 7, NOW() - INTERVAL '15 days', 2, 7),   

(4, 'WiFi gratuito in biblioteca comunale',
 'Installazione di WiFi gratuito all’interno della biblioteca principale.',
 6, NOW() - INTERVAL '5 days', 1, 8),   

(5, 'Pista ciclabile lungo il fiume',
 'Creazione di una pista ciclabile sicura lungo l’argine del fiume.',
 7, NOW() - INTERVAL '30 days', 6, 9),   

(6, 'Nuova scuola materna in zona sud',
 'Costruzione di una scuola materna per il quartiere sud.',
 5, NOW() - INTERVAL '25 days', 3, 10),   

(7, 'Festival di teatro di strada',
 'Organizzazione di un festival annuale di teatro di strada in centro.',
 4, NOW() - INTERVAL '18 days', 2, 11),   

(8, 'Sportello psicologico comunale',
 'Attivazione di uno sportello di supporto psicologico gratuito.',
 8, NOW() - INTERVAL '16 days', 3, 12),  

(9, 'Centro polifunzionale sportivo',
 'Realizzazione di un centro sportivo polifunzionale con più campi.',
 9, NOW() - INTERVAL '22 days', 2, 13), 

(10, 'Riqualificazione della piazza centrale',
 'Nuovo arredo urbano, pavimentazione e verde in piazza principale.',
 1, NOW() - INTERVAL '28 days', 4, 14),  

(11, 'Alberi in tutte le vie principali',
 'Piantumazione di alberi lungo le tratte principali della città.',
 2, NOW() - INTERVAL '35 days', 6, 15),  

(12, 'Rampe di accesso per disabili nelle scuole',
 'Installazione di rampe e ascensori per garantire accessibilità.',
 5, NOW() - INTERVAL '40 days', 5, 16),  

(13, 'Videosorveglianza nei parchi pubblici',
 'Installazione di telecamere per ridurre vandalismi e reati.',
 3, NOW() - INTERVAL '18 days', 3, 17),  

(14, 'Laboratori STEM nelle scuole',
 'Creazione di laboratori di scienze e tecnologia nelle scuole.',
 5, NOW() - INTERVAL '14 days', 2, 18),   

(15, 'App segnalazioni buche stradali',
 'Applicazione mobile per segnalare buche e problemi stradali.',
 6, NOW() - INTERVAL '12 days', 4, 5),   

(16, 'Potenziamento linee bus serali',
 'Aumento delle corse autobus in fascia serale.',
 7, NOW() - INTERVAL '26 days', 6, 6),  

(17, 'Supporto agli anziani soli',
 'Programmi di visita e supporto per anziani in solitudine.',
 8, NOW() - INTERVAL '24 days', 4, 7),  

(18, 'Campi da basket di quartiere',
 'Realizzazione di campi da basket all’aperto nei quartieri.',
 9, NOW() - INTERVAL '8 days', 2, 8),    

(19, 'Housing universitario diffuso',
 'Creazione di una rete di alloggi convenzionati per studenti.',
 1, NOW() - INTERVAL '32 days', 3, 9),   

(20, 'Festa della musica cittadina',
 'Evento musicale diffuso in vari punti della città.',
 4, NOW() - INTERVAL '50 days', 7, 10);

 INSERT INTO favorite (user_id, proposal_id) VALUES
 (5, 11),
 (5, 12),
 (4, 3);

INSERT INTO proposal_status (proposal_id, status_id, motivation) VALUES
(1, 1, NULL),
(1, 2, NULL),
(1, 3, NULL),

(2, 1, NULL),
(2, 2, NULL),
(2, 3, NULL),
(2, 4, 'Intervento approvato per ridurre l’incidentalità.'),

(3, 1, NULL),
(3, 2, NULL),

(4, 1, NULL),

(5, 1, NULL),
(5, 2, NULL),
(5, 3, NULL),
(5, 6, NULL),

(6, 1, NULL),
(6, 2, NULL),
(6, 3, NULL),

(7, 1, NULL),
(7, 2, NULL),

(8, 1, NULL),
(8, 2, NULL),
(8, 3, NULL),

(9, 1, NULL),
(9, 2, NULL),

(10, 1, NULL),
(10, 2, NULL),
(10, 3, NULL),
(10, 4, 'Riqualificazione della piazza ritenuta strategica per il centro.'),

(11, 1, NULL),
(11, 2, NULL),
(11, 3, NULL),
(11, 4, 'Piano del verde giudicato sostenibile e prioritario.'),
(11, 6, NULL),

(12, 1, NULL),
(12, 2, NULL),
(12, 3, NULL),
(12, 5, 'Intervento rinviato per mancanza di fondi disponibili.'),

(13, 1, NULL),
(13, 2, NULL),
(13, 3, NULL),

(14, 1, NULL),
(14, 2, NULL),

(15, 1, NULL),
(15, 2, NULL),
(15, 3, NULL),
(15, 4, 'Soluzione digitale ritenuta efficace e a basso costo.'),

(16, 1, NULL),
(16, 2, NULL),
(16, 3, NULL),
(16, 4, 'Potenziamento del servizio serale approvato.'),
(16, 6, NULL),

(17, 1, NULL),
(17, 2, NULL),
(17, 3, NULL),
(17, 4, 'Programma di supporto sociale approvato.'),

(18, 1, NULL),
(18, 2, NULL),

(19, 1, NULL),
(19, 2, NULL),
(19, 3, NULL),

(20, 1, NULL),
(20, 2, NULL),
(20, 3, NULL),
(20, 4, 'Evento ritenuto di alto valore culturale.'),
(20, 6, NULL),
(20, 7, NULL);

INSERT INTO proposal_vote (user_id, proposal_id, value) VALUES
(5, 1, TRUE),
(6, 1, TRUE),
(7, 1, FALSE),

(8, 2, TRUE),
(9, 2, TRUE),
(10, 2, TRUE),

(11, 3, TRUE),
(12, 3, FALSE),

(13, 4, TRUE),

(14, 5, TRUE),
(15, 5, TRUE),
(16, 5, TRUE),
(17, 5, FALSE),

(18, 6, TRUE),
(17, 6, TRUE),

(5, 7, TRUE),
(18, 7, TRUE),

(6, 8, TRUE),
(7, 8, FALSE),

(8, 9, TRUE),
(9, 9, TRUE),
(10, 9, FALSE),

(11, 10, TRUE),
(12, 10, TRUE),

(13, 11, TRUE),
(14, 11, TRUE),

(15, 12, FALSE),
(16, 12, FALSE),

(17, 13, TRUE),
(18, 13, TRUE),

(5, 14, TRUE),
(6, 14, TRUE),

(7, 15, TRUE),
(8, 15, TRUE),

(9, 16, TRUE),
(10, 16, TRUE),

(11, 17, TRUE),
(12, 17, TRUE),

(13, 18, TRUE),
(14, 18, FALSE),

(15, 19, TRUE),
(16, 19, TRUE),

(17, 20, TRUE),
(18, 20, TRUE);

INSERT INTO poll_vote (user_id, poll_id, poll_choice_id) VALUES
(5, 1, 1),
(6, 1, 1),
(7, 1, 2),

(8, 2, 4),
(9, 2, 4),
(10, 2, 5),

(11, 3, 7),
(12, 3, 7),
(13, 3, 8),

(14, 4, 10),
(15, 4, 10),
(16, 4, 12),

(17, 5, 13),
(18, 5, 13),
(16, 5, 14),

(17, 6, 16),
(5,  6, 16),
(6,  6, 17),

(7,  7, 19),
(8,  7, 19),
(9,  7, 21),

(10, 8, 22),
(11, 8, 22),
(12, 8, 23),

(13, 9, 25),
(14, 9, 25),
(15, 9, 26),

(16,10, 28),
(17,10, 28),
(18,10, 29);

INSERT INTO moderation (id, motivation, author_id, user_id, action_end) VALUES
(1, 'Commenti offensivi verso altri utenti.', 2, 5, NOW() + INTERVAL '3 days'),
(2, 'Spam ripetuto su più proposte.', 3, 9, NOW() + INTERVAL '7 days'),
(3, 'Contenuti non attinenti al tema della piattaforma.', 4, 10, NOW() + INTERVAL '2 days'),
(4, 'Segnalazioni false ripetute.', 2, 13, NOW() + INTERVAL '5 days');

INSERT INTO user_view (user_id, proposal_id, last_seen) VALUES
(5,  1, NOW() - INTERVAL '1 hour'),
(6,  1, NOW() - INTERVAL '2 hours'),
(7,  2, NOW() - INTERVAL '3 hours'),
(8,  3, NOW() - INTERVAL '30 minutes'),
(9,  4, NOW() - INTERVAL '5 hours'),
(10, 5, NOW() - INTERVAL '1 day'),
(11, 6, NOW() - INTERVAL '2 days'),
(12, 7, NOW() - INTERVAL '3 days'),
(13, 8, NOW() - INTERVAL '4 hours'),
(14, 9, NOW() - INTERVAL '6 hours'),
(15,10, NOW() - INTERVAL '45 minutes'),
(16,11, NOW() - INTERVAL '5 days'),
(17,12, NOW() - INTERVAL '7 days'),
(18,13, NOW() - INTERVAL '2 days'),
(17,14, NOW() - INTERVAL '8 hours'),
(18,15, NOW() - INTERVAL '10 hours');