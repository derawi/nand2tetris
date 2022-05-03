import { expect } from "chai";
import { readFile } from "fs/promises";
import { Tokenizer } from "../src/Tokenizer.js";
import { CompilationEngine } from "../src/CompilationEngine.js";

const allDataPairs = [
  ["./ArrayTest/Main.xml", "./ArrayTest/Main.jack"],
  ["./ExpressionLessSquare/Main.xml", "./ExpressionLessSquare/Main.jack"],
  ["./ExpressionLessSquare/Square.xml", "./ExpressionLessSquare/Square.jack"],
  ["./ExpressionLessSquare/SquareGame.xml", "./ExpressionLessSquare/SquareGame.jack"],
  ["./Square/Main.xml", "./Square/Main.jack"],
  ["./Square/Square.xml", "./Square/Square.jack"],
  ["./Square/SquareGame.xml", "./Square/SquareGame.jack"],
];

for (let data of allDataPairs) {
  console.log(data);
  let [compareFilepath, readInFilepath] = data;
  describe(`Testing ${compareFilepath}`, async function () {
    let outputCompareData, compiledData;

    before(async function () {
      // Read-In Compare-OutputFile
      outputCompareData = await readFile(compareFilepath, "utf8", (err, data) => {
        if (err) {
          console.error(err);
          return;
        }
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
      //Comment out if you want to save screen space on testing:
      //expect(outputCompareData.length).to.equal(compiledData.length);
    });
    it("Compare Array and output Array should be deeply equal", () => {
      let failedLines = [];
      try {
        expect(JSON.stringify(outputCompareData) === JSON.stringify(compiledData)).to.be.true;
      } catch {
        // Print all comparison failures, maybe todo: shorten

        for (let i = 0; i < outputCompareData.length; i++) {
          if (outputCompareData[i] !== compiledData[i]) {
            //Comment out if you want to save screen space on testing:
            // console.log("In Line:", i);
            // console.log("Expected:", outputCompareData[i]);
            // console.log("Actual  :", compiledData[i]);
            failedLines.push(i);
          }
        }

        // Print First failure block
        // alter if you want to show more or lines before or after
        const showLinesBefore = 5;
        const showLinesAfter = 8;
        let firstFailedLine = failedLines[0];
        console.log("First FailedLine:", firstFailedLine);
        let from = firstFailedLine - showLinesBefore >= 0 ? firstFailedLine - showLinesBefore : 0;
        let to =
          firstFailedLine + showLinesAfter <= Math.min(outputCompareData.length, compiledData.length)
            ? firstFailedLine + showLinesAfter
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
        //Comment out if you want to save screen space on testing:
        //throw new Error(`Deep comparison failed in lines: ${failedLines}`);
      }
    });
  });
}
