export interface Reporter {
  log(message: string): void;
  error(message: string): void;
}

export class ConsoleReporter implements Reporter {
  log(message: string): void {
    console.log(message);
  }

  error(message: string): void {
    console.error(message);
  }
}
