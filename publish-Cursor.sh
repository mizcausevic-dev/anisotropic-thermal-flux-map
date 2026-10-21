#!/usr/bin/env bash
# Publish the explainer to GitHub and GitHub Pages (gh-pages branch).
# Requires: gh (authenticated as the repo owner), git. Idempotent: safe to re-run after edits.
#
#   ./publish-Cursor.sh                 # owner defaults to the authenticated gh user
#   OWNER=mizcausevic-dev REPO=anisotropic-thermal-flux-map ./publish-Cursor.sh
set -euo pipefail

OWNER="${OWNER:-$(gh api user --jq .login)}"
REPO="${REPO:-anisotropic-thermal-flux-map}"
ABOUT="Code-driven 34 s motion explainer of anisotropic heat-flux steering in a thermal-cloak annulus (metamaterials). Deterministic 1,020-frame Canvas render, analytic 2D model, no dependencies."
TOPICS=(metamaterials thermal-cloak heat-transfer anisotropic-conduction transformation-thermodynamics scientific-visualization motion-graphics canvas-animation explainer github-pages)

cd "$(dirname "$0")"
git rev-parse --is-inside-work-tree >/dev/null

echo "== target: https://github.com/$OWNER/$REPO  (Pages: https://$OWNER.github.io/$REPO/)"
gh auth status >/dev/null

# 1. Repository
if ! gh repo view "$OWNER/$REPO" >/dev/null 2>&1; then
  echo "== creating repository"
  gh repo create "$OWNER/$REPO" --public --description "$ABOUT"
else
  echo "== repository exists"
fi
if ! git remote get-url origin >/dev/null 2>&1; then
  git remote add origin "https://github.com/$OWNER/$REPO.git"
fi

# 2. Branches: main carries the source; gh-pages mirrors it for Pages.
git checkout -q main
git branch -f gh-pages main
echo "== pushing main and gh-pages"
git push -u origin main
git push -f -u origin gh-pages

# 3. Pages from gh-pages root
if gh api "repos/$OWNER/$REPO/pages" >/dev/null 2>&1; then
  gh api -X PUT "repos/$OWNER/$REPO/pages" -f 'source[branch]=gh-pages' -f 'source[path]=/' >/dev/null
  echo "== pages source updated"
else
  gh api -X POST "repos/$OWNER/$REPO/pages" -f 'source[branch]=gh-pages' -f 'source[path]=/' >/dev/null
  echo "== pages enabled"
fi

# 4. About and topics (repo rule: one-line About + 5–10 topics)
gh repo edit "$OWNER/$REPO" --description "$ABOUT" --homepage "https://$OWNER.github.io/$REPO/" >/dev/null
args=(); for t in "${TOPICS[@]}"; do args+=(--add-topic "$t"); done
gh repo edit "$OWNER/$REPO" "${args[@]}" >/dev/null
echo "== about + topics set"

# 5. Report
echo "== pages status:"; gh api "repos/$OWNER/$REPO/pages" --jq '{status: .status, url: .html_url, branch: .source.branch}'
echo "First build usually completes within a minute. Verify with: curl -sI https://$OWNER.github.io/$REPO/ | head -1"
