import FileOperationStatus from './file-operation-status';

export default class FileLoadResult {
  constructor(status, rawFileContent = null) {
    this.rawFileContent = rawFileContent;
    this.status = status;
  }

  static fromCancelled() {
    return new FileLoadResult(FileOperationStatus.CANCELLED);
  }

  static fromSuccess(rawFileContent) {
    return new FileLoadResult(FileOperationStatus.SUCCESSFUL, rawFileContent);
  }
}
