import { Reporter } from "./Reporter";

export interface LoxApi {
  reporter: Reporter;

  main: (args: string[]) => void;
  error: (line: number, message: string) => void;
}
