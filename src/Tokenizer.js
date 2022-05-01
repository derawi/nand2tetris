import { readFile } from "fs/promises";
import cleanJackFileInput from "./helpers/cleanJackFileInput.js";

export class Tokenizer {
  constructor() {}

  async init(_filepath) {
    const plainJackProgram = await readFile(_filepath, "utf8", (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      return data;
    });
    this.rawTokens = cleanJackFileInput(plainJackProgram);
    console.log(this.rawTokens);
  }
}
