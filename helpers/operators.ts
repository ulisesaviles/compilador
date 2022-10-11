export const getOperatorID = (str: string) => {
  if (str === "+") return "OP_SUM";
  if (str === "-") return "OP_SUBS";
  if (str === "*") return "OP_MULTI";
  if (str === "/") return "OP_DIV";
};
