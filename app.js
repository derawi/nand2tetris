import { Tokenizer } from "./src/Tokenizer.js";
import { writeFile } from "fs/promises";

(async function () {
  console.log(process.argv[2]);
  const tokenizer = new Tokenizer();
  const filepath = "./ArrayTest/Main.jack";
  await tokenizer.init(filepath);
  const tokenArray = ["<tokens>"];
  while (tokenizer.hasMoreToken()) {
    const currentToken = tokenizer.advance();
    const tokenType = tokenizer.tokenType();
    tokenArray.push(`<${tokenType}> ${currentToken} </${tokenType}>`);
  }
  tokenArray.push("</tokens>");
  await writeFile(`${filepath.slice(0, -5)}T2.xml`, tokenArray.join("\n"));
})();
