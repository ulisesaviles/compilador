// Types
import { Token } from "../types/tokens";
import { Operator } from "../types/operator";
import { Grouper } from "../types/grouper";

// Helpers
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
  isQuote,
} from "../helpers/helpers";
import { getOperatorID } from "../helpers/operators";
import { getGrouperID } from "../helpers/groupers";

// State machines
import { recursiveLetter } from "./recursiveLetter";
import { recursiveNumber } from "./recursiveNumber";
import { recursiveComparison } from "./recursiveComparison";
import { recursiveString } from "./recursiveString";
import { recursiveComment } from "./recursiveComment";

// Actual lexical analyzer
export const lexicalAnalyzer = (
  code: string,
  pointers = {
    current: 0,
    search: 0,
  }
): Token[] => {
  // Tokens
  let tokens: Token[] = [];

  // Read code iteratively
  while (true) {
    if (isLetter(code.charAt(pointers.search))) {
      // Letters (IDs or reserved words)
      const { token, pointers: newPointers } = recursiveLetter(
        code,
        0,
        pointers
      );
      tokens.push(token);
      pointers = newPointers;
    } else if (isQuote(code.charAt(pointers.search))) {
      // Strings
      const { token, pointers: newPointers } = recursiveString(
        code,
        0,
        pointers
      );
      tokens.push(token);
      pointers = newPointers;
    } else if (isNum(code.charAt(pointers.search))) {
      // Numbers
      const { token, pointers: newPointers } = recursiveNumber(
        code,
        0,
        pointers
      );
      tokens.push(token);
      pointers = newPointers;
    } else if (isOperator(code.charAt(pointers.search))) {
      // Operators
      const token: Token = [
        getOperatorID(code[pointers.search] as Operator) as string,
        code[pointers.search],
      ];
      tokens.push(token);
      pointers.current = pointers.search + 1;
      pointers.search = pointers.current;
    } else if (isComparison(code.charAt(pointers.search))) {
      // Comparisons
      const { token, pointers: newPointers } = recursiveComparison(
        code,
        0,
        pointers
      );
      tokens.push(token);
      pointers = newPointers;
    } else if (isEndOfLine(code.charAt(pointers.search))) {
      // End of line
      const token: Token = ["END_OF_LINE", ";"];
      tokens.push(token);
      pointers.current = pointers.search + 1;
      pointers.search = pointers.current;
    } else if (isGrouper(code.charAt(pointers.search))) {
      // Groupers
      const token: Token = [
        getGrouperID(code[pointers.search] as Grouper) as string,
        code[pointers.search],
      ];
      tokens.push(token);
      pointers.current = pointers.search + 1;
      pointers.search = pointers.current;
    } else if (isBlank(code.charAt(pointers.search))) {
      // Blank char
      pointers.current = pointers.search + 1;
      pointers.search = pointers.current;
    } else if (isComment(code.charAt(pointers.search))) {
      // Comments
      const { token, pointers: newPointers } = recursiveComment(
        code,
        0,
        pointers
      );
      tokens.push(token);
      pointers = newPointers;
    } else if (isComma(code.charAt(pointers.search))) {
      // Commas
      const token: Token = ["COMMA", code[pointers.search]];
      tokens.push(token);
      pointers.current = pointers.search + 1;
      pointers.search = pointers.current;
    } else {
      // Errors
      throw `Invalid token: ${code.charAt(pointers.search)}`;
    }

    // Also avoid loops
    if (pointers.current >= code.length || pointers.search >= code.length)
      break;
  }

  // Return gotten tokens
  return tokens;
};
