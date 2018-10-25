import { clone } from 'ramda';
import { URL } from 'url';

function addHostHeader(request) {
  request.headers.host = new URL(request.url).hostname;
}

export default class EscherSigner {
  /* eslint-disable */
  signRequest(request) {
    const clonedRequest = clone(request);

    addHostHeader(clonedRequest);

    return clonedRequest;
  }
}
