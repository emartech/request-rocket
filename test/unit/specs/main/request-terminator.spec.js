import sinon from 'sinon';
import RequestTerminator from '../../../../src/main/request-terminator';

describe('RequestTerminator', () => {
  let subject;

  beforeEach(() => {
    subject = new RequestTerminator();
  });

  describe('#terminate', () => {
    it('should call abort on the belonging request', () => {
      const request = { abort() {} };
      const spy = sinon.spy(request, 'abort');

      subject.add('my-unique-request-id', request);
      subject.terminate('my-unique-request-id');

      assert(spy.calledOnce);
    });

    context('when the request could not be found', () => {
      it('should do nothing', () => {
        expect(subject.terminate('unknown-request-id')).to.not.throw; // eslint-disable-line
      });
    });
  });

  describe('#remove', () => {
    it('should remove the request object from the inventory', () => {
      const request = { abort() {} };
      const spy = sinon.spy(request, 'abort');

      subject.add('my-unique-request-id', request);
      subject.remove('my-unique-request-id');
      subject.terminate('my-unique-request-id');

      assert(spy.notCalled);
    });
  });
});
