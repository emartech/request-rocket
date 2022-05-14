export default class FileLoadResult {
  constructor(rawFileContent, cancelled, error) {
    this.rawFileContent = rawFileContent;
    this.cancelled = cancelled;
    this.error = error;
  }

  static fromError(error) {
    return new FileLoadResult(null, false, error);
  }

  static fromCancelled() {
    return new FileLoadResult(null, true, null);
  }

  static fromSuccess(rawFileContent) {
    return new FileLoadResult(rawFileContent, false, null);
  }
}
