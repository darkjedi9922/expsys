export function generateRandomString(length: number): string {
    return Math.random().toString(36).substring(length + 1);
}

let index = 0;
export function getUniqueIndex(): number {
    return index++;
}