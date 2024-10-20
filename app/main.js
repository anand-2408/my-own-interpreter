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
    // Loop through each character in the line
    for (let j = 0; j < lines[i].length; j++) {
      // Check for specific characters (parentheses, braces, commas, etc.)
      switch (lines[i][j]) {
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
        case '=':
          if (lines[i][j + 1] === '=') {
            console.log("EQUAL_EQUAL == null");
            j++; // Move past the second '='
          } else {
            console.log("EQUAL = null");
          }
          break;
        case '!':
          if (lines[i][j + 1] === '=') {
            console.log("BANG_EQUAL != null");
            j++; // Move past the second '='
          } else {
            console.log("BANG ! null");
          }
          break;
        // Handle unexpected characters
        default:
          console.error(`[line ${i + 1}] Error: Unexpected character: ${lines[i][j]}`);
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
  console.error("No errors encountered. Exiting with code 0.");
  process.exit(0);  // Exit with code 0 if no error
}
