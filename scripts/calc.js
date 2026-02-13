// Simple math expression parser
function calcResult() {
    let resultField = document.getElementById("result");
    let expr = resultField.value;
    try {
        resultField.value = parseMath(expr);
    } catch (e) {
        resultField.value = "Error";
    }
}

function parseMath(expr) {
    // Remove spaces
    expr = expr.replace(/\s+/g, "");
    // Tokenize
    let tokens = tokenize(expr);
    // Parse
    let ast = parseExpression(tokens);
    // Evaluate
    return ast;
}

function tokenize(expr) {
    // Match numbers, parentheses, and operators including '**'
    let regex = /\d*\.?\d+|\*\*|[()+\-*/^]/g;
    let tokens = [];
    let match;
    while ((match = regex.exec(expr)) !== null) {
        tokens.push(match[0]);
    }
    return tokens;
}

// Recursive descent parser
function parseExpression(tokens) {
    let i = 0;
    function parseFactor() {
        let token = tokens[i];
        if (token === '(') {
            i++;
            let val = parseAddSub();
            if (tokens[i] !== ')') throw new Error('Mismatched parentheses');
            i++;
            return val;
        } else if (/^\d*\.?\d+$/.test(token)) {
            i++;
            return parseFloat(token);
        } else {
            throw new Error('Unexpected token: ' + token);
        }
    }
    function parsePow() {
        let left = parseFactor();
        while (tokens[i] === '^' || tokens[i] === '**') {
            let op = tokens[i++];
            left = Math.pow(left, parseFactor());
        }
        return left;
    }
    function parseMulDiv() {
        let left = parsePow();
        while (tokens[i] === '*' || tokens[i] === '/') {
            let op = tokens[i++];
            let right = parsePow();
            if (op === '*') left *= right;
            else left /= right;
        }
        return left;
    }
    function parseAddSub() {
        let left = parseMulDiv();
        while (tokens[i] === '+' || tokens[i] === '-') {
            let op = tokens[i++];
            let right = parseMulDiv();
            if (op === '+') left += right;
            else left -= right;
        }
        return left;
    }
    let result = parseAddSub();
    if (i < tokens.length) throw new Error('Unexpected token at end');
    return result;
}