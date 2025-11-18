export function calculatefeedingRate(M5: number, J5: number, R5: number) {
  // M5 = fish size, J5 = temperature, R5 = DE

  const lnTerm = Math.log(J5 - 11.25);
  const inner =
    Math.pow(M5, 1 / 3) +
    (-0.003206 + 0.001705 * lnTerm) * J5;

  const termA = (Math.pow(inner, 3) / M5) - 1;
  const termB = ((0.009 * M5) + 12.45) / (R5 / 1.03);

  const feedingRate = termA * termB * 100;

  return feedingRate;
}



export function calculateNumberOfFish(K4: number, L4: number, H5: number) {
  // K4 = number of fish, L4 = mortality rate (in %), H5 = time interval (days)
  const powerBase = (L4 / 100) + 1;
  const powerResult = Math.pow(powerBase, H5);
  const innerBracket = powerResult - 1;
  const outerBracket = 1 - innerBracket;
  return K4 * outerBracket;
}

export function calculatefishSize(M4: number, J5: number, H5: number) {
  // M4 = previous fish size, J5 = temperature, H5 = time interval (days)
  const term1 = Math.pow(M4, 1 / 3);
  const ln_input = J5 - 11.25;
  if (ln_input <= 0) return NaN;
  const lnTerm = Math.log(ln_input);
  const innerBracket = -0.003206 + 0.001705 * lnTerm;
  const multiplicationTerm = J5 * H5;
  const term2 = innerBracket * multiplicationTerm;
  const baseValue = term1 + term2;
  return Math.pow(baseValue, 3);
}

export function calculateGrowth(newFishSize: number, prevFishSize: number) {
  return newFishSize - prevFishSize;
}