import {
  BinaryExpr,
  Expr,
  ExprVisitor,
  GroupingExpr,
  LiteralExpr,
  UnaryExpr,
} from "./Expr";
import { LoxApi } from "./LoxApi";
import { RuntimeError } from "./RuntimeError";
import { LoxValue, Token } from "./Token";

export class Interpreter implements ExprVisitor<LoxValue> {
  private lox: LoxApi;

  constructor(lox: LoxApi) {
    this.lox = lox;
  }

  interpret(expression: Expr): void {
    try {
      const value = this.evaluate(expression);
    } catch (error) {
      if (error instanceof RuntimeError) {
        this.lox.runtimeError(error);
      } else {
        throw error;
      }
    }
  }

  private evaluate(expr: Expr): LoxValue {
    return expr.accept(this);
  }

  visitBinaryExpr(expr: BinaryExpr): LoxValue {
    const left = this.evaluate(expr.left);
    const right = this.evaluate(expr.right);

    switch (expr.operator.type) {
      case "GREATER":
        this.checkNumberOperands(expr.operator, left, right);
        return (left as number) > (right as number);
      case "GREATER_EQUAL":
        this.checkNumberOperands(expr.operator, left, right);
        return (left as number) >= (right as number);
      case "LESS":
        this.checkNumberOperands(expr.operator, left, right);
        return (left as number) < (right as number);
      case "LESS_EQUAL":
        this.checkNumberOperands(expr.operator, left, right);
        return (left as number) <= (right as number);
      case "BANG_EQUAL":
        return !this.isEqual(left, right);
      case "EQUAL_EQUAL":
        return this.isEqual(left, right);
      case "MINUS":
        this.checkNumberOperands(expr.operator, left, right);
        return (left as number) - (right as number);
      case "PLUS":
        if (typeof left === "number" && typeof right === "number") {
          return left + right;
        }

        if (typeof left === "string" && typeof right === "string") {
          return left + right;
        }

        throw new RuntimeError(
          expr.operator,
          "Operands must be two numbers or two strings."
        );
      case "SLASH":
        this.checkNumberOperands(expr.operator, left, right);
        return (left as number) / (right as number);
      case "STAR":
        this.checkNumberOperands(expr.operator, left, right);
        return (left as number) * (right as number);
    }

    // Unreachable.
    return null;
  }

  visitGroupingExpr(expr: GroupingExpr): LoxValue {
    return this.evaluate(expr.expression);
  }

  visitLiteralExpr(expr: LiteralExpr): LoxValue {
    return expr.value;
  }

  visitUnaryExpr(expr: UnaryExpr): LoxValue {
    const right = this.evaluate(expr.right);

    switch (expr.operator.type) {
      case "BANG":
        return !this.isTruthy(right);
      case "MINUS":
        this.checkNumberOperand(expr.operator, right);
        return -(right as number);
    }

    // Unreachable.
    return null;
  }

  private checkNumberOperand(operator: Token, operand: LoxValue): void {
    if (typeof operand === "number") return;
    throw new RuntimeError(operator, "Operand must be a number.");
  }

  private checkNumberOperands(
    operator: Token,
    left: LoxValue,
    right: LoxValue
  ): void {
    if (typeof left === "number" && typeof right === "number") return;
    throw new RuntimeError(operator, "Operands must be a numbers.");
  }

  private isTruthy(object: LoxValue): boolean {
    if (object === null) return false;
    if (typeof object === "boolean") return object;
    return true;
  }

  private isEqual(a: LoxValue, b: LoxValue): boolean {
    if (a === null && b === null) return true;
    if (a === null) return false;

    return a === b;
  }

  private stringify(object: LoxValue): string {
    if (object === null || object === undefined) return "nil";

    if (typeof object === "number") {
      let text = object.toString();
      if (text.endsWith(".0")) {
        text = text.substring(0, text.length - 2);
      }
      return text;
    }

    return object.toString();
  }
}
