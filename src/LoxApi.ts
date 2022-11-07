import { Reporter } from "./Reporter";
import { RuntimeError } from "./RuntimeError";
import { Token } from "./Token";

export interface LoxApi {
  reporter: Reporter;

  main: (args: string[]) => void;
  run: (source: string) => void;
  error: (line: number | Token, message: string) => void;
  runtimeError: (error: RuntimeError) => void;
}
