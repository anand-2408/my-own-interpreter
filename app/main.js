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

if (fileContent.length !== 0) {
  // Split file content into lines
  let lines = fileContent.split("\n");

  // Tokenizing the lines
  for (const [lineNumber, line] of lines.entries()) {
    for (let i = 0; i < line.length; i++) {
      let ch = line[i];

      // Token for each character
      if (ch === '(') {
        tokens += 'LEFT_PAREN ( null\n';
      } else if (ch === ')') {
        tokens += 'RIGHT_PAREN ) null\n';
      } else if (ch === '{') {
        tokens += 'LEFT_BRACE { null\n';
      } else if (ch === '}') {
        tokens += 'RIGHT_BRACE } null\n';
      } else if (ch === ',') {
        tokens += 'COMMA , null\n';
      } else if (ch === '.') {
        tokens += 'DOT . null\n';
      } else if (ch === '-') {
        tokens += 'MINUS - null\n';
      } else if (ch === '+') {
        tokens += 'PLUS + null\n';
      } else if (ch === ';') {
        tokens += 'SEMICOLON ; null\n';
      } else if (ch === '*') {
        tokens += 'STAR * null\n';
      } else if (ch === '=') {
        if (i + 1 < line.length && line[i + 1] === '=') {
          tokens += 'EQUAL_EQUAL == null\n';
          i++;
        } else {
          tokens += 'EQUAL = null\n';
        }
      } else if (ch === ' ' || ch === '\t') {
        continue; // Ignore whitespace
      } else if (ch === '!') {
        if (i + 1 < line.length && line[i + 1] === '=') {
          tokens += 'BANG_EQUAL != null\n';
          i++;
        } else {
          tokens += 'BANG ! null\n';
        }
      } else if (ch === '<') {
        if (i + 1 < line.length && line[i + 1] === '=') {
          tokens += 'LESS_EQUAL <= null\n';
          i++;
        } else {
          tokens += 'LESS < null\n';
        }
      } else if (ch === '>') {
        if (i + 1 < line.length && line[i + 1] === '=') {
          tokens += 'GREATER_EQUAL >= null\n';
          i++;
        } else {
          tokens += 'GREATER > null\n';
        }
      } else if (ch === '/') {
        if (i + 1 < line.length && line[i + 1] === '/') {
          break; // Ignore comments
        } else {
          tokens += 'SLASH / null\n';
        }
      } else if (ch === '"') {
        // Handle string literals
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
          tokens += `STRING "${str}" ${str}\n`;
        } else {
          console.error(`[line ${lineNumber + 1}] Error: Unterminated string.`);
          isError = true;
        }
      } else if (isAlpha(ch)) {
        // Handle identifiers and keywords
        const start = i;
        while (isAlphaNumeric(peek(line, i))) {
          i++;
        }
        const identifier = line.slice(start, i);
        const type = keywords[identifier] || "IDENTIFIER";
        tokens += `${type} ${identifier} null\n`;
        i--; // Adjust index after parsing
      } else if (line[i] >= '0' && line[i] <= '9') {
        // Handle number literals
        const startDigit = i;
        while (i < line.length && line[i] >= '0' && line[i] <= '9') {
          i++;
        }
        if (line[i] === '.' && i + 1 < line.length && line[i + 1] >= '0' && line[i + 1] <= '9') {
          i++;
          while (i < line.length && line[i] >= '0' && line[i] <= '9') {
            i++;
          }
        }
        const numberString = line.slice(startDigit, i);
        i--; // Adjust index after parsing
        const num = parseFloat(numberString);
        if (Number.isInteger(num)) {
          tokens += `NUMBER ${numberString} ${num.toFixed(1)}\n`;
        } else {
          tokens += `NUMBER ${numberString} ${numberString}\n`;
        }
      } else {
        console.error(`[line ${lineNumber + 1}] Error: Unexpected character: ${ch}`);
        isError = true;
      }
    }
  }
}

// Append EOF token
tokens += 'EOF  null\n';

// Output the tokens
console.log(tokens);
if (isError) {
  process.exit(65);
}

// Helper functions
function isAlpha(c) {
  return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || c === '_';
}

function isDigit(c) {
  return c >= '0' && c <= '9';
}

function isAlphaNumeric(c) {
  return isAlpha(c) || isDigit(c);
}

function peek(line, index) {
  return index < line.length ? line[index] : null; // Safely peek at the character
}
