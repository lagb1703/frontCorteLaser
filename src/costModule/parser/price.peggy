{
  const ALLOWED_FUNCS = ["min", "max", "round"];
}

Expression
  = Additive

Additive
  = left:Multiplicative _ "+" _ right:Additive {
      return { type: "BinaryExpression", operator: "+", left, right };
    }
  / left:Multiplicative _ "-" _ right:Additive {
      return { type: "BinaryExpression", operator: "-", left, right };
    }
  / Multiplicative

Multiplicative
  = left:Power _ "*" _ right:Multiplicative {
      return { type: "BinaryExpression", operator: "*", left, right };
    }
  / left:Power _ "/" _ right:Multiplicative {
      return { type: "BinaryExpression", operator: "/", left, right };
    }
  / left:Power _ "%" _ right:Multiplicative {
      return { type: "BinaryExpression", operator: "%", left, right };
    }
  / left:Power _ "//" _ right:Multiplicative {
      return { type: "BinaryExpression", operator: "//", left, right };
    }
  / Power

Power
  = left:Unary _ "**" _ right:Power {
      return { type: "BinaryExpression", operator: "**", left, right };
    }
  / Unary

Unary
  = "-" _ expr:Unary {
      return { type: "UnaryExpression", operator: "-", argument: expr };
    }
  / Primary

Primary
  = Call
  / Number
  / Identifier
  / "(" _ Expression _ ")"

Call
  = name:Identifier _ "(" _ args:Arguments? _ ")" {
      if (!ALLOWED_FUNCS.includes(name.name)) {
        throw new Error(`Function not allowed: ${name.name}`);
      }
      return {
        type: "CallExpression",
        callee: name.name,
        args: args ?? []
      };
    }

Arguments
  = head:Expression tail:(_ "," _ Expression)* {
      return [head, ...tail.map(t => t[3])];
    }

Number
  = digits:[0-9]+ ("." [0-9]+)? {
      return { type: "NumberLiteral", value: parseFloat(text()) };
    }

Identifier
  = name:[a-zA-Z_][a-zA-Z0-9_]* {
      return { type: "Identifier", name: text() };
    }

_ = [ \t\n\r]*
