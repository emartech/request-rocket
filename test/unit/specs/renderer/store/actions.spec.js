import sinon from 'sinon';
import { ipcRenderer } from 'electron';
import { clone } from 'ramda';
import uuid from 'uuid';
import Action from '../../../../../src/renderer/store/action-types';
import Mutation from '../../../../../src/renderer/store/mutation-types';
import Actions from '../../../../../src/renderer/store/actions';
import createStore from '../../../../../src/renderer/store';
import HttpMethod from '../../../../../src/common/method-types';
import Auth from '../../../../../src/common/auth-types';
import ContentType from '../../../../../src/common/content-types';
import FileSaveResult from '../../../../../src/main/file-handler/file-save-result';

describe('actions', () => {
  let store;

  beforeEach(() => {
    store = createStore();
  });

  afterEach(() => {
    sinon.restore();
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

        expect(ipcSpy).to.be.calledWith(
          'send-request',
          sinon.match({ requestDetails: { url: 'https://request.url' } })
        );
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

        expect(ipcSpy).to.be.calledWith('send-request', sinon.match({ requestDetails: { method: HttpMethod.POST } }));
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

          expect(ipcSpy).to.be.calledWith('send-request', sinon.match({ requestDetails: { body: expectedBody } }));
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
          sinon.match({
            requestDetails: { headers: [{ name: 'content-type', value: 'application/json', sendingStatus: true }] }
          })
        );
      });

      it('should append a UUID to the request', () => {
        sinon.stub(uuid, 'v4').returns('some-random-generated-uuid');

        store.dispatch(Action.sendRequest);

        expect(ipcSpy).to.be.calledWith('send-request', sinon.match({ uuid: 'some-random-generated-uuid' }));
      });

      it('should store the request UUID on the state', () => {
        sinon.stub(uuid, 'v4').returns('some-random-generated-uuid');

        store.dispatch(Action.sendRequest);

        expect(store.state.uuid).to.eql('some-random-generated-uuid');
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

          expect(ipcSpy).to.be.calledWith(
            'send-request',
            sinon.match({ requestDetails: { url: 'http://request.url' } })
          );
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

  describe('clearErrors', () => {
    it('should commit the CLEAR_ERRORS mutation', () => {
      const commit = sinon.spy();
      Actions[Action.clearErrors]({ commit });
      expect(commit).to.be.calledWithExactly(Mutation.CLEAR_ERRORS);
    });
  });

  describe('indicateBackendError', () => {
    it('should commit the ADD_ERROR_MESSAGE mutation', () => {
      const { state } = store;
      const commit = sinon.spy();
      Actions[Action.indicateBackendError]({ commit, state }, 'error occurred');
      expect(commit).to.be.calledWithExactly(Mutation.ADD_ERROR_MESSAGE, 'error occurred');
    });

    it('should commit the REQUEST_FINISHED_OR_ABORTED mutation', () => {
      const { state } = store;
      const commit = sinon.spy();
      Actions[Action.indicateBackendError]({ commit, state }, 'error occurred');
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

        expect(store.state.validatorErrors).to.deep.include({ type: 'url', message: 'URL cannot be empty' });
      });

      it('should display error messages', () => {
        store.dispatch(Action.validateForms);

        expect(store.state.errors).to.include('URL cannot be empty');
      });
    });

    context('when url is not empty', () => {
      it('should not display error message', () => {
        store.commit(Mutation.UPDATE_URL, 'https://httpbin.org/anything');

        store.dispatch(Action.validateForms);

        expect(store.state.errors).not.to.include('URL cannot be empty');
      });
    });

    context('when header name is empty', () => {
      it('should add validator error to state', () => {
        store.commit(Mutation.ADD_REQUEST_HEADER, { name: '', value: 'some value', sendingStatus: true });

        store.dispatch(Action.validateForms);

        expect(store.state.validatorErrors).to.deep.include({ type: 'header', message: 'Header name cannot be empty' });
      });

      it('should display error message', () => {
        store.commit(Mutation.UPDATE_URL, 'https://httpbin.org/anything');
        store.commit(Mutation.ADD_REQUEST_HEADER, { name: '', value: 'some value', sendingStatus: true });

        store.dispatch(Action.validateForms);

        expect(store.state.errors).to.include('Header name cannot be empty');
      });

      context('and sending status is false', () => {
        it('should not add validator error to state', () => {
          store.commit(Mutation.ADD_REQUEST_HEADER, { name: '', value: 'some value', sendingStatus: false });

          store.dispatch(Action.validateForms);

          expect(store.state.validatorErrors).not.to.deep.include({
            type: 'header',
            message: 'Header name cannot be empty'
          });
        });
      });
    });

    context('when auth params are invalid', () => {
      it('should add validator error to the state', () => {
        store.commit(Mutation.SELECT_AUTH_TYPE, Auth.WSSE);

        store.dispatch(Action.validateForms);

        expect(store.state.validatorErrors).to.deep.include({
          type: 'auth',
          message: 'Auth parameters must be provided'
        });
      });

      it('should display error message', () => {
        store.commit(Mutation.SELECT_AUTH_TYPE, Auth.WSSE);

        store.dispatch(Action.validateForms);

        expect(store.state.errors).to.include('Auth parameters must be provided');
      });
    });

    context('when multiple validator errors happen', () => {
      it('should display error message', () => {
        store.commit(Mutation.ADD_REQUEST_HEADER, { name: '', value: 'some value', sendingStatus: true });

        store.dispatch(Action.validateForms);

        expect(store.state.errors).to.eql(['Header name cannot be empty', 'URL cannot be empty']);
      });
    });
  });

  describe('fileSaveResult', () => {
    it('should add cancelled info message when file save was cancelled', () => {
      store.dispatch(Action.fileSaveResult, FileSaveResult.fromCancelled());

      expect(store.state.infoMessage).to.be.eql('Save was cancelled.');
    });

    it('should add successful save info message when file save succeeded', () => {
      store.dispatch(Action.fileSaveResult, FileSaveResult.fromSuccess('filepath'));

      expect(store.state.infoMessage).to.be.eql('Request settings were saved to filepath.');
    });
  });

  describe('clearInfoMessage', () => {
    it('should reset info message in state', () => {
      store.commit(Mutation.ADD_INFO_MESSAGE, 'csira');

      expect(store.state.infoMessage).to.be.eql('csira');

      store.dispatch(Action.clearInfoMessage);

      expect(store.state.infoMessage).to.be.eql('');
    });
  });
});
