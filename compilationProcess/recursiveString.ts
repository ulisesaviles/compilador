import { isQuote } from "../helpers/helpers";
import { Pointers } from "../types/pointers";
import { Token } from "../types/tokens";

export const recursiveString = (
  code: string,
  state: number = 0,
  pointers: Pointers
): {
  token: Token;
  pointers: Pointers;
} => {
  if (state === 0) {
    // Detects first quote
    if (isQuote(code.charAt(pointers.search))) {
      return recursiveString(code, 1, {
        current: pointers.current,
        search: pointers.search + 1,
      });
    }
  } else if (state === 1) {
    // Keeps looking for characters other than quotes
    if (isQuote(code.charAt(pointers.search))) {
      return recursiveString(code, 2, {
        current: pointers.current,
        search: pointers.search + 1,
      });
    }

    return recursiveString(code, 1, {
      current: pointers.current,
      search: pointers.search + 1,
    });
  }

  // Maps value to a reserved keyword
  const value = code.substring(pointers.current, pointers.search);
  pointers.current = pointers.search;
  pointers.search = pointers.current;
  return {
    token: ["STRING", value],
    pointers,
  };
};
