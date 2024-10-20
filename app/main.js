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
          console.log("BANG ! null");
          break;
        case '<':
          console.log("LESS < null");
          break;
        case '>':
          console.log("GREATER > null");
          break;
        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
          let start = j;
          while (j < lines[i].length && /\d/.test(lines[i][j])) {
            j++;
          }

          let numberLiteral;
          if (lines[i][j] === '.' && /\d/.test(lines[i][j + 1])) {
            j++;
            while (j < lines[i].length && /\d/.test(lines[i][j])) {
              j++;
            }
            numberLiteral = lines[i].substring(start, j); // Floating-point number
            console.log(`NUMBER ${numberLiteral} ${numberLiteral}`); // Print floating-point number
          } else {
            numberLiteral = lines[i].substring(start, j); // Integer number
            let literalValue = `${numberLiteral}.0`; // Ensure the literal has .0
            console.log(`NUMBER ${numberLiteral} ${literalValue}`); // Print without decimal point for integer
          }
          j--; // Adjust index because for loop will increment it
          continue;
        default:
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