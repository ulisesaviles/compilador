import rules from "./rules";
const defaultInput = ["VAR", "string", "a", "=", '"VALUE"', ";"];

const getInputMatchesInProduction = (stack: string[], production: string) => {
  let matches = 0;
  let i = 0;
  let elements = production.split(" ");
  while (true) {
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

const syntacticAnalyzer = (input = defaultInput): boolean => {
  try {
    let stack = ["$", "declaration"];
    // let inputAsArr = input.split(" ");
    let i = 0;

    while (stack) {
      console.log("Stack: ", JSON.stringify(stack));
      let top = stack.pop() as string;
      console.log("Top: " + top);
      console.log(stack.length);
      if (stack.length === 0) return true;
      else if (top === input[i]) i++;
      else {
        let productions = rules[top];
        let matchesPerProduction: { [key: string]: number } = {};
        if (productions.length === 1)
          stack.push(...productions[0].split(" ").reverse());
        else {
          console.log(`Input actual: ${input[i]}`);
          productions.forEach((production) => {
            if (production.includes(input[i])) {
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
            throw "Syntactical analyzer error.";
          }
        }
      }
    }
  } catch (e) {
    throw `Syntactical analyzer error.`;
  }
  return false;
};

export default syntacticAnalyzer;
