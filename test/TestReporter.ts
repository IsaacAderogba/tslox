import { Reporter } from "../src/Reporter";

export class TestReporter implements Reporter {
  stdout = "";
  stderr = "";

  log(message: string): void {
    this.stdout += (this.stdout ? "\n" : "") + message;
  }

  error(message: string): void {
    this.stderr += (this.stderr ? "\n" : "") + message;
  }
}
