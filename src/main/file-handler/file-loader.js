import { promises as fs } from 'fs';
import { dialog } from 'electron'; // eslint-disable-line import/no-extraneous-dependencies
import FileLoadResult from './file-load-result';

export default class FileLoader {
  static async load() {
    const result = await dialog.showOpenDialog({});
    if (result.canceled) {
      return FileLoadResult.fromCancelled();
    }
    const rawFileContent = await fs.readFile(result.filePaths[0], 'utf8');
    return FileLoadResult.fromSuccess(rawFileContent);
  }
}
