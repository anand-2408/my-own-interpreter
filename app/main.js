import fs from "fs";
const args = process.argv.slice(2); // Skip the first two arguments (node path and script path)
if (args.length < 2) {
  console.error("Usage: ./your_program.sh tokenize <filename>");
  process.exit(1);
}
const command = args[0];
if (command !== "tokenize") {
  console.error(`Usage: Unknown command: ${command}`);
  process.exit(1);
}
const filename = args[1];
const fileContent = fs.readFileSync(filename, "utf8");
if (fileContent.length !== 0) {
  const lines = fileContent.split(/\n/);
  let gotError = false;
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
          console.log("LEFT_PAREN ( null");
          break;
        case ")":
          console.log("RIGHT_PAREN ) null");
          break;
        case "{":
          console.log("LEFT_BRACE { null");
          break;
        case "}":
          console.log("RIGHT_BRACE } null");
          break;
        case ",":
          console.log("COMMA , null");
          break;
        case ".":
          console.log("DOT . null");
          break;
        case "-":
          console.log("MINUS - null");
          break;
        case "+":
          console.log("PLUS + null");
          break;
        case ";":
          console.log("SEMICOLON ; null");
          break;
        case "*":
          console.log("STAR * null");
          break;
        case "=":
          if (nextChar === "=") {
            console.log("EQUAL_EQUAL == null");
            columnIndex++;
          } else {
            console.log("EQUAL = null");
          }
          break;
        case "!":
          if (nextChar === "=") {
            console.log("BANG_EQUAL != null");
            columnIndex++;
          } else {
            console.log("BANG ! null");
          }
          break;
        case "<":
          if (nextChar === "=") {
            console.log("LESS_EQUAL <= null");
            columnIndex++;
          } else {
            console.log("LESS < null");
          }
          break;
        case ">":
          if (nextChar === "=") {
            console.log("GREATER_EQUAL >= null");
            columnIndex++;
          } else {
            console.log("GREATER > null");
          }
          break;
        case "/":
          if (nextChar === "/") {
            // Go to the next line
            break lineLoop;
          } else {
            console.log("SLASH / null");
          }
          break;
        case '"': {
          let str = undefined;
          for (let i = columnIndex + 1; i < line.length; i++) {
            if (line[i] === '"') {
              str = line.substring(columnIndex + 1, i);
              columnIndex = i;
              break;
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
          }
          if (typeof str === "string") {
            console.log(`STRING "${str}" ${str}`);
          } else {
            console.error(`[line ${lineNumber}] Error: Unterminated string.`);
            gotError = true;
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
          if (/[0-9]/.test(char)) {
            let numberStr = char;
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
              if (/[0-9]/.test(line[i])) {
                numberStr += line[i];
              if (line[i] === '"') {
                str = line.substring(columnIndex + 1, i);
                columnIndex = i;
              } else if (line[i] === ".") {
                if (numberStr.includes(".")) {
                  console.error(
                    `[line ${lineNumber}] Error: Unexpected character: ${line[i]}`
                  );
                  gotError = true;
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
            if (typeof str === "string") {
              tokens.push({ type: "STRING", lexeme: `"${str}"`, literal: str });
            } else {
              tokens.push(
                new Error(`[line ${lineNumber}] Error: Unterminated string.`)
              );
              break lineLoop;
            }
            console.log(
              `NUMBER ${numberStr} ${
                Number.isInteger(number) ? number + ".0" : number
              }`
            );
            break;
          }
          default:
            // SKip whitespaces
            if (/\s/.test(char)) {
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
            // Handle Number
            if (/[0-9]/.test(char)) {
              let numberStr = char;
              for (let i = columnIndex + 1; i < line.length; i++) {
                if (/[0-9]/.test(line[i])) {
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
              const number = Number(numberStr);
            if (reservedWords.includes(identifier)) {
              console.log(`${identifier.toUpperCase()} ${identifier} null`);
            } else {
              console.log(`IDENTIFIER ${identifier} null`);
              tokens.push({
                type: "NUMBER",
                lexeme: numberStr,
                literal: Number.isInteger(number) ? number + ".0" : number,
              });
              break;
            }
            break;
          }
          console.error(
            `[line ${lineNumber}] Error: Unexpected character: ${char}`
          );
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
          gotError = true;
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
 * @param {Array<Token | Error>} tokens
 */
function parse(tokens) {
  for (const token of tokens) {
    console.log(token.lexeme);
  }
}
  console.log("EOF  null");
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
  if (gotError) {
    process.exit(65);
      if (tokens.find((token) => token instanceof Error)) {
        process.exit(65);
      }
    }
    break;
  case "parse":
    parse(tokenize(fileContent));
    break;
  default: {
    console.error(`Usage: Unknown command: ${command}`);
    process.exit(1);
  }
} else {
  console.log("EOF  null");
}

