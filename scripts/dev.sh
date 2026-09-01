#!/bin/bash

set -e

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
API_DIR="$ROOT_DIR/api"
MOBILE_DIR="$ROOT_DIR/apps/mobile"

API_PORT=8000

API_PID=""
EXPO_PID=""

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Karnetik — environnement de développement"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# ──────────────────────────────────────
# Détection fiable de l'IP locale
# ──────────────────────────────────────

get_local_ip() {
    python3 -c '
import socket

s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

try:
    s.connect(("8.8.8.8", 80))
    print(s.getsockname()[0])
finally:
    s.close()
' 2>/dev/null
}

LOCAL_IP="$(get_local_ip || true)"

if [ -z "$LOCAL_IP" ]; then
    echo "✗ Impossible de détecter l'adresse IP locale du Mac."
    echo ""
    exit 1
fi

echo "✓ Réseau détecté"
echo "  IP du Mac : $LOCAL_IP"
echo ""

# ──────────────────────────────────────
# Configuration mobile
# ──────────────────────────────────────

ENV_FILE="$MOBILE_DIR/.env"
API_URL="http://$LOCAL_IP:$API_PORT/api"

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
# Nettoyage
# ──────────────────────────────────────

cleanup() {
    echo ""
    echo ""
    echo "Arrêt de Karnetik..."

    if [ -n "$EXPO_PID" ] && kill -0 "$EXPO_PID" 2>/dev/null; then
        kill "$EXPO_PID" 2>/dev/null || true
    fi

    if [ -n "$API_PID" ] && kill -0 "$API_PID" 2>/dev/null; then
        kill "$API_PID" 2>/dev/null || true
    fi

    wait 2>/dev/null || true

    echo "✓ Services arrêtés"
    exit 0
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

echo "  http://$LOCAL_IP:$API_PORT"
echo ""

# ──────────────────────────────────────
# Expo
# ──────────────────────────────────────

echo "✓ Démarrage Expo..."
echo ""

cd "$MOBILE_DIR"

npx expo start --lan &

EXPO_PID=$!

sleep 2

if ! kill -0 "$EXPO_PID" 2>/dev/null; then
    echo "✗ Expo n'a pas démarré."
    exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Karnetik est prêt"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "  API  : http://$LOCAL_IP:$API_PORT/api"
echo "  Expo : LAN"
echo ""
echo "  Ctrl+C pour tout arrêter"
echo ""

wait
