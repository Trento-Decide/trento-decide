# Script di sviluppo backend per Windows (PowerShell)
# Questo script configura e avvia il backend in modalità sviluppo

param(
    [switch]$InitDb
)

$ErrorActionPreference = "Stop"

# Spostati nella cartella dello script
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ScriptDir

Write-Host "=== Trento Decide - Sviluppo Backend ===" -ForegroundColor Cyan

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

# (Ri)carica lo schema del DB con i dati fasulli se -InitDb è passato
if ($InitDb) {
    Write-Host "Inizializzazione database di sviluppo..."
    npm run db:init:dev
}

# Avvia l'applicazione in modalità sviluppo
Write-Host "Avvio server di sviluppo backend..."
npm run dev
