import { Tokenizer } from "./Tokenizer.js";

const STATEMENTSARRAY = ["let", "if", "while", "do", "return"];
const TERMTERMINATORS = [",", ")", "]", ";", "/", "*", "+", "-", "&lt;", "&gt;"];
const OPERATOR = ["/", "*", "+", "-", "&lt;", "&gt;", "&", "|", "="];

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
    this.nextToken();
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

    this.addTokenKeyword(); // ;
    this.nextToken();
    this.addDec("</classVarDec>");
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
      //   this.nextToken();
      // this.addTokenKeyword();
    }
    this.addDec("</statements>");
  }
  compileLet() {
    this.addInc("<letStatement>");

    this.addTokenKeyword(); //Varname?
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
    this.addTokenKeyword(); // if

    this.nextToken();
    this.addTokenKeyword(); // (

    this.nextToken();
    this.CompileExpression();
    this.addTokenKeyword(); // )

    this.nextToken();
    this.addTokenKeyword(); // {
    this.nextToken(); //ADDED!!!
    this.compileStatements();

    // this.nextToken();
    this.addTokenKeyword(); // }

    if (this.nextToken() === "else") {
      this.addTokenKeyword();
      this.nextToken();
      this.addTokenKeyword(); // {
      this.nextToken();
      this.compileStatements();
      this.nextToken();
      this.addTokenKeyword(); // }
      this.nextToken();
    }

    // Todo: Implement handle expression
    // this.nextToken();

    this.addDec("</ifStatement>");
  }
  compileWhile() {
    this.addInc("<whileStatement>");

    this.addTokenKeyword(); //while
    // Handle Expression
    this.nextToken();
    this.addTokenKeyword(); // (
    this.nextToken();
    this.CompileExpression();
    this.addTokenKeyword(); // )
    // Handle Statements
    this.nextToken();
    this.addTokenKeyword(); // {
    this.nextToken();
    while (this.currentToken !== "}") {
      this.compileStatements();
    }
    this.addTokenKeyword(); // }
    this.addDec("</whileStatement>");
    this.nextToken();
  }
  compileDo() {
    this.addInc("<doStatement>");

    this.addTokenKeyword(); //do
    this.nextToken();
    this.addTokenKeyword(); //subroutineName OR classname/varname

    if (this.nextToken() === ".") {
      this.addTokenKeyword(); // .
      this.nextToken();
      this.addTokenKeyword(); // subroutinename
      this.nextToken();
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
      this.addTokenKeyword(); //e.g. > < && ||
      this.nextToken();
      this.CompileTerm();
    }
    this.addDec("</expression>");
  }

  CompileTerm() {
    this.addInc("<term>");
    // this.add("<----------- Pointer-------------->");

    if (this.tokenizer.tokenType() === "identifier") {
      while (!TERMTERMINATORS.includes(this.currentToken)) {
        let savedTokenKeyword = this.getTokenKeyword(); //T0
        this.nextToken();
        if (this.currentToken === ".") {
          this.add(savedTokenKeyword); //T0
          this.addTokenKeyword();
          this.nextToken(); // .
        } else if (this.currentToken === "(") {
          this.add(savedTokenKeyword); //T0
          this.addTokenKeyword(); // (
          this.CompileExpressionList();
        } else if (this.currentToken === "[") {
          this.add(savedTokenKeyword); //T0
          this.addTokenKeyword(); // [
          this.nextToken();
          this.CompileExpression();
          this.addTokenKeyword();
          this.nextToken();
        } else {
          this.add(savedTokenKeyword);
        }
      }
    } else {
      this.addTokenKeyword();
      this.nextToken();
    }
    if (this.currentToken === "-") {
      this.CompileExpression();
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
          this.addTokenKeyword();
          this.nextToken();
        }
        this.CompileExpression();
      } while (this.currentToken === ",");
    }
    this.addDec("</expressionList>");

    this.addTokenKeyword(); // )
  }
}
