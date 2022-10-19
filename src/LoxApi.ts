import { Reporter } from "./Reporter";

export interface LoxApi {
  reporter: Reporter;

  main: (args: string[]) => void;
  run: (source: string) => void;
  error: (line: number, message: string) => void;
}
