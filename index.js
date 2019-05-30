// Null Parser
const fs = require('fs');
const nullParser = input => (!input.startsWith("null"))? null: [null, input.slice(4)];

// Boolean Parser
const booleanParser = input => (!input.startsWith('true') && !input.startsWith('false'))? null: (input.startsWith('true'))? [true, input.slice(4)]: [false, input.slice(5)];

// Number Parser
let numRegex = /^[-]?[0-9]\d*(\.\d+)?([eE]?[+-]?\d+)?/;
const numberParser = input => {
  	if( input === '0') return [0,''];
  	if(input[0] === '0' && input.length !== 1 && ! /\./.test(input)) return null;
  	if(!numRegex.test(input)){
  		return null;
  	}else {
  	let secondValue = input.slice(input.match(numRegex)[0].length);
  	return (secondValue[0] === 'e' || secondValue[0] === 'E' || secondValue[0] === '.')? null: [(parseFloat(input.match(numRegex)[0])), secondValue];
  }
  return null;
}

// String Parser
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

const stringParser = str => {
	let stringValue = "";		
	let quoteCount = 0;
	for(let i = 0; i < str.length; i++) {
		if(str[0] !== "\"") return null;
		if(str[i] === "\"") {
			quoteCount++;
		}

		if(escapeCharacters[str[i]]) return null;
	    if(str[i] === "\\") {
	      if( str[i+1] === 'u') {
	        if(!unicodeRegex.test(str.slice(i+2, i+6))) return null;
	        else {
	          stringValue = stringValue + "\\u" + parseInt(str.slice(i+2, i+6));
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
	    if (quoteCount === 2) return [stringValue.slice(1,-1), str.slice(stringValue.length)] ;
	  }
}


const parseStringValue = value => {
	const typeArray = [nullParser, booleanParser, numberParser, arrayParser, stringParser];
	let returnedValue;
	for (let type of typeArray) {
		returnedValue = type(value);
		
		if(returnedValue !== null) {
			console.log(returnedValue);
			return returnedValue;
		}
	}
	return null;
}

const arrayParser = string => {
	let count = 0;
	if(string[0] !== "[") return null;
	if(string[0] === "[") count++;
	if(count > 19)  return null;
	let newArray = new Array();
	let subString = string.slice(1, string.length);
	 while ( subString.length !== 0){
		let returnedValue = parseStringValue(subString.trimStart());
		if( returnedValue  === null) {
			return null;
		}
		newArray.push(returnedValue[0]);
		console.log(newArray);
		if(returnedValue[1].trimStart().startsWith(",")) {
			subString = returnedValue[1].trimStart().slice(1, returnedValue[1].trimStart().length);
			continue;
		}
		if(returnedValue[1].trimStart().startsWith("]")) {
			return [newArray, returnedValue[1].trimStart().slice(1, returnedValue[1].trimStart().length)];
		}
		return null;
	}
}

let result = arrayParser(fs.readFileSync("input.json").toString("utf-8"));
if(result === null) {
	console.log(null);
} else {
	console.log(JSON.stringify(result[1].length >= 1? null: arrayParser(fs.readFileSync("input.json").toString("utf-8"))[0]));
}
