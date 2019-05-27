// Null Parser
const nullParser = input => (!input.startWith('null'))? null: [null, input.slice(4)];

// Boolean Parser
const booleanParser = input => (!input.startsWith('true') && !input.startsWith('false'))? null: (input.startsWith('true'))? [true, input.slice(4)]: [false, input.slice(5)];


// Number Parser
let numRegex = /^[-]?[0-9]\d*(\.\d+)?([eE]?[+-]\d+)?/;
const numberParser = input => {
  if( input === '0') return [0,''];
  if(input[0] === '0' && input.length !== 1) return null;
  let secondValue = input.slice(input.match(numRegex)[0].length);
  return !numRegex.test(input)? null: (secondValue[0] === 'e' || secondValue[0] === 'E' || secondValue[0] === '.')? null: [(parseFloat(input.match(numRegex)[0])), secondValue];
}
// String Parser
const stringparser = input => 