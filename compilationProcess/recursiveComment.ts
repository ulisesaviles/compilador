import { isComment } from "../helpers/helpers";
import { Pointers } from "../types/pointers";
import { Token } from "../types/tokens";

export const recursiveComment = (
  code: string,
  state: number = 0,
  pointers: Pointers
): {
  token: Token;
  pointers: Pointers;
} => {
  if (state === 0) {
    // Detects first quote
    if (isComment(code.charAt(pointers.search))) {
      return recursiveComment(code, 1, {
        current: pointers.current,
        search: pointers.search + 1,
      });
    }
  } else if (state === 1) {
    // Keeps looking for characters other than quotes
    if (
      code.charAt(pointers.search) == "\n" ||
      pointers.search == code.length - 1
    ) {
      return recursiveComment(code, 2, {
        current: pointers.current,
        search: pointers.search + 1,
      });
    }

    return recursiveComment(code, 1, {
      current: pointers.current,
      search: pointers.search + 1,
    });
  }

  // Maps value to a reserved keyword
  const value = code.substring(pointers.current, pointers.search);
  pointers.current = pointers.search;
  pointers.search = pointers.current;
  return {
    token: ["COMMENT", value],
    pointers,
  };
};
