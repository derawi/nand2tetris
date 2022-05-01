import { Tokenizer } from "./src/Tokenizer.js";

(async function main() {
  console.log(process.argv[2]);
  const tokenizer = new Tokenizer();
  const filepath = "./ArrayTest/Main.jack";
  await tokenizer.init(filepath);
  const tokenArray = [];
  while (tokenizer.hasMoreToken()) {
    const currentToken = tokenizer.advance();
    const tokenType = tokenizer.tokenType();
    tokenArray.push(`<${tokenType}> ${currentToken} </${tokenType}>`);
  }
  console.log(tokenArray);
})();
