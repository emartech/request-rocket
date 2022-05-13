const CURRENT_VERSION = 1;

export default class FileContent {
  static toJson(state) {
    const fileContent = {
      version: CURRENT_VERSION,
      method: state.request.method,
      url: state.request.url,
      headers: this.mapHeaders(state.request.headers),
      body: state.request.body,
      contentType: state.request.contentType,
      auth: {
        type: state.auth.selected,
        params: {
          key: state.auth.params.key,
          credentialScope: state.auth.params.credentialScope
        }
      }
    };

    return JSON.stringify(fileContent);
  }

  static mapHeaders(originalHeaders) {
    if (!originalHeaders) {
      return [];
    }
    return originalHeaders.map(header => ({
      name: header.name,
      value: header.value,
      sendingStatus: header.sendingStatus
    }));
  }
}
