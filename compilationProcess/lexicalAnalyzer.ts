import { Token } from "../types/tokens";

export const lexicalAnalyzer = (code: string): Token[] => {
  const lines = code.split("\n");
  const spaceSeparatedValues: string[] = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    spaceSeparatedValues.push(...line.split(" "));
  }
  return spaceSeparatedValues;
};

export const stringifyToken = (token: Token) => {
  return JSON.stringify(token);
};
