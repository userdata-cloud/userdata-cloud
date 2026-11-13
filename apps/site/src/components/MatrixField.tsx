const COLS = 300;
const ROWS = 160;

function nextBit(n: number) {
  n = Math.imul(n ^ (n >>> 16), 0x7feb352d);
  n = Math.imul(n ^ (n >>> 15), 0x846ca68b);
  return (n ^ (n >>> 16)) >>> 0;
}

function field() {
  let n = 0x6d2b79f5;
  const lines: string[] = [];
  for (let r = 0; r < ROWS; r++) {
    let line = "";
    for (let c = 0; c < COLS; c++) {
      n = nextBit(n);
      line += n & 1 ? "1" : "0";
    }
    lines.push(line);
  }
  return lines.join("\n");
}

const BITS = field();

export default function MatrixField() {
  return (
    <pre class="matrix-field" aria-hidden="true">
      {BITS}
    </pre>
  );
}
