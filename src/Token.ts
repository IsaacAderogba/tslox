import { TokenType } from "./TokenType";

export type LoxValue = unknown;
export class Token {
  type: TokenType;
  lexeme: string;
  literal: LoxValue;
  line: number;

  constructor(type: TokenType, lexeme: string, literal: LoxValue, line: number) {
    this.type = type;
    this.lexeme = lexeme;
    this.literal = literal;
    this.line = line;
  }

  toString(): string {
    return this.type + " " + this.lexeme + " " + this.literal;
  }
}
