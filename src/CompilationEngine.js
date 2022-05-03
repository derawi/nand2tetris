const STATEMENTSARRAY = ["let", "if", "while", "do", "return"];
const TERMTERMINATORS = [",", ")", "]", ";", "/", "*", "+", "-", "=", "&lt;", "&gt;", " &amp;", "|", "&", "~"];
const OPERATOR = ["/", "*", "+", "-", "&lt;", "&gt;", "&amp;", "|", "="];

// This files compiles accoring to the given API
// Check specs cheat-sheet for more info

export class CompilationEngine {
  constructor(_tokenizer) {
    this.tokenizer = _tokenizer;
    this.currentToken;
    this.output = "";
    this.indent = "";
  }
  //   HELPERS =====================================
  incIndent() {
    this.indent = this.indent + "  ";
  }
  decIndent() {
    this.indent = this.indent.slice(0, -2);
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
  getTokenKeyword() {
    return `<${this.tokenizer.tokenType()}> ${this.currentToken} </${this.tokenizer.tokenType()}>`;
  }
  addTokenKeyword() {
    this.add(this.getTokenKeyword());
  }
  addAndNext(n = 1) {
    //Adds a Token+Keywords and advances n-times
    for (let i = 0; i < n; i++) {
      this.addTokenKeyword();
      this.nextToken();
    }
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
    this.addAndNext(3); // class - class Name "Main" - {
    // ClassVarDec
    while (["static", "field"].includes(this.currentToken)) {
      this.CompileClassVarDec();
    }
    // SubroutineDec
    while (["constructor", "function", "method"].includes(this.currentToken)) {
      this.CompileSubroutineDec();
      this.nextToken();
    }

    // ---- End Class declaration
    // this.nextToken();
    this.addTokenKeyword();
    this.addDec("</class>");
  }
  CompileClassVarDec() {
    this.addInc("<classVarDec>");
    do {
      this.addTokenKeyword();
    } while (this.nextToken() !== ";");

    this.addAndNext(); // ;
    this.addDec("</classVarDec>");
  }
  //    ==== SUBROUTINEDEC ====
  CompileSubroutineDec() {
    this.addInc("<subroutineDec>");
    this.addAndNext(3); //function - void - main

    // Parameterlist
    this.addTokenKeyword(); //   begins here (
    this.compileParameterList();
    this.addTokenKeyword(); // === ")"

    // SubroutineBody
    this.compileSubroutineBody();

    // ---- End Subroutine Dec
    this.addDec("</subroutineDec>");
  }
  //   ==== PARAMETERLIST ====
  compileParameterList() {
    // this.CompileClass("parameterlist");
    this.addInc("<parameterList>");
    // Implement Parameterlist
    while (this.nextToken() !== ")") {
      this.addTokenKeyword();

      // Process parameter List, else empty list
    }
    this.addDec("</parameterList>");
  }
  //   ==== SUBROUTINEBODY ====
  compileSubroutineBody() {
    this.addInc("<subroutineBody>");
    this.nextToken();
    this.addTokenKeyword(); //{
    // Compile all vars
    while (this.nextToken() === "var") {
      this.compileVarDec();
    }
    // Statemens
    this.compileStatements();
    this.nextToken();
    this.addTokenKeyword(); // === "}"
    this.addDec("</subroutineBody>");
  }
  //   ==== VARDEC ====
  compileVarDec() {
    this.addInc("<varDec>");
    do {
      this.addTokenKeyword();
    } while (this.nextToken() !== ";");
    this.addTokenKeyword(); // === ";"
    this.addDec("</varDec>");
  }
  //   ==== STATEMENTS ====
  compileStatements() {
    this.addInc("<statements>");

    while (STATEMENTSARRAY.includes(this.currentToken)) {
      switch (this.currentToken) {
        case "let":
          this.compileLet();
          break;
        case "if":
          this.compileIf();
          break;
        case "while":
          this.compileWhile();
          break;
        case "do":
          this.compileDo();
          break;
        case "return":
          this.compileReturn();
          break;
      }
    }
    this.addDec("</statements>");
  }
  compileLet() {
    this.addInc("<letStatement>");

    this.addTokenKeyword(); //Varname
    // Todo: Implement handle expression
    while (this.nextToken() !== ";") {
      this.addTokenKeyword();
      if (this.currentToken === "=" || this.currentToken === "[") {
        this.nextToken();
        this.CompileExpression();
        if (this.currentToken === "]") this.addTokenKeyword();
        if (this.currentToken === ";") break;
      }
    }
    this.addTokenKeyword(this.currentToken); //;
    this.addDec("</letStatement>");
    this.nextToken();
  }
  compileIf() {
    this.addInc("<ifStatement>");
    this.addAndNext(2); // if - (

    this.CompileExpression();

    this.addAndNext(2); // ) - {

    this.compileStatements();

    this.addTokenKeyword(); // }

    if (this.nextToken() === "else") {
      this.addAndNext(2); // else - {

      this.compileStatements();
      this.addAndNext(); // } + load next statement
    }

    this.addDec("</ifStatement>");
  }
  compileWhile() {
    this.addInc("<whileStatement>");

    this.addAndNext(2); //while - (
    this.CompileExpression();
    this.addAndNext(2); // ) - {

    // Handle Statements
    while (this.currentToken !== "}") {
      this.compileStatements();
    }
    this.addAndNext(); // }
    this.addDec("</whileStatement>");
  }
  compileDo() {
    this.addInc("<doStatement>");

    this.addAndNext(); //do

    this.addTokenKeyword(); //subroutineName OR classname/varname

    if (this.nextToken() === ".") {
      this.addAndNext(2); // . - subroutinename
    }
    this.addTokenKeyword(); // (
    this.CompileExpressionList();
    this.nextToken();
    this.addTokenKeyword(); // ;
    this.addDec("</doStatement>");
    this.nextToken();
  }

  compileReturn() {
    this.addInc("<returnStatement>");

    this.addTokenKeyword(); // return
    // Todo: Implement handle expression
    if (this.nextToken() !== ";") {
      this.CompileExpression();
    }
    this.addTokenKeyword(); //;
    this.addDec("</returnStatement>");
  }

  CompileExpression() {
    this.addInc("<expression>");

    // Todo: Implement handle expression
    this.CompileTerm();
    while (OPERATOR.includes(this.currentToken)) {
      this.addAndNext(); //e.g. > < && ||
      this.CompileTerm();
    }
    this.addDec("</expression>");
  }

  CompileTerm() {
    this.addInc("<term>");
    // Unary operators
    if (this.currentToken === "-" || this.currentToken === "~") {
      this.addAndNext(); // - OR ~

      this.CompileTerm();
    } else if (this.tokenizer.tokenType() === "identifier") {
      while (!TERMTERMINATORS.includes(this.currentToken)) {
        let savedTokenKeyword = this.getTokenKeyword(); //T0
        this.nextToken();
        if (this.currentToken === ".") {
          this.add(savedTokenKeyword); //T0
          this.addAndNext();
        } else if (this.currentToken === "(") {
          this.add(savedTokenKeyword); //T0
          this.addTokenKeyword(); // (
          this.CompileExpressionList();
        } else if (this.currentToken === "[") {
          this.add(savedTokenKeyword); //T0
          this.addAndNext(); // [
          this.CompileExpression();
          this.addAndNext();
        } else {
          this.add(savedTokenKeyword);
        }
      }
    } else if (this.currentToken === "(") {
      this.addAndNext(); // (
      this.CompileExpression();
      this.addAndNext();
    } else {
      this.addAndNext();
    }
    this.addDec("</term>");
  }

  CompileExpressionList() {
    //   Opening "(" are consumed before
    this.addInc("<expressionList>");
    // check for empty expression
    this.nextToken();
    if (!(this.currentToken === ")")) {
      do {
        if (this.currentToken === ",") {
          this.addAndNext();
        }
        this.CompileExpression();
      } while (this.currentToken === ",");
    }
    this.addDec("</expressionList>");

    this.addTokenKeyword(); // )
  }
}
