import fs from "fs";

// Constants for the token types
const Tokens = {
  LEFT_PAREN: "LEFT_PAREN",
  RIGHT_PAREN: "RIGHT_PAREN",
  PLUS: "PLUS",
  MINUS: "MINUS",
  STAR: "STAR",
  SLASH: "SLASH",
  NUMBER: "NUMBER",
  TRUE: "TRUE",
  FALSE: "FALSE",
  NIL: "NIL",
  EOF: "EOF",
  IDENTIFIER: "IDENTIFIER"
};

// Tokenization logic here
var tokens = [];
var hasError = false;

function tokenize(source) {
  let lines = source.split("\n");
  for (var i = 0; i < lines.length; i++) {
    for (var j = 0; j < lines[i].length; j++) {
      const ch = lines[i][j];
      switch (ch) {
        case "(":
          tokens.push({ token_type: Tokens.LEFT_PAREN, lexeme: ch, literal: null });
          break;
        case ")":
          tokens.push({ token_type: Tokens.RIGHT_PAREN, lexeme: ch, literal: null });
          break;
        case "+":
          tokens.push({ token_type: Tokens.PLUS, lexeme: ch, literal: null });
          break;
        case "-":
          tokens.push({ token_type: Tokens.MINUS, lexeme: ch, literal: null });
          break;
        case "*":
          tokens.push({ token_type: Tokens.STAR, lexeme: ch, literal: null });
          break;
        case "/":
          tokens.push({ token_type: Tokens.SLASH, lexeme: ch, literal: null });
          break;
        case " ":
        case "\r":
        case "\t":
        case "\n":
          break; // Ignore whitespace
        case "t":
          if (lines[i].substring(j, j + 4) === "true") {
            tokens.push({ token_type: Tokens.TRUE, lexeme: "true", literal: true });
            j += 3; // Skip the rest of "true"
          }
          break;
        case "f":
          if (lines[i].substring(j, j + 5) === "false") {
            tokens.push({ token_type: Tokens.FALSE, lexeme: "false", literal: false });
            j += 4; // Skip the rest of "false"
          }
          break;
        case "n":
          if (lines[i].substring(j, j + 3) === "nil") {
            tokens.push({ token_type: Tokens.NIL, lexeme: "nil", literal: null });
            j += 2; // Skip the rest of "nil"
          }
          break;
        default:
          if (isDigit(ch)) {
            let number = "";
            while (j < lines[i].length && isDigit(lines[i][j])) {
              number += lines[i][j++];
            }
            if (j < lines[i].length && lines[i][j] === ".") {
              number += ".";
              j++;
              while (j < lines[i].length && isDigit(lines[i][j])) {
                number += lines[i][j++];
              }
            }
            tokens.push({ token_type: Tokens.NUMBER, lexeme: number, literal: parseFloat(number) });
            j--; // Backtrack after number
          } else {
            console.error(`[line ${i + 1}] Error: Unexpected character: ${ch}`);
            hasError = true;
          }
      }
    }
  }
  tokens.push({ token_type: Tokens.EOF, lexeme: "", literal: null });
}

function isDigit(ch) {
  return ch >= "0" && ch <= "9";
}

function printToken(token) {
  console.log(`${token.token_type} ${token.lexeme} ${token.literal != null ? token.literal : "null"}`);
}

// Parsing logic to handle expressions and literals
function parse(tokens) {
  let current = 0;

  function expression() {
    return equality();
  }

  function equality() {
    let expr = comparison();

    while (match(Tokens.BANG_EQUAL, Tokens.EQUAL_EQUAL)) {
      let operator = previous();
      let right = comparison();
      expr = { type: "Binary", left: expr, operator, right };
    }

    return expr;
  }

  function comparison() {
    let expr = addition();

    while (match(Tokens.GREATER, Tokens.GREATER_EQUAL, Tokens.LESS, Tokens.LESS_EQUAL)) {
      let operator = previous();
      let right = addition();
      expr = { type: "Binary", left: expr, operator, right };
    }

    return expr;
  }

  function addition() {
    let expr = multiplication();

    while (match(Tokens.PLUS, Tokens.MINUS)) {
      let operator = previous();
      let right = multiplication();
      expr = { type: "Binary", left: expr, operator, right };
    }

    return expr;
  }

  function multiplication() {
    let expr = unary();

    while (match(Tokens.STAR, Tokens.SLASH)) {
      let operator = previous();
      let right = unary();
      expr = { type: "Binary", left: expr, operator, right };
    }

    return expr;
  }

  function unary() {
    if (match(Tokens.BANG, Tokens.MINUS)) {
      let operator = previous();
      let right = unary();
      return { type: "Unary", operator, right };
    }

    return primary();
  }

  function primary() {
    if (match(Tokens.FALSE)) return { type: "Literal", value: false };
    if (match(Tokens.TRUE)) return { type: "Literal", value: true };
    if (match(Tokens.NIL)) return { type: "Literal", value: null };

    if (match(Tokens.NUMBER)) {
      return { type: "Literal", value: previous().literal };
    }

    if (match(Tokens.LEFT_PAREN)) {
      let expr = expression();
      consume(Tokens.RIGHT_PAREN, "Expect ')' after expression.");
      return { type: "Grouping", expression: expr };
    }
  }

  function match(...types) {
    for (let type of types) {
      if (check(type)) {
        advance();
        return true;
      }
    }

    return false;
  }

  function consume(type, message) {
    if (check(type)) return advance();

    throw new Error(message);
  }

  function check(type) {
    if (isAtEnd()) return false;
    return peek().token_type === type;
  }

  function advance() {
    if (!isAtEnd()) current++;
    return previous();
  }

  function isAtEnd() {
    return peek().token_type === Tokens.EOF;
  }

  function peek() {
    return tokens[current];
  }

  function previous() {
    return tokens[current - 1];
  }

  return expression();
}

// AST printer
function printAst(ast) {
  function parenthesize(name, ...exprs) {
    let result = `(${name}`;
    for (let expr of exprs) {
      result += " " + astToString(expr);
    }
    result += ")";
    return result;
  }

  function astToString(expr) {
    if (expr.type === "Binary") {
      return parenthesize(expr.operator.lexeme, expr.left, expr.right);
    } else if (expr.type === "Grouping") {
      return parenthesize("group", expr.expression);
    } else if (expr.type === "Literal") {
      return expr.value === null ? "nil" : expr.value.toString();
    } else if (expr.type === "Unary") {
      return parenthesize(expr.operator.lexeme, expr.right);
    }
  }

  console.log(astToString(ast));
}

// Main execution logic
const args = process.argv.slice(2);
if (args.length < 2) {
  console.error("Usage: ./your_program.sh <command> <filename>");
  process.exit(1);
}

const command = args[0];
const filename = args[1];
const fileContent = fs.readFileSync(filename, "utf8");

if (command === "tokenize") {
  tokenize(fileContent);
  tokens.forEach((token) => printToken(token));
} else if (command === "parse") {
  tokenize(fileContent);
  const ast = parse(tokens);
  printAst(ast);
} else {
  console.error(`Unknown command: ${command}`);
  process.exit(1);
}
