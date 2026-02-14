#!/bin/bash
# Script di sviluppo frontend per Unix/macOS/Linux
# Questo script configura e avvia il frontend in modalità sviluppo

set -e

# Spostati nella cartella dello script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "=== Trento Decide - Sviluppo Frontend ==="

# Copia il file di configurazione se non esiste
if [ ! -f ".env" ]; then
    echo "Creazione file .env da .env.example..."
    cp .env.example .env
    echo "✓ File .env creato. Puoi modificarlo per personalizzare la configurazione."
else
    echo "✓ File .env già esistente"
fi

# Installa le dipendenze shared
echo "Installazione dipendenze shared..."
(cd "$SCRIPT_DIR/../shared" && npm install)

# Installa le dipendenze
echo "Installazione dipendenze..."
npm install

# Avvia l'applicazione in modalità sviluppo
echo "Avvio server di sviluppo frontend..."
npm run dev
