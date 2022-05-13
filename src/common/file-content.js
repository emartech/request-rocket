export default class FileContent {
  constructor(state) {
    this.state = state;
  }

  toJson() {
    const fileContent = {
      version: 1,
      method: this.state.request.method,
      url: this.state.request.url,
      headers: this.mapHeaders(this.state.request.headers),
      body: this.state.request.body,
      contentType: this.state.request.contentType,
      auth: {
        type: this.state.auth.selected,
        params: {
          key: this.state.auth.params.key,
          credentialScope: this.state.auth.params.credentialScope
        }
      }
    };

    return JSON.stringify(fileContent);
  }

  // eslint-disable-next-line class-methods-use-this
  mapHeaders(originalHeaders) {
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
