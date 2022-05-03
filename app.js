import { Tokenizer } from "./src/Tokenizer.js";
import { CompilationEngine } from "./src/CompilationEngine.js";
import { writeFile } from "fs/promises";

(async function () {
  console.log(process.argv[2]);
  // Tokenizer
  const tokenizer = new Tokenizer();
  const filepath = "./ArrayTest/Main.jack";
  await tokenizer.init(filepath);
  // Compilation Engine
  const compil = new CompilationEngine(tokenizer);
  compil.CompileClass();
  console.log(compil.getResult());
})();
