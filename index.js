
const fs = require('fs');
//number parser
const nullParser = input => (!input.startsWith("null"))? null: [null, input.slice(4)];
//boolean parser
const booleanParser = input => (!input.startsWith('true') && !input.startsWith('false'))? null: (input.startsWith('true'))? [true, input.slice(4)]: [false, input.slice(5)];

// number parser
let numRegex = /^[-]?[0-9]\d*(\.\d+)?([eE]?[+-]?\d+)?/;
const numberParser = input => {
	  if(!numRegex.test(input)) return null;
	  if(input[0] === '0' && input.match(numRegex)[0].split(".").length !== 1) return null;
	  else {
		  let secondValue = input.slice(input.match(numRegex)[0].length);
	  	  return (secondValue[0] === 'e' || secondValue[0] === 'E' || secondValue[0] === '.')? null: [(parseFloat(input.match(numRegex)[0])), secondValue];
	  }
}
// string  parser
let unicodeRegex = /[A-Fa-f0-9]{4}$/;
let specialCharacters = {"\"": "\"", "\\": "\\", "/": "/", "b": "\b", "f": "\f", "n": "\n", "r": "\r", "t": "\t"};
let escapeCharacters = {"\b": true, "\f": true, "\n": true, "\r": true, "\t": true}
const stringParser = str => {
	let stringValue = "";
	let quoteCount = 0;
	for(let i = 0; i < str.length; i++) {
		if(str[i] === "\"") quoteCount++;
		if(escapeCharacters[str[i]]) return null;
	    if(str[i] === "\\") {
	      if( str[i+1] === 'u') {
	        if(!unicodeRegex.test(str.slice(i+2, i+6))) return null;
	        else {
	          stringValue = stringValue + String.fromCharCode(parseInt(str.slice(i+2, i+6),16));
	          i = i+5;
	        }
	      } else {
	      	      if(!specialCharacters[str[i+1]]) return null;
			      else stringValue = stringValue + specialCharacters[str[i++ +1]];
	    	}
	    }
	    else stringValue += str[i];
	    if(quoteCount === 2)  return [stringValue.slice(1,-1), str.slice(i+1)];
	}
	return null;
}

// array parser
const arrayParser = string => {
	if(string[0] !== "[") return null;
	let newArray = new Array();
	let subString = string.slice(1, string.length);
	 while ( subString.length !== 0){
		let returnedValue = parseJsonArray(subString.trimStart());
		if( returnedValue  === null) return ((subString.trimStart()[0] === "]")? [newArray, subString.trimStart().slice(1, subString.trimStart().length)]: null);
		newArray.push(returnedValue[0]);
		if(returnedValue[1].trimStart().startsWith(",")) {
			subString = returnedValue[1].trimStart().slice(1, returnedValue[1].trimStart().length);
			continue;
		}
		if(returnedValue[1].trimStart().startsWith("]")) return [newArray, returnedValue[1].trimStart().slice(1, returnedValue[1].trimStart().length)];
		return null;
	}
}

// object parser
const objectParser = string => {
	if(string[0] !== "{") return null;
	let newObject = new Object();
	let subString = string.slice(1, string.length);
	while( subString.length !== 0) {
		let returnedValue =  parseJsonObject(subString.trimStart());
		if(returnedValue === null) return ((subString.trimStart()[0] === "}")? [newObject, subString.trimStart().slice(1, subString.trimStart().length)]: null);
		newObject[returnedValue[0][0]] = returnedValue[0][1];
		if(returnedValue[1].trimStart().startsWith(",")) {
			subString = returnedValue[1].trimStart().slice(1, returnedValue[1].trimStart().length);
			continue;
		}
		return ((returnedValue[1].trimStart().startsWith("}"))? [newObject, returnedValue[1].trimStart().slice(1, returnedValue[1].trimStart().length)]: null);
	}
}
// parse json object
const parseJsonObject = input => {
	let key = stringParser(input);
	if(key === null) return null;
	let subString = key[1].trimStart();
	if(! subString.startsWith(":")) return null;
	subString = subString.slice(1, subString.length);
	let value = parseJsonArray(subString.trimStart());
	if( value === null) return null;
	return [[key[0], value[0]], value[1]]; 

}
const parseJsonArray = value => {
	const typeArray = [nullParser, booleanParser, numberParser,  arrayParser, stringParser,objectParser ];
	let returnedValue;
	for (let type of typeArray) {
		returnedValue = type(value);
		if(returnedValue !== null) return returnedValue;
	}
	return null;
}

let json = fs.readFileSync("input.json").toString("utf-8");
if(json.startsWith("{")) {
	let objectResult = objectParser(json);
	if(objectResult === null) console.log(null);
	else console.log(JSON.stringify(objectResult[1].length >= 1? null: objectResult[0]));
} else if( json.startsWith("[")) {
	let arrayResult = arrayParser(json);
	if(arrayResult === null) console.log(null);
	else console.log(JSON.stringify(arrayResult[1].length >= 1? null: arrayResult[0]));
} else console.log(null);
