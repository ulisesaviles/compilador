import rules from "./rules";

const variables = Object.keys(rules);

const isAVariable = (tokenName: string) => variables.includes(tokenName);

const defaultInput = ["VAR", "string", "a", "=", '"VALUE"', ";"];

const getBestOption = (options: { [key: string]: number }) => {
  let bestProduction: string | null = null;
  Object.keys(options).forEach((production) => {
    if (
      !bestProduction ||
      (options[production] != undefined &&
        options[production] > options[bestProduction])
    )
      bestProduction = production;
  });
  return bestProduction;
};

const getInputMatchesInProduction = (
  input: string[],
  production: string,
  currentIndex: number = 0,
  topStackItem: string = ""
) => {
  let matches = 0;
  let i = 0;
  let elements = production.split(" ");
  while (true) {
    // While i is in range
    if (i + currentIndex < input.length && i <= elements.length) {
      // If theres a match, save it a continue
      if (input[currentIndex + i] === elements[i]) {
        matches++;
        i++;

        // If not, continue if the current element is a variable (is a key of rules)
      } else if (rules[elements[i]]) {
        const currentRule = rules[elements[i]];
        let matchesPerProduction: { [key: string]: number } = {};

        for (let production of currentRule) {
          if (production !== topStackItem) {
            const prod_elements = production.split(" ");
            let prod_matches = 0;
            let j = i;
            for (let el of prod_elements) {
              console.log(prod_elements, el, input[j + currentIndex]);
              if (el === input[j + currentIndex]) {
                prod_matches++;
                j++;
              } else if (rules[el] && rules[el].length > 1) {
                if (rules[el] && rules[el].includes(input[j + currentIndex])) {
                  prod_matches++;
                  j++;
                } else break;
              } else break;
            }
            matchesPerProduction[production] = prod_matches;
            break;
          }
        }
        const bestProduction = getBestOption(matchesPerProduction);
        const increment = bestProduction
          ? matchesPerProduction[bestProduction]
          : 0;
        matches += increment;
        if (increment == 0) break;
        i = i + currentIndex + increment;
        break;
      } else {
        break;
      }
    } else break;
  }
  console.log(`Found ${matches} matches for `, production);
  return matches;
};

const getBlockOfCodePath = (currentInput: string) => {
  for (let i = 0; i < 4; i++) {
    const production = rules["BLOCK_OF_CODE"][i];
    const rulesFromProduction = rules[production];
    if (rulesFromProduction[0].split(" ")[0] === currentInput)
      return production;
  }
  return "epsilon";
};

const syntacticAnalyzer = (input = defaultInput): boolean => {
  try {
    let stack = ["$", "BLOCK_OF_CODE"];
    let i = 0;
    console.log("Complete input: ", JSON.stringify(input));

    while (stack) {
      console.log("Stack: ", JSON.stringify(stack));
      let stackItem = stack.pop() as string;
      console.log("Top: " + stackItem, "Input: ", input[i]);

      // If top is $ or stack is empty, search is done and successful
      if (stack.length === 0 || stackItem === "$") return true;
      // If current input element (which is a TERMINAL) equals last element on stack,
      //   move to the next input element
      else if (stackItem === input[i]) i++;
      // Otherwise this means top is a VARIABLE
      else {
        let productions = rules[stackItem];
        let matchesPerProduction: { [key: string]: number } = {};

        // If number of productions is one, automatically choose that option
        if (productions.length === 1)
          stack.push(...productions[0].split(" ").reverse());
        // Otherwise, analyze which is the best option
        else {
          console.log(`Input actual: ${input[i]}`);

          // If last element of stack is BLOCK_OF_CODE, use a special function to select the path it should follow
          if (stackItem === "BLOCK_OF_CODE") {
            const selection = getBlockOfCodePath(input[i]);
            console.log(`Se eligio el path: ${selection}`);
            if (selection === "epsilon") continue;
            if (selection) {
              stack.push(...(selection as string).split(" ").reverse());
              continue;
            } else {
              throw `Syntactical analyzer error.`;
            }
          }

          //Otherwise, actually analyze the best option
          console.log("MAIN TOP: ", stackItem);
          productions.forEach((production) => {
            console.log(
              "CURRENT PRODUCTION: ",
              production,
              " FOR INPUT: ",
              input[i]
            );
            let matches = getInputMatchesInProduction(
              input,
              production,
              i,
              stackItem
            );
            matchesPerProduction[production] = matches;
          });

          const bestProduction: null | string =
            getBestOption(matchesPerProduction);

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
