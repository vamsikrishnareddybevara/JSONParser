const nullParser = input => (!input.startWith('null'))? null: [null, input.slice(4)];


const booleanParser = input => (!input.startsWith('true') && !input.startsWith('false'))? null: (input.startsWith('true'))? [true, input.slice(4)]: [false, input.slice(5)];


let numRegex = /^[-]?[0-9]\d*(\.\d+)?([eE]?[+-]?\d+)?/;
const numberParser = input => {
  let secondValue = input.slice(input.match(numRegex)[0].length);
  if( input === '0') return [0,''];
  if(input[0] === '0' && input.length !== 1 && ! /\./.test(input)) return null;
  return !numRegex.test(input)? null: (secondValue[0] === 'e' || secondValue[0] === 'E' || secondValue[0] === '.')? null: [(parseFloat(input.match(numRegex)[0])), secondValue];
}

const fs = require('fs');

let unicodeRegex = /[A-Fa-f0-9]{4}$/;
let specialCharacters = {
        "\"": "\"",
        "\\": "\\",
        "/": "/",
        "b": "\b",
        "f": "\f",
        "n": "\n",
        "r": "\r",
        "t": "\t"
};

let escapeCharacters = {
	"\b": true,
    "\f": true,
    "\n": true,
    "\r": true,
    "\t": true
}

let stringValue = "";
const stringParser = str => {
	for(let i = 0; i < str.length; i++) {
		if(escapeCharacters[str[i]]) return null;
	    if(str[i] === "\\") {
	      if( str[i+1] === 'u') {
	        if(!unicodeRegex.test(str.slice(i+2, i+6))) return null;
	        else {
	          stringValue = stringValue + "\\u" + parseInt(str.slice(i+2, i+6),16).toString('utf-8');
	          i = i+5;
	        }
	      } else {
	      	      if(!specialCharacters[str[i+1]]) return null;
			      else {
			      stringValue = stringValue + specialCharacters[str[i+1]];
			      i = i + 1;
			      }
	    	}
	    }
	    else {
	      stringValue += str[i];
	    }
	  }
	return stringValue;
}

// console.log(stringParser((fs.readFileSync('input.json')).toString('utf-8')));

const arrayValueChecker = value => {
	let returnedArray;
	const typeArray = [nullParser, booleanParser, numberParser, stringParser, arrayParser];
	for (let type of typeArray) {
		returnedArray = type(value);
		if(returnedValue !== null) return value;
	}
	return null;
}

const arrayParser = string => {
	if(string[0] !== "[" || string[string.length-1] !== "]" ) return null;
	let outputArray = [];
	let subString = string.slice(1, string.length);
	while(subString.length !== 0) {
		let returnedArray = arrayValueChecker(subString.trimStart());


}
console.log(arrayParser((fs.readFileSync('input.json'))));