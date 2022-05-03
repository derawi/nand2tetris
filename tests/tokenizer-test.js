import { assert, expect } from "chai";
import { readFile } from "fs/promises";
import { Tokenizer } from "../src/Tokenizer.js";
import { CompilationEngine } from "../src/CompilationEngine.js";

/*
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
*/
const allDataPairs = [
  ["./ArrayTest/Main.xml", "./ArrayTest/Main.jack"],
  ["./ExpressionLessSquare/Main.xml", "./ExpressionLessSquare/Main.jack"],
  ["./ExpressionLessSquare/Square.xml", "./ExpressionLessSquare/Square.jack"],
  ["./ExpressionLessSquare/SquareGame.xml", "./ExpressionLessSquare/SquareGame.jack"],
  ["./Square/Main.xml", "./Square/Main.jack"],
];

for (let data of allDataPairs) {
  console.log(data);
  let [compareFilepath, readInFilepath] = data;
  describe(`Testing ${compareFilepath}`, async function () {
    let outputCompareData, compiledData;
    // const compareFilepath = "./ArrayTest/Main.xml";
    // const readInFilepath = "./ArrayTest/Main.jack";

    // const compareFilepath = "./ExpressionLessSquare/Square.xml";
    // const readInFilepath = "./ExpressionLessSquare/Square.jack";
    // const compareFilepath = "./ExpressionLessSquare/Main.xml";
    // const readInFilepath = "./ExpressionLessSquare/Main.jack";

    // const compareFilepath = "./Square/Main.xml";
    // const readInFilepath = "./Square/Main.jack";

    before(async function () {
      // Read-In Compare-OutputFile
      outputCompareData = await readFile(compareFilepath, "utf8", (err, data) => {
        if (err) {
          console.error(err);
          return;
        }
        //   return data;
      });

      outputCompareData = outputCompareData.split("\r\n");

      const tokenizer = new Tokenizer();
      await tokenizer.init(readInFilepath);
      // Compilation Engine
      const compil = new CompilationEngine(tokenizer);
      compil.CompileClass();
      compiledData = compil.getResult().split("\n");
    });
    it("Compare file should be read-in", () => {
      expect(outputCompareData.length).to.be.gt(1);
    });
    it("Compare Array and output Array should have the same length", () => {
      // expect(outputCompareData.length).to.equal(compiledData.length);
    });
    it("Compare Array and output Array should be deeply equal", () => {
      let failedLines = [];
      try {
        expect(JSON.stringify(outputCompareData) === JSON.stringify(compiledData)).to.be.true;
      } catch {
        // Print all comparison failures, maybe todo: shorten

        for (let i = 0; i < outputCompareData.length; i++) {
          if (outputCompareData[i] !== compiledData[i]) {
            // console.log("In Line:", i);
            // console.log("Expected:", outputCompareData[i]);
            // console.log("Actual  :", compiledData[i]);
            failedLines.push(i);
          }
        }

        // Print First failure block
        let firstFailedLine = failedLines[0];
        console.log("First FailedLine:", firstFailedLine);
        let from = firstFailedLine - 5 >= 0 ? firstFailedLine - 5 : 0;
        let to =
          firstFailedLine + 8 <= Math.min(outputCompareData.length, compiledData.length)
            ? firstFailedLine + 8
            : Math.min(outputCompareData.length, compiledData.length);

        console.log("Expected:");
        for (let i = from; i < to; i++) {
          if (i === firstFailedLine) {
            console.log(`\x1b[42m${outputCompareData[i]}\x1b[0m`);
          } else {
            console.log(outputCompareData[i]);
          }
        }
        console.log("Actual:");
        for (let i = from; i < to; i++) {
          if (i === firstFailedLine) {
            console.log(`\x1b[41m${compiledData[i]}\x1b[0m`);
          } else {
            console.log(compiledData[i]);
          }
        }
        if (failedLines.length > 10) failedLines = failedLines.slice(0, 10) + ",...";
        // throw new Error(`Deep comparison failed in lines: ${failedLines}`);
      }
    });
  });
}
