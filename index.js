// Null Parser
const nullParser = input => (!input.startWith('null'))? null: [null, input.slice(4)];

// Boolean Parser
const booleanParser = input => (!input.startsWith('true') && !input.startsWith('false'))? null: (input.startsWith('true'))? [true, input.slice(4)]: [false, input.slice(5)];
let numRegex = /^[+-]?[1-9]\d*(\.\d+)?(([eE]?)([+-])?\d+)?/;

// Number Parser
const numberParser = input => {
  if( input === '0') return [0,''];
  return !numRegex.test(input) && input !== "0"? null: [(parseFloat(input.match(numRegex)[0])), input.slice(input.match(numRegex)[0].length)];
}

// String Parser
const stringparser = input => 