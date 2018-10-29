import { clone, merge } from 'ramda';
import { URL } from 'url';
import Escher from 'escher-auth';

function headersWithHost({ url, headers }) {
  if ('host' in headers) {
    return headers;
  }

  const hostFromUrl = new URL(url).hostname;

  return merge(headers, { host: hostFromUrl });
}

function objectToArrayOfArrays(headersObject) {
  return Object.keys(headersObject).reduce((accumulator, headerName) => {
    const headerValue = headersObject[headerName];

    accumulator.push([headerName, headerValue]);
    return accumulator;
  }, []);
}

function arrayOfArraysToObject(headersArray) {
  return headersArray.reduce((accumulator, header) => {
    const [name, value] = header;

    accumulator[name] = value;

    return accumulator;
  }, {});
}

function getUrlStartingFromPath(urlString) {
  const url = new URL(urlString);

  return `${url.pathname}${url.search}`;
}

function createEscherConfig(keyId, secret, credentialScope) {
  return {
    vendorKey: 'EMS',
    algoPrefix: 'EMS',
    hashAlgo: 'SHA256',
    authHeaderName: 'X-EMS-Auth',
    dateHeaderName: 'X-EMS-Date',
    accessKeyId: keyId,
    apiSecret: secret,
    credentialScope
  };
}

export default class EscherSigner {
  constructor({ key, secret, credentialScope }) {
    this.escher = new Escher(createEscherConfig(key, secret, credentialScope));
  }

  signRequest(request) {
    const clonedRequest = clone(request);

    clonedRequest.url = getUrlStartingFromPath(clonedRequest.url);
    clonedRequest.body = clonedRequest.data;
    delete clonedRequest.data;

    const headers = headersWithHost(request);
    clonedRequest.headers = objectToArrayOfArrays(headers);

    const signedRequest = this.escher.signRequest(clonedRequest, clonedRequest.body || '');

    signedRequest.url = request.url;
    signedRequest.data = signedRequest.body;

    delete signedRequest.body;

    signedRequest.headers = arrayOfArraysToObject(signedRequest.headers);

    return signedRequest;
  }
}
