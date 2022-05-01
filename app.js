import { readFile } from "fs/promises";

// custom Modules
import cleanFileInput from "./helpers/cleanFileInput.js";

console.log(process.argv);

const plainJackProgram = await readFile("./ArrayTest/Main.jack", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  return data;
});

const cleanedJackProgram = cleanFileInput(plainJackProgram);
console.log(cleanedJackProgram);
