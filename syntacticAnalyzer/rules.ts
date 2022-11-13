/* 
statement -> ANYTHING;
blockOfCode -> statement | for | if
-----RULES-----
1. assignation: var string a = 'some string';
2. operation: (ID | number) (+ | - | * | /) (ID | number)
3. comparison: (ID | number) (< | <= | >= | !=) (ID | number)
4. and: (ID | comparison) AND (ID | comparison)
5. or: (ID | comparison) OR (ID | comparison)
6. End of line: ANYTHING;
7. comment: # ANYTHING \n
8. for: FOR (ID=number, comparison, number) { blockOfCode* }
*/

const rules: { [rule: string]: string[] } = {
  BLOCK_OF_CODE: ["DECLARATION", "IF_SENTENCE", "SWITCH_SENTENCE", "FOR_SENTENCE", "BLOCK_OF_CODE BLOCK_OF_CODE", "epsilon" ],
  DECLARATION: [
    // srt
    "VAR STRING ID ASSIGNATION STRING_VALUE END_OF_LINE", 
    // num
    "VAR NUMBER ID ASSIGNATION NUMERIC_VALUE END_OF_LINE",
    // bool
    "VAR BOOL ID ASSIGNATION BOOLEAN_VALUE END_OF_LINE",
  ],
  // OPERATION: [
  //   'OPERATION + OPERATION',
  //   'OPERATION - OPERATION',
  //   'OPERATION * OPERATION',
  //   'OPERATION / OPERATION',
  //   'NUMERIC_VALUE'
  // ],
  OPERATION: [
    'NUMERIC_VALUE OP_SUM NUMERIC_VALUE',
    'NUMERIC_VALUE OP_SUBS NUMERIC_VALUE',
    'NUMERIC_VALUE OP_MULTI NUMERIC_VALUE',
    'NUMERIC_VALUE OP_DIV NUMERIC_VALUE',
    'OPERATION'
  ],
  COMPARISON: [
    'NUMERIC_VALUE < NUMERIC_VALUE',
    'NUMERIC_VALUE <= NUMERIC_VALUE',
    'NUMERIC_VALUE == NUMERIC_VALUE',
    'NUMERIC_VALUE != NUMERIC_VALUE',
    'NUMERIC_VALUE >= NUMERIC_VALUE',
    "BOOLEAN_VALUE"
  ],
  END_OF_LINE: [";"],
  ASSIGNATION: ["="],
  NUMERIC_VALUE: ["NUM", "ID", "DECIMAL", "OPERATION"],
  BOOLEAN_VALUE: [
    "TRUE", 
    "FALSE", 
    "ID", 
    "COMPARISON", 
    "BOOLEAN_VALUE AND BOOLEAN_VALUE", 
    "BOOLEAN_VALUE OR BOOLEAN_VALUE"
  ],
  IF_SENTENCE: ["IF PARENTHESIS_OPEN BOOLEAN_VALUE PARENTHESIS_CLOSED BRACES_OPEN BLOCK_OF_CODE BRACES_CLOSED", "IF PARENTHESIS_OPEN BOOLEAN_VALUE PARENTHESIS_CLOSED BRACES_OPEN BLOCK_OF_CODE BRACES_CLOSED ELSE_SENTENCE",],
  ELSE_SENTENCE: ["ELSE BRACES_OPEN BLOCK_OF_CODE BRACES_CLOSED"],
  SWITCH_SENTENCE: ["SWITCH BRACES_OPEN CASES DEFAULT BRACES_OPEN BLOCK_OF_CODE BRACES_CLOSED"],
  CASES: ["CASE PARENTHESIS_OPEN BOOLEAN_VALUE PARENTHESIS_CLOSED BRACES_OPEN BLOCK_OF_CODE BRACES_CLOSED", "CASES CASES"],
  FOR_SENTENCE: ["FOR PARENTHESIS_OPEN DECLARATION COMMA BOOLEAN_VALUE COMMA NUM PARENTHESIS_CLOSED BRACES_OPEN BLOCK_OF_CODE BRACES_CLOSED"]
};

export default rules;
