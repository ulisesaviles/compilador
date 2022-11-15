import { isLetter, isNum, isQuote } from "../helpers/helpers";
import { Pointers } from "../types/pointers";
import { Token } from "../types/tokens";

export const recursiveNumber = (
  code: string,
  state: number = 0,
  pointers: {
    current: number;
    search: number;
  }
): {
  token: Token;
  pointers: Pointers;
} => {
  if (
    isLetter(code.charAt(pointers.search)) ||
    isQuote(code.charAt(pointers.search))
  )
    throw `Invalid token: ${code.substring(
      pointers.current,
      pointers.search + 1
    )}`;

  if (state === 0) {
    if (isNum(code[pointers.search])) {
      return recursiveNumber(code, 0, {
        ...pointers,
        search: pointers.search + 1,
      });
    } else if (code.charAt(pointers.search) === ".") {
      return recursiveNumber(code, 1, {
        current: pointers.current,
        search: pointers.search + 1,
      });
    }
    return recursiveNumber(code, 2, {
      current: pointers.current,
      search: pointers.search,
    });
  } else if (state === 1) {
    if (isNum(code[pointers.search])) {
      return recursiveNumber(code, 1, {
        ...pointers,
        search: pointers.search + 1,
      });
    }
    const value = code.substring(pointers.current, pointers.search);
    pointers.current = pointers.search;
    pointers.search = pointers.current;

    return {
      token: ["DECIMAL", value],
      pointers,
    };
  }

  const value = code.substring(pointers.current, pointers.search);
  pointers.current = pointers.search;
  pointers.search = pointers.current;

  return {
    token: ["NUM", value],
    pointers,
  };
};
