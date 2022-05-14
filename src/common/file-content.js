import { clone } from 'ramda';
import { initialState } from '../renderer/store';

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

  static isCompatibleFile(rawFileContent) {
    const parsedContent = JSON.parse(rawFileContent);
    return parsedContent.version <= CURRENT_VERSION;
  }

  static fromJson(rawFileContent) {
    const parsedContent = JSON.parse(rawFileContent);
    const newState = clone(initialState);
    newState.request.method = parsedContent.method;
    newState.request.url = parsedContent.url;
    newState.request.headers = this.mapHeaders(parsedContent.headers);
    newState.request.body = parsedContent.body;
    newState.request.contentType = parsedContent.contentType;
    newState.auth.selected = parsedContent.auth.type;
    newState.auth.params = {
      key: parsedContent.auth.params.key,
      credentialScope: parsedContent.auth.params.credentialScope
    };
    return newState;
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
