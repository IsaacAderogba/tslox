import readline from "readline";
import fs from "fs";
import { LoxApi } from "./LoxApi";
import { Reporter } from "./Reporter";
import { Scanner } from "./Scanner";
import { Token } from "./Token";
import { Parser } from "./Parser";
import { RuntimeError } from "./RuntimeError";
import { Interpreter } from "./Interpreter";

export class Lox implements LoxApi {
  interpreter = new Interpreter(this);
  hadError = false;
  hadRuntimeError = false;
  reporter: Reporter;

  constructor(reporter: Reporter) {
    this.reporter = reporter;
  }

  main(args: string[]): void {
    if (args.length > 1) {
      console.log("Usage: tslox [script]");
      process.exit(64);
    } else if (args.length === 1) {
      this.runFile(args[0]);
    } else {
      this.runPrompt();
    }
  }

  private runFile(path: string): void {
    const source = fs.readFileSync(path, { encoding: "utf8" });
    this.run(source);

    if (this.hadError) process.exit(65);
    if (this.hadRuntimeError) process.exit(70);
  }

  private runPrompt(): void {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.setPrompt("> ");
    rl.prompt();
    rl.on("line", (line) => {
      this.run(line);
      this.hadError = false;

      rl.prompt();
    });
  }

  run(source: string): void {
    const scanner = new Scanner(this, source);
    const tokens = scanner.scanTokens();
    if (this.hadError) return;

    const parser = new Parser(this, tokens);
    const expression = parser.parse();
    if (this.hadError || !expression) return;

    this.interpreter.interpret(expression);
  }

  error(input: number | Token, message: string): void {
    if (typeof input === "number") {
      this.report(input, "", message);
    } else if (input.type === "EOF") {
      this.report(input.line, " at end", message);
    } else {
      this.report(input.line, " at '" + input.lexeme + "'", message);
    }
  }

  runtimeError(error: RuntimeError): void {
    this.reporter.error(error.message + "\n[line " + error.token.line + "]");
    this.hadRuntimeError = true;
  }

  report(line: number, where: string, message: string): void {
    this.reporter.error("[line " + line + "] Error" + where + ": " + message);
    this.hadError = true;
  }
}
