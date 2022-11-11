import rules from "./rules";
const defaultInput = ["VAR", "string", "a", "=", '"VALUE"', ";"];

const getInputMatchesInProduction = (input: string[], production: string, currentIndex: number = 0) => {
  let matches = 0;
  let i = 0;
  let elements = production.split(" ");
  while (true) {
    console.log(`${i + currentIndex} < ${input.length} &&
    ${i + currentIndex} < ${elements.length}`)
    if (
      i + currentIndex < input.length &&
      i <= elements.length
    ) {
      console.log(i);
      console.log(`${input[currentIndex + i]} === ${elements[i]}`, currentIndex)
      if (input[currentIndex + i] === elements[i]) {
        console.log('ENTRÓ');
        // Check index
        matches++;
        i++;
      }
      else if (rules[elements[i]]){
        //THIS IS MAKING THE WHOLE SHEET LOOP INFINETELY
        const currentProduction = rules[elements[i]];
        for (let prod in currentProduction) {
          const foundMatches = getInputMatchesInProduction(input, prod, currentIndex + i);
          if (foundMatches > 0) {
            matches++;
            i++;
            break;
          }
        }
      }
      else break;
    } else break;
  }
  return matches;
};
//Dennis guapo
const getBlockOfCodeBranch = (currentInput: string) => {
  for (let i = 0; i < 4; i++) {
    const production = rules["BLOCK_OF_CODE"][i];
    const rulesFromProduction = rules[production];
    if (rulesFromProduction[0].split(" ")[0] === currentInput) return production;
  }
  return "epsilon";
}

const syntacticAnalyzer = (input = defaultInput): boolean => {
  try {
    let stack = ["$", "BLOCK_OF_CODE"];
    // let inputAsArr = input.split(" ");
    let i = 0;

    while (stack) {
      console.log("Stack: ", JSON.stringify(stack));
      let top = stack.pop() as string;
      console.log("Top: " + top);
      if (stack.length === 0 || top === "$") return true;
      else if (top === input[i]) i++;
      else {
        let productions = rules[top];
        let matchesPerProduction: { [key: string]: number } = {};
        if (productions.length === 1)
          stack.push(...productions[0].split(" ").reverse());
        else {
          console.log(`Input actual: ${input[i]}`);
          if (top === 'BLOCK_OF_CODE') {
            const selection = getBlockOfCodeBranch(input[i]);
            console.log(`Se eligio: ${selection}`);
            if (selection === "epsilon") continue;
            if (selection) {
              stack.push(...(selection as string).split(" ").reverse());
              continue;
            }
            else {
              throw `Syntactical analyzer error.`;
            }
          }
          productions.forEach((production) => {
            if (production.includes(input[i])) {
              let matches = getInputMatchesInProduction(input, production, i);
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
