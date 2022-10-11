import { Token } from "../types/tokens";

export const lexicalAnalyzer = (code: string): Token[] => {
  return code.split("\n");
};

export const stringifyToken = (token: Token) => {
  return JSON.stringify(token);
};
