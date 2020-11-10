import { trim } from "lodash";
import { findAttributePossibleValues, Table } from "./inductor";

export function adjustTable(table: Table): Table {
    table = trimCells(table);
    let possibleValues = findAllPossibleValues(table);
    console.log(possibleValues);
    let res = table.reduce<Table>((result, line) => {
        return result.concat(replaceVariablesInRow(possibleValues, line))
    }, []);
    console.log(res);
    return res;
}

function trimCells(table: Table): Table {
    return table.map(row => row.map(value => trim(value)));
}

interface PossibleValues {
    [columnIndex: number]: string[]
}

function findAllPossibleValues(table: Table): PossibleValues {
    return table[0].reduce((result, _value, index) => ({
        ...result, [index]: Array.from(findAttributePossibleValues(index, table))
    }), {});
}

function replaceVariablesInRow(possibleValues: PossibleValues, row: string[]): Table {
    let result: Table = [];
    for (let i = 0; i < row.length; ++i) {
        if (row[i] === '$any') {
            for (let j = 0; j < possibleValues[i].length; ++j) {
                if (possibleValues[i][j] !== '$any') {
                    let newRow = [...row];
                    newRow.splice(i, 1, possibleValues[i][j]);
                    result = result.concat(replaceVariablesInRow(possibleValues, newRow));
                }
            }
            break;
        }
    }
    if (!result.length) {
        result.push(row);
    }
    return result;
}

const table = [
    ["Yes", "Yes", "$any", "$any"],
    ["No", "No", "No", "$any"],
    ["Yes", "$any", "Yes", "Many"]
];

console.log(adjustTable(table));