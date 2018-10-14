import axios from 'axios';
import sinon from 'sinon';
import RestClient from '../../../../src/main/rest-client';

describe('RestClient', () => {
  describe('#send', () => {
    let subject;
    let axiosStub;

    beforeEach(() => {
      axiosStub = sinon.stub();
      sinon.stub(axios, 'create').returns(axiosStub);

      subject = new RestClient();
    });

    afterEach(() => {
      sinon.restore();
    });

    it('should dispatch a http request using Axios', async () => {
      await subject.send({ url: 'https://httpbin.org/anything' });

      expect(axiosStub).to.be.calledWith({ url: 'https://httpbin.org/anything' });
    });
    it('should return the response object', async () => {
      const response = { status: 200 };
      axiosStub.resolves(response);

      expect(await subject.send({})).to.eql(response);
    });
    context('when an unexpected error occurs', () => {
      it('should indicate unexpected error', async () => {
        axiosStub.throws(new Error('some unknown error'));

        try {
          await subject.send({});
        } catch (error) {
          expect(error.message).to.eql('Unexpected error occurred');
        }
      });
    });
    context('when the request results in an error', () => {
      it('should return the error response', async () => {
        axiosStub.rejects({ response: { status: 404 } });

        expect(await subject.send({})).to.eql({ status: 404 });
      });
    });
    context('when the request times out', () => {
      it('should throw an error', async () => {
        axiosStub.rejects({ code: 'ECONNABORTED', message: 'request timed out' });

        try {
          await subject.send({});
        } catch (error) {
          expect(error.message).to.eql('request timed out');
        }
      });
    });
  });
});
