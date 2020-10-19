import { remote } from 'electron' 
import * as fs from 'fs' 

const dialog = remote.dialog;

const appFilesFilters = [{
    extensions: ['gph'],
    name: 'graph'
}];

export function save(file: string, contents: string) {
    fs.writeFileSync(file, contents);
}

/**
 * If saving was cancelled, returns an empty string.
 */
export async function saveAs(contents: string): Promise<string> {
    const file = await dialog.showSaveDialog({
        defaultPath: 'new-graph',
        filters: appFilesFilters
    });

    if (!file) return '';

    save(file.filePath, contents);
    return file.filePath;
}

/**
 * If opening was cancelled, returns null.
 */
export async function open(): Promise<{
    file: string,
    contents: string
} | null> {
    const files = await dialog.showOpenDialog({
        filters: appFilesFilters,
        properties: [
            'openFile'
        ]
    });

    if (!files.filePaths.length) return null;

    return {
        file: files[0],
        contents: fs.readFileSync(files[0]).toString()
    };
}