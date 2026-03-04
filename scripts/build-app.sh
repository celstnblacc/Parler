#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

if ! command -v bun >/dev/null 2>&1; then
  echo "Error: bun is not installed. Install it from https://bun.sh" >&2
  exit 1
fi

echo "Building desktop app bundle..."
bun run tauri build "$@"

APP_PATH="src-tauri/target/release/bundle/macos/Parler.app"
if [ -d "$APP_PATH" ]; then
  echo ""
  echo "App bundle created:"
  echo "$ROOT_DIR/$APP_PATH"
else
  echo ""
  echo "Build finished. Bundle path may vary by platform."
  echo "Check: $ROOT_DIR/src-tauri/target/release/bundle/"
fi
