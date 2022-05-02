import { readFile } from "fs/promises";
import cleanJackFileInput from "./helpers/cleanJackFileInput.js";

const SYMBOLS = ["{", "}", "(", ")", "[", "]", ".", ",", ";", "+", "-", "*", "/", "&", "|", "<", ">", "=", "~"];
const SPECIALSYMBOLS = new Map([
  ["<", "&lt;"],
  [">", "&gt;"],
  ["&", "&amp;"],
  ['"', "&quot;"],
]);
const KEYWORDS = [
  "class",
  "constructor",
  "function",
  "method",
  "field",
  "static",
  "var",
  "int",
  "char",
  "boolean",
  "void",
  "true",
  "false",
  "null",
  "this",
  "let",
  "do",
  "if",
  "else",
  "while",
  "return",
];

export class Tokenizer {
  constructor() {
    this.rawTokens;
    this.currentPosition = -1;
  }

  async init(_filepath) {
    const plainJackProgram = await readFile(_filepath, "utf8", (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      return data;
    });
    this.rawTokens = cleanJackFileInput(plainJackProgram);
    this.maxPosition = this.rawTokens.length - 1;
    console.log(this.maxPosition);
    this.currentPosition = -1;
  }

  tokenize() {
    const tokenArray = ["<tokens>"];
    while (this.hasMoreToken()) {
      const currentToken = this.advance();
      const tokenType = this.tokenType();
      tokenArray.push(`<${tokenType}> ${currentToken} </${tokenType}>`);
    }
    tokenArray.push("</tokens>");
    return tokenArray;
  }

  getPosAndLen() {
    return [this.currentPosition, this.maxPosition];
  }
  hasMoreToken() {
    if (this.currentPosition < this.maxPosition) return true;
    return false;
  }
  advance() {
    this.currentPosition++;
    // If special symbol is found
    if (SPECIALSYMBOLS.has(this.rawTokens[this.currentPosition]))
      return SPECIALSYMBOLS.get(this.rawTokens[this.currentPosition]);
    // If String is found
    if (this.rawTokens[this.currentPosition][0] !== '"') return this.rawTokens[this.currentPosition];
    // All other Cases
    return this.rawTokens[this.currentPosition].slice(1, -1);
  }
  tokenType() {
    //  Returns the type of the current token
    //  Types "KEYWORD", "SYMBOL", "IDENTIFIER", "INT_CONST", "STR_CONST"
    if (KEYWORDS.includes(this.rawTokens[this.currentPosition])) return "keyword";
    if (SYMBOLS.includes(this.rawTokens[this.currentPosition])) return "symbol";
    if (this.rawTokens[this.currentPosition][0] === '"') return "stringConstant";
    if (parseInt(this.rawTokens[this.currentPosition]) >= 0 && parseInt(this.rawTokens[this.currentPosition]) <= 32767)
      return "integerConstant";
    // If nothing else matches -> IDENTIFIER
    return "identifier";
  }
}
