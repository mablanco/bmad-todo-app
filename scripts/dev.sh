#!/usr/bin/env sh

set -eu

frontend_pid=""
backend_pid=""

cleanup() {
  if [ -n "$frontend_pid" ] && kill -0 "$frontend_pid" 2>/dev/null; then
    kill "$frontend_pid" 2>/dev/null || true
  fi

  if [ -n "$backend_pid" ] && kill -0 "$backend_pid" 2>/dev/null; then
    kill "$backend_pid" 2>/dev/null || true
  fi
}

trap cleanup EXIT INT TERM

printf '%s\n' 'Starting backend on http://127.0.0.1:8000'
python3 -m fastapi dev api/app/main.py --host 127.0.0.1 --port 8000 &
backend_pid=$!

printf '%s\n' 'Starting frontend on http://127.0.0.1:5173'
npm --prefix web run dev -- --host 127.0.0.1 --port 5173 &
frontend_pid=$!

wait "$backend_pid" "$frontend_pid"
