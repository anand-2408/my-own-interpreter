const fs = require('fs');

let exitCode = 0;

class TOKEN_TYPE {
    static NONE = -2;
    static EOF = -1;
    static STRING = 0;
    static NUMBER = 1;
    static IDENTIFIER = 2;
    static LEFT_PAREN = 3;
    static RIGHT_PAREN = 4;
    static LEFT_BRACE = 5;
    static RIGHT_BRACE = 6;
    static COMMA = 7;
    static DOT = 8;
    static MINUS = 9;
    static PLUS = 10;
    static SEMICOLON = 11;
    static STAR = 12;
    static SLASH = 13;
    static EQUAL_EQUAL = 14;
    static EQUAL = 15;
    static BANG_EQUAL = 16;
    static BANG = 17;
    static LESS_EQUAL = 18;
    static LESS = 19;
    static GREATER_EQUAL = 20;
    static GREATER = 21;
    static AND = 22;
    static OR = 23;
    static IF = 24;
    static ELSE = 25;
    static FOR = 26;
    static WHILE = 27;
    static TRUE = 28;
    static FALSE = 29;
    static CLASS = 30;
    static SUPER = 31;
    static THIS = 32;
    static VAR = 33;
    static FUN = 34;
    static RETURN = 35;
    static PRINT = 36;
    static NIL = 37;
}

class Token {
    constructor(type, name, value) {
        this.type = type;
        this.name = name;
        this.value = value;
    }

    toString() {
        return `${TOKEN_TYPE[this.type]} ${this.name} ${this.value}`;
    }

    toJSON() {
        return this.toString();
    }
}

class Lexer {
    constructor(program) {
        this.program = program;
        this.size = program.length;
        this.i = 0;
        this.c = this.size > 0 ? this.program[this.i] : '';
        this.line = 1;
    }

    advance() {
        this.i++;
        if (this.i < this.size) {
            this.c = this.program[this.i];
        }
    }

    advanceWith(token) {
        this.advance();
        return token;
    }

    skipWhitespace() {
        while (this.i < this.size && this.c.match(/\s/)) {
            if (this.c === '\n') {
                this.line++;
            }
            this.advance();
        }
    }

    nextToken() {
        this.skipWhitespace();
        if (this.i >= this.size) {
            return new Token(TOKEN_TYPE.EOF, "", "null");
        }

        switch (this.c) {
            case '(':
                return this.advanceWith(new Token(TOKEN_TYPE.LEFT_PAREN, '(', 'null'));
            case ')':
                return this.advanceWith(new Token(TOKEN_TYPE.RIGHT_PAREN, ')', 'null'));
            case '{':
                return this.advanceWith(new Token(TOKEN_TYPE.LEFT_BRACE, '{', 'null'));
            case '}':
                return this.advanceWith(new Token(TOKEN_TYPE.RIGHT_BRACE, '}', 'null'));
            case ',':
                return this.advanceWith(new Token(TOKEN_TYPE.COMMA, ',', 'null'));
            case '.':
                return this.advanceWith(new Token(TOKEN_TYPE.DOT, '.', 'null'));
            case '-':
                return this.advanceWith(new Token(TOKEN_TYPE.MINUS, '-', 'null'));
            case '+':
                return this.advanceWith(new Token(TOKEN_TYPE.PLUS, '+', 'null'));
            case ';':
                return this.advanceWith(new Token(TOKEN_TYPE.SEMICOLON, ';', 'null'));
            case '*':
                return this.advanceWith(new Token(TOKEN_TYPE.STAR, '*', 'null'));
            case '/':
                this.advance();
                return this.c === '/' ? this.skipComment() : new Token(TOKEN_TYPE.SLASH, '/', 'null');
            case '=':
                return this.advanceWith(new Token(TOKEN_TYPE.EQUAL, '=', 'null'));
            case '!':
                return this.advanceWith(new Token(TOKEN_TYPE.BANG, '!', 'null'));
            case '<':
                return this.advanceWith(new Token(TOKEN_TYPE.LESS, '<', 'null'));
            case '>':
                return this.advanceWith(new Token(TOKEN_TYPE.GREATER, '>', 'null'));
            case '"':
                return this.nextString();
            default:
                if (this.c.match(/[a-zA-Z_]/)) {
                    return this.nextId();
                } else if (this.c.match(/[0-9]/)) {
                    return this.nextNumber();
                }
                console.error(`[line ${this.line}] Error: Unexpected character: ${this.c}`);
                exitCode = 65;
                return this.advanceWith(new Token(TOKEN_TYPE.NONE, "", ""));
        }
    }

    skipComment() {
        while (this.i < this.size && this.c !== '\n') {
            this.advance();
        }
        return new Token(TOKEN_TYPE.NONE, "", "");
    }

    nextString() {
        let s = '';
        this.advance(); // Skip opening quote
        while (this.c !== '"' && this.i < this.size) {
            s += this.c;
            this.advance();
        }
        if (this.i >= this.size) {
            console.error(`[line ${this.line}] Error: Unterminated string.`);
            exitCode = 65;
            return new Token(TOKEN_TYPE.NONE, "", "");
        }
        return this.advanceWith(new Token(TOKEN_TYPE.STRING, `"${s}"`, s));
    }

    nextNumber() {
        let n = '';
        let dot = false;
        while (this.i < this.size) {
            if (this.c === '.') {
                if (dot) break;
                dot = true;
            } else if (!this.c.match(/[0-9]/)) {
                break;
            }
            n += this.c;
            this.advance();
        }
        return new Token(TOKEN_TYPE.NUMBER, n, parseFloat(n));
    }

