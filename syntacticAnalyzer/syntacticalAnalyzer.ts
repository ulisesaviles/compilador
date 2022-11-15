import rules from "./rules";

const variables = Object.keys(rules);

const isAVariable = (tokenName: string) => variables.includes(tokenName);

const defaultInput = ["VAR", "string", "a", "=", '"VALUE"', ";"];

const getNumOfBlocksOfCode = (input: string[], index?: number) => {
  let blocks: "BLOCK_OF_CODE"[] = [];
  // If its at the root of the input
  if (index === undefined) {
    input.forEach((element) => {
      if (["END_OF_LINE", "BRACES_OPEN"].includes(element))
        blocks.push("BLOCK_OF_CODE");
    });
  } else {
    // It is inside of two braces
    for (let i = index; i < input.length; i++) {
      const element = input[i];
      // Push a block on every ;
      if (element === "END_OF_LINE") blocks.push("BLOCK_OF_CODE");
      // On { look for }
      else if (element === "BRACES_OPEN") {
        for (; true; i++) {
          const element = input[i];
          if (element === "BRACES_CLOSED") {
            blocks.push("BLOCK_OF_CODE");
            break;
          }
          if (i + 1 === input.length)
            throw "Syntactical analyzer error: Got out of range looking for }";
        }
        // Stop searching
      } else if (element === "BRACES_CLOSED") break;
    }
  }

  return blocks;
};

const getBestProduction = (
  input: string[],
  currentIndex: number,
  productions: string[]
): {
  production: string;
  selectedProductionIndex: number;
  matches: number;
} => {
  let matchesPerProduction: { [key: string]: number } = {};
  productions.forEach((production) => {
    let [matches, index] = getInputMatchesInProduction(
      input,
      currentIndex,
      production
    );
    matchesPerProduction[production] = matches;
  });

  const matches = productions.map(
    (production) => matchesPerProduction[production]
  );
  const bestProductionMatches = Math.max(...matches);
  input[currentIndex];
  const selectedProductionIndex = matches.indexOf(bestProductionMatches);
  return {
    production: productions[selectedProductionIndex],
    selectedProductionIndex,
    matches: bestProductionMatches,
  };
};

const getInputMatchesInProduction = (
  input: string[],
  inputIndex: number = 0,
  production: string
): [number, number] => {
  let matches = 0;
  const itemsInProduction = production.split(" ");
  // Iterate
  for (
    let productionIndex = 0;
    inputIndex < input.length && productionIndex < itemsInProduction.length;
    inputIndex++, productionIndex++
  ) {
    const productionElement = itemsInProduction[productionIndex];
    if (input[inputIndex] === productionElement) {
      // Found a match
      matches++;
      continue;
    } else if (isAVariable(productionElement)) {
      // Is a variable, will make recursion on all its rules
      // console.log(productionElement, " Is a variable");
      const productionsOfVariable = rules[productionElement];
      const { matches: matchesFound } = getBestProduction(
        input,
        inputIndex,
        productionsOfVariable
      );
      matches += matchesFound;
    } else {
      break;
    }
  }
  // console.log(`Ended with ${matches} matches for ${production}`);
  return [matches, inputIndex];
};

const getBlockOfCodePath = (currentInput: string) => {
  for (let i = 0; i < 4; i++) {
    const production = rules["BLOCK_OF_CODE"][i];
    const rulesFromProduction = rules[production];
    // console.log(`${rulesFromProduction[0].split(" ")[0]} === ${currentInput}`); // BREAK
    if (rulesFromProduction[0].split(" ")[0] === currentInput)
      return production;
  }
  return "epsilon";
};

const syntacticalAnalyzer = (
  input = defaultInput
): { status: boolean; logs: string[] } => {
  let logs = [];

  try {
    let stack = ["$", "BLOCK_OF_CODE"];
    stack.push(...getNumOfBlocksOfCode(input));
    let i = 0;
    logs.push(`Complete input: ${JSON.stringify(input).replaceAll(",", ", ")}`);

    while (stack) {
      logs.push(`Stack: ${JSON.stringify(stack).replaceAll(",", ", ")}`);
      let stackItem = stack.pop() as string;

      // If top is $ or stack is empty, search is done and successful
      if (stackItem === "$" && i >= input.length - 1) {
        logs.push("Success🎉");
        return { status: true, logs };
      }
      // If current input element (which is a TERMINAL) equals last element on stack,  move to the next input element
      else if (stackItem === input[i]) i++;
      // Otherwise this means top is a VARIABLE
      else if (isAVariable(stackItem)) {
        let productions = rules[stackItem];

        // If number of productions is one, automatically choose that option
        if (productions.length === 1)
          stack.push(...productions[0].split(" ").reverse());
        // Otherwise, analyze which is the best option
        else {
          // console.log(`Input actual: ${input[i]}`);

          // If last element of stack is BLOCK_OF_CODE, use a special function to select the path it should follow
          if (stackItem === "BLOCK_OF_CODE") {
            const selection = getBlockOfCodePath(input[i]);
            // console.log(`Se eligio el path: ${selection}`);
            if (selection === "epsilon") {
              logs.push(`Se eligió: epsilon`);
              continue;
            }
            if (i !== 0) stack.push(...getNumOfBlocksOfCode(input, i));
            if (selection) {
              stack.push(...(selection as string).split(" ").reverse());
              continue;
            } else {
              throw `Syntactical analyzer error: Unresolved block of code path`;
            }
          }

          // Otherwise, actually analyze the best option
          const bestProduction = getBestProduction(input, i, productions);

          // Add production items to the stack
          if (bestProduction.matches > 0) {
            logs.push(`Se eligió: ${bestProduction.production}`);
            stack.push(
              ...(bestProduction.production as string).split(" ").reverse()
            );
          }
          // Use epsilon if possible
          else if (productions.includes("epsilon")) {
            logs.push(`Se eligió: epsilon`);
            continue;
          }
          // Throw error
          else {
            throw "Syntactical analyzer error: There was no best production.";
          }
        }
      } else {
        throw `Syntactical analyzer error: Unrecognized token: ${stackItem}`;
      }
    }
  } catch (e) {
    throw `Syntactical analyzer error: ERROR.`;
  }
  return { status: false, logs };
};

export default syntacticalAnalyzer;
