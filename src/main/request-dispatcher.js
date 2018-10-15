import RestClient from './rest-client';
import RequestFactory from './request-factory';
import RequestSignerFactory from './request-signer/request-signer-factory';
import ResponseFormatter from './response-formatter';

export default {
  async handle(ipcEventArgs) {
    const request = RequestFactory.create(ipcEventArgs);

    const signer = RequestSignerFactory.create(ipcEventArgs.authType, ipcEventArgs.authParams);
    const signedRequest = signer.signRequest(request);

    const client = new RestClient();
    const response = await client.send(signedRequest);

    return ResponseFormatter.transform(response);
  }
};
