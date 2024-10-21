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

const tokens = [];
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

// Helper functions
const isAlpha = (c) => (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || c === '_';
const isDigit = (c) => c >= '0' && c <= '9';
const isAlphaNumeric = (c) => isAlpha(c) || isDigit(c);

// Tokenizing function
const tokenize = (lines) => {
  for (const [lineNumber, line] of lines.entries()) {
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];

      if (ch === ' ' || ch === '\t') continue; // Ignore whitespace

      switch (ch) {
        case '(': tokens.push('LEFT_PAREN ( null'); break;
        case ')': tokens.push('RIGHT_PAREN ) null'); break;
        case '{': tokens.push('LEFT_BRACE { null'); break;
        case '}': tokens.push('RIGHT_BRACE } null'); break;
        case ',': tokens.push('COMMA , null'); break;
        case '.': tokens.push('DOT . null'); break;
        case '-': tokens.push('MINUS - null'); break;
        case '+': tokens.push('PLUS + null'); break;
        case ';': tokens.push('SEMICOLON ; null'); break;
        case '*': tokens.push('STAR * null'); break;
        case '=': tokens.push(line[i + 1] === '=' ? 'EQUAL_EQUAL == null' : 'EQUAL = null'); if (line[i + 1] === '=') i++; break;
        case '!': tokens.push(line[i + 1] === '=' ? 'BANG_EQUAL != null' : 'BANG ! null'); if (line[i + 1] === '=') i++; break;
        case '<': tokens.push(line[i + 1] === '=' ? 'LESS_EQUAL <= null' : 'LESS < null'); if (line[i + 1] === '=') i++; break;
        case '>': tokens.push(line[i + 1] === '=' ? 'GREATER_EQUAL >= null' : 'GREATER > null'); if (line[i + 1] === '=') i++; break;
        case '/':
          if (line[i + 1] === '/') break; // Ignore comments
          // Treat as identifier if not part of comment
          let identifier = '';
          while (isAlphaNumeric(line[i])) identifier += line[i++];
          if (identifier) tokens.push(`IDENTIFIER ${identifier} null`);
          i--; // Adjust index after parsing
          break;
        case '"':
          let str = '';
          i++;
          while (i < line.length && line[i] !== '"') {
            if (line[i] === '\\' && i + 1 < line.length) {
              str += line[i] + line[i + 1];
              i += 2;
            } else {
              str += line[i++];
            }
          }
          if (i < line.length) {
            tokens.push(`STRING "${str}" ${str}`);
          } else {
            isError = true;
          }
          break;
        default:
          if (isAlpha(ch)) {
            const start = i;
            while (isAlphaNumeric(line[++i])) {}
            const identifier = line.slice(start, i);
            const type = keywords[identifier] || "IDENTIFIER";
            tokens.push(`${type} ${identifier} null`);
            i--; // Adjust index after parsing
          } else if (isDigit(ch)) {
            const startDigit = i;
            while (isDigit(line[++i])) {}
            let isFloat = false;
            if (line[i] === '.' && isDigit(line[i + 1])) {
              isFloat = true;
              i++;
              while (isDigit(line[++i])) {}
            }
            const numberString = line.slice(startDigit, i);
            const num = parseFloat(numberString);
            const outputNumber = isFloat || numberString.includes('.') ? num.toString() : num.toFixed(1);
            tokens.push(`NUMBER ${numberString} ${outputNumber}`);
            i--; // Adjust index after parsing
          } else {
            isError = true;
          }
      }
    }
  }
}

// Tokenization
if (fileContent.length !== 0) {
  const lines = fileContent.split("\n");
  tokenize(lines);
}

// Append EOF token
tokens.push('EOF  null');

// Output the tokens
console.log(tokens.join('\n'));
if (isError) {
  process.exit(65);
}
