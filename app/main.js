// Importing necessary modules
import { readFileSync } from 'fs';
// Reading the file content from the third command-line argument
const fileContent = readFileSync(process.argv[3], 'utf-8');
// Splitting the file content into lines (for now, we handle only line 1)
let lines = fileContent.split('\n');
// Initialize an empty string to store valid tokens
let token = "";
// Track whether there is an error
let hasError = false;
// Iterating over each character in the first line
for (let j = 0; j < lines[0].length; j++) {
  let ch = lines[0][j]; // Get the current character
  // Check the character and append the appropriate token or error
  if (ch == '(') {
  // Check for '==' (EQUAL_EQUAL) by looking ahead
  if (ch == '=') {
    if (j + 1 < lines[0].length && lines[0][j + 1] == '=') {
      token += 'EQUAL_EQUAL == null\n';
      j++; // Skip the next character as part of '=='
    } else {
      token += 'EQUAL = null\n';
    }
  } else if (ch == '(') {
    token += 'LEFT_PAREN ( null\n';
  } else if (ch == ')') {
    token += 'RIGHT_PAREN ) null\n';
  } else if (ch == '{') {
    token += 'LEFT_BRACE { null\n';
  } else if (ch == '}') {
    token += 'RIGHT_BRACE } null\n';
  } else if (ch == '*') {
    token += 'STAR * null\n';
  } else if (ch == '.') {
    token += 'DOT . null\n';
  } else if (ch == ',') {
    token += 'COMMA , null\n';
  } else if (ch == '+') {
    token += 'PLUS + null\n';
  } else if (ch == '-') {
    token += 'MINUS - null\n';
  } else if (ch == ';') {
    token += 'SEMICOLON ; null\n';
  } else {
    // Print the error to stderr for an unexpected character
    console.error(`[line 1] Error: Unexpected character: ${ch}`);
    hasError = true; // Flag that an error occurred
  }
}
// Append the EOF (End of File) token at the end
token += "EOF  null\n";
// Output the valid token list to stdout
console.log(token);
// Exit with code 65 if any errors were detected
if (hasError) {
  process.exit(65);
} else {
  process.exit(0);
}
}