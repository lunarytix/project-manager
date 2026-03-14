#!/usr/bin/env bash
set -euo pipefail

# stop.sh — Detiene backend y/o frontend leyendo los PIDs en backend.pid/frontend.pid
ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"

usage() {
  cat <<EOF
Usage: $0 [backend|frontend|all]
  backend   -> detiene sólo el backend
  frontend  -> detiene sólo el frontend
  all       -> detiene ambos (por defecto)
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

kill_pidfile() {
  local pidfile="$1"
  if [ ! -f "$pidfile" ]; then
    echo "No existe $pidfile; nada que detener."
    return 0
  fi
  local pid
  pid=$(cat "$pidfile" 2>/dev/null || true)
  if ! [[ "$pid" =~ ^[0-9]+$ ]]; then
    echo "PID inválido en $pidfile: '$pid' — eliminando archivo."
    rm -f "$pidfile"
    return 0
  fi

  if kill -0 "$pid" 2>/dev/null; then
    echo "Deteniendo PID $pid..."
    kill "$pid" || true
    # esperar hasta 5s a que termine
    for i in {1..10}; do
      if ! kill -0 "$pid" 2>/dev/null; then
        break
      fi
      sleep 0.5
    done
    if kill -0 "$pid" 2>/dev/null; then
      echo "PID $pid no terminó, forzando..."
      kill -9 "$pid" || true
    fi
    echo "Detenido $pid"
  else
    echo "No hay proceso con PID $pid en ejecución."
  fi
  rm -f "$pidfile"
}

case "$TARGET" in
  backend)
    echo "Deteniendo backend..."
    kill_pidfile "$ROOT_DIR/backend.pid" ;;
  frontend)
    echo "Deteniendo frontend..."
    kill_pidfile "$ROOT_DIR/frontend.pid" ;;
  all)
    echo "Deteniendo backend y frontend..."
    kill_pidfile "$ROOT_DIR/backend.pid"
    kill_pidfile "$ROOT_DIR/frontend.pid" ;;
esac

echo "Hecho."
