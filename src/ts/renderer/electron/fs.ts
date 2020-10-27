const { remote } = window.require('electron'); 
const fs = window.require('fs');

const dialog = remote.dialog;

/**
 * If opening was cancelled, returns null.
 */
export async function open(extFilter: string[] = []): Promise<string | null> {
    const files = await dialog.showOpenDialog({
        filters: [{
            name: 'extensions',
            extensions: extFilter
        }],
        properties: ['openFile']
    });

    if (!files.filePaths.length) return null;
    return files.filePaths[0];
}

export async function readFile(file: string): Promise<string> {
    return fs.readFileSync(file).toString();
}