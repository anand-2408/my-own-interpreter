import fs from "fs";

// Get the command-line arguments, ignoring the first two (node path and script path)
const args = process.argv.slice(2);

if (args.length < 2) {
  console.error("Usage: ./your_program.sh tokenize <filename>");
  process.exit(1);
}

const command = args[0];

if (command !== "tokenize") {
  console.error(`Unknown command: ${command}`);
  process.exit(1);
}

console.error("Logs from your program will appear here!");

const filename = args[1];
const fileContent = fs.readFileSync(filename, "utf8");

let hadError = false;

if (fileContent.length === 0) {
  console.log("EOF  null");
} else {
  let lines = fileContent.split('\n');

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    let insideString = false;
    let stringContent = '';

    for (let j = 0; j < line.length; j++) {
      let char = line[j];

      if (char === ' ' || char === '\t' || char === '\n') {
        if (!insideString) {
          continue;
        }
      }

      if (char === '"') {
        if (insideString) {
          console.log(`STRING "${stringContent}" ${stringContent}`);
          insideString = false;
        } else {
          insideString = true;
          stringContent = '';
        }
        continue;
      }

      if (insideString) {
        stringContent += char;
        if (j === line.length - 1 && insideString) {
          console.error(`[line ${i + 1}] Error: Unterminated string.`);
          hadError = true;
        }
        continue;
      }

      if (char === '/' && line[j + 1] === '/' && !insideString) {
        break;
      }

      // Handle numbers
      if (isDigit(char)) {
        let start = j;
        while (j < line.length && isDigit(line[j])) {
          j++;
        }

        let numberLiteral;
        if (line[j] === '.' && isDigit(line[j + 1])) {
          j++;
          while (j < line.length && isDigit(line[j])) {
            j++;
          }
          numberLiteral = line.substring(start, j); // Floating-point number
        } else {
          numberLiteral = line.substring(start, j); // Integer number
          numberLiteral += ".0"; // Format the integer to a float
        }

        console.log(`NUMBER ${numberLiteral} ${parseFloat(numberLiteral)}`);
        j--; // Adjust index because for loop will increment it
        continue;
      }

      switch (char) {
        case '(':
          console.log("LEFT_PAREN ( null");
          break;
        case ')':
          console.log("RIGHT_PAREN ) null");
          break;
        case '{':
          console.log("LEFT_BRACE { null");
          break;
        case '}':
          console.log("RIGHT_BRACE } null");
          break;
        case ',':
          console.log("COMMA , null");
          break;
        case '.':
          console.log("DOT . null");
          break;
        case '-':
          console.log("MINUS - null");
          break;
        case '+':
          console.log("PLUS + null");
          break;
        case ';':
          console.log("SEMICOLON ; null");
          break;
        case '*':
          console.log("STAR * null");
          break;
        case '/':
          console.log("SLASH / null");
          break;
        case '=':
          if (line[j + 1] === '=') {
            console.log("EQUAL_EQUAL == null");
            j++;
          } else {
            console.log("EQUAL = null");
          }
          break;
        case '!':
          if (line[j + 1] === '=') {
            console.log("BANG_EQUAL != null");
            j++;
          } else {
            console.log("BANG ! null");
          }
          break;
        case '<':
          if (line[j + 1] === '=') {
            console.log("LESS_EQUAL <= null");
            j++;
          } else {
            console.log("LESS < null");
          }
          break;
        case '>':
          if (line[j + 1] === '=') {
            console.log("GREATER_EQUAL >= null");
            j++;
          } else {
            console.log("GREATER > null");
          }
          break;
        default:
          console.error(`[line ${i + 1}] Error: Unexpected character: ${char}`);
          hadError = true;
      }
    }
  }

  console.log("EOF  null");
}

if (hadError) {
  process.exit(65);
} else {
  process.exit(0);
}

function isDigit(char) {
  return char >= '0' && char <= '9';
}
