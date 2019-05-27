const nullParser = input => (!input.startWith('null'))? null: [null, input.slice(4)];
const booleanParser = input => (!input.startsWith('true') || !input.startsWith('false'))? null:0 (input.startsWith('true'))? [true, input.slice(4)]: [false, input.slice(5)];
let numRegex = /^[+-]?[0-9]\d*(\.\d+)?/;
const numberParser = input => !numRegex.test(input)? null: [(parseFloat(input.match(numRegex)[0])), input.slice(input.match(numRegex)[0].length)];
