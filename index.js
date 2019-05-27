const nullParser = input => (!input.startWith('null'))? null: [null, input.slice(4)];
const booleanParser = input => (!input.startsWith('true') || !input.startsWith('false'))? null: (input.startsWith('true'))? [true, input.slice(4)]: [false, input.slice(5)];
