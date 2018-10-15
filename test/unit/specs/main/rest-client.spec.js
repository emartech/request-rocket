import axios from 'axios';
import sinon from 'sinon';
import RestClient from '../../../../src/main/rest-client';

describe('RestClient', () => {
  describe('#send', () => {
    let subject;
    let axiosRequest;

    beforeEach(() => {
      axiosRequest = sinon.stub(axios.Axios.prototype, 'request');

      subject = new RestClient();
    });

    afterEach(() => {
      sinon.restore();
    });

    it('should dispatch a http request using Axios', async () => {
      await subject.send({ url: 'https://httpbin.org/anything' });

      expect(axiosRequest).to.be.calledWith({ url: 'https://httpbin.org/anything' });
    });
    it('should return the response object', async () => {
      const response = { status: 200 };
      axiosRequest.resolves(response);

      expect(await subject.send({})).to.eql(response);
    });
    context('when an unexpected error occurs', () => {
      it('should indicate unexpected error', async () => {
        axiosRequest.throws(new Error('some unknown error'));

        try {
          await subject.send({});
        } catch (error) {
          expect(error.message).to.eql('Unexpected error occurred');
        }
      });
    });
    context('when the request results in an error', () => {
      it('should return the error response', async () => {
        axiosRequest.rejects({ response: { status: 404 } });

        expect(await subject.send({})).to.eql({ status: 404 });
      });
    });
    context('when the request times out', () => {
      it('should throw an error', async () => {
        axiosRequest.rejects({ code: 'ECONNABORTED', message: 'request timed out' });

        try {
          await subject.send({});
        } catch (error) {
          expect(error.message).to.eql('Request timed out');
        }
      });
    });
  });
});
