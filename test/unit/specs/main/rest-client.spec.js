import sinon from 'sinon';
import nock from 'nock';
import RestClient from '../../../../src/main/rest-client';

describe('RestClient', () => {
  describe('#send', () => {
    let subject;

    beforeEach(() => {
      subject = new RestClient();
    });

    afterEach(() => {
      sinon.restore();
    });

    it('should dispatch a http request', async () => {
      nock('https://httpbin.org')
        .get('/anything')
        .reply(200, {});

      await subject.send({ url: 'https://httpbin.org/anything' });

      expect(nock.isDone()).to.equal(true);
    });
    it('should return the response object', async () => {
      nock('https://httpbin.org')
        .get('/anything')
        .reply(200, {});

      const response = await subject.send({ url: 'https://httpbin.org/anything' });

      expect(response).to.deep.include({
        headers: { 'content-type': 'application/json' },
        body: '{}',
        statusCode: 200
      });

      expect(response).to.have.property('timings');
      expect(response).to.have.property('request');
    });
    context('when the request times out', () => {
      it('should throw an error', async () => {
        nock('https://httpbin.org')
          .get('/anything')
          .replyWithError({ code: 'ECONNABORTED', message: 'Request timed out' });

        try {
          await subject.send({ url: 'https://httpbin.org/anything' });
        } catch (error) {
          expect(error.message).to.equal('Request timed out');
        }
      });
    });
    it('should have a user agent header by default', async () => {
      nock('https://httpbin.org')
        .get('/anything')
        .reply(200, {});

      const response = await subject.send({ url: 'https://httpbin.org/anything' });

      const { version } = require('../../../../package');

      expect(response.request.headers).to.have.property('user-agent', `RequestRocket/${version}`);
    });
    it('should not have any headers by default besides common', async () => {
      nock('https://httpbin.org')
        .get('/anything')
        .reply(200, {});

      const response = await subject.send({ url: 'https://httpbin.org/anything' });

      const requestHeaders = response.request.headers;

      delete requestHeaders['user-agent'];

      expect(requestHeaders).to.eql({});
    });
    it('should keep response body as string', async () => {
      nock('https://httpbin.org')
        .get('/anything')
        .reply(200, {});

      const response = await subject.send({ url: 'https://httpbin.org/anything' });

      expect(response.body).to.equal('{}');
    });
  });
});
