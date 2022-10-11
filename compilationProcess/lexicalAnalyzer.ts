import { Token } from "../types/tokens";
import {
  isLetter,
  isNum,
  isComment,
  isComparison,
  isEndOfLine,
  isGrouper,
  isOperator,
  isBlank,
  isComma,
} from "../helpers/helpers";

import { recursiveLetter } from "./recursiveLetter";
import { recursiveNumber } from "./recursiveNumber";
import { recursiveComparison } from "./recursiveComparison";
import { getOperatorID } from "../helpers/operators";
import { getGrouperID } from "../helpers/groupers";
import { Operator } from "../types/operator";
import { Grouper } from "../types/grouper";

export const lexicalAnalyzer = (
  code: string,
  pointers: { search: number; current: number }
): Token[] => {
  let tokens: Token[] = [];

  while (true) {
    if (isLetter(code.charAt(pointers.search))) {

      const { token, pointers: newPointers } = recursiveLetter(
        code,
        0,
        pointers
      );
      tokens.push(token);
      pointers = newPointers;

    } else if (isNum(code.charAt(pointers.search))) {
      
      const { token, pointers: newPointers } = recursiveNumber(
        code,
        0,
        pointers
      );
      tokens.push(token);
      pointers = newPointers;

    } else if (isOperator(code.charAt(pointers.search))) {
      const token: Token = [
        getOperatorID(code[pointers.search] as Operator) as string,
        code[pointers.search],
      ];
      tokens.push(token);
      pointers.current = pointers.search + 1;
      pointers.search = pointers.current;

    } else if (isComparison(code.charAt(pointers.search))) {

      const { token, pointers: newPointers } = recursiveComparison(
        code,
        0,
        pointers
      );
      tokens.push(token);
      pointers = newPointers;

    } else if (isEndOfLine(code.charAt(pointers.search))) {

      const token: Token = ["END_OF_LINE", ";"];
      tokens.push(token);
      pointers.current = pointers.search + 1;
      pointers.search = pointers.current;

    } else if (isGrouper(code.charAt(pointers.search))) {

      const token: Token = [
        getGrouperID(code[pointers.search] as Grouper) as string,
        code[pointers.search],
      ];
      tokens.push(token);
      pointers.current = pointers.search + 1;
      pointers.search = pointers.current;

    } else if (isBlank(code.charAt(pointers.search))) {

      // Manage blank spaces
      pointers.current = pointers.search + 1;
      pointers.search = pointers.current;

    } else if (isComment(code.charAt(pointers.search))){

      const token: Token = [
        "COMMENT",
        code[pointers.search]
      ];
      tokens.push(token);
      pointers.current = pointers.search + 1;
      pointers.search = pointers.current;
      
    } else if (isComma(code.charAt(pointers.search))){

      const token: Token = [
        "COMMA",
        code[pointers.search]
      ];
      tokens.push(token);
      pointers.current = pointers.search + 1;
      pointers.search = pointers.current;
      
    } else {
      // Avoid loops
      break;
    }

    if (pointers.current >= code.length || pointers.search >= code.length)
      break;
  }

  return tokens;
};

export const stringifyToken = (token: Token) => {
  return `(${token[0]}, ${token[1]})`;
};
