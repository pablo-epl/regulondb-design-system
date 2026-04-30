#!/usr/bin/env bash
# -----------------------------------------------------------------------------
# Build the stakeholder PDF for the RegulonDB MG prototype.
#
# Pipeline:
#   1. Start a transient HTTP server in the workspace root.
#   2. Run capture-views.mjs (drives headless Chrome via CDP, prints each
#      view onto a 1440×2400 page — desktop width, generously tall).
#   3. Stitch every per-view PDF with `pdfunite`.
#
# Output: regulondb-mg-design-system/dist/RegulonDB-MG-prototype.pdf
#
# Cover renders at A4 landscape; the rest at 1440×2400 px (15"×25"). Most
# views fit on a single page; a few have some bottom whitespace, which is
# acceptable for a stakeholder deck — readers scroll past it the same way
# they would scroll the live prototype.
#
# Requirements:
#   - Google Chrome at /Applications/Google Chrome.app
#   - Node ≥ 22 (for built-in WebSocket)
#   - pdfunite (poppler-utils)  →  brew install poppler
#   - python3 (just to serve static files)
# -----------------------------------------------------------------------------
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
DS="$ROOT/regulondb-mg-design-system"
PORT="${PORT:-8753}"
HOST="http://localhost:$PORT"

OUT_DIR="$DS/dist"
PER_VIEW="$OUT_DIR/per-view"
FINAL="$OUT_DIR/RegulonDB-MG-prototype.pdf"

rm -rf "$PER_VIEW"
mkdir -p "$PER_VIEW"

echo "▸ Server on $HOST (root: $ROOT)"
# Bind to 127.0.0.1 explicitly — headless Chrome sometimes can't resolve
# "localhost" reliably when the server is on the IPv6 loopback.
python3 -m http.server "$PORT" --bind 127.0.0.1 --directory "$ROOT" >/dev/null 2>&1 &
SERVER_PID=$!
trap 'kill $SERVER_PID 2>/dev/null || true' EXIT

for _ in {1..30}; do
  curl -sf "http://127.0.0.1:$PORT/" >/dev/null && break
  sleep 0.1
done

node "$DS/scripts/capture-views.mjs" "$PER_VIEW" "$HOST"

PDF_FILES=("$PER_VIEW"/*.pdf)
echo "▸ Merging ${#PDF_FILES[@]} PDFs → $FINAL"
pdfunite "${PDF_FILES[@]}" "$FINAL"

SIZE=$(du -h "$FINAL" | cut -f1)
PAGES=$(/opt/homebrew/bin/pdfinfo "$FINAL" 2>/dev/null | awk '/^Pages:/ { print $2 }')
echo
echo "✓ Done"
echo "  output:        $FINAL ($SIZE, $PAGES pages)"
echo "  per-view PDFs: $PER_VIEW"
