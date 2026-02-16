
INSERT INTO users (username, email, password_hash, role_id, email_opt_in) VALUES

('admin', 'admin@trentodecide.it', '$2b$10$9LLKaiJNpQqwM9/KNwPcyeXc.nlFNfPxzqiG4.WibZS7mJRznG25C', (SELECT id FROM roles WHERE code = 'admin'), TRUE),
('mod_marta', 'marta@trento.it', '$2b$10$QYwn4Zp/jIg9NKRb0zrZauBhjegjsMbhr5lQSpZirMLguCSeBejxa', (SELECT id FROM roles WHERE code = 'moderatore'), TRUE),

('alice', 'alice@test.com', '$2b$10$QYwn4Zp/jIg9NKRb0zrZauBhjegjsMbhr5lQSpZirMLguCSeBejxa', (SELECT id FROM roles WHERE code = 'cittadino'), TRUE),
('bob', 'bob@test.com', '$2b$10$QYwn4Zp/jIg9NKRb0zrZauBhjegjsMbhr5lQSpZirMLguCSeBejxa', (SELECT id FROM roles WHERE code = 'cittadino'), TRUE),
('giulia_90', 'giulia@test.com', '$2b$10$QYwn4Zp/jIg9NKRb0zrZauBhjegjsMbhr5lQSpZirMLguCSeBejxa', (SELECT id FROM roles WHERE code = 'cittadino'), TRUE),
('marco_tn', 'marco@test.com', '$2b$10$QYwn4Zp/jIg9NKRb0zrZauBhjegjsMbhr5lQSpZirMLguCSeBejxa', (SELECT id FROM roles WHERE code = 'cittadino'), TRUE),
('sara_design', 'sara@test.com', '$2b$10$QYwn4Zp/jIg9NKRb0zrZauBhjegjsMbhr5lQSpZirMLguCSeBejxa', (SELECT id FROM roles WHERE code = 'cittadino'), TRUE),
('luca_dev', 'luca@test.com', '$2b$10$QYwn4Zp/jIg9NKRb0zrZauBhjegjsMbhr5lQSpZirMLguCSeBejxa', (SELECT id FROM roles WHERE code = 'cittadino'), TRUE),

('fiab_trento', 'bici@fiab.it', '$2b$10$QYwn4Zp/jIg9NKRb0zrZauBhjegjsMbhr5lQSpZirMLguCSeBejxa', (SELECT id FROM roles WHERE code = 'associazione'), TRUE),
('legambiente', 'info@lega.it', '$2b$10$QYwn4Zp/jIg9NKRb0zrZauBhjegjsMbhr5lQSpZirMLguCSeBejxa', (SELECT id FROM roles WHERE code = 'associazione'), TRUE),
('teatro_sociale', 'art@teatro.it', '$2b$10$QYwn4Zp/jIg9NKRb0zrZauBhjegjsMbhr5lQSpZirMLguCSeBejxa', (SELECT id FROM roles WHERE code = 'associazione'), TRUE);


INSERT INTO proposals (title, description, category_id, status_id, author_id, created_at, additional_data) VALUES
('Riqualificazione Piazza Dante: più verde e sicurezza', 
 'Proponiamo di rimuovere l''asfalto nella zona nord per creare un''area verde attrezzata per famiglie. Il progetto prevede anche l''installazione di nuove telecamere.',
 (SELECT id FROM categories WHERE code = 'urbanistica'),
 (SELECT id FROM statuses WHERE code = 'in_valutazione'),
 (SELECT id FROM users WHERE username = 'alice'),
 NOW() - INTERVAL '3 days',
 '{"tipo_intervento": "riqualificazione", "area_interesse": "{\"type\":\"Polygon\",\"coordinates\":[[[11.119,46.071],[11.121,46.071],[11.121,46.073],[11.119,46.073],[11.119,46.071]]]}"}'::jsonb),

('Nuova pista ciclabile Piedicastello - Vela', 
 'Collegamento strategico per i pendolari che arrivano da ovest. Necessaria separazione fisica dalla carreggiata per garantire la sicurezza dei ciclisti.',
 (SELECT id FROM categories WHERE code = 'mobilita_trasporti'),
 (SELECT id FROM statuses WHERE code = 'pubblicata'),
 (SELECT id FROM users WHERE username = 'fiab_trento'),
 NOW() - INTERVAL '5 hours',
 '{"ambito": "ciclabile", "punto_mappa": "{\"type\":\"Point\",\"coordinates\":[11.115,46.072]}"}'::jsonb),

