# Script di sviluppo frontend per Windows (PowerShell)
# Questo script configura e avvia il frontend in modalità sviluppo

$ErrorActionPreference = "Stop"

# Spostati nella cartella dello script
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ScriptDir

Write-Host "=== Trento Decide - Sviluppo Frontend ===" -ForegroundColor Cyan

# Copia il file di configurazione se non esiste
if (-not (Test-Path ".env")) {
    Write-Host "Creazione file .env da .env.example..."
    Copy-Item ".env.example" ".env"
    Write-Host "✓ File .env creato. Puoi modificarlo per personalizzare la configurazione." -ForegroundColor Green
} else {
    Write-Host "✓ File .env già esistente" -ForegroundColor Green
}

# Installa le dipendenze
Write-Host "Installazione dipendenze..."
npm install

# Avvia l'applicazione in modalità sviluppo
Write-Host "Avvio server di sviluppo frontend..."
npm run dev
