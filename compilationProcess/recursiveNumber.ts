import { isNum } from "../helpers/helpers";

export const recursiveNumber = (
  code: string,
  state: number = 0,
  pointers: {
    current: number;
    search: number;
  }
) => {
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
