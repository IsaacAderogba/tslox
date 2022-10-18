import { LoxApi } from "./LoxApi";
import { Token } from "./Token";
import { TokenType } from "./TokenType";

export class Scanner {
  private lox: LoxApi;
  private source: string;
  private start = 0;
  private current = 0;
  private line = 1;
  private tokens: Token[] = [];

  constructor(lox: LoxApi, source: string) {
    this.lox = lox;
    this.source = source;
  }

  scanTokens(): Token[] {
    while (!this.isAtEnd()) {
      this.start = this.current;
      this.scanToken();
    }

    this.tokens.push(new Token("EOF", "", null, this.line));
    return this.tokens;
  }

  private scanToken(): void {
    const c = this.advance();

    switch (c) {
      case "(":
        this.addToken("LEFT_PAREN");
        break;
      case ")":
        this.addToken("RIGHT_PAREN");
        break;
      case "{":
        this.addToken("LEFT_BRACE");
        break;
      case "}":
        this.addToken("RIGHT_BRACE");
        break;
      case ",":
        this.addToken("COMMA");
        break;
      case ".":
        this.addToken("DOT");
        break;
      case "-":
        this.addToken("MINUS");
        break;
      case "+":
        this.addToken("PLUS");
        break;
      case ";":
        this.addToken("SEMICOLON");
        break;
      case "*":
        this.addToken("STAR");
        break;
      case "!":
        this.addToken(this.match("=") ? "BANG_EQUAL" : "BANG");
        break;
      case "=":
        this.addToken(this.match("=") ? "EQUAL_EQUAL" : "EQUAL");
        break;
      case "<":
        this.addToken(this.match("=") ? "LESS_EQUAL" : "LESS");
        break;
      case ">":
        this.addToken(this.match("=") ? "GREATER_EQUAL" : "GREATER");
        break;
      default:
        this.lox.error(this.line, "Unexpected character.");
        break;
    }
  }

  private match(expected: string): boolean {
    if (this.isAtEnd()) return false;
    if (this.source.charAt(this.current) !== expected) return false;

    this.current++;
    return true;
  }

  private isAtEnd(): boolean {
    return this.current >= this.source.length;
  }

  private advance(): string {
    return this.source.charAt(this.current++);
  }

  private addToken(type: TokenType, literal: object | null = null): void {
    const text = this.source.substring(this.start, this.current);
    this.tokens.push(new Token(type, text, literal, this.line));
  }
}
