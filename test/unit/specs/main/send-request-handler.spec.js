import sinon from 'sinon';
import Handler from '../../../../src/main/send-request-handler';

describe('SendRequestHandler', () => {
  describe('handle', () => {
    it('should respond with dummy JSON', () => {
      const responseSpy = sinon.spy();
      Handler.handle({ sender: { send: responseSpy } });

      expect(responseSpy.calledWith('receive-response', { body: '{}' })).to.eql(true);
    });
  });
});
