function convertToKeyValuePairs(headers) {
  return headers.reduce((accumulator, header) => {
    if (header.name in accumulator) {
      accumulator[header.name] += `,${header.value}`;
    } else {
      accumulator[header.name] = header.value;
    }

    return accumulator;
  }, {});
}

export default {
  create({ method, url, headers, body }) {
    return {
      method,
      url,
      headers: convertToKeyValuePairs(headers),
      data: body
    };
  }
};
