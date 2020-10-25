function findAttributePossibleValues(attributeIndex: number, table: string[][]): Set<string> {
    let uniqueValues = new Set<string>();
    table.forEach(line => uniqueValues.add(line[attributeIndex]));
    return uniqueValues;
}

function attributeValuePossibility(attributeIndex: number, value: string, table: string[][]): number {
    let valueCount = 0;
    table.forEach(line => {
        if (line[attributeIndex] === value) {
            valueCount += 1;
        }
    })
    return valueCount / table.length;
}

function calcTableInfo(table: string[][], searchAttrIndex: number): number {
    let result = 0;
    let attributePossibleValues = findAttributePossibleValues(searchAttrIndex, table);
    attributePossibleValues.forEach(value => {
        let attrPossibility = attributeValuePossibility(searchAttrIndex, value, table);
        result += attrPossibility * Math.log2(attrPossibility);
    })
    return -result;
}

function divideTable(attrIndex: number, table: string[][]): string[][][] {
    let tables: { [attributeValue: string]: string[][] } = {};
    table.forEach(line => {
        let attrValue = line[attrIndex];
        if (tables[attrValue] === undefined) tables[attrValue] = [];
        tables[attrValue].push(line);
    })
    return Object.values(tables);
}

function calcAttributeTableInfo(attrIndex: number, table: string[][], searchAttrIndex: number): number {
    let result = 0;
    let dividedTables = divideTable(attrIndex, table);
    dividedTables.forEach(dividedTable => {
        result += (dividedTable.length / table.length) * calcTableInfo(dividedTable, searchAttrIndex);
    })
    return result;
}

function calcGain(attributeIndex: number, table: string[][], searchAttrIndex: number): number {
    return calcTableInfo(table, searchAttrIndex) - calcAttributeTableInfo(attributeIndex, table, searchAttrIndex);
}

function isMonoTable(table: string[][], searchAttrIndex: number): boolean {
    let firstValue = table[0][searchAttrIndex];
    for (let i = 1; i < table.length; ++i) {
        if (table[i][searchAttrIndex] != firstValue) {
            return false;
        }
    }
    return true;
}

function generateProductionRules(tableHeader: string[], table: string[][], 
    searchAttrIndex: number, usedAttrIndexes: number[] = []): RuleBase {
    let gains = [];
    for (let i = 0; i < tableHeader.length; ++i) {
        gains.push(calcGain(i, table, searchAttrIndex));
    }

    let maxGainIndex = null;
    for (let i = 0; i < gains.length; ++i) {
        if (!usedAttrIndexes.includes(i) && i !== searchAttrIndex) {
            maxGainIndex = i;
            break;
        }
    }

    if (maxGainIndex === null) return [];

    for (let i = 0; i < gains.length; ++i) {
        if (gains[i] > gains[maxGainIndex] && !usedAttrIndexes.includes(i) 
            && i !== searchAttrIndex) {
            maxGainIndex = i;
        } 
    }

    let attrIndexToDivide = maxGainIndex;
    let dividedTables = divideTable(attrIndexToDivide, table);

    let ruleBase: RuleBase = [];

    dividedTables.forEach(dividedTable => {
        if (isMonoTable(dividedTable, searchAttrIndex)) {
            let decision = dividedTable[0][searchAttrIndex];
            let attrsToStringify = [...usedAttrIndexes];
            attrsToStringify.push(attrIndexToDivide);

            let facts = {};
            attrsToStringify.forEach(index => {
                facts[tableHeader[index]] = dividedTable[0][index];
            })
            ruleBase.push([tableHeader[searchAttrIndex], decision, facts]);
        }
    })

    dividedTables.forEach(dividedTable => {
        if (!isMonoTable(dividedTable, searchAttrIndex)) {
            let newUsedAttrIndexes = [...usedAttrIndexes];
            newUsedAttrIndexes.push(attrIndexToDivide);
            ruleBase = ruleBase.concat(generateProductionRules(tableHeader,
                dividedTable, searchAttrIndex, newUsedAttrIndexes));
        }
    })

    return ruleBase;
}

type Attribute = string;
type Value = string;
type Conditions = { [attribute: string]: Value };
type RuleBase = [Attribute, Value, Conditions][];

export default generateProductionRules;

function _printRuleBase(ruleBase: RuleBase) {
    ruleBase.forEach(rule => {
        let strfiedAttrs = Object.keys(rule[2]).map(fact => `${fact} = ${rule[2][fact]}`);
        let strfiedAttrsStr = strfiedAttrs.join(' и ');
        console.log(`Если ${strfiedAttrsStr}, то ${rule[0]} = ${rule[1]}`);
    })
}

// const tableHeader = ["PHP разработчик", "тип приложения", "язык программирования", "фреймворк"];
// const table = [
//     ["нужен", "веб-сервис", "PHP", "не используется"],
//     ["нужен", "веб-сервис", "PHP", "Laravel"],
//     ["нужен", "веб-сервис", "PHP", "Yii"],
//     ["не нужен", "веб-сервис", "JavaScript", "не используется"],
//     ["не нужен", "веб-сервис", "JavaScript", "Express"],
//     ["не нужен", "драйвер устройства", "C++", "не используется"],
//     ["не нужен", "игра", "С++", "не используется"],
//     ["не нужен", "игра", "С++", "Qt"],
//     ["не нужен", "мобильное приложение", "С++", "не используется"],
//     ["не нужен", "мобильное приложение", "С++", "Qt"]
// ];

// let ruleBase = generateProductionRules(tableHeader, table, 3);
// _printRuleBase(ruleBase);