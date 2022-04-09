export default class FileSaveResult {
  constructor(filePath, cancelled, error) {
    this.filePath = filePath;
    this.cancelled = cancelled;
    this.error = error;
  }

  static fromError(filePath, error) {
    return new FileSaveResult(filePath, false, error);
  }

  static fromCancelled() {
    return new FileSaveResult(null, true, null);
  }

  static fromSuccess(filePath) {
    return new FileSaveResult(filePath, false, null);
  }
}
