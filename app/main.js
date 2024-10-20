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

// This variable will track if any errors were found
let hadError = false;

// Check if the file is empty and print EOF if it is
if (fileContent.length === 0) {
  console.log("EOF  null");
} else {
  // Split the file content into lines
  let lines = fileContent.split('\n');

  // Loop through each line
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    let insideString = false;  // Track if we are inside a string
    let stringStart = 0;       // Start index for string
    let stringContent = '';    // Capture the content inside the string

    // Loop through each character in the line
    for (let j = 0; j < line.length; j++) {
      let char = line[j];

      // Ignore whitespace characters: space, tab, and newline
      if (char === ' ' || char === '\t' || char === '\n') {
        continue; // Skip whitespace
      }

      // Handle string literals
      if (char === '"') {
        if (insideString) {
          // Closing quote found, print the STRING token
          console.log(`STRING "${stringContent}" ${stringContent}`);
          insideString = false; // Exit the string state
        } else {
          // Starting quote found
          insideString = true;
          stringContent = ''; // Reset string content
          stringStart = j;    // Mark the start of the string
        }
        continue;
      }

      // If we're inside a string, accumulate the characters
      if (insideString) {
        stringContent += char;

        // If we reach the end of the line and the string is not closed, raise an error
        if (j === line.length - 1 && insideString) {
          console.error(`[line ${i + 1}] Error: Unterminated string.`);
          hadError = true;
        }
        continue;
      }

      // Handle comments: if we encounter "//", ignore the rest of the line
      if (char === '/' && line[j + 1] === '/') {
        break; // Ignore the rest of the line
      }

      // Check for specific characters (parentheses, braces, commas, etc.)
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
          if (line[j + 1] !== '/') {
            console.log("SLASH / null");
          }
          break;
        case '=':
          if (line[j + 1] === '=') {
            console.log("EQUAL_EQUAL == null");
            j++; // Move past the second '='
          } else {
            console.log("EQUAL = null");
          }
          break;
        case '!':
          if (line[j + 1] === '=') {
            console.log("BANG_EQUAL != null");
            j++; // Move past the second '='
          } else {
            console.log("BANG ! null");
          }
          break;
        case '<':
          if (line[j + 1] === '=') {
            console.log("LESS_EQUAL <= null");
            j++; // Move past the second '='
          } else {
            console.log("LESS < null");
          }
          break;
        case '>':
          if (line[j + 1] === '=') {
            console.log("GREATER_EQUAL >= null");
            j++; // Move past the second '='
          } else {
            console.log("GREATER > null");
          }
          break;
        // Handle unexpected characters
        default:
          console.error(`[line ${i + 1}] Error: Unexpected character: ${char}`);
          hadError = true;
      }
    }
  }

  // After processing all the characters, print the EOF token
  console.log("EOF  null");
}

// Add debug log before exit
if (hadError) {
  console.error("Errors were encountered. Exiting with code 65.");
  process.exit(65); // Exit with code 65 if there was an error
} else {
  process.exit(0); // Exit with code 0 if no errors were encountered
}
