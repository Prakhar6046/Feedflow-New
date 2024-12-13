export const passwordPattern =
  /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/;
export const emailPattern =
  /^(?!.*\.com\.com)(?!.*\.\.)(?!.*\.\.)(?!^[._%+-])[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const phonePattern = /^\d+$/;
export const alphabetsAndSpacesPattern = /^[a-zA-Z\s]*$/;
export const alphabetsNumbersAndSpacesPattern = /^[a-zA-Z][a-zA-Z0-9\s]*$/;
export const addressPattern = /^[a-zA-Z0-9\s!@#$%^&*(),.?":{}|<>-]*$/;
export const onlyNumbersPattern = /^[0-9]*$/;
export const alphabetsSpacesAndSpecialCharsPattern =
  /^[a-zA-Z\s!@#$%^&*(),.?":{}|<>]*$/;
export const alphabetsNumbersAndSpacesPattern2 = /^[a-zA-Z0-9\s]*$/;
export const numbersWithDot = /^\d*\.?\d*$/;
export const negativeNumberWithDot = /^-?[0-9]\d*(\.\d+)?$/;
export const numberWithCommaDot = /^(\d+(?:[\.\,]\d{2})?)$/;
// ""
