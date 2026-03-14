#!/usr/bin/env bash
set -euo pipefail

# start.sh — Arranca backend y/o frontend en background y guarda logs
ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"

usage() {
  cat <<EOF
Usage: $0 [backend|frontend|all]
  backend   -> inicia sólo el backend
  frontend  -> inicia sólo el frontend
  all       -> inicia ambos (por defecto)
EOF
}

TARGET="all"
if [ "$#" -gt 1 ]; then
  echo "Demasiados argumentos"
  usage
  exit 1
fi
if [ "$#" -eq 1 ]; then
  case "$1" in
    backend|frontend|all)
      TARGET="$1" ;;
    -h|--help)
      usage; exit 0 ;;
    *)
      echo "Argumento no reconocido: $1"; usage; exit 1 ;;
  esac
fi

echo "Iniciando ($TARGET) desde $ROOT_DIR"

start_backend() {
  if [ -d "$ROOT_DIR/backend" ]; then
    echo "-> Backend: entrando en backend/"
    cd "$ROOT_DIR/backend"
    # Si existe un PID y el proceso sigue vivo, detenerlo primero
    if [ -f "$ROOT_DIR/backend.pid" ]; then
      oldpid=$(cat "$ROOT_DIR/backend.pid" 2>/dev/null || echo "")
      if [[ "$oldpid" =~ ^[0-9]+$ ]] && kill -0 "$oldpid" 2>/dev/null; then
        echo "Backend ya estaba levantado (PID $oldpid). Parando antes de reiniciar..."
        "$ROOT_DIR/stop.sh" backend || true
      else
        echo "PID antiguo encontrado pero no activo; eliminando pid file"
        rm -f "$ROOT_DIR/backend.pid" || true
      fi
    fi
    if node -e "process.exit(require('./package.json').scripts && require('./package.json').scripts['start:dev'] ? 0 : 1)" 2>/dev/null; then
      echo "Iniciando backend con 'npm run start:dev' (logs: $ROOT_DIR/backend.log)"
      npm run start:dev > "$ROOT_DIR/backend.log" 2>&1 &
      echo $! > "$ROOT_DIR/backend.pid"
      echo "Backend PID: $(cat "$ROOT_DIR/backend.pid")"
    elif node -e "process.exit(require('./package.json').scripts && require('./package.json').scripts['start'] ? 0 : 1)" 2>/dev/null; then
      echo "Iniciando backend con 'npm run start' (logs: $ROOT_DIR/backend.log)"
      npm run start > "$ROOT_DIR/backend.log" 2>&1 &
      echo $! > "$ROOT_DIR/backend.pid"
      echo "Backend PID: $(cat "$ROOT_DIR/backend.pid")"
    else
      echo "No se encontró script de arranque en backend/package.json"
    fi
  else
    echo "No existe la carpeta backend/"
  fi
}

start_frontend() {
  if [ -d "$ROOT_DIR/frontend" ]; then
    echo "-> Frontend: entrando en frontend/"
    cd "$ROOT_DIR/frontend"
    # Si existe un PID y el proceso sigue vivo, detenerlo primero
    if [ -f "$ROOT_DIR/frontend.pid" ]; then
      oldpid=$(cat "$ROOT_DIR/frontend.pid" 2>/dev/null || echo "")
      if [[ "$oldpid" =~ ^[0-9]+$ ]] && kill -0 "$oldpid" 2>/dev/null; then
        echo "Frontend ya estaba levantado (PID $oldpid). Parando antes de reiniciar..."
        "$ROOT_DIR/stop.sh" frontend || true
      else
        echo "PID antiguo encontrado pero no activo; eliminando pid file"
        rm -f "$ROOT_DIR/frontend.pid" || true
      fi
    fi
    if node -e "process.exit(require('./package.json').scripts && require('./package.json').scripts['start'] ? 0 : 1)" 2>/dev/null; then
      echo "Iniciando frontend con 'npm start' (logs: $ROOT_DIR/frontend.log)"
      npm start > "$ROOT_DIR/frontend.log" 2>&1 &
      echo $! > "$ROOT_DIR/frontend.pid"
      echo "Frontend PID: $(cat "$ROOT_DIR/frontend.pid")"
    else
      echo "No se encontró script 'start' en frontend/package.json"
    fi
  else
    echo "No existe la carpeta frontend/"
  fi
}

case "$TARGET" in
  backend)
    start_backend ;;
  frontend)
    start_frontend ;;
  all)
    start_backend
    start_frontend ;;
esac

echo "\nResumen:"
echo "- Backend PID file: ${ROOT_DIR}/backend.pid"
echo "- Frontend PID file: ${ROOT_DIR}/frontend.pid"
echo "- Logs: ${ROOT_DIR}/backend.log, ${ROOT_DIR}/frontend.log"
echo "Para detener: kill \\$(cat backend.pid 2>/dev/null) \\$(cat frontend.pid 2>/dev/null)"

echo "Hecho."
