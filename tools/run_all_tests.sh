#!/usr/bin/env bash
# Rulează toate verificările de calitate și afișează un rezumat.
#   bash tools/run_all_tests.sh [app/assets] [director-rapoarte]
# Ieșire 1 dacă oricare verificare eșuează. Rapoartele Markdown se scriu în director-rapoarte (implicit docs/).
set -u
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ASSETS="$(cd "${1:-$ROOT/app/assets}" && pwd)"
mkdir -p "${2:-$ROOT/docs}"
REPORTS="$(cd "${2:-$ROOT/docs}" && pwd)"
SHOTS="$(mktemp -d)"
export NODE_OPTIONS="--max-old-space-size=6000"
declare -a NAMES RESULTS
run() {
  local name="$1"; shift
  local log="$SHOTS/$name.log"
  if (cd "$SHOTS" && "$@") >"$log" 2>&1 && ! grep -q "EȘEC" "$log"; then RESULTS+=("trece"); else RESULTS+=("EȘUEAZĂ"); fi
  NAMES+=("$name")
  printf '%-22s %s\n' "$name" "${RESULTS[-1]}"
  [ "${RESULTS[-1]}" = "trece" ] || tail -n 15 "$log"
}
echo "== Conținut"
run "qa_content" node "$ROOT/tools/qa_content.js" "$ASSETS" "$REPORTS/calitate-continut.md"
run "build_atelier" node "$ROOT/tools/build_atelier.js" "$ROOT/content/atelier159.json" "$ROOT/content/atelier_mental160.json" "$SHOTS"
echo "== Funcționalitate (Playwright)"
for t in test_terms test_dictionary test_modes test_tabmodes test_setup test_resources test_enrich test_exams test_atelier test_mental; do
  run "$t" node "$ROOT/tools/$t.js" "$ASSETS" "$SHOTS"
done
echo "== Aplicație (ecrane, accesibilitate, backup, reluare)"
run "qa_app" node "$ROOT/tools/qa_app.js" "$ASSETS" "$REPORTS/calitate-aplicatie.md"
fail=0; for r in "${RESULTS[@]}"; do [ "$r" = "trece" ] || fail=1; done
echo
echo "Rezumat: $(printf '%s\n' "${RESULTS[@]}" | grep -c '^trece$') din ${#RESULTS[@]} verificări trec."
echo "Rapoarte: $REPORTS/calitate-continut.md, $REPORTS/calitate-aplicatie.md"
rm -rf "$SHOTS"
exit $fail
