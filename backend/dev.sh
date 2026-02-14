#!/bin/bash
# Script di sviluppo backend per Unix/macOS/Linux
# Questo script configura e avvia il backend in modalità sviluppo

set -e

# Spostati nella cartella dello script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "=== Trento Decide - Sviluppo Backend ==="

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

# (Ri)carica lo schema del DB con i dati fasulli se --init-db è passato
if [[ " $* " == *" --init-db "* ]]; then
    echo "Inizializzazione database di sviluppo..."
    npm run db:init:dev
fi

# Avvia l'applicazione in modalità sviluppo
echo "Avvio server di sviluppo backend..."
npm run dev
