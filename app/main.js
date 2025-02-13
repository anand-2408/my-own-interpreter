import fs from "fs";

const args = process.argv.slice(2); // Skip the first two arguments (node path and script path)

if (args.length < 2) {
  console.error("Usage: ./your_program.sh tokenize <filename>");
  process.exit(1);
}

const command = args[0];

const filename = args[1];

const fileContent = fs.readFileSync(filename, "utf8");

/**
 * @typedef {Object} Token
 * @property {string} type
 * @property {string} lexeme
 * @property {any} literal
 */

/**
 *
 * @param {string} content
 * @returns
 */
function tokenize(content) {
  /**
   * @type {Array<Token | Error>} tokens
   */
  const tokens = [];

  if (content.length !== 0) {
    const lines = content.split(/\n/);

    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
      const lineNumber = lineIndex + 1;
      const line = lines[lineIndex];
      lineLoop: for (
        let columnIndex = 0;
        columnIndex < line.length;
        columnIndex++
      ) {
        const char = line[columnIndex];
        const nextChar = line[columnIndex + 1];

        switch (char) {
          case "(":
            tokens.push({ type: "LEFT_PAREN", lexeme: "(", literal: null });
            break;
          case ")":
            tokens.push({ type: "RIGHT_PAREN", lexeme: ")", literal: null });
            break;
          case "{":
            tokens.push({ type: "LEFT_BRACE", lexeme: "{", literal: null });
            break;
          case "}":
            tokens.push({ type: "RIGHT_BRACE", lexeme: "}", literal: null });
            break;
          case ",":
            tokens.push({ type: "COMMA", lexeme: ",", literal: null });
            break;
          case ".":
            tokens.push({ type: "DOT", lexeme: ".", literal: null });
            break;
          case "-":
            tokens.push({ type: "MINUS", lexeme: "-", literal: null });
            break;
          case "+":
            tokens.push({ type: "PLUS", lexeme: "+", literal: null });
            break;
          case ";":
            tokens.push({ type: "SEMICOLON", lexeme: ";", literal: null });
            break;
          case "*":
            tokens.push({ type: "STAR", lexeme: "*", literal: null });
            break;
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
              tokens.push({
                type: "GREATER_EQUAL",
                lexeme: ">=",
                literal: null,
              });
              columnIndex++;
            } else {
              tokens.push({ type: "GREATER", lexeme: ">", literal: null });
            }
            break;
          case "/":
            if (nextChar === "/") {
              // Go to the next line
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
              tokens.push(
                new Error(`[line ${lineNumber}] Error: Unterminated string.`)
              );
              break lineLoop;
            }

            break;
          }
          default:
            // SKip whitespaces
            if (/\s/.test(char)) {
              break;
            }

            // Handle Number
            if (isNumber(char)) {
              let numberStr = char;
              for (let i = columnIndex + 1; i < line.length; i++) {
                if (isNumber(line[i])) {
                  numberStr += line[i];
                  columnIndex = i;
                } else if (line[i] === ".") {
                  if (numberStr.includes(".")) {
                    tokens.push(
                      new Error(
                        `[line ${lineNumber}] Error: Unexpected character: ${line[i]}`
                      )
                    );
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

            // Handle Identifier
            if (/[a-zA-Z_]/.test(char)) {
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
                "and",
                "class",
                "else",
                "false",
                "for",
                "fun",
                "if",
                "nil",
                "or",
                "print",
                "return",
                "super",
                "this",
                "true",
                "var",
                "while",
              ];

              if (reservedWords.includes(identifier)) {
                tokens.push({
                  type: identifier.toUpperCase(),
                  lexeme: identifier,
                  literal: null,
                });
              } else {
                tokens.push({
                  type: "IDENTIFIER",
                  lexeme: identifier,
                  literal: null,
                });
              }
              break;
            }

            tokens.push(
              new Error(
                `[line ${lineNumber}] Error: Unexpected character: ${char}`
              )
            );
        }
      }
    }

    tokens.push({ type: "EOF", lexeme: "", literal: null });
  } else {
    tokens.push({ type: "EOF", lexeme: "", literal: null });
  }

  return tokens;
}

/**
 *
 * @param {Array<Token>} tokens
 * @returns {Array<string>}
 */
function parse(tokens, { stacks = [] } = {}) {
  const output = [];

  loop: for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    if (!token) break;

    switch (token.type) {
      case "NIL":
      case "FALSE":
      case "TRUE": {
        output.push(token.lexeme);
        break;
      }
      case "NUMBER":
      case "STRING": {
        output.push(token.literal);
        break;
      }
      case "LEFT_PAREN": {
        output.push("(group");
        stacks.push(token);

        // Find the matching right paren
        const rightIndex = tokens.slice(i).findIndex((token) => {
          return token.type === "RIGHT_PAREN";
        });

        if (rightIndex === -1) {
          throw new Error("Expect ')' after expression.");
        }
        break;
      }
      case "RIGHT_PAREN": {
        if (stacks.length === 0) {
          throw new Error("Unexpected ')'");
        }

        stacks.pop();

        const val = output.pop() + ")";
        output.push(val);
        break;
      }
      case "MINUS": {
        const rest = parse(tokens.slice(i + 1), { stacks });
        output.push(`(- ${rest.join(" ")})`);
        break loop;
      }
      case "BANG": {
        const rest = parse(tokens.slice(i + 1), { stacks });
        output.push(`(! ${rest.join(" ")})`);
        break loop;
      }
    }
  }

  return output;
}

switch (command) {
  case "tokenize":
    {
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
    }
    break;
  case "parse":
    const output = parse(
      tokenize(fileContent).filter((token) => !(token instanceof Error))
    );

    console.log(output.join(" "));
    break;
  default: {
    console.error(`Usage: Unknown command: ${command}`);
    process.exit(1);
  }
}

function isNumber(char) {
  return typeof char === "string" && /[0-9]/.test(char);
}