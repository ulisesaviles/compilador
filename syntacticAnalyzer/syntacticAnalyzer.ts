const defaultInput = "Id * Id + Id $";

const rules: { [rule: string]: string[] } = {
  E: ["T E_q"],
  E_q: ["epsilon", "+ T E_q"],
  T: ["F T_q"],
  T_q: ["epsilon", "* F T_q"],
  F: ["(E)", "Id"],
};

const getInputMatchesInProduction = (stack: string[], production: string) => {
  let matches = 0;
  let i = 0;
  let elements = production.split(" ");
  while (true) {
    console.log(`${stack[stack.length - (i + 1)]} === ${elements[i]}`);
    if (
      i < stack.length - 1 &&
      i < elements.length &&
      stack[stack.length - (i + 1)] === elements[i]
    ) {
      // Check index
      matches++;
      i++;
    } else break;
  }
  return matches;
};
const syntacticAnalyzer = async (input = defaultInput) => {
  let stack = ["$", "E"];
  let inputAsArr = input.split(" ");
  let i = 0;

  while (stack) {
    console.log("Stack: ", JSON.stringify(stack));
    let top = stack.pop() as string;
    console.log("Top: " + top);

    if (top === "$" && inputAsArr[i] === "$") return true;
    else if (top === inputAsArr[i]) i++;
    else {
      let productions = rules[top];
      let matchesPerProduction: { [key: string]: number } = {};
      if (productions.length === 1)
        stack.push(...productions[0].split(" ").reverse());
      else {
        console.log(`Input actual: ${inputAsArr[i]}`);
        productions.forEach((production) => {
          if (production.includes(inputAsArr[i])) {
            // Check this if
            let matches = getInputMatchesInProduction(stack, production);
            matchesPerProduction[production] = matches;
          }
        });

        let bestProduction: null | string = null;
        Object.keys(matchesPerProduction).forEach((production) => {
          if (
            !bestProduction ||
            (matchesPerProduction[production] != undefined &&
              matchesPerProduction[production] >
                matchesPerProduction[bestProduction])
          )
            bestProduction = production;
        });

        if (bestProduction) {
          console.log(`Se eligió: ${bestProduction}`);
          stack.push(...(bestProduction as string).split(" ").reverse());
        } else if (productions.includes("epsilon")) continue;
        else {
          return false;
        }
      }
    }
    console.log("");
  }
};

export default syntacticAnalyzer;
