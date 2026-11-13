import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");
const woff = join(root, "node_modules", "@fontsource-variable", "sora", "files", "sora-latin-wght-normal.woff2");
const b64 = readFileSync(woff).toString("base64");
const outDir = join(dirname(fileURLToPath(import.meta.url)), "..", "src", "fonts");
mkdirSync(outDir, { recursive: true });
const css = `/* Latin Sora, inlined so the first stylesheet carries the face. */
@font-face {
  font-family: "Sora Variable";
  font-style: normal;
  font-weight: 100 800;
  font-display: block;
  src: url("data:font/woff2;base64,${b64}") format("woff2");
  unicode-range: U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;
}
`;
writeFileSync(join(outDir, "sora-latin.css"), css);
console.log(css.length);
