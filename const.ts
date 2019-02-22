/**
 * Time in milliseconds
 */
export enum TIMES {
  MOVE = 20000,
  MINE_FOO = 1000,
  MINE_BAR = generateBarTime(0.5, 2) * 1000,
  ASSEMBLE = 2000,
  SELL = 10000
}

// Test timers
/**export enum TIMES {
    MOVE = 200,
    MINE_FOO = 10,
    MINE_BAR = generateBarTime(0.5, 2) * 10,
    ASSEMBLE = 20,
    SELL = 100,
}*/

export enum MATERIAL_TYPE {
  FOO = 1,
  BAR = 2
}

export enum POSITION {
  MINING = 1,
  ASSEMBLING = 2,
  SELL = 3,
  BUY = 4
}

/**
 * Generate random number beetween s and e
 * @param s start
 * @param e end
 */
function generateBarTime(s: number, e: number): number {
  return Math.random() * (e - 1) + s;
}
