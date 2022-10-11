export const isLetter = (str: string) => {
  return /^[a-zA-Z]+$/.test(str);
};

export const isNum = (str: string) => {
  if (["", " "].includes(str)) return false;
  return !isNaN(parseInt(str));
};

export const isEndOfLine = (str: string) => {
  return str === ";";
};

export const isGrouper = (str: string) => {
  return ["[", "]", "{", "}", "(", ")"].includes(str);
};

export const isComment = (str: string) => {
  return str === "#";
};

export const isOperator = (str: string) => {
  return ["+", "-", "*", "/"].includes(str);
};

export const isComparison = (str: string) => {
  return [">", "=", "!", "<",].includes(str);
};

export const isBlank = (str: string) => {
  return ["\n", " ", "", "\t"].includes(str);
};
