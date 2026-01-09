-- RUOLI
INSERT INTO roles (code, labels, colour)
VALUES 
  ('cittadino', '{"it":"Cittadino"}'::jsonb, '#9c9c9c'),
  ('moderatore', '{"it":"Moderatore"}'::jsonb, '#d63c7e'),
  ('admin', '{"it":"Amministratore"}'::jsonb, '#e11d05'),
  ('associazione', '{"it":"Associazione"}'::jsonb, '#157cc9')
ON CONFLICT (code) DO UPDATE
SET labels = EXCLUDED.labels,
    colour = EXCLUDED.colour;

-- STATI PROPOSTA
INSERT INTO statuses (code, labels, colour)
VALUES
  ('bozza', '{"it":"Bozza"}'::jsonb, '#9aa5b1'),
  ('pubblicata', '{"it":"Pubblicata"}'::jsonb, '#0275d8'),
  ('in_valutazione', '{"it":"In valutazione"}'::jsonb, '#f0ad4e'),
  ('approvata', '{"it":"Approvata"}'::jsonb, '#5cb85c'),
  ('respinta', '{"it":"Respinta"}'::jsonb, '#d9534f'),
  ('in_attuazione', '{"it":"In attuazione"}'::jsonb, '#5bc0de'),
  ('completata', '{"it":"Completata"}'::jsonb, '#292b2c')
ON CONFLICT (code) DO UPDATE
SET labels = EXCLUDED.labels,
    colour = EXCLUDED.colour;

-- CATEGORIE
INSERT INTO categories (code, labels, description, colour, form_schema)
VALUES
  -- 1. URBANISTICA
  (
    'urbanistica',
    '{"it":"Urbanistica"}'::jsonb,
    '{"it":"Pianificazione territoriale, edilizia privata e riqualificazione urbana"}'::jsonb,
    '#795548',
    '[
      {"kind":"select","key":"tipo_intervento","label":{"it":"Tipo di intervento"},"required":true,"options":[
        {"value":"riqualificazione","label":{"it":"Riqualificazione area"}},
        {"value":"nuova_costruzione","label":{"it":"Nuova costruzione"}},
        {"value":"manutenzione","label":{"it":"Manutenzione straordinaria"}}
      ]},
      {"kind":"map","key":"area_interesse","label":{"it":"Perimetro Area"},"required":true,"drawMode":"polygon"},
      {"kind":"text","key":"dati_catastali","label":{"it":"Riferimenti Catastali (Foglio/Particella)"},"required":false},
      {"kind":"file","key":"planimetria","label":{"it":"Planimetria o Bozza"},"required":false,"accept":["application/pdf"],"multiple":false,"maxFiles":1,"maxSizeMB":20}
    ]'::jsonb
  ),

  -- 2. AMBIENTE
  (
    'ambiente',
    '{"it":"Ambiente"}'::jsonb,
    '{"it":"Proposte legate all’ambiente e aree verdi"}'::jsonb,
    '#007a52',
    '[
      {"kind":"number","key":"budget","label":{"it":"Budget stimato"},"required":true,"min":0,"unit":"€"},
      {"kind":"multiselect","key":"tematiche","label":{"it":"Tematiche"},"required":true,"options":[
         {"value":"alberi","label":{"it":"Piantumazione alberi"}},
         {"value":"rifiuti","label":{"it":"Gestione rifiuti"}},
         {"value":"energia","label":{"it":"Energia rinnovabile"}},
         {"value":"acqua","label":{"it":"Risorse idriche"}}
      ]},
      {"kind":"map","key":"area","label":{"it":"Area Verde Interessata"},"required":false,"drawMode":"polygon"},
      {"kind":"text","key":"impatto","label":{"it":"Impatto previsto"},"required":true,"helpText":{"it":"Descrivi i benefici ambientali attesi"}},
      {"kind":"file","key":"relazione_pdf","label":{"it":"Relazione Tecnica"},"required":false,"accept":["application/pdf"],"multiple":false,"maxFiles":1,"maxSizeMB":10}
    ]'::jsonb
  ),

  -- 3. SICUREZZA
  (
    'sicurezza',
    '{"it":"Sicurezza"}'::jsonb,
    '{"it":"Illuminazione, sorveglianza e presidio del territorio"}'::jsonb,
    '#d32f2f',
    '[
      {"kind":"select","key":"urgenza","label":{"it":"Livello di urgenza"},"required":true,"options":[
        {"value":"bassa","label":{"it":"Bassa"}},
        {"value":"media","label":{"it":"Media"}},
        {"value":"alta","label":{"it":"Alta"}}
      ]},
      {"kind":"select","key":"tipologia","label":{"it":"Problematica"},"required":true,"options":[
        {"value":"illuminazione","label":{"it":"Illuminazione scarsa/assente"}},
        {"value":"vandalismo","label":{"it":"Atti vandalici"}},
        {"value":"degrado","label":{"it":"Degrado urbano"}},
        {"value":"traffico","label":{"it":"Sicurezza stradale"}}
      ]},
      {"kind":"text","key":"descrizione_accaduto","label":{"it":"Dettagli segnalazione"},"required":true},
      {"kind":"map","key":"luogo","label":{"it":"Luogo esatto"},"required":true},
      {"kind":"file","key":"foto_prova","label":{"it":"Foto del problema"},"required":false,"accept":["image/jpeg","image/png"],"multiple":true,"maxFiles":3,"maxSizeMB":5}
    ]'::jsonb
  ),

  -- 4. CULTURA
  (
    'cultura',
    '{"it":"Cultura"}'::jsonb,
    '{"it":"Eventi, mostre, biblioteche e patrimonio artistico"}'::jsonb,
    '#9c27b0',
    '[
      {"kind":"text","key":"titolo_evento","label":{"it":"Titolo Evento/Progetto"},"required":true},
      {"kind":"date","key":"data_inizio","label":{"it":"Data prevista inizio"},"required":true},
      {"kind":"select","key":"location","label":{"it":"Spazio richiesto"},"required":false,"options":[
        {"value":"teatro_comunale","label":{"it":"Teatro Comunale"}},
        {"value":"biblioteca","label":{"it":"Biblioteca Civica"}},
        {"value":"piazza","label":{"it":"Piazza all aperto"}},
        {"value":"altro","label":{"it":"Altro spazio"}}
      ]},
      {"kind":"boolean","key":"richiesta_patrocinio","label":{"it":"Richiesta patrocinio gratuito?"},"required":false},
      {"kind":"file","key":"programma","label":{"it":"Programma dettagliato"},"required":true,"accept":["application/pdf"],"multiple":false,"maxFiles":1,"maxSizeMB":5}
    ]'::jsonb
  ),

  -- 5. ISTRUZIONE
  (
    'istruzione',
    '{"it":"Istruzione"}'::jsonb,
    '{"it":"Scuole, asili, edilizia scolastica e progetti didattici"}'::jsonb,
    '#ff9800',
    '[
      {"kind":"select","key":"target_scuola","label":{"it":"Rivolto a"},"required":true,"options":[
        {"value":"nido","label":{"it":"Asilo Nido"}},
        {"value":"primaria","label":{"it":"Scuola Primaria"}},
        {"value":"secondaria","label":{"it":"Scuola Secondaria"}},
        {"value":"adulti","label":{"it":"Educazione Adulti"}}
      ]},
      {"kind":"number","key":"num_studenti","label":{"it":"Numero studenti coinvolti"},"min":1,"step":1},
      {"kind":"text","key":"nome_istituto","label":{"it":"Nome Istituto (se applicabile)"},"required":false},
      {"kind":"text","key":"obiettivi_didattici","label":{"it":"Obiettivi didattici"},"required":true,"maxLength":1000},
      {"kind":"file","key":"progetto_formativo","label":{"it":"Progetto Formativo"},"required":false,"accept":["application/pdf"],"multiple":false,"maxFiles":1,"maxSizeMB":10}
    ]'::jsonb
  ),

  -- 6. INNOVAZIONE
  (
    'innovazione',
    '{"it":"Innovazione"}'::jsonb,
    '{"it":"Smart city, digitalizzazione e servizi online"}'::jsonb,
    '#00bcd4',
    '[
      {"kind":"multiselect","key":"tecnologie","label":{"it":"Tecnologie abilitanti"},"required":true,"options":[
        {"value":"iot","label":{"it":"IoT / Sensori"}},
        {"value":"app","label":{"it":"App / Web"}},
        {"value":"connettivita","label":{"it":"Wi-Fi / Fibra"}},
        {"value":"dati","label":{"it":"Open Data"}},
        {"value":"ai","label":{"it":"Intelligenza Artificiale"}}
      ]},
      {"kind":"boolean","key":"opensource","label":{"it":"Il progetto è Open Source?"},"required":true},
      {"kind":"text","key":"infrastruttura","label":{"it":"Requisiti infrastrutturali"},"required":false},
      {"kind":"file","key":"whitepaper","label":{"it":"Documentazione tecnica"},"required":false,"accept":["application/pdf"],"multiple":false,"maxFiles":1,"maxSizeMB":15}
    ]'::jsonb
  ),

  -- 7. MOBILITA' E TRASPORTI
  (
    'mobilita_trasporti',
    '{"it":"Mobilità e Trasporti"}'::jsonb,
    '{"it":"Traffico, mezzi pubblici, piste ciclabili e parcheggi"}'::jsonb,
    '#1e90ff',
    '[
      {"kind":"select","key":"ambito","label":{"it":"Ambito"},"required":true,"options":[
        {"value":"trasporti_pubblici","label":{"it":"Trasporti pubblici"}},
        {"value":"viabilita","label":{"it":"Viabilità / Strade"}},
        {"value":"ciclabile","label":{"it":"Piste Ciclabili"}},
        {"value":"parcheggi","label":{"it":"Parcheggi"}}
      ]},
      {"kind":"text","key":"via","label":{"it":"Via/Località"},"required":true},
      {"kind":"map","key":"punto_mappa","label":{"it":"Punto esatto"},"required":false},
      {"kind":"file","key":"foto_stato_attuale","label":{"it":"Foto stato attuale"},"required":false,"accept":["image/jpeg","image/png"],"multiple":true,"maxFiles":5,"maxSizeMB":5}
    ]'::jsonb
  ),

  -- 8. WELFARE
  (
    'welfare',
    '{"it":"Welfare"}'::jsonb,
    '{"it":"Servizi sociali, assistenza anziani, inclusione e sanità"}'::jsonb,
    '#e91e63',
    '[
      {"kind":"multiselect","key":"beneficiari","label":{"it":"Beneficiari"},"required":true,"options":[
        {"value":"anziani","label":{"it":"Anziani"}},
        {"value":"famiglie","label":{"it":"Famiglie in difficoltà"}},
        {"value":"disabili","label":{"it":"Persone con disabilità"}},
        {"value":"giovani","label":{"it":"Giovani"}},
        {"value":"immigrati","label":{"it":"Immigrati"}}
      ]},
      {"kind":"boolean","key":"collaborazione_associazioni","label":{"it":"In collaborazione con associazioni?"}},
      {"kind":"text","key":"nome_associazione","label":{"it":"Nome Associazione"},"required":false},
      {"kind":"number","key":"utenti_stimati","label":{"it":"Utenti stimati annui"},"required":true,"min":0}
    ]'::jsonb
  ),

  -- 9. SPORT
  (
    'sport',
    '{"it":"Sport"}'::jsonb,
    '{"it":"Impianti sportivi, eventi e promozione attività motoria"}'::jsonb,
    '#8bc34a',
    '[
      {"kind":"select","key":"tipo_impianto","label":{"it":"Tipo Impianto"},"required":true,"options":[
        {"value":"palestra","label":{"it":"Palestra coperta"}},
        {"value":"campo_aperto","label":{"it":"Campo all aperto"}},
        {"value":"piscina","label":{"it":"Piscina"}},
        {"value":"skatepark","label":{"it":"Skate Park"}}
      ]},
      {"kind":"text","key":"sport_principale","label":{"it":"Disciplina Sportiva"},"required":true},
      {"kind":"boolean","key":"omologazione","label":{"it":"Richiede omologazione federale?"},"required":false},
      {"kind":"date","key":"data_fine_lavori","label":{"it":"Data desiderata fine lavori"},"required":false}
    ]'::jsonb
  )
ON CONFLICT (code) DO UPDATE
SET labels = EXCLUDED.labels,
    description = EXCLUDED.description,
    colour = EXCLUDED.colour,
    form_schema = EXCLUDED.form_schema;

-- 4. TIPI NOTIFICA
INSERT INTO notification_types (code, labels)
VALUES
  ('proposal_published', '{"it":"Proposta pubblicata"}'::jsonb),
  ('proposal_approved',  '{"it":"Proposta approvata"}'::jsonb),
  ('proposal_rejected',  '{"it":"Proposta respinta"}'::jsonb),
  ('new_comment',        '{"it":"Nuovo commento"}'::jsonb),
  ('poll_closing_soon',  '{"it":"Sondaggio in chiusura"}'::jsonb),
  ('system_warning',     '{"it":"Avviso di sistema"}'::jsonb)
ON CONFLICT (code) DO UPDATE
SET labels = EXCLUDED.labels;