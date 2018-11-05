export default {
  validationError(headersArray) {
    if (headersArray.length > 0) {
      const headersWithoutName = headersArray.reduce((accumulator, header) => {
        if (header.sendingStatus && (!header.name || header.name.trim() === '')) {
          accumulator.push(header);
        }

        return accumulator;
      }, []);

      if (headersWithoutName.length > 0) {
        return { type: 'header', message: 'Header name cannot be empty' };
      }
    }

    return null;
  }
};
