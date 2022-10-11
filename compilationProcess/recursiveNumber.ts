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
  }

  return {
    token: ["NUM", code.substring(pointers.current, pointers.search)],
    pointers,
  };
};
