import { Tokenizer } from "./Tokenizer.js";

export class CompilationEngine {
  constructor(_tokenizer) {
    this.tokenizer = _tokenizer;
    this.currentToken;
    this.output = "";
    this.indent = "";
  }
  //   HELPERS =====================================
  incIndent() {
    this.indent = this.indent + " ";
  }
  decIndent() {
    this.indent = this.indent.slice(0, -1);
  }
  add(term) {
    this.output += this.indent + term + "\n";
  }
  addInc(term) {
    this.add(term);
    this.incIndent();
  }
  addDec(term) {
    this.decIndent();
    this.add(term);
  }
  addTokenKeyword() {
    this.add(`<${this.tokenizer.tokenType()}> ${this.currentToken} </${this.tokenizer.tokenType()}>`);
  }
  nextToken() {
    this.currentToken = this.tokenizer.advance();
    return this.currentToken;
  }
  getResult() {
    return this.output;
  }
  //   Compilation Routines ================================
  CompileClass() {
    this.nextToken();
    if (this.currentToken !== "class") return false;
    this.addInc("<class>");
    this.addTokenKeyword(); // class
    this.nextToken();
    this.addTokenKeyword(); // class Name "Main"
    this.nextToken();
    this.addTokenKeyword(); // {
    // SubroutineDec
    if (["constructor", "function", "method"].includes(this.nextToken())) {
      this.CompileSubroutineDec();
    }
    console.log(this.currentToken);
    // ClassVarDec

    // ---- End Class declaration
    this.nextToken();
    this.addTokenKeyword();
    this.addDec("</class>");
  }
  //    ==== SUBROUTINEDEC ====
  CompileSubroutineDec() {
    this.addInc("<subroutineDec>");
    this.addTokenKeyword(); //function
    this.nextToken();
    this.addTokenKeyword(); //void
    this.nextToken();
    this.addTokenKeyword(); //main
    this.nextToken();

    // Parameterlist
    this.addTokenKeyword(); //   begins here (
    this.compileParameterList();
    this.addTokenKeyword(); // === ")"

    // SubroutineBody
    this.compileSubroutineBody();

    // ---- End Subroutine Dec
    this.addDec("</subroutineDec>");
    // Todo consume }
  }
  //   ==== PARAMETERLIST ====
  compileParameterList() {
    this.CompileClass("parameterlist");
    this.addInc("<parameterList>");
    // Implement Parameterlist
    if (this.currentToken !== ")") {
      // Process parameter List, else empty list
    }
    this.addDec("</parameterList>");
  }

  compileSubroutineBody() {
    this.addInc("<subroutineBody>");
    this.nextToken();
    this.addTokenKeyword(); //{
    // Compile Var Dec
    while (this.nextToken() === "var") {
      this.compileVarDec();
    }

    // Todo consume }
    this.addDec("</subroutineBody>");
  }

  compileVarDec() {
    this.addInc("<varDec>");
    do {
      this.addTokenKeyword();
    } while (this.nextToken() !== ";");
    this.addTokenKeyword();
    this.addDec("</varDec>");
  }
}
