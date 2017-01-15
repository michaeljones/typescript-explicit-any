

import fs = require('fs');
import childProcess = require('child_process');


const filePath = process.argv[2];

const code = fs.readFileSync(filePath, {encoding: 'utf8'}).split('\n');

const result = childProcess.spawnSync('tsc', ['--noEmit', '--noImplicitAny', filePath]);

const errors = result.stdout.toString('utf8');

const errorCodes = [
    'TS7005',
    'TS7006',
];

const errorRegex = `(${errorCodes.join('|')})`;

const errorPos = errors
    .split('\n')
    .filter(line => line.match(errorRegex))
    .map(error => {
        const result = error.match(/.*\((.*),(.*)\)/);

        if (!result) {
            return;
        }

        const line = parseInt(result[1], 10);
        const character = parseInt(result[2], 10);

        return {line, character};
    })
    .filter(entry => entry !== undefined);

const cmpPos = (a, b) => {
    if (a.line > b.line) {
        return 1;
    }
    else if (a.line < b.line) {
        return -1;
    }
    else if (a.character > b.character) {
        return 1;
    }
    else if (a.character < b.character) {
        return -1;
    }
    return 1;
};

errorPos.sort(cmpPos).reverse();

function findVariableLength(str) {
    for (let i=0; i<str.length; ++i) {
        if (!str[i].match(/[a-zA-Z1-9_]/)) {
            return i;
        }
    }
}

function isArrowFunction(str) {
    console.log(str, Boolean(str.match(/^ *=>/)));
    return Boolean(str.match(/^ *=>/));
}

errorPos.forEach(pos => {
    const line = code[pos.line - 1];
    const variableLength = findVariableLength(line.slice(pos.character));
    const isSingleArgumentArrowFunction = isArrowFunction(line.slice(pos.character + variableLength));

    if (isSingleArgumentArrowFunction) {
        const start = line.slice(0, pos.character - 1);
        const variableName = line.slice(pos.character - 1, pos.character + variableLength);
        const rest = line.slice(pos.character + variableLength);
        code[pos.line - 1] = `${start}(${variableName}: any)${rest}`;
    }
    else {
        code[pos.line - 1] = line.slice(0, pos.character + variableLength) + ": any" + line.slice(pos.character + variableLength);
    }
});

const output = code.join('\n');

console.log(output);