('Festival degli Artisti di Strada - Edizione 2024', 
 'Un weekend di arte diffusa nel centro storico. Richiediamo l''occupazione suolo pubblico gratuita per permettere esibizioni in Via Belenzani e Piazza Duomo.',
 (SELECT id FROM categories WHERE code = 'cultura'),
 (SELECT id FROM statuses WHERE code = 'approvata'),
 (SELECT id FROM users WHERE username = 'teatro_sociale'),
 NOW() - INTERVAL '2 months',
 '{"titolo_evento": "Trento Buskers", "data_inizio": "2024-06-15", "location": "piazza", "richiesta_patrocinio": true}'::jsonb),

('Installazione cestini intelligenti nel centro', 
 'I cestini attuali sono spesso pieni. Proponiamo cestini con compattatore solare.',
 (SELECT id FROM categories WHERE code = 'ambiente'),
 (SELECT id FROM statuses WHERE code = 'bozza'),
 (SELECT id FROM users WHERE username = 'bob'),
 NOW(),
 '{"budget": 15000, "tematiche": ["rifiuti"], "impatto": "Migliore decoro urbano"}'::jsonb);


DO $$
DECLARE
    -- Seed stabile per avere sempre gli stessi dati
    seed_val float := 0.42; 
    
    i INT;
    titles text[] := ARRAY['Rifacimento marciapiede', 'Illuminazione LED', 'Panchine smart', 'Area cani', 'Sicurezza notturna', 'Potenziamento bus', 'Pulizia strade', 'Orto condiviso', 'Torneo sportivo', 'Corso digitale', 'Festival cibo', 'Ristrutturazione', 'Sportello ascolto', 'Ciclabile turistica'];
    places text[] := ARRAY['Povo', 'Mattarello', 'Sardagna', 'Bondone', 'Villazzano', 'Via Belenzani', 'Lungoadige', 'Gocciadoro', 'Piazza Fiera', 'Stazione', 'Gardolo', 'Clarina', 'San Donà', 'Cristo Re'];
    cats text[] := ARRAY['urbanistica', 'sicurezza', 'ambiente', 'mobilita_trasporti', 'cultura', 'sport', 'innovazione', 'istruzione', 'welfare'];
    statuses text[] := ARRAY['pubblicata', 'pubblicata', 'pubblicata', 'in_valutazione', 'approvata', 'respinta', 'completata'];
    
    rnd_title text;
    rnd_desc text;
    rnd_cat text;
    rnd_status text;
    rnd_user_id int;
    rnd_days int;
    rnd_json jsonb;
    
    base_lat float := 46.06;
    base_lng float := 11.12;
    curr_lat float;
    curr_lng float;
