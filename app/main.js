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

// Get the filename from the second argument
const filename = args[1];

// Read the content of the file
const fileContent = fs.readFileSync(filename, "utf8");

// Initialize variables for scanning
let current = 0; // Current character index
let line = 1; // Current line number
let hadError = false; // Track if any unexpected characters are encountered

// Function to log errors
function error(line, message) {
  console.error(`[line ${line}] Error: ${message}`);
  hadError = true;
}

// Function to check if a character is a digit
function isDigit(c) {
  return c >= '0' && c <= '9';
}

// Function to tokenize the input
function scanTokens() {
  const tokens = [];

  while (!isAtEnd()) {
    start = current; // Mark the start of the token
    scanToken(tokens); // Scan the next token
  }

  tokens.push({ type: 'EOF', lexeme: '', literal: null });
  return tokens;
}

// Function to scan a single token
function scanToken(tokens) {
  const c = advance();

  switch (c) {
    case '(':
      tokens.push({ type: 'LEFT_PAREN', lexeme: '(', literal: null });
      break;
    case ')':
      tokens.push({ type: 'RIGHT_PAREN', lexeme: ')', literal: null });
      break;
    case '{':
      tokens.push({ type: 'LEFT_BRACE', lexeme: '{', literal: null });
      break;
    case '}':
      tokens.push({ type: 'RIGHT_BRACE', lexeme: '}', literal: null });
      break;
    case ',':
      tokens.push({ type: 'COMMA', lexeme: ',', literal: null });
      break;
    case '.':
      tokens.push({ type: 'DOT', lexeme: '.', literal: null });
      break;
    case '-':
      tokens.push({ type: 'MINUS', lexeme: '-', literal: null });
      break;
    case '+':
      tokens.push({ type: 'PLUS', lexeme: '+', literal: null });
      break;
    case ';':
      tokens.push({ type: 'SEMICOLON', lexeme: ';', literal: null });
      break;
    case '*':
      tokens.push({ type: 'STAR', lexeme: '*', literal: null });
      break;
    case '/':
      tokens.push({ type: 'SLASH', lexeme: '/', literal: null });
      break;
    case '!':
      tokens.push({ type: 'BANG', lexeme: '!', literal: null });
      break;
    case '=':
      tokens.push({ type: 'EQUAL', lexeme: '=', literal: null });
      break;
    case ' ':
    case '\r':
    case '\t':
      // Ignore whitespace
      break;
    case '\n':
      line++; // Increment line number on newline
      break;
    default:
      if (isDigit(c)) {
        number(tokens);
      } else if (c === '"') {
        string(tokens);
      } else {
        error(line, `Unexpected character: ${c}`);
      }
      break;
  }
}

// Function to advance the current character
function advance() {
  return source.charAt(current++);
}

// Function to check if we've reached the end of the input
function isAtEnd() {
  return current >= source.length;
}

// Function to scan for number literals
function number(tokens) {
  while (isDigit(peek())) advance();

  // Look for a fractional part.
  if (peek() === '.' && isDigit(peekNext())) {
    // Consume the "."
    advance();

    while (isDigit(peek())) advance();
  }

  const numberLiteral = source.substring(start, current);
  const literalValue = numberLiteral.includes('.')
    ? parseFloat(numberLiteral).toString() // Convert to number and back to string to remove trailing zeros
    : numberLiteral + '.0'; // Append .0 for integers
  
  tokens.push({ type: 'NUMBER', lexeme: numberLiteral, literal: literalValue });
}

// Function to scan for string literals
function string(tokens) {
  let value = '';
  
  while (peek() !== '"' && !isAtEnd()) {
    if (peek() === '\n') line++;
    value += advance();
  }

  if (isAtEnd()) {
    error(line, "Unterminated string.");
    return;
  }

  // Consume the closing "
  advance();
  
  tokens.push({ type: 'STRING', lexeme: `"${value}"`, literal: value });
}

// Function to peek at the next character
function peek() {
  return isAtEnd() ? '\0' : source.charAt(current);
}

// Function to peek at the next character
function peekNext() {
  if (current + 1 >= source.length) return '\0';
  return source.charAt(current + 1);
}

// Run the tokenizer
const tokens = scanTokens();

// Output the tokens
for (const token of tokens) {
  console.log(`${token.type} ${token.lexeme} ${token.literal}`);
}

// Exit with the appropriate code
process.exit(hadError ? 65 : 0);
