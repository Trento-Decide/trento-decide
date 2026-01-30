## Esecuzione

1. Clona la repository
   ```bash
   git clone https://github.com/Trento-Decide/trento-decide.git
   ```

2. Crea il database (se non esiste)
   ```bash
   psql -h localhost -U postgres -c "CREATE DATABASE trentodecide;"
   ```

### Front-end

**Unix/macOS/Linux:**
```bash
./frontend/dev.sh
```

**Windows (PowerShell):**
```powershell
.\frontend\dev.ps1
```

### Back-end

**Unix/macOS/Linux:**
```bash
./backend/dev.sh
```

**Windows (PowerShell):**
```powershell
.\backend\dev.ps1
```

Per (ri)caricare lo schema del DB con i dati fasulli, usa la flag `--init-db` / `-InitDb`.

## Stack

### Front-end

- Framework: https://nextjs.org/
- Styling: https://italia.github.io/bootstrap-italia/

### Back-end

- Framework: https://expressjs.com/
- DBMS: https://www.postgresql.org/