BEGIN
    PERFORM setseed(seed_val);

    FOR i IN 1..60 LOOP
        rnd_cat := cats[1 + floor(random() * array_length(cats, 1))::int];
        rnd_title := titles[1 + floor(random() * array_length(titles, 1))::int] || ' a ' || places[1 + floor(random() * array_length(places, 1))::int];
        rnd_desc := 'L''obiettivo è migliorare la vivibilità della zona ' || split_part(rnd_title, ' a ', 2) || '.';
        rnd_status := statuses[1 + floor(random() * array_length(statuses, 1))::int];
        rnd_days := floor(random() * 200)::int;
        
        curr_lat := base_lat + (random() * 0.04 - 0.02);
        curr_lng := base_lng + (random() * 0.04 - 0.02);

        CASE rnd_cat
            WHEN 'urbanistica' THEN
                rnd_json := jsonb_build_object(
                    'tipo_intervento', (ARRAY['riqualificazione', 'nuova'])[floor(random()*2+1)],
                    'area_interesse', format('{"type":"Polygon","coordinates":[[[%s,%s],[%s,%s],[%s,%s],[%s,%s],[%s,%s]]]}', 
                        curr_lng, curr_lat, curr_lng+0.001, curr_lat, curr_lng+0.001, curr_lat+0.001, curr_lng, curr_lat+0.001, curr_lng, curr_lat)::jsonb
                );
            WHEN 'ambiente' THEN
                rnd_json := jsonb_build_object(
                    'budget', floor(random() * 20000 + 500),
                    'tematiche', jsonb_build_array((ARRAY['alberi', 'rifiuti'])[floor(random()*2+1)]),
                    'impatto', 'Miglioramento ambientale'
                );
            WHEN 'sicurezza' THEN
                rnd_json := jsonb_build_object(
                    'urgenza', (ARRAY['alta', 'media'])[floor(random()*2+1)],
                    'luogo', format('{"type":"Point","coordinates":[%s,%s]}', curr_lng, curr_lat)::jsonb
                );
            WHEN 'mobilita_trasporti' THEN
                rnd_json := jsonb_build_object(
                    'ambito', (ARRAY['ciclabile', 'bus'])[floor(random()*2+1)],
                    'punto_mappa', format('{"type":"Point","coordinates":[%s,%s]}', curr_lng, curr_lat)::jsonb
                );
            WHEN 'cultura' THEN
                rnd_json := jsonb_build_object(
                    'titolo_evento', rnd_title,
                    'data_inizio', (NOW() + (floor(random() * 30) || ' days')::interval)::date,
                    'location', (ARRAY['piazza', 'teatro'])[floor(random()*2+1)],
                    'richiesta_patrocinio', (random() > 0.5)
                );
             WHEN 'sport' THEN
                rnd_json := jsonb_build_object(
                    'impianto', (ARRAY['palestra', 'campo'])[floor(random()*2+1)],
                    'disciplina', (ARRAY['Calcio', 'Basket', 'Volley'])[floor(random()*3+1)]
                );
            ELSE
                rnd_json := '{}'::jsonb;
        END CASE;

        SELECT id INTO rnd_user_id FROM users WHERE role_id != (SELECT id FROM roles WHERE code='admin') ORDER BY random() LIMIT 1;

        INSERT INTO proposals (title, description, category_id, status_id, author_id, created_at, additional_data)
        VALUES (
            rnd_title,
            rnd_desc,
            (SELECT id FROM categories WHERE code = rnd_cat),
            (SELECT id FROM statuses WHERE code = rnd_status),
            rnd_user_id,
            NOW() - (rnd_days || ' days')::interval,
            rnd_json
        );
    END LOOP;
END $$;


DO $$
DECLARE
    seed_val float := 0.42;
    prop RECORD;
    usr RECORD;
    vote_val int;
BEGIN
    PERFORM setseed(seed_val);

    FOR prop IN SELECT id FROM proposals WHERE status_id IN (SELECT id FROM statuses WHERE code IN ('pubblicata', 'in_valutazione', 'approvata')) LOOP
        FOR usr IN SELECT id FROM users ORDER BY random() LIMIT floor(random() * 11) LOOP
            
            IF random() > 0.3 THEN vote_val := 1; ELSE vote_val := -1; END IF;

            INSERT INTO proposal_votes (user_id, proposal_id, proposal_version, vote_value)
            VALUES (usr.id, prop.id, 1, vote_val)
            ON CONFLICT DO NOTHING;
            
            IF random() > 0.8 THEN
                INSERT INTO favourites (user_id, proposal_id) VALUES (usr.id, prop.id) ON CONFLICT DO NOTHING;
            END IF;
        END LOOP;

        UPDATE proposals 
        SET vote_value = (SELECT COALESCE(SUM(vote_value), 0) FROM proposal_votes WHERE proposal_id = prop.id)
        WHERE id = prop.id;
    END LOOP;
END $$;


INSERT INTO proposal_history (proposal_id, version, title, description, additional_data) 
SELECT id, current_version, title, description, additional_data FROM proposals;

DO $$
DECLARE
    p_id INT;
    q1_id INT;
    q2_id INT;
    q3_id INT;
