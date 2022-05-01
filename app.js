import { readFile } from "fs/promises";

// custom Modules
import readFileAndClean from "./helpers/readFileAndClean.js";

console.log(process.argv[2]);

const plainJackProgram = await readFile("./ArrayTest/Main.jack", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  return data;
});

const cleanedJackProgram = readFileAndClean(plainJackProgram);
console.log(cleanedJackProgram);
