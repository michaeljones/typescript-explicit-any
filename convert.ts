

import fs = require('fs');


const errors = fs.readFileSync('errors.output', {encoding: 'utf8'}).split('\n');
const code = fs.readFileSync('location.ts', {encoding: 'utf8'}).split('\n');

const errorPos = errors.map(error => {
    const result = error.match(/.*\((.*),(.*)\)/);

    if (!result) {
        return;
    }

    console.log(result);

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

console.log(errorPos);

function findVariableLength(str) {
    for (let i=0; i<str.length; ++i) {
        if (!str[i].match(/[a-zA-Z1-9_]/)) {
            return i;
        }
    }
}

errorPos.forEach(pos => {
    const line = code[pos.line - 1];
    const variableLength = findVariableLength(line.slice(pos.character));
    code[pos.line - 1] = line.slice(0, pos.character + variableLength) + ": any" + line.slice(pos.character + variableLength);
});

// console.log(code);

const output = code.join('\n');

console.log(output);

