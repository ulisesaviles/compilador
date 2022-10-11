import { isLetter } from "../helpers/helpers";
import { reservedWords } from "../helpers/reservedWords";
import { Pointers } from "../types/pointers";
import { ReservedWord } from "../types/reservedWords";
import { Token } from "../types/tokens";

export const recursiveLetter = (
  code: string,
  state: number = 0,
  pointers: Pointers
): {
  token: Token;
  pointers: Pointers;
} => {
  // Keeps looking for letters
  if (state === 0) {
    if (isLetter(code.charAt(pointers.search))) {
      return recursiveLetter(code, 0, {
        current: pointers.current,
        search: pointers.search + 1,
      });
    }
    return recursiveLetter(code, 1, {
      current: pointers.current,
      search: pointers.search,
    });
  }

  // Maps value to a reserved keyword
  const value = code.substring(pointers.current, pointers.search);
  pointers.current = pointers.search;
  pointers.search = pointers.current;
  if (Object.keys(reservedWords).includes(value))
    return {
      token: [reservedWords[value as ReservedWord].toUpperCase(), value],
      pointers,
    };

  // Returns ID
  return { token: ["ID", value], pointers };
};
