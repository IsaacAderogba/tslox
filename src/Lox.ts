import readline from "readline";
import fs from "fs";
import { LoxApi } from "./LoxApi";

export class Lox implements LoxApi {
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
      rl.prompt();
    });
  }

  private run(source: string): void {
    const scanner = new Scanner(this, source);
    const tokens = scanner.scanTokens();

    for (const token of tokens) {
      console.log(token);
    }
  }
}
