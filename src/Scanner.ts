import { LoxApi } from "./LoxApi";
import { Token } from "./Token";

export class Scanner {
  lox: LoxApi;
  source: string;
  tokens: Token[] = [];

  constructor(lox: LoxApi, source: string) {
    this.lox = lox;
    this.source = source;
  }
}
