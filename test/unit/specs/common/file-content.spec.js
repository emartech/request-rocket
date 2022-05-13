import FileContent from '../../../../src/common/file-content';

const STATE = {
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
  }
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
    const expectedFileContent = {
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
    };

    const result = FileContent.toJson(STATE);
    expect(JSON.stringify(expectedFileContent)).to.eql(result);
  });
});
