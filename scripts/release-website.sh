#!/usr/bin/env bash
set -Eeuo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

find_runtime_kit() {
  local candidate
  for candidate in \
    "${MNSCLOUD_RUNTIME_KIT_DIR:-}" \
    "${ROOT_DIR}/../mnscloud-runtime-kit" \
    "/opt/mnscloud/runtime-kit" \
    "/opt/mnscloud/repos/mnscloud-runtime-kit"; do
    [[ -n "$candidate" && -r "${candidate}/lib/release.sh" ]] || continue
    printf '%s\n' "$candidate"
    return 0
  done
  return 1
}

cd "$ROOT_DIR"
RUNTIME_KIT_DIR="$(find_runtime_kit)" || {
  printf '[mnscloud-website] ERROR: mnscloud-runtime-kit lib/release.sh not found\n' >&2
  exit 1
}

# shellcheck source=/opt/mnscloud/runtime-kit/lib/release.sh
source "${RUNTIME_KIT_DIR}/lib/release.sh"

# Static release artifact: the built dist/ directory, published as a GitHub Release asset so any
# static host (including mnscloud-webapps with APP_SOURCE=release) can serve it without Node.js.
export MNSCLOUD_RUNTIME_KIT_DIR="$RUNTIME_KIT_DIR"
package_web_artifact='"$MNSCLOUD_RUNTIME_KIT_DIR/scripts/package-static-artifact.sh" --source-dir dist --name "mnscloud-website-web-v$(tr -d "[:space:]" < VERSION).tar.gz"'

mrtk_release_prepare \
  --product mnscloud-website \
  --repository manaoscloud/mnscloud-website \
  --minimum-version 0.1.0 \
  --sync-package-json \
  --validate 'npm run build' \
  --validate 'npm run check:domains' \
  --validate "$package_web_artifact" \
  --asset-glob "releases/mnscloud-website-web-v*.tar.gz*" \
  "$@"
