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

// Helper method to match the next character and consume it if it matches
function match(nextChar) {
  if (current < fileContent.length && fileContent[current] === nextChar) {
    current++;
    return true;
  }
  return false;
}

// Check if the file is empty and print EOF if it is
if (fileContent.length === 0) {
  console.log("EOF  null");
} else {
  let current = 0;

  // Loop through the file content character by character
  while (current < fileContent.length) {
    const char = fileContent[current++];

    // Handle specific characters (parentheses, operators, etc.)
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
      case '=':
        if (match('=')) {
          console.log("EQUAL_EQUAL == null");
        } else {
          console.log("EQUAL = null");
        }
        break;
      case '!':
        if (match('=')) {
          console.log("BANG_EQUAL != null");
        } else {
          console.log("BANG ! null");
        }
        break;
      default:
        // Handle invalid characters
        console.error(`[line 1] Error: Unexpected character: ${char}`);
        process.exitCode = 65; // Set exit code to 65 if there are errors
    }
  }

  // After processing all characters, print the EOF token
  console.log("EOF  null");
}
