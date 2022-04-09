import { promises as fs } from 'fs';
import { dialog } from 'electron'; // eslint-disable-line import/no-extraneous-dependencies
import FileSaveResult from './file-save-result';

export default class FileHandler {
  constructor(payload) {
    this.payload = payload;
  }

  async save() {
    const saveResult = await dialog.showSaveDialog({ defaultPath: 'requestConfig.rrc' });
    if (saveResult.canceled) {
      return FileSaveResult.fromCancelled();
    }
    try {
      await fs.writeFile(saveResult.filePath, this.payload, 'utf8');
      return FileSaveResult.fromSuccess(saveResult.filePath);
    } catch (error) {
      return FileSaveResult.fromError(saveResult.filePath, error);
    }
  }
}
