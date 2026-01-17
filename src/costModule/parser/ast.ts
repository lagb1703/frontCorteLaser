export type ASTNode =
  | NumberLiteral
  | Identifier
  | BinaryExpression
  | UnaryExpression
  | CallExpression;

interface BinaryExpression {
  type: "BinaryExpression";
  operator: "+" | "-" | "*" | "/" | "**" | "%" | "//";
  left: ASTNode;
  right: ASTNode;
}

interface UnaryExpression {
  type: "UnaryExpression";
  operator: "-";
  argument: ASTNode;
}

interface CallExpression {
  type: "CallExpression";
  callee: string;
  args: ASTNode[];
}

interface NumberLiteral {
  type: "NumberLiteral";
  value: number;
}

interface Identifier {
  type: "Identifier";
  value: string;
}
