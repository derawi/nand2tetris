import { assert, expect } from "chai";
import { readFile } from "fs/promises";
import { Tokenizer } from "../src/Tokenizer.js";

describe("Tokenizer", async function () {
  let outputCompareArray, outputArray;
  const compareFilepath = "./Square/MainT.xml";
  const readInFilepath = "./Square/Main.jack";

  before(async function () {
    // Read-In Compare-OutputFile
    outputCompareArray = await readFile(compareFilepath, "utf8", (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      //   return data;
    });
    outputCompareArray = outputCompareArray.split("\r\n").filter((a) => a);

    const tokenizer = new Tokenizer();
    await tokenizer.init(readInFilepath);
    outputArray = await tokenizer.tokenize();
  });
  it("Compare file should be read-in", () => {
    expect(outputCompareArray.length).to.be.gt(1);
  });
  it("Compare Array and output Array should have the same length", () => {
    expect(outputCompareArray.length).to.equal(outputArray.length);
  });
  it("Compare Array and output Array should be deeply equal", () => {
    try {
      expect(JSON.stringify(outputCompareArray) === JSON.stringify(outputArray)).to.be.true;
    } catch {
      const failedLines = [];
      for (let i = 0; i < outputCompareArray.length; i++) {
        if (outputCompareArray[i] !== outputArray[i]) {
          console.log("In Line:", i);
          console.log("Expected:", outputCompareArray[i]);
          console.log("Actual  :", outputArray[i]);
          failedLines.push(i);
        }
      }
      throw new Error(`Deep comparison failed in lines: ${failedLines}`);
    }
  });
});
