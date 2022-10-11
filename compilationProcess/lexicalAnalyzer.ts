import { Token } from "../types/tokens";
import {
  isLetter,
  isNum,
  isComment,
  isComparison,
  isEndOfLine,
  isGrouper,
  isOperator,
} from "../helpers/helpers";

import { recursiveLetter } from "./recursiveLetter";
import { getOperatorID } from "../helpers/operators";
import { Operator } from "../types/operator";

export const lexicalAnalyzer = (
  code: string,
  pointers: { search: number; current: number }
): Token[] => {
  let tokens: Token[] = [];
  while (true) {
    if (isLetter(code[pointers.search])) {
      const { token, pointers: newPointers } = recursiveLetter(
        code,
        0,
        pointers
      );
      tokens.push(token);
      pointers = newPointers;
    } else if (isNum(code[pointers.search])) {
    } else if (isOperator(code[pointers.search])) {
      const token: Token = [
        getOperatorID(code[pointers.search] as Operator) as string,
        code[pointers.search],
      ];
      tokens.push(token);
      pointers.current = pointers.search + 1;
      pointers.search = pointers.current;
    } else if (isComparison(code[pointers.search])) {
    } else if (isEndOfLine(code[pointers.search])) {
      const token: Token = ["END_OF_LINE", ";"];
      tokens.push(token);
      pointers.current = pointers.search + 1;
      pointers.search = pointers.current;
    } else if (isGrouper(code[pointers.search])) {
    }
  }

  return tokens;
};

export const stringifyToken = (token: Token) => {
  return JSON.stringify(token);
};
