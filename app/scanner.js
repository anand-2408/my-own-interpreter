class Scanner {
    constructor(source) {
        this.source = source;
        this.current = 0;
        this.line = 1;
        this.tokens = [];
    }

    scanTokens() {
        while (!this.isAtEnd()) {
            this.start = this.current;
            this.scanToken();
        }

        this.tokens.push(new Token(TokenType.EOF, "", null));
        return this.tokens;
    }

    scanToken() {
        const c = this.advance();

        switch (c) {
            case '(':
                this.addToken(TokenType.LEFT_PAREN, '(');
                break;
            case ')':
                this.addToken(TokenType.RIGHT_PAREN, ')');
                break;
            // ... other cases for symbols
            default:
                if (this.isDigit(c)) {
                    this.number();
                } else if (this.isAlpha(c)) {
                    this.identifier();
                } else {
                    this.error(this.line, "Unexpected character.");
                }
                break;
        }
    }

    // ... other methods like isDigit, isAlpha, advance, peek, addToken, error
}