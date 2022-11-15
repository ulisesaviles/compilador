input = "Id * Id + Id $"

rule = {
    'E': ['T E_q'],
    'E_q': ['epsilon', '+ T E_q'],
    'T': ['F T_q'],
    'T_q': ['epsilon', '* F T_q'],
    'F': ['(E)', 'Id']
}


def get_input_matches_in_option(stack, option):
    matches = 0
    i = 0
    elements = option.split(' ')
    while True:
        if i < len(stack) - 1 and i < len(elements) and stack[-(i+1)] == elements[i]:
            matches += 1
            i += 1
        else:
            break
    return matches


def parser(input, rule):
    stack = ['$', 'E']
    input = input.split(' ')
    i = 0

    while stack:
        print("Stack: ", stack)
        top = stack.pop()
        print("Top: "+top)
        if top == '$' and input[i] == '$':
            return True
        elif top == input[i]:
            i += 1
        else:
            # Get the options in current rule
            options = rule[top]
            print('OPTIONS: ', options)
            # If there's only one option, put all of the terms in reverse on the stack
            matches_per_option = {}
            if len(options) == 1:
                stack.extend(reversed(options[0].split(' ')))
            else:
                # Otherwise, check what option is a better suit according to the current stack
                print(f'INPUT ACTUAL: {input[i]}')
                for option in options:
                    # If it exists and is how the option starts
                    if input[i] in option:
                        matches = get_input_matches_in_option(stack, option)
                        matches_per_option[option] = matches

                # Now that we only have options that are possible paths to continue, let's choose the one with the most matches
                best_option = None
                for option in matches_per_option:
                    if best_option is None or matches_per_option[option] > matches_per_option[best_option]:
                        best_option = option

                if best_option:
                    # It found a coincidence
                    print('SE ELIGIÓ: ', best_option)
                    stack.extend(reversed(best_option.split(' ')))
                elif 'epsilon' in options:
                    pass
                else:
                    # Didn't find a coincidence
                    return False
        print('\n')


res = parser(input, rule)
print(res)
