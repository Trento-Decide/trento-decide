## Database

```bash
psql -U postgres -c "CREATE DATABASE trentodecide;"
cd backend/src/sql
psql -U postgres -d trentodecide -f init.sql
```

## Sviluppo

1. Clona la repository
   ```bash
   git clone https://github.com/Trento-Decide/trento-decide.git
   ```

2. Spostati sul front-end o back-end
   ```bash
   cd backend
   # oppure
   cd frontend
   ```

3. Installa le dipendenze
   ```bash
   npm install
   ```

4. Copia il file di configurazione e modificalo
   ```bash
   cp .env.example .env
   ```

5. Avvia l'applicazione in modalità sviluppo
   ```bash
   npm run dev
   ```

6. L'applicazione viene riavviata automaticamente al cambiamento del codice.

## Stack

### Front-end

- Framework: https://nextjs.org/
- Styling: https://italia.github.io/bootstrap-italia/

### Back-end

- Framework: https://expressjs.com/
- DBMS: https://www.postgresql.org/
