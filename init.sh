#!/usr/bin/env bash
set -euo pipefail

# init.sh — instala dependencias para backend y frontend
ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "Inicializando proyecto desde $ROOT_DIR"

echo "\n== Backend =="
if [ -d "$ROOT_DIR/backend" ]; then
  cd "$ROOT_DIR/backend"
  if [ -f package.json ]; then
    echo "Instalando dependencias del backend..."
    npm install
    echo "Backend: dependencias instaladas."
  else
    echo "Aviso: no se encontró package.json en backend/"
  fi
else
  echo "Aviso: no existe la carpeta backend/"
fi

echo "\n== Frontend =="
if [ -d "$ROOT_DIR/frontend" ]; then
  cd "$ROOT_DIR/frontend"
  if [ -f package.json ]; then
    echo "Instalando dependencias del frontend..."
    npm install
    echo "Frontend: dependencias instaladas."
  else
    echo "Aviso: no se encontró package.json en frontend/"
  fi
else
  echo "Aviso: no existe la carpeta frontend/"
fi

echo "\nHecho. Sugerencias:"
echo "- Para arrancar el backend: cd backend && npm run start (o el script que uses)"
echo "- Para arrancar el frontend: cd frontend && npm start (o ng serve según config)"
