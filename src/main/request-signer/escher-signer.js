/* eslint-disable */
import { clone, merge } from 'ramda';
import { URL } from 'url';

function headersWithHost({ url, headers }) {
  if ('host' in headers) {
    return headers;
  }

  const hostFromUrl = new URL(url).hostname;

  return merge(headers, { host: hostFromUrl });
}

export default class EscherSigner {
  signRequest(request) {
    const clonedRequest = clone(request);

    clonedRequest.headers = headersWithHost(request);

    return clonedRequest;
  }
}
