import { Reporter } from "./Reporter";
import { Token } from "./Token";

export interface LoxApi {
  reporter: Reporter;

  main: (args: string[]) => void;
  run: (source: string) => void;
  error: (line: number | Token, message: string) => void;
}