BEGIN
    INSERT INTO polls (title, description, category_id, created_by, is_active, expires_at, created_at) 
    VALUES (
        'Piano Mobilità Sostenibile 2030',
        'Aiutaci a definire le priorità strategiche per la viabilità dei prossimi 5 anni. Il questionario comprende 3 sezioni.',
        (SELECT id FROM categories WHERE code = 'mobilita_trasporti'),
        (SELECT id FROM users WHERE username = 'mod_marta'),
        TRUE,
        NOW() + INTERVAL '25 days',
        NOW() - INTERVAL '5 days'
    ) RETURNING id INTO p_id;

    INSERT INTO poll_questions (poll_id, text, order_index) VALUES (p_id, 'Quale dovrebbe essere la priorità di investimento principale?', 0) RETURNING id INTO q1_id;
    INSERT INTO poll_options (question_id, text, order_index) VALUES
    (q1_id, 'Nuove linee Tram/Bus elettrici', 0),
    (q1_id, 'Rete ciclabile interconnessa', 1),
    (q1_id, 'Manutenzione strade esistenti', 2),
    (q1_id, 'Parcheggi di attestamento', 3);

    INSERT INTO poll_questions (poll_id, text, order_index) VALUES (p_id, 'Sei favorevole all''estensione della ZTL alle zone limitrofe al centro?', 1) RETURNING id INTO q2_id;
    INSERT INTO poll_options (question_id, text, order_index) VALUES
    (q2_id, 'Sì, totalmente favorevole', 0),
    (q2_id, 'Sì, ma solo nei weekend', 1),
    (q2_id, 'No, penalizza il commercio', 2);

    INSERT INTO poll_questions (poll_id, text, order_index) VALUES (p_id, 'Quale servizio di sharing mobility utilizzi di più?', 2) RETURNING id INTO q3_id;
    INSERT INTO poll_options (question_id, text, order_index) VALUES
    (q3_id, 'Biciclette elettriche', 0),
    (q3_id, 'Monopattini', 1),
    (q3_id, 'Car Sharing', 2),
    (q3_id, 'Nessuno / Uso mezzo privato', 3);
END $$;

DO $$
DECLARE
    p_id INT;
    q1_id INT;
    q2_id INT;
BEGIN
    INSERT INTO polls (title, description, category_id, created_by, is_active, expires_at, created_at) 
    VALUES (
        'Bilancio Partecipativo Cultura 2023',
        'Feedback sulla stagione passata e orientamenti per il budget 2024.',
        (SELECT id FROM categories WHERE code = 'cultura'),
        (SELECT id FROM users WHERE username = 'mod_marta'),
        FALSE,
        NOW() - INTERVAL '15 days',
        NOW() - INTERVAL '45 days'
    ) RETURNING id INTO p_id;

    INSERT INTO poll_questions (poll_id, text, order_index) VALUES (p_id, 'Quale evento del 2023 hai apprezzato di più?', 0) RETURNING id INTO q1_id;
    INSERT INTO poll_options (question_id, text, order_index) VALUES
    (q1_id, 'Notte Bianca', 0),
    (q1_id, 'Festival dell''Economia', 1),
    (q1_id, 'Mercatini di Natale', 2);

    INSERT INTO poll_questions (poll_id, text, order_index) VALUES (p_id, 'Come dovremmo allocare il budget cultura 2024?', 1) RETURNING id INTO q2_id;
    INSERT INTO poll_options (question_id, text, order_index) VALUES
    (q2_id, 'Più eventi piccoli nei quartieri', 0),
    (q2_id, 'Pochi grandi eventi internazionali', 1),
    (q2_id, 'Più fondi alle biblioteche', 2);
END $$;


DO $$
DECLARE
    seed_val float := 0.42;
    poll_rec RECORD;
    question_rec RECORD;
    usr_rec RECORD;
    opt_ids INT[];
    selected_opt INT;
    has_voted boolean;
BEGIN
    PERFORM setseed(seed_val);

    FOR poll_rec IN SELECT id FROM polls LOOP
        
        FOR usr_rec IN SELECT id FROM users LOOP
            
            has_voted := (random() > 0.2);

            IF has_voted THEN
                FOR question_rec IN SELECT id FROM poll_questions WHERE poll_id = poll_rec.id LOOP
                    
                    SELECT ARRAY_AGG(id) INTO opt_ids FROM poll_options WHERE question_id = question_rec.id;

                    IF array_length(opt_ids, 1) > 0 THEN
                        selected_opt := opt_ids[1 + floor(random() * array_length(opt_ids, 1))::int];

                        INSERT INTO poll_answers (user_id, question_id, selected_option_id)
                        VALUES (usr_rec.id, question_rec.id, selected_opt)
                        ON CONFLICT DO NOTHING;
                    END IF;
                END LOOP;
            END IF;
            
        END LOOP;
    END LOOP;
END $$;