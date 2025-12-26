## Esecuzione

1. Clona la repository
   ```bash
   git clone https://github.com/Trento-Decide/trento-decide.git
   ```

### Front-end

2. Spostati nella cartella
   ```bash
   cd frontend
   ```

3. Copia il file di configurazione e modificalo
   ```bash
   cp .env.example .env
   ```

4. Installa le dipendenze
   ```bash
   npm install
   ```

#### Sviluppo

6. Avvia l'applicazione in modalità sviluppo
   ```bash
   npm run dev
   ```

### Back-end

2. Spostati nella cartella
   ```bash
   cd backend
   ```

3. Copia il file di configurazione e modificalo
   ```bash
   cp .env.example .env
   ```

4. Installa le dipendenze
   ```bash
   npm install
   ```

5. Crea il database
   ```bash
   psql -h localhost -U postgres -c "CREATE DATABASE trentodecide;"
   ```

### Sviluppo

6. Avvia l'applicazione in modalità sviluppo
   ```bash
   npm run dev
   ```

7. Per (ri)caricare lo schema del DB con i dati fasulli si può eseguire
   ```bash
   npm run db:init:dev
   ```

### Produzione

6. Per (ri)caricare lo schema del DB si può eseguire
   ```bash
   npm run db:init:prod
   ```

## Stack

### Front-end

- Framework: https://nextjs.org/
- Styling: https://italia.github.io/bootstrap-italia/

### Back-end

- Framework: https://expressjs.com/
- DBMS: https://www.postgresql.org/
