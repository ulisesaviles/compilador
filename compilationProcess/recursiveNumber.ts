import { isNum } from "../helpers/helpers";
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
  if (state === 0) {
    if (isNum(code[pointers.search])) {
      return recursiveNumber(code, 0, {
        ...pointers,
        search: pointers.search + 1,
      });
    }
    return recursiveNumber(code, 1, {
      current: pointers.current,
      search: pointers.search,
    });
  }
  
  const value = code.substring(pointers.current, pointers.search);
  pointers.current = pointers.search;
  pointers.search = pointers.current;

  return {
    token: ["NUM", value],
    pointers,
  };
};
