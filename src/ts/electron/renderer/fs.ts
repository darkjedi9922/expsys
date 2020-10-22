import { remote } from 'electron' 

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
    return files[0];
}