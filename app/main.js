import fs from "fs";

const args = process.argv.slice(2); // Skip the first two arguments (node path and script path)
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
      } else if (line[i] >= '0' && line[i] <= '9') {
        // Handle number literals
        const startDigit = i;
        
        // Parse integer part
        while (i < line.length && line[i] >= '0' && line[i] <= '9') {
          i++;
        }
        
        // Parse fractional part (if any)
        let isFraction = false;
        if (line[i] === '.' && i + 1 < line.length && line[i + 1] >= '0' && line[i + 1] <= '9') {
          i++;
          while (i < line.length && line[i] >= '0' && line[i] <= '9') {
            i++;
          }
          isFraction = true;
        }
        
        // Extract the number string
        const numberString = line.slice(startDigit, i);
        i--; // Adjust index after parsing
        
        // Convert the string to a float
        const num = parseFloat(numberString);
        
        // Check if it's a whole number or a fraction
        if (Number.isInteger(num)) {
          // Whole number: append `.0`
          tokens += `NUMBER ${numberString} ${num.toFixed(1)}\n`;
        } else {
          // Fractional number: handle trailing zeros
          tokens += `NUMBER ${numberString} ${num}\n`;
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
