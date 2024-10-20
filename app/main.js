import fs from "fs";

// Get the command-line arguments, ignoring the first two (node path and script path)
const args = process.argv.slice(2);

// Ensure that the correct number of arguments is provided
if (args.length < 2) {
  console.error("Usage: ./your_program.sh tokenize <filename>");
  process.exit(1);
}

const command = args[0];

// Check if the provided command is "tokenize"
if (command !== "tokenize") {
  console.error(`Unknown command: ${command}`);
  process.exit(1);
}

console.error("Logs from your program will appear here!"); // Debugging message

// Get the filename from the second argument
const filename = args[1];

// Read the content of the file
const fileContent = fs.readFileSync(filename, "utf8");

// Initialize error tracking variable
let hadError = false;

// Function to check if a character is a digit
const isDigit = (char) => char >= '0' && char <= '9';

// Check if the file is empty and print EOF if it is
if (fileContent.length === 0) {
  console.log("EOF  null");
} else {
  // Split the file content into lines
  let lines = fileContent.split('\n');

  // Loop through each line
  for (let i = 0; i < lines.length; i++) {
    // Loop through each character in the line
    for (let j = 0; j < lines[i].length; j++) {
      const char = lines[i][j];

      // Ignore whitespace characters
      if (/\s/.test(char)) {
        continue;
      }

      // Check for specific characters (tokens)
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
          // Handle comments
          if (lines[i][j + 1] === '/') {
            break; // Ignore the rest of the line
          }
          console.log("SLASH / null");
          break;
        case '=':
          console.log("EQUAL = null");
          break;
        case '!':
          // Handle the possibility of a BANG_EQUAL token
          if (lines[i][j + 1] === '=') {
            console.log("BANG_EQUAL != null");
            j++; // Advance to skip the '='
          } else {
            console.log("BANG ! null");
          }
          break;
        case '<':
          console.log("LESS < null");
          break;
        case '>':
          console.log("GREATER > null");
          break;
        case '"':
          // Handle string literals
          let start = j;
          j++; // Skip the opening quote
          while (j < lines[i].length && lines[i][j] !== '"') {
            j++;
          }
          if (j === lines[i].length) {
            console.error(`[line ${i + 1}] Error: Unterminated string.`);
            hadError = true;
            break;
          }
          const stringLiteral = lines[i].substring(start, j + 1);
          const stringValue = lines[i].substring(start + 1, j);
          console.log(`STRING ${stringLiteral} ${stringValue}`);
          continue;

        default:
          // Handle numbers
          if (isDigit(char)) {
            let start = j;
            while (isDigit(lines[i][j])) j++;
            
            // Look for a fractional part
            if (lines[i][j] === '.' && isDigit(lines[i][j + 1])) {
              j++; // Consume the decimal point
              while (isDigit(lines[i][j])) j++;
            }

            // Capture the entire number lexeme
            const numberLiteral = lines[i].substring(start, j);
            // Use the numberLiteral directly for the literal value
            console.log(`NUMBER ${numberLiteral} ${numberLiteral}`);
            j--; // Adjust index because for loop will increment it
            continue;
          }

          // Handle unexpected characters
          console.error(`[line ${i + 1}] Error: Unexpected character: ${char}`);
          hadError = true;
      }
    }
  }

  // After processing all the characters, print the EOF token
  console.log("EOF  null");
}

// Exit with error code if there were any errors
if (hadError) {
  process.exit(65);
} else {
  process.exit(0);
}
