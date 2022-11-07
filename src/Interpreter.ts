import {
  Expr,
  ExprVisitor,
  GroupingExpr,
  LiteralExpr,
  UnaryExpr,
} from "./Expr";
import { LoxValue } from "./Token";

export class Interpreter implements ExprVisitor<LoxValue> {
  private evaluate(expr: Expr): LoxValue {
    return expr.accept(this);
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
        return -(right as number);
    }

    // Unreachable.
    return null;
  }

  private isTruthy(object: LoxValue): boolean {
    if (object === null) return false;
    if (typeof object === "boolean") return object;
    return true;
  }
}
