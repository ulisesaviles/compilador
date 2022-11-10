import { Comparator } from "../types/comparator";
import { Pointers } from "../types/pointers";
import { Token } from "../types/tokens";

export const recursiveComparison = (
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
  switch(state) {

    case 0:
      if (code.charAt(pointers.search) === '<') {
        return recursiveComparison(code, 1, {
          ...pointers,
          search: pointers.search + 1,
        });
      }
      else if (code.charAt(pointers.search) === '>') {
        return recursiveComparison(code, 2, {
          ...pointers,
          search: pointers.search + 1,
        });
      }
      else if (code.charAt(pointers.search) === '!') {
        return recursiveComparison(code, 3, {
          ...pointers,
          search: pointers.search + 1,
        });
      }
      else if (code.charAt(pointers.search) === '=') {
        return recursiveComparison(code, 4, {
          ...pointers,
          search: pointers.search + 1,
        });
      }
      return {
        token: ['ERROR', code.substring(pointers.current, pointers.search)],
        pointers
      }

    case 1:
      if (code.charAt(pointers.search) === '=') {
        let value = code.substring(pointers.current, pointers.search + 1);
        pointers.current = pointers.search + 1;
        pointers.search = pointers.current;
        return {
          token: [Comparator.LESS_OR_EQUAL, value],
          pointers
        }
      }
      
      let value_1 = code.substring(pointers.current, pointers.search);
      pointers.current = pointers.search;
      pointers.search = pointers.current;
      return {
        token: [Comparator.LESS, value_1],
        pointers
      }

    case 2:
      if (code.charAt(pointers.search) === '=') {
        let value = code.substring(pointers.current, pointers.search + 1);
        pointers.current = pointers.search + 1;
        pointers.search = pointers.current;
        return {
          token: [Comparator.GREATER_OR_EQUAL, value],
          pointers
        }
      }

      let value_2 = code.substring(pointers.current, pointers.search);
      pointers.current = pointers.search;
      pointers.search = pointers.current;
      return {
        token: [Comparator.GREATER, value_2],
        pointers
      }

    case 3:
      if (code.charAt(pointers.search) === '=') {
        let value = code.substring(pointers.current, pointers.search + 1);
        pointers.current = pointers.search + 1;
        pointers.search = pointers.current;
        return {
          token: [Comparator.DIFFERENT, value],
          pointers
        }
      }

      let value_3 = code.substring(pointers.current, pointers.search);
      pointers.current = pointers.search;
      pointers.search = pointers.current;
      return {
        token: ['ERROR', value_3],
        pointers
      }

    case 4:
      if (code.charAt(pointers.search) === '=') {
        let value = code.substring(pointers.current, pointers.search + 1);
        pointers.current = pointers.search + 1;
        pointers.search = pointers.current;
        return {
          token: [Comparator.EQUALS, value],
          pointers
        }
      }
      let value_4 = code.substring(pointers.current, pointers.search);
      pointers.current = pointers.search;
      pointers.search = pointers.current;
      return {
        token: ['ASSIGNATION', value_4],
        pointers
      }

    default:
      let value = code.substring(pointers.current, pointers.search);
      pointers.current = pointers.search;
      pointers.search = pointers.current;
      return {
        token: ['ERROR', value],
        pointers
      }
  }
};
