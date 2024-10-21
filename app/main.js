import fs from "fs";

const args = process.argv.slice(2);
if (args.length < 2) {
  console.error("Usage: ./your_program.sh tokenize test.lox");
  process.exit(1);
}

const command = args[0];
if (command !== "tokenize") {
  console.error(`Unknown command: ${command}`);
  process.exit(1);
}

// Read the content of the file
const filename = args[1];
const fileContent = fs.readFileSync(filename, "utf8");

let tokens = '';
let isError = false;

// Reserved keywords mapping
const keywords = {
  "and": "AND",
  "class": "CLASS",
  "else": "ELSE",
  "false": "FALSE",
  "for": "FOR",
  "fun": "FUN",
  "if": "IF",
  "nil": "NIL",
  "or": "OR",
  "print": "PRINT",
  "return": "RETURN",
  "super": "SUPER",
  "this": "THIS",
  "true": "TRUE",
  "var": "VAR",
  "while": "WHILE",
};

if (fileContent.length > 0) {
  const lines = fileContent.split("\n");

  for (const [lineNumber, line] of lines.entries()) {
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];

      // Skip whitespace
      if (/\s/.test(ch)) continue;

      // Handle tokens
      switch (ch) {
        case '(':
          tokens += 'LEFT_PAREN ( null\n';
          break;
        case ')':
          tokens += 'RIGHT_PAREN ) null\n';
          break;
        case '{':
          tokens += 'LEFT_BRACE { null\n';
          break;
        case '}':
          tokens += 'RIGHT_BRACE } null\n';
          break;
        case ',':
          tokens += 'COMMA , null\n';
          break;
        case '.':
          tokens += 'DOT . null\n';
          break;
        case '-':
          tokens += 'MINUS - null\n';
          break;
        case '+':
          tokens += 'PLUS + null\n';
          break;
        case ';':
          tokens += 'SEMICOLON ; null\n';
          break;
        case '*':
          tokens += 'STAR * null\n';
          break;
        case '=':
          if (peek(line, i + 1) === '=') {
            tokens += 'EQUAL_EQUAL == null\n';
            i++;
          } else {
            tokens += 'EQUAL = null\n';
          }
          break;
        case '!':
          if (peek(line, i + 1) === '=') {
            tokens += 'BANG_EQUAL != null\n';
            i++;
          } else {
            tokens += 'BANG ! null\n';
          }
          break;
        case '<':
          if (peek(line, i + 1) === '=') {
            tokens += 'LESS_EQUAL <= null\n';
            i++;
          } else {
            tokens += 'LESS < null\n';
          }
          break;
        case '>':
          if (peek(line, i + 1) === '=') {
            tokens += 'GREATER_EQUAL >= null\n';
            i++;
          } else {
            tokens += 'GREATER > null\n';
          }
          break;
        case '/':
          if (peek(line, i + 1) === '/') {
            break; // Ignore comments
          } else {
            tokens += 'SLASH / null\n';
          }
          break;
        case '"':
          let str = '';
          while (++i < line.length && line[i] !== '"') {
            if (line[i] === '\\' && i + 1 < line.length) {
              str += line[i++] + line[i];
            } else {
              str += line[i];
            }
          }
          if (i < line.length) {
            tokens += `STRING "${str}" ${str}\n`;
          } else {
            console.error(`[line ${lineNumber + 1}] Error: Unterminated string.`);
            isError = true;
          }
          break;
        default:
          if (isAlpha(ch)) {
            const start = i;
            while (isAlphaNumeric(peek(line, i))) i++;
            const identifier = line.slice(start, i);
            const type = keywords[identifier] || "IDENTIFIER";
            tokens += `${type} ${identifier} null\n`;
            i--;
          } else if (isDigit(ch)) {
            const startDigit = i;
            while (isDigit(peek(line, i))) i++;
            if (peek(line, i) === '.' && isDigit(peek(line, i + 1))) {
              i++;
              while (isDigit(peek(line, i))) i++;
            }
            tokens += `NUMBER ${line.slice(startDigit, i)} ${line.slice(startDigit, i)}\n`;
            i--;
          } else {
            console.error(`[line ${lineNumber + 1}] Error: Unexpected character: ${ch}`);
            isError = true;
          }
      }
    }
  }
}

// Append EOF token
tokens += 'EOF  null\n';
console.log(tokens);
if (isError) {
  process.exit(65);
}

// Helper functions
function isAlpha(c) {
  return /[a-zA-Z_]/.test(c);
}

function isDigit(c) {
  return /[0-9]/.test(c);
}

function isAlphaNumeric(c) {
  return isAlpha(c) || isDigit(c);
}

function peek(line, index) {
  return index < line.length ? line[index] : null;
}
