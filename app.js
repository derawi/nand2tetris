import { Tokenizer } from "./src/Tokenizer.js";
import { writeFile } from "fs/promises";

(async function () {
  console.log(process.argv[2]);
  const tokenizer = new Tokenizer();
  const filepath = "./ArrayTest/Main.jack";
  await tokenizer.init(filepath);
  const tokenArray = await tokenizer.tokenize();

  await writeFile(`${filepath.slice(0, -5)}T2.xml`, tokenArray.join("\n"));
})();
