export const getGrouperID = (str: string) => {
  if (str === "{") return "BRACES_OPEN";
  if (str === "}") return "BRACES_CLOSED";
  if (str === "[") return "BRACKET_OPEN";
  if (str === "]") return "BRACKET_CLOSED";
  if (str === "(") return "PARENTHESIS_OPEN";
  if (str === ")") return "PARENTHESIS_CLOSED";
};
