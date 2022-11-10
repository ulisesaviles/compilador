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

export const rules = {};
