import { ExprVisitor, LiteralExpr } from "./Expr";
import { LoxValue } from "./Token";


export class Interpreter implements ExprVisitor<LoxValue> {
  visitLiteralExpr(expr: LiteralExpr): LoxValue {
    return expr.value
  }
}