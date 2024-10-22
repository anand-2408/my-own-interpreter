import fs from "fs";
const args = process.argv.slice(2); // Skip the first two arguments (node path and script path)
if (args.length < 2) {
  console.error("Usage: ./your_program.sh tokenize <filename>");
  process.exit(1);
}
const command = args[0];
if (command !== "tokenize" && command !== "parse") {
  console.error(`Usage: Unknown command: ${command}`);
  process.exit(1);
}
const filename = args[1];
const fileContent = fs.readFileSync(filename, "utf8");

/**
 * @typedef {Object} Token
 * @property {string} type
 * @property {string} lexeme
 * @property {any} literal
 */

/**
 * Tokenizes the input content.
 * @param {string} content
 * @returns {Array<Token | Error>}
 */
function tokenize(content) {
  const tokens = [];
  if (content.length !== 0) {
    const lines = content.split(/\n/);
    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
      const lineNumber = lineIndex + 1;
      const line = lines[lineIndex];

      lineLoop: for (let columnIndex = 0; columnIndex < line.length; columnIndex++) {
        const char = line[columnIndex];
        const nextChar = line[columnIndex + 1];

        switch (char) {
          case "(": tokens.push({ type: "LEFT_PAREN", lexeme: "(", literal: null }); break;
          case ")": tokens.push({ type: "RIGHT_PAREN", lexeme: ")", literal: null }); break;
          case "{": tokens.push({ type: "LEFT_BRACE", lexeme: "{", literal: null }); break;
          case "}": tokens.push({ type: "RIGHT_BRACE", lexeme: "}", literal: null }); break;
          case ",": tokens.push({ type: "COMMA", lexeme: ",", literal: null }); break;
          case ".": tokens.push({ type: "DOT", lexeme: ".", literal: null }); break;
          case "-": tokens.push({ type: "MINUS", lexeme: "-", literal: null }); break;
          case "+": tokens.push({ type: "PLUS", lexeme: "+", literal: null }); break;
          case ";": tokens.push({ type: "SEMICOLON", lexeme: ";", literal: null }); break;
          case "*": tokens.push({ type: "STAR", lexeme: "*", literal: null }); break;
          case "=":
            if (nextChar === "=") {
              tokens.push({ type: "EQUAL_EQUAL", lexeme: "==", literal: null });
              columnIndex++;
            } else {
              tokens.push({ type: "EQUAL", lexeme: "=", literal: null });
            }
            break;
          case "!":
            if (nextChar === "=") {
              tokens.push({ type: "BANG_EQUAL", lexeme: "!=", literal: null });
              columnIndex++;
            } else {
              tokens.push({ type: "BANG", lexeme: "!", literal: null });
            }
            break;
          case "<":
            if (nextChar === "=") {
              tokens.push({ type: "LESS_EQUAL", lexeme: "<=", literal: null });
              columnIndex++;
            } else {
              tokens.push({ type: "LESS", lexeme: "<", literal: null });
            }
            break;
          case ">":
            if (nextChar === "=") {
              tokens.push({ type: "GREATER_EQUAL", lexeme: ">=", literal: null });
              columnIndex++;
            } else {
              tokens.push({ type: "GREATER", lexeme: ">", literal: null });
            }
            break;
          case "/":
            if (nextChar === "/") {
              // Comment, ignore rest of the line
              break lineLoop;
            } else {
              tokens.push({ type: "SLASH", lexeme: "/", literal: null });
            }
            break;
          case '"': {
            let str = undefined;
            for (let i = columnIndex + 1; i < line.length; i++) {
              if (line[i] === '"') {
                str = line.substring(columnIndex + 1, i);
                columnIndex = i;
                break;
              }
            }
            if (typeof str === "string") {
              tokens.push({ type: "STRING", lexeme: `"${str}"`, literal: str });
            } else {
              tokens.push(new Error(`[line ${lineNumber}] Error: Unterminated string.`));
              break lineLoop;
            }
            break;
          }
          default:
            if (/\s/.test(char)) break; // Skip whitespaces

            if (/[0-9]/.test(char)) { // Handle numbers
              let numberStr = char;
              for (let i = columnIndex + 1; i < line.length; i++) {
                if (/[0-9]/.test(line[i])) {
                  numberStr += line[i];
                  columnIndex = i;
                } else if (line[i] === ".") {
                  if (numberStr.includes(".")) {
                    tokens.push(new Error(`[line ${lineNumber}] Error: Unexpected character: ${line[i]}`));
                    break lineLoop;
                  } else {
                    numberStr += line[i];
                    columnIndex = i;
                  }
                } else {
                  break;
                }
              }
              const number = Number(numberStr);
              tokens.push({
                type: "NUMBER",
                lexeme: numberStr,
                literal: Number.isInteger(number) ? number + ".0" : number,
              });
              break;
            }

            if (/[a-zA-Z_]/.test(char)) { // Handle identifiers and reserved words
              let identifier = char;
              for (let i = columnIndex + 1; i < line.length; i++) {
                if (/[a-zA-Z0-9_]/.test(line[i])) {
                  identifier += line[i];
                  columnIndex = i;
                } else {
                  break;
                }
              }
              const reservedWords = [
                "and", "class", "else", "false", "for", "fun", "if", "nil", "or", "print",
                "return", "super", "this", "true", "var", "while"
              ];
              if (reservedWords.includes(identifier)) {
                tokens.push({ type: identifier.toUpperCase(), lexeme: identifier, literal: null });
              } else {
                tokens.push({ type: "IDENTIFIER", lexeme: identifier, literal: null });
              }
              break;
            }

            tokens.push(new Error(`[line ${lineNumber}] Error: Unexpected character: ${char}`));
        }
      }
    }
    // Ensure EOF token is always added
    tokens.push({ type: "EOF", lexeme: "", literal: null });
  }
  return tokens;
}

/**
 * Parse the tokens and print lexemes.
 * @param {Array<Token | Error>} tokens
 */
function parse(tokens) {
  for (const token of tokens) {
    console.log(token.lexeme);
  }
}

// Main logic
switch (command) {
  case "tokenize": {
    const tokens = tokenize(fileContent);
    for (const token of tokens) {
      if (token instanceof Error) {
        console.error(token.message);
      } else {
        console.log(`${token.type} ${token.lexeme} ${token.literal}`);
      }
    }
    if (tokens.find((token) => token instanceof Error)) {
      process.exit(65);
    }
    break;
  }
  case "parse":
    parse(tokenize(fileContent));
    break;
}
