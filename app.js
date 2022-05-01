import { Tokenizer } from "./src/Tokenizer.js";

(async function main() {
  console.log(process.argv[2]);
  const tokenizer = new Tokenizer();
  const filepath = "./ArrayTest/Main.jack";
  tokenizer.init(filepath);
})();
