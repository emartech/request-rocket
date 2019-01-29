export default class RequestTerminator {
  constructor() {
    this.requestMap = {};
  }

  add(requestId, request) {
    this.requestMap[requestId] = request;
  }

  remove(requestId) {
    delete this.requestMap[requestId];
  }

  terminate(requestId) {
    if (this.requestMap[requestId]) {
      this.requestMap[requestId].abort();
    }
  }
}