    nextId() {
        let id = '';
        while (this.i < this.size && (this.c.match(/[a-zA-Z0-9_]/))) {
            id += this.c;
            this.advance();
        }

        const keywords = {
            and: TOKEN_TYPE.AND,
            or: TOKEN_TYPE.OR,
            if: TOKEN_TYPE.IF,
            else: TOKEN_TYPE.ELSE,
            for: TOKEN_TYPE.FOR,
            while: TOKEN_TYPE.WHILE,
            true: TOKEN_TYPE.TRUE,
            false: TOKEN_TYPE.FALSE,
            class: TOKEN_TYPE.CLASS,
            super: TOKEN_TYPE.SUPER,
            this: TOKEN_TYPE.THIS,
            var: TOKEN_TYPE.VAR,
            fun: TOKEN_TYPE.FUN,
            return: TOKEN_TYPE.RETURN,
            print: TOKEN_TYPE.PRINT,
            nil: TOKEN_TYPE.NIL,
        };
        
        return new Token(keywords[id] || TOKEN_TYPE.IDENTIFIER, id, 'null');
    }
}

class Parser {
    constructor(tokens) {
        this.tokens = tokens;
        this.current = 0;
    }

    parse() {
        return this.expression();
    }

    expression() {
        return this.equality();
    }

    equality() {
        let expr = this.comparison();
        while (this.match(TOKEN_TYPE.BANG_EQUAL, TOKEN_TYPE.EQUAL_EQUAL)) {
            const operator = this.previous();
            const right = this.comparison();
            expr = { type: 'Binary', left: expr, operator: operator, right: right };
        }
        return expr;
    }

    match(...types) {
        for (const type of types) {
            if (this.check(type)) {
                this.advance();
                return true;
            }
        }
        return false;
    }

    check(tokenType) {
        if (this.isAtEnd()) return false;
        return this.peek().type === tokenType;
    }

    isAtEnd() {
        return this.peek().type === TOKEN_TYPE.EOF;
    }

    peek() {
        return this.tokens[this.current];
    }

    advance() {
        if (!this.isAtEnd()) {
            this.current++;
        }
        return this.previous();
    }

    previous() {
        return this.tokens[this.current - 1];
    }

    comparison() {
        let expr = this.term();
        while (this.match(TOKEN_TYPE.GREATER, TOKEN_TYPE.GREATER_EQUAL, TOKEN_TYPE.LESS, TOKEN_TYPE.LESS_EQUAL)) {
            const operator = this.previous();
            const right = this.term();
            expr = { type: 'Binary', left: expr, operator: operator, right: right };
        }
        return expr;
    }

    term() {
        let expr = this.factor();
        while (this.match(TOKEN_TYPE.MINUS, TOKEN_TYPE.PLUS)) {
            const operator = this.previous();
            const right = this.factor();
            expr = { type: 'Binary', left: expr, operator: operator, right: right };
        }
        return expr;
    }

    factor() {
        let expr = this.unary();
        while (this.match(TOKEN_TYPE.SLASH, TOKEN_TYPE.STAR)) {
            const operator = this.previous();
            const right = this.unary();
            expr = { type: 'Binary', left: expr, operator: operator, right: right };
        }
        return expr;
    }

    unary() {
        if (this.match(TOKEN_TYPE.BANG, TOKEN_TYPE.MINUS)) {
            const operator = this.previous();
            const right = this.unary();
            return { type: 'Unary', operator: operator, right: right };
        }
        return this.primary();
    }

    primary() {
        if (this.match(TOKEN_TYPE.FALSE)) return { type: 'Literal', value: false };
        if (this.match(TOKEN_TYPE.TRUE)) return { type: 'Literal', value: true };
        if (this.match(TOKEN_TYPE.NIL)) return { type: 'Literal', value: null };
        if (this.match(TOKEN_TYPE.PRINT)) return { type: 'Literal', value: 'print' };
        if (this.match(TOKEN_TYPE.NUMBER, TOKEN_TYPE.STRING)) {
            return { type: 'Literal', value: this.previous().value };
        }
        if (this.match(TOKEN_TYPE.LEFT_PAREN)) {
            const expr = this.expression();
            this.consume(TOKEN_TYPE.RIGHT_PAREN, "Expect ')' after expression.");
            return { type: 'Grouping', expression: expr };
        }
        return null; // Add appropriate error handling if needed
    }

    consume(tokenType, message) {
        if (this.check(tokenType)) {
            return this.advance();
        }
        console.error(message);
        exitCode = 65;
        return null; // Or handle the error as appropriate
    }
}

function main() {
    console.error("Logs from your program will appear here!");

    if (process.argv.length < 4) {
        console.error("Usage: node your_program.js tokenize <filename>");
        process.exit(1);
    }

    const command = process.argv[2];
    const filename = process.argv[3];
    const commands = ["tokenize", "parse"];

    if (!commands.includes(command)) {
        console.error(`Unknown command: ${command}`);
        process.exit(1);
    }

    const fileContents = fs.readFileSync(filename, 'utf-8');

    if (command === "tokenize") {
        const lex = new Lexer(fileContents);
        let token = new Token(TOKEN_TYPE.NONE, "", "");
        while (token.type !== TOKEN_TYPE.EOF) {
            token = lex.nextToken();
            if (token.type !== TOKEN_TYPE.NONE) {
                console.log(token.toString());
            }
        }
    } else if (command === "parse") {
        const lex = new Lexer(fileContents);
        const tokens = [];
        while (lex.i < lex.size) {
            tokens.push(lex.nextToken());
        }
        const par = new Parser(tokens);
        const expression = par.parse();
        console.log(JSON.stringify(expression, null, 2));
    }

    process.exit(exitCode);
}

if (require.main === module) {
    main();
}
