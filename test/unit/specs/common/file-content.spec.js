import { dissocPath } from 'ramda';
import FileContent from '../../../../src/common/file-content';

const FILE_CONTENT = JSON.stringify({
  version: 1,
  method: 'POST',
  url: 'http://retek.hu',
  headers: [
    {
      name: 'header',
      value: 'value',
      sendingStatus: false
    },
    {
      name: 'content-type',
      value: 'application/json',
      sendingStatus: true
    }
  ],
  body: 'body',
  contentType: 'application/json',
  auth: {
    type: 'ESCHER',
    params: {
      key: 'key',
      credentialScope: 'scope'
    }
  }
});

const STATE = {
  errors: [],
  validatorErrors: [],
  request: {
    method: 'POST',
    url: 'http://retek.hu',
    headers: [
      { name: 'header', value: 'value', sendingStatus: false },
      {
        name: 'content-type',
        value: 'application/json',
        sendingStatus: true
      }
    ],
    body: 'body',
    contentType: 'application/json'
  },
  auth: {
    selected: 'ESCHER',
    params: { key: 'key', secret: 'secret', credentialScope: 'scope' }
  },
  uuid: null,
  response: {},
  sentRequestHeaders: null,
  sendingInProgress: false,
  infoMessage: ''
};

describe('toJson', () => {
  it('discards authentication secret', () => {
    const result = FileContent.toJson(STATE);
    expect(result.includes('secret')).to.eql(false);
  });

  it('adds version field', () => {
    const result = FileContent.toJson(STATE);
    expect(result.includes('"version":1')).to.eql(true);
  });

  it('maps all relevant fields to json ', () => {
    const result = FileContent.toJson(STATE);
    expect(FILE_CONTENT).to.eql(result);
  });
});

describe('isCompatibleFile', () => {
  it('returns false when file version is larger than current version', () => {
    const fileContent = JSON.stringify({ version: 666 });
    const result = FileContent.isCompatibleFile(fileContent);
    expect(result).to.eql(false);
  });

  it('returns true when file version equals current version', () => {
    const fileContent = JSON.stringify({ version: 1 });
    const result = FileContent.isCompatibleFile(fileContent);
    expect(result).to.eql(true);
  });

  it('returns true when file version is smaller than current version', () => {
    const fileContent = JSON.stringify({ version: 0 });
    const result = FileContent.isCompatibleFile(fileContent);
    expect(result).to.eql(true);
  });
});

describe('fromJson', () => {
  it('maps all relevant fields from json ', () => {
    const result = FileContent.fromJson(FILE_CONTENT);
    const stateWithNoSecret = dissocPath(['auth', 'params', 'secret'], STATE);
    expect(result).to.eql(stateWithNoSecret);
  });
});
