import { readFile } from "fs/promises";

console.log(process.argv);

let jackProgram = await readFile("./ArrayTest/Main.jack", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  return data;
});

console.log(jackProgram);
