/**
 * build-logo.mjs
 * -----------------------------------------------------------------------------
 * Regenerate spec/assets/logo*.svg + lib/src/assets/logo*.svg from the
 * outlines of Arial Black + Arial Bold Italic. Output SVGs ship as path data
 * so the logo renders identically on systems without the original fonts.
 *
 * Requirements:
 *   - macOS (Arial Black + Arial Bold Italic in /System/Library/Fonts/Supplemental/)
 *   - Node ≥ 18
 *   - opentype.js installed globally:  npm install -g opentype.js
 *
 * Usage:  node scripts/build-logo.mjs
 */
import { readFileSync, writeFileSync, copyFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
const root = spawnSync("npm", ["root", "-g"], { encoding: "utf8" }).stdout.trim();
const op = await import(root + "/opentype.js/dist/opentype.module.js");
const opentype = op.default || op;

const ARIAL_BLACK    = "/System/Library/Fonts/Supplemental/Arial Black.ttf";
const ARIAL_BOLD_IT  = "/System/Library/Fonts/Supplemental/Arial Bold Italic.ttf";
const fontBlack    = opentype.parse(readFileSync(ARIAL_BLACK).buffer);
const fontBoldIt   = opentype.parse(readFileSync(ARIAL_BOLD_IT).buffer);

const wmFontSize = 172;
const wm   = fontBlack.getPath("Regulon", 0, 158, wmFontSize, { kerning: true });
const wmBox = wm.getBoundingBox();
const wmPath = wm.toPathData(2);

const dbFontSize = 130;
const db   = fontBoldIt.getPath("DB", 0, 148, dbFontSize, { kerning: true });
const dbBox  = db.getBoundingBox();
const dbWidth = dbBox.x2 - dbBox.x1;
const dbPath = db.toPathData(2);

const GAP        = 18;
const TAIL_LEFT  = Math.ceil(wmBox.x2 + GAP);
const TAIL_RIGHT = TAIL_LEFT + 230;
const HEAD_TIP   = TAIL_RIGHT + 145;
const HEAD_Y_TOP = 4, HEAD_Y_BOT = 196;
const TAIL_Y_TOP = 32, TAIL_Y_BOT = 168;
const VBW        = HEAD_TIP + 8;
const HEIGHT     = 200;

const DB_X = TAIL_LEFT + Math.round((230 - dbWidth) / 2) - 6;

const arrowD = `M ${TAIL_LEFT} ${TAIL_Y_TOP} L ${TAIL_RIGHT} ${TAIL_Y_TOP} L ${TAIL_RIGHT} ${HEAD_Y_TOP} L ${HEAD_TIP} 100 L ${TAIL_RIGHT} ${HEAD_Y_BOT} L ${TAIL_RIGHT} ${TAIL_Y_BOT} L ${TAIL_LEFT} ${TAIL_Y_BOT} Z`;

const makeSvg = ({ wordFill, arrowFill, label }) => `<?xml version="1.0" encoding="UTF-8"?>
<!-- RegulonDB — wordmark v1.1 (paths). Regenerate with scripts/build-logo.mjs. -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${VBW} ${HEIGHT}" role="img" aria-label="${label}">
  <title>${label}</title>
  <path d="${arrowD}" fill="${arrowFill}"/>
  <line x1="${TAIL_LEFT - 4}" y1="100" x2="${HEAD_TIP - 6}" y2="100" stroke="#FFFFFF" stroke-width="2" opacity="0.85"/>
  <path d="${wmPath}" fill="${wordFill}"/>
  <g transform="translate(${DB_X}, 0)"><path d="${dbPath}" fill="#FFFFFF"/></g>
</svg>
`;

const SPEC = "/Users/pablo.epl/workspace/projects/genome_browser/regulondb-mg-design-system/spec/assets";
const LIB  = "/Users/pablo.epl/workspace/projects/genome_browser/regulondb-mg-design-system/lib/src/assets";

writeFileSync(`${SPEC}/logo.svg`,         makeSvg({ wordFill: "#000000", arrowFill: "#32617D", label: "RegulonDB" }));
writeFileSync(`${SPEC}/logo-on-dark.svg`, makeSvg({ wordFill: "#FFFFFF", arrowFill: "#3D779B", label: "RegulonDB" }));

// Compact mark — arrow + DB only (no wordmark)
const markVbw = HEAD_TIP - TAIL_LEFT + 8;
const markArrow = `M 0 ${TAIL_Y_TOP} L ${TAIL_RIGHT - TAIL_LEFT} ${TAIL_Y_TOP} L ${TAIL_RIGHT - TAIL_LEFT} ${HEAD_Y_TOP} L ${HEAD_TIP - TAIL_LEFT} 100 L ${TAIL_RIGHT - TAIL_LEFT} ${HEAD_Y_BOT} L ${TAIL_RIGHT - TAIL_LEFT} ${TAIL_Y_BOT} L 0 ${TAIL_Y_BOT} Z`;
const markSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${markVbw} ${HEIGHT}" role="img" aria-label="RegulonDB">
  <title>RegulonDB</title>
  <path d="${markArrow}" fill="#32617D"/>
  <line x1="-4" y1="100" x2="${HEAD_TIP - TAIL_LEFT - 6}" y2="100" stroke="#FFFFFF" stroke-width="2" opacity="0.85"/>
  <g transform="translate(${DB_X - TAIL_LEFT}, 0)"><path d="${dbPath}" fill="#FFFFFF"/></g>
</svg>
`;
writeFileSync(`${SPEC}/logo-mark.svg`, markSvg);

for (const f of ["logo.svg", "logo-on-dark.svg", "logo-mark.svg"]) copyFileSync(`${SPEC}/${f}`, `${LIB}/${f}`);
console.log(`viewBox 0 0 ${VBW} ${HEIGHT}`);
console.log(`tail left=${TAIL_LEFT} right=${TAIL_RIGHT} head=${HEAD_TIP}`);
console.log(`DB at x=${DB_X}`);
console.log("✓ wrote 3 SVGs to spec/assets and lib/src/assets");
