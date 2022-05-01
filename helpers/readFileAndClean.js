export default function readFileAndClean(input) {
  const cleanedInput = cleanFileInputs(input);
  const splitLines = splitLinesIntoTerms(cleanedInput);
  const finalLines = seperateSymbols(splitLines);
  return finalLines;
}

const SYMBOLS = ["{", "}", "(", ")", "[", "]", ".", ",", ";", "+", "-", "*", "/", "&", "|", "<", ">", "=", "~"];

function cleanFileInputs(fileArray) {
  // Replace all comments
  fileArray = fileArray.replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, "$1");
  // Split into Arrays of lines
  fileArray = fileArray.split("\n");

  for (let [i, line] of fileArray.entries()) {
    // Replace whitespaces in the beginning
    line = line.replace(/^\s+/gm, "");
    // Clean \r and \t characters
    fileArray[i] = line.replace("\r", "").replace("\t", "");
  }
  // remove empty elements
  fileArray = fileArray.filter((e) => e);
  return fileArray;
}

function splitLinesIntoTerms(fileArray) {
  let output = [];
  for (const line of fileArray) {
    // Test if contains a string, else split at whitespaces
    // Note: Could be improved by regex
    const newline = [];
    if (line.includes('"')) {
      const splitline = line.split('"');
      newline.push(...splitline[0].split(" "));
      newline.push('"' + splitline[1] + '"');
      newline.push(...splitline[2].split(" "));
    } else {
      newline.push(...line.split(" "));
    }
    // Seperate Symbols sticking to other words
    output = output.concat(newline);
  }
  return output;
}

function seperateSymbols(input) {
  let output = [];
  for (const line of input) {
    output = output.concat(seperate(line));
  }
  function seperate(line) {
    if (line.length === 1) return line; //Return if already single characters/symbols
    if (line[0] === '"') return line.slice(1, -1); //Return if String
    let newline = line.split(/([{}()[\].,;+\-*/&|<>=~])/gm); // Splits the line at special symbols and includes the symbols
    return newline.filter((e) => e); // remove empty elements
  }
  return output;
}
