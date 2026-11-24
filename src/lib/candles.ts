// Hand-authored, purely illustrative price series — not market data.
// [open, high, low, close] on an arbitrary 0–100 scale.
export const CANDLES: [number, number, number, number][] = [
  [40, 44, 38, 42],
  [42, 46, 41, 45],
  [45, 47, 40, 41],
  [41, 43, 36, 38],
  [38, 42, 35, 41],
  [41, 44, 40, 43],
  [43, 45, 39, 40],
  [40, 41, 34, 35], // 7  — down candle before the impulse (order block)
  [35, 40, 33, 39], // 8  — sweep of the low, rejection
  [39, 43, 38, 42], // 9
  [42, 56, 41, 55], // 10 — displacement
  [55, 59, 50, 57], // 11 — low 50 vs candle 9 high 43 => fair value gap
  [57, 60, 54, 55],
  [55, 58, 52, 57],
  [57, 63, 56, 62],
  [62, 64, 58, 59],
  [59, 61, 53, 54],
  [54, 57, 51, 56],
  [56, 58, 47, 49], // 18 — retrace into the gap
  [49, 56, 48, 55],
  [55, 63, 54, 62],
  [62, 68, 61, 67],
  [67, 70, 64, 65],
  [65, 72, 64, 71],
]
