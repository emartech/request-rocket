import sinon from 'sinon';
import { ipcRenderer } from 'electron';
import { clone } from 'ramda';
import Action from '../../../../../src/renderer/store/action-types';
import Mutation from '../../../../../src/renderer/store/mutation-types';
import Actions from '../../../../../src/renderer/store/actions';
import createStore from '../../../../../src/renderer/store';
import HttpMethod from '../../../../../src/common/method-types';
import Auth from '../../../../../src/common/auth-types';
import ContentType from '../../../../../src/common/content-types';

describe('actions', () => {
  let store;

  beforeEach(() => {
    store = createStore();
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('setNetworkStatus', () => {
    it('should update the state of the network status', () => {
      store.dispatch(Action.setNetworkStatus, 'offline');
      expect(store.state.networkStatus).to.eql('offline');
    });
  });
  describe('setUrl', () => {
    it('should modify the URL of the state', () => {
      store.dispatch(Action.setUrl, 'https://new.url');
      expect(store.state.request.url).to.eql('https://new.url');
    });
    it('should clear URL related validator errors', () => {
      store.commit(Mutation.ADD_VALIDATOR_ERROR, { type: 'url', message: 'URL cannot be empty' });
      store.commit(Mutation.ADD_VALIDATOR_ERROR, { type: 'header', message: 'Header cannot be empty' });
      store.dispatch(Action.setUrl, 'https://new.url');
      expect(store.state.validatorErrors).to.eql([{ type: 'header', message: 'Header cannot be empty' }]);
    });
  });
  describe('sendRequest', () => {
    let ipcSpy;

    beforeEach(() => {
      ipcSpy = sinon.spy(ipcRenderer, 'send');
    });

    it('should call validateForms action', () => {
      store.dispatch(Action.sendRequest);

      expect(store.state.validatorErrors).to.not.eql([]);
    });
    context('when validator errors occur', () => {
      it('should not send the request', () => {
        store.commit(Mutation.ADD_VALIDATOR_ERROR, { type: 'url', message: 'URL cannot be empty' });

        store.dispatch(Action.sendRequest);

        expect(ipcSpy.called).to.equal(false);
      });
    });
    context('when validators pass', () => {
      beforeEach(() => {
        store.commit(Mutation.UPDATE_URL, 'https://some-valid.url');
      });

      it('should send the request URL', () => {
        store.commit(Mutation.UPDATE_URL, 'https://request.url');

        store.dispatch(Action.sendRequest);

        expect(ipcSpy).to.be.calledWith('send-request', sinon.match.has('url', 'https://request.url'));
      });
      it('should clear the response data', () => {
        store.dispatch(Action.sendRequest);

        expect(store.state.response).to.eql({});
      });
      it('should send the selected authentication with the belonging params', () => {
        const authParams = { key: 'wssekey', secret: 'wssesecret' };

        store.commit(Mutation.SELECT_AUTH_TYPE, Auth.WSSE);
        store.commit(Mutation.SET_AUTH_PARAMS, authParams);

        store.dispatch(Action.sendRequest);

        expect(ipcSpy).to.be.calledWith('send-request', sinon.match({ authType: Auth.WSSE, authParams }));
      });
      it('should send the request method', () => {
        store.commit(Mutation.SELECT_HTTP_METHOD, HttpMethod.POST);

        store.dispatch(Action.sendRequest);

        expect(ipcSpy).to.be.calledWith('send-request', sinon.match.has('method', HttpMethod.POST));
      });
      [
        { method: HttpMethod.GET, expectedBody: null },
        { method: HttpMethod.HEAD, expectedBody: null },
        { method: HttpMethod.POST, expectedBody: '{"foo": "bar"}' },
        { method: HttpMethod.PUT, expectedBody: '{"foo": "bar"}' },
        { method: HttpMethod.PATCH, expectedBody: '{"foo": "bar"}' },
        { method: HttpMethod.OPTIONS, expectedBody: '{"foo": "bar"}' }
      ].forEach(({ method, expectedBody }) => {
        it(`should send the ${method} request with body ${expectedBody}`, () => {
          store.commit(Mutation.SET_REQUEST_BODY, '{"foo": "bar"}');
          store.commit(Mutation.SELECT_HTTP_METHOD, method);
          store.dispatch(Action.sendRequest);

          expect(ipcSpy).to.be.calledWith('send-request', sinon.match.has('body', expectedBody));
        });
      });

      it('should send the desired request headers', () => {
        store.commit(Mutation.SET_REQUEST_HEADERS, [
          { name: 'content-type', value: 'application/json', sendingStatus: true },
          { name: 'accept', value: '*/*', sendingStatus: false }
        ]);
        store.dispatch(Action.sendRequest);

        expect(ipcSpy).to.be.calledWith(
          'send-request',
          sinon.match.has('headers', [{ name: 'content-type', value: 'application/json', sendingStatus: true }])
        );
      });
      it('should indicate request in progress', () => {
        const commit = sinon.spy();
        const dispatch = sinon.spy();
        const { state } = store;

        Actions[Action.sendRequest]({ dispatch, commit, state });

        expect(commit).to.be.calledWithExactly(Mutation.REQUEST_IN_PROGRESS);
      });
      context('when protocol is not specified', () => {
        it('should prepend http:// to the URL', () => {
          store.commit(Mutation.UPDATE_URL, 'request.url');

          store.dispatch(Action.sendRequest);

          expect(ipcSpy).to.be.calledWith('send-request', sinon.match.has('url', 'http://request.url'));
        });
      });
    });
  });
  describe('cancelRequest', () => {
    let ipcSpy;

    beforeEach(() => {
      ipcSpy = sinon.spy(ipcRenderer, 'send');
    });

    it('should send the request URL', () => {
      store.commit(Mutation.UPDATE_URL, 'https://request.url');

      store.dispatch(Action.cancelRequest);

      expect(ipcSpy).to.be.calledWith('cancel-request');
    });
  });
  describe('requestCancelled', () => {
    it('should store the received response in the store', () => {
      store.dispatch(Action.requestCancelled);
      expect(store.state.sendingInProgress).to.equal(false);
    });
  });
  describe('receiveResponse', () => {
    it('should store the received response in the store', () => {
      store.dispatch(Action.receiveResponse, { response: { body: '{"key": "value"}' } });
      expect(store.state.response).to.eql({ body: '{"key": "value"}' });
    });
    it('should store the actual request headers in the store', () => {
      store.dispatch(Action.receiveResponse, { requestHeaders: { 'x-my-header': 'some_value' } });
      expect(store.state.sentRequestHeaders).to.eql({ 'x-my-header': 'some_value' });
    });
    it('should indicate finished request', () => {
      const commit = sinon.spy();

      Actions[Action.receiveResponse]({ commit }, { response: {} });

      expect(commit).to.be.calledWithExactly(Mutation.REQUEST_FINISHED_OR_ABORTED);
    });
  });
  describe('selectAuthType', () => {
    it('should modify the selected auth type of the state', () => {
      const commit = sinon.spy();
      Actions[Action.selectAuthType]({ commit }, Auth.WSSE);
      expect(commit).to.be.calledWithExactly(Mutation.SELECT_AUTH_TYPE, Auth.WSSE);
    });
    it('should set auth params to their initial value', () => {
      const commit = sinon.spy();
      Actions[Action.selectAuthType]({ commit }, Auth.WSSE);
      expect(commit).to.be.calledWithExactly(Mutation.SET_AUTH_PARAMS, {});
    });
  });
  describe('selectHttpMethod', () => {
    it('should modify the selected http method of the state', () => {
      const commit = sinon.spy();
      Actions[Action.selectHttpMethod]({ commit }, HttpMethod.GET);
      expect(commit).to.be.calledWithExactly(Mutation.SELECT_HTTP_METHOD, HttpMethod.GET);
    });
  });
  describe('setAuthParams', () => {
    it('should modify the parameters of the auth', () => {
      const commit = sinon.spy();
      const wsseParams = { key: null, secret: null };
      Actions[Action.setAuthParams]({ commit }, wsseParams);
      expect(commit).to.be.calledWithExactly(Mutation.SET_AUTH_PARAMS, wsseParams);
    });
  });
  describe('setRequestBody', () => {
    it('should modify the request body', () => {
      const commit = sinon.spy();
      const requestBody = '{"foo":"bar"}';
      Actions[Action.setRequestBody]({ commit }, requestBody);
      expect(commit).to.be.calledWithExactly(Mutation.SET_REQUEST_BODY, requestBody);
    });
  });
  describe('selectContentType', () => {
    it('should modify the selected content type of the state', () => {
      const commit = sinon.spy();
      Actions[Action.selectContentType]({ commit, state: store.state }, ContentType.json);
      expect(commit).to.be.calledWithExactly(Mutation.SELECT_CONTENT_TYPE, ContentType.json);
    });
    it('should update the existing content type header', () => {
      const commit = sinon.spy();
      const expectedHeader = { name: 'content-type', value: ContentType.text, sendingStatus: true };

      Actions[Action.selectContentType]({ commit, state: store.state }, ContentType.text);

      expect(commit).to.be.calledWithExactly(Mutation.ADD_REQUEST_HEADER, expectedHeader);
    });
    it('should add a content type header if not exists', () => {
      store.commit(Mutation.SET_REQUEST_HEADERS, []);
      const commit = sinon.spy();
      const expectedHeader = { name: 'content-type', value: ContentType.text, sendingStatus: true };
      Actions[Action.selectContentType]({ commit, state: store.state }, ContentType.text);
      expect(commit).to.be.calledWithExactly(Mutation.ADD_REQUEST_HEADER, expectedHeader);
    });
    context('when selected content type is custom', () => {
      it('should not update the content type header', () => {
        const oldHeaders = clone(store.state.request.headers);
        store.dispatch(Action.selectContentType, ContentType.custom);
        expect(store.state.request.headers).to.eql(oldHeaders);
      });
      it('should not add the content type header', () => {
        store.commit(Mutation.SET_REQUEST_HEADERS, []);
        const oldHeaders = clone(store.state.request.headers);
        store.dispatch(Action.selectContentType, ContentType.custom);
        expect(store.state.request.headers).to.eql(oldHeaders);
      });
    });
  });
  describe('setRequestHeaders', () => {
    it('should set the request headers', () => {
      const commit = sinon.spy();
      const headers = [{ name: 'content-type', value: ContentType.json }, { name: 'accept', value: '*/*' }];
      Actions[Action.setRequestHeaders]({ commit }, headers);
      expect(commit).to.be.calledWithExactly(Mutation.SET_REQUEST_HEADERS, headers);
    });
  });
  describe('resetState', () => {
    it('should commit the RESET_STATE mutation', () => {
      const commit = sinon.spy();
      Actions[Action.resetState]({ commit });
      expect(commit).to.be.calledWithExactly(Mutation.RESET_STATE);
    });
  });
  describe('indicateFatalError', () => {
    it('should commit the SET_ERROR_MESSAGE mutation', () => {
      const { state } = store;
      const commit = sinon.spy();
      Actions[Action.indicateFatalError]({ commit, state }, 'error occurred');
      expect(commit).to.be.calledWithExactly(Mutation.SET_ERROR_MESSAGE, 'error occurred');
    });
    it('should commit the SET_ERROR_VISIBLE mutation', () => {
      const { state } = store;
      const commit = sinon.spy();
      Actions[Action.indicateFatalError]({ commit, state }, 'error occurred');
      expect(commit).to.be.calledWithExactly(Mutation.SET_ERROR_VISIBLE, true);
    });
    it('should commit the SET_ERROR_TIMEOUT_ID mutation with next setTimeout() ID', () => {
      const { state } = store;
      const commit = sinon.spy();
      const nextTimeoutID = setTimeout(() => {}) + 1;
      Actions[Action.indicateFatalError]({ commit, state }, 'error occurred');
      expect(commit).to.be.calledWithExactly(Mutation.SET_ERROR_TIMEOUT_ID, nextTimeoutID);
    });
    context('time sensitive tests', () => {
      const MS_IN_SECOND = 1000;

      let clock;

      beforeEach(() => {
        clock = sinon.useFakeTimers();
      });

      afterEach(() => {
        clock.restore();
      });

      it('should commit the SET_ERROR_VISIBLE mutation after 5 seconds', () => {
        store.dispatch(Action.indicateFatalError, 'error occurred');

        clock.tick(5 * MS_IN_SECOND);

        expect(store.state.error.visible).to.equal(false);
      });
      it('should delay the commit of SET_ERROR_VISIBLE mutation if action is called again', () => {
        store.dispatch(Action.indicateFatalError, 'error occurred');

        clock.tick(3 * MS_IN_SECOND);

        store.dispatch(Action.indicateFatalError, 'another error occurred');

        clock.tick(2 * MS_IN_SECOND);

        expect(store.state.error.visible).to.equal(true);

        clock.tick(5 * MS_IN_SECOND);

        expect(store.state.error.visible).to.equal(false);
      });
    });
    it('should commit the REQUEST_FINISHED_OR_ABORTED mutation', () => {
      const { state } = store;
      const commit = sinon.spy();
      Actions[Action.indicateFatalError]({ commit, state }, 'error occurred');
      expect(commit).to.be.calledWithExactly(Mutation.REQUEST_FINISHED_OR_ABORTED);
    });
  });
  describe('validateForms', () => {
    it('should remove all validator errors first', () => {
      store.commit(Mutation.ADD_VALIDATOR_ERROR, { type: 'url', message: 'URL cannot be empty' });
      store.commit(Mutation.UPDATE_URL, 'http://not-empty.url');

      store.dispatch(Action.validateForms);

      expect(store.state.validatorErrors).to.eql([]);
    });
    context('when url is empty', () => {
      it('should add an invalid url error', () => {
        store.dispatch(Action.validateForms);

        expect(store.state.validatorErrors).to.eql([{ type: 'url', message: 'URL cannot be empty' }]);
      });

      it('should display error messages', () => {
        store.dispatch(Action.validateForms);

        expect(store.state.error.message).to.equal('URL cannot be empty');
        expect(store.state.error.visible).to.equal(true);
      });
    });
    context('when url is not empty', () => {
      it('should not display error message', () => {
        store.commit(Mutation.UPDATE_URL, 'httpbin.org/anything');
        store.dispatch(Action.validateForms);

        expect(store.state.error.message).to.equal(null);
        expect(store.state.error.visible).to.equal(false);
      });
    });
  });
});
