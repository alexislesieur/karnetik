#!/bin/bash

set -e

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
API_DIR="$ROOT_DIR/api"
MOBILE_DIR="$ROOT_DIR/apps/mobile"

API_PORT=8000

API_PID=""
NGROK_PID=""
EXPO_PID=""

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Karnetik — environnement de développement"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# ──────────────────────────────────────
# Vérifications
# ──────────────────────────────────────

if ! command -v ngrok >/dev/null 2>&1; then
    echo "✗ ngrok est introuvable."
    echo ""
    echo "Installe ngrok puis relance le script."
    echo ""
    exit 1
fi

if ! command -v python3 >/dev/null 2>&1; then
    echo "✗ Python 3 est requis."
    exit 1
fi

if ! command -v curl >/dev/null 2>&1; then
    echo "✗ curl est requis."
    exit 1
fi

echo "✓ Dépendances disponibles"
echo "  ngrok : $(ngrok version 2>/dev/null | head -n 1)"
echo ""

# ──────────────────────────────────────
# Nettoyage
# ──────────────────────────────────────

cleanup() {
    echo ""
    echo ""
    echo "Arrêt de Karnetik..."

    if [ -n "$EXPO_PID" ] && kill -0 "$EXPO_PID" 2>/dev/null; then
        kill "$EXPO_PID" 2>/dev/null || true
    fi

    if [ -n "$NGROK_PID" ] && kill -0 "$NGROK_PID" 2>/dev/null; then
        kill "$NGROK_PID" 2>/dev/null || true
    fi

    if [ -n "$API_PID" ] && kill -0 "$API_PID" 2>/dev/null; then
        kill "$API_PID" 2>/dev/null || true
    fi

    wait 2>/dev/null || true

    echo "✓ Services arrêtés"
}

trap cleanup INT TERM EXIT

# ──────────────────────────────────────
# Laravel
# ──────────────────────────────────────

echo "✓ Démarrage Laravel..."

cd "$API_DIR"

php artisan serve \
    --host=0.0.0.0 \
    --port="$API_PORT" &

API_PID=$!

sleep 1

if ! kill -0 "$API_PID" 2>/dev/null; then
    echo "✗ Laravel n'a pas démarré."
    exit 1
fi

echo "  http://localhost:$API_PORT"
echo ""

# ──────────────────────────────────────
# Tunnel API ngrok
# ──────────────────────────────────────

echo "✓ Démarrage du tunnel API..."

ngrok http "$API_PORT" \
    --log=stdout > /tmp/karnetik-ngrok.log 2>&1 &

NGROK_PID=$!

API_PUBLIC_URL=""

for i in {1..20}; do
    sleep 1

    API_PUBLIC_URL="$(
        curl -s http://127.0.0.1:4040/api/tunnels 2>/dev/null \
        | python3 -c '
import json
import sys

try:
    data = json.load(sys.stdin)

    for tunnel in data.get("tunnels", []):
        url = tunnel.get("public_url", "")

        if url.startswith("https://"):
            print(url)
            break
except Exception:
    pass
'
    )"

    if [ -n "$API_PUBLIC_URL" ]; then
        break
    fi
done

if [ -z "$API_PUBLIC_URL" ]; then
    echo "✗ Impossible de récupérer l'URL du tunnel ngrok."
    echo ""
    echo "Logs ngrok :"
    cat /tmp/karnetik-ngrok.log
    exit 1
fi

echo "  API publique : $API_PUBLIC_URL"
echo ""

# ──────────────────────────────────────
# Configuration mobile
# ──────────────────────────────────────

ENV_FILE="$MOBILE_DIR/.env"
API_URL="$API_PUBLIC_URL/api"

if [ -f "$ENV_FILE" ]; then
    if grep -q "^EXPO_PUBLIC_API_URL=" "$ENV_FILE"; then
        sed -i '' \
            "s#^EXPO_PUBLIC_API_URL=.*#EXPO_PUBLIC_API_URL=$API_URL#" \
            "$ENV_FILE"
    else
        printf "\nEXPO_PUBLIC_API_URL=%s\n" "$API_URL" >> "$ENV_FILE"
    fi
else
    printf "EXPO_PUBLIC_API_URL=%s\n" "$API_URL" > "$ENV_FILE"
fi

echo "✓ Configuration mobile"
echo "  API : $API_URL"
echo ""

# ──────────────────────────────────────
# Vérification API via ngrok
# ──────────────────────────────────────

echo "✓ Vérification de l'API..."

API_READY=false

for i in {1..10}; do
    if curl -fsS --max-time 5 "$API_URL/health" >/dev/null 2>&1; then
        API_READY=true
        break
    fi

    sleep 1
done

if [ "$API_READY" = true ]; then
    echo "  API accessible via ngrok"
else
    echo "✗ L'API ne répond pas via ngrok."
    echo ""
    echo "URL testée :"
    echo "  $API_URL/health"
    echo ""
    echo "Logs ngrok :"
    cat /tmp/karnetik-ngrok.log
    echo ""
    exit 1
fi

echo ""

# ──────────────────────────────────────
# Expo
# ──────────────────────────────────────

echo "✓ Démarrage Expo..."
echo ""

cd "$MOBILE_DIR"

npx expo start --tunnel -c &

EXPO_PID=$!

sleep 3

if ! kill -0 "$EXPO_PID" 2>/dev/null; then
    echo "✗ Expo n'a pas démarré."
    exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Karnetik est prêt"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "  API  : $API_URL"
echo "  Expo : Tunnel"
echo ""
echo "  Ctrl+C pour tout arrêter"
echo ""

wait
