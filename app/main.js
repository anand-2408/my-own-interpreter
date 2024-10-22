import fs from "fs";
const args = process.argv.slice(2); // Skip the first two arguments (node path and script path)
if (args.length < 2) {
  console.error("Usage: ./your_program.sh tokenize <filename>");
  process.exit(1);
}
const command = args[0];
if (command !== "tokenize") {
  console.error(`Usage: Unknown command: ${command}`);
  process.exit(1);
}
const filename = args[1];
const fileContent = fs.readFileSync(filename, "utf8");
const Tokens = {
  LEFT_PAREN: "LEFT_PAREN",
  RIGHT_PAREN: "RIGHT_PAREN",
  LEFT_BRACE: "LEFT_BRACE",
  RIGHT_BRACE: "RIGHT_BRACE",
  COMMA: "COMMA",
  DOT: "DOT",
  MINUS: "MINUS",
  PLUS: "PLUS",
  SEMICOLON: "SEMICOLON",
  STAR: "STAR",
  EOF: "EOF",
  BANG: "BANG",
  BANG_EQUAL: "BANG_EQUAL",
  EQUAL: "EQUAL",
  EQUAL_EQUAL: "EQUAL_EQUAL",
  GREATER: "GREATER",
  GREATER_EQUAL: "GREATER_EQUAL",
  LESS: "LESS",
  LESS_EQUAL: "LESS_EQUAL",
  SLASH: "SLASH",
  STRING: "STRING",
  NUMBER: "NUMBER",
  IDENTIFIER: "IDENTIFIER",
  AND: "AND",
  CLASS: "CLASS",
  ELSE: "ELSE",
  FALSE: "FALSE",
  FOR: "FOR",
  FUN: "FUN",
  IF: "IF",
  NIL: "NIL",
  OR: "OR",
  PRINT: "PRINT",
  RETURN: "RETURN",
  SUPER: "SUPER",
  THIS: "THIS",
  TRUE: "TRUE",
  VAR: "VAR",
  WHILE: "WHILE",
};
var tokens = [];
var hasError = false;
function printToken(token) {
  console.log(
    `${token.token_type} ${token.lexeme} ${
      token.literal ? token.literal : "null"
    }`
  );
}
function isDigit(ch) {
  if (ch >= "0" && ch <= "9") {
    return true;
  }
  return false;
}
function isAlpha(ch) {
  if ((ch >= "a" && ch <= "z") || (ch >= "A" && ch <= "Z") || ch == "_") {
    return true;
  }
  return false;
}
function isAlphaNumeric(ch) {
  if (isAlpha(ch) || isDigit(ch)) {
    return true;
  }
  return false;
}
const RESERVED_KEYWORDS = [
  "and",
  "class",
  "else",
  "false",
  "for",
  "fun",
  "if",
  "nil",
  "or",
  "print",
  "return",
  "super",
  "this",
  "true",
  "var",
  "while",
];
const RESERVED_KEYWORDS_TOKEN = {
  and: Tokens.AND,
  class: Tokens.CLASS,
  else: Tokens.ELSE,
  false: Tokens.FALSE,
  for: Tokens.FOR,
  fun: Tokens.FUN,
  if: Tokens.IF,
  nil: Tokens.NIL,
  or: Tokens.OR,
  print: Tokens.PRINT,
  return: Tokens.RETURN,
  super: Tokens.SUPER,
  this: Tokens.THIS,
  true: Tokens.TRUE,
  var: Tokens.VAR,
  while: Tokens.WHILE,
};
if (fileContent.length !== 0) {
  let lines = fileContent.split("\n");
  for (var i = 0; i < lines.length; i++) {
    for (var j = 0; j < lines[i].length; j++) {
      const ch = lines[i][j];
      var foundComment = false;
      switch (ch) {
        case "(":
          tokens.push({
            token_type: Tokens.LEFT_PAREN,
            lexeme: ch,
            literal: null,
            line: i,
          });
          break;
        case ")":
          tokens.push({
            token_type: Tokens.RIGHT_PAREN,
            lexeme: ch,
            literal: null,
            line: i,
          });
          break;
        case "{":
          tokens.push({
            token_type: Tokens.LEFT_BRACE,
            lexeme: ch,
            literal: null,
            line: i,
          });
          break;
        case "}":
          tokens.push({
            token_type: Tokens.RIGHT_BRACE,
            lexeme: ch,
            literal: null,
            line: i,
          });
          break;
        case ",":
          tokens.push({
            token_type: Tokens.COMMA,
            lexeme: ch,
            literal: null,
            line: i,
          });
          break;
        case ".":
          tokens.push({
            token_type: Tokens.DOT,
            lexeme: ch,
            literal: null,
            line: i,
          });
          break;
        case "-":
          tokens.push({
            token_type: Tokens.MINUS,
            lexeme: ch,
            literal: null,
            line: i,
          });
          break;
        case "+":
          tokens.push({
            token_type: Tokens.PLUS,
            lexeme: ch,
            literal: null,
            line: i,
          });
          break;
        case ";":
          tokens.push({
            token_type: Tokens.SEMICOLON,
            lexeme: ch,
            literal: null,
            line: i,
          });
          break;
        case "*":
          tokens.push({
            token_type: Tokens.STAR,
            lexeme: ch,
            literal: null,
            line: i,
          });
          break;
        case "!":
          if (j != lines[i].length - 1 && lines[i][j + 1] == "=") {
            tokens.push({
              token_type: Tokens.BANG_EQUAL,
              lexeme: lines[i][j] + lines[i][j + 1],
              literal: null,
              line: i,
            });
            j++;
          } else {
            tokens.push({
              token_type: Tokens.BANG,
              lexeme: ch,
              literal: null,
              line: i,
            });
          }
          break;
        case "=":
          if (j != lines[i].length - 1 && lines[i][j + 1] == "=") {
            tokens.push({
              token_type: Tokens.EQUAL_EQUAL,
              lexeme: lines[i][j] + lines[i][j + 1],
              literal: null,
              line: i,
            });
            j++;
          } else {
            tokens.push({
              token_type: Tokens.EQUAL,
              lexeme: ch,
              literal: null,
              line: i,
            });
          }
          break;
        case ">":
          if (j != lines[i].length - 1 && lines[i][j + 1] == "=") {
            tokens.push({
              token_type: Tokens.GREATER_EQUAL,
              lexeme: lines[i][j] + lines[i][j + 1],
              literal: null,
              line: i,
            });
            j++;
          } else {
            tokens.push({
              token_type: Tokens.GREATER,
              lexeme: ch,
              literal: null,
              line: i,
            });
          }
          break;
        case "<":
          if (j != lines[i].length - 1 && lines[i][j + 1] == "=") {
            tokens.push({
              token_type: Tokens.LESS_EQUAL,
              lexeme: lines[i][j] + lines[i][j + 1],
              literal: null,
              line: i,
            });
            j++;
          } else {
            tokens.push({
              token_type: Tokens.LESS,
              lexeme: ch,
              literal: null,
              line: i,
            });
          }
          break;
        case "/":
          if (j != lines[i].length - 1 && lines[i][j + 1] == "/") {
            foundComment = true;
          } else {
            tokens.push({
              token_type: Tokens.SLASH,
              lexeme: ch,
              literal: null,
              line: i,
            });
          }
          break;
        case " ":
        case "\r":
        case "\t":
          // Ignore whitespace.
          break;
        case '"':
          var endOfStringI = i;
          var endOfStringJ = j + 1;
          var literalValue = "";
          while (lines[endOfStringI][endOfStringJ] != '"') {
            if (endOfStringJ === lines[endOfStringI].length) {
              endOfStringI++;
              if (endOfStringI === lines.length) {
                break;
              }
              endOfStringJ = 0;
            } else {
              literalValue += lines[endOfStringI][endOfStringJ];
              endOfStringJ++;
            }
          }
          if (endOfStringI === lines.length) {
            console.error(`[line ${endOfStringI}] Error: Unterminated string.`);
            hasError = true;
            i = endOfStringI - 1;
            j = lines[i].length;
            break;
          }
          tokens.push({
            token_type: Tokens.STRING,
            lexeme: `"${literalValue}"`,
            literal: literalValue,
            line: i,
          });
          i = endOfStringI;
          j = endOfStringJ;
          break;
        default:
          if (isDigit(ch)) {
            endOfStringI = i;
            endOfStringJ = j;
            var integerPart = "";
            var fractionalPart = "";
            while (isDigit(lines[endOfStringI][endOfStringJ])) {
              integerPart += lines[endOfStringI][endOfStringJ];
              endOfStringJ++;
            }
            if (
              lines[endOfStringI][endOfStringJ] === "." &&
              isDigit(lines[endOfStringI][endOfStringJ + 1])
            ) {
              endOfStringJ++;
              while (isDigit(lines[endOfStringI][endOfStringJ])) {
                fractionalPart += lines[endOfStringI][endOfStringJ];
                endOfStringJ++;
              }
            }
            var finalNumber = integerPart;
            if (fractionalPart.length !== 0) {
              finalNumber = finalNumber + "." + fractionalPart;
            }
            var numberVal = parseFloat(finalNumber);
            if (Number.isInteger(numberVal)) {
              numberVal = Number(numberVal).toFixed(1);
            }
            tokens.push({
              token_type: Tokens.NUMBER,
              lexeme: finalNumber,
              literal: numberVal,
              line: i,
            });
            j = endOfStringJ - 1;
            break;
          } else if (isAlpha(ch)) {
            endOfStringJ = j + 1;
            var iden = lines[i][j];
            while (isAlphaNumeric(lines[i][endOfStringJ])) {
              iden += lines[i][endOfStringJ];
              endOfStringJ++;
            }
            if (RESERVED_KEYWORDS.some((w) => w === iden)) {
              tokens.push({
                token_type: RESERVED_KEYWORDS_TOKEN[iden],
                lexeme: iden,
                literal: null,
                line: i,
              });
            } else {
              tokens.push({
                token_type: Tokens.IDENTIFIER,
                lexeme: iden,
                literal: null,
                line: i,
              });
            }
            j = endOfStringJ - 1;
            break;
          } else {
            console.error(`[line ${i + 1}] Error: Unexpected character: ${ch}`);
            hasError = true;
          }
          break;
      }
      if (foundComment) {
        break;
      }
    }
  }
  tokens.push({
    token_type: Tokens.EOF,
    lexeme: "",
    literal: null,
    line: i,
  });
  tokens.forEach((token) => {
    printToken(token);
  });
  if (hasError) {
    process.exit(65);
  }
} else {
  console.log("EOF  null");
}

