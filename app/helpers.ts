import { ALPHA_NUMERIC_CHARS } from "./constants";

export function generateRandomSequence(length: number) {
  let alphanumericChars = ALPHA_NUMERIC_CHARS;

  let result = "";

  for (let i = 0; i < length; i++) {
    if (alphanumericChars.length === 0) {
      break;
    }

    const randomIndex = Math.floor(Math.random() * alphanumericChars.length);

    result += alphanumericChars[randomIndex];

    alphanumericChars =
      alphanumericChars.slice(0, randomIndex) +
      alphanumericChars.slice(randomIndex + 1);
  }

  return result;
}
